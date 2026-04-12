import { Module } from "../types";

export const googleDocsModule: Module = {
  id: "sd-12",
  title: "Design Google Docs",
  description: "Design a real-time collaborative document editor supporting concurrent editing, conflict resolution, version history, and sharing permissions.",
  lessons: [
    {
      id: "sd-12-01",
      slug: "google-docs-requirements",
      title: "Requirements & Estimation",
      content: `# Google Docs: Requirements & Estimation

## What Are We Designing?

A real-time collaborative document editor where multiple users can simultaneously view and edit the same document, see each other's cursors, and have changes merged automatically without conflicts. Think Google Docs, Notion, or Figma's text editing.

## Functional Requirements

1. **Real-time collaborative editing** — Multiple users edit the same document simultaneously. Changes appear on all clients within milliseconds.
2. **Document CRUD** — Create, read, update, and delete documents.
3. **Sharing and permissions** — Share documents with specific users or via link. Support viewer, commenter, and editor roles.
4. **Version history** — View and restore previous versions of a document.
5. **Offline support** — Users can edit while disconnected and sync when reconnected.
6. **Rich text formatting** — Bold, italic, headings, lists, tables, images, etc.

## Non-Functional Requirements

- **Low latency** — Edits should appear on other clients within 100-200ms.
- **Consistency** — All users must eventually see the same document state (strong eventual consistency).
- **Availability** — The service should remain usable even during partial infrastructure failures.
- **Durability** — No user content should be lost.
- **Scalability** — Support millions of documents with varying levels of concurrent editors.

## Back-of-the-Envelope Estimation

Assume 50 million daily active users, 200 million total documents.

| Metric | Calculation |
|--------|------------|
| Average document size | ~50 KB (plain text + formatting metadata) |
| Total document storage | 200M x 50 KB = **~10 TB** |
| Active editing sessions (peak) | ~5M concurrent editors |
| Edits per second (per user while typing) | ~5 keystrokes/sec |
| Total edits per second (peak) | 5M x 5 = **~25M operations/sec** |
| WebSocket connections (peak) | **~5M persistent connections** |
| Version history storage | ~10x document storage = **~100 TB** (storing diffs) |

The key challenge is not storage (10 TB is modest) but real-time synchronization of 25 million operations per second across millions of concurrent sessions.

## Collaboration Patterns

Most documents have few concurrent editors:
- **95% of sessions**: 1 editor (solo editing)
- **4% of sessions**: 2-5 editors
- **1% of sessions**: 5-50 editors
- **< 0.01%**: 50+ editors (rare but must be supported)

This distribution means most sessions are simple, but the system must handle the complex concurrent cases correctly.

## Key Takeaways

- The core challenge is real-time synchronization, not storage or throughput.
- WebSocket connections are essential for pushing changes to clients with minimal latency.
- Most editing sessions involve a single user, but the architecture must handle high concurrency correctly.
- Version history multiplies storage needs but can be optimized by storing diffs rather than full snapshots.
- Offline editing adds significant complexity to the conflict resolution system.
`,
    },
    {
      id: "sd-12-02",
      slug: "google-docs-high-level-design",
      title: "High-Level Design",
      content: `# Google Docs: High-Level Design

## Architecture Overview

\`\`\`
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Client A │  │ Client B │  │ Client C │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │  WebSocket   │  WebSocket  │
     v              v             v
┌─────────────────────────────────────────┐
│        WebSocket Gateway                │
│   (manages persistent connections)      │
└──────────────────┬──────────────────────┘
                   │
                   v
┌─────────────────────────────────────────┐
│        Document Service                  │
│   (applies operations, resolves         │
│    conflicts, broadcasts changes)       │
└────────┬──────────────┬─────────────────┘
         │              │
         v              v
┌──────────────┐  ┌──────────────┐
│  Document    │  │  Version     │
│  Store       │  │  History     │
│  (current)   │  │  Store       │
└──────────────┘  └──────────────┘
\`\`\`

## Connection Layer: WebSockets

Traditional HTTP request-response is too slow for real-time editing. Instead, each client opens a **persistent WebSocket connection** to the server. This allows:

- **Server push** — The server instantly pushes other users' edits to all connected clients.
- **Low overhead** — No repeated HTTP handshakes or headers for each keystroke.
- **Bidirectional** — Both client and server can send messages at any time.

When a user opens a document, the client establishes a WebSocket to the gateway, which routes it to the Document Service instance managing that document.

## Document Service

The Document Service is the brain of the system. For each active document, it:

1. **Receives operations** from connected clients (e.g., "insert 'a' at position 12").
2. **Transforms operations** to resolve conflicts when multiple edits arrive simultaneously.
3. **Applies operations** to the server's authoritative copy of the document.
4. **Broadcasts transformed operations** to all other clients editing the document.
5. **Persists changes** to the document store and version history.

Each active document is assigned to exactly one Document Service instance. This avoids the need for distributed locking on the document state.

## Document Storage

- **Current state store** — Holds the latest version of each document. Could be a NoSQL document database (MongoDB) or an object store. Optimized for fast reads (when opening a document).
- **Version history store** — Stores a sequence of operations (or periodic snapshots + diffs). Allows users to view and restore previous versions.

## Sharing and Permissions

A separate **Permissions Service** manages access control:
- Document owner sets sharing rules (specific users, anyone with link, public).
- Each access check happens when: opening a document, receiving an edit, or changing sharing settings.
- Permissions are cached on the WebSocket gateway to avoid per-operation database lookups.

## Session Routing

When a user opens a document, the system must route them to the correct Document Service instance:

1. A mapping store (e.g., Redis) tracks which Document Service instance manages each active document.
2. If no instance is managing the document yet, one is assigned (via consistent hashing of the document ID).
3. The WebSocket gateway looks up this mapping and routes the connection accordingly.

## Key Takeaways

- WebSockets provide the low-latency bidirectional communication needed for real-time editing.
- Each active document is managed by exactly one server instance to simplify conflict resolution.
- The Document Service handles the core complexity: receiving, transforming, and broadcasting operations.
- Version history uses operation logs (or diffs), not full document snapshots, to save storage.
- Permissions are checked at connection time and cached to avoid per-keystroke authorization overhead.
`,
    },
    {
      id: "sd-12-03",
      slug: "google-docs-conflict-resolution",
      title: "Deep Dive: Conflict Resolution",
      content: `# Google Docs: Conflict Resolution

## The Core Problem

When two users type simultaneously in the same document, their edits may conflict. Consider:

- Document state: "ABCD"
- User A inserts "X" at position 1 -> "AXBCD"
- User B deletes character at position 3 (the "D") -> "ABC"

If we apply both operations naively on the server, the result depends on the order — and it will be wrong either way. We need a system that produces a consistent, intuitive result regardless of the order operations arrive.

## Operational Transformation (OT)

OT is the original algorithm for collaborative editing, used by Google Docs. The key idea: when an operation arrives, **transform it** against any operations that have been applied since the client's last known state.

### How It Works

Each operation carries a **revision number** indicating which version of the document it was created against.

1. Client A sends: Insert("X", pos=1, rev=5)
2. Client B sends: Delete(pos=3, rev=5)
3. Both were made against revision 5, but they arrive at the server sequentially.

The server applies A's operation first (rev 5 -> rev 6). Now B's operation was made against rev 5, but the document is now at rev 6. The server **transforms** B's operation:
- A inserted at position 1, shifting everything after it right by 1.
- B's delete at position 3 must be adjusted to position 4.

Transformed operation: Delete(pos=4, rev=6). Now both operations produce a consistent result.

### OT Transform Rules

For two concurrent operations O1 and O2:
- **Insert vs Insert**: If O2's position >= O1's position, shift O2's position by +1.
- **Insert vs Delete**: If O2's delete position >= O1's insert position, shift O2's position by +1.
- **Delete vs Insert**: If O2's insert position > O1's delete position, shift O2's position by -1.
- **Delete vs Delete**: If they delete the same position, one becomes a no-op.

## CRDTs (Conflict-free Replicated Data Types)

CRDTs are a newer approach where the data structure itself guarantees conflict-free merging. Each character in the document has a **unique, globally ordered ID** that never changes, regardless of insertions or deletions around it.

### How It Works (Simplified)

Instead of positions, each character is identified by a unique tuple like \`(userId, sequenceNumber)\`. The ordering between characters is maintained through fractional positions or tree structures.

- User A inserts "X" between characters with IDs 0.2 and 0.4 -> new ID is 0.3.
- User B inserts "Y" between the same pair -> new ID is 0.35 (or some unique value between 0.2 and 0.4).
- Both insertions can be applied in any order and will produce a deterministic result.

## OT vs CRDT Comparison

| Aspect | OT | CRDT |
|--------|-----|------|
| Server requirement | Needs a central server to order operations | Can work peer-to-peer |
| Complexity | Transform functions are complex and error-prone | Data structure is complex, but merging is automatic |
| Offline support | Difficult — long offline periods create many transforms | Natural — operations merge cleanly after reconnection |
| Memory overhead | Low (operations are small) | Higher (each character needs a unique ID) |
| Proven at scale | Google Docs (15+ years in production) | Figma, Yjs, Automerge (newer but growing) |

## Cursor and Selection Management

Each user's cursor position and text selection must be tracked and displayed to other users:
- Cursor positions are expressed as document positions and broadcast to all clients.
- When an operation transforms document positions, cursor positions must also be transformed.
- Each user is assigned a distinct color for their cursor and selection highlight.
- Cursor updates are sent at a lower frequency (e.g., 10 Hz) than document edits to reduce bandwidth.

## Key Takeaways

- OT transforms concurrent operations against each other to produce consistent results, but requires a central server.
- CRDTs embed conflict resolution into the data structure itself, enabling peer-to-peer and offline collaboration.
- Google Docs uses OT; newer tools like Figma use CRDTs.
- Both approaches guarantee **strong eventual consistency** — all clients converge to the same state.
- Cursor management is a separate synchronization problem that piggybacks on the same infrastructure.
`,
    },
    {
      id: "sd-12-04",
      slug: "google-docs-scaling",
      title: "Scaling & Trade-offs",
      content: `# Google Docs: Scaling & Trade-offs

## Document Partitioning

With millions of active documents, a single server cannot manage them all. We partition documents across Document Service instances:

- **Consistent hashing** by document ID assigns each document to a specific instance.
- Each instance manages thousands of documents simultaneously.
- If an instance fails, its documents are reassigned to other instances. The new instance loads the document state from the database and clients reconnect via the WebSocket gateway.

For very popular documents (e.g., a company-wide document with 100+ concurrent editors), a single instance is dedicated to that document alone.

## WebSocket Connection Scaling

At 5 million concurrent connections, the WebSocket gateway must scale horizontally:

- Each gateway server handles ~50K-100K concurrent WebSocket connections.
- 5M connections require 50-100 gateway servers.
- A load balancer distributes new connections, but existing connections are sticky (once established, a WebSocket stays on the same server until disconnected).
- Gateway servers are stateless — they simply route messages between clients and the Document Service.

## Offline Support

Supporting offline editing is one of the hardest problems:

1. **Local-first editing**: The client maintains a local copy of the document and applies edits immediately, providing instant responsiveness.
2. **Operation buffering**: While offline, edits are stored in a local operation log.
3. **Reconnection sync**: When connectivity returns, the client sends its buffered operations to the server. The server transforms them against any operations that happened while the client was offline.
4. **Conflict resolution**: CRDTs handle offline reconnection more naturally than OT. With OT, long offline periods generate many operations that all need transformation, which is complex and slow.

## Version History Storage

Storing every keystroke forever is impractical. A tiered approach:

| Time Period | Granularity | Storage Format |
|-------------|-------------|----------------|
| Last 1 hour | Every operation | Operation log |
| Last 30 days | Snapshots every 5 minutes | Compressed snapshots |
| Older than 30 days | Snapshots every hour | Archived snapshots |

When a user views version history, the system shows the available snapshots. Restoring a version creates a new snapshot at the current head rather than rewriting history.

**Storage savings**: Instead of storing 1,000 operations per minute, we store 1 snapshot every 5 minutes (after the first hour). This reduces version history storage by approximately 100x for active documents.

## Real-Time Presence Indicators

Users need to see who else is viewing or editing:

- **Presence service** tracks which users have a document open.
- Broadcasts user join/leave events to all connected clients.
- Shows colored cursors and name labels for each active editor.
- Presence state is ephemeral — stored only in memory (Redis or the Document Service instance). If the server restarts, clients re-announce their presence on reconnection.

Presence updates use a heartbeat mechanism: clients send a heartbeat every 30 seconds. If no heartbeat is received for 60 seconds, the user is considered to have left.

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| OT vs CRDT | Proven, lower memory, needs server | Newer, offline-friendly, higher memory |
| Version granularity | Every operation (huge storage) | Periodic snapshots (lossy but practical) |
| Single server per doc vs Distributed | Simple consistency, limited scale | Complex but handles very popular docs |
| Eager vs Lazy loading | Load full doc on open (simple, high latency for large docs) | Load visible portion first (complex, faster perceived load) |

## Key Takeaways

- Document partitioning via consistent hashing distributes load across Document Service instances.
- WebSocket gateways scale horizontally with sticky connections and are stateless for easy replacement.
- Offline support is significantly easier with CRDTs than with OT due to natural merge semantics.
- Version history uses a tiered approach — fine-grained for recent changes, coarse-grained for older ones.
- Presence indicators are ephemeral and best stored in memory rather than persisted to a database.
`,
    },
  ],
};
