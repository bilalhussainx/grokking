import { Module } from "../types";

export const scalabilityAndPerformanceModule: Module = {
  id: "scalability-and-performance",
  title: "Scalability & Performance",
  description: "Understand how systems grow from one server to millions of users — horizontal vs vertical scaling, statelessness, and the key levers for throughput and latency.",
  lessons: [
    {
      id: "vertical-vs-horizontal-scaling",
      slug: "vertical-vs-horizontal-scaling",
      title: "Vertical vs Horizontal Scaling",
      content: `# Vertical vs Horizontal Scaling

Every system starts small. A single server handles your first hundred users just fine — but what happens when traffic grows 10x? 100x? The answer lies in **scaling**: systematically increasing your system's capacity to meet demand.

There are two fundamental strategies, and choosing the wrong one at the wrong time has derailed products at every scale — from scrappy startups to billion-dollar platforms.

\`\`\`concept
{ "title": "The Core Trade-off", "variant": "mental-model", "content": "Vertical scaling asks: 'How much more can one machine do?' Horizontal scaling asks: 'How many machines can share the work?' Both answer the same question — handling more load — but with radically different implications for cost, complexity, and ceiling." }
\`\`\`

---

## The Two Strategies, Side by Side

\`\`\`tabs
{ "tabs": [
  {
    "label": "Vertical Scaling (Scale Up)",
    "icon": "⬆️",
    "content": "**Add more power to a single machine.**\\n\\nYou upgrade the existing server's CPU, RAM, storage, or network bandwidth. The application sees one powerful machine and doesn't need to change.\\n\\n**Examples:**\\n- Upgrading a 4-core/16GB server to 32-core/256GB\\n- Switching from HDD to NVMe SSD\\n- Moving to a memory-optimized cloud instance (e.g., AWS \`r7g.16xlarge\`)\\n\\n**What stays the same:**\\n- Your codebase (no distribution changes)\\n- Your database connection string\\n- Session/state management (one machine = no coordination)\\n\\n**The ceiling:** Hardware limits are real. At some point, no single machine can be made powerful enough — and the biggest machines cost exponentially more per unit of compute."
  },
  {
    "label": "Horizontal Scaling (Scale Out)",
    "icon": "↔️",
    "content": "**Add more machines and distribute the work.**\\n\\nYou deploy multiple identical (or near-identical) instances behind a load balancer. Incoming requests are spread across all of them.\\n\\n**Examples:**\\n- Running 10 instances of your web server instead of 1\\n- Auto-scaling groups that spin up new EC2 instances under load\\n- Kubernetes pods that replicate across nodes\\n\\n**What changes:**\\n- You need a load balancer to route traffic\\n- Your app must be stateless (no local session storage)\\n- Distributed coordination becomes necessary (shared cache, distributed locks)\\n\\n**The ceiling:** Theoretically none — you can keep adding machines. Practically limited by network overhead, coordination costs, and budget."
  }
] }
\`\`\`

---

## Visualizing the Architecture

\`\`\`sysdiag
{ "title": "Vertical vs Horizontal Scaling Architecture", "width": 680, "height": 340,
  "nodes": [
    { "id": "client1", "label": "Clients", "x": 60, "y": 170, "kind": "client" },
    { "id": "vs_server", "label": "1 Big Server\\n(32 CPU / 256 GB)", "x": 240, "y": 100, "kind": "service" },
    { "id": "lb", "label": "Load Balancer", "x": 380, "y": 170, "kind": "service" },
    { "id": "hs1", "label": "Server 1\\n(4 CPU)", "x": 540, "y": 80, "kind": "service" },
    { "id": "hs2", "label": "Server 2\\n(4 CPU)", "x": 540, "y": 170, "kind": "service" },
    { "id": "hs3", "label": "Server 3\\n(4 CPU)", "x": 540, "y": 260, "kind": "service" }
  ],
  "edges": [
    { "from": "client1", "to": "vs_server", "label": "Scale Up" },
    { "from": "client1", "to": "lb", "label": "Scale Out" },
    { "from": "lb", "to": "hs1", "label": "" },
    { "from": "lb", "to": "hs2", "label": "" },
    { "from": "lb", "to": "hs3", "label": "" }
  ],
  "annotations": {
    "vs_server": "Single machine upgraded to handle all load. Simple but has a hard upper limit on capacity.",
    "lb": "Distributes requests evenly across multiple servers. Enables near-infinite scale but requires stateless design.",
    "hs2": "Any of these servers can handle any request — they are interchangeable replicas."
  }
}
\`\`\`

---

## Key Dimensions Compared

| Dimension | Vertical Scaling | Horizontal Scaling |
|---|---|---|
| **Implementation** | Change instance type / add hardware | Add more instances + load balancer |
| **Code changes** | None | App must be stateless |
| **Fault tolerance** | Single point of failure | Survives node failures |
| **Cost curve** | Linear → exponential | Linear (commodity hardware) |
| **Upper limit** | Hard ceiling (largest machine) | Theoretically unbounded |
| **Latency** | Intra-process, no network hop | Inter-process, network overhead |
| **Downtime to scale** | Often yes (reboot needed) | No (rolling deployments) |

\`\`\`callout
{ "type": "warning", "title": "The Vertical Scaling Trap", "content": "Teams often start with vertical scaling because it's fast — just upgrade the instance. But at some point you hit the largest available machine. At AWS, that's \`u-24tb1.metal\` at ~$218/hour. If you haven't built for horizontal scaling by then, you're in trouble. Start planning the horizontal path early, even if you're not using it yet." }
\`\`\`

---

## When to Choose Each Approach

\`\`\`steps
{ "title": "Decision Framework: Which Scaling Strategy?", "steps": [
  {
    "title": "Assess your application's state model",
    "content": "**Is your app stateless?** If requests are independent and don't rely on in-memory session data, horizontal scaling is viable.\\n\\n- **Stateless** (REST APIs, microservices): → Horizontal is straightforward\\n- **Stateful** (sessions in RAM, long-running computations): → Vertical first, or redesign for distributed state (Redis, sticky sessions)"
  },
  {
    "title": "Evaluate your growth trajectory",
    "content": "**How fast are you growing, and for how long?**\\n\\n- **Slow, predictable growth** (startup, internal tool): Vertical scaling is cheaper and simpler to operate\\n- **Rapid or unpredictable spikes** (viral app, seasonal traffic): Horizontal with auto-scaling handles bursts gracefully"
  },
  {
    "title": "Check your fault-tolerance requirements",
    "content": "**What happens if your server goes down?**\\n\\n- **Tolerable downtime** (batch jobs, dev environments): Vertical is fine\\n- **Zero-downtime required** (payments, healthcare, SaaS): Horizontal is mandatory — you need redundancy"
  },
  {
    "title": "Factor in software licensing and legacy constraints",
    "content": "Some database licenses charge per server (not per core), making horizontal scaling far more expensive. Legacy monoliths with tight coupling often can't distribute safely.\\n\\n- **Per-server licensed software** → Vertical is cheaper\\n- **Cloud-native, containerized apps** → Horizontal is natural"
  },
  {
    "title": "Consider the hybrid path",
    "content": "Most production systems use **both**:\\n\\n1. Vertically scale each node to a reasonable size (avoid too-small instances with high coordination overhead)\\n2. Horizontally scale clusters of those nodes for redundancy and throughput\\n\\nExample: 3 × \`m7g.4xlarge\` instances behind a load balancer — each node is 'vertically reasonable'; the cluster is horizontally redundant."
  }
] }
\`\`\`

---

## Real-World Case Studies

\`\`\`tabs
{ "tabs": [
  {
    "label": "Twitter (2008–2013)",
    "icon": "🐦",
    "content": "**The 'fail whale' era — a vertical-scaling wall.**\\n\\nTwitter's early architecture ran on a handful of large Ruby on Rails monolith servers. They vertically scaled aggressively — but during major events (the 2008 US election, Michael Jackson's death), the platform collapsed under load.\\n\\n**The root problem:** A monolith can only scale up so far. Inter-service calls happened in-process, so one slow component blocked everything.\\n\\n**The fix:** Twitter spent years breaking the monolith into services (eventually moving to Scala/Finagle), enabling horizontal scaling of individual components. The Home Timeline service, for example, became a horizontally scaled fleet that could absorb spikes independently.\\n\\n**Lesson:** Vertical scaling deferred the reckoning but didn't prevent it. The architectural rewrite was unavoidable."
  },
  {
    "label": "Stack Overflow",
    "icon": "📚",
    "content": "**A deliberate vertical-scaling success story.**\\n\\nStack Overflow famously runs on just a handful of massively powerful physical servers — far fewer than most engineers expect for a top-50 global website.\\n\\n**Their approach:**\\n- Heavily optimized .NET application with aggressive in-process caching\\n- Two SQL Server primaries with \`1.5 TB\` of RAM each\\n- Roughly 9 web servers for the main site\\n\\n**Why vertical works for them:**\\n- Relational data model is hard to shard\\n- Tight latency requirements (cache reads are nanoseconds vs. network milliseconds)\\n- Traffic is read-heavy and highly cacheable\\n- The team is small — fewer machines = less operational complexity\\n\\n**Lesson:** Vertical scaling is underrated when your workload is CPU/memory-bound and your data model resists distribution."
  },
  {
    "label": "Netflix",
    "icon": "🎬",
    "content": "**Horizontal scaling at extreme scale.**\\n\\nNetflix serves ~250 million subscribers and delivers more than 15% of global internet traffic at peak hours. Every component of their architecture is horizontally scaled across multiple AWS regions.\\n\\n**How it works:**\\n- Microservices architecture: 1,000+ independent services\\n- Each service auto-scales horizontally based on CPU/memory/custom metrics\\n- Chaos Monkey deliberately kills instances to ensure no service depends on any single node\\n- Stateless request handling — all state is pushed to Cassandra, Redis, or S3\\n\\n**Key enabler:** The entire system was designed from the ground up to be stateless. Engineers refer to this as 'treating servers as cattle, not pets.'\\n\\n**Lesson:** At Netflix scale, horizontal is the only option — but it required designing every service to be independently deployable and stateless."
  }
] }
\`\`\`

---

## The Statelessness Requirement

Horizontal scaling has one non-negotiable prerequisite: your application must be **stateless**.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Stateful — Breaks Horizontal Scaling", "code": "// Session stored in local memory — PROBLEM!\\nconst sessions = {};\\n\\napp.post('/login', (req, res) => {\\n  const token = generateToken();\\n  sessions[token] = { userId: req.body.userId }; // In-memory!\\n  res.json({ token });\\n});\\n\\napp.get('/profile', (req, res) => {\\n  const session = sessions[req.headers.token]; // Only on THIS server!\\n  if (!session) return res.status(401).send('Unauthorized');\\n  res.json({ userId: session.userId });\\n});\\n// If load balancer routes next request to Server 2,\\n// sessions{} is empty there — user gets 401!" }, "after": { "label": "Stateless — Horizontal-Scaling Ready", "code": "// Session stored in Redis — CORRECT!\\nimport { redis } from './redis-client';\\n\\napp.post('/login', async (req, res) => {\\n  const token = generateToken();\\n  await redis.setex(token, 3600, JSON.stringify({\\n    userId: req.body.userId\\n  })); // Shared external store\\n  res.json({ token });\\n});\\n\\napp.get('/profile', async (req, res) => {\\n  const session = await redis.get(req.headers.token); // Any server can read!\\n  if (!session) return res.status(401).send('Unauthorized');\\n  res.json(JSON.parse(session));\\n});\\n// Load balancer can route to any server —\\n// all read from the same Redis instance." } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The 12-Factor App Principle", "content": "The '12-Factor App' methodology (widely used at Heroku, Kubernetes, and cloud-native shops) mandates that processes be stateless and share-nothing. If you follow this from day one, horizontal scaling becomes a deployment config change, not an architectural rewrite." }
\`\`\`

---

## The Hybrid Pattern in Practice

\`\`\`concept
{ "title": "Vertically Scaled Clusters", "variant": "insight", "content": "The most common production pattern is neither pure vertical nor pure horizontal — it's clusters of reasonably powerful machines. Each node is vertically sized to avoid excessive inter-process coordination overhead (too-small nodes waste time on network chatter). The cluster is horizontally sized for redundancy and throughput. Database sharding is a perfect example: each shard node might be a powerful 32-core machine (vertical), while the shards themselves are distributed across many nodes (horizontal)." }
\`\`\`

A concrete example from database architecture:

\`\`\`
Total data: 10 TB across 10 shards
Each shard node: 1 TB, 32 CPU, 128 GB RAM (vertically sized)
Shards distributed: 10 servers (horizontally scaled)

Result: You get vertical performance (fast intra-node queries)
        + horizontal scalability (add shard 11 for more capacity)
        + fault tolerance (shard 3 going down affects only 10% of data)
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  {
    "question": "Your startup's API server uses in-memory sessions (stored in a HashMap on each server). You want to scale horizontally from 1 to 5 servers. What will break?",
    "options": [
      "Nothing — load balancers handle session routing automatically",
      "Users will get logged out if their request routes to a different server than where they logged in",
      "The HashMap will automatically sync across servers via multicast",
      "CPU usage will spike but sessions will still work"
    ],
    "answer": 1,
    "explanation": "In-memory sessions are local to each server. If Server 1 stores a session and the load balancer routes the next request to Server 3, that server has no record of the session — the user appears unauthenticated. The fix is to move sessions to a shared external store like Redis."
  },
  {
    "question": "Stack Overflow runs a top-50 global website on just ~9 web servers with massive RAM. This is primarily an example of:",
    "options": [
      "Horizontal scaling with microservices",
      "Vertical scaling optimized for a read-heavy, cacheable workload",
      "Auto-scaling groups that collapse to few instances at low traffic",
      "Serverless functions behind a CDN"
    ],
    "answer": 1,
    "explanation": "Stack Overflow deliberately chose vertical scaling — investing in fewer, more powerful machines with huge RAM for caching. This works because their workload is read-heavy, highly cacheable, and tightly coupled to a relational database that's hard to shard. It's a valid tradeoff, not a mistake."
  },
  {
    "question": "A financial trading platform requires sub-millisecond response times for order matching. Network round-trips between distributed nodes take 0.5–2ms. Which scaling approach is most appropriate for the order-matching engine itself?",
    "options": [
      "Horizontal scaling across 20 commodity servers for maximum throughput",
      "Vertical scaling on a single high-performance machine to avoid network latency",
      "Microservices with event-driven horizontal scaling",
      "Serverless functions that scale to zero between trades"
    ],
    "answer": 1,
    "explanation": "When latency is measured in microseconds, the 0.5–2ms network overhead of inter-node communication is unacceptable. A vertically scaled single machine with intra-process communication avoids this. High-frequency trading systems like those at Jane Street and Citadel use this pattern for their core matching engines, reserving horizontal scaling for adjacent (latency-tolerant) components like reporting or risk calculation."
  },
  {
    "question": "Netflix's ability to scale horizontally is primarily enabled by:",
    "options": [
      "Using the largest available AWS instance types",
      "Sticky sessions that pin users to specific servers",
      "Stateless service design where all state is stored in external systems",
      "Database replication across regions"
    ],
    "answer": 2,
    "explanation": "Netflix's horizontal scalability rests on stateless services — every service instance can handle any request because no state is stored locally. State lives in shared systems (Cassandra, Redis, S3). This is why Chaos Monkey can kill any instance at any time without user impact: the system simply routes requests to surviving instances."
  },
  {
    "question": "A legacy monolithic application has sessions in RAM and tight coupling between modules. It's experiencing load issues. What is the MOST practical first step?",
    "options": [
      "Immediately decompose into 50 microservices and horizontally scale",
      "Vertically scale while planning a gradual architectural migration to statelessness",
      "Add a load balancer and distribute traffic across 10 identical monolith instances",
      "Rewrite the entire application in Go for better concurrency"
    ],
    "answer": 1,
    "explanation": "For legacy stateful monoliths, vertical scaling buys time while you plan the migration. Immediately adding a load balancer won't work (stateful sessions break across instances). A full microservices rewrite is expensive and risky. The pragmatic path: scale up now, migrate sessions to Redis, then horizontally scale, then gradually decompose. This matches how Twitter, LinkedIn, and eBay handled their scaling crises."
  }
] }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: The Cost Math Behind Each Approach", "content": "**Vertical scaling cost curve:**\\n\\nCloud providers charge a premium for large instances. On AWS (as of 2024 approximate pricing):\\n- \`m7g.large\` (2 vCPU, 8 GB): ~$0.08/hr\\n- \`m7g.xlarge\` (4 vCPU, 16 GB): ~$0.16/hr — 2× resource, 2× cost ✓\\n- \`m7g.4xlarge\` (16 vCPU, 64 GB): ~$0.65/hr — 8× resource, 8× cost ✓\\n- \`m7g.16xlarge\` (64 vCPU, 256 GB): ~$2.60/hr — 32× resource, 32× cost ✓\\n- \`u-24tb1.metal\` (448 vCPU, 24 TB): ~$218/hr — extreme, near-linear again ✓\\n\\nLinear cost scaling sounds good — but you're also paying for resources you don't fully use (a 256 GB machine running at 30% utilization wastes 70% of RAM cost).\\n\\n**Horizontal scaling cost curve:**\\n\\n10 × \`m7g.large\` = $0.80/hr for 20 vCPU / 80 GB total, vs. $0.65/hr for 1 × \`m7g.4xlarge\` (16 vCPU / 64 GB). Slightly more expensive per unit, but:\\n- You can scale down to 2 instances at night\\n- One instance failure = 10% capacity loss, not 100%\\n- Spot instances can cut cost by 60–90%\\n\\n**The key insight:** Vertical scaling is usually cheaper at small scale because you're not paying for coordination overhead (load balancers, service meshes, distributed tracing). Horizontal scaling becomes cheaper at large scale because you can use commodity hardware and spot/preemptible instances. The crossover point is typically around 4–8 large instances." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Vertical scaling (scale up) adds resources to one machine — no code changes, but a hard hardware ceiling and a single point of failure.",
  "Horizontal scaling (scale out) adds more machines — theoretically unlimited capacity, but requires stateless application design and a load balancer.",
  "Statelessness is the prerequisite for horizontal scaling: sessions, cache, and shared state must live in external stores (Redis, databases), not in application memory.",
  "Most production systems use a hybrid: vertically sized nodes clustered horizontally. Neither extreme is usually optimal.",
  "Choose vertical when: latency is critical, the app is stateful/legacy, or growth is slow and predictable. Choose horizontal when: you need high availability, traffic is unpredictable, or you're building cloud-native from the start.",
  "Plan your horizontal path early — retrofitting statelessness into a stateful monolith is expensive, as Twitter and others discovered the hard way."
] }
\`\`\``,
    },
    {
      id: "load-balancing-deep-dive",
      slug: "load-balancing-deep-dive",
      title: "Load Balancing: Algorithms and Architecture",
      content: `# Load Balancing: Algorithms and Architecture

When your startup gets featured on the front page of Hacker News, thousands of requests arrive simultaneously. A single server buckles. Load balancing is the traffic cop that keeps your system standing — and the *algorithm* it uses determines whether you have a fair, efficient, or even sticky distribution.

By the end of this lesson you'll know how Round Robin, Least Connections, IP Hash, and Consistent Hashing work under the hood, when to reach for each, and how Layer 4 vs Layer 7 balancers change your options entirely.

---

\`\`\`concept
{
  "title": "What a Load Balancer Actually Does",
  "variant": "mental-model",
  "content": "A load balancer sits between clients and a pool of servers. It accepts every incoming connection, applies an algorithm to pick a backend, then forwards the request — hiding the pool behind a single virtual IP. From the client's perspective there is one server; from the servers' perspective there are many clients — but each only receives a manageable share."
}
\`\`\`

---

## Layer 4 vs Layer 7 — Choosing Your Weapon

Before picking an algorithm you must pick a *layer*. The OSI layer at which the balancer operates determines what information it can see — and therefore which algorithms are even possible.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Layer 4 (Transport)",
      "icon": "🔌",
      "content": "**Works at:** TCP/UDP level\\n\\n**Sees:** Source IP, destination IP, port — nothing about the HTTP payload.\\n\\n**Decision speed:** Extremely fast — routes packets without parsing application data.\\n\\n**Algorithms available:** Round Robin, IP Hash, Least Connections (by TCP connection count).\\n\\n**Use when:** Raw throughput matters more than request-level intelligence. Examples: database connection pooling, game servers, media streaming.\\n\\n\`\`\`\\nClient → [LB sees: src=1.2.3.4:51234 → dst=80] → Server A\\n\`\`\`\\n\\n**Cannot do:** Route \`/api\` to one cluster and \`/static\` to another — it never reads the URL."
    },
    {
      "label": "Layer 7 (Application)",
      "icon": "🌐",
      "content": "**Works at:** HTTP/HTTPS, gRPC, WebSocket level\\n\\n**Sees:** Full request — URL path, headers, cookies, request body.\\n\\n**Decision speed:** Slightly slower — must parse the HTTP envelope before routing.\\n\\n**Algorithms available:** All L4 algorithms **plus** content-based routing, header-based stickiness, and A/B traffic splitting.\\n\\n**Use when:** You need intelligent routing. Examples: microservices (route by path), canary deployments (route 5% of traffic by header), session affinity (route by cookie).\\n\\n\`\`\`\\nClient → [LB sees: GET /api/users HTTP/1.1\\\\nHost: api.example.com] → Users Service\\nClient → [LB sees: GET /images/logo.png] → CDN Origin\\n\`\`\`\\n\\n**Real-world tools:** AWS ALB, NGINX, HAProxy (L7 mode), Envoy, Traefik."
    },
    {
      "label": "When to Use Which",
      "icon": "⚖️",
      "content": "| Scenario | Choose |\\n|---|---|\\n| High-throughput TCP service (DB proxy, game server) | **L4** |\\n| HTTP microservices needing path-based routing | **L7** |\\n| TLS termination + cert management | **L7** |\\n| Raw packet forwarding at line rate | **L4** |\\n| A/B testing or canary deployments | **L7** |\\n| WebSocket connections (long-lived, stateful) | **L7** with sticky sessions |\\n\\n> **Tip:** Many production stacks layer them — a fast L4 NLB in front absorbs the TCP handshake cost, then forwards to an L7 ALB that does content routing."
    }
  ]
}
\`\`\`

---

## Static Algorithms: No Server State Required

Static algorithms make routing decisions based solely on *predefined rules* — they don't monitor how busy each server actually is. They're fast and simple.

### Round Robin

Each new request goes to the next server in a circular sequence. After the last server, wrap back to the first.

\`\`\`algoviz
{
  "title": "Round Robin — 6 Requests Across 3 Servers",
  "type": "array",
  "data": ["S1", "S2", "S3"],
  "frames": [
    { "highlight": [0], "label": "Request 1 → Server 1", "stats": { "req": 1, "server": "S1" } },
    { "highlight": [1], "label": "Request 2 → Server 2", "stats": { "req": 2, "server": "S2" } },
    { "highlight": [2], "label": "Request 3 → Server 3", "stats": { "req": 3, "server": "S3" } },
    { "highlight": [0], "label": "Request 4 → back to Server 1", "stats": { "req": 4, "server": "S1" } },
    { "highlight": [1], "label": "Request 5 → Server 2", "stats": { "req": 5, "server": "S2" } },
    { "highlight": [2], "label": "Request 6 → Server 3", "stats": { "req": 6, "server": "S3" } }
  ],
  "speed": 900
}
\`\`\`

\`\`\`playground
{
  "title": "Round Robin — Minimal Implementation",
  "language": "python",
  "code": "servers = [\\"S1\\", \\"S2\\", \\"S3\\"]\\nindex = 0\\n\\ndef round_robin():\\n    global index\\n    server = servers[index % len(servers)]\\n    index += 1\\n    return server\\n\\n# Simulate 9 incoming requests\\nfor req_id in range(1, 10):\\n    print(f\\"Request {req_id} → {round_robin()}\\")",
  "runnable": true
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Round Robin's Hidden Assumption",
  "content": "Round Robin assumes all requests are equal weight and all servers are identical. If Request 3 is a 5-second video transcode and Request 4 is a 10ms health check, S1 and S2 diverge wildly — S1 stacks up while S2 sits idle. For heterogeneous workloads, reach for **Least Connections** or **Weighted Round Robin** instead."
}
\`\`\`

---

### IP Hash (Session Affinity)

Hash the client's IP address to deterministically pick a server. The *same client always reaches the same server* — useful for stateful sessions that can't migrate between servers.

\`\`\`trace
{
  "title": "IP Hash Routing Logic",
  "language": "python",
  "code": "def ip_hash(client_ip, servers):\\n    # Deterministic hash maps IP to server index\\n    hash_val = hash(client_ip)\\n    index = hash_val % len(servers)\\n    return servers[index]\\n\\nservers = [\\"S1\\", \\"S2\\", \\"S3\\"]\\n\\nip_a = \\"192.168.1.10\\"\\nip_b = \\"10.0.0.5\\"\\n\\nresult_a1 = ip_hash(ip_a, servers)\\nresult_a2 = ip_hash(ip_a, servers)  # same IP, same server\\nresult_b  = ip_hash(ip_b, servers)\\n\\nprint(f\\"{ip_a} request 1 → {result_a1}\\")\\nprint(f\\"{ip_a} request 2 → {result_a2}\\")\\nprint(f\\"{ip_b}  request   → {result_b}\\")",
  "frames": [
    { "line": 2, "vars": {}, "note": "Define the hash function" },
    { "line": 3, "vars": { "client_ip": "192.168.1.10" }, "note": "Python's built-in hash is deterministic within a process" },
    { "line": 4, "vars": { "hash_val": "some integer" }, "note": "Modulo maps the hash into [0, len(servers))" },
    { "line": 5, "vars": { "index": 2 }, "note": "Pick server at that index" },
    { "line": 14, "vars": { "result_a1": "S3" }, "note": "192.168.1.10 always maps to S3" },
    { "line": 15, "vars": { "result_a2": "S3" }, "note": "Second request from same IP — same server!" },
    { "line": 16, "vars": { "result_b": "S1" }, "note": "Different IP maps to a different server" }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`callout
{
  "type": "danger",
  "title": "IP Hash Breaks When Servers Are Added or Removed",
  "content": "If you add a 4th server, \`hash(ip) % 4\` produces different results than \`hash(ip) % 3\`. Almost every client maps to a *new* server — destroying session affinity and invalidating caches. This is the core motivation for **Consistent Hashing** (covered below)."
}
\`\`\`

---

## Dynamic Algorithms: React to Real Load

Dynamic algorithms query each server's current state before routing. They require the load balancer to maintain a lightweight connection-count table — but they respond to uneven workloads.

### Least Connections

Route each new request to the server with the *fewest active connections* at that instant.

\`\`\`playground
{
  "title": "Least Connections Simulation",
  "language": "python",
  "code": "import random\\n\\n# Simulate servers with active connection counts\\nservers = {\\"S1\\": 5, \\"S2\\": 2, \\"S3\\": 8}\\n\\ndef least_connections(servers):\\n    \\"\\"\\"Return server with minimum active connections.\\"\\"\\"\\n    return min(servers, key=servers.get)\\n\\ndef handle_request(servers, duration_range=(1, 4)):\\n    target = least_connections(servers)\\n    # Connection opens\\n    servers[target] += 1\\n    print(f\\"  Routed to {target} (now {servers[target]} conns) | State: {dict(servers)}\\")\\n    # Simulate connection closing after random duration\\n    # (In real life this is async; here we randomly decrement)\\n    closing = random.choice(list(servers.keys()))\\n    if servers[closing] > 0:\\n        servers[closing] -= 1\\n\\nprint(\\"Simulating 8 requests:\\\\n\\")\\nfor i in range(1, 9):\\n    print(f\\"Request {i}:\\")\\n    handle_request(servers)\\n",
  "runnable": true
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Least Connections is best for long-lived, variable requests",
  "content": "It shines when request durations vary significantly — database queries, file uploads, video processing. For uniform short-lived requests (< 10ms REST calls), the overhead of tracking connections outweighs the benefit and Round Robin is simpler."
}
\`\`\`

---

## Consistent Hashing — The Algorithm That Changed Distributed Systems

Simple modulo hashing (\`hash(key) % N\`) causes massive remapping when N changes. Consistent Hashing limits remapping to only \`K/N\` keys on average (where K = total keys, N = servers).

\`\`\`concept
{
  "title": "The Hash Ring",
  "variant": "analogy",
  "content": "Picture a clock face numbered 0–360. Each server is placed at a position on the clock by hashing its name. Each request key is also hashed to a position. The request travels clockwise until it hits the first server — that server owns it.\\n\\nWhen you add a new server, it only takes over requests between itself and the previous server clockwise — all other assignments are unchanged. Removing a server just hands its arc to the next clockwise neighbor."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Consistent Hash Ring — Adding a Server",
  "type": "array",
  "data": ["S1@60°", "S2@150°", "S3@270°", "RING"],
  "frames": [
    { "highlight": [0, 1, 2], "label": "Initial ring: S1 at 60°, S2 at 150°, S3 at 270°", "stats": { "servers": 3 } },
    { "highlight": [0], "label": "Request hash=80° → travels clockwise → hits S2 at 150°", "stats": { "req_pos": "80°", "routes_to": "S2" } },
    { "highlight": [1], "label": "Request hash=200° → travels clockwise → hits S3 at 270°", "stats": { "req_pos": "200°", "routes_to": "S3" } },
    { "highlight": [3], "label": "Add S4 at 100° on the ring", "stats": { "servers": 4 } },
    { "highlight": [0], "label": "Now request hash=80° → hits S4 at 100° (only this arc remapped!)", "stats": { "req_pos": "80°", "routes_to": "S4 (changed)" } },
    { "highlight": [1], "label": "Request hash=200° → still hits S3 at 270° (unchanged)", "stats": { "req_pos": "200°", "routes_to": "S3 (same)" } }
  ],
  "speed": 1100
}
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: Virtual Nodes (vnodes)",
  "content": "A naive consistent hash ring creates uneven arcs — S1 might own 40% of the ring while S3 owns 10%. **Virtual nodes** fix this.\\n\\nEach physical server is hashed *multiple times* under different labels (\`S1-v1\`, \`S1-v2\`, \`S1-v3\`) and placed at multiple positions on the ring. With 150 virtual nodes per server, distribution converges to roughly equal shares.\\n\\n\`\`\`python\\nimport hashlib\\n\\ndef add_server_vnodes(ring, server, vnodes=150):\\n    for i in range(vnodes):\\n        key = f\\"{server}-v{i}\\"\\n        pos = int(hashlib.md5(key.encode()).hexdigest(), 16) % 360\\n        ring[pos] = server\\n    return ring\\n\`\`\`\\n\\nKassandra, Redis Cluster, and Amazon DynamoDB all use virtual nodes internally."
}
\`\`\`

---

## Algorithm Comparison

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Summary Table",
      "icon": "📊",
      "content": "| Algorithm | Type | State needed | Best for | Weakness |\\n|---|---|---|---|---|\\n| Round Robin | Static | None | Uniform requests, identical servers | Ignores server load |\\n| Weighted RR | Static | Weights only | Mixed server capacities | Stale weights |\\n| IP Hash | Static | None | Session affinity (L4) | Breaks on server add/remove |\\n| Least Connections | Dynamic | Connection count | Long-lived, variable requests | Higher LB overhead |\\n| Least Response Time | Dynamic | RTT + connections | Latency-sensitive APIs | Requires active probing |\\n| Consistent Hash | Static/Dynamic | Hash ring | Distributed caches, stable pools | Complexity of vnodes |"
    },
    {
      "label": "Decision Guide",
      "icon": "🧭",
      "content": "**Start here:**\\n\\n1. Are your requests roughly equal in cost and your servers identical?\\n   → **Round Robin** — simplest, zero overhead.\\n\\n2. Do sessions need to stick to one server (shopping cart, WebSocket)?\\n   → **IP Hash** (if pool is stable) or **L7 cookie-based affinity**.\\n\\n3. Do requests vary wildly in duration (file uploads, queries, transcoding)?\\n   → **Least Connections** — prevents hot spots.\\n\\n4. Are you building a distributed cache or a system that scales frequently?\\n   → **Consistent Hashing** — minimize cache invalidation on rescale.\\n\\n5. Do you need sub-millisecond routing decisions at line rate?\\n   → **L4 Round Robin** or **L4 IP Hash** — skip L7 parsing overhead."
    }
  ]
}
\`\`\`

---

## Practice: Fill in the Gaps

\`\`\`fillblank
{
  "title": "Implement Round Robin Index Advance",
  "prompt": "Complete the round_robin function so it returns the correct server and advances the index with wrap-around.",
  "language": "python",
  "template": "servers = [\\"S1\\", \\"S2\\", \\"S3\\"]\\ncurrent = 0\\n\\ndef round_robin():\\n    global current\\n    server = servers[___]\\n    current = (___ + 1) % len(servers)\\n    return server\\n\\nfor _ in range(6):\\n    print(round_robin())",
  "blanks": [
    { "answer": "current", "hint": "Use the current index to pick from the list" },
    { "answer": "current", "hint": "Increment current before wrapping" }
  ]
}
\`\`\`

\`\`\`fillblank
{
  "title": "Least Connections Selection",
  "prompt": "Complete the function to return the server with the fewest active connections.",
  "language": "python",
  "template": "def least_connections(server_load: dict) -> str:\\n    return ___(server_load, key=server_load.___)\\n\\nload = {\\"S1\\": 10, \\"S2\\": 3, \\"S3\\": 7}\\nprint(least_connections(load))  # Should print S2",
  "blanks": [
    { "answer": "min", "hint": "You want the server with the minimum value" },
    { "answer": "get", "hint": "Pass the dict's value-accessor as the key function" }
  ]
}
\`\`\`

---

## Architecture: Health Checks and Fault Tolerance

A load balancer is only as good as its awareness of which servers are alive.

\`\`\`steps
{
  "title": "How Health Checks Work",
  "steps": [
    {
      "title": "Passive health checks",
      "content": "The LB monitors actual request responses. If a server returns 5xx errors or times out above a threshold, it's marked unhealthy and removed from rotation.\\n\\n**Pros:** Zero extra traffic.  \\n**Cons:** Real user requests fail before the server is pulled."
    },
    {
      "title": "Active health checks",
      "content": "The LB proactively sends a lightweight probe (e.g., \`GET /health\`) every N seconds.\\n\\n\`\`\`\\nLB → GET /health HTTP/1.1 → S1\\nS1 → 200 OK {status: \\"ok\\"}  ← healthy\\nS2 → TCP timeout            ← unhealthy, removed\\n\`\`\`\\n\\n**Pros:** Failures detected before user impact.  \\n**Cons:** Extra traffic; \`200 /health\` can mask deep failures (check DB connectivity too)."
    },
    {
      "title": "Graceful removal",
      "content": "When a server fails, the LB:\\n1. Stops sending **new** connections to it.\\n2. Allows **in-flight** connections to drain (configurable drain timeout, typically 30–60s).\\n3. Marks it out of rotation.\\n\\nThis prevents abruptly cutting off requests mid-stream — crucial for long-lived uploads or streaming responses."
    },
    {
      "title": "Re-introduction after recovery",
      "content": "A server re-enters rotation only after passing N consecutive health checks (e.g., 3 in a row). This prevents flapping — where a barely-healthy server bounces in and out of the pool."
    }
  ]
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Load Balancer Architecture with Health Checks",
  "width": 620,
  "height": 320,
  "nodes": [
    { "id": "client", "label": "Clients", "x": 60, "y": 160, "kind": "client" },
    { "id": "lb", "label": "Load Balancer\\n(L7)", "x": 210, "y": 160, "kind": "service" },
    { "id": "s1", "label": "Server 1\\n✅ healthy", "x": 400, "y": 60, "kind": "service" },
    { "id": "s2", "label": "Server 2\\n✅ healthy", "x": 400, "y": 160, "kind": "service" },
    { "id": "s3", "label": "Server 3\\n❌ down", "x": 400, "y": 260, "kind": "service" },
    { "id": "hc", "label": "Health\\nChecker", "x": 210, "y": 280, "kind": "component" }
  ],
  "edges": [
    { "from": "client", "to": "lb", "label": "requests" },
    { "from": "lb", "to": "s1", "label": "route" },
    { "from": "lb", "to": "s2", "label": "route" },
    { "from": "hc", "to": "s1", "label": "GET /health" },
    { "from": "hc", "to": "s2", "label": "GET /health" },
    { "from": "hc", "to": "s3", "label": "timeout" },
    { "from": "hc", "to": "lb", "label": "mark S3 out" }
  ],
  "annotations": {
    "lb": "Applies algorithm (e.g. Round Robin) only across healthy servers. Receives health verdicts from checker.",
    "hc": "Probes each server every 5s. Removes servers that fail 2 consecutive checks. Re-admits after 3 passes.",
    "s3": "Currently timing out on health probes — excluded from routing despite being in the registered pool."
  }
}
\`\`\`

---

## Quiz

\`\`\`quiz
{
  "title": "Load Balancing: Check Your Understanding",
  "questions": [
    {
      "question": "You're building a distributed in-memory cache that must minimize cache misses when servers are added or removed. Which algorithm is best suited?",
      "options": [
        "Round Robin — simple and predictable",
        "Least Connections — routes to least loaded server",
        "Consistent Hashing — limits remapping to K/N keys on rescale",
        "IP Hash — maps client IP to server deterministically"
      ],
      "answer": 2,
      "explanation": "Consistent Hashing is the standard choice for distributed caches. When a server is added or removed, only the keys in the affected arc of the ring need remapping — typically ~1/N of all keys. Round Robin and Least Connections remap all keys. IP Hash uses simple modulo which remaps almost everything when N changes."
    },
    {
      "question": "A Layer 4 load balancer CANNOT perform which of the following?",
      "options": [
        "Route TCP connections to backend servers",
        "Distribute UDP packets across a pool",
        "Route requests to different backends based on the URL path",
        "Perform Round Robin across server IPs"
      ],
      "answer": 2,
      "explanation": "L4 load balancers operate at the TCP/UDP level and never parse the HTTP payload. URL path inspection requires reading the HTTP request line, which is application-layer data — only an L7 load balancer can do this. L4 balancers can do all the others without understanding application protocol."
    },
    {
      "question": "Your system uses IP Hash for session affinity. A deployment scales the backend from 3 servers to 4. What is the most likely consequence?",
      "options": [
        "Traffic smoothly redistributes — 25% moves to the new server",
        "Almost all clients are remapped to different servers, breaking sessions",
        "Only clients whose hash modulo changed from 3 to 4 are affected — roughly 25%",
        "No clients are remapped because IP Hash is stateless"
      ],
      "answer": 1,
      "explanation": "Simple IP Hash uses \`hash(ip) % N\`. Changing N from 3 to 4 changes the modulo result for the vast majority of IPs — approximately 75% of clients will be routed to a different server than before. This destroys session state and is why Consistent Hashing was invented. The correct answer is not 25% because the modulo operation is not additive — most existing mappings change."
    },
    {
      "question": "For a video transcoding API where each request takes 2–30 seconds depending on file size, which algorithm would most effectively prevent server overload?",
      "options": [
        "Round Robin",
        "IP Hash",
        "Least Connections",
        "Weighted Round Robin with equal weights"
      ],
      "answer": 2,
      "explanation": "Least Connections tracks how many active requests each server is currently handling. With variable-duration requests, a server that received several 30-second jobs will accumulate connections while others are free. Least Connections routes new requests away from busy servers dynamically. Round Robin and equal-weight Weighted Round Robin are blind to this and will continue routing to overloaded servers."
    },
    {
      "question": "What is the purpose of a 'drain timeout' during server removal from a load balancer pool?",
      "options": [
        "Give the health checker time to confirm the server is down",
        "Allow in-flight requests to complete before fully removing the server",
        "Flush the server's memory cache before taking it offline",
        "Prevent the algorithm from selecting the server during CPU-intensive operations"
      ],
      "answer": 1,
      "explanation": "A drain timeout (typically 30–60 seconds) stops new connections from being sent to a departing server while allowing existing in-flight requests to finish naturally. Without draining, users mid-upload or mid-stream get abruptly disconnected. The LB marks the server as 'draining', routes all new traffic elsewhere, then fully removes it once the drain period expires or connections reach zero."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "L4 balancers route by IP/port with minimal overhead; L7 balancers inspect HTTP headers and URLs for intelligent content-based routing — choose based on whether you need request-level awareness.",
    "Round Robin is ideal for uniform, stateless workloads; Least Connections handles heterogeneous request durations by routing to the server with fewest active connections.",
    "Simple modulo IP Hash breaks session affinity when the server count changes — Consistent Hashing solves this by limiting remapping to ~K/N keys using a hash ring with virtual nodes.",
    "Health checks (active probes + passive error tracking) must be combined with drain timeouts to safely remove servers without disrupting in-flight requests.",
    "In practice, production stacks layer balancers: a fast L4 NLB absorbs TCP costs, then an L7 ALB handles path routing, SSL termination, and algorithm selection per service."
  ]
}
\`\`\``,
      starterCode: `# Load Balancing Algorithms
# Implement four load balancing strategies and a basic dispatcher.

import hashlib
from collections import defaultdict

# Simulated backend servers
SERVERS = ["server-1", "server-2", "server-3", "server-4"]

# Track active connections per server (for least-connections)
active_connections = defaultdict(int)

# Round-robin state
rr_index = 0


def round_robin(servers: list[str]) -> str:
    """Return the next server using round-robin rotation."""
    global rr_index
    # TODO: Select server at rr_index, then advance rr_index
    # Hint: use modulo to wrap around when rr_index >= len(servers)
    pass


def least_connections(servers: list[str]) -> str:
    """Return the server with the fewest active connections."""
    # TODO: Return the server name with the minimum value in active_connections
    # Hint: use min() with a key= argument
    pass


def ip_hash(client_ip: str, servers: list[str]) -> str:
    """Route a client IP to a consistent server using a hash."""
    # TODO: Hash client_ip with hashlib.md5, convert to int, mod by len(servers)
    # Return servers[index]
    pass


def consistent_hash(client_ip: str, servers: list[str], virtual_nodes: int = 100) -> str:
    """Consistent hashing with virtual nodes for minimal remapping on scale changes."""
    # Build the ring: each server gets \`virtual_nodes\` positions
    ring = {}  # hash_position -> server_name
    for server in servers:
        for i in range(virtual_nodes):
            # TODO: Hash f"{server}-{i}" and map the int position to server
            key = int(hashlib.md5(f"{server}-{i}".encode()).hexdigest(), 16)
            ring[key] = server

    # TODO: Hash the client_ip to get its position on the ring
    # Then find the nearest server clockwise (smallest key >= client position)
    # If no key >= client position exists, wrap around to the smallest key
    pass


# --- Dispatcher ---

def dispatch(client_ip: str, algorithm: str) -> str:
    """Route a request to a server using the chosen algorithm."""
    # TODO: Call the correct function based on \`algorithm\`
    # Supported values: "round_robin", "least_connections", "ip_hash", "consistent_hash"
    # After selecting a server, increment its active_connections count
    # Raise ValueError for unknown algorithms
    pass


def release(server: str) -> None:
    """Decrement active connections when a request finishes."""
    # TODO: Decrement active_connections[server] (minimum 0)
    pass


# --- Tests ---

if __name__ == "__main__":
    print("=== Round Robin ===")
    for _ in range(6):
        print(dispatch("10.0.0.1", "round_robin"))

    # Reset connections for clean test
    active_connections.clear()
    active_connections["server-1"] = 5
    active_connections["server-2"] = 1
    active_connections["server-3"] = 3
    active_connections["server-4"] = 2

    print("\\n=== Least Connections ===")
    print(dispatch("10.0.0.1", "least_connections"))  # Expect server-2
    release("server-2")

    print("\\n=== IP Hash (same IP -> same server) ===")
    results = {dispatch(ip, "ip_hash") for ip in ["10.0.0.1", "10.0.0.1", "10.0.0.1"]}
    print(f"Unique servers for same IP: {len(results)} (expected 1)")

    print("\\n=== Consistent Hash ===")
    ip = "192.168.1.42"
    s1 = consistent_hash(ip, SERVERS)
    s2 = consistent_hash(ip, SERVERS)
    print(f"Same IP routed consistently: {s1 == s2} -> {s1}")
`,
      solutionCode: `# Load Balancing Algorithms — Solution

import hashlib
from collections import defaultdict

SERVERS = ["server-1", "server-2", "server-3", "server-4"]

active_connections = defaultdict(int)
rr_index = 0


def round_robin(servers: list[str]) -> str:
    """Cycles through servers in order, distributing load evenly.
    Best for: homogeneous servers, stateless requests.
    """
    global rr_index
    server = servers[rr_index % len(servers)]
    rr_index += 1
    return server


def least_connections(servers: list[str]) -> str:
    """Picks the server currently handling the fewest requests.
    Best for: variable request durations (e.g. long-running queries).
    """
    return min(servers, key=lambda s: active_connections[s])


def ip_hash(client_ip: str, servers: list[str]) -> str:
    """Hashes the client IP to always route the same client to the same server.
    Best for: session-based apps without a shared session store (L4 balancer).
    Weakness: adding/removing servers remaps ~all clients.
    """
    index = int(hashlib.md5(client_ip.encode()).hexdigest(), 16) % len(servers)
    return servers[index]


def consistent_hash(client_ip: str, servers: list[str], virtual_nodes: int = 100) -> str:
    """Places servers at multiple positions on a hash ring.
    A client is routed to the nearest server clockwise on the ring.
    Adding/removing one server only remaps ~1/N of clients (vs ip_hash's ~all).
    Best for: distributed caches, microservices that scale horizontally.
    """
    # Build ring: server -> virtual_nodes positions
    ring: dict[int, str] = {}
    for server in servers:
        for i in range(virtual_nodes):
            key = int(hashlib.md5(f"{server}-{i}".encode()).hexdigest(), 16)
            ring[key] = server

    sorted_keys = sorted(ring)

    # Find client's position on the ring
    client_pos = int(hashlib.md5(client_ip.encode()).hexdigest(), 16)

    # Walk clockwise to find the nearest server
    for key in sorted_keys:
        if key >= client_pos:
            return ring[key]

    # Wrap around to the first server on the ring
    return ring[sorted_keys[0]]


def dispatch(client_ip: str, algorithm: str) -> str:
    """Central dispatcher: selects a server and tracks the new connection."""
    if algorithm == "round_robin":
        server = round_robin(SERVERS)
    elif algorithm == "least_connections":
        server = least_connections(SERVERS)
    elif algorithm == "ip_hash":
        server = ip_hash(client_ip, SERVERS)
    elif algorithm == "consistent_hash":
        server = consistent_hash(client_ip, SERVERS)
    else:
        raise ValueError(f"Unknown algorithm: {algorithm}")

    active_connections[server] += 1
    return server


def release(server: str) -> None:
    """Called when a request completes — frees the connection slot."""
    active_connections[server] = max(0, active_connections[server] - 1)


# --- Tests ---

if __name__ == "__main__":
    print("=== Round Robin ===")
    for _ in range(6):
        print(dispatch("10.0.0.1", "round_robin"))
    # Output: server-1, server-2, server-3, server-4, server-1, server-2

    active_connections.clear()
    active_connections["server-1"] = 5
    active_connections["server-2"] = 1
    active_connections["server-3"] = 3
    active_connections["server-4"] = 2

    print("\\n=== Least Connections ===")
    print(dispatch("10.0.0.1", "least_connections"))  # server-2 (fewest)
    release("server-2")

    print("\\n=== IP Hash (same IP -> same server) ===")
    results = {dispatch(ip, "ip_hash") for ip in ["10.0.0.1", "10.0.0.1", "10.0.0.1"]}
    print(f"Unique servers for same IP: {len(results)} (expected 1)")

    print("\\n=== Consistent Hash ===")
    ip = "192.168.1.42"
    s1 = consistent_hash(ip, SERVERS)
    s2 = consistent_hash(ip, SERVERS)
    print(f"Same IP routed consistently: {s1 == s2} -> {s1}")
`,
    },
    {
      id: "stateless-vs-stateful-architecture",
      slug: "stateless-vs-stateful-architecture",
      title: "Stateless vs Stateful Architecture",
      content: `# Stateless vs Stateful Architecture

Every request your server handles carries a question underneath it: *do I need to remember something from last time?* The answer shapes everything — how many servers you can run, whether you can survive a crash, and how hard your on-call shift will be at 3 a.m.

This lesson unpacks the stateful/stateless divide: what it really means, why statelessness is the default choice for horizontally scalable systems, and how to handle the cases where you genuinely can't avoid state.

---

## The Waiter Analogy

Before touching architecture diagrams, consider two restaurants.

\`\`\`concept
{ "title": "The Forgetful Waiter vs The Notebook Waiter", "variant": "analogy", "content": "A **stateless** server is like a waiter with no memory. Every time you call them over, you must restate your full order from scratch. It sounds annoying — but it means the restaurant can seat you with *any* available waiter, and no single waiter becomes a bottleneck. A **stateful** server is like a waiter who remembers your running tab and modifications in their head. Faster per interaction, but if that waiter goes home sick, your order is lost — and you always have to find *the same* waiter in a busy restaurant." }
\`\`\`

The waiter analogy maps cleanly to web servers:

- **Stateful server:** holds your session in its own memory — auth status, shopping cart contents, wizard step.
- **Stateless server:** holds nothing. Every request must carry everything the server needs, or the server must fetch it from a shared external store.

---

## Core Definitions

\`\`\`tabs
{ "tabs": [
  {
    "label": "Stateful",
    "icon": "🧠",
    "content": "### Stateful Architecture\\n\\nA server is **stateful** when it stores session data locally — in RAM, on disk, or in a thread-local variable — between requests from the same client.\\n\\n**What lives in the server's memory:**\\n- Active session tokens and which user they map to\\n- Shopping cart contents mid-checkout\\n- Progress through a multi-step form\\n- Authenticated WebSocket connections\\n\\n**Implication:** the load balancer must route all requests from a given user to the **same** server. This is called *sticky sessions* (or session affinity).\\n\\n**Result:** scaling out is hard. If the sticky server crashes, the session is gone."
  },
  {
    "label": "Stateless",
    "icon": "📦",
    "content": "### Stateless Architecture\\n\\nA server is **stateless** when it stores **no per-client data** between requests. Each incoming request must be self-contained — it carries all the context the server needs.\\n\\n**Where state actually lives:**\\n- A shared **cache** (Redis, Memcached) for session tokens\\n- A **database** for user records and preferences\\n- The **client** itself (JWTs, cookies with signed payloads)\\n\\n**Implication:** any server instance can handle any request. The load balancer is free to round-robin.\\n\\n**Result:** you can add or remove instances instantly — horizontal scaling with zero coordination."
  },
  {
    "label": "The Misconception",
    "icon": "⚠️",
    "content": "### 'Stateless' Does NOT Mean 'No State'\\n\\nThis trips up almost every engineer the first time.\\n\\n> **Stateless means the *application server tier* holds no state.** State still exists — it just lives elsewhere.\\n\\nA stateless API still:\\n- Reads user records from a database\\n- Validates JWT tokens (signature is self-contained, no DB lookup required)\\n- Fetches active sessions from Redis\\n- Stores uploaded files in S3\\n\\nThe difference: that state is in a **dedicated, shared layer** that every server instance can reach equally. The application servers themselves are interchangeable — ephemeral compute with no special memory."
  }
]}
\`\`\`

---

## Side-by-Side: What Changes

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Stateful Server (session in RAM)", "code": "# Request 1: Login\\nPOST /login\\n→ Server stores: sessions[token] = { userId: 42, cart: [] }\\n→ Response: Set-Cookie: session=abc123\\n\\n# Request 2: Add to cart  (MUST hit same server)\\nPOST /cart/add  Cookie: session=abc123\\n→ Server looks up sessions[\\"abc123\\"] from LOCAL memory\\n→ sessions[\\"abc123\\"].cart.append(item)\\n\\n# If load balancer sends Request 2 to a DIFFERENT server:\\n→ KeyError: 'abc123' not found\\n→ User gets logged out, cart lost" }, "after": { "label": "Stateless Server (session in Redis)", "code": "# Request 1: Login\\nPOST /login\\n→ Server writes: redis.set('sess:abc123', { userId: 42 }, ex=3600)\\n→ Response: Set-Cookie: session=abc123\\n\\n# Request 2: Add to cart  (ANY server works)\\nPOST /cart/add  Cookie: session=abc123\\n→ Server fetches: redis.get('sess:abc123')  ← shared store\\n→ Updates Redis entry\\n\\n# Load balancer sends to Server 3 instead?\\n→ Same Redis result — zero difference to the user" } }
\`\`\`

---

## Why Statelessness Enables Horizontal Scaling

The connection between statelessness and scalability is mechanical, not magical.

\`\`\`steps
{ "title": "How Stateless Apps Scale to Millions", "steps": [
  {
    "title": "Any Instance Handles Any Request",
    "content": "Because no server holds private session state, your load balancer can use simple round-robin or least-connections routing. Adding a new server instance is instantaneous — it immediately joins the pool and begins handling traffic with zero warm-up or data migration."
  },
  {
    "title": "Instances Are Disposable",
    "content": "When an instance crashes, the load balancer stops routing to it. The next request from the same user lands on a healthy instance, fetches state from the shared Redis/DB layer, and continues seamlessly. There is no 'session loss' because the server never *owned* the session."
  },
  {
    "title": "Auto-scaling Becomes Trivial",
    "content": "Cloud auto-scalers (AWS ASG, GKE HPA) spin up and down instances based on CPU/request rate. Stateless apps respond linearly: 2× traffic → 2× instances → same latency. Stateful apps require complex coordination to migrate or replicate in-memory sessions before scaling."
  },
  {
    "title": "Deployments Are Safe",
    "content": "Rolling deployments become safe by default. You can terminate old instances while new ones serve traffic — no sticky sessions means no users are orphaned on dying servers. Blue-green deployments and canary releases work without session drainage logic."
  },
  {
    "title": "State Scales Independently",
    "content": "The shared state layer (Redis, Cassandra, Postgres) scales according to its own requirements. You can use read replicas, clustering, or sharding without changing the application tier. The two concerns are cleanly separated."
  }
]}
\`\`\`

---

## Patterns for Externalising State

Making an application stateless requires choosing where to push each type of state. There is no one-size-fits-all answer.

\`\`\`tabs
{ "tabs": [
  {
    "label": "JWTs (Client-Side)",
    "icon": "🔑",
    "content": "### JSON Web Tokens\\n\\nThe user's identity and claims are encoded **inside the token itself**, cryptographically signed by the server.\\n\\n\`\`\`\\nHeader.Payload.Signature\\n\`\`\`\\n\\n**Payload example:**\\n\`\`\`json\\n{ \\"userId\\": 42, \\"role\\": \\"admin\\", \\"exp\\": 1713000000 }\\n\`\`\`\\n\\nThe server verifies the signature on every request — no database lookup, no Redis round-trip. Horizontally scales perfectly.\\n\\n**Trade-off:** tokens cannot be individually revoked before expiry without introducing a deny-list (which is effectively a shared state store). Stateless verification and instant revocation are fundamentally in tension."
  },
  {
    "label": "Redis Sessions",
    "icon": "⚡",
    "content": "### Centralised Session Cache\\n\\nThe server issues an opaque session ID (stored in a cookie). On every request, the server looks up \`session:<id>\` in Redis to retrieve the full session object.\\n\\n**Benefits:**\\n- Instant revocation: delete the Redis key\\n- Rich session data (cart, preferences, wizard state)\\n- Redis read latency: sub-millisecond on the same network\\n\\n**Trade-off:** every request pays a Redis round-trip. Redis becomes a shared dependency — it must be highly available (Redis Sentinel or Redis Cluster). Your stateless app tier now depends on a stateful infrastructure layer.\\n\\nThis is the **most common pattern** for web applications."
  },
  {
    "label": "Sticky Sessions (Fallback)",
    "icon": "📌",
    "content": "### Sticky Sessions (Session Affinity)\\n\\nIf migrating to stateless is not yet feasible, load balancers support *sticky sessions*: they tag the first response with a cookie or use source IP hashing, and always route the same client to the same server.\\n\\n**When used:**\\n- Legacy applications where refactoring is costly\\n- WebSocket servers holding connection state\\n- Game servers managing real-time match state\\n\\n**Costs:**\\n- Uneven load distribution (a heavy user monopolises one server)\\n- Scaling events require session migration or drain\\n- Server failure causes session loss unless replicated\\n\\nSticky sessions are a **bridge**, not a destination."
  },
  {
    "label": "Event Sourcing",
    "icon": "📜",
    "content": "### Event Sourcing & Append-Only Logs\\n\\nInstead of storing current state, store every **event** that led to the current state. The current state is derived by replaying the event log.\\n\\n**Example (bank account):**\\n\`\`\`\\nDeposit +500  → balance: 500\\nWithdraw -200 → balance: 300\\nDeposit +100  → balance: 400\\n\`\`\`\\n\\nAny stateless service can reconstruct state by reading the log from Kafka or an event store. State becomes a read-model, rebuilt on demand.\\n\\n**Trade-off:** higher complexity, eventual consistency, and replay time. Best suited for audit-critical domains (finance, healthcare, compliance)."
  }
]}
\`\`\`

---

## Real-World Case Study: How Netflix Does It

Netflix is one of the most-cited examples of stateless architecture at scale. When you press play, your request might be handled by any of thousands of API instances worldwide.

\`\`\`concept
{ "title": "Netflix's Stateless API Tier", "variant": "insight", "content": "Netflix's API gateway and microservices are entirely stateless. Your session token (OAuth 2.0 bearer token) is validated by checking a shared token store — any instance can validate any token. Play state, watchlist, and preferences live in Cassandra and EVCache (Netflix's distributed Redis layer). When an API node crashes, Hystrix's circuit breaker routes traffic to healthy nodes in milliseconds. The user sees nothing. This architecture lets Netflix add capacity in one AWS region during a primetime spike without any coordination between application instances." }
\`\`\`

Contrast this with a multiplayer game: even Netflix uses **stateful servers** for specific features. Their real-time WebSocket connections for live events (like Netflix Party) route to specific server instances because WebSocket connections are, by definition, stateful. The front-end stateless API delegates players to dedicated stateful instances — the classic hybrid pattern.

---

## When Stateful Architecture Is Unavoidable

Stateless is the default, but some problem domains resist it.

\`\`\`callout
{ "type": "info", "title": "When to Choose Stateful", "content": "**Long-lived connections:** WebSockets, gRPC streams, and QUIC connections maintain per-connection state at the transport layer. You cannot route mid-stream to a different server without reconnecting.\\n\\n**Real-time collaboration:** Google Docs and Figma use operational transformation or CRDTs, but the conflict-resolution engine for a *live* document typically runs on a single authoritative process.\\n\\n**Online gaming:** a game match is a self-contained stateful world. Latency budgets (< 50ms) make constant Redis round-trips impractical; in-memory state wins.\\n\\n**Stateful stream processing:** Kafka Streams and Flink jobs maintain in-memory aggregation state (e.g., rolling 5-minute windows) for throughput reasons. They checkpoint to durable storage for fault tolerance." }
\`\`\`

The architectural response is not to abandon statelessness globally — it is to **isolate statefulness** in dedicated components that are explicitly designed for it: game servers, stream processing nodes, WebSocket hubs. The rest of the system remains stateless.

---

## Architecture Diagram: The Hybrid Model

\`\`\`sysdiag
{ "title": "Hybrid Stateless/Stateful Architecture", "width": 680, "height": 380,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 190, "kind": "client" },
    { "id": "lb", "label": "Load Balancer", "x": 200, "y": 190, "kind": "service" },
    { "id": "api1", "label": "API Server 1", "x": 360, "y": 100, "kind": "service" },
    { "id": "api2", "label": "API Server 2", "x": 360, "y": 190, "kind": "service" },
    { "id": "api3", "label": "API Server 3", "x": 360, "y": 280, "kind": "service" },
    { "id": "redis", "label": "Redis Cluster", "x": 530, "y": 130, "kind": "cache" },
    { "id": "db", "label": "Postgres", "x": 530, "y": 250, "kind": "database" },
    { "id": "ws", "label": "WS Server\\n(Stateful)", "x": 530, "y": 370, "kind": "service" }
  ],
  "edges": [
    { "from": "client", "to": "lb", "label": "HTTPS" },
    { "from": "lb", "to": "api1", "label": "" },
    { "from": "lb", "to": "api2", "label": "" },
    { "from": "lb", "to": "api3", "label": "" },
    { "from": "api1", "to": "redis", "label": "sessions" },
    { "from": "api2", "to": "redis", "label": "" },
    { "from": "api2", "to": "db", "label": "user data" },
    { "from": "api3", "to": "db", "label": "" },
    { "from": "lb", "to": "ws", "label": "sticky\\nWS" }
  ],
  "annotations": {
    "api1": "Stateless — holds no per-user memory. Any instance handles any request.",
    "redis": "Shared session store — the true home of session state. Sub-ms reads.",
    "ws": "Stateful WebSocket server — sticky routing required. Separate, isolated concern.",
    "lb": "Routes REST traffic with round-robin. Routes WebSocket upgrades with affinity."
  }
}
\`\`\`

---

## The Performance Trade-off

\`\`\`callout
{ "type": "warning", "title": "Stateless Systems Put More Load on the Data Layer", "content": "A stateful server that cached your auth token in RAM avoids a Redis round-trip. A stateless server hits Redis on **every request**. This is a real cost — typically 0.5–2ms per lookup on the same network.\\n\\nThe mitigation: use fast in-process caches (LRU maps, Caffeine, node-lru-cache) with short TTLs to reduce repeated lookups within a single request burst. This gives you most of the stateful speed benefit while preserving stateless routing flexibility.\\n\\nThe bigger picture: at scale, this Redis load is *predictable and shardable* — far preferable to the unpredictable memory pressure of stateful servers." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Stateless vs Stateful Architecture", "questions": [
  {
    "question": "An engineer notices that when their load balancer routes a user's second request to a different server, the user is logged out. What is the most likely root cause?",
    "options": [
      "The JWT signing key is different on each server",
      "Session data is stored in the application server's local memory",
      "Redis has expired the session key too quickly",
      "The load balancer is misconfigured at the DNS level"
    ],
    "answer": 1,
    "explanation": "If the session is stored in local RAM on each server (stateful design), only the server that originally handled the login knows about that session. Any other server has no record of it. The fix is to externalise sessions to a shared store like Redis so every server can read them."
  },
  {
    "question": "Which of the following is NOT an accurate statement about stateless architecture?",
    "options": [
      "Any server instance can handle any incoming request",
      "State does not exist anywhere in the system",
      "Auto-scaling is simpler because instances are interchangeable",
      "Session data must be stored in an external shared store"
    ],
    "answer": 1,
    "explanation": "This is the classic misconception. 'Stateless' means the *application server tier* holds no state — state still exists, it simply lives in a dedicated external layer (Redis, database, the client token itself). Eliminating state entirely from a useful application is impossible."
  },
  {
    "question": "A team is building a real-time multiplayer game server. They find that round-tripping to Redis for every game tick (60/sec per player) is too slow. What is the correct architectural response?",
    "options": [
      "Remove Redis and store all state in Postgres instead",
      "Increase Redis instance size until latency is acceptable",
      "Accept that this component is inherently stateful and isolate it behind a stateful game server tier with sticky routing",
      "Use HTTP/2 push to send state updates to the client"
    ],
    "answer": 2,
    "explanation": "Real-time game state is a legitimate case where in-memory statefulness wins on latency. The correct response is to isolate this as a dedicated stateful component — not to force a round-trip architecture that cannot meet the latency budget. The rest of the system (authentication, matchmaking, leaderboards) remains stateless."
  },
  {
    "question": "JWTs allow stateless authentication. However, immediately revoking a stolen JWT before its expiry requires what?",
    "options": [
      "Rotating the signing key",
      "Introducing a shared token deny-list or blocklist — which is a form of shared state",
      "Reducing the JWT expiry to 1 second",
      "Switching to session cookies"
    ],
    "answer": 1,
    "explanation": "JWT verification is stateless because the signature encodes everything needed — no DB lookup required. But that same self-containment means you cannot 'un-verify' a token without checking it against a deny-list, which is shared state. This is a fundamental tension in stateless auth: revocation and pure statelessness are in conflict."
  },
  {
    "question": "In Netflix's architecture, API servers are stateless but WebSocket connections for live events use sticky routing. What does this illustrate?",
    "options": [
      "Netflix hasn't fully adopted stateless architecture yet",
      "Stateless and stateful components can coexist — stateful is isolated to specific components where it is unavoidable",
      "WebSocket connections are more secure than REST because of sticky routing",
      "Sticky routing improves latency for all request types"
    ],
    "answer": 1,
    "explanation": "The hybrid model is the industry norm. Most large systems keep the broad API tier stateless for scalability and fault tolerance, while isolating stateful behaviour (WebSocket connections, real-time sessions, stream processing) in dedicated components designed explicitly for it. The key is deliberate isolation, not blanket avoidance."
  }
]}
\`\`\`

---

## Decision Framework: Choosing Your Architecture

\`\`\`concept
{ "title": "The Rule of Thumb for State Placement", "variant": "rule", "content": "**Eliminate state from the application tier wherever possible. When you cannot eliminate it, isolate it explicitly in a component built for it.**\\n\\nAsk three questions:\\n1. Can the client carry this state safely? (JWT, signed cookie) → Put it there.\\n2. Can a shared fast store handle this? (Redis, Memcached) → Put it there.\\n3. Does this require sub-millisecond in-process access with no network hop? (game tick, WebSocket frame) → Accept statefulness, isolate it, design for its failure." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: The CAP Theorem Connection", "content": "Stateless architecture doesn't just affect scalability — it affects how your system behaves under **network partitions**.\\n\\nWhen a stateful server loses its connection to the rest of the cluster, it holds data that no other node has. It must choose between:\\n- **Availability:** keep serving requests but risk diverging from other nodes\\n- **Consistency:** refuse requests until connectivity is restored\\n\\nA stateless server under partition simply stops serving (or degrades gracefully) — it never had unique state to protect. The state lives in a shared data layer (Redis Cluster, Cassandra) that has its own, purpose-built partition handling strategy.\\n\\nThis is why the CAP theorem plays out differently in stateless systems: you've pushed the consistency/availability trade-off to a layer that can reason about it explicitly, rather than leaving it implicit in application memory." }
\`\`\`

---

## Interview Tip

\`\`\`callout
{ "type": "tip", "title": "How This Comes Up in System Design Interviews", "content": "When asked to design any system at scale, the interviewer expects you to proactively state: *'I'll design the API tier as stateless, externalising sessions to Redis, so any instance can handle any request and we can auto-scale horizontally.'*\\n\\nThen follow up: *'The one exception is the WebSocket notification layer — those connections are stateful by nature, so I'll route them with affinity and design for graceful reconnection on instance failure.'*\\n\\nThis shows you understand both the default pattern and when to deviate from it." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Stateless means the *server tier* holds no per-client data — state is externalised, not eliminated",
  "Statelessness enables horizontal scaling because any server instance can handle any request without coordination",
  "The most common pattern: stateless API servers + Redis for session state + JWT for identity",
  "JWTs give stateless auth but make instant revocation hard — a fundamental tension to acknowledge",
  "Some components (WebSockets, game servers, stream processors) are genuinely stateful — isolate them explicitly rather than forcing a stateless model",
  "The hybrid model is the industry norm: keep the broad application tier stateless, confine statefulness to purpose-built layers"
]}
\`\`\``,
    },
    {
      id: "latency-vs-throughput",
      slug: "latency-vs-throughput",
      title: "Latency vs Throughput Trade-offs",
      content: `# Latency vs Throughput Trade-offs

Every system you design lives somewhere on a spectrum. At one end: lightning-fast responses for each individual request. At the other: massive volumes of work completed every second. Understanding *why* these two goals pull against each other — and when to prioritize each — is one of the most consequential skills in system design.

---

## The Core Definitions

Before diving into trade-offs, let's lock in precise definitions. Engineers often confuse these or use them interchangeably, which leads to wrong optimization choices.

\`\`\`concept
{
  "title": "Latency",
  "variant": "mental-model",
  "content": "Latency is the time elapsed between a request being sent and its response being received — the delay for a **single operation**. Measured in milliseconds (ms) or microseconds (µs). Lower is better. Think: how long does one customer wait in line?"
}
\`\`\`

\`\`\`concept
{
  "title": "Throughput",
  "variant": "mental-model",
  "content": "Throughput is the number of operations a system can complete per unit of time — the **rate** of work. Measured in requests/second (RPS), transactions/second (TPS), or MB/s. Higher is better. Think: how many customers can the store serve per hour?"
}
\`\`\`

The two metrics look at opposite ends of the same event: latency measures a single trip, throughput measures how many trips happen in a window.

---

## Little's Law: The Mathematical Glue

These two metrics aren't independent — they're bound together by a theorem from queuing theory called **Little's Law**:

> **L = λW**

Where:
- **L** = average number of requests in the system (concurrency)
- **λ (lambda)** = average arrival rate (throughput, in requests/sec)
- **W** = average time a request spends in the system (latency, in seconds)

Rearranged: **λ = L / W**

This is the key insight: if your system can hold a fixed number of in-flight requests (\`L\` is constant), you *cannot* increase throughput without decreasing latency, and vice versa.

\`\`\`callout
{
  "type": "info",
  "title": "Little's Law Example",
  "content": "A database can handle **50 concurrent queries** (L = 50). If each query takes **100ms** on average (W = 0.1s), throughput is **500 queries/sec** (λ = 50 / 0.1). To double throughput to 1000 QPS without adding capacity, you'd need to halve latency to 50ms — or accept degraded performance."
}
\`\`\`

Let's simulate this relationship directly:

\`\`\`playground
{
  "title": "Little's Law Simulator",
  "language": "python",
  "code": "# Little's Law: L = lambda * W\\n# L = concurrent requests in system\\n# W = average latency per request (seconds)\\n# lambda = throughput (requests/second)\\n\\ndef littles_law(concurrent=50, latency_ms=100):\\n    L = concurrent\\n    W = latency_ms / 1000  # convert to seconds\\n    throughput = L / W\\n    print(f\\"Concurrent requests (L): {L}\\")\\n    print(f\\"Avg latency (W):         {latency_ms}ms\\")\\n    print(f\\"Throughput (λ):          {throughput:.0f} req/s\\")\\n    print()\\n\\nprint(\\"=== Baseline ===\\")\\nlittles_law(concurrent=50, latency_ms=100)\\n\\nprint(\\"=== Double concurrency (scale out) ===\\")\\nlittles_law(concurrent=100, latency_ms=100)\\n\\nprint(\\"=== Halve latency (optimize code) ===\\")\\nlittles_law(concurrent=50, latency_ms=50)\\n\\nprint(\\"=== Heavy load — latency spikes ===\\")\\n# When queues fill up, latency balloons\\nlittles_law(concurrent=50, latency_ms=800)",
  "runnable": true
}
\`\`\`

Notice: doubling concurrency and halving latency both double throughput — but through entirely different architectural decisions.

---

## Visualizing the Trade-off in a Request Queue

The tension becomes clearest when you look at what happens inside a server's request queue. High throughput means the queue is always busy (never idle). Low latency means the queue is almost always *empty* (requests are served immediately on arrival).

\`\`\`algoviz
{
  "title": "Request Queue: Latency vs Throughput Goals",
  "type": "array",
  "data": [null, null, null, null, null, null, null, null],
  "frames": [
    {
      "highlight": [],
      "label": "Empty queue — ideal for latency. Any new request starts immediately.",
      "stats": { "queue_depth": 0, "latency": "~0ms wait", "throughput": "low" }
    },
    {
      "highlight": [0],
      "label": "1 request arrives — served instantly. Latency: minimal.",
      "stats": { "queue_depth": 1, "latency": "minimal", "throughput": "1 req/s" }
    },
    {
      "highlight": [0, 1, 2, 3, 4, 5, 6, 7],
      "label": "Queue full (high load) — great throughput, but new arrivals wait in line.",
      "stats": { "queue_depth": 8, "latency": "8x unit latency", "throughput": "8 req/s" }
    },
    {
      "highlight": [0, 1, 2],
      "label": "Moderate load — balanced. Throughput is decent, latency is acceptable.",
      "stats": { "queue_depth": 3, "latency": "3x unit latency", "throughput": "3 req/s" }
    },
    {
      "highlight": [],
      "label": "Key insight: empty queue = low latency. Full queue = high throughput. You must choose.",
      "stats": { "queue_depth": 0, "latency": "minimal", "throughput": "low" }
    }
  ],
  "speed": 1200
}
\`\`\`

This is why Dan Slimmon's insight (from his blog on the latency/throughput trade-off) is so profound: **a low-latency user wants queues nearly empty; a high-throughput user wants queues never empty**. Those goals are fundamentally incompatible on the same pool of resources.

---

## Real-World System Profiles

Different systems have radically different requirements. Let's map them on the spectrum:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Latency-First",
      "icon": "⚡",
      "content": "## Latency-Sensitive Systems\\n\\nThese systems live and die by per-request response time.\\n\\n| System | Target Latency | Why It Matters |\\n|--------|---------------|----------------|\\n| Stock trading platform | < 1ms | Microsecond delays = missed trades, lost money |\\n| Online multiplayer gaming | < 50ms | > 100ms = noticeable lag, ruined experience |\\n| Autonomous vehicles | < 10ms | Sensor processing delay = safety risk |\\n| Video conferencing | < 150ms | Perceived as unnatural conversation delay |\\n\\n**Architecture choices:** co-location (servers near users), CDN edge nodes, in-memory caches, avoiding network hops, pre-computed responses."
    },
    {
      "label": "Throughput-First",
      "icon": "🚀",
      "content": "## Throughput-Sensitive Systems\\n\\nThese systems care about total work done, not per-request speed.\\n\\n| System | Target Throughput | Why It Matters |\\n|--------|------------------|----------------|\\n| Data warehouse (Redshift, BigQuery) | TB/hour | Process petabytes of analytics data |\\n| Log ingestion pipeline (Kafka) | Millions/sec | Never drop an event |\\n| Video transcoding | Videos/hour | Batch convert at scale |\\n| Payment settlement | Millions/day | Batch reconciliation, not real-time |\\n\\n**Architecture choices:** batching, bulk operations, async processing, horizontal scaling, stream processing."
    },
    {
      "label": "Both Required",
      "icon": "⚖️",
      "content": "## Systems That Need Both\\n\\nThe hardest class — user-facing AND high-volume.\\n\\n| System | Latency Need | Throughput Need |\\n|--------|-------------|----------------|\\n| Google Search | < 200ms per query | Billions of queries/day |\\n| Amazon checkout | < 1s per page | Millions of transactions/hour |\\n| Netflix streaming | < 100ms buffer start | Petabytes streamed daily |\\n| Twitter feed | < 500ms load | 500M tweets/day |\\n\\n**Solution pattern:** **Split clusters** — reserve capacity for interactive (latency-first) vs. bulk (throughput-first) workloads. Netflix uses separate clusters for live streaming vs. batch video encoding."
    }
  ]
}
\`\`\`

---

## The Techniques and Their Trade-offs

This is where system design decisions get real. Each optimization technique has a cost:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Improve Latency",
      "icon": "🔽",
      "content": "## Techniques to Reduce Latency\\n\\n### 1. Caching\\nStore expensive results close to the requester. A Redis cache hit takes ~0.5ms vs 50ms+ for a DB query.\\n\\n**Trade-off:** Stale data risk, memory cost, cache invalidation complexity.\\n\\n### 2. Reduce Network Hops\\nFewer services in the request path = lower latency. Avoid microservice chains where Service A calls B calls C calls D.\\n\\n**Trade-off:** May require denormalizing data or coupling services.\\n\\n### 3. CDN / Edge Nodes\\nServe static assets (and sometimes dynamic content) from servers geographically close to users.\\n\\n**Trade-off:** Content consistency across regions, higher infrastructure cost.\\n\\n### 4. Request Hedging\\nSend the same request to 2-3 replicas simultaneously, use the fastest response, cancel the rest. Used by Google for tail latency reduction.\\n\\n**Trade-off:** 2-3x throughput cost — you're wasting work on discarded responses.\\n\\n### 5. Connection Pooling\\nReuse existing DB connections instead of establishing new ones on every request.\\n\\n**Trade-off:** Resource management overhead, potential connection starvation under load."
    },
    {
      "label": "Improve Throughput",
      "icon": "🔼",
      "content": "## Techniques to Increase Throughput\\n\\n### 1. Batching\\nGroup multiple small requests into one large operation. Write 1000 rows to DB in one INSERT instead of 1000 individual inserts.\\n\\n**Trade-off:** Increases latency for individual items — they wait to accumulate a batch.\\n\\n### 2. Async Processing\\nQueue work and process it in the background. Return a job ID immediately rather than waiting for completion.\\n\\n**Trade-off:** Latency for the final result is much higher (seconds vs milliseconds). Requires polling or webhooks.\\n\\n### 3. Horizontal Scaling\\nAdd more machines. If one server handles 1000 RPS, 10 servers handle 10,000 RPS.\\n\\n**Trade-off:** Increases operational complexity, adds coordination overhead, doesn't help per-request latency (may hurt it due to routing).\\n\\n### 4. Bulk DB Operations\\nUse \`INSERT INTO ... VALUES (...), (...), (...)\` instead of individual inserts. Most databases batch-optimize this at the storage layer.\\n\\n**Trade-off:** Partial failures are harder to handle; one bad row can fail the whole batch.\\n\\n### 5. Compression\\nCompress payloads to move more data per second over the network.\\n\\n**Trade-off:** CPU cost of compress/decompress adds latency to each request."
    },
    {
      "label": "Improve Both",
      "icon": "✨",
      "content": "## Techniques That Improve Both\\n\\nRare but powerful — these reduce latency *and* increase throughput.\\n\\n### 1. Eliminate Inefficient Code\\nA slow algorithm wastes CPU time, blocking other requests. O(n²) → O(n log n) frees the thread faster, serving more requests.\\n\\n### 2. Better Hardware\\nSSD vs HDD: 10x lower read latency, 3-5x higher IOPS throughput. More CPU cores serve more concurrent requests with less queuing delay.\\n\\n### 3. Connection Multiplexing (HTTP/2, gRPC)\\nHTTP/2 streams multiple requests over one TCP connection. Reduces connection establishment latency AND allows higher concurrency per connection.\\n\\n### 4. Efficient Data Formats\\nProtobuf vs JSON: protobuf serializes 3-10x faster, produces smaller payloads. Both latency and throughput improve.\\n\\n### 5. Indexes on Hot Query Paths\\nA missing DB index turns a 1ms lookup into a full table scan at 500ms. Adding it drops latency dramatically and frees the DB to serve far more queries per second."
    }
  ]
}
\`\`\`

---

## Batching: The Classic Trade-off in Code

The single clearest illustration of the latency vs. throughput trade-off is **batching**. Let's trace through both approaches:

\`\`\`trace
{
  "title": "Batching: Throughput Gain vs Latency Cost",
  "language": "python",
  "code": "import time\\n\\nrequests = [\\"req_1\\", \\"req_2\\", \\"req_3\\", \\"req_4\\"]\\n\\n# --- Approach A: No batching (low latency per item) ---\\nfor req in requests:\\n    result = db_write(req)   # 10ms each\\n    respond(req, result)     # responds immediately\\n\\n# Total: 4 x 10ms = 40ms, each item waits max 10ms\\n\\n# --- Approach B: Batching (high throughput, higher latency) ---\\nbatch = []\\nfor req in requests:\\n    batch.append(req)\\n    if len(batch) == 4:      # wait to collect 4\\n        results = db_bulk_write(batch)  # 15ms for all 4\\n        for r, result in zip(batch, results):\\n            respond(r, result)\\n        batch = []\\n\\n# Total: 15ms for 4 items, but req_1 waited ~40ms before responding",
  "frames": [
    {
      "line": 6,
      "vars": { "approach": "A - no batching", "req": "req_1" },
      "note": "req_1 arrives and is processed immediately"
    },
    {
      "line": 7,
      "vars": { "latency_req1": "10ms", "throughput": "100 writes/sec" },
      "note": "req_1 responds after 10ms. Low latency!"
    },
    {
      "line": 8,
      "vars": { "latency_req2": "10ms", "latency_req3": "10ms", "latency_req4": "10ms" },
      "note": "Each subsequent request also gets 10ms latency. Total: 40ms, 4 DB round trips."
    },
    {
      "line": 14,
      "vars": { "approach": "B - batching", "batch": "[]", "req": "req_1" },
      "note": "req_1 arrives — but we wait to collect a full batch before processing"
    },
    {
      "line": 15,
      "vars": { "batch": "[req_1, req_2, req_3]", "req_1_wait": "queued..." },
      "note": "req_1, req_2, req_3 are queued. None have responded yet. Latency building..."
    },
    {
      "line": 16,
      "vars": { "batch": "[req_1, req_2, req_3, req_4]" },
      "note": "Batch is full. Now we execute ONE bulk write."
    },
    {
      "line": 17,
      "vars": { "db_time": "15ms", "throughput": "267 writes/sec" },
      "note": "15ms for ALL 4 writes. ~2.7x better throughput than individual writes!"
    },
    {
      "line": 18,
      "vars": { "latency_req1": "~40ms", "note": "req_1 waited for req_2, req_3, req_4 to arrive" },
      "note": "req_1's total latency: 10ms arrival wait + 15ms batch write = ~40ms. 4x worse latency."
    }
  ],
  "speed": 900
}
\`\`\`

This trace captures the core tension: batching cut the number of DB round-trips from 4 to 1, improving throughput by ~2.7x — but the first item in the batch waited for three friends before getting served.

---

## Tail Latency: The Hidden Problem

Average latency is a lie. **Tail latency** — the 99th or 99.9th percentile — is what actually kills user experience.

\`\`\`callout
{
  "type": "warning",
  "title": "The Tail Latency Problem",
  "content": "If your API has p50=10ms, p95=80ms, and p99=2000ms — 1 in 100 users waits 2 seconds. On a page that makes 10 API calls, the probability at least one call hits p99 is **1 - (0.99)^10 ≈ 10%**. One in ten page loads is slow. Your *average* latency looks fine; your users are suffering."
}
\`\`\`

**Request hedging** is Google's solution for tail latency: send the same request to two servers simultaneously, use whichever responds first, cancel the other. This cuts tail latency dramatically by avoiding slow/overloaded nodes — at the cost of 2x throughput for those requests.

\`\`\`playground
{
  "title": "Tail Latency: Why Percentiles Matter",
  "language": "python",
  "code": "import random\\n\\ndef simulate_latency():\\n    \\"\\"\\"Simulates a server where 1% of requests hit a slow path.\\"\\"\\"\\n    if random.random() < 0.01:  # 1% chance of slow request\\n        return random.uniform(1500, 3000)  # 1.5s - 3s\\n    return random.uniform(5, 50)  # normal: 5-50ms\\n\\ndef run_simulation(n_requests=1000):\\n    latencies = sorted([simulate_latency() for _ in range(n_requests)])\\n    \\n    p50 = latencies[int(n_requests * 0.50)]\\n    p95 = latencies[int(n_requests * 0.95)]\\n    p99 = latencies[int(n_requests * 0.99)]\\n    avg = sum(latencies) / len(latencies)\\n    \\n    print(f\\"Requests simulated: {n_requests}\\")\\n    print(f\\"Average latency:    {avg:.1f}ms  ← looks fine!\\")\\n    print(f\\"p50 latency:        {p50:.1f}ms\\")\\n    print(f\\"p95 latency:        {p95:.1f}ms\\")\\n    print(f\\"p99 latency:        {p99:.1f}ms  ← this is the real story\\")\\n    print()\\n    \\n    # Multi-call page load simulation\\n    n_api_calls = 10\\n    p_slow_page = 1 - (0.99 ** n_api_calls)\\n    print(f\\"Page with {n_api_calls} API calls:\\")\\n    print(f\\"  P(at least one call hits p99): {p_slow_page:.1%}\\")\\n    print(f\\"  ~{p_slow_page * 1000:.0f} out of every 1000 page loads feel slow\\")\\n\\nrun_simulation()",
  "runnable": true
}
\`\`\`

---

## Architecture Pattern: Split Clusters

When a system must serve *both* latency-sensitive and throughput-sensitive workloads, the solution Dan Slimmon describes is **splitting the cluster**:

\`\`\`sysdiag
{
  "title": "Split Cluster Pattern: Isolating Latency from Throughput Workloads",
  "width": 680,
  "height": 380,
  "nodes": [
    { "id": "lb", "label": "Load Balancer", "x": 340, "y": 40, "kind": "service" },
    { "id": "rt_cluster", "label": "Real-Time Cluster\\n(low latency)", "x": 160, "y": 160, "kind": "service" },
    { "id": "batch_cluster", "label": "Batch Cluster\\n(high throughput)", "x": 520, "y": 160, "kind": "service" },
    { "id": "rt_db", "label": "Hot DB\\n(indexed, cached)", "x": 160, "y": 300, "kind": "database" },
    { "id": "batch_db", "label": "Cold DB\\n(columnar, bulk)", "x": 520, "y": 300, "kind": "database" }
  ],
  "edges": [
    { "from": "lb", "to": "rt_cluster", "label": "user requests" },
    { "from": "lb", "to": "batch_cluster", "label": "bulk jobs" },
    { "from": "rt_cluster", "to": "rt_db", "label": "point lookups" },
    { "from": "batch_cluster", "to": "batch_db", "label": "full scans" }
  ],
  "annotations": {
    "lb": "Routes traffic by request type. Interactive user requests go left; batch jobs go right. They never share a queue.",
    "rt_cluster": "Optimized for low queue depth. Scales to keep latency under SLA. Uses connection pooling, caching, and fast code paths.",
    "batch_cluster": "Optimized for sustained throughput. Uses bulk writes, async processing, and compression. Tolerates higher per-item latency.",
    "rt_db": "PostgreSQL with hot indexes, Redis cache layer. Serves p99 < 20ms.",
    "batch_db": "Redshift or BigQuery. Columnar storage optimized for full-table analytics, not individual lookups."
  }
}
\`\`\`

This pattern is used by Netflix (streaming vs. encoding), Google (search vs. batch indexing), and most large-scale systems that serve both interactive users and background analytics.

---

## Practice: Fill in the Trade-off

\`\`\`fillblank
{
  "title": "Identify the Trade-off",
  "prompt": "Complete the code comments describing the latency vs throughput impact of each design decision:",
  "language": "python",
  "template": "# Decision 1: Async job queue\\ndef handle_request(data):\\n    job_queue.push(data)  # returns immediately\\n    return {\\"status\\": \\"queued\\"}  # ___ latency, ___ throughput\\n\\n# Decision 2: Request hedging\\ndef fetch_with_hedge(key):\\n    r1 = replica_1.get(key)  # send to both replicas\\n    r2 = replica_2.get(key)\\n    return first_response(r1, r2)  # ___ tail latency, ___ throughput cost\\n\\n# Decision 3: Batching writes\\ndef flush_batch(items):\\n    db.bulk_insert(items)  # one round trip for N items\\n    # ___ throughput, ___ latency per item",
  "blanks": [
    { "answer": "higher", "hint": "The response comes back before processing finishes" },
    { "answer": "higher", "hint": "Processing happens in the background — more total work can be queued" },
    { "answer": "lower", "hint": "The fastest replica wins — we avoid the slow one" },
    { "answer": "higher", "hint": "We're doing 2x the work on the cluster" },
    { "answer": "higher", "hint": "Fewer round trips = more items processed per second" },
    { "answer": "higher", "hint": "Each item waits for a full batch to form before being written" }
  ]
}
\`\`\`

---

## The Framework: Starting Your Design

Before you write a single line of architecture, answer these questions:

\`\`\`steps
{
  "title": "System Design Framework: Classifying Your System",
  "steps": [
    {
      "title": "Step 1 — Identify the workload type",
      "content": "Ask: **Who is waiting for this response?**\\n\\n- A **human user** expecting a page to load → latency-sensitive (target < 200ms)\\n- A **background job** processing a data pipeline → throughput-sensitive\\n- Both → you need to split concerns\\n\\n*Example: Twitter's feed loading is latency-sensitive. Twitter's analytics pipeline is throughput-sensitive. They're different systems.*"
    },
    {
      "title": "Step 2 — Define your SLAs before optimizing",
      "content": "Set concrete targets:\\n\\n\`\`\`\\nLatency SLA:    p50 < 20ms, p99 < 200ms\\nThroughput SLA: sustain 50,000 RPS at peak\\n\`\`\`\\n\\nWithout numbers, you'll optimize the wrong thing. \\"Fast\\" is not an SLA. A trading system needs sub-millisecond. A batch report can take 30 minutes."
    },
    {
      "title": "Step 3 — Apply Little's Law to size your system",
      "content": "Use **λ = L / W** to calculate required concurrency:\\n\\nIf your SLA requires **10,000 RPS** throughput (λ) and **50ms** average latency (W):\\n\\n\`\`\`\\nL = λ × W = 10,000 × 0.05 = 500 concurrent requests\\n\`\`\`\\n\\nYour system must handle 500 in-flight requests simultaneously. This tells you thread pool sizes, connection pool limits, and auto-scaling targets."
    },
    {
      "title": "Step 4 — Choose techniques that match the profile",
      "content": "- Latency-sensitive path → caching, fewer hops, CDN, connection pooling, request hedging\\n- Throughput-sensitive path → batching, async queues, bulk operations, horizontal scaling\\n- Both → split cluster; never let batch jobs compete with interactive requests for the same resources"
    },
    {
      "title": "Step 5 — Monitor percentiles, not averages",
      "content": "Track p50, p95, p99, and p999. Set alerts on **p99 latency**, not average latency.\\n\\nA single slow shard, a GC pause, or a hot key can cause tail latency spikes invisible in averages — but they're what users experience during the worst moments."
    }
  ]
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "Latency vs Throughput",
  "questions": [
    {
      "question": "A system uses Little's Law. Currently: 100 concurrent requests, avg latency 200ms. What is the current throughput?",
      "options": [
        "200 req/s",
        "500 req/s",
        "100 req/s",
        "1000 req/s"
      ],
      "answer": 1,
      "explanation": "λ = L / W = 100 / 0.2s = 500 req/s. Little's Law: throughput = concurrent requests ÷ latency in seconds."
    },
    {
      "question": "You implement batching for DB writes: instead of 1 write per request, you batch 50 writes together. What is the most likely effect?",
      "options": [
        "Lower latency and lower throughput",
        "Lower latency and higher throughput",
        "Higher latency per item and higher throughput",
        "No change in either metric"
      ],
      "answer": 2,
      "explanation": "Batching reduces DB round-trips (fewer network calls = higher throughput) but each individual item must wait for the batch to fill before being written — increasing per-item latency. Classic throughput-latency trade-off."
    },
    {
      "question": "Google uses 'request hedging' to reduce tail latency. What is the main cost of this technique?",
      "options": [
        "Higher average latency for all requests",
        "Increased throughput consumption — duplicate requests are sent and discarded",
        "Higher p50 latency",
        "More complex load balancer configuration"
      ],
      "answer": 1,
      "explanation": "Request hedging sends the same request to 2-3 replicas and discards the slower responses. This reduces p99/p999 tail latency but wastes throughput — you're doing 2-3x the work for those requests."
    },
    {
      "question": "A fintech startup must serve both: (A) real-time user dashboard queries requiring < 50ms p99, and (B) nightly batch analytics jobs processing 500GB of transaction data. What is the best architectural decision?",
      "options": [
        "Prioritize latency for everything — fast serving handles both use cases",
        "Use a single cluster with priority queues to separate the workloads",
        "Split into two separate clusters: one optimized for low latency, one for high throughput",
        "Use only asynchronous processing to eliminate the trade-off"
      ],
      "answer": 2,
      "explanation": "The split cluster pattern is the right call. A low-latency user wants queues nearly empty (fast response). A high-throughput batch job wants queues never empty (maximum utilization). These goals are incompatible on shared resources — splitting the cluster lets each workload be optimized independently."
    },
    {
      "question": "Your API reports average latency = 15ms but users are complaining about slow experiences. What is the most likely explanation?",
      "options": [
        "The average is correct — users are imagining the slowness",
        "High tail latency (p99 or p999) is causing a significant fraction of requests to be slow, invisible in the average",
        "The server needs more RAM",
        "The API is rate-limited"
      ],
      "answer": 1,
      "explanation": "Average latency hides tail latency. If p99 = 2000ms, 1% of requests are very slow. On a page making 10 API calls, ~10% of page loads will hit at least one slow request. Always monitor percentiles (p95, p99, p999), not just averages."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Latency = time for one request; throughput = requests completed per second. They are related by Little's Law: λ = L / W.",
    "Optimizing for throughput (batching, async, bulk ops) almost always increases per-item latency. Optimizing for latency (caching, fewer hops, hedging) often reduces throughput.",
    "Tail latency (p99, p999) is what users experience at worst — average latency is a vanity metric. Monitor and alert on percentiles.",
    "Always classify your system first: latency-sensitive (user-facing), throughput-sensitive (batch/analytics), or both (split cluster pattern).",
    "Little's Law lets you calculate required concurrency from latency + throughput SLAs — use it to size thread pools, connection pools, and auto-scaling targets.",
    "When both low-latency and high-throughput are needed in one system, never share resources between the two workloads — use separate clusters or dedicated capacity."
  ]
}
\`\`\``,
      starterCode: `import time
import threading
import queue
from typing import List

# Simulated database call — takes 100ms per request
def db_fetch(item_id: int) -> dict:
    time.sleep(0.1)  # Simulates network/disk latency
    return {"id": item_id, "value": item_id * 10}


# ─────────────────────────────────────────────
# APPROACH 1: Sequential (baseline)
# ─────────────────────────────────────────────
def fetch_sequential(item_ids: List[int]) -> List[dict]:
    """
    Fetch items one at a time.
    TODO: Implement sequential fetching.
          Call db_fetch() for each id and collect results.
    """
    results = []
    # TODO: loop over item_ids, call db_fetch, append to results
    return results


# ─────────────────────────────────────────────
# APPROACH 2: Batched (improves throughput)
# ─────────────────────────────────────────────
def fetch_batched(item_ids: List[int], batch_size: int = 5) -> List[dict]:
    """
    Fetch items in batches using threads.
    Batching improves THROUGHPUT (more items/sec) but may increase
    LATENCY for the first item (it must wait for the batch to fill).

    TODO: Split item_ids into chunks of batch_size.
          For each batch, spawn one thread per item in the batch.
          Collect all results after each batch completes.
    """
    results = []

    # TODO: iterate in steps of batch_size
    for i in range(0, len(item_ids), batch_size):
        batch = item_ids[i : i + batch_size]
        batch_results = [None] * len(batch)
        threads = []

        # TODO: for each (index, item_id) in enumerate(batch):
        #         create a thread that stores db_fetch(item_id)
        #         into batch_results[index], start it

        # TODO: join all threads

        results.extend(batch_results)

    return results


# ─────────────────────────────────────────────
# APPROACH 3: Fully parallel (low latency)
# ─────────────────────────────────────────────
def fetch_parallel(item_ids: List[int]) -> List[dict]:
    """
    Fetch ALL items concurrently with one thread each.
    Minimises LATENCY (total wall-clock time ≈ one db_fetch call)
    but uses more resources — lower sustainable THROUGHPUT under load.

    TODO: Spawn one thread per item_id (all at once).
          Collect and return results in original order.
    """
    results = [None] * len(item_ids)
    threads = []

    # TODO: create and start one thread per item

    # TODO: join all threads

    return results


# ─────────────────────────────────────────────
# Benchmarking helper — do not modify
# ─────────────────────────────────────────────
def benchmark(label: str, fn, *args) -> List[dict]:
    start = time.perf_counter()
    result = fn(*args)
    elapsed = time.perf_counter() - start
    rps = len(result) / elapsed  # requests per second = throughput
    print(f"{label:30s} | latency: {elapsed:.3f}s | throughput: {rps:.1f} req/s")
    return result


if __name__ == "__main__":
    ids = list(range(20))  # 20 items, each takes 0.1 s

    print("Strategy                       | Wall-clock time  | Req/sec")
    print("-" * 65)
    benchmark("Sequential",  fetch_sequential, ids)
    benchmark("Batched (size=5)", fetch_batched, ids, 5)
    benchmark("Fully parallel", fetch_parallel, ids)

    # QUESTION: Which approach has the lowest latency? Highest throughput?
    # QUESTION: Why might 'fully parallel' be risky in production
    #           (hint: think about 1000 simultaneous requests)?
`,
      solutionCode: `import time
import threading
from typing import List

# Simulated database call — takes 100ms per request
def db_fetch(item_id: int) -> dict:
    time.sleep(0.1)
    return {"id": item_id, "value": item_id * 10}


# ─────────────────────────────────────────────
# APPROACH 1: Sequential (baseline)
# High latency, low throughput — simple but slow
# ─────────────────────────────────────────────
def fetch_sequential(item_ids: List[int]) -> List[dict]:
    results = []
    for item_id in item_ids:
        results.append(db_fetch(item_id))
    return results
    # 20 items × 0.1 s = ~2.0 s wall-clock, ~10 req/s


# ─────────────────────────────────────────────
# APPROACH 2: Batched (improves throughput)
# Processes B items in parallel, then waits before next batch.
# Throughput ↑ vs sequential; latency still scales with N/batch_size.
# ─────────────────────────────────────────────
def fetch_batched(item_ids: List[int], batch_size: int = 5) -> List[dict]:
    results = []

    for i in range(0, len(item_ids), batch_size):
        batch = item_ids[i : i + batch_size]
        batch_results = [None] * len(batch)
        threads = []

        def worker(idx, item_id):
            batch_results[idx] = db_fetch(item_id)

        for idx, item_id in enumerate(batch):
            t = threading.Thread(target=worker, args=(idx, item_id))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

        results.extend(batch_results)

    return results
    # 20 items / 5 per batch = 4 batches × 0.1 s = ~0.4 s, ~50 req/s
    # Throughput improved; first-item latency still 0.1 s per batch.


# ─────────────────────────────────────────────
# APPROACH 3: Fully parallel (lowest latency)
# All requests fire simultaneously — wall-clock ≈ single request time.
# Trade-off: unbounded threads hurt throughput under heavy real load
# (thread-switching overhead, connection pool exhaustion).
# ─────────────────────────────────────────────
def fetch_parallel(item_ids: List[int]) -> List[dict]:
    results = [None] * len(item_ids)
    threads = []

    def worker(idx, item_id):
        results[idx] = db_fetch(item_id)

    for idx, item_id in enumerate(item_ids):
        t = threading.Thread(target=worker, args=(idx, item_id))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    return results
    # 20 items all at once ≈ 0.1 s, ~200 req/s for this batch.
    # BUT: 1000 concurrent callers each spawning 1000 threads = disaster.


# ─────────────────────────────────────────────
# Benchmarking helper
# ─────────────────────────────────────────────
def benchmark(label: str, fn, *args) -> List[dict]:
    start = time.perf_counter()
    result = fn(*args)
    elapsed = time.perf_counter() - start
    rps = len(result) / elapsed
    print(f"{label:30s} | latency: {elapsed:.3f}s | throughput: {rps:.1f} req/s")
    return result


if __name__ == "__main__":
    ids = list(range(20))

    print("Strategy                       | Wall-clock time  | Req/sec")
    print("-" * 65)
    benchmark("Sequential",       fetch_sequential, ids)
    benchmark("Batched (size=5)", fetch_batched,    ids, 5)
    benchmark("Fully parallel",   fetch_parallel,   ids)

    # Expected output (approximate):
    # Sequential             | latency: 2.001s | throughput:  10.0 req/s
    # Batched (size=5)       | latency: 0.401s | throughput:  49.9 req/s
    # Fully parallel         | latency: 0.101s | throughput: 198.2 req/s
    #
    # Key insight:
    #   Sequential  → high latency, low throughput (both bad)
    #   Batched     → trades some latency for sustainable throughput
    #   Fully parallel → lowest latency per batch, but unbounded
    #                    resource usage crushes throughput at scale
    #   Real systems use a thread/connection POOL (fixed size)
    #   to balance both: bounded concurrency = predictable latency
    #   AND sustainable throughput.
`,
    },
    {
      id: "cdn-and-edge-caching",
      slug: "cdn-and-edge-caching",
      title: "CDNs and Edge Caching",
      content: `# CDNs and Edge Caching

Without a CDN, every user on the planet — whether in Mumbai, São Paulo, or Stockholm — reaches back to the same origin server to fetch your homepage, images, and scripts. That round-trip adds hundreds of milliseconds of latency, hammers your origin with duplicate requests, and creates a single point of failure. Content Delivery Networks solve all three problems at once.

\`\`\`concept
{ "title": "The CDN Mental Model", "variant": "analogy", "content": "Think of your origin server as a bakery HQ in New York. Without a CDN, every customer in Tokyo flies to New York for a croissant. With a CDN, the HQ ships batches to franchise stores in Tokyo, London, and São Paulo. Most customers get their croissant in under 5 minutes from a local store — the HQ only ships to a franchise when that franchise runs out." }
\`\`\`

## What Is a CDN?

A **Content Delivery Network** is a geographically distributed network of servers — called **edge servers** or **Points of Presence (PoPs)** — that cache your content close to end users. When a user requests a resource, the CDN routes that request to the nearest edge location rather than the origin server.

The result is dramatic: research shows that edge-enhanced CDN architectures reduce content delivery latency by **81%** compared to traditional delivery, processing upward of 325 TB/s at peak load [6]. Browser caches served by CDN edges achieve **42% hit rates** for static content with response times averaging **1.8ms** [6].

\`\`\`sysdiag
{ "title": "CDN Architecture: Request Flow", "width": 680, "height": 340,
  "nodes": [
    { "id": "user_eu", "label": "User (EU)", "x": 80, "y": 80, "kind": "client" },
    { "id": "user_ap", "label": "User (APAC)", "x": 80, "y": 260, "kind": "client" },
    { "id": "edge_eu", "label": "Edge PoP\\nLondon", "x": 280, "y": 80, "kind": "service" },
    { "id": "edge_ap", "label": "Edge PoP\\nSingapore", "x": 280, "y": 260, "kind": "service" },
    { "id": "origin", "label": "Origin\\nServer (US)", "x": 540, "y": 170, "kind": "database" }
  ],
  "edges": [
    { "from": "user_eu", "to": "edge_eu", "label": "① request" },
    { "from": "user_ap", "to": "edge_ap", "label": "① request" },
    { "from": "edge_eu", "to": "origin", "label": "② cache miss only" },
    { "from": "edge_ap", "to": "origin", "label": "② cache miss only" }
  ],
  "annotations": {
    "edge_eu": "Caches static assets regionally. Serves cached responses in <5ms. Fetches from origin only on cache miss.",
    "origin": "Receives requests only when edge has no cached copy. Dramatically reduced load vs. serving all users directly."
  }
}
\`\`\`

## How Edge Caching Works

When a CDN edge server receives a request, it follows a simple decision tree. The first time a resource is requested at an edge location, the edge **fetches it from the origin** and stores a local copy. Every subsequent request hits the cache — no origin involved.

\`\`\`steps
{ "title": "CDN Request Lifecycle", "steps": [
  { "title": "User Requests a Resource", "content": "The browser resolves \`cdn.example.com/logo.png\`. DNS routes the request to the **nearest edge PoP** using anycast or geographic routing — typically the one with the lowest latency to the user's IP." },
  { "title": "Cache Lookup at the Edge", "content": "The edge server checks its local cache:\\n- **Cache HIT** → serve the cached file immediately. Latency: single-digit ms.\\n- **Cache MISS** → proceed to origin fetch." },
  { "title": "Origin Fetch (Cache Miss)", "content": "The edge forwards the request to the origin server. The origin responds with the file **plus cache-control headers** that tell the edge how long to keep the copy:\\n\`\`\`\\nCache-Control: public, max-age=86400\\n\`\`\`\\nThis means: cache publicly for 24 hours." },
  { "title": "Edge Stores and Serves", "content": "The edge caches the response locally and returns it to the user. Future users hitting this edge get the cached copy with no origin round-trip." },
  { "title": "TTL Expires or Invalidation Triggered", "content": "When \`max-age\` expires, the next request re-fetches from origin. Alternatively, a **cache purge API call** (e.g., Cloudflare's \`/zones/:id/purge_cache\`) can evict stale content on demand — critical after a deployment." }
]}
\`\`\`

## Push vs. Pull CDNs

The two dominant strategies for populating edge caches differ fundamentally in *who initiates* the content upload.

\`\`\`tabs
{ "tabs": [
  { "label": "Pull CDN", "icon": "⬇️", "content": "**How it works:** The edge server fetches content from the origin *on demand* — only when a user requests it and the cache is empty.\\n\\n**Flow:**\\n1. User requests \`image.jpg\` → cache miss at edge\\n2. Edge pulls from origin, caches it\\n3. Next user gets the cached copy\\n\\n**Best for:** Sites with large, unpredictable asset catalogs where you can't pre-determine what gets requested.\\n\\n**Trade-offs:**\\n| Pro | Con |\\n|-----|-----|\\n| Zero upfront work | First user after deploy/miss pays full latency |\\n| Automatically caches popular content | Rarely accessed content wastes cache space |\\n| Easy to start | Cache warm-up time on new deployments |\\n\\n**Examples:** Cloudflare (default), Fastly, Akamai CDN." },
  { "label": "Push CDN", "icon": "⬆️", "content": "**How it works:** You proactively upload content to CDN edge servers *before* any user requests it. URLs are rewritten to point to the CDN.\\n\\n**Flow:**\\n1. You deploy new assets → push script uploads to CDN\\n2. CDN replicates to all PoPs\\n3. Every user hits a warm cache from day one\\n\\n**Best for:** Sites with predictable, relatively static content — marketing pages, app bundles, video libraries.\\n\\n**Trade-offs:**\\n| Pro | Con |\\n|-----|-----|\\n| No cold-start latency | You manage content lifecycle manually |\\n| Predictable CDN behavior | More storage used (even unpopular content) |\\n| Great for large file delivery (video) | Requires a push pipeline in your deploy process |\\n\\n**Examples:** AWS CloudFront (configured with S3 origins), MaxCDN, BunnyCDN." },
  { "label": "Hybrid", "icon": "🔀", "content": "**Real-world systems rarely pick one exclusively.** Netflix is a canonical example:\\n\\n- **Push** → New movie releases are pre-positioned to edge servers globally *before* premiere night. This avoids thundering-herd cache misses when millions hit play simultaneously.\\n- **Pull** → Long-tail catalog titles (older movies) are pull-cached — no point paying storage costs for content with low request rates.\\n\\nThe decision criteria: **request frequency × file size × business criticality**.\\n\\n\`\`\`\\nif (high_traffic_expected AND asset_is_large):\\n    use PUSH\\nelse:\\n    use PULL  # simpler, covers most cases\\n\`\`\`" }
]}
\`\`\`

## Cache-Control Headers: The Contract Between You and the CDN

Cache-control headers are how you communicate caching policy from your origin to CDN edges (and browsers). Getting them wrong is one of the most common causes of stale content bugs or unnecessary origin load.

\`\`\`concept
{ "title": "Cache-Control Is a Contract", "variant": "rule", "content": "Cache-Control headers are the authoritative instructions your origin sends to every intermediary (CDN, proxy, browser). If you don't set them explicitly, CDNs apply default heuristics — often too aggressive or too conservative. Always set Cache-Control deliberately." }
\`\`\`

Here are the directives that matter most in CDN contexts:

| Directive | Meaning | Use Case |
|-----------|---------|----------|
| \`public\` | Any cache (CDN, proxy, browser) may store this | Static assets, public API responses |
| \`private\` | Only the browser may cache; CDN must not | User-specific pages, auth'd API responses |
| \`max-age=N\` | Cached copy is fresh for N seconds | Images, CSS, JS bundles |
| \`s-maxage=N\` | Overrides max-age for shared caches (CDN) only | When you want CDN TTL ≠ browser TTL |
| \`no-cache\` | Always revalidate with origin before serving | Frequently updated resources |
| \`no-store\` | Never cache anywhere | Sensitive data, financial responses |
| \`stale-while-revalidate=N\` | Serve stale while fetching fresh in background | UX smoothness, lower-sensitivity data |

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Missing / Wrong Headers", "code": "# No Cache-Control set on a marketing image\\n# CDN applies heuristic: cache for ~10% of Last-Modified age\\n# Result: unpredictable TTL, some edges cache 1 hour, some 1 day\\n\\n# Or worse: sensitive API response with no 'private' directive\\nGET /api/user/profile\\nCache-Control: max-age=3600   # CDN caches this!\\n# Any user hitting the same edge gets another user's profile data" }, "after": { "label": "Explicit, Correct Headers", "code": "# Static immutable asset (filename has content hash)\\nGET /static/app.a3f91c2b.js\\nCache-Control: public, max-age=31536000, immutable\\n\\n# Public page that changes occasionally\\nGET /blog/post-slug\\nCache-Control: public, s-maxage=3600, stale-while-revalidate=60\\n\\n# User-specific private data\\nGET /api/user/profile\\nCache-Control: private, no-cache" } }
\`\`\`

## Real-World Case Studies

### Netflix: Pre-Positioning for Premiere Night

When Netflix releases a blockbuster, tens of millions of users hit play within hours. Without CDN pre-positioning, origin servers would be obliterated on cache miss. Netflix's solution: **push new titles to Open Connect Appliances** (their custom CDN hardware, co-located inside ISP data centers) *before* the premiere. By showtime, the video chunks are already on the edge — origin load is near zero [5].

### GitHub: Immutable Asset Hashing + Long TTLs

Every JavaScript and CSS file GitHub serves has a **content hash in its filename** (e.g., \`app.a3f91c2b.js\`). This means:
1. The filename changes whenever content changes → no stale content problem
2. They set \`Cache-Control: public, max-age=31536000, immutable\` → edges cache for a full year
3. Old filenames are simply never requested again after a deploy

This pattern — **cache-busting via content hashing + long TTLs** — is the gold standard for static asset delivery.

### Cloudflare: Cache-Everything with Edge Rules

Cloudflare's pull CDN lets you define **Page Rules** or **Cache Rules** to override origin headers. For example, you might tell Cloudflare to cache all \`.html\` files for 4 hours at the edge, even if your origin says \`no-cache\`. This is powerful but dangerous — wrong rules serve stale HTML to users for hours.

\`\`\`callout
{ "type": "warning", "title": "Cache Invalidation Is Hard", "content": "Phil Karlton famously said there are only two hard things in computer science: cache invalidation and naming things. When you push a CDN cache with a 24-hour TTL and then discover a bug in production, you have two choices: (1) purge the cache via API — fast but requires CDN API access in your deploy pipeline; (2) wait for TTL expiry — simple but your users see the bug for up to 24 hours. Design your CDN strategy with invalidation in mind from day one." }
\`\`\`

## CDN Trade-Off Analysis

\`\`\`tabs
{ "tabs": [
  { "label": "Latency", "icon": "⚡", "content": "**CDN win:** Serving from an edge 50ms away vs. an origin 200ms away saves 150ms per request. Multiply by every asset on a page and every user load — the cumulative savings are enormous.\\n\\n**Caveat:** For highly dynamic, personalized content, you still hit the origin — CDN doesn't help (and adds a tiny overhead). Separate your static and dynamic content delivery paths." },
  { "label": "Origin Load", "icon": "🏋️", "content": "**CDN win:** A single origin server can serve millions of users when the CDN absorbs cache hits. Distributed caching systems demonstrate up to **98.2% reduction in database load** [6] with Memcached clusters achieving **95.3% hit rates** [6].\\n\\n**Caveat:** Cache miss storms (thundering herd) can still overwhelm origin. Use **request coalescing** — the CDN holds duplicate requests for the same uncached resource and makes only one origin fetch." },
  { "label": "Consistency", "icon": "🔄", "content": "**CDN challenge:** Stale data. If your origin updates a resource but the CDN holds a cached copy, users see old content until TTL expires or you purge.\\n\\n**Solutions:**\\n- Content hash filenames (eliminates stale CSS/JS)\\n- Short TTLs for mutable resources (accept more origin load)\\n- Surrogate keys / cache tags (purge a logical group with one API call)\\n- Stale-while-revalidate (serve stale immediately, refresh in background)" },
  { "label": "Cost", "icon": "💰", "content": "**CDN cost model:** You pay per GB transferred from edge to users (egress) + sometimes per request. Edge-to-origin traffic (cache misses) costs more.\\n\\n**Optimization:**\\n- Maximize cache hit ratio → fewer origin fetches → lower cost\\n- Use long TTLs + content hashing for immutable assets\\n- Push CDN for large predictable files (video) — cheaper than repeated pull fetches\\n- Compress assets (gzip/brotli) — smaller transfers = lower egress bills" }
]}
\`\`\`

\`\`\`quiz
{ "title": "CDN & Edge Caching", "questions": [
  {
    "question": "A user in Tokyo requests an image from a US-hosted website. The CDN edge server in Tokyo has never seen this request before. What happens?",
    "options": [
      "The CDN serves a blank response and logs an error",
      "The browser bypasses the CDN and goes directly to origin",
      "The Tokyo edge fetches the image from the US origin, caches it, and returns it to the user",
      "The request is routed to the nearest CDN PoP that already has the image cached"
    ],
    "answer": 2,
    "explanation": "On a cache miss, the edge server fetches from origin, stores the copy locally, and returns it to the user. All future requests to that edge hit the cache. This is the core Pull CDN behavior."
  },
  {
    "question": "Which Cache-Control directive should you use for a user's private account dashboard page?",
    "options": [
      "Cache-Control: public, max-age=3600",
      "Cache-Control: private, no-cache",
      "Cache-Control: s-maxage=86400",
      "Cache-Control: immutable"
    ],
    "answer": 1,
    "explanation": "'private' prevents CDN/proxy caches from storing the response — only the user's browser may cache it. 'no-cache' forces revalidation before serving. Together they ensure the CDN never caches sensitive per-user data."
  },
  {
    "question": "Netflix pre-positions new movie content to edge servers before a premiere. Which CDN strategy is this?",
    "options": [
      "Pull CDN — edges fetch content on first user request",
      "Anycast routing — DNS sends users to the nearest edge",
      "Push CDN — content is proactively uploaded to edges before user demand",
      "Cache invalidation — old content is purged and replaced"
    ],
    "answer": 2,
    "explanation": "Push CDN means the origin (or a deployment pipeline) proactively uploads content to edge servers. This avoids cold-start latency on premiere night when millions of simultaneous requests would otherwise cause a thundering herd of cache misses."
  },
  {
    "question": "GitHub serves JS files with names like \`app.a3f91c2b.js\` and sets \`max-age=31536000\`. Why is this safe even though the TTL is one full year?",
    "options": [
      "GitHub purges the CDN cache on every commit",
      "The content hash in the filename changes whenever the file changes, so old URLs are never requested after a new deploy",
      "Browsers ignore max-age for JavaScript files",
      "CDNs automatically detect content changes and invalidate the cache"
    ],
    "answer": 1,
    "explanation": "Content-addressed filenames are the key insight. When the file changes, the hash changes, generating a new URL. Old URLs remain cached (but are never referenced by the new HTML). New URLs start with a cache miss and get cached for a year. Zero stale content risk, maximum cache efficiency."
  },
  {
    "question": "You set \`Cache-Control: public, s-maxage=3600, max-age=300\` on a blog post. What does this mean?",
    "options": [
      "The CDN caches for 300 seconds; browsers cache for 3600 seconds",
      "The CDN caches for 3600 seconds; browsers cache for 300 seconds",
      "Both CDN and browser cache for 3600 seconds; 300 seconds is ignored",
      "The response is cached for 300 seconds total, then revalidated every 3600 seconds"
    ],
    "answer": 1,
    "explanation": "s-maxage overrides max-age specifically for shared caches (CDN, proxies). max-age applies to all caches including browsers. So the CDN holds it for 1 hour, but the browser only caches for 5 minutes — useful when you want fast CDN delivery but want browsers to revalidate more often."
  }
]}
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Cache Invalidation Strategies", "content": "## The Core Problem\\n\\nOnce content is cached at hundreds of edge servers globally, making all of them forget it is non-trivial. Here are the three main approaches:\\n\\n### 1. TTL Expiry (Time-Based)\\nThe simplest approach: set \`max-age\` and wait. Pros: zero infrastructure needed. Cons: stale content lives until TTL. Use short TTLs (minutes) for mutable content.\\n\\n### 2. Purge by URL\\nMost CDNs offer an API to instantly evict a specific URL:\\n\`\`\`\\nPOST /zones/:zone_id/purge_cache\\n{ \\"files\\": [\\"https://example.com/blog/post.html\\"] }\\n\`\`\`\\nFast (propagates in seconds) but requires knowing exactly which URLs to purge.\\n\\n### 3. Cache Tags / Surrogate Keys\\nTag cached responses with logical identifiers at the origin:\\n\`\`\`\\nCache-Tag: blog-post-123, author-456, category-tech\\n\`\`\`\\nWhen post 123 is updated, purge by tag — every cached URL tagged \`blog-post-123\` is evicted in one API call. Cloudflare, Fastly, and Varnish all support this pattern. This is the industrial-strength approach for CMS-backed sites.\\n\\n### 4. Versioned URLs (No Invalidation Needed)\\nThe best invalidation is the kind you never have to do. Content-hash filenames for static assets (CSS, JS, images) mean deployed changes automatically get new URLs — old caches expire harmlessly, new URLs get cached fresh. Combine with a short TTL on the HTML that references the assets." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "CDNs reduce latency by serving cached content from edge servers physically close to users, avoiding round-trips to a distant origin — cutting delivery latency by up to 81% in production systems.",
  "Pull CDNs cache content on-demand (first request triggers origin fetch); Push CDNs pre-populate edges proactively. Most real-world systems combine both based on request frequency and file size.",
  "Cache-Control headers are the contract between your origin and CDN edges. Always set \`public\` vs \`private\`, \`max-age\` vs \`s-maxage\`, and \`immutable\` vs \`no-cache\` deliberately — never rely on CDN heuristics for critical resources.",
  "Content hash filenames (e.g., \`app.a3f91c2b.js\`) combined with long TTLs are the gold standard for static assets — they eliminate stale content risk while maximizing cache efficiency.",
  "Cache invalidation is genuinely hard. Plan your strategy upfront: URL purges for ad-hoc fixes, cache tags for logical group invalidation, and versioned URLs to avoid invalidation entirely."
]}
\`\`\``,
    },
    {
      id: "checkpoint-scale-a-web-service",
      slug: "checkpoint-scale-a-web-service",
      title: "Checkpoint: Scale a Single-Server Web App",
      content: `# Checkpoint: Scale a Single-Server Web App

You've learned the theory. Now you apply it.

In this checkpoint, you'll play the role of a founding engineer at **Flashcard.io** — a study-tool startup that just went viral. Yesterday you had 1,000 users. Today your dashboard shows **10 million daily active users are expected by month's end**. Your single server is already struggling.

Work through each stage below. At each step, identify the bottleneck, pick the right lever, and understand the trade-offs before moving on.

---

## The Starting Point

Before touching anything, you need a clear picture of what you're working with.

\`\`\`sysdiag
{
  "title": "Stage 0 — The Single-Server Architecture",
  "width": 600,
  "height": 280,
  "nodes": [
    { "id": "user", "label": "Users", "x": 60, "y": 140, "kind": "client" },
    { "id": "server", "label": "App Server\\n(code + DB)", "x": 300, "y": 140, "kind": "service" },
    { "id": "disk", "label": "Local Disk\\n(sessions, uploads)", "x": 520, "y": 140, "kind": "store" }
  ],
  "edges": [
    { "from": "user", "to": "server", "label": "HTTP requests" },
    { "from": "server", "to": "disk", "label": "reads/writes" }
  ],
  "annotations": {
    "server": "Everything lives here: web server, application logic, database engine, file storage. One process handles all traffic.",
    "disk": "Session tokens and user uploads stored locally — only this machine can access them."
  }
}
\`\`\`

**Current specs:** 1 server, 2 vCPUs, 8 GB RAM, SQLite database on local disk.

**Observed symptoms at 50K DAU:**
- p99 latency: 4.2 seconds
- CPU utilization: 94% sustained
- Occasional 502 errors under traffic spikes
- Deployments require 30–90 seconds of downtime

\`\`\`concept
{ "title": "The Bottleneck Always Moves", "variant": "mental-model", "content": "Scaling is never one fix — it's a sequence of fixes. Each time you remove a bottleneck, the *next* weakest link becomes the new bottleneck. This checkpoint walks you through that chain deliberately. Real systems at companies like Netflix, Instagram, and Twitter all passed through these same stages." }
\`\`\`

---

## Stage 1 — Separate the Database

The first bottleneck is resource contention. Your application code and database engine are fighting over the same 2 CPUs and 8 GB RAM.

\`\`\`steps
{
  "title": "How to Separate the Database Layer",
  "steps": [
    {
      "title": "Choose a proper database engine",
      "content": "Migrate from SQLite (single-writer, file-locked) to **PostgreSQL** or **MySQL** on a dedicated machine. These support concurrent connections, row-level locking, and replication — all of which you'll need soon.\\n\\n\`\`\`\\nSQLite:     1 writer at a time, no network access\\nPostgreSQL: hundreds of concurrent connections, MVCC, replication-ready\\n\`\`\`"
    },
    {
      "title": "Move the DB to its own host",
      "content": "Provision a second machine (DB server). Your app server now talks to it over a private network. The DB server can be tuned for I/O (more RAM for buffer pool, fast NVMe disks) while the app server is tuned for CPU.\\n\\n**Private network matters:** database traffic never hits the public internet, reducing both latency and attack surface."
    },
    {
      "title": "Update your connection string",
      "content": "\`\`\`\\n# Before (SQLite, local file)\\nDATABASE_URL=sqlite:///./flashcards.db\\n\\n# After (PostgreSQL, private network)\\nDATABASE_URL=postgresql://user:pass@10.0.0.5:5432/flashcards\\n\`\`\`\\n\\nConnection pooling (e.g., PgBouncer) prevents the app from exhausting DB connections under load."
    }
  ]
}
\`\`\`

**Result after Stage 1:**

| Metric | Before | After |
|--------|--------|-------|
| App server CPU | 94% | 61% |
| DB query p99 | 820ms | 190ms |
| Max concurrent users | ~800 | ~3,000 |

You've bought time — but a single app server is still your ceiling.

---

## Stage 2 — Add Load Balancing

With one app server, any spike kills you. A single hardware failure takes the whole product down. The fix: run multiple app servers behind a **load balancer**.

\`\`\`sysdiag
{
  "title": "Stage 2 — Load Balancer + App Server Pool",
  "width": 680,
  "height": 340,
  "nodes": [
    { "id": "users", "label": "Users", "x": 40, "y": 170, "kind": "client" },
    { "id": "lb", "label": "Load Balancer\\n(nginx / ALB)", "x": 200, "y": 170, "kind": "service" },
    { "id": "app1", "label": "App Server 1", "x": 390, "y": 90, "kind": "service" },
    { "id": "app2", "label": "App Server 2", "x": 390, "y": 170, "kind": "service" },
    { "id": "app3", "label": "App Server 3", "x": 390, "y": 250, "kind": "service" },
    { "id": "db", "label": "PostgreSQL\\n(primary)", "x": 590, "y": 170, "kind": "store" }
  ],
  "edges": [
    { "from": "users", "to": "lb", "label": "all traffic" },
    { "from": "lb", "to": "app1", "label": "" },
    { "from": "lb", "to": "app2", "label": "" },
    { "from": "lb", "to": "app3", "label": "" },
    { "from": "app1", "to": "db", "label": "" },
    { "from": "app2", "to": "db", "label": "" },
    { "from": "app3", "to": "db", "label": "" }
  ],
  "annotations": {
    "lb": "Health-checks each app server every 5s. Routes around unhealthy instances automatically. Can scale horizontally too.",
    "app2": "App servers are stateless — any server can handle any request. Horizontal scaling is now as simple as launching another instance."
  }
}
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Algorithms",
      "icon": "⚖️",
      "content": "**Round Robin** — requests cycle through servers in order. Simple, works well when requests are similar in cost.\\n\\n**Least Connections** — route to whichever server has the fewest open connections. Better when requests vary in duration (e.g., some API calls take 5ms, others 500ms).\\n\\n**IP Hash** — same client IP always goes to the same server. Useful for sticky sessions *before* you've moved to stateless design (see Stage 3).\\n\\n**Weighted** — heavier servers get more traffic. Useful during rolling upgrades when new instances are warming up."
    },
    {
      "label": "Health Checks",
      "icon": "❤️",
      "content": "The load balancer pings each server on an interval:\\n\\n\`\`\`\\nGET /healthz HTTP/1.1\\nHost: app-server-2\\n\\nHTTP/1.1 200 OK\\n{\\"status\\": \\"ok\\", \\"db\\": \\"connected\\"}\\n\`\`\`\\n\\nIf a server returns non-200 or times out, the LB **removes it from rotation** automatically. This gives you **zero-downtime deployments**: drain traffic, deploy, re-add to pool.\\n\\nFlashcard.io used this to drop from 30 minutes of planned downtime to **zero**."
    },
    {
      "label": "Trade-offs",
      "icon": "⚡",
      "content": "**Gains:**\\n- Horizontal scale: add servers on demand\\n- Fault tolerance: one server down ≠ outage\\n- Zero-downtime deployments via traffic draining\\n\\n**New risks introduced:**\\n- Load balancer is now a **single point of failure** → run it in active-passive HA pair\\n- Sessions stored on one server become **invalid** when routed to another → solve in Stage 3\\n- More infrastructure to monitor and maintain"
    }
  ]
}
\`\`\`

---

## Stage 3 — Make Everything Stateless

Here's the trap most teams fall into: they add load balancing, then discover that user sessions break when requests bounce between servers.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Stateful — Sessions on Disk",
    "code": "# Session stored in /tmp on App Server 1\\nrequest_1 → App Server 1 → session OK  ✓\\nrequest_2 → App Server 2 → session NOT FOUND  ✗\\n\\n# Workaround: sticky sessions (IP hash)\\n# Problem: server 1 goes down → all those users log out\\n# Problem: load is uneven (old users stuck on old servers)"
  },
  "after": {
    "label": "Stateless — Sessions in Redis",
    "code": "# Session token stored in Redis (shared, in-memory)\\nrequest_1 → App Server 1 → reads Redis → session OK  ✓\\nrequest_2 → App Server 2 → reads Redis → session OK  ✓\\nrequest_3 → App Server 3 → reads Redis → session OK  ✓\\n\\n# Any server can handle any request\\n# Scale app servers freely — no session affinity needed"
  }
}
\`\`\`

\`\`\`concept
{ "title": "The Stateless Rule", "variant": "rule", "content": "A stateless server stores **nothing** between requests that it can't reconstruct from the request itself or a shared external store. All persistent state — sessions, uploads, queues — lives outside the app server. This is what makes horizontal scaling trivially easy: every server is identical and interchangeable." }
\`\`\`

**What to move out of the app server:**

| What | Where to move it | Why |
|------|-----------------|-----|
| Session tokens | Redis (in-memory cache) | Fast reads, TTL support, shared across servers |
| User uploads | Object storage (S3 / GCS) | Durable, globally addressable, no disk pressure |
| Background jobs | Queue (SQS / BullMQ) | Decouple processing from request handling |
| Config / feature flags | Environment variables or config service | Consistent across all instances |

After this change, you can auto-scale your app server count from 3 → 30 → 300 without any code changes. Your Auto Scaling Group just launches more identical instances.

---

## Stage 4 — Add a CDN for Static Assets

At 10M DAU, a significant chunk of your bandwidth is serving the same files over and over: JavaScript bundles, CSS, images, fonts. Every one of these requests hits your origin servers unnecessarily.

\`\`\`concept
{ "title": "CDN as a Global Cache", "variant": "analogy", "content": "Imagine your origin server is a warehouse in Virginia. Every user in Tokyo, Lagos, and Berlin sends a truck to Virginia just to pick up the same box of cereal. A CDN is like putting mini-warehouses (edge nodes) in 200+ cities worldwide. First request → fetched from Virginia and cached locally. Every subsequent request → served from the nearest city in milliseconds." }
\`\`\`

\`\`\`sysdiag
{
  "title": "Stage 4 — Final Architecture with CDN",
  "width": 700,
  "height": 400,
  "nodes": [
    { "id": "users", "label": "Users\\n(global)", "x": 40, "y": 200, "kind": "client" },
    { "id": "cdn", "label": "CDN Edge\\n(CloudFront / Cloudflare)", "x": 200, "y": 100, "kind": "service" },
    { "id": "lb", "label": "Load Balancer", "x": 200, "y": 260, "kind": "service" },
    { "id": "app1", "label": "App Server 1", "x": 380, "y": 200, "kind": "service" },
    { "id": "app2", "label": "App Server 2", "x": 380, "y": 280, "kind": "service" },
    { "id": "redis", "label": "Redis\\n(sessions)", "x": 560, "y": 120, "kind": "store" },
    { "id": "db", "label": "PostgreSQL\\n(primary + replicas)", "x": 560, "y": 240, "kind": "store" },
    { "id": "s3", "label": "Object Storage\\n(uploads)", "x": 560, "y": 340, "kind": "store" }
  ],
  "edges": [
    { "from": "users", "to": "cdn", "label": "static assets" },
    { "from": "users", "to": "lb", "label": "API requests" },
    { "from": "cdn", "to": "lb", "label": "cache miss → origin" },
    { "from": "lb", "to": "app1", "label": "" },
    { "from": "lb", "to": "app2", "label": "" },
    { "from": "app1", "to": "redis", "label": "" },
    { "from": "app1", "to": "db", "label": "" },
    { "from": "app2", "to": "db", "label": "" },
    { "from": "app1", "to": "s3", "label": "" }
  ],
  "annotations": {
    "cdn": "Serves JS, CSS, images, fonts from the nearest edge node. Cache-Control headers determine TTL. 80%+ of byte traffic never reaches origin.",
    "redis": "Shared session store. All app servers read/write here. Also used for rate limiting counters.",
    "db": "Read replicas handle read-heavy workloads (flashcard lookups). Primary handles writes only."
  }
}
\`\`\`

**CDN impact at scale:**

| Traffic type | % of total bytes | CDN cache hit rate | Origin load reduction |
|-------------|-----------------|-------------------|----------------------|
| Static assets (JS/CSS/images) | ~78% | ~95% | ~74% |
| API responses (JSON) | ~20% | ~40% (cacheable endpoints) | ~8% |
| Real-time (WebSocket) | ~2% | 0% (bypasses CDN) | 0% |

\`\`\`callout
{ "type": "tip", "title": "Cache-Control is Everything", "content": "The CDN respects the \`Cache-Control\` header you set on each response.\\n\\n- \`Cache-Control: public, max-age=31536000, immutable\` → hashed JS/CSS bundles (never expire, content-addressed)\\n- \`Cache-Control: public, max-age=300\` → API responses that change slowly (e.g., course catalog)\\n- \`Cache-Control: private, no-store\` → user-specific data (profile, session) — never cache at CDN\\n\\nGetting these wrong causes either stale data bugs or zero CDN benefit." }
\`\`\`

---

## Putting It All Together

Let's trace a single request through the final architecture to cement the picture.

\`\`\`steps
{
  "title": "A Request Through the Scaled System",
  "steps": [
    {
      "title": "User opens Flashcard.io on mobile in London",
      "content": "Browser requests \`https://flashcard.io/\`. DNS resolves to Cloudflare's nearest edge node (London data center, ~8ms away instead of ~90ms to US origin)."
    },
    {
      "title": "CDN serves static assets from edge cache",
      "content": "HTML shell, 240KB JS bundle, CSS, and logo image are all served from the London edge node. **Cache hit — origin never touched.** Total: ~60ms."
    },
    {
      "title": "App makes API call to fetch user's decks",
      "content": "\`GET /api/decks\` — this is dynamic data, routed through CDN to origin. CDN cache miss → forwarded to the **Load Balancer** in US-East."
    },
    {
      "title": "Load balancer routes to a healthy app server",
      "content": "Round-robin selects App Server 2 (currently handling 340 active connections vs. App Server 1's 380). Health check passed 3 seconds ago."
    },
    {
      "title": "App server handles the request statelessly",
      "content": "App Server 2 reads the session token from the \`Authorization\` header, validates it against **Redis** (4ms), then queries a **PostgreSQL read replica** for the user's decks (12ms). No local state read or written."
    },
    {
      "title": "Response returns to user",
      "content": "JSON payload sent back through the LB → CDN edge → user's browser. Total round-trip: **~180ms** from London. Before scaling: **4,200ms** from the overloaded single server."
    }
  ]
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "Checkpoint Quiz",
  "questions": [
    {
      "question": "Your app stores user session data in a local file on each app server. You add a second app server behind a load balancer using round-robin. What will happen?",
      "options": [
        "Sessions will work correctly because round-robin is deterministic",
        "Sessions will break when requests route to the server that doesn't have the local session file",
        "The load balancer will replicate session files between servers automatically",
        "Sessions will work because HTTP is stateless by default"
      ],
      "answer": 1,
      "explanation": "Round-robin is not deterministic from the user's perspective — request 1 might go to Server A, request 2 to Server B. Server B has no knowledge of the session file created on Server A, so the user appears logged out. The fix is to move sessions to a shared external store like Redis."
    },
    {
      "question": "A CDN edge node in Singapore has a cached copy of your homepage JS bundle. A developer deploys a new version of the bundle to the origin server. What is the BEST approach to ensure users get the new version immediately?",
      "options": [
        "Wait for the CDN TTL to expire naturally",
        "Use content-addressed filenames (e.g., main.a3f9c2.js) and set max-age=31536000",
        "Set Cache-Control: no-cache on all assets",
        "Manually purge the CDN cache after every deploy"
      ],
      "answer": 1,
      "explanation": "Content-addressed filenames (hashes derived from file content) mean a new deployment creates a new filename. The old file's cache entry is simply never requested again. The new file starts as a cache miss, then warms up. This avoids both stale-asset bugs AND the need to purge/wait — the industry standard approach used by virtually all production frontend systems."
    },
    {
      "question": "At 5M DAU, your PostgreSQL primary is at 85% CPU even after adding app server replicas. Reads account for 90% of the query volume. What is the most targeted fix?",
      "options": [
        "Upgrade the primary to a larger instance immediately",
        "Add a Redis cache layer in front of all database calls",
        "Add PostgreSQL read replicas and route read queries to them",
        "Shard the database by user ID"
      ],
      "answer": 2,
      "explanation": "If 90% of the load is reads, adding read replicas directly addresses the bottleneck. Reads go to replicas, writes go to the primary. This is horizontal scaling at the database layer. Upgrading the instance (vertical scaling) is faster to implement but has a ceiling and doesn't improve fault tolerance. Sharding is a much more invasive change appropriate for a later stage. Redis caching is also helpful but adds complexity and consistency challenges — read replicas should come first."
    },
    {
      "question": "Which of these is NOT a requirement for a truly stateless app server?",
      "options": [
        "User session tokens must be validated from a shared store (Redis)",
        "Uploaded files must be stored in object storage (S3), not local disk",
        "The server must use a framework that supports async I/O",
        "Any instance can handle any request without knowledge of prior requests"
      ],
      "answer": 2,
      "explanation": "Statelessness is about *where data lives*, not how I/O is performed. Async I/O (like Node.js's event loop or Python's asyncio) is a performance optimization for concurrency — unrelated to statelessness. A blocking synchronous server can be perfectly stateless. The other three options are genuine requirements: session state must live externally, files can't be on local disk, and any server must be interchangeable."
    }
  ]
}
\`\`\`

---

## The Evolution in One View

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Stage 0",
      "icon": "🖥️",
      "content": "**Single Server**\\n\\n- All components on one machine\\n- SQLite database, local sessions, local disk\\n- Max ~800 concurrent users\\n- Any failure = total outage\\n- Deployments = downtime\\n\\n**When it's fine:** Prototypes, internal tools, <1K DAU"
    },
    {
      "label": "Stage 1",
      "icon": "🗄️",
      "content": "**Separated Database**\\n\\n- PostgreSQL on dedicated DB server\\n- App and DB can scale independently\\n- Connection pooling (PgBouncer)\\n- Max ~3K concurrent users\\n- DB is now a single point of failure (add replica for HA)\\n\\n**When to do it:** As soon as DB contention appears, typically >500 DAU"
    },
    {
      "label": "Stage 2",
      "icon": "⚖️",
      "content": "**Load Balancing**\\n\\n- 3+ app servers behind nginx / AWS ALB\\n- Round-robin or least-connections routing\\n- Automatic health checks, traffic draining\\n- Zero-downtime deployments\\n- Max ~30K+ concurrent users (scales horizontally)\\n\\n**When to do it:** When one app server CPU sustains >70%"
    },
    {
      "label": "Stage 3",
      "icon": "📦",
      "content": "**Stateless Design**\\n\\n- Sessions → Redis\\n- Uploads → S3 / object storage\\n- Background jobs → queue\\n- Servers are identical, interchangeable\\n- Auto Scaling Groups become practical\\n\\n**When to do it:** Before or immediately after adding load balancing. Required for correct behavior."
    },
    {
      "label": "Stage 4",
      "icon": "🌐",
      "content": "**CDN + Read Replicas**\\n\\n- Static assets served from global edge (CDN)\\n- Read queries → PostgreSQL replicas\\n- Write queries → PostgreSQL primary\\n- Supports 10M+ DAU\\n- 74% reduction in origin bandwidth\\n\\n**When to do it:** When static asset bandwidth or DB read load becomes the bottleneck"
    }
  ]
}
\`\`\`

---

\`\`\`callout
{ "type": "info", "title": "What's Still Left at 10M DAU?", "content": "This architecture comfortably handles 10M DAU — but it's not the final form. At 100M DAU, you'd add: database sharding (partition data by user region or ID range), a message queue for async processing (Kafka / SQS), geographic replication (multi-region active-active), and edge compute for latency-sensitive logic. Each of these is a future module. For now, you've cleared the hardest conceptual hurdle: thinking in layers, not monoliths." }
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Scale in stages — each fix exposes the next bottleneck. Premature optimization wastes engineering time.",
    "Separate the database first: it's the highest-impact, lowest-risk change when a single server is CPU-bound.",
    "Load balancing only works cleanly when servers are stateless. Move sessions to Redis and files to object storage before adding replicas.",
    "CDNs dramatically reduce origin load by serving static assets from geographically distributed edge nodes — set Cache-Control headers correctly or you get no benefit.",
    "Read replicas are horizontal scaling for databases: route reads to replicas, writes to the primary, and postpone sharding until you truly need it.",
    "The goal of this entire architecture is interchangeability: any server should be able to handle any request at any time. That property is what makes auto-scaling effortless."
  ]
}
\`\`\``,
    },
  ],
};
