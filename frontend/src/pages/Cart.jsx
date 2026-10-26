import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";
import { CartLine } from "@/components/layout/CartDrawer";
import { CheckoutButton } from "@/components/shop/CheckoutButton";
import { useCart } from "@/context/CartContext";
import { STORE } from "@/config/store";
import { eur } from "@/lib/format";

export default function Cart() {
  const { items, subtotal, clear } = useCart();
  const threshold = STORE.freeShippingThreshold;
  return (
    <>
      <Seo title="Carrito" noindex path="/carrito" />
      <PageHead eyebrow="Carrito" title="Tu carrito" />
      <div className="am-container grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {items.length === 0 ? (
            <div className="py-16 text-center border-y border-[var(--am-line)]" data-testid="cart-page-empty">
              <p className="text-[var(--am-ink-2)]">Todavía no has añadido productos.</p>
              <Link to="/tienda" className="mt-6 inline-flex px-7 py-3.5 rounded-full bg-[var(--am-ink)] text-white font-semibold">Ir a la tienda</Link>
            </div>
          ) : (
            <>
              <div className="border-t border-[var(--am-line)]">{items.map((i) => <CartLine key={i.key} item={i} />)}</div>
              <button onClick={clear} data-testid="cart-clear-button" className="mt-4 text-sm text-[var(--am-ink-2)] underline underline-offset-4">Vaciar carrito</button>
            </>
          )}
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-[24px] bg-white border border-[var(--am-line)] p-6 lg:sticky lg:top-28 space-y-4" data-testid="cart-summary">
            <h2 className="font-display text-2xl font-bold">Resumen</h2>
            <div className="flex justify-between"><span>Subtotal (IVA incl.)</span><strong data-testid="cart-page-subtotal">{eur(subtotal)}</strong></div>
            <div className="flex justify-between text-[var(--am-ink-2)] text-sm"><span>Envío</span><span>Se calcula en el checkout</span></div>
            {threshold && subtotal < threshold && <p className="text-sm text-[var(--am-emerald)]">Te faltan {eur(threshold - subtotal)} para el envío gratuito.</p>}
            <div className="text-sm text-[var(--am-ink-2)] rounded-xl bg-[var(--am-bg-2)] p-4">¿Tienes un cupón? Podrás aplicarlo en el checkout antes de pagar.</div>
            {items.length > 0 && <CheckoutButton />}
          </div>
        </aside>
      </div>
    </>
  );
}
