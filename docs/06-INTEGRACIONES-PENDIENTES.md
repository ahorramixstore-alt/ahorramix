# 06 · Integraciones pendientes

Nada de esta lista está activo todavía. Ninguna integración se simula como operativa.

| Función | Qué necesitas | Dónde se configura | Coste |
|---|---|---|---|
| Catálogo real | WordPress + WooCommerce | Hostinger | Gratis (incluido en hosting) |
| Conexión frontend ↔ WooCommerce | Plugin `ahorramix-bridge` + variables `.env` | WordPress + build | Gratis |
| Pagos con tarjeta | Plugin oficial **WooCommerce Stripe Gateway** o **WooPayments** + cuenta | WordPress | Comisiones por transacción del proveedor |
| PayPal | Plugin **WooCommerce PayPal Payments** + cuenta PayPal Business | WordPress | Comisiones de PayPal |
| Bizum / TPV bancario | Plugin Redsys compatible + contrato con tu banco | WordPress | Según banco |
| Importación de productos de proveedores | Plugin del proveedor elegido (p. ej. AliDropship Woo, CJdropshipping, Syncee, Spocket, BigBuy, DSers para WooCommerce…). Compara antes de contratar | WordPress | Varía: gratis a suscripción mensual |
| Sincronización de precios y stock | Mismo plugin del proveedor (función de sincronización) | WordPress | Según plugin |
| Envío del pedido al proveedor | Mismo plugin, o manual desde el panel del proveedor | WordPress | Según plugin |
| Seguimiento de envíos | Plugin de seguimiento (p. ej. «Advanced Shipment Tracking») o el del proveedor | WordPress | Gratis / premium |
| Gastos de envío | WooCommerce › Envío › Zonas (España peninsular, Baleares, Canarias…) | WordPress | Gratis |
| Cupones | WooCommerce › Marketing › Cupones | WordPress | Gratis |
| Correos de pedido | WooCommerce › Ajustes › Correos + SMTP (p. ej. WP Mail SMTP con el correo de Hostinger) | WordPress | Gratis |
| Formulario de contacto con envío real | Contact Form 7 o WPForms en WordPress; cambia `Contact.jsx` para enviar a su endpoint o enlazar a la página | WordPress + frontend | Gratis |
| Facturas | Plugin de facturas PDF (p. ej. «PDF Invoices & Packing Slips») | WordPress | Gratis / premium |
| Consentimiento de cookies | Herramienta de consentimiento (CMP) **antes** de añadir analítica o píxeles | Frontend + WordPress | Gratis / premium |
| Analítica | Google Analytics 4 / Google Tag Manager (solo con consentimiento) | `public/index.html` | Gratis |
| Google Search Console | Verificación por DNS en hPanel + envío del sitemap | Hostinger | Gratis |
| Reseñas de clientes | Reseñas nativas de WooCommerce (solo reales y verificadas) | WordPress | Gratis |

**Nada se ha contratado.** Antes de pagar cualquier plugin o servicio, compara condiciones, verifica compatibilidad con tu versión de WooCommerce y decide tú.
