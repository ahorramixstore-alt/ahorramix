/*
 * AJUSTES DE AHORRAMIX - edita este archivo directamente en Hostinger (Administrador de archivos > public_html).
 * No hace falta recompilar la tienda. NO pongas aquí claves ni contraseñas: este archivo es público.
 *
 * commerceMode:         "demo" (productos de ejemplo) o "woocommerce" (catálogo real)
 * wcStoreUrl:           dirección de tu WordPress con WooCommerce, sin barra final. Ej.: "https://tienda.tudominio.es"
 * siteUrl:              dirección pública de esta tienda, sin barra final. Ej.: "https://tudominio.es"
 * newsletterAction:     URL "action" del formulario de tu herramienta de email (Mailchimp, MailPoet, Brevo...). Vacío = formulario desactivado.
 * newsletterEmailField: nombre del campo de email que espera esa herramienta (Mailchimp: "EMAIL").
 * trackingUrl:          página de seguimiento de pedidos de tu plugin (p. ej. "https://tienda.tudominio.es/seguimiento"). Vacío = se usa "Mi cuenta".
 * welcomeCode:          código de descuento de bienvenida. Créalo IGUAL en WooCommerce > Marketing > Cupones. Vacío = aviso desactivado.
 * welcomeDiscount:      texto del descuento que se muestra (ej.: "10 %", "5 €").
 * welcomeDelaySeconds:  segundos que tarda en aparecer el aviso en la primera visita.
 * googleClientId:       ID de cliente OAuth de Google para «Iniciar sesión con Google» (ver docs/11-LOGIN-GOOGLE.md). Vacío = inicio de sesión desactivado.
 */
window.AHORRAMIX_CONFIG = {
  commerceMode: "demo",
  wcStoreUrl: "",
  siteUrl: "",
  newsletterAction: "",
  newsletterEmailField: "EMAIL",
  trackingUrl: "",
  welcomeCode: "BIENVENIDA10",
  welcomeDiscount: "10 %",
  welcomeDelaySeconds: 8,
  googleClientId: "",
};
