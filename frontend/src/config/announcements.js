// Mensajes de la barra de avisos superior. Edita, añade o borra líneas; deja la lista vacía para ocultarla.
// "to" es opcional: ruta interna a la que lleva el mensaje.
// Ejemplos para cuando los tengas: { text: "Usa el cupón BIENVENIDA10 en tu primera compra", to: "/tienda" }
//                                  { text: "Envío gratis a partir de 50 €", to: "/legal/envios" }
export const ANNOUNCEMENTS = [
  { text: "Precios finales con IVA incluido", to: "/legal/condiciones" },
  { text: "Plazo de entrega estimado visible en cada producto", to: "/legal/envios" },
  { text: "Devoluciones explicadas en una sola página", to: "/legal/devoluciones" },
];

export const ANNOUNCEMENT_INTERVAL_MS = 4000;
