import { Seo } from "@/components/layout/Seo";
import { Hero } from "@/components/home/Hero";
import { OfferCarousel } from "@/components/home/OfferCarousel";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { DailyDeals } from "@/components/home/DailyDeals";
import { Marquee } from "@/components/home/Marquee";
import { ProductScroller, ProductTabs } from "@/components/home/ProductRail";
import { Departments } from "@/components/home/Departments";
import { RecentlyViewed } from "@/components/shop/RecentlyViewed";
import { useCatalog, inCategory, topCategories } from "@/hooks/useCatalog";
import { IS_DEMO } from "@/lib/commerce";
import { discountPct } from "@/lib/format";

export default function Home() {
  const { products, categories } = useCatalog();
  const tagged = (t) => products.filter((p) => p.tags?.includes(t));
  const offers = products.filter((p) => discountPct(p) > 0).sort((a, b) => discountPct(b) - discountPct(a));
  const tops = topCategories(categories);

  return (
    <>
      <Seo description="Ahorramix: ofertas en hogar, tecnología, moda, bienestar y mascotas con precio final claro y envío a España." path="/" />
      <Hero />
      <OfferCarousel />
      <TrustStrip />
      <CategoryStrip products={products} categories={categories} />
      <DailyDeals products={products} />
      <Departments products={products} categories={categories} />
      <ProductScroller id="featured-products" eyebrow="Selección" title="Productos destacados" products={tagged("destacado")} link="/tienda" />
      <ProductTabs
        note={IS_DEMO ? "Clasificación de ejemplo: en producción se basará en las etiquetas y ventas reales de WooCommerce." : undefined}
        tabs={[
          { key: "mas-vendidos", label: "Más vendidos", products: tagged("mas-vendido") },
          { key: "ofertas", label: "Ofertas", products: offers },
          { key: "novedades", label: "Novedades", products: tagged("novedad") },
        ]}
      />
      <Marquee />
      <RecentlyViewed />
      {tops.map((c) => (
        <ProductScroller key={c.slug} id={`category-rail-${c.slug}`} eyebrow="Categoría" title={c.name} products={inCategory(products, categories, c.slug)} link={`/categoria/${c.slug}`} />
      ))}
    </>
  );
}
