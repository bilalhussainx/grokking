import { Module } from "../types";

export const keyConceptsModule: Module = {
  id: "sd-key-concepts",
  title: "Key Concepts in Distributed Systems",
  description:
    "Essential distributed systems theory: CAP theorem, consistent hashing, message queues, sharding, and replication.",
  lessons: [
    {
      id: "sd-kc-1",
      slug: "cap-theorem",
      title: "CAP Theorem",
      content: `# CAP Theorem

The CAP theorem, proposed by Eric Brewer in 2000, states that a distributed data store can provide at most **two out of three** guarantees simultaneously:

- **Consistency (C):** Every read receives the most recent write or an error. All nodes see the same data at the same time.
- **Availability (A):** Every request receives a non-error response, even if it might not contain the most recent write.
- **Partition Tolerance (P):** The system continues to operate despite network partitions (messages being dropped or delayed between nodes).

## Why You Cannot Have All Three

In any distributed system, network partitions **will** happen — cables get cut, switches fail, data centers lose connectivity. Since partitions are unavoidable, you must choose between consistency and availability when a partition occurs.

\`\`\`mermaid
graph TD
    CAP[CAP Theorem] --- C[Consistency]
    CAP --- A[Availability]
    CAP --- P[Partition Tolerance]
    C ---|CA: Single node only| A
    C ---|CP: Rejects reads during partition| P
    A ---|AP: Serves stale data during partition| P
\`\`\`

\`\`\`
        ┌──────────────┐
        │   Choose 2   │
        └──────┬───────┘
    ┌──────────┼──────────┐
    ▼          ▼          ▼
   C+A        C+P        A+P
  (single    (rejects   (serves
  node only)  reads      stale
              during     data
              partition) during
                         partition)
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

## Beyond the Binary

In practice, CAP is not a permanent, system-wide toggle. Modern systems make **per-operation** trade-offs:
- A database might offer strong consistency for writes but eventual consistency for reads.
- You can tune consistency levels per query (e.g., Cassandra's \`QUORUM\` vs \`ONE\`).

The PACELC extension adds nuance: even when there is **no partition (E)**, you still trade off between **latency (L)** and **consistency (C)**.

## Key Takeaways

- CAP theorem says: during a network partition, you must choose between consistency and availability.
- Network partitions are inevitable in distributed systems, so the real choice is CP vs AP.
- CP systems reject requests during partitions to maintain correctness.
- AP systems serve requests during partitions at the cost of potentially stale data.
- Modern systems often allow per-query consistency tuning rather than a single global setting.
`,
    },
    {
      id: "sd-kc-2",
      slug: "consistent-hashing",
      title: "Consistent Hashing",
      content: `# Consistent Hashing

When you distribute data across multiple servers, you need a way to decide which server holds which data. Naive approaches like \`server = hash(key) % N\` break badly when servers are added or removed — nearly all keys get reassigned, causing massive cache misses or data migration.

**Consistent hashing** solves this by minimizing the number of keys that move when the server pool changes.

## The Hash Ring

Imagine a circular number line (a ring) from 0 to 2^32 - 1. Both servers and data keys are hashed onto this ring.

\`\`\`
            0
            │
     S3 ●───┼───● K1
        /   │    \\
       /    │     \\
      /     │      \\
  K3 ●      │      ● S1
      \\     │     /
       \\    │    /
        \\   │   /
     K2 ●───┼──● S2
            │
          2^32
\`\`\`

**Rule:** Each key is assigned to the **first server encountered when walking clockwise** from the key's position on the ring.

In the diagram above:
- K1 → S1 (walking clockwise from K1, S1 is the first server)
- K2 → S3 (walking clockwise from K2, S3 is next)
- K3 → S3

## Adding or Removing a Server

When you add server S4 between S2 and S3, only the keys in that arc move to S4. All other keys stay where they are. On average, only \`K/N\` keys move (where K is total keys and N is total servers), compared to nearly all keys moving with modular hashing.

## Virtual Nodes

With only a few physical servers, the ring can become unbalanced — one server may own a much larger arc than others. **Virtual nodes** fix this: each physical server is mapped to multiple positions on the ring.

\`\`\`
Physical Server A → positions: A0, A1, A2, A3
Physical Server B → positions: B0, B1, B2, B3
Physical Server C → positions: C0, C1, C2, C3
\`\`\`

With many virtual nodes spread around the ring, each physical server owns roughly equal portions of the key space, even if the number of physical servers is small.

A common choice is 100-200 virtual nodes per physical server.

## Where Consistent Hashing Is Used

- **Distributed caches** (Memcached, Redis cluster) — route keys to the right cache node.
- **Distributed databases** (Cassandra, DynamoDB) — determine which node owns a partition.
- **CDNs** — route content requests to the nearest or least-loaded edge server.
- **Load balancers** — sticky sessions based on client IP hash.

## Comparison with Modular Hashing

| Scenario | Modular Hashing | Consistent Hashing |
|----------|----------------|-------------------|
| Add 1 server to pool of 10 | ~90% keys move | ~10% keys move |
| Remove 1 server from pool of 10 | ~90% keys move | ~10% keys move |
| Implementation complexity | Trivial | Moderate |

## Key Takeaways

- Consistent hashing maps both keys and servers onto a ring, assigning each key to the nearest clockwise server.
- Adding or removing a server only affects a small fraction of keys.
- Virtual nodes ensure even distribution across physical servers.
- This technique is foundational to distributed caches, databases, and CDNs.
`,
    },
    {
      id: "sd-kc-3",
      slug: "message-queues-and-event-streaming",
      title: "Message Queues & Event Streaming",
      content: `# Message Queues & Event Streaming

Not every operation needs to happen synchronously. When a user uploads a photo, you do not need to generate thumbnails, run content moderation, and update the search index before returning a response. **Message queues** let you decouple producers from consumers and process work asynchronously.

## Core Concepts

**Producer:** The component that sends messages (e.g., the upload service).
**Consumer:** The component that receives and processes messages (e.g., the thumbnail generator).
**Queue/Topic:** The buffer that holds messages between producers and consumers.

\`\`\`
┌──────────┐     ┌─────────┐     ┌──────────┐
│ Producer │────▶│  Queue  │────▶│ Consumer │
└──────────┘     └─────────┘     └──────────┘
\`\`\`

## Point-to-Point vs Pub/Sub

**Point-to-Point (Queue):**
Each message is consumed by exactly **one** consumer. Good for task distribution — e.g., a pool of workers processing jobs. Examples: RabbitMQ (default mode), Amazon SQS.

**Publish/Subscribe (Topic):**
Each message is delivered to **all** subscribers. Good for event broadcasting — e.g., a new order triggers notifications, analytics, and inventory updates simultaneously. Examples: Apache Kafka topics, Amazon SNS, Google Pub/Sub.

\`\`\`
                  ┌────────────┐
              ┌──▶│ Consumer A │  (notifications)
┌──────────┐  │   └────────────┘
│ Producer │──┤
└──────────┘  │   ┌────────────┐
              ├──▶│ Consumer B │  (analytics)
              │   └────────────┘
              │   ┌────────────┐
              └──▶│ Consumer C │  (inventory)
                  └────────────┘
\`\`\`

## Apache Kafka — Key Concepts

Kafka is the most widely used event streaming platform. Key ideas:

- **Topics** are divided into **partitions**. Each partition is an ordered, append-only log.
- **Consumer groups** allow parallel consumption: each partition is consumed by exactly one consumer within a group.
- **Offsets** track each consumer's position in a partition. Consumers can replay events by resetting their offset.
- **Retention:** Kafka retains messages for a configurable period (e.g., 7 days), unlike traditional queues that delete messages after consumption.

This makes Kafka suitable for both real-time streaming and event replay/reprocessing.

## When to Use Asynchronous Processing

| Use Case | Why Async? |
|----------|-----------|
| Email/SMS notifications | User should not wait for delivery |
| Image/video processing | CPU-intensive; do it in background |
| Search index updates | Slight delay is acceptable |
| Analytics event ingestion | Fire and forget |
| Order processing pipeline | Multiple steps with different SLAs |

## Delivery Guarantees

- **At-most-once:** Messages may be lost but are never delivered twice. Fast, but risky.
- **At-least-once:** Messages are never lost but may be delivered more than once. Most common. Consumers must be **idempotent** (safe to process the same message twice).
- **Exactly-once:** Messages are delivered exactly once. Hard to achieve; Kafka supports it within its ecosystem using transactional producers and consumers.

## Key Takeaways

- Message queues decouple producers from consumers and enable asynchronous processing.
- Point-to-point queues distribute work; pub/sub topics broadcast events.
- Kafka provides durable, replayable event logs with partitioned parallelism.
- Design consumers to be idempotent — at-least-once delivery is the practical default.
- Async processing improves user-perceived latency and system resilience.
`,
    },
    {
      id: "sd-kc-4",
      slug: "database-sharding-and-partitioning",
      title: "Database Sharding & Partitioning",
      content: `# Database Sharding & Partitioning

When a single database server can no longer handle the load or store all the data, you split the data across multiple servers. This is **sharding** (also called horizontal partitioning).

## Vertical vs Horizontal Partitioning

**Vertical partitioning:** Split a table by columns. For example, store user profile data in one database and user activity logs in another. This is really about separating concerns into different services.

**Horizontal partitioning (sharding):** Split a table by rows. For example, users with IDs 1-1,000,000 go to Shard 1, users 1,000,001-2,000,000 go to Shard 2, and so on.

\`\`\`
          Full Users Table
  ┌──────────────────────────┐
  │  ID  │ Name  │  Email    │
  │──────│───────│───────────│
  │  1   │ Alice │ a@...     │
  │  2   │ Bob   │ b@...     │
  │  ... │ ...   │ ...       │
  │  2M  │ Zara  │ z@...     │
  └──────────────────────────┘
              │
     ┌────────┴────────┐
     ▼                 ▼
  Shard 1           Shard 2
  (IDs 1-1M)       (IDs 1M+1-2M)
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

## Rebalancing

Over time, shards become uneven. New users cluster on certain shards, or some users generate far more data than others. **Rebalancing** moves data between shards to restore balance.

Approaches:
- **Fixed partitioning:** Pre-create many more partitions than servers (e.g., 1000 partitions across 10 servers). When adding a server, move whole partitions to the new server.
- **Dynamic splitting:** Split a hot partition into two when it exceeds a size threshold.
- **Consistent hashing:** As discussed in the previous lesson, adding a node only moves a fraction of keys.

## Challenges of Sharding

1. **Cross-shard queries:** JOINs across shards are slow and complex. Design your data model to avoid them.
2. **Distributed transactions:** ACID transactions across shards require two-phase commit or similar protocols, which add latency and complexity.
3. **Operational complexity:** Backups, schema migrations, and monitoring multiply by the number of shards.
4. **Rebalancing downtime:** Moving data between shards can temporarily increase latency.

## When to Shard

Sharding is a last resort, not a first step. Before sharding, try:
1. Vertical scaling (bigger machine)
2. Read replicas (offload reads)
3. Caching (reduce database hits)
4. Query optimization and indexing

If you have exhausted these and still cannot meet your performance or storage needs, then shard.

## Key Takeaways

- Sharding splits data across multiple database servers by rows.
- The shard key determines distribution and must be chosen to match your query patterns.
- Cross-shard queries and distributed transactions are the biggest pain points.
- Pre-create more partitions than you need to simplify future rebalancing.
- Exhaust simpler scaling options before resorting to sharding.
`,
    },
    {
      id: "sd-kc-5",
      slug: "replication-and-consistency-models",
      title: "Replication & Consistency Models",
      content: `# Replication & Consistency Models

**Replication** means keeping copies of the same data on multiple machines. It serves two purposes: **fault tolerance** (if one machine dies, others have the data) and **performance** (spread read traffic across replicas).

## Replication Topologies

### Leader-Follower (Primary-Secondary)

One node (the leader) accepts all writes. Followers replicate the leader's write log and serve reads.

\`\`\`
  Writes ──▶ ┌────────┐
             │ Leader │
             └───┬────┘
          ┌──────┼──────┐
          ▼      ▼      ▼
     ┌────────┐┌────────┐┌────────┐
     │Follow 1││Follow 2││Follow 3│  ◀── Reads
     └────────┘└────────┘└────────┘
\`\`\`

**Pros:** Simple, well-understood. Strong consistency for reads from the leader.
**Cons:** Leader is a write bottleneck and single point of failure (until failover). Reads from followers may be stale.

### Multi-Leader

Multiple nodes accept writes. Each leader replicates to the others. Used in multi-data-center setups where you want local write capability in each region.

**Pros:** Low write latency in each region. Tolerates entire data center outages.
**Cons:** Write conflicts are possible (two leaders modify the same row). Conflict resolution adds complexity.

### Leaderless (Dynamo-style)

Any node can accept reads and writes. The client sends writes to multiple nodes simultaneously and reads from multiple nodes, using quorum rules to determine the correct value.

**Pros:** No single point of failure. High availability.
**Cons:** Requires conflict resolution (last-writer-wins, vector clocks, CRDTs). More complex client logic.

## Consistency Models

### Strong Consistency
After a write completes, every subsequent read (from any node) returns that value. The system behaves as if there is only one copy of the data.

**Cost:** Higher latency (writes must propagate before reads are served). Lower availability during partitions.

### Eventual Consistency
After a write, replicas will **eventually** converge to the same value, but reads in the interim may return stale data. The "eventually" is typically milliseconds to seconds.

**Cost:** Application must tolerate stale reads. Simpler to implement at scale.

### Causal Consistency
Operations that are causally related are seen in the same order by all nodes. Concurrent operations (no causal link) may be seen in different orders.

**Example:** If user A posts a message, then user B replies, every node sees the post before the reply. But two unrelated posts may appear in different orders on different nodes.

## Quorum Reads and Writes

In leaderless systems, you configure:
- **W:** Number of nodes that must acknowledge a write.
- **R:** Number of nodes that must respond to a read.
- **N:** Total number of replicas.

**Rule:** If \`W + R > N\`, reads and writes overlap on at least one node, guaranteeing you read the latest write.

Common configurations:
- \`N=3, W=2, R=2\` — good balance of consistency and availability.
- \`N=3, W=1, R=1\` — high availability, eventual consistency.
- \`N=3, W=3, R=1\` — strong write durability, fast reads.

## Key Takeaways

- Leader-follower is simplest but has a write bottleneck; leaderless offers high availability at the cost of complexity.
- Strong consistency means every read sees the latest write; eventual consistency allows temporary staleness.
- Quorum rules (\`W + R > N\`) let you tune the consistency-availability trade-off per operation.
- Multi-leader replication is essential for multi-region deployments but introduces write conflicts.
- Choose your replication and consistency model based on your tolerance for stale reads and your availability requirements.
`,
    },
  ],
};
