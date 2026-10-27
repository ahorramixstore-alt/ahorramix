import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth, AUTH_MODE } from "@/context/AuthContext";
import { GOOGLE_CLIENT_ID } from "@/config/runtime";
import { STORE } from "@/config/store";

const GoogleG = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

function DemoButton({ onDone }) {
  const { loginDemo } = useAuth();
  return (
    <>
      <button onClick={() => { loginDemo(); onDone(); }} data-testid="google-login-demo-button"
        className="w-full h-12 rounded-full border border-[var(--am-line)] bg-white flex items-center justify-center gap-3 font-semibold hover:bg-[var(--am-bg-2)] transition-colors">
        <GoogleG /> Iniciar sesión con Google
      </button>
      <p className="mt-3 text-[12px] text-[var(--am-ink-2)] text-center" data-testid="login-demo-note">Modo de prueba: se crea un perfil de ejemplo solo en este navegador, sin usar tu cuenta de Google.</p>
    </>
  );
}

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
// Google Identity Services usa el origen actual (window.location.origin), que debe figurar en Google Cloud.
function RealButton({ onDone }) {
  const { loginGoogle } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const ok = async ({ credential }) => {
    setBusy(true); setError("");
    try { await loginGoogle(credential); onDone(); } catch (e) { setError(e.message || "No se pudo iniciar sesión"); } finally { setBusy(false); }
  };
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex justify-center min-h-[44px]" data-testid="google-login-button">
        <GoogleLogin onSuccess={ok} onError={() => setError("Google no ha completado el inicio de sesión. Inténtalo de nuevo.")} text="signin_with" shape="pill" size="large" width="320" locale="es" />
      </div>
      {busy && <p className="mt-3 text-sm text-center text-[var(--am-ink-2)]">Conectando con tu cuenta…</p>}
      {error && <p className="mt-3 text-sm text-center text-red-700" data-testid="login-error">{error}</p>}
    </GoogleOAuthProvider>
  );
}

export function LoginDialog() {
  const { loginOpen, setLoginOpen } = useAuth();
  const navigate = useNavigate();
  const done = () => { setLoginOpen(false); navigate("/cuenta"); };
  return (
    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
      <DialogContent data-testid="login-dialog" className="max-w-[calc(100%-2rem)] sm:max-w-sm rounded-[28px] sm:rounded-[28px] p-8">
        <img src={`${process.env.PUBLIC_URL}/images/brand/ahorramix-logo.png`} alt={STORE.name} className="h-16 w-auto mx-auto" />
        <DialogTitle className="mt-4 font-display text-2xl font-extrabold text-center">Accede a tu cuenta</DialogTitle>
        <DialogDescription className="text-center text-[14px] text-[var(--am-ink-2)]">Consulta tus pedidos y compra más rápido con tus datos guardados.</DialogDescription>
        <div className="mt-6">
          {AUTH_MODE === "demo" && <DemoButton onDone={done} />}
          {AUTH_MODE === "google" && <RealButton onDone={done} />}
          {AUTH_MODE === "off" && <p className="text-sm text-center text-[var(--am-ink-2)]" data-testid="login-off-note">El inicio de sesión con Google estará disponible muy pronto.</p>}
        </div>
        <p className="mt-6 text-[12px] text-center text-[var(--am-ink-2)]">Al continuar aceptas las condiciones y la política de privacidad de la tienda.</p>
      </DialogContent>
    </Dialog>
  );
}
