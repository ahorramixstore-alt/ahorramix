import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";

// Texto orientativo: ajusta plazos y condiciones a tus proveedores reales.
const FAQS = [
  ["¿Cuánto tarda en llegar mi pedido?", "Cada ficha de producto muestra el plazo estimado facilitado por el proveedor. El plazo empieza a contar cuando se confirma el pago."],
  ["¿Por qué puedo recibir mi pedido en varios paquetes?", "Trabajamos con varios proveedores que envían directamente desde sus almacenes. Si tu pedido incluye productos de distintos proveedores, pueden llegar por separado."],
  ["¿Cuánto cuesta el envío?", "Los gastos de envío se calculan en el checkout según tu dirección y los productos, antes de que confirmes el pago."],
  ["¿Puedo devolver un producto?", "Sí. Como consumidor tienes derecho de desistimiento en los términos legales. Consulta plazos, costes y procedimiento en la política de devoluciones."],
  ["¿Cómo sigo mi pedido?", "Cuando el proveedor envíe tu pedido recibirás un correo con el número de seguimiento. También podrás consultarlo en tu cuenta."],
  ["¿Qué métodos de pago aceptáis?", "Los métodos de pago disponibles se muestran en el checkout. [Completa esta respuesta cuando configures tus pasarelas en WooCommerce.]"],
  ["¿Los precios incluyen IVA?", "Sí, todos los precios mostrados incluyen el IVA aplicable. Los gastos de envío se indican aparte en el checkout."],
  ["¿Cómo contacto con vosotros?", "Escríbenos desde la página de contacto o al correo indicado al pie de la web."],
];

export default function Faq() {
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return (
    <>
      <Seo title="Preguntas frecuentes" description="Envíos, devoluciones, pagos y seguimiento de pedidos en Ahorramix." path="/preguntas-frecuentes" jsonLd={jsonLd} />
      <PageHead eyebrow="Ayuda" title="Preguntas frecuentes" />
      <div className="am-container max-w-3xl">
        <Accordion type="single" collapsible className="border-t border-[var(--am-line)]">
          {FAQS.map(([q, a], i) => (
            <AccordionItem key={q} value={`f${i}`} className="border-[var(--am-line)]">
              <AccordionTrigger data-testid={`faq-item-${i}`} className="text-left font-display text-lg md:text-xl font-bold py-6 hover:no-underline">{q}</AccordionTrigger>
              <AccordionContent className="text-[15px] text-[var(--am-ink-2)] leading-relaxed pb-6">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-10 text-[var(--am-ink-2)]">¿No encuentras tu respuesta? <Link to="/contacto" className="underline">Contacta con nosotros</Link>.</p>
      </div>
    </>
  );
}
