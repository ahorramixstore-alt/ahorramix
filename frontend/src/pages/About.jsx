import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { PageHead, Reveal } from "@/components/layout/Reveal";

const PILLARS = [
  ["01", "Selección", "Revisamos coste, envío, plazos y fiabilidad del proveedor antes de añadir un producto."],
  ["02", "Transparencia", "Precio final con IVA, plazo estimado y condiciones de devolución visibles antes de pagar."],
  ["03", "Envío directo", "Los productos salen del almacén de cada proveedor hacia tu dirección."],
];

export default function About() {
  return (
    <>
      <Seo title="Sobre nosotros" description="Quiénes somos y cómo seleccionamos los productos de Ahorramix." path="/sobre-nosotros" />
      <PageHead eyebrow="Sobre la tienda" title="Lo esencial, bien elegido, a buen precio.">
        [Cuenta aquí tu historia: quién está detrás de Ahorramix, desde dónde trabajas y por qué abriste la tienda.]
      </PageHead>
      <div className="am-container grid md:grid-cols-12 gap-10 items-center">
        <Reveal className="md:col-span-6">
          <div className="aspect-[4/5] rounded-t-full rounded-b-[28px] overflow-hidden bg-[var(--am-bg-2)]">
            <img src="/images/vase-duo.jpg" alt="Jarrones cerámicos en un ambiente sereno" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </Reveal>
        <div className="md:col-span-6 space-y-10">
          {PILLARS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 0.1} className="flex gap-6 border-t border-[var(--am-line)] pt-6">
              <span className="font-mono-am text-sm text-[var(--am-emerald)]">{n}</span>
              <div><h2 className="font-display text-2xl font-bold">{t}</h2><p className="mt-2 text-[var(--am-ink-2)] leading-relaxed">{d}</p></div>
            </Reveal>
          ))}
          <Link to="/tienda" className="inline-flex px-7 py-4 rounded-full bg-[var(--am-black)] text-white font-semibold">Ver productos</Link>
        </div>
      </div>
    </>
  );
}
