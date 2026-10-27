// Cuentas de cliente: endpoints del plugin Ahorramix Bridge (/wp-json/ahorramix/v1). Ver docs/11-LOGIN-GOOGLE.md.
import { WC_STORE_URL } from "@/config/runtime";

const API = `${WC_STORE_URL}/wp-json/ahorramix/v1`;

async function call(path, { token, body, method = body ? "POST" : "GET" } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    // Cabecera propia: algunos servidores de Hostinger eliminan "Authorization" antes de llegar a PHP.
    headers: { "Content-Type": "application/json", ...(token ? { "X-Ahorramix-Token": token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data?.message || "Error de conexión con la tienda"), { status: res.status });
  return data;
}

export const loginWithGoogle = (credential) => call("/auth/google", { body: { credential } });
export const fetchMe = (token) => call("/me", { token });
export const logout = (token) => call("/auth/logout", { token, method: "POST" });
export const createHandoff = (token) => call("/auth/handoff", { token, method: "POST" });
