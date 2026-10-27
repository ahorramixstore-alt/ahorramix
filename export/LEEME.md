# Ahorramix · Paquete para Hostinger

Esta carpeta contiene lo que tienes que subir. **No necesitas instalar nada en tu ordenador.**

| Archivo | Qué es | Dónde va |
|---|---|---|
| `ahorramix-tienda-hostinger.zip` | La tienda (diseño, páginas, carrito, vídeo, imágenes, `.htaccess`) | `public_html` de tu dominio principal |
| `ahorramix-bridge.zip` | Plugin que conecta la tienda con WooCommerce (catálogo, checkout, cuenta, sitemap) | WordPress › Plugins › Añadir nuevo › Subir plugin |

## Paso a paso

1. **Hostinger › Dominios**: conecta tu dominio y activa el **SSL** (hPanel › Seguridad › SSL).
2. **Crea el subdominio** `tienda.tudominio.es` (hPanel › Dominios › Subdominios).
3. **Instala WordPress** en `tienda.tudominio.es` (hPanel › Sitio web › Instalador automático) y añade **WooCommerce**.
   - WooCommerce › Ajustes › General: España, Euro.
   - Impuestos: activados, «precios con impuestos incluidos», tarifa estándar del 21 % (revisa Canarias, Ceuta y Melilla con tu asesor).
   - Ajustes › Enlaces permanentes: «Nombre de la entrada».
4. **Sube el plugin** `ahorramix-bridge.zip` y actívalo. En `wp-config.php` (Administrador de archivos), encima de «That's all, stop editing!», añade:
   ```php
   define( 'AHORRAMIX_FRONTEND_ORIGINS', 'https://tudominio.es,https://www.tudominio.es' );
   define( 'AHORRAMIX_SITE_URL', 'https://tudominio.es' );
   ```
5. **Sube la tienda**: Administrador de archivos › `public_html` del dominio principal › sube `ahorramix-tienda-hostinger.zip` › clic derecho › **Extraer** (los archivos deben quedar directamente en `public_html`, no dentro de una subcarpeta). Borra el zip después.
6. **Conecta la tienda con WooCommerce**: edita `public_html/ahorramix-config.js` (cambia solo estas líneas):
   ```js
   window.AHORRAMIX_CONFIG = {
     commerceMode: "woocommerce",
     wcStoreUrl: "https://tienda.tudominio.es",
     siteUrl: "https://tudominio.es",
   };
   ```
   Guarda y recarga la web: los productos de ejemplo desaparecen y se muestran los de WooCommerce.
   Opcional en el mismo archivo: `newsletterAction` (URL del formulario de tu herramienta de email) y `trackingUrl` (página de seguimiento de tu plugin).
7. **Sitemap**: edita `public_html/robots.txt` y añade al final:
   `Sitemap: https://tienda.tudominio.es/?ahorramix_sitemap=1`
   Se actualiza solo con cada producto. Envíalo en Google Search Console.
   **Vista previa al compartir (WhatsApp, Facebook, X)**: edita `public_html/index.html`, busca las dos veces que aparece `/images/brand/og-ahorramix.jpg` y pon delante tu dominio para que quede `https://tudominio.es/images/brand/og-ahorramix.jpg`. WhatsApp necesita la dirección completa para mostrar el logo. Compruébalo en https://developers.facebook.com/tools/debug/ (la vista previa de WhatsApp puede tardar en actualizarse).
   **Vista previa de cada producto**: ya viene incluida (`share.php` + `.htaccess`). Cuando alguien comparte `https://tudominio.es/producto/...`, WhatsApp y las redes muestran la foto, el nombre y el precio de ese producto, leídos de WooCommerce. Solo funciona con `commerceMode: "woocommerce"`; en modo demo se muestra el logo.
8. **Código de bienvenida**: la tienda muestra un aviso con el código `BIENVENIDA10` (10 %) a los 8 segundos de la primera visita. Créalo igual en WordPress › Marketing › Cupones › Añadir cupón: código `BIENVENIDA10`, tipo «Descuento en porcentaje», importe `10`, y en «Restricciones de uso» › «Límite de uso por usuario» pon `1`. Para cambiar el código, el descuento o los segundos, edita `welcomeCode`, `welcomeDiscount` y `welcomeDelaySeconds` en `ahorramix-config.js` (deja `welcomeCode: ""` para desactivarlo). Si configuras `newsletterAction`, el aviso pide el email antes de mostrar el código.
9. **Iniciar sesión con Google** (opcional): crea tu ID de cliente de Google y pégalo en `ahorramix-config.js` (`googleClientId`) y en `wp-config.php` (`AHORRAMIX_GOOGLE_CLIENT_ID`). Pasos detallados en `docs/11-LOGIN-GOOGLE.md`. Mientras esté vacío, la ventanita de la cuenta indica que estará disponible pronto.
10. **Pagos, envíos y correos** en WooCommerce (ver `docs/06-INTEGRACIONES-PENDIENTES.md`).
11. **Prueba una compra completa en modo test** (ver `docs/07-PRUEBAS.md`) antes de abrir al público.

## Cambios de diseño o textos

Logotipo, textos legales, datos del vendedor, banners y avisos se cambian en el código (`frontend/src/config/…`, `frontend/src/data/…`) y se vuelve a generar el paquete con `yarn export:hostinger` (desde Emergent o desde un ordenador con Node 20). Después vuelve a subir y extraer el zip, **conservando tu `ahorramix-config.js`** (haz una copia antes de sobrescribir).
