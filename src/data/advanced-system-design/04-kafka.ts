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

\`\`\`concept
{"title": "Kafka's Origin Story", "variant": "insight", "content": "Apache Kafka was born at LinkedIn in 2011 when traditional message queues (RabbitMQ, ActiveMQ) hit a wall. LinkedIn needed to ingest millions of events per second — page views, ad impressions, searches, profile updates — and existing systems simply couldn't keep up. The breakthrough insight: treat the message stream as an immutable, append-only log rather than a queue that deletes messages after consumption."}
\`\`\`

## The Problem LinkedIn Faced

LinkedIn's infrastructure team confronted a perfect storm of requirements that no existing message queue could satisfy:

- **Massive scale**: Millions of events per second from hundreds of services
- **Multi-consumer fan-out**: Same events needed by real-time analytics, search indexing, data warehousing — without each building their own pipeline
- **Data retention**: Keep events for days (not milliseconds) to enable reprocessing and backfills
- **Burst tolerance**: Handle traffic spikes without backpressure collapsing the system

Traditional message queues were designed for a different era — when "high throughput" meant thousands of messages per second, not millions.

\`\`\`compare
{"variant": "before-after", "before": {"label": "Traditional Message Queue", "code": "# Push-based delivery\\nbroker.push(message, consumer)\\n# Message deleted after ACK\\nif consumer.ack():\\n    broker.delete(message)\\n# Throughput: ~10K msg/sec\\n# No replay capability\\n# Broker tracks consumer state"}, "after": {"label": "Kafka's Log-Based Design", "code": "# Pull-based delivery\\nconsumer.pull(topic, offset)\\n# Messages retained by policy\\n# Immutable log structure\\n# Throughput: ~1M msg/sec\\n# Replay to any offset\\n# Consumer tracks own position"}}
\`\`\`

## Functional Requirements

Kafka's architecture directly addresses these needs:

1. **Publish** messages to named topics
2. **Subscribe** to topics and consume messages in order
3. **Replay** messages from any point in time (not just the latest)
4. Support **multiple independent consumers** reading the same topic at different speeds
5. Guarantee ordering within a partition

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Throughput | Millions of messages/sec per cluster |
| Latency | < 10ms for produce acknowledgment |
| Durability | No data loss for acknowledged writes |
| Retention | Configurable: hours, days, or forever |
| Scalability | Add brokers without downtime |
| Availability | Tolerate broker failures without data loss |

\`\`\`callout
{"type": "info", "title": "Why These Numbers Matter", "content": "These aren't arbitrary targets. LinkedIn measured their peak at 1.4 million messages per second during business hours. The <10ms latency requirement ensures real-time analytics can keep up with user actions. Configurable retention (from hours to forever) enables both real-time processing and historical analysis from the same data stream."}
\`\`\`

## Design Philosophy

\`\`\`
Kafka Design Principles
========================

1. Log-Centric     -- The log IS the database
2. Pull-Based      -- Consumers pull at their own pace
3. Partitioned     -- Parallelism via partition count
4. Replicated      -- Every partition has multiple copies
5. Sequential I/O  -- Append-only writes, sequential reads
\`\`\`

## Why Traditional Message Queues Failed

The fundamental mismatch lies in the core abstraction:

| Property | Traditional MQ | Kafka |
|----------|---------------|-------|
| Delivery model | Push to consumers | Pull by consumers |
| Message lifetime | Deleted after consumption | Retained by time/size policy |
| Ordering | Per-queue | Per-partition |
| Consumer tracking | Broker tracks per-message ACKs | Consumer tracks its own offset |
| Throughput | ~10K msg/sec | ~1M msg/sec |
| Replay | Not supported | Seek to any offset |

The key insight: Kafka treats the message stream as an **immutable, append-only log**. This simplifies the broker (no per-message tracking), enables replay, and allows sequential I/O for maximum throughput.

\`\`\`quiz
{"title": "Kafka Design Choices", "questions": [{"question": "Why did Kafka choose a pull-based model instead of push-based delivery?", "options": ["It's easier to implement", "Consumers can process at their own pace without overwhelming the broker", "It reduces network bandwidth", "It guarantees lower latency"], "answer": 1, "explanation": "Pull-based delivery allows consumers to control their consumption rate. If a consumer falls behind, it simply pulls less frequently. In a push model, the broker would need complex backpressure mechanisms to avoid overwhelming slow consumers."}, {"question": "What enables Kafka's million-message-per-second throughput compared to traditional MQs?", "options": ["Faster network protocols", "Better programming languages", "Sequential I/O and log-structured storage", "More powerful servers"], "answer": 2, "explanation": "Kafka's append-only log structure enables sequential disk writes (O(1) complexity) and leverages OS page cache for reads. Traditional MQs use random I/O for message deletion and per-message tracking, creating bottlenecks."}, {"question": "Why does Kafka retain messages instead of deleting them after consumption?", "options": ["Storage is cheap", "To enable replay and multiple consumers", "To reduce broker complexity", "For backup purposes"], "answer": 1, "explanation": "Message retention enables multiple independent consumers to read the same data at different speeds and allows replaying events for reprocessing, backfills, or debugging. This is impossible in traditional queues that delete messages after acknowledgment."}]}
\`\`\`

## Kafka Ecosystem Overview

\`\`\`mermaid
graph LR
    P[Producers] --> KC[Kafka Cluster]
    KC --> C[Consumers]
    KC --> KConn[Kafka Connect]
    KC --> KS[Kafka Streams]
    KConn --> Sinks[DBs / S3 / ES]
    KS --> Apps[Real-time Apps]
    subgraph KC[Kafka Cluster]
        B1[Broker 1] --- B2[Broker 2] --- B3[Broker 3]
    end
\`\`\`

\`\`\`
Kafka Ecosystem
===============

Producers --> [Kafka Cluster] --> Consumers
               |  Brokers  |
               |  Topics   |
               |  Partitions|
               +------------+
                    |
            +-------+-------+
            |               |
     Kafka Connect     Kafka Streams
     (source/sink)     (stream processing)
            |               |
     [DBs, S3, ES]    [Real-time apps]
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Kafka reimagined messaging as a distributed, replicated, append-only log", "The log-centric design enables million-message-per-second throughput through sequential I/O", "Pull-based consumption and message retention support multiple independent consumers", "Consumer-managed offsets enable replay and backprocessing capabilities", "These design choices solve scale problems that traditional message queues cannot address"]}
\`\`\``,
    },
    {
      id: "kafka-topics-partitions",
      slug: "kafka-topics-partitions",
      title: "Topics, Partitions & Consumer Groups",
      content: `# Topics, Partitions & Consumer Groups

Kafka’s core abstraction is the **topic** — a named, ordered stream of messages. Topics are split into **partitions** for parallelism, and **consumer groups** enable scalable, fault-tolerant consumption.

\`\`\`concept
{
  "title": "Kafka’s Three-Layer Abstraction",
  "variant": "mental-model",
  "content": "Think of a topic as a TV channel, partitions as simultaneous sub-channels broadcasting different segments of the same show, and consumer groups as independent DVRs that can pause, rewind, or replay the stream without affecting each other."
}
\`\`\`

## Topics

A topic is a logical category for messages. Producers write to topics; consumers read from topics.

\`\`\`
Topic: "user-events"

  Message 1: {user: "alice", action: "login"}
  Message 2: {user: "bob",   action: "click"}
  Message 3: {user: "alice", action: "purchase"}
  ...
\`\`\`

Topics are append-only and immutable. Each message receives an **offset** — a monotonically increasing integer unique within its partition.

\`\`\`callout
{
  "type": "info",
  "title": "Offset vs. Message ID",
  "content": "Offsets are local to a partition, not global across the topic. Message 0 in Partition 0 is unrelated to Message 0 in Partition 1."
}
\`\`\`

## Partitions

A topic is divided into one or more partitions. Each partition is an independent, ordered, append-only log.

\`\`\`algoviz
{
  "title": "Partitioned Topic Layout",
  "type": "array",
  "data": ["msg0", "msg1", "msg2", "msg3", "msg4", "msg5", "msg6", "msg7", "msg8"],
  "frames": [
    { "highlight": [0, 3, 6], "label": "Partition 0", "stats": {"partition": 0, "offsets": "0,1,2"} },
    { "highlight": [1, 4, 7], "label": "Partition 1", "stats": {"partition": 1, "offsets": "0,1,2"} },
    { "highlight": [2, 5, 8], "label": "Partition 2", "stats": {"partition": 2, "offsets": "0,1,2"} }
  ],
  "speed": 1000
}
\`\`\`

- Each partition has its own offset sequence starting at 0.  
- Partitions are stored on one broker (the leader) plus replicas.  
- Kafka guarantees **total order within a partition** only.

### Partition Key Routing

Producers decide the destination partition:

1. **No key** → round-robin across partitions.  
2. **With key** → \`hash(key) % num_partitions\`.

\`\`\`trace
{
  "title": "Key-Based Routing Trace",
  "language": "python",
  "code": "def partition(key, num_parts=3):\\n    return hash(key) % num_parts\\n\\nprint('alice ->', partition('alice'))\\nprint('bob   ->', partition('bob'))\\nprint('alice ->', partition('alice'))",
  "frames": [
    { "line": 2, "vars": {"key": "alice", "num_parts": 3}, "stdout": "" },
    { "line": 3, "vars": {"hash": 12345}, "stdout": "alice -> 0\\n" },
    { "line": 4, "vars": {"key": "bob"}, "stdout": "alice -> 0\\nbob   -> 2\\n" },
    { "line": 5, "vars": {"key": "alice"}, "stdout": "alice -> 0\\nbob   -> 2\\nalice -> 0\\n" }
  ],
  "speed": 800
}
\`\`\`

All events for the same key land in the same partition, preserving **per-key order**.

## Consumer Groups

A consumer group is a set of consumers that cooperate to consume a topic. Each partition is assigned to **exactly one** consumer in the group.

\`\`\`steps
{
  "title": "How Assignment Works",
  "steps": [
    {
      "title": "1. List Partitions",
      "content": "Coordinator fetches the 3 partition IDs: 0, 1, 2."
    },
    {
      "title": "2. List Consumers",
      "content": "Coordinator sees 3 live consumers in group \`analytics\`."
    },
    {
      "title": "3. Range Assignment",
      "content": "Partition 0 → Consumer A, 1 → B, 2 → C. Each consumer owns one partition."
    }
  ]
}
\`\`\`

### Scaling Consumers

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "2 consumers, 3 partitions",
    "code": "Consumer A: partitions 0,1\\nConsumer B: partition 2\\n# A does 66 % of work"
  },
  "after": {
    "label": "3 consumers, 3 partitions",
    "code": "Consumer A: partition 0\\nConsumer B: partition 1\\nConsumer C: partition 2\\n# Perfectly balanced"
  }
}
\`\`\`

**Maximum parallelism = number of partitions.** Adding consumers beyond that leaves extras idle.

### Multiple Consumer Groups

Different groups consume the same topic **independently** and track their offsets separately.

\`\`\`sysdiag
{
  "title": "Two Groups, One Topic",
  "width": 600,
  "height": 280,
  "nodes": [
    { "id": "topic", "label": "user-events\\n(3 partitions)", "x": 300, "y": 140, "kind": "queue" },
    { "id": "g1", "label": "analytics\\n(group)", "x": 150, "y": 80, "kind": "service" },
    { "id": "g2", "label": "search-indexer\\n(group)", "x": 450, "y": 80, "kind": "service" }
  ],
  "edges": [
    { "from": "topic", "to": "g1", "label": "all msgs" },
    { "from": "topic", "to": "g2", "label": "all msgs" }
  ],
  "annotations": {
    "g1": "Commits offsets to __consumer_offsets under group=analytics",
    "g2": "Commits offsets under group=search-indexer"
  }
}
\`\`\`

## Offset Management

Each consumer commits its position per partition to the internal \`__consumer_offsets\` topic.

\`\`\`playground
{
  "title": "Manual Offset Commit",
  "language": "python",
  "code": "from kafka import KafkaConsumer\\n\\nconsumer = KafkaConsumer(\\n    'user-events',\\n    group_id='analytics',\\n    enable_auto_commit=False,\\n    bootstrap_servers=['localhost:9092']\\n)\\n\\nfor msg in consumer:\\n    print(msg.offset, msg.value)\\n    # commit sync every 50 messages\\n    if msg.offset % 50 == 0:\\n        consumer.commit()\\n        print('committed offset', msg.offset)",
  "runnable": false
}
\`\`\`

Consumers can:
- Resume from the last committed offset (default).  
- Reset to earliest/latest.  
- Seek to an arbitrary offset or timestamp.

## Rebalancing

When a consumer joins or crashes, Kafka **rebalances** partition assignments.

\`\`\`collapse
{
  "title": "Deep Dive: Rebalance Protocol",
  "content": "1. Group coordinator detects heartbeat failure (default 10 s).  \\n2. Coordinator revokes all partitions.  \\n3. Consumers re-join and supply their topic subscriptions.  \\n4. Coordinator runs assignment strategy (range, round-robin, sticky, or custom).  \\n5. New assignment is distributed; consumers fetch from last committed offset.  \\n\\nDuring rebalance, processing pauses — keep it fast by using static membership and incremental cooperative rebalancing in Kafka 2.4+."
}
\`\`\`

## Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Topics are logical streams; partitions are the unit of parallelism and ordering.",
    "Choose partition keys carefully — per-partition order is all you get.",
    "Consumer groups provide horizontal scaling; max active consumers ≤ partition count.",
    "Offsets are per-group and stored in Kafka itself, enabling replay and exactly-once semantics."
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What determines the maximum parallelism of a consumer group?",
      "options": ["Number of brokers", "Number of partitions", "Number of topics", "Replication factor"],
      "answer": 1,
      "explanation": "Each partition is assigned to exactly one consumer; therefore the partition count caps the number of active consumers."
    },
    {
      "question": "You need strict order of all events for a given user. Which strategy ensures this?",
      "options": ["Use random keys", "Use the user ID as the partition key", "Increase replication factor", "Add more consumers"],
      "answer": 1,
      "explanation": "Hashing the user ID routes all events for that user to the same partition, preserving order."
    },
    {
      "question": "Where are consumer offsets stored in a Kafka cluster?",
      "options": ["ZooKeeper", "A local file on each consumer", "The __consumer_offsets topic", "In-memory only"],
      "answer": 2,
      "explanation": "Kafka uses an internal compacted topic named __consumer_offsets to persist offset commits fault-tolerantly."
    }
  ]
}
\`\`\``,
    },
    {
      id: "kafka-replication",
      slug: "kafka-replication-leader-election",
      title: "Replication & Leader Election",
      content: `# Replication & Leader Election

Kafka replicates each partition across multiple brokers for fault tolerance. Each partition has a **leader** that handles all reads and writes, and **followers** that replicate the leader's log.

## Replication Model

\`\`\`concept
{
  "title": "Leader-Follower Architecture",
  "variant": "mental-model",
  "content": "Think of Kafka replication like a classroom where one student (the leader) reads the textbook aloud while others (followers) copy the text. Only the designated reader can speak, ensuring everyone gets the same information in the same order. If the reader steps away, another student who has copied everything up to that point takes over."
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Partition Replication Across Brokers",
  "width": 800,
  "height": 400,
  "nodes": [
    {"id": "producer", "label": "Producer", "x": 100, "y": 200, "kind": "client"},
    {"id": "consumer", "label": "Consumer", "x": 700, "y": 200, "kind": "client"},
    {"id": "broker1", "label": "Broker 1\\n[LEADER]", "x": 300, "y": 150, "kind": "service"},
    {"id": "broker2", "label": "Broker 2\\n[FOLLOWER]", "x": 300, "y": 250, "kind": "service"},
    {"id": "broker3", "label": "Broker 3\\n[FOLLOWER]", "x": 300, "y": 350, "kind": "service"}
  ],
  "edges": [
    {"from": "producer", "to": "broker1", "label": "write"},
    {"from": "broker1", "to": "consumer", "label": "read"},
    {"from": "broker1", "to": "broker2", "label": "replicate"},
    {"from": "broker1", "to": "broker3", "label": "replicate"}
  ],
  "annotations": {
    "broker1": "Handles all client requests for this partition",
    "broker2": "Continuously fetches new data from leader",
    "broker3": "May lag behind; removed from ISR if too slow"
  }
}
\`\`\`

**Rules:**
- All produces and consumes go through the **leader**
- Followers continuously fetch from the leader and append to their local log
- Followers that are caught up are in the **In-Sync Replica set (ISR)**

## In-Sync Replicas (ISR)

The ISR is the set of replicas (including the leader) that are fully caught up with the leader's log. A replica is removed from the ISR if it falls behind by more than \`replica.lag.time.max.ms\` (default: 30 seconds).

\`\`\`algoviz
{
  "title": "ISR Dynamics Over Time",
  "type": "array",
  "data": ["Broker1", "Broker2", "Broker3"],
  "frames": [
    {"highlight": [0, 1, 2], "label": "T1: All brokers in ISR", "stats": {"isr_size": 3}},
    {"highlight": [0, 1], "label": "T2: Broker3 falls behind, removed from ISR", "stats": {"isr_size": 2}},
    {"highlight": [0, 1, 2], "label": "T3: Broker3 recovers, rejoins ISR", "stats": {"isr_size": 3}}
  ],
  "speed": 1000
}
\`\`\`

## Write Acknowledgment (acks)

Producers configure how many replicas must acknowledge a write:

| acks | Behavior | Durability | Latency |
|------|----------|-----------|---------|
| 0 | Fire and forget | May lose data | Lowest |
| 1 | Leader ACKs | Lose data if leader crashes before replication | Low |
| all (-1) | All ISR replicas ACK | No data loss if at least one ISR survives | Highest |

\`\`\`trace
{
  "title": "acks=all Write Flow",
  "language": "python",
  "code": "# Producer sends message\\nproducer.send('orders', b'Order #123')\\n\\n# Leader receives and writes to log\\nleader.write_log('Order #123')\\n\\n# Leader waits for ISR replicas\\nbroker2.replicate('Order #123')\\nbroker3.replicate('Order #123')\\n\\n# All ISR confirmed\\nif broker2.in_sync() and broker3.in_sync():\\n    producer.ack_success()",
  "frames": [
    {"line": 2, "vars": {"message": "Order #123"}, "note": "Producer sends message"},
    {"line": 5, "vars": {"leader_log": ["Order #123"]}, "note": "Leader writes to local log"},
    {"line": 8, "vars": {"broker2_log": ["Order #123"]}, "note": "Broker 2 replicates"},
    {"line": 9, "vars": {"broker3_log": ["Order #123"]}, "note": "Broker 3 replicates"},
    {"line": 12, "vars": {"ack": "SUCCESS"}, "note": "All ISR confirmed, send ACK"}
  ],
  "speed": 800
}
\`\`\`

With \`acks=all\` and \`min.insync.replicas=2\`, the producer gets an error if fewer than 2 replicas are in-sync. This prevents writes from being acknowledged with insufficient durability.

## Leader Election

When a leader broker fails, Kafka must elect a new leader from the ISR:

\`\`\`steps
{
  "title": "Leader Election Process",
  "steps": [
    {
      "title": "1. Leader Failure Detected",
      "content": "Broker 1 (leader for Partition 0) crashes. ZooKeeper/KRaft detects the failure through heartbeat timeout."
    },
    {
      "title": "2. Controller Involvement",
      "content": "The controller (a special broker) identifies available replicas from the ISR: {Broker 2, Broker 3}."
    },
    {
      "title": "3. New Leader Selection",
      "content": "Controller selects Broker 2 as the new leader based on ISR membership and availability."
    },
    {
      "title": "4. Metadata Update",
      "content": "Controller updates cluster metadata, notifying all brokers of the leadership change."
    },
    {
      "title": "5. Client Discovery",
      "content": "Producers and consumers refresh metadata to discover the new leader at Broker 2."
    }
  ]
}
\`\`\`

### Unclean Leader Election

If ALL ISR replicas are down, Kafka faces a choice:
- **Wait** for an ISR replica to recover (may be unavailable for a while)
- **Elect a non-ISR replica** (unclean election -- may lose messages)

This is configured by \`unclean.leader.election.enable\` (default: false). For most systems, availability of a non-ISR leader with potential data loss is worse than temporary unavailability.

\`\`\`quiz
{
  "title": "Replication & Leader Election Quiz",
  "questions": [
    {
      "question": "What happens when a follower falls behind the leader by more than replica.lag.time.max.ms?",
      "options": ["It becomes the new leader", "It is removed from the ISR", "It stops replicating", "It requests a full log copy"],
      "answer": 1,
      "explanation": "Followers that lag beyond the configured threshold are removed from the In-Sync Replica set, making them ineligible for leader election."
    },
    {
      "question": "With acks=all and min.insync.replicas=2, what happens if only 1 replica is in the ISR?",
      "options": ["Write succeeds with warning", "Write fails with error", "Write waits indefinitely", "Write succeeds but with reduced durability"],
      "answer": 1,
      "explanation": "The write will fail because min.insync.replicas requires at least 2 in-sync replicas to acknowledge the write for durability guarantees."
    },
    {
      "question": "Why is unclean leader election disabled by default?",
      "options": ["It slows down election", "It may cause data loss", "It requires more memory", "It complicates client code"],
      "answer": 1,
      "explanation": "Unclean leader election can elect a replica that doesn't have all committed messages, potentially causing data loss when the failed leader recovers."
    }
  ]
}
\`\`\`

## KRaft: Replacing ZooKeeper

Traditional Kafka relied on ZooKeeper for metadata management and controller election. KRaft (Kafka Raft) replaces ZooKeeper with a built-in Raft-based consensus protocol:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Traditional Architecture (ZooKeeper)",
    "code": "Kafka Brokers    ZooKeeper Ensemble\\n     |                  |\\n     +---> Metadata <---+\\n     |     Management   |\\n     |                  |\\n     +---> Controller <---+\\n           Election     |\\n                          |\\n                    Separate Cluster\\n                    (3-5 nodes minimum)"
  },
  "after": {
    "label": "KRaft Architecture (Built-in Consensus)",
    "code": "Kafka Brokers with Controller Quorum\\n     |\\n     +---> Internal Raft\\n     |     Consensus\\n     |\\n     +---> Metadata\\n           Management\\n\\nBenefits:\\n- No external dependency\\n- Faster failover\\n- Scales to millions of partitions"
  }
}
\`\`\`

**Benefits of KRaft:**
1. Simpler operations (no ZooKeeper to manage)
2. Faster controller failover
3. Supports millions of partitions (ZooKeeper had scaling limits)

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Kafka's leader-follower model ensures all reads/writes go through a single leader while followers replicate asynchronously",
    "The ISR set guarantees that only fully caught-up replicas can become leaders, maintaining consistency",
    "acks=all with min.insync.replicas provides the strongest durability guarantees but increases latency",
    "Leader election from the ISR ensures the new leader has all committed data, preventing data loss during failovers",
    "KRaft replaces ZooKeeper with built-in consensus, simplifying operations and improving scalability"
  ]
}
\`\`\``,
    },
    {
      id: "kafka-log-storage",
      slug: "kafka-log-structured-storage",
      title: "Log-Structured Storage Engine",
      content: `# Log-Structured Storage Engine

Kafka's performance comes from treating each partition as an **append-only, sequential log** stored on disk. This design exploits the performance characteristics of modern hardware.

\`\`\`concept
{"title": "The Log Abstraction", "variant": "mental-model", "content": "Think of a Kafka partition as a single, ever-growing file that only accepts writes at the end. Once data is written, it becomes immutable. This is fundamentally different from databases that update records in-place."}
\`\`\`

## The Log Abstraction

Each partition is a directory on disk containing **segment files**:

\`\`\`
Partition 0 Directory: /kafka-data/topic-orders-0/

  00000000000000000000.log    (segment 0: offsets 0-999)
  00000000000000000000.index  (offset index for segment 0)
  00000000000000000000.timeindex (timestamp index)

  00000000000000001000.log    (segment 1: offsets 1000-1999)
  00000000000000001000.index
  00000000000000001000.timeindex

  00000000000000002000.log    (segment 2: offsets 2000-2847, ACTIVE)
  00000000000000002000.index
  00000000000000002000.timeindex
\`\`\`

The filename IS the base offset of that segment. Only the last segment (active segment) accepts new writes. Older segments are immutable.

## Segment Structure

\`\`\`
Log Segment File (.log)
=======================

+------------------+------------------+------------------+
| Record Batch 1   | Record Batch 2   | Record Batch 3   |
| offset: 2000     | offset: 2005     | offset: 2012     |
| size: 512 bytes  | size: 1024 bytes | size: 256 bytes  |
| CRC: 0xABCD      | CRC: 0x1234      | CRC: 0x5678      |
| records: 5       | records: 7       | records: 3       |
+------------------+------------------+------------------+

Each Record:
  - Offset (int64)
  - Timestamp (int64)
  - Key (bytes, nullable)
  - Value (bytes)
  - Headers (key-value pairs)
\`\`\`

## Why Sequential I/O Is Fast

\`\`\`compare
{"variant": "before-after", "before": {"label": "Random I/O (Traditional Database)", "code": "# Each write seeks to a different location\\nwrite(key=1, value=A) -> seek to position 1024\\nwrite(key=2, value=B) -> seek to position 8192  \\nwrite(key=3, value=C) -> seek to position 4096\\n\\n# 3 random seeks = 3 disk rotations (HDD)\\n# ~30ms total latency"}, "after": {"label": "Sequential I/O (Kafka Log)", "code": "# All writes append to the same position\\nwrite(key=1, value=A) -> append at position 0\\nwrite(key=2, value=B) -> append at position 50\\nwrite(key=3, value=C) -> append at position 100\\n\\n# 0 seeks, continuous write\\n# ~3ms total latency"}}
\`\`\`

\`\`\`callout
{"type": "info", "title": "Disk Performance Reality Check", "content": "Sequential I/O is 1000x faster than random I/O on HDDs and 5x faster on SSDs. Kafka's append-only design means zero seek time, enabling throughput that matches network speed on commodity hardware."}
\`\`\`

## Index Files

To find a specific offset without scanning the entire log, Kafka maintains sparse index files:

\`\`\`
Offset Index (.index)
=====================

Logical Offset --> Physical Position in .log file

  offset 2000 --> position 0
  offset 2050 --> position 25600
  offset 2100 --> position 51200
  offset 2150 --> position 76800

To find offset 2075:
  1. Binary search index: 2050 <= 2075 < 2100
  2. Seek to position 25600 in .log file
  3. Scan forward to find offset 2075
\`\`\`

The index is **sparse** (not every offset), keeping it small enough to memory-map for fast lookups.

## Zero-Copy Transfer

Kafka uses the OS **sendfile()** system call for consumer reads:

\`\`\`
Traditional data transfer:
  Disk --> Kernel Buffer --> User Buffer --> Socket Buffer --> NIC
  (4 copies, 2 context switches)

Zero-copy (sendfile):
  Disk --> Kernel Buffer --> NIC
  (2 copies, no user-space involvement)
\`\`\`

This eliminates two data copies and two context switches per consumer fetch. For high-throughput consumers, this can double network utilization.

## Page Cache

Kafka relies heavily on the OS **page cache** rather than managing its own in-memory cache:

\`\`\`
Write: append to file --> data sits in page cache
Read (recent): data is ALREADY in page cache --> no disk I/O
Read (old): page cache miss --> disk read, then cached

Benefits:
1. JVM heap stays small (no GC pressure)
2. OS manages cache eviction optimally
3. Survives broker restart (page cache is OS-level)
\`\`\`

Most consumer reads hit the page cache because consumers typically read recently written data (tailing the log). Only consumers replaying old data trigger actual disk I/O.

\`\`\`algoviz
{"title": "Page Cache Hit vs Miss", "type": "array", "data": ["Producer Write", "Page Cache", "Consumer Read 1", "Consumer Read 2", "Old Data Read"], "frames": [{"highlight": [0], "label": "Producer appends to segment file", "stats": {"cache_hit": false, "disk_io": true}}, {"highlight": [1], "label": "Data cached in OS page cache", "stats": {"cache_hit": false, "disk_io": false}}, {"highlight": [2], "label": "Consumer 1 reads recent data (cache hit)", "stats": {"cache_hit": true, "disk_io": false}}, {"highlight": [3], "label": "Consumer 2 reads same data (cache hit)", "stats": {"cache_hit": true, "disk_io": false}}, {"highlight": [4], "label": "Consumer reads old data (cache miss)", "stats": {"cache_hit": false, "disk_io": true}}], "speed": 1000}
\`\`\`

## Log Retention & Compaction

### Time-Based Retention
Delete segments older than a threshold (e.g., 7 days).

### Size-Based Retention
Delete oldest segments when partition exceeds a size limit.

### Log Compaction
Keep only the **latest value** for each key:

\`\`\`
Before compaction:
  offset 0: key=A, value=1
  offset 1: key=B, value=2
  offset 2: key=A, value=3  (update)
  offset 3: key=C, value=4
  offset 4: key=B, value=null (tombstone/delete)

After compaction:
  offset 2: key=A, value=3  (latest for A)
  offset 3: key=C, value=4  (latest for C)
  (B is deleted -- tombstone removes it)
\`\`\`

Log compaction is ideal for changelog topics (e.g., database CDC) where you want the latest state per key.

\`\`\`quiz
{"title": "Log-Structured Storage Deep Dive", "questions": [{"question": "Why does Kafka use sparse indexes instead of indexing every offset?", "options": ["To reduce memory usage and keep indexes memory-mappable", "Because offset gaps are impossible in Kafka", "To make binary search more challenging", "Because dense indexes are slower"], "answer": 0, "explanation": "Sparse indexes strike a balance between lookup speed and memory efficiency. By indexing every Nth offset, Kafka keeps index files small enough to memory-map, enabling fast binary search without excessive memory overhead."}, {"question": "What happens during a page cache miss when reading old data?", "options": ["The broker crashes", "Data is read from disk and then cached", "The consumer receives an error", "Kafka creates a new segment"], "answer": 1, "explanation": "When data isn't in page cache, Kafka reads it from disk. The OS then caches this data, making subsequent reads of the same data faster."}, {"question": "Which operation would trigger random I/O in Kafka's log structure?", "options": ["Appending a new record to the active segment", "Reading the next batch sequentially", "Seeking to a specific offset using the index", "None - Kafka only does sequential I/O"], "answer": 2, "explanation": "While the index lookup is sequential, seeking to a specific position in the log file based on the index entry involves moving the disk head to that position, which is a form of random I/O. However, this is minimized by the sparse index design."}]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Kafka's append-only log design eliminates random I/O, making writes 1000x faster on HDDs", "Sparse indexes enable efficient offset lookups without scanning entire segments", "Zero-copy transfer via sendfile() doubles network utilization by eliminating data copies", "OS page cache integration keeps JVM heap small while providing fast reads for recent data", "Log compaction maintains the latest state per key, ideal for changelog scenarios"]}
\`\`\``,
    },
    {
      id: "kafka-exactly-once",
      slug: "kafka-exactly-once-semantics",
      title: "Exactly-Once Semantics",
      content: `# Exactly-Once Semantics

Message delivery guarantees are one of the hardest problems in distributed systems. Kafka offers three levels: at-most-once, at-least-once, and exactly-once.

\`\`\`concept
{
  "title": "The Delivery Guarantee Spectrum",
  "variant": "mental-model",
  "content": "Think of delivery guarantees like a post office:\\n\\n**At-Most-Once**: The post office might lose your mail, but they'll never deliver the same letter twice. They mark it as delivered before it reaches you.\\n\\n**At-Least-Once**: Your mail will definitely arrive, but sometimes the post office gets confused and delivers the same letter multiple times. They only mark it as delivered after you've received it.\\n\\n**Exactly-Once**: The holy grail - your mail arrives exactly one time, never lost, never duplicated. This requires sophisticated tracking and coordination mechanisms."
}
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

\`\`\`algoviz
{
  "title": "How Duplicates Happen During Network Failures",
  "type": "array",
  "data": ["msg1", "msg2", "msg3"],
  "frames": [
    { "highlight": [0], "label": "Producer sends msg1 to broker", "stats": {"retry": 0} },
    { "highlight": [0], "label": "Broker writes msg1 successfully", "stats": {"retry": 0} },
    { "highlight": [0], "label": "ACK lost in network - producer thinks write failed", "stats": {"retry": 1} },
    { "highlight": [0], "label": "Producer retries - broker writes msg1 AGAIN", "stats": {"retry": 1} }
  ],
  "speed": 1000
}
\`\`\`

## Idempotent Producer

Kafka's first line of defense against producer duplicates:

\`\`\`concept
{
  "title": "Idempotent Producer Mechanism",
  "variant": "rule",
  "content": "When \`enable.idempotence=true\`:\\n\\n1. Each producer gets a unique Producer ID (PID)\\n2. Each message gets a sequence number (monotonically increasing per partition)\\n3. Brokers track the last sequence number for each (PID, partition) pair\\n4. Duplicate messages with the same sequence number are silently acknowledged without being written again\\n\\n**Limitation:** Only works within a single partition and single producer session. PID changes on restart."
}
\`\`\`

\`\`\`trace
{
  "title": "Idempotent Producer in Action",
  "language": "python",
  "code": "# Producer configuration\\nproducer = KafkaProducer(\\n    bootstrap_servers=['broker1:9092'],\\n    enable_idempotence=True,  # This is the key setting\\n    transactional_id='payment-processor-1'\\n)\\n\\n# First attempt - network failure\\nfuture = producer.send('orders', key=b'order123', value=b'payment')\\n# ACK lost - producer retries automatically\\n# Broker sees: PID=42, Partition=0, SeqNum=5 (duplicate)\\n# Broker responds SUCCESS without writing again",
  "frames": [
    { "line": 2, "vars": {"enable_idempotence": "True", "PID": "assigned by broker"}, "note": "Producer configured with idempotence enabled" },
    { "line": 7, "vars": {"PID": 42, "SeqNum": 5, "Partition": 0}, "note": "First send attempt with sequence number 5" },
    { "line": 9, "vars": {"retry": "triggered", "PID": 42, "SeqNum": 5}, "note": "Network failure triggers automatic retry" },
    { "line": 10, "vars": {"broker_check": "duplicate detected", "action": "acknowledge without writing"}, "note": "Broker deduplicates based on PID+SeqNum+Partition" }
  ],
  "speed": 1200
}
\`\`\`

## Transactional Producer

For exactly-once across **multiple partitions** and **producer restarts**, Kafka uses transactions:

\`\`\`concept
{
  "title": "Transactional Producer Flow",
  "variant": "mental-model",
  "content": "Think of Kafka transactions like a database transaction, but for messages:\\n\\n\`\`\`\\nproducer.initTransactions()\\n\\nproducer.beginTransaction()\\n  |\\n  producer.send(topic=\\"orders\\", partition=0, value=\\"order-A\\")\\n  producer.send(topic=\\"orders\\", partition=1, value=\\"order-B\\")\\n  producer.sendOffsetsToTransaction(consumer_offsets)\\n  |\\nproducer.commitTransaction()\\n  |\\n  --> ALL writes are atomically visible, or NONE are\\n\\nIf producer crashes before commit:\\n  --> Transaction is aborted\\n  --> None of the writes are visible to consumers\\n\`\`\`"
}
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

\`\`\`sysdiag
{
  "title": "Kafka Transaction Coordinator Architecture",
  "width": 600,
  "height": 400,
  "nodes": [
    { "id": "producer", "label": "Transactional Producer", "x": 100, "y": 100, "kind": "service" },
    { "id": "coordinator", "label": "Transaction Coordinator", "x": 300, "y": 200, "kind": "broker" },
    { "id": "partition0", "label": "Orders-0 Partition", "x": 500, "y": 100, "kind": "storage" },
    { "id": "partition1", "label": "Orders-1 Partition", "x": 500, "y": 300, "kind": "storage" }
  ],
  "edges": [
    { "from": "producer", "to": "coordinator", "label": "Register txn.id" },
    { "from": "coordinator", "to": "producer", "label": "Assign PID, epoch" },
    { "from": "producer", "to": "partition0", "label": "Send with TXN ID" },
    { "from": "producer", "to": "partition1", "label": "Send with TXN ID" },
    { "from": "producer", "to": "coordinator", "label": "EndTxn(COMMIT)" },
    { "from": "coordinator", "to": "partition0", "label": "Write COMMIT marker" },
    { "from": "coordinator", "to": "partition1", "label": "Write COMMIT marker" }
  ],
  "annotations": {
    "coordinator": "Manages transaction state and coordinates two-phase commit across partitions",
    "producer": "Must have unique transactional.id for zombie fencing"
  }
}
\`\`\`

## Consume-Transform-Produce Pattern

The most common exactly-once use case: read from one topic, process, write to another:

\`\`\`playground
{
  "title": "Exactly-Once Stream Processing Pattern",
  "language": "python",
  "code": "from kafka import KafkaProducer, KafkaConsumer\\n\\ndef process_payment_stream():\\n    consumer = KafkaConsumer(\\n        'raw-payments',\\n        bootstrap_servers=['broker1:9092'],\\n        isolation_level='read_committed',\\n        enable_auto_commit=False\\n    )\\n    \\n    producer = KafkaProducer(\\n        bootstrap_servers=['broker1:9092'],\\n        enable_idempotence=True,\\n        transactional_id='payment-processor-v2'\\n    )\\n    \\n    producer.init_transactions()\\n    \\n    while True:\\n        records = consumer.poll(timeout_ms=1000)\\n        if records:\\n            producer.begin_transaction()\\n            \\n            # Process each payment\\n            for topic_partition, messages in records.items():\\n                for message in messages:\\n                    payment = json.loads(message.value)\\n                    \\n                    # Validate and enrich payment\\n                    validated = validate_payment(payment)\\n                    enriched = enrich_with_fraud_score(validated)\\n                    \\n                    # Write to processed topic\\n                    producer.send('processed-payments', \\n                                key=payment['id'].encode(),\\n                                value=json.dumps(enriched).encode())\\n            \\n            # Commit consumer offsets within transaction\\n            producer.send_offsets_to_transaction(\\n                consumer.position(),\\n                consumer.group_id\\n            )\\n            \\n            # Atomic commit - all or nothing\\n            producer.commit_transaction()\\n            \\nprocess_payment_stream()",
  "runnable": false
}
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

\`\`\`quiz
{
  "title": "Testing Your Understanding of Exactly-Once Semantics",
  "questions": [
    {
      "question": "What happens when an idempotent producer retries a message with sequence number 42 that was already written?",
      "options": [
        "The broker writes it again, creating a duplicate",
        "The broker rejects the message with an error",
        "The broker silently acknowledges without writing",
        "The producer crashes with a fatal exception"
      ],
      "answer": 2,
      "explanation": "The broker maintains a map of (PID, Partition) → last sequence number. If it receives a duplicate sequence number, it silently acknowledges success without writing the message again."
    },
    {
      "question": "Which consumer isolation level will see messages from aborted transactions?",
      "options": [
        "read_committed only",
        "read_uncommitted only",
        "Both read_committed and read_uncommitted",
        "Neither isolation level"
      ],
      "answer": 1,
      "explanation": "Only read_uncommitted consumers see all messages including those from aborted transactions. read_committed consumers filter out messages from uncommitted or aborted transactions."
    },
    {
      "question": "What is the main limitation of idempotent producers compared to transactional producers?",
      "options": [
        "Idempotent producers are slower",
        "Idempotent producers only work within a single partition and session",
        "Idempotent producers require more memory",
        "Idempotent producers don't support compression"
      ],
      "answer": 1,
      "explanation": "Idempotent producers only guarantee exactly-once within a single partition and single producer session. The PID changes on restart, and they can't coordinate across multiple partitions or with consumer offset commits."
    }
  ]
}
\`\`\`

## Performance Impact

| Feature | Throughput Impact |
|---------|------------------|
| Idempotent producer | ~5-10% overhead (sequence number tracking) |
| Transactional producer | ~10-20% overhead (coordinator round trips) |
| read_committed consumer | Slight latency increase (waits for commit markers) |

For most production workloads, the overhead is acceptable given the correctness guarantees.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Kafka achieves exactly-once semantics through two complementary mechanisms: idempotent producers (deduplication via sequence numbers) and transactions (atomic multi-partition writes with consumer offset commits)",
    "Idempotent producers prevent duplicates within a single partition and session, while transactional producers enable exactly-once across multiple partitions and handle producer restarts",
    "The consume-transform-produce pattern enables end-to-end exactly-once processing by atomically committing both output messages and consumer offsets in a single transaction",
    "Consumers must use isolation.level=read_committed to only see messages from committed transactions",
    "Exactly-once semantics adds 5-20% performance overhead but provides crucial correctness guarantees for critical applications like financial processing"
  ]
}
\`\`\``,
    },
    {
      id: "kafka-architecture",
      slug: "kafka-architecture-walkthrough",
      title: "Kafka: Architecture Walkthrough",
      content: `# Kafka: Architecture Walkthrough

Let us tie together all components into a complete picture of how Kafka operates end-to-end.

\`\`\`concept
{
  "title": "Kafka as a Distributed Log",
  "variant": "mental-model",
  "content": "Think of Kafka as a distributed, append-only file system where each file (partition) is replicated across multiple machines. Producers append records to the end of these files, while consumers read from any position. This simple abstraction—treating messages as an immutable log—enables both high throughput and fault tolerance."
}
\`\`\`

## Complete Architecture

\`\`\`sysdiag
{
  "title": "Kafka Cluster Overview",
  "width": 800,
  "height": 400,
  "nodes": [
    { "id": "p1", "label": "Producer A", "x": 50, "y": 100, "kind": "client" },
    { "id": "p2", "label": "Producer B", "x": 50, "y": 200, "kind": "client" },
    { "id": "b1", "label": "Broker 1\\nController", "x": 250, "y": 100, "kind": "service" },
    { "id": "b2", "label": "Broker 2", "x": 400, "y": 100, "kind": "service" },
    { "id": "b3", "label": "Broker 3", "x": 550, "y": 100, "kind": "service" },
    { "id": "c1", "label": "Consumer Group A", "x": 700, "y": 100, "kind": "client" },
    { "id": "c2", "label": "Consumer Group B", "x": 700, "y": 200, "kind": "client" }
  ],
  "edges": [
    { "from": "p1", "to": "b1", "label": "write P0" },
    { "from": "p2", "to": "b2", "label": "write P1" },
    { "from": "b1", "to": "b2", "label": "replicate" },
    { "from": "b1", "to": "b3", "label": "replicate" },
    { "from": "b2", "to": "b3", "label": "replicate" },
    { "from": "b1", "to": "c1", "label": "read P0" },
    { "from": "b2", "to": "c1", "label": "read P1" },
    { "from": "b3", "to": "c2", "label": "read P2" }
  ],
  "annotations": {
    "b1": "Acts as leader for some partitions and controller for cluster metadata",
    "c1": "Each consumer group reads all partitions independently",
    "b2": "Follower for some partitions, leader for others"
  }
}
\`\`\`

## Produce Path End-to-End

\`\`\`steps
{
  "title": "Producer Send Flow",
  "steps": [
    {
      "title": "1. Serialization & Partitioning",
      "content": "Producer serializes key/value to bytes. Partitioner hashes key (or round-robins if null) to select partition 1 of 3 total."
    },
    {
      "title": "2. Batch Accumulation",
      "content": "Records accumulate in memory buffers per partition. Batching amortizes network overhead—linger.ms=5ms, batch.size=16KB."
    },
    {
      "title": "3. Send to Leader",
      "content": "Sender thread transmits batch to Broker 1 (current leader for partition 1). Metadata is cached and refreshed on failure."
    },
    {
      "title": "4. Broker Validation & Append",
      "content": "Leader validates CRC, size limits, then appends to active segment file. Segment flushed to disk per flush.ms settings."
    },
    {
      "title": "5. Replication & Acknowledgment",
      "content": "With acks=all, leader waits for ISR followers (Brokers 2,3) to fetch and acknowledge before sending ACK to producer."
    }
  ]
}
\`\`\`

## Consume Path End-to-End

\`\`\`trace
{
  "title": "Consumer Poll Trace",
  "language": "python",
  "code": "# Consumer code\\nconsumer = KafkaConsumer(\\n    'orders',\\n    group_id='order-service',\\n    enable_auto_commit=False\\n)\\n\\nfor msg in consumer:\\n    process_order(msg)\\n    consumer.commit_async()",
  "frames": [
    { "line": 1, "vars": {}, "note": "Consumer starts, contacts group coordinator" },
    { "line": 6, "vars": { "msg.partition": 0, "msg.offset": 5000 }, "note": "Assigned partitions [0,1], fetching from offset 5000" },
    { "line": 7, "vars": { "processing": "order-12345" }, "stdout": "Processing order-12345\\n", "note": "Application logic processes message" },
    { "line": 8, "vars": { "committed_offset": 5001 }, "note": "Offset 5001 committed to __consumer_offsets topic" }
  ],
  "speed": 1000
}
\`\`\`

## Failure Scenarios

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Broker crash (leader) | Controller detects via heartbeat | New leader elected from ISR. Producers/consumers refresh metadata. |
| Broker crash (follower) | Removed from ISR after replica.lag.time.max.ms | Remaining ISR continues. When broker recovers, it truncates to last checkpoint and re-fetches missing data. |
| Producer crash mid-transaction | Transaction coordinator timeout (transaction.timeout.ms) | Transaction aborted. Uncommitted messages remain invisible to read_committed consumers. |
| Consumer crash | Missing heartbeat (session.timeout.ms=10s) triggers rebalance | Partitions reassigned to remaining consumers. Processing resumes from last committed offset. |
| Network partition | ZooKeeper/KRaft quorum maintains consensus | ISR shrinks. If ISR < min.insync.replicas, writes rejected (fail-safe). |
| Disk full | Broker health check | Log retention/compaction frees space per retention.bytes. Alert triggers capacity expansion. |

\`\`\`callout
{
  "type": "warning",
  "title": "ISR Shrinkage Risk",
  "content": "When network partitions occur, the ISR (In-Sync Replica) set may shrink below min.insync.replicas. In this state, producers with acks=all will receive NOT_ENOUGH_REPLICAS exceptions—this is by design to prevent data loss, but requires operational monitoring."
}
\`\`\`

## Data Flow Patterns

### Pattern 1: Fan-Out
One topic feeds multiple independent consumer groups, each processing all messages:

\`\`\`mermaid
graph LR
    P[Producers] --> T[Topic: events]
    T --> C1[Analytics Group]
    T --> C2[Search Indexer]
    T --> C3[Alerting System]
\`\`\`

### Pattern 2: Stream Processing Pipeline
Consume-transform-produce chains for enriched data:

\`\`\`mermaid
graph LR
    P[Raw Events] --> T1[raw-events]
    T1 --> SP1[Stream Processor]
    SP1 --> T2[enriched-events]
    T2 --> SP2[Aggregator]
    SP2 --> T3[metrics]
    T3 --> D[Dashboard]
\`\`\`

### Pattern 3: Event Sourcing with Compacted Topics
Maintain latest state per key:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Regular Topic",
    "code": "Offset | Key | Value\\n1      | u1  | {name: \\"Alice\\", city: \\"NYC\\"}\\n2      | u2  | {name: \\"Bob\\", city: \\"LA\\"}\\n3      | u1  | {name: \\"Alice\\", city: \\"SF\\"}  // old value remains\\n4      | u3  | {name: \\"Carol\\", city: \\"CHI\\"}"
  },
  "after": {
    "label": "Compacted Topic",
    "code": "Offset | Key | Value\\n2      | u2  | {name: \\"Bob\\", city: \\"LA\\"}\\n3      | u1  | {name: \\"Alice\\", city: \\"SF\\"}  // latest per key\\n4      | u3  | {name: \\"Carol\\", city: \\"CHI\\"}"
  }
}
\`\`\`

## Summary of Techniques

\`\`\`takeaways
{
  "title": "Architecture Techniques",
  "items": [
    "Sequential append + page cache enables 100K+ msgs/sec per broker",
    "Zero-copy sendfile() transfers data from disk to network without user-space copies",
    "Partitions provide horizontal scaling; consumer groups provide parallel processing",
    "Per-partition ordering guarantees enable event sourcing and CQRS patterns",
    "ISR replication with leader election provides <10s failure recovery",
    "Idempotent producers + transactions enable exactly-once semantics at cost of ~5-10% throughput"
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Architecture Check",
  "questions": [
    {
      "question": "Why does Kafka append messages to log files instead of using a database?",
      "options": [
        "Databases don't support replication",
        "Sequential I/O is faster than random I/O on spinning disks",
        "Log files are easier to backup",
        "Java doesn't have good database drivers"
      ],
      "answer": 1,
      "explanation": "Sequential writes to disk achieve throughput limited by disk bandwidth rather than seek latency, enabling hundreds of megabytes per second on commodity hardware."
    },
    {
      "question": "What happens when a consumer group has more consumers than partitions?",
      "options": [
        "Kafka creates additional partitions automatically",
        "Extra consumers remain idle until partitions increase",
        "Kafka balances load by splitting partition data",
        "The group coordinator rejects extra consumers"
      ],
      "answer": 1,
      "explanation": "Each partition is assigned to exactly one consumer in a group. Extra consumers wait idle, which is why partition count should match expected consumer concurrency."
    },
    {
      "question": "With acks=all and min.insync.replicas=2, what occurs if only one broker is available?",
      "options": [
        "Writes succeed with warning",
        "Writes fail with NOT_ENOUGH_REPLICAS",
        "Kafka temporarily reduces min.insync.replicas",
        "The single broker handles all replication"
      ],
      "answer": 1,
      "explanation": "Kafka enforces the durability contract—if ISR size drops below min.insync.replicas, writes are rejected to prevent potential data loss."
    }
  ]
}
\`\`\``,
    },
  ],
};
