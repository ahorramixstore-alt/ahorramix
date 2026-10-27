import { Link } from "react-router-dom";
import { STORE } from "@/config/store";
import { useCatalog, topCategories } from "@/hooks/useCatalog";
import { LEGAL_PAGES } from "@/data/legal";
import { Logo } from "./Logo";
import { Newsletter } from "./Extras";

const Col = ({ title, children }) => (
  <div>
    <h3 className="font-mono-am text-[12px] uppercase tracking-[0.2em] text-zinc-400 mb-4">{title}</h3>
    <ul className="space-y-2.5 text-[15px] text-zinc-200">{children}</ul>
  </div>
);
const L = ({ to, children, id }) => <li><Link to={to} data-testid={id} className="hover:text-white transition-colors">{children}</Link></li>;

export function Footer() {
  const { categories } = useCatalog();
  const tops = topCategories(categories);
  return (
    <footer className="bg-[var(--am-dark)] text-white mt-24 relative overflow-hidden" data-testid="site-footer">
      <div className="am-container pt-16 pb-10">
        <Newsletter />
        <div className="grid gap-12 md:grid-cols-12 mt-16">
          <div className="md:col-span-4 space-y-5">
            <Logo light />
            <p className="text-zinc-300 max-w-xs text-[15px] leading-relaxed">{STORE.tagline}</p>
            <div className="text-[13px] text-zinc-400 space-y-1">
              <p>{STORE.seller.legalName} · {STORE.seller.taxId}</p>
              <p>{STORE.seller.address}</p>
              <p>{STORE.seller.email}</p>
            </div>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <Col title="Tienda">
              <L to="/tienda">Todos los productos</L>
              {tops.slice(0, 7).map((c) => <L key={c.slug} to={`/categoria/${c.slug}`}>{c.name}</L>)}
              <L to="/tienda?ofertas=1">Ofertas</L>
            </Col>
            <Col title="Ayuda">
              <L to="/preguntas-frecuentes" id="footer-faq">Preguntas frecuentes</L>
              <L to="/legal/envios">Envíos</L>
              <L to="/legal/devoluciones">Devoluciones y reembolsos</L>
              <L to="/contacto" id="footer-contact">Contacto</L>
              <L to="/seguimiento" id="footer-tracking">Seguimiento de pedidos</L>
              <L to="/lista-de-deseos" id="footer-wishlist">Lista de deseos</L>
              <L to="/sobre-nosotros">Sobre nosotros</L>
              <L to="/cuenta">Mi cuenta</L>
            </Col>
            <Col title="Legal">
              {LEGAL_PAGES.filter((p) => !["envios", "devoluciones"].includes(p.slug)).map((p) => <L key={p.slug} to={`/legal/${p.slug}`} id={`footer-legal-${p.slug}`}>{p.title}</L>)}
            </Col>
          </div>
        </div>
        <div className="mt-20 font-display font-extrabold tracking-tighter leading-none text-[18vw] md:text-[13vw] text-white/[0.06] select-none" aria-hidden="true">ahorramix</div>
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-[13px] text-zinc-400">
          <p>© {new Date().getFullYear()} {STORE.name}. Precios con IVA incluido salvo indicación.</p>
          <p>Fotografías: Unsplash (licencia Unsplash).</p>
        </div>
      </div>
    </footer>
  );
}
