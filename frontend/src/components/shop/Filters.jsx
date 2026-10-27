import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { parentOf } from "@/hooks/useCatalog";

const Title = ({ children }) => <h3 className="font-display text-[15px] font-extrabold mb-3">{children}</h3>;
const PRICE_RANGES = [[0, 15], [15, 30], [30, 50], [50, 100], [100, ""]];

function CategoryTree({ categories, active }) {
  const tops = categories.filter((c) => !c.parent);
  const activeTop = parentOf(categories, active) || active;
  const item = (on) => `block py-1 text-[14px] transition-colors ${on ? "text-[var(--am-ink)] font-bold" : "text-[var(--am-ink-2)] hover:text-[var(--am-ink)]"}`;
  return (
    <nav aria-label="Departamentos">
      <Link to="/tienda" className={item(!active)} data-testid="category-filter-all">Todos los departamentos</Link>
      {tops.map((c) => (
        <div key={c.slug}>
          <Link to={`/categoria/${c.slug}`} className={item(active === c.slug)} data-testid={`category-filter-${c.slug}`}>{c.name}</Link>
          {activeTop === c.slug && (
            <div className="pl-3 border-l-2 border-[var(--am-orange)] ml-1 my-1">
              {categories.filter((s) => s.parent === c.slug).map((s) => <Link key={s.slug} to={`/categoria/${s.slug}`} className={item(active === s.slug)} data-testid={`category-filter-${s.slug}`}>{s.name}</Link>)}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export function Filters({ categories, active, params, set, facets, hasRatings }) {
  const min = params.get("min") || "";
  const max = params.get("max") || "";
  const check = "accent-[var(--am-orange)] h-4 w-4";
  return (
    <div className="space-y-8" data-testid="shop-filters">
      <div><Title>Departamento</Title><CategoryTree categories={categories} active={active} /></div>
      <div>
        <Title>Precio</Title>
        <div className="space-y-1.5">
          {PRICE_RANGES.map(([a, b]) => {
            const on = min === String(a) && max === String(b);
            return (
              <button key={a} data-testid={`price-range-${a}`} onClick={() => { set({ min: on ? "" : String(a), max: on ? "" : String(b) }); }}
                className={`block text-[14px] ${on ? "font-bold text-[var(--am-ink)]" : "text-[var(--am-ink-2)] hover:text-[var(--am-ink)]"}`}>
                {b === "" ? `Más de ${a} €` : a === 0 ? `Hasta ${b} €` : `${a} € a ${b} €`}
              </button>
            );
          })}
        </div>
        <form className="mt-3 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.target); set({ min: f.get("min"), max: f.get("max") }); }}>
          <input name="min" defaultValue={min} key={`min${min}`} inputMode="decimal" placeholder="Mín" data-testid="price-min-input" className="flex-1 min-w-0 h-9 rounded-lg border border-[var(--am-line)] px-2 text-sm" />
          <input name="max" defaultValue={max} key={`max${max}`} inputMode="decimal" placeholder="Máx" data-testid="price-max-input" className="flex-1 min-w-0 h-9 rounded-lg border border-[var(--am-line)] px-2 text-sm" />
          <button className="shrink-0 h-9 px-3 rounded-lg bg-[var(--am-black)] text-white text-sm font-bold" data-testid="price-apply">Ir</button>
        </form>
      </div>
      {hasRatings && (
        <div>
          <Title>Valoración de clientes</Title>
          {[4, 3].map((r) => (
            <button key={r} onClick={() => set({ rating: params.get("rating") === String(r) ? "" : String(r) })} data-testid={`rating-filter-${r}`}
              className={`flex items-center gap-1 text-[14px] py-0.5 ${params.get("rating") === String(r) ? "font-bold" : "text-[var(--am-ink-2)]"}`}>
              {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= r ? "fill-[var(--am-orange)] text-[var(--am-orange)]" : "text-[var(--am-line)]"}`} />)} o más
            </button>
          ))}
        </div>
      )}
      <div className="space-y-2.5">
        <Title>Disponibilidad y ofertas</Title>
        <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" className={check} checked={params.get("stock") === "1"} onChange={(e) => set({ stock: e.target.checked ? "1" : "" })} data-testid="filter-stock-toggle" /> Solo en stock</label>
        <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" className={check} checked={params.get("ofertas") === "1"} onChange={(e) => set({ ofertas: e.target.checked ? "1" : "" })} data-testid="filter-offers-toggle" /> Solo ofertas</label>
      </div>
      {Object.entries(facets).map(([name, opts]) => {
        const key = `f_${name}`;
        const chosen = (params.get(key) || "").split(",").filter(Boolean);
        return (
          <div key={name}>
            <Title>{name}</Title>
            <div className="flex flex-wrap gap-2">
              {Object.entries(opts).map(([o, n]) => {
                const on = chosen.includes(o);
                const next = on ? chosen.filter((x) => x !== o) : [...chosen, o];
                return <button key={o} onClick={() => set({ [key]: next.join(",") })} data-testid={`facet-${name}-${o}`} className={`px-3 py-1.5 rounded-full border text-[13px] ${on ? "bg-[var(--am-black)] text-white border-[var(--am-black)]" : "border-[var(--am-line)] hover:border-[var(--am-ink)]"}`}>{o} <span className="opacity-60">{n}</span></button>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
