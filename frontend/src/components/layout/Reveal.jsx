import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, className = "", y = 28 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function PageHead({ eyebrow, title, children }) {
  return (
    <section className="am-container pt-14 md:pt-20 pb-10">
      {eyebrow && <p className="font-mono-am text-[12px] uppercase tracking-[0.25em] text-[var(--am-emerald)] mb-4">{eyebrow}</p>}
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.02] max-w-4xl">{title}</h1>
      {children && <div className="mt-5 max-w-2xl text-base md:text-lg text-[var(--am-ink-2)] leading-relaxed">{children}</div>}
    </section>
  );
}
