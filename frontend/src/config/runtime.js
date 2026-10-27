// Ajustes en tiempo de ejecución (public/ahorramix-config.js) con respaldo en variables de compilación.
const cfg = (typeof window !== "undefined" && window.AHORRAMIX_CONFIG) || {};
const clean = (v) => String(v || "").trim().replace(/\/$/, "");

export const COMMERCE_MODE = cfg.commerceMode || process.env.REACT_APP_COMMERCE_MODE || "demo";
export const WC_STORE_URL = clean(cfg.wcStoreUrl || process.env.REACT_APP_WC_STORE_URL);
export const SITE_URL = clean(cfg.siteUrl || process.env.REACT_APP_SITE_URL);
export const NEWSLETTER_ACTION = String(cfg.newsletterAction || "").trim();
export const NEWSLETTER_FIELD = cfg.newsletterEmailField || "EMAIL";
export const TRACKING_URL = String(cfg.trackingUrl || "").trim();
export const GOOGLE_CLIENT_ID = String(cfg.googleClientId || "").trim();
export const WELCOME = {
  code: String(cfg.welcomeCode ?? "").trim(),
  discount: String(cfg.welcomeDiscount || "").trim(),
  delay: Number(cfg.welcomeDelaySeconds ?? 8) * 1000,
};
