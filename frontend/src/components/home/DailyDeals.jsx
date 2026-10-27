import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { DAILY_DEAL } from "@/config/promos";
import { IS_DEMO } from "@/lib/commerce";
import { eur, discountPct } from "@/lib/format";

const endOfToday = () => { const d = new Date(); d.setHours(23, 59, 59, 0); return d; };

function useCountdown(end) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!end) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [end]);
  if (!end) return null;
  const left = Math.max(0, end.getTime() - now);
  return { left, h: Math.floor(left / 3.6e6), m: Math.floor((left % 3.6e6) / 6e4), s: Math.floor((left % 6e4) / 1000) };
}

const Box = ({ v, label, id }) => (
  <div className="text-center">
    <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-[var(--am-orange)] text-[var(--am-ink)] grid place-items-center font-display text-3xl md:text-4xl font-extrabold tabular-nums" data-testid={id}>{String(v).padStart(2, "0")}</div>
    <p className="mt-2 text-[12px] uppercase tracking-wider text-zinc-300">{label}</p>
  </div>
);

function DealCard({ p }) {
  return (
    <Link to={`/producto/${p.slug}`} data-testid={`deal-card-${p.slug}`} className="group shrink-0 w-[64vw] sm:w-[260px] lg:w-auto snap-start rounded-[22px] bg-white text-[var(--am-ink)] p-3 transition-transform hover:-translate-y-1">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--am-bg-2)]">
        <img src={p.images?.[0]?.src} alt={p.images?.[0]?.alt || p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[var(--am-orange)] text-[12px] font-bold">−{discountPct(p)}%</span>
      </div>
      <div className="px-1.5 pt-3 pb-1.5">
        <h3 className="font-medium text-[15px] leading-snug line-clamp-1">{p.name}</h3>
        <div className="mt-1 flex items-baseline gap-2"><span className="font-display text-xl font-extrabold text-[var(--am-price)]">{eur(p.price)}</span><span className="text-[13px] line-through text-[var(--am-ink-2)]">{eur(p.regularPrice)}</span></div>
        <p className="mt-1 text-[12px] font-semibold text-[var(--am-emerald)]">Ahorras {eur(p.regularPrice - p.price)}</p>
      </div>
    </Link>
  );
}

export function DailyDeals({ products }) {
  const end = useMemo(() => (DAILY_DEAL.endsAt ? new Date(DAILY_DEAL.endsAt) : IS_DEMO ? endOfToday() : null), []);
  const c = useCountdown(end);
  const deals = products.filter((p) => p.tags?.includes(DAILY_DEAL.tag) && discountPct(p) > 0).slice(0, 4);
  if (!deals.length || (c && c.left === 0)) return null;
  return (
    <section id="ofertas-del-dia" className="am-container py-16 md:py-20 scroll-mt-28" data-testid="daily-deals">
      <div className="rounded-[32px] bg-[var(--am-black)] text-white p-6 md:p-10 grid lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[var(--am-orange)]/25 blur-3xl" aria-hidden="true" />
        <div className="lg:col-span-4 relative">
          <p className="inline-flex items-center gap-2 font-mono-am text-[12px] uppercase tracking-[0.2em] text-[var(--am-yellow)]"><Flame className="h-4 w-4" /> Ofertas del día</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02]">Precios rebajados por tiempo limitado</h2>
          {c && (
            <>
              <div className="mt-7 flex items-start gap-3" data-testid="deal-countdown"><Box v={c.h} label="horas" id="countdown-hours" /><Box v={c.m} label="min" id="countdown-minutes" /><Box v={c.s} label="seg" id="countdown-seconds" /></div>
              {IS_DEMO && !DAILY_DEAL.endsAt && <p className="mt-3 text-[12px] text-zinc-400">Fecha de fin de ejemplo. Configúrala en <code>config/promos.js</code>.</p>}
            </>
          )}
          <Link to="/tienda?ofertas=1" className="mt-7 inline-flex px-6 py-3 rounded-full bg-white text-[var(--am-ink)] font-bold hover:bg-[var(--am-yellow)] transition-colors">Ver todas las ofertas</Link>
        </div>
        <div className="lg:col-span-8 relative -mx-6 px-6 scroll-px-6 lg:mx-0 lg:px-0 flex lg:grid lg:grid-cols-4 gap-3 overflow-x-auto snap-x pb-2 lg:pb-0 [scrollbar-width:none]" data-lenis-prevent>
          {deals.map((p) => <DealCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
