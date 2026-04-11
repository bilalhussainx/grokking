import { Module } from "../types";

export const keyConceptsModule: Module = {
  id: "sd-key-concepts",
  title: "Key Concepts in Distributed Systems",
  description: "Essential distributed systems theory: CAP theorem, consistent hashing, message queues, sharding, and replication.",
  lessons: [
    {
      id: "sd-kc-1",
      slug: "cap-theorem",
      title: "CAP Theorem",
      content: `# CAP Theorem

\`\`\`concept
{"title": "Brewer's CAP Theorem", "variant": "mental-model", "content": "In any distributed data store you can pick at most two guarantees:\\n\\n- **Consistency (C):** Every read sees the latest write or gets an error.\\n- **Availability (A):** Every request gets a non-error response, even if data is stale.\\n- **Partition Tolerance (P):** The system keeps working when the network is broken.\\n\\nBecause network partitions are inevitable, the real choice is between CP and AP."}
\`\`\`

The CAP theorem, proposed by Eric Brewer in 2000, states that a distributed data store can provide at most **two out of three** guarantees simultaneously:

- **Consistency (C):** Every read receives the most recent write or an error. All nodes see the same data at the same time.
- **Availability (A):** Every request receives a non-error response, even if it might not contain the most recent write.
- **Partition Tolerance (P):** The system continues to operate despite network partitions (messages being dropped or delayed between nodes).

## Why You Cannot Have All Three

In any distributed system, network partitions **will** happen — cables get cut, switches fail, data centers lose connectivity. Since partitions are unavoidable, you must choose between consistency and availability when a partition occurs.

\`\`\`algoviz
{"title": "CAP Choices During a Partition", "type": "array", "data": ["C+A", "C+P", "A+P"],
 "frames": [
   {"highlight": [0], "label": "CA: single-node only, no partitions allowed", "stats": {"choice": "CA"}},
   {"highlight": [1], "label": "CP: reject reads/writes to stay consistent", "stats": {"choice": "CP"}},
   {"highlight": [2], "label": "AP: keep serving, risk stale data", "stats": {"choice": "AP"}}
 ], "speed": 1000}
\`\`\`

- **CA (Consistency + Availability):** Only possible if there are no partitions — essentially a single-node system. Not practical for distributed systems.
- **CP (Consistency + Partition Tolerance):** During a partition, the system refuses to respond rather than return stale data. Example: HBase, MongoDB (in certain configurations), Zookeeper.
- **AP (Availability + Partition Tolerance):** During a partition, the system continues serving requests but may return stale data. Example: Cassandra, DynamoDB, CouchDB.

## Real-World Examples

**Banking / Financial Transactions (CP):**
When you transfer money between accounts, you need the balances to be consistent. If a network partition occurs, it is better to reject the transaction temporarily than to allow both accounts to show incorrect balances.

**Social Media Feed (AP):**
If a user posts a photo and another user on a different continent does not see it for 5 seconds, that is acceptable. Availability is more important — users should always be able to load their feed.

**Shopping Cart (AP with conflict resolution):**
Amazon's Dynamo paper famously chose AP for shopping carts. If a partition causes two versions of a cart, the system merges them (union of items). A customer seeing an extra item is less harmful than a failed checkout.

\`\`\`quiz
{"title": "Pick the CAP Profile", "questions": [
  {"question": "A global bank’s ledger must never show inconsistent balances, even if some branches go offline. Which CAP profile fits best?", "options": ["CA", "CP", "AP"], "answer": 1, "explanation": "CP systems reject operations during a partition rather than risk inconsistency — exactly what a ledger demands."},
  {"question": "A viral-video app wants users to always see *something* when they open the feed; a 30-second delay is fine. Which profile?", "options": ["CA", "CP", "AP"], "answer": 2, "explanation": "AP keeps the feed available even if some replicas are isolated, trading immediate consistency for uptime."},
  {"question": "A single-node SQLite database on your laptop offers perfect consistency and availability. Which profile?", "options": ["CA", "CP", "AP"], "answer": 0, "explanation": "With only one node there are no network partitions, so CA is achievable — but it is not distributed."}
]}
\`\`\`

## Beyond the Binary

In practice, CAP is not a permanent, system-wide toggle. Modern systems make **per-operation** trade-offs:

- A database might offer strong consistency for writes but eventual consistency for reads.
- You can tune consistency levels per query (e.g., Cassandra's \`QUORUM\` vs \`ONE\`).

The PACELC extension adds nuance: even when there is **no partition (E)**, you still trade off between **latency (L)** and **consistency (C)**.

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "During a network partition you must choose between consistency and availability; partitions are inevitable, so the real choice is CP vs AP.",
  "CP systems reject requests during partitions to maintain correctness; AP systems serve requests at the cost of potentially stale data.",
  "Modern systems often allow per-query consistency tuning rather than a single global setting."
]}
\`\`\``,
    },
    {
      id: "sd-kc-2",
      slug: "consistent-hashing",
      title: "Consistent Hashing",
      content: `# Consistent Hashing

When you distribute data across multiple servers, you need a way to decide which server holds which data. Naive approaches like \`server = hash(key) % N\` break badly when servers are added or removed — nearly all keys get reassigned, causing massive cache misses or data migration.

**Consistent hashing** solves this by minimizing the number of keys that move when the server pool changes.

\`\`\`concept
{
  "title": "The Core Insight",
  "variant": "mental-model",
  "content": "Traditional hashing is like assigning seats by counting off: if someone leaves, everyone after them shifts down. Consistent hashing is like a circular table where each person finds the next available seat clockwise — when someone joins or leaves, only their immediate neighbors are affected."
}
\`\`\`

## The Hash Ring

Imagine a circular number line (a ring) from 0 to 2^32 - 1. Both servers and data keys are hashed onto this ring.

\`\`\`algoviz
{
  "title": "Hash Ring Visualization",
  "type": "array",
  "data": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  "frames": [
    { "highlight": [2], "label": "Server S1 hashed to position 2", "stats": {"server": "S1", "pos": 2} },
    { "highlight": [5], "label": "Server S2 hashed to position 5", "stats": {"server": "S2", "pos": 5} },
    { "highlight": [8], "label": "Server S3 hashed to position 8", "stats": {"server": "S3", "pos": 8} },
    { "highlight": [1], "label": "Key K1 at position 1 → assigned to S1", "stats": {"key": "K1", "pos": 1, "server": "S1"} },
    { "highlight": [4], "label": "Key K2 at position 4 → assigned to S2", "stats": {"key": "K2", "pos": 4, "server": "S2"} },
    { "highlight": [7], "label": "Key K3 at position 7 → assigned to S3", "stats": {"key": "K3", "pos": 7, "server": "S3"} }
  ],
  "speed": 1000
}
\`\`\`

**Rule:** Each key is assigned to the **first server encountered when walking clockwise** from the key's position on the ring.

In the diagram above:
- K1 → S1 (walking clockwise from K1, S1 is the first server)
- K2 → S3 (walking clockwise from K2, S3 is next)
- K3 → S3

## Adding or Removing a Server

When you add server S4 between S2 and S3, only the keys in that arc move to S4. All other keys stay where they are. On average, only \`K/N\` keys move (where K is total keys and N is total servers), compared to nearly all keys moving with modular hashing.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Before: 3 servers",
    "code": "Keys: K1(1), K2(4), K3(7)\\nServers: S1(2), S2(5), S3(8)\\n\\nK1→S1, K2→S2, K3→S3"
  },
  "after": {
    "label": "After: Add S4 at position 6",
    "code": "Keys: K1(1), K2(4), K3(7)\\nServers: S1(2), S2(5), S4(6), S3(8)\\n\\nK1→S1, K2→S2, K3→S4\\n\\nOnly K3 moved!"
  }
}
\`\`\`

## Virtual Nodes

With only a few physical servers, the ring can become unbalanced — one server may own a much larger arc than others. **Virtual nodes** fix this: each physical server is mapped to multiple positions on the ring.

\`\`\`playground
{
  "title": "Virtual Node Distribution Simulator",
  "language": "python",
  "code": "import hashlib\\nimport random\\n\\ndef hash_fn(key):\\n    return int(hashlib.md5(key.encode()).hexdigest(), 16) % 100\\n\\n# Physical servers\\nservers = ['A', 'B', 'C']\\nvirtual_nodes_per_server = 5\\n\\n# Create virtual nodes\\nring = {}\\nfor server in servers:\\n    for i in range(virtual_nodes_per_server):\\n        vnode = f\\"{server}-{i}\\"\\n        pos = hash_fn(vnode)\\n        ring[pos] = server\\n\\n# Sort ring positions\\nsorted_positions = sorted(ring.keys())\\n\\nprint(\\"Virtual node positions on ring:\\")\\nfor pos in sorted_positions:\\n    print(f\\"Position {pos:2d}: {ring[pos]}\\")",
  "runnable": true
}
\`\`\`

A common choice is 100-200 virtual nodes per physical server.

## Where Consistent Hashing Is Used

- **Distributed caches** (Memcached, Redis cluster) — route keys to the right cache node.
- **Distributed databases** (Cassandra, DynamoDB) — determine which node owns a partition.
- **CDNs** — route content requests to the nearest or least-loaded edge server.
- **Load balancers** — sticky sessions based on client IP hash.

\`\`\`quiz
{
  "title": "Consistent Hashing Knowledge Check",
  "questions": [
    {
      "question": "When adding a 4th server to a 3-server consistent hash ring, approximately what percentage of keys need to move?",
      "options": ["25%", "33%", "10%", "75%"],
      "answer": 0,
      "explanation": "With consistent hashing, only 1/N keys move on average. For 4 servers, that's 1/4 = 25% of keys."
    },
    {
      "question": "Why are virtual nodes used in consistent hashing?",
      "options": ["To reduce memory usage", "To improve load balancing", "To speed up hash computation", "To simplify the algorithm"],
      "answer": 1,
      "explanation": "Virtual nodes help achieve more even distribution of keys across physical servers, preventing hotspots."
    },
    {
      "question": "What is the time complexity of finding the correct server for a key in consistent hashing?",
      "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
      "answer": 1,
      "explanation": "Using binary search on the sorted list of virtual node positions gives O(log N) lookup time."
    }
  ]
}
\`\`\`

## Comparison with Modular Hashing

| Scenario | Modular Hashing | Consistent Hashing |
|----------|----------------|-------------------|
| Add 1 server to pool of 10 | ~90% keys move | ~10% keys move |
| Remove 1 server from pool of 10 | ~90% keys move | ~10% keys move |
| Implementation complexity | Trivial | Moderate |

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Consistent hashing maps both keys and servers onto a ring, assigning each key to the nearest clockwise server.",
    "Adding or removing a server only affects a small fraction of keys (1/N on average).",
    "Virtual nodes ensure even distribution across physical servers by creating multiple positions per server.",
    "This technique is foundational to distributed caches, databases, and CDNs."
  ]
}
\`\`\``,
    },
    {
      id: "sd-kc-3",
      slug: "message-queues-and-event-streaming",
      title: "Message Queues & Event Streaming",
      content: `# Message Queues & Event Streaming

Not every operation needs to happen synchronously. When a user uploads a photo, you don't need to generate thumbnails, run content moderation, and update the search index before returning a response. **Message queues** let you decouple producers from consumers and process work asynchronously.

\`\`\`concept
{
  "title": "Async Processing = Better UX",
  "variant": "insight",
  "content": "By moving heavy work off the critical path, you reduce response times from seconds to milliseconds. The user gets instant feedback while background workers handle the heavy lifting."
}
\`\`\`

## Core Concepts

**Producer:** The component that sends messages (e.g., the upload service).  
**Consumer:** The component that receives and processes messages (e.g., the thumbnail generator).  
**Queue/Topic:** The buffer that holds messages between producers and consumers.

\`\`\`sysdiag
{
  "title": "Basic Message Queue Flow",
  "width": 600,
  "height": 200,
  "nodes": [
    { "id": "producer", "label": "Producer\\n(Upload Service)", "x": 100, "y": 100, "kind": "service" },
    { "id": "queue", "label": "Queue", "x": 300, "y": 100, "kind": "storage" },
    { "id": "consumer", "label": "Consumer\\n(Thumbnail Generator)", "x": 500, "y": 100, "kind": "service" }
  ],
  "edges": [
    { "from": "producer", "to": "queue", "label": "send message" },
    { "from": "queue", "to": "consumer", "label": "deliver message" }
  ],
  "annotations": {
    "producer": "Creates and sends messages without knowing who will process them",
    "queue": "Reliable buffer that persists messages until consumed",
    "consumer": "Processes messages at its own pace, can scale independently"
  }
}
\`\`\`

## Point-to-Point vs Pub/Sub

**Point-to-Point (Queue):**  
Each message is consumed by exactly **one** consumer. Good for task distribution — e.g., a pool of workers processing jobs. Examples: RabbitMQ (default mode), Amazon SQS.

**Publish/Subscribe (Topic):**  
Each message is delivered to **all** subscribers. Good for event broadcasting — e.g., a new order triggers notifications, analytics, and inventory updates simultaneously. Examples: Apache Kafka topics, Amazon SNS, Google Pub/Sub.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Point-to-Point (Queue)",
    "code": "Queue: [msg1, msg2, msg3]\\nWorker A: processes msg1\\nWorker B: processes msg2  \\nWorker C: processes msg3\\n\\nResult: Each message processed once"
  },
  "after": {
    "label": "Publish/Subscribe (Topic)",
    "code": "Topic: [event1, event2]\\nSubscriber A: receives event1, event2  (notifications)\\nSubscriber B: receives event1, event2  (analytics)\\nSubscriber C: receives event1, event2  (inventory)\\n\\nResult: Each subscriber gets all events"
  }
}
\`\`\`

## Apache Kafka — Key Concepts

Kafka is the most widely used event streaming platform. Key ideas:

- **Topics** are divided into **partitions**. Each partition is an ordered, append-only log.
- **Consumer groups** allow parallel consumption: each partition is consumed by exactly one consumer within a group.
- **Offsets** track each consumer's position in a partition. Consumers can replay events by resetting their offset.
- **Retention:** Kafka retains messages for a configurable period (e.g., 7 days), unlike traditional queues that delete messages after consumption.

This makes Kafka suitable for both real-time streaming and event replay/reprocessing.

\`\`\`algoviz
{
  "title": "Kafka Partition Consumption",
  "type": "array",
  "data": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  "frames": [
    { "highlight": [0], "label": "Consumer A reads offset 0", "stats": {"offset": 0, "consumer": "A"} },
    { "highlight": [1], "label": "Consumer A advances to offset 1", "stats": {"offset": 1, "consumer": "A"} },
    { "highlight": [2], "label": "Consumer B starts at offset 2 (different partition)", "stats": {"offset": 2, "consumer": "B"} }
  ],
  "speed": 1000
}
\`\`\`

## When to Use Asynchronous Processing

| Use Case | Why Async? |
|----------|-----------|
| Email/SMS notifications | User should not wait for delivery |
| Image/video processing | CPU-intensive; do it in background |
| Search index updates | Slight delay is acceptable |
| Analytics event ingestion | Fire and forget |
| Order processing pipeline | Multiple steps with different SLAs |

\`\`\`quiz
{
  "title": "Queue vs Streaming: When to Use What?",
  "questions": [
    {
      "question": "You need to process payment transactions where each payment must be handled exactly once. Which pattern fits best?",
      "options": ["Point-to-point queue with idempotent consumers", "Pub/sub topic with multiple subscribers", "Kafka with exactly-once semantics", "Both A and C"],
      "answer": 3,
      "explanation": "Both point-to-point queues and Kafka can ensure exactly-once processing when properly configured. The key is having idempotent consumers that can safely handle duplicate messages."
    },
    {
      "question": "A new user signup should trigger: welcome email, analytics tracking, and CRM update. Which approach?",
      "options": ["Single queue with multiple workers", "Pub/sub topic with separate subscribers", "Direct API calls to each service", "Batch process nightly"],
      "answer": 1,
      "explanation": "Pub/sub broadcasting ensures all interested services receive the signup event simultaneously, without the producer knowing who needs the data."
    },
    {
      "question": "What's the main advantage of Kafka's partitioned topics over single queues?",
      "options": ["Higher throughput through parallel consumption", "Guaranteed message ordering globally", "Simpler consumer logic", "Lower latency per message"],
      "answer": 0,
      "explanation": "Partitions enable horizontal scaling by allowing multiple consumers to process different partitions in parallel, dramatically increasing throughput."
    }
  ]
}
\`\`\`

## Delivery Guarantees

- **At-most-once:** Messages may be lost but are never delivered twice. Fast, but risky.
- **At-least-once:** Messages are never lost but may be delivered more than once. Most common. Consumers must be **idempotent** (safe to process the same message twice).
- **Exactly-once:** Messages are delivered exactly once. Hard to achieve; Kafka supports it within its ecosystem using transactional producers and consumers.

\`\`\`trace
{
  "title": "At-Least-Once Delivery in Action",
  "language": "python",
  "code": "def process_payment(message):\\n    payment_id = message['payment_id']\\n    amount = message['amount']\\n    \\n    # Check if already processed (idempotent)\\n    if db.get(f\\"processed:{payment_id}\\"):\\n        return \\"already_processed\\"\\n    \\n    # Process the payment\\n    balance = db.get(f\\"account:{message['account']}\\")\\n    new_balance = balance - amount\\n    db.set(f\\"account:{message['account']}\\", new_balance)\\n    \\n    # Mark as processed\\n    db.set(f\\"processed:{payment_id}\\", \\"true\\")\\n    return \\"success\\"",
  "frames": [
    { "line": 3, "vars": {"message": {"payment_id": "p123", "amount": 50}}, "note": "First delivery attempt" },
    { "line": 6, "vars": {"payment_id": "p123", "exists": "False"}, "note": "Not processed yet" },
    { "line": 10, "vars": {"balance": 100, "new_balance": 50}, "note": "Deducting amount" },
    { "line": 14, "vars": {"processed": "True"}, "note": "Marked as processed" },
    { "line": 3, "vars": {"message": {"payment_id": "p123", "amount": 50}}, "note": "Second delivery (duplicate)" },
    { "line": 6, "vars": {"payment_id": "p123", "exists": "True"}, "note": "Detected duplicate, skipped processing" }
  ],
  "speed": 800
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Message queues decouple producers from consumers and enable asynchronous processing",
    "Point-to-point queues distribute work; pub/sub topics broadcast events",
    "Kafka provides durable, replayable event logs with partitioned parallelism",
    "Design consumers to be idempotent — at-least-once delivery is the practical default",
    "Async processing improves user-perceived latency and system resilience"
  ]
}
\`\`\``,
    },
    {
      id: "sd-kc-4",
      slug: "database-sharding-and-partitioning",
      title: "Database Sharding & Partitioning",
      content: `# Database Sharding & Partitioning

When a single database server can no longer handle the load or store all the data, you split the data across multiple servers. This is **sharding** (also called horizontal partitioning).

\`\`\`concept
{
  "title": "Partitioning vs Sharding",
  "variant": "mental-model",
  "content": "Think of your data as a library. Partitioning is like organizing books within one building by genre—everything stays under one roof, but it's neatly arranged. Sharding is like building multiple branch libraries across town, each holding a unique subset of all books. Both help manage scale, but sharding lets you add more buildings (servers) indefinitely."
}
\`\`\`

## Vertical vs Horizontal Partitioning

**Vertical partitioning:** Split a table by columns. For example, store user profile data in one database and user activity logs in another. This is really about separating concerns into different services.

**Horizontal partitioning (sharding):** Split a table by rows. For example, users with IDs 1-1,000,000 go to Shard 1, users 1,000,001-2,000,000 go to Shard 2, and so on.

\`\`\`algoviz
{
  "title": "Horizontal Sharding in Action",
  "type": "array",
  "data": [
    {"id": 1, "name": "Alice", "email": "a@example.com"},
    {"id": 2, "name": "Bob", "email": "b@example.com"},
    {"id": 1000001, "name": "Zara", "email": "z@example.com"}
  ],
  "frames": [
    {"highlight": [0], "label": "Shard 1 receives rows with ID ≤ 1,000,000", "stats": {"shard": 1, "rows": 1}},
    {"highlight": [1], "label": "Bob also lands on Shard 1", "stats": {"shard": 1, "rows": 2}},
    {"highlight": [2], "label": "Zara's ID > 1,000,000 → routed to Shard 2", "stats": {"shard": 2, "rows": 1}}
  ],
  "speed": 1000
}
\`\`\`

## Choosing a Shard Key

The **shard key** determines which shard a row lives on. This is the single most important decision in a sharding strategy.

**Good shard key properties:**
- **High cardinality:** Many distinct values to distribute data evenly.
- **Even distribution:** No single value dominates (avoids "hot" shards).
- **Query alignment:** Most queries should need only one shard. If queries frequently join data across shards, you chose the wrong key.

**Common shard key strategies:**
- **User ID:** Great when most queries are user-scoped. Even distribution if IDs are sequential or random.
- **Geographic region:** Good when queries are region-scoped and data residency laws apply.
- **Hash of key:** Ensures even distribution but makes range queries impossible.
- **Time-based:** Good for append-heavy workloads (logs), but the latest shard becomes a hot spot.

\`\`\`quiz
{
  "title": "Pick the Better Shard Key",
  "questions": [
    {
      "question": "E-commerce orders table: which key distributes load best?",
      "options": ["customer_id", "order_status", "created_date", "product_category"],
      "answer": 0,
      "explanation": "customer_id has high cardinality and naturally groups a user’s orders together, keeping most queries shard-local."
    },
    {
      "question": "A hash-based shard key sacrifices which capability?",
      "options": ["Point lookups", "Range queries", "Writes", "ACID transactions"],
      "answer": 1,
      "explanation": "Hashing destroys ordering, so range scans like 'orders between date X and Y' must hit every shard."
    },
    {
      "question": "You notice one shard is 3× hotter. The most likely cause is:",
      "options": ["Low-cardinality shard key", "Too many indexes", "Network latency", "Small page size"],
      "answer": 0,
      "explanation": "Low-cardinality keys (e.g., country) create skew—some values simply own more rows."
    }
  ]
}
\`\`\`

## Rebalancing

Over time, shards become uneven. New users cluster on certain shards, or some users generate far more data than others. **Rebalancing** moves data between shards to restore balance.

Approaches:
- **Fixed partitioning:** Pre-create many more partitions than servers (e.g., 1000 partitions across 10 servers). When adding a server, move whole partitions to the new server.
- **Dynamic splitting:** Split a hot partition into two when it exceeds a size threshold.
- **Consistent hashing:** As discussed in the previous lesson, adding a node only moves a fraction of keys.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Monolithic DB (before sharding)",
    "code": "SELECT * FROM users WHERE id = 42;\\n-- single 2 TB table, 10 k QPS max"
  },
  "after": {
    "label": "Four shards (after sharding)",
    "code": "shard = hash(42) % 4;  -- shard 3\\nSELECT * FROM users_shard3 WHERE id = 42;\\n-- 4 × 500 GB tables, 40 k QPS max"
  }
}
\`\`\`

## Challenges of Sharding

1. **Cross-shard queries:** JOINs across shards are slow and complex. Design your data model to avoid them.
2. **Distributed transactions:** ACID transactions across shards require two-phase commit or similar protocols, which add latency and complexity.
3. **Operational complexity:** Backups, schema migrations, and monitoring multiply by the number of shards.
4. **Rebalancing downtime:** Moving data between shards can temporarily increase latency.

\`\`\`callout
{
  "type": "warning",
  "title": "Avoid the cross-shard JOIN trap",
  "content": "A single JOIN that spans 10 shards becomes 10 separate queries plus a merge step in your application. Denormalize aggressively or keep related rows on the same shard (same customer, same region, etc.)."
}
\`\`\`

## When to Shard

Sharding is a last resort, not a first step. Before sharding, try:
1. Vertical scaling (bigger machine)
2. Read replicas (offload reads)
3. Caching (reduce database hits)
4. Query optimization and indexing

If you have exhausted these and still cannot meet your performance or storage needs, then shard.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Sharding splits data across multiple database servers by rows; partitioning organizes data within one server.",
    "The shard key determines distribution and must be chosen to match your query patterns.",
    "Cross-shard queries and distributed transactions are the biggest pain points.",
    "Pre-create more partitions than you need to simplify future rebalancing.",
    "Exhaust simpler scaling options before resorting to sharding."
  ]
}
\`\`\``,
    },
    {
      id: "sd-kc-5",
      slug: "replication-and-consistency-models",
      title: "Replication & Consistency Models",
      content: `# Replication & Consistency Models

Replication keeps identical data copies on multiple machines for **fault tolerance** (survive node failures) and **performance** (spread read traffic). The twist: the moment you have copies, you must decide how closely they behave like a single source of truth.

\`\`\`concept
{
  "title": "Replication vs. Consistency",
  "variant": "mental-model",
  "content": "Think of replicas as synchronized swimmers. Perfect synchronization (strong consistency) looks beautiful but slows everyone down. Loose synchronization (eventual consistency) lets swimmers move faster, but formations may briefly look different from different seats in the arena."
}
\`\`\`

## Replication Topologies

### Leader-Follower (Primary-Secondary)

One node—the **leader**—ingests every write, then streams the change log to **followers** that can serve reads.

\`\`\`sysdiag
{
  "title": "Leader-Follower Flow",
  "width": 600,
  "height": 240,
  "nodes": [
    { "id": "client", "label": "Client", "x": 50, "y": 120, "kind": "user" },
    { "id": "leader", "label": "Leader", "x": 200, "y": 120, "kind": "service" },
    { "id": "f1", "label": "Follower-1", "x": 380, "y": 60, "kind": "service" },
    { "id": "f2", "label": "Follower-2", "x": 380, "y": 120, "kind": "service" },
    { "id": "f3", "label": "Follower-3", "x": 380, "y": 180, "kind": "service" }
  ],
  "edges": [
    { "from": "client", "to": "leader", "label": "write" },
    { "from": "leader", "to": "f1", "label": "replicate" },
    { "from": "leader", "to": "f2", "label": "replicate" },
    { "from": "leader", "to": "f3", "label": "replicate" },
    { "from": "f1", "to": "client", "label": "read", "style": "dashed" },
    { "from": "f2", "to": "client", "label": "read", "style": "dashed" },
    { "from": "f3", "to": "client", "label": "read", "style": "dashed" }
  ],
  "annotations": {
    "leader": "Single write point; strong consistency if reads also come here.",
    "f2": "Can lag milliseconds—seconds behind, yielding stale reads."
  }
}
\`\`\`

- **Pros**: Simple mental model; strong consistency when reading from leader.
- **Cons**: Write bottleneck; leader failure needs failover; followers may serve stale data.

### Multi-Leader

Each region owns a **leader** that accepts local writes; leaders replicate to each other.

- **Pros**: Low-latency writes in every region; survives whole-data-center loss.
- **Cons**: Concurrent writes on different leaders create **conflicts**—you must resolve them (timestamps, CRDTs, or application merge).

### Leaderless (Dynamo-Style)

Every node is equal: clients write to **W** replicas and read from **R** replicas, then apply **quorum** rules.

\`\`\`algoviz
{
  "title": "Quorum Write with N=3, W=2, R=2",
  "type": "array",
  "data": ["v0", "v0", "v0"],
  "frames": [
    { "highlight": [], "label": "Initial state: all replicas hold v0" },
    { "highlight": [0, 1], "label": "Client sends write(v1) to all nodes; 2 acks enough (W=2)" },
    { "highlight": [0, 1], "label": "Nodes 0 & 1 update to v1; node 2 still v0 (async)" },
    { "highlight": [1, 2], "label": "Concurrent read quorum R=2; sees v1 & v0 → picks v1 (newer)" }
  ],
  "speed": 1000
}
\`\`\`

- **Pros**: No single point of failure; highest write availability.
- **Cons**: Client logic heavier; needs conflict resolution (last-writer-wins, vector clocks).

## Consistency Models

### Strong Consistency (Linearizable)

Once a write succeeds, **every subsequent read**—from any node—returns that value. The system behaves like a single, instantaneous copy.

- **Cost**: Higher latency (must wait for replicas) and lower availability during network partitions.

### Eventual Consistency

Replicas **converge over time**; reads may return stale data for a short window (usually ms–s).

- **Cost**: Application must tolerate staleness; simpler to scale globally.

### Causal Consistency

Operations that are **causally related** (happens-before) appear in the same order to all nodes. Concurrent operations may appear in different orders.

**Example**:  
If user A posts, then user B replies, every node sees the post before the reply. Two unrelated posts can appear in different orders on different nodes.

\`\`\`quiz
{
  "title": "Pick the Right Model",
  "questions": [
    {
      "question": "A global bank ledger requires every balance read to reflect the latest deposit. Which consistency model fits best?",
      "options": ["Eventual", "Causal", "Strong"],
      "answer": 2,
      "explanation": "Financial correctness demands the latest value always; strong consistency guarantees that."
    },
    {
      "question": "Social-media ‘like’ counts can briefly lag behind actual counts. Which model is acceptable?",
      "options": ["Strong", "Eventual", "Linearizable"],
      "answer": 1,
      "explanation": "Likes are low-risk; eventual consistency gives lower latency and higher throughput."
    },
    {
      "question": "In a leaderless system with N=5, which (W,R) pair guarantees you always read the latest write?",
      "options": ["W=3,R=3", "W=2,R=2", "W=1,R=5"],
      "answer": 0,
      "explanation": "W+R>N (3+3>5) ensures the read quorum overlaps at least one node that has the latest write."
    }
  ]
}
\`\`\`

## Tuning Consistency with Quorum

Configure **W** (write acknowledgments), **R** (read responses), and **N** (total replicas) to slide along the consistency-availability spectrum.

| Rule | Effect |
|------|--------|
| \`W + R > N\` | **Strong** read guarantee (overlap) |
| \`W < N\` | **Tolerate** some failed nodes on write |
| \`R < N\` | **Tolerate** some failed nodes on read |

Common patterns:

- \`N=3, W=2, R=2\` — Balanced: survives 1 node loss, strong reads.
- \`N=3, W=1, R=1\` — Maximum availability, eventual consistency.
- \`N=3, W=3, R=1\` — Durable writes, fast reads, but writes fail if any node is down.

\`\`\`steps
{
  "title": "Designing a Multi-Region Catalog",
  "steps": [
    {
      "title": "1. Identify access pattern",
      "content": "70% reads, 30% writes; users in US, EU, APAC; stale inventory is acceptable for minutes."
    },
    {
      "title": "2. Pick topology",
      "content": "Multi-leader: each region has a leader for local low-latency writes; leaders async-replicate to each other."
    },
    {
      "title": "3. Choose consistency",
      "content": "Eventual consistency inside region; causal consistency across regions (vector-clock metadata) so ‘add to cart’ always precedes ‘checkout’."
    },
    {
      "title": "4. Set quorum (inside region)",
      "content": "N=3, W=2, R=2 → survive 1 node loss, strong local reads; cross-region replication is asynchronous."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Leader-follower is simplest but creates a write bottleneck; leaderless trades simplicity for high availability.",
    "Strong consistency gives single-copy illusion yet costs latency and partition tolerance; eventual consistency favors uptime and speed.",
    "Quorum math (W+R>N) lets you tune read/write guarantees per operation, not per system.",
    "Multi-leader replication is essential for geo-local writes but demands explicit conflict resolution.",
    "Match replication + consistency choices to user expectations: financial ledgers need strong, social likes can be eventual."
  ]
}
\`\`\``,
    },
  ],
};
