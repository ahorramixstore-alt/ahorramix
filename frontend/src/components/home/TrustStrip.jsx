import { Link } from "react-router-dom";
import { CreditCard, PackageSearch, RotateCcw, Truck } from "lucide-react";
import { Reveal } from "@/components/layout/Reveal";

const ITEMS = [
  { icon: Truck, title: "Plazo visible", text: "Cada ficha indica el plazo de entrega estimado antes de comprar.", to: "/legal/envios" },
  { icon: RotateCcw, title: "Devoluciones claras", text: "Condiciones y derecho de desistimiento explicados en una página.", to: "/legal/devoluciones" },
  { icon: CreditCard, title: "Precio final", text: "Precios con IVA incluido. Envío calculado antes de pagar.", to: "/legal/condiciones" },
  { icon: PackageSearch, title: "Seguimiento", text: "Recibirás la información de seguimiento cuando el pedido salga.", to: "/preguntas-frecuentes" },
];

export function TrustStrip() {
  return (
    <section className="am-container py-16 md:py-20" data-testid="trust-strip">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-[var(--am-line)]">
        {ITEMS.map(({ icon: Icon, title, text, to }, i) => (
          <Reveal key={title} delay={i * 0.08} className={`py-10 sm:px-8 ${i ? "border-t sm:border-t-0 lg:border-l" : ""} ${i === 2 ? "sm:border-t lg:border-t-0" : ""} ${i === 3 ? "sm:border-t lg:border-t-0 sm:border-l" : ""} ${i === 1 ? "sm:border-l" : ""} border-[var(--am-line)]`}>
            <Link to={to} className="group block">
              <Icon className="h-6 w-6 text-[var(--am-emerald)]" strokeWidth={1.6} />
              <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-[15px] text-[var(--am-ink-2)] leading-relaxed">{text}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
