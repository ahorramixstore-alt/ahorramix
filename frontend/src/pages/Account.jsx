import { Link } from "react-router-dom";
import { LogOut, Package, Heart } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";
import { useAuth } from "@/context/AuthContext";
import { useShopper } from "@/context/ShopperContext";
import { getAccountUrl } from "@/lib/commerce";
import { eur } from "@/lib/format";

function Profile({ user, logout }) {
  return (
    <div className="rounded-[24px] border border-[var(--am-line)] bg-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5" data-testid="account-profile">
      {user.avatar
        ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="h-16 w-16 rounded-full object-cover" />
        : <span className="h-16 w-16 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] text-2xl font-extrabold grid place-items-center">{(user.name || "?").charAt(0)}</span>}
      <div className="flex-1 min-w-0">
        <p className="font-display text-2xl font-extrabold" data-testid="account-name">{user.name}</p>
        <p className="text-[var(--am-ink-2)] truncate" data-testid="account-email">{user.email}</p>
        {user.demo && <p className="mt-1 text-[12px] text-[var(--am-amber)]" data-testid="account-demo-badge">Perfil de prueba guardado solo en este navegador</p>}
      </div>
      <button onClick={logout} data-testid="account-logout-button" className="inline-flex items-center gap-2 px-5 h-11 rounded-full border border-[var(--am-line)] text-sm font-semibold hover:bg-[var(--am-bg-2)] transition-colors">
        <LogOut className="h-4 w-4" /> Cerrar sesión
      </button>
    </div>
  );
}

function Orders({ orders }) {
  const list = Array.isArray(orders) ? orders : [];
  return (
    <div className="rounded-[24px] border border-[var(--am-line)] bg-white p-6 md:p-8" data-testid="account-orders">
      <h2 className="font-display text-xl font-bold">Mis pedidos</h2>
      {list.length === 0 ? (
        <div className="mt-4 text-[var(--am-ink-2)]" data-testid="account-orders-empty">
          Aún no tienes pedidos. <Link to="/tienda" className="underline font-medium text-[var(--am-ink)]">Descubre las ofertas</Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-[var(--am-line)]">
          {list.map((o) => (
            <li key={o.number} className="py-4 flex flex-wrap items-center gap-x-6 gap-y-1" data-testid={`account-order-${o.number}`}>
              <Package className="h-5 w-5 text-[var(--am-orange)]" />
              <span className="font-bold">Pedido #{o.number}</span>
              <span className="text-sm text-[var(--am-ink-2)]">{o.date}</span>
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-[var(--am-bg-2)]">{o.status}</span>
              <span className="ml-auto font-bold">{eur(Number(o.total) || 0)}</span>
              {o.url && <a href={o.url} className="text-sm underline">Ver detalle</a>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function WishCard() {
  const { wishlist } = useShopper();
  return (
    <Link to="/lista-de-deseos" data-testid="account-wishlist-link" className="flex items-center gap-4 rounded-[24px] border border-[var(--am-line)] bg-white p-6 hover:border-[var(--am-orange)] transition-colors">
      <Heart className="h-6 w-6 text-[var(--am-orange)]" />
      <span className="flex-1"><strong className="block font-display text-lg">Mi lista de deseos</strong><span className="text-sm text-[var(--am-ink-2)]">Guardada en tu cuenta, en todos tus dispositivos</span></span>
      <span className="font-bold" data-testid="account-wishlist-count">{wishlist.length}</span>
    </Link>
  );
}

export default function Account() {
  const { user, setLoginOpen, logout } = useAuth();
  const wcAccount = getAccountUrl();
  return (
    <>
      <Seo title="Mi cuenta" noindex path="/cuenta" />
      <PageHead eyebrow="Cuenta de cliente" title={user ? `Hola, ${user.firstName || user.name}` : "Mi cuenta"}>
        {user ? "Aquí tienes tu perfil y tus pedidos." : "Inicia sesión con tu cuenta de Google para ver tus pedidos y comprar más rápido."}
      </PageHead>
      <div className="am-container max-w-3xl space-y-6">
        {user ? (
          <>
            <Profile user={user} logout={logout} />
            <WishCard />
            <Orders orders={user.orders} />
            {wcAccount && !user.demo && <a href={wcAccount} data-testid="account-manage-link" className="inline-flex text-sm underline">Gestionar direcciones y datos de facturación</a>}
          </>
        ) : (
          <button onClick={() => setLoginOpen(true)} data-testid="account-login-link" className="inline-flex px-8 py-4 rounded-full bg-[var(--am-black)] text-white font-semibold hover:bg-[var(--am-orange)] hover:text-[var(--am-ink)] transition-colors">
            Iniciar sesión con Google
          </button>
        )}
      </div>
    </>
  );
}
