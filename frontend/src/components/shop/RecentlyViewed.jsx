import { useShopper } from "@/context/ShopperContext";
import { useCatalog } from "@/hooks/useCatalog";
import { ProductScroller } from "@/components/home/ProductRail";

export function RecentlyViewed({ exclude }) {
  const { recent } = useShopper();
  const { products } = useCatalog();
  const items = recent.filter((s) => s !== exclude).map((s) => products.find((p) => p.slug === s)).filter(Boolean);
  return <ProductScroller id="recently-viewed" eyebrow="Tu historial" title="Vistos recientemente" products={items} min={1} />;
}
