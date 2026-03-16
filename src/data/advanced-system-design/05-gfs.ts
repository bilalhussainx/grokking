import { Module } from "../types";

export const gfsModule: Module = {
  id: "design-gfs",
  title: "Designing Google File System (GFS)",
  description:
    "Explore the Google File System architecture: master-chunk design, chunk placement and replication, write and read flows, and fault tolerance mechanisms.",
  lessons: [
    {
      id: "gfs-requirements",
      slug: "gfs-requirements",
      title: "GFS: Requirements & Motivation",
      content: `# GFS: Requirements & Motivation

The Google File System (GFS, published 2003) was designed to store the massive datasets powering Google's search index, MapReduce jobs, and other internal services. It was one of the first systems to prove that reliable storage could be built from thousands of unreliable commodity machines.

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

## Design Assumptions

\`\`\`
GFS Design Assumptions
=======================

1. Component failures are the NORM, not the exception
   - Thousands of machines = something is always broken
   - Disks fail, networks flake, machines restart

2. Files are LARGE
   - Multi-GB files are common
   - Optimize for large files, not millions of small files

3. Workloads are append-heavy
   - Files are written once, then read many times
   - Random writes are rare
   - Concurrent appends by multiple clients are common

4. Co-design the application and file system
   - Applications can tolerate relaxed consistency
   - Atomicity of appends matters more than strict POSIX semantics
\`\`\`

## Architecture Preview

\`\`\`
GFS High-Level Architecture
============================

                +------------------+
                |   GFS Master     |
                | (metadata only)  |
                | - namespace      |
                | - file->chunks   |
                | - chunk->servers |
                +------------------+
                   ^         |
         metadata  |         | chunk locations
         ops       |         |
                   |         v
+--------+    +--------+  +--------+  +--------+
| Client | -> | Chunk  |  | Chunk  |  | Chunk  |
|        |    |Server 1|  |Server 2|  |Server 3|
+--------+    +--------+  +--------+  +--------+
  |               |             |           |
  +--- data flows directly between client and chunk servers ---+
\`\`\`

**Key insight:** The master handles metadata only. Actual data flows directly between clients and chunk servers. This prevents the master from becoming a throughput bottleneck.

## GFS vs. Traditional File Systems

| Property | Traditional FS | GFS |
|----------|---------------|-----|
| Node count | Single machine | Thousands |
| File size | KB to MB | MB to GB |
| Failure model | Rare | Expected |
| Write pattern | Random + sequential | Mostly append |
| Consistency | Strong (POSIX) | Relaxed |
| Chunk size | 4KB-64KB blocks | 64MB chunks |
| Metadata | Distributed in file system | Single master |

## Key Takeaway

GFS was designed around the reality of operating at Google's scale: hardware fails constantly, files are large, and workloads are append-heavy. By co-designing the file system with its applications and relaxing POSIX consistency, GFS achieved the throughput and fault tolerance needed to power Google's infrastructure.`,
    },
    {
      id: "gfs-master-chunk",
      slug: "gfs-master-chunk-architecture",
      title: "Master-Chunk Architecture",
      content: `# Master-Chunk Architecture

GFS uses a single master for all metadata and many chunk servers for data storage. This centralized metadata / distributed data split is the defining architectural decision.

## The Master

The master stores three types of metadata:

\`\`\`
Master Metadata
===============

1. File Namespace
   /data/crawl/2024-03-01.dat
   /data/crawl/2024-03-02.dat
   /mapreduce/job-1234/output-0

2. File -> Chunk Mapping
   /data/crawl/2024-03-01.dat --> [chunk_id_1, chunk_id_2, chunk_id_3]

3. Chunk -> Chunk Server Mapping (NOT persisted)
   chunk_id_1 --> [ChunkServer A, ChunkServer B, ChunkServer C]
   (rebuilt from chunk server reports on master startup)
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

\`\`\`
Operation Log
=============

[op 1001] CREATE /data/crawl/2024-03-01.dat
[op 1002] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1001
[op 1003] ADD_CHUNK file=/data/crawl/2024-03-01.dat, chunk=c_1002
[op 1004] DELETE /tmp/scratch-file.dat
...

Replicated to remote machines for durability.
Periodically checkpointed to compact form (B-tree).
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

| Factor | Small Chunks (4KB) | Large Chunks (64MB) |
|--------|-------------------|---------------------|
| Metadata per file | Millions of entries | Tens of entries |
| Master memory | Very high | Low (all metadata fits in RAM) |
| Client-master interaction | Frequent (many chunks per read) | Rare (few chunks per read) |
| Internal fragmentation | Low | Higher (last chunk partly empty) |
| Network overhead | Many small transfers | Few large transfers |

**64MB is the sweet spot** for GFS's workload: large sequential reads/writes, few files, and a desire to minimize master interaction.

## Master Scalability

The single master is a potential bottleneck. GFS mitigates this:

\`\`\`
Master Bottleneck Mitigation
==============================

1. Metadata fits in RAM (~64 bytes per chunk)
   1 billion chunks = ~64GB RAM (feasible)

2. Clients CACHE chunk locations
   Client asks master once, then reads/writes
   directly to chunk servers for that chunk

3. Data NEVER flows through the master
   Master handles metadata only (~KB per request)
   Data flows client <-> chunk server (~MB per request)

4. Prefetching: client requests locations for
   multiple upcoming chunks in a single request
\`\`\`

## Shadow Masters

For read availability, GFS runs **shadow masters** that replicate the operation log and serve read-only metadata queries. If the primary master is down, clients can still read (but not write) file metadata.

\`\`\`
Primary Master: handles all mutations
Shadow Masters: read-only replicas, slightly stale
  - Replicate operation log from primary
  - Can serve namespace lookups and chunk locations
  - Cannot handle file creation/deletion
\`\`\`

## Key Takeaway

GFS's master-chunk architecture centralizes metadata on a single master (keeping design simple) while distributing data across hundreds of chunk servers (keeping throughput high). The large 64MB chunk size minimizes master interaction, and caching chunk locations at the client ensures the master does not become a bottleneck for data-heavy workloads.`,
    },
    {
      id: "gfs-chunk-placement",
      slug: "gfs-chunk-placement-replication",
      title: "Chunk Placement & Replication",
      content: `# Chunk Placement & Replication

GFS replicates each chunk to multiple chunk servers for durability and availability. The master carefully places replicas to maximize fault tolerance.

## Replication Factor

Each chunk is replicated to **3** chunk servers by default (configurable per directory). The master tracks which servers hold each replica.

\`\`\`
Chunk c_1001 (from file /data/crawl/2024-03-01.dat):

  Primary:  ChunkServer A  (Rack 1)
  Replica:  ChunkServer D  (Rack 2)
  Replica:  ChunkServer G  (Rack 3)

3 copies across 3 different racks.
\`\`\`

## Placement Policy

The master uses a placement policy that considers:

\`\`\`
Chunk Placement Goals
=====================

1. Spread across racks
   - Tolerate entire rack failures (power, switch)
   - At least 2 racks per chunk

2. Balance disk utilization
   - Prefer chunk servers with more free space
   - Avoid hotspots on popular servers

3. Limit recent creation rate
   - A chunk server that just received many new chunks
     is likely being hit with write traffic
   - Spread new chunks to avoid write hotspots

4. Proximity for writes
   - Primary and replicas should have good network
     connectivity for efficient replication
\`\`\`

### Rack-Aware Placement

\`\`\`
Data Center Layout
==================

Rack 1         Rack 2         Rack 3         Rack 4
+------+       +------+       +------+       +------+
|CS-A  |       |CS-D  |       |CS-G  |       |CS-J  |
|CS-B  |       |CS-E  |       |CS-H  |       |CS-K  |
|CS-C  |       |CS-F  |       |CS-I  |       |CS-L  |
+------+       +------+       +------+       +------+
   |              |              |              |
   +-- Rack Switch --+-- Rack Switch --+-- Rack Switch --+
                           |
                    Core Switch

Chunk c_1001: CS-A (Rack 1), CS-D (Rack 2), CS-G (Rack 3)
  - Rack 1 loses power: 2 replicas survive
  - Core switch fails: all replicas on same network (unavailable)
    (acceptable -- core switch failure is extremely rare)
\`\`\`

## Re-Replication

When the number of replicas drops below the target (due to server failure, disk corruption, or increased replication factor), the master initiates **re-replication**:

\`\`\`
Re-Replication Flow
===================

1. Master detects: chunk c_1001 has only 2 replicas
   (ChunkServer A failed)

2. Master prioritizes re-replication:
   - Lower replica count = higher priority
   - Chunks of live files > chunks of deleted files
   - Chunks blocking client operations = highest priority

3. Master instructs ChunkServer H to clone c_1001
   from ChunkServer D (or G)

4. ChunkServer H copies chunk data over network

5. Master updates mapping:
   c_1001 --> [CS-D, CS-G, CS-H]
   (3 replicas restored)
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

\`\`\`
Rebalancing Example
===================

Before (new ChunkServer M added):
  CS-A: 800 chunks    CS-D: 750 chunks
  CS-G: 780 chunks    CS-M: 0 chunks (new)

After rebalancing:
  CS-A: 600 chunks    CS-D: 575 chunks
  CS-G: 580 chunks    CS-M: 575 chunks

Master gradually moves chunks to CS-M,
one at a time, to avoid overwhelming it.
\`\`\`

## Chunk Version Numbers

Each chunk has a **version number** that increments when a new lease is granted. This detects stale replicas:

\`\`\`
Chunk Version Detection
========================

1. Master grants lease for chunk c_1001 (version 5)
   ChunkServer D was down during lease grant

2. ChunkServer D comes back online
   Reports: c_1001 version 4

3. Master detects: version 4 < current version 5
   --> ChunkServer D has a stale replica
   --> Stale replica is garbage collected
   --> Re-replication is triggered if needed
\`\`\`

## Key Takeaway

GFS's chunk placement strategy maximizes fault tolerance by spreading replicas across racks, balancing disk utilization, and promptly re-replicating under-replicated chunks. Chunk version numbers detect stale replicas, and throttled cloning prevents re-replication storms from degrading cluster performance.`,
    },
    {
      id: "gfs-write-read",
      slug: "gfs-write-read-flows",
      title: "Write & Read Flows",
      content: `# Write & Read Flows

GFS separates the **control flow** (through the master) from the **data flow** (directly between clients and chunk servers). This is key to its scalability.

## Leases and Mutation Order

For each chunk with active mutations, the master grants a **lease** to one replica, designating it as the **primary**. The primary determines the order of all mutations to that chunk.

\`\`\`
Lease Mechanism
===============

1. Master grants 60-second lease to ChunkServer A
   for chunk c_1001
   A is now the PRIMARY for c_1001

2. All mutations go through A, which assigns serial numbers

3. Lease can be extended indefinitely via heartbeats
   (as long as the primary is healthy)

4. If primary fails, master waits for lease to expire
   then grants new lease to another replica
\`\`\`

## Write Flow (Record Append)

Record append is GFS's most important operation. Multiple clients can append to the same file concurrently, and GFS guarantees **atomic append** (the record is appended at least once, atomically).

\`\`\`
Record Append Flow
==================

Client wants to append data to file F, chunk c_1001

Step 1: Client asks Master for chunk locations
  Client --> Master: "Where is the last chunk of file F?"
  Master --> Client: "c_1001: Primary=CS-A, Replicas=[CS-D, CS-G]"
  (Client caches this information)

Step 2: Client pushes data to ALL replicas (pipelined)
  Client --> CS-A --> CS-D --> CS-G
  Data is stored in each server's LRU buffer cache
  (data flows in a CHAIN, not fan-out)

  Pipelining:
    Client sends to closest replica (CS-A)
    CS-A starts forwarding to CS-D immediately
    CS-D starts forwarding to CS-G immediately
    Minimizes latency by overlapping transfers

Step 3: Client sends write request to Primary (CS-A)
  Client --> CS-A: "Append this data"

Step 4: Primary assigns serial number and applies
  CS-A: serial_num = 42
  CS-A writes data at the next available offset
  CS-A --> CS-D: "Apply serial 42 at offset X"
  CS-A --> CS-G: "Apply serial 42 at offset X"

Step 5: Replicas apply and acknowledge
  CS-D: applied, ACK to CS-A
  CS-G: applied, ACK to CS-A

Step 6: Primary responds to client
  If all replicas succeeded: SUCCESS
  If any replica failed: ERROR (client retries)
\`\`\`

### Pipeline Optimization

\`\`\`
Data Pipeline (chain replication)
==================================

         Network Links
Client ----[10Gbps]---- CS-A ----[10Gbps]---- CS-D ----[10Gbps]---- CS-G

Transferring 64MB:
  Fan-out: Client sends 64MB to each (3x bandwidth)
  Pipeline: Each server forwards as it receives
    Time = 64MB / 10Gbps + 2 * (latency between servers)
    Much faster than 3 * (64MB / 10Gbps)
\`\`\`

## Read Flow

\`\`\`
Read Flow
=========

Client wants to read bytes [offset, offset+length] from file F

Step 1: Client computes chunk index
  chunk_index = offset / 64MB
  byte_offset_within_chunk = offset % 64MB

Step 2: Client asks Master for chunk locations
  Client --> Master: "File F, chunk index 3?"
  Master --> Client: "chunk_id=c_1003, servers=[CS-B, CS-E, CS-H]"

Step 3: Client reads from closest chunk server
  Client --> CS-B: "Read c_1003, offset=12345, length=50000"

Step 4: Chunk server reads and returns data
  CS-B reads from local disk
  CS-B verifies checksum of the 64KB blocks read
  CS-B --> Client: data

Step 5: Client may prefetch next chunk locations
  If reading sequentially, client requests locations
  for the next several chunks in one master RPC.
\`\`\`

### Checksum Verification

\`\`\`
Chunk Checksum Structure
=========================

Each 64MB chunk is divided into 64KB blocks.
Each block has a 32-bit checksum.

  [Block 0: 64KB] [Checksum: 0xABCD]
  [Block 1: 64KB] [Checksum: 0x1234]
  [Block 2: 64KB] [Checksum: 0x5678]
  ... (1024 blocks per chunk)

On read:
  Compute checksum of block read from disk
  Compare with stored checksum
  Mismatch --> data corruption detected
    --> Return error to client
    --> Client reads from another replica
    --> Master triggers re-replication
\`\`\`

## Consistency Model

GFS provides a relaxed consistency model:

| Operation | Consistency Guarantee |
|-----------|----------------------|
| File namespace ops (create, delete) | Atomic, consistent (master handles) |
| Record append | At-least-once, atomic per record |
| Random write | Concurrent writes may interleave (undefined) |

Record append may produce **duplicates** (if a replica fails and the client retries) and **padding** (if a record does not fit in the current chunk). Applications must handle these:

\`\`\`
Append Consistency
==================

Append "RECORD-A" (50MB) to chunk with 20MB free:
  1. Record doesn't fit in current chunk (20MB < 50MB)
  2. Primary pads current chunk to 64MB
  3. Tells client to retry on next chunk
  4. Client retries on new chunk: "RECORD-A" written at offset 0

If retry after partial failure:
  Chunk may contain: [RECORD-A (complete)] on some replicas
                     [RECORD-A (partial)]  on failed replica
  Client retries: [RECORD-A] written AGAIN
  --> Duplicate! Applications use record IDs to deduplicate.
\`\`\`

## Key Takeaway

GFS separates control flow (master) from data flow (chunk servers), enabling high throughput. The pipelined chain replication minimizes write latency. The consistency model trades strict guarantees for performance -- applications must handle duplicates and padding from record appends, but get high-throughput concurrent appends in return.`,
    },
    {
      id: "gfs-fault-tolerance",
      slug: "gfs-fault-tolerance",
      title: "Fault Tolerance & Recovery",
      content: `# Fault Tolerance & Recovery

GFS was designed with the assumption that hardware failures are routine. Every component has a failure mode, and every failure mode has a recovery mechanism.

## Failure Categories

\`\`\`
GFS Failure Modes
==================

1. Chunk Server Failure    (most common)
   - Disk failure, machine crash, network issue
   - Affects data availability for chunks on that server

2. Master Failure           (most critical)
   - Single point of failure for metadata
   - Requires fast recovery or failover

3. Data Corruption          (silent)
   - Bit rot on disk, memory errors
   - Detected by checksums

4. Network Partition         (transient)
   - Chunk servers unreachable temporarily
   - Leases prevent split-brain mutations
\`\`\`

## Chunk Server Failure

\`\`\`
Chunk Server Recovery Flow
===========================

1. ChunkServer C goes down
   |
   v
2. Master detects via missing heartbeat (30-second timeout)
   |
   v
3. Master marks all chunks on C as under-replicated
   c_1001: was [A, C, G] --> now [A, G] (2 replicas)
   c_1002: was [B, C, E] --> now [B, E] (2 replicas)
   |
   v
4. Master prioritizes re-replication:
   - Chunks with 1 replica: URGENT
   - Chunks with 2 replicas: HIGH
   - Chunks with 3+ replicas: normal
   |
   v
5. Master instructs healthy servers to clone:
   "CS-H, clone c_1001 from CS-A"
   "CS-I, clone c_1002 from CS-B"
   |
   v
6. If CS-C comes back online:
   - Reports its chunks to master
   - Master checks version numbers
   - Stale chunks are garbage collected
   - Current chunks reduce re-replication urgency
\`\`\`

## Master Failure & Recovery

The master is GFS's most critical component. Its failure strategy:

\`\`\`
Master Recovery Strategy
=========================

1. Operation Log Replication
   Every metadata mutation is logged BEFORE being applied.
   The operation log is replicated to multiple remote machines.

2. Checkpointing
   Periodically, master writes a checkpoint (compact B-tree
   representation of full metadata state).
   Recovery = load checkpoint + replay log entries after it.

3. Fast Restart
   Master restarts on same machine:
   - Load latest checkpoint (~seconds)
   - Replay recent operation log (~seconds)
   - Receive chunk server reports (~tens of seconds)
   - Resume serving (~1 minute total)

4. Shadow Masters
   Read-only replicas that can serve metadata reads
   during master downtime. Not consistent with primary
   (slightly stale), but better than nothing.

5. External Monitoring
   If master machine fails completely, monitoring system
   starts master on a different machine with replicated
   operation log.
\`\`\`

### Master Recovery Timeline

\`\`\`
Master Crash at T=0
====================

T=0:      Master process crashes
T=0-5s:   Monitoring detects failure, restarts process
T=5-10s:  Load checkpoint from disk
T=10-15s: Replay operation log (entries since checkpoint)
T=15-60s: Receive chunk server heartbeats with chunk reports
T=60s:    Master ready to serve requests

During T=0 to T=60s:
  - Reads: shadow masters serve stale metadata reads
  - Writes: blocked (no new file creation/deletion)
  - Data: chunk servers continue serving data reads
           (clients already have cached chunk locations)
\`\`\`

## Data Integrity: Checksums

\`\`\`
Checksum Verification
=====================

Each 64KB block has a 32-bit checksum stored separately.

On Read:
  1. Read block from disk
  2. Compute checksum
  3. Compare with stored checksum
  4. Match: return data
  5. Mismatch: CORRUPTION DETECTED
     - Return error to client (client tries another replica)
     - Report corruption to master
     - Master triggers re-replication from healthy replica
     - Corrupted replica is deleted

On Idle:
  Background scanning verifies checksums of all stored chunks.
  Detects corruption even for rarely-read chunks (bit rot).

On Append:
  Incrementally update checksum for the last partial block.
  Compute fresh checksum for new full blocks.
\`\`\`

## Lease Mechanism Prevents Split-Brain

\`\`\`
Split-Brain Prevention
======================

Scenario: Master grants lease to CS-A as primary for chunk c_1001
          Network partition isolates CS-A

Without leases:
  Master grants primary to CS-D
  Both CS-A and CS-D accept mutations --> INCONSISTENT

With leases:
  CS-A has lease until T+60s
  Master waits until T+60s before granting new lease
  After T+60s: CS-A's lease expires, CS-A stops accepting mutations
  Master grants new lease to CS-D
  --> Only one primary at a time, always
\`\`\`

## Garbage Collection

GFS uses lazy garbage collection instead of immediate deletion:

1. When a file is deleted, it is renamed to a hidden name with a deletion timestamp
2. The master's background scan finds hidden files older than 3 days
3. Master removes metadata, tells chunk servers to delete chunks
4. Chunk servers delete the local files

**Advantages:**
- Simpler than synchronous deletion across replicas
- Provides a "recycle bin" -- recently deleted files can be recovered
- Batch processing is more efficient than individual deletes

## Key Takeaway

GFS achieves fault tolerance through redundancy at every level: chunk replication for data, operation log replication for metadata, checksums for integrity, and leases for consistency. The design assumes failures are normal and optimizes for fast detection and recovery rather than prevention.`,
    },
    {
      id: "gfs-architecture",
      slug: "gfs-architecture-walkthrough",
      title: "GFS: Architecture Walkthrough",
      content: `# GFS: Architecture Walkthrough

Let us bring together all components into a complete picture of how the Google File System operates.

## Complete Architecture

\`\`\`
                    GFS Architecture
                    ================

            +----------------------------+
            |        GFS Master          |
            |                            |
            | Namespace (file tree)      |
            | File -> Chunk mapping      |
            | Chunk -> Server mapping    |
            | Operation Log (replicated) |
            | Lease management           |
            +----------------------------+
               ^    |    ^    |
    metadata   |    |    |    |  heartbeats
    requests   |    |    |    |  chunk reports
               |    v    |    v
  +--------+  +--------+--------+--------+--------+
  | Client |  |  CS-A  |  CS-B  |  CS-C  |  CS-D  |
  |        |  | Rack 1 | Rack 1 | Rack 2 | Rack 2 |
  +--------+  +--------+--------+--------+--------+
     |  ^       |  ^      |        |        |
     |  |       |  |      |        |        |
     +--+-------+--+------+--------+--------+
       data flows directly (read/write chunks)

  Shadow Masters (read-only metadata replicas)
  +----------+  +----------+
  | Shadow 1 |  | Shadow 2 |
  +----------+  +----------+
\`\`\`

## Write Path: Record Append End-to-End

\`\`\`
Client appends record to /data/crawl/2024-03-01.dat

1. Client --> Master: "What is the last chunk of this file?"
   Master --> Client: "chunk c_1005, primary=CS-A,
                       replicas=[CS-C, CS-D], version=7"

2. Client pushes data through pipeline:
   Client --> CS-A --> CS-C --> CS-D
   (data buffered in each server's memory)

3. Client --> CS-A (primary): "Commit the append"

4. CS-A assigns serial number 42
   CS-A writes record at offset 3145728 (3MB into chunk)
   CS-A --> CS-C: "Write serial 42 at offset 3145728"
   CS-A --> CS-D: "Write serial 42 at offset 3145728"

5. CS-C: success, ACK to CS-A
   CS-D: success, ACK to CS-A

6. CS-A --> Client: "SUCCESS, record at offset 3145728"

7. If CS-D had failed:
   CS-A --> Client: "ERROR"
   Client retries entire operation
   (may produce duplicate, app deduplicates by record ID)
\`\`\`

## Read Path End-to-End

\`\`\`
Client reads bytes [200000000, 200500000] from file F

1. Client computes:
   chunk_index = 200000000 / 67108864 = 2  (64MB per chunk)
   byte_in_chunk = 200000000 % 67108864 = 65782272

2. Client --> Master: "File F, chunk index 2?"
   Master --> Client: "chunk c_1003, servers=[CS-B, CS-C, CS-D]"
   (Client caches this for future reads)

3. Client --> CS-B (closest): "Read c_1003, offset 65782272, len 500000"

4. CS-B:
   a. Locate block: 65782272 / 65536 = block 1004
   b. Read block from disk
   c. Verify checksum
   d. Return data to client

5. If checksum fails:
   CS-B --> Client: error
   Client --> CS-C: retry read
   CS-B --> Master: report corruption
   Master --> CS-E: re-replicate c_1003 from CS-C
\`\`\`

## Failure Recovery Summary

| Failure | Detection | Recovery | Downtime |
|---------|-----------|----------|----------|
| Chunk server crash | Missing heartbeat (30s) | Re-replicate under-replicated chunks | Reads: none (other replicas). Writes: lease expires, new primary. |
| Disk corruption | Checksum mismatch on read or scan | Delete corrupt replica, re-replicate | None (client reads from another replica) |
| Master crash | External monitoring | Restart: checkpoint + log replay + chunk reports | ~60 seconds for full recovery |
| Master machine death | External monitoring | Start on new machine with replicated log | Minutes (depends on provisioning) |
| Network partition | Heartbeat timeout | Lease expiry prevents split-brain. Partitioned servers reconnect and sync. | Partial: isolated servers unavailable. |
| Rack failure | Multiple heartbeat timeouts | Rack-aware placement ensures replicas survive | Re-replication from surviving racks |

## GFS Design Tradeoffs

\`\`\`
+---------------------------+----------------------------------+
| Tradeoff                  | GFS Choice                       |
+---------------------------+----------------------------------+
| Metadata architecture     | Single master (simple, limits     |
|                           | namespace ops but not data I/O)  |
+---------------------------+----------------------------------+
| Chunk size                | 64MB (reduces master interaction, |
|                           | wastes space on small files)     |
+---------------------------+----------------------------------+
| Consistency model         | Relaxed (apps handle duplicates   |
|                           | and padding for high throughput)  |
+---------------------------+----------------------------------+
| Write optimization        | Append-only (sequential I/O,      |
|                           | random writes poorly supported)  |
+---------------------------+----------------------------------+
| Replication data flow     | Pipeline chain (minimizes         |
|                           | bandwidth usage vs. fan-out)     |
+---------------------------+----------------------------------+
| Garbage collection        | Lazy (simpler, provides undo,     |
|                           | delays space reclamation)        |
+---------------------------+----------------------------------+
\`\`\`

## GFS Legacy

GFS directly influenced:
- **HDFS (Hadoop):** Open-source reimplementation of GFS concepts. NameNode = Master, DataNode = ChunkServer.
- **Colossus (Google):** GFS successor with distributed master, smaller chunk size, Reed-Solomon encoding.
- **Cloud Storage (AWS S3, GCS, Azure Blob):** Similar separation of metadata and data, chunk-based storage, multi-replica durability.

## Key Takeaway

GFS demonstrated that a simple architecture -- single master for metadata, many chunk servers for data, large chunks, pipeline replication, and relaxed consistency -- could reliably store petabytes of data across thousands of commodity machines. Its influence extends through HDFS, Colossus, and every cloud object storage system built since.`,
    },
  ],
};
