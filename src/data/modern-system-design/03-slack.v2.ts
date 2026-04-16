import { Module } from "../types";

export const slackModule: Module = {
  id: "design-slack",
  title: "Design Slack",
  description: "Design a real-time messaging platform: WebSocket architecture, message delivery, presence, and typing indicators at scale.",
  lessons: [
    {
      id: "slack-requirements-scale",
      slug: "slack-requirements-scale",
      title: "Requirements & Scale",
      content: `# Design Slack: Requirements & Scale

\`\`\`concept
{ "title": "Two Goals in Tension", "variant": "mental-model", "content": "Slack is simultaneously a real-time communication bus and a permanent knowledge store. Real-time delivery favors in-memory state and loose ordering. Durable storage favors sequential writes and strict indexing. Every architectural decision in this design is a negotiation between these two forces." }
\`\`\`

Before estimating numbers, lock down exactly what you're building and what you're *not* building. Interviewers reward scoping discipline.

## Functional Requirements

\`\`\`tabs
{ "tabs": [
  { "label": "Core Messaging", "icon": "💬", "content": "**Must have:**\\n\\n- **1:1 messaging** — Direct messages between two users\\n- **Group channels** — Channels with up to 100K members\\n- **Message history** — Persistent, searchable message storage\\n- **Real-time delivery** — Messages appear instantly (< 200ms for online users)\\n- **Read receipts** — Track which messages each user has seen" },
  { "label": "Presence & Signals", "icon": "🟢", "content": "**Must have:**\\n\\n- **Presence** — Online / Away / Offline status for each user\\n- **Typing indicators** — Show when someone is composing a message\\n\\n**Nice to have (later lessons):**\\n\\n- Emoji reactions\\n- Threads / reply chains" },
  { "label": "Files & Search", "icon": "📎", "content": "**Must have:**\\n\\n- **File sharing** — Upload and attach files in channels\\n- **Message search** — Full-text search across all history\\n\\n**Out of scope today:**\\n\\n- Video/voice calls\\n- Bots and Slack apps (plugins)\\n- Admin/compliance tooling" }
] }
\`\`\`

## Non-Functional Requirements

| Property | Target | Why It's Hard |
|---|---|---|
| **Availability** | 99.99% (< 52 min/year) | Stateful WebSocket servers complicate failover |
| **Latency** | < 200ms delivery for online users | Requires persistent connections, not polling |
| **Ordering** | All users in a channel see messages in the same order | Distributed clocks drift; sequence numbers needed |
| **Durability** | Zero message loss after send acknowledgement | Write must be confirmed before ACK-ing the client |
| **Consistency** | Strong for messages, eventual for presence/search | Mixing models keeps latency low where it matters |

\`\`\`callout
{ "type": "info", "title": "Where Eventual Consistency Is Acceptable", "content": "Slack does **not** make everything strongly consistent. Read receipts, presence indicators, and search results can lag by seconds without breaking the user experience. Strong consistency is reserved for: message ordering within a channel and durability after send. This selective approach is what makes the system practical at scale." }
\`\`\`

---

## Scale Estimation

Work through these numbers out loud in an interview. The goal isn't precision — it's demonstrating that you can reason about capacity before you design.

### Users & Message Throughput

\`\`\`
DAU:                30 million
Messages/user/day:  40
Total messages/day: 30M × 40 = 1.2 billion

Average QPS:   1.2B ÷ 86,400s  ≈  14,000 msg/s
Peak QPS:      14,000 × 3      ≈  42,000 msg/s
\`\`\`

### Storage

\`\`\`
Average message (text):   200 bytes
Metadata overhead:        100 bytes  (sender, timestamp, channel ID, etc.)
Per-message total:        300 bytes

Daily storage:   1.2B × 300B        = 360 GB/day
Yearly:          360 GB × 365       ≈ 131 TB/year
With 3× replication:                ≈ 393 TB/year
\`\`\`

### WebSocket Connections

\`\`\`
Concurrent online users:   10M  (⅓ of DAU)
Per-connection memory:     ~10 KB
Total connection memory:   10M × 10 KB = 100 GB

At 50K connections/server: 100 GB ÷ 0.5 GB  →  200 WebSocket servers
\`\`\`

### Fanout Bandwidth

\`\`\`
Peak messages:    42,000 msg/s
Avg recipients:   50 per channel message
Outbound bytes:   42,000 × 50 × 300B = 630 MB/s outbound traffic
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Fanout Is the Multiplier", "content": "The raw QPS (42K msg/s) looks manageable. But once you account for channel fanout — each message copied to every online member — outbound traffic jumps 50× to **630 MB/s**. A 100K-member channel hit by a single message creates 100K delivery events instantly. This is the hardest scaling problem in the design, and you'll need a dedicated fan-out service to handle it." }
\`\`\`

---

## Key Challenges at a Glance

\`\`\`algoviz
{ "title": "Where Does the Complexity Live?", "type": "array", "data": ["Connection Mgmt", "Fanout", "Ordering", "Presence", "Search"], "frames": [
  { "highlight": [0], "label": "10M persistent WebSocket connections across 200 servers — must route messages to the right server", "stats": { "servers": 200, "connections": "10M" } },
  { "highlight": [1], "label": "One message to a 100K-member channel = 100K delivery events. Need fan-out workers, not a loop in the API server", "stats": { "channel_size": "100K", "events": "100K/msg" } },
  { "highlight": [2], "label": "Distributed servers process messages concurrently — without coordination, order diverges between users", "stats": { "risk": "split-brain order" } },
  { "highlight": [3], "label": "10M users' statuses change constantly — heartbeats + timeouts need low-overhead broadcasting", "stats": { "heartbeat_interval": "30s", "users": "10M" } },
  { "highlight": [4], "label": "Full-text search across 131 TB/year of data — writes must be indexed asynchronously to avoid adding write latency", "stats": { "index_size": "131 TB/yr" } }
], "speed": 1200 }
\`\`\`

---

## High-Level Architecture

\`\`\`sysdiag
{ "title": "Slack — High-Level Components", "width": 700, "height": 380,
  "nodes": [
    { "id": "client", "label": "Clients\\n(Web/Mobile)", "x": 80, "y": 190, "kind": "client" },
    { "id": "gw", "label": "API GW /\\nWS Load Balancer", "x": 230, "y": 190, "kind": "service" },
    { "id": "chat", "label": "Chat Service\\n(stateful)", "x": 400, "y": 100, "kind": "service" },
    { "id": "presence", "label": "Presence\\nService", "x": 400, "y": 280, "kind": "service" },
    { "id": "msgdb", "label": "Message DB\\n(Cassandra)", "x": 570, "y": 100, "kind": "database" },
    { "id": "cache", "label": "Cache\\n(Redis)", "x": 570, "y": 190, "kind": "database" },
    { "id": "search", "label": "Search\\n(Elasticsearch)", "x": 570, "y": 280, "kind": "service" }
  ],
  "edges": [
    { "from": "client", "to": "gw", "label": "WebSocket" },
    { "from": "gw", "to": "chat", "label": "routes msg" },
    { "from": "gw", "to": "presence", "label": "heartbeats" },
    { "from": "chat", "to": "msgdb", "label": "persist" },
    { "from": "chat", "to": "cache", "label": "hot data" },
    { "from": "chat", "to": "search", "label": "async index" }
  ],
  "annotations": {
    "chat": "Stateful — holds channel membership in memory to avoid DB lookups on every message. Routes to all subscribed Gateway Servers for fan-out.",
    "gw": "Maintains 10M WebSocket connections. Sticky routing: the same client always reconnects to the same gateway cluster region.",
    "presence": "Tracks heartbeats from all 10M online users. Eventual consistency accepted — a 5-second stale status is fine.",
    "msgdb": "Write-optimized, append-only. Cassandra-style LSM tree handles 42K writes/sec with predictable latency.",
    "search": "Indexed asynchronously via a queue — a few seconds lag is acceptable. Never in the hot write path."
  }
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Real Slack Architecture Matches This Split", "content": "Slack's actual production architecture separates a **Web App** (Hacklang — auth, APIs, persistence) from **Channel Servers** (Java — WebSocket handling, real-time fan-out, typing indicators, presence). The Channel Servers hold channel membership **in-memory** so they can fan out messages without hitting a database on every delivery. This is precisely what makes sub-200ms delivery possible at scale." }
\`\`\`

---

## Check Your Understanding

\`\`\`quiz
{ "title": "Requirements & Scale", "questions": [
  {
    "question": "At 30M DAU with 40 messages/user/day and a 3× peak factor, approximately what is the peak messages-per-second?",
    "options": ["14,000 msg/s", "28,000 msg/s", "42,000 msg/s", "120,000 msg/s"],
    "answer": 2,
    "explanation": "Average QPS = 1.2B ÷ 86,400 ≈ 14,000. Peak = 14,000 × 3 = 42,000 msg/s. The 3× multiplier accounts for business-hours concentration."
  },
  {
    "question": "Why does outbound bandwidth jump from ~12 MB/s (raw messages) to ~630 MB/s?",
    "options": [
      "Encryption overhead triples the payload size",
      "Each message is fanned out to ~50 channel members on average",
      "Presence heartbeats consume most of the bandwidth",
      "The metadata overhead is larger than estimated"
    ],
    "answer": 1,
    "explanation": "Fan-out is the multiplier: 42,000 msg/s × 50 average recipients × 300 bytes = 630 MB/s. This is why a naive 'broadcast in the API server' approach fails — you need a dedicated fan-out layer."
  },
  {
    "question": "Which of these properties uses **eventual consistency** in Slack's design?",
    "options": [
      "Message ordering within a channel",
      "Durability after a send acknowledgement",
      "Presence (online/offline) status",
      "Message deduplication"
    ],
    "answer": 2,
    "explanation": "Presence, read receipts, and search results accept eventual consistency — a few seconds of lag doesn't break the user experience. Message ordering and durability require stronger guarantees."
  },
  {
    "question": "With 10M concurrent WebSocket connections at ~10 KB each, and 50K connections per server, how many WebSocket servers are needed?",
    "options": ["20", "100", "200", "2,000"],
    "answer": 2,
    "explanation": "10M connections ÷ 50K per server = 200 servers. Total connection memory = 10M × 10 KB = 100 GB — just for maintaining open sockets."
  }
] }
\`\`\`

---

## What's Next

The numbers tell us what we're up against. The next lessons drill into the three hardest subsystems:

- **WebSocket Architecture** — how to manage 10M persistent connections across 200 servers and route messages to the right one
- **Message Storage & Delivery** — write path, fan-out workers, ordering guarantees
- **Presence & Typing Indicators** — tracking state for 10M users without melting your servers

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Peak load is 3× average — always size for peak: 42,000 msg/s and 630 MB/s outbound after fan-out",
  "WebSocket fan-out is the core scaling problem: one message × 50 recipients = 50 delivery events",
  "Slack uses stateful Channel Servers (in-memory channel membership) to keep delivery latency under 200ms without database round-trips",
  "Strong consistency only where it matters: message ordering and durability. Presence, search, and read receipts use eventual consistency",
  "200 WebSocket servers are needed just to hold open connections — this drives a routing architecture, not a simple load balancer"
] }
\`\`\``,
    },
    {
      id: "slack-websocket-architecture",
      slug: "slack-websocket-architecture",
      title: "WebSocket Architecture",
      content: `# Slack: WebSocket Architecture

## Why WebSockets?

HTTP follows a strict request-response cycle: the client must ask before the server can answer. At Slack's scale, this creates a fundamental mismatch with real-time messaging — users expect messages to appear the instant they're sent, not on the next poll interval.

\`\`\`concept
{ "title": "The Phone Call vs. Knocking Model", "variant": "mental-model", "content": "HTTP polling is like walking to your neighbour's door every second to ask 'do you have a letter for me?' WebSocket is a phone call that stays open — the moment your neighbour has news, they speak immediately. At 10M users polling every second, you're making 10M trips per second, nearly all wasted." }
\`\`\`

\`\`\`compare
{ "variant": "before-after", "before": { "label": "HTTP Polling (every 1s)", "code": "// 10M users × 1 req/s = 10M req/s\\n// The vast majority return empty responses\\nsetInterval(() => {\\n  fetch('/api/messages/latest')\\n    .then(r => r.json())\\n    .then(msgs => {\\n      if (msgs.length) render(msgs);\\n    });\\n}, 1000);" }, "after": { "label": "WebSocket (push on new message only)", "code": "// 10M persistent connections\\n// Server pushes only when something actually happens\\nconst ws = new WebSocket('wss://slack.com/ws');\\n\\nws.onmessage = (event) => {\\n  const msg = JSON.parse(event.data);\\n  render(msg);  // fires only on new messages\\n};" } }
\`\`\`

Once the initial HTTP upgrade handshake completes, both sides can send frames freely — no repeated connection overhead, and the server pushes the instant a message arrives. Slack's real-time API uses WebSockets for exactly this reason: typing indicators, message delivery, and presence status all flow over the same persistent bidirectional channel.

## Connection Layer Architecture

Slack's WebSocket layer is built around a pool of **Gateway Servers** — stateful, in-memory servers deployed in multiple cloud regions nearest to end users. Each server holds roughly 50,000 persistent connections; with 200 servers, the pool supports ~10M concurrent connections.

\`\`\`sysdiag
{ "title": "WebSocket Connection Layer", "width": 720, "height": 360, "nodes": [ { "id": "client", "label": "Client", "x": 70, "y": 180, "kind": "client" }, { "id": "lb", "label": "WS Load Balancer\\n(L4 TCP Sticky)", "x": 230, "y": 180, "kind": "service" }, { "id": "pool", "label": "WS Gateway Pool\\n200 servers × 50K conn", "x": 440, "y": 180, "kind": "service" }, { "id": "redis", "label": "Connection Registry\\n(Redis)", "x": 600, "y": 300, "kind": "database" } ], "edges": [ { "from": "client", "to": "lb", "label": "TCP upgrade" }, { "from": "lb", "to": "pool", "label": "sticky session" }, { "from": "pool", "to": "redis", "label": "user → server map" } ], "annotations": { "pool": "Stateful and in-memory. Each server knows exactly which users are connected to it. Deployed in multiple regions for low-latency access.", "redis": "Stores: conn:user_123 → ws-server-42 with TTL 300s. Refreshed every 30s by heartbeat pings. Used by the Fanout Service to route inbound messages.", "lb": "Layer-4 (TCP) sticky load balancer. Sticky sessions are essential — WebSocket is stateful and the connection must persist on one server for its entire lifetime." } }
\`\`\`

### Connection Registry

When a user connects, their WS server assignment is written to Redis:

\`\`\`
Key:   conn:user_123
Value: ws-server-42
TTL:   300s  (refreshed via heartbeat every 30s)
\`\`\`

When a message needs to reach \`user_123\`, the Fanout Service looks up this key to find the specific WS server holding their live connection and routes accordingly.

### Heartbeat Protocol

\`\`\`callout
{ "type": "warning", "title": "TCP Silence ≠ Live Connection", "content": "A TCP connection can go silent without sending a FIN frame — mobile devices lock, NAT tables expire, networks switch. Without an explicit heartbeat, the server would hold thousands of 'zombie' connections for users who are actually offline, wasting memory and causing missed message routing." }
\`\`\`

To detect and clean up dead connections:

- **Every 30s:** client sends \`ping\` → server replies \`pong\`
- **After 90s of silence:** connection is declared dead
  - Entry removed from Connection Registry
  - User presence updated to \`offline\`

The TTL on the Redis entry serves as an automatic backstop: even if the server crashes before it can clean up, the registry expires stale entries on its own.

## Message Flow

When User A sends a message in a channel, it passes through five stages before reaching User B.

\`\`\`steps
{ "title": "End-to-End Message Delivery: A → B", "steps": [ { "title": "Client → WS Gateway", "content": "User A's client sends the message frame over its open WebSocket to **WS Server 42** — the server it was assigned to when it first connected through the load balancer." }, { "title": "Gateway → Chat Service", "content": "WS Server 42 forwards to the **Chat Service**, which:\\n- Validates the message (auth, rate limits, content policy)\\n- Assigns a **Snowflake ID** + wall-clock timestamp\\n- Writes to the message database (durable, ordered)\\n- Publishes to Kafka topic \`channel-{channel_id}\`" }, { "title": "Kafka → Fanout Service", "content": "The **Fanout Service** consumes from Kafka and checks each channel member:\\n- **Online:** look up their WS server from the Connection Registry → route message there\\n- **Offline:** increment unread count + enqueue a push notification" }, { "title": "Target WS Server → User B", "content": "The Fanout Service sends the message payload to **WS Server 17** — User B's server. WS-17 immediately pushes it down User B's open connection." }, { "title": "ACK back to User A", "content": "WS Server 42 sends an acknowledgment to User A's client confirming the message was accepted for delivery. The client can now clear its local send queue for this message ID." } ] }
\`\`\`

The **Kafka decoupling** is a key architectural choice: WS Server 42 does not directly contact WS Server 17. Kafka absorbs traffic bursts and guarantees fanout happens reliably even if a fanout worker crashes mid-delivery.

\`\`\`mermaid
sequenceDiagram
    participant A as User A
    participant WS42 as WS-Server 42
    participant Chat as Chat Service
    participant K as Kafka
    participant Fan as Fanout Service
    participant WS17 as WS-Server 17
    participant B as User B

    A->>WS42: message frame
    WS42->>Chat: validate + persist
    Chat->>K: publish channel-{id}
    K->>Fan: consume
    Fan->>Fan: lookup members in registry
    Fan->>WS17: route to User B's server
    WS17->>B: push message
    WS42->>A: ack
\`\`\`

## Large Channel Fanout

A channel with 100,000 members — 30,000 of them online — creates a **fanout amplification problem**: one sent message requires 30,000 WebSocket pushes.

\`\`\`callout
{ "type": "danger", "title": "The Fanout Bottleneck", "content": "A single Fanout worker processing 30K pushes serially introduces noticeable delivery lag. At Slack's scale, with many large channels active simultaneously, a naive single-worker fanout collapses under load. The problem compounds: each push requires a Redis lookup, a network call to a WS server, and serialization overhead." }
\`\`\`

### Solution: Hierarchical Fanout

Partition the channel's member list across multiple fanout workers, each responsible for a shard:

\`\`\`mermaid
graph TD
    K[Kafka Topic] --> F1[Fanout Worker 1\\n10K members]
    K --> F2[Fanout Worker 2\\n10K members]
    K --> F3[Fanout Worker 3\\n10K members]
    F1 --> WS1[WS Servers A–G]
    F2 --> WS2[WS Servers H–N]
    F3 --> WS3[WS Servers O–Z]
\`\`\`

Each worker consults the Connection Registry for its shard and dispatches pushes in parallel. Total delivery time scales with the number of workers, not the raw member count.

\`\`\`concept
{ "title": "Buffering Missed Messages on Reconnect", "variant": "insight", "content": "If a user temporarily disconnects, real-time messages sent to them are buffered in a short-term Kafka topic. On reconnect, the system replays the handful of missed messages down the freshly opened WebSocket — making brief connection drops entirely transparent to the end user." }
\`\`\`

## Scaling WebSocket Servers

Each connection consumes roughly 10 KB of memory (socket buffer + metadata). This scales predictably:

| Metric | Per Server | 200 Servers |
|--------|-----------|-------------|
| Connections | 50,000 | 10,000,000 |
| Memory | ~500 MB | ~100 GB |
| Bandwidth | ~3 MB/s | ~600 MB/s |
| CPU (serialization) | 2 cores | 400 cores |

### Graceful Shutdown

When a WS server needs to restart — deployment, scale-down, or crash recovery — naively killing it would drop all active connections and cause message loss. The correct sequence:

1. **Stop** accepting new connections (remove from load balancer pool)
2. **Send** a \`reconnect\` message to all currently connected clients
3. **Clients** re-establish WebSocket connections through the load balancer, landing on different servers
4. **Wait** for all connections to drain (timeout: 30s)
5. **Shut down** the process

This ensures zero message loss during rolling deployments.

\`\`\`quiz
{ "title": "WebSocket Architecture", "questions": [ { "question": "Why does Slack use a Layer-4 (TCP) sticky load balancer for WebSocket traffic?", "options": [ "TCP is faster than UDP for all chat payloads", "WebSockets are stateful — the same TCP connection must persist on one server for its entire lifetime", "Redis can only track connections mapped to a single load balancer", "HTTP/2 multiplexing requires sticky sessions at the TCP layer" ], "answer": 1, "explanation": "WebSocket is a long-lived, stateful TCP connection. Sticky sessions ensure all frames for a given client always route to the same WS server holding the open socket. Without this, the load balancer could send frames to a server with no record of this client, immediately dropping the connection." }, { "question": "A public Slack channel has 100K members. 30K are currently online when a message is sent. How many WebSocket pushes must the Fanout Service make?", "options": [ "100,000 — one per member", "30,000 — one per online member", "1 — the message goes to Kafka once", "Depends on the message payload size" ], "answer": 1, "explanation": "Only online members can receive a WebSocket push. The 70K offline members get their unread counts incremented and may receive mobile push notifications. The 30K online members each require an individual WebSocket push — this is the fanout amplification problem that hierarchical fanout workers solve." }, { "question": "What is the purpose of the TTL on Connection Registry entries in Redis?", "options": [ "To expire old messages from the registry after 5 minutes", "To automatically clean up stale entries when connections die without sending a FIN frame", "To force users to re-authenticate via OAuth every 300 seconds", "To cap total Redis memory by limiting the number of stored connections" ], "answer": 1, "explanation": "Mobile devices lock, NAT tables expire, and networks switch — all without sending a TCP FIN. Without a TTL, the registry fills with zombie entries. The heartbeat refreshes the TTL every 30s. If heartbeats stop, the TTL expires after 300s and the user is marked offline automatically, even if the server never received a disconnect signal." }, { "question": "Why does the message flow route through Kafka between the Chat Service and Fanout Service, rather than making direct RPCs?", "options": [ "Kafka natively supports the WebSocket wire protocol", "Kafka decouples the write path from fanout, absorbs bursts, and ensures delivery even if a fanout worker crashes mid-processing", "Direct RPC would require every Chat Service instance to maintain a registry of all WS servers", "Kafka provides sub-millisecond latency that direct HTTP cannot match" ], "answer": 1, "explanation": "Kafka decouples persistence (Chat Service writes) from delivery (Fanout reads). A sudden message burst won't cascade into a fanout overload. If a fanout worker crashes mid-delivery, the message remains in Kafka and another worker picks it up — guaranteeing at-least-once delivery without any work on the Chat Service's side." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "WebSocket replaces polling with a persistent TCP channel — the server pushes only when new data exists, eliminating the 10M req/s overhead of per-second polling at scale.", "A Connection Registry in Redis (user → WS server) lets the Fanout Service route messages precisely without broadcasting to all servers.", "Heartbeats (ping/pong every 30s) combined with TTL-backed registry entries handle zombie connections that never send a FIN frame.", "Kafka decouples message persistence from fanout delivery — absorbing bursts and ensuring reliability when fanout workers fail.", "Large channel fanout (30K+ pushes per message) is solved by sharding members across hierarchical fanout workers that execute in parallel.", "Graceful shutdown with a 'reconnect' signal lets WS servers drain cleanly, enabling zero-downtime rolling deployments." ] }
\`\`\``,
    },
    {
      id: "slack-message-storage",
      slug: "slack-message-storage",
      title: "Message Storage & Delivery",
      content: `# Slack: Message Storage & Delivery

Every message travels from keypress to screen through a chain of deliberate design choices: ID assignment, persistence, fan-out, and gap recovery. This lesson unpacks each step — from how a 64-bit integer encodes both identity and time, to how a reconnecting client catches up on messages it missed.

---

## The Message Data Model

A Slack message carries metadata as important as its content:

\`\`\`json
{
  "message_id":  "1710345600000-000001",
  "channel_id":  "C-abc123",
  "sender_id":   "U-user456",
  "content":     "Hey team, the deploy is done!",
  "type":        "text",
  "created_at":  1710345600000,
  "edited_at":   null,
  "thread_id":   null,
  "attachments": [],
  "reactions":   {"rocket": ["U-user789"]}
}
\`\`\`

\`type\` branches into \`text\`, \`file\`, and \`system\` (join/leave events). \`thread_id\` is null for top-level messages — replies set it to the parent's ID. \`reactions\` stores emoji → list of reactor IDs inline, so the UI can render them without a separate query.

### Snowflake IDs: The Sort Key Is the ID

UUIDs are 128-bit random values — they don't sort chronologically. Slack needs IDs that *are* the sort key so messages load in order without a secondary index. The solution is a **Snowflake ID**, a 64-bit integer with a timestamp baked into its most significant bits.

\`\`\`concept
{
  "title": "Snowflake ID: A Clock Inside an Integer",
  "variant": "mental-model",
  "content": "Pack a millisecond timestamp into the most-significant bits of a 64-bit integer. Because larger timestamps produce larger integers, Snowflake IDs are naturally time-ordered — the database sort order IS chronological order. The remaining bits encode datacenter, machine, and a per-millisecond sequence counter, guaranteeing up to 4,096 unique IDs per millisecond per machine with zero coordination between generators."
}
\`\`\`

\`\`\`
┌────────────────┬────────────┬──────────┬─────────────┐
│ Timestamp (ms) │ Datacenter │ Machine  │ Sequence    │
│    41 bits     │   5 bits   │  5 bits  │  12 bits    │
└────────────────┴────────────┴──────────┴─────────────┘
                       64 bits total
\`\`\`

\`\`\`trace
{
  "title": "Snowflake ID Generation — Bit Assembly",
  "language": "python",
  "code": "EPOCH = 1609459200000  # Jan 1 2021\\ntimestamp = int(time.time() * 1000) - EPOCH\\ndatacenter_id = 1\\nmachine_id    = 3\\nsequence      = 0\\n\\nsnowflake_id = (\\n    (timestamp     << 22) |\\n    (datacenter_id << 17) |\\n    (machine_id    << 12) |\\n    sequence\\n)",
  "frames": [
    { "line": 1, "vars": { "EPOCH": 1609459200000 }, "note": "Custom epoch trims leading bits — 41 bits gives ~69 years of range from Jan 2021" },
    { "line": 2, "vars": { "timestamp": 100886400000 }, "note": "Milliseconds since our epoch. This becomes the sort key — larger timestamp = larger ID" },
    { "line": 3, "vars": { "datacenter_id": 1 }, "note": "5 bits = 32 datacenters. Uniqueness scope: global across all DCs" },
    { "line": 4, "vars": { "machine_id": 3 }, "note": "5 bits = 32 machines per datacenter. Combined with DC, uniquely identifies the generator" },
    { "line": 5, "vars": { "sequence": 0 }, "note": "Resets to 0 each new millisecond. Increments up to 4095 before the generator blocks" },
    { "line": 7, "vars": { "timestamp_shifted": "bits 63–22" }, "note": "Timestamp occupies most-significant bits — guarantees time-ordering of all generated IDs" },
    { "line": 8, "vars": { "dc_shifted": "bits 21–17" }, "note": "Datacenter ID occupies bits 21–17" },
    { "line": 9, "vars": { "machine_shifted": "bits 16–12" }, "note": "Machine ID occupies bits 16–12, sequence the remaining 12" },
    { "line": 10, "vars": { "snowflake_id": 423398334464012288 }, "note": "Final 64-bit integer: globally unique, monotonically increasing, directly usable as Cassandra sort key" }
  ],
  "speed": 900
}
\`\`\`

---

## Storage Architecture: Hot and Cold Tiers

Slack's ~14,000 messages/second average (42K/s peak) cannot be stored uniformly. Recency determines cost and access pattern:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Hot Tier",
      "icon": "🔥",
      "content": "**Cassandra — messages < 30 days old**\\n\\nPartition key: \`channel_id\` | Sort key: \`message_id\` (Snowflake)\\n\\nLoading a channel's history is the dominant read pattern — always for one channel, always in time order. That's a single Cassandra partition scan: no cross-node joins, no secondary indexes.\\n\\n**Sharding math:**\\n\\n\`\`\`\\n14,000 writes/s across all channels\\nTarget: < 500 writes/s per shard\\nShards needed: 14,000 / 500 = 28 → use 64 for headroom\\nAssignment: hash(channel_id) % 64\\n\`\`\`\\n\\nCost: ~$0.10/GB/month (SSD-backed). Latency: < 5ms p99."
    },
    {
      "label": "Cold Tier",
      "icon": "🧊",
      "content": "**S3 + Parquet — messages > 30 days old**\\n\\nA background compaction job drains old rows from Cassandra into columnar Parquet files on S3 — one file per channel per day.\\n\\nAccess pattern: bulk analytics, compliance export, search index rebuild. Sequential scan, not random access.\\n\\nCost: ~$0.023/GB/month — roughly 4× cheaper than hot storage.\\n\\n**Search coverage:** Elasticsearch covers both tiers. A CDC → Kafka → ES indexer pipeline keeps the search index current; rolling monthly indices handle 131 TB/year through Elasticsearch's index lifecycle management."
    },
    {
      "label": "Why Cassandra?",
      "icon": "🤔",
      "content": "Three properties align perfectly with the chat use case:\\n\\n1. **Wide rows** — a single partition key (\`channel_id\`) can hold millions of sorted column entries (messages). Loading a channel's history = one partition read.\\n\\n2. **Tunable consistency** — for message writes, \`QUORUM\` write + \`LOCAL_ONE\` read balances durability with low latency.\\n\\n3. **Horizontal scale** — adding nodes redistributes partitions with no downtime, matching Slack's growth curve.\\n\\nA relational database would require a secondary index on \`created_at\` and face cross-shard join complexity at this write volume."
    }
  ]
}
\`\`\`

---

## Message Delivery: End-to-End Flow

\`\`\`sysdiag
{
  "title": "End-to-End Message Delivery",
  "width": 720,
  "height": 320,
  "nodes": [
    { "id": "sender",   "label": "Sender",             "x": 55,  "y": 160, "kind": "client" },
    { "id": "ws_in",    "label": "WebSocket\\nGateway",  "x": 200, "y": 160, "kind": "service" },
    { "id": "msg_svc",  "label": "Message\\nService",    "x": 360, "y": 160, "kind": "service" },
    { "id": "cassandra","label": "Cassandra",           "x": 510, "y": 70,  "kind": "database" },
    { "id": "kafka",    "label": "Kafka",               "x": 510, "y": 250, "kind": "service" },
    { "id": "ws_out",   "label": "WebSocket\\nGateway",  "x": 650, "y": 160, "kind": "service" },
    { "id": "receivers","label": "Receivers",           "x": 790, "y": 160, "kind": "client" }
  ],
  "edges": [
    { "from": "sender",    "to": "ws_in",     "label": "send" },
    { "from": "ws_in",     "to": "msg_svc",   "label": "validate" },
    { "from": "msg_svc",   "to": "cassandra", "label": "persist" },
    { "from": "msg_svc",   "to": "kafka",     "label": "publish" },
    { "from": "kafka",     "to": "ws_out",    "label": "fan-out" },
    { "from": "ws_out",    "to": "receivers", "label": "push" }
  ],
  "annotations": {
    "msg_svc": "Assigns Snowflake ID, validates, persists to Cassandra, then publishes to Kafka. No DB read on the send path — pure write throughput.",
    "kafka":   "Decouples persistence from delivery. Every WebSocket gateway subscribes; each delivers only to its connected clients. Sender and receiver can be on different gateway nodes.",
    "cassandra":"Write-confirmed before Kafka publish, so durability is guaranteed before fan-out begins."
  }
}
\`\`\`

### Online vs Offline Delivery Guarantees

\`\`\`steps
{
  "title": "Delivery Protocol for Every User State",
  "steps": [
    {
      "title": "Online: ACK-Based Push",
      "content": "The WebSocket gateway pushes messages with a sequence number. The client ACKs each batch.\\n\\n- No ACK within 5 seconds → server re-sends (at-least-once semantics)\\n- Client deduplicates by \`message_id\` before rendering\\n- Heartbeat messages detect dead connections before they cause silent delivery failure\\n\\nResult: **< 100ms delivery latency** for active users, with retry safety built in."
    },
    {
      "title": "Offline: Cursor-Based Pull on Reconnect",
      "content": "Each user-channel pair has a \`last_seen_message_id\` cursor stored server-side. On reconnect, the client sends its cursor:\\n\\n\`\`\`\\nGET /api/channels/{channel_id}/messages\\n  ?after={last_seen_message_id}&limit=50\\n\`\`\`\\n\\nThe server pages through Cassandra returning only the gap. Because the cursor is server-side, a user logging in from a new device still syncs correctly — no client state required."
    },
    {
      "title": "Cross-Server Fan-out via Kafka",
      "content": "A sender and receiver are often connected to **different** WebSocket gateway nodes. The Message Service publishes to Kafka; every gateway subscribes. Each gateway checks its in-memory connection map and delivers only to sockets it owns.\\n\\nIf the receiver is offline, Cassandra holds the message — no per-user queue needed. The pull-on-reconnect flow covers the gap."
    }
  ]
}
\`\`\`

---

## Read Receipts and Unread Counts

Per-channel read cursors track exactly where each user stopped reading:

\`\`\`
Table: read_cursors
┌──────────┬────────────┬──────────────────────┐
│ user_id  │ channel_id │ last_read_message_id │
├──────────┼────────────┼──────────────────────┤
│ U-123    │ C-abc      │ msg-1710345601000    │
│ U-123    │ C-def      │ msg-1710345500000    │
└──────────┴────────────┴──────────────────────┘
\`\`\`

**Unread count** = messages in channel where \`message_id > last_read_message_id\`. Recomputing this from Cassandra on every sidebar render is expensive — so counts are cached as atomic counters in Redis:

\`\`\`
Key:   "unread:U-123:C-abc"
Value: 7
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Atomic Counter Strategy",
  "content": "On new message: \`INCR unread:U-123:C-abc\` — O(1) atomic increment, no race condition possible.\\n\\nOn channel open: \`SET unread:U-123:C-abc 0\` and update \`read_cursors\` asynchronously.\\n\\nOn Redis eviction or restart: fall back to a Cassandra COUNT query to rehydrate the counter. Redis is an optimization layer — Cassandra is the source of truth."
}
\`\`\`

---

## Search Architecture

\`\`\`collapse
{
  "title": "Deep Dive: Full-Text Search Pipeline",
  "content": "Messages are searchable across both hot and cold tiers through Elasticsearch, fed by a CDC pipeline.\\n\\n**Indexing pipeline:**\\n\\n\`\`\`\\nCassandra → CDC → Kafka → ES Indexer → Elasticsearch Cluster\\n\`\`\`\\n\\nChange Data Capture (CDC) streams every write out of Cassandra without impacting write latency. The Kafka buffer absorbs indexing lag.\\n\\n**Index design:**\\n- \`content\`: full-text analyzed field\\n- \`sender_id\`, \`channel_id\`: keyword fields for filtered search\\n- \`created_at\`: date field for time-range queries\\n- Rolling monthly indices (\`messages-2024-03\`, \`messages-2024-04\`) with index lifecycle management — old indices are moved to cheaper node tiers automatically\\n\\n**Query flow:**\\n\\n\`\`\`\\nUser query → Search Service → ES Cluster\\n                                   ↓\\n                      Returns ranked message IDs\\n                                   ↓\\n                      Fetch full messages from Cassandra/S3\\n                                   ↓\\n                      Return results with context\\n\`\`\`\\n\\nThis two-phase pattern keeps the ES index lean — only searchable fields are indexed, not full message payloads. Relevance ranking lives in ES; authoritative content lives in Cassandra."
}
\`\`\`

---

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why are Snowflake IDs preferable to UUIDs as message identifiers in a chat storage system?",
      "options": [
        "They are shorter, saving storage compared to 128-bit UUIDs",
        "Their most-significant bits encode a timestamp, making them time-ordered and usable directly as a database sort key",
        "They are cryptographically random, preventing ID enumeration attacks",
        "They use distributed consensus to guarantee global uniqueness"
      ],
      "answer": 1,
      "explanation": "Snowflake IDs pack a millisecond timestamp into bits 63–22. Because a larger timestamp produces a larger integer, Snowflakes sort chronologically with no secondary index. UUIDs are random — you'd need a separate created_at column and index to achieve the same sort order."
    },
    {
      "question": "Cassandra's hot storage tier partitions messages by channel_id. What problem does this solve?",
      "options": [
        "It distributes load evenly because channel IDs are randomly distributed",
        "It co-locates all messages for a channel on one partition, making history retrieval a single partition scan",
        "It prevents hot-shard problems by splitting high-volume channels across multiple nodes",
        "It ensures message ordering across shards using distributed timestamps"
      ],
      "answer": 1,
      "explanation": "The dominant read pattern is 'load messages for channel X in time order'. Partitioning by channel_id means that query hits exactly one partition with no cross-node joins. The Snowflake sort key inside the partition provides chronological ordering for free."
    },
    {
      "question": "A message is delivered to a user on WebSocket Gateway Node A. The recipient is connected to Gateway Node B. How does Node B receive the message to deliver it?",
      "options": [
        "Gateway Node A queries a shared Redis set to find Node B and forwards directly via gRPC",
        "The Message Service writes to all gateway nodes' local databases simultaneously",
        "The Message Service publishes to Kafka; all gateway nodes subscribe and each delivers to its own connected clients",
        "The recipient's client polls the Message Service every 100ms for new messages"
      ],
      "answer": 2,
      "explanation": "Kafka acts as the fan-out bus. The Message Service publishes once; every WebSocket gateway subscribes. Each gateway checks its in-memory connection map and delivers only to sockets it owns. This avoids direct node-to-node coupling and scales to any number of gateways."
    },
    {
      "question": "Why are unread counts cached in Redis rather than recomputed from Cassandra on every request?",
      "options": [
        "Cassandra cannot perform COUNT queries on sorted columns",
        "Redis INCR is an O(1) atomic operation, avoiding the cost of a COUNT scan and preventing race conditions on concurrent increments",
        "Redis automatically pushes unread counts to mobile push notification services",
        "Cassandra's eventual consistency makes COUNT results unreliable"
      ],
      "answer": 1,
      "explanation": "Computing COUNT(messages WHERE message_id > last_read_message_id) in Cassandra on every sidebar render hits the database repeatedly under high load. Redis INCR atomically increments the counter when a new message arrives and SET resets it to 0 when the channel is opened — O(1) with no race conditions. Cassandra remains the source of truth as a fallback."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Snowflake IDs encode a millisecond timestamp in their most-significant bits, making them inherently time-ordered 64-bit integers — the Cassandra sort key doubles as the message ID",
    "Hot storage (Cassandra, < 30 days) partitions by channel_id so history loads are single-partition scans; cold storage (S3 + Parquet) reduces cost ~4× for archival data with no random-access requirement",
    "Kafka decouples the Message Service from the WebSocket layer — publishers write once, every gateway subscribes and delivers to its own connected clients, enabling horizontal scale of both layers independently",
    "Delivery uses ACK-based push for online users and cursor-based pull (last_seen_message_id) for reconnecting clients — Cassandra is the durable source of truth for both paths",
    "Unread counts are Redis atomic counters (INCR on new message, SET 0 on read) — fast and race-condition-free, with Cassandra as a rehydration fallback on eviction"
  ]
}
\`\`\``,
    },
    {
      id: "slack-presence-typing",
      slug: "slack-presence-typing",
      title: "Presence & Typing Indicators",
      content: `# Slack: Presence & Typing Indicators

Presence and typing indicators feel trivial from the outside — a green dot, a row of ellipsis. Behind the scenes they represent two of the hardest real-time coordination problems at scale: massive fan-out and ephemeral event handling without persistence.

## The Presence Problem

With 10 million concurrent users, even a simple "who is online?" lookup requires careful thinking about fan-out.

\`\`\`concept
{ "title": "The 5-Billion-Notification Problem", "variant": "mental-model", "content": "Naive approach: when User A comes online, notify all 500 of their contacts. At 10M users logging in during peak hours, that's 10M × 500 = **5 billion fan-out events** — enough to saturate any infrastructure. The fix is scope reduction: only notify users who are *actively viewing a screen* that displays User A. This collapses fan-out from ~500 contacts to ~20–50 visible users on the current screen." }
\`\`\`

### Subscription-Based Presence

Rather than broadcasting to all contacts, the Presence Service uses a **pull-on-open, push-on-change** model scoped to whatever the user is currently looking at.

\`\`\`steps
{ "title": "Subscription-Based Presence Flow", "steps": [ { "title": "User opens a channel", "content": "The client identifies the ~50 members currently visible on screen (channel sidebar, conversation header). It sends a **subscribe** request to the Presence Service for those specific users only — not the user's entire contact list." }, { "title": "Server returns a status snapshot", "content": "The Presence Service queries Redis for each subscribed user and returns their current status: \`{ user_123: 'online', user_456: 'away', user_789: 'offline' }\`. The UI populates immediately from this snapshot." }, { "title": "Targeted push on status change", "content": "When any subscribed user changes status (heartbeat expires, manual DND toggle, device switch), the Presence Service pushes a targeted delta **only** to users currently subscribed to that person — not broadcast to all 500 contacts globally." }, { "title": "Unsubscribe on navigation", "content": "When the client closes the channel or switches to a different view, it sends an **unsubscribe** message. The server removes this client from the subscription set, halting all presence push for those users until the next time they're viewed." } ] }
\`\`\`

### Heartbeat-Based Detection

The server doesn't magically know when a user is active — clients periodically announce themselves:

\`\`\`
Client ────── heartbeat every 30s ──────▶ Presence Service

Detection rules:
  heartbeat received           → status = "online"
  no heartbeat for 60s         → status = "away"
  no heartbeat for 300s        → status = "offline"
  user sets DND manually       → overrides automatic detection
\`\`\`

**Scale check:** 10M users × 1 heartbeat/30s = **333K heartbeats/second** — a Redis \`SET\` throughput that a well-tuned Redis cluster handles comfortably.

### Multi-Device Presence

A user logged in on phone, desktop, and web simultaneously sends three separate heartbeat streams. The status shown to others is always the **most active** device.

\`\`\`trace
{ "title": "Multi-Device Presence Aggregation", "language": "python", "code": "def aggregate_presence(devices):\\n    priority = {\\"online\\": 0, \\"away\\": 1, \\"offline\\": 2}\\n    statuses = [d[\\"status\\"] for d in devices]\\n    return min(statuses, key=lambda s: priority.get(s, 3))\\n\\ndevices = [\\n    {\\"device\\": \\"desktop\\", \\"status\\": \\"away\\"},\\n    {\\"device\\": \\"mobile\\",  \\"status\\": \\"online\\"},\\n    {\\"device\\": \\"web\\",     \\"status\\": \\"offline\\"}\\n]\\nresult = aggregate_presence(devices)\\nprint(result)", "frames": [ { "line": 1, "vars": {}, "note": "Enter aggregate_presence — called whenever any device heartbeat changes" }, { "line": 2, "vars": { "priority": "{online:0, away:1, offline:2}" }, "note": "Priority map: lower number = more active state" }, { "line": 3, "vars": { "priority": "{online:0, away:1, offline:2}", "statuses": "[\\"away\\", \\"online\\", \\"offline\\"]" }, "note": "Extract status string from each device record" }, { "line": 4, "vars": { "priority": "{online:0, away:1, offline:2}", "statuses": "[\\"away\\", \\"online\\", \\"offline\\"]", "return": "\\"online\\"" }, "note": "min() with priority key — 'online' has value 0, wins over 'away'=1 and 'offline'=2" }, { "line": 11, "vars": { "result": "\\"online\\"" }, "note": "Mobile's 'online' dominates. Redis aggregated key updated.", "stdout": "online" } ], "speed": 900 }
\`\`\`

Redis stores per-device keys plus a separate aggregated key that other users read:

\`\`\`
user_123:desktop → "away"
user_123:mobile  → "online"
user_123:web     → "offline"
user_123:status  → "online"   ← aggregated; what others see
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Presence Is Eventually Consistent by Design", "content": "Slack deliberately accepts **eventual consistency** for presence indicators. A green dot a few seconds out of date is acceptable — a missing message is not. Strong consistency is reserved for message delivery and ordering within channels. This is a conscious architectural trade-off, not an oversight." }
\`\`\`

---

## Typing Indicators

When User A types in #general, all 50 users viewing that channel should see "User A is typing..." A fast typist fires a keydown event every ~100ms — that's 10 events/second per user.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive: emit on every keystroke", "code": "// Fires up to 10x/second per user\\ndocument.addEventListener('keydown', () => {\\n  socket.emit('typing', { channel, userId });\\n});\\n\\n// At 1M active typists:\\n// 1M * 10 = 10M events/second" }, "after": { "label": "Throttled: at most 1 event per 3–5s", "code": "let typingTimeout = null;\\n\\ndocument.addEventListener('keydown', () => {\\n  if (!typingTimeout) {\\n    // Only fires at the START of a typing burst\\n    socket.emit('typing', { channel, userId });\\n  }\\n  clearTimeout(typingTimeout);\\n  typingTimeout = setTimeout(() => {\\n    socket.emit('stopped_typing', { channel, userId });\\n    typingTimeout = null;\\n  }, 5000);\\n});\\n\\n// At 1M active typists:\\n// 1M / 3 = ~333K events/second" } }
\`\`\`

### The TTL Trick: No Explicit "Stop" Required

The server can avoid relying on \`stopped_typing\` events entirely by delegating expiry to Redis:

\`\`\`steps
{ "title": "Server-Side Typing with Redis TTL", "steps": [ { "title": "Client sends throttled 'typing' event", "content": "At most once every 3 seconds per user per channel. The WS server forwards this upstream to the Presence/Typing Service. If the client drops or crashes, no cleanup code is needed." }, { "title": "Service sets a Redis key with TTL", "content": "Sets \`typing:{channelId}:{userId}\` to \`1\` with a **6-second TTL** — double the client throttle interval. If the client keeps typing, it refreshes the key every 3s. If it stops, the key expires naturally in ≤6s." }, { "title": "Broadcast to channel subscribers", "content": "The service pushes \`{ type: 'typing', user: 'A', channel: '#general' }\` to all WS servers with active subscribers for this channel. Those servers relay it to connected clients, which render 'User A is typing...'" }, { "title": "Indicator disappears automatically", "content": "When the Redis TTL expires, the next presence poll returns no typing state. The client also clears the indicator after a local 5s timeout. No 'stopped_typing' message is required for the common case." } ] }
\`\`\`

### Scale Math

| Metric | Calculation | Result |
|--------|-------------|--------|
| Active typists | 10% of 10M online users | 1M users |
| Typing events (throttled 1/3s) | 1M ÷ 3 | ~333K events/s |
| Average viewers per channel | — | ~20 users |
| Total push operations | 333K × 20 | **~6.6M pushes/s** |

\`\`\`callout
{ "type": "success", "title": "Why 6.6M Pushes/s Is Manageable", "content": "Typing pushes are **ephemeral** (no DB write needed), **lossy** (missing one is fine — next arrives in 3s), and **low priority** (droppable under load). Compare this to message delivery, which requires durability, exactly-once semantics, and persistence. Typing indicators are a fundamentally different — and much cheaper — class of event." }
\`\`\`

---

## Full Architecture

\`\`\`sysdiag
{ "title": "Presence & Typing Service Architecture", "width": 700, "height": 300, "nodes": [ { "id": "clients", "label": "Clients", "x": 60, "y": 150, "kind": "client" }, { "id": "ws", "label": "WS Layer", "x": 240, "y": 150, "kind": "service" }, { "id": "presence", "label": "Presence Service", "x": 450, "y": 150, "kind": "service" }, { "id": "redis_s", "label": "Redis Status", "x": 640, "y": 80, "kind": "database" }, { "id": "redis_t", "label": "Redis Typing", "x": 640, "y": 220, "kind": "database" } ], "edges": [ { "from": "clients", "to": "ws", "label": "WebSocket" }, { "from": "ws", "to": "presence", "label": "heartbeat / typing" }, { "from": "presence", "to": "redis_s", "label": "SET/GET status" }, { "from": "presence", "to": "redis_t", "label": "SET w/ TTL" }, { "from": "presence", "to": "ws", "label": "push deltas" }, { "from": "ws", "to": "clients", "label": "status updates" } ], "annotations": { "presence": "Central coordinator: handles heartbeats (30s), typing events, and subscription management. Fans out status changes only to active subscribers — not all contacts.", "redis_s": "Per-device status keys + aggregated key. Handles ~333K SET/s at 10M users. Aggregation runs on write, so reads are O(1).", "redis_t": "Typing keys with 6s TTL. Expiry auto-clears indicators — no explicit stop event needed for the common case.", "ws": "Routes incoming heartbeats and typing events upstream to Presence Service; pushes outgoing presence deltas downstream to subscribed clients only." } }
\`\`\`

---

## Trade-offs

| Decision | Choice | Trade-off |
|----------|--------|-----------|
| Presence scope | Subscription-based (per screen) | Less real-time than full broadcast, but fan-out shrinks from ~500 contacts to ~50 visible users |
| Heartbeat interval | 30 seconds | Longer = less Redis load; shorter = faster offline detection. 30s is a common industry balance |
| Typing throttle | 3 seconds | Less responsive than 1s but reduces typing event volume by ~10× |
| Multi-device aggregation | Most-active device wins | Simple logic; may show "online" when the user is only passively on mobile |
| Typing events | Ephemeral (no DB write) | Acceptable loss — next throttled event arrives within 3s under normal operation |

---

\`\`\`quiz
{ "title": "Presence & Typing: Check Your Understanding", "questions": [ { "question": "At 10M concurrent users with ~500 contacts each, why does the naive presence broadcast approach fail?", "options": [ "WebSocket servers can't hold 10M persistent connections simultaneously", "Redis can't process that many SET operations per second", "Fan-out produces ~5 billion notifications per status-change wave — far beyond any infrastructure's capacity", "Heartbeats would collide and generate false 'offline' signals for active users" ], "answer": 2, "explanation": "10M users × 500 contacts = 5 billion fan-out events per wave. Subscription-based presence reduces this to ~20–50 active viewers per status change by scoping notifications to users currently viewing the relevant screen." }, { "question": "A user is logged in on three devices: desktop (away), mobile (online), web (offline). What status do their contacts see?", "options": [ "away — desktop is treated as the primary device", "offline — conflicting signals default to the most conservative state", "online — the most-active device wins the aggregation", "away — the median status is shown across devices" ], "answer": 2, "explanation": "The aggregation assigns a priority number: online=0, away=1, offline=2. Python's min() (or equivalent) picks 'online' from mobile because it has the lowest priority value — i.e., the most active state." }, { "question": "How does the server clear a 'User A is typing...' indicator without requiring an explicit stopped_typing message?", "options": [ "It listens for User A's next sent message and clears the indicator on receipt", "It sets a Redis key with a 6-second TTL; when the key expires, the indicator disappears naturally", "It polls each client every second and resets the timer if no keydown events are reported", "It uses a WebSocket ping to detect client inactivity and broadcasts a clear event" ], "answer": 1, "explanation": "SET typing:{channel}:{user} 1 EX 6 — the key auto-expires after 6 seconds (2× the 3s client throttle). Since the client refreshes the key every 3s while typing, a single missed refresh naturally clears the indicator within one TTL window." }, { "question": "According to Slack's design philosophy, which consistency model is deliberately chosen for presence indicators?", "options": [ "Strong consistency — a user's green dot must be accurate to within milliseconds", "Eventual consistency — presence may be slightly stale; strong guarantees are reserved for message ordering and delivery", "Causal consistency — presence updates must follow the causal order of messages sent", "Read-your-writes consistency — only the user themselves sees their own accurate real-time status" ], "answer": 1, "explanation": "Slack carefully selects where strong guarantees matter (message persistence, ordering within a channel) and where eventual consistency is acceptable (search results, read receipts, presence indicators). A stale green dot is a minor UX issue; a lost message is a correctness failure." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Subscription-based presence (per screen, not per contact list) is the core scaling insight — fan-out drops from ~500 contacts to ~50 visible users", "Heartbeats every 30s drive automatic status detection; 10M users generate ~333K heartbeats/s — well within Redis capacity", "Multi-device presence aggregates to the most-active device using a simple priority map (online=0, away=1, offline=2)", "Client-side typing throttle (1 event/3s) combined with server-side Redis TTL (6s) eliminates the need for explicit 'stop typing' messages in the common case", "Typing events are deliberately ephemeral and lossy: no persistence, droppable under load, and self-correcting within 3s", "Presence and typing use eventual consistency by design — strong guarantees are reserved for message delivery, not status indicators" ] }
\`\`\``,
    },
    {
      id: "slack-architecture-walkthrough",
      slug: "slack-architecture-walkthrough",
      title: "Architecture Walkthrough",
      content: `# Slack: Complete Architecture Walkthrough

Now that we've designed each subsystem in isolation — WebSocket gateways, message persistence, fanout, presence, and search — this lesson ties everything together into a single coherent system. We'll trace an actual message from send to delivery, examine the database schema, and evaluate the key trade-offs that make this design work at Slack's scale.

\`\`\`concept
{ "title": "The Two-Plane Mental Model", "variant": "mental-model", "content": "Slack's architecture separates into two planes that never directly couple:\\n\\n**Real-time plane:** WS Gateways → Chat Service → Kafka → Fanout → WS Gateways. Optimised for millisecond delivery to online users — no DB reads on the hot path after message persistence.\\n\\n**Persistence plane:** Cassandra (messages), PostgreSQL (channels/members), Elasticsearch (search), S3 (files). Optimised for durability, history, and retrieval.\\n\\nEvery design decision maps back to keeping these planes decoupled. If Cassandra slows down, online delivery still completes in under 150ms. If a WS server crashes, messages already in Kafka are never lost." }
\`\`\`

---

## Full System Architecture

\`\`\`sysdiag
{ "title": "Slack Full System Architecture", "width": 760, "height": 530, "nodes": [ { "id": "geodns", "label": "GeoDNS / LB", "x": 380, "y": 30, "kind": "service" }, { "id": "wsgw", "label": "WS Gateway Cluster\\n(200 servers)", "x": 200, "y": 145, "kind": "service" }, { "id": "api", "label": "API Servers\\n(REST)", "x": 570, "y": 145, "kind": "service" }, { "id": "chat", "label": "Chat Service", "x": 200, "y": 275, "kind": "service" }, { "id": "file", "label": "File Service", "x": 570, "y": 275, "kind": "service" }, { "id": "cassandra", "label": "Cassandra\\n(messages)", "x": 80, "y": 405, "kind": "database" }, { "id": "kafka", "label": "Kafka\\n(fanout bus)", "x": 250, "y": 405, "kind": "queue" }, { "id": "redis", "label": "Redis Cluster\\n(presence/conn)", "x": 420, "y": 405, "kind": "cache" }, { "id": "s3", "label": "S3 / CDN", "x": 570, "y": 405, "kind": "storage" }, { "id": "fanout", "label": "Fanout Service", "x": 250, "y": 500, "kind": "service" } ], "edges": [ { "from": "geodns", "to": "wsgw", "label": "WS" }, { "from": "geodns", "to": "api", "label": "HTTP" }, { "from": "wsgw", "to": "chat", "label": "msg" }, { "from": "api", "to": "file", "label": "upload" }, { "from": "chat", "to": "cassandra", "label": "write" }, { "from": "chat", "to": "kafka", "label": "publish" }, { "from": "chat", "to": "redis", "label": "ACK lookup" }, { "from": "file", "to": "s3", "label": "store" }, { "from": "kafka", "to": "fanout", "label": "consume" }, { "from": "fanout", "to": "wsgw", "label": "gRPC batch" }, { "from": "fanout", "to": "redis", "label": "unread++" } ], "annotations": { "geodns": "GeoDNS routes clients to the nearest regional cluster. The L4 load balancer uses TCP sticky sessions so WebSocket connections land on the same gateway server for the duration of the session.", "wsgw": "200 gateway servers each holding ~50K persistent WebSocket connections — 10M+ total at Slack's peak weekday load. Accepts client messages and pushes real-time events (messages, typing, presence) back to connected clients.", "chat": "Stateless service: validates membership, enforces rate limits (10 msg/s per user), assigns Snowflake IDs, writes to Cassandra, publishes to Kafka, then ACKs the sender. Fanout is fully asynchronous — the ACK does not wait for delivery.", "kafka": "42K msg/s peak throughput. 64 partitions keyed by channel_id ensure all messages for a channel are ordered. 3× replication for durability. Decouples the write path from the fanout path to absorb backpressure.", "redis": "Three roles in one cluster: (1) connection registry mapping user_id → ws_server_id, (2) presence TTL keys refreshed by heartbeat, (3) unread counters per user per channel. ~1M ops/s in cluster mode across 6 nodes.", "fanout": "Reads channel member list from cache, queries Redis for online members' WS server assignments, batches deliveries by WS server, then sends each batch via internal gRPC. Batching reduces 800 per-user calls down to ~160 per-server calls for a large channel.", "cassandra": "Primary message store. Partitioned by channel_id so all messages for a channel are co-located. Snowflake message_ids as the clustering key give time-ordering within partitions at no coordination cost. Replication factor 3." } }
\`\`\`

---

## Data Flow: Tracing a Message End-to-End

Concrete example: User A sends "Ship it!" in **#general** — 1,000 members, 300 online.

\`\`\`steps
{ "title": "Message Journey: Sender → 300 Online Recipients", "steps": [ { "title": "Client → WS Gateway", "content": "User A's client sends over an existing WebSocket — no new TCP handshake:\\n\\n\`\`\`json\\n{ \\"channel\\": \\"C-general\\", \\"content\\": \\"Ship it!\\", \\"client_msg_id\\": \\"abc-123\\" }\\n\`\`\`\\n\\nThe L4 sticky load balancer routes this to **WS Gateway 42**, the same server User A connected to at login. The connection is already authenticated and warm." }, { "title": "Validation & Persistence (Chat Service)", "content": "WS-42 forwards to the **Chat Service**, which runs synchronously before ACKing the sender:\\n\\n1. **Auth check** — is User A a member of #general?\\n2. **Rate limit** — under 10 msg/s?\\n3. **Snowflake ID** — generate \`1710345600000-042-001\` (timestamp + server ID + sequence)\\n4. **Cassandra write** — persist to \`messages\` table, partition key: \`C-general\`\\n5. **Kafka publish** — push to the partition for \`C-general\`\\n6. **ACK → sender** — \`{ client_msg_id: \\"abc-123\\", server_msg_id: \\"1710345600000-042-001\\" }\`\\n\\nThe ACK reaches User A in ~30–50ms. Delivery to everyone else is fully asynchronous from this point." }, { "title": "Fanout to Online Members (Kafka → Fanout Service)", "content": "A **Fanout Worker** consumes from Kafka and orchestrates delivery:\\n\\n1. Fetch 1,000 channel members from in-process cache\\n2. Query Redis connection registry → 300 online, mapped to ~60 distinct WS servers\\n3. **Batch deliveries by WS server** — reduces ~300 individual pushes to ~60 gRPC calls:\\n   - WS-12: [user_5, user_89, user_203, ...]\\n   - WS-35: [user_17, user_44, ...]\\n4. Send each batch via internal gRPC\\n\\nBatching is a critical optimisation. At large channel sizes, per-user delivery would saturate the internal network. Batching by WS server amortises the overhead." }, { "title": "Delivery to Clients", "content": "Each WS server receives its batch from the Fanout Service and **pushes directly over each user's open WebSocket**.\\n\\nNo database reads happen at this stage — the message payload was included in the gRPC batch. The WS server is a pure delivery mechanism at this point.\\n\\n**Total latency for online delivery: ~100–150ms** from User A's send to User B seeing the message appear." }, { "title": "Offline Handling (700 Members)", "content": "For members not present in the Redis connection registry:\\n\\n1. **Unread counter** — \`INCR unread:{user_id}:C-general\` in Redis (O(1), atomic)\\n2. **Notification check** — read user's notification preferences from cache\\n3. **Push queue** — if enabled, enqueue to APNs (iOS) or FCM (Android)\\n\\nWhen an offline user reconnects, their client reads the unread counts from Redis for the badge indicator, then fetches missed messages from Cassandra using \`last_read_msg_id\` as a cursor stored in \`channel_members\`." } ] }
\`\`\`

---

## Database Schema

\`\`\`tabs
{ "tabs": [ { "label": "Cassandra — Messages", "icon": "💬", "content": "Messages are stored in Cassandra, **partitioned by \`channel_id\`**. This collocates all messages for a channel on the same node set — matching the dominant read pattern: *load the last N messages for channel X*.\\n\\n\`\`\`sql\\nCREATE TABLE messages (\\n  channel_id  TEXT,\\n  message_id  BIGINT,        -- Snowflake ID (time-ordered)\\n  sender_id   TEXT,\\n  content     TEXT,\\n  msg_type    TEXT,          -- text, file, system\\n  thread_id   BIGINT,        -- NULL for top-level messages\\n  attachments LIST<TEXT>,\\n  edited_at   TIMESTAMP,\\n  PRIMARY KEY (channel_id, message_id)\\n) WITH CLUSTERING ORDER BY (message_id DESC);\\n\`\`\`\\n\\n**Why Cassandra over PostgreSQL here?**\\n- Write-heavy workload (42K msg/s peak) favours Cassandra's LSM-tree storage over B-tree indexes\\n- Partition by \`channel_id\` gives linear horizontal scaling — add nodes, add capacity\\n- Snowflake IDs as the clustering key give time-ordering without a secondary index\\n- At 131 TB/year of message data, Cassandra's compaction handles large datasets without manual sharding" }, { "label": "PostgreSQL — Channels & Members", "icon": "👥", "content": "Relational data with complex membership queries lives in PostgreSQL:\\n\\n\`\`\`sql\\nCREATE TABLE channels (\\n  id           TEXT PRIMARY KEY,\\n  workspace_id TEXT NOT NULL,\\n  name         TEXT NOT NULL,\\n  type         TEXT CHECK (type IN ('public', 'private', 'dm')),\\n  created_at   TIMESTAMPTZ DEFAULT now()\\n);\\n\\nCREATE TABLE channel_members (\\n  channel_id       TEXT REFERENCES channels(id),\\n  user_id          TEXT NOT NULL,\\n  role             TEXT,            -- member, admin\\n  joined_at        TIMESTAMPTZ,\\n  last_read_msg_id BIGINT,          -- cursor for unread calculation\\n  PRIMARY KEY (channel_id, user_id)\\n);\\n\`\`\`\\n\\n**Why PostgreSQL for membership?**\\n- Membership queries need joins: \`SELECT members WHERE channel_id = X AND role = 'admin'\`\\n- Mutation patterns are balanced (reads ≈ writes) — no LSM advantage\\n- ACID transactions matter for join/leave atomicity\\n- Dataset is small enough for vertical scaling + read replicas" }, { "label": "Redis — Ephemeral State", "icon": "⚡", "content": "Redis holds three categories of fast-changing, non-durable state:\\n\\n**Connection Registry** (user → WS server mapping)\\n\`\`\`\\nHSET  conn:user:{user_id}  ws_server    \\"ws-42\\"\\nHSET  conn:user:{user_id}  connected_at  1710345600\\nEXPIRE conn:user:{user_id}  300     -- 5-min TTL, refreshed by heartbeat\\n\`\`\`\\n\\n**Presence** (online/away/offline)\\n\`\`\`\\nSET presence:{user_id}  \\"online\\"  EX 30  -- 30s TTL; client heartbeat refreshes it\\n\`\`\`\\n\\n**Unread Counters**\\n\`\`\`\\nINCR unread:{user_id}:{channel_id}   -- message arrives while user is offline\\nDEL  unread:{user_id}:{channel_id}   -- user opens the channel\\n\`\`\`\\n\\nAll three self-heal on failure: presence rebuilds from client heartbeats, the connection registry rebuilds on reconnect, and unread counts can be reconstructed from \`last_read_msg_id\` against Cassandra if needed." } ] }
\`\`\`

---

## Design Trade-offs, Failures, and Scale

\`\`\`tabs
{ "tabs": [ { "label": "Architecture Decisions", "icon": "🏗️", "content": "| Decision | Choice | Why Not the Alternative |\\n|----------|--------|--------------------------|\\n| **Transport** | WebSocket | SSE is server→client only; long-polling wastes a connection per request |\\n| **Message DB** | Cassandra | PostgreSQL can't sustain 42K writes/s without extreme and brittle sharding |\\n| **Message IDs** | Snowflake | UUIDs aren't time-ordered; auto-increment requires a central coordinator |\\n| **Fanout** | Kafka + workers | Direct push from Chat Service creates tight coupling and blocks on backpressure |\\n| **Presence** | Redis TTL + heartbeat | DB polling at 10M users would saturate any relational database |\\n| **Search** | Elasticsearch | PostgreSQL full-text lacks relevance ranking and can't scale to 131 TB efficiently |" }, { "label": "Failure Modes", "icon": "🔥", "content": "| Failure | User Impact | Mitigation |\\n|---------|-------------|------------|\\n| **WS server crash** | ~50K users disconnected | Clients auto-reconnect to any available server; Kafka ensures no messages are lost |\\n| **Cassandra node down** | Reads/writes on that partition | Replication factor 3; quorum reads (2-of-3) survive a single node failure |\\n| **Kafka broker down** | Fanout delayed | 3× partition replication; ISR (in-sync replicas) ensures another broker takes over |\\n| **Redis cluster down** | Stale presence, wrong unread counts | Redis Sentinel failover; state rebuilds from heartbeats and Cassandra cursors |\\n| **Fanout worker crash** | Messages delayed, not lost | Kafka consumer group rebalances; another worker resumes at the last committed offset |" }, { "label": "Scale Numbers", "icon": "📈", "content": "| Component | Scale | Strategy |\\n|-----------|-------|-----------|\\n| **WS Gateways** | 200 servers, 10M connections | Horizontal scaling, L4 TCP sticky LB |\\n| **Chat Service** | 42K msg/s peak | Stateless, horizontally scaled |\\n| **Cassandra** | 131 TB/year | 64 shards; partition by \`channel_id\` |\\n| **Kafka** | 42K msg/s | 64 partitions, 3× replication |\\n| **Redis** | ~1M ops/s | Cluster mode, 6 nodes |\\n| **Elasticsearch** | 131 TB/year | Rolling monthly indices, time-based retention |" } ] }
\`\`\`

---

\`\`\`callout
{ "type": "info", "title": "Slack's Actual Architecture — Historical Context", "content": "According to ByteByteGo's analysis of Slack's engineering blog, Slack originally split into exactly two services: a **Web App** (Hacklang) handling auth, permissions, storage and APIs, and a **Channel Server** (Java) handling WebSocket fanout, typing indicators, and presence. The actual message path was: Client → Envoy Edge Proxy → Gateway Server → Channel Server → all subscribed Gateway Servers → clients. The Admin Server used a consistent hash ring to discover which Channel Server owned a given channel. This mirrors the real-time/persistence separation we've designed throughout this module." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Architecture Walkthrough Quiz", "questions": [ { "question": "Why does the Chat Service publish to Kafka rather than fanning out to WS servers directly?", "options": [ "Kafka provides end-to-end encryption for messages in transit", "Decoupling persistence from delivery handles backpressure — a slow Fanout worker doesn't block the sender's ACK", "Kafka is faster than gRPC for small payloads at the same scale", "Direct fanout would require the Chat Service to maintain its own WebSocket connection registry" ], "answer": 1, "explanation": "The key benefit is decoupling. The Chat Service's critical path (validate → persist → ACK) completes in ~50ms regardless of how many online members need the message. Kafka absorbs the fanout load asynchronously — a spike in a large channel's activity, or a slow fanout worker, never backpressures the sender's ACK." }, { "question": "A channel has 5,000 members with 800 online across 160 WS servers. How many gRPC calls does the Fanout Service make?", "options": [ "5,000 — one per channel member", "800 — one per online user", "160 — one per WS server, with each call containing that server's subset of users", "1 — a broadcast to all gateway servers" ], "answer": 2, "explanation": "The Fanout Service batches deliveries by WS server. For 800 online users spread across 160 servers, it makes 160 gRPC calls (one per server), each containing the list of users on that server who should receive the message. This reduces internal network calls by 5× compared to per-user delivery." }, { "question": "When a user reconnects after being offline, how does their client know which messages it missed?", "options": [ "The WS gateway server buffers all missed messages in memory", "The client uses last_read_msg_id from channel_members as a Cassandra cursor to fetch messages with higher IDs", "Kafka replays all missed messages from the beginning of the channel partition", "Push notifications deliver the full message payload for each missed message" ], "answer": 1, "explanation": "The channel_members table in PostgreSQL stores last_read_msg_id per user per channel. On reconnect, the client queries Cassandra for messages with message_id > last_read_msg_id in each channel. Redis holds the unread count for the badge indicator — it's a fast O(1) lookup, not the authoritative source for message retrieval." }, { "question": "Why is Cassandra's partition-by-channel_id scheme better than a single table with a timestamp index in PostgreSQL?", "options": [ "Cassandra supports SQL joins required for thread message lookups", "All messages for a channel land on the same node set, matching the dominant read pattern, and write throughput scales horizontally by adding partitions", "Cassandra provides stronger ACID guarantees for message ordering", "PostgreSQL indexes don't support time-series data at any scale" ], "answer": 1, "explanation": "Partitioning by channel_id means the most common read (last N messages for channel X) never requires a scatter-gather across nodes — all data is local. And because each new channel can be assigned its own partition range, write capacity scales linearly by adding Cassandra nodes. PostgreSQL would require explicit sharding logic to reach the same scale." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The architecture separates into two planes: real-time (WS → Kafka → Fanout) and persistence (Cassandra + PostgreSQL). Keeping them decoupled means a slow database write never blocks online message delivery.", "Fanout is the hardest scaling problem. Batching gRPC deliveries by WS server reduces 800 per-user calls down to ~160 per-server calls for a large channel — a 5× reduction in internal traffic.", "Snowflake IDs solve ordering without a coordinator — the embedded timestamp keeps messages sorted within a Cassandra partition at zero coordination cost.", "Redis handles three ephemeral concerns (connection registry, presence TTL, unread counters) with sub-millisecond latency. All three self-heal after failure — presence rebuilds from heartbeats, unread counters rebuild from the last_read_msg_id cursor in PostgreSQL.", "End-to-end delivery for online users is 100–150ms: ~50ms to persist and ACK the sender, ~50–100ms for Kafka fanout and WS delivery to recipients. The ACK and the fanout are fully decoupled." ] }
\`\`\``,
    },
  ],
};
