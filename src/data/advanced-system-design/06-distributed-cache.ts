import { Module } from "../types";

export const distributedCacheModule: Module = {
  id: "design-cache",
  title: "Designing a Distributed Cache",
  description:
    "Design a distributed caching system: cache strategies, consistent hashing for sharding, invalidation patterns, hot key solutions, and complete architecture walkthrough.",
  lessons: [
    {
      id: "cache-requirements",
      slug: "cache-requirements",
      title: "Distributed Cache: Requirements & Motivation",
      content: `# Distributed Cache: Requirements & Motivation

A distributed cache sits between your application and your database, storing frequently accessed data in memory to reduce latency and database load. Systems like Memcached and Redis power the caching layers of nearly every large-scale web application.

## The Problem

A database can handle thousands of queries per second. But at web scale, you need **millions** of reads per second with **sub-millisecond** latency. No database can do this alone.

\`\`\`
Without Cache:
  10,000 requests/sec --> Database
  Database: 5ms per query, max 10K QPS
  Result: 100% of requests hit DB, high latency

With Cache (90% hit rate):
  10,000 requests/sec --> Cache (9,000 hits, <1ms each)
                      --> Database (1,000 misses, 5ms each)
  Result: 90% of requests served in <1ms
          Database load reduced by 90%
\`\`\`

## Functional Requirements

1. **Get(key)** -- Retrieve a cached value (or cache miss)
2. **Set(key, value, TTL)** -- Store a value with optional time-to-live
3. **Delete(key)** -- Explicitly remove a cached value
4. Support for **multiple data types** (strings, hashes, lists, sorted sets)
5. **Atomic operations** (increment, compare-and-swap)

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Latency (read) | < 1ms at p99 |
| Latency (write) | < 1ms at p99 |
| Throughput | 100K+ ops/sec per node |
| Availability | 99.99% |
| Scalability | Linear scale with node count |
| Data size | Hot dataset fits in aggregate cluster RAM |

## Cache vs. Database

\`\`\`
Performance Comparison
======================

                 Cache (Redis)     Database (PostgreSQL)
Storage          RAM               Disk (SSD)
Read latency     0.1-0.5ms         1-10ms
Write latency    0.1-0.5ms         2-20ms
Throughput       100K+ ops/sec     10K ops/sec
Durability       Optional (AOF)    Full ACID
Data size        Limited by RAM    Limited by disk
Query support    Key-value + basic Full SQL
\`\`\`

## Where Caches Fit

\`\`\`mermaid
graph TD
    C[Clients] --> LB[Load Balancer]
    LB --> AS[Application Servers]
    AS -->|check first| Cache[Distributed Cache]
    Cache -->|cache miss| DB[(Database)]
    AS -->|on miss| DB
    AS --> CDN[CDN - Static Content]
\`\`\`

\`\`\`
Typical Web Architecture
========================

[Clients]
    |
    v
[Load Balancer]
    |
    v
[Application Servers]
    |
    +-----> [Distributed Cache] <--- check here FIRST
    |              |
    |         cache miss
    |              |
    +-----> [Database] <--- only on cache miss
    |
    +-----> [CDN] <--- static content cache
\`\`\`

## Types of Distributed Caches

| Type | Description | Example |
|------|-------------|---------|
| Client-side | Cached in the app process memory | In-process HashMap |
| Sidecar | Cached on the same machine as the app | Local Redis |
| Remote cluster | Dedicated cache cluster shared by all app instances | Redis Cluster, Memcached |
| Multi-tier | L1 (local) + L2 (remote) | Local cache + Redis |

## Key Takeaway

A distributed cache is the single most effective way to reduce database load and latency at scale. The challenge is not just storing data in memory -- it is sharding across nodes, handling failures, keeping data consistent with the source of truth, and managing hot keys. These challenges are what make distributed cache design a rich system design topic.`,
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

\`\`\`
Naive Sharding: hash(key) % N

With 3 nodes:
  hash("user:100") % 3 = 1 --> Node 1
  hash("user:200") % 3 = 0 --> Node 0
  hash("user:300") % 3 = 2 --> Node 2

Add a 4th node (N=3 -> N=4):
  hash("user:100") % 4 = 0 --> Node 0 (MOVED from Node 1!)
  hash("user:200") % 4 = 0 --> Node 0 (same)
  hash("user:300") % 4 = 1 --> Node 1 (MOVED from Node 2!)

~75% of keys move to different nodes!
Every moved key is a cache miss --> database spike
\`\`\`

This is called a **cache stampede** or **thundering herd**: adding or removing a node invalidates most of the cache, causing a flood of database queries.

## Consistent Hashing Solution

Both keys and nodes are mapped onto a hash ring. Each key maps to the nearest node clockwise:

\`\`\`
Hash Ring (0 to 2^32-1)
========================

          Node A (pos: 1000)
              |
    key_3 --  |  -- key_1
      \\       |      /
       \\      |     /
  Node D ----   ---- Node B
  (pos: 750)    (pos: 250)
       /      |     \\
      /       |      \\
    key_4 --  |  -- key_2
              |
          Node C (pos: 500)

key_1 (hash: 150) --> Node B (nearest clockwise)
key_2 (hash: 400) --> Node C
key_3 (hash: 900) --> Node A
key_4 (hash: 600) --> Node D

Adding Node E at position 350:
  Only key_2 (hash: 400) might move: was Node C, still Node C
  Only keys between 250 and 350 move to Node E
  --> ~1/N keys affected (not 75%)
\`\`\`

## Virtual Nodes for Even Distribution

With few physical nodes, the ring can be unbalanced. Virtual nodes spread each physical node across many ring positions:

\`\`\`
Physical node "cache-1" --> 150 virtual nodes
  "cache-1:vn0" at position 102
  "cache-1:vn1" at position 5839
  "cache-1:vn2" at position 12043
  ... (150 positions scattered around ring)

With 4 physical nodes x 150 vnodes = 600 ring points
  --> Very even distribution of keys
  --> Each physical node owns ~25% of keyspace
\`\`\`

## Implementation

\`\`\`
Client-Side Sharding (Memcached model)
=======================================

Client has the hash ring logic:

  client = CacheClient(nodes=["cache-1:6379", "cache-2:6379", "cache-3:6379"])
  client.set("user:100", data)
    1. hash("user:100") --> find node on ring
    2. Send SET to that specific node

  client.get("user:100")
    1. hash("user:100") --> same node as set
    2. Send GET to that specific node

Cluster-Side Sharding (Redis Cluster model)
============================================

Cluster has 16384 hash slots:
  slot = CRC16(key) % 16384

  Node A: slots 0-5460
  Node B: slots 5461-10922
  Node C: slots 10923-16383

  Client sends GET to any node
  If node owns the slot: return value
  If not: MOVED redirect to correct node
  Client caches slot-node mapping
\`\`\`

## Handling Node Failures

\`\`\`
Node Failure Recovery
=====================

Node B fails:

1. Health check detects Node B is down

2. Option A: Rehash to remaining nodes
   Keys on Node B --> distributed to Node A, C, D
   Those keys are cache misses (DB reads)

3. Option B: Replica promotion
   Each node has a replica:
     Node B primary --> Node B' replica
   Promote B' to primary
   Keys served from B' with no misses

4. Consistent hashing ensures only B's keys are affected
   Nodes A, C, D continue serving their keys normally
\`\`\`

## Redis Cluster Slot Migration

When adding a node to Redis Cluster:

\`\`\`
Adding Node D to a 3-node cluster:

Before:
  Node A: slots 0-5460      (5461 slots)
  Node B: slots 5461-10922  (5462 slots)
  Node C: slots 10923-16383 (5461 slots)

After:
  Node A: slots 0-4095       (4096 slots)
  Node B: slots 5461-9556    (4096 slots)
  Node C: slots 10923-15018  (4096 slots)
  Node D: slots 4096-5460, 9557-10922, 15019-16383 (4096 slots)

Migration happens slot by slot:
  1. Mark slot as MIGRATING on source, IMPORTING on target
  2. Move keys in that slot from source to target
  3. Update slot-node mapping
  4. Clients see MOVED/ASK redirects during migration
\`\`\`

## Key Takeaway

Consistent hashing minimizes cache disruption when nodes are added or removed. Virtual nodes ensure even distribution. Redis Cluster uses a fixed 16384-slot approach for simpler management, while Memcached uses client-side consistent hashing. Both strategies ensure that only a fraction of keys are affected by topology changes, preventing cache stampedes.`,
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

\`\`\`
The Stale Data Problem
======================

T=0: DB has user.name = "Alice"
     Cache has user.name = "Alice"

T=1: Admin updates DB: user.name = "Alicia"
     Cache STILL has user.name = "Alice" (stale!)

T=2: App reads from cache: returns "Alice" (WRONG)

How long does the app serve stale data?
\`\`\`

## Pattern 1: TTL (Time-To-Live)

The simplest approach. Every cached entry expires after a fixed time.

\`\`\`
SET user:100 "Alice" EX 300   (expires in 5 minutes)

T=0:     Cache stores "Alice", TTL=300s
T=120s:  Someone reads cache -> "Alice" (still valid)
T=300s:  Cache entry expires
T=301s:  Cache miss -> read from DB -> "Alicia" (fresh)

Staleness window: up to 300 seconds
\`\`\`

**Pros:** Simple, automatic, no coordination needed.
**Cons:** Stale for up to TTL duration. Short TTL = more DB load. Long TTL = more staleness.

## Pattern 2: Event-Driven Invalidation

When the source of truth changes, it publishes an event that triggers cache invalidation.

\`\`\`
Event-Driven Invalidation
==========================

1. App updates DB: UPDATE users SET name='Alicia' WHERE id=100
2. App (or DB trigger) publishes event:
   Event Bus --> "user:100 updated"
3. Cache invalidation consumer receives event:
   DELETE cache key "user:100"
4. Next read: cache miss -> fresh data from DB

                +-------+
  App --> DB -->| Event |---> Cache Invalidator --> DELETE user:100
                | Bus   |
                +-------+
\`\`\`

**Pros:** Near-instant invalidation. No stale window (except event propagation delay).
**Cons:** Added complexity (event bus, consumer). Events can be delayed or lost. Must handle ordering.

## Pattern 3: Change Data Capture (CDC)

Read the database's transaction log to detect changes and invalidate cache entries.

\`\`\`
CDC Invalidation
================

DB Transaction Log:
  [LSN 1001] UPDATE users SET name='Alicia' WHERE id=100
  [LSN 1002] INSERT orders (user_id=100, item='book')

CDC Consumer (e.g., Debezium):
  Reads transaction log
  For LSN 1001: invalidate cache key "user:100"
  For LSN 1002: invalidate cache key "orders:user:100"

DB --> Transaction Log --> CDC --> Cache DELETE
\`\`\`

**Pros:** No application code changes. Captures ALL changes (including direct DB updates).
**Cons:** Infrastructure complexity. Slight delay (log tailing).

## Pattern 4: Write-Through Invalidation

On every write, update both the cache and database atomically.

\`\`\`
Write-Through
=============

App write:
  1. Update DB: name = "Alicia"
  2. Update cache: SET user:100 "Alicia"
  (both in same code path)

  Stale window: zero (cache always has latest)

Problem: race condition with concurrent writes
  Thread 1: DB = "Alicia", then cache = "Alicia"
  Thread 2: DB = "Ali" (between thread 1's DB write and cache write)
  Thread 1: cache = "Alicia" (STALE -- DB has "Ali")

Solution: invalidate instead of update
  Thread 1: DB = "Alicia", DELETE cache
  Thread 2: DB = "Ali", DELETE cache
  Next read: cache miss -> reads "Ali" (correct)
\`\`\`

**Rule of thumb:** Prefer **delete** over **update** for cache invalidation. Deletes are idempotent; updates can race.

## Pattern 5: Lease-Based Invalidation

When a cache miss occurs, the cache gives the client a **lease** (token). Only the client with the valid lease can populate the cache.

\`\`\`
Lease-Based Population (Facebook's Memcache)
=============================================

1. Client A: GET user:100 --> MISS, lease_token=abc123
2. Client B: GET user:100 --> MISS, but lease already issued
   --> Client B waits (or gets stale value)
3. Client A reads DB, returns "Alicia"
4. Client A: SET user:100 "Alicia" with lease_token=abc123
   --> Cache accepts (valid lease)
5. Client B: retry GET --> HIT, returns "Alicia"

If Client A crashes:
  Lease expires after timeout
  Next client gets a new lease

This prevents "thundering herd" -- only ONE client
queries the DB for a missing key.
\`\`\`

## Choosing a Pattern

| Pattern | Staleness | Complexity | Best For |
|---------|-----------|------------|----------|
| TTL only | Up to TTL | Very low | Low-stakes data |
| Event-driven | Seconds | Medium | Real-time consistency |
| CDC | Seconds | High | Legacy systems, no app changes |
| Write-through delete | Near-zero | Low | Standard web apps |
| Lease-based | Near-zero | Medium | High-traffic keys |

## Key Takeaway

TTL is the baseline strategy for every cache entry. Layer event-driven or write-through invalidation on top for data that must be fresh. Use leases to prevent thundering herd on popular keys. And always prefer delete over update to avoid race conditions.`,
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

Let us bring together all the components into a complete distributed cache system.

## Complete Architecture

\`\`\`
              Distributed Cache Architecture
              ===============================

[Clients / App Servers]
+--------------------------------------------------+
| App Server 1      App Server 2      App Server 3  |
| +------------+   +------------+   +------------+  |
| | L1 Cache   |   | L1 Cache   |   | L1 Cache   |  |
| | (in-proc)  |   | (in-proc)  |   | (in-proc)  |  |
| | TTL: 5s    |   | TTL: 5s    |   | TTL: 5s    |  |
| +-----+------+   +-----+------+   +-----+------+  |
|       |               |               |            |
| +-----+------+   +----+------+   +----+-------+   |
| | Singleflight|  |Singleflight|  |Singleflight|   |
| | (coalesce)  |  | (coalesce) |  | (coalesce)  |   |
| +-----+------+   +-----+-----+   +-----+------+   |
+-------+-----------+-----+---------+-----+----------+
        |                 |               |
        v                 v               v
+--------------------------------------------------+
|         L2 Cache Cluster (Redis Cluster)          |
|                                                   |
|  Node A           Node B           Node C         |
|  +----------+    +----------+    +----------+     |
|  |slots 0-  |    |slots 5461|    |slots 10923    |
|  |5460      |    |-10922    |    |-16383    |     |
|  |          |    |          |    |          |     |
|  |Primary   |    |Primary   |    |Primary   |     |
|  +----------+    +----------+    +----------+     |
|  |Replica A'|    |Replica B'|    |Replica C'|     |
|  |(on diff  |    |(on diff  |    |(on diff  |     |
|  | machine) |    | machine) |    | machine) |     |
|  +----------+    +----------+    +----------+     |
+--------------------------------------------------+
        |                 |               |
        v                 v               v
+--------------------------------------------------+
|              Database (PostgreSQL)                 |
|       (source of truth, queried on miss)          |
+--------------------------------------------------+
        ^
        |
  [CDC / Event Bus for invalidation]
\`\`\`

## Read Path End-to-End

\`\`\`
GET user:100

1. Check L1 (in-process cache, ~0.01ms)
   |
   +-- HIT: return immediately (fastest)
   |
   +-- MISS: proceed to L2

2. Check singleflight: is someone already fetching user:100?
   |
   +-- YES: wait for their result
   |
   +-- NO: acquire lock, proceed

3. Check L2 (Redis Cluster, ~0.5ms)
   CRC16("user:100") % 16384 = slot 7234
   Slot 7234 is on Node B
   |
   +-- HIT: store in L1 (TTL=5s), return value
   |
   +-- MISS: proceed to database

4. Query database (~5ms)
   SELECT * FROM users WHERE id = 100

5. Populate caches:
   L2: SET user:100 <value> EX 300  (5 min TTL)
   L1: store locally (TTL=5s)

6. Return value to caller
\`\`\`

## Write Path End-to-End

\`\`\`
UPDATE user:100 name='Alicia'

1. Write to database:
   UPDATE users SET name='Alicia' WHERE id=100

2. Invalidate L2 cache:
   DEL user:100 on Redis Cluster

3. Invalidate L1 caches:
   Option A: Wait for L1 TTL to expire (5s staleness)
   Option B: Pub/Sub broadcast to all app servers:
             "invalidate user:100"
             Each server deletes from its L1

4. Next read will:
   L1 miss --> L2 miss --> DB read --> populate both caches
\`\`\`

## Failure Scenarios

| Failure | Impact | Recovery |
|---------|--------|----------|
| L1 cache full | Evict LRU entries | Automatic (LRU eviction) |
| Redis node crash | Keys on that node unavailable | Redis Cluster promotes replica. Clients get MOVED redirects. |
| Redis cluster unreachable | All cache reads fail | Fall through to database. Circuit breaker prevents overwhelming DB. |
| Database slow | Cache misses are slow | Extend TTLs dynamically. Serve stale data with \`stale-while-revalidate\`. |
| Hot key spike | Single Redis node overloaded | L1 absorbs most reads. Singleflight prevents stampede. |
| Network partition | Partial cluster unreachable | Redis Cluster: available slots served, unavailable slots return errors. |

## Cache Warming

\`\`\`
Cold Start Problem
==================

Scenario: Deploy new app servers (empty L1) + new Redis cluster (empty L2)
  100% cache miss rate --> database overwhelmed

Solution: Cache Warming
  1. Before serving traffic, preload popular keys:
     - Query DB for top 10K most-accessed keys
     - Populate Redis with results
     - Gradually shift traffic to new cluster

  2. Gradual rollout:
     - Route 1% of traffic to new cluster
     - Monitor hit rate and DB load
     - Increase traffic as cache warms up

  3. Shadow mode:
     - New cluster receives all reads (for warming)
     - Results discarded (old cluster still serves)
     - Switch over when hit rate > 90%
\`\`\`

## Monitoring Metrics

\`\`\`
Key Metrics for Cache Health
==============================

1. Hit Rate: hits / (hits + misses)
   Target: > 95% for L2, > 80% for L1
   Alert if: < 90% (L2) or < 70% (L1)

2. Latency: p50, p95, p99 for GET/SET
   Target: < 1ms at p99
   Alert if: > 5ms at p99

3. Memory Usage: used_memory / maxmemory
   Target: < 80%
   Alert if: > 90% (eviction pressure)

4. Eviction Rate: keys evicted per second
   Target: near 0
   Alert if: > 100/sec (cache too small)

5. Connection Count: client connections per node
   Target: < 80% of maxclients
   Alert if: > 90% of maxclients
\`\`\`

## Summary of Techniques

\`\`\`
+---------------------------+-----------------------------------+
| Problem                   | Solution                          |
+---------------------------+-----------------------------------+
| Read latency              | Multi-tier caching (L1 + L2)      |
| Write consistency         | Cache-aside + delete on write     |
| Data distribution         | Consistent hashing / hash slots   |
| Node failure              | Replicas + automatic failover     |
| Hot keys                  | L1 cache + request coalescing     |
| Thundering herd           | Singleflight + leases             |
| Cache invalidation        | TTL + event-driven delete          |
| Cold start                | Cache warming + gradual rollout    |
| Stale data                | TTL + CDC + pub/sub invalidation  |
+---------------------------+-----------------------------------+
\`\`\`

## Key Takeaway

A production distributed cache is more than just Redis in front of a database. It requires multi-tier caching (L1 + L2) for hot key resilience, consistent hashing for even distribution, multiple invalidation strategies for freshness, singleflight for stampede prevention, and careful monitoring for operational health. The architecture balances latency, consistency, and availability to deliver sub-millisecond reads at scale.`,
    },
  ],
};
