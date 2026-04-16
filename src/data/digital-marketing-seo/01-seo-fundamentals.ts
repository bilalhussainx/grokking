import { Module } from "../types";

export const module1: Module = {
  id: "seo-fundamentals",
  title: "SEO Fundamentals: How Search Engines Work",
  description: "Crawling, indexing, ranking factors, on-page SEO, technical SEO, and building content that ranks on page 1",
  lessons: [
    {
      id: "search-engine-fundamentals",
      slug: "search-engine-fundamentals",
      title: "How Search Engines Work & Core SEO Strategy",
      content: `# SEO: Search Engine Optimization

SEO is the practice of making your website appear higher in organic (unpaid) search results. Done right, it's the highest-ROI marketing channel because the traffic compounds.

---

\`\`\`concept
{
  "title": "How Google Ranks Pages",
  "variant": "mental-model",
  "content": "Google's algorithm has 200+ ranking factors, but three pillars dominate: Relevance (does this page answer the query?), Authority (do other credible sites link to you?), and Experience (does the page load fast, is it mobile-friendly, do users stay?). Every SEO decision maps to one of these three pillars."
}
\`\`\`

---

## The Search Engine Process

\`\`\`sysdiag
{
  "type": "flow",
  "title": "How Google Processes Your Page",
  "steps": [
    { "step": "Crawling", "detail": "Googlebot follows links to discover pages. Must be allowed in robots.txt and not blocked by noindex meta tags." },
    { "step": "Rendering", "detail": "Google renders the page (executes JavaScript). Slow JS = delayed indexing. Server-side rendering or prerendering is safer for SEO." },
    { "step": "Indexing", "detail": "Extracted content stored in Google's index. Duplicate or thin content may not be indexed." },
    { "step": "Ranking", "detail": "Query matches → candidate pages → ranking algorithm (200+ signals) → SERP position." }
  ]
}
\`\`\`

## Keyword Research

\`\`\`compare
{
  "title": "Keyword Types & Intent",
  "items": [
    {
      "name": "Informational (TOFU)",
      "description": "User wants to learn. 'What is machine learning?' — high volume, low conversion. Great for content marketing. Answer thoroughly, build authority."
    },
    {
      "name": "Navigational",
      "description": "'GitHub login', 'Notion pricing'. User knows where they want to go. Only rank for your own brand terms."
    },
    {
      "name": "Commercial Investigation (MOFU)",
      "description": "'Best project management software 2025', 'Notion vs Asana'. User comparing options. High-converting content type: comparison posts, reviews, best-of lists."
    },
    {
      "name": "Transactional (BOFU)",
      "description": "'Buy Notion Pro', 'Notion discount code'. User ready to act. Highest conversion. Optimize product/pricing pages. Competitive CPC in ads."
    }
  ]
}
\`\`\`

## On-Page SEO

\`\`\`html
<!-- Perfect on-page SEO structure for a blog post: -->

<!-- 1. Title tag — most important on-page factor -->
<title>How to Learn TypeScript in 2025 (Complete Roadmap) | Samsara</title>
<!-- 50-60 characters, primary keyword near front, brand at end -->

<!-- 2. Meta description — not a ranking factor, but affects click-through rate -->
<meta name="description" content="Step-by-step TypeScript learning roadmap for JavaScript developers. Includes beginner to advanced topics, best resources, and a 30-day study plan.">
<!-- 150-160 characters, includes call-to-action, relevant keywords -->

<!-- 3. H1 — one per page, matches/contains primary keyword -->
<h1>How to Learn TypeScript in 2025: A Complete Roadmap</h1>

<!-- 4. H2/H3 — structure content, include related keywords -->
<h2>Why Learn TypeScript?</h2>
<h2>TypeScript Prerequisites</h2>
<h3>JavaScript Fundamentals You Need</h3>
<h2>30-Day TypeScript Learning Plan</h2>

<!-- 5. Image alt text — descriptive, includes keyword where natural -->
<img src="typescript-roadmap.png" alt="TypeScript learning roadmap flowchart for 2025">

<!-- 6. Internal links — link to related pages on your site -->
<a href="/courses/javascript-complete">JavaScript fundamentals course</a>

<!-- 7. URL structure — clean, keyword-rich, no parameters -->
<!-- Good: /blog/learn-typescript-2025 -->
<!-- Bad:  /blog/?p=847 or /blog/how-to-learn-typescript-a-complete-roadmap-for-beginners-2025 -->
\`\`\`

## Technical SEO Checklist

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Core Web Vitals",
      "icon": "⚡",
      "content": "### Core Web Vitals — Google's UX Ranking Signals\\n\\n| Metric | Good | Needs Work | Poor |\\n|--------|------|------------|------|\\n| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5-4s | > 4s |\\n| **INP** (Interaction to Next Paint) | < 200ms | 200-500ms | > 500ms |\\n| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 |\\n\\n**How to improve:**\\n- LCP: Use CDN, compress images (WebP/AVIF), defer non-critical JS\\n- INP: Reduce JavaScript execution time, use web workers\\n- CLS: Set explicit width/height on images, avoid late-loading ads"
    },
    {
      "label": "Crawlability",
      "icon": "🤖",
      "content": "### robots.txt & Sitemap\\n\\n\`\`\`text\\n# robots.txt — tell crawlers what to access\\nUser-agent: *\\nDisallow: /admin/\\nDisallow: /api/\\nAllow: /\\n\\nSitemap: https://yoursite.com/sitemap.xml\\n\`\`\`\\n\\n\`\`\`xml\\n<!-- sitemap.xml — list of all indexable URLs -->\\n<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\">\\n  <url>\\n    <loc>https://yoursite.com/courses/typescript</loc>\\n    <lastmod>2025-04-01</lastmod>\\n    <changefreq>monthly</changefreq>\\n    <priority>0.8</priority>\\n  </url>\\n</urlset>\\n\`\`\`\\n\\nSubmit sitemap in Google Search Console. Helps Google find and prioritize pages."
    },
    {
      "label": "Schema Markup",
      "icon": "📋",
      "content": "### Structured Data (Rich Results)\\n\\nSchema markup tells Google what your content IS, enabling rich results (star ratings, FAQs, courses in SERP).\\n\\n\`\`\`html\\n<script type=\\"application/ld+json\\">\\n{\\n  \\"@context\\": \\"https://schema.org\\",\\n  \\"@type\\": \\"Course\\",\\n  \\"name\\": \\"TypeScript Complete\\",\\n  \\"description\\": \\"Master TypeScript from basics to production patterns\\",\\n  \\"provider\\": {\\n    \\"@type\\": \\"Organization\\",\\n    \\"name\\": \\"Samsara\\",\\n    \\"url\\": \\"https://samsara.ai\\"\\n  },\\n  \\"hasCourseInstance\\": {\\n    \\"@type\\": \\"CourseInstance\\",\\n    \\"courseMode\\": \\"online\\",\\n    \\"price\\": \\"10\\"\\n  }\\n}\\n</script>\\n\`\`\`\\n\\nTest with Google's Rich Results Test. Course schema can get 'Courses' rich results in Google."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Keyword research: find informational keywords to build authority, commercial/transactional to convert revenue", "Title tag is the #1 on-page factor — primary keyword near front, 50-60 chars, brand at end", "Core Web Vitals (LCP, INP, CLS) are ranking signals — measure with PageSpeed Insights, optimize via CDN + image compression", "Schema markup: Course, Article, FAQ, Product — enables rich results which 2-3x click-through rate", "Google Search Console is free and shows which queries bring traffic, which pages rank, and indexing errors", "Internal linking: link from high-authority pages to pages you want to rank — passes PageRank"]
\`\`\`
`,
    },
  ],
};
