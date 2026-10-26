import { Seo } from "@/components/layout/Seo";
import { Hero } from "@/components/home/Hero";
import { OfferCarousel } from "@/components/home/OfferCarousel";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { DailyDeals } from "@/components/home/DailyDeals";
import { Marquee } from "@/components/home/Marquee";
import { ProductScroller, ProductTabs } from "@/components/home/ProductRail";
import { useCatalog, inCategory } from "@/hooks/useCatalog";
import { NAV_CATEGORIES } from "@/config/store";
import { IS_DEMO } from "@/lib/commerce";
import { discountPct } from "@/lib/format";

export default function Home() {
  const { products, categories } = useCatalog();
  const tagged = (t) => products.filter((p) => p.tags?.includes(t));
  const offers = products.filter((p) => discountPct(p) > 0).sort((a, b) => discountPct(b) - discountPct(a));
  const tops = NAV_CATEGORIES.map((s) => categories.find((c) => c.slug === s)).filter(Boolean);

  return (
    <>
      <Seo description="Ahorramix: ofertas en hogar, tecnología, moda, bienestar y mascotas con precio final claro y envío a España." path="/" image="/video/hero-poster.jpg" />
      <Hero />
      <OfferCarousel />
      <TrustStrip />
      <CategoryStrip products={products} categories={categories} />
      <DailyDeals products={products} />
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
      {tops.map((c) => (
        <ProductScroller key={c.slug} id={`category-rail-${c.slug}`} eyebrow="Categoría" title={c.name} products={inCategory(products, categories, c.slug)} link={`/categoria/${c.slug}`} />
      ))}
    </>
  );
}
