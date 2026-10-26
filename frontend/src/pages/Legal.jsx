import { useParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { PageHead } from "@/components/layout/Reveal";
import { LEGAL_PAGES } from "@/data/legal";
import NotFound from "./NotFound";

export default function Legal() {
  const { slug } = useParams();
  const page = LEGAL_PAGES.find((p) => p.slug === slug);
  if (!page) return <NotFound />;
  return (
    <>
      <Seo title={page.title} description={`${page.title} de la tienda Ahorramix.`} path={`/legal/${slug}`} />
      <PageHead eyebrow="Información legal" title={page.title} />
      <div className="am-container max-w-3xl">
        <p data-testid="legal-template-warning" className="rounded-xl bg-[#fef3c7] text-[#78350f] text-sm px-4 py-3">Plantilla editable pendiente de revisión legal. Sustituye los textos entre [corchetes] antes de publicar.</p>
        <article className="prose-am mt-6" data-testid={`legal-page-${slug}`}>
          {page.sections.map(([h, ps]) => (
            <section key={h}>
              <h2>{h}</h2>
              {ps.map((t) => <p key={t}>{t}</p>)}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
