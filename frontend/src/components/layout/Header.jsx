import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useShopper } from "@/context/ShopperContext";
import { useCatalog, topCategories } from "@/hooks/useCatalog";
import { HEADER_CATEGORIES } from "@/config/store";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";
import { DepartmentsMenu } from "./DepartmentsMenu";

const IconLink = ({ to, label, id, children, badge }) => (
  <Link to={to} data-testid={id} aria-label={label} className="relative flex flex-col items-center p-2 rounded-xl hover:bg-[var(--am-bg-2)] transition-colors">
    {children}
    <span className="hidden xl:block text-[11px] font-medium mt-0.5">{label}</span>
    {badge > 0 && <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] text-[10px] font-extrabold grid place-items-center">{badge}</span>}
  </Link>
);

export function Header() {
  const { count, setOpen } = useCart();
  const { wishlist } = useShopper();
  const { categories } = useCatalog();
  const tops = topCategories(categories);
  const subs = (slug) => categories.filter((c) => c.parent === slug);
  const link = "text-[14px] font-medium text-[var(--am-ink-2)] hover:text-[var(--am-ink)] transition-colors whitespace-nowrap";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#fbfbf9]/90 border-b border-[var(--am-line)]">
      <div className="am-container flex h-16 md:h-[72px] items-center gap-3 md:gap-6">
        <DepartmentsMenu trigger={<button data-testid="mobile-menu-button" className="lg:hidden -ml-2 p-2" aria-label="Todas las categorías"><Menu className="h-5 w-5" /></button>} />
        <Link to="/" aria-label="Ahorramix, inicio" className="shrink-0"><Logo /></Link>
        <div className="hidden md:block flex-1"><SearchBox id="header-search" /></div>
        <div className="ml-auto md:ml-0 flex items-center">
          <IconLink to="/lista-de-deseos" label="Deseos" id="header-wishlist-link" badge={wishlist.length}><Heart className="h-5 w-5" /></IconLink>
          <IconLink to="/cuenta" label="Cuenta" id="header-account-link"><User className="h-5 w-5" /></IconLink>
          <button data-testid="cart-drawer-toggle" onClick={() => setOpen(true)} aria-label="Abrir carrito" className="relative flex flex-col items-center p-2 rounded-xl hover:bg-[var(--am-bg-2)] transition-colors">
            <ShoppingBag className="h-5 w-5" /><span className="hidden xl:block text-[11px] font-medium mt-0.5">Carrito</span>
            {count > 0 && <span data-testid="cart-count-badge" className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] text-[10px] font-extrabold grid place-items-center">{count}</span>}
          </button>
        </div>
      </div>
      <div className="md:hidden am-container pb-3"><SearchBox id="mobile-search" compact /></div>
      <nav className="hidden lg:block border-t border-[var(--am-line)]" aria-label="Principal">
        <div className="am-container flex items-center gap-6 h-12">
          <DepartmentsMenu trigger={<button data-testid="all-categories-button" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--am-black)] text-white text-[13px] font-bold hover:bg-[var(--am-price)] transition-colors"><Menu className="h-4 w-4" /> Todas las categorías</button>} />
          {tops.slice(0, HEADER_CATEGORIES).map((c) => (
            <div key={c.slug} className="relative group h-full flex items-center">
              <NavLink to={`/categoria/${c.slug}`} data-testid={`nav-${c.slug}`} className={link}>{c.name}</NavLink>
              <div className="absolute left-0 top-full pt-2 opacity-0 pointer-events-none translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 transition-[opacity,transform] duration-200">
                <div className="min-w-[220px] rounded-2xl bg-white border border-[var(--am-line)] shadow-[0_18px_40px_rgba(14,16,21,0.10)] p-2">
                  {subs(c.slug).map((s) => <Link key={s.slug} to={`/categoria/${s.slug}`} className="block px-3 py-2 rounded-lg text-sm hover:bg-[var(--am-bg-2)]">{s.name}</Link>)}
                </div>
              </div>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Link to="/#ofertas-del-dia" data-testid="nav-daily-deals" className="px-4 py-1.5 rounded-full bg-[var(--am-yellow)] text-[var(--am-ink)] text-[13px] font-bold hover:bg-[var(--am-orange)] transition-colors whitespace-nowrap">Ofertas del día</Link>
            <NavLink to="/tienda?ofertas=1" data-testid="nav-ofertas" className="px-4 py-1.5 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] text-[13px] font-bold hover:bg-[var(--am-yellow)] transition-colors whitespace-nowrap">Todas las ofertas</NavLink>
          </div>
        </div>
      </nav>
      <div className="lg:hidden am-container pb-3 -mt-1 flex gap-2 overflow-x-auto [scrollbar-width:none]" data-lenis-prevent>
        <Link to="/tienda?ofertas=1" data-testid="mobile-chip-ofertas" className="shrink-0 px-3.5 py-1.5 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] text-[13px] font-bold">Ofertas</Link>
        {tops.map((c) => <Link key={c.slug} to={`/categoria/${c.slug}`} className="shrink-0 px-3.5 py-1.5 rounded-full bg-[var(--am-bg-2)] text-[13px] font-medium">{c.name}</Link>)}
      </div>
    </header>
  );
}
