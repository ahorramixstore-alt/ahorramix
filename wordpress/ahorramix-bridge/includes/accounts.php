<?php
/**
 * Ahorramix Bridge · Cuentas de cliente con «Iniciar sesión con Google».
 * Requiere en wp-config.php:  define( 'AHORRAMIX_GOOGLE_CLIENT_ID', 'xxxx.apps.googleusercontent.com' );
 * Endpoints (/wp-json/ahorramix/v1): POST auth/google, GET me, POST auth/logout, POST auth/handoff.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const AHORRAMIX_TOKEN_META = '_ahorramix_tokens';
const AHORRAMIX_TOKEN_TTL  = 30 * DAY_IN_SECONDS;

function ahorramix_token_hash( $secret ) {
	return hash_hmac( 'sha256', $secret, wp_salt( 'auth' ) );
}

function ahorramix_issue_token( $user_id ) {
	$secret = wp_generate_password( 40, false, false );
	$tokens = array_filter( (array) get_user_meta( $user_id, AHORRAMIX_TOKEN_META, true ), function ( $exp ) {
		return $exp > time();
	} );
	$tokens[ ahorramix_token_hash( $secret ) ] = time() + AHORRAMIX_TOKEN_TTL;
	update_user_meta( $user_id, AHORRAMIX_TOKEN_META, array_slice( $tokens, -10, null, true ) );
	return $user_id . '.' . $secret;
}

/** Devuelve [user_id, hash] si el token de la petición es válido, o null. */
function ahorramix_token_user( WP_REST_Request $request ) {
	$raw = (string) $request->get_header( 'x_ahorramix_token' );
	if ( ! preg_match( '/^(\d+)\.([A-Za-z0-9]{40})$/', $raw, $m ) ) {
		return null;
	}
	$tokens = (array) get_user_meta( (int) $m[1], AHORRAMIX_TOKEN_META, true );
	$hash   = ahorramix_token_hash( $m[2] );
	foreach ( $tokens as $stored => $exp ) {
		if ( hash_equals( (string) $stored, $hash ) && $exp > time() ) {
			return array( (int) $m[1], $hash );
		}
	}
	return null;
}

