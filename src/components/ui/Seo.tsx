import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/config/seo";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  pathname?: string;
  article?: boolean;
  keywords?: string;
  schemaData?: Record<string, unknown>;
}

function upsertMeta({
  attrName,
  attrValue,
  content,
}: {
  attrName: string;
  attrValue: string;
  content: string;
}) {
  const selector = `meta[${attrName}="${attrValue}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function Seo({
  title,
  description,
  image,
  pathname = "/",
  article = false,
  keywords,
  schemaData,
}: SeoProps) {
  const location = useLocation();
  const resolvedPathname = location.pathname || pathname;
  const normalizedPathname =
    resolvedPathname === "/" ? "/" : resolvedPathname.replace(/\/+$/, "") || "/";

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SEO.siteName}` : SEO.defaultTitle;
    const desc = description || SEO.defaultDescription;
    const url = `${SEO.siteUrl.replace(/\/$/, "")}${normalizedPathname.startsWith("/") ? normalizedPathname : "/" + normalizedPathname}`;

    document.title = fullTitle;

    // standard
    upsertMeta({ attrName: "name", attrValue: "description", content: desc });
    upsertMeta({ attrName: "name", attrValue: "author", content: SEO.author });
    upsertMeta({
      attrName: "name",
      attrValue: "robots",
      content: "index,follow",
    });

    // Keywords
    if (keywords) {
      upsertMeta({
        attrName: "name",
        attrValue: "keywords",
        content: keywords,
      });
    }

    // Open Graph
    upsertMeta({
      attrName: "property",
      attrValue: "og:type",
      content: article ? "article" : "website",
    });
    upsertMeta({
      attrName: "property",
      attrValue: "og:title",
      content: fullTitle,
    });
    upsertMeta({
      attrName: "property",
      attrValue: "og:description",
      content: desc,
    });
    upsertMeta({ attrName: "property", attrValue: "og:url", content: url });
    upsertMeta({
      attrName: "property",
      attrValue: "og:site_name",
      content: SEO.siteName,
    });
    upsertMeta({
      attrName: "property",
      attrValue: "og:image",
      content: image || SEO.defaultImage,
    });

    // Twitter
    upsertMeta({
      attrName: "name",
      attrValue: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta({
      attrName: "name",
      attrValue: "twitter:site",
      content: SEO.twitterHandle,
    });
    upsertMeta({
      attrName: "name",
      attrValue: "twitter:title",
      content: fullTitle,
    });
    upsertMeta({
      attrName: "name",
      attrValue: "twitter:description",
      content: desc,
    });
    upsertMeta({
      attrName: "name",
      attrValue: "twitter:image",
      content: image || SEO.defaultImage,
    });

    // canonical link
    const canonicalHref = url;
    let canonical = document.head.querySelector(
      `link[rel="canonical"]`,
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalHref);

    // hreflang links: keep only the active self-reference and a default fallback.
    const hreflangValue = normalizedPathname.includes("/philippines")
      ? "en-PH"
      : normalizedPathname.includes("/srilanka")
        ? "en-LK"
        : "en-AU";

    const hreflangEntries = [
      { hreflang: hreflangValue, href: url },
      { hreflang: "x-default", href: SEO.siteUrl },
    ];

    document.head.querySelectorAll('link[rel="alternate"]').forEach((el) => {
      const existing = el.getAttribute("hreflang");
      if (!hreflangEntries.some((entry) => entry.hreflang === existing)) {
        el.remove();
      }
    });

    hreflangEntries.forEach(({ hreflang, href }) => {
      const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
      let link = document.head.querySelector(
        selector,
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", hreflang);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    });

    // JSON-LD: Organization + WebSite
    const ldId = "ld-json-seo";
    let existing = document.getElementById(ldId) as HTMLScriptElement | null;

    const graphData: Array<Record<string, unknown>> = [
      {
        "@type": "Organization",
        name: SEO.siteName,
        url: SEO.siteUrl,
        logo: SEO.defaultImage,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        url: SEO.siteUrl,
        name: SEO.siteName,
        description: SEO.defaultDescription,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SEO.siteUrl}/?s={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ];

    // BreadcrumbList (ensures there are at least 2 items for search engines / AEO)
    const pageName = title
      ? title.replace(` | ${SEO.siteName}`, "")
      : SEO.siteName;
    const breadcrumbSchema: Record<string, unknown> = {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SEO.siteUrl.replace(/\/$/, "/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: pageName,
          item: url,
        },
      ],
    };

    graphData.push(breadcrumbSchema);

    // Add custom schema data if provided
    if (schemaData) {
      graphData.push(schemaData);
    }

    const ld = {
      "@context": "https://schema.org",
      "@graph": graphData,
    };

    if (!existing) {
      existing = document.createElement("script");
      existing.setAttribute("type", "application/ld+json");
      existing.id = ldId;
      document.head.appendChild(existing);
    }
    existing.textContent = JSON.stringify(ld);

    // cleanup is intentionally minimal: we leave tags updated for current page view
  }, [title, description, image, pathname, article, keywords, schemaData, normalizedPathname]);

  return null;
}
