import { Module } from "../types";

export const urlShortenerModule: Module = {
  id: "sd-url-shortener",
  title: "Design a URL Shortener",
  description: "Walk through designing a service like bit.ly — from requirements and estimation to scaling strategies.",
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

\`\`\`concept
{
  "title": "Read-Heavy System Insight",
  "variant": "insight",
  "content": "URL shorteners are classic read-heavy systems with typical read-to-write ratios of 100:1 or higher. This means every design decision should prioritize the read (redirect) path over the write (shorten) path. Cache placement, database indexing, and even API design should all optimize for fast, reliable reads."
}
\`\`\`

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

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "URL Growth Calculator",
  "inputs": [
    { "id": "monthly", "label": "URLs per month (millions)", "default": 100, "min": 1, "max": 1000 },
    { "id": "years", "label": "Years to project", "default": 5, "min": 1, "max": 10 },
    { "id": "bytes", "label": "Bytes per URL record", "default": 257, "min": 100, "max": 500 }
  ]
}
\`\`\`

## Short Code Length

We need a code space large enough to hold 6 billion URLs with low collision probability.

Using base62 (a-z, A-Z, 0-9):
- 6 characters → 62^6 ≈ 56.8 billion combinations.
- 7 characters → 62^7 ≈ 3.5 trillion combinations.

**6 characters** is sufficient for 6 billion URLs with plenty of room.

\`\`\`quiz
{
  "title": "Code Space & Collision Probability",
  "questions": [
    {
      "question": "With 6-character base62 codes, how many total unique combinations exist?",
      "options": ["~57 million", "~57 billion", "~570 billion", "~5.7 trillion"],
      "answer": 1,
      "explanation": "62^6 = 56,800,235,584 ≈ 56.8 billion unique combinations."
    },
    {
      "question": "If we store 6 billion URLs using 6-character base62 codes, what percentage of the code space is used?",
      "options": ["~0.1%", "~1%", "~10%", "~50%"],
      "answer": 2,
      "explanation": "6 billion / 56.8 billion ≈ 10.6% of the code space is utilized."
    },
    {
      "question": "Why is a read-heavy ratio (100:1) important for system design?",
      "options": ["We need more write throughput", "We should optimize the redirect path", "We need larger storage capacity", "We need shorter URLs"],
      "answer": 1,
      "explanation": "A 100:1 read-to-write ratio means redirects dominate traffic, so optimizing the read path (caching, fast lookups) has the biggest impact on performance."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "This is a **read-heavy** system (100:1 read-to-write ratio), so optimize the redirect path.",
    "Storage requirements are modest (~1.5 TB over 5 years) — a single sharded database handles it.",
    "A 6-character base62 code gives ~57 billion unique URLs — more than enough.",
    "Caching the hottest URLs in memory will handle the vast majority of redirects.",
    "Always start a design problem with these estimates — they guide every subsequent decision."
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "HTTP Status Codes for Redirects",
  "variant": "rule",
  "content": "Use 301 (Moved Permanently) for permanent redirects to benefit browser caching and SEO. Use 302 (Found) for temporary redirects when you might change the destination later. Most URL shorteners use 301 for performance."
}
\`\`\`

## Architecture

\`\`\`sysdiag
{
  "title": "URL Shortener High-Level Architecture",
  "width": 800,
  "height": 400,
  "nodes": [
    { "id": "client", "label": "Client", "x": 100, "y": 200, "kind": "user" },
    { "id": "lb", "label": "Load\\nBalancer", "x": 250, "y": 200, "kind": "gateway" },
    { "id": "app1", "label": "App\\nServer 1", "x": 400, "y": 120, "kind": "service" },
    { "id": "app2", "label": "App\\nServer 2", "x": 400, "y": 280, "kind": "service" },
    { "id": "cache", "label": "Redis\\nCache", "x": 550, "y": 200, "kind": "store" },
    { "id": "db", "label": "Sharded\\nDatabase", "x": 700, "y": 200, "kind": "database" }
  ],
  "edges": [
    { "from": "client", "to": "lb", "label": "HTTP" },
    { "from": "lb", "to": "app1", "label": "route" },
    { "from": "lb", "to": "app2", "label": "route" },
    { "from": "app1", "to": "cache", "label": "lookup" },
    { "from": "app2", "to": "cache", "label": "lookup" },
    { "from": "cache", "to": "db", "label": "miss" },
    { "from": "app1", "to": "db", "label": "write", "style": "dashed" },
    { "from": "app2", "to": "db", "label": "write", "style": "dashed" }
  ],
  "annotations": {
    "client": "Browser or mobile app making requests",
    "lb": "Distributes traffic across multiple app servers",
    "cache": "Stores hot URL mappings for sub-millisecond lookups",
    "db": "Persistent storage for all URL mappings, sharded for scale"
  }
}
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

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Auto-increment + Base62",
    "code": "# ID 12345 → \\"dnh\\"\\ndef encode_base62(id):\\n    alphabet = \\"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\\"\\n    result = \\"\\"\\n    while id > 0:\\n        result = alphabet[id % 62] + result\\n        id //= 62\\n    return result or \\"0\\"\\n\\n# Predictable: user can guess /dnh, /dni, /dnj..."
  },
  "after": {
    "label": "Pre-generated Key Pool",
    "code": "# Keys generated offline via UUID + Base62\\n# App server simply does:\\nSELECT key FROM key_pool WHERE used = false LIMIT 1;\\nUPDATE key_pool SET used = true WHERE key = ?;\\n\\n# No coordination, no predictability"
  }
}
\`\`\`

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

\`\`\`trace
{
  "title": "Redirect Flow Execution Trace",
  "language": "python",
  "code": "def handle_redirect(short_code: str):\\n    # Step 1: Check cache\\n    long_url = redis.get(f\\"url:{short_code}\\")\\n    if long_url:\\n        return redirect(long_url, status=301)\\n    \\n    # Step 2: Cache miss - query DB\\n    row = db.query(\\"SELECT long_url FROM urls WHERE short_code = ?\\", short_code)\\n    if not row:\\n        return error(404)\\n    \\n    # Step 3: Populate cache and redirect\\n    redis.setex(f\\"url:{short_code}\\", 3600, row.long_url)\\n    return redirect(row.long_url, status=301)",
  "frames": [
    { "line": 2, "vars": {"short_code": "abc123"}, "note": "Incoming request for /abc123", "stdout": "" },
    { "line": 3, "vars": {"short_code": "abc123", "long_url": "None"}, "note": "Cache miss - key not found", "stdout": "" },
    { "line": 7, "vars": {"row.long_url": "https://example.com/article"}, "note": "Database returned mapping", "stdout": "" },
    { "line": 11, "vars": {"long_url": "https://example.com/article"}, "note": "Cached for 1 hour", "stdout": "" },
    { "line": 12, "vars": {}, "note": "Returning 301 redirect", "stdout": "HTTP/1.1 301 Moved Permanently\\nLocation: https://example.com/article" }
  ],
  "speed": 1000
}
\`\`\`

## Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a pre-generated key service to avoid collisions and coordination overhead",
    "Cache hot URLs in Redis for sub-millisecond redirect latency",
    "The database is keyed on \`short_code\` since the redirect path dominates traffic",
    "Stateless app servers behind a load balancer allow easy horizontal scaling"
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "High-Level Design Quiz",
  "questions": [
    {
      "question": "Why is the pre-generated key service preferred over auto-incrementing IDs?",
      "options": ["It's simpler to implement", "It avoids predictable URLs and coordination issues", "It uses less storage", "It's faster for redirects"],
      "answer": 1,
      "explanation": "Pre-generated keys eliminate the predictability of sequential IDs and remove the need for coordination in distributed systems, making them ideal for scale."
    },
    {
      "question": "What HTTP status code should be used for permanent redirects in a URL shortener?",
      "options": ["200 OK", "301 Moved Permanently", "302 Found", "404 Not Found"],
      "answer": 1,
      "explanation": "301 Moved Permanently enables browser caching and SEO benefits since the redirect destination won't change."
    },
    {
      "question": "Why is Redis placed between the app servers and the database?",
      "options": ["To reduce database load on hot URLs", "To store user sessions", "To generate short codes", "To handle SSL termination"],
      "answer": 0,
      "explanation": "Redis caches frequently accessed URL mappings, reducing database queries and providing sub-millisecond response times for popular links."
    }
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "Collision Probability",
  "variant": "insight",
  "content": "With 62^6 = 56.8 billion possible 6-character codes, the probability of collision remains below 1% until you generate about 7.5 billion URLs (birthday paradox). Even at 10 billion URLs, collision probability is only ~17%, making retry logic efficient."
}
\`\`\`

## Custom Aliases

Users may want \`short.ly/my-brand\` instead of a random code. Implementation:

1. Validate the alias: length limits (3-30 chars), allowed characters, no reserved words.
2. Check if the alias is already taken (database lookup).
3. If available, insert with the custom alias as the short code.
4. If taken, return an error asking the user to choose another.

**Consideration:** Custom aliases can be longer than 6 characters. Your database and cache key design should accommodate variable-length codes.

\`\`\`quiz
{
  "title": "Custom Alias Validation",
  "questions": [
    {
      "question": "Which validation rule is most critical for custom aliases?",
      "options": ["Length must be exactly 6 characters", "Must not contain reserved words", "Must start with a number", "Must be base64 encoded"],
      "answer": 1,
      "explanation": "Reserved words like 'api', 'admin', or 'www' could conflict with system endpoints or create security issues."
    },
    {
      "question": "What's the best approach for checking alias availability?",
      "options": ["Check cache first, then database", "Check database directly", "Use eventual consistency", "Check after insertion"],
      "answer": 0,
      "explanation": "Checking cache first (with cache-aside pattern) provides fast responses for available aliases while maintaining consistency."
    },
    {
      "question": "Why support variable-length custom aliases?",
      "options": ["To save storage space", "To improve hash distribution", "User brands need meaningful names", "To reduce collision probability"],
      "answer": 2,
      "explanation": "Brand names like 'my-company-product-launch' are meaningful but longer than random 6-character codes."
    }
  ]
}
\`\`\`

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

\`\`\`sysdiag
{
  "title": "Async Analytics Architecture",
  "width": 600,
  "height": 300,
  "nodes": [
    {"id": "client", "label": "User", "x": 50, "y": 150, "kind": "user"},
    {"id": "lb", "label": "Load Balancer", "x": 150, "y": 150, "kind": "gateway"},
    {"id": "redirect", "label": "Redirect Service", "x": 250, "y": 100, "kind": "service"},
    {"id": "cache", "label": "Redis Cache", "x": 350, "y": 100, "kind": "database"},
    {"id": "queue", "label": "Kafka Queue", "x": 250, "y": 200, "kind": "queue"},
    {"id": "analytics", "label": "Analytics Service", "x": 400, "y": 200, "kind": "service"},
    {"id": "tsdb", "label": "Time-Series DB", "x": 500, "y": 200, "kind": "database"}
  ],
  "edges": [
    {"from": "client", "to": "lb", "label": "GET /abc123"},
    {"from": "lb", "to": "redirect", "label": "forward"},
    {"from": "redirect", "to": "cache", "label": "lookup"},
    {"from": "redirect", "to": "queue", "label": "publish event"},
    {"from": "queue", "to": "analytics", "label": "consume"},
    {"from": "analytics", "to": "tsdb", "label": "store"}
  ],
  "annotations": {
    "redirect": "Returns 301 immediately without waiting for analytics",
    "queue": "Decouples redirect path from analytics processing"
  }
}
\`\`\`

## URL Expiration

Some URLs should expire after a certain date. Options:

**Lazy expiration:** On redirect, check \`expires_at\`. If expired, return 404 or a "link expired" page. Simple but expired entries consume storage.

**Active cleanup:** A background job periodically scans for expired entries and deletes them (or archives them). This reclaims storage and cache space. Run during off-peak hours.

**Best practice:** Use both. Lazy expiration ensures correctness. Active cleanup manages storage.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Lazy Only",
    "code": "def get_long_url(short_code):\\n    row = db.query('SELECT * FROM urls WHERE code = ?', short_code)\\n    if row and row['expires_at'] > now():\\n        return row['long_url']\\n    return None\\n# Expired URLs accumulate forever"
  },
  "after": {
    "label": "Hybrid Approach",
    "code": "def get_long_url(short_code):\\n    row = cache.get(short_code) or db.query('SELECT * FROM urls WHERE code = ?', short_code)\\n    if row:\\n        if row['expires_at'] > now():\\n            return row['long_url']\\n        else:\\n            cache.delete(short_code)  # Clean cache\\n            return None\\n    return None\\n\\n# Background job runs hourly\\ndef cleanup_expired():\\n    db.execute('DELETE FROM urls WHERE expires_at < now()')\\n    cache.invalidate_pattern('*')"
  }
}
\`\`\`

## Rate Limiting

Without rate limiting, a malicious user could exhaust your key space or overwhelm the service.

**Shorten endpoint:** Limit to N new URLs per user per hour. Use a token bucket or sliding window algorithm, backed by Redis.

**Redirect endpoint:** Less critical to rate limit (you want redirects to work), but protect against DDoS with standard infrastructure (WAF, CDN-level rate limits).

\`\`\`steps
{
  "title": "Implementing Token Bucket Rate Limiting",
  "steps": [
    {
      "title": "Configure Redis Bucket",
      "content": "Each user gets a bucket with capacity C tokens that refill at rate R per second. Use Redis with Lua script for atomic operations."
    },
    {
      "title": "Check Before Processing",
      "content": "Before creating a short URL, check if user has tokens: \`tokens = min(C, tokens + (now - last_refill) * R)\`. If tokens >= 1, decrement and proceed."
    },
    {
      "title": "Handle Rate Limit Exceeded",
      "content": "Return 429 Too Many Requests with Retry-After header indicating when next token will be available."
    },
    {
      "title": "Monitor and Adjust",
      "content": "Track rate limit hits in metrics. Adjust C and R based on normal usage patterns and abuse detection."
    }
  ]
}
\`\`\`

## Handling Duplicate Long URLs

If the same long URL is shortened multiple times, should it get the same short code?

**Option A — Always create a new code:** Simpler. Each shortening is independent.
**Option B — Deduplicate:** Check if the long URL already exists. If so, return the existing short code. Saves storage but requires an index on \`long_url\`, which is a large column to index.

Most services use Option A for simplicity. Deduplication is an optimization for later.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Handle hash collisions with retry logic, or avoid them entirely with pre-generated keys",
    "Decouple analytics from the redirect path using an async message queue",
    "Use lazy + active expiration together for correctness and storage management",
    "Rate limit the shorten endpoint to prevent abuse",
    "Custom aliases need validation, uniqueness checks, and support for variable-length codes"
  ]
}
\`\`\``,
    },
    {
      id: "sd-url-4",
      slug: "url-shortener-scaling-tradeoffs",
      title: "Scaling & Trade-offs",
      content: `# URL Shortener — Scaling & Trade-offs

Let us address how this system handles growth and the key trade-offs involved.

\`\`\`concept
{
  "title": "Scalability in One Sentence",
  "variant": "mental-model",
  "content": "Scalability is the ability to handle increased workload by adding resources without redesigning the system. For a URL shortener, this means supporting billions of redirects daily while keeping latency under 50 ms."
}
\`\`\`

## Caching Strategy

With a **100:1 read-to-write ratio**, caching is critical. The top 20% of URLs likely account for 80% of traffic (Pareto principle).

**Cache design:**
- **Key:** \`short_code\`
- **Value:** \`long_url\`
- **Eviction:** LRU with a TTL (e.g., 24 hours).
- **Size:** We estimated ~300 GB for caching 20% of all URLs. A Redis cluster handles this.

**Cache warming:** For newly created URLs that you expect to be popular (e.g., a marketing campaign link), pre-populate the cache on creation.

\`\`\`algoviz
{
  "title": "Cache Hit vs Miss Flow",
  "type": "array",
  "data": ["bit.ly/abc123", "https://example.com/sale", "MISS", "DB lookup", "Cache store", "Return 302"],
  "frames": [
    { "highlight": [0], "label": "User requests bit.ly/abc123", "stats": {"cache": "?" } },
    { "highlight": [1], "label": "Cache hit: return long URL immediately", "stats": {"cache": "hit", "latency": "5 ms" } },
    { "highlight": [2], "label": "Cache miss: trigger database lookup", "stats": {"cache": "miss", "latency": "50 ms" } },
    { "highlight": [3], "label": "Database returns long URL", "stats": {"db": "read", "latency": "45 ms" } },
    { "highlight": [4], "label": "Store mapping in cache for next time", "stats": {"cache": "write", "ttl": "24 h" } },
    { "highlight": [5], "label": "Respond with 302 redirect", "stats": {"total": "55 ms" } }
  ],
  "speed": 1000
}
\`\`\`

## Database Choice

This system has simple access patterns: write a record (shorten) and read by primary key (redirect). There are no complex JOINs or transactions spanning multiple records.

**Strong candidates:**
- **DynamoDB / Cassandra:** Key-value lookups at scale, built-in horizontal sharding, high availability.
- **MySQL / PostgreSQL with sharding:** If you need SQL familiarity and want strong consistency.

For a URL shortener, a NoSQL key-value store is a natural fit. The access pattern is literally "get value by key."

\`\`\`quiz
{
  "title": "Pick the Right Store",
  "questions": [
    {
      "question": "Which factor most strongly favors NoSQL for a URL shortener?",
      "options": ["Need for ACID transactions", "Complex JOIN queries", "High read/write ratio with simple lookups", "Multi-record updates"],
      "answer": 2,
      "explanation": "The 100:1 read-to-write ratio and single-key lookups align perfectly with NoSQL key-value stores."
    },
    {
      "question": "Why is sharding by user_id a poor choice for the redirect path?",
      "options": ["It causes hot shards", "The redirect path only sees short_code, not user_id", "It increases collision risk", "It violates URL length limits"],
      "answer": 1,
      "explanation": "Servers handling redirects receive only the short code; they have no context about who created the URL."
    },
    {
      "question": "Estimate daily memory needed to cache 20% of 1B URLs if each mapping is 2KB.",
      "options": ["~40GB", "~200GB", "~400GB", "~800GB"],
      "answer": 2,
      "explanation": "0.2 × 1B × 2KB = 400GB. A Redis cluster of this size is routine."
    }
  ]
}
\`\`\`

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

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "301 (Permanent Redirect)",
    "code": "HTTP/1.1 301 Moved Permanently\\nLocation: https://example.com/sale\\nCache-Control: public, max-age=31536000\\n\\n# Browser caches forever; next visit skips your servers entirely"
  },
  "after": {
    "label": "302 (Temporary Redirect)",
    "code": "HTTP/1.1 302 Found\\nLocation: https://example.com/sale\\nCache-Control: private, no-cache\\n\\n# Every request returns to your servers; analytics & updates possible"
  }
}
\`\`\`

## Availability and Fault Tolerance

The redirect path is the most critical. If it goes down, every short URL in the world breaks.

**Strategies:**
- Multiple data center deployment with DNS-based failover.
- Database replication across regions.
- Cache is warmed in each region independently.
- The shorten endpoint can tolerate brief outages (users retry). The redirect endpoint cannot.

\`\`\`sysdiag
{
  "title": "Multi-Region Failover for Redirects",
  "width": 640,
  "height": 320,
  "nodes": [
    { "id": "u", "label": "User", "x": 60, "y": 160, "kind": "client" },
    { "id": "rt", "label": "Route 53", "x": 160, "y": 160, "kind": "gateway" },
    { "id": "e1", "label": "Edge POP\\nUS-East", "x": 280, "y": 100, "kind": "cdn" },
    { "id": "e2", "label": "Edge POP\\nEU-West", "x": 280, "y": 220, "kind": "cdn" },
    { "id": "a1", "label": "App\\nUS-East", "x": 400, "y": 100, "kind": "service" },
    { "id": "a2", "label": "App\\nEU-West", "x": 400, "y": 220, "kind": "service" },
    { "id": "c1", "label": "Redis\\nUS-East", "x": 520, "y": 100, "kind": "store" },
    { "id": "c2", "label": "Redis\\nEU-West", "x": 520, "y": 220, "kind": "store" },
    { "id": "db1", "label": "Primary DB\\nUS-East", "x": 600, "y": 100, "kind": "database" },
    { "id": "db2", "label": "Replica DB\\nEU-West", "x": 600, "y": 220, "kind": "database" }
  ],
  "edges": [
    { "from": "u", "to": "rt", "label": "DNS" },
    { "from": "rt", "to": "e1", "label": "geo" },
    { "from": "rt", "to": "e2", "label": "failover" },
    { "from": "e1", "to": "a1", "label": "cache miss" },
    { "from": "e2", "to": "a2", "label": "cache miss" },
    { "from": "a1", "to": "c1", "label": "get" },
    { "from": "a2", "to": "c2", "label": "get" },
    { "from": "c1", "to": "db1", "label": "miss" },
    { "from": "c2", "to": "db1", "label": "cross-region" }
  ],
  "annotations": {
    "rt": "Health checks remove failed regions in ~30s",
    "db1": "Async replication keeps EU replica <1s lag"
  }
}
\`\`\`

## Summary of Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| ID generation | Pre-generated keys (no collisions) | Hash-based (simpler, rare collisions) |
| Redirect type | 301 (less load, no analytics) | 302 (analytics, more load) |
| Database | NoSQL key-value (natural fit) | SQL (familiar, consistent) |
| Deduplication | Yes (save storage) | No (simpler, faster writes) |

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Cache aggressively at multiple layers — CDN, Redis, read replicas.",
    "Choose 301 vs 302 based on whether you need click analytics.",
    "NoSQL key-value stores are a natural fit for the simple access pattern of URL shorteners.",
    "Shard by short_code for even distribution across database nodes.",
    "The redirect path must be highly available — it is the critical path that all short URLs depend on."
  ]
}
\`\`\``,
    },
  ],
};