function ahorramix_verify_google( $credential ) {
	if ( ! defined( 'AHORRAMIX_GOOGLE_CLIENT_ID' ) || ! AHORRAMIX_GOOGLE_CLIENT_ID ) {
		return new WP_Error( 'ahorramix_google_off', 'El inicio de sesión con Google no está configurado.', array( 'status' => 503 ) );
	}
	$res = wp_remote_get( 'https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode( $credential ), array( 'timeout' => 8 ) );
	$data = is_wp_error( $res ) ? null : json_decode( wp_remote_retrieve_body( $res ), true );
	$ok = is_array( $data )
		&& 200 === wp_remote_retrieve_response_code( $res )
		&& ( $data['aud'] ?? '' ) === AHORRAMIX_GOOGLE_CLIENT_ID
		&& in_array( $data['iss'] ?? '', array( 'accounts.google.com', 'https://accounts.google.com' ), true )
		&& (int) ( $data['exp'] ?? 0 ) > time()
		&& 'true' === (string) ( $data['email_verified'] ?? '' )
		&& is_email( $data['email'] ?? '' );
	return $ok ? $data : new WP_Error( 'ahorramix_google_invalid', 'No hemos podido verificar tu cuenta de Google.', array( 'status' => 401 ) );
}

function ahorramix_find_or_create_customer( $g ) {
	$email = sanitize_email( $g['email'] );
	$user  = get_user_by( 'email', $email );
	if ( $user ) {
		// Seguridad: las cuentas de administración no inician sesión desde la tienda.
		if ( user_can( $user, 'edit_posts' ) ) {
			return new WP_Error( 'ahorramix_staff', 'Esta cuenta es de administración. Accede desde el panel de WordPress.', array( 'status' => 403 ) );
		}
	} else {
		$args = array(
			'first_name' => sanitize_text_field( $g['given_name'] ?? '' ),
			'last_name'  => sanitize_text_field( $g['family_name'] ?? '' ),
		);
		$id = wc_create_new_customer( $email, wc_create_new_customer_username( $email, $args ), wp_generate_password( 24 ), $args );
		if ( is_wp_error( $id ) ) {
			return $id;
		}
		$user = get_user_by( 'id', $id );
	}
	update_user_meta( $user->ID, '_ahorramix_google_sub', sanitize_text_field( $g['sub'] ?? '' ) );
	if ( ! empty( $g['picture'] ) ) {
		update_user_meta( $user->ID, '_ahorramix_google_picture', esc_url_raw( $g['picture'] ) );
	}
	return $user;
}

function ahorramix_profile( WP_User $user ) {
	$customer = new WC_Customer( $user->ID );
	$orders   = wc_get_orders( array( 'customer' => $user->ID, 'limit' => 20, 'orderby' => 'date', 'order' => 'DESC' ) );
	$guest    = wc_get_orders( array( 'billing_email' => $user->user_email, 'customer_id' => 0, 'limit' => 20 ) );
	$list     = array();
	foreach ( array_merge( $orders, $guest ) as $o ) {
		$list[ $o->get_id() ] = array(
			'number' => $o->get_order_number(),
			'date'   => wc_format_datetime( $o->get_date_created() ),
			'status' => wc_get_order_status_name( $o->get_status() ),
			'total'  => (float) $o->get_total(),
			'url'    => $o->get_customer_id() === $user->ID ? $o->get_view_order_url() : '',
		);
	}
	$first = $customer->get_first_name() ?: $user->first_name;
	return array(
		'name'      => trim( $first . ' ' . ( $customer->get_last_name() ?: $user->last_name ) ) ?: $user->display_name,
		'firstName' => $first,
		'email'     => $user->user_email,
		'avatar'    => (string) get_user_meta( $user->ID, '_ahorramix_google_picture', true ),
		'orders'    => array_values( $list ),
	);
}

add_action( 'rest_api_init', function () {
	$ns = 'ahorramix/v1';

	register_rest_route( $ns, '/auth/google', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $r ) {
			$g = ahorramix_verify_google( (string) $r->get_param( 'credential' ) );
			if ( is_wp_error( $g ) ) {
				return $g;
			}
			$user = ahorramix_find_or_create_customer( $g );
			if ( is_wp_error( $user ) ) {
				return $user;
			}
			return array( 'token' => ahorramix_issue_token( $user->ID ), 'user' => ahorramix_profile( $user ) );
		},
	) );

	$auth = function ( WP_REST_Request $r ) {
		return ahorramix_token_user( $r ) ? true : new WP_Error( 'ahorramix_session', 'Tu sesión ha caducado. Vuelve a iniciar sesión.', array( 'status' => 401 ) );
	};

	register_rest_route( $ns, '/me', array(
		'methods'             => 'GET',
		'permission_callback' => $auth,
		'callback'            => function ( WP_REST_Request $r ) {
			list( $id ) = ahorramix_token_user( $r );
			return ahorramix_profile( get_user_by( 'id', $id ) );
		},
	) );

	register_rest_route( $ns, '/auth/logout', array(
		'methods'             => 'POST',
		'permission_callback' => $auth,
		'callback'            => function ( WP_REST_Request $r ) {
			list( $id, $hash ) = ahorramix_token_user( $r );
			$tokens = (array) get_user_meta( $id, AHORRAMIX_TOKEN_META, true );
			unset( $tokens[ $hash ] );
			update_user_meta( $id, AHORRAMIX_TOKEN_META, $tokens );
			return array( 'ok' => true );
		},
	) );

	// Código de un solo uso (2 min) para entrar ya identificado en el checkout de WooCommerce.
	register_rest_route( $ns, '/auth/handoff', array(
		'methods'             => 'POST',
		'permission_callback' => $auth,
		'callback'            => function ( WP_REST_Request $r ) {
			list( $id ) = ahorramix_token_user( $r );
			$code = wp_generate_password( 32, false, false );
			set_transient( 'ahorramix_sso_' . ahorramix_token_hash( $code ), $id, 2 * MINUTE_IN_SECONDS );
			return array( 'code' => $code );
		},
	) );
} );

// /?ahorramix_cart=...&ahorramix_sso=CODIGO → inicia sesión y repite la URL sin el código.
add_action( 'template_redirect', function () {
	if ( empty( $_GET['ahorramix_sso'] ) ) {
		return;
	}
	$code = sanitize_text_field( wp_unslash( $_GET['ahorramix_sso'] ) );
	$key  = 'ahorramix_sso_' . ahorramix_token_hash( $code );
	$id   = (int) get_transient( $key );
	delete_transient( $key );
	if ( $id && ! user_can( $id, 'edit_posts' ) ) {
		wp_set_current_user( $id );
		wp_set_auth_cookie( $id, true, is_ssl() );
	}
	wp_safe_redirect( remove_query_arg( 'ahorramix_sso' ) );
	exit;
}, 1 );
