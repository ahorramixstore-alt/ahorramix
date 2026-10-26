import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, RotateCcw, Truck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/layout/Seo";
import { Price, ProductGrid } from "@/components/shop/ProductCard";
import { useCatalog, parentOf } from "@/hooks/useCatalog";
import { useCart } from "@/context/CartContext";
import { findVariationId, IS_DEMO } from "@/lib/commerce";
import { discountPct, slugify } from "@/lib/format";
import { STORE } from "@/config/store";
import NotFound from "./NotFound";

function Gallery({ images, name }) {
  const [i, setI] = useState(0);
  const current = images[i] || images[0];
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3">
          {images.map((img, n) => (
            <button key={img.src} onClick={() => setI(n)} data-testid={`gallery-thumb-${n}`} aria-label={`Imagen ${n + 1}`}
              className={`w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-colors ${n === i ? "border-[var(--am-ink)]" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 aspect-[4/5] rounded-[24px] overflow-hidden bg-[var(--am-bg-2)]" data-testid="product-gallery-main">
        <AnimatePresence initial={false}>
          {current && <motion.img key={current.src} src={current.src} alt={current.alt || name} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 w-full h-full object-cover" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function VariantPicker({ attributes, selected, onChange }) {
  return attributes.map((a) => (
    <div key={a.name} className="mt-6">
      <p className="text-sm font-medium mb-2.5">{a.name}: <span className="text-[var(--am-ink-2)] font-normal">{selected[a.name]}</span></p>
      <div className="flex flex-wrap gap-2">
        {a.options.map((o) => (
          <button key={o} onClick={() => onChange({ ...selected, [a.name]: o })} data-testid={`variant-${slugify(a.name)}-${slugify(o)}`}
            className={`min-w-[48px] px-4 h-11 rounded-full border text-sm transition-colors ${selected[a.name] === o ? "bg-[var(--am-ink)] text-white border-[var(--am-ink)]" : "border-[var(--am-line)] hover:border-[var(--am-ink)]"}`}>{o}</button>
        ))}
      </div>
    </div>
  ));
}

export default function Product() {
  const { slug } = useParams();
  const { products, categories, loading } = useCatalog();
  const { add } = useCart();
  const product = products.find((p) => p.slug === slug);
  const [selected, setSelected] = useState({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
    setSelected(Object.fromEntries((product?.attributes || []).map((a) => [a.name, a.options[0]])));
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    const top = parentOf(categories, product.category) || product.category;
    return products.filter((p) => p.id !== product.id && (p.category === product.category || parentOf(categories, p.category) === top)).slice(0, 4);
  }, [product, products, categories]);

  if (loading) return <p className="am-container py-32 text-center text-[var(--am-ink-2)]">Cargando…</p>;
  if (!product) return <NotFound />;

  const variationId = findVariationId(product, selected);
  const needsVariation = !IS_DEMO && product.variations.length > 0;
  const blocked = product.stockStatus !== "instock" || (needsVariation && !variationId);
  const cat = categories.find((c) => c.slug === product.category);
  const top = cat?.parent ? categories.find((c) => c.slug === cat.parent) : null;
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: product.name, sku: product.sku,
    image: product.images.map((i) => (i.src.startsWith("http") ? i.src : `${STORE.siteUrl}${i.src}`)), description: product.shortDescription,
    offers: { "@type": "Offer", priceCurrency: "EUR", price: product.price.toFixed(2), availability: product.stockStatus === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${STORE.siteUrl}/producto/${product.slug}` },
  };

  return (
    <>
      <Seo title={product.name} description={product.shortDescription} path={`/producto/${product.slug}`} image={product.images?.[0]?.src} jsonLd={IS_DEMO ? undefined : jsonLd} />
      <section className="am-container pt-8 md:pt-12">
        <nav className="text-[13px] text-[var(--am-ink-2)] mb-6" aria-label="Migas de pan">
          <Link to="/" className="hover:underline">Inicio</Link>
          {top && <> / <Link to={`/categoria/${top.slug}`} className="hover:underline">{top.name}</Link></>}
          {cat && <> / <Link to={`/categoria/${cat.slug}`} className="hover:underline">{cat.name}</Link></>}
        </nav>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7"><Gallery images={product.images} name={product.name} /></div>
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
            {product.demo && <span data-testid="demo-product-badge" className="inline-block mb-4 px-3 py-1 rounded-full bg-[#fef3c7] text-[#78350f] text-[12px] font-semibold">Producto de ejemplo ficticio</span>}
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.02]" data-testid="product-title">{product.name}</h1>
            <div className="mt-5 flex items-center gap-3"><Price product={product} size="lg" />{discountPct(product) > 0 && <span className="px-2.5 py-1 rounded-full bg-[var(--am-ink)] text-white text-[12px] font-semibold">−{discountPct(product)}%</span>}</div>
            <p className="mt-1 text-[13px] text-[var(--am-ink-2)]">IVA incluido. Envío calculado en el checkout.</p>
            <p className="mt-6 text-[var(--am-ink-2)] leading-relaxed">{product.shortDescription}</p>
            <VariantPicker attributes={product.attributes} selected={selected} onChange={setSelected} />
            <div className="mt-8 flex gap-3">
              <div className="inline-flex items-center rounded-full border border-[var(--am-line)] h-14">
                <button className="px-4" aria-label="Restar" data-testid="product-qty-decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center" data-testid="product-qty">{qty}</span>
                <button className="px-4" aria-label="Sumar" data-testid="product-qty-increase" onClick={() => setQty((q) => Math.min(99, q + 1))}><Plus className="h-4 w-4" /></button>
              </div>
              <button disabled={blocked} onClick={() => add(product, selected, qty, variationId)} data-testid="add-to-cart-button"
                className="flex-1 h-14 rounded-full bg-[var(--am-ink)] hover:bg-[var(--am-emerald)] disabled:bg-[var(--am-bg-2)] disabled:text-[var(--am-ink-2)] text-white font-semibold transition-colors">
                {product.stockStatus !== "instock" ? "Agotado" : blocked ? "Combinación no disponible" : "Añadir al carrito"}
              </button>
            </div>
            <div className="mt-8 rounded-2xl border border-[var(--am-line)] divide-y divide-[var(--am-line)] text-[14px]">
              <div className="flex gap-3 p-4"><Truck className="h-5 w-5 shrink-0 text-[var(--am-emerald)]" strokeWidth={1.6} /><div><p className="font-medium">{product.deliveryTime || "Plazo de entrega indicado en el checkout"}</p><p className="text-[var(--am-ink-2)]">{product.shippingNote}</p></div></div>
              <div className="flex gap-3 p-4"><RotateCcw className="h-5 w-5 shrink-0 text-[var(--am-emerald)]" strokeWidth={1.6} /><p>Consulta plazos y condiciones en la <Link to="/legal/devoluciones" className="underline">política de devoluciones</Link>.</p></div>
            </div>
            {product.sku && <p className="mt-4 text-[12px] text-[var(--am-ink-2)] font-mono-am">Ref. {product.sku}</p>}
          </div>
        </div>
      </section>

      <section className="am-container mt-16 md:mt-24 max-w-4xl">
        <Tabs defaultValue="descripcion">
          <TabsList className="bg-transparent p-0 h-auto gap-6 border-b border-[var(--am-line)] w-full justify-start rounded-none">
            {[["descripcion", "Descripción"], ["caracteristicas", "Características"], ["envio", "Envío y devoluciones"]].map(([v, l]) => (
              <TabsTrigger key={v} value={v} data-testid={`product-tab-${v}`} className="rounded-none px-0 pb-3 text-[15px] data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--am-ink)]">{l}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="descripcion" className="prose-am pt-6">
            {product.descriptionHtml ? <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} /> : (product.description || []).map((t) => <p key={t}>{t}</p>)}
          </TabsContent>
          <TabsContent value="caracteristicas" className="prose-am pt-6">
            {product.features?.length ? <ul>{product.features.map((f) => <li key={f}>{f}</li>)}</ul> : <p>Consulta la descripción del producto.</p>}
          </TabsContent>
          <TabsContent value="envio" className="prose-am pt-6">
            <p>{product.deliveryTime || "El plazo estimado se muestra antes de confirmar el pedido."} Este producto se envía directamente desde el almacén del proveedor, por lo que puede llegar en un paquete separado de otros artículos del mismo pedido.</p>
            <p>Más información en la <Link to="/legal/envios" className="underline">política de envíos</Link> y en la <Link to="/legal/devoluciones" className="underline">política de devoluciones y reembolsos</Link>.</p>
          </TabsContent>
        </Tabs>
      </section>

      {related.length > 0 && (
        <section className="am-container mt-20 md:mt-28">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-10">También te puede interesar</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
