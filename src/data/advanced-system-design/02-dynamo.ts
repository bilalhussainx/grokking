import { Module } from "../types";

export const dynamoModule: Module = {
  id: "design-dynamo",
  title: "Designing Amazon Dynamo",
  description: "Deep dive into the architecture of Amazon's Dynamo: consistent hashing, quorum reads/writes, vector clocks, Merkle trees, and anti-entropy repair.",
  lessons: [
    {
      id: "dynamo-requirements",
      slug: "dynamo-requirements",
      title: "Dynamo: Requirements & Motivation",
      content: `# Dynamo: Requirements & Motivation

Amazon's Dynamo (published SOSP 2007, DeCandia et al.) is one of the most influential distributed systems papers ever written. It powers Amazon's shopping cart, session management, and other services that require **always-on** write availability — even as data centers partition and nodes fail.

\`\`\`concept
{
  "title": "The Dynamo Thesis",
  "variant": "mental-model",
  "content": "Dynamo's central bet: a write that is rejected is worse than a write that is inconsistent. Amazon's e-commerce platform treats a failed cart-add as lost revenue. Every design decision flows from this single premise — availability is non-negotiable, and conflict resolution is pushed to the caller."
}
\`\`\`

## The Problem

At Amazon's scale — over 3 million checkouts on a peak day, hundreds of thousands of machines — network partitions and disk failures are not edge cases. They are **normal operating conditions** (source: DeCandia et al., SOSP 2007). A storage layer built on strict consistency would reject writes during these events. Dynamo makes the opposite trade: it always accepts writes, then reconciles divergence later.

\`\`\`callout
{
  "type": "info",
  "title": "Why not a traditional RDBMS?",
  "content": "Strict consistency is expensive and doesn't tolerate the right failure modes. Amazon's services often have internal knowledge to handle certain inconsistencies — the shopping cart can merge two divergent carts on the next read. A relational DB cannot express that semantic, and its locking overhead was unacceptable at this scale."
}
\`\`\`

## Functional & Non-Functional Requirements

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Functional",
      "icon": "⚙️",
      "content": "Dynamo exposes a minimal two-operation API:\\n\\n- **\`put(key, context, object)\`** — Store a value. The \`context\` carries version metadata (vector clock) so Dynamo knows the causal history of the write.\\n- **\`get(key)\`** — Retrieve the value(s) for a key. Returns a **list** of objects when unresolved conflicts exist, plus the context needed to reconcile them.\\n\\nNo complex queries. No relational joins. Values are typically small (< 1 MB) — shopping carts, session state, user preferences."
    },
    {
      "label": "Non-Functional",
      "icon": "📊",
      "content": "| Requirement | Target |\\n|---|---|\\n| Availability | 99.9% at p99.9 (SLA-contractual) |\\n| Read latency | < 300 ms at p99.9 |\\n| Write latency | < 300 ms at p99.9 |\\n| Durability | No data loss for committed writes |\\n| Scalability | Add nodes without downtime |\\n| Partition tolerance | Operate during network splits |\\n\\nNote that p99.9 is deliberately chosen — Amazon cares about the **tail**, not the median. A median latency of 10 ms is useless if 0.1% of requests time out."
    },
    {
      "label": "CAP Position",
      "icon": "🔺",
      "content": "Dynamo explicitly chooses **AP** (Available + Partition-tolerant) in the CAP theorem:\\n\\n- **Availability**: Always accept reads and writes\\n- **Partition tolerance**: Continue operating during network splits\\n- **Consistency sacrificed**: Concurrent writes to different replicas can diverge\\n\\nThe application layer resolves conflicts on the next read. For the shopping cart, this means: merge two divergent carts rather than losing either. The customer never sees a failed add-to-cart."
    }
  ]
}
\`\`\`

## Design Philosophy

\`\`\`steps
{
  "title": "Dynamo's Five Design Principles",
  "steps": [
    {
      "title": "Always Writable",
      "content": "Never reject a write, even during network partitions or node failures. The system accepts the write and defers conflict resolution. This is the foundational constraint every other principle serves."
    },
    {
      "title": "Decentralized",
      "content": "No master node. No single point of failure. Every node is a peer. This eliminates centralized bottlenecks and makes the system resilient to the loss of any individual node — including what would traditionally be the 'coordinator'."
    },
    {
      "title": "Symmetry",
      "content": "Every node has the same set of responsibilities and code. There are no special roles like 'primary' or 'replica'. A request can be handled by any node. This dramatically simplifies operations and reasoning about the system."
    },
    {
      "title": "Incremental Scale",
      "content": "Add one node at a time without downtime or re-partitioning the entire dataset. Consistent hashing (next lesson) makes this possible by minimizing key movement when the ring membership changes."
    },
    {
      "title": "Heterogeneity",
      "content": "Nodes can have different storage and compute capacities. The system accounts for this via virtual nodes — a higher-capacity machine can own more positions on the hash ring and therefore a proportionally larger share of the data."
    }
  ]
}
\`\`\`

## How the Techniques Fit Together

Each requirement maps directly to a technique. This table is the architecture's skeleton — every subsequent lesson in this module is one row:

| Problem | Technique | Lesson |
|---------|-----------|--------|
| Data partitioning across N nodes | Consistent hashing + virtual nodes | Next lesson |
| High availability for writes | Quorum + sloppy quorum + hinted handoff | Lesson 3 |
| Concurrent-write conflict detection | Vector clocks | Lesson 4 |
| Replica divergence repair | Anti-entropy via Merkle trees | Lesson 5 |
| Membership & failure detection | Gossip protocol | Module 1 recap |

\`\`\`callout
{
  "type": "tip",
  "title": "Default configuration: N=3, R=2, W=2",
  "content": "Amazon's shopping cart service ran with N=3, R=2, W=2 during peak holiday season (tens of millions of requests, 3M+ checkouts/day, no downtime). The key invariant is R + W > N (2+2 > 3), which guarantees read-write quorum overlap — any read quorum will include at least one node from the last write quorum. This gives read-your-writes consistency when no concurrent writes occur."
}
\`\`\`

## Influence

Dynamo's techniques didn't stay inside Amazon. They propagated across the industry:

- **Apache Cassandra** — adopted consistent hashing, gossip, tunable quorums, and anti-entropy Merkle trees almost verbatim
- **Amazon DynamoDB** — the managed cloud successor, abstracts away N/R/W but builds on the same partitioning model
- **Riak** — open-source Dynamo clone (Basho, 2009)
- **Voldemort** — LinkedIn's Dynamo-inspired key-value store
- **Redis Cluster** — uses consistent hashing; simpler conflict resolution

\`\`\`quiz
{
  "title": "Requirements & Motivation Check",
  "questions": [
    {
      "question": "Why does Dynamo's get() return a *list* of objects rather than a single value?",
      "options": [
        "To support multi-key batch reads",
        "Because multiple versions may exist from unresolved concurrent writes",
        "To implement read-repair across all N replicas",
        "For backwards compatibility with Amazon's legacy systems"
      ],
      "answer": 1,
      "explanation": "Concurrent writes to different replicas can produce divergent versions. Dynamo returns all conflicting versions along with their vector-clock context so the caller can merge them and write back a reconciled version. Single-value returns would silently discard one branch."
    },
    {
      "question": "Which CAP properties does Dynamo prioritize?",
      "options": [
        "CP — Consistency and Partition tolerance",
        "CA — Consistency and Availability",
        "AP — Availability and Partition tolerance",
        "All three simultaneously"
      ],
      "answer": 2,
      "explanation": "Dynamo explicitly chooses AP. It always accepts writes (availability) and continues operating during network splits (partition tolerance), at the cost of strong consistency. Conflicting versions are resolved by the application, not the storage layer."
    },
    {
      "question": "What does the 'Symmetry' design principle mean in practice?",
      "options": [
        "All replicas must store identical data at all times",
        "Read and write quorum sizes must be equal (R = W)",
        "Every node runs the same code and has the same responsibilities — no special master role",
        "Data is distributed symmetrically so each node holds exactly 1/N of the dataset"
      ],
      "answer": 2,
      "explanation": "Symmetry means there is no master node, primary replica, or special coordinator role. Any node can handle any request. This eliminates single points of failure and simplifies reasoning about system behavior during failures."
    },
    {
      "question": "Given N=3, R=2, W=2 — what failure scenario can Dynamo still serve reads AND writes?",
      "options": [
        "Two nodes are down simultaneously",
        "All three nodes are partitioned from each other",
        "Exactly one node is unavailable",
        "The coordinator node crashes mid-write"
      ],
      "answer": 2,
      "explanation": "With N=3, R=2, W=2: losing one node leaves 2 healthy replicas. Since both R and W require only 2 acknowledgements, reads and writes can still complete. Losing two nodes drops below quorum for both operations (only 1 replica available, need 2)."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Dynamo's thesis: a rejected write (lost revenue) is worse than an inconsistent write (mergeable later). Every design decision flows from this premise.",
    "The API is intentionally minimal — put(key, context, object) and get(key) — where context carries the vector clock enabling conflict detection.",
    "Dynamo occupies the AP corner of CAP: always-on availability and partition tolerance at the cost of strong consistency, resolved by the application.",
    "Five principles guide every architectural decision: Always Writable, Decentralized, Symmetric, Incrementally Scalable, Heterogeneous.",
    "The default N=3, R=2, W=2 configuration guarantees quorum overlap (R+W > N) and tolerated one-node failures across Amazon's peak shopping traffic."
  ]
}
\`\`\``,
    },
    {
      id: "dynamo-consistent-hashing",
      slug: "dynamo-consistent-hashing",
      title: "Consistent Hashing & Virtual Nodes",
      content: `# Consistent Hashing & Virtual Nodes

Dynamo partitions data across nodes using **consistent hashing** — a technique that makes cluster membership changes cheap. When a node joins or leaves, only a small, predictable fraction of keys must move rather than the entire dataset.

## The Problem with Naive Hashing

The simplest partition strategy is \`node = hash(key) % N\`. It works until the cluster size changes.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Naive modular hashing — adding one node (N=3 → N=4)",
    "code": "# Every key is re-evaluated against the new modulus\\nhash(\\"cart_123\\") % 3 = 1  →  Node 1\\nhash(\\"cart_123\\") % 4 = 3  →  Node 3  ← MOVED\\n\\nhash(\\"user_456\\") % 3 = 2  →  Node 2\\nhash(\\"user_456\\") % 4 = 1  →  Node 1  ← MOVED\\n\\n# Result: ~75% of ALL keys must be redistributed.\\n# At 1 million keys → 750,000 cache misses."
  },
  "after": {
    "label": "Consistent hashing — adding one node (N=3 → N=4)",
    "code": "# Ring positions (simplified 0–100):\\n# Node A @ 10,  Node B @ 40,  Node C @ 70\\n\\n# Adding Node D at position 50:\\n# Only keys in range (40, 50] move to Node D.\\n# hash(\\"cart_123\\") @ 25 → Node B: UNCHANGED\\n# hash(\\"user_456\\") @ 45 → was Node C, now Node D\\n\\n# Result: on average only K/N keys move\\n# (K = total keys, N = new total nodes)"
  }
}
\`\`\`

\`\`\`concept
{
  "title": "The Consistent Hashing Insight",
  "variant": "mental-model",
  "content": "Traditional hashing bakes the server count directly into the formula:\\n\`server = hash(key) % num_servers\`\\nChange \`num_servers\` and almost everything shifts.\\n\\nConsistent hashing removes that dependency entirely:\\n\`server = ring.findNextClockwise(hash(key))\`\\nThe number of nodes is nowhere in the formula — so adding or removing a node only disturbs the keys that lived on the directly affected arc of the ring."
}
\`\`\`

## The Hash Ring

Both nodes **and** keys are mapped into the same circular hash space (0 to 2¹²⁸ − 1). A key's owner is the first node encountered walking **clockwise** from the key's hash position.

\`\`\`mermaid
graph LR
    A["🖥 Node A\\n@ pos 10"] --> B["🖥 Node B\\n@ pos 40"]
    B --> C["🖥 Node C\\n@ pos 70"]
    C --> A

    K1["🔑 key1\\n@ pos 25"] -.->|next clockwise| B
    K2["🔑 key2\\n@ pos 55"] -.->|next clockwise| C
    K3["🔑 key3\\n@ pos 80"] -.->|wraps around| A
\`\`\`

| Key | Hash position | Next clockwise node | Owner |
|-----|:---:|---|:---:|
| key1 | 25 | Node B @ 40 | **B** |
| key2 | 55 | Node C @ 70 | **C** |
| key3 | 80 | wraps → Node A @ 10 | **A** |

If Node A is removed, only key3 moves — to Node B. No other mapping changes.

## The Problem: Uneven Load

With only a few physical nodes, ring positions are determined by a hash function and can cluster badly. One node may own 60% of the ring while another owns only 10%.

\`\`\`callout
{
  "type": "warning",
  "title": "Unbalanced Rings Are Real",
  "content": "With 3 nodes at random ring positions, load standard deviation can exceed 30%. The original Dynamo paper (SOSP 2007) cites this as the primary motivator for virtual nodes — not just a theoretical concern."
}
\`\`\`

## Virtual Nodes (vnodes)

Instead of placing each physical node at **one** ring position, Dynamo places it at **many**. Each placement is called a **token** — its position on the ring. The original paper configures **256 tokens per physical node** as the baseline.

\`\`\`algoviz
{
  "title": "Virtual Nodes — Ring Distribution (3 vnodes per physical node)",
  "type": "array",
  "data": ["A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3"],
  "frames": [
    {
      "highlight": [],
      "label": "Nine token positions interleaved across three physical nodes on the ring",
      "stats": {}
    },
    {
      "highlight": [0, 3, 6],
      "label": "Node A owns tokens A1, A2, A3 — spread evenly across the ring",
      "stats": { "Node A": "3 / 9 = 33%" }
    },
    {
      "highlight": [1, 4, 7],
      "label": "Node B owns tokens B1, B2, B3 — interleaved with A and C",
      "stats": { "Node B": "3 / 9 = 33%" }
    },
    {
      "highlight": [2, 5, 8],
      "label": "Node C owns tokens C1, C2, C3 — similarly spread",
      "stats": { "Node C": "3 / 9 = 33%" }
    },
    {
      "highlight": [0, 1, 2, 3, 4, 5, 6, 7, 8],
      "label": "Perfect interleaving: each physical node owns ~33% regardless of raw hash luck. With 256 tokens, imbalance is negligible.",
      "stats": { "A": "33%", "B": "33%", "C": "33%" }
    }
  ],
  "speed": 800
}
\`\`\`

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Even Distribution",
      "icon": "⚖️",
      "content": "More tokens per physical node means the law of large numbers smooths out ring imbalances. Each node converges toward owning \`1/N\` of the key space.\\n\\nWith 256 vnodes per physical node and 10 physical nodes, there are 2,560 ring positions — maximum imbalance shrinks to a few percent."
    },
    {
      "label": "Heterogeneous Hardware",
      "icon": "🖥️",
      "content": "A machine with 2× the RAM and CPU can be assigned **2× as many tokens**. It naturally absorbs proportionally more of the key space without any special routing logic.\\n\\nThis is why Dynamo's paper notes the scheme is \\"oblivious to the heterogeneity\\" — heterogeneity is expressed through token count, not special cases."
    },
    {
      "label": "Graceful Failure",
      "icon": "⚡",
      "content": "With plain consistent hashing, a failed node's entire load falls on **one** successor — potentially doubling its traffic instantly.\\n\\nWith vnodes, the failed node's tokens are scattered across many positions, so its load redistributes across **many** successors simultaneously. No single node is overwhelmed."
    }
  ]
}
\`\`\`

## Token Assignment — Node Join Process

\`\`\`steps
{
  "title": "How a New Node Joins the Dynamo Ring",
  "steps": [
    {
      "title": "Receive token assignments",
      "content": "The joining node is assigned a set of token positions — its virtual node locations on the ring. For a standard node this is 256 positions, proportional to its capacity."
    },
    {
      "title": "Claim ring segments",
      "content": "For each token, the new node takes ownership of the arc between that token and its predecessor. The current owners of those arcs must transfer their data for those key ranges."
    },
    {
      "title": "Stream data from multiple donors",
      "content": "Because the new node's tokens are spread across the ring, each donor only yields a **small slice** of its data. No single existing node bears the full rebalancing cost — this is the key operational benefit of vnode interleaving."
    },
    {
      "title": "Broadcast via gossip",
      "content": "Once data transfer completes, the new node broadcasts its token positions to the cluster using the gossip protocol. Every node updates its local ring view. No central coordinator is required."
    }
  ]
}
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: Key Movement Comparison — Consistent Hashing vs. vnodes",
  "content": "The Dynamo paper and community analyses quantify the improvement:\\n\\n**Naive hashing (N=3 → N=4):**\\n- Keys that move: ~75% (3 out of 4 hash buckets change)\\n- 1 million keys → ~750,000 must migrate\\n\\n**Consistent hashing (adding 1 node to 3-node ring):**\\n- Keys that move: ~25% (1/N average)\\n- 1 million keys → ~250,000 must migrate\\n- But: all movement falls on ONE successor node\\n\\n**Consistent hashing + vnodes (256 tokens per node):**\\n- Keys that move: ~25% (same fraction)\\n- 1 million keys → ~250,000 must migrate\\n- BUT: movement is spread across ALL existing nodes proportionally\\n- No single node sees more than a proportional share of the migration load\\n\\nThe vnode improvement is not in *how many* keys move, but in *who bears the cost* of moving them."
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "With naive modular hashing (\`hash(key) % N\`), approximately what fraction of keys must be redistributed when one node is added to a 3-node cluster?",
      "options": ["~1/4 (25%)", "~1/2 (50%)", "~3/4 (75%)", "~1/8 (12.5%)"],
      "answer": 2,
      "explanation": "Changing N from 3 to 4 reassigns ≈75% of keys because the modulus shifts for almost every hash value. With consistent hashing, only K/N ≈ 25% of keys move on average — the arc directly behind the new node."
    },
    {
      "question": "In Dynamo's consistent hash ring, how is a key's coordinator node determined?",
      "options": [
        "The node whose ID is numerically closest to the key's hash",
        "The first node encountered walking clockwise from the key's hash position",
        "A randomly selected node from the preference list",
        "The node with the lightest current load"
      ],
      "answer": 1,
      "explanation": "Keys and nodes share the same circular hash space (0 to 2^128 − 1). Each key is owned by the first node clockwise from its position. This is why adding a node only disturbs the single arc immediately counter-clockwise of the new node's position."
    },
    {
      "question": "When a physical node fails in a cluster using virtual nodes, how does its load get redistributed?",
      "options": [
        "Entirely to the single successor node on the ring",
        "Equally among all remaining nodes via a global rebalance",
        "Across many different nodes, one per failed token position",
        "It is queued in hinted handoff until the node recovers"
      ],
      "answer": 2,
      "explanation": "Each of the failed node's tokens is spread across the ring, and each token's arc has a different successor. So the failed node's load is absorbed by many different physical nodes proportionally — preventing any single node from being overwhelmed."
    },
    {
      "question": "How many virtual node tokens per physical node does Dynamo use in its baseline production configuration?",
      "options": ["16", "64", "256", "1024"],
      "answer": 2,
      "explanation": "The Dynamo paper and its analyses describe 256 tokens per physical node as the baseline. At this density the ring is fine-grained enough that load imbalance between nodes becomes negligible, and the failure-absorption benefit is maximized."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Naive hashing (\`hash(key) % N\`) redistributes ~(N−1)/N of all keys on any cluster size change — catastrophic at Amazon's scale.",
    "Consistent hashing maps both nodes and keys to a shared circular space; only the arc directly behind a new node is disturbed, moving K/N keys on average.",
    "Virtual nodes solve uneven load by placing each physical node at many ring positions — Dynamo uses 256 tokens per node by default.",
    "vnodes enable heterogeneous hardware (stronger machines get more tokens) and graceful failure absorption (load spreads across many successors, not one).",
    "A new node joining receives tokens, streams only the affected key ranges from multiple donors in parallel, then gossips its positions — no central coordinator required."
  ]
}
\`\`\``,
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

Dynamo replicates each key to **N** nodes for durability and availability. It uses a quorum system to balance consistency and performance — letting operators dial exactly how much consistency they need for a given workload.

\`\`\`concept
{ "title": "The Preference List", "variant": "mental-model", "content": "Every key maps to a position on the consistent hash ring. To build the preference list, walk clockwise from that position and collect the first N *distinct physical nodes*. Virtual nodes are skipped if they map to a physical node already in the list.\\n\\nResult: a ranked list [primary, secondary, tertiary, ...] of N nodes responsible for storing the key." }
\`\`\`

## Preference List on the Ring

With N = 3, suppose key K hashes to a position just before node A2 on the ring:

\`\`\`
Ring (clockwise): ... → B1 → [A2] → C1 → B2 → A3 → ...
                              ↑
                            key K

Preference list for K:  [A, C, B]
  (Walk clockwise, skip duplicates — A2 and A3 are the same physical node A)

Write K → replicate to Node A, Node C, Node B
\`\`\`

The coordinator — the first node in the preference list (or any node the client contacts) — fans the write out to all N replicas.

## Quorum Parameters

Dynamo exposes three tunable parameters drawn directly from the original Amazon paper [6]:

| Parameter | Meaning | Typical value |
|-----------|---------|--------------|
| **N** | Replication factor | 3 |
| **W** | Write quorum — nodes that must ACK | 2 |
| **R** | Read quorum — nodes that must respond | 2 |

\`\`\`tabs
{ "tabs": [
  {
    "label": "Balanced (N=3, R=2, W=2)",
    "icon": "⚖️",
    "content": "**Dynamo's default.** R + W = 4 > N = 3, so every read overlaps with every write by at least one node.\\n\\n- A write is confirmed by 2 of 3 replicas.\\n- A read contacts 2 of 3 replicas.\\n- By the pigeonhole principle, at least one node in the read set has the latest write.\\n\\n**Use case:** general-purpose workloads where you need both reasonable write speed and read freshness."
  },
  {
    "label": "Write-optimised (W=1, R=3)",
    "icon": "✍️",
    "content": "**Fast writes, slow reads.**\\n\\nA write succeeds after just one ACK — extremely low write latency. But to guarantee reading the latest version, the read must contact *all* N replicas.\\n\\n**Use case:** high-throughput ingestion pipelines where writes dominate and read latency is acceptable."
  },
  {
    "label": "Read-optimised (W=3, R=1)",
    "icon": "📖",
    "content": "**Slow writes, fast reads.**\\n\\nAll N replicas must acknowledge a write before it is confirmed. Any single replica is guaranteed to have the latest version, so a read only needs to contact one node.\\n\\n**Use case:** read-heavy catalogs or configuration data that changes rarely."
  },
  {
    "label": "Eventually consistent (W=1, R=1)",
    "icon": "🕐",
    "content": "**Maximum availability, no consistency guarantee.**\\n\\nNeither R + W > N. A read may return a stale version because the single node contacted might not have received the latest write yet.\\n\\n**Use case:** metrics aggregation, event counters — situations where approximate data is acceptable and latency is paramount."
  }
] }
\`\`\`

\`\`\`concept
{ "title": "Why R + W > N Guarantees Overlap", "variant": "rule", "content": "With N=3, W=2, R=2:\\n\\n- The write touched some subset W of the 3 replicas.\\n- The read touches some subset R of the 3 replicas.\\n- If W + R > N, the two subsets *must* intersect — at least one node appears in both sets.\\n- That node has the latest written value, so the read will always see it.\\n\\nThis is the pigeonhole principle applied to distributed reads and writes." }
\`\`\`

## Quorum Overlap Visualised

\`\`\`algoviz
{ "title": "Read/Write Overlap with N=3, W=2, R=2", "type": "array", "data": ["Node A", "Node B", "Node C"], "frames": [ { "highlight": [0, 1], "label": "Write: W=2 → ACKs from Node A and Node B", "stats": { "W": 2, "acked": "A, B" } }, { "highlight": [1, 2], "label": "Read: R=2 → responses from Node B and Node C", "stats": { "R": 2, "read_from": "B, C" } }, { "highlight": [1], "label": "Overlap: Node B is in both sets → latest version guaranteed", "stats": { "overlap": "B", "consistent": "yes" } }, { "highlight": [0, 1, 2], "label": "If W=1, R=1: no guaranteed overlap → stale reads possible", "stats": { "W": 1, "R": 1, "W_plus_R": 2, "N": 3, "consistent": "no" } } ], "speed": 1000 }
\`\`\`

## Sloppy Quorum & Hinted Handoff

A *strict* quorum requires exactly the N designated nodes to respond. But Dynamo is built for "always writable" operations — a downed node should never block a write.

\`\`\`steps
{ "title": "Sloppy Quorum in Action", "steps": [ { "title": "Normal write — all preference-list nodes available", "content": "Preference list for key K: **[A, C, B]**\\n\\nCoordinator writes to A, C, and B. All three ACK. W=2 satisfied within the preference list." }, { "title": "Node C goes down", "content": "Coordinator cannot reach C. Rather than failing the write, Dynamo walks further clockwise on the ring to find the next healthy node — say **D**.\\n\\nNode D stores the data with a *hint* metadata tag:\\n\`\`\`\\nhint = { intended_for: \\"Node C\\" }\\n\`\`\`\\nThe write still achieves W=2 ACKs from A and B (or A and D, depending on config). Write succeeds." }, { "title": "Hinted handoff — Node C recovers", "content": "When C comes back online, Node D detects its recovery (via the gossip protocol) and *hands off* the hinted replica:\\n\\n1. D sends the stored value + its hint to C.\\n2. C stores the data in its own store.\\n3. D deletes its local hinted copy.\\n\\nThe preference list is now fully restored." }, { "title": "Result: writes almost never fail", "content": "The combination of sloppy quorum + hinted handoff is how Dynamo achieves its **always-writable** guarantee. The original Amazon paper [3] lists this as the primary technique for handling temporary failures — it provides high availability and durability even when some replicas are unavailable." } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The Consistency Trade-off", "content": "During the window when C is down, a read with R=2 that contacts A and C (stale) will *not* see the latest write. This is the fundamental trade-off: sloppy quorum sacrifices strict consistency for availability. Dynamo is **eventually consistent** — replicas converge, but not instantly." }
\`\`\`

## Read Repair

Reads are not passive in Dynamo. When the coordinator contacts R nodes and discovers stale versions among the responses, it:

1. Returns the **latest version** (determined by vector clock) to the client immediately.
2. Sends the latest version to stale replicas **asynchronously** in the background.

This *opportunistic* repair means that every read actively heals the cluster. Heavy read traffic accelerates convergence without any dedicated repair process.

## Full PUT and GET Flow

\`\`\`trace
{ "title": "PUT(key K, value V) with N=3, W=2", "language": "python", "code": "def put(key, value, context):\\n    coordinator = find_coordinator(key)     # line 1\\n    pref_list = get_preference_list(key)    # line 2\\n    healthy = get_healthy_nodes(pref_list)  # line 3\\n    acks = 0\\n    for node in healthy[:N]:               # line 5\\n        node.write(key, value, context)     # line 6\\n        acks += 1\\n        if acks >= W:                       # line 8\\n            return success(context)         # line 9\\n    raise WriteFailure()", "frames": [ { "line": 1, "vars": { "key": "K", "value": "V" }, "note": "Any node can act as coordinator — client sends to nearest/least-loaded", "stdout": "" }, { "line": 2, "vars": { "pref_list": "[A, C, B]" }, "note": "Walk clockwise on ring, collect 3 distinct physical nodes", "stdout": "" }, { "line": 3, "vars": { "healthy": "[A, B, D]" }, "note": "C is unreachable — sloppy quorum activates, D is recruited with a hint", "stdout": "" }, { "line": 5, "vars": { "acks": 0 }, "note": "Writes fan out in parallel to top N healthy nodes", "stdout": "" }, { "line": 8, "vars": { "acks": 2 }, "note": "W=2 ACKs received from A and B — quorum satisfied", "stdout": "" }, { "line": 9, "vars": {}, "note": "Return success to client without waiting for the 3rd ACK", "stdout": "PUT success" } ], "speed": 900 }
\`\`\`

\`\`\`steps
{ "title": "GET(key K) with N=3, R=2", "steps": [ { "title": "Client contacts coordinator", "content": "Any node can be the coordinator. It determines the preference list for key K by walking the consistent hash ring." }, { "title": "Fan-out read to top N healthy nodes", "content": "Coordinator sends read requests to the top N healthy nodes in the preference list in parallel." }, { "title": "Wait for R responses", "content": "Once R=2 nodes respond, proceed. The remaining nodes' responses are ignored for latency purposes (but may still arrive and be used for read repair)." }, { "title": "Resolve conflicts if versions differ", "content": "If the R responses carry different vector clocks:\\n- If one dominates the other → discard the ancestor version.\\n- If they are **concurrent** (neither dominates) → return *both* to the client for application-level merge." }, { "title": "Trigger read repair", "content": "If any responding node had a stale version, the coordinator sends it the latest version asynchronously. The client already has its answer — repair happens in the background." } ] }
\`\`\`

## Design Summary

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Strict quorum only (no sloppy quorum)", "code": "PUT(K) requires exactly nodes A, C, B to ACK.\\nIf C is down → write FAILS.\\n\\nResult:\\n- Strong consistency\\n- Low availability (any node failure blocks writes)\\n- Unacceptable for always-on retail systems" }, "after": { "label": "Sloppy quorum + hinted handoff (Dynamo)", "code": "PUT(K) writes to any W healthy nodes.\\nIf C is down → write to D with a hint.\\nWhen C recovers → D hands off data to C.\\n\\nResult:\\n- Eventual consistency\\n- Very high write availability\\n- Writes almost never fail" } }
\`\`\`

\`\`\`quiz
{ "title": "Quorum Reads/Writes", "questions": [ { "question": "With N=3, W=2, R=2, a write is acknowledged by nodes {A, B}. Which nodes must a subsequent read contact to guarantee seeing that write?", "options": ["Any single node (R=1 suffices)", "Any 2 nodes from {A, B, C}", "Exactly {A, B}", "All 3 nodes"], "answer": 1, "explanation": "R + W > N ensures every possible R-node subset overlaps with every possible W-node subset. With W=2 and R=2, any 2 nodes from {A, B, C} must share at least one node with {A, B} — because 2 + 2 = 4 > 3. The overlap node holds the latest write." }, { "question": "Node D stores a hinted replica of key K originally destined for Node C. What does Node D do when Node C recovers?", "options": ["D keeps the data permanently as a second backup", "D deletes its copy immediately without notifying C", "D forwards the data to C, then deletes its local hinted copy", "D broadcasts the data to all nodes on the ring"], "answer": 2, "explanation": "This is the hinted handoff mechanism. The hint metadata on D's replica records the intended target (C). When C is detected as healthy again (via gossip), D transfers the data to C and removes its own copy, restoring the correct preference-list placement." }, { "question": "A configuration uses W=1, R=3 with N=3. What is the primary trade-off?", "options": ["Writes are slow; reads are fast", "Writes are fast; reads must contact all replicas", "Both reads and writes are slow for maximum durability", "This violates R + W > N, so consistency is not guaranteed"], "answer": 1, "explanation": "W=1 means only one ACK is needed — very fast writes. But R=3 = N means every replica must respond to a read to guarantee the latest value is included. R + W = 4 > N = 3, so consistency is still guaranteed, but read latency is higher because all N nodes must participate." }, { "question": "In Dynamo's read path, what triggers a read repair?", "options": ["The client explicitly requests a repair operation", "A background daemon scans all replicas nightly", "The coordinator detects stale versions among the R responses and pushes the latest version to lagging nodes asynchronously", "A write quorum failure automatically triggers repair on the next read"], "answer": 2, "explanation": "Read repair is opportunistic and automatic. When the coordinator collects R responses and notices that some nodes returned older vector-clock versions than others, it proactively sends the latest version to those stale nodes in the background — without delaying the client response." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Dynamo replicates each key to N nodes using a preference list built by walking the consistent hash ring clockwise and collecting N distinct physical nodes.", "Quorum invariant R + W > N guarantees at least one node in every read set has the latest write — enforcing eventual-to-strong consistency depending on R and W values.", "Sloppy quorum breaks the preference-list restriction during failures: writes go to any W healthy nodes. Hinted handoff restores correct placement once the original node recovers.", "Read repair is an opportunistic mechanism — coordinators push the latest version to stale nodes during normal reads, accelerating convergence without a dedicated repair process.", "The original Dynamo paper lists sloppy quorum + hinted handoff as the primary technique for handling temporary failures, enabling the 'always writable' guarantee critical for Amazon's retail systems." ] }
\`\`\``,
    },
    {
      id: "dynamo-vector-clocks",
      slug: "dynamo-vector-clocks",
      title: "Vector Clocks for Conflict Detection",
      content: `# Vector Clocks in Dynamo

Every write in Dynamo produces a new version of the object. Because Dynamo allows concurrent writes to reach different coordinator nodes, those versions can diverge. Vector clocks are the mechanism Dynamo uses to track **causal history** — so it can distinguish a version that *descends* from an earlier one from two versions that *conflict* and must be reconciled.

\`\`\`concept
{ "title": "Vector Clock as a Causal Fingerprint", "variant": "mental-model", "content": "A vector clock is a list of (node, counter) pairs attached to every version of every object. When a node coordinates a write, it increments its own counter. Comparing two clocks tells you whether one version causally precedes the other — or whether both were written concurrently and constitute a true conflict that must be surfaced to the application." }
\`\`\`

## How Dynamo Attaches Vector Clocks

Each stored value carries a vector clock alongside its data. The **coordinator node** — whichever replica handles the write — increments its own counter. The remaining entries are inherited from the version the client last read. The result is a compact record of which writes each version has seen.

The formal comparison rule:

> **Clock A is an ancestor of B** if every counter in A is ≤ the corresponding counter in B (and at least one counter in B is strictly greater). If neither clock dominates the other, the two versions are **concurrent** and must be surfaced as *siblings*.

## A Concrete Conflict: The Shopping Cart

The canonical Dynamo example involves a user's shopping cart updated from two different stale contexts simultaneously.

\`\`\`steps
{ "title": "Shopping Cart: Tracing a Concurrent Write", "steps": [ { "title": "D1 — Client 1 creates the cart via Node A", "content": "Node A coordinates the first write and sets its counter to 1.\\n\\n**D1:** \`value=[item1]\`, \`clock=[(A,1)]\`" }, { "title": "D2 — Client 1 adds item2 via Node A", "content": "Node A coordinates again, incrementing its counter. D2 **causally follows** D1 — A went 1→2.\\n\\n**D2:** \`value=[item1, item2]\`, \`clock=[(A,2)]\`" }, { "title": "D3 — Client 2 reads D2 fresh, adds item3 via Node B", "content": "Client 2 fetches the latest version (D2) and routes the write to Node B. Node B appends its own entry to the inherited clock.\\n\\n**D3:** \`value=[item1, item2, item3]\`, \`clock=[(A,2),(B,1)]\`\\n\\nD3 causally follows D2 — it *saw* A=2 and extended it." }, { "title": "D4 — Client 1 uses stale D2 context, adds item4 via Node C", "content": "Client 1 never re-fetched after step 2. It still holds the D2 context and routes the write to Node C.\\n\\n**D4:** \`value=[item1, item2, item4]\`, \`clock=[(A,2),(C,1)]\`\\n\\nD4 also follows D2 — but D3 and D4 have **never seen each other**." }, { "title": "Conflict — D3 and D4 are concurrent siblings", "content": "| Version | A | B | C |\\n|---------|---|---|---|\\n| **D3** | 2 | 1 | — |\\n| **D4** | 2 | — | 1 |\\n\\nNeither clock is ≤ the other in every dimension. D3 is ahead on B; D4 is ahead on C. Neither dominates → Dynamo returns **both** to the next reader." } ] }
\`\`\`

The resulting version history forms a DAG — two branches that diverged from D2 and must later be reconciled into D5:

\`\`\`mermaid
graph TD
  D1["D1: clock=(A,1)"] --> D2["D2: clock=(A,2)"]
  D2 --> D3["D3: clock=(A,2),(B,1) — has item3"]
  D2 --> D4["D4: clock=(A,2),(C,1) — has item4"]
  D3 --> D5["D5 merged: clock=(A,3),(B,1),(C,1)"]
  D4 --> D5
  style D3 fill:#f59e0b,color:#000
  style D4 fill:#f59e0b,color:#000
  style D5 fill:#10b981,color:#fff
\`\`\`

## Conflict Detection at Read Time

When a client issues \`GET(cart_user_123)\` and Dynamo's quorum returns multiple versions, the coordinator checks each pair of clocks:

- If one dominates the other, the dominated version is an **ancestor** — discard it.
- If neither dominates, the versions are **siblings** — return both in the response.

The client receives the siblings together with all of their vector clocks. It must perform reconciliation and write the merged result back, passing the combined context.

## Application-Level Resolution

Dynamo deliberately delegates conflict resolution to the application. The shopping cart service uses **set-union**: merge all items from all siblings.

\`\`\`text
Client receives siblings:
  D3: [item1, item2, item3]
  D4: [item1, item2, item4]

Application merges (union): [item1, item2, item3, item4]

Client writes merged version via Node A:
  D5: value=[item1,item2,item3,item4], clock=[(A,3),(B,1),(C,1)]

D5 dominates both D3 and D4 → conflict resolved.
\`\`\`

D5 is the new canonical version. Any node still holding D3 or D4 will discard them once it receives D5 through replication or background anti-entropy.

## Why Not Last-Writer-Wins?

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Last-Writer-Wins — Silent Data Loss", "code": "// Client 1 adds item3 at t=100ms\\n// Client 2 adds item4 at t=101ms (slightly faster clock)\\n\\n// LWW keeps only the higher timestamp:\\nwinning_version = item4   // item3 SILENTLY DISCARDED\\n\\n// The customer loses item3 from their cart.\\n// No error, no conflict surfaced — just gone.\\n// For Amazon: a lost item = lost revenue." }, "after": { "label": "Vector Clocks — Conflict Preserved", "code": "// D3: [(A,2),(B,1)]  <- has item3\\n// D4: [(A,2),(C,1)]  <- has item4\\n\\n// Neither clock dominates -> return BOTH as siblings\\nGET(cart) -> [D3, D4]\\n\\n// Application merges (set-union of items):\\nD5: [item1, item2, item3, item4]\\n//    clock=[(A,3),(B,1),(C,1)]\\n\\n// No write is ever silently discarded." } }
\`\`\`

LWW (using physical timestamps) is simpler, but it can silently drop valid writes under network clock skew. For high-value mutable state like a shopping cart, vector clocks are worth the additional complexity.

## The Context Parameter

The key to correct vector clock semantics is the **context** returned in every GET response. The context *is* the vector clock of the version(s) the client read.

When issuing a PUT, the client must pass this context back:

\`\`\`text
context = vector clock from last GET
PUT(key, new_value, context)
  --> Dynamo knows this write descends from the state in context
  --> Increments the coordinator node's counter
  --> Stores new value with updated vector clock
\`\`\`

Dynamo uses the context to identify which version the new write descends from, then increments the coordinator's counter on top of that base.

\`\`\`callout
{ "type": "warning", "title": "Always Read Before Writing", "content": "If a client writes WITHOUT a context (e.g., on a fresh connection with no prior GET), Dynamo treats it as a brand-new concurrent version. This creates an unnecessary sibling even when no real conflict exists. Clients must always fetch the current context before modifying an object." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Vector Clock Truncation", "content": "Vector clocks grow over time if many distinct nodes coordinate writes for the same key. Dynamo caps growth with a **timestamp-based truncation policy**:\\n\\n- Each \`(node, counter)\` entry also stores a wall-clock timestamp of when it was last updated.\\n- When the clock exceeds **10 entries**, the oldest entry (by timestamp) is removed.\\n- Removing an entry **discards causal ordering information**. Two versions that are actually causally ordered may subsequently appear concurrent — a *false conflict*.\\n\\nThe Dynamo paper reports that false conflicts from truncation are extremely rare in practice: most keys are written by the same 1–3 coordinator nodes, so clocks seldom approach the 10-entry limit. The cap is a safety bound against unbounded growth, not a constant source of false positives." }
\`\`\`

\`\`\`quiz
{ "title": "Vector Clocks Quiz", "questions": [ { "question": "Version X has clock [(A,2),(B,1)] and version Y has clock [(A,3),(B,2)]. What is their relationship?", "options": ["X and Y are concurrent siblings", "Y causally follows X — Y is the newer version", "X causally follows Y — X is the newer version", "They are identical; the differing clocks are a replication artifact"], "answer": 1, "explanation": "Every counter in X is ≤ the corresponding counter in Y (A: 2≤3, B: 1≤2). This means X is an ancestor of Y. Y causally follows X and the older version X can be safely discarded." }, { "question": "A client issues a PUT without first reading the key (no context is passed). How does Dynamo handle this?", "options": ["Dynamo rejects the write and returns a 4xx error", "Dynamo treats it as a new concurrent version, potentially creating a spurious sibling", "Dynamo automatically reads the latest version and merges the writes", "Dynamo routes the write to the primary replica only and skips vector clocking"], "answer": 1, "explanation": "Without a context, Dynamo has no causal base for the write. It treats the operation as a new concurrent version starting from scratch. This can produce unnecessary siblings even when no real conflict exists — which is why clients should always read before writing." }, { "question": "Why does Dynamo delegate conflict resolution to the application rather than resolving it automatically in the storage layer?", "options": ["Dynamo nodes lack the CPU capacity to merge complex objects", "The application has semantic knowledge the storage layer does not — the right merge strategy depends on the data type", "Automatic merging would violate Dynamo's quorum protocol", "Conflict resolution is always deferred asynchronously to the Merkle tree anti-entropy pass"], "answer": 1, "explanation": "The Dynamo paper explicitly states that the application has more semantic information. A shopping cart can be merged by set-union; a bank balance cannot. Dynamo surfaces siblings and lets the application apply the domain-appropriate strategy." }, { "question": "What problem can vector clock truncation (removing entries beyond 10) cause?", "options": ["New writes fail because there is no space in the clock for an additional entry", "Two causally ordered versions appear concurrent, triggering a false sibling resolution round", "The quorum size N is automatically lowered to compensate for reduced metadata", "Truncated entries are surfaced to the client as additional siblings in the GET response"], "answer": 1, "explanation": "Removing an old (node, counter) entry destroys the evidence that one version preceded another. Without that entry, Dynamo cannot confirm the causal ordering and may treat the two versions as concurrent siblings — even though one actually descended from the other." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A vector clock is a list of (node, counter) pairs. Version A is an ancestor of B when every counter in A is ≤ the corresponding counter in B; otherwise the versions are concurrent siblings.", "Dynamo never silently discards a concurrent write — it returns all siblings to the client and delegates the merge decision to the application.", "The right conflict resolution strategy is domain-specific: set-union for a shopping cart, last-write-wins for a cache, explicit reconciliation for financial data.", "Every PUT must include the context (vector clock) from the preceding GET; writes without context are treated as brand-new concurrent versions.", "LWW is simpler to implement but silently loses data under network clock skew — for high-value mutable state, vector clocks are the correct trade-off." ] }
\`\`\``,
    },
    {
      id: "dynamo-merkle-trees",
      slug: "dynamo-merkle-trees",
      title: "Merkle Trees for Anti-Entropy",
      content: `# Merkle Trees for Anti-Entropy

Even with read repair and hinted handoff, replicas can silently diverge — especially after a node recovers from failure or a network partition heals. Dynamo uses **Merkle trees** (hash trees) to efficiently detect and repair these inconsistencies without shipping the entire dataset across the wire.

\`\`\`concept
{ "title": "The Core Problem", "variant": "mental-model", "content": "Two nodes each hold 1,000,000 keys in the same range. Naively comparing them means transferring ~1TB of data to find perhaps 10 differences. Merkle trees reduce this to ~10KB of hash comparisons — a 100,000× improvement in synchronization cost." }
\`\`\`

## How Merkle Trees Work

A Merkle tree is a binary tree of hashes:

- **Leaf nodes** each cover a small key range, storing the hash of all values in that range
- **Internal nodes** store the hash of their two children combined
- **The root** is a single fingerprint representing the entire dataset

\`\`\`mermaid
graph TD
    R["Root Hash"]
    AB["Hash AB"]
    CD["Hash CD"]
    A["Hash A — keys 0–249"]
    B["Hash B — keys 250–499"]
    C["Hash C — keys 500–749"]
    D["Hash D — keys 750–999"]
    R --> AB
    R --> CD
    AB --> A
    AB --> B
    CD --> C
    CD --> D
\`\`\`

\`\`\`concept
{ "title": "Root Hash = Global Fingerprint", "variant": "rule", "content": "If two nodes' root hashes match, ALL data is identical — zero synchronization needed. If they differ, recursive comparison of children locates exactly which leaf ranges diverged, without examining any other data." }
\`\`\`

## The Anti-Entropy Protocol

Merkle tree synchronization is a **background process** — it never runs on the hot read/write path. Normal operations use vector clocks and quorum reads/writes. Merkle trees catch inconsistencies that slipped through those mechanisms, running periodically in the background.

\`\`\`steps
{ "title": "Anti-Entropy Synchronization Protocol", "steps": [ { "title": "Exchange Root Hashes", "content": "Node A sends its Merkle tree root hash to Node B for their shared key range.\\n\\n- Node A root: \`abc123\`\\n- Node B root: \`xyz789\`\\n\\nHashes differ → must recurse into children." }, { "title": "Compare Children — Skip Matching Subtrees", "content": "Both nodes compare left and right child hashes:\\n\\n- Left child: \`def456\` vs \`def456\` → **SAME** — skip the entire left subtree (keys 0–499 are confirmed in sync)\\n- Right child: \`ghi789\` vs \`jkl012\` → **DIFFERENT** — recurse into the right subtree" }, { "title": "Recurse Into the Differing Subtree", "content": "Inside the right subtree (keys 500–999):\\n\\n- Right.left: \`mno345\` vs \`mno345\` → **SAME** — skip keys 500–749\\n- Right.right: \`pqr678\` vs \`stu901\` → **DIFFERENT** — reached a leaf!" }, { "title": "Leaf Found — Exchange Only the Divergent Range", "content": "The differing leaf covers key range \`[750, 999]\`.\\n\\nNodes exchange only the actual keys and values for this range. They apply vector clock comparison to determine which version wins — or surface the conflict for client-side reconciliation on the next read." } ] }
\`\`\`

\`\`\`algoviz
{ "title": "Merkle Tree Traversal — Locating Divergent Keys", "type": "tree", "data": ["Root Hash", "Hash AB", "Hash CD", "Hash A", "Hash B", "Hash C", "Hash D"], "frames": [ { "highlight": [0], "label": "Compare root hashes — they differ. Must recurse into children.", "stats": { "level": 0, "comparisons": 1 } }, { "highlight": [1, 2], "label": "Left child (Hash AB) matches → skip all of keys 0–499. Right child (Hash CD) differs → recurse right.", "stats": { "level": 1, "comparisons": 3 } }, { "highlight": [5, 6], "label": "Left grandchild (Hash C) matches → skip keys 500–749. Right grandchild (Hash D) differs → this is a leaf!", "stats": { "level": 2, "comparisons": 5 } }, { "highlight": [6], "label": "Divergent leaf identified: key range [750–999]. Transfer only this range — synchronization complete.", "stats": { "level": 2, "comparisons": 5, "ranges_transferred": 1 } } ], "speed": 900 }
\`\`\`

## Efficiency at Scale

\`\`\`tabs
{ "tabs": [ { "label": "Best Case", "icon": "✅", "content": "**Trees are identical**\\n\\nBoth nodes exchange only their root hashes (32 bytes each).\\n\\nOne comparison → zero synchronization needed.\\n\\n**Cost: O(1) — 64 bytes total.**" }, { "label": "Typical Case", "icon": "⚡", "content": "**A few leaf ranges differ**\\n\\nFor L leaf nodes and D differing ranges, hash comparisons needed: **O(log L × D)**\\n\\nExample: L = 1,024 leaves, D = 10 differences → ~100 hash comparisons (~3.2 KB) instead of transferring the full dataset." }, { "label": "Worst Case", "icon": "⚠️", "content": "**All leaves differ**\\n\\nHashes exchanged: **O(L)** — the algorithm degrades to checking every leaf.\\n\\nThe Dynamo paper acknowledges that at large scale, background repair traffic can be significant. The anti-entropy process is not free, and repair costs must be budgeted for." } ] }
\`\`\`

## Dynamo's Specific Design

Each Dynamo node maintains **one Merkle tree per key range** (the set of keys covered by a virtual node) it hosts. When Node A and Node B want to check a shared key range, they exchange only the root of the Merkle tree corresponding to that specific range — not a global tree over all their data.

\`\`\`callout
{ "type": "warning", "title": "Node Joins and Leaves Invalidate Trees", "content": "When a node joins or leaves the ring, key range boundaries shift — potentially requiring many Merkle trees to be rebuilt simultaneously. The Dynamo paper explicitly flags this as a disadvantage of the scheme, and addresses it with a refined partitioning strategy (Section 6.2) that stabilizes virtual node boundaries during membership changes." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Update Cost and Periodic Rebuilding", "content": "When data changes, the Merkle tree must be updated:\\n\\n1. Recalculate the hash of the affected leaf node\\n2. Recalculate all ancestor hashes up to the root\\n3. Cost: **O(log L)** hash computations per update\\n\\nTo avoid paying this cost on every individual write, Dynamo **rebuilds Merkle trees periodically** rather than incrementally on each mutation. This means the in-memory tree can be slightly stale between rebuilds — but since anti-entropy is a background eventually-consistent process, a small staleness window is acceptable and does not affect the correctness of the hot path." }
\`\`\`

## Merkle Trees Beyond Dynamo

The same principle — hash-based fingerprinting with recursive subtree comparison — appears across distributed systems wherever efficient consistency verification is needed.

\`\`\`tabs
{ "tabs": [ { "label": "Git", "icon": "🐙", "content": "Git uses a Merkle DAG of SHA-1 hashes. A commit hash is the root of a tree covering the entire repository state at that point. \`git fetch\` determines which objects differ between local and remote by comparing tree hashes — the same binary-search skip logic Dynamo uses for key ranges." }, { "label": "Cassandra", "icon": "🗄️", "content": "Cassandra's \`nodetool repair\` implements anti-entropy using Merkle trees, directly inspired by Dynamo. Each repair session builds and compares trees for affected token ranges. Regular repair is required to maintain consistency after failures or decommissions." }, { "label": "Bitcoin", "icon": "₿", "content": "Bitcoin block headers contain a Merkle root of all transactions in the block. A lightweight SPV node can verify a single transaction is included in a block using a Merkle proof — O(log n) hashes — without downloading all transactions in the block." }, { "label": "IPFS", "icon": "🌐", "content": "IPFS uses a Merkle DAG for content-addressed storage. Every file chunk is identified by its hash; directories are Merkle nodes pointing to those chunks. Two IPFS nodes synchronizing a file tree skip identical subtrees entirely, using the same hash-equality shortcut." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Two Dynamo nodes compare their Merkle tree root hashes and find they are identical. What happens next?", "options": ["They exchange all leaf hashes to double-confirm", "They proceed to full data synchronization as a precaution", "No further data exchange is needed — the replicas are in sync", "They each rebuild their trees from scratch"], "answer": 2, "explanation": "A matching root hash guarantees all data is identical. This is the fundamental property of Merkle trees: hash comparison stops the moment subtree hashes match, with no further traversal or data transfer needed for that subtree." }, { "question": "In Dynamo, how many Merkle trees does each node maintain?", "options": ["One global tree covering all its data", "One tree per physical node in the cluster", "One tree per key range (virtual node) it is responsible for", "One tree per replication factor N"], "answer": 2, "explanation": "Per the Dynamo paper: each node maintains a separate Merkle tree for each key range (the set of keys covered by a virtual node) it hosts. This allows targeted per-range comparison with the relevant replica rather than a full-node comparison." }, { "question": "When does Merkle tree comparison occur in Dynamo's request lifecycle?", "options": ["On every read to verify replica freshness", "On every write to enforce quorum consistency", "Only during background anti-entropy repair — never on the hot read/write path", "During hinted handoff delivery to the original node"], "answer": 2, "explanation": "Merkle tree synchronization is strictly a background anti-entropy mechanism. Normal reads and writes use vector clocks and quorum protocols (R + W > N). Merkle trees catch inconsistencies that slipped through those mechanisms — they do not add latency to live requests." }, { "question": "A Merkle tree has L = 1024 leaf nodes. Two nodes differ in exactly 3 leaf ranges. Approximately how many hash comparisons does the anti-entropy protocol need?", "options": ["1024 — it must scan every leaf to be sure", "3 — it jumps directly to the 3 differing leaves", "About 30 — O(log L × D) = log₂(1024) × 3", "512 — it checks half the tree by default"], "answer": 2, "explanation": "The typical complexity is O(log L × D): the algorithm performs a binary search down to each of the D differing leaves. Here log₂(1024) = 10, and 10 × 3 = ~30 comparisons — far fewer than scanning all 1024 leaves or transferring the full dataset." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Merkle trees convert a full dataset into a single root hash fingerprint — matching roots mean zero synchronization needed, with O(1) cost", "The anti-entropy protocol binary-searches the tree, exchanging O(log L × D) hashes to locate D differing ranges among L leaf nodes", "Dynamo maintains one Merkle tree per key range (virtual node) per responsible node — targeted comparison, never a single global tree", "Merkle tree sync is a background-only process — it never runs on the hot read/write path, which uses vector clocks and quorums", "Node joins and leaves require tree rebuilding; Dynamo amortizes cost by rebuilding periodically rather than on every write", "Git, Cassandra, Bitcoin, and IPFS all apply the same principle: hash-based fingerprinting with recursive subtree skipping"] }
\`\`\``,
    },
    {
      id: "dynamo-architecture",
      slug: "dynamo-architecture-walkthrough",
      title: "Dynamo: Architecture Walkthrough",
      content: `# Dynamo: Architecture Walkthrough

Let's tie together all the components we've studied — consistent hashing, quorums, vector clocks, Merkle trees, and gossip — into a single coherent picture of how Dynamo handles every read and write.

\`\`\`concept
{ "title": "Dynamo as a Symphony of Trade-offs", "variant": "mental-model", "content": "No single technique in Dynamo is novel in isolation. The genius is in how each technique plugs a specific gap: consistent hashing solves placement, vector clocks solve versioning, sloppy quorums preserve availability during failures, and Merkle trees enable efficient repair. Remove any one technique and the system breaks down. Together they form a cohesive, battle-tested architecture." }
\`\`\`

## Complete Architecture

The diagram below shows the full request path — from a client PUT/GET, through the coordinator, down to the N replica nodes, and the background gossip layer that keeps every node aware of the others.

\`\`\`sysdiag
{ "title": "Dynamo Full Architecture", "width": 720, "height": 440, "nodes": [ { "id": "client", "label": "Client", "x": 360, "y": 30, "kind": "client" }, { "id": "lb", "label": "Load Balancer", "x": 360, "y": 115, "kind": "service" }, { "id": "coord", "label": "Coordinator Node\\n(any node)", "x": 360, "y": 215, "kind": "service" }, { "id": "nodeA", "label": "Node A\\n[KV][VC][MT][GS]", "x": 130, "y": 370, "kind": "database" }, { "id": "nodeB", "label": "Node B\\n[KV][VC][MT][GS]", "x": 360, "y": 370, "kind": "database" }, { "id": "nodeC", "label": "Node C\\n[KV][VC][MT][GS]", "x": 590, "y": 370, "kind": "database" } ], "edges": [ { "from": "client", "to": "lb", "label": "PUT / GET" }, { "from": "lb", "to": "coord", "label": "route" }, { "from": "coord", "to": "nodeA", "label": "replica 1" }, { "from": "coord", "to": "nodeB", "label": "replica 2" }, { "from": "coord", "to": "nodeC", "label": "replica 3" }, { "from": "nodeA", "to": "nodeB", "label": "gossip" }, { "from": "nodeB", "to": "nodeC", "label": "gossip" } ], "annotations": { "lb": "Routes request to any healthy Dynamo node — that node becomes coordinator for this request. Alternatively, a partition-aware client library routes directly to the right coordinator.", "coord": "Hashes key onto the consistent hash ring, builds preference list of N=3 physical nodes, fans out writes/reads in parallel, waits for W or R ACKs before responding.", "nodeA": "Each replica stores: local key-value data (BerkeleyDB), per-key vector clocks, Merkle trees per key range, and gossip membership state. Any node can hold any key." } }
\`\`\`

## Write Path (PUT)

\`\`\`steps
{ "title": "Handling a PUT request end-to-end", "steps": [ { "title": "Client sends to any node", "content": "The client sends \`PUT(key, value, context)\` either through a generic load balancer or a partition-aware client library. The receiving node becomes the **coordinator** for this request — there is no dedicated master." }, { "title": "Hash key → ring position → preference list", "content": "The coordinator applies a consistent hash to find the key's position on the ring, then walks clockwise to build the **preference list** of N=3 distinct physical nodes, skipping virtual nodes on the same physical host. Example: \`[Node A, Node C, Node B]\`." }, { "title": "Fan out to all N replicas in parallel", "content": "The coordinator sends the write to **all N nodes simultaneously**. Each replica independently:\\n- Increments the coordinator's counter in the vector clock (e.g., \`[(coord, 1)]\`)\\n- Persists \`(value, vector_clock)\` to its local store (BerkeleyDB Transactional Data Store)\\n- Returns an ACK to the coordinator" }, { "title": "Wait for W=2 ACKs — sloppy quorum", "content": "The coordinator waits for **W=2** successful ACKs. If a preferred node is down, the write is redirected to the **next healthy node** in the ring with a **hint** recording the intended destination. This is **hinted handoff** — the hint node forwards the buffered write when the intended node recovers." }, { "title": "Return SUCCESS", "content": "Once W ACKs arrive the coordinator returns \`SUCCESS\` to the client. The third replica may still be in-flight — Dynamo deliberately does not wait. This is the core availability trade-off: every write succeeds as long as W healthy nodes exist anywhere in the cluster." } ] }
\`\`\`

## Read Path (GET)

\`\`\`steps
{ "title": "Handling a GET request end-to-end", "steps": [ { "title": "Fan out to all N replicas", "content": "The coordinator hashes the key, builds the preference list, and sends read requests to **all N=3 nodes in parallel** — not just a subset. Sending to all increases the chance of reaching R responses quickly." }, { "title": "Wait for R=2 responses", "content": "The coordinator waits for **R=2** responses. Latency is dictated by the **slowest** of the R replicas, which is why R and W are typically set below N (e.g., N=3, R=2, W=2) to avoid tail latency from the slowest node." }, { "title": "Compare vector clocks", "content": "The coordinator inspects the returned vector clocks:\\n- **One version dominates** (all its counters ≤ the other's): return the newer version\\n- **Concurrent versions** (neither's counters are all ≤ the other's): return **all siblings** plus the merged context — the application must reconcile" }, { "title": "Read repair in background", "content": "If any replica returned a stale version, the coordinator **pushes the latest version back** to that replica asynchronously. Read repair gradually heals divergence without requiring a dedicated reconciliation process." }, { "title": "Client resolves conflicts if siblings returned", "content": "The client merges concurrent versions (e.g., union of shopping cart items) and writes back using the **merged vector clock context**. Including that context tells Dynamo this write has seen all concurrent versions, collapsing the branches into one." } ] }
\`\`\`

## Failure Handling

\`\`\`tabs
{ "tabs": [ { "label": "Temporary Node Down", "icon": "⚡", "content": "**Detection:** Gossip heartbeat timeout — peers notice the node has stopped sending heartbeats.\\n\\n**Recovery:** Sloppy quorum + **hinted handoff**. The write goes to the next healthy node (e.g., Node D) with metadata hinting the intended destination (Node B). Node D stores it and forwards it automatically when Node B rejoins.\\n\\n**Client impact:** Transparent — SUCCESS is still returned after W ACKs from healthy nodes." }, { "label": "Network Partition", "icon": "🌐", "content": "**Detection:** Gossip detects that a subset of nodes can no longer reach another subset.\\n\\n**Recovery:** Both sides continue accepting writes independently — sloppy quorum ensures availability on each side. After the partition heals, **vector clocks** identify divergent versions and trigger conflict resolution via the read path.\\n\\n**Client impact:** Possible sibling versions returned during and shortly after the partition. Application must merge them." }, { "label": "Permanent Node Failure", "icon": "💀", "content": "**Detection:** Extended gossip absence. An operator issues an admin command to formally remove the node from the ring.\\n\\n**Recovery:** A replacement node joins the ring at the same position. **Merkle tree anti-entropy** identifies exactly which key ranges the new node is missing and synchronizes only those ranges from other replicas — not the full dataset.\\n\\n**Client impact:** None after the replacement node is fully synced." }, { "label": "Disk Failure", "icon": "💾", "content": "**Detection:** Local health check on the node itself flags the storage engine as unavailable.\\n\\n**Recovery:** The node is treated as permanently failed. Because Dynamo maintains N=3 replicas — and reads/writes already achieved quorum across the other replicas — the data is intact. The node is replaced and rebuilt via the same Merkle tree sync process used for permanent failure." } ] }
\`\`\`

## Summary of Techniques

| Problem | Dynamo's Solution | Key Advantage |
|---------|------------------|---------------|
| Partitioning | Consistent hashing + vnodes | Incremental scalability |
| Replication | N replicas on preference list | Fault tolerance |
| Write availability | Sloppy quorum + hinted handoff | Always-writable guarantee |
| Conflict detection | Vector clocks | Version size decoupled from write rate |
| Conflict resolution | Application-level (client merge) | Semantic correctness |
| Read consistency | Quorum (R + W > N) | Reads always overlap at least one write |
| Anti-entropy | Merkle trees | Efficient background repair |
| Membership / failure | Gossip protocol | No centralized registry |

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Consistent hashing with vnodes achieves incremental scalability — adding a node only steals a fraction of load from existing nodes, with no global reshuffling.", "Vector clocks decouple version size from write rate — clocks grow with the number of distinct coordinators, not with write frequency.", "Sloppy quorum + hinted handoff ensures every write succeeds as long as W healthy nodes exist anywhere in the cluster, not just on the preference list.", "Merkle trees make anti-entropy bandwidth-efficient — nodes compare root hashes top-down, recursing only into subtrees that differ, transferring only divergent key ranges.", "R + W > N guarantees quorum overlap: any read set and write set share at least one node, so reads always see at least one current write.", "The 'always writable' guarantee comes from pushing conflict resolution to the application — a deliberate trade of system complexity for business availability." ] }
\`\`\`

## Dynamo's Legacy

Published at SOSP 2007, the Dynamo paper inspired an entire generation of distributed databases:

| System | Origin | Dynamo Concepts Adopted | Key Extension |
|--------|--------|------------------------|---------------|
| **DynamoDB** | Amazon | All | Managed service; optional strong consistency |
| **Cassandra** | Facebook / Apache | Consistent hashing, gossip, hinted handoff, Merkle repair | Bigtable-style column families |
| **Riak** | Basho | Full paper implementation | CRDTs for automatic conflict resolution |
| **Voldemort** | LinkedIn | Consistent hashing, vector clocks | Simpler, narrower scope |
| **Redis Cluster** | Redis | Consistent hashing | Much simpler conflict model; optimized for caching |

\`\`\`collapse
{ "title": "Deep Dive: Known Limitations of Dynamo's Design", "content": "**Vector clock growth:** In high-churn environments with many distinct coordinator nodes, vector clocks can grow large enough to require truncation — at which point causality information is lost. Dynamo applies heuristic truncation but cannot fully prevent it.\\n\\n**Anti-entropy cost at scale:** Merkle tree reconciliation is not free. After a major partition event that diverged many key ranges, background repair traffic can become significant.\\n\\n**Application-level conflict resolution is burdensome:** Pushing merges to the application is powerful but requires that every application implement a correct, idempotent merge function. 'Last write wins' is simple but silently drops data. Not every team gets this right.\\n\\n**Sloppy quorum is not a strict quorum:** Hinted handoff nodes are outside the preference list. Until the hint is delivered, a read set and write set may not share a node — meaning a read can return stale data even when R + W > N. Strict quorum semantics are not guaranteed during the handoff window." }
\`\`\`

\`\`\`quiz
{ "title": "Architecture Walkthrough — Check Your Understanding", "questions": [ { "question": "Node B (a preferred replica) is temporarily unreachable during a PUT. With N=3, W=2, what does Dynamo do?", "options": [ "Fail the write immediately and return an error to the client", "Wait indefinitely until Node B recovers", "Send the write to the next healthy node with a hint, return SUCCESS after W=2 ACKs", "Reduce W to 1 so the write can complete with fewer replicas" ], "answer": 2, "explanation": "Dynamo uses sloppy quorum: it redirects the write to the next healthy node outside the preference list and attaches metadata hinting the intended destination. Once W=2 ACKs arrive from healthy replicas, SUCCESS is returned. The hinted node forwards the write to Node B when it recovers." }, { "question": "A GET returns two versions with vector clocks [(Sx,1),(Sy,2)] and [(Sx,1),(Sy,1),(Sz,1)]. What is the correct interpretation?", "options": [ "The second version is newer because it has more entries", "The first version is newer because Sy's counter (2) is higher", "The versions are concurrent — neither dominates the other", "They are identical; the extra Sz entry in the second clock is noise" ], "answer": 2, "explanation": "For one clock to dominate, every counter in it must be less than or equal to the corresponding counter in the other. The first clock has Sy=2 which exceeds Sy=1 in the second — but the second has Sz=1 which is absent from the first (implicitly 0). Neither dominates. They are concurrent and Dynamo returns both as siblings for application-level reconciliation." }, { "question": "After a network partition heals, how does Dynamo efficiently synchronize diverged replicas without comparing every key individually?", "options": [ "It replays the write-ahead log from the time the partition began", "It compares Merkle tree hashes top-down, recursing only into subtrees whose root hashes differ", "It sends the full dataset from the most up-to-date replica to the stale one", "It relies on gossip messages to broadcast every missed write" ], "answer": 1, "explanation": "Merkle trees allow Dynamo to locate divergence in O(log n) comparisons. Nodes compare root hashes first — if they match, the entire subtree is identical and can be skipped. Only when hashes differ do they recurse into child subtrees, eventually isolating the exact key ranges that diverged. Only those ranges are transferred, minimizing repair bandwidth." }, { "question": "Why is Dynamo's quorum called 'sloppy' rather than a strict quorum?", "options": [ "Because R and W are configured to values less than N/2 + 1", "Because writes can go to nodes outside the preference list during failures, so the read/write sets may not overlap until hinted handoff completes", "Because Dynamo only requires a majority for reads, not for writes", "Because the coordinator does not verify ACKs cryptographically before returning SUCCESS" ], "answer": 1, "explanation": "In a strict quorum, reads and writes must always use the same fixed preference list, guaranteeing overlap. Dynamo's sloppy quorum allows writes to go to arbitrary healthy nodes when preferred nodes are down. This improves write availability but means the read set and write set may not share a node until the hinted handoff is delivered — a critical distinction." } ] }
\`\`\``,
    },
  ],
};
