import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Seo } from "@/components/layout/Seo";
import { ProductGrid } from "@/components/shop/ProductCard";
import { Filters } from "@/components/shop/Filters";
import { useCatalog, inCategory } from "@/hooks/useCatalog";
import { discountPct, slugify } from "@/lib/format";

const SORTS = { relevancia: "Destacados", novedades: "Novedades", "precio-asc": "Precio: menor a mayor", "precio-desc": "Precio: mayor a menor", descuento: "Mayor descuento", valoracion: "Mejor valorados", nombre: "Nombre A–Z" };
const PAGE = 24;
const num = (v) => (v === null || v === "" ? null : Number(String(v).replace(",", ".")));

export default function Shop() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const { products, categories, loading, error } = useCatalog();
  const [limit, setLimit] = useState(PAGE);
  const [sheet, setSheet] = useState(false);
  const q = params.get("q") || "";
  const sort = params.get("orden") || "relevancia";
  const cat = categories.find((c) => c.slug === slug);
  const parent = cat?.parent ? categories.find((c) => c.slug === cat.parent) : null;

  useEffect(() => { setLimit(PAGE); }, [slug, params]);

  const base = useMemo(() => {
    let r = inCategory(products, categories, slug);
    if (q) { const s = slugify(q); r = r.filter((p) => slugify(`${p.name} ${p.shortDescription} ${p.category}`).includes(s)); }
    return r;
  }, [products, categories, slug, q]);

  const facets = useMemo(() => {
    const f = {};
    base.forEach((p) => (p.attributes || []).forEach((a) => a.options.forEach((o) => { f[a.name] = f[a.name] || {}; f[a.name][o] = (f[a.name][o] || 0) + 1; })));
    return f;
  }, [base]);

  const list = useMemo(() => {
    const min = num(params.get("min")); const max = num(params.get("max")); const rating = num(params.get("rating"));
    let r = base.filter((p) => (min === null || p.price >= min) && (max === null || p.price <= max)
      && (params.get("ofertas") !== "1" || discountPct(p) > 0) && (params.get("stock") !== "1" || p.stockStatus === "instock")
      && (!rating || (p.rating || 0) >= rating));
    Object.keys(facets).forEach((name) => {
      const chosen = (params.get(`f_${name}`) || "").split(",").filter(Boolean);
      if (chosen.length) r = r.filter((p) => p.attributes?.some((a) => a.name === name && a.options.some((o) => chosen.includes(o))));
    });
    const s = [...r];
    if (sort === "precio-asc") s.sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") s.sort((a, b) => b.price - a.price);
    if (sort === "descuento") s.sort((a, b) => discountPct(b) - discountPct(a));
    if (sort === "valoracion") s.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "novedades") s.sort((a, b) => Number(b.tags?.includes("novedad")) - Number(a.tags?.includes("novedad")) || b.id - a.id);
    if (sort === "nombre") s.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return s;
  }, [base, facets, params, sort]);

  const set = (obj) => { const n = new URLSearchParams(params); Object.entries(obj).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); setParams(n); };
  const activeKeys = [...params.keys()].filter((k) => !["q", "orden"].includes(k));
  const title = cat ? cat.name : params.get("ofertas") === "1" ? "Ofertas" : q ? `Resultados para “${q}”` : "Toda la tienda";
  const hasRatings = products.some((p) => p.rating > 0);
  const filters = <Filters categories={categories} active={slug} params={params} set={set} facets={facets} hasRatings={hasRatings} />;

  return (
    <>
      <Seo title={title} description={cat?.description || "Catálogo de Ahorramix por departamentos: hogar, electrónica, moda, deporte, mascotas y más."} path={slug ? `/categoria/${slug}` : "/tienda"} noindex={Boolean(q) || activeKeys.length > 0} />
      <section className="am-container pt-8 md:pt-10 pb-6">
        <nav className="text-[13px] text-[var(--am-ink-2)] mb-4" aria-label="Migas de pan">
          <Link to="/" className="hover:underline">Inicio</Link> / <Link to="/tienda" className="hover:underline">Tienda</Link>
          {parent && <> / <Link to={`/categoria/${parent.slug}`} className="hover:underline">{parent.name}</Link></>}
          {cat && <> / <span className="text-[var(--am-ink)]">{cat.name}</span></>}
        </nav>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight" data-testid="shop-title">{title}</h1>
        {cat && !cat.parent && (
          <div className="mt-5 flex gap-2 overflow-x-auto [scrollbar-width:none]" data-lenis-prevent>
            {categories.filter((c) => c.parent === cat.slug).map((s) => <Link key={s.slug} to={`/categoria/${s.slug}`} className="shrink-0 px-4 py-2 rounded-full bg-[var(--am-bg-2)] text-sm font-medium hover:bg-[var(--am-yellow)]">{s.name}</Link>)}
          </div>
        )}
      </section>

      <div className="am-container grid lg:grid-cols-12 gap-10">
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 sticky top-36 self-start max-h-[calc(100vh-10rem)] overflow-y-auto pr-2" data-lenis-prevent>{filters}</aside>
        <div className="lg:col-span-9 xl:col-span-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[var(--am-line)]">
            <p className="text-sm text-[var(--am-ink-2)]" data-testid="shop-result-count">{list.length} resultados</p>
            <div className="flex items-center gap-2">
              <Sheet open={sheet} onOpenChange={setSheet}>
                <SheetTrigger asChild><button data-testid="mobile-filters-button" className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[var(--am-line)] text-sm font-semibold"><SlidersHorizontal className="h-4 w-4" /> Filtros{activeKeys.length ? ` (${activeKeys.length})` : ""}</button></SheetTrigger>
                <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto" data-lenis-prevent><SheetTitle className="font-display text-2xl font-extrabold mb-6">Filtros</SheetTitle>{filters}</SheetContent>
              </Sheet>
              <select value={sort} onChange={(e) => set({ orden: e.target.value === "relevancia" ? "" : e.target.value })} data-testid="shop-sort-select" aria-label="Ordenar"
                className="h-10 rounded-full border border-[var(--am-line)] bg-white px-4 text-sm outline-none focus:border-[var(--am-orange)]">
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>Ordenar: {v}</option>)}
              </select>
            </div>
          </div>
          {activeKeys.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6" data-testid="active-filters">
              {activeKeys.map((k) => <button key={k} onClick={() => set({ [k]: "" })} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--am-yellow)] text-[13px] font-semibold">{k.replace("f_", "")}: {params.get(k)} <X className="h-3 w-3" /></button>)}
              <button onClick={() => setParams(q ? { q } : {})} data-testid="clear-filters" className="text-[13px] underline">Borrar filtros</button>
            </div>
          )}
          {error ? <p className="py-20 text-center text-[var(--am-ink-2)]" data-testid="catalog-error">No se pudo cargar el catálogo. Inténtalo de nuevo más tarde.</p>
            : loading ? <p className="py-20 text-center text-[var(--am-ink-2)]">Cargando productos…</p>
            : base.length === 0 && cat ? <p className="py-20 text-center text-[var(--am-ink-2)]" data-testid="category-empty">Todavía no hay productos en {cat.name}. Vuelve pronto.</p>
            : <ProductGrid products={list.slice(0, limit)} wide />}
          {list.length > limit && (
            <div className="mt-12 text-center">
              <p className="text-sm text-[var(--am-ink-2)] mb-3">Mostrando {limit} de {list.length}</p>
              <button onClick={() => setLimit((l) => l + PAGE)} data-testid="load-more-button" className="px-8 py-3.5 rounded-full bg-[var(--am-black)] text-white font-bold hover:bg-[var(--am-price)] transition-colors">Cargar más productos</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
