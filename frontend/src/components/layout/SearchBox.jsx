import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useCatalog } from "@/hooks/useCatalog";
import { eur, slugify } from "@/lib/format";

// Buscador con selector de departamento y sugerencias instantáneas.
export function SearchBox({ id, compact = false }) {
  const { products, categories } = useCatalog();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [focus, setFocus] = useState(false);
  const blur = useRef(null);
  const navigate = useNavigate();
  const tops = categories.filter((c) => !c.parent);
  const s = slugify(q);

  const results = useMemo(() => {
    if (s.length < 2) return { items: [], cats: [] };
    const items = products.filter((p) => slugify(`${p.name} ${p.shortDescription}`).includes(s)).slice(0, 6);
    const cats = categories.filter((c) => slugify(c.name).includes(s)).slice(0, 4);
    return { items, cats };
  }, [s, products, categories]);

  const submit = (e) => {
    e.preventDefault();
    setFocus(false);
    const qs = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    navigate(cat ? `/categoria/${cat}${qs}` : `/tienda${qs}`);
  };
  const open = focus && (results.items.length > 0 || results.cats.length > 0);

  return (
    <form role="search" onSubmit={submit} className="relative w-full" onFocus={() => { clearTimeout(blur.current); setFocus(true); }} onBlur={() => { blur.current = setTimeout(() => setFocus(false), 150); }}>
      <div className="flex h-11 rounded-full bg-[var(--am-bg-2)] border-2 border-transparent focus-within:border-[var(--am-orange)] focus-within:bg-white overflow-hidden transition-colors">
        {!compact && (
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Departamento" data-testid={`${id}-category-select`} className="hidden lg:block max-w-[150px] bg-[#e9e9e4] text-[13px] font-medium px-3 outline-none border-r border-[var(--am-line)]">
            <option value="">Todos</option>
            {tops.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        )}
        <input data-testid={`${id}-input`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca productos, marcas o categorías" aria-label="Buscar productos" className="flex-1 min-w-0 bg-transparent px-4 text-sm outline-none" />
        <button type="submit" aria-label="Buscar" data-testid={`${id}-submit`} className="px-4 bg-[var(--am-orange)] text-[var(--am-ink)] hover:bg-[var(--am-yellow)] transition-colors"><Search className="h-4 w-4" /></button>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white border border-[var(--am-line)] shadow-[0_24px_50px_rgba(14,16,21,0.14)] overflow-hidden" data-testid={`${id}-suggestions`} data-lenis-prevent>
          {results.cats.length > 0 && (
            <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-[var(--am-line)]">
              {results.cats.map((c) => <Link key={c.slug} to={`/categoria/${c.slug}`} onClick={() => setFocus(false)} className="px-3 py-1 rounded-full bg-[var(--am-bg-2)] text-[13px] hover:bg-[var(--am-yellow)]">{c.name}</Link>)}
            </div>
          )}
          {results.items.map((p) => (
            <Link key={p.id} to={`/producto/${p.slug}`} onClick={() => { setFocus(false); setQ(""); }} data-testid={`${id}-suggestion-${p.slug}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--am-bg-2)]">
              <img src={p.images?.[0]?.src} alt="" className="h-11 w-11 rounded-lg object-cover bg-[var(--am-bg-2)]" />
              <span className="flex-1 text-sm leading-snug">{p.name}</span>
              <span className="text-sm font-bold text-[var(--am-price)]">{eur(p.price)}</span>
            </Link>
          ))}
          <button type="submit" className="w-full text-left px-4 py-3 text-sm font-semibold border-t border-[var(--am-line)] hover:bg-[var(--am-bg-2)]">Ver todos los resultados de “{q}”</button>
        </div>
      )}
    </form>
  );
}
