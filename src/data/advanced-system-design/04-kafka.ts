import { Module } from "../types";

export const kafkaModule: Module = {
  id: "design-kafka",
  title: "Designing Apache Kafka",
  description: "Deep dive into Kafka's architecture: topics, partitions, consumer groups, log-structured storage, replication with leader election, and exactly-once semantics.",
  lessons: [
    {
      id: "kafka-requirements",
      slug: "kafka-requirements",
      title: "Kafka: Requirements & Motivation",
      content: `# Kafka: Requirements & Motivation

Apache Kafka was originally developed at LinkedIn in 2011 to handle a massive stream of activity events — page views, ad impressions, searches, and profile updates. Traditional message queues like RabbitMQ and ActiveMQ could not keep pace with LinkedIn's throughput demands, which created a forcing function to rethink messaging from first principles.

\`\`\`concept
{
  "title": "The Log Is the Database",
  "variant": "mental-model",
  "content": "Kafka treats a message stream as an immutable, append-only log — the same structure databases use for write-ahead logs (WAL). This single insight changes everything: the broker never needs to track per-message ACKs, consumers control their own position (offset), and any consumer can replay history by seeking backwards. The log IS the source of truth."
}
\`\`\`

## The Problem LinkedIn Faced

LinkedIn needed to simultaneously solve four hard problems that traditional queues handle poorly in combination:

- Ingest **millions of events per second** from hundreds of services without a bottleneck
- Fan out events to **multiple independent consumers** (real-time analytics, search indexing, data warehousing) without duplicating ingestion infrastructure
- **Retain data for days** — not just until consumed — so consumers can reprocess on schema changes or catch up after outages
- Absorb **bursty traffic** without backpressure collapsing upstream services

\`\`\`callout
{
  "type": "info",
  "title": "Why Traditional Queues Fall Short",
  "content": "Traditional message brokers delete messages after they are consumed, track per-message ACK state on the broker, and push messages to consumers. Each of these choices caps throughput and prevents replay. Kafka inverts all three."
}
\`\`\`

## Requirements

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Functional",
      "icon": "⚙️",
      "content": "1. **Publish** messages to named topics\\n2. **Subscribe** to topics and consume messages in offset order\\n3. **Replay** messages from any offset — not just the latest\\n4. Support **multiple independent consumer groups** reading the same topic at different speeds\\n5. Guarantee **ordering within a partition**\\n6. Allow configurable **message retention** (hours, days, or indefinite)"
    },
    {
      "label": "Non-Functional",
      "icon": "📊",
      "content": "| Requirement | Target |\\n|-------------|--------|\\n| Throughput | Millions of messages/sec per cluster |\\n| Latency | < 10 ms for produce acknowledgment |\\n| Durability | No data loss for acknowledged writes |\\n| Retention | Configurable: hours, days, or forever |\\n| Scalability | Add brokers without downtime |\\n| Availability | Tolerate broker failures without data loss |"
    },
    {
      "label": "Design Principles",
      "icon": "🏛️",
      "content": "**Log-Centric** — The log is the database; events are never mutated after write\\n\\n**Pull-Based** — Consumers pull at their own pace; the broker never pushes\\n\\n**Partitioned** — Parallelism scales linearly with partition count\\n\\n**Replicated** — Every partition has multiple copies across different brokers\\n\\n**Sequential I/O** — Append-only writes and sequential reads saturate disk bandwidth rather than seeking"
    }
  ]
}
\`\`\`

## Kafka vs. Traditional Message Queues

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Traditional MQ (RabbitMQ / ActiveMQ)",
    "code": "Delivery model:   Push to consumers\\nMessage lifetime: Deleted after consumption\\nOrdering:         Per-queue (global)\\nConsumer tracking: Broker tracks per-message ACKs\\nThroughput:       ~10K msg/sec typical\\nReplay:           Not supported — gone once consumed\\nScaling:          Add queues; coordination overhead grows"
  },
  "after": {
    "label": "Apache Kafka",
    "code": "Delivery model:   Pull by consumers (each at own offset)\\nMessage lifetime: Retained by time/size policy\\nOrdering:         Guaranteed within a partition\\nConsumer tracking: Consumer owns its offset (stored in __consumer_offsets)\\nThroughput:       ~1M+ msg/sec per cluster\\nReplay:           Seek to any offset at any time\\nScaling:          Add brokers + partitions; zero downtime"
  }
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "The Key Asymmetry",
  "content": "Because consumers track their own offset (not the broker), Kafka's broker complexity stays flat regardless of consumer count. A traditional broker grows more complex with every additional consumer it must track. This is why Kafka can support thousands of consumers on one topic with no throughput penalty."
}
\`\`\`

## Kafka Ecosystem Architecture

\`\`\`sysdiag
{
  "title": "Kafka Ecosystem Overview",
  "width": 680,
  "height": 380,
  "nodes": [
    { "id": "prod", "label": "Producers\\n(Apps / IoT / Logs)", "x": 80, "y": 180, "kind": "client" },
    { "id": "b1", "label": "Broker 1", "x": 280, "y": 100, "kind": "service" },
    { "id": "b2", "label": "Broker 2", "x": 280, "y": 190, "kind": "service" },
    { "id": "b3", "label": "Broker 3", "x": 280, "y": 280, "kind": "service" },
    { "id": "kraft", "label": "KRaft\\nController Quorum", "x": 280, "y": 360, "kind": "store" },
    { "id": "cons", "label": "Consumers\\n(Consumer Groups)", "x": 490, "y": 180, "kind": "client" },
    { "id": "kconn", "label": "Kafka Connect\\n(source / sink)", "x": 600, "y": 100, "kind": "service" },
    { "id": "ks", "label": "Kafka Streams\\n(stream processing)", "x": 600, "y": 280, "kind": "service" }
  ],
  "edges": [
    { "from": "prod", "to": "b1", "label": "produce" },
    { "from": "prod", "to": "b2", "label": "" },
    { "from": "prod", "to": "b3", "label": "" },
    { "from": "b1", "to": "cons", "label": "poll" },
    { "from": "b2", "to": "cons", "label": "" },
    { "from": "b3", "to": "cons", "label": "" },
    { "from": "cons", "to": "kconn", "label": "" },
    { "from": "cons", "to": "ks", "label": "" },
    { "from": "kraft", "to": "b1", "label": "leader election" },
    { "from": "kraft", "to": "b2", "label": "" },
    { "from": "kraft", "to": "b3", "label": "" }
  ],
  "annotations": {
    "prod": "Any process that writes events. Producers choose a target topic and optionally a partition key for ordering.",
    "b1": "Brokers store partition replicas on disk. Each partition has exactly one leader broker handling reads/writes at any moment.",
    "kraft": "KRaft (Kafka Raft) replaced ZooKeeper as of Kafka 3.x, managing metadata and partition leader elections internally.",
    "cons": "Consumer groups share the partition workload. Each partition is assigned to exactly one consumer per group, enabling parallelism.",
    "kconn": "Kafka Connect integrates Kafka with external systems (databases, S3, Elasticsearch) via pre-built or custom connectors.",
    "ks": "Kafka Streams is a Java library for building stateful stream-processing applications that read from and write back to Kafka."
  }
}
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: Why Sequential I/O Matters So Much",
  "content": "Modern disks (and even SSDs) have dramatically higher sequential throughput than random-access throughput. A spinning disk that delivers ~100 MB/s sequential can drop to ~1 MB/s for random 4K writes. Kafka's append-only log structure means **every write is sequential** — the OS page cache is primed with exactly the data consumers will read next, enabling zero-copy transfers (sendfile syscall) where data moves from page cache directly to the network socket without passing through user space. This is a primary reason Kafka sustains millions of messages per second on commodity hardware while a traditional MQ with per-message random-write ACK tables saturates far earlier."
}
\`\`\`

## Knowledge Check

\`\`\`quiz
{
  "title": "Kafka Requirements & Motivation",
  "questions": [
    {
      "question": "Which design choice most directly enables Kafka to support message replay?",
      "options": [
        "Push-based delivery to consumers",
        "Broker-tracked per-message ACKs",
        "Append-only log with consumer-managed offsets",
        "Synchronous replication to all followers"
      ],
      "answer": 2,
      "explanation": "Because messages are retained in an immutable, append-only log and consumers track their own read position (offset), any consumer can seek to an earlier offset and re-read messages. Traditional queues delete messages post-consumption, making replay impossible."
    },
    {
      "question": "In Kafka's architecture, who is responsible for tracking how far along a topic a consumer has read?",
      "options": [
        "The Kafka broker, in a per-topic ACK table",
        "The producer, via delivery receipts",
        "The consumer itself, via its stored offset",
        "ZooKeeper / KRaft, via the controller quorum"
      ],
      "answer": 2,
      "explanation": "Consumers own their offset — stored in the internal __consumer_offsets topic. This removes per-consumer state from the broker, keeping broker complexity flat regardless of how many consumers subscribe."
    },
    {
      "question": "Kafka guarantees message ordering:",
      "options": [
        "Globally across all topics in a cluster",
        "Globally within a single topic",
        "Only within a single partition",
        "Only when using a single broker"
      ],
      "answer": 2,
      "explanation": "Ordering is guaranteed within a partition only. A topic with multiple partitions provides parallelism at the cost of cross-partition ordering. Producers use a consistent partition key (e.g., userId) when strict ordering for a logical entity is required."
    },
    {
      "question": "KRaft (introduced to replace ZooKeeper) is responsible for:",
      "options": [
        "Storing event payloads on disk",
        "Managing metadata, partition leadership, and controller quorum elections",
        "Routing producer writes to the correct consumer group",
        "Compressing log segments before writing to disk"
      ],
      "answer": 1,
      "explanation": "KRaft is Kafka's built-in consensus mechanism. It manages cluster metadata, topic creation, partition leadership assignments, and leader elections — tasks previously handled by an external ZooKeeper ensemble."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Kafka was born at LinkedIn (2011) to solve million-event-per-second ingestion that traditional message queues could not handle.",
    "The core insight: treat the message stream as an immutable, append-only log — the broker never deletes messages, consumers control their own offset, and replay is always possible.",
    "Pull-based consumption (consumers poll at their own pace) decouples producer throughput from consumer speed and eliminates broker-side per-message ACK tracking.",
    "Parallelism and throughput scale by adding partitions; fault tolerance scales by increasing the replication factor — these two knobs are independent.",
    "KRaft replaced ZooKeeper as the coordination layer in modern Kafka deployments, managing leader elections and metadata internally."
  ]
}
\`\`\``,
    },
    {
      id: "kafka-topics-partitions",
      slug: "kafka-topics-partitions",
      title: "Topics, Partitions & Consumer Groups",
      content: `# Topics, Partitions & Consumer Groups

Kafka's core abstraction is the **topic** — a named, append-only stream of immutable messages. Topics are split into **partitions** for parallelism, and **consumer groups** enable scalable, fault-tolerant consumption. Understanding how these three concepts compose is the key to reasoning about Kafka's throughput, ordering guarantees, and failure modes.

## Topics

A topic is a logical category for messages. Producers write to topics; consumers read from topics. Topics are **append-only**: once a message is written, it cannot be modified. Each message gets an **offset** — a monotonically increasing integer that uniquely identifies it within its partition.

\`\`\`concept
{ "title": "Topics as Immutable Logs", "variant": "mental-model", "content": "Think of a Kafka topic like a ledger book: you can only append new entries, never erase or edit old ones. Every entry has a sequential number (the offset). Consumers use that number as a durable bookmark — they can re-read history by seeking back to an earlier offset, enabling both real-time streaming and batch reprocessing from the same data." }
\`\`\`

## Partitions

A topic is divided into one or more **partitions**. Each partition is an independent, ordered, append-only log stored on one broker (the leader), with copies on follower brokers. Partitions are the unit of both **storage** and **parallelism** — without multiple partitions, a topic could only be consumed by a single consumer instance effectively.

\`\`\`algoviz
{ "title": "Key-Based Routing: hash(key) % num_partitions", "type": "array", "data": [0, 0, 0], "frames": [ { "highlight": [0], "label": "msg0 (key='carol'): hash('carol') % 3 = 0 → Partition 0", "stats": { "key": "carol", "target": "P0" } }, { "highlight": [1], "label": "msg1 (key='bob'): hash('bob') % 3 = 1 → Partition 1", "stats": { "key": "bob", "target": "P1" } }, { "highlight": [2], "label": "msg2 (key='alice'): hash('alice') % 3 = 2 → Partition 2", "stats": { "key": "alice", "target": "P2" } }, { "highlight": [0], "label": "msg3 (key='carol'): hash('carol') % 3 = 0 → Partition 0 again — carol stays in order", "stats": { "key": "carol", "target": "P0" } }, { "highlight": [0, 1, 2], "label": "Final state: P0=2 msgs, P1=1 msg, P2=1 msg. All of carol's events are ordered within P0.", "stats": { "P0_msgs": 2, "P1_msgs": 1, "P2_msgs": 1 } } ], "speed": 900 }
\`\`\`

### Partition Key Routing

Producers choose which partition a message goes to using one of two strategies:

| Strategy | Mechanism | When to use |
|----------|-----------|-------------|
| **No key** | Round-robin across partitions | Maximum even distribution; ordering irrelevant |
| **With key** | \`hash(key) % num_partitions\` | All events for the same entity (user, order) must stay ordered |

\`\`\`concept
{ "title": "Ordering Guarantee Scope", "variant": "rule", "content": "Kafka guarantees ordering **within a partition only**. If you need all events for a given user to be processed in sequence, use the user ID as the partition key. Events with different keys may land on different partitions and will be processed in interleaved, unpredictable order relative to each other." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Increasing Partition Count Breaks Key Routing", "content": "Partition routing uses \`hash(key) % num_partitions\`. If you increase the partition count after data is written, the modulo changes — 'alice' that went to P1 with 3 partitions may now route to P4 with 8 partitions. This breaks ordering continuity for existing key-based consumers. Plan your partition count upfront; it is effectively immutable once data flows through." }
\`\`\`

## Consumer Groups

A **consumer group** is a coordinated set of consumers that share the workload of consuming a topic. The fundamental rule: **each partition is assigned to exactly one consumer within a group at a time**. This prevents duplicate processing while enabling horizontal scaling.

\`\`\`tabs
{ "tabs": [ { "label": "2 Consumers (Uneven)", "icon": "⚡", "content": "**3 partitions, 2 consumers**\\n\\n| Partition | Assigned To |\\n|-----------|-------------|\\n| P0 | Consumer A |\\n| P1 | Consumer A |\\n| P2 | Consumer B |\\n\\nConsumer A handles 2 partitions — more load than B. Kafka distributes as evenly as possible, but perfect balance requires consumers ≥ partitions. Still provides parallelism." }, { "label": "3 Consumers (Ideal)", "icon": "✅", "content": "**3 partitions, 3 consumers**\\n\\n| Partition | Assigned To |\\n|-----------|-------------|\\n| P0 | Consumer A |\\n| P1 | Consumer B |\\n| P2 | Consumer C |\\n\\nPerfect 1:1 mapping — maximum throughput for this group. Each consumer processes one independent partition with no coordination overhead." }, { "label": "4 Consumers (Over-provisioned)", "icon": "⚠️", "content": "**3 partitions, 4 consumers**\\n\\n| Partition | Assigned To |\\n|-----------|-------------|\\n| P0 | Consumer A |\\n| P1 | Consumer B |\\n| P2 | Consumer C |\\n| — | Consumer D (IDLE) |\\n\\n**Consumer D sits idle — no partition to consume.** Maximum active parallelism equals the partition count. The extra consumer is standby capacity: if A, B, or C crashes, D is promoted immediately during the next rebalance." } ] }
\`\`\`

### Multiple Consumer Groups

Different consumer groups consume the **same topic completely independently**. Each group maintains its own offset cursor and receives every message. This enables multiple downstream systems — analytics, search indexing, monitoring, audit — to process the same event stream without any coordination or interference.

\`\`\`sysdiag
{ "title": "Two Consumer Groups on One Topic — Independent Fan-Out", "width": 680, "height": 340, "nodes": [ { "id": "p0", "label": "Partition 0", "x": 100, "y": 80, "kind": "queue" }, { "id": "p1", "label": "Partition 1", "x": 100, "y": 170, "kind": "queue" }, { "id": "p2", "label": "Partition 2", "x": 100, "y": 260, "kind": "queue" }, { "id": "a1", "label": "Analytics-C1", "x": 390, "y": 100, "kind": "service" }, { "id": "a2", "label": "Analytics-C2", "x": 390, "y": 220, "kind": "service" }, { "id": "s1", "label": "Search-Indexer", "x": 570, "y": 170, "kind": "service" } ], "edges": [ { "from": "p0", "to": "a1", "label": "group: analytics" }, { "from": "p1", "to": "a1", "label": "group: analytics" }, { "from": "p2", "to": "a2", "label": "group: analytics" }, { "from": "p0", "to": "s1", "label": "group: search" }, { "from": "p1", "to": "s1", "label": "group: search" }, { "from": "p2", "to": "s1", "label": "group: search" } ], "annotations": { "a1": "Reads P0+P1 for the analytics group; commits its own offsets independently", "s1": "Reads all 3 partitions for the search group; zero coordination with analytics" } }
\`\`\`

Both groups receive **all messages**. Each group tracks its own committed offsets in the internal \`__consumer_offsets\` topic — independently and durably.

## Offset Management

Each consumer group tracks its position in each partition as a **committed offset** stored in \`__consumer_offsets\` — a Kafka-internal compacted topic. This makes offset tracking itself distributed and fault-tolerant, benefiting from Kafka's own replication guarantees.

\`\`\`callout
{ "type": "info", "title": "What a Committed Offset Means", "content": "A committed offset of 1042 on Partition 0 means: 'this group has processed all messages up to and including offset 1041 and will next read offset 1042.' It is a durable checkpoint — not a live cursor. When a consumer restarts after a crash, it resumes from the last committed offset, guaranteeing no messages are permanently lost." }
\`\`\`

Consumers have three replay modes:
- **Continue from committed offset** — normal operation, no reprocessing
- **Reset to earliest** — reprocess the full retained topic history from the beginning
- **Seek to specific offset or timestamp** — targeted replay (e.g., re-process the last two hours after a bug fix)

## Rebalancing

When consumer group membership changes — a consumer crashes, a new one joins, or partition count changes — Kafka triggers a **rebalance** to redistribute partition ownership.

\`\`\`steps
{ "title": "Rebalance Triggered by Consumer Crash", "steps": [ { "title": "Consumer C stops sending heartbeats", "content": "Each consumer sends periodic heartbeats to the **group coordinator** broker. When heartbeats stop for longer than \`session.timeout.ms\` (default 45 seconds), the coordinator declares Consumer C dead and removes it from the group." }, { "title": "Coordinator triggers rebalance", "content": "The group coordinator notifies all surviving consumers that a rebalance is starting. During rebalance, **consumption pauses** for the group. This stop-the-world pause is a key latency consideration in production — minimizing rebalance frequency reduces consumer lag spikes." }, { "title": "Partitions are redistributed", "content": "The coordinator (or a consumer-side assignor, depending on configuration) reassigns C's partitions to the remaining consumers A and B using the configured partition assignment strategy: **range**, **round-robin**, or **sticky**." }, { "title": "Consumers resume from last committed offset", "content": "Each consumer resumes reading from the last **committed** offset for its newly assigned partitions. If Consumer C had processed messages without committing offsets, those messages will be **reprocessed** — this is why idempotent consumers matter when at-least-once delivery is in play." } ] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Minimize Rebalance Pauses with the Cooperative Sticky Assignor", "content": "The **Cooperative Sticky Assignor** (available since Kafka 2.4) enables incremental rebalances — only partitions that *need* to move are revoked and reassigned, rather than stopping all consumers simultaneously. For latency-sensitive workloads, this dramatically reduces the pause window and keeps throughput stable during scaling events." }
\`\`\`

\`\`\`quiz
{ "title": "Topics, Partitions & Consumer Groups", "questions": [ { "question": "A topic has 5 partitions and a consumer group has 8 consumers. How many consumers will be idle?", "options": ["0 — Kafka auto-creates additional partitions to match", "3 — maximum active consumers equals partition count", "5 — only partition leaders can be consumed directly", "8 — all consumers must wait for the coordinator to assign"], "answer": 1, "explanation": "Maximum active parallelism within a consumer group equals the partition count. With 5 partitions and 8 consumers, 5 consumers each get one partition and 3 sit idle. The idle consumers act as hot standbys: if an active consumer crashes, one of the idle consumers is promoted immediately via rebalance." }, { "question": "A producer sends messages with key='order-99'. You later increase the partition count from 4 to 8. What happens to new messages with key='order-99'?", "options": ["They continue routing to the same partition as before", "hash('order-99') % 8 may produce a different result than % 4 did", "Kafka automatically migrates all existing messages to the new partition", "The producer raises a PartitionCountMismatch error and pauses"], "answer": 1, "explanation": "Partition routing is hash(key) % num_partitions. Changing num_partitions changes the modulo result — the same key may land on a completely different partition after the increase. This breaks ordering continuity for that key across the partition count change, which is why partition counts should be planned upfront." }, { "question": "Two consumer groups — 'analytics' and 'search-indexer' — both subscribe to the same 3-partition topic. Which statement is true?", "options": ["Messages are split between groups so each message is processed by only one group total", "Both groups receive all messages and track their offsets independently", "The group with lower group-id gets messages first due to coordinator priority", "Groups share a single offset store and must coordinate to avoid double reads"], "answer": 1, "explanation": "Consumer groups consume a topic independently — each group gets every message and maintains its own offset cursor in __consumer_offsets. This publish-subscribe fan-out is how the same event stream can simultaneously power analytics, search, monitoring, and audit pipelines without any group interfering with another." }, { "question": "Where does Kafka store consumer group committed offsets?", "options": ["In a ZooKeeper znode dedicated to each consumer group", "In the __consumer_offsets internal compacted topic on the Kafka cluster", "In each partition's log segment header alongside the message data", "In the application's own database, committed by the consumer on each poll"], "answer": 1, "explanation": "Since Kafka 0.9, committed offsets are stored in __consumer_offsets — a Kafka-internal compacted topic. This removed the ZooKeeper dependency for offset management and means offset tracking benefits from Kafka's own replication and fault-tolerance guarantees." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Topics are append-only, immutable logs — each message has a unique, monotonically increasing offset within its partition.", "Partitions are the unit of parallelism and storage; plan partition count upfront, as increasing it after data flows in disrupts key-based ordering.", "Partition key routing uses hash(key) % num_partitions — same key always lands on the same partition, guaranteeing per-key ordering.", "Within a consumer group, each partition is owned by exactly one consumer at a time — preventing duplicates while enabling horizontal scale.", "Maximum active parallelism for a consumer group equals the partition count; extra consumers sit idle as hot standbys.", "Multiple consumer groups each receive every message and track offsets independently, enabling fan-out to multiple downstream systems with zero coordination." ] }
\`\`\``,
    },
    {
      id: "kafka-replication",
      slug: "kafka-replication-leader-election",
      title: "Replication & Leader Election",
      content: `# Replication & Leader Election

Kafka replicates each partition across multiple brokers so that a single broker failure never causes data loss. Understanding *how* that replication works — and what happens when a leader disappears — is essential for configuring Kafka correctly in production.

\`\`\`concept
{ "title": "The Leader/Follower Contract", "variant": "mental-model", "content": "Every partition has exactly one leader at any moment. All produces and consumes go through the leader — followers exist purely to replicate. When the leader dies, one follower takes over. Reads and writes never split between leader and follower; the tradeoff is simplicity and strong ordering guarantees." }
\`\`\`

## The Replication Topology

Consider \`topic=orders, Partition 0\` with a replication factor of 3 across three brokers:

\`\`\`sysdiag
{
  "title": "Partition 0 — Replication Factor 3",
  "width": 680,
  "height": 280,
  "nodes": [
    { "id": "producer", "label": "Producer", "x": 60,  "y": 140, "kind": "client" },
    { "id": "b1",       "label": "Broker 1\\n[LEADER]",  "x": 240, "y": 140, "kind": "service" },
    { "id": "b2",       "label": "Broker 2\\n[FOLLOWER]","x": 460, "y": 60,  "kind": "service" },
    { "id": "b3",       "label": "Broker 3\\n[FOLLOWER]","x": 460, "y": 220, "kind": "service" }
  ],
  "edges": [
    { "from": "producer", "to": "b1", "label": "write" },
    { "from": "b1", "to": "b2", "label": "replicate" },
    { "from": "b1", "to": "b3", "label": "replicate" }
  ],
  "annotations": {
    "b1": "Handles all reads and writes. Followers continuously fetch from the leader and append to their local log.",
    "b2": "In-Sync Replica (ISR) — fully caught up. Eligible to become leader.",
    "b3": "May be lagging; if it falls behind for more than replica.lag.time.max.ms (default 30s) it is removed from the ISR."
  }
}
\`\`\`

**Core rules (from the Kafka design docs):**
- All reads and writes go to the **leader**.
- Followers continuously fetch from the leader and append to their local log — the logs are identical in offsets and message order.
- Each replica must reside on a **different** broker.
- Leaders are evenly distributed across brokers so no single broker becomes a hotspot.

## In-Sync Replicas (ISR)

The ISR is Kafka's dynamic quorum. Rather than a fixed majority vote (e.g., 2-of-3), Kafka tracks which replicas are actually caught up.

\`\`\`concept
{ "title": "ISR vs. Majority Quorum", "variant": "insight", "content": "Most consensus systems use a fixed majority quorum (N/2 + 1). Kafka instead maintains a dynamic ISR: any replica fully caught up with the leader is in the set. A write is committed only when every ISR member acknowledges it. This lets Kafka tolerate f failures with f+1 replicas — the same resilience as majority quorum but with better throughput when replicas are healthy." }
\`\`\`

ISR membership is dynamic:

| Event | Effect on ISR |
|---|---|
| Follower catches up to leader | Added to ISR |
| Follower lags > \`replica.lag.time.max.ms\` (30 s default) | Removed from ISR |
| Follower recovers and catches up | Re-added to ISR |

\`\`\`callout
{ "type": "warning", "title": "ISR shrinkage is a durability signal", "content": "When the ISR shrinks to just the leader, \`acks=all\` writes still succeed — but now only one replica holds the data. Monitor \`UnderReplicatedPartitions\` in your Kafka metrics. A sustained non-zero value means your durability guarantees are weaker than configured." }
\`\`\`

## Write Acknowledgment: The \`acks\` Setting

Producers control the durability/latency trade-off with a single config:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "acks=0",
      "icon": "🔥",
      "content": "**Fire and forget.** The producer sends the message and moves on without waiting for any broker acknowledgment.\\n\\n- **Durability:** None — messages can be lost if the broker crashes before writing.\\n- **Latency:** Lowest possible — no round-trip wait.\\n- **Use case:** High-volume telemetry where occasional loss is acceptable (e.g., click-stream analytics)."
    },
    {
      "label": "acks=1",
      "icon": "⚡",
      "content": "**Leader ACK only.** The producer waits for the leader to write the message to its local log.\\n\\n- **Durability:** Partial — if the leader crashes *before* followers replicate, the message is lost.\\n- **Latency:** Low — one network round-trip to the leader.\\n- **Use case:** Default for many workloads; balances throughput and durability."
    },
    {
      "label": "acks=all (-1)",
      "icon": "🔒",
      "content": "**All ISR replicas must ACK.** The producer waits until every in-sync replica has written the message.\\n\\n- **Durability:** Strongest — no data loss for acknowledged writes as long as at least one ISR replica survives.\\n- **Latency:** Highest — must wait for the slowest ISR member.\\n- **Use case:** Financial transactions, order processing, audit logs — anywhere message loss is unacceptable.\\n\\nPair with \`min.insync.replicas=2\`: if fewer than 2 replicas are in-sync, the broker returns a \`NotEnoughReplicasException\` rather than silently weakening durability."
    }
  ]
}
\`\`\`

\`\`\`concept
{ "title": "The min.insync.replicas Safety Net", "variant": "rule", "content": "acks=all alone is not enough. If the ISR shrinks to just the leader, acks=all is satisfied by a single replica. Set min.insync.replicas=2 (with replication factor ≥ 3) so the broker rejects writes when the ISR is too small rather than acknowledging them with insufficient redundancy." }
\`\`\`

## Leader Election

When a leader broker crashes, the Kafka controller must promote a new leader — fast.

\`\`\`steps
{
  "title": "Leader Election Flow",
  "steps": [
    {
      "title": "Broker failure detected",
      "content": "Broker 1 (leader for Partition 0) crashes. The controller — a designated broker managing cluster metadata — detects the failure via a missed heartbeat."
    },
    {
      "title": "Controller inspects the ISR",
      "content": "The controller reads the current ISR for Partition 0: \`{Broker 2, Broker 3}\`. In KRaft mode this is stored in the internal metadata log; in legacy Kafka it was in ZooKeeper.\\n\\nOnly ISR members are eligible for election — they have all committed messages."
    },
    {
      "title": "New leader selected",
      "content": "The controller picks Broker 2 as the new leader (typically the first replica in the ISR list). Because Broker 2 was in-sync, its log is identical to the old leader's committed log — no data loss."
    },
    {
      "title": "Metadata update broadcast",
      "content": "The controller writes the leadership change to the metadata log and notifies all brokers. Brokers update their internal routing tables."
    },
    {
      "title": "Clients discover new leader",
      "content": "Producers and consumers refresh partition metadata on the next request (or after a \`metadata.max.age.ms\` expiry). They then route traffic to Broker 2 automatically — no manual intervention required."
    }
  ]
}
\`\`\`

### Unclean Leader Election

A harder scenario: **every** ISR replica is offline.

\`\`\`callout
{ "type": "danger", "title": "Unclean Election: Availability vs. Durability", "content": "When all ISR replicas are down, Kafka faces a binary choice:\\n\\n**Option A — Wait:** Keep the partition offline until an ISR replica recovers. Guarantees no data loss but may mean extended unavailability.\\n\\n**Option B — Unclean election:** Promote a lagging (non-ISR) replica immediately. Partition becomes available, but messages that were replicated only to the old leader and not to the surviving replica are **permanently lost**.\\n\\nControlled by \`unclean.leader.election.enable\` (default: \`false\`). For most production systems — especially financial or order-processing pipelines — the default of \`false\` is the right call." }
\`\`\`

## KRaft: Replacing ZooKeeper

Traditional Kafka required a separate ZooKeeper ensemble for metadata management and controller elections. Kafka 3.3+ ships **KRaft** (Kafka Raft) as a production-ready replacement.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Traditional (ZooKeeper)",
    "code": "# Two separate clusters to operate\\nKafka Brokers  <-->  ZooKeeper Ensemble\\n\\n# ZooKeeper responsibilities:\\n# - Controller election\\n# - Partition leadership tracking\\n# - Topic/broker metadata\\n# - ISR state\\n\\n# Pain points:\\n# - Separate ops burden (JVM, config, monitoring)\\n# - ZooKeeper scaling limits on partition count\\n# - Slow controller failover (~30-60 s)\\n# - Metadata stored outside Kafka"
  },
  "after": {
    "label": "KRaft (Kafka 3.3+)",
    "code": "# Single cluster, no external dependency\\nKafka Brokers with built-in Raft consensus\\n\\n# Controller quorum among designated nodes:\\n# - Replicated metadata log (Raft)\\n# - Fast leader election (<1 s failover)\\n# - Millions of partitions supported\\n# - Metadata inside Kafka itself\\n\\n# Benefits:\\n# - Simpler ops — one cluster to manage\\n# - Faster failover\\n# - Better horizontal scale"
  }
}
\`\`\`

KRaft designates a subset of brokers as **controllers** that form a Raft quorum. Metadata (topic configs, partition assignments, ISR state) lives in an internal Kafka topic, replicated via the same Raft protocol. No external coordination service is needed.

## Knowledge Check

\`\`\`quiz
{
  "title": "Replication & Leader Election",
  "questions": [
    {
      "question": "A partition has replication factor 3 and acks=all. If one follower falls behind and is removed from the ISR, how many replicas must acknowledge a write for the producer to receive an ACK?",
      "options": [
        "3 — all original replicas must ACK regardless of ISR",
        "2 — the current ISR (leader + remaining in-sync follower)",
        "1 — only the leader, since the ISR shrank",
        "0 — Kafka buffers and retries silently"
      ],
      "answer": 1,
      "explanation": "acks=all means all *current ISR* members must acknowledge. With one replica removed from the ISR, the ISR is now {leader, one follower}, so 2 ACKs are required. This is why min.insync.replicas matters — without it, if the ISR shrinks to just the leader, acks=all is satisfied by a single replica."
    },
    {
      "question": "Which statement best describes why Kafka requires new leaders to come from the ISR?",
      "options": [
        "ISR replicas have lower network latency to producers",
        "ISR replicas hold all *committed* messages, preventing data loss on failover",
        "ISR membership is determined by partition offset, not replication state",
        "Only ISR replicas run the KRaft controller quorum"
      ],
      "answer": 1,
      "explanation": "A write is only considered committed when all ISR members have acknowledged it. Therefore any ISR replica has every committed message — electing it as leader guarantees consumers never see a regression in the committed log."
    },
    {
      "question": "What is the primary operational benefit KRaft provides over the ZooKeeper-based architecture?",
      "options": [
        "KRaft enables producers to bypass the leader and write directly to followers",
        "KRaft removes the need for a separate ZooKeeper cluster, simplifying operations and enabling faster controller failover",
        "KRaft replaces the ISR model with a fixed majority quorum for writes",
        "KRaft allows a partition to have multiple simultaneous leaders for higher throughput"
      ],
      "answer": 1,
      "explanation": "KRaft (Kafka Raft, available production-ready from Kafka 3.3) internalises metadata management using a built-in Raft consensus protocol among designated controller nodes. This eliminates the ZooKeeper ensemble as a separate dependency, speeds up controller failover, and supports far more partitions than ZooKeeper could."
    },
    {
      "question": "A Kafka cluster has \`unclean.leader.election.enable=false\`. The ISR for Partition 0 is {Broker 1, Broker 2}. Both brokers crash simultaneously. What happens?",
      "options": [
        "Broker 3 (a non-ISR follower) is elected leader immediately",
        "Partition 0 becomes unavailable until Broker 1 or Broker 2 recovers",
        "Kafka creates a new empty partition on a healthy broker",
        "The controller re-partitions the topic to exclude Partition 0"
      ],
      "answer": 1,
      "explanation": "With unclean.leader.election.enable=false (the default), Kafka will not elect a lagging non-ISR replica. The partition stays offline — writes return errors and reads are unavailable — until at least one ISR member (Broker 1 or Broker 2) comes back online. This is the correct trade-off when data integrity is more important than uptime."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Every partition has exactly one leader that handles all reads and writes; followers replicate the leader's log and serve as hot standbys.",
    "The ISR (In-Sync Replica set) is Kafka's dynamic quorum — only replicas that are caught up to the leader are members, and only ISR members are eligible to become leader.",
    "acks=all guarantees no data loss for acknowledged writes; pair it with min.insync.replicas≥2 to prevent the ISR from shrinking to a single point of failure.",
    "Leader election is automatic: when a leader fails, the Kafka controller promotes an ISR follower, which already holds all committed messages — no data loss occurs.",
    "Unclean leader election (disabled by default) trades potential message loss for faster recovery; leave it off for any system where data integrity matters.",
    "KRaft (Kafka 3.3+) replaces ZooKeeper with a built-in Raft consensus layer, simplifying operations, speeding up controller failover, and removing external dependencies."
  ]
}
\`\`\``,
    },
    {
      id: "kafka-log-storage",
      slug: "kafka-log-structured-storage",
      title: "Log-Structured Storage Engine",
      content: `# Log-Structured Storage Engine

Kafka's extraordinary throughput — hundreds of MB/sec on commodity hardware — doesn't come from clever caching tricks or exotic hardware. It comes from a single, disciplined design choice: **every partition is an append-only, sequential log on disk**. Understanding this choice explains everything else about Kafka's internals.

\`\`\`concept
{ "title": "The Core Mental Model", "variant": "mental-model", "content": "A Kafka partition is not a database table. It is a physical file you can only write to at the end and read from left to right. This constraint — no random writes, no in-place updates — is what makes Kafka fast. Every design decision in the storage engine flows from this single rule." }
\`\`\`

## The Log Abstraction

Each partition maps to a **directory** on disk. Inside that directory lives a sequence of segment files — each segment is a fixed slice of the log by offset range:

\`\`\`
Partition 0 Directory: /kafka-data/topic-orders-0/

  00000000000000000000.log       (segment 0: offsets 0–999,   IMMUTABLE)
  00000000000000000000.index
  00000000000000000000.timeindex

  00000000000000001000.log       (segment 1: offsets 1000–1999, IMMUTABLE)
  00000000000000001000.index
  00000000000000001000.timeindex

  00000000000000002000.log       (segment 2: offsets 2000–2847, ACTIVE)
  00000000000000002000.index
  00000000000000002000.timeindex
\`\`\`

The filename **is** the base offset. Only the last (active) segment accepts writes. All older segments are sealed and immutable — they will never be modified, only eventually deleted or compacted.

Each \`.log\` segment is packed with **record batches**. A batch groups several records together for compression and write efficiency:

\`\`\`
Record Batch (inside a .log file)
===================================
  baseOffset:        2000
  lastOffsetDelta:   4         → contains offsets 2000–2004
  firstTimestamp:    1713800000000
  maxTimestamp:      1713800000250
  producerId:        10041     → used for exactly-once dedup
  producerEpoch:     3
  baseSequence:      150
  CRC:               0xABCD1234
  compression:       SNAPPY
  records:
    Record 0: key=order-991, value={"status":"paid"}
    Record 1: key=order-992, value={"status":"shipped"}
    ...
\`\`\`

## Why Sequential I/O Dominates

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Random I/O (databases, queues)", "code": "# Each write requires:\\n# 1. Seek to correct page on disk\\n# 2. Read-modify-write that page\\n# 3. Update B-tree index nodes\\n# 4. Write journal/WAL entry\\n\\n# HDD random write throughput: ~100-200 IOPS\\n# At 1KB per message: ~200 KB/sec\\n# B-tree index updates add ~3x amplification" }, "after": { "label": "Sequential I/O (Kafka)", "code": "# Each write:\\n# 1. Append bytes to end of active segment\\n# Done.\\n\\n# HDD sequential write throughput: ~100-200 MB/sec\\n# At 1KB per message: ~100,000 messages/sec\\n# No seek. No index update on write.\\n# 500x throughput advantage over random I/O on HDD." } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "SSD doesn't close the gap as much as you'd think", "content": "SSDs reduce the random vs sequential gap — roughly 100K IOPS random vs 500 MB/s sequential, so about 5x rather than 500x. But sequential I/O still wins on SSDs because it avoids write amplification and wears flash cells more evenly. More importantly, Kafka's design lets the OS page cache absorb writes entirely, so consumers reading recent data never hit the storage layer at all." }
\`\`\`

## Index Files: Fast Offset Lookup Without Scanning

Appending at the end is fast, but consumers need to seek to an arbitrary offset. Scanning the entire log would be O(n). Kafka maintains a **sparse offset index** alongside each segment:

\`\`\`steps
{ "title": "How Kafka resolves offset 2075 to a byte position", "steps": [ { "title": "Consumer requests fetch from offset 2075", "content": "The broker needs to find the physical byte position in the \`.log\` file where offset 2075 lives. It knows from the segment filename that this offset is in segment \`00000000000000002000.log\`." }, { "title": "Load the sparse index into memory", "content": "The \`.index\` file is memory-mapped by the OS. It contains entries like:\\n\\n\`\`\`\\noffset 2000 → byte position 0\\noffset 2050 → byte position 25,600\\noffset 2100 → byte position 51,200\\noffset 2150 → byte position 76,800\\n\`\`\`\\n\\nNot every offset is indexed — just one entry per ~4KB of log data." }, { "title": "Binary search the index", "content": "Binary search finds the largest indexed offset ≤ 2075:\\n\\n\`2050 ≤ 2075 < 2100\`\\n\\nSo: seek to byte position **25,600** in the \`.log\` file." }, { "title": "Scan forward to the exact offset", "content": "Read record batches starting at byte 25,600, advancing forward until the batch containing offset 2075 is found. Because index entries are dense enough (~4KB apart), this scan is at most a few dozen records — effectively O(1)." } ] }
\`\`\`

The index is intentionally sparse. A dense index (every offset → every position) would grow proportionally with the log and require updates on every write. The sparse index stays small enough to memory-map while still bounding the scan to microseconds.

## Zero-Copy Transfer

When a consumer fetches data, Kafka uses the OS \`sendfile()\` syscall instead of reading bytes into application memory:

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Traditional read → send", "code": "# 4 data copies, 2 user/kernel context switches:\\n\\n1. read()  syscall: Disk → Kernel page cache   [copy 1]\\n2. read()  returns: Kernel buffer → JVM heap    [copy 2]\\n           (context switch: kernel → user)\\n3. send()  syscall: JVM heap → Socket buffer    [copy 3]\\n           (context switch: user → kernel)\\n4. NIC DMA: Socket buffer → NIC                 [copy 4]\\n\\n# JVM heap involvement means GC pressure\\n# and limits throughput to ~JVM memory bandwidth" }, "after": { "label": "Zero-copy with sendfile()", "code": "# 2 data copies, 0 user-space involvement:\\n\\n1. sendfile() syscall: Disk → Kernel page cache [copy 1]\\n2. NIC DMA:  Kernel page cache → NIC            [copy 2]\\n             (via scatter-gather DMA on modern NICs)\\n\\n# Data never touches user space\\n# Kafka process is just orchestrating, not moving bytes\\n# For high-throughput consumers: can double NIC utilization" } }
\`\`\`

## Page Cache: The Invisible Accelerator

Kafka does not manage its own memory cache. Instead it relies entirely on the OS **page cache** — and this is intentional:

\`\`\`callout
{ "type": "success", "title": "Why letting the OS cache beats a JVM cache", "content": "**1. No GC pressure.** Data cached in the page cache is outside the JVM heap. A 32GB page cache causes zero garbage collection pauses.\\n\\n**2. Survives broker restart.** JVM heap is gone when the process dies. The OS page cache persists — a restarted broker immediately serves reads from warm cache.\\n\\n**3. Producers and consumers share the cache.** When a producer writes data, it lands in the page cache. A consumer reading that same data milliseconds later gets a cache hit with zero disk I/O.\\n\\n**4. Optimal eviction.** The OS uses LRU-approximation tuned to actual access patterns — more sophisticated than anything Kafka could build in-house." }
\`\`\`

The implication: in the common case where consumers are approximately caught up with producers (tailing the log), **all consumer reads are served from RAM**. Disk I/O only happens when consumers replay old data that has been evicted from the page cache.

## Log Retention and Compaction

Kafka offers three strategies for managing partition size over time:

\`\`\`tabs
{ "tabs": [ { "label": "Time-Based Retention", "icon": "⏱️", "content": "Delete any segment whose **last modified timestamp** is older than a configured threshold.\\n\\n\`\`\`\\nlog.retention.hours=168   # 7 days (default)\\n\`\`\`\\n\\nKafka deletes whole segments (not individual records), so the actual retention is slightly more than the configured threshold — the broker waits until the entire segment has aged out.\\n\\n**Best for:** Event streams, audit logs, any data where freshness matters and old data has no value." }, { "label": "Size-Based Retention", "icon": "📦", "content": "Delete oldest segments when the total partition size exceeds a configured limit.\\n\\n\`\`\`\\nlog.retention.bytes=1073741824  # 1 GB per partition\\n\`\`\`\\n\\nCan be combined with time-based retention — whichever limit is hit first triggers deletion.\\n\\n**Best for:** High-volume topics where storage budget is the constraint, not time." }, { "label": "Log Compaction", "icon": "🗜️", "content": "Instead of deleting by age or size, keep only the **latest value for each key**. Null-value records (tombstones) signal deletion.\\n\\nA background compaction thread merges segments, retaining the highest-offset record per key:\\n\\n\`\`\`\\nBefore compaction:\\n  offset 0:  key=user:42, value={name:\\"Alice\\", plan:\\"free\\"}\\n  offset 1:  key=user:99, value={name:\\"Bob\\",   plan:\\"free\\"}\\n  offset 2:  key=user:42, value={name:\\"Alice\\", plan:\\"pro\\"}   ← update\\n  offset 3:  key=user:55, value={name:\\"Carol\\",  plan:\\"free\\"}\\n  offset 4:  key=user:99, value=null                          ← tombstone\\n\\nAfter compaction:\\n  offset 2:  key=user:42, value={name:\\"Alice\\", plan:\\"pro\\"}\\n  offset 3:  key=user:55, value={name:\\"Carol\\",  plan:\\"free\\"}\\n  (user:99 deleted by tombstone)\\n\`\`\`\\n\\n**Best for:** Change Data Capture (CDC), event sourcing snapshots, any topic representing current state (not a history of events).\\n\\n\`\`\`\\nlog.cleanup.policy=compact\\n\`\`\`" } ] }
\`\`\`

\`\`\`algoviz
{ "title": "Log Compaction: Before and After", "type": "array", "data": ["A:1", "B:2", "A:3", "C:4", "B:∅"], "frames": [ { "highlight": [0, 1, 2, 3, 4], "label": "Initial log — 5 records across 3 keys (A, B, C)", "stats": { "keys": 3, "records": 5 } }, { "highlight": [0, 2], "label": "Key A appears at offsets 0 and 2 — offset 0 is stale", "stats": { "stale": "A:1 (offset 0)", "keep": "A:3 (offset 2)" } }, { "highlight": [1, 4], "label": "Key B appears at offsets 1 and 4 — offset 4 is a tombstone (null value)", "stats": { "stale": "B:2 (offset 1)", "keep": "B:∅ → DELETE" } }, { "highlight": [2, 3], "label": "After compaction: only latest A and C remain. B is deleted.", "stats": { "keys": 2, "records": 2 } } ], "speed": 900 }
\`\`\`

## Knowledge Check

\`\`\`quiz
{ "title": "Log-Structured Storage Engine", "questions": [ { "question": "Why does Kafka only write to the *last* (active) segment while all other segments are immutable?", "options": [ "To allow concurrent writes from multiple producers to the same partition", "To enable sequential-only I/O — appending to one file avoids seeks and random writes entirely", "To simplify replication by reducing the number of files the follower needs to copy", "Because the OS kernel does not support concurrent writes to multiple files" ], "answer": 1, "explanation": "Sealing old segments and only appending to the active segment means all disk writes are sequential. There are no seeks, no in-place updates, and no read-modify-write cycles. This is what lets a single broker sustain hundreds of MB/sec on spinning disk." }, { "question": "A consumer requests offset 2075. The sparse index contains entries for offsets 2050 (position 25,600) and 2100 (position 51,200). What is the correct resolution sequence?", "options": [ "Scan from position 0 in the segment until offset 2075 is found", "Use the entry for offset 2100 and scan backwards to offset 2075", "Seek to position 25,600, then scan forward until offset 2075 is found", "Return a 'not found' error because 2075 has no direct index entry" ], "answer": 2, "explanation": "Binary search finds the largest indexed offset ≤ 2075, which is 2050 at position 25,600. The broker seeks there and scans forward — a short scan because index entries are only ~4KB apart. Scanning backward or from offset 0 would both be slower and unnecessary." }, { "question": "Which retention policy is most appropriate for a topic that stores the current subscription plan for each user ID, where you only ever need the latest state?", "options": [ "Time-based retention with a 7-day window", "Size-based retention with a 1 GB limit per partition", "Log compaction", "No retention — keep all records forever" ], "answer": 2, "explanation": "Log compaction keeps only the latest value per key, which is exactly what you want for current-state topics like user profiles or subscription plans. Time-based and size-based retention would eventually delete the only record for a key, causing data loss. Log compaction uses tombstones (null values) to handle deletions explicitly." }, { "question": "What is the primary advantage of zero-copy transfer (sendfile) over a traditional read/send path for Kafka consumer fetches?", "options": [ "It compresses the data before sending it to reduce network bandwidth", "It eliminates two data copies and avoids moving data through JVM heap, reducing CPU and GC overhead", "It allows multiple consumers to receive the same data simultaneously", "It encrypts the data in transit without requiring SSL/TLS configuration" ], "answer": 1, "explanation": "sendfile() moves data directly from the OS page cache to the NIC via DMA, bypassing user space entirely. The traditional path copies data into the JVM heap (triggering GC) and back out. For high-throughput consumers, eliminating these copies can roughly double usable NIC throughput." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Each partition is an append-only log of immutable segment files — only the active (last) segment accepts writes, which guarantees all I/O is sequential.", "Sequential I/O is ~500x faster than random I/O on spinning disk; this single design choice is the foundation of Kafka's throughput.", "Sparse offset indexes enable O(log n) index lookup followed by a short forward scan — fast offset resolution without per-record index overhead.", "Zero-copy sendfile() bypasses the JVM heap entirely when serving consumer fetches, eliminating two data copies and all GC pressure on the read path.", "OS page cache is Kafka's primary in-memory store — data written by producers is immediately available to consumers from RAM, no disk I/O required for the common tail-read case.", "Log compaction (keep latest value per key) and time/size-based deletion are independent, complementary retention strategies suited to different topic semantics." ] }
\`\`\``,
    },
    {
      id: "kafka-exactly-once",
      slug: "kafka-exactly-once-semantics",
      title: "Exactly-Once Semantics",
      content: `# Exactly-Once Semantics

Message delivery guarantees are one of the hardest problems in distributed systems. Kafka offers three levels: at-most-once, at-least-once, and exactly-once.

## Delivery Guarantees

\`\`\`
Delivery Guarantee Spectrum
============================

At-Most-Once:   Messages may be lost, never duplicated
                 (commit offset BEFORE processing)

At-Least-Once:  Messages never lost, may be duplicated
                 (commit offset AFTER processing)

Exactly-Once:   Messages never lost, never duplicated
                 (hardest to achieve)
\`\`\`

## The Duplicate Problem

With at-least-once delivery, duplicates arise during failures:

\`\`\`
Producer Duplicate:
  Producer sends msg --> Broker writes it --> ACK is LOST in network
  Producer retries   --> Broker writes it AGAIN --> duplicate!

Consumer Duplicate:
  Consumer reads msg --> Processes it --> CRASHES before committing offset
  Consumer restarts  --> Reads same msg again --> duplicate processing!
\`\`\`

## Idempotent Producer

Kafka's first line of defense against producer duplicates:

\`\`\`
Idempotent Producer (enable.idempotence=true)
=============================================

Each producer gets a unique Producer ID (PID).
Each message gets a Sequence Number (monotonically increasing per partition).

Producer sends:  PID=5, Partition=0, SeqNum=42, value="order-123"
Broker writes it.
ACK is lost.
Producer retries: PID=5, Partition=0, SeqNum=42, value="order-123"

Broker checks: "PID=5, SeqNum=42 already written for Partition 0"
  --> Deduplicates! Returns success without writing again.
\`\`\`

The broker maintains a map of (PID, Partition) --> last sequence number. If a retry arrives with a sequence number already seen, it is silently acknowledged without writing.

**Limitation:** Idempotent producers only guarantee exactly-once within a **single partition** and a **single producer session** (PID changes on restart).

## Transactional Producer

For exactly-once across **multiple partitions** and **producer restarts**, Kafka uses transactions:

\`\`\`
Transactional Producer Flow
============================

producer.initTransactions()

producer.beginTransaction()
  |
  producer.send(topic="orders", partition=0, value="order-A")
  producer.send(topic="orders", partition=1, value="order-B")
  producer.sendOffsetsToTransaction(consumer_offsets)
  |
producer.commitTransaction()
  |
  --> ALL writes are atomically visible, or NONE are

If producer crashes before commit:
  --> Transaction is aborted
  --> None of the writes are visible to consumers
\`\`\`

### How Transactions Work Internally

\`\`\`
Transaction Coordinator (on a broker)
======================================

1. Producer registers transactional.id = "order-processor-1"
   Coordinator assigns PID, epoch

2. Producer sends AddPartitionsToTxn(topic-partition list)
   Coordinator logs: "TXN 1234 includes partitions [orders-0, orders-1]"

3. Producer writes messages to partition leaders
   Messages are tagged with TXN ID (invisible to consumers with
   isolation.level=read_committed)

4. Producer sends EndTxn(COMMIT)
   Coordinator writes COMMIT markers to all involved partitions
   Messages become visible to read_committed consumers

5. If producer crashes before EndTxn:
   Coordinator times out the transaction
   Writes ABORT markers
   Messages are discarded by consumers
\`\`\`

## Consume-Transform-Produce Pattern

The most common exactly-once use case: read from one topic, process, write to another:

\`\`\`
Exactly-Once Stream Processing
===============================

Consumer reads from "raw-events"
     |
     v
Process / Transform
     |
     v
Producer writes to "processed-events"
  AND commits consumer offsets
  IN THE SAME TRANSACTION

producer.beginTransaction()
  records = consumer.poll()
  for record in records:
      result = process(record)
      producer.send("processed-events", result)
  producer.sendOffsetsToTransaction(offsets, consumer_group)
producer.commitTransaction()
\`\`\`

If any step fails, the entire transaction aborts: the output messages are discarded and the consumer offsets are not committed. On restart, the consumer re-reads from the last committed offset and reprocesses.

## Consumer Isolation Levels

| Level | Behavior |
|-------|----------|
| read_uncommitted | See all messages, including from open transactions |
| read_committed | Only see messages from committed transactions |

\`\`\`
Log with transaction markers:

  [msg1 TXN-A] [msg2 TXN-B] [COMMIT TXN-A] [msg3 TXN-B] [ABORT TXN-B]

read_uncommitted consumer sees: msg1, msg2, msg3
read_committed consumer sees:   msg1 only (TXN-B was aborted)
\`\`\`

## Performance Impact

| Feature | Throughput Impact |
|---------|------------------|
| Idempotent producer | ~3-5% overhead (sequence number tracking) |
| Transactional producer | ~10-20% overhead (coordinator round trips) |
| read_committed consumer | Slight latency increase (waits for commit markers) |

For most production workloads, the overhead is acceptable given the correctness guarantees.

## Key Takeaway

Kafka achieves exactly-once semantics through two complementary mechanisms: idempotent producers (deduplication via sequence numbers) and transactions (atomic multi-partition writes with consumer offset commits). Together, they enable the consume-transform-produce pattern where each input message produces exactly one output, even in the presence of failures and retries.`,
    },
    {
      id: "kafka-architecture",
      slug: "kafka-architecture-walkthrough",
      title: "Kafka: Architecture Walkthrough",
      content: `# Kafka: Architecture Walkthrough

Let us tie together all components into a complete picture of how Kafka operates end-to-end.

## Complete Architecture

\`\`\`
                    Kafka Architecture
                    ==================

  Producers                              Consumers
  (multiple)                             (consumer groups)
     |                                       ^
     v                                       |
+----------------------------------------------------+
|                  Kafka Cluster                      |
|                                                     |
|  Broker 1          Broker 2          Broker 3       |
|  +-----------+    +-----------+    +-----------+    |
|  | Topic A   |    | Topic A   |    | Topic A   |    |
|  |  P0 [L]   |    |  P0 [F]   |    |  P1 [F]   |    |
|  |  P1 [L]   |    |  P2 [L]   |    |  P0 [F]   |    |
|  |  P2 [F]   |    |  P1 [F]   |    |  P2 [F]   |    |
|  +-----------+    +-----------+    +-----------+    |
|  | Log Segs  |    | Log Segs  |    | Log Segs  |    |
|  | Page Cache|    | Page Cache|    | Page Cache|    |
|  +-----------+    +-----------+    +-----------+    |
|                                                     |
|  [L] = Leader    [F] = Follower                     |
|                                                     |
|  Controller (KRaft): Broker 1                       |
|  Metadata: partition assignments, ISR sets, configs |
+----------------------------------------------------+
\`\`\`

## Produce Path End-to-End

\`\`\`
Producer.send(topic="orders", key="user-42", value={...})
  |
  v
1. Serializer: key and value -> bytes
  |
  v
2. Partitioner: hash("user-42") % 3 = 1 --> Partition 1
  |
  v
3. Record accumulator: batch messages (linger.ms, batch.size)
   Batching amortizes network overhead.
  |
  v
4. Sender thread: send batch to Broker 1 (leader for P1)
  |
  v
5. Broker 1 (leader):
   a. Validate message (CRC, size limits)
   b. Append to active segment of Partition 1 log
   c. If acks=all: wait for ISR replicas to fetch and confirm
  |
  v
6. Broker 1 sends ACK to producer
  |
  v
7. If acks=all and min.insync.replicas=2:
   Broker 2 (ISR follower) fetches new records
   Broker 2 appends to its local log
   Broker 2 confirms to leader
   Leader ACKs producer after 2 ISR confirmations
  |
  v
8. Producer callback: onCompletion(metadata, exception)
   metadata contains: topic, partition, offset, timestamp
\`\`\`

## Consume Path End-to-End

\`\`\`
consumer.subscribe("orders")
consumer.poll(Duration.ofMillis(100))
  |
  v
1. Consumer contacts Group Coordinator (a broker)
   Joins consumer group "order-service"
  |
  v
2. Coordinator assigns partitions:
   Consumer A: Partitions [0, 1]
   Consumer B: Partition [2]
  |
  v
3. Consumer A fetches from Broker 1 (leader for P0, P1):
   Fetch(partition=0, offset=5000, max_bytes=1MB)
   Fetch(partition=1, offset=3200, max_bytes=1MB)
  |
  v
4. Broker reads from log:
   a. Find segment containing offset 5000
   b. Check page cache (likely a hit for recent data)
   c. Use sendfile() for zero-copy transfer to consumer
  |
  v
5. Consumer deserializes, processes messages
  |
  v
6. Consumer commits offsets:
   Auto-commit (every 5 seconds) OR
   Manual commit after processing
   Offsets stored in __consumer_offsets topic
\`\`\`

## Failure Scenarios

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Broker crash (leader) | Controller detects via heartbeat | New leader elected from ISR. Producers/consumers refresh metadata. |
| Broker crash (follower) | Removed from ISR after lag timeout | Remaining ISR continues. When broker recovers, it re-fetches missing data and rejoins ISR. |
| Producer crash mid-transaction | Transaction coordinator timeout | Transaction aborted. Uncommitted messages invisible to read_committed consumers. |
| Consumer crash | Missing heartbeat triggers rebalance | Partitions reassigned to remaining consumers. Processing resumes from last committed offset. |
| Network partition | Split-brain risk | ISR shrinks. If ISR < min.insync.replicas, writes rejected (fail-safe). |
| Disk full | Broker health check | Log retention/compaction frees space. Alert triggers capacity expansion. |

## Data Flow Patterns

\`\`\`
Pattern 1: Fan-Out (one topic, multiple consumer groups)
=========================================================

[Producers] --> Topic "events" --> [Analytics Group]
                                --> [Search Indexer Group]
                                --> [Alerting Group]

Each group independently consumes all messages.


Pattern 2: Stream Processing Pipeline
=======================================

[Producers] --> "raw-events"
                    |
              [Stream Processor] (consume-transform-produce)
                    |
               "enriched-events"
                    |
              [Stream Processor]
                    |
               "aggregated-metrics"
                    |
               [Dashboard Consumer]


Pattern 3: Event Sourcing with Compacted Topics
=================================================

[Services] --> "user-profiles" (compacted)
                    |
               Keeps latest value per user_id
                    |
               [New service reads full topic to rebuild state]
\`\`\`

## Summary of Techniques

\`\`\`
+---------------------------+-----------------------------------+
| Problem                   | Kafka's Solution                  |
+---------------------------+-----------------------------------+
| High throughput writes    | Sequential append, page cache     |
| High throughput reads     | Zero-copy (sendfile), page cache  |
| Parallel consumption      | Partitions + consumer groups      |
| Message ordering          | Per-partition ordering             |
| Durability                | Replication + ISR + acks=all      |
| Fault tolerance           | Leader election from ISR           |
| Exactly-once delivery     | Idempotent producer + transactions|
| Replay / reprocessing     | Consumer offset seek               |
| Scalability               | Add brokers, reassign partitions  |
| Data retention            | Time/size retention, log compaction|
| Metadata management       | KRaft (replacing ZooKeeper)       |
+---------------------------+-----------------------------------+
\`\`\`

## Key Takeaway

Kafka achieves its extraordinary throughput by treating every partition as an immutable, append-only log optimized for sequential I/O. Replication with ISR provides tunable durability, consumer groups provide scalable consumption, and transactions enable exactly-once processing. The architecture is a masterclass in aligning software design with hardware performance characteristics -- sequential disk access, OS page cache, and zero-copy networking.`,
    },
  ],
};
