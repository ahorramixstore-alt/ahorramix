import { useEffect, useState } from "react";
import { fetchCatalog } from "@/lib/commerce";
import { NAV_CATEGORIES } from "@/config/store";

let cache = null;

export function useCatalog() {
  const [state, setState] = useState({ products: [], categories: [], loading: true, error: null });
  useEffect(() => {
    let alive = true;
    cache = cache || fetchCatalog();
    cache
      .then((d) => {
        if (!alive) return;
        setState({
          products: Array.isArray(d?.products) ? d.products : [],
          categories: Array.isArray(d?.categories) ? d.categories : [],
          loading: false,
          error: null,
        });
      })
      .catch((e) => {
        cache = null;
        if (alive) setState((s) => ({ ...s, loading: false, error: e?.message || "No se pudo cargar el catálogo" }));
      });
    return () => { alive = false; };
  }, []);
  return state;
}

export const childSlugs = (categories, slug) => categories.filter((c) => c.parent === slug).map((c) => c.slug);

export const inCategory = (products, categories, slug) => {
  if (!slug) return products;
  const all = [slug, ...childSlugs(categories, slug)];
  return products.filter((p) => all.includes(p.category));
};

export const parentOf = (categories, slug) => categories.find((c) => c.slug === slug)?.parent || null;

// Departamentos en el orden de NAV_CATEGORIES y, detrás, el resto de categorías principales de WooCommerce.
export const topCategories = (categories, order = NAV_CATEGORIES) => [
  ...order.map((s) => categories.find((c) => c.slug === s)),
  ...categories.filter((c) => !c.parent && !order.includes(c.slug)),
].filter(Boolean);
