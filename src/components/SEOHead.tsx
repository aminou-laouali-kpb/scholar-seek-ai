import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
}

const SEOHead = ({ title, description, ogTitle, ogDescription, ogImage, ogType = "website", canonical, jsonLd }: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) setMeta("description", description);
    if (ogTitle || title) setMeta("og:title", ogTitle || title, "property");
    if (ogDescription || description) setMeta("og:description", ogDescription || description || "", "property");
    if (ogImage) setMeta("og:image", ogImage, "property");
    setMeta("og:type", ogType, "property");
    if (ogTitle || title) setMeta("twitter:title", ogTitle || title, "name");
    if (ogDescription || description) setMeta("twitter:description", ogDescription || description || "", "name");
    if (ogImage) setMeta("twitter:image", ogImage, "name");
    setMeta("twitter:card", ogImage ? "summary_large_image" : "summary", "name");

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    } else if (link) {
      link.remove();
    }

    // JSON-LD
    const existingLd = document.querySelector('script[data-seo-jsonld]');
    if (existingLd) existingLd.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const ld = document.querySelector('script[data-seo-jsonld]');
      if (ld) ld.remove();
    };
  }, [title, description, ogTitle, ogDescription, ogImage, ogType, canonical, jsonLd]);

  return null;
};

export default SEOHead;
