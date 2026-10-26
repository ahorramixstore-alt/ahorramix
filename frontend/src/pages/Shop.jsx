import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { ProductGrid } from "@/components/shop/ProductCard";
import { useCatalog, inCategory, parentOf } from "@/hooks/useCatalog";
import { discountPct, slugify } from "@/lib/format";

const SORTS = { relevancia: "Relevancia", "precio-asc": "Precio: menor a mayor", "precio-desc": "Precio: mayor a menor", nombre: "Nombre A–Z" };

function CategoryTree({ categories, active }) {
  const tops = categories.filter((c) => !c.parent);
  const activeTop = parentOf(categories, active) || active;
  const item = (on) => `block py-1.5 text-[15px] transition-colors ${on ? "text-[var(--am-ink)] font-semibold" : "text-[var(--am-ink-2)] hover:text-[var(--am-ink)]"}`;
  return (
    <nav aria-label="Categorías" className="space-y-1">
      <Link to="/tienda" className={item(!active)} data-testid="category-filter-all">Todos los productos</Link>
      {tops.map((c) => (
        <div key={c.slug}>
          <Link to={`/categoria/${c.slug}`} className={item(active === c.slug)} data-testid={`category-filter-${c.slug}`}>{c.name}</Link>
          {activeTop === c.slug && (
            <div className="pl-4 border-l border-[var(--am-line)] ml-1 mb-2">
              {categories.filter((s) => s.parent === c.slug).map((s) => (
                <Link key={s.slug} to={`/categoria/${s.slug}`} className={item(active === s.slug)} data-testid={`category-filter-${s.slug}`}>{s.name}</Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function Shop() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const { products, categories, loading, error } = useCatalog();
  const q = params.get("q") || "";
  const offers = params.get("ofertas") === "1";
  const sort = params.get("orden") || "relevancia";
  const cat = categories.find((c) => c.slug === slug);

  const list = useMemo(() => {
    let r = inCategory(products, categories, slug);
    if (q) { const s = slugify(q); r = r.filter((p) => slugify(`${p.name} ${p.shortDescription} ${p.category}`).includes(s)); }
    if (offers) r = r.filter((p) => discountPct(p) > 0);
    const sorted = [...r];
    if (sort === "precio-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "nombre") sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return sorted;
  }, [products, categories, slug, q, offers, sort]);

  const set = (k, v) => { const n = new URLSearchParams(params); v ? n.set(k, v) : n.delete(k); setParams(n); };
  const title = cat ? cat.name : offers ? "Ofertas" : q ? `Resultados para “${q}”` : "Toda la tienda";
  const parent = cat?.parent ? categories.find((c) => c.slug === cat.parent) : null;

  return (
    <>
      <Seo title={title} description={cat?.description || "Catálogo de Ahorramix: hogar, tecnología, moda, bienestar y mascotas."} path={slug ? `/categoria/${slug}` : "/tienda"} noindex={Boolean(q)} />
      <section className="am-container pt-10 md:pt-14 pb-8">
        <nav className="text-[13px] text-[var(--am-ink-2)] mb-5" aria-label="Migas de pan">
          <Link to="/" className="hover:underline">Inicio</Link> / <Link to="/tienda" className="hover:underline">Tienda</Link>
          {parent && <> / <Link to={`/categoria/${parent.slug}`} className="hover:underline">{parent.name}</Link></>}
          {cat && <> / <span className="text-[var(--am-ink)]">{cat.name}</span></>}
        </nav>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight" data-testid="shop-title">{title}</h1>
        {cat?.description && <p className="mt-3 text-[var(--am-ink-2)] max-w-xl">{cat.description}</p>}
      </section>

      <div className="am-container grid lg:grid-cols-12 gap-10">
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 self-start"><CategoryTree categories={categories} active={slug} /></aside>
        <div className="lg:col-span-9">
          <div className="lg:hidden -mx-5 px-5 mb-6 flex gap-2 overflow-x-auto pb-1" data-lenis-prevent>
            <Link to="/tienda" className={`shrink-0 px-4 py-2 rounded-full text-sm border ${!slug ? "bg-[var(--am-ink)] text-white border-transparent" : "border-[var(--am-line)]"}`}>Todo</Link>
            {categories.filter((c) => !c.parent || c.parent === (parentOf(categories, slug) || slug)).map((c) => (
              <Link key={c.slug} to={`/categoria/${c.slug}`} data-testid={`mobile-category-chip-${c.slug}`} className={`shrink-0 px-4 py-2 rounded-full text-sm border ${slug === c.slug ? "bg-[var(--am-ink)] text-white border-transparent" : "border-[var(--am-line)]"}`}>{c.name}</Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-5 border-b border-[var(--am-line)]">
            <p className="text-sm text-[var(--am-ink-2)]" data-testid="shop-result-count">{list.length} productos</p>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={offers} onChange={(e) => set("ofertas", e.target.checked ? "1" : "")} data-testid="filter-offers-toggle" className="accent-[var(--am-emerald)] h-4 w-4" /> Solo ofertas
              </label>
              <select value={sort} onChange={(e) => set("orden", e.target.value === "relevancia" ? "" : e.target.value)} data-testid="shop-sort-select" aria-label="Ordenar"
                className="h-10 rounded-full border border-[var(--am-line)] bg-white px-4 text-sm outline-none focus:border-[var(--am-emerald)]">
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          {error ? <p className="py-20 text-center text-[var(--am-ink-2)]" data-testid="catalog-error">No se pudo cargar el catálogo. Inténtalo de nuevo más tarde.</p>
            : loading ? <p className="py-20 text-center text-[var(--am-ink-2)]">Cargando productos…</p>
            : <ProductGrid products={list} />}
        </div>
      </div>
    </>
  );
}
