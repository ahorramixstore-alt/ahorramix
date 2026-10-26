// Banners y promociones editables de la portada.
// Los textos de ejemplo hacen referencia a los productos ficticios de la demo: cámbialos por tus ofertas reales.
export const HERO_VIDEO = {
  src: "/video/hero-ofertas.mp4",
  webm: "/video/hero-ofertas.webm",
  srcMobile: "/video/hero-ofertas-movil.mp4",
  webmMobile: "/video/hero-ofertas-movil.webm",
  poster: "/video/hero-poster.jpg",
};

export const OFFER_SLIDES = [
  { id: "decoracion", eyebrow: "Decoración", title: "Hasta −24 % en jarrones y cerámica", text: "Piezas para dar carácter a tu salón.", cta: "Ver decoración", to: "/categoria/decoracion", image: "/images/vase-aro.jpg", bg: "#FF5A1F", ink: "#0E1015" },
  { id: "audio", eyebrow: "Tecnología", title: "Sonido inalámbrico desde 29,90 €", text: "Auriculares y altavoces para cada día.", cta: "Ver audio", to: "/categoria/audio", image: "/images/speaker-onda.jpg", bg: "#FFD84D", ink: "#0E1015" },
  { id: "moda", eyebrow: "Novedades", title: "Mochilas, gafas y zapatillas", text: "Lo nuevo de la temporada en moda.", cta: "Ver moda", to: "/categoria/moda", image: "/images/backpack-ruta.jpg", bg: "#0E1015", ink: "#FFFFFF" },
];

export const SIDE_TILES = [
  { id: "deals", eyebrow: "Hoy", title: "Ofertas del día", to: "/#ofertas-del-dia", image: "/images/headphones-eco.jpg", bg: "#FFE3EC" },
  { id: "mascotas", eyebrow: "Mascotas", title: "Camas y juguetes", to: "/categoria/mascotas", image: "/images/cama-perro.jpg", bg: "#E3F4EC" },
];

// Ofertas del día: etiqueta en WooCommerce + fecha de fin que decides tú (ISO, p. ej. "2026-11-30T23:59:00+01:00").
// Si endsAt está vacío: en la demo se usa el final del día como EJEMPLO; con WooCommerce no se muestra cuenta atrás.
export const DAILY_DEAL = { tag: "oferta-del-dia", endsAt: "" };
