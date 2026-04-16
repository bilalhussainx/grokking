import { Module } from "../types";

export const foundationsModule: Module = {
  id: "modern-foundations",
  title: "Foundations of Modern System Design",
  description: "Core principles of distributed systems: architectural styles, domain-driven design, and API infrastructure.",
  lessons: [
    {
      id: "intro-modern-system-design",
      slug: "intro-modern-system-design",
      title: "Intro to Modern System Design",
      content: `# Intro to Modern System Design

## Why Modern System Design?

The systems we use daily — messaging apps, streaming platforms, ride-sharing services — serve hundreds of millions of users across the globe. Designing them requires a fundamentally different mindset than building a single-server application.

Modern system design is about making **trade-offs** under constraints: consistency vs. availability, latency vs. throughput, simplicity vs. scalability.

\`\`\`concept
{ "title": "The Distributed Systems Mindset", "variant": "mental-model", "content": "A distributed system is a collection of independent computers that appear to users as a single coherent system. Tasks are spread across multiple machines that communicate and coordinate actions by passing messages over a network. This means your design must account for network failures, partial outages, and two fundamental principles: (1) no shared global state — each node has its own local view of the system, and (2) unreliable communication — messages can be delayed, duplicated, or lost." }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why This Matters for Interviews", "content": "Candidates who treat distributed systems as scaled-up monoliths quickly run into contradictions during follow-up questions. Interviewers probe whether you understand *why* coordination is hard — not just *how* to draw boxes and arrows." }
\`\`\`

## The Scale of Modern Systems

Consider the numbers behind everyday platforms:

| System | Daily Active Users | QPS (peak) | Data Stored |
|--------|-------------------|------------|-------------|
| Slack | 30M+ | ~500K msg/s | Petabytes |
| Netflix | 230M+ | ~1M stream/s | Exabytes |
| Uber | 130M+ users | ~100K ride/s | Petabytes |
| Stripe | Millions of businesses | ~10K txn/s | Petabytes |

A system handling 100 QPS can run on a single server. One handling 500K QPS needs a distributed fleet of thousands. Scale dictates architecture — not the other way around.

\`\`\`concept
{ "title": "Scale Changes Everything", "variant": "rule", "content": "At 100 QPS: a single database works fine. At 10K QPS: you need read replicas and caching. At 100K QPS: you need sharding, CDNs, and async processing. The same feature requires a fundamentally different design at each order of magnitude." }
\`\`\`

## The 5-Step Design Process

Every system design follows a consistent flow. Master this process and you can tackle any system — in an interview or in production.

\`\`\`steps
{ "title": "The 5-Step System Design Process", "steps": [ { "title": "1. Requirements", "content": "Define **functional** requirements (what the system does) and **non-functional** requirements (how well it performs).\\n\\n- Functional: *Users can send messages*, *Users can upload videos*\\n- Non-functional: *Messages deliver in <100ms*, *99.99% availability*\\n\\nMost interview mistakes happen here — candidates jump to architecture before pinning down constraints." }, { "title": "2. Estimation", "content": "Calculate QPS, storage needs, and bandwidth. Quick math prevents over-engineering:\\n\\n\`\`\`\\n1M users × 10 actions/day = 10M actions/day\\n10M ÷ 86,400 seconds ≈ 115 QPS average\\nPeak = 115 × 3 ≈ 345 QPS\\n\`\`\`\\n\\nThe 3× multiplier accounts for daily traffic peaks and provides a safety buffer." }, { "title": "3. High-Level Architecture", "content": "Sketch the major components and data flow:\\n- **API Gateway / Load Balancer** — single entry point\\n- **Services** — auth, core business logic, notifications\\n- **Data Layer** — databases, caches, message queues\\n\\nDon't optimize yet. Get the skeleton right first." }, { "title": "4. Deep Dives", "content": "Zoom into the hardest subproblems. This is where real engineering lives:\\n- Message ordering and deduplication\\n- Video encoding and adaptive bitrate\\n- Payment idempotency\\n\\nChoose 2–3 areas to explore deeply. Breadth signals awareness; depth signals competence." }, { "title": "5. Trade-offs", "content": "No design is perfect. Every choice has a cost. The best engineers articulate *why* they chose one option over another.\\n\\n- Why SQL over NoSQL?\\n- Why eventual consistency over strong consistency?\\n- What would you change if the write load tripled?\\n\\nDocumenting trade-offs is what separates senior engineers from junior ones." } ] }
\`\`\`

### Back-of-the-Envelope: A Real Example

Let's run the numbers for a Slack-scale messaging system:

\`\`\`trace
{ "title": "Estimation Walkthrough: Messaging at Scale", "language": "python", "code": "daily_users = 30_000_000\\nmsgs_per_user_per_day = 40\\n\\ndaily_messages = daily_users * msgs_per_user_per_day\\nseconds_per_day = 86_400\\navg_qps = daily_messages / seconds_per_day\\npeak_qps = avg_qps * 3\\n\\nbytes_per_msg = 200\\nstorage_per_day_bytes = daily_messages * bytes_per_msg\\nstorage_per_day_gb = storage_per_day_bytes / (1024 ** 3)", "frames": [ { "line": 1, "vars": { "daily_users": 30000000 }, "note": "30M DAU — Slack's reported figure", "stdout": "" }, { "line": 4, "vars": { "daily_messages": 1200000000 }, "note": "1.2 billion messages per day", "stdout": "" }, { "line": 6, "vars": { "avg_qps": 13888 }, "note": "≈ 14,000 messages/second average", "stdout": "" }, { "line": 7, "vars": { "peak_qps": 41666 }, "note": "3× multiplier for business-hours spike", "stdout": "" }, { "line": 11, "vars": { "storage_per_day_gb": 223 }, "note": "~224 GB of new message data every day", "stdout": "" } ], "speed": 900 }
\`\`\`

### High-Level Architecture

\`\`\`sysdiag
{ "title": "Canonical System Design Architecture", "width": 680, "height": 380, "nodes": [ { "id": "client", "label": "Clients\\n(Web / Mobile)", "x": 80, "y": 190, "kind": "client" }, { "id": "lb", "label": "Load Balancer\\n/ API Gateway", "x": 250, "y": 190, "kind": "service" }, { "id": "auth", "label": "Auth\\nService", "x": 430, "y": 100, "kind": "service" }, { "id": "core", "label": "Core\\nService(s)", "x": 430, "y": 190, "kind": "service" }, { "id": "notify", "label": "Notification\\nService", "x": 430, "y": 280, "kind": "service" }, { "id": "cache", "label": "Cache\\n(Redis)", "x": 590, "y": 120, "kind": "cache" }, { "id": "db", "label": "Database\\n(Primary)", "x": 590, "y": 220, "kind": "database" }, { "id": "queue", "label": "Message\\nQueue", "x": 590, "y": 320, "kind": "queue" } ], "edges": [ { "from": "client", "to": "lb", "label": "HTTPS" }, { "from": "lb", "to": "auth", "label": "" }, { "from": "lb", "to": "core", "label": "" }, { "from": "core", "to": "cache", "label": "read" }, { "from": "core", "to": "db", "label": "write" }, { "from": "core", "to": "queue", "label": "publish" }, { "from": "queue", "to": "notify", "label": "consume" } ], "annotations": { "lb": "Single entry point. Distributes traffic across service instances. Handles SSL termination and basic rate limiting.", "core": "Stateless business logic. Horizontal scaling: add more instances behind the load balancer.", "cache": "Reduce database reads for hot data. Cache-aside pattern: check cache first, fall back to DB.", "db": "Source of truth. Start with one primary; add read replicas when reads dominate.", "queue": "Decouple producers from consumers. Enables async processing and smooths traffic spikes." } }
\`\`\`

## What You Will Learn

In this course, we design six real-world systems from scratch:

\`\`\`tabs
{ "tabs": [ { "label": "Slack", "icon": "💬", "content": "**Real-time messaging at scale**\\n\\nCore challenges: WebSocket connection management, message fan-out to thousands of subscribers, presence/online status, message ordering guarantees.\\n\\nKey concepts: Pub/sub architecture, consistent hashing, horizontal WebSocket scaling." }, { "label": "Netflix", "icon": "🎬", "content": "**Video streaming and CDN architecture**\\n\\nCore challenges: Encoding videos into adaptive bitrates, serving petabytes with low latency worldwide, personalized recommendations.\\n\\nKey concepts: CDN design, distributed encoding pipelines, cold vs. hot content tiering." }, { "label": "Uber", "icon": "🚗", "content": "**Location-aware ride matching**\\n\\nCore challenges: Real-time geolocation tracking, efficient proximity search, matching supply to demand under time pressure.\\n\\nKey concepts: Geohashing, consistent hashing for driver dispatch, event-driven coordination." }, { "label": "Stripe", "icon": "💳", "content": "**Payment processing with guarantees**\\n\\nCore challenges: Idempotency (no double charges), distributed transactions, PCI compliance, reconciliation.\\n\\nKey concepts: Idempotency keys, two-phase commit, event sourcing for audit trails." }, { "label": "Google Docs", "icon": "📄", "content": "**Real-time collaborative editing**\\n\\nCore challenges: Multiple users editing the same document simultaneously, conflict resolution, low-latency sync.\\n\\nKey concepts: Operational transformation (OT), CRDTs, WebSocket session management." }, { "label": "Social Network", "icon": "🌐", "content": "**News feed and graph-based features**\\n\\nCore challenges: Fan-out on write vs. fan-out on read, graph traversal at scale, feed ranking.\\n\\nKey concepts: Push vs. pull feed models, denormalization, graph databases." } ] }
\`\`\`

Each module follows the same 5-step design process, so you build a **repeatable framework** applicable to any system design interview or real-world architecture decision.

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "If your system needs to handle 1M requests/day with peak traffic 3× average, what is the peak QPS?", "options": ["12 QPS", "35 QPS", "115 QPS", "347 QPS"], "answer": 1, "explanation": "1M ÷ 86,400 ≈ 11.6 QPS average. Peak = 11.6 × 3 ≈ 35 QPS. Always provision for peak, not average." }, { "question": "Which of the following is a NON-functional requirement?", "options": ["Users can upload videos", "System maintains 99.9% uptime", "Users can search for content", "Users can send direct messages"], "answer": 1, "explanation": "Uptime is a quality attribute — it describes *how well* the system performs, not *what* it does. Functional requirements describe features; non-functional requirements describe constraints." }, { "question": "Why multiply average QPS by 3 for peak estimation?", "options": ["It is an arbitrary industry convention", "It accounts for daily usage patterns and provides a safety buffer", "It only handles server failure scenarios", "It is required by cloud provider SLAs"], "answer": 1, "explanation": "The 3× multiplier accounts for diurnal traffic patterns (peak hours vs. off-peak), provides headroom for unexpected spikes, and ensures the system degrades gracefully rather than falling over at the first surge." }, { "question": "According to distributed systems principles, why is coordination between nodes inherently hard?", "options": ["Networks are too slow", "There is no shared global state — each node has its own local view", "Databases cannot handle concurrent writes", "Load balancers introduce too much latency"], "answer": 1, "explanation": "The fundamental principle of 'no shared global state' means nodes cannot instantly agree on the current state of the system. This is why replication lag, cache invalidation, and distributed transactions are hard problems." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Principles of Modern System Design", "items": [ "Design for failure — everything will fail; your system should survive it gracefully.", "Scale horizontally — add machines, not bigger machines.", "No shared global state — coordination is hard because nodes each have a local view.", "Embrace eventual consistency — strict consistency rarely scales to internet-level load.", "Measure everything — you cannot improve what you cannot observe.", "Estimation first — back-of-the-envelope math prevents both over-engineering and under-provisioning." ] }
\`\`\`

Let's begin.`,
    },
    {
      id: "monolith-vs-microservices",
      slug: "monolith-vs-microservices",
      title: "Monolith vs Microservices",
      content: `\`\`\`concept
{"title": "Monolith vs Microservices", "variant": "mental-model", "content": "Think of a monolith as a single large factory where every department shares the same building, power supply, and management. Microservices are like a network of specialized workshops, each with its own tools and inventory, connected by delivery trucks. Both can produce the same product — the difference is how they handle growth, failure, and change."}
\`\`\`

## The Monolith

A monolithic architecture packages all functionality into a single deployable unit. Every feature — authentication, messaging, billing, notifications — lives in one codebase and one process. All modules share the same database and communicate through in-process function calls rather than network requests.

\`\`\`sysdiag
{"title": "Monolith Architecture", "width": 600, "height": 300,
 "nodes": [
   {"id": "app", "label": "Monolith Application", "x": 300, "y": 150, "kind": "service"},
   {"id": "auth", "label": "Auth Module", "x": 150, "y": 100, "kind": "component"},
   {"id": "msg", "label": "Messaging", "x": 300, "y": 100, "kind": "component"},
   {"id": "bill", "label": "Billing", "x": 450, "y": 100, "kind": "component"},
   {"id": "db", "label": "Shared Database", "x": 300, "y": 250, "kind": "database"}
 ],
 "edges": [
   {"from": "auth", "to": "app", "label": "in-process"},
   {"from": "msg", "to": "app", "label": "in-process"},
   {"from": "bill", "to": "app", "label": "in-process"},
   {"from": "app", "to": "db", "label": "queries"}
 ],
 "annotations": {
   "app": "Single deployable unit — one build, one process, one release cycle",
   "db": "All modules share the same database and can participate in ACID transactions"
 }}
\`\`\`

\`\`\`tabs
{"tabs": [
  {"label": "Advantages", "icon": "✅", "content": "- **Simple to develop** — One repo, one build, one deployment pipeline\\n- **Easy debugging** — In-process calls produce single stack traces across all modules\\n- **Low latency** — No network hops between modules; in-process calls are sub-microsecond\\n- **ACID transactions** — One database means real multi-table transactions with no coordination overhead\\n- **Lower initial cost** — Smaller teams and fewer operational tools required at the start"},
  {"label": "Disadvantages", "icon": "⚠️", "content": "- **Scaling is all-or-nothing** — Cannot scale messaging independently of billing; must replicate the entire app\\n- **Deployment risk** — A bug in notifications can take down the entire application\\n- **Tech lock-in** — Entire app must use the same language, framework, and runtime version\\n- **Team coupling** — 50 engineers working in one codebase creates merge conflicts and coordination overhead\\n- **Slow CI/CD** — As the codebase grows, build and test times increase for every change"}
]}
\`\`\`

## Microservices

Microservices decompose the system into small, independently deployable services. Crucially, each service owns its own data — there is no shared database. Services communicate over the network, typically via HTTP/REST, gRPC, or an async message bus.

\`\`\`sysdiag
{"title": "Microservices Architecture", "width": 640, "height": 360,
 "nodes": [
   {"id": "gw", "label": "API Gateway", "x": 320, "y": 40, "kind": "service"},
   {"id": "auth", "label": "Auth Service", "x": 100, "y": 160, "kind": "service"},
   {"id": "msg", "label": "Msg Service", "x": 260, "y": 160, "kind": "service"},
   {"id": "bill", "label": "Bill Service", "x": 420, "y": 160, "kind": "service"},
   {"id": "feed", "label": "Feed Service", "x": 580, "y": 160, "kind": "service"},
   {"id": "authdb", "label": "Auth DB", "x": 100, "y": 300, "kind": "database"},
   {"id": "msgdb", "label": "Msg DB", "x": 260, "y": 300, "kind": "database"},
   {"id": "billdb", "label": "Bill DB", "x": 420, "y": 300, "kind": "database"},
   {"id": "feeddb", "label": "Feed DB", "x": 580, "y": 300, "kind": "database"}
 ],
 "edges": [
   {"from": "gw", "to": "auth", "label": "routes"},
   {"from": "gw", "to": "msg", "label": "routes"},
   {"from": "gw", "to": "bill", "label": "routes"},
   {"from": "gw", "to": "feed", "label": "routes"},
   {"from": "auth", "to": "authdb", "label": "owns"},
   {"from": "msg", "to": "msgdb", "label": "owns"},
   {"from": "bill", "to": "billdb", "label": "owns"},
   {"from": "feed", "to": "feeddb", "label": "owns"}
 ],
 "annotations": {
   "gw": "Single entry point that routes requests to the correct downstream service",
   "msg": "Can be scaled to 100 instances independently — billing stays at 5"
 }}
\`\`\`

\`\`\`tabs
{"tabs": [
  {"label": "Advantages", "icon": "✅", "content": "- **Independent scaling** — Scale the messaging service to 100 instances while billing stays at 5\\n- **Independent deployment** — Ship messaging fixes without touching billing or redeploying the entire system\\n- **Technology freedom** — Messaging in Go, ML pipeline in Python, billing in Java\\n- **Team autonomy** — Small teams own small services end-to-end with clear domain boundaries\\n- **Fault isolation** — A failure in the feed service does not crash authentication or billing"},
  {"label": "Disadvantages", "icon": "⚠️", "content": "- **Distributed complexity** — Network failures, partial failures, and data inconsistency become everyday problems\\n- **Operational overhead** — Dozens of services each need their own deploy pipeline, monitoring, and alerting\\n- **Data consistency** — No cross-service ACID transactions; must use sagas or accept eventual consistency\\n- **Latency** — Network calls (1–10 ms) replace in-process calls (< 1 μs)\\n- **Development sprawl** — If not managed carefully, inter-service dependencies grow into a *distributed monolith*"}
]}
\`\`\`

\`\`\`callout
{"type": "warning", "title": "The Distributed Monolith Anti-Pattern", "content": "If every microservice calls every other service synchronously at request time, you have not eliminated coupling — you have moved it to the network. This is called a *distributed monolith*: you bear all the operational complexity of microservices while retaining all the coupling of a monolith. It is the worst of both worlds. Microservices only work when services have clear, minimal dependencies on each other."}
\`\`\`

## When to Choose What

| Factor | Monolith | Microservices |
|--------|----------|---------------|
| Team size | < 10 engineers | > 20 engineers |
| Scale needs | Uniform across features | Highly variable per feature |
| Deployment frequency | Weekly releases | Multiple deploys per day |
| Domain complexity | Low–medium | High (many bounded contexts) |
| Operational maturity | Early-stage | Established DevOps culture |

\`\`\`quiz
{"title": "Architecture Trade-offs", "questions": [
  {"question": "Which architecture allows you to scale only the messaging component during a traffic spike?", "options": ["Monolith only", "Microservices only", "Both architectures equally", "Neither — you must always scale everything"], "answer": 1, "explanation": "Microservices allow independent scaling of individual services. In a monolith, you must replicate the entire application even if only one component is under load — making it resource-intensive and costly."},
  {"question": "What is the primary data-consistency advantage of a monolith over microservices?", "options": ["Faster read queries", "ACID transactions across all modules", "Easier database migrations", "Better cache hit rates"], "answer": 1, "explanation": "Because all modules share a single database, a monolith can perform ACID transactions that span multiple domain entities (e.g., deducting inventory and recording a payment atomically). Microservices must use saga patterns or accept eventual consistency instead."},
  {"question": "A startup with 6 engineers is building a new SaaS product with unclear scaling needs. Which approach is most appropriate?", "options": ["Microservices from day one to avoid future migration", "A modular monolith that enforces boundaries but deploys as one unit", "A distributed monolith so each team has autonomy", "Serverless functions for every feature"], "answer": 1, "explanation": "A modular monolith gives you module isolation and clear boundaries without the operational overhead of distributed systems. You can extract services later when you have concrete evidence of scaling needs — the 'monolith-first' approach advocated by Martin Fowler."},
  {"question": "Which of the following is a symptom of the 'distributed monolith' anti-pattern?", "options": ["Each service has its own database", "Services communicate only through async events", "Every service must be deployed together for any change to work", "Services are written in different programming languages"], "answer": 2, "explanation": "If every service must be deployed together because they share too many synchronous dependencies, you have a distributed monolith — all the complexity of microservices with none of the independence benefits."}
]}
\`\`\`

## The Practical Path: Monolith First

Most successful systems start as a monolith and extract microservices as scaling demands emerge. Companies like Shopify and Basecamp run primarily on well-structured monoliths at significant scale. Netflix and Amazon evolved from monoliths to microservices over years, not all at once.

\`\`\`concept
{"title": "Key Insight", "variant": "insight", "content": "Microservices are not a goal — they are a tool for managing complexity at scale. If your system does not need to scale independently, a well-structured monolith is simpler, cheaper, and faster to iterate on. The right time to extract a service is when you have *concrete evidence* — a team ownership problem, a measured scaling bottleneck, or a technology mismatch — not because microservices are fashionable."}
\`\`\`

## The Modular Monolith: A Pragmatic Middle Ground

A modular monolith keeps a single deployment unit but enforces strict module boundaries — each module has its own internal database schema and can only communicate with other modules through defined interfaces, never by querying another module's tables directly.

\`\`\`compare
{"variant": "before-after",
 "before": {"label": "Traditional Monolith (tightly coupled)", "code": "// Auth module directly queries billing tables\\nclass AuthService {\\n  login(email, password) {\\n    const user = db.query('SELECT * FROM users WHERE ...');\\n    // Reaches directly into billing schema\\n    const plan = db.query('SELECT * FROM billing.subscriptions ...');\\n    return { user, plan };\\n  }\\n}"},
 "after": {"label": "Modular Monolith (bounded modules)", "code": "// Auth module only knows its own schema\\nmodule AuthModule {\\n  private db: AuthDatabase; // Only auth tables\\n\\n  login(email, password) {\\n    const user = this.db.findUser(email, password);\\n    return user; // Billing is someone else's concern\\n  }\\n}\\n\\n// Billing exposes a public interface only\\nmodule BillingModule {\\n  private db: BillingDatabase;\\n\\n  getPlan(userId: string): Plan { ... }\\n}"}}
\`\`\`

This gives you module isolation and team ownership without distributed systems complexity. When a specific module demonstrably needs independent scaling or a different technology, you extract it as a service — with clean boundaries already in place.

\`\`\`steps
{"title": "The Evolution Path", "steps": [
  {"title": "Start: Monolith", "content": "Build fast with a single codebase. Deploy frequently. Understand your domain well before drawing service boundaries. Team size: 1–8 engineers."},
  {"title": "Grow: Modular Monolith", "content": "Introduce strict module boundaries as the team grows past ~8 engineers. Separate schemas per module. Use internal interfaces, never cross-module direct queries. Team size: 8–20 engineers."},
  {"title": "Scale: Selective Extraction", "content": "Extract the first service only when you have concrete evidence: a measured scaling bottleneck, a team ownership conflict, or a technology requirement. Extract with clean APIs already tested internally. Team size: 20+ engineers."},
  {"title": "Mature: Full Microservices", "content": "Each extracted service has its own CI/CD pipeline, monitoring, and on-call rotation. Services communicate via async events wherever possible to minimize coupling. Strong DevOps culture required."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "A monolith is a single deployable unit with a shared database — simpler to build, harder to scale independently",
  "Microservices give each service its own codebase and database — enabling independent scaling and deployment at the cost of distributed systems complexity",
  "The modular monolith is a pragmatic middle ground: single deployment, strict module boundaries, separate schemas",
  "Start monolith-first unless you have clear, concrete evidence that microservices are necessary from day one",
  "The distributed monolith anti-pattern — tight coupling across networked services — is the worst outcome of both worlds",
  "Extract services gradually based on evidence: scaling bottlenecks, team ownership problems, or technology mismatches"
]}
\`\`\``,
    },
    {
      id: "event-driven-architecture",
      slug: "event-driven-architecture",
      title: "Event-Driven Architecture",
      content: `## Beyond Request-Response

Traditional service-to-service communication is **synchronous**: Service A calls Service B, blocks, and waits for a reply. A must know B's address. B must be available. If B is slow, A is slow. If B is down, A fails.

Event-driven architecture (EDA) breaks this chain. A service publishes an **event** — a record of something that happened — and returns immediately. Whatever needs to react does so independently.

\`\`\`concept
{ "title": "The Mental Model Shift", "variant": "mental-model", "content": "Think of EDA like a newspaper. The publisher prints articles without knowing who reads them. Subscribers choose which sections to follow without the publisher's knowledge. Each operates on its own schedule. This natural separation is the core promise of EDA: producers and consumers evolve independently." }
\`\`\`

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Request-Response — Tightly Coupled", "code": "# Service A must know B's address and wait for it\\nresponse = requests.post(\\"http://service-b/api/order\\", json=order_data)\\nif response.status_code != 200:\\n    # What if B is overloaded, deploying, or down?\\n    raise Exception(\\"Service B unavailable\\")\\n# A is blocked the entire time B is processing" }, "after": { "label": "Event-Driven — Loosely Coupled", "code": "# Service A publishes a fact and moves on immediately\\nevent_bus.publish(\\"OrderPlaced\\", {\\n    \\"orderId\\": \\"12345\\",\\n    \\"customerId\\": \\"67890\\",\\n    \\"amount\\": 99.99\\n})\\n# A has no knowledge of email, inventory, or analytics services\\n# All three can react in parallel, at their own pace" } }
\`\`\`

Research across 267 real-world microservice architectures found that well-established event-driven ecosystems averaged 42.7 distinct event types per system, with each service consuming 4.8 event types — achieving a **76.9% reduction in direct API dependencies** compared to request-response models.

---

## Core Concepts

### Events vs Commands

| Concept | Example | Key Property |
|---------|---------|-------------|
| **Event** | \`OrderPlaced\`, \`PaymentReceived\` | A fact — already happened, immutable |
| **Command** | \`PlaceOrder\`, \`ProcessPayment\` | A request — can succeed or fail |

Events describe the past. You cannot reject them — they have already occurred. Commands describe intent and carry the possibility of failure. This distinction drives how you name topics, design consumers, and handle errors.

\`\`\`quiz
{ "title": "Events vs Commands — Check Your Understanding", "questions": [ { "question": "Which of these is an event?", "options": ["PlaceOrder", "ProcessPayment", "OrderPlaced", "ChargeCard"], "answer": 2, "explanation": "\\"OrderPlaced\\" is an event — past tense, describing a fact. The others are commands: they express an intent that may or may not succeed." }, { "question": "Why can't events be rejected by a consumer?", "options": ["They are immutable facts about the past", "They are encrypted end-to-end", "They are too large to validate", "They are delivered asynchronously"], "answer": 0, "explanation": "An event records something that already happened. A consumer can choose not to act on it, but it cannot retroactively un-happen the thing the event describes. This immutability is fundamental to event sourcing and audit trails." }, { "question": "In EDA, what happens when no service is subscribed to an event?", "options": ["The producer fails with an error", "The event broker blocks delivery", "The event is published regardless", "The system enforces at least one subscriber"], "answer": 2, "explanation": "Producers in EDA have no knowledge of consumers — events are published regardless of who (if anyone) is listening. This is what makes the coupling truly loose: removing a consumer does not require changing the producer." }, { "question": "A team wants to trigger a refund when a return is initiated. Which design is more idiomatic EDA?", "options": ["Returns service calls Billing service POST /refund directly", "Returns service emits ReturnInitiated; Billing service reacts", "Returns service polls a shared database for new returns", "Billing service calls Returns service to check for new events"], "answer": 1, "explanation": "Publishing ReturnInitiated lets Billing, Inventory, Notifications, and any future service react independently. Direct calls or polling reintroduce coupling." } ] }
\`\`\`

### Event Producers and Consumers

The message broker sits between producers and consumers, decoupling them in time, space, and failure domain.

\`\`\`sysdiag
{ "title": "Event Flow Architecture", "width": 640, "height": 340, "nodes": [ { "id": "producer", "label": "Order Service", "x": 90, "y": 170, "kind": "service" }, { "id": "broker", "label": "Message Broker\\n(Kafka / RabbitMQ)", "x": 300, "y": 170, "kind": "storage" }, { "id": "email", "label": "Email Service", "x": 530, "y": 70, "kind": "service" }, { "id": "analytics", "label": "Analytics Service", "x": 530, "y": 170, "kind": "service" }, { "id": "inventory", "label": "Inventory Service", "x": 530, "y": 270, "kind": "service" } ], "edges": [ { "from": "producer", "to": "broker", "label": "publishes OrderPlaced" }, { "from": "broker", "to": "email", "label": "delivers" }, { "from": "broker", "to": "analytics", "label": "delivers" }, { "from": "broker", "to": "inventory", "label": "delivers" } ], "annotations": { "producer": "Emits events with no knowledge of downstream consumers", "broker": "Durably stores events; retries failed deliveries; decouples producer uptime from consumer uptime", "email": "Subscribes to OrderPlaced; sends confirmation email", "analytics": "Subscribes to all order events; updates real-time dashboard", "inventory": "Subscribes to OrderPlaced; reserves stock" } }
\`\`\`

---

## Message Brokers

### Apache Kafka

Kafka is the dominant event streaming platform for high-throughput systems. Topics are split into **partitions**, and each partition is an ordered, immutable log of messages.

\`\`\`algoviz
{ "title": "Kafka Topic: How Partitioning Enables Parallelism", "type": "array", "data": ["msg1", "msg2", "msg3", "msg4", "msg5", "msg6", "msg7", "msg8", "msg9"], "frames": [ { "highlight": [0, 3, 6], "label": "Partition 0 receives msg1, msg4, msg7 — routed by key hash", "stats": { "partition": 0, "consumer": "Consumer-A" } }, { "highlight": [1, 4, 7], "label": "Partition 1 receives msg2, msg5, msg8 — different consumer reads in parallel", "stats": { "partition": 1, "consumer": "Consumer-B" } }, { "highlight": [2, 5, 8], "label": "Partition 2 receives msg3, msg6, msg9 — ordering guaranteed within partition only", "stats": { "partition": 2, "consumer": "Consumer-C" } } ], "speed": 1000 }
\`\`\`

Key Kafka properties:
- **Throughput**: Millions of messages per second per cluster
- **Retention**: Messages persist on disk — days to indefinitely
- **Ordering**: Guaranteed within a partition, not across them
- **Consumer groups**: Multiple independent consumers can each process the full log

### RabbitMQ

RabbitMQ is better suited for task queues and complex routing logic:
- **Lower throughput** (~50K msg/s per node) but richer routing primitives
- **Acknowledgment model**: Messages are removed from the queue after successful processing
- **Flexible exchange types**: fanout, topic, headers-based routing

\`\`\`tabs
{ "tabs": [ { "label": "Kafka", "icon": "⚡", "content": "**Best for:**\\n- High-throughput event streaming and log aggregation\\n- Event sourcing with long or permanent retention\\n- Real-time analytics pipelines\\n- Cases where multiple independent consumer groups need the full event stream\\n\\n**Production scale:** One leading e-commerce platform processes **8.7 million events per minute** through 128 producers and 213 consumer services during peak periods." }, { "label": "RabbitMQ", "icon": "🐇", "content": "**Best for:**\\n- Task queues with worker pools (e.g., image resizing, email sending)\\n- Complex message routing (send to different queues based on headers or routing keys)\\n- Request-reply patterns where a response is expected\\n- Guaranteed single delivery semantics\\n\\n**Tradeoff:** After a consumer acknowledges a message, it is gone. There is no replay. This makes RabbitMQ unsuitable for event sourcing." }, { "label": "Choosing Between Them", "icon": "⚖️", "content": "| Dimension | Kafka | RabbitMQ |\\n|-----------|-------|----------|\\n| Throughput | Millions/sec | ~50K/sec/node |\\n| Message retention | Persistent log | Deleted on ACK |\\n| Replay | Yes — seek to offset | No |\\n| Routing | By partition key | Exchange types |\\n| Consumer model | Pull (offset-based) | Push (ack-based) |\\n\\n**Rule of thumb:** If you need replay, audit trail, or multiple independent consumers reading the same events — Kafka. If you need task delegation with acknowledgment and flexible routing — RabbitMQ." } ] }
\`\`\`

---

## Event Sourcing

Instead of storing the **current state**, store the **sequence of events** that produced it. Current state is always derivable by replaying the event log.

\`\`\`trace
{ "title": "Reconstructing State from an Event Log", "language": "python", "code": "class Account:\\n    def __init__(self):\\n        self.balance = 0\\n        self.events = []\\n\\n    def deposit(self, amount):\\n        self.events.append(f\\"Deposited({amount})\\")\\n        self.balance += amount\\n\\n    def withdraw(self, amount):\\n        if self.balance >= amount:\\n            self.events.append(f\\"Withdrawn({amount})\\")\\n            self.balance -= amount\\n\\n    def get_state(self):\\n        return f\\"Balance: {self.balance}, Events: {self.events}\\"\\n\\naccount = Account()\\naccount.deposit(1000)\\naccount.withdraw(400)\\naccount.deposit(200)\\nprint(account.get_state())", "frames": [ { "line": 2, "vars": { "balance": 0, "events": "[]" }, "note": "Initial state — balance is zero, event log is empty" }, { "line": 19, "vars": { "balance": 0, "events": "[]" }, "note": "account.deposit(1000) called — appending event and updating balance" }, { "line": 7, "vars": { "balance": 1000, "events": "[\\"Deposited(1000)\\"]" }, "note": "Deposit recorded. Balance updated by replaying the event." }, { "line": 20, "vars": { "balance": 1000, "events": "[\\"Deposited(1000)\\"]" }, "note": "account.withdraw(400) called" }, { "line": 12, "vars": { "balance": 600, "events": "[\\"Deposited(1000)\\", \\"Withdrawn(400)\\"]" }, "note": "Withdrawal recorded. Full history preserved." }, { "line": 21, "vars": { "balance": 600, "events": "[\\"Deposited(1000)\\", \\"Withdrawn(400)\\"]" }, "note": "account.deposit(200) called" }, { "line": 7, "vars": { "balance": 800, "events": "[\\"Deposited(1000)\\", \\"Withdrawn(400)\\", \\"Deposited(200)\\"]" }, "note": "Final state. Replay all three events to reconstruct an $800 balance from scratch." } ], "speed": 1200 }
\`\`\`

**Benefits:**
- **Complete audit trail** — Every state change is recorded with full context
- **Temporal queries** — "What was the account balance on March 1st?" is trivially answerable
- **Debugging** — Reproduce any past state by replaying the event log
- **Read model recovery** — Rebuild or reproject read-side views without touching source data

**Challenges:**
- **Storage growth** — Events accumulate forever; use periodic **snapshots** to bound replay cost
- **Eventual consistency** — Read models are built asynchronously and may lag writes
- **Schema evolution** — Events from two years ago must still be readable; versioning is essential

\`\`\`callout
{ "type": "warning", "title": "Event Sourcing is Not Always the Right Default", "content": "Event sourcing adds significant complexity: snapshot management, schema versioning, projector replay logic. Reserve it for domains where audit trails or temporal queries are a hard requirement — financial ledgers, order management, compliance-sensitive records. A standard CRUD database is correct for most services." }
\`\`\`

---

## CQRS — Command Query Responsibility Segregation

CQRS separates the **write model** (commands that mutate state) from the **read model** (queries that serve data). Events bridge the two: a command produces an event, which is projected into the read model.

\`\`\`concept
{ "title": "CQRS: Optimise Each Side Independently", "variant": "insight", "content": "Think of CQRS like a warehouse with two entrances. Delivery trucks use the loading dock — a write path optimised for throughput and consistency. Customers use the storefront — a read path optimised for fast, friendly browsing. Neither entrance is aware of the other's workflow. CQRS applies the same separation to software: the write side uses event sourcing or a normalised schema; the read side uses denormalised views in Redis, Elasticsearch, or a materialised table tuned purely for query speed." }
\`\`\`

This matters at scale because reads vastly outnumber writes in most systems. By separating them, you can:
- Scale read replicas independently of the write cluster
- Use different storage engines optimised for each workload
- Evolve the query API without touching the write path

---

## When to Use (and Avoid) EDA

**Reach for EDA when:**
- Multiple services need to react to the same business event (fan-out)
- You want producers and consumers to deploy and scale independently
- Processing can be asynchronous — users don't need an instant response
- You need a durable audit trail of every state change

**Prefer direct calls when:**
- You need an immediate, synchronous response (e.g., reading a user's profile to render a page)
- Your system is small enough that the broker adds overhead without benefit
- Eventual consistency is not acceptable for the use case

\`\`\`callout
{ "type": "info", "title": "EDA Does Not Eliminate Synchronous Calls", "content": "Most production systems use both patterns. A checkout flow might publish OrderPlaced asynchronously to trigger email, inventory, and analytics — but synchronously call a payment gateway because the user is waiting for confirmation. Choose per interaction, not per system." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "EDA replaces tight synchronous coupling with loose asynchronous communication: producers publish events; consumers react independently", "Events are immutable facts about the past; commands are requests that can fail — this distinction shapes naming, error handling, and consumer design", "Kafka suits high-throughput streaming and replay; RabbitMQ suits task queues and complex routing — match the broker to the workload", "Event sourcing stores the full event log instead of current state, enabling audit trails and temporal queries at the cost of storage growth and schema discipline", "CQRS separates write and read models, allowing each to be optimised and scaled independently using events as the bridge", "EDA introduces eventual consistency — design systems to tolerate and communicate lag, rather than assuming synchronous consistency" ] }
\`\`\``,
    },
    {
      id: "ddd-basics",
      slug: "ddd-basics",
      title: "DDD Basics",
      content: `# Domain-Driven Design Basics

## Why DDD Matters for System Design

Domain-Driven Design (DDD) provides a framework for decomposing complex systems into well-defined boundaries. In system design interviews, DDD helps you decide **where to draw service boundaries** — the single most important architectural decision you'll make.

\`\`\`concept
{ "title": "DDD Philosophy", "variant": "mental-model", "content": "DDD is a software development philosophy that prioritizes understanding and modeling the core business domain to align software more closely with business needs. Introduced by Eric Evans in 2003, it navigates complexity by focusing development on the specific business context in which the software operates. Its three foundational principles are: domain-centric modeling (software mirrors real business operations), ubiquitous language (shared vocabulary between developers and domain experts), and bounded contexts (independent areas where specific domain models apply consistently)." }
\`\`\`

---

## Core Concepts

### Ubiquitous Language

Every team — engineers, product, business — uses the same terms for the same concepts. If the business calls it an "Order," the code calls it an \`Order\`. Not \`PurchaseRequest\`, not \`Transaction\`, not \`Item\`.

This sounds trivial but prevents an entire class of bugs caused by translation errors between business logic and code.

\`\`\`callout
{ "type": "warning", "title": "Translation Bugs Are Expensive", "content": "When engineers use different terms than the business, subtle misunderstandings compound. A 'Transaction' might be a financial record to engineers but a completed sale to the business. These mismatches cause real production bugs that are nearly invisible in testing — they only surface when a developer's mental model diverges from a product manager's assumption." }
\`\`\`

### Bounded Contexts

A bounded context is a boundary within which a particular domain model is defined and applicable. Crucially, **the same word can mean completely different things in different contexts**.

\`\`\`mermaid
graph TD
    A[E-Commerce Context] -->|"Order = items + prices + discounts"| B[Order Entity]
    C[Shipping Context] -->|"Order = address + weight + tracking #"| D[Order Entity]

    style A fill:#e1f5fe
    style C fill:#fff3e0
\`\`\`

**Key insight**: Each bounded context maps naturally to a microservice. This is why DDD and microservices are so frequently discussed together — bounded contexts provide the *principled* answer to "how small should a service be?"

\`\`\`tabs
{ "tabs": [
  { "label": "E-Commerce Context", "icon": "🛒", "content": "**Order** = customer, cart items, applied discounts, promo codes, subtotal.\\n\\nCares about: What was bought? At what price? With what promotions?\\n\\nCore entities: \`Order\`, \`OrderItem\`, \`Discount\`, \`Cart\`" },
  { "label": "Payment Context", "icon": "💳", "content": "**Order** = amount, currency, payment method, authorization code, charge status.\\n\\nCares about: How much? In what currency? Did the charge succeed?\\n\\nCore entities: \`Payment\`, \`Refund\`, \`ChargeAttempt\`" },
  { "label": "Shipping Context", "icon": "📦", "content": "**Order** = delivery address, package weight, carrier, tracking number, ETA.\\n\\nCares about: Where does it go? Who delivers it? When does it arrive?\\n\\nCore entities: \`Shipment\`, \`Package\`, \`Carrier\`, \`TrackingEvent\`" },
  { "label": "Identity Context", "icon": "👤", "content": "**Order** is irrelevant here. This context only cares about authentication, authorization, and user profiles.\\n\\nCore entities: \`User\`, \`Session\`, \`Role\`, \`Permission\`" }
] }
\`\`\`

### Aggregates

An aggregate is a cluster of domain objects treated as a single unit for data changes. Every aggregate has a **root entity** that controls all access to the cluster.

\`\`\`sysdiag
{ "title": "Order Aggregate Structure", "width": 620, "height": 320,
  "nodes": [
    { "id": "order", "label": "Order\\n(Root Entity)", "x": 310, "y": 160, "kind": "service" },
    { "id": "item1", "label": "OrderItem", "x": 140, "y": 80, "kind": "storage" },
    { "id": "item2", "label": "OrderItem", "x": 140, "y": 240, "kind": "storage" },
    { "id": "address", "label": "ShippingAddress", "x": 480, "y": 160, "kind": "storage" },
    { "id": "external", "label": "External Object\\n(e.g., Payment)", "x": 310, "y": 20, "kind": "client" }
  ],
  "edges": [
    { "from": "order", "to": "item1", "label": "contains" },
    { "from": "order", "to": "item2", "label": "contains" },
    { "from": "order", "to": "address", "label": "has" },
    { "from": "external", "to": "order", "label": "refs root only" }
  ],
  "annotations": {
    "order": "The aggregate root. All external references point here. Changes to OrderItems must go through Order — never directly.",
    "item1": "Internal to the aggregate. No outside object holds a direct reference to an OrderItem.",
    "external": "External contexts reference only the Order ID, never internal entities."
  }
}
\`\`\`

Three invariants hold for every aggregate:
- External objects reference **only the root** (the \`Order\`, never its \`OrderItem\`)
- All state changes go **through the root**
- The aggregate is the **unit of consistency** — one transaction, one aggregate

### Domain Events

When something important happens inside a bounded context, it publishes a **domain event**. Other contexts subscribe and react without the publisher knowing who's listening.

\`\`\`mermaid
sequenceDiagram
    participant E as E-Commerce Context
    participant M as Message Bus
    participant P as Payment Context
    participant S as Shipping Context

    E->>E: order.place()
    E->>M: Publish OrderPlaced {orderId, total, userId}
    M->>P: Deliver OrderPlaced
    P->>P: Initiate charge
    P->>M: Publish PaymentProcessed {orderId, status}
    M->>E: Deliver PaymentProcessed
    E->>M: Publish OrderConfirmed {orderId}
    M->>S: Deliver OrderConfirmed
    S->>S: Create Shipment
\`\`\`

This is how bounded contexts communicate **without tight coupling** — events flow at boundaries, each context reacts independently.

---

## Applying DDD to System Design

### Step 1: Identify Bounded Contexts

For an e-commerce system, map business responsibilities to contexts:

| Context | Responsibility | Core Entities |
|---------|----------------|---------------|
| Catalog | Product info, search, inventory | Product, Category, SKU |
| Ordering | Cart, checkout, order lifecycle | Order, Cart, OrderItem |
| Payment | Charge processing, refunds | Payment, Refund |
| Shipping | Fulfillment, tracking | Shipment, Carrier |
| Identity | Auth, profiles | User, Session |

### Step 2: Define Context Relationships

\`\`\`mermaid
graph LR
    O[Ordering] -->|OrderPlaced| P[Payment]
    P -->|PaymentProcessed| O
    O -->|OrderConfirmed| S[Shipping]
    S -->|ShipmentDelivered| O

    style O fill:#e3f2fd
    style P fill:#f3e5f5
    style S fill:#e8f5e9
\`\`\`

Contexts interact through well-defined **relationship patterns**:

| Pattern | Description |
|---------|-------------|
| **Conformist** | Downstream adopts upstream's model as-is |
| **Customer-Supplier** | Upstream serves downstream's explicit needs |
| **Shared Kernel** | Two contexts share a small common model |
| **Anti-Corruption Layer** | Translate between incompatible models |

### Step 3: Design Anti-Corruption Layers

When integrating with external systems (payment gateways, shipping APIs), an **anti-corruption layer** (ACL) insulates your domain model from leaking third-party concepts.

\`\`\`compare
{ "variant": "before-after",
  "before": {
    "label": "Direct Integration — Domain Leaks",
    "code": "class PaymentService {\\n  async processPayment(order) {\\n    // Your domain is now contaminated\\n    // by Stripe's terminology\\n    const paymentIntent = await stripe.createPaymentIntent({\\n      amount: order.total_cents,\\n      currency: order.currency_code,\\n      customer: order.buyer_id\\n    });\\n    return paymentIntent.status; // Stripe status bleeds into your domain\\n  }\\n}"
  },
  "after": {
    "label": "With Anti-Corruption Layer — Domain Stays Pure",
    "code": "// Your domain service uses only domain concepts\\nclass PaymentService {\\n  constructor(private gateway: PaymentGateway) {}\\n\\n  async processPayment(order: Order): Promise<PaymentResult> {\\n    const payment = Payment.fromOrder(order);\\n    return this.gateway.process(payment); // clean domain interface\\n  }\\n}\\n\\n// ACL lives at the infrastructure layer\\nclass StripePaymentGateway implements PaymentGateway {\\n  async process(payment: Payment): Promise<PaymentResult> {\\n    const intent = await stripe.createPaymentIntent({\\n      amount: payment.amountInCents,\\n      currency: payment.currency,\\n      metadata: { orderId: payment.orderId }\\n    });\\n    return this.translateResult(intent); // translate OUT of Stripe's model\\n  }\\n}"
  }
}
\`\`\`

---

## Common Pitfalls

\`\`\`steps
{ "title": "DDD Mistakes to Avoid", "steps": [
  { "title": "Aggregates Too Large", "content": "Keep aggregates as small as possible while maintaining consistency. Including unrelated entities in one aggregate leads to lock contention, bloated transactions, and difficulty scaling. Ask: 'Does this entity truly need to change atomically with the root?' If not, it belongs outside." },
  { "title": "Sharing Databases Between Contexts", "content": "Each bounded context must **own its data**. Sharing a database schema creates invisible coupling — when the Shipping team changes the \`orders\` table, the Payment team breaks. Communicate through integration events, not shared tables." },
  { "title": "Ignoring Ubiquitous Language", "content": "Inconsistent naming between business and code causes real bugs. If the business calls it a 'Reservation' but the code says 'Booking', confusion compounds over months. Run your code variable names by domain experts — they'll catch mismatches immediately." },
  { "title": "Premature Decomposition", "content": "Don't start with dozens of tiny contexts. Begin with 3-5 larger, well-understood contexts and **split as domain knowledge grows**. Evans himself recommends evolving context boundaries — they should reflect your current understanding, not a speculative future." }
] }
\`\`\`

---

## Check Your Understanding

\`\`\`quiz
{ "title": "DDD Core Concepts", "questions": [
  {
    "question": "In an e-commerce system, what does 'Order' represent in the Payment bounded context?",
    "options": ["Items, quantities, and applied discounts", "Financial transaction details: amount, currency, payment status", "Delivery address, package weight, and carrier", "Customer profile and purchase history"],
    "answer": 1,
    "explanation": "In the Payment context, 'Order' is only about the financial transaction — amount, currency, payment method, and charge status. The items and discounts live in the Ordering context; the address lives in Shipping. Each context owns the slice of 'Order' it cares about."
  },
  {
    "question": "What is the primary rule governing access to an aggregate?",
    "options": ["Any external object can reference any entity inside the aggregate", "External objects may only reference the aggregate root", "Aggregates share their entities freely across bounded contexts", "The root entity must be a value object, not an entity"],
    "answer": 1,
    "explanation": "External objects must hold a reference only to the aggregate root (e.g., Order ID). All mutations go through the root, which enforces invariants. Direct references to internal entities (like OrderItem) would bypass the root's consistency rules."
  },
  {
    "question": "What purpose does an Anti-Corruption Layer serve?",
    "options": ["It prevents security vulnerabilities in the API layer", "It translates between an external system's model and your domain model", "It logs and audits all domain events", "It enforces referential integrity across bounded contexts"],
    "answer": 1,
    "explanation": "An ACL sits at the boundary between your domain and an external system (like Stripe or FedEx). It translates their terminology and data shapes into your domain's concepts, preventing the external model from contaminating your core domain logic."
  },
  {
    "question": "Why should bounded contexts NOT share a database?",
    "options": ["Databases are too slow for multiple contexts", "Shared schemas create invisible coupling that prevents independent evolution", "Regulatory requirements mandate separate databases", "Bounded contexts must use NoSQL, not relational databases"],
    "answer": 1,
    "explanation": "When two contexts share a table, a schema change in one context can silently break the other. The coupling is invisible at the service layer but brutally visible at the data layer. Event-driven integration between contexts avoids this by making the contract explicit and versioned."
  },
  {
    "question": "What is the recommended approach when you're uncertain about the right bounded context boundaries?",
    "options": ["Start with the maximum number of small contexts and merge later", "Start with fewer, larger contexts and split as domain understanding grows", "Always mirror the org chart — one context per team", "Define all boundaries upfront with a formal domain model"],
    "answer": 1,
    "explanation": "Evans recommends starting with larger, well-understood contexts and refining over time. Premature decomposition is costly — merging two mistakenly-split contexts is far harder than splitting one large context once you understand the domain better."
  }
] }
\`\`\`

---

## DDD in System Design Interviews

When you walk into a system design interview, identifying bounded contexts early is a signal of architectural maturity. It transforms "I need a bunch of microservices" into a principled answer grounded in the business domain.

\`\`\`callout
{ "type": "tip", "title": "Interview Strategy: Domain First", "content": "Open with clarifying questions about the business domain, not the tech stack. Ask: 'What are the main areas of responsibility in this system?' Map the answers to bounded contexts. Then derive service boundaries from those contexts. This approach demonstrates you understand both the technical and business dimensions of architecture — exactly what senior interviewers want to see." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "DDD's three pillars — ubiquitous language, bounded contexts, and domain-centric modeling — give you a principled basis for every service boundary decision.",
  "The same term (like 'Order') can and should mean different things in different bounded contexts; each context owns its own slice of the model.",
  "Aggregates enforce consistency within a boundary: external objects reference only the root, and all changes flow through it.",
  "Domain events decouple bounded contexts — a publisher emits events without knowing who subscribes, enabling independent evolution.",
  "Anti-corruption layers protect your domain model from external API terminology bleeding into your core business logic.",
  "In interviews, start by identifying bounded contexts — it naturally produces clean service boundaries and shows mature architectural thinking."
] }
\`\`\``,
    },
    {
      id: "api-gateway-service-mesh",
      slug: "api-gateway-service-mesh",
      title: "API Gateway & Service Mesh",
      content: `# API Gateway & Service Mesh

## The Problem

In a microservices architecture, clients need to communicate with dozens of services. Without infrastructure to manage this, every client must know the address of every service, handle authentication independently, implement retry logic and circuit breaking, and deal with different protocols (REST, gRPC, WebSocket).

As ByteByteGo notes, this complexity scales poorly: "concerns that were once handled inside the application — retries, authentication, rate limiting, encryption, and observability — become distributed concerns. And distributed concerns are harder to get right."

Two patterns solve this at different layers: **API Gateways** for external traffic, and **Service Meshes** for internal traffic.

\`\`\`concept
{ "title": "Traffic Direction Matters", "variant": "mental-model", "content": "Think of your system as a city:\\n\\n- **North-South traffic** = Highways bringing cars into the city (external clients → services)\\n- **East-West traffic** = Local roads connecting neighborhoods (service → service)\\n\\nAPI Gateways manage the highways. Service Meshes manage the local roads.\\n\\nThe confusion starts when teams treat these as interchangeable — that shortcut sets them up for misuse or unnecessary overhead." }
\`\`\`

---

## API Gateway

An API Gateway is a single entry point for all client requests. It sits between external clients and backend services, centralizing cross-cutting concerns so individual services don't have to implement them.

\`\`\`sysdiag
{ "title": "API Gateway Architecture", "width": 600, "height": 320, "nodes": [ { "id": "mobile", "label": "Mobile", "x": 80, "y": 60, "kind": "client" }, { "id": "web", "label": "Web", "x": 80, "y": 160, "kind": "client" }, { "id": "partner", "label": "Partner API", "x": 80, "y": 260, "kind": "client" }, { "id": "gateway", "label": "API Gateway", "x": 280, "y": 160, "kind": "gateway" }, { "id": "auth", "label": "Auth Svc", "x": 480, "y": 60, "kind": "service" }, { "id": "user", "label": "User Svc", "x": 480, "y": 160, "kind": "service" }, { "id": "order", "label": "Order Svc", "x": 480, "y": 260, "kind": "service" } ], "edges": [ { "from": "mobile", "to": "gateway", "label": "HTTPS" }, { "from": "web", "to": "gateway", "label": "HTTPS" }, { "from": "partner", "to": "gateway", "label": "HTTPS" }, { "from": "gateway", "to": "auth", "label": "route /auth" }, { "from": "gateway", "to": "user", "label": "route /users" }, { "from": "gateway", "to": "order", "label": "route /orders" } ], "annotations": { "gateway": "Centralized entry point handling routing, auth, rate limiting, and TLS termination for all external clients" } }
\`\`\`

### Core Responsibilities

| Function | Description |
|----------|-------------|
| **Routing** | Route requests to the correct backend service |
| **Authentication** | Validate JWT tokens, API keys, OAuth2 flows |
| **Rate Limiting** | Protect backends from traffic spikes (e.g., 1000 req/s per user) |
| **TLS Termination** | Handle HTTPS at the edge; backends speak plain HTTP internally |
| **Request Transformation** | Translate between client and service protocols |
| **Response Aggregation** | Combine responses from multiple services into one |
| **Caching** | Cache frequent read requests at the edge |

### Popular API Gateways

- **Kong** — Open-source, Lua-based, rich plugin ecosystem
- **AWS API Gateway** — Fully managed, deep Lambda integration
- **Envoy** — High-performance C++ proxy (also the sidecar used in service meshes)
- **NGINX** — Widely deployed reverse proxy with API gateway capabilities

### BFF Pattern (Backend for Frontend)

Instead of one gateway for all clients, create specialized gateways per client type. Each BFF is optimized for its consumer's constraints:

\`\`\`tabs
{ "tabs": [ { "label": "Mobile BFF", "icon": "📱", "content": "**Optimized for bandwidth-constrained mobile clients:**\\n- Compressed payloads (Protobuf / MsgPack)\\n- Pagination enabled by default\\n- Offline-first data models\\n- Network-aware retry strategies\\n- Minimal field sets to reduce data transfer" }, { "label": "Web BFF", "icon": "🌐", "content": "**Optimized for browser clients:**\\n- Rich JSON responses\\n- GraphQL endpoints for flexible, query-driven data fetching\\n- Server-sent events for real-time updates\\n- Larger payload sizes acceptable\\n- SEO-optimized response shaping" }, { "label": "Partner API", "icon": "🤝", "content": "**Optimized for third-party integrations:**\\n- Strict versioning (v1, v2, etc.) with long deprecation windows\\n- Comprehensive, stable documentation\\n- Webhook support for asynchronous update delivery\\n- Granular rate limiting per API key\\n- Detailed error codes and machine-readable troubleshooting" } ] }
\`\`\`

---

## Service Mesh

A service mesh handles **service-to-service** communication within the cluster. Rather than a central proxy, it deploys a lightweight **sidecar proxy** alongside every service instance. The application code sends requests normally — the sidecar intercepts and manages them transparently.

\`\`\`algoviz
{ "title": "Service Mesh Request Flow (Sidecar Pattern)", "type": "array", "data": ["Service A", "Sidecar A", "Sidecar B", "Service B"], "frames": [ { "highlight": [0], "label": "Service A calls Service B — no special client code required", "stats": { "step": 1 } }, { "highlight": [0, 1], "label": "Request intercepted by Sidecar A before leaving the pod", "stats": { "step": 2 } }, { "highlight": [1, 2], "label": "Sidecar A handles mTLS handshake, load balancing, and retry policy", "stats": { "step": 3 } }, { "highlight": [2, 3], "label": "Sidecar B receives request, validates mutual TLS certificate", "stats": { "step": 4 } }, { "highlight": [3], "label": "Service B processes request — all network concerns handled by mesh", "stats": { "step": 5 } } ], "speed": 1000 }
\`\`\`

### What the Sidecar Handles

- **mTLS** — Automatic mutual TLS encryption between every service pair, with certificate rotation
- **Load balancing** — Intelligent routing (least connections, weighted, locality-aware)
- **Circuit breaking** — Stop calling a failing service before it cascades
- **Retries with backoff** — Automatic retry with exponential backoff and jitter
- **Observability** — Distributed tracing, golden signal metrics, structured access logs
- **Traffic management** — Canary deployments, A/B testing, traffic mirroring, fault injection

### Popular Service Meshes

- **Istio** — Most feature-rich, uses Envoy sidecars; powerful but operationally complex
- **Linkerd** — Lightweight Rust-based proxy, significantly simpler than Istio
- **Consul Connect** — HashiCorp's mesh, integrates natively with Consul service discovery

\`\`\`callout
{ "type": "info", "title": "They Can Co-Exist", "content": "API Gateways and Service Meshes are not mutually exclusive — they operate at different layers. A production system might route external traffic through Kong or AWS API Gateway, while Istio manages all internal service communication. Each handles what it is designed for, and their concerns rarely overlap." }
\`\`\`

---

## Gateway vs Mesh: When to Use What

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Without Infrastructure", "code": "# Client must know everything\\nmobile_app:\\n  - hardcode 15 service URLs\\n  - implement OAuth2 flow per service\\n  - handle circuit breakers manually\\n  - manage retry logic in app code\\n  - parse differing response formats\\n\\n# Service-to-service chaos\\nuser_service:\\n  - manual service discovery lookup\\n  - no encryption between services\\n  - custom retry logic duplicated per service\\n  - no traffic shaping or canary support\\n  - limited, siloed observability" }, "after": { "label": "With Gateway + Mesh", "code": "# Client has one surface\\nmobile_app:\\n  - single API Gateway URL\\n  - gateway handles all auth flows\\n  - automatic resilience at edge\\n  - consistent response format\\n\\n# Services focus on business logic\\nuser_service:\\n  - automatic service discovery via mesh\\n  - mTLS encryption with zero app changes\\n  - sidecar handles retries and backoff\\n  - canary and A/B traffic shaping\\n  - full distributed observability stack" } }
\`\`\`

| Concern | API Gateway | Service Mesh |
|---------|------------|--------------|
| Traffic type | North-south (external) | East-west (internal) |
| Authentication | Client auth (JWT, API keys, OAuth2) | Service-to-service mTLS |
| Rate limiting | Per-client or per-API-key | Per-service or per-route |
| Protocol | REST / GraphQL to clients | gRPC / HTTP between services |
| Deployment | Central instance(s) | Sidecar proxy per pod |
| Operational cost | Low–medium | Medium–high (especially Istio) |

---

## Scale Considerations

At scale, the API Gateway itself becomes a bottleneck. Solutions:

- **Horizontal scaling** — Run multiple gateway instances behind a load balancer
- **Regional gateways** — Deploy gateways in each geographic region to reduce latency
- **Edge computing** — Push logic to CDN edge nodes (Cloudflare Workers, Lambda@Edge) for sub-10ms response times globally

\`\`\`collapse
{ "title": "Deep Dive: Why 'North-South vs East-West' Is an Oversimplification", "content": "The directional shortcut is a useful starting point but can mislead teams in practice.\\n\\n**Where it breaks down:**\\n\\n1. **API Gateways can handle internal traffic too.** Some organizations route service-to-service calls through a gateway for centralized policy enforcement — especially useful when services are owned by different teams with different trust levels.\\n\\n2. **Service Meshes can expose external endpoints.** Istio's Ingress Gateway (or Gateway API) lets the mesh handle external traffic as well, making the gateway vs mesh distinction blurry at the edge.\\n\\n3. **The real distinction is control plane architecture.** Gateways use a centralized control plane — one place to configure routing rules. Meshes distribute control to the data plane (sidecars) managed by a central control plane (e.g., Istio Pilot). This changes the operational and failure model significantly.\\n\\n**Practical guidance:** Start with an API Gateway for external traffic (low operational cost, immediate security value). Add a service mesh only when you have 10+ services and are seeing pain around observability, mTLS enforcement, or traffic management between services." }
\`\`\`

---

\`\`\`quiz
{ "title": "Gateway vs Mesh Knowledge Check", "questions": [ { "question": "Which component handles authentication for external API clients?", "options": ["Service Mesh", "API Gateway", "Both handle it equally", "Neither — services handle it directly"], "answer": 1, "explanation": "API Gateways handle external client authentication (OAuth2, API keys, JWT validation) at the edge. Service Meshes focus on service-to-service mTLS and don't interact with end-user credentials." }, { "question": "What type of traffic does a Service Mesh primarily manage?", "options": ["North-south traffic from external clients", "East-west traffic between internal services", "Both directions equally", "Only database traffic"], "answer": 1, "explanation": "Service Meshes handle east-west traffic — internal service-to-service communication. The sidecar pattern means every pod-to-pod call is intercepted, secured, and observed by the mesh." }, { "question": "In the BFF pattern, why does a Mobile BFF return different data than a Web BFF?", "options": ["Mobile clients use different authentication schemes", "Mobile optimizes for bandwidth with smaller payloads and compressed formats", "Web BFF responses are more secure", "Mobile clients cannot parse JSON"], "answer": 1, "explanation": "Mobile BFFs optimize for bandwidth-constrained, latency-sensitive environments using compressed payloads (Protobuf/MsgPack) and minimal field sets. Web BFFs can afford richer JSON responses since browser connections are typically on faster networks." }, { "question": "What is the key architectural difference between an API Gateway and a Service Mesh deployment?", "options": ["API Gateways are open-source; Service Meshes are commercial", "API Gateways are centralized instances; Service Meshes deploy a sidecar proxy per pod", "Service Meshes require Kubernetes; API Gateways do not", "API Gateways only support REST; Service Meshes support gRPC"], "answer": 1, "explanation": "API Gateways run as central instances (behind a load balancer at scale). Service Meshes deploy a sidecar proxy alongside every service instance, making the infrastructure layer pervasive but also increasing operational complexity." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "API Gateways manage north-south (external) traffic: routing, authentication, rate limiting, and TLS termination at the edge.", "Service Meshes manage east-west (internal) traffic via sidecar proxies: mTLS, retries, circuit breaking, and observability between services.", "The BFF pattern creates specialized gateways per client type — mobile, web, and partner each get a gateway optimized for their constraints.", "Both patterns can co-exist: a gateway handles external clients while a mesh secures internal service communication.", "At scale, the gateway becomes a bottleneck — horizontal scaling, regional gateways, and edge computing (Cloudflare Workers) are standard mitigations." ] }
\`\`\``,
    },
  ],
};
