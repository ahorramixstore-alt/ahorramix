import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { ShopperProvider } from "@/context/ShopperContext";
import Wishlist from "@/pages/Wishlist";
import Tracking from "@/pages/Tracking";
import { Layout } from "@/components/layout/Layout";
import { SHOW_EVALUATOR } from "@/config/store";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import Account from "@/pages/Account";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Legal from "@/pages/Legal";
import Evaluator from "@/pages/Evaluator";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <CartProvider>
      <ShopperProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/categoria/:slug" element={<Shop />} />
            <Route path="/producto/:slug" element={<Product />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/cuenta" element={<Account />} />
            <Route path="/lista-de-deseos" element={<Wishlist />} />
            <Route path="/seguimiento" element={<Tracking />} />
            <Route path="/preguntas-frecuentes" element={<Faq />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/legal/:slug" element={<Legal />} />
            {SHOW_EVALUATOR && <Route path="/evaluador" element={<Evaluator />} />}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-left" />
      </ShopperProvider>
    </CartProvider>
  );
}

export default App;
