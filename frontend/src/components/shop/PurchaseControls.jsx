import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { findVariationId, getBuyNowUrl, IS_DEMO } from "@/lib/commerce";
import { slugify } from "@/lib/format";

function VariantPicker({ attributes, selected, onChange, prefix }) {
  return attributes.map((a) => (
    <div key={a.name} className="mt-6">
      <p className="text-sm font-medium mb-2.5">{a.name}: <span className="text-[var(--am-ink-2)] font-normal">{selected[a.name]}</span></p>
      <div className="flex flex-wrap gap-2">
        {a.options.map((o) => (
          <button key={o} onClick={() => onChange({ ...selected, [a.name]: o })} data-testid={`${prefix}variant-${slugify(a.name)}-${slugify(o)}`}
            className={`min-w-[48px] px-4 h-11 rounded-full border text-sm transition-colors ${selected[a.name] === o ? "bg-[var(--am-ink)] text-white border-[var(--am-ink)]" : "border-[var(--am-line)] hover:border-[var(--am-ink)]"}`}>{o}</button>
        ))}
      </div>
    </div>
  ));
}

// Variantes + cantidad + botón de compra. Se usa en la ficha y en la vista rápida.
export function PurchaseControls({ product, prefix = "", onAdded }) {
  const { add } = useCart();
  const [selected, setSelected] = useState({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
    setSelected(Object.fromEntries((product?.attributes || []).map((a) => [a.name, a.options[0]])));
  }, [product]);

  const variationId = findVariationId(product, selected);
  const outOfStock = product.stockStatus !== "instock";
  const blocked = outOfStock || (!IS_DEMO && product.variations.length > 0 && !variationId);
  const buy = () => { onAdded?.(); add(product, selected, qty, variationId); };

  return (
    <>
      <VariantPicker attributes={product.attributes || []} selected={selected} onChange={setSelected} prefix={prefix} />
      <div className="mt-8 flex gap-3">
        <div className="inline-flex items-center rounded-full border border-[var(--am-line)] h-14">
          <button className="px-4" aria-label="Restar" data-testid={`${prefix}product-qty-decrease`} onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
          <span className="w-8 text-center" data-testid={`${prefix}product-qty`}>{qty}</span>
          <button className="px-4" aria-label="Sumar" data-testid={`${prefix}product-qty-increase`} onClick={() => setQty((q) => Math.min(99, q + 1))}><Plus className="h-4 w-4" /></button>
        </div>
        <button disabled={blocked} onClick={buy} data-testid={`${prefix}add-to-cart-button`}
          className="flex-1 h-14 rounded-full bg-[var(--am-ink)] hover:bg-[var(--am-emerald)] disabled:bg-[var(--am-bg-2)] disabled:text-[var(--am-ink-2)] text-white font-semibold transition-colors">
          {outOfStock ? "Agotado" : blocked ? "Combinación no disponible" : "Añadir al carrito"}
        </button>
      </div>
      {IS_DEMO ? (
        <button disabled data-testid={`${prefix}buy-now-button`} className="mt-3 w-full h-12 rounded-full border border-[var(--am-line)] text-[var(--am-ink-2)] font-semibold cursor-not-allowed">Comprar ahora (no disponible en la demo)</button>
      ) : (
        <a href={blocked ? undefined : getBuyNowUrl(variationId || product.id, qty)} aria-disabled={blocked} data-testid={`${prefix}buy-now-button`}
          className={`mt-3 w-full h-12 rounded-full font-bold inline-flex items-center justify-center transition-colors ${blocked ? "bg-[var(--am-bg-2)] text-[var(--am-ink-2)] pointer-events-none" : "bg-[var(--am-orange)] text-[var(--am-ink)] hover:bg-[var(--am-yellow)]"}`}>Comprar ahora</a>
      )}
    </>
  );
}
