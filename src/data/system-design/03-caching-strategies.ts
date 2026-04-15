import { Module } from "../types";

export const cachingStrategiesModule: Module = {
  id: "caching-strategies",
  title: "Caching Strategies",
  description: "Master every layer of the caching hierarchy — client, CDN, application, and database — and learn when each caching pattern is the right tool.",
  lessons: [
    {
      id: "why-caching-exists",
      slug: "why-caching-exists",
      title: "Why Caching Exists: The Memory Hierarchy",
      content: `# Why Caching Exists: The Memory Hierarchy

Every caching decision you make in a distributed system traces back to one physical reality: **not all storage is created equal**. Faster storage costs more and holds less. Slower storage is cheap and abundant. This tradeoff is as old as computing itself — and it's why caching exists at every level of your stack.

Before you can design a cache, you need to feel the numbers in your gut.

---

\`\`\`concept
{ "title": "The Core Insight", "variant": "mental-model", "content": "A computer's storage is arranged in a hierarchy: the closer storage is to the CPU, the faster it is — but the smaller and more expensive it becomes. Every caching decision is an attempt to keep hot data one level closer to where it's consumed." }
\`\`\`

---

## The Latency Numbers Every Engineer Must Know

In 1999, Jeff Dean at Google published a set of latency numbers that became an industry landmark. Generations of engineers have memorized these to build better intuition about system performance. Let's walk through each tier:

\`\`\`tabs
{ "tabs": [
  {
    "label": "L1/L2 Cache",
    "icon": "⚡",
    "content": "**CPU L1 Cache**\\n\\n- **Latency:** ~0.5–4 nanoseconds\\n- **Size:** 32–512 KB per core\\n- **Cost:** Very high per byte\\n\\nThe CPU's on-chip cache. Accessing data here is nearly instantaneous. The CPU automatically manages this — software engineers rarely interact with it directly.\\n\\n**L2 Cache:** 4–12 ns, 256 KB – 4 MB per core\\n\\nStill on-chip (or adjacent), still extremely fast. A cache miss at L2 is roughly 10x slower than an L1 hit."
  },
  {
    "label": "RAM",
    "icon": "🧠",
    "content": "**Main Memory (DRAM)**\\n\\n- **Latency:** ~60–100 nanoseconds\\n- **Size:** 8 GB – 1 TB per machine\\n- **Cost:** Moderate\\n\\nThis is what most people think of as \\"the cache\\" in system design — tools like Redis and Memcached store data here. 100 ns sounds fast, but it's already **100x slower than L1 cache**.\\n\\nA single machine can serve millions of RAM lookups per second. This is why in-memory databases can be so powerful."
  },
  {
    "label": "SSD",
    "icon": "💾",
    "content": "**NVMe / SSD Storage**\\n\\n- **Latency:** ~0.1–1 milliseconds (100,000–1,000,000 ns)\\n- **Size:** 256 GB – 8 TB per device\\n- **Cost:** Low\\n\\nAlready 1,000–10,000x slower than RAM for random reads. Local SSD is often used as an intermediate cache tier between RAM and network storage (e.g., CDN edge servers cache to SSD).\\n\\n**Traditional spinning HDD:** 1–10 ms, plus mechanical seek time of 3–10 ms."
  },
  {
    "label": "Network",
    "icon": "🌐",
    "content": "**Network Round Trips**\\n\\n- **Same datacenter:** ~0.5–1 ms (500,000 ns)\\n- **Cross-region:** ~30–150 ms\\n- **Cross-continent:** ~100–300 ms\\n\\nA round trip within the same datacenter is already ~10x slower than an SSD read. A user in London hitting an origin server in Oregon may wait **150–200 ms** just for the network — before any application logic runs.\\n\\nThis is why CDNs exist: to move data geographically closer to users, turning a 150 ms round trip into a 5 ms edge hit."
  }
]}
\`\`\`

---

## Visualizing the Gap

The numbers above are hard to reason about in nanoseconds. Here's the same hierarchy scaled to human time — a mental model used by engineers at Google:

\`\`\`concept
{ "title": "The Human-Scale Analogy", "variant": "analogy", "content": "If one CPU cycle (0.3 ns) = 1 second of human time:\\n\\n• L1 cache hit = 1 second\\n• L2 cache hit = 14 seconds\\n• RAM access = 4 minutes\\n• SSD read = 1.7–17 days\\n• Same-datacenter network = 5.8 days\\n• Cross-continent network = 5.8–19 years\\n\\nAn L1 cache hit and a cross-continent network call aren't just 'different speeds' — they're on different planets." }
\`\`\`

---

## How Data Travels Up the Hierarchy

When a system needs a piece of data, it checks the fastest (smallest) tier first and works downward until it finds it. Each miss at a tier forces a fetch from the next, slower tier.

\`\`\`steps
{ "title": "The Cache Lookup Cascade", "steps": [
  {
    "title": "Check CPU Cache (L1/L2/L3)",
    "content": "The CPU hardware checks its on-chip cache. If found (a **cache hit**), the data is returned in nanoseconds. This is automatic — managed by hardware, not software.\\n\\nIf not found (a **cache miss**), move to the next tier."
  },
  {
    "title": "Check RAM / In-Process Cache",
    "content": "The application checks in-memory data structures — a local HashMap, an in-process LRU cache (like Guava Cache in Java), or similar.\\n\\nCost: ~100 ns. Still blazingly fast. This is where many application-level caches live.\\n\\nOn a miss, escalate."
  },
  {
    "title": "Check Distributed Cache (Redis / Memcached)",
    "content": "The application makes a network call to a shared in-memory cache cluster. Same hardware tier (RAM), but now we pay network latency: **0.5–1 ms** within a datacenter.\\n\\nRedis can serve ~1 million ops/second per node. A miss here is expensive — it means going to the database."
  },
  {
    "title": "Query the Database",
    "content": "The database may have its own buffer pool (an in-memory cache of hot pages — e.g., PostgreSQL's shared_buffers, InnoDB buffer pool). A hit here costs ~1–5 ms.\\n\\nA **full disk read** on a cache miss may cost 1–10 ms on SSD or 10–100 ms on spinning disk."
  },
  {
    "title": "Fetch from Origin / Remote Storage",
    "content": "The worst case: a network call to an origin server in another region, or fetching from object storage like S3. Costs 30–300 ms or more.\\n\\nThis is what CDN caching exists to eliminate — serving static content from a geographically close edge node instead of crossing the ocean."
  }
]}
\`\`\`

---

## The System Design View: Why This Matters

In a real distributed system, you don't control the CPU cache — but you control everything else. Each tier you can influence represents an opportunity to intercept a slow lookup and serve it faster.

\`\`\`sysdiag
{ "title": "The Caching Hierarchy in a Web Request", "width": 680, "height": 380,
  "nodes": [
    { "id": "user", "label": "User Browser", "x": 60, "y": 190, "kind": "client" },
    { "id": "cdn", "label": "CDN Edge Node", "x": 200, "y": 100, "kind": "service" },
    { "id": "lb", "label": "Load Balancer", "x": 200, "y": 280, "kind": "service" },
    { "id": "app", "label": "App Server", "x": 370, "y": 190, "kind": "service" },
    { "id": "redis", "label": "Redis Cache", "x": 530, "y": 100, "kind": "service" },
    { "id": "db", "label": "Database", "x": 530, "y": 280, "kind": "database" }
  ],
  "edges": [
    { "from": "user", "to": "cdn", "label": "1. static assets" },
    { "from": "user", "to": "lb", "label": "2. dynamic req" },
    { "from": "lb", "to": "app", "label": "3. route" },
    { "from": "app", "to": "redis", "label": "4. cache lookup" },
    { "from": "app", "to": "db", "label": "5. cache miss only" }
  ],
  "annotations": {
    "cdn": "Serves static content (images, JS, CSS) from edge. ~5 ms vs ~150 ms cross-region.",
    "redis": "In-memory cache (RAM). Returns results in <1 ms within datacenter. Absorbs 80-95% of DB reads on hot data.",
    "db": "Authoritative source of truth. Only queried on cache misses. Has its own buffer pool for hot pages.",
    "app": "Checks local in-process cache first (nanoseconds), then Redis (sub-ms), before hitting DB."
  }
}
\`\`\`

---

## Before and After: The Impact of Caching

Here's a concrete example — fetching a user's profile on a social platform with 10M daily active users:

\`\`\`compare
{ "variant": "before-after",
  "before": {
    "label": "No Cache — Every Request Hits the DB",
    "code": "# Each profile view:\\n# 1. App server receives request\\n# 2. Queries Postgres: SELECT * FROM users WHERE id = ?\\n# 3. Database reads from disk (if not in buffer pool)\\n# 4. Returns after 10-50ms\\n#\\n# At 10M DAU, peak ~5,000 req/sec\\n# Each hitting Postgres directly.\\n#\\n# Result:\\n# - DB CPU: 80-100% sustained\\n# - p99 latency: 80-200ms\\n# - DB becomes single point of failure\\n# - Scaling requires expensive vertical upgrades"
  },
  "after": {
    "label": "Redis Cache — 95% of Reads Served from RAM",
    "code": "# Each profile view:\\n# 1. App server receives request\\n# 2. Checks Redis: GET user:12345  (0.3ms)\\n# 3a. Cache HIT (95% of requests):\\n#     Return immediately — total: ~1ms\\n# 3b. Cache MISS (5% of requests):\\n#     Query Postgres, store in Redis (TTL=300s)\\n#     Return after ~15ms\\n#\\n# At 10M DAU, peak ~5,000 req/sec:\\n# - Redis handles 4,750 req/sec\\n# - Postgres handles 250 req/sec\\n#\\n# Result:\\n# - DB CPU: 5-10% sustained\\n# - p99 latency: 2-5ms (cache hit path)\\n# - DB failure is survivable (serve stale)\\n# - Scale reads horizontally with Redis replicas"
  }
}
\`\`\`

---

## Real-World Case Study: Facebook's Memcached at Scale

Facebook is one of the most cited examples of caching at scale. By 2013, their Memcached cluster held over **28 terabytes** of cached data across thousands of servers, serving over a billion users.

\`\`\`collapse
{ "title": "Deep Dive: Facebook's Memcached Architecture", "content": "**The problem:** At Facebook's scale, every user's News Feed requires aggregating data from hundreds of friends' posts, each stored in separate database rows. A single page load might need 10,000+ individual database lookups.\\n\\n**The solution:** A massive distributed Memcached cluster acting as a look-aside cache in front of MySQL.\\n\\n**Key numbers from their 2013 NSDI paper:**\\n- Over **1 billion** Memcached requests per second at peak\\n- Cache hit rate of **99%** for user-facing reads\\n- Hundreds of Memcached servers per cluster, multiple clusters per region\\n\\n**What they cached:** Anything expensive to compute or read frequently — user profiles, friend lists, News Feed aggregations, social graph edges.\\n\\n**The trade-off:** Consistency became harder. When a user updates their profile, all cached copies across hundreds of servers must be invalidated — a problem Facebook solved with their McSqueal and McRouter systems for invalidation messaging.\\n\\n**The lesson:** At scale, the database physically cannot serve every read. You must cache. The question isn't *whether* to cache, but *what*, *where*, and *for how long*." }
\`\`\`

---

\`\`\`callout
{ "type": "info", "title": "The Cache Hit Rate Formula", "content": "**Cache Hit Rate = (Cache Hits) / (Total Requests)**\\n\\nA 90% hit rate means 90% of requests never touch your database. A 99% hit rate means your database sees 10x less load than a 90% rate. That difference can be the gap between a healthy database and a melting one.\\n\\nIn interviews, always estimate your expected hit rate. For content that rarely changes (user profiles, product listings), 95%+ is realistic. For highly dynamic data, 50-70% may be the ceiling." }
\`\`\`

---

## Why Each Layer Exists — The Design Principle

\`\`\`concept
{ "title": "The Caching Principle", "variant": "rule", "content": "Cache as close to the consumer as possible. Every network hop, disk seek, or layer boundary you eliminate shaves latency by an order of magnitude. The memory hierarchy gives you the physical map — your job as a system designer is to decide which layer is the right interception point for each access pattern." }
\`\`\`

The hierarchy shapes every caching decision you'll make:

| Decision | Physical Reason |
|---|---|
| Use Redis instead of re-querying the DB | RAM (100 ns) vs disk (1–10 ms) — 10,000x faster |
| Put a CDN in front of your origin | Edge network (5 ms) vs cross-ocean (150 ms) — 30x faster |
| Use an in-process cache before Redis | Local RAM (100 ns) vs datacenter network (500,000 ns) — 5,000x faster |
| Add a DB buffer pool | Memory (100 ns) vs disk seek (1,000,000 ns) — 10,000x faster |

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  {
    "question": "Approximately how many times slower is a cross-datacenter network round trip compared to a Redis lookup within the same datacenter?",
    "options": ["About 2x slower", "About 10x slower", "About 100–300x slower", "They are roughly the same speed"],
    "answer": 2,
    "explanation": "A Redis lookup within the same datacenter costs ~0.3–1 ms. A cross-region network round trip costs 30–150 ms. That's a 100–300x difference — which is why replication and multi-region caching matter so much for global applications."
  },
  {
    "question": "At Facebook's scale (2013), what was the approximate cache hit rate of their Memcached cluster for user-facing reads?",
    "options": ["60%", "80%", "90%", "99%"],
    "answer": 3,
    "explanation": "Facebook's Memcached cluster achieved ~99% cache hit rate, meaning their MySQL databases only needed to handle roughly 1% of all read traffic. This is what allowed a single logical MySQL dataset to serve over a billion users."
  },
  {
    "question": "A user in Tokyo requests a static image hosted on a server in New York. Without a CDN, round-trip latency is ~150ms. With a Tokyo CDN edge node, it drops to ~5ms. What is the primary physical reason for this improvement?",
    "options": [
      "The CDN compresses the image more efficiently",
      "The CDN server has faster CPUs",
      "The CDN eliminates transcontinental network distance, serving from geographically nearby RAM or SSD",
      "The CDN uses a more efficient protocol than HTTP"
    ],
    "answer": 2,
    "explanation": "The speed of light is a physical limit — data cannot travel faster than ~200,000 km/s through fiber. A Tokyo edge node is thousands of kilometers closer to the user, eliminating most of the propagation delay. The content is served from RAM or SSD on the edge node rather than traveling to New York and back."
  },
  {
    "question": "Your application has a cache hit rate of 80%. Your database can handle 1,000 requests/second before becoming overloaded. What is the maximum total request rate your system can sustain?",
    "options": ["1,000 req/sec", "4,000 req/sec", "5,000 req/sec", "8,000 req/sec"],
    "answer": 2,
    "explanation": "At 80% hit rate, 20% of requests reach the database. If the DB handles 1,000 req/sec, that represents 20% of total traffic. Total = 1,000 / 0.20 = 5,000 req/sec. This is why improving hit rate from 80% to 90% doubles your DB capacity — not a small improvement."
  }
]}
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "The memory hierarchy is the physical foundation of all caching: L1 cache (~1 ns) → RAM (~100 ns) → SSD (~0.1 ms) → Network (~1–150 ms) — each tier is 10–1,000x slower than the previous.",
  "Every cache layer in system design maps to this hierarchy: in-process caches use RAM, Redis uses RAM over a datacenter network, CDNs use SSD/RAM at geographic edge nodes.",
  "Cache hit rate is the lever that matters: going from 90% to 99% hit rate reduces database load by 10x — the difference between a sustainable system and an overloaded one.",
  "Caching introduces a fundamental trade-off: speed vs. consistency. Cached data may be stale. Every caching decision requires a deliberate choice about acceptable staleness (TTL) and invalidation strategy.",
  "In interviews, always identify *where* the bottleneck is before introducing a cache. The memory hierarchy tells you which layer to target and how much improvement to expect."
]}
\`\`\``,
    },
    {
      id: "cache-aside-read-through-write-through",
      slug: "cache-aside-read-through-write-through",
      title: "Cache-Aside, Read-Through, and Write-Through Patterns",
      content: `# Cache-Aside, Read-Through, and Write-Through Patterns

Every cache interaction boils down to two questions: **who fills the cache when data is missing?** and **who keeps it consistent when data changes?** The three patterns in this lesson answer those questions differently — and that difference has real consequences for latency, consistency, and operational complexity.

By the end of this lesson you will be able to: (1) implement all three patterns from memory, (2) explain the failure modes of each, and (3) pick the right pattern for a given consistency requirement.

---

\`\`\`concept
{
  "title": "The Core Trade-off",
  "variant": "mental-model",
  "content": "Cache patterns sit on a spectrum between 'application controls everything' and 'cache controls everything'. Cache-aside puts all logic in your code. Read-through and write-through push that logic into the cache layer. More control means more code; less control means trusting your cache implementation."
}
\`\`\`

---

## Pattern 1 — Cache-Aside (Lazy Loading)

Cache-aside is the most widely deployed pattern. Your application is the **orchestrator**: it checks the cache, queries the database on a miss, writes the result back to the cache, then returns data to the caller. The cache never talks to the database on its own.

\`\`\`steps
{
  "title": "Cache-Aside Read Path",
  "steps": [
    {
      "title": "Check Cache",
      "content": "Application calls \`cache.get(key)\`. If the value exists (**cache hit**), return it immediately — database is never touched."
    },
    {
      "title": "Cache Miss → Query Database",
      "content": "On a miss, the application queries the database directly: \`db.query('SELECT * FROM users WHERE id = ?', userId)\`."
    },
    {
      "title": "Populate Cache",
      "content": "The result is written back to the cache with a TTL: \`cache.set(key, value, ttl=300)\`. Future reads hit the cache."
    },
    {
      "title": "Return to Caller",
      "content": "The application returns the data. The first caller pays the miss penalty; all subsequent callers get cache-speed responses."
    }
  ]
}
\`\`\`

\`\`\`trace
{
  "title": "Cache-Aside: get_user(42)",
  "language": "python",
  "code": "def get_user(user_id):\\n    key = f'user:{user_id}'\\n    cached = cache.get(key)\\n    if cached:\\n        return cached\\n    user = db.query('SELECT * FROM users WHERE id = %s', user_id)\\n    cache.set(key, user, ttl=300)\\n    return user",
  "frames": [
    { "line": 2, "vars": { "user_id": 42, "key": "user:42" }, "note": "Build the cache key" },
    { "line": 3, "vars": { "cached": null }, "note": "Cache miss — key does not exist yet" },
    { "line": 6, "vars": { "user": "{ id:42, name:'Alice' }" }, "note": "Database query executed (miss penalty)" },
    { "line": 7, "vars": {}, "note": "Populate cache with 5-minute TTL" },
    { "line": 8, "vars": {}, "note": "Return data to caller", "stdout": "{ id: 42, name: 'Alice' }" }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Three-Trip Penalty on Every Cold Miss",
  "content": "A cache-aside miss costs **3 network hops**: (1) check cache, (2) query database, (3) write to cache. Under heavy traffic with a cold cache — say, after a node restart — this can cause a **thundering herd**: many requests miss simultaneously, all hit the database at once. Mitigate with a short lock or probabilistic early expiration."
}
\`\`\`

---

## Pattern 2 — Read-Through

Read-through flips the ownership model. Your application calls \`cache.get()\` **and nothing else**. On a miss, the **cache layer** calls the database, stores the result, and returns it. The application is unaware of the database entirely.

This requires a cache that supports a configurable *loader function* — Redis alone does not support this natively, but libraries like **Hazelcast**, **Apache Ignite**, and **NCache** do.

\`\`\`playground
{
  "title": "Simulating Read-Through with a Loader",
  "language": "python",
  "code": "class ReadThroughCache:\\n    def __init__(self, loader_fn, ttl=300):\\n        self._store = {}\\n        self._loader = loader_fn\\n        self._ttl = ttl\\n\\n    def get(self, key):\\n        if key in self._store:\\n            print(f'HIT  {key}')\\n            return self._store[key]\\n        # Cache handles DB call — app never does this directly\\n        print(f'MISS {key} -> loading from DB')\\n        value = self._loader(key)\\n        self._store[key] = value\\n        return value\\n\\n# Simulated database\\nfake_db = {'user:1': 'Alice', 'user:2': 'Bob', 'user:3': 'Carol'}\\ndef db_loader(key):\\n    return fake_db.get(key, 'NOT_FOUND')\\n\\ncache = ReadThroughCache(loader_fn=db_loader)\\n\\nprint(cache.get('user:1'))   # MISS -> loads from DB\\nprint(cache.get('user:1'))   # HIT  -> served from cache\\nprint(cache.get('user:2'))   # MISS -> loads from DB\\nprint(cache.get('user:2'))   # HIT\\n",
  "runnable": true
}
\`\`\`

\`\`\`concept
{
  "title": "Read-Through vs Cache-Aside: Who Calls the Database?",
  "variant": "analogy",
  "content": "Think of a hotel concierge. **Cache-aside**: you look up the restaurant yourself, ask the concierge to hold the address, then go eat. **Read-through**: you ask the concierge for a restaurant; they look it up, tell you, and remember it for next time. Same end result — but the second model means less work for you and the logic lives in one place."
}
\`\`\`

---

## Pattern 3 — Write-Through

Write-through addresses the *write* side. When your application updates data, it writes to the **cache first**. The cache then **synchronously** writes to the database before acknowledging success. Both cache and database are updated atomically from the caller's perspective.

\`\`\`steps
{
  "title": "Write-Through Write Path",
  "steps": [
    {
      "title": "Application Writes to Cache",
      "content": "Application calls \`cache.set(key, value)\` — it does not touch the database directly."
    },
    {
      "title": "Cache Writes to Database (Synchronously)",
      "content": "The cache layer executes \`db.update(...)\` before returning. The write is not complete until both succeed."
    },
    {
      "title": "Acknowledgement",
      "content": "Success is returned only after **both** the cache and database confirm the write. This adds latency but guarantees consistency."
    },
    {
      "title": "Subsequent Reads are Cache Hits",
      "content": "Because the cache was updated at write time, any read immediately after a write is a guaranteed cache hit — no stale read is possible."
    }
  ]
}
\`\`\`

\`\`\`playground
{
  "title": "Write-Through Cache Implementation",
  "language": "python",
  "code": "class WriteThroughCache:\\n    def __init__(self, db):\\n        self._cache = {}\\n        self._db = db  # simulated database dict\\n\\n    def set(self, key, value):\\n        # Step 1: Write to cache\\n        self._cache[key] = value\\n        # Step 2: Synchronously write to DB\\n        self._db[key] = value\\n        print(f'Written to cache and DB: {key} = {value}')\\n\\n    def get(self, key):\\n        if key in self._cache:\\n            return f'cache hit: {self._cache[key]}'\\n        return f'cache miss — need read-through or cache-aside'\\n\\ndatabase = {}\\ncache = WriteThroughCache(db=database)\\n\\ncache.set('user:10', {'name': 'Dana', 'role': 'admin'})\\ncache.set('user:11', {'name': 'Eli',  'role': 'user'})\\n\\nprint(cache.get('user:10'))    # guaranteed hit — just written\\nprint('DB state:', database)   # DB has same values\\n",
  "runnable": true
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "Write-Through + Cache-Aside: A Common Combination",
  "content": "A new cache node (after failure or scaling) starts empty. Write-through alone cannot pre-warm it — entries appear only when written. Pairing write-through for writes with cache-aside for reads means reads gradually warm the empty node while writes keep it consistent going forward. This is a standard production pattern."
}
\`\`\`

---

## Side-by-Side Comparison

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Cache-Aside",
      "icon": "🏗️",
      "content": "**Who populates the cache?** Application code, on every miss.\\n\\n**Read path:** Check cache → miss → query DB → write to cache → return.\\n\\n**Write path:** Typically invalidate the key (\`cache.delete(key)\`) then let the next read repopulate.\\n\\n**Consistency:** Eventual. TTL and invalidation prevent stale reads, but a race between two writers can leave stale entries.\\n\\n**Best for:** Systems where you need fine-grained control, mixed data types with different TTLs, or when the cache does not support loader functions (vanilla Redis).\\n\\n**Failure mode:** Cache node restart → cold cache → thundering herd on DB."
    },
    {
      "label": "Read-Through",
      "icon": "📖",
      "content": "**Who populates the cache?** The cache layer itself, via a configured loader function.\\n\\n**Read path:** \`cache.get(key)\` — on miss, cache calls DB, stores result, returns to app.\\n\\n**Write path:** Not defined by this pattern; usually paired with write-through or cache-aside invalidation.\\n\\n**Consistency:** Same as cache-aside for reads — eventual, reliant on TTL.\\n\\n**Best for:** Uniform data access patterns where the same loader logic applies everywhere; reduces boilerplate.\\n\\n**Failure mode:** Cold-start problem identical to cache-aside. Requires cache infrastructure (Hazelcast, Ignite) that supports loaders — vanilla Redis does not."
    },
    {
      "label": "Write-Through",
      "icon": "✍️",
      "content": "**Who writes to DB?** The cache layer, synchronously, on every write.\\n\\n**Read path:** Always a cache hit after a write — no stale read possible.\\n\\n**Write path:** App writes to cache → cache writes to DB → both succeed → return.\\n\\n**Consistency:** Strong. Cache and DB are always in sync after every write.\\n\\n**Best for:** Systems requiring strong read consistency after writes; data that is read frequently after being written (user sessions, counters, inventory).\\n\\n**Failure mode:** Higher write latency (two sequential writes). New nodes start cold — no data until written."
    }
  ]
}
\`\`\`

---

## Failure Modes Under the Microscope

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Stale Read Risk (Cache-Aside)",
    "code": "# Timeline with two processes:\\n# T1: Process A reads user:42 from DB → caches it (role='user')\\n# T2: Process B updates user:42 in DB to role='admin'\\n#     Process B DOES NOT update cache (forgot to invalidate)\\n# T3: Process C calls cache.get('user:42')\\n#     Returns stale role='user' — WRONG!\\n\\n# Fix: Always invalidate or update cache on write\\ndef update_user_role(user_id, new_role):\\n    db.update('UPDATE users SET role=%s WHERE id=%s', new_role, user_id)\\n    cache.delete(f'user:{user_id}')  # <-- MUST NOT forget this"
  },
  "after": {
    "label": "Write-Through Prevents Stale Reads",
    "code": "# With write-through, cache is always updated at write time\\n# T1: Process A reads user:42 → cache miss → loads role='user'\\n# T2: Process B updates user:42 → writes to cache AND DB atomically\\n#     cache now holds role='admin'\\n# T3: Process C calls cache.get('user:42')\\n#     Returns role='admin' — CORRECT!\\n\\ndef update_user_role(user_id, new_role):\\n    # Single call — cache handles DB write internally\\n    cache.set(f'user:{user_id}', {'role': new_role})"
  }
}
\`\`\`

---

## Practice: Fill in the Pattern

\`\`\`fillblank
{
  "title": "Cache-Aside — Complete the Implementation",
  "prompt": "Fill in the missing pieces of a standard cache-aside \`get_product\` function.",
  "language": "python",
  "template": "def get_product(product_id):\\n    key = f'product:{product_id}'\\n    cached = cache.get(___)\\n    if cached is not None:\\n        return cached\\n    product = db.query('SELECT * FROM products WHERE id = %s', ___)\\n    cache.set(key, product, ttl=___)\\n    return product",
  "blanks": [
    { "answer": "key", "hint": "Pass the key you built on the previous line" },
    { "answer": "product_id", "hint": "The variable holding the ID you want to look up" },
    { "answer": "300", "hint": "A common TTL in seconds — 5 minutes prevents stale data while keeping the cache warm" }
  ]
}
\`\`\`

---

## Visualizing the Read Paths

\`\`\`algoviz
{
  "title": "Cache Miss vs Hit — Request Flow",
  "type": "array",
  "data": ["REQ", "CACHE", "DB", "CACHE", "APP"],
  "frames": [
    { "highlight": [0, 1], "label": "Request arrives → check cache", "stats": { "step": 1, "pattern": "cache-aside" } },
    { "highlight": [1, 2], "label": "Cache MISS → query database", "stats": { "step": 2, "hops": 2 } },
    { "highlight": [2, 3], "label": "DB returns data → populate cache", "stats": { "step": 3, "hops": 3 } },
    { "highlight": [3, 4], "label": "Return data to application", "stats": { "step": 4, "hops": 3 } },
    { "highlight": [0, 1], "label": "Second request → check cache", "stats": { "step": 5, "pattern": "cache-aside" } },
    { "highlight": [1, 4], "label": "Cache HIT → return directly, DB never touched", "stats": { "step": 6, "hops": 1 } }
  ],
  "speed": 900
}
\`\`\`

---

## When to Use Each Pattern

\`\`\`callout
{
  "type": "tip",
  "title": "Decision Heuristic for Interviews",
  "content": "Start with **cache-aside** — it works with vanilla Redis and gives you full control. Upgrade to **write-through** when you hear 'strong consistency after writes' or 'we cannot serve stale inventory/balance data'. Mention **read-through** when the interviewer notes that many services share the same cache access logic and you want a single source of truth for the loader."
}
\`\`\`

| Scenario | Recommended Pattern | Why |
|---|---|---|
| User profile (read-heavy, infrequent writes) | Cache-aside | Lazy loading keeps cache lean; TTL handles staleness |
| Shopping cart / inventory count | Write-through | Reads after writes must be accurate |
| Shared microservices cache | Read-through | One loader, consistent behavior across services |
| Analytics event log | Write-behind (next lesson) | High write volume, eventual consistency OK |
| Cold cache after node restart | Cache-aside + Write-through | Write-through keeps written data warm; cache-aside fills the rest lazily |

---

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "In cache-aside, what happens on a cache miss?",
      "options": [
        "The cache queries the database and returns the result",
        "The application queries the database, writes to the cache, then returns data",
        "The application returns an error to the caller",
        "The request is retried after a backoff period"
      ],
      "answer": 1,
      "explanation": "In cache-aside the application is the orchestrator. On a miss it queries the database directly, stores the result in the cache (with a TTL), and returns the data. The cache itself never talks to the database in this pattern."
    },
    {
      "question": "A team notices that every write to their system causes a slow response, but reads are extremely fast. Which caching pattern are they most likely using?",
      "options": [
        "Cache-aside",
        "Read-through",
        "Write-through",
        "Write-behind"
      ],
      "answer": 2,
      "explanation": "Write-through writes synchronously to both cache and database before returning. This makes writes slower (two sequential writes) but guarantees the cache is always fresh, so subsequent reads are fast cache hits. This matches the described behavior."
    },
    {
      "question": "Which statement correctly describes a key disadvantage of the write-through pattern?",
      "options": [
        "The cache may serve stale data after a write",
        "A new or replacement cache node starts empty and serves no hits until entries are written",
        "It requires three database round-trips per read",
        "It cannot be used with TTL-based expiration"
      ],
      "answer": 1,
      "explanation": "When a cache node is replaced (due to failure or scaling), it starts completely empty. Write-through only populates entries when they are written, so a new node has no data until writes come in. The common mitigation is pairing write-through with cache-aside so reads gradually warm the new node."
    },
    {
      "question": "Which caching pattern requires the cache infrastructure to support a 'loader function' or similar plugin to work correctly?",
      "options": [
        "Cache-aside",
        "Write-through",
        "Read-through",
        "TTL-based eviction"
      ],
      "answer": 2,
      "explanation": "Read-through delegates database queries to the cache itself. This requires the cache to be configured with a loader function — a callback it can invoke on a miss. Systems like Hazelcast and Apache Ignite support this natively. Vanilla Redis does not, which is why read-through is less common in Redis-based stacks."
    },
    {
      "question": "What is the 'thundering herd' problem in the context of cache-aside?",
      "options": [
        "Write-through writes overwhelming the database with simultaneous updates",
        "Many concurrent requests all missing the cache simultaneously and hitting the database at once",
        "A TTL set too long causing the cache to grow unbounded",
        "A cache loader function running recursively and exhausting memory"
      ],
      "answer": 1,
      "explanation": "After a cache node restart (or a mass key expiration), many requests arrive simultaneously and all experience a cache miss. Each independently queries the database before any of them can populate the cache. This spike of parallel database queries is the thundering herd. It can be mitigated with mutex locks, probabilistic early expiration, or cache warming strategies."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Cache-aside puts the application in control: check cache → miss → query DB → populate cache. It works with vanilla Redis but duplicates cache logic across every service that reads the data.",
    "Read-through moves the database-fetch logic into the cache layer. The application only calls cache.get() — the cache handles misses transparently. Requires a cache that supports loader functions.",
    "Write-through guarantees strong consistency: every write goes to cache and DB atomically before returning. Reads after writes are always fast cache hits, but every write pays two-write latency.",
    "All three patterns share the cold-start problem: a freshly started or failed cache node has no data. Pairing write-through with cache-aside is a standard mitigation — writes warm the cache, reads fill in the rest lazily.",
    "Use cache-aside as your default. Upgrade to write-through when consistency requirements demand it. Mention read-through when centralising cache population logic reduces duplication across many services."
  ]
}
\`\`\``,
      starterCode: `# Cache Patterns: Cache-Aside, Read-Through, and Write-Through
#
# In this exercise you will implement three fundamental caching strategies.
# A mock database and cache are provided — your job is to wire up the logic.

import time

# ---------------------------------------------------------------------------
# Infrastructure stubs (do NOT modify)
# ---------------------------------------------------------------------------

class MockDatabase:
    """Simulates a slow database with read/write tracking."""
    def __init__(self):
        self._store = {"user:1": "Alice", "user:2": "Bob"}
        self.read_count = 0
        self.write_count = 0

    def read(self, key: str):
        self.read_count += 1
        time.sleep(0.01)  # simulate latency
        return self._store.get(key)

    def write(self, key: str, value):
        self.write_count += 1
        time.sleep(0.01)
        self._store[key] = value


class MockCache:
    """Simple in-memory cache with hit/miss tracking."""
    def __init__(self):
        self._store = {}
        self.hit_count = 0
        self.miss_count = 0

    def get(self, key: str):
        if key in self._store:
            self.hit_count += 1
            return self._store[key]
        self.miss_count += 1
        return None

    def set(self, key: str, value):
        self._store[key] = value

    def delete(self, key: str):
        self._store.pop(key, None)


# ---------------------------------------------------------------------------
# EXERCISE: Implement the three caching patterns below
# ---------------------------------------------------------------------------

class CacheAsideStore:
    """
    Cache-Aside (Lazy Loading)
    --------------------------
    The APPLICATION is responsible for cache population.
    On a cache miss, the application fetches from the DB and
    writes to the cache itself.
    """
    def __init__(self, db: MockDatabase, cache: MockCache):
        self.db = db
        self.cache = cache

    def read(self, key: str):
        # TODO 1: Check the cache first.
        #         On a hit, return the cached value.
        #         On a miss, fetch from the database,
        #         populate the cache, then return the value.
        pass

    def write(self, key: str, value):
        # TODO 2: Write to the database.
        #         Invalidate (delete) the cache entry so that
        #         the next read fetches fresh data.
        #         (Do NOT write the new value into the cache here.)
        pass


class ReadThroughStore:
    """
    Read-Through
    ------------
    The CACHE is responsible for its own population.
    The application only ever talks to the cache; the cache
    fetches from the DB on a miss transparently.
    """
    def __init__(self, db: MockDatabase, cache: MockCache):
        self.db = db
        self.cache = cache

    def read(self, key: str):
        # TODO 3: Ask the cache for the value.
        #         If the cache misses, the cache layer (i.e., this method)
        #         fetches from the DB, stores the result in the cache,
        #         and returns it — the caller never knows a miss happened.
        pass

    def write(self, key: str, value):
        # TODO 4: For read-through, writes still go directly to the DB.
        #         Invalidate the cache entry so reads stay consistent.
        pass


class WriteThroughStore:
    """
    Write-Through
    -------------
    Every write goes to BOTH the cache and the database
    synchronously before returning to the caller.
    Reads are served from the cache (which is always up-to-date).
    """
    def __init__(self, db: MockDatabase, cache: MockCache):
        self.db = db
        self.cache = cache

    def read(self, key: str):
        # TODO 5: Check the cache first.
        #         On a miss, fetch from DB and populate the cache.
        pass

    def write(self, key: str, value):
        # TODO 6: Write to the database AND the cache in the same call.
        #         Both must be updated before returning.
        pass


# ---------------------------------------------------------------------------
# Validation — run this to check your implementations
# ---------------------------------------------------------------------------

def run_tests():
    print("=== Cache-Aside ===")
    db, cache = MockDatabase(), MockCache()
    store = CacheAsideStore(db, cache)

    v = store.read("user:1")          # miss → DB read → cache populated
    assert v == "Alice", f"Expected Alice, got {v}"
    assert db.read_count == 1
    assert cache.miss_count == 1

    v = store.read("user:1")          # hit → no DB read
    assert v == "Alice"
    assert db.read_count == 1         # still 1 — came from cache
    assert cache.hit_count == 1

    store.write("user:1", "Alicia")   # DB updated, cache invalidated
    assert db.write_count == 1
    v = store.read("user:1")          # miss again (cache was cleared)
    assert v == "Alicia"
    assert db.read_count == 2
    print("PASSED")

    print("=== Read-Through ===")
    db, cache = MockDatabase(), MockCache()
    store = ReadThroughStore(db, cache)

    v = store.read("user:2")          # miss → cache fetches from DB
    assert v == "Bob"
    assert db.read_count == 1

    v = store.read("user:2")          # hit
    assert db.read_count == 1
    assert cache.hit_count == 1

    store.write("user:2", "Bobby")    # DB updated, cache invalidated
    v = store.read("user:2")
    assert v == "Bobby"
    print("PASSED")

    print("=== Write-Through ===")
    db, cache = MockDatabase(), MockCache()
    store = WriteThroughStore(db, cache)

    store.write("user:1", "Alicia")   # writes to BOTH db and cache
    assert db.write_count == 1

    v = store.read("user:1")          # should hit cache (no DB read)
    assert v == "Alicia"
    assert db.read_count == 0         # DB never read — cache was warm
    assert cache.hit_count == 1
    print("PASSED")

    print("\\nAll tests passed!")


if __name__ == "__main__":
    run_tests()
`,
      solutionCode: `# Cache Patterns: Cache-Aside, Read-Through, and Write-Through
# SOLUTION

import time

# ---------------------------------------------------------------------------
# Infrastructure stubs (unchanged)
# ---------------------------------------------------------------------------

class MockDatabase:
    """Simulates a slow database with read/write tracking."""
    def __init__(self):
        self._store = {"user:1": "Alice", "user:2": "Bob"}
        self.read_count = 0
        self.write_count = 0

    def read(self, key: str):
        self.read_count += 1
        time.sleep(0.01)
        return self._store.get(key)

    def write(self, key: str, value):
        self.write_count += 1
        time.sleep(0.01)
        self._store[key] = value


class MockCache:
    """Simple in-memory cache with hit/miss tracking."""
    def __init__(self):
        self._store = {}
        self.hit_count = 0
        self.miss_count = 0

    def get(self, key: str):
        if key in self._store:
            self.hit_count += 1
            return self._store[key]
        self.miss_count += 1
        return None

    def set(self, key: str, value):
        self._store[key] = value

    def delete(self, key: str):
        self._store.pop(key, None)


# ---------------------------------------------------------------------------
# Pattern implementations
# ---------------------------------------------------------------------------

class CacheAsideStore:
    """
    Cache-Aside (Lazy Loading)
    --------------------------
    Ownership: APPLICATION populates the cache.
    Consistency: Writes invalidate the cache entry; the next read
                 fetches fresh data from the DB (lazy re-population).
    Failure modes:
      - Cache stampede: many concurrent requests all miss simultaneously
        and hammer the DB before the cache is warm.
      - Stale data window: between invalidation and next read, no
        data is in the cache (a gap, not stale — but a read penalty).
    """
    def __init__(self, db: MockDatabase, cache: MockCache):
        self.db = db
        self.cache = cache

    def read(self, key: str):
        # Step 1: check the cache.
        value = self.cache.get(key)
        if value is not None:
            return value  # cache hit — fast path

        # Step 2: cache miss — application fetches from the database.
        value = self.db.read(key)

        # Step 3: application populates the cache for future reads.
        if value is not None:
            self.cache.set(key, value)

        return value

    def write(self, key: str, value):
        # Write to the database first (source of truth).
        self.db.write(key, value)

        # Invalidate the cache so stale data is never served.
        # The next read will trigger a fresh DB fetch (lazy population).
        self.cache.delete(key)


class ReadThroughStore:
    """
    Read-Through
    ------------
    Ownership: CACHE populates itself on a miss.
    Consistency: Same lazy invalidation on writes as cache-aside,
                 but the caller never sees the miss — it is hidden
                 inside the cache abstraction.
    Failure modes:
      - Cold start penalty: first request for any key always hits the DB.
      - If the DB returns None (missing key), the cache may or may not
        store the null — unhandled nulls cause repeated DB hits (negative
        caching problem).
    """
    def __init__(self, db: MockDatabase, cache: MockCache):
        self.db = db
        self.cache = cache

    def read(self, key: str):
        # The application simply asks the cache.
        value = self.cache.get(key)
        if value is not None:
            return value  # cache hit

        # Cache miss: the cache layer (not the caller) is responsible
        # for fetching from the DB and re-populating itself.
        value = self.db.read(key)
        if value is not None:
            self.cache.set(key, value)  # cache fills itself

        return value  # caller gets the result transparently

    def write(self, key: str, value):
        # Writes still go to the DB; cache is invalidated to prevent
        # stale reads until the next read-through re-populates it.
        self.db.write(key, value)
        self.cache.delete(key)


class WriteThroughStore:
    """
    Write-Through
    -------------
    Ownership: APPLICATION writes to BOTH cache and DB synchronously.
    Consistency: Cache is always up-to-date after a write — no stale
                 window between write and cache invalidation.
    Failure modes:
      - Write latency: every write pays two round-trips (cache + DB)
        before returning to the caller.
      - Cache churn: data written once and never read still occupies
        cache space (pairs well with a TTL eviction policy).
      - Partial failure: if the DB write succeeds but the cache write
        fails (or vice versa), the systems diverge — need retry logic.
    """
    def __init__(self, db: MockDatabase, cache: MockCache):
        self.db = db
        self.cache = cache

    def read(self, key: str):
        # Because writes always warm the cache, reads are usually hits.
        value = self.cache.get(key)
        if value is not None:
            return value

        # Cold-start fallback: populate the cache from the DB.
        value = self.db.read(key)
        if value is not None:
            self.cache.set(key, value)
        return value

    def write(self, key: str, value):
        # Write to the database (source of truth) first.
        self.db.write(key, value)

        # Immediately update the cache so subsequent reads are served
        # from cache without an extra DB round-trip.
        self.cache.set(key, value)


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

def run_tests():
    print("=== Cache-Aside ===")
    db, cache = MockDatabase(), MockCache()
    store = CacheAsideStore(db, cache)

    v = store.read("user:1")
    assert v == "Alice", f"Expected Alice, got {v}"
    assert db.read_count == 1
    assert cache.miss_count == 1

    v = store.read("user:1")
    assert v == "Alice"
    assert db.read_count == 1
    assert cache.hit_count == 1

    store.write("user:1", "Alicia")
    assert db.write_count == 1
    v = store.read("user:1")
    assert v == "Alicia"
    assert db.read_count == 2
    print("PASSED")

    print("=== Read-Through ===")
    db, cache = MockDatabase(), MockCache()
    store = ReadThroughStore(db, cache)

    v = store.read("user:2")
    assert v == "Bob"
    assert db.read_count == 1

    v = store.read("user:2")
    assert db.read_count == 1
    assert cache.hit_count == 1

    store.write("user:2", "Bobby")
    v = store.read("user:2")
    assert v == "Bobby"
    print("PASSED")

    print("=== Write-Through ===")
    db, cache = MockDatabase(), MockCache()
    store = WriteThroughStore(db, cache)

    store.write("user:1", "Alicia")
    assert db.write_count == 1

    v = store.read("user:1")
    assert v == "Alicia"
    assert db.read_count == 0   # cache was warm from the write
    assert cache.hit_count == 1
    print("PASSED")

    print("\\nAll tests passed!")


if __name__ == "__main__":
    run_tests()
`,
    },
    {
      id: "write-behind-and-refresh-ahead",
      slug: "write-behind-and-refresh-ahead",
      title: "Write-Behind and Refresh-Ahead Patterns",
      content: `# Write-Behind and Refresh-Ahead Patterns

Every caching strategy makes a bet. Write-through bets on consistency — it pays a latency penalty on every write to keep the cache and database perfectly aligned. **Write-behind** takes the opposite bet: it accepts a window of inconsistency in exchange for dramatically faster writes. **Refresh-ahead** makes a third bet on predictability — that a hot cache entry will be needed again before it expires, so the cache can refresh it proactively rather than waiting for a miss.

Understanding when each bet pays off — and when it catastrophically fails — is what separates a senior architect from someone who just knows the pattern names.

---

## Write-Behind: Decouple the Write Path

In write-behind (also called **write-back**), the application writes only to the cache. The cache responds immediately — in microseconds — then asynchronously propagates the change to the backing store, usually batching multiple writes together.

\`\`\`concept
{ "title": "Write-Behind Mental Model", "variant": "analogy", "content": "Think of write-behind like a restaurant server taking orders on a notepad. When a customer orders, the server says 'got it' immediately. Later — between tables — they batch-submit the orders to the kitchen. Customers are never waiting for the kitchen to confirm; the kitchen is temporarily behind. The risk: if the server loses their notepad, those orders are gone." }
\`\`\`

### Architecture: The Three-Stage Flow

\`\`\`sysdiag
{ "title": "Write-Behind Architecture", "width": 660, "height": 260, "nodes": [ { "id": "app", "label": "Application", "x": 75, "y": 130, "kind": "service" }, { "id": "cache", "label": "Cache\\n(Redis)", "x": 240, "y": 130, "kind": "service" }, { "id": "wq", "label": "Write\\nQueue", "x": 415, "y": 130, "kind": "service" }, { "id": "db", "label": "Database", "x": 585, "y": 130, "kind": "service" } ], "edges": [ { "from": "app", "to": "cache", "label": "① write (sync, <1ms)" }, { "from": "cache", "to": "wq", "label": "② enqueue" }, { "from": "wq", "to": "db", "label": "③ flush (async, batched)" } ], "annotations": { "cache": "Responds to the application immediately. From the app's perspective, the write is done.", "wq": "Buffers pending writes. A smart flusher coalesces duplicate keys — 100 updates to the same key become one DB write.", "db": "Receives batched writes asynchronously. May lag the cache by milliseconds to seconds — this gap is the risk window." } }
\`\`\`

### Step-by-Step Execution Trace

Watch two writes to the same key accumulate in the queue, then get coalesced into a single DB write on flush:

\`\`\`trace
{ "title": "Write-Behind Cache — Two Writes, One DB Flush", "language": "python", "code": "cache = {}\\nqueue = []\\ndb = {}\\n\\ndef wb_set(key, val):\\n    cache[key] = val\\n    queue.append((key, val))\\n    return 'OK'\\n\\ndef flush():\\n    for k, v in queue:\\n        db[k] = v\\n    queue.clear()\\n\\nwb_set('score', 100)\\nwb_set('score', 150)\\nflush()\\nprint(db)", "frames": [ { "line": 15, "vars": { "cache": "{}", "queue": "[]", "db": "{}" }, "note": "First call: wb_set('score', 100). DB is not involved yet." }, { "line": 6, "vars": { "cache": "{'score': 100}", "queue": "[]", "db": "{}" }, "note": "Cache updated instantly — DB untouched. Write appears complete to the caller." }, { "line": 7, "vars": { "cache": "{'score': 100}", "queue": "[('score', 100)]", "db": "{}" }, "note": "Write enqueued for async flush. Queue now has 1 pending write." }, { "line": 8, "vars": { "cache": "{'score': 100}", "queue": "[('score', 100)]", "db": "{}" }, "note": "Returns 'OK' immediately — caller unblocked in <1ms. No DB round-trip." }, { "line": 16, "vars": { "cache": "{'score': 100}", "queue": "[('score', 100)]", "db": "{}" }, "note": "Second call: wb_set('score', 150). Score updated again before any flush." }, { "line": 6, "vars": { "cache": "{'score': 150}", "queue": "[('score', 100)]", "db": "{}" }, "note": "Cache now shows 150. DB still shows nothing. Window of inconsistency opens." }, { "line": 7, "vars": { "cache": "{'score': 150}", "queue": "[('score', 100), ('score', 150)]", "db": "{}" }, "note": "Both writes queued. A smart flusher will coalesce — only the last value matters." }, { "line": 17, "vars": { "cache": "{'score': 150}", "queue": "[('score', 100), ('score', 150)]", "db": "{}" }, "note": "flush() triggered — runs on a background schedule or eviction pressure." }, { "line": 12, "vars": { "cache": "{'score': 150}", "queue": "flushing...", "db": "{'score': 150}" }, "note": "DB updated with final value — effectively 2 application writes became 1 DB write." }, { "line": 13, "vars": { "cache": "{'score': 150}", "queue": "[]", "db": "{'score': 150}" }, "note": "Queue drained. Cache and DB now agree. Inconsistency window closed." }, { "line": 18, "vars": { "cache": "{'score': 150}", "queue": "[]", "db": "{'score': 150}" }, "note": "Confirmed: DB holds the final state.", "stdout": "{'score': 150}" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The Write-Behind Failure Mode: Data Loss on Cache Crash", "content": "If the cache node dies **before** the queue is flushed, every pending write is permanently lost — the DB never received them. This is the non-negotiable tradeoff:\\n\\n- **Acceptable:** gaming scores, view counters, analytics events, session data\\n- **Unacceptable:** financial balances, inventory counts, medical records, order confirmations\\n\\nMitigations: Redis AOF/RDB persistence (shrinks the loss window but doesn't eliminate it), writing the queue to a durable message broker like Kafka before acknowledging the write." }
\`\`\`

---

## Refresh-Ahead: Beat the TTL Cliff

Refresh-ahead solves a completely different problem. With standard TTL caching, every popular entry has a **cliff**: the moment it expires, the next request triggers a synchronous DB load — adding latency precisely when traffic is highest (popular entries get many requests). If many entries expire simultaneously, you get a **cache stampede**.

Refresh-ahead sidesteps this by watching the clock. When a cache entry crosses a configurable threshold — say, 75% through its TTL — the cache proactively fires a background reload. By the time the entry would have expired, the fresh value is already in place.

\`\`\`concept
{ "title": "Refresh-Ahead Mental Model", "variant": "analogy", "content": "Refresh-ahead is like a gas station attendant who starts filling your tank before you hit empty — they notice your gauge approaching the low line and act before you're stranded. The 'refresh factor' is where they draw that line. A factor of 0.8 means they start at 20% remaining, not 0%." }
\`\`\`

### The Refresh Window Math

\`\`\`
Timeline (TTL = 60s, refresh_factor = 0.75):

 t=0          t=45                    t=60
  │────────────│────────────────────────│
  │            │                        │
  │ Serve from │ Background DB load     │ Entry would expire
  │ cache      │ triggered here ───►    │ (but it won't — new
  │ normally   │ (remaining TTL = 15s)  │  value already loaded)
  │            │                        │
  │←── factor × TTL = 45s ────────────►│
               │←── (1-factor)×TTL=15s ─│

  Refresh window = TTL × (1 - refresh_factor) = 60 × 0.25 = 15s
\`\`\`

A higher refresh factor (e.g. 0.9) means a narrower window and more aggressive preloading. A lower factor (e.g. 0.5) means you refresh halfway through — wasting DB reads on entries that may never be requested again.

---

## When to Use Each Pattern

\`\`\`tabs
{ "tabs": [ { "label": "Write-Behind", "icon": "⚡", "content": "**Best for:**\\n\\n- **High-frequency counters** — page views, like counts, analytics events. Flushing every increment to the DB is expensive; batching per second is fine and data loss is cosmetic.\\n- **Session state** — user sessions change constantly; async persistence is acceptable because sessions can be rebuilt on loss.\\n- **Gaming leaderboards** — scores update every second. A 1–5 second lag to the DB is imperceptible to players.\\n- **IoT sensor telemetry** — thousands of sensors writing per second. Batching reduces DB load by 100x.\\n- **Shopping cart updates** — items added/removed frequently within a session; durable commit only needed at checkout.\\n\\n**Avoid when:**\\n- Data loss on cache failure is unacceptable (financial transactions, inventory)\\n- You need read-your-own-writes consistency across cache replicas\\n- Your cache is pure in-memory with no persistence configured" }, { "label": "Refresh-Ahead", "icon": "🔄", "content": "**Best for:**\\n\\n- **Product catalog pages** — pricing, descriptions, images. Changed infrequently, read millions of times. Refresh-ahead keeps the entry warm without a stampede on expiry.\\n- **Feature flag and configuration objects** — read on every request, changed rarely. Proactive refresh avoids a latency spike when ops pushes a config update.\\n- **OAuth access tokens** — pre-refreshing tokens near expiry prevents a synchronized wave of 401s across all servers.\\n- **Pre-computed ML recommendations** — recomputing takes 200ms+. Serve instantly from cache; refresh in background before expiry.\\n- **CDN edge caches** — refresh popular assets before TTL forces a synchronous origin fetch.\\n\\n**Avoid when:**\\n- Access patterns are unpredictable — refreshing an entry nobody will re-read wastes DB budget\\n- Data changes faster than your TTL (refreshed entry may already be stale)\\n- Your DB can't handle the additional background read load" }, { "label": "Decision Guide", "icon": "🧭", "content": "Ask these questions in order:\\n\\n**Write path decision:**\\n1. Can you tolerate data loss if the cache fails?\\n   - No → write-through (or event sourcing for high throughput)\\n   - Yes + writes are a bottleneck → **write-behind**\\n   - Yes + writes are infrequent → write-through is fine\\n\\n**Read path decision:**\\n2. Are cache misses causing latency spikes on popular keys?\\n   - Yes + keys are predictably re-accessed → **refresh-ahead**\\n   - Yes + access is unpredictable → pre-warming on deploy\\n   - No → standard TTL expiry is sufficient\\n\\n**Combined:**\\n- High-write analytics dashboard → write-behind + refresh-ahead together\\n- Financial ledger → write-through + explicit invalidation (no write-behind)\\n- Social feed → cache-aside (lazy) + refresh-ahead for top items" } ] }
\`\`\`

---

## Live Simulation

Run this simulation to see both patterns execute side-by-side. Notice how write-behind's DB stays stale until flush, and how refresh-ahead proactively loads before the TTL cliff:

\`\`\`playground
{ "title": "Write-Behind & Refresh-Ahead Side-by-Side", "language": "python", "code": "# ===== WRITE-BEHIND CACHE =====\\nclass WriteBehindCache:\\n    def __init__(self):\\n        self.cache = {}\\n        self.queue = []\\n        self.db = {\\"score\\": 0}  # simulated DB\\n\\n    def set(self, key, value):\\n        self.cache[key] = value\\n        self.queue.append((key, value))\\n        print(f\\"[WB] set '{key}'={value}  |  DB still has: {self.db.get(key)}\\")\\n\\n    def flush(self):\\n        # Coalesce: keep only the last write per key\\n        coalesced = {}\\n        for k, v in self.queue:\\n            coalesced[k] = v\\n        for k, v in coalesced.items():\\n            self.db[k] = v\\n        n_writes = len(self.queue)\\n        self.queue.clear()\\n        print(f\\"[WB] Flushed {n_writes} writes ({len(coalesced)} unique) -> DB: {self.db}\\")\\n\\n\\n# ===== REFRESH-AHEAD CACHE =====\\nclass RefreshAheadCache:\\n    def __init__(self, ttl=10, refresh_factor=0.75):\\n        self.cache = {}  # key -> (value, expire_at)\\n        self.db = {\\"price\\": 29.99}\\n        self.ttl = ttl\\n        self.refresh_window = ttl * (1 - refresh_factor)  # 2.5s\\n\\n    def _db_load(self, key, now):\\n        val = self.db.get(key)\\n        self.cache[key] = (val, now + self.ttl)\\n        return val\\n\\n    def get(self, key, now):\\n        if key not in self.cache:\\n            val = self._db_load(key, now)\\n            print(f\\"[RA] t={now:2d}s  MISS     '{key}' -> DB load: {val}\\")\\n            return val\\n\\n        val, expire_at = self.cache[key]\\n        remaining = expire_at - now\\n\\n        if remaining <= self.refresh_window:\\n            print(f\\"[RA] t={now:2d}s  REFRESH  '{key}' ({remaining:.1f}s left <= {self.refresh_window}s window)\\")\\n            self._db_load(key, now)  # background refresh in real systems\\n        else:\\n            print(f\\"[RA] t={now:2d}s  HIT      '{key}'={val}  ({remaining:.1f}s until expiry)\\")\\n        return val\\n\\n\\nprint(\\"========== WRITE-BEHIND DEMO ==========\\")\\nwb = WriteBehindCache()\\nwb.set(\\"score\\", 100)\\nwb.set(\\"score\\", 120)\\nwb.set(\\"score\\", 150)   # 3 fast writes before any flush\\nprint(f\\"[WB] DB before flush: {wb.db}\\")\\nwb.flush()             # one batch flush -> coalesced to 1 DB write\\n\\nprint(\\"\\\\n========= REFRESH-AHEAD DEMO =========\\")\\nra = RefreshAheadCache(ttl=10, refresh_factor=0.75)  # refresh when <2.5s remain\\nra.get(\\"price\\", now=0)   # cold miss -> DB load\\nra.get(\\"price\\", now=3)   # hit, 7s left\\nra.get(\\"price\\", now=7)   # hit, 3s left\\nra.get(\\"price\\", now=8)   # triggers refresh (2s left < 2.5s window)\\nra.get(\\"price\\", now=9)   # hit on freshly loaded entry (new TTL = 19s)\\n", "runnable": true }
\`\`\`

---

## Practice: Complete the Refresh-Ahead Threshold

Fill in the two blanks to implement the proactive refresh decision. With \`refresh_factor=0.8\` and \`ttl=60\`, the refresh should trigger when fewer than 12 seconds remain (the last 20% of the TTL):

\`\`\`fillblank
{ "title": "Implement Refresh-Ahead Threshold Detection", "prompt": "Complete get() so it triggers a background refresh when the remaining TTL falls within the refresh window. The window is the fraction of TTL *not* covered by refresh_factor.", "language": "python", "template": "class RefreshAheadCache:\\n    def __init__(self, ttl=60, refresh_factor=0.8):\\n        self.cache = {}   # key -> (value, expire_at)\\n        self.ttl = ttl\\n        self.refresh_factor = refresh_factor\\n\\n    def get(self, key, now):\\n        if key not in self.cache:\\n            return self._load(key, now)\\n\\n        value, expire_at = self.cache[key]\\n        remaining = expire_at - now\\n\\n        # Refresh window: the tail fraction of TTL before expiry\\n        refresh_window = self.ttl * ___\\n        if remaining <= ___:\\n            self._async_refresh(key, now)\\n\\n        return value", "blanks": [ { "answer": "(1 - self.refresh_factor)", "hint": "The window is the complement of the factor. Factor=0.8 means 80% serves normally, so the window is the other 20% of TTL." }, { "answer": "refresh_window", "hint": "Compare the remaining seconds against the window threshold you just computed." } ] }
\`\`\`

---

\`\`\`quiz
{ "title": "Write-Behind & Refresh-Ahead Patterns", "questions": [ { "question": "In write-behind caching, when does the database receive the updated value?", "options": [ "Synchronously, before the cache write completes", "Synchronously, in parallel with the cache write", "Asynchronously, after the cache has already acknowledged success", "Only when the cache entry is evicted due to memory pressure" ], "answer": 2, "explanation": "Write-behind (write-back) updates the cache immediately and returns success to the caller. The database is updated asynchronously — by a background flusher, on a schedule, or on eviction — completely off the write critical path. This is the source of both its performance benefit and its data loss risk." }, { "question": "A gaming platform stores player scores with write-behind caching. The cache cluster crashes unexpectedly before the next scheduled flush. What most likely happens?", "options": [ "Recent score updates since the last flush are permanently lost — the DB reverts to stale values", "The write queue is automatically replayed from a Raft log maintained by Redis", "The DB performs a compensating read from the cache replica to recover the values", "Reads return stale data temporarily, but all writes are safely durable in the queue" ], "answer": 0, "explanation": "Write-behind's primary failure mode is data loss on cache failure. Any writes buffered in the queue that were never flushed are gone — the DB has no record of them. For gaming scores this may be acceptable (players lose recent progress). For financial balances it would be catastrophic. Redis persistence (AOF/RDB) reduces the loss window but cannot eliminate it entirely." }, { "question": "You configure a cache with TTL=100s and refresh_factor=0.9. At what remaining TTL does a proactive background refresh trigger?", "options": [ "90 seconds remaining (10% elapsed)", "50 seconds remaining (halfway point)", "10 seconds remaining (90% elapsed)", "0 seconds remaining (at expiry)" ], "answer": 2, "explanation": "Refresh window = TTL × (1 - factor) = 100 × (1 - 0.9) = 10 seconds. The entry serves normally for 90 seconds. When fewer than 10 seconds remain, the background refresh fires. A higher factor creates a narrower refresh window — more aggressive preloading with less tolerance for delay." }, { "question": "You are designing a high-throughput analytics ingestion service (writes are a bottleneck) with a real-time dashboard (popular metrics must always be fast, with no miss latency). Which combination of caching strategies best fits both constraints?", "options": [ "Write-through for ingestion + cache-aside for dashboard reads", "Cache-aside for ingestion + standard TTL for dashboard reads", "Write-behind for ingestion + refresh-ahead for dashboard reads", "Write-through for ingestion + write-behind for dashboard reads" ], "answer": 2, "explanation": "Write-behind handles the high-throughput ingestion path: writes hit only the cache, DB receives batched flushes, write latency drops dramatically. Refresh-ahead handles the dashboard read path: popular metric keys are refreshed proactively before expiry, preventing the cold-miss stampede that would occur if hundreds of dashboard clients hit a simultaneously-expired cache entry." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Write-behind writes only to the cache and flushes to the database asynchronously — dramatically reducing write latency at the cost of a data loss window if the cache fails before flushing.", "Write coalescing is a critical optimization in write-behind: 100 updates to the same key between flushes can produce a single DB write, reducing I/O by orders of magnitude.", "Refresh-ahead proactively reloads cache entries before they expire, eliminating cold-miss latency spikes on popular keys without waiting for a request to trigger the reload.", "The refresh_factor (e.g. 0.75) controls the refresh window: factor × TTL is the normal serving period; the remaining (1 − factor) × TTL is the proactive refresh window.", "Write-behind fits high-frequency, loss-tolerant writes: analytics counters, gaming scores, IoT telemetry, session state. Refresh-ahead fits high-read, infrequently-changed data: product catalog, feature flags, auth tokens, precomputed recommendations.", "Neither pattern replaces explicit cache invalidation for critical updates — combine them with targeted invalidation calls when correctness matters more than throughput." ] }
\`\`\``,
    },
    {
      id: "cache-eviction-policies",
      slug: "cache-eviction-policies",
      title: "Cache Eviction Policies: LRU, LFU, and Beyond",
      content: `# Cache Eviction Policies: LRU, LFU, and Beyond

Every cache has a hard capacity ceiling. When that ceiling is hit and a new item needs space, something has to go. The algorithm that decides *what* to remove is your **eviction policy** — and picking the wrong one can cut your cache hit rate in half, sending traffic floods straight to your database.

In this lesson you will implement LRU and LFU from scratch, trace their execution step by step, and build an intuition for which policy wins under which workloads.

\`\`\`concept
{
  "title": "The Nightclub Bouncer",
  "variant": "analogy",
  "content": "Picture your cache as an exclusive club with a 3-person capacity. When a fourth person arrives and the floor is full, the bouncer must throw someone out.\\n\\n• FIFO bouncer: 'You've been here the longest — out you go.'\\n• LRU bouncer: 'Nobody's talked to you recently — goodbye.'\\n• LFU bouncer: 'You've been mentioned the fewest times all night — you're cut.'\\n• ARC bouncer: 'I watch both recency AND frequency and I self-tune my judgment.'\\n\\nThe wrong bouncer strategy fills your club with the wrong crowd — and every 'right person' that can't get in is a cache miss."
}
\`\`\`

---

## Why Eviction Policy Drives Hit Rate

A cache only helps when the item you need is already there. **Hit rate** — the fraction of reads served from cache — is the single most important cache metric, and eviction policy is its primary driver.

Consider a music platform caching 10,000 of its 1,000,000 tracks. If the 10k cached tracks are the wrong ones, every request misses. The right policy keeps the tracks users actually play; the wrong one evicts them to make room for tracks nobody will ever touch again.

The core tension: **access patterns vary**. Some workloads replay recently accessed items (recency matters). Others hammer a small stable hot set indefinitely (frequency matters). No single policy is universally optimal.

---

## Policy 1 — FIFO (First In, First Out)

FIFO is the simplest possible strategy: evict whichever item entered the cache earliest, regardless of how recently or frequently it was used. It is implemented with a plain queue.

| Step | Operation | Cache State | Evicted |
|------|-----------|-------------|---------|
| 1 | put(A) | [A] | — |
| 2 | put(B) | [A, B] | — |
| 3 | put(C) | [A, B, C] | — |
| 4 | get(B) | [A, B, C] | — *(order unchanged)* |
| 5 | put(D) | [B, C, D] | **A** *(oldest entry)* |
| 6 | put(E) | [C, D, E] | **B** *(oldest entry)* |

Notice step 4: accessing B does **not** protect it from eviction. B is evicted in step 6 even though it was used one step earlier. FIFO is completely blind to usage patterns.

**Best for:** CDN edge nodes with short TTLs where staleness is the only signal that matters, static asset caches where all items have equal utility.

---

## Policy 2 — LRU (Least Recently Used)

LRU tracks *when* each item was last accessed. On eviction, it removes the item that was accessed the longest time ago. The core intuition: if you haven't touched an item in a while, you probably won't need it soon.

### The Classic Data Structure

Efficient LRU needs O(1) for both lookup and recency update:
- **Hash map** → O(1) key lookup
- **Doubly-linked list** → O(1) move-to-front (MRU) and evict-tail (LRU)

Python's \`OrderedDict\` gives you both in one structure.

\`\`\`trace
{
  "title": "LRU Cache Execution Trace (capacity = 3)",
  "language": "python",
  "code": "from collections import OrderedDict\\ncache = OrderedDict()\\ncap = 3\\n\\ncache['A'] = 1\\ncache['B'] = 2\\ncache['C'] = 3\\ncache.move_to_end('A')\\nresult = cache['A']\\ncache['D'] = 4\\nevicted = cache.popitem(last=False)",
  "frames": [
    { "line": 2, "vars": { "cache": "{}", "cap": 3 }, "note": "Start: empty cache, capacity = 3" },
    { "line": 5, "vars": { "cache": "{'A': 1}" }, "note": "put(A): space available, A inserted at MRU end" },
    { "line": 6, "vars": { "cache": "{'A':1, 'B':2}" }, "note": "put(B): space available, B inserted at MRU end" },
    { "line": 7, "vars": { "cache": "{'A':1, 'B':2, 'C':3}" }, "note": "put(C): cache now FULL — order LRU→MRU is A, B, C" },
    { "line": 8, "vars": { "cache": "{'B':2, 'C':3, 'A':1}" }, "note": "get(A): A promoted to MRU end — B is now the LRU item" },
    { "line": 10, "vars": { "cache": "{'B':2, 'C':3, 'A':1, 'D':4}" }, "note": "put(D): cache exceeds capacity, must evict" },
    { "line": 11, "vars": { "cache": "{'C':3, 'A':1, 'D':4}", "evicted": "('B', 2)" }, "note": "B evicted — it was the least recently used. D takes its slot." }
  ],
  "speed": 950
}
\`\`\`

\`\`\`playground
{
  "title": "LRU Cache — Complete Implementation",
  "language": "python",
  "code": "from collections import OrderedDict\\n\\nclass LRUCache:\\n    def __init__(self, capacity: int):\\n        self.cap = capacity\\n        self.cache = OrderedDict()  # LRU-end ... MRU-end\\n\\n    def get(self, key):\\n        if key not in self.cache:\\n            return -1\\n        self.cache.move_to_end(key)   # promote to MRU\\n        return self.cache[key]\\n\\n    def put(self, key, value):\\n        if key in self.cache:\\n            self.cache.move_to_end(key)\\n        self.cache[key] = value\\n        if len(self.cache) > self.cap:\\n            evicted_key, _ = self.cache.popitem(last=False)\\n            print(f'  [EVICT] {evicted_key}')\\n\\n    def show(self):\\n        order = list(self.cache.keys())\\n        print(f'  Cache [LRU→MRU]: {order}')\\n\\n# ── Walkthrough ───────────────────────────────────\\nlru = LRUCache(3)\\noperations = [\\n    ('put', 'A', 1), ('put', 'B', 2), ('put', 'C', 3),\\n    ('get', 'A', None), ('put', 'D', 4), ('get', 'B', None)\\n]\\nfor op in operations:\\n    if op[0] == 'put':\\n        print(f'put({op[1]}, {op[2]})')\\n        lru.put(op[1], op[2])\\n    else:\\n        result = lru.get(op[1])\\n        print(f'get({op[1]}) -> {result}')\\n    lru.show()\\n    print()",
  "runnable": true
}
\`\`\`

**Complexity:**

| Operation | Time | Space |
|-----------|------|-------|
| \`get\` | O(1) | — |
| \`put\` | O(1) | O(capacity) |

\`\`\`callout
{
  "type": "warning",
  "title": "LRU's Achilles Heel: Sequential Scan Pollution",
  "content": "If a batch job reads 50,000 unique keys sequentially, each one enters as 'most recently used' and flushes your entire working set. The 200 hot records your users actually query get evicted to make room for items that will never be read again.\\n\\nThis pattern — cold items temporarily becoming the most recent — is called **cache pollution**. It's the primary reason LFU and ARC exist."
}
\`\`\`

---

## Policy 3 — LFU (Least Frequently Used)

LFU tracks *how many times* each item has been accessed. On eviction, it removes the item with the lowest access count. On ties, it falls back to LRU order within that frequency bucket.

\`\`\`concept
{
  "title": "LFU Mental Model",
  "variant": "mental-model",
  "content": "Every cache item holds a counter. Each access increments it. When eviction is needed:\\n\\n1. Find the globally minimum frequency across all cached items.\\n2. Among all items at that minimum, evict the least recently used one (LRU tiebreak).\\n3. Reset min_freq = 1 for the newly inserted item.\\n\\nKey insight: a newly inserted item always starts at frequency 1, making it an immediate eviction candidate if the cache is under pressure from a hot working set."
}
\`\`\`

### LFU Data Structure (O(1) Implementation)

Naive LFU scans all frequencies on every eviction — O(n). The O(1) version uses three structures:

| Structure | Maps | Purpose |
|-----------|------|---------|
| \`key_val\` | key → value | O(1) value lookup |
| \`key_freq\` | key → frequency | O(1) frequency update |
| \`freq_keys\` | frequency → OrderedDict of keys | O(1) LRU eviction within a freq bucket |

A \`min_freq\` pointer lets you find the eviction target in O(1) without scanning.

\`\`\`playground
{
  "title": "LFU Cache — O(1) Implementation",
  "language": "python",
  "code": "from collections import defaultdict, OrderedDict\\n\\nclass LFUCache:\\n    def __init__(self, capacity):\\n        self.cap = capacity\\n        self.key_val   = {}\\n        self.key_freq  = {}\\n        self.freq_keys = defaultdict(OrderedDict)  # freq -> {key: None}\\n        self.min_freq  = 0\\n\\n    def _bump(self, key):\\n        \\"\\"\\"Increment key's frequency and update bookkeeping.\\"\\"\\"\\n        f = self.key_freq[key]\\n        self.key_freq[key] = f + 1\\n        del self.freq_keys[f][key]\\n        if not self.freq_keys[f] and f == self.min_freq:\\n            self.min_freq += 1        # old min bucket is empty\\n        self.freq_keys[f + 1][key] = None\\n\\n    def get(self, key):\\n        if key not in self.key_val:\\n            return -1\\n        self._bump(key)\\n        return self.key_val[key]\\n\\n    def put(self, key, value):\\n        if self.cap == 0:\\n            return\\n        if key in self.key_val:\\n            self.key_val[key] = value\\n            self._bump(key)\\n            return\\n        if len(self.key_val) >= self.cap:\\n            evict, _ = self.freq_keys[self.min_freq].popitem(last=False)\\n            del self.key_val[evict]\\n            del self.key_freq[evict]\\n            print(f'  [EVICT] {evict} (freq={self.min_freq})')\\n        self.key_val[key]  = value\\n        self.key_freq[key] = 1\\n        self.freq_keys[1][key] = None\\n        self.min_freq = 1\\n\\n    def show(self):\\n        for k in self.key_val:\\n            print(f'  {k}: val={self.key_val[k]}, freq={self.key_freq[k]}')\\n        print()\\n\\n# ── Demo: frequency bias saves hot items ─────────\\nlfu = LFUCache(3)\\nprint('=== Load cache ===')\\nlfu.put('A', 1); lfu.put('B', 2); lfu.put('C', 3)\\n\\nprint('=== Boost A and B frequencies ===')\\nfor _ in range(4): lfu.get('A')  # A: freq 5\\nfor _ in range(2): lfu.get('B')  # B: freq 3\\nlfu.show()\\n\\nprint('=== Insert D — C (freq=1) is evicted, not A or B ===')\\nlfu.put('D', 4)\\nlfu.show()",
  "runnable": true
}
\`\`\`

---

## Policy 4 — ARC (Adaptive Replacement Cache)

ARC self-tunes between recency and frequency by maintaining four internal lists:

- **T1** — recently accessed items (seen only once)
- **T2** — frequently accessed items (seen more than once)
- **B1** — ghost entries (keys only) for recently evicted T1 items
- **B2** — ghost entries for recently evicted T2 items

When a miss lands in B1, ARC knows its frequency bias evicted something that was still being accessed — so it shifts balance toward recency. When a miss lands in B2, it shifts toward frequency. This **online tuning** means ARC adapts to the workload in real time.

\`\`\`callout
{
  "type": "info",
  "title": "TinyLFU: Frequency Estimation at Scale",
  "content": "Production caching systems use **TinyLFU** — a Count-Min Sketch that estimates access frequency using roughly 20 MB of memory for millions of keys.\\n\\nWhen a new item arrives, TinyLFU compares its estimated frequency against the current LFU victim:\\n- New item frequency > victim frequency → admitted, victim evicted\\n- New item frequency ≤ victim frequency → **rejected outright** — the new item never enters the cache\\n\\nThis admission gate completely eliminates scan pollution: a batch job's 10,000 one-shot keys are all rejected, and your hot items stay untouched.\\n\\nRedis supports LFU eviction via \`CONFIG SET maxmemory-policy allkeys-lfu\`."
}
\`\`\`

---

## Policy Comparison

\`\`\`tabs
{
  "tabs": [
    {
      "label": "FIFO",
      "icon": "📥",
      "content": "**First In, First Out**\\n\\n- **Evicts:** Oldest entry by insertion time\\n- **Data structure:** Queue\\n- **get / put:** O(1)\\n- **Strength:** Zero bookkeeping, dead simple\\n- **Weakness:** Completely ignores usage — a recently-accessed hot item is evicted as readily as a cold one\\n- **Best workloads:** Short-TTL CDN layers, static asset caches where age alone determines staleness"
    },
    {
      "label": "LRU",
      "icon": "🕐",
      "content": "**Least Recently Used**\\n\\n- **Evicts:** Item not accessed for the longest time\\n- **Data structure:** HashMap + Doubly-Linked List\\n- **get / put:** O(1)\\n- **Strength:** Excellent temporal locality; matches most web/API workloads intuitively\\n- **Weakness:** Sequential scan pollution — one full table scan flushes the entire hot set\\n- **Best workloads:** Web page caches, session stores, API response caches, CPU L1/L2 caches"
    },
    {
      "label": "LFU",
      "icon": "🔢",
      "content": "**Least Frequently Used**\\n\\n- **Evicts:** Item with the lowest access count (LRU tiebreak)\\n- **Data structure:** Two HashMaps + per-frequency OrderedDicts + min_freq pointer\\n- **get / put:** O(1)\\n- **Strength:** Immune to scan pollution; stable hot items are protected by their accumulated frequency\\n- **Weakness:** Frequency bias — an item hot six months ago retains high frequency and crowds out newly popular items\\n- **Best workloads:** Content recommendation caches, CDN origin shields, stable read-heavy hot sets"
    },
    {
      "label": "ARC",
      "icon": "🔄",
      "content": "**Adaptive Replacement Cache**\\n\\n- **Evicts:** Self-tunes between recency and frequency using ghost lists\\n- **Data structure:** Four lists (T1, T2, B1, B2) + tuning parameter p\\n- **get / put:** O(1) amortized\\n- **Strength:** Adapts online to the actual workload; outperforms both LRU and LFU in benchmarks on mixed workloads\\n- **Weakness:** Higher implementation complexity; originally IBM-patented (Linux uses simpler variants)\\n- **Best workloads:** ZFS (native), database buffer pools, any high-value cache where you cannot predict workload mix"
    },
    {
      "label": "Random",
      "icon": "🎲",
      "content": "**Random Replacement**\\n\\n- **Evicts:** A uniformly random item\\n- **Data structure:** Array\\n- **get / put:** O(1)\\n- **Strength:** Zero metadata overhead; hardware-friendly\\n- **Weakness:** Unpredictable; may evict the hottest item in the cache\\n- **Best workloads:** CPU TLBs and branch predictors (hardware has no memory to spare), scenarios where access patterns are provably uniform"
    }
  ]
}
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{
  "title": "Complete the LRU get() method",
  "prompt": "The get() method must return -1 on a cache miss, and move the key to the MRU position on a hit.",
  "language": "python",
  "template": "def get(self, key):\\n    if key not in self.cache:\\n        return ___\\n    self.cache.move_to_end(___)\\n    return self.cache[key]",
  "blanks": [
    { "answer": "-1", "hint": "Sentinel value indicating the key is not cached" },
    { "answer": "key", "hint": "Which key should be promoted to the most-recently-used end?" }
  ]
}
\`\`\`

\`\`\`fillblank
{
  "title": "LFU: bookkeeping after inserting a new item",
  "prompt": "After evicting the LFU victim, you insert the new item. What frequency counter and min_freq value should it start with?",
  "language": "python",
  "template": "# evict the current LFU victim\\nevict, _ = self.freq_keys[self.min_freq].popitem(last=False)\\ndel self.key_val[evict]\\ndel self.key_freq[evict]\\n\\n# insert new item\\nself.key_val[key]  = value\\nself.key_freq[key] = ___\\nself.freq_keys[___][key] = None\\nself.min_freq = ___",
  "blanks": [
    { "answer": "1", "hint": "A brand-new item has been accessed exactly how many times?" },
    { "answer": "1", "hint": "Which frequency bucket does a new item belong to?" },
    { "answer": "1", "hint": "The new item is the only item at its frequency — so the global minimum is?" }
  ]
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "Cache Eviction Policies",
  "questions": [
    {
      "question": "Cache capacity = 3. Operations: put(A), put(B), put(C), get(A), put(D). Under LRU, which key is evicted when D is inserted?",
      "options": ["A", "B", "C", "D"],
      "answer": 1,
      "explanation": "After put(A), put(B), put(C), the LRU-to-MRU order is [A, B, C]. get(A) promotes A to MRU, giving [B, C, A]. When D is inserted and the cache is full, B is evicted as the item least recently used."
    },
    {
      "question": "An LFU cache (capacity=3) holds items A (freq=5), B (freq=3), C (freq=1). A new item D arrives. Which item is evicted?",
      "options": ["A — highest frequency, make room", "B — middle frequency", "C — lowest frequency", "None — the cache isn't full"],
      "answer": 2,
      "explanation": "LFU always evicts the item with the minimum access frequency. C has frequency 1, the lowest in the cache. LRU tiebreak only applies when multiple items share the minimum frequency."
    },
    {
      "question": "A nightly ETL job performs a full sequential scan of 500,000 unique database rows, warming none of them again. Which eviction policy is MOST harmed by this?",
      "options": ["LFU", "ARC", "LRU", "Random Replacement"],
      "answer": 2,
      "explanation": "LRU is most vulnerable to sequential scan pollution. Each of the 500,000 unique rows enters as 'most recently used', flushing the entire working set of genuinely hot items. LFU resists this because scan items start at frequency 1 and lose to items with accumulated frequency. ARC's ghost lists detect and adapt to this pattern."
    },
    {
      "question": "In ARC, a cache miss falls on an item in the B2 ghost list. What does ARC do in response?",
      "options": ["Increase the weight given to the frequency list (T2)", "Increase the weight given to the recency list (T1)", "Evict a random item from T1", "Double the cache capacity temporarily"],
      "answer": 0,
      "explanation": "B2 contains ghost entries for recently evicted T2 (frequency) items. A B2 hit tells ARC that its current balance is evicting items that are still being accessed from the frequency side — so ARC shifts more space toward T2 (frequency tracking). B1 hits trigger the opposite adjustment toward T1 (recency)."
    },
    {
      "question": "Redis uses a probabilistic approximation rather than a true doubly-linked-list LRU. What is the primary motivation?",
      "options": ["True LRU requires pointer updates on every access, causing cache-unfriendly random writes", "Redis does not support eviction policies", "Approximate LRU always achieves higher hit rates than true LRU", "Redis only supports FIFO eviction internally"],
      "answer": 0,
      "explanation": "True LRU must update pointer positions in the doubly-linked list on every cache hit — that is, every read causes a write. These writes are scattered in memory, thrashing the CPU cache. Redis instead samples a small pool of random keys and evicts the least recently used among the sample. This approximation achieves near-optimal hit rates at a fraction of the bookkeeping cost."
    }
  ]
}
\`\`\`

---

## Choosing a Policy in an Interview

When a system design interviewer asks about cache eviction, anchor your answer to three questions:

1. **What does the access pattern look like?** Temporal locality (recent = relevant) → LRU. Stable hot set (frequency = relevant) → LFU.
2. **Is scan pollution a risk?** Batch ETL, analytics scans, or recommendation engines reading large cold sets → LFU or TinyLFU. Pure web/API serving → LRU is simpler and sufficient.
3. **How much metadata overhead is acceptable?** LRU: one linked list. LFU: two maps + per-frequency dicts. ARC: four lists. Hardware caches (TLB): Random — no memory to spare.

\`\`\`callout
{
  "type": "tip",
  "title": "Configuring Redis Eviction",
  "content": "Redis lets you switch eviction policy at runtime and inspect it:\\n\\n\`\`\`\\n# Switch to LRU\\nredis-cli CONFIG SET maxmemory-policy allkeys-lru\\n\\n# Switch to LFU\\nredis-cli CONFIG SET maxmemory-policy allkeys-lfu\\n\\n# Check approximate access frequency for a key (LFU mode only)\\nredis-cli OBJECT FREQ mykey\\n\\n# Monitor eviction rate\\nredis-cli INFO stats | grep evicted_keys\\n\`\`\`\\n\\nStart with \`allkeys-lru\` for general web workloads. Switch to \`allkeys-lfu\` if you observe hot-key evictions during batch job windows."
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "FIFO evicts the oldest entry by insertion time — simple and zero-overhead, but blind to how items are actually used.",
    "LRU tracks recency with a HashMap + Doubly-Linked List for O(1) get/put. It matches most web workloads but is vulnerable to sequential scan pollution.",
    "LFU tracks frequency using a min-frequency pointer and per-frequency OrderedDicts for O(1) operations. It resists scan pollution but can be biased toward historically popular items that are no longer relevant.",
    "ARC maintains four lists (T1, T2, B1, B2) and self-tunes between recency and frequency online, outperforming pure LRU and LFU on mixed workloads.",
    "TinyLFU uses a Count-Min Sketch to estimate frequency for millions of keys with ~20 MB overhead, and rejects new items whose frequency is lower than the current eviction victim — eliminating cache pollution entirely.",
    "Choose LRU for general web/API caches. Choose LFU when a stable hot set must be protected from scan workloads. Choose ARC when you cannot predict the workload mix in advance."
  ]
}
\`\`\``,
    },
    {
      id: "distributed-caching-redis-memcached",
      slug: "distributed-caching-redis-memcached",
      title: "Distributed Caching: Redis vs Memcached",
      content: `# Distributed Caching: Redis vs Memcached

When your application serves millions of requests per second, the difference between a cache hit and a database round-trip is the difference between 1ms and 100ms. At scale, that gap defines user experience — and your infrastructure bill.

Both Redis and Memcached solve the same fundamental problem: keep hot data in RAM so you never pay the cost of a disk read. But under the hood, they make radically different architectural choices — choices that determine which one belongs in your system.

\`\`\`concept
{ "title": "The Core Tradeoff", "variant": "mental-model", "content": "Memcached is a cache: simple, fast, multi-threaded, purpose-built for one job. Redis is a data structure server that happens to be an excellent cache — it also functions as a message broker, stream processor, and lightweight database. If all you need is a cache, Memcached is elegant. If you need anything more, Redis eliminates the need to bolt together multiple systems." }
\`\`\`

---

## Architectural Foundations

The performance and capability differences between the two systems trace back to a single foundational choice made during their design.

\`\`\`tabs
{ "tabs": [
  {
    "label": "Redis Architecture",
    "icon": "🔴",
    "content": "### Single-Threaded Event Loop\\n\\nRedis uses a **single-threaded** event loop (similar to Node.js). All commands execute sequentially in one thread, eliminating race conditions on data structures without locks.\\n\\n**Why this works:** RAM operations are so fast (~100ns) that the bottleneck is almost always network I/O, not CPU. A single thread processes commands as fast as they arrive.\\n\\n**Tradeoff:** On multi-core machines, one Redis instance uses one core. You scale by running multiple Redis instances (sharding) rather than by adding CPU threads.\\n\\n**Key internals:**\\n- In-memory data structure store\\n- Rich native types: strings, lists, sets, sorted sets, hashes, streams, HyperLogLog\\n- Disk persistence via RDB snapshots and AOF (Append-Only File)\\n- Native Pub/Sub messaging\\n- Lua scripting for atomic multi-step operations\\n- Redis Cluster for horizontal partitioning"
  },
  {
    "label": "Memcached Architecture",
    "icon": "⚡",
    "content": "### Multi-Threaded Slab Allocator\\n\\nMemcached uses **multiple threads**, each handling connections independently. This makes it naturally suited to multi-core machines and high-concurrency workloads.\\n\\n**Slab allocation:** Memory is pre-divided into fixed-size classes (slabs). Objects are stored in the nearest-fitting slab class. This prevents fragmentation but can waste memory if object sizes don't align well with slab boundaries.\\n\\n**Key internals:**\\n- Pure key-value store: keys up to 250 bytes, values up to 1MB\\n- Only one eviction policy: LRU (Least Recently Used)\\n- No persistence — cache is volatile by design\\n- No native replication or clustering (handled externally)\\n- ~20% lower memory overhead than Redis per cached object\\n- Scales vertically (more cores = more throughput) without sharding complexity"
  }
] }
\`\`\`

---

## Data Structures: Where Redis Pulls Ahead

Memcached stores everything as a flat byte string. Your application serializes and deserializes. Redis stores data in native structures — and lets you operate on them server-side.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Memcached: Leaderboard (manual)", "code": "# Read entire leaderboard from cache\\nscores = memcache.get('leaderboard')\\nif scores:\\n    data = json.loads(scores)\\nelse:\\n    data = db.query('SELECT user_id, score FROM scores ORDER BY score DESC LIMIT 100')\\n    memcache.set('leaderboard', json.dumps(data), expire=60)\\n\\n# Update a score? Invalidate the whole cache.\\n# Next request rebuilds from DB.\\nmemcache.delete('leaderboard')" }, "after": { "label": "Redis: Leaderboard (native sorted set)", "code": "# Increment a user's score atomically\\nredis.zincrby('leaderboard', 10, 'user:42')\\n\\n# Retrieve top 10 with scores — no DB call ever\\ntop10 = redis.zrevrange('leaderboard', 0, 9, withscores=True)\\n\\n# The sorted set IS the leaderboard.\\n# No serialization. No full invalidation.\\n# Updates are O(log N), reads are O(log N + M)." } }
\`\`\`

This pattern generalizes across many use cases:

| Use Case | Memcached Approach | Redis Native Type |
|---|---|---|
| Session data | Serialize dict → string | Hash (\`HGET\`/\`HSET\` per field) |
| Activity feed | Serialize list → string | List (\`LPUSH\`/\`LRANGE\`) |
| Leaderboard | Full invalidation on change | Sorted Set (\`ZADD\`/\`ZREVRANGE\`) |
| Unique visitor count | Store entire set → string | HyperLogLog (\`PFADD\`/\`PFCOUNT\`) |
| Rate limiting | CAS (compare-and-swap) loop | \`INCR\` + \`EXPIRE\` atomic |
| Pub/Sub notifications | Not supported | Native \`PUBLISH\`/\`SUBSCRIBE\` |

---

## Persistence and Durability

\`\`\`tabs
{ "tabs": [
  {
    "label": "Redis: RDB Snapshots",
    "icon": "📸",
    "content": "**Point-in-time snapshots** written to disk at configurable intervals.\\n\\n\`\`\`\\nsave 900 1    # Snapshot if 1 key changed in 15 min\\nsave 300 10   # Snapshot if 10 keys changed in 5 min\\nsave 60 10000 # Snapshot if 10k keys changed in 1 min\\n\`\`\`\\n\\n**Pros:** Compact file, fast restarts, minimal runtime overhead.\\n\\n**Cons:** Data written between snapshots is lost on crash. Not suitable for strict durability.\\n\\n**When to use:** When you can tolerate losing the last few minutes of cache data on restart."
  },
  {
    "label": "Redis: AOF Log",
    "icon": "📝",
    "content": "**Append-Only File** logs every write operation. On restart, Redis replays the log.\\n\\n\`\`\`\\nappendonly yes\\nappendfsync everysec  # fsync once/sec (good balance)\\n# appendfsync always  # fsync every write (max durability, slower)\\n# appendfsync no      # OS decides (fast, less safe)\\n\`\`\`\\n\\n**Pros:** Near-zero data loss (\`everysec\` loses at most 1 second of writes).\\n\\n**Cons:** AOF files grow large. Rewrites compact them, but the process uses CPU and disk.\\n\\n**When to use:** Session stores, rate-limit counters, and any Redis data you treat as a source of truth."
  },
  {
    "label": "Memcached: No Persistence",
    "icon": "💨",
    "content": "Memcached is **intentionally volatile**. There is no persistence layer. A restart empties the cache.\\n\\nThis is a feature, not a bug:\\n- No disk I/O overhead\\n- No recovery time on restart — cache fills naturally as requests arrive\\n- Forces your application to handle cache misses gracefully (the right behavior anyway)\\n\\n**When this is fine:** Caching rendered HTML, API responses, or database query results that can always be regenerated from the source of truth.\\n\\n**When this hurts:** Storing session data, computed aggregates, or anything that's expensive and non-trivial to rebuild."
  }
] }
\`\`\`

---

## Clustering and High Availability

This is where operational complexity diverges most sharply.

\`\`\`steps
{ "title": "Redis Cluster: Built-in HA", "steps": [
  { "title": "Hash Slot Partitioning", "content": "Redis Cluster divides the keyspace into **16,384 hash slots**. Each primary node owns a range of slots. A key's slot is computed as \`CRC16(key) % 16384\`, which determines which node stores it.\\n\\nExample with 3 nodes:\\n- Node A: slots 0–5460\\n- Node B: slots 5461–10922\\n- Node C: slots 10923–16383" },
  { "title": "Replication", "content": "Each primary has one or more replica nodes that receive asynchronous copies of writes. A minimum production setup is **3 primaries + 3 replicas** (6 nodes total). This tolerates the failure of any single primary." },
  { "title": "Automatic Failover", "content": "When a primary is unreachable, its replicas hold an election. The winner promotes itself to primary within sub-second detection time. Client connections are rerouted automatically via \`CLUSTER SLOTS\` commands.\\n\\nNo external load balancer or DNS change needed — it's built into the protocol." },
  { "title": "Client Routing", "content": "Cluster-aware clients (e.g., \`redis-py\`, \`ioredis\`) cache the slot map locally. If a request hits the wrong node, the node replies with \`MOVED slot ip:port\` and the client updates its map.\\n\\nThis means a single logical \`redis.get(key)\` always reaches the right node in at most two hops." }
] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Memcached Has No Native Clustering", "content": "Memcached nodes are completely independent. There is no built-in replication, no leader election, and no automatic failover. High availability must be handled externally — via consistent hashing in the client library, a proxy like mcrouter (Facebook's open-source solution), or a load balancer with health checks. This is simpler to operate when you don't need HA, but adds significant complexity when you do." }
\`\`\`

---

## Cache Stampede and Thundering Herd

These are two related failure modes that will bring down any caching layer at scale if not explicitly handled.

\`\`\`concept
{ "title": "Cache Stampede", "variant": "rule", "content": "A cache stampede occurs when a popular cached item expires and hundreds of concurrent requests simultaneously find a cache miss — all racing to query the database and repopulate the cache. The database receives a sudden spike equal to the cache's traffic, potentially crashing it. The more popular the key, the more catastrophic the stampede." }
\`\`\`

\`\`\`tabs
{ "tabs": [
  {
    "label": "Problem: Stampede",
    "icon": "💥",
    "content": "\`\`\`\\nTime 0:   Key 'home_feed' cached. 1000 req/sec served from cache.\\nTime 60s: TTL expires. Key evicted.\\nTime 60s+1ms: 800 simultaneous requests → all get MISS.\\nTime 60s+2ms: 800 DB queries fire simultaneously.\\nTime 60s+500ms: DB query times triple. Some requests time out.\\nTime 61s: All 800 requests repopulate cache with same data.\\n           Then discard 799 of those copies.\\n\`\`\`\\n\\nThe DB just absorbed 800x its normal load for a fraction of a second."
  },
  {
    "label": "Fix: Mutex Lock",
    "icon": "🔒",
    "content": "Use Redis \`SET NX\` (set if not exists) as a distributed lock.\\n\\n\`\`\`python\\ndef get_with_lock(key, ttl, fetch_fn):\\n    value = redis.get(key)\\n    if value:\\n        return value\\n\\n    lock_key = f'lock:{key}'\\n    acquired = redis.set(lock_key, '1', nx=True, ex=5)\\n\\n    if acquired:\\n        # This process won the lock — rebuild the cache\\n        value = fetch_fn()  # DB query\\n        redis.setex(key, ttl, value)\\n        redis.delete(lock_key)\\n        return value\\n    else:\\n        # Another process is rebuilding — wait briefly and retry\\n        time.sleep(0.05)\\n        return redis.get(key)  # Should be populated now\\n\`\`\`\\n\\nOnly ONE request hits the database. All others wait 50ms and get the cached value."
  },
  {
    "label": "Fix: Probabilistic Early Expiration",
    "icon": "🎲",
    "content": "**XFetch algorithm** (used at Reddit, Medium): Before the TTL expires, some requests probabilistically decide to refresh early, while the key is still serving traffic.\\n\\n\`\`\`python\\nimport math, random, time\\n\\ndef xfetch(key, ttl, delta, fetch_fn):\\n    value, expiry = redis.get_with_expiry(key)\\n\\n    if value is None:\\n        value = fetch_fn()\\n        redis.setex(key, ttl, value)\\n        return value\\n\\n    time_to_expiry = expiry - time.time()\\n    # Probabilistically recompute before expiry\\n    if -delta * math.log(random.random()) >= time_to_expiry:\\n        value = fetch_fn()\\n        redis.setex(key, ttl, value)\\n\\n    return value\\n\`\`\`\\n\\n\`delta\` is the time (seconds) your fetch function takes. As TTL approaches zero, recomputation becomes increasingly likely — smoothing the refresh across many requests."
  },
  {
    "label": "Fix: Stale-While-Revalidate",
    "icon": "♻️",
    "content": "Serve **stale data immediately** while refreshing asynchronously in the background.\\n\\n\`\`\`python\\ndef get_stale_while_revalidate(key, ttl, stale_ttl, fetch_fn):\\n    value = redis.get(key)\\n\\n    if value:\\n        # Check a secondary 'fresh' key\\n        is_fresh = redis.exists(f'fresh:{key}')\\n        if not is_fresh:\\n            # Trigger async refresh without blocking the request\\n            background_queue.enqueue(refresh_cache, key, ttl, stale_ttl, fetch_fn)\\n        return value  # Return stale immediately\\n\\n    # True miss — must wait\\n    value = fetch_fn()\\n    redis.setex(key, stale_ttl, value)\\n    redis.setex(f'fresh:{key}', ttl, '1')\\n    return value\\n\`\`\`\\n\\nThe user sees the old value for one request cycle. The DB never receives a spike."
  }
] }
\`\`\`

\`\`\`concept
{ "title": "Thundering Herd vs Cache Stampede", "variant": "insight", "content": "These terms are often used interchangeably but describe slightly different situations. A **cache stampede** is specifically about an expired key causing concurrent DB queries. A **thundering herd** is broader — it's any event (server restart, deployment, cache flush) that causes many clients to simultaneously hit a cold system. The fixes overlap: distributed locks, jittered TTLs, and gradual cache warming all address both problems." }
\`\`\`

---

## The Decision Framework

\`\`\`tabs
{ "tabs": [
  {
    "label": "Choose Redis When",
    "icon": "✅",
    "content": "**Use Redis if any of these apply:**\\n\\n- You need **rich data types** (sorted sets, lists, streams, pub/sub)\\n- You need **persistence** — sessions, counters, rate limits that survive restarts\\n- You need **native HA** with automatic failover\\n- You need **atomic operations** across multiple fields (Lua scripting, transactions)\\n- You're building **real-time features**: leaderboards, activity feeds, notifications\\n- You want to **replace multiple systems** (cache + queue + pub/sub broker)\\n- Your team prefers operational simplicity over maximum throughput\\n\\n**Real-world adopters:** Twitter (timeline caching), GitHub (job queues), Airbnb (rate limiting), Stack Overflow (cache + pub/sub)"
  },
  {
    "label": "Choose Memcached When",
    "icon": "⚡",
    "content": "**Use Memcached if all of these are true:**\\n\\n- You only need **simple key-value caching** (no structures, no persistence)\\n- **Data loss on restart is acceptable** — you can always regenerate from DB\\n- You need to cache **very large datasets** (100GB+) with maximum memory efficiency\\n- Your workload benefits from **multi-threaded** vertical scaling\\n- You need to cache **large, flat blobs**: rendered HTML, serialized API responses\\n- Operational simplicity is paramount — fewer moving parts\\n\\n**Real-world adopters:** Facebook (memcache at massive scale with mcrouter), Wikipedia (page fragment caching), Flickr (early image metadata)"
  },
  {
    "label": "Use Both",
    "icon": "🔀",
    "content": "**Many large-scale architectures use both in parallel:**\\n\\n| Layer | System | Why |\\n|---|---|---|\\n| Page/fragment cache | Memcached | High-volume, large values, memory-efficient |\\n| Session store | Redis | Persistence, hash operations per-field |\\n| Leaderboards | Redis | Sorted sets, O(log N) updates |\\n| Rate limiting | Redis | Atomic INCR + EXPIRE |\\n| Job queue | Redis | List + pub/sub |\\n| API response cache | Memcached | Simple KV, maximum throughput |\\n\\nThis lets each system play to its strengths. The added operational cost is justified at scale where the performance gains in each tier compound." }
] }
\`\`\`

---

## System Architecture: Production Redis Cluster

\`\`\`sysdiag
{ "title": "Redis Cluster with 3 Primary + 3 Replica Nodes", "width": 680, "height": 400,
  "nodes": [
    { "id": "client", "label": "App Servers", "x": 80, "y": 190, "kind": "client" },
    { "id": "p1", "label": "Primary 1\\nSlots 0–5460", "x": 260, "y": 80, "kind": "service" },
    { "id": "p2", "label": "Primary 2\\nSlots 5461–10922", "x": 260, "y": 200, "kind": "service" },
    { "id": "p3", "label": "Primary 3\\nSlots 10923–16383", "x": 260, "y": 320, "kind": "service" },
    { "id": "r1", "label": "Replica 1", "x": 480, "y": 80, "kind": "database" },
    { "id": "r2", "label": "Replica 2", "x": 480, "y": 200, "kind": "database" },
    { "id": "r3", "label": "Replica 3", "x": 480, "y": 320, "kind": "database" }
  ],
  "edges": [
    { "from": "client", "to": "p1", "label": "CRC16 slot" },
    { "from": "client", "to": "p2", "label": "routing" },
    { "from": "client", "to": "p3", "label": "" },
    { "from": "p1", "to": "r1", "label": "async repl" },
    { "from": "p2", "to": "r2", "label": "async repl" },
    { "from": "p3", "to": "r3", "label": "async repl" }
  ],
  "annotations": {
    "client": "Cluster-aware clients cache the slot map. Commands route to the correct primary in one hop. MOVED responses update the map.",
    "p1": "Each primary owns a contiguous range of hash slots. Resharding moves slots between nodes without downtime.",
    "r1": "Replicas receive async copies of writes. On primary failure, a replica is elected new primary within sub-second detection."
  }
}
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Redis vs Memcached — Check Your Understanding", "questions": [
  {
    "question": "You're building a real-time leaderboard for a mobile game. Players earn points continuously and you need to retrieve the top 100 players with sub-millisecond latency. Which caching solution is most appropriate?",
    "options": [
      "Memcached — it's faster for read-heavy workloads",
      "Redis — sorted sets natively support ranked leaderboards with O(log N) updates",
      "Either — serialize the top-100 list and cache it with a 1-second TTL",
      "Memcached with application-level sorting on every read"
    ],
    "answer": 1,
    "explanation": "Redis sorted sets (ZADD/ZREVRANGE) are the canonical solution for leaderboards. They maintain sorted order automatically on every update, so you never need to re-sort or invalidate the entire cache. Memcached would require fetching all scores, sorting in application code, and dealing with invalidation on every score change."
  },
  {
    "question": "A primary Redis node in your cluster becomes unreachable. What happens next in a properly configured Redis Cluster?",
    "options": [
      "All requests fail until an operator manually promotes a replica",
      "The replicas detect the failure and hold an election; the winner promotes itself to primary automatically",
      "The load balancer redirects traffic to another primary node which now handles all slots",
      "Redis Cluster has no failover mechanism — you must configure an external health checker"
    ],
    "answer": 1,
    "explanation": "Redis Cluster has built-in automatic failover. When a primary is unreachable, its replicas initiate an election. The replica that wins the majority vote promotes itself to primary within sub-second detection time. Client connections are rerouted automatically via the updated cluster topology. This is one of Redis's major operational advantages over Memcached, which has no native failover."
  },
  {
    "question": "Which of the following best describes a cache stampede?",
    "options": [
      "A cache that grows too large and starts evicting hot keys",
      "A deployment that invalidates all cached data simultaneously",
      "A popular cached key expiring, causing hundreds of concurrent requests to miss and simultaneously query the database",
      "A network partition that causes cache replicas to serve stale data"
    ],
    "answer": 2,
    "explanation": "A cache stampede occurs when a high-traffic cached key expires, causing all concurrent requests to experience a cache miss at the same moment. They all race to query the database and repopulate the cache, creating a sudden spike equal to the cache's traffic level. This can overwhelm the database. Solutions include distributed mutex locks (Redis SET NX), probabilistic early expiration (XFetch), and stale-while-revalidate."
  },
  {
    "question": "What is Memcached's slab allocation strategy and why does it exist?",
    "options": [
      "Slab allocation partitions memory by key prefix to improve cache locality",
      "Slab allocation pre-divides memory into fixed-size classes to prevent heap fragmentation, at the cost of potential internal waste",
      "Slab allocation is a write-ahead log that prevents data loss on restart",
      "Slab allocation distributes keys across multiple Memcached nodes for horizontal scaling"
    ],
    "answer": 1,
    "explanation": "Memcached pre-divides its memory into slab classes — each class holds objects within a certain size range. When an object arrives, it's placed in the nearest-fitting slab class. This prevents heap fragmentation (which would degrade performance over time) but can waste memory if object sizes don't align well with slab boundaries. It's a deliberate engineering tradeoff that prioritizes allocation speed and memory stability over space efficiency."
  },
  {
    "question": "You need to implement a rate limiter: each user can make 100 API requests per minute. Which approach is correct with Redis?",
    "options": [
      "Store a JSON list of timestamps per user in Memcached; count entries on each request",
      "Use Redis INCR on a per-user key combined with EXPIRE — the counter is atomic and resets after 60 seconds",
      "Query the database on each request and update a counter column with optimistic locking",
      "Use Redis SADD to add each request timestamp to a set; check set size on each request"
    ],
    "answer": 1,
    "explanation": "INCR + EXPIRE is the canonical Redis rate limiting pattern. INCR is atomic — even under concurrent load, no two increments collide. Setting EXPIRE on first creation ensures the counter resets automatically after the window. The full pattern: INCR the key, set EXPIRE only if this is the first increment (using SET NX or checking the return value), then check if the count exceeds the limit. This handles millions of rate-limited users with O(1) per request."
  }
] }
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Redis is single-threaded with an event loop; Memcached is multi-threaded. Both are extremely fast — the difference matters most at hundreds of thousands of requests per second on multi-core machines.",
  "Redis's native data types (sorted sets, lists, streams, pub/sub) eliminate the need to serialize, deserialize, and manually sort data in your application layer.",
  "Redis offers two persistence modes (RDB snapshots, AOF log) and built-in cluster HA with automatic failover. Memcached is intentionally volatile and relies on external tooling for HA.",
  "Cache stampedes occur when a popular key expires and concurrent requests simultaneously hit the database. Mitigate with distributed locks (Redis SET NX), probabilistic early expiration (XFetch), or stale-while-revalidate.",
  "The pragmatic rule: choose Memcached for large-scale, simple key-value caching where memory efficiency and multi-threaded throughput are the only concerns. Choose Redis for everything else.",
  "At very large scale, use both: Memcached for high-volume page/fragment caching, Redis for sessions, leaderboards, rate limiting, and queues — each system plays to its strengths."
] }
\`\`\``,
    },
    {
      id: "cache-invalidation-and-consistency",
      slug: "cache-invalidation-and-consistency",
      title: "Cache Invalidation and Consistency",
      content: `# Cache Invalidation and Consistency

> *"There are only two hard things in Computer Science: cache invalidation and naming things."* — Phil Karlton

You've learned how caching dramatically improves read performance. Now comes the catch: **every time the underlying data changes, the cache might silently lie to your users.** A product shows a sold-out price. A profile still displays an old avatar. A dashboard shows yesterday's revenue.

This lesson is about solving that problem — keeping your cache and database honest with each other.

\`\`\`concept
{ "title": "The Core Problem", "variant": "mental-model", "content": "A cache is not your source of truth — your database is. The cache is a copy. Every write to the database creates a potential lie in the cache. Cache invalidation is the discipline of detecting those lies and eliminating them before users see them." }
\`\`\`

---

## Why Cache Invalidation Is Hard

Consider this race condition, discovered repeatedly in production systems at companies like Meta:

\`\`\`trace
{ "title": "The Classic Inconsistency Race", "language": "python", "code": "# Thread A: User updates profile picture\\ndb.write('user:42:avatar', 'new_photo.jpg')\\ncache.delete('user:42:avatar')\\n\\n# Thread B (running concurrently, started before Thread A's delete)\\nvalue = cache.get('user:42:avatar')   # cache miss — reads DB\\nold_val = db.read('user:42:avatar')   # reads BEFORE Thread A's write lands\\ncache.set('user:42:avatar', old_val) # populates cache with STALE value\\n\\n# Result: Thread A deleted stale cache,\\n# but Thread B just re-populated it with the old value.", "frames": [ { "line": 2, "vars": { "db": "new_photo.jpg", "cache": "old_photo.jpg (stale)" }, "note": "Thread A writes new value to DB", "stdout": "" }, { "line": 3, "vars": { "db": "new_photo.jpg", "cache": "old_photo.jpg (stale)" }, "note": "Thread A deletes cache entry", "stdout": "" }, { "line": 6, "vars": { "db": "new_photo.jpg", "cache": "(miss)" }, "note": "Thread B: cache miss, goes to DB", "stdout": "" }, { "line": 7, "vars": { "old_val": "old_photo.jpg", "db": "new_photo.jpg (write in-flight)" }, "note": "Thread B reads DB BEFORE Thread A's write commits", "stdout": "" }, { "line": 8, "vars": { "cache": "old_photo.jpg (wrong!)" }, "note": "Thread B poisons the cache with stale data", "stdout": "Cache now inconsistent — may persist indefinitely" } ], "speed": 900 }
\`\`\`

This is not a bug in the code — it's a **fundamental property of distributed systems**. The cache and database are two separate state machines. Any gap between writing one and updating the other is a window for inconsistency.

---

## The Three Strategies

You have three tools to fight staleness. They're not mutually exclusive — most production systems use all three in combination.

\`\`\`tabs
{ "tabs": [ { "label": "TTL", "icon": "⏱️", "content": "## Time-To-Live (TTL)\\n\\nEvery cache entry carries an expiry timestamp. When it expires, the next read triggers a fresh DB fetch.\\n\\n**How it works:**\\n\`\`\`\\ncache.set('product:99:price', 29.99, ttl=300)  # expires in 5 minutes\\n\`\`\`\\n\\n**Pros:**\\n- Zero complexity — no event system needed\\n- Resilient: cache heals itself even if invalidation events are lost\\n- Works well for data that changes infrequently\\n\\n**Cons:**\\n- Stale window = full TTL (up to 5 min of lies)\\n- Choosing the right TTL is a judgment call\\n- Can't guarantee freshness for critical data\\n\\n**Best for:** Product recommendations, analytics dashboards, leaderboards, session metadata" }, { "label": "Event-Driven", "icon": "📡", "content": "## Event-Driven Invalidation\\n\\nWhen data changes, publish an event. Cache subscribers delete the relevant key immediately.\\n\\n**How it works:**\\n\`\`\`\\n# On write:\\ndb.update('product:99', { price: 24.99 })\\npubsub.publish('invalidate', key='product:99:price')\\n\\n# Cache service listens:\\nfor event in pubsub.subscribe('invalidate'):\\n    cache.delete(event.key)\\n\`\`\`\\n\\n**Pros:**\\n- Near-instant consistency\\n- Precise — only stale keys are evicted\\n- Scales across multiple cache nodes via pub/sub\\n\\n**Cons:**\\n- Requires a reliable message bus (Kafka, Redis Pub/Sub)\\n- Missed events = persistent staleness\\n- Must handle the race condition (see TTL as fallback)\\n\\n**Best for:** Pricing, inventory, financial data, auth tokens" }, { "label": "Versioned Keys", "icon": "🔑", "content": "## Versioned Cache Keys\\n\\nEmbed a version number or content hash in the cache key. When data changes, the key changes — old entries become unreachable and naturally expire.\\n\\n**How it works:**\\n\`\`\`\\n# Store with version:\\nversion = db.get_version('product:99')  # e.g., v7\\ncache.set(f'product:99:v{version}', data)\\n\\n# Read:\\nversion = db.get_version('product:99')  # always fetch current version\\ndata = cache.get(f'product:99:v{version}')\\n\`\`\`\\n\\n**Pros:**\\n- No explicit delete needed — old keys are simply ignored\\n- Perfect for CDN/browser caching (cache-busting URLs)\\n- Atomic — no race condition on the key itself\\n\\n**Cons:**\\n- Version lookup requires one extra DB read (or a fast secondary cache)\\n- Old keys accumulate — need LRU/TTL cleanup\\n- Complex if multiple keys are interdependent\\n\\n**Best for:** Static assets, CDN URLs, rendered HTML, API response ETags" } ] }
\`\`\`

---

## TTL in Practice

Let's see TTL-based expiry in action with a Redis-like simulation:

\`\`\`playground
{ "title": "TTL Expiry Simulation", "language": "python", "code": "import time\\n\\nclass SimpleCache:\\n    def __init__(self):\\n        self._store = {}\\n\\n    def set(self, key, value, ttl_seconds):\\n        expires_at = time.time() + ttl_seconds\\n        self._store[key] = {'value': value, 'expires_at': expires_at}\\n        print(f'SET {key} = {value!r} (TTL: {ttl_seconds}s)')\\n\\n    def get(self, key):\\n        entry = self._store.get(key)\\n        if entry is None:\\n            print(f'GET {key} -> MISS (key does not exist)')\\n            return None\\n        if time.time() > entry['expires_at']:\\n            del self._store[key]\\n            print(f'GET {key} -> MISS (expired)')\\n            return None\\n        remaining = entry['expires_at'] - time.time()\\n        print(f'GET {key} -> HIT ({entry[\\"value\\"]!r}, {remaining:.1f}s remaining)')\\n        return entry['value']\\n\\n    def delete(self, key):\\n        removed = self._store.pop(key, None)\\n        print(f'DEL {key} -> {\\"removed\\" if removed else \\"not found\\"}')\\n\\n# --- Demo ---\\ncache = SimpleCache()\\n\\n# Simulate caching a product price with 2-second TTL\\ncache.set('product:99:price', 29.99, ttl_seconds=2)\\ncache.get('product:99:price')     # HIT\\n\\nprint('\\\\n--- 1 second later ---')\\ntime.sleep(1)\\ncache.get('product:99:price')     # still HIT\\n\\nprint('\\\\n--- 2 seconds later (expired) ---')\\ntime.sleep(1.1)\\ncache.get('product:99:price')     # MISS — TTL expired\\n\\nprint('\\\\n--- Explicit invalidation on write ---')\\ncache.set('user:42:bio', 'Old bio text', ttl_seconds=60)\\ncache.get('user:42:bio')          # HIT\\ncache.delete('user:42:bio')       # Simulate write invalidation\\ncache.get('user:42:bio')          # MISS — explicitly deleted\\n", "runnable": true }
\`\`\`

---

## Visualizing Event-Driven Invalidation

Here's what happens when an e-commerce product update propagates through a distributed cache system:

\`\`\`algoviz
{ "title": "Event-Driven Invalidation Flow", "type": "array", "data": ["DB write", "Pub/Sub publish", "Cache node A", "Cache node B", "Cache node C", "All fresh"], "frames": [ { "highlight": [0], "label": "Step 1: Product price updated in primary database (\\\\$29.99 → \\\\$24.99)", "stats": { "event": "none", "stale_nodes": 3 } }, { "highlight": [0, 1], "label": "Step 2: DB change listener publishes 'invalidate:product:99' to message bus", "stats": { "event": "published", "stale_nodes": 3 } }, { "highlight": [1, 2], "label": "Step 3: Cache Node A receives event, deletes 'product:99'", "stats": { "event": "propagating", "stale_nodes": 2 } }, { "highlight": [1, 3], "label": "Step 4: Cache Node B receives event, deletes 'product:99'", "stats": { "event": "propagating", "stale_nodes": 1 } }, { "highlight": [1, 4], "label": "Step 5: Cache Node C receives event, deletes 'product:99'", "stats": { "event": "propagating", "stale_nodes": 0 } }, { "highlight": [5], "label": "Step 6: All nodes consistent — next read on any node fetches fresh \\\\$24.99 from DB", "stats": { "event": "complete", "stale_nodes": 0 } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always Pair Event-Driven Invalidation with TTL", "content": "Message delivery is not guaranteed in distributed systems. Network partitions, consumer restarts, or broker failures can silently drop invalidation events. If that happens, stale data lives in cache forever — until the next TTL expiry. Set a TTL as a safety net even when using event-driven invalidation." }
\`\`\`

---

## Versioned Keys for CDN Cache-Busting

Versioned keys are the industry standard for browser and CDN caches where you cannot issue a \`DELETE\` command to millions of edge nodes:

\`\`\`playground
{ "title": "Versioned Key Cache-Busting", "language": "python", "code": "import hashlib\\nimport json\\n\\ndef make_cache_key(entity_id, data):\\n    \\"\\"\\"Generate a content-addressed cache key using a hash of the data.\\"\\"\\"\\n    content_hash = hashlib.md5(json.dumps(data, sort_keys=True).encode()).hexdigest()[:8]\\n    return f\\"{entity_id}:{content_hash}\\"\\n\\n# Simulated in-memory cache (models a CDN)\\ncache = {}\\n\\ndef cache_set(key, value):\\n    cache[key] = value\\n    print(f\\"CACHED: {key}\\")\\n\\ndef cache_get(key):\\n    val = cache.get(key)\\n    status = \\"HIT\\" if val else \\"MISS\\"\\n    print(f\\"GET {key} -> {status}\\")\\n    return val\\n\\n# --- V1: Original product data ---\\nproduct_v1 = {\\"name\\": \\"Laptop Pro\\", \\"price\\": 1299, \\"stock\\": 50}\\nkey_v1 = make_cache_key(\\"product:99\\", product_v1)\\ncache_set(key_v1, product_v1)\\ncache_get(key_v1)  # HIT\\n\\nprint()\\nprint(\\"--- Product price updated in DB ---\\")\\nprint()\\n\\n# --- V2: Price updated ---\\nproduct_v2 = {\\"name\\": \\"Laptop Pro\\", \\"price\\": 999, \\"stock\\": 50}\\nkey_v2 = make_cache_key(\\"product:99\\", product_v2)\\n\\nprint(f\\"Old key: {key_v1}\\")\\nprint(f\\"New key: {key_v2}\\")\\nprint(f\\"Keys differ: {key_v1 != key_v2}\\")\\nprint()\\n\\n# Old key still works (old clients with old URLs still get consistent response)\\ncache_get(key_v1)  # HIT — old version still accessible\\n\\n# New key is a miss on first access (cache-busted)\\ncache_get(key_v2)  # MISS — new version not cached yet\\ncache_set(key_v2, product_v2)\\ncache_get(key_v2)  # HIT — now cached\\n", "runnable": true }
\`\`\`

---

## The Write Strategy Connection

Cache invalidation strategy is tightly coupled to your write pattern:

\`\`\`sysdiag
{ "title": "Write Strategies and Their Invalidation Implications", "width": 680, "height": 340, "nodes": [ { "id": "client", "label": "Client", "x": 60, "y": 170, "kind": "client" }, { "id": "cache", "label": "Cache\\n(Redis)", "x": 260, "y": 80, "kind": "service" }, { "id": "db", "label": "Database", "x": 500, "y": 170, "kind": "database" }, { "id": "bus", "label": "Message\\nBus", "x": 260, "y": 280, "kind": "queue" } ], "edges": [ { "from": "client", "to": "cache", "label": "1. write" }, { "from": "cache", "to": "db", "label": "2. write-through" }, { "from": "db", "to": "bus", "label": "3. CDC event" }, { "from": "bus", "to": "cache", "label": "4. invalidate" } ], "annotations": { "cache": "Write-through: cache updated synchronously with DB. Eliminates inconsistency but adds write latency.", "db": "Source of truth. Change Data Capture (CDC) emits events on every mutation.", "bus": "Pub/Sub backbone — Kafka or Redis Streams. Fans out invalidation to all cache replicas.", "client": "Application layer. Write goes to cache first (write-through) or DB first (cache-aside invalidation)." } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Cache-Aside vs Write-Through: Which Invalidation Strategy?", "content": "**Cache-aside (lazy loading):** App writes to DB, then deletes the cache key. Next read re-populates. Simple, but has the race condition window.\\n\\n**Write-through:** App writes to cache AND DB atomically. Cache is always warm, no cold start — but writes are slower and you still need to handle distributed node invalidation." }
\`\`\`

---

## Cache Stampede: The Hidden Danger

When a popular cache key expires, dozens of simultaneous requests can all miss and hammer the database at once. This is the **cache stampede** (also called thundering herd):

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "No Stampede Protection", "code": "def get_product(product_id):\\n    data = cache.get(f'product:{product_id}')\\n    if data is None:\\n        # All 500 concurrent requests reach here simultaneously\\n        # All 500 query the database at the same time\\n        data = db.query(f'SELECT * FROM products WHERE id={product_id}')\\n        cache.set(f'product:{product_id}', data, ttl=300)\\n    return data" }, "after": { "label": "With Mutex/Probabilistic Protection", "code": "import random, math\\n\\ndef get_product(product_id, beta=1.0):\\n    key = f'product:{product_id}'\\n    entry = cache.get_with_expiry(key)  # returns (value, ttl_remaining)\\n\\n    if entry:\\n        value, ttl_remaining = entry\\n        # Probabilistic early recompute (XFetch algorithm)\\n        # Randomly refresh BEFORE expiry to avoid thundering herd\\n        recompute_time = -beta * math.log(random.random())\\n        if recompute_time > ttl_remaining:\\n            pass  # fall through to refresh\\n        else:\\n            return value  # serve from cache\\n\\n    # Use distributed lock — only ONE request refreshes\\n    with redis_lock(f'lock:{key}', timeout=5):\\n        # Double-check after acquiring lock\\n        if cached := cache.get(key):\\n            return cached\\n        data = db.query(f'SELECT * FROM products WHERE id={product_id}')\\n        cache.set(key, data, ttl=300)\\n        return data" } }
\`\`\`

---

## Practice: Fill in the Invalidation Logic

\`\`\`fillblank
{ "title": "Implement Cache-Aside Invalidation", "prompt": "Complete the write function that updates the database and correctly invalidates the cache. The cache key follows the pattern 'user:{user_id}'.", "language": "python", "template": "def update_user_profile(user_id, new_data, cache, db):\\n    # Step 1: Write to the database first\\n    db.___(f'UPDATE users SET data=? WHERE id=?', new_data, user_id)\\n\\n    # Step 2: Invalidate the cache entry\\n    cache.___(f'user:{user_id}')\\n\\n    return {'status': 'ok'}", "blanks": [ { "answer": "execute", "hint": "The standard method to run a SQL write operation" }, { "answer": "delete", "hint": "Remove the stale entry — don't update it (avoids write race conditions)" } ] }
\`\`\`

---

## Real-World Patterns by Use Case

\`\`\`tabs
{ "tabs": [ { "label": "E-Commerce", "icon": "🛒", "content": "## E-Commerce: Pricing and Inventory\\n\\n**Challenge:** Price changes must be immediately accurate. Inventory counts can tolerate brief staleness.\\n\\n**Strategy:**\\n- **Pricing:** Event-driven invalidation via CDC (Change Data Capture) from the DB. TTL of 60s as fallback.\\n- **Product recommendations:** TTL of 10–30 minutes. Stale recs are harmless.\\n- **Inventory:** Write-through caching + event invalidation. Never show 'in stock' if sold out.\\n\\n\`\`\`\\n# Tag-based invalidation for related products\\non category_update(category_id):\\n    for product_id in get_products_in_category(category_id):\\n        cache.delete(f'product:{product_id}')\\n\`\`\`" }, { "label": "Social Media", "icon": "📱", "content": "## Social Media: Feeds and Profiles\\n\\n**Challenge:** Millions of users, write-heavy workloads, eventual consistency is usually fine.\\n\\n**Strategy:**\\n- **User profiles:** TTL of 5 minutes + event-driven on explicit profile update.\\n- **Feed content:** Accept eventual consistency — a post appearing 2 seconds late is acceptable.\\n- **Follower counts, likes:** Approximate caching with periodic refresh. Users tolerate ±5% accuracy.\\n- **Auth tokens / sessions:** Immediate invalidation on logout. No TTL tolerance here.\\n\\n\`\`\`\\n# On profile picture update:\\ncache.delete(f'profile:{user_id}:avatar')   # immediate\\ncache.delete(f'profile:{user_id}:metadata') # immediate\\n# Feed caches allowed to expire naturally via TTL\\n\`\`\`" }, { "label": "Financial", "icon": "💰", "content": "## Financial Systems: Accounts and Transactions\\n\\n**Challenge:** Stale balance data = legal and trust issues.\\n\\n**Strategy:**\\n- **Account balances:** No caching, or write-through with immediate post-write invalidation.\\n- **Transaction history:** Read-only after commit — safe to cache with longer TTL (10 min).\\n- **Exchange rates:** Short TTL (30s) + event-driven. Stale rate by 1 minute = financial exposure.\\n- **Audit logs:** Never cache. Always read from database.\\n\\n\`\`\`\\n# Always invalidate balance on any transaction\\ndef post_transaction(account_id, amount):\\n    db.debit(account_id, amount)\\n    cache.delete(f'balance:{account_id}')  # mandatory\\n    event_bus.publish('balance_changed', account_id)\\n\`\`\`" } ] }
\`\`\`

---

## Common Pitfalls

\`\`\`callout
{ "type": "danger", "title": "The 5 Invalidation Pitfalls (and How to Avoid Them)", "content": "1. **Over-invalidating:** Clearing entire cache namespaces on every write destroys your hit rate. Be precise — only delete the affected keys.\\n\\n2. **Under-invalidating:** Missing a code path that writes to the DB without clearing the cache. Audit every write path.\\n\\n3. **Ignoring multi-region:** Invalidation events must reach ALL regions. A Europe cache node holding stale data after a US write is a real consistency bug.\\n\\n4. **No stampede protection:** A popular key expiring under high load = database meltdown. Always use a distributed lock or probabilistic early refresh.\\n\\n5. **Inconsistent TTLs:** Setting TTL=0 (no expiry) on mutable data means the only way data ever refreshes is explicit invalidation — and you will miss a code path eventually." }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Cache Invalidation and Consistency", "questions": [ { "question": "You have a product price cached with TTL=300s. A flash sale starts and prices drop immediately. Users see the old price for up to 5 minutes. What is the BEST fix?", "options": [ "Reduce TTL to 10 seconds for all product data", "Add event-driven invalidation that deletes the cache key when price changes in the DB", "Switch to a read-through cache pattern", "Use versioned keys for all product prices" ], "answer": 1, "explanation": "Event-driven invalidation (deleting the cache key when the DB is updated) provides near-instant consistency for critical data like pricing. Reducing TTL to 10s would help but still creates a 10-second window and increases DB load. Versioned keys work for CDN but don't solve the application cache problem here." }, { "question": "100 concurrent requests arrive for 'product:99' at the exact moment its cache entry expires. Without protection, what happens?", "options": [ "The cache returns stale data to all 100 requests", "All 100 requests query the database simultaneously, causing a stampede", "The cache automatically queues requests and only queries the DB once", "The requests are rate-limited by the cache layer" ], "answer": 1, "explanation": "This is the cache stampede (thundering herd) problem. All 100 requests see a cache miss and simultaneously hit the database. The solution is a distributed mutex lock so only one request refreshes the cache while others wait, or probabilistic early recomputation (XFetch algorithm)." }, { "question": "Which cache invalidation strategy is most appropriate for CDN-cached JavaScript bundle files that are updated on deployment?", "options": [ "TTL of 1 hour with manual CDN purge on deploy", "Event-driven invalidation via webhook to CDN", "Versioned keys / content-addressed URLs (e.g., bundle.a3f92b.js)", "Write-through caching with immediate invalidation" ], "answer": 2, "explanation": "Versioned keys (cache-busting URLs) are the standard for static assets. The file name includes a hash of the content. When the file changes, the URL changes, so old cached versions naturally become unreachable. You can set TTL to infinity on versioned assets since each version is immutable." }, { "question": "A Meta engineering blog post describes how cache inconsistency can occur even when you do everything 'correctly'. What is the root cause they identify?", "options": [ "Redis does not support atomic operations", "Caches can be populated from different upstreams at different times, and events like shard moves or network partitions can all trigger inconsistencies", "TTL values are not precise enough in distributed systems", "Write-through caching is inherently inconsistent" ], "answer": 1, "explanation": "Per the Meta engineering post, cache inconsistency is hard because caches can fill from different upstreams at different points in time, within or across regions. Events like promotions, shard moves, failure recoveries, and network partitions can all introduce bugs that lead to cache inconsistencies — even with correct application logic." }, { "question": "You implement cache-aside: write to DB, then delete the cache key. A concurrent read thread queries the DB BEFORE your write commits, then inserts the old value into the cache AFTER your delete. What is this pattern called?", "options": [ "Cache stampede", "Write-through violation", "Read-your-writes inconsistency", "The classic cache invalidation race condition" ], "answer": 3, "explanation": "This is the classic cache invalidation race condition. Thread B reads the DB mid-way through Thread A's write, then re-populates the cache with stale data after Thread A's delete. The solution is to use a short TTL as a safety net (so stale data eventually expires), or use a version/generation counter to detect and reject stale writes to the cache." } ] }
\`\`\`

---

## System Design Interview Framing

When asked about caching in a system design interview, proactively address invalidation:

\`\`\`collapse
{ "title": "Deep Dive: How to Answer Cache Invalidation in Interviews", "content": "Interviewers expect you to **proactively raise** cache invalidation — don't wait to be asked. Use this structure:\\n\\n**1. Identify data freshness requirements**\\n> \\"For product prices, we need near-instant consistency because stale prices cause customer complaints. For recommendations, 10-minute staleness is acceptable.\\"\\n\\n**2. Choose a strategy and justify it**\\n> \\"For pricing, I'll use event-driven invalidation: when the DB is written, the application publishes an invalidation event to Redis Pub/Sub, which fan-outs to all cache replicas. I'll also set a 60-second TTL as a fallback in case any invalidation event is dropped.\\"\\n\\n**3. Address the hard cases**\\n> \\"For stampede protection on hot keys, I'll use a distributed lock — only the first thread refreshes the cache, others wait behind the lock. For distributed deployments across regions, invalidation events need to reach all regional caches, so I'd use a global message bus like Kafka with regional consumer groups.\\"\\n\\n**4. Acknowledge trade-offs**\\n> \\"This adds operational complexity — a Kafka cluster, consumer group management, and monitoring for invalidation lag. The trade-off is worth it for pricing data where correctness is business-critical.\\"\\n\\n**Sample answer template:**\\n\`\`\`\\n\\"We'll cache user profiles with a 5-minute TTL using Redis. On write,\\n we delete the cache entry immediately so the next read fetches fresh data.\\n For high-traffic keys, we'll add a mutex to prevent stampedes.\\n TTL acts as a safety net if any invalidation event is missed.\\"\\n\`\`\`" }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Cache invalidation is hard because caches and databases are two separate state machines — any gap between writing one and updating the other is a window for inconsistency.", "TTL is your safety net: simple and resilient, but accepts a stale window equal to the TTL duration.", "Event-driven invalidation gives near-instant consistency by deleting cache keys when the DB changes, but requires a reliable message bus and should always be paired with a TTL fallback.", "Versioned/content-addressed keys are the gold standard for CDN and browser caches where you can't issue DELETEs to edge nodes.", "Cache stampede (thundering herd) happens when a popular key expires under load — protect with a distributed mutex lock or probabilistic early recomputation (XFetch).", "In system design interviews, proactively address invalidation strategy, consistency requirements, and stampede protection — don't wait to be asked." ] }
\`\`\``,
      starterCode: `import time
from typing import Any, Optional


class VersionedCache:
    """
    A cache that combines TTL expiration with version-based invalidation.
    When data changes, bumping the version makes all old entries unreachable
    without needing to track and delete individual keys.
    """

    def __init__(self):
        self._store = {}     # versioned_key -> (value, expires_at)
        self._versions = {}  # entity_type -> current version number

    def _versioned_key(self, entity_type: str, entity_id: str) -> str:
        # TODO: Return a cache key that embeds the current version.
        # Format: "<entity_type>:v<version>:<entity_id>"
        # Example: "user:v3:42"
        # Hint: use self._versions.get(entity_type, 1) for the version
        pass

    def get(self, entity_type: str, entity_id: str) -> Optional[Any]:
        # TODO: Build the versioned key for this entity.
        # TODO: Look it up in self._store.
        # TODO: If missing, return None (cache miss).
        # TODO: If found, check whether time.time() has passed expires_at.
        #       - If expired, delete the entry and return None.
        #       - If still valid, return the value.
        pass

    def set(self, entity_type: str, entity_id: str, value: Any, ttl: int = 60) -> None:
        # TODO: Build the versioned key.
        # TODO: Calculate expires_at = time.time() + ttl.
        # TODO: Store (value, expires_at) in self._store under the versioned key.
        pass

    def invalidate(self, entity_type: str) -> None:
        # TODO: Increment the version number for entity_type in self._versions.
        # This is the core trick: old keys (with the previous version) are now
        # unreachable — no need to hunt down and delete individual entries.
        pass

    def get_version(self, entity_type: str) -> int:
        return self._versions.get(entity_type, 1)


# --- Tests (do not modify) ---
def run_tests():
    cache = VersionedCache()

    # Test 1: Basic set and get
    cache.set("user", "42", {"name": "Alice"}, ttl=5)
    result = cache.get("user", "42")
    assert result == {"name": "Alice"}, f"Test 1 failed: {result}"
    print("Test 1 passed: Basic set/get works")

    # Test 2: TTL expiration
    cache.set("product", "99", {"price": 29.99}, ttl=1)
    time.sleep(1.1)
    result = cache.get("product", "99")
    assert result is None, f"Test 2 failed: expected None after TTL, got {result}"
    print("Test 2 passed: TTL expiration works")

    # Test 3: Version-based invalidation
    cache.set("user", "42", {"name": "Alice"}, ttl=60)
    cache.invalidate("user")  # bumps version — old entry is now unreachable
    result = cache.get("user", "42")
    assert result is None, f"Test 3 failed: expected None after invalidation, got {result}"
    print("Test 3 passed: Version-based invalidation works")

    # Test 4: New writes after invalidation use the new version
    cache.set("user", "42", {"name": "Alice v2"}, ttl=60)
    result = cache.get("user", "42")
    assert result == {"name": "Alice v2"}, f"Test 4 failed: {result}"
    print("Test 4 passed: New writes after invalidation are readable")

    # Test 5: Invalidating one type leaves others untouched
    cache.set("user", "1", {"name": "Bob"}, ttl=60)
    cache.set("product", "5", {"name": "Widget"}, ttl=60)
    cache.invalidate("user")
    assert cache.get("user", "1") is None, "Test 5a failed"
    assert cache.get("product", "5") == {"name": "Widget"}, "Test 5b failed"
    print("Test 5 passed: Invalidation is scoped to its entity type")

    print("\\nAll tests passed!")


if __name__ == "__main__":
    run_tests()
`,
      solutionCode: `import time
from typing import Any, Optional


class VersionedCache:
    """
    A cache combining two invalidation strategies:

    1. TTL (time-to-live): every entry has an expiry timestamp.
       On read, stale entries are detected and discarded.

    2. Versioned keys: the cache key for an entity encodes the
       current version number of its type.  When a write to the
       database happens, call invalidate(entity_type) to bump the
       version.  All previous cache entries become unreachable
       without scanning or deleting them individually — a clean,
       O(1) bulk invalidation.
    """

    def __init__(self):
        self._store = {}     # versioned_key -> (value, expires_at)
        self._versions = {}  # entity_type -> current version number

    def _versioned_key(self, entity_type: str, entity_id: str) -> str:
        """Build a key that embeds the live version, e.g. 'user:v3:42'."""
        version = self._versions.get(entity_type, 1)
        return f"{entity_type}:v{version}:{entity_id}"

    def get(self, entity_type: str, entity_id: str) -> Optional[Any]:
        """Return cached value, or None on miss or expiry."""
        key = self._versioned_key(entity_type, entity_id)
        entry = self._store.get(key)

        if entry is None:
            return None  # Cache miss

        value, expires_at = entry
        if time.time() > expires_at:
            # TTL expired — evict the stale entry
            del self._store[key]
            return None

        return value

    def set(self, entity_type: str, entity_id: str, value: Any, ttl: int = 60) -> None:
        """Write a value into the cache with a TTL (seconds)."""
        key = self._versioned_key(entity_type, entity_id)
        expires_at = time.time() + ttl
        self._store[key] = (value, expires_at)

    def invalidate(self, entity_type: str) -> None:
        """
        Event-driven invalidation: bump the version for this entity type.

        Old keys (e.g. 'user:v2:42') are now permanently unreachable
        because every future lookup will build 'user:v3:42' instead.
        No iteration over stored keys is needed — O(1) bulk invalidation.
        """
        current = self._versions.get(entity_type, 1)
        self._versions[entity_type] = current + 1

    def get_version(self, entity_type: str) -> int:
        return self._versions.get(entity_type, 1)


# --- Tests ---
def run_tests():
    cache = VersionedCache()

    # Test 1: Basic set and get
    cache.set("user", "42", {"name": "Alice"}, ttl=5)
    result = cache.get("user", "42")
    assert result == {"name": "Alice"}, f"Test 1 failed: {result}"
    print("Test 1 passed: Basic set/get works")

    # Test 2: TTL expiration
    cache.set("product", "99", {"price": 29.99}, ttl=1)
    time.sleep(1.1)
    result = cache.get("product", "99")
    assert result is None, f"Test 2 failed: expected None after TTL, got {result}"
    print("Test 2 passed: TTL expiration works")

    # Test 3: Version-based invalidation
    cache.set("user", "42", {"name": "Alice"}, ttl=60)
    cache.invalidate("user")  # bumps version — old entry is now unreachable
    result = cache.get("user", "42")
    assert result is None, f"Test 3 failed: expected None after invalidation, got {result}"
    print("Test 3 passed: Version-based invalidation works")

    # Test 4: New writes after invalidation use the new version
    cache.set("user", "42", {"name": "Alice v2"}, ttl=60)
    result = cache.get("user", "42")
    assert result == {"name": "Alice v2"}, f"Test 4 failed: {result}"
    print("Test 4 passed: New writes after invalidation are readable")

    # Test 5: Invalidating one type leaves others untouched
    cache.set("user", "1", {"name": "Bob"}, ttl=60)
    cache.set("product", "5", {"name": "Widget"}, ttl=60)
    cache.invalidate("user")
    assert cache.get("user", "1") is None, "Test 5a failed"
    assert cache.get("product", "5") == {"name": "Widget"}, "Test 5b failed"
    print("Test 5 passed: Invalidation is scoped to its entity type")

    print("\\nAll tests passed!")


if __name__ == "__main__":
    run_tests()
`,
    },
    {
      id: "checkpoint-caching-design",
      slug: "checkpoint-caching-design",
      title: "Checkpoint: Design a Read-Heavy News Feed Cache",
      content: `# Checkpoint: Design a Read-Heavy News Feed Cache

You've studied every layer of the caching hierarchy. Now it's time to put it all together. In this checkpoint, you'll design the caching layer for a social news feed — the kind of system powering Twitter, Instagram, or LinkedIn's home feed. No hand-holding. You reason through the requirements, make trade-off decisions, and defend your choices.

---

## The Problem Statement

Your team is scaling a social platform. The news feed service is the hottest read path in the entire system: **50 million reads per day**, with bursts reaching **10,000 requests per second** during peak hours. Users expect to see posts from people they follow, and they expect freshness — any post should appear in follower feeds **within 30 seconds** of being created.

The current architecture hits PostgreSQL on every feed request. P99 latency is 1.2 seconds. The database is on fire.

Your job: design a caching layer that fixes this.

\`\`\`concept
{ "title": "The Core Tension", "variant": "insight", "content": "Every caching decision in a news feed is a battle between two forces: freshness (users want new posts NOW) and performance (every cache miss is a database hit). The 30-second freshness SLA is not an accident — it defines exactly how aggressive your TTL strategy can be." }
\`\`\`

---

## Step 1: Clarify the Requirements

Before touching any architecture, nail down what you're actually solving. This is the skill that separates senior engineers from juniors in system design interviews.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Functional",
      "icon": "📋",
      "content": "**What the cache must serve:**\\n\\n- A user's personalized news feed (posts from accounts they follow)\\n- Individual post objects (content, author, likes count, comment count)\\n- User profile data (display name, avatar URL, follower count)\\n- Trending / algorithmic feed items\\n\\n**Write patterns:**\\n\\n- New posts created: ~500K/day (~6 writes/sec average, ~200 writes/sec peak)\\n- Like/comment counts update constantly — these are *hot counters*\\n- Users follow/unfollow accounts (relationship graph changes)"
    },
    {
      "label": "Non-Functional",
      "icon": "⚡",
      "content": "**Performance targets:**\\n\\n| Metric | Target |\\n|--------|--------|\\n| Feed read latency (P99) | < 100ms |\\n| Feed freshness | < 30 seconds |\\n| Cache hit ratio | > 95% |\\n| Peak read QPS | 10,000 rps |\\n| Availability | 99.99% |\\n\\n**Scale envelope:**\\n\\n- 50M reads/day = ~580 reads/sec average\\n- Bursts to 10K rps (17x average) — Monday mornings, breaking news events\\n- Assume 10M active users, each following ~200 accounts on average"
    },
    {
      "label": "Constraints",
      "icon": "🔒",
      "content": "**Hard constraints:**\\n\\n- Freshness SLA: 30 seconds maximum — this rules out long TTLs for feed content\\n- Per-user feeds are personalized — you cannot share a single cached response across users without care\\n- Celebrity accounts (10M+ followers) create fan-out write amplification\\n- Budget: You need a solution that scales linearly with traffic, not quadratically\\n\\n**Soft constraints:**\\n\\n- Like counts can be eventually consistent (a few seconds lag is acceptable)\\n- Trending feed can tolerate 60-second staleness\\n- Profile data can be cached for 5 minutes"
    }
  ]
}
\`\`\`

---

## Step 2: Estimate the Cache Size

Back-of-envelope math is a core system design skill. Let's size the cache before choosing technology.

\`\`\`concept
{ "title": "Cache Sizing Formula", "variant": "rule", "content": "Working set size = (objects in hot tier) × (average object size). Aim to fit the working set in memory. Objects accessed in the last 24 hours are your hot tier — not everything in the database." }
\`\`\`

**Feed objects:**
- Average feed page: 20 posts, each ~2 KB (text + metadata, no media blobs) = **40 KB per feed page**
- Active users requesting feeds in a 30-second window: assume 1% of 10M = 100K concurrent users
- Feed cache working set: 100K × 40 KB = **4 GB**

**Post objects:**
- Posts created per day: 500K
- Average post: 1 KB
- Keep 7 days hot: 3.5M posts × 1 KB = **3.5 GB**

**Profile objects:**
- 10M users × 500 bytes = **5 GB** (but TTL 5 min, cold profiles evict quickly — real working set ~500 MB)

**Total estimated Redis working set: ~10–15 GB** — easily fits in a single large Redis node, or a small Redis Cluster across 3 nodes.

---

## Step 3: Choose Your Caching Architecture

\`\`\`concept
{ "title": "Pre-computation vs. On-Demand", "variant": "mental-model", "content": "Two schools of thought for feed caching:\\n\\n**Fan-out on write (push model):** When a user posts, immediately push that post into every follower's cached feed. Reads are instant — the feed is pre-built. Writes are expensive for celebrities.\\n\\n**Fan-out on read (pull model):** When a user requests their feed, compute it by merging the last N posts from each followed account. Writes are cheap. Reads are expensive.\\n\\nFor a read-heavy system at 10K rps, push model wins — but you need a hybrid for celebrity accounts." }
\`\`\`

\`\`\`steps
{
  "title": "Designing the Three-Layer Cache",
  "steps": [
    {
      "title": "Layer 1 — CDN Edge Cache (Static Assets Only)",
      "content": "**What to cache:** User avatars, post images, video thumbnails — static media assets.\\n\\n**What NOT to cache:** The feed API response itself. Feeds are personalized per user, so CDN caching the \`/api/feed\` endpoint would require a unique cache key per user ID — killing the cache hit ratio and wasting CDN capacity.\\n\\n**TTL:** 24 hours for images (content-addressed URLs), 5 minutes for user profile images.\\n\\n**Technology:** CloudFront, Fastly, or Cloudflare. Origin is your object store (S3 or equivalent)."
    },
    {
      "title": "Layer 2 — Redis Cluster (Feed + Post Cache)",
      "content": "**This is your primary cache.** Three data structures, three purposes:\\n\\n**1. Feed lists (Sorted Set by timestamp):**\\n\`\`\`\\nKey:   feed:{userId}\\nType:  Redis Sorted Set\\nScore: Unix timestamp (for ordering)\\nValue: postId\\nTTL:   30 seconds (matches freshness SLA)\\n\`\`\`\\n\\n**2. Post objects (Hash):**\\n\`\`\`\\nKey:   post:{postId}\\nType:  Redis Hash\\nFields: authorId, content, timestamp, likeCount, commentCount\\nTTL:   5 minutes\\n\`\`\`\\n\\n**3. User profiles (Hash):**\\n\`\`\`\\nKey:   user:{userId}\\nType:  Redis Hash\\nFields: displayName, avatarUrl, followerCount\\nTTL:   5 minutes\\n\`\`\`\\n\\n**Cluster topology:** 3 primary nodes, 3 replicas. Shard by \`{userId}\` hash slot. This ensures one user's feed data always lands on the same shard — enabling atomic operations."
    },
    {
      "title": "Layer 3 — Application-Level Cache (Local In-Process)",
      "content": "**What:** A small in-memory LRU cache within each API server process (e.g., 256 MB using a library like \`node-lru-cache\` or Caffeine in Java).\\n\\n**Why:** Even Redis adds ~1ms network round-trip. For the hottest objects — trending post IDs, viral post content — shaving that millisecond matters at 10K rps.\\n\\n**What to cache locally:** \\n- Trending feed (same for all users) — cache 60 seconds\\n- Viral posts with >100K likes — cache 30 seconds\\n- Feature flags and configuration\\n\\n**Cache invalidation:** Since local cache is per-process, use a short TTL (30–60 seconds) rather than active invalidation. Slightly stale viral post content is acceptable. Never store per-user data in the local cache — it won't be shared and wastes memory."
    }
  ]
}
\`\`\`

---

## Step 4: The Cache Invalidation Strategy

Cache invalidation is where most caching designs fall apart. Here's how to handle each data type.

\`\`\`concept
{ "title": "Phil Karlton's Famous Observation", "variant": "analogy", "content": "\\"There are only two hard things in Computer Science: cache invalidation and naming things.\\" — For a news feed, cache invalidation is the entire design problem. The 30-second freshness SLA is really just a bounded tolerance for stale cache data." }
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "New Post Created",
      "icon": "✍️",
      "content": "**Event:** User A creates a new post.\\n\\n**Strategy: Fan-out on write (with celebrity bypass)**\\n\\n1. Post-creation service writes post to PostgreSQL\\n2. Publishes event to message queue (Kafka topic: \`post.created\`)\\n3. **Feed Fanout Worker** consumes the event:\\n   - For regular users (< 10K followers): push \`postId\` into each follower's \`feed:{followerId}\` Redis Sorted Set\\n   - For celebrities (> 10K followers): **skip feed cache**. Their posts are fetched on read and merged dynamically\\n4. Feed entries expire via TTL (30 seconds). New entries from fanout reset the TTL naturally.\\n\\n**Why skip celebrities on write?** A user with 5M followers would require 5M Redis writes on every post — a thundering herd that could take minutes and consume all Redis write capacity."
    },
    {
      "label": "Post Updated/Deleted",
      "icon": "🗑️",
      "content": "**Event:** User edits or deletes a post.\\n\\n**Strategy: Explicit cache-aside invalidation**\\n\\n1. Write the update to PostgreSQL (authoritative source of truth)\\n2. Immediately call \`DEL post:{postId}\` on Redis\\n3. The next read will be a cache miss — fetches from DB and repopulates\\n4. Feed Sorted Sets still contain the postId, but the post hash fetch will trigger a DB read\\n\\n**Why not update the post in cache?** Post edits are infrequent. The complexity of maintaining consistency across all feed entries that reference the post outweighs the cost of a cache miss on the next read.\\n\\n**Deletion edge case:** After \`DEL post:{postId}\`, write a tombstone key: \`post:{postId}:deleted = 1\` with TTL 5 minutes. This prevents thundering herd on deleted posts where many users simultaneously trigger DB reads that all return \\"not found\\"."
    },
    {
      "label": "Like / Comment Count",
      "icon": "❤️",
      "content": "**Event:** A user likes a post (high-frequency writes — potentially thousands per second for viral content).\\n\\n**Strategy: Cache-native counters, NOT write-through**\\n\\nThe counter IS the cache — use Redis atomic increments:\\n\\n\`\`\`\\nHINCRBY post:{postId} likeCount 1\\n\`\`\`\\n\\nThis is atomic, single-RTT, and avoids a read-modify-write cycle.\\n\\n**Persistence:** A background worker reads Redis counters and flushes to PostgreSQL every 5 seconds. This is **write-behind caching** — the DB is eventually consistent with the cache.\\n\\n**Why not write-through?** At 1000 likes/second on a viral post, writing every like synchronously to Postgres would generate 1000 write TPS on a single row — causing lock contention and replication lag. The 5-second flush gives eventual consistency while protecting the database."
    },
    {
      "label": "User Unfollow",
      "icon": "➖",
      "content": "**Event:** User B unfollows User A.\\n\\n**Strategy: Lazy invalidation**\\n\\n1. Update the relationship table in PostgreSQL\\n2. **Do NOT immediately rebuild User B's feed cache.** The TTL is 30 seconds — the stale feed entry will expire on its own.\\n3. The next feed request after the TTL will recompute the feed excluding User A's posts.\\n\\n**Edge case — unfollow and re-request within 30 seconds:**\\n\\nIf User B unfollows User A and immediately refreshes their feed (within the 30-second TTL window), they might still see User A's posts. This is acceptable per the freshness SLA. If stricter behavior is required, explicitly delete \`feed:{userId}\` on unfollow and accept the miss cost."
    }
  ]
}
\`\`\`

---

## Step 5: Handling the Celebrity Problem

This is the hardest part of news feed caching, and interviewers love it.

\`\`\`concept
{ "title": "The Fan-Out Amplification Problem", "variant": "mental-model", "content": "When Elon Musk tweets, Twitter needs to update feeds for 150M+ followers. Fan-out on write would require 150M Redis writes in seconds — impossible. The solution is a **hybrid fan-out**: push to regular users, pull for celebrity content on read, and merge at serve time." }
\`\`\`

\`\`\`sysdiag
{
  "title": "Hybrid Fan-Out Architecture",
  "width": 700,
  "height": 380,
  "nodes": [
    { "id": "post", "label": "Post Created", "x": 60, "y": 190, "kind": "client" },
    { "id": "queue", "label": "Kafka\\npost.created", "x": 200, "y": 190, "kind": "queue" },
    { "id": "fanout", "label": "Fanout\\nWorker", "x": 370, "y": 100, "kind": "service" },
    { "id": "redis", "label": "Redis\\nFeed Cache", "x": 560, "y": 100, "kind": "database" },
    { "id": "celebrity", "label": "Celebrity\\nPost Store", "x": 560, "y": 280, "kind": "database" },
    { "id": "feedsvc", "label": "Feed\\nService", "x": 370, "y": 280, "kind": "service" },
    { "id": "merge", "label": "Feed\\nMerger", "x": 560, "y": 190, "kind": "service" }
  ],
  "edges": [
    { "from": "post", "to": "queue", "label": "publish" },
    { "from": "queue", "to": "fanout", "label": "consume" },
    { "from": "fanout", "to": "redis", "label": "push (regular users)" },
    { "from": "fanout", "to": "celebrity", "label": "store (celebrity posts)" },
    { "from": "feedsvc", "to": "redis", "label": "read feed list" },
    { "from": "feedsvc", "to": "merge", "label": "merge request" },
    { "from": "merge", "to": "redis", "label": "fetch pre-built feed" },
    { "from": "merge", "to": "celebrity", "label": "fetch celebrity posts" }
  ],
  "annotations": {
    "fanout": "Routes writes: if author follower count > 10K threshold, writes to Celebrity Post Store instead of fanning out to each follower's feed",
    "merge": "On read, merges user's pre-built feed (from Redis) with latest celebrity posts from the celebrity store, then sorts by timestamp",
    "celebrity": "Separate Redis structure: celebrity:{authorId} Sorted Set of recent postIds. One write per post, N reads — inverted from fan-out"
  }
}
\`\`\`

---

## Step 6: Cache Warming and Thundering Herd Prevention

Two failure modes that kill caching systems in production.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Thundering Herd",
      "icon": "🐃",
      "content": "**The problem:** Your feed cache TTL is 30 seconds. 50K users all have their feed expire at the same second (because the service was deployed and all TTLs started simultaneously). 50K cache misses hit the database simultaneously.\\n\\n**Solution 1: TTL Jitter**\\n\\nAdd random jitter to TTLs:\\n\`\`\`\\nTTL = BASE_TTL + random(0, JITTER)\\nfeed TTL = 25 + random(0, 10)  # 25–35 seconds\\npost TTL = 270 + random(0, 60) # 4.5–5.5 minutes\\n\`\`\`\\n\\n**Solution 2: Probabilistic Early Recomputation (PER)**\\n\\nBefore the TTL expires, with probability proportional to how close the TTL is to zero, proactively recompute the cache in a background thread. The Fetch-Or-Recompute pattern:\\n\`\`\`python\\ndef get_feed(user_id):\\n    cached, ttl = redis.get_with_ttl(f\\"feed:{user_id}\\")\\n    if cached and ttl > EARLY_RECOMPUTE_THRESHOLD:\\n        return cached  # Fast path\\n    if cached and random() < recompute_probability(ttl):\\n        # Async recompute, return stale for now\\n        asyncio.create_task(recompute_feed(user_id))\\n        return cached\\n    return recompute_feed(user_id)  # Synchronous on miss\\n\`\`\`"
    },
    {
      "label": "Cache Warming",
      "icon": "🔥",
      "content": "**The problem:** After a deployment or Redis restart, the cache is empty. All reads are cache misses. The database gets hammered until the cache fills — which can take minutes during which latency is terrible.\\n\\n**Solution: Proactive cache warming**\\n\\n1. **Pre-deploy warm-up script:** Before routing traffic to new instances, run a script that loads the 10K most-active users' feeds into Redis from the database.\\n\\n2. **Traffic shadowing:** New Redis nodes receive a copy of all writes for 5 minutes before taking live traffic — they fill organically without a cold-start miss burst.\\n\\n3. **Graceful degradation:** If Redis is unreachable, fall back to direct PostgreSQL reads but with a circuit breaker — don't hammer the DB, return a degraded feed of the user's own posts only.\\n\\n\`\`\`\\nGET /api/feed/{userId}\\n  → Redis hit: serve cached feed  ✅\\n  → Redis miss: compute from DB, cache result  ⚠️ (slow, once)\\n  → Redis down: circuit breaker → degraded feed  🔴 (graceful)\\n  → DB also down: return cached stale feed from local process cache  🚨 (last resort)\\n\`\`\`"
    }
  ]
}
\`\`\`

---

## Step 7: Monitoring and Measuring Cache Health

A cache you can't measure is a cache you can't trust.

\`\`\`callout
{ "type": "info", "title": "The Metrics You Must Track", "content": "**Cache hit ratio** — Target >95%. If this drops below 90%, your TTL may be too short or your key space too large.\\n\\n**Cache miss latency** — How long does a miss take (DB round-trip)? Alert if P99 miss latency exceeds 500ms.\\n\\n**Eviction rate** — If Redis is evicting keys due to memory pressure, your working set is larger than estimated. Scale up Redis or tighten TTLs.\\n\\n**Replication lag** — Redis replica lag indicates write pressure. If lag exceeds 1 second, your fanout worker is overloaded.\\n\\n**Key space size** — Track \`feed:*\` and \`post:*\` key counts. Unexpected growth means a TTL bug or an infinite feed accumulation issue." }
\`\`\`

---

## The Architecture at a Glance

\`\`\`sysdiag
{
  "title": "Complete News Feed Cache Architecture",
  "width": 720,
  "height": 420,
  "nodes": [
    { "id": "client", "label": "Mobile / Web\\nClient", "x": 50, "y": 210, "kind": "client" },
    { "id": "cdn", "label": "CDN\\n(Media Assets)", "x": 180, "y": 100, "kind": "service" },
    { "id": "api", "label": "Feed API\\nServers", "x": 300, "y": 210, "kind": "service" },
    { "id": "local", "label": "Local LRU\\nCache (256MB)", "x": 300, "y": 310, "kind": "service" },
    { "id": "redis", "label": "Redis Cluster\\n(Feed + Posts)", "x": 470, "y": 140, "kind": "database" },
    { "id": "celeb", "label": "Celebrity\\nPost Store", "x": 470, "y": 280, "kind": "database" },
    { "id": "db", "label": "PostgreSQL\\n(Source of Truth)", "x": 620, "y": 210, "kind": "database" },
    { "id": "kafka", "label": "Kafka\\n(Event Bus)", "x": 620, "y": 350, "kind": "queue" }
  ],
  "edges": [
    { "from": "client", "to": "cdn", "label": "media" },
    { "from": "client", "to": "api", "label": "feed request" },
    { "from": "api", "to": "local", "label": "check L1" },
    { "from": "api", "to": "redis", "label": "check L2" },
    { "from": "api", "to": "celeb", "label": "celebrity posts" },
    { "from": "api", "to": "db", "label": "on miss" },
    { "from": "db", "to": "kafka", "label": "CDC events" },
    { "from": "kafka", "to": "redis", "label": "invalidation" }
  ],
  "annotations": {
    "api": "Checks L1 local cache first (trending/viral). Falls through to Redis L2. Falls through to PostgreSQL on miss. Merges regular feed + celebrity posts before returning.",
    "redis": "3-node cluster, sharded by userId. Stores: feed Sorted Sets (TTL 30s), post Hashes (TTL 5min), user Hashes (TTL 5min), counter keys (no TTL, async flush).",
    "kafka": "Change Data Capture (CDC) events trigger fanout worker for new posts, explicit DEL for updates/deletes."
  }
}
\`\`\`

---

## Quiz: Test Your Design Decisions

\`\`\`quiz
{
  "title": "News Feed Cache Design",
  "questions": [
    {
      "question": "A user with 8 million followers creates a post. Your fanout worker threshold is 10K followers. What happens to this post in the cache?",
      "options": [
        "The post is pushed into all 8 million followers' feed Sorted Sets in Redis",
        "The post is skipped entirely — no caching occurs",
        "The post is stored in the Celebrity Post Store and merged on read for each follower",
        "The post is only cached in the CDN edge layer"
      ],
      "answer": 2,
      "explanation": "Because this author has 8M followers (exceeding the 10K threshold), the fanout worker writes the post to a Celebrity Post Store (a separate Redis Sorted Set per author). When followers request their feed, the Feed Merger dynamically fetches and merges celebrity posts at read time. This avoids 8M Redis writes per post while still serving content quickly."
    },
    {
      "question": "Your Redis feed cache TTL is 30 seconds (matching the freshness SLA). You deploy a new version of the feed service and all 50K active users' cache entries expire simultaneously 30 seconds later. What failure mode is this and how do you prevent it?",
      "options": [
        "Cache stampede — prevent with read-through caching",
        "Thundering herd — prevent with TTL jitter and probabilistic early recomputation",
        "Cache pollution — prevent with LRU eviction policy",
        "Hot partition — prevent by resharding the Redis cluster"
      ],
      "answer": 1,
      "explanation": "This is a thundering herd (also called cache stampede). When TTLs are synchronized, all entries expire together, flooding the database with simultaneous cache misses. TTL jitter randomizes expiry times across a window (e.g., 25–35 seconds instead of exactly 30), spreading the miss load. Probabilistic early recomputation additionally proactively refreshes entries before they expire, reducing miss bursts further."
    },
    {
      "question": "A post receives 50,000 likes in one minute (it went viral). You want to cache the like count. Which strategy is correct?",
      "options": [
        "Write-through: update both Redis and PostgreSQL synchronously on every like",
        "Cache-aside: invalidate the post cache on every like, forcing a DB read",
        "Cache-native counters: use HINCRBY in Redis atomically, flush to PostgreSQL every 5 seconds",
        "No caching: counters must always read from PostgreSQL for accuracy"
      ],
      "answer": 2,
      "explanation": "Redis atomic HINCRBY is purpose-built for this pattern. 50K likes/minute = ~833 writes/second. Writing every like synchronously to PostgreSQL would generate 833 row-level writes/second to a single row, causing severe lock contention. Using Redis as the counter store and asynchronously flushing to PostgreSQL every 5 seconds gives you atomic, high-throughput increment operations with eventual consistency — perfectly acceptable for like counts."
    },
    {
      "question": "Your cache hit ratio drops from 97% to 78% after a product change that adds 5 new post types to the feed. What is the most likely root cause?",
      "options": [
        "Redis is running out of memory and evicting keys",
        "The new post types have different cache key formats, causing cache misses on all new-type posts",
        "The CDN is not caching the new post media correctly",
        "PostgreSQL replication lag is preventing cache population"
      ],
      "answer": 1,
      "explanation": "When new post types are introduced without updating cache key schemes or pre-populating the cache, all requests for those post types are cache misses until the system warms up. Additionally, if the new post types generate significantly more unique cache keys (e.g., if they include dynamic rendering data), the working set grows beyond the TTL window, reducing effective hit ratio. The fix: update cache key patterns and run a warm-up script for the new post type data before enabling the feature for all users."
    },
    {
      "question": "What is the main reason NOT to cache the feed API response at the CDN level (e.g., as CloudFront serves a cached \`/api/feed\` response)?",
      "options": [
        "CDNs cannot cache JSON responses, only static files",
        "Feeds are personalized per user, so CDN cache keys would need to include userId, resulting in near-zero hit ratios",
        "CDN caching would violate the 30-second freshness SLA",
        "CDN caching increases latency for API responses compared to direct Redis access"
      ],
      "answer": 1,
      "explanation": "CDN caching works by sharing one cached copy across many users. A news feed is personalized — User A's feed is completely different from User B's. If you cache by userId, you get one CDN entry per user, which means no reuse and the CDN becomes an expensive proxy with no benefit. CDN caching is appropriate for assets shared across users: images, videos, static HTML/CSS/JS, and public API responses that are identical for all callers."
    }
  ]
}
\`\`\`

---

## Trade-Off Analysis

Every design decision in this system involves trade-offs. Here are the three most important.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Fan-Out on Read (Pull Model)",
    "code": "On every feed request:\\n1. Fetch user's follow list from DB (~200 accounts)\\n2. Query last N posts per followed account\\n3. Merge and sort 200 × N posts in memory\\n4. Return top 20\\n\\nWrite cost:  O(1) — just write the post\\nRead cost:   O(follows × posts) — expensive\\nFreshness:   Perfect — always live data\\nCelebrity:   Handled naturally (same O(1) write)"
  },
  "after": {
    "label": "Fan-Out on Write (Push Model + Hybrid)",
    "code": "On post creation:\\n1. Fanout worker pushes postId to each follower's\\n   feed cache (skip if author is celebrity)\\n\\nOn feed request:\\n1. Read pre-built feed list from Redis  O(1)\\n2. Fetch post objects from Redis        O(n)\\n3. Merge with celebrity posts           O(c)\\n4. Return top 20\\n\\nWrite cost:  O(followers) for regular users\\nRead cost:   O(1) — pre-built\\nFreshness:   Bounded by TTL (30s acceptable)\\nCelebrity:   Handled by hybrid merge on read"
  }
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "When to Use Each Model", "content": "**Fan-out on write** wins when reads >> writes (news feeds, social timelines). **Fan-out on read** wins when writes >> reads, or when most users are celebrities (everyone has millions of followers — not a realistic scenario for most platforms). A production news feed system at Facebook/Twitter scale uses a **hybrid**: push model for regular users, pull model for high-follower accounts, merged at read time." }
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A news feed cache is a three-layer system: CDN for media assets, Redis Cluster for feeds and posts, and a local in-process LRU for trending/viral content.",
    "The freshness SLA (30 seconds) directly determines your TTL strategy — it is both a constraint and a gift, giving you permission to serve slightly stale data.",
    "Celebrity accounts require a hybrid fan-out strategy: push to regular followers' feed caches on write, store celebrity posts separately and merge them on read.",
    "Hot counters (likes, comments) should use Redis atomic increments (HINCRBY) as the primary store, with asynchronous flush to PostgreSQL — never write every counter update synchronously to the database.",
    "Thundering herd after deploys is prevented by TTL jitter (randomize expiry windows) and probabilistic early recomputation (proactively refresh before TTL hits zero).",
    "Cache hit ratio, eviction rate, miss latency, and replication lag are the four metrics that tell you whether your cache is healthy — instrument all of them before going to production."
  ]
}
\`\`\`

---

\`\`\`callout
{ "type": "success", "title": "Module Complete", "content": "You've designed a production-grade caching layer for a read-heavy news feed. You can now reason through multi-layer cache hierarchies, fan-out trade-offs, TTL strategies, and failure modes — the exact skills tested in system design interviews at top-tier companies. In the next module, you'll apply these same principles to a different read pattern: designing the caching layer for a global search autocomplete system." }
\`\`\``,
    },
  ],
};
