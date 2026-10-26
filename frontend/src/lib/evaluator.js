// Evaluador de productos: cálculo a partir de datos introducidos manualmente. No consulta fuentes externas.
import { slugify } from "@/lib/format";

export const EMPTY = {
  name: "", sku: "", category: "", shortDescription: "", description: "", images: "",
  attr1Name: "", attr1Values: "", attr2Name: "", attr2Values: "",
  supplierName: "", supplierProductId: "", supplierUrl: "", supplierRating: "", deliveryTime: "",
  supplierCost: "", supplierShipping: "", salePrice: "", promoPrice: "", vatRate: "21",
  paymentFeePct: "", paymentFeeFixed: "", adCostPerSale: "", returnRate: "",
  competitorPrice: "", competitionLevel: "sin_datos", demandLevel: "sin_datos", demandEvidence: "",
  legalRisk: false, legalNotes: "",
};

export const DEMAND = { sin_datos: "Sin datos", baja: "Baja", media: "Media", alta: "Alta" };
export const COMPETITION = { sin_datos: "Sin datos", alta: "Alta", media: "Media", baja: "Baja" };

const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function evaluate(f) {
  const sale = num(f.promoPrice) || num(f.salePrice) || 0;
  const vat = num(f.vatRate) ?? 0;
  const cost = num(f.supplierCost) ?? 0;
  const ship = num(f.supplierShipping) ?? 0;
  const fees = sale * ((num(f.paymentFeePct) ?? 0) / 100) + (num(f.paymentFeeFixed) ?? 0);
  const ads = num(f.adCostPerSale) ?? 0;
  const ret = num(f.returnRate);
  const netRevenue = sale / (1 + vat / 100);
  const vatAmount = sale - netRevenue;
  const returnsCost = ((ret ?? 0) / 100) * (cost + ship + fees);
  const gross = netRevenue - cost - ship;
  const net = gross - fees - returnsCost - ads;
  const netMargin = netRevenue > 0 ? (net / netRevenue) * 100 : 0;
  const invested = cost + ship + fees + ads;
  const roi = invested > 0 ? (net / invested) * 100 : 0;
  const comp = num(f.competitorPrice);
  const rating = num(f.supplierRating);

  const missing = [];
  if (!sale) missing.push("precio de venta");
  if (!num(f.supplierCost)) missing.push("coste del proveedor");
  if (num(f.supplierShipping) === null) missing.push("envío del proveedor");
  if (num(f.paymentFeePct) === null) missing.push("comisión de pago");
  if (ret === null) missing.push("tasa de devoluciones");
  if (!comp) missing.push("precio de la competencia");
  if (f.demandLevel === "sin_datos" || !f.demandEvidence.trim()) missing.push("demanda con fuente");
  if (f.competitionLevel === "sin_datos") missing.push("nivel de competencia");
  if (!rating) missing.push("fiabilidad del proveedor");

  const pts = {
    margen: (clamp(netMargin, 0, 40) / 40) * 30,
    precio: comp ? (sale <= comp ? 20 : sale <= comp * 1.1 ? 12 : sale <= comp * 1.25 ? 5 : 0) : 0,
    demanda: { sin_datos: 0, baja: 5, media: 12, alta: 20 }[f.demandLevel] ?? 0,
    competencia: { sin_datos: 0, alta: 2, media: 6, baja: 10 }[f.competitionLevel] ?? 0,
    proveedor: rating ? (clamp(rating, 1, 5) / 5) * 12 : 0,
    devoluciones: ret === null ? 0 : ret <= 3 ? 8 : ret <= 8 ? 5 : ret <= 15 ? 2 : 0,
  };
  const score = Math.round(Object.values(pts).reduce((a, b) => a + b, 0));

  let verdict = { key: "baja", label: "Baja prioridad" };
  if (sale && net <= 0) verdict = { key: "descartar", label: "Descartar: sin beneficio" };
  else if (f.legalRisk) verdict = { key: "legal", label: "Revisar requisitos legales" };
  else if (missing.length) verdict = { key: "datos", label: "Datos insuficientes" };
  else if (score >= 70) verdict = { key: "prioritario", label: "Prioritario" };
  else if (score >= 45) verdict = { key: "valorar", label: "A valorar" };

  const fp = (num(f.paymentFeePct) ?? 0) / 100;
  const ff = num(f.paymentFeeFixed) ?? 0;
  const r = (ret ?? 0) / 100;
  const breakEven = (cost + ship + ff + ads + r * (cost + ship + ff)) / (1 / (1 + vat / 100) - fp - r * fp);
  return { sale, netRevenue, vatAmount, fees, returnsCost, gross, net, netMargin, roi, score, pts, missing, verdict, breakEven: Number.isFinite(breakEven) && breakEven > 0 ? breakEven : 0 };
}

const list = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const price = (v) => { const n = num(v); return n ? n.toFixed(2) : ""; };

const HEAD = ["Type", "SKU", "Parent", "Name", "Published", "Is featured?", "Visibility in catalog", "Short description", "Description", "Tax status", "In stock?", "Regular price", "Sale price", "Categories", "Images",
  "Attribute 1 name", "Attribute 1 value(s)", "Attribute 1 visible", "Attribute 1 global", "Attribute 2 name", "Attribute 2 value(s)", "Attribute 2 visible", "Attribute 2 global",
  "Meta: _ahorramix_supplier_name", "Meta: _ahorramix_supplier_product_id", "Meta: _ahorramix_supplier_url", "Meta: _ahorramix_cost_price", "Meta: _ahorramix_supplier_shipping", "Meta: _ahorramix_delivery_time"];

// CSV compatible con el importador nativo de WooCommerce. Los productos se importan como BORRADOR (Published = -1).
export function toWooCsv(items) {
  const rows = [HEAD];
  items.forEach((f) => {
    const sku = f.sku || `AMX-${slugify(f.name).slice(0, 24).toUpperCase()}`;
    const a1 = list(f.attr1Values); const a2 = list(f.attr2Values);
    const variable = (f.attr1Name && a1.length) || (f.attr2Name && a2.length);
    const meta = [f.supplierName, f.supplierProductId, f.supplierUrl, price(f.supplierCost), price(f.supplierShipping), f.deliveryTime];
    rows.push([variable ? "variable" : "simple", sku, "", f.name, -1, 0, "visible", f.shortDescription, f.description, "taxable", 1,
      variable ? "" : price(f.salePrice), variable ? "" : price(f.promoPrice), f.category, list(f.images).join(", "),
      f.attr1Name, a1.join(", "), f.attr1Name ? 1 : "", f.attr1Name ? 0 : "", f.attr2Name, a2.join(", "), f.attr2Name ? 1 : "", f.attr2Name ? 0 : "", ...meta]);
    if (!variable) return;
    const combos = (a1.length ? a1 : [""]).flatMap((x) => (a2.length ? a2 : [""]).map((y) => [x, y]));
    combos.forEach(([x, y]) => {
      const vsku = [sku, x && slugify(x), y && slugify(y)].filter(Boolean).join("-").toUpperCase();
      rows.push(["variation", vsku, sku, `${f.name} - ${[x, y].filter(Boolean).join(", ")}`, 1, "", "", "", "", "taxable", 1,
        price(f.salePrice), price(f.promoPrice), "", "", x ? f.attr1Name : "", x, "", 0, y ? f.attr2Name : "", y, "", 0, ...meta]);
    });
  });
  return "\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\n");
}

export function downloadCsv(content, filename) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
