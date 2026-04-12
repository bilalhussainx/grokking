import { Module } from "../types";

export const cassandraModule: Module = {
  id: "design-cassandra",
  title: "Designing Apache Cassandra",
  description: "Explore Cassandra's architecture: token ring partitioning, LSM-tree storage with SSTables, Bloom filters, and tunable consistency levels.",
  lessons: [
    {
      id: "cassandra-requirements",
      slug: "cassandra-requirements",
      title: "Cassandra: Requirements & Data Model",
      content: `Apache Cassandra was created at Facebook in 2008 to power inbox search — a workload demanding billions of writes per day with zero downtime and multi-datacenter resilience. It fuses Amazon Dynamo's peer-to-peer ring partitioning with Google Bigtable's structured, column-oriented data model into a single distributed database.

## Why Facebook Built Cassandra

The inbox search problem had a precise shape:
- **Massive write volume** — every sent message is a write; every read-receipt update is a write
- **Linear scalability** — capacity must grow by simply adding nodes
- **Multi-datacenter** — global user base, no acceptable single-DC outage
- **No single point of failure** — any node failure must be invisible to users

No existing database met all four constraints simultaneously. Cassandra was the answer.

\`\`\`concept
{ "title": "Query-Driven Design", "variant": "mental-model", "content": "Relational databases: normalize your schema first, then query it flexibly.\\n\\nCassandra flips this: design each table around the exact queries it must serve. Accept controlled data duplication as the price of predictable, sub-10ms reads at any scale.\\n\\nThe question is never 'what data do I have?' — it's always 'what queries must I answer?'" }
\`\`\`

## Functional Requirements

1. **Write** structured data (rows with columns) to named tables via CQL
2. **Read** data by partition key, optionally filtered by clustering columns
3. Support **wide rows** — a single partition can hold millions of sub-rows
4. CQL (Cassandra Query Language) provides familiar SQL-like syntax
5. No JOIN operations, no subqueries — by design, not limitation

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Write throughput | 100K+ writes/sec per node |
| Read latency | < 10ms for partition key lookups |
| Availability | 99.999% (five nines) |
| Scalability | Linear scale to 1,000+ nodes |
| Replication | Multi-datacenter, configurable per keyspace |

## The Data Model

Cassandra's hierarchy runs from cluster down to individual column values. Understanding each layer is essential before designing any table.

\`\`\`tabs
{ "tabs": [ { "label": "Keyspace", "icon": "🗄️", "content": "A **keyspace** is the top-level namespace — analogous to a database in SQL. It owns the replication configuration shared by all its tables.\\n\\n\`\`\`\\nCREATE KEYSPACE social\\n  WITH replication = {\\n    'class': 'NetworkTopologyStrategy',\\n    'dc1': 3\\n  };\\n\`\`\`\\n\\nAll tables in the keyspace inherit these replication settings. \`NetworkTopologyStrategy\` is the production-grade choice for multi-DC deployments — it lets you specify a replica count per datacenter." }, { "label": "Table", "icon": "📋", "content": "A **table** (historically called a column family) contains rows grouped by partition key. Unlike SQL, every Cassandra table is purpose-built for one specific query.\\n\\n\`\`\`\\nCREATE TABLE social.messages (\\n  user_id   TEXT,\\n  msg_time  TIMESTAMP,\\n  sender    TEXT,\\n  body      TEXT,\\n  PRIMARY KEY (user_id, msg_time)\\n) WITH CLUSTERING ORDER BY (msg_time DESC);\\n\`\`\`\\n\\nThe two-part \`PRIMARY KEY\` declaration is the single most important design decision for any Cassandra table." }, { "label": "Partition", "icon": "📦", "content": "A **partition** groups all rows sharing the same partition key value. This is the fundamental unit of data locality in Cassandra.\\n\\n- All rows in a partition are stored **co-located** on the same node(s)\\n- The partition key is hashed via Murmur3 to place data on the ring\\n- A single partition can hold millions of rows (wide partitions)\\n- Practical limit: keep partitions under ~100 MB to avoid read latency spikes on compaction" }, { "label": "Row & Column", "icon": "🔑", "content": "Within a partition, **rows** are uniquely identified and sorted by **clustering columns**.\\n\\n| user_id | msg_time | sender | body |\\n|---------|----------|--------|------|\\n| alice | 2024-03-01 | bob | Hello |\\n| alice | 2024-02-28 | charlie | Hi |\\n| alice | 2024-02-25 | bob | Hey |\\n\\n\`user_id = 'alice'\` is the partition — one set of nodes owns all of Alice's messages. \`msg_time DESC\` clustering means newest messages are at the top of the SSTable, so \`LIMIT 20\` is always a fast sequential scan." } ] }
\`\`\`

### Primary Key Anatomy

\`\`\`sql
CREATE TABLE messages (
    user_id           TEXT,
    message_timestamp TIMESTAMP,
    sender            TEXT,
    body              TEXT,
    PRIMARY KEY (user_id, message_timestamp)
) WITH CLUSTERING ORDER BY (message_timestamp DESC);
\`\`\`

| Component | Column | Role |
|-----------|--------|------|
| Partition key | \`user_id\` | Hashed via Murmur3 → determines owning node |
| Clustering key | \`message_timestamp\` | On-disk sort order within the partition |
| Regular columns | \`sender\`, \`body\` | Stored as-is, not indexed |

All rows in a partition are stored together on the same node — so \`WHERE user_id = 'alice' LIMIT 20\` is always a single-node, sequential read.

### Designing for Queries, Not Normalization

Relational design and Cassandra design are mirror images of each other. The same inbox query looks completely different in each paradigm:

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Relational: Normalize → Query Flexibly", "code": "-- One normalized table\\nCREATE TABLE messages (\\n  id           SERIAL PRIMARY KEY,\\n  sender_id    INT REFERENCES users(id),\\n  recipient_id INT REFERENCES users(id),\\n  body         TEXT,\\n  created_at   TIMESTAMP\\n);\\n\\n-- Any query works — at the cost of JOINs and sorts\\nSELECT m.body, u.name\\nFROM messages m\\nJOIN users u ON m.sender_id = u.id\\nWHERE m.recipient_id = 42\\nORDER BY m.created_at DESC\\nLIMIT 20;" }, "after": { "label": "Cassandra: Identify Query → Denormalize Around It", "code": "-- One table per access pattern\\nCREATE TABLE messages_by_recipient (\\n  recipient_id TEXT,\\n  created_at   TIMESTAMP,\\n  sender_id    TEXT,\\n  body         TEXT,\\n  PRIMARY KEY (recipient_id, created_at)\\n) WITH CLUSTERING ORDER BY (created_at DESC);\\n\\n-- Single-partition scan — no JOIN, no sort step\\nSELECT * FROM messages_by_recipient\\nWHERE recipient_id = '42'\\nLIMIT 20;" } }
\`\`\`

When you need a second query pattern — say, "get all messages *sent by* a user" — you create a second table partitioned by \`sender_id\`. The message body is stored twice. This is intentional: Cassandra trades storage space for guaranteed O(1) partition lookups regardless of cluster size.

\`\`\`callout
{ "type": "warning", "title": "The #1 Cassandra Modeling Mistake", "content": "Filtering on a non-partition-key column with \`ALLOW FILTERING\` forces Cassandra to scan **every partition in the entire cluster**. It defeats the architecture entirely. If you need \`ALLOW FILTERING\`, you need a new table with a different partition key — not a more permissive query flag." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "In PRIMARY KEY (user_id, message_timestamp), what is user_id's role?", "options": ["Controls the sort order within the partition", "Determines which node stores the data via consistent hashing", "Enforces global uniqueness across the entire cluster", "Acts as a secondary index for fast lookups"], "answer": 1, "explanation": "The partition key is hashed via Murmur3 to a token on the ring, which determines the owning node(s). The clustering key (message_timestamp) controls on-disk sort order within that partition." }, { "question": "Facebook built Cassandra in 2008 to solve which specific problem?", "options": ["Real-time ad click stream analytics", "Inbox search for billions of messages per day", "Video transcoding job queuing at scale", "Friend-graph traversal and recommendations"], "answer": 1, "explanation": "Cassandra was created at Facebook specifically for inbox search — a write-heavy workload requiring billions of daily writes, multi-datacenter operation, and zero single point of failure." }, { "question": "Why does Cassandra's query-driven design require storing some data in multiple tables?", "options": ["To satisfy multi-datacenter replication constraints automatically", "Because CQL has no INSERT INTO ... SELECT syntax", "Each table is purpose-built for one query shape, so different access patterns require separate tables with different partition keys", "To keep individual partition sizes below the 100 MB recommended limit"], "answer": 2, "explanation": "Query-driven design means each table answers exactly one query shape. If you need to query messages by recipient AND by sender, you create two tables — the data is duplicated but every query hits a single, co-located partition." }, { "question": "Which of the following is NOT supported in CQL — by architectural design?", "options": ["SELECT with WHERE filtering on the partition key", "CLUSTERING ORDER BY on clustering columns", "JOIN between two Cassandra tables", "INSERT with a TTL (time-to-live) on individual rows"], "answer": 2, "explanation": "Cassandra deliberately omits JOINs and subqueries. Every query must be answerable from a single table's partition structure. This is a conscious trade-off — not a missing feature — that enables predictable O(1) read paths at any scale." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Cassandra fuses Dynamo's peer-to-peer ring partitioning with Bigtable's column-oriented model — born at Facebook in 2008 for write-heavy, always-on inbox search.", "The partition key is the routing key: it is hashed via Murmur3 to place data on a specific node. The clustering key controls on-disk sort order within the partition.", "Design tables around queries, not entities. One access pattern = one table. Controlled data duplication is the accepted cost of O(1) reads.", "No JOINs, no subqueries, and no ALLOW FILTERING in production — these are architectural constraints that enable linear scalability, not arbitrary limitations.", "Five-nines availability and linear scalability are achievable because every node is equal (masterless) and reads always target a single, co-located partition."] }
\`\`\``,
    },
    {
      id: "cassandra-partitioning",
      slug: "cassandra-partitioning-token-ring",
      title: "Partitioning & Token Ring",
      content: `# Partitioning & Token Ring

Cassandra solves the distributed data placement problem with **consistent hashing on a token ring** — a technique that lets you add or remove nodes while moving only a small fraction of data, not everything.

\`\`\`concept
{ "title": "Why Not Just hash(key) % N?", "variant": "mental-model", "content": "Naive modular hashing assigns a key to bucket hash(key) % N. Works fine until N changes: add one node and almost every key remaps to a new node, triggering a massive cluster-wide migration. Consistent hashing fixes this by placing both keys AND nodes on the same fixed ring. Adding a node only steals a small arc of tokens from its neighbors — everything else stays exactly where it is." }
\`\`\`

## The Token Ring

Every node owns a **range of tokens** on a continuous hash ring. Cassandra's default Murmur3Partitioner maps partition keys to 64-bit signed integers spanning **-2^63 to 2^63-1**. To find the owner of a key, hash it, then walk clockwise until you hit a node boundary.

The animation below uses a simplified 12-slot ring to show how a single key traverses to its primary and replica nodes:

\`\`\`algoviz
{ "title": "Mapping 'alice' to Replica Nodes (Simplified 12-Slot Ring)", "type": "array", "data": ["B","B","B","C","C","C","D","D","D","A","A","A"], "frames": [ { "highlight": [], "label": "12-slot ring. Each node owns 3 consecutive slots: B(0–2), C(3–5), D(6–8), A(9–11). The physical ring wraps from slot 11 back to slot 0.", "stats": {} }, { "highlight": [4], "label": "Murmur3('alice') hashes to slot 4 in this simplified ring.", "stats": { "key": "alice", "hash": 4 } }, { "highlight": [3, 4, 5], "label": "Slot 4 falls in Node C's range (3–5). Node C is the PRIMARY replica.", "stats": { "key": "alice", "primary": "C" } }, { "highlight": [3, 4, 5, 6, 7, 8], "label": "RF=3: walk clockwise to Node D (slots 6–8) — 1st copy.", "stats": { "replica_1": "D" } }, { "highlight": [3, 4, 5, 6, 7, 8, 9, 10, 11], "label": "Continue to Node A (slots 9–11) — 2nd copy. Total: 3 replicas on C, D, A.", "stats": { "replicas": "C → D → A" } } ], "speed": 900 }
\`\`\`

In a real cluster the token range spans the full 64-bit space. The placement logic is identical: hash the partition key, find the first node clockwise that owns a token ≥ that hash value, then replicate to the next RF−1 distinct nodes.

## Virtual Nodes (vnodes)

Early Cassandra assigned each node **one token**. The problem: a single contiguous slice means failure dumps 100% of load on one neighbor, and adding a node only rebalances data from that one neighbor.

Virtual nodes fix this by assigning each node **many tokens** (Cassandra's default is 256). Each node owns hundreds of small, interleaved slices scattered around the ring.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Without vnodes (1 token per node)", "code": "4 nodes, each owns one contiguous 25% arc of the ring.\\n\\nNode A fails:\\n  Neighbor (Node B) absorbs 100% of A's range.\\n  Node B now handles 50% of all cluster traffic.\\n\\nAdding Node E:\\n  Only one neighbor transfers data.\\n  Other nodes are unaffected — load stays uneven." }, "after": { "label": "With vnodes (256 tokens per node, default)", "code": "4 nodes × 256 tokens = 1,024 small slices interleaved around the ring.\\n\\nNode A fails:\\n  A's 256 slices distribute across all remaining nodes.\\n  Each surviving node absorbs ~33% more load — spread evenly.\\n\\nAdding Node E:\\n  Automatically takes small slices from every existing node.\\n  No manual token recalculation or config change needed." } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "More vnodes ≠ Always Better", "content": "Each additional token introduces up to \`2 × (RF - 1)\` new ring neighbors. More neighbors means more combinations of concurrent failures that can make a token range unavailable. Cassandra's default of 256 vnodes per node is a deliberate tradeoff — increasing it blindly raises the probability of a partial outage." }
\`\`\`

Nodes with more hardware capacity can simply be assigned more vnodes — a clean way to build heterogeneous clusters without changing the ring's logical structure.

## Replication & Routing

The **Replication Factor (RF)** is set per keyspace and controls how many copies of each partition exist. How those copies are *placed* depends on the replication strategy.

\`\`\`tabs
{ "tabs": [ { "label": "SimpleStrategy", "icon": "🏠", "content": "For **single-datacenter** deployments only.\\n\\nReplicas are placed on the next RF-1 nodes clockwise after the primary — purely by ring position, with no awareness of racks or DCs:\\n\\n\`\`\`sql\\nCREATE KEYSPACE app\\nWITH replication = {\\n  'class': 'SimpleStrategy',\\n  'replication_factor': 3\\n};\\n\`\`\`\\n\\nWith RF=3 and \`'alice'\` landing on Node C, replicas go to **Node D** then **Node A**.\\n\\n> ⚠️ Never use SimpleStrategy for multi-DC clusters — it can place all replicas in the same physical rack, losing them all to a single switch failure." }, { "label": "NetworkTopologyStrategy", "icon": "🌐", "content": "For **multi-datacenter** production deployments. RF is configured independently per DC:\\n\\n\`\`\`sql\\nCREATE KEYSPACE prod\\nWITH replication = {\\n  'class': 'NetworkTopologyStrategy',\\n  'DC1': 3,\\n  'DC2': 2\\n};\\n\`\`\`\\n\\nWithin each DC, Cassandra walks clockwise and places replicas on nodes in **different racks**. A rack-level failure (shared power or top-of-rack switch) cannot eliminate all replicas for a partition.\\n\\n**Result:** 5 total replicas — 3 in DC1 (across 3 racks), 2 in DC2 (across 2 racks). Queries can be served locally in either DC even if the other is completely unreachable." }, { "label": "Token-Aware Routing", "icon": "🧭", "content": "Cassandra is **masterless** — every node is a peer and any node can coordinate any request.\\n\\nModern drivers use **token-aware routing**: the driver caches the cluster token map locally and computes \`hash(partition_key)\` on the client side, routing the request directly to the primary replica.\\n\\n**Without token-aware routing:**\\n\`Client → random coordinator → forward to primary → back to coordinator → back to client\`\\n\\n**With token-aware routing:**\\n\`Client → directly to primary replica → back to client\`\\n\\nOne fewer network round-trip — at high throughput this compounds significantly. If the primary is unavailable, the driver falls back to a replica automatically." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "A 4-node cluster (A→B→C→D clockwise) uses RF=3. A key hashes to a token owned by Node C. Which nodes hold replicas?", "options": ["A, B, C", "B, C, D", "C, D, A", "A, C, D"], "answer": 2, "explanation": "Node C is the primary. With RF=3, Cassandra walks clockwise: next is Node D (replica 1), then Node A (replica 2). Replicas land on C, D, and A." }, { "question": "What is the primary operational benefit of virtual nodes (vnodes)?", "options": [ "Faster Murmur3 hash computation", "Failed node's load spreads evenly across ALL remaining nodes", "Fewer network hops for read requests", "Eliminates the need for a replication factor" ], "answer": 1, "explanation": "With 256 vnodes per node, each node's token ownership is scattered across the ring in many small slices. When a node fails, those slices distribute to many different survivors — each absorbs a small increment of extra load rather than one neighbor absorbing 100%." }, { "question": "Why is NetworkTopologyStrategy required for multi-datacenter deployments?", "options": [ "SimpleStrategy cannot handle RF values greater than 2", "NetworkTopologyStrategy uses fewer total tokens than SimpleStrategy", "NetworkTopologyStrategy places replicas across racks and DCs, surviving rack-level failures", "NetworkTopologyStrategy compresses replication traffic between DCs" ], "answer": 2, "explanation": "NetworkTopologyStrategy is rack-aware: within each DC it skips nodes on already-used racks when placing replicas. A rack failure (power, switch) cannot eliminate all copies of a partition. SimpleStrategy ignores topology entirely and can cluster all replicas on the same rack." }, { "question": "A token-aware Cassandra driver reduces latency by:", "options": [ "Compressing the write payload before transmission", "Hashing the partition key locally and routing directly to the primary replica", "Batching multiple writes into a single coordinator request", "Bypassing the commit log for known-safe operations" ], "answer": 1, "explanation": "Token-aware drivers maintain a local copy of the cluster token map. They compute hash(partition_key) themselves, identify the owning node, and connect directly — avoiding the extra hop through a random coordinator node." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Cassandra uses consistent hashing (Murmur3, range -2^63 to 2^63-1) to map partition keys to token positions — adding or removing a node migrates only a small fraction of data, not the whole dataset.", "Virtual nodes (default 256/node) scatter each node's token ownership in small interleaved slices, distributing failure load evenly across the cluster and eliminating manual token recalculation.", "The Replication Factor (RF) determines how many copies exist per partition; NetworkTopologyStrategy places them across racks and DCs to survive rack-level outages.", "Cassandra is masterless — any node can coordinate, but token-aware drivers skip the coordinator entirely and route directly to the primary replica for lower latency.", "More vnodes improves load distribution on failure but increases ring neighbors, slightly raising the probability of a quorum outage; 256 is Cassandra's deliberate default balance." ] }
\`\`\``,
    },
    {
      id: "cassandra-write-path",
      slug: "cassandra-write-path",
      title: "Write Path: Memtable, SSTable & Compaction",
      content: `# Write Path: Memtable, SSTable & Compaction

Cassandra's write path is based on a **Log-Structured Merge Tree (LSM-tree)**, which converts random writes into sequential I/O for maximum throughput.

## Write Flow Overview

\`\`\`
Write Path
==========

Client WRITE
     |
     v
+------------------+
| 1. Commit Log    |  (append-only, sequential write to disk)
+------------------+
     |
     v
+------------------+
| 2. Memtable      |  (in-memory sorted data structure)
+------------------+
     |  (when full)
     v
+------------------+
| 3. SSTable       |  (immutable sorted file on disk)
+------------------+
     |  (periodically)
     v
+------------------+
| 4. Compaction     |  (merge multiple SSTables into one)
+------------------+
\`\`\`

## Step 1: Commit Log

Every write is first appended to the **commit log** -- a durable, append-only file on disk. This ensures that even if the node crashes, no acknowledged write is lost. The commit log is sequential I/O (fast).

## Step 2: Memtable

After the commit log, the write is inserted into the **memtable** -- an in-memory sorted data structure (typically a concurrent skip list or red-black tree).

\`\`\`
Memtable (in-memory, sorted by partition key + clustering key)
=============================================================

  alice:2024-03-01 -> {sender: "bob", body: "Hello"}
  alice:2024-02-28 -> {sender: "charlie", body: "Hi"}
  bob:2024-03-02   -> {sender: "alice", body: "Hey"}
  charlie:2024-03-01 -> {sender: "alice", body: "Yo"}
\`\`\`

**The write is now complete** and acknowledged to the client. Two sequential operations: commit log append + memtable insert. No random disk I/O. This is why Cassandra writes are extremely fast.

## Step 3: SSTable Flush

When the memtable reaches a size threshold (default: 64MB), it is flushed to disk as an **SSTable** (Sorted String Table) -- an immutable file with data sorted by key.

\`\`\`
SSTable File Structure
======================

+-------------------+
| Data Block        |  Sorted key-value pairs
+-------------------+
| Index Block       |  Sparse index: every Nth key -> offset
+-------------------+
| Summary           |  Sample of keys for fast range location
+-------------------+
| Bloom Filter      |  Probabilistic "is key in this file?" check
+-------------------+
| Compression Info  |  Metadata for decompression
+-------------------+
| Statistics        |  Min/max timestamps, key counts
+-------------------+
\`\`\`

SSTables are **immutable** -- once written, they are never modified. Updates and deletes create new entries (not in-place modifications).

## Step 4: Compaction

Over time, many SSTables accumulate. The same key may appear in multiple SSTables (due to updates). **Compaction** merges SSTables to:

1. Remove obsolete versions of keys (keep only the latest)
2. Remove tombstones (delete markers) that have expired
3. Reduce the number of files (improving read performance)

### Compaction Strategies

**Size-Tiered (STCS):** Groups SSTables of similar size and merges them. Good for write-heavy workloads. Can temporarily use 2x disk space during compaction.

\`\`\`
STCS: Merge SSTables of similar size
=====================================

[4MB] [4MB] [5MB] [3MB]  -->  [16MB]
                    merged into one larger SSTable
\`\`\`

**Leveled (LCS):** Organizes SSTables into levels. Level 0 receives flushes. Each higher level is 10x larger. SSTables within a level have non-overlapping key ranges. Better for read-heavy workloads (fewer files to check per read).

\`\`\`
LCS: Non-overlapping levels
============================

Level 0:  [a-z]  [a-m]  (may overlap -- fresh flushes)
Level 1:  [a-f] [g-m] [n-s] [t-z]  (non-overlapping, 10x size)
Level 2:  [a-c] [d-f] [g-i] ... [x-z]  (non-overlapping, 100x size)
\`\`\`

## Deletes: Tombstones

Deletes in an LSM-tree do not remove data immediately. Instead, a **tombstone** is written:

\`\`\`
DELETE FROM messages WHERE user_id='alice' AND timestamp='2024-03-01';

SSTable entry: alice:2024-03-01 -> TOMBSTONE (marked for deletion)
\`\`\`

The tombstone persists until compaction removes it (after a configurable grace period, default: 10 days). This ensures the delete propagates to all replicas before the tombstone is garbage collected.

## Key Takeaway

Cassandra's LSM-tree write path converts all writes to sequential I/O (commit log + memtable flush), achieving write throughput that far exceeds traditional B-tree databases. The trade-off is read amplification -- reads may need to check multiple SSTables -- which compaction and Bloom filters mitigate.`,
    },
    {
      id: "cassandra-read-path",
      slug: "cassandra-read-path",
      title: "Read Path & Bloom Filters",
      content: `# Read Path & Bloom Filters

Cassandra's read path must reconcile data scattered across an in-memory Memtable and potentially dozens of on-disk SSTables — a direct consequence of LSM-tree's write-optimized design. Bloom filters are the critical optimization that makes reads efficient despite this amplification.

\`\`\`concept
{ "title": "Read Amplification in LSM Trees", "variant": "mental-model", "content": "LSM trees trade write speed for read complexity. Writes always go to memory first, then flush to immutable SSTable files. Over time, a single partition key can exist in the Memtable, a row cache, and 10–50 separate SSTables. Without Bloom filters, every read would require checking every SSTable — a disk I/O per file. Bloom filters answer 'is this key probably here?' entirely in memory, in microseconds, skipping the vast majority of SSTables." }
\`\`\`

## The 7-Step Read Path

When a replica node receives a read request, it follows this ordered lookup sequence and merges the results at the end:

\`\`\`steps
{ "title": "Cassandra Read Path (per replica node)", "steps": [ { "title": "1. Memtable", "content": "Check the current in-memory write buffer. Any recent writes for this partition key live here, sorted in clustering-key order. These values participate in the final merge alongside on-disk data." }, { "title": "2. Row Cache (optional)", "content": "If the row cache is enabled, check for a cached full-row result from a previous read. A **cache hit** returns immediately, bypassing all on-disk lookups entirely. Disabled by default — it can consume large amounts of heap memory for wide rows." }, { "title": "3. Bloom Filters", "content": "For **each** SSTable, query its in-memory Bloom filter:\\n\\n- **Definitely NO** → skip this SSTable entirely (no disk I/O)\\n- **Maybe YES** → proceed to the partition index\\n\\nBloom filters live off-heap (outside the JVM heap) to avoid GC pressure. This is the single most impactful optimization on the read path." }, { "title": "4. Partition Index", "content": "A sparse index maps sampled partition keys to approximate byte offsets within the SSTable data file. This narrows the disk search to a small range, avoiding a full file scan." }, { "title": "5. Compression Offset Map", "content": "SSTables store data in compressed chunks. The offset map translates the byte offset from the partition index into the specific compressed block on disk that must be decompressed." }, { "title": "6. Read Data Block", "content": "Decompress and read the data block from disk. Extract the specific row(s) matching the partition key and any clustering column range specified in the query (e.g., \`WHERE user_id = 'alice' AND ts > '2024-01-01'\`)." }, { "title": "7. Merge Results", "content": "Combine data from the Memtable and all qualifying SSTables. Each column cell carries a **write timestamp** — the highest timestamp wins. Tombstones (delete markers) are timestamped writes that override any lower-timestamp values they cover." } ] }
\`\`\`

## Bloom Filters: The Key Optimization

\`\`\`concept
{ "title": "The Bloom Filter Guarantee", "variant": "rule", "content": "A Bloom filter gives a two-valued probabilistic answer to set membership:\\n\\n- **\\"Definitely NOT in set\\"** — 100% accurate, zero false negatives. You can safely skip this SSTable with certainty.\\n- **\\"Maybe in set\\"** — Probably correct, but a false positive is possible. You must verify by reading the actual SSTable.\\n\\nThis asymmetry is what makes Bloom filters safe to use for skipping disk reads: the worst case is an unnecessary disk read, not a missed result." }
\`\`\`

The mechanics: a Bloom filter maintains a bit array. When a key is inserted, \`k\` independent hash functions each map the key to one bit position and set it. To query a key, the same \`k\` functions are applied — if **any** computed bit position is unset, the key is provably absent.

\`\`\`trace
{ "title": "Bloom Filter: Insert 'alice', then query 'bob' and 'alice'", "language": "python", "code": "bits = [0] * 16\\n\\n# --- Insert 'alice' ---\\nbits[hash1('alice')] = 1  # hash1 -> index 3\\nbits[hash2('alice')] = 1  # hash2 -> index 7\\nbits[hash3('alice')] = 1  # hash3 -> index 12\\n\\n# --- Query 'bob' ---\\nif bits[hash1('bob')] and bits[hash2('bob')] and bits[hash3('bob')]:\\n    answer = 'MAYBE in SSTable'\\nelse:\\n    answer = 'DEFINITELY NOT -- skip SSTable'\\n\\n# --- Query 'alice' ---\\nif bits[hash1('alice')] and bits[hash2('alice')] and bits[hash3('alice')]:\\n    answer = 'MAYBE in SSTable'\\nelse:\\n    answer = 'DEFINITELY NOT -- skip SSTable'", "frames": [ { "line": 1, "vars": { "bits": "[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]" }, "note": "Empty 16-bit array. All bits unset. No keys encoded yet." }, { "line": 4, "vars": { "bits": "[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]" }, "note": "hash1('alice') = 3 -> set bit 3." }, { "line": 5, "vars": { "bits": "[0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0]" }, "note": "hash2('alice') = 7 -> set bit 7." }, { "line": 6, "vars": { "bits": "[0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0]" }, "note": "hash3('alice') = 12 -> set bit 12. 'alice' is now encoded across 3 bit positions." }, { "line": 9, "vars": { "bits": "[0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0]", "checking": "hash1('bob')=3 SET, hash2('bob')=5 UNSET" }, "note": "Query 'bob': hash2 lands on index 5, which is 0. Any unset bit proves absence." }, { "line": 12, "vars": { "answer": "DEFINITELY NOT -- skip SSTable" }, "note": "Bit 5 is unset -> 'bob' cannot be in this SSTable. Skip it. Zero disk I/O needed." }, { "line": 15, "vars": { "bits": "[0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0]", "checking": "hash1=3 SET, hash2=7 SET, hash3=12 SET" }, "note": "Query 'alice': all three hash positions are set (they were set during insert)." }, { "line": 16, "vars": { "answer": "MAYBE in SSTable" }, "note": "All bits set -> MAYBE. Must read partition index and data block to confirm 'alice' is actually present (not a false positive)." } ], "speed": 850 }
\`\`\`

### Impact at Scale

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Without Bloom Filters (50 SSTables)", "code": "# Reading partition key 'user:alice'\\n# Must probe every SSTable's partition index\\n\\nfor sstable in all_50_sstables:\\n    # disk I/O on every iteration\\n    offset = partition_index.lookup(sstable, 'user:alice')\\n    if offset:\\n        data = read_data_block(sstable, offset)  # more disk I/O\\n\\n# Result: up to 50 partition index reads\\n# Latency grows linearly with SSTable count" }, "after": { "label": "With Bloom Filters (1% FPR, 50 SSTables)", "code": "# Reading partition key 'user:alice'\\n# Bloom filter eliminates ~49 of 50 SSTables\\n\\nfor sstable in all_50_sstables:\\n    # in-memory microsecond check\\n    if bloom_filter[sstable].maybe_contains('user:alice'):\\n        # disk I/O -- rare!\\n        offset = partition_index.lookup(sstable, 'user:alice')\\n        if offset:\\n            data = read_data_block(sstable, offset)\\n\\n# Result: ~1-2 partition index reads (1 real + ~0.5 false positives)\\n# Latency nearly constant regardless of SSTable count" } }
\`\`\`

### Configuring the False Positive Rate

Cassandra lets you tune the Bloom filter false positive probability per table. The tradeoff is off-heap memory vs. unnecessary disk reads:

\`\`\`cql
-- Default: 1% false positive rate
ALTER TABLE messages WITH bloom_filter_fp_chance = 0.01;

-- Tighter: 0.1% FPR — ~50% more memory, eliminates more spurious SSTable reads
-- Good for hot tables with many SSTables and latency-sensitive reads
ALTER TABLE messages WITH bloom_filter_fp_chance = 0.001;

-- Disabled (fp_chance = 1.0)
-- Only useful for tables always accessed via range scans, never exact key lookups
ALTER TABLE messages WITH bloom_filter_fp_chance = 1.0;
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Bloom Filters Are Off-Heap", "content": "Cassandra stores Bloom filters outside the JVM managed heap. This prevents them from triggering Java garbage collection pauses regardless of their size. You can set \`bloom_filter_fp_chance\` aggressively low without worrying about GC latency spikes — a critical property for a database where p99 latency matters." }
\`\`\`

## Read Merge: Reconciling Multiple Versions

When a read touches multiple sources — the Memtable, and several SSTables that passed the Bloom filter — Cassandra merges their results using **cell-level timestamps**. Every write in Cassandra records a microsecond-resolution timestamp alongside the data.

| Source | Partition | Timestamp | Value |
|--------|-----------|-----------|-------|
| Memtable | alice | t = 3 | \`{body: "Latest"}\` |
| SSTable 2 | alice | t = 2 | \`{body: "Middle"}\` |
| SSTable 1 | alice | t = 2 | TOMBSTONE |
| SSTable 1 | alice | t = 1 | \`{body: "Oldest"}\` |

Merge result: \`t=3 → "Latest"\` (memtable wins), \`t=2 → DELETED\` (tombstone at the same timestamp suppresses SSTable 2's value), \`t=1 → "Oldest"\` survives as an earlier version. The client receives the resolved, merged row.

\`\`\`callout
{ "type": "warning", "title": "Tombstones Survive Until Compaction", "content": "Tombstones (delete markers) are not removed during the read merge — they are only physically discarded during **compaction**, when the SSTable containing the tombstone and the SSTable containing the older value are merged into a new file. Until then, tombstones participate in every read that touches them. A table with many uncompacted deletes can see significant read latency degradation." }
\`\`\`

## Read Repair

During a coordinated read, the coordinator contacts R replicas per the consistency level. If those replicas return **different versions** of the data, the coordinator triggers read repair:

\`\`\`mermaid
sequenceDiagram
    participant C as Client
    participant Coord as Coordinator
    participant R1 as Replica 1 (fresh)
    participant R2 as Replica 2 (stale)

    C->>Coord: READ user:alice (QUORUM)
    Coord->>R1: Read request
    Coord->>R2: Read request
    R1-->>Coord: alice:t3 {body: "Latest"}
    R2-->>Coord: alice:t1 {body: "Oldest"}
    Note over Coord: Detects divergence — t3 > t1
    Coord->>R2: Repair write: alice:t3 {body: "Latest"}
    Coord-->>C: alice:t3 {body: "Latest"}
\`\`\`

Read repair is **opportunistic** — it fires on reads that happen to detect divergence. For guaranteed full convergence across all replicas and all data, \`nodetool repair\` runs anti-entropy repair using Merkle trees. This is the primary mechanism for long-term replica consistency, while read repair and hinted handoff serve as supplementary convergence paths.

\`\`\`quiz
{ "title": "Read Path & Bloom Filters", "questions": [ { "question": "A Bloom filter returns 'definitely not' for partition key 'user:bob' on SSTable-12. What can Cassandra do?", "options": [ "It must still check SSTable-12's partition index to confirm", "It can skip SSTable-12 entirely with certainty — no disk I/O needed", "It should flag SSTable-12 as corrupt and trigger a repair", "It must check all other SSTables before deciding to skip this one" ], "answer": 1, "explanation": "Bloom filters have zero false negatives — a 'definitely not' answer is 100% accurate. If a key was ever inserted into that SSTable, its bits would be set. An unset bit at any hash position proves the key was never inserted, so the SSTable can be safely skipped with no disk I/O." }, { "question": "After a Bloom filter returns 'maybe' for a partition key, what is the very next structure Cassandra consults?", "options": [ "The row cache, to check for a recently cached version", "The full SSTable data file, scanning from the beginning", "The partition (sparse) index, to find the approximate byte offset", "The commit log, to check for any in-flight writes" ], "answer": 2, "explanation": "A 'maybe' result does not trigger a full SSTable scan. The next step is the partition index — a sparse in-memory structure that maps sampled partition keys to approximate byte offsets. This narrows the disk search to a small region, then the compression offset map pinpoints the exact compressed block." }, { "question": "You change \`bloom_filter_fp_chance\` from \`0.01\` to \`0.001\`. What are the expected consequences?", "options": [ "Bloom filters shrink (fewer bits), causing more unnecessary disk reads", "Bloom filters grow (more bits per key), reducing false positives and disk reads", "Write throughput increases because the smaller filter is updated faster", "No change — Bloom filter size is fixed by the number of partition keys" ], "answer": 1, "explanation": "A lower false positive probability requires a larger bit array per key. The filter uses more off-heap memory, but the probability of incorrectly flagging an absent SSTable drops from 1% to 0.1%, directly reducing unnecessary partition index lookups and disk reads for keys not in a given SSTable." }, { "question": "During a read merge, Cassandra finds \`{body: 'Hello'}\` at timestamp t=5 and a TOMBSTONE at timestamp t=7 for the same column in the same row. What is returned to the client?", "options": [ "The value 'Hello' is returned (data values always beat tombstones)", "The column is treated as deleted (tombstone has the higher timestamp)", "Both are returned as a conflict for the client to resolve", "A ReadTimeoutException is thrown until the conflict is resolved by compaction" ], "answer": 1, "explanation": "The merge rule is strictly timestamp-based: highest timestamp wins, regardless of whether it is a value or a tombstone. The tombstone at t=7 has a higher timestamp than the value at t=5, so it wins and the column is treated as deleted. The value 'Hello' is suppressed in the merge result." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The read path checks Memtable → row cache → Bloom filter → partition index → compression map → data block, merging all results at the end.", "Bloom filters are probabilistic bit arrays: 'definitely not' has zero false negatives (safe to skip SSTable), while 'maybe' can be a false positive (must verify on disk).", "Bloom filters live off-heap to avoid GC pressure; \`bloom_filter_fp_chance\` trades memory (larger filter) for fewer unnecessary disk reads (lower false positive rate).", "Every column cell carries a write timestamp; the highest timestamp wins the merge, and tombstones are timestamped deletes that override lower-timestamp values covering the same cell.", "Read repair is opportunistic convergence triggered during quorum reads; \`nodetool repair\` with Merkle-tree anti-entropy is the primary mechanism for full replica consistency." ] }
\`\`\``,
      starterCode: `# Bloom Filter Implementation
# Implement a BloomFilter that supports:
# 1. add(item) - add an item to the filter
# 2. might_contain(item) - check if item might be in the filter
# 3. false_positive_rate() - calculate the theoretical FP rate

import hashlib
import math

class BloomFilter:
    def __init__(self, expected_items: int, fp_rate: float = 0.01):
        """
        Initialize a Bloom filter.

        Args:
            expected_items: Expected number of items to insert
            fp_rate: Desired false positive rate (e.g., 0.01 for 1%)
        """
        # Calculate optimal size and number of hash functions
        # m = -(n * ln(p)) / (ln(2)^2)
        # k = (m/n) * ln(2)
        self.size = self._optimal_size(expected_items, fp_rate)
        self.num_hashes = self._optimal_hashes(self.size, expected_items)
        self.bit_array = [False] * self.size
        self.items_added = 0

    def _optimal_size(self, n: int, p: float) -> int:
        """Calculate optimal bit array size."""
        # TODO: Implement the formula: m = -(n * ln(p)) / (ln(2)^2)
        pass

    def _optimal_hashes(self, m: int, n: int) -> int:
        """Calculate optimal number of hash functions."""
        # TODO: Implement the formula: k = (m/n) * ln(2)
        pass

    def _get_hash_values(self, item: str) -> list:
        """Generate k hash values for an item."""
        # TODO: Use double hashing technique:
        # h(i) = (hash1 + i * hash2) % size
        # where hash1 and hash2 are two independent hashes
        pass

    def add(self, item: str):
        """Add an item to the Bloom filter."""
        # TODO: Set the bits at each hash position
        pass

    def might_contain(self, item: str) -> bool:
        """Check if an item might be in the filter."""
        # TODO: Check if ALL bits at hash positions are set
        pass

    def false_positive_rate(self) -> float:
        """Calculate the theoretical false positive rate."""
        # TODO: p = (1 - e^(-k*n/m))^k
        pass


# Test your implementation
if __name__ == "__main__":
    bf = BloomFilter(expected_items=1000, fp_rate=0.01)
    print(f"Bit array size: {bf.size}")
    print(f"Number of hash functions: {bf.num_hashes}")

    # Add some items
    for i in range(1000):
        bf.add(f"key_{i}")

    # Check for items we added (should all return True)
    found = sum(1 for i in range(1000) if bf.might_contain(f"key_{i}"))
    print(f"\\nTrue positives: {found}/1000")

    # Check for items we DID NOT add (false positive rate)
    false_positives = sum(
        1 for i in range(10000)
        if bf.might_contain(f"other_key_{i}")
    )
    actual_fp_rate = false_positives / 10000
    print(f"False positives: {false_positives}/10000 ({actual_fp_rate:.4f})")
    print(f"Theoretical FP rate: {bf.false_positive_rate():.4f}")
`,
      solutionCode: `# Bloom Filter Implementation - Solution

import hashlib
import math

class BloomFilter:
    def __init__(self, expected_items: int, fp_rate: float = 0.01):
        self.size = self._optimal_size(expected_items, fp_rate)
        self.num_hashes = self._optimal_hashes(self.size, expected_items)
        self.bit_array = [False] * self.size
        self.items_added = 0

    def _optimal_size(self, n: int, p: float) -> int:
        m = -(n * math.log(p)) / (math.log(2) ** 2)
        return int(math.ceil(m))

    def _optimal_hashes(self, m: int, n: int) -> int:
        k = (m / n) * math.log(2)
        return int(math.ceil(k))

    def _get_hash_values(self, item: str) -> list:
        # Double hashing: h(i) = (h1 + i * h2) % m
        h1 = int(hashlib.md5(item.encode()).hexdigest(), 16)
        h2 = int(hashlib.sha256(item.encode()).hexdigest(), 16)
        return [(h1 + i * h2) % self.size for i in range(self.num_hashes)]

    def add(self, item: str):
        for pos in self._get_hash_values(item):
            self.bit_array[pos] = True
        self.items_added += 1

    def might_contain(self, item: str) -> bool:
        return all(self.bit_array[pos] for pos in self._get_hash_values(item))

    def false_positive_rate(self) -> float:
        # p = (1 - e^(-k*n/m))^k
        k = self.num_hashes
        n = self.items_added
        m = self.size
        if n == 0:
            return 0.0
        return (1 - math.exp(-k * n / m)) ** k


if __name__ == "__main__":
    bf = BloomFilter(expected_items=1000, fp_rate=0.01)
    print(f"Bit array size: {bf.size}")
    print(f"Number of hash functions: {bf.num_hashes}")

    for i in range(1000):
        bf.add(f"key_{i}")

    found = sum(1 for i in range(1000) if bf.might_contain(f"key_{i}"))
    print(f"\\nTrue positives: {found}/1000")

    false_positives = sum(
        1 for i in range(10000)
        if bf.might_contain(f"other_key_{i}")
    )
    actual_fp_rate = false_positives / 10000
    print(f"False positives: {false_positives}/10000 ({actual_fp_rate:.4f})")
    print(f"Theoretical FP rate: {bf.false_positive_rate():.4f}")
`,
    },
    {
      id: "cassandra-tunable-consistency",
      slug: "cassandra-tunable-consistency",
      title: "Tunable Consistency Levels",
      content: `# Tunable Consistency Levels

One of Cassandra's most powerful architectural decisions is pushing consistency control entirely to the **client**, on a per-query basis. Rather than a single global setting, each read and write independently declares how many replicas must respond — letting you trade off latency, availability, and correctness within the same cluster, even for different operations on the same table.

> "The consistency level is a setting that clients must specify on every operation... that's the part where Cassandra has pushed the decision for determining consistency out to the client."
> — *Cassandra: The Definitive Guide, 3rd Edition*

\`\`\`concept
{ "title": "The R + W > N Rule", "variant": "mental-model", "content": "Every consistency guarantee in Cassandra reduces to one formula: **R + W > RF**. R = replicas that must respond to a read. W = replicas that must acknowledge a write. RF = replication factor. When R + W exceeds RF, the write set and read set must share at least one replica — that overlap node guarantees you always read the latest write. When R + W ≤ RF, nodes can respond with stale data and you have eventual consistency." }
\`\`\`

## The Consistency Level Menu

Rather than choosing R and W directly, Cassandra provides named levels that map to common replica counts. This lets you reason about consistency without knowing the exact RF at query time:

\`\`\`tabs
{ "tabs": [ { "label": "Single-DC Levels", "icon": "🏠", "content": "| Level | Read Replicas | Write ACKs | Notes |\\n|-------|--------------|------------|-------|\\n| \`ONE\` | 1 | 1 | Lowest latency — may return stale data |\\n| \`TWO\` | 2 | 2 | Better than ONE, rarely used directly |\\n| \`THREE\` | 3 | 3 | Seldom used — prefer QUORUM |\\n| \`QUORUM\` | ⌊RF/2⌋ + 1 | ⌊RF/2⌋ + 1 | Strong consistency if R+W > RF |\\n| \`ALL\` | All replicas | All replicas | Strongest guarantee, lowest availability |\\n| \`ANY\` | — | ≥ 1 (including hinted handoff) | Fire-and-forget; write never lost, may be unreadable briefly |" }, { "label": "Multi-DC Levels", "icon": "🌍", "content": "| Level | Read Replicas | Write ACKs | Notes |\\n|-------|--------------|------------|-------|\\n| \`LOCAL_ONE\` | 1 in local DC | 1 in local DC | Avoids cross-DC latency; eventual consistency |\\n| \`LOCAL_QUORUM\` | Quorum in local DC | Quorum in local DC | Strong within DC, async to remote DCs |\\n| \`EACH_QUORUM\` | — | Quorum in **each** DC | Strong cross-DC writes; highest write latency |\\n\\n**Rule of thumb:** Prefer \`LOCAL_QUORUM\` over \`QUORUM\` in multi-DC deployments. \`QUORUM\` counts replicas globally, which means cross-DC round trips on every operation." } ] }
\`\`\`

## How Quorum Guarantees the Overlap

With RF = 3, QUORUM requires ⌊3/2⌋ + 1 = **2** replicas. The animation below shows why writing at QUORUM and then reading at QUORUM always returns the most recent value — even if a slow replica hasn't responded yet:

\`\`\`algoviz
{ "title": "QUORUM Write → QUORUM Read (RF = 3)", "type": "array", "data": ["N1", "N2", "N3"], "frames": [ { "highlight": [0, 1, 2], "label": "WRITE: coordinator fans out to all 3 replicas simultaneously", "stats": { "acks_received": 0, "acks_needed": 2 } }, { "highlight": [0, 1], "label": "N1 and N2 ACK — quorum (2 of 3) met, write confirmed to client. N3 is still in-flight.", "stats": { "acks_received": 2, "acks_needed": 2 } }, { "highlight": [0, 1, 2], "label": "READ: coordinator contacts all 3 replicas for the same key", "stats": { "responses": 0, "needed": 2 } }, { "highlight": [0, 1], "label": "N1 and N2 respond — quorum met. N1 was in the write set too!", "stats": { "responses": 2, "needed": 2 } }, { "highlight": [0], "label": "N1 is the overlap node: it ACKed the write AND served the read. R(2) + W(2) = 4 > RF(3) ✓ — strong consistency proven.", "stats": { "overlap_node": "N1", "guarantee": "strong" } } ], "speed": 950 }
\`\`\`

The coordinator picks the response with the **highest timestamp** when multiple replicas reply. Cassandra uses last-write-wins with microsecond timestamps to resolve conflicts at read time.

## Combining Levels: What Works and What Doesn't

The guarantee depends entirely on whether R + W > RF — the levels you use for reads and writes do not need to match:

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Eventual — Write ONE + Read ONE (RF = 3)", "code": "-- R(1) + W(1) = 2 -- NOT > RF(3)\\n-- Risk: may read a replica that missed the write\\n\\nINSERT INTO page_events (id, ts, action)\\nVALUES (uuid(), toTimestamp(now()), 'click')\\nUSING CONSISTENCY ONE;   -- 1 ACK = done\\n\\nSELECT * FROM page_events WHERE id = ?\\nUSING CONSISTENCY ONE;   -- Might hit stale N3\\n\\n-- Gain: maximum throughput, sub-ms latency\\n-- Risk: stale reads possible for seconds" }, "after": { "label": "Strong — Write QUORUM + Read QUORUM (RF = 3)", "code": "-- R(2) + W(2) = 4 > RF(3) ✓\\n-- Guaranteed: read always sees latest write\\n\\nUPDATE accounts\\nSET balance = 900\\nWHERE account_id = 'acc_123'\\nUSING CONSISTENCY QUORUM;   -- 2 of 3 ACK\\n\\nSELECT balance FROM accounts\\nWHERE account_id = 'acc_123'\\nUSING CONSISTENCY QUORUM;   -- 2 of 3 respond\\n\\n-- Gain: read-your-writes across the cluster\\n-- Cost: ~2x latency vs ONE; cluster tolerates\\n--       1 replica down (floor(3/2)+1=2 remain)" } }
\`\`\`

Two other valid strong-consistency combinations for RF = 3: Write ALL (3) + Read ONE (1) = 4 > 3, and Write ONE (1) + Read ALL (3) = 4 > 3. A common trap: Write ONE + Read QUORUM gives 1 + 2 = 3, which **equals** RF but is **not** strictly greater — this is NOT sufficient for strong consistency.

## Multi-Datacenter Consistency

When replication spans data centers, you decide whether the consistency boundary is local (fast) or global (safe):

\`\`\`sysdiag
{ "title": "LOCAL_QUORUM vs EACH_QUORUM Write Path", "width": 720, "height": 380, "nodes": [ { "id": "client", "label": "Client", "x": 360, "y": 25, "kind": "client" }, { "id": "coord", "label": "Coordinator\\n(DC1)", "x": 360, "y": 100, "kind": "service" }, { "id": "n1", "label": "N1 (DC1)", "x": 140, "y": 220, "kind": "service" }, { "id": "n2", "label": "N2 (DC1)", "x": 290, "y": 220, "kind": "service" }, { "id": "n3", "label": "N3 (DC1)", "x": 440, "y": 220, "kind": "service" }, { "id": "n4", "label": "N4 (DC2)", "x": 460, "y": 330, "kind": "service" }, { "id": "n5", "label": "N5 (DC2)", "x": 580, "y": 330, "kind": "service" }, { "id": "n6", "label": "N6 (DC2)", "x": 690, "y": 330, "kind": "service" } ], "edges": [ { "from": "client", "to": "coord", "label": "write" }, { "from": "coord", "to": "n1", "label": "sync" }, { "from": "coord", "to": "n2", "label": "sync" }, { "from": "coord", "to": "n3", "label": "sync" }, { "from": "coord", "to": "n4", "label": "async" }, { "from": "coord", "to": "n5", "label": "async" }, { "from": "coord", "to": "n6", "label": "async" } ], "annotations": { "coord": "Under LOCAL_QUORUM: waits for 2 of 3 DC1 ACKs before replying to client. DC2 replicas receive the write but are not waited on.", "n2": "One of two DC1 quorum members. Both N1 and N2 must ACK for LOCAL_QUORUM to be satisfied.", "n4": "DC2 replica updated asynchronously under LOCAL_QUORUM. Under EACH_QUORUM the coordinator waits for quorum in DC2 as well — slower, but consistent cross-DC." } }
\`\`\`

| Use Case | Write CL | Read CL | Rationale |
|----------|----------|---------|-----------|
| User session data | \`LOCAL_QUORUM\` | \`LOCAL_QUORUM\` | Strong within DC, avoids cross-DC penalty |
| Analytics / event logging | \`ONE\` | \`ONE\` | High throughput, stale reads acceptable |
| Financial transactions | \`QUORUM\` | \`QUORUM\` | Must not lose writes or serve stale balances |
| Social media feed | \`ONE\` | \`ONE\` | Eventual consistency is product-acceptable |
| Cross-DC failover writes | \`EACH_QUORUM\` | \`LOCAL_QUORUM\` | Strong writes everywhere; fast local reads |

## Lightweight Transactions (LWT)

Standard QUORUM writes are not **linearizable** — two coordinators can simultaneously decide their write won QUORUM without knowing about each other. For true compare-and-set semantics ("insert only if this row does not already exist"), Cassandra provides Lightweight Transactions via the Paxos consensus protocol:

\`\`\`callout
{ "type": "warning", "title": "LWT is 10–20× Slower Than Regular Writes", "content": "An LWT requires a 4-phase Paxos round trip: **Prepare → Promise → Propose → Commit**. Two network round trips happen before any data is written. Reserve LWT for operations that genuinely need linearizability — unique-key enforcement, idempotent account creation, or atomic balance transfers. For everything else, QUORUM consistency is sufficient and dramatically faster." }
\`\`\`

\`\`\`sql
-- Insert only if the row does not already exist
-- Returns: [{"[applied]": true}] on success
INSERT INTO users (user_id, name, email)
VALUES ('alice', 'Alice', 'alice@example.com')
IF NOT EXISTS;

-- Update only if the current value matches (compare-and-set)
-- Returns: [{"[applied]": false, "balance": 850}] if condition fails
UPDATE accounts
SET balance = 900
WHERE account_id = 'acc_123'
IF balance = 1000;
\`\`\`

When the condition fails, Cassandra returns the **actual current value** of the checked column so the client can retry with accurate state — no second read required.

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "With RF = 3, which combination guarantees strong (read-your-writes) consistency?", "options": ["Write ONE + Read QUORUM  (1+2=3)", "Write ONE + Read ALL  (1+3=4)", "Write TWO + Read ONE  (2+1=3)", "Write ONE + Read ONE  (1+1=2)"], "answer": 1, "explanation": "Write ONE + Read ALL gives R+W = 4 > RF(3) — the write set (1 node) and read set (all 3 nodes) must overlap, so the read always includes the node that acknowledged the write. Write ONE + Read QUORUM gives 1+2=3 which equals RF but is NOT strictly greater, so strong consistency is not guaranteed." }, { "question": "A financial app deployed across two data centers writes and reads from DC1 only. Which consistency pair provides strong consistency at the lowest latency?", "options": ["Write ALL + Read ALL", "Write EACH_QUORUM + Read LOCAL_QUORUM", "Write LOCAL_QUORUM + Read LOCAL_QUORUM", "Write ONE + Read QUORUM"], "answer": 2, "explanation": "LOCAL_QUORUM gives R+W > RF within DC1 (e.g., 2+2=4 > 3) with no cross-DC round trips. EACH_QUORUM is slower — it waits for quorum in DC2 as well on every write. ALL breaks if any replica is unavailable. Write ONE + Read QUORUM gives 1+2=3 which equals RF and is NOT sufficient." }, { "question": "When is a Lightweight Transaction (LWT) required instead of QUORUM?", "options": ["When you need the highest possible write throughput", "When you need linearizable compare-and-set — e.g., 'create account only if email not taken'", "When you are writing to a table with RF = 1", "Whenever you write to multiple data centers simultaneously"], "answer": 1, "explanation": "QUORUM prevents stale reads but does not prevent two concurrent coordinators from both successfully writing to the same row. LWT uses Paxos to serialize concurrent writers — only one will succeed when using IF NOT EXISTS or IF condition. The cost is 10–20× slower writes, so use LWT only when true linearizability is required." }, { "question": "What makes LOCAL_ONE different from plain ONE in a multi-DC cluster?", "options": ["It requires a majority of local replicas to ACK", "It routes the request only to replicas in the local datacenter", "It achieves strong consistency within the local datacenter", "It waits for both the local and remote DC to respond"], "answer": 1, "explanation": "LOCAL_ONE guarantees the single responding replica is in the same datacenter as the coordinator — avoiding unexpected cross-DC latency spikes. Plain ONE may route to any replica in any DC. Neither level provides strong consistency; both are eventual." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Cassandra's consistency is tunable per query: every read and write independently specifies how many replicas must respond.", "Strong consistency requires R + W > RF (strictly greater). When this holds, the write set and read set must share at least one replica.", "QUORUM (⌊RF/2⌋ + 1) is the practical sweet spot — strong consistency while tolerating up to ⌊RF/2⌋ replica failures.", "In multi-DC deployments, LOCAL_QUORUM provides strong consistency within the local datacenter without incurring cross-DC latency on every operation.", "Lightweight Transactions add linearizable compare-and-set via Paxos but are 10–20× slower — reserve them for operations where concurrent race conditions are a genuine correctness concern." ] }
\`\`\``,
    },
    {
      id: "cassandra-architecture",
      slug: "cassandra-architecture-walkthrough",
      title: "Cassandra: Architecture Walkthrough",
      content: `# Cassandra: Architecture Walkthrough

Cassandra is the product of two landmark distributed systems papers fused into one engine: Amazon Dynamo's **distribution approach** (masterless ring, gossip protocol, tunable consistency) and Google BigTable's **storage approach** (LSM-tree, SSTables, memtables). Every architectural decision flows from this duality.

\`\`\`concept
{ "title": "Cassandra's Design Lineage", "variant": "mental-model", "content": "Think of Cassandra as two systems fused together: Dynamo handles *where* data lives (consistent hashing, replication, peer-to-peer gossip) and BigTable handles *how* data is stored (append-only commit log → in-memory memtable → immutable SSTables on disk). Understanding each half explains every operational quirk — from why deletes write tombstones to why reads are more expensive than writes." }
\`\`\`

## Full Architecture

\`\`\`mermaid
flowchart TD
    CQL["CQL Client\\n(token-aware driver)"] -->|hashes partition key| COORD["Coordinator Node\\n(any node — no master)"]
    COORD <-->|Gossip Protocol\\nmembership · schema · ring| RING["Token Ring State"]
    COORD --> N1["Replica Node 1"]
    COORD --> N2["Replica Node 2"]
    COORD --> N3["Replica Node 3"]

    subgraph INTERNALS["Inside Each Replica Node"]
        direction TB
        CL["Commit Log\\nsequential WAL append"] --> MT["Memtable\\nin-memory sorted buffer"]
        MT -->|flush when full| SS["SSTables\\nimmutable on-disk files"]
        SS --- BF["Bloom Filter\\nskip-optimization"]
        SS --- PI["Partition Index\\n+ Summary"]
        COMP["Compaction\\nbackground SSTable merge"] -.->|merges + removes tombstones| SS
        MK["Merkle Trees\\nanti-entropy repair"] -.->|syncs divergent replicas| SS
        HH["Hinted Handoff\\nmissed write buffer"] -.->|replays on node recovery| MT
    end

    N1 -.- INTERNALS
\`\`\`

\`\`\`callout
{ "type": "info", "title": "No Master Node", "content": "Every Cassandra node is equal. The 'coordinator' role for a given request is simply whichever node the client connects to — it is not a special node. This peer-to-peer design eliminates the single point of failure that plagues master-replica databases." }
\`\`\`

## Write Path: End-to-End

\`\`\`steps
{ "title": "INSERT INTO messages (user_id, ts, body) VALUES ('alice', '2024-03-01', 'Hello')", "steps": [ { "title": "Token-Aware Routing", "content": "The CQL driver hashes the partition key \`'alice'\` using the Murmur3 partitioner to produce a token (e.g., token 42). Because the driver is **token-aware**, it sends the write directly to the node that owns the token range containing 42 — skipping a redundant network hop by going straight to the natural coordinator." }, { "title": "Coordinator Determines Replicas", "content": "The coordinator consults the token ring and replication strategy to identify all replica nodes for this partition. With RF=3, it might identify \`[Node C, Node D, Node A]\`. It sends the write to all three **in parallel** — it does not wait for one before sending to the next." }, { "title": "Durable Write on Each Replica", "content": "Each replica performs two writes in sequence:\\n\\n1. **Commit Log (WAL)** — sequential append to disk; this is the durability guarantee\\n2. **Memtable** — insert into the in-memory sorted structure for fast subsequent reads\\n\\nOnly after the commit log is safely flushed does the replica send an ACK back to the coordinator." }, { "title": "Consistency Level Gate", "content": "The coordinator waits for **W** ACKs, where W is determined by the consistency level:\\n\\n- \`ONE\` → 1 ACK required\\n- \`QUORUM\` → ⌊RF/2⌋ + 1 = **2 ACKs** (for RF=3)\\n- \`ALL\` → 3 ACKs required\\n\\nOnce the threshold is met, success is returned to the client. Remaining replicas still complete their writes asynchronously." }, { "title": "Background Flush and Compaction", "content": "When a Memtable fills up, it **flushes** to a new immutable SSTable on disk. Over time, many small SSTables accumulate. **Compaction** runs in the background to merge SSTables, remove tombstones from deleted rows, and maintain healthy read performance.\\n\\nCompaction strategy should match the workload: STCS for write-heavy, LCS for read-heavy, TWCS for time-series." } ] }
\`\`\`

\`\`\`callout
{ "type": "success", "title": "Why Writes Are So Fast", "content": "Cassandra avoids all random disk I/O on the write path. The commit log is a sequential append (the fastest operation a disk can do), and the Memtable is entirely in-memory. This is why Cassandra can sustain hundreds of thousands of writes per second per node — it is physically incapable of having write-path I/O amplification." }
\`\`\`

## Read Path: End-to-End

\`\`\`steps
{ "title": "SELECT * FROM messages WHERE user_id = 'alice' LIMIT 10", "steps": [ { "title": "Token Routing to Coordinator", "content": "The client hashes \`'alice'\` → token 42 → routes to Node C as coordinator. Node C identifies the same replica set \`[C, D, A]\` via the token ring." }, { "title": "Digest Requests to Replicas", "content": "To minimize data transfer, the coordinator uses a split request pattern:\\n\\n- **One replica** receives a full data request\\n- **Other replicas** receive a *digest request* — they return only a hash (digest) of their version of the partition\\n\\nWith \`QUORUM\` and RF=3, two replicas must respond before the read is considered complete." }, { "title": "Multi-Layer Lookup on Each Node", "content": "Each replica searches for the \`'alice'\` partition in this order:\\n\\n1. **Row cache** (if enabled) — entire partition cached in memory; instant return\\n2. **Memtable** — check the in-memory sorted buffer\\n3. **Each SSTable** (newest first):\\n   - Check **Bloom filter** — if it returns 'definitely not here', skip this SSTable entirely\\n   - Check **Partition Summary** (in memory) for approximate offset\\n   - Check **Partition Index** for exact byte offset\\n   - Seek and read the data file\\n4. **Merge** all results: apply tombstones, return newest column values (last-writer-wins by timestamp)" }, { "title": "Digest Comparison and Read Repair", "content": "The coordinator compares the data digest from the full-data replica against digests from the others:\\n\\n- **Digests match** → return data to client immediately\\n- **Digests differ** → request full data from all replicas, perform server-side merge using timestamps, return the merged (correct) result to the client, and **schedule async read repair** to bring the divergent replica back in sync" } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Reads Are More Expensive Than Writes", "content": "A single read may touch multiple SSTables — one Bloom filter check plus one partition index seek per SSTable. This is why SSTable count matters: too many SSTables (before compaction runs) means more I/O per read. Monitor \`nodetool cfstats\` → \`SSTable count\` per table and tune compaction thresholds if count climbs." }
\`\`\`

## Failure Scenarios

\`\`\`tabs
{ "tabs": [ { "label": "Node Down", "icon": "🔴", "content": "**Scenario:** A replica node goes offline (crash, maintenance, network loss).\\n\\n**Immediate response:** The coordinator routes reads and writes to the remaining replicas. As long as the consistency level can be met with surviving nodes, the cluster serves traffic normally — clients see no errors.\\n\\n**Hinted Handoff:** Writes destined for the downed node are stored as *hints* on the coordinator. When the node recovers, hints are replayed to catch it up. Hints are retained for a configurable window (default: 3 hours).\\n\\n**Full convergence:** For extended outages, \`nodetool repair\` triggers a Merkle tree comparison across replicas to guarantee full convergence — hints alone may not cover a long gap." }, { "label": "Network Partition", "icon": "🌐", "content": "**Scenario:** A network partition splits a multi-datacenter cluster.\\n\\n**With \`LOCAL_QUORUM\`:** Each datacenter continues operating independently. Reads and writes succeed as long as a local quorum exists within each DC. This is the standard recommendation for multi-DC deployments.\\n\\n**With \`QUORUM\` or \`ALL\`:** These levels calculate quorum across all DCs. A partition can cause global quorum to fail even when local nodes are healthy.\\n\\n**After healing:** Diverged replicas converge via read repair (triggered lazily on reads) and scheduled \`nodetool repair\` for guaranteed convergence." }, { "label": "Disk Failure", "icon": "💾", "content": "**Scenario:** A node loses its disk (hardware failure, filesystem corruption).\\n\\n**Response:** The failed node is decommissioned from the ring (\`nodetool removenode\`). Because RF=3, the data still exists on the other two replicas. A replacement node bootstraps and Cassandra **streams** data from surviving replicas to fill its token ranges.\\n\\n**Key insight:** RF=3 survives a single-node disk failure. RF=2 risks data loss if a second failure occurs during the bootstrap/repair window — always use RF=3 or higher in production." }, { "label": "Slow Node", "icon": "🐢", "content": "**Scenario:** A replica is alive but responding slowly (GC pause, I/O saturation).\\n\\n**Speculative Retry:** After a configurable timeout, the coordinator sends a duplicate request to another replica. Whichever responds first wins; the other response is discarded.\\n\\nConfigured per table:\\n\`\`\`\\nspeculative_retry = '99PERCENTILE'\\n\`\`\`\\n\\nSpeculative retry trades a modest increase in cluster load for dramatically reduced tail latency (p99/p999). It is particularly effective in multi-DC deployments where cross-DC reads have inherently high latency variance." } ] }
\`\`\`

## Cassandra vs. Amazon Dynamo

Both systems share the same distribution DNA — consistent hashing, gossip, tunable quorums — but diverge significantly in data model and storage engine.

| Feature | Amazon Dynamo | Apache Cassandra |
|---------|--------------|-----------------|
| **Data model** | Key-value only | Wide-column (CQL tables) |
| **Conflict resolution** | Vector clocks + app-level merge | Last-writer-wins (timestamp) |
| **Query language** | GET/PUT API | CQL (SQL-like) |
| **Storage engine** | Pluggable (BerkeleyDB historically) | LSM-tree (Memtable + SSTables) |
| **Compaction** | N/A | STCS / LCS / TWCS |
| **Consistency** | Quorum (R, W, N tunable) | Tunable per-query consistency level |
| **Lightweight transactions** | None | Paxos-based LWT (\`IF NOT EXISTS\`) |

\`\`\`concept
{ "title": "Last-Writer-Wins vs. Vector Clocks", "variant": "insight", "content": "Cassandra resolves write conflicts using the client-provided timestamp — the write with the highest timestamp wins. This is simple and fast but shifts responsibility to the client: clock skew between application servers can cause an older write to silently overwrite a newer one. Dynamo's vector clocks are more causally accurate but require the application to handle merge conflicts. Cassandra's trade-off is intentional — operational simplicity over theoretical completeness." }
\`\`\`

## Production Deployment

\`\`\`callout
{ "type": "tip", "title": "RF, Compaction, and Repair — The Production Trinity", "content": "**Replication Factor:** Use RF=3 in production. RF=2 risks data loss if a node fails during an active repair window.\\n\\n**Consistency Level:** \`LOCAL_QUORUM\` is the standard for most workloads — strong local consistency, tolerant of cross-DC partitions.\\n\\n**Compaction strategy by workload:**\\n- \`STCS\` (Size-Tiered) — write-heavy tables, low read latency requirements\\n- \`LCS\` (Leveled) — read-heavy tables, predictable bounded read latency\\n- \`TWCS\` (Time Window) — time-series data with natural TTL and sequential writes\\n\\n**Repair:** Run \`nodetool repair\` weekly (or use Reaper for automated repair). Hinted handoff only covers short outage windows — repair via Merkle tree sync is the only mechanism guaranteed to achieve full replica convergence.\\n\\n**SSTable count:** A rising SSTable count per table means compaction is falling behind reads. Tune \`min_threshold\` / \`max_threshold\` or switch strategy before read latency degrades." }
\`\`\`

\`\`\`quiz
{ "title": "Architecture Walkthrough — Check Your Understanding", "questions": [ { "question": "A client writes with consistency level QUORUM and RF=3. The coordinator receives ACKs from 2 replicas before the third goes offline. What happens?", "options": [ "The write fails — all 3 replicas must ACK for QUORUM", "The write succeeds — 2 of 3 satisfies QUORUM (⌊3/2⌋ + 1 = 2)", "The write is queued until the third replica recovers", "The write is automatically retried with consistency ONE" ], "answer": 1, "explanation": "QUORUM requires ⌊RF/2⌋ + 1 ACKs. With RF=3, that is 2. Once 2 replicas ACK, the write is confirmed to the client and the operation is complete. The third replica will receive the write via hinted handoff once it recovers. This is the core of Cassandra's tunable consistency model — you choose the trade-off." }, { "question": "During a read, the coordinator compares digest responses and finds a mismatch between replicas. What does Cassandra do next?", "options": [ "Returns an error to the client — data inconsistency must be resolved manually", "Returns the older version to preserve causal ordering", "Requests full data from all replicas, merges using timestamps, returns the result, and schedules async read repair", "Immediately runs nodetool repair on the affected replicas before responding" ], "answer": 2, "explanation": "A digest mismatch triggers a full data fetch from all replicas. Cassandra merges them using last-writer-wins (highest timestamp wins), returns the correct merged result to the client immediately, and schedules background read repair to bring the divergent replica in sync. The client gets the right answer without waiting for repair to complete." }, { "question": "Why does Cassandra check the Bloom filter before reading from an SSTable?", "options": [ "Bloom filters cache the full partition data for fast retrieval", "Bloom filters can definitively confirm a partition is NOT in an SSTable, allowing that file to be skipped entirely", "Bloom filters encrypt partition data and must be checked for access control", "Bloom filters maintain the sort order of keys and enable binary search within the SSTable" ], "answer": 1, "explanation": "A Bloom filter answers 'is this key definitely NOT here?' with 100% accuracy — there are no false negatives. If the filter says 'no', the entire SSTable is skipped with zero disk I/O. If it says 'possibly yes', Cassandra proceeds to the partition index. False positives (filter says yes but key is absent) cause a wasted disk seek, but false negatives never occur — this asymmetry makes Bloom filters safe as a skip-optimization." }, { "question": "A multi-datacenter cluster experiences a network partition between DC1 and DC2. Which consistency level allows both datacenters to continue serving reads and writes independently?", "options": [ "ALL", "QUORUM", "LOCAL_QUORUM", "TWO" ], "answer": 2, "explanation": "LOCAL_QUORUM requires a quorum only within the local datacenter, completely ignoring remote DCs. DC1 and DC2 can each satisfy reads and writes independently during the partition, trading cross-DC consistency for availability. QUORUM calculates quorum across all DCs and would fail once the partition prevents cross-DC acknowledgment. This is why LOCAL_QUORUM is the standard recommendation for all multi-DC production deployments." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Cassandra fuses Dynamo's peer-to-peer distribution (consistent hashing, gossip, tunable quorums) with BigTable's LSM-tree storage (commit log → memtable → SSTables), giving it both high write throughput and linear horizontal scalability with no single point of failure.", "The write path never performs random I/O: the commit log is a sequential append, the memtable is in-memory. This is the root cause of Cassandra's exceptional write performance.", "Bloom filters allow reads to skip SSTables entirely when a partition is absent — but a rising SSTable count (before compaction) means more Bloom filter checks and index seeks per read, degrading latency. Compaction is not optional maintenance; it is load-bearing.", "Tunable consistency is per-operation: R + W > RF guarantees strong consistency. LOCAL_QUORUM is the production standard for multi-DC deployments — it survives cross-DC partitions while maintaining local correctness.", "Hinted handoff covers short outages; scheduled nodetool repair (Merkle tree sync) is required for guaranteed convergence after extended outages or partition healing. RF=3 is the minimum production replication factor." ] }
\`\`\``,
    },
  ],
};
