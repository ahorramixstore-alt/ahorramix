import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { eur } from "@/lib/format";
import { CheckoutButton } from "@/components/shop/CheckoutButton";
import { CartUpsell, FreeShippingBar } from "@/components/shop/CartExtras";

export function CartLine({ item, compact = false }) {
  const { setQty, remove } = useCart();
  return (
    <div className="flex gap-4 py-4 border-b border-[var(--am-line)]" data-testid={`cart-line-${item.key}`}>
      <Link to={`/producto/${item.slug}`} className="shrink-0 w-20 h-24 rounded-xl overflow-hidden bg-[var(--am-bg-2)]">
        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link to={`/producto/${item.slug}`} className="font-medium text-[15px] leading-snug hover:underline">{item.name}</Link>
          <button onClick={() => remove(item.key)} aria-label="Eliminar" data-testid="cart-line-remove" className="text-[var(--am-ink-2)] hover:text-[var(--am-ink)]"><X className="h-4 w-4" /></button>
        </div>
        {Object.entries(item.options || {}).length > 0 && (
          <p className="text-[13px] text-[var(--am-ink-2)] mt-1">{Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-[var(--am-line)]">
            <button className="p-2" aria-label="Restar" data-testid="cart-line-decrease" onClick={() => setQty(item.key, item.qty - 1)}><Minus className="h-3.5 w-3.5" /></button>
            <span className="w-7 text-center text-sm" data-testid="cart-line-qty">{item.qty}</span>
            <button className="p-2" aria-label="Sumar" data-testid="cart-line-increase" onClick={() => setQty(item.key, item.qty + 1)}><Plus className="h-3.5 w-3.5" /></button>
          </div>
          <span className={`font-semibold ${compact ? "text-sm" : ""}`}>{eur(item.price * item.qty)}</span>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { items, open, setOpen, subtotal, count } = useCart();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0" data-lenis-prevent data-testid="cart-drawer">
        <div className="px-6 pt-6 pb-4 border-b border-[var(--am-line)]">
          <SheetTitle className="font-display text-2xl font-bold">Tu carrito <span className="text-[var(--am-ink-2)] font-medium text-lg">({count})</span></SheetTitle>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="py-16 text-center text-[var(--am-ink-2)]" data-testid="cart-empty">Tu carrito está vacío.</p>
          ) : items.map((i) => <CartLine key={i.key} item={i} compact />)}
          <CartUpsell />
        </div>
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-[var(--am-line)] space-y-4 bg-white">
            <FreeShippingBar />
            <div className="flex justify-between text-[15px]"><span>Subtotal (IVA incl.)</span><strong data-testid="cart-drawer-subtotal">{eur(subtotal)}</strong></div>
            <p className="text-[13px] text-[var(--am-ink-2)]">Envío y cupones se calculan en el checkout.</p>
            <CheckoutButton />
            <Link to="/carrito" onClick={() => setOpen(false)} data-testid="cart-drawer-view-cart" className="block text-center text-sm font-medium underline underline-offset-4">Ver carrito completo</Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
