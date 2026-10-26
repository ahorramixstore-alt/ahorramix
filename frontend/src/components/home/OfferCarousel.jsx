import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { OFFER_SLIDES, SIDE_TILES } from "@/config/promos";
import { IS_DEMO } from "@/lib/commerce";

function Slide({ s }) {
  return (
    <div className="min-w-0 shrink-0 grow-0 basis-full">
      <div className="relative h-[400px] md:h-[440px] rounded-[28px] overflow-hidden grid grid-cols-1 md:grid-cols-2" style={{ background: s.bg, color: s.ink }}>
        <div className="relative z-10 p-7 pb-20 md:p-12 flex flex-col justify-end md:justify-center">
          <p className="font-mono-am text-[12px] uppercase tracking-[0.2em] opacity-80">{s.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.02]">{s.title}</h2>
          <p className="mt-3 text-[15px] opacity-90 max-w-sm">{s.text}</p>
          <Link to={s.to} data-testid={`offer-slide-cta-${s.id}`} className="mt-6 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-transform hover:scale-[1.03]" style={{ background: s.ink, color: s.bg }}>
            {s.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="absolute md:relative inset-0 md:inset-auto md:m-5 md:rounded-[22px] overflow-hidden">
          <img src={s.image} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-25 md:opacity-100" />
        </div>
      </div>
    </div>
  );
}

export function OfferCarousel() {
  const [ref, api] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => { if (api) setIndex(api.selectedScrollSnap()); }, [api]);
  useEffect(() => {
    if (!api) return undefined;
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);
  useEffect(() => {
    if (!api || paused) return undefined;
    const t = setInterval(() => api.scrollNext(), 5500);
    return () => clearInterval(t);
  }, [api, paused]);

  return (
    <section className="am-container -mt-10 md:-mt-14 relative z-10" data-testid="offer-carousel">
      <div className="grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="overflow-hidden rounded-[28px] shadow-[0_30px_60px_rgba(14,16,21,0.18)]" ref={ref}>
            <div className="flex">{OFFER_SLIDES.map((s) => <Slide key={s.id} s={s} />)}</div>
          </div>
          <div className="absolute bottom-5 right-5 flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              {OFFER_SLIDES.map((s, i) => (
                <button key={s.id} onClick={() => api?.scrollTo(i)} aria-label={`Oferta ${i + 1}`} data-testid={`offer-dot-${i}`}
                  className={`h-2.5 rounded-full transition-[width,background-color] duration-300 ${i === index ? "w-8 bg-white" : "w-2.5 bg-white/50"}`} />
              ))}
            </div>
            <button onClick={() => api?.scrollPrev()} aria-label="Anterior" data-testid="offer-prev" className="h-10 w-10 rounded-full bg-white text-[var(--am-ink)] grid place-items-center hover:scale-105 transition-transform"><ArrowLeft className="h-4 w-4" /></button>
            <button onClick={() => api?.scrollNext()} aria-label="Siguiente" data-testid="offer-next" className="h-10 w-10 rounded-full bg-white text-[var(--am-ink)] grid place-items-center hover:scale-105 transition-transform"><ArrowRight className="h-4 w-4" /></button>
          </div>
          {IS_DEMO && <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/85 text-[11px] font-semibold text-[var(--am-ink)]">Promociones de ejemplo</span>}
        </div>
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
          {SIDE_TILES.map((t) => (
            <Link key={t.id} to={t.to} data-testid={`side-tile-${t.id}`} className="group relative h-[200px] lg:h-[212px] rounded-[24px] overflow-hidden p-5 md:p-6 flex flex-col justify-between" style={{ background: t.bg }}>
              <img src={t.image} alt="" aria-hidden="true" className="absolute right-0 bottom-0 w-[48%] md:w-[55%] h-[55%] md:h-[70%] object-cover rounded-tl-[22px] transition-transform duration-700 group-hover:scale-105" />
              <div className="relative">
                <p className="font-mono-am text-[11px] uppercase tracking-[0.2em] text-[var(--am-ink-2)]">{t.eyebrow}</p>
                <h3 className="mt-1 font-display text-lg md:text-2xl font-extrabold tracking-tight leading-tight max-w-[75%] md:max-w-[60%]">{t.title}</h3>
              </div>
              <span className="relative h-10 w-10 rounded-full bg-[var(--am-ink)] text-white grid place-items-center transition-transform group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
