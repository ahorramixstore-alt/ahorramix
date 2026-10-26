import { STORE } from "@/config/store";

// Logotipo editable: cambia el trazo del SVG o el texto en STORE.name.
export function LogoMark({ className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#0E1015" />
      <path d="M18 46 L32 16 L46 46" fill="none" stroke="#FBFBF9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 36 H40" stroke="#FBFBF9" strokeWidth="6" strokeLinecap="round" />
      <circle cx="47" cy="17" r="5" fill="#2BB58F" />
    </svg>
  );
}

export function Logo({ light = false }) {
  return (
    <span className="inline-flex items-center gap-2.5" data-testid="site-logo">
      <LogoMark />
      <span className={`font-display text-[22px] font-extrabold tracking-tight ${light ? "text-white" : "text-[var(--am-ink)]"}`}>
        {STORE.name.toLowerCase()}
        <span className="text-[#2BB58F]">.</span>
      </span>
    </span>
  );
}
