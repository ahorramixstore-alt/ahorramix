import { Link } from "react-router-dom";
import { Reveal } from "@/components/layout/Reveal";
import { inCategory } from "@/hooks/useCatalog";

export function CategoryStrip({ products, categories }) {
  const subs = categories.filter((c) => c.parent).map((c) => ({ ...c, img: c.image || inCategory(products, categories, c.slug)[0]?.images?.[0]?.src, n: inCategory(products, categories, c.slug).length })).filter((c) => c.n > 0);
  if (!subs.length) return null;
  return (
    <section className="am-container pt-16 md:pt-20" data-testid="category-strip">
      <Reveal className="flex items-end justify-between mb-7">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">Explora por categoría</h2>
        <Link to="/tienda" className="text-sm font-semibold underline underline-offset-4">Ver todo</Link>
      </Reveal>
      <div className="-mx-5 px-5 scroll-px-5 md:mx-0 md:px-0 md:scroll-px-0 flex md:grid md:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4 overflow-x-auto snap-x pb-2 [scrollbar-width:none]" data-lenis-prevent>
        {subs.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 7) * 0.04} className="shrink-0 w-[30vw] sm:w-[150px] md:w-auto snap-start">
            <Link to={`/categoria/${c.slug}`} data-testid={`category-strip-${c.slug}`} className="group block">
              <div className="aspect-square rounded-[22px] overflow-hidden bg-[var(--am-bg-2)] ring-0 ring-[var(--am-orange)] group-hover:ring-4 transition-[box-shadow]">
                {c.img && <img src={c.img} alt={`Categoría ${c.name}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
              </div>
              <p className="mt-2.5 text-[14px] font-semibold leading-tight">{c.name}</p>
              <p className="text-[12px] text-[var(--am-ink-2)]">{c.n} {c.n === 1 ? "producto" : "productos"}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
