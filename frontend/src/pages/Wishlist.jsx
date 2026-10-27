import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";
import { ProductGrid } from "@/components/shop/ProductCard";
import { useShopper } from "@/context/ShopperContext";
import { useCatalog } from "@/hooks/useCatalog";

export default function Wishlist() {
  const { wishlist } = useShopper();
  const { products } = useCatalog();
  const items = wishlist.map((s) => products.find((p) => p.slug === s)).filter(Boolean);
  return (
    <>
      <Seo title="Lista de deseos" noindex path="/lista-de-deseos" />
      <PageHead eyebrow="Guardados" title="Tu lista de deseos">Se guarda en este navegador. Pulsa el corazón de cualquier producto para añadirlo o quitarlo.</PageHead>
      <div className="am-container" data-testid="wishlist-page">
        {items.length ? <ProductGrid products={items} wide /> : (
          <div className="py-16 text-center border-y border-[var(--am-line)]" data-testid="wishlist-empty">
            <p className="text-[var(--am-ink-2)]">Aún no has guardado productos.</p>
            <Link to="/tienda" className="mt-6 inline-flex px-7 py-3.5 rounded-full bg-[var(--am-black)] text-white font-semibold">Explorar la tienda</Link>
          </div>
        )}
      </div>
    </>
  );
}
