import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/hooks/useCatalog";
import { NAV_CATEGORIES } from "@/config/store";
import { Logo } from "./Logo";

function SearchForm({ id, className = "" }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e) => { e.preventDefault(); navigate(`/tienda?q=${encodeURIComponent(q.trim())}`); };
  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--am-ink-2)]" />
      <input data-testid={`${id}-input`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar productos" aria-label="Buscar productos"
        className="w-full h-11 rounded-full bg-[var(--am-bg-2)] border border-transparent pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--am-emerald)] focus:bg-white" />
    </form>
  );
}

export function Header() {
  const { count, setOpen } = useCart();
  const { categories } = useCatalog();
  const [menu, setMenu] = useState(false);
  const tops = NAV_CATEGORIES.map((s) => categories.find((c) => c.slug === s)).filter(Boolean);
  const subs = (slug) => categories.filter((c) => c.parent === slug);
  const link = "text-[14px] font-medium text-[var(--am-ink-2)] hover:text-[var(--am-ink)] transition-colors";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#fbfbf9]/85 border-b border-[var(--am-line)]">
      <div className="am-container flex h-16 md:h-20 items-center gap-3">
        <Sheet open={menu} onOpenChange={setMenu}>
          <SheetTrigger asChild>
            <button data-testid="mobile-menu-button" className="lg:hidden -ml-2 p-2" aria-label="Abrir menú"><Menu className="h-5 w-5" /></button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto" data-lenis-prevent>
            <SheetTitle className="sr-only">Menú</SheetTitle>
            <div className="mt-6 space-y-6" onClick={(e) => e.target.closest("a") && setMenu(false)}>
              <Link to="/tienda" className="block font-display text-2xl font-bold">Toda la tienda</Link>
              {tops.map((c) => (
                <div key={c.slug}>
                  <Link to={`/categoria/${c.slug}`} data-testid={`mobile-nav-${c.slug}`} className="font-display text-xl font-bold">{c.name}</Link>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {subs(c.slug).map((s) => <Link key={s.slug} to={`/categoria/${s.slug}`} className="text-sm px-3 py-1.5 rounded-full bg-[var(--am-bg-2)]">{s.name}</Link>)}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t space-y-3 text-[15px]">
                <Link to="/tienda?ofertas=1" className="block">Ofertas</Link>
                <Link to="/sobre-nosotros" className="block">Sobre nosotros</Link>
                <Link to="/preguntas-frecuentes" className="block">Preguntas frecuentes</Link>
                <Link to="/contacto" className="block">Contacto</Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" aria-label="Ahorramix, inicio"><Logo /></Link>

        <nav className="hidden lg:flex items-center gap-7 ml-10" aria-label="Principal">
          {tops.map((c) => (
            <div key={c.slug} className="relative group">
              <NavLink to={`/categoria/${c.slug}`} data-testid={`nav-${c.slug}`} className={link}>{c.name}</NavLink>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 pointer-events-none translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 transition-[opacity,transform] duration-200">
                <div className="min-w-[200px] rounded-2xl bg-white border border-[var(--am-line)] shadow-[0_18px_40px_rgba(14,16,21,0.08)] p-2">
                  {subs(c.slug).map((s) => <Link key={s.slug} to={`/categoria/${s.slug}`} className="block px-3 py-2 rounded-lg text-sm hover:bg-[var(--am-bg-2)]">{s.name}</Link>)}
                </div>
              </div>
            </div>
          ))}
          <NavLink to="/tienda?ofertas=1" data-testid="nav-ofertas" className="text-[14px] font-semibold text-[var(--am-amber)]">Ofertas</NavLink>
        </nav>

        <SearchForm id="header-search" className="ml-auto hidden md:block w-56 xl:w-72" />

        <div className="ml-auto md:ml-2 flex items-center gap-1">
          <Link to="/cuenta" data-testid="header-account-link" aria-label="Mi cuenta" className="p-2.5 rounded-full hover:bg-[var(--am-bg-2)] transition-colors"><User className="h-5 w-5" /></Link>
          <button data-testid="cart-drawer-toggle" onClick={() => setOpen(true)} aria-label="Abrir carrito" className="relative p-2.5 rounded-full hover:bg-[var(--am-bg-2)] transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span data-testid="cart-count-badge" className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-[var(--am-emerald)] text-white text-[11px] font-bold grid place-items-center">{count}</span>}
          </button>
        </div>
      </div>
      <div className="md:hidden am-container pb-3"><SearchForm id="mobile-search" /></div>
    </header>
  );
}
