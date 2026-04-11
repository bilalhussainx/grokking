import { Module } from "../types";

export const fundamentalsModule: Module = {
  id: "sd-fundamentals",
  title: "System Design Fundamentals",
  description: "Core building blocks every system designer needs: scaling, load balancing, caching, databases, and networking.",
  lessons: [
    {
      id: "sd-fund-1",
      slug: "introduction-to-system-design",
      title: "Introduction to System Design",
      content: `# Introduction to System Design

## Why System Design Matters

Every large-scale application you use daily — search engines, social networks, messaging apps — is backed by a carefully architected distributed system. System design is the discipline of defining the architecture, components, and data flow of these systems so they can handle millions of users reliably.

In engineering interviews, system design rounds evaluate whether you can think beyond a single function and reason about an entire product at scale. Unlike coding problems, there is no single correct answer — interviewers want to see your **thought process**, your ability to make **trade-offs**, and how well you communicate technical decisions.

\`\`\`concept
{
  "title": "System Design vs. Coding Interviews",
  "variant": "insight",
  "content": "Coding interviews test if you can solve a well-defined problem with an optimal algorithm. System design interviews test if you can define the problem itself, then architect a solution that balances competing constraints like cost, performance, and reliability. Both are essential — but system design is where you demonstrate strategic thinking."
}
\`\`\`

## A Framework for Design Problems

Use this four-step framework every time you approach a design question:

### Step 1 — Clarify Requirements (3-5 min)
Ask questions. Separate **functional requirements** (what the system does) from **non-functional requirements** (how well it does it — latency, availability, consistency). Pin down the scope so you and your interviewer agree on what you are designing.

### Step 2 — Back-of-Envelope Estimation (3-5 min)
Estimate scale: daily active users, requests per second, storage per year. These numbers drive every architectural choice you make later.

### Step 3 — High-Level Design (10-15 min)
Draw the major components: clients, load balancers, application servers, databases, caches, queues. Show how data flows through the system for the most important use cases.

\`\`\`sysdiag
{
  "title": "Typical Web Service Architecture",
  "width": 640,
  "height": 320,
  "nodes": [
    { "id": "client", "label": "Client", "x": 80, "y": 160, "kind": "user" },
    { "id": "lb", "label": "Load Balancer", "x": 200, "y": 160, "kind": "service" },
    { "id": "app", "label": "App Server", "x": 320, "y": 160, "kind": "service" },
    { "id": "cache", "label": "Cache (Redis)", "x": 440, "y": 100, "kind": "store" },
    { "id": "db", "label": "Database", "x": 440, "y": 220, "kind": "store" }
  ],
  "edges": [
    { "from": "client", "to": "lb", "label": "HTTP" },
    { "from": "lb", "to": "app", "label": "route" },
    { "from": "app", "to": "cache", "label": "read/write" },
    { "from": "app", "to": "db", "label": "write" },
    { "from": "cache", "to": "db", "label": "miss" }
  ],
  "annotations": {
    "lb": "Distributes traffic across multiple app servers for availability and scale.",
    "cache": "Speeds up reads and reduces database load. Must handle cache misses gracefully.",
    "db": "Single source of truth. Often replicated for durability and availability."
  }
}
\`\`\`

### Step 4 — Deep Dive (10-15 min)
Pick the hardest parts and zoom in. Discuss data models, API contracts, sharding strategies, failure modes, and how you would monitor the system in production.

\`\`\`quiz
{
  "title": "Framework Checkpoint",
  "questions": [
    {
      "question": "Which activity belongs to Step 1 (Clarify Requirements)?",
      "options": [
        "Estimating 1 M DAU → 12 RPS",
        "Asking if the feed must be real-time",
        "Sketching Redis cache layer",
        "Proposing SQL vs. NoSQL"
      ],
      "answer": 1,
      "explanation": "Asking about real-time constraints clarifies a non-functional requirement (latency), which is the goal of Step 1."
    },
    {
      "question": "Why do we estimate scale before drawing components?",
      "options": [
        "To pick colors for the diagram",
        "To choose appropriate technologies and numbers of boxes",
        "To satisfy the interviewer’s checklist",
        "To shorten the deep-dive section"
      ],
      "answer": 1,
      "explanation": "Knowing RPS, storage, and user counts directly influences how many servers, how much memory, what DB type, etc."
    },
    {
      "question": "In the high-level diagram, which component usually sits closest to the client?",
      "options": ["Database", "Cache", "Load Balancer", "Message Queue"],
      "answer": 2,
      "explanation": "The load balancer is the first hop inside your infrastructure, routing client requests to healthy application servers."
    }
  ]
}
\`\`\`

## Common Estimation Shortcuts

Keep these handy for back-of-envelope math:

- 1 day ≈ 100,000 seconds (86,400 exactly)
- 1 million requests/day ≈ ~12 requests/second
- 1 character (UTF-8 English) ≈ 1 byte
- 1 average tweet-length string ≈ 280 bytes
- 1 photo (compressed) ≈ 200 KB – 1 MB
- SSD random read ≈ 0.1 ms; HDD ≈ 10 ms
- Round-trip within a data center ≈ 0.5 ms; cross-continent ≈ 150 ms

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Request-Per-Second Estimator",
  "inputs": [
    { "id": "daily", "label": "Daily Active Users", "default": 1000000, "min": 1, "max": 1000000000 },
    { "id": "reqPerUser", "label": "Requests per User per Day", "default": 10, "min": 1, "max": 1000 }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Interview Hack",
  "content": "Round 86,400 s/day to 100,000 to keep mental math simple. 1 M requests/day ÷ 100 k ≈ 10 RPS; add 20% for peak → 12 RPS. Interviewers care that you can approximate quickly, not that you carry a calculator."
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "System design is about **trade-offs**, not perfect answers.",
    "Always start by clarifying requirements and estimating scale.",
    "Use the four-step framework: Requirements → Estimation → High-Level Design → Deep Dive.",
    "Non-functional requirements (latency, throughput, durability) shape your architecture more than features do.",
    "Practice communicating your decisions out loud — clarity matters as much as correctness."
  ]
}
\`\`\``,
    },
    {
      id: "sd-fund-2",
      slug: "scaling-vertical-vs-horizontal",
      title: "Scaling: Vertical vs Horizontal",
      content: `# Scaling: Vertical vs Horizontal

When traffic spikes, a single server eventually hits its limits. There are two fundamental strategies to handle more load: **vertical scaling** (scale up) and **horizontal scaling** (scale out). Each path changes your architecture—and your team's daily work—in very different ways.

\`\`\`concept
{
  "title": "The Scaling Dilemma",
  "variant": "mental-model",
  "content": "Think of vertical scaling as upgrading a single delivery truck to a semi-trailer, while horizontal scaling is adding more identical vans to the fleet. One gives you brute force; the other gives you redundancy and elasticity."
}
\`\`\`

## Vertical Scaling (Scale Up)

Add more power to the *same* box—more CPU cores, more RAM, faster NVMe disks. Nothing else in your code or deployment changes.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Pros",
    "code": "- Zero code changes\\n- No network hops or sharding logic\\n- One node to monitor & back up"
  },
  "after": {
    "label": "Cons",
    "code": "- Hard ceiling: even the biggest instance tops out\\n- Single point of failure: one crash = total outage\\n- Cost curve is exponential: 2× hardware often costs 3×"
  }
}
\`\`\`

**When it makes sense**
- Early-stage products with unpredictable load
- Databases that are hard to partition (e.g., ACID RDBMS)
- Workloads that need micro-second access to a large shared memory space (in-memory caches, real-time analytics)

## Horizontal Scaling (Scale Out)

Add more *commodity* machines and distribute work across them. A load balancer becomes the front-door traffic cop.

\`\`\`sysdiag
{
  "title": "Horizontal Setup",
  "width": 600,
  "height": 260,
  "nodes": [
    { "id": "lb", "label": "Load Balancer", "x": 300, "y": 60, "kind": "gateway" },
    { "id": "s1", "label": "App-1", "x": 150, "y": 180, "kind": "service" },
    { "id": "s2", "label": "App-2", "x": 300, "y": 180, "kind": "service" },
    { "id": "s3", "label": "App-3", "x": 450, "y": 180, "kind": "service" }
  ],
  "edges": [
    { "from": "lb", "to": "s1", "label": "req" },
    { "from": "lb", "to": "s2", "label": "req" },
    { "from": "lb", "to": "s3", "label": "req" }
  ],
  "annotations": {
    "lb": "Distributes requests round-robin or by load",
    "s1": "Stateless service; any node can handle any request"
  }
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Distributed Complexity Tax",
  "content": "Horizontal scaling is not free. You now need service discovery, consensus for leader election, idempotent APIs, and distributed tracing to answer the question \\"where did my request go?\\""
}
\`\`\`

**When it makes sense**
- Stateless web/API tiers
- Read-heavy workloads (add read replicas)
- Large-scale storage that can be sharded by customer-ID or geography

## Decision Algorithm

\`\`\`steps
{
  "title": "Which Way First?",
  "steps": [
    {
      "title": "1. Check the ceiling",
      "content": "Can a single box 10× larger than today's handle projected peak? If yes, scale vertically and move on."
    },
    {
      "title": "2. Measure the risk",
      "content": "Does the business tolerate 5-15 min downtime if that box dies? If not, start replicating—even if the second node is smaller."
    },
    {
      "title": "3. Forecast cost",
      "content": "Plot cost vs. throughput for both paths. Vertical lines bend upward exponentially; horizontal lines stay linear but add engineering payroll."
    },
    {
      "title": "4. Plan the cut-over",
      "content": "Stateful tiers (databases) usually scale up first, then out via read replicas, then partition. Stateless tiers can scale out on day one."
    }
  ]
}
\`\`\`

## Practical Reality

Most production systems use **both** strategies. A typical evolution:

1. Single powerful server (vertical)
2. Add read replicas (horizontal reads)
3. Shard or partition the primary (horizontal writes)
4. Keep vertical headroom on each shard to absorb daily spikes

\`\`\`quiz
{
  "title": "Quick Check",
  "questions": [
    {
      "question": "Your e-commerce startup runs on one r5.4xlarge RDS instance. Traffic doubles overnight. Which is the fastest mitigation?",
      "options": [
        "Rewrite the app for sharding",
        "Click 'Modify Instance' and upgrade to r5.8xlarge",
        "Deploy a Kubernetes cluster across three AZs",
        "Add Redis"
      ],
      "answer": 1,
      "explanation": "Vertical scaling requires zero code changes and is instant for managed databases—perfect for an emergency."
    },
    {
      "question": "Which drawback is UNIQUE to vertical scaling?",
      "options": [
        "Higher dollar cost",
        "Single point of failure",
        "Network latency between nodes",
        "Complex load-balancer config"
      ],
      "answer": 1,
      "explanation": "Only vertical scaling relies on a single physical node; lose it and you lose everything."
    },
    {
      "question": "You horizontally scale a stateful service but see uneven load. What is the most likely cause?",
      "options": [
        "CPU thermal throttling",
        "Uneven partition/key distribution",
        "BGP routing issues",
        "SSL handshake latency"
      ],
      "answer": 1,
      "explanation": "Hot shards or partitions that receive disproportionate traffic are the classic symptom of poor key-space design."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Vertical scaling buys time with simplicity; horizontal scaling buys capacity with complexity.",
    "Stateless services scale out easily; stateful services scale up first, then partition.",
    "Real-world systems blend both: scale vertically until marginal cost exceeds marginal benefit, then scale horizontally.",
    "Always model the risk of a single node—your biggest server is also your biggest liability."
  ]
}
\`\`\``,
    },
    {
      id: "sd-fund-3",
      slug: "load-balancing",
      title: "Load Balancing",
      content: `# Load Balancing

A load balancer sits between clients and a pool of servers, distributing incoming requests so that no single server becomes a bottleneck.

\`\`\`concept
{"title": "What a Load Balancer Actually Does", "variant": "mental-model", "content": "Think of a load balancer as a smart traffic cop at a busy intersection. Instead of letting all cars (requests) pile up on one road (server), it continuously waves them toward the least congested route. It also checks each road for accidents (health checks) and instantly reroutes traffic if one becomes blocked."}
\`\`\`

## Why Load Balancers?

Without a load balancer, all traffic hits a single server. When that server is overloaded or fails, users see errors. A load balancer provides three things:

1. **Even distribution** of requests across servers.
2. **Health checking** — automatically removes unhealthy servers from the pool.
3. **Horizontal scalability** — you can add or remove servers behind the balancer without clients noticing.

\`\`\`algoviz
{"title": "Round Robin in Action", "type": "array", "data": ["Request 1", "Request 2", "Request 3", "Request 4", "Request 5"], "frames": [{"highlight": [0], "label": "Request 1 → Server A", "stats": {"nextServer": 1}}, {"highlight": [1], "label": "Request 2 → Server B", "stats": {"nextServer": 2}}, {"highlight": [2], "label": "Request 3 → Server C", "stats": {"nextServer": 0}}, {"highlight": [3], "label": "Request 4 → Server A (cycle restarts)", "stats": {"nextServer": 1}}, {"highlight": [4], "label": "Request 5 → Server B", "stats": {"nextServer": 2}}], "speed": 1000}
\`\`\`

## Architecture

\`\`\`mermaid
graph TD
    C[Clients] --> LB[Load Balancer]
    LB -->|Round Robin / Least Conn| S1[Server 1]
    LB --> S2[Server 2]
    LB --> S3[Server 3]
    S1 --> DB[(Database)]
    S2 --> DB
    S3 --> DB
    LB -.->|Health Check| S1
    LB -.->|Health Check| S2
    LB -.->|Health Check| S3
\`\`\`

\`\`\`
  Clients
    │
    ▼
┌──────────────┐
│ Load Balancer │  ← single entry point
└──────┬───────┘
   ┌───┼───┐
   ▼   ▼   ▼
 ┌───┐┌───┐┌───┐
 │ S1││ S2││ S3│   ← backend servers
 └───┘└───┘└───┘
\`\`\`

## Common Algorithms

| Algorithm | How It Works | Best For |
|-----------|-------------|----------|
| **Round Robin** | Cycles through servers in order | Equal-capacity servers |
| **Weighted Round Robin** | Cycles with weights (powerful servers get more) | Mixed-capacity fleet |
| **Least Connections** | Sends to the server with fewest active connections | Varying request durations |
| **IP Hash** | Hashes client IP to pick a server | Session stickiness |
| **Random** | Picks a server at random | Simple, surprisingly effective |

\`\`\`quiz
{"title": "Pick the Right Algorithm", "questions": [{"question": "Your three servers have identical specs and each request takes ~200 ms. Which algorithm is simplest and fairest?", "options": ["Round Robin", "Least Connections", "IP Hash", "Weighted Round Robin"], "answer": 0, "explanation": "Round Robin gives perfectly equal distribution when capacity and workload are uniform."}, {"question": "Server A has 32 cores while B & C have 8 each. How do you reflect this in static assignment?", "options": ["Use Least Connections", "Apply weights 4:1:1 in Weighted Round Robin", "Stick to plain Round Robin", "Hash on user ID"], "answer": 1, "explanation": "Weights let you send 4× more traffic to the more powerful box."}, {"question": "You need all requests from the same mobile client to hit the same backend to keep session data in memory. Which method guarantees this?", "options": ["Random", "Least Connections", "IP Hash", "Round Robin"], "answer": 2, "explanation": "Hashing the client IP always maps that IP to the same server (unless the pool changes)."}]}
\`\`\`

## Layer 4 vs Layer 7

- **Layer 4 (Transport):** Routes based on IP address and TCP port. Very fast because it does not inspect the request body. Example: AWS Network Load Balancer.
- **Layer 7 (Application):** Inspects HTTP headers, URL path, cookies. Can make smarter routing decisions (e.g., send \`/api\` to one pool, \`/static\` to another). Example: NGINX, AWS Application Load Balancer.

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Layer 4 only", "code": "Client ──TCP──▶ LB ──TCP──▶ Any Server\\nPros: 0 ms added latency, 5M+ concurrent flows\\nCons: Cannot read Host header, no path-based routing"}, "after": {"label": "Layer 7 smarts", "code": "Client ──HTTP──▶ LB\\nLB reads URL:\\n  /api/v1/*   → API cluster\\n  /static/*   → S3/CDN\\n  /admin/*    → Admin cluster\\nPros: content rules, SSL termination, WAF\\nCons: ~1 ms extra latency, CPU cost per request"}}
\`\`\`

## Health Checks

The load balancer periodically pings each server (e.g., \`GET /health\`). If a server fails several consecutive checks, the balancer stops sending it traffic. When the server recovers, it is added back automatically.

\`\`\`
LB ──ping──▶ S1  ✓  (keep in pool)
LB ──ping──▶ S2  ✗  (remove from pool)
LB ──ping──▶ S3  ✓  (keep in pool)
\`\`\`

\`\`\`steps
{"title": "Lifecycle of a Health Check Failure", "steps": [{"title": "1. Normal state", "content": "All servers pass; LB distributes evenly."}, {"title": "2. First failure", "content": "S2 misses 1 probe → LB still sends traffic (tolerance)."}, {"title": "3. Threshold hit", "content": "S2 misses 3 in a row → LB marks it **down** and drains existing connections."}, {"title": "4. Recovery", "content": "S2 starts replying ✓ → after N successes LB adds it back to rotation."}]}
\`\`\`

## Avoiding the Single Point of Failure

The load balancer itself can fail. Solutions:
- **Active-passive pair:** A standby LB takes over via a virtual IP if the primary fails.
- **DNS-based balancing:** Multiple LB IPs published in DNS; clients retry on failure.

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Load balancers distribute traffic, perform health checks, and enable horizontal scaling.", "Round Robin is the simplest algorithm; Least Connections handles uneven workloads better.", "L4 is faster; L7 is smarter.", "Always plan for the load balancer itself to be redundant."]}
\`\`\``,
    },
    {
      id: "sd-fund-4",
      slug: "caching",
      title: "Caching",
      content: `# Caching

Caching stores copies of frequently accessed data in a faster storage layer so that future requests can be served more quickly. It is one of the most impactful performance optimizations in system design.

\`\`\`concept
{
  "title": "Cache Hit Ratio: The 90% Rule",
  "variant": "mental-model",
  "content": "A high-performing cache typically achieves a Cache Hit Ratio (CHR) above 90%. This means 9 out of 10 requests are served from the cache rather than hitting the slower backend. CHR directly translates to reduced latency, lower database load, and decreased infrastructure costs. A CHR below 50% often indicates you're caching the wrong data or using an ineffective strategy."
}
\`\`\`

## The Caching Hierarchy

\`\`\`
  Client (browser cache)
    │
    ▼
  CDN (edge cache)
    │
    ▼
  Application server
    │
    ▼
  In-memory cache (Redis / Memcached)
    │
    ▼
  Database
\`\`\`

Each layer is progressively slower but holds more data. A well-designed system hits the database only for cache misses.

\`\`\`algoviz
{
  "title": "Request Flow Through Cache Hierarchy",
  "type": "array",
  "data": ["Browser", "CDN", "App Server", "Redis", "Database"],
  "frames": [
    { "highlight": [0], "label": "User request starts at browser cache", "stats": {"latency": "0ms"} },
    { "highlight": [1], "label": "Browser miss → CDN edge server", "stats": {"latency": "10ms"} },
    { "highlight": [2], "label": "CDN miss → Application server", "stats": {"latency": "50ms"} },
    { "highlight": [3], "label": "App miss → Redis cache", "stats": {"latency": "100ms"} },
    { "highlight": [4], "label": "Cache miss → Database", "stats": {"latency": "500ms"} }
  ],
  "speed": 1000
}
\`\`\`

## Caching Strategies

### Cache-Aside (Lazy Loading)
The application checks the cache first. On a miss, it reads from the database, writes the result to the cache, then returns it. Most common pattern.

**Pros:** Only caches data that is actually requested. Cache failures do not break the system (reads fall back to DB).
**Cons:** First request for each key is always slow (cold start). Data can become stale.

### Write-Through
Every write goes to the cache AND the database simultaneously. The cache is always up to date.

**Pros:** Cache is never stale.
**Cons:** Higher write latency (two writes per operation). Caches data that may never be read.

### Write-Behind (Write-Back)
Writes go to the cache immediately; the cache asynchronously flushes to the database in batches.

**Pros:** Extremely fast writes. Reduces database load.
**Cons:** Risk of data loss if the cache crashes before flushing. More complex.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Cache-Aside: High Read Performance",
    "code": "# Read path: Fast for hot data\\nvalue = cache.get(key)\\nif not value:\\n    value = db.query(key)\\n    cache.set(key, value)\\nreturn value\\n\\n# Write path: Direct to DB only\\ndb.update(key, new_value)\\ncache.delete(key)  # Optional invalidation"
  },
  "after": {
    "label": "Write-Through: Strong Consistency",
    "code": "# Read path: Always from cache\\nreturn cache.get(key)\\n\\n# Write path: Slower but consistent\\ncache.set(key, new_value)\\ndb.update(key, new_value)  # Synchronous\\nreturn success"
  }
}
\`\`\`

## Cache Eviction Policies

When the cache is full, you need to decide which entries to remove:

- **LRU (Least Recently Used):** Evicts the entry that has not been accessed for the longest time. Most popular choice.
- **LFU (Least Frequently Used):** Evicts the entry with the fewest total accesses. Good when some items are consistently popular.
- **TTL (Time-To-Live):** Each entry expires after a fixed duration regardless of access patterns.

\`\`\`quiz
{
  "title": "Cache Strategy Selection",
  "questions": [
    {
      "question": "Which strategy ensures the cache never contains stale data?",
      "options": ["Cache-Aside", "Write-Through", "Write-Behind", "TTL only"],
      "answer": 1,
      "explanation": "Write-Through updates both cache and database simultaneously, ensuring the cache always has the latest data."
    },
    {
      "question": "Your e-commerce site has 95% read traffic for product catalogs. Which strategy fits best?",
      "options": ["Write-Through", "Write-Behind", "Cache-Aside with LRU", "No caching"],
      "answer": 2,
      "explanation": "Cache-Aside with LRU excels for read-heavy workloads, caching only requested data while maintaining high hit ratios."
    },
    {
      "question": "What happens during a cache stampede?",
      "options": ["Data becomes corrupted", "Thousands of requests hit the database simultaneously", "Cache size exceeds memory limits", "Network bandwidth is exhausted"],
      "answer": 1,
      "explanation": "A cache stampede occurs when a popular cached item expires, causing numerous requests to simultaneously query the database."
    }
  ]
}
\`\`\`

## Content Delivery Networks (CDNs)

A CDN is a globally distributed cache for static assets (images, CSS, JS, videos). When a user in Tokyo requests an image, the CDN serves it from a nearby edge server rather than the origin server in Virginia. This reduces latency from ~150 ms to ~10 ms.

**Pull CDN:** The CDN fetches content from the origin on the first request, then caches it.
**Push CDN:** You upload content directly to the CDN ahead of time.

## Common Pitfalls

- **Cache stampede:** When a popular cache entry expires and thousands of requests simultaneously hit the database. Solution: use locking or staggered TTLs.
- **Stale data:** Cached data can diverge from the source of truth. Use TTLs and invalidation strategies appropriate for your consistency requirements.

\`\`\`trace
{
  "title": "Cache Stampede Prevention",
  "language": "python",
  "code": "import time\\nimport threading\\nfrom datetime import datetime, timedelta\\n\\ndef get_product_with_stampede_protection(product_id):\\n    cache_key = f\\"product:{product_id}\\"\\n    \\n    # Try cache first\\n    cached_data = cache.get(cache_key)\\n    if cached_data:\\n        # Check if expiring soon (within 5 minutes)\\n        if cached_data['expires_at'] - datetime.now() > timedelta(minutes=5):\\n            return cached_data['data']\\n        \\n        # About to expire - extend TTL to prevent stampede\\n        cache.set(cache_key, cached_data, ex=300)  # 5 more minutes\\n        \\n        # Background refresh\\n        threading.Thread(target=refresh_cache, args=(product_id,)).start()\\n        return cached_data['data']\\n    \\n    # Cache miss - load from database\\n    return refresh_cache(product_id)\\n\\ndef refresh_cache(product_id):\\n    data = database.query(f\\"SELECT * FROM products WHERE id = {product_id}\\")\\n    cache_data = {\\n        'data': data,\\n        'expires_at': datetime.now() + timedelta(hours=1)\\n    }\\n    cache.set(f\\"product:{product_id}\\", cache_data, ex=3600)\\n    return data",
  "frames": [
    { "line": 1, "vars": {}, "note": "Setup imports and functions", "stdout": "" },
    { "line": 6, "vars": {"product_id": 123}, "note": "Request for product 123", "stdout": "" },
    { "line": 9, "vars": {"cached_data": null}, "note": "Cache miss - data not found", "stdout": "" },
    { "line": 28, "vars": {}, "note": "Loading from database", "stdout": "SELECT * FROM products WHERE id = 123" },
    { "line": 31, "vars": {"data": {"id": 123, "name": "iPhone", "price": 999}}, "note": "Caching with 1-hour TTL", "stdout": "" },
    { "line": 35, "vars": {}, "note": "Return fresh data", "stdout": "Returning: {'id': 123, 'name': 'iPhone', 'price': 999}" }
  ],
  "speed": 800
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Caching dramatically reduces latency and database load - aim for 90%+ cache hit ratio",
    "Cache-aside is the most common pattern; write-through guarantees freshness at the cost of write performance",
    "LRU is the default eviction policy unless you have specific access patterns that favor LFU",
    "CDNs are essential for serving static content globally, reducing latency from 150ms to 10ms",
    "Always plan for cache invalidation and stampede prevention - they're among the hardest problems in computer science"
  ]
}
\`\`\``,
    },
    {
      id: "sd-fund-5",
      slug: "databases-sql-vs-nosql",
      title: "Databases: SQL vs NoSQL",
      content: `# Databases: SQL vs NoSQL

Choosing the right database is one of the most consequential decisions in system design. The two broad families — relational (SQL) and non-relational (NoSQL) — offer fundamentally different trade-offs that ripple through your entire architecture.

\`\`\`concept
{
  "title": "The Schema Decision",
  "variant": "mental-model",
  "content": "Think of SQL vs NoSQL as the difference between a formal dinner (SQL) and a food truck festival (NoSQL). The dinner requires reservations, assigned seating, and a fixed menu — but guarantees consistency and service quality. The festival offers flexibility, variety, and easy scaling — but you might find your favorite truck ran out of tacos."
}
\`\`\`

## Relational Databases (SQL)

Data lives in **tables** with predefined schemas. Relationships between tables are enforced through foreign keys, creating a web of interconnected data that mirrors real-world entities.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Rigid Schema (Challenge)",
    "code": "-- Adding a new field requires ALTER TABLE\\nALTER TABLE users ADD COLUMN phone VARCHAR(20);\\n-- This locks the table and can take hours on large datasets"
  },
  "after": {
    "label": "Strong Consistency (Benefit)",
    "code": "-- Bank transfer: both debit and credit must succeed\\nBEGIN;\\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\\nCOMMIT; -- Both succeed or both fail"
  }
}
\`\`\`

### ACID Properties
- **Atomicity:** A transaction either completes fully or not at all.
- **Consistency:** The database moves from one valid state to another.
- **Isolation:** Concurrent transactions do not interfere with each other.
- **Durability:** Once committed, data survives crashes.

**Strengths:** Complex queries with JOINs, strong consistency, mature tooling, well-understood scaling patterns (read replicas, connection pooling).

**Weaknesses:** Rigid schemas make rapid iteration harder. Horizontal scaling (sharding) is complex because JOINs across shards are expensive.

## Non-Relational Databases (NoSQL)

NoSQL databases relax some relational constraints to achieve greater flexibility, scalability, or performance. They follow **BASE** semantics:

\`\`\`concept
{
  "title": "BASE vs ACID",
  "variant": "insight",
  "content": "BASE is not the opposite of ACID — it's a different philosophy. BASE says 'be available and eventually consistent' while ACID says 'be consistent at all costs.' This trade-off enables NoSQL systems to scale horizontally across hundreds of nodes while remaining responsive."
}
\`\`\`

- **Basically Available:** The system guarantees some level of availability.
- **Soft state:** State may change over time due to eventual consistency.
- **Eventually consistent:** Reads may not reflect the latest write immediately.

### Types of NoSQL Databases

| Type | Data Model | Examples | Best For |
|------|-----------|----------|----------|
| **Key-Value** | Simple key → value pairs | Redis, DynamoDB | Caching, sessions, leaderboards |
| **Document** | JSON-like documents | MongoDB, CouchDB | Content management, catalogs, user profiles |
| **Column-Family** | Rows with dynamic columns | Cassandra, HBase | Time-series, IoT, write-heavy analytics |
| **Graph** | Nodes and edges | Neo4j, Amazon Neptune | Social networks, recommendation engines |

\`\`\`quiz
{
  "title": "NoSQL Database Types",
  "questions": [
    {
      "question": "Which NoSQL type is best for storing user session data that needs sub-millisecond access?",
      "options": ["Document store", "Key-value store", "Column-family store", "Graph database"],
      "answer": 1,
      "explanation": "Key-value stores like Redis provide O(1) lookup time and are optimized for fast, simple access patterns perfect for session management."
    },
    {
      "question": "A social media platform needs to store and query complex relationships between users. Which NoSQL type fits best?",
      "options": ["Document store", "Key-value store", "Column-family store", "Graph database"],
      "answer": 3,
      "explanation": "Graph databases excel at traversing relationships between entities, making them ideal for social networks where you need to find friends-of-friends or mutual connections."
    },
    {
      "question": "An IoT platform collects sensor readings every second from millions of devices. Which NoSQL type handles this write-heavy workload best?",
      "options": ["Document store", "Key-value store", "Column-family store", "Graph database"],
      "answer": 2,
      "explanation": "Column-family stores like Cassandra are designed for write-heavy workloads and time-series data, offering linear scalability for ingesting high-velocity sensor data."
    }
  ]
}
\`\`\`

## When to Use Which

**Choose SQL when:**
- You need complex queries with JOINs across multiple entities.
- Data integrity and ACID transactions are critical (financial systems, inventory).
- Your schema is well-defined and unlikely to change drastically.

**Choose NoSQL when:**
- Your data model is flexible or semi-structured (user-generated content, logs).
- You need to scale writes horizontally across many nodes.
- Low-latency reads at massive scale are the priority.
- Your access patterns are simple (key lookups, document retrieval).

\`\`\`steps
{
  "title": "Database Selection Decision Tree",
  "steps": [
    {
      "title": "Step 1: Consistency Requirements",
      "content": "**Do you need strong consistency?**\\n\\n- **Yes:** Financial transactions, inventory management, user authentication → Consider SQL\\n- **No:** Social media posts, analytics data, cached content → NoSQL is viable"
    },
    {
      "title": "Step 2: Data Structure",
      "content": "**Is your data structure stable and relational?**\\n\\n- **Yes:** Well-defined entities with clear relationships → SQL excels\\n- **No:** Evolving schema, nested data, polymorphic entities → NoSQL offers flexibility"
    },
    {
      "title": "Step 3: Scale Patterns",
      "content": "**What are your scaling needs?**\\n\\n- **Vertical scaling sufficient:** Single powerful machine can handle load → SQL works\\n- **Need horizontal scaling:** Must distribute across multiple machines → NoSQL designed for this\\n\\n**Remember:** You can also start SQL and add NoSQL later for specific use cases."
    }
  ]
}
\`\`\`

## The Practical Middle Ground

Many production systems use **both** — a pattern called polyglot persistence. For example, an e-commerce platform might use:

\`\`\`sysdiag
{
  "title": "Polyglot Persistence in E-commerce",
  "width": 700,
  "height": 400,
  "nodes": [
    {"id": "api", "label": "API Gateway", "x": 350, "y": 50, "kind": "service"},
    {"id": "postgres", "label": "PostgreSQL\\nOrders & Payments", "x": 150, "y": 200, "kind": "database"},
    {"id": "redis", "label": "Redis\\nSessions & Cart", "x": 350, "y": 200, "kind": "database"},
    {"id": "mongo", "label": "MongoDB\\nProduct Catalog", "x": 550, "y": 200, "kind": "database"},
    {"id": "elastic", "label": "Elasticsearch\\nProduct Search", "x": 350, "y": 350, "kind": "database"}
  ],
  "edges": [
    {"from": "api", "to": "postgres", "label": "ACID transactions"},
    {"from": "api", "to": "redis", "label": "Fast lookups"},
    {"from": "api", "to": "mongo", "label": "Flexible schema"},
    {"from": "api", "to": "elastic", "label": "Full-text search"}
  ],
  "annotations": {
    "postgres": "Handles orders and payments requiring ACID compliance",
    "redis": "Sub-millisecond access for shopping cart and session data",
    "mongo": "Flexible schema for product attributes that vary by category",
    "elastic": "Powerful search capabilities with faceting and filtering"
  }
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "SQL databases excel at structured data with complex relationships and strong consistency — choose them when data integrity is non-negotiable",
    "NoSQL databases offer flexible schemas and horizontal scalability — ideal for rapidly evolving data and massive scale",
    "The four NoSQL families (key-value, document, column-family, graph) each optimize for specific access patterns and data models",
    "Most real systems are polyglot — using multiple database types for different workloads is not just common, it's often optimal",
    "The right choice depends on your access patterns, consistency requirements, and scaling needs — there's no one-size-fits-all answer"
  ]
}
\`\`\``,
    },
    {
      id: "sd-fund-6",
      slug: "networking-basics-for-system-design",
      title: "Networking Basics for System Design",
      content: `# Networking Basics for System Design

You don’t need to be a networking expert for system-design interviews, but you do need to *reason* about latency, reliability, and protocol choices. The four primitives below—TCP vs UDP, HTTP family, WebSockets, and DNS—cover 90 % of the questions you’ll face.

\`\`\`concept
{
  "title": "The Network Is Not a Magic Pipe",
  "variant": "mental-model",
  "content": "Every remote call is a distributed-systems problem: packets can be lost, re-ordered, duplicated, or delayed. Design as if the network is hostile and you’ll sleep better at night."
}
\`\`\`

## TCP vs UDP: Reliability vs Speed

| Dimension | TCP | UDP |
|-----------|-----|-----|
| Connection | 3-way handshake first | fire-and-forget |
| Delivery | acknowledged, re-ordered | best-effort |
| Overhead | 20-byte header + state | 8-byte header, stateless |
| Typical RTT inside DC | 0.3–0.5 ms | 0.2 ms |
| Use-case | HTTP, DB, file transfer | video, DNS, gaming, VoIP |

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "TCP for live gaming (bad)",
    "code": "# 60 fps = 16 ms budget\\n# TCP re-transmit can add 200 ms jitter\\nplayer.move(x, y)  # stutter city"
  },
  "after": {
    "label": "UDP with custom retry (good)",
    "code": "# send position + sequence id\\n# client predicts, server corrects\\nsock.sendto(packet, addr)  # <1 ms"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Pick the Protocol",
  "questions": [
    {
      "question": "Your microservice needs to fetch 5 KB configuration once at start-up. Which protocol?",
      "options": ["TCP", "UDP"],
      "answer": 0,
      "explanation": "Config must arrive completely and in order; TCP’s reliability wins."
    },
    {
      "question": "You stream 4 K video to 50 000 concurrent viewers. Which protocol?",
      "options": ["TCP", "UDP"],
      "answer": 1,
      "explanation": "Occasional frame loss is acceptable; UDP avoids re-transmit overhead."
    },
    {
      "question": "You build a chat app that must deliver every message exactly once. Which protocol?",
      "options": ["TCP", "UDP"],
      "answer": 0,
      "explanation": "Message history must be accurate; TCP guarantees ordering and delivery."
    }
  ]
}
\`\`\`

## HTTP Evolution: 1.1 → 2 → 3

HTTP is *stateless*—every request carries its own context (cookies, JWT, etc.). The performance leaps come from the transport below it:

| Version | Transport | Head-of-line blocking? | Typical improvement |
|---------|-----------|------------------------|---------------------|
| HTTP/1.1 | TCP | yes (request level) | baseline |
| HTTP/2 | TCP | no (multiplexed) | 30–50 % faster |
| HTTP/3 | QUIC (UDP) | no (packet level) | 10 % on fast links, 2× on lossy mobile |

\`\`\`callout
{
  "type": "tip",
  "title": "Interview Shortcut",
  "content": "Say \\"HTTP/2 multiplexes many streams over one TCP connection, removing head-of-line blocking\\" and you’ve checked the box."
}
\`\`\`

## WebSockets: When the Server Needs to Speak First

Standard HTTP is client-initiated. Upgrade to WebSocket when you need **low-latency, server-push** channels.

\`\`\`steps
{
  "title": "WebSocket Handshake in 3 Steps",
  "steps": [
    {
      "title": "1. Client asks for upgrade",
      "content": "\`\`\`\\nGET /chat HTTP/1.1\\nUpgrade: websocket\\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\\n\`\`\`"
    },
    {
      "title": "2. Server accepts",
      "content": "\`\`\`\\nHTTP/1.1 101 Switching Protocols\\nSec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=\\n\`\`\`"
    },
    {
      "title": "3. Full-duplex frames",
      "content": "Both sides can send binary or text frames at any time; no new TCP connection per message."
    }
  ]
}
\`\`\`

Use WebSockets for: chat, live dashboards, collaborative editing, stock tickers.  
Avoid for: sporadic one-off requests—keep-alive consumes file descriptors.

## DNS: The Internet’s Phone Book

DNS resolution is your **first chance** to steer traffic away from a failing data-center.

\`\`\`algoviz
{
  "title": "Resolving api.example.com",
  "type": "tree",
  "data": [".", "com", "example", "api"],
  "frames": [
    { "highlight": [0], "label": "Root hints (.)" },
    { "highlight": [1], "label": "TLD .com nameserver" },
    { "highlight": [2], "label": "example.com authoritative" },
    { "highlight": [3], "label": "A record 203.0.113.7 returned" }
  ],
  "speed": 1000
}
\`\`\`

- **TTL** (seconds) controls cache lifetime.  
  - Low TTL (30 s) → fast failover, higher lookup load.  
  - High TTL (5 min–1 h) → lower latency, slower failover.  
- **DNS-based load balancing**: return multiple A records or use geo-aware responses.

## Latency Numbers Worth Memorizing

| Operation | Time | Human scale |
|-----------|------|-------------|
| L1 cache | 1 ns | 1 s |
| RAM | 100 ns | 1.6 min |
| SSD read | 100 µs | 1.2 days |
| Same-rack RTT | 0.5 ms | 6 months |
| Cross-continent RTT | 150 ms | 250 years |

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Impact of 1 ms Saved",
  "inputs": [
    { "id": "r", "label": "Requests/sec per core", "default": 1000, "min": 100, "max": 10000 },
    { "id": "t", "label": "Latency saved (ms)", "default": 1, "min": 0.1, "max": 10 },
    { "id": "c", "label": "Cores per host", "default": 32, "min": 1, "max": 128 }
  ]
}
\`\`\`

Saving **1 ms per request** on a 32-core box at 1 000 RPS/core frees **32 000 ms = 32 s** of CPU time every second—enough capacity for 32 000 extra requests.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Choose TCP when correctness > speed; UDP when speed > correctness.",
    "HTTP is stateless—push real-time data with WebSockets, not polling.",
    "DNS is a cheap global traffic switch: tune TTL for failover speed vs cache hit.",
    "Keep the latency table in your head—every extra millisecond multiplies across cores and requests."
  ]
}
\`\`\``,
    },
  ],
};
