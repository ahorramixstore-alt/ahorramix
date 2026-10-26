const money = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export const eur = (n) => money.format(Number.isFinite(Number(n)) ? Number(n) : 0);

export const slugify = (s = "") =>
  String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const stripHtml = (html = "") => String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const decodeEntities = (s = "") => {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
};

export const discountPct = (p) => (p?.salePrice && p?.regularPrice > p.salePrice ? Math.round((1 - p.salePrice / p.regularPrice) * 100) : 0);
