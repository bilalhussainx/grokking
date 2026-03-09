import { Module } from "../types";

export const urlShortenerModule: Module = {
  id: "sd-url-shortener",
  title: "Design a URL Shortener",
  description:
    "Walk through designing a service like bit.ly — from requirements and estimation to scaling strategies.",
  lessons: [
    {
      id: "sd-url-1",
      slug: "url-shortener-requirements-estimation",
      title: "Requirements & Estimation",
      content: `# URL Shortener — Requirements & Estimation

A URL shortener takes a long URL and produces a short alias (e.g., \`https://short.ly/abc123\`) that redirects to the original. Let us design one from scratch.

## Functional Requirements

1. **Shorten:** Given a long URL, return a unique short URL.
2. **Redirect:** Given a short URL, redirect the user to the original long URL.
3. **Custom aliases (optional):** Allow users to choose their own short code.
4. **Expiration (optional):** Short URLs can have a TTL after which they stop working.
5. **Analytics (optional):** Track click count, referrer, geography.

## Non-Functional Requirements

- **Low latency:** Redirects should be fast (< 50 ms for a cache hit).
- **High availability:** The redirect path cannot go down — every short URL in the wild depends on it.
- **Scalability:** Handle billions of stored URLs and thousands of redirects per second.
- **Durability:** Once created, a short URL must not be lost.

## Back-of-Envelope Estimation

**Assumptions:**
- 100 million new URLs shortened per month.
- Read-to-write ratio: 100:1 (redirects far outnumber new shortenings).

**Writes (shortenings):**
- 100M / month ≈ 100M / (30 × 86,400) ≈ ~40 writes/second.

**Reads (redirects):**
- 100:1 ratio → ~4,000 reads/second.

**Storage (5-year horizon):**
- Each record: short code (7 bytes) + long URL (avg 200 bytes) + metadata (50 bytes) ≈ 257 bytes.
- 100M/month × 12 months × 5 years = 6 billion records.
- 6B × 257 bytes ≈ 1.5 TB of raw data. Easily fits on a modern database cluster.

**Bandwidth:**
- Write: 40 req/s × 257 bytes ≈ 10 KB/s (negligible).
- Read: 4,000 req/s × 257 bytes ≈ 1 MB/s (very manageable).

**Cache:**
- If we cache the top 20% most-accessed URLs: 0.20 × 6B × 257 bytes ≈ 300 GB. Fits in a Redis cluster.

## Short Code Length

We need a code space large enough to hold 6 billion URLs with low collision probability.

Using base62 (a-z, A-Z, 0-9):
- 6 characters → 62^6 ≈ 56.8 billion combinations.
- 7 characters → 62^7 ≈ 3.5 trillion combinations.

**6 characters** is sufficient for 6 billion URLs with plenty of room.

## Key Takeaways

- This is a **read-heavy** system (100:1 read-to-write ratio), so optimize the redirect path.
- Storage requirements are modest (~1.5 TB over 5 years) — a single sharded database handles it.
- A 6-character base62 code gives ~57 billion unique URLs — more than enough.
- Caching the hottest URLs in memory will handle the vast majority of redirects.
- Always start a design problem with these estimates — they guide every subsequent decision.
`,
    },
    {
      id: "sd-url-2",
      slug: "url-shortener-high-level-design",
      title: "High-Level Design",
      content: `# URL Shortener — High-Level Design

With our requirements and estimates in hand, let us design the system architecture.

## API Design

**POST /api/shorten**
\`\`\`
Request:  { "long_url": "https://example.com/very/long/path", "custom_alias": "mylink" (optional) }
Response: { "short_url": "https://short.ly/abc123", "expires_at": "2027-01-01" }
\`\`\`

**GET /:short_code**
\`\`\`
Response: HTTP 301/302 redirect to the original long URL.
\`\`\`

## Architecture

\`\`\`
  Client
    │
    ▼
┌──────────────┐
│ Load Balancer │
└──────┬───────┘
       │
  ┌────┴────┐
  ▼         ▼
┌──────┐ ┌──────┐
│ App  │ │ App  │   ← Stateless API servers
│ Srv  │ │ Srv  │
└──┬───┘ └──┬───┘
   │        │
   ▼        ▼
┌──────────────┐
│  Redis Cache │   ← Hot URL lookups
└──────┬───────┘
       │ (cache miss)
       ▼
┌──────────────┐
│   Database   │   ← All URL mappings
│  (sharded)   │
└──────────────┘
\`\`\`

## URL Encoding Strategy: Base62

We convert a numeric ID to a base62 string using the characters \`[a-zA-Z0-9]\`.

**Approach 1 — Auto-incrementing ID + Base62 Conversion:**
1. Insert the long URL into the database, which assigns an auto-incrementing ID (e.g., 12345).
2. Convert 12345 to base62 → \`"dnh"\`.
3. Return \`https://short.ly/dnh\`.

**Pros:** No collisions. Simple.
**Cons:** Sequential IDs are predictable (users can guess other URLs). Single point of failure for ID generation in a distributed setup.

**Approach 2 — Hash-based (MD5/SHA256 + Truncation):**
1. Hash the long URL: \`MD5("https://example.com/...") → "5d41402abc..."\`.
2. Take the first 6 characters of the base62-encoded hash.

**Pros:** No coordination needed between servers.
**Cons:** Collisions are possible (must check and retry).

**Approach 3 — Pre-generated Key Service:**
1. A separate service pre-generates millions of unique 6-character keys and stores them in a key database.
2. When a new URL is shortened, the app server grabs an unused key from the pool.

**Pros:** No collisions, no coordination overhead, fast.
**Cons:** Additional service to maintain. Must handle key exhaustion.

The **pre-generated key service** is the most practical approach at scale and a strong interview answer.

## Database Schema

\`\`\`
urls table:
┌───────────┬──────────────┬────────────────────────────────┬────────────┬───────────┐
│ short_code│ long_url     │ created_at                     │ expires_at │ user_id   │
│ (PK)      │ (indexed)    │                                │ (nullable) │ (nullable)│
├───────────┼──────────────┼────────────────────────────────┼────────────┼───────────┤
│ abc123    │ https://...  │ 2026-03-09 12:00:00            │ NULL       │ 42        │
└───────────┴──────────────┴────────────────────────────────┴────────────┴───────────┘
\`\`\`

The \`short_code\` is the primary key since every redirect query looks up by short code.

## Redirect Flow

1. Client sends \`GET /abc123\`.
2. App server checks Redis cache. **Cache hit** → return 301 redirect.
3. **Cache miss** → query database, populate cache, return 301 redirect.
4. If not found → return 404.

## Key Takeaways

- Use a pre-generated key service to avoid collisions and coordination overhead.
- Cache hot URLs in Redis for sub-millisecond redirect latency.
- The database is keyed on \`short_code\` since the redirect path dominates traffic.
- Stateless app servers behind a load balancer allow easy horizontal scaling.
`,
    },
    {
      id: "sd-url-3",
      slug: "url-shortener-deep-dive",
      title: "Deep Dive",
      content: `# URL Shortener — Deep Dive

Let us examine the trickier problems that arise once the basic system is in place.

## Hash Collisions

If using the hash-based approach (Approach 2), collisions are inevitable since we truncate a long hash to 6 characters.

**Resolution strategy:**
1. Hash the URL and take 6 characters.
2. Check if that code already exists in the database.
3. If it does and the stored long URL is different, append a counter to the original URL and re-hash: \`hash("https://example.com/path" + "1")\`.
4. Repeat until an unused code is found.

In practice, with 62^6 = 56.8 billion possible codes and only a few billion used, collisions are rare. But you must handle them.

The pre-generated key approach avoids this problem entirely.

## Custom Aliases

Users may want \`short.ly/my-brand\` instead of a random code. Implementation:

1. Validate the alias: length limits (3-30 chars), allowed characters, no reserved words.
2. Check if the alias is already taken (database lookup).
3. If available, insert with the custom alias as the short code.
4. If taken, return an error asking the user to choose another.

**Consideration:** Custom aliases can be longer than 6 characters. Your database and cache key design should accommodate variable-length codes.

## Analytics Tracking

For each redirect, you may want to track: timestamp, referrer, user agent, country, device type.

**Approach:** Do NOT add latency to the redirect path. Instead:

1. On redirect, publish an analytics event to a **message queue** (Kafka or SQS).
2. A separate analytics consumer processes events in batch.
3. Store aggregated analytics in a time-series or columnar database (ClickHouse, TimescaleDB).

\`\`\`
GET /abc123
    │
    ├──▶ 301 Redirect (immediate)
    │
    └──▶ Analytics Queue ──▶ Analytics Service ──▶ Analytics DB
\`\`\`

This keeps the redirect path fast while still capturing rich analytics.

## URL Expiration

Some URLs should expire after a certain date. Options:

**Lazy expiration:** On redirect, check \`expires_at\`. If expired, return 404 or a "link expired" page. Simple but expired entries consume storage.

**Active cleanup:** A background job periodically scans for expired entries and deletes them (or archives them). This reclaims storage and cache space. Run during off-peak hours.

**Best practice:** Use both. Lazy expiration ensures correctness. Active cleanup manages storage.

## Rate Limiting

Without rate limiting, a malicious user could exhaust your key space or overwhelm the service.

**Shorten endpoint:** Limit to N new URLs per user per hour. Use a token bucket or sliding window algorithm, backed by Redis.

**Redirect endpoint:** Less critical to rate limit (you want redirects to work), but protect against DDoS with standard infrastructure (WAF, CDN-level rate limits).

## Handling Duplicate Long URLs

If the same long URL is shortened multiple times, should it get the same short code?

**Option A — Always create a new code:** Simpler. Each shortening is independent.
**Option B — Deduplicate:** Check if the long URL already exists. If so, return the existing short code. Saves storage but requires an index on \`long_url\`, which is a large column to index.

Most services use Option A for simplicity. Deduplication is an optimization for later.

## Key Takeaways

- Handle hash collisions with retry logic, or avoid them entirely with pre-generated keys.
- Decouple analytics from the redirect path using an async message queue.
- Use lazy + active expiration together for correctness and storage management.
- Rate limit the shorten endpoint to prevent abuse.
- Custom aliases need validation, uniqueness checks, and support for variable-length codes.
`,
    },
    {
      id: "sd-url-4",
      slug: "url-shortener-scaling-tradeoffs",
      title: "Scaling & Trade-offs",
      content: `# URL Shortener — Scaling & Trade-offs

Let us address how this system handles growth and the key trade-offs involved.

## Caching Strategy

With a 100:1 read-to-write ratio, caching is critical. The top 20% of URLs likely account for 80% of traffic (Pareto principle).

**Cache design:**
- **Key:** short_code
- **Value:** long_url
- **Eviction:** LRU with a TTL (e.g., 24 hours).
- **Size:** We estimated ~300 GB for caching 20% of all URLs. A Redis cluster handles this.

**Cache warming:** For newly created URLs that you expect to be popular (e.g., a marketing campaign link), pre-populate the cache on creation.

## Database Choice

This system has simple access patterns: write a record (shorten) and read by primary key (redirect). There are no complex JOINs or transactions spanning multiple records.

**Strong candidates:**
- **DynamoDB / Cassandra:** Key-value lookups at scale, built-in horizontal sharding, high availability.
- **MySQL / PostgreSQL with sharding:** If you need SQL familiarity and want strong consistency.

For a URL shortener, a NoSQL key-value store is a natural fit. The access pattern is literally "get value by key."

## Database Sharding

Shard by \`short_code\`. Since codes are randomly distributed (whether hash-based or pre-generated), the data naturally distributes evenly across shards.

**Avoid sharding by user_id** — the redirect path does not know who created the URL. It only has the short code.

## Read-Heavy Optimization

\`\`\`
Request Flow Priority:

1. CDN / Edge Cache     ← fastest (< 5 ms)
2. Application Cache    ← fast (< 10 ms)
   (Redis)
3. Database Replica     ← moderate (< 50 ms)
4. Database Primary     ← last resort
\`\`\`

Layer caches aggressively:
- **CDN level:** If using 301 (permanent) redirects, browsers and CDNs cache the mapping. Subsequent requests never hit your servers.
- **Application level:** Redis cache for all active URLs.
- **Database level:** Read replicas to distribute query load.

## 301 vs 302 Redirects

This is a surprisingly important design decision:

**301 (Moved Permanently):**
- Browser caches the redirect. Subsequent visits to the short URL go directly to the long URL without hitting your servers.
- **Pro:** Reduces server load dramatically.
- **Con:** You cannot track clicks (the browser bypasses your server). You cannot change the destination later.

**302 (Found / Temporary Redirect):**
- Browser does NOT cache the redirect. Every visit hits your server.
- **Pro:** You can track every click. You can update the destination URL.
- **Con:** Higher server load since every request reaches your backend.

**Recommendation:** Use **302** if analytics matter (most commercial URL shorteners). Use **301** if you want to minimize infrastructure costs and do not need per-click tracking.

## Availability and Fault Tolerance

The redirect path is the most critical. If it goes down, every short URL in the world breaks.

**Strategies:**
- Multiple data center deployment with DNS-based failover.
- Database replication across regions.
- Cache is warmed in each region independently.
- The shorten endpoint can tolerate brief outages (users retry). The redirect endpoint cannot.

## Summary of Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| ID generation | Pre-generated keys (no collisions) | Hash-based (simpler, rare collisions) |
| Redirect type | 301 (less load, no analytics) | 302 (analytics, more load) |
| Database | NoSQL key-value (natural fit) | SQL (familiar, consistent) |
| Deduplication | Yes (save storage) | No (simpler, faster writes) |

## Key Takeaways

- Cache aggressively at multiple layers — CDN, Redis, read replicas.
- Choose 301 vs 302 based on whether you need click analytics.
- NoSQL key-value stores are a natural fit for the simple access pattern of URL shorteners.
- Shard by short_code for even distribution across database nodes.
- The redirect path must be highly available — it is the critical path that all short URLs depend on.
`,
    },
  ],
};
