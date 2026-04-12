import { Module } from "../types";

export const messagingApiModule: Module = {
  id: "design-messaging-api",
  title: "Design Messaging API",
  description: "Design a WhatsApp-like messaging API — message delivery, group chats, read receipts, presence indicators, and real-time transport choices.",
  lessons: [
    {
      id: "messaging-requirements",
      slug: "messaging-requirements",
      title: "Requirements & Resource Modeling",
      content: `# Design Messaging API: Requirements & Resource Modeling

Messaging APIs are unique because they demand real-time delivery, ordering guarantees, and offline support simultaneously. Before writing a single endpoint, a strong candidate asks clarifying questions and builds a shared vocabulary of resources. This lesson walks through both.

---

## Step 1: Clarify Requirements

In a real interview, the interviewer's prompt — "Design WhatsApp" — leaves almost everything undefined. Your first move is to narrow scope by asking targeted questions.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Functional",
      "icon": "⚙️",
      "content": "**What the system must do:**\\n\\n- Send text messages between users (1:1 chat)\\n- Create and participate in group chats\\n- Track delivery status: \`sent\` → \`delivered\` → \`read\`\\n- Show read receipts (who read, when)\\n- Show user presence: online, offline, last seen\\n- Queue messages for offline users and deliver when they reconnect\\n- Upload and attach media (images, video, documents)\\n\\n**Scope clarification questions to ask:**\\n- What is the maximum group size? (WhatsApp caps at 256 members — a design anchor)\\n- Do we need multi-device support?\\n- Voice/video calls, or text only?\\n- End-to-end encryption?"
    },
    {
      "label": "Non-Functional",
      "icon": "📊",
      "content": "**How the system must perform:**\\n\\n| Requirement | Target | Why It Matters |\\n|-------------|--------|----------------|\\n| Latency | < 100ms for online users | Users notice delays above this threshold |\\n| Availability | 99.99% uptime | ~52 minutes downtime/year |\\n| Consistency | Eventual (not strong) | Availability takes priority; clients reconcile |\\n| Ordering | Guaranteed within a conversation | Out-of-order messages destroy UX |\\n| Delivery | At-least-once | Prefer duplicates over lost messages |\\n| Scale | 50–100B messages/day, 100M concurrent connections | WhatsApp-class numbers |\\n\\n**The key trade-off:** Messaging apps choose **availability over consistency**. If the network partitions, messages are still delivered; inconsistencies are resolved client-side."
    },
    {
      "label": "Out of Scope",
      "icon": "🚫",
      "content": "Calling out what you are **not** designing shows interviewer maturity:\\n\\n- Voice/video calls (separate WebRTC service)\\n- End-to-end encryption key exchange (separate PKI layer)\\n- Push notification delivery (delegates to APNs/FCM)\\n- Content moderation pipeline\\n- User discovery / phone-number registration\\n\\nThis scoping prevents you from drowning in complexity before you've designed the core API."
    }
  ]
}
\`\`\`

---

## Step 2: Identify Resources

\`\`\`concept
{
  "title": "REST Resources = Nouns, Not Verbs",
  "variant": "rule",
  "content": "Every REST resource is a noun that can be created, read, updated, or deleted. In a messaging API the temptation is to think in actions ('sendMessage', 'markRead') — resist it. Model the entities first: Conversation, Message, Participant, Presence. The verbs emerge naturally from HTTP methods applied to these nouns."
}
\`\`\`

Map the domain to a resource hierarchy:

\`\`\`sysdiag
{
  "title": "Messaging API Resource Hierarchy",
  "width": 680,
  "height": 380,
  "nodes": [
    { "id": "user",         "label": "User\\n/users/{id}",                    "x": 100, "y": 180, "kind": "entity" },
    { "id": "conv",         "label": "Conversation\\n/conversations/{id}",    "x": 320, "y": 80,  "kind": "service" },
    { "id": "msg",          "label": "Message\\n/conversations/{id}/messages","x": 320, "y": 200, "kind": "service" },
    { "id": "participant",  "label": "Participant\\n/conversations/{id}/participants", "x": 540, "y": 80,  "kind": "entity" },
    { "id": "receipt",      "label": "ReadReceipt\\n/messages/{id}/read",     "x": 540, "y": 200, "kind": "entity" },
    { "id": "presence",     "label": "Presence\\n/users/{id}/presence",       "x": 100, "y": 310, "kind": "entity" },
    { "id": "attachment",   "label": "Attachment\\n/attachments",             "x": 320, "y": 320, "kind": "entity" }
  ],
  "edges": [
    { "from": "user",        "to": "conv",        "label": "belongs to" },
    { "from": "conv",        "to": "msg",         "label": "contains" },
    { "from": "conv",        "to": "participant",  "label": "has" },
    { "from": "msg",         "to": "receipt",      "label": "tracks" },
    { "from": "msg",         "to": "attachment",   "label": "may have" },
    { "from": "user",        "to": "presence",     "label": "has" }
  ],
  "annotations": {
    "conv": "Unified model for both 1:1 and group chats — distinguished by a \`type\` field. This is the central resource everything else hangs off.",
    "msg":  "Scoped under conversation — a message has no meaning outside its conversation context.",
    "presence": "Read-heavy, low-write. Best served from an in-memory store (Redis) rather than the primary database."
  }
}
\`\`\`

---

## Step 3: Resource Schemas

The two schemas you'll be asked to define on a whiteboard are \`Conversation\` and \`Message\`.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Conversation",
      "icon": "💬",
      "content": "\`\`\`json\\n{\\n  \\"id\\": \\"conv_abc123\\",\\n  \\"type\\": \\"group\\",\\n  \\"name\\": \\"Engineering Team\\",\\n  \\"avatar_url\\": \\"https://cdn.example.com/groups/conv_abc123.jpg\\",\\n  \\"participants\\": [\\n    { \\"user_id\\": \\"usr_001\\", \\"role\\": \\"admin\\", \\"joined_at\\": \\"2025-01-01T00:00:00Z\\" },\\n    { \\"user_id\\": \\"usr_002\\", \\"role\\": \\"member\\", \\"joined_at\\": \\"2025-01-01T00:00:00Z\\" }\\n  ],\\n  \\"last_message\\": {\\n    \\"id\\": \\"msg_xyz\\",\\n    \\"text\\": \\"Ship it!\\",\\n    \\"sender\\": { \\"id\\": \\"usr_001\\", \\"name\\": \\"Jane\\" },\\n    \\"sent_at\\": \\"2025-03-10T14:30:00Z\\"\\n  },\\n  \\"unread_count\\": 3,\\n  \\"created_at\\": \\"2025-01-01T00:00:00Z\\"\\n}\\n\`\`\`\\n\\n**Notable fields:**\\n- \`type\`: \`\\"direct\\"\` or \`\\"group\\"\` — same schema, different behavior\\n- \`last_message\`: **denormalized** for cheap conversation list rendering\\n- \`unread_count\`: **pre-computed** per user — never calculated at read time"
    },
    {
      "label": "Message",
      "icon": "📨",
      "content": "\`\`\`json\\n{\\n  \\"id\\": \\"msg_xyz789\\",\\n  \\"conversation_id\\": \\"conv_abc123\\",\\n  \\"sender\\": { \\"id\\": \\"usr_001\\", \\"name\\": \\"Jane Doe\\", \\"avatar_url\\": \\"...\\" },\\n  \\"type\\": \\"text\\",\\n  \\"text\\": \\"Ship it!\\",\\n  \\"attachments\\": [],\\n  \\"status\\": \\"delivered\\",\\n  \\"client_message_id\\": \\"client_uuid_001\\",\\n  \\"sent_at\\": \\"2025-03-10T14:30:00Z\\",\\n  \\"delivered_at\\": \\"2025-03-10T14:30:01Z\\",\\n  \\"read_by\\": [\\n    { \\"user_id\\": \\"usr_002\\", \\"read_at\\": \\"2025-03-10T14:30:05Z\\" }\\n  ]\\n}\\n\`\`\`\\n\\n**Notable fields:**\\n- \`client_message_id\`: Client-generated UUID — enables **idempotent sends** (safe retries)\\n- \`status\`: Aggregate status for sender UI (\`sent\` / \`delivered\` / \`read\`)\\n- \`read_by\`: Array for group read receipts — shows *who* read, not just *that* it was read"
    }
  ]
}
\`\`\`

---

## Step 4: Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| \`GET\` | \`/conversations\` | List user's conversations (paginated) |
| \`POST\` | \`/conversations\` | Create conversation (1:1 or group) |
| \`GET\` | \`/conversations/{id}\` | Get conversation details |
| \`GET\` | \`/conversations/{id}/messages\` | List messages (paginated, cursor-based) |
| \`POST\` | \`/conversations/{id}/messages\` | Send a message |
| \`DELETE\` | \`/messages/{id}\` | Delete (soft-delete) a message |
| \`POST\` | \`/conversations/{id}/participants\` | Add participant to group |
| \`DELETE\` | \`/conversations/{id}/participants/{uid}\` | Remove participant from group |
| \`POST\` | \`/messages/{id}/read\` | Mark message as read |
| \`GET\` | \`/users/{id}/presence\` | Get user presence status |
| \`POST\` | \`/attachments/upload-url\` | Get pre-signed URL for media upload |

\`\`\`callout
{
  "type": "tip",
  "title": "Cursor-based pagination for messages",
  "content": "Message lists must use **cursor-based** (keyset) pagination, not offset-based. With offset pagination, inserting a new message while the user is scrolling shifts all offsets and causes duplicate/skipped messages. Use a \`before_id\` or \`before_timestamp\` cursor instead:\\n\\n\`GET /conversations/{id}/messages?before=msg_xyz789&limit=50\`"
}
\`\`\`

---

## Step 5: Key Design Decisions

These are the decisions interviewers probe — be ready to defend each one.

\`\`\`concept
{
  "title": "Unified Conversation Model",
  "variant": "mental-model",
  "content": "Both 1:1 and group chats use the same \`Conversation\` resource — differentiated only by \`type: \\"direct\\"\` vs \`type: \\"group\\"\`. This means one set of endpoints, one data model, and one code path on the server. It also makes upgrading a 1:1 chat to a group trivial: change the type and add participants. The alternative — separate \`/direct-messages\` and \`/groups\` hierarchies — doubles your API surface for no gain."
}
\`\`\`

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "No client_message_id (risky)",
    "code": "POST /conversations/conv_abc/messages\\n{\\n  \\"text\\": \\"Ship it!\\"\\n}\\n\\n// Network drops. Client retries.\\n// Result: message sent TWICE.\\n// No way for server to detect the duplicate."
  },
  "after": {
    "label": "With client_message_id (safe retry)",
    "code": "POST /conversations/conv_abc/messages\\n{\\n  \\"text\\": \\"Ship it!\\",\\n  \\"client_message_id\\": \\"3f7a2c1d-...\\"\\n}\\n\\n// Network drops. Client retries with SAME UUID.\\n// Server looks up client_message_id — already exists.\\n// Returns the original message. No duplicate."
  }
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "Why denormalize last_message and unread_count?",
  "content": "The conversation list screen is the **hottest read path** in any messaging app. Without denormalization, rendering 20 conversations would require 20 separate queries for the latest message plus 20 aggregation queries for unread counts — 40 database hits per screen load.\\n\\nWith \`last_message\` and \`unread_count\` embedded in the \`Conversation\` document, that collapses to a single query. The trade-off: you must keep these fields consistent when messages are sent and when read receipts arrive. This is a deliberate write-time cost to save read-time cost — a classic **CQRS-adjacent** decision."
}
\`\`\`

---

## Check Your Understanding

\`\`\`quiz
{
  "title": "Requirements & Resource Modeling",
  "questions": [
    {
      "question": "A client sends a message, the network drops before it receives a response, and it retries. Which field prevents a duplicate message from being stored?",
      "options": [
        "message.id (server-generated)",
        "message.sent_at (timestamp)",
        "message.client_message_id (client-generated UUID)",
        "message.conversation_id"
      ],
      "answer": 2,
      "explanation": "\`client_message_id\` is generated by the client before the first attempt and reused on all retries. The server can look it up and return the existing message rather than creating a duplicate. Server-generated \`id\` doesn't exist until the server creates the record, and timestamps are not unique enough."
    },
    {
      "question": "Why does a WhatsApp-like system prioritize availability over consistency?",
      "options": [
        "Consistency is technically impossible at this scale",
        "Messages are not sensitive enough to need consistency",
        "Users can tolerate brief inconsistencies but not failed sends during network partitions",
        "Availability is cheaper to implement than consistency"
      ],
      "answer": 2,
      "explanation": "By the CAP theorem, a distributed system can't guarantee both consistency and availability during a partition. Messaging apps choose availability: a message reaching the recipient slightly out of order is better than failing to deliver it at all. Clients reconcile ordering once connectivity is restored."
    },
    {
      "question": "What is the primary reason \`unread_count\` is stored as a pre-computed field on the Conversation resource?",
      "options": [
        "Real-time counting is not technically possible",
        "It avoids expensive aggregation queries on the hot read path",
        "SQL databases cannot count rows efficiently",
        "It simplifies client-side code"
      ],
      "answer": 1,
      "explanation": "The conversation list is the most frequently rendered screen in a messaging app. Computing \`unread_count\` on the fly for each conversation requires a COUNT query per conversation — devastating at scale. Pre-computing it at write time (when a message arrives or a read receipt is sent) keeps the read path to a single indexed lookup."
    },
    {
      "question": "A 1:1 chat between Alice and Bob needs to be turned into a group chat. Which API design makes this operation simplest?",
      "options": [
        "Separate /direct-messages and /groups endpoints",
        "A unified Conversation resource with a \`type\` field",
        "A migration endpoint that copies all messages to a new resource",
        "This operation is not supported in REST APIs"
      ],
      "answer": 1,
      "explanation": "With a unified Conversation model, upgrading from 1:1 to group only requires changing \`type\` from \`direct\` to \`group\` and adding participants — same resource, same endpoint, same message history. Separate endpoints would require data migration and break existing references."
    },
    {
      "question": "For paginating through a conversation's message history, which pagination strategy is most appropriate and why?",
      "options": [
        "Offset-based: simple to implement and understand",
        "Page-number-based: familiar to users from web interfaces",
        "Cursor-based: stable across concurrent inserts",
        "Random-access: allows jumping to any message"
      ],
      "answer": 2,
      "explanation": "Messages are inserted continuously while the user scrolls. Offset-based pagination (\`?page=3&limit=20\`) breaks when new messages are inserted: all offsets shift, causing the client to see duplicate or skipped messages. Cursor-based pagination uses an anchor message ID or timestamp (\`?before=msg_xyz\`), which is stable regardless of concurrent inserts."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Always start by separating functional requirements (what the system does) from non-functional requirements (how it performs) — interviewers evaluate both.",
    "Messaging APIs favor availability over consistency: at-least-once delivery and eventual consistency are the right defaults.",
    "A unified Conversation model for 1:1 and group chats simplifies the API surface and enables seamless upgrades.",
    "\`client_message_id\` (client-generated UUID) is the standard pattern for idempotent message sends — essential for reliable retry behavior on mobile networks.",
    "Denormalize \`last_message\` and \`unread_count\` into the Conversation response to keep the conversation list screen fast — pay at write time, not read time.",
    "Use cursor-based (keyset) pagination for message history — offset pagination breaks when new messages are inserted concurrently."
  ]
}
\`\`\``,
    },
    {
      id: "messaging-send-receive",
      slug: "messaging-send-receive",
      title: "Message Send/Receive",
      content: `# Message Send/Receive

Message delivery is the core operation of any messaging API. It must handle three scenarios seamlessly: **online delivery** (instant, real-time), **offline delivery** (queued until the user reconnects), and **retries** (idempotent, so network blips don't create duplicate messages).

\`\`\`concept
{
  "title": "Delivery Semantics",
  "variant": "rule",
  "content": "Every messaging API implicitly picks a delivery guarantee: at-most-once (fast, may lose), at-least-once (safe, may duplicate), or exactly-once (correct, most expensive). WhatsApp-style apps use **at-least-once** delivery combined with **idempotent deduplication** via a client-generated message ID — this achieves correctness without the full cost of exactly-once coordination."
}
\`\`\`

---

## Send a Message

\`\`\`tabs
{
  "tabs": [
    {
      "label": "REST",
      "icon": "🔗",
      "content": "Use REST for fire-and-forget sends, background uploads, or when a WebSocket isn't open yet.\\n\\n\`\`\`http\\nPOST /api/v1/conversations/conv_abc123/messages HTTP/1.1\\nAuthorization: Bearer <token>\\nContent-Type: application/json\\n\\n{\\n  \\"type\\": \\"text\\",\\n  \\"text\\": \\"Hey, are we still meeting at 3?\\",\\n  \\"client_message_id\\": \\"client_uuid_001\\"\\n}\\n\`\`\`\\n\\n\`\`\`http\\nHTTP/1.1 201 Created\\n\\n{\\n  \\"id\\": \\"msg_001\\",\\n  \\"conversation_id\\": \\"conv_abc123\\",\\n  \\"sender\\": { \\"id\\": \\"usr_001\\", \\"name\\": \\"Jane Doe\\" },\\n  \\"type\\": \\"text\\",\\n  \\"text\\": \\"Hey, are we still meeting at 3?\\",\\n  \\"client_message_id\\": \\"client_uuid_001\\",\\n  \\"status\\": \\"sent\\",\\n  \\"sent_at\\": \\"2025-03-10T14:30:00Z\\"\\n}\\n\`\`\`"
    },
    {
      "label": "WebSocket",
      "icon": "⚡",
      "content": "For active chat sessions, use WebSocket for lower latency — the connection is already open, so no TCP handshake cost.\\n\\n\`\`\`json\\n// Client → Server\\n{\\n  \\"type\\": \\"message.send\\",\\n  \\"payload\\": {\\n    \\"conversation_id\\": \\"conv_abc123\\",\\n    \\"text\\": \\"Hey, are we still meeting at 3?\\",\\n    \\"client_message_id\\": \\"client_uuid_001\\"\\n  }\\n}\\n\`\`\`\\n\\n\`\`\`json\\n// Server → Sender (acknowledgment)\\n{\\n  \\"type\\": \\"message.ack\\",\\n  \\"payload\\": {\\n    \\"client_message_id\\": \\"client_uuid_001\\",\\n    \\"server_message_id\\": \\"msg_001\\",\\n    \\"sent_at\\": \\"2025-03-10T14:30:00Z\\"\\n  }\\n}\\n\`\`\`\\n\\n\`\`\`json\\n// Server → Recipient(s)\\n{\\n  \\"type\\": \\"message.new\\",\\n  \\"payload\\": {\\n    \\"id\\": \\"msg_001\\",\\n    \\"conversation_id\\": \\"conv_abc123\\",\\n    \\"sender\\": { \\"id\\": \\"usr_001\\", \\"name\\": \\"Jane Doe\\" },\\n    \\"text\\": \\"Hey, are we still meeting at 3?\\",\\n    \\"sent_at\\": \\"2025-03-10T14:30:00Z\\"\\n  }\\n}\\n\`\`\`"
    },
    {
      "label": "Message Types",
      "icon": "📎",
      "content": "The \`type\` field drives payload shape. Keep the schema extensible — new types shouldn't break old clients.\\n\\n\`\`\`json\\n// Text\\n{ \\"type\\": \\"text\\", \\"text\\": \\"Hello!\\" }\\n\\n// Image\\n{ \\"type\\": \\"image\\", \\"attachment_id\\": \\"att_001\\", \\"caption\\": \\"Check this out\\" }\\n\\n// File\\n{ \\"type\\": \\"file\\", \\"attachment_id\\": \\"att_002\\" }\\n\\n// Location\\n{ \\"type\\": \\"location\\", \\"latitude\\": 37.7749, \\"longitude\\": -122.4194, \\"label\\": \\"Office\\" }\\n\\n// Reply (thread reference)\\n{ \\"type\\": \\"text\\", \\"text\\": \\"Agreed!\\", \\"reply_to\\": \\"msg_xyz\\" }\\n\`\`\`"
    }
  ]
}
\`\`\`

---

## Message Delivery States

A message passes through three states. The transitions are driven by client acknowledgments — the server doesn't assume delivery; it waits for confirmation.

\`\`\`algoviz
{
  "title": "Message State Machine: sent → delivered → read",
  "type": "array",
  "data": ["sent", "delivered", "read"],
  "frames": [
    {
      "highlight": [0],
      "label": "Server received and persisted the message. Sender sees a single checkmark (✓).",
      "stats": { "status": "sent", "triggered_by": "POST /messages 201" }
    },
    {
      "highlight": [0, 1],
      "label": "Recipient's device connected and ACK'd receipt. Sender sees double checkmark (✓✓).",
      "stats": { "status": "delivered", "triggered_by": "message.delivered WS event" }
    },
    {
      "highlight": [0, 1, 2],
      "label": "Recipient opened the conversation. Sender sees blue double checkmark.",
      "stats": { "status": "read", "triggered_by": "message.read WS event" }
    }
  ],
  "speed": 1000
}
\`\`\`

When a client receives a message (via WebSocket push or reconnect sync), it sends a delivery acknowledgment:

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

---

## Fetch Message History

\`\`\`http
GET /api/v1/conversations/conv_abc123/messages?limit=50&before=msg_100
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "data": [
    { "id": "msg_051", "text": "Earlier message...", "sent_at": "2025-03-10T13:00:00Z" },
    { "id": "msg_099", "text": "Recent message...", "sent_at": "2025-03-10T14:25:00Z" }
  ],
  "pagination": {
    "has_more": true,
    "oldest_cursor": "msg_051"
  }
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Cursor Direction Matches UX",
  "content": "Messages paginate in **reverse chronological order** (newest first). The \`before\` cursor loads older messages — this matches the UX pattern of scrolling up to reveal history. Never paginate forward on a live conversation; use real-time push for new messages instead."
}
\`\`\`

---

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

Two deletion modes:

| Mode | Behavior |
|------|----------|
| \`delete_for=me\` | Hidden from your view only; still visible to other participants |
| \`delete_for=everyone\` | Replaced with "This message was deleted" for all; only within a time window (e.g., 48 hours) |

\`\`\`callout
{
  "type": "warning",
  "title": "Don't Hard-Delete Message Rows",
  "content": "Physically removing a message row breaks pagination cursors and read-receipt references. Instead, use a **soft delete**: set \`deleted_at\` and \`deleted_for\`, then filter in queries. The row stays; only its content is cleared for affected viewers."
}
\`\`\`

---

## Offline Message Queue

\`\`\`steps
{
  "title": "How Offline Delivery Works",
  "steps": [
    {
      "title": "Message arrives, recipient is offline",
      "content": "The server stores the message in the conversation timeline and adds it to the recipient's **offline queue** (a per-user backlog, typically backed by a database index on \`(recipient_id, delivered_at IS NULL)\`)."
    },
    {
      "title": "Recipient reconnects",
      "content": "On reconnect, the client sends a sync request:\\n\\n\`\`\`http\\nGET /api/v1/sync/messages?since=2025-03-10T12:00:00Z\\n\`\`\`\\n\\nThe server returns all queued messages grouped by conversation:\\n\\n\`\`\`json\\n{\\n  \\"messages\\": [\\n    { \\"conversation_id\\": \\"conv_001\\", \\"messages\\": [ \\"...\\" ] },\\n    { \\"conversation_id\\": \\"conv_002\\", \\"messages\\": [ \\"...\\" ] }\\n  ],\\n  \\"sync_timestamp\\": \\"2025-03-10T14:30:00Z\\"\\n}\\n\`\`\`"
    },
    {
      "title": "Client acknowledges, delivery status updates",
      "content": "After rendering each message, the client fires \`message.delivered\` events. The server updates delivery status and notifies the original sender — they now see double checkmarks for messages that were sent while the recipient was offline."
    }
  ]
}
\`\`\`

---

## Idempotency via Client Message ID

Mobile networks are unreliable. A request can time out *after* the server has persisted the message, causing the client to retry and create a duplicate. The \`client_message_id\` is the guard:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Without idempotency key — duplicate sent",
    "code": "Client:  POST /messages { text: \\"Hello\\" }\\nNetwork: timeout (but server already saved it)\\nClient:  POST /messages { text: \\"Hello\\" }  ← retry\\nServer:  creates msg_001 AND msg_002\\nResult:  \\"Hello\\" appears twice in the chat"
  },
  "after": {
    "label": "With client_message_id — safe retry",
    "code": "Client:  POST /messages { text: \\"Hello\\", client_message_id: \\"uuid_001\\" }\\nNetwork: timeout (but server already saved it)\\nClient:  POST /messages { text: \\"Hello\\", client_message_id: \\"uuid_001\\" }  ← retry\\nServer:  \\"uuid_001 already processed\\" → returns existing msg_001\\nResult:  \\"Hello\\" appears exactly once"
  }
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "Implementation: Deduplicate at the Write Path",
  "content": "Store \`(sender_id, client_message_id)\` in a unique index. On insert, use \`INSERT ... ON CONFLICT DO NOTHING RETURNING *\` (Postgres) or equivalent. Return the existing row on conflict — the client gets an identical 201 response either way, with no extra round-trip needed."
}
\`\`\`

---

\`\`\`quiz
{
  "title": "Message Send/Receive — Check Your Understanding",
  "questions": [
    {
      "question": "A client sends a message and the network times out before receiving a response. The server had already persisted the message. What prevents a duplicate when the client retries?",
      "options": [
        "The server checks the message text for exact duplicates",
        "The client waits 30 seconds before retrying to avoid conflicts",
        "A client-generated idempotency key (client_message_id) deduplicates at the server",
        "WebSocket connections prevent retries automatically"
      ],
      "answer": 2,
      "explanation": "The \`client_message_id\` (a UUID generated by the client before sending) is stored with a unique index on \`(sender_id, client_message_id)\`. On retry, the server detects the conflict and returns the already-persisted message — achieving at-least-once delivery with idempotent behavior."
    },
    {
      "question": "Which delivery guarantee does a WhatsApp-style API typically implement?",
      "options": [
        "At-most-once, because latency is the top priority",
        "Exactly-once, because duplicates are unacceptable",
        "At-least-once with idempotent deduplication",
        "Best-effort with no acknowledgment"
      ],
      "answer": 2,
      "explanation": "Exactly-once requires expensive two-phase coordination. At-most-once risks losing messages. The practical middle ground is at-least-once delivery (guaranteed persistence via retries + ACKs) combined with client_message_id deduplication to eliminate duplicates at the application layer."
    },
    {
      "question": "A user reads a conversation after being offline for two hours. Which sequence correctly describes the offline delivery flow?",
      "options": [
        "Push notification → client fetches history → messages rendered",
        "Reconnect → GET /sync/messages?since=<timestamp> → client ACKs delivery → sender status updates",
        "Server pushes all queued messages automatically on TCP connect",
        "Client polls GET /messages every 30 seconds while offline"
      ],
      "answer": 1,
      "explanation": "On reconnect, the client explicitly fetches missed messages via the sync endpoint using a \`since\` timestamp. After rendering, it sends \`message.delivered\` acknowledgments, which the server uses to update delivery status and notify the original senders."
    },
    {
      "question": "Why does the message history endpoint paginate in reverse chronological order with a \`before\` cursor rather than a \`after\` cursor?",
      "options": [
        "Databases sort in descending order by default",
        "It matches the UX pattern of scrolling up to load older messages while new messages arrive via push",
        "The \`after\` cursor would require a full table scan",
        "REST APIs require reverse order for cache efficiency"
      ],
      "answer": 1,
      "explanation": "Users see the most recent messages first. Scrolling up triggers a load of older messages, so the cursor points backward in time (\`before=msg_id\`). New messages don't come through pagination — they arrive via real-time WebSocket push, keeping the live and historical paths cleanly separated."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use REST for sends when no WebSocket is open; use WebSocket for active sessions to eliminate connection setup latency.",
    "Message delivery follows a three-state machine: sent → delivered → read, each transition driven by a client ACK — the server never assumes.",
    "Always include a client-generated idempotency key (UUID) on every send to make retries safe on unreliable mobile networks.",
    "Soft-delete messages (set deleted_at) rather than hard-deleting rows to preserve cursor integrity and receipt references.",
    "The sync endpoint (GET /sync/messages?since=...) is the reconnect path — it replays the offline queue across all conversations in one call."
  ]
}
\`\`\``,
    },
    {
      id: "messaging-group-chat",
      slug: "messaging-group-chat",
      title: "Group Chat API",
      content: `# Group Chat API

Group chats introduce a new class of complexity beyond direct messaging: participant management, admin roles, mention notifications, and distributing a single message to potentially hundreds of recipients simultaneously.

\`\`\`concept
{
  "title": "Group Chat = Shared Conversation State",
  "variant": "mental-model",
  "content": "A group conversation is a single shared object owned by all its participants. Unlike a DM (two owners, symmetric), a group has roles (admin vs member), mutable metadata (name, settings), and a variable participant set. Every mutation — add member, rename group, change settings — generates a system message so the timeline stays auditable."
}
\`\`\`

---

## Creating a Group

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
    { "user_id": "usr_001", "role": "admin",  "joined_at": "2025-03-10T14:00:00Z" },
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

The creator (\`usr_001\`) is automatically assigned the \`admin\` role. \`max_participants: 256\` is a typical limit for WhatsApp-style groups — large enough for a team, small enough to keep fan-out manageable.

---

## Participant Management

\`\`\`steps
{
  "title": "Participant Lifecycle Operations",
  "steps": [
    {
      "title": "Add Participants",
      "content": "**POST** \`/api/v1/conversations/conv_group_001/participants\`\\n\\n\`\`\`json\\n{ \\"user_ids\\": [\\"usr_005\\", \\"usr_006\\"] }\\n\`\`\`\\n\\nResponse:\\n\`\`\`json\\n{\\n  \\"added\\": [\\n    { \\"user_id\\": \\"usr_005\\", \\"role\\": \\"member\\" },\\n    { \\"user_id\\": \\"usr_006\\", \\"role\\": \\"member\\" }\\n  ],\\n  \\"participant_count\\": 6\\n}\\n\`\`\`\\n\\nA system message is auto-generated: \`\\"Jane added Alice and Bob to the group\\"\`. This keeps the timeline auditable without requiring callers to post their own event."
    },
    {
      "title": "Remove a Participant",
      "content": "**DELETE** \`/api/v1/conversations/conv_group_001/participants/usr_005\`\\n\\n\`\`\`json\\n{ \\"removed\\": \\"usr_005\\", \\"participant_count\\": 5 }\\n\`\`\`\\n\\nThis endpoint handles both admin-initiated kicks and self-initiated leaves — the server checks role before applying."
    },
    {
      "title": "Promote or Demote",
      "content": "**PATCH** \`/api/v1/conversations/conv_group_001/participants/usr_002\`\\n\\n\`\`\`json\\n{ \\"role\\": \\"admin\\" }\\n\`\`\`\\n\\nResponse:\\n\`\`\`json\\n{ \\"user_id\\": \\"usr_002\\", \\"role\\": \\"admin\\" }\\n\`\`\`\\n\\nOnly existing admins can change roles. Demoting yourself is allowed only if another admin exists."
    },
    {
      "title": "Update Group Settings",
      "content": "**PATCH** \`/api/v1/conversations/conv_group_001\`\\n\\n\`\`\`json\\n{\\n  \\"name\\": \\"Engineering Team 2025\\",\\n  \\"settings\\": { \\"only_admins_can_send\\": true }\\n}\\n\`\`\`\\n\\nRequires admin role. Setting \`only_admins_can_send: true\` converts the group to an announcement channel."
    }
  ]
}
\`\`\`

### Authorization Rules

\`\`\`callout
{
  "type": "warning",
  "title": "Last-Admin Guard",
  "content": "The last admin cannot leave or be demoted — the group would be ownerless. The server returns \`422 Unprocessable Entity\` with error code \`LAST_ADMIN\`. The caller must first promote another member to admin.\\n\\nDELETE /api/v1/conversations/conv_group_001/participants/usr_001\\nHTTP/1.1 422 Unprocessable Entity\\n{ \\"error\\": { \\"code\\": \\"LAST_ADMIN\\", \\"message\\": \\"Promote another member to admin before leaving.\\" } }"
}
\`\`\`

| Action | Who can do it |
|--------|--------------|
| Add participants | Admin only |
| Remove any member | Admin only |
| Remove self (leave) | Any member |
| Promote / demote | Admin only |
| Edit name / settings | Admin only (when \`only_admins_can_edit_info: true\`) |
| Send messages | All members (or admins only if \`only_admins_can_send: true\`) |

---

## Mentions

Messages can target specific users or the entire group:

\`\`\`http
POST /api/v1/conversations/conv_group_001/messages
Content-Type: application/json

{
  "type": "text",
  "text": "Hey @usr_002, can you review the PR?",
  "mentions": [
    { "user_id": "usr_002", "offset": 4, "length": 8 }
  ],
  "client_message_id": "client_uuid_010"
}
\`\`\`

The \`offset\` and \`length\` fields locate the mention within the \`text\` string, enabling client rendering of styled @tags without string parsing.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "@user",
      "icon": "🔔",
      "content": "Triggers a **push notification** to the specific mentioned user only — even if they have muted the group for general messages.\\n\\n\`\`\`json\\n{ \\"user_id\\": \\"usr_002\\", \\"offset\\": 4, \\"length\\": 8 }\\n\`\`\`\\n\\nUse this for direct callouts: code reviews, approvals, task assignments."
    },
    {
      "label": "@everyone",
      "icon": "📣",
      "content": "Triggers **push notifications to all group members**, overriding mute preferences.\\n\\n\`\`\`json\\n{ \\"user_id\\": \\"__everyone__\\", \\"offset\\": 0, \\"length\\": 9 }\\n\`\`\`\\n\\nUse a sentinel value like \`\\"__everyone__\\"\` rather than enumerating all user IDs — the server expands the fan-out. Typically restricted to admins to prevent notification spam."
    }
  ]
}
\`\`\`

---

## Group Message Fan-out

This is the highest-stakes scalability concern in group chat design. When a user sends a message to a 200-member group, a single write triggers many downstream operations.

\`\`\`sysdiag
{
  "title": "Fan-out on Write — 200-Member Group",
  "width": 680,
  "height": 360,
  "nodes": [
    { "id": "sender",   "label": "Sender",          "x": 80,  "y": 180, "kind": "client" },
    { "id": "api",      "label": "Messages API",     "x": 230, "y": 180, "kind": "service" },
    { "id": "msgstore", "label": "Messages Table",   "x": 400, "y": 80,  "kind": "database" },
    { "id": "fanout",   "label": "Fan-out Worker",   "x": 400, "y": 180, "kind": "service" },
    { "id": "ws",       "label": "WebSocket Servers","x": 570, "y": 100, "kind": "service" },
    { "id": "queue",    "label": "Push Queue",       "x": 570, "y": 260, "kind": "queue" }
  ],
  "edges": [
    { "from": "sender",   "to": "api",      "label": "POST /messages" },
    { "from": "api",      "to": "msgstore", "label": "store once" },
    { "from": "api",      "to": "fanout",   "label": "async job" },
    { "from": "fanout",   "to": "ws",       "label": "push (online)" },
    { "from": "fanout",   "to": "queue",    "label": "enqueue (offline)" }
  ],
  "annotations": {
    "msgstore": "Message stored exactly once. Participant records updated: last_message + unread_count incremented for 199 members.",
    "fanout":   "Fan-out worker distributes to N recipients. For very large groups, updates are batched and processed asynchronously to avoid write amplification spikes.",
    "ws":       "Real-time delivery to currently connected participants via WebSocket.",
    "queue":    "Push notification queue for offline participants. Mention notifications bypass group mute settings."
  }
}
\`\`\`

### Fan-out Strategies

\`\`\`concept
{
  "title": "Fan-out-on-Write vs Fan-out-on-Read",
  "variant": "rule",
  "content": "**Fan-out-on-write (push model):** Message is distributed to all recipients' inboxes immediately on send. Reads are O(1) — the client just fetches its inbox. Writes are O(N) where N = group size. Best for small-to-medium groups where write amplification is acceptable.\\n\\n**Fan-out-on-read (pull model):** Message is stored once; clients fetch from the shared source on demand. Writes are O(1). Reads are more expensive and require more complex cursoring. Better for very large channels (Slack-style #announcements with thousands of members).\\n\\nMost group chat systems under 256 members use fan-out-on-write. Above 1,000 members, hybrid approaches dominate."
}
\`\`\`

The six steps every fan-out worker must execute:

1. **Store message once** in the \`messages\` table
2. **Update \`conversation.last_message\`** for all participants
3. **Increment \`unread_count\`** for all participants except the sender
4. **Push real-time delivery** to online participants via WebSocket
5. **Queue push notifications** for offline participants
6. **Trigger mention notifications** if any \`@user\` or \`@everyone\` mentions present

\`\`\`callout
{
  "type": "info",
  "title": "Write Amplification at Scale",
  "content": "A 200-member group means one message send triggers ~200 database row updates (unread counters), ~200 WebSocket pushes, and potentially ~200 push notification enqueues. At Stream Chat's benchmarks, this architecture supports 5 million concurrent connections delivering 15 million messages per second by using pub/sub brokers (Kafka) and Redis caching to absorb these fan-out bursts rather than hitting the database directly."
}
\`\`\`

---

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

The list is sorted by \`last_message.sent_at\` descending — most active conversations surface first. DMs and groups share the same endpoint and response envelope; clients distinguish them via \`type\`.

\`\`\`collapse
{
  "title": "Deep Dive: Designing the Conversations Index Table",
  "content": "The conversations list is read on every app open — it must be fast. A naive \`SELECT * FROM messages ORDER BY sent_at\` per user is O(messages) and catastrophically slow at scale.\\n\\nInstead, maintain a **conversation_participants** join table with a \`last_read_at\` and \`last_message_at\` column denormalized per (user, conversation) pair:\\n\\n\`\`\`sql\\nCREATE TABLE conversation_participants (\\n  user_id         UUID NOT NULL,\\n  conversation_id UUID NOT NULL,\\n  role            TEXT NOT NULL DEFAULT 'member',\\n  last_read_at    TIMESTAMPTZ,\\n  last_message_at TIMESTAMPTZ,\\n  unread_count    INT NOT NULL DEFAULT 0,\\n  PRIMARY KEY (user_id, conversation_id)\\n);\\nCREATE INDEX idx_conv_participants_user_time\\n  ON conversation_participants (user_id, last_message_at DESC);\\n\`\`\`\\n\\nNow the inbox query is O(page_size) with a single index scan:\\n\\n\`\`\`sql\\nSELECT cp.*, c.name, c.type, m.text AS last_text\\nFROM conversation_participants cp\\nJOIN conversations c ON c.id = cp.conversation_id\\nJOIN messages m ON m.id = c.last_message_id\\nWHERE cp.user_id = $1\\nORDER BY cp.last_message_at DESC\\nLIMIT 20;\\n\`\`\`\\n\\nThe trade-off: every new message in a group must update \`last_message_at\` and \`unread_count\` for all N participants — this is the write amplification discussed in the fan-out section."
}
\`\`\`

---

\`\`\`quiz
{
  "title": "Group Chat API — Check Your Understanding",
  "questions": [
    {
      "question": "A group has exactly one admin (usr_001). usr_001 sends DELETE /conversations/conv_001/participants/usr_001. What HTTP status code should the server return?",
      "options": ["200 OK", "403 Forbidden", "422 Unprocessable Entity", "409 Conflict"],
      "answer": 2,
      "explanation": "422 Unprocessable Entity is correct. The request is syntactically valid and the caller is authorized (you can always remove yourself), but the business rule forbids it: removing the last admin would leave the group ownerless. The server should return error code LAST_ADMIN with a message instructing the caller to promote another member first."
    },
    {
      "question": "Your group chat supports 500 members. A message is sent to the group. Which fan-out strategy minimizes read latency for all 500 recipients?",
      "options": [
        "Fan-out-on-read: store once, clients pull on demand",
        "Fan-out-on-write: push message to all 500 inboxes immediately",
        "No fan-out: all clients query the messages table directly",
        "Lazy fan-out: only deliver to members who are currently online"
      ],
      "answer": 1,
      "explanation": "Fan-out-on-write (push model) pre-distributes the message to every recipient's inbox so reads are O(1). The cost is write amplification — 500 updates per message. For groups under ~1,000 members this is the standard approach; above that, hybrid or fan-out-on-read strategies become preferable."
    },
    {
      "question": "A mention payload includes { \\"offset\\": 4, \\"length\\": 8 }. Why store offset/length rather than just the mentioned user_id?",
      "options": [
        "To allow the server to validate the mention text matches the user's display name",
        "To enable clients to render styled @tags without string-parsing the entire message body",
        "To calculate push notification priority",
        "To enforce that only one mention per message is allowed"
      ],
      "answer": 1,
      "explanation": "The offset/length tuple precisely locates the mention within the text string, letting clients highlight or style the @tag without re-parsing the full message body. This is the same approach used by Slack and WhatsApp — the rendering client reads (offset, length), slices the string, and applies mention styling. The user_id maps the visual tag to an actual user for notification routing."
    },
    {
      "question": "Which message delivery guarantee do most large-scale messaging systems use by default, and why?",
      "options": [
        "Exactly-once, because duplicate messages are unacceptable in chat",
        "At-most-once, because performance is the top priority",
        "At-least-once, because reliability is prioritized and duplicates can be de-duped via idempotency keys",
        "Best-effort, because WebSocket connections are inherently unreliable"
      ],
      "answer": 2,
      "explanation": "At-least-once delivery is the standard because it guarantees no messages are lost, even under failures. Exactly-once adds significant overhead (two-phase commit or distributed transactions). The practical solution: assign each message a unique client_message_id (idempotency key) so clients can de-duplicate if the same message arrives twice."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Group conversations have roles (admin/member), mutable settings, and an append-only system-message timeline — always generate system messages for participant and settings changes.",
    "The last-admin guard (422 LAST_ADMIN) is a critical business rule: a group without an admin is unmanageable — enforce it server-side, never rely on clients.",
    "Fan-out-on-write is the standard pattern for groups under ~1,000 members: one write amplifies to N database updates + WebSocket pushes + push notification enqueues — design your schema to support this with denormalized last_message_at per participant.",
    "Mention payloads carry both a user_id (for notification routing) and an offset/length (for client rendering) — separating these concerns keeps the server and client responsibilities clean.",
    "The conversations list endpoint must be backed by a denormalized index on (user_id, last_message_at DESC) — a naive JOIN on the messages table will not survive at scale."
  ]
}
\`\`\``,
    },
    {
      id: "messaging-read-receipts",
      slug: "messaging-read-receipts",
      title: "Read Receipts & Presence",
      content: `# Read Receipts & Presence

Read receipts and presence indicators are what make a messaging app feel *alive* — transforming a static data exchange into a shared experience. They require real-time event infrastructure, careful data modeling, and thoughtful privacy controls.

\`\`\`concept
{ "title": "The Core Mental Model", "variant": "mental-model", "content": "Read receipts are not per-message flags — they are a high-water mark. Reading message #50 implies all messages #1–#49 are also read. This cursor-style model drastically reduces write amplification. Presence is even simpler: it is a heartbeat — if the server stops hearing from you, you are gone." }
\`\`\`

---

## Read Receipts

### Marking Messages as Read

When a user opens a conversation, the client sends a single read receipt for the *most recent* message. Every earlier message is implicitly marked as read:

\`\`\`
POST /api/v1/messages/msg_050/read HTTP/1.1
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "message_id": "msg_050",
  "read_at": "2025-03-10T14:35:00Z",
  "conversation_unread_count": 0
}
\`\`\`

This high-water mark design means marking a conversation as read requires **one write**, not N writes per message. At scale — users with hundreds of unread messages in a thread — this is the difference between a sustainable API and one that melts under load.

### Real-time Read Receipt Delivery

When user A reads user B's message, user B receives a WebSocket push notification immediately:

\`\`\`
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

\`\`\`tabs
{ "tabs": [
  {
    "label": "1:1 Chat",
    "icon": "💬",
    "content": "In a 1:1 conversation there is only one other participant, so the read receipt is binary: **read** or **not read**.\\n\\nThe classic WhatsApp UX:\\n- ✓ (one gray check) — **Sent** to server\\n- ✓✓ (two gray checks) — **Delivered** to recipient's device\\n- ✓✓ (two blue checks) — **Read** by recipient\\n\\nThe client simply checks: \`last_message_id <= read_up_to\`."
  },
  {
    "label": "Group Chat",
    "icon": "👥",
    "content": "Groups require a per-participant read cursor. You expose this via a dedicated endpoint:\\n\\n\`\`\`\\nGET /api/v1/messages/msg_050/read-receipts\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"message_id\\": \\"msg_050\\",\\n  \\"read_by\\": [\\n    { \\"user_id\\": \\"usr_002\\", \\"name\\": \\"Bob\\",   \\"read_at\\": \\"2025-03-10T14:35:01Z\\" },\\n    { \\"user_id\\": \\"usr_003\\", \\"name\\": \\"Alice\\", \\"read_at\\": \\"2025-03-10T14:36:00Z\\" }\\n  ],\\n  \\"total_participants\\": 5,\\n  \\"total_read\\": 2\\n}\\n\`\`\`\\n\\nThe UI typically renders a **count** (\\"Read by 2 of 5\\") rather than showing all avatars inline, to keep the chat view clean."
  }
] }
\`\`\`

---

## Typing Indicators

Typing indicators are the most ephemeral signal in the messaging stack. They travel over WebSocket, are never persisted, and are fire-and-forget:

\`\`\`
// Client → Server
{ "type": "typing.start", "payload": { "conversation_id": "conv_abc123" } }

// Client → Server (user stops typing — or 3-second timeout fires)
{ "type": "typing.stop",  "payload": { "conversation_id": "conv_abc123" } }

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

\`\`\`callout
{ "type": "tip", "title": "Never persist typing events", "content": "Typing indicators are intentionally ephemeral — WebSocket only, zero database writes. If an event is dropped, the UX degrades gracefully (the indicator just disappears). There is no recovery mechanism because none is needed. This is a deliberate design choice that keeps the hot path (message sending) fast." }
\`\`\`

---

## User Presence

### Presence States & Detection

\`\`\`
online  → Active WebSocket connection, heartbeat received within last 30s
away    → Connected but idle > 5 minutes (no user interaction events)
offline → No heartbeat for 60s (two missed 30s intervals)
\`\`\`

### Fetch Presence — Single User

\`\`\`
GET /api/v1/users/usr_002/presence

HTTP/1.1 200 OK
{
  "user_id": "usr_002",
  "status": "online",
  "last_active_at": "2025-03-10T14:30:00Z"
}
\`\`\`

### Fetch Presence — Batch (Contact List)

The contact list screen can need presence for dozens of users simultaneously. Batching is essential:

\`\`\`
POST /api/v1/users/presence/batch
{ "user_ids": ["usr_002", "usr_003", "usr_004", "usr_005"] }

HTTP/1.1 200 OK
{
  "presence": {
    "usr_002": { "status": "online" },
    "usr_003": { "status": "away",    "last_active_at": "2025-03-10T14:25:00Z" },
    "usr_004": { "status": "offline", "last_active_at": "2025-03-09T18:00:00Z" },
    "usr_005": { "status": "online" }
  }
}
\`\`\`

### Presence Updates via WebSocket

\`\`\`
// Server → Client (pushed for contacts currently in view)
{
  "type": "presence.update",
  "payload": {
    "user_id": "usr_003",
    "status": "online",
    "timestamp": "2025-03-10T14:36:00Z"
  }
}
\`\`\`

\`\`\`sysdiag
{ "title": "Read Receipts & Presence — Event Flow", "width": 680, "height": 340,
  "nodes": [
    { "id": "clientA", "label": "Client A\\n(Sender)",    "x": 80,  "y": 170, "kind": "client" },
    { "id": "clientB", "label": "Client B\\n(Reader)",    "x": 580, "y": 170, "kind": "client" },
    { "id": "ws",      "label": "WebSocket\\nGateway",    "x": 330, "y": 80,  "kind": "service" },
    { "id": "api",     "label": "REST API",              "x": 330, "y": 260, "kind": "service" },
    { "id": "db",      "label": "Read Receipts DB\\n(high-water mark)", "x": 530, "y": 260, "kind": "database" },
    { "id": "presence","label": "Presence Store\\n(Redis / in-memory)", "x": 130, "y": 260, "kind": "database" }
  ],
  "edges": [
    { "from": "clientB", "to": "api",      "label": "POST /messages/msg_050/read" },
    { "from": "api",     "to": "db",       "label": "upsert cursor" },
    { "from": "api",     "to": "ws",       "label": "fanout event" },
    { "from": "ws",      "to": "clientA",  "label": "message.read push" },
    { "from": "clientB", "to": "ws",       "label": "heartbeat / typing.start" },
    { "from": "ws",      "to": "presence", "label": "update status" },
    { "from": "presence","to": "ws",       "label": "presence.update fanout" }
  ],
  "annotations": {
    "db":      "Stores one row per (user, conversation): the highest message_id they have read. Never grows proportionally to message count.",
    "presence":"Ephemeral store — Redis TTL or in-memory. If the key expires, the user is offline. No SQL required.",
    "ws":      "Presence subscriptions are scoped to contacts currently visible on screen — not the entire user base — to avoid the n-squared fanout problem."
  }
}
\`\`\`

---

## Privacy Controls

Both features need user-controlled visibility. The API surfaces a single settings endpoint:

\`\`\`
PATCH /api/v1/users/me/privacy-settings
{
  "show_read_receipts": false,
  "show_online_status": false,
  "show_last_seen": "contacts_only"
}
\`\`\`

\`show_last_seen\` accepts: \`everyone\` | \`contacts_only\` | \`nobody\`

\`\`\`concept
{ "title": "The Reciprocity Rule", "variant": "rule", "content": "If user A disables read receipts, they also stop receiving read receipts from others. This reciprocity is a deliberate design choice — it prevents users from gaining asymmetric information (seeing others' read behavior while hiding their own). The same logic applies to online status: hiding yours means you cannot see others'. Interviewers often ask about this trade-off explicitly." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Privacy vs. transparency trade-off", "content": "Some platforms (e.g., Facebook Messenger historically) enable read receipts by default with no opt-out, prioritizing transparency. Others (WhatsApp, iMessage) let users disable them. There is no universally correct answer — the right choice depends on your product's social contract. Be prepared to defend whichever approach you propose in an interview." }
\`\`\`

---

## Scaling Consideration: The N-Squared Problem

Large group chats expose a subtle presence scalability trap. If every member subscribes to every other member's presence events:

- 10,000 users enter a channel
- Each generates a \`presence.enter\` event
- Each receives all 10,000 events

That is **100 million messages** for a single channel join. The mitigation is to route presence through the server as a hub, not peer-to-peer: each client emits *one* event to the server, and the server fans out only to online subscribers — bringing the total to roughly **20,000 messages**. This pub/sub model is why presence is typically backed by Redis (pub/sub built-in) rather than a relational database.

---

\`\`\`quiz
{ "title": "Read Receipts & Presence — Check Your Understanding",
  "questions": [
    {
      "question": "User B has 200 unread messages in a conversation with User A. User B opens the conversation and sees the latest message. How many database writes does a well-designed read receipt system perform?",
      "options": ["200 — one per unread message", "2 — one for delivered, one for read", "1 — upsert the high-water mark cursor", "0 — read receipts are stored client-side only"],
      "answer": 2,
      "explanation": "The high-water mark (cursor) model stores a single row per (user, conversation) representing the latest message they've read. Reading message #200 implicitly marks all prior messages as read — one upsert, not 200."
    },
    {
      "question": "A user sends typing.start via WebSocket, then closes the app without sending typing.stop. What happens?",
      "options": ["The other user sees the typing indicator indefinitely", "The server fires a typing.stop after a timeout (typically ~3 seconds)", "The message is queued and delivered when the user reconnects", "The conversation is locked until the typing state clears"],
      "answer": 1,
      "explanation": "Typing indicators are ephemeral and governed by a server-side timeout (commonly 3 seconds). If typing.stop is never received, the server automatically broadcasts typing.stop after the timeout expires. Nothing is persisted."
    },
    {
      "question": "User A sets show_read_receipts: false in their privacy settings. What does this mean for User A's ability to see others' read receipts?",
      "options": ["No change — they can still see when others read their messages", "They can see receipts from contacts who also have them enabled", "They also lose the ability to see read receipts from others (reciprocity rule)", "They receive receipts but cannot send them"],
      "answer": 2,
      "explanation": "The reciprocity rule prevents asymmetric information: disabling your own read receipts also disables your view of others' receipts. This avoids a scenario where a user can monitor others' behavior while hiding their own."
    },
    {
      "question": "A chat app has 10,000 users in a public channel, all currently online. If each client subscribes directly to every other client's presence events (peer-to-peer), how many messages are generated when one new user joins?",
      "options": ["10,000", "20,000", "10,001", "~100,000,000"],
      "answer": 3,
      "explanation": "With direct peer-to-peer subscriptions, one new user entering triggers a presence event to all 10,000 existing members, AND receives 10,000 existing-member presence events. That is 10,000 × 10,000 = 100 million messages for a full channel join. Server-mediated pub/sub reduces this dramatically."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Read receipts use a high-water mark cursor — one write marks all prior messages as read, eliminating write amplification.",
  "Typing indicators are fully ephemeral: WebSocket-only, never persisted, governed by a short server-side timeout.",
  "Presence is a heartbeat contract: if the server stops hearing from a client within ~60s (two missed 30s intervals), it marks them offline.",
  "Batch presence endpoints are essential for contact list screens — never fire N individual requests for N contacts.",
  "The reciprocity rule for privacy (disabling read receipts cuts both ways) prevents users from gaining asymmetric information.",
  "Presence subscriptions must be scoped to visible contacts — not the full user base — to avoid the n-squared fanout problem."
] }
\`\`\``,
    },
    {
      id: "messaging-websocket-polling",
      slug: "messaging-websocket-polling",
      title: "WebSocket vs Long Polling",
      content: `Messaging requires real-time delivery. The transport mechanism is a critical design decision that touches latency, bandwidth cost, and horizontal scalability all at once.

\`\`\`concept
{ "title": "The Connection Lifecycle Spectrum", "variant": "mental-model", "content": "Every transport mechanism sits on a spectrum from fully stateless to fully stateful. Short polling: new TCP connection per request — maximum simplicity, maximum waste. WebSocket: one persistent TCP connection for the entire session — minimum per-message overhead, maximum server state. Long polling and SSE occupy the middle ground. Moving toward persistence reduces latency and per-message bytes, but raises the cost of node failures, sticky routing, and horizontal scaling. The transport choice is a scalability trade-off, not just a performance question." }
\`\`\`

## Four Transport Options

\`\`\`tabs
{ "tabs": [ { "label": "Short Polling", "icon": "🔄", "content": "The client repeatedly asks \\"any new messages?\\" on a fixed interval.\\n\\n\`\`\`http\\nGET /api/v1/sync/messages?since=2025-03-10T14:30:00Z\\nHTTP/1.1 200 OK\\n{\\"messages\\":[]}  ← Usually empty, wasted request\\n\\n# 2 seconds later:\\nGET /api/v1/sync/messages?since=2025-03-10T14:30:00Z\\nHTTP/1.1 200 OK\\n{\\"messages\\":[{\\"id\\":\\"msg_051\\",\\"text\\":\\"Hey!\\"}]}  ← Got one!\\n\`\`\`\\n\\n**Scale math:** 1M users × 1 req/2s = **500K req/s**. Assume 99% return empty — that is 495K wasted round-trips every second.\\n\\n✅ Dead simple, stateless server, works everywhere  \\n❌ High latency (up to polling interval), massive wasted bandwidth, does not scale" }, { "label": "Long Polling", "icon": "⏳", "content": "The server holds the connection open until data arrives or a timeout fires. On response, the client immediately reconnects.\\n\\n\`\`\`http\\nGET /api/v1/sync/messages?since=tok_abc&wait=30\\n\\n# Server holds connection open for up to 30 seconds...\\n# A message arrives after 5 seconds:\\nHTTP/1.1 200 OK\\n{\\"messages\\":[{\\"id\\":\\"msg_051\\",\\"text\\":\\"Hey!\\"}],\\"sync_token\\":\\"tok_xyz\\"}\\n\\n# Client immediately re-issues:\\nGET /api/v1/sync/messages?since=tok_xyz&wait=30\\n\`\`\`\\n\\nEach held connection consumes a server thread or file descriptor. Traditional threaded servers hit limits with thousands of concurrent holders — event-loop servers (Node, Go) fare better.\\n\\nHTTP header overhead runs ~150–200 bytes per delivery vs. 2–14 bytes for a WebSocket frame.\\n\\n✅ Near real-time, much less wasted traffic, works through firewalls  \\n❌ HTTP header churn, not truly bidirectional, thread starvation risk under load" }, { "label": "WebSocket", "icon": "⚡", "content": "A persistent, full-duplex TCP connection standardized by IETF RFC 6455 (2011). Established via an HTTP upgrade handshake:\\n\\n\`\`\`\\nGET /ws?token=<auth> HTTP/1.1\\nUpgrade: websocket\\nConnection: Upgrade\\n→ HTTP/1.1 101 Switching Protocols\\n\`\`\`\\n\\nAfter the handshake, both sides send typed frames with 2–14 bytes of overhead:\\n\\n\`\`\`json\\n{\\"type\\":\\"message.send\\",\\"payload\\":{\\"conversation_id\\":\\"conv_001\\",\\"text\\":\\"Hi!\\"}}\\n{\\"type\\":\\"message.new\\",\\"payload\\":{\\"id\\":\\"msg_051\\",\\"text\\":\\"Hey!\\"}}\\n{\\"type\\":\\"typing.update\\",\\"payload\\":{\\"conversation_id\\":\\"conv_001\\",\\"is_typing\\":true}}\\n{\\"type\\":\\"message.read\\",\\"payload\\":{\\"message_id\\":\\"msg_051\\"}}\\n{\\"type\\":\\"presence.update\\",\\"payload\\":{\\"user_id\\":\\"usr_003\\",\\"status\\":\\"online\\"}}\\n\`\`\`\\n\\n✅ True real-time, bidirectional, single connection handles all event types, minimal per-message overhead  \\n❌ Stateful connections (requires sticky sessions or pub/sub fan-out across nodes), reconnection logic required, some legacy proxies block the upgrade" }, { "label": "SSE", "icon": "📡", "content": "Server pushes events over a long-lived HTTP connection. Unidirectional — server to client only.\\n\\n\`\`\`http\\nGET /api/v1/events/stream HTTP/1.1\\nAccept: text/event-stream\\n\\nHTTP/1.1 200 OK\\nContent-Type: text/event-stream\\n\\nevent: message.new\\ndata: {\\"id\\":\\"msg_051\\",\\"text\\":\\"Hey!\\",\\"conversation_id\\":\\"conv_001\\"}\\n\\nevent: typing.update\\ndata: {\\"conversation_id\\":\\"conv_001\\",\\"user_id\\":\\"usr_002\\",\\"is_typing\\":true}\\n\`\`\`\\n\\nBrowsers auto-reconnect on drop. Clients send messages via ordinary REST calls.\\n\\n✅ HTTP-native (firewall-friendly), built-in reconnect, simple server implementation  \\n❌ Server-to-client only, HTTP/1.1 browsers cap at 6 connections per domain, clients must maintain a parallel REST connection for writes" } ] }
\`\`\`

## Comparison at a Glance

| Feature | Short Poll | Long Poll | SSE | WebSocket |
|---------|-----------|-----------|-----|-----------|
| Latency | High | Low | Low | Lowest |
| Bandwidth | Wasteful | Moderate | Efficient | Efficient |
| Bidirectional | No | No | No | Yes |
| Complexity | Low | Low | Medium | High |
| Scaling | Hard | Moderate | Moderate | Hard |
| Firewall-friendly | Yes | Yes | Yes | Mostly |
| Per-message overhead | ~200 bytes | ~150–200 bytes | ~50 bytes | 2–14 bytes |

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Short Polling — 1M Users", "code": "# 1,000,000 users polling every 2 seconds\\n= 500,000 HTTP requests / second\\n\\n# Assume 99% return empty:\\n= 495,000 wasted round-trips / second\\n\\n# Per empty response: ~200-byte HTTP header\\n= ~100 MB/s of pure overhead\\n# (plus TLS handshake amortized across keep-alive)\\n\\n# Halve waste by polling every 10s?\\n# Now maximum message latency = 10 seconds." }, "after": { "label": "WebSocket — 1M Users", "code": "# 1,000,000 persistent TCP connections\\n# Each idle connection: ~few KB RAM on server\\n\\n# Per message frame overhead: 2–14 bytes\\n# vs HTTP headers:           150–200 bytes\\n# = 10–100x less overhead per delivery\\n\\n# Typing indicators, presence, read receipts:\\n# all multiplexed on the same connection\\n\\n# No repeated handshakes.\\n# No empty round-trips." } }
\`\`\`

## Recommended Architecture for Messaging

No single transport handles every case. Production systems layer them:

\`\`\`
Primary transport:     WebSocket (real-time messages, typing, presence, read receipts)
Fallback transport:    Long Polling (when WebSocket upgrade is blocked by proxy)
Message sending:       REST API (durability) + WebSocket fan-out (speed)
History loading:       REST API (paginated GET)
Offline delivery:      APNs / FCM (push notifications)
\`\`\`

\`\`\`sysdiag
{ "title": "Dual-Path Messaging Architecture", "width": 700, "height": 380, "nodes": [ { "id": "client", "label": "Client", "x": 70, "y": 190, "kind": "client" }, { "id": "ws_gw", "label": "WS Gateway", "x": 250, "y": 100, "kind": "service" }, { "id": "rest_api", "label": "REST API", "x": 250, "y": 280, "kind": "service" }, { "id": "fanout", "label": "Fan-out", "x": 430, "y": 190, "kind": "service" }, { "id": "db", "label": "Message DB", "x": 590, "y": 280, "kind": "database" }, { "id": "push", "label": "APNs/FCM", "x": 590, "y": 100, "kind": "external" }, { "id": "recipient", "label": "Recipient", "x": 590, "y": 190, "kind": "client" } ], "edges": [ { "from": "client", "to": "ws_gw", "label": "WebSocket" }, { "from": "client", "to": "rest_api", "label": "POST /messages" }, { "from": "rest_api", "to": "db", "label": "persist" }, { "from": "rest_api", "to": "fanout", "label": "trigger" }, { "from": "fanout", "to": "ws_gw", "label": "online delivery" }, { "from": "fanout", "to": "push", "label": "offline users" }, { "from": "ws_gw", "to": "recipient", "label": "push frame" } ], "annotations": { "ws_gw": "Maintains persistent connections. Stateful — requires sticky sessions or a pub/sub layer (Redis Pub/Sub, Kafka) so fan-out works across horizontally scaled nodes.", "rest_api": "Stateless HTTP. Persists the message and assigns a server-side ID before triggering fan-out. Guarantees durability regardless of WebSocket health.", "fanout": "Routes to online recipients via the WebSocket gateway, and to offline recipients via APNs/FCM. Decouples persistence from delivery.", "db": "Authoritative message store. The REST write path ensures every message survives even if the WebSocket connection drops during or after send.", "push": "APNs (iOS) and FCM (Android/web) wake offline users. They reconnect via WebSocket and fetch missed messages through the REST history endpoint." } }
\`\`\`

### Why Send via Both REST and WebSocket?

\`\`\`callout
{ "type": "info", "title": "The Dual-Path Pattern", "content": "Messages are written via REST *and* delivered via WebSocket — they serve different guarantees:\\n\\n- **REST POST** ensures durable persistence. If the WebSocket drops mid-send, the message is safely stored and will be fetched on reconnect via history sync.\\n- **WebSocket fan-out** provides instant delivery to online recipients. After the REST write assigns a server-side message ID, the fan-out service pushes a frame to every connected recipient immediately.\\n\\nThe client fires one REST request. The server does both: persist + fan-out. This is why messaging APIs separate the *write path* (REST) from the *delivery path* (WebSocket)." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Misconception: Long Polling is Stateless", "content": "Long polling uses HTTP, but it is **not stateless in practice**. The server must track which open connections are waiting for which users' data, and must notify held connections when new messages arrive — exactly the same server-side state problem as WebSocket. The difference is connection granularity and protocol overhead, not statefulness." }
\`\`\`

\`\`\`quiz
{ "title": "Transport Trade-offs", "questions": [ { "question": "At 1M concurrent users polling every 2 seconds, how many HTTP requests per second reach the server?", "options": ["50,000 req/s", "500,000 req/s", "2,000,000 req/s", "5,000,000 req/s"], "answer": 1, "explanation": "1,000,000 users ÷ 2 seconds = 500,000 requests/second. With typical message patterns the vast majority return empty responses, making short polling economically unviable at this scale." }, { "question": "Why does the recommended architecture write messages via REST rather than sending them directly over WebSocket?", "options": ["REST is faster than WebSocket for large payloads", "REST provides durable persistence — WebSocket connections can drop silently at any moment", "WebSocket cannot carry text messages", "REST handles authentication; WebSocket does not"], "answer": 1, "explanation": "WebSocket connections can close at any point. Sending via REST first ensures the message is persisted with a server-assigned ID before fan-out. If the WebSocket drops after the REST write, the message is not lost — recipients fetch it via history sync on reconnect." }, { "question": "Which transport is the correct fallback when WebSocket is blocked by a corporate proxy?", "options": ["Short polling", "Long polling", "SSE", "gRPC streaming"], "answer": 1, "explanation": "Long polling works through any HTTP/HTTPS proxy because it uses standard request-response HTTP. SSE is also HTTP-native but is unidirectional, making it harder to use as a full WebSocket substitute. Short polling works but wastes too much bandwidth." }, { "question": "A WebSocket frame carries 2–14 bytes of overhead. An HTTP response header carries ~150–200 bytes. Typing indicators fire 10 times per second across 10,000 active conversations. How do the bandwidth costs compare?", "options": ["The difference is negligible — both are under 1 KB per event", "WebSocket uses roughly 10–100x less bandwidth than HTTP polling for the same delivery rate", "HTTP is more efficient because keep-alive reuses the TCP connection", "SSE is more efficient than WebSocket because it is unidirectional"], "answer": 1, "explanation": "10,000 conversations × 10 events/s = 100,000 events/second. At 200 bytes/event (HTTP) that is 20 MB/s. At 14 bytes/event (WebSocket) it is 1.4 MB/s — roughly a 14x difference. This gap compounds significantly at WhatsApp-like scale." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Short polling is a non-starter at messaging scale: 1M users polling every 2 seconds = 500K req/s, nearly all wasted.", "WebSocket (RFC 6455, 2011) provides true bidirectional real-time communication with 2–14 byte frame overhead vs ~150–200 bytes for HTTP.", "Long polling is the correct fallback when WebSocket upgrade is blocked — it works through any HTTP proxy and delivers near real-time performance.", "SSE is unidirectional (server → client only) and is capped at 6 HTTP/1.1 connections per domain, limiting its use for full messaging scenarios.", "Production messaging uses a dual-path design: REST for durable writes, WebSocket for real-time fan-out, APNs/FCM for offline delivery.", "Both long polling and WebSocket require server-side state — the common claim that long polling is 'stateless because it uses HTTP' is false." ] }
\`\`\``,
    },
    {
      id: "messaging-walkthrough",
      slug: "messaging-walkthrough",
      title: "API Walkthrough",
      content: `# Messaging API: Walkthrough & Trade-offs

This lesson consolidates the full API surface and examines the design decisions interviewers will probe. Every choice has a real-world consequence — the goal is to articulate **why** each decision was made, not just **what** was decided.

## Complete API Surface

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

\`\`\`concept
{ "title": "Dual-Transport Design", "variant": "mental-model", "content": "Think of REST and WebSocket as two lanes on a highway. REST is the reliable lane for operations that need acknowledgment, caching, and simple retries — creating a message, fetching history, managing participants. WebSocket is the fast lane where low latency matters more than HTTP overhead — new message delivery, typing indicators, presence updates. Running both transports lets you choose the right tool per operation rather than forcing everything through one protocol." }
\`\`\`

## WebSocket Event Catalogue

| Event | Direction | Description |
|-------|-----------|-------------|
| \`message.send\` | Client → Server | Send a message |
| \`message.ack\` | Server → Client | Confirm message stored |
| \`message.new\` | Server → Client | New message from others |
| \`message.delivered\` | Client → Server | Delivery acknowledgment |
| \`message.read\` | Both | Read receipt |
| \`typing.start\` | Client → Server | User started typing |
| \`typing.stop\` | Client → Server | User stopped typing |
| \`typing.update\` | Server → Client | Typing status of others |
| \`presence.update\` | Server → Client | User online/offline |
| \`presence.heartbeat\` | Client → Server | Keep-alive signal |

## End-to-End Message Flow

\`\`\`steps
{ "title": "A Message's Journey from Send to Blue Ticks", "steps": [ { "title": "User A sends the message", "content": "**REST:** \`POST /conversations/conv_001/messages\`\\n\\nBody: \`{ \\"text\\": \\"Hello!\\", \\"client_message_id\\": \\"uuid-abc\\" }\`\\n\\nServer persists to the database, assigns a monotonic \`message_id\`, and returns \`201 Created\`. The \`client_message_id\` makes sending idempotent — if the network drops and the client retries, the server recognises the duplicate and returns the original \`message_id\` without inserting a new row." }, { "title": "Server fans out to recipients", "content": "The server fans out based on each recipient's connectivity state:\\n\\n- **User B is online:** push \`message.new\` over the active WebSocket connection immediately\\n- **User C is offline:** enqueue for push notification (APNs/FCM) and mark for sync retrieval\\n\\nFan-out is the critical scaling concern in group chats — a message to a 500-member group triggers 499 delivery operations simultaneously." }, { "title": "User B acknowledges delivery", "content": "User B's device automatically sends:\\n\\n\`{ \\"type\\": \\"message.delivered\\", \\"message_id\\": \\"msg_001\\" }\`\\n\\nServer marks the message status as *delivered* and relays a \`message.delivered\` event to User A. User A now sees a single filled tick." }, { "title": "User B reads the message", "content": "User B opens the conversation. Device sends:\\n\\n\`{ \\"type\\": \\"message.read\\", \\"message_id\\": \\"msg_001\\" }\`\\n\\nServer updates the read receipt and notifies User A. User A sees the ticks turn blue.\\n\\n**Optimisation:** the client sends one receipt for the highest \`sequence_number\` seen — the server infers all prior messages in the conversation were also read." }, { "title": "User C reconnects", "content": "User C's device calls:\\n\\n\`GET /sync/messages?since=<last_sync_token>\`\\n\\nServer returns all queued messages in order. Device sends delivery acks for each. No messages are lost — this is the offline resilience guarantee that the sync endpoint exists specifically to provide." } ] }
\`\`\`

Here is the architectural view of how the server handles fan-out:

\`\`\`sysdiag
{ "title": "Message Fan-out Architecture", "width": 680, "height": 360, "nodes": [ { "id": "clientA", "label": "Client A", "x": 80, "y": 180, "kind": "service" }, { "id": "api", "label": "API Server", "x": 270, "y": 180, "kind": "service" }, { "id": "db", "label": "Message DB", "x": 270, "y": 310, "kind": "database" }, { "id": "wshub", "label": "WS Hub", "x": 460, "y": 100, "kind": "service" }, { "id": "queue", "label": "Push Queue", "x": 460, "y": 270, "kind": "service" }, { "id": "clientB", "label": "Client B (online)", "x": 620, "y": 80, "kind": "service" }, { "id": "clientC", "label": "Client C (offline)", "x": 620, "y": 290, "kind": "service" } ], "edges": [ { "from": "clientA", "to": "api", "label": "POST /messages" }, { "from": "api", "to": "db", "label": "persist first" }, { "from": "api", "to": "wshub", "label": "fan-out" }, { "from": "api", "to": "queue", "label": "enqueue" }, { "from": "wshub", "to": "clientB", "label": "message.new" }, { "from": "queue", "to": "clientC", "label": "APNs/FCM" } ], "annotations": { "api": "Persists the message before fanning out. Assigns a monotonic sequence number per conversation for strict ordering. Never fan out before the write commits.", "wshub": "Delivers to all online participants immediately via active WebSocket connections. Must track per-user connection state to know who is reachable.", "queue": "Offline users receive push notifications via APNs or FCM. On reconnect, GET /sync/messages?since=token retrieves the full ordered backlog." } }
\`\`\`

## Key Trade-offs

\`\`\`tabs
{ "tabs": [ { "label": "Message Ordering", "icon": "🔢", "content": "### Message Ordering Strategies\\n\\n| Approach | Guarantee | Trade-off |\\n|----------|-----------|----------|\\n| Server timestamp | Total order | Clock skew between servers breaks ordering |\\n| Sequence number per conversation | Total order within chat | Serialised writes — bottleneck at high volume |\\n| Lamport timestamp | Causal order | Complex; partial ordering only across chats |\\n\\n**Our choice:** server-assigned monotonic sequence number per conversation.\\n\\nThis gives strict ordering within each chat with no cross-conversation coordination. Users care about message order within a single conversation, not globally across all chats — so this scope is exactly right. The serialisation bottleneck occurs per-conversation, not globally, which keeps it manageable." }, { "label": "Delivery Guarantee", "icon": "📬", "content": "### The Three Delivery Semantics\\n\\n**At-most-once** — fire and forget. The server sends once and never retries. A dropped packet is a lost message. Unacceptable for chat.\\n\\n**At-least-once** — retry until acknowledged. Duplicates are possible but the client deduplicates using \`client_message_id\`. This is the right choice.\\n\\n**Exactly-once** — theoretically possible with distributed transactions. Prohibitively expensive at scale and not necessary when idempotent deduplication is available.\\n\\n**Our choice:** at-least-once. Missing a message is a trust-breaking failure. Handling a duplicate is a silent client-side lookup. The \`client_message_id\` the sender includes is the idempotency key that makes at-least-once delivery safe." }, { "label": "Read Receipts at Scale", "icon": "👁️", "content": "### Write Amplification in Large Groups\\n\\nIn a 500-member group, every message read triggers a database write. 500 members reading 100 messages per day = 50,000 write operations per day for a single group — before indexing or replication overhead.\\n\\n**Tiered strategy by group size:**\\n\\n| Group Size | Strategy | Experience |\\n|-----------|----------|------------|\\n| < 50 members | Store individual receipts | Full per-user visibility |\\n| 50–200 members | Store a read count only | 'Read by 127 people' — no names |\\n| > 200 members | Disable read receipts | Write amplification is too high |\\n\\nThis tiered approach mirrors what WhatsApp uses in production: per-user receipts in DMs and small groups, aggregate counts in large broadcast groups." }, { "label": "Message Retention", "icon": "🗄️", "content": "### Retention Policies\\n\\n| Policy | Model | Primary Use Case |\\n|--------|-------|------------------|\\n| Unlimited | Store all messages forever | Personal chat, WhatsApp model |\\n| Time-based | Delete messages older than N days | Enterprise compliance, GDPR |\\n| Count-based | Keep last N messages per conversation | Controlled storage cost |\\n| Ephemeral | Auto-delete after being read | Snapchat, secure messaging |\\n\\n**Our choice:** unlimited server-side storage with optional per-conversation ephemeral mode.\\n\\nThis satisfies the common case — users expect full history — while supporting the privacy use case as an opt-in. For GDPR: the time-based policy can be applied per-tenant. The two modes are not mutually exclusive; a conversation can have both a retention window and ephemeral default." }, { "label": "E2E Encryption", "icon": "🔐", "content": "### What the Server Loses Access To\\n\\nThe API shape is **identical** with E2E encryption — the \`text\` field carries ciphertext instead of plaintext. But the server losing access to content has cascading consequences:\\n\\n**Capabilities lost:**\\n- **Server-side search** — impossible; must move to an on-device index over locally decrypted messages\\n- **Push notification preview** — cannot include message text; notification shows 'New message' only\\n- **Content moderation** — cannot scan for spam or abuse; must rely entirely on user reports\\n\\n**Capabilities retained:**\\n- Delivery guarantees and receipts — operate on envelope metadata, not content\\n- Group management and participant changes — structural, not content\\n- Presence and typing indicators — never carry message content\\n\\nSignal Protocol is the de facto standard; it uses a Double Ratchet algorithm providing forward secrecy and break-in recovery." } ] }
\`\`\`

\`\`\`concept
{ "title": "At-Least-Once Is the Only Viable Guarantee for Chat", "variant": "rule", "content": "For user-facing messaging, losing a message is a trust-breaking failure — users will report the app as broken. Delivering a duplicate is a minor annoyance the client can silently deduplicate with a hash map lookup. This asymmetry makes at-least-once the universal default for production chat systems. The client_message_id idempotency key is what converts at-least-once delivery into a safe, user-invisible operation." }
\`\`\`

## What Makes This a Strong Answer

\`\`\`callout
{ "type": "success", "title": "Interview Strength Signals", "content": "An interviewer is evaluating whether you understand the *why*, not just the *what*. These are the signals that separate a strong answer:\\n\\n1. **Dual transport with justification** — REST for reliability and caching, WebSocket for real-time push. Explain the reason, not just the choice.\\n2. **Client message ID** — demonstrates awareness of idempotency in distributed systems, not just API design.\\n3. **Read receipt batching** — marking the highest sequence number seen rather than every individual message shows you understand write cost.\\n4. **Presence heartbeats** — simple, explicit, predictable. Better than inferring presence from activity, which causes false negatives.\\n5. **Privacy controls** — read receipts and presence are user-configurable, not forced on. Shows product thinking.\\n6. **Offline sync endpoint** — explaining *why* it exists (WebSocket delivery leaves a gap when devices disconnect) shows you reason about failure modes.\\n7. **Group fan-out awareness** — naming write amplification as the scaling concern in large groups signals system design depth.\\n8. **E2E encryption trade-offs** — articulating what the server *loses* when it cannot read content distinguishes candidates who have thought through the full design." }
\`\`\`

\`\`\`quiz
{ "title": "Trade-off Reasoning Check", "questions": [ { "question": "A 500-member group sends 1,000 messages per day and every member reads every message. If you store individual read receipts per message, approximately how many receipt writes occur per day?", "options": ["1,000 writes", "50,000 writes", "500,000 writes", "5,000,000 writes"], "answer": 2, "explanation": "500 members × 1,000 messages = 500,000 receipt writes per day. This is the write amplification problem. Switching to a count-only strategy reduces it to 1,000 count increments per day — three orders of magnitude less work." }, { "question": "User A sends a message. The network drops before the server's 201 response arrives, and the client retries the same POST. What prevents a duplicate message from appearing in the conversation?", "options": ["The server checks for duplicate text content", "The client_message_id idempotency key", "The WebSocket acknowledgment system", "The monotonic sequence number"], "answer": 1, "explanation": "client_message_id is a UUID generated by the sender before the first transmission attempt. The server stores it alongside the message. On a duplicate POST, the server finds the existing row by client_message_id and returns the original message_id without inserting a new row. This is the standard idempotency pattern for at-least-once delivery." }, { "question": "With end-to-end encryption enabled, which capability must move from the server to the client device?", "options": ["Delivery acknowledgments", "Read receipts", "Full-text message search", "Presence indicators"], "answer": 2, "explanation": "With E2E encryption the server holds only ciphertext — it cannot index or search plaintext content. Full-text search must run on-device against a locally decrypted message store. Delivery acks, read receipts, and presence all operate on envelope metadata and remain server-side." }, { "question": "Why does our design assign a monotonic sequence number per conversation rather than using a global server timestamp for message ordering?", "options": ["Timestamps are slower to generate than sequence numbers", "Clock skew between distributed servers can violate total ordering; sequence numbers serialise writes per conversation for strict order", "Sequence numbers consume less database storage than timestamps", "Timestamps cannot be indexed efficiently in message tables"], "answer": 1, "explanation": "In a distributed system, clocks on different servers drift — two messages written milliseconds apart on different nodes can receive identical or inverted timestamps. A sequence number assigned by the shard that owns the conversation is strictly monotonic. The write serialisation is a trade-off, but it is scoped per-conversation, not globally, which keeps the bottleneck narrow." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The API uses dual transport by design: REST for reliable, cacheable CRUD operations and WebSocket for low-latency real-time events — neither replaces the other.", "At-least-once delivery with client_message_id idempotency is the correct guarantee for chat: a lost message is unacceptable; a deduplicated duplicate is invisible to the user.", "Read receipts in large groups require a tiered strategy — per-user receipts, aggregate counts, or disabled — to avoid prohibitive write amplification at scale.", "Monotonic sequence numbers per conversation give strict message ordering without global cross-shard coordination, scoping the serialisation bottleneck where it is most manageable.", "End-to-end encryption does not change the API shape but eliminates server-side search, notification previews, and content moderation — articulate these trade-offs explicitly.", "The offline sync endpoint (GET /sync/messages?since=token) is what closes the delivery gap for disconnected clients; WebSocket alone cannot guarantee delivery to devices that go offline." ] }
\`\`\``,
    },
  ],
};
