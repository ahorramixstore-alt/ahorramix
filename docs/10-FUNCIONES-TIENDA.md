# 10 · Funciones de tienda premium (equivalencias Shopify → Ahorramix + WooCommerce)

Shopify de pago incluye funciones de **escaparate** (lo que ve el cliente) y de **gestión** (panel del vendedor). En Ahorramix el escaparate es la tienda React y la gestión es WooCommerce.

## Escaparate: incluido y funcionando en la tienda

| Función | Dónde |
|---|---|
| Departamentos y subcategorías ilimitados, menú «Todas las categorías» por niveles | Cabecera / menú lateral |
| Buscador con selector de departamento y sugerencias instantáneas | Cabecera |
| Filtros: departamento, precio (rangos y mín/máx), en stock, ofertas, atributos (color, talla, modelo…), valoración* | `/tienda`, `/categoria/...` |
| Ordenación: destacados, novedades, precio, mayor descuento, mejor valorados*, nombre | Listados |
| «Cargar más» (paginación de 24 en 24) | Listados |
| Vista rápida con variantes y añadir al carrito | Tarjetas de producto |
| Lista de deseos | Corazón en tarjetas y fichas, `/lista-de-deseos` |
| Vistos recientemente | Inicio y fichas |
| Galería con zoom, variantes, cantidad | Ficha |
| «Comprar ahora» (va directo al checkout con ese producto) | Ficha (activo con WooCommerce) |
| Barra fija de compra al hacer scroll | Ficha |
| Guía de tallas (si el producto tiene atributo «Talla») | Ficha (medidas por completar) |
| Compartir: WhatsApp, Facebook, copiar enlace | Ficha |
| Opiniones de clientes reales y estrellas* | Ficha (las lee de WooCommerce) |
| Productos relacionados y venta cruzada en el carrito | Ficha / carrito |
| Barra de progreso de envío gratis | Carrito (se activa con `freeShippingThreshold` en `config/store.js`) |
| Ofertas del día con cuenta atrás, carrusel de promociones, barra de avisos | Inicio / cabecera |
| Newsletter | Pie (se activa con `newsletterAction` en `ahorramix-config.js`) |
| Seguimiento de pedidos | `/seguimiento` (enlaza a tu plugin o a «Mi cuenta») |
| SEO: URLs limpias, metadatos, datos estructurados Product y FAQ, sitemap automático | Toda la tienda |

\* Las valoraciones solo aparecen cuando hay opiniones reales en WooCommerce. No se inventan.

## Gestión: se resuelve en WooCommerce (Hostinger)

| Función de Shopify | Equivalente en WooCommerce | Coste orientativo |
|---|---|---|
| Pagos (Shopify Payments) | WooPayments, WooCommerce Stripe Gateway, PayPal Payments, Redsys/Bizum | Comisión por venta |
| Descuentos y cupones | WooCommerce › Marketing › Cupones (nativo) | Gratis |
| Recuperación de carritos abandonados | Plugins como «CartFlows», «Abandoned Cart Lite» o la automatización de MailPoet | Gratis / premium |
| Tarjetas regalo | «Gift Cards for WooCommerce» (varias opciones) | Gratis / premium |
| Email marketing (Shopify Email) | MailPoet, Brevo, Mailchimp for WooCommerce | Gratis hasta cierto volumen |
| Inventario y variantes | Nativo en WooCommerce (+ sincronización del plugin del proveedor) | Gratis |
| Pedidos, clientes, reembolsos, estados | Nativo | Gratis |
| Analítica e informes | WooCommerce › Analíticas (nativo) + Google Analytics 4 con consentimiento | Gratis |
| Impuestos (IVA España) | Nativo (configuración de tarifas) | Gratis |
| Envíos y tarifas por zona | Nativo; etiquetas con plugins de transportistas | Gratis / según transportista |
| Facturas | «PDF Invoices & Packing Slips» | Gratis |
| Opiniones con foto/verificadas | Nativo + plugins de reseñas | Gratis / premium |
| Multidivisa / multidioma | WPML + WooCommerce Multilingual, o «Currency Switcher» | Premium |
| Suscripciones | WooCommerce Subscriptions | Premium |
| Dropshipping (DSers, Spocket…) | Plugins del proveedor para WooCommerce | Según proveedor |
| Punto de venta (POS) | Extensiones POS para WooCommerce | Premium |

Ningún plugin se ha contratado ni activado. Elige y compara antes de pagar.
