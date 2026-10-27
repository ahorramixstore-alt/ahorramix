import { Link } from "react-router-dom";
import { Plus, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/hooks/useCatalog";
import { STORE } from "@/config/store";
import { eur, discountPct } from "@/lib/format";

// Barra de envío gratuito: se muestra solo si STORE.freeShippingThreshold tiene un importe.
export function FreeShippingBar() {
  const { subtotal } = useCart();
  const t = STORE.freeShippingThreshold;
  if (!t) return null;
  const pct = Math.min(100, (subtotal / t) * 100);
  return (
    <div data-testid="free-shipping-bar">
      <p className="flex items-center gap-2 text-[13px] font-semibold"><Truck className="h-4 w-4" />{subtotal >= t ? "¡Tienes envío gratis!" : `Te faltan ${eur(t - subtotal)} para el envío gratis`}</p>
      <div className="mt-2 h-2 rounded-full bg-[var(--am-bg-2)] overflow-hidden"><div className="h-full bg-[var(--am-orange)] transition-[width] duration-500" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

// Venta cruzada: productos sin variantes que no están en el carrito, priorizando ofertas.
export function CartUpsell() {
  const { items, add } = useCart();
  const { products } = useCatalog();
  const inCart = items.map((i) => i.productId);
  const picks = products.filter((p) => !inCart.includes(p.id) && !(p.attributes || []).length && p.stockStatus === "instock").sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 3);
  if (!items.length || !picks.length) return null;
  return (
    <div className="py-5" data-testid="cart-upsell">
      <p className="font-display font-extrabold mb-3">Completa tu pedido</p>
      <div className="space-y-3">
        {picks.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <Link to={`/producto/${p.slug}`}><img src={p.images?.[0]?.src} alt="" className="h-14 w-14 rounded-xl object-cover bg-[var(--am-bg-2)]" /></Link>
            <div className="flex-1 min-w-0"><p className="text-sm truncate">{p.name}</p><p className="text-sm font-bold text-[var(--am-price)]">{eur(p.price)}</p></div>
            <button onClick={() => add(p, {}, 1, null)} aria-label={`Añadir ${p.name}`} data-testid={`upsell-add-${p.slug}`} className="h-9 w-9 rounded-full bg-[var(--am-black)] text-white grid place-items-center hover:bg-[var(--am-orange)] hover:text-[var(--am-ink)] transition-colors"><Plus className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
