import { COMPETITION, DEMAND } from "@/lib/evaluator";

const base = "w-full h-11 rounded-xl border border-[var(--am-line)] bg-white px-3.5 text-[14px] outline-none focus:border-[var(--am-emerald)] transition-colors";

export function Field({ label, k, form, set, type = "text", hint, suffix, area }) {
  const id = `evaluator-${k}`;
  return (
    <label className="block">
      <span className="text-[13px] font-medium">{label}</span>
      <span className="relative block mt-1.5">
        {area ? <textarea id={id} rows={3} data-testid={`${id}-input`} value={form[k]} onChange={(e) => set(k, e.target.value)} className={`${base} h-auto py-2.5`} />
          : <input id={id} type={type} inputMode={type === "number" ? "decimal" : undefined} step="any" data-testid={`${id}-input`} value={form[k]} onChange={(e) => set(k, e.target.value)} className={`${base} ${suffix ? "pr-10" : ""}`} />}
        {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[var(--am-ink-2)]">{suffix}</span>}
      </span>
      {hint && <span className="block mt-1 text-[12px] text-[var(--am-ink-2)]">{hint}</span>}
    </label>
  );
}

export function Choice({ label, k, form, set, options }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium">{label}</span>
      <select data-testid={`evaluator-${k}-select`} value={form[k]} onChange={(e) => set(k, e.target.value)} className={`${base} mt-1.5`}>
        {Object.entries(options).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

const Block = ({ n, title, children }) => (
  <fieldset className="rounded-[20px] border border-[var(--am-line)] bg-white p-5 md:p-6">
    <legend className="px-2 -ml-2 font-display text-lg font-bold"><span className="font-mono-am text-[12px] text-[var(--am-emerald)] mr-2">{n}</span>{title}</legend>
    <div className="grid sm:grid-cols-2 gap-4 mt-2">{children}</div>
  </fieldset>
);

export function EvaluatorForm({ form, set }) {
  const p = { form, set };
  return (
    <div className="space-y-6">
      <Block n="01" title="Producto">
        <Field label="Nombre *" k="name" {...p} />
        <Field label="SKU" k="sku" {...p} hint="Si lo dejas vacío se genera uno al exportar." />
        <Field label="Categoría WooCommerce" k="category" {...p} hint="Ej.: Hogar > Decoración" />
        <Field label="Imágenes (URLs separadas por comas)" k="images" {...p} hint="Usa solo imágenes con permiso del proveedor." />
        <div className="sm:col-span-2"><Field label="Descripción corta" k="shortDescription" {...p} area /></div>
        <div className="sm:col-span-2"><Field label="Descripción completa" k="description" {...p} area /></div>
        <Field label="Atributo 1 (nombre)" k="attr1Name" {...p} hint="Ej.: Color" />
        <Field label="Atributo 1 (valores)" k="attr1Values" {...p} hint="Ej.: Negro, Blanco" />
        <Field label="Atributo 2 (nombre)" k="attr2Name" {...p} hint="Ej.: Talla" />
        <Field label="Atributo 2 (valores)" k="attr2Values" {...p} hint="Ej.: S, M, L" />
      </Block>
      <Block n="02" title="Proveedor">
        <Field label="Nombre del proveedor" k="supplierName" {...p} />
        <Field label="ID del producto en el proveedor" k="supplierProductId" {...p} />
        <Field label="Enlace o referencia" k="supplierUrl" {...p} />
        <Field label="Plazo de entrega a España" k="deliveryTime" {...p} hint="Ej.: 6–10 días laborables" />
        <Field label="Fiabilidad del proveedor (1–5)" k="supplierRating" type="number" {...p} hint="Tu valoración: muestras, valoraciones verificables, historial." />
      </Block>
      <Block n="03" title="Costes y precio">
        <Field label="Coste del proveedor *" k="supplierCost" type="number" suffix="€" {...p} />
        <Field label="Envío del proveedor" k="supplierShipping" type="number" suffix="€" {...p} />
        <Field label="Precio de venta (PVP con IVA) *" k="salePrice" type="number" suffix="€" {...p} />
        <Field label="Precio promocional (opcional)" k="promoPrice" type="number" suffix="€" {...p} hint="Si lo indicas, el cálculo usa este precio." />
        <Field label="IVA aplicable" k="vatRate" type="number" suffix="%" {...p} hint="Tipo general en península y Baleares: 21 %. Verifica tu caso." />
        <Field label="Comisión de pago (%)" k="paymentFeePct" type="number" suffix="%" {...p} hint="Consulta las tarifas vigentes de tu pasarela." />
        <Field label="Comisión de pago fija" k="paymentFeeFixed" type="number" suffix="€" {...p} />
        <Field label="Coste publicitario por venta" k="adCostPerSale" type="number" suffix="€" {...p} />
        <Field label="Tasa de devoluciones estimada" k="returnRate" type="number" suffix="%" {...p} />
      </Block>
      <Block n="04" title="Mercado (datos que tú aportas)">
        <Field label="Precio de la competencia más baja" k="competitorPrice" type="number" suffix="€" {...p} />
        <Choice label="Nivel de competencia" k="competitionLevel" options={COMPETITION} {...p} />
        <Choice label="Demanda potencial" k="demandLevel" options={DEMAND} {...p} />
        <Field label="Fuente de la demanda" k="demandEvidence" {...p} hint="Ej.: Google Trends, planificador de palabras clave… (obligatoria para puntuar)" />
        <label className="sm:col-span-2 flex items-start gap-3 text-sm">
          <input type="checkbox" checked={form.legalRisk} onChange={(e) => set("legalRisk", e.target.checked)} data-testid="evaluator-legalRisk-checkbox" className="mt-1 accent-[var(--am-emerald)] h-4 w-4" />
          <span>Tiene restricciones o requisitos legales (marcado CE, cosmética, alimentación, electrónica, juguetes, marcas registradas…)</span>
        </label>
        <div className="sm:col-span-2"><Field label="Notas legales" k="legalNotes" {...p} area /></div>
      </Block>
    </div>
  );
}
