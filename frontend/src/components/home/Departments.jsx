import { Link } from "react-router-dom";
import { Reveal } from "@/components/layout/Reveal";
import { inCategory, topCategories } from "@/hooks/useCatalog";

// Tarjetas de departamento con 4 accesos, estilo marketplace, y listado de todos los departamentos.
export function Departments({ products, categories }) {
  const tops = topCategories(categories);
  const cards = tops.map((c) => {
    const tiles = categories.filter((s) => s.parent === c.slug).map((s) => ({ ...s, p: inCategory(products, categories, s.slug)[0] })).filter((s) => s.p).slice(0, 4);
    return { c, tiles };
  }).filter((x) => x.tiles.length >= 2).slice(0, 4);
  if (!tops.length) return null;
  return (
    <section className="am-container py-14 md:py-20" data-testid="departments-section">
      <Reveal className="mb-8"><h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">Compra por departamento</h2></Reveal>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ c, tiles }, i) => (
          <Reveal key={c.slug} delay={i * 0.06} className="h-full">
            <div className="h-full rounded-[24px] bg-white border border-[var(--am-line)] p-5 flex flex-col" data-testid={`department-card-${c.slug}`}>
              <h3 className="font-display text-xl font-extrabold">{c.name}</h3>
              <div className="mt-4 grid grid-cols-4 sm:grid-cols-2 gap-2 sm:gap-3 flex-1">
                {tiles.map((t) => (
                  <Link key={t.slug} to={`/categoria/${t.slug}`} className="group block">
                    <div className="aspect-square rounded-xl overflow-hidden bg-[var(--am-bg-2)]"><img src={t.p.images?.[0]?.src} alt={t.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /></div>
                    <p className="mt-1.5 text-[13px] font-medium leading-tight">{t.name}</p>
                  </Link>
                ))}
              </div>
              <Link to={`/categoria/${c.slug}`} className="mt-4 text-sm font-bold text-[var(--am-price)] hover:underline">Ver todo en {c.name}</Link>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2" data-testid="all-departments">
        {tops.map((c) => <Link key={c.slug} to={`/categoria/${c.slug}`} className="px-4 py-2 rounded-full border border-[var(--am-line)] bg-white text-sm font-medium hover:bg-[var(--am-ink)] hover:text-white transition-colors">{c.name}</Link>)}
      </div>
    </section>
  );
}
