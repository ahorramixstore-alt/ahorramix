# 03 · Integración con WordPress y WooCommerce

## 1. Instalar en WordPress

1. WordPress actualizado + **WooCommerce** (gratuito).
2. WooCommerce › Ajustes › General: país **España**, moneda **Euro (€)**.
3. WooCommerce › Ajustes › Impuestos: activa impuestos, **«Sí, introduciré precios con impuestos incluidos»**, y crea la tarifa estándar (21 % para ES, revisa Canarias/Ceuta/Melilla con tu asesor).
4. Enlaces permanentes: «Nombre de la entrada» (necesario para `/wp-json/`).
5. Sube `wordpress/ahorramix-bridge/` como plugin (zip) y actívalo.
6. En `wp-config.php` añade:
   ```php
   define( 'AHORRAMIX_FRONTEND_ORIGINS', 'https://tudominio.es,https://www.tudominio.es' );
   ```

## 2. Conectar el frontend

En `frontend/.env` antes de `yarn build`:

```
REACT_APP_COMMERCE_MODE=woocommerce
REACT_APP_WC_STORE_URL=https://tienda.tudominio.es
REACT_APP_SITE_URL=https://tudominio.es
REACT_APP_SHOW_EVALUATOR=false
```

Comprueba que responde: `https://tienda.tudominio.es/wp-json/wc/store/v1/products` debe devolver JSON.

## 3. Cómo se mapean los datos

| En la tienda React | En WooCommerce |
|---|---|
| Categorías y subcategorías | Productos › Categorías (categoría padre = subcategoría) |
| Menú principal | `NAV_CATEGORIES` en `frontend/src/config/store.js` (slugs de categorías) |
| Destacados / Más vendidos / Novedades | Etiquetas de producto con slug `destacado`, `mas-vendido`, `novedad` |
| Ofertas | Productos con «Precio rebajado» |
| Variantes (talla, color, modelo) | Producto variable con atributos «usados para variaciones» |
| Galería | Imagen principal + galería del producto (rellena el texto alternativo) |
| Stock / agotado | Inventario del producto (o sincronizado por plugin de proveedor) |
| Descripción | Descripción larga; la corta se usa como resumen y metadescripción |

## 4. Datos internos del proveedor

El CSV del evaluador crea metadatos **privados** (no salen en la Store API pública):

`_ahorramix_supplier_name`, `_ahorramix_supplier_product_id`, `_ahorramix_supplier_url`, `_ahorramix_cost_price`, `_ahorramix_supplier_shipping`, `_ahorramix_delivery_time`.

Los ves en el producto › «Campos personalizados» (actívalo en Opciones de pantalla). El margen se calcula en el evaluador. Si quieres mostrar el plazo de entrega en la ficha pública, añade un atributo visible o usa un plugin de plazos de entrega y amplía `mapProduct` en `woocommerce.js`.

## 5. Importar productos desde el evaluador

1. Abre `/evaluador` (solo en tu entorno con `REACT_APP_SHOW_EVALUATOR=true`).
2. Guarda candidatos, selecciónalos y pulsa **Exportar CSV para WooCommerce**.
3. WordPress › Productos › Importar › sube el CSV › mapea columnas (se reconocen automáticamente) › Ejecutar.
4. Los productos entran como **borrador**: revisa textos, imágenes y precios y publícalos tú.

## 6. Checkout, cuenta y pedidos

- «Finalizar compra» redirige a `tienda.tudominio.es/?ahorramix_cart=ID:CANT,...`; el plugin vacía el carrito de WooCommerce, añade los productos y abre el checkout. WooCommerce recalcula precios, impuestos y envío con sus datos, así que el navegador no puede alterar precios.
- Cupones: se aplican en el checkout de WooCommerce.
- «Mi cuenta» redirige a la página Mi cuenta de WooCommerce (pedidos, direcciones, seguimiento).
- Correos de confirmación y estados de pedido: WooCommerce › Ajustes › Correos electrónicos.

## 7. Dar el mismo aspecto al checkout

En WordPress usa un tema ligero (p. ej. Storefront o el tema de bloques por defecto) y ajusta: logo (`frontend/public/favicon.svg`), colores `#0E1015`, `#0F5A47`, `#FBFBF9`, tipografías Cabinet Grotesk / Satoshi (Fontshare).
