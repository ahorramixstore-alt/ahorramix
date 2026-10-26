import { Link } from "react-router-dom";
import { CreditCard, PackageSearch, RotateCcw, Truck } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Plazo visible", text: "Entrega estimada en cada ficha", to: "/legal/envios" },
  { icon: CreditCard, title: "Precio final", text: "IVA incluido, envío antes de pagar", to: "/legal/condiciones" },
  { icon: RotateCcw, title: "Devoluciones claras", text: "Condiciones en una sola página", to: "/legal/devoluciones" },
  { icon: PackageSearch, title: "Seguimiento", text: "Te avisamos cuando salga tu pedido", to: "/preguntas-frecuentes" },
];

export function TrustStrip() {
  return (
    <section className="am-container pt-10" data-testid="trust-strip">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ITEMS.map(({ icon: Icon, title, text, to }) => (
          <Link key={title} to={to} className="group flex flex-col items-start md:flex-row md:items-center gap-3 md:gap-4 rounded-2xl bg-white border border-[var(--am-line)] p-4 hover:border-[var(--am-ink)] transition-colors">
            <span className="shrink-0 h-11 w-11 rounded-xl bg-[var(--am-yellow)] grid place-items-center transition-transform group-hover:-rotate-6"><Icon className="h-5 w-5" strokeWidth={1.8} /></span>
            <span><span className="block text-[14px] font-bold leading-tight">{title}</span><span className="block text-[12px] text-[var(--am-ink-2)] leading-snug">{text}</span></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
