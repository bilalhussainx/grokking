import { Module } from "../types";

export const dynamoModule: Module = {
  id: "design-dynamo",
  title: "Designing Amazon Dynamo",
  description:
    "Deep dive into the architecture of Amazon's Dynamo: consistent hashing, quorum reads/writes, vector clocks, Merkle trees, and anti-entropy repair.",
  lessons: [
    {
      id: "dynamo-requirements",
      slug: "dynamo-requirements",
      title: "Dynamo: Requirements & Motivation",
      content: `# Dynamo: Requirements & Motivation

Amazon's Dynamo (published 2007) is one of the most influential distributed system papers ever written. It powers Amazon's shopping cart, session management, and other services that require **always-on** write availability.

## The Problem

Amazon's e-commerce platform cannot afford to reject writes. If a customer adds an item to their cart, that operation MUST succeed, even if data centers are partitioning or nodes are failing. A failed write means lost revenue.

## Functional Requirements

1. **Put(key, value)** -- Store a value associated with a key
2. **Get(key)** -- Retrieve the value(s) associated with a key
3. Key-value store (no complex queries, no relational joins)
4. Values are typically small (< 1MB) -- shopping carts, session state, user preferences

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Availability | 99.9% at the 99.9th percentile (SLA) |
| Latency (read) | < 300ms at p99.9 |
| Latency (write) | < 300ms at p99.9 |
| Durability | No data loss for committed writes |
| Scalability | Add nodes without downtime |
| Partition tolerance | Continue operating during network splits |

**Key insight:** Dynamo chooses **AP** in the CAP theorem. It sacrifices strong consistency for always-on availability. The application resolves conflicts when they occur.

## Design Philosophy

\`\`\`
Dynamo Design Principles
=========================

1. Always Writable    -- Never reject a write
2. Decentralized      -- No master node, no single point of failure
3. Symmetry           -- Every node has the same responsibilities
4. Incremental Scale  -- Add one node at a time
5. Heterogeneity      -- Nodes can have different capacities
\`\`\`

## Key Techniques Overview

| Problem | Technique | Lesson |
|---------|-----------|--------|
| Data partitioning | Consistent hashing with virtual nodes | Next lesson |
| High availability for writes | Quorum + sloppy quorum + hinted handoff | Lesson 3 |
| Conflict detection | Vector clocks | Lesson 4 |
| Anti-entropy repair | Merkle trees | Lesson 5 |
| Membership & failure detection | Gossip protocol | Covered in Module 1 |

Dynamo's design has influenced DynamoDB, Cassandra, Riak, and Voldemort. The techniques we study here appear throughout modern distributed systems.`,
    },
    {
      id: "dynamo-consistent-hashing",
      slug: "dynamo-consistent-hashing",
      title: "Consistent Hashing & Virtual Nodes",
      content: `# Consistent Hashing & Virtual Nodes

Dynamo uses consistent hashing to partition data across nodes. This approach minimizes data movement when nodes join or leave.

## The Problem with Naive Hashing

With simple modular hashing (\`hash(key) % N\`), adding or removing a node changes the assignment of **almost every key**:

\`\`\`
N=3: hash("cart_123") % 3 = 1  --> Node 1
N=4: hash("cart_123") % 4 = 3  --> Node 3 (moved!)

~75% of keys must be redistributed when one node is added.
\`\`\`

## Consistent Hashing

Nodes and keys are both mapped onto a **hash ring** (0 to 2^128 - 1). Each key is assigned to the first node encountered when walking clockwise from the key's position.

\`\`\`
          Node A
           |
     key3  |  key1
       \\   |   /
        \\  |  /
   Node D--+--Node B
        /  |  \\
       /   |   \\
     key4  |  key2
           |
          Node C

key1 --> Node B (next node clockwise)
key2 --> Node C
key3 --> Node A
key4 --> Node D
\`\`\`

**When a node is added:** Only keys between the new node and its predecessor are moved. On average, only K/N keys move (K = total keys, N = total nodes).

**When a node is removed:** Its keys move to the next node clockwise.

## The Problem: Uneven Distribution

With few nodes, the hash ring can be badly unbalanced. One node might own 60% of the ring while another owns 10%.

## Virtual Nodes (vnodes)

Instead of mapping each physical node to one point on the ring, map it to **many** points (virtual nodes):

\`\`\`
Physical Nodes: A, B, C
Virtual Nodes (3 per physical):

Ring:  A1 -- B1 -- C1 -- A2 -- B2 -- C2 -- A3 -- B3 -- C3
       |                                                  |
       +--------------------------------------------------+

Each physical node owns multiple segments of the ring.
\`\`\`

**Benefits:**
1. **Even distribution:** More vnodes = more uniform key distribution
2. **Heterogeneous hardware:** A powerful machine gets more vnodes
3. **Faster rebalancing:** When a node goes down, its load spreads across MANY nodes (not just one successor)

**Typical configuration:** 256 virtual nodes per physical node.

## Token Assignment

Each vnode is assigned a **token** -- its position on the hash ring. When a new node joins:

1. It is assigned a set of tokens (vnode positions)
2. For each token, it takes ownership of a segment of the ring
3. Data in those segments is streamed from the current owners
4. Existing nodes update their ring membership via gossip

## Key Takeaway

Consistent hashing with virtual nodes ensures that data is evenly distributed across nodes and that adding or removing a node only requires moving a small, predictable fraction of the data. This is why Dynamo can scale incrementally without downtime.`,
      starterCode: `# Consistent Hashing Implementation
# Implement a ConsistentHashRing that supports:
# 1. add_node(node_id, num_vnodes) - add a node with virtual nodes
# 2. remove_node(node_id) - remove a node and its vnodes
# 3. get_node(key) - find which node a key maps to
# 4. get_nodes(key, n) - find n distinct nodes for replication

import hashlib

class ConsistentHashRing:
    def __init__(self):
        self.ring = {}           # hash_value -> node_id
        self.sorted_keys = []    # sorted list of hash positions
        self.node_vnodes = {}    # node_id -> list of hash positions

    def _hash(self, key: str) -> int:
        """Generate a hash value for a key."""
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node_id: str, num_vnodes: int = 150):
        """Add a node with the specified number of virtual nodes."""
        # TODO: For each vnode, hash "{node_id}:vnode_{i}"
        # and add to the ring. Keep sorted_keys sorted.
        pass

    def remove_node(self, node_id: str):
        """Remove a node and all its virtual nodes from the ring."""
        # TODO: Remove all vnodes for this node
        pass

    def get_node(self, key: str) -> str:
        """Find which node a key maps to."""
        # TODO: Hash the key, find the next position on the ring
        # (clockwise), return the node at that position.
        # Use binary search on sorted_keys for efficiency.
        pass

    def get_nodes(self, key: str, n: int) -> list:
        """Find n distinct physical nodes for replication."""
        # TODO: Walk clockwise from the key's position,
        # collecting distinct node_ids until you have n.
        pass


# Test your implementation
if __name__ == "__main__":
    ring = ConsistentHashRing()

    # Add 3 nodes with 150 vnodes each
    ring.add_node("node-A", 150)
    ring.add_node("node-B", 150)
    ring.add_node("node-C", 150)

    # Test key distribution
    distribution = {"node-A": 0, "node-B": 0, "node-C": 0}
    for i in range(10000):
        node = ring.get_node(f"key_{i}")
        distribution[node] += 1

    print("Key distribution across 10000 keys:")
    for node, count in sorted(distribution.items()):
        print(f"  {node}: {count} keys ({count/100:.1f}%)")

    # Test replication
    replicas = ring.get_nodes("user:123", 3)
    print(f"\\nReplica nodes for 'user:123': {replicas}")

    # Test adding a node (should only move ~25% of keys)
    old_assignments = {f"key_{i}": ring.get_node(f"key_{i}") for i in range(10000)}
    ring.add_node("node-D", 150)
    moved = sum(1 for i in range(10000) if ring.get_node(f"key_{i}") != old_assignments[f"key_{i}"])
    print(f"\\nKeys moved after adding node-D: {moved}/10000 ({moved/100:.1f}%)")
`,
      solutionCode: `# Consistent Hashing Implementation - Solution

import hashlib
import bisect

class ConsistentHashRing:
    def __init__(self):
        self.ring = {}
        self.sorted_keys = []
        self.node_vnodes = {}

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node_id: str, num_vnodes: int = 150):
        self.node_vnodes[node_id] = []
        for i in range(num_vnodes):
            vnode_key = f"{node_id}:vnode_{i}"
            hash_val = self._hash(vnode_key)
            self.ring[hash_val] = node_id
            self.node_vnodes[node_id].append(hash_val)
            bisect.insort(self.sorted_keys, hash_val)

    def remove_node(self, node_id: str):
        if node_id not in self.node_vnodes:
            return
        for hash_val in self.node_vnodes[node_id]:
            del self.ring[hash_val]
            idx = bisect.bisect_left(self.sorted_keys, hash_val)
            self.sorted_keys.pop(idx)
        del self.node_vnodes[node_id]

    def get_node(self, key: str) -> str:
        if not self.ring:
            return None
        hash_val = self._hash(key)
        idx = bisect.bisect_right(self.sorted_keys, hash_val)
        if idx == len(self.sorted_keys):
            idx = 0  # Wrap around the ring
        return self.ring[self.sorted_keys[idx]]

    def get_nodes(self, key: str, n: int) -> list:
        if not self.ring:
            return []
        hash_val = self._hash(key)
        idx = bisect.bisect_right(self.sorted_keys, hash_val)
        result = []
        seen = set()
        for i in range(len(self.sorted_keys)):
            pos = (idx + i) % len(self.sorted_keys)
            node_id = self.ring[self.sorted_keys[pos]]
            if node_id not in seen:
                result.append(node_id)
                seen.add(node_id)
                if len(result) == n:
                    break
        return result


if __name__ == "__main__":
    ring = ConsistentHashRing()

    ring.add_node("node-A", 150)
    ring.add_node("node-B", 150)
    ring.add_node("node-C", 150)

    distribution = {"node-A": 0, "node-B": 0, "node-C": 0}
    for i in range(10000):
        node = ring.get_node(f"key_{i}")
        distribution[node] += 1

    print("Key distribution across 10000 keys:")
    for node, count in sorted(distribution.items()):
        print(f"  {node}: {count} keys ({count/100:.1f}%)")

    replicas = ring.get_nodes("user:123", 3)
    print(f"\\nReplica nodes for 'user:123': {replicas}")

    old_assignments = {f"key_{i}": ring.get_node(f"key_{i}") for i in range(10000)}
    ring.add_node("node-D", 150)
    moved = sum(1 for i in range(10000) if ring.get_node(f"key_{i}") != old_assignments[f"key_{i}"])
    print(f"\\nKeys moved after adding node-D: {moved}/10000 ({moved/100:.1f}%)")
`,
    },
    {
      id: "dynamo-replication",
      slug: "dynamo-replication-quorum",
      title: "Data Replication & Quorum Reads/Writes",
      content: `# Data Replication & Quorum Reads/Writes

Dynamo replicates each key to **N** nodes for durability and availability. It uses a quorum system to balance consistency and performance.

## Replication Strategy

Each key is stored on N consecutive nodes on the hash ring (the **preference list**). With virtual nodes, the preference list skips duplicate physical nodes:

\`\`\`
N = 3 (replication factor)

Ring:  ... -> B1 -> [A2] -> C1 -> B2 -> A3 -> ...
                     ^
                   key K

Preference list for K: [A, C, B]
(Walk clockwise, collect 3 distinct physical nodes)

Write K --> replicate to Node A, Node C, Node B
\`\`\`

## Quorum Parameters

Dynamo uses three parameters:
- **N** = Number of replicas (typically 3)
- **W** = Number of nodes that must acknowledge a write
- **R** = Number of nodes that must respond to a read

\`\`\`
Quorum Configurations
=====================

Strong consistency: R + W > N
  Example: N=3, R=2, W=2
  At least one node in every read overlaps with every write.

High write availability: W=1, R=3
  Writes are fast (only one ACK needed).
  Reads are slower (must contact all replicas).

High read availability: W=3, R=1
  Writes are slow (all replicas must ACK).
  Reads are fast (any one replica suffices).

Dynamo's typical config: N=3, R=2, W=2
\`\`\`

### Why R + W > N Gives Consistency

If W=2 and R=2 (with N=3), then:
- A write is confirmed by at least 2 of 3 nodes
- A read contacts at least 2 of 3 nodes
- By the pigeonhole principle, at least ONE node in the read set has the latest write

## Sloppy Quorum & Hinted Handoff

Strict quorum requires the designated N nodes to be available. But what if one is down? Dynamo uses a **sloppy quorum**: it writes to the first W **healthy** nodes, even if they are not in the preference list.

\`\`\`
Normal write for key K:
  Preference list: [A, C, B]
  Write to A, C, B  --> success

Node C is down:
  Sloppy quorum: write to [A, B, D]
  Node D stores the data with a HINT:
    "This data belongs to Node C"

When C comes back online:
  D sends the data to C (hinted handoff)
  D deletes its local copy
\`\`\`

**Benefit:** Writes NEVER fail due to a single node being down. This is critical for Dynamo's "always writable" guarantee.

**Trade-off:** During the period when C is down, reads with R=2 might not find the latest data if they contact A and C (C has stale data). This is why Dynamo is eventually consistent.

## Read Repair

When a read contacts R nodes and discovers that some have stale data:

1. Return the latest version to the client
2. Send the latest version to the stale nodes in the background

This is an **opportunistic** consistency mechanism -- reads actively repair inconsistencies.

## Put and Get Flow

\`\`\`
PUT(key, value, context)
========================
1. Client sends to any node (coordinator)
2. Coordinator determines preference list
3. Coordinator sends write to top N healthy nodes
4. Wait for W acknowledgments
5. Return success to client

GET(key)
========
1. Client sends to any node (coordinator)
2. Coordinator sends read to top N healthy nodes
3. Wait for R responses
4. If versions differ, resolve conflicts (vector clocks)
5. Return value(s) to client
6. Trigger read repair if stale versions found
\`\`\`

## Key Takeaway

Dynamo's quorum system provides tunable consistency. By adjusting R and W, operators can trade off between consistency, latency, and availability. The sloppy quorum with hinted handoff ensures writes almost never fail, making Dynamo suitable for critical, always-on services.`,
    },
    {
      id: "dynamo-vector-clocks",
      slug: "dynamo-vector-clocks",
      title: "Vector Clocks for Conflict Detection",
      content: `# Vector Clocks in Dynamo

Dynamo uses vector clocks to track the causal history of each key's value, enabling it to detect when concurrent writes create conflicts.

## How Dynamo Attaches Vector Clocks

Each value stored in Dynamo carries a vector clock: a list of (node, counter) pairs. When a node handles a write, it increments its own counter in the vector clock.

\`\`\`
Scenario: Two clients update the same shopping cart

Step 1: Client 1 writes via Node A
  D1: value=[item1], clock=[(A,1)]

Step 2: Client 1 adds item2 via Node A
  D2: value=[item1, item2], clock=[(A,2)]

Step 3: Client 2 reads D2, then adds item3 via Node B
  D3: value=[item1, item2, item3], clock=[(A,2), (B,1)]

Step 4: Client 1 reads D2 (stale!), adds item4 via Node C
  D4: value=[item1, item2, item4], clock=[(A,2), (C,1)]

Now D3 and D4 are CONCURRENT:
  D3: [(A,2), (B,1)]  -- neither dominates
  D4: [(A,2), (C,1)]  -- the other
\`\`\`

## Conflict Detection

When a client issues a GET, Dynamo may return **multiple versions** (siblings) if their vector clocks are concurrent:

\`\`\`
GET(cart_user_123)
  Node A has: D3 = [(A,2), (B,1)]
  Node B has: D3 = [(A,2), (B,1)]
  Node C has: D4 = [(A,2), (C,1)]

R=2, so we read from 2 nodes:
  If A and C respond: D3 and D4 are concurrent
  --> Return BOTH to the client as siblings
\`\`\`

## Application-Level Resolution

Dynamo pushes conflict resolution to the application. The shopping cart service uses a simple strategy: **take the union of all items**.

\`\`\`
Client receives siblings:
  D3: [item1, item2, item3]
  D4: [item1, item2, item4]

Application merges: [item1, item2, item3, item4]

Client writes merged version via Node A:
  D5: value=[item1, item2, item3, item4], clock=[(A,3), (B,1), (C,1)]

D5 dominates both D3 and D4 --> conflict resolved.
\`\`\`

## Vector Clock Truncation

Over time, vector clocks can grow large if many nodes handle writes for the same key. Dynamo truncates old entries using a timestamp-based policy:

- Each (node, counter) pair includes a timestamp of last update
- If the clock has more than 10 entries, remove the oldest
- This can cause false conflicts (two versions appear concurrent when one actually preceded the other)
- In practice, Dynamo reports this rarely occurs because most keys are written by the same 1-3 nodes

## Why Not Last-Writer-Wins?

LWW (using physical timestamps) would be simpler, but it can **silently lose data**:

\`\`\`
LWW Failure Mode:
  Client 1 adds item3 at t=100ms
  Client 2 adds item4 at t=101ms (slightly faster clock)

  LWW keeps only item4, LOSING item3 silently.

Vector clocks detect the conflict and preserve BOTH versions.
\`\`\`

For a shopping cart, losing an item means lost revenue. Dynamo's vector clock approach ensures no write is ever silently discarded.

## The Context Parameter

When a client writes, it passes back the **context** (vector clock) from its last read. This tells Dynamo the causal history:

\`\`\`
context = vector clock from last GET
PUT(key, value, context)
  --> Dynamo knows this write descends from the state in context
  --> Increments the coordinator node's counter
  --> Stores new value with updated vector clock
\`\`\`

If a client writes WITHOUT a context (e.g., on a fresh connection), Dynamo treats it as a new, concurrent write. This is why the client must always read before writing.

## Key Takeaway

Vector clocks in Dynamo ensure that concurrent writes are detected rather than silently overwritten. The trade-off is complexity: applications must handle conflict resolution when siblings are returned. For Amazon's shopping cart, this is worth it -- a few extra items in the cart are far better than lost items.`,
    },
    {
      id: "dynamo-merkle-trees",
      slug: "dynamo-merkle-trees",
      title: "Merkle Trees for Anti-Entropy",
      content: `# Merkle Trees for Anti-Entropy

Even with read repair and hinted handoff, some replicas can fall out of sync. Dynamo uses **Merkle trees** (hash trees) to efficiently detect and repair inconsistencies between replicas.

## The Problem

Two nodes store replicas of the same key range. How do they determine which keys differ without transferring ALL their data?

\`\`\`
Node A has 1,000,000 keys in range [0, 1000)
Node B has 1,000,000 keys in range [0, 1000)

Naive approach: send all keys + values from A to B
  --> Transfers ~1TB of data to find maybe 10 differences

Merkle tree approach: compare tree hashes
  --> Transfers ~10KB to identify the 10 different keys
\`\`\`

## How Merkle Trees Work

A Merkle tree is a binary tree of hashes. Each leaf node is the hash of a key range. Each internal node is the hash of its children.

\`\`\`
                    [Root Hash]
                   /            \\
            [Hash AB]          [Hash CD]
           /        \\         /        \\
      [Hash A]  [Hash B]  [Hash C]  [Hash D]
        |          |         |          |
   keys[0-249] keys[250-499] keys[500-749] keys[750-999]
\`\`\`

**Key insight:** If the root hashes of two Merkle trees match, ALL data is identical. If they differ, we can recursively compare children to find EXACTLY which key ranges differ.

## Anti-Entropy Protocol

\`\`\`
Anti-Entropy Synchronization
=============================

Step 1: Node A sends its Merkle tree ROOT hash to Node B
  A: root = "abc123"
  B: root = "xyz789"
  --> Different! Proceed to children.

Step 2: Compare left and right children
  A: left  = "def456"    B: left  = "def456"   --> SAME (skip)
  A: right = "ghi789"    B: right = "jkl012"   --> DIFFERENT

Step 3: Recurse into the right subtree
  A: right.left  = "mno"   B: right.left  = "mno"   --> SAME
  A: right.right = "pqr"   B: right.right = "stu"   --> DIFFERENT

Step 4: Reached leaf level -- transfer keys in range [750-999]
  A sends its keys/values in [750-999] to B
  B sends its keys/values in [750-999] to A
  Both merge, keeping the latest version (via vector clock)
\`\`\`

## Efficiency

For a tree with L leaf nodes:
- **Best case** (trees identical): Exchange 1 hash (32 bytes)
- **Worst case** (all leaves differ): Exchange O(L) hashes
- **Typical case** (few differences): Exchange O(log L * D) hashes, where D is the number of differing leaf ranges

## Dynamo's Merkle Tree Design

Each Dynamo node maintains **one Merkle tree per key range** it is responsible for. When a node joins, leaves, or is repaired, the affected Merkle trees are rebuilt.

\`\`\`
Node A is responsible for key ranges:
  [0, 100)    --> Merkle Tree 1
  [300, 400)  --> Merkle Tree 2
  [700, 800)  --> Merkle Tree 3

To sync range [0, 100) with Node B:
  Compare Merkle Tree 1 of A with Merkle Tree 1 of B
\`\`\`

### Rebuilding Merkle Trees

When data changes, the Merkle tree must be updated:
1. Recalculate the hash of the affected leaf
2. Recalculate all ancestor hashes up to the root
3. Cost: O(log L) hash computations per update

**Dynamo rebuilds trees periodically** rather than on every write to amortize the cost.

## Merkle Trees Beyond Dynamo

- **Git:** Uses Merkle trees (via SHA-1) to track file changes. A commit hash is the root of a Merkle tree over the entire repository state.
- **Bitcoin/Ethereum:** Transaction Merkle trees allow lightweight verification of individual transactions.
- **Cassandra:** Uses Merkle trees for \`nodetool repair\` (anti-entropy repair).
- **IPFS:** Content-addressed storage using Merkle DAGs.

## Key Takeaway

Merkle trees allow two replicas to identify EXACTLY which keys differ with minimal data transfer. This makes anti-entropy repair practical even for nodes with millions of keys. The approach works because hash comparisons are cheap and most data is typically in sync.`,
    },
    {
      id: "dynamo-architecture",
      slug: "dynamo-architecture-walkthrough",
      title: "Dynamo: Architecture Walkthrough",
      content: `# Dynamo: Architecture Walkthrough

Let us tie together all the components into a complete picture of how Dynamo operates.

## Complete Architecture

\`\`\`
                    Dynamo Architecture
                    ===================

Client Request (PUT/GET)
         |
         v
+------------------+
|   Load Balancer  |  (routes to any Dynamo node)
+------------------+
         |
         v
+------------------+
|   Coordinator    |  (any node can be coordinator)
|   Node           |
|                  |
|  1. Partition    |  <-- Consistent Hash Ring
|  2. Replicate    |  <-- Preference List (N nodes)
|  3. Quorum       |  <-- Wait for W/R responses
+------------------+
    |    |    |
    v    v    v
+------+------+------+
|Node A|Node B|Node C|  (N=3 replicas)
|      |      |      |
|[KV]  |[KV]  |[KV]  |  Local key-value store
|[VC]  |[VC]  |[VC]  |  Vector clocks per key
|[MT]  |[MT]  |[MT]  |  Merkle trees per range
|[GS]  |[GS]  |[GS]  |  Gossip state
+------+------+------+
    \\     |     /
     \\    |    /
      v   v   v
  Gossip Protocol
  (membership, failure detection)
\`\`\`

## Write Path (PUT)

\`\`\`
PUT(key="cart_123", value={items: [...]}, context=vc)
  |
  v
1. Client sends to any node (or load balancer picks one)
  |
  v
2. Coordinator hashes "cart_123" to find position on ring
  |
  v
3. Preference list: walk clockwise, find N=3 distinct physical nodes
   Example: [Node A, Node C, Node B]
  |
  v
4. Coordinator sends write to all 3 nodes IN PARALLEL
  |
  v
5. Each replica:
   a. Updates vector clock: increment coordinator's counter
   b. Stores value + vector clock to local storage (BerkeleyDB / MySQL)
   c. Sends ACK back to coordinator
  |
  v
6. Coordinator waits for W=2 ACKs
  |
  v
7. If W ACKs received: return SUCCESS to client
   If not enough ACKs: try next node (sloppy quorum)
   If timeout: return FAILURE (extremely rare)
\`\`\`

## Read Path (GET)

\`\`\`
GET(key="cart_123")
  |
  v
1. Coordinator hashes key, finds preference list
  |
  v
2. Send read request to all N=3 nodes in parallel
  |
  v
3. Wait for R=2 responses
  |
  v
4. Compare vector clocks of returned values:
   a. One version dominates all others --> return that version
   b. Multiple concurrent versions exist --> return ALL as siblings
  |
  v
5. Return value(s) + context (vector clock) to client
  |
  v
6. Background: if stale versions detected, trigger READ REPAIR
   (send latest version to nodes with stale data)
\`\`\`

## Failure Handling

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Node temporarily down | Gossip heartbeat timeout | Hinted handoff: write stored on backup node, forwarded when node recovers |
| Node permanently down | Extended gossip absence | Admin removes node. Merkle tree sync rebuilds data on replacement node |
| Network partition | Gossip detects split | Sloppy quorum: both sides continue accepting writes. Vector clocks detect conflicts after partition heals |
| Disk failure | Local health check | Node is treated as permanently down. Data reconstructed from other replicas |

## Summary of Techniques

\`\`\`
+------------------------+--------------------------------+
| Problem                | Dynamo's Solution              |
+------------------------+--------------------------------+
| Partitioning           | Consistent hashing + vnodes    |
| Replication            | N replicas on preference list  |
| Write availability     | Sloppy quorum + hinted handoff |
| Conflict detection     | Vector clocks                  |
| Conflict resolution    | Application-level (client)     |
| Read consistency       | Quorum (R + W > N)             |
| Anti-entropy           | Merkle trees                   |
| Membership             | Gossip protocol                |
| Failure detection      | Gossip (phi accrual detector)  |
+------------------------+--------------------------------+
\`\`\`

## Dynamo's Legacy

Dynamo's 2007 paper inspired an entire generation of distributed databases:

- **DynamoDB** (Amazon): Managed service based on Dynamo principles, adds strong consistency option
- **Cassandra** (Facebook/Apache): Combines Dynamo's partitioning with Bigtable's data model
- **Riak** (Basho): Faithful implementation of the Dynamo paper
- **Voldemort** (LinkedIn): Key-value store using Dynamo design

## Key Takeaway

Dynamo is a masterclass in engineering trade-offs. By choosing availability over consistency, using sloppy quorums for writes, vector clocks for conflict detection, and Merkle trees for repair, it achieves the "always writable" guarantee that Amazon's business demands. Every technique solves a specific problem, and together they form a cohesive, battle-tested architecture.`,
    },
  ],
};
