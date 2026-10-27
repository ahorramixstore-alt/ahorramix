import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";
import { ProductGrid } from "@/components/shop/ProductCard";
import { useShopper } from "@/context/ShopperContext";
import { useCatalog } from "@/hooks/useCatalog";
import { useAuth } from "@/context/AuthContext";

function SyncNote() {
  const { user, setLoginOpen } = useAuth();
  if (user) return <p className="mb-6 text-sm text-[var(--am-emerald)]" data-testid="wishlist-synced-note">Guardada en tu cuenta: la verás en cualquier dispositivo donde inicies sesión.</p>;
  return (
    <p className="mb-6 text-sm text-[var(--am-ink-2)]" data-testid="wishlist-guest-note">
      Ahora se guarda solo en este navegador.{" "}
      <button onClick={() => setLoginOpen(true)} className="underline font-semibold text-[var(--am-ink)]" data-testid="wishlist-login-button">Inicia sesión con Google</button> para verla desde cualquier dispositivo.
    </p>
  );
}

export default function Wishlist() {
  const { wishlist } = useShopper();
  const { products } = useCatalog();
  const items = wishlist.map((s) => products.find((p) => p.slug === s)).filter(Boolean);
  return (
    <>
      <Seo title="Lista de deseos" noindex path="/lista-de-deseos" />
      <PageHead eyebrow="Guardados" title="Tu lista de deseos">Pulsa el corazón de cualquier producto para añadirlo o quitarlo.</PageHead>
      <div className="am-container" data-testid="wishlist-page">
        <SyncNote />
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
