import { Module } from "../types";

export const chatSystemModule: Module = {
  id: "sd-chat-system",
  title: "Design a Chat System",
  description: "Design a real-time messaging platform — WebSocket connections, message delivery, presence, and group chat.",
  lessons: [
    {
      id: "sd-chat-1",
      slug: "chat-system-requirements-estimation",
      title: "Requirements & Estimation",
      content: `# Design a Chat System — Requirements & Estimation

A chat system like WhatsApp or Slack enables real-time messaging between users. Let us define the scope and estimate the scale.

## Functional Requirements

1. **1-on-1 messaging** — send and receive text messages in real time.
2. **Group chat** — multiple users in a single conversation (up to 500 members).
3. **Online/offline presence** — see who is currently active.
4. **Message history** — persist messages and allow scrolling through history.
5. **Read receipts** — know when a message has been delivered and read.
6. **Push notifications** — notify users who are offline.
7. **Media sharing** — send images, files (stretch goal; similar to Instagram's upload flow).

## Non-Functional Requirements

- **Real-time delivery:** Messages should arrive within 100-300 ms for online users.
- **Reliability:** No messages should be lost, even if the recipient is offline.
- **Ordering:** Messages within a conversation must appear in the correct order.
- **High availability:** The chat service cannot have downtime.
- **Encryption:** Messages should be encrypted in transit; end-to-end encryption is a stretch goal.

\`\`\`concept
{
  "title": "WebSocket vs. HTTP Polling Trade-off",
  "variant": "insight",
  "content": "WebSockets maintain persistent, bidirectional connections ideal for real-time chat, but each connection consumes ~10 KB of server memory. In contrast, HTTP polling is stateless and easier to scale horizontally, but introduces latency and wastes bandwidth. For 30M concurrent users, WebSockets require ~300 GB of memory just for connection state — a significant infrastructure cost for low-latency messaging."
}
\`\`\`

## Back-of-Envelope Estimation

**Assumptions:**
- 100 million DAU.
- Each user sends ~40 messages/day on average.
- Average message size: 100 bytes (text only).

**Message throughput:**
- 100M × 40 = 4 billion messages/day.
- 4B / 86,400 ≈ ~46,000 messages/second.

**Storage:**
- 4B messages × 100 bytes = 400 GB/day of message text.
- Per year: 400 GB × 365 = 146 TB. Significant but manageable with a distributed database.
- With media: if 5% of messages include a 200 KB image, that is 200M × 200 KB = 40 TB/day of media.

**Concurrent WebSocket connections:**
- If 30% of DAU are online at peak: 30M concurrent connections.
- Each WebSocket connection consumes ~10 KB of server memory.
- 30M × 10 KB = 300 GB of memory just for connections.
- With ~100K connections per server, you need ~300 WebSocket servers at peak.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Chat Infrastructure Cost Estimator",
  "inputs": [
    { "id": "dau", "label": "Daily Active Users (millions)", "default": 100, "min": 1, "max": 1000 },
    { "id": "msg_per_user", "label": "Messages per user per day", "default": 40, "min": 10, "max": 200 },
    { "id": "online_ratio", "label": "Peak online ratio (%)", "default": 30, "min": 10, "max": 80 },
    { "id": "conn_memory_kb", "label": "Memory per WebSocket (KB)", "default": 10, "min": 5, "max": 50 }
  ]
}
\`\`\`

**Key numbers:**

| Metric | Value |
|--------|-------|
| DAU | 100 million |
| Messages/second | ~46,000 |
| Text storage/day | 400 GB |
| Peak concurrent connections | 30 million |
| WebSocket servers needed | ~300 |
| Message storage/year | ~146 TB |

\`\`\`quiz
{
  "title": "Quick Check: Estimation Reasoning",
  "questions": [
    {
      "question": "If DAU doubles to 200M but msg/user falls to 20, what happens to total messages/day?",
      "options": ["Stays 4B", "Drops to 2B", "Rises to 8B", "Becomes 1B"],
      "answer": 0,
      "explanation": "200M × 20 = 4B — the product remains the same, so throughput estimates stay valid."
    },
    {
      "question": "Why is 100 bytes a safe average for text messages?",
      "options": ["Emoji are 4 bytes each", "HTTP headers add 80 bytes", "Unicode chars are 1–4 bytes", "Compression reduces 1 KB to 100 B"],
      "answer": 2,
      "explanation": "UTF-8 encodes most alphabetic chars in 1 byte; 100 chars ≈ 100 bytes."
    },
    {
      "question": "At 50K conn/server instead of 100K, how many servers are needed for 30M conns?",
      "options": ["150", "300", "600", "1500"],
      "answer": 2,
      "explanation": "30M ÷ 50K = 600 servers — halving density doubles fleet size."
    }
  ]
}
\`\`\`

## Why Not HTTP Polling?

**HTTP polling:** Client repeatedly asks the server "any new messages?" every few seconds.
- Wastes bandwidth and server resources when there are no new messages.
- Adds latency (up to polling interval).

**Long polling:** Client sends a request; server holds it open until there is a new message.
- Better than polling but still has overhead from repeatedly re-establishing connections.
- Does not scale well for bidirectional, high-frequency messaging.

**WebSockets:** A single persistent connection where both client and server can send messages at any time.
- Ideal for chat: low latency, bidirectional, efficient.
- Trade-off: requires maintaining stateful connections (unlike stateless HTTP).

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "HTTP Polling (10s interval)",
    "code": "GET /poll?user=123&since=42\\n// 200 OK {\\"messages\\":[]}\\n// repeated 8640 times/day/user"
  },
  "after": {
    "label": "WebSocket",
    "code": "ws://chat.example.com\\n{\\"type\\":\\"msg\\",\\"data\\":\\"hi\\"}\\n// single frame, instant push"
  }
}
\`\`\`

\`\`\`trace
{
  "title": "WebSocket Handshake & Frame Trace",
  "language": "python",
  "code": "import websocket, ssl\\nws = websocket.create_connection('wss://chat.example.com/ws',\\n                                sslopt={'cert_reqs': ssl.CERT_NONE})\\nws.send('{\\"type\\":\\"auth\\",\\"token\\":\\"XYZ\\"}')\\nprint(ws.recv())  # {\\"type\\":\\"ready\\"}\\nws.send('{\\"type\\":\\"msg\\",\\"to\\":\\"u456\\",\\"text\\":\\"hello\\"}')\\nprint(ws.recv())  # {\\"type\\":\\"ack\\",\\"id\\":7}",
  "frames": [
    { "line": 2, "vars": {"ws": "<websocket object>"}, "note": "TCP + TLS established", "stdout": "" },
    { "line": 3, "vars": {}, "note": "Client sends auth frame", "stdout": "" },
    { "line": 4, "vars": {}, "note": "Server confirms readiness", "stdout": "{\\"type\\":\\"ready\\"}" },
    { "line": 5, "vars": {}, "note": "Outbound chat message", "stdout": "" },
    { "line": 6, "vars": {}, "note": "Server ack with id", "stdout": "{\\"type\\":\\"ack\\",\\"id\\":7}" }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Chat systems require persistent, bidirectional connections — WebSockets are the standard choice.",
    "The main scaling challenges are: managing millions of concurrent connections, ensuring message ordering, and delivering messages to offline users.",
    "Text storage is moderate (~146 TB/year); media storage can be much larger.",
    "Connection state (which user is connected to which server) is a critical piece of metadata."
  ]
}
\`\`\``,
    },
    {
      id: "sd-chat-2",
      slug: "chat-system-high-level-design",
      title: "High-Level Design",
      content: `# Design a Chat System — High-Level Design

Let us design the core architecture for real-time messaging.

## Architecture Overview

\`\`\`sysdiag
{
  "title": "High-Level Chat Architecture",
  "width": 800,
  "height": 420,
  "nodes": [
    { "id": "A", "label": "User A", "x": 80, "y": 60, "kind": "user" },
    { "id": "B", "label": "User B", "x": 80, "y": 140, "kind": "user" },
    { "id": "C", "label": "User C", "x": 80, "y": 220, "kind": "user" },
    { "id": "ws1", "label": "WS-1", "x": 240, "y": 60, "kind": "service" },
    { "id": "ws2", "label": "WS-2", "x": 240, "y": 140, "kind": "service" },
    { "id": "ws3", "label": "WS-3", "x": 240, "y": 220, "kind": "service" },
    { "id": "mq", "label": "Kafka", "x": 420, "y": 140, "kind": "queue" },
    { "id": "cs", "label": "Chat Service", "x": 600, "y": 100, "kind": "service" },
    { "id": "ps", "label": "Presence Service", "x": 600, "y": 180, "kind": "service" },
    { "id": "db", "label": "Cassandra", "x": 780, "y": 100, "kind": "database" },
    { "id": "redis", "label": "Redis", "x": 780, "y": 180, "kind": "cache" }
  ],
  "edges": [
    { "from": "A", "to": "ws1", "label": "WS" },
    { "from": "B", "to": "ws2", "label": "WS" },
    { "from": "C", "to": "ws3", "label": "WS" },
    { "from": "ws1", "to": "mq", "label": "publish" },
    { "from": "ws2", "to": "mq", "label": "publish" },
    { "from": "ws3", "to": "mq", "label": "publish" },
    { "from": "mq", "to": "cs", "label": "consume" },
    { "from": "mq", "to": "ps", "label": "consume" },
    { "from": "cs", "to": "db", "label": "write" },
    { "from": "ps", "to": "redis", "label": "write" },
    { "from": "cs", "to": "ws1", "label": "deliver", "style": "dashed" },
    { "from": "cs", "to": "ws2", "label": "deliver", "style": "dashed" },
    { "from": "cs", "to": "ws3", "label": "deliver", "style": "dashed" }
  ],
  "annotations": {
    "ws1": "Stateful WebSocket server holding user connection",
    "mq": "Kafka topic per message type (chat, presence, ack)",
    "cs": "Handles persistence, routing, offline notifications",
    "db": "Cassandra partitioned by conversation_id for fast range queries",
    "redis": "TTL-based presence: user_id → {status, last_seen, ws_server}"
  }
}
\`\`\`

## Component Walkthrough

### WebSocket Servers
- Accept and maintain persistent WebSocket connections from clients.
- **Stateful:** Each server knows which users are connected to it.
- A **connection registry** (in Redis) maps \`user_id → ws_server_id\` so the system knows where to route messages.

\`\`\`concept
{
  "title": "Connection Registry",
  "variant": "mental-model",
  "content": "Think of Redis as the switchboard operator. Every time a user opens the app, the WebSocket server \\"registers\\" itself under that user's name. Later, when a message arrives, the operator instantly knows which server to ring."
}
\`\`\`

### Connection Registry

\`\`\`playground
{
  "title": "Registry Lookup",
  "language": "python",
  "code": "import redis\\nr = redis.Redis()\\n\\n# Alice joins via ws-3\\nr.hset('conn:alice', 'server', 'ws-3')\\n\\n# Bob looks up where to send Alice's message\\ntarget = r.hget('conn:alice', 'server')\\nprint(f\\"Route Alice's message to {target.decode()}\\")",
  "runnable": true
}
\`\`\`

When user A sends a message to user B:
1. WS Server 1 (where A is connected) receives the message.
2. Looks up user B's WebSocket server in the registry → ws-server-2.
3. Routes the message to ws-server-2, which pushes it to user B's connection.

### Chat Service
- Handles message persistence, conversation management, and delivery logic.
- Writes every message to the **Message Database** for history and offline delivery.
- If the recipient is online, routes the message through the WebSocket layer.
- If offline, stores the message and triggers a **push notification**.

### Message Database

Chat messages have a specific access pattern: "get all messages in conversation X, ordered by time, paginated." This is an append-heavy, time-ordered workload.

**Cassandra** is an excellent fit:
- Partition key: \`conversation_id\`
- Clustering key: \`message_timestamp\` (descending for most-recent-first)
- All messages in a conversation are on the same partition → single-partition query.

Schema:
\`\`\`
messages:
  conversation_id (partition key)
  message_id (clustering key, time-based UUID)
  sender_id
  text
  created_at
  status (sent / delivered / read)
\`\`\`

### Presence Service
- Tracks which users are currently online.
- When a user connects via WebSocket, their status is set to "online" in **Redis** with a TTL (e.g., 60 seconds).
- The client sends a heartbeat every 30 seconds to refresh the TTL.
- If the TTL expires (no heartbeat), the user is considered offline.

\`\`\`trace
{
  "title": "Heartbeat & TTL Lifecycle",
  "language": "python",
  "code": "import time, redis, uuid\\nr = redis.Redis()\\nUSER = 'u42'\\nTTL = 60\\n\\n# 1. User connects\\nr.setex(f'presence:{USER}', TTL, 'online')\\nprint('User online')\\n\\n# 2. Heartbeat every 30 s\\nfor beat in range(3):\\n    time.sleep(30)\\n    r.expire(f'presence:{USER}', TTL)\\n    print('Heartbeat sent, TTL refreshed')\\n\\n# 3. Client crashes—no more heartbeats\\nprint('Client gone...')\\ntime.sleep(65)\\nprint('Key expired?', r.get(f'presence:{USER}') is None)",
  "frames": [
    { "line": 6, "vars": {"USER":"u42","TTL":60}, "stdout": "User online" },
    { "line": 10, "vars": {"beat":0}, "stdout": "Heartbeat sent, TTL refreshed" },
    { "line": 10, "vars": {"beat":1}, "stdout": "Heartbeat sent, TTL refreshed" },
    { "line": 10, "vars": {"beat":2}, "stdout": "Heartbeat sent, TTL refreshed" },
    { "line": 15, "vars": {}, "stdout": "Client gone..." },
    { "line": 17, "vars": {}, "stdout": "Key expired? True" }
  ],
  "speed": 900
}
\`\`\`

### Group Chat

For group messages, the flow is:
1. Sender's WebSocket server receives the message.
2. Chat service looks up the group's member list.
3. For each member: check the connection registry and route the message to their WebSocket server.
4. Write the message once to the message DB (partitioned by group conversation_id).

## Message Flow (1-on-1)

\`\`\`steps
{
  "title": "End-to-End Message Journey",
  "steps": [
    {
      "title": "1. Client A sends message",
      "content": "Client A emits a WebSocket frame \`{type:'chat', to:'B', text:'Hey!'}\` to WS-1."
    },
    {
      "title": "2. WS-1 publishes to Kafka",
      "content": "WS-1 wraps the event with metadata and publishes to the **chat** topic."
    },
    {
      "title": "3. Chat Service consumes",
      "content": "Chat Service reads the event, generates a time-UUID message_id, and inserts into Cassandra."
    },
    {
      "title": "4. Lookup recipient location",
      "content": "Chat Service queries Redis: \`HGET conn:B server\` → 'ws-2'."
    },
    {
      "title": "5. Deliver or queue",
      "content": "If online, Chat Service sends the event to WS-2 via Kafka **delivery** topic; if offline, schedules a push notification."
    },
    {
      "title": "6. Acknowledge sender",
      "content": "WS-1 receives delivery confirmation and sends \`message-status:delivered\` back to Client A."
    }
  ]
}
\`\`\`

## Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "WebSocket servers maintain persistent connections; a connection registry in Redis maps users to servers.",
    "Messages are persisted in a time-series-friendly database (Cassandra) partitioned by conversation.",
    "Presence is tracked with TTL-based keys in Redis, refreshed by client heartbeats.",
    "Group chat multiplexes a single message to all group members via the connection registry.",
    "Offline users receive messages via push notifications and retrieve history on reconnection."
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Quick Check — HLD",
  "questions": [
    {
      "question": "Why is Cassandra chosen for the message store?",
      "options": [
        "It supports ACID transactions across partitions",
        "It offers fast time-range queries within a single partition",
        "It keeps all data in memory for speed",
        "It requires strict schema normalization"
      ],
      "answer": 1,
      "explanation": "Cassandra partitions by conversation_id and clusters by timestamp, giving efficient, sequential writes and range reads within one partition."
    },
    {
      "question": "What happens if a client stops sending heartbeats?",
      "options": [
        "The WebSocket server immediately closes the TCP connection",
        "Redis TTL expires and Presence Service marks the user offline",
        "Kafka drops the user’s messages",
        "Cassandra deletes the user’s chat history"
      ],
      "answer": 1,
      "explanation": "Redis keys have a TTL; absence of heartbeat refresh causes expiration, signaling the Presence Service to set status offline."
    },
    {
      "question": "Which component decides which WebSocket server should receive a message for an online user?",
      "options": [
        "Chat Service",
        "Kafka broker",
        "Connection Registry (Redis)",
        "Presence Service"
      ],
      "answer": 2,
      "explanation": "Redis holds the mapping user_id → ws_server_id; Chat Service queries this registry to route messages correctly."
    }
  ]
}
\`\`\``,
    },
    {
      id: "sd-chat-3",
      slug: "chat-system-message-delivery-deep-dive",
      title: "Deep Dive: Message Delivery",
      content: `# Design a Chat System — Deep Dive: Message Delivery

Reliable, ordered message delivery is the core promise of a chat system. Let us examine the hard problems.

## Message Ordering

Users expect messages in a conversation to appear in the order they were sent. In a distributed system, this is non-trivial.

**Challenge:** Two users send messages at nearly the same time. Each message arrives at a different WebSocket server. Server clocks may differ by milliseconds.

\`\`\`concept
{
  "title": "Server-Assigned Sequential IDs",
  "variant": "mental-model",
  "content": "Instead of trusting client clocks, the chat service assigns a monotonically increasing ID within each conversation. This ID acts as a single source of truth for ordering, ensuring causal consistency even when messages arrive at different servers or experience network delays."
}
\`\`\`

**Solution — Server-assigned sequential IDs:**
1. When the chat service receives a message, it assigns a **monotonically increasing ID** within that conversation.
2. Use a **Snowflake-style ID generator**: timestamp (ms) + machine ID + sequence number. This guarantees uniqueness and approximate ordering.
3. Clients display messages sorted by this ID, not by their local clock.

\`\`\`algoviz
{
  "title": "Snowflake ID Collision-Free Assignment",
  "type": "array",
  "data": [1625097600000, 1, 42, 0],
  "frames": [
    { "highlight": [0], "label": "41-bit timestamp (ms since epoch)" },
    { "highlight": [1], "label": "10-bit machine ID (max 1024 servers)" },
    { "highlight": [2], "label": "12-bit sequence (4096 IDs/ms per server)" },
    { "highlight": [3], "label": "Final 64-bit integer: 162509760000100042" }
  ],
  "speed": 1000
}
\`\`\`

**Within a single conversation:** Messages from the same sender are trivially ordered (the sender sends them sequentially). Messages from different senders are ordered by the server-assigned ID. This provides **causal ordering** within a conversation.

## Delivery Guarantees

A message can be in one of three states:

\`\`\`
Sent        ──▶  Server received and persisted (✓)
Delivered   ──▶  Recipient's device received it (✓✓)
Read        ──▶  Recipient opened the conversation (✓✓ blue)
\`\`\`

### Ensuring "Sent" (At-Least-Once to Server)

\`\`\`steps
{
  "title": "At-Least-Once Delivery to Server",
  "steps": [
    {
      "title": "Client sends message",
      "content": "WebSocket frame carries the message plus a client-generated UUID idempotency key."
    },
    {
      "title": "Server persists & ACKs",
      "content": "Message is written to DB with the idempotency key; server returns the server-assigned message_id."
    },
    {
      "title": "Timeout & retry",
      "content": "If no ACK within T ms, client re-sends the same frame with the same UUID. Server deduplicates."
    }
  ]
}
\`\`\`

### Ensuring "Delivered" (At-Least-Once to Recipient)
1. Server pushes message to recipient's WebSocket connection.
2. Recipient's client sends a **delivery ACK** back.
3. If no delivery ACK within a timeout, the server retries.
4. If the recipient is offline, the message waits in the database. On reconnection, the client fetches all undelivered messages.

### Offline Message Delivery

When a user comes back online:
1. Client sends its **last received message_id** for each conversation.
2. Server returns all messages with IDs greater than the last received.
3. This ensures no messages are missed, even if the user was offline for days.

\`\`\`trace
{
  "title": "Offline Sync Trace",
  "language": "python",
  "code": "def sync_on_reconnect(user_id, conv_id, last_id):\\n    # client → server\\n    undelivered = db.query('''\\n        SELECT * FROM messages\\n        WHERE conversation_id = ? AND message_id > ?\\n        ORDER BY message_id ASC\\n    ''', conv_id, last_id)\\n    for msg in undelivered:\\n        push_to_websocket(user_id, msg)",
  "frames": [
    { "line": 2, "vars": {"conv_id": "X", "last_id": 4500}, "note": "Client reports last seen ID 4500" },
    { "line": 3, "vars": {"undelivered": "[4501, 4502, 4503]"}, "note": "Server frows 3 missing messages" },
    { "line": 7, "vars": {}, "note": "Each message pushed in order" }
  ],
  "speed": 900
}
\`\`\`

## Read Receipts

When user B opens a conversation with user A:
1. Client B sends a "read" event: \`{ conversation_id, last_read_message_id }\`.
2. Server updates B's read pointer for that conversation.
3. Server notifies user A that B has read up to message_id X.

**Optimization:** Do not send read receipt events for every message. Batch them — send the latest read position every few seconds or when the user scrolls.

\`\`\`callout
{
  "type": "tip",
  "title": "Batch Read Receipts",
  "content": "Sending one receipt per message can double your write QPS. Instead, throttle client events (e.g., 1 per 3 s) and always send the highest message_id the user has seen."
}
\`\`\`

## End-to-End Encryption (E2EE) Concepts

In standard chat, the server can read messages (they are encrypted in transit via TLS but decrypted at the server). E2EE ensures only the sender and recipient can read messages.

**How it works (simplified):**
1. Each user generates a public/private key pair on their device.
2. Public keys are exchanged (often via the server, verified by the users).
3. The sender encrypts each message with the recipient's public key.
4. The server stores the encrypted blob. It cannot decrypt it.
5. The recipient decrypts with their private key.

**Group chat E2EE:** More complex. Protocols like the Signal Protocol use a "sender key" that is shared with all group members. When a member leaves, the sender key is rotated.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Server-side readable",
    "code": "POST /messages\\n{\\n  \\"conversation_id\\": \\"X\\",\\n  \\"text\\": \\"Meet at 9 pm\\"\\n}\\n# Server sees plaintext; can index, moderate"
  },
  "after": {
    "label": "E2EE encrypted",
    "code": "POST /messages\\n{\\n  \\"conversation_id\\": \\"X\\",\\n  \\"ciphertext\\": \\"base64(encrypted_blob)\\"\\n}\\n# Server stores opaque blob; cannot search or filter"
  }
}
\`\`\`

**Trade-offs of E2EE:**
- Server cannot index or search messages.
- Server cannot filter spam or illegal content.
- Key management (device changes, multi-device) adds complexity.
- Message history is lost if the user loses their device and has no backup.

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why are server-assigned IDs preferred over client timestamps for ordering?",
      "options": [
        "They are shorter",
        "They remove clock-skew and provide causal ordering",
        "They compress better",
        "They are GDPR compliant"
      ],
      "answer": 1,
      "explanation": "Server clocks can differ and client clocks may be wrong; server-assigned monotonic IDs ensure a single order."
    },
    {
      "question": "What prevents duplicate messages during retries?",
      "options": [
        "TCP guarantees it",
        "Idempotency keys stored and checked by the server",
        "WebSocket auto-deduplicates",
        "UUIDs are illegal duplicates"
      ],
      "answer": 1,
      "explanation": "The server keeps a unique index on the client-generated idempotency key and ignores re-sends."
    },
    {
      "question": "Which statement is true for E2EE group chats?",
      "options": [
        "The server rotates the sender key when membership changes",
        "No keys ever change",
        "Only admins can encrypt",
        "Server still indexes plaintext"
      ],
      "answer": 0,
      "explanation": "To preserve forward secrecy, protocols like Signal rotate the group sender key whenever someone leaves."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use server-assigned sequential IDs (Snowflake-style) for message ordering within a conversation.",
    "Implement at-least-once delivery with ACKs and idempotency keys for deduplication.",
    "Offline users sync by sending their last message_id and receiving all newer messages.",
    "Read receipts should be batched to avoid excessive network traffic.",
    "E2EE prevents even the server from reading messages but complicates search, moderation, and multi-device support."
  ]
}
\`\`\``,
    },
    {
      id: "sd-chat-4",
      slug: "chat-system-scaling-tradeoffs",
      title: "Scaling & Trade-offs",
      content: `# Design a Chat System — Scaling & Trade-offs

Let us address how the system handles growth across each dimension.

## WebSocket Connection Management

At 30 million concurrent connections, WebSocket servers are the first scaling challenge.

\`\`\`concept
{
  "title": "WebSocket servers are stateful",
  "variant": "mental-model",
  "content": "Unlike stateless HTTP, every WebSocket holds an open TCP socket plus ~50 KB of server RAM. That means 30 M connections ≈ 1.5 TB of memory—impossible on one box. Plan to shard connections, not just requests."
}
\`\`\`

**Scaling strategy:**
- Each WebSocket server handles ~100K concurrent connections (tunable based on hardware).
- 300 servers at peak, behind a **Layer 4 load balancer** (L4 because WebSocket connections are long-lived; L7 would add unnecessary overhead after the initial handshake).
- Use **consistent hashing** on user_id to assign users to WebSocket servers. This makes the connection registry predictable and helps with cache locality.

**Handling server failures:**
- If a WebSocket server crashes, all its connections are dropped.
- Clients detect the disconnection and reconnect (to a potentially different server).
- The connection registry is updated automatically.
- Undelivered messages are picked up via the offline sync mechanism (fetch messages since last_message_id).

**Connection draining:** When deploying new code, gracefully drain connections from old servers by stopping new connections and waiting for existing ones to disconnect or migrate.

\`\`\`algoviz
{
  "title": "Consistent-hash placement of 8 users on 3 servers",
  "type": "array",
  "data": ["U1","U2","U3","U4","U5","U6","U7","U8"],
  "frames": [
    { "highlight": [0,3,6], "label": "Server A owns hash ring segment 0-2" },
    { "highlight": [1,4,7], "label": "Server B owns segment 3-5" },
    { "highlight": [2,5], "label": "Server C owns segment 6-7" },
    { "highlight": [0,3], "label": "Server A crashes → U1,U4 re-hash to B & C" }
  ],
  "speed": 1000
}
\`\`\`

## Message Storage at Scale

With 146 TB/year of message text, storage requires careful planning.

**Cassandra cluster design:**
- Partition by \`conversation_id\`. Conversations with high message volume (active group chats) will have larger partitions.
- Monitor partition sizes. If a group chat accumulates millions of messages, consider **bucketing** by time (e.g., partition key = \`conversation_id + month\`).

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Option A: conversation_id only",
    "code": "PRIMARY KEY ((conv_id), msg_id)\\n-- Pro: one partition per chat\\n-- Con: hot spot for 5 M-msg group"
  },
  "after": {
    "label": "Option B: conversation_id + month",
    "code": "PRIMARY KEY ((conv_id, month), msg_id)\\n-- Pro: bounded size (~400 k msgs/month)\\n-- Con: span buckets = multi-read"
  }
}
\`\`\`

**Hot vs cold storage:**
- Recent messages (last 30 days) are "hot" — frequently accessed.
- Older messages are "cold" — rarely accessed (only when a user scrolls way back).
- Use separate storage tiers: fast SSDs for hot data, cheaper HDDs or object storage for cold data.

## Group Chat Fan-Out

When a message is sent to a group of 500 members:
1. The chat service looks up all 500 member IDs.
2. For each member, it checks the connection registry.
3. Online members: route the message to their WebSocket server.
4. Offline members: store for later delivery + push notification.

**Challenge:** A message to a 500-person group requires 500 lookups and up to 500 WebSocket pushes. For very large groups with high message rates, this creates load.

**Optimization:**
- **Per-server fan-out:** Instead of routing individually, group members on the same WebSocket server and send a single "fan-out to these users" command to that server.
- **Pre-compute member-to-server mapping:** Cache which server each group member is on. Update on connection/disconnection events.

\`\`\`sysdiag
{
  "title": "Fan-out with per-server batching",
  "width": 600,
  "height": 260,
  "nodes": [
    { "id": "api", "label": "Chat API", "x": 300, "y": 130, "kind": "service" },
    { "id": "ws1", "label": "WS-1", "x": 100, "y": 50, "kind": "service" },
    { "id": "ws2", "label": "WS-2", "x": 100, "y": 210, "kind": "service" },
    { "id": "offline", "label": "Offline store", "x": 500, "y": 130, "kind": "storage" }
  ],
  "edges": [
    { "from": "api", "to": "ws1", "label": "batch: u1,u3,u7" },
    { "from": "api", "to": "ws2", "label": "batch: u2,u5" },
    { "from": "api", "to": "offline", "label": "u4,u6 → push" }
  ],
  "annotations": {
    "api": "One write, three destinations instead of 500"
  }
}
\`\`\`

## Presence at Scale

Naive approach: every user's presence status is queried every time their contacts open the app. With 100M DAU and average 200 contacts each, that is 20 billion presence lookups/day.

**Optimization strategies:**

1. **Presence is cached in Redis with TTL.** No separate "set offline" call needed — the TTL handles it.

2. **Batch presence queries.** When a user opens their chat list, fetch presence for all visible contacts in a single Redis MGET call rather than individual GETs.

3. **Subscribe to presence changes.** Instead of polling, use a pub/sub channel per user. When user A's presence changes, publish to A's channel. Only users currently viewing A's status are subscribed.

4. **Limit presence updates in large groups.** For a 500-person group, do not show individual presence indicators. Show "X members online" with a cached count updated periodically.

\`\`\`quiz
{
  "title": "Check your scaling intuition",
  "questions": [
    {
      "question": "Why is L4 (TCP) preferred over L7 (HTTP) for WebSocket load-balancing after the handshake?",
      "options": [
        "L4 provides SSL termination",
        "L4 is cheaper per packet and connection state is long-lived",
        "L4 supports HTTP/2 push",
        "L4 enables path-based routing"
      ],
      "answer": 1,
      "explanation": "Once the WebSocket upgrade is done, the traffic is opaque TCP. L4 avoids parsing HTTP headers for every frame, saving CPU and latency."
    },
    {
      "question": "You bucket a hot group chat by month. What is the main read-side cost?",
      "options": [
        "Extra disk per message",
        "Multi-partition queries when scrolling across months",
        "Hot-spot moves to the newest month",
        "Cassandra compaction lag"
      ],
      "answer": 1,
      "explanation": "A single scrollback request may now hit multiple partitions (months), requiring scatter-gather reads instead of one partition range."
    },
    {
      "question": "Per-server fan-out reduces 500 individual deliveries to 7 batches across 7 WS servers. What is the asymptotic improvement?",
      "options": [
        "O(n) → O(log n)",
        "O(n) → O(k) where k = number of servers",
        "O(n²) → O(n)",
        "No change, still O(n)"
      ],
      "answer": 1,
      "explanation": "You now do one internal RPC per server that has at least one member, independent of group size n."
    }
  ]
}
\`\`\`

## Summary of Trade-offs

| Decision | Choice | Alternative |
|----------|--------|-------------|
| Transport | WebSocket | Long polling (simpler, higher latency) |
| Message DB | Cassandra (time-series pattern) | PostgreSQL (familiar, harder to scale) |
| Ordering | Server-assigned Snowflake IDs | Client timestamps (unreliable) |
| Presence | Redis with TTL + heartbeat | Database polling (slow) |
| Group fan-out | Per-server batching | Individual routing (more overhead) |
| Encryption | TLS in transit (E2EE optional) | E2EE by default (limits server features) |

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "WebSocket servers are stateful — plan for graceful failure handling and connection draining.",
    "Partition message storage by conversation_id, with time bucketing for very active conversations.",
    "Optimize group chat fan-out by batching per WebSocket server rather than per user.",
    "Presence at scale requires TTL-based tracking, batched queries, and pub/sub for real-time updates.",
    "Separate hot (recent) and cold (historical) message storage to optimize cost and performance."
  ]
}
\`\`\``,
    },
  ],
};
