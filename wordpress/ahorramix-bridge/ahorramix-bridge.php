<?php
/**
 * Plugin Name: Ahorramix Bridge
 * Description: Conecta el frontend React de Ahorramix con WooCommerce: permite la lectura de la Store API desde el dominio del frontend (CORS) y traspasa el carrito al checkout de WooCommerce.
 * Version: 1.1.0
 * Requires Plugins: woocommerce
 * License: GPL-2.0-or-later
 *
 * Configuración en wp-config.php (encima de "That's all, stop editing!"):
 *   define( 'AHORRAMIX_FRONTEND_ORIGINS', 'https://tudominio.es,https://www.tudominio.es' );
 *   define( 'AHORRAMIX_SITE_URL', 'https://tudominio.es' );   // para el sitemap dinámico
 *   define( 'AHORRAMIX_GOOGLE_CLIENT_ID', 'xxxx.apps.googleusercontent.com' );   // «Iniciar sesión con Google» (ver docs/11-LOGIN-GOOGLE.md)
 *
 * NOTA: este archivo no se ha podido probar en una instalación real de WordPress desde Emergent.
 * Pruébalo primero en un entorno de staging de Hostinger (ver docs/07-PRUEBAS.md).
 */

if ( ! defined( 'ABSPATH' ) ) {
        exit;
}

function ahorramix_allowed_origins() {
        $raw = defined( 'AHORRAMIX_FRONTEND_ORIGINS' ) ? AHORRAMIX_FRONTEND_ORIGINS : '';
        return array_filter( array_map( 'trim', explode( ',', $raw ) ) );
}

// CORS de solo lectura para la Store API pública (/wp-json/wc/store/...).
add_filter( 'rest_pre_serve_request', function ( $served, $result, $request ) {
        $origin = get_http_origin();
        if ( $origin && strpos( $request->get_route(), '/wc/store/' ) === 0 && in_array( $origin, ahorramix_allowed_origins(), true ) ) {
                header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
                header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
                header( 'Vary: Origin' );
        }
        return $served;
}, 20, 3 );

// CORS para las cuentas de cliente (/wp-json/ahorramix/v1/...).
add_filter( 'rest_pre_serve_request', function ( $served, $result, $request ) {
        $origin = get_http_origin();
        if ( $origin && strpos( $request->get_route(), '/ahorramix/' ) === 0 && in_array( $origin, ahorramix_allowed_origins(), true ) ) {
                header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
                header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
                header( 'Access-Control-Allow-Headers: Content-Type, X-Ahorramix-Token' );
                header( 'Vary: Origin' );
        }
        return $served;
}, 20, 3 );

require_once __DIR__ . '/includes/accounts.php';


// Traspaso del carrito: /?ahorramix_cart=ID:CANTIDAD,ID:CANTIDAD  (ID de producto simple o de variación).
// Atajo a la cuenta: /?ahorramix_go=account
add_action( 'template_redirect', function () {
        if ( ! function_exists( 'WC' ) ) {
                return;
        }

        if ( isset( $_GET['ahorramix_go'] ) && 'account' === $_GET['ahorramix_go'] ) {
                wp_safe_redirect( wc_get_page_permalink( 'myaccount' ) );
                exit;
        }

        if ( empty( $_GET['ahorramix_cart'] ) ) {
                return;
        }

        if ( is_null( WC()->cart ) ) {
                wc_load_cart();
        }

        $raw = sanitize_text_field( wp_unslash( $_GET['ahorramix_cart'] ) );
        WC()->cart->empty_cart();

        foreach ( array_slice( explode( ',', $raw ), 0, 50 ) as $pair ) {
                $parts = array_map( 'absint', explode( ':', $pair ) );
                $id    = $parts[0] ?? 0;
                $qty   = min( 99, max( 1, $parts[1] ?? 1 ) );
                $product = $id ? wc_get_product( $id ) : null;

                if ( ! $product || ! $product->is_purchasable() || ! $product->is_in_stock() ) {
                        continue;
                }

                if ( $product->is_type( 'variation' ) ) {
                        WC()->cart->add_to_cart( $product->get_parent_id(), $qty, $id, $product->get_variation_attributes() );
                } else {
                        WC()->cart->add_to_cart( $id, $qty );
                }
        }

        // WooCommerce recalcula precios, impuestos, envío y cupones con sus propios datos.
        wp_safe_redirect( wc_get_checkout_url() );
        exit;
} );

// Sitemap dinámico con las URLs del frontend React: /?ahorramix_sitemap=1  (siempre actualizado)
add_action( 'template_redirect', function () {
        if ( empty( $_GET['ahorramix_sitemap'] ) || ! defined( 'AHORRAMIX_SITE_URL' ) ) {
                return;
        }
        $site  = untrailingslashit( AHORRAMIX_SITE_URL );
        $paths = array( '/', '/tienda', '/preguntas-frecuentes', '/contacto', '/sobre-nosotros', '/legal/aviso-legal', '/legal/privacidad', '/legal/cookies', '/legal/condiciones', '/legal/envios', '/legal/devoluciones' );

        $terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => true ) );
        if ( ! is_wp_error( $terms ) ) {
                foreach ( $terms as $term ) {
                        $paths[] = '/categoria/' . $term->slug;
                }
        }

        $ids = get_posts( array(
                'post_type'   => 'product',
                'post_status' => 'publish',
                'numberposts' => -1,
                'fields'      => 'ids',
                'tax_query'   => array( array( 'taxonomy' => 'product_visibility', 'field' => 'name', 'terms' => array( 'exclude-from-catalog' ), 'operator' => 'NOT IN' ) ),
        ) );
        foreach ( $ids as $id ) {
                $paths[] = '/producto/' . get_post_field( 'post_name', $id );
        }

        header( 'Content-Type: application/xml; charset=UTF-8' );
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ( array_unique( $paths ) as $path ) {
                echo '  <url><loc>' . esc_url( $site . $path ) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
        exit;
} );
