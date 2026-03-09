import { Module } from "../types";

export const fundamentalsModule: Module = {
  id: "sd-fundamentals",
  title: "System Design Fundamentals",
  description:
    "Core building blocks every system designer needs: scaling, load balancing, caching, databases, and networking.",
  lessons: [
    {
      id: "sd-fund-1",
      slug: "introduction-to-system-design",
      title: "Introduction to System Design",
      content: `# Introduction to System Design

## Why System Design Matters

Every large-scale application you use daily — search engines, social networks, messaging apps — is backed by a carefully architected distributed system. System design is the discipline of defining the architecture, components, and data flow of these systems so they can handle millions of users reliably.

In engineering interviews, system design rounds evaluate whether you can think beyond a single function and reason about an entire product at scale. Unlike coding problems, there is no single correct answer — interviewers want to see your **thought process**, your ability to make **trade-offs**, and how well you communicate technical decisions.

## A Framework for Design Problems

Use this four-step framework every time you approach a design question:

### Step 1 — Clarify Requirements (3-5 min)
Ask questions. Separate **functional requirements** (what the system does) from **non-functional requirements** (how well it does it — latency, availability, consistency). Pin down the scope so you and your interviewer agree on what you are designing.

### Step 2 — Back-of-Envelope Estimation (3-5 min)
Estimate scale: daily active users, requests per second, storage per year. These numbers drive every architectural choice you make later.

### Step 3 — High-Level Design (10-15 min)
Draw the major components: clients, load balancers, application servers, databases, caches, queues. Show how data flows through the system for the most important use cases.

### Step 4 — Deep Dive (10-15 min)
Pick the hardest parts and zoom in. Discuss data models, API contracts, sharding strategies, failure modes, and how you would monitor the system in production.

## Common Estimation Shortcuts

Keep these handy for back-of-envelope math:

- 1 day ≈ 100,000 seconds (86,400 exactly)
- 1 million requests/day ≈ ~12 requests/second
- 1 character (UTF-8 English) ≈ 1 byte
- 1 average tweet-length string ≈ 280 bytes
- 1 photo (compressed) ≈ 200 KB – 1 MB
- SSD random read ≈ 0.1 ms; HDD ≈ 10 ms
- Round-trip within a data center ≈ 0.5 ms; cross-continent ≈ 150 ms

## Key Takeaways

- System design is about **trade-offs**, not perfect answers.
- Always start by clarifying requirements and estimating scale.
- Use the four-step framework: Requirements → Estimation → High-Level Design → Deep Dive.
- Non-functional requirements (latency, throughput, durability) shape your architecture more than features do.
- Practice communicating your decisions out loud — clarity matters as much as correctness.
`,
    },
    {
      id: "sd-fund-2",
      slug: "scaling-vertical-vs-horizontal",
      title: "Scaling: Vertical vs Horizontal",
      content: `# Scaling: Vertical vs Horizontal

As traffic grows, a single server eventually hits its limits. There are two fundamental strategies to handle more load: **vertical scaling** (scale up) and **horizontal scaling** (scale out).

## Vertical Scaling (Scale Up)

Add more power to your existing machine — more CPU cores, more RAM, faster disks.

**Pros:**
- Simple — no code changes required.
- No distributed-system complexity (no data partitioning, no network coordination).
- Lower operational overhead (one machine to monitor).

**Cons:**
- **Hard ceiling.** Even the beefiest machine has limits. You cannot buy infinite RAM.
- **Single point of failure.** If that one server crashes, everything goes down.
- **Cost curve is steep.** Doubling a server's specs often more than doubles the price.

**When to use it:** Early-stage products, databases that are hard to shard, workloads that need low-latency access to a large shared memory space.

## Horizontal Scaling (Scale Out)

Add more machines of the same (or similar) size and distribute the workload across them.

\`\`\`
        ┌────────────┐
        │   Load      │
        │  Balancer   │
        └─────┬───────┘
       ┌──────┼──────┐
       ▼      ▼      ▼
   ┌──────┐┌──────┐┌──────┐
   │ App  ││ App  ││ App  │
   │ Srv 1││ Srv 2││ Srv 3│
   └──────┘└──────┘└──────┘
\`\`\`

**Pros:**
- **Near-linear capacity growth.** Need 2× throughput? Add 2× servers.
- **Fault tolerance.** Losing one node does not take down the system.
- **Cost efficient at scale.** Commodity hardware is cheap.

**Cons:**
- Adds complexity: load balancing, data partitioning, distributed state management.
- Network latency between nodes.
- Harder to debug and monitor.

**When to use it:** Web-tier application servers (stateless), read-heavy workloads (replicas), large-scale storage (sharding).

## Practical Reality

Most production systems use **both**. You scale vertically until the cost or risk becomes unacceptable, then scale horizontally. For example, a startup might run on a single powerful database server for its first year, then add read replicas and eventually shard when they reach millions of users.

## Key Takeaways

- **Vertical scaling** is simpler but has hard limits and a single point of failure.
- **Horizontal scaling** provides near-unlimited capacity but introduces distributed-system challenges.
- Real-world systems combine both approaches.
- Stateless services (application servers) are easy to scale out; stateful services (databases) require more careful planning.
`,
    },
    {
      id: "sd-fund-3",
      slug: "load-balancing",
      title: "Load Balancing",
      content: `# Load Balancing

A load balancer sits between clients and a pool of servers, distributing incoming requests so that no single server becomes a bottleneck.

## Why Load Balancers?

Without a load balancer, all traffic hits a single server. When that server is overloaded or fails, users see errors. A load balancer provides three things:

1. **Even distribution** of requests across servers.
2. **Health checking** — automatically removes unhealthy servers from the pool.
3. **Horizontal scalability** — you can add or remove servers behind the balancer without clients noticing.

## Architecture

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

## Layer 4 vs Layer 7

- **Layer 4 (Transport):** Routes based on IP address and TCP port. Very fast because it does not inspect the request body. Example: AWS Network Load Balancer.
- **Layer 7 (Application):** Inspects HTTP headers, URL path, cookies. Can make smarter routing decisions (e.g., send \`/api\` to one pool, \`/static\` to another). Example: NGINX, AWS Application Load Balancer.

## Health Checks

The load balancer periodically pings each server (e.g., \`GET /health\`). If a server fails several consecutive checks, the balancer stops sending it traffic. When the server recovers, it is added back automatically.

\`\`\`
LB ──ping──▶ S1  ✓  (keep in pool)
LB ──ping──▶ S2  ✗  (remove from pool)
LB ──ping──▶ S3  ✓  (keep in pool)
\`\`\`

## Avoiding the Single Point of Failure

The load balancer itself can fail. Solutions:
- **Active-passive pair:** A standby LB takes over via a virtual IP if the primary fails.
- **DNS-based balancing:** Multiple LB IPs published in DNS; clients retry on failure.

## Key Takeaways

- Load balancers distribute traffic, perform health checks, and enable horizontal scaling.
- Round Robin is the simplest algorithm; Least Connections handles uneven workloads better.
- L4 is faster; L7 is smarter.
- Always plan for the load balancer itself to be redundant.
`,
    },
    {
      id: "sd-fund-4",
      slug: "caching",
      title: "Caching",
      content: `# Caching

Caching stores copies of frequently accessed data in a faster storage layer so that future requests can be served more quickly. It is one of the most impactful performance optimizations in system design.

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

## Cache Eviction Policies

When the cache is full, you need to decide which entries to remove:

- **LRU (Least Recently Used):** Evicts the entry that has not been accessed for the longest time. Most popular choice.
- **LFU (Least Frequently Used):** Evicts the entry with the fewest total accesses. Good when some items are consistently popular.
- **TTL (Time-To-Live):** Each entry expires after a fixed duration regardless of access patterns.

## Content Delivery Networks (CDNs)

A CDN is a globally distributed cache for static assets (images, CSS, JS, videos). When a user in Tokyo requests an image, the CDN serves it from a nearby edge server rather than the origin server in Virginia. This reduces latency from ~150 ms to ~10 ms.

**Pull CDN:** The CDN fetches content from the origin on the first request, then caches it.
**Push CDN:** You upload content directly to the CDN ahead of time.

## Common Pitfalls

- **Cache stampede:** When a popular cache entry expires and thousands of requests simultaneously hit the database. Solution: use locking or staggered TTLs.
- **Stale data:** Cached data can diverge from the source of truth. Use TTLs and invalidation strategies appropriate for your consistency requirements.

## Key Takeaways

- Caching dramatically reduces latency and database load.
- Cache-aside is the most common pattern; write-through guarantees freshness.
- LRU is the default eviction policy unless you have a specific reason to choose otherwise.
- CDNs are essential for serving static content to a global audience.
- Always plan for cache invalidation — it is famously one of the two hard problems in computer science.
`,
    },
    {
      id: "sd-fund-5",
      slug: "databases-sql-vs-nosql",
      title: "Databases: SQL vs NoSQL",
      content: `# Databases: SQL vs NoSQL

Choosing the right database is one of the most consequential decisions in system design. The two broad families — relational (SQL) and non-relational (NoSQL) — offer fundamentally different trade-offs.

## Relational Databases (SQL)

Data is stored in **tables** with predefined schemas. Relationships between tables are enforced through foreign keys. Examples: PostgreSQL, MySQL, Oracle.

### ACID Properties
- **Atomicity:** A transaction either completes fully or not at all.
- **Consistency:** The database moves from one valid state to another.
- **Isolation:** Concurrent transactions do not interfere with each other.
- **Durability:** Once committed, data survives crashes.

**Strengths:** Complex queries with JOINs, strong consistency, mature tooling, well-understood scaling patterns (read replicas, connection pooling).

**Weaknesses:** Rigid schemas make rapid iteration harder. Horizontal scaling (sharding) is complex because JOINs across shards are expensive.

## Non-Relational Databases (NoSQL)

NoSQL databases relax some relational constraints to achieve greater flexibility, scalability, or performance. They follow **BASE** semantics:
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

## The Practical Middle Ground

Many production systems use **both**. For example, an e-commerce platform might use PostgreSQL for orders and payments (ACID required) and Redis for session data and caching (speed required) and Elasticsearch for product search (full-text indexing required).

## Key Takeaways

- SQL databases excel at structured data with complex relationships and strong consistency.
- NoSQL databases excel at flexible schemas, horizontal scalability, and simple access patterns.
- There are four main NoSQL families: key-value, document, column-family, and graph.
- Most real systems are polyglot — they use multiple database types for different workloads.
- The right choice depends on your **access patterns**, **consistency requirements**, and **scaling needs**.
`,
    },
    {
      id: "sd-fund-6",
      slug: "networking-basics-for-system-design",
      title: "Networking Basics for System Design",
      content: `# Networking Basics for System Design

You do not need to be a networking expert for system design interviews, but understanding a few core concepts helps you reason about latency, reliability, and protocol choices.

## TCP vs UDP

**TCP (Transmission Control Protocol):**
- Connection-oriented: establishes a connection via a three-way handshake before sending data.
- Guarantees delivery, ordering, and error checking.
- Used by: HTTP, database connections, file transfers.
- Trade-off: reliability costs latency (handshake overhead, retransmissions).

**UDP (User Datagram Protocol):**
- Connectionless: sends packets without establishing a connection.
- No delivery guarantee, no ordering guarantee.
- Used by: video streaming, online gaming, DNS lookups, VoIP.
- Trade-off: speed over reliability. Applications handle retries themselves if needed.

## HTTP and HTTPS

HTTP (Hypertext Transfer Protocol) is the application-layer protocol that powers the web. It runs on top of TCP.

Key properties for system design:
- **Request-response model:** Client sends a request; server returns a response.
- **Stateless:** Each request is independent. The server does not remember previous requests (state is managed via cookies, tokens, or sessions stored elsewhere).
- **HTTPS** adds TLS encryption. Always use HTTPS for anything sensitive.

Common HTTP methods: \`GET\` (read), \`POST\` (create), \`PUT\` (replace), \`PATCH\` (partial update), \`DELETE\` (remove).

## WebSockets

HTTP is client-initiated: the server cannot push data to the client without the client asking first. **WebSockets** solve this by upgrading an HTTP connection into a persistent, full-duplex channel.

\`\`\`
Client ──HTTP Upgrade──▶ Server
       ◀──────────────▶
   (bidirectional messages over single TCP connection)
\`\`\`

**Use WebSockets when:** you need real-time, server-initiated updates — chat apps, live dashboards, collaborative editing, multiplayer games.

**Do not use WebSockets when:** a simple request-response pattern suffices. WebSocket connections consume server resources even when idle.

## DNS (Domain Name System)

DNS translates human-readable domain names (e.g., \`example.com\`) into IP addresses (e.g., \`93.184.216.34\`). The resolution process:

1. Browser checks its local cache.
2. OS checks its cache.
3. Query goes to a recursive resolver (usually your ISP or a service like 8.8.8.8).
4. Resolver queries root → TLD (.com) → authoritative nameserver for the domain.
5. IP address is returned and cached at each level.

DNS is relevant to system design because:
- **DNS-based load balancing** can distribute traffic across data centers.
- **TTL (Time-To-Live)** controls how long DNS records are cached. Low TTLs allow faster failover; high TTLs reduce DNS lookup latency.

## Latency Numbers Every Designer Should Know

| Operation | Approximate Time |
|-----------|-----------------|
| L1 cache reference | 1 ns |
| L2 cache reference | 4 ns |
| RAM reference | 100 ns |
| SSD random read | 100 μs |
| HDD seek | 10 ms |
| Same data center round trip | 0.5 ms |
| Cross-continent round trip | 150 ms |

These numbers help you justify caching layers, CDN usage, and data center placement decisions.

## Key Takeaways

- TCP gives reliability; UDP gives speed. Choose based on your tolerance for data loss.
- HTTP is stateless request-response; WebSockets provide persistent bidirectional channels.
- DNS translates names to IPs and can be used for global load balancing.
- Memorize approximate latency numbers — they drive architecture decisions about where to place caches and replicas.
`,
    },
  ],
};
