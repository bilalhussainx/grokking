import { Module } from "../types";

export const gfsModule: Module = {
  id: "design-gfs",
  title: "Designing Google File System (GFS)",
  description: "Explore the Google File System architecture: master-chunk design, chunk placement and replication, write and read flows, and fault tolerance mechanisms.",
  lessons: [
    {
      id: "gfs-requirements",
      slug: "gfs-requirements",
      title: "GFS: Requirements & Motivation",
      content: `# GFS: Requirements & Motivation

The Google File System (GFS, published 2003) was designed to store the massive datasets powering Google's search index, MapReduce jobs, and other internal services. It was one of the first systems to prove that **reliable, high-throughput storage** could be built from thousands of unreliable commodity machines — a foundational insight that shaped distributed systems for decades.

\`\`\`concept
{ "title": "The Foundational Shift", "variant": "mental-model", "content": "GFS treats hardware failure as a **first-class design constraint**, not an edge case. Instead of asking 'How do we prevent failures?', it asks 'How do we keep working when everything inevitably breaks?' This inversion of the question changes every architectural decision that follows." }
\`\`\`

## The Problem

Google needed a file system that could handle a scale no existing system was designed for:

- Store **petabytes** of data across thousands of commodity machines
- Handle files that are typically **hundreds of MB to multi-GB** — not millions of small files
- Optimize for **append-heavy** workloads: crawl data, log files, MapReduce output
- Tolerate frequent hardware failures as a **normal operating condition**, not an exception

\`\`\`callout
{ "type": "info", "title": "Why Not Use an Existing File System?", "content": "Traditional file systems like NFS were built for different assumptions: smaller files, occasional failures, strong POSIX consistency, and random read/write patterns. At Google's scale, these assumptions collapsed. Rather than fight the constraints, the GFS team co-designed the file system with its applications to embrace a new set of trade-offs." }
\`\`\`

## Requirements

\`\`\`tabs
{ "tabs": [
  { "label": "Functional", "icon": "⚙️", "content": "1. **Create** and **delete** files in a hierarchical namespace\\n2. **Read** data from files (typically large, sequential reads)\\n3. **Append** data to files (the dominant write pattern)\\n4. **Random write** — supported but not performance-optimized\\n5. **Snapshot** a file or directory tree at near-instant cost" },
  { "label": "Non-Functional", "icon": "📊", "content": "| Requirement | Target |\\n|-------------|--------|\\n| Storage capacity | Petabytes across 1,000+ machines |\\n| File size | Typical: 100 MB – multi-GB |\\n| Throughput | High sustained bandwidth > low latency |\\n| Availability | Survive component failures continuously |\\n| Consistency | Relaxed: defined-but-not-POSIX model |\\n| Chunk size | 64 MB (much larger than traditional block sizes) |\\n| Fault tolerance | Hardware fails regularly — design around it |" },
  { "label": "What GFS Does NOT Target", "icon": "🚫", "content": "- **Millions of small files** — metadata overhead would overwhelm the single master\\n- **Low-latency random access** — throughput is the priority\\n- **Full POSIX compliance** — applications were co-designed to accept relaxed semantics\\n- **General-purpose use** — it is purpose-built for Google's internal workloads" }
] }
\`\`\`

## Design Assumptions

These four assumptions shaped every architectural decision in GFS. Understanding them is the key to understanding why GFS looks the way it does.

\`\`\`steps
{ "title": "Core Design Assumptions", "steps": [
  { "title": "Component failures are the NORM", "content": "With thousands of commodity machines, something is always broken. Disks fail, NICs flake, machines restart unexpectedly — this is business as usual, not an emergency. GFS was designed from day one to detect, tolerate, and recover from failures automatically." },
  { "title": "Files are LARGE", "content": "Multi-GB files are common. The system is optimized for large sequential files, not millions of tiny files. This drives the 64 MB chunk size, the in-memory metadata design on the master, and the preference for persistent TCP connections to chunkservers." },
  { "title": "Workloads are append-heavy", "content": "Files are typically written once (by an append-heavy producer) then read many times. Random writes are rare. **Concurrent appends** by multiple clients are very common — for example, multiple web crawlers writing to a shared log. GFS provides atomic record append to handle this safely." },
  { "title": "Co-design applications and file system", "content": "Google had the luxury of building their applications to match the file system's model. Applications tolerate relaxed consistency. Atomicity of appends matters more than strict POSIX semantics. This enables simpler, more efficient protocols that would be unacceptable in a general-purpose OS." }
] }
\`\`\`

## Architecture Preview

Before diving into each component, here is the high-level picture: a **single master** holds all metadata, while actual data flows directly between clients and chunk servers — keeping the master out of the hot path.

\`\`\`sysdiag
{ "title": "GFS Master-Chunk Architecture", "width": 620, "height": 380, "nodes": [ { "id": "master", "label": "GFS Master", "x": 310, "y": 60, "kind": "service" }, { "id": "client", "label": "GFS Client", "x": 80, "y": 200, "kind": "user" }, { "id": "cs1", "label": "Chunk\\nServer 1", "x": 220, "y": 310, "kind": "storage" }, { "id": "cs2", "label": "Chunk\\nServer 2", "x": 340, "y": 310, "kind": "storage" }, { "id": "cs3", "label": "Chunk\\nServer 3", "x": 460, "y": 310, "kind": "storage" } ], "edges": [ { "from": "client", "to": "master", "label": "① metadata request" }, { "from": "master", "to": "client", "label": "② chunk locations" }, { "from": "client", "to": "cs1", "label": "③ data transfer" }, { "from": "client", "to": "cs2", "label": "③ data transfer" }, { "from": "client", "to": "cs3", "label": "③ data transfer" } ], "annotations": { "master": "Holds all metadata: namespace, file→chunk mapping, chunk→server locations. Keeps metadata in RAM for speed. Communicates with chunkservers via periodic HeartBeat messages.", "client": "Step 1: asks master for chunk locations and caches the response. Step 2: communicates directly with chunkservers for all data transfers — master is bypassed entirely.", "cs1": "Stores actual chunk data as plain Linux files. Each 64 MB chunk identified by a globally unique 64-bit handle. Replicated across 3+ servers (by default) for fault tolerance." } }
\`\`\`

\`\`\`callout
{ "type": "success", "title": "Why Separating Metadata from Data Matters", "content": "The master handles **only** metadata operations. All read/write data flows directly between clients and chunkservers. Clients cache chunk locations after the first lookup, so the master's involvement is minimal per operation. This single design decision prevents the master from becoming a throughput bottleneck even at petabyte scale." }
\`\`\`

## GFS vs. Traditional File Systems

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Traditional File Systems (NFS)", "code": "Architecture:  single machine\\nFile sizes:    KB to MB\\nFailures:      rare, treated as exceptions\\nWrite pattern: random + sequential\\nConsistency:   strong POSIX semantics\\nBlock size:    4 KB – 64 KB\\nMetadata:      distributed or disk-backed\\nOptimized for: general-purpose workloads" }, "after": { "label": "Google File System (GFS)", "code": "Architecture:  single master + 1000s of chunkservers\\nFile sizes:    MB to multi-GB\\nFailures:      constant, treated as the norm\\nWrite pattern: mostly sequential append\\nConsistency:   relaxed (defined, not POSIX)\\nChunk size:    64 MB\\nMetadata:      single master, entirely in RAM\\nOptimized for: high-throughput append workloads" } }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Why 64 MB Chunks?", "content": "The 64 MB chunk size is far larger than the 4–64 KB blocks in traditional file systems. This was a deliberate trade-off:\\n\\n**Advantages:**\\n- Clients need far fewer interactions with the master (one metadata round-trip serves a large sequential read)\\n- Clients can maintain persistent TCP connections to chunkservers, reducing connection overhead\\n- The master's metadata footprint stays small enough to fit entirely in RAM\\n\\n**Disadvantages:**\\n- Small files may occupy only part of a chunk, wasting space\\n- 'Hot spots' can form if many clients access the same small file simultaneously (the few chunkservers holding that chunk get hammered)\\n\\nIn practice, GFS workloads were dominated by large files, so the advantages far outweighed the disadvantages." }
\`\`\`

\`\`\`quiz
{ "title": "GFS Requirements Check", "questions": [ { "question": "Which workload pattern did GFS specifically optimize for?", "options": ["Random writes to arbitrary offsets", "Small random reads under 4 KB", "Large sequential appends by multiple concurrent clients", "Frequent in-place file updates"], "answer": 2, "explanation": "GFS was designed for append-heavy workloads where files are written once (typically by log producers or MapReduce jobs) and read many times. Concurrent appends from multiple clients were so common that GFS added atomic record append as a first-class primitive." }, { "question": "Why does GFS use a single master instead of distributed metadata servers?", "options": ["To reduce hardware costs", "To enable global knowledge for sophisticated chunk placement and replication decisions", "To comply with POSIX semantics", "Because distributed metadata was too slow in 2003"], "answer": 1, "explanation": "According to the original GFS paper (Section 2.4): 'Having a single master vastly simplifies our design and enables the master to make sophisticated chunk placement and replication decisions using global knowledge.' The potential bottleneck is mitigated by keeping the master out of the data path." }, { "question": "What is the default chunk size in GFS?", "options": ["4 KB", "1 MB", "16 MB", "64 MB"], "answer": 3, "explanation": "GFS uses 64 MB chunks — dramatically larger than traditional file system block sizes. This reduces how often clients need to contact the master, allows persistent chunkserver connections, and keeps the master's entire metadata set in RAM." }, { "question": "Which of the following is NOT a functional requirement of GFS?", "options": ["Append data to files", "Snapshot a file or directory tree", "Sub-millisecond random read latency", "Create and delete files"], "answer": 2, "explanation": "GFS explicitly prioritizes high sustained throughput over low latency. Sub-millisecond latency was not a design goal. The system is optimized for large sequential reads and appends, not interactive low-latency workloads." } ] }
\`\`\`

## Key Takeaway

GFS was not trying to be a better NFS. It was purpose-built for a specific, well-understood set of workloads — and it made deliberate trade-offs that would be unacceptable in a general-purpose system. The lessons it established (separate metadata from data, treat failures as normal, co-design system and application) became the foundation for HDFS, Amazon S3, and most large-scale storage systems that followed.

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "GFS treats hardware failure as normal operating condition — fault tolerance is built in, not bolted on", "Large 64 MB chunks reduce master interaction, enable persistent connections, and keep metadata in RAM", "Separating metadata (master) from data (chunkservers) prevents the master from becoming a throughput bottleneck", "A single master simplifies design and enables global chunk placement decisions — mitigated by keeping it off the data path", "Relaxed (non-POSIX) consistency was a deliberate trade-off enabling higher throughput for append-heavy workloads", "Co-designing the file system with its applications was only possible because Google controlled both layers" ] }
\`\`\``,
    },
    {
      id: "gfs-master-chunk",
      slug: "gfs-master-chunk-architecture",
      title: "Master-Chunk Architecture",
      content: `# Master-Chunk Architecture

GFS makes one defining architectural choice: **one master for all metadata, many chunkservers for all data**. Everything else in the system flows from this decision.

\`\`\`concept
{
  "title": "The Master-Chunk Split",
  "variant": "mental-model",
  "content": "Think of the master as a librarian who knows where every book is shelved, but never touches the books themselves. The chunkservers are the shelves — many, distributed, holding the actual content. Clients ask the librarian once for a book's location, then go directly to the shelf for all subsequent access. The librarian's desk never becomes a bottleneck because she handles only index cards, not books."
}
\`\`\`

## The Master

The master stores three types of metadata, each with different durability requirements:

\`\`\`sysdiag
{
  "title": "Master Metadata Components",
  "width": 640,
  "height": 320,
  "nodes": [
    { "id": "ns",   "label": "File Namespace\\n/all/data/crawl/2024.dat", "x": 120, "y": 90,  "kind": "storage" },
    { "id": "map",  "label": "File→Chunk Map\\nfile → [c1, c2, c3]",      "x": 320, "y": 90,  "kind": "storage" },
    { "id": "loc",  "label": "Chunk→Server Map\\nc1 → [A,B,C]\\n(ephemeral)", "x": 520, "y": 90,  "kind": "storage" },
    { "id": "log",  "label": "Operation Log\\n(write-ahead)",              "x": 200, "y": 230, "kind": "service"  },
    { "id": "ckpt", "label": "Checkpoint\\n(B-tree snapshot)",             "x": 420, "y": 230, "kind": "storage"  }
  ],
  "edges": [
    { "from": "log",  "to": "ns",   "label": "persists" },
    { "from": "log",  "to": "map",  "label": "persists" },
    { "from": "log",  "to": "ckpt", "label": "compact →" }
  ],
  "annotations": {
    "ns":   "Hierarchical directory tree — persisted in operation log and checkpoints",
    "map":  "Which chunks belong to each file — persisted in operation log and checkpoints",
    "loc":  "Which servers hold each chunk — NOT persisted; rebuilt from heartbeats on startup",
    "log":  "Append-only WAL. Every metadata mutation is logged before being applied.",
    "ckpt": "Periodic B-tree snapshot compacting the log to speed recovery"
  }
}
\`\`\`

### What Is Persisted vs. Rebuilt

| Metadata | Persisted? | How? |
|----------|-----------|------|
| Namespace (file/directory tree) | Yes | Operation log + checkpoints |
| File-to-chunk mapping | Yes | Operation log + checkpoints |
| Chunk-to-server mapping | **No** | Rebuilt from chunkserver heartbeats on startup |

The master does **not** persist chunk locations. Chunkservers are the source of truth for what they actually hold — on master restart, every chunkserver reports its chunks in a heartbeat, and the master reconstructs the full location map in seconds. This avoids a painful consistency problem: if the master persisted locations, a disk swap or server migration would require coordinating two authorities.

### Operation Log

Every metadata mutation — create file, delete file, add chunk — is written to the operation log **before** being applied. The log and its checkpoints are also replicated to multiple machines; an operation is not considered successful until the log entry is replicated.

\`\`\`trace
{
  "title": "Master Recovery via Checkpoint + Log Replay",
  "language": "python",
  "code": "# Simulated master restart recovery\\ncheckpoint_ops = 1000  # last checkpoint covered ops 1-1000\\nlog_entries = [\\n    \\"[op 1001] CREATE /data/crawl/2024-03-01.dat\\",\\n    \\"[op 1002] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1001\\",\\n    \\"[op 1003] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1002\\",\\n    \\"[op 1004] DELETE /tmp/scratch-file.dat\\"\\n]\\n\\nprint(\\"1. Load checkpoint (ops 1-1000)\\")\\nprint(\\"2. Replay log entries after checkpoint:\\")\\nfor entry in log_entries:\\n    print(f\\"   {entry}\\")\\nprint(\\"3. Master state consistent, ready to serve\\")",
  "frames": [
    { "line": 1, "vars": { "checkpoint_ops": 1000 }, "note": "Checkpoint captures in-memory state after 1000 ops — a B-tree snapshot.", "stdout": "" },
    { "line": 6, "vars": { "checkpoint_ops": 1000 }, "note": "Load checkpoint into memory first. This is fast — it is a direct memory image.", "stdout": "1. Load checkpoint (ops 1-1000)" },
    { "line": 7, "vars": { "checkpoint_ops": 1000 }, "note": "Now replay only the log entries that occurred after the checkpoint.", "stdout": "2. Replay log entries after checkpoint:" },
    { "line": 9, "vars": { "checkpoint_ops": 1000 }, "note": "Each entry is re-applied to in-memory state in order. Idempotent by design.", "stdout": "   [op 1001] CREATE /data/crawl/2024-03-01.dat\\n   [op 1002] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1001\\n   [op 1003] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1002\\n   [op 1004] DELETE /tmp/scratch-file.dat" },
    { "line": 10, "vars": { "checkpoint_ops": 1000 }, "note": "Recovery complete. Chunk servers will now heartbeat in and rebuild location map.", "stdout": "3. Master state consistent, ready to serve" }
  ],
  "speed": 600
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "Why not just checkpoint more often?",
  "content": "Checkpointing is expensive — it involves serializing all in-memory state to disk. GFS checkpoints in a separate thread so the master keeps serving requests. The checkpoint uses a B-tree format so it can be loaded directly into memory without parsing. Frequent small checkpoints would waste I/O; the log handles the durability gap between checkpoints."
}
\`\`\`

## Chunk Servers

Chunkservers store **chunks** — fixed-size pieces of files (default: 64 MB). Each chunk is identified by a globally unique 64-bit **chunk handle** assigned at creation time. Chunks are stored as ordinary Linux files on the chunkserver's local disk.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Storage Layout",
      "icon": "🗄️",
      "content": "\`\`\`\\nChunk Server A\\n==============\\nDisk:\\n  /gfs-data/chunk_c_1001  (64 MB)\\n  /gfs-data/chunk_c_1002  (64 MB)\\n  /gfs-data/chunk_c_2005  (64 MB)\\n  ...\\n\\nEach chunk:\\n  - Stored as a plain Linux file\\n  - Identified by 64-bit chunk handle\\n  - Has a checksum per 64 KB block (integrity)\\n  - Replicated to 2 other chunkservers (3 total)\\n\`\`\`"
    },
    {
      "label": "Heartbeat Protocol",
      "icon": "💓",
      "content": "Chunkservers send **periodic heartbeats** to the master. The master uses these to:\\n\\n- Detect server failures (no heartbeat = assumed dead)\\n- Learn which chunks a server holds (used to rebuild location map on restart)\\n- Detect disk failures and chunk corruption\\n- Issue instructions: delete chunks, create new replicas, rebalance load\\n\\nThe master never polls chunkservers directly — it always waits for the next heartbeat window."
    },
    {
      "label": "Chunk Integrity",
      "icon": "🔒",
      "content": "Each 64 KB block within a chunk has a stored **checksum**. On every read, the chunkserver verifies the checksum before returning data.\\n\\n- If a block is corrupt: chunkserver reports to master, master schedules re-replication from a healthy replica\\n- Checksums are stored separately from data so a disk failure corrupting the data block doesn't also corrupt the checksum\\n- Write path: new checksum computed and stored when block is written"
    }
  ]
}
\`\`\`

## Why 64 MB Chunks?

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Small Chunks (4 KB — Linux default block size)",
    "code": "File: 1 GB movie file\\nChunks: 262,144 chunks\\nMaster metadata: 262k entries\\nMemory per file: ~16 MB\\nClient reads: 1,000+ master RPCs\\nNetwork: thousands of small transfers\\nHot spot risk: low (load spread)"
  },
  "after": {
    "label": "Large Chunks (64 MB — GFS default)",
    "code": "File: 1 GB movie file\\nChunks: 16 chunks\\nMaster metadata: 16 entries\\nMemory per file: ~1 KB\\nClient reads: 1 master RPC, then cached\\nNetwork: 16 large sequential transfers\\nHot spot risk: higher (many clients → same chunk)"
  }
}
\`\`\`

**64 MB is the sweet spot for GFS's workload**: large sequential reads and writes dominate, files are huge, and minimizing master interaction is critical. The trade-off is hot-spot risk — if many clients simultaneously access the same small file, all requests converge on one chunk. GFS accepts this because its workloads (web crawls, MapReduce jobs) rarely exhibit that pattern.

\`\`\`callout
{
  "type": "warning",
  "title": "The Hot-Spot Trade-off",
  "content": "Large chunks reduce metadata overhead dramatically but create a hot-spot vulnerability. GFS mitigates this by increasing the replication factor for popular chunks and by having clients stagger their start times. For workloads with many small random reads (unlike GFS's batch workloads), smaller chunks would be preferable."
}
\`\`\`

## Master Scalability

A single master is a potential bottleneck. GFS uses four techniques to prevent it from becoming one:

\`\`\`steps
{
  "title": "Master Bottleneck Mitigation",
  "steps": [
    {
      "title": "1. All Metadata Fits in RAM",
      "content": "The master stores all metadata in memory — roughly **64 bytes per chunk**. For a filesystem with hundreds of millions of chunks, this fits on a modern server. All metadata operations run at memory speed with no disk seeks."
    },
    {
      "title": "2. Client Caching of Chunk Locations",
      "content": "After the first lookup, clients cache chunk handle → server location mappings locally. Subsequent reads and writes go **directly to chunkservers**, bypassing the master entirely. For sequential workloads, cache hit rates exceed 99%."
    },
    {
      "title": "3. Data Never Flows Through the Master",
      "content": "The master handles only metadata (~KB per request). All file data flows client ↔ chunkserver (~MB per request). A 10 Gbps data path doesn't consume a single CPU cycle on the master."
    },
    {
      "title": "4. Chunk-Location Prefetching",
      "content": "When a client reads chunk N, it also requests locations for chunks N+1, N+2, … in the same RPC. This amortizes master round-trips across many chunks, reducing master QPS by 5–10× for sequential read workloads."
    }
  ]
}
\`\`\`

## Shadow Masters

For read availability, GFS operates **shadow masters** that trail the primary master's operation log. If the primary fails, clients can still look up file metadata and chunk locations — they just cannot create or delete files until the primary recovers.

| | Primary Master | Shadow Master |
|---|---|---|
| Handles writes | Yes | No |
| Serves metadata reads | Yes | Yes (slightly stale) |
| Replicates operation log | Source | Follower |
| Auto-promotes on failure | — | No (manual failover) |

\`\`\`callout
{
  "type": "info",
  "title": "Shadow vs. Replica Master",
  "content": "Shadow masters are **read-only followers**, not hot standbys. They lag slightly behind the primary because they replay the operation log asynchronously. GFS chose this design because most failures are transient (network partition, process crash) and a fast-restarting primary is simpler than automated leader election. The master can restore state in seconds because all metadata is in RAM — just load the checkpoint and replay the log."
}
\`\`\`

\`\`\`quiz
{
  "title": "Master-Chunk Architecture Quiz",
  "questions": [
    {
      "question": "Which metadata does the GFS master NOT persist to disk?",
      "options": [
        "File namespace (directory tree)",
        "File-to-chunk mapping",
        "Chunk-to-server location mapping",
        "Operation log entries"
      ],
      "answer": 2,
      "explanation": "Chunk-to-server location mapping is ephemeral. Chunkservers are the source of truth for what they store. On restart, the master rebuilds the full location map from chunkserver heartbeats. Persisting it would introduce a two-authority consistency problem."
    },
    {
      "question": "Why does GFS use 64 MB chunks instead of 4 KB blocks?",
      "options": [
        "Better disk space utilization for small files",
        "Faster random write performance",
        "Reduced master metadata overhead and fewer client-master RPCs",
        "Stronger consistency guarantees for concurrent writes"
      ],
      "answer": 2,
      "explanation": "64 MB chunks reduce the metadata entry count per file from hundreds of thousands to tens, keeping the entire namespace in RAM. They also let clients cache chunk locations after a single master RPC and perform large sequential transfers — matching GFS's batch-processing workload."
    },
    {
      "question": "A GFS master restarts after a crash. In what order does it restore its state?",
      "options": [
        "Replay entire operation log from scratch",
        "Wait for all chunkservers to heartbeat in, then rebuild everything",
        "Load latest checkpoint, then replay only subsequent log entries",
        "Load latest checkpoint; chunk locations are already embedded in it"
      ],
      "answer": 2,
      "explanation": "Recovery is: (1) load the latest B-tree checkpoint into memory, (2) replay only the operation log entries recorded after that checkpoint. Chunk locations are rebuilt separately from chunkserver heartbeats, not from the checkpoint."
    },
    {
      "question": "Which statement best describes shadow masters in GFS?",
      "options": [
        "They handle write operations when the primary is overloaded",
        "They store a complete replica of all chunk data",
        "They serve read-only metadata queries and lag slightly behind the primary",
        "They automatically become primary when the primary master fails"
      ],
      "answer": 2,
      "explanation": "Shadow masters replicate the primary's operation log and can answer read-only metadata queries (namespace lookups, chunk locations). They cannot handle mutations and do not automatically promote to primary — GFS chose manual failover over the complexity of automated leader election."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "GFS separates metadata (single master, in RAM) from data (many chunkservers, on disk) — this split is the system's foundational design choice",
    "The master persists only namespace and file-to-chunk mappings; chunk locations are ephemeral and rebuilt from chunkserver heartbeats on restart",
    "64 MB chunks minimize master metadata per file and reduce client-master RPCs, at the cost of hot-spot risk for small popular files",
    "Client caching and direct client-to-chunkserver data paths keep the master out of the data plane — it handles only KB-sized metadata requests",
    "Shadow masters provide read availability during primary failures by following the operation log, accepting slight staleness in exchange for simplicity"
  ]
}
\`\`\``,
    },
    {
      id: "gfs-chunk-placement",
      slug: "gfs-chunk-placement-replication",
      title: "Chunk Placement & Replication",
      content: `# Chunk Placement & Replication

GFS replicates each chunk to multiple chunk servers for durability and availability. The master carefully places replicas to maximize fault tolerance while balancing load across the cluster — using **global knowledge** that no single chunk server possesses.

\`\`\`concept
{ "title": "Why 3 Replicas?", "variant": "mental-model", "content": "Three replicas provide a sweet spot between durability and storage overhead. With 3 copies, GFS can tolerate simultaneous failure of 2 replicas while maintaining data availability. This covers common failure scenarios like a server crash plus a rack outage, or maintenance on one replica while another fails unexpectedly. The GFS paper confirms 3 as the default, configurable per directory." }
\`\`\`

## Replication Factor

Each chunk is replicated to **3** chunk servers by default. The master tracks which servers hold each replica and is responsible for maintaining that count throughout the cluster's lifetime.

\`\`\`
Chunk c_1001 (from file /data/crawl/2024-03-01.dat):

  Primary:  ChunkServer A  (Rack 1)
  Replica:  ChunkServer D  (Rack 2)
  Replica:  ChunkServer G  (Rack 3)

3 copies across 3 different racks.
\`\`\`

## Placement Policy

The master uses a placement policy that considers multiple factors simultaneously. Spreading replicas across machines alone is insufficient — GFS must also spread across **racks** to guard against rack-level failures from a shared network switch or power circuit.

\`\`\`steps
{ "title": "Chunk Placement Decision Process", "steps": [ { "title": "1. Spread Across Racks", "content": "Place replicas on different racks to tolerate entire rack failures (power, network switch). At least 2 racks per chunk ensures availability even if one rack goes dark. The GFS paper explicitly states this is a deliberate trade-off: write traffic must flow through multiple racks, but read traffic benefits from aggregate rack bandwidth." }, { "title": "2. Balance Disk Utilization", "content": "Prefer chunk servers with more free space to equalize storage load. This prevents hotspots where some servers fill up while others sit idle." }, { "title": "3. Limit Recent Creation Rate", "content": "Avoid servers that recently received many chunks. These servers are likely handling write traffic, and adding more chunks would create write hotspots." }, { "title": "4. Network Proximity", "content": "Ensure primary and replicas have good network connectivity for efficient replication during writes. Client data is pushed to the closest replica, which then forwards to the next-closest, forming a replication pipeline." } ] }
\`\`\`

### Rack-Aware Placement

\`\`\`sysdiag
{ "title": "Rack-Aware Chunk Placement", "width": 600, "height": 400, "nodes": [ { "id": "rack1", "label": "Rack 1", "x": 100, "y": 80, "kind": "group" }, { "id": "rack2", "label": "Rack 2", "x": 280, "y": 80, "kind": "group" }, { "id": "rack3", "label": "Rack 3", "x": 460, "y": 80, "kind": "group" }, { "id": "csa", "label": "CS-A (Primary)", "x": 100, "y": 160, "kind": "storage" }, { "id": "csd", "label": "CS-D (Replica)", "x": 280, "y": 160, "kind": "storage" }, { "id": "csg", "label": "CS-G (Replica)", "x": 460, "y": 160, "kind": "storage" }, { "id": "switch", "label": "Core Switch", "x": 280, "y": 300, "kind": "service" } ], "edges": [ { "from": "csa", "to": "switch", "label": "rack uplink" }, { "from": "csd", "to": "switch", "label": "rack uplink" }, { "from": "csg", "to": "switch", "label": "rack uplink" } ], "annotations": { "csa": "Primary replica of chunk c_1001. Holds the chunk lease during writes.", "csd": "Secondary replica. Receives write data via replication pipeline from CS-A.", "csg": "Tertiary replica. Final hop in the replication chain.", "switch": "Cross-rack traffic flows here. A switch failure is rare but would isolate an entire rack — hence cross-rack placement." } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Write Traffic Trade-off", "content": "Rack-aware placement means write traffic must cross rack boundaries — a deliberate trade-off the GFS authors accepted. The benefit: reads can exploit aggregate bandwidth across multiple racks, and any single rack failure leaves at least 2 replicas intact." }
\`\`\`

## Re-Replication

When the number of replicas drops below the target (due to server failure, disk corruption, or an increased replication factor), the master initiates **re-replication**. Crucially, the master detects failed chunk servers via missed heartbeats — not from client reports.

\`\`\`trace
{ "title": "Re-Replication Process", "language": "python", "code": "# Initial state: 3 replicas\\nchunk_c1001 = ['CS-A', 'CS-D', 'CS-G']\\n\\n# CS-A fails — master detects via missed heartbeats\\nchunk_c1001 = ['CS-D', 'CS-G']  # Only 2 replicas now\\n\\n# Master selects CS-H (free space, low recent-creation rate)\\n# CS-H clones from CS-D (nearest healthy replica)\\nchunk_c1001 = ['CS-D', 'CS-G', 'CS-H']  # Back to 3 replicas", "frames": [ { "line": 2, "vars": { "chunk_c1001": ["CS-A", "CS-D", "CS-G"], "replica_count": 3 }, "note": "Healthy state: 3 replicas distributed across 3 racks." }, { "line": 5, "vars": { "chunk_c1001": ["CS-D", "CS-G"], "replica_count": 2 }, "note": "CS-A stops sending heartbeats. Master marks it failed and updates replica map." }, { "line": 8, "vars": { "chunk_c1001": ["CS-D", "CS-G", "CS-H"], "replica_count": 3 }, "note": "Re-replication complete. CS-H cloned from CS-D. Chunk is fully replicated again." } ], "speed": 1000 }
\`\`\`

### Cloning Throttle

Re-replication consumes network and disk bandwidth. The master limits the number of concurrent clone operations per chunk server and the total cluster-wide cloning bandwidth. This prevents a cascade: a rack failure triggering so much cloning that it degrades normal client throughput.

\`\`\`callout
{ "type": "warning", "title": "Cascading Overload Risk", "content": "Without throttling, a single rack failure could trigger thousands of simultaneous clone operations — each consuming disk and network bandwidth. The master's throttle ensures re-replication happens in the background without starving client reads and writes." }
\`\`\`

## Rebalancing

The master periodically examines chunk distribution and **rebalances** replicas to even out disk utilization, integrate newly added chunk servers, and adapt to rack topology changes. New servers are filled gradually — not flooded all at once.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Before Rebalancing — CS-M just added", "code": "CS-A: 800 chunks    CS-D: 750 chunks\\nCS-G: 780 chunks    CS-M:   0 chunks (new)\\n\\nTotal: 2330 chunks across 4 servers\\nAverage target: 582 per server" }, "after": { "label": "After Gradual Rebalancing", "code": "CS-A: 600 chunks    CS-D: 575 chunks\\nCS-G: 580 chunks    CS-M: 575 chunks\\n\\nTotal: 2330 chunks across 4 servers\\nAverage: ~582 per server — load equalized" } }
\`\`\`

## Chunk Version Numbers

Each chunk has a **version number** that increments whenever the master grants a new lease. This lets the master detect **stale replicas** — chunk servers that missed writes while they were offline and came back with an outdated copy.

\`\`\`algoviz
{ "title": "Version-Based Stale Replica Detection", "type": "array", "data": ["v4 (CS-D)", "v5 (CS-A)", "v5 (CS-G)"], "frames": [ { "highlight": [1, 2], "label": "CS-A and CS-G report version 5 — they were online for the last lease grant.", "stats": { "current_version": 5 } }, { "highlight": [0], "label": "CS-D reports version 4 — it was offline when the lease incremented.", "stats": { "current_version": 5 } }, { "highlight": [0], "label": "Master marks CS-D's replica as stale and schedules it for garbage collection.", "stats": { "action": "mark_stale" } }, { "highlight": [1, 2], "label": "Only CS-A and CS-G serve reads. Re-replication restores the third replica.", "stats": { "action": "re_replicate" } } ], "speed": 1200 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Stale ≠ Corrupt", "content": "A stale replica is not corrupted — it simply missed mutations. The master knows to ignore it for reads and client-facing operations. Checksums on 64 KB blocks within each chunk catch actual data corruption separately." }
\`\`\`

## Knowledge Check

\`\`\`quiz
{ "title": "Chunk Placement & Replication", "questions": [ { "question": "Why does GFS spread chunk replicas across racks rather than just across different machines?", "options": [ "To reduce the total number of replicas needed", "To survive rack-level failures caused by a shared switch or power circuit", "To improve write throughput by parallelizing disk I/O", "To ensure each rack holds exactly one master shadow" ], "answer": 1, "explanation": "Spreading across machines only guards against disk or machine failures. Rack-aware placement ensures that even if an entire rack goes offline (e.g., shared network switch failure), at least one replica survives. The GFS paper explicitly calls this out as a deliberate design choice." }, { "question": "What triggers the master to initiate re-replication for a chunk?", "options": [ "A client read returns a checksum error", "The replica count drops below the target, detected via missed heartbeats", "A chunk server explicitly requests it via RPC", "The chunk's lease expires with no renewal" ], "answer": 1, "explanation": "The master detects failed chunk servers via missed heartbeats. When a server stops responding, the master removes its replicas from the replica map. If replica count drops below the target (3 by default), the master schedules re-replication onto a healthy server with sufficient free space." }, { "question": "What is the purpose of incrementing a chunk's version number when a new lease is granted?", "options": [ "To signal clients that they must re-request chunk metadata", "To prevent the primary from serving reads during a write", "To detect stale replicas on servers that were offline during the mutation", "To limit the number of concurrent writes to a single chunk" ], "answer": 2, "explanation": "Version numbers are incremented at lease grant time. A chunk server that was offline and missed the grant will report an older version. The master identifies it as stale and excludes it from client operations, scheduling garbage collection or re-replication as needed." }, { "question": "Why does the master throttle re-replication (cloning) bandwidth?", "options": [ "To reduce storage costs by slowing down replica creation", "To prevent a cascade where mass cloning starves normal client read/write traffic", "To give shadow masters time to sync their operation logs", "To ensure all replicas reach the same version before serving reads" ], "answer": 1, "explanation": "A rack failure can trigger thousands of simultaneous clone operations. Without throttling, the cloning storm would saturate network and disk bandwidth, degrading client-facing reads and writes. The master limits concurrent clones per server and cluster-wide to keep background recovery from overwhelming foreground traffic." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "GFS defaults to 3 replicas per chunk, spread across different racks to survive rack-level failures from shared switches or power circuits", "Placement policy scores candidate servers on rack diversity, free disk space, and recent creation rate — balancing fault tolerance against write hotspots", "Re-replication automatically restores replica count when servers fail, triggered by missed heartbeats and throttled to prevent cascading bandwidth overload", "Version numbers increment on every lease grant, allowing the master to detect and discard stale replicas from servers that missed mutations while offline", "Periodic rebalancing moves replicas to equalize disk utilization and gradually onboard new chunk servers without flooding them" ] }
\`\`\``,
    },
    {
      id: "gfs-write-read",
      slug: "gfs-write-read-flows",
      title: "Write & Read Flows",
      content: `# Write & Read Flows

GFS separates the **control flow** (through the master) from the **data flow** (directly between clients and chunk servers). This architectural decision is the key to GFS's scalability — the master never becomes a bottleneck for actual data movement.

\`\`\`concept
{ "title": "Control vs. Data Flow", "variant": "mental-model", "content": "Think of the master as an air traffic controller and chunk servers as runways. The controller tells each plane which runway to use, but the planes land and take off directly — the controller never touches the aircraft. In GFS, the master handles metadata requests while all actual bytes flow directly between clients and chunk servers." }
\`\`\`

\`\`\`sysdiag
{ "title": "GFS: Control Path vs. Data Path", "width": 640, "height": 320, "nodes": [ { "id": "client", "label": "Client", "x": 80, "y": 160, "kind": "client" }, { "id": "master", "label": "GFS Master\\n(metadata only)", "x": 320, "y": 60, "kind": "service" }, { "id": "csa", "label": "CS-A\\n(Primary)", "x": 480, "y": 200, "kind": "database" }, { "id": "csd", "label": "CS-D\\n(Secondary)", "x": 580, "y": 280, "kind": "database" }, { "id": "csg", "label": "CS-G\\n(Secondary)", "x": 390, "y": 290, "kind": "database" } ], "edges": [ { "from": "client", "to": "master", "label": "① control: where is chunk?" }, { "from": "master", "to": "client", "label": "② chunk locations" }, { "from": "client", "to": "csa", "label": "③ data (pipelined)" }, { "from": "csa", "to": "csd", "label": "④ pipeline" }, { "from": "csd", "to": "csg", "label": "⑤ pipeline" } ], "annotations": { "master": "Handles only metadata: namespace, chunk locations, lease grants. Never touches file data.", "csa": "Primary chunkserver for this chunk — holds the lease, assigns serial numbers to mutations.", "client": "Caches chunk locations from master. Reads and writes go directly to chunkservers." } }
\`\`\`

---

## Leases and Mutation Order

Before any write can occur, the master must designate which replica is responsible for ordering mutations. It does this by granting a **lease** — a time-bounded authority — to one replica, making it the **primary**.

\`\`\`steps
{ "title": "Lease Mechanism", "steps": [ { "title": "Master grants lease", "content": "Master grants a 60-second lease to ChunkServer A for chunk \`c_1001\`. CS-A becomes the **PRIMARY** for that chunk." }, { "title": "Primary orders mutations", "content": "All writes go through CS-A, which assigns monotonically increasing serial numbers to ensure all replicas apply mutations in the same order." }, { "title": "Lease extension", "content": "As long as CS-A remains healthy, the lease is renewed via periodic heartbeat messages. There is no fixed cap on how long a server can hold a lease." }, { "title": "Primary failure", "content": "If CS-A fails, the master waits for the current lease to expire (up to 60 seconds), then grants a new lease to one of the surviving secondaries." } ] }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why Leases, Not Locks?", "content": "Locks require explicit release and can leave the system stuck if the holder crashes. Leases are self-expiring — even if the primary dies without sending a release, the master knows it can safely re-grant after the timeout. This is a classic distributed-systems pattern for failure-safe authority delegation." }
\`\`\`

---

## Write Flow (Record Append)

Record append is GFS's most important write operation. Multiple clients can append concurrently, and GFS guarantees **atomic append** — each record is appended at least once, atomically, at an offset chosen by the primary.

\`\`\`algoviz
{ "title": "Record Append — Step by Step", "type": "array", "data": ["Client", "Master", "CS-A (Primary)", "CS-D (Secondary)", "CS-G (Secondary)"], "frames": [ { "highlight": [0, 1], "label": "Step 1: Client asks Master for the lease holder and replica locations for target chunk", "stats": { "step": 1, "flow": "control" } }, { "highlight": [1, 0], "label": "Step 2: Master replies with primary (CS-A) and secondaries (CS-D, CS-G). Client caches this.", "stats": { "step": 2, "flow": "control" } }, { "highlight": [0, 2, 3, 4], "label": "Step 3: Client pushes data to ALL replicas in a pipeline chain — not fan-out. Each server forwards as it receives.", "stats": { "step": 3, "flow": "data" } }, { "highlight": [2, 3, 4], "label": "Step 4: All replicas ACK that data is stored in their internal buffer.", "stats": { "step": 4, "flow": "data" } }, { "highlight": [0, 2], "label": "Step 5: Client sends write request to PRIMARY only (control signal, no data).", "stats": { "step": 5, "flow": "control" } }, { "highlight": [2, 3, 4], "label": "Step 6: Primary assigns a serial number, applies mutation locally, then forwards the write request (with serial) to secondaries.", "stats": { "step": 6, "flow": "control+data" } }, { "highlight": [3, 4, 2], "label": "Step 7: Secondaries apply mutation in the assigned serial order and ACK the primary.", "stats": { "step": 7, "flow": "data" } }, { "highlight": [2, 0], "label": "Step 8: Primary ACKs the client. On any failure, client retries from Step 5.", "stats": { "step": 8, "flow": "control" } } ], "speed": 1000 }
\`\`\`

### Pipeline vs. Fan-out Data Transfer

GFS pushes data through a **chain pipeline** rather than having the client broadcast to all replicas simultaneously. This exploits full-duplex Ethernet and cuts transfer time dramatically.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Fan-out Transfer", "code": "Client --> CS-A  (64 MB)\\nClient --> CS-D  (64 MB)\\nClient --> CS-G  (64 MB)\\n\\n# All 3 transfers compete for client's uplink\\nTotal time ≈ 3 × (64 MB / bandwidth)" }, "after": { "label": "Pipelined Chain Transfer", "code": "Client -[64MB]-> CS-A -[64MB]-> CS-D -[64MB]-> CS-G\\n\\n# Each link runs at full duplex simultaneously\\n# CS-A forwards to CS-D while still receiving from client\\nTotal time ≈ 64 MB / bandwidth  +  2 × propagation_latency\\n# Much faster: bottleneck is one hop, not three" } }
\`\`\`

---

## Read Flow

Reads are simpler than writes. There is no lease, no primary, no ordering concern — the client just contacts the closest available replica directly.

\`\`\`trace
{ "title": "Read Flow Execution Trace", "language": "python", "code": "# Client wants bytes [100 MB .. 101 MB] from file /jobs/output\\noffset = 100 * 1024 * 1024   # 100 MB in bytes\\nlength = 1024 * 1024         # 1 MB\\n\\n# Step 1: translate offset -> (chunk_index, byte_offset_within_chunk)\\nchunk_size = 64 * 1024 * 1024\\nchunk_index = offset // chunk_size        # which 64 MB chunk?\\nbyte_offset  = offset % chunk_size        # offset inside that chunk\\nprint(f\\"chunk_index={chunk_index}, byte_offset={byte_offset}\\")\\n\\n# Step 2: ask master (file name + chunk index)\\n# master replies: chunk_id='c_1003', replicas=['CS-B','CS-E','CS-H']\\n\\n# Step 3: pick closest replica by IP / rack proximity\\nchosen = 'CS-B'\\n\\n# Step 4: CS-B reads the range, verifies 64 KB block checksums\\n# CS-B --> Client: raw bytes", "frames": [ { "line": 7, "vars": { "offset": 104857600, "chunk_size": 67108864 }, "note": "Translate file offset into chunk index — integer division by 64 MB chunk size.", "stdout": "" }, { "line": 8, "vars": { "chunk_index": 1, "byte_offset": 37748736 }, "note": "chunk_index=1 means this is the second 64 MB chunk; byte_offset is where inside that chunk the read starts.", "stdout": "chunk_index=1, byte_offset=37748736" }, { "line": 12, "vars": { "chunk_id": "c_1003", "replicas": ["CS-B", "CS-E", "CS-H"] }, "note": "Master replies with chunk handle and all replica locations. Client caches this for future reads.", "stdout": "" }, { "line": 15, "vars": { "chosen": "CS-B" }, "note": "Client picks the 'closest' replica — GFS uses IP address proximity as a heuristic for rack locality.", "stdout": "" }, { "line": 18, "vars": {}, "note": "CS-B verifies 32-bit checksums on each 64 KB block before returning data. Corruption triggers retry on another replica.", "stdout": "" } ], "speed": 1100 }
\`\`\`

### Checksum Verification

Each 64 MB chunk is divided into **64 KB blocks**, each guarded by a 32-bit checksum stored alongside the data. Checksums are verified on every read — not just periodically.

\`\`\`callout
{ "type": "warning", "title": "Corruption Detected Mid-Read", "content": "If a checksum mismatch is found, CS-B returns an error rather than corrupt data. The client automatically retries against a different replica. The master is also notified and schedules re-replication of the corrupted chunk from a healthy replica, then instructs deletion of the bad copy." }
\`\`\`

---

## Consistency Model

GFS offers a **relaxed consistency model** — it trades strict per-write guarantees for throughput and simplicity. Understanding the guarantees matters for building correct applications on top of GFS.

| Operation | Consistent? | Defined? | Notes |
|---|---|---|---|
| File namespace ops (create, delete, rename) | Yes | Yes | Master serializes all namespace mutations |
| Serial record append | Yes | Yes | All replicas see the same record at the same offset |
| Concurrent record appends | Yes | No | All replicas identical, but may contain duplicates / padding |
| Serial random write | Yes | Yes | All replicas reflect the write |
| Concurrent random writes | No | No | Regions may interleave across clients |

- **Consistent**: all replicas return the same bytes
- **Defined**: consistent and reflects exactly one mutation as the writer intended

\`\`\`collapse
{ "title": "Deep Dive: Why Concurrent Appends Can Produce Duplicates", "content": "Consider two clients both appending a 1 MB record to chunk \`c_1001\`.\\n\\n1. Both clients push data to all replicas.\\n2. Client A's write request reaches the primary first — serial number 42 assigned, applied on all replicas.\\n3. Client B's write is serial number 43 — applied on all replicas.\\n\\nSo far, no duplicates. But now suppose a secondary (CS-D) fails mid-way through Client A's write:\\n\\n- Primary receives success from CS-G but timeout from CS-D.\\n- Primary returns error to Client A.\\n- Client A **retries** — the entire append is re-sent to the primary.\\n- Primary assigns a new serial number (44) and writes the record again.\\n- CS-D, having recovered, now also applies serial 44.\\n\\nResult: CS-A and CS-G now have the record at both offset 42 **and** 44. All replicas are **consistent** (identical) but contain a duplicate.\\n\\n**Application-level mitigation:** GFS-aware applications embed a unique record ID in each appended record. On read, the application deduplicates by ID and skips padding regions (filled with zeros or sentinel bytes by the primary when a chunk is too full to fit the next record)." }
\`\`\`

---

\`\`\`quiz
{ "title": "Write & Read Flows — Check Your Understanding", "questions": [ { "question": "Why does GFS use pipelined chain transfer instead of having the client broadcast data to all replicas simultaneously?", "options": [ "To avoid the master becoming a bottleneck", "To fully utilize each link's bandwidth and avoid saturating the client's uplink", "To enforce a total ordering of mutations", "Because replicas do not know each other's addresses" ], "answer": 1, "explanation": "Chain pipelining lets each full-duplex link run at capacity simultaneously. Fan-out would require the client to send the same data three times, tripling the load on its uplink. The total transfer time in pipeline mode is approximately one hop's transfer time plus two propagation delays." }, { "question": "What happens when a record append doesn't fit in the remaining space of the current chunk?", "options": [ "The write fails with an error", "The record is split across two chunks", "The primary pads the chunk to 64 MB and tells the client to retry on the next chunk", "The record is silently truncated to fit" ], "answer": 2, "explanation": "GFS prohibits records from spanning chunk boundaries. When a record would overflow, the primary pads the current chunk with dummy data to reach 64 MB, then notifies the client to retry on the next chunk. Applications must handle this padding." }, { "question": "A secondary chunkserver crashes after acknowledging data receipt but before acknowledging the write request. The client retries. What is the outcome?", "options": [ "The retry fails because the data is lost on the crashed server", "A duplicate record may appear on all replicas once the secondary recovers and replication completes", "The master immediately removes the crashed server and re-replicates the chunk", "The write is committed on only 2 replicas and GFS marks the chunk as degraded" ], "answer": 1, "explanation": "The data was already buffered on the secondary (it ACKed the data push). When the client retries, a new serial number is assigned and the record is written again. After recovery, the secondary replays the write and ends up with the record at two offsets — a duplicate. Applications use record IDs to deduplicate." }, { "question": "Why does a client read directly from the 'closest' replica rather than always from the primary?", "options": [ "The primary is always busy coordinating writes", "There is no primary for reads — any replica can serve read requests, so picking the closest minimizes latency", "Reads must bypass the master entirely", "Secondary replicas have more recent data than the primary" ], "answer": 1, "explanation": "Reads have no ordering concern — all consistent replicas hold the same bytes. GFS exploits this by letting clients read from any replica, choosing by IP-address proximity (a rack-locality heuristic). This distributes read load across all replicas and reduces cross-rack traffic." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "GFS decouples control flow (master ↔ client, tiny metadata messages) from data flow (client ↔ chunkservers, large byte streams) — the master never touches file data.", "Leases delegate mutation ordering authority to a primary chunkserver for 60 seconds; self-expiry ensures safety without explicit locks.", "Pipelined chain replication lets each network link run at full duplex simultaneously, making write time roughly equal to a single-hop transfer.", "Reads go directly to the closest replica — no primary involvement, no ordering needed — maximizing throughput and rack-local bandwidth.", "The relaxed consistency model allows concurrent appends to produce duplicates and padding; GFS-aware applications embed record IDs and skip sentinels." ] }
\`\`\``,
    },
    {
      id: "gfs-fault-tolerance",
      slug: "gfs-fault-tolerance",
      title: "Fault Tolerance & Recovery",
      content: `# Fault Tolerance & Recovery

GFS was engineered around a single uncomfortable truth: in a cluster of thousands of commodity machines, something is *always* broken. Rather than treating failures as edge cases to be avoided, GFS treats them as the steady state to be managed.

\`\`\`concept
{ "title": "GFS Failure Philosophy", "variant": "mental-model", "content": "Treat failures as the common case, not the exception. Design every layer — disk, machine, rack, network — with redundancy and fast, automated recovery. The system is pessimistic about hardware but optimistic about software's ability to heal quickly. From the original GFS paper: 'component failures can result in an unavailable system or, worse, corrupted data' — so both availability and integrity require independent, layered defenses." }
\`\`\`

## Failure Categories

\`\`\`tabs
{ "tabs": [
  { "label": "Chunk Server", "icon": "💾", "content": "**Most frequent** — disk crash, kernel panic, NIC failure.\\n\\nImpact: replicas on that machine become temporarily unavailable; read/write traffic shifts to the remaining replicas. The master detects the outage within ~30 s via missed heartbeats, then re-replicates affected chunks to restore the 3× replication factor." },
  { "label": "Master", "icon": "🧠", "content": "**Most critical** — single metadata source.\\n\\nImpact: no new file creation, no re-balancing, no garbage collection. Existing data reads can continue because clients cache chunk locations. Recovery relies on a replicated operation log and periodic checkpoints; full recovery typically takes ~60 s." },
  { "label": "Data Corruption", "icon": "🦠", "content": "**Silent** — bit-rot, RAM errors, bus glitches.\\n\\nImpact: returned bits are wrong but the OS reports success; detected only via checksum mismatch on read or background scrub. The chunkserver informs the master, which clones a healthy replica to replace the corrupted block." },
  { "label": "Network Partition", "icon": "🔌", "content": "**Transient** — switch reboot, cable cut.\\n\\nImpact: chunk servers unreachable from the master. The lease mechanism prevents split-brain writes by guaranteeing only one primary is active at a time, even when the master temporarily cannot communicate with it." }
] }
\`\`\`

## Chunk Server Failure

When a chunkserver's heartbeats stop, the master reacts within **~30 seconds**. The following visualisation shows what happens to chunks that were stored on the failed server.

\`\`\`algoviz
{ "title": "Re-replication After a Chunk Server Dies", "type": "array", "data": ["c1001", "c1002", "c1003", "c1004", "c1005"], "frames": [
  { "highlight": [0,1,2], "label": "CS-5 holds one replica each of c1001, c1002, c1003", "stats": { "replFactor": 3 } },
  { "highlight": [0,1,2], "label": "CS-5 stops sending heartbeats — master marks all its chunks under-replicated", "stats": { "replFactor": 2 } },
  { "highlight": [0], "label": "c1001 now has only 2 replicas → master queues it as HIGH priority", "stats": { "urgent": 0, "high": 1 } },
  { "highlight": [0], "label": "Master picks CS-7 (different rack) as clone target for c1001", "stats": { "urgent": 0, "high": 1, "cloning": "c1001 → CS-7" } },
  { "highlight": [0], "label": "Clone complete — c1001 back to 3 replicas. Process repeats for c1002, c1003", "stats": { "replFactor": 3 } }
], "speed": 1000 }
\`\`\`

The priority queue the master uses follows a clear escalation policy:

| Replicas remaining | Priority |
|--------------------|----------|
| 1 | **URGENT** |
| 2 | **HIGH** |
| 3+ | Normal background |

If the lost server returns, its **chunk version numbers** are compared against the master's records. Stale replicas whose versions are behind are treated as garbage and cleaned up automatically, preventing silent stale-data reads.

\`\`\`quiz
{ "title": "Quick Check: Chunk Recovery", "questions": [
  { "question": "A chunk has three replicas on servers A, B, and C. Server C goes offline. What priority does the master assign to re-replicating its chunks?", "options": ["URGENT — only one replica left", "HIGH — two replicas still online", "NORMAL — three replicas were present originally", "LOW — re-replication is deferred to off-peak hours"], "answer": 1, "explanation": "With two replicas still online the chunk is not yet critical, so the master labels it HIGH priority. Only a single surviving replica triggers URGENT status." },
  { "question": "When cloning a chunk to restore replication, which replica does the master use as the source?", "options": ["The closest replica by IP address", "Any replica — they are identical by definition", "The replica with the highest chunk version number", "The replica that reported back first after the crash"], "answer": 2, "explanation": "Version numbers detect staleness. The master always reads from a replica whose version matches the master's expected version, guaranteeing the clone is up-to-date." },
  { "question": "Why does the master wait ~30 s before declaring a chunkserver dead?", "options": ["To avoid false positives from transient network hiccups", "To batch heartbeats for bandwidth efficiency", "Because checkpoints are written every 30 s", "To allow in-flight leases to expire naturally"], "answer": 0, "explanation": "A ~30 s timeout balances fast failure detection against tolerance for brief network glitches that would otherwise trigger unnecessary re-replication storms." },
  { "question": "A failed chunkserver comes back online after 10 minutes. How does GFS handle its stale replicas?", "options": ["They are immediately promoted back to active use", "The master checks version numbers and garbage-collects stale ones", "Clients are told to prefer them since the server just recovered", "They are kept as a fourth replica for extra redundancy"], "answer": 1, "explanation": "The master compares chunk version numbers. Any replica whose version is behind the master's record is considered stale and scheduled for garbage collection." }
] }
\`\`\`

## Master Failure & Recovery

The master is GFS's only single point of failure for metadata, so recovery must be both **fast** and **correct**. The paper describes the target as *restoring state in seconds*, achieved via WAL + periodic checkpoints.

\`\`\`steps
{ "title": "Master Recovery Timeline", "steps": [
  { "title": "T = 0 s — Crash", "content": "Master process crashes (OOM kill, seg-fault, kernel panic). All metadata is in-memory only; the on-disk operation log and checkpoint files are the durability anchor." },
  { "title": "T = 0–5 s — Detection", "content": "An external monitor notices health-check failure and immediately restarts the master process, either on the same machine or a designated standby." },
  { "title": "T = 5–10 s — Checkpoint Load", "content": "The new process loads the most recent **checkpoint** — a compact, serialised snapshot of the full namespace and chunk-mapping B-tree." },
  { "title": "T = 10–15 s — Log Replay", "content": "All **operation-log entries** written after the checkpoint are replayed in order to reconstruct every metadata change up to the moment of the crash. Both the log and checkpoint are replicated on multiple remote machines." },
  { "title": "T = 15–60 s — Chunk Mapping Rebuild", "content": "The master broadcasts requests for heartbeats; chunkservers respond with their chunk inventories. The master rebuilds the in-memory **chunk-to-server mapping** (not persisted — always rebuilt on startup to avoid consistency drift)." },
  { "title": "T ≈ 60 s — Open for Business", "content": "The master accepts client requests again. Write traffic resumes. Shadow masters that served stale read-only metadata during the outage revert to follower mode." }
] }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Shadow Masters", "content": "Shadow masters continuously follow the primary master's operation log and can serve **read-only** metadata queries while the primary is recovering. They may lag by a few seconds — clients may see slightly stale chunk locations — but data reads never fully stall. This is not a hot-standby failover; the shadow cannot accept writes." }
\`\`\`

## Data Integrity: Checksums

Disk drives lie. A sector can silently return wrong data with no OS-level error. GFS defends against this by storing a **32-bit CRC-32 checksum** for every **64 KB block** of each chunk, kept in memory and persisted separately from the chunk data itself.

\`\`\`trace
{ "title": "Detecting Bit-Rot on Read", "language": "python", "code": "def read_block(fd, block_id):\\n    data = disk_read(fd, block_id)          # 64 KB raw bytes\\n    stored_cs  = checksum_table[block_id]   # loaded into RAM at startup\\n    computed_cs = crc32(data)\\n    if computed_cs != stored_cs:\\n        report_corruption(block_id)         # alerts the master\\n        raise IOError('checksum mismatch')\\n    return data", "frames": [
  { "line": 2, "vars": { "block_id": 17, "data": "64 KB" }, "note": "Read raw bytes from disk — no OS-level error even if bits flipped", "stdout": "" },
  { "line": 3, "vars": { "stored_cs": 3735928559 }, "note": "Retrieve the CRC stored when this block was last written", "stdout": "" },
  { "line": 4, "vars": { "stored_cs": 3735928559, "computed_cs": 4027432734 }, "note": "Recompute CRC over the bytes just read from disk", "stdout": "" },
  { "line": 5, "vars": {}, "note": "Values differ — silent corruption detected!", "stdout": "CORRUPTION DETECTED on block 17" },
  { "line": 6, "vars": {}, "note": "Master is notified; client will retry on a different replica", "stdout": "" }
], "speed": 900 }
\`\`\`

Three paths trigger checksum verification:

- **On read** — every block verified before data leaves the chunkserver. Mismatch → error to client → client retries another replica.
- **Background scrubber** — periodically reads and verifies idle blocks to catch bit-rot in data that hasn't been accessed recently.
- **On append** — the last partial block's checksum is updated incrementally; newly written full blocks receive fresh checksums.

## Lease Mechanism Prevents Split-Brain

Without a coordination primitive, a network partition could result in two chunkservers both believing they are the primary — accepting concurrent writes that diverge silently. GFS uses **60-second leases** to prevent this.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Without Leases — Split Brain", "code": "1. Master grants primary role to CS-A\\n2. Network partition isolates CS-A from master\\n3. Master (thinking CS-A is dead) grants primary to CS-D\\n4. CS-A still accepts writes (unaware of CS-D)\\n5. CS-D also accepts writes\\n   → INCONSISTENT CHUNK — two diverging histories" }, "after": { "label": "With 60-s Leases — Single Writer", "code": "1. Master grants lease to CS-A, valid until T+60 s\\n2. Partition isolates CS-A; its lease still legally valid\\n3. Master cannot contact CS-A but WAITS until T+60 s\\n4. Only after expiry does master grant lease to CS-D\\n5. CS-A's lease lapsed — it refuses further writes\\n   → SINGLE WRITER guaranteed across the partition" } }
\`\`\`

\`\`\`concept
{ "title": "Lease as a Time-Bound Lock", "variant": "rule", "content": "A lease is a promise from the master: 'I will not appoint a second primary for this chunk until time T.' The primary can renew the lease while healthy. If it goes silent, the master simply waits for T to pass before reassigning — no explicit revocation needed. This makes the protocol resilient to network partitions without requiring two-phase commit." }
\`\`\`

## Garbage Collection

Deletion in GFS is **lazy** by design. When a file is deleted, the master does not immediately free its chunks. Instead:

1. The file is **renamed** to a hidden name that encodes the deletion timestamp.
2. A background scanner running during **off-peak hours** removes hidden files older than **3 days**.
3. The master then notifies chunkservers to delete the now-orphaned chunk replicas.

\`\`\`collapse
{ "title": "Deep Dive: Why Lazy Deletion?", "content": "**Race condition safety:** Immediate deletion during active operations (e.g., concurrent reads) risks deleting chunks still in use. The 3-day grace window makes this impossible.\\n\\n**Batching efficiency:** Scanning and deleting in bulk during off-peak hours costs less network and disk I/O than synchronous per-file cleanup.\\n\\n**Built-in recycle bin:** Files deleted accidentally can be restored within 3 days by renaming them back — a meaningful operational safety net at Google's scale.\\n\\n**Stale replica cleanup:** When re-replication creates extra replicas (e.g., a dead server rejoins), those orphaned replicas are naturally swept up during the same GC pass, keeping the cluster from accumulating debris." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "GFS treats hardware failures as the norm: heartbeats, checksums, and leases provide layered, automatic detection and recovery at every layer.",
  "Chunk re-replication is priority-queued: 1 replica remaining is URGENT, 2 remaining is HIGH — the master acts within ~30 s of a chunkserver going silent.",
  "Master recovery takes ~60 s: a replicated operation log (WAL) plus periodic checkpoints allows exact state reconstruction; the chunk-to-server map is always rebuilt from chunkserver heartbeats, never persisted.",
  "Shadow masters provide stale read-only metadata access during master outages, preventing a full read stall.",
  "64 KB block checksums (CRC-32) catch silent disk corruption on every read and during background scrubbing.",
  "60-second leases guarantee single-writer semantics across network partitions without requiring explicit primary revocation.",
  "Lazy garbage collection with a 3-day grace period avoids race conditions, enables batching, and provides an accidental-deletion safety window."
] }
\`\`\``,
    },
    {
      id: "gfs-architecture",
      slug: "gfs-architecture-walkthrough",
      title: "GFS: Architecture Walkthrough",
      content: `\`\`\`concept
{"title": "GFS Mental Model", "variant": "mental-model", "content": "Think of GFS as a library with one head librarian (Master) and many stack attendants (ChunkServers). The librarian keeps the card catalog; the attendants store the actual books. Readers (Clients) always ask the librarian first, then grab books directly from the nearest attendant. If an attendant is sick, another copy exists on a different floor."}
\`\`\`

## Complete Architecture

\`\`\`sysdiag
{"title": "GFS Cluster Layout", "width": 720, "height": 420,
 "nodes": [
   {"id": "master", "label": "GFS Master\\n(namespace, chunk map, leases)", "x": 360, "y": 60, "kind": "master"},
   {"id": "shadow1", "label": "Shadow 1\\n(read-only)", "x": 200, "y": 60, "kind": "cache"},
   {"id": "shadow2", "label": "Shadow 2\\n(read-only)", "x": 520, "y": 60, "kind": "cache"},
   {"id": "client", "label": "Application\\nClient", "x": 360, "y": 180, "kind": "client"},
   {"id": "csA", "label": "CS-A\\nRack-1", "x": 120, "y": 320, "kind": "storage"},
   {"id": "csB", "label": "CS-B\\nRack-1", "x": 280, "y": 320, "kind": "storage"},
   {"id": "csC", "label": "CS-C\\nRack-2", "x": 440, "y": 320, "kind": "storage"},
   {"id": "csD", "label": "CS-D\\nRack-2", "x": 600, "y": 320, "kind": "storage"}
 ],
 "edges": [
   {"from": "master", "to": "shadow1", "label": "log replicate"},
   {"from": "master", "to": "shadow2", "label": "log replicate"},
   {"from": "master", "to": "csA", "label": "heartbeat"},
   {"from": "master", "to": "csB", "label": "heartbeat"},
   {"from": "master", "to": "csC", "label": "heartbeat"},
   {"from": "master", "to": "csD", "label": "heartbeat"},
   {"from": "client", "to": "master", "label": "metadata"},
   {"from": "client", "to": "csA", "label": "data", "curved": -20},
   {"from": "client", "to": "csC", "label": "data", "curved": 20}
 ],
 "annotations": {
   "master": "Single active process holding all metadata in memory plus a replicated operation log on disk. Controls chunk lease management, garbage collection, and chunk migration.",
   "client": "Linked library that first contacts the Master for metadata, then streams bytes directly to/from ChunkServers — Master never touches data traffic.",
   "csA": "Each 64 MB chunk is stored as a plain Linux file. A 64 MB chunk is further divided into 64 KB blocks, each with a 32-bit checksum for corruption detection."
 }}
\`\`\`

\`\`\`callout
{"type": "info", "title": "Why Separate Control and Data Planes?", "content": "The Master only handles metadata. All reads and writes flow **directly** between clients and ChunkServers. This single decision is what prevents the Master from becoming a throughput bottleneck — it handles at most thousands of metadata ops/sec, while data bandwidth scales linearly with every ChunkServer added to the cluster."}
\`\`\`

## Write Path: Record Append End-to-End

\`\`\`steps
{"title": "Appending a 64 kB Crawl Record", "steps": [
  {"title": "1. Ask the Master for the last chunk", "content": "Client sends \`getLastChunk(/data/crawl/2024-03-01.dat)\`.\\nMaster replies:\\n- chunk handle \`c_1005\`\\n- primary replica: \`CS-A\` (lease holder)\\n- secondary replicas: \`[CS-C, CS-D]\`\\n- chunk version \`7\`\\n\\nThe client caches this mapping for future mutations — no need to contact the Master again until the lease expires."},
  {"title": "2. Push data through the pipeline", "content": "Client sends the 64 kB record to **CS-A**, which forwards to **CS-C**, which forwards to **CS-D**.\\n\\nEach server buffers the data in an internal LRU cache but does **not** commit yet. The pipeline flows along the network topology — each server forwards to the closest next server — so only one outbound link per server is consumed."},
  {"title": "3. Primary orders the append", "content": "Client sends \`append(c_1005)\` to CS-A (primary leaseholder). CS-A:\\n1. Picks serial number \`42\` for this mutation\\n2. Computes the next available offset: \`3 145 728\`\\n3. Forwards the write command at that offset to CS-C and CS-D"},
  {"title": "4. Replicas ACK the primary", "content": "CS-C and CS-D:\\n1. Write the record at offset \`3 145 728\`\\n2. Compute and store a new 32-bit checksum for the affected 64 KB block\\n3. Reply **SUCCESS** to CS-A\\n\\nIf either replica fails or returns an error, the primary returns ERROR to the client."},
  {"title": "5. Primary commits and replies", "content": "CS-A writes the record, then returns \`(SUCCESS, offset=3145728)\` to the client.\\n\\nIf **any** replica failed, the primary returns ERROR. The client **retries the entire append** — which may succeed on a different set of replicas at a different offset, potentially leaving a duplicate record. Applications must handle this with unique record IDs."}
]}
\`\`\`

\`\`\`trace
{"title": "Client-Code Trace for the Append", "language": "python", "code": "# client.py\\nfd = gfs_open(\\"/data/crawl/2024-03-01.dat\\", \\"a\\")\\ngfs_write(fd, record_bytes)        # 64 kB\\noffset = gfs_tell(fd)              # returns 3145728\\ngfs_close(fd)", "frames": [
  {"line": 2, "vars": {"fd": 17}, "note": "Library contacts Master once and caches chunk c_1005 mapping (CS-A primary, CS-C/D secondaries)"},
  {"line": 3, "vars": {"record_bytes": "bytes[65536]"}, "stdout": "pushing to pipeline CS-A -> CS-C -> CS-D", "note": "Data flows along closest-replica chain; none of these bytes touch the Master"},
  {"line": 4, "vars": {"offset": 3145728}, "stdout": "SUCCESS at offset 3145728", "note": "Primary CS-A serialised the append as mutation #42; both secondaries ACKed before this returned"}
], "speed": 1000}
\`\`\`

## Read Path End-to-End

\`\`\`algoviz
{"title": "Reading Bytes 200,000,000 – 200,500,000", "type": "array",
 "data": ["chunk-0\\n0–67M", "chunk-1\\n67–134M", "chunk-2\\n134–201M", "chunk-3\\n201–268M"],
 "frames": [
  {"highlight": [2], "label": "Byte 200M falls in chunk index 2 (each chunk is 64 MB = 67,108,864 bytes)", "stats": {"chunk_idx": 2, "offset_in_chunk": 65782272}},
  {"highlight": [2], "label": "Client asks Master: 'Where is chunk-2?' Master returns [CS-B, CS-C, CS-D]. Client picks CS-B (lowest RTT).", "stats": {"chosen_replica": "CS-B"}},
  {"highlight": [2], "label": "CS-B reads the overlapping 64 KB blocks, verifies each 32-bit checksum, streams 500 kB back. Master is never contacted for data.", "stats": {"status": "OK", "bytes_returned": 500000}}
 ], "speed": 900}
\`\`\`

\`\`\`callout
{"type": "tip", "title": "Chunk Index Arithmetic", "content": "Given a byte offset B and chunk size C = 64 MB:\\n\\n\`\`\`\\nchunk_index  = B // C\\noffset_in_chunk = B % C\\n\`\`\`\\n\\nFor byte 200,000,000 and C = 67,108,864:\\n- chunk_index = 2\\n- offset_in_chunk = 65,782,272\\n\\nThis is exactly what the GFS client library computes before contacting the Master."}
\`\`\`

## Failure Recovery Summary

| Failure | Detection | Recovery | Effective Downtime |
|---------|-----------|----------|--------------------|
| ChunkServer crash | Missing heartbeat (≈30 s) | Master marks replicas stale, re-replicates to new servers | Reads: zero (other replicas serve). Writes: wait for lease expiry (~60 s) then elect new primary. |
| Disk corruption | Checksum mismatch on read | Client retries on next replica; server deletes corrupt block; Master schedules re-replication | Zero — client sees no error. |
| Master crash (process) | External health-check | Shadow promoted; replays operation log; gathers fresh chunk reports via heartbeats | ~60 s until shadow ready. |
| Master machine death | Hardware watchdog | Restart image on new box using replicated log + latest checkpoint | Minutes, depends on VM provisioning speed. |
| Network partition | Heartbeat timeout | Leases expire, preventing split-brain; isolated servers rejoin and reconcile later | Partial — only minority-partition replicas become unavailable. |
| Whole-rack failure | Multiple heartbeats from same rack | Rack-aware placement guarantees ≥1 replica survives | Background re-replication from surviving racks restores full replication factor. |

\`\`\`callout
{"type": "warning", "title": "Relaxed Consistency = App Responsibility", "content": "Because append retries can produce **duplicate records at arbitrary offsets**, every GFS application embeds a unique record ID in the payload. The reader filters duplicates — typically with a Bloom filter — rather than relying on the file system to guarantee exactly-once delivery. This is a deliberate trade-off: relaxed consistency enables pipeline replication and 100 MB/s append throughput at scale."}
\`\`\`

## GFS Design Trade-offs

\`\`\`compare
{"variant": "good-bad",
 "before": {"label": "Small 4 KB chunks (traditional FS)", "code": "Master keeps 1 billion entries for a 4 TB file\\n→ ~50 GB RAM just for chunk metadata\\n→ Constant Master pressure for every sequential scan\\n→ Hot-spot on any widely-read file"},
 "after": {"label": "Large 64 MB chunks (GFS)", "code": "Only ~62 500 entries for a 4 TB file\\n→ ~3 MB RAM for the same file\\n→ Fewer master interactions; client metadata cache rarely misses\\n→ Sequential disk I/O → saturates spinning-disk bandwidth"}}
\`\`\`

\`\`\`tabs
{"tabs": [
  {"label": "Single Master", "icon": "🧠", "content": "**Pros**\\n- Centralized algorithms — no distributed locking needed for namespace mutations.\\n- Global knowledge enables intelligent chunk placement and re-replication.\\n- Simple consistency: all file namespace mutations are atomic, handled sequentially by the master.\\n\\n**Cons**\\n- RAM limit caps namespace at ~100 M files (all metadata lives in memory).\\n- ~1 000 file-create ops/sec ceiling.\\n- Single point of failure — mitigated by shadow masters and fast log replay, but not eliminated.\\n\\n**Why it works:** Data traffic never touches the master. Throughput scales with ChunkServers, not metadata."},
  {"label": "Append-Only Writes", "icon": "✏️", "content": "**Pros**\\n- Sequential disk I/O on ChunkServers → maximises spinning-disk throughput.\\n- Atomic record append simplifies concurrent writers (MapReduce producers, web crawlers).\\n- No need for distributed locks on the write path.\\n\\n**Cons**\\n- No efficient random update — applications must batch edits into new files.\\n- Retry-induced duplicates require application-level deduplication.\\n- Padding at chunk boundaries wastes up to 64 MB per file."},
  {"label": "Pipeline Replication", "icon": "🔗", "content": "**Pros**\\n- Chain transfer uses only **one outbound link per server** → halves backbone bandwidth vs. fan-out.\\n- Latency is additive across the chain (3 hops ≈ 3× single-hop latency), but bandwidth is preserved.\\n- Close-neighbor forwarding (server sends to its nearest unacknowledged replica) minimises cross-rack traffic.\\n\\n**Cons**\\n- Higher tail latency — if the slowest link is the last hop, the whole pipeline stalls.\\n- A mid-chain failure stalls all subsequent replicas; the primary must return ERROR and trigger a client retry."}
]}
\`\`\`

## GFS Legacy

GFS's architecture directly seeded an entire generation of distributed storage systems:

- **HDFS** (Hadoop Distributed File System) copied the namespace + block separation almost verbatim: NameNode = GFS Master, DataNode = ChunkServer. Still powers the majority of on-premises big-data pipelines.
- **Colossus** (GFS successor, ~2010) replaced the single master with a distributed metadata service using Bigtable and shaved the default chunk size to 1 MB, expanding the namespace ceiling by orders of magnitude.
- **AWS S3, Google Cloud Storage, Azure Blob Storage** all maintain a control plane for metadata and a data plane for object bytes — a direct architectural descendant of GFS's control/data separation.

\`\`\`concept
{"title": "The Enduring Insight", "variant": "insight", "content": "GFS proved that you do not need perfect consistency to build a reliable petabyte-scale storage system. By accepting relaxed consistency — and pushing duplicate suppression to the application — Google unlocked pipeline replication, sequential throughput on commodity disks, and a simple single-master design that ran Google's entire web index for nearly a decade."}
\`\`\`

\`\`\`quiz
{"title": "GFS Architecture Check", "questions": [
  {
    "question": "Why does the GFS Master never participate in read or write data transfers?",
    "options": [
      "It lacks the network bandwidth to handle large files",
      "Keeping the Master out of the data path prevents it from becoming a throughput bottleneck",
      "ChunkServers cannot verify data authenticity without direct client connections",
      "The lease mechanism requires clients to contact ChunkServers first"
    ],
    "answer": 1,
    "explanation": "The Master only handles metadata. All data flows directly between clients and ChunkServers. This is the central design choice that lets throughput scale with the number of ChunkServers rather than being capped by a single process."
  },
  {
    "question": "A client tries to append a record, but one secondary replica fails mid-write. What happens?",
    "options": [
      "The write is committed on the primary and the surviving secondary; the failed replica re-syncs later",
      "The primary returns ERROR; the client retries the entire append, potentially creating a duplicate record",
      "The Master immediately elects a new replica and the write continues transparently",
      "The write is rolled back on all replicas and the file is locked until the failed server recovers"
    ],
    "answer": 1,
    "explanation": "GFS uses relaxed consistency. If any replica fails, the primary returns ERROR and the client retries. The retry may land at a different offset on a different set of replicas, creating a duplicate. Applications handle this with unique record IDs and Bloom filter deduplication."
  },
  {
    "question": "What is the purpose of the 32-bit checksum stored alongside each 64 KB block on a ChunkServer?",
    "options": [
      "To authenticate writes from authorised clients only",
      "To allow the Master to verify metadata integrity across replicas",
      "To detect data corruption during reads, triggering retry on a healthy replica",
      "To compress chunk data before writing to local disk"
    ],
    "answer": 2,
    "explanation": "ChunkServers maintain per-block checksums in memory and on disk. On every read, the overlapping blocks' checksums are verified. A mismatch causes the server to return an error and report corruption to the Master, which then re-replicates from a healthy replica. The client retries transparently."
  },
  {
    "question": "Why does GFS use 64 MB chunks instead of the 4 KB blocks typical of local filesystems?",
    "options": [
      "64 MB matches the page size of commodity Linux kernels",
      "Larger chunks reduce the number of metadata entries the Master must store in RAM and favour sequential I/O patterns",
      "64 MB is the maximum size of a single TCP segment on GFS networks",
      "ChunkServers can only store files larger than 32 MB due to local filesystem limits"
    ],
    "answer": 1,
    "explanation": "Large chunks dramatically shrink the Master's metadata footprint (a 4 TB file needs ~62 500 entries at 64 MB vs. ~1 billion at 4 KB). They also make sequential disk I/O the common case, which is ideal for GFS's primary workload: large streaming reads and append-only writes."
  }
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "A single in-memory Master is viable when all data traffic bypasses it and the file namespace stays below ~100 M entries.",
  "Large 64 MB chunks plus append-only writes turn random I/O into sequential disk throughput — the right trade-off for spinning-disk hardware.",
  "Relaxed consistency pushes duplicate suppression to the application, unlocking pipeline replication and sustained 100 MB/s append throughput.",
  "Rack-aware placement guarantees at least one replica survives any single-rack failure; lazy re-replication restores the replication factor in the background.",
  "GFS's control/data plane separation — Master for metadata, ChunkServers for bytes — became the blueprint for HDFS, Colossus, and every major cloud object store."
]}
\`\`\``,
    },
  ],
};
