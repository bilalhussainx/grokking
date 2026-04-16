import { Module } from "../types";

export const interviewMasteryAndPracticeModule: Module = {
  id: "interview-mastery-and-practice",
  title: "Interview Mastery & Final Practice",
  description: "Consolidate everything with structured interview practice, a trade-off cheat sheet, and mock designs for five unseen problems under real interview conditions.",
  lessons: [
    {
      id: "system-design-cheat-sheet",
      slug: "system-design-cheat-sheet",
      title: "The System Design Cheat Sheet",
      content: `# The System Design Cheat Sheet

\`\`\`concept
{
  "title": "What Interviewers Actually Evaluate",
  "body": "System design interviews are not trivia contests about which database to name. Interviewers evaluate: (1) structured thinking under ambiguity, (2) ability to scope requirements, (3) knowledge of trade-offs (not facts), (4) communication clarity. A candidate who says 'I'd use Kafka here because of X trade-off vs RabbitMQ' beats one who memorizes every Kafka config parameter."
}
\`\`\`

## The 45-Minute Interview Timeline

\`\`\`steps
{
  "steps": [
    { "title": "0-5 min: Requirements gathering", "description": "Ask clarifying questions. Functional requirements (what the system does), non-functional requirements (scale, latency, consistency, availability). Never start designing without this." },
    { "title": "5-10 min: Capacity estimation", "description": "Back-of-envelope: DAU, requests/second, storage needs, bandwidth. Use round numbers. Show you understand scale. Say the numbers out loud." },
    { "title": "10-20 min: High-level design", "description": "Draw the major components: clients, API layer, services, databases, caches, CDN. Get agreement on the approach before going deep." },
    { "title": "20-35 min: Deep dive", "description": "Pick 1-2 critical components. Go deep: data model, API contracts, specific algorithms, replication strategy. Let the interviewer guide which area interests them." },
    { "title": "35-45 min: Trade-offs + bottlenecks", "description": "Proactively identify what breaks first at scale. Discuss what you'd do differently with more time. Show awareness of your design's limitations." }
  ]
}
\`\`\`

## Latency Reference Numbers

\`\`\`concept
{
  "title": "Numbers Every Engineer Should Know (2024)",
  "body": "L1 cache: 1 ns | L2 cache: 4 ns | RAM: 100 ns | SSD random read: 150 μs | Network same-DC: 500 μs | SSD sequential read: 1 MB in 1 ms | Network cross-region: 30-150 ms | HDD seek: 10 ms. Rule of thumb: memory is 1,000× faster than SSD, SSD is 100× faster than HDD, same-DC network is 3× slower than SSD."
}
\`\`\`

## Storage Quick Reference

| Storage Type | Latency | Throughput | Use For |
|-------------|---------|-----------|---------|
| Redis (RAM) | <1 ms | 500K ops/s | Sessions, counters, rate limits, leaderboards |
| PostgreSQL (SSD) | 1-5 ms | 10K TPS | Transactional data, ACID requirements |
| Cassandra | 2-10 ms | 100K ops/s | Time-series, wide rows, no joins needed |
| S3 / GCS | 50-200 ms | Unlimited | Blobs, backups, static assets |
| Elasticsearch | 5-20 ms | 10K ops/s | Full-text search, log analytics |
| Kafka | <10 ms | 1M msgs/s | Event streaming, audit log, fan-out |

## Component Selection Framework

\`\`\`tabs
{
  "tabs": [
    {
      "label": "When to use a cache",
      "content": "Use cache when: reads >> writes (>10:1), same data read repeatedly, stale data acceptable for short windows.\\nAvoid cache when: data changes on every write (cache thrashing), strong consistency required, financial/inventory data.\\nCache aside (lazy load) is default. Write-through for critical data."
    },
    {
      "label": "SQL vs NoSQL",
      "content": "Choose SQL when: relationships matter, ACID needed, schema is known, small-medium scale (<10M rows).\\nChoose NoSQL when: horizontal scale required, flexible/evolving schema, high write throughput, no complex JOINs.\\nDon't use NoSQL to avoid learning SQL — it's a trade-off, not an upgrade."
    },
    {
      "label": "Sync vs async",
      "content": "Synchronous (REST/gRPC): use when caller needs the result immediately, operation is fast (<100 ms), failure should propagate to caller.\\nAsynchronous (Kafka/queue): use when operation is slow, caller doesn't need immediate result, fan-out to multiple consumers needed."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "In a 45-minute system design interview, at what point should you start drawing the high-level architecture diagram?",
  "options": [
    "Immediately — show your knowledge upfront",
    "After 5-10 minutes of requirements clarification and capacity estimation",
    "Only after fully specifying every API endpoint",
    "At the end, after the deep dive, to summarize your design"
  ],
  "answer": 1,
  "explanation": "Starting without requirements is the most common interview mistake. Without knowing the scale, consistency requirements, and key features, your architecture might solve the wrong problem. 5-10 minutes clarifying requirements + rough estimates gives you the constraints that determine every architectural decision. The interviewer expects and respects the clarification phase."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "45-min structure: 5 min requirements → 5 min estimates → 10 min high-level → 15 min deep dive → 10 min trade-offs",
    "Memory is 1,000× faster than SSD; SSD 100× faster than HDD; cross-DC network ~100 ms — internalize these ratios",
    "Cache when reads >> writes and stale data OK; SQL when ACID + joins needed; async when caller doesn't need immediate result",
    "Interviewers evaluate structured thinking and trade-off reasoning, not trivia about specific technologies"
  ]
}
\`\`\``,
    },
    {
      id: "communicating-trade-offs",
      slug: "communicating-trade-offs",
      title: "How to Communicate Trade-offs Like a Staff Engineer",
      content: `# How to Communicate Trade-offs Like a Staff Engineer

\`\`\`concept
{
  "title": "The Junior vs Senior Mindset",
  "body": "Junior candidates present one solution as 'the answer'. Staff engineers present a solution as 'the best fit given these constraints, with these trade-offs'. The difference is not knowledge depth — it's the framing. Every architectural choice sacrifices something. Naming what you're sacrificing demonstrates engineering judgment, which is what staff-level roles require."
}
\`\`\`

## The Trade-off Vocabulary

\`\`\`compare
{
  "title": "Junior Phrasing vs Staff Phrasing",
  "left": {
    "label": "Junior (avoid)",
    "points": [
      "'I would use Redis because it's fast'",
      "'Microservices are better than monoliths'",
      "'We should use Kafka for messaging'",
      "'PostgreSQL can't scale to this size'",
      "'This design is production-ready'"
    ]
  },
  "right": {
    "label": "Staff (use this)",
    "points": [
      "'Redis trades persistence for throughput — acceptable here since this is a cache, not source of truth'",
      "'Microservices give us deployment independence but add operational overhead — worth it at our team size'",
      "'Kafka gives us replay and fan-out; if we only need one consumer, SQS is simpler and cheaper'",
      "'PostgreSQL handles this scale with read replicas; we'd reconsider at 100× if write throughput becomes the bottleneck'",
      "'This design has known limitations: X and Y. Given more time, I'd add Z.'"
    ]
  }
}
\`\`\`

## Handling Interviewer Pushback

\`\`\`steps
{
  "steps": [
    { "title": "Don't panic — pushback is a probe, not a correction", "description": "Interviewers often push back to see how you reason under pressure, not because your answer was wrong. 'What if that doesn't scale?' might be testing if you'll defend a correct position." },
    { "title": "Acknowledge the concern directly", "description": "Say: 'That's a valid concern. Let me think through that.' Shows intellectual honesty and buys you 3 seconds." },
    { "title": "Reason through it", "description": "Walk through the math or logic. 'At 10K req/s, PostgreSQL with connection pooling handles ~5K TPS. We'd need read replicas at that scale. If that's the expected load, I'd add a replica in the design.'" },
    { "title": "Offer alternatives if your answer was wrong", "description": "If the interviewer's pushback reveals a real gap: 'Good point — I hadn't considered that. In that case, I'd switch to X because of Y.' Pivoting gracefully is a staff-level skill." }
  ]
}
\`\`\`

## Consistency Trade-off Framework

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Strong consistency (when to choose)",
      "content": "Choose when: financial transactions, inventory counts, user authentication, any scenario where stale reads cause user harm.\\nCost: higher latency (sync replication), lower availability (CAP theorem — partition tolerance forces a choice).\\nTool: single-region RDBMS, Spanner (multi-region), etcd/ZooKeeper for coordination."
    },
    {
      "label": "Eventual consistency (when to choose)",
      "content": "Choose when: social feeds, recommendation systems, view counts, search indices, user profile caching.\\nBenefit: higher availability, lower latency, easier horizontal scaling.\\nTool: Cassandra, DynamoDB, Redis async replication, Kafka consumer lag."
    },
    {
      "label": "Saying it in the interview",
      "content": "Template: 'For [component], I'm choosing [consistency level] because [user impact if wrong] is [acceptable/not acceptable]. The trade-off is [what we sacrifice]. We'd monitor [metric] to detect drift.'\\n\\nExample: 'For the shopping cart, eventual consistency is fine — a 1-second lag before another device sees the update is acceptable. We'd use Redis with async replication.'"
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "An interviewer asks: 'What happens to your design if the cache goes down?' The best response is:",
  "options": [
    "'The cache won't go down — we'll use Redis Cluster for HA'",
    "'Good question. Cache failures mean all requests fall through to the DB. At our traffic level that's 50K req/s hitting PostgreSQL — it would saturate. Mitigation: circuit breaker to reject non-critical requests, Redis Sentinel for fast failover, and a read replica to absorb some load'",
    "'We'd need to restart the cache quickly'",
    "'The system would fail and we'd need to roll back the deployment'"
  ],
  "answer": 1,
  "explanation": "The best answer demonstrates: (1) you understand the failure mode (DB saturation), (2) you've quantified the impact (50K req/s), (3) you have multiple mitigation strategies with named tools. 'The cache won't go down' is an anti-pattern — everything fails, and claiming otherwise signals inexperience."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Frame every decision as a trade-off: 'X gives us A but costs B — acceptable here because C'",
    "Interviewer pushback is a probe, not a correction — acknowledge, reason through, pivot if wrong",
    "Consistency vocabulary: strong (financial, auth) vs eventual (feeds, caches, search) — know when each applies",
    "Proactively identify failure modes before the interviewer asks — 'the weakness here is X, mitigated by Y'"
  ]
}
\`\`\``,
    },
    {
      id: "mock-design-payment-system",
      slug: "mock-design-payment-system",
      title: "Mock Design: Payment Processing System (Stripe)",
      content: `# Mock Design: Payment Processing System (Stripe)

\`\`\`callout
{ "variant": "info", "title": "Mock Interview Format", "content": "Work through each section as if in a real 45-minute interview. Read the requirements, gather your own requirements mentally, sketch a design, then check against the provided solution. Time yourself." }
\`\`\`

## The Problem

Design a payment processing platform (like Stripe) that allows merchants to accept card payments from customers.

## Requirements Clarification

\`\`\`collapse
{
  "title": "Key questions to ask the interviewer",
  "content": "1. What payment methods? (Cards only, or ACH, crypto?)\\n2. What's the expected transaction volume? (TPS at peak)\\n3. Do we need to handle international currencies?\\n4. What's the consistency requirement — can we lose a transaction?\\n5. Do we process cards ourselves or via a payment processor (Visa/Mastercard networks)?\\n\\nAssumed scope: credit/debit cards via card networks, 10K TPS peak, multi-currency, zero transaction loss, we're the processor middleware."
}
\`\`\`

## Critical Design Properties

\`\`\`concept
{
  "title": "The Three Laws of Payment Systems",
  "body": "1. **Idempotency** — a retry must never charge twice. 2. **Exactly-once** — every payment processed exactly once end-to-end, even across network failures. 3. **Audit trail** — every state transition must be logged permanently. These three requirements drive every architectural decision."
}
\`\`\`

## Idempotency Keys

\`\`\`tabs
{
  "tabs": [
    {
      "label": "The problem",
      "content": "Merchant submits payment. Network timeout. Merchant retries. Did the first request succeed?\\nWithout idempotency: charge twice. Customer dispute. Merchant chargeback. Reputation damage."
    },
    {
      "label": "Solution: client-generated idempotency key",
      "content": "Merchant generates unique key per payment attempt (UUID).\\nServer: SELECT id FROM payments WHERE idempotency_key=\\$1.\\nIf found → return original response (not re-process).\\nIf not found → process and store with idempotency key.\\nKeys expire after 24 hours (after which retry = new payment)."
    },
    {
      "label": "Database implementation",
      "content": "payments table: (id, idempotency_key UNIQUE, amount, currency, status, created_at)\\nUPSERT on idempotency_key with ON CONFLICT DO NOTHING.\\nReturn existing row if conflict → idempotent.\\nIdempotency key + amount + merchant_id must ALL match (reject if different amounts with same key)."
    }
  ]
}
\`\`\`

## Payment State Machine

\`\`\`steps
{
  "steps": [
    { "title": "INITIATED", "description": "Payment record created with idempotency key. Amount validated, merchant verified." },
    { "title": "AUTHORIZING", "description": "Request sent to card network (Visa/Mastercard) for authorization. Hold placed on cardholder funds." },
    { "title": "AUTHORIZED", "description": "Card network approved. Funds reserved but not yet transferred." },
    { "title": "CAPTURING", "description": "Capture request sent to move authorized funds. Typically happens at shipment." },
    { "title": "SUCCEEDED", "description": "Funds captured. Money in merchant account. Terminal state." },
    { "title": "FAILED / DECLINED", "description": "Authorization or capture rejected. Terminal state. Reason code stored." },
    { "title": "REFUNDED", "description": "Partial or full reversal processed." }
  ]
}
\`\`\`

## Architecture

\`\`\`sysdiag
{
  "title": "Payment Processing Architecture",
  "nodes": [
    { "id": "sdk", "label": "Merchant SDK / API", "type": "client" },
    { "id": "api", "label": "Payment API (idempotency check)", "type": "service" },
    { "id": "db", "label": "PostgreSQL (payments + outbox)", "type": "database" },
    { "id": "proc", "label": "Payment Processor Service", "type": "service" },
    { "id": "network", "label": "Card Networks (Visa/MC)", "type": "service" },
    { "id": "kafka", "label": "Kafka (payment events)", "type": "queue" },
    { "id": "ledger", "label": "Ledger Service (double-entry)", "type": "service" },
    { "id": "webhook", "label": "Webhook Delivery Service", "type": "service" }
  ],
  "edges": [
    { "from": "sdk", "to": "api", "label": "POST /payments + idempotency-key" },
    { "from": "api", "to": "db", "label": "upsert payment" },
    { "from": "api", "to": "proc", "label": "async via Kafka" },
    { "from": "proc", "to": "network", "label": "authorize + capture" },
    { "from": "proc", "to": "db", "label": "update status" },
    { "from": "proc", "to": "kafka", "label": "PAYMENT_SUCCEEDED event" },
    { "from": "kafka", "to": "ledger" },
    { "from": "kafka", "to": "webhook", "label": "notify merchant" }
  ]
}
\`\`\`

## PCI-DSS Architectural Implications

\`\`\`concept
{
  "title": "Cardholder Data Environment (CDE)",
  "body": "PCI-DSS mandates that raw card numbers (PANs) never touch systems that don't need them. Architecture implication: the Merchant SDK tokenizes the card in the browser (Stripe.js equivalent) before the number ever reaches your servers. Your API receives a token, not a raw PAN. Only a dedicated, heavily audited Vault service handles raw card data. Everything else interacts with tokens."
}
\`\`\`

\`\`\`quiz
{
  "question": "A merchant's server submits a $100 payment. The API times out after 30 seconds. The merchant retries with the same idempotency key. What should happen?",
  "options": [
    "The second request processes a new $100 charge",
    "The server returns the original payment's status — if it succeeded, no new charge; if it failed, no new charge (retry is separate)",
    "The server rejects the retry with a 409 Conflict error",
    "The server processes the charge again but immediately refunds the duplicate"
  ],
  "answer": 1,
  "explanation": "The idempotency key lookup returns the existing payment record with its current status. If the original charge succeeded (despite the client timeout), the retry gets status=SUCCEEDED — no double charge. If it failed mid-processing, the retry gets status=FAILED — client can retry with a NEW idempotency key if they want to attempt again. The key insight: idempotency key makes the operation safe to retry."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Idempotency keys (client-generated UUID per attempt) prevent double charges on network retries — store with UNIQUE constraint",
    "Payment state machine: INITIATED → AUTHORIZING → AUTHORIZED → CAPTURING → SUCCEEDED/FAILED — all transitions logged",
    "PCI-DSS: raw card numbers tokenized client-side (browser JS), never reach application servers — only a dedicated Vault handles PANs",
    "Outbox Pattern ensures PAYMENT_SUCCEEDED event is published atomically with DB state update"
  ]
}
\`\`\``,
    },
    {
      id: "mock-design-distributed-cache",
      slug: "mock-design-distributed-cache",
      title: "Mock Design: Distributed Cache Service (Memcached Clone)",
      content: `# Mock Design: Distributed Cache Service (Memcached Clone)

\`\`\`callout
{ "variant": "info", "title": "Mock Interview Format", "content": "Design a distributed in-memory cache service from scratch. Sketch your design, then compare with the solution below. Focus on consistent hashing, replication, and eviction." }
\`\`\`

## The Problem

Design a distributed in-memory key-value cache service (like Memcached or a simplified Redis Cluster). Clients should be able to GET, SET, and DELETE keys. The cache should scale horizontally, survive node failures, and evict entries when memory is full.

## Key Design Decisions

\`\`\`concept
{
  "title": "Three Hard Problems",
  "body": "1. **Partitioning** — how to distribute keys across N nodes without a central coordinator. 2. **Replication** — how to survive node failures without losing all cached data. 3. **Eviction** — when memory is full, which key to evict to maximize cache hit rate."
}
\`\`\`

## Consistent Hashing

\`\`\`concept
{
  "title": "Why Not Modulo Hashing?",
  "body": "Simple approach: node = hash(key) % N. Problem: when N changes (node added/removed), nearly every key maps to a different node — cache invalidation storm, all cache misses, DB overloaded. **Consistent hashing** places both nodes and keys on a hash ring. Adding/removing one node only remaps keys from/to that node's neighbors — ~1/N of all keys."
}
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Hash ring setup",
      "content": "Ring: 0 to 2^32-1 (or 2^64-1).\\nPlace each node at hash(nodeId) on the ring.\\nFor virtual nodes: place each node at K positions (K=150 typical) for load balance.\\nFor key lookup: hash(key), walk clockwise to the first node."
    },
    {
      "label": "Node addition",
      "content": "New node N4 added at position P on the ring.\\nOnly keys between N3's position and P now map to N4 (previously mapped to N1).\\nAll other key assignments unchanged.\\nCache miss rate spike is bounded: only 1/N fraction of keys need re-population."
    },
    {
      "label": "Client-side routing",
      "content": "No central proxy needed.\\nClient library maintains the ring in memory.\\nOn GET/SET: compute hash(key), find node.\\nRing state propagated via gossip or config service.\\nThis is how Memcached clients work today."
    }
  ]
}
\`\`\`

## Replication

\`\`\`compare
{
  "title": "Replication Strategies",
  "left": {
    "label": "Primary-Replica",
    "points": [
      "One primary per partition accepts writes",
      "Replicas serve reads (or just failover)",
      "Strong consistency possible (sync replication)",
      "Failover: replica promoted on primary failure",
      "Simpler but primary is bottleneck"
    ]
  },
  "right": {
    "label": "Leaderless (Dynamo-style)",
    "points": [
      "Any node accepts writes",
      "W write quorum + R read quorum (W+R > N for consistency)",
      "Eventual consistency by default",
      "No failover needed — any surviving node handles it",
      "More complex: requires conflict resolution"
    ]
  }
}
\`\`\`

## Eviction Policies

\`\`\`steps
{
  "steps": [
    { "title": "LRU (Least Recently Used)", "description": "Evict the key that was accessed least recently. Default for most caches. Implemented with a doubly-linked list + hash map (O(1) access and eviction). Works well for temporal locality." },
    { "title": "LFU (Least Frequently Used)", "description": "Evict the key accessed fewest times. Better for Zipf-distributed workloads where some keys are permanently hot. More complex to implement than LRU." },
    { "title": "TTL-based expiry", "description": "Every key has a time-to-live. Lazy expiry: check TTL on read, delete if expired. Active expiry: background job scans a fraction of keys periodically and deletes expired ones. Redis uses a hybrid." }
  ]
}
\`\`\`

## Architecture

\`\`\`sysdiag
{
  "title": "Distributed Cache Architecture",
  "nodes": [
    { "id": "client", "label": "Client Library (consistent hash ring)", "type": "client" },
    { "id": "n1", "label": "Cache Node 1 (primary shard A)", "type": "database" },
    { "id": "n2", "label": "Cache Node 2 (primary shard B)", "type": "database" },
    { "id": "n3", "label": "Cache Node 3 (primary shard C)", "type": "database" },
    { "id": "r1", "label": "Replica of Node 1", "type": "database" },
    { "id": "config", "label": "Config Service (ring membership)", "type": "service" }
  ],
  "edges": [
    { "from": "client", "to": "config", "label": "ring state" },
    { "from": "client", "to": "n1", "label": "GET/SET shard A" },
    { "from": "client", "to": "n2", "label": "GET/SET shard B" },
    { "from": "client", "to": "n3", "label": "GET/SET shard C" },
    { "from": "n1", "to": "r1", "label": "async replication" }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "A distributed cache has 4 nodes using modulo hashing (node = hash(key) % 4). A 5th node is added. Approximately what fraction of keys will be remapped?",
  "options": [
    "1/5 (20%) — only the keys that belong to the new node",
    "4/5 (80%) — almost all keys change their node assignment",
    "1/4 (25%) — proportional to the old node count",
    "0% — consistent hashing handles the addition without remapping"
  ],
  "answer": 1,
  "explanation": "With modulo hashing and N=4, key K goes to hash(K)%4. With N=5, it goes to hash(K)%5. These are different for ~80% of keys (only keys where hash(K) gives the same remainder mod 4 and mod 5 stay on the same node — rare). This cache invalidation storm is why consistent hashing exists: with a hash ring, only ~20% of keys (1/N) need remapping when a node is added."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Consistent hashing: nodes + keys on a hash ring; adding/removing one node remaps only 1/N keys (vs ~80% for modulo hashing)",
    "Virtual nodes (K=150 positions per real node) ensure uniform load distribution on the ring",
    "LRU eviction: doubly-linked list + hash map → O(1) access and eviction; default for most cache workloads",
    "Client-side routing (no central proxy) enables zero single-point-of-failure and horizontal scaling"
  ]
}
\`\`\``,
    },
    {
      id: "mock-design-realtime-leaderboard",
      slug: "mock-design-realtime-leaderboard",
      title: "Mock Design: Real-Time Leaderboard (Gaming)",
      content: `# Mock Design: Real-Time Leaderboard (Gaming)

\`\`\`callout
{ "variant": "info", "title": "Mock Interview Format", "content": "Design a global gaming leaderboard for 10M concurrent players. Your score updates in real-time and you can see your rank and the top-100 at any moment." }
\`\`\`

## Requirements

- Players submit scores after each match
- Leaderboard shows top-100 globally and player's current rank
- Updates must reflect in <5 seconds
- 10 M concurrent players, 100 K score submissions/minute
- Weekly leaderboard (resets Monday midnight)

## Core Data Structure — Redis Sorted Set

\`\`\`concept
{
  "title": "Redis ZADD / ZRANK — O(log N)",
  "body": "Redis Sorted Sets store (member, score) pairs with automatic ordering. ZADD leaderboard:week:2025-W12 1500 'player:abc' — adds or updates player's score. ZREVRANK leaderboard:week:2025-W12 'player:abc' — returns player's rank (0-indexed) in O(log N). ZREVRANGE leaderboard:week:2025-W12 0 99 WITHSCORES — returns top-100 with scores in O(log N + 100)."
}
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Score submission",
      "content": "POST /scores { playerId, score, matchId }\\n→ API server validates (idempotency: reject duplicate matchId)\\n→ ZADD leaderboard:week:CURRENT SCORE playerId  (atomic update)\\n→ Also update player's all-time best if score > previous best\\nLatency: <1 ms Redis write"
    },
    {
      "label": "Rank query",
      "content": "GET /leaderboard/rank?playerId=abc\\n→ ZREVRANK leaderboard:week:CURRENT abc → rank N\\n→ ZSCORE leaderboard:week:CURRENT abc → score S\\nReturn: { rank: N+1, score: S }\\nLatency: <1 ms"
    },
    {
      "label": "Top-100 query",
      "content": "GET /leaderboard/top?n=100\\n→ ZREVRANGE leaderboard:week:CURRENT 0 99 WITHSCORES\\n→ Batch fetch player display names from Redis hash or PostgreSQL\\nCache top-100 in a separate Redis key with 5 s TTL (10M players all fetching top-100 = high read pressure)\\nLatency: <5 ms"
    }
  ]
}
\`\`\`

## Scaling Beyond Single Redis Node

\`\`\`concept
{
  "title": "When Does a Single Redis Instance Break?",
  "body": "A Redis Sorted Set with 10 M members: ~500 MB memory. One node handles 500 K ops/s. At 100 K score updates/minute = 1,667/s — trivially handled by one node. For 100 M players or 10 M updates/min, shard by time bucket (top-N per region merge at query time) or use approximate ranking via Count-Min Sketch."
}
\`\`\`

## Time-Window Bucketing

\`\`\`steps
{
  "steps": [
    { "title": "Weekly key rotation", "description": "Key = leaderboard:week:2025-W12. On Monday midnight UTC: rename old key to archive, create new empty sorted set. Pipeline: RENAME leaderboard:week:CURRENT leaderboard:week:2025-W12 → SET leaderboard:week:CURRENT (empty)." },
    { "title": "Multiple time windows", "description": "Maintain: leaderboard:daily, leaderboard:weekly, leaderboard:alltime in parallel. Each score submission updates all three sorted sets in a single Redis pipeline (atomic multi-key write)." },
    { "title": "Regional sharding", "description": "For global scale: leaderboard:week:NA, leaderboard:week:EU, leaderboard:week:APAC. Global top-100 = merge top-200 from each region at query time (manageable at 600 rows)." }
  ]
}
\`\`\`

## Architecture

\`\`\`sysdiag
{
  "title": "Leaderboard Architecture",
  "nodes": [
    { "id": "game", "label": "Game Server", "type": "client" },
    { "id": "api", "label": "Score API", "type": "service" },
    { "id": "redis", "label": "Redis (sorted sets)", "type": "database" },
    { "id": "cache", "label": "Redis (top-100 cache, 5s TTL)", "type": "database" },
    { "id": "pg", "label": "PostgreSQL (player profiles)", "type": "database" },
    { "id": "ws", "label": "WebSocket Service (live updates)", "type": "service" }
  ],
  "edges": [
    { "from": "game", "to": "api", "label": "POST /scores" },
    { "from": "api", "to": "redis", "label": "ZADD (all time windows)" },
    { "from": "api", "to": "ws", "label": "emit score update event" },
    { "from": "ws", "to": "game", "label": "leaderboard push" },
    { "from": "redis", "to": "cache", "label": "populate top-100 cache" },
    { "from": "api", "to": "pg", "label": "fetch player names" }
  ]
}
\`\`\`

\`\`\`quiz
{
  "question": "A player's score is updated 50 times per session. Redis ZADD is called each time. What is the time complexity of maintaining the sorted leaderboard with each update?",
  "options": [
    "O(1) — Redis hashes all scores",
    "O(log N) — sorted set is a skip list; insertion/update is logarithmic in number of members",
    "O(N) — must re-sort after each insertion",
    "O(N log N) — full sort needed after each update"
  ],
  "answer": 1,
  "explanation": "Redis Sorted Sets use a skip list internally. ZADD (insert or update) is O(log N) where N is the number of members. ZRANK is also O(log N). ZRANGE of K elements is O(log N + K). For 10M members: log₂(10M) ≈ 23 operations — effectively constant. This is why Redis Sorted Sets are the canonical leaderboard data structure."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Redis Sorted Set: ZADD O(log N), ZRANK O(log N), ZREVRANGE O(log N + K) — ideal for leaderboards up to 100M members",
    "Time-window keys (leaderboard:week:2025-W12) enable weekly resets via atomic RENAME without downtime",
    "Cache top-100 with 5 s TTL — high-read leaderboard page should not hit the primary sorted set on every request",
    "Multi-time-window update: single pipeline updates daily + weekly + all-time sorted sets atomically"
  ]
}
\`\`\``,
    },
    {
      id: "mock-design-open-prompt",
      slug: "mock-design-open-prompt",
      title: "Mock Design: Collaborative Code Editor (Google Docs for Code)",
      content: `# Mock Design: Collaborative Code Editor

\`\`\`callout
{ "variant": "info", "title": "Unseen Problem", "content": "This problem wasn't covered earlier in the course. Apply first-principles reasoning: identify the hardest technical challenge, pick the right algorithm, and make the trade-offs explicit." }
\`\`\`

## The Problem

Design a collaborative code editor (like VS Code Live Share or Google Docs but for code). Multiple users can edit the same file simultaneously, see each other's cursors, and changes are synced in real-time.

## Clarify Requirements First

\`\`\`collapse
{
  "title": "Questions to ask in the interview",
  "content": "1. Max concurrent editors per document? (10? 1000?)\\n2. Max document size? (10 KB? 10 MB?)\\n3. Offline editing support? (if yes: much harder conflict resolution)\\n4. Code execution needed? (out of scope or separate service)\\n5. Latency requirement for sync? (<200 ms feels real-time)\\n\\nAssumed: 10 concurrent editors, documents <1 MB, online only, <200 ms sync latency."
}
\`\`\`

## The Hard Problem: Concurrent Edits

\`\`\`concept
{
  "title": "Why Shared Text Editing Is Hard",
  "body": "User A at position 5 inserts 'X'. Simultaneously, User B at position 7 inserts 'Y'. If A's edit arrives at the server first, B's position 7 is now wrong — it should be position 8. Naive last-write-wins corrupts the document. **Operational Transformation (OT)** and **CRDTs** are the two approaches to solve this."
}
\`\`\`

## Operational Transformation vs CRDT

\`\`\`compare
{
  "title": "OT vs CRDT",
  "left": {
    "label": "Operational Transformation (OT)",
    "points": [
      "Transform operations against concurrent ops",
      "Server acts as central arbiter of operation order",
      "Used by: Google Docs",
      "Pro: compact representation, intuitive",
      "Con: complex transform functions, hard to get right",
      "Requires central server — no true P2P"
    ]
  },
  "right": {
    "label": "CRDT (Conflict-free Replicated Data Type)",
    "points": [
      "Data structure guarantees convergence on merge",
      "No central server required",
      "Used by: Figma, VS Code Live Share",
      "Pro: simpler correctness, P2P possible",
      "Con: larger metadata overhead per character",
      "Works offline — merge on reconnect"
    ]
  }
}
\`\`\`

## Our Design: OT with Central Server

\`\`\`steps
{
  "steps": [
    { "title": "Client sends operation", "description": "User types 'X' at position 5. Client sends Op: { type: 'insert', pos: 5, char: 'X', revision: 12 } to server. Revision = last server revision client knows about." },
    { "title": "Server transforms against concurrent ops", "description": "Server has processed ops at revisions 12, 13 (concurrent). OT transforms the incoming op against revisions 12-13 to compute the correct server position. Stores final op as revision 14." },
    { "title": "Broadcast to all clients", "description": "Server broadcasts transformed op to all connected clients via WebSocket. Clients apply op to their local copy. All clients converge to same document state." },
    { "title": "Client applies and acknowledges", "description": "Client updates local revision counter. For own ops: remove from pending queue. Concurrent ops from server: transform against pending local ops before applying." }
  ]
}
\`\`\`

## Architecture

\`\`\`sysdiag
{
  "title": "Collaborative Editor Architecture",
  "nodes": [
    { "id": "client", "label": "Editor Clients (WebSocket)", "type": "client" },
    { "id": "lb", "label": "Load Balancer (sticky sessions)", "type": "service" },
    { "id": "collab", "label": "Collaboration Server (OT engine)", "type": "service" },
    { "id": "pubsub", "label": "Redis Pub/Sub (cross-server broadcast)", "type": "database" },
    { "id": "doc", "label": "Document Store (PostgreSQL)", "type": "database" },
    { "id": "ops", "label": "Op Log (PostgreSQL, append-only)", "type": "database" }
  ],
  "edges": [
    { "from": "client", "to": "lb", "label": "WebSocket (sticky)" },
    { "from": "lb", "to": "collab" },
    { "from": "collab", "to": "pubsub", "label": "publish op" },
    { "from": "pubsub", "to": "collab", "label": "broadcast to other servers" },
    { "from": "collab", "to": "ops", "label": "append op" },
    { "from": "collab", "to": "doc", "label": "periodic snapshot" }
  ]
}
\`\`\`

## Presence and Cursors

\`\`\`concept
{
  "title": "Ephemeral State via WebSocket + Redis",
  "body": "Cursor positions are ephemeral — not stored in the DB. On cursor move: client sends cursor update. Server publishes to Redis pub/sub. All connected editors receive cursor position. Redis stores { docId → { userId → {pos, color} } } with 30 s TTL (auto-cleans disconnected users). This is separate from the OT pipeline — cursor updates are eventual, not critical."
}
\`\`\`

\`\`\`quiz
{
  "question": "Two users edit the same document. User A inserts 'cat' at position 0 (making the doc start with 'cat'). Simultaneously, User B deletes character at position 0. After OT convergence, what is the expected document state?",
  "options": [
    "The document starts with 'cat' — A's insert wins",
    "The document is missing its first character — B's delete wins",
    "A's insert at position 0 shifts B's delete to position 1 (or 3 depending on transform) — both ops applied",
    "The document is corrupted — OT cannot handle simultaneous insert and delete"
  ],
  "answer": 2,
  "explanation": "OT transforms B's delete against A's insert. A inserted 3 characters at position 0, so B's delete at position 0 must be transformed to position 3 (the original character is now at position 3). Both operations apply: 'cat' is inserted, the original position-0 character is deleted. This is exactly what OT's transform function computes — adjusting positions of concurrent operations to maintain document consistency."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Concurrent text editing requires OT or CRDT — naive last-write-wins corrupts documents",
    "OT with central server: server is the arbiter of operation order, transforms all incoming ops against concurrent ops",
    "WebSocket sticky sessions required: all editors of a document routed to the same server to share OT state",
    "Cursor/presence is ephemeral — Redis pub/sub with TTL, separate from the durability-critical OT op log"
  ]
}
\`\`\``,
    },
    {
      id: "checkpoint-final-assessment",
      slug: "checkpoint-final-assessment",
      title: "Final Assessment: Full System Design Interview Simulation",
      content: `# Final Assessment: Full System Design Interview Simulation

\`\`\`callout
{ "variant": "info", "title": "Final Assessment", "content": "This is a timed simulation covering the complete system design interview format. Set a 45-minute timer. Read the problem, work through each phase independently, then check the solution. This problem has not appeared in the course — it is a true unseen test." }
\`\`\`

## The Problem: Design a Food Delivery Platform (Uber Eats / DoorDash)

Design a food delivery platform. Customers browse restaurants, place orders, a driver picks up and delivers. The system must handle real-time order tracking and driver location.

## Phase 1: Requirements (5 minutes)

\`\`\`collapse
{
  "title": "Functional requirements to establish",
  "content": "1. Customer browses nearby restaurants (by location, cuisine, rating)\\n2. Customer places order from a restaurant menu\\n3. Order sent to restaurant for preparation\\n4. Driver assigned to pick up order\\n5. Customer sees real-time driver location\\n6. Driver sees navigation to restaurant + customer\\n\\nOut of scope: payments (separate service), restaurant onboarding, reviews."
}
\`\`\`

## Phase 2: Capacity Estimation (5 minutes)

\`\`\`collapse
{
  "title": "Back-of-envelope numbers",
  "content": "DAU: 5 M customers, 500 K drivers\\nPeak orders: 50 K/hour = ~14 orders/second\\nDriver location updates: every 5 s, 500 K active drivers = 100 K writes/s\\nRestaurant catalog: 200 K restaurants, 50 items each = 10 M menu items\\nOrder tracking reads: 10× order writes = 140 reads/s (low — most users check periodically)\\nStorage: orders at 1 KB each × 50 K/hr × 24 hr × 365 = ~440 GB/year"
}
\`\`\`

## Phase 3: High-Level Design (10 minutes)

\`\`\`sysdiag
{
  "title": "Food Delivery High-Level Architecture",
  "nodes": [
    { "id": "capp", "label": "Customer App", "type": "client" },
    { "id": "dapp", "label": "Driver App", "type": "client" },
    { "id": "gw", "label": "API Gateway", "type": "service" },
    { "id": "rest", "label": "Restaurant Service", "type": "service" },
    { "id": "order", "label": "Order Service", "type": "service" },
    { "id": "driver", "label": "Driver Location Service", "type": "service" },
    { "id": "match", "label": "Driver Matching Service", "type": "service" },
    { "id": "notify", "label": "Notification Service", "type": "service" },
    { "id": "redis", "label": "Redis (driver geo + order state)", "type": "database" },
    { "id": "pg", "label": "PostgreSQL (orders + menus)", "type": "database" },
    { "id": "kafka", "label": "Kafka (order events)", "type": "queue" }
  ],
  "edges": [
    { "from": "capp", "to": "gw" },
    { "from": "dapp", "to": "gw" },
    { "from": "gw", "to": "rest", "label": "browse" },
    { "from": "gw", "to": "order", "label": "place order" },
    { "from": "gw", "to": "driver", "label": "location update" },
    { "from": "order", "to": "pg" },
    { "from": "order", "to": "kafka", "label": "ORDER_PLACED" },
    { "from": "kafka", "to": "match" },
    { "from": "match", "to": "redis", "label": "GEORADIUS" },
    { "from": "match", "to": "notify", "label": "notify driver" },
    { "from": "driver", "to": "redis", "label": "GEOADD" }
  ]
}
\`\`\`

## Phase 4: Deep Dive — Driver Matching (15 minutes)

\`\`\`concept
{
  "title": "Two-Sided Matching at Scale",
  "body": "On ORDER_PLACED: query Redis GEORADIUS for available drivers within 5 km. Score by ETA (Google Maps API) + acceptance rate + rating. Send push notification to top-3 drivers. First to accept gets locked via Redis SET NX with 30 s TTL. If no accept in 30 s, widen radius to 10 km and retry. If order has been pending >5 min with no driver: surge driver incentive triggered."
}
\`\`\`

\`\`\`steps
{
  "steps": [
    { "title": "Order placed → event emitted", "description": "Order Service writes to PostgreSQL + publishes ORDER_PLACED to Kafka via Outbox Pattern." },
    { "title": "Matching service consumes event", "description": "Queries Redis GEORADIUS for drivers within 5 km. Filters: status=available, acceptance_rate>50%." },
    { "title": "Score and dispatch", "description": "Score top-10 by ETA. Push notification to top-3 via FCM/APNs. Acquire Redis lock: SET driver:<id>:dispatched <orderId> NX EX 30." },
    { "title": "Driver accepts", "description": "Driver confirms via app → PATCH /orders/:id/accept. Order status → DRIVER_ASSIGNED. Redis lock key = proof of acceptance (check it matches orderId)." },
    { "title": "Real-time tracking begins", "description": "Customer subscribes to WebSocket channel order:<orderId>. Driver location updates (GEOADD) → published to Redis pub/sub channel order:<orderId> → forwarded to customer WebSocket." }
  ]
}
\`\`\`

## Phase 5: Trade-offs and Bottlenecks (10 minutes)

\`\`\`concept
{
  "title": "What Breaks First",
  "body": "At 100 K driver location writes/s, Redis GEOADD is the hottest path. Single Redis node handles 500 K ops/s — safe at 100 K. Shard by city if needed. Restaurant catalog (10 M items) is read-heavy — CDN-cache menu responses with 5-min TTL. PostgreSQL for orders with 14 writes/s is trivial; add read replicas for order history queries."
}
\`\`\`

## Full Assessment Quiz

\`\`\`quiz
{
  "question": "The driver matching service dispatches to 3 drivers simultaneously using Redis NX locks. Driver A accepts but the network request is slow. Driver B also accepts 2 seconds later. What prevents the order from being assigned to both?",
  "options": [
    "The matching service only dispatches to one driver at a time",
    "Redis NX lock: the first SET driver:<id>:dispatched <orderId> NX EX 30 succeeds; the second returns nil — the driver service rejects Driver B's acceptance",
    "PostgreSQL transaction handles the conflict with row-level locking",
    "FCM ensures only one driver receives the notification"
  ],
  "answer": 1,
  "explanation": "Redis SET NX (set if Not eXists) is atomic. The first driver to atomically acquire the lock wins. The lock value is the orderId. When Driver B tries to accept: the Order Service reads the lock, sees it's already assigned to Driver A, and rejects with 'Order already taken'. This is the same distributed lock pattern used in ride-sharing."
}
\`\`\`

\`\`\`quiz
{
  "question": "You need to show a customer their order history for the past 12 months — 50-200 rows. The orders table has 200 M rows total. What is the most important database optimization?",
  "options": [
    "Partition the orders table by month and query only relevant partitions",
    "Index on (customer_id, created_at DESC) — allows index-only scan for the customer's recent orders without touching other rows",
    "Migrate to Cassandra for better read performance",
    "Cache the entire order history in Redis for each customer"
  ],
  "answer": 1,
  "explanation": "A composite index on (customer_id, created_at DESC) lets PostgreSQL scan only that customer's orders in reverse chronological order — touching at most 200 index entries + 200 data pages, regardless of the 200M total rows. Partitioning helps for range queries but adds operational complexity. Cassandra is heavyweight for this use case. Caching 12 months of order history per customer is memory-expensive and stale."
}
\`\`\`

## Final Score Rubric

\`\`\`concept
{
  "title": "How Interviewers Score You",
  "body": "**Strong hire:** Independently gathered requirements, correctly estimated scale, proactively identified bottlenecks (driver location writes as hot path), used appropriate data structures (Redis geo for drivers, Outbox for events), articulated trade-offs. **Hire:** Needed some prompting but arrived at correct design. **No hire:** Started designing before clarifying requirements, used wrong consistency model for orders, couldn't identify the hardest scaling challenge, unable to reason about failure modes."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Requirements first: functional (browse, order, track) then non-functional (scale, latency, consistency) before any architecture",
    "Driver location is the hot write path (100K/s) — Redis GEOADD sharded by city handles it; PostgreSQL would not",
    "Outbox Pattern on ORDER_PLACED ensures driver matching always triggered, even if Kafka is momentarily unavailable",
    "Redis NX locks for driver assignment prevent double-dispatch — same pattern as Uber, Ticketmaster, Stripe idempotency"
  ]
}
\`\`\``,
    },
  ],
};
