#!/usr/bin/env python3
"""Genera el tema Shopify de Ahorramix (plantillas JSON, assets), el CSV de colecciones, las páginas y los ZIP.
Uso: python3 /app/shopify/build.py   ->  /app/export/shopify/
"""
import csv, json, os, re, shutil, subprocess, unicodedata, zipfile

ROOT = "/app/shopify"
THEME = f"{ROOT}/ahorramix-theme"
PUB = "/app/frontend/public"
OUT = "/app/export/shopify"

def handle(name):
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

# Estructura original de departamentos (frontend/src/data/demo/categories.js)
DEPTS = [
    ("Hogar y cocina", "Decoración, iluminación, textil y cocina.", "vase-aro.jpg", ["Decoración", "Iluminación", "Cocina", "Textil del hogar", "Orden y almacenaje"]),
    ("Electrónica", "Audio, relojes inteligentes y accesorios.", "headphones-eco.jpg", ["Audio", "Relojes inteligentes", "Carga y cables", "Accesorios para móvil", "Fotografía"]),
    ("Informática y oficina", "Accesorios de ordenador y escritorio.", "", ["Accesorios de PC", "Organización de escritorio", "Papelería"]),
    ("Moda", "Calzado, bolsos, gafas y accesorios.", "sneaker-brisa.jpg", ["Bolsos y mochilas", "Calzado", "Gafas y accesorios", "Joyería y relojes"]),
    ("Belleza y bienestar", "Cuidado personal y bienestar.", "serum-ambar.jpg", ["Cuidado personal", "Yoga y relajación", "Salud y masaje"]),
    ("Deportes y aire libre", "Fitness, camping y ciclismo.", "", ["Fitness", "Camping y senderismo", "Ciclismo"]),
    ("Mascotas", "Juguetes, camas y accesorios.", "dog-hueso.jpg", ["Juguetes para mascotas", "Camas para mascotas", "Comederos y bebederos"]),
    ("Bebé e infantil", "Juguetes y puericultura.", "", ["Juguetes", "Puericultura"]),
    ("Jardín y bricolaje", "Jardín, terraza y herramientas.", "", ["Jardín y terraza", "Herramientas"]),
    ("Coche y moto", "Accesorios para el vehículo.", "", ["Accesorios de coche", "Limpieza del coche"]),
    ("Viaje y equipaje", "Maletas y accesorios de viaje.", "", ["Maletas", "Accesorios de viaje"]),
]
SPECIAL = [
    ("Ofertas", "ofertas", "Automática: «Precio de comparación» es mayor que 0 (o etiqueta oferta)."),
    ("Ofertas del día", "ofertas-del-dia", "Automática: etiqueta del producto es igual a oferta-del-dia."),
    ("Destacados", "destacados", "Automática: etiqueta del producto es igual a destacado."),
    ("Más vendidos", "mas-vendidos", "Automática: etiqueta del producto es igual a mas-vendido (o manual)."),
    ("Novedades", "novedades", "Automática: etiqueta del producto es igual a novedad."),
]

def blocks(items):
    ids = [f"b{i + 1}" for i in range(len(items))]
    return {k: v for k, v in zip(ids, items)}, ids

def section(type_, settings=None, items=None):
    s = {"type": type_, "settings": settings or {}}
    if items is not None:
        s["blocks"], s["block_order"] = blocks(items)
    return s

