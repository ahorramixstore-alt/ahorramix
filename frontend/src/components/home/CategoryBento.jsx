import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/layout/Reveal";
import { inCategory } from "@/hooks/useCatalog";
import { NAV_CATEGORIES } from "@/config/store";

const SPANS = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-6",
  "md:col-span-6",
];

export function CategoryBento({ products, categories }) {
  const tops = NAV_CATEGORIES.map((s) => categories.find((c) => c.slug === s)).filter(Boolean).slice(0, 5);
  if (!tops.length) return null;
  return (
    <section className="am-container py-20 md:py-28" data-testid="category-bento">
      <Reveal className="flex items-end justify-between gap-6 mb-10">
        <div>
          <p className="font-mono-am text-[12px] uppercase tracking-[0.25em] text-[var(--am-emerald)] mb-3">Categorías</p>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">Compra por espacio</h2>
        </div>
        <Link to="/tienda" className="hidden sm:inline-flex text-sm font-medium underline underline-offset-4">Ver toda la tienda</Link>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[220px] md:auto-rows-[250px] gap-4">
        {tops.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.07} className={SPANS[i]}>
            <Link to={`/categoria/${c.slug}`} data-testid={`bento-category-${c.slug}`} className="group relative block h-full rounded-[24px] overflow-hidden bg-[var(--am-bg-2)]">
              {c.image && <img src={c.image} alt={`Categoría ${c.name}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 flex items-end justify-between text-white">
                <div>
                  <p className="text-[12px] font-mono-am uppercase tracking-[0.2em] text-white/80">{inCategory(products, categories, c.slug).length} productos</p>
                  <h3 className={`font-display font-extrabold tracking-tight ${i === 0 ? "text-4xl md:text-6xl" : "text-3xl"}`}>{c.name}</h3>
                </div>
                <span className="h-11 w-11 rounded-full bg-white text-[var(--am-ink)] grid place-items-center transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
