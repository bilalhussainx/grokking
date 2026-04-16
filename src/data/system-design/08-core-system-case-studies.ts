import { Module } from "../types";

export const coreSystemCaseStudiesModule: Module = {
  id: "core-system-case-studies",
  title: "Case Studies: Core Infrastructure Systems",
  description: "Apply every concept learned so far to design four foundational systems that appear in most large-scale architectures: URL shortener, key-value store, search typeahead, and object storage.",
  lessons: [
    {
      id: "design-url-shortener",
      slug: "design-url-shortener",
      title: "Design a URL Shortener (TinyURL / Bitly)",
      content: `# Design a URL Shortener (TinyURL / Bitly)

You've used them thousands of times — paste a long URL, get back something like \`tinyurl.com/y4abc123\`. But behind that single redirect lies a system that handles **billions of requests per day**, requires sub-10ms response times, and must never lose a mapping once created.

This case study walks you through designing a URL shortener at scale: from the math of ID generation to the exact HTTP status codes that determine whether your analytics work.

---

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "A URL shortener is fundamentally a distributed key-value store with one special property: it is extremely read-heavy. For every 1 write (creating a short link), there are roughly 100 reads (redirecting clicks). Every architectural decision flows from this 100:1 ratio — you optimize the read path relentlessly while keeping writes simple and reliable." }
\`\`\`

---

## Step 1 — Requirements & Scale Estimation

Before drawing any boxes, nail down what you're actually building.

\`\`\`tabs
{ "tabs": [
  { "label": "Functional", "icon": "✅", "content": "**Must have:**\\n\\n- User submits a long URL → receives a unique short URL\\n- Visiting the short URL redirects to the original\\n- Optional: custom alias (e.g. \`bit.ly/my-brand\`)\\n- Optional: expiration date on links\\n- Optional: per-link click analytics\\n\\n**Out of scope (for this design):**\\n- User accounts / authentication\\n- Team-level access control\\n- QR code generation" },
  { "label": "Non-Functional", "icon": "⚡", "content": "**Performance:**\\n- Redirect latency < 10ms (p99)\\n- URL creation latency < 100ms\\n\\n**Scale:**\\n- 100 million URLs stored\\n- 100:1 read-to-write ratio\\n- Peak: ~10,000 redirects/sec\\n\\n**Reliability:**\\n- 99.99% uptime for redirect path\\n- Short codes are **permanent** — never reassigned\\n\\n**Storage:**\\n- Avg long URL ≈ 200 bytes\\n- 100M URLs × 200 bytes ≈ **20 GB** (fits in a single machine, but we replicate for HA)" },
  { "label": "Capacity Math", "icon": "🔢", "content": "\`\`\`\\nWrite QPS: 100M URLs / (365 days × 86400 sec) ≈ 3.2 writes/sec\\nRead QPS:  3.2 × 100 (ratio)              ≈ 320 reads/sec\\nPeak read: ×30 burst multiplier           ≈ 10,000 reads/sec\\n\\nShort code length:\\n  Base62 chars (a-z, A-Z, 0-9) = 62 symbols\\n  6 chars → 62^6 = ~56 billion unique codes  ✓ (overkill for 100M)\\n  7 chars → 62^7 = ~3.5 trillion unique codes\\n\`\`\`\\n\\nA **7-character Base62 code** gives us 3.5 trillion combinations — enough headroom for decades of growth." }
] }
\`\`\`

---

## Step 2 — The API Contract

Two endpoints. That's it.

\`\`\`tabs
{ "tabs": [
  { "label": "Create Short URL", "icon": "📝", "content": "\`\`\`http\\nPOST /urls\\nContent-Type: application/json\\n\\n{\\n  \\"long_url\\": \\"https://example.com/very/long/path?utm=campaign\\",\\n  \\"custom_alias\\": \\"my-launch\\",       // optional\\n  \\"expires_at\\": \\"2026-12-31T00:00Z\\"  // optional\\n}\\n\`\`\`\\n\\n**Response 201 Created:**\\n\`\`\`json\\n{\\n  \\"short_url\\": \\"https://tny.io/aB3xY7z\\",\\n  \\"short_code\\": \\"aB3xY7z\\",\\n  \\"expires_at\\": \\"2026-12-31T00:00Z\\"\\n}\\n\`\`\`" },
  { "label": "Redirect", "icon": "↪️", "content": "\`\`\`http\\nGET /aB3xY7z\\n\`\`\`\\n\\n**Response 302 Found:**\\n\`\`\`http\\nHTTP/1.1 302 Found\\nLocation: https://example.com/very/long/path?utm=campaign\\n\`\`\`\\n\\nWhy 302 and not 301? We'll cover this in the deep dive — it's one of the most common interview gotchas." }
] }
\`\`\`

---

## Step 3 — High-Level Architecture

\`\`\`sysdiag
{ "title": "URL Shortener — High Level Architecture", "width": 700, "height": 420,
  "nodes": [
    { "id": "client", "label": "Client\\n(Browser)", "x": 60, "y": 200, "kind": "client" },
    { "id": "lb", "label": "Load\\nBalancer", "x": 190, "y": 200, "kind": "service" },
    { "id": "write_api", "label": "Write\\nService", "x": 340, "y": 100, "kind": "service" },
    { "id": "read_api", "label": "Read\\nService", "x": 340, "y": 300, "kind": "service" },
    { "id": "id_gen", "label": "ID\\nGenerator", "x": 490, "y": 100, "kind": "service" },
    { "id": "cache", "label": "Redis\\nCache", "x": 490, "y": 300, "kind": "cache" },
    { "id": "db", "label": "NoSQL DB\\n(DynamoDB)", "x": 620, "y": 200, "kind": "database" },
    { "id": "analytics", "label": "Analytics\\n(Kafka)", "x": 490, "y": 420, "kind": "queue" }
  ],
  "edges": [
    { "from": "client", "to": "lb", "label": "request" },
    { "from": "lb", "to": "write_api", "label": "POST /urls" },
    { "from": "lb", "to": "read_api", "label": "GET /:code" },
    { "from": "write_api", "to": "id_gen", "label": "get ID" },
    { "from": "write_api", "to": "db", "label": "write" },
    { "from": "read_api", "to": "cache", "label": "lookup" },
    { "from": "cache", "to": "db", "label": "cache miss" },
    { "from": "read_api", "to": "analytics", "label": "fire & forget" }
  ],
  "annotations": {
    "write_api": "Handles URL creation. Calls ID generator, stores mapping, returns short code. Separated from read service to scale independently.",
    "read_api": "Handles all redirects. Cache-aside pattern: check Redis first, fall back to DB on miss. 95%+ of traffic lands here.",
    "id_gen": "Generates globally unique numeric IDs, encoded to Base62. Either a distributed counter (Redis INCR) or a Snowflake-style generator.",
    "cache": "Stores hot short_code → long_url mappings. LRU eviction. 80/20 rule: top 20% of links drive 80% of clicks.",
    "db": "Single source of truth. DynamoDB with short_code as partition key gives O(1) lookups. No joins needed.",
    "analytics": "Click events published to Kafka asynchronously. Decouples analytics from the critical redirect path — a slow analytics pipeline never delays a redirect."
  }
}
\`\`\`

---

## Step 4 — Short Code Generation (The Core Algorithm)

Generating a **unique, compact, URL-safe** code is the heart of the system. There are three main approaches.

\`\`\`tabs
{ "tabs": [
  { "label": "Approach 1: Hash + Base62", "icon": "🔐", "content": "**How it works:**\\n1. Compute \`MD5(long_url)\` → 128-bit hash\\n2. Take first 43 bits → encode as 7 Base62 characters\\n\\n\`\`\`python\\nimport hashlib, string\\n\\nBASE62 = string.ascii_letters + string.digits  # 62 chars\\n\\ndef base62_encode(num):\\n    result = []\\n    while num > 0:\\n        result.append(BASE62[num % 62])\\n        num //= 62\\n    return ''.join(reversed(result)).zfill(7)\\n\\ndef shorten_hash(long_url):\\n    hash_bytes = hashlib.md5(long_url.encode()).digest()\\n    num = int.from_bytes(hash_bytes[:6], 'big')  # 48 bits\\n    return base62_encode(num)\\n\`\`\`\\n\\n**Pros:** Deterministic (same URL → same code), no central state\\n\\n**Cons:** Hash collisions (two different URLs → same code). You must check the DB and retry with a salt.\\n\\n**Collision probability:** With 7 Base62 chars = 3.5T codes and 100M URLs, the birthday paradox gives ~0.001% collision chance — manageable with retry logic." },
  { "label": "Approach 2: Counter + Base62 ⭐", "icon": "📈", "content": "**How it works:**\\n1. Maintain a global auto-incrementing counter (Redis \`INCR\` or a DB sequence)\\n2. Encode the integer to Base62\\n\\n\`\`\`python\\nBASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'\\n\\ndef base62_encode(num, length=7):\\n    result = []\\n    while num > 0:\\n        result.append(BASE62[num % 62])\\n        num //= 62\\n    # Pad to desired length\\n    while len(result) < length:\\n        result.append(BASE62[0])\\n    return ''.join(reversed(result))\\n\\n# Counter starts at 1\\n# ID 1 → 'aaaaaab'\\n# ID 3521614606208 → 'ZZZZZZZ' (max 7-char code)\\n\`\`\`\\n\\n**Pros:** No collisions, simple, predictable\\n\\n**Cons:** Sequential IDs are guessable. Counter is a bottleneck/SPOF — solved with sharded counters or Snowflake IDs.\\n\\n**Best for:** Most production URL shorteners use this approach." },
  { "label": "Approach 3: Snowflake ID", "icon": "❄️", "content": "**How it works:**\\nGenerate a 64-bit ID composed of:\\n- 41 bits: millisecond timestamp (gives 69 years of uniqueness)\\n- 10 bits: machine/datacenter ID  \\n- 12 bits: sequence per machine per ms\\n\\n\`\`\`\\n| 41 bits timestamp | 10 bits machine | 12 bits seq |\\n\`\`\`\\n\\nEncode the 64-bit integer to Base62 → 8-10 character code.\\n\\n**Pros:** No central coordinator needed, globally unique, time-sortable\\n\\n**Cons:** Codes are slightly longer (8+ chars vs 7), machines must have synchronized clocks (NTP drift is a real concern)\\n\\n**Used by:** Twitter (tweets), Discord (message IDs), Instagram (photo IDs)" }
] }
\`\`\`

\`\`\`playground
{ "title": "Base62 Encoding — See It In Action", "language": "python", "code": "import string\\n\\nBASE62 = string.ascii_lowercase + string.ascii_uppercase + string.digits\\n# 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'\\n\\ndef base62_encode(num, min_length=7):\\n    \\"\\"\\"Encode a positive integer to Base62 string.\\"\\"\\"\\n    if num == 0:\\n        return BASE62[0] * min_length\\n    result = []\\n    while num > 0:\\n        result.append(BASE62[num % 62])\\n        num //= 62\\n    encoded = ''.join(reversed(result))\\n    return encoded.zfill(min_length)\\n\\ndef base62_decode(s):\\n    \\"\\"\\"Decode a Base62 string back to integer.\\"\\"\\"\\n    result = 0\\n    for char in s:\\n        result = result * 62 + BASE62.index(char)\\n    return result\\n\\n# Simulate a counter-based ID generator\\nfor counter_id in [1, 100, 1000, 1_000_000, 3_521_614_606_207]:\\n    code = base62_encode(counter_id)\\n    decoded_back = base62_decode(code)\\n    print(f\\"ID {counter_id:>20,} -> '{code}' -> decoded: {decoded_back:,}\\")\\n\\nprint()\\nprint(f\\"Max 7-char Base62 code = {62**7 - 1:,} IDs\\")\\nprint(f\\"That's {62**7 / 100_000_000:.0f}x our 100M URL target\\")\\n", "runnable": true }
\`\`\`

---

## Step 5 — The Algorithm, Step by Step

\`\`\`steps
{ "title": "Creating a Short URL", "steps": [
  { "title": "Receive & Validate", "content": "Client sends \`POST /urls\` with \`long_url\`. The write service:\\n1. Validates the URL is well-formed\\n2. Normalizes it: lowercase hostname, strip trailing slash, sort query params\\n3. **Check for duplicates** (optional): if same user submits the same URL, return the existing code\\n\\nNormalization ensures \`HTTP://Example.COM/path\` and \`http://example.com/path\` map to the same short code." },
  { "title": "Generate Unique ID", "content": "Call the ID generator service:\\n\\n\`\`\`python\\n# Redis-backed counter (simple approach)\\nid = redis.incr('url_counter')  # Atomic, returns 1, 2, 3...\\nshort_code = base62_encode(id)  # '0000001', '0000002'...\\n\`\`\`\\n\\nFor distributed systems, use a **Snowflake-style generator** on each write server — no coordination needed between servers." },
  { "title": "Persist to Database", "content": "Write to NoSQL (DynamoDB/Cassandra) with short_code as the partition key:\\n\\n\`\`\`json\\n{\\n  \\"short_code\\": \\"aB3xY7z\\",\\n  \\"long_url\\": \\"https://example.com/very/long/path\\",\\n  \\"created_at\\": \\"2026-04-15T10:00:00Z\\",\\n  \\"expires_at\\": \\"2026-12-31T00:00:00Z\\",\\n  \\"user_id\\": \\"usr_123\\",\\n  \\"click_count\\": 0\\n}\\n\`\`\`\\n\\nWhy NoSQL? The access pattern is pure key-value (\`short_code\` → \`long_url\`). No joins, no transactions needed. DynamoDB gives O(1) reads at any scale." },
  { "title": "Return Short URL", "content": "Return \`201 Created\` with the short URL:\\n\\n\`\`\`json\\n{ \\"short_url\\": \\"https://tny.io/aB3xY7z\\" }\\n\`\`\`\\n\\nThe mapping is now durable. It will never be reassigned to a different long URL — even after expiration." }
] }
\`\`\`

\`\`\`algoviz
{ "title": "Redirect Flow — Cache-Aside Pattern", "type": "array",
  "data": ["aB3xY7z", "CACHE?", "DB?", "302 →"],
  "frames": [
    { "highlight": [0], "label": "Client hits GET /aB3xY7z — short code extracted from path", "stats": { "step": 1 } },
    { "highlight": [1], "label": "Check Redis cache for key 'aB3xY7z'", "stats": { "step": 2, "cache_hit": false } },
    { "highlight": [2], "label": "Cache MISS — query DynamoDB (GetItem on short_code partition key)", "stats": { "step": 3, "db_latency_ms": 5 } },
    { "highlight": [1, 2], "label": "Write result back to Redis with TTL=24h (cache-aside pattern)", "stats": { "step": 4, "cache_hit": true } },
    { "highlight": [3], "label": "Return HTTP 302 to client — total latency ~6ms", "stats": { "step": 5, "total_ms": 6 } },
    { "highlight": [0, 1], "label": "Next click on same code: cache HIT → Redis only, ~1ms", "stats": { "step": 6, "cache_hit": true, "total_ms": 1 } }
  ],
  "speed": 900 }
\`\`\`

---

## Step 6 — 301 vs 302 Redirects (The Analytics Trap)

\`\`\`concept
{ "title": "301 vs 302: The Most Important Interview Question", "variant": "rule", "content": "Use **301 (Permanent)** if you want browsers to cache the redirect — the client never calls your server again for that code. Use **302 (Temporary/Found)** if you need to track every click — the browser always asks your server, giving you accurate analytics. Most URL shorteners use 302 because analytics matter more than saving a round trip." }
\`\`\`

\`\`\`tabs
{ "tabs": [
  { "label": "301 Permanent", "icon": "🔒", "content": "\`\`\`http\\nHTTP/1.1 301 Moved Permanently\\nLocation: https://original-url.com\\nCache-Control: max-age=31536000\\n\`\`\`\\n\\n**Browser behavior:** Caches this redirect indefinitely. On subsequent clicks, the browser goes **directly** to the long URL, never touching your servers.\\n\\n**Pros:**\\n- Reduces server load (no repeat traffic for the same link)\\n- Lower latency for repeat visitors\\n\\n**Cons:**\\n- You cannot count clicks — analytics are blind after the first visit\\n- You cannot update or disable the link (browser cache ignores you)\\n- Expiration becomes impossible to enforce\\n\\n**When to use:** Internal redirect infrastructure where you control the clients and analytics don't matter." },
  { "label": "302 Temporary ⭐", "icon": "🔄", "content": "\`\`\`http\\nHTTP/1.1 302 Found\\nLocation: https://original-url.com\\n\`\`\`\\n\\n**Browser behavior:** Does **not** cache. Every click goes through your server first.\\n\\n**Pros:**\\n- Every click is logged — accurate analytics\\n- You can change the destination URL any time\\n- You can expire or disable links\\n- A/B testing becomes possible (randomize destination per click)\\n\\n**Cons:**\\n- Every click adds a round trip (~10-50ms)\\n- Higher server load\\n\\n**When to use:** TinyURL, Bitly, any URL shortener that cares about analytics." },
  { "label": "307 Strict", "icon": "📋", "content": "\`\`\`http\\nHTTP/1.1 307 Temporary Redirect\\nLocation: https://original-url.com\\n\`\`\`\\n\\n**Same as 302, but with one critical difference:** The browser **must** use the same HTTP method on the redirect. A \`POST\` to \`/aB3xY7z\` stays a \`POST\` to the long URL — it won't silently become a \`GET\`.\\n\\n**When to use:** API endpoints that accept POST requests via short links (rare, but important to know for interviews).\\n\\n**308** is to 307 as 301 is to 302 — permanent + method-preserving." }
] }
\`\`\`

---

## Step 7 — Caching Strategy

With a 100:1 read/write ratio, caching is mandatory — not optional.

\`\`\`concept
{ "title": "The 80/20 Rule of URL Clicks", "variant": "insight", "content": "In practice, 20% of short URLs receive 80% of all traffic. A cache holding only 20% of your 100M URLs (20M entries × ~300 bytes = ~6GB) eliminates 80% of database reads. A single Redis node with 8GB RAM handles this comfortably — and Redis can do 100,000+ reads per second." }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Cache Eviction Strategy", "content": "Use **LRU (Least Recently Used)** eviction for URL caches. URLs tend to spike in traffic right after sharing (a tweet, a campaign launch) then go cold. LRU naturally keeps recently-clicked links warm and evicts forgotten ones.\\n\\nSet TTL = 24-48 hours. Combined with LRU, this prevents stale entries from accumulating." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Cache Invalidation on Update/Deletion", "content": "If you allow users to update destination URLs or delete short links, you **must** invalidate the cache on every write:\\n\\n\`\`\`python\\ndef delete_url(short_code):\\n    db.delete(short_code)\\n    redis.delete(f'url:{short_code}')  # Must happen BEFORE or AFTER write, not never\\n\`\`\`\\n\\nOtherwise deleted/updated links will still redirect for up to 24h (the TTL). A write-through pattern handles this automatically." }
\`\`\`

---

## Step 8 — Analytics Tracking

The naive approach — updating a click counter on every redirect — is a write to the database on every read. At 10,000 reads/sec, this kills your DB.

\`\`\`compare
{ "variant": "before-after",
  "before": { "label": "Naive: DB write on every click", "code": "def redirect(short_code):\\n    row = db.get(short_code)\\n    if not row:\\n        return 404\\n    \\n    # PROBLEM: synchronous DB write on every redirect\\n    # Blocks the redirect, kills DB at scale\\n    db.increment(short_code, 'click_count')\\n    \\n    return redirect_302(row.long_url)" },
  "after": { "label": "Production: Async Kafka + batch aggregation", "code": "def redirect(short_code):\\n    row = cache.get(short_code) or db.get(short_code)\\n    if not row:\\n        return 404\\n    \\n    # Fire-and-forget: non-blocking, never delays redirect\\n    kafka.produce('click-events', {\\n        'short_code': short_code,\\n        'timestamp': now(),\\n        'user_agent': request.headers['User-Agent'],\\n        'ip_hash': sha256(request.ip)  # Privacy: hash, don't store raw IP\\n    })\\n    \\n    return redirect_302(row.long_url)\\n\\n# Separate analytics consumer (runs independently)\\ndef analytics_consumer():\\n    for batch in kafka.consume('click-events', batch_size=1000):\\n        db.bulk_increment_clicks(batch)  # 1 write per 1000 events" }
}
\`\`\`

The Kafka pipeline decouples analytics from the redirect path completely. A slow analytics pipeline (backpressure, consumer lag) **never** impacts redirect latency.

---

## Step 9 — Link Expiration

Two complementary strategies work together to handle expiration efficiently.

\`\`\`tabs
{ "tabs": [
  { "label": "Passive Expiry", "icon": "😴", "content": "Check \`expires_at\` at redirect time:\\n\\n\`\`\`python\\ndef redirect(short_code):\\n    row = db.get(short_code)\\n    if not row:\\n        return 404\\n    \\n    if row.expires_at and row.expires_at < now():\\n        return 410  # Gone (not 404 — it existed, now expired)\\n    \\n    return redirect_302(row.long_url)\\n\`\`\`\\n\\n**Pros:** Simple, zero background infrastructure\\n\\n**Cons:** Expired rows accumulate in the DB forever, wasting storage and slowing scans" },
  { "label": "Active Cleanup", "icon": "🧹", "content": "A background job runs periodically to purge expired rows:\\n\\n\`\`\`python\\n# Cron job: runs every night at 3 AM\\ndef cleanup_expired_urls():\\n    # DynamoDB TTL does this automatically!\\n    # For SQL DBs:\\n    deleted = db.execute(\\"\\"\\"\\n        DELETE FROM urls \\n        WHERE expires_at < NOW() - INTERVAL '7 days'\\n        LIMIT 10000  -- batch to avoid lock storms\\n    \\"\\"\\")\\n    metrics.record('urls_purged', deleted)\\n\`\`\`\\n\\n**Note:** Add a 7-day grace period before actual deletion — allows auditing and accidental-deletion recovery.\\n\\n**DynamoDB shortcut:** Set \`expires_at\` as a TTL attribute and DynamoDB handles deletion automatically, for free." },
  { "label": "Hybrid (Best)", "icon": "⭐", "content": "Use **both** approaches together:\\n\\n1. **Passive check** at redirect time: instant UX, no expired links ever work\\n2. **Active cleanup** nightly: keep the DB lean, reclaim storage\\n3. **Redis TTL** mirrors \`expires_at\` so the cache auto-expires too:\\n\\n\`\`\`python\\ndef create_url(short_code, long_url, expires_at):\\n    db.insert(short_code, long_url, expires_at)\\n    \\n    if expires_at:\\n        ttl_seconds = (expires_at - now()).total_seconds()\\n        redis.setex(f'url:{short_code}', int(ttl_seconds), long_url)\\n    else:\\n        redis.set(f'url:{short_code}', long_url, ex=86400)  # 24h default\\n\`\`\`\\n\\nThis way the cache naturally aligns with link expiration — no stale expired entries in Redis." }
] }
\`\`\`

---

## Practice: Fill in the Algorithm

\`\`\`fillblank
{ "title": "Complete the Base62 Encoder", "prompt": "Fill in the blanks to implement a correct Base62 encoder. This function converts a positive integer to a 7-character short code.", "language": "python",
  "template": "BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'\\n\\ndef encode(num, length=7):\\n    result = []\\n    while num > ___:\\n        result.append(BASE62[num % ___])\\n        num //= 62\\n    return ''.join(reversed(result)).zfill(___)  # pad to fixed length",
  "blanks": [
    { "answer": "0", "hint": "The loop runs while num is greater than this value" },
    { "answer": "62", "hint": "Base62 has exactly this many characters in its alphabet" },
    { "answer": "length", "hint": "Pad to this target number of characters" }
  ]
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "URL Shortener Design", "questions": [
  {
    "question": "You are building a URL shortener that must support click analytics. Which HTTP status code should redirects return?",
    "options": ["301 Moved Permanently", "302 Found", "304 Not Modified", "307 Temporary Redirect"],
    "answer": 1,
    "explanation": "302 Found is correct. Browsers cache 301 responses, so subsequent clicks bypass your server entirely — you never see them in your analytics. With 302, every click goes through your server, enabling accurate count tracking. The 1-2ms extra latency is a worthwhile trade for analytics."
  },
  {
    "question": "Your URL shortener handles 10,000 redirects/sec. The analytics team wants per-click data. What is the best way to record click events without impacting redirect latency?",
    "options": [
      "Increment a counter in MySQL on every redirect",
      "Write to a Redis counter synchronously before redirecting",
      "Publish a fire-and-forget event to Kafka and handle analytics in a separate consumer",
      "Batch 100 clicks in memory and flush to DB every 10 seconds in the web server"
    ],
    "answer": 2,
    "explanation": "Kafka (fire-and-forget) is the production pattern. It decouples the analytics write path from the redirect critical path. Even if the analytics pipeline is slow or down, redirects continue unaffected. Synchronous DB/Redis writes block the response thread and fail together if the analytics DB is unhealthy. In-memory batching loses data on crashes."
  },
  {
    "question": "With 100M stored URLs and a 100:1 read-to-write ratio, what database type is most appropriate for the primary URL store?",
    "options": [
      "PostgreSQL with a B-tree index on short_code",
      "A NoSQL key-value store like DynamoDB",
      "Redis as the primary database (no separate DB)",
      "Elasticsearch for full-text URL search"
    ],
    "answer": 1,
    "explanation": "A NoSQL key-value store (DynamoDB, Cassandra) is ideal. The access pattern is pure point lookup: short_code → long_url. No joins, no aggregations, no full-text search needed. DynamoDB's partition key is short_code, giving O(1) reads at any scale. PostgreSQL works but requires manual sharding at 100M+ rows. Redis alone is risky — it's in-memory and requires careful persistence configuration."
  },
  {
    "question": "A 7-character Base62 code gives how many unique possible values?",
    "options": ["About 56 billion", "About 3.5 trillion", "About 62 million", "About 13 billion"],
    "answer": 1,
    "explanation": "62^7 = 3,521,614,606,208 ≈ 3.5 trillion. This is far more than our 100M URL target — we have 35,000x headroom. A 6-character code gives 62^6 ≈ 56 billion (still plenty), but 7 characters is the common choice for safety margin."
  },
  {
    "question": "Which expiration strategy should a production URL shortener use?",
    "options": [
      "Only passive check at redirect time — simple and sufficient",
      "Only nightly active cleanup — batch efficiency matters",
      "Both passive check at redirect time AND nightly active cleanup",
      "Set DB row TTL and rely entirely on the database engine"
    ],
    "answer": 2,
    "explanation": "The hybrid approach is best. Passive check ensures expired links never redirect (instant UX). Active nightly cleanup reclaims DB storage so expired rows don't accumulate indefinitely. DynamoDB TTL can replace the active cleanup job, but you still need the passive check for immediate expiry enforcement."
  }
] }
\`\`\`

---

## The Complete Picture

\`\`\`collapse
{ "title": "Deep Dive: Handling Custom Aliases", "content": "When a user requests a custom alias (e.g. \`bit.ly/my-brand\`), two problems arise:\\n\\n**1. Collision with auto-generated codes**\\nSolution: maintain a **reserved namespace**. All auto-generated codes are 7+ characters. Custom aliases are 1-6 characters (or use a distinct prefix like \`c_\`). This prevents any auto-generated code from ever matching a custom alias.\\n\\n**2. Uniqueness enforcement**\\nCustom aliases are user-defined strings — you must check uniqueness before writing:\\n\\n\`\`\`python\\ndef create_custom_url(alias, long_url, user_id):\\n    # Atomic check-and-insert using conditional writes\\n    # DynamoDB: PutItem with ConditionExpression='attribute_not_exists(short_code)'\\n    try:\\n        db.put_item(\\n            Item={'short_code': alias, 'long_url': long_url, 'user_id': user_id},\\n            ConditionExpression='attribute_not_exists(short_code)'\\n        )\\n    except db.ConditionalCheckFailedException:\\n        raise AliasAlreadyTakenError(alias)\\n\`\`\`\\n\\nThe conditional write is **atomic** — no race condition between checking and writing." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Multi-Region Deployment", "content": "For 99.99% uptime, deploy across 3+ AWS regions:\\n\\n\`\`\`\\nUS-EAST-1 (primary write region)\\n  ├── DynamoDB Global Table (primary)\\n  └── Redis cluster\\n\\nEU-WEST-1 (read replica region)\\n  ├── DynamoDB Global Table (replica, ~1s lag)\\n  └── Redis cluster\\n\\nAP-SOUTHEAST-1 (read replica region)\\n  ├── DynamoDB Global Table (replica)\\n  └── Redis cluster\\n\`\`\`\\n\\n**Key insight:** Reads (redirects) can tolerate **eventual consistency** — a link created in US-EAST will appear in AP-SOUTHEAST within ~1 second. This is acceptable because:\\n1. Users share links THEN click them — there's inherently a delay\\n2. 99.9% of traffic is to links created >1 second ago\\n\\nWrites go to a single primary region to avoid conflicts, then replicate async. DynamoDB Global Tables handle all of this automatically." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "A URL shortener is a read-heavy system (100:1 ratio) — optimize every layer for the read path: cache-aside in Redis, NoSQL with partition key on short_code, read-replica regions",
  "Use 302 (not 301) for redirects when analytics matter — 301s are cached by browsers, making click tracking impossible",
  "Counter + Base62 encoding is the production-grade ID generation strategy: no collisions, simple, and 7 Base62 characters gives 3.5 trillion unique codes",
  "Decouple analytics from redirects with fire-and-forget Kafka publishing — a slow analytics pipeline must never delay a redirect",
  "Use a hybrid expiration strategy: passive check at redirect time (instant enforcement) + nightly active cleanup (storage reclamation)",
  "DynamoDB is the natural fit: pure key-value access pattern, O(1) reads at any scale, built-in TTL for expiration, Global Tables for multi-region"
] }
\`\`\``,
      starterCode: `import hashlib
import time
from typing import Optional

# In-memory storage (simulates a database)
url_store: dict[str, dict] = {}  # short_code -> {long_url, created_at, expires_at, hits}
reverse_store: dict[str, str] = {}  # long_url -> short_code

def generate_short_code(long_url: str, length: int = 7) -> str:
    """
    TODO: Generate a short code for the given URL.
    - Use MD5 or SHA-256 to hash the URL
    - Return only the first \`length\` characters of the hex digest
    """
    pass

def shorten_url(long_url: str, ttl_seconds: Optional[int] = None) -> str:
    """
    TODO: Shorten a URL and store it.
    - If the URL was already shortened, return the existing short code
    - Generate a short code using generate_short_code()
    - Handle collisions: if the code is taken by a DIFFERENT URL, append
      a numeric suffix and retry (e.g. add '1', '2', ... to the input before hashing)
    - Store: short_code -> {long_url, created_at, expires_at (or None), hits: 0}
    - Return the short code
    """
    pass

def redirect(short_code: str) -> tuple[Optional[str], int]:
    """
    TODO: Look up a short code and return (long_url, http_status).
    - If not found, return (None, 404)
    - If expired, return (None, 410)   # 410 Gone
    - Increment the hit counter for analytics
    - Return (long_url, 302)  # 302 = temporary redirect (preserves analytics)
    """
    pass

def get_analytics(short_code: str) -> Optional[dict]:
    """
    TODO: Return analytics for a short code.
    - Return None if not found
    - Return a dict with: short_code, long_url, hits, created_at, expires_at
    """
    pass

# --- Tests (do not modify) ---
if __name__ == "__main__":
    # Test 1: basic shortening
    code = shorten_url("https://example.com/very/long/path")
    assert len(code) == 7, "Short code should be 7 chars"
    print(f"Test 1 passed: {code}")

    # Test 2: idempotent — same URL returns same code
    code2 = shorten_url("https://example.com/very/long/path")
    assert code == code2, "Same URL must return same short code"
    print("Test 2 passed: idempotent")

    # Test 3: redirect works
    long_url, status = redirect(code)
    assert status == 302
    assert long_url == "https://example.com/very/long/path"
    print("Test 3 passed: redirect 302")

    # Test 4: analytics hit counter
    redirect(code)
    analytics = get_analytics(code)
    assert analytics["hits"] == 2, f"Expected 2 hits, got {analytics['hits']}"
    print("Test 4 passed: analytics")

    # Test 5: expiration
    exp_code = shorten_url("https://expires.com", ttl_seconds=1)
    time.sleep(1.1)
    _, status = redirect(exp_code)
    assert status == 410, "Expired URL should return 410"
    print("Test 5 passed: expiration 410")

    # Test 6: 404 for unknown code
    _, status = redirect("unknown")
    assert status == 404
    print("Test 6 passed: 404")

    print("\\nAll tests passed!")
`,
      solutionCode: `import hashlib
import time
from typing import Optional

# In-memory storage (simulates a database)
url_store: dict[str, dict] = {}  # short_code -> {long_url, created_at, expires_at, hits}
reverse_store: dict[str, str] = {}  # long_url -> short_code

def generate_short_code(long_url: str, length: int = 7) -> str:
    """
    Hash the URL with MD5 and take the first \`length\` hex characters.
    MD5 produces 32 hex chars; 7 chars = 16^7 = ~268M combinations,
    enough headroom for 100M URLs before collision probability rises.
    """
    return hashlib.md5(long_url.encode()).hexdigest()[:length]

def shorten_url(long_url: str, ttl_seconds: Optional[int] = None) -> str:
    """
    Shorten a URL with idempotency and collision handling.

    Collision strategy: if the 7-char prefix is already taken by a
    *different* URL, we re-hash a slightly modified input (append a
    counter) until we find a free slot. This is O(1) in practice
    because collisions are rare at 7 chars for 100M entries.
    """
    # Idempotency: return existing code for the same URL
    if long_url in reverse_store:
        return reverse_store[long_url]

    # Generate code and resolve collisions
    attempt = 0
    while True:
        candidate_input = long_url if attempt == 0 else f"{long_url}{attempt}"
        code = generate_short_code(candidate_input)

        if code not in url_store:
            # Slot is free — claim it
            break
        if url_store[code]["long_url"] == long_url:
            # Same URL somehow missed the reverse_store check; safe to reuse
            break
        # Collision with a different URL — try next suffix
        attempt += 1

    expires_at = (time.time() + ttl_seconds) if ttl_seconds else None

    url_store[code] = {
        "long_url": long_url,
        "created_at": time.time(),
        "expires_at": expires_at,
        "hits": 0,
    }
    reverse_store[long_url] = code
    return code

def redirect(short_code: str) -> tuple[Optional[str], int]:
    """
    Resolve a short code to a long URL.

    HTTP status choice:
      302 (Temporary Redirect) — browser does NOT cache the redirect,
        so every click is tracked. Use this when analytics matter.
      301 (Permanent Redirect) — browser caches it; faster for users
        but subsequent clicks bypass your server entirely, breaking
        analytics and preventing expiration enforcement.
    We return 302 for analytics correctness.
    """
    if short_code not in url_store:
        return None, 404

    record = url_store[short_code]

    # Check expiration
    if record["expires_at"] and time.time() > record["expires_at"]:
        return None, 410  # 410 Gone — semantically clearer than 404 for expired content

    # Increment hit counter for analytics
    record["hits"] += 1

    return record["long_url"], 302

def get_analytics(short_code: str) -> Optional[dict]:
    """Return usage stats for a short code."""
    if short_code not in url_store:
        return None

    r = url_store[short_code]
    return {
        "short_code": short_code,
        "long_url": r["long_url"],
        "hits": r["hits"],
        "created_at": r["created_at"],
        "expires_at": r["expires_at"],
    }

# --- Tests (do not modify) ---
if __name__ == "__main__":
    # Test 1: basic shortening
    code = shorten_url("https://example.com/very/long/path")
    assert len(code) == 7, "Short code should be 7 chars"
    print(f"Test 1 passed: {code}")

    # Test 2: idempotent — same URL returns same code
    code2 = shorten_url("https://example.com/very/long/path")
    assert code == code2, "Same URL must return same short code"
    print("Test 2 passed: idempotent")

    # Test 3: redirect works
    long_url, status = redirect(code)
    assert status == 302
    assert long_url == "https://example.com/very/long/path"
    print("Test 3 passed: redirect 302")

    # Test 4: analytics hit counter
    redirect(code)
    analytics = get_analytics(code)
    assert analytics["hits"] == 2, f"Expected 2 hits, got {analytics['hits']}"
    print("Test 4 passed: analytics")

    # Test 5: expiration
    exp_code = shorten_url("https://expires.com", ttl_seconds=1)
    time.sleep(1.1)
    _, status = redirect(exp_code)
    assert status == 410, "Expired URL should return 410"
    print("Test 5 passed: expiration 410")

    # Test 6: 404 for unknown code
    _, status = redirect("unknown")
    assert status == 404
    print("Test 6 passed: 404")

    print("\\nAll tests passed!")
`,
    },
    {
      id: "design-key-value-store",
      slug: "design-key-value-store",
      title: "Design a Distributed Key-Value Store",
      content: `# Design a Distributed Key-Value Store

Amazon DynamoDB serves millions of requests per second across global regions. Redis powers real-time leaderboards at companies like GitHub. At their core, both are key-value stores — one of the most fundamental building blocks in distributed systems. In this lesson, you will design one from scratch: a production-grade, DynamoDB-style distributed KV store that handles node failures gracefully, resolves concurrent writes correctly, and lets you tune consistency versus availability to match your workload.

By the end, you will be able to explain — and defend — every architectural decision in a system design interview.

---

## What Are We Building?

A **key-value store** is conceptually a giant hash table: you give it a key, it gives you a value. The complexity emerges when that table must span hundreds of nodes, survive machine failures, and serve millions of operations per second.

\`\`\`concept
{ "title": "Key-Value Store Mental Model", "variant": "mental-model", "content": "Think of a distributed KV store as a telephone directory for the entire internet — except instead of one book, the directory is split across hundreds of servers worldwide. Each server owns a section of the alphabet. When you call to look up a number, a coordinator instantly knows which server holds that section and routes you there. If a server goes down, the same pages exist on two backup servers. The challenge: keeping all three copies consistent when multiple people try to update the same entry simultaneously." }
\`\`\`

### Functional Requirements

| Operation | Description | Target Latency |
|-----------|-------------|----------------|
| \`put(key, value)\` | Write or update a key | < 10ms (p99) |
| \`get(key)\` | Read value by key | < 5ms (p99) |
| \`delete(key)\` | Remove a key | < 10ms (p99) |

**Non-functional targets:** 99.99% availability, horizontal scalability to petabytes, tunable consistency, and tolerance to multi-node failures.

---

## The Fundamental Trade-Off: CAP Theorem

Before designing anything, anchor your decisions in theory.

\`\`\`callout
{ "type": "info", "title": "CAP Theorem", "content": "A distributed system can guarantee at most **two** of three properties simultaneously:\\n\\n- **C**onsistency — every read returns the most recent write\\n- **A**vailability — every request receives a non-error response\\n- **P**artition Tolerance — the system continues operating despite network splits\\n\\nSince network partitions are unavoidable in real systems, you always choose between **CP** (strong consistency, may refuse requests during partitions) and **AP** (always responds, may return stale data). DynamoDB defaults to AP with tunable consistency." }
\`\`\`

---

## High-Level Architecture

\`\`\`sysdiag
{ "title": "Distributed Key-Value Store Architecture", "width": 760, "height": 340, "nodes": [ { "id": "client", "label": "Client", "x": 70, "y": 170, "kind": "client" }, { "id": "coord", "label": "Coordinator\\nNode", "x": 250, "y": 170, "kind": "service" }, { "id": "ring", "label": "Consistent\\nHash Ring", "x": 250, "y": 290, "kind": "service" }, { "id": "nodeA", "label": "Node A\\n(Replica 1)", "x": 510, "y": 70, "kind": "service" }, { "id": "nodeB", "label": "Node B\\n(Replica 2)", "x": 510, "y": 170, "kind": "service" }, { "id": "nodeC", "label": "Node C\\n(Replica 3)", "x": 510, "y": 290, "kind": "service" }, { "id": "lsm", "label": "LSM-Tree\\nStorage", "x": 680, "y": 170, "kind": "database" } ], "edges": [ { "from": "client", "to": "coord", "label": "PUT/GET" }, { "from": "coord", "to": "ring", "label": "hash(key)" }, { "from": "coord", "to": "nodeA", "label": "replicate" }, { "from": "coord", "to": "nodeB", "label": "replicate" }, { "from": "coord", "to": "nodeC", "label": "replicate" }, { "from": "nodeA", "to": "nodeB", "label": "gossip" }, { "from": "nodeB", "to": "nodeC", "label": "gossip" }, { "from": "nodeB", "to": "lsm", "label": "persist" } ], "annotations": { "coord": "Any node can act as coordinator. It uses the consistent hash ring to determine which N nodes own the key, then fans out requests to them.", "ring": "Maps each key to a position on a virtual ring. The coordinator walks clockwise to find the responsible node — no central directory needed.", "nodeA": "Each replica independently stores its portion of the keyspace using an LSM-tree. Replicas gossip health status to each other.", "lsm": "Log-Structured Merge-tree. Converts random writes to sequential disk writes for 10–100x higher write throughput." } }
\`\`\`

---

## Mechanism 1: Consistent Hashing

The first question: **which node stores which keys?**

Naive modulo hashing (\`hash(key) % N\`) is catastrophic: add one server and nearly every key remaps to a different node. Consistent hashing solves this by placing both nodes and keys on a circular ring. A key belongs to the first node clockwise from its hash position.

\`\`\`concept
{ "title": "Consistent Hashing Analogy", "variant": "analogy", "content": "Imagine a clock face where the hour positions (1–12) are storage nodes. When a key arrives, you hash it to a clock position (e.g., 4:30). You then walk clockwise until you hit the next hour marker — that node owns the key. Add a new node at 6 o'clock? Only keys between 5 and 6 move. Remove 9 o'clock? Its keys shift to 10. Most keys are completely unaffected." }
\`\`\`

\`\`\`algoviz
{ "title": "Consistent Hash Ring — Key Routing (8 positions)", "type": "array", "data": ["N1", "·", "·", "N2", "·", "·", "N3", "·"], "frames": [ { "highlight": [], "label": "Hash ring with 8 virtual positions (0–7). Positions represent hash space from 0 to MAX_HASH.", "stats": { "nodes": 0, "keys_assigned": 0 } }, { "highlight": [0], "label": "N1 joins: hash(N1) maps to position 0. It owns keys in the arc that ends at position 0.", "stats": { "nodes": 1, "N1": "pos 0" } }, { "highlight": [3], "label": "N2 joins at position 3. It now owns the arc from position 1 to 3 — keys previously owned by N1.", "stats": { "nodes": 2, "N2": "pos 3" } }, { "highlight": [6], "label": "N3 joins at position 6. Owns arc positions 4–6. Each node owns roughly 1/N of the ring.", "stats": { "nodes": 3, "N3": "pos 6" } }, { "highlight": [1, 2], "label": "PUT 'user:42' — hash maps to position 2. Walk clockwise → first node is N2 at position 3. Route there.", "stats": { "key": "user:42", "hash_pos": 2, "routed_to": "N2" } }, { "highlight": [4, 5], "label": "PUT 'order:99' — hash maps to position 4. Walk clockwise → N3 at position 6.", "stats": { "key": "order:99", "hash_pos": 4, "routed_to": "N3" } }, { "highlight": [5, 6, 7], "label": "N4 added at position 5: only remaps arc (3, 5] from N3 to N4. ~25% of N3's keys move. All other keys stay put.", "stats": { "new_node": "N4 at pos 5", "remapped": "~25% of N3", "unaffected": "N1 and N2 keys" } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Virtual Nodes Solve Hot Spots", "content": "In practice, each physical server owns **150–200 virtual positions** on the ring (e.g., node A appears at positions 5, 47, 203, 891...). This produces much more uniform key distribution and means that when a node fails, its load spreads across many neighbors instead of crushing a single successor.\\n\\nDynamoDB uses virtual nodes internally. Cassandra exposes them as the \`num_tokens\` configuration." }
\`\`\`

---

## Mechanism 2: Replication & Quorum Consensus

Data is replicated across **N** nodes for fault tolerance. But how do you ensure reads reflect the latest write? The answer is **quorum consensus**.

\`\`\`concept
{ "title": "The Quorum Rule: W + R > N", "variant": "rule", "content": "With N replicas:\\n- **W** = minimum write acknowledgments before returning success\\n- **R** = minimum read responses needed before returning a value\\n\\nIf **W + R > N**, at least one node that acknowledged the write will also participate in every read — guaranteeing you see the latest version.\\n\\n**Example (N=3):** W=2, R=2 → W+R=4 > 3 ✓ (consistent). W=1, R=1 → W+R=2 < 3 ✗ (eventual)." }
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "Strong Consistency", "icon": "🔒", "content": "**Configuration: N=3, W=3, R=2**\\n\\nAll three replicas must acknowledge every write. Any two replicas can serve a read.\\n\\n**Pros:** Reads always return the latest value. Zero stale data.\\n\\n**Cons:** A single unavailable replica blocks all writes. Higher write latency.\\n\\n**Use when:** Financial transactions, inventory counts, anything where stale reads cause correctness bugs.\\n\\n\`\`\`\\nW + R = 3 + 2 = 5 > N=3 ✓\\nWrite tolerance: 0 failed nodes\\nRead tolerance: 1 failed node\\n\`\`\`" }, { "label": "Quorum (Default)", "icon": "⚖️", "content": "**Configuration: N=3, W=2, R=2**\\n\\nMajority of replicas must acknowledge writes and reads.\\n\\n**Pros:** Tolerates one node failure for both reads and writes. Good latency.\\n\\n**Cons:** Slightly more complex conflict resolution needed.\\n\\n**Use when:** Most production workloads — a reasonable balance of consistency and availability.\\n\\n\`\`\`\\nW + R = 2 + 2 = 4 > N=3 ✓\\nWrite tolerance: 1 failed node\\nRead tolerance: 1 failed node\\n\`\`\`" }, { "label": "Eventual Consistency", "icon": "🚀", "content": "**Configuration: N=3, W=1, R=1**\\n\\nOnly one replica needs to acknowledge. Maximum throughput.\\n\\n**Pros:** Survives two node failures. Lowest latency. Highest write throughput.\\n\\n**Cons:** Reads may return stale data. Application must handle conflicts.\\n\\n**Use when:** Shopping cart contents, view counters, social media likes — situations where brief inconsistency is acceptable.\\n\\n\`\`\`\\nW + R = 1 + 1 = 2 < N=3 ✗ (not strongly consistent)\\nWrite tolerance: 2 failed nodes\\nRead tolerance: 2 failed nodes\\n\`\`\`" } ] }
\`\`\`

---

## Mechanism 3: Vector Clocks for Conflict Resolution

When W=1 and two clients write to the same key simultaneously, you get two versions with no way to know which happened first. **Vector clocks** solve this by attaching a logical timestamp to every write.

Each node maintains a counter per server in the cluster. When a write occurs, the writing node increments its counter and attaches the entire vector as the version. When another node receives two versions, it compares them component-wise:

- If every component of clock A ≥ clock B → A happened after B (causal order, keep A)
- If A beats B on some components but B beats A on others → **concurrent writes, conflict!**

\`\`\`trace
{ "title": "Vector Clock: Detecting Concurrent Writes", "language": "python", "code": "vc_A = [0, 0, 0]  # clock for nodes [A, B, C]\\nvc_B = [0, 0, 0]\\nvc_A[0] += 1\\nsnap_A = list(vc_A)\\nvc_B[1] += 1\\nsnap_B = list(vc_B)\\nmerged = [max(a, b) for a, b in zip(snap_A, snap_B)]\\nconflict = snap_A[0] > 0 and snap_B[1] > 0\\nprint('Conflict!' if conflict else 'Causal order')", "frames": [ { "line": 1, "vars": { "vc_A": "[0,0,0]", "vc_B": "?" }, "note": "Initialize vector clock for Node A. Three counters: one per server [A, B, C]." }, { "line": 2, "vars": { "vc_A": "[0,0,0]", "vc_B": "[0,0,0]" }, "note": "Node B has its own independent clock, also starting at zero." }, { "line": 3, "vars": { "vc_A": "[1,0,0]" }, "note": "Node A writes key='username', value='alice'. Increments its own counter: A goes 0→1." }, { "line": 4, "vars": { "snap_A": "[1,0,0]" }, "note": "Node A stores the write with its current clock as the version tag." }, { "line": 5, "vars": { "vc_B": "[0,1,0]" }, "note": "Concurrently, Node B writes key='username', value='bob'. It has NOT seen A's write yet — B's counter for A is still 0." }, { "line": 6, "vars": { "snap_B": "[0,1,0]" }, "note": "Node B stores its write with version [0,1,0]. We now have two versions of the same key." }, { "line": 7, "vars": { "merged": "[1,1,0]" }, "note": "A replica that receives both copies merges clocks with element-wise max. Merged clock shows both A and B have written." }, { "line": 8, "vars": { "conflict": "True" }, "note": "Conflict check: A's counter > 0 AND B's counter > 0 means neither happened-before the other. True concurrent conflict." }, { "line": 9, "vars": { "conflict": "True" }, "stdout": "Conflict!", "note": "System surfaces the conflict. Resolution options: last-write-wins (by wall clock), client-side merge (DynamoDB approach), or CRDT." } ], "speed": 1000 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Conflict Resolution Strategies", "content": "When vector clocks detect concurrent writes, you need a resolution strategy:\\n\\n1. **Last-Write-Wins (LWW):** Use wall-clock timestamp to pick winner. Simple but risks data loss if clocks are skewed.\\n2. **Client-Side Merge:** Return all conflicting versions to the client. They resolve (Amazon's shopping cart does this — union of all items).\\n3. **CRDTs:** Design your data type so merges are always mathematically correct (counters, sets, registers)." }
\`\`\`

---

## Mechanism 4: Gossip Protocol for Failure Detection

How does every node know which other nodes are alive — without a single point of failure like a central health-check server?

The **gossip protocol** (also called epidemic protocol) works like a rumor in a school: every node, every second, picks a random peer and shares its current view of cluster membership. Within **O(log N) rounds**, every node in a 1,000-node cluster has heard the same information — with no coordinator required.

Each node maintains a **heartbeat counter** that increments every second. When gossip propagates counters, a node is marked suspicious if its counter hasn't increased in a while, and failed if it stays stale beyond a threshold. This creates decentralized, eventually-consistent failure detection.

---

## Mechanism 5: LSM-Trees for Write Throughput

A naive approach stores data in a B-tree — the same structure as most relational databases. B-trees are excellent for reads but suffer for high-throughput writes because they perform **random I/O** (updating pages at arbitrary disk positions).

Key-value stores optimized for writes use **Log-Structured Merge-trees (LSM-trees)** instead.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "B-Tree (Random I/O)", "code": "# Each write updates a specific page on disk\\nwrite('user:1', 'alice')\\n  -> find correct leaf node in tree\\n  -> random seek to disk position ~50ms\\n  -> update in-place\\n  -> update parent nodes (rebalance)\\n\\nRandom I/O cost:  ~100 IOPS limit (HDD)\\nTypical throughput: ~1,000 writes/sec\\nRead performance:  excellent (O(log n))\\nProblematic for:   write-heavy KV workloads" }, "after": { "label": "LSM-Tree (Sequential I/O)", "code": "# Writes go to in-memory buffer first\\nwrite('user:1', 'alice')\\n  -> append to MemTable (RAM, sorted)\\n  -> when full: flush as SSTable to disk\\n  -> SSTable = immutable sorted file\\n  -> background: merge/compact SSTables\\n\\nSequential I/O:    ~200 MB/s (HDD)\\nTypical throughput: ~100,000 writes/sec\\nRead performance:  requires Bloom filter\\nOptimal for:       write-heavy KV stores" } }
\`\`\`

On reads, LSM-trees must check the MemTable, then progressively older SSTables — potentially slow. The fix: a **Bloom filter** per SSTable. A Bloom filter is a probabilistic structure that answers "does this key definitely NOT exist in this SSTable?" in O(1), skipping irrelevant files entirely.

---

## Simulate It: Quorum Reads & Writes

Run this simulation to see how different N/W/R configurations affect availability under node failures.

\`\`\`playground
{ "title": "Distributed KV Store: Quorum Simulation", "language": "python", "code": "import hashlib\\n\\nclass Node:\\n    def __init__(self, node_id):\\n        self.id = node_id\\n        self.data = {}\\n        self.alive = True\\n    def write(self, key, val):\\n        self.data[key] = val\\n        return True\\n    def read(self, key):\\n        return self.data.get(key)\\n\\nclass KVStore:\\n    def __init__(self, n, w, r):\\n        self.N, self.W, self.R = n, w, r\\n        self.nodes = [Node('node-' + str(i)) for i in range(5)]\\n\\n    def get_replicas(self, key):\\n        h = int(hashlib.md5(key.encode()).hexdigest(), 16) % len(self.nodes)\\n        return [self.nodes[(h + i) % len(self.nodes)] for i in range(self.N)]\\n\\n    def put(self, key, val):\\n        replicas = self.get_replicas(key)\\n        acks = sum(1 for n in replicas if n.alive and n.write(key, val))\\n        status = 'SUCCESS' if acks >= self.W else 'FAILED'\\n        print('PUT ' + key + '=' + str(val) + ': ' + status +\\n              ' (' + str(acks) + '/' + str(self.N) + ' acks, W=' + str(self.W) + ')')\\n        return acks >= self.W\\n\\n    def get(self, key):\\n        replicas = self.get_replicas(key)\\n        vals = [n.read(key) for n in replicas if n.alive]\\n        result = vals[0] if vals else None\\n        status = 'SUCCESS' if len(vals) >= self.R else 'FAILED'\\n        print('GET ' + key + ': ' + str(result) +\\n              ' (' + str(len(vals)) + '/' + str(self.N) + ' reads, R=' + str(self.R) + ')')\\n        return result\\n\\n# --- Strong consistency: W=3, R=2 ---\\nprint('=== Strong Consistency (N=3, W=3, R=2) ===')\\nkv = KVStore(3, 3, 2)\\nkv.put('user:1', 'alice')\\nkv.get('user:1')\\nkv.nodes[0].alive = False  # one replica fails\\nkv.get('user:1')           # read still works (2 >= R=2)\\nkv.put('user:1', 'alice2') # write FAILS (only 2 acks < W=3)\\n\\nprint()\\n# --- Eventual consistency: W=1, R=1 ---\\nprint('=== Eventual Consistency (N=3, W=1, R=1) ===')\\nkv2 = KVStore(3, 1, 1)\\nkv2.put('session:x', 'active')\\nkv2.nodes[0].alive = False\\nkv2.nodes[1].alive = False  # two replicas fail!\\nkv2.get('session:x')        # still works with 1 replica\\n\\nprint()\\n# --- Quorum formula check ---\\nprint('W + R > N (consistency guarantee):')\\nfor w, r in [(3, 2), (2, 2), (1, 1)]:\\n    print('  W=' + str(w) + ' R=' + str(r) + ' N=3 => consistent=' + str(w + r > 3))", "runnable": true }
\`\`\`

---

## Practice: Fill in the Quorum Formula

\`\`\`fillblank
{ "title": "Quorum Configuration for Mixed Workload", "prompt": "A read-heavy analytics service (90% reads, 10% writes) uses N=5 replicas. Complete the quorum configuration that guarantees consistency while minimizing read latency.", "language": "python", "template": "N = 5  # replication factor\\n\\n# For strong consistency: W + R must be > N\\n# To minimize read latency, minimize R\\n# To minimize write latency, minimize W\\n# Constraint: W + R > ___\\n\\n# Read-optimized quorum (R is small, W compensates)\\nW = ___  # write to most nodes\\nR = ___  # read from few nodes\\n\\nconsistent = W + R > N\\nprint('W=' + str(W) + ' R=' + str(R) + ' consistent=' + str(consistent))", "blanks": [ { "answer": "N", "hint": "The replication factor — the total number of replica copies" }, { "answer": "4", "hint": "With N=5 and R=2, W must satisfy W + 2 > 5, so W > 3, meaning W >= 4" }, { "answer": "2", "hint": "Minimum reads for consistency given W=4: 4 + R > 5, so R >= 2. This is small, fast." } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Distributed Key-Value Store", "questions": [ { "question": "A KV store has N=3, W=2, R=2. One replica node crashes. What happens to writes?", "options": [ "All writes fail — the system cannot tolerate any failure with W=2", "Writes succeed — 2 live nodes still satisfy the write quorum W=2", "Writes succeed but the quorum guarantee is lost, so reads may be stale", "The coordinator promotes a new replica automatically before accepting writes" ], "answer": 1, "explanation": "With N=3 and one node down, two nodes remain. Since W=2, writes still collect 2 acknowledgments — exactly meeting the quorum. The consistency guarantee W+R=4 > N=3 remains intact. This is the whole point of quorum: the system tolerates N-W=1 write-path failures." }, { "question": "Vector clocks [A:2, B:1, C:0] and [A:1, B:2, C:0] represent which situation?", "options": [ "The first write causally happened before the second", "The second write causally happened before the first", "Both writes happened concurrently — neither happened-before the other", "The writes are identical — both clocks represent the same event" ], "answer": 2, "explanation": "For clock X to happen-before clock Y, every component of X must be ≤ the corresponding component of Y. Here: A:2 > A:1 (first dominates on A), but B:1 < B:2 (second dominates on B). Neither dominates — these are concurrent writes, and the system must resolve the conflict." }, { "question": "Why does adding a new node to a consistent-hashing ring require moving far fewer keys than with modulo hashing?", "options": [ "Consistent hashing pre-distributes all keys to a virtual ring so no movement is needed", "Each new node only takes keys from its immediate clockwise neighbor on the ring, leaving all other arcs untouched", "Consistent hashing caches the old mapping for 24 hours to reduce movement", "Virtual nodes absorb the new node's keyspace without any physical data movement" ], "answer": 1, "explanation": "In consistent hashing, a new node at position P takes over only the arc from its counter-clockwise neighbor up to P. Keys in all other arcs remain with their existing owners. This means roughly 1/N keys move — compared to modulo hashing where nearly every key remaps when N changes." }, { "question": "An LSM-tree provides higher write throughput than a B-tree primarily because it:", "options": [ "Keeps all data in RAM and never writes to disk", "Converts random in-place disk updates into sequential append-only disk writes", "Uses a more compact data representation that requires fewer bytes per record", "Avoids the need for compaction by deleting old data immediately" ], "answer": 1, "explanation": "B-trees update data in-place at arbitrary disk positions (random I/O). LSM-trees buffer writes in memory (MemTable) and flush sorted, immutable segments (SSTables) sequentially. Sequential disk writes can be 10–100x faster than random writes on HDDs, and still significantly faster on SSDs. The trade-off: reads become more expensive and compaction adds background I/O." }, { "question": "The gossip protocol achieves cluster-wide failure detection without a central coordinator. What is its time complexity for information to propagate to all N nodes?", "options": [ "O(N) — each node must directly contact every other node", "O(N²) — all nodes broadcast to all nodes simultaneously", "O(log N) — each round of gossip doubles the number of informed nodes", "O(1) — gossip uses multicast so all nodes receive updates simultaneously" ], "answer": 2, "explanation": "Gossip works like a rumor: in each round, every informed node tells one random uninformed peer. After round 1: ~2 nodes know. After round 2: ~4. After round k: ~2^k. To reach all N nodes requires k = log₂(N) rounds. A 1,000-node cluster converges in ~10 rounds — this is why gossip scales to massive clusters without a single bottleneck." } ] }
\`\`\`

---

## Architecture Summary

Putting all five mechanisms together, here is how a production write flows through the system:

\`\`\`steps
{ "title": "Anatomy of a PUT Request", "steps": [ { "title": "Client sends PUT(key, value) to any node", "content": "The receiving node becomes the **coordinator** for this request. Any node can coordinate — there is no dedicated leader for the data plane." }, { "title": "Coordinator hashes the key", "content": "It computes \`hash(key)\` and walks the consistent hash ring clockwise to identify the **N=3 replica nodes** responsible for this key range." }, { "title": "Increment vector clock, fan out writes", "content": "The coordinator increments the vector clock for this key, then sends the write (with the new clock) to all N replicas in **parallel**. It does not wait for all — just the quorum W." }, { "title": "W replicas acknowledge", "content": "Once W replicas confirm the write to their **MemTable** (in-memory buffer), the coordinator returns success to the client. The write is durable once flushed to an SSTable on disk." }, { "title": "Gossip and background compaction", "content": "Nodes gossip health status continuously. SSTables are merged via **compaction** in the background — keeping read performance healthy and reclaiming space from deleted keys." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Consistent hashing distributes keys across nodes so that adding or removing a node remaps only ~1/N keys — critical for elastic scaling without reshuffling the entire dataset.", "The quorum formula W + R > N guarantees that every read overlaps with at least one node that acknowledged the latest write. Tuning W and R lets you trade write availability for read consistency or vice versa.", "Vector clocks detect concurrent writes by attaching a per-node logical timestamp to every version. When two clocks neither dominate each other, a conflict exists and the system must resolve it — through LWW, client merge, or CRDTs.", "Gossip protocol provides decentralized, O(log N) failure detection — every node learns about failures without any single coordinator that could itself become a failure point.", "LSM-trees convert random disk writes into sequential flushes, enabling write throughputs 10–100x higher than B-trees — at the cost of read amplification, mitigated by Bloom filters and compaction." ] }
\`\`\``,
      starterCode: `import hashlib
import bisect
from typing import Optional


class ConsistentHashRing:
    """
    A consistent hash ring for distributing keys across nodes.
    Uses virtual nodes for more even key distribution.
    """

    def __init__(self, virtual_nodes: int = 100):
        self.virtual_nodes = virtual_nodes
        self.ring = {}         # hash_position -> node_name
        self.sorted_keys = []  # sorted list of occupied hash positions
        self.nodes = set()     # set of real node names

    def _hash(self, key: str) -> int:
        """Returns a stable integer hash for any string key."""
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node: str) -> None:
        """
        TODO: Add \`node\` to the ring using virtual nodes.

        For each replica index i in range(self.virtual_nodes):
          1. Build a virtual key string like  f"{node}-{i}"
          2. Hash it with self._hash()
          3. Store  self.ring[h] = node
          4. Insert h into self.sorted_keys (keep it sorted — use bisect.insort)

        Also add \`node\` to self.nodes.
        """
        pass

    def remove_node(self, node: str) -> None:
        """
        TODO: Remove \`node\` and all its virtual nodes from the ring.

        For each replica index i in range(self.virtual_nodes):
          1. Rebuild the same virtual key f"{node}-{i}" and hash it
          2. Delete the entry from self.ring
          3. Remove the hash position from self.sorted_keys
             (use bisect.bisect_left to find the index, then pop it)

        Also remove \`node\` from self.nodes.
        """
        pass

    def get_node(self, key: str) -> Optional[str]:
        """
        TODO: Return the node responsible for \`key\`.

        Steps:
          1. If the ring is empty, return None
          2. Hash the key
          3. Use bisect.bisect_left to find the first ring position >= the hash
          4. If the index is past the end, wrap around to index 0 (the ring is circular)
          5. Return self.ring[self.sorted_keys[idx]]
        """
        pass


# ---------------------------------------------------------------------------
# Tests — run the file to check your implementation
# ---------------------------------------------------------------------------

def test_consistent_hashing():
    ring = ConsistentHashRing(virtual_nodes=10)

    ring.add_node("node-A")
    ring.add_node("node-B")
    ring.add_node("node-C")

    assert len(ring.nodes) == 3, "Expected 3 real nodes"
    assert len(ring.ring) == 30, "Expected 30 virtual nodes (10 per real node)"

    valid = {"node-A", "node-B", "node-C"}
    for key in ["user:1", "user:2", "order:99", "session:abc"]:
        node = ring.get_node(key)
        assert node in valid, f"{key} mapped to unknown node: {node}"

    # Hashing must be deterministic
    assert ring.get_node("user:42") == ring.get_node("user:42"), "Non-deterministic!"

    # After removing node-B, all keys still resolve to a remaining node
    ring.remove_node("node-B")
    assert len(ring.nodes) == 2, "Expected 2 nodes after removal"
    remaining = {"node-A", "node-C"}
    for key in ["user:1", "user:2", "order:99"]:
        node = ring.get_node(key)
        assert node in remaining, f"After removal, {key} -> {node}"

    print("All tests passed!")


test_consistent_hashing()
`,
      solutionCode: `import hashlib
import bisect
from typing import Optional


class ConsistentHashRing:
    """
    Consistent hash ring with virtual nodes.

    Why virtual nodes?
    ------------------
    Without them, nodes cluster unevenly on the ring and some nodes receive
    far more keys than others.  By placing each physical node at multiple
    positions (virtual nodes) we smooth out the distribution so every node
    handles roughly 1/N of the keyspace.

    Why consistent hashing at all?
    --------------------------------
    Traditional modulo hashing (key % N) requires remapping *all* keys when
    N changes.  Consistent hashing limits reshuffling to ~K/N keys when one
    node is added or removed (K = total keys, N = number of nodes).
    """

    def __init__(self, virtual_nodes: int = 100):
        self.virtual_nodes = virtual_nodes
        self.ring = {}         # hash_position -> node_name
        self.sorted_keys = []  # sorted list of occupied hash positions
        self.nodes = set()     # set of real node names

    def _hash(self, key: str) -> int:
        """Stable MD5-based integer hash.  MD5 gives good distribution."""
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node: str) -> None:
        """Place \`node\` on the ring at \`virtual_nodes\` evenly-spread positions."""
        self.nodes.add(node)
        for i in range(self.virtual_nodes):
            # Each replica gets a unique key so its hash lands in a different spot
            virtual_key = f"{node}-{i}"
            h = self._hash(virtual_key)
            self.ring[h] = node
            bisect.insort(self.sorted_keys, h)  # O(log n) insertion keeps list sorted

    def remove_node(self, node: str) -> None:
        """Evict \`node\` and all its virtual replicas from the ring."""
        self.nodes.discard(node)
        for i in range(self.virtual_nodes):
            virtual_key = f"{node}-{i}"
            h = self._hash(virtual_key)
            if h in self.ring:
                del self.ring[h]
                # bisect_left finds the exact index in O(log n)
                idx = bisect.bisect_left(self.sorted_keys, h)
                if idx < len(self.sorted_keys) and self.sorted_keys[idx] == h:
                    self.sorted_keys.pop(idx)

    def get_node(self, key: str) -> Optional[str]:
        """
        Walk clockwise from key's hash position to find the owning node.

        The ring is circular: if the hash falls past the last position we
        wrap around to index 0 (the first node on the ring).
        """
        if not self.ring:
            return None

        h = self._hash(key)
        # Find the first ring position that is >= h
        idx = bisect.bisect_left(self.sorted_keys, h)

        # Wrap around — the ring has no "end"
        if idx == len(self.sorted_keys):
            idx = 0

        return self.ring[self.sorted_keys[idx]]


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

def test_consistent_hashing():
    ring = ConsistentHashRing(virtual_nodes=10)

    ring.add_node("node-A")
    ring.add_node("node-B")
    ring.add_node("node-C")

    assert len(ring.nodes) == 3, "Expected 3 real nodes"
    assert len(ring.ring) == 30, "Expected 30 virtual nodes (10 per real node)"

    valid = {"node-A", "node-B", "node-C"}
    for key in ["user:1", "user:2", "order:99", "session:abc"]:
        node = ring.get_node(key)
        assert node in valid, f"{key} mapped to unknown node: {node}"

    # Hashing must be deterministic
    assert ring.get_node("user:42") == ring.get_node("user:42"), "Non-deterministic!"

    # After removing node-B, all keys still resolve to a remaining node
    ring.remove_node("node-B")
    assert len(ring.nodes) == 2, "Expected 2 nodes after removal"
    remaining = {"node-A", "node-C"}
    for key in ["user:1", "user:2", "order:99"]:
        node = ring.get_node(key)
        assert node in remaining, f"After removal, {key} -> {node}"

    print("All tests passed!")


test_consistent_hashing()
`,
    },
    {
      id: "design-search-typeahead",
      slug: "design-search-typeahead",
      title: "Design a Search Typeahead / Autocomplete",
      content: `# Design a Search Typeahead / Autocomplete

Google processes 8.5 billion searches per day. For every keystroke, suggestions appear before you finish typing — worldwide, under 100ms. Building a system that hits that latency at that scale isn't just smart caching. It requires a purpose-built data structure, aggressive sharding, multi-tier caching, and an async pipeline that continuously learns trending queries.

By the end of this lesson you'll have a complete architecture for a typeahead system handling **10 billion queries/day** at sub-100ms p99 latency.

---

## Step 1 — Clarify Requirements

\`\`\`tabs
{ "tabs": [
  {
    "label": "Functional",
    "icon": "✅",
    "content": "**What the system must do:**\\n\\n- Return top-K (5–10) suggestions for any typed prefix\\n- Rank suggestions by **query frequency** (most searched first)\\n- Support **prefix-only matching** (not substring search)\\n- Update suggestions as trends change — no stale week-old results\\n- Handle Unicode / multilingual queries\\n\\n**API design:**\\n\`\`\`\\nGET /suggestions?q={prefix}&limit=5\\n\`\`\`\\n\\n**Response:**\\n\`\`\`json\\n{\\n  \\"suggestions\\": [\\n    { \\"text\\": \\"python tutorial\\", \\"freq\\": 4200000 },\\n    { \\"text\\": \\"python download\\", \\"freq\\": 3800000 }\\n  ]\\n}\\n\`\`\`"
  },
  {
    "label": "Non-Functional",
    "icon": "⚡",
    "content": "**Performance targets:**\\n\\n| Metric | Target |\\n|--------|--------|\\n| p99 latency | < 100ms |\\n| Availability | 99.99% |\\n| Peak throughput | ~1.7M RPS |\\n| Suggestion freshness | ≤ 20 minutes |\\n\\n**Consistency model:** Eventual consistency is acceptable. A trending query appearing 20 minutes late is a minor annoyance — never a correctness failure.\\n\\n**Read:write ratio:** ~1000:1. Every design decision flows from this. Optimize hard for reads, accept eventual consistency on writes."
  },
  {
    "label": "Scale Math",
    "icon": "🔢",
    "content": "**Traffic estimation:**\\n\\n- 100M DAU × 100 queries/day = **10B queries/day**\\n- Average 5 keystrokes per query → **50B typeahead requests/day**\\n- 50B ÷ 86,400 = **580,000 baseline RPS**\\n- Peak ≈ 3× average → **~1.7M peak RPS**\\n\\n**Storage estimation:**\\n\\n- Unique queries in index: ~1 billion\\n- Average query: 20 chars × 2 bytes = 40 bytes + 8-byte freq counter = 48 bytes\\n- Raw data: 1B × 48B = **~48 GB**\\n- Trie overhead (pointers, top-K caches): ~3× → **~150 GB total**\\n- Fits across a handful of servers; too large for a single process\\n\\n**Write throughput:**\\n- 10B × 10% new queries × 20 bytes = **~20 GB/day** of novel query data flowing into the update pipeline"
  }
] }
\`\`\`

\`\`\`concept
{ "title": "The Core Insight: Read/Write Asymmetry", "variant": "insight", "content": "580K reads/sec vs ~1K trie writes/sec = a 580:1 read/write ratio. The entire architecture flows from this: pre-compute everything offline, cache results at every layer, and accept eventual consistency on updates. You are building a read-optimized lookup engine, not a database." }
\`\`\`

---

## Step 2 — The Trie Data Structure

A **trie** (prefix tree) is the natural fit for autocomplete. Each node represents one character, and every root-to-leaf path spells a complete query string.

\`\`\`mermaid
graph TD
    root((root)) --> c((c))
    root --> d((d))
    c --> a((a))
    a --> r((r))
    r --> e("e ✓\\nfreq:1200")
    r --> d2("d ✓\\nfreq:800")
    a --> t("t ✓\\nfreq:600")
    d --> o((o))
    o --> g("g ✓\\nfreq:950")

    style e fill:#4ade80,color:#111
    style d2 fill:#4ade80,color:#111
    style t fill:#4ade80,color:#111
    style g fill:#4ade80,color:#111
\`\`\`

To find suggestions for prefix \`"ca"\`: walk root → \`c\` → \`a\`, then DFS the subtree collecting all terminal nodes. **The problem:** with 1 billion queries, a DFS from \`"ca"\` could visit millions of nodes — far too slow for sub-100ms responses.

**The fix: cache top-K completions at every node.**

\`\`\`concept
{ "title": "Top-K Caching at Every Trie Node", "variant": "mental-model", "content": "Store the top-5 most frequent completions directly on every trie node. A lookup for 'ca' just reads the cached list at the 'ca' node in O(L) time — where L is prefix length — with no DFS needed. The trade-off: each node stores K extra strings (~100 bytes), but 1B nodes × 100B = ~100 GB extra is worth eliminating the DFS entirely at 580K RPS." }
\`\`\`

---

## Step 3 — Algorithm in Action

\`\`\`trace
{ "title": "Trie Prefix Search with Top-K Cache", "language": "python", "code": "class TrieNode:\\n    def __init__(self):\\n        self.children = {}\\n        self.top_k = []  # cached (freq, word) pairs\\n\\ndef search(root, prefix):\\n    node = root\\n    for ch in prefix:\\n        if ch not in node.children:\\n            return []\\n        node = node.children[ch]\\n    return node.top_k\\n\\nresults = search(trie_root, 'ca')\\nprint(results)", "frames": [
  { "line": 6, "vars": { "node": "root", "prefix": "'ca'" }, "note": "Start at the root node — every search begins here" },
  { "line": 7, "vars": { "node": "root", "ch": "'c'" }, "note": "Loop begins: first character is 'c'" },
  { "line": 8, "vars": { "node": "root", "ch": "'c'" }, "note": "'c' exists in root.children — no early exit" },
  { "line": 9, "vars": { "node": "c-node", "ch": "'c'" }, "note": "Move pointer to the 'c' node" },
  { "line": 7, "vars": { "node": "c-node", "ch": "'a'" }, "note": "Next character: 'a'" },
  { "line": 9, "vars": { "node": "ca-node", "ch": "'a'" }, "note": "Move pointer to the 'ca' node" },
  { "line": 10, "vars": { "node": "ca-node" }, "note": "Prefix exhausted — return the cached top_k list. No DFS!", "stdout": "[(1200, 'care'), (950, 'car'), (800, 'card'), (600, 'cat'), (450, 'cast')]" }
], "speed": 1000 }
\`\`\`

---

## Step 4 — Frequency-Weighted Ranking

Not all completions are equal. \`"python tutorial"\` (4M searches/day) must rank above \`"python turtles"\` (200 searches/day). Each trie node keeps a sorted top-K list, updated offline by the aggregation pipeline.

\`\`\`playground
{ "title": "Frequency-Weighted Trie (Runnable)", "language": "python", "code": "class TrieNode:\\n    def __init__(self):\\n        self.children = {}\\n        self.is_end = False\\n        self.freq = 0\\n        self.top_k = []  # list of (freq, word), sorted descending\\n\\nclass FrequencyTrie:\\n    def __init__(self, k=5):\\n        self.root = TrieNode()\\n        self.k = k\\n\\n    def insert(self, word, freq):\\n        node = self.root\\n        path = [node]\\n        for ch in word:\\n            if ch not in node.children:\\n                node.children[ch] = TrieNode()\\n            node = node.children[ch]\\n            path.append(node)\\n        node.is_end = True\\n        node.freq = freq\\n        # Update top-K cache from leaf back to root\\n        for ancestor in path:\\n            self._update_top_k(ancestor, word, freq)\\n\\n    def _update_top_k(self, node, word, freq):\\n        node.top_k.append((freq, word))\\n        node.top_k.sort(reverse=True)\\n        node.top_k = node.top_k[:self.k]\\n\\n    def search(self, prefix):\\n        node = self.root\\n        for ch in prefix:\\n            if ch not in node.children:\\n                return []\\n            node = node.children[ch]\\n        return [word for _, word in node.top_k]\\n\\ntrie = FrequencyTrie(k=5)\\nqueries = [\\n    ('python tutorial', 4200000),\\n    ('python download', 3800000),\\n    ('python list comprehension', 2100000),\\n    ('python dictionary', 1900000),\\n    ('python print', 1700000),\\n    ('python string format', 1500000),\\n    ('pytorch install', 900000),\\n    ('pyenv setup', 450000),\\n]\\nfor query, freq in queries:\\n    trie.insert(query, freq)\\n\\nfor prefix in ['py', 'pyt', 'pyth', 'python ']:\\n    results = trie.search(prefix)\\n    print(f'{prefix!r:15} -> {results[:3]}')", "runnable": true }
\`\`\`

---

## Step 5 — High-Level Architecture

At 580K baseline RPS, a single trie service collapses. Three scale layers absorb traffic before it reaches the trie:

\`\`\`sysdiag
{ "title": "Search Typeahead System Architecture", "width": 720, "height": 380,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 190, "kind": "client" },
    { "id": "edge", "label": "CDN Edge Cache", "x": 210, "y": 100, "kind": "cache" },
    { "id": "api", "label": "API Servers", "x": 390, "y": 190, "kind": "service" },
    { "id": "redis", "label": "Redis L1 Cache", "x": 390, "y": 70, "kind": "cache" },
    { "id": "trie", "label": "Trie Service (sharded)", "x": 560, "y": 190, "kind": "service" },
    { "id": "db", "label": "Trie Store (Cassandra)", "x": 630, "y": 310, "kind": "database" },
    { "id": "pipeline", "label": "Update Pipeline (Kafka)", "x": 210, "y": 310, "kind": "queue" }
  ],
  "edges": [
    { "from": "client", "to": "edge", "label": "GET /suggestions?q=" },
    { "from": "edge", "to": "api", "label": "cache miss" },
    { "from": "api", "to": "redis", "label": "L1 lookup" },
    { "from": "api", "to": "trie", "label": "L1 miss" },
    { "from": "trie", "to": "db", "label": "load shard" },
    { "from": "client", "to": "pipeline", "label": "query logs (async)" },
    { "from": "pipeline", "to": "trie", "label": "freq update (15 min)" }
  ],
  "annotations": {
    "edge": "CDN at 200+ PoPs caches top-K for popular prefixes. Absorbs ~70% of global traffic. TTL: 5 min.",
    "redis": "Redis cluster caches prefix→suggestions pairs. ~95% hit rate for hot prefixes. TTL: 2 min. Serves the remaining ~25%.",
    "trie": "Horizontally sharded by prefix range. Each shard fits in RAM (~10 GB). Rebuilt asynchronously every 15 min from Cassandra snapshots.",
    "pipeline": "Kafka ingests raw query logs. Spark aggregates frequencies in 15-min windows. Triggers trie shard rebuilds. Fully decoupled from reads."
  }
}
\`\`\`

---

## Step 6 — Trie Sharding

150 GB of trie data doesn't fit in a single process — and even if it did, you need horizontal scale for fault tolerance. The solution is **prefix-range sharding**.

\`\`\`steps
{ "title": "Sharding the Trie Across Servers", "steps": [
  {
    "title": "Naive Range Sharding (Don't Do This)",
    "content": "Split the alphabet into equal character ranges:\\n\\n- Shard A: \`a–f\`\\n- Shard B: \`g–n\`\\n- Shard C: \`o–z\`\\n\\n**Problem:** Query distribution is wildly unequal. \`'s'\`, \`'w'\`, and \`'h'\` are far more popular than \`'x'\`, \`'q'\`, \`'z'\`. Shard C gets 3× the traffic of Shard A. You've traded one hot spot for another."
  },
  {
    "title": "Frequency-Weighted Sharding (Better)",
    "content": "Profile actual query distribution first, then split to equalize **query load**, not character count:\\n\\n\`\`\`\\nShard 1:  a, b, c, d, e, f, g, h   →  20% of traffic\\nShard 2:  i, j, k, l, m, n         →  15% of traffic\\nShard 3:  o, p, q, r               →  25% of traffic\\nShard 4:  s                        →  25% of traffic  ('search', 'spotify'...)\\nShard 5:  t, u, v, w, x, y, z     →  15% of traffic\\n\`\`\`\\n\\n\`'s'\` alone gets its own shard because it's the most common first letter in English queries."
  },
  {
    "title": "2-Character Sub-Sharding (Production Scale)",
    "content": "For extreme scale, shard on 2-character prefixes:\\n\\n- \`'se*'\` → Shard 7 (search, setup, secret...)\\n- \`'wh*'\` → Shard 12 (what, where, when, who...)\\n- \`'ho*'\` → Shard 8 (how, home, hotel...)\\n\\nThis enables **consistent hashing** at the router. Adding a new shard only remaps a prefix slice, not a full reshuffle. The shard registry lives in ZooKeeper — API servers look up the owning shard in O(1)."
  },
  {
    "title": "Replication for Availability",
    "content": "Each shard is replicated 3-way (1 primary + 2 replicas):\\n\\n- Reads served from any replica — load distributed evenly\\n- Trie rebuilds happen on replicas first, then primary atomically swaps\\n- Zero read downtime during rebuilds\\n\\nWith 3-way replication at 99.9% per-node uptime:\\n\`P(all 3 down) = (0.001)^3 = 0.000000001\` → effectively 99.9999999% per-shard availability."
  }
] }
\`\`\`

---

## Step 7 — Multi-Tier Caching

Even with sharding, 580K RPS hitting the trie is expensive. Three cache layers absorb ~99% of traffic before it reaches trie compute:

\`\`\`compare
{ "variant": "before-after",
  "before": { "label": "Without Caching", "code": "Client → API Server → Trie Service → Cassandra\\n\\nEvery request hits trie logic.\\nAt 580K RPS → need 580K trie cores.\\nActual measured p99: 250-500ms.\\nCost: prohibitive." },
  "after": { "label": "With 3-Tier Cache", "code": "Client\\n  ↓ ~70% served here\\nCDN Edge  (TTL: 5 min)\\n  ↓ ~25% of remaining\\nRedis L1  (TTL: 2 min)\\n  ↓ ~4% of remaining\\nAPI LRU   (TTL: 30 sec)\\n  ↓ ~1% of all traffic\\nTrie Service\\n\\nActual trie load: ~5,800 RPS.\\nMeasured p99: < 5ms at trie.\\nEnd-to-end p99 with CDN: < 30ms." }
}
\`\`\`

| Cache Tier | TTL | Approx. Hit Rate | Why It Works |
|------------|-----|-----------------|--------------|
| CDN Edge | 5 min | ~70% | Top 10K prefixes change slowly; CDN is geographically close to users |
| Redis L1 | 2 min | ~25% | Hot prefixes within a data center remain hot for minutes |
| API LRU | 30 sec | ~4% | Per-server warm-up absorbs bursty repeat requests |

\`\`\`callout
{ "type": "warning", "title": "Thundering Herd on Cache Invalidation", "content": "When the trie rebuilds every 15 minutes, never manually purge all cache layers simultaneously. Doing so sends 580K requests straight to the trie at once — a thundering herd that causes cascading overload.\\n\\n**Solution:** Rely on natural TTL expiry. Stagger trie shard rebuilds across a 10-minute window. Caches drain and refill gradually rather than all at once." }
\`\`\`

---

## Step 8 — The Async Update Pipeline

The trie is immutable during queries. Updates flow through a fully decoupled async pipeline:

\`\`\`steps
{ "title": "Query Frequency Update Pipeline", "steps": [
  {
    "title": "Ingest: Kafka Query Log",
    "content": "Every search query is published to a Kafka topic in real time:\\n\\n\`\`\`json\\n{ \\"query\\": \\"python tutorial\\", \\"ts\\": 1713000000, \\"region\\": \\"US\\" }\\n\`\`\`\\n\\nKafka handles 580K events/sec easily. Partition by first character so downstream aggregation is parallelizable across workers."
  },
  {
    "title": "Aggregate: Spark Streaming Windows",
    "content": "A Spark Streaming job consumes Kafka and counts queries in **15-minute tumbling windows**:\\n\\n\`\`\`python\\nquery_counts = (\\n    spark.readStream\\n    .format('kafka')\\n    .load()\\n    .groupBy('query')\\n    .count()\\n    .withWatermark('ts', '15 minutes')\\n)\\n\`\`\`\\n\\nOutputs \`(query_string, new_frequency)\` to a Cassandra update table."
  },
  {
    "title": "Rebuild: Atomic Shard Swap",
    "content": "The Trie Builder service:\\n1. Reads updated frequencies from Cassandra\\n2. Rebuilds the affected shard — including top-K at every node, leaf to root\\n3. Serializes the new trie to a versioned snapshot\\n4. **Blue-green swap**: new shard starts serving traffic, old shard drains\\n\\nZero-downtime rebuild. Reads never block."
  },
  {
    "title": "Propagate: TTL Expiry",
    "content": "No explicit cache invalidation. Caches expire naturally via TTL, pulling fresh suggestions from the rebuilt trie.\\n\\n**Total end-to-end freshness lag:**\\nSpark window (≤15 min) + trie rebuild (3 min) + CDN TTL (5 min) = **≤ 23 minutes**\\n\\nA trending query like 'spiderman no way home' peaks → appears in suggestions within 23 minutes. This is acceptable for autocomplete."
  }
] }
\`\`\`

---

## Practice

\`\`\`fillblank
{ "title": "Trie Prefix Search", "prompt": "Complete the O(L) prefix search that returns cached top-K completions:", "language": "python", "template": "def search(root, prefix, k=5):\\n    node = ___\\n    for ch in prefix:\\n        if ch not in node.children:\\n            return ___\\n        node = node.children[___]\\n    return node.___[:k]", "blanks": [
  { "answer": "root", "hint": "Every search starts at the top of the trie" },
  { "answer": "[]", "hint": "The prefix doesn't exist — return an empty list" },
  { "answer": "ch", "hint": "Follow the edge for the current character" },
  { "answer": "top_k", "hint": "Each node pre-caches its best completions — no DFS needed" }
] }
\`\`\`

---

## Trade-Off Analysis

\`\`\`tabs
{ "tabs": [
  {
    "label": "Trie vs Elasticsearch",
    "icon": "🆚",
    "content": "**Custom Trie**\\n- ✅ O(prefix length) lookup — optimal for prefix search\\n- ✅ Fully in-memory → predictable sub-5ms latency\\n- ✅ Top-K pre-computed — zero computation at query time\\n- ❌ Complex to shard, rebuild, and operate\\n- ❌ No typo correction out of the box\\n\\n**Elasticsearch**\\n- ✅ Distributed sharding handled automatically\\n- ✅ Supports fuzzy matching (edit distance) for typo tolerance\\n- ❌ Higher baseline latency (~50–150ms) vs in-memory trie (~5ms)\\n- ❌ Expensive at 580K RPS\\n\\n**When to choose Elasticsearch:** scale below ~10K RPS, you need fuzzy matching, or you lack the ops capacity to run a custom trie service."
  },
  {
    "label": "Sync vs Async Updates",
    "icon": "🔄",
    "content": "**Synchronous (write on every query)**\\n- ✅ Instant freshness — suggestions update immediately\\n- ❌ Write contention is catastrophic at 580K RPS\\n- ❌ Every write must propagate to all K ancestor nodes in the trie\\n- ❌ Trie locked during write → read latency spikes\\n\\n**Asynchronous batch (current design)**\\n- ✅ Reads never blocked by writes\\n- ✅ Batch aggregation is orders of magnitude more efficient\\n- ✅ One 15-min rebuild vs 580K individual node updates\\n- ❌ ~20 min freshness lag\\n\\n**Verdict:** Async is the only viable approach at this scale. The freshness lag is an acceptable trade-off — autocomplete correctness doesn't depend on real-time accuracy."
  },
  {
    "label": "Exact vs Fuzzy Match",
    "icon": "🔍",
    "content": "**Exact prefix matching (this design)**\\n- Searching 'pythn' returns nothing\\n- Simple O(L) trie walk\\n- Low computational cost\\n\\n**Fuzzy prefix matching (extension)**\\n- Searching 'pythn' could return 'python...'\\n- Requires BK-tree or bounded edit-distance DFS\\n- 10–100× more compute per query\\n\\n**Hybrid approach used in production:**\\n1. Try exact prefix first (fast path)\\n2. If results < K, fall back to fuzzy match (slow path)\\n3. Client-side spell suggestion as a separate microservice\\n\\nSeparating concerns keeps the fast path fast for 99% of correctly typed queries."
  }
] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Unicode and Multilingual Typeahead", "content": "ASCII tries are easy — 26 characters, a fixed-size array per node. Unicode changes everything.\\n\\n**Challenge 1: Fan-out explosion**\\nChinese has 20,000+ common characters. A fixed-array \`children[char]\` node needs 20,000 slots — 40 MB per node. **Fix:** use a hash map for children. O(1) average lookup, arbitrary character support, negligible overhead for sparse alphabets.\\n\\n**Challenge 2: Normalization**\\nIs \`café\` the same as \`cafe\`? Is \`PYTHON\` the same as \`python\`? Apply **Unicode NFKC normalization** + **Unicode case folding** before insertion and lookup. This ensures \`Café\`, \`café\`, and \`cafe\` all map to identical trie paths.\\n\\n**Challenge 3: Regional frequency divergence**\\n\`cricket\` ranks #1 in India but ~#50 in the USA. Maintain **separate trie shards per language × region**. The \`en-IN\` shard has completely different top-K than \`en-US\` even for identical prefixes. Language is detected from \`Accept-Language\` header or query script detection.\\n\\n**Practical scale:** Google's autocomplete runs region-and-language-specific tries. A query for \`ho\` in India might surface \`hotstar\`, \`holi\`, \`home loan emi\`; in the US it surfaces \`home depot\`, \`hotels near me\`, \`how to...\`. One trie cannot serve all audiences well." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Design a Search Typeahead", "questions": [
  {
    "question": "A naive DFS from the prefix node is too slow for production typeahead at 580K RPS. What is the standard O(L) optimization?",
    "options": [
      "Use BFS instead of DFS — BFS has better cache locality",
      "Cache the top-K completions directly at every trie node",
      "Limit DFS depth to 3 levels below the prefix node",
      "Sort the trie alphabetically to enable binary search on completions"
    ],
    "answer": 1,
    "explanation": "Storing top-K completions at every node turns O(subtree size) DFS into O(prefix length) lookup — you just walk L edges and read the cached list. The trade-off is extra storage per node (~100 bytes × 1B nodes = 100 GB), but this is worth eliminating the DFS entirely at 580K RPS."
  },
  {
    "question": "Your 's*' shard runs at 95% CPU while 'a*' and 'b*' shards idle at 20%. What is the right fix?",
    "options": [
      "Switch to consistent hash sharding — hashing distributes load evenly",
      "Add more Redis cache capacity to reduce hits reaching the 's*' shard",
      "Sub-shard 's*' into 'se*', 'sh*', 'sp*', 'st*', 'sw*' etc.",
      "Add more replicas to the 's*' shard to spread read load"
    ],
    "answer": 2,
    "explanation": "'s' is the most common first letter in English queries ('search', 'spotify', 'shopping'...). The fix is 2-character prefix sub-sharding so the 's*' load is spread across multiple physical shards. Hash sharding would break prefix routing — you need to know which shard owns a prefix to route the request correctly. Adding replicas helps reads but doesn't reduce per-shard compute."
  },
  {
    "question": "'spiderman no way home' trends globally right now. With Spark's 15-min aggregation window, 3-min trie rebuild, and 5-min CDN TTL — how long until it appears in suggestions?",
    "options": [
      "Under 1 second — Kafka ingests it immediately",
      "~3 minutes — as soon as the trie rebuild completes",
      "~18 minutes — Spark window (15 min) + trie rebuild (3 min)",
      "Up to ~23 minutes — Spark window + trie rebuild + CDN TTL expiry"
    ],
    "answer": 3,
    "explanation": "The full pipeline: wait for the current Spark window to close (up to 15 min) + trie rebuild (3 min) + CDN cache natural expiry (5 min) = up to 23 minutes. The query also needs to accumulate enough frequency within a window to displace existing top-K entries. Kafka ingestion is real-time but the frequency isn't reflected in the trie until the window aggregates and the shard rebuilds."
  },
  {
    "question": "Why is eventual consistency correct for typeahead but NOT for a bank account balance?",
    "options": [
      "Typeahead uses CDN which inherently can't guarantee strong consistency",
      "Stale suggestions cause no correctness failure — users still get valid (slightly outdated) completions",
      "Typeahead data is too large to replicate synchronously across regions",
      "Users cannot perceive latency differences below 100ms so staleness is hidden"
    ],
    "answer": 1,
    "explanation": "Match your consistency model to your harm model. A user seeing 'python 3.11' instead of 'python 3.12' in suggestions for 20 minutes is inconvenient — not incorrect. No action taken on stale autocomplete data causes damage. A bank balance showing stale data could cause overdrafts or financial decisions based on wrong information — correctness is critical. Always ask: 'What is the worst-case outcome of a stale read?'"
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "A trie with top-K completions cached at every node delivers O(prefix length) suggestion lookup — no DFS, no subtree scan at query time.",
  "Three cache layers (CDN → Redis → API LRU) absorb ~99% of 580K RPS before it hits trie compute, reducing actual trie load to ~5,800 RPS.",
  "Trie sharding must be frequency-weighted, not alphabet-weighted — 's*' can receive 25% of all traffic while 'x*' through 'z*' combined get under 2%.",
  "Updates flow through an async Kafka → Spark → Trie Builder pipeline. The ~20 minute freshness lag is an explicit trade-off for zero write contention on reads.",
  "Use TTL-based cache expiry during trie rebuilds, never manual purge — manual purge across all tiers simultaneously creates a thundering herd that overwhelms the trie service.",
  "Eventual consistency is architecturally correct here: stale autocomplete suggestions cause inconvenience, not correctness failures — always match your consistency model to your harm model."
] }
\`\`\``,
      starterCode: `# Search Typeahead - Frequency-Weighted Autocomplete
#
# Implement a typeahead system that returns the top-k completions
# for a prefix, ranked by query frequency.
#
# Core components:
#   - TrieNode: stores children + a sorted list of (freq, word) for fast top-k lookup
#   - Autocomplete: insert queries and search by prefix with O(p + k) time

from collections import defaultdict
from typing import Optional


class TrieNode:
    def __init__(self):
        self.children: dict[str, 'TrieNode'] = {}
        # TODO 1: Add a list \`top_k\` to store up to K (freq, word) tuples
        #         sorted descending by freq so the best results bubble up.
        #         This is the "frequency cache" at each node that makes
        #         top-k retrieval O(k) instead of O(subtree).
        pass


class Autocomplete:
    def __init__(self, k: int = 3):
        self.root = TrieNode()
        self.k = k
        self.freq: dict[str, int] = {}   # global word -> frequency table
        self.cache: dict[str, list[str]] = {}  # prefix -> results cache

    def _update_node_top_k(self, node: TrieNode, word: str, freq: int) -> None:
        """Insert/update (freq, word) in node.top_k, keeping only top-k entries."""
        # TODO 2: Remove any existing entry for \`word\` from node.top_k,
        #         then insert (freq, word) and sort descending by freq.
        #         Trim to self.k entries so each node only stores the best k.
        pass

    def insert(self, word: str, frequency: int = 1) -> None:
        """Add a query to the trie and update top_k at every node along the path."""
        # TODO 3: Update self.freq[word] by adding \`frequency\`.
        #         Then walk from root, creating TrieNode children as needed.
        #         At EACH node along the path call _update_node_top_k so that
        #         every prefix node knows the current best completions.
        #         Finally, invalidate self.cache for all prefixes of \`word\`
        #         (a real system does lazy invalidation; here just delete the keys).
        pass

    def search(self, prefix: str) -> list[str]:
        """Return up to k completions for prefix, highest frequency first."""
        # TODO 4: Check self.cache first and return cached result if present.
        #         Otherwise walk the trie to the node for \`prefix\`.
        #         If the node exists, read its top_k list to build results.
        #         Store results in self.cache[prefix] before returning.
        pass
`,
      solutionCode: `# Search Typeahead - Frequency-Weighted Autocomplete  (SOLUTION)
#
# Key insight from the lesson:
#   Storing a "top_k" list at EVERY trie node means search is O(p + k)
#   where p = prefix length.  Without it you'd scan the whole subtree — O(n).
#   The prefix cache (self.cache) adds a second tier: repeated queries hit
#   O(1) lookup, matching the multi-tier caching strategy in production systems.

from collections import defaultdict
from typing import Optional


class TrieNode:
    def __init__(self):
        self.children: dict[str, 'TrieNode'] = {}
        # Stores (freq, word) tuples, sorted descending — best completions first.
        self.top_k: list[tuple[int, str]] = []


class Autocomplete:
    def __init__(self, k: int = 3):
        self.root = TrieNode()
        self.k = k
        self.freq: dict[str, int] = {}
        self.cache: dict[str, list[str]] = {}  # L1 prefix cache

    def _update_node_top_k(self, node: TrieNode, word: str, freq: int) -> None:
        # Remove stale entry for this word (frequency may have changed).
        node.top_k = [(f, w) for f, w in node.top_k if w != word]
        # Insert updated entry and keep only the top-k by frequency.
        node.top_k.append((freq, word))
        node.top_k.sort(reverse=True)   # descending freq
        node.top_k = node.top_k[:self.k]

    def insert(self, word: str, frequency: int = 1) -> None:
        # Accumulate frequency (re-inserting a word bumps its count).
        self.freq[word] = self.freq.get(word, 0) + frequency
        current_freq = self.freq[word]

        # Walk the trie, updating top_k at every ancestor node.
        node = self.root
        self._update_node_top_k(node, word, current_freq)

        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            self._update_node_top_k(node, word, current_freq)

        # Invalidate cached results for all prefixes of this word
        # so stale completions aren't served after a frequency update.
        for i in range(len(word) + 1):
            self.cache.pop(word[:i], None)

    def search(self, prefix: str) -> list[str]:
        # L1 cache hit — O(1)
        if prefix in self.cache:
            return self.cache[prefix]

        # Walk to the prefix node — O(p)
        node = self.root
        for char in prefix:
            if char not in node.children:
                self.cache[prefix] = []
                return []
            node = node.children[char]

        # Read pre-computed top_k — O(k)
        results = [word for _freq, word in node.top_k]
        self.cache[prefix] = results  # populate L1 cache
        return results


# ── Quick smoke test ──────────────────────────────────────────────────────────
if __name__ == '__main__':
    ac = Autocomplete(k=3)

    # Simulate query log: insert words with their observed frequencies.
    queries = [
        ("search engine", 100),
        ("search results",  80),
        ("search history",  60),
        ("search bar",      40),
        ("see more",        90),
    ]
    for word, freq in queries:
        ac.insert(word, freq)

    print(ac.search("search"))   # ['search engine', 'search results', 'search history']
    print(ac.search("se"))       # ['search engine', 'see more', 'search results']
    print(ac.search("see"))      # ['see more']
    print(ac.search("xyz"))      # []

    # Bump 'search bar' frequency — cache should auto-invalidate.
    ac.insert("search bar", 200)
    print(ac.search("search"))   # ['search bar', 'search engine', 'search results']
`,
    },
    {
      id: "design-object-storage",
      slug: "design-object-storage",
      title: "Design an Object Storage Service (S3)",
      content: `# Design an Object Storage Service (S3)

Amazon S3 stores over 350 trillion objects and serves hundreds of billions of requests daily. Behind that deceptively simple PUT/GET API lies one of the most carefully engineered distributed systems ever built. In this lesson, you'll design every major component from scratch — flat namespace, multi-part upload, checksumming, versioning, cross-AZ replication, and presigned URLs.

---

## What Is Object Storage?

Before designing anything, you need to understand what problem object storage solves — and why it isn't just "a distributed filesystem."

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Object Storage",
      "icon": "📦",
      "content": "Stores **opaque blobs** addressed by a flat key (\`bucket/key\`). No directory tree. No partial overwrites — writes are atomic and immutable. Optimized for **huge files at massive scale**: photos, videos, backups, ML datasets.\\n\\n**Operations:** \`PUT\`, \`GET\`, \`DELETE\`, \`LIST\`, \`HEAD\`\\n\\n**Sweet spot:** Objects from 1 byte to 5 TB, billions of them."
    },
    {
      "label": "File Storage",
      "icon": "🗂️",
      "content": "Stores files in a **hierarchical directory tree** accessible via POSIX APIs (\`open\`, \`read\`, \`write\`, \`seek\`). Supports random reads and writes to any byte offset.\\n\\n**Examples:** NFS, EFS, HDFS\\n\\n**Sweet spot:** Applications that need filesystem semantics — databases, code builds, shared home directories."
    },
    {
      "label": "Block Storage",
      "icon": "💾",
      "content": "Exposes raw, fixed-size **block devices** mounted directly by an OS. The OS manages the filesystem on top. Extremely low latency.\\n\\n**Examples:** EBS, SAN\\n\\n**Sweet spot:** Boot volumes, databases needing raw IOPS, anything requiring sub-millisecond access."
    }
  ]
}
\`\`\`

\`\`\`concept
{
  "title": "The Flat Namespace",
  "variant": "mental-model",
  "content": "S3 has no real directories. \`photos/2024/jan/cat.jpg\` is just a string key. Buckets are organizational units, not filesystem directories — they exist to scope permissions and billing. This is why S3 can scale to trillions of objects without maintaining a directory hierarchy: there is no tree to keep consistent."
}
\`\`\`

---

## Requirements

### Functional Requirements

- **Upload objects** up to 5 TB (single PUT or multi-part)
- **Download objects** by \`bucket + key\`
- **Delete objects** (with optional soft-delete / versioning)
- **List objects** in a bucket with prefix filtering
- **Presigned URLs** — time-limited, shareable download links
- **Object versioning** — retain all versions, roll back on demand
- **Metadata** — user-defined key-value tags per object

### Non-Functional Requirements

- **Durability:** 11 nines (99.999999999%) — lose ≤ 1 object per 10 billion per year
- **Availability:** 99.99% — at most 53 minutes of downtime per year
- **Scale:** Billions of objects, exabytes of data
- **Latency:** First-byte-out for GETs under 200 ms at p99
- **Throughput:** Multi-GB/s per upload/download

\`\`\`callout
{
  "type": "info",
  "title": "Durability vs. Availability",
  "content": "These are different axes. Durability means your data isn't lost — ever. Availability means you can access it right now. You can have high durability with lower availability (data is safe but the service is down) or high availability with lower durability (service is up but a bug corrupted your data). S3 targets both, which is why the architecture has both replication (durability) and multi-AZ failover (availability)."
}
\`\`\`

---

## High-Level Architecture

The system separates three concerns into distinct layers:

\`\`\`sysdiag
{
  "title": "Object Storage — High-Level Architecture",
  "width": 700,
  "height": 420,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 210, "kind": "client" },
    { "id": "api", "label": "API Gateway\\n+ Auth", "x": 190, "y": 210, "kind": "service" },
    { "id": "meta", "label": "Metadata\\nService", "x": 360, "y": 120, "kind": "service" },
    { "id": "data", "label": "Data\\nService", "x": 360, "y": 300, "kind": "service" },
    { "id": "metadb", "label": "Metadata DB\\n(sharded SQL)", "x": 530, "y": 120, "kind": "database" },
    { "id": "dn1", "label": "Data Node\\nAZ-1", "x": 530, "y": 240, "kind": "storage" },
    { "id": "dn2", "label": "Data Node\\nAZ-2", "x": 530, "y": 330, "kind": "storage" },
    { "id": "dn3", "label": "Data Node\\nAZ-3", "x": 530, "y": 420, "kind": "storage" }
  ],
  "edges": [
    { "from": "client", "to": "api", "label": "HTTPS" },
    { "from": "api", "to": "meta", "label": "lookup / write" },
    { "from": "api", "to": "data", "label": "stream bytes" },
    { "from": "meta", "to": "metadb", "label": "R/W" },
    { "from": "data", "to": "dn1", "label": "replicate" },
    { "from": "data", "to": "dn2", "label": "replicate" },
    { "from": "data", "to": "dn3", "label": "replicate" }
  ],
  "annotations": {
    "api": "Handles auth (IAM), rate limiting, routes PUT/GET/DELETE to the right internal service",
    "meta": "Owns the mapping: bucket+key → {data node locations, checksum, version ID, size, content-type}",
    "data": "Splits, streams, and pipelines bytes to data nodes. Handles multi-part assembly.",
    "metadb": "Sharded by bucket/key hash. Stores object metadata rows. Strong consistency required.",
    "dn1": "Raw block storage with append-only writes. Stores content-addressed chunks."
  }
}
\`\`\`

---

## Multi-Part Upload

Single-TCP uploads for 5 GB files are unreliable. Network blips require retransmitting everything. Multi-part upload solves this.

\`\`\`steps
{
  "title": "Multi-Part Upload Flow",
  "steps": [
    {
      "title": "1. Initiate Upload",
      "content": "Client calls \`POST /bucket/key?uploads\`. Server creates an **UploadID** and stores it in the metadata DB with status \`IN_PROGRESS\`. Nothing is committed yet.\\n\\n\`\`\`\\nPOST /photos/cat.jpg?uploads\\n→ { \\"UploadId\\": \\"VXBsb2FkIElEIGZvciA2aWWpbmcncyBteS1tb3ZpZS5tMnRzIHVwbG9hZA\\" }\\n\`\`\`"
    },
    {
      "title": "2. Upload Parts in Parallel",
      "content": "Client splits the file into parts (5 MB minimum, up to 10,000 parts). Each part gets a \`PartNumber\` (1–10000). Parts can be uploaded **in parallel from different threads or machines**.\\n\\nEach part returns an \`ETag\` — the MD5 checksum of that part's bytes.\\n\\n\`\`\`\\nPUT /photos/cat.jpg?partNumber=1&uploadId=VXBsb2Fk\\nBody: [bytes 0..5MB]\\n→ ETag: \\"a1b2c3d4...\\"\\n\`\`\`"
    },
    {
      "title": "3. Complete Upload",
      "content": "Client sends the final request with all \`(PartNumber, ETag)\` pairs. The server:\\n1. Validates every part exists and ETags match\\n2. Assembles a **manifest** (no data copying — just metadata linking)\\n3. Atomically commits the object in the metadata DB\\n4. Returns the final object URL and composite ETag\\n\\n\`\`\`json\\nPOST /photos/cat.jpg?uploadId=VXBsb2Fk\\n{\\n  \\"Parts\\": [\\n    {\\"PartNumber\\": 1, \\"ETag\\": \\"a1b2c3d4\\"},\\n    {\\"PartNumber\\": 2, \\"ETag\\": \\"e5f6a7b8\\"}\\n  ]\\n}\\n\`\`\`"
    },
    {
      "title": "4. Abort (Optional)",
      "content": "If the upload fails or is abandoned, the client (or a background cleanup job) calls \`DELETE /bucket/key?uploadId=...\`. The server marks the upload abandoned and a garbage collector reclaims the orphaned part data.\\n\\n**Important:** Set a lifecycle rule to abort incomplete multipart uploads after N days — otherwise orphaned parts silently accumulate on your storage bill."
    }
  ]
}
\`\`\`

\`\`\`concept
{
  "title": "Parts Are Content-Addressed Chunks",
  "variant": "insight",
  "content": "Data nodes store parts using their checksum as the filename (content-addressable storage). Two uploads of identical bytes share the same physical storage chunk — zero-copy deduplication at the part level. The metadata service owns the mapping from \`(UploadId, PartNumber)\` → \`(NodeId, ChecksumKey)\`."
}
\`\`\`

---

## Checksumming for Data Integrity

Silent data corruption — bit rot, hardware faults, network flips — is a real threat at scale. At a billion objects, even a 10⁻¹² per-byte error rate causes thousands of corruptions per day.

\`\`\`concept
{
  "title": "End-to-End Checksum Rule",
  "variant": "rule",
  "content": "Compute the checksum at the source, carry it with the data all the way to the destination, and verify it again on read. Checking only at one end lets corruption introduced in transit go undetected."
}
\`\`\`

S3 uses a multi-layer checksum strategy:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Upload Path",
      "icon": "⬆️",
      "content": "1. Client computes MD5 of the object body and sends it in the \`Content-MD5\` header.\\n2. API Gateway verifies the header matches the received bytes immediately.\\n3. Data service computes CRC32C of each chunk before writing to disk.\\n4. Metadata DB stores \`{etag: \\"md5hex\\", crc32c: \\"chunkChecksums[]\\"}\`.\\n\\nIf any verification fails, the PUT is rejected with \`400 BadDigest\` before any data is persisted."
    },
    {
      "label": "Storage Path",
      "icon": "💽",
      "content": "Each data node runs a background **scrubbing job** that periodically re-reads every stored chunk and recomputes its CRC32C. If the stored checksum doesn't match:\\n1. Node marks itself as having a corrupted copy.\\n2. Replication manager is alerted.\\n3. A healthy replica re-replicates the chunk to the corrupt node.\\n\\nThis is how you achieve 11-nines durability — you don't just detect corruption, you auto-heal it."
    },
    {
      "label": "Download Path",
      "icon": "⬇️",
      "content": "1. Data service reads chunk from disk and verifies its CRC32C.\\n2. API Gateway assembles chunks and computes the final MD5.\\n3. The MD5 is returned in the \`ETag\` response header.\\n4. Client can optionally verify by recomputing MD5 of the received body.\\n\\nIf the data node returns corrupt bytes, the API Gateway retries against a different replica before returning an error."
    }
  ]
}
\`\`\`

---

## Object Versioning

Versioning keeps every overwrite and delete as a recoverable historical state. It's the foundation of accidental-deletion protection.

\`\`\`concept
{
  "title": "Versioning as Append-Only Log",
  "variant": "analogy",
  "content": "Think of an S3 object key as a stack of cards. Each PUT pushes a new card on top. The 'current version' is always the top card. Deleting adds a special 'delete marker' card — the key appears absent to GETs, but all the old cards are still under it. You can pop cards (delete versions) individually, all the way back to the original."
}
\`\`\`

The metadata schema for versioned objects:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Metadata Schema",
      "icon": "🗄️",
      "content": "\`\`\`\\nobjects table:\\n  bucket_id    TEXT\\n  key          TEXT\\n  version_id   UUID        ← monotonically increasing\\n  is_latest    BOOLEAN\\n  is_delete_marker BOOLEAN\\n  size_bytes   BIGINT\\n  etag         TEXT\\n  content_type TEXT\\n  created_at   TIMESTAMP\\n  data_node_ids TEXT[]     ← replicas\\n  PRIMARY KEY (bucket_id, key, version_id)\\n  INDEX ON (bucket_id, key, is_latest)\\n\`\`\`\\n\\nListing objects filters \`WHERE is_latest = TRUE AND is_delete_marker = FALSE\`. Version history lists all rows for a given \`(bucket, key)\`."
    },
    {
      "label": "GET Behavior",
      "icon": "📥",
      "content": "| Request | Behavior |\\n|---------|----------|\\n| \`GET /bucket/key\` | Returns \`is_latest=TRUE\` version |\\n| \`GET /bucket/key?versionId=abc\` | Returns that specific version |\\n| \`GET /bucket/key\` (after delete) | \`404 Not Found\` — hits delete marker |\\n| \`GET /bucket/key?versionId=xyz\` (pre-delete) | Returns the old version |\\n\\nVersions are immutable once written — no in-place updates ever."
    },
    {
      "label": "Lifecycle Rules",
      "icon": "⏱️",
      "content": "Versioning without cleanup leads to unbounded storage costs. S3 lifecycle rules run as a background job:\\n\\n- \`NoncurrentVersionExpiration: 90\` — delete versions older than 90 days\\n- \`NoncurrentVersionTransition: GLACIER after 30\` — move old versions to cold storage\\n- \`AbortIncompleteMultipartUpload: 7\` — clean up orphaned parts\\n\\nThe lifecycle job scans the metadata DB for rows matching the rule predicates and enqueues soft-deletes. A separate GC job then reclaims storage from data nodes."
    }
  ]
}
\`\`\`

---

## Replication Across Availability Zones

Durability comes from redundancy. S3 stores at least **3 copies** of every object across **3 separate Availability Zones** (AZs) — physically distinct data centers with independent power and networking.

\`\`\`steps
{
  "title": "Replication Pipeline (Write Path)",
  "steps": [
    {
      "title": "Primary Write",
      "content": "API Gateway selects the **primary data node** for the new object (based on consistent hashing of \`bucket+key\`). The data service streams bytes to this node. The node acknowledges once bytes are durably written to local disk."
    },
    {
      "title": "Synchronous Replication to AZ-2",
      "content": "**Before** returning success to the client, the primary node pipelines the data to a replica in AZ-2. The write is not acknowledged until **both AZ-1 and AZ-2 confirm**.\\n\\nThis is the durability-latency trade-off: you're paying ~5 ms extra round-trip for cross-AZ replication, but you can survive a full AZ failure without losing data."
    },
    {
      "title": "Asynchronous Replication to AZ-3",
      "content": "After the client receives a \`200 OK\`, the system replicates to a third node in AZ-3 **asynchronously**. This slightly weakens durability in the window before AZ-3 replication completes — but given you already have 2 synchronous copies, the risk is negligible.\\n\\nUsing async for the third copy dramatically improves write throughput without measurably affecting durability."
    },
    {
      "title": "Replication Lag Monitoring",
      "content": "A **replication lag monitor** tracks objects with \`replica_count < 3\`. If AZ-3 replication doesn't complete within an SLO window (e.g. 60 seconds), an alert fires.\\n\\nIf a data node fails mid-replication, a **placement manager** selects a replacement node in the same AZ and re-replicates from a healthy replica. Nodes report health via heartbeat every 5 seconds — after 3 missed heartbeats, they're considered dead."
    }
  ]
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "All 3 Replicas Synchronous",
    "code": "Write must wait for 3 cross-AZ round trips\\nbefore returning to client.\\n\\nLatency: ~30 ms added to every PUT\\nThroughput: Bottlenecked by slowest AZ\\n\\nGain: Zero replication lag ever\\nCost: 3x worse write latency"
  },
  "after": {
    "label": "2 Sync + 1 Async (S3's approach)",
    "code": "Write waits for 2 replicas (1 local + 1 cross-AZ).\\nThird replica replicates in background.\\n\\nLatency: ~5 ms added (one AZ hop)\\nThroughput: Not bottlenecked by third AZ\\n\\nGain: Much better write performance\\nCost: Tiny durability window before 3rd replica"
  }
}
\`\`\`

---

## Presigned URLs

Object storage must serve public content (images, videos, file downloads) without leaking your API credentials or forcing your backend to proxy every byte.

\`\`\`concept
{
  "title": "Presigned URLs — Capability Tokens",
  "variant": "mental-model",
  "content": "A presigned URL is a cryptographic promise: 'anyone who holds this URL may GET (or PUT) this exact object until this expiry time.' The URL itself encodes who authorized it, what operation is allowed, what object, and when it expires — all HMAC-signed by the issuer's secret key. S3 verifies the signature without a database lookup."
}
\`\`\`

\`\`\`steps
{
  "title": "Generating a Presigned GET URL",
  "steps": [
    {
      "title": "Client Requests a Presigned URL",
      "content": "Your application backend calls the S3 SDK with your IAM credentials:\\n\\n\`\`\`python\\nurl = s3.generate_presigned_url(\\n    'get_object',\\n    Params={'Bucket': 'photos', 'Key': 'cat.jpg'},\\n    ExpiresIn=3600  # 1 hour\\n)\\n\`\`\`\\n\\nThis runs **entirely client-side** — no network call to S3 is made yet."
    },
    {
      "title": "SDK Constructs the Signed URL",
      "content": "The SDK builds a canonical request string:\\n\\n\`\`\`\\nGET\\nphotos/cat.jpg\\nX-Amz-Algorithm=AWS4-HMAC-SHA256\\n&X-Amz-Credential=AKID%2F20240115%2Fus-east-1%2Fs3%2Faws4_request\\n&X-Amz-Date=20240115T120000Z\\n&X-Amz-Expires=3600\\n&X-Amz-SignedHeaders=host\\n\`\`\`\\n\\nThen computes HMAC-SHA256 over this string using your secret key, and appends \`&X-Amz-Signature=<hex>\` to the URL. The secret key never leaves your server."
    },
    {
      "title": "User Downloads Directly from S3",
      "content": "You return the presigned URL to the end-user (in an HTML \`<img src>\`, API response, email link). The user's browser hits S3 directly — **your backend proxies zero bytes**.\\n\\nS3 verifies the signature by recomputing HMAC with the same secret key. If the signature matches and the expiry hasn't passed, S3 serves the file directly. Your IAM credentials are never exposed."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Presigned PUT for Direct Uploads",
  "content": "Presigned URLs also work for PUT. Your backend generates a presigned upload URL scoped to a specific key and expiry. The browser uploads directly to S3 — no file data ever touches your application servers. This is how Dropbox, Figma, and most SaaS products handle file uploads: your upload infrastructure is literally just a URL-generation API call."
}
\`\`\`

---

## Data Partitioning for Scale

A flat namespace with billions of keys must be partitioned. The key design choice: how do you shard the metadata and the data?

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Metadata Sharding",
      "icon": "🗂️",
      "content": "Shard the metadata DB by \`hash(bucket_id + key)\`. This distributes keys evenly across shards and ensures no hot-spot from lexicographic ordering (e.g., \`log-2024-01-01\`, \`log-2024-01-02\` all hashing to different shards).\\n\\nEach shard is a PostgreSQL primary + read replicas. Strongly consistent reads go to the primary. LIST operations that span multiple shards require scatter-gather across all shards."
    },
    {
      "label": "Data Node Assignment",
      "icon": "💾",
      "content": "Use **consistent hashing** with virtual nodes to assign objects to data nodes. When a node is added or removed, only the objects on adjacent ring segments need to be remapped — not a full reshuffle.\\n\\nEach physical data node owns multiple virtual node slots (e.g., 150 virtual nodes per physical node), which ensures even distribution even with heterogeneous hardware."
    },
    {
      "label": "Hot Key Mitigation",
      "icon": "🌡️",
      "content": "A single viral object (e.g., a meme image being viewed by millions) creates a hot-spot on its data node. Mitigations:\\n\\n1. **Read replicas:** Popular objects get extra read-only replicas beyond the standard 3.\\n2. **CDN offloading:** CloudFront / edge caches absorb most reads before hitting origin.\\n3. **Key randomization:** Add a random prefix (\`a3f8/original-key\`) to distribute lexicographically sequential keys across ring shards.\\n\\nIn practice, CDN offloading is the dominant solution — S3 origin rarely sees popular-object traffic directly."
    }
  ]
}
\`\`\`

---

## Trade-Off Analysis

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Consistency Model",
      "icon": "⚖️",
      "content": "**S3's model (since 2020): Strong read-after-write consistency**\\n\\nAfter a successful PUT or DELETE, subsequent GETs and LISTs immediately reflect the change. Achieved by making all reads go through the metadata service (single source of truth) rather than reading from data nodes directly.\\n\\n**Cost:** Every GET incurs a metadata lookup. Mitigated by in-memory metadata caching on the API tier.\\n\\n**Historical note:** Before 2020, S3 had eventual consistency for overwrite PUTs and DELETEs. Millions of developers wrote defensive code around this. The migration to strong consistency without breaking APIs was a significant engineering achievement."
    },
    {
      "label": "Storage Classes",
      "icon": "❄️",
      "content": "Not all objects are accessed equally. S3 tiering maps access patterns to cost:\\n\\n| Tier | Retrieval | Use Case |\\n|------|-----------|----------|\\n| Standard | ms | Active data |\\n| Infrequent Access | ms | Monthly backups |\\n| Glacier Instant | ms | Quarterly archives |\\n| Glacier Deep | 12 hrs | Compliance, cold archives |\\n\\nTiering is implemented via lifecycle rules that physically migrate data to cheaper (slower) hardware, and update the metadata row to reflect the new storage class and retrieval SLA."
    },
    {
      "label": "CAP Theorem Position",
      "icon": "🔺",
      "content": "S3 chooses **CP during partitions** for object writes — consistency and partition tolerance over availability. If a metadata node shard becomes unreachable, writes to affected keys fail rather than accepting writes that might violate consistency.\\n\\nFor reads, S3 leans toward availability — if metadata is temporarily unreachable, stale cached metadata may be served briefly.\\n\\nThis is consistent with PACELC: during normal operation, S3 trades some latency (extra replication round-trip) for consistency."
    }
  ]
}
\`\`\`

---

## Quiz

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "A 10 GB file upload fails at 9.8 GB due to a network blip. With multi-part upload, what happens?",
      "options": [
        "The entire 10 GB must be re-uploaded from the beginning",
        "Only the failed part needs to be retried; all completed parts are retained",
        "The upload is automatically resumed by S3 from the failure point",
        "The client must call AbortMultipartUpload and start over"
      ],
      "answer": 1,
      "explanation": "Multi-part upload retains all successfully uploaded parts (each acknowledged with an ETag). Only the specific failed part needs to be re-uploaded. This is the key reliability advantage over single-PUT uploads for large files."
    },
    {
      "question": "Why does S3 store 3 replicas across 3 Availability Zones rather than 3 replicas in the same AZ?",
      "options": [
        "Cross-AZ replication is faster due to dedicated fiber links",
        "To protect against correlated failures — a single AZ outage (power, cooling, natural disaster) cannot destroy all copies",
        "Because each AZ uses different checksum algorithms and cross-verification improves durability",
        "To comply with GDPR data residency requirements"
      ],
      "answer": 1,
      "explanation": "The point of cross-AZ placement is to protect against correlated failure. If all 3 replicas were in the same AZ, a single datacenter event (fire, flood, power failure) could destroy all copies simultaneously. Separate AZs have independent power, cooling, and physical infrastructure — so failures are statistically independent."
    },
    {
      "question": "A user's browser needs to upload a 500 MB video directly to S3 without routing bytes through your application server. Which S3 feature enables this?",
      "options": [
        "Transfer Acceleration — routes uploads through CloudFront edge nodes",
        "Presigned PUT URL — a time-limited, HMAC-signed URL that authorizes a direct PUT to a specific key",
        "Cross-Origin Resource Sharing (CORS) — allows browsers to PUT to S3 domains",
        "S3 Access Points — an endpoint scoped to specific key prefixes"
      ],
      "answer": 1,
      "explanation": "A presigned PUT URL is a cryptographically signed URL that encodes: which operation (PUT), which object (bucket/key), who authorized it, and when it expires. The browser uploads directly to S3 using this URL — your backend only generates the URL, never proxies the bytes. CORS is also needed, but is not what authorizes the upload itself."
    },
    {
      "question": "An object key \`logs/2024-01-15.gz\` is overwritten 3 times in a versioning-enabled bucket. A user then calls DELETE on the key. What does a subsequent GET return?",
      "options": [
        "The most recent version before the delete",
        "404 Not Found — because a delete marker was added on top of the version stack",
        "403 Forbidden — the object is locked after deletion",
        "The original version — DELETE always rolls back to version 1"
      ],
      "answer": 1,
      "explanation": "In a versioning-enabled bucket, DELETE does not erase data — it adds a delete marker as the new 'latest version.' A plain GET sees the delete marker and returns 404. The actual versions still exist and can be retrieved by specifying a versionId. To permanently delete, you must delete the specific version IDs."
    },
    {
      "question": "What is the role of the background scrubbing job on data nodes?",
      "options": [
        "To compress old objects and move them to cheaper storage tiers",
        "To periodically re-read and verify checksums of stored chunks, detecting and triggering repair of silent data corruption",
        "To rebalance objects across data nodes when storage utilization becomes uneven",
        "To index object content for full-text search capabilities"
      ],
      "answer": 1,
      "explanation": "Silent data corruption (bit rot) occurs when stored bytes change without any write operation — due to cosmic rays, hardware degradation, or firmware bugs. Scrubbing jobs periodically re-read chunks and recompute their checksums. Mismatches indicate corruption, which triggers automatic repair from a healthy replica. This is a core mechanism behind 11-nines durability."
    }
  ]
}
\`\`\`

---

## The Write and Read Path End-to-End

\`\`\`steps
{
  "title": "Complete PUT Path (Small Object)",
  "steps": [
    {
      "title": "Auth & Routing",
      "content": "Request hits API Gateway. IAM service validates the signature and checks the bucket policy. Request is routed to the Data Service responsible for this bucket region."
    },
    {
      "title": "Checksum Verification",
      "content": "If \`Content-MD5\` header is present, the API Gateway verifies the received bytes match. If not, it computes the MD5 itself for storage."
    },
    {
      "title": "Metadata Pre-write",
      "content": "Metadata Service writes a \`PENDING\` row: \`(bucket, key, new_version_id, size, etag, IN_PROGRESS)\`. This reserves the version ID atomically."
    },
    {
      "title": "Synchronous Replication",
      "content": "Data Service pipelines bytes to AZ-1 primary node + AZ-2 replica. Both acknowledge. Data is on durable disk in 2 AZs."
    },
    {
      "title": "Metadata Commit",
      "content": "Metadata Service atomically marks the row \`COMMITTED\` and sets \`is_latest=TRUE\`. Previous version's \`is_latest\` is flipped to \`FALSE\`. This is the moment the object becomes visible to readers."
    },
    {
      "title": "Return 200 to Client",
      "content": "API Gateway returns \`200 OK\` with the \`ETag\` (MD5 hex) and the new \`x-amz-version-id\`. The client's write is durably complete."
    },
    {
      "title": "Async AZ-3 Replication",
      "content": "Background replication manager picks up the new object and copies it to AZ-3. Object now has full 3-replica durability."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Object storage uses a flat namespace (bucket + key) — there are no real directories, enabling trillion-object scale without maintaining a tree structure.",
    "Multi-part upload enables reliable transfers of large files: each part is checksummed independently, failed parts retry alone, and parts upload in parallel for maximum throughput.",
    "11-nines durability requires both checksumming (detecting corruption) and replication (repairing it) — scrubbing jobs run continuously to catch and auto-heal silent bit rot.",
    "Cross-AZ replication (not just cross-machine) is the key to surviving correlated failures. S3 uses 2 synchronous + 1 asynchronous replica as the optimal durability-latency trade-off.",
    "Versioning implements an append-only log per key: DELETEs add a marker instead of destroying data, making accidental deletion fully recoverable.",
    "Presigned URLs embed authorization in a time-limited HMAC-signed token — letting clients upload/download directly to/from S3 without routing bytes through your application servers."
  ]
}
\`\`\``,
    },
    {
      id: "design-unique-id-generator",
      slug: "design-unique-id-generator",
      title: "Design a Distributed Unique ID Generator",
      content: `# Design a Distributed Unique ID Generator

Every distributed system eventually faces a deceptively simple question: *how do you create an ID that's unique across hundreds of servers, three data centers, and billions of requests — without every machine asking a central authority for permission?*

Discord generates over 100 million unique message IDs per day. Twitter assigns a Snowflake ID to every tweet, like, and follow event. These IDs look like ordinary 64-bit integers, but they encode timestamps, machine identities, and sequence numbers — and they're generated with zero inter-machine coordination.

In this lesson, you'll evaluate three industry approaches, understand why Twitter's Snowflake design became the de facto standard, and implement a working generator from scratch.

\`\`\`concept
{ "title": "What Makes a Good Distributed ID?", "variant": "rule", "content": "A production-grade distributed ID must satisfy five properties simultaneously: (1) **Globally unique** — no two IDs are ever the same, across any server or time. (2) **Time-ordered** — IDs issued later are numerically larger, enabling chronological sorting. (3) **64-bit integer** — fits a standard database BIGINT column, B-tree friendly. (4) **High throughput** — millions of IDs per second with no coordination bottleneck. (5) **Fault tolerant** — any single server generates IDs independently, even during partial network failure." }
\`\`\`

## Functional Requirements

Before comparing approaches, nail down the requirements. Any solution must satisfy all of these:

| Requirement | Target |
|---|---|
| Uniqueness | Globally unique across all nodes |
| Format | 64-bit unsigned integer |
| Ordering | Time-ordered (later ID > earlier ID) |
| Throughput | ≥ 10,000 IDs/second per node |
| Availability | Works during partial network partition |
| Latency | < 1ms per generation, no blocking |

## Three Approaches: A Comparison

\`\`\`tabs
{ "tabs": [ { "label": "DB Auto-Increment", "icon": "🗄️", "content": "### Database Auto-Increment\\n\\nThe simplest approach: a single database table with \`AUTO_INCREMENT\`. Every service calls \`INSERT\`, reads back the generated key.\\n\\n\`\`\`sql\\nCREATE TABLE id_generator (\\n  id   BIGINT AUTO_INCREMENT PRIMARY KEY,\\n  stub CHAR(1) NOT NULL DEFAULT ''\\n);\\nINSERT INTO id_generator (stub) VALUES ('');\\nSELECT LAST_INSERT_ID();\\n\`\`\`\\n\\n**Pros:**\\n- Trivial to implement\\n- Strictly ordered with no gaps\\n- No client-side logic\\n\\n**Cons:**\\n- **Single point of failure** — the DB goes down, nothing generates IDs\\n- **Performance bottleneck** — every ID requires a network round-trip and a write lock\\n- Horizontal scaling requires complex sharding (even/odd splits, range buckets)\\n- At Twitter-scale, a single DB cannot sustain thousands of writes per second for IDs alone\\n\\n**Multi-master variant:** Two databases, one issues evens, one issues odds. Scales to two nodes. Not to a thousand.\\n\\n**Verdict:** Works for small, single-region systems. Collapses at distributed scale." }, { "label": "UUID v4", "icon": "🎲", "content": "### UUID v4 (Universally Unique Identifier)\\n\\nUUID v4 generates a 128-bit random identifier. Any server generates one instantly with zero coordination.\\n\\n\`\`\`python\\nimport uuid\\nuid = uuid.uuid4()\\n# 550e8400-e29b-41d4-a716-446655440000\\nprint(type(uid))   # <class 'uuid.UUID'>\\nprint(uid.int)     # 113059749145936325402354257176981405696\\n\`\`\`\\n\\n**Pros:**\\n- Fully decentralized — no coordination whatsoever\\n- Extremely low collision probability (~10⁻³⁸)\\n- Native support in every language and framework\\n\\n**Cons:**\\n- **128 bits** — twice the storage of a BIGINT (16 bytes vs 8 bytes)\\n- **Not sortable** — v4 UUIDs are random; you cannot tell which came first\\n- Random values cause B-tree index fragmentation, slowing inserts and range queries\\n- Discord measured that random UUIDs consumed **40% more storage** vs Snowflake for their message ID column\\n- Human-unfriendly in URLs and logs\\n\\n**UUIDv7 (2023 RFC standard):** Adds a 48-bit millisecond timestamp prefix to fix ordering. Gaining adoption, but not yet universal.\\n\\n**Verdict:** Excellent when ordering doesn't matter. Poor fit for time-series data or high-volume indexed columns." }, { "label": "Twitter Snowflake", "icon": "❄️", "content": "### Twitter Snowflake\\n\\nTwitter open-sourced Snowflake in 2010 to solve their own ID problem at scale. It packs a timestamp, machine ID, and sequence counter into a single **64-bit integer** — producing time-ordered, globally unique IDs with zero runtime coordination.\\n\\n**64-bit structure:**\\n\`\`\`\\n0 | 41-bit timestamp | 10-bit worker ID | 12-bit sequence\\n↑         ↑                  ↑                  ↑\\nsign  ms since epoch    1024 machines     4096 IDs/ms\\n\`\`\`\\n\\n**Maximum throughput:**\\n\`1,024 workers × 4,096 IDs/ms × 1,000 ms/sec ≈ 4.2 billion IDs/second\`\\n\\n**Pros:**\\n- 64-bit integer — fits BIGINT, optimal for B-tree indexes\\n- Time-ordered — later IDs are always numerically larger\\n- Decentralized — each worker generates IDs with no inter-worker calls\\n- Sub-millisecond generation latency\\n- ~69-year range before timestamp bits overflow\\n\\n**Cons:**\\n- Clock drift breaks ordering guarantees (NTP corrections can move clocks backward)\\n- Worker ID assignment requires one-time coordination at startup\\n\\n**Verdict:** The industry standard for large-scale distributed systems. Used by Twitter, Discord, Instagram, and many others." } ] }
\`\`\`

## Inside the Snowflake: Bit Layout

A Snowflake ID is a 64-bit integer with a precise internal structure. Understanding the bit fields explains both the power and constraints of the design.

\`\`\`algoviz
{ "title": "Snowflake ID — 64-Bit Field Breakdown", "type": "array", "data": ["Sign (1 bit)", "Timestamp (41 bits)", "Worker ID (10 bits)", "Sequence (12 bits)"], "frames": [ { "highlight": [0], "label": "Bit 63: Always 0. Keeps the ID positive as a signed 64-bit integer — safe in languages that lack unsigned types.", "stats": { "bits": 1, "range": "0 only" } }, { "highlight": [1], "label": "Bits 22-62: Milliseconds since a custom epoch (e.g., Jan 1 2015). 2^41 ms ≈ 69 years of unique timestamps.", "stats": { "bits": 41, "range": "~69 years", "max": "2.2 trillion ms" } }, { "highlight": [2], "label": "Bits 12-21: Worker or machine ID. 2^10 = 1,024 unique workers. Often split as 5 datacenter bits + 5 machine bits.", "stats": { "bits": 10, "max_workers": 1024 } }, { "highlight": [3], "label": "Bits 0-11: Sequence counter. 2^12 = 4,096 unique IDs per millisecond per worker. Resets to 0 each new millisecond.", "stats": { "bits": 12, "max_per_ms": 4096 } }, { "highlight": [1, 2, 3], "label": "Combined: timestamp in the MSB position ensures time-ordering. Worker ID + sequence guarantee uniqueness within the same millisecond.", "stats": { "total_capacity": "4.2B IDs/sec" } } ], "speed": 1100 }
\`\`\`

### Why Left-Shifting the Timestamp Matters

The final ID is assembled with three bitwise operations:

\`\`\`
id = (timestamp_ms << 22) | (worker_id << 12) | sequence
\`\`\`

Placing the timestamp in the **most significant bits** (shifted left by 22) means any ID generated 1ms later has a larger timestamp component that numerically dominates the smaller worker and sequence fields. This is why IDs are *k-sortable*: sorting by ID value is approximately equivalent to sorting by creation time.

## Step-by-Step: Generating One ID

\`\`\`trace
{ "title": "Snowflake ID Generation — Variable Trace", "language": "python", "code": "EPOCH = 1420070400000\\nworker_id = 3\\nsequence = 0\\nlast_ms = -1\\n\\nnow_ms = current_time_ms() - EPOCH\\n\\nif now_ms == last_ms:\\n    sequence = (sequence + 1) & 0xFFF\\nelse:\\n    sequence = 0\\n\\nlast_ms = now_ms\\n\\nTIMESTAMP_SHIFT = 22\\nWORKER_SHIFT = 12\\n\\nuid = (now_ms << TIMESTAMP_SHIFT) | (worker_id << WORKER_SHIFT) | sequence", "frames": [ { "line": 1, "vars": { "EPOCH": 1420070400000 }, "note": "Custom epoch: Jan 1, 2015 in Unix milliseconds. A recent epoch maximizes the usable range of 41 timestamp bits." }, { "line": 2, "vars": { "EPOCH": 1420070400000, "worker_id": 3 }, "note": "This instance is Worker 3 of 1,024 possible workers. Assigned once at startup — typically via ZooKeeper." }, { "line": 3, "vars": { "sequence": 0, "worker_id": 3 }, "note": "Sequence counter starts at 0. Increments within a millisecond, resets when the clock advances." }, { "line": 6, "vars": { "now_ms": 163717284, "last_ms": -1 }, "note": "now_ms = wall-clock milliseconds minus our custom epoch. ~163 million ms ≈ 4.8 years after epoch." }, { "line": 8, "vars": { "now_ms": 163717284, "last_ms": -1 }, "note": "now_ms (163717284) != last_ms (-1) — this is a fresh millisecond. Take the else branch." }, { "line": 11, "vars": { "sequence": 0 }, "note": "Reset sequence to 0. This is the first ID in millisecond 163717284 for worker 3." }, { "line": 13, "vars": { "last_ms": 163717284 }, "note": "Record this millisecond. The next call will check whether we're still inside it." }, { "line": 15, "vars": { "TIMESTAMP_SHIFT": 22, "WORKER_SHIFT": 12 }, "note": "Shift amounts from bit field sizes: sequence occupies 12 bits, worker occupies 10 bits above that." }, { "line": 18, "vars": { "uid": 686122824237056 }, "note": "Final 64-bit ID assembled. The timestamp dominates the value — later calls produce larger integers." } ], "speed": 950 }
\`\`\`

## Full Python Implementation

\`\`\`playground
{ "title": "Snowflake ID Generator — Complete Implementation", "language": "python", "code": "import time\\nimport threading\\n\\nclass SnowflakeGenerator:\\n    \\"\\"\\"Twitter Snowflake-style 64-bit distributed ID generator.\\"\\"\\"\\n\\n    # Custom epoch: Jan 1, 2015 in milliseconds (Unix)\\n    EPOCH = 1420070400000\\n\\n    # Bit field sizes\\n    WORKER_BITS   = 10\\n    SEQUENCE_BITS = 12\\n\\n    # Derived constants\\n    MAX_WORKER_ID = (1 << WORKER_BITS) - 1     # 1023\\n    MAX_SEQUENCE  = (1 << SEQUENCE_BITS) - 1   # 4095\\n    WORKER_SHIFT  = SEQUENCE_BITS              # 12\\n    TIMESTAMP_SHIFT = SEQUENCE_BITS + WORKER_BITS  # 22\\n\\n    def __init__(self, worker_id: int):\\n        if not 0 <= worker_id <= self.MAX_WORKER_ID:\\n            raise ValueError(f\\"worker_id must be 0-{self.MAX_WORKER_ID}\\")\\n        self.worker_id = worker_id\\n        self.sequence  = 0\\n        self.last_ms   = -1\\n        self._lock     = threading.Lock()\\n\\n    def _now_ms(self) -> int:\\n        return int(time.time() * 1000) - self.EPOCH\\n\\n    def generate(self) -> int:\\n        with self._lock:\\n            now = self._now_ms()\\n\\n            if now == self.last_ms:\\n                # Same millisecond — bump the sequence counter\\n                self.sequence = (self.sequence + 1) & self.MAX_SEQUENCE\\n                if self.sequence == 0:\\n                    # 4,096 IDs exhausted — busy-wait for the next millisecond\\n                    while now <= self.last_ms:\\n                        now = self._now_ms()\\n            else:\\n                # New millisecond — reset sequence\\n                self.sequence = 0\\n\\n            self.last_ms = now\\n\\n            return (\\n                (now            << self.TIMESTAMP_SHIFT) |\\n                (self.worker_id << self.WORKER_SHIFT)    |\\n                self.sequence\\n            )\\n\\n    @staticmethod\\n    def decode(uid: int) -> dict:\\n        \\"\\"\\"Reverse-engineer the three components from a Snowflake ID.\\"\\"\\"\\n        sequence  = uid & 0xFFF\\n        worker_id = (uid >> 12) & 0x3FF\\n        ts_ms     = (uid >> 22) + SnowflakeGenerator.EPOCH\\n        return {\\n            \\"id\\":        uid,\\n            \\"timestamp_ms\\": ts_ms,\\n            \\"worker_id\\": worker_id,\\n            \\"sequence\\":  sequence,\\n        }\\n\\n\\n# ── Demo ──────────────────────────────────────────────────────────────\\ngen = SnowflakeGenerator(worker_id=42)\\n\\nprint(\\"Five IDs from worker 42:\\")\\nids = [gen.generate() for _ in range(5)]\\nfor uid in ids:\\n    d = SnowflakeGenerator.decode(uid)\\n    print(f\\"  {uid}  |  ts={d['timestamp_ms']}ms  worker={d['worker_id']}  seq={d['sequence']}\\")\\n\\nprint()\\nprint(f\\"Sortable: {ids == sorted(ids)}\\")\\nprint(f\\"Unique:   {len(ids) == len(set(ids))}\\")\\n\\n# Cross-worker uniqueness test\\ngen_a = SnowflakeGenerator(worker_id=1)\\ngen_b = SnowflakeGenerator(worker_id=2)\\nids_a = {gen_a.generate() for _ in range(200)}\\nids_b = {gen_b.generate() for _ in range(200)}\\nprint()\\nprint(f\\"Worker 1 generated: {len(ids_a)} IDs\\")\\nprint(f\\"Worker 2 generated: {len(ids_b)} IDs\\")\\nprint(f\\"Collisions between workers: {len(ids_a & ids_b)}\\")\\n", "runnable": true }
\`\`\`

## Edge Cases You Must Handle

\`\`\`callout
{ "type": "warning", "title": "Clock Drift: Snowflake's Critical Failure Mode", "content": "If a server's system clock moves **backward** (via NTP correction or VM migration), the generator could produce an ID with a smaller timestamp than a previously issued one — breaking sort order or, in the worst case, creating duplicate IDs within the same worker.\\n\\n**The standard mitigations:**\\n1. **Refuse to generate** when \`now_ms < last_ms\` and busy-wait until the clock catches up (safe for small drift)\\n2. **Raise an exception** for drift exceeding a threshold (e.g., 10ms) and alert the on-call engineer\\n3. **Monitor NTP drift** with your infrastructure tooling; alert before drift accumulates\\n4. **Use monotonic clocks** (\`time.monotonic()\`) for the sequence counter — they never go backward within a single process lifetime\\n\\nUUIDv7 sidesteps this by using a sub-millisecond monotonic counter that increments regardless of wall-clock changes." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: How Worker IDs Are Assigned in Production", "content": "Worker IDs must be **unique per running instance** — two workers sharing the same ID will produce collisions within the same millisecond. Several assignment strategies exist:\\n\\n**ZooKeeper ephemeral nodes** (Twitter's original approach)\\nEach worker creates an ephemeral node under \`/snowflake/workers/\`. ZooKeeper guarantees uniqueness across all registrations and automatically releases the node if the worker process crashes or loses its session heartbeat.\\n\\n**Consul/etcd distributed lock**\\nWorker acquires a TTL-based lock and registers its chosen ID. If heartbeating stops, the lock expires and a replacement worker can claim the ID.\\n\\n**Kubernetes StatefulSet ordinals**\\nIn container orchestration, a \`StatefulSet\` names pods \`pod-0\`, \`pod-1\`, \`pod-2\`, etc. Inject \`WORKER_ID\` as an environment variable from the ordinal index. Zero coordination required — the scheduler guarantees uniqueness. Elegant for known-scale deployments.\\n\\n**Hash-derived IDs**\\nSome systems hash \`hostname + PID + startup_timestamp_ns\` and take the low 10 bits as the worker ID. Accepts a tiny collision probability (~0.1% at 1,024 workers) in exchange for eliminating the coordination dependency entirely.\\n\\n**The key insight:** Worker ID coordination only happens *once at startup*, not per-ID. Even ZooKeeper overhead is acceptable when it's a one-time cost for a process that will run for days." }
\`\`\`

## Practice: Bit Packing

\`\`\`fillblank
{ "title": "Implement the core Snowflake bit-packing logic", "prompt": "Complete the function that assembles a Snowflake ID from its three components. Remember: timestamp occupies bits 22-62 (shift left by 22), worker_id occupies bits 12-21 (shift left by 12), and sequence fills the bottom 12 bits.", "language": "python", "template": "def pack_snowflake(timestamp_ms: int, worker_id: int, sequence: int) -> int:\\n    TIMESTAMP_SHIFT = ___\\n    WORKER_SHIFT    = ___\\n    return (timestamp_ms << TIMESTAMP_SHIFT) | (worker_id << WORKER_SHIFT) | ___\\n\\ndef extract_sequence(uid: int) -> int:\\n    # Mask out everything except the bottom 12 bits\\n    return uid & ___\\n\\ndef extract_worker(uid: int) -> int:\\n    # Shift right past the 12 sequence bits, then mask 10 bits\\n    return (uid >> 12) & ___", "blanks": [ { "answer": "22", "hint": "Sequence occupies 12 bits + worker occupies 10 bits above that. Total shift = ?" }, { "answer": "12", "hint": "Sequence is in the bottom 12 bits. Worker shifts directly above it." }, { "answer": "sequence", "hint": "The sequence fills bits 0-11 as-is — no shift needed, it's already at the LSB." }, { "answer": "0xFFF", "hint": "0xFFF = 4095 = 2^12 - 1. This bitmask isolates exactly 12 bits." }, { "answer": "0x3FF", "hint": "0x3FF = 1023 = 2^10 - 1. This bitmask isolates exactly 10 bits." } ] }
\`\`\`

## Production Architecture

\`\`\`sysdiag
{ "title": "Distributed ID Generator — Production Deployment", "width": 660, "height": 340, "nodes": [ { "id": "clients", "label": "Client Services", "x": 60, "y": 170, "kind": "client" }, { "id": "lb", "label": "Load Balancer", "x": 200, "y": 170, "kind": "service" }, { "id": "w1", "label": "ID Worker 1\\nworker_id=0", "x": 380, "y": 70, "kind": "service" }, { "id": "w2", "label": "ID Worker 2\\nworker_id=1", "x": 380, "y": 170, "kind": "service" }, { "id": "w3", "label": "ID Worker 3\\nworker_id=2", "x": 380, "y": 270, "kind": "service" }, { "id": "zk", "label": "ZooKeeper\\n(ID registry)", "x": 560, "y": 170, "kind": "database" } ], "edges": [ { "from": "clients", "to": "lb", "label": "GET /id" }, { "from": "lb", "to": "w1", "label": "" }, { "from": "lb", "to": "w2", "label": "" }, { "from": "lb", "to": "w3", "label": "" }, { "from": "w1", "to": "zk", "label": "claim on startup" }, { "from": "w2", "to": "zk", "label": "" }, { "from": "w3", "to": "zk", "label": "" } ], "annotations": { "lb": "Distributes requests across workers using round-robin or least-connections. Workers are completely stateless from the load balancer's perspective — no sticky sessions needed.", "w1": "Once assigned a worker_id at startup, each worker generates IDs in-memory with no network calls per ID. Sub-millisecond latency guaranteed.", "zk": "ZooKeeper is consulted only at startup to claim a worker_id slot. If a worker crashes, its ephemeral ZooKeeper node is deleted and the ID is recycled.", "clients": "Any downstream service (user service, order service, messaging) calls the ID generator. It's a lightweight HTTP service, not a database." } }
\`\`\`

## Knowledge Check

\`\`\`quiz
{ "title": "Distributed Unique ID Generator", "questions": [ { "question": "A Snowflake worker with worker_id=5 issues its 4,096th ID within the current millisecond. What happens when the 4,097th ID is requested in the same millisecond?", "options": [ "Returns a duplicate ID, silently risking collision", "Throws an exception and the request fails immediately", "Busy-waits until the clock advances to the next millisecond, then resets the sequence to 0", "Borrows capacity from worker_id=6 by temporarily changing its identity" ], "answer": 2, "explanation": "When the 12-bit sequence counter overflows (reaching 4,096 = 2^12), the generator busy-waits until \`now_ms > last_ms\`. Once the clock ticks forward, the sequence resets to 0 and generation resumes. This deliberately slows throughput rather than risking uniqueness — a correct trade-off." }, { "question": "Why does Snowflake shift the timestamp into the most significant bits (left-shifted by 22)?", "options": [ "To reduce storage size — timestamps compress better at higher bit positions", "So that IDs issued at a later time are always numerically larger, enabling chronological sort order", "To make worker_id and sequence extraction easier via simple bit masks", "Timestamps are placed there by convention only — bit position has no functional effect" ], "answer": 1, "explanation": "In a 64-bit integer, more significant bits carry greater numerical weight. By occupying bits 22-62, the timestamp dominates the integer value. Any ID generated even 1ms later has a larger timestamp component that overrides any difference in the lower worker_id and sequence bits. This is why Snowflake IDs are k-sortable: sorting by ID value approximates sorting by creation time." }, { "question": "Discord migrated from UUID v4 to Snowflake IDs for message storage. What was the primary technical motivation?", "options": [ "UUID v4 requires a central coordinator; Snowflake is fully decentralized", "UUID v4 is 128-bit and non-sortable — consuming ~40% more storage and making chronological range queries significantly slower", "UUID v4 collision probability was too high at Discord's message volume", "UUID v4 values cannot be indexed in PostgreSQL" ], "answer": 1, "explanation": "Discord's engineering team specifically measured a 40% storage overhead for UUID v4 vs Snowflake (128-bit string vs 64-bit integer). More critically, random UUIDs fragment B-tree indexes because there's no correlation between UUID value and insertion time. Snowflake IDs cluster recent messages together on disk, making range queries like 'load messages after ID X' orders of magnitude faster." }, { "question": "Worker A (worker_id=0) generates IDs with sequences 0, 1, 2 in the same millisecond. Worker B (worker_id=1) simultaneously generates IDs with sequences 0, 1, 2 in the same millisecond. Are any of these six IDs duplicates?", "options": [ "Yes — identical sequence numbers in the same millisecond cause collisions", "No — the worker_id bits differ, so all six integers are globally unique", "Only if both workers share the same datacenter ID", "Yes — sequence 0 is reserved and cannot be used by multiple workers simultaneously" ], "answer": 1, "explanation": "Worker ID occupies bits 12-21 of the final integer. Worker 0 produces 0b0000000000 in those bits; Worker 1 produces 0b0000000001. Even with an identical timestamp and sequence, the resulting 64-bit integers are arithmetically different. This partitioning of the ID space by worker_id is the core mechanism that makes decentralized generation safe." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "**DB auto-increment** is simple but creates a single point of failure and write-lock bottleneck — it breaks under distributed scale.", "**UUID v4** is fully decentralized but 128-bit, unsortable, and index-unfriendly; UUIDv7 adds timestamp ordering but is not yet universally supported.", "**Twitter Snowflake** packs a 41-bit timestamp, 10-bit worker ID, and 12-bit sequence into one 64-bit integer — time-ordered, decentralized, and B-tree optimal.", "The timestamp in the **most significant bits** makes Snowflake IDs k-sortable: numerically larger always means temporally later.", "**Clock drift is the critical failure mode** — generators must refuse or busy-wait when \`now < last_ms\` to preserve uniqueness and ordering guarantees.", "Worker ID assignment needs one-time coordination at startup (ZooKeeper, Kubernetes ordinals) — not per ID — so it adds no per-request latency." ] }
\`\`\``,
      starterCode: `import time
import threading

# Snowflake ID Layout (64 bits total):
# [sign: 1] [timestamp_ms: 41] [datacenter_id: 5] [worker_id: 5] [sequence: 12]

EPOCH = 1_700_000_000_000  # Custom epoch (ms) — Nov 2023

MAX_DATACENTER_ID = (1 << 5) - 1  # 31
MAX_WORKER_ID     = (1 << 5) - 1  # 31
MAX_SEQUENCE      = (1 << 12) - 1 # 4095


class SnowflakeGenerator:
    def __init__(self, datacenter_id: int, worker_id: int):
        # TODO: Validate datacenter_id is in range [0, MAX_DATACENTER_ID]
        # Raise ValueError with a clear message if out of range

        # TODO: Validate worker_id is in range [0, MAX_WORKER_ID]
        # Raise ValueError with a clear message if out of range

        self.datacenter_id = datacenter_id
        self.worker_id = worker_id
        self.sequence = 0
        self._last_timestamp = -1
        self._lock = threading.Lock()

    def _current_ms(self) -> int:
        """Return current time in milliseconds since custom epoch."""
        # TODO: Return int(time.time() * 1000) minus EPOCH
        pass

    def _wait_next_ms(self, last_ts: int) -> int:
        """Spin until the clock advances past last_ts."""
        # TODO: Loop calling _current_ms() until the result is greater than last_ts
        # Return the new timestamp
        pass

    def next_id(self) -> int:
        """Generate the next unique Snowflake ID (thread-safe)."""
        with self._lock:
            ts = self._current_ms()

            # TODO: If ts < self._last_timestamp, the clock moved backward.
            # Raise RuntimeError — we cannot generate safe IDs in this case.

            if ts == self._last_timestamp:
                # TODO: Increment self.sequence, masked to MAX_SEQUENCE bits
                # If sequence overflows (wraps to 0), wait for the next millisecond
                pass
            else:
                # TODO: Reset self.sequence to 0 (new millisecond)
                pass

            self._last_timestamp = ts

            # TODO: Combine the parts into a single 64-bit integer:
            # Shift ts left by 22 bits  (10 worker/dc bits + 12 sequence bits)
            # Shift datacenter_id left by 17 bits (5 worker bits + 12 sequence bits)
            # Shift worker_id left by 12 bits
            # OR all parts together with self.sequence
            # Return the result
            pass


# --- Quick smoke test ---
if __name__ == "__main__":
    gen = SnowflakeGenerator(datacenter_id=1, worker_id=1)

    ids = [gen.next_id() for _ in range(5)]
    print("Generated IDs:", ids)

    # TODO: Assert the list is strictly increasing (k-sortable property)
    # Hint: ids == sorted(ids)
`,
      solutionCode: `import time
import threading

# Snowflake ID Layout (64 bits total):
# [sign: 1] [timestamp_ms: 41] [datacenter_id: 5] [worker_id: 5] [sequence: 12]
#
# This gives us:
#   ~69 years of timestamps before overflow
#   32 datacenters × 32 workers = 1,024 unique nodes
#   4,096 IDs per millisecond per node  → ~4M IDs/sec across a 1,024-node cluster

EPOCH = 1_700_000_000_000  # Custom epoch (ms) — Nov 2023

MAX_DATACENTER_ID = (1 << 5) - 1  # 31
MAX_WORKER_ID     = (1 << 5) - 1  # 31
MAX_SEQUENCE      = (1 << 12) - 1 # 4095


class SnowflakeGenerator:
    def __init__(self, datacenter_id: int, worker_id: int):
        if not (0 <= datacenter_id <= MAX_DATACENTER_ID):
            raise ValueError(f"datacenter_id must be 0–{MAX_DATACENTER_ID}, got {datacenter_id}")
        if not (0 <= worker_id <= MAX_WORKER_ID):
            raise ValueError(f"worker_id must be 0–{MAX_WORKER_ID}, got {worker_id}")

        self.datacenter_id = datacenter_id
        self.worker_id = worker_id
        self.sequence = 0
        self._last_timestamp = -1
        self._lock = threading.Lock()

    def _current_ms(self) -> int:
        """Return current time in milliseconds since custom epoch."""
        return int(time.time() * 1000) - EPOCH

    def _wait_next_ms(self, last_ts: int) -> int:
        """Spin until the clock advances past last_ts."""
        ts = self._current_ms()
        while ts <= last_ts:
            ts = self._current_ms()
        return ts

    def next_id(self) -> int:
        """Generate the next unique Snowflake ID (thread-safe)."""
        with self._lock:
            ts = self._current_ms()

            # Guard against NTP-induced clock rollback
            if ts < self._last_timestamp:
                raise RuntimeError(
                    f"Clock moved backward by {self._last_timestamp - ts} ms. Refusing to generate ID."
                )

            if ts == self._last_timestamp:
                # Same millisecond — increment sequence, mask to 12 bits
                self.sequence = (self.sequence + 1) & MAX_SEQUENCE
                if self.sequence == 0:
                    # Sequence exhausted for this ms — wait for next ms
                    ts = self._wait_next_ms(self._last_timestamp)
            else:
                # New millisecond — reset sequence
                self.sequence = 0

            self._last_timestamp = ts

            # Pack the 64-bit ID:
            #   bits 63–22 : timestamp  (41 bits)
            #   bits 21–17 : datacenter (5 bits)
            #   bits 16–12 : worker     (5 bits)
            #   bits 11–0  : sequence   (12 bits)
            return (
                (ts                 << 22) |
                (self.datacenter_id << 17) |
                (self.worker_id     << 12) |
                self.sequence
            )


# --- Quick smoke test ---
if __name__ == "__main__":
    gen = SnowflakeGenerator(datacenter_id=1, worker_id=1)

    ids = [gen.next_id() for _ in range(5)]
    print("Generated IDs:", ids)

    # k-sortable: later IDs are numerically larger because timestamp occupies the high bits
    assert ids == sorted(ids), "IDs must be strictly increasing!"
    assert len(set(ids)) == len(ids), "IDs must be unique!"
    print("All assertions passed — IDs are unique and time-ordered.")
`,
    },
    {
      id: "checkpoint-core-systems",
      slug: "checkpoint-core-systems",
      title: "Checkpoint: Core Systems Trade-off Review",
      content: `# Checkpoint: Core Systems Trade-off Review

At senior and staff engineer levels, interviews don't ask you to *design* a URL shortener — they ask you to *defend every decision you made*. "You chose Base62 encoding — walk me through exactly what breaks first under adversarial load." This checkpoint trains that muscle. You've now designed four foundational systems. The goal here is not to re-explain the architecture, but to interrogate every key decision through the lens of real-world consequences.

\`\`\`concept
{
  "title": "The Trade-off Decision Framework",
  "variant": "mental-model",
  "content": "Every architectural decision is a trade — you gain something, and you give something up. Senior engineers are evaluated not on whether they know the 'right' answer, but on whether they can articulate three things: (1) what you are optimizing for, (2) what you are sacrificing, and (3) under what conditions that trade breaks down. Master this three-part structure for every decision, and the interview answers themselves become secondary."
}
\`\`\`

## The Four Systems at a Glance

Before drilling into targeted questions, here is a rapid-fire breakdown of the core decisions made in each case study — and the specific question each decision was answering.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "URL Shortener",
      "icon": "🔗",
      "content": "**Core Problem:** Generate a short, unique alias for an arbitrary long URL and resolve it with sub-10ms latency at scale.\\n\\n**Key Decisions Made:**\\n\\n- **ID generation → Counter + Base62:** Avoids hash collisions without a lookup table; accepts enumeration risk\\n- **Storage → Redis + PostgreSQL:** Redis for hot-path reads (p99 < 1ms), PostgreSQL for durable writes and analytics\\n- **Cache TTL → 24h:** Reduces DB reads for the 80% of traffic hitting popular links; accepts staleness window on delete\\n- **Consistency model → Eventual reads, strong writes:** A stale redirect is tolerable; a lost write is not\\n- **Redirect type → HTTP 302 over 301:** 301 is browser-cached permanently — you lose analytics and cannot revoke; 302 hits your server every time\\n\\n**The key insight:** URL shorteners are read-dominated at roughly 100:1 read/write ratio. Every decision bends toward read throughput, accepting minor staleness and some security exposure as the price."
    },
    {
      "label": "Key-Value Store",
      "icon": "🗄️",
      "content": "**Core Problem:** Build a distributed, fault-tolerant store that handles millions of reads and writes per second across commodity hardware.\\n\\n**Key Decisions Made:**\\n\\n- **Storage engine → LSM-tree (RocksDB):** Converts random writes to sequential I/O via memtable + SSTables; accepts read amplification\\n- **Consistency → Tunable quorum (N, W, R):** Lets each caller set its own consistency level per operation\\n- **Conflict resolution → Vector clocks or LWW:** Handle concurrent writes in a multi-master topology; each carries a different trade\\n- **Partitioning → Consistent hashing:** Add/remove nodes without rehashing the entire keyspace\\n- **Membership → Gossip protocol:** Propagate cluster state without a central coordinator; accepts eventual propagation delay\\n\\n**The key insight:** The KV store's power is in the tunable consistency lever. There is no single right setting — DynamoDB, Cassandra, and Riak all expose (N, W, R) because the correct trade depends on the caller's workload, not the store's designer."
    },
    {
      "label": "Search Typeahead",
      "icon": "🔍",
      "content": "**Core Problem:** Return ranked autocomplete suggestions within 100ms for millions of concurrent users while keeping results fresh relative to query trends.\\n\\n**Key Decisions Made:**\\n\\n- **Data structure → In-memory trie with frequency scores:** O(k) prefix lookup where k = number of suggestions returned\\n- **Update mechanism → Async aggregator, pushed every N minutes:** Decouples trending data ingestion from the serving hot path\\n- **Data locality → Trie per app server:** Eliminates network hops on the critical read path; accepts inter-server divergence\\n- **Personalization → User top-N overlay merged at query time:** Blends global popularity with personal history without personalizing the shared trie\\n- **Geo-sharding → Regional trie instances:** Surfaces locally relevant suggestions; accepts cross-region inconsistency\\n\\n**The key insight:** Typeahead is latency-sensitive above all else. Every design decision trades freshness, consistency, or cost to keep p99 latency under 100ms. The trie update lag is not a bug — it is a deliberate trade."
    },
    {
      "label": "Object Storage",
      "icon": "🪣",
      "content": "**Core Problem:** Store billions of binary objects with 11 nines of durability, elastic throughput, and cost-efficient storage at petabyte scale.\\n\\n**Key Decisions Made:**\\n\\n- **Durability → Erasure coding for cold, replication for hot:** Matches reconstruction cost against access frequency\\n- **Metadata → Separate distributed KV service:** Decouples high-frequency metadata lookups from low-frequency bulk data reads\\n- **Data placement → Rack-aware and zone-aware:** Survives rack and AZ failures without full cross-region replication cost\\n- **Upload path → Multipart upload:** Handles large files without connection timeouts; enables parallel ingest and resumable uploads\\n- **Access tiers → Hot / warm / cold / archive:** Matches storage cost directly to access frequency; users pay only for what they need\\n\\n**The key insight:** Object storage optimizes for write-once, read-sometimes at massive scale. Durability and cost dominate every decision. Performance is a secondary constraint for the vast majority of objects."
    }
  ]
}
\`\`\`

## The Trade-off Under the Microscope

One decision spans the object storage and key-value store designs alike: **replication versus erasure coding**. Both protect against data loss, but they make opposite bets about what is more expensive — storage bytes or CPU cycles.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "3× Full Replication",
    "code": "Strategy: copy the full object to 3 independent nodes\\nStorage overhead: 3.0×\\nRecovery: read directly from any surviving replica — trivial, near-instant\\nReconstruction CPU: near zero\\nWrite path: wait for W=2 acknowledgements — fast\\nSurvivability: tolerates up to 2 simultaneous node failures per shard\\n\\nBest for: hot-tier data, small objects, latency-sensitive access patterns"
  },
  "after": {
    "label": "6+3 Reed-Solomon Erasure Coding",
    "code": "Strategy: split into 6 data shards + 3 parity shards across nodes\\nStorage overhead: ~1.5×\\nRecovery: read any 6 of 9 shards, reconstruct via XOR operations\\nReconstruction CPU: significant — scales with object size\\nWrite path: encode + write 9 shards — higher latency than replication\\nSurvivability: tolerates up to 3 simultaneous shard failures\\n\\nBest for: cold/archive data, large objects, cost-sensitive storage at scale"
  }
}
\`\`\`

Amazon S3 uses **both**: replication for Standard-tier objects (hot) and erasure coding for Glacier (cold). The question is never which is *better* — it is which matches the access pattern and cost envelope for that tier.

\`\`\`collapse
{
  "title": "Deep Dive: Applying CAP Theorem Across All Four Systems",
  "content": "The CAP theorem states that a distributed system can guarantee at most two of: **Consistency**, **Availability**, and **Partition tolerance**. Since network partitions are a real-world given, every system chooses between CP (consistent under partition) and AP (available under partition).\\n\\n**URL Shortener → AP**\\nA stale redirect that sends a user to a URL updated 30 seconds ago is invisible to them. An error page during a partition is not. Choose AP without hesitation. The risk of staleness is bounded by your TTL.\\n\\n**Key-Value Store → Tunable (caller decides)**\\nThis is the defining insight of DynamoDB and Cassandra. For a shopping cart, AP is correct — losing an item added to cart is worse than showing a slightly stale cart. For a bank balance read immediately after a debit, CP is mandatory. Expose the lever; don't hardcode the answer.\\n\\n**Search Typeahead → AP**\\nServing slightly stale suggestions (a trending term missing for 10 minutes) is invisible noise. A 500ms timeout resolving a partition absolutely violates the 100ms SLA. Choose AP aggressively.\\n\\n**Object Storage → CP for metadata, AP for data**\\nThe metadata service mapping object keys to physical locations must be consistent — routing a GET to the wrong storage node is catastrophic. But the object data itself can tolerate eventual propagation of a new write across replicas. Apply the correct model per component, not per system.\\n\\n**The interview answer:** Never say 'I choose CP' or 'I choose AP' for an entire system. Sophisticated candidates decompose the system into components and apply the appropriate model to each. The metadata layer of a nominally AP system often needs to be CP."
}
\`\`\`

---

## 10 Trade-off Questions: Interview Style

These questions mirror the targeting of senior and staff engineer system design interviews at companies like Google, Meta, Amazon, and Stripe. For each question, identify the correct answer — then study the explanation to understand why the alternatives fail.

\`\`\`quiz
{
  "title": "Core Systems Trade-off Review — 10 Questions",
  "questions": [
    {
      "question": "Your URL shortener uses a Snowflake-style counter encoded in Base62 for short IDs. Compared to truncating a random SHA-256 hash, what is the PRIMARY security trade-off you are accepting?",
      "options": [
        "Base62-encoded counters are longer than hash-based IDs, increasing storage overhead",
        "Sequential IDs are predictable — an attacker can enumerate short links by incrementing the counter, potentially exposing private or sensitive URLs",
        "Counter-based generation requires a distributed lock, which becomes a write bottleneck under high load",
        "Collision probability is higher with counter-based IDs than with truncated random hashes"
      ],
      "answer": 1,
      "explanation": "Counter-based IDs are monotonically increasing: if tinyurl.com/abc123 exists, abc124 probably does too. This enables enumeration attacks against private links (invoices, internal dashboards) shared without access control. Random hashes prevent enumeration but require a collision check on every write. Counter generation CAN be distributed using the Snowflake pattern (epoch + worker ID + sequence), eliminating the lock concern in option C."
    },
    {
      "question": "Your URL shortener caches short-to-long URL mappings in Redis with a 24-hour TTL. A user deletes their short link at 9am. What is the worst operational consequence before TTL expiry?",
      "options": [
        "Redis accumulates stale deleted keys and runs out of memory before the TTL fires",
        "New short links cannot be created while the stale cache entry occupies the key namespace",
        "The deleted short link continues to resolve successfully, redirecting users for up to 24 hours after deletion",
        "PostgreSQL falls over from the read spike as every request bypasses the now-invalid cache"
      ],
      "answer": 2,
      "explanation": "With TTL-only invalidation and no explicit cache-busting on delete, the Redis entry remains live until expiry. The fix is straightforward: the delete code path must issue a Redis DEL on the short key before returning 200. This is the cache-aside invalidation pattern. Option A is wrong — Redis automatically evicts keys at TTL expiry. Option B is wrong — deleting a key from Redis does not block namespace creation for new keys."
    },
    {
      "question": "Your distributed KV store is configured with N=3, W=2, R=1. A client reads a key 5ms after a successful write. Is the read guaranteed to return the latest value?",
      "options": [
        "Yes — a W=2 quorum means any subsequent R=1 read node must have received the write",
        "Yes — the write coordinator pins subsequent reads to nodes that acknowledged the write",
        "No — with R=1, you may hit the single replica that has not yet received the write",
        "No — strong consistency requires R + W > N; here 1 + 2 = 3 = N, so overlap is not guaranteed"
      ],
      "answer": 3,
      "explanation": "The quorum consistency condition is R + W > N (strictly greater than). Here 1 + 2 = 3 = N — not greater than N. This means the read set and write set are not guaranteed to overlap. You could read from the one node that did not acknowledge the write. To guarantee seeing the latest write with N=3, use R=2 and W=2 (since 2+2=4>3). This is one of the most common misconceptions tested in senior-level interviews."
    },
    {
      "question": "In your multi-master KV store, two clients concurrently update the same key. The system resolves the conflict using Last-Write-Wins (LWW) based on wall-clock timestamps. What is the fundamental flaw in this approach?",
      "options": [
        "LWW requires a central lock server that serializes all conflicting writes, creating a bottleneck",
        "Wall clocks across distributed nodes can skew — the write with the 'later' timestamp may be causally earlier, silently discarding a valid update",
        "LWW is too slow because it must read the existing value before deciding which write wins",
        "The losing write is returned to the client as an explicit error, degrading user experience"
      ],
      "answer": 1,
      "explanation": "Clock skew is the killer: Node A may report 10:00:00.005 while Node B reports 10:00:00.003, even if B's write happened causally after A's. LWW silently discards the causally later write. Vector clocks fix this by tracking causal relationships rather than physical time — each write carries a version vector, making happens-before relationships explicit. Option D is wrong — the losing write in LWW is silently dropped, not returned as an error, making the data loss invisible to the client."
    },
    {
      "question": "Your write-heavy KV store ingests 200K writes/sec using RocksDB (LSM-tree). A colleague proposes switching to a B-tree engine to reduce read latency. What is the critical hidden cost?",
      "options": [
        "B-trees cannot handle key sizes larger than 256 bytes, limiting key design flexibility",
        "B-tree writes are random I/O — at 200K writes/sec you will exhaust disk IOPS, causing write latency to spike and throughput to collapse under load",
        "B-trees do not support range scans, which are required for prefix iteration over keys",
        "The migration requires a full data rewrite because B-trees use a different on-disk key encoding"
      ],
      "answer": 1,
      "explanation": "LSM-trees batch writes into an in-memory memtable and flush to disk sequentially as SSTables — transforming random writes into sequential I/O, which is 10-100× faster on HDDs and significantly faster even on SSDs. B-tree engines update data in-place, generating random I/O on every write. At 200K writes/sec, a B-tree engine will saturate IOPS and create write latency spikes that cascade into query timeouts. The read latency improvement is real, but it is the wrong trade for this workload profile."
    },
    {
      "question": "Your typeahead service updates its in-memory trie every 10 minutes from a centralized aggregator. A news story breaks and its headline terms go viral. What is the user-visible symptom, and what is the correct architectural fix?",
      "options": [
        "The trie runs out of memory as new terms are added faster than old ones are evicted — fix by capping trie depth",
        "Suggestions for the viral term do not appear for up to 10 minutes during the most critical window — fix with a real-time stream layer that bypasses the batch aggregator for trending terms",
        "App servers serving different trie snapshots return inconsistent results — fix by centralizing all lookups to a single Redis cluster",
        "Trie prefix lookups degrade to O(n) as new terms are appended without rebalancing the tree"
      ],
      "answer": 1,
      "explanation": "The 10-minute update lag creates a relevance gap precisely when freshness matters most — breaking news is when users most need accurate suggestions. The production fix is a two-tier serving model: the batch-updated trie handles baseline popularity, while a real-time Kafka + Flink pipeline injects trending terms into a fast-path Redis sorted set with a 30-60 second TTL, merged at query time. This adds operational complexity but meets the freshness SLA for viral events."
    },
    {
      "question": "You deploy geo-sharded regional trie instances for your typeahead system instead of a single global trie. What do you sacrifice with this approach?",
      "options": [
        "Geo-sharding makes it impossible to surface globally viral events like breaking world news across all regions",
        "Geo-sharding doubles total memory consumption because every region stores a complete replica of the global corpus",
        "You gain regional relevance (local terms rank appropriately) at the cost of higher infrastructure complexity, more aggregation pipelines, and the need to explicitly broadcast global trends across regional shards",
        "Regional tries cannot be updated in real time because each shard requires an independent write pipeline"
      ],
      "answer": 2,
      "explanation": "Geo-sharding is the right call for global products at scale — 'cricket' should rank higher in India than in the US; 'footy' should surface in Australia. But the cost is real: more infrastructure, independent aggregation pipelines per region, and explicit logic to broadcast globally viral terms across all shards via a broadcast channel. Option A is wrong — global viral events absolutely CAN be propagated to all regional tries; it requires an explicit mechanism but is not architecturally impossible."
    },
    {
      "question": "Your object storage system uses 3× replication today. A cost review shows storage is 40% of your cloud bill. You propose switching cold-tier objects to 6+3 Reed-Solomon erasure coding. Your manager asks about recovery SLA. What is the correct response?",
      "options": [
        "Recovery is slower with erasure coding: you must read 6 shards and run XOR reconstruction before serving data — this is acceptable for cold-tier objects where retrieval latency SLAs are measured in hours, not milliseconds",
        "Recovery is faster because Reed-Solomon distributes shards across more nodes, increasing available parallel read bandwidth compared to replication",
        "Recovery SLA is identical — both strategies read from a single node in the common case",
        "Erasure coding cannot survive node failures; it only protects against silent bitrot within a single disk"
      ],
      "answer": 0,
      "explanation": "Erasure coding requires reading at least k=6 shards and running CPU-intensive XOR reconstruction before the object can be served. This is meaningfully slower than reading a single replica. For hot-tier data this is unacceptable. For cold/archive tiers (S3 Glacier, GCS Archive) where retrieval SLAs are measured in hours, the 40-50% storage cost reduction is an unambiguous win. S3 documents this design explicitly: Standard tier uses replication, Glacier uses erasure coding."
    },
    {
      "question": "The metadata service in your object storage system is processing 2 million reads/sec and becoming a bottleneck. Three proposals are on the table: (A) shard by key hash, (B) add a read-through cache in front of the metadata DB, (C) co-locate metadata inside each object's data blocks. Which is the production-correct approach?",
      "options": [
        "Option C — co-locating metadata with data eliminates the metadata service entirely, simplifying the architecture",
        "Option B alone — caching is sufficient because 90% of metadata reads hit recently-accessed hot objects",
        "Option A alone — sharding distributes load across nodes and is the only approach that handles unbounded object count growth",
        "Option A combined with Option B — shard for write scalability and hot-spot distribution; cache the hot working set for read throughput, since neither alone is sufficient at extreme scale"
      ],
      "answer": 3,
      "explanation": "At petabyte scale (10 billion+ objects), neither solution alone holds. Sharding without caching still leaves individual shards with hot read load for popular objects. Caching without sharding doesn't scale write throughput as the metadata namespace grows unboundedly. Production systems like Google Colossus, HDFS NameNode successors, and S3's internal metadata layer combine both. Option C is architecturally broken — scanning data blocks to find metadata is O(n) and destroys read performance."
    },
    {
      "question": "A principal engineer asks: across all four systems you designed, which single architectural pattern appears in every one of them?",
      "options": [
        "Eventual consistency — all four systems choose AP over CP for their primary data path",
        "Separation of metadata from data — each system maintains a fast-path metadata layer distinct from the primary data store, because their access patterns differ fundamentally",
        "SQL databases for durability — all four systems use a relational store as their write-ahead log and source of truth",
        "Synchronous replication — all four systems replicate writes synchronously to guarantee zero data loss under any failure scenario"
      ],
      "answer": 1,
      "explanation": "Metadata separation is the common thread across all four designs: the URL shortener separates short-key mappings from raw analytics logs; the KV store separates cluster membership state from value data; typeahead separates the trie index from raw query logs; object storage has an explicit metadata service separate from blob data. This pattern exists because metadata access (high-frequency, low-latency key lookups) differs fundamentally from data access (high-throughput, variable-size reads). Option A is wrong — the KV store is tunable, not always AP. This cross-cutting insight is the answer that distinguishes a principal-level candidate."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Every architectural decision has three parts: what you gain, what you sacrifice, and when the trade breaks down — master this framing before any interview",
    "URL shorteners favor AP: a stale redirect is always better than a 503 during a partition; TTL-based caching requires explicit invalidation on delete",
    "KV store power comes from tunable consistency (N, W, R) — the correct answer is not CP or AP, it is exposing the lever to the caller and letting the workload decide",
    "Strong consistency requires R + W > N (strictly greater than) — R=1, W=2, N=3 does NOT guarantee strong consistency",
    "Typeahead p99 latency is the non-negotiable constraint — freshness, consistency, and personalization are all traded against keeping sub-100ms",
    "Object storage uses replication for hot tiers and erasure coding for cold tiers — the choice depends on access frequency and cost tolerance, not which is technically superior",
    "Metadata separation appears in all four systems: fast-path metadata access patterns differ fundamentally from bulk data access patterns — this is the architectural insight that scales",
    "Apply CAP theorem per component, not per system — the metadata layer of a nominally AP system often needs to be CP; the data path often tolerates AP"
  ]
}
\`\`\``,
    },
  ],
};
