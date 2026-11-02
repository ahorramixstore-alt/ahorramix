# Conectar la tienda Ahorramix con tu WooCommerce de ahorramix.com

Resultado: `https://ahorramix.com` muestra la tienda con el diseño de Emergent y los productos reales de WooCommerce. WordPress sigue funcionando en el mismo dominio para `/wp-admin/`, `/wp-json/`, el pago (`/finalizar-compra/`) y la cuenta (`/mi-cuenta/`). Los pedidos se gestionan en WooCommerce › Pedidos.

No se modifica ningún archivo de WordPress ni de WooCommerce. Solo se **añade** un bloque al principio de `.htaccess`, que se puede quitar en cualquier momento.

## Qué impedía la conexión

1. **La portada la servía WordPress.** La tienda y WordPress comparten `public_html`, y el servidor abre primero `index.php` (WordPress) y aplica las reglas de WordPress a `/tienda` y `/producto/...`. La tienda React solo se veía en `/index.html`.
2. **El archivo de ajustes estaba en caché 7 días.** Por eso tu navegador seguía usando el `ahorramix-config.js` antiguo, que apuntaba a `tienda.ahorramix.com` (un WordPress sin productos). Desde esta versión, la tienda lo pide siempre con una marca de tiempo y la regla A de abajo impide que se guarde en caché.
3. **La copia de Emergent está en modo demo a propósito.** Siempre mostrará productos de ejemplo. La tienda real es la de `ahorramix.com`.

## Paso 1 · Copia de seguridad (1 minuto)

hPanel › Sitios web › ahorramix.com › **Administrador de archivos** › `public_html`:
- Descarga `.htaccess` a tu ordenador (clic derecho › Descargar). Si no lo ves, activa «Mostrar archivos ocultos».
- Descarga también tu `ahorramix-config.js`.

## Paso 2 · Subir la nueva versión de la tienda

1. Sube `ahorramix-tienda-hostinger.zip` a `public_html` y **extrae** (acepta sobrescribir).
2. Este ZIP **no** trae `.htaccess` ni `ahorramix-config.js`, así que no pisa tus reglas de WordPress ni tus ajustes. Tampoco toca `index.php`, `wp-admin`, `wp-content` ni `wp-includes`.
3. Comprueba que `ahorramix-config.js` dice:
   ```js
   commerceMode: "woocommerce",
   wcStoreUrl: "https://ahorramix.com",
   siteUrl: "https://ahorramix.com",
   ```

## Paso 3 · Añadir las reglas al principio de `.htaccess`

1. Abre `public_html/.htaccess` (clic derecho › Editar).
2. Pon el cursor en la **línea 1**, antes de `# BEGIN LSCACHE` y de `# BEGIN WordPress`.
3. Pega **todo** el contenido de `HTACCESS-AHORRAMIX.txt` (desde `# BEGIN Ahorramix` hasta `# END Ahorramix`) y guarda.
4. **No borres ni cambies nada más.** Los bloques de LiteSpeed y de WordPress quedan debajo tal cual.

Qué hace cada regla:

| Regla | Qué hace |
|---|---|
| A | `ahorramix-config.js` nunca se guarda en caché: tus cambios se ven al momento. |
| B | Solo los robots de WhatsApp, Facebook, X, Telegram, etc. que leen `/producto/...` reciben `share.php` (foto, nombre y precio). Las personas no pasan por aquí. |
| C | Si la dirección lleva parámetros de WordPress o WooCommerce (`?ahorramix_cart=`, `?wc-ajax=`, `?s=`, `?p=`, `?add-to-cart=`, vistas previas…), se saltan las reglas D y E y responde WordPress. Así siguen funcionando el paso del carrito al pago, las búsquedas y las vistas previas del panel. |
| D | La portada `https://ahorramix.com/` muestra la tienda. |
| E | Solo estas páginas van a la tienda: `/tienda`, `/categoria/...`, `/producto/...`, `/carrito`, `/cuenta`, `/lista-de-deseos`, `/seguimiento`, `/preguntas-frecuentes`, `/contacto`, `/sobre-nosotros` y `/legal/...`. Todo lo demás (`/wp-admin/`, `/wp-json/`, `/wp-login.php`, `/finalizar-compra/`, `/mi-cuenta/`, `/wp-content/`…) sigue en WordPress sin cambios. |

