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

The Google File System (GFS, published 2003) was designed to store the massive datasets powering Google's search index, MapReduce jobs, and other internal services. It was one of the first systems to prove that reliable storage could be built from thousands of unreliable commodity machines.

\`\`\`concept
{
  "title": "Design Philosophy",
  "variant": "mental-model",
  "content": "GFS treats hardware failure as a **first-class design constraint**, not an edge case. Instead of asking \\"How do we prevent failures?\\", it asks \\"How do we keep working when everything inevitably breaks?\\""
}
\`\`\`

## The Problem

Google needed a file system that could:
- Store petabytes of data across thousands of machines
- Handle files that are typically **hundreds of MB to multi-GB** (not millions of small files)
- Optimize for **append-heavy** workloads (crawl data, log files, MapReduce output)
- Tolerate frequent hardware failures as a **normal operating condition**

## Functional Requirements

1. **Create** and **delete** files in a hierarchical namespace
2. **Read** data from files (typically large sequential reads)
3. **Append** data to files (the dominant write pattern)
4. **Random write** (supported but not optimized)
5. **Snapshot** a file or directory tree

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Storage capacity | Petabytes across 1000+ machines |
| File size | Typical: 100MB - multi-GB |
| Throughput | High sustained bandwidth > low latency |
| Availability | Continue operating during component failures |
| Consistency | Relaxed: defined-but-not-POSIX consistency model |
| Fault tolerance | Assume hardware fails regularly |

\`\`\`quiz
{
  "title": "GFS Requirements Check",
  "questions": [
    {
      "question": "Which workload pattern did GFS optimize for?",
      "options": ["Random writes", "Small random reads", "Large sequential appends", "Frequent file updates"],
      "answer": 2,
      "explanation": "GFS was designed for append-heavy workloads where files are written once and read many times, typical of log files and MapReduce outputs."
    },
    {
      "question": "Why did GFS relax POSIX consistency guarantees?",
      "options": ["To improve security", "To reduce hardware costs", "To achieve higher throughput", "To simplify the API"],
      "answer": 2,
      "explanation": "By relaxing strict POSIX consistency, GFS could achieve higher throughput and better performance for its target workloads."
    },
    {
      "question": "What was the typical chunk size in GFS?",
      "options": ["4KB", "64KB", "1MB", "64MB"],
      "answer": 3,
      "explanation": "GFS used 64MB chunks, much larger than traditional file systems, to reduce metadata overhead and optimize for large files."
    }
  ]
}
\`\`\`

## Design Assumptions

\`\`\`steps
{
  "title": "Core Design Assumptions",
  "steps": [
    {
      "title": "1. Component failures are the NORM",
      "content": "With thousands of machines, something is always broken. Disks fail, networks flake, machines restart — this is business as usual, not an emergency."
    },
    {
      "title": "2. Files are LARGE",
      "content": "Multi-GB files are common. The system optimizes for large files, not millions of small files. This influences chunk size, metadata design, and caching strategies."
    },
    {
      "title": "3. Workloads are append-heavy",
      "content": "Files are written once, then read many times. Random writes are rare. Concurrent appends by multiple clients are common, especially for log aggregation."
    },
    {
      "title": "4. Co-design applications and file system",
      "content": "Applications can tolerate relaxed consistency. Atomicity of appends matters more than strict POSIX semantics. This enables simpler, more efficient protocols."
    }
  ]
}
\`\`\`

## Architecture Preview

\`\`\`sysdiag
{
  "title": "GFS Master-Chunk Architecture",
  "width": 600,
  "height": 360,
  "nodes": [
    {"id": "master", "label": "GFS Master", "x": 300, "y": 60, "kind": "service"},
    {"id": "client", "label": "GFS Client", "x": 100, "y": 180, "kind": "user"},
    {"id": "cs1", "label": "Chunk\\nServer 1", "x": 250, "y": 280, "kind": "storage"},
    {"id": "cs2", "label": "Chunk\\nServer 2", "x": 350, "y": 280, "kind": "storage"},
    {"id": "cs3", "label": "Chunk\\nServer 3", "x": 450, "y": 280, "kind": "storage"}
  ],
  "edges": [
    {"from": "client", "to": "master", "label": "metadata request"},
    {"from": "master", "to": "client", "label": "chunk locations"},
    {"from": "client", "to": "cs1", "label": "read/write data"},
    {"from": "client", "to": "cs2", "label": "read/write data"},
    {"from": "client", "to": "cs3", "label": "read/write data"}
  ],
  "annotations": {
    "master": "Holds all metadata: namespace, file→chunk mapping, chunk→server mapping. Keeps metadata in memory for speed.",
    "client": "First asks master for chunk locations, then talks directly to chunk servers for data transfer.",
    "cs1": "Stores actual chunk data as plain Linux files. Each chunk replicated across 3+ servers for fault tolerance."
  }
}
\`\`\`

**Key insight:** The master handles metadata only. Actual data flows directly between clients and chunk servers. This prevents the master from becoming a throughput bottleneck.

## GFS vs. Traditional File Systems

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Traditional File Systems",
    "code": "• Single machine\\n• File sizes: KB to MB\\n• Failure: rare event\\n• Write pattern: random + sequential\\n• Consistency: strong (POSIX)\\n• Block size: 4KB-64KB\\n• Metadata: distributed"
  },
  "after": {
    "label": "Google File System (GFS)",
    "code": "• Thousands of machines\\n• File sizes: MB to GB\\n• Failure: expected constantly\\n• Write pattern: mostly append\\n• Consistency: relaxed\\n• Chunk size: 64MB\\n• Metadata: single master"
  }
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Common Misconception",
  "content": "GFS did NOT try to be a drop-in replacement for traditional file systems. It was purpose-built for Google's specific workloads and made deliberate trade-offs that would be unacceptable for general-purpose computing."
}
\`\`\`

## Key Takeaway

GFS was designed around the reality of operating at Google's scale: hardware fails constantly, files are large, and workloads are append-heavy. By co-designing the file system with its applications and relaxing POSIX consistency, GFS achieved the throughput and fault tolerance needed to power Google's infrastructure.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "GFS treats hardware failure as a normal operating condition, not an exception to handle",
    "Large chunk size (64MB) reduces metadata overhead and optimizes for sequential access patterns",
    "Separating metadata (master) from data (chunk servers) prevents bottlenecks",
    "Relaxed consistency enables higher throughput for append-heavy workloads",
    "The system was co-designed with applications that could tolerate non-POSIX semantics"
  ]
}
\`\`\``,
    },
    {
      id: "gfs-master-chunk",
      slug: "gfs-master-chunk-architecture",
      title: "Master-Chunk Architecture",
      content: `# Master-Chunk Architecture

GFS uses a single master for all metadata and many chunk servers for data storage. This centralized metadata / distributed data split is the defining architectural decision.

\`\`\`concept
{
  "title": "The Master-Chunk Split",
  "variant": "mental-model",
  "content": "Think of the master as a librarian who knows where every book is shelved, but never touches the books themselves. The chunk servers are the shelves—many, distributed, and holding the actual content. Clients ask the librarian once for a book's location, then go directly to the shelf for all future access."
}
\`\`\`

## The Master

The master stores three types of metadata:

\`\`\`sysdiag
{
  "title": "Master Metadata Components",
  "width": 600,
  "height": 300,
  "nodes": [
    { "id": "ns", "label": "File Namespace\\n/all/data/crawl/2024.dat", "x": 150, "y": 100, "kind": "storage" },
    { "id": "map", "label": "File→Chunk Map\\nfile → [c1, c2, c3]", "x": 300, "y": 100, "kind": "storage" },
    { "id": "loc", "label": "Chunk→Server Map\\nc1 → [A,B,C]\\n(ephemeral)", "x": 450, "y": 100, "kind": "storage" },
    { "id": "log", "label": "Operation Log\\n(write-ahead)", "x": 225, "y": 220, "kind": "service" },
    { "id": "ckpt", "label": "Checkpoint\\n(B-tree snapshot)", "x": 375, "y": 220, "kind": "storage" }
  ],
  "edges": [
    { "from": "log", "to": "ns", "label": "persists" },
    { "from": "log", "to": "map", "label": "persists" },
    { "from": "log", "to": "ckpt", "label": "compact →" }
  ],
  "annotations": {
    "ns": "Hierarchical directory tree, persisted in operation log",
    "map": "Which chunks belong to each file, persisted in operation log",
    "loc": "Which servers hold each chunk, rebuilt from heartbeats on startup",
    "log": "Append-only WAL for durability and recovery",
    "ckpt": "Periodic B-tree snapshot to speed recovery"
  }
}
\`\`\`

### What Is Persisted vs. Rebuilt

| Metadata | Persisted? | How? |
|----------|-----------|------|
| Namespace (file/directory tree) | Yes | Operation log + checkpoints |
| File-to-chunk mapping | Yes | Operation log + checkpoints |
| Chunk-to-server mapping | No | Rebuilt from chunk server heartbeats |

The master does NOT persist chunk locations because chunk servers are the source of truth for what they actually store. On master restart, chunk servers report their chunks, and the master rebuilds the mapping in seconds.

### Operation Log

The operation log is the master's **write-ahead log** -- every metadata mutation (create file, delete file, add chunk) is recorded before being applied:

\`\`\`trace
{
  "title": "Master Recovery with Operation Log",
  "language": "python",
  "code": "# Simulated master restart recovery\\ncheckpoint_ops = 1000  # last checkpoint covered ops 1-1000\\nlog_entries = [\\n    \\"[op 1001] CREATE /data/crawl/2024-03-01.dat\\",\\n    \\"[op 1002] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1001\\",\\n    \\"[op 1003] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1002\\",\\n    \\"[op 1004] DELETE /tmp/scratch-file.dat\\"\\n]\\n\\nprint(\\"1. Load checkpoint (ops 1-1000)\\")\\nprint(\\"2. Replay log entries after checkpoint:\\")\\nfor entry in log_entries:\\n    print(f\\"   {entry}\\")\\nprint(\\"3. Master state consistent, ready to serve\\")",
  "frames": [
    { "line": 1, "vars": { "checkpoint_ops": 1000 }, "note": "Checkpoint covers first 1000 operations", "stdout": "" },
    { "line": 6, "vars": { "checkpoint_ops": 1000 }, "note": "Load checkpoint into memory", "stdout": "1. Load checkpoint (ops 1-1000)" },
    { "line": 7, "vars": { "checkpoint_ops": 1000 }, "note": "Replay remaining log entries", "stdout": "2. Replay log entries after checkpoint:" },
    { "line": 9, "vars": { "checkpoint_ops": 1000 }, "note": "Each entry updates in-memory state", "stdout": "   [op 1001] CREATE /data/crawl/2024-03-01.dat\\n   [op 1002] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1001\\n   [op 1003] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1002\\n   [op 1004] DELETE /tmp/scratch-file.dat" },
    { "line": 10, "vars": { "checkpoint_ops": 1000 }, "note": "Recovery complete", "stdout": "3. Master state consistent, ready to serve" }
  ],
  "speed": 600
}
\`\`\`

Recovery: load latest checkpoint, then replay operation log entries after the checkpoint.

## Chunk Servers

Chunk servers store **chunks** -- fixed-size pieces of files (default: 64MB). Each chunk is stored as a regular Linux file on the chunk server's local disk.

\`\`\`
Chunk Server A
==============

Disk:
  /gfs-data/chunk_c_1001  (64MB)
  /gfs-data/chunk_c_1002  (64MB)
  /gfs-data/chunk_c_2005  (64MB)
  ...

Each chunk:
  - Stored as a plain Linux file
  - Has a checksum per 64KB block (for integrity)
  - Replicated to 2 other chunk servers
\`\`\`

## Why 64MB Chunks?

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Small Chunks (4KB)",
    "code": "File: 1 GB movie file\\nChunks: 262,144 chunks\\nMetadata: 262k entries in master\\nMemory: ~16 MB just for this file\\nClient reads: 1000+ master requests\\nNetwork: 1000+ small RPCs"
  },
  "after": {
    "label": "Large Chunks (64MB)",
    "code": "File: 1 GB movie file  \\nChunks: 16 chunks\\nMetadata: 16 entries in master\\nMemory: ~1 KB for this file\\nClient reads: 1 master request + cache\\nNetwork: 16 large transfers"
  }
}
\`\`\`

**64MB is the sweet spot** for GFS's workload: large sequential reads/writes, few files, and a desire to minimize master interaction.

## Master Scalability

The single master is a potential bottleneck. GFS mitigates this:

\`\`\`steps
{
  "title": "Master Bottleneck Mitigation",
  "steps": [
    {
      "title": "1. Metadata Fits in RAM",
      "content": "~64 bytes per chunk metadata\\n1 billion chunks = ~64GB RAM (feasible on modern servers)\\nAll metadata operations are memory-speed, no disk seeks"
    },
    {
      "title": "2. Client Caching",
      "content": "Client asks master once for chunk locations, then caches them\\nSubsequent reads/writes go directly to chunk servers\\nCache hit rate > 99% for sequential workloads"
    },
    {
      "title": "3. Data Bypasses Master",
      "content": "Master handles only metadata (~KB per request)\\nData flows client ↔ chunk server (~MB per request)\\n10 Gbps data path doesn't touch master"
    },
    {
      "title": "4. Prefetching",
      "content": "Client requests locations for multiple upcoming chunks in one RPC\\nReduces master QPS by 5-10x for sequential reads"
    }
  ]
}
\`\`\`

## Shadow Masters

For read availability, GFS runs **shadow masters** that replicate the operation log and serve read-only metadata queries. If the primary master is down, clients can still read (but not write) file metadata.

\`\`\`quiz
{
  "title": "Master-Chunk Architecture Quiz",
  "questions": [
    {
      "question": "Which metadata does the master NOT persist to disk?",
      "options": [
        "File namespace (directory tree)",
        "File-to-chunk mapping",
        "Chunk-to-server mapping",
        "Operation log entries"
      ],
      "answer": 2,
      "explanation": "Chunk-to-server mapping is ephemeral and rebuilt from chunk server heartbeats on startup, since chunk servers are the ground truth for what they store."
    },
    {
      "question": "Why does GFS use 64MB chunks instead of 4KB blocks?",
      "options": [
        "Better disk space utilization",
        "Faster random write performance",
        "Reduced metadata overhead and master interaction",
        "Stronger consistency guarantees"
      ],
      "answer": 2,
      "explanation": "Large chunks reduce the number of metadata entries per file from millions to tens, fitting metadata in RAM and minimizing client-master RPCs."
    },
    {
      "question": "How do shadow masters differ from the primary master?",
      "options": [
        "They handle write operations when primary is overloaded",
        "They serve read-only metadata and lag slightly behind",
        "They store a complete replica of all chunk data",
        "They automatically promote to primary on failure"
      ],
      "answer": 1,
      "explanation": "Shadow masters replicate the operation log and serve read-only queries but cannot handle mutations, providing read availability during primary failures."
    }
  ]
}
\`\`\`

Primary Master: handles all mutations  
Shadow Masters: read-only replicas, slightly stale  
  - Replicate operation log from primary  
  - Can serve namespace lookups and chunk locations  
  - Cannot handle file creation/deletion  

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "GFS splits metadata (single master) from data (many chunkservers) to simplify design while scaling throughput",
    "64MB chunks minimize metadata per file and client-master interactions, crucial for large sequential workloads",
    "Master persists only namespace and file-to-chunk mappings; chunk locations are rebuilt from server heartbeats",
    "Client caching and data bypass ensure the single master isn't a throughput bottleneck for data operations",
    "Shadow masters provide read availability during primary failures by replicating the operation log"
  ]
}
\`\`\``,
    },
    {
      id: "gfs-chunk-placement",
      slug: "gfs-chunk-placement-replication",
      title: "Chunk Placement & Replication",
      content: `# Chunk Placement & Replication

GFS replicates each chunk to multiple chunk servers for durability and availability. The master carefully places replicas to maximize fault tolerance while balancing load across the cluster.

## Replication Factor

Each chunk is replicated to **3** chunk servers by default (configurable per directory). The master tracks which servers hold each replica.

\`\`\`concept
{
  "title": "Why 3 Replicas?",
  "variant": "mental-model",
  "content": "Three replicas provide a sweet spot between durability and storage overhead. With 3 copies, GFS can tolerate simultaneous failure of 2 replicas while maintaining data availability. This covers common failure scenarios like a server crash plus a rack outage, or maintenance on one replica while another fails unexpectedly."
}
\`\`\`

\`\`\`
Chunk c_1001 (from file /data/crawl/2024-03-01.dat):

  Primary:  ChunkServer A  (Rack 1)
  Replica:  ChunkServer D  (Rack 2)  
  Replica:  ChunkServer G  (Rack 3)

3 copies across 3 different racks.
\`\`\`

## Placement Policy

The master uses a placement policy that considers multiple factors:

\`\`\`steps
{
  "title": "Chunk Placement Decision Process",
  "steps": [
    {
      "title": "1. Spread Across Racks",
      "content": "Place replicas on different racks to tolerate entire rack failures (power, network switch). At least 2 racks per chunk ensures availability even if one rack goes dark."
    },
    {
      "title": "2. Balance Disk Utilization", 
      "content": "Prefer chunk servers with more free space to equalize storage load. This prevents hotspots where some servers fill up while others sit idle."
    },
    {
      "title": "3. Limit Recent Creation Rate",
      "content": "Avoid servers that recently received many chunks. These servers are likely handling write traffic, and adding more chunks would create write hotspots."
    },
    {
      "title": "4. Network Proximity",
      "content": "Ensure primary and replicas have good network connectivity for efficient replication during writes. This minimizes cross-rack traffic when possible."
    }
  ]
}
\`\`\`

### Rack-Aware Placement

\`\`\`sysdiag
{
  "title": "Rack-Aware Chunk Placement",
  "width": 600,
  "height": 400,
  "nodes": [
    {"id": "rack1", "label": "Rack 1", "x": 100, "y": 100, "kind": "group"},
    {"id": "rack2", "label": "Rack 2", "x": 250, "y": 100, "kind": "group"},
    {"id": "rack3", "label": "Rack 3", "x": 400, "y": 100, "kind": "group"},
    {"id": "csa", "label": "CS-A", "x": 100, "y": 150, "kind": "storage"},
    {"id": "csd", "label": "CS-D", "x": 250, "y": 150, "kind": "storage"},
    {"id": "csg", "label": "CS-G", "x": 400, "y": 150, "kind": "storage"},
    {"id": "switch", "label": "Core Switch", "x": 250, "y": 250, "kind": "service"}
  ],
  "edges": [
    {"from": "rack1", "to": "switch", "label": "network"},
    {"from": "rack2", "to": "switch", "label": "network"},
    {"from": "rack3", "to": "switch", "label": "network"}
  ],
  "annotations": {
    "csa": "Primary replica of chunk c_1001",
    "csd": "Secondary replica of chunk c_1001", 
    "csg": "Tertiary replica of chunk c_1001",
    "switch": "Single point of network failure - but extremely rare"
  }
}
\`\`\`

## Re-Replication

When the number of replicas drops below the target (due to server failure, disk corruption, or increased replication factor), the master initiates **re-replication**:

\`\`\`trace
{
  "title": "Re-Replication Process",
  "language": "python",
  "code": "# Initial state: 3 replicas\\nchunk_c1001 = ['CS-A', 'CS-D', 'CS-G']\\n\\n# CS-A fails - master detects via missed heartbeats\\nchunk_c1001 = ['CS-D', 'CS-G']  # Only 2 replicas now\\n\\n# Master selects CS-H (has free space, low recent creation)\\n# CS-H clones from CS-D (network proximity)\\nchunk_c1001 = ['CS-D', 'CS-G', 'CS-H']  # Back to 3 replicas",
  "frames": [
    {"line": 2, "vars": {"chunk_c1001": ["CS-A", "CS-D", "CS-G"]}, "note": "Healthy state: 3 replicas across 3 racks"},
    {"line": 5, "vars": {"chunk_c1001": ["CS-D", "CS-G"]}, "note": "CS-A fails - replica count drops to 2"},
    {"line": 8, "vars": {"chunk_c1001": ["CS-D", "CS-G", "CS-H"]}, "note": "Re-replication complete - 3 replicas restored"}
  ],
  "speed": 1000
}
\`\`\`

### Cloning Throttling

Re-replication consumes network and disk bandwidth. The master limits:
- Number of concurrent clone operations per chunk server
- Total cluster-wide cloning bandwidth
- This prevents a cascade: one rack failure triggering so much cloning that it degrades normal client traffic.

## Rebalancing

The master periodically examines chunk distribution and **rebalances** by moving replicas to:
- Even out disk utilization across servers
- Integrate newly added chunk servers (gradually fill them)
- Redistribute after rack topology changes

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Before: New server CS-M added",
    "code": "CS-A: 800 chunks    CS-D: 750 chunks\\nCS-G: 780 chunks    CS-M: 0 chunks (new)\\n\\nTotal: 2330 chunks across 3 servers\\nAverage: 582 chunks per server"
  },
  "after": {
    "label": "After: Gradual rebalancing",
    "code": "CS-A: 600 chunks    CS-D: 575 chunks\\nCS-G: 580 chunks    CS-M: 575 chunks\\n\\nTotal: 2330 chunks across 4 servers\\nAverage: 582 chunks per server"
  }
}
\`\`\`

## Chunk Version Numbers

Each chunk has a **version number** that increments when a new lease is granted. This detects stale replicas:

\`\`\`algoviz
{
  "title": "Version-Based Stale Replica Detection",
  "type": "array",
  "data": ["v4", "v5", "v5"],
  "frames": [
    {"highlight": [0], "label": "CS-D reports version 4", "stats": {"current_version": 5}},
    {"highlight": [1, 2], "label": "CS-A and CS-G report version 5", "stats": {"current_version": 5}},
    {"highlight": [0], "label": "Master detects stale replica v4", "stats": {"action": "garbage_collect"}}
  ],
  "speed": 1200
}
\`\`\`

## Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "GFS uses rack-aware placement to spread 3 replicas across different racks, tolerating rack-level failures",
    "Placement policy balances fault tolerance, disk utilization, and write hotspots through multi-factor scoring",
    "Re-replication automatically restores replica count when servers fail, with throttling to prevent cascading overload",
    "Version numbers detect stale replicas after server outages, ensuring data consistency",
    "Periodic rebalancing maintains even load distribution as cluster topology changes"
  ]
}
\`\`\``,
    },
    {
      id: "gfs-write-read",
      slug: "gfs-write-read-flows",
      title: "Write & Read Flows",
      content: `# Write & Read Flows

GFS separates the **control flow** (through the master) from the **data flow** (directly between clients and chunk servers). This is key to its scalability.

\`\`\`concept
{
  "title": "Control vs. Data Flow",
  "variant": "mental-model",
  "content": "Think of the master as a traffic controller and chunk servers as highways. The controller tells you which road to take, but the actual driving happens directly on the highways — no need to go through the controller every time."
}
\`\`\`

## Leases and Mutation Order

For each chunk with active mutations, the master grants a **lease** to one replica, designating it as the **primary**. The primary determines the order of all mutations to that chunk.

\`\`\`steps
{
  "title": "Lease Mechanism",
  "steps": [
    {
      "title": "1. Master grants lease",
      "content": "Master grants a 60-second lease to ChunkServer A for chunk c_1001. A becomes the PRIMARY for c_1001."
    },
    {
      "title": "2. Primary orders mutations",
      "content": "All mutations go through A, which assigns serial numbers to ensure consistent ordering across replicas."
    },
    {
      "title": "3. Lease extension",
      "content": "Lease can be extended indefinitely via heartbeats as long as the primary is healthy."
    },
    {
      "title": "4. Primary failure",
      "content": "If primary fails, master waits for lease to expire then grants new lease to another replica."
    }
  ]
}
\`\`\`

## Write Flow (Record Append)

Record append is GFS's most important operation. Multiple clients can append to the same file concurrently, and GFS guarantees **atomic append** (the record is appended at least once, atomically).

\`\`\`algoviz
{
  "title": "Record Append Flow Visualization",
  "type": "array",
  "data": ["Client", "Master", "CS-A (Primary)", "CS-D", "CS-G"],
  "frames": [
    {
      "highlight": [0, 1],
      "label": "Step 1: Client asks Master for chunk locations",
      "stats": {"step": 1}
    },
    {
      "highlight": [0, 2, 3, 4],
      "label": "Step 2: Client pushes data to ALL replicas (pipelined)",
      "stats": {"step": 2}
    },
    {
      "highlight": [0, 2],
      "label": "Step 3: Client sends write request to Primary",
      "stats": {"step": 3}
    },
    {
      "highlight": [2, 3, 4],
      "label": "Step 4: Primary assigns serial number and coordinates writes",
      "stats": {"step": 4}
    },
    {
      "highlight": [2, 0],
      "label": "Step 6: Primary responds to client with result",
      "stats": {"step": 6}
    }
  ],
  "speed": 1000
}
\`\`\`

### Pipeline Optimization

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Fan-out Transfer",
    "code": "Client sends 64MB to CS-A\\nClient sends 64MB to CS-D  \\nClient sends 64MB to CS-G\\n\\nTotal time ≈ 3 × (64MB / 10Gbps)"
  },
  "after": {
    "label": "Pipeline Transfer",
    "code": "Client ----[10Gbps]----> CS-A ----[10Gbps]----> CS-D ----[10Gbps]----> CS-G\\n\\nTotal time ≈ (64MB / 10Gbps) + 2 × latency\\nMuch faster than fan-out approach"
  }
}
\`\`\`

## Read Flow

\`\`\`trace
{
  "title": "Read Flow Execution Trace",
  "language": "python",
  "code": "# Client wants to read bytes [100MB, 100MB+1MB] from file F\\noffset = 100 * 1024 * 1024  # 100MB\\nlength = 1024 * 1024       # 1MB\\n\\n# Step 1: Compute chunk index\\nchunk_index = offset // (64 * 1024 * 1024)  # 64MB chunks\\nbyte_offset = offset % (64 * 1024 * 1024)\\nprint(f\\"Reading from chunk {chunk_index}, offset {byte_offset}\\")\\n\\n# Step 2: Ask master for locations\\n# Master responds: chunk_id=c_1003, servers=[CS-B, CS-E, CS-H]\\n\\n# Step 3: Read from closest server (CS-B)\\n# Client --> CS-B: \\"Read c_1003, offset=12345, length=50000\\"\\n\\n# Step 4: CS-B reads and returns data\\n# CS-B verifies checksum of 64KB blocks\\n# CS-B --> Client: data",
  "frames": [
    {
      "line": 4,
      "vars": {"offset": 104857600, "chunk_index": 1, "byte_offset": 39845888},
      "note": "Client calculates which chunk contains the data",
      "stdout": "Reading from chunk 1, offset 39845888"
    },
    {
      "line": 8,
      "vars": {"chunk_id": "c_1003", "servers": ["CS-B", "CS-E", "CS-H"]},
      "note": "Master provides chunk locations",
      "stdout": "Master: chunk c_1003 available on [CS-B, CS-E, CS-H]"
    },
    {
      "line": 11,
      "vars": {"selected_server": "CS-B"},
      "note": "Client reads directly from closest replica",
      "stdout": "Reading 50000 bytes from CS-B"
    }
  ],
  "speed": 1200
}
\`\`\`

### Checksum Verification

Each 64MB chunk is divided into 64KB blocks, each with a 32-bit checksum. On read, the server computes the checksum and compares it with the stored value.

\`\`\`callout
{
  "type": "warning",
  "title": "Data Corruption Handling",
  "content": "If checksums don't match, the chunk server returns an error. The client automatically retries with a different replica, and the master is notified to trigger re-replication of the corrupted chunk."
}
\`\`\`

## Consistency Model

GFS provides a relaxed consistency model optimized for performance:

| Operation | Consistency Guarantee |
|-----------|----------------------|
| File namespace ops (create, delete) | Atomic, consistent (master handles) |
| Record append | At-least-once, atomic per record |
| Random write | Concurrent writes may interleave (undefined) |

\`\`\`quiz
{
  "title": "GFS Consistency Model",
  "questions": [
    {
      "question": "What happens when a record append doesn't fit in the current chunk?",
      "options": ["The write fails", "The record is split across chunks", "The current chunk is padded and client retries on next chunk", "The record is truncated"],
      "answer": 2,
      "explanation": "When a record doesn't fit, the primary pads the current chunk to 64MB and tells the client to retry on the next chunk."
    },
    {
      "question": "Why might record append produce duplicates?",
      "options": ["Network partitions", "Client retries after partial failures", "Checksum mismatches", "Master failures"],
      "answer": 1,
      "explanation": "If a replica fails during append and the client retries, the same record may be written again, creating duplicates."
    },
    {
      "question": "How should applications handle GFS duplicates and padding?",
      "options": ["Ignore them", "Use record IDs to deduplicate and check record boundaries", "Always read entire files", "Use external locking"],
      "answer": 1,
      "explanation": "Applications should include record IDs for deduplication and validate record boundaries to handle padding."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "GFS separates control flow (master) from data flow (chunk servers), enabling high throughput",
    "Pipelined chain replication minimizes write latency by overlapping network transfers",
    "The lease mechanism ensures consistent ordering of mutations across replicas",
    "Relaxed consistency model trades strict guarantees for performance - applications must handle duplicates and padding",
    "Checksum verification at the chunk level ensures data integrity and automatic corruption recovery"
  ]
}
\`\`\``,
    },
    {
      id: "gfs-fault-tolerance",
      slug: "gfs-fault-tolerance",
      title: "Fault Tolerance & Recovery",
      content: `# Fault Tolerance & Recovery

GFS was designed with the assumption that hardware failures are routine. Every component has a failure mode, and every failure mode has a recovery mechanism.

\`\`\`concept
{"title": "GFS Failure Philosophy", "variant": "mental-model", "content": "Treat failures as the common case, not the exception. Design every layer—disk, machine, rack, network—with redundancy and fast, automated recovery. The system is pessimistic about hardware but optimistic about software’s ability to heal quickly."}
\`\`\`

## Failure Categories

\`\`\`tabs
{"tabs": [{"label": "Chunk Server", "content": "**Most frequent** — disk crash, kernel panic, NIC failure.\\n\\nImpact: replicas on that machine become temporarily unavailable; read/write traffic shifts to remaining replicas."}, {"label": "Master", "content": "**Most critical** — single metadata source.\\n\\nImpact: no new file creation, no re-balancing, no garbage collection; existing data reads continue because clients cache chunk locations."}, {"label": "Data Corruption", "content": "**Silent** — bit-rot, RAM errors, bus glitches.\\n\\nImpact: returned bits are wrong; detected only via checksum mismatch on read or background scrub."}, {"label": "Network Partition", "content": "**Transient** — switch reboot, cable cut.\\n\\nImpact: chunk servers unreachable; lease mechanism prevents split-brain writes."}]}
\`\`\`

## Chunk Server Failure

\`\`\`algoviz
{"title": "Re-replication After a Chunk Server Dies", "type": "array", "data": ["c1001","c1002","c1003","c1004","c1005"], "frames": [
  {"highlight": [0,1,2], "label": "CS-5 holds replicas of c1001, c1002, c1003", "stats": {"replFactor":3}},
  {"highlight": [], "label": "CS-5 heartbeats stop → master marks its chunks under-replicated", "stats": {"replFactor":2}},
  {"highlight": [0], "label": "Master queues c1001 (now 2 replicas) as HIGH priority", "stats": {"urgent":1,"high":3}},
  {"highlight": [0], "label": "Clone c1001 to CS-7; replication factor back to 3", "stats": {"replFactor":3}}
], "speed": 1000}
\`\`\`

When a chunk-server process disappears, the master reacts within **30 s** (heartbeat timeout):

1. Marks every chunk on that server as **under-replicated**.
2. Prioritizes re-replication:
   - 1 replica left → **URGENT**
   - 2 replicas left → **HIGH**
   - 3+ replicas → normal background
3. Schedules cloning tasks to healthy servers, preferably on a different rack.
4. If the lost server returns, its **chunk version numbers** are checked; stale replicas are garbage-collected automatically.

\`\`\`quiz
{"title": "Quick Check: Chunk Recovery", "questions": [
  {"question": "A chunk has three replicas on servers A, B, C. Server C goes offline. What priority does the master assign to re-replicating its chunks?", "options": ["URGENT", "HIGH", "NORMAL", "LOW"], "answer": 1, "explanation": "With two replicas still online the chunk is not yet critical, so the master labels it HIGH priority."},
  {"question": "During re-replication, which replica does the master use as the source?", "options": ["The closest replica by IP", "A replica on a different rack", "Any replica with the highest version number", "The replica that reported first after the crash"], "answer": 2, "explanation": "Version numbers detect staleness; the master always clones from an up-to-date replica."},
  {"question": "Why does GFS wait ~30 s before declaring a chunk server dead?", "options": ["To avoid false positives from transient network hiccups", "To batch heartbeats for efficiency", "Because checkpoints are taken every 30 s", "To let leases expire naturally"], "answer": 0, "explanation": "A short timeout balances fast failure detection with tolerance for brief network glitches."}
]}
\`\`\`

## Master Failure & Recovery

The master is GFS’s only single point of failure, so recovery must be **fast** and **reliable**.

\`\`\`steps
{"title": "Master Recovery Timeline", "steps": [
  {"title": "T = 0 s", "content": "Master process crashes (OOM, seg-fault, kernel panic)."},
  {"title": "T = 0–5 s", "content": "External monitor notices health-check failure and restarts the process on the same or a new machine."},
  {"title": "T = 5–10 s", "content": "New process loads the latest in-memory checkpoint (compact B-tree image)."},
  {"title": "T = 10–15 s", "content": "Replays operation-log entries created after that checkpoint to restore exact state."},
  {"title": "T = 15–60 s", "content": "Waits for chunk-server heartbeats; rebuilds the chunk-to-server mapping."},
  {"title": "T ≈ 60 s", "content": "Master begins accepting client requests; write traffic resumes."}
]}
\`\`\`

- **Operation log** is replicated to **multiple remote disks** before the metadata change is applied (WAL).
- **Checkpoints** every few minutes shrink log replay time.
- **Shadow masters** serve **stale but read-only** metadata while the primary is down; they lag by only a few seconds.

## Data Integrity: Checksums

Every **64 KB block** carries a **32-bit checksum** stored separately in memory and on disk.

\`\`\`trace
{"title": "Detecting Bit-Rot on Read", "language": "python", "code": "def read_block(fd, block_id):\\n    data = disk_read(fd, block_id)          # 64 KB\\n    stored_cs = checksum_table[block_id]\\n    computed_cs = crc32(data)\\n    if computed_cs != stored_cs:\\n        report_corruption(block_id)\\n        raise IOError('checksum mismatch')\\n    return data", "frames": [
  {"line": 2, "vars": {"block_id": 17}, "stdout": ""},
  {"line": 3, "vars": {"stored_cs": 3735928559}, "stdout": ""},
  {"line": 4, "vars": {"computed_cs": 4027432734}, "stdout": ""},
  {"line": 5, "vars": {}, "stdout": "CORRUPTION DETECTED on block 17"},
  {"line": 6, "vars": {}, "stdout": ""}
], "speed": 900}
\`\`\`

- **On read**: mismatch → error returned to client; client retries another replica.
- **On idle**: background scrubber verifies little-used blocks, fighting **bit rot**.
- **On append**: incremental update of the last partial block; full blocks get fresh checksums.

## Lease Mechanism Prevents Split-Brain

\`\`\`compare
{"variant": "before-after", "before": {"label": "Without Leases", "code": "1. Master grants primary role to CS-A\\n2. Network partition isolates CS-A\\n3. Master (thinking CS-A is dead) grants primary to CS-D\\n4. Both CS-A & CS-D accept writes → INCONSISTENT CHUNK"}, "after": {"label": "With 60-s Leases", "code": "1. Master grants lease to CS-A until T+60 s\\n2. Partition isolates CS-A; its lease still valid\\n3. Master waits until T+60 s to appoint CS-D\\n4. After lease expiry only CS-D is primary → SINGLE WRITER"}}
\`\`\`

Leases provide a **time-bound lock**: the master promises not to appoint a second primary until the lease expires, guaranteeing **single-writer** semantics even during network partitions.

## Garbage Collection

Instead of synchronous deletion, GFS renames deleted files to **hidden names** including a deletion timestamp. A background scanner later removes files older than **3 days**, then tells chunk servers to delete the orphaned chunks.

**Benefits**  
- Acts as a built-in **recycle bin**  
- Batches deletions for efficiency  
- Avoids race conditions between concurrent deletes and creations

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Redundancy everywhere: 3× chunk replicas, replicated operation log, checksums, and lease-based consistency.",
  "Failure is routine: fast detection (heartbeats, checksums) plus automatic re-replication keeps data availability high.",
  "Master recovery in ~60 s via checkpoint + log replay; shadow masters provide read-only fallback.",
  "Leases guarantee single-writer consistency across network partitions.",
  "Lazy garbage collection simplifies deletion and provides an undo window."
]}
\`\`\``,
    },
    {
      id: "gfs-architecture",
      slug: "gfs-architecture-walkthrough",
      title: "GFS: Architecture Walkthrough",
      content: `# GFS: Architecture Walkthrough

Let’s stitch every moving part into one living system. Below is the Google File System in action—metadata, chunks, failures, and trade-offs—rendered as an end-to-end walkthrough.

\`\`\`concept
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
   "master": "Single active process holding all metadata in memory plus a replicated operation log on disk.",
   "client": "Linked library that first contacts the Master, then streams bytes directly to/from ChunkServers.",
   "csA": "Each 64 MB chunk is stored as a plain Linux file with a companion checksum block."
 }}
\`\`\`

## Write Path: Record Append End-to-End

\`\`\`steps
{"title": "Appending a 64 kB Crawl Record", "steps": [
  {"title": "1. Ask the Master for the last chunk", "content": "Client sends \`getLastChunk(/data/crawl/2024-03-01.dat)\`.\\nMaster replies:\\n- chunk handle \`c_1005\`\\n- primary replica: \`CS-A\`\\n- secondary replicas: \`[CS-C, CS-D]\`\\n- chunk version \`7\`"},
  {"title": "2. Push data through the pipeline", "content": "Client sends the 64 kB record to CS-A, which forwards to CS-C, which forwards to CS-D. Each server buffers the data in memory but does **not** commit yet."},
  {"title": "3. Primary orders the append", "content": "Client sends \`append(c_1005)\` to CS-A (primary). CS-A picks serial number \`42\`, computes next offset \`3 145 728\`, and sends write commands to replicas."},
  {"title": "4. Replicas ACK the primary", "content": "CS-C and CS-D write the record at offset \`3 145 728\`, verify checksums, and reply SUCCESS to the primary."},
  {"title": "5. Primary commits and replies", "content": "CS-A writes the record, then returns \`(SUCCESS, offset=3145728)\` to the client. If any replica fails, the primary returns ERROR and the client **retries the entire append**."}
]}
\`\`\`

\`\`\`trace
{"title": "Client-Code Trace for the Append", "language": "python", "code": "# client.py\\nfd = gfs_open(\\"/data/crawl/2024-03-01.dat\\", \\"a\\")\\ngfs_write(fd, record_bytes)        # 64 kB\\noffset = gfs_tell(fd)              # returns 3145728\\ngfs_close(fd)", "frames": [
  {"line": 2, "vars": {"fd": 17}, "note": "library caches chunk c_1005 mapping"},
  {"line": 3, "vars": {"record_bytes": "bytes[65536]"}, "stdout": "pushing to pipeline CS-A->CS-C->CS-D"},
  {"line": 4, "vars": {"offset": 3145728}, "stdout": "SUCCESS at offset 3145728"}
], "speed": 1000}
\`\`\`

## Read Path End-to-End

\`\`\`algoviz
{"title": "Reading Bytes 200 000 000–200 500 000", "type": "array", "data": ["chunk-0", "chunk-1", "chunk-2", "chunk-3"],
 "frames": [
  {"highlight": [2], "label": "byte 200 M falls in chunk index 2 (64 MB chunks)", "stats": {"chunk_idx": 2, "byte_in_chunk": 65782272}},
  {"highlight": [2], "label": "client caches chunk-2 locations [CS-B, CS-C, CS-D]", "stats": {"picked": "CS-B (lowest RTT)"}},
  {"highlight": [2], "label": "CS-B reads block 1004, verifies checksum, returns 500 kB", "stats": {"status": "OK"}}
 ], "speed": 900}
\`\`\`

## Failure Recovery Summary

| Failure | Detection | Recovery | Downtime |
|---------|-----------|----------|----------|
| Chunk-server crash | Missing heartbeat (30 s) | Master marks replicas stale, re-replicates to new servers | Reads: zero (other replicas). Writes: wait for lease expiry (~60 s) then pick new primary. |
| Disk corruption | Checksum mismatch on read | Client retries on next replica; server deletes corrupt block; Master schedules re-replication | Zero—client sees no error. |
| Master crash | External health-check | Shadow promoted; replays operation log; gathers chunk reports | ~60 s until new Master ready. |
| Master machine death | Hardware watchdog | Start image on new box with replicated log | Minutes—depends on VM provisioning. |
| Network partition | Heartbeat timeout | Leases expire, preventing split-brain; isolated servers rejoin later | Partial—only replicas in minority partition become unavailable. |
| Whole-rack failure | Multiple heartbeats from same rack | Rack-aware placement guarantees at least one replica survives | Background re-replication from surviving racks. |

\`\`\`callout
{"type": "warning", "title": "Relaxed Consistency = App Responsibility", "content": "Because append retries can produce duplicates at arbitrary offsets, every crawl record embeds a unique ID. The reader filters duplicates using a Bloom filter—**not** the file system."}
\`\`\`

## GFS Design Trade-offs

\`\`\`compare
{"variant": "good-bad",
 "before": {"label": "Small 64 kB chunks", "code": "Master must keep 1 M entries for 64 GB file\\n→ 1 GB RAM just for metadata\\nHot-spot on popular files"},
 "after": {"label": "Large 64 MB chunks", "code": "Only 1 000 entries for 64 GB file\\n→ 1 MB RAM\\nFewer master interactions, sequential disk I/O"}}
\`\`\`

\`\`\`tabs
{"tabs": [
  {"label": "Single Master", "content": "**Good**: Simple centralized algorithms, easy consistency, no distributed locking.\\n\\n**Bad**: RAM limit ~100 M files; ~1 k file-create ops/sec. Data I/O bypasses Master, so throughput scales with chunk servers, not metadata."},
  {"label": "Append-Only Writes", "content": "**Good**: Sequential disk I/O on chunk servers; atomic record append simplifies concurrent writers.\\n\\n**Bad**: No efficient random update; applications must batch edits into new files."},
  {"label": "Pipeline Replication", "content": "**Good**: Chain transfer uses only one outbound link per server → halves backbone bandwidth vs. fan-out.\\n\\n**Bad**: Higher latency for last replica; if a link is slow the whole pipeline stalls."}
]}
\`\`\`

## GFS Legacy

- **HDFS** copied the namespace + block separation: NameNode = GFS Master, DataNode = ChunkServer.  
- **Colossus** replaced the single master with a distributed metadata service and shaved chunk size to 1 MB.  
- **AWS S3, GCS, Azure Blob** all keep a control plane for metadata and a data plane for blobs—direct descendants of GFS.

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "A single in-memory master is viable when data traffic bypasses it and the namespace is modest.",
  "Large chunks + append-only writes turn random I/O into sequential disk throughput, crucial for spinning disks.",
  "Relaxed consistency pushes duplicate suppression to the application, unlocking pipeline replication and 100 MB/s writes.",
  "Rack-aware, pipeline replication plus lazy re-replication gives petabyte-scale durability on commodity boxes."
]}
\`\`\``,
    },
  ],
};
