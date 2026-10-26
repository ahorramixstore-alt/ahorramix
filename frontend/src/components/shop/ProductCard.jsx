import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { eur, discountPct } from "@/lib/format";
import { QuickView } from "./QuickView";

export function Price({ product, size = "md" }) {
  const big = size === "lg";
  const onSale = discountPct(product) > 0;
  return (
    <div className="flex items-baseline gap-2 flex-wrap" data-testid="product-price">
      <span className={`font-display font-extrabold ${big ? "text-3xl" : "text-[17px]"} ${onSale ? "text-[var(--am-price)]" : ""}`}>{eur(product.price)}</span>
      {onSale && <span className={`line-through text-[var(--am-ink-2)] ${big ? "text-lg" : "text-[13px]"}`}>{eur(product.regularPrice)}</span>}
    </div>
  );
}

export function ProductCard({ product, index = 0 }) {
  const pct = discountPct(product);
  const img2 = product.images?.[1]?.src;
  const href = `/producto/${product.slug}`;
  return (
    <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: (index % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }} data-testid={`product-card-${product.slug}`} className="group">
      <div className="relative">
        <Link to={href} className="block relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[var(--am-bg-2)]" tabIndex={-1} aria-hidden="true">
          {product.images?.[0] && (
            <img src={product.images[0].src} alt={product.images[0].alt} loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.05] ${img2 ? "group-hover:opacity-0" : ""}`} />
          )}
          {img2 && <img src={img2} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
        </Link>
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 pointer-events-none">
          {pct > 0 && <span className="px-2.5 py-1 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] text-[12px] font-extrabold">−{pct}%</span>}
          {product.tags?.includes("novedad") && <span className="px-2.5 py-1 rounded-full bg-[var(--am-ink)] text-white text-[12px] font-bold">Nuevo</span>}
          {product.tags?.includes("mas-vendido") && <span className="px-2.5 py-1 rounded-full bg-white text-[var(--am-ink)] text-[12px] font-bold">Top ventas</span>}
        </div>
        <QuickView product={product} />
      </div>
      <Link to={href} className="block mt-3.5 space-y-1">
        <h3 className="font-medium text-[15px] leading-snug group-hover:underline underline-offset-4 line-clamp-2">{product.name}</h3>
        <Price product={product} />
        {pct > 0 && <p className="text-[12px] font-semibold text-[var(--am-emerald)]">Ahorras {eur(product.regularPrice - product.price)}</p>}
        {!pct && product.attributes?.[0] && <p className="text-[12px] text-[var(--am-ink-2)]">{product.attributes[0].options.length} opciones de {product.attributes[0].name.toLowerCase()}</p>}
      </Link>
    </motion.article>
  );
}

export function ProductGrid({ products, wide = false }) {
  if (!products.length) return <p className="py-20 text-center text-[var(--am-ink-2)]" data-testid="products-empty">No hay productos que coincidan.</p>;
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 ${wide ? "xl:grid-cols-5" : "lg:grid-cols-4"} gap-x-4 gap-y-10 md:gap-x-5`} data-testid="product-grid">
      {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  );
}
