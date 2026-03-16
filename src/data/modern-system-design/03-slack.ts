import { Module } from "../types";

export const slackModule: Module = {
  id: "design-slack",
  title: "Design Slack",
  description:
    "Design a real-time messaging platform: WebSocket architecture, message delivery, presence, and typing indicators at scale.",
  lessons: [
    {
      id: "slack-requirements-scale",
      slug: "slack-requirements-scale",
      title: "Requirements & Scale",
      content: `# Design Slack: Requirements & Scale

## Functional Requirements

Let's design a real-time messaging system like Slack. Core features:

1. **1:1 messaging** — Direct messages between two users
2. **Group channels** — Channels with up to 100K members
3. **Message history** — Persistent, searchable message storage
4. **Real-time delivery** — Messages appear instantly (< 200ms)
5. **Read receipts** — Track which messages each user has read
6. **File sharing** — Upload and share files in channels
7. **Presence** — Online/offline/away status for each user
8. **Typing indicators** — Show when someone is typing

## Non-Functional Requirements

- **Availability**: 99.99% uptime (< 52 minutes downtime/year)
- **Latency**: Message delivery < 200ms for online users
- **Consistency**: Messages must appear in the same order for all users in a channel
- **Durability**: No message loss — once sent, always stored

## Scale Estimation

### Users and Messages

\`\`\`
DAU:              30 million
Messages/user/day: 40
Total messages/day: 30M × 40 = 1.2 billion

Average QPS:  1.2B / 86,400 = ~14,000 msg/s
Peak QPS:     14,000 × 3 = ~42,000 msg/s
\`\`\`

### Storage

\`\`\`
Average message size: 200 bytes (text)
Metadata overhead:    100 bytes (sender, timestamp, channel, etc.)
Total per message:    300 bytes

Daily storage:  1.2B × 300 bytes = 360 GB/day
Yearly storage: 360 GB × 365 = ~131 TB/year
With replication (3x): ~393 TB/year
\`\`\`

### Connections

\`\`\`
Concurrent online users:  10M (1/3 of DAU)
WebSocket connections:    10M persistent connections
Per connection memory:    ~10 KB
Total connection memory:  10M × 10 KB = 100 GB
\`\`\`

That is 100 GB just for holding WebSocket connections. At ~50K connections per server, we need **200 WebSocket servers**.

### Bandwidth

\`\`\`
Messages out: 42,000 msg/s × 300 bytes = 12.6 MB/s (text only)
With fanout to channel members (avg 50 recipients):
  42,000 × 50 × 300 bytes = 630 MB/s outbound
\`\`\`

## Key Challenges

| Challenge | Why It's Hard |
|-----------|--------------|
| **Connection management** | 10M persistent WebSocket connections across 200 servers |
| **Message fanout** | A message to a 100K-member channel must reach all online members |
| **Ordering** | All users in a channel must see messages in the same order |
| **Presence at scale** | 10M users' online status must be tracked and broadcast |
| **Search** | Full-text search across 131 TB/year of messages |

## High-Level Components

\`\`\`
┌─────────┐     ┌──────────┐     ┌──────────────┐
│ Clients │────▶│ API GW / │────▶│ Chat Service │
│         │◀═══▶│ WS LB    │     └──────┬───────┘
└─────────┘     └──────────┘            │
  WebSocket                    ┌────────┼────────┐
  for real-time               ▼        ▼        ▼
                        ┌──────┐ ┌──────┐ ┌────────┐
                        │Msg DB│ │Cache │ │Search  │
                        └──────┘ └──────┘ │(Elastic│
                                          │ search)│
                                          └────────┘
\`\`\`

In the next lessons, we will dive deep into each component: WebSocket architecture, message storage and delivery, and presence management.`,
    },
    {
      id: "slack-websocket-architecture",
      slug: "slack-websocket-architecture",
      title: "WebSocket Architecture",
      content: `# Slack: WebSocket Architecture

## Why WebSockets?

HTTP is request-response: the client must poll for new messages. At Slack's scale (14K msg/s), polling creates enormous waste:

\`\`\`
Polling (every 1s):    10M users × 1 req/s = 10M req/s (mostly empty)
WebSocket:             10M persistent connections, push only on new messages
\`\`\`

WebSockets provide a persistent, bidirectional channel. The server pushes messages to the client the instant they arrive.

## Connection Layer Architecture

\`\`\`
┌─────────┐     ┌──────────┐     ┌───────────────────┐
│ Client  │◀═══▶│ WS Load  │◀═══▶│  WS Gateway       │
│         │     │ Balancer │     │  Server Pool       │
└─────────┘     │ (L4, TCP │     │  (200 servers)     │
                │  sticky) │     │                    │
                └──────────┘     │  Each server holds │
                                 │  ~50K connections  │
                                 └────────┬──────────┘
                                          │
                                 ┌────────┴──────────┐
                                 │  Connection        │
                                 │  Registry          │
                                 │  (Redis)           │
                                 │                    │
                                 │  user_123 → ws-42  │
                                 │  user_456 → ws-17  │
                                 └───────────────────┘
\`\`\`

### Connection Registry

When a user connects, their WebSocket server ID is stored in Redis:

\`\`\`
Key: "conn:user_123"
Value: "ws-server-42"
TTL: 300s (refreshed via heartbeat)
\`\`\`

When a message needs to reach user_123, the system looks up which WS server holds their connection and routes the message there.

### Heartbeat Protocol

\`\`\`
Client ──ping──▶ WS Server  (every 30s)
Client ◀──pong── WS Server

If no ping for 90s → connection is dead
  → Remove from registry
  → Update presence to "offline"
\`\`\`

## Message Flow

When User A sends a message in a channel:

\`\`\`
1. User A's client ──msg──▶ WS Server 42
2. WS Server 42 ──▶ Chat Service
3. Chat Service:
   a. Validate message
   b. Assign message ID + timestamp (Snowflake ID)
   c. Write to message DB
   d. Publish to Kafka topic "channel-{id}"
4. Kafka ──▶ Fanout Service
5. Fanout Service:
   a. Lookup channel members (from cache)
   b. For each online member:
      - Lookup their WS server from connection registry
      - Send message to that WS server
   c. For offline members:
      - Increment unread count
      - Queue push notification
6. WS Server N ──msg──▶ User B's client
\`\`\`

### Detailed Flow Diagram

\`\`\`
User A          WS-42      Chat Svc     Kafka    Fanout    WS-17      User B
  │───msg────▶│          │           │        │         │           │
  │           │───validate─▶│        │        │         │           │
  │           │           │──write DB│        │         │           │
  │           │           │──publish──▶│      │         │           │
  │           │           │           │──consume─▶│     │           │
  │           │           │           │        │─lookup──│           │
  │           │           │           │        │  conn   │           │
  │           │           │           │        │──push───▶│          │
  │           │           │           │        │         │───msg────▶│
  │◀──ack─────│           │           │        │         │           │
\`\`\`

## Large Channel Fanout

A channel with 100K members creates a fanout problem. If 30K are online, one message generates 30K WebSocket pushes.

### Solution: Hierarchical Fanout

\`\`\`
                    ┌───────────┐
                    │  Kafka    │
                    │  Topic    │
                    └─────┬─────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         ┌────────┐  ┌────────┐  ┌────────┐
         │Fanout 1│  │Fanout 2│  │Fanout 3│
         │(10K    │  │(10K    │  │(10K    │
         │ users) │  │ users) │  │ users) │
         └───┬────┘  └───┬────┘  └───┬────┘
             │           │           │
          WS servers  WS servers  WS servers
\`\`\`

Partition the channel's members across multiple fanout workers. Each worker handles a subset of members, distributing the load.

## Scaling WebSocket Servers

| Metric | Per Server | 200 Servers |
|--------|-----------|-------------|
| Connections | 50K | 10M |
| Memory | 500 MB | 100 GB |
| Bandwidth | ~3 MB/s | ~600 MB/s |
| CPU (serialization) | 2 cores | 400 cores |

### Graceful Shutdown

When a WebSocket server needs to restart (deployment, scaling down):

1. Stop accepting new connections
2. Send "reconnect" message to all connected clients
3. Clients reconnect to a different server via the load balancer
4. Wait for all connections to drain (timeout: 30s)
5. Shut down

This ensures zero message loss during deployments.`,
    },
    {
      id: "slack-message-storage",
      slug: "slack-message-storage",
      title: "Message Storage & Delivery",
      content: `# Slack: Message Storage & Delivery

## Message Data Model

Each message contains:

\`\`\`
{
  "message_id":  "1710345600000-000001",   // Snowflake-style ID
  "channel_id":  "C-abc123",
  "sender_id":   "U-user456",
  "content":     "Hey team, the deploy is done!",
  "type":        "text",                   // text, file, system
  "created_at":  1710345600000,            // Unix ms
  "edited_at":   null,
  "thread_id":   null,                     // null = top-level
  "attachments": [],
  "reactions":   {"rocket": ["U-user789"]}
}
\`\`\`

### Message ID Generation

We need IDs that are:
- **Globally unique** across all servers
- **Time-ordered** — so messages sort chronologically
- **Compact** — 64-bit integer, not UUID

**Snowflake ID** (Twitter's approach):

\`\`\`
┌────────────────┬──────────┬──────────┬─────────────┐
│ Timestamp (ms) │ Datacenter│ Machine  │ Sequence    │
│ 41 bits        │ 5 bits   │ 5 bits   │ 12 bits     │
└────────────────┴──────────┴──────────┴─────────────┘
          64 bits total
\`\`\`

\`\`\`python
import time

class SnowflakeGenerator:
    EPOCH = 1609459200000  # Jan 1, 2021

    def __init__(self, datacenter_id, machine_id):
        self.datacenter_id = datacenter_id
        self.machine_id = machine_id
        self.sequence = 0
        self.last_timestamp = 0

    def generate(self):
        timestamp = int(time.time() * 1000) - self.EPOCH

        if timestamp == self.last_timestamp:
            self.sequence = (self.sequence + 1) & 0xFFF  # 12 bits
            if self.sequence == 0:
                # Wait for next millisecond
                while timestamp == self.last_timestamp:
                    timestamp = int(time.time() * 1000) - self.EPOCH
        else:
            self.sequence = 0

        self.last_timestamp = timestamp

        return (
            (timestamp << 22) |
            (self.datacenter_id << 17) |
            (self.machine_id << 12) |
            self.sequence
        )
\`\`\`

This generates 4,096 unique IDs per millisecond per machine — more than enough for Slack's 42K msg/s peak across hundreds of machines.

## Storage Architecture

### Hot Storage: Recent Messages

Recent messages (last 30 days) are accessed frequently. Store in a **sharded NoSQL database** (like Cassandra or DynamoDB).

\`\`\`
Partition key: channel_id
Sort key: message_id (time-ordered)

Channel C-abc123:
  msg-1710345600000-001: "Hey team!"
  msg-1710345600500-002: "Deploy is done"
  msg-1710345601000-003: "Nice work!"
\`\`\`

**Why this partition scheme?**
- Loading a channel's history = single partition scan (fast)
- Messages are sorted by time within the partition
- Different channels land on different shards (distributed load)

### Sharding Strategy

\`\`\`
14,000 msg/s across all channels
Target: <500 writes/s per shard

Shards needed: 14,000 / 500 = 28 shards (use 64 for headroom)

Shard assignment: hash(channel_id) % 64
\`\`\`

### Cold Storage: Archive

Messages older than 30 days are archived:

\`\`\`
Hot (Cassandra)  ──30 days──▶  Cold (S3 + Parquet)
 fast random access              cheap, bulk queries
 SSD storage                     object storage
 ~\$0.10/GB/month                 ~\$0.023/GB/month
\`\`\`

A background job compacts old messages from Cassandra into columnar files on S3. Full-text search indices (Elasticsearch) cover both hot and cold data.

## Message Delivery Guarantees

### Online Users: Push via WebSocket

Messages are pushed in real-time through the WebSocket layer. But what if the push fails?

\`\`\`
1. Client connects → receives "last_seen_message_id"
2. Server pushes new messages via WebSocket
3. Client ACKs each message batch
4. If no ACK within 5s → re-send
5. On reconnect → client sends last_seen_message_id
   → server sends all messages after that ID
\`\`\`

### Offline Users: Pull on Reconnect

When a user comes online:

\`\`\`
Client: GET /api/channels/{id}/messages?after={last_seen_id}&limit=50
Server: Returns messages since last seen, paginated
\`\`\`

The \`last_seen_id\` is stored server-side per user per channel.

## Read Receipts and Unread Counts

### Per-Channel Read Cursor

\`\`\`
Table: read_cursors
┌──────────┬────────────┬──────────────────────┐
│ user_id  │ channel_id │ last_read_message_id │
├──────────┼────────────┼──────────────────────┤
│ U-123    │ C-abc      │ msg-1710345601000    │
│ U-123    │ C-def      │ msg-1710345500000    │
└──────────┴────────────┴──────────────────────┘
\`\`\`

**Unread count** = count of messages in channel where \`message_id > last_read_message_id\`.

For performance, cache unread counts in Redis:
\`\`\`
Key: "unread:U-123:C-abc"
Value: 7
\`\`\`

Increment on new message, reset to 0 when user reads the channel.

## Search Architecture

\`\`\`
Message DB ──CDC──▶ Kafka ──▶ Elasticsearch Indexer ──▶ ES Cluster

User search query ──▶ Search Service ──▶ ES Cluster
                                              │
                                    ┌─────────┴─────────┐
                                    │ Results (msg IDs) │
                                    └─────────┬─────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │ Fetch full msgs   │
                                    │ from Message DB   │
                                    └───────────────────┘
\`\`\`

Index fields: content (full-text), sender, channel, timestamp. Elasticsearch handles the 131 TB/year volume through sharding and rolling indices (one index per month).`,
    },
    {
      id: "slack-presence-typing",
      slug: "slack-presence-typing",
      title: "Presence & Typing Indicators",
      content: `# Slack: Presence & Typing Indicators

## Presence System

Presence shows whether a user is **online**, **away**, **busy**, or **offline**. With 10M concurrent users, presence is a massive real-time coordination problem.

### Naive Approach (Does Not Scale)

Broadcast every status change to all contacts:
\`\`\`
User A goes online → notify all 500 contacts
10M users × 500 contacts = 5 billion notifications
\`\`\`

This is obviously infeasible. We need a smarter approach.

### Subscription-Based Presence

Only notify users who are actively looking at a channel or contact list containing that user.

\`\`\`
┌──────────────────────────────────────────┐
│  Presence Service                        │
│                                          │
│  Status Store (Redis):                   │
│    user_123: {status: "online",          │
│               last_active: 1710345600}   │
│                                          │
│  Subscription Store:                     │
│    channel_abc: [user_123, user_456, ...]│
│    (who is viewing this channel right now)│
└──────────────────────────────────────────┘
\`\`\`

**Flow:**
1. User A opens channel #general
2. Client subscribes to presence for all members visible on screen (~50 users)
3. Server returns current status for those 50 users
4. When any of those 50 users changes status, push update to User A
5. User A navigates away → unsubscribe

This reduces broadcasts from "all contacts" to "users on the current screen" — typically 20-50 people.

### Presence Detection

How do we know if a user is online?

\`\`\`
Heartbeat approach:
Client ──heartbeat──▶ Presence Service  (every 30s)

Rules:
- Heartbeat received → status = "online"
- No heartbeat for 60s → status = "away"
- No heartbeat for 300s → status = "offline"
- Explicit status set by user overrides automatic detection
\`\`\`

### Scale Numbers

\`\`\`
Heartbeats: 10M users × 1 heartbeat/30s = 333K heartbeats/s
Redis operations: 333K SET/s (well within Redis capacity)
Status changes: ~100K/minute (users going online/offline)
Presence queries: ~500K/s (users opening channels)
\`\`\`

### Multi-Device Presence

A user may be on phone, desktop, and web simultaneously. The aggregated status is the "most active" device:

\`\`\`python
def aggregate_presence(devices):
    """Return the most active status across all devices."""
    priority = {"online": 0, "away": 1, "offline": 2}
    statuses = [d["status"] for d in devices]
    return min(statuses, key=lambda s: priority.get(s, 3))

# Example:
# Desktop: "away", Mobile: "online" → User is "online"
\`\`\`

Store per-device status:
\`\`\`
user_123:desktop → "away"
user_123:mobile  → "online"
user_123:web     → "offline"
user_123:status  → "online"  (aggregated)
\`\`\`

## Typing Indicators

### The Problem

When User A types in #general, all 50 users currently viewing #general should see "User A is typing..." But typing events are extremely frequent — a fast typist generates events every 100ms.

### Throttled Typing Events

\`\`\`
Client-side throttle:
  - Send "typing" event at most once every 3 seconds
  - Send "stopped_typing" after 5 seconds of no keystrokes

Server-side:
  - Receive "typing" event
  - Set TTL in Redis: typing:{channel}:{user} = 1 (TTL: 6s)
  - Broadcast to channel subscribers (users viewing the channel)
  - When TTL expires, typing indicator disappears naturally
\`\`\`

### Architecture

\`\`\`
User A types     WS Server     Presence/Typing Svc    Redis       Other WS Servers
   │──typing──▶│             │                     │            │
   │           │──typing event─▶│                  │            │
   │           │             │──SET typing:ch:A───▶│            │
   │           │             │──broadcast──────────┼────────────▶│
   │           │             │                     │            │──"A is typing"──▶ Users
\`\`\`

### Scale for Typing

\`\`\`
Active typists at any moment: ~1M (10% of online users)
Typing events (throttled 1 per 3s): 1M / 3 = 333K events/s
Fanout per event: ~20 viewers per channel on average
Total pushes: 333K × 20 = 6.6M pushes/s
\`\`\`

This is significant but manageable since typing events are:
- Ephemeral (no persistence needed)
- Lossy (missing one is fine — next one comes in 3s)
- Low priority (can be dropped under load)

## Presence Architecture Summary

\`\`\`
┌─────────┐     ┌──────────┐     ┌──────────────┐     ┌────────┐
│ Clients │◀═══▶│ WS Layer │◀───▶│  Presence    │◀───▶│ Redis  │
│         │     │          │     │  Service     │     │        │
└─────────┘     └──────────┘     │              │     │ Status │
                                 │ - Heartbeat  │     │ Typing │
                                 │ - Typing     │     │ Subs   │
                                 │ - Subscribe  │     └────────┘
                                 └──────────────┘
\`\`\`

## Trade-offs

| Decision | Choice | Trade-off |
|----------|--------|-----------|
| Presence scope | Subscription-based (per-screen) | Less real-time than full broadcast, but scalable |
| Heartbeat interval | 30 seconds | Higher = less load but slower detection |
| Typing throttle | 3 seconds | Higher = less load but less responsive |
| Multi-device | Aggregate to most active | Simple but may show "online" when user is only on phone |
| Typing events | Ephemeral (no persistence) | Acceptable loss — next event comes soon |`,
    },
    {
      id: "slack-architecture-walkthrough",
      slug: "slack-architecture-walkthrough",
      title: "Architecture Walkthrough",
      content: `# Slack: Complete Architecture Walkthrough

## Full System Architecture

\`\`\`
                        ┌────────────────────────────┐
                        │       DNS / GeoDNS         │
                        └────────────┬───────────────┘
                                     │
                        ┌────────────▼───────────────┐
                        │    Global Load Balancer     │
                        │    (L4, TCP sticky)         │
                        └────────────┬───────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
    ┌─────────▼────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
    │  WS Gateway      │  │  WS Gateway      │  │  API Servers     │
    │  Cluster         │  │  Cluster         │  │  (REST)          │
    │  (real-time)     │  │  (real-time)     │  │  (history,       │
    │  200 servers     │  │  ...             │  │   search, files) │
    └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
             │                     │                      │
             └─────────┬───────────┘                      │
                       │                                  │
              ┌────────▼─────────┐               ┌───────▼────────┐
              │  Chat Service    │               │  File Service  │
              │  - validate msg  │               │  - upload      │
              │  - assign ID     │               │  - thumbnail   │
              │  - persist       │               │  - CDN upload  │
              └────────┬─────────┘               └───────┬────────┘
                       │                                  │
         ┌─────────────┼──────────────┐          ┌───────▼────────┐
         │             │              │          │  S3 / CDN      │
         ▼             ▼              ▼          └────────────────┘
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ Message  │  │  Kafka   │  │  Redis   │
   │ DB       │  │          │  │  Cluster │
   │(Cassandra│  │ (fanout) │  │ (conn    │
   │ /Vitess) │  │          │  │  registry│
   └──────────┘  └────┬─────┘  │  presence│
                      │        │  unread) │
              ┌───────▼──────┐ └──────────┘
              │ Fanout       │
              │ Service      │
              │ (per-channel │
              │  delivery)   │
              └───────┬──────┘
                      │
           ┌──────────┼──────────┐
           ▼          ▼          ▼
     WS Servers  Push Notif  Unread Counter
     (online)    (offline)   Service
\`\`\`

## Data Flow: Sending a Message

Let's trace a message from User A in #general (1000 members, 300 online):

### Step 1: Client to Server
\`\`\`
User A's client ──WebSocket──▶ WS Gateway Server 42
Payload: {channel: "C-general", content: "Ship it!", client_msg_id: "abc"}
\`\`\`

### Step 2: Validation and Persistence
\`\`\`
WS-42 ──▶ Chat Service
  ├── Validate: user is member of channel? ✓
  ├── Rate limit: user under 10 msg/s? ✓
  ├── Generate Snowflake ID: 1710345600000-042-001
  ├── Write to Cassandra (message table)
  ├── Publish to Kafka topic: "channel-C-general"
  └── Return ACK to WS-42 ──▶ User A (client_msg_id: "abc", server_msg_id: "...")
\`\`\`

### Step 3: Fanout to Online Members
\`\`\`
Kafka partition for C-general ──▶ Fanout Worker 7
  ├── Lookup channel members from cache (1000 members)
  ├── Lookup connection registry in Redis
  │     300 online → mapped to ~60 distinct WS servers
  ├── Batch messages by WS server:
  │     WS-12: [user_5, user_89, user_203, ...]
  │     WS-35: [user_17, user_44, ...]
  │     ...
  └── Send to each WS server via internal gRPC
\`\`\`

### Step 4: Delivery to Clients
\`\`\`
WS-12 receives batch ──▶ push to each user's WebSocket connection
WS-35 receives batch ──▶ push to each user's WebSocket connection
...
\`\`\`

### Step 5: Offline Handling
\`\`\`
For 700 offline members:
  ├── Increment unread counter in Redis: INCR unread:U-xxx:C-general
  ├── Check notification preferences
  └── If enabled: queue push notification (APNs/FCM)
\`\`\`

**Total time**: ~100-150ms from send to delivery for online users.

## Database Schema

### Messages Table (Cassandra)

\`\`\`
CREATE TABLE messages (
  channel_id  TEXT,
  message_id  BIGINT,        -- Snowflake ID (time-ordered)
  sender_id   TEXT,
  content     TEXT,
  msg_type    TEXT,           -- text, file, system
  thread_id   BIGINT,        -- null for top-level
  attachments LIST<TEXT>,
  edited_at   TIMESTAMP,
  PRIMARY KEY (channel_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
\`\`\`

### Channels Table (PostgreSQL)

\`\`\`
channels: id, workspace_id, name, type (public/private/dm), created_at
channel_members: channel_id, user_id, role, joined_at, last_read_msg_id
\`\`\`

## Key Trade-offs

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| Transport | WebSocket | SSE, Long polling | Bidirectional, lowest latency |
| Message DB | Cassandra | PostgreSQL | Write-heavy, partition by channel |
| Message IDs | Snowflake | UUID, auto-increment | Time-ordered, no coordination |
| Fanout | Kafka + workers | Direct push | Decoupled, handles backpressure |
| Presence | Redis + heartbeat | Database polling | Low latency, ephemeral data |
| Search | Elasticsearch | PostgreSQL full-text | Scale, relevance ranking |

## Reliability and Failure Modes

| Failure | Impact | Mitigation |
|---------|--------|------------|
| WS server crash | ~50K users disconnected | Auto-reconnect to new server; messages queued in Kafka |
| Cassandra node down | Read/write on that partition | Replication factor 3; 2 of 3 quorum |
| Kafka broker down | Fanout delayed | 3x replication; ISR (in-sync replicas) |
| Redis cluster down | Presence stale, unread wrong | Redis Sentinel failover; rebuild from DB |
| Fanout worker crash | Messages delayed | Kafka consumer group rebalances; another worker picks up |

## Scaling Summary

| Component | Scale | Strategy |
|-----------|-------|----------|
| WS Gateways | 200 servers, 10M connections | Horizontal scaling, L4 sticky LB |
| Chat Service | 42K msg/s peak | Stateless, horizontally scaled |
| Cassandra | 131 TB/year | Partition by channel_id, 64 shards |
| Kafka | 42K msg/s | 64 partitions, 3x replication |
| Redis | 1M ops/s | Cluster mode, 6 nodes |
| Elasticsearch | 131 TB/year | Rolling monthly indices |`,
    },
  ],
};
