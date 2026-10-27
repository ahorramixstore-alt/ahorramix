import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NEWSLETTER_ACTION, NEWSLETTER_FIELD, WELCOME } from "@/config/runtime";

const KEY = "am_welcome_seen";

function CodeBox() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(WELCOME.code); setCopied(true); };
  return (
    <div className="mt-6 space-y-3">
      <button onClick={copy} data-testid="welcome-copy-code" className="w-full h-14 rounded-2xl border-2 border-dashed border-[var(--am-orange)] bg-[var(--am-bg)] flex items-center justify-center gap-3 font-mono text-xl font-bold tracking-widest hover:bg-white transition-colors">
        <span data-testid="welcome-code">{WELCOME.code}</span>
        {copied ? <Check className="h-5 w-5 text-[var(--am-emerald)]" /> : <Copy className="h-5 w-5 text-[var(--am-ink-2)]" />}
      </button>
      <p className="text-[13px] text-[var(--am-ink-2)] text-center">{copied ? "¡Copiado! " : ""}Escríbelo en el campo «Cupón» al finalizar tu compra.</p>
    </div>
  );
}

function EmailStep({ onDone }) {
  return (
    <form action={NEWSLETTER_ACTION} method="post" target="am-welcome-frame" onSubmit={() => setTimeout(onDone, 300)} className="mt-6 space-y-3">
      <input type="email" name={NEWSLETTER_FIELD} required placeholder="Tu email" aria-label="Tu email" data-testid="welcome-email-input" className="w-full h-12 rounded-full border border-[var(--am-line)] px-5 text-sm outline-none focus:border-[var(--am-black)]" />
      <button data-testid="welcome-email-submit" className="w-full h-12 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] font-bold hover:brightness-95 transition-[filter]">Quiero mi código</button>
      <p className="text-[12px] text-[var(--am-ink-2)] text-center">Al enviarlo aceptas recibir ofertas por email y la política de privacidad. Puedes darte de baja cuando quieras.</p>
      <iframe name="am-welcome-frame" title="Suscripción" className="hidden" />
    </form>
  );
}

export function WelcomeOffer() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(!NEWSLETTER_ACTION);
  useEffect(() => {
    if (!WELCOME.code || localStorage.getItem(KEY)) return undefined;
    const t = setTimeout(() => { setOpen(true); localStorage.setItem(KEY, "1"); }, WELCOME.delay);
    return () => clearTimeout(t);
  }, []);
  if (!WELCOME.code) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent data-testid="welcome-offer" className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-[28px] sm:rounded-[28px] p-0 overflow-hidden [&>button]:text-white [&>button]:opacity-90">
        <div className="bg-[var(--am-black)] text-white px-7 pt-8 pb-7">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--am-orange)]">Bienvenida</p>
          <DialogTitle className="mt-2 font-display text-3xl font-extrabold leading-tight">{WELCOME.discount} de descuento en tu primera compra</DialogTitle>
        </div>
        <div className="px-7 pb-7">
          <DialogDescription className="mt-5 text-[15px] text-[var(--am-ink-2)]">
            {revealed ? "Aquí tienes tu código. Úsalo en el checkout." : "Déjanos tu email y te mostramos tu código al instante."}
          </DialogDescription>
          {revealed ? <CodeBox /> : <EmailStep onDone={() => setRevealed(true)} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
