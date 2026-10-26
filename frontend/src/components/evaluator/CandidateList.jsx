import { Download, Pencil, Trash2 } from "lucide-react";
import { evaluate } from "@/lib/evaluator";
import { eur } from "@/lib/format";
import { VerdictBadge } from "./ResultPanel";

export function CandidateList({ items, selected, toggle, toggleAll, onEdit, onDelete, onExport }) {
  if (!items.length) return <p className="py-10 text-center text-[var(--am-ink-2)] border border-dashed border-[var(--am-line)] rounded-[20px]" data-testid="evaluator-list-empty">Aún no has guardado candidatos.</p>;
  const sorted = [...items].sort((a, b) => evaluate(b).score - evaluate(a).score);
  return (
    <div data-testid="evaluator-list">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-[var(--am-ink-2)]">{selected.length} de {items.length} seleccionados · ordenados por puntuación</p>
        <button disabled={!selected.length} onClick={onExport} data-testid="evaluator-export-csv-btn" className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-[var(--am-emerald)] text-white text-sm font-semibold disabled:opacity-40">
          <Download className="h-4 w-4" /> Exportar CSV para WooCommerce
        </button>
      </div>
      <div className="overflow-x-auto rounded-[20px] border border-[var(--am-line)] bg-white" data-lenis-prevent>
        <table className="w-full text-[14px] min-w-[720px]">
          <thead className="text-left text-[12px] uppercase tracking-wider text-[var(--am-ink-2)] border-b border-[var(--am-line)]">
            <tr>
              <th className="p-4 w-10"><input type="checkbox" aria-label="Seleccionar todos" data-testid="evaluator-select-all" checked={selected.length === items.length} onChange={toggleAll} className="accent-[var(--am-emerald)]" /></th>
              <th className="p-4">Producto</th><th className="p-4">Puntuación</th><th className="p-4">Beneficio neto</th><th className="p-4">Margen</th><th className="p-4">Estado</th><th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((it) => {
              const r = evaluate(it);
              return (
                <tr key={it.id} className="border-b last:border-0 border-[var(--am-line)]" data-testid={`evaluator-row-${it.id}`}>
                  <td className="p-4"><input type="checkbox" aria-label={`Seleccionar ${it.name}`} checked={selected.includes(it.id)} onChange={() => toggle(it.id)} data-testid={`evaluator-select-${it.id}`} className="accent-[var(--am-emerald)]" /></td>
                  <td className="p-4"><p className="font-medium">{it.name}</p><p className="text-[12px] text-[var(--am-ink-2)]">{it.supplierName || "Proveedor sin indicar"}</p></td>
                  <td className="p-4 font-display text-xl font-bold">{r.score}</td>
                  <td className="p-4">{eur(r.net)}</td>
                  <td className="p-4">{r.netMargin.toFixed(1)} %</td>
                  <td className="p-4"><VerdictBadge verdict={r.verdict} /></td>
                  <td className="p-4 whitespace-nowrap text-right">
                    <button onClick={() => onEdit(it)} aria-label="Editar" data-testid={`evaluator-edit-${it.id}`} className="p-2 rounded-full hover:bg-[var(--am-bg-2)]"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => onDelete(it.id)} aria-label="Eliminar" data-testid={`evaluator-delete-${it.id}`} className="p-2 rounded-full hover:bg-[var(--am-bg-2)]"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
