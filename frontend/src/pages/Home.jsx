import { Seo } from "@/components/layout/Seo";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { CategoryBento } from "@/components/home/CategoryBento";
import { ProductRail, ProductTabs } from "@/components/home/ProductRail";
import { Spotlight } from "@/components/home/Spotlight";
import { TrustStrip } from "@/components/home/TrustStrip";
import { useCatalog } from "@/hooks/useCatalog";
import { IS_DEMO } from "@/lib/commerce";
import { discountPct } from "@/lib/format";

export default function Home() {
  const { products, categories } = useCatalog();
  const tagged = (t) => products.filter((p) => p.tags?.includes(t));
  const offers = products.filter((p) => discountPct(p) > 0);
  const spotlight = [...offers].sort((a, b) => Number(a.tags?.includes("destacado")) - Number(b.tags?.includes("destacado")) || discountPct(b) - discountPct(a))[0];

  return (
    <>
      <Seo description="Ahorramix: productos para el hogar, tecnología, moda, bienestar y mascotas con precio final claro y envío a España." path="/" />
      <Hero />
      <Marquee />
      <CategoryBento products={products} categories={categories} />
      <ProductRail id="featured-products" eyebrow="Selección" title="Productos destacados" products={tagged("destacado")} link="/tienda" />
      <Spotlight product={spotlight} />
      <ProductTabs
        note={IS_DEMO ? "Clasificación de ejemplo: en producción se basará en las etiquetas y ventas reales de WooCommerce." : undefined}
        tabs={[
          { key: "mas-vendidos", label: "Más vendidos", products: tagged("mas-vendido") },
          { key: "novedades", label: "Novedades", products: tagged("novedad") },
          { key: "ofertas", label: "Ofertas", products: offers },
        ]}
      />
      <TrustStrip />
    </>
  );
}
