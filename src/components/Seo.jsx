import { useEffect } from "react";

const SITE_URL = "https://calcora.com";
const SITE_NAME = "Calcora";

function setMeta(nameOrProp, content, isProperty = false) {
  if (!content) return;
  const attr = isProperty ? "property" : "name";
  let tag = document.head.querySelector(`meta[${attr}="${nameOrProp}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, nameOrProp);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setLink(rel, href) {
  if (!href) return;
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function setJsonLd(id, data) {
  let tag = document.getElementById(id);
  if (!data) {
    if (tag) tag.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = id;
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data);
}

/**
 * Client-side SEO manager. IruCalc is a static SPA with no server-side
 * rendering, so this sets <title>, meta description, canonical URL, Open
 * Graph tags and structured data (FAQ / breadcrumb) on every route change —
 * as close to server-rendered SEO as a pure client build gets.
 */
export default function Seo({ title, description, path = "/", faqs, breadcrumbs }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Free Online Calculators`;
    document.title = fullTitle;

    setMeta("description", description);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", `${SITE_URL}${path}`, true);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setLink("canonical", `${SITE_URL}${path}`);

    if (faqs && faqs.length) {
      setJsonLd("faq-jsonld", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    } else {
      setJsonLd("faq-jsonld", null);
    }

    if (breadcrumbs && breadcrumbs.length) {
      setJsonLd("breadcrumb-jsonld", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.label,
          item: `${SITE_URL}${b.href}`,
        })),
      });
    } else {
      setJsonLd("breadcrumb-jsonld", null);
    }

    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [title, description, path, faqs, breadcrumbs]);

  return null;
}
