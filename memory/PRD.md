# PRD — Ahorramix (tienda de dropshipping exportable a Hostinger)

## Problema original (resumen fiel del usuario)
"PROMPT MAESTRO: TIENDA ONLINE DE DROPSHIPPING EXPORTABLE A HOSTINGER". Tienda profesional de dropshipping diseñada en Emergent pero alojada en Hostinger con WordPress + WooCommerce (catálogo, carrito, pedidos, pagos). Prioridad: exportabilidad, compatibilidad, gestión fácil, bajo mantenimiento. Sin dependencias de Emergent. Diseño completo (inicio, buscador, categorías/subcategorías, destacados, más vendidos, novedades, ofertas, fichas con galería/variantes/precio promo, carrito, cuenta, FAQ, contacto, sobre nosotros, legales). Estructura para proveedores, evaluación de productos sin inventar datos, no simular integraciones, no pasarela propia, SEO, legal España editable, documentación completa de exportación y migración, trabajo por fases.

Respuestas del usuario: Arquitectura "Diseño React conectado a WooCommerce"; tienda generalista con categorías editables; nombre "Ahorramix"; estilo "Limpio y elegante"; evaluador que considere coste proveedor, envío, comisiones, impuestos, competencia, demanda, devoluciones y margen neto, sin inventar datos ni añadir productos automáticamente, con exportación CSV para WooCommerce (nombre, descripción, precio, SKU, variantes, imágenes, datos del proveedor).

## Arquitectura
- Frontend React estático (CRA/craco, Tailwind, shadcn, framer-motion, lenis). Sin backend propio (backend FastAPI de plantilla no usado).
- Capa de datos `src/lib/commerce`: modo `demo` (productos ficticios) o `woocommerce` (Store API pública).
- Carrito en localStorage → traspaso al checkout WooCommerce mediante plugin `wordpress/ahorramix-bridge` (CORS + `?ahorramix_cart=`).
- Evaluador interno `/evaluador` (flag REACT_APP_SHOW_EVALUATOR), datos en localStorage, CSV importador WooCommerce (borradores, variaciones, metadatos proveedor).
- Docs en /app/docs (01–09).

## Personas
- Propietario de la tienda (gestiona en WooCommerce, evalúa productos).
- Comprador en España (móvil y escritorio).

## Implementado (2026-10-26)
- Inicio con hero animado, marquee, bento de categorías, destacados, spotlight de oferta, pestañas más vendidos/novedades/ofertas, bloque de confianza.
- Tienda con categorías/subcategorías, buscador, filtro ofertas, ordenación; ficha con galería, variantes, cantidad, pestañas, JSON-LD; carrito (panel + página); cuenta; FAQ; contacto (mailto); sobre nosotros; 6 páginas legales plantilla; 404; aviso de cookies; banner modo demo.
- Evaluador con cálculo de margen neto, ROI, precio mínimo, puntuación y CSV WooCommerce (verificado).
- `yarn build` verificado; .htaccess, robots.txt, favicon SVG, .env.example.

## Iteración 2 (2026-10-26)
- Sitemap automático (`frontend/scripts/generate-sitemap.js`, postbuild + `yarn sitemap`) desde la Store API; probado con WooCommerce simulado.
- Vista rápida («Añadir rápido») en cada tarjeta: variantes, cantidad y añadir al carrito; componente compartido `PurchaseControls`.
- Rediseño comercial a petición del usuario («se ve muy simple» → «Más llamativa y comercial»): portada con vídeo (Pexels 5889617, mp4+webm, móvil y escritorio), carrusel de ofertas (embla) + tarjetas laterales, barra de garantías, tira de categorías, ofertas del día con cuenta atrás (fecha configurable en `config/promos.js`), carruseles por categoría, pestañas más vendidos/ofertas/novedades, barra de categorías en cabecera, paleta naranja #FF5A1F / amarillo #FFD84D / tinta.
- 7 productos de ejemplo ficticios más (18 en total) y 4 subcategorías nuevas.

## Iteración 3 (2026-10-26)
- Datos del vendedor: titular "Ahorramix", NIF/NIE Y0447650S (facilitados por el usuario). Pendientes: dirección, email, teléfono.
- Barra de avisos rotativa (config/announcements.js), con flechas, pausa al pasar el ratón y cierre por sesión.

## Backlog
- P0 (usuario, en Hostinger): instalar WP/WooCommerce, plugin puente, pasarela, envíos, datos vendedor, legales revisados.
- P1: prerenderizado SEO; formulario contacto vía WordPress.
- P2: mostrar plazo de entrega real desde WooCommerce; comparación de candidatos en el evaluador.

## Próximas tareas
- Probar plugin puente en staging real de WordPress.
- Sustituir productos y fotos de ejemplo por reales.
