import { Module } from "../types";

export const webCrawlerModule: Module = {
  id: "sd-07",
  title: "Design a Web Crawler",
  description: "Design a scalable web crawler that can systematically browse the internet, handle politeness policies, and deduplicate content.",
  lessons: [
    {
      id: "sd-07-01",
      slug: "web-crawler-requirements",
      title: "Requirements & Estimation",
      content: `# Web Crawler: Requirements & Estimation

## What Is a Web Crawler?

A web crawler (also called a spider or bot) is a program that automatically visits web pages, downloads their content, and follows links to discover new pages. Search engines like Google rely on crawlers to index the web.

\`\`\`concept
{
  "title": "Crawler as a Graph Explorer",
  "variant": "mental-model",
  "content": "Think of the web as a directed graph where each page is a node and each hyperlink is an edge. A crawler performs a systematic graph traversal (BFS or DFS) starting from seed URLs, storing page content at each node it visits."
}
\`\`\`

## Functional Requirements

1. **Seed URLs** — Start from a set of seed URLs and discover new pages by following hyperlinks.
2. **Content Download** — Fetch and store the HTML content of each page.
3. **Link Extraction** — Parse pages to extract outbound URLs for further crawling.
4. **Politeness** — Respect \`robots.txt\` and avoid overloading any single host.
5. **Content Freshness** — Re-crawl pages periodically to keep content up to date.
6. **Duplicate Detection** — Avoid downloading the same page twice or storing duplicate content.

\`\`\`quiz
{
  "title": "Which of these is NOT a functional requirement?",
  "questions": [
    {
      "question": "A crawler must store HTML content for every page it visits.",
      "options": ["True", "False"],
      "answer": 0,
      "explanation": "Storing content is explicitly listed as a functional requirement."
    },
    {
      "question": "Respecting crawl-delay in robots.txt affects which requirement?",
      "options": ["Seed URLs", "Politeness", "Content Freshness", "Link Extraction"],
      "answer": 1,
      "explanation": "Crawl-delay is part of the politeness policy to avoid overloading servers."
    },
    {
      "question": "Re-crawling the same URL every hour primarily supports:",
      "options": ["Duplicate Detection", "Content Freshness", "Link Extraction", "Seed URLs"],
      "answer": 1,
      "explanation": "Frequent re-crawling keeps the indexed content fresh."
    }
  ]
}
\`\`\`

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

If we store pages for 5 years, we need approximately **6 PB** of raw storage (before compression). With compression (typically 3-5× for HTML), this drops to roughly **1.2–2 PB**.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Storage Growth Over 5 Years",
  "inputs": [
    { "id": "p", "label": "Monthly ingest (TB)", "default": 100, "min": 10, "max": 500 },
    { "id": "r", "label": "Compression ratio", "default": 4, "min": 2, "max": 10 },
    { "id": "t", "label": "Years to store", "default": 5, "min": 1, "max": 10 }
  ]
}
\`\`\`

## DNS Resolution

Every URL requires a DNS lookup. At 385 lookups/sec, DNS can become a bottleneck. We will need a local DNS cache to avoid hammering DNS servers.

\`\`\`steps
{
  "title": "DNS Bottleneck Mitigation",
  "steps": [
    {
      "title": "Local LRU Cache",
      "content": "Keep last ~1 M (host → IP) pairs in memory; ~90 % hit rate observed in practice."
    },
    {
      "title": "Negative Caching",
      "content": "Cache NXDOMAIN results for 5 min to avoid repeated failed lookups."
    },
    {
      "title": "Pre-fetching",
      "content": "Resolve all hosts in the frontier queue 100 ms before crawl time."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A crawler must balance **throughput** (pages/sec) with **politeness** (not overloading hosts).",
    "Storage is the dominant cost — compression and deduplication are essential.",
    "DNS resolution and bandwidth are key bottlenecks to plan for.",
    "Re-crawling for freshness adds to the overall crawl volume significantly.",
    "Robustness against traps and malformed content is critical at scale."
  ]
}
\`\`\``,
    },
    {
      id: "sd-07-02",
      slug: "web-crawler-high-level-design",
      title: "High-Level Design",
      content: `# Web Crawler: High-Level Design

## Core Components

A web crawler has several collaborating components that form a pipeline. Each URL flows through this pipeline from discovery to storage.

\`\`\`sysdiag
{ "title": "Web Crawler Pipeline Flow", "width": 800, "height": 500,
  "nodes": [
    { "id":"seed", "label":"Seed URLs", "x":100, "y":250, "kind":"start" },
    { "id":"frontier", "label":"URL Frontier", "x":250, "y":250, "kind":"queue" },
    { "id":"fetcher", "label":"HTTP Fetcher", "x":400, "y":250, "kind":"service" },
    { "id":"parser", "label":"HTML Parser", "x":550, "y":250, "kind":"service" },
    { "id":"extractor", "label":"Link Extractor", "x":550, "y":100, "kind":"service" },
    { "id":"dedup", "label":"URL Dedup", "x":400, "y":100, "kind":"cache" },
    { "id":"filter", "label":"URL Filter", "x":250, "y":100, "kind":"service" },
    { "id":"storage", "label":"Content Storage", "x":700, "y":250, "kind":"database" }
  ],
  "edges": [
    { "from":"seed", "to":"frontier", "label":"seeds" },
    { "from":"frontier", "to":"fetcher", "label":"pop" },
    { "from":"fetcher", "to":"parser", "label":"HTML" },
    { "from":"parser", "to":"extractor", "label":"parse" },
    { "from":"extractor", "to":"dedup", "label":"links" },
    { "from":"dedup", "to":"filter", "label":"new URLs" },
    { "from":"filter", "to":"frontier", "label":"filtered" },
    { "from":"parser", "to":"storage", "label":"content" }
  ],
  "annotations": {
    "frontier": "Priority queue with per-host politeness",
    "fetcher": "Respects robots.txt, handles redirects",
    "dedup": "Bloom filter for O(1) lookups",
    "storage": "Distributed file system or object store"
  }
}
\`\`\`

\`\`\`concept
{ "title": "The Frontier is Not Just a Queue", "variant": "mental-model", "content": "Think of the URL Frontier as a smart traffic controller, not a simple line. It juggles three jobs simultaneously:\\n\\n1. **Priority scheduling**: Important pages (high PageRank, news sites) jump ahead\\n2. **Politeness enforcement**: Per-host queues ensure ≥1 second gaps between requests\\n3. **Load balancing**: Distributes URLs across fetcher nodes to maximize throughput\\n\\nWithout this intelligence, you'd either hammer servers (rude) or crawl irrelevant pages first (inefficient)." }
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

\`\`\`algoviz
{ "title": "Bloom Filter in Action", "type": "array", "data": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  "frames": [
    { "highlight": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], "label": "Empty 16-bit Bloom filter", "stats": {"hash_funcs":3,"inserted":0} },
    { "highlight": [2,5,11], "label": "URL 'example.com' → hash1=2, hash2=5, hash3=11", "stats": {"hash_funcs":3,"inserted":1} },
    { "highlight": [1,5,14], "label": "URL 'news.com' → hash1=1, hash2=5, hash3=14", "stats": {"hash_funcs":3,"inserted":2} },
    { "highlight": [2,5,11], "label": "Check 'example.com' again → all bits set (probably seen)", "stats": {"hash_funcs":3,"inserted":2} }
  ],
  "speed": 1000
}
\`\`\`

### URL Filter
Applies rules to decide whether a URL should be crawled. Filters out unwanted file types (e.g., \`.zip\`, \`.exe\`), blocked domains, and URLs matching known trap patterns.

### Content Storage
Stores the downloaded HTML. This can be a distributed file system (like HDFS) or an object store (like S3). A content hash is stored alongside for deduplication.

## The Crawl Loop

\`\`\`steps
{ "title": "The 7-Step Crawl Cycle", "steps": [
  { "title": "1. Pop from Frontier", "content": "Select next URL using priority + politeness rules. High-value sites (news, gov) and fresh domains get preference." },
  { "title": "2. Check robots.txt", "content": "Download and parse site's robots.txt (cached for 24h). Respect Disallow rules and Crawl-delay (e.g., 1s between requests)." },
  { "title": "3. Fetch Page", "content": "HTTP GET with timeouts (10s), retries (max 3), and redirect following (max 5 hops). Handle gzip encoding." },
  { "title": "4. Parse & Store", "content": "Clean HTML, extract text, compute Simhash for dedup. Store raw HTML + metadata (status, headers, timestamp) to S3/HDFS." },
  { "title": "5. Extract Links", "content": "Find all <a href> tags, convert relative to absolute URLs, normalize (lowercase host, remove #fragment, sort params)." },
  { "title": "6. Deduplicate URLs", "content": "Check Bloom filter: if seen → skip; if new → add to filter and proceed. 0.01% false-positive rate acceptable." },
  { "title": "7. Filter & Enqueue", "content": "Apply URL filters (block .exe, .zip, spam patterns). Surviving URLs go back to frontier with priority score." }
] }
\`\`\`

\`\`\`quiz
{ "title": "Frontier Behavior Quiz", "questions": [
  { "question": "Why does the frontier use per-host queues instead of a global queue?", "options": ["Simpler code", "Enforces politeness delays", "Saves memory", "Faster lookups"], "answer": 1, "explanation": "Per-host queues let us enforce minimum delays (e.g., 1s) between requests to the same server, preventing overload and respecting robots.txt Crawl-delay directives." },
  { "question": "A Bloom filter with 10 hash functions and 12 Gb of bits gives what approximate false-positive rate for 5 billion URLs?", "options": ["0.01%", "1%", "10%", "50%"], "answer": 0, "explanation": "Research shows this configuration keeps the false-positive rate below 0.01%, meaning fewer than 1 in 10,000 new URLs will be incorrectly rejected as duplicates." },
  { "question": "Which component decides whether to crawl 'https://example.com/file.exe'?", "options": ["HTTP Fetcher", "URL Filter", "Link Extractor", "HTML Parser"], "answer": 1, "explanation": "The URL Filter applies rules like blocking certain file extensions (.exe, .zip) before any network request is made, saving bandwidth and storage." }
] }
\`\`\`

## Key Takeaways

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "The URL frontier is the heart of the crawler — it controls what gets crawled and when using priority and politeness.",
  "URL normalization and deduplication prevent wasted work; Bloom filters give O(1) duplicate checks at scale.",
  "The pipeline architecture makes each component independently scalable across distributed nodes.",
  "robots.txt checking must happen before every fetch to maintain politeness and avoid legal issues.",
  "Content storage needs to support both writes (new pages) and reads (for re-processing and indexing)."
] }
\`\`\``,
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

\`\`\`concept
{
  "title": "URL Prioritization as a Mental Model",
  "variant": "mental-model",
  "content": "Think of the frontier as a hospital triage system. Patients (URLs) arrive continuously, but a nurse (prioritizer) quickly assigns a color-coded tag (priority score) based on vital signs (PageRank, update frequency, domain authority). The most critical patients go first, yet the system still ensures no single doctor (host server) is overwhelmed. This two-layer triage keeps the emergency room (crawler) both effective and polite."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Priority Queue in Action",
  "type": "array",
  "data": ["https://news.gov/earthquake", "https://blog.example/2025/06/01", "https://news.gov/sports", "https://mit.edu/ai-paper.pdf", "https://shop.example/product?id=7"],
  "frames": [
    { "highlight": [0], "label": "Highest PageRank + authority → pop first", "stats": {"queue_size": 5} },
    { "highlight": [3], "label": "Next: strong authority, fresh content", "stats": {"queue_size": 4} },
    { "highlight": [2], "label": "Medium priority: news but older", "stats": {"queue_size": 3} }
  ],
  "speed": 1000
}
\`\`\`

## Politeness: robots.txt and Crawl Delay

Web servers publish a \`robots.txt\` file that specifies which paths a crawler may or may not visit, and optionally a \`Crawl-delay\` directive. A well-behaved crawler must:

1. Fetch and cache \`robots.txt\` for each domain before crawling any page on it.
2. Obey \`Disallow\` rules — never fetch forbidden paths.
3. Respect \`Crawl-delay\` — wait the specified number of seconds between requests to the same host.
4. Even without a \`Crawl-delay\`, impose a minimum delay (e.g., 1 second) between requests to the same host.

The politeness module in the frontier maintains a **per-host queue** and a timer that tracks when the next request to each host is allowed.

\`\`\`trace
{
  "title": "Politeness Timeline for example.com",
  "language": "python",
  "code": "import time, requests\\n\\nDOMAIN = 'example.com'\\nROBOTS = f'https://{DOMAIN}/robots.txt'\\nDELAY = 1.0  # seconds\\n\\nlast_hit = {}\\n\\ndef polite_get(url):\\n    host = url.split('/')[2]\\n    if host not in last_hit:\\n        last_hit[host] = 0\\n    elapsed = time.time() - last_hit[host]\\n    if elapsed < DELAY:\\n        wait = DELAY - elapsed\\n        time.sleep(wait)\\n    resp = requests.get(url)\\n    last_hit[host] = time.time()\\n    return resp\\n\\n# Crawl sequence\\npolite_get(f'https://{DOMAIN}/page1')\\npolite_get(f'https://{DOMAIN}/page2')",
  "frames": [
    { "line": 11, "vars": {"host": "example.com", "elapsed": 0}, "note": "First request allowed immediately", "stdout": "" },
    { "line": 14, "vars": {"wait": 0}, "note": "No wait needed", "stdout": "GET /page1 200\\n" },
    { "line": 11, "vars": {"elapsed": 0.4}, "note": "Second request arrives too soon", "stdout": "" },
    { "line": 13, "vars": {"wait": 0.6}, "note": "Sleep 0.6 s to respect 1 s delay", "stdout": "" },
    { "line": 14, "note": "Now safe to fetch", "stdout": "GET /page2 200\\n" }
  ],
  "speed": 600
}
\`\`\`

## Content Deduplication

The same content often appears at multiple URLs (mirrors, URL parameters, www vs non-www). We detect duplicates using:

### Exact Deduplication — MD5/SHA-256 Hash
Hash the page content. If the hash matches an existing page, skip it. This catches exact copies but misses near-duplicates (pages that differ by a timestamp or ad).

### Near-Duplicate Detection — SimHash
SimHash produces a fingerprint where **similar documents have similar fingerprints**. Two documents are near-duplicates if their SimHash values differ in fewer than *k* bit positions (typically k=3 for 64-bit hashes). This catches pages that are 95%+ similar.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Naïve exact-hash dedup",
    "code": "def is_duplicate(content):\\n    h = hashlib.sha256(content).hexdigest()\\n    return h in seen_hashes  # misses near-duplicates"
  },
  "after": {
    "label": "SimHash near-duplicate guard",
    "code": "def is_near_duplicate(content):\\n    sig = simhash(content)        # 64-bit fingerprint\\n    for seen in seen_sigs:\\n        if hamming(sig, seen) <= 3:\\n            return True\\n    return False"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Deduplication Quick Check",
  "questions": [
    {
      "question": "Which method catches pages that differ only by a banner ad?",
      "options": ["MD5 hash", "SimHash", "robots.txt", "Bloom filter"],
      "answer": 1,
      "explanation": "SimHash fingerprints similar documents closely, tolerating small differences."
    },
    {
      "question": "What is the typical Hamming-distance threshold for 64-bit SimHash near-duplicates?",
      "options": ["1 bit", "3 bits", "10 bits", "32 bits"],
      "answer": 1,
      "explanation": "Industry practice uses k=3 bits for 95%+ similarity."
    },
    {
      "question": "Which data structure saves the most memory when storing 1 B URLs at 0.1 % FPR?",
      "options": ["HashSet<String>", "Bloom filter", "PriorityQueue", "ArrayList"],
      "answer": 1,
      "explanation": "A Bloom filter needs ≈1.8 GB vs tens of GB for a Java HashSet."
    }
  ]
}
\`\`\`

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

\`\`\`steps
{
  "title": "Layered Crawler-Trap Defense",
  "steps": [
    {
      "title": "1. Depth Cap",
      "content": "Reject URLs with more than 10 path segments (e.g., \`/a/b/c/.../j\`)."
    },
    {
      "title": "2. Host Budget",
      "content": "Stop after 50 k pages from any single domain in one crawl wave."
    },
    {
      "title": "3. Pattern Regex",
      "content": "Block URLs matching \`/calendar/\\\\d{4}/\\\\d{2}/\\\\d{2}\` or \`\\\\?sessionid=\\\\w{32}\`."
    },
    {
      "title": "4. Manual Blacklist",
      "content": "Ops team adds domains that consistently waste >5 % of total crawl budget."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "URL prioritization ensures the most valuable pages are crawled first within limited resources.",
    "Politeness is non-negotiable — violating robots.txt can lead to legal issues and IP bans.",
    "SimHash is the standard technique for near-duplicate detection at scale.",
    "Crawler traps can waste enormous resources; multiple defensive strategies should be layered together."
  ]
}
\`\`\``,
    },
    {
      id: "sd-07-04",
      slug: "web-crawler-scaling",
      title: "Scaling & Trade-offs",
      content: `# Web Crawler: Scaling & Trade-offs

\`\`\`concept
{"title": "Why Single-Node Crawlers Hit a Wall", "variant": "mental-model", "content": "Think of a librarian trying to photocopy every book in the world alone. No matter how fast the copier, the librarian’s two hands (CPU cores), one cart (network interface), and limited shelf space (RAM) become hard ceilings. Horizontal scaling adds more librarians; each still works politely, but now thousands proceed in parallel."}
\`\`\`

## Distributed Crawling

A single machine cannot crawl the entire web. We distribute work across many crawler nodes:

\`\`\`sysdiag
{"title": "Distributed Crawler Topology", "width": 680, "height": 320,
 "nodes": [
   {"id":"uf","label":"URL Frontier\\n(partitioned)","x":340,"y":60,"kind":"queue"},
   {"id":"c1","label":"Crawler\\nNode 1","x":120,"y":180,"kind":"service"},
   {"id":"c2","label":"Crawler\\nNode 2","x":340,"y":180,"kind":"service"},
   {"id":"c3","label":"Crawler\\nNode 3","x":560,"y":180,"kind":"service"},
   {"id":"store","label":"Content Store\\n(S3/HDFS)","x":340,"y":280,"kind":"storage"}
 ],
 "edges": [
   {"from":"uf","to":"c1","label":"domain hash A-F"},
   {"from":"uf","to":"c2","label":"domain hash G-M"},
   {"from":"uf","to":"c3","label":"domain hash N-Z"},
   {"from":"c1","to":"store","label":"write"},
   {"from":"c2","to":"store","label":"write"},
   {"from":"c3","to":"store","label":"write"}
 ],
 "annotations": {
   "uf":"Partitions queue by hash(domain) so each crawler owns a slice.",
   "c2":"Only this node will ever hit host G-M, enforcing politeness automatically."
 }}
\`\`\`

**Partitioning strategy**: Assign each crawler node a set of domains (partition by hash of the domain name). This naturally enforces politeness — only one node talks to a given host — and avoids duplicate fetches.

## Geographically Distributed Crawlers

Latency matters when crawling billions of pages. Placing crawler nodes in multiple regions reduces round-trip time:

- A crawler in **Europe** crawls \`.de\`, \`.fr\`, \`.uk\` domains faster.
- A crawler in **Asia** handles \`.jp\`, \`.cn\`, \`.kr\` domains faster.
- A crawler in **North America** handles \`.com\`, \`.org\`, \`.edu\`.

This is not strict — any node can crawl any domain — but geographic affinity reduces latency and improves throughput.

\`\`\`quiz
{"title": "Check Your Understanding: Scaling Tactics", "questions": [
  {"question":"Which partitioning key automatically enforces politeness?","options":["URL path","Domain hash","Page rank","Content length"],"answer":1,"explanation":"Hashing the domain name ensures one crawler node is responsible for each host, so requests are naturally spaced out."},
  {"question":"Why place a crawler node in Europe?","options":["GDPR compliance only","Lower latency to European domains","Cheaper egress cost","Stronger CPUs"],"answer":1,"explanation":"Physical proximity reduces RTT, so European nodes finish handshakes and TLS faster for .de/.fr hosts."},
  {"question":"What is the main downside of vertical scaling a crawler?","options":["Harder to code","Single point of failure","Slower network","More power usage"],"answer":1,"explanation":"One mega-machine is a bottleneck; if it fails, crawling stops. Horizontal scaling adds fault tolerance."}
]}
\`\`\`

## DNS Resolver Caching

DNS resolution is slow (50-200ms per lookup) and external DNS servers rate-limit heavy users. Solutions:

1. **Local DNS cache** — Cache DNS results in-memory on each crawler node. Most domains are visited many times, so the cache hit rate is very high.
2. **Pre-fetching** — Resolve DNS for queued URLs before they reach the fetcher.
3. **TTL awareness** — Respect DNS TTL values but use stale entries as fallback when DNS is slow.

With a well-tuned cache, DNS resolution overhead drops from 200ms to under 1ms for most requests.

\`\`\`compare
{"variant":"before-after","before":{"label":"Without DNS cache","code":"for url in batch:\\n    ip = dns.resolve(url.domain)  # 150ms each\\n    fetch(ip, url)"},"after":{"label":"With local cache","code":"for url in batch:\\n    ip = cache.get(url.domain) or dns.resolve(url.domain)\\n    fetch(ip, url)  # \\u003c1ms hit"}}
\`\`\`

## Incremental Re-crawling

The web changes constantly. Rather than re-crawling everything on a fixed schedule, use an adaptive approach:

- **Change detection** — Compare content hashes. If a page has not changed across multiple visits, increase the interval between re-crawls.
- **HTTP caching headers** — Use \`Last-Modified\` and \`ETag\` headers. Send conditional requests (\`If-Modified-Since\`) to avoid downloading unchanged pages.
- **Sitemap.xml** — Many sites publish sitemaps with \`<lastmod>\` dates. Use these to prioritize recently changed pages.
- **Historical frequency** — Track how often each page changes and predict when it will change next.

\`\`\`steps
{"title":"Adaptive Re-crawl Workflow","steps":[
  {"title":"1. Compute content hash","content":"After fetching, hash the normalized HTML (strip ads, timestamps). Store hash with timestamp."},
  {"title":"2. Compare with last hash","content":"If identical, multiply the current crawl interval by 1.5× (capped at 30 days)."},
  {"title":"3. Use conditional GET","content":"Next time, send \`If-None-Match: W/\\\\\\"hash\\\\\\"\`. If server replies 304, skip download."},
  {"title":"4. Respect sitemap priority","content":"If sitemap \`<lastmod>\` is newer than your last fetch, reset interval to minimum."}
]}
\`\`\`

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| BFS vs DFS | BFS finds important pages first | DFS goes deeper into one site |
| Freshness vs Coverage | Re-crawl known pages often | Discover new pages instead |
| Politeness vs Speed | Strict delays = slower | Aggressive = risk being blocked |
| Storage vs Reprocessing | Store all raw HTML (expensive) | Re-fetch when needed (slower) |

\`\`\`callout
{"type":"warning","title":"Politeness Reality Check","content":"Major search engines may ignore \`Crawl-delay\`, but for your crawler respecting 10–15s delays per host is safest. Adaptive backoff (doubling delay after 5xx or 429) keeps you un-blocked and is good netizenship."}
\`\`\`

\`\`\`takeaways
{"title":"Key Takeaways","items":[
  "Partition by domain hash to naturally enforce single-host-single-crawler politeness.",
  "Geographic distribution of crawlers reduces latency for region-specific domains.",
  "DNS caching is essential — without it, DNS becomes the biggest bottleneck.",
  "Adaptive re-crawling saves bandwidth by focusing on pages that actually change.",
  "Every scaling decision involves a trade-off; the right choice depends on the crawler's goals."
]}
\`\`\``,
    },
  ],
};
