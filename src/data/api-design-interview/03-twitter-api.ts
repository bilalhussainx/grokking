import { Module } from "../types";

export const twitterApiModule: Module = {
  id: "design-twitter-api",
  title: "Design Twitter API",
  description:
    "Design a complete API for a Twitter-like social platform — tweet CRUD, timelines, social graph, and real-world trade-offs.",
  lessons: [
    {
      id: "twitter-requirements",
      slug: "twitter-requirements",
      title: "Requirements & Resource Modeling",
      content: `# Design Twitter API: Requirements & Resource Modeling

This is one of the most popular API design interview questions. Let us walk through it step by step.

## Step 1: Clarify Requirements

**Functional Requirements:**
- Users can create, read, and delete tweets (text up to 280 chars, optional media)
- Users can like and retweet tweets
- Users can follow/unfollow other users
- Users can view a home timeline (tweets from people they follow)
- Users can view a user's profile timeline

**Non-Functional Requirements:**
- Timeline API must support efficient pagination
- High read-to-write ratio (100:1)
- API should be RESTful and versioned
- Support for real-time updates (stretch goal)

## Step 2: Identify Resources

\`\`\`
Core Resources:
├── User          → /users
├── Tweet         → /tweets
├── Like          → /tweets/{id}/likes
├── Retweet       → /tweets/{id}/retweets
├── Follow        → /users/{id}/following, /users/{id}/followers
└── Timeline      → /timeline (home), /users/{id}/tweets (profile)
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
  "text": "Just shipped a new feature! 🚀",
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

## Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /tweets | Create a tweet |
| GET | /tweets/{id} | Get a tweet |
| DELETE | /tweets/{id} | Delete a tweet |
| POST | /tweets/{id}/likes | Like a tweet |
| DELETE | /tweets/{id}/likes | Unlike a tweet |
| POST | /tweets/{id}/retweets | Retweet |
| DELETE | /tweets/{id}/retweets | Undo retweet |
| GET | /timeline | Home timeline |
| GET | /users/{id}/tweets | User timeline |
| POST | /users/{id}/following | Follow a user |
| DELETE | /users/{id}/following/{targetId} | Unfollow |
| GET | /users/{id}/followers | List followers |
| GET | /users/{id}/following | List following |

## Key Design Decisions

1. **Tweet IDs**: Use globally unique, sortable IDs (like Snowflake IDs) — they encode creation time, enabling efficient timeline ordering without a separate timestamp index.

2. **Author embedding**: Embed a minimal author object in each tweet to avoid N+1 queries on timeline rendering. Full user data is available at \`/users/{id}\`.

3. **Counts as separate fields**: \`like_count\`, \`retweet_count\` are denormalized onto the tweet for read performance. They are eventually consistent.

4. **Viewer-specific fields**: \`is_liked\` and \`is_retweeted\` are computed per-request based on the authenticated user. These require the auth token to populate.

In the next lessons, we will implement each endpoint group in detail.`,
    },
    {
      id: "twitter-tweet-crud",
      slug: "twitter-tweet-crud",
      title: "Tweet CRUD Endpoints",
      content: `# Tweet CRUD Endpoints

## Create a Tweet

\`\`\`http
POST /api/v1/tweets HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Just shipped a new feature!",
  "media_ids": ["med_001"],
  "reply_to": null
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created
Location: /api/v1/tweets/twt_xyz789

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
    { "id": "med_001", "type": "image", "url": "https://cdn.example.com/media/med_001.jpg" }
  ],
  "like_count": 0,
  "retweet_count": 0,
  "reply_count": 0,
  "reply_to": null,
  "created_at": "2025-03-10T14:30:00Z"
}
\`\`\`

### Media Upload (Pre-signed URL Pattern)

Media is uploaded separately before tweeting. This decouples upload from tweet creation.

\`\`\`http
POST /api/v1/media/upload-url
{ "content_type": "image/jpeg", "size_bytes": 2048000 }

HTTP/1.1 200 OK
{
  "media_id": "med_001",
  "upload_url": "https://uploads.example.com/presigned?token=abc",
  "expires_at": "2025-03-10T15:00:00Z"
}
\`\`\`

The client uploads directly to the CDN using the pre-signed URL, then references \`media_id\` in the tweet creation request.

## Get a Tweet

\`\`\`http
GET /api/v1/tweets/twt_xyz789
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "id": "twt_xyz789",
  "author": { "id": "usr_abc123", "username": "janedoe", ... },
  "text": "Just shipped a new feature!",
  "like_count": 42,
  "is_liked": true,
  "is_retweeted": false,
  ...
}
\`\`\`

## Delete a Tweet

Only the tweet author can delete their own tweet.

\`\`\`http
DELETE /api/v1/tweets/twt_xyz789
Authorization: Bearer <token>

HTTP/1.1 204 No Content
\`\`\`

**Error cases:**

\`\`\`http
# Not the author
HTTP/1.1 403 Forbidden
{ "error": { "code": "FORBIDDEN", "message": "You can only delete your own tweets." } }

# Tweet not found
HTTP/1.1 404 Not Found
{ "error": { "code": "TWEET_NOT_FOUND", "message": "Tweet twt_999 does not exist." } }
\`\`\`

## Like / Unlike

\`\`\`http
# Like a tweet
POST /api/v1/tweets/twt_xyz789/likes
Authorization: Bearer <token>

HTTP/1.1 200 OK
{ "liked": true, "like_count": 43 }

# Unlike a tweet
DELETE /api/v1/tweets/twt_xyz789/likes
Authorization: Bearer <token>

HTTP/1.1 200 OK
{ "liked": false, "like_count": 42 }

# Already liked (idempotent — not an error)
POST /api/v1/tweets/twt_xyz789/likes
HTTP/1.1 200 OK
{ "liked": true, "like_count": 43 }
\`\`\`

**Design note:** Like and unlike are idempotent. Liking an already-liked tweet simply returns the current state. This avoids race conditions in mobile clients where network retries are common.

## Retweet / Undo Retweet

\`\`\`http
POST /api/v1/tweets/twt_xyz789/retweets
Authorization: Bearer <token>

HTTP/1.1 201 Created
{
  "id": "rt_001",
  "original_tweet": { "id": "twt_xyz789", ... },
  "retweeted_by": { "id": "usr_abc123", ... },
  "created_at": "2025-03-10T15:00:00Z"
}
\`\`\`

## Validation Rules

| Field | Rule | Error Code |
|-------|------|-----------|
| text | 1-280 characters | TEXT_TOO_LONG |
| text | Required if no media | TEXT_OR_MEDIA_REQUIRED |
| media_ids | Max 4 images or 1 video | TOO_MANY_MEDIA |
| reply_to | Must reference existing tweet | TWEET_NOT_FOUND |

These CRUD operations form the foundation. Next, we tackle the harder problem: timeline APIs.`,
    },
    {
      id: "twitter-timeline",
      slug: "twitter-timeline",
      title: "Timeline & Feed API",
      content: `# Timeline & Feed API

The timeline is the core of Twitter's experience and the most technically challenging endpoint to design. There are two types: the home timeline (aggregated feed) and the user timeline (single user's tweets).

## Home Timeline

Returns tweets from accounts the authenticated user follows, ordered reverse-chronologically.

\`\`\`http
GET /api/v1/timeline?limit=20
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "data": [
    {
      "id": "twt_100",
      "type": "tweet",
      "author": { "id": "usr_456", "username": "johndoe", ... },
      "text": "Great morning for coding!",
      "like_count": 15,
      "is_liked": false,
      "created_at": "2025-03-10T14:30:00Z"
    },
    {
      "id": "rt_050",
      "type": "retweet",
      "retweeted_by": { "id": "usr_789", "username": "alice", ... },
      "original_tweet": {
        "id": "twt_090",
        "author": { "id": "usr_321", "username": "bob", ... },
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

### Key Design Decisions

**Cursor-based pagination is mandatory.** Timelines are high-velocity — new tweets appear constantly. Offset pagination would cause drift. The cursor encodes the timestamp of the last seen item.

**The \`type\` field distinguishes content types.** A timeline can contain tweets, retweets, and replies. The \`type\` field lets the client render each differently.

**Retweets embed the original tweet.** This avoids a second API call. The \`retweeted_by\` field identifies who retweeted.

## User Timeline

Returns a specific user's tweets, visible to anyone (or restricted by privacy settings).

\`\`\`http
GET /api/v1/users/usr_abc123/tweets?limit=20&include=replies
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "data": [
    { "id": "twt_100", "text": "My latest tweet", ... },
    { "id": "twt_095", "text": "Reply to someone", "reply_to": "twt_080", ... }
  ],
  "pagination": {
    "next_cursor": "eyJ0IjoiMjAyNS0wMy0wOVQxMDowMDowMFoifQ==",
    "has_more": true
  }
}
\`\`\`

**Query parameters:**
- \`include=replies\` — include replies (default: exclude)
- \`include=retweets\` — include retweets (default: include)
- \`media_only=true\` — only tweets with media

## Replies Thread

Loading a conversation thread requires fetching a tweet and its reply chain:

\`\`\`http
GET /api/v1/tweets/twt_100/replies?limit=20&sort=relevance

HTTP/1.1 200 OK
{
  "parent_chain": [
    { "id": "twt_080", "text": "Original tweet", ... },
    { "id": "twt_090", "text": "First reply", "reply_to": "twt_080", ... }
  ],
  "target_tweet": { "id": "twt_100", ... },
  "replies": [
    { "id": "twt_110", "text": "Great point!", "reply_to": "twt_100", ... },
    { "id": "twt_111", "text": "I disagree because...", "reply_to": "twt_100", ... }
  ],
  "pagination": { "next_cursor": "...", "has_more": true }
}
\`\`\`

The response includes:
1. **parent_chain** — ancestors of the target tweet (for context)
2. **target_tweet** — the tweet being viewed
3. **replies** — direct replies, sorted by relevance or recency

## Fan-out Strategy Discussion

In an interview, you should mention the backend trade-off:

**Fan-out on write (push model):** When a user tweets, immediately write the tweet ID to every follower's timeline cache. Fast reads, expensive writes. Good for users with few followers.

**Fan-out on read (pull model):** When a user requests their timeline, query tweets from all followed users in real time. Cheap writes, expensive reads. Better for celebrity accounts with millions of followers.

**Hybrid approach (Twitter's actual model):** Fan-out on write for regular users. Pull on read for celebrity tweets. This is the answer interviewers want to hear.

\`\`\`
Regular user tweets  → push to all followers' caches (fan-out on write)
Celebrity tweets     → pulled at read time and merged (fan-out on read)
Timeline request     → read from cache + merge celebrity tweets + rank
\`\`\`

This demonstrates that you understand the scale implications behind the API design.`,
    },
    {
      id: "twitter-social-graph",
      slug: "twitter-social-graph",
      title: "Follow/Unfollow & Social Graph",
      content: `# Follow/Unfollow & Social Graph

The social graph — who follows whom — is a fundamental resource in Twitter's API. It underpins timelines, recommendations, and notifications.

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

**Idempotent:** Following someone you already follow returns 200 with the current state — not an error.

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

## List Followers

\`\`\`http
GET /api/v1/users/usr_abc123/followers?limit=20
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "data": [
    {
      "id": "usr_789",
      "username": "alice",
      "display_name": "Alice Smith",
      "avatar_url": "https://cdn.example.com/avatars/usr_789.jpg",
      "bio": "Designer",
      "is_following": true,
      "is_followed_by": true
    },
    {
      "id": "usr_101",
      "username": "bob",
      "display_name": "Bob Johnson",
      "avatar_url": "https://cdn.example.com/avatars/usr_101.jpg",
      "bio": "Engineer",
      "is_following": false,
      "is_followed_by": true
    }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6InVzcl8xMDEifQ==",
    "has_more": true
  }
}
\`\`\`

**Key fields:**
- \`is_following\` — Does the authenticated user follow this person?
- \`is_followed_by\` — Does this person follow the authenticated user?

These two fields enable "Follows you" badges and mutual-follow indicators.

## List Following

\`\`\`http
GET /api/v1/users/usr_abc123/following?limit=20

HTTP/1.1 200 OK
{
  "data": [
    {
      "id": "usr_456",
      "username": "johndoe",
      "is_following": true,
      "is_followed_by": false
    }
  ],
  "pagination": { "next_cursor": "...", "has_more": true }
}
\`\`\`

## Relationship Check (Batch)

For rendering a list of users with follow buttons, clients need to check relationships in bulk:

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
    "usr_456": { "following": true, "followed_by": false, "muted": false, "blocked": false },
    "usr_789": { "following": true, "followed_by": true, "muted": false, "blocked": false },
    "usr_101": { "following": false, "followed_by": true, "muted": false, "blocked": false }
  }
}
\`\`\`

This batch endpoint eliminates N+1 relationship checks when rendering follower lists.

## Block and Mute

\`\`\`http
# Block a user
POST /api/v1/users/usr_456/block
HTTP/1.1 200 OK
{ "blocked": true }

# Unblock
DELETE /api/v1/users/usr_456/block
HTTP/1.1 200 OK
{ "blocked": false }

# Mute a user (hide their tweets without unfollowing)
POST /api/v1/users/usr_456/mute
HTTP/1.1 200 OK
{ "muted": true }
\`\`\`

**Blocking side effects:**
- Automatically unfollows in both directions
- Blocked user cannot see your tweets, follow you, or message you
- Blocked user's tweets are excluded from your timeline

## Error Cases

\`\`\`http
# Cannot follow yourself
POST /api/v1/users/usr_abc123/following
HTTP/1.1 422 Unprocessable Entity
{ "error": { "code": "CANNOT_FOLLOW_SELF", "message": "You cannot follow yourself." } }

# User is blocked
POST /api/v1/users/usr_456/following
HTTP/1.1 403 Forbidden
{ "error": { "code": "USER_BLOCKED", "message": "You cannot follow a user you have blocked." } }

# User has blocked you
POST /api/v1/users/usr_456/following
HTTP/1.1 403 Forbidden
{ "error": { "code": "BLOCKED_BY_USER", "message": "This user has blocked you." } }
\`\`\`

## Data Model Insight

The social graph is stored as a directed adjacency list:

\`\`\`
follows table:
| follower_id | followed_id | created_at               |
|-------------|-------------|--------------------------|
| usr_abc123  | usr_456     | 2025-03-10T14:00:00Z     |
| usr_789     | usr_abc123  | 2025-03-09T10:00:00Z     |
\`\`\`

This supports efficient queries:
- "Who does X follow?" → \`WHERE follower_id = X\`
- "Who follows X?" → \`WHERE followed_id = X\`
- "Does X follow Y?" → \`WHERE follower_id = X AND followed_id = Y\`

Each query is indexed and runs in constant time.`,
    },
    {
      id: "twitter-walkthrough",
      slug: "twitter-walkthrough",
      title: "API Walkthrough & Trade-offs",
      content: `# Twitter API: Walkthrough & Trade-offs

Let us walk through the complete API design and discuss the trade-offs an interviewer would probe.

## Complete Endpoint Summary

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

## Authentication Design

\`\`\`
Public endpoints (GET tweets, profiles): API Key or OAuth token
Private endpoints (timeline, post, like): OAuth 2.0 Bearer token
Third-party apps: OAuth 2.0 Authorization Code + PKCE
Rate limits: Per-token (user context) or per-app (app context)
\`\`\`

## Trade-offs to Discuss

### 1. Embedded Author vs Author ID

**Our choice:** Embed minimal author object in each tweet.

| Approach | Pros | Cons |
|----------|------|------|
| Embed author | Single request for timeline, no N+1 | Stale data (name changes), larger payload |
| Author ID only | Always fresh, smaller payload | N+1 queries, client-side joining |

**Justification:** Timeline rendering is the hot path. Embedding a minimal author (id, username, avatar_url) eliminates 20+ follow-up requests per page load. Author data changes rarely, so staleness is acceptable for minutes.

### 2. Denormalized Counts vs Real-time Counts

**Our choice:** Denormalize like_count, retweet_count onto the tweet object.

- **Eventual consistency:** Counts may lag by seconds. This is acceptable for a social platform.
- **Alternative:** Fetch counts separately via \`GET /tweets/{id}/stats\`. More accurate but adds latency.

### 3. Cursor vs Offset Pagination for Timelines

**Our choice:** Cursor-based pagination.

A timeline with offset pagination breaks under high write velocity. Between page 1 and page 2 requests, new tweets push items down, causing duplicates or missed content. Cursors solve this completely.

### 4. REST vs GraphQL for Mobile Clients

REST requires multiple round-trips: timeline + relationships + user details. GraphQL could fetch this in a single query:

\`\`\`graphql
query {
  timeline(first: 20) {
    edges {
      node {
        text
        author { username avatarUrl isFollowing }
        likeCount
        isLiked
      }
    }
  }
}
\`\`\`

**Trade-off:** We chose REST for simplicity and caching. A GraphQL BFF for mobile clients could be added later without changing the core API.

### 5. Like Idempotency

We made likes idempotent — sending \`POST /likes\` twice does not create two likes. This is critical for mobile apps where network retries are common. The alternative (returning 409 on duplicate) forces clients to handle conflicts.

## Scaling Considerations

\`\`\`
Write path:
  Tweet creation → Write to DB → Fan-out to follower timelines (async)
  Like/Retweet → Increment counter (atomic) → Update cache

Read path:
  Timeline → Read from pre-computed cache (Redis sorted set)
  Tweet detail → Read from DB (with cache layer)

Cache invalidation:
  Tweet deletion → Remove from author timeline + all follower timelines
  User block → Remove blocked user's tweets from blocker's timeline
\`\`\`

## What a Great Answer Covers

1. Clear resource modeling with consistent schemas
2. CRUD operations with proper HTTP methods and status codes
3. Timeline with cursor pagination and fan-out discussion
4. Social graph with idempotent follow/unfollow
5. Error handling for every endpoint
6. Rate limiting per endpoint category
7. Authentication strategy (OAuth 2.0)
8. At least 2-3 trade-offs articulated with reasoning

This level of depth is what distinguishes a strong API design interview answer.`,
    },
  ],
};
