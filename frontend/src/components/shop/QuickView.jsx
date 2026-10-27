import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PurchaseControls } from "./PurchaseControls";
import { Price } from "./ProductCard";

function QuickViewBody({ product, close }) {
  const [img, setImg] = useState(0);
  const images = product.images || [];
  return (
    <div className="grid md:grid-cols-2">
      <div className="bg-[var(--am-bg-2)]">
        <div className="relative aspect-[4/5]">
          {images[img] && <img src={images[img].src} alt={images[img].alt || product.name} className="absolute inset-0 w-full h-full object-cover" />}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 p-3">
            {images.map((im, n) => (
              <button key={im.src} onClick={() => setImg(n)} aria-label={`Imagen ${n + 1}`} data-testid={`quick-view-thumb-${n}`}
                className={`w-12 h-14 rounded-lg overflow-hidden border-2 ${n === img ? "border-[var(--am-black)]" : "border-transparent opacity-70"}`}>
                <img src={im.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 md:p-8">
        {product.demo && <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#fef3c7] text-[#78350f] text-[12px] font-semibold">Producto de ejemplo ficticio</span>}
        <DialogTitle className="font-display text-3xl font-extrabold tracking-tight leading-tight pr-6" data-testid="quick-view-title">{product.name}</DialogTitle>
        <div className="mt-3"><Price product={product} size="lg" /></div>
        <p className="mt-1 text-[12px] text-[var(--am-ink-2)]">IVA incluido. Envío calculado en el checkout.</p>
        <DialogDescription className="mt-4 text-[15px] text-[var(--am-ink-2)] leading-relaxed">{product.shortDescription}</DialogDescription>
        <PurchaseControls product={product} prefix="quick-view-" onAdded={close} />
        {product.deliveryTime && <p className="mt-4 text-[13px] text-[var(--am-ink-2)]">{product.deliveryTime}</p>}
        <Link to={`/producto/${product.slug}`} onClick={close} data-testid="quick-view-details-link" className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
          Ver ficha completa <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function QuickView({ product }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} data-testid={`quick-view-open-${product.slug}`} aria-label={`Añadir rápido: ${product.name}`}
        className="absolute bottom-3 right-3 z-10 h-11 min-w-11 px-3 rounded-full bg-[var(--am-black)] text-white inline-flex items-center justify-center gap-2 text-[13px] font-bold shadow-lg transition-[transform,background-color] duration-300 hover:bg-[var(--am-orange)] hover:text-[var(--am-ink)] hover:scale-105">
        <Plus className="h-4 w-4" /><span className="hidden lg:inline max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-300 group-hover:max-w-[120px]">Añadir rápido</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-lenis-prevent data-testid="quick-view-dialog" className="p-0 gap-0 max-w-[92vw] md:max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] sm:rounded-[24px] border-[var(--am-line)]">
          {open && <QuickViewBody product={product} close={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
