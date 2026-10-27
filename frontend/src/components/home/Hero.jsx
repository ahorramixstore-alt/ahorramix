import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import { HERO_VIDEO } from "@/config/promos";

const EASE = [0.76, 0, 0.24, 1];
const LINES = [<><span className="text-[var(--am-yellow)]">Ahorra más</span></>, <>en todo lo que</>, <>te gusta.</>];

export function Hero() {
  const ref = useRef(null);
  const video = useRef(null);
  const [playing, setPlaying] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <section ref={ref} className="relative h-[82svh] min-h-[560px] max-h-[880px] overflow-hidden bg-[#f4b08a]" data-testid="home-hero">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <video ref={video} autoPlay muted loop playsInline preload="auto" poster={HERO_VIDEO.poster} data-testid="hero-video" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-[70%_center]">
          <source src={HERO_VIDEO.webmMobile} type="video/webm" media="(max-width: 767px)" />
          <source src={HERO_VIDEO.srcMobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={HERO_VIDEO.webm} type="video/webm" />
          <source src={HERO_VIDEO.src} type="video/mp4" />
        </video>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0e1015]/90 via-[#0e1015]/55 to-[#0e1015]/5" />

      <div className="relative am-container h-full flex flex-col justify-end pb-14 md:pb-20 text-white">
        <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="self-start inline-flex items-center gap-2 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] px-4 py-1.5 text-[13px] font-bold">
          <span className="h-2 w-2 rounded-full bg-[var(--am-black)] animate-pulse" /> Ofertas en hogar, tecnología y moda
        </motion.span>
        <h1 className="mt-6 font-display font-extrabold tracking-[-0.045em] leading-[0.95] text-[3rem] sm:text-7xl lg:text-[6.4rem] max-w-4xl">
          {LINES.map((l, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.2 + i * 0.13, ease: EASE }}>{l}</motion.span>
            </span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <p className="mt-5 max-w-xl text-base md:text-lg text-zinc-200 leading-relaxed">Productos útiles a precios claros: IVA incluido, plazo de entrega en cada ficha y devoluciones explicadas.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tienda?ofertas=1" data-testid="hero-offers-button" className="group px-7 py-4 rounded-full bg-[var(--am-orange)] text-[var(--am-ink)] font-bold inline-flex items-center gap-2 hover:bg-[var(--am-yellow)] transition-colors">
              Ver ofertas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/tienda" data-testid="hero-explore-button" className="px-7 py-4 rounded-full border border-white/40 font-semibold hover:bg-white hover:text-[var(--am-ink)] transition-colors">Explorar la tienda</Link>
          </div>
        </motion.div>
      </div>
      <button onClick={toggle} data-testid="hero-video-toggle" aria-label={playing ? "Pausar vídeo" : "Reproducir vídeo"}
        className="absolute bottom-5 right-5 h-11 w-11 rounded-full bg-white/15 backdrop-blur border border-white/30 text-white grid place-items-center hover:bg-white/30 transition-colors">
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
    </section>
  );
}
