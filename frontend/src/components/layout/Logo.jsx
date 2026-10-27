import { STORE } from "@/config/store";

// Logotipo: sustituye /public/images/brand/ahorramix-logo.png para cambiarlo.
const SRC = `${process.env.PUBLIC_URL}/images/brand/ahorramix-logo.png`;

export function Logo({ light = false }) {
  const img = (
    <img src={SRC} alt={STORE.name} width="640" height="374"
      className={light ? "h-20 w-auto" : "h-12 md:h-14 w-auto"}
      data-testid={light ? "footer-logo" : "site-logo"} />
  );
  return light ? <span className="inline-block rounded-2xl bg-white px-4 py-3">{img}</span> : img;
}
