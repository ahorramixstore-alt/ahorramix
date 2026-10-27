import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Ctx = createContext(null);
const read = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };

// Lista de deseos y vistos recientemente en el navegador. Con sesión iniciada, la lista de deseos se guarda también en la cuenta.
export function ShopperProvider({ children }) {
  const { user, wishSync, saveWishlist } = useAuth();
  const [wishlist, setWishlist] = useState(() => read("ahorramix_wishlist_v1"));
  const [recent, setRecent] = useState(() => read("ahorramix_recent_v1"));
  const canPush = useRef(Boolean(user?.demo));
  const hadUser = useRef(Boolean(user));

  useEffect(() => {
    if (!wishSync) return;
    setWishlist((w) => (wishSync.reason === "login" ? [...new Set([...w, ...wishSync.list])] : wishSync.list));
    canPush.current = true;
  }, [wishSync]);

  useEffect(() => {
    if (user) { hadUser.current = true; return; }
    if (hadUser.current) { hadUser.current = false; canPush.current = false; setWishlist([]); }
  }, [user]);

  useEffect(() => { localStorage.setItem("ahorramix_wishlist_v1", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => {
    if (!user || !canPush.current) return undefined;
    const t = setTimeout(() => saveWishlist(wishlist), 500);
    return () => clearTimeout(t);
  }, [wishlist, user, saveWishlist]);
  useEffect(() => { localStorage.setItem("ahorramix_recent_v1", JSON.stringify(recent)); }, [recent]);

  const toggleWish = (product) => {
    setWishlist((w) => {
      const has = w.includes(product.slug);
      toast.success(has ? "Eliminado de tu lista de deseos" : "Guardado en tu lista de deseos");
      return has ? w.filter((s) => s !== product.slug) : [product.slug, ...w];
    });
  };
  const addRecent = (slug) => setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 12));

  return <Ctx.Provider value={{ wishlist, toggleWish, isWished: (s) => wishlist.includes(s), recent, addRecent }}>{children}</Ctx.Provider>;
}

export const useShopper = () => useContext(Ctx);
