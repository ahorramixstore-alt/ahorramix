import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext(null);
const KEY = "ahorramix_cart_v1";

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const api = useMemo(() => {
    const add = (product, options = {}, qty = 1, variationId = null) => {
      const key = `${product.id}|${Object.values(options).join("|")}`;
      setItems((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(99, i.qty + qty) } : i));
        return [...prev, { key, productId: product.id, variationId, slug: product.slug, name: product.name, image: product.images?.[0]?.src || "", price: product.price, options, qty }];
      });
      toast.success(`${product.name} añadido al carrito`);
      setOpen(true);
    };
    const setQty = (key, qty) => setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)));
    const remove = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
    const clear = () => setItems([]);
    return { add, setQty, remove, clear };
  }, []);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);

  return <CartContext.Provider value={{ items, count, subtotal, open, setOpen, ...api }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
