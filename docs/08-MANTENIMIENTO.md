# 08 · Mantenimiento tras la migración

## Tareas habituales

| Tarea | Dónde | ¿Requiere recompilar React? |
|---|---|---|
| Añadir/editar productos, precios, stock, ofertas | WooCommerce | No |
| Crear categorías nuevas | WooCommerce | No (aparecen solas). Para el menú: editar `NAV_CATEGORIES` y recompilar |
| Marcar destacados / novedades | Etiquetas `destacado`, `novedad`, `mas-vendido` | No |
| Cambiar logo, colores, textos de inicio | `components/layout/Logo.jsx`, `index.css`, `components/home/*` | Sí |
| Textos legales y datos del vendedor | `data/legal.js`, `config/store.js` | Sí |
| Preguntas frecuentes | `pages/Faq.jsx` | Sí |

Recompilar = `yarn build` y volver a subir el contenido de `build/` a `public_html`.

## Seguridad y actualizaciones

- Actualiza WordPress, WooCommerce y plugins (activa actualizaciones automáticas menores).
- Usa contraseñas fuertes y 2FA en el administrador de WordPress.
- Copias de seguridad diarias (hPanel).
- Las claves de pago y proveedores solo se guardan en WordPress.

## SEO

- Títulos y metadescripciones: se generan desde el nombre y la descripción corta del producto; las categorías usan su descripción. Edítalos en WooCommerce.
- Datos estructurados `Product` en cada ficha (modo WooCommerce) y `FAQPage` en preguntas frecuentes.
- Rellena siempre el **texto alternativo** de cada imagen en la biblioteca de medios.
- Sitemap: genera `sitemap.xml` con las URLs `/`, `/tienda`, `/categoria/<slug>` y `/producto/<slug>` y súbelo a `public_html` (o automatízalo con un script que lea la Store API). Envíalo a Google Search Console.
- Para mejorar la indexación de una SPA se puede añadir prerenderizado de rutas en una fase posterior.

## Rendimiento

- Sube imágenes de producto de ~1200 px y comprimidas (WebP/JPEG). Activa la caché de LiteSpeed en WordPress.
- El `.htaccess` incluido aplica caché larga a imágenes, CSS y JS.
