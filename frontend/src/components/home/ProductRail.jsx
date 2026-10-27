import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/layout/Reveal";
import { ProductCard, ProductGrid } from "@/components/shop/ProductCard";

export function ProductScroller({ eyebrow, title, products, link, id, min = 3 }) {
  const track = useRef(null);
  if (products.length < min) return null;
  const move = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="am-container py-12 md:py-16" data-testid={id}>
      <Reveal className="flex items-end justify-between gap-6 mb-8">
        <div>
          <p className="font-mono-am text-[12px] uppercase tracking-[0.25em] text-[var(--am-price)] mb-2">{eyebrow}</p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {link && <Link to={link} className="text-sm font-semibold underline underline-offset-4 mr-2">Ver todo</Link>}
          <button onClick={() => move(-1)} aria-label="Anterior" data-testid={`${id}-prev`} className="hidden md:grid h-10 w-10 rounded-full border border-[var(--am-line)] place-items-center hover:bg-[var(--am-ink)] hover:text-white transition-colors"><ArrowLeft className="h-4 w-4" /></button>
          <button onClick={() => move(1)} aria-label="Siguiente" data-testid={`${id}-next`} className="hidden md:grid h-10 w-10 rounded-full border border-[var(--am-line)] place-items-center hover:bg-[var(--am-ink)] hover:text-white transition-colors"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </Reveal>
      <div ref={track} className="-mx-5 px-5 scroll-px-5 md:mx-0 md:px-0 md:scroll-px-0 flex gap-4 md:gap-5 overflow-x-auto snap-x scroll-smooth pb-2 [scrollbar-width:none]" data-lenis-prevent>
        {products.map((p, i) => <div key={p.id} className="shrink-0 w-[46vw] sm:w-[240px] lg:w-[calc((100%-4*1.25rem)/5)] snap-start"><ProductCard product={p} index={i} /></div>)}
      </div>
    </section>
  );
}

export function ProductTabs({ tabs, note }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) || tabs[0];
  if (!current) return null;
  return (
    <section className="am-container py-14 md:py-20" data-testid="product-tabs">
      <Reveal>
        <div className="flex flex-wrap items-center gap-2 mb-8" role="tablist">
          {tabs.map((t) => (
            <button key={t.key} role="tab" aria-selected={t.key === active} data-testid={`product-tab-${t.key}`} onClick={() => setActive(t.key)}
              className={`relative px-5 py-2.5 rounded-full font-display text-lg md:text-2xl font-extrabold tracking-tight transition-colors ${t.key === active ? "text-[var(--am-ink)]" : "text-[var(--am-ink-2)] hover:text-[var(--am-ink)]"}`}>
              {t.key === active && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-[var(--am-yellow)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{t.label} <span className="text-[0.6em] align-top opacity-70">{t.products.length}</span></span>
            </button>
          ))}
        </div>
        {note && <p className="-mt-4 mb-8 text-[13px] text-[var(--am-ink-2)]">{note}</p>}
      </Reveal>
      <ProductGrid key={current.key} products={current.products.slice(0, 10)} wide />
    </section>
  );
}
