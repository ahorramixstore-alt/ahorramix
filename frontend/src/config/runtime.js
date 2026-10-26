// Ajustes en tiempo de ejecución (public/ahorramix-config.js) con respaldo en variables de compilación.
const cfg = (typeof window !== "undefined" && window.AHORRAMIX_CONFIG) || {};
const clean = (v) => String(v || "").trim().replace(/\/$/, "");

export const COMMERCE_MODE = cfg.commerceMode || process.env.REACT_APP_COMMERCE_MODE || "demo";
export const WC_STORE_URL = clean(cfg.wcStoreUrl || process.env.REACT_APP_WC_STORE_URL);
export const SITE_URL = clean(cfg.siteUrl || process.env.REACT_APP_SITE_URL);
