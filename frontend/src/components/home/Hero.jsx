import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { IS_DEMO } from "@/lib/commerce";

const EASE = [0.76, 0, 0.24, 1];
const LINES = [<>Lo esencial,</>, <>bien elegido,</>, <>a buen <span className="text-[var(--am-emerald)] italic font-bold">precio.</span></>];

function HeroVisual() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });
  const { scrollY } = useScroll();
  const yImg = useTransform(scrollY, [0, 700], [0, -60]);
  const yChip = useTransform(scrollY, [0, 700], [0, -150]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="relative mx-auto w-full max-w-[460px] lg:max-w-none" style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, y: yImg, transformStyle: "preserve-3d" }} className="relative">
        <motion.div initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 28px 28px)" }} animate={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 28px 28px)" }}
          transition={{ duration: 1.4, delay: 0.35, ease: EASE }} className="relative aspect-[4/5] overflow-hidden bg-[#e9e4dc] grain">
          <motion.img src="/images/vase-aro.jpg" alt="Jarrón cerámico circular sobre fondo neutro" initial={{ scale: 1.25 }} animate={{ scale: 1 }}
            transition={{ duration: 2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }} className="w-full h-full object-cover" fetchpriority="high" />
        </motion.div>
        <div className="absolute -left-4 sm:-left-10 bottom-10 w-28 sm:w-36 aspect-square rounded-full overflow-hidden border-[6px] border-[var(--am-bg)] shadow-xl" style={{ transform: "translateZ(60px)" }}>
          <img src="/images/headphones-eco.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </div>
      </motion.div>
      <motion.div style={{ y: yChip }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-2 sm:-right-6 top-10 rounded-2xl bg-white/90 backdrop-blur-xl border border-[var(--am-line)] shadow-[0_18px_40px_rgba(14,16,21,0.10)] px-4 py-3">
        <Link to="/producto/jarron-ceramico-aro" data-testid="hero-featured-chip" className="flex items-center gap-3">
          <div>
            <p className="text-[12px] text-[var(--am-ink-2)]">{IS_DEMO ? "Producto de ejemplo" : "Destacado"}</p>
            <p className="text-sm font-semibold">Jarrón cerámico Aro</p>
          </div>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden" data-testid="home-hero">
      <div className="am-container grid lg:grid-cols-12 gap-12 lg:gap-8 pt-10 md:pt-16 pb-16 md:pb-24 items-center">
        <div className="lg:col-span-7">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-mono-am text-[12px] uppercase tracking-[0.28em] text-[var(--am-emerald)] mb-6">
            Tienda online · Envíos a España
          </motion.p>
          <h1 className="font-display font-extrabold tracking-[-0.045em] leading-[0.95] text-[2.75rem] sm:text-6xl lg:text-[5.4rem] xl:text-[6.1rem]">
            {LINES.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.15 + i * 0.13, ease: EASE }}>{l}</motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}>
            <p className="mt-7 max-w-xl text-base md:text-lg text-[var(--am-ink-2)] leading-relaxed">
              Productos útiles para casa, tecnología y día a día, seleccionados uno a uno. Precio final con IVA, plazo de entrega en cada ficha y devoluciones explicadas sin letra pequeña.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/tienda" data-testid="hero-explore-button" className="group h-13 px-7 py-4 rounded-full bg-[var(--am-ink)] text-white font-semibold inline-flex items-center gap-2 hover:bg-[var(--am-emerald)] transition-colors">
                Explorar la tienda <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/tienda?ofertas=1" data-testid="hero-offers-button" className="px-7 py-4 rounded-full border border-[var(--am-ink)]/15 font-semibold hover:border-[var(--am-ink)] transition-colors">
                Ver ofertas
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="lg:col-span-5 px-6 sm:px-10 lg:px-0">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
