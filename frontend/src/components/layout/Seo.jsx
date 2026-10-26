import { STORE } from "@/config/store";

export function Seo({ title, description, path = "", noindex = false, image, jsonLd }) {
  const full = title ? `${title} | ${STORE.name}` : `${STORE.name} — ${STORE.tagline}`;
  const base = STORE.siteUrl.replace(/\/$/, "");
  return (
    <>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      {base && <link rel="canonical" href={`${base}${path}`} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image.startsWith("http") ? image : `${base}${image}`} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}
