import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";
import { getAccountUrl, IS_DEMO } from "@/lib/commerce";
import { TRACKING_URL } from "@/config/runtime";

export default function Tracking() {
  const url = TRACKING_URL || getAccountUrl();
  return (
    <>
      <Seo title="Seguimiento de pedidos" description="Consulta el estado y el seguimiento de tu pedido en Ahorramix." path="/seguimiento" />
      <PageHead eyebrow="Pedidos" title="Seguimiento de tu pedido">Cuando el proveedor envíe tu pedido recibirás un correo con el número de seguimiento. También puedes consultarlo aquí.</PageHead>
      <div className="am-container max-w-2xl">
        <div className="rounded-[24px] border border-[var(--am-line)] bg-white p-8" data-testid="tracking-panel">
          <PackageSearch className="h-8 w-8 text-[var(--am-price)]" strokeWidth={1.6} />
          {IS_DEMO && !TRACKING_URL ? (
            <p className="mt-4 text-[var(--am-ink-2)] leading-relaxed" data-testid="tracking-demo-notice">El seguimiento se activará al conectar WooCommerce: los clientes verán el estado de cada pedido en «Mi cuenta» o en la página de tu plugin de seguimiento.</p>
          ) : (
            <a href={url} data-testid="tracking-link" className="mt-6 inline-flex px-8 py-4 rounded-full bg-[var(--am-ink)] text-white font-bold hover:bg-[var(--am-price)] transition-colors">Consultar mi pedido</a>
          )}
          <p className="mt-6 text-sm text-[var(--am-ink-2)]">¿Algún problema con tu envío? <Link to="/contacto" className="underline">Escríbenos</Link>.</p>
        </div>
      </div>
    </>
  );
}
