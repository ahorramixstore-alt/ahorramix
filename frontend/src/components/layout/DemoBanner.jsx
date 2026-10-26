import { IS_DEMO } from "@/lib/commerce";

export function DemoBanner() {
  if (!IS_DEMO) return null;
  return (
    <div data-testid="demo-mode-banner" className="bg-[var(--am-dark)] text-[#e8e8e3] text-[12px] font-mono-am tracking-wide text-center px-4 py-2">
      Modo demostración · Productos y precios de ejemplo ficticios · El pago no está activo
    </div>
  );
}
