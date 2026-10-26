import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";
import { STORE } from "@/config/store";

const field = "w-full h-12 rounded-xl border border-[var(--am-line)] bg-white px-4 text-[15px] outline-none focus:border-[var(--am-emerald)] transition-colors";

// Sin backend: el formulario abre el cliente de correo del visitante. Ver docs/06-INTEGRACIONES-PENDIENTES.md para un formulario con WordPress.
export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", order: "", message: "", ok: false });
  const set = (k) => (e) => setF({ ...f, [k]: k === "ok" ? e.target.checked : e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const body = `Nombre: ${f.name}\nEmail: ${f.email}\nPedido: ${f.order || "-"}\n\n${f.message}`;
    window.location.href = `mailto:${STORE.seller.email}?subject=${encodeURIComponent("Consulta desde la web")}&body=${encodeURIComponent(body)}`;
  };
  return (
    <>
      <Seo title="Contacto" description="Contacta con la tienda Ahorramix." path="/contacto" />
      <PageHead eyebrow="Contacto" title="Hablemos">Escríbenos para dudas sobre productos, pedidos o devoluciones.</PageHead>
      <div className="am-container grid lg:grid-cols-12 gap-12">
        <form onSubmit={submit} className="lg:col-span-7 space-y-4" data-testid="contact-form">
          <div className="grid sm:grid-cols-2 gap-4">
            <input required className={field} placeholder="Nombre" value={f.name} onChange={set("name")} data-testid="contact-name-input" />
            <input required type="email" className={field} placeholder="Email" value={f.email} onChange={set("email")} data-testid="contact-email-input" />
          </div>
          <input className={field} placeholder="Número de pedido (opcional)" value={f.order} onChange={set("order")} data-testid="contact-order-input" />
          <textarea required rows={6} className={`${field} h-auto py-3`} placeholder="Tu mensaje" value={f.message} onChange={set("message")} data-testid="contact-message-input" />
          <label className="flex gap-3 text-sm text-[var(--am-ink-2)]">
            <input required type="checkbox" checked={f.ok} onChange={set("ok")} className="mt-0.5 accent-[var(--am-emerald)]" data-testid="contact-privacy-checkbox" />
            <span>He leído la <Link to="/legal/privacidad" className="underline">política de privacidad</Link>.</span>
          </label>
          <button type="submit" data-testid="contact-submit-button" className="px-8 py-4 rounded-full bg-[var(--am-ink)] text-white font-semibold hover:bg-[var(--am-emerald)] transition-colors">Abrir mi correo para enviar</button>
          <p className="text-[12px] text-[var(--am-ink-2)]">El mensaje se prepara en tu aplicación de correo; no se guarda en esta web.</p>
        </form>
        <aside className="lg:col-span-5 rounded-[24px] bg-[var(--am-bg-2)] p-8 space-y-4 self-start text-[15px]">
          <h2 className="font-display text-2xl font-bold">Datos de contacto</h2>
          <p><span className="text-[var(--am-ink-2)]">Email:</span> {STORE.seller.email}</p>
          <p><span className="text-[var(--am-ink-2)]">Teléfono:</span> {STORE.seller.phone}</p>
          <p><span className="text-[var(--am-ink-2)]">Titular:</span> {STORE.seller.legalName}</p>
          <p><span className="text-[var(--am-ink-2)]">Dirección:</span> {STORE.seller.address}</p>
        </aside>
      </div>
    </>
  );
}
