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

## Iteración 4 · Paquete de exportación (2026-10-26)
- Ajustes en tiempo de ejecución `public/ahorramix-config.js` (modo, URL WooCommerce, URL pública): se conecta en Hostinger sin recompilar.
- `yarn export:hostinger` → /app/export/ahorramix-tienda-hostinger.zip (sin evaluador, sin scripts de Emergent) + ahorramix-bridge.zip + LEEME.md.
- Plugin: sitemap dinámico `/?ahorramix_sitemap=1` (constante AHORRAMIX_SITE_URL).
- Verificado: ZIP servido de forma independiente (rutas, vídeo, 0 referencias a Emergent, /evaluador → 404) y modo WooCommerce con Store API simulada (catálogo, variación → checkout `?ahorramix_cart=22:1`, cuenta).
- Pendiente del usuario: dirección/email/teléfono, revisión legal, WordPress+WooCommerce, pasarela, envíos, proveedores, productos reales. Plugin PHP no ejecutado en WordPress real.

## Iteración 5 · Estructura marketplace + funciones premium (2026-10-27)
- 11 departamentos y 39 subcategorías (demo), menú «Todas las categorías» por niveles, `topCategories()` (orden NAV + resto de WooCommerce).
- Buscador con selector de departamento y sugerencias; filtros (precio, stock, ofertas, atributos, valoración real), ordenaciones, «Cargar más», filtros en panel en móvil.
- Lista de deseos, vistos recientemente (ShopperContext, localStorage), zoom de galería, «Comprar ahora», barra fija de compra, guía de tallas, compartir, opiniones reales de la Store API, estrellas.
- Carrito: barra de envío gratis (si hay umbral) y venta cruzada. Páginas /lista-de-deseos y /seguimiento. Newsletter configurable (newsletterAction). Botón volver arriba. Tarjetas de departamento en inicio.
- docs/10-FUNCIONES-TIENDA.md (equivalencias Shopify → WooCommerce). Paquete export regenerado y verificado con WooCommerce simulado (valoraciones, opiniones, comprar ahora, categorías no listadas).

## Iteración 6 · Logo real (2026-10-27)
- Logo del usuario recoloreado (azul → naranja #ff5a1f, negro conservado, fondo transparente) en `public/images/brand/ahorramix-logo.png`; cabecera (logo completo) y pie (sobre tarjeta blanca). Favicon/apple-touch-icon con el carrito. ZIP regenerado.
- Negro de marca del logo original (#001326, variable `--am-black`) aplicado al logo, botones, chips y paneles oscuros.
- Vista previa al compartir: `images/brand/og-ahorramix.jpg` (1200×630) con etiquetas Open Graph/Twitter estáticas en index.html (usa REACT_APP_SITE_URL; si está vacío, el usuario añade su dominio, ver LEEME paso 7).


## Backlog
- P0 (usuario, en Hostinger): instalar WP/WooCommerce, plugin puente, pasarela, envíos, datos vendedor, legales revisados.
- P1: prerenderizado SEO; formulario contacto vía WordPress.
- P2: mostrar plazo de entrega real desde WooCommerce; comparación de candidatos en el evaluador.

## Próximas tareas
- Probar plugin puente en staging real de WordPress.
- Sustituir productos y fotos de ejemplo por reales.
