# 08 · Mantenimiento tras la migración

## Tareas habituales

| Tarea | Dónde | ¿Requiere recompilar React? |
|---|---|---|
| Añadir/editar productos, precios, stock, ofertas | WooCommerce | No |
| Crear categorías nuevas | WooCommerce | No (aparecen solas). Para el menú: editar `NAV_CATEGORIES` y recompilar |
| Marcar destacados / novedades | Etiquetas `destacado`, `novedad`, `mas-vendido` | No |
| Cambiar logo, colores, textos de inicio | `components/layout/Logo.jsx`, `index.css`, `components/home/*` | Sí |
| Textos legales y datos del vendedor | `data/legal.js`, `config/store.js` | Sí |
| Mensajes de la barra de avisos (cupones, envíos…) | `config/announcements.js` (lista vacía = barra oculta) | Sí |
| Preguntas frecuentes | `pages/Faq.jsx` | Sí |
| Vídeo de portada, carrusel de ofertas, tarjetas laterales | `config/promos.js` (+ archivos en `public/video` e `public/images`) | Sí |
| Ofertas del día | Etiqueta `oferta-del-dia` + precio rebajado en WooCommerce; fecha de fin en `DAILY_DEAL.endsAt` de `config/promos.js` | Productos: no. Fecha de fin: sí |

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
- Sitemap automático: al ejecutar `yarn build`, el script `frontend/scripts/generate-sitemap.js` lee WooCommerce y crea `build/sitemap.xml` (inicio, tienda, páginas de ayuda y legales, categorías con productos y todas las fichas publicadas). También añade la línea `Sitemap:` al `robots.txt`. Requiere `REACT_APP_SITE_URL`; en modo demo solo incluye páginas estáticas (los productos ficticios no se indexan). Si la conexión con WooCommerce falla, la compilación se detiene con un mensaje claro para no publicar un sitemap incompleto.
- Cuando añadas productos sin recompilar la web, ejecuta `yarn sitemap` (escribe en `build/`) y sube solo `sitemap.xml` a `public_html`. En Google Search Console › Sitemaps envía `https://tudominio.es/sitemap.xml`.
- Para mejorar la indexación de una SPA se puede añadir prerenderizado de rutas en una fase posterior.

## Rendimiento

- Sube imágenes de producto de ~1200 px y comprimidas (WebP/JPEG). Activa la caché de LiteSpeed en WordPress.
- El `.htaccess` incluido aplica caché larga a imágenes, CSS y JS.
