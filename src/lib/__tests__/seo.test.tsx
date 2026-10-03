import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Metadata } from "next";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import { metadata as rootMetadata } from "@/app/layout";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import DaybreakFooter from "@/components/marketing/daybreak/DaybreakFooter";

vi.mock("next/font/google", () => {
  const font = () => ({ variable: "", className: "" });
  return { Inter: font, JetBrains_Mono: font, Cormorant_Garamond: font, DM_Sans: font };
});

type Entry = { path: string; load: () => Promise<{ metadata?: Metadata }> };

// Every public page that search engines or link previews can reach.
const PAGES: Entry[] = [
  { path: "/", load: () => import("@/app/page") },
  { path: "/pricing", load: () => import("@/app/pricing/page") },
  { path: "/pricing/subsidized", load: () => import("@/app/pricing/subsidized/layout") },
  { path: "/faq", load: () => import("@/app/faq/page") },
  { path: "/about", load: () => import("@/app/about/page") },
  { path: "/integrity", load: () => import("@/app/integrity/page") },
  { path: "/privacy", load: () => import("@/app/privacy/page") },
  { path: "/terms", load: () => import("@/app/terms/page") },
  { path: "/product/counselor", load: () => import("@/app/product/counselor/page") },
  { path: "/product/essays", load: () => import("@/app/product/essays/page") },
  { path: "/product/schools", load: () => import("@/app/product/schools/page") },
  { path: "/signup", load: () => import("@/app/signup/layout") },
  { path: "/login", load: () => import("@/app/login/layout") },
  { path: "/find-counselor", load: () => import("@/app/find-counselor/layout") },
];

const resolvedTitle = (m: Metadata): string => {
  const t = m.title;
  if (typeof t === "string") return `${t} | KairosLearn`; // root layout title.template
  if (t && "absolute" in t && t.absolute) return t.absolute;
  throw new Error("no title");
};

describe("pageMetadata", () => {
  it("builds an absolute www canonical and og:url and a matching og:title", () => {
    const m = pageMetadata({ title: "Pricing", description: "d", path: "/pricing" });
    expect(m.alternates?.canonical).toBe("https://www.kairoslearn.com/pricing");
    expect(m.openGraph).toMatchObject({ url: "https://www.kairoslearn.com/pricing", title: "Pricing | KairosLearn", description: "d" });
    expect(m.twitter).toMatchObject({ title: "Pricing | KairosLearn" });
    expect(m.robots).toBeUndefined();
  });
  // A page's own openGraph replaces the parent's, file-based image included,
  // so shared links to /pricing, /faq and /about had no preview image.
  it("keeps the site preview image on every page", () => {
    const m = pageMetadata({ title: "Pricing", description: "d", path: "/pricing" });
    expect(m.openGraph?.images).toEqual([{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "KairosLearn" }]);
    expect((m.twitter as { images?: unknown }).images).toEqual([`${SITE_URL}/opengraph-image`]);
  });
  it("uses the bare site URL for the homepage and can noindex", () => {
    expect(pageMetadata({ title: "x", description: "d", path: "/" }).alternates?.canonical).toBe("https://www.kairoslearn.com/");
    expect(pageMetadata({ title: "x", description: "d", path: "/a", noindex: true }).robots).toEqual({ index: false, follow: true });
  });
});

describe("site-wide metadata", () => {
  it("is built on the www host, with no inherited canonical or og:url", () => {
    expect(SITE_URL).toBe("https://www.kairoslearn.com");
    expect(String(rootMetadata.metadataBase)).toBe("https://www.kairoslearn.com/");
    expect(rootMetadata.alternates?.canonical).toBeUndefined();
    expect((rootMetadata.openGraph as { url?: unknown } | undefined)?.url).toBeUndefined();
  });
});

describe.each(PAGES)("page metadata $path", ({ path, load }) => {
  it("has its own canonical, og:url, og:title and description", async () => {
    const { metadata } = await load();
    expect(metadata, "page exports metadata").toBeDefined();
    const m = metadata as Metadata;
    const expected = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
    expect(m.alternates?.canonical).toBe(expected);
    expect((m.openGraph as { url?: string }).url).toBe(expected);
    expect((m.openGraph as { title?: string }).title).toBe(resolvedTitle(m));
    expect(String(m.description ?? "").length).toBeGreaterThan(40);
  });

  it("does not double the brand in the title", async () => {
    const { metadata } = await load();
    const t = (metadata as Metadata).title;
    if (typeof t === "string") expect(t).not.toMatch(/KairosLearn/);
  });
});

describe("unique titles and descriptions", () => {
  it("no two public pages share a title or a description", async () => {
    const all = await Promise.all(PAGES.map(async (p) => (await p.load()).metadata as Metadata));
    const titles = all.map(resolvedTitle);
    const descriptions = all.map((m) => String(m.description));
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});

describe("find-counselor stays out of search while it lists no verified counselors", () => {
  it("is noindex and absent from the sitemap", async () => {
    const { metadata } = await import("@/app/find-counselor/layout");
    expect((metadata as Metadata).robots).toEqual({ index: false, follow: true });
    expect(sitemap().map((e) => e.url)).not.toContain(`${SITE_URL}/find-counselor`);
  });
});

describe("sitemap and robots use the www host", () => {
  it("sitemap URLs are all on www", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls.length).toBeGreaterThan(5);
    expect(urls.filter((u) => !u.startsWith("https://www.kairoslearn.com"))).toEqual([]);
    expect(urls).toContain("https://www.kairoslearn.com/");
  });
  it("robots Sitemap line points at the www sitemap", () => {
    expect(robots().sitemap).toBe("https://www.kairoslearn.com/sitemap.xml");
  });
});

describe("footer outline", () => {
  it("does not use headings for its link-group labels", () => {
    const { container } = render(<DaybreakFooter />);
    expect(container.querySelectorAll("h1,h2,h3,h4")).toHaveLength(0);
    expect(container.textContent).toContain("Platform");
  });
});
