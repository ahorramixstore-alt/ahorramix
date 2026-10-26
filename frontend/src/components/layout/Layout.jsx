import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { CookieNotice } from "./CookieNotice";
import { DemoBanner } from "./DemoBanner";
import { AnnouncementBar } from "./AnnouncementBar";

let lenis = null;

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = 0;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenis = null; };
  }, []);

  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        const el = document.querySelector(hash);
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: -120 });
        else el.scrollIntoView({ behavior: "smooth" });
      }, 350);
      return () => clearTimeout(t);
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <CookieNotice />
    </div>
  );
}
