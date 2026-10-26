import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";
import { EvaluatorForm } from "@/components/evaluator/EvaluatorForm";
import { ResultPanel } from "@/components/evaluator/ResultPanel";
import { CandidateList } from "@/components/evaluator/CandidateList";
import { EMPTY, evaluate, toWooCsv, downloadCsv } from "@/lib/evaluator";

const KEY = "ahorramix_evaluator_v1";
const load = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };

export default function Evaluator() {
  const [form, setForm] = useState(EMPTY);
  const [items, setItems] = useState(load);
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);
  const result = useMemo(() => evaluate(form), [form]);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = () => {
    if (editing) setItems((xs) => xs.map((x) => (x.id === editing ? { ...form, id: editing } : x)));
    else setItems((xs) => [...xs, { ...form, id: `c${Date.now()}` }]);
    toast.success(editing ? "Candidato actualizado" : "Guardado en candidatos");
    setForm(EMPTY); setEditing(null);
  };
  const edit = (it) => { const { id, ...rest } = it; setForm({ ...EMPTY, ...rest }); setEditing(id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = (id) => { setItems((xs) => xs.filter((x) => x.id !== id)); setSelected((s) => s.filter((x) => x !== id)); };
  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () => setSelected((s) => (s.length === items.length ? [] : items.map((x) => x.id)));
  const exportCsv = () => {
    downloadCsv(toWooCsv(items.filter((x) => selected.includes(x.id))), `ahorramix-woocommerce-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success("CSV generado. Impórtalo en WooCommerce › Productos › Importar.");
  };

  return (
    <>
      <Seo title="Evaluador de productos" noindex path="/evaluador" />
      <PageHead eyebrow="Herramienta interna · no visible para clientes" title="Evaluador de productos">
        Introduce datos reales del proveedor y del mercado. El sistema calcula el margen neto y una puntuación orientativa. No añade nada a la tienda: tú decides qué exportar a WooCommerce.
      </PageHead>
      <div className="am-container grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8"><EvaluatorForm form={form} set={set} /></div>
        <aside className="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <ResultPanel r={result} onSave={save} editing={Boolean(editing)} canSave={Boolean(form.name.trim())} />
          {editing && <button onClick={() => { setForm(EMPTY); setEditing(null); }} className="mt-3 w-full text-sm underline" data-testid="evaluator-cancel-edit">Cancelar edición</button>}
        </aside>
      </div>
      <section className="am-container mt-16">
        <h2 className="font-display text-3xl font-extrabold tracking-tight mb-6">Candidatos guardados</h2>
        <CandidateList items={items} selected={selected} toggle={toggle} toggleAll={toggleAll} onEdit={edit} onDelete={remove} onExport={exportCsv} />
        <p className="mt-4 text-[12px] text-[var(--am-ink-2)]">Los datos se guardan solo en este navegador. Los productos se exportan como borrador para que los revises antes de publicarlos.</p>
      </section>
    </>
  );
}
