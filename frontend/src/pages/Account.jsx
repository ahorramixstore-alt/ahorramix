import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";
import { getAccountUrl, IS_DEMO } from "@/lib/commerce";

export default function Account() {
  const url = getAccountUrl();
  return (
    <>
      <Seo title="Mi cuenta" noindex path="/cuenta" />
      <PageHead eyebrow="Cuenta de cliente" title="Mi cuenta">
        Consulta tus pedidos, el estado de cada envío, tus direcciones y tus datos de acceso.
      </PageHead>
      <div className="am-container max-w-2xl">
        {IS_DEMO ? (
          <div className="rounded-[24px] border border-[var(--am-line)] bg-white p-8" data-testid="account-demo-notice">
            <h2 className="font-display text-2xl font-bold">Disponible tras conectar WooCommerce</h2>
            <p className="mt-3 text-[var(--am-ink-2)] leading-relaxed">El registro, el inicio de sesión, el historial de pedidos y el seguimiento los gestiona WooCommerce en tu alojamiento de Hostinger. En esta demostración no hay cuentas reales.</p>
            <Link to="/tienda" className="mt-6 inline-flex px-6 py-3 rounded-full border border-[var(--am-ink)]/15 font-medium">Seguir comprando</Link>
          </div>
        ) : (
          <a href={url} data-testid="account-login-link" className="inline-flex px-8 py-4 rounded-full bg-[var(--am-ink)] text-white font-semibold hover:bg-[var(--am-emerald)] transition-colors">Acceder o crear cuenta</a>
        )}
      </div>
    </>
  );
}