Nota: las páginas de WooCommerce `/tienda/`, `/producto/...` y `/carrito/` pasan a mostrarse con el diseño de Ahorramix. Es lo que buscamos. El pago y la cuenta siguen siendo los de WooCommerce.

## Paso 4 · Vaciar cachés

- WordPress › **LiteSpeed Cache › Purgar todo**.
- hPanel › **Rendimiento › CDN › Purgar caché** (si tienes la CDN activada).
- En tu navegador, abre `https://ahorramix.com` en una ventana nueva.

## Paso 5 · Comprobar

1. `https://ahorramix.com` muestra la portada de Ahorramix, sin la franja «Modo demostración».
2. `https://ahorramix.com/tienda` muestra tus productos de WooCommerce.
3. Abre un producto, pulsa **Añadir al carrito** y luego **Finalizar compra**: debes llegar a `https://ahorramix.com/finalizar-compra/` con el producto ya en el carrito.
4. `https://ahorramix.com/wp-admin/` abre el panel de WordPress con normalidad.
5. Haz un pedido de prueba y comprueba que aparece en WooCommerce › Pedidos.

## Cómo deshacerlo

Borra en `.htaccess` desde `# BEGIN Ahorramix` hasta `# END Ahorramix` (o sube la copia del paso 1) y purga la caché de LiteSpeed. WordPress vuelve a mostrarse en la portada.

## Preparar el catálogo en WooCommerce

Todo se gestiona en WooCommerce, sin tocar código:
- **Precio y oferta**: «Precio normal» y «Precio rebajado». Con precio rebajado, la tienda muestra el descuento y el producto aparece en Ofertas.
- **Disponibilidad**: pestaña Inventario › Estado del inventario («Hay existencias» / «Agotado»).
- **Imágenes**: «Imagen del producto» y «Galería». Mientras un producto no tenga foto, se muestra el logo de Ahorramix en gris.
- **Etiquetas para la portada** (opcional): `destacado` (Productos destacados), `mas-vendido` (Más vendidos) y `novedad` (Novedades). Sin etiquetas, esas pestañas muestran los últimos productos publicados.
- **Categorías** (Productos › Categorías). Para que el menú quede como en el diseño, crea las categorías principales con estos **slugs** exactos; las subcategorías puedes crearlas dentro de cada una:

| Nombre | Slug |
|---|---|
| Hogar y cocina | `hogar` |
| Electrónica | `tecnologia` |
| Informática y oficina | `informatica-oficina` |
| Moda | `moda` |
| Belleza y bienestar | `bienestar` |
| Deportes y aire libre | `deportes` |
| Mascotas | `mascotas` |
| Bebé e infantil | `bebe-infantil` |
| Jardín y bricolaje | `jardin-bricolaje` |
| Coche y moto | `coche-moto` |
| Viaje y equipaje | `viaje` |

Ahora mismo tu WooCommerce tiene 1 producto («Producto de prueba Ahorramix.», 999 €, sin foto) en «Sin categorizar». Es lo que verás hasta que añadas tus productos.

## Seguridad

- La tienda solo lee la API pública de productos (`/wp-json/wc/store/v1`). No usa ni necesita claves REST, contraseñas ni secretos. No pongas ninguno en `ahorramix-config.js`.
- El pago, los impuestos, el envío, los cupones y los pedidos los calcula y guarda WooCommerce.
- `tienda.ahorramix.com` ya no se usa. No hace falta borrarlo.
