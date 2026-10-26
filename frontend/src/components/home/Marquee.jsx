const WORDS = ["Lo esencial", "Bien elegido", "A buen precio", "Hogar", "Tecnología", "Moda", "Bienestar", "Mascotas"];

export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center font-display text-4xl md:text-6xl font-bold tracking-tight px-6 md:px-10 whitespace-nowrap">
          {w}<span className="ml-12 md:ml-20 h-3 w-3 md:h-4 md:w-4 rounded-full bg-[#2BB58F]" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <section aria-label="Lema" className="bg-[var(--am-dark)] text-[#fbfbf9] py-8 md:py-10 overflow-hidden" data-testid="editorial-marquee">
      <div className="am-marquee-track flex w-max">{row}{row}</div>
    </section>
  );
}
