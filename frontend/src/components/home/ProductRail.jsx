import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal } from "@/components/layout/Reveal";
import { ProductGrid } from "@/components/shop/ProductCard";

export function ProductRail({ eyebrow, title, products, link, id }) {
  if (!products.length) return null;
  return (
    <section className="am-container py-16 md:py-20" data-testid={id}>
      <Reveal className="flex items-end justify-between gap-6 mb-10">
        <div>
          <p className="font-mono-am text-[12px] uppercase tracking-[0.25em] text-[var(--am-emerald)] mb-3">{eyebrow}</p>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h2>
        </div>
        {link && <Link to={link} className="text-sm font-medium underline underline-offset-4 shrink-0">Ver todo</Link>}
      </Reveal>
      <ProductGrid products={products.slice(0, 4)} />
    </section>
  );
}

export function ProductTabs({ tabs, note }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) || tabs[0];
  if (!current) return null;
  return (
    <section className="am-container py-16 md:py-20" data-testid="product-tabs">
      <Reveal>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-10" role="tablist">
          {tabs.map((t) => (
            <button key={t.key} role="tab" aria-selected={t.key === active} data-testid={`product-tab-${t.key}`} onClick={() => setActive(t.key)}
              className={`relative px-4 md:px-5 py-2.5 font-display text-xl md:text-3xl font-bold tracking-tight transition-colors ${t.key === active ? "text-white" : "text-[var(--am-ink-2)] hover:text-[var(--am-ink)]"}`}>
              {t.key === active && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-[var(--am-ink)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
        {note && <p className="-mt-6 mb-8 text-[13px] text-[var(--am-ink-2)]">{note}</p>}
      </Reveal>
      <ProductGrid key={current.key} products={current.products.slice(0, 8)} />
    </section>
  );
}
