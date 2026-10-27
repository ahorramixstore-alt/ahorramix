import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const Ctx = createContext(null);
const read = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };

// Lista de deseos y vistos recientemente, guardados en el navegador de cada visitante.
export function ShopperProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => read("ahorramix_wishlist_v1"));
  const [recent, setRecent] = useState(() => read("ahorramix_recent_v1"));

  useEffect(() => { localStorage.setItem("ahorramix_wishlist_v1", JSON.stringify(wishlist)); }, [wishlist]);
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
