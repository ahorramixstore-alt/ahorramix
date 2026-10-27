import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IS_DEMO } from "@/lib/commerce";
import { GOOGLE_CLIENT_ID } from "@/config/runtime";
import * as api from "@/lib/commerce/account";

// "demo": inicio de sesión de prueba (solo en este navegador). "google": real vía WooCommerce. "off": sin configurar.
export const AUTH_MODE = IS_DEMO ? "demo" : GOOGLE_CLIENT_ID ? "google" : "off";
const KEY = "am_session";
const DEMO_USER = { name: "Cliente de prueba", firstName: "Cliente", email: "cliente.prueba@ejemplo.com", avatar: "", demo: true, orders: [] };

const AuthContext = createContext(null);
const readSession = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } };

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [loginOpen, setLoginOpen] = useState(false);

  const save = useCallback((s) => { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); setSession(s); }, []);

  useEffect(() => {
    if (AUTH_MODE !== "google" || !session?.token) return undefined;
    let alive = true;
    api.fetchMe(session.token)
      .then((user) => { if (alive) save({ token: session.token, user }); })
      .catch((e) => { if (alive && e.status === 401) save(null); });
    return () => { alive = false; };
  }, [session?.token, save]);

  const loginGoogle = useCallback(async (credential) => {
    const { token, user } = await api.loginWithGoogle(credential);
    save({ token, user });
  }, [save]);

  const loginDemo = useCallback(() => save({ token: "demo", user: DEMO_USER }), [save]);

  const logout = useCallback(() => {
    if (AUTH_MODE === "google" && session?.token) api.logout(session.token).catch(() => {});
    save(null);
  }, [session?.token, save]);

  // Al pagar, inicia sesión también en el checkout de WooCommerce con un código de un solo uso.
  const goCheckout = useCallback(async (url) => {
    if (AUTH_MODE === "google" && session?.token) {
      try { const { code } = await api.createHandoff(session.token); window.location.href = `${url}&ahorramix_sso=${encodeURIComponent(code)}`; return; } catch { /* sigue sin sesión */ }
    }
    window.location.href = url;
  }, [session?.token]);

  const value = useMemo(() => ({ user: session?.user || null, loginOpen, setLoginOpen, loginGoogle, loginDemo, logout, goCheckout }),
    [session, loginOpen, loginGoogle, loginDemo, logout, goCheckout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
