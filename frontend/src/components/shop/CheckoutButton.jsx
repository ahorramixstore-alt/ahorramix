import { Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getCheckoutUrl, IS_DEMO } from "@/lib/commerce";
import { useCheckoutClick } from "./PurchaseControls";

export function CheckoutButton() {
  const { items } = useCart();
  const onCheckout = useCheckoutClick();
  if (IS_DEMO) {
    return (
      <div data-testid="checkout-disabled-notice">
        <button disabled className="w-full h-12 rounded-full bg-[var(--am-bg-2)] text-[var(--am-ink-2)] font-medium cursor-not-allowed inline-flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" /> Checkout no disponible en la demo
        </button>
        <p className="mt-2 text-[12px] text-[var(--am-ink-2)] leading-relaxed">Se activará al conectar WooCommerce en Hostinger con una pasarela de pago configurada.</p>
      </div>
    );
  }
  const url = getCheckoutUrl(items);
  return (
    <a href={url} onClick={onCheckout(url)} data-testid="checkout-button" className="w-full h-12 rounded-full bg-[var(--am-emerald)] hover:bg-[var(--am-emerald-ink)] text-white font-semibold inline-flex items-center justify-center gap-2 transition-colors">
      <Lock className="h-4 w-4" /> Finalizar compra
    </a>
  );
}
