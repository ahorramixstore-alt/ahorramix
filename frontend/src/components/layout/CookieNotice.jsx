import { useState } from "react";
import { Link } from "react-router-dom";

const KEY = "ahorramix_cookie_choice";

// Aviso básico: la tienda no carga cookies analíticas ni publicitarias hasta que configures una herramienta de consentimiento.
export function CookieNotice() {
  const [choice, setChoice] = useState(() => localStorage.getItem(KEY));
  if (choice) return null;
  const save = (v) => { localStorage.setItem(KEY, v); setChoice(v); };
  return (
    <div data-testid="cookie-notice" className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm z-[60] rounded-2xl bg-white border border-[var(--am-line)] shadow-[0_20px_50px_rgba(14,16,21,0.12)] p-5">
      <p className="text-sm text-[var(--am-ink-2)] leading-relaxed">
        Usamos almacenamiento local técnico para el carrito. No hay cookies analíticas activas. Más información en la <Link to="/legal/cookies" className="underline">política de cookies</Link>.
      </p>
      <div className="mt-4 flex gap-2">
        <button data-testid="cookie-accept" onClick={() => save("accepted")} className="flex-1 h-10 rounded-full bg-[var(--am-black)] text-white text-sm font-medium">Aceptar</button>
        <button data-testid="cookie-reject" onClick={() => save("rejected")} className="flex-1 h-10 rounded-full border border-[var(--am-line)] text-sm font-medium">Rechazar</button>
      </div>
    </div>
  );
}
