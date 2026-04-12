import { Module } from "../types";

export const distributedCacheModule: Module = {
  id: "design-cache",
  title: "Designing a Distributed Cache",
  description: "Design a distributed caching system: cache strategies, consistent hashing for sharding, invalidation patterns, hot key solutions, and complete architecture walkthrough.",
  lessons: [
    {
      id: "cache-requirements",
      slug: "cache-requirements",
      title: "Distributed Cache: Requirements & Motivation",
      content: `# Distributed Cache: Requirements & Motivation

A distributed cache sits between your application and your database, pooling RAM across multiple servers into a single, lightning-fast in-memory store. Systems like Redis Cluster and Memcached power the caching layers of nearly every large-scale web application, handling millions of reads per second with sub-millisecond latency.

## The Problem: Database Bottlenecks at Scale

\`\`\`concept
{
  "title": "The Scale Gap",
  "variant": "insight",
  "content": "A single database can handle thousands of queries per second. But at web scale, you need millions of reads per second with sub-millisecond latency. This 1000x performance gap is why distributed caches exist."
}
\`\`\`

Traditional databases are optimized for durability and complex queries, not raw speed. Even with SSDs and optimized queries, database reads typically take 1-10ms. When you're serving millions of users, this latency compounds into a massive bottleneck.

\`\`\`algoviz
{
  "title": "Request Flow: With vs Without Cache",
  "type": "array",
  "data": ["Request 1", "Request 2", "Request 3", "Request 4", "Request 5", "Request 6", "Request 7", "Request 8", "Request 9", "Request 10"],
  "frames": [
    { "highlight": [0,1,2,3,4,5,6,7,8,9], "label": "Without Cache: All 10 requests hit database (5ms each)", "stats": {"db_load": "100%", "avg_latency": "5ms"} },
    { "highlight": [0,1,2,3,4,5,6,7,8], "label": "With 90% hit rate: 9 requests served from cache (<1ms)", "stats": {"cache_hits": 9, "db_load": "10%", "avg_latency": "0.9ms"} },
    { "highlight": [9], "label": "Only 1 request hits database (5ms) on cache miss", "stats": {"cache_misses": 1, "db_load_reduction": "90%"} }
  ],
  "speed": 1000
}
\`\`\`

## Functional Requirements: What Must It Do?

Every distributed cache must provide these core operations:

1. **Get(key)** - Retrieve cached value or detect cache miss
2. **Set(key, value, TTL)** - Store with optional time-to-live
3. **Delete(key)** - Explicit invalidation
4. **Multi-key operations** - Batch get/set for efficiency
5. **Atomic operations** - Increment, compare-and-swap, etc.

\`\`\`quiz
{
  "title": "Cache Operations Quiz",
  "questions": [
    {
      "question": "Which operation is typically the fastest in a distributed cache?",
      "options": ["Set with TTL", "Get (cache hit)", "Delete", "Get (cache miss)"],
      "answer": 1,
      "explanation": "Cache hits serve data directly from memory without network round-trips to the database, typically completing in 0.1-0.5ms."
    },
    {
      "question": "Why include TTL in Set operations rather than using permanent storage?",
      "options": ["To save memory", "To ensure data freshness", "To reduce cache size", "All of the above"],
      "answer": 3,
      "explanation": "TTL serves multiple purposes: memory management by evicting unused data, ensuring data freshness, and preventing unbounded cache growth."
    },
    {
      "question": "What's the primary advantage of atomic operations like increment?",
      "options": ["Faster execution", "Better memory usage", "Race condition prevention", "Simpler code"],
      "answer": 2,
      "explanation": "Atomic operations prevent race conditions when multiple clients update the same key simultaneously, ensuring data consistency."
    }
  ]
}
\`\`\`

## Non-Functional Requirements: The Performance Targets

| Requirement | Target | Why It Matters |
|-------------|--------|----------------|
| **Read latency** | < 1ms at p99 | User experience degrades sharply beyond 1s total page load |
| **Write latency** | < 1ms at p99 | Write-through caches can't slow down the application |
| **Throughput** | 100K+ ops/sec per node | Supports 100K concurrent users with 1 op/sec each |
| **Availability** | 99.99% | < 1 hour downtime per year for mission-critical apps |
| **Scalability** | Linear with node count | Double servers = double capacity |
| **Data size** | Hot dataset in cluster RAM | Disk access defeats the purpose |

## Cache vs Database: The Performance Gap

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Database (PostgreSQL)",
    "code": "Storage: Disk (SSD)\\nRead latency: 1-10ms\\nWrite latency: 2-20ms\\nThroughput: 10K ops/sec\\nDurability: Full ACID\\nData size: Limited by disk\\nQuery support: Full SQL"
  },
  "after": {
    "label": "Cache (Redis Cluster)",
    "code": "Storage: RAM\\nRead latency: 0.1-0.5ms\\nWrite latency: 0.1-0.5ms\\nThroughput: 100K+ ops/sec\\nDurability: Optional (AOF)\\nData size: Limited by RAM\\nQuery support: Key-value + structures"
  }
}
\`\`\`

The 100x latency improvement and 10x throughput gain explain why caches are essential for scale. However, this speed comes with trade-offs: RAM costs ~100x more than disk, and caches prioritize speed over durability.

## Architecture: Where Caches Fit

\`\`\`sysdiag
{
  "title": "Typical Web Architecture with Cache",
  "width": 600,
  "height": 400,
  "nodes": [
    { "id": "clients", "label": "Clients", "x": 100, "y": 50, "kind": "user" },
    { "id": "lb", "label": "Load Balancer", "x": 100, "y": 120, "kind": "gateway" },
    { "id": "app1", "label": "App Server 1", "x": 50, "y": 200, "kind": "service" },
    { "id": "app2", "label": "App Server 2", "x": 150, "y": 200, "kind": "service" },
    { "id": "cache", "label": "Redis Cluster", "x": 100, "y": 280, "kind": "store" },
    { "id": "db", "label": "Database", "x": 100, "y": 360, "kind": "database" },
    { "id": "cdn", "label": "CDN", "x": 250, "y": 200, "kind": "cdn" }
  ],
  "edges": [
    { "from": "clients", "to": "lb", "label": "HTTP" },
    { "from": "lb", "to": "app1", "label": "route" },
    { "from": "lb", "to": "app2", "label": "route" },
    { "from": "app1", "to": "cache", "label": "check first" },
    { "from": "app2", "to": "cache", "label": "check first" },
    { "from": "cache", "to": "db", "label": "miss" },
    { "from": "app1", "to": "db", "label": "fallback" },
    { "from": "app2", "to": "db", "label": "fallback" },
    { "from": "lb", "to": "cdn", "label": "static" }
  ],
  "annotations": {
    "cache": "Distributed cache sits between app and database, serving hot data in <1ms",
    "db": "Database only handles cache misses and writes, reducing load by 90%+"
  }
}
\`\`\`

The golden rule: **Check cache first, database second**. This simple pattern reduces database load by 90% and cuts average latency by 80%.

## Cache Deployment Patterns

| Pattern | Latency | Hit Rate | Complexity | Use Case |
|---------|---------|----------|------------|----------|
| **Client-side** | ~0ms | Per-instance | Low | User session data |
| **Sidecar** | <1ms | Per-server | Medium | Microservices |
| **Remote cluster** | 1-5ms | Global | High | Shared data |
| **Multi-tier (L1+L2)** | <1ms | Hybrid | Highest | Maximum performance |

\`\`\`callout
{
  "type": "warning",
  "title": "Network Latency Trade-off",
  "content": "Remote clusters add 1-5ms network latency but provide global cache hits and independent scaling. Choose based on your consistency and performance requirements."
}
\`\`\`

## Key Takeaways

\`\`\`takeaways
{
  "title": "Why Distributed Caches Matter",
  "items": [
    "Performance multiplier: 100x faster than database reads (0.1ms vs 10ms)",
    "Load reducer: Cuts database traffic by 90%, extending database lifespan",
    "Scale enabler: Linear scaling by adding cache nodes without touching the database",
    "Cost optimizer: RAM is expensive but cheaper than scaling database servers",
    "Complexity trade-off: Speed comes with consistency challenges we'll solve next"
  ]
}
\`\`\`

The distributed cache is your first line of defense against database overload. But simply adding a cache isn't enough — the real challenges lie in **sharding data across nodes**, **handling node failures**, **maintaining consistency**, and **managing hot keys**. These distributed systems problems transform caching from a simple optimization into a rich architectural challenge.`,
    },
    {
      id: "cache-strategies",
      slug: "cache-strategies",
      title: "Cache Strategies: Write-Through, Write-Behind & Write-Around",
      content: `# Cache Strategies

How your cache interacts with the database determines consistency, latency, and failure behavior. There are several standard strategies, each with distinct trade-offs.

## Cache-Aside (Lazy Loading)

The most common strategy. The application manages both the cache and database explicitly.

\`\`\`
Cache-Aside Read Flow
=====================

1. App receives request for key K
2. App checks cache: GET(K)
   |
   +-- Cache HIT --> return cached value
   |
   +-- Cache MISS:
       a. App reads from database: SELECT * WHERE id=K
       b. App writes to cache: SET(K, value, TTL=300s)
       c. Return value to caller

Cache-Aside Write Flow
======================

1. App writes to database: UPDATE ... WHERE id=K
2. App INVALIDATES cache: DELETE(K)
   (next read will cache the new value)
\`\`\`

**Pros:** Only caches data that is actually requested. Cache failure does not block operations (just slower).
**Cons:** First request after a miss is slow (cold start). Possible stale reads if database is updated between cache read and write.

## Read-Through

The cache itself handles database reads on a miss. The application only talks to the cache.

\`\`\`
Read-Through Flow
=================

App --> Cache: GET(K)
  |
  +-- Cache HIT --> return value
  |
  +-- Cache MISS:
      Cache --> Database: SELECT * WHERE id=K
      Cache stores value
      Cache --> App: return value

App never directly queries the database for reads.
\`\`\`

**Pros:** Simplifies application code. Cache handles all read logic.
**Cons:** Cache must know how to query the database. First miss still slow.

## Write-Through

Every write goes through the cache to the database synchronously.

\`\`\`
Write-Through Flow
==================

App --> Cache: SET(K, new_value)
  |
  Cache --> Database: UPDATE ... WHERE id=K
  |
  Cache stores new_value locally
  |
  Cache --> App: success (after DB write completes)

Data in cache is ALWAYS consistent with database.
\`\`\`

**Pros:** Cache is always up-to-date. Read-after-write consistency guaranteed.
**Cons:** Write latency includes database write (slower writes). Caches data that may never be read (write-heavy workloads waste memory).

## Write-Behind (Write-Back)

Writes go to the cache immediately. The cache asynchronously flushes to the database in batches.

\`\`\`
Write-Behind Flow
=================

App --> Cache: SET(K, new_value)
  |
  Cache stores new_value, returns SUCCESS immediately
  |
  (asynchronously, in background)
  Cache --> Database: batch write [K1, K2, K3, ...]

Write latency = cache write only (~0.5ms)
\`\`\`

**Pros:** Extremely fast writes. Batch writes reduce database load. Absorbs write spikes.
**Cons:** **Data loss risk** -- if cache node crashes before flushing, unflushed writes are lost. Complex to implement correctly.

## Write-Around

Writes go directly to the database, bypassing the cache entirely.

\`\`\`
Write-Around Flow
=================

App --> Database: INSERT/UPDATE
  (cache is not updated)

On next read:
  Cache MISS --> read from DB --> populate cache

Use case: write-heavy data that is rarely read immediately.
\`\`\`

**Pros:** Cache is not polluted with data that may not be read. Good for write-heavy workloads.
**Cons:** Read-after-write will always miss the cache (higher latency for recently written data).

## Strategy Comparison

\`\`\`
+----------------+----------+----------+----------+----------+
| Strategy       | Read     | Write    | Data     | Use Case |
|                | Latency  | Latency  | Loss Risk|          |
+----------------+----------+----------+----------+----------+
| Cache-Aside    | Miss:slow| DB write | None     | General  |
|                | Hit:fast |          |          | purpose  |
+----------------+----------+----------+----------+----------+
| Read-Through   | Miss:slow| N/A      | None     | Read-    |
|                | Hit:fast |          |          | heavy    |
+----------------+----------+----------+----------+----------+
| Write-Through  | Hit:fast | Slow     | None     | Read-    |
|                |          | (sync DB)|          | after-   |
|                |          |          |          | write    |
+----------------+----------+----------+----------+----------+
| Write-Behind   | Hit:fast | Fast     | YES      | Write-   |
|                |          | (async)  | (crash)  | heavy    |
+----------------+----------+----------+----------+----------+
| Write-Around   | Miss:slow| DB only  | None     | Write-   |
|                | Hit:fast |          |          | heavy,   |
|                |          |          |          | rare read|
+----------------+----------+----------+----------+----------+
\`\`\`

## Combining Strategies

Most production systems combine strategies:

\`\`\`
Recommended: Cache-Aside + Write-Around
========================================

Reads:  Cache-Aside (lazy loading on miss)
Writes: Write to DB directly, invalidate cache

This is what most web apps use (e.g., with Redis + PostgreSQL).
Simple, safe, and effective.


Advanced: Read-Through + Write-Behind
======================================

Reads:  Read-Through (cache handles DB reads)
Writes: Write-Behind (cache absorbs writes, flushes async)

Higher performance but more complex and riskier.
Used in high-throughput systems where some data loss is tolerable.
\`\`\`

## Key Takeaway

Cache-aside with write-around (invalidate on write) is the safest and most common strategy. Write-through provides strong read-after-write consistency at the cost of write latency. Write-behind gives the best write performance but risks data loss. Choose based on your workload's read/write ratio and tolerance for inconsistency.`,
    },
    {
      id: "cache-consistent-hashing",
      slug: "cache-consistent-hashing",
      title: "Consistent Hashing for Cache Sharding",
      content: `# Consistent Hashing for Cache Sharding

A single cache node cannot hold all your data. Distributing keys across multiple cache nodes requires a sharding strategy that minimizes disruption when nodes are added or removed.

## The Problem

\`\`\`concept
{
  "title": "Naive Sharding with Modulo",
  "variant": "rule",
  "content": "hash(key) % N works fine until N changes. When you add or remove a node, nearly every key gets remapped, causing a cache stampede where your database gets flooded with queries for data that should have been cached."
}
\`\`\`

Traditional modulo-based sharding creates massive disruption during scaling events:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Before: 3 nodes",
    "code": "hash(\\"user:100\\") % 3 = 1  → Node 1\\nhash(\\"user:200\\") % 3 = 0  → Node 0\\nhash(\\"user:300\\") % 3 = 2  → Node 2"
  },
  "after": {
    "label": "After: 4 nodes (add one)",
    "code": "hash(\\"user:100\\") % 4 = 0  → Node 0  (MOVED!)\\nhash(\\"user:200\\") % 4 = 0  → Node 0  (same)\\nhash(\\"user:300\\") % 4 = 1  → Node 1  (MOVED!)\\n\\nResult: ~75% of keys move to different nodes"
  }
}
\`\`\`

This is called a **cache stampede** or **thundering herd**: adding or removing a node invalidates most of the cache, causing a flood of database queries.

## Consistent Hashing Solution

\`\`\`concept
{
  "title": "The Hash Ring",
  "variant": "mental-model",
  "content": "Imagine a clock face numbered 0 to 2^32-1. Both your cache nodes and data keys get placed on this circle. To find which node stores a key, start at the key's position and walk clockwise until you hit a node. This simple rule ensures that when you add or remove nodes, only the keys between neighbors are affected."
}
\`\`\`

\`\`\`algoviz
{
  "title": "Consistent Hashing Ring",
  "type": "array",
  "data": [0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000],
  "frames": [
    {"highlight": [2], "label": "Node B at position 250", "stats": {"node": "B"}},
    {"highlight": [4], "label": "Node C at position 500", "stats": {"node": "C"}},
    {"highlight": [6], "label": "Node D at position 750", "stats": {"node": "D"}},
    {"highlight": [8], "label": "Node A at position 1000", "stats": {"node": "A"}},
    {"highlight": [1], "label": "Key 1 (hash 150) → Node B", "stats": {"key": "user:100", "hash": 150}},
    {"highlight": [3], "label": "Key 2 (hash 400) → Node C", "stats": {"key": "user:200", "hash": 400}},
    {"highlight": [5], "label": "Key 3 (hash 600) → Node D", "stats": {"key": "user:300", "hash": 600}},
    {"highlight": [7], "label": "Key 4 (hash 900) → Node A", "stats": {"key": "user:400", "hash": 900}}
  ],
  "speed": 1000
}
\`\`\`

When you add Node E at position 350, only keys between 250 and 350 (just key_2 in this case) might move. Instead of 75% of keys moving, you affect roughly **1/N** of your keys.

## Virtual Nodes for Even Distribution

With few physical nodes, the ring can be unbalanced. Virtual nodes spread each physical node across many ring positions:

\`\`\`concept
{
  "title": "Virtual Nodes Explained",
  "variant": "analogy",
  "content": "Think of virtual nodes like having multiple mailboxes for one house. Instead of one mailbox at a single address, you have 150 mailboxes scattered around the neighborhood. This ensures mail (data) gets distributed more evenly, and if one mailbox breaks, the others keep working."
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Virtual Node Distribution",
  "width": 600,
  "height": 300,
  "nodes": [
    {"id": "cache1", "label": "cache-1\\n(150 vnodes)", "x": 150, "y": 150, "kind": "service"},
    {"id": "cache2", "label": "cache-2\\n(150 vnodes)", "x": 300, "y": 150, "kind": "service"},
    {"id": "cache3", "label": "cache-3\\n(150 vnodes)", "x": 450, "y": 150, "kind": "service"}
  ],
  "edges": [
    {"from": "cache1", "to": "cache2", "label": "vnodes distributed\\nacross ring"},
    {"from": "cache2", "to": "cache3", "label": "each owns ~25%\\nof keyspace"}
  ],
  "annotations": {
    "cache1": "Physical node mapped to 150 virtual positions on hash ring",
    "cache2": "Even distribution prevents hotspots and load imbalance",
    "cache3": "Total: 600 ring points for 4 nodes × 150 vnodes each"
  }
}
\`\`\`

## Implementation Patterns

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Client-Side (Memcached)",
      "icon": "👥",
      "content": "**Client has the hash ring logic:**\\n\\n\`\`\`python\\nclient = CacheClient(nodes=[\\"cache-1:6379\\", \\"cache-2:6379\\", \\"cache-3:6379\\"])\\n\\n# SET operation\\nclient.set(\\"user:100\\", data)\\n1. hash(\\"user:100\\") → find node on ring\\n2. Send SET to that specific node\\n\\n# GET operation  \\nclient.get(\\"user:100\\")\\n1. hash(\\"user:100\\") → same node as set\\n2. Send GET to that specific node\\n\`\`\`\\n\\n**Pros:** Simple cluster, no coordination overhead\\n**Cons:** Client complexity, consistent client view required"
    },
    {
      "label": "Cluster-Side (Redis)",
      "icon": "🏗️",
      "content": "**Cluster manages 16384 hash slots:**\\n\\n\`\`\`\\nslot = CRC16(key) % 16384\\n\\nNode A: slots 0-5460\\nNode B: slots 5461-10922  \\nNode C: slots 10923-16383\\n\\nClient sends GET to any node\\nIf node owns the slot: return value\\nIf not: MOVED redirect to correct node\\nClient caches slot-node mapping\\n\`\`\`\\n\\n**Pros:** Client can be simple, automatic failover\\n**Cons:** Cluster coordination overhead"
    }
  ]
}
\`\`\`

## Handling Node Failures

\`\`\`steps
{
  "title": "Node Failure Recovery Process",
  "steps": [
    {
      "title": "1. Health Check Detection",
      "content": "Monitoring system detects Node B is unresponsive through heartbeat failures or connection timeouts."
    },
    {
      "title": "2. Immediate Impact Assessment", 
      "content": "Consistent hashing identifies which keys are affected - only those mapped to Node B and its virtual nodes. Other nodes continue serving normally."
    },
    {
      "title": "3. Recovery Strategy Selection",
      "content": "**Option A:** Rehash to remaining nodes (cache misses expected)\\n**Option B:** Promote replica node (no cache misses)\\n**Option C:** Temporary redirect to neighbor nodes"
    },
    {
      "title": "4. Data Restoration",
      "content": "If using replicas: promote B' to primary. If rehashing: affected keys will be cache misses until repopulated from database."
    }
  ]
}
\`\`\`

## Redis Cluster Slot Migration

When adding a node to Redis Cluster, the system performs careful slot-by-slot migration:

\`\`\`trace
{
  "title": "Redis Slot Migration",
  "language": "python",
  "code": "# Initial state: 3 nodes, 5461 slots each\\n# Adding Node D - target: 4096 slots each\\n\\n# Step 1: Calculate redistribution\\nnode_a_slots = list(range(0, 5462))  # 5461 slots\\nnode_b_slots = list(range(5461, 10923))  # 5462 slots  \\nnode_c_slots = list(range(10923, 16384))  # 5461 slots\\n\\n# New distribution after migration\\nnew_a = node_a_slots[:4096]  # slots 0-4095\\nnew_b = node_b_slots[:4096]  # slots 5461-9556  \\nnew_c = node_c_slots[:4096]  # slots 10923-15018\\nnew_d = (node_a_slots[4096:] + \\n         node_b_slots[4096:] + \\n         node_c_slots[4096:])  # remaining slots",
  "frames": [
    {"line": 4, "vars": {"node_a_slots": 5461, "node_b_slots": 5462, "node_c_slots": 5461}, "note": "Initial balanced distribution"},
    {"line": 9, "vars": {"new_a": 4096, "new_b": 4096, "new_c": 4096, "new_d": 4096}, "note": "After migration: 4096 slots each"},
    {"line": 10, "stdout": "Migration happens slot-by-slot with MOVED/ASK redirects"}
  ],
  "speed": 1200
}
\`\`\`

## Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Consistent hashing reduces cache disruption from ~75% to ~1/N keys when scaling nodes",
    "Virtual nodes ensure even distribution and prevent hotspots across physical servers",
    "Redis Cluster uses 16384 fixed slots while Memcached uses client-side consistent hashing",
    "Node failures only affect the failed node's keys, not the entire cache cluster",
    "Slot migration in Redis happens incrementally to minimize client impact"
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Consistent Hashing Knowledge Check",
  "questions": [
    {
      "question": "With consistent hashing, what percentage of keys typically move when adding one node to a 4-node cluster?",
      "options": ["~25%", "~50%", "~75%", "~5%"],
      "answer": 0,
      "explanation": "Consistent hashing affects approximately 1/N keys, so with 4 nodes, about 25% of keys might move when adding a fifth node."
    },
    {
      "question": "Why are virtual nodes used in consistent hashing?",
      "options": ["To reduce memory usage", "To improve load balancing", "To increase hash collisions", "To simplify client code"],
      "answer": 1,
      "explanation": "Virtual nodes distribute each physical server across multiple ring positions, ensuring more even key distribution and better load balancing."
    },
    {
      "question": "In Redis Cluster, how many hash slots are used for key distribution?",
      "options": ["1024", "4096", "16384", "65536"],
      "answer": 2,
      "explanation": "Redis Cluster uses 16384 hash slots (0-16383) to distribute keys across nodes, providing a fixed partitioning scheme."
    }
  ]
}
\`\`\``,
      starterCode: `# Distributed Cache Client with Consistent Hashing
# Implement a cache client that distributes keys across multiple nodes.

import hashlib

class CacheNode:
    """Simulates a single cache node (in-memory store)."""
    def __init__(self, name: str):
        self.name = name
        self.store = {}

    def get(self, key: str):
        return self.store.get(key)

    def set(self, key: str, value, ttl: int = 0):
        self.store[key] = value

    def delete(self, key: str):
        self.store.pop(key, None)

    def size(self):
        return len(self.store)


class DistributedCache:
    def __init__(self, nodes: list, vnodes_per_node: int = 150):
        self.ring = {}           # hash_position -> CacheNode
        self.sorted_positions = []
        self.nodes = {}          # node_name -> CacheNode
        self.vnodes_per_node = vnodes_per_node

        for node_name in nodes:
            self.add_node(node_name)

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node_name: str):
        """Add a cache node with virtual nodes to the ring."""
        # TODO: Create CacheNode, add virtual nodes to ring
        pass

    def remove_node(self, node_name: str):
        """Remove a cache node from the ring."""
        # TODO: Remove all virtual nodes for this node
        pass

    def _get_node(self, key: str) -> CacheNode:
        """Find which cache node owns the given key."""
        # TODO: Hash key, find next position on ring, return node
        pass

    def get(self, key: str):
        """Get a value from the distributed cache."""
        node = self._get_node(key)
        return node.get(key) if node else None

    def set(self, key: str, value, ttl: int = 0):
        """Set a value in the distributed cache."""
        node = self._get_node(key)
        if node:
            node.set(key, value, ttl)

    def delete(self, key: str):
        """Delete a value from the distributed cache."""
        node = self._get_node(key)
        if node:
            node.delete(key)

    def stats(self) -> dict:
        """Return key count per node."""
        return {name: node.size() for name, node in self.nodes.items()}


# Test your implementation
if __name__ == "__main__":
    cache = DistributedCache(["cache-1", "cache-2", "cache-3"])

    # Insert 10000 keys
    for i in range(10000):
        cache.set(f"user:{i}", {"name": f"User {i}", "score": i * 10})

    # Check distribution
    print("Key distribution:")
    for name, count in sorted(cache.stats().items()):
        print(f"  {name}: {count} keys ({count/100:.1f}%)")

    # Verify reads
    hits = sum(1 for i in range(10000) if cache.get(f"user:{i}") is not None)
    print(f"\\nRead verification: {hits}/10000 keys found")

    # Add a node and check redistribution
    print("\\nAdding cache-4...")
    cache.add_node("cache-4")
    # Keys on the new node will be misses (simulating real behavior)
    hits_after = sum(1 for i in range(10000) if cache.get(f"user:{i}") is not None)
    moved = 10000 - hits_after
    print(f"Keys moved (cache misses): {moved}/10000 ({moved/100:.1f}%)")
    print("New distribution:")
    for name, count in sorted(cache.stats().items()):
        print(f"  {name}: {count} keys")
`,
      solutionCode: `# Distributed Cache Client with Consistent Hashing - Solution

import hashlib
import bisect

class CacheNode:
    def __init__(self, name: str):
        self.name = name
        self.store = {}

    def get(self, key: str):
        return self.store.get(key)

    def set(self, key: str, value, ttl: int = 0):
        self.store[key] = value

    def delete(self, key: str):
        self.store.pop(key, None)

    def size(self):
        return len(self.store)


class DistributedCache:
    def __init__(self, nodes: list, vnodes_per_node: int = 150):
        self.ring = {}
        self.sorted_positions = []
        self.nodes = {}
        self.node_positions = {}  # node_name -> [positions]
        self.vnodes_per_node = vnodes_per_node

        for node_name in nodes:
            self.add_node(node_name)

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node_name: str):
        node = CacheNode(node_name)
        self.nodes[node_name] = node
        self.node_positions[node_name] = []

        for i in range(self.vnodes_per_node):
            vnode_key = f"{node_name}:vn{i}"
            pos = self._hash(vnode_key)
            self.ring[pos] = node
            self.node_positions[node_name].append(pos)
            bisect.insort(self.sorted_positions, pos)

    def remove_node(self, node_name: str):
        if node_name not in self.nodes:
            return
        for pos in self.node_positions[node_name]:
            del self.ring[pos]
            idx = bisect.bisect_left(self.sorted_positions, pos)
            self.sorted_positions.pop(idx)
        del self.nodes[node_name]
        del self.node_positions[node_name]

    def _get_node(self, key: str) -> CacheNode:
        if not self.ring:
            return None
        pos = self._hash(key)
        idx = bisect.bisect_right(self.sorted_positions, pos)
        if idx == len(self.sorted_positions):
            idx = 0
        return self.ring[self.sorted_positions[idx]]

    def get(self, key: str):
        node = self._get_node(key)
        return node.get(key) if node else None

    def set(self, key: str, value, ttl: int = 0):
        node = self._get_node(key)
        if node:
            node.set(key, value, ttl)

    def delete(self, key: str):
        node = self._get_node(key)
        if node:
            node.delete(key)

    def stats(self) -> dict:
        return {name: node.size() for name, node in self.nodes.items()}


if __name__ == "__main__":
    cache = DistributedCache(["cache-1", "cache-2", "cache-3"])

    for i in range(10000):
        cache.set(f"user:{i}", {"name": f"User {i}", "score": i * 10})

    print("Key distribution:")
    for name, count in sorted(cache.stats().items()):
        print(f"  {name}: {count} keys ({count/100:.1f}%)")

    hits = sum(1 for i in range(10000) if cache.get(f"user:{i}") is not None)
    print(f"\\nRead verification: {hits}/10000 keys found")

    print("\\nAdding cache-4...")
    cache.add_node("cache-4")
    hits_after = sum(1 for i in range(10000) if cache.get(f"user:{i}") is not None)
    moved = 10000 - hits_after
    print(f"Keys moved (cache misses): {moved}/10000 ({moved/100:.1f}%)")
    print("New distribution:")
    for name, count in sorted(cache.stats().items()):
        print(f"  {name}: {count} keys")
`,
    },
    {
      id: "cache-invalidation",
      slug: "cache-invalidation-patterns",
      title: "Cache Invalidation Patterns",
      content: `# Cache Invalidation Patterns

Phil Karlton famously said there are only two hard things in computer science: cache invalidation and naming things. When cached data becomes stale, how do you ensure clients see fresh data?

## Why Invalidation Is Hard

\`\`\`concept
{
  "title": "The Stale Data Problem",
  "variant": "mental-model",
  "content": "T=0: DB has user.name = \\"Alice\\"\\n     Cache has user.name = \\"Alice\\"\\n\\nT=1: Admin updates DB: user.name = \\"Alicia\\"\\n     Cache STILL has user.name = \\"Alice\\" (stale!)\\n\\nT=2: App reads from cache: returns \\"Alice\\" (WRONG)\\n\\nHow long does the app serve stale data?"
}
\`\`\`

## Pattern 1: TTL (Time-To-Live)

The simplest approach. Every cached entry expires after a fixed time.

\`\`\`playground
{
  "title": "TTL in Action",
  "language": "python",
  "code": "import time, redis, json\\n\\nr = redis.Redis(decode_responses=True)\\n\\n# Initial data\\nr.setex(\\"user:100\\", 300, \\"Alice\\")  # expires in 5 minutes\\nprint(\\"T=0:\\", r.get(\\"user:100\\"))\\n\\ntime.sleep(2)\\nprint(\\"T=2:\\", r.get(\\"user:100\\"))  # still valid\\n\\n# Simulate DB update\\nr.setex(\\"user:100\\", 300, \\"Alicia\\")  # admin refreshes\\nprint(\\"After admin update:\\", r.get(\\"user:100\\"))",
  "runnable": true
}
\`\`\`

**Pros:** Simple, automatic, no coordination needed.  
**Cons:** Stale for up to TTL duration. Short TTL = more DB load. Long TTL = more staleness.

## Pattern 2: Event-Driven Invalidation

When the source of truth changes, it publishes an event that triggers cache invalidation.

\`\`\`sysdiag
{
  "title": "Event-Driven Invalidation Flow",
  "width": 600,
  "height": 260,
  "nodes": [
    { "id": "app", "label": "App", "x": 80, "y": 80, "kind": "service" },
    { "id": "db", "label": "DB", "x": 200, "y": 80, "kind": "storage" },
    { "id": "bus", "label": "Event Bus", "x": 320, "y": 80, "kind": "queue" },
    { "id": "inv", "label": "Invalidator", "x": 440, "y": 80, "kind": "worker" },
    { "id": "cache", "label": "Cache", "x": 560, "y": 80, "kind": "storage" }
  ],
  "edges": [
    { "from": "app", "to": "db", "label": "UPDATE" },
    { "from": "db", "to": "bus", "label": "trigger" },
    { "from": "bus", "to": "inv", "label": "user:100 updated" },
    { "from": "inv", "to": "cache", "label": "DELETE" }
  ],
  "annotations": {
    "bus": "Redis Pub/Sub, Kafka, or RabbitMQ can carry the invalidation event",
    "inv": "Single-threaded consumer avoids race conditions"
  }
}
\`\`\`

**Pros:** Near-instant invalidation. No stale window (except event propagation delay).  
**Cons:** Added complexity (event bus, consumer). Events can be delayed or lost. Must handle ordering.

## Pattern 3: Change Data Capture (CDC)

Read the database's transaction log to detect changes and invalidate cache entries.

\`\`\`concept
{
  "title": "CDC Invalidation",
  "variant": "insight",
  "content": "DB Transaction Log:\\n  [LSN 1001] UPDATE users SET name='Alicia' WHERE id=100\\n  [LSN 1002] INSERT orders (user_id=100, item='book')\\n\\nCDC Consumer (e.g., Debezium):\\n  Reads transaction log\\n  For LSN 1001: invalidate cache key \\"user:100\\"\\n  For LSN 1002: invalidate cache key \\"orders:user:100\\"\\n\\nDB --> Transaction Log --> CDC --> Cache DELETE"
}
\`\`\`

**Pros:** No application code changes. Captures ALL changes (including direct DB updates).  
**Cons:** Infrastructure complexity. Slight delay (log tailing).

## Pattern 4: Write-Through Invalidation

On every write, update both the cache and database atomically.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Race-prone update",
    "code": "# Thread 1\\nDB = \\"Alicia\\"\\ncache.set(\\"user:100\\", \\"Alicia\\")\\n\\n# Thread 2 (between Thread 1's two writes)\\nDB = \\"Ali\\"\\n\\n# Result: cache has \\"Alicia\\" but DB has \\"Ali\\" ❶"
  },
  "after": {
    "label": "Safe delete",
    "code": "# Thread 1\\nDB = \\"Alicia\\"\\ncache.delete(\\"user:100\\")\\n\\n# Thread 2 (anytime)\\nDB = \\"Ali\\"\\ncache.delete(\\"user:100\\")\\n\\n# Next read: cache miss -> fresh \\"Ali\\" ✓"
  }
}
\`\`\`

**Rule of thumb:** Prefer **delete** over **update** for cache invalidation. Deletes are idempotent; updates can race.

## Pattern 5: Lease-Based Invalidation

When a cache miss occurs, the cache gives the client a **lease** (token). Only the client with the valid lease can populate the cache.

\`\`\`trace
{
  "title": "Lease-Based Population (Facebook's Memcache)",
  "language": "python",
  "code": "import time, random\\n\\ncache = {}\\nleases = {}      # key -> (token, expiry)\\nTOKEN_TTL = 5    # seconds\\n\\ndef get(key):\\n    if key in cache:\\n        return cache[key], \\"HIT\\"\\n    \\n    # Cache miss — try to get lease\\n    now = time.time()\\n    if key not in leases or leases[key][1] < now:\\n        token = random.randint(1000, 9999)\\n        leases[key] = (token, now + TOKEN_TTL)\\n        return None, f\\"MISS, lease={token}\\"\\n    else:\\n        return None, \\"MISS, lease already held\\"\\n\\ndef set_with_lease(key, value, token):\\n    if leases.get(key, (None, 0))[0] == token:\\n        cache[key] = value\\n        del leases[key]\\n        return \\"STORED\\"\\n    return \\"REJECTED (bad lease)\\"\\n\\n# Simulate two clients\\nprint(\\"Client A:\\", get(\\"user:100\\"))\\nprint(\\"Client B:\\", get(\\"user:100\\"))\\nprint(\\"Client A store:\\", set_with_lease(\\"user:100\\", \\"Alicia\\", 1234))\\nprint(\\"Client B store:\\", set_with_lease(\\"user:100\\", \\"Ali\\", 5678))",
  "frames": [
    { "line": 8, "vars": {"cache": {}, "leases": {}}, "note": "empty cache", "stdout": "" },
    { "line": 11, "vars": {"cache": {}, "leases": {"user:100": [5237, 1234567895]}}, "note": "Client A gets lease 5237", "stdout": "Client A: (None, 'MISS, lease=5237')" },
    { "line": 25, "vars": {"cache": {}, "leases": {"user:100": [5237, 1234567895]}}, "note": "Client B sees existing lease", "stdout": "Client B: (None, 'MISS, lease already held')" },
    { "line": 27, "vars": {"cache": {"user:100": "Alicia"}, "leases": {}}, "note": "Only A can store", "stdout": "Client A store: STORED\\nClient B store: REJECTED (bad lease)" }
  ],
  "speed": 900
}
\`\`\`

This prevents “thundering herd” — only ONE client queries the DB for a missing key.

## Choosing a Pattern

| Pattern | Staleness | Complexity | Best For |
|---------|-----------|------------|----------|
| TTL only | Up to TTL | Very low | Low-stakes data |
| Event-driven | Seconds | Medium | Real-time consistency |
| CDC | Seconds | High | Legacy systems, no app changes |
| Write-through delete | Near-zero | Low | Standard web apps |
| Lease-based | Near-zero | Medium | High-traffic keys |

\`\`\`quiz
{
  "title": "Pick the Right Invalidation",
  "questions": [
    {
      "question": "Your product catalog changes nightly via batch job. Which pattern fits best?",
      "options": ["TTL 24 h", "Event-driven", "CDC", "Write-through"],
      "answer": 0,
      "explanation": "TTL is simplest when changes are predictable and staleness window is known."
    },
    {
      "question": "You need sub-second consistency for inventory counts that are updated by multiple services. Which pattern?",
      "options": ["TTL 1 s", "Event-driven", "CDC", "Lease-based write-through delete"],
      "answer": 3,
      "explanation": "Lease-based write-through delete gives near-zero staleness and prevents races on hot keys."
    },
    {
      "question": "A third-party BI tool writes directly to your Postgres. How do you invalidate?",
      "options": ["Event-driven", "CDC", "Write-through", "TTL only"],
      "answer": 1,
      "explanation": "CDC reads the WAL, capturing changes that bypass your application."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "TTL is the baseline strategy for every cache entry.",
    "Layer event-driven or write-through invalidation on top for data that must be fresh.",
    "Use leases to prevent thundering herd on popular keys.",
    "Always prefer delete over update to avoid race conditions."
  ]
}
\`\`\``,
    },
    {
      id: "cache-hot-keys",
      slug: "cache-hot-key-solutions",
      title: "Hot Key Solutions",
      content: `# Hot Key Solutions

A **hot key** is a single cache key that receives a disproportionate amount of traffic. One viral post, a flash sale product, or a celebrity user profile can overwhelm a single cache node.

## The Problem

\`\`\`
Hot Key Scenario
================

Normal: 100K requests/sec distributed across 10 cache nodes
        Each node handles ~10K req/sec

Hot key "product:iphone-sale" gets 50K req/sec
        All 50K go to ONE node (consistent hashing)
        That node is overloaded: high latency, OOM, crash

   Cache Node 1: 10K req/sec (normal)
   Cache Node 2: 10K req/sec (normal)
   Cache Node 3: 60K req/sec (HOT KEY!) <-- overloaded
   Cache Node 4: 10K req/sec (normal)
   Cache Node 5: 10K req/sec (normal)
\`\`\`

## Solution 1: Local Cache (L1 Cache)

Cache hot keys in each application server's memory:

\`\`\`
L1 + L2 Cache Architecture
===========================

[App Server 1]              [App Server 2]
+---------------+           +---------------+
| L1 Cache      |           | L1 Cache      |
| (in-process)  |           | (in-process)  |
| product:iphone|           | product:iphone|
| TTL: 5 seconds|           | TTL: 5 seconds|
+---------------+           +---------------+
       |                          |
       v                          v
+--------------------------------------------+
|           L2 Cache (Redis Cluster)          |
| [Node 1] [Node 2] [Node 3] [Node 4]       |
+--------------------------------------------+

Reads check L1 first (microseconds, no network).
L1 miss --> check L2 (milliseconds, network hop).
L2 miss --> check database.

Hot key hits L1 on each app server:
  50K req/sec / 20 app servers = 2.5K per server (handled locally)
  L2 sees only TTL-refresh reads: ~4 req/sec total
\`\`\`

**Pros:** Eliminates hot key problem entirely for reads. Zero network overhead.
**Cons:** Each server has its own copy (memory overhead). Stale for up to L1 TTL.

## Solution 2: Key Replication (Read Replicas)

Store the same key on multiple cache nodes under different sub-keys:

\`\`\`
Key Replication
===============

Hot key: "product:iphone-sale"

Replicated as:
  "product:iphone-sale:r0" --> Node 1
  "product:iphone-sale:r1" --> Node 3
  "product:iphone-sale:r2" --> Node 5
  "product:iphone-sale:r3" --> Node 7

On read:
  replica_id = random(0, 3)
  key = "product:iphone-sale:r{replica_id}"
  GET from the node that owns this key

50K req/sec / 4 replicas = 12.5K per node (manageable)
\`\`\`

**Pros:** Spreads load across nodes. No code change in cache layer.
**Cons:** Must keep all replicas in sync. Invalidation must delete all replica keys.

## Solution 3: Hot Key Detection and Migration

Detect hot keys at runtime and apply mitigation dynamically:

\`\`\`
Hot Key Detection Pipeline
===========================

1. Each cache node tracks request counts per key
   (approximate, using Count-Min Sketch or top-K algorithm)

2. If key exceeds threshold (e.g., 1000 req/sec):
   Report to coordinator: "product:iphone-sale is HOT"

3. Coordinator decides mitigation:
   a. Promote to L1 cache on all app servers
   b. Create read replicas
   c. Increase TTL to reduce refresh frequency

4. When traffic subsides, remove hot key treatment

   [Cache Nodes] --reports--> [Hot Key Detector]
                                    |
                               [Mitigation]
                                    |
                           +--------+--------+
                           |                 |
                      L1 promotion    Replica creation
\`\`\`

## Solution 4: Request Coalescing

When many requests arrive for the same missing key simultaneously, only ONE request goes to the database:

\`\`\`
Request Coalescing (Singleflight)
==================================

T=0: Key "product:X" expires
T=0.001: Request A arrives --> cache miss
  Start DB query for "product:X"
  Add to in-flight map: {"product:X": pending}

T=0.002: Request B arrives --> cache miss
  Check in-flight: "product:X" is pending
  Wait for Request A's result

T=0.003: Requests C, D, E arrive --> all wait

T=0.050: DB query returns result
  Cache stores result
  All waiting requests (A, B, C, D, E) receive the result

Without coalescing: 5 DB queries
With coalescing:    1 DB query
\`\`\`

## Solution Comparison

| Solution | Hot Reads | Hot Writes | Complexity | Staleness |
|----------|-----------|------------|------------|-----------|
| L1 local cache | Excellent | N/A | Low | Up to L1 TTL |
| Key replication | Good | Must sync all | Medium | Depends on sync |
| Dynamic detection | Good | Moderate | High | Minimal |
| Request coalescing | Good (for misses) | N/A | Medium | None |

## Production Recommendation

\`\`\`
Recommended Hot Key Strategy
==============================

1. Always use L1 cache for known hot keys (product pages,
   config data, session data)

2. Use request coalescing (singleflight) for ALL cache misses
   (prevents thundering herd regardless of hot keys)

3. Monitor for unexpected hot keys with lightweight tracking
   (Count-Min Sketch sampling, ~1% of requests)

4. Have a runbook for manual hot key mitigation
   (increase replicas, extend TTL, add L1 entry)
\`\`\`

## Key Takeaway

Hot keys are inevitable at scale. The most effective defense is a multi-layered approach: L1 local caches for known hot data, request coalescing for cache misses, and runtime detection for unexpected hot keys. No single technique handles all scenarios, so production systems combine multiple strategies.`,
    },
    {
      id: "cache-architecture",
      slug: "cache-architecture-walkthrough",
      title: "Distributed Cache: Architecture Walkthrough",
      content: `# Distributed Cache: Architecture Walkthrough

\`\`\`concept
{"title": "Distributed Cache as a Multi-Tier Shield", "variant": "mental-model", "content": "Think of your cache layers as concentric shields protecting the database:\\n\\n1. **L1 Shield (in-process)**: Paper-thin but instant (~0.01 ms). Absorbs 60-80% of repetitive reads.\\n2. **L2 Shield (Redis cluster)**: Steel plate (~0.5 ms). Catches most remaining hits.\\n3. **Database**: The castle. If both shields fail, the query reaches here (~5 ms).\\n\\nEach shield is tuned differently—L1 trades capacity for speed, L2 balances both, and the database guarantees durability. The goal is to stop the arrow before it reaches the castle."}
\`\`\`

Let’s stitch every technique we’ve discussed into one production-grade system.

## Complete Architecture

\`\`\`sysdiag
{"title": "End-to-End Distributed Cache Flow", "width": 720, "height": 420,
 "nodes": [
   {"id":"client","label":"App Server","x":120,"y":90,"kind":"client"},
   {"id":"l1","label":"L1 Cache\\nTTL 5s","x":120,"y":180,"kind":"cache"},
   {"id":"sf","label":"Singleflight\\n(coalesce)","x":120,"y":270,"kind":"service"},
   {"id":"proxy","label":"Redis Proxy","x":300,"y":180,"kind":"proxy"},
   {"id":"nodeA","label":"Node A\\nslots 0-5460","x":420,"y":120,"kind":"cache"},
   {"id":"nodeB","label":"Node B\\nslots 5461-10922","x":420,"y":180,"kind":"cache"},
   {"id":"nodeC","label":"Node C\\nslots 10923-16383","x":420,"y":240,"kind":"cache"},
   {"id":"replA","label":"Replica A'","x":540,"y":120,"kind":"cache","dash":true},
   {"id":"replB","label":"Replica B'","x":540,"y":180,"kind":"cache","dash":true},
   {"id":"replC","label":"Replica C'","x":540,"y":240,"kind":"cache","dash":true},
   {"id":"db","label":"PostgreSQL\\nSource of Truth","x":420,"y":340,"kind":"db"},
   {"id":"cdc","label":"CDC / Event Bus","x":120,"y":340,"kind":"queue"}
 ],
 "edges": [
   {"from":"client","to":"l1","label":"read","curved":-20},
   {"from":"l1","to":"sf","label":"miss"},
   {"from":"sf","to":"proxy","label":"fetch"},
   {"from":"proxy","to":"nodeA","label":"CRC16"},
   {"from":"proxy","to":"nodeB","label":"slot"},
   {"from":"proxy","to":"nodeC","label":"map"},
   {"from":"nodeA","to":"replA","label":"replicate"},
   {"from":"nodeB","to":"replB","label":"replicate"},
   {"from":"nodeC","to":"replC","label":"replicate"},
   {"from":"nodeB","to":"db","label":"miss"},
   {"from":"db","to":"cdc","label":"change"},
   {"from":"cdc","to":"client","label":"invalidate"}
 ],
 "annotations": {
   "l1": "Local hash map inside every app process. No network hop.",
   "proxy": "Redis cluster-aware client; handles MOVED/ASK redirects.",
   "cdc": "Debezium reading WAL; publishes cache invalidation events."
 }}
\`\`\`

## Read Path End-to-End

\`\`\`steps
{"title": "Read Path: From Browser Byte to Cache Hit", "steps": [
  {"title": "1. L1 Lookup", "content": "App hashes \`user:100\` in local memory. **Hit ratio ~70%**, latency **0.01ms**. If hit, return immediately—path ends here."},
  {"title": "2. Singleflight Gate", "content": "If L1 misses, check a **per-key in-flight map**. Another goroutine already fetching? Wait on its channel instead of thundering the cluster."},
  {"title": "3. CRC16 Slot", "content": "Client computes \`CRC16('user:100') = 0x1C44 → slot 7234\`. Cluster topology says slot 7234 lives on **Node B**; connection already pooled."},
  {"title": "4. L2 Hit", "content": "Redis returns value in **0.5ms**. Populate L1 with TTL=5s, return to caller. **95% of requests stop here**."},
  {"title": "5. DB Miss", "content": "Still missing? Query PostgreSQL (**5ms**), then \`SET user:100 <json> EX 300\` in Redis and store in L1. Next 999 reads skip the DB."}
]}
\`\`\`

## Write Path End-to-End

\`\`\`compare
{"variant": "good-bad",
 "before": {"label": "Write-Through (slower but safe)", "code": "# Updates both cache + DB in same call\\nredis.setex(key, 300, new_value)\\ndb.execute(\\"UPDATE users SET name=? WHERE id=?\\", new_value, user_id)"},
 "after": {"label": "Cache-Aside + Invalidation (preferred)", "code": "# 1. Change DB first (source of truth)\\ndb.execute(\\"UPDATE users SET name=? WHERE id=?\\", new_value, user_id)\\n# 2. Delete cache entry (not update) to avoid race\\nredis.delete(key)\\n# 3. L1 either TTL-expires or receives pub/sub event\\npublish(\\"invalidate\\", key)"}}
\`\`\`

## Failure Scenarios

| Failure | Impact | Auto-Recovery Tactics |
|---------|--------|-----------------------|
| **L1 full** | Eviction surge | LRU frees cold entries; alert if churn > 1 k/s |
| **Redis node crash** | 1/3 slots unavailable | Replica promoted < 5s; clients retry with MOVED |
| **Cluster network partition** | Partial slot loss | Redis Cluster continues serving reachable slots; app degrades gracefully |
| **Hot key spike** | One slot CPU 100% | L1 absorbs 80%; singleflight collapses 5 k concurrent reads into one |
| **Database slow query** | Cache miss latency jumps | Circuit-breaker opens after 50% error rate; serve stale data with \`stale-while-revalidate\` header |

## Cache Warming & Cold Start

\`\`\`algoviz
{"title": "Gradual Warming Simulation", "type": "array",
 "data": ["miss","miss","miss","hit","hit","hit","hit","hit","hit","hit"],
 "frames": [
   {"highlight":[0,1,2],"label":"0% warmed → 100% miss","stats":{"traffic":0.01,"hitRate":0}},
   {"highlight":[3,4],"label":"10% traffic → first hits appear","stats":{"traffic":0.1,"hitRate":0.2}},
   {"highlight":[5,6,7],"label":"50% traffic → hit rate 60%","stats":{"traffic":0.5,"hitRate":0.6}},
   {"highlight":[8,9],"label":"100% switch → 90% hit rate","stats":{"traffic":1,"hitRate":0.9}}
 ],
 "speed": 1200}
\`\`\`

1. **Shadow mode**: New cluster receives mirrored reads but results are discarded until hit rate > 90%.  
2. **Pre-load**: Spark job \`SELECT id, json_blob FROM users ORDER BY read_count DESC LIMIT 10 000\` → bulk insert into Redis with 5-min TTL.  
3. **Traffic ramp**: Start at 1%, double every 5 min while monitoring DB connection count and p99 latency.

## Monitoring Dashboard

\`\`\`callout
{"type": "warning", "title": "Alert Fatigue Prevention", "content": "Page only on **symptom-based SLOs**: p99 read latency > 20ms or hit ratio < 90%. Everything else (memory, evictions, connections) should be tickets, not pages."}
\`\`\`

Key SLI widgets to pin:

| Metric | Target | Source |
|--------|--------|--------|
| **L1 hit ratio** | > 80% | App telemetry (Micrometer) |
| **L2 hit ratio** | > 95% | Redis \`keyspace_hits / (hits + misses)\` |
| **p99 GET latency** | < 1ms | Redis \`latency percentile 99\` |
| **Evictions/sec** | near 0 | Redis \`evicted_keys\` |
| **Replica lag** | < 1s | \`master_last_io_seconds_ago\` |

\`\`\`quiz
{"title": "Architecture Walkthrough Check", "questions": [
  {"question": "Which layer absorbs the highest percentage of reads in a well-tuned system?","options":["PostgreSQL","Redis cluster","L1 in-process cache","CDC bus"],"answer":2,"explanation":"L1 typically hits 60-80% because it is fastest and closest to the request."},
  {"question": "Why is cache-aside + delete preferred over write-through for most workloads?","options":["It guarantees stronger consistency","It avoids racing updates and partial writes","It reduces write amplification","It works without a message queue"],"answer":1,"explanation":"Deleting the key eliminates the window where cache and DB can disagree on value."},
  {"question": "During a Redis node failure, what redirect error do clients first receive?","options":["ASK","MOVED","CLUSTERDOWN","READONLY"],"answer":1,"explanation":"MOVED tells the client which new node now owns the slot after failover."}
]}
\`\`\`

## Summary Cheat-Sheet

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Multi-tier (L1+L2) trims 95% of database reads; singleflight protects the remaining 5%.",
  "Consistent hashing + hash slots spread 16k buckets evenly—add/remove nodes with < 1% key shuffle.",
  "Invalidate on write, don’t update; pair with TTL for eventual cleanup.",
  "Warm caches with shadow traffic and top-K pre-load to dodge cold-start thundering herds.",
  "Monitor hit ratio and p99 latency—everything else is secondary."
]}
\`\`\``,
    },
  ],
};
