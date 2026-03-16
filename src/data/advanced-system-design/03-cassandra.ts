import { Module } from "../types";

export const cassandraModule: Module = {
  id: "design-cassandra",
  title: "Designing Apache Cassandra",
  description:
    "Explore Cassandra's architecture: token ring partitioning, LSM-tree storage with SSTables, Bloom filters, and tunable consistency levels.",
  lessons: [
    {
      id: "cassandra-requirements",
      slug: "cassandra-requirements",
      title: "Cassandra: Requirements & Data Model",
      content: `# Cassandra: Requirements & Data Model

Apache Cassandra was originally developed at Facebook (2008) for inbox search, combining Amazon Dynamo's partitioning with Google Bigtable's data model. It has since become one of the most widely used distributed databases.

## Motivation

Facebook needed a database that could:
- Handle billions of writes per day (inbox messages)
- Scale linearly by adding nodes
- Operate across multiple data centers
- Never have a single point of failure

## Functional Requirements

1. **Write** structured data (rows with columns) to named tables
2. **Read** data by partition key (primary lookup) and optional clustering columns
3. Support **wide rows** -- a single partition can have millions of columns/rows
4. CQL (Cassandra Query Language) for familiar SQL-like syntax
5. No JOIN operations, no subqueries (by design)

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Write throughput | 100K+ writes/sec per node |
| Read latency | < 10ms for partition key lookups |
| Availability | 99.999% (five nines) |
| Scalability | Linear scale to 1000+ nodes |
| Replication | Multi-datacenter, configurable per keyspace |

## Data Model

Cassandra's data model is built around **denormalization** and **query-driven design**:

\`\`\`
Cassandra Data Model Hierarchy
==============================

Keyspace (~ database)
  |
  +-- Table (~ table)
       |
       +-- Partition (group of rows with same partition key)
            |
            +-- Row (identified by clustering columns)
                 |
                 +-- Column (name:value pair)

Example: messages table
  Partition Key: user_id
  Clustering Key: message_timestamp (descending)

  Partition: user_id = "alice"
    Row 1: {timestamp: 2024-03-01, sender: "bob", body: "Hello"}
    Row 2: {timestamp: 2024-02-28, sender: "charlie", body: "Hi"}
    Row 3: {timestamp: 2024-02-25, sender: "bob", body: "Hey"}
\`\`\`

### Primary Key Structure

\`\`\`sql
CREATE TABLE messages (
    user_id TEXT,
    message_timestamp TIMESTAMP,
    sender TEXT,
    body TEXT,
    PRIMARY KEY (user_id, message_timestamp)
) WITH CLUSTERING ORDER BY (message_timestamp DESC);
\`\`\`

- **Partition key** (\`user_id\`): Determines which node stores the data
- **Clustering key** (\`message_timestamp\`): Determines sort order within the partition
- All rows in a partition are stored together on the same node

### Design Principle: Model Your Queries

In relational databases, you normalize data and query flexibly. In Cassandra, you design tables around your queries:

\`\`\`
Query: "Get the 20 most recent messages for user X"
  --> Table: messages, partitioned by user_id, clustered by timestamp DESC
  --> CQL: SELECT * FROM messages WHERE user_id = 'X' LIMIT 20

Query: "Get all messages in conversation between X and Y"
  --> Different table: conversations, partitioned by (user1, user2)
  --> Data is duplicated across tables (denormalization)
\`\`\`

This is the opposite of relational design. Cassandra trades storage efficiency for read performance and scalability.

## Key Takeaway

Cassandra combines Dynamo's peer-to-peer, always-available architecture with a structured, column-oriented data model. Its query-driven design philosophy means you model your tables around access patterns, accepting data duplication in exchange for predictable, fast reads at any scale.`,
    },
    {
      id: "cassandra-partitioning",
      slug: "cassandra-partitioning-token-ring",
      title: "Partitioning & Token Ring",
      content: `# Partitioning & Token Ring

Cassandra distributes data across nodes using a token ring, which is its implementation of consistent hashing.

## The Token Ring

Every node in a Cassandra cluster is assigned one or more **tokens** -- positions on a numerical ring from -2^63 to 2^63-1 (using the Murmur3 partitioner).

\`\`\`
Token Ring (simplified, range 0-100)
====================================

           Token 0
              |
     Token 75-+-Token 25
              |
           Token 50

Node A: owns tokens (75, 0]   --> responsible for keys hashing to 76-0
Node B: owns tokens (0, 25]   --> responsible for keys hashing to 1-25
Node C: owns tokens (25, 50]  --> responsible for keys hashing to 26-50
Node D: owns tokens (50, 75]  --> responsible for keys hashing to 51-75
\`\`\`

### How a Key Maps to a Node

\`\`\`
INSERT INTO users (user_id, name) VALUES ('alice', 'Alice');

1. Hash the partition key: Murmur3('alice') = 42
2. Find the token range: 42 falls in (25, 50]
3. Node C owns that range --> primary replica is Node C
4. With RF=3, also replicate to Node D and Node A
\`\`\`

## Virtual Nodes (vnodes)

Instead of assigning each node a single token, Cassandra assigns **many tokens** (default: 256 per node). Each vnode owns a small slice of the ring.

\`\`\`
Without vnodes (4 nodes, 1 token each):
  Each node owns 25% of the ring.
  If Node A dies: Node B gets ALL of A's load (100% increase).

With vnodes (4 nodes, 256 tokens each):
  Each node owns 256 small slices scattered around the ring.
  If Node A dies: A's 256 slices are distributed across ALL other nodes.
  Each remaining node gets ~33% more load (instead of one node getting 100%).
\`\`\`

**Benefits of vnodes:**
1. Load is more evenly distributed
2. Node failure spreads load across the cluster (not just one neighbor)
3. Adding a node automatically takes small slices from every existing node
4. Nodes with more capacity can be assigned more vnodes

## Replication

Cassandra replicates each partition to multiple nodes. The **replication factor (RF)** is configured per keyspace.

### SimpleStrategy (single data center)

Replicas are placed on the next RF-1 nodes clockwise on the ring:

\`\`\`
RF = 3, key hashes to position 42

Ring:  ... Node C (25-50) -> Node D (50-75) -> Node A (75-0) -> ...

Primary:  Node C
Replica 1: Node D (next clockwise)
Replica 2: Node A (next clockwise after D)
\`\`\`

### NetworkTopologyStrategy (multi-datacenter)

Replicas are placed to maximize availability across **racks** and **data centers**:

\`\`\`
Keyspace config:
  DC1: RF=3
  DC2: RF=2

For each DC:
  Walk clockwise, placing replicas on nodes in DIFFERENT racks.
  This ensures a rack failure doesn't lose all replicas.

Result: 5 total replicas across 2 data centers.
\`\`\`

## Coordinators and Routing

Any node can be the **coordinator** for any request. The client can connect to any node:

\`\`\`
Client --> Node B (coordinator)
  |
  Node B computes: hash(partition_key) --> Node C is primary
  |
  Node B forwards request to Node C (and replicas)
  |
  Node B collects responses and returns to client
\`\`\`

Modern Cassandra drivers are **token-aware**: they know which nodes own which token ranges and send requests directly to the primary replica, avoiding an extra network hop.

## Key Takeaway

Cassandra's token ring with vnodes provides uniform data distribution, automatic rebalancing when nodes join or leave, and predictable data placement. The NetworkTopologyStrategy ensures replicas are spread across racks and data centers for maximum fault tolerance.`,
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

Cassandra's read path must check both in-memory and on-disk data structures, then merge the results. Bloom filters are critical for avoiding unnecessary disk reads.

## Read Flow

\`\`\`
Read Path
=========

Client READ (partition key + optional clustering range)
     |
     v
+------------------+
| 1. Memtable      |  Check current in-memory data
+------------------+
     |
     v
+------------------+
| 2. Row Cache     |  Check recently read rows (optional)
+------------------+
     |
     v
+------------------+
| 3. Bloom Filter  |  For each SSTable: "Could this key be here?"
+------------------+
     |  (if maybe yes)
     v
+------------------+
| 4. Partition      |  Sparse index -> find partition offset
|    Index          |
+------------------+
     |
     v
+------------------+
| 5. Compression   |  Locate the compressed block
|    Offset Map    |
+------------------+
     |
     v
+------------------+
| 6. Read Data     |  Decompress and read the actual row
+------------------+
     |
     v
+------------------+
| 7. Merge         |  Combine results from memtable + SSTables
+------------------+
     |
     v
Return to client
\`\`\`

## Bloom Filters: The Key Optimization

A Bloom filter is a probabilistic data structure that answers: "Is this element in the set?"

- **Yes** = "Maybe" (could be a false positive)
- **No** = "Definitely not" (no false negatives)

\`\`\`
Bloom Filter Operation
======================

Insert "alice":
  hash1("alice") = 3  --> set bit 3
  hash2("alice") = 7  --> set bit 7
  hash3("alice") = 12 --> set bit 12

  Bit array: [0 0 0 1 0 0 0 1 0 0 0 0 1 0 0 0]

Check "bob":
  hash1("bob") = 3  --> bit 3 is SET
  hash2("bob") = 5  --> bit 5 is NOT SET
  --> Definitely NOT in the set (skip this SSTable!)

Check "alice":
  hash1("alice") = 3  --> SET
  hash2("alice") = 7  --> SET
  hash3("alice") = 12 --> SET
  --> MAYBE in the set (must check SSTable to confirm)
\`\`\`

### Why Bloom Filters Matter

Without Bloom filters, reading a key requires checking EVERY SSTable on disk. With 50 SSTables, that is 50 disk reads per query.

With Bloom filters (configured for 1% false positive rate):
- Each SSTable's Bloom filter is checked in memory (microseconds)
- On average, only 1-2 SSTables are actually read from disk
- Read latency drops from 50 disk reads to 1-2 disk reads

### Configuring False Positive Rate

Cassandra lets you configure the Bloom filter false positive rate per table:

\`\`\`
-- 1% false positive rate (default)
ALTER TABLE messages WITH bloom_filter_fp_chance = 0.01;

-- 0.1% false positive rate (more memory, fewer false reads)
ALTER TABLE messages WITH bloom_filter_fp_chance = 0.001;

-- Disable bloom filters entirely
ALTER TABLE messages WITH bloom_filter_fp_chance = 1.0;
\`\`\`

Lower false positive rates use more memory but reduce unnecessary disk reads.

## Read Merge Process

When a read touches multiple sources (memtable + several SSTables), Cassandra must merge the results:

\`\`\`
Merge Example
=============

Memtable:    alice:t3 -> {body: "Latest"}
SSTable 2:   alice:t2 -> {body: "Middle"}
SSTable 1:   alice:t1 -> {body: "Oldest"}
SSTable 1:   alice:t2 -> TOMBSTONE

Merge result:
  alice:t3 -> {body: "Latest"}    (from memtable)
  alice:t2 -> DELETED              (tombstone wins over old value)
  alice:t1 -> {body: "Oldest"}    (only in SSTable 1)

Return to client: alice:t3 and alice:t1
\`\`\`

The merge uses timestamps (each column has a write timestamp) to determine which version wins.

## Read Repair

During a read, if the coordinator detects that replicas have different versions of the data, it triggers **read repair**:

1. Coordinator reads from R replicas
2. Compares responses
3. Sends the newest version to any replica that had stale data
4. Returns the newest version to the client

Read repair is an **opportunistic consistency mechanism** that gradually converges replicas.

## Key Takeaway

Cassandra's read path compensates for LSM-tree read amplification with Bloom filters (avoiding unnecessary SSTable reads), partition indexes (fast key lookup within SSTables), and caches. The merge step combines data from the memtable and multiple SSTables, applying tombstones and selecting the newest version of each column.`,
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

One of Cassandra's most powerful features is **tunable consistency** -- you can choose the consistency level on a per-query basis, trading off between consistency, latency, and availability.

## Consistency Levels

| Level | Reads | Writes | Guarantee |
|-------|-------|--------|-----------|
| ONE | 1 replica responds | 1 replica acknowledges | Lowest latency, may read stale |
| TWO | 2 replicas respond | 2 replicas acknowledge | Better consistency than ONE |
| THREE | 3 replicas respond | 3 replicas acknowledge | Even better consistency |
| QUORUM | majority responds | majority acknowledges | Strong consistency if R+W > N |
| ALL | all replicas respond | all replicas acknowledge | Strongest, lowest availability |
| LOCAL_QUORUM | majority in local DC | majority in local DC | Strong consistency within DC |
| EACH_QUORUM | N/A | majority in each DC | Cross-DC strong writes |
| LOCAL_ONE | 1 replica in local DC | 1 replica in local DC | Fastest, local DC only |

## How Quorum Works

With replication factor RF=3:
- QUORUM requires floor(3/2) + 1 = **2** nodes

\`\`\`
RF=3, CL=QUORUM

Write at QUORUM:
  Coordinator sends write to ALL 3 replicas
  Waits for 2 ACKs
  Returns success to client

Read at QUORUM:
  Coordinator sends read to ALL 3 replicas
  Waits for 2 responses
  Returns most recent value (by timestamp)

Since W(2) + R(2) = 4 > 3 = RF:
  At least 1 node in the read set saw the write
  --> Strong consistency guaranteed
\`\`\`

## Combining Read and Write Levels

The consistency guarantee depends on the COMBINATION of read and write levels:

\`\`\`
Strong Consistency Scenarios (RF=3)
====================================

Write QUORUM (2) + Read QUORUM (2) = 4 > 3   --> Strong
Write ALL (3)    + Read ONE (1)    = 4 > 3    --> Strong
Write ONE (1)    + Read ALL (3)    = 4 > 3    --> Strong

Eventual Consistency Scenarios:
Write ONE (1) + Read ONE (1) = 2 < 3          --> Eventual
Write ONE (1) + Read QUORUM (2) = 3 = RF      --> NOT strong (need > RF)
\`\`\`

## Multi-Datacenter Consistency

\`\`\`
Two Data Centers: DC1 (primary), DC2 (disaster recovery)
RF per DC: 3

                  DC1                    DC2
            [N1] [N2] [N3]        [N4] [N5] [N6]

LOCAL_QUORUM writes:
  Coordinator in DC1 waits for 2/3 ACKs from DC1 only
  DC2 replicas are updated asynchronously
  --> Fast writes, strong within DC1, eventual in DC2

EACH_QUORUM writes:
  Coordinator waits for 2/3 ACKs from EACH DC
  --> Slower, but strong consistency across both DCs
\`\`\`

### Choosing the Right Level

| Use Case | Write CL | Read CL | Why |
|----------|----------|---------|-----|
| User session data | LOCAL_QUORUM | LOCAL_QUORUM | Strong consistency, low latency within DC |
| Analytics / logging | ONE | ONE | High throughput, stale reads acceptable |
| Financial transactions | QUORUM | QUORUM | Must not lose writes or read stale data |
| Social media feed | ONE | ONE | Eventual consistency is fine |
| Cross-DC sync | EACH_QUORUM | LOCAL_QUORUM | Strong writes across DCs, fast local reads |

## Lightweight Transactions (LWT)

For operations requiring linearizability (e.g., "insert only if not exists"), Cassandra offers LWT using Paxos:

\`\`\`sql
-- Compare-and-set: only insert if user doesn't exist
INSERT INTO users (user_id, name, email)
VALUES ('alice', 'Alice', 'alice@example.com')
IF NOT EXISTS;

-- Conditional update: only update if current value matches
UPDATE accounts SET balance = 900
WHERE account_id = 'acc_123'
IF balance = 1000;
\`\`\`

LWT uses a 4-round Paxos protocol internally, making it **10-20x slower** than regular writes. Use sparingly and only when linearizability is truly required.

## Key Takeaway

Cassandra's tunable consistency lets you choose the right trade-off for each query. Most applications use LOCAL_QUORUM for important data and ONE for high-throughput, latency-sensitive workloads. This flexibility is one of the main reasons Cassandra is chosen for applications that span multiple data centers.`,
    },
    {
      id: "cassandra-architecture",
      slug: "cassandra-architecture-walkthrough",
      title: "Cassandra: Architecture Walkthrough",
      content: `# Cassandra: Architecture Walkthrough

Let us bring together all the components into a complete picture of Cassandra's architecture.

## Full Architecture

\`\`\`
                 Cassandra Architecture
                 ======================

Client (CQL Driver, token-aware)
     |
     v
+------------------+
| Coordinator Node |  (any node -- no master)
+------------------+
     |
     +-- Gossip Protocol (membership, schema, token ring)
     |
     +-- Determines replicas via Token Ring
     |
     v
+--------+--------+--------+
| Node 1 | Node 2 | Node 3 |  (RF=3 replicas)
+--------+--------+--------+
Each node:
  |
  +-- Commit Log    (WAL, sequential append)
  |
  +-- Memtable      (in-memory, sorted)
  |
  +-- SSTables      (on-disk, immutable, sorted)
  |     |
  |     +-- Bloom Filter  (per SSTable)
  |     +-- Partition Index
  |     +-- Compression Offset Map
  |
  +-- Compaction    (background merge of SSTables)
  |
  +-- Merkle Trees  (anti-entropy repair)
  |
  +-- Hints         (hinted handoff for downed replicas)
\`\`\`

## Write Path End-to-End

\`\`\`
INSERT INTO messages (user_id, ts, body)
VALUES ('alice', '2024-03-01', 'Hello');

1. Client (token-aware) hashes 'alice' --> Token 42
2. Client sends directly to Node C (owns token range containing 42)
3. Node C is the coordinator:
   a. Determines replicas: [C, D, A] (RF=3)
   b. Sends write to C (local), D, A in parallel

4. On each replica node:
   a. Append to Commit Log (fsync)
   b. Insert into Memtable
   c. Return ACK

5. Coordinator waits for W ACKs (e.g., QUORUM = 2)
6. Returns success to client

7. Later (background):
   a. Memtable flushes to SSTable when full
   b. Compaction merges SSTables periodically
\`\`\`

## Read Path End-to-End

\`\`\`
SELECT * FROM messages WHERE user_id = 'alice' LIMIT 10;

1. Client hashes 'alice' --> Token 42 --> Node C
2. Node C coordinates read:
   a. Sends digest requests to R nodes (QUORUM = 2 of [C, D, A])
   b. One node sends full data, others send digest (hash)

3. On each responding node:
   a. Check Memtable for 'alice' partition
   b. For each SSTable:
      - Check Bloom filter ("could alice be here?")
      - If yes: check partition index, read data
   c. Merge memtable + SSTable results
   d. Apply tombstones, return newest columns

4. Coordinator compares digests:
   a. If match: return data to client
   b. If mismatch: request full data from all, merge,
      trigger read repair in background
\`\`\`

## Failure Scenarios

| Scenario | What Happens |
|----------|-------------|
| Single node down | Remaining replicas serve reads/writes. Hinted handoff stores writes for the downed node. |
| Node comes back | Hinted handoff replays missed writes. \`nodetool repair\` runs Merkle tree sync for full convergence. |
| Network partition between DCs | LOCAL_QUORUM operations continue in each DC independently. Cross-DC consistency is deferred until partition heals. |
| Disk failure | Node is decommissioned. Data is re-replicated from surviving replicas to a replacement node. |
| Slow node | Speculative retry: coordinator sends a second request to another replica after a timeout, using whichever responds first. |

## Cassandra vs. Dynamo Comparison

| Feature | Dynamo | Cassandra |
|---------|--------|-----------|
| Data model | Key-value only | Wide-column (CQL tables) |
| Conflict resolution | Vector clocks + app merge | Last-writer-wins (timestamp) |
| Query language | GET/PUT API | CQL (SQL-like) |
| Compaction | N/A (not LSM) | STCS / LCS / TWCS |
| Storage engine | Pluggable (BerkeleyDB) | LSM-tree (Memtable + SSTables) |
| Consistency | Quorum (R, W, N) | Tunable per-query CL |
| Lightweight transactions | None | Paxos-based LWT |

## Production Deployment Tips

1. **RF=3** is the standard for production. RF=2 risks data loss if one node fails during repair.
2. **LOCAL_QUORUM** for most read/write operations balances consistency and performance.
3. **Compaction strategy:** Use STCS for write-heavy tables, LCS for read-heavy tables, TWCS (Time Window) for time-series data.
4. **Repair:** Run \`nodetool repair\` weekly (or use automated repair tools) to ensure replica convergence.
5. **Monitor SSTable count** -- too many SSTables slow reads. Tune compaction thresholds accordingly.

## Key Takeaway

Cassandra achieves high availability and linear scalability through a peer-to-peer architecture with no single point of failure. Its LSM-tree storage engine provides exceptional write throughput, while Bloom filters, caches, and compaction keep reads fast. Tunable consistency lets operators choose the right trade-off for each workload.`,
    },
  ],
};
