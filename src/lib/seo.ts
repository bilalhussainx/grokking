import type { Metadata } from "next";

// The one public host. The apex (kairoslearn.com) redirects here, so every
// canonical, og:url, sitemap entry and robots Sitemap line must use this.
export const SITE_URL = "https://www.kairoslearn.com";
export const SITE_NAME = "KairosLearn";

type PageMetadataInput = {
  /** Bare page title. The root layout's title template appends " | KairosLearn". */
  title: string;
  description: string;
  /** Path on the site, starting with "/" ("/" for the homepage). */
  path: string;
  /** Keep the page out of search results (it can still be linked to). */
  noindex?: boolean;
  /** Use `title` as written, with no " | KairosLearn" suffix (the homepage). */
  absoluteTitle?: boolean;
};

// Next replaces (does not merge) a child's openGraph/twitter, so each page
// states its own url, title and description instead of inheriting the
// homepage's. File-based og images (opengraph-image.tsx) are still attached.
export function pageMetadata({ title, description, path, noindex, absoluteTitle }: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "en_US", siteName: SITE_NAME, url, title: fullTitle, description },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
