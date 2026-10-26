import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ANNOUNCEMENTS, ANNOUNCEMENT_INTERVAL_MS } from "@/config/announcements";

const KEY = "ahorramix_announcements_closed";

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [closed, setClosed] = useState(() => sessionStorage.getItem(KEY) === "1");
  const n = ANNOUNCEMENTS.length;

  useEffect(() => {
    if (n < 2 || paused || closed) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % n), ANNOUNCEMENT_INTERVAL_MS);
    return () => clearInterval(t);
  }, [n, paused, closed]);

  if (!n || closed) return null;
  const msg = ANNOUNCEMENTS[i];
  const close = () => { sessionStorage.setItem(KEY, "1"); setClosed(true); };
  const go = (d) => setI((x) => (x + d + n) % n);
  const text = <span className="font-semibold">{msg.text}</span>;

  return (
    <div data-testid="announcement-bar" className="bg-[var(--am-orange)] text-[var(--am-ink)] text-[13px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="am-container h-10 flex items-center gap-2">
        {n > 1 && <button onClick={() => go(-1)} aria-label="Aviso anterior" data-testid="announcement-prev" className="p-1 rounded-full hover:bg-black/10"><ChevronLeft className="h-4 w-4" /></button>}
        <div className="relative flex-1 h-full overflow-hidden" aria-live="polite">
          <AnimatePresence initial={false}>
            <motion.div key={i} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center text-center px-2" data-testid="announcement-message">
              {msg.to ? <Link to={msg.to} className="hover:underline underline-offset-2 truncate">{text}</Link> : <span className="truncate">{text}</span>}
            </motion.div>
          </AnimatePresence>
        </div>
        {n > 1 && <button onClick={() => go(1)} aria-label="Siguiente aviso" data-testid="announcement-next" className="p-1 rounded-full hover:bg-black/10"><ChevronRight className="h-4 w-4" /></button>}
        <button onClick={close} aria-label="Cerrar avisos" data-testid="announcement-close" className="p-1 rounded-full hover:bg-black/10 ml-1"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
