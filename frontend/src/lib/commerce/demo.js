import { DEMO_PRODUCTS } from "@/data/demo/products";
import { DEMO_CATEGORIES } from "@/data/demo/categories";

export async function fetchCatalog() {
  return { products: DEMO_PRODUCTS, categories: DEMO_CATEGORIES };
}
