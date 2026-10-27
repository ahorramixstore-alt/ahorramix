import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Baby, Bike, Car, ChevronRight, Flower2, Headphones, Laptop, Luggage, PawPrint, Shirt, Sofa, Sparkles, Tag } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCatalog, inCategory, topCategories } from "@/hooks/useCatalog";

const ICONS = { Sofa, Headphones, Laptop, Shirt, Sparkles, Bike, PawPrint, Baby, Flower2, Car, Luggage };

// Menú lateral "Todas las categorías" con navegación por niveles, estilo marketplace.
export function DepartmentsMenu({ trigger }) {
  const { products, categories } = useCatalog();
  const [open, setOpen] = useState(false);
  const [dept, setDept] = useState(null);
  const tops = topCategories(categories);
  const current = categories.find((c) => c.slug === dept);
  const subs = categories.filter((c) => c.parent === dept);
  const count = (slug) => inCategory(products, categories, slug).length;
  const close = () => { setOpen(false); setDept(null); };
  const row = "flex items-center justify-between w-full px-6 py-3.5 text-left text-[15px] hover:bg-[var(--am-bg-2)] transition-colors";

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) setDept(null); }}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm p-0 overflow-y-auto" data-lenis-prevent data-testid="departments-menu">
        <div className="bg-[var(--am-ink)] text-white px-6 py-5">
          <SheetTitle className="font-display text-xl font-extrabold text-white">{current ? current.name : "Todas las categorías"}</SheetTitle>
        </div>
        {!current ? (
          <div className="py-2">
            <Link to="/tienda?ofertas=1" onClick={close} className={`${row} font-bold text-[var(--am-price)]`}>Ofertas</Link>
            <Link to="/#ofertas-del-dia" onClick={close} className={row}>Ofertas del día</Link>
            <p className="px-6 pt-4 pb-1 text-[12px] font-mono-am uppercase tracking-[0.2em] text-[var(--am-ink-2)]">Departamentos</p>
            {tops.map((c) => {
              const Icon = ICONS[c.icon] || Tag;
              return (
                <button key={c.slug} onClick={() => setDept(c.slug)} data-testid={`dept-${c.slug}`} className={row}>
                  <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-[var(--am-ink-2)]" />{c.name}</span>
                  <ChevronRight className="h-4 w-4 text-[var(--am-ink-2)]" />
                </button>
              );
            })}
            <p className="px-6 pt-4 pb-1 text-[12px] font-mono-am uppercase tracking-[0.2em] text-[var(--am-ink-2)]">Ayuda y ajustes</p>
            {[["/cuenta", "Mi cuenta"], ["/lista-de-deseos", "Lista de deseos"], ["/seguimiento", "Seguimiento de pedidos"], ["/preguntas-frecuentes", "Preguntas frecuentes"], ["/contacto", "Contacto"]].map(([to, l]) => (
              <Link key={to} to={to} onClick={close} className={row}>{l}</Link>
            ))}
          </div>
        ) : (
          <div className="py-2">
            <button onClick={() => setDept(null)} data-testid="dept-back" className={`${row} font-semibold justify-start gap-2`}><ArrowLeft className="h-4 w-4" /> Menú principal</button>
            <Link to={`/categoria/${current.slug}`} onClick={close} className={`${row} font-bold`}>Ver todo en {current.name} <span className="text-[13px] text-[var(--am-ink-2)]">{count(current.slug)}</span></Link>
            {subs.map((s) => (
              <Link key={s.slug} to={`/categoria/${s.slug}`} onClick={close} data-testid={`dept-sub-${s.slug}`} className={row}>{s.name}<span className="text-[13px] text-[var(--am-ink-2)]">{count(s.slug)}</span></Link>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
