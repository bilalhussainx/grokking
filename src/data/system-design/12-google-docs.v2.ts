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

\`\`\`concept
{
  "title": "Requirements Engineering vs. Software Estimation",
  "variant": "mental-model",
  "content": "Requirements Engineering answers *what* to build and *why*, while Software Estimation answers *how much* it will cost and *how long* it will take. In system design, these two disciplines work together: requirements define the target, estimation determines if it's feasible within constraints."
}
\`\`\`

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

\`\`\`quiz
{
  "title": "Requirements Classification",
  "questions": [
    {
      "question": "Which of the following is a NON-functional requirement for our collaborative editor?",
      "options": [
        "Users can share documents via link",
        "Edits appear within 200ms on other clients",
        "Support for bold and italic formatting",
        "Ability to restore previous document versions"
      ],
      "answer": 1,
      "explanation": "Latency requirements (200ms) are non-functional - they specify *how well* the system should perform, not *what* it should do. The other options are functional requirements describing specific features."
    },
    {
      "question": "Why is 100-200ms latency critical for real-time collaboration?",
      "options": [
        "It matches human typing speed",
        "It's below the threshold where users notice delays",
        "It matches network round-trip time",
        "It's required for database consistency"
      ],
      "answer": 1,
      "explanation": "Research shows that delays above 200-300ms become noticeable to users, breaking the illusion of real-time collaboration and making the experience feel sluggish."
    },
    {
      "question": "Which requirement presents the greatest architectural challenge?",
      "options": [
        "Storing 10 TB of documents",
        "Supporting 5M WebSocket connections",
        "Handling 25M operations/second with consistency",
        "Managing user permissions"
      ],
      "answer": 2,
      "explanation": "While 5M WebSocket connections is significant, synchronizing 25M operations/second across distributed clients while maintaining consistency is the core technical challenge that drives the entire architecture."
    }
  ]
}
\`\`\`

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

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Storage Growth Estimator",
  "inputs": [
    { "id": "docs", "label": "Total Documents (millions)", "default": 200, "min": 1, "max": 1000 },
    { "id": "size", "label": "Avg Document Size (KB)", "default": 50, "min": 10, "max": 500 },
    { "id": "history", "label": "Version History Multiplier", "default": 10, "min": 1, "max": 50 }
  ]
}
\`\`\`

## Collaboration Patterns

Most documents have few concurrent editors:
- **95% of sessions**: 1 editor (solo editing)
- **4% of sessions**: 2-5 editors
- **1% of sessions**: 5-50 editors
- **< 0.01%**: 50+ editors (rare but must be supported)

This distribution means most sessions are simple, but the system must handle the complex concurrent cases correctly.

\`\`\`callout
{
  "type": "info",
  "title": "The 99/1 Rule in Collaboration",
  "content": "While 99% of editing sessions involve 5 or fewer users, the 1% of high-concurrency sessions (5-50+ editors) drive the most complex architectural decisions. These edge cases determine your choice of conflict resolution algorithms, data structures, and consistency models."
}
\`\`\`

## Conflict Resolution Trade-offs

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Operational Transformation (OT)",
    "code": "// Central server coordinates all operations\\nfunction transformOperation(op1, op2) {\\n  // Complex transformation logic\\n  if (op1.type === 'insert' && op2.type === 'delete') {\\n    return transformInsertDelete(op1, op2);\\n  }\\n  // ... many more cases\\n}"
  },
  "after": {
    "label": "CRDTs (Conflict-free Replicated Data Types)",
    "code": "// Each client merges independently\\nfunction mergeOperations(local, remote) {\\n  // Automatic convergence\\n  return local.merge(remote);\\n}"
  }
}
\`\`\`

\`\`\`concept
{
  "title": "OT vs. CRDTs: The Fundamental Trade-off",
  "variant": "insight",
  "content": "Google Docs uses OT because it preserves user intent better for text editing and works well with a central server. Figma switched to CRDTs because design operations are more commutative. The choice depends on your data model and whether you need peer-to-peer capabilities."
}
\`\`\`

## Key Takeaways

- The core challenge is real-time synchronization, not storage or throughput.
- WebSocket connections are essential for pushing changes to clients with minimal latency.
- Most editing sessions involve a single user, but the architecture must handle high concurrency correctly.
- Version history multiplies storage needs but can be optimized by storing diffs rather than full snapshots.
- Offline editing adds significant complexity to the conflict resolution system.`,
    },
    {
      id: "sd-12-02",
      slug: "google-docs-high-level-design",
      title: "High-Level Design",
      content: `# Google Docs: High-Level Design

\`\`\`concept
{
  "title": "High-Level Design",
  "variant": "mental-model",
  "content": "Think of the collaborative editor as a distributed state machine: every keystroke is an event that must be ordered, transformed, and replayed identically on every client. The server is the single source of truth that serializes these events so all users converge to the same document."
}
\`\`\`

## Architecture Overview

\`\`\`sysdiag
{
  "title": "Core Components & Data Flow",
  "width": 720,
  "height": 420,
  "nodes": [
    { "id": "c1", "label": "Client A", "x": 80, "y": 60, "kind": "user" },
    { "id": "c2", "label": "Client B", "x": 360, "y": 60, "kind": "user" },
    { "id": "c3", "label": "Client C", "x": 640, "y": 60, "kind": "user" },
    { "id": "gw", "label": "WebSocket\\nGateway", "x": 360, "y": 140, "kind": "gateway" },
    { "id": "ds", "label": "Document\\nService", "x": 360, "y": 240, "kind": "service" },
    { "id": "dc", "label": "Document\\nStore", "x": 200, "y": 340, "kind": "database" },
    { "id": "vh", "label": "Version\\nHistory", "x": 520, "y": 340, "kind": "database" }
  ],
  "edges": [
    { "from": "c1", "to": "gw", "label": "WS" },
    { "from": "c2", "to": "gw", "label": "WS" },
    { "from": "c3", "to": "gw", "label": "WS" },
    { "from": "gw", "to": "ds", "label": "route" },
    { "from": "ds", "to": "dc", "label": "write" },
    { "from": "ds", "to": "vh", "label": "append op" },
    { "from": "ds", "to": "gw", "label": "broadcast", "curved": true }
  ],
  "annotations": {
    "gw": "Keeps persistent WebSocket connections alive and caches permissions.",
    "ds": "Single-instance per active doc; applies OT/CRDT and broadcasts changes.",
    "vh": "Append-only log of operations, not full snapshots, for space efficiency."
  }
}
\`\`\`

## Connection Layer: WebSockets

Traditional HTTP request-response is too slow for real-time editing. Instead, each client opens a **persistent WebSocket connection** to the server. This allows:

- **Server push** — The server instantly pushes other users' edits to all connected clients.
- **Low overhead** — No repeated HTTP handshakes or headers for each keystroke.
- **Bidirectional** — Both client and server can send messages at any time.

When a user opens a document, the client establishes a WebSocket to the gateway, which routes it to the Document Service instance managing that document.

\`\`\`quiz
{
  "title": "Why WebSockets?",
  "questions": [
    {
      "question": "Which property of WebSockets most directly supports the <200 ms latency target?",
      "options": [
        "Full-duplex communication",
        "No repeated TCP handshakes",
        "Binary framing",
        "Built-in compression"
      ],
      "answer": 1,
      "explanation": "Eliminating the TCP + TLS handshake on every keystroke saves 1-2 RTTs, the dominant latency component for small messages."
    },
    {
      "question": "If the gateway caches permissions, what risk arises when a doc owner revokes access?",
      "options": [
        "Nothing; revocation is instant",
        "Revoked user keeps editing until cache TTL expires",
        "Gateway must restart",
        "Document becomes read-only for everyone"
      ],
      "answer": 1,
      "explanation": "A short-lived cache (e.g., 5 s) trades a small window of stale access for a 10× reduction in permission-store queries."
    },
    {
      "question": "Why assign exactly one Document Service instance per active document?",
      "options": [
        "Reduces memory usage",
        "Avoids distributed locking on document state",
        "Improves CRDT convergence speed",
        "Simplifies WebSocket routing"
      ],
      "answer": 1,
      "explanation": "Single writer eliminates race conditions when applying operations, making OT/CRDT logic deterministic and easier to reason about."
    }
  ]
}
\`\`\`

## Document Service

The Document Service is the brain of the system. For each active document, it:

1. **Receives operations** from connected clients (e.g., "insert 'a' at position 12").
2. **Transforms operations** to resolve conflicts when multiple edits arrive simultaneously.
3. **Applies operations** to the server's authoritative copy of the document.
4. **Broadcasts transformed operations** to all other clients editing the document.
5. **Persists changes** to the document store and version history.

Each active document is assigned to exactly one Document Service instance. This avoids the need for distributed locking on the document state.

\`\`\`steps
{
  "title": "Lifecycle of a Single Keystroke",
  "steps": [
    {
      "title": "1. Local optimistic update",
      "content": "User types 'h'. Client immediately renders it and queues the operation \`insert('h', pos=12)\`."
    },
    {
      "title": "2. Send to server",
      "content": "Operation is sent over the existing WebSocket with a monotonic local timestamp."
    },
    {
      "title": "3. Server serializes & transforms",
      "content": "Document Service assigns the next global sequence number, transforms the operation against any concurrent ops, and applies it to the authoritative doc."
    },
    {
      "title": "4. Broadcast & persist",
      "content": "Transformed operation is broadcast to all clients and appended to the version-history log."
    },
    {
      "title": "5. Client acknowledges",
      "content": "Receiving clients apply the transformed operation; the original client confirms its provisional edit is now permanent."
    }
  ]
}
\`\`\`

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

\`\`\`callout
{
  "type": "tip",
  "title": "Choosing Consistent Hashing",
  "content": "Consistent hashing minimizes re-shuffling when Document Service instances are added or removed, keeping most documents on their existing server and reducing cold-start latency."
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "WebSockets provide the low-latency bidirectional communication needed for real-time editing.",
    "Each active document is managed by exactly one server instance to simplify conflict resolution.",
    "The Document Service handles the core complexity: receiving, transforming, and broadcasting operations.",
    "Version history uses operation logs (or diffs), not full document snapshots, to save storage.",
    "Permissions are checked at connection time and cached to avoid per-keystroke authorization overhead."
  ]
}
\`\`\``,
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

\`\`\`algoviz
{
  "title": "The Race Condition Problem",
  "type": "array",
  "data": ["A", "B", "C", "D"],
  "frames": [
    { "highlight": [0, 1, 2, 3], "label": "Initial: ABCD", "stats": {} },
    { "highlight": [0, 1, 2, 3, 4], "label": "User A inserts X at pos 1", "stats": {} },
    { "highlight": [0, 1, 2, 3], "label": "User B deletes at pos 3", "stats": {} },
    { "highlight": [0, 1, 2, 3], "label": "Inconsistent result!", "stats": {} }
  ],
  "speed": 1000
}
\`\`\`

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

\`\`\`trace
{
  "title": "OT in Action: Transforming Operations",
  "language": "python",
  "code": "def transform_insert_vs_delete(insert_pos, delete_pos):\\n    # If delete happens after insert, shift it\\n    if delete_pos >= insert_pos:\\n        return delete_pos + 1\\n    return delete_pos\\n\\ndef apply_ot():\\n    # Initial state\\n    doc = ['A', 'B', 'C', 'D']\\n    print(f\\"Initial: {''.join(doc)}\\")\\n    \\n    # User A: Insert X at position 1\\n    doc.insert(1, 'X')\\n    print(f\\"After A's insert: {''.join(doc)}\\")\\n    \\n    # Transform B's delete (originally pos 3)\\n    original_delete_pos = 3\\n    transformed_pos = transform_insert_vs_delete(1, original_delete_pos)\\n    print(f\\"B's delete transformed: pos {original_delete_pos} -> {transformed_pos}\\")\\n    \\n    # Apply transformed delete\\n    if transformed_pos < len(doc):\\n        del doc[transformed_pos]\\n    print(f\\"Final result: {''.join(doc)}\\")\\n\\napply_ot()",
  "frames": [
    { "line": 1, "vars": {}, "note": "Define transformation function", "stdout": "" },
    { "line": 6, "vars": {"doc": ["A", "B", "C", "D"]}, "note": "Initial document state", "stdout": "Initial: ABCD\\n" },
    { "line": 10, "vars": {"doc": ["A", "X", "B", "C", "D"]}, "note": "Apply A's insert", "stdout": "After A's insert: AXBCD\\n" },
    { "line": 14, "vars": {"transformed_pos": 4}, "note": "Transform B's operation", "stdout": "B's delete transformed: pos 3 -> 4\\n" },
    { "line": 18, "vars": {"doc": ["A", "X", "B", "C"]}, "note": "Apply transformed delete", "stdout": "Final result: AXBC\\n" }
  ],
  "speed": 1200
}
\`\`\`

### OT Transform Rules

For two concurrent operations O1 and O2:
- **Insert vs Insert**: If O2's position >= O1's position, shift O2's position by +1.
- **Insert vs Delete**: If O2's delete position >= O1's insert position, shift O2's position by +1.
- **Delete vs Insert**: If O2's insert position > O1's delete position, shift O2's position by -1.
- **Delete vs Delete**: If they delete the same position, one becomes a no-op.

\`\`\`quiz
{
  "title": "OT Transform Rules Quiz",
  "questions": [
    {
      "question": "User A inserts at position 5. User B deletes at position 3. How should B's operation be transformed?",
      "options": ["No change needed", "Shift to position 4", "Shift to position 2", "Become a no-op"],
      "answer": 0,
      "explanation": "Since the delete position (3) is less than the insert position (5), no transformation is needed. The delete happens before the insert location."
    },
    {
      "question": "Two users both delete the same character at position 10. What happens after transformation?",
      "options": ["Both deletes execute", "First delete executes, second becomes no-op", "Both become no-ops", "Server rejects both"],
      "answer": 1,
      "explanation": "When two deletes target the same position, the first one executes normally, and the second one becomes a no-op to prevent double-deletion."
    },
    {
      "question": "User A inserts at position 5. User B inserts at position 7. How should B's operation be transformed?",
      "options": ["No change needed", "Shift to position 8", "Shift to position 6", "Become a no-op"],
      "answer": 1,
      "explanation": "Since B's insert position (7) is >= A's insert position (5), B's position shifts by +1 to position 8 to account for the new character."
    }
  ]
}
\`\`\`

## CRDTs (Conflict-free Replicated Data Types)

CRDTs are a newer approach where the data structure itself guarantees conflict-free merging. Each character in the document has a **unique, globally ordered ID** that never changes, regardless of insertions or deletions around it.

### How It Works (Simplified)

Instead of positions, each character is identified by a unique tuple like \`(userId, sequenceNumber)\`. The ordering between characters is maintained through fractional positions or tree structures.

- User A inserts "X" between characters with IDs 0.2 and 0.4 -> new ID is 0.3.
- User B inserts "Y" between the same pair -> new ID is 0.35 (or some unique value between 0.2 and 0.4).
- Both insertions can be applied in any order and will produce a deterministic result.

\`\`\`concept
{
  "title": "CRDT Mental Model: Fractional Indexing",
  "variant": "mental-model",
  "content": "Imagine characters as beads on a string, but instead of fixed positions, each bead has a unique fraction that determines its order. When you insert a new bead between 0.2 and 0.4, you give it fraction 0.3. If someone else inserts between the same beads, they might use 0.25 or 0.35. The key insight: these fractions can always be subdivided, ensuring unique ordering without coordination."
}
\`\`\`

## OT vs CRDT Comparison

| Aspect | OT | CRDT |
|--------|-----|------|
| Server requirement | Needs a central server to order operations | Can work peer-to-peer |
| Complexity | Transform functions are complex and error-prone | Data structure is complex, but merging is automatic |
| Offline support | Difficult — long offline periods create many transforms | Natural — operations merge cleanly after reconnection |
| Memory overhead | Low (operations are small) | Higher (each character needs a unique ID) |
| Proven at scale | Google Docs (15+ years in production) | Figma, Yjs, Automerge (newer but growing) |

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "OT: Server-Centric",
    "code": "# Server receives operations in sequence\\n# Must transform each one against previous changes\\n\\ndef handle_operation(op, client_id):\\n    # Get current document revision\\n    current_rev = get_revision()\\n    \\n    # Transform against all ops since client's revision\\n    transformed = op\\n    for prev_op in get_ops_since(op.revision):\\n        transformed = transform(transformed, prev_op)\\n    \\n    # Apply and broadcast\\n    apply_operation(transformed)\\n    broadcast_to_clients(transformed)"
  },
  "after": {
    "label": "CRDT: Peer-to-Peer",
    "code": "# Each peer can merge independently\\n# No central coordination needed\\n\\ndef merge_operations(local_ops, remote_ops):\\n    # CRDT merge is commutative\\n    # Order doesn't matter!\\n    \\n    for op in remote_ops:\\n        if not has_seen(op.id):\\n            apply_crdt_operation(op)\\n            mark_as_seen(op.id)\\n    \\n    # All peers converge to same state\\n    # regardless of merge order"
  }
}
\`\`\`

## Cursor and Selection Management

Each user's cursor position and text selection must be tracked and displayed to other users:
- Cursor positions are expressed as document positions and broadcast to all clients.
- When an operation transforms document positions, cursor positions must also be transformed.
- Each user is assigned a distinct color for their cursor and selection highlight.
- Cursor updates are sent at a lower frequency (e.g., 10 Hz) than document edits to reduce bandwidth.

\`\`\`sysdiag
{
  "title": "Cursor Synchronization Architecture",
  "width": 600,
  "height": 360,
  "nodes": [
    { "id": "client1", "label": "User A\\nClient", "x": 100, "y": 100, "kind": "client" },
    { "id": "client2", "label": "User B\\nClient", "x": 100, "y": 260, "kind": "client" },
    { "id": "server", "label": "Cursor\\nTracker", "x": 300, "y": 180, "kind": "service" },
    { "id": "doc", "label": "Document\\nState", "x": 500, "y": 180, "kind": "database" }
  ],
  "edges": [
    { "from": "client1", "to": "server", "label": "cursor pos\\n(10 Hz)" },
    { "from": "client2", "to": "server", "label": "cursor pos\\n(10 Hz)" },
    { "from": "server", "to": "client1", "label": "broadcast positions" },
    { "from": "server", "to": "client2", "label": "broadcast positions" },
    { "from": "server", "to": "doc", "label": "transform positions" }
  ],
  "annotations": {
    "server": "Maintains cursor positions for all users and transforms them when document operations are applied",
    "client1": "Sends cursor position updates at reduced frequency to minimize bandwidth usage"
  }
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "OT transforms concurrent operations against each other to produce consistent results, but requires a central server",
    "CRDTs embed conflict resolution into the data structure itself, enabling peer-to-peer and offline collaboration",
    "Google Docs uses OT; newer tools like Figma use CRDTs",
    "Both approaches guarantee **strong eventual consistency** — all clients converge to the same state",
    "Cursor management is a separate synchronization problem that piggybacks on the same infrastructure"
  ]
}
\`\`\``,
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

\`\`\`concept
{
  "title": "Consistent Hashing for Document Partitioning",
  "variant": "mental-model",
  "content": "Think of consistent hashing as a circular clock where documents are placed at different hours. When a server fails, its documents only need to move to the next 'hour' on the clock, minimizing disruption. This ensures that adding or removing servers affects only a small portion of documents, not the entire system."
}
\`\`\`

## WebSocket Connection Scaling

At 5 million concurrent connections, the WebSocket gateway must scale horizontally:

- Each gateway server handles ~50K-100K concurrent WebSocket connections.
- 5M connections require 50-100 gateway servers.
- A load balancer distributes new connections, but existing connections are sticky (once established, a WebSocket stays on the same server until disconnected).
- Gateway servers are stateless — they simply route messages between clients and the Document Service.

\`\`\`algoviz
{
  "title": "WebSocket Connection Distribution",
  "type": "array",
  "data": [50000, 75000, 60000, 80000, 45000, 70000, 55000, 65000, 90000, 70000],
  "frames": [
    {"highlight": [0], "label": "Gateway 1: 50K connections", "stats": {"total": 50000}},
    {"highlight": [1], "label": "Gateway 2: 75K connections", "stats": {"total": 125000}},
    {"highlight": [2], "label": "Gateway 3: 60K connections", "stats": {"total": 185000}},
    {"highlight": [3], "label": "Gateway 4: 80K connections", "stats": {"total": 265000}},
    {"highlight": [4], "label": "Gateway 5: 45K connections", "stats": {"total": 310000}}
  ],
  "speed": 1000
}
\`\`\`

## Offline Support

Supporting offline editing is one of the hardest problems:

1. **Local-first editing**: The client maintains a local copy of the document and applies edits immediately, providing instant responsiveness.
2. **Operation buffering**: While offline, edits are stored in a local operation log.
3. **Reconnection sync**: When connectivity returns, the client sends its buffered operations to the server. The server transforms them against any operations that happened while the client was offline.
4. **Conflict resolution**: CRDTs handle offline reconnection more naturally than OT. With OT, long offline periods generate many operations that all need transformation, which is complex and slow.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "OT: Complex Transformation Chain",
    "code": "# Client offline for 5 minutes\\n# Generates 100 operations\\n# Server must transform each against 150 concurrent ops\\n# Total transformations: 100 × 150 = 15,000\\n\\nfor local_op in offline_operations:\\n    for server_op in concurrent_operations:\\n        local_op = transform(local_op, server_op)\\n        if conflict_detected:\\n            resolve_conflict_manually()"
  },
  "after": {
    "label": "CRDT: Automatic Merge",
    "code": "# Client offline for 5 minutes\\n# Generates 100 operations\\n# CRDT merge: single operation\\n# Total merges: 100 (independent of concurrent ops)\\n\\nfor local_op in offline_operations:\\n    merged_doc = crdt.merge(document, local_op)\\n    # Conflicts resolved automatically by CRDT semantics"
  }
}
\`\`\`

## Version History Storage

Storing every keystroke forever is impractical. A tiered approach:

| Time Period | Granularity | Storage Format |
|-------------|-------------|----------------|
| Last 1 hour | Every operation | Operation log |
| Last 30 days | Snapshots every 5 minutes | Compressed snapshots |
| Older than 30 days | Snapshots every hour | Archived snapshots |

When a user views version history, the system shows the available snapshots. Restoring a version creates a new snapshot at the current head rather than rewriting history.

**Storage savings**: Instead of storing 1,000 operations per minute, we store 1 snapshot every 5 minutes (after the first hour). This reduces version history storage by approximately 100x for active documents.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Version History Storage Calculator",
  "inputs": [
    {"id": "ops_per_min", "label": "Operations per minute", "default": 1000, "min": 100, "max": 10000},
    {"id": "active_docs", "label": "Active documents", "default": 1000000, "min": 10000, "max": 10000000},
    {"id": "snapshot_interval", "label": "Snapshot interval (minutes)", "default": 5, "min": 1, "max": 60}
  ]
}
\`\`\`

## Real-Time Presence Indicators

Users need to see who else is viewing or editing:

- **Presence service** tracks which users have a document open.
- Broadcasts user join/leave events to all connected clients.
- Shows colored cursors and name labels for each active editor.
- Presence state is ephemeral — stored only in memory (Redis or the Document Service instance). If the server restarts, clients re-announce their presence on reconnection.

Presence updates use a heartbeat mechanism: clients send a heartbeat every 30 seconds. If no heartbeat is received for 60 seconds, the user is considered to have left.

\`\`\`trace
{
  "title": "Presence Heartbeat Protocol",
  "language": "python",
  "code": "class PresenceService:\\n    def __init__(self):\\n        self.active_users = {}  # user_id -> last_heartbeat\\n        self.heartbeat_timeout = 60  # seconds\\n    \\n    def heartbeat(self, user_id, doc_id):\\n        self.active_users[user_id] = time.time()\\n        self.broadcast_presence(doc_id, user_id, \\"active\\")\\n    \\n    def check_timeouts(self):\\n        current_time = time.time()\\n        for user_id, last_beat in self.active_users.items():\\n            if current_time - last_beat > self.heartbeat_timeout:\\n                self.broadcast_presence(doc_id, user_id, \\"left\\")\\n                del self.active_users[user_id]",
  "frames": [
    {"line": 1, "vars": {"active_users": {}, "heartbeat_timeout": 60}, "note": "Service initialized with empty presence state"},
    {"line": 7, "vars": {"active_users": {"alice": 1234567890}, "user_id": "alice"}, "note": "Alice sends heartbeat, marked as active"},
    {"line": 7, "vars": {"active_users": {"alice": 1234567890, "bob": 1234567890}}, "note": "Bob also joins the document"},
    {"line": 11, "vars": {"current_time": 1234567951}, "note": "60 seconds passed, checking for timeouts"},
    {"line": 14, "vars": {"active_users": {"bob": 1234567890}}, "note": "Alice timed out, removed from active users"}
  ],
  "speed": 1200
}
\`\`\`

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| OT vs CRDT | Proven, lower memory, needs server | Newer, offline-friendly, higher memory |
| Version granularity | Every operation (huge storage) | Periodic snapshots (lossy but practical) |
| Single server per doc vs Distributed | Simple consistency, limited scale | Complex but handles very popular docs |
| Eager vs Lazy loading | Load full doc on open (simple, high latency for large docs) | Load visible portion first (complex, faster perceived load) |

\`\`\`quiz
{
  "title": "Scaling & Trade-offs Quiz",
  "questions": [
    {
      "question": "Why is consistent hashing preferred over simple modulo-based partitioning for documents?",
      "options": ["It provides better load balancing", "It minimizes the number of documents that need to move when servers are added/removed", "It ensures documents are evenly distributed", "It's simpler to implement"],
      "answer": 1,
      "explanation": "Consistent hashing minimizes disruption when the server pool changes. Only documents mapped to the failed server and its immediate neighbors need to be reassigned, rather than redistributing all documents."
    },
    {
      "question": "What makes offline support particularly challenging with Operational Transformation?",
      "options": ["OT requires constant server connectivity", "OT operations cannot be stored locally", "Long offline periods create long transformation chains that are complex and slow", "OT doesn't support conflict resolution"],
      "answer": 2,
      "explanation": "When a client has been offline for a long time, it accumulates many local operations. With OT, each of these must be transformed against all concurrent server operations, creating an O(n×m) complexity that becomes very slow."
    },
    {
      "question": "Why are presence indicators typically stored in memory rather than persisted to a database?",
      "options": ["They are not important enough to persist", "They change too frequently and are ephemeral by nature", "Memory is cheaper than database storage", "Databases cannot handle the write load"],
      "answer": 1,
      "explanation": "Presence state changes very frequently (every few seconds with heartbeats) and is only relevant while users are actively connected. Storing this in a database would create unnecessary write load for data that becomes immediately stale."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Document partitioning via consistent hashing distributes load across Document Service instances while minimizing disruption during server failures.",
    "WebSocket gateways scale horizontally with sticky connections and remain stateless for easy replacement and fault tolerance.",
    "Offline support is significantly easier with CRDTs than with OT due to natural merge semantics that avoid complex transformation chains.",
    "Version history uses a tiered approach — fine-grained for recent changes, coarse-grained for older ones — achieving ~100x storage reduction.",
    "Presence indicators are ephemeral and best stored in memory rather than persisted to a database due to their high update frequency and transient nature."
  ]
}
\`\`\``,
    },
  ],
};
