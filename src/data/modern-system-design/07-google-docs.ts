import { Module } from "../types";

export const googleDocsModule: Module = {
  id: "design-google-docs",
  title: "Design Google Docs",
  description:
    "Design a real-time collaborative editor: operational transformation, CRDTs, presence tracking, and conflict resolution at scale.",
  lessons: [
    {
      id: "docs-requirements",
      slug: "docs-requirements",
      title: "Requirements & Consistency Challenges",
      content: `# Design Google Docs: Requirements & Consistency Challenges

## Functional Requirements

Design a real-time collaborative document editor like Google Docs. Core features:

1. **Real-time co-editing** — Multiple users edit the same document simultaneously
2. **Rich text editing** — Bold, italic, headings, lists, tables, images
3. **Conflict resolution** — Concurrent edits never corrupt the document
4. **Offline support** — Users can edit offline and sync when reconnected
5. **Version history** — View and restore any previous version of the document
6. **Comments and suggestions** — Inline comments, suggested edits with accept/reject
7. **Permissions** — Owner, editor, commenter, viewer roles
8. **Real-time presence** — See who else is in the document and where their cursor is

## Non-Functional Requirements

- **Availability**: 99.99% — documents must always be accessible
- **Latency**: Local edits appear instantly (<50ms); remote edits appear within 200ms
- **Consistency**: All users converge to the same document state (eventual consistency)
- **Scalability**: 100+ concurrent editors per document; billions of documents total
- **Durability**: Zero data loss — every keystroke must be persisted

## Scale Estimation

### Users and Documents

\`\`\`
Monthly active users:       ~1.5 billion (Google Workspace)
Documents:                  ~15 billion total
Active documents (daily):   ~300 million
Concurrent editors (peak):  ~50 million users editing simultaneously
Average editors per doc:    2-5 (some docs have 100+)
\`\`\`

### Operations

\`\`\`
Keystrokes per active user:    ~2,000/hour (average typist)
Operations per second (total): 50M users × 2000/3600 ≈ 28 million ops/s
Operations per document:       Varies wildly — 1/min to 100/s
Operation payload:             ~100-500 bytes per operation
Bandwidth:                     28M × 200 bytes = 5.6 GB/s ingest
\`\`\`

### Storage

\`\`\`
New documents/day:          ~50 million
Average document size:      ~50 KB (text + formatting)
Daily new storage:          50M × 50 KB = 2.5 TB/day
Operation log per doc:      ~500 KB/day for active docs
Version snapshots:          Every 100 operations or 5 minutes
\`\`\`

## The Core Challenge: Concurrent Edits

The fundamental problem in collaborative editing is: what happens when two users edit the same spot in a document at the same time?

\`\`\`
Document: "Hello World"

User A (position 5): Insert "," → "Hello, World"
User B (position 6): Delete "W" → "Hello orld"

Both edits happen simultaneously. What should the result be?

Naive merge (apply both as-is):
  Start:  "Hello World"
  Apply A: "Hello, World"   (insert "," at position 5)
  Apply B: delete at position 6 → "Hello,World"  ← WRONG!
    (B's position 6 was "W" in the original, but after A's insert,
     position 6 is now " ", not "W")

Correct merge (transform operations):
  Start:  "Hello World"
  Apply A: "Hello, World"
  Transform B: A inserted before B's position, so B's position shifts +1
  Apply B': delete at position 7 → "Hello, orld"  ✓
\`\`\`

This is the essence of the problem. There are two major solutions: **Operational Transformation (OT)** and **CRDTs**. We will explore both.

## Consistency Model

Collaborative editing uses **eventual consistency** with a critical guarantee:

\`\`\`
CCI Model:
  Causality:    If operation A happened before B, all users see A before B
  Convergence:  All users eventually see the same document state
  Intention:    Each user's edit achieves what they intended

Traditional databases optimize for C (strong consistency) or A (availability).
Collaborative editing must optimize for all three CCI properties simultaneously.
\`\`\`

## High-Level Architecture

\`\`\`
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ User A   │◀───▶│  Collab      │◀───▶│ Document     │
│ (browser)│     │  Server      │     │ Storage      │
├──────────┤     │              │     │ (snapshots)  │
│ User B   │◀───▶│  - OT/CRDT  │     └──────────────┘
│ (browser)│     │  - ordering  │
├──────────┤     │  - broadcast │     ┌──────────────┐
│ User C   │◀───▶│              │◀───▶│ Operation    │
│ (browser)│     └──────────────┘     │ Log (Kafka)  │
└──────────┘                          └──────────────┘
\`\`\`

## Key Challenges

| Challenge | Why It's Hard |
|-----------|--------------|
| **Concurrent edit resolution** | Multiple users typing in the same paragraph |
| **28M ops/s throughput** | Every keystroke must be processed and broadcast |
| **<200ms propagation** | Remote edits must appear almost instantly |
| **Offline + reconnect** | Merge hours of offline edits without corruption |
| **100+ simultaneous editors** | Transform operations scale quadratically with users |
| **Undo/redo in collaboration** | Undoing YOUR edit when others edited around it |

We will address each of these in the following lessons.`,
    },
    {
      id: "docs-ot",
      slug: "docs-ot",
      title: "Operational Transformation",
      content: `# Google Docs: Operational Transformation

## What Is Operational Transformation?

Operational Transformation (OT) is the algorithm Google Docs uses to handle concurrent edits. The core idea: when two operations conflict, **transform** one operation against the other so both can be applied in any order and produce the same result.

## Operations

Every edit is represented as an operation on the document:

\`\`\`
Operation types:
  INSERT(position, character)   — Insert text at a position
  DELETE(position, count)       — Delete characters starting at position
  RETAIN(count)                 — Skip forward (no change)

Example: "Hello World" → "Hello, World"
  Operation: RETAIN(5), INSERT(","), RETAIN(6)

Example: "Hello World" → "Hell World"
  Operation: RETAIN(4), DELETE(1), RETAIN(6)
\`\`\`

## The Transform Function

The transform function takes two concurrent operations and produces transformed versions that can be applied in either order:

\`\`\`
transform(opA, opB) → (opA', opB')

Such that:
  apply(apply(document, opA), opB') = apply(apply(document, opB), opA')

This is the "diamond property":

         doc
        /   \\
      opA   opB
      /       \\
   docA      docB
      \\       /
      opB'  opA'
        \\   /
        docAB = docBA  ← MUST be identical
\`\`\`

### Transform Rules

\`\`\`
Case 1: Two inserts
  opA = INSERT(pos=3, "X")
  opB = INSERT(pos=5, "Y")

  If posA <= posB:
    opA' = INSERT(pos=3, "X")     — unchanged
    opB' = INSERT(pos=6, "Y")     — shift right by 1 (A inserted before B)

Case 2: Insert vs Delete
  opA = INSERT(pos=3, "X")
  opB = DELETE(pos=5, count=1)

  posA < posB:
    opA' = INSERT(pos=3, "X")     — unchanged
    opB' = DELETE(pos=6, count=1) — shift right by 1

Case 3: Two deletes
  opA = DELETE(pos=3, count=1)
  opB = DELETE(pos=3, count=1)    — same position!

  Both delete the same character:
    opA' = NOOP                    — already deleted by B
    opB' = NOOP                    — already deleted by A

Case 4: Delete vs Insert at same position
  opA = DELETE(pos=3, count=1)
  opB = INSERT(pos=3, "X")

  opA' = DELETE(pos=4, count=1)   — shift right (B inserted before)
  opB' = INSERT(pos=3, "X")       — unchanged
\`\`\`

## Server as Single Source of Truth

Google Docs uses a **centralized OT** model. The server maintains the authoritative operation order:

\`\`\`
┌──────────┐                    ┌──────────────┐
│ Client A │─── op(rev=5) ────▶│   Server     │
│          │                    │              │
│          │                    │ Document at  │
│          │                    │ revision 7   │
│          │                    │              │
│          │                    │ op was based │
│          │                    │ on rev 5, but│
│          │                    │ server is at │
│          │                    │ rev 7        │
│          │                    │              │
│          │                    │ Transform op │
│          │                    │ against revs │
│          │                    │ 6 and 7      │
│          │                    │              │
│          │◀── ack(rev=8) ────│ Apply → rev 8│
│          │                    │              │
│ Client B │◀── broadcast ─────│ Broadcast to │
│          │    op'(rev=8)      │ all others   │
└──────────┘                    └──────────────┘
\`\`\`

### Client-Side OT Pipeline

\`\`\`
Client maintains three states:

1. Synchronized: client doc matches server's last ack'd revision
2. Awaiting ACK: client sent an op, waiting for server confirmation
3. Awaiting ACK + Buffer: client has new local ops while waiting

State transitions:
┌──────────────┐  send op   ┌──────────────┐  local edit  ┌─────────────┐
│ Synchronized │──────────▶│ Awaiting ACK │────────────▶│ Awaiting    │
│              │           │              │             │ ACK+Buffer  │
│              │◀──────────│              │             │             │
│              │  recv ack │              │◀────────────│             │
└──────────────┘           └──────────────┘  recv ack   └─────────────┘
                                              (send buffer)

When receiving a remote op while in "Awaiting ACK":
  - Transform remote op against pending local op
  - Apply transformed remote op to local document
  - Transform pending local op against remote op
  - Keep transformed pending op for when ACK arrives
\`\`\`

## Handling Complex Scenarios

### Concurrent Typing in the Same Word

\`\`\`
Document: "Hello World" (revision 10)

User A types "!" after "World":
  opA = RETAIN(11), INSERT("!")      based on rev 10

User B types "Beautiful " before "World":
  opB = RETAIN(6), INSERT("Beautiful "), RETAIN(5)    based on rev 10

Server receives opA first (wins the race):
  Apply opA → "Hello World!" (rev 11)

Server receives opB (based on rev 10, but server is at rev 11):
  Transform opB against opA:
    opA inserted at pos 11, opB inserts at pos 6
    posB < posA, so opB unchanged
  Apply opB → "Hello Beautiful World!" (rev 12) ✓

Broadcast:
  User A receives transformed opB → "Hello Beautiful World!"
  User B receives opA (transformed against opB) → "Hello Beautiful World!"
  Both converge ✓
\`\`\`

## OT Limitations

\`\`\`
Challenges with OT:
  1. Transform functions are complex — N operation types need N² transform pairs
  2. Server is a bottleneck — all operations serialized through one server
  3. Hard to prove correctness — subtle bugs in transform logic
  4. Offline support is difficult — long divergence = many transforms

Google's solution to the server bottleneck:
  - One OT server per document (not per-user)
  - Documents sharded across servers by document ID
  - Each server handles ~1000 active documents
  - Horizontal scaling by adding more servers
\`\`\`

## Scale Numbers

\`\`\`
OT server instances:         ~50,000 (globally)
Documents per server:        ~1,000 active
Transforms per second:       ~28M globally
Transform latency:           < 1ms per operation pair
Server-to-client broadcast:  < 100ms (WebSocket)
Maximum concurrent editors:  ~100 per document (practical limit)
Beyond 100: switch to batched updates every 500ms
\`\`\``,
    },
    {
      id: "docs-crdts",
      slug: "docs-crdts",
      title: "CRDTs",
      content: `# Google Docs: CRDTs

## What Are CRDTs?

Conflict-free Replicated Data Types (CRDTs) are data structures that can be replicated across multiple nodes, modified independently and concurrently, and always merged into a consistent state — **without any coordination**.

Unlike OT, which transforms operations through a central server, CRDTs guarantee convergence by mathematical properties of the data structure itself.

\`\`\`
OT approach:
  Operations + Central Server + Transform Functions → Convergence

CRDT approach:
  Data Structure Properties → Convergence (no central server needed)
\`\`\`

## Types of CRDTs

### State-based (CvRDT) vs Operation-based (CmRDT)

\`\`\`
State-based (CvRDT):
  - Replicas send their full state to each other
  - States merged using a join/merge function
  - Requires: merge is commutative, associative, idempotent
  - Higher bandwidth (sends full state)

Operation-based (CmRDT):
  - Replicas send operations to each other
  - Operations applied directly
  - Requires: operations are commutative
  - Lower bandwidth (sends only ops)
  - Requires reliable broadcast (all ops delivered)
\`\`\`

## Common CRDT Types

### G-Counter (Grow-only Counter)

\`\`\`
Each node maintains its own counter. Global count = sum of all nodes.

Node A: {A: 5, B: 0, C: 0}    → total = 5
Node B: {A: 0, B: 3, C: 0}    → total = 3
Node C: {A: 0, B: 0, C: 7}    → total = 7

Merge: take max of each node's count
  {A: 5, B: 3, C: 7} → total = 15

Increment on Node A:
  {A: 6, B: 0, C: 0}

After merge: {A: 6, B: 3, C: 7} → total = 16 ✓

Use case: page view counters, like counts
\`\`\`

### PN-Counter (Positive-Negative Counter)

\`\`\`
Two G-Counters: one for increments (P), one for decrements (N).
Value = sum(P) - sum(N)

Node A increments 5 times, decrements 2 times:
  P: {A: 5}    N: {A: 2}    → value = 3

Node B increments 3 times, decrements 1 time:
  P: {B: 3}    N: {B: 1}    → value = 2

Merged: P: {A:5, B:3} = 8    N: {A:2, B:1} = 3    → value = 5 ✓

Use case: inventory counts, upvote/downvote
\`\`\`

### LWW-Register (Last-Writer-Wins Register)

\`\`\`
Each write carries a timestamp. On merge, highest timestamp wins.

Node A: value = "red",   timestamp = 1000
Node B: value = "blue",  timestamp = 1002

Merge: timestamp 1002 > 1000 → value = "blue" ✓

Problem: requires synchronized clocks.
Solution: use Hybrid Logical Clocks (HLC) — combines physical
          clock with logical counter.

Use case: user profile fields, settings, metadata
\`\`\`

### RGA (Replicated Growable Array) — For Text

RGA is the CRDT type most relevant to collaborative text editing. It represents a document as an ordered sequence with unique element IDs.

\`\`\`
Document: "CAT"

Internal representation:
  ┌──────────┬──────────┬──────────┐
  │ ID: A@1  │ ID: A@2  │ ID: A@3  │
  │ char: C  │ char: A  │ char: T  │
  │ after: ⊥ │ after:A@1│ after:A@2│
  └──────────┴──────────┴──────────┘

User A inserts "R" between "C" and "A":
  New element: {ID: A@4, char: R, after: A@1}
  → "CRAT"

User B (concurrently) inserts "H" between "C" and "A":
  New element: {ID: B@1, char: H, after: A@1}
  → "CHAT"

Merge conflict: both A@4 and B@1 claim to be after A@1
Resolution: order by ID (A@4 > B@1) → "CHART" or "CHRAT"
  (deterministic ordering, same result on all nodes)
\`\`\`

## CRDTs vs OT: Trade-offs

\`\`\`
┌─────────────────┬──────────────────┬──────────────────┐
│ Property        │ OT               │ CRDTs            │
├─────────────────┼──────────────────┼──────────────────┤
│ Central server  │ Required         │ Not required     │
│ Offline support │ Difficult        │ Natural          │
│ Correctness     │ Hard to prove    │ Mathematically   │
│                 │                  │ provable         │
│ Memory overhead │ Low              │ High (tombstones,│
│                 │                  │ unique IDs)      │
│ Latency         │ Server round-trip│ Peer-to-peer OK  │
│ Complexity      │ Transform funcs  │ Data structure   │
│                 │ (N² pairs)       │ design           │
│ Undo/redo       │ Well-understood  │ Research topic   │
│ Production use  │ Google Docs      │ Figma, Apple     │
│                 │                  │ Notes, Yjs       │
└─────────────────┴──────────────────┴──────────────────┘
\`\`\`

## CRDT Memory Overhead

The biggest practical challenge with CRDTs for text editing:

\`\`\`
Problem: tombstones

When a character is deleted in a CRDT, it cannot be removed
from the data structure — it must be kept as a "tombstone"
so that concurrent inserts can still reference it.

Document with 1000 characters visible:
  OT storage: ~1 KB (just the text)
  CRDT storage: ~50 KB (1000 live + thousands of tombstones,
                 each with unique ID, parent pointer, timestamps)

Over months of editing:
  A document with 10K current characters might have 500K tombstones
  → 50x memory overhead

Solutions:
  1. Garbage collection: periodically compact tombstones
     (requires consensus that all nodes have seen the delete)
  2. Snapshots: periodically create a clean snapshot
     and discard old operations
  3. Block-level CRDTs: operate on paragraphs, not characters
     (reduces granularity of conflicts)
\`\`\`

## Modern CRDT Libraries

\`\`\`
Yjs:
  - Most popular CRDT library for web apps
  - Supports text, arrays, maps, XML
  - Used by: Notion (partial), JupyterLab, BlockSuite
  - Binary encoding: very compact wire format
  - Performance: handles 100K+ operations efficiently

Automerge:
  - Rust-based CRDT library with JS bindings
  - JSON-like document model
  - Built-in version history
  - Good for offline-first apps

Diamond Types:
  - Experimental, extremely fast
  - Focuses on text CRDTs specifically
  - Benchmarks: 100x faster than Yjs for large documents
\`\`\`

## When to Choose What

\`\`\`
Choose OT when:
  ├── You have a reliable central server
  ├── Memory efficiency matters (large documents)
  ├── You need well-understood undo/redo
  └── Google Docs-scale: proven at billions of users

Choose CRDTs when:
  ├── Offline-first is a requirement
  ├── Peer-to-peer collaboration (no server)
  ├── You want mathematical correctness guarantees
  └── Building on modern libraries (Yjs, Automerge)

Many modern systems use a hybrid:
  - CRDT data structures for merge guarantees
  - Central server for ordering and persistence
  - This gives the best of both worlds
\`\`\``,
    },
    {
      id: "docs-sync",
      slug: "docs-sync",
      title: "Real-Time Sync Architecture",
      content: `# Google Docs: Real-Time Sync Architecture

## The Sync Problem

Every keystroke by any user must propagate to all other users viewing the document, merge correctly, and appear within 200ms. At Google's scale, this means 28 million operations per second flowing through the sync infrastructure.

## WebSocket Connection Architecture

\`\`\`
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ User A   │◀═══▶│ WebSocket    │◀═══▶│ Collab       │
│ (browser)│     │ Gateway      │     │ Server       │
├──────────┤     │ (Edge)       │     │ (per-doc)    │
│ User B   │◀═══▶│              │     │              │
│ (browser)│     │ - TLS term   │     │ - OT engine  │
├──────────┤     │ - auth       │     │ - op ordering│
│ User C   │◀═══▶│ - routing    │     │ - broadcast  │
│ (browser)│     └──────────────┘     └──────┬───────┘
└──────────┘                                 │
                                    ┌────────┼────────┐
                                    ▼        ▼        ▼
                              ┌──────┐ ┌──────┐ ┌──────────┐
                              │Op Log│ │Snap- │ │ Pub/Sub  │
                              │(pers)│ │shots │ │ (cross-  │
                              │      │ │      │ │  region) │
                              └──────┘ └──────┘ └──────────┘
\`\`\`

### Connection Lifecycle

\`\`\`
1. User opens document:
   ├── Browser initiates WebSocket to nearest edge gateway
   ├── Gateway authenticates user (OAuth token)
   ├── Gateway routes to collab server that owns this document
   │   (consistent hashing by document_id)
   ├── Collab server loads latest snapshot + recent ops from storage
   └── Sends document state to user: { snapshot, revision: 4521 }

2. User types:
   ├── Local: apply operation immediately (optimistic)
   ├── Send operation to server: { ops: [RETAIN(15), INSERT("a")], rev: 4521 }
   ├── Server transforms against any ops since rev 4521
   ├── Server applies and assigns new revision: 4522
   ├── Server ACKs to sender: { ack: true, rev: 4522 }
   └── Server broadcasts to other users: { ops: [...], rev: 4522 }

3. User disconnects:
   ├── WebSocket close detected (heartbeat timeout: 30s)
   ├── Server removes user from document's active set
   └── Broadcast presence update to remaining users
\`\`\`

## Operation Log

Every operation is persisted in an append-only operation log before being broadcast. This is the source of truth for the document's history.

\`\`\`
Operation Log for document doc_12345:

┌─────┬──────────┬──────────────────────────┬───────────┬──────────┐
│ Rev │ User     │ Operations               │ Timestamp │ Parent   │
├─────┼──────────┼──────────────────────────┼───────────┼──────────┤
│ 4520│ user_A   │ RETAIN(10),INSERT("the") │ 09:41:02  │ 4519     │
│ 4521│ user_B   │ RETAIN(45),DELETE(3)     │ 09:41:02  │ 4520     │
│ 4522│ user_A   │ RETAIN(15),INSERT("a")   │ 09:41:03  │ 4521     │
│ 4523│ user_C   │ RETAIN(0),INSERT("# ")   │ 09:41:03  │ 4522     │
└─────┴──────────┴──────────────────────────┴───────────┴──────────┘

Storage: Kafka (short-term, 7 days) + Cloud Spanner (long-term)
Write latency: < 5ms (Kafka), async replication to Spanner
\`\`\`

## Snapshotting

Computing document state from the full operation log is expensive. Snapshots compress the history:

\`\`\`
Snapshot strategy:
  - Create snapshot every 100 operations OR every 5 minutes
  - Snapshot = full document content + formatting at that revision
  - Old operations before the snapshot can be archived to cold storage

Document loading:
  1. Load latest snapshot (rev 4500, 50 KB)
  2. Load operations 4501-4523 from op log (23 ops, ~5 KB)
  3. Replay 23 operations on snapshot
  4. Document ready in < 50ms

Without snapshots:
  Load all 4523 operations → replay all → 500ms+
  For old documents with 100K+ revisions → unacceptable

Snapshot storage:
  Cloud Storage (GCS/S3), keyed by (doc_id, revision)
  ~50 KB per snapshot, ~20 snapshots per active document per day
\`\`\`

## Catch-Up Protocol

When a user reconnects after being offline, they must catch up on missed operations:

\`\`\`
Reconnection flow:

Client: "I was last at revision 4510"
Server: "Current revision is 4523"

Short disconnection (< 1000 ops behind):
  Server sends ops 4511-4523 (13 operations)
  Client transforms local pending ops against received ops
  Client applies transformed ops
  Time: < 100ms

Long disconnection (> 1000 ops behind):
  Server sends latest snapshot (rev 4500) + ops 4501-4523
  Client discards local state, loads snapshot, replays ops
  Client's pending offline ops are transformed against all received ops
  Time: < 500ms

Very long disconnection (days offline, different document):
  Server sends latest snapshot only
  Client treats all offline edits as a single batch
  Transform batch against server state
  This may require manual conflict resolution for large changes
\`\`\`

## Cross-Region Sync

For global availability, documents must be accessible from any region:

\`\`\`
Architecture:
┌─────────────┐         ┌─────────────┐
│ US Region   │         │ EU Region   │
│             │         │             │
│ Collab      │◀──────▶│ Collab      │
│ Servers     │ Pub/Sub │ Servers     │
│             │(Kafka)  │             │
│ Op Log      │         │ Op Log      │
│ (Spanner)   │         │ (Spanner)   │
└─────────────┘         └─────────────┘

Document ownership:
  - Each document has a "home region" (where it was created)
  - Home region's collab server is the OT authority
  - Other regions forward operations to home region
  - Home region broadcasts transformed ops back

Cross-region latency: ~100-150ms (US ↔ EU)
Total propagation: ~200-300ms for cross-region edits
\`\`\`

## Handling Network Partitions

\`\`\`
Scenario: US ↔ EU link goes down

During partition:
  - US users continue editing (home region for US docs)
  - EU users can read but writes queue for US docs
  - EU docs with EU home region continue normally

After partition heals:
  - Queued operations replayed in order
  - OT transforms resolve any conflicts
  - All regions converge within seconds

This is acceptable because:
  - Most documents are edited from one region
  - Cross-region concurrent editing is rare
  - The latency during normal operation (200ms) already
    provides a natural window for ordering
\`\`\`

## Scale Numbers

\`\`\`
WebSocket connections:    ~50M concurrent globally
WebSocket gateways:       ~10,000 instances (edge nodes)
Collab servers:           ~50,000 instances
Active documents:         ~300M daily
Operations persisted:     ~28M/s
Op log writes (Kafka):    ~28M/s (partitioned by doc_id)
Snapshots created:        ~60M/day
Snapshot storage:         ~3 TB/day
Cross-region replication: ~100-150ms latency
Document load time:       < 200ms (snapshot + op replay)
\`\`\``,
    },
    {
      id: "docs-presence",
      slug: "docs-presence",
      title: "Presence & Cursor Tracking",
      content: `# Google Docs: Presence & Cursor Tracking

## What Is Presence?

Presence is the awareness layer: seeing who else is in the document, where their cursor is, and what they are selecting. It is distinct from the document content — presence is **ephemeral state** that does not need to be persisted.

\`\`\`
What users see:
  ┌──────────────────────────────────────────────┐
  │ Document Title                     👤A 👤B 👤C│
  │──────────────────────────────────────────────│
  │                                              │
  │ The quick brown fox |A jumps over the lazy   │
  │ dog. She █████████B sells seashells by the   │
  │ seashore.|C                                  │
  │                                              │
  └──────────────────────────────────────────────┘

  |A = User A's cursor (blue)
  █████████B = User B's selection (green highlight)
  |C = User C's cursor (orange)
\`\`\`

## Ephemeral vs Persistent State

\`\`\`
Persistent state (document content):
  - Must survive server crashes
  - Written to durable storage
  - Eventually consistent across all replicas
  - Every operation logged in the operation log

Ephemeral state (presence):
  - Lost on disconnect — that is fine
  - Stored only in memory on collab server
  - Best-effort delivery (dropped updates are OK)
  - Not part of the operation log
  - Much higher update frequency (cursor moves on every keystroke)

Separation matters for performance:
  Persistent ops: ~5/s per user (actual content changes)
  Ephemeral updates: ~30/s per user (cursor moves, scrolls)

  If presence updates went through OT pipeline: 6x more load
  Instead: broadcast directly, skip OT, skip persistence
\`\`\`

## Cursor Position Representation

Cursors must track positions that are stable even as the document changes:

\`\`\`
Naive approach: character offset
  Cursor at position 42

  Problem: User B inserts text before position 42
           → cursor should shift, but offset is stale

Better approach: anchor to document structure
  Cursor anchored to: { paragraphId: "p3", offset: 15 }

  When text is inserted in paragraph p3 before offset 15:
    → offset automatically adjusts

Best approach (CRDT-based): anchor to element ID
  Cursor between elements: { after: "elem_A@42", before: "elem_A@43" }

  This is stable regardless of concurrent edits.
  Even if text is inserted at the same position,
  the cursor's position relative to its anchors is unambiguous.
\`\`\`

## Presence Protocol

\`\`\`
Presence update message:

{
  type: "presence",
  user: {
    id: "user_A",
    name: "Alice",
    color: "#4285F4",       // assigned deterministically
    avatar: "https://..."
  },
  cursor: {
    anchor: { path: [2, 15], offset: 3 },  // paragraph 2, text node 15, char 3
    focus: { path: [2, 15], offset: 3 }     // same = cursor, different = selection
  },
  lastActive: 1710345600000
}

Selection (User B highlighting text):
{
  type: "presence",
  user: { id: "user_B", ... },
  cursor: {
    anchor: { path: [3, 0], offset: 5 },   // selection start
    focus: { path: [3, 0], offset: 25 }     // selection end
  }
}
\`\`\`

## Presence Broadcasting Architecture

\`\`\`
┌──────────┐                     ┌──────────────┐
│ User A   │── cursor move ────▶│ Collab Server │
│          │   (30/s)            │              │
│          │                     │ Throttle to  │
│          │                     │ 10 updates/s │
│          │                     │              │
│ User B   │◀── presence ───────│ Broadcast to │
│          │    update (10/s)    │ all users    │
│          │                     │ in document  │
│ User C   │◀── presence ───────│              │
│          │    update (10/s)    │              │
└──────────┘                     └──────────────┘

Throttling strategy:
  - Client sends cursor position on every keystroke (~30/s)
  - Server throttles to ~10 updates/s per user (every 100ms)
  - Dropped intermediate positions are fine — cursor "jumps"
  - Selection changes sent immediately (user expects to see highlight)
\`\`\`

## Scaling Presence for Large Documents

With 100 concurrent editors, presence data becomes significant:

\`\`\`
Naive: broadcast every update to every user
  100 users × 10 updates/s × 99 recipients = 99,000 messages/s
  Per document! This does not scale.

Optimization 1: Viewport-based filtering
  Only send presence updates for users visible in your viewport.
  If User A is on page 1 and User C is on page 50,
  User A does not need User C's cursor position.

  Reduction: typically 70-80% fewer messages

Optimization 2: Batching
  Collect presence updates for 100ms, send as single batch.
  {
    presences: [
      { user: "A", cursor: {...} },
      { user: "B", cursor: {...} },
      { user: "C", cursor: {...} }
    ]
  }

  Reduction: 10x fewer WebSocket frames

Optimization 3: Delta encoding
  Only send changed fields.
  If User A's cursor moved but User B's didn't,
  only include User A in the batch.

Result: 100-user document generates ~500 messages/s total
  (down from 99,000 naive)
\`\`\`

## User Awareness Features

Beyond cursors, presence includes awareness metadata:

\`\`\`
Feature: "Who's here" indicator
  ┌──────────────────────────────┐
  │ 👤 Alice (editing)           │
  │ 👤 Bob (viewing)             │
  │ 👤 Carol (idle - 5 min ago)  │
  └──────────────────────────────┘

States:
  - Active: edited within last 30 seconds
  - Viewing: document open, no recent edits
  - Idle: no activity for 5+ minutes
  - Offline: WebSocket disconnected

Color assignment:
  Each user gets a deterministic color based on their user ID.
  hash(user_id) % 12 → one of 12 predefined colors.
  Same user always gets same color across sessions.
\`\`\`

## Typing Indicators

\`\`\`
"Alice is typing in paragraph 3"

Implementation:
  - Client sends typing_start event when user begins typing
  - Client sends typing_stop event after 3 seconds of inactivity
  - Server broadcasts to relevant users (viewport filtering)
  - Client-side: show indicator for 3 seconds after last typing event

  Typing events are even more ephemeral than cursor positions.
  They are fire-and-forget — no ACKs, no retries.
\`\`\`

## Scale Numbers

\`\`\`
Presence updates generated:  ~150M/s (30/s × 50M connected users, pre-throttle)
Presence updates broadcast:  ~50M/s (after throttling + viewport filtering)
Presence message size:       ~200 bytes (compressed)
Presence bandwidth:          ~10 GB/s total
Memory per user session:     ~500 bytes (cursor, selection, metadata)
Color palette:               12 colors (deterministic assignment)
Heartbeat interval:          30 seconds
Idle timeout:                5 minutes
Disconnection detection:     2 missed heartbeats (60 seconds)
\`\`\`

## Trade-offs

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| State type | Ephemeral (in-memory) | Persistent | Presence lost on crash is acceptable |
| Update rate | Throttle to 10/s | Send every keystroke | Bandwidth savings, imperceptible delay |
| Filtering | Viewport-based | Broadcast all | 80% reduction in messages |
| Position anchoring | Path + offset | Character offset | Stable under concurrent edits |
| Color assignment | Deterministic hash | Random | Consistent across sessions |`,
    },
    {
      id: "docs-architecture",
      slug: "docs-architecture",
      title: "Architecture Walkthrough",
      content: `# Google Docs: Complete Architecture Walkthrough

## Full System Architecture

\`\`\`
                        ┌─────────────────────────┐
                        │    CDN + Edge Network    │
                        │  (static assets, fonts)  │
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │   WebSocket Gateway     │
                        │  (10K instances, edge)   │
                        │  - TLS termination       │
                        │  - auth + routing        │
                        └────────────┬────────────┘
                                     │
         ┌──────────────────────────┼───────────────────────────┐
         │               │          │          │                │
 ┌───────▼──────┐ ┌──────▼───┐ ┌───▼────┐ ┌───▼─────┐ ┌───────▼──────┐
 │ Collab       │ │ Document │ │ Auth   │ │ Comment │ │ Version     │
 │ Server       │ │ Storage  │ │ Service│ │ Service │ │ History     │
 │ (50K inst)   │ │ Service  │ │        │ │         │ │ Service     │
 │ - OT engine  │ │ - CRUD   │ │ - OAuth│ │ - CRUD  │ │ - snapshots │
 │ - op ordering│ │ - search │ │ - ACLs │ │ - thread│ │ - diff      │
 │ - broadcast  │ │ - share  │ │ - share│ │ - notify│ │ - restore   │
 │ - presence   │ │          │ │        │ │         │ │             │
 └──────┬───────┘ └────┬─────┘ └───┬────┘ └───┬────┘ └──────┬──────┘
        │              │           │           │             │
        └──────────────┴───────┬───┴───────────┴─────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │ Cloud Spanner│ │ Kafka        │ │ Cloud        │
      │ (op log +    │ │ (real-time   │ │ Storage      │
      │  metadata)   │ │  event bus)  │ │ (snapshots + │
      │              │ │              │ │  media)      │
      └──────────────┘ └──────────────┘ └──────────────┘

      ┌──────────────────────────────────────────────┐
      │           Cross-Region Replication           │
      │  ┌────────┐    ┌────────┐    ┌────────┐      │
      │  │ US     │◀──▶│ EU     │◀──▶│ Asia   │      │
      │  │ Region │    │ Region │    │ Region │      │
      │  └────────┘    └────────┘    └────────┘      │
      └──────────────────────────────────────────────┘
\`\`\`

## Data Flow: Collaborative Editing Session

Let's trace the flow from opening a document to real-time co-editing.

### Step 1: Opening the Document

\`\`\`
User opens docs.google.com/document/d/abc123:

Browser:
  ├── Load static assets from CDN (HTML, JS, CSS)
  ├── Authenticate via Google OAuth
  ├── REST call: GET /api/docs/abc123/metadata
  │   └── Returns: title, owner, permissions, last_modified
  ├── REST call: GET /api/docs/abc123/content
  │   └── Document Storage returns latest snapshot + pending ops
  ├── Establish WebSocket to wss://docs-realtime.google.com
  │   ├── Gateway routes to collab server for doc abc123
  │   └── Collab server: register user, send current revision
  └── Render document in browser (~300ms total)
\`\`\`

### Step 2: User A Types a Word

\`\`\`
User A types "hello" at position 42:

Client-side (optimistic):
  ├── Apply operation locally → document updates instantly
  ├── Buffer: op = RETAIN(42), INSERT("hello"), RETAIN(rest)
  ├── Send to collab server: { op, base_revision: 8450 }
  └── Enter "Awaiting ACK" state

Collab Server:
  ├── Receive op from User A (base: 8450)
  ├── Server is at revision 8451 (User B edited)
  ├── Transform A's op against revision 8451's op
  ├── Apply transformed op → new revision 8452
  ├── Persist to op log (Kafka, then Spanner)
  ├── ACK to User A: { revision: 8452 }
  └── Broadcast to User B: { op: transformed_op, revision: 8452 }

User B's client:
  ├── Receive remote op (revision 8452)
  ├── Transform against any pending local ops
  ├── Apply to local document
  └── User B sees "hello" appear at correct position
\`\`\`

### Step 3: Cursor and Presence Updates

\`\`\`
As User A types, cursor moves:

Client A → Server (throttled to 10/s):
  { type: "presence", cursor: { path: [5,0], offset: 47 } }

Server:
  ├── Update User A's presence in memory
  ├── Viewport check: is User B looking at paragraph 5?
  │   ├── YES → forward presence update
  │   └── NO → skip (bandwidth savings)
  └── Broadcast to relevant users

User B sees: blue cursor labeled "Alice" at position 47
\`\`\`

### Step 4: Offline Edit and Reconnection

\`\`\`
User C goes offline (laptop lid closed):

While offline:
  ├── User C continues editing locally
  ├── Operations queued in IndexedDB (browser storage)
  ├── 45 operations accumulated over 2 hours
  └── Meanwhile, document advanced from rev 8452 to rev 8890

User C reconnects:
  ├── WebSocket re-established
  ├── Client sends: { last_known_revision: 8452, pending_ops: 45 }
  ├── Server: gap = 438 revisions
  │   ├── Load ops 8453-8890 from op log
  │   ├── Transform C's 45 ops against 438 server ops
  │   └── This is O(45 × 438) = ~20K transforms (~50ms)
  ├── Apply transformed ops → new revision 8891
  ├── ACK to User C with transformed state
  └── Broadcast to all other users

User C's document converges with everyone else.
Total catch-up time: ~200ms
\`\`\`

## Version History

\`\`\`
Version History Service:

  Named versions (user-created):
    "Final Draft" → snapshot at revision 8500
    "After Review" → snapshot at revision 9200

  Auto-saved versions (system-created):
    Every 5 minutes during active editing
    Older versions consolidated:
      Last 24 hours: every 5 minutes
      Last 30 days: every hour
      Older: every day

  Viewing a version:
    1. Load snapshot closest to requested revision
    2. Replay ops forward/backward to exact revision
    3. Render as read-only document

  Restoring a version:
    1. Load target version's content
    2. Create new operation: "replace entire document with version X content"
    3. Apply through normal OT pipeline
    4. All users see restored content
    5. History is preserved — restoring is just another edit
\`\`\`

## Key Databases

| Data | Store | Why |
|------|-------|-----|
| Operation log | Kafka (7 days) + Cloud Spanner | Ordered, durable, globally replicated |
| Document snapshots | Cloud Storage (GCS) | Cheap, durable, versioned |
| Document metadata | Cloud Spanner | Strong consistency, global access |
| User presence | In-memory (collab server) | Ephemeral, low latency |
| Comments | Cloud Spanner | Persistent, relational |
| Media/images | Cloud Storage (GCS) | Large blobs, CDN-served |
| Search index | Elasticsearch | Full-text search across docs |
| Permissions | Cloud Spanner | ACL checks on every access |

## Reliability

| Failure | Impact | Mitigation |
|---------|--------|------------|
| Collab server crash | Active users disconnected | Reconnect to new server, catch-up protocol |
| WebSocket gateway down | Connection dropped | Client auto-reconnects to different gateway |
| Kafka partition down | Ops not persisted | Synchronous replication (3 replicas) |
| Spanner region down | Metadata unavailable | Multi-region Spanner (automatic failover) |
| Client offline | User edits locally | IndexedDB queue, sync on reconnect |

## Scaling Summary

| Component | Scale | Strategy |
|-----------|-------|----------|
| WebSocket Gateways | 50M connections | 10K edge instances, regional |
| Collab Servers | 300M active docs | 50K instances, sharded by doc_id |
| Op Log (Kafka) | 28M ops/s | Partitioned by doc_id |
| Snapshots (GCS) | 60M/day created | Object storage, lifecycle policies |
| Spanner | 1B+ metadata rows | Global, multi-region |
| Presence | 50M users tracked | In-memory, per collab server |
| Search | 15B documents indexed | Elasticsearch cluster |`,
    },
  ],
};
