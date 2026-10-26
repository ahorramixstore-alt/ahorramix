import { eur } from "@/lib/format";

const TONE = {
  prioritario: "bg-[var(--am-emerald)] text-white",
  valorar: "bg-[#fef3c7] text-[#78350f]",
  baja: "bg-[var(--am-bg-2)] text-[var(--am-ink)]",
  datos: "bg-[var(--am-bg-2)] text-[var(--am-ink)]",
  legal: "bg-[#fde2e2] text-[#7f1d1d]",
  descartar: "bg-[#fde2e2] text-[#7f1d1d]",
};

export const VerdictBadge = ({ verdict }) => <span data-testid="evaluator-verdict" className={`inline-block px-3 py-1 rounded-full text-[12px] font-semibold ${TONE[verdict.key]}`}>{verdict.label}</span>;

const Row = ({ label, value, strong, id }) => (
  <div className={`flex justify-between py-2 text-[14px] ${strong ? "font-semibold" : ""}`}><span className={strong ? "" : "text-zinc-400"}>{label}</span><span data-testid={id}>{value}</span></div>
);

export function ResultPanel({ r, onSave, editing, canSave }) {
  return (
    <div className="rounded-[24px] bg-[var(--am-dark)] text-white p-6 md:p-7" data-testid="evaluator-result">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono-am text-[12px] uppercase tracking-[0.2em] text-zinc-400">Puntuación</p>
          <p className="font-display text-6xl font-extrabold tracking-tight" data-testid="evaluator-score">{r.score}<span className="text-2xl text-zinc-400">/100</span></p>
        </div>
        <VerdictBadge verdict={r.verdict} />
      </div>
      <div className="mt-6 divide-y divide-white/10">
        <Row label="Precio usado (IVA incl.)" value={eur(r.sale)} />
        <Row label="IVA" value={`− ${eur(r.vatAmount)}`} />
        <Row label="Ingreso neto sin IVA" value={eur(r.netRevenue)} />
        <Row label="Margen bruto (tras coste y envío)" value={eur(r.gross)} />
        <Row label="Comisiones de pago" value={`− ${eur(r.fees)}`} />
        <Row label="Coste esperado de devoluciones" value={`− ${eur(r.returnsCost)}`} />
        <Row label="Beneficio neto por venta" value={eur(r.net)} strong id="evaluator-net-profit" />
        <Row label="Margen neto" value={`${r.netMargin.toFixed(1)} %`} strong id="evaluator-net-margin" />
        <Row label="ROI" value={`${r.roi.toFixed(1)} %`} />
        <Row label="Precio mínimo sin pérdidas" value={r.breakEven ? eur(r.breakEven) : "—"} id="evaluator-break-even" />
      </div>
      {r.missing.length > 0 && <p className="mt-5 text-[13px] text-amber-200 leading-relaxed" data-testid="evaluator-missing">Faltan datos: {r.missing.join(", ")}.</p>}
      <p className="mt-4 text-[12px] text-zinc-400 leading-relaxed">La puntuación se basa solo en los datos introducidos. No es una predicción de ventas ni garantiza que el producto sea rentable.</p>
      <button disabled={!canSave} onClick={onSave} data-testid="evaluator-save-button" className="mt-6 w-full h-12 rounded-full bg-white text-[var(--am-ink)] font-semibold disabled:opacity-40 hover:bg-[#2BB58F] hover:text-white transition-colors">
        {editing ? "Actualizar candidato" : "Guardar en candidatos"}
      </button>
    </div>
  );
}
