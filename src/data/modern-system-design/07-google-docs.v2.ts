import { Module } from "../types";

export const googleDocsModule: Module = {
  id: "design-google-docs",
  title: "Design Google Docs",
  description: "Design a real-time collaborative editor: operational transformation, CRDTs, presence tracking, and conflict resolution at scale.",
  lessons: [
    {
      id: "docs-requirements",
      slug: "docs-requirements",
      title: "Requirements & Consistency Challenges",
      content: `# Design Google Docs: Requirements & Consistency Challenges

Real-time collaborative editing is one of the hardest distributed systems problems disguised as a simple product feature. When two people type in the same document simultaneously, the system must resolve conflicts, maintain consistency, and feel instant — all at once. This lesson establishes the requirements, quantifies the scale, and exposes *why* the core problem is fundamentally hard.

## Functional Requirements

1. **Real-time co-editing** — Multiple users edit the same document simultaneously
2. **Rich text editing** — Bold, italic, headings, lists, tables, images
3. **Conflict resolution** — Concurrent edits never corrupt the document
4. **Offline support** — Users can edit offline and sync on reconnect
5. **Version history** — View and restore any previous document version
6. **Comments and suggestions** — Inline comments, suggested edits with accept/reject
7. **Permissions** — Owner, editor, commenter, viewer roles
8. **Real-time presence** — See who else is in the document and where their cursor is

## Non-Functional Requirements

| Property | Target | Why It Matters |
|----------|--------|----------------|
| **Availability** | 99.99% | Documents must always be accessible |
| **Local edit latency** | <50ms | Edits must feel instantaneous to the author |
| **Remote edit latency** | <200ms | Collaborators see changes near-instantly |
| **Consistency** | Eventual (CCI model) | All users converge to the same document state |
| **Scalability** | 100+ concurrent editors/doc | Large-team editing is a core use case |
| **Durability** | Zero data loss | Every keystroke must be persisted |

## Scale Estimation

\`\`\`tabs
{ "tabs": [ { "label": "Users & Documents", "icon": "👥", "content": "| Metric | Estimate |\\n|--------|----------|\\n| Monthly active users | ~1.5 billion |\\n| Total documents | ~15 billion |\\n| Active documents (daily) | ~300 million |\\n| Peak concurrent editors | ~50 million |\\n| Avg editors per document | 2–5 (some docs: 100+) |" }, { "label": "Operations", "icon": "⚡", "content": "| Metric | Estimate |\\n|--------|----------|\\n| Keystrokes per active user | ~2,000 / hour |\\n| **Total ops/sec** | 50M × 2,000 ÷ 3,600 ≈ **28M ops/s** |\\n| Operation payload size | ~100–500 bytes |\\n| Network ingest bandwidth | ~5.6 GB/s |\\n\\n28 million operations per second is not a typo. Every keystroke by every active user flows through the system in real time. This is why documents must be partitioned across many collab servers." }, { "label": "Storage", "icon": "💾", "content": "| Metric | Estimate |\\n|--------|----------|\\n| New documents per day | ~50 million |\\n| Average document size | ~50 KB |\\n| Daily new storage | ~2.5 TB/day |\\n| Operation log per active doc | ~500 KB/day |\\n| Snapshot frequency | Every 100 ops or 5 min |\\n\\nOperation logs are append-only and grow indefinitely — compaction and snapshotting are critical to bound storage costs." } ] }
\`\`\`

## The Core Challenge: Concurrent Edits

\`\`\`concept
{ "title": "Why Concurrent Edits Break Everything", "variant": "mental-model", "content": "Single-user editing is trivial: one writer, one document, no conflicts. Add a second user and everything changes. Two users typing at the same position at the same millisecond will produce divergent documents unless a conflict resolution algorithm transforms one operation against the other before applying it. The entire architecture of Google Docs is organized around making that transformation correct, fast, and durable." }
\`\`\`

The fundamental question: what happens when two users edit the same position simultaneously? Here is a concrete trace showing why naive merging fails — and what Operational Transformation (OT) does to fix it.

\`\`\`steps
{ "title": "Naive Merge vs. Operational Transformation", "steps": [ { "title": "Starting State", "content": "Both Alice and Bob open the same document. Current content: \`\\"BC\\"\`" }, { "title": "Concurrent Edits (before sync)", "content": "**Alice** inserts \`\\"A\\"\` at position 0 → her local view: \`\\"ABC\\"\`\\n\\n**Bob** inserts \`\\"D\\"\` at position 2 → his local view: \`\\"BCD\\"\`\\n\\nNeither user has received the other's operation yet. Both are working against the same original state." }, { "title": "Naive Merge — Broken ✗", "content": "Server applies Alice's op first: \`\\"BC\\"\` → \`\\"ABC\\"\`\\n\\nServer applies Bob's op literally — \`insert(\\"D\\", pos=2)\` on \`\\"ABC\\"\` → \`\\"ABDC\\"\`\\n\\nBob applies Alice's op to his \`\\"BCD\\"\` state → Bob sees \`\\"ABCD\\"\`\\n\\n**Alice sees \`\\"ABDC\\"\`, Bob sees \`\\"ABCD\\"\` — the documents have diverged.** The insert landed in the wrong position." }, { "title": "With Operational Transformation — Correct ✓", "content": "Bob's op \`insert(\\"D\\", pos=2)\` is **transformed** against Alice's concurrent op \`insert(\\"A\\", pos=0)\`.\\n\\nAlice inserted *before* Bob's target position, shifting all subsequent characters right by 1:\\n\\n\`insert(\\"D\\", pos=2)\` → \`insert(\\"D\\", pos=3)\`\\n\\nApply transformed op to \`\\"ABC\\"\` → **\`\\"ABCD\\"\`**\\n\\nBoth users now see the same document. OT preserved the *intention* of both edits." } ] }
\`\`\`

This is the essence of the problem. There are two major algorithm families that solve it: **Operational Transformation (OT)**, historically used by Google Docs, and **CRDTs** (Conflict-free Replicated Data Types), used by VS Code Live Share (Yjs) and Figma. We explore both in depth in the following lessons.

## The CCI Consistency Model

Traditional databases optimize for strong consistency (ACID) or availability (BASE). Collaborative editing needs a third model: **CCI**.

\`\`\`concept
{ "title": "CCI: Causality, Convergence, Intention", "variant": "rule", "content": "**Causality** — If operation A happened before B in the causal sense, every user sees A applied before B.\\n\\n**Convergence** — After all operations propagate, every user's document reaches exactly the same final state, regardless of the order in which operations were received.\\n\\n**Intention** — Each operation achieves what the user intended. An insert between two words stays between those words even after concurrent nearby operations transform it.\\n\\nPlain eventual consistency only guarantees convergence. CCI additionally requires causal ordering and intention preservation — which is why OT and CRDTs are necessary rather than simple last-write-wins." }
\`\`\`

## High-Level Architecture

\`\`\`sysdiag
{ "title": "Google Docs — High-Level Architecture", "width": 760, "height": 380, "nodes": [ { "id": "ua", "label": "User A (Browser)", "x": 90, "y": 70, "kind": "client" }, { "id": "ub", "label": "User B (Browser)", "x": 90, "y": 190, "kind": "client" }, { "id": "uc", "label": "User C (Browser)", "x": 90, "y": 310, "kind": "client" }, { "id": "collab", "label": "Collab Server", "x": 390, "y": 190, "kind": "service" }, { "id": "storage", "label": "Document Storage", "x": 640, "y": 90, "kind": "database" }, { "id": "oplog", "label": "Operation Log (Kafka)", "x": 640, "y": 310, "kind": "queue" } ], "edges": [ { "from": "ua", "to": "collab", "label": "WebSocket" }, { "from": "ub", "to": "collab", "label": "WebSocket" }, { "from": "uc", "to": "collab", "label": "WebSocket" }, { "from": "collab", "to": "storage", "label": "snapshots" }, { "from": "collab", "to": "oplog", "label": "operations" } ], "annotations": { "collab": "Central ordering point: receives all operations, applies OT/CRDT transformation, and broadcasts transformed ops to every connected client.", "oplog": "Append-only operation log — source of truth for replaying document history and rebuilding state after failure.", "storage": "Periodic snapshots prevent unbounded log growth. Recovery = last snapshot + replay tail of operation log." } }
\`\`\`

The collaboration server is the **central ordering point** — the single place that decides the authoritative sequence of all operations. Centralizing ordering makes OT tractable (no N-way concurrent transformation required), at the cost of requiring a highly available server. This is a deliberate architectural trade-off, not an oversight.

## Key Challenges

| Challenge | Why It's Hard |
|-----------|--------------|
| **Concurrent edit resolution** | Multiple users typing in the same paragraph simultaneously |
| **28M ops/s throughput** | Every keystroke must be processed and broadcast in real time |
| **<200ms propagation** | Remote edits must appear near-instantly to all collaborators |
| **Offline + reconnect** | Merge potentially hours of offline edits without corruption |
| **100+ simultaneous editors** | Transform complexity scales with the number of concurrent users |
| **Collaborative undo/redo** | Undoing *your* edit when others have since edited around it |

\`\`\`callout
{ "type": "info", "title": "What's Coming Next", "content": "The next lessons cover the two algorithms that solve concurrent edit resolution in depth:\\n\\n- **Operational Transformation (OT)** — the centralized algorithm Google Docs uses, where a server provides global operation ordering\\n- **CRDTs** — the decentralized alternative used by VS Code Live Share (Yjs) and Figma, which assigns each character a unique ordered ID so operations commute naturally\\n\\nUnderstanding when to choose OT vs CRDTs is the central architectural decision of this case study." }
\`\`\`

## Knowledge Check

\`\`\`quiz
{ "title": "Requirements & Consistency Challenges", "questions": [ { "question": "In the Alice/Bob example (initial state \\"BC\\"), Alice inserts \\"A\\" at position 0 and Bob inserts \\"D\\" at position 2, both against the same original state. After OT transforms Bob's operation, what position should Bob's insert use?", "options": ["Position 0 — same as Alice's insert", "Position 1 — halfway between the two inserts", "Position 2 — unchanged, since the operations are independent", "Position 3 — shifted +1 because Alice inserted before Bob's target"], "answer": 3, "explanation": "Alice inserted at position 0, which is *before* Bob's target position 2. This shifts all subsequent characters right by 1, so Bob's insert(pos=2) must be transformed to insert(pos=3). Applied to \\"ABC\\" → \\"ABCD\\". OT's transform function adjusts positions to preserve the intention of both edits." }, { "question": "Which additional guarantee does the CCI consistency model provide that plain eventual consistency does NOT?", "options": ["Linearizability — every read reflects the latest write globally", "Causality ordering and intention preservation, not just convergence", "ACID transactions across all distributed replicas", "Conflict-free merging without any transformation logic"], "answer": 1, "explanation": "Plain eventual consistency only guarantees that all replicas eventually reach the same state (convergence). CCI additionally requires Causality (operations are seen in causal order) and Intention (each edit achieves what the user meant, even after being transformed against concurrent ops). Without intention preservation, an insert could end up in the wrong position after OT." }, { "question": "Why is a 'last-write-wins' conflict strategy insufficient for real-time collaborative editing?", "options": ["It requires synchronous consensus, which introduces too much latency", "It silently discards one user's changes, violating the Intention property of CCI", "It only works for plain-text documents, not rich text with formatting", "It requires vector clocks, which are too expensive to maintain at scale"], "answer": 1, "explanation": "Last-write-wins would silently drop edits: if Alice and Bob type simultaneously, one user's work disappears with no indication. This violates the Intention property — the system must preserve all concurrent edits by transforming their positions, not choosing a winner and discarding the other." }, { "question": "Based on the scale estimation, approximately how many operations per second must Google Docs handle at peak across all active users?", "options": ["~1 million ops/s", "~5 million ops/s", "~28 million ops/s", "~500 million ops/s"], "answer": 2, "explanation": "~50M concurrent users × 2,000 keystrokes/hour ÷ 3,600 seconds/hour ≈ 28 million ops/s. This is why documents must be partitioned across many collab servers and why the operation pipeline must be highly optimized — no single machine can handle the full load." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The core problem: two users editing the same position simultaneously produce divergent documents without a conflict resolution algorithm (OT or CRDT) to transform operations before applying them.", "Naive delta merge fails because operations reference positions in the original document state — after concurrent ops apply, those positions shift and the intent is lost.", "The CCI model (Causality, Convergence, Intention) is the correctness target. Convergence alone is not enough — edits must also preserve the user's intent after transformation.", "At Google Docs scale: ~28 million ops/second, <200ms propagation latency, and zero data loss are the non-negotiable requirements that shape every architectural decision.", "The centralized collab server is a deliberate trade-off: it makes OT tractable by providing a single ordering point, at the cost of requiring high availability.", "OT (Google Docs, centralized) and CRDTs (VS Code Live Share/Yjs, decentralized) are the two algorithm families that solve concurrent edit resolution — each with distinct trade-offs explored in upcoming lessons." ] }
\`\`\``,
    },
    {
      id: "docs-ot",
      slug: "docs-ot",
      title: "Operational Transformation",
      content: `# Google Docs: Operational Transformation

\`\`\`concept
{ "title": "The Core Idea", "variant": "mental-model", "content": "When two users edit the same document simultaneously, OT transforms each operation to account for the other's changes — so both edits land in the right place, every time. The server acts as a traffic controller: it orders operations, transforms late arrivals, and broadcasts corrected versions to all clients." }
\`\`\`

## What Are Operations?

Every keystroke or deletion is encoded as a structured operation. Google Docs uses three operation types:

| Type | Syntax | Effect |
|------|--------|--------|
| \`INSERT\` | \`INSERT(pos, text)\` | Insert text at a position |
| \`DELETE\` | \`DELETE(pos, count)\` | Remove characters starting at a position |
| \`RETAIN\` | \`RETAIN(count)\` | Skip forward — no change |

**Example:** \`"Hello World"\` → \`"Hello, World"\`
\`\`\`
RETAIN(5)    skip "Hello"
INSERT(",")  add the comma
RETAIN(6)    skip " World"
\`\`\`

**Example:** \`"Hello World"\` → \`"Hell World"\`
\`\`\`
RETAIN(4)    skip "Hell"
DELETE(1)    remove "o"
RETAIN(6)    skip " World"
\`\`\`

## The Diamond Property

The golden rule of OT: applying transformed operations in **either order** must produce the **same document**.

\`\`\`mermaid
graph TD
    doc["doc (base)"]
    docA["doc + opA"]
    docB["doc + opB"]
    docAB["docAB = docBA ✓"]

    doc -->|opA| docA
    doc -->|opB| docB
    docA -->|"opB' (transformed)"| docAB
    docB -->|"opA' (transformed)"| docAB
\`\`\`

The \`transform(opA, opB)\` function produces \`(opA', opB')\` such that:

\`\`\`
apply(apply(doc, opA), opB') = apply(apply(doc, opB), opA')
\`\`\`

## The Four Transform Cases

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Insert + Insert",
      "icon": "✏️",
      "content": "**Two concurrent inserts**\\n\\n\`\`\`\\nopA = INSERT(pos=3, \\"X\\")\\nopB = INSERT(pos=5, \\"Y\\")\\n\`\`\`\\n\\nIf \`posA ≤ posB\`, opA inserted before opB's target:\\n\\n\`\`\`\\nopA' = INSERT(pos=3, \\"X\\")    unchanged\\nopB' = INSERT(pos=6, \\"Y\\")    shift right by 1\\n\`\`\`\\n\\nIf \`posA > posB\`, the reverse applies — opA shifts right, opB stays put."
    },
    {
      "label": "Insert + Delete",
      "icon": "✂️",
      "content": "**Insert before a delete target**\\n\\n\`\`\`\\nopA = INSERT(pos=3, \\"X\\")\\nopB = DELETE(pos=5, count=1)\\n\`\`\`\\n\\n\`posA(3) < posB(5)\` — A inserts before B's deletion point:\\n\\n\`\`\`\\nopA' = INSERT(pos=3, \\"X\\")      unchanged\\nopB' = DELETE(pos=6, count=1)  shift right by 1\\n\`\`\`\\n\\nA's insertion shifted the character B wanted to delete one position to the right."
    },
    {
      "label": "Delete + Delete",
      "icon": "🗑️",
      "content": "**Both delete the same character**\\n\\n\`\`\`\\nopA = DELETE(pos=3, count=1)\\nopB = DELETE(pos=3, count=1)   same position!\\n\`\`\`\\n\\nBoth users deleted the same character. The second delete must become a no-op:\\n\\n\`\`\`\\nopA' = NOOP    B already deleted it\\nopB' = NOOP    A already deleted it\\n\`\`\`\\n\\nThis is the trickiest case — OT must detect the overlap and avoid trying to delete a character that no longer exists."
    },
    {
      "label": "Delete + Insert",
      "icon": "🔄",
      "content": "**Delete meets an insert at the same position**\\n\\n\`\`\`\\nopA = DELETE(pos=3, count=1)\\nopB = INSERT(pos=3, \\"X\\")\\n\`\`\`\\n\\nB inserted at the exact position A is deleting. B's insert takes priority at that spot:\\n\\n\`\`\`\\nopA' = DELETE(pos=4, count=1)   shift right (B inserted first)\\nopB' = INSERT(pos=3, \\"X\\")      unchanged\\n\`\`\`\\n\\nThe character to be deleted is now at position 4 after B's insertion."
    }
  ]
}
\`\`\`

## Transform in Action: Step-by-Step

\`\`\`trace
{
  "title": "Resolving Two Concurrent Inserts",
  "language": "python",
  "code": "doc = list('abc')  # ['a', 'b', 'c']\\n\\n# Both ops created against the same revision\\nopA = ('insert', 1, 'X')  # Insert 'X' at pos 1\\nopB = ('insert', 2, 'Y')  # Insert 'Y' at pos 2\\n\\n# Server receives opA first — apply directly\\ndoc.insert(opA[1], opA[2])\\n# doc = ['a', 'X', 'b', 'c']\\n\\n# opB arrived based on old revision — must transform\\n# Rule: posA(1) <= posB(2), so shift opB right by 1\\nopB_prime = ('insert', opB[1] + 1, opB[2])  # pos: 2 -> 3\\n\\n# Apply transformed opB\\ndoc.insert(opB_prime[1], opB_prime[2])\\n# doc = ['a', 'X', 'b', 'Y', 'c']",
  "frames": [
    { "line": 1, "vars": { "doc": "['a', 'b', 'c']" }, "note": "Initial document — revision 0", "stdout": "" },
    { "line": 4, "vars": { "opA": "('insert', 1, 'X')" }, "note": "opA: insert 'X' at position 1", "stdout": "" },
    { "line": 5, "vars": { "opB": "('insert', 2, 'Y')" }, "note": "opB: insert 'Y' at position 2 — concurrent with opA", "stdout": "" },
    { "line": 8, "vars": { "doc": "['a', 'X', 'b', 'c']" }, "note": "Server applies opA first. Revision bumps to 1.", "stdout": "" },
    { "line": 13, "vars": { "check": "posA(1) ≤ posB(2) → shift right" }, "note": "Transform rule: opA inserted before opB's target position — opB must shift", "stdout": "" },
    { "line": 14, "vars": { "opB_prime": "('insert', 3, 'Y')" }, "note": "opB′: position shifted 2 → 3 to account for opA's insertion", "stdout": "" },
    { "line": 17, "vars": { "doc": "['a', 'X', 'b', 'Y', 'c']" }, "note": "Final document — both edits preserved in correct positions ✓", "stdout": "" }
  ],
  "speed": 900
}
\`\`\`

## The Server Pipeline

Every operation the server receives is tagged with the **revision it was based on**. If the server has moved ahead since then, it transforms the incoming operation against every intervening operation before applying it.

\`\`\`sysdiag
{
  "title": "Centralized OT: Server as Order Authority",
  "width": 700,
  "height": 280,
  "nodes": [
    { "id": "clientA", "label": "Client A", "x": 80, "y": 140, "kind": "client" },
    { "id": "server", "label": "OT Server", "x": 350, "y": 140, "kind": "service" },
    { "id": "clientB", "label": "Client B", "x": 620, "y": 140, "kind": "client" }
  ],
  "edges": [
    { "from": "clientA", "to": "server", "label": "op (based on rev 5)" },
    { "from": "server", "to": "clientA", "label": "ack (rev 8)" },
    { "from": "server", "to": "clientB", "label": "broadcast op' (rev 8)" }
  ],
  "annotations": {
    "server": "Maintains total operation order. Op arrives based on rev 5 but server is at rev 7 — transforms incoming op against revs 6 and 7, applies it to reach rev 8, then broadcasts the result to all other clients.",
    "clientA": "Optimistically applies own op locally. Awaits server ack before sending next op. Any incoming remote ops are transformed against the pending local op.",
    "clientB": "Receives already-transformed operations from the server. Never directly coordinates with other clients — all conflict resolution happens server-side."
  }
}
\`\`\`

### Client State Machine

The client tracks three states to manage the gap between local edits and server acknowledgement.

\`\`\`steps
{
  "title": "Client-Side OT States",
  "steps": [
    {
      "title": "Synchronized",
      "content": "The client document matches the server's last acknowledged revision. Any new local edit immediately moves to **Awaiting ACK** and is sent to the server."
    },
    {
      "title": "Awaiting ACK",
      "content": "An operation was sent; the client is waiting for server confirmation. If a remote op arrives, the client transforms it against the pending local op, applies it locally, and updates the pending op (transformed against the remote op in turn)."
    },
    {
      "title": "Awaiting ACK + Buffer",
      "content": "A new local edit arrived while the previous ACK is still outstanding. The new edit is buffered. When the first ACK arrives, the buffer is sent as the next operation. Only one unacknowledged op is ever in-flight at a time — this preserves strict ordering."
    }
  ]
}
\`\`\`

## Full Scenario: Concurrent Typing in the Same Sentence

\`\`\`
Document: "Hello World"  (revision 10)

User A types "!" after "World":
  opA = RETAIN(11), INSERT("!")
  based on rev 10

User B types "Beautiful " before "World":
  opB = RETAIN(6), INSERT("Beautiful "), RETAIN(5)
  based on rev 10

Server receives opA first:
  Apply opA → "Hello World!"  (rev 11)

Server receives opB (based on rev 10, server is at rev 11):
  opA inserted at position 11
  opB inserts at position 6 → posB (6) < posA (11), so opB unchanged
  Apply opB → "Hello Beautiful World!"  (rev 12) ✓

Broadcast:
  User A receives transformed opB → "Hello Beautiful World!"
  User B receives opA (position adjusted past opB) → "Hello Beautiful World!"
  Both converge ✓
\`\`\`

## OT vs CRDT: Choosing the Right Tool

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "OT — Google Docs' approach",
    "code": "Strengths:\\n+ Battle-tested (Google Docs, Etherpad)\\n+ Small operation payloads\\n+ Central server simplifies conflict resolution\\n+ Easy garbage collection\\n\\nWeaknesses:\\n- Central server is mandatory for total ordering\\n- Transform functions grow O(N²) with op types\\n- Notoriously hard to prove correct at scale\\n- Offline editing is fragile (long divergence = many transforms)"
  },
  "after": {
    "label": "CRDT — Figma, Notion, Automerge",
    "code": "Strengths:\\n+ No central server required (peer-to-peer capable)\\n+ Offline editing is native and safe\\n+ Operations commute automatically\\n+ Horizontal scaling to the edge\\n\\nWeaknesses:\\n- High memory usage (IDs, tombstones, metadata)\\n- Larger network payloads\\n- Garbage collection is extremely hard\\n- More complex data structures to design initially"
  }
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "OT at Google Scale", "content": "Google shards documents across OT server instances — each server handles roughly 1,000 active documents. When a document has more than ~100 concurrent editors, the server switches from per-operation broadcasting to batched updates every 500ms. Transform latency stays under 1ms per operation pair; server-to-client broadcast stays under 100ms over WebSocket." }
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: Why Multi-User OT Is So Hard to Get Right",
  "content": "With two users, OT is manageable: transform opA against opB and you're done.\\n\\nWith three or more concurrent users, every operation must be transformed against every other concurrent operation — and the *order* of those transforms matters. This leads to the **TP2 (transformation property 2)** requirement:\\n\\n\`\`\`\\ntransform(transform(opA, opB), transform(opC, opB))\\n  = transform(transform(opA, opC), transform(opB, opC))\\n\`\`\`\\n\\nMost OT implementations (including early Google Wave) failed to satisfy TP2 correctly.\\n\\nGoogle Docs sidesteps this by enforcing **strict server-side total ordering** — the server serializes all operations so there is never true three-way concurrency at the transform level. Every operation is transformed against a linear history, not a concurrent graph. This is what makes Google Docs' OT correct in practice — but it locks in the centralized architecture permanently."
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "What does the 'diamond property' of OT guarantee?",
      "options": [
        "Operations are always applied in the order they were typed",
        "Applying transformed operations in either order produces the same final document",
        "The server transforms operations before any client sees them",
        "Each operation is idempotent and can be applied multiple times safely"
      ],
      "answer": 1,
      "explanation": "The diamond property (convergence) states that apply(apply(doc, opA), opB') must equal apply(apply(doc, opB), opA'). This is what allows two clients to apply operations in different orders and still arrive at the same document state."
    },
    {
      "question": "User A inserts 'X' at position 3. User B concurrently inserts 'Y' at position 5. The server applies opA first. How should opB be transformed?",
      "options": [
        "opB stays at position 5 — it's after opA's position so nothing changes",
        "opB shifts left to position 4 — opA freed up a slot before it",
        "opB shifts right to position 6 — opA's insertion moved everything at pos 3+ right by 1",
        "opB becomes a NOOP — conflicting inserts cancel each other out"
      ],
      "answer": 2,
      "explanation": "opA inserted at position 3, which is before opB's target position 5. That insertion shifted every character at position 3 and beyond one slot to the right. So opB must move from position 5 to position 6 to hit the same logical location in the document."
    },
    {
      "question": "What does the 'Awaiting ACK + Buffer' state protect against on the client?",
      "options": [
        "Applying the same remote operation twice",
        "Sending multiple unacknowledged operations to the server simultaneously",
        "Losing edits when the WebSocket connection drops",
        "Transforming incoming ops in the wrong order"
      ],
      "answer": 1,
      "explanation": "Only one unacknowledged op should be in-flight at a time. If the user keeps typing while waiting for the previous ACK, those edits are buffered. Once the server acknowledges the first op, the buffer is sent as the next operation. This preserves strict ordering and keeps server-side transforms tractable."
    },
    {
      "question": "What is the primary reason OT requires a central server while CRDTs do not?",
      "options": [
        "OT operations are too large to send directly between browsers",
        "OT needs a central clock to timestamp every operation",
        "OT requires total ordering of all operations across replicas to guarantee convergence",
        "CRDTs are inherently faster and eliminate the need for any coordination"
      ],
      "answer": 2,
      "explanation": "OT's transform functions only produce correct results when all replicas apply operations in the same order. A central server enforces that total order. CRDTs assign each element a globally unique immutable ID, making operations commute regardless of application order — no total ordering (and therefore no central server) is required."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "OT represents every edit as an INSERT, DELETE, or RETAIN operation tagged with the document revision it was based on.",
    "The transform function adjusts concurrent operations so they can be applied in either order and produce the same result — the diamond (convergence) property.",
    "Google Docs uses centralized OT: the server is the single authority that orders operations, transforms late arrivals against intervening revisions, and broadcasts corrected ops to all clients.",
    "Clients maintain a three-state machine (Synchronized → Awaiting ACK → Awaiting ACK + Buffer) to handle the lag between local edits and server confirmation, keeping exactly one op in-flight at a time.",
    "OT's tradeoff: small payloads and battle-tested correctness in exchange for a mandatory central server and transform functions that grow in complexity with rich-text formatting.",
    "CRDTs (Figma, Notion, Automerge) are the modern alternative — offline-native and decentralizable, but at the cost of higher memory usage and significantly harder garbage collection."
  ]
}
\`\`\``,
    },
    {
      id: "docs-crdts",
      slug: "docs-crdts",
      title: "CRDTs",
      content: `# CRDTs

## What Are CRDTs?

Conflict-free Replicated Data Types (CRDTs) were formally introduced in 2011. They are data structures that can be replicated across multiple nodes, modified independently and concurrently, and always merged into a consistent state — **without any coordination**.

Unlike OT, which transforms operations through a central server, CRDTs guarantee convergence by mathematical properties of the data structure itself.

\`\`\`concept
{ "title": "The CRDT Core Guarantee", "variant": "mental-model", "content": "Any two peers that have seen the same set of operations will converge to the same document state — regardless of the order those operations arrived. No central server is required to enforce this. The data structure itself makes convergence guaranteed." }
\`\`\`

\`\`\`concept
{ "title": "Logical Positions, Not Indexes", "variant": "insight", "content": "CRDTs do not track 'insert at index 5.' They track 'insert between these two existing characters' using unique element IDs. Indexes require global agreement — and global agreement is impossible in an offline-capable distributed system. Logical positions make convergence possible without coordination." }
\`\`\`

---

## State-Based vs Operation-Based CRDTs

\`\`\`tabs
{
  "tabs": [
    {
      "label": "State-Based (CvRDT)",
      "icon": "📦",
      "content": "**How it works:** Replicas periodically send their full state to peers. States are merged using a join/merge function.\\n\\n**Mathematical requirements:** The merge function must be:\\n- **Commutative** — merge(A, B) = merge(B, A)\\n- **Associative** — merge(merge(A, B), C) = merge(A, merge(B, C))\\n- **Idempotent** — merge(A, A) = A\\n\\n**Trade-offs:**\\n- ✅ Tolerates message loss (state carries full history)\\n- ❌ Higher bandwidth — sends entire state on each sync\\n\\n**Example:** G-Counter, LWW-Register"
    },
    {
      "label": "Operation-Based (CmRDT)",
      "icon": "⚡",
      "content": "**How it works:** Replicas broadcast individual operations. Each replica applies operations directly.\\n\\n**Mathematical requirements:** Operations must be **commutative** — applying op A then op B gives the same result as applying op B then op A.\\n\\n**Trade-offs:**\\n- ✅ Lower bandwidth — sends only the delta operation\\n- ❌ Requires reliable broadcast — all operations must be delivered to all nodes\\n\\n**Example:** PN-Counter, RGA (Replicated Growable Array)"
    }
  ]
}
\`\`\`

---

## Common CRDT Types

### G-Counter (Grow-only Counter)

Each node maintains its own slot in a vector. The global count is the sum of all slots. On merge, take the maximum of each node's value.

\`\`\`algoviz
{
  "title": "G-Counter: Merge Across 3 Nodes",
  "type": "array",
  "data": [5, 3, 7],
  "frames": [
    { "highlight": [], "label": "Each node owns one slot. Node A=5, Node B=3, Node C=7. Total = 15.", "stats": { "total": 15 } },
    { "highlight": [0], "label": "Node A increments — its slot goes from 5 → 6.", "stats": { "A": 6, "B": 3, "C": 7 } },
    { "highlight": [0, 1, 2], "label": "Merge: take max of each slot. Result = [6, 3, 7]. Total = 16 ✓", "stats": { "total": 16 } }
  ],
  "speed": 900
}
\`\`\`

**Use cases:** page view counters, like counts.

### PN-Counter (Positive-Negative Counter)

Two G-Counters: one for increments (P), one for decrements (N). Value = sum(P) − sum(N). Enables a counter that can go both up and down while remaining conflict-free.

**Use cases:** inventory counts, upvote/downvote totals.

### LWW-Register (Last-Writer-Wins Register)

Each write carries a timestamp. On merge, the highest timestamp wins. The problem is clock synchronization — physical clocks can skew across nodes. The solution is **Hybrid Logical Clocks (HLC)**, which combine a physical clock with a logical counter to provide causality without tight clock synchronization.

**Use cases:** user profile fields, settings, metadata.

---

## RGA: The CRDT for Text Editing

The Replicated Growable Array (RGA) is the CRDT type most relevant to collaborative text editing. It represents a document as an ordered sequence of elements, each with a globally unique ID and a pointer to its predecessor.

\`\`\`algoviz
{
  "title": "RGA Concurrent Insert: 'CAT' → 'CHART'",
  "type": "array",
  "data": ["C", "A", "T"],
  "frames": [
    { "highlight": [0, 1, 2], "label": "Initial document: 'CAT'. Each character has a unique ID (A@1, A@2, A@3) and a 'parent' pointer.", "stats": { "doc": "CAT" } },
    { "highlight": [0], "label": "User A inserts 'R' after C (ID A@1). New element: {ID: A@4, char: R, after: A@1} → User A sees 'CRAT'.", "stats": { "userA": "CRAT" } },
    { "highlight": [0], "label": "Concurrently, User B inserts 'H' after C (ID A@1). New element: {ID: B@1, char: H, after: A@1} → User B sees 'CHAT'.", "stats": { "userB": "CHAT" } },
    { "highlight": [0, 1, 2], "label": "Merge conflict: both A@4 and B@1 claim position after A@1. Tie-break by ID: A@4 > B@1 (or vice versa — pick a rule, apply it everywhere).", "stats": { "conflict": "both after A@1" } },
    { "highlight": [0, 1, 2], "label": "Resolved: deterministic ordering produces 'CHART'. Same result on every node — convergence guaranteed.", "stats": { "doc": "CHART" } }
  ],
  "speed": 1000
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why Deterministic Tie-Breaking Works", "content": "The specific ordering rule (e.g., sort by replica ID) doesn't need to be 'correct' in any semantic sense — it just needs to be **identical on all replicas**. Mathematical convergence only requires a total order, not a meaningful one." }
\`\`\`

---

## CRDTs vs OT: Side-by-Side

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Architecture",
      "icon": "🏗️",
      "content": "| Property | OT | CRDT |\\n|---|---|---|\\n| Central server | Required for ordering | Not required |\\n| Offline support | Difficult | Natural |\\n| Correctness | Hard to formally prove | Mathematically provable |\\n| Latency | Server round-trip required | Peer-to-peer OK |"
    },
    {
      "label": "Complexity",
      "icon": "🧩",
      "content": "| Property | OT | CRDT |\\n|---|---|---|\\n| Core complexity | Transform functions (N² op pairs) | Data structure design |\\n| Memory overhead | Low — just the text | High — tombstones + unique IDs |\\n| Undo/Redo | Well-understood | Active research area |\\n| Concurrent users | Complexity grows with N² | Scales independently |"
    },
    {
      "label": "Production Use",
      "icon": "🚀",
      "content": "| System | Approach | Notes |\\n|---|---|---|\\n| Google Docs | OT | Proven at billions of users |\\n| Figma | CRDT | Peer-to-peer sync for design objects |\\n| Apple Notes | CRDT | Offline-first, multi-device |\\n| Yjs ecosystem | CRDT | Notion (partial), JupyterLab, BlockSuite |\\n| Many modern systems | **Hybrid** | CRDT merge semantics + central server for ordering/persistence |"
    }
  ]
}
\`\`\`

---

## The Tombstone Problem

\`\`\`callout
{ "type": "warning", "title": "Tombstoning is Not a Bug — It's the Price of CRDTs", "content": "When a character is deleted in a CRDT, it **cannot be removed** from the data structure. It becomes a 'tombstone' — a hidden marker that stays in memory so concurrent inserts can still reference it.\\n\\nOT has no tombstoning because the server is always the ordering authority — deletion is final immediately. With CRDTs, you cannot fully delete a character until every peer has acknowledged the deletion." }
\`\`\`

**The scale of the problem:**

- A document with 10,000 visible characters might accumulate 50,000 tombstones over months of editing — roughly a **5x memory overhead** at minimum, often worse.
- A heavily edited 10K-word document could hold 500K tombstones — **50x overhead**.

**Mitigation strategies:**

1. **Garbage collection** — compact tombstones once all nodes confirm they've seen the delete (hard to coordinate across offline clients)
2. **Snapshots** — periodically create a clean checkpoint and discard old operations
3. **Block-level CRDTs** — operate on paragraphs rather than individual characters, reducing conflict granularity

\`\`\`collapse
{ "title": "Deep Dive: Modern CRDT Libraries", "content": "**Yjs** — the most widely adopted CRDT library for web apps. Supports text, arrays, maps, and XML. Uses binary encoding for a very compact wire format. Handles 100K+ operations efficiently. Used by Notion (partially), JupyterLab, and BlockSuite.\\n\\n**Automerge** — a Rust-based CRDT library with JavaScript bindings. Models documents as JSON-like structures with built-in version history. Best for offline-first apps where full history replay matters.\\n\\n**Diamond Types** — experimental and extremely fast, focused specifically on text CRDTs. Benchmarks suggest 100x faster throughput than Yjs for large documents, though it is not yet production-hardened.\\n\\nAll three expose different trade-offs: Yjs prioritizes ecosystem breadth, Automerge prioritizes auditability, Diamond Types prioritizes raw performance." }
\`\`\`

---

## When to Choose What

\`\`\`steps
{
  "title": "Picking Your Concurrency Strategy",
  "steps": [
    {
      "title": "Choose OT when you have a reliable central server",
      "content": "OT is battle-tested at Google Docs scale (billions of users). If your architecture already includes a central collaboration server that can order operations, OT gives you memory efficiency and a well-understood undo/redo model. The complexity cost is manageable with good engineering."
    },
    {
      "title": "Choose CRDTs when offline-first or P2P is a requirement",
      "content": "If users must edit while offline and sync later — or if you're building peer-to-peer collaboration without a persistent server — CRDTs are the natural fit. Mathematical convergence is guaranteed by the data structure itself, not by server coordination. Use Yjs or Automerge rather than implementing from scratch."
    },
    {
      "title": "Consider a hybrid for production systems",
      "content": "Many modern systems use CRDT data structures for their merge guarantees while still routing through a central server for ordering and persistence. This gives the best of both worlds: mathematical correctness from CRDTs, memory efficiency from server-assisted compaction, and reliable undo/redo from the ordered log."
    }
  ]
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "CRDTs in Depth",
  "questions": [
    {
      "question": "A G-Counter on Node A holds the vector {A:5, B:3, C:7}. Node A increments once. After merging with Node B's state {A:4, B:6, C:7}, what is the resulting vector?",
      "options": ["{A:6, B:6, C:7}", "{A:10, B:9, C:14}", "{A:6, B:3, C:7}", "{A:5, B:6, C:7}"],
      "answer": 0,
      "explanation": "G-Counter merge takes the max of each slot. A: max(6,4)=6, B: max(3,6)=6, C: max(7,7)=7 → {A:6, B:6, C:7}. Total = 19."
    },
    {
      "question": "Why can't a deleted character be immediately removed from a CRDT document?",
      "options": [
        "Performance reasons — deletion is expensive",
        "Concurrent operations from other peers may still reference the deleted element's ID as a position anchor",
        "CRDTs only support insert operations",
        "The central server hasn't confirmed the deletion yet"
      ],
      "answer": 1,
      "explanation": "Tombstones exist because concurrent inserts reference existing character IDs as logical positions. If a character is truly removed, another peer's pending 'insert after character X' has nowhere to anchor — producing inconsistent state. The tombstone must persist until all peers have acknowledged seeing the delete."
    },
    {
      "question": "What is the key mathematical requirement that makes operation-based CRDTs (CmRDTs) work correctly?",
      "options": [
        "Operations must be idempotent",
        "Operations must be commutative — apply in any order and get the same result",
        "The server must impose a total order before operations are applied",
        "Each operation must carry a full document snapshot"
      ],
      "answer": 1,
      "explanation": "CmRDTs require commutativity: op(A) then op(B) must equal op(B) then op(A). This is what allows peers to apply operations in different orders and still converge. State-based CRDTs instead require the merge function itself to be commutative, associative, and idempotent."
    },
    {
      "question": "In an RGA concurrent insert scenario, two users both insert a character at the same logical position. How does RGA guarantee convergence?",
      "options": [
        "It rejects the second insert and asks the second user to retry",
        "It sends both inserts to a central server which picks one",
        "It applies a deterministic tie-breaking rule (e.g., sort by replica ID) that all nodes execute identically",
        "It uses timestamps — the earlier insert wins"
      ],
      "answer": 2,
      "explanation": "RGA uses deterministic tie-breaking: when two elements share the same parent, they are ordered by a consistent rule (e.g., lexicographic replica ID comparison). The specific rule doesn't need semantic meaning — it just needs to be identical on every replica. This guarantees all nodes produce the same ordering after merge."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "CRDTs guarantee convergence through mathematical properties of the data structure itself — no central server required to enforce ordering.",
    "State-based CRDTs (CvRDT) send full state and use a merge function; operation-based CRDTs (CmRDT) send only operations but require reliable broadcast.",
    "RGA represents text as a linked sequence of uniquely-identified elements, enabling concurrent inserts to be resolved deterministically without coordination.",
    "Tombstoning is the fundamental cost of CRDTs: deleted characters must persist as invisible markers until all peers confirm the deletion, creating significant memory overhead at scale.",
    "Most production systems use a hybrid: CRDT merge semantics for mathematical correctness + a central server for ordering, compaction, and reliable undo/redo."
  ]
}
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
