# 11 · «Iniciar sesión con Google» para tus clientes

Al pulsar el icono de la personita (arriba a la derecha) se abre una ventana con **Iniciar sesión con Google**. El cliente entra con su cuenta de Google y:

- se crea (o se reutiliza) su **cuenta de cliente en WooCommerce** con su nombre y email de Google;
- ve su **perfil** en `/cuenta`: foto, nombre, email y **sus pedidos** con el estado;
- su **lista de deseos** se guarda en su cuenta y la ve en cualquier móvil u ordenador donde inicie sesión (lo que guardó antes de entrar se suma a la de la cuenta; al cerrar sesión desaparece de ese navegador);
- al pulsar **Finalizar compra** o **Comprar ahora** entra en el checkout **ya identificado**, y el pedido queda guardado en su cuenta.

En la vista previa (modo demo) el botón crea un **perfil de prueba** solo en ese navegador; no usa Google.

## Paso 1 · Crear el ID de cliente de Google (gratis, 10 minutos)

1. Entra en https://console.cloud.google.com/ con tu cuenta de Google y crea un proyecto (p. ej. «Ahorramix»).
2. Menú › **APIs y servicios › Pantalla de consentimiento de OAuth**: tipo **Externo**, nombre de la app «Ahorramix», email de soporte, logo (opcional), dominio `tudominio.es`, enlace a tu política de privacidad (`https://tudominio.es/legal/privacidad`). Publica la app (pasa de «Prueba» a «En producción»).
3. Menú › **APIs y servicios › Credenciales › Crear credenciales › ID de cliente de OAuth**:
   - Tipo de aplicación: **Aplicación web**.
   - **Orígenes de JavaScript autorizados**: añade `https://tudominio.es` y `https://www.tudominio.es` (las direcciones donde está tu tienda React).
   - URIs de redireccionamiento: no hace falta ninguno.
4. Copia el **ID de cliente** (termina en `.apps.googleusercontent.com`). No necesitas el «secreto de cliente».

## Paso 2 · Pegarlo en dos sitios

1. **Tienda** (`public_html/ahorramix-config.js`):
   ```js
   googleClientId: "TU_ID.apps.googleusercontent.com",
   ```
2. **WordPress** (`wp-config.php` de `tienda.tudominio.es`, encima de «That's all, stop editing!»):
   ```php
   define( 'AHORRAMIX_GOOGLE_CLIENT_ID', 'TU_ID.apps.googleusercontent.com' );
   ```
   Asegúrate de tener también `AHORRAMIX_FRONTEND_ORIGINS` con tu dominio (paso 4 del `LEEME.md`) y el plugin **Ahorramix Bridge 1.1.0** o superior activado.

## Paso 3 · Probar

1. Abre tu tienda en una ventana normal, pulsa la personita › **Iniciar sesión con Google** › elige tu cuenta.
2. Debes ver tu nombre y foto en `/cuenta`. En WordPress › Usuarios aparece el nuevo cliente.
3. Añade un producto, pulsa **Finalizar compra**: el checkout de WooCommerce debe mostrar tu sesión iniciada.

## Seguridad y notas

- El plugin comprueba con Google cada inicio de sesión (que el token es de tu ID de cliente, no ha caducado y el email está verificado).
- La sesión dura 30 días; «Cerrar sesión» la invalida. Se guarda en el navegador del cliente.
- Las cuentas con permisos de administración o edición **no** pueden entrar desde la tienda (deben usar el panel de WordPress).
- Los pedidos hechos antes como invitado con el mismo email también aparecen en «Mis pedidos».
- Las direcciones y datos de facturación se gestionan en el enlace «Gestionar direcciones…» del perfil (página de cuenta de WooCommerce).
- Este código no se ha podido probar en un WordPress real desde Emergent: haz la prueba del paso 3 antes de abrir al público.

### Problemas frecuentes

| Síntoma | Solución |
|---|---|
| El botón de Google no aparece o dice «origin not allowed» | Añade exactamente tu dominio (con `https://`, con y sin `www`) en «Orígenes de JavaScript autorizados». Los cambios tardan unos minutos. |
| «El inicio de sesión con Google no está configurado» | Falta `AHORRAMIX_GOOGLE_CLIENT_ID` en `wp-config.php`. |
| «No hemos podido verificar tu cuenta de Google» | El ID de `ahorramix-config.js` y el de `wp-config.php` no coinciden. |
| Error de conexión / CORS | Revisa `AHORRAMIX_FRONTEND_ORIGINS` y que el plugin esté activo. |
