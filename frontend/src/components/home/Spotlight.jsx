import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Price } from "@/components/shop/ProductCard";
import { discountPct } from "@/lib/format";

export function Spotlight({ product }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  if (!product) return null;
  return (
    <section ref={ref} className="am-container py-16 md:py-24" data-testid="home-spotlight">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center rounded-[32px] bg-[var(--am-bg-2)] p-5 md:p-10">
        <div className="md:col-span-7 relative aspect-[4/3] md:aspect-[5/4] rounded-[24px] overflow-hidden bg-[#e9e4dc]">
          <motion.img style={{ y, scale: 1.18 }} src={product.images?.[0]?.src} alt={product.images?.[0]?.alt || product.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="md:col-span-5 md:pr-6 pb-4 md:pb-0">
          <p className="font-mono-am text-[12px] uppercase tracking-[0.25em] text-[var(--am-amber)] mb-4">En oferta · −{discountPct(product)}%</p>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.02]">{product.name}</h2>
          <p className="mt-4 text-[var(--am-ink-2)] leading-relaxed">{product.shortDescription}</p>
          <div className="mt-6"><Price product={product} size="lg" /></div>
          <Link to={`/producto/${product.slug}`} data-testid="spotlight-cta" className="mt-8 inline-flex px-7 py-4 rounded-full bg-[var(--am-emerald)] hover:bg-[var(--am-emerald-ink)] text-white font-semibold transition-colors">Ver producto</Link>
        </div>
      </div>
    </section>
  );
}
