// PLANTILLAS ORIENTATIVAS. No garantizan el cumplimiento legal: revísalas con un profesional antes de publicar.
// Los valores entre [corchetes] deben sustituirse por tus datos reales.
import { STORE } from "@/config/store";

const S = STORE.seller;

export const LEGAL_PAGES = [
  {
    slug: "aviso-legal", title: "Aviso legal",
    sections: [
      ["Titular del sitio web", [`En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa de los datos del titular: ${S.legalName}, con NIF/CIF ${S.taxId}, domicilio en ${S.address}, correo electrónico ${S.email} y teléfono ${S.phone}. ${S.registry}.`]],
      ["Objeto", ["Este sitio web ofrece la venta online de productos a consumidores. El acceso implica la aceptación de este aviso legal."]],
      ["Propiedad intelectual", ["[Indica la titularidad de textos, logotipos y fotografías. Las imágenes de proveedores solo deben usarse con su autorización.]"]],
      ["Responsabilidad", ["[Describe las limitaciones de responsabilidad aplicables, revisadas por un profesional.]"]],
      ["Legislación aplicable", ["[Indica la legislación y jurisdicción aplicables, respetando los derechos del consumidor.]"]],
    ],
  },
  {
    slug: "privacidad", title: "Política de privacidad",
    sections: [
      ["Responsable del tratamiento", [`${S.legalName} · ${S.taxId} · ${S.address} · ${S.email}.`]],
      ["Datos que tratamos y finalidades", ["[Enumera los datos (identificación, contacto, dirección de envío, datos del pedido) y las finalidades: gestión de pedidos, atención al cliente, obligaciones fiscales, comunicaciones comerciales si se consienten.]"]],
      ["Base jurídica", ["[Ejecución del contrato, obligación legal, consentimiento o interés legítimo, según cada finalidad, conforme al RGPD y la LOPDGDD.]"]],
      ["Destinatarios", ["Para entregar los pedidos es necesario compartir los datos de envío con los proveedores y transportistas. [Enumera proveedores, pasarelas de pago, alojamiento (Hostinger) y su ubicación; indica si hay transferencias internacionales y sus garantías.]"]],
      ["Conservación", ["[Indica los plazos de conservación de cada tipo de dato.]"]],
      ["Derechos", [`Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${S.email}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).`]],
    ],
  },
  {
    slug: "cookies", title: "Política de cookies",
    sections: [
      ["Qué usamos actualmente", ["Esta web usa almacenamiento local del navegador estrictamente necesario para recordar tu carrito y tu elección sobre este aviso. Actualmente no se cargan cookies analíticas ni publicitarias."]],
      ["Cookies de terceros", ["El proceso de pago y la cuenta de cliente funcionan en WooCommerce, que usa sus propias cookies técnicas. [Si añades analítica, píxeles publicitarios o chat, lista aquí cada cookie, su finalidad y duración, y usa una herramienta de consentimiento antes de activarlas.]"]],
      ["Cómo gestionarlas", ["Puedes borrar el almacenamiento local y las cookies desde la configuración de tu navegador."]],
    ],
  },
  {
    slug: "condiciones", title: "Condiciones generales de contratación",
    sections: [
      ["Partes", [`Vendedor: ${S.legalName}, ${S.taxId}, ${S.address}. Comprador: la persona que realiza el pedido.`]],
      ["Proceso de compra", ["El pedido se formaliza en el checkout tras revisar productos, gastos de envío e importe total, y aceptar estas condiciones. Recibirás un correo de confirmación."]],
      ["Precios e impuestos", ["Los precios se muestran en euros con el IVA aplicable incluido. Los gastos de envío se indican antes de confirmar el pago. [Revisa el tratamiento fiscal para Canarias, Ceuta y Melilla si envías allí.]"]],
      ["Pago", ["[Enumera los métodos de pago configurados en WooCommerce.]"]],
      ["Entrega", ["Los productos se envían directamente desde los almacenes de nuestros proveedores. Los plazos indicados son estimaciones. [Indica el plazo máximo legal de entrega que asumes.]"]],
      ["Desistimiento y garantía", ["Consulta la política de devoluciones y reembolsos. [Incluye la garantía legal de conformidad aplicable y el formulario de desistimiento.]"]],
    ],
  },
  {
    slug: "envios", title: "Política de envíos",
    sections: [
      ["Zonas de envío", ["[Indica las zonas a las que envías: península, Baleares, Canarias, Ceuta, Melilla, Portugal…]"]],
      ["Plazos", ["Cada ficha muestra el plazo estimado facilitado por el proveedor. El plazo comienza cuando se confirma el pago. Si un pedido incluye productos de varios proveedores, puede llegar en varios paquetes."]],
      ["Costes", ["Los gastos de envío se calculan en el checkout antes del pago. [Indica tarifas o umbral de envío gratuito si lo ofreces.]"]],
      ["Seguimiento", ["Recibirás por correo el número de seguimiento cuando el proveedor envíe el pedido."]],
      ["Incidencias", [`Si tu pedido llega dañado o incompleto, escríbenos a ${S.email} indicando el número de pedido y fotografías.`]],
    ],
  },
  {
    slug: "devoluciones", title: "Devoluciones y reembolsos",
    sections: [
      ["Derecho de desistimiento", ["Como consumidor dispones, con carácter general, de 14 días naturales desde la recepción para desistir de la compra sin indicar el motivo, conforme al Real Decreto Legislativo 1/2007 (TRLGDCU). Existen excepciones legales (por ejemplo, productos precintados por razones de higiene una vez desprecintados)."]],
      ["Cómo solicitarlo", [`Escribe a ${S.email} con tu número de pedido. [Indica la dirección de devolución: tu almacén o el del proveedor.]`]],
      ["Gastos de devolución", ["[Indica quién asume los gastos de devolución. Si los asume el cliente, debes informarlo antes de la compra.]"]],
      ["Reembolso", ["Reembolsaremos el importe, incluidos los gastos de envío iniciales estándar, en un plazo máximo de 14 días naturales desde que se comunique el desistimiento, pudiendo retenerlo hasta recibir el producto o prueba de su devolución, mediante el mismo medio de pago."]],
      ["Productos defectuosos", ["[Describe el procedimiento de garantía legal de conformidad.]"]],
    ],
  },
];
