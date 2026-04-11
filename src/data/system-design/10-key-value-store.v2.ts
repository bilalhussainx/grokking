import { Module } from "../types";

export const keyValueStoreModule: Module = {
  id: "sd-10",
  title: "Design a Key-Value Store",
  description: "Design a distributed key-value store with high availability, scalability, and tunable consistency using techniques like consistent hashing and LSM trees.",
  lessons: [
    {
      id: "sd-10-01",
      slug: "key-value-store-requirements",
      title: "Requirements & Estimation",
      content: `# Key-Value Store: Requirements & Estimation

## What Is a Key-Value Store?

A key-value store is a non-relational database where data is stored as key-value pairs. Think of it as a giant distributed hash map. Examples include Amazon DynamoDB, Apache Cassandra, and Redis (though Redis is typically in-memory).

Keys are unique identifiers (usually strings), and values can be anything: strings, JSON, binary blobs, etc.

\`\`\`concept
{
  "title": "Key-Value Store as a Distributed Hash Map",
  "variant": "mental-model",
  "content": "Imagine a key-value store as a massive Python dictionary that spans multiple machines. When you call store.put(\\"user:123\\", user_data), the system decides which physical node should own this key based on consistent hashing. When you call store.get(\\"user:123\\"), it knows exactly where to look — even if that node is temporarily down, it can fetch from a replica. The beauty is that this complexity is hidden from you; you just use simple get/put operations while the system handles partitioning, replication, and consistency behind the scenes."
}
\`\`\`

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

\`\`\`quiz
{
  "title": "CAP Theorem Trade-offs",
  "questions": [
    {
      "question": "If you set W=3 and R=1 with N=3 replicas, what CAP property are you prioritizing?",
      "options": ["Consistency", "Availability", "Partition tolerance"],
      "answer": 1,
      "explanation": "With W=3 (write to all replicas) and R=1 (read from any replica), you're prioritizing availability — reads will succeed even if only one replica is available, though writes require all replicas to be up."
    },
    {
      "question": "In a network partition scenario with N=3, which configuration guarantees strong consistency?",
      "options": ["W=1, R=1", "W=2, R=2", "W=3, R=1"],
      "answer": 1,
      "explanation": "W=2, R=2 satisfies W + R > N (2+2>3), ensuring read and write quorums overlap. This guarantees you'll always read the latest write, maintaining strong consistency even during partitions."
    },
    {
      "question": "Why can't we sacrifice partition tolerance in a distributed key-value store?",
      "options": ["Network failures are inevitable", "It would make the system too slow", "Storage would be too expensive", "It would violate ACID properties"],
      "answer": 0,
      "explanation": "Network partitions are a fact of life in distributed systems. Sacrificing partition tolerance would mean the system fails completely when network issues occur, making it unsuitable for production use."
    }
  ]
}
\`\`\`

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

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Key-Value Store Capacity Calculator",
  "inputs": [
    { "id": "keys", "label": "Number of keys (millions)", "default": 100, "min": 1, "max": 1000, "prefix": "" },
    { "id": "value_size", "label": "Average value size", "default": 10, "min": 1, "max": 100, "prefix": "", "suffix": " KB" },
    { "id": "replication", "label": "Replication factor", "default": 3, "min": 1, "max": 5, "prefix": "x" },
    { "id": "nodes", "label": "Number of nodes", "default": 10, "min": 1, "max": 100, "prefix": "" }
  ]
}
\`\`\`

\`\`\`steps
{
  "title": "How to Perform Back-of-the-Envelope Estimation",
  "steps": [
    {
      "title": "Start with data size",
      "content": "Calculate raw data: keys × value_size. For 100M keys × 10 KB = 1 TB. Don't forget key size (50 bytes × 100M = 5 GB) is negligible compared to values."
    },
    {
      "title": "Account for replication",
      "content": "Multiply by replication factor: 1 TB × 3 = 3 TB total cluster storage. This is your primary storage requirement."
    },
    {
      "title": "Add metadata overhead",
      "content": "Each key needs metadata: timestamps, version vectors, hashes. At ~100 bytes per key: 100M × 100 bytes = 10 GB. Usually negligible but good to track."
    },
    {
      "title": "Calculate throughput",
      "content": "Multiply operations per second by data size: 10K writes/sec × 10 KB = 100 MB/sec write throughput. Same for reads: 50K × 10 KB = 500 MB/sec."
    },
    {
      "title": "Distribute across nodes",
      "content": "Divide totals by node count: 3 TB ÷ 10 nodes = 300 GB per node. Include 20% overhead for compactions and growth: 300 GB × 1.2 = 360 GB per node."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A key-value store provides simple get/put/delete operations but must handle complex distributed systems challenges underneath.",
    "The CAP theorem forces a fundamental choice between consistency and availability during network partitions.",
    "Tunable consistency gives callers the flexibility to make this trade-off per operation using quorum mechanics (W + R > N for strong consistency).",
    "Replication multiplies storage needs but is essential for durability and availability.",
    "Horizontal scaling by adding nodes is the primary growth strategy — consistent hashing ensures minimal data movement during scaling."
  ]
}
\`\`\``,
    },
    {
      id: "sd-10-02",
      slug: "key-value-store-high-level-design",
      title: "High-Level Design",
      content: `# Key-Value Store: High-Level Design

## Architecture Overview

\`\`\`sysdiag
{"title": "Distributed KV Store Topology", "width": 720, "height": 320,
 "nodes": [
   {"id": "client", "label": "Client", "x": 80, "y": 160, "kind": "user"},
   {"id": "coord", "label": "Coordinator\\n(any node)", "x": 240, "y": 160, "kind": "service"},
   {"id": "n1", "label": "Partition 1\\nReplica Set", "x": 400, "y": 80, "kind": "storage"},
   {"id": "n2", "label": "Partition 2\\nReplica Set", "x": 400, "y": 160, "kind": "storage"},
   {"id": "n3", "label": "Partition 3\\nReplica Set", "x": 400, "y": 240, "kind": "storage"}
 ],
 "edges": [
   {"from": "client", "to": "coord", "label": "GET/PUT"},
   {"from": "coord", "to": "n1", "label": "replicate W=2"},
   {"from": "coord", "to": "n2", "label": "replicate W=2"},
   {"from": "coord", "to": "n3", "label": "replicate W=2"}
 ],
 "annotations": {
   "coord": "Stateless request router; any node can play this role",
   "n1": "Consistent-hash ring determines which nodes own the key"
 }}
\`\`\`

\`\`\`concept
{"title": "Decentralized Coordination", "variant": "mental-model", "content": "In a well-designed KV store there is no dedicated ‘master’. Every node is equal: any node can accept a client request, compute the key’s position on the hash ring, and act as the coordinator for that request. This eliminates single-points-of-failure and allows horizontal scale-out without reconfiguration."}
\`\`\`

## Consistent Hashing for Partitioning

\`\`\`algoviz
{"title": "Consistent Hash Ring in Action", "type": "array", "data": ["A","B","C","D","E","F","G","H"],
 "frames": [
   {"highlight": [0,1,2], "label": "Virtual nodes V1,V4,V7 map physical node-1 to positions 0,1,2", "stats": {"vnodes":3}},
   {"highlight": [3,4], "label": "Virtual nodes V11,V14 map physical node-2 to positions 3,4", "stats": {"vnodes":2}},
   {"highlight": [5,6,7], "label": "Virtual nodes V19,V22,V25 map physical node-3 to positions 5,6,7", "stats": {"vnodes":3}},
   {"highlight": [1,2,3], "label": "Key hashes to position 2 → clockwise owner is node-2 (pos 3)", "stats": {"key":"user:42","owner":"node-2"}}
 ], "speed": 1000}
\`\`\`

\`\`\`concept
{"title": "Virtual Nodes", "variant": "rule", "content": "One physical server → many virtual positions on the ring. Benefits: (1) Load skew drops toward zero as #virtual-nodes ↑, (2) Heterogeneous hardware supported—give faster machines more virtual slots, (3) When a machine leaves, its key load is spread finely across many survivors instead of dumping onto a single successor."}
\`\`\`

## Replication

\`\`\`steps
{"title": "Replication Walk-Through (N=3)", "steps": [
  {"title": "1. Hash the key", "content": "Coordinator hashes \`user:42\` → position 38 on the 64-slot ring."},
  {"title": "2. Locate primary", "content": "First virtual node clockwise from 38 is V-node A3 (physical node A)."},
  {"title": "3. Pick replicas", "content": "Skip other v-nodes that also map to node A; next two distinct physical nodes are B and C."},
  {"title": "4. Send writes", "content": "Coordinator sends PUT to A, B, C concurrently; waits for W acknowledgements before replying SUCCESS."}
]}
\`\`\`

## Conflict Resolution

\`\`\`tabs
{"tabs": [
  {"label": "Vector Clock", "icon": "🔀", "content": "Each value carries a vector \`[A:2, B:1, C:3]\`. On read, merge all replicas’ vectors:\\n- If one **dominates** (every entry ≥) it wins.\\n- Else, siblings exist → return both to client or apply merge function.\\n**Pros**: never loses concurrent data. **Cons**: bigger metadata, app must resolve."},
  {"label": "Last-Write-Wins", "icon": "⏱️", "content": "Attach server-time timestamp to every write. Highest timestamp wins, others discarded.\\n**Pros**: tiny metadata, deterministic, no client logic. **Cons**: can silently drop concurrent updates; clocks must stay in sync (NTP)."}
]}
\`\`\`

\`\`\`callout
{"type": "warning", "title": "Clock Skew Danger", "content": "LWW assumes perfectly synchronized clocks. Even 1 ms drift in a global cluster can cause the ‘wrong’ write to win. Run NTP in **burst** mode or use GPS/atomic time hardware when you depend on LWW."}
\`\`\`

## Tunable Consistency

\`\`\`quiz
{"title": "Consistency Math Check", "questions": [
  {"question": "N=5, W=3, R=2. Do reads guarantee strong consistency?", "options": ["Yes","No"], "answer": 0, "explanation": "W+R=5 > N=5 → at least one replica in the read quorum participated in the write quorum, so the latest value is visible."},
  {"question": "You want fast writes but still strong consistency. Pick:", "options": ["W=1, R=N","W=N, R=1","W=2, R=2 (N=3)"], "answer": 0, "explanation": "W=1 finishes immediately; requiring R=N guarantees the read contacts every replica, so it will see the newest write."},
  {"question": "Under what condition can you tolerate one entire replica data-center failing?", "options": ["W ≤ N-1","W+R > N","W=N","R=1"], "answer": 0, "explanation": "If W ≤ N-1 the write quorum can still be formed without the failed center; reads similarly need R ≤ N-1."}
]}
\`\`\`

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Eventual (W=1,R=1)", "code": "# client-1\\nPUT k = 10   → success immediately\\n# client-2 (ms later)\\nGET k → may return 10, or old value\\n# no promise of recency"}, "after": {"label": "Strong (W=2,R=2) N=3", "code": "# client-1\\nPUT k = 10   → waits for 2 acks\\n# client-2\\nGET k → waits for 2 responses;\\n        guaranteed to see 10 or newer"}}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Consistent hashing plus virtual nodes yields balanced partitions and minimal data movement during cluster changes.",
  "Replication factor N and quorum counts W, R let you dial the CAP knob per operation: low latency or strong consistency.",
  "Vector clocks detect conflicts exactly; LWW is simple but can drop data—choose based on application tolerance.",
  "Any node can coordinate, so the system remains available even if individual machines or entire racks fail."
]}
\`\`\``,
    },
    {
      id: "sd-10-03",
      slug: "key-value-store-write-read-path",
      title: "Deep Dive: Write Path & Read Path",
      content: `# Key-Value Store: Write Path & Read Path

\`\`\`concept
{"title": "LSM Tree Mental Model", "variant": "mental-model", "content": "Think of an LSM tree like a journalist's notebook and filing cabinet system:\\n\\n1. **Notebook (Memtable)**: Quick notes in chronological order as events happen\\n2. **Carbon copy (WAL)**: Instant duplicate to prevent loss\\n3. **Filing cabinet (SSTables)**: Organized folders sorted by topic, created when notebook fills\\n4. **Archival merge (Compaction)**: Periodically combining old folders to remove duplicates and save space\\n\\nThis system trades immediate organization for write speed, then cleans up later."}
\`\`\`

## The Write Path (LSM Tree)

Most distributed key-value stores use a **Log-Structured Merge Tree (LSM Tree)** for writes. This design converts random writes into sequential writes, which are much faster on both SSDs and HDDs.

\`\`\`steps
{"title": "Write Path Journey", "steps": [{"title": "Step 1: Write-Ahead Log", "content": "Every write is first appended to a sequential log on disk. If the node crashes before the memtable is flushed, the WAL can replay writes to recover data. This ensures **durability** — no acknowledged write is lost."}, {"title": "Step 2: Memtable Insert", "content": "The write is inserted into an in-memory sorted data structure (red-black tree or skip list). This is extremely fast since it's purely in-memory operations with no disk I/O."}, {"title": "Step 3: SSTable Flush", "content": "When the memtable reaches a size threshold (e.g., 64 MB), it becomes immutable and is written to disk as a **Sorted String Table (SSTable)** — a file of key-value pairs sorted by key. This sequential write is very fast."}, {"title": "Step 4: Compaction", "content": "Background process merges multiple SSTables, discarding deleted keys (tombstones) and old versions. This prevents read performance degradation as SSTables accumulate over time."}]}
\`\`\`

\`\`\`algoviz
{"title": "LSM Tree Write Path Visualization", "type": "array", "data": ["WAL", "Memtable", "SSTable-1", "SSTable-2", "SSTable-3"], "frames": [{"highlight": [0], "label": "Write appended to WAL for durability", "stats": {"writes": 1, "disk_ops": 1}}, {"highlight": [1], "label": "Write inserted into memtable", "stats": {"writes": 1, "memory_ops": 1}}, {"highlight": [2], "label": "Memtable full, flushed to SSTable-1", "stats": {"flushes": 1, "disk_writes": 1}}, {"highlight": [3], "label": "More writes create SSTable-2", "stats": {"flushes": 2}}, {"highlight": [2, 3], "label": "Compaction merges SSTable-1 & 2", "stats": {"compactions": 1, "space_saved": "30%"}}], "speed": 1000}
\`\`\`

## The Read Path

Reading is more complex because data may live in multiple places:

1. **Check the memtable** — If the key is in the current memtable, return it immediately. This is the fastest case.
2. **Check SSTables** — Search SSTables from newest to oldest. Since SSTables are sorted, binary search can locate the key efficiently.
3. **Return the first match** — The newest SSTable containing the key has the most recent value.

\`\`\`trace
{"title": "Read Path Example: key='user:123'", "language": "python", "code": "def get(key):\\n    # Check memtable first\\n    if key in memtable:\\n        return memtable[key]\\n    \\n    # Check SSTables from newest to oldest\\n    for sstable in reversed(sstables):\\n        if bloom_filter_might_contain(sstable.bloom_filter, key):\\n            result = binary_search_sstable(sstable, key)\\n            if result:\\n                return result\\n    \\n    return None", "frames": [{"line": 3, "vars": {"key": "user:123"}, "note": "Checking memtable", "stdout": ""}, {"line": 4, "vars": {"key": "user:123", "memtable": {"user:100": "Alice", "user:456": "Bob"}}, "note": "Key not in memtable", "stdout": ""}, {"line": 7, "vars": {"sstables": ["sstable-3", "sstable-2", "sstable-1"]}, "note": "Starting SSTable search", "stdout": ""}, {"line": 8, "vars": {"sstable": "sstable-3"}, "note": "Checking bloom filter for sstable-3", "stdout": ""}, {"line": 9, "vars": {"result": "user:123 -> Charlie"}, "note": "Found in sstable-3!", "stdout": ""}, {"line": 10, "vars": {"result": "user:123 -> Charlie"}, "note": "Returning result", "stdout": "Charlie"}], "speed": 800}
\`\`\`

### Bloom Filters for Read Optimization

Without optimization, a read miss requires checking every SSTable — potentially dozens of files. A **Bloom filter** is a space-efficient probabilistic data structure that can tell you:
- **Definitely not in this SSTable** — Skip it (no disk I/O needed).
- **Possibly in this SSTable** — Check it (small chance of false positive).

Each SSTable has its own Bloom filter loaded in memory. This eliminates most unnecessary disk reads, dramatically improving read latency for keys that do not exist in older SSTables.

\`\`\`quiz
{"title": "Bloom Filter Knowledge Check", "questions": [{"question": "What does a Bloom filter tell you when it says a key is NOT in an SSTable?", "options": ["The key might be there", "The key is definitely not there", "The key was deleted", "The SSTable is corrupted"], "answer": 1, "explanation": "Bloom filters have no false negatives — if it says 'not in set', the key is definitely absent."}, {"question": "Why do we check SSTables from newest to oldest during reads?", "options": ["Newer SSTables are smaller", "Newer data has the most recent values", "Older SSTables might be corrupted", "It's faster to read newer files"], "answer": 1, "explanation": "In LSM trees, newer writes override older ones. The first match found (newest) contains the current value."}, {"question": "What happens during compaction with tombstone markers?", "options": ["They are preserved forever", "They are removed along with the deleted data", "They are moved to a special file", "They become regular keys"], "answer": 1, "explanation": "Compaction merges SSTables and permanently removes both tombstones and the data they mark for deletion."}]}
\`\`\`

## Handling Deletes

LSM trees do not delete data in place. Instead, a **tombstone** marker is written for the key. During compaction, when the tombstone and the original value are merged, the key is permanently removed. Until compaction, the tombstone prevents the old value from being returned on reads.

\`\`\`compare
{"variant": "good-bad", "before": {"label": "In-Place Delete (Bad)", "code": "# Traditional B-tree approach\\n# Requires finding and modifying existing data\\nseek_to_key_position()\\noverwrite_with_delete_marker()\\n# Problem: Random disk I/O, fragmentation"}, "after": {"label": "LSM Tombstone (Good)", "code": "# LSM tree approach\\n# Simply append a tombstone\\nappend_to_wal(\\"DELETE user:123\\")\\ninsert_to_memtable(\\"user:123\\", TOMBSTONE)\\n# Benefits: Sequential write, no random I/O"}}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["The LSM tree converts random writes into sequential writes, achieving very high write throughput", "The WAL ensures durability — no acknowledged write is lost even if the node crashes", "SSTables are immutable sorted files on disk, making them simple and efficient to read with binary search", "Bloom filters are critical for read performance, eliminating unnecessary disk I/O for most lookups", "Compaction is essential maintenance — without it, read performance degrades as SSTables accumulate"]}
\`\`\``,
    },
    {
      id: "sd-10-04",
      slug: "key-value-store-scaling",
      title: "Scaling & Trade-offs",
      content: `# Key-Value Store: Scaling & Trade-offs

\`\`\`concept
{"title": "Gossip Protocol", "variant": "mental-model", "content": "Gossip protocol is like office rumor spreading: one person tells a few colleagues, they tell others, and soon everyone knows. In distributed systems, nodes periodically exchange health information with random peers, creating robust failure detection without a central coordinator."}
\`\`\`

## Failure Detection: Gossip Protocol

In a decentralized system with no master node, how does each node know which other nodes are alive? The **gossip protocol** spreads health information through the cluster:

1. Each node maintains a list of all nodes with a **heartbeat counter** and **timestamp**.
2. Periodically (e.g., every second), each node picks a random peer and sends its membership list.
3. The peer merges the received list with its own, keeping the higher heartbeat counter for each node.
4. If a node's heartbeat has not increased for a threshold period (e.g., 30 seconds), it is marked as suspected down.

Gossip is robust because it has no single point of failure and information eventually reaches all nodes, even in large clusters.

\`\`\`algoviz
{"title": "Gossip Protocol in Action", "type": "array", "data": ["Node A: ❤️3", "Node B: ❤️2", "Node C: ❤️4", "Node D: ❤️1", "Node E: ❤️3"], "frames": [{"highlight": [0], "label": "Node A selects random peer (Node C)", "stats": {"round": 1}}, {"highlight": [0, 2], "label": "A shares its view: [A:3, B:2, C:4, D:1, E:3]", "stats": {"round": 2}}, {"highlight": [2], "label": "C updates: keeps max heartbeats for each node", "stats": {"round": 3}}, {"highlight": [2], "label": "C's updated view: [A:3, B:2, C:4, D:1, E:3]", "stats": {"round": 4}}], "speed": 1200}
\`\`\`

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

\`\`\`trace
{"title": "Hinted Handoff Flow", "language": "python", "code": "# Coordinator handling write with Node B down\\ndef handle_write(key, value, replicas):\\n    successful_writes = 0\\n    hints_created = []\\n    \\n    for node in replicas:\\n        if is_node_alive(node):\\n            write_to_node(node, key, value)\\n            successful_writes += 1\\n        else:\\n            # Create hinted handoff\\n            hint_node = pick_random_alive_node()\\n            write_with_hint(hint_node, key, value, intended_for=node)\\n            hints_created.append((hint_node, node))\\n            successful_writes += 1\\n    \\n    return successful_writes, hints_created\\n\\n# Node D receiving hinted data\\ndef receive_hinted_data(hint_data):\\n    store_temporarily(hint_data)\\n    schedule_forward_when_node_returns(hint_data.intended_for)\\n\\n# When Node B returns\\ndef node_b_came_back():\\n    hinted_data = get_all_hints_for('Node B')\\n    for hint in hinted_data:\\n        forward_to_node(hint.data, 'Node B')\\n        delete_temp_copy(hint)", "frames": [{"line": 1, "vars": {"key": "user:123", "value": "{\\"name\\":\\"Alice\\"}", "replicas": ["Node A", "Node B", "Node C"]}, "note": "Write request arrives", "stdout": ""}, {"line": 5, "vars": {"key": "user:123", "value": "{\\"name\\":\\"Alice\\"}", "replicas": ["Node A", "Node B", "Node C"], "successful_writes": 0}, "note": "Checking Node A - alive", "stdout": "Node A: WRITE SUCCESS"}, {"line": 5, "vars": {"key": "user:123", "value": "{\\"name\\":\\"Alice\\"}", "replicas": ["Node A", "Node B", "Node C"], "successful_writes": 1}, "note": "Node B is DOWN - creating hint", "stdout": "Node A: WRITE SUCCESS\\nNode B: NODE DOWN"}, {"line": 10, "vars": {"key": "user:123", "value": "{\\"name\\":\\"Alice\\"}", "replicas": ["Node A", "Node B", "Node C"], "successful_writes": 1, "hint_node": "Node D"}, "note": "Writing hint to Node D", "stdout": "Node A: WRITE SUCCESS\\nNode B: NODE DOWN\\nNode D: HINT CREATED for Node B"}, {"line": 5, "vars": {"key": "user:123", "value": "{\\"name\\":\\"Alice\\"}", "replicas": ["Node A", "Node B", "Node C"], "successful_writes": 2}, "note": "Node C is alive", "stdout": "Node A: WRITE SUCCESS\\nNode B: NODE DOWN\\nNode D: HINT CREATED for Node B\\nNode C: WRITE SUCCESS"}], "speed": 1000}
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

\`\`\`compare
{"variant": "before-after", "before": {"label": "Naive Sync", "code": "# Compare every single key-value pair\\ndef sync_replicas_naive(replica_a, replica_b):\\n    differences = []\\n    for key in replica_a.all_keys():\\n        if replica_a.get(key) != replica_b.get(key):\\n            differences.append(key)\\n    return differences\\n\\n# O(n) network calls, O(n) data transfer\\n# For 1M keys: 1M comparisons, transfer all differing data"}, "after": {"label": "Merkle Tree Sync", "code": "# Compare only differing branches\\ndef sync_replicas_merkle(replica_a, replica_b):\\n    if replica_a.root_hash == replica_b.root_hash:\\n        return []  # Identical!\\n    \\n    differences = []\\n    check_branches(replica_a, replica_b, root_node)\\n    return differences\\n\\n# O(log n) comparisons, O(differences) transfer\\n# For 1M keys: ~20 comparisons, transfer only ~100 differing entries"}}
\`\`\`

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| Consistency vs Availability | CP: reject writes during partition | AP: accept writes, resolve conflicts later |
| LSM Tree vs B-Tree | High write throughput, higher read cost | Balanced read/write, higher write cost |
| Vector Clocks vs LWW | No data loss, complex resolution | Simple, may lose concurrent writes |
| Gossip vs Centralized | No SPOF, eventual convergence | Faster detection, single point of failure |

\`\`\`quiz
{"title": "Scaling Trade-offs Quiz", "questions": [{"question": "Why is gossip protocol preferred over centralized failure detection in large distributed systems?", "options": ["It's faster to detect failures", "It has no single point of failure", "It uses less network bandwidth", "It's simpler to implement"], "answer": 1, "explanation": "Gossip protocol eliminates the single point of failure risk present in centralized detection systems, making it more robust for large distributed deployments."}, {"question": "What happens to hinted handoff data when the failed node returns?", "options": ["It's permanently stored on the hint node", "It's forwarded to the original node and deleted", "It's merged with the coordinator's data", "It's discarded immediately"], "answer": 1, "explanation": "When the failed node returns, the hint node forwards the temporary data to the original node and then deletes its copy, maintaining data consistency."}, {"question": "How do Merkle trees improve replica synchronization efficiency?", "options": ["By compressing the data", "By comparing only differing branches", "By caching previous comparisons", "By using faster hash algorithms"], "answer": 1, "explanation": "Merkle trees enable efficient synchronization by recursively comparing only the branches with differing hashes, avoiding full dataset comparisons."}, {"question": "According to CAP theorem, what must a system sacrifice during a network partition?", "options": ["Partition tolerance", "Consistency or availability", "Both consistency and availability", "Neither - modern systems can achieve all three"], "answer": 1, "explanation": "CAP theorem states that during a network partition, a distributed system must choose between consistency (all nodes see same data) or availability (system remains responsive)."}]}
\`\`\`

## Putting It All Together

A production key-value store combines all these techniques:

- **Consistent hashing** for partitioning
- **Replication** with tunable N/W/R for consistency
- **LSM trees** for the storage engine
- **Gossip protocol** for failure detection
- **Hinted handoff** for temporary failure handling
- **Merkle trees** for anti-entropy repair
- **Vector clocks** or **LWW** for conflict resolution

\`\`\`sysdiag
{"title": "Production Key-Value Store Architecture", "width": 800, "height": 400, "nodes": [{"id": "client", "label": "Client", "x": 100, "y": 200, "kind": "user"}, {"id": "coord", "label": "Coordinator", "x": 250, "y": 200, "kind": "service"}, {"id": "nodeA", "label": "Node A\\n(Replica)", "x": 400, "y": 100, "kind": "database"}, {"id": "nodeB", "label": "Node B\\n(Replica)", "x": 400, "y": 200, "kind": "database"}, {"id": "nodeC", "label": "Node C\\n(Replica)", "x": 400, "y": 300, "kind": "database"}, {"id": "lsm", "label": "LSM Tree\\nStorage", "x": 550, "y": 200, "kind": "storage"}, {"id": "gossip", "label": "Gossip\\nProtocol", "x": 400, "y": 350, "kind": "service"}, {"id": "merkle", "label": "Merkle Tree\\nSync", "x": 550, "y": 350, "kind": "service"}], "edges": [{"from": "client", "to": "coord", "label": "read/write"}, {"from": "coord", "to": "nodeA", "label": "replicate"}, {"from": "coord", "to": "nodeB", "label": "replicate"}, {"from": "coord", "to": "nodeC", "label": "replicate"}, {"from": "nodeB", "to": "lsm", "label": "persist"}, {"from": "nodeA", "to": "gossip", "label": "heartbeat"}, {"from": "nodeB", "to": "gossip", "label": "heartbeat"}, {"from": "nodeC", "to": "gossip", "label": "heartbeat"}, {"from": "nodeA", "to": "merkle", "label": "sync"}, {"from": "nodeB", "to": "merkle", "label": "sync"}, {"from": "nodeC", "to": "merkle", "label": "sync"}], "annotations": {"coord": "Routes requests using consistent hashing", "gossip": "Decentralized failure detection", "merkle": "Efficient replica synchronization", "lsm": "High-throughput write optimization"}}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["The gossip protocol enables decentralized failure detection with no single point of failure.", "Hinted handoff maintains write availability during temporary node failures without data reassignment.", "Merkle trees allow efficient replica synchronization by comparing only the data ranges that differ.", "Every design choice in a distributed key-value store is a trade-off between consistency, availability, performance, and complexity.", "These techniques are not theoretical — they are used in production systems like Cassandra, DynamoDB, and Riak."]}
\`\`\``,
    },
  ],
};
