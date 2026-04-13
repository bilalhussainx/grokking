import { Module } from "../types";

export const distributedCacheModule: Module = {
  id: "design-cache",
  title: "Designing a Distributed Cache",
  description: "Design a distributed caching system: cache strategies, consistent hashing for sharding, invalidation patterns, hot key solutions, and complete architecture walkthrough.",
  lessons: [
    {
      id: "cache-requirements",
      slug: "cache-requirements",
      title: "Distributed Cache: Requirements & Motivation",
      content: `# Distributed Cache: Requirements & Motivation

A distributed cache sits between your application and your database, pooling RAM across multiple servers into a single, lightning-fast in-memory store. Systems like Redis Cluster and Memcached power the caching layers of nearly every large-scale web application, handling millions of reads per second with sub-millisecond latency.

## The Problem: Database Bottlenecks at Scale

\`\`\`concept
{ "title": "The Scale Gap", "variant": "insight", "content": "A single database can handle thousands of queries per second. But at web scale, you need millions of reads per second with sub-millisecond latency. This 1000x performance gap is why distributed caches exist. Traditional databases are optimized for durability and complex queries — not raw throughput." }
\`\`\`

Even with SSDs and well-tuned queries, database reads typically take 1–10ms. When you're serving millions of users, that latency compounds into a crushing bottleneck. The fix isn't a bigger database — it's a caching layer that absorbs 90%+ of reads before they ever touch the database.

\`\`\`algoviz
{ "title": "Request Flow: With vs Without Cache", "type": "array", "data": ["Req 1", "Req 2", "Req 3", "Req 4", "Req 5", "Req 6", "Req 7", "Req 8", "Req 9", "Req 10"], "frames": [ { "highlight": [0,1,2,3,4,5,6,7,8,9], "label": "Without cache: all 10 requests hit the database (5ms each = 50ms total load)", "stats": {"db_load": "100%", "avg_latency": "5ms"} }, { "highlight": [0,1,2,3,4,5,6,7,8], "label": "With 90% hit rate: 9 requests served from cache in <1ms each", "stats": {"cache_hits": 9, "db_load": "10%", "avg_latency": "0.9ms"} }, { "highlight": [9], "label": "Only 1 miss reaches the database — load reduced by 90%", "stats": {"cache_misses": 1, "db_load_reduction": "90%"} } ], "speed": 1000 }
\`\`\`

## Functional Requirements: What Must It Do?

Every distributed cache must provide these core operations:

1. **Get(key)** — Retrieve a cached value, or signal a cache miss
2. **Set(key, value, TTL)** — Store with an optional time-to-live
3. **Delete(key)** — Explicit invalidation when source data changes
4. **Update(key, value)** — Often a Delete + Set under the hood
5. **Batch operations** — Multi-get / multi-set for efficiency
6. **Atomic operations** — Increment, compare-and-swap for counters and locks

\`\`\`concept
{ "title": "TTL Is Not Optional", "variant": "rule", "content": "Every cache entry should carry a TTL. Without it, stale data lives forever. TTL serves three purposes simultaneously: evicting unused data to reclaim memory, bounding data staleness, and preventing unbounded cache growth as your data set evolves." }
\`\`\`

## Non-Functional Requirements: The Performance Targets

| Requirement | Target | Why It Matters |
|---|---|---|
| **Read latency** | < 1ms at p99 | User experience degrades sharply beyond 1s total page load |
| **Write latency** | < 1ms at p99 | Write-through caches can't slow down the application |
| **Throughput** | 100K+ ops/sec per node | Supports 100K concurrent users at 1 op/sec each |
| **Availability** | 99.99% | < 1 hour downtime per year for mission-critical apps |
| **Scalability** | Linear with node count | Double nodes = double capacity |
| **Data residency** | Hot dataset fits in cluster RAM | Any disk access defeats the purpose |

## Cache vs Database: The Performance Gap

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Database (PostgreSQL)", "code": "Storage:    Disk (SSD)\\nRead latency:  1–10ms\\nWrite latency: 2–20ms\\nThroughput:   ~10K ops/sec\\nDurability:   Full ACID\\nData size:    Limited by disk\\nQuery support: Full SQL" }, "after": { "label": "Cache (Redis Cluster)", "code": "Storage:    RAM\\nRead latency:  0.1–0.5ms\\nWrite latency: 0.1–0.5ms\\nThroughput:   100K+ ops/sec\\nDurability:   Optional (AOF/RDB)\\nData size:    Limited by RAM\\nQuery support: Key-value + data structures" } }
\`\`\`

The ~100× latency improvement and ~10× throughput gain explain why caches are essential for scale. The trade-off: RAM costs roughly 100× more per GB than disk, and caches trade full ACID guarantees for speed. You're renting fast memory to avoid slow disk — use it only for your *hot* working set.

## Architecture: Where Caches Fit

\`\`\`sysdiag
{ "title": "Typical Web Architecture with Distributed Cache", "width": 620, "height": 420, "nodes": [ { "id": "clients", "label": "Clients", "x": 100, "y": 40, "kind": "user" }, { "id": "cdn", "label": "CDN", "x": 300, "y": 40, "kind": "cdn" }, { "id": "lb", "label": "Load Balancer", "x": 100, "y": 120, "kind": "gateway" }, { "id": "app1", "label": "App Server 1", "x": 50, "y": 210, "kind": "service" }, { "id": "app2", "label": "App Server 2", "x": 160, "y": 210, "kind": "service" }, { "id": "cache", "label": "Redis Cluster", "x": 100, "y": 300, "kind": "store" }, { "id": "db", "label": "Primary DB", "x": 100, "y": 390, "kind": "database" } ], "edges": [ { "from": "clients", "to": "cdn", "label": "static assets" }, { "from": "clients", "to": "lb", "label": "API requests" }, { "from": "lb", "to": "app1", "label": "route" }, { "from": "lb", "to": "app2", "label": "route" }, { "from": "app1", "to": "cache", "label": "check first" }, { "from": "app2", "to": "cache", "label": "check first" }, { "from": "cache", "to": "db", "label": "on miss" }, { "from": "app1", "to": "db", "label": "writes" }, { "from": "app2", "to": "db", "label": "writes" } ], "annotations": { "cache": "Distributed cache absorbs 90%+ of reads; all app servers share one pool, so a hit on any server benefits all", "db": "Only handles cache misses and writes — load reduced by 90%+, lifespan extended dramatically" } }
\`\`\`

The golden rule: **check cache first, database second**. This single pattern reduces database load by 90% and cuts average read latency by 80%.

## Cache Deployment Patterns

| Pattern | Latency | Hit Rate | Complexity | Use Case |
|---|---|---|---|---|
| **Client-side (in-process)** | ~0ms | Per-instance | Low | User session data, config |
| **Sidecar** | <1ms | Per-server | Medium | Microservice co-location |
| **Remote cluster** | 1–5ms | Global (shared) | High | User feeds, product catalogs |
| **Multi-tier (L1 + L2)** | <1ms | Hybrid | Highest | Maximum throughput |

\`\`\`callout
{ "type": "warning", "title": "Remote Clusters Add Network Latency", "content": "A remote Redis Cluster introduces 1–5ms of network round-trip on top of the sub-millisecond memory lookup. For most use cases this is still 10–50× faster than a database call. But for ultra-hot keys (celebrity posts, viral content), you may still need an L1 in-process cache on each app server — a problem we'll tackle in the hot-key lesson." }
\`\`\`

\`\`\`quiz
{ "title": "Requirements & Motivation Check", "questions": [ { "question": "Which operation is typically fastest in a distributed cache?", "options": ["Set with TTL", "Get — cache hit", "Delete", "Get — cache miss"], "answer": 1, "explanation": "A cache hit serves data directly from RAM without any database round-trip, completing in 0.1–0.5ms. A miss must fall through to the database, which takes 1–10ms." }, { "question": "Why is TTL included on Set operations rather than storing data permanently?", "options": ["To save memory by evicting stale entries", "To ensure data freshness as the source changes", "To prevent unbounded cache growth", "All of the above"], "answer": 3, "explanation": "TTL serves all three purposes simultaneously: memory management, data freshness, and bounding growth. Omitting TTL is a common production mistake that leads to stale data and memory exhaustion." }, { "question": "Traditional modulo hashing (server = hash(key) % N) is rejected for distributed caches because:", "options": ["It is too slow to compute", "Changing N remaps nearly all keys, causing a cache stampede", "It does not support TTL", "It requires too much memory per node"], "answer": 1, "explanation": "When you add or remove a node, N changes and almost every key maps to a different server. The resulting mass invalidation floods the database — a 'thundering herd'. Consistent hashing solves this by moving only a fraction of keys on topology changes." }, { "question": "A single cache node targets 100K ops/sec. Your peak traffic is 800K reads/sec with a 90% hit rate. How many cache nodes do you need at minimum?", "options": ["1", "8", "72", "None — the database handles it"], "answer": 0, "explanation": "With a 90% hit rate, 720K of 800K reads hit the cache. At 100K ops/sec per node you need ≥7.2 nodes, so 8 nodes. This is the linear-scaling property: double nodes = double cache throughput." } ] }
\`\`\`

## Why Single-Node Caches Hit a Wall

Single-node caches fail on four fronts as traffic grows:

- **Memory ceiling** — One server's RAM caps your hot working set
- **Single point of failure** — Node crash = 100% of reads fall through to the database
- **Network bottleneck** — One NIC becomes saturated under millions of connections
- **Geographic latency** — One location cannot serve global traffic with low latency

Distributing the cache across nodes solves all four — but introduces new problems: *how do you know which node holds a given key?* That's the consistent hashing problem we tackle next.

\`\`\`takeaways
{ "title": "Why Distributed Caches Matter", "items": [ "100× faster than database reads — RAM serves in 0.1ms vs disk at 1–10ms", "90% database load reduction at typical hit rates, directly extending database lifespan", "Linear horizontal scaling — add nodes to grow capacity without touching the database layer", "RAM costs ~100× more per GB than disk, so cache only your hot working set", "Speed comes with consistency trade-offs — invalidation, hot keys, and node failures are the real design challenges ahead" ] }
\`\`\`

The distributed cache is your first line of defense against database overload. But simply adding a cache isn't enough — the real challenges lie in **sharding data across nodes without remapping everything on topology changes**, **maintaining consistency when the source of truth updates**, and **preventing individual hot keys from becoming new bottlenecks**. These distributed-systems problems are what transforms caching from a one-line \`redis.get()\` into a rich architectural discipline.`,
    },
    {
      id: "cache-strategies",
      slug: "cache-strategies",
      title: "Cache Strategies: Write-Through, Write-Behind & Write-Around",
      content: `# Cache Strategies: Write-Through, Write-Behind & Write-Around

How your cache interacts with the database determines consistency, latency, and failure behavior. Five standard patterns cover the design space — understanding each one's trade-offs lets you pick the right tool for a given workload.

\`\`\`concept
{ "title": "The Central Trade-off", "variant": "mental-model", "content": "Every cache strategy is negotiating between three forces: **write latency** (how fast writes return), **consistency** (whether reads see the latest write), and **durability** (whether data survives a cache crash). You cannot fully optimize all three simultaneously — your workload's access pattern decides which one you can afford to sacrifice." }
\`\`\`

---

## Read Strategies

\`\`\`tabs
{ "tabs": [
  {
    "label": "Cache-Aside",
    "icon": "🔍",
    "content": "### Cache-Aside (Lazy Loading)\\n\\nThe application manages both cache and database directly. This is the most common pattern — used by the majority of web apps backed by Redis + PostgreSQL.\\n\\n**Read flow:**\\n1. App calls \`cache.get(key)\`\\n2. **Hit** → return cached value immediately\\n3. **Miss** → query database, write result to cache with TTL, return value\\n\\n**Write flow:**\\n1. App writes to database\\n2. App **invalidates** the cache key (\`cache.delete(key)\`)\\n3. Next read re-populates the cache from the fresh DB value\\n\\n| Dimension | Assessment |\\n|---|---|\\n| Read latency | Fast on hit, slow on first miss |\\n| Write latency | Database write only |\\n| Data loss risk | None |\\n| Complexity | Low |\\n\\n**Best for:** General-purpose workloads. Cache failure degrades gracefully — requests just hit the database."
  },
  {
    "label": "Read-Through",
    "icon": "🔄",
    "content": "### Read-Through\\n\\nThe cache acts as a smart proxy — the application only ever speaks to the cache, never the database directly for reads. On a miss, the **cache itself** fetches from the database.\\n\\n**Flow:**\\n\`\`\`\\nApp → Cache: GET(key)\\n  Hit  → return value\\n  Miss → Cache fetches from DB\\n       → Cache stores result\\n       → Cache returns value to App\\n\`\`\`\\n\\nThis is the **read complement** of Write-Through. Systems often combine them: Read-Through + Write-Through gives a fully transparent caching layer.\\n\\n| Dimension | Assessment |\\n|---|---|\\n| Read latency | Fast on hit, slow on first miss |\\n| Consistency | Strong (cache and DB in sync) |\\n| App complexity | Lower — no DB code in app |\\n| Cache complexity | Higher — cache needs DB adapter |\\n\\n**Best for:** Read-heavy systems where you want to keep all DB logic inside the cache tier. Requires cache middleware (e.g., DAX for DynamoDB, or custom proxy)."
  }
] }
\`\`\`

---

## Write Strategies

\`\`\`tabs
{ "tabs": [
  {
    "label": "Write-Through",
    "icon": "✍️",
    "content": "### Write-Through\\n\\nEvery write goes **through the cache to the database synchronously**. The operation completes only after both succeed.\\n\\n\`\`\`python\\ndef update_user(user_id, user_data):\\n    cache_key = f\\"user:{user_id}\\"\\n    cache.set(cache_key, user_data, ttl=3600)  # write cache\\n    database.update(\\"users\\", user_id, user_data)  # write DB\\n    return True\\n\`\`\`\\n\\n**Guarantee:** Cache is always consistent with the database. Any read-after-write sees the latest value immediately.\\n\\n**Watch out:** The dual-write problem — if the cache write succeeds but the DB write fails (or vice versa), systems diverge. You need retry logic or idempotent writes. Perfect consistency without distributed transactions is hard.\\n\\n| Dimension | Assessment |\\n|---|---|\\n| Write latency | Slow (includes synchronous DB write) |\\n| Consistency | Strong |\\n| Data loss risk | None |\\n| Waste risk | Caches data that may never be read |\\n\\n**Best for:** Read-after-write consistency requirements (user profiles, settings, financial balances)."
  },
  {
    "label": "Write-Behind",
    "icon": "⚡",
    "content": "### Write-Behind (Write-Back)\\n\\nWrites land in the cache immediately and return success. The cache **asynchronously flushes** updates to the database in batches.\\n\\n\`\`\`\\nApp → Cache: SET(key, new_value)\\n  └── Cache returns SUCCESS immediately (~0.5 ms)\\n      (in background)\\n      Cache → DB: batch flush [key1, key2, key3]\\n\`\`\`\\n\\nWrite latency equals cache write only — typically sub-millisecond. This absorbs write spikes and reduces database load through batching.\\n\\n**Critical risk:** If the cache node crashes before flushing, **unflushed writes are lost permanently**. This isn't a theoretical concern — it's a real failure mode in production.\\n\\n| Dimension | Assessment |\\n|---|---|\\n| Write latency | Extremely fast (async) |\\n| Consistency | Eventual |\\n| Data loss risk | **YES — on crash** |\\n| Complexity | High |\\n\\n**Best for:** High-throughput analytics pipelines, metrics ingestion, ad-click counters — workloads where occasional data loss is tolerable and write throughput is the bottleneck."
  },
  {
    "label": "Write-Around",
    "icon": "🔀",
    "content": "### Write-Around\\n\\nWrites go **directly to the database**, bypassing the cache entirely. The cache is optionally invalidated.\\n\\n\`\`\`python\\ndef update_user(user_id, user_data):\\n    cache_key = f\\"user:{user_id}\\"\\n    database.update(\\"users\\", user_id, user_data)  # direct DB write\\n    cache.delete(cache_key)  # optional invalidation\\n    return True\\n\`\`\`\\n\\nOn the next read, the cache misses and re-populates from the database. This means **read-after-write always pays a miss penalty** for recently written data.\\n\\n| Dimension | Assessment |\\n|---|---|\\n| Write latency | Database write only |\\n| Consistency | Eventual (next read re-populates) |\\n| Cache pollution | None — cache only holds read data |\\n| Data loss risk | None |\\n\\n**Best for:** Write-heavy data that is rarely read immediately — log ingestion, audit trails, bulk imports. Prevents the cache from being flooded with data that will never be requested."
  }
] }
\`\`\`

---

## Visualizing Cache-Aside: Step by Step

\`\`\`trace
{ "title": "Cache-Aside Read + Write Sequence", "language": "python", "code": "def get_user(user_id):\\n    key = f'user:{user_id}'\\n    user = cache.get(key)\\n    if user is None:\\n        user = db.query(user_id)\\n        cache.set(key, user, ttl=300)\\n    return user\\n\\ndef update_user(user_id, data):\\n    db.update(user_id, data)\\n    cache.delete(f'user:{user_id}')", "frames": [
  { "line": 2, "vars": { "user_id": 42, "key": "user:42" }, "note": "Build the cache key", "stdout": "" },
  { "line": 3, "vars": { "user": "None" }, "note": "Check cache — MISS (cold start)", "stdout": "cache.get('user:42') → None" },
  { "line": 4, "vars": { "user": "None" }, "note": "Condition is true — must hit the database", "stdout": "" },
  { "line": 5, "vars": { "user": "{ id:42, name:'Alice' }" }, "note": "Database returns the row", "stdout": "db.query(42) → {id:42, name:'Alice'}" },
  { "line": 6, "vars": {}, "note": "Populate cache with 300s TTL — next read will hit", "stdout": "cache.set('user:42', ..., ttl=300)" },
  { "line": 10, "vars": { "user_id": 42, "data": "{ name:'Bob' }" }, "note": "Write path: update DB first", "stdout": "db.update(42, {name:'Bob'})" },
  { "line": 11, "vars": {}, "note": "Invalidate stale cache entry — next read re-populates", "stdout": "cache.delete('user:42')" }
], "speed": 900 }
\`\`\`

---

## Write-Through vs Write-Behind: The Core Trade-off

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Write-Through — Consistent, Slower", "code": "def update_product(product_id, price):\\n    # Write to cache AND database synchronously\\n    cache.set(f'product:{product_id}', price)\\n    database.update('products', product_id, price)\\n    # Returns only after BOTH succeed\\n    # Latency: ~5-20ms (includes DB round-trip)\\n    # Risk: zero data loss\\n    return True" }, "after": { "label": "Write-Behind — Fast, Risky", "code": "def update_product(product_id, price):\\n    # Write to cache only — returns immediately\\n    cache.set(f'product:{product_id}', price)\\n    write_queue.push(('products', product_id, price))\\n    # Returns in ~0.5ms (cache write only)\\n    # Async flush: DB updated seconds/minutes later\\n    # Risk: cache crash = lost writes\\n    return True" } }
\`\`\`

---

## Strategy Comparison

| Strategy | Read Latency | Write Latency | Data Loss Risk | Best Workload |
|---|---|---|---|---|
| Cache-Aside | Hit: fast / Miss: slow | DB write | None | General purpose |
| Read-Through | Hit: fast / Miss: slow | N/A | None | Read-heavy |
| Write-Through | Fast (always fresh) | Slow (sync DB) | None | Read-after-write |
| Write-Behind | Fast | Very fast (async) | **Yes — on crash** | Write-heavy, loss-tolerant |
| Write-Around | First read slow | DB only | None | Write-heavy, rarely re-read |

---

## Combining Strategies in Production

Most production systems pair a read strategy with a write strategy:

\`\`\`concept
{ "title": "Cache-Aside + Write-Around: The Safe Default", "variant": "rule", "content": "**Reads:** Cache-Aside (lazy loading on miss)\\n**Writes:** Write-Around (DB directly, invalidate cache)\\n\\nThis is what most web apps use with Redis + PostgreSQL. Simple, predictable, no data-loss risk. The cache only ever holds data that has been requested — no pollution from writes that are never read." }
\`\`\`

\`\`\`concept
{ "title": "Read-Through + Write-Behind: The High-Throughput Option", "variant": "insight", "content": "**Reads:** Read-Through (cache handles all DB reads)\\n**Writes:** Write-Behind (cache absorbs writes, flushes async)\\n\\nHigher throughput on both reads and writes, but requires specialized caching middleware and accepts crash-loss risk. Used in high-volume analytics and metrics pipelines where occasional data loss is tolerable and write throughput is the bottleneck." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The Dual-Write Problem in Write-Through", "content": "Write-Through appears safe, but it has a consistency edge case: if the cache write succeeds and the database write fails (or vice versa), your systems diverge. Without distributed transactions, you need retry logic and idempotent write operations. This is why Write-Through is less common than Cache-Aside in interviews — it requires specialized infrastructure and still has consistency edge cases." }
\`\`\`

---

\`\`\`quiz
{ "title": "Cache Strategy Fundamentals", "questions": [
  {
    "question": "A social media app stores user timelines. A user posts a new tweet — the post must be immediately visible on their own profile. Which write strategy guarantees this read-after-write consistency?",
    "options": [
      "Write-Around — bypass the cache to avoid staleness",
      "Write-Through — synchronously update cache and database together",
      "Write-Behind — fast async flush means eventual visibility",
      "Cache-Aside — invalidate on write and re-populate on next read"
    ],
    "answer": 1,
    "explanation": "Write-Through updates cache and database synchronously in one operation, guaranteeing that any subsequent read from the cache returns the latest value. Write-Around would cause the next read to miss and re-fetch, which is usually fine but not an explicit guarantee. Write-Behind is async, so the DB may lag behind. Cache-Aside with invalidation also works, but the guarantee is from the next read hitting the DB, not from write-time consistency."
  },
  {
    "question": "An analytics pipeline ingests 50,000 click events per second. The data is eventually aggregated and stored in a data warehouse. Which caching strategy matches this workload?",
    "options": [
      "Write-Through — consistency is essential for analytics",
      "Read-Through — analytics is read-heavy",
      "Write-Behind — high write throughput, eventual persistence is acceptable",
      "Cache-Aside — simplest and safest choice for all workloads"
    ],
    "answer": 2,
    "explanation": "Write-Behind (Write-Back) is designed for high-throughput write workloads where the cost of a synchronous database write on every event is prohibitive. The cache absorbs the burst and flushes to the database asynchronously in batches. Analytics pipelines typically tolerate losing a few seconds of events in a crash scenario — the trade-off is explicitly accepted."
  },
  {
    "question": "Which of the following is the primary risk of Write-Behind caching?",
    "options": [
      "Slow write latency because every write blocks on the database",
      "Cache pollution — writes fill the cache with data that is never read",
      "Data loss if the cache node crashes before the async flush completes",
      "Stale reads — the cache may return an older version of data"
    ],
    "answer": 2,
    "explanation": "The defining risk of Write-Behind is that writes acknowledged to the client exist only in the cache until the background flush completes. A cache node crash before flushing permanently loses those writes. Slow write latency is the opposite problem (Write-Through). Cache pollution is a Write-Through concern. Stale reads describe an invalidation or TTL problem, not Write-Behind specifically."
  },
  {
    "question": "A product catalog is updated via a nightly bulk import of 500,000 records. During the day the catalog is read millions of times. Which strategy avoids polluting the cache with data that may never be requested?",
    "options": [
      "Write-Through — keeps cache consistent during import",
      "Write-Around — writes go to DB only; cache fills lazily on reads",
      "Write-Behind — batches the bulk writes efficiently",
      "Read-Through — cache manages all reads after import"
    ],
    "answer": 1,
    "explanation": "Write-Around sends writes directly to the database without touching the cache. During the nightly import, only the products that users actually request during the day will populate the cache via normal read misses (Cache-Aside behavior). This prevents the import from evicting hot items and wasting memory on products that receive no traffic."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Cache-Aside + Write-Around is the safe default: simple, no data-loss risk, cache only holds requested data. This is what most Redis + PostgreSQL apps use.",
  "Write-Through guarantees read-after-write consistency by updating cache and database synchronously — at the cost of write latency and the dual-write consistency edge case.",
  "Write-Behind gives the fastest writes by accepting crash-loss risk: only use it when your workload explicitly tolerates eventual durability (analytics, metrics ingestion).",
  "Write-Around prevents cache pollution from bulk writes or rarely-read data by bypassing the cache entirely on writes.",
  "Most production systems combine strategies: a read strategy (Cache-Aside or Read-Through) paired with a write strategy (Write-Around or Write-Behind) chosen by workload's read/write ratio and loss tolerance."
] }
\`\`\``,
    },
    {
      id: "cache-consistent-hashing",
      slug: "cache-consistent-hashing",
      title: "Consistent Hashing for Cache Sharding",
      content: `# Consistent Hashing for Cache Sharding

A single cache node cannot hold all your data. Distributing keys across multiple cache nodes requires a sharding strategy that minimizes disruption when nodes are added or removed.

## The Problem with Naive Sharding

\`\`\`concept
{ "title": "Naive Sharding with Modulo", "variant": "rule", "content": "hash(key) % N works fine until N changes. When you add or remove a node, nearly every key gets remapped, causing a cache stampede where your database gets flooded with queries for data that should have been cached." }
\`\`\`

Traditional modulo-based sharding creates massive disruption during scaling events:

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Before: 3 nodes", "code": "hash(\\"user:100\\") % 3 = 1  → Node 1\\nhash(\\"user:200\\") % 3 = 0  → Node 0\\nhash(\\"user:300\\") % 3 = 2  → Node 2" }, "after": { "label": "After: 4 nodes (add one)", "code": "hash(\\"user:100\\") % 4 = 0  → Node 0  (MOVED!)\\nhash(\\"user:200\\") % 4 = 0  → Node 0  (same)\\nhash(\\"user:300\\") % 4 = 1  → Node 1  (MOVED!)\\n\\nResult: ~75% of keys move to different nodes" } }
\`\`\`

This is called a **cache stampede** or **thundering herd**: adding or removing a node invalidates most of the cache, causing a flood of database queries simultaneously. At scale — say Netflix's 100 TB Memcached cluster — a 75% miss rate would crater the origin databases immediately.

## Consistent Hashing: The Hash Ring

\`\`\`concept
{ "title": "The Hash Ring", "variant": "mental-model", "content": "Imagine a clock face numbered 0 to 2^32-1. Both your cache nodes and data keys are placed on this circle using a hash function. To find which node stores a key, start at the key's position and walk clockwise until you hit a node. When you add or remove a node, only the keys between that node and its predecessor on the ring are affected — roughly 1/N of all keys instead of nearly all of them." }
\`\`\`

Here's how key lookup works on the ring. Watch each key walk clockwise to its first node:

\`\`\`algoviz
{ "title": "Consistent Hashing Ring — Key Routing", "type": "array", "data": ["pos:0", "K:user:100\\nhash≈150", "N:B\\npos:250", "K:user:200\\nhash≈400", "N:C\\npos:500", "K:user:300\\nhash≈600", "N:D\\npos:750", "K:user:400\\nhash≈900", "N:A\\npos:1000"], "frames": [ { "highlight": [2, 4, 6, 8], "label": "Nodes A, B, C, D placed on ring at hash positions", "stats": { "nodes": 4 } }, { "highlight": [1, 2], "label": "user:100 (hash 150) walks clockwise → hits Node B at 250", "stats": { "key": "user:100", "routed_to": "Node B" } }, { "highlight": [3, 4], "label": "user:200 (hash 400) walks clockwise → hits Node C at 500", "stats": { "key": "user:200", "routed_to": "Node C" } }, { "highlight": [5, 6], "label": "user:300 (hash 600) walks clockwise → hits Node D at 750", "stats": { "key": "user:300", "routed_to": "Node D" } }, { "highlight": [7, 8], "label": "user:400 (hash 900) walks clockwise → hits Node A at 1000", "stats": { "key": "user:400", "routed_to": "Node A" } }, { "highlight": [3, 4], "label": "Add Node E at pos 350: only user:200 (hash 400→350 range) is affected", "stats": { "keys_moved": "~1/N ≈ 25%", "vs_modulo": "75%" } } ], "speed": 1000 }
\`\`\`

When Node E is added at position 350, only keys that fall between Node B (250) and Node E (350) are reassigned. Every other key continues routing to exactly the same node. That's the core guarantee: **approximately 1/N keys move when you add the Nth node**.

## Virtual Nodes for Even Distribution

With only a handful of physical nodes, their random ring positions can cluster unevenly — one node might own 40% of the keyspace while another owns 10%. Virtual nodes solve this.

\`\`\`concept
{ "title": "Virtual Nodes (vnodes)", "variant": "analogy", "content": "Think of vnodes like having multiple mailboxes for one house. Instead of one mailbox at a single address, each physical server has 150 mailboxes scattered around the neighborhood. Mail (data) gets distributed more evenly, and if one physical server goes down, its 150 mailboxes' traffic redistributes across all remaining servers — no single neighbor is overwhelmed." }
\`\`\`

Each physical node generates multiple hash positions, one per vnode label:

\`\`\`trace
{ "title": "Virtual Node Generation (Python)", "language": "python", "code": "import hashlib\\nfrom bisect import bisect_right\\n\\nclass ConsistentHash:\\n    def __init__(self, nodes, virtual_nodes=150):\\n        self.ring = {}           # hash_position -> physical_node\\n        self.sorted_keys = []    # sorted hash positions\\n        for node in nodes:\\n            self.add_node(node)\\n\\n    def _hash(self, key):\\n        return int(hashlib.md5(key.encode()).hexdigest(), 16)\\n\\n    def add_node(self, node):\\n        for i in range(self.virtual_nodes):\\n            vkey = f\\"{node}:vn{i}\\"  # e.g. \\"cache-1:vn0\\"\\n            pos  = self._hash(vkey)\\n            self.ring[pos] = node\\n            self.sorted_keys.append(pos)\\n        self.sorted_keys.sort()\\n\\n    def get_node(self, key):\\n        h = self._hash(key)\\n        idx = bisect_right(self.sorted_keys, h) % len(self.sorted_keys)\\n        return self.ring[self.sorted_keys[idx]]\\n\\n# Usage\\nch = ConsistentHash([\\"cache-1\\", \\"cache-2\\", \\"cache-3\\"])\\nprint(ch.get_node(\\"user:100\\"))   # e.g. cache-2\\nprint(ch.get_node(\\"user:200\\"))   # e.g. cache-3", "frames": [ { "line": 5, "vars": { "virtual_nodes": 150, "ring": "{}" }, "note": "Start with empty ring and sorted key list" }, { "line": 15, "vars": { "node": "cache-1", "i": 0, "vkey": "cache-1:vn0" }, "note": "Generate first vnode label for cache-1" }, { "line": 16, "vars": { "pos": "0x3d2a...  (large int)" }, "note": "MD5 of vkey gives ring position" }, { "line": 21, "vars": { "ring_size": 450, "sorted_keys": "[...450 sorted positions...]" }, "note": "After all 3 nodes: 150 vnodes × 3 = 450 ring points" }, { "line": 25, "vars": { "key": "user:100", "h": "hash(user:100)" }, "note": "bisect_right finds the next ring position clockwise" }, { "line": 25, "vars": {}, "note": "Return the physical node that owns that vnode position", "stdout": "cache-2" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "How many virtual nodes?", "content": "150 vnodes per physical server is a common default (used by Cassandra). Fewer vnodes = faster ring lookups but uneven distribution. More vnodes = better balance but more memory for the ring map and slower node add/remove operations." }
\`\`\`

## Implementation Patterns: Client-Side vs. Cluster-Side

Different systems implement consistent hashing at different layers:

\`\`\`tabs
{ "tabs": [ { "label": "Client-Side (Memcached)", "icon": "👥", "content": "The client library holds the hash ring and routes each operation directly to the correct node.\\n\\n\`\`\`\\nslot = consistent_hash(key)  →  target node IP\\nSET user:100 → cache-2:11211   (direct TCP)\\nGET user:100 → cache-2:11211   (same hash, same node)\\n\`\`\`\\n\\n**How scaling works:**\\n- Admin adds \`cache-4\` to client config\\n- All clients reload ring (or use service discovery)\\n- ~1/4 of keys now route to cache-4\\n\\n**Pros:** Zero cluster coordination overhead, dead simple server process\\n\\n**Cons:** All clients must have a consistent view of the ring — config drift causes split-brain routing. Client libraries (pylibmc, php-memcached) must all agree on the hash function." }, { "label": "Cluster-Side (Redis Cluster)", "icon": "🏗️", "content": "Redis Cluster uses 16,384 fixed **hash slots** (\`CRC16(key) % 16384\`) distributed across nodes.\\n\\n\`\`\`\\nNode A: slots    0 – 5460\\nNode B: slots 5461 – 10922\\nNode C: slots 10923 – 16383\\n\\nClient: GET user:100\\n  → sends to any node\\n  → if wrong node: MOVED 3271 cache-b:6379\\n  → client caches slot→node map\\n  → future GETs go directly to correct node\\n\`\`\`\\n\\n**How scaling works:**\\n- \`redis-cli --cluster add-node cache-4\`\\n- Slots migrate one-by-one with MIGRATING/IMPORTING state\\n- ASK redirects serve in-flight keys during migration\\n\\n**Pros:** Client can be dumb (just follow redirects), built-in replication and failover\\n\\n**Cons:** Cross-slot multi-key ops require \`{hashtag}\` to force co-location; cluster bus adds ~10% overhead" }, { "label": "Proxy-Side (Twemproxy)", "icon": "🔀", "content": "A stateless proxy layer sits between clients and cache nodes and owns the ring logic.\\n\\n\`\`\`\\nClient → Twemproxy:6380 (consistent hash here)\\n             ↓\\n        cache-1 / cache-2 / cache-3\\n\`\`\`\\n\\nUsed by Twitter to front Memcached and Redis clusters. Clients treat the proxy as a single cache endpoint.\\n\\n**Pros:** Application code is completely decoupled from topology changes\\n\\n**Cons:** Proxy is a single point of failure (run multiple); adds one network hop; no cluster-level replication" } ] }
\`\`\`

## Handling Node Failures

\`\`\`steps
{ "title": "Node Failure Recovery Process", "steps": [ { "title": "Health Check Detection", "content": "Monitoring (heartbeat / TCP probe) detects that Node B stops responding. With consistent hashing, the blast radius is immediately bounded: only Node B's keyspace is affected." }, { "title": "Impact Assessment", "content": "With 150 vnodes per physical node across a 4-node cluster, Node B owns roughly **25% of the keyspace**. The remaining nodes continue serving their 75% normally — no cluster-wide disruption." }, { "title": "Recovery Strategy Selection", "content": "**Option A — Replica promotion:** If Node B has a replica B′, promote it to primary. Zero cache misses; clients see no difference.\\n\\n**Option B — Rehash to neighbors:** Remove B from the ring; its keys walk clockwise to Node C. Expect a miss spike until keys repopulate from DB.\\n\\n**Option C — Temporary read fallback:** Route B's keys to a secondary read path (another cache tier or DB read replica) while B recovers." }, { "title": "Data Restoration", "content": "After promotion or rehash: affected keys are cache misses until the application repopulates them on first access. Use **cache warming** scripts for critical hot keys to avoid a stampede on startup." } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The thundering herd on recovery", "content": "When a failed node rejoins or a new node is provisioned, its keyspace starts empty. If 25% of traffic suddenly hits the DB simultaneously, you can overwhelm it. Mitigate with: (1) request coalescing / mutex locks on first miss, (2) probabilistic early expiration to spread repopulation, or (3) pre-warming the node before shifting traffic." }
\`\`\`

## Redis Cluster: Slot Migration in Detail

When you add a node to Redis Cluster, slots migrate incrementally so clients are never blocked:

\`\`\`mermaid
sequenceDiagram
    participant Admin
    participant NodeA
    participant NodeD
    participant Client

    Admin->>NodeA: CLUSTER SETSLOT 3271 MIGRATING NodeD
    Admin->>NodeD: CLUSTER SETSLOT 3271 IMPORTING NodeA
    Note over NodeA,NodeD: Slot 3271 is now dual-owned during migration

    Client->>NodeA: GET user:100 (slot 3271)
    alt Key still on NodeA
        NodeA-->>Client: value
    else Key already migrated
        NodeA-->>Client: ASK 3271 NodeD
        Client->>NodeD: ASKING + GET user:100
        NodeD-->>Client: value
    end

    Admin->>NodeA: CLUSTER SETSLOT 3271 NODE NodeD
    Admin->>NodeD: CLUSTER SETSLOT 3271 NODE NodeD
    Note over NodeA,NodeD: Migration complete — NodeD owns slot 3271
\`\`\`

The \`ASK\` redirect is temporary (client must not cache it), while \`MOVED\` is permanent (client should update its slot map). This two-redirect protocol allows live migration with zero downtime.

## Architecture Summary

\`\`\`sysdiag
{ "title": "Consistent Hashing — Full Picture", "width": 640, "height": 380, "nodes": [ { "id": "client", "label": "App Servers", "x": 80, "y": 190, "kind": "client" }, { "id": "ring", "label": "Hash Ring\\n(client or proxy)", "x": 240, "y": 190, "kind": "service" }, { "id": "ca", "label": "Cache A\\n(vnodes 0–149)", "x": 460, "y": 80, "kind": "cache" }, { "id": "cb", "label": "Cache B\\n(vnodes 150–299)", "x": 460, "y": 190, "kind": "cache" }, { "id": "cc", "label": "Cache C\\n(vnodes 300–449)", "x": 460, "y": 300, "kind": "cache" }, { "id": "db", "label": "Database", "x": 240, "y": 320, "kind": "database" } ], "edges": [ { "from": "client", "to": "ring", "label": "hash(key)" }, { "from": "ring", "to": "ca", "label": "~33% keys" }, { "from": "ring", "to": "cb", "label": "~33% keys" }, { "from": "ring", "to": "cc", "label": "~33% keys" }, { "from": "ca", "to": "db", "label": "miss fallback" }, { "from": "cb", "to": "db", "label": "miss fallback" }, { "from": "cc", "to": "db", "label": "miss fallback" } ], "annotations": { "ring": "Owns the consistent hash logic. In Memcached: lives in client library. In Redis Cluster: managed by cluster nodes themselves.", "ca": "Each physical server maps to 150 virtual ring positions for even load distribution.", "db": "Only receives traffic on cache misses — consistent hashing keeps this to a minimum during scaling." } }
\`\`\`

\`\`\`quiz
{ "title": "Consistent Hashing Knowledge Check", "questions": [ { "question": "With modulo-based hashing across 3 nodes, approximately what fraction of keys must be remapped when a 4th node is added?", "options": ["~25%", "~50%", "~75%", "~100%"], "answer": 2, "explanation": "With hash(key) % N, changing N from 3 to 4 remaps nearly all keys: (N-1)/N = 75% of keys hash to a different bucket. Consistent hashing reduces this to ~1/N = 25%." }, { "question": "Why does Redis Cluster use exactly 16,384 hash slots?", "options": ["It matches the maximum number of Redis nodes", "CRC16 produces values 0–65535 and 16384 divides evenly into it", "It is the highest power of 2 that fits in a 16-bit integer with room for metadata", "It was chosen to match Memcached's internal slab count"], "answer": 2, "explanation": "16384 = 2^14. Redis's designers chose this size because it fits comfortably in a gossip message (each node stores a 16384-bit bitmap), and CRC16(key) % 16384 produces good distribution. The slot map for all nodes fits in 2 KB." }, { "question": "What is the purpose of the ASK redirect in Redis Cluster (vs. MOVED)?", "options": ["ASK means the slot no longer exists; MOVED means it is being replicated", "ASK is temporary during slot migration; MOVED permanently updates the client's slot map", "ASK redirects reads; MOVED redirects writes", "Both are identical — ASK is just the older version of MOVED"], "answer": 1, "explanation": "During slot migration, a key may exist on either the source or destination node. ASK tells the client 'try this node once, but do NOT update your slot map — this is temporary.' MOVED means the slot has permanently moved and the client should cache the new mapping." }, { "question": "A cluster has 4 nodes each with 150 virtual nodes. Node B fails. Which statement is most accurate?", "options": ["All 600 ring positions are redistributed across A, C, and D", "Only Node B's 150 ring positions are redistributed clockwise to their successor nodes", "The cluster halts until Node B is replaced", "Nodes A, C, and D each take exactly 50 of Node B's virtual nodes"], "answer": 1, "explanation": "Each of Node B's 150 virtual node positions routes clockwise to whichever physical node comes next on the ring. The 450 positions belonging to A, C, and D are completely unaffected — this is exactly the isolation guarantee consistent hashing provides." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Modulo hashing remaps ~75% of keys when cluster size changes; consistent hashing reduces this to ~1/N", "The hash ring routes each key to the first node clockwise from its hash position — a single traversal with O(log N) lookup via binary search on sorted positions", "Virtual nodes (150 per server is a common default) spread each physical server across the ring, preventing keyspace hotspots and ensuring even redistribution on failure", "Redis Cluster uses 16,384 fixed slots with MOVED/ASK redirects for zero-downtime migration; Memcached relies on client-side ring logic", "Node failures only affect ~1/N of the keyspace; mitigate the repopulation stampede with replica promotion, request coalescing, or cache warming" ] }
\`\`\``,
      starterCode: `# Distributed Cache Client with Consistent Hashing
# Implement a cache client that distributes keys across multiple nodes.

import hashlib

class CacheNode:
    """Simulates a single cache node (in-memory store)."""
    def __init__(self, name: str):
        self.name = name
        self.store = {}

    def get(self, key: str):
        return self.store.get(key)

    def set(self, key: str, value, ttl: int = 0):
        self.store[key] = value

    def delete(self, key: str):
        self.store.pop(key, None)

    def size(self):
        return len(self.store)


class DistributedCache:
    def __init__(self, nodes: list, vnodes_per_node: int = 150):
        self.ring = {}           # hash_position -> CacheNode
        self.sorted_positions = []
        self.nodes = {}          # node_name -> CacheNode
        self.vnodes_per_node = vnodes_per_node

        for node_name in nodes:
            self.add_node(node_name)

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node_name: str):
        """Add a cache node with virtual nodes to the ring."""
        # TODO: Create CacheNode, add virtual nodes to ring
        pass

    def remove_node(self, node_name: str):
        """Remove a cache node from the ring."""
        # TODO: Remove all virtual nodes for this node
        pass

    def _get_node(self, key: str) -> CacheNode:
        """Find which cache node owns the given key."""
        # TODO: Hash key, find next position on ring, return node
        pass

    def get(self, key: str):
        """Get a value from the distributed cache."""
        node = self._get_node(key)
        return node.get(key) if node else None

    def set(self, key: str, value, ttl: int = 0):
        """Set a value in the distributed cache."""
        node = self._get_node(key)
        if node:
            node.set(key, value, ttl)

    def delete(self, key: str):
        """Delete a value from the distributed cache."""
        node = self._get_node(key)
        if node:
            node.delete(key)

    def stats(self) -> dict:
        """Return key count per node."""
        return {name: node.size() for name, node in self.nodes.items()}


# Test your implementation
if __name__ == "__main__":
    cache = DistributedCache(["cache-1", "cache-2", "cache-3"])

    # Insert 10000 keys
    for i in range(10000):
        cache.set(f"user:{i}", {"name": f"User {i}", "score": i * 10})

    # Check distribution
    print("Key distribution:")
    for name, count in sorted(cache.stats().items()):
        print(f"  {name}: {count} keys ({count/100:.1f}%)")

    # Verify reads
    hits = sum(1 for i in range(10000) if cache.get(f"user:{i}") is not None)
    print(f"\\nRead verification: {hits}/10000 keys found")

    # Add a node and check redistribution
    print("\\nAdding cache-4...")
    cache.add_node("cache-4")
    # Keys on the new node will be misses (simulating real behavior)
    hits_after = sum(1 for i in range(10000) if cache.get(f"user:{i}") is not None)
    moved = 10000 - hits_after
    print(f"Keys moved (cache misses): {moved}/10000 ({moved/100:.1f}%)")
    print("New distribution:")
    for name, count in sorted(cache.stats().items()):
        print(f"  {name}: {count} keys")
`,
      solutionCode: `# Distributed Cache Client with Consistent Hashing - Solution

import hashlib
import bisect

class CacheNode:
    def __init__(self, name: str):
        self.name = name
        self.store = {}

    def get(self, key: str):
        return self.store.get(key)

    def set(self, key: str, value, ttl: int = 0):
        self.store[key] = value

    def delete(self, key: str):
        self.store.pop(key, None)

    def size(self):
        return len(self.store)


class DistributedCache:
    def __init__(self, nodes: list, vnodes_per_node: int = 150):
        self.ring = {}
        self.sorted_positions = []
        self.nodes = {}
        self.node_positions = {}  # node_name -> [positions]
        self.vnodes_per_node = vnodes_per_node

        for node_name in nodes:
            self.add_node(node_name)

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node_name: str):
        node = CacheNode(node_name)
        self.nodes[node_name] = node
        self.node_positions[node_name] = []

        for i in range(self.vnodes_per_node):
            vnode_key = f"{node_name}:vn{i}"
            pos = self._hash(vnode_key)
            self.ring[pos] = node
            self.node_positions[node_name].append(pos)
            bisect.insort(self.sorted_positions, pos)

    def remove_node(self, node_name: str):
        if node_name not in self.nodes:
            return
        for pos in self.node_positions[node_name]:
            del self.ring[pos]
            idx = bisect.bisect_left(self.sorted_positions, pos)
            self.sorted_positions.pop(idx)
        del self.nodes[node_name]
        del self.node_positions[node_name]

    def _get_node(self, key: str) -> CacheNode:
        if not self.ring:
            return None
        pos = self._hash(key)
        idx = bisect.bisect_right(self.sorted_positions, pos)
        if idx == len(self.sorted_positions):
            idx = 0
        return self.ring[self.sorted_positions[idx]]

    def get(self, key: str):
        node = self._get_node(key)
        return node.get(key) if node else None

    def set(self, key: str, value, ttl: int = 0):
        node = self._get_node(key)
        if node:
            node.set(key, value, ttl)

    def delete(self, key: str):
        node = self._get_node(key)
        if node:
            node.delete(key)

    def stats(self) -> dict:
        return {name: node.size() for name, node in self.nodes.items()}


if __name__ == "__main__":
    cache = DistributedCache(["cache-1", "cache-2", "cache-3"])

    for i in range(10000):
        cache.set(f"user:{i}", {"name": f"User {i}", "score": i * 10})

    print("Key distribution:")
    for name, count in sorted(cache.stats().items()):
        print(f"  {name}: {count} keys ({count/100:.1f}%)")

    hits = sum(1 for i in range(10000) if cache.get(f"user:{i}") is not None)
    print(f"\\nRead verification: {hits}/10000 keys found")

    print("\\nAdding cache-4...")
    cache.add_node("cache-4")
    hits_after = sum(1 for i in range(10000) if cache.get(f"user:{i}") is not None)
    moved = 10000 - hits_after
    print(f"Keys moved (cache misses): {moved}/10000 ({moved/100:.1f}%)")
    print("New distribution:")
    for name, count in sorted(cache.stats().items()):
        print(f"  {name}: {count} keys")
`,
    },
    {
      id: "cache-invalidation",
      slug: "cache-invalidation-patterns",
      title: "Cache Invalidation Patterns",
      content: `Phil Karlton famously said there are only two hard things in computer science: cache invalidation and naming things. When cached data becomes stale, how do you ensure clients see fresh data without hammering your database?

## Why Invalidation Is Hard

\`\`\`concept
{ "title": "The Stale Data Problem", "variant": "mental-model", "content": "T=0: DB has user.name = \\"Alice\\"\\n     Cache has user.name = \\"Alice\\"  ✓ consistent\\n\\nT=1: Admin updates DB: user.name = \\"Alicia\\"\\n     Cache STILL has user.name = \\"Alice\\"  ✗ stale!\\n\\nT=2: App reads from cache → returns \\"Alice\\"  (WRONG)\\n\\nThe cache and DB are now diverged. How long does the app serve wrong data — and how do you know when to fix it?" }
\`\`\`

Every invalidation pattern below is an answer to that final question. They differ in *who* decides when the cache is dirty and *how quickly* it recovers.

---

## Pattern 1: TTL (Time-To-Live)

The simplest approach. Every cached entry expires after a fixed duration; the next read triggers a fresh fetch.

\`\`\`playground
{ "title": "TTL in Action", "language": "python", "code": "import time\\n\\n# Simulate a simple TTL cache\\ncache = {}  # key -> (value, expires_at)\\n\\ndef set_with_ttl(key, value, ttl_seconds):\\n    cache[key] = (value, time.time() + ttl_seconds)\\n    print(f\\"Cached '{key}' = '{value}' for {ttl_seconds}s\\")\\n\\ndef get(key):\\n    if key not in cache:\\n        return None, \\"MISS (not found)\\"\\n    value, expires_at = cache[key]\\n    if time.time() > expires_at:\\n        del cache[key]\\n        return None, \\"MISS (expired)\\"\\n    remaining = round(expires_at - time.time(), 1)\\n    return value, f\\"HIT (expires in {remaining}s)\\"\\n\\nset_with_ttl(\\"user:100\\", \\"Alice\\", ttl_seconds=5)\\nprint(get(\\"user:100\\"))   # HIT\\ntime.sleep(6)\\nprint(get(\\"user:100\\"))   # MISS — expired, next read hits DB", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The TTL Tradeoff Dial", "content": "**Short TTL** → fresher data, more DB load (every N seconds, all N clients miss at once — see thundering herd below).\\n\\n**Long TTL** → less DB load, more staleness.\\n\\nThere is no universally correct TTL. Tune it per data type, not per system." }
\`\`\`

---

## Pattern 2: Event-Driven Invalidation

When the source of truth changes, it publishes an event that triggers a targeted cache delete — no waiting for a timer.

\`\`\`sysdiag
{ "title": "Event-Driven Invalidation Flow", "width": 660, "height": 200, "nodes": [ { "id": "app", "label": "App Server", "x": 80, "y": 100, "kind": "service" }, { "id": "db", "label": "DB", "x": 220, "y": 100, "kind": "storage" }, { "id": "bus", "label": "Event Bus", "x": 380, "y": 100, "kind": "queue" }, { "id": "inv", "label": "Invalidator", "x": 520, "y": 60, "kind": "worker" }, { "id": "cache", "label": "Cache", "x": 520, "y": 150, "kind": "storage" } ], "edges": [ { "from": "app", "to": "db", "label": "UPDATE users" }, { "from": "db", "to": "bus", "label": "emit: user:100 changed" }, { "from": "bus", "to": "inv", "label": "consume" }, { "from": "inv", "to": "cache", "label": "DELETE user:100" } ], "annotations": { "bus": "Redis Pub/Sub, Kafka, or RabbitMQ carries the invalidation event. At-least-once delivery means DELETE may fire twice — that is fine, it is idempotent.", "inv": "Single-threaded consumer avoids race conditions between multiple invalidation workers." } }
\`\`\`

**Pros:** Near-instant invalidation — staleness is bounded by event propagation latency (typically milliseconds).  
**Cons:** Requires an event bus. Events can be delayed, reordered, or lost. Adds operational complexity.

---

## Pattern 3: Change Data Capture (CDC)

Instead of instrumenting application code, read the database's own transaction log to detect every change.

\`\`\`concept
{ "title": "CDC Invalidation", "variant": "insight", "content": "DB Transaction Log (WAL / binlog):\\n  [LSN 1001] UPDATE users SET name='Alicia' WHERE id=100\\n  [LSN 1002] INSERT orders (user_id=100, item='book')\\n\\nCDC Consumer (e.g., Debezium):\\n  Reads log continuously\\n  LSN 1001 → cache.delete(\\"user:100\\")\\n  LSN 1002 → cache.delete(\\"orders:user:100\\")\\n\\nKey insight: the DB is the event source — no application code needs changing.\\nThis captures writes from BI tools, migrations, admin patches — anything." }
\`\`\`

**Pros:** Zero application changes. Captures ALL writes regardless of source.  
**Cons:** Higher infrastructure complexity. Slight propagation delay (log tailing). Requires CDC tooling (Debezium, Maxwell, AWS DMS).

---

## Pattern 4: Write-Through Delete

On every write, delete the cache entry. The next read will populate it fresh. This is the most common pattern for standard web apps.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Race-prone: update in place", "code": "# Thread 1\\nDB.update(user_id=100, name=\\"Alicia\\")\\ncache.set(\\"user:100\\", \\"Alicia\\")   # ← written last?\\n\\n# Thread 2 (writes between Thread 1's two operations)\\nDB.update(user_id=100, name=\\"Ali\\")\\ncache.set(\\"user:100\\", \\"Ali\\")      # ← overwritten by Thread 1?\\n\\n# Race result: DB has \\"Ali\\" but cache may have \\"Alicia\\"" }, "after": { "label": "Safe: delete instead of update", "code": "# Thread 1\\nDB.update(user_id=100, name=\\"Alicia\\")\\ncache.delete(\\"user:100\\")           # idempotent\\n\\n# Thread 2\\nDB.update(user_id=100, name=\\"Ali\\")\\ncache.delete(\\"user:100\\")           # also idempotent\\n\\n# Next read: cache miss → fetch DB → gets \\"Ali\\"  ✓\\n# Deletes are always safe — updates can race" } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Rule of Thumb: Delete, Never Update", "content": "Prefer \`cache.delete(key)\` over \`cache.set(key, new_value)\` during writes. Deletes are idempotent and commute — two concurrent deletes are safe. Two concurrent set-updates can leave the cache diverged from the DB." }
\`\`\`

---

## Pattern 5: Lease-Based Invalidation

When a cache miss occurs, the cache issues a **lease** (a short-lived token). Only the lease holder may populate the cache. Everyone else must wait or retry. This prevents the *thundering herd*: dozens of concurrent misses all racing to query the DB.

\`\`\`trace
{ "title": "Lease-Based Population (Facebook Memcache Pattern)", "language": "python", "code": "import time, random\\n\\ncache = {}\\nleases = {}       # key -> (token, expiry)\\nLEASE_TTL = 5     # seconds\\n\\ndef cache_get(key, client_id):\\n    if key in cache:\\n        return cache[key], \\"HIT\\"\\n    now = time.time()\\n    existing = leases.get(key)\\n    if existing is None or existing[1] < now:\\n        token = random.randint(1000, 9999)\\n        leases[key] = (token, now + LEASE_TTL)\\n        return None, f\\"MISS — lease {token} issued to {client_id}\\"\\n    return None, f\\"MISS — lease held, {client_id} should wait and retry\\"\\n\\ndef cache_set(key, value, token):\\n    held = leases.get(key)\\n    if held and held[0] == token:\\n        cache[key] = value\\n        del leases[key]\\n        return \\"STORED\\"\\n    return \\"REJECTED (token mismatch)\\"\\n\\nv, msg = cache_get(\\"user:100\\", \\"ClientA\\")\\nprint(msg)\\nv2, msg2 = cache_get(\\"user:100\\", \\"ClientB\\")\\nprint(msg2)\\nprint(cache_set(\\"user:100\\", \\"Alicia\\", leases.get(\\"user:100\\", (None,))[0]))\\nprint(cache_get(\\"user:100\\", \\"ClientB\\"))", "frames": [ { "line": 8, "vars": { "cache": {}, "leases": {} }, "note": "Empty cache, no leases", "stdout": "" }, { "line": 14, "vars": { "leases": { "user:100": [5237, "T+5"] } }, "note": "Client A misses, gets lease token 5237", "stdout": "MISS — lease 5237 issued to ClientA" }, { "line": 17, "vars": { "leases": { "user:100": [5237, "T+5"] } }, "note": "Client B also misses — sees existing lease, told to wait", "stdout": "MISS — lease held, ClientB should wait and retry" }, { "line": 22, "vars": { "cache": { "user:100": "Alicia" }, "leases": {} }, "note": "Only Client A (token matches) can write. Lease consumed.", "stdout": "STORED" }, { "line": 8, "vars": { "cache": { "user:100": "Alicia" } }, "note": "Client B retries — now a cache HIT", "stdout": "('Alicia', 'HIT')" } ], "speed": 900 }
\`\`\`

---

## Choosing a Pattern

\`\`\`tabs
{ "tabs": [ { "label": "Comparison Table", "icon": "📊", "content": "| Pattern | Max Staleness | Complexity | Best For |\\n|---|---|---|---|\\n| TTL only | Up to TTL | Very low | Nightly batch data, product catalogs |\\n| Event-driven | Milliseconds | Medium | Real-time consistency, microservices |\\n| CDC | Milliseconds | High | Legacy systems, no app changes allowed |\\n| Write-through delete | Near-zero | Low | Standard CRUD web apps |\\n| Lease-based | Near-zero | Medium | High-traffic keys, thundering herd prevention |" }, { "label": "Decision Guide", "icon": "🔀", "content": "**Data changes on a schedule (nightly batch)?**\\nUse TTL matching your batch window. Simple and reliable.\\n\\n**Multiple services writing to the same data?**\\nUse event-driven or CDC — your app can't be the single source of invalidation triggers.\\n\\n**Direct DB writes from BI tools or migrations?**\\nUse CDC (Debezium) — it reads the WAL regardless of what wrote to the DB.\\n\\n**Hot keys causing thundering herd on expiry?**\\nLayer lease-based population on top of any other strategy.\\n\\n**Standard web app, single ownership per record?**\\nWrite-through delete is usually sufficient and simple." }, { "label": "Real-World Examples", "icon": "🏭", "content": "**Twitter** — hot trending-topic keys are replicated across multiple cache nodes; TTL + event invalidation when topic scores update.\\n\\n**Netflix** — popular content keys replicated + consistent hashing to distribute load; CDC-style invalidation when metadata changes.\\n\\n**Facebook Memcache** — lease-based invalidation to prevent thundering herd on viral posts. Introduced the \\"lease\\" concept.\\n\\n**E-commerce inventory** — write-through delete on every purchase; short TTL (30s) as backstop for race conditions." } ] }
\`\`\`

---

\`\`\`quiz
{ "title": "Pick the Right Invalidation Pattern", "questions": [ { "question": "Your product catalog is updated by a nightly batch job at 2 AM. Which invalidation pattern has the best complexity/freshness tradeoff?", "options": ["TTL set to 24 hours", "Event-driven invalidation", "CDC with Debezium", "Lease-based write-through"], "answer": 0, "explanation": "TTL is simplest when changes are predictable and the acceptable staleness window matches the batch interval. No event bus or CDC infrastructure required." }, { "question": "Inventory counts are written by three independent microservices. You need sub-second consistency. Which pattern?", "options": ["TTL with 1-second expiry", "Event-driven invalidation", "Write-through delete per service", "CDC reading the DB WAL"], "answer": 1, "explanation": "Event-driven invalidation lets each service publish an invalidation event on write without coupling them directly to the cache. Sub-second propagation is achievable over Redis Pub/Sub or Kafka." }, { "question": "A third-party BI tool writes directly to your Postgres database, bypassing your application entirely. How do you invalidate?", "options": ["Event-driven (application publishes on write)", "Write-through delete", "CDC (read the WAL)", "TTL only"], "answer": 2, "explanation": "CDC reads the database transaction log (WAL/binlog) directly. It captures every write regardless of what process caused it — application code, BI tools, migrations, or admin patches." }, { "question": "A viral social post causes 50,000 concurrent cache misses the moment its TTL expires. What problem is this and how do you fix it?", "options": ["Cache penetration — add null caching", "Cache avalanche — stagger TTLs", "Thundering herd — use lease-based population", "Hot key — replicate across shards"], "answer": 2, "explanation": "Thundering herd (a.k.a. cache stampede) occurs when many requests race to repopulate a single expired key. Lease-based invalidation ensures only one client queries the DB; others wait and retry, hitting the cache on the second attempt." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "TTL is the baseline — every cache entry should have one, even if long.", "Layer event-driven or write-through delete on top of TTL for data that must be fresh.", "CDC captures writes that bypass your application (BI tools, migrations) — no app code changes needed.", "Always prefer cache.delete() over cache.set() on writes — deletes are idempotent, updates can race.", "Use leases (Facebook's pattern) to prevent thundering herd on popular or high-churn keys." ] }
\`\`\``,
    },
    {
      id: "cache-hot-keys",
      slug: "cache-hot-key-solutions",
      title: "Hot Key Solutions",
      content: `# Hot Key Solutions

A **hot key** is a single cache key that receives a disproportionate amount of traffic. One viral post, a flash sale product, or a celebrity profile can overwhelm a single cache node — because consistent hashing maps every key to exactly one node, deterministically, forever.

\`\`\`concept
{ "title": "The Hot Key Problem", "variant": "mental-model", "content": "Consistent hashing is excellent for distributing load across keys. But it guarantees that all requests for a specific key always go to the same node. If 'product:iphone-sale' gets 50,000 req/sec out of 100,000 total, one node absorbs half the cluster's traffic. The other nodes are idle. That one node is on fire." }
\`\`\`

## Why This Is Dangerous

\`\`\`algoviz
{ "title": "Hot Key: Load Imbalance Across Cache Nodes", "type": "array", "data": [10000, 10000, 10000, 10000, 10000], "frames": [ { "highlight": [], "label": "Baseline: 100K req/sec spread across 5 nodes — ~10K each (healthy)", "stats": { "total_rps": 100000, "max_node_rps": 10000 } }, { "highlight": [2], "label": "'product:iphone-sale' flash sale begins — 50K req/sec, all hashing to Node 3", "stats": { "node_3_rps": 60000, "others_rps": 10000 } }, { "highlight": [2], "label": "Node 3 hits CPU ceiling. Memory pressure spikes. Latency rises for ALL keys on that node.", "stats": { "node_3_status": "OVERLOADED", "latency_impact": "+300ms", "risk": "OOM / crash" } } ], "speed": 900 }
\`\`\`

No single technique handles every hot key scenario. Production systems build a layered defense.

---

## The Four Solutions

\`\`\`tabs
{ "tabs": [ { "label": "L1 Local Cache", "icon": "⚡", "content": "### Solution 1: L1 Local Cache\\n\\nCache hot keys directly in each application server's **process memory** — before the request ever reaches Redis.\\n\\n**How it works:**\\n- Every app server keeps an in-memory LRU cache (e.g., a hashmap capped at 256 MB)\\n- TTL is short — 5–30 seconds — to bound staleness\\n- Read path: L1 check (microseconds) → L2 Redis check (milliseconds) → database\\n\\n**The math:**\\n\\n\`\`\`\\n50K hot req/sec ÷ 20 app servers = 2,500 req/sec per server (handled locally)\\nL2 Redis sees only TTL-refresh reads: ~2 req/sec total\\n\`\`\`\\n\\n**Pros:** Eliminates hot key pressure on Redis entirely. Zero network overhead for L1 hits.\\n\\n**Cons:** Each server holds its own copy (memory overhead × N servers). Data can be stale up to L1 TTL." }, { "label": "Key Replication", "icon": "🔁", "content": "### Solution 2: Key Replication\\n\\nStore the **same value under N different keys**, spread across N different nodes.\\n\\n**How it works:**\\n\\n\`\`\`\\nHot key: product:iphone-sale\\n\\nReplicated as:\\n  product:iphone-sale:r0  → Node 1\\n  product:iphone-sale:r1  → Node 3\\n  product:iphone-sale:r2  → Node 5\\n  product:iphone-sale:r3  → Node 7\\n\\nOn read:\\n  replica_id = random(0, 3)\\n  GET product:iphone-sale:r{replica_id}\\n\`\`\`\\n\\n**The math:** 50K req/sec ÷ 4 replicas = 12,500 req/sec per node (manageable)\\n\\n**Pros:** Spreads read load across nodes. Works in the cache tier — no application logic changes.\\n\\n**Cons:** Writes must update all replicas. Invalidation must delete ALL replica keys simultaneously or you serve stale data." }, { "label": "Dynamic Detection", "icon": "🔍", "content": "### Solution 3: Hot Key Detection & Migration\\n\\nDetect hot keys at runtime using probabilistic tracking, then apply mitigation automatically.\\n\\n**Detection mechanism:** Each cache node runs a **Count-Min Sketch** — a memory-efficient frequency estimator (~100 KB per node, regardless of key-space size) that samples ~1% of requests.\\n\\n**Mitigation options when threshold is exceeded (e.g., 1,000 req/sec on one node):**\\n- Promote key to L1 cache on all app servers via pub/sub broadcast\\n- Create read replicas across N nodes\\n- Extend TTL to reduce refresh frequency\\n\\n**Netflix** applies this pattern for popular content — trending movie keys are replicated across Redis nodes automatically when traffic spikes.\\n\\n**Pros:** Handles unexpected hot keys (you can't always predict what goes viral). Self-healing.\\n\\n**Cons:** Detection has latency — there's a window where the hot key is unmitigated. Adds operational complexity." }, { "label": "Request Coalescing", "icon": "🔗", "content": "### Solution 4: Request Coalescing (Singleflight)\\n\\nWhen a key expires and many requests arrive simultaneously, **only ONE request goes to the database**. All others wait and share the result.\\n\\nThis pattern is called **singleflight** (Go's \`golang.org/x/sync/singleflight\`) or a **dogpile lock**.\\n\\n**Best for:**\\n- Cache expiry storms (thundering herd)\\n- Burst traffic on a key that just missed\\n\\n**Mechanism:** An in-flight map tracks pending DB queries by key. New arrivals for the same key subscribe to the existing query instead of firing a new one.\\n\\n**Pros:** Collapses N concurrent DB queries to 1. Result is always fresh — no staleness.\\n\\n**Cons:** Only helps during cache *misses*. Does nothing when the key is present but the owning node is overloaded by reads — use L1 or replication for that." } ] }
\`\`\`

---

## Request Coalescing: Before and After

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Without Coalescing — Thundering Herd", "code": "T=0.000  'product:X' TTL expires in Redis\\nT=0.001  Request A → cache MISS → fires DB query\\nT=0.002  Request B → cache MISS → fires DB query\\nT=0.003  Request C → cache MISS → fires DB query\\nT=0.004  Request D → cache MISS → fires DB query\\nT=0.005  Request E → cache MISS → fires DB query\\n\\nResult: 5 identical DB queries in 5ms\\nDB sees 50x amplification on every hot key expiry" }, "after": { "label": "With Coalescing — Singleflight Pattern", "code": "T=0.000  'product:X' TTL expires in Redis\\nT=0.001  Request A → cache MISS\\n         → fire DB query\\n         → in-flight: {'product:X': <pending>}\\nT=0.002  Request B → cache MISS\\n         → in-flight map has 'product:X'\\n         → subscribe, wait\\nT=0.003  Requests C, D, E → all subscribe, wait\\n\\nT=0.050  DB returns result\\n         → cache populated\\n         → A, B, C, D, E all receive result\\n\\nResult: 1 DB query. Zero amplification." } }
\`\`\`

---

## Dynamic Detection: How the Pipeline Works

\`\`\`steps
{ "title": "Runtime Hot Key Detection & Mitigation Pipeline", "steps": [ { "title": "Sample request frequency per key", "content": "Each cache node runs a **Count-Min Sketch** in the background — a probabilistic data structure that estimates per-key request frequency with ~100 KB memory regardless of key-space size. Roughly 1% of requests are sampled, providing enough statistical accuracy without measurable overhead." }, { "title": "Threshold breach triggers a report", "content": "When a key's estimated frequency exceeds the configured threshold (e.g., 1,000 req/sec on one node), the cache node publishes an alert to a central coordinator:\\n\\n\`\`\`json\\n{\\n  \\"key\\": \\"product:iphone-sale\\",\\n  \\"node\\": \\"cache-node-3\\",\\n  \\"estimated_rps\\": 52000\\n}\\n\`\`\`" }, { "title": "Coordinator selects mitigation strategy", "content": "The coordinator evaluates current cluster state and picks the cheapest effective remedy:\\n- **L1 promotion** — broadcast key+value to all app servers via pub/sub (cheapest, fastest)\\n- **Replica creation** — create \`key:r0..rN\` entries on N different nodes\\n- **TTL extension** — increase TTL on the hot key so it refreshes less frequently\\n\\nStrategies can be combined (e.g., L1 promotion + TTL extension for extreme cases)." }, { "title": "Monitor and remove treatment when traffic cools", "content": "The coordinator continues sampling. When traffic drops below the threshold for a sustained period (typically 60+ seconds), hot-key treatment is removed — replicas are deleted, L1 entries expire, TTLs revert. This prevents permanent memory waste and replica drift accumulating over time." } ] }
\`\`\`

---

## Solution Comparison

| Solution | Hot Reads | Hot Writes | Complexity | Staleness |
|---|---|---|---|---|
| L1 local cache | Excellent | N/A (reads only) | Low | Up to L1 TTL (5–30s) |
| Key replication | Good | Must sync all replicas | Medium | Depends on sync latency |
| Dynamic detection | Good | Moderate | High | Minimal |
| Request coalescing | Good (misses only) | N/A | Medium | None |

\`\`\`callout
{ "type": "info", "title": "Real-World Deployments", "content": "**Twitter** replicates hot keys for trending topics across multiple caching nodes to prevent any single node from becoming a bottleneck during viral events.\\n\\n**Netflix** automatically replicates trending movie keys across Redis nodes using consistent hashing — popular content gets distributed read load rather than concentrating it. Both companies monitor for hot keys dynamically rather than pre-configuring every possible hot key." }
\`\`\`

---

## Production Recommendation

\`\`\`callout
{ "type": "success", "title": "Recommended Layered Hot Key Defense", "content": "1. **L1 cache** for *known* hot keys (product pages, config data, session data) — TTL 5–30s, bounded memory per server\\n2. **Request coalescing (singleflight)** for ALL cache misses — prevents thundering herd unconditionally, not just for hot keys\\n3. **Count-Min Sketch sampling** (~1% of requests) on every cache node for runtime hot key detection\\n4. **Runbook** for manual escalation: increase replicas, extend TTL, force-push L1 entries during incidents\\n\\nNo single technique covers all scenarios. Combine all four." }
\`\`\`

---

\`\`\`quiz
{ "title": "Hot Key Solutions", "questions": [ { "question": "Why does consistent hashing make hot key problems worse compared to random key assignment?", "options": [ "Consistent hashing is slower than modulo hashing for lookups", "Consistent hashing maps all requests for one key to the same node, always", "Consistent hashing doesn't support read replicas", "Consistent hashing requires rehashing the entire key space on updates" ], "answer": 1, "explanation": "Consistent hashing deterministically maps every key to one node on the hash ring. This is excellent for minimizing redistribution when nodes join or leave — but it means every request for 'product:iphone-sale' always goes to the exact same node. Random assignment would scatter the same key across different nodes but you'd never know where to find it." }, { "question": "You have an L1 cache with a 10-second TTL running on 20 app servers. A hot key receives 40,000 req/sec. Approximately how many req/sec does the L2 Redis node for that key receive?", "options": [ "40,000 req/sec (all requests pass through to L2)", "2,000 req/sec (40,000 ÷ 20 servers)", "2 req/sec (each server makes one refresh per TTL window)", "0 req/sec (L1 absorbs 100% of traffic)" ], "answer": 2, "explanation": "Each app server independently holds the value in L1. When the TTL expires on one server, that one server fires one refresh request to L2. With 20 servers and a 10-second TTL, L2 sees approximately 20 ÷ 10 = 2 refresh requests per second — not the 40,000 user-facing requests, which all hit L1." }, { "question": "What is the primary limitation of request coalescing (singleflight) as a hot key solution?", "options": [ "It requires Redis Cluster mode and cannot work with standalone Redis", "It only helps during cache misses, not when the key is present on an overloaded node", "It cannot be combined with L1 caching", "It increases total database load by batching and delaying queries" ], "answer": 1, "explanation": "Singleflight collapses concurrent requests for a *missing* key into one DB query. But if the key is present in cache and the node is overwhelmed by 50K read requests per second, coalescing provides no relief — the key exists, requests aren't coalescing, the node is still overloaded. L1 caching or key replication are the right tools for that scenario." }, { "question": "When using key replication with 4 replicas (product:X:r0 through product:X:r3), a price update arrives for product X. What is the correct invalidation approach?", "options": [ "Delete only product:X:r0 — it is the primary replica and others self-sync", "Delete all four replica keys (r0, r1, r2, r3) explicitly", "Replicas expire naturally via TTL — no manual invalidation needed", "Update product:X:r0 and the consistent hashing ring propagates the change" ], "answer": 1, "explanation": "Replica keys are independent entries in the cache — there is no automatic synchronization between them. Missing any replica means some fraction of reads will continue serving stale data until that replica's TTL expires. A correct invalidation must explicitly delete every replica key (r0 through r3) in the same operation, typically using a Redis pipeline or Lua script for atomicity." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Hot keys are inevitable at scale — consistent hashing routes all traffic for a given key to one node, creating a single point of overload that doesn't self-resolve.", "L1 local caching is the most effective defense for known hot keys: it absorbs reads in process memory, reducing L2 Redis traffic for a 50K req/sec hot key to roughly 2 req/sec.", "Request coalescing (singleflight) should be applied to ALL cache misses as a baseline — it prevents thundering herd whether or not the triggering key is a hot key.", "Key replication spreads read load across N nodes but demands write discipline: every replica must be explicitly invalidated on any data update.", "Production systems layer all four defenses: L1 for known hot data, coalescing for misses, Count-Min Sketch sampling for runtime detection, and a runbook for manual escalation." ] }
\`\`\``,
    },
    {
      id: "cache-architecture",
      slug: "cache-architecture-walkthrough",
      title: "Distributed Cache: Architecture Walkthrough",
      content: `\`\`\`concept
{"title": "Distributed Cache as a Multi-Tier Shield", "variant": "mental-model", "content": "Think of your cache layers as concentric shields protecting the database:\\n\\n1. **L1 Shield (in-process)**: Paper-thin but instant (~0.01 ms). Absorbs 60-80% of repetitive reads.\\n2. **L2 Shield (Redis cluster)**: Steel plate (~0.5 ms). Catches most remaining hits.\\n3. **Database**: The castle. If both shields fail, the query reaches here (~5 ms).\\n\\nEach shield is tuned differently—L1 trades capacity for speed, L2 balances both, and the database guarantees durability. The goal is to stop the arrow before it reaches the castle."}
\`\`\`

Let's stitch every technique we've discussed into one production-grade system.

## Complete Architecture

\`\`\`sysdiag
{"title": "End-to-End Distributed Cache Flow", "width": 720, "height": 420,
 "nodes": [
   {"id":"client","label":"App Server","x":120,"y":90,"kind":"client"},
   {"id":"l1","label":"L1 Cache\\nTTL 5s","x":120,"y":180,"kind":"cache"},
   {"id":"sf","label":"Singleflight\\n(coalesce)","x":120,"y":270,"kind":"service"},
   {"id":"proxy","label":"Redis Proxy","x":300,"y":180,"kind":"proxy"},
   {"id":"nodeA","label":"Node A\\nslots 0-5460","x":420,"y":120,"kind":"cache"},
   {"id":"nodeB","label":"Node B\\nslots 5461-10922","x":420,"y":180,"kind":"cache"},
   {"id":"nodeC","label":"Node C\\nslots 10923-16383","x":420,"y":240,"kind":"cache"},
   {"id":"replA","label":"Replica A'","x":540,"y":120,"kind":"cache"},
   {"id":"replB","label":"Replica B'","x":540,"y":180,"kind":"cache"},
   {"id":"replC","label":"Replica C'","x":540,"y":240,"kind":"cache"},
   {"id":"db","label":"PostgreSQL\\nSource of Truth","x":420,"y":340,"kind":"db"},
   {"id":"cdc","label":"CDC / Event Bus","x":120,"y":340,"kind":"queue"}
 ],
 "edges": [
   {"from":"client","to":"l1","label":"read"},
   {"from":"l1","to":"sf","label":"miss"},
   {"from":"sf","to":"proxy","label":"fetch"},
   {"from":"proxy","to":"nodeA","label":"CRC16"},
   {"from":"proxy","to":"nodeB","label":"slot"},
   {"from":"proxy","to":"nodeC","label":"map"},
   {"from":"nodeA","to":"replA","label":"replicate"},
   {"from":"nodeB","to":"replB","label":"replicate"},
   {"from":"nodeC","to":"replC","label":"replicate"},
   {"from":"nodeB","to":"db","label":"miss"},
   {"from":"db","to":"cdc","label":"change"},
   {"from":"cdc","to":"client","label":"invalidate"}
 ],
 "annotations": {
   "l1": "Local hash map inside every app process. No network hop.",
   "proxy": "Redis cluster-aware client; handles MOVED/ASK redirects.",
   "cdc": "Debezium reading WAL; publishes cache invalidation events."
 }}
\`\`\`

## Read Path End-to-End

\`\`\`steps
{"title": "Read Path: From Browser Byte to Cache Hit", "steps": [
  {"title": "1. L1 Lookup", "content": "App hashes \`user:100\` in local memory. **Hit ratio ~70%**, latency **0.01ms**. If hit, return immediately — path ends here."},
  {"title": "2. Singleflight Gate", "content": "If L1 misses, check a **per-key in-flight map**. Another goroutine already fetching? Wait on its channel instead of thundering the cluster. This collapses thousands of concurrent misses into a single upstream request."},
  {"title": "3. CRC16 Slot Routing", "content": "Client computes \`CRC16('user:100') → slot 7234\`. Cluster topology says slot 7234 lives on **Node B**; connection is already pooled. Redis Cluster divides the keyspace into **16,384 hash slots** distributed across nodes."},
  {"title": "4. L2 Hit", "content": "Redis returns value in **0.5ms**. Populate L1 with TTL=5s, return to caller. **~95% of requests stop here** in a well-warmed cluster."},
  {"title": "5. DB Miss (Rare)", "content": "Still missing? Query PostgreSQL (**5ms**), then \`SET user:100 <json> EX 300\` in Redis and store in L1. The next 999 reads skip the database entirely."}
]}
\`\`\`

## Write Path End-to-End

\`\`\`compare
{"variant": "good-bad",
 "before": {"label": "Write-Through (slower but safe)", "code": "# Updates both cache + DB in same call\\nredis.setex(key, 300, new_value)\\ndb.execute(\\"UPDATE users SET name=? WHERE id=?\\", new_value, user_id)\\n# Risk: cache and DB can diverge if one fails mid-write"},
 "after": {"label": "Cache-Aside + Invalidation (preferred)", "code": "# 1. Change DB first — source of truth always wins\\ndb.execute(\\"UPDATE users SET name=? WHERE id=?\\", new_value, user_id)\\n# 2. Delete the cache entry (don't update) to avoid races\\nredis.delete(key)\\n# 3. L1 expires via TTL or receives the pub/sub event\\npublish(\\"cache.invalidate\\", key)"}}
\`\`\`

\`\`\`concept
{"title": "Delete, Don't Update on Write", "variant": "rule", "content": "When writing to the database, **delete** the corresponding cache key rather than writing a new value into it. Updating the cache introduces a race window: two concurrent writers can apply their changes out of order, leaving the cache permanently stale. Deletion forces the next read to re-fetch from the canonical source, collapsing the race to a single safe miss."}
\`\`\`

## Failure Scenarios

| Failure | Impact | Auto-Recovery Tactics |
|---------|--------|-----------------------|
| **L1 full** | Eviction surge | LRU frees cold entries; alert if churn > 1 k/s |
| **Redis node crash** | 1/3 slots unavailable | Replica promoted in < 5 s; clients retry on MOVED |
| **Cluster network partition** | Partial slot loss | Redis Cluster continues serving reachable slots; app degrades gracefully |
| **Hot key spike** | One slot CPU 100% | L1 absorbs ~80%; singleflight collapses 5 k concurrent reads into one |
| **Database slow query** | Cache miss latency jumps | Circuit-breaker opens after 50% error rate; serve stale data with \`stale-while-revalidate\` |

\`\`\`callout
{"type": "info", "title": "MOVED vs ASK: What Redis Errors Mean in Practice", "content": "**MOVED** is a permanent redirect — the cluster has finished migrating a slot to a new node and all future requests should go there. Update your local routing table.\\n\\n**ASK** is a temporary redirect — migration is in progress; send this one request to the target node but keep routing future requests to the original until you see MOVED.\\n\\nA well-written cluster client handles both transparently. If you see them in logs at high volume, a node failover or resharding is occurring."}
\`\`\`

## Cache Warming & Cold Start

\`\`\`algoviz
{"title": "Gradual Traffic Ramp-Up — Hit Rate Progression", "type": "array",
 "data": ["miss","miss","miss","hit","hit","hit","hit","hit","hit","hit"],
 "frames": [
   {"highlight":[0,1,2],"label":"0% traffic routed → 100% miss rate, full DB load","stats":{"traffic%":0,"hitRate%":0}},
   {"highlight":[3,4],"label":"10% traffic → first hot keys populate, 20% hits","stats":{"traffic%":10,"hitRate%":20}},
   {"highlight":[5,6,7],"label":"50% traffic → 60% hit rate, DB load halved","stats":{"traffic%":50,"hitRate%":60}},
   {"highlight":[8,9],"label":"100% traffic → 90%+ hit rate, steady state","stats":{"traffic%":100,"hitRate%":90}}
 ],
 "speed": 1200}
\`\`\`

Three complementary strategies prevent thundering herds on cold start:

1. **Shadow mode** — New cluster receives mirrored reads but discards results until hit rate exceeds 90%. No user impact during warm-up.
2. **Pre-load** — A Spark or SQL job bulk-inserts the hottest records:
   \`\`\`sql
   SELECT id, json_blob FROM users ORDER BY read_count DESC LIMIT 10000;
   \`\`\`
   Pipe into Redis with a 5-minute TTL so stale pre-loads expire before they cause consistency issues.
3. **Traffic ramp** — Start at 1%, double every 5 minutes while watching DB connection count and p99 latency. Roll back immediately if either metric spikes.

## Monitoring Dashboard

\`\`\`callout
{"type": "warning", "title": "Alert Fatigue Prevention", "content": "Page on-call only for **symptom-based SLOs**: p99 read latency > 20 ms or hit ratio < 90%. Everything else — memory usage, eviction counts, replication lag — should create tickets, not pages. False alarms erode trust in your alerting system."}
\`\`\`

| Metric | Target | Source |
|--------|--------|--------|
| **L1 hit ratio** | > 80% | App telemetry (Micrometer / Prometheus) |
| **L2 hit ratio** | > 95% | Redis \`keyspace_hits / (hits + misses)\` |
| **p99 GET latency** | < 1 ms | Redis \`latency percentile 99\` |
| **Evictions/sec** | near 0 | Redis \`evicted_keys\` delta |
| **Replica lag** | < 1 s | \`master_last_io_seconds_ago\` |

\`\`\`collapse
{"title": "Deep Dive: Tracing a Hot Key Through the Full Stack", "content": "Suppose key \`product:celebrity-drop\` suddenly receives 50,000 req/s during a flash sale.\\n\\n**Step 1 — L1 absorbs 80%**\\nEvery app instance has the key locally. ~40,000 req/s never leave the process. Latency: 0.01 ms.\\n\\n**Step 2 — Singleflight collapses L2 pressure**\\nOf the remaining 10,000 req/s that miss L1 (cold app instances, short TTL expiry), singleflight deduplicates per-instance. If 200 goroutines miss L1 simultaneously, only 1 hits Redis.\\n\\n**Step 3 — Local replication option**\\nFor truly pathological hot keys, replicate the key to *all* Redis nodes (not just its owner) and read from a random replica. This trades memory for even CPU spread.\\n\\n**Step 4 — Key sharding as last resort**\\nSplit \`product:celebrity-drop\` into \`product:celebrity-drop:shard:0\` through \`:shard:9\`. Write to all 10, read a random shard. Requires application logic but eliminates the hot slot entirely.\\n\\nThe singleflight + L1 combination handles 99% of hot key scenarios without any sharding complexity."}
\`\`\`

\`\`\`quiz
{"title": "Architecture Walkthrough Check", "questions": [
  {"question": "Which layer absorbs the highest percentage of reads in a well-tuned system?", "options": ["PostgreSQL", "Redis cluster", "L1 in-process cache", "CDC event bus"], "answer": 2, "explanation": "L1 typically absorbs 60-80% of reads because it is closest to the request with zero network hops. The Redis cluster handles most of what remains, leaving only a tiny fraction reaching the database."},
  {"question": "Why is cache-aside + delete preferred over write-through for most workloads?", "options": ["It guarantees stronger consistency", "It eliminates the race window where two writers can leave the cache stale", "It reduces write amplification by skipping the cache on every write", "It works without any message queue infrastructure"], "answer": 1, "explanation": "Deleting the cache key rather than updating it removes the window where concurrent writers can apply changes out of order. The next read simply re-fetches from the database, which is always authoritative."},
  {"question": "During a Redis node failure, what redirect error do cluster-aware clients first receive?", "options": ["ASK", "MOVED", "CLUSTERDOWN", "READONLY"], "answer": 1, "explanation": "MOVED is a permanent redirect — it tells the client which node now owns the slot after failover and to update its local routing table. ASK is a temporary redirect used during live slot migration."},
  {"question": "In the gradual cache warming strategy, what is the purpose of shadow mode?", "options": ["To run two Redis clusters in active-active", "To mirror reads to the new cluster while discarding results until hit rate is high enough", "To pre-populate keys with a Spark bulk-insert job", "To delay TTL expiry during warm-up"], "answer": 1, "explanation": "Shadow mode routes real production reads to the new cluster but ignores its responses until the hit rate reaches the target threshold (e.g., 90%). This warms the cache under real traffic patterns without any user-visible impact from cache misses."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Multi-tier caching (L1 + L2) eliminates ~95% of database reads; singleflight collapses the thundering herd on the remaining 5%.",
  "Consistent hashing distributes 16,384 hash slots evenly — adding or removing nodes reshuffles fewer than 1% of keys.",
  "On write: invalidate (delete), don't update. Pair with TTL as a safety net for missed invalidations.",
  "Warm new clusters with shadow traffic and a top-K pre-load query to avoid cold-start thundering herds.",
  "Alert only on symptom-based SLOs (p99 latency, hit ratio). Everything else is a ticket, not a page."
]}
\`\`\``,
    },
  ],
};
