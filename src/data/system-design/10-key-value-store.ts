import { Module } from "../types";

export const keyValueStoreModule: Module = {
  id: "sd-10",
  title: "Design a Key-Value Store",
  description:
    "Design a distributed key-value store with high availability, scalability, and tunable consistency using techniques like consistent hashing and LSM trees.",
  lessons: [
    {
      id: "sd-10-01",
      slug: "key-value-store-requirements",
      title: "Requirements & Estimation",
      content: `# Key-Value Store: Requirements & Estimation

## What Is a Key-Value Store?

A key-value store is a non-relational database where data is stored as key-value pairs. Think of it as a giant distributed hash map. Examples include Amazon DynamoDB, Apache Cassandra, and Redis (though Redis is typically in-memory).

Keys are unique identifiers (usually strings), and values can be anything: strings, JSON, binary blobs, etc.

## Functional Requirements

1. **put(key, value)** — Insert or update a value associated with a key.
2. **get(key)** — Retrieve the value associated with a key.
3. **delete(key)** — Remove a key-value pair.
4. **Tunable consistency** — Allow the caller to choose between strong consistency and eventual consistency per operation.
5. **Automatic partitioning** — Data is distributed across nodes automatically.
6. **Replication** — Each key is stored on multiple nodes for durability.

## Non-Functional Requirements

- **High availability** — The system remains operational even when some nodes fail.
- **Scalability** — Scales horizontally by adding more nodes.
- **Low latency** — Single-digit millisecond reads and writes.
- **Durability** — Once a write is acknowledged, it is not lost.

## CAP Theorem Reminder

The CAP theorem states that a distributed system can provide at most two of three guarantees:
- **Consistency** — Every read returns the most recent write.
- **Availability** — Every request receives a response (success or failure).
- **Partition tolerance** — The system works despite network failures between nodes.

Since network partitions are unavoidable in distributed systems, we must choose between **CP** (consistent but may be unavailable during partitions) and **AP** (available but may return stale data during partitions). Our design supports **tunable consistency** — the user picks the trade-off per operation.

## Back-of-the-Envelope Estimation

Assume: 100 million keys, average key size 50 bytes, average value size 10 KB, replication factor 3.

| Metric | Calculation |
|--------|------------|
| Raw data size | 100M x 10 KB = **1 TB** |
| With replication (3x) | **3 TB** total across the cluster |
| Metadata per key | ~100 bytes (timestamps, version, hash) |
| Metadata total | 100M x 100 bytes = **~10 GB** |
| Write throughput | 10K writes/sec x 10 KB = **~100 MB/sec** |
| Read throughput | 50K reads/sec x 10 KB = **~500 MB/sec** |

With 10 nodes, each node handles ~100 GB of data and ~5K reads/sec — well within the capacity of modern hardware.

## Key Takeaways

- A key-value store provides simple get/put/delete operations but must handle complex distributed systems challenges underneath.
- The CAP theorem forces a fundamental choice between consistency and availability during network partitions.
- Tunable consistency gives callers the flexibility to make this trade-off per operation.
- Replication multiplies storage needs but is essential for durability and availability.
- Horizontal scaling by adding nodes is the primary growth strategy.
`,
    },
    {
      id: "sd-10-02",
      slug: "key-value-store-high-level-design",
      title: "High-Level Design",
      content: `# Key-Value Store: High-Level Design

## Architecture Overview

\`\`\`mermaid
graph TD
    Client[Client] --> Coord[Coordinator Node]
    Coord -->|replicate| N1[Partition 1]
    Coord -->|replicate| N2[Partition 2]
    Coord -->|replicate| N3[Partition 3]
    N1 -.->|sync| N2
    N2 -.->|sync| N3
    N3 -.->|sync| N1
\`\`\`

\`\`\`
         ┌──────────┐
         │  Client   │
         └────┬─────┘
              │
              v
     ┌────────────────┐
     │  Coordinator    │  (any node can be coordinator)
     │  Node           │
     └───┬────┬────┬──┘
         │    │    │    replication
         v    v    v
     ┌─────┐┌─────┐┌─────┐
     │ N1  ││ N2  ││ N3  │   (replica nodes on hash ring)
     └─────┘└─────┘└─────┘
\`\`\`

## Consistent Hashing for Partitioning

To distribute keys across nodes, we use **consistent hashing**. Imagine nodes placed on a circular ring at positions determined by hashing their IDs. A key is assigned to the first node encountered when walking clockwise from the key's hash position.

\`\`\`
        Node A
         /    \\
    Key X      Node B      ← Key X maps to Node B
       |      /             (first node clockwise)
        \\    /
        Node C
\`\`\`

**Virtual nodes**: Each physical node maps to multiple positions on the ring. This prevents hot spots caused by uneven node distribution and allows heterogeneous hardware (a powerful node gets more virtual nodes).

When a node is added or removed, only keys between it and its predecessor need to move — minimizing data redistribution.

## Replication

Each key is replicated to **N** nodes (where N is the replication factor, typically 3). The key's primary node and the next N-1 nodes clockwise on the hash ring hold replicas.

To ensure replicas are on different physical machines, skip virtual nodes that map to the same physical server when selecting replica locations.

## Conflict Resolution

When multiple replicas accept writes concurrently (in an AP system), conflicts arise. Two main strategies:

### Vector Clocks
Each node maintains a vector of counters \`[N1:3, N2:1, N3:5]\` representing the version as seen by each node. When merging, if one vector dominates (every counter >=), the dominant version wins. If neither dominates, there is a conflict that must be resolved (by the application or by merging).

### Last-Write-Wins (LWW)
Attach a timestamp to each write. The write with the latest timestamp wins. Simple but can lose data — if two clients write simultaneously, one write is silently discarded.

**Vector clocks** are more correct but complex. **LWW** is simpler but may lose updates. Many systems (Cassandra) default to LWW but allow application-level conflict resolution.

## Tunable Consistency

Define three parameters:
- **N** = number of replicas (e.g., 3)
- **W** = number of replicas that must acknowledge a write for it to succeed
- **R** = number of replicas that must respond to a read

The rule: **if W + R > N, strong consistency is guaranteed** (at least one replica in the read set has the latest write).

| Configuration | Behavior |
|--------------|----------|
| W=1, R=1 | Fast but eventual consistency |
| W=N, R=1 | Slow writes, fast reads, strong consistency |
| W=1, R=N | Fast writes, slow reads, strong consistency |
| W=2, R=2 (N=3) | Balanced, strong consistency |

## Key Takeaways

- Consistent hashing with virtual nodes provides balanced data distribution with minimal redistribution when nodes change.
- Replication across multiple nodes provides both durability and availability.
- Vector clocks detect conflicts precisely but add complexity; LWW is simple but can lose concurrent writes.
- Tunable consistency (N, W, R parameters) lets callers choose their consistency-availability trade-off per operation.
- Any node can serve as a coordinator, enabling a fully decentralized architecture with no single point of failure.
`,
    },
    {
      id: "sd-10-03",
      slug: "key-value-store-write-read-path",
      title: "Deep Dive: Write Path & Read Path",
      content: `# Key-Value Store: Write Path & Read Path

## The Write Path (LSM Tree)

Most distributed key-value stores use a **Log-Structured Merge Tree (LSM Tree)** for writes. This design converts random writes into sequential writes, which are much faster on both SSDs and HDDs.

\`\`\`
Write Request
     │
     v
┌──────────────────┐
│  Write-Ahead Log  │   1. Append to WAL (durability)
│  (on disk)        │
└────────┬─────────┘
         │
         v
┌──────────────────┐
│  Memtable         │   2. Write to in-memory sorted structure
│  (in memory)      │      (e.g., red-black tree, skip list)
└────────┬─────────┘
         │  (when memtable is full)
         v
┌──────────────────┐
│  SSTable          │   3. Flush to disk as sorted file
│  (on disk)        │
└────────┬─────────┘
         │  (periodically)
         v
┌──────────────────┐
│  Compaction       │   4. Merge SSTables to reclaim space
│  (background)     │      and remove deleted/overwritten keys
└──────────────────┘
\`\`\`

### Step by Step:

1. **Write-Ahead Log (WAL)**: Every write is first appended to a sequential log on disk. If the node crashes before the memtable is flushed, the WAL can replay writes to recover data.

2. **Memtable**: The write is inserted into an in-memory sorted data structure. Writes to the memtable are fast because they are in-memory.

3. **SSTable Flush**: When the memtable reaches a size threshold (e.g., 64 MB), it is written to disk as a **Sorted String Table (SSTable)** — a file of key-value pairs sorted by key. This is a sequential write, which is very fast.

4. **Compaction**: Over time, multiple SSTables accumulate. A background compaction process merges them, discarding deleted keys (tombstones) and old versions. This keeps read performance from degrading.

## The Read Path

Reading is more complex because data may live in multiple places:

1. **Check the memtable** — If the key is in the current memtable, return it immediately. This is the fastest case.
2. **Check SSTables** — Search SSTables from newest to oldest. Since SSTables are sorted, binary search can locate the key efficiently.
3. **Return the first match** — The newest SSTable containing the key has the most recent value.

### Bloom Filters for Read Optimization

Without optimization, a read miss requires checking every SSTable — potentially dozens of files. A **Bloom filter** is a space-efficient probabilistic data structure that can tell you:
- **Definitely not in this SSTable** — Skip it (no disk I/O needed).
- **Possibly in this SSTable** — Check it (small chance of false positive).

Each SSTable has its own Bloom filter loaded in memory. This eliminates most unnecessary disk reads, dramatically improving read latency for keys that do not exist in older SSTables.

## Handling Deletes

LSM trees do not delete data in place. Instead, a **tombstone** marker is written for the key. During compaction, when the tombstone and the original value are merged, the key is permanently removed. Until compaction, the tombstone prevents the old value from being returned on reads.

## Key Takeaways

- The LSM tree converts random writes into sequential writes, achieving very high write throughput.
- The WAL ensures durability — no acknowledged write is lost even if the node crashes.
- SSTables are immutable sorted files on disk, making them simple and efficient to read with binary search.
- Bloom filters are critical for read performance, eliminating unnecessary disk I/O for most lookups.
- Compaction is essential maintenance — without it, read performance degrades as SSTables accumulate.
`,
    },
    {
      id: "sd-10-04",
      slug: "key-value-store-scaling",
      title: "Scaling & Trade-offs",
      content: `# Key-Value Store: Scaling & Trade-offs

## Failure Detection: Gossip Protocol

In a decentralized system with no master node, how does each node know which other nodes are alive? The **gossip protocol** spreads health information through the cluster:

1. Each node maintains a list of all nodes with a **heartbeat counter** and **timestamp**.
2. Periodically (e.g., every second), each node picks a random peer and sends its membership list.
3. The peer merges the received list with its own, keeping the higher heartbeat counter for each node.
4. If a node's heartbeat has not increased for a threshold period (e.g., 30 seconds), it is marked as suspected down.

Gossip is robust because it has no single point of failure and information eventually reaches all nodes, even in large clusters.

## Handling Temporary Failures: Hinted Handoff

When a node responsible for a key is temporarily down, we do not want writes to fail. **Hinted handoff** provides a solution:

1. The coordinator detects that the target replica node (say Node B) is unreachable.
2. Instead of failing, it writes the data to another healthy node (say Node D) with a **hint** that this data belongs to Node B.
3. When Node B comes back online, Node D forwards the hinted data to Node B and deletes its temporary copy.

This maintains write availability during temporary outages without permanently reassigning data.

\`\`\`
Normal:    Client → Coordinator → [Node A, Node B, Node C]

Node B down:
           Client → Coordinator → [Node A, Node D(hint for B), Node C]

Node B recovers:
           Node D → forwards hinted data → Node B
\`\`\`

## Anti-Entropy: Merkle Trees

Over time, replicas can drift out of sync due to missed updates, failed handoffs, or bugs. **Merkle trees** provide an efficient way to detect and repair inconsistencies:

A Merkle tree is a hash tree where:
- **Leaf nodes** contain the hash of a key-value pair or a range of keys.
- **Parent nodes** contain the hash of their children's hashes.
- The **root hash** summarizes the entire data set.

To synchronize two replicas:
1. Compare root hashes. If they match, the replicas are identical — done.
2. If they differ, compare child hashes recursively.
3. Only the branches with differing hashes need to be synchronized.

This is vastly more efficient than comparing every key-value pair. For a million keys, you might only need to transfer a few hundred differing entries rather than scanning all of them.

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| Consistency vs Availability | CP: reject writes during partition | AP: accept writes, resolve conflicts later |
| LSM Tree vs B-Tree | High write throughput, higher read cost | Balanced read/write, higher write cost |
| Vector Clocks vs LWW | No data loss, complex resolution | Simple, may lose concurrent writes |
| Gossip vs Centralized | No SPOF, eventual convergence | Faster detection, single point of failure |

## Putting It All Together

A production key-value store combines all these techniques:

- **Consistent hashing** for partitioning
- **Replication** with tunable N/W/R for consistency
- **LSM trees** for the storage engine
- **Gossip protocol** for failure detection
- **Hinted handoff** for temporary failure handling
- **Merkle trees** for anti-entropy repair
- **Vector clocks** or **LWW** for conflict resolution

## Key Takeaways

- The gossip protocol enables decentralized failure detection with no single point of failure.
- Hinted handoff maintains write availability during temporary node failures without data reassignment.
- Merkle trees allow efficient replica synchronization by comparing only the data ranges that differ.
- Every design choice in a distributed key-value store is a trade-off between consistency, availability, performance, and complexity.
- These techniques are not theoretical — they are used in production systems like Cassandra, DynamoDB, and Riak.
`,
    },
  ],
};
