import { Module } from "../types";

export const twitterApiModule: Module = {
  id: "design-twitter-api",
  title: "Design Twitter API",
  description: "Design a complete API for a Twitter-like social platform — tweet CRUD, timelines, social graph, and real-world trade-offs.",
  lessons: [
    {
      id: "twitter-requirements",
      slug: "twitter-requirements",
      title: "Requirements & Resource Modeling",
      content: `# Design Twitter API: Requirements & Resource Modeling

This is one of the most popular API design interview questions. Before writing a single endpoint, the best candidates spend 5–10 minutes doing exactly what we cover here: clarifying what the system must do, then naming the things it operates on.

\`\`\`concept
{ "title": "Resource-First Thinking", "variant": "mental-model", "content": "A REST API is a vocabulary for manipulating resources. Before you design endpoints, identify every noun in the system. Endpoints, HTTP methods, and status codes follow naturally from the resource model — not the other way around." }
\`\`\`

## Step 1: Clarify Requirements

In an interview, always split requirements into two buckets before touching a whiteboard.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Functional",
      "icon": "✅",
      "content": "These define **what the system does**:\\n\\n- Users can create, read, and delete tweets (text ≤ 280 chars, optional media)\\n- Users can like and retweet tweets\\n- Users can follow/unfollow other users\\n- Users can view a **home timeline** — tweets from people they follow\\n- Users can view a **profile timeline** — all tweets by a specific user\\n\\nEach bullet maps to at least one resource and one endpoint group."
    },
    {
      "label": "Non-Functional",
      "icon": "⚙️",
      "content": "These define **how the system behaves under load**:\\n\\n- Timeline reads vastly outnumber writes — expect a **100:1 read-to-write ratio**\\n- Timelines must support **cursor-based pagination** (not offset) for efficiency\\n- API must be **RESTful and versioned** (\`/v1/...\`)\\n- IDs must be **globally unique and time-sortable** (e.g., Snowflake)\\n- Real-time push (WebSocket / SSE) is a stretch goal\\n\\nNon-functional requirements directly drive schema and architecture choices."
    }
  ]
}
\`\`\`

## Step 2: Identify Resources

Map each functional requirement to a **noun** (resource) and a **URI path**. This is the core of resource modeling.

\`\`\`sysdiag
{
  "title": "Twitter API Resource Hierarchy",
  "width": 680,
  "height": 380,
  "nodes": [
    { "id": "user",     "label": "User\\n/users",              "x": 340, "y": 40,  "kind": "service" },
    { "id": "tweet",    "label": "Tweet\\n/tweets",            "x": 160, "y": 160, "kind": "service" },
    { "id": "timeline", "label": "Timeline\\n/timeline",       "x": 520, "y": 160, "kind": "service" },
    { "id": "like",     "label": "Like\\n/tweets/{id}/likes",  "x": 60,  "y": 300, "kind": "database" },
    { "id": "rt",       "label": "Retweet\\n/tweets/{id}/retweets", "x": 260, "y": 300, "kind": "database" },
    { "id": "follow",   "label": "Follow\\n/users/{id}/following",  "x": 520, "y": 300, "kind": "database" }
  ],
  "edges": [
    { "from": "user",  "to": "tweet",    "label": "authors" },
    { "from": "user",  "to": "timeline", "label": "reads" },
    { "from": "user",  "to": "follow",   "label": "manages" },
    { "from": "tweet", "to": "like",     "label": "sub-resource" },
    { "from": "tweet", "to": "rt",       "label": "sub-resource" }
  ],
  "annotations": {
    "user":     "The central actor. All other resources are either authored by or associated with a User.",
    "tweet":    "The core content unit. Likes and Retweets are sub-resources expressed as nested paths under /tweets/{id}.",
    "timeline": "A computed resource — not stored as a flat list, but assembled from the social graph on read or pre-computed on write.",
    "follow":   "The social graph edge. Represented as a collection under /users/{id}/following for follower-followee queries."
  }
}
\`\`\`

## Step 3: Resource Schemas

### User Resource

\`\`\`json
{
  "id": "usr_abc123",
  "username": "janedoe",
  "display_name": "Jane Doe",
  "bio": "Software engineer & coffee enthusiast",
  "avatar_url": "https://cdn.example.com/avatars/usr_abc123.jpg",
  "follower_count": 1234,
  "following_count": 567,
  "tweet_count": 890,
  "created_at": "2024-01-15T10:00:00Z",
  "verified": true
}
\`\`\`

### Tweet Resource

\`\`\`json
{
  "id": "twt_xyz789",
  "author": {
    "id": "usr_abc123",
    "username": "janedoe",
    "display_name": "Jane Doe",
    "avatar_url": "https://cdn.example.com/avatars/usr_abc123.jpg"
  },
  "text": "Just shipped a new feature!",
  "media": [
    {
      "id": "med_001",
      "type": "image",
      "url": "https://cdn.example.com/media/med_001.jpg",
      "alt_text": "Screenshot of the new feature"
    }
  ],
  "like_count": 42,
  "retweet_count": 12,
  "reply_count": 5,
  "is_liked": false,
  "is_retweeted": false,
  "reply_to": null,
  "created_at": "2025-03-10T14:30:00Z"
}
\`\`\`

Notice that \`author\` is a **partial embed** — just enough to render the tweet without a second API call. The full user object lives at \`/users/{id}\`.

## Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/tweets | Create a tweet |
| GET | /v1/tweets/{id} | Get a tweet |
| DELETE | /v1/tweets/{id} | Delete a tweet |
| POST | /v1/tweets/{id}/likes | Like a tweet |
| DELETE | /v1/tweets/{id}/likes | Unlike a tweet |
| POST | /v1/tweets/{id}/retweets | Retweet |
| DELETE | /v1/tweets/{id}/retweets | Undo retweet |
| GET | /v1/timeline | Home timeline |
| GET | /v1/users/{id}/tweets | Profile timeline |
| POST | /v1/users/{id}/following | Follow a user |
| DELETE | /v1/users/{id}/following/{targetId} | Unfollow |
| GET | /v1/users/{id}/followers | List followers |
| GET | /v1/users/{id}/following | List following |

## Key Design Decisions

### Decision 1 — Snowflake IDs over UUIDs

Tweet IDs use a **Snowflake-style** format: a 64-bit integer encoding datacenter ID, worker ID, and millisecond timestamp. This makes IDs time-sortable without a separate timestamp index, which is critical for efficient timeline queries. The human-readable prefix (\`twt_\`, \`usr_\`) is an API-layer decoration added on serialization.

### Decision 2 — Partial Author Embedding

\`\`\`callout
{ "type": "tip", "title": "Embed for Read, Refer for Write", "content": "Embed a minimal \`author\` sub-object in each Tweet response to avoid N+1 fetches when rendering a timeline of 20 tweets. But don't duplicate the full User object — just the fields the UI needs (id, username, display_name, avatar_url). Full user data stays at \`/users/{id}\`." }
\`\`\`

### Decision 3 — Denormalized Counts

\`like_count\` and \`retweet_count\` are stored directly on the tweet row (denormalized) rather than computed with \`COUNT(*)\` at read time. This trades **strong consistency** for **read performance**. These fields are eventually consistent — a brief discrepancy after a burst of activity is acceptable.

### Decision 4 — Viewer-Specific Fields

\`is_liked\` and \`is_retweeted\` cannot be stored statically. They are computed **per-request** using the authenticated user's ID. This means the Timeline endpoint must accept an auth token and join against the likes/retweets table for each tweet in the response. Always call this out in an interview — it's a hidden read cost.

### Decision 5 — Timeline Fan-out Strategy

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Fan-out on Read (Pull Model)",
    "code": "// On timeline GET:\\n// For each of the 500 accounts I follow,\\n// fetch their latest tweets and merge-sort.\\n// Write cost: O(1)\\n// Read cost: O(followees × tweets_per_user)\\n// Problem: slow for users following 5,000 accounts"
  },
  "after": {
    "label": "Fan-out on Write (Push Model)",
    "code": "// On tweet POST:\\n// Push tweet ID into every follower's timeline cache.\\n// Write cost: O(N followers)\\n// Read cost: O(1) — pre-built feed\\n// Problem: a celebrity with 50M followers\\n//   triggers 50M cache writes per tweet\\n//\\n// Twitter's solution: hybrid — push for users\\n// with ≤10K followers, pull for celebrities."
  }
}
\`\`\`

The hybrid approach Twitter uses in production combines both: fan-out-on-write for ordinary users (O(1) reads) and fan-out-on-read for high-follower accounts (avoids write amplification). This is a standout point to raise in an interview.

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why are \`like_count\` and \`retweet_count\` stored directly on the Tweet resource rather than computed via COUNT(*)?",
      "options": [
        "To make the API schema simpler to document",
        "To avoid expensive aggregate queries on every timeline read",
        "Because SQL databases cannot perform COUNT() efficiently",
        "To enable real-time WebSocket updates"
      ],
      "answer": 1,
      "explanation": "Denormalizing counts onto the Tweet row trades strong consistency for read performance. Computing COUNT(*) across a likes table for every tweet in a 20-item timeline would be expensive. The trade-off is that counts are eventually consistent — briefly inaccurate after a write burst, but acceptable for most social platforms."
    },
    {
      "question": "What is the primary advantage of Snowflake-style IDs over random UUIDs for tweets?",
      "options": [
        "They are shorter and take less storage",
        "They are cryptographically secure",
        "They encode creation time, enabling time-ordered queries without a separate timestamp index",
        "They prevent ID collisions across microservices"
      ],
      "answer": 2,
      "explanation": "Snowflake IDs encode a millisecond timestamp in their high bits, making them monotonically increasing per worker. This allows the database to range-scan by ID to fetch tweets in chronological order, avoiding a secondary index on \`created_at\`."
    },
    {
      "question": "Why are \`is_liked\` and \`is_retweeted\` not stored as static fields on the Tweet resource?",
      "options": [
        "They are too large to store in a relational database",
        "They are viewer-specific and must be computed per-request based on the authenticated user",
        "Twitter's API does not expose this information for privacy reasons",
        "They are always false by default and only set client-side"
      ],
      "answer": 1,
      "explanation": "Whether the current viewer has liked or retweeted a tweet depends on who is asking. Storing a single boolean would only be correct for one user. The server must join the authenticated user's ID against the likes/retweets table for each tweet in the response — a hidden read cost worth flagging in an interview."
    },
    {
      "question": "In Twitter's hybrid timeline fan-out strategy, which approach is used for accounts with very large follower counts (e.g., celebrities)?",
      "options": [
        "Fan-out on Write — tweets are pushed to all 50M follower caches immediately",
        "Fan-out on Read — followers' feeds are assembled on demand at read time",
        "No timeline is generated — celebrity tweets are only surfaced via search",
        "Tweets are batched and pushed asynchronously every 5 minutes"
      ],
      "answer": 1,
      "explanation": "Fan-out on Write for a celebrity with 50M followers means 50M cache writes per tweet — unacceptably expensive. Twitter switches to Fan-out on Read for high-follower accounts: followers' timelines are assembled from the celebrity's tweet store at read time, avoiding write amplification. Ordinary users still get pre-computed (fan-out-on-write) feeds for O(1) reads."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Split requirements early: functional (what) vs non-functional (how) — each drives different design choices.",
    "Name your resources first. Every endpoint is just a verb applied to a noun you've already identified.",
    "Embed partial sub-objects (author in Tweet) to avoid N+1 fetches on high-read endpoints like timelines.",
    "Denormalize counts for read performance, but call out eventual consistency explicitly — interviewers expect it.",
    "Viewer-specific fields (is_liked, is_retweeted) are a hidden read cost: they require a per-request join against the authenticated user.",
    "Timeline fan-out is the deepest trade-off in this design: fan-out-on-write gives O(1) reads but fails for celebrities — Twitter's hybrid approach is the industry answer."
  ]
}
\`\`\``,
    },
    {
      id: "twitter-tweet-crud",
      slug: "twitter-tweet-crud",
      title: "Tweet CRUD Endpoints",
      content: `# Tweet CRUD Endpoints

Every social platform boils down to the same foundation: users create content, read it, and delete it. Before you can build timelines, notifications, or recommendations, you need these primitives right. This lesson walks through the full Tweet CRUD surface — including the less-obvious design decisions that separate a production API from a toy one.

\`\`\`concept
{ "title": "REST Resource Mapping for Tweets", "variant": "mental-model", "content": "A tweet is a resource at \`/tweets/{id}\`. Sub-actions (like, retweet) are sub-resources under it. POST creates, GET reads, DELETE removes — and idempotency is your friend everywhere. HTTP verbs aren't decoration; they carry semantic contracts that clients, proxies, and CDNs all rely on." }
\`\`\`

---

## Create a Tweet

The \`POST /api/v1/tweets\` endpoint accepts tweet text plus optional media references and a \`reply_to\` field for threading.

\`\`\`tabs
{ "tabs": [
  { "label": "Request", "icon": "📤", "content": "\`\`\`http\\nPOST /api/v1/tweets HTTP/1.1\\nAuthorization: Bearer <token>\\nContent-Type: application/json\\n\\n{\\n  \\"text\\": \\"Just shipped a new feature!\\",\\n  \\"media_ids\\": [\\"med_001\\"],\\n  \\"reply_to\\": null\\n}\\n\`\`\`" },
  { "label": "Response", "icon": "📥", "content": "\`\`\`http\\nHTTP/1.1 201 Created\\nLocation: /api/v1/tweets/twt_xyz789\\n\\n{\\n  \\"id\\": \\"twt_xyz789\\",\\n  \\"author\\": {\\n    \\"id\\": \\"usr_abc123\\",\\n    \\"username\\": \\"janedoe\\",\\n    \\"display_name\\": \\"Jane Doe\\",\\n    \\"avatar_url\\": \\"https://cdn.example.com/avatars/usr_abc123.jpg\\"\\n  },\\n  \\"text\\": \\"Just shipped a new feature!\\",\\n  \\"media\\": [\\n    { \\"id\\": \\"med_001\\", \\"type\\": \\"image\\", \\"url\\": \\"https://cdn.example.com/media/med_001.jpg\\" }\\n  ],\\n  \\"like_count\\": 0,\\n  \\"retweet_count\\": 0,\\n  \\"reply_count\\": 0,\\n  \\"reply_to\\": null,\\n  \\"created_at\\": \\"2025-03-10T14:30:00Z\\"\\n}\\n\`\`\`" },
  { "label": "Validation Rules", "icon": "✅", "content": "| Field | Rule | Error Code |\\n|-------|------|------------|\\n| \`text\` | 1–280 characters | \`TEXT_TOO_LONG\` |\\n| \`text\` | Required if no media | \`TEXT_OR_MEDIA_REQUIRED\` |\\n| \`media_ids\` | Max 4 images **or** 1 video | \`TOO_MANY_MEDIA\` |\\n| \`reply_to\` | Must reference an existing tweet | \`TWEET_NOT_FOUND\` |" }
] }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Return the full resource on create", "content": "Always return the complete tweet object on \`201 Created\` — not just an ID. Clients need the \`created_at\` timestamp, the resolved \`author\` object, and counters to render the tweet immediately without a follow-up GET. This single round-trip matters on mobile networks." }
\`\`\`

---

## Media Upload: The Pre-signed URL Pattern

Uploading a 10 MB video through your API server is a waste of bandwidth and a bottleneck. The industry-standard solution is **pre-signed URLs**: your server mints a short-lived URL pointing directly at cloud storage; the client uploads there without touching your API again.

\`\`\`steps
{ "title": "Media Upload Flow", "steps": [
  { "title": "Request an upload URL", "content": "Client calls \`POST /api/v1/media/upload-url\` with \`content_type\` and \`size_bytes\`. Server validates size limits, then generates a pre-signed PUT URL (e.g., via AWS S3 or GCS SDK).\\n\\n\`\`\`http\\nPOST /api/v1/media/upload-url\\n{ \\"content_type\\": \\"image/jpeg\\", \\"size_bytes\\": 2048000 }\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"media_id\\": \\"med_001\\",\\n  \\"upload_url\\": \\"https://uploads.example.com/presigned?token=abc\\",\\n  \\"expires_at\\": \\"2025-03-10T15:00:00Z\\"\\n}\\n\`\`\`" },
  { "title": "Client uploads directly to CDN", "content": "The client PUTs the raw bytes directly to \`upload_url\`. Your API server is never in the data path — the file goes client → CDN. This keeps your API servers lean and lets CDN edge nodes handle bandwidth." },
  { "title": "Reference media_id in tweet creation", "content": "After the upload succeeds, the client includes \`media_id\` in the tweet creation body. The API server now only needs to verify the media object exists and is owned by the calling user before creating the tweet." }
] }
\`\`\`

\`\`\`concept
{ "title": "Why decouple media upload from tweet creation?", "variant": "analogy", "content": "Think of it like a two-step check-in. The airline (your API) issues you a baggage tag (media_id) and tells you where the conveyor is (pre-signed URL). You load the bag yourself — the airline never carries it. Only after the bag is loaded do you use the tag to check in. Your API servers handle metadata; the CDN handles bytes." }
\`\`\`

---

## Read and Delete

### GET a Tweet

\`GET /api/v1/tweets/{tweet_id}\` returns the tweet with **viewer-relative fields** — \`is_liked\` and \`is_retweeted\` change per authenticated user.

\`\`\`http
GET /api/v1/tweets/twt_xyz789
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "id": "twt_xyz789",
  "author": { "id": "usr_abc123", "username": "janedoe" },
  "text": "Just shipped a new feature!",
  "like_count": 42,
  "is_liked": true,
  "is_retweeted": false
}
\`\`\`

### DELETE a Tweet

Only the tweet's author may delete it. Return \`204 No Content\` on success — no body needed.

\`\`\`http
DELETE /api/v1/tweets/twt_xyz789
Authorization: Bearer <token>

HTTP/1.1 204 No Content
\`\`\`

\`\`\`tabs
{ "tabs": [
  { "label": "403 Forbidden", "icon": "🚫", "content": "\`\`\`http\\nHTTP/1.1 403 Forbidden\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"FORBIDDEN\\",\\n    \\"message\\": \\"You can only delete your own tweets.\\"\\n  }\\n}\\n\`\`\`\\n\\nReturn \`403\` — not \`401\` — when the user *is* authenticated but lacks permission. \`401\` means unauthenticated." },
  { "label": "404 Not Found", "icon": "🔍", "content": "\`\`\`http\\nHTTP/1.1 404 Not Found\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"TWEET_NOT_FOUND\\",\\n    \\"message\\": \\"Tweet twt_999 does not exist.\\"\\n  }\\n}\\n\`\`\`\\n\\nAlways use a machine-readable \`code\` field alongside the human \`message\`. Clients key on \`code\`; humans read \`message\`." }
] }
\`\`\`

---

## Like / Unlike: Designing for Idempotency

Likes are a toggle — but mobile clients frequently retry requests due to network flakiness. The API must handle duplicate calls gracefully.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Fragile (throws on duplicate)", "code": "POST /tweets/twt_xyz789/likes\\n\\n# Second call returns:\\nHTTP/1.1 409 Conflict\\n{ \\"error\\": { \\"code\\": \\"ALREADY_LIKED\\" } }\\n\\n# Client must track state locally\\n# and avoid double-tapping — fragile." }, "after": { "label": "Idempotent (safe to retry)", "code": "POST /tweets/twt_xyz789/likes\\n\\n# First call:\\nHTTP/1.1 200 OK\\n{ \\"liked\\": true, \\"like_count\\": 43 }\\n\\n# Exact same call again:\\nHTTP/1.1 200 OK\\n{ \\"liked\\": true, \\"like_count\\": 43 }\\n\\n# Retry-safe. Mobile network drops? No problem." } }
\`\`\`

\`\`\`http
# Like
POST /api/v1/tweets/twt_xyz789/likes
HTTP/1.1 200 OK
{ "liked": true, "like_count": 43 }

# Unlike
DELETE /api/v1/tweets/twt_xyz789/likes
HTTP/1.1 200 OK
{ "liked": false, "like_count": 42 }
\`\`\`

\`\`\`concept
{ "title": "Idempotency Rule", "variant": "rule", "content": "An operation is idempotent if calling it N times produces the same result as calling it once. GET, PUT, and DELETE are idempotent by HTTP spec. POST is not — but you can *make* sub-actions like likes idempotent by design. Always prefer idempotency for toggles and state transitions; it makes your API resilient to the unreliable networks that real users have." }
\`\`\`

---

## Retweet

A retweet is itself a resource — it has its own ID and timestamps, and can be referenced when a user wants to undo it.

\`\`\`http
POST /api/v1/tweets/twt_xyz789/retweets
Authorization: Bearer <token>

HTTP/1.1 201 Created
{
  "id": "rt_001",
  "original_tweet": { "id": "twt_xyz789" },
  "retweeted_by": { "id": "usr_abc123" },
  "created_at": "2025-03-10T15:00:00Z"
}
\`\`\`

\`\`\`http
# Undo retweet
DELETE /api/v1/tweets/twt_xyz789/retweets
HTTP/1.1 204 No Content
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Retweet vs. Quote Tweet", "content": "A basic retweet just re-broadcasts the original tweet — no new text. A **quote tweet** is a new tweet with \`reply_to\` pointing at the original AND its own text body. In the schema, quote tweets are just tweets with a non-null \`reply_to\`. No special endpoint needed." }
\`\`\`

---

## Putting It Together: The Full CRUD Surface

\`\`\`sysdiag
{ "title": "Tweet CRUD Endpoint Map", "width": 640, "height": 320,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 160, "kind": "client" },
    { "id": "api", "label": "API Gateway", "x": 220, "y": 160, "kind": "service" },
    { "id": "tweet_svc", "label": "Tweet Service", "x": 400, "y": 100, "kind": "service" },
    { "id": "media_svc", "label": "Media Service", "x": 400, "y": 220, "kind": "service" },
    { "id": "db", "label": "Tweets DB", "x": 580, "y": 100, "kind": "database" },
    { "id": "cdn", "label": "CDN / Storage", "x": 580, "y": 220, "kind": "external" }
  ],
  "edges": [
    { "from": "client", "to": "api", "label": "CRUD requests" },
    { "from": "api", "to": "tweet_svc", "label": "routes" },
    { "from": "api", "to": "media_svc", "label": "media ops" },
    { "from": "tweet_svc", "to": "db", "label": "reads/writes" },
    { "from": "media_svc", "to": "cdn", "label": "pre-signed URL" },
    { "from": "client", "to": "cdn", "label": "direct upload" }
  ],
  "annotations": {
    "media_svc": "Issues pre-signed URLs for direct upload. Never proxies raw bytes through API servers.",
    "tweet_svc": "Handles create, read, delete, like, retweet. Enforces ownership checks on delete.",
    "api": "Authenticates bearer token, routes to downstream services"
  }
}
\`\`\`

---

\`\`\`quiz
{ "title": "Tweet CRUD Design Check", "questions": [
  {
    "question": "A client calls \`POST /tweets/twt_abc/likes\` twice in a row due to a network retry. The API is designed correctly. What should the second call return?",
    "options": ["409 Conflict with ALREADY_LIKED", "200 OK with the current like state", "201 Created again", "400 Bad Request"],
    "answer": 1,
    "explanation": "Idempotent like endpoints should return the current state on every call — 200 OK with \`{ liked: true, like_count: N }\`. A 409 Conflict forces clients to track local state and avoid retries, which is fragile on mobile networks."
  },
  {
    "question": "User A tries to delete a tweet authored by User B. Both users are authenticated. What HTTP status should the API return?",
    "options": ["401 Unauthorized", "403 Forbidden", "404 Not Found", "400 Bad Request"],
    "answer": 1,
    "explanation": "401 means the caller is not authenticated at all. 403 Forbidden means the caller IS authenticated but lacks permission for this specific resource. Since User A is authenticated but isn't the tweet author, 403 is correct."
  },
  {
    "question": "Why does the media upload pattern use pre-signed URLs instead of uploading media directly through the API server?",
    "options": [
      "Pre-signed URLs are more secure than bearer tokens",
      "It offloads bandwidth and processing from API servers to CDN/storage",
      "It allows the client to skip authentication",
      "It makes the media_id available before upload completes"
    ],
    "answer": 1,
    "explanation": "Pre-signed URLs let clients upload directly to cloud storage/CDN, bypassing your API servers entirely. This keeps API servers free for logic (not bandwidth), scales independently, and leverages CDN edge nodes for faster uploads globally."
  },
  {
    "question": "What HTTP status code should \`DELETE /tweets/twt_xyz789\` return on success?",
    "options": ["200 OK with a confirmation body", "201 Created", "204 No Content", "202 Accepted"],
    "answer": 2,
    "explanation": "204 No Content is the correct status for a successful DELETE — the resource is gone, there's nothing meaningful to return. 200 OK would imply a response body. 202 Accepted implies async processing hasn't completed yet."
  },
  {
    "question": "A quote tweet (retweeting with added commentary) should be modeled as:",
    "options": [
      "A special POST /tweets/{id}/quote endpoint",
      "A PATCH on the original tweet",
      "A new tweet with reply_to pointing at the original",
      "A new retweet resource with an optional text field"
    ],
    "answer": 2,
    "explanation": "A quote tweet is a first-class tweet — it has its own text, timestamps, and engagement counts. The simplest model: a new tweet with \`reply_to\` set to the original tweet's ID. No new endpoint or resource type required."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "POST /tweets returns 201 with the full tweet object — never just an ID — so clients can render immediately without a follow-up GET.",
  "Use pre-signed URLs for media: the client uploads directly to CDN, keeping your API servers out of the binary data path.",
  "Design likes and other toggles to be idempotent — duplicate calls return the current state, not an error — because mobile networks retry frequently.",
  "Return 403 Forbidden (not 401) when an authenticated user tries to delete someone else's tweet; 401 means unauthenticated.",
  "Quote tweets don't need a special endpoint — model them as regular tweets with a non-null reply_to field."
] }
\`\`\`

These CRUD primitives are the foundation. The real complexity comes next: building timeline APIs that fan out these tweets to millions of followers in milliseconds.`,
    },
    {
      id: "twitter-timeline",
      slug: "twitter-timeline",
      title: "Timeline & Feed API",
      content: `# Timeline & Feed API

The timeline is the core of Twitter's user experience — and the most technically challenging endpoint to design. Two distinct timeline types serve different purposes: the **home timeline** aggregates content from accounts the authenticated user follows, while the **user timeline** exposes a specific account's public posts.

\`\`\`concept
{
  "title": "Cursor-Based Pagination: The Bookmark Model",
  "variant": "mental-model",
  "content": "Think of a cursor as a bookmark in a constantly-growing book. Unlike page numbers that shift when new pages are inserted, a bookmark stays exactly where you left it. In a high-velocity timeline, new tweets arrive every millisecond — a 'page 2' request today returns completely different results than the same request one second later. A cursor encodes the *position* of the last-seen item (typically an opaque timestamp), so the next page always resumes immediately after where you stopped — no drift, no duplicates."
}
\`\`\`

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Offset Pagination — Breaks on live feeds",
    "code": "GET /timeline?page=2&limit=20\\n\\n// 5 new tweets arrive between page 1 and page 2 requests\\n// page=2 now overlaps with what was page=1\\n// Result: duplicate tweets appear in the client feed"
  },
  "after": {
    "label": "Cursor Pagination — Safe for real-time feeds",
    "code": "GET /timeline?limit=20\\n// Response includes cursor: \\"eyJ0IjoiMjAyNS0wMy0xMFQxNDoyMDowMFoifQ==\\"\\n\\nGET /timeline?cursor=eyJ0Ij...&limit=20\\n// Resumes from exact timestamp position\\n// New tweets never cause drift or duplicates"
  }
}
\`\`\`

## Home Timeline

Returns tweets from all accounts the authenticated user follows, ordered reverse-chronologically.

\`\`\`http
GET /api/v1/timeline?limit=20
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "data": [
    {
      "id": "twt_100",
      "type": "tweet",
      "author": { "id": "usr_456", "username": "johndoe" },
      "text": "Great morning for coding!",
      "like_count": 15,
      "is_liked": false,
      "created_at": "2025-03-10T14:30:00Z"
    },
    {
      "id": "rt_050",
      "type": "retweet",
      "retweeted_by": { "id": "usr_789", "username": "alice" },
      "original_tweet": {
        "id": "twt_090",
        "author": { "id": "usr_321", "username": "bob" },
        "text": "Check out this library!",
        "like_count": 200
      },
      "created_at": "2025-03-10T14:25:00Z"
    }
  ],
  "pagination": {
    "next_cursor": "eyJ0IjoiMjAyNS0wMy0xMFQxNDoyMDowMFoifQ==",
    "has_more": true
  }
}
\`\`\`

Three design decisions worth defending in an interview:

**The \`type\` field is a content discriminator.** A timeline mixes tweets, retweets, replies, and quote tweets. The \`type\` field tells the client which rendering path to use — no separate endpoints, no client-side shape inference.

**Retweets embed the original tweet.** Including \`original_tweet\` inline avoids a second round-trip to fetch the source content. The \`retweeted_by\` field identifies who performed the retweet.

**\`is_liked\` is user-contextual, not tweet-owned.** Whether a user has liked a tweet is a relationship between that user and the tweet — not a property of the tweet itself. Placing it on the timeline item means the server computes it once per request for the authenticated user, avoiding per-user denormalization at tweet-object scale.

## User Timeline

Returns a specific user's public tweets, accessible without authentication (subject to privacy settings).

\`\`\`http
GET /api/v1/users/usr_abc123/tweets?limit=20&include=replies
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "data": [
    { "id": "twt_100", "text": "My latest tweet", "created_at": "2025-03-10T14:30:00Z" },
    { "id": "twt_095", "text": "Reply to someone", "reply_to": "twt_080", "created_at": "2025-03-09T11:00:00Z" }
  ],
  "pagination": {
    "next_cursor": "eyJ0IjoiMjAyNS0wMy0wOVQxMDowMDowMFoifQ==",
    "has_more": true
  }
}
\`\`\`

**Supported query parameters:**

| Parameter | Values | Default |
|-----------|--------|---------|
| \`include\` | \`replies\`, \`retweets\` | retweets included, replies excluded |
| \`media_only\` | \`true\` / \`false\` | \`false\` |
| \`limit\` | 1–100 | \`20\` |

## Replies Thread

Fetches a full conversation: ancestors for context, the focal tweet, and its direct replies.

\`\`\`http
GET /api/v1/tweets/twt_100/replies?limit=20&sort=relevance

HTTP/1.1 200 OK
{
  "parent_chain": [
    { "id": "twt_080", "text": "Original tweet" },
    { "id": "twt_090", "text": "First reply", "reply_to": "twt_080" }
  ],
  "target_tweet": { "id": "twt_100", "text": "Second reply", "reply_to": "twt_090" },
  "replies": [
    { "id": "twt_110", "text": "Great point!", "reply_to": "twt_100" },
    { "id": "twt_111", "text": "I disagree because...", "reply_to": "twt_100" }
  ],
  "pagination": { "next_cursor": "...", "has_more": true }
}
\`\`\`

The three-part structure is deliberate: **\`parent_chain\`** resolves ancestors server-side — eliminating the cascading client requests that would otherwise be required for a deeply nested conversation. **\`target_tweet\`** is unambiguous to the client. **\`replies\`** are sortable by \`relevance\` (engagement-weighted) or \`recency\`.

## Fan-Out: The Architecture Question Behind the API

When an interviewer asks you to design a Twitter timeline, the real question is: *how do you efficiently deliver a single tweet to millions of followers?* This is the fan-out problem, and it has three answers.

\`\`\`concept
{
  "title": "The Fan-Out Problem",
  "variant": "analogy",
  "content": "Imagine a newspaper with 50 million subscribers. **Fan-out on write** is like printing 50 million personalised editions the moment news breaks — instant delivery for readers, but enormous cost at the press. **Fan-out on read** is like keeping one master copy in the archive — cheap to produce, but every subscriber must retrieve it themselves at peak demand. Twitter's **hybrid model** is like pre-printing editions for regular subscribers while keeping celebrity breaking news available on-demand from the wire — optimised for the common case without collapsing under celebrity traffic spikes."
}
\`\`\`

| Strategy | Write Cost | Read Cost | Best For |
|----------|-----------|-----------|---------|
| **Fan-out on write** (push) | O(N followers) | O(1) from cache | Regular users (< ~10k followers) |
| **Fan-out on read** (pull) | O(1) | O(M followed accounts) | Celebrity accounts |
| **Hybrid** | Low for high-fan-out | Low for both | Large-scale platforms |

\`\`\`sysdiag
{
  "title": "Hybrid Fan-Out Architecture",
  "width": 720,
  "height": 380,
  "nodes": [
    { "id": "writer", "label": "Write Service", "x": 80, "y": 60, "kind": "service" },
    { "id": "fanout", "label": "Fan-out Service", "x": 280, "y": 60, "kind": "service" },
    { "id": "check", "label": "Celebrity Check", "x": 500, "y": 60, "kind": "service" },
    { "id": "caches", "label": "Redis Timeline Caches", "x": 500, "y": 210, "kind": "database" },
    { "id": "store", "label": "Tweet Store", "x": 640, "y": 60, "kind": "database" },
    { "id": "reader", "label": "Timeline Read Service", "x": 80, "y": 300, "kind": "service" },
    { "id": "merge", "label": "Merge Layer", "x": 280, "y": 300, "kind": "service" }
  ],
  "edges": [
    { "from": "writer", "to": "fanout", "label": "new tweet" },
    { "from": "fanout", "to": "check", "label": "route" },
    { "from": "check", "to": "caches", "label": "regular user → push" },
    { "from": "check", "to": "store", "label": "celebrity → store only" },
    { "from": "reader", "to": "caches", "label": "precomputed feed" },
    { "from": "reader", "to": "store", "label": "pull celeb tweets" },
    { "from": "caches", "to": "merge", "label": "" },
    { "from": "store", "to": "merge", "label": "" }
  ],
  "annotations": {
    "fanout": "Routes writes based on follower-count threshold (e.g. >10k = celebrity path). Runs async via message queue to avoid blocking the write path.",
    "caches": "Stores ordered lists of tweet IDs per user. Redis sorted sets keyed by timestamp achieve O(1) read. Missing or invalidated caches trigger recomputation from the tweet store.",
    "merge": "Combines precomputed timeline with real-time celebrity tweets pulled at read time. Deduplicates overlapping IDs, re-ranks by timestamp, and returns the final feed to the client.",
    "store": "Source-of-truth for all tweets. Celebrity tweets are pulled here at read time rather than pre-fanned-out, avoiding O(N) write amplification for accounts with millions of followers."
  }
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "What Interviewers Actually Want to Hear",
  "content": "Don't just name the strategies — explain *why* the threshold exists. A celebrity with 50 million followers would trigger 50 million Redis writes per tweet. At Twitter's scale, this creates write-amplification spikes that overwhelm the cache tier. The hybrid model caps that amplification by pulling high-fan-out accounts at read time instead. Mentioning this trade-off signals that you understand the scale implications *behind* the API design, not just its surface shape."
}
\`\`\`

\`\`\`quiz
{
  "title": "Timeline & Feed API",
  "questions": [
    {
      "question": "Why is cursor-based pagination mandatory for a home timeline, while offset pagination is considered broken?",
      "options": [
        "Cursors are cheaper to compute on the server side",
        "New tweets arriving between requests cause offset pages to drift, creating duplicates or gaps",
        "Offset pagination doesn't support filtering by content type",
        "Cursors allow the client to jump to an arbitrary position in the timeline"
      ],
      "answer": 1,
      "explanation": "In a high-velocity timeline, new tweets arrive constantly. An offset of 20 means 'skip the first 20 items' — but if 5 new tweets arrived since the last request, positions 20–39 have shifted forward. Cursors encode a stable timestamp position, so the next page always starts immediately after the last-seen item regardless of new arrivals."
    },
    {
      "question": "A celebrity account with 80 million followers posts a tweet. In Twitter's hybrid fan-out model, what happens?",
      "options": [
        "The tweet is immediately written to all 80 million follower timeline caches",
        "The tweet is stored in the tweet store and pulled into follower timelines at read time",
        "The tweet is queued and fanned out in batches over the next hour",
        "The tweet is pushed only to followers who are currently online"
      ],
      "answer": 1,
      "explanation": "High-fan-out (celebrity) accounts use fan-out on read. Their tweets go to the tweet store but are NOT fanned out to follower caches — doing so would create O(N) write amplification (80 million cache writes per tweet). When a follower requests their timeline, the read service pulls celebrity tweets from the store and merges them with the precomputed cached feed."
    },
    {
      "question": "What is the purpose of the \`parent_chain\` field in the replies thread endpoint response?",
      "options": [
        "To enable server-side rendering of the full thread without JavaScript",
        "To provide ancestor context without forcing the client to make recursive upstream requests",
        "To allow moderation tools to trace the origin of a potentially harmful reply",
        "To support pagination of tweets that preceded the target tweet"
      ],
      "answer": 1,
      "explanation": "A reply shown in isolation is often meaningless without context. Rather than forcing the client to make a chain of requests (fetch twt_100 → it's a reply to twt_090 → fetch twt_090 → ...), the server resolves the ancestor chain in one response. This eliminates cascading round-trips and simplifies client rendering logic."
    },
    {
      "question": "Why is \`is_liked\` placed on the timeline item rather than on the tweet object itself?",
      "options": [
        "Likes are transient and expire after 24 hours",
        "The liked status differs per authenticated user, so it cannot be a property of the shared tweet object",
        "The tweet object schema is frozen and cannot be extended",
        "Placing it on the tweet would violate REST resource ownership principles"
      ],
      "answer": 1,
      "explanation": "Whether a tweet is liked is a relationship between a specific user and a tweet — not an intrinsic property of the tweet. User A may have liked it while User B has not. Storing \`is_liked\` on the tweet would require per-user denormalization at massive scale. Placing it on the user-contextual timeline item lets the server compute it once per request for the authenticated user."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use cursor-based pagination for any high-velocity feed — cursors encode a stable position (timestamp) so new content never causes drift or duplicates.",
    "A \`type\` discriminator field lets a single timeline endpoint serve tweets, retweets, replies, and quote tweets, each with different client rendering paths.",
    "Embed related objects inline (original tweet inside a retweet response) to avoid secondary round-trips — N+1 fetches at timeline scale are catastrophic.",
    "Fan-out on write delivers O(1) reads from cache but costs O(N followers) writes — dangerous at celebrity account scale.",
    "Fan-out on read costs O(M followed accounts) per timeline request — cheap for writes but slow for users following many active accounts.",
    "The hybrid model (Twitter's actual approach) pushes to regular-user caches and pulls celebrity tweets at read time, capping write amplification while maintaining low read latency.",
    "Thread endpoints should resolve the full parent chain server-side — eliminating cascading client requests that compound latency for deeply nested conversations."
  ]
}
\`\`\``,
    },
    {
      id: "twitter-social-graph",
      slug: "twitter-social-graph",
      title: "Follow/Unfollow & Social Graph",
      content: `# Follow/Unfollow & Social Graph

The social graph — who follows whom — is the connective tissue of any social platform. Every timeline, recommendation engine, and notification system is built on top of it. Getting this API right means understanding both the graph data model underneath and the UX invariants the client depends on.

\`\`\`concept
{ "title": "The Social Graph is a Directed Graph", "variant": "mental-model", "content": "Users are nodes. A follow relationship is a directed edge from follower → followee. Unlike Facebook's symmetric \\"friend\\" edge, Twitter-style follow is asymmetric: Alice can follow Bob without Bob following Alice. This single design choice shapes every data model, query pattern, and scaling trade-off in the system." }
\`\`\`

---

## Follow a User

\`\`\`http
POST /api/v1/users/usr_456/following
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "following": true,
  "user": {
    "id": "usr_456",
    "username": "johndoe",
    "follower_count": 1235
  }
}
\`\`\`

\`\`\`concept
{ "title": "Follow is Idempotent", "variant": "rule", "content": "POSTing /following when you already follow returns 200 with the current state — never a 4xx error. This is a safe default: network retries and double-clicks shouldn't break the UI. The server treats it as 'ensure this edge exists', not 'create this edge'." }
\`\`\`

## Unfollow a User

\`\`\`http
DELETE /api/v1/users/usr_456/following
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "following": false,
  "user": {
    "id": "usr_456",
    "username": "johndoe",
    "follower_count": 1234
  }
}
\`\`\`

Both follow and unfollow return the updated \`follower_count\` — the client can update the profile card without a separate fetch.

---

## Listing Followers and Following

\`\`\`tabs
{ "tabs": [
  {
    "label": "List Followers",
    "icon": "👥",
    "content": "\`\`\`http\\nGET /api/v1/users/usr_abc123/followers?limit=20\\nAuthorization: Bearer <token>\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"data\\": [\\n    {\\n      \\"id\\": \\"usr_789\\",\\n      \\"username\\": \\"alice\\",\\n      \\"display_name\\": \\"Alice Smith\\",\\n      \\"avatar_url\\": \\"https://cdn.example.com/avatars/usr_789.jpg\\",\\n      \\"bio\\": \\"Designer\\",\\n      \\"is_following\\": true,\\n      \\"is_followed_by\\": true\\n    },\\n    {\\n      \\"id\\": \\"usr_101\\",\\n      \\"username\\": \\"bob\\",\\n      \\"display_name\\": \\"Bob Johnson\\",\\n      \\"avatar_url\\": \\"https://cdn.example.com/avatars/usr_101.jpg\\",\\n      \\"bio\\": \\"Engineer\\",\\n      \\"is_following\\": false,\\n      \\"is_followed_by\\": true\\n    }\\n  ],\\n  \\"pagination\\": {\\n    \\"next_cursor\\": \\"eyJpZCI6InVzcl8xMDEifQ==\\",\\n    \\"has_more\\": true\\n  }\\n}\\n\`\`\`\\n\\n**Key relationship fields:**\\n- \`is_following\` — Does the *authenticated* user follow this person?\\n- \`is_followed_by\` — Does this person follow the *authenticated* user?\\n\\nThese two booleans power \\\\\\"Follows you\\\\\\" badges and mutual-follow indicators — rendering those from separate requests would cost N+1 lookups."
  },
  {
    "label": "List Following",
    "icon": "➡️",
    "content": "\`\`\`http\\nGET /api/v1/users/usr_abc123/following?limit=20\\nAuthorization: Bearer <token>\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"data\\": [\\n    {\\n      \\"id\\": \\"usr_456\\",\\n      \\"username\\": \\"johndoe\\",\\n      \\"is_following\\": true,\\n      \\"is_followed_by\\": false\\n    }\\n  ],\\n  \\"pagination\\": { \\"next_cursor\\": \\"...\\", \\"has_more\\": true }\\n}\\n\`\`\`\\n\\nBoth endpoints use **cursor-based pagination** — not \`page=N\` offsets. A cursor encodes the position in the result set so that insertions mid-list don't cause duplicate or skipped rows when the client fetches the next page."
  }
] }
\`\`\`

---

## Batch Relationship Check

Rendering a list of 20 users with accurate "Follow" buttons requires knowing the relationship to each one. Making 20 individual \`/users/:id/relationship\` calls is an N+1 problem. The batch endpoint solves this:

\`\`\`http
POST /api/v1/users/relationships
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_ids": ["usr_456", "usr_789", "usr_101"]
}
\`\`\`

\`\`\`json
{
  "relationships": {
    "usr_456": { "following": true,  "followed_by": false, "muted": false, "blocked": false },
    "usr_789": { "following": true,  "followed_by": true,  "muted": false, "blocked": false },
    "usr_101": { "following": false, "followed_by": true,  "muted": false, "blocked": false }
  }
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why POST for a read operation?", "content": "The batch endpoint uses POST because \`user_ids\` is a body payload — some HTTP clients and proxies truncate long query strings, making \`GET /relationships?ids=...\` unreliable when batches are large. POST sidesteps the URL-length constraint while remaining semantically safe (idempotent, no side effects)." }
\`\`\`

---

## Block and Mute

Beyond follow/unfollow, every social graph needs safety controls. Block and mute are fundamentally different primitives:

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Mute — soft filter", "code": "POST /api/v1/users/usr_456/mute\\nHTTP/1.1 200 OK\\n{ \\"muted\\": true }\\n\\n// Effect: usr_456's tweets are hidden\\n// from your timeline. You still follow\\n// them. They cannot tell they're muted.\\n// Reversible: DELETE /users/usr_456/mute" }, "after": { "label": "Block — hard boundary", "code": "POST /api/v1/users/usr_456/block\\nHTTP/1.1 200 OK\\n{ \\"blocked\\": true }\\n\\n// Effects (all automatic):\\n// - Unfollows in BOTH directions\\n// - Blocked user cannot see your tweets\\n// - Blocked user cannot follow you\\n// - Blocked user cannot message you\\n// - Their tweets excluded from your feed" } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Block has cascading side effects", "content": "When usr_A blocks usr_B, the server must atomically: (1) delete the A→B follow edge if it exists, (2) delete the B→A follow edge if it exists, (3) insert the block record. If any step fails mid-way the social graph is inconsistent. This is typically done inside a database transaction." }
\`\`\`

---

## Error Cases

The follow endpoint has three distinct failure modes that require separate error codes — clients need to distinguish them to show the right UI state:

\`\`\`steps
{ "title": "Follow error taxonomy", "steps": [
  { "title": "CANNOT_FOLLOW_SELF (422)", "content": "\`\`\`http\\nPOST /api/v1/users/usr_abc123/following\\nHTTP/1.1 422 Unprocessable Entity\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"CANNOT_FOLLOW_SELF\\",\\n    \\"message\\": \\"You cannot follow yourself.\\"\\n  }\\n}\\n\`\`\`\\n**When:** The authenticated user's ID matches the target user ID. Validated server-side even if the UI hides the follow button on your own profile." },
  { "title": "USER_BLOCKED (403)", "content": "\`\`\`http\\nPOST /api/v1/users/usr_456/following\\nHTTP/1.1 403 Forbidden\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"USER_BLOCKED\\",\\n    \\"message\\": \\"You cannot follow a user you have blocked.\\"\\n  }\\n}\\n\`\`\`\\n**When:** The authenticated user has previously blocked the target. Must unblock first." },
  { "title": "BLOCKED_BY_USER (403)", "content": "\`\`\`http\\nPOST /api/v1/users/usr_456/following\\nHTTP/1.1 403 Forbidden\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"BLOCKED_BY_USER\\",\\n    \\"message\\": \\"This user has blocked you.\\"\\n  }\\n}\\n\`\`\`\\n**When:** The target user has blocked the authenticated user. **Privacy note:** both block codes return 403 — but their messages intentionally differ so the blocked party knows they are blocked (this is Twitter's real behavior). Some designs unify them as a generic 404 to avoid leaking block status." }
] }
\`\`\`

---

## Data Model: Directed Adjacency List

The social graph is stored as a directed edge table — the classic adjacency list representation:

\`\`\`sysdiag
{ "title": "Social Graph Storage Model", "width": 680, "height": 320,
  "nodes": [
    { "id": "follows", "label": "follows", "x": 340, "y": 80, "kind": "database" },
    { "id": "userA", "label": "usr_abc123\\n(Alice)", "x": 120, "y": 220, "kind": "client" },
    { "id": "userB", "label": "usr_456\\n(Bob)", "x": 340, "y": 220, "kind": "client" },
    { "id": "userC", "label": "usr_789\\n(Carol)", "x": 560, "y": 220, "kind": "client" }
  ],
  "edges": [
    { "from": "userA", "to": "follows", "label": "follower_id = usr_abc123" },
    { "from": "userB", "to": "follows", "label": "followed_id = usr_456" },
    { "from": "userC", "to": "follows", "label": "bi-directional with Alice" }
  ],
  "annotations": {
    "follows": "follows(follower_id, followed_id, created_at). Composite PK on (follower_id, followed_id). Index on followed_id for reverse lookups. Space complexity O(V+E) — efficient for sparse graphs where each user follows a small fraction of the total.",
    "userA": "Alice follows Bob and Carol",
    "userC": "Carol and Alice mutually follow each other"
  }
}
\`\`\`

The three queries the social graph must answer efficiently map directly to indexes:

| Query | SQL Pattern | Index |
|---|---|---|
| Who does X follow? | \`WHERE follower_id = X\` | Primary key (follower_id, followed_id) |
| Who follows X? | \`WHERE followed_id = X\` | Secondary index on followed_id |
| Does X follow Y? | \`WHERE follower_id = X AND followed_id = Y\` | Primary key — O(1) lookup |

\`\`\`collapse
{ "title": "Deep Dive: Scaling the Social Graph Beyond a Single Database", "content": "At Twitter scale (hundreds of millions of users, hundreds of billions of edges), the follows table cannot live on a single node.\\n\\n**Sharding by follower_id** makes 'who does X follow?' fast (one shard) but 'who follows X?' (a celebrity with 50M followers) requires scatter-gather across all shards.\\n\\n**Sharding by followed_id** flips the problem — fan-out reads for followers of a celebrity are fast, but building a user's outgoing following list requires scatter-gather.\\n\\n**Practical approach:** Maintain two materialized views — a 'following list' sharded by follower_id and a 'followers list' sharded by followed_id — kept in sync via an event stream. This trades write amplification (every follow writes to two places) for read locality.\\n\\n**Graph databases** (Neo4j, Amazon Neptune) model edges natively and excel at multi-hop traversal queries like 'who does Alice follow that Bob also follows?' But for the simple 1-hop lookups a social feed requires, a well-indexed relational table often outperforms a graph DB while being operationally simpler. The adjacency list in an RDBMS has O(V+E) space complexity vs O(V²) for an adjacency matrix — critical when the graph is sparse (most users follow thousands, not millions)." }
\`\`\`

---

\`\`\`quiz
{ "title": "Social Graph API — Check Your Understanding", "questions": [
  {
    "question": "A client renders a list of 50 suggested users with Follow buttons. Which approach correctly fetches relationship state for all 50 without an N+1 problem?",
    "options": [
      "GET /api/v1/users/:id/relationship called 50 times in parallel",
      "POST /api/v1/users/relationships with user_ids array",
      "Include relationship data in the suggested-users endpoint response",
      "Both B and C are valid approaches"
    ],
    "answer": 3,
    "explanation": "Both B (batch relationship endpoint) and C (embedding relationship state in the list response) avoid N+1 lookups. C is often better for the initial render since it's one request total; B is better when you need to refresh relationship state independently after a user action."
  },
  {
    "question": "What is the space complexity of representing a social graph as an adjacency list with V users and E follow relationships?",
    "options": [
      "O(V²)",
      "O(E²)",
      "O(V + E)",
      "O(V × E)"
    ],
    "answer": 2,
    "explanation": "An adjacency list stores each node and each edge once: O(V + E). An adjacency matrix would require O(V²) space — impractical for a social network where E << V², since most users follow a tiny fraction of all users (sparse graph)."
  },
  {
    "question": "When user A blocks user B, which of the following side effects should the server apply?",
    "options": [
      "Only prevent B from seeing A's tweets going forward",
      "Delete A→B follow edge only, insert block record",
      "Delete A→B and B→A follow edges, insert block record, prevent future follows",
      "Mute B from A's timeline and notify B that they were blocked"
    ],
    "answer": 2,
    "explanation": "Blocking must be atomic and bidirectional: remove both follow edges (A→B and B→A), insert the block record, and enforce the constraint that B cannot re-follow A. Mute is a separate, softer action. Blocked users are not notified — that's a deliberate privacy/safety design choice."
  },
  {
    "question": "Why does the followers list endpoint include both \`is_following\` and \`is_followed_by\` fields on each returned user?",
    "options": [
      "To allow pagination across large follower lists",
      "To enable Follows-you badges and mutual-follow UI indicators without extra requests",
      "To enforce rate limiting on follow actions",
      "To support the batch relationship endpoint"
    ],
    "answer": 1,
    "explanation": "\`is_following\` (does the viewer follow this person?) and \`is_followed_by\` (does this person follow the viewer?) together let the client render mutual-follow indicators and Follows-you labels in a single response. Without them, the client would need a separate relationship lookup per user in the list."
  },
  {
    "question": "Why is cursor-based pagination preferred over offset pagination for follower lists?",
    "options": [
      "Cursor pagination is faster for small lists",
      "Offset pagination requires a graph database",
      "Offset pagination produces duplicates or skips rows when new follows are inserted mid-page",
      "Cursor pagination reduces the size of the response payload"
    ],
    "answer": 2,
    "explanation": "With offset pagination, \`OFFSET 20 LIMIT 20\` shifts if a new row is inserted before position 20 — the client sees a duplicate or skips an entry. A cursor encodes the last-seen row's position stably, so inserts elsewhere in the list don't affect subsequent page fetches."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "The social graph is a directed adjacency list: (follower_id, followed_id, created_at). Three indexes cover every 1-hop query in constant time.",
  "Follow and unfollow are idempotent — repeated requests return the current state, never an error. This makes retries and optimistic UI safe.",
  "Always embed \`is_following\` and \`is_followed_by\` in list responses to avoid N+1 lookups; use the batch relationship endpoint when rendering user lists independently.",
  "Block has cascading, atomic side effects (removes both follow edges); mute is a soft, invisible filter. Never conflate them.",
  "At scale, the follows table is sharded by follower_id and followed_id separately into two materialized views — trading write amplification for read locality."
] }
\`\`\``,
    },
    {
      id: "twitter-walkthrough",
      slug: "twitter-walkthrough",
      title: "API Walkthrough & Trade-offs",
      content: `# Twitter API: Walkthrough & Trade-offs

Every API design interview converges on the same moment: you've sketched the endpoints, and now the interviewer says "walk me through it." This lesson is about what separates a strong answer from a great one — knowing *why* each decision was made, and being able to articulate the trade-off you didn't take.

\`\`\`concept
{ "title": "The Trade-off is the Answer", "variant": "mental-model", "content": "In an API design interview, your endpoint list is table stakes. The interviewer is really asking: do you understand the forces that shaped each decision? Every choice — cursor vs. offset, embed vs. ID, REST vs. GraphQL — has a cost. Naming the cost is what gets you the offer." }
\`\`\`

---

## Complete Endpoint Reference

| Category | Method | Endpoint | Auth | Rate Limit |
|----------|--------|----------|------|-----------|
| **Tweets** | POST | /api/v1/tweets | Required | 300/3h |
| | GET | /api/v1/tweets/{id} | Optional | 900/15min |
| | DELETE | /api/v1/tweets/{id} | Required (owner) | 300/15min |
| **Likes** | POST | /api/v1/tweets/{id}/likes | Required | 1000/24h |
| | DELETE | /api/v1/tweets/{id}/likes | Required | 1000/24h |
| **Retweets** | POST | /api/v1/tweets/{id}/retweets | Required | 300/3h |
| | DELETE | /api/v1/tweets/{id}/retweets | Required | 300/3h |
| **Timeline** | GET | /api/v1/timeline | Required | 180/15min |
| | GET | /api/v1/users/{id}/tweets | Optional | 900/15min |
| **Social** | POST | /api/v1/users/{id}/following | Required | 400/24h |
| | DELETE | /api/v1/users/{id}/following | Required | 400/24h |
| | GET | /api/v1/users/{id}/followers | Optional | 15/15min |
| | GET | /api/v1/users/{id}/following | Optional | 15/15min |
| **Media** | POST | /api/v1/media/upload-url | Required | 300/15min |

Notice the rate limit asymmetry: reads are cheap (900/15min), social graph reads are expensive to serve (15/15min). This reflects real cost structures — follower lists fan out across shards.

---

## Authentication Layers

\`\`\`tabs
{ "tabs": [
  { "label": "Public Reads", "icon": "🔓", "content": "**GET /tweets/{id}, GET /users/{id}/tweets**\\n\\nAccepted with an API key (app context) or an OAuth 2.0 Bearer token. No user identity required. Rate limits apply per app token, not per user.\\n\\n\`\`\`\\nAuthorization: Bearer <app_access_token>\\n\`\`\`\\n\\nThis allows unauthenticated web crawlers (Google, SEO bots) to read public content without OAuth overhead." },
  { "label": "User Actions", "icon": "🔐", "content": "**POST /tweets, POST /likes, GET /timeline**\\n\\nRequires an OAuth 2.0 Bearer token issued via Authorization Code flow. The token encodes user identity and granted scopes.\\n\\n\`\`\`\\nAuthorization: Bearer <user_access_token>\\nScopes: tweet.read tweet.write like.write\\n\`\`\`\\n\\nRate limits apply per token (user context), so one misbehaving user cannot exhaust limits for others." },
  { "label": "Third-Party Apps", "icon": "🏗️", "content": "**OAuth 2.0 Authorization Code + PKCE**\\n\\nThird-party apps (like TweetDeck or Buffer) redirect users to an authorization page, receive a code, and exchange it for an access token + refresh token. PKCE (Proof Key for Code Exchange) prevents code-interception attacks in mobile/SPA flows.\\n\\n\`\`\`\\n1. App redirects → /oauth/authorize?client_id=...&code_challenge=...\\n2. User approves → /oauth/callback?code=...\\n3. App exchanges code → POST /oauth/token\\n4. App uses Bearer token → API calls\\n\`\`\`" }
] }
\`\`\`

---

## The Five Trade-offs That Matter

\`\`\`tabs
{ "tabs": [
  { "label": "Embedded Author", "icon": "👤", "content": "**Choice: Embed minimal author object in each tweet**\\n\\n| Approach | Pros | Cons |\\n|----------|------|------|\\n| Embed author | Single request, no N+1 | Stale data if name changes, larger payload |\\n| Author ID only | Always fresh, smaller payload | N+1 queries, client-side joining |\\n\\n**Justification:** Timeline rendering is the hot path. Embedding \`{ id, username, avatar_url }\` eliminates 20+ follow-up requests per page load. Author display names change rarely, so staleness of minutes is acceptable. The embed stays minimal — no follower counts, no bio — just what the UI needs to render a tweet card." },
  { "label": "Denormalized Counts", "icon": "🔢", "content": "**Choice: Store like_count and retweet_count directly on the tweet row**\\n\\nInstead of \`SELECT COUNT(*) FROM likes WHERE tweet_id = ?\` on every read, the count is pre-computed and cached on the tweet object itself.\\n\\n**Eventual consistency trade-off:** A like triggers an atomic counter increment (Redis \`INCR\` or DB \`UPDATE tweets SET like_count = like_count + 1\`). The number a client sees may lag by seconds under heavy write load. This is acceptable — users do not need real-time precision on social counts.\\n\\n**Alternative:** \`GET /tweets/{id}/stats\` — a separate, always-accurate endpoint. More correct, but adds a round-trip on every tweet render. Use this only if the product requires it (e.g., analytics dashboards)." },
  { "label": "Cursor Pagination", "icon": "📄", "content": "**Choice: Cursor-based pagination for timelines**\\n\\nWith offset pagination, page 2 is: \`LIMIT 20 OFFSET 20\`. But between your page 1 and page 2 requests, 3 new tweets are inserted. Now your offset is off by 3 — you either see duplicates or miss items entirely.\\n\\nCursors solve this by encoding position, not offset:\\n\\n\`\`\`\\nGET /api/v1/timeline?cursor=eyJ0d2VldF9pZCI6IjE4MDAwMCJ9&limit=20\\n\\nResponse:\\n{\\n  \\"tweets\\": [...],\\n  \\"next_cursor\\": \\"eyJ0d2VldF9pZCI6IjE3OTk4MCJ9\\",\\n  \\"has_more\\": true\\n}\\n\`\`\`\\n\\nThe cursor is typically an opaque base64-encoded JSON object containing the last seen tweet ID and timestamp. Clients never parse it — they just pass it back." },
  { "label": "Like Idempotency", "icon": "♻️", "content": "**Choice: POST /likes is idempotent — sending it twice does not create two likes**\\n\\nOn mobile, network conditions are unreliable. A user taps the like button, the request times out, the app retries. Without idempotency, the user has now sent two likes — or worse, the server errors on the second one and the client shows an inconsistent state.\\n\\n**Implementation options:**\\n- **Upsert:** \`INSERT INTO likes (...) ON CONFLICT DO NOTHING\` — zero application logic\\n- **Check-then-insert:** Read before write — race condition risk under concurrent requests\\n- **Return 200 on repeat:** Do not return 409 Conflict on a duplicate like. The client is asking for a known-good state, not a unique creation.\\n\\nThe same principle applies to follows, retweets, and bookmarks." },
  { "label": "REST vs. GraphQL", "icon": "🔀", "content": "**Choice: REST for the core API, GraphQL as an optional BFF for mobile**\\n\\nREST requires multiple round-trips for a timeline render: timeline + user details + relationship status. GraphQL resolves this with a single query:\\n\\n\`\`\`graphql\\nquery {\\n  timeline(first: 20) {\\n    edges {\\n      node {\\n        text\\n        author { username avatarUrl isFollowing }\\n        likeCount\\n        isLiked\\n      }\\n    }\\n  }\\n}\\n\`\`\`\\n\\n**Why REST first:** Simpler, HTTP caching works out of the box, and most teams are already familiar with it. GraphQL introduces query depth attacks, N+1 resolver problems, and complex rate-limiting logic.\\n\\n**Why GraphQL later:** A GraphQL BFF (Backend For Frontend) can sit in front of the REST API for mobile clients without changing the core. Twitter's own home timeline API uses a GraphQL endpoint internally." }
] }
\`\`\`

---

## System Architecture: Read vs. Write Paths

\`\`\`sysdiag
{ "title": "Twitter API — Data Flow", "width": 700, "height": 380,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 190, "kind": "client" },
    { "id": "api", "label": "API Gateway", "x": 200, "y": 190, "kind": "service" },
    { "id": "tweet_svc", "label": "Tweet Service", "x": 370, "y": 100, "kind": "service" },
    { "id": "timeline_svc", "label": "Timeline Service", "x": 370, "y": 280, "kind": "service" },
    { "id": "db", "label": "Primary DB", "x": 540, "y": 100, "kind": "database" },
    { "id": "cache", "label": "Redis Cache", "x": 540, "y": 280, "kind": "database" },
    { "id": "fanout", "label": "Fan-out Queue", "x": 370, "y": 190, "kind": "queue" }
  ],
  "edges": [
    { "from": "client", "to": "api", "label": "request" },
    { "from": "api", "to": "tweet_svc", "label": "POST /tweets" },
    { "from": "api", "to": "timeline_svc", "label": "GET /timeline" },
    { "from": "tweet_svc", "to": "db", "label": "write" },
    { "from": "tweet_svc", "to": "fanout", "label": "async" },
    { "from": "fanout", "to": "cache", "label": "fan-out" },
    { "from": "timeline_svc", "to": "cache", "label": "read" }
  ],
  "annotations": {
    "fanout": "On tweet creation, the Fan-out Queue asynchronously pushes the tweet ID into each follower's timeline cache (a Redis sorted set scored by timestamp). This is why timelines are fast to read — they are pre-computed.",
    "cache": "Timeline cache stores sorted sets: key=user_id, members=tweet_ids, scores=timestamps. GET /timeline reads from here, not the DB.",
    "db": "Write path lands here first. Tweet deletion requires removing from this DB, the author's timeline, and all follower timelines cached in Redis."
  }
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Cache Invalidation Edge Cases", "content": "Two operations force cache cleanup beyond simple deletion:\\n\\n- **Tweet deletion:** Remove from author timeline + all follower timeline caches. At scale (millions of followers) this is done lazily — mark tweet as deleted in DB, filter on read.\\n- **User block:** Remove blocked user's tweets from the blocker's timeline. Again done lazily at read time for large follow graphs." }
\`\`\`

---

## API Versioning: A Quick Decision Framework

URI versioning (\`/api/v1/...\`) is the choice here — it is visible in logs, easy to route, and trivial to cache. The alternatives exist but have real costs:

| Strategy | Example | Cache-friendly | Browser-testable | Complexity |
|----------|---------|---------------|-----------------|-----------|
| **URI** | \`/v1/tweets\` | Yes | Yes | Low |
| **Header** | \`Accept: application/vnd.twitter.v1+json\` | Harder | No | Medium |
| **Query param** | \`/tweets?version=1\` | Limited | Yes | Low |

\`\`\`callout
{ "type": "tip", "title": "Deprecation Policy Matters as Much as Versioning", "content": "An interviewer will ask: what happens when you need to break v1? Strong answers include:\\n- A minimum 6-month deprecation window with sunset headers (\`Sunset: Sat, 01 Jan 2027 00:00:00 GMT\`)\\n- Migration guides and changelog entries\\n- v2 running in parallel before v1 is removed\\n\\nVersioning without a deprecation policy just defers the pain." }
\`\`\`

---

\`\`\`quiz
{ "title": "Trade-off Checkpoint", "questions": [
  {
    "question": "A timeline uses offset pagination. Between page 1 and page 2 requests, 5 new tweets are posted. What happens?",
    "options": [
      "The client sees the 5 new tweets at the top of page 2",
      "Page 2 may contain duplicates or skip items due to shifted offsets",
      "The server returns a 409 Conflict error",
      "Pagination resets and the client returns to page 1"
    ],
    "answer": 1,
    "explanation": "With offset pagination, LIMIT 20 OFFSET 20 skips the first 20 rows at query time. If 5 rows were inserted before the query runs, the offset now points to a different position — causing duplicates or missed items. Cursor pagination solves this by encoding position rather than row count."
  },
  {
    "question": "Why should POST /likes return 200 (not 409) when the user has already liked the tweet?",
    "options": [
      "HTTP 409 is deprecated and should never be used",
      "Mobile clients retry failed requests; idempotency prevents double-likes and simplifies client logic",
      "Returning 200 avoids logging the error in the server",
      "OAuth tokens cannot distinguish between first and second requests"
    ],
    "answer": 1,
    "explanation": "Network unreliability on mobile means clients retry timed-out requests. Making POST /likes idempotent means the second (retry) call reaches the same final state — tweet is liked — without the client needing to handle a conflict error. The server uses an upsert: INSERT ... ON CONFLICT DO NOTHING."
  },
  {
    "question": "You embed a minimal author object {id, username, avatar_url} in every tweet response. A user changes their display name. What is the correct trade-off characterization?",
    "options": [
      "This is a bug that must be fixed with strong consistency",
      "Embedding introduces eventual consistency — old tweets may show the old name for minutes, which is acceptable on the timeline hot path",
      "Embedding is wrong; always use author IDs and N+1 fetch",
      "The author object should include the full user profile to avoid any future round-trips"
    ],
    "answer": 1,
    "explanation": "Embedding the author eliminates N+1 requests on the timeline hot path. The trade-off is that cached tweet responses may show a stale display name for minutes after a name change. For a social platform this is acceptable — users can tolerate eventual consistency on display names. The key is keeping the embed minimal (id, username, avatar_url only) to limit stale surface area."
  },
  {
    "question": "When would you recommend adding a GraphQL BFF on top of a REST Twitter API?",
    "options": [
      "Always — GraphQL is strictly better than REST",
      "When mobile clients need to fetch timelines, user details, and relationship status in a single round-trip, and REST over-fetching becomes a measurable latency problem",
      "Only when the REST API is deprecated",
      "Never — GraphQL introduces too many security risks for public APIs"
    ],
    "answer": 1,
    "explanation": "A GraphQL BFF (Backend For Frontend) is additive — it sits in front of the REST API for mobile clients without changing the core. The right trigger is a measured problem: multiple round-trips causing latency, or significant over-fetching on constrained mobile networks. Twitter uses GraphQL internally for exactly this reason, while still exposing REST endpoints publicly."
  }
] }
\`\`\`

---

## What Earns Full Marks in the Interview

\`\`\`steps
{ "title": "Strong Answer Checklist", "steps": [
  { "title": "Clear resource modeling", "content": "Every entity (Tweet, User, Like) is a first-class resource with a consistent schema. Fields are named consistently across endpoints — \`created_at\` not sometimes \`createdAt\`, \`author_id\` not sometimes \`user_id\`." },
  { "title": "Correct HTTP semantics", "content": "POST creates, DELETE removes, GET is safe and idempotent. Status codes are specific: 201 on create, 204 on delete, 404 when not found, 401 vs 403 distinguished. You explain *why* each code, not just list them." },
  { "title": "Timeline with cursor pagination and fan-out", "content": "Explain that offset pagination breaks under write velocity. Explain that timelines are pre-computed (fan-out on write to Redis sorted sets) for read performance. Mention the trade-off: fan-out is expensive for celebrity users with millions of followers (hybrid fan-out is the mitigation)." },
  { "title": "Idempotent social graph mutations", "content": "Follow, like, and retweet are all idempotent. POST /following twice leaves the user followed once. This is critical for mobile reliability. Contrast with creating a tweet, which is NOT idempotent — duplicate prevention requires a client-supplied idempotency key." },
  { "title": "Rate limiting and auth strategy articulated", "content": "Rate limits are per-endpoint and per-token-type (user context vs. app context). Auth uses OAuth 2.0 with PKCE for third-party apps. Public reads work with an API key. You know which endpoints are public and why." },
  { "title": "At least 2–3 trade-offs with reasoning", "content": "For each trade-off you name the choice, the cost you accepted, and the cost you avoided. 'We chose cursor pagination because offset breaks under write velocity' is a complete answer. 'We chose cursor pagination' is not." }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Cursor pagination is non-negotiable for high-write timelines — offset pagination produces duplicates and gaps as new content arrives between requests.",
  "Embed minimal author data in tweet responses to eliminate N+1 fetches on the hot read path; accept minutes of eventual consistency on display names.",
  "Make all social mutations idempotent (like, follow, retweet) — mobile retries make idempotency a correctness requirement, not just a nice-to-have.",
  "REST is the right default; a GraphQL BFF for mobile clients can be added later without changing the core API.",
  "The interviewer is probing trade-off reasoning. Name what you gave up with every choice — that's what distinguishes a strong answer from a complete one."
] }
\`\`\``,
    },
  ],
};