def write(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def templates():
    T = f"{THEME}/templates"
    slide = lambda e, t, x, c, h, img, bg, ink: {"type": "slide", "settings": {"eyebrow": e, "title": t, "text": x, "cta": c, "link": f"shopify://collections/{h}", "default_image": img, "bg": bg, "ink": ink}}
    home = {
        "hero": section("hero-video", {"height": 82, "overlay": 85, "badge": "Ofertas en hogar, tecnología y moda", "title_highlight": "Ahorra más", "title": "en todo lo que\nte gusta.",
                                       "text": "Productos útiles a precios claros: IVA incluido, plazo de entrega en cada ficha y devoluciones explicadas.",
                                       "button_1_label": "Ver ofertas", "button_1_link": "shopify://collections/ofertas", "button_2_label": "Explorar la tienda", "button_2_link": "shopify://collections/all"}),
        "offers": section("offer-carousel", {"autoplay": 6}, [
            slide("Decoración", "Hasta −24 % en jarrones y cerámica", "Piezas para dar carácter a tu salón.", "Ver decoración", "decoracion", "vase-aro.jpg", "#FF5A1F", "#0E1015"),
            slide("Tecnología", "Sonido inalámbrico desde 29,90 €", "Auriculares y altavoces para cada día.", "Ver audio", "audio", "speaker-onda.jpg", "#FFD84D", "#0E1015"),
            slide("Novedades", "Mochilas, gafas y zapatillas", "Lo nuevo de la temporada en moda.", "Ver moda", "moda", "backpack-ruta.jpg", "#0E1015", "#FFFFFF"),
            {"type": "tile", "settings": {"eyebrow": "Hoy", "title": "Ofertas del día", "link": "shopify://collections/ofertas-del-dia", "default_image": "headphones-eco.jpg", "bg": "#FFE3EC"}},
            {"type": "tile", "settings": {"eyebrow": "Mascotas", "title": "Camas y juguetes", "link": "shopify://collections/mascotas", "default_image": "cama-perro.jpg", "bg": "#E3F4EC"}},
        ]),
        "trust": section("trust-strip", {}, [
            {"type": "item", "settings": {"icon": "truck", "title": "Plazo visible", "text": "Entrega estimada en cada ficha", "link": "shopify://policies/shipping-policy"}},
            {"type": "item", "settings": {"icon": "card", "title": "Precio final", "text": "IVA incluido, envío antes de pagar", "link": "shopify://policies/terms-of-service"}},
            {"type": "item", "settings": {"icon": "return", "title": "Devoluciones claras", "text": "Condiciones en una sola página", "link": "shopify://policies/refund-policy"}},
            {"type": "item", "settings": {"icon": "package", "title": "Seguimiento", "text": "Te avisamos cuando salga tu pedido", "link": "shopify://pages/preguntas-frecuentes"}},
        ]),
        "categories": section("collection-list", {"title": "Explora por categoría", "style": "tiles", "show_count": True, "show_all": True},
                              [{"type": "collection", "settings": {"handle": handle(n), "default_image": img}} for n, _, img, _ in DEPTS]),
        "deals": section("daily-deals", {"handle": "ofertas-del-dia", "eyebrow": "Ofertas del día", "title": "Precios rebajados por tiempo limitado", "hide_when_over": True, "cta": "Ver todas las ofertas"}),
        "departments": section("collection-list", {"title": "Compra por departamento", "style": "cards", "show_count": True, "show_all": True},
                               [{"type": "collection", "settings": {"handle": handle(n), "text": d, "default_image": img}} for n, d, img, _ in DEPTS[:8]]),
        "featured": section("featured-collection", {"handle": "destacados", "eyebrow": "Selección", "title": "Productos destacados", "limit": 8, "layout": "rail"}),
        "tabs": section("product-tabs", {"limit": 8}, [
            {"type": "tab", "settings": {"label": "Más vendidos", "handle": "mas-vendidos"}},
            {"type": "tab", "settings": {"label": "Ofertas", "handle": "ofertas"}},
            {"type": "tab", "settings": {"label": "Novedades", "handle": "novedades"}},
        ]),
        "marquee": section("marquee", {"label": "Lema", "bg": "#FF5A1F", "fg": "#0E1015"},
                           [{"type": "word", "settings": {"text": w}} for w in ["Ahorra en hogar", "Tecnología", "Moda", "Bienestar", "Mascotas", "Precio final con IVA"]]),
    }
    for n, _, _, _ in DEPTS:
        home[f"rail-{handle(n)}"] = section("featured-collection", {"handle": handle(n), "eyebrow": "Categoría", "title": "", "limit": 8, "layout": "rail"})
    write(f"{T}/index.json", {"sections": home, "order": list(home)})
    write(f"{T}/product.json", {"sections": {"main": section("main-product", {"show_vendor": False, "show_dynamic_checkout": True}, [
        {"type": "fact", "settings": {"icon": "card", "text": "Precio final con IVA incluido"}},
        {"type": "fact", "settings": {"icon": "return", "text": "Devoluciones explicadas en nuestra política"}}]),
        "related": section("product-recommendations", {"title": "También te puede gustar", "limit": 8})}, "order": ["main", "related"]})
    write(f"{T}/collection.json", {"sections": {"main": section("main-collection", {"per_page": 24})}, "order": ["main"]})
    write(f"{T}/list-collections.json", {"sections": {"main": section("main-list-collections", {"title": "Todas las categorías"})}, "order": ["main"]})
    write(f"{T}/search.json", {"sections": {"main": section("main-search")}, "order": ["main"]})
    write(f"{T}/cart.json", {"sections": {"main": section("main-cart", {"show_note": False, "show_express": True})}, "order": ["main"]})
    write(f"{T}/404.json", {"sections": {"main": section("main-404")}, "order": ["main"]})
    write(f"{T}/blog.json", {"sections": {"main": section("main-blog")}, "order": ["main"]})
    write(f"{T}/article.json", {"sections": {"main": section("main-blog")}, "order": ["main"]})
    write(f"{T}/page.json", {"sections": {"main": section("main-page")}, "order": ["main"]})
    write(f"{T}/page.contact.json", {"sections": {"main": section("main-page", {"eyebrow": "Contacto"}), "form": section("contact-form")}, "order": ["main", "form"]})
    faqs = [
        ("¿Cuánto tarda en llegar mi pedido?", "Cada ficha de producto muestra el plazo estimado facilitado por el proveedor. El plazo empieza a contar cuando se confirma el pago."),
        ("¿Por qué puedo recibir mi pedido en varios paquetes?", "Trabajamos con varios proveedores que envían directamente desde sus almacenes. Si tu pedido incluye productos de distintos proveedores, pueden llegar por separado."),
        ("¿Cuánto cuesta el envío?", "Los gastos de envío se calculan en el checkout según tu dirección y los productos, antes de que confirmes el pago."),
        ("¿Puedo devolver un producto?", "Sí. Como consumidor tienes derecho de desistimiento en los términos legales. Consulta plazos, costes y procedimiento en la política de devoluciones."),
        ("¿Cómo sigo mi pedido?", "Cuando el proveedor envíe tu pedido recibirás un correo con el número de seguimiento. También podrás consultarlo en tu cuenta."),
        ("¿Qué métodos de pago aceptáis?", "Los métodos de pago disponibles se muestran en el checkout."),
        ("¿Los precios incluyen IVA?", "Sí, todos los precios mostrados incluyen el IVA aplicable. Los gastos de envío se indican aparte en el checkout."),
        ("¿Cómo contacto con vosotros?", "Escríbenos desde la página de contacto o al correo indicado al pie de la web."),
    ]
    write(f"{T}/page.faq.json", {"sections": {"main": section("main-page", {"eyebrow": "Ayuda"}), "faq": section("faq", {}, [{"type": "question", "settings": {"question": q, "answer": f"<p>{a}</p>"}} for q, a in faqs])}, "order": ["main", "faq"]})
    write(f"{T}/page.about.json", {"sections": {"main": section("main-page", {"eyebrow": "Sobre la tienda"}), "pillars": section("about-pillars", {"title": "Sobre Ahorramix", "button_label": "Ver productos", "button_link": "shopify://collections/all"}, [
        {"type": "pillar", "settings": {"title": "Selección", "text": "Revisamos coste, envío, plazos y fiabilidad del proveedor antes de añadir un producto."}},
        {"type": "pillar", "settings": {"title": "Transparencia", "text": "Precio final con IVA, plazo estimado y condiciones de devolución visibles antes de pagar."}},
        {"type": "pillar", "settings": {"title": "Envío directo", "text": "Los productos salen del almacén de cada proveedor hacia tu dirección."}}])}, "order": ["main", "pillars"]})

def assets():
    A = f"{THEME}/assets"
    os.makedirs(A, exist_ok=True)
    for src, dst in [("images/brand/ahorramix-logo.png", "ahorramix-logo.png"), ("images/brand/og-ahorramix.jpg", "og-ahorramix.jpg"), ("images/brand/sin-imagen.jpg", "sin-imagen.jpg"),
                     ("favicon.png", "favicon.png"), ("video/hero-poster.jpg", "hero-poster.jpg")]:
        shutil.copy(f"{PUB}/{src}", f"{A}/{dst}")
    for img in ["vase-aro", "speaker-onda", "backpack-ruta", "headphones-eco", "cama-perro", "sneaker-brisa", "serum-ambar", "dog-hueso", "vase-duo"]:
        shutil.copy(f"{PUB}/images/{img}.jpg", f"{A}/{img}.jpg")

def collections_csv():
    rows = []
    for n, d, img, subs in DEPTS:
        rows.append({"Title": n, "Handle": handle(n), "Description": d, "Parent": "", "Type": "Manual (la rellena tu app de dropshipping)"})
        rows += [{"Title": s, "Handle": handle(s), "Description": "", "Parent": n, "Type": "Manual (opcional)"} for s in subs]
    rows += [{"Title": t, "Handle": h, "Description": "", "Parent": "", "Type": r} for t, h, r in SPECIAL]
    with open(f"{OUT}/colecciones-ahorramix.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=["Title", "Handle", "Description", "Parent", "Type"]); w.writeheader(); w.writerows(rows)
    # Formato Matrixify (app de importación) para crear las colecciones manuales de una vez
    with open(f"{OUT}/Custom Collections (Matrixify).csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f); w.writerow(["Handle", "Command", "Title", "Body HTML", "Sort Order", "Published", "Metafield: description_tag [string]"])
        for r in rows:
            if r["Type"].startswith("Manual"):
                w.writerow([r["Handle"], "MERGE", r["Title"], f"<p>{r['Description']}</p>" if r["Description"] else "", "best-selling", "TRUE", r["Description"] or f"{r['Title']} en Ahorramix: precios con IVA incluido."])
    # Plantilla oficial de productos de Shopify (solo cabeceras), por si quieres subir productos a mano
    head = ["Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value", "Option3 Name", "Option3 Value",
            "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price",
            "Variant Requires Shipping", "Variant Taxable", "Variant Barcode", "Image Src", "Image Position", "Image Alt Text", "Gift Card", "SEO Title", "SEO Description", "Variant Image", "Variant Weight Unit", "Cost per item", "Status"]
    with open(f"{OUT}/plantilla-productos-shopify.csv", "w", newline="", encoding="utf-8") as f:
        csv.writer(f).writerow(head)
    return rows

def pages():
    P = f"{OUT}/paginas"
    os.makedirs(P, exist_ok=True)
    js = open("/app/frontend/src/data/legal.js", encoding="utf-8").read()
    stub = 'const STORE = { seller: { legalName: "Ahorramix", taxId: "Y0447650S", address: "[Dirección completa, código postal, ciudad]", email: "[email@tudominio.es]", phone: "[Teléfono de contacto]", registry: "[Datos registrales, si procede]" } };'
    js = re.sub(r'import \{ STORE \} from "@/config/store";', stub, js)
    tmp = f"{ROOT}/.legal.mjs"
    open(tmp, "w", encoding="utf-8").write(js + "\nconsole.log(JSON.stringify(LEGAL_PAGES));")
    data = json.loads(subprocess.check_output(["node", tmp]).decode())
    os.remove(tmp)
    for p in data:
        html = "".join(f"<h2>{h}</h2>" + "".join(f"<p>{x}</p>" for x in ps) for h, ps in p["sections"])
        open(f"{P}/{p['slug']}.html", "w", encoding="utf-8").write(f"<!-- {p['title']} · plantilla orientativa: revísala con un profesional -->\n{html}\n")
    open(f"{P}/sobre-nosotros.html", "w", encoding="utf-8").write("<p>[Cuenta aquí tu historia: quién está detrás de Ahorramix, desde dónde trabajas y por qué abriste la tienda.]</p>\n")
    open(f"{P}/contacto.html", "w", encoding="utf-8").write("<p>Escríbenos para dudas sobre productos, pedidos o devoluciones.</p>\n")
    open(f"{P}/preguntas-frecuentes.html", "w", encoding="utf-8").write("<p>Envíos, devoluciones, pagos y seguimiento de pedidos.</p>\n")
    return [p["slug"] for p in data]

def zipdir(src, dst, prefix=""):
    with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as z:
        for base, dirs, files in os.walk(src):
            dirs[:] = [d for d in dirs if d not in {"node_modules", ".git", "build", "__pycache__", ".emergent", ".ruff_cache"}]
            for f in files:
                full = os.path.join(base, f)
                if f == ".env" or f.endswith(".env") or f == ".gitconfig":
                    continue
                if src == "/app" and full.startswith("/app/export/"):
                    continue
                z.write(full, os.path.join(prefix, os.path.relpath(full, src)))

if __name__ == "__main__":
    shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
    templates(); assets(); rows = collections_csv(); legal = pages()
    zipdir(THEME, f"{OUT}/ahorramix-tema-shopify.zip")
    os.makedirs(f"{OUT}/video-portada", exist_ok=True)
    for v in ["hero-ofertas.mp4", "hero-ofertas-movil.mp4"]:
        shutil.copy(f"{PUB}/video/{v}", f"{OUT}/video-portada/{v}")
    shutil.copy(f"{ROOT}/GUIA-SHOPIFY.md", f"{OUT}/GUIA-SHOPIFY.md")
    zipdir("/app", "/app/export/ahorramix-proyecto-completo.zip", "ahorramix")
    print("colecciones:", len(rows), "· paginas legales:", legal)
    for f in sorted(os.listdir(OUT)): print(" -", f)
