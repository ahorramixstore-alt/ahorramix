import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";

export default function NotFound() {
  return (
    <section className="am-container py-32 text-center" data-testid="not-found">
      <Seo title="Página no encontrada" noindex />
      <p className="font-display text-[8rem] md:text-[12rem] font-extrabold leading-none tracking-tighter text-[var(--am-line)]">404</p>
      <h1 className="font-display text-3xl font-bold -mt-6">No encontramos esta página</h1>
      <Link to="/tienda" className="mt-8 inline-flex px-7 py-3.5 rounded-full bg-[var(--am-black)] text-white font-semibold">Ir a la tienda</Link>
    </section>
  );
}
