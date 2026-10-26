import * as demo from "./demo";
import * as woo from "./woocommerce";
import { slugify } from "@/lib/format";

export const MODE = process.env.REACT_APP_COMMERCE_MODE === "woocommerce" && process.env.REACT_APP_WC_STORE_URL ? "woocommerce" : "demo";
export const IS_DEMO = MODE === "demo";

const provider = IS_DEMO ? demo : woo;

export const fetchCatalog = () => provider.fetchCatalog();
export const getCheckoutUrl = (items) => (IS_DEMO ? null : woo.checkoutUrl(items));
export const getAccountUrl = () => (IS_DEMO ? null : woo.accountUrl());

// Devuelve el id de variación de WooCommerce que coincide con las opciones elegidas.
export function findVariationId(product, selected) {
  if (!product?.variations?.length) return null;
  const match = product.variations.find((v) =>
    v.attributes.every((a) => {
      const chosen = Object.entries(selected).find(([name]) => slugify(name) === slugify(a.name) || `pa_${slugify(name)}` === a.name);
      return !a.value || (chosen && slugify(chosen[1]) === slugify(a.value));
    }),
  );
  return match?.id ?? null;
}
