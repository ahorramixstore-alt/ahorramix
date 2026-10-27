// Adaptador para la Store API pública de WooCommerce (/wp-json/wc/store/v1). Solo lectura, sin claves.
import { decodeEntities, stripHtml } from "@/lib/format";
import { WC_STORE_URL } from "@/config/runtime";

const WC = WC_STORE_URL;
const API = `${WC}/wp-json/wc/store/v1`;

const money = (p, key) => {
  const raw = p?.prices?.[key];
  if (raw === undefined || raw === null || raw === "") return null;
  return Number(raw) / 10 ** (p?.prices?.currency_minor_unit ?? 2);
};

const mapProduct = (p, catById) => {
  const sale = p?.on_sale ? money(p, "sale_price") : null;
  const first = p?.categories?.[0];
  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku || "",
    name: decodeEntities(p.name || ""),
    category: first ? catById[first.id]?.slug || first.slug : "",
    tags: (p.tags || []).map((t) => t.slug),
    price: money(p, "price") ?? 0,
    regularPrice: money(p, "regular_price") ?? money(p, "price") ?? 0,
    salePrice: sale,
    images: (p.images || []).map((i) => ({ src: i.src, alt: i.alt || decodeEntities(p.name || "") })),
    shortDescription: stripHtml(decodeEntities(p.short_description || "")),
    descriptionHtml: p.description || "",
    features: [],
    attributes: (p.attributes || []).filter((a) => a.has_variations).map((a) => ({ name: a.name, options: (a.terms || []).map((t) => t.name), slugs: (a.terms || []).map((t) => t.slug) })),
    variations: (p.variations || []).map((v) => ({ id: v.id, attributes: v.attributes || [] })),
    stockStatus: p.is_in_stock ? "instock" : "outofstock",
    rating: Number(p.average_rating) || 0,
    reviewCount: Number(p.review_count) || 0,
    deliveryTime: "",
    shippingNote: "Gastos de envío calculados en el checkout.",
    permalink: p.permalink,
    demo: false,
  };
};

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WooCommerce respondió ${res.status}`);
  return res.json();
}

export async function fetchCatalog() {
  const cats = await getJson(`${API}/products/categories?per_page=100`);
  const catById = {};
  (Array.isArray(cats) ? cats : []).forEach((c) => { catById[c.id] = c; });
  const categories = Object.values(catById).map((c) => ({
    slug: c.slug, name: decodeEntities(c.name), parent: c.parent ? catById[c.parent]?.slug || null : null,
    image: c.image?.src || "", description: stripHtml(c.description || ""),
  }));
  const products = [];
  for (let page = 1; page <= 20; page += 1) {
    const batch = await getJson(`${API}/products?per_page=100&page=${page}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    products.push(...batch.map((p) => mapProduct(p, catById)));
    if (batch.length < 100) break;
  }
  return { products, categories };
}

// Traspaso del carrito al checkout de WooCommerce mediante el plugin "Ahorramix Bridge".
export const checkoutUrl = (items) => `${WC}/?ahorramix_cart=${encodeURIComponent(items.map((i) => `${i.variationId || i.productId}:${i.qty}`).join(","))}`;
export const accountUrl = () => `${WC}/?ahorramix_go=account`;
export const buyNowUrl = (id, qty) => `${WC}/?ahorramix_cart=${encodeURIComponent(`${id}:${qty}`)}`;

export async function fetchReviews(productId) {
  const list = await getJson(`${API}/products/reviews?product_id=${productId}&per_page=20`);
  return (Array.isArray(list) ? list : []).map((r) => ({ id: r.id, name: r.reviewer, text: stripHtml(decodeEntities(r.review || "")), rating: Number(r.rating) || 0, date: r.date_created, verified: Boolean(r.verified) }));
}
