import { Module } from "../types";

export const messagingApiModule: Module = {
  id: "design-messaging-api",
  title: "Design Messaging API",
  description:
    "Design a WhatsApp-like messaging API — message delivery, group chats, read receipts, presence indicators, and real-time transport choices.",
  lessons: [
    {
      id: "messaging-requirements",
      slug: "messaging-requirements",
      title: "Requirements & Resource Modeling",
      content: `# Design Messaging API: Requirements & Resource Modeling

Messaging APIs are unique because they demand real-time delivery, ordering guarantees, and offline support. This question tests your understanding of both API design and real-time systems.

## Step 1: Clarify Requirements

**Functional Requirements:**
- Users can send text messages to other users (1:1 chat)
- Users can create and participate in group chats
- Message delivery status: sent, delivered, read
- Read receipts (who read the message and when)
- User presence (online, offline, last seen)
- Offline message queuing (messages delivered when user comes online)

**Non-Functional Requirements:**
- Messages must be delivered in order within a conversation
- Sub-second latency for online users
- At-least-once delivery guarantee
- Support for thousands of messages per second per group
- End-to-end encryption considerations

## Step 2: Identify Resources

\`\`\`
Core Resources:
├── User             → /users
├── Conversation     → /conversations (1:1 and group)
├── Message          → /conversations/{id}/messages
├── Participant      → /conversations/{id}/participants
├── ReadReceipt      → /messages/{id}/read-receipts
├── Presence         → /users/{id}/presence
└── Attachment       → /attachments
\`\`\`

## Step 3: Resource Schemas

### Conversation

\`\`\`json
{
  "id": "conv_abc123",
  "type": "group",
  "name": "Engineering Team",
  "avatar_url": "https://cdn.example.com/groups/conv_abc123.jpg",
  "participants": [
    { "user_id": "usr_001", "role": "admin", "joined_at": "2025-01-01T00:00:00Z" },
    { "user_id": "usr_002", "role": "member", "joined_at": "2025-01-01T00:00:00Z" },
    { "user_id": "usr_003", "role": "member", "joined_at": "2025-01-02T10:00:00Z" }
  ],
  "last_message": {
    "id": "msg_xyz",
    "text": "Ship it!",
    "sender": { "id": "usr_001", "name": "Jane" },
    "sent_at": "2025-03-10T14:30:00Z"
  },
  "unread_count": 3,
  "created_at": "2025-01-01T00:00:00Z"
}
\`\`\`

### Message

\`\`\`json
{
  "id": "msg_xyz789",
  "conversation_id": "conv_abc123",
  "sender": { "id": "usr_001", "name": "Jane Doe", "avatar_url": "..." },
  "type": "text",
  "text": "Ship it!",
  "attachments": [],
  "status": "delivered",
  "client_message_id": "client_uuid_001",
  "sent_at": "2025-03-10T14:30:00Z",
  "delivered_at": "2025-03-10T14:30:01Z",
  "read_by": [
    { "user_id": "usr_002", "read_at": "2025-03-10T14:30:05Z" }
  ]
}
\`\`\`

## Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /conversations | List user's conversations |
| POST | /conversations | Create conversation (1:1 or group) |
| GET | /conversations/{id} | Get conversation details |
| GET | /conversations/{id}/messages | List messages (paginated) |
| POST | /conversations/{id}/messages | Send message |
| DELETE | /messages/{id} | Delete message |
| POST | /conversations/{id}/participants | Add participant |
| DELETE | /conversations/{id}/participants/{uid} | Remove participant |
| POST | /messages/{id}/read | Mark as read |
| GET | /users/{id}/presence | Get user presence |
| POST | /attachments/upload-url | Get pre-signed upload URL |

## Key Design Decisions

1. **Unified conversation model:** Both 1:1 and group chats use the same \`Conversation\` resource with a \`type\` field. This simplifies the API and allows 1:1 chats to be "upgraded" to groups.

2. **Client message ID:** The client generates a UUID (\`client_message_id\`) before sending. This enables idempotent message sending — if the client retries, the server deduplicates using this ID.

3. **Denormalized last_message:** The conversation object includes the most recent message. This lets the conversation list screen render without fetching messages for each conversation.

4. **Unread count:** Pre-computed per-user, per-conversation. Updated when messages arrive and when read receipts are sent.`,
    },
    {
      id: "messaging-send-receive",
      slug: "messaging-send-receive",
      title: "Message Send/Receive",
      content: `# Message Send/Receive

Message delivery is the core operation. It must handle online delivery (instant), offline delivery (queued), and retries (idempotent).

## Send a Message (REST)

\`\`\`http
POST /api/v1/conversations/conv_abc123/messages HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "text",
  "text": "Hey, are we still meeting at 3?",
  "client_message_id": "client_uuid_001"
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created

{
  "id": "msg_001",
  "conversation_id": "conv_abc123",
  "sender": { "id": "usr_001", "name": "Jane Doe" },
  "type": "text",
  "text": "Hey, are we still meeting at 3?",
  "client_message_id": "client_uuid_001",
  "status": "sent",
  "sent_at": "2025-03-10T14:30:00Z"
}
\`\`\`

### Message Types

\`\`\`json
// Text message
{ "type": "text", "text": "Hello!" }

// Image message
{ "type": "image", "attachment_id": "att_001", "caption": "Check this out" }

// File message
{ "type": "file", "attachment_id": "att_002" }

// Location message
{ "type": "location", "latitude": 37.7749, "longitude": -122.4194, "label": "Office" }

// Reply message
{ "type": "text", "text": "Agreed!", "reply_to": "msg_xyz" }
\`\`\`

## Send via WebSocket (Real-time)

For active chat sessions, messages are sent over WebSocket for lower latency:

\`\`\`json
// Client → Server
{
  "type": "message.send",
  "payload": {
    "conversation_id": "conv_abc123",
    "text": "Hey, are we still meeting at 3?",
    "client_message_id": "client_uuid_001"
  }
}

// Server → Client (acknowledgment)
{
  "type": "message.ack",
  "payload": {
    "client_message_id": "client_uuid_001",
    "server_message_id": "msg_001",
    "sent_at": "2025-03-10T14:30:00Z"
  }
}

// Server → Recipient(s)
{
  "type": "message.new",
  "payload": {
    "id": "msg_001",
    "conversation_id": "conv_abc123",
    "sender": { "id": "usr_001", "name": "Jane Doe" },
    "text": "Hey, are we still meeting at 3?",
    "sent_at": "2025-03-10T14:30:00Z"
  }
}
\`\`\`

## Message Delivery States

\`\`\`
sent → delivered → read

sent:      Server received and stored the message
delivered: Recipient's device acknowledged receipt
read:      Recipient opened the conversation
\`\`\`

### Delivery Acknowledgment

When a client receives a message (via WebSocket or push notification), it sends a delivery acknowledgment:

\`\`\`json
// Client → Server
{
  "type": "message.delivered",
  "payload": {
    "message_id": "msg_001",
    "delivered_at": "2025-03-10T14:30:01Z"
  }
}
\`\`\`

## Fetch Message History

\`\`\`http
GET /api/v1/conversations/conv_abc123/messages?limit=50&before=msg_100
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "data": [
    { "id": "msg_051", "text": "Earlier message...", "sent_at": "2025-03-10T13:00:00Z" },
    ...
    { "id": "msg_099", "text": "Recent message...", "sent_at": "2025-03-10T14:25:00Z" }
  ],
  "pagination": {
    "has_more": true,
    "oldest_cursor": "msg_051"
  }
}
\`\`\`

**Note:** Messages are paginated in reverse chronological order (newest first). The \`before\` cursor loads older messages, matching the UX pattern of scrolling up to load history.

## Delete a Message

\`\`\`http
DELETE /api/v1/messages/msg_001 HTTP/1.1
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "id": "msg_001",
  "deleted": true,
  "deleted_for": "everyone"
}
\`\`\`

**Delete options:**
- \`delete_for=me\` — hide from my view only (still visible to others)
- \`delete_for=everyone\` — replace with "This message was deleted" for all participants (only within a time window, e.g., 48 hours)

## Offline Message Queue

When a recipient is offline, messages are queued server-side:

\`\`\`
1. Server stores message in conversation
2. Server adds message to recipient's offline queue
3. When recipient connects:
   - Client sends: GET /sync/messages?since=<last_received_timestamp>
   - Server returns all queued messages across all conversations
   - Client acknowledges receipt (delivery status updates)
\`\`\`

\`\`\`http
GET /api/v1/sync/messages?since=2025-03-10T12:00:00Z

HTTP/1.1 200 OK
{
  "messages": [
    { "conversation_id": "conv_001", "messages": [ ... ] },
    { "conversation_id": "conv_002", "messages": [ ... ] }
  ],
  "sync_timestamp": "2025-03-10T14:30:00Z"
}
\`\`\`

## Idempotency via Client Message ID

The \`client_message_id\` prevents duplicate messages on retry:

\`\`\`
Client sends: { client_message_id: "uuid_001", text: "Hello" }
Network timeout — client retries
Client sends: { client_message_id: "uuid_001", text: "Hello" }
Server: "uuid_001 already processed" → returns existing msg_001
\`\`\`

This is critical for messaging because users send from unreliable mobile networks.`,
    },
    {
      id: "messaging-group-chat",
      slug: "messaging-group-chat",
      title: "Group Chat API",
      content: `# Group Chat API

Group chats add complexity: participant management, admin roles, mention notifications, and message fan-out to many users.

## Create a Group

\`\`\`http
POST /api/v1/conversations HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "group",
  "name": "Engineering Team",
  "participant_ids": ["usr_002", "usr_003", "usr_004"]
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created

{
  "id": "conv_group_001",
  "type": "group",
  "name": "Engineering Team",
  "participants": [
    { "user_id": "usr_001", "role": "admin", "joined_at": "2025-03-10T14:00:00Z" },
    { "user_id": "usr_002", "role": "member", "joined_at": "2025-03-10T14:00:00Z" },
    { "user_id": "usr_003", "role": "member", "joined_at": "2025-03-10T14:00:00Z" },
    { "user_id": "usr_004", "role": "member", "joined_at": "2025-03-10T14:00:00Z" }
  ],
  "settings": {
    "max_participants": 256,
    "only_admins_can_send": false,
    "only_admins_can_edit_info": true
  },
  "created_at": "2025-03-10T14:00:00Z"
}
\`\`\`

The creator is automatically assigned the \`admin\` role.

## Add Participants

\`\`\`http
POST /api/v1/conversations/conv_group_001/participants HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_ids": ["usr_005", "usr_006"]
}
\`\`\`

\`\`\`http
HTTP/1.1 200 OK
{
  "added": [
    { "user_id": "usr_005", "role": "member" },
    { "user_id": "usr_006", "role": "member" }
  ],
  "participant_count": 6
}
\`\`\`

**System message generated automatically:**

\`\`\`json
{
  "id": "msg_sys_001",
  "type": "system",
  "text": "Jane added Alice and Bob to the group",
  "sent_at": "2025-03-10T14:05:00Z"
}
\`\`\`

## Remove Participant

\`\`\`http
DELETE /api/v1/conversations/conv_group_001/participants/usr_005
Authorization: Bearer <token>

HTTP/1.1 200 OK
{ "removed": "usr_005", "participant_count": 5 }
\`\`\`

**Authorization rules:**
- Admins can remove any member
- Members can remove themselves (leave the group)
- The last admin cannot leave — must promote someone first

\`\`\`http
# Last admin tries to leave
DELETE /api/v1/conversations/conv_group_001/participants/usr_001
HTTP/1.1 422 Unprocessable Entity
{ "error": { "code": "LAST_ADMIN", "message": "Promote another member to admin before leaving." } }
\`\`\`

## Update Group Settings

\`\`\`http
PATCH /api/v1/conversations/conv_group_001 HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Engineering Team 2025",
  "settings": {
    "only_admins_can_send": true
  }
}
\`\`\`

## Promote / Demote

\`\`\`http
PATCH /api/v1/conversations/conv_group_001/participants/usr_002
{ "role": "admin" }

HTTP/1.1 200 OK
{ "user_id": "usr_002", "role": "admin" }
\`\`\`

## Mentions

Messages can mention specific users or everyone:

\`\`\`http
POST /api/v1/conversations/conv_group_001/messages
{
  "type": "text",
  "text": "Hey @usr_002, can you review the PR?",
  "mentions": [
    { "user_id": "usr_002", "offset": 4, "length": 8 }
  ],
  "client_message_id": "client_uuid_010"
}
\`\`\`

**Mention types:**
- \`@user\` — triggers a push notification to the specific user
- \`@everyone\` — triggers notifications to all group members

## Group Message Fan-out

When a message is sent to a group with 200 members:

\`\`\`
1. Store message once in the messages table
2. Update conversation.last_message for all participants
3. Increment unread_count for all participants except sender
4. Push real-time delivery to online participants (WebSocket)
5. Queue push notifications for offline participants
6. Trigger mention notifications if applicable
\`\`\`

This is a write amplification problem. For very large groups, these updates can be batched and processed asynchronously.

## List Conversations

\`\`\`http
GET /api/v1/conversations?limit=20
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "data": [
    {
      "id": "conv_group_001",
      "type": "group",
      "name": "Engineering Team",
      "last_message": { "text": "Ship it!", "sender": { "name": "Jane" }, "sent_at": "..." },
      "unread_count": 5
    },
    {
      "id": "conv_dm_001",
      "type": "direct",
      "participant": { "id": "usr_003", "name": "Bob", "avatar_url": "..." },
      "last_message": { "text": "See you tomorrow", "sent_at": "..." },
      "unread_count": 0
    }
  ],
  "pagination": { "next_cursor": "...", "has_more": true }
}
\`\`\`

Conversations are sorted by \`last_message.sent_at\` (most recent first). This matches the standard messaging app UX where the most active conversations appear at the top.`,
    },
    {
      id: "messaging-read-receipts",
      slug: "messaging-read-receipts",
      title: "Read Receipts & Presence",
      content: `# Read Receipts & Presence

Read receipts and presence indicators are what make a messaging app feel alive. They require real-time updates and careful privacy controls.

## Read Receipts

### Marking Messages as Read

When a user opens a conversation, the client sends a read receipt for the most recent message. This implicitly marks all earlier messages as read:

\`\`\`http
POST /api/v1/messages/msg_050/read HTTP/1.1
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "message_id": "msg_050",
  "read_at": "2025-03-10T14:35:00Z",
  "conversation_unread_count": 0
}
\`\`\`

**Key insight:** You do not need to mark each message individually. Reading message #50 means messages #1 through #50 are all read. This drastically reduces API calls.

### Real-time Read Receipt Delivery

When user A reads user B's message, user B receives a real-time notification:

\`\`\`json
// Server → User B (via WebSocket)
{
  "type": "message.read",
  "payload": {
    "conversation_id": "conv_dm_001",
    "reader": { "id": "usr_001", "name": "Jane" },
    "read_up_to": "msg_050",
    "read_at": "2025-03-10T14:35:00Z"
  }
}
\`\`\`

### Group Read Receipts

In group chats, read receipts track who has read up to which message:

\`\`\`http
GET /api/v1/messages/msg_050/read-receipts

HTTP/1.1 200 OK
{
  "message_id": "msg_050",
  "read_by": [
    { "user_id": "usr_002", "name": "Bob", "read_at": "2025-03-10T14:35:01Z" },
    { "user_id": "usr_003", "name": "Alice", "read_at": "2025-03-10T14:36:00Z" }
  ],
  "total_participants": 5,
  "total_read": 2
}
\`\`\`

The classic messaging UX:
- One gray check: sent
- Two gray checks: delivered
- Two blue checks: read (by all participants in 1:1, or displayed as a count in groups)

## Typing Indicators

### Sending Typing Status

\`\`\`json
// Client → Server (via WebSocket)
{
  "type": "typing.start",
  "payload": {
    "conversation_id": "conv_abc123"
  }
}

// After user stops typing (3 second timeout)
{
  "type": "typing.stop",
  "payload": {
    "conversation_id": "conv_abc123"
  }
}
\`\`\`

### Receiving Typing Status

\`\`\`json
// Server → Other participants
{
  "type": "typing.update",
  "payload": {
    "conversation_id": "conv_abc123",
    "user": { "id": "usr_001", "name": "Jane" },
    "is_typing": true
  }
}
\`\`\`

**Important:** Typing indicators are ephemeral — they are never stored in the database. They are fire-and-forget WebSocket events. If they are lost, the UX is slightly degraded but nothing breaks.

## User Presence

### Presence States

\`\`\`
online    → Currently connected
away      → Connected but idle (>5 minutes)
offline   → Disconnected (show "last seen" timestamp)
\`\`\`

### Get User Presence

\`\`\`http
GET /api/v1/users/usr_002/presence

HTTP/1.1 200 OK
{
  "user_id": "usr_002",
  "status": "online",
  "last_active_at": "2025-03-10T14:30:00Z"
}
\`\`\`

### Batch Presence (for contact list)

\`\`\`http
POST /api/v1/users/presence/batch
{
  "user_ids": ["usr_002", "usr_003", "usr_004", "usr_005"]
}

HTTP/1.1 200 OK
{
  "presence": {
    "usr_002": { "status": "online" },
    "usr_003": { "status": "away", "last_active_at": "2025-03-10T14:25:00Z" },
    "usr_004": { "status": "offline", "last_active_at": "2025-03-09T18:00:00Z" },
    "usr_005": { "status": "online" }
  }
}
\`\`\`

### Presence Updates via WebSocket

\`\`\`json
// Server → Client (for contacts in view)
{
  "type": "presence.update",
  "payload": {
    "user_id": "usr_003",
    "status": "online",
    "timestamp": "2025-03-10T14:36:00Z"
  }
}
\`\`\`

## Privacy Controls

Users should control their presence and read receipt visibility:

\`\`\`http
PATCH /api/v1/users/me/privacy-settings
{
  "show_read_receipts": false,
  "show_online_status": false,
  "show_last_seen": "contacts_only"
}
\`\`\`

**Privacy rules:**
- If user A hides read receipts, they also cannot see others' read receipts (reciprocal)
- \`show_last_seen\` options: \`everyone\`, \`contacts_only\`, \`nobody\`
- \`show_online_status\`: if false, always appear as offline to others

## Implementation Notes for Interviews

1. **Read receipts are batched** — mark the highest message ID as read, not each individual message
2. **Typing indicators are ephemeral** — WebSocket only, never persisted
3. **Presence uses heartbeats** — client sends a heartbeat every 30 seconds; if missed twice, status changes to offline
4. **Presence subscription** — clients subscribe to presence for visible contacts only, not the entire user base

These features are what differentiate a basic chat API from a production messaging platform.`,
    },
    {
      id: "messaging-websocket-polling",
      slug: "messaging-websocket-polling",
      title: "WebSocket vs Long Polling",
      content: `# WebSocket vs Long Polling

Messaging requires real-time delivery. The transport mechanism is a critical design decision. Let us compare the options.

## Option 1: Short Polling

The simplest approach. The client repeatedly asks "any new messages?"

\`\`\`http
# Every 2 seconds:
GET /api/v1/sync/messages?since=2025-03-10T14:30:00Z

HTTP/1.1 200 OK
{ "messages": [] }  ← Usually empty, wasted request

# 2 seconds later:
GET /api/v1/sync/messages?since=2025-03-10T14:30:00Z

HTTP/1.1 200 OK
{ "messages": [{ "id": "msg_051", "text": "Hey!", ... }] }  ← Got one!
\`\`\`

**Pros:** Dead simple, works everywhere, stateless server.
**Cons:** High latency (up to polling interval), massive wasted bandwidth, does not scale.

**Math:** 1M users polling every 2 seconds = 500K requests/second. Most return empty responses.

## Option 2: Long Polling

The server holds the connection open until there is data to return or a timeout expires.

\`\`\`http
GET /api/v1/sync/messages?since=2025-03-10T14:30:00Z&wait=30

# Server holds connection for up to 30 seconds...
# A message arrives after 5 seconds:

HTTP/1.1 200 OK
{
  "messages": [{ "id": "msg_051", "text": "Hey!", ... }],
  "sync_token": "tok_abc"
}

# Client immediately reconnects:
GET /api/v1/sync/messages?since=tok_abc&wait=30
\`\`\`

**Pros:** Near real-time delivery, much less wasted traffic, works through firewalls.
**Cons:** Connection overhead per poll, not truly real-time, server holds many open connections.

## Option 3: WebSocket

A persistent bidirectional connection. Both client and server can send messages at any time.

\`\`\`
// Connection handshake
GET /ws?token=<auth_token> HTTP/1.1
Upgrade: websocket
Connection: Upgrade

HTTP/1.1 101 Switching Protocols
\`\`\`

\`\`\`json
// Client → Server: Send message
{ "type": "message.send", "payload": { "conversation_id": "conv_001", "text": "Hi!" } }

// Server → Client: New message
{ "type": "message.new", "payload": { "id": "msg_051", "text": "Hey!" } }

// Server → Client: Typing indicator
{ "type": "typing.update", "payload": { "conversation_id": "conv_001", "user_id": "usr_002", "is_typing": true } }

// Client → Server: Read receipt
{ "type": "message.read", "payload": { "message_id": "msg_051" } }

// Server → Client: Presence update
{ "type": "presence.update", "payload": { "user_id": "usr_003", "status": "online" } }
\`\`\`

**Pros:** True real-time, bidirectional, efficient (single connection for all events), supports typing/presence natively.
**Cons:** Stateful connections (harder to scale), needs reconnection logic, some proxies/firewalls block WebSocket.

## Option 4: Server-Sent Events (SSE)

Server pushes events to the client over a long-lived HTTP connection. Unidirectional (server to client only).

\`\`\`http
GET /api/v1/events/stream HTTP/1.1
Accept: text/event-stream

HTTP/1.1 200 OK
Content-Type: text/event-stream

event: message.new
data: {"id":"msg_051","text":"Hey!","conversation_id":"conv_001"}

event: typing.update
data: {"conversation_id":"conv_001","user_id":"usr_002","is_typing":true}
\`\`\`

**Pros:** Built on HTTP (firewall-friendly), auto-reconnect, simple server implementation.
**Cons:** Unidirectional (client still uses REST for sending), limited browser connections (6 per domain).

## Comparison Table

| Feature | Short Poll | Long Poll | SSE | WebSocket |
|---------|-----------|-----------|-----|-----------|
| Latency | High | Low | Low | Lowest |
| Bandwidth | Wasteful | Moderate | Efficient | Efficient |
| Bidirectional | No | No | No | Yes |
| Complexity | Low | Low | Medium | High |
| Scaling | Hard | Moderate | Moderate | Hard |
| Firewall-friendly | Yes | Yes | Yes | Mostly |
| Browser support | Universal | Universal | Modern | Modern |

## Recommended Architecture for Messaging

\`\`\`
Primary transport:     WebSocket (real-time messaging, typing, presence)
Fallback transport:    Long Polling (when WebSocket is blocked)
Message sending:       REST API (for reliability) + WebSocket (for speed)
History loading:       REST API (paginated GET)
Push notifications:    APNs / FCM (for offline users)
\`\`\`

### Why Dual Path for Sending?

Messages are sent via both REST and WebSocket:
- **WebSocket** for instant delivery to online participants
- **REST POST** to ensure the message is durably stored (WebSocket connections can drop)

The client sends via REST, gets a server-assigned message ID, and the server fans out via WebSocket to recipients. This guarantees persistence even if WebSocket delivery fails.

In interviews, recommend WebSocket as the primary transport with long polling as a fallback, and explain why both are needed.`,
    },
    {
      id: "messaging-walkthrough",
      slug: "messaging-walkthrough",
      title: "API Walkthrough",
      content: `# Messaging API: Walkthrough & Trade-offs

Let us consolidate the messaging API and discuss the trade-offs interviewers will probe.

## Complete Endpoint Summary

| Category | Method | Endpoint | Transport |
|----------|--------|----------|-----------|
| **Conversations** | GET | /conversations | REST |
| | POST | /conversations | REST |
| | GET | /conversations/{id} | REST |
| | PATCH | /conversations/{id} | REST |
| **Messages** | GET | /conversations/{id}/messages | REST |
| | POST | /conversations/{id}/messages | REST |
| | DELETE | /messages/{id} | REST |
| **Participants** | POST | /conversations/{id}/participants | REST |
| | DELETE | /conversations/{id}/participants/{uid} | REST |
| | PATCH | /conversations/{id}/participants/{uid} | REST |
| **Read Receipts** | POST | /messages/{id}/read | REST or WS |
| | GET | /messages/{id}/read-receipts | REST |
| **Presence** | GET | /users/{id}/presence | REST |
| | POST | /users/presence/batch | REST |
| **Sync** | GET | /sync/messages | REST (long poll) |
| **Real-time** | — | /ws | WebSocket |

## WebSocket Event Types

| Event | Direction | Description |
|-------|-----------|-------------|
| message.send | Client → Server | Send a message |
| message.ack | Server → Client | Confirm message stored |
| message.new | Server → Client | New message from others |
| message.delivered | Client → Server | Delivery acknowledgment |
| message.read | Both | Read receipt |
| typing.start | Client → Server | User started typing |
| typing.stop | Client → Server | User stopped typing |
| typing.update | Server → Client | Typing status of others |
| presence.update | Server → Client | User online/offline |
| presence.heartbeat | Client → Server | Keep-alive signal |

## End-to-End Message Flow

\`\`\`
1. User A sends message:
   REST: POST /conversations/conv_001/messages { text: "Hello!" }
   → Server stores in DB → assigns msg_id → returns 201

2. Server fans out to recipients:
   → User B is online: deliver via WebSocket (message.new)
   → User C is offline: queue for sync + send push notification (APNs/FCM)

3. User B's device acknowledges:
   WS: { type: "message.delivered", message_id: "msg_001" }
   → Server updates status to "delivered"
   → Server notifies User A: { type: "message.delivered", ... }

4. User B opens conversation:
   WS: { type: "message.read", message_id: "msg_001" }
   → Server updates read receipt
   → Server notifies User A: { type: "message.read", ... }
   → User A sees blue check marks

5. User C comes online:
   GET /sync/messages?since=<last_sync_token>
   → Receives all queued messages
   → Sends delivery acks for each
\`\`\`

## Trade-offs to Discuss

### 1. Message Ordering

| Approach | Guarantee | Trade-off |
|----------|-----------|-----------|
| Server timestamp | Total order | Clock skew between servers |
| Sequence number per conversation | Total order within conversation | Must be serialized (bottleneck) |
| Lamport timestamp | Causal order | Complex, partial ordering only |

**Our choice:** Server-assigned monotonic sequence number per conversation. This guarantees strict ordering within each chat. Cross-conversation ordering does not matter for messaging.

### 2. Delivery Guarantee

**At-least-once** is the right choice for messaging. Missing a message is unacceptable. Duplicate delivery is handled by the client using \`client_message_id\` deduplication.

### 3. Read Receipts in Large Groups

For a group with 500 members, storing individual read receipts per message is expensive: 500 reads per message, thousands of messages. Options:

- **Store individual receipts** (our default for groups < 50)
- **Store only a count** (groups > 50) — "Read by 342 people" without listing names
- **No read receipts** (groups > 200) — too much write amplification

### 4. Message Storage and Retention

| Policy | Description |
|--------|-------------|
| Unlimited | Store all messages forever (WhatsApp model on device, Signal model with disappearing) |
| Time-based | Delete messages older than N days (enterprise compliance) |
| Count-based | Keep last N messages per conversation |
| Ephemeral | Messages auto-delete after being read (Snapchat model) |

**Our choice:** Unlimited server-side storage with optional per-conversation ephemeral mode.

### 5. End-to-End Encryption Impact on API

With E2E encryption, the server cannot read message content. This affects:
- **Search:** Server-side search is impossible; must be done client-side
- **Push notification preview:** Cannot show message text in notifications
- **Content moderation:** Cannot scan for spam/abuse on the server

The API design remains the same, but the \`text\` field contains ciphertext instead of plaintext.

## What Makes This a Strong Answer

1. **Dual transport** — REST for reliability, WebSocket for real-time
2. **Client message ID** — idempotent message sending
3. **Read receipt batching** — mark highest message, not each individually
4. **Presence heartbeats** — simple, predictable online detection
5. **Privacy controls** — read receipts and presence are configurable
6. **Offline sync** — no messages lost when device is disconnected
7. **Group fan-out awareness** — understanding the write amplification problem`,
    },
  ],
};
