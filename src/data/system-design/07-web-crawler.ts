import { Module } from "../types";

export const webCrawlerModule: Module = {
  id: "sd-07",
  title: "Design a Web Crawler",
  description:
    "Design a scalable web crawler that can systematically browse the internet, handle politeness policies, and deduplicate content.",
  lessons: [
    {
      id: "sd-07-01",
      slug: "web-crawler-requirements",
      title: "Requirements & Estimation",
      content: `# Web Crawler: Requirements & Estimation

## What Is a Web Crawler?

A web crawler (also called a spider or bot) is a program that automatically visits web pages, downloads their content, and follows links to discover new pages. Search engines like Google rely on crawlers to index the web.

## Functional Requirements

1. **Seed URLs** — Start from a set of seed URLs and discover new pages by following hyperlinks.
2. **Content Download** — Fetch and store the HTML content of each page.
3. **Link Extraction** — Parse pages to extract outbound URLs for further crawling.
4. **Politeness** — Respect \`robots.txt\` and avoid overloading any single host.
5. **Content Freshness** — Re-crawl pages periodically to keep content up to date.
6. **Duplicate Detection** — Avoid downloading the same page twice or storing duplicate content.

## Non-Functional Requirements

- **Scalability** — Crawl billions of pages across the web.
- **Robustness** — Handle malformed HTML, infinite loops, server failures, and crawler traps.
- **Extensibility** — Easy to add support for new content types (images, PDFs, etc.).

## Back-of-the-Envelope Estimation

Assume we want to crawl **1 billion pages per month**.

| Metric | Calculation |
|--------|------------|
| Pages per second | 1B / (30 days x 86,400 sec) ≈ **~385 pages/sec** |
| Avg page size | ~100 KB (HTML only) |
| Storage per month | 1B x 100 KB = **~100 TB/month** |
| Bandwidth | 385 pages/sec x 100 KB = **~38.5 MB/sec (~308 Mbps)** |
| Metadata storage | ~500 bytes/page x 1B = **~500 GB** for URL records |

If we store pages for 5 years, we need approximately **6 PB** of raw storage (before compression). With compression (typically 3-5x for HTML), this drops to roughly **1.2-2 PB**.

## DNS Resolution

Every URL requires a DNS lookup. At 385 lookups/sec, DNS can become a bottleneck. We will need a local DNS cache to avoid hammering DNS servers.

## Key Takeaways

- A web crawler must balance **throughput** (pages/sec) with **politeness** (not overloading hosts).
- Storage is the dominant cost — compression and deduplication are essential.
- DNS resolution and bandwidth are key bottlenecks to plan for.
- Re-crawling for freshness adds to the overall crawl volume significantly.
- Robustness against traps and malformed content is critical at scale.
`,
    },
    {
      id: "sd-07-02",
      slug: "web-crawler-high-level-design",
      title: "High-Level Design",
      content: `# Web Crawler: High-Level Design

## Core Components

A web crawler has several collaborating components that form a pipeline. Each URL flows through this pipeline from discovery to storage.

\`\`\`mermaid
graph LR
    Seed[Seed URLs] --> Frontier[URL Frontier]
    Frontier --> Fetcher[HTTP Fetcher]
    Fetcher --> Parser[HTML Parser]
    Parser --> Extractor[Link Extractor]
    Extractor --> Dedup[URL Dedup]
    Dedup --> Filter[URL Filter]
    Filter --> Frontier
    Parser --> Storage[(Content Storage)]
\`\`\`

\`\`\`
┌─────────────┐     ┌───────────┐     ┌──────────┐     ┌────────────┐
│  Seed URLs   │────>│   URL     │────>│  HTTP    │────>│   HTML     │
│              │     │  Frontier │     │  Fetcher │     │   Parser   │
└─────────────┘     └───────────┘     └──────────┘     └─────┬──────┘
                         ^                                     │
                         │                                     v
                    ┌────┴──────┐     ┌───────────┐     ┌──────────────┐
                    │   URL     │<────│  URL      │<────│  Link        │
                    │   Filter  │     │  Dedup    │     │  Extractor   │
                    └───────────┘     └───────────┘     └──────────────┘
                                                              │
                                                              v
                                                        ┌──────────────┐
                                                        │  Content     │
                                                        │  Storage     │
                                                        └──────────────┘
\`\`\`

## Component Responsibilities

### URL Frontier
The frontier is a queue of URLs waiting to be crawled. It is not a simple FIFO queue — it incorporates **prioritization** (important pages first) and **politeness** (spacing out requests to the same host). Think of it as a priority queue with per-host rate limiting.

### HTTP Fetcher
Downloads the page content at a given URL. It must handle redirects, timeouts, retries, and various HTTP status codes. It also checks \`robots.txt\` before fetching.

### HTML Parser
Takes raw HTML and produces a clean, structured representation. It must handle malformed HTML gracefully, strip scripts and styles, and prepare content for storage and link extraction.

### Link Extractor
Pulls all hyperlinks (\`<a href="...">\`) from parsed HTML. Converts relative URLs to absolute URLs and normalizes them (lowercasing the domain, removing fragments, etc.).

### URL Deduplication
Checks whether a discovered URL has already been seen. Uses a data structure like a Bloom filter or a hash set backed by a database to efficiently track billions of URLs.

### URL Filter
Applies rules to decide whether a URL should be crawled. Filters out unwanted file types (e.g., \`.zip\`, \`.exe\`), blocked domains, and URLs matching known trap patterns.

### Content Storage
Stores the downloaded HTML. This can be a distributed file system (like HDFS) or an object store (like S3). A content hash is stored alongside for deduplication.

## The Crawl Loop

1. Pop a URL from the frontier.
2. Check \`robots.txt\` for the host (cached).
3. Fetch the page via HTTP.
4. Parse the HTML and store the content.
5. Extract links, normalize and deduplicate them.
6. Push new URLs into the frontier.
7. Repeat.

## Key Takeaways

- The URL frontier is the heart of the crawler — it controls what gets crawled and when.
- URL normalization and deduplication prevent wasted work.
- The pipeline architecture makes each component independently scalable.
- \`robots.txt\` checking must happen before every fetch to maintain politeness.
- Content storage needs to support both writes (new pages) and reads (for re-processing).
`,
    },
    {
      id: "sd-07-03",
      slug: "web-crawler-deep-dive",
      title: "Deep Dive",
      content: `# Web Crawler: Deep Dive

## URL Prioritization

Not all pages are equally important. We want to crawl high-value pages first. The frontier uses a **priority queue** with scores based on:

- **PageRank** — Pages linked by many other pages are more important.
- **Update frequency** — Pages that change often should be re-crawled sooner.
- **Domain authority** — Pages from well-known, authoritative domains get higher priority.
- **Depth from seed** — Pages closer to seed URLs tend to be more important.

A common design splits the frontier into two layers: a **prioritizer** (assigns scores) feeding into a **politeness module** (ensures spacing per host).

## Politeness: robots.txt and Crawl Delay

Web servers publish a \`robots.txt\` file that specifies which paths a crawler may or may not visit, and optionally a \`Crawl-delay\` directive. A well-behaved crawler must:

1. Fetch and cache \`robots.txt\` for each domain before crawling any page on it.
2. Obey \`Disallow\` rules — never fetch forbidden paths.
3. Respect \`Crawl-delay\` — wait the specified number of seconds between requests to the same host.
4. Even without a \`Crawl-delay\`, impose a minimum delay (e.g., 1 second) between requests to the same host.

The politeness module in the frontier maintains a **per-host queue** and a timer that tracks when the next request to each host is allowed.

## Content Deduplication

The same content often appears at multiple URLs (mirrors, URL parameters, www vs non-www). We detect duplicates using:

### Exact Deduplication — MD5/SHA-256 Hash
Hash the page content. If the hash matches an existing page, skip it. This catches exact copies but misses near-duplicates (pages that differ by a timestamp or ad).

### Near-Duplicate Detection — SimHash
SimHash produces a fingerprint where **similar documents have similar fingerprints**. Two documents are near-duplicates if their SimHash values differ in fewer than *k* bit positions (typically k=3 for 64-bit hashes). This catches pages that are 95%+ similar.

## Handling Crawler Traps

Crawler traps are pages that generate an infinite number of URLs. Common examples:

- **Calendar pages** — \`/calendar/2025/01/01\`, \`/calendar/2025/01/02\`, ... endlessly.
- **Session IDs in URLs** — Each visit gets a new URL parameter.
- **Dynamically generated content** — Pages that keep adding new links.

Defenses include:
- **Maximum URL depth** — Limit how many path segments a URL can have.
- **Maximum pages per host** — Cap the total pages crawled from one domain.
- **URL pattern detection** — Detect repetitive URL structures and stop following them.
- **Manual blacklists** — Human review of hosts that consume disproportionate crawl budget.

## Key Takeaways

- URL prioritization ensures the most valuable pages are crawled first within limited resources.
- Politeness is non-negotiable — violating \`robots.txt\` can lead to legal issues and IP bans.
- SimHash is the standard technique for near-duplicate detection at scale.
- Crawler traps can waste enormous resources; multiple defensive strategies should be layered together.
`,
    },
    {
      id: "sd-07-04",
      slug: "web-crawler-scaling",
      title: "Scaling & Trade-offs",
      content: `# Web Crawler: Scaling & Trade-offs

## Distributed Crawling

A single machine cannot crawl the entire web. We distribute work across many crawler nodes:

\`\`\`
┌──────────────────────────────────────────┐
│            URL Frontier Service          │
│  (Partitioned by host domain hash)       │
└──────┬──────────┬──────────┬─────────────┘
       │          │          │
       v          v          v
  ┌─────────┐ ┌─────────┐ ┌─────────┐
  │ Crawler │ │ Crawler │ │ Crawler │
  │ Node 1  │ │ Node 2  │ │ Node 3  │
  └────┬────┘ └────┬────┘ └────┬────┘
       │          │          │
       v          v          v
  ┌──────────────────────────────────┐
  │    Content Store (S3 / HDFS)     │
  └──────────────────────────────────┘
\`\`\`

**Partitioning strategy**: Assign each crawler node a set of domains (partition by hash of the domain name). This naturally enforces politeness — only one node talks to a given host — and avoids duplicate fetches.

## Geographically Distributed Crawlers

Latency matters when crawling billions of pages. Placing crawler nodes in multiple regions reduces round-trip time:

- A crawler in **Europe** crawls \`.de\`, \`.fr\`, \`.uk\` domains faster.
- A crawler in **Asia** handles \`.jp\`, \`.cn\`, \`.kr\` domains faster.
- A crawler in **North America** handles \`.com\`, \`.org\`, \`.edu\`.

This is not strict — any node can crawl any domain — but geographic affinity reduces latency and improves throughput.

## DNS Resolver Caching

DNS resolution is slow (50-200ms per lookup) and external DNS servers rate-limit heavy users. Solutions:

1. **Local DNS cache** — Cache DNS results in-memory on each crawler node. Most domains are visited many times, so the cache hit rate is very high.
2. **Pre-fetching** — Resolve DNS for queued URLs before they reach the fetcher.
3. **TTL awareness** — Respect DNS TTL values but use stale entries as fallback when DNS is slow.

With a well-tuned cache, DNS resolution overhead drops from 200ms to under 1ms for most requests.

## Incremental Re-crawling

The web changes constantly. Rather than re-crawling everything on a fixed schedule, use an adaptive approach:

- **Change detection** — Compare content hashes. If a page has not changed across multiple visits, increase the interval between re-crawls.
- **HTTP caching headers** — Use \`Last-Modified\` and \`ETag\` headers. Send conditional requests (\`If-Modified-Since\`) to avoid downloading unchanged pages.
- **Sitemap.xml** — Many sites publish sitemaps with \`<lastmod>\` dates. Use these to prioritize recently changed pages.
- **Historical frequency** — Track how often each page changes and predict when it will change next.

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| BFS vs DFS | BFS finds important pages first | DFS goes deeper into one site |
| Freshness vs Coverage | Re-crawl known pages often | Discover new pages instead |
| Politeness vs Speed | Strict delays = slower | Aggressive = risk being blocked |
| Storage vs Reprocessing | Store all raw HTML (expensive) | Re-fetch when needed (slower) |

## Key Takeaways

- Partition by domain hash to naturally enforce single-host-single-crawler politeness.
- Geographic distribution of crawlers reduces latency for region-specific domains.
- DNS caching is essential — without it, DNS becomes the biggest bottleneck.
- Adaptive re-crawling saves bandwidth by focusing on pages that actually change.
- Every scaling decision involves a trade-off; the right choice depends on the crawler's goals.
`,
    },
  ],
};
