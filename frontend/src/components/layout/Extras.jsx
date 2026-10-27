import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { NEWSLETTER_ACTION, NEWSLETTER_FIELD } from "@/config/runtime";
import { scrollToTop } from "./Layout";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 900);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button onClick={scrollToTop} aria-label="Volver arriba" data-testid="back-to-top"
      className={`fixed bottom-24 right-4 z-40 h-11 w-11 rounded-full bg-[var(--am-black)] text-white grid place-items-center shadow-lg transition-[opacity,transform] duration-300 ${show ? "opacity-100" : "opacity-0 translate-y-3 pointer-events-none"}`}>
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}

// Newsletter: envía el formulario a tu herramienta de email (newsletterAction en ahorramix-config.js).
export function Newsletter() {
  const active = Boolean(NEWSLETTER_ACTION);
  return (
    <div className="rounded-[24px] bg-white/[0.06] border border-white/10 p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center" data-testid="newsletter">
      <div>
        <h3 className="font-display text-2xl md:text-3xl font-extrabold">Recibe las ofertas antes que nadie</h3>
        <p className="mt-2 text-zinc-300 text-[15px]">Suscríbete y te avisaremos de novedades y promociones. Puedes darte de baja cuando quieras.</p>
      </div>
      <form action={active ? NEWSLETTER_ACTION : undefined} method="post" target="_blank" onSubmit={(e) => { if (!active) e.preventDefault(); }} className="space-y-2">
        <div className="flex gap-2">
          <input type="email" name={NEWSLETTER_FIELD} required disabled={!active} placeholder="Tu email" aria-label="Tu email" data-testid="newsletter-email-input" className="flex-1 min-w-0 h-12 rounded-full bg-white text-[var(--am-ink)] px-5 text-sm outline-none disabled:opacity-60" />
          <button disabled={!active} data-testid="newsletter-submit" className="h-12 px-6 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] font-bold disabled:opacity-60">Suscribirme</button>
        </div>
        <p className="text-[12px] text-zinc-400">{active ? "Al suscribirte aceptas la política de privacidad." : "Suscripción pendiente de conectar con tu herramienta de email (ver docs)."}</p>
      </form>
    </div>
  );
}
