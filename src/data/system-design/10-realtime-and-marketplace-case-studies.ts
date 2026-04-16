import { Module } from "../types";

export const realtimeAndMarketplaceCaseStudiesModule: Module = {
  id: "realtime-and-marketplace-case-studies",
  title: "Case Studies: Real-Time & Marketplace Systems",
  description: "Design systems where location, time, and transactions intersect: ride-sharing, ticketing, web crawlers, and large-scale search engines.",
  lessons: [
    {
      id: "design-uber-lyft",
      slug: "design-uber-lyft",
      title: "Design a Ride-Sharing App (Uber / Lyft)",
      content: `# Design a Ride-Sharing App (Uber / Lyft)

\`\`\`concept
{
  "title": "The Core Challenges",
  "body": "Ride-sharing demands **real-time geospatial matching** at massive scale. Three hard problems: (1) track millions of driver locations every 4 seconds without melting your database, (2) match riders to nearby drivers in <500 ms, (3) compute surge pricing in near-real-time. Each problem needs a different architectural tool."
}
\`\`\`

## Functional Requirements

- Riders request trips; nearby available drivers get notified
- Driver location updates every 4 s
- ETA + surge price shown before booking
- Trip state machine: requested → accepted → en-route → arrived → in-trip → completed

## Capacity Estimates

| Metric | Value |
|--------|-------|
| Active drivers | 1 M |
| Location updates/s | 250 K (1 M ÷ 4 s) |
| Trip requests/s | 10 K peak |
| Peak cities | 500 |

## Location Tracking

\`\`\`concept
{
  "title": "Redis GEOADD — The Key Trick",
  "body": "Store every driver location in a Redis **Geo sorted set** keyed by city. Redis encodes latitude/longitude as a 52-bit geohash score. GEORADIUS queries return drivers within N km in O(N+log M) time with no extra indexing. TTL-expire drivers that go offline by writing with a 10 s expiry on a companion key."
}
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Driver heartbeat",
      "content": "Every 4 s driver app POSTs { driverId, lat, lng, status }\\nAPI server:\\n  GEOADD city:NYC:drivers <lng> <lat> <driverId>\\n  SET driver:<driverId>:alive 1 EX 10   # offline if key expires"
    },
    {
      "label": "Radius query",
      "content": "On trip request:\\n  GEORADIUS city:NYC:drivers <lng> <lat> 5 km ASC COUNT 20\\nReturns up to 20 nearest driver IDs sorted by distance.\\nFilter to status=available via pipeline of HGET driver:<id>:status."
    },
    {
      "label": "Scale beyond single Redis",
      "content": "Shard by city (city:NYC, city:SFO).\\nFor mega-cities shard by geohash prefix (city:NYC:g9, city:NYC:gb).\\nUber H3 hexagonal indexing replaces raw GEORADIUS for more uniform cells."
    }
  ]
}
\`\`\`

## Matching Engine

\`\`\`steps
{
  "steps": [
    {
      "title": "Gather candidates",
      "description": "Query Redis GEORADIUS for drivers within 5 km. Typical result: 5-50 drivers."
    },
    {
      "title": "Score candidates",
      "description": "Score = α × ETA + β × driver_rating + γ × acceptance_rate. ETA from routing service (OSRM or Google Maps API). This is a lightweight linear assignment, not full optimization."
    },
    {
      "title": "Dispatch top-K",
      "description": "Send push notification (FCM/APNs) to top 3 drivers. First to accept wins. Lock via Redis SET driver:<id>:locked NX EX 15 to prevent double-dispatch."
    },
    {
      "title": "Escalate if no accept",
      "description": "After 15 s timeout, widen radius to 10 km, retry with next batch. After 3 rounds, show rider 'No drivers nearby'."
    }
  ]
}
\`\`\`

## Surge Pricing

\`\`\`concept
{
  "title": "Kafka Streams Surge",
  "body": "Driver location updates and trip requests stream into Kafka. A Kafka Streams job computes supply/demand ratio per geohash cell over a 5-minute tumbling window. Surge multiplier = f(demand/supply). Published back to Redis; API reads it per request. No polling, no batch jobs — true streaming."
}
\`\`\`

## System Architecture

\`\`\`sysdiag
{
  "title": "Uber High-Level Architecture",
  "nodes": [
    { "id": "app", "label": "Driver / Rider App", "type": "client" },
    { "id": "gw", "label": "API Gateway", "type": "service" },
    { "id": "loc", "label": "Location Service", "type": "service" },
    { "id": "redis", "label": "Redis Geo Cluster", "type": "database" },
    { "id": "match", "label": "Matching Engine", "type": "service" },
    { "id": "kafka", "label": "Kafka (location events)", "type": "queue" },
    { "id": "surge", "label": "Surge Pricing (KStreams)", "type": "service" },
    { "id": "trip", "label": "Trip Service", "type": "service" },
    { "id": "db", "label": "PostgreSQL (trips)", "type": "database" }
  ],
  "edges": [
    { "from": "app", "to": "gw" },
    { "from": "gw", "to": "loc", "label": "heartbeat" },
    { "from": "loc", "to": "redis", "label": "GEOADD" },
    { "from": "loc", "to": "kafka", "label": "publish" },
    { "from": "kafka", "to": "surge" },
    { "from": "gw", "to": "match", "label": "trip request" },
    { "from": "match", "to": "redis", "label": "GEORADIUS" },
    { "from": "match", "to": "trip" },
    { "from": "trip", "to": "db" }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "A driver updates location every 4 s. With 1 M active drivers, how many Redis writes per second must the Location Service handle?",
  "options": [
    "40,000 writes/s",
    "250,000 writes/s",
    "1,000,000 writes/s",
    "4,000,000 writes/s"
  ],
  "answer": 1,
  "explanation": "1,000,000 drivers ÷ 4 s interval = 250,000 writes/s. Redis can handle ~500 K ops/s on a single node — this is why sharding by city is sufficient rather than requiring a cluster."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Use Redis GEOADD/GEORADIUS for O(log N) geospatial driver lookup — no custom quad-tree needed",
    "Matching is lightweight linear scoring (ETA + rating), not a global optimization problem",
    "Surge pricing is a streaming computation on supply/demand ratios over time windows via Kafka Streams",
    "Prevent double-dispatch with Redis NX locks with TTL; escalate radius on timeout"
  ]
}
\`\`\``,
    },
    {
      id: "design-ticketmaster",
      slug: "design-ticketmaster",
      title: "Design a Ticketing System (Ticketmaster)",
      content: `# Design a Ticketing System (Ticketmaster)

\`\`\`concept
{
  "title": "The Flash-Sale Inventory Problem",
  "body": "Ticketmaster's core challenge: 100,000 fans simultaneously trying to buy 1,000 seats for a Taylor Swift concert. The database must prevent **overselling** (two buyers confirmed for the same seat), **seat holds** must expire fairly, and the system must stay responsive under thundering herd load."
}
\`\`\`

## Key Requirements

- Browse events, select seats, hold for 10 minutes, purchase or release
- No overselling under concurrent load
- Virtual waiting room for high-demand events
- Read-heavy catalog (millions of events) vs write-heavy checkout (burst)

## Seat State Machine

\`\`\`steps
{
  "steps": [
    { "title": "AVAILABLE", "description": "Seat in inventory, no lock." },
    { "title": "HELD", "description": "User selected seat; 10-min hold created. Status set to HELD, hold_expires_at = now()+10m. Seat invisible to other buyers." },
    { "title": "PURCHASING", "description": "User at payment screen. Payment processor called." },
    { "title": "SOLD", "description": "Payment confirmed. Seat permanently SOLD." },
    { "title": "AVAILABLE (released)", "description": "Hold expired without purchase → cron/queue releases seat back to AVAILABLE." }
  ]
}
\`\`\`

## Preventing Overselling — Optimistic Locking

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Naive (broken)",
      "content": "SELECT status FROM seats WHERE id=42;  -- AVAILABLE\\n-- concurrent buyer also reads AVAILABLE\\nUPDATE seats SET status='HELD' WHERE id=42;\\n-- BOTH updates succeed → oversold!"
    },
    {
      "label": "Optimistic locking (correct)",
      "content": "-- Each row has a version column\\nUPDATE seats\\nSET status='HELD', version=version+1, held_by=\\$userId\\nWHERE id=42 AND status='AVAILABLE' AND version=\\$knownVersion;\\n-- affected_rows == 0 → conflict → retry or show 'seat taken'"
    },
    {
      "label": "Pessimistic locking (alternative)",
      "content": "BEGIN;\\nSELECT * FROM seats WHERE id=42 FOR UPDATE;  -- row lock\\n-- safe to update, no other tx can touch this row\\nUPDATE seats SET status='HELD' ...;\\nCOMMIT;\\n-- Higher contention, simpler code. Use for very hot seats."
    }
  ]
}
\`\`\`

## Virtual Waiting Room

\`\`\`concept
{
  "title": "Queue-Based Fairness",
  "body": "For mega-events, a waiting room prevents thundering herd from hitting the DB. When event goes on sale: (1) users enter waiting room and receive a signed JWT token with their queue position, (2) a token drip service admits N users per second (configurable based on checkout throughput), (3) only users with a valid 'admitted' token can reach the seat selection page."
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Ticketmaster Architecture",
  "nodes": [
    { "id": "cdn", "label": "CDN (event catalog)", "type": "service" },
    { "id": "wroom", "label": "Waiting Room Service", "type": "service" },
    { "id": "queue", "label": "Redis Queue (position)", "type": "database" },
    { "id": "seat", "label": "Seat Service", "type": "service" },
    { "id": "db", "label": "PostgreSQL (seats+orders)", "type": "database" },
    { "id": "payment", "label": "Payment Service (Stripe)", "type": "service" },
    { "id": "hold", "label": "Hold Expiry Worker", "type": "service" }
  ],
  "edges": [
    { "from": "cdn", "to": "wroom", "label": "on-sale start" },
    { "from": "wroom", "to": "queue", "label": "LPUSH user token" },
    { "from": "wroom", "to": "seat", "label": "admit N/s" },
    { "from": "seat", "to": "db", "label": "optimistic lock UPDATE" },
    { "from": "seat", "to": "payment" },
    { "from": "hold", "to": "db", "label": "expire holds every 30s" }
  ]
}
\`\`\`

## Scaling the Read Path

\`\`\`compare
{
  "title": "Event Catalog: Cache Strategy",
  "left": {
    "label": "Without caching",
    "points": [
      "Every page load hits PostgreSQL",
      "Event detail: 50 ms DB query",
      "10 K concurrent users = DB saturated",
      "Static event info re-queried constantly"
    ]
  },
  "right": {
    "label": "With CDN + Redis cache",
    "points": [
      "Event catalog cached in CDN (1 hr TTL)",
      "Seat map cached in Redis (invalidated on hold/sale)",
      "Only checkout flow hits primary DB",
      "99% of traffic served from cache"
    ]
  }
}
\`\`\`

\`\`\`quiz
{
  "question": "Two users click 'Hold Seat 42' simultaneously. The seat has version=5 and status=AVAILABLE. User A's UPDATE executes first (version becomes 6). What happens to User B's UPDATE?",
  "options": [
    "User B's UPDATE also succeeds — both users hold the seat",
    "User B's UPDATE affects 0 rows (version mismatch) — seat correctly rejected",
    "User B gets a deadlock error and must retry",
    "PostgreSQL automatically queues User B's request"
  ],
  "answer": 1,
  "explanation": "User B's UPDATE includes WHERE version=5 but the row now has version=6 (changed by User A). The WHERE clause fails → 0 rows affected. The application detects affected_rows=0 and shows 'seat already taken'. This is optimistic concurrency — no locks held during the check, just a compare-and-swap at write time."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Optimistic locking (UPDATE WHERE version=expected) prevents overselling without holding row locks between read and write",
    "Virtual waiting rooms convert thundering herd into metered admission — protect the seat service from burst load",
    "Hold expiry must be handled by a background worker (or DB scheduled job) to release unheld seats",
    "Separate read path (CDN/cache) from write path (DB) — catalog is read-heavy, checkout is write-critical"
  ]
}
\`\`\``,
    },
    {
      id: "design-google-maps",
      slug: "design-google-maps",
      title: "Design a Navigation Service (Google Maps)",
      content: `# Design a Navigation Service (Google Maps)

\`\`\`concept
{
  "title": "Three Distinct Subsystems",
  "body": "Google Maps is actually three products bundled: (1) **Map tile serving** — raster/vector tiles for the visual map, (2) **Routing** — computing fastest path between A and B, (3) **Live traffic** — aggregating GPS probes from millions of phones into real-time speed estimates. Each needs radically different architecture."
}
\`\`\`

## Map Tile Serving

\`\`\`steps
{
  "steps": [
    { "title": "Pre-render tiles offline", "description": "The planet's road/building/terrain data is rendered into 256×256 px PNG or MVT (vector) tiles at zoom levels 0-20. Total: ~4.6 PB of raster tiles. Stored in object storage (GCS/S3)." },
    { "title": "CDN at every PoP", "description": "Tiles are cached at CDN edge nodes globally. Cache-hit rate >99% for popular areas. A tile URL encodes zoom/x/y — deterministic → perfect for CDN." },
    { "title": "Incremental updates", "description": "When OSM data changes, only affected tiles at affected zoom levels are re-rendered. Invalidated in CDN. Typically done nightly for low-zoom, hourly for city zoom." }
  ]
}
\`\`\`

## Routing — Contraction Hierarchies

\`\`\`concept
{
  "title": "Why Dijkstra Can't Scale to Continents",
  "body": "A continental road graph has ~10 M nodes. Vanilla Dijkstra exploring all nodes = too slow for <1 s routing. **Contraction Hierarchies (CH)** preprocesses the graph offline: nodes are contracted in importance order, adding 'shortcut' edges that skip unimportant intermediate nodes. At query time, bidirectional Dijkstra on the hierarchy finds optimal routes in milliseconds."
}
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Preprocessing (offline)",
      "content": "1. Rank nodes by importance (few shortcut edges = unimportant).\\n2. Contract least important node: if removing it creates a shortcut path shorter than any alternative, add shortcut edge.\\n3. Repeat until all nodes contracted.\\nResult: augmented graph with shortcut edges."
    },
    {
      "label": "Query (real-time)",
      "content": "Bidirectional Dijkstra from source upward and destination upward in the hierarchy.\\nMeet in the middle at a high-importance node.\\nTypical query: 500 μs on continental graph vs 5 s for vanilla Dijkstra."
    },
    {
      "label": "Live traffic integration",
      "content": "CH is re-run with updated edge weights (travel times from traffic data).\\nFull CH rebuild: every 10-15 min on regional subgraphs.\\nAlternative: time-dependent CH pre-computes speeds per time of day."
    }
  ]
}
\`\`\`

## Live Traffic via GPS Probes

\`\`\`concept
{
  "title": "Crowdsourced Speed Data",
  "body": "Every phone running Maps (with consent) sends anonymized GPS traces. Speed = distance / time between consecutive GPS points. These are aggregated: map-matched to road segments, averaged with exponential weighting (recent > old), and published as speed estimates per segment. 1 M active phones = dense coverage on major roads."
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Maps Architecture Overview",
  "nodes": [
    { "id": "client", "label": "Mobile / Web Client", "type": "client" },
    { "id": "cdn", "label": "CDN (tile cache)", "type": "service" },
    { "id": "tile", "label": "Tile Server (GCS backed)", "type": "service" },
    { "id": "route", "label": "Routing Service (CH graph)", "type": "service" },
    { "id": "traffic", "label": "Traffic Ingestion (Kafka)", "type": "queue" },
    { "id": "agg", "label": "Speed Aggregator (Flink)", "type": "service" },
    { "id": "segdb", "label": "Segment Speed Store (Redis)", "type": "database" }
  ],
  "edges": [
    { "from": "client", "to": "cdn", "label": "tile request" },
    { "from": "cdn", "to": "tile", "label": "cache miss" },
    { "from": "client", "to": "route", "label": "route request" },
    { "from": "route", "to": "segdb", "label": "edge weights" },
    { "from": "client", "to": "traffic", "label": "GPS probe" },
    { "from": "traffic", "to": "agg" },
    { "from": "agg", "to": "segdb", "label": "update speeds" }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "Why are map tiles identified by (zoom, x, y) coordinates rather than geographic bounding boxes?",
  "options": [
    "Geographic bounding boxes require floating point math that CDNs cannot handle",
    "Tile coordinates produce deterministic, short cache keys that map perfectly to CDN paths",
    "Zoom/x/y encoding uses less bandwidth than lat/lng",
    "It is a legacy format with no architectural benefit"
  ],
  "answer": 1,
  "explanation": "Tiles at (zoom=12, x=1234, y=5678) always contain the same geographic area. The URL /tiles/12/1234/5678.png is deterministic, so CDN can cache it with 100% efficiency — no cache-key computation needed. Geographic bounding boxes would produce floating-point URLs that vary by client precision and would never cache-hit."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Map tiles are pre-rendered offline and served via CDN — tile serving is a static content problem, not a compute problem",
    "Contraction Hierarchies enable sub-millisecond routing on continental graphs by preprocessing importance shortcuts",
    "Live traffic is crowdsourced GPS probes aggregated via Kafka + Flink and written to a per-segment speed store",
    "Routing uses CH with live edge weights; full re-preprocessing every ~15 min on regional subgraphs"
  ]
}
\`\`\``,
    },
    {
      id: "design-web-crawler",
      slug: "design-web-crawler",
      title: "Design a Web Crawler",
      content: `# Design a Web Crawler

\`\`\`concept
{
  "title": "The Crawler's Core Problems",
  "body": "A crawler must: (1) visit every URL exactly once (deduplication), (2) not hammer any single server (politeness), (3) prioritize fresh/important pages over stale/obscure ones (scheduling), (4) detect near-duplicate content (SimHash). Doing these correctly at 1 B pages/month requires careful data structure choices — naive sets and queues won't scale."
}
\`\`\`

## Scale Estimates

| Metric | Value |
|--------|-------|
| Pages to crawl/month | 1 B |
| Pages/second | ~400 |
| Average page size | 100 KB |
| Storage for raw pages | 100 TB/month |
| URL frontier size | 100 M URLs |

## URL Frontier — Two-Level Queue

\`\`\`concept
{
  "title": "Priority Queue + Politeness Queue",
  "body": "A naive single FIFO queue ignores both importance and politeness. The two-level design: **Front queues** are priority buckets (PageRank-weighted). A **Selector** picks the next URL and routes it to a **Back queue** keyed by domain. Each back queue enforces a minimum crawl-delay per domain (respecting robots.txt). This achieves priority crawling AND politeness simultaneously."
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Two-Level URL Frontier",
  "nodes": [
    { "id": "disc", "label": "URL Discoverer (parser)", "type": "service" },
    { "id": "front", "label": "Front Queues (priority buckets)", "type": "queue" },
    { "id": "sel", "label": "Queue Selector", "type": "service" },
    { "id": "back", "label": "Back Queues (per domain)", "type": "queue" },
    { "id": "sched", "label": "Crawler Scheduler", "type": "service" },
    { "id": "fetch", "label": "Fetcher Workers", "type": "service" },
    { "id": "parse", "label": "Parser + Content Store", "type": "service" }
  ],
  "edges": [
    { "from": "disc", "to": "front", "label": "score + enqueue" },
    { "from": "front", "to": "sel" },
    { "from": "sel", "to": "back", "label": "route by domain" },
    { "from": "back", "to": "sched", "label": "next URL (with delay)" },
    { "from": "sched", "to": "fetch" },
    { "from": "fetch", "to": "parse" },
    { "from": "parse", "to": "disc", "label": "new URLs" }
  ]
}
\`\`\`

## URL Deduplication — Bloom Filter

\`\`\`tabs
{
  "tabs": [
    {
      "label": "The problem",
      "content": "100 M URLs in frontier. Checking a hash set: ~1.6 GB memory.\\nDatabase lookup: 1-5 ms × 400 req/s = too slow.\\nNeed O(1) probabilistic check with low memory."
    },
    {
      "label": "Bloom filter solution",
      "content": "A bit array of m bits + k hash functions.\\nTo add URL: set bits at h1(url), h2(url), ..., hk(url).\\nTo check: if ALL k bits set → probably seen (small false positive rate).\\nFalse negatives: impossible (never misses a seen URL).\\nFor 100 M URLs at 1% FP rate: ~1 GB — vs 1.6 GB for hash set."
    },
    {
      "label": "False positive trade-off",
      "content": "1% FP rate means 1% of NEW URLs are skipped (mistakenly flagged as seen).\\nAcceptable for crawlers — slight undercoverage vs correctness overhead.\\nCombine with periodic exact-dedup pass on storage to catch FPs."
    }
  ]
}
\`\`\`

## Near-Duplicate Detection — SimHash

\`\`\`concept
{
  "title": "SimHash Fingerprinting",
  "body": "Two web pages may have identical content but different URLs (mirrors, scrapers). MD5 hash detects exact duplicates but not near-duplicates. **SimHash** produces a 64-bit fingerprint where similar documents have fingerprints with low Hamming distance. If hamming(sim1, sim2) ≤ 3, pages are near-duplicates. SimHash is computed per page at parse time; fingerprints stored in a hash table for O(1) lookup."
}
\`\`\`

\`\`\`quiz
{
  "question": "A Bloom filter for 100 M URLs has a 1% false positive rate. What does a false positive mean in the context of a web crawler?",
  "options": [
    "The crawler downloads a page it has already seen",
    "The crawler skips a new URL it has never visited",
    "The crawler mis-identifies a page's content type",
    "The crawler sends too many requests to a domain"
  ],
  "answer": 1,
  "explanation": "A false positive means the Bloom filter says 'I've seen this URL' when it actually hasn't. The crawler skips a URL it should crawl. False negatives (missing a seen URL → crawling it twice) are impossible with Bloom filters. The 1% FP rate means ~1 M new pages per 100 M URLs are missed — acceptable for a search crawler."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Two-level URL frontier: priority front queues → per-domain back queues → achieves both importance-based scheduling and politeness",
    "Bloom filter deduplication: O(1) probabilistic URL-seen check at ~10 bits/URL vs 128 bits/URL for a hash set",
    "SimHash near-duplicate detection: 64-bit fingerprint, Hamming distance ≤ 3 → near-duplicate; prevents storing mirror content",
    "Always respect robots.txt and crawl-delay; back queues enforce per-domain rate limits automatically"
  ]
}
\`\`\``,
    },
    {
      id: "design-search-engine",
      slug: "design-search-engine",
      title: "Design a Web Search Engine",
      content: `# Design a Web Search Engine

\`\`\`concept
{
  "title": "Pipeline Overview",
  "body": "A search engine is a pipeline: **Crawler** fetches pages → **Indexer** builds an inverted index → **Ranker** scores results for a query → **Serving** returns top-K in <100 ms. Each stage has distinct scale requirements. The indexer runs offline (batch), the serving layer runs online (must be fast)."
}
\`\`\`

## Inverted Index

\`\`\`concept
{
  "title": "The Core Data Structure",
  "body": "An inverted index maps each word → sorted list of (docId, positions) pairs called a **postings list**. For query 'distributed systems': look up 'distributed' postings, look up 'systems' postings, intersect the two lists (merge on sorted docIds). For phrase queries, also check positions are adjacent."
}
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Postings list structure",
      "content": "word: 'database'\\npostings: [(docId=1, tf=3, positions=[10,45,102]),\\n           (docId=7, tf=1, positions=[55]),\\n           (docId=12, tf=5, positions=[2,8,17,90,200])]\\n\\nStored in sorted order by docId for merge-join performance."
    },
    {
      "label": "Building at scale (MapReduce)",
      "content": "Map phase: for each (docId, page_text) emit (word, docId, position).\\nReduce phase: for each word, collect and sort all (docId, position) pairs → postings list.\\nOutput sharded by word hash across N index servers.\\nRebuild: typically full rebuild weekly + incremental delta index merged hourly."
    },
    {
      "label": "Query execution",
      "content": "Parse query → tokenize → look up each term's postings list.\\nAND query: merge-intersect sorted lists (two-pointer O(n+m)).\\nOR query: union-merge.\\nNot query: subtract.\\nPhrase: intersect + position adjacency check."
    }
  ]
}
\`\`\`

## Ranking — TF-IDF + PageRank

\`\`\`compare
{
  "title": "Scoring Signals",
  "left": {
    "label": "TF-IDF (content relevance)",
    "points": [
      "TF = term frequency in document (normalized)",
      "IDF = log(N / docs_containing_term) — rarer term → higher weight",
      "Score = Σ TF-IDF for each query term",
      "BM25 is modern replacement — handles doc length normalization"
    ]
  },
  "right": {
    "label": "PageRank (authority)",
    "points": [
      "PR(A) = (1-d) + d × Σ PR(B)/L(B) for all B linking to A",
      "Computed offline via iterative convergence on the link graph",
      "High PR = many authoritative pages link to you",
      "Prevents spam: hard to manipulate at scale"
    ]
  }
}
\`\`\`

## Two-Stage Ranking

\`\`\`steps
{
  "steps": [
    { "title": "Stage 1: Retrieval (fast)", "description": "BM25 scoring on inverted index for all docs containing query terms. Keep top-500 candidates. Runs in <10 ms." },
    { "title": "Stage 2: Re-ranking (accurate)", "description": "ML ranking model (LambdaMART or neural) re-scores top-500 with richer features: PageRank, freshness, click-through rate, anchor text, user signals. Keeps top-10." },
    { "title": "Result serving", "description": "Top-10 results fetched from document store (title, snippet, URL). Snippet generated by extracting sentences containing query terms. Served via reverse proxy with <100 ms SLA." }
  ]
}
\`\`\`

## Distributed Architecture

\`\`\`sysdiag
{
  "title": "Search Engine Architecture",
  "nodes": [
    { "id": "user", "label": "User Browser", "type": "client" },
    { "id": "front", "label": "Query Frontend", "type": "service" },
    { "id": "idx", "label": "Index Servers (sharded by word)", "type": "database" },
    { "id": "doc", "label": "Doc Store (sharded by docId)", "type": "database" },
    { "id": "rank", "label": "Ranking Service (ML)", "type": "service" },
    { "id": "crawler", "label": "Crawler", "type": "service" },
    { "id": "indexer", "label": "Indexer (MapReduce)", "type": "service" }
  ],
  "edges": [
    { "from": "user", "to": "front", "label": "query" },
    { "from": "front", "to": "idx", "label": "term lookup (scatter)" },
    { "from": "idx", "to": "front", "label": "candidate docIds (gather)" },
    { "from": "front", "to": "rank", "label": "top-500 candidates" },
    { "from": "rank", "to": "doc", "label": "fetch snippets" },
    { "from": "rank", "to": "front", "label": "top-10 results" },
    { "from": "crawler", "to": "indexer" },
    { "from": "indexer", "to": "idx", "label": "update postings" }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "For the query 'machine learning', the inverted index returns 500K docs for 'machine' and 2M docs for 'learning'. What is the most efficient way to intersect these to find docs containing both?",
  "options": [
    "Scan all 2.5M docs and check membership in a hash set",
    "Two-pointer merge on the two sorted postings lists — O(min(m,n))",
    "Sort both lists and use binary search — O(m log n)",
    "Load both lists into memory and use a nested loop — O(m × n)"
  ],
  "answer": 1,
  "explanation": "Both postings lists are already sorted by docId. A two-pointer merge advances the smaller pointer when docIds don't match, O(m+n) total — in practice closer to O(min(m,n)) when one list is much smaller. This is why postings lists are stored pre-sorted and why 'AND' queries start with the least-frequent term."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Inverted index: word → sorted postings list of (docId, tf, positions); AND queries use two-pointer merge O(m+n)",
    "BM25 for content relevance + PageRank for authority; combined in a two-stage retrieval then ML re-ranking pipeline",
    "Index servers shard by word hash; doc servers shard by docId — query fans out to multiple index shards then gathers",
    "Full index rebuild weekly via MapReduce + hourly delta index merged in to handle freshness"
  ]
}
\`\`\``,
    },
    {
      id: "checkpoint-realtime-systems",
      slug: "checkpoint-realtime-systems",
      title: "Checkpoint: Real-Time System Design Review",
      content: `# Checkpoint: Real-Time System Design Review

\`\`\`callout
{ "variant": "info", "title": "Module Checkpoint", "content": "This checkpoint covers the five case studies from this module. Complete all questions before proceeding to Microservices & Architecture Patterns." }
\`\`\`

## Concept Review

\`\`\`compare
{
  "title": "Geospatial Tools",
  "left": {
    "label": "Redis GEOADD / GEORADIUS",
    "points": [
      "O(log N) radius search",
      "Sharded by city or H3 cell",
      "Ideal for driver tracking (1M+ drivers)",
      "TTL-based offline detection"
    ]
  },
  "right": {
    "label": "PostGIS / Spatial DB",
    "points": [
      "Full SQL query power (joins, aggregates)",
      "Slower for high-frequency writes",
      "Better for complex geo queries (polygons, routes)",
      "Prefer for analytics, not real-time tracking"
    ]
  }
}
\`\`\`

## Quiz Battery

\`\`\`quiz
{
  "question": "Ticketmaster sells 1,000 seats. 50,000 users simultaneously click 'buy'. Which mechanism correctly prevents overselling without holding long-lived DB locks?",
  "options": [
    "SELECT FOR UPDATE on every seat before purchase",
    "Application-level mutex in memory",
    "UPDATE seats SET status='HELD' WHERE id=? AND status='AVAILABLE' AND version=?",
    "Distributed lock with Redis SETNX per seat for 10 minutes"
  ],
  "answer": 2,
  "explanation": "Optimistic locking with a version column allows concurrent reads with no lock held. The UPDATE's WHERE clause acts as a compare-and-swap — it only succeeds if no other transaction modified the row. 0 affected rows = conflict, client retries. This scales linearly vs SELECT FOR UPDATE which serializes all buyers."
}
\`\`\`

\`\`\`quiz
{
  "question": "A web crawler uses a Bloom filter to track seen URLs. Which of the following is TRUE about Bloom filters?",
  "options": [
    "They can produce false negatives — reporting a URL as unseen when it was visited",
    "They can produce false positives — reporting a URL as seen when it was not",
    "They guarantee exact membership with no error",
    "They require more memory than a hash set for the same URL count"
  ],
  "answer": 1,
  "explanation": "Bloom filters have one-sided errors: false positives (says 'seen' when not) are possible; false negatives (says 'not seen' when seen) are impossible. This is acceptable for crawlers — occasionally skipping a new URL is fine. The memory efficiency advantage is significant: ~10 bits/element at 1% FP vs 128 bits/element for a hash set."
}
\`\`\`

\`\`\`quiz
{
  "question": "For Google Maps routing, why is Contraction Hierarchies preferred over vanilla Dijkstra?",
  "options": [
    "Dijkstra doesn't handle weighted edges; CH does",
    "CH pre-processes the graph offline to add shortcut edges, enabling bidirectional search to find optimal routes in milliseconds instead of seconds",
    "CH avoids processing dead-end roads that Dijkstra would explore",
    "CH uses heuristics that Dijkstra doesn't, accepting slightly suboptimal routes for speed"
  ],
  "answer": 1,
  "explanation": "CH adds shortcut edges during offline preprocessing (contracting unimportant nodes). At query time, bidirectional Dijkstra only needs to explore nodes upward in the hierarchy — meeting at high-importance nodes. This reduces the search space from millions of nodes to thousands. CH finds the exact optimal route (not approximate), unlike A* heuristics."
}
\`\`\`

## Design Flashcards

\`\`\`collapse
{
  "title": "How does surge pricing work in Uber?",
  "content": "Kafka Streams job computes supply/demand ratio per geohash cell over a 5-minute tumbling window. Surge multiplier = f(demand/supply). Published to Redis; API reads per request. This is streaming computation, not batch polling."
}
\`\`\`

\`\`\`collapse
{
  "title": "What is a virtual waiting room and when do you use it?",
  "content": "A waiting room queue placed in front of the purchase flow for high-demand events. Users receive a position token and are admitted at a controlled rate (N/s). Prevents thundering herd from hitting the seat inventory DB directly. Used when expected concurrent buyers >> checkout throughput."
}
\`\`\`

\`\`\`collapse
{
  "title": "Describe the two-stage search ranking pipeline.",
  "content": "Stage 1 (Retrieval): BM25 on inverted index → top-500 candidates in <10 ms. Stage 2 (Re-ranking): ML model (LambdaMART/neural) with PageRank, freshness, CTR signals re-scores top-500 → top-10. Stage 2 is compute-heavy but only runs on 500 docs, not millions."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Real-time location: Redis GEOADD/GEORADIUS sharded by city; driver offline detection via TTL-expired companion keys",
    "Concurrency control: optimistic locking (version column) prevents overselling without long-held row locks",
    "Routing at scale: Contraction Hierarchies preprocess graph offline; bidirectional Dijkstra finds exact optimal route in ms",
    "Deduplication at scale: Bloom filter (10 bits/URL, 1% FP) for URL dedup; SimHash Hamming distance for near-duplicate content"
  ]
}
\`\`\``,
    },
  ],
};
