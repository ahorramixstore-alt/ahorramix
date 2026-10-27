// Datos editables de la tienda. Los valores entre [corchetes] son marcadores que debes sustituir.
import { SITE_URL } from "./runtime";

export const STORE = {
  name: "Ahorramix",
  tagline: "Lo esencial, bien elegido, a buen precio.",
  locale: "es-ES",
  currency: "EUR",
  country: "España",
  siteUrl: SITE_URL,
  // Umbral de envío gratuito en euros. null = no se muestra (configúralo también en WooCommerce).
  freeShippingThreshold: null,
  seller: {
    legalName: "Ahorramix",
    taxId: "Y0447650S",
    address: "[Dirección completa, código postal, ciudad]",
    email: "[email@tudominio.es]",
    phone: "[Teléfono de contacto]",
    registry: "[Datos registrales, si procede]",
  },
  social: { instagram: "", tiktok: "", facebook: "" },
};

export const NAV_CATEGORIES = ["hogar", "tecnologia", "informatica-oficina", "moda", "bienestar", "deportes", "mascotas", "bebe-infantil", "jardin-bricolaje", "coche-moto", "viaje"];

// Departamentos visibles en la barra de la cabecera (el resto, en "Todas las categorías").
export const HEADER_CATEGORIES = 6;

export const SHOW_EVALUATOR = process.env.REACT_APP_SHOW_EVALUATOR === "true";
