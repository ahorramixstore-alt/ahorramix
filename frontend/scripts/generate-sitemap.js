#!/usr/bin/env node
// Genera sitemap.xml (y añade la línea Sitemap a robots.txt) a partir de WooCommerce.
// Uso: node scripts/generate-sitemap.js [carpeta_salida]   (por defecto: build/)
// Se ejecuta solo tras `yarn build` (postbuild) y también con `yarn sitemap`.
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const SITE = (process.env.REACT_APP_SITE_URL || "").replace(/\/$/, "");
const WC = (process.env.REACT_APP_WC_STORE_URL || "").replace(/\/$/, "");
const IS_WOO = process.env.REACT_APP_COMMERCE_MODE === "woocommerce" && WC;
const OUT = path.resolve(process.argv[2] || path.join(__dirname, "..", "build"));

// Mantener sincronizado con src/data/legal.js y las rutas de src/App.js
const STATIC = ["/", "/tienda", "/preguntas-frecuentes", "/contacto", "/sobre-nosotros",
  "/legal/aviso-legal", "/legal/privacidad", "/legal/cookies", "/legal/condiciones", "/legal/envios", "/legal/devoluciones"];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

async function getAll(endpoint) {
  const items = [];
  for (let page = 1; page <= 50; page += 1) {
    const sep = endpoint.includes("?") ? "&" : "?";
    const res = await fetch(`${WC}/wp-json/wc/store/v1/${endpoint}${sep}per_page=100&page=${page}`);
    if (!res.ok) throw new Error(`${endpoint} respondió ${res.status}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items;
}

async function main() {
  if (!SITE) {
    console.warn("[sitemap] REACT_APP_SITE_URL está vacío: no se genera sitemap.xml.");
    return;
  }
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const urls = STATIC.map((p) => ({ loc: `${SITE}${p}`, priority: p === "/" ? "1.0" : p === "/tienda" ? "0.9" : "0.3" }));
  if (IS_WOO) {
    const [cats, products] = await Promise.all([getAll("products/categories"), getAll("products")]);
    cats.filter((c) => c.count > 0).forEach((c) => urls.push({ loc: `${SITE}/categoria/${c.slug}`, priority: "0.7" }));
    products.forEach((p) => urls.push({ loc: `${SITE}/producto/${p.slug}`, priority: "0.8" }));
    console.log(`[sitemap] ${cats.length} categorías y ${products.length} productos leídos de WooCommerce.`);
  } else {
    console.warn("[sitemap] Modo demo: solo páginas estáticas (los productos de ejemplo no se indexan).");
  }

  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`)
    .join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), xml);

  const robotsPath = path.join(OUT, "robots.txt");
  if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, "utf8").split("\n").filter((l) => !/^#?\s*Sitemap:/i.test(l)).join("\n").trimEnd();
    fs.writeFileSync(robotsPath, `${robots}\nSitemap: ${SITE}/sitemap.xml\n`);
  }
  console.log(`[sitemap] ${urls.length} URLs escritas en ${path.join(OUT, "sitemap.xml")}`);
}

main().catch((e) => {
  console.error(`[sitemap] Error: ${e.message}. Revisa REACT_APP_WC_STORE_URL y que WooCommerce esté accesible.`);
  process.exit(1);
});
