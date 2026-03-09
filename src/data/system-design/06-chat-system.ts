import { Module } from "../types";

export const chatSystemModule: Module = {
  id: "sd-chat-system",
  title: "Design a Chat System",
  description:
    "Design a real-time messaging platform — WebSocket connections, message delivery, presence, and group chat.",
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

**Key numbers:**

| Metric | Value |
|--------|-------|
| DAU | 100 million |
| Messages/second | ~46,000 |
| Text storage/day | 400 GB |
| Peak concurrent connections | 30 million |
| WebSocket servers needed | ~300 |
| Message storage/year | ~146 TB |

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

## Key Takeaways

- Chat systems require persistent, bidirectional connections — WebSockets are the standard choice.
- The main scaling challenges are: managing millions of concurrent connections, ensuring message ordering, and delivering messages to offline users.
- Text storage is moderate (~146 TB/year); media storage can be much larger.
- Connection state (which user is connected to which server) is a critical piece of metadata.
`,
    },
    {
      id: "sd-chat-2",
      slug: "chat-system-high-level-design",
      title: "High-Level Design",
      content: `# Design a Chat System — High-Level Design

Let us design the core architecture for real-time messaging.

## Architecture Overview

\`\`\`
  ┌──────────┐        ┌──────────┐
  │ Client A │        │ Client B │
  └────┬─────┘        └────┬─────┘
       │ WebSocket         │ WebSocket
       ▼                   ▼
  ┌─────────┐         ┌─────────┐
  │  WS     │         │  WS     │
  │ Server 1│         │ Server 2│
  └────┬────┘         └────┬────┘
       │                   │
       ▼                   ▼
  ┌────────────────────────────┐
  │       Message Queue        │
  │        (Kafka)             │
  └────────────┬───────────────┘
               │
          ┌────┼────┐
          ▼         ▼
  ┌────────────┐ ┌──────────┐
  │   Chat     │ │ Presence │
  │  Service   │ │ Service  │
  └─────┬──────┘ └────┬─────┘
        │              │
        ▼              ▼
  ┌────────────┐ ┌──────────┐
  │ Message DB │ │ Presence │
  │ (Cassandra)│ │  Cache   │
  └────────────┘ │ (Redis)  │
                 └──────────┘
\`\`\`

## Component Walkthrough

### WebSocket Servers
- Accept and maintain persistent WebSocket connections from clients.
- **Stateful:** Each server knows which users are connected to it.
- A **connection registry** (in Redis) maps \`user_id → ws_server_id\` so the system knows where to route messages.

### Connection Registry

\`\`\`
Redis:
  user:1001 → ws-server-3
  user:1002 → ws-server-1
  user:1003 → ws-server-3
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

### Group Chat

For group messages, the flow is:
1. Sender's WebSocket server receives the message.
2. Chat service looks up the group's member list.
3. For each member: check the connection registry and route the message to their WebSocket server.
4. Write the message once to the message DB (partitioned by group conversation_id).

## Message Flow (1-on-1)

\`\`\`
1. Client A sends message via WebSocket to WS Server 1
2. WS Server 1 → Chat Service:
   a. Persist message to Message DB
   b. Generate message_id and timestamp
3. Chat Service looks up Client B in connection registry
4. If online: Route to WS Server 2 → push to Client B
5. If offline: Queue push notification
6. Return acknowledgment to Client A
\`\`\`

## Key Takeaways

- WebSocket servers maintain persistent connections; a connection registry in Redis maps users to servers.
- Messages are persisted in a time-series-friendly database (Cassandra) partitioned by conversation.
- Presence is tracked with TTL-based keys in Redis, refreshed by client heartbeats.
- Group chat multiplexes a single message to all group members via the connection registry.
- Offline users receive messages via push notifications and retrieve history on reconnection.
`,
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

**Solution — Server-assigned sequential IDs:**
1. When the chat service receives a message, it assigns a **monotonically increasing ID** within that conversation.
2. Use a **Snowflake-style ID generator**: timestamp (ms) + machine ID + sequence number. This guarantees uniqueness and approximate ordering.
3. Clients display messages sorted by this ID, not by their local clock.

**Within a single conversation:** Messages from the same sender are trivially ordered (the sender sends them sequentially). Messages from different senders are ordered by the server-assigned ID. This provides **causal ordering** within a conversation.

## Delivery Guarantees

A message can be in one of three states:

\`\`\`
Sent        ──▶  Server received and persisted (✓)
Delivered   ──▶  Recipient's device received it (✓✓)
Read        ──▶  Recipient opened the conversation (✓✓ blue)
\`\`\`

### Ensuring "Sent" (At-Least-Once to Server)
1. Client sends message via WebSocket.
2. Server persists to database.
3. Server sends an **acknowledgment** (ACK) back to the client with the server-assigned message_id.
4. If the client does not receive an ACK within a timeout, it **retries** with a client-generated idempotency key (UUID).
5. The server deduplicates using the idempotency key.

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

\`\`\`
Client reconnects:
  "My last message_id for conversation X is 4500"
       │
       ▼
  Server queries: SELECT * FROM messages
                  WHERE conversation_id = X
                  AND message_id > 4500
                  ORDER BY message_id ASC
       │
       ▼
  Returns messages 4501, 4502, 4503, ...
\`\`\`

## Read Receipts

When user B opens a conversation with user A:
1. Client B sends a "read" event: \`{ conversation_id, last_read_message_id }\`.
2. Server updates B's read pointer for that conversation.
3. Server notifies user A that B has read up to message_id X.

**Optimization:** Do not send read receipt events for every message. Batch them — send the latest read position every few seconds or when the user scrolls.

## End-to-End Encryption (E2EE) Concepts

In standard chat, the server can read messages (they are encrypted in transit via TLS but decrypted at the server). E2EE ensures only the sender and recipient can read messages.

**How it works (simplified):**
1. Each user generates a public/private key pair on their device.
2. Public keys are exchanged (often via the server, verified by the users).
3. The sender encrypts each message with the recipient's public key.
4. The server stores the encrypted blob. It cannot decrypt it.
5. The recipient decrypts with their private key.

**Group chat E2EE:** More complex. Protocols like the Signal Protocol use a "sender key" that is shared with all group members. When a member leaves, the sender key is rotated.

**Trade-offs of E2EE:**
- Server cannot index or search messages.
- Server cannot filter spam or illegal content.
- Key management (device changes, multi-device) adds complexity.
- Message history is lost if the user loses their device and has no backup.

## Key Takeaways

- Use server-assigned sequential IDs (Snowflake-style) for message ordering within a conversation.
- Implement at-least-once delivery with ACKs and idempotency keys for deduplication.
- Offline users sync by sending their last message_id and receiving all newer messages.
- Read receipts should be batched to avoid excessive network traffic.
- E2EE prevents even the server from reading messages but complicates search, moderation, and multi-device support.
`,
    },
    {
      id: "sd-chat-4",
      slug: "chat-system-scaling-tradeoffs",
      title: "Scaling & Trade-offs",
      content: `# Design a Chat System — Scaling & Trade-offs

Let us address how the system handles growth across each dimension.

## WebSocket Connection Management

At 30 million concurrent connections, WebSocket servers are the first scaling challenge.

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

## Message Storage at Scale

With 146 TB/year of message text, storage requires careful planning.

**Cassandra cluster design:**
- Partition by \`conversation_id\`. Conversations with high message volume (active group chats) will have larger partitions.
- Monitor partition sizes. If a group chat accumulates millions of messages, consider **bucketing** by time (e.g., partition key = \`conversation_id + month\`).

\`\`\`
Partition key options:

Option A: conversation_id
  Pro: Simple. All messages in one place.
  Con: Very active chats create hot/large partitions.

Option B: conversation_id + time_bucket
  Pro: Bounded partition size.
  Con: Queries spanning buckets need multiple reads.
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

\`\`\`
Group message fan-out (optimized):

Message ──▶ Chat Service
              │
              ├── WS Server 1: [user 101, user 203, user 450]
              ├── WS Server 2: [user 102, user 305]
              ├── WS Server 3: [user 501, user 602, user 703, user 804]
              └── Offline: [user 999] → push notification
\`\`\`

## Presence at Scale

Naive approach: every user's presence status is queried every time their contacts open the app. With 100M DAU and average 200 contacts each, that is 20 billion presence lookups/day.

**Optimization strategies:**

1. **Presence is cached in Redis with TTL.** No separate "set offline" call needed — the TTL handles it.

2. **Batch presence queries.** When a user opens their chat list, fetch presence for all visible contacts in a single Redis MGET call rather than individual GETs.

3. **Subscribe to presence changes.** Instead of polling, use a pub/sub channel per user. When user A's presence changes, publish to A's channel. Only users currently viewing A's status are subscribed.

4. **Limit presence updates in large groups.** For a 500-person group, do not show individual presence indicators. Show "X members online" with a cached count updated periodically.

## Summary of Trade-offs

| Decision | Choice | Alternative |
|----------|--------|-------------|
| Transport | WebSocket | Long polling (simpler, higher latency) |
| Message DB | Cassandra (time-series pattern) | PostgreSQL (familiar, harder to scale) |
| Ordering | Server-assigned Snowflake IDs | Client timestamps (unreliable) |
| Presence | Redis with TTL + heartbeat | Database polling (slow) |
| Group fan-out | Per-server batching | Individual routing (more overhead) |
| Encryption | TLS in transit (E2EE optional) | E2EE by default (limits server features) |

## Key Takeaways

- WebSocket servers are stateful — plan for graceful failure handling and connection draining.
- Partition message storage by conversation_id, with time bucketing for very active conversations.
- Optimize group chat fan-out by batching per WebSocket server rather than per user.
- Presence at scale requires TTL-based tracking, batched queries, and pub/sub for real-time updates.
- Separate hot (recent) and cold (historical) message storage to optimize cost and performance.
`,
    },
  ],
};
