import { useEffect, useState } from "react";
import { Facebook, Heart, Link2, MessageCircle, Ruler, Star } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useShopper } from "@/context/ShopperContext";
import { fetchReviews } from "@/lib/commerce";
import { eur } from "@/lib/format";

export function Stars({ value, count, size = "h-4 w-4" }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1" data-testid="product-rating" aria-label={`${value.toFixed(1)} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`${size} ${n <= Math.round(value) ? "fill-[var(--am-orange)] text-[var(--am-orange)]" : "text-[var(--am-line)]"}`} />)}
      {count !== undefined && <span className="text-[13px] text-[var(--am-ink-2)] ml-1">({count})</span>}
    </span>
  );
}

export function WishButton({ product, className = "" }) {
  const { isWished, toggleWish } = useShopper();
  const on = isWished(product.slug);
  return (
    <button onClick={() => toggleWish(product)} aria-pressed={on} aria-label={on ? "Quitar de la lista de deseos" : "Añadir a la lista de deseos"} data-testid={`wish-${product.slug}`}
      className={`grid place-items-center rounded-full transition-[transform,background-color] hover:scale-110 ${className}`}>
      <Heart className={`h-4 w-4 ${on ? "fill-[var(--am-orange)] text-[var(--am-orange)]" : ""}`} />
    </button>
  );
}

export function ShareButtons({ product }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = encodeURIComponent(`${product.name} en Ahorramix`);
  const btn = "h-10 w-10 rounded-full border border-[var(--am-line)] grid place-items-center hover:bg-[var(--am-black)] hover:text-white transition-colors";
  const copy = async () => { try { await navigator.clipboard.writeText(url); toast.success("Enlace copiado"); } catch { toast.error("No se pudo copiar"); } };
  return (
    <div className="flex items-center gap-2" data-testid="share-buttons">
      <span className="text-sm text-[var(--am-ink-2)] mr-1">Compartir</span>
      <a className={btn} href={`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Compartir en WhatsApp" data-testid="share-whatsapp"><MessageCircle className="h-4 w-4" /></a>
      <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Compartir en Facebook" data-testid="share-facebook"><Facebook className="h-4 w-4" /></a>
      <button className={btn} onClick={copy} aria-label="Copiar enlace" data-testid="share-copy"><Link2 className="h-4 w-4" /></button>
    </div>
  );
}

// Guía de tallas orientativa: sustituye las medidas por las del proveedor.
export function SizeGuide({ product }) {
  const size = product.attributes?.find((a) => /talla/i.test(a.name));
  if (!size) return null;
  return (
    <Dialog>
      <DialogTrigger asChild><button data-testid="size-guide-button" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4"><Ruler className="h-4 w-4" /> Guía de tallas</button></DialogTrigger>
      <DialogContent className="max-w-lg" data-lenis-prevent data-testid="size-guide-dialog">
        <DialogTitle className="font-display text-2xl font-extrabold">Guía de tallas</DialogTitle>
        <table className="w-full text-sm mt-2">
          <thead><tr className="text-left border-b border-[var(--am-line)]"><th className="py-2">Talla</th><th>Longitud del pie</th><th>Equivalencia</th></tr></thead>
          <tbody>{size.options.map((o) => <tr key={o} className="border-b border-[var(--am-line)]"><td className="py-2 font-semibold">{o}</td><td>[cm]</td><td>[EU / UK / US]</td></tr>)}</tbody>
        </table>
        <p className="text-[12px] text-[var(--am-ink-2)]">Medidas pendientes de completar con los datos del proveedor.</p>
      </DialogContent>
    </Dialog>
  );
}

export function StickyBuyBar({ product, visible }) {
  const click = () => document.querySelector("[data-testid=add-to-cart-button]")?.click();
  return (
    <div className={`fixed left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[var(--am-line)] transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`} data-testid="sticky-buy-bar" aria-hidden={!visible}>
      <div className="am-container h-[72px] flex items-center gap-4">
        <img src={product.images?.[0]?.src} alt="" className="h-12 w-12 rounded-xl object-cover hidden sm:block" />
        <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{product.name}</p><p className="font-display font-extrabold text-[var(--am-price)]">{eur(product.price)}</p></div>
        <button onClick={click} tabIndex={visible ? 0 : -1} data-testid="sticky-add-to-cart" className="h-12 px-6 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] font-bold hover:bg-[var(--am-yellow)] transition-colors">Añadir al carrito</button>
      </div>
    </div>
  );
}

export function Reviews({ product }) {
  const [state, setState] = useState({ items: [], loading: true });
  useEffect(() => {
    let alive = true;
    fetchReviews(product.id).then((items) => { if (alive) setState({ items, loading: false }); }).catch(() => { if (alive) setState({ items: [], loading: false }); });
    return () => { alive = false; };
  }, [product.id]);
  if (state.loading) return <p className="text-[var(--am-ink-2)]">Cargando opiniones…</p>;
  if (!state.items.length) return <p className="text-[var(--am-ink-2)]" data-testid="reviews-empty">Todavía no hay opiniones de este producto. Las opiniones las publican clientes reales desde WooCommerce tras su compra.</p>;
  return (
    <div className="space-y-6" data-testid="reviews-list">
      {state.items.map((r) => (
        <div key={r.id} className="border-b border-[var(--am-line)] pb-5">
          <div className="flex items-center gap-3"><Stars value={r.rating} /><span className="font-semibold text-sm">{r.name}</span>{r.verified && <span className="text-[12px] text-[var(--am-emerald)] font-semibold">Compra verificada</span>}</div>
          <p className="mt-2 text-[15px] text-[var(--am-ink-2)]">{r.text}</p>
        </div>
      ))}
    </div>
  );
}
