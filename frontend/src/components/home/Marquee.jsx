const WORDS = ["Ahorra en hogar", "Tecnología", "Moda", "Bienestar", "Mascotas", "Precio final con IVA"];

export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center font-display text-3xl md:text-5xl font-extrabold tracking-tight px-5 md:px-8 whitespace-nowrap">
          {w}<span className="ml-10 md:ml-16 text-[0.7em]" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <section aria-label="Lema" className="mt-20 md:mt-24 bg-[var(--am-orange)] text-[var(--am-ink)] py-6 md:py-8 overflow-hidden -rotate-1 scale-[1.02]" data-testid="editorial-marquee">
      <div className="am-marquee-track flex w-max">{row}{row}</div>
    </section>
  );
}
