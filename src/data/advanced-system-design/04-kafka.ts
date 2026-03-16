import { Module } from "../types";

export const kafkaModule: Module = {
  id: "design-kafka",
  title: "Designing Apache Kafka",
  description:
    "Deep dive into Kafka's architecture: topics, partitions, consumer groups, log-structured storage, replication with leader election, and exactly-once semantics.",
  lessons: [
    {
      id: "kafka-requirements",
      slug: "kafka-requirements",
      title: "Kafka: Requirements & Motivation",
      content: `# Kafka: Requirements & Motivation

Apache Kafka was originally developed at LinkedIn (2011) to handle the massive stream of activity events -- page views, ad impressions, searches, and profile updates. Traditional message queues (RabbitMQ, ActiveMQ) could not keep up with LinkedIn's throughput demands.

## The Problem

LinkedIn needed to:
- Ingest **millions of events per second** from hundreds of services
- Deliver events to multiple consumers (real-time analytics, search indexing, data warehousing) without duplication of effort
- Retain data for days (not just until consumed) so consumers can reprocess
- Handle bursts without backpressure collapsing the system

## Functional Requirements

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

## Why Not a Traditional Message Queue?

| Property | Traditional MQ | Kafka |
|----------|---------------|-------|
| Delivery model | Push to consumers | Pull by consumers |
| Message lifetime | Deleted after consumption | Retained by time/size policy |
| Ordering | Per-queue | Per-partition |
| Consumer tracking | Broker tracks per-message ACKs | Consumer tracks its own offset |
| Throughput | ~10K msg/sec | ~1M msg/sec |
| Replay | Not supported | Seek to any offset |

The key insight: Kafka treats the message stream as an **immutable, append-only log**. This simplifies the broker (no per-message tracking), enables replay, and allows sequential I/O for maximum throughput.

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

## Key Takeaway

Kafka reimagined messaging as a distributed, replicated, append-only log. This design enables million-message-per-second throughput, multi-consumer fan-out, and message replay -- capabilities that traditional message queues cannot match at scale.`,
    },
    {
      id: "kafka-topics-partitions",
      slug: "kafka-topics-partitions",
      title: "Topics, Partitions & Consumer Groups",
      content: `# Topics, Partitions & Consumer Groups

Kafka's core abstraction is the **topic** -- a named, ordered stream of messages. Topics are split into **partitions** for parallelism, and **consumer groups** enable scalable consumption.

## Topics

A topic is a logical category for messages. Producers write to topics, consumers read from topics.

\`\`\`
Topic: "user-events"

  Message 1: {user: "alice", action: "login"}
  Message 2: {user: "bob", action: "click"}
  Message 3: {user: "alice", action: "purchase"}
  ...
\`\`\`

Topics are append-only. Messages are immutable once written. Each message has an **offset** -- a monotonically increasing integer that uniquely identifies it within a partition.

## Partitions

A topic is divided into one or more partitions. Each partition is an independent, ordered, append-only log.

\`\`\`
Topic "user-events" with 3 partitions:

Partition 0: [msg0] [msg3] [msg6] [msg9]  ...
Partition 1: [msg1] [msg4] [msg7] [msg10] ...
Partition 2: [msg2] [msg5] [msg8] [msg11] ...

Each partition:
  - Has its own offset counter (0, 1, 2, ...)
  - Is stored on one broker (leader) + replicas
  - Guarantees order within the partition
\`\`\`

### Partition Key Routing

Producers choose which partition a message goes to:
1. **No key:** Round-robin across partitions (even distribution)
2. **With key:** \`hash(key) % num_partitions\` (all messages with the same key go to the same partition)

\`\`\`
Producer sends: key="alice", value={action: "login"}

  hash("alice") % 3 = 1  --> Partition 1

All of alice's events are in Partition 1, in order.
\`\`\`

This is critical: Kafka only guarantees ordering **within a partition**. If you need all events for a user to be ordered, use the user ID as the partition key.

## Consumer Groups

A consumer group is a set of consumers that cooperate to consume a topic. Each partition is assigned to exactly **one** consumer in the group.

\`\`\`
Topic "user-events" (3 partitions)
Consumer Group "analytics-service" (3 consumers)

  Partition 0 --> Consumer A
  Partition 1 --> Consumer B
  Partition 2 --> Consumer C

Each message is processed by exactly ONE consumer in the group.
\`\`\`

### Scaling Consumers

\`\`\`
Scenario 1: 3 partitions, 2 consumers
  Consumer A: Partitions 0, 1
  Consumer B: Partition 2
  (A does more work)

Scenario 2: 3 partitions, 3 consumers
  Consumer A: Partition 0
  Consumer B: Partition 1
  Consumer C: Partition 2
  (perfectly balanced)

Scenario 3: 3 partitions, 4 consumers
  Consumer A: Partition 0
  Consumer B: Partition 1
  Consumer C: Partition 2
  Consumer D: IDLE (no partition to consume)
  (max parallelism = partition count!)
\`\`\`

**Key insight:** The number of partitions sets the **maximum parallelism** for a consumer group. You cannot have more active consumers than partitions.

### Multiple Consumer Groups

Different consumer groups consume the same topic **independently**:

\`\`\`
Topic "user-events" (3 partitions)

Consumer Group "analytics":
  Consumer A1 --> P0, P1
  Consumer A2 --> P2

Consumer Group "search-indexer":
  Consumer S1 --> P0, P1, P2

Both groups get ALL messages.
Each group tracks its own offsets independently.
\`\`\`

## Offset Management

Each consumer tracks its position (offset) in each partition:

\`\`\`
Consumer Group "analytics"
  Partition 0: committed offset = 1042  (processed up to msg 1042)
  Partition 1: committed offset = 987
  Partition 2: committed offset = 1105

Consumer can:
  1. Continue from committed offset (normal)
  2. Reset to earliest offset (reprocess everything)
  3. Seek to a specific offset or timestamp
\`\`\`

Offsets are stored in a special internal topic: \`__consumer_offsets\`. This makes offset tracking distributed and fault-tolerant.

## Rebalancing

When consumers join or leave a group, Kafka **rebalances** partition assignments:

1. Consumer C crashes
2. Kafka detects missing heartbeat
3. Coordinator triggers rebalance
4. Partitions previously owned by C are redistributed
5. Remaining consumers pick up C's partitions and resume from the last committed offset

## Key Takeaway

Topics provide logical message streams, partitions provide parallelism and ordering, and consumer groups provide scalable consumption. The partition count determines maximum parallelism, and offset tracking enables replay and exactly-once processing. This three-layer abstraction is what makes Kafka suitable for both real-time streaming and batch reprocessing.`,
    },
    {
      id: "kafka-replication",
      slug: "kafka-replication-leader-election",
      title: "Replication & Leader Election",
      content: `# Replication & Leader Election

Kafka replicates each partition across multiple brokers for fault tolerance. Each partition has a **leader** that handles all reads and writes, and **followers** that replicate the leader's log.

## Replication Model

\`\`\`
Topic "orders" Partition 0 (replication factor = 3)

  Broker 1 [LEADER]    Broker 2 [FOLLOWER]  Broker 3 [FOLLOWER]
  +---------------+    +---------------+    +---------------+
  | offset 0: A   |    | offset 0: A   |    | offset 0: A   |
  | offset 1: B   |    | offset 1: B   |    | offset 1: B   |
  | offset 2: C   |    | offset 2: C   |    | offset 2: C   |
  | offset 3: D   |    | offset 3: D   |    |               |
  +---------------+    +---------------+    +---------------+
        ^                    ^                    ^
        |                    |                    |
     Producers &        In-Sync             Lagging (will
     Consumers          Replica (ISR)       catch up)
\`\`\`

**Rules:**
- All produces and consumes go through the **leader**
- Followers continuously fetch from the leader and append to their local log
- Followers that are caught up are in the **In-Sync Replica set (ISR)**

## In-Sync Replicas (ISR)

The ISR is the set of replicas (including the leader) that are fully caught up with the leader's log. A replica is removed from the ISR if it falls behind by more than \`replica.lag.time.max.ms\` (default: 30 seconds).

\`\`\`
ISR Dynamics
============

Time T1: ISR = {Broker1 (leader), Broker2, Broker3}
  All caught up.

Time T2: Broker3 has network issues, falls behind
  ISR = {Broker1 (leader), Broker2}
  Broker3 is removed from ISR.

Time T3: Broker3 recovers, catches up
  ISR = {Broker1 (leader), Broker2, Broker3}
  Broker3 is added back to ISR.
\`\`\`

## Write Acknowledgment (acks)

Producers configure how many replicas must acknowledge a write:

| acks | Behavior | Durability | Latency |
|------|----------|-----------|---------|
| 0 | Fire and forget | May lose data | Lowest |
| 1 | Leader ACKs | Lose data if leader crashes before replication | Low |
| all (-1) | All ISR replicas ACK | No data loss if at least one ISR survives | Highest |

\`\`\`
acks=all Write Flow
===================

Producer --> Broker 1 (Leader)
               |
               +--> Write to local log
               |
               +--> Wait for Broker 2 (ISR) to replicate
               +--> Wait for Broker 3 (ISR) to replicate
               |
               +--> All ISR replicas confirmed
               |
Producer <-- ACK (message is durable)
\`\`\`

With \`acks=all\` and \`min.insync.replicas=2\`, the producer gets an error if fewer than 2 replicas are in-sync. This prevents writes from being acknowledged with insufficient durability.

## Leader Election

When a leader broker fails, Kafka must elect a new leader from the ISR:

\`\`\`
Leader Election Flow
====================

1. Broker 1 (leader for Partition 0) crashes
   |
   v
2. ZooKeeper / KRaft detects broker failure
   |
   v
3. Controller (a special broker) picks a new leader
   from the ISR: {Broker 2, Broker 3}
   |
   v
4. Broker 2 is elected as new leader
   |
   v
5. Controller notifies all brokers of new leadership
   |
   v
6. Producers and consumers discover new leader
   via metadata refresh
\`\`\`

### Unclean Leader Election

If ALL ISR replicas are down, Kafka faces a choice:
- **Wait** for an ISR replica to recover (may be unavailable for a while)
- **Elect a non-ISR replica** (unclean election -- may lose messages)

This is configured by \`unclean.leader.election.enable\` (default: false). For most systems, availability of a non-ISR leader with potential data loss is worse than temporary unavailability.

## KRaft: Replacing ZooKeeper

Traditional Kafka relied on ZooKeeper for metadata management and controller election. KRaft (Kafka Raft) replaces ZooKeeper with a built-in Raft-based consensus protocol:

\`\`\`
Traditional:
  Kafka Brokers <--> ZooKeeper Ensemble
  (separate cluster to manage)

KRaft (Kafka 3.3+):
  Kafka Brokers with built-in Raft
  Controller quorum among designated broker nodes
  No external dependency
\`\`\`

**Benefits of KRaft:**
1. Simpler operations (no ZooKeeper to manage)
2. Faster controller failover
3. Supports millions of partitions (ZooKeeper had scaling limits)

## Key Takeaway

Kafka's replication model with ISR provides a tunable trade-off between durability and latency. The \`acks=all\` setting with \`min.insync.replicas\` guarantees no data loss for acknowledged writes. Leader election from the ISR ensures that the new leader has all committed data, maintaining consistency across failovers.`,
    },
    {
      id: "kafka-log-storage",
      slug: "kafka-log-structured-storage",
      title: "Log-Structured Storage Engine",
      content: `# Log-Structured Storage Engine

Kafka's performance comes from treating each partition as an **append-only, sequential log** stored on disk. This design exploits the performance characteristics of modern hardware.

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

\`\`\`
Disk Performance Comparison
============================

Operation              HDD         SSD
Random read (4KB)      ~100 IOPS   ~100K IOPS
Sequential read        ~100 MB/s   ~500 MB/s

Sequential is 1000x faster on HDD, 5x faster on SSD.

Kafka writes: append to end of file  --> SEQUENTIAL
Kafka reads: scan forward from offset --> SEQUENTIAL

No seek required. No random I/O. This is why Kafka
can match or exceed network speed on commodity hardware.
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

## Key Takeaway

Kafka's storage engine achieves extraordinary throughput by embracing sequential I/O, leveraging the OS page cache, and using zero-copy transfers. The log-segment architecture with sparse indexes provides efficient offset lookups without sacrificing write speed. This design allows a single Kafka broker to handle hundreds of MB/sec of throughput on commodity hardware.`,
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
