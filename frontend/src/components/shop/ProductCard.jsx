import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { eur, discountPct } from "@/lib/format";

export function Price({ product, size = "md" }) {
  const big = size === "lg";
  const onSale = discountPct(product) > 0;
  return (
    <div className="flex items-baseline gap-2 flex-wrap" data-testid="product-price">
      <span className={`font-semibold ${big ? "text-3xl font-display" : "text-[15px]"} ${onSale ? "text-[var(--am-emerald)]" : ""}`}>{eur(product.price)}</span>
      {onSale && <span className={`line-through text-[var(--am-ink-2)] ${big ? "text-lg" : "text-[13px]"}`}>{eur(product.regularPrice)}</span>}
    </div>
  );
}

export function ProductCard({ product, index = 0 }) {
  const pct = discountPct(product);
  const img2 = product.images?.[1]?.src;
  return (
    <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }} data-testid={`product-card-${product.slug}`} className="group">
      <Link to={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[var(--am-bg-2)]">
          {product.images?.[0] && (
            <img src={product.images[0].src} alt={product.images[0].alt} loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] ${img2 ? "group-hover:opacity-0" : ""}`} />
          )}
          {img2 && <img src={img2} alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {pct > 0 && <span className="px-2.5 py-1 rounded-full bg-[var(--am-ink)] text-white text-[12px] font-semibold">−{pct}%</span>}
            {product.tags?.includes("novedad") && <span className="px-2.5 py-1 rounded-full bg-white text-[var(--am-ink)] text-[12px] font-semibold">Nuevo</span>}
          </div>
          <span className="absolute bottom-3 left-3 right-3 h-11 rounded-full bg-white/90 backdrop-blur text-sm font-medium grid place-items-center translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[transform,opacity] duration-300">Ver producto</span>
        </div>
        <div className="mt-4 space-y-1.5">
          <h3 className="font-medium text-[15px] leading-snug group-hover:underline underline-offset-4">{product.name}</h3>
          <Price product={product} />
          {product.attributes?.[0] && <p className="text-[12px] text-[var(--am-ink-2)]">{product.attributes[0].options.length} opciones de {product.attributes[0].name.toLowerCase()}</p>}
        </div>
      </Link>
    </motion.article>
  );
}

export function ProductGrid({ products }) {
  if (!products.length) return <p className="py-20 text-center text-[var(--am-ink-2)]" data-testid="products-empty">No hay productos que coincidan.</p>;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6" data-testid="product-grid">
      {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  );
}
