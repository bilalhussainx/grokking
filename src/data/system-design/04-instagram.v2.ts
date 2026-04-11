import { Module } from "../types";

export const instagramModule: Module = {
  id: "sd-instagram",
  title: "Design Instagram",
  description: "Design a photo-sharing social network — upload, feed generation, stories, and media delivery at scale.",
  lessons: [
    {
      id: "sd-ig-1",
      slug: "instagram-requirements-estimation",
      title: "Requirements & Estimation",
      content: `# Design Instagram — Requirements & Estimation

Instagram is a photo and video sharing platform where users upload media, follow other users, and browse a personalized feed. Let us scope the design.

## Functional Requirements

1. **Upload photos and videos** with captions and tags.
2. **Follow/unfollow** other users.
3. **News feed** — a personalized, ranked feed of posts from followed users.
4. **Stories** — ephemeral content that disappears after 24 hours.
5. **Like and comment** on posts.
6. **Search** for users and hashtags.
7. **Notifications** for likes, comments, follows, and mentions.

\`\`\`concept
{
  "title": "Functional vs Non-Functional Requirements",
  "variant": "mental-model",
  "content": "Think of Functional Requirements as the 'what' (features users interact with) and Non-Functional Requirements as the 'how well' (performance, reliability, scalability). For Instagram, uploading a photo is functional; ensuring the upload completes in under 2 seconds is non-functional."
}
\`\`\`

## Non-Functional Requirements

- **High availability** — users expect the app to always load.
- **Low latency for feed** — feed should render within 200 ms.
- **Durability** — uploaded photos must never be lost.
- **Eventual consistency is acceptable** — it is okay if a new post takes a few seconds to appear in all followers' feeds.

\`\`\`callout
{
  "type": "warning",
  "title": "Latency Budget Reality Check",
  "content": "200 ms end-to-end for feed generation is aggressive: 50 ms for CDN edge, 50 ms for API gateway + auth, 50 ms for feed service, 50 ms for client render. Every millisecond counts at Instagram scale."
}
\`\`\`

## Back-of-Envelope Estimation

**Assumptions:**
- 500 million daily active users (DAU).
- Each user views their feed ~10 times/day and sees ~20 posts per view.
- 5 million new photos uploaded per day.
- Average photo size: 500 KB (after compression and resizing).

**Feed reads:**
- 500M users × 10 views × 20 posts = 100 billion post lookups per day.
- 100B / 86,400 ≈ ~1.16 million reads/second. This is a massively read-heavy system.

**Uploads:**
- 5M photos/day ≈ ~58 uploads/second. Modest write throughput, but large payload size.

**Storage (per day):**
- 5M photos × 500 KB = 2.5 TB per day of original photos.
- With 4 thumbnail sizes: 2.5 TB × 5 = 12.5 TB per day total.
- Per year: 12.5 TB × 365 ≈ 4.5 PB.

This tells us immediately that **object storage** (like S3) is required — no traditional database can handle petabytes of image data.

**Metadata storage:**
- Each post: post_id (8B) + user_id (8B) + caption (500B) + timestamp (8B) + location (20B) + image_url (100B) ≈ 650 bytes.
- 5M posts/day × 365 × 5 years × 650 bytes ≈ 5.9 TB. This is manageable in a sharded database.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Storage Growth Calculator",
  "inputs": [
    { "id": "p", "label": "Photos per day (millions)", "default": 5, "min": 1, "max": 50, "prefix": "" },
    { "id": "s", "label": "Average photo size (KB)", "default": 500, "min": 200, "max": 2000, "suffix": " KB" },
    { "id": "t", "label": "Thumbnail multiplier", "default": 5, "min": 2, "max": 10, "suffix": "×" }
  ]
}
\`\`\`

## Key Ratios

| Metric | Value |
|--------|-------|
| Read-to-write ratio | ~20,000:1 (feed reads vs uploads) |
| DAU | 500 million |
| Photo uploads/day | 5 million |
| Raw photo storage/year | ~900 TB |
| Total media storage/year | ~4.5 PB (with thumbnails) |
| Metadata storage (5 years) | ~6 TB |

\`\`\`quiz
{
  "title": "Quick Sanity Check",
  "questions": [
    {
      "question": "If feed latency jumps from 200 ms to 2 s, which non-functional requirement is violated?",
      "options": ["Availability", "Durability", "Latency", "Consistency"],
      "answer": 2,
      "explanation": "Latency is the time between request and response; 2 s breaks the 200 ms NFR."
    },
    {
      "question": "Which storage medium is best suited for the 4.5 PB of yearly photos?",
      "options": ["PostgreSQL", "Amazon S3", "Redis", "MySQL"],
      "answer": 1,
      "explanation": "Object stores like S3 are purpose-built for petabyte-scale immutable blobs."
    },
    {
      "question": "Given the 20,000:1 read/write ratio, where should you spend most optimization effort?",
      "options": ["Upload path", "Feed read path", "Story expiration", "Notification delivery"],
      "answer": 1,
      "explanation": "Reads dominate; shaving 1 ms off feed lookup saves 1.16 M × 1 ms = 20 min CPU/day."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Instagram is overwhelmingly **read-heavy** — optimize the feed read path above all else.",
    "Photo storage dominates the infrastructure cost; use object storage (S3), not databases.",
    "Metadata (posts, follows, likes) is relatively small and fits in a sharded relational or NoSQL database.",
    "Eventual consistency is acceptable for the feed, enabling aggressive caching and async fan-out.",
    "Stories add a time-based expiration dimension to the storage problem."
  ]
}
\`\`\``,
    },
    {
      id: "sd-ig-2",
      slug: "instagram-high-level-design",
      title: "High-Level Design",
      content: `# Design Instagram — High-Level Design

\`\`\`concept
{"title": "What is High-Level Design?", "variant": "mental-model", "content": "High-Level Design (HLD) is the architectural blueprint that defines how major components interact to meet functional and non-functional requirements. It focuses on system boundaries, responsibilities, and trade-offs like scalability vs. simplicity, without diving into implementation details like classes or functions. Think of it as the floor plan for a building — you see where rooms are and how they connect, but not the color of the tiles."}
\`\`\`

Let us define the major services and how they interact.

## Architecture Overview

\`\`\`sysdiag
{"title": "Instagram High-Level Architecture", "width": 720, "height": 420,
 "nodes": [
   {"id":"client","label":"Clients\\n(iOS/Android/Web)","x":120,"y":210,"kind":"user"},
   {"id":"cdn","label":"CDN\\n(Photos/Videos)","x":120,"y":90,"kind":"external"},
   {"id":"gw","label":"API Gateway\\n(Auth, Rate-limit)","x":300,"y":210,"kind":"service"},
   {"id":"upload","label":"Upload Service","x":420,"y":120,"kind":"service"},
   {"id":"feed","label":"Feed Service","x":420,"y":210,"kind":"service"},
   {"id":"follow","label":"Follow Service","x":420,"y":300,"kind":"service"},
   {"id":"s3","label":"Object Store\\n(S3)","x":540,"y":120,"kind":"storage"},
   {"id":"redis","label":"Feed Cache\\n(Redis)","x":540,"y":210,"kind":"cache"},
   {"id":"graph","label":"Social Graph DB","x":540,"y":300,"kind":"storage"},
   {"id":"postdb","label":"Post DB","x":660,"y":180,"kind":"storage"}
 ],
 "edges": [
   {"from":"client","to":"cdn","label":"media"},
   {"from":"client","to":"gw","label":"API"},
   {"from":"gw","to":"upload","label":"upload"},
   {"from":"gw","to":"feed","label":"feed"},
   {"from":"gw","to":"follow","label":"follow"},
   {"from":"upload","to":"s3","label":"store"},
   {"from":"upload","to":"postdb","label":"metadata"},
   {"from":"feed","to":"redis","label":"cache"},
   {"from":"redis","to":"postdb","label":"miss"},
   {"from":"follow","to":"graph","label":"store"},
   {"from":"upload","to":"feed","label":"fan-out","style":"dashed"}
 ],
 "annotations": {
   "cdn": "Edge servers cache media close to users for low latency",
   "gw": "Single entry point that routes authenticated requests",
   "redis": "Pre-computed feeds stored as sorted lists of post IDs"
 }}
\`\`\`

## Upload Service

1. Client uploads a photo to the **Upload Service**.
2. The service validates the image, generates a unique ID, and stores the original in **object storage** (S3).
3. A message is published to a processing queue.
4. **Media processing workers** generate multiple thumbnail sizes (150×150, 320×320, 640×640, 1080×1080) and store them in S3.
5. The post metadata (caption, user_id, image URLs, timestamp) is written to the **Post Database**.
6. A fan-out event is published to the **Feed Service** to update followers' feeds.

\`\`\`steps
{"title": "Upload Flow Step-by-Step", "steps": [
  {"title": "1. Client Upload", "content": "Mobile app sends multipart/form-data to **POST /upload** via API Gateway with auth token."},
  {"title": "2. Validation & ID", "content": "Upload Service checks file type, size (<20 MB), virus scan, then generates UUID for object key."},
  {"title": "3. Store Original", "content": "Original bytes streamed directly to S3 bucket \`instagram-original\` with key \`/{userId}/{uuid}.jpg\`."},
  {"title": "4. Async Thumbnails", "content": "S3 event triggers Lambda that writes job to SQS queue; workers produce 4 sizes and store in \`instagram-thumbs\`."},
  {"title": "5. Persist Metadata", "content": "Transaction inserts row into PostDB: \`(postId, userId, caption, mediaUrls, createdAt)\`."},
  {"title": "6. Fan-out Event", "content": "SNS message \`NewPost\` published with \`userId\` & \`postId\`; Feed Service subscribers update follower caches."}
]}
\`\`\`

## Feed Service

The feed service is responsible for constructing each user's personalized feed. This is the most complex component and we will deep-dive in the next lesson.

At a high level:
1. Pre-compute feeds for most users (fan-out on write).
2. Store pre-computed feeds in **Redis** as sorted lists of post IDs.
3. When a user opens the app, the feed service reads their pre-computed feed from Redis, fetches post metadata, and returns the result.

\`\`\`callout
{"type": "warning", "title": "CAP Trade-off in Feed Cache", "content": "We choose **availability over strong consistency**. A missed post in Redis (stale cache) is acceptable; users refresh and eventually see it. Strong consistency would require global locks and harm latency."}
\`\`\`

## Follow Service / Social Graph

The follow relationship (\`user_A follows user_B\`) is stored in a **graph database** or a simple table:

\`\`\`
follows table:
┌─────────────┬───────────────┬─────────────┐
│ follower_id │ following_id  │ created_at  │
├─────────────┼───────────────┼─────────────┤
│ 101         │ 202           │ 2026-01-15  │
│ 101         │ 303           │ 2026-02-20  │
└─────────────┴───────────────┴─────────────┘
\`\`\`

Indexed on both \`follower_id\` (to get "who do I follow?") and \`following_id\` (to get "who follows me?" for fan-out).

## Notification Service

Triggered by events: new follower, like, comment, mention. Publishes to a push notification queue that delivers via APNS (iOS) and FCM (Android).

## CDN Integration

All media is served through a CDN. When a user views a photo, the request goes to the nearest CDN edge server. If the edge has the photo cached, it is returned instantly. Otherwise, the edge fetches from S3, caches it, and returns it.

\`\`\`quiz
{"title": "Check Your Understanding", "questions": [
  {"question": "Why do we store photos in S3 instead of the Post database?", "options": ["S3 is cheaper","Database blobs are slow and expensive","CDN integration is easier","All of the above"], "answer": 3, "explanation": "All reasons apply: object storage is cost-efficient, keeps the DB light, and integrates natively with CDNs."},
  {"question": "What trade-off does the fan-out-on-write feed model make?", "options": ["Higher write cost for faster reads","Faster writes but slower reads","Eventual consistency","Strong consistency"], "answer": 0, "explanation": "We pre-compute feeds on each post (expensive write) so that reads are O(1) from Redis."},
  {"question": "Which index on the follows table speeds up feed fan-out?", "options": ["follower_id","following_id","created_at","post_id"], "answer": 1, "explanation": "Fan-out needs 'who follows me' → query by following_id to get all followers."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Separate services for upload, feed, follow, notifications, and search allow independent scaling.",
  "Photos live in object storage (S3), served through a CDN — never in the database.",
  "The feed is pre-computed and cached in Redis for low-latency reads.",
  "The social graph (follow relationships) is a core data structure that drives both feed generation and notifications.",
  "Media processing (thumbnails) happens asynchronously after upload."
]}
\`\`\``,
    },
    {
      id: "sd-ig-3",
      slug: "instagram-news-feed-deep-dive",
      title: "Deep Dive: News Feed",
      content: `# Design Instagram — Deep Dive: News Feed

The news feed is the core experience. Every time a user opens the app, they see a personalized stream of posts from people they follow. Generating this feed at scale is the hardest part of the design.

## Fan-Out on Write vs Fan-Out on Read

\`\`\`concept
{
  "title": "Fan-Out Models",
  "variant": "mental-model",
  "content": "Think of fan-out like a newsletter: Push = the publisher mails a copy to every subscriber (expensive for the publisher). Pull = the subscriber drives to the newsstand to pick it up (expensive for the reader). Hybrid = the post office delivers to regular homes, but celebrities keep their magazines at the stand so you grab them while you're there."
}
\`\`\`

### Fan-Out on Write (Push Model)

When a user publishes a new post, the system immediately pushes that post's ID into the pre-computed feed of **every follower**.

\`\`\`mermaid
graph TD
    A[User A posts photo] --> B[Feed Service reads A's follower list]
    B --> C[Pushes post_id into feed cache of:<br/>- Follower 1's feed (Redis sorted set)<br/>- Follower 2's feed<br/>- Follower 3's feed<br/>- ... (all N followers)]
\`\`\`

**Pros:**
- Feed reads are instant — just read the pre-computed list from Redis.
- Reading is O(1) per user — critical for a read-heavy system.

**Cons:**
- Expensive for users with millions of followers (celebrities). Pushing to 10M feeds takes time and resources.
- Wasted work if many followers never check their feed.

### Fan-Out on Read (Pull Model)

When a user opens their feed, the system queries all users they follow, fetches their recent posts, merges and ranks them on the fly.

**Pros:**
- No wasted work on write. Publishing is cheap.
- No stale feed problem — always up-to-date.

**Cons:**
- Feed reads are slow — you must query potentially hundreds of users' post lists, merge, and rank. This is O(following_count) per feed read.
- Unsuitable for a system with millions of DAU all refreshing feeds simultaneously.

### Hybrid Approach (What Instagram-Scale Systems Use)

Use **fan-out on write for regular users** and **fan-out on read for celebrities**.

\`\`\`mermaid
graph LR
    R[Regular user posts] -->|Fan-out on write| P[Push to all followers]
    C[Celebrity posts] -->|Do NOT fan out| M[Merge at read time]
\`\`\`

When a user opens their feed:
1. Read their pre-computed feed from Redis (contains posts from regular users they follow).
2. Fetch recent posts from any celebrities they follow (a small set of queries).
3. Merge the two sets, rank, and return.

**Celebrity threshold:** Users with more than ~500K followers are treated as celebrities. This is a tunable parameter.

\`\`\`quiz
{
  "title": "Hybrid Fan-Out Decision Points",
  "questions": [
    {
      "question": "A fashion influencer with 2M followers posts a new outfit photo. Which fan-out path is taken?",
      "options": ["Push to all 2M followers", "Store once, merge at read time", "Push only to active followers", "Cache in CDN only"],
      "answer": 1,
      "explanation": "Celebrities (≥500K followers) bypass the push step to avoid write amplification; their posts are merged into feeds on demand."
    },
    {
      "question": "Why is cursor-based pagination preferred over offset-based for infinite scroll?",
      "options": ["Faster on MySQL", "Avoids duplicate/missing posts when new items arrive", "Smaller JSON payload", "Works without authentication"],
      "answer": 1,
      "explanation": "Offset pagination shifts when posts are inserted, causing clients to skip or repeat content. Cursors are stable."
    },
    {
      "question": "Which factor is NOT typically part of Instagram's feed-ranking score?",
      "options": ["Recency of the post", "Number of followers the author has", "User's historical interaction with the author", "Early engagement (likes, comments)"],
      "answer": 1,
      "explanation": "Raw follower count is not a direct signal; relationship strength and engagement matter more."
    }
  ]
}
\`\`\`

## Feed Ranking

A chronological feed (newest first) is simple but not optimal for engagement. Instagram uses a ranking algorithm that considers:

- **Recency:** Newer posts score higher.
- **Relationship:** Posts from users you interact with frequently score higher.
- **Engagement:** Posts with many likes and comments early on score higher.
- **Content type:** The algorithm may boost photos over text, or videos over photos, based on your past behavior.

The ranking model runs at read time on the merged feed candidate set.

## Pagination

Feeds are infinite-scrolling. Use **cursor-based pagination** rather than offset-based:

\`\`\`
GET /feed?cursor=post_id_1234&limit=20
\`\`\`

The cursor is the last post ID the client received. The server returns the next 20 posts after that cursor. This avoids the "shifting window" problem that offset-based pagination suffers from when new posts arrive.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Offset pagination (problematic)",
    "code": "GET /feed?offset=20&limit=20\\n# While the user scrolls, 3 new posts appear at the top.\\n# Next call: offset=40 skips the 3 new posts, user sees duplicates."
  },
  "after": {
    "label": "Cursor pagination (stable)",
    "code": "GET /feed?cursor=post_id_55&limit=20\\n# New posts get IDs > 55, cursor stays anchored.\\n# No duplicates, no misses."
  }
}
\`\`\`

## Pre-Computing and Refreshing Feeds

- Each user's feed cache in Redis is a **sorted set** (sorted by score/timestamp) containing the most recent ~500 post IDs.
- When a new post is pushed, it is added to the sorted set and the oldest entry may be evicted.
- When a user has not opened the app in days, their cached feed may be stale. On their next visit, a background job refreshes it while serving the (slightly stale) cached version immediately.

\`\`\`algoviz
{
  "title": "Hybrid Feed Build for @Alice",
  "type": "array",
  "data": ["P1","P2","P3","P4","P5","P6","P7","P8","P9","P10"],
  "frames": [
    {"highlight":[0,1,2],"label":"1. Read Alice's cached feed (regular users) from Redis","stats":{"cached":3}},
    {"highlight":[3,4],"label":"2. Pull latest from celebrities she follows","stats":{"celebs":2}},
    {"highlight":[0,1,2,3,4],"label":"3. Merge & rank by score (recency + engagement)","stats":{"final":5}}
  ],
  "speed": 1000
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a hybrid fan-out: push for regular users, pull for celebrities.",
    "Pre-compute feeds in Redis sorted sets for instant reads.",
    "Use cursor-based pagination for infinite scroll.",
    "Feed ranking considers recency, relationship strength, and engagement.",
    "The celebrity problem is the most common follow-up question — always have the hybrid approach ready."
  ]
}
\`\`\``,
    },
    {
      id: "sd-ig-4",
      slug: "instagram-scaling-tradeoffs",
      title: "Scaling & Trade-offs",
      content: `# Design Instagram — Scaling & Trade-offs

Let’s address how each component scales and the key decisions involved.

\`\`\`concept
{"title": "Scaling vs. Trade-offs", "variant": "mental-model", "content": "Scaling = adding resources to handle growth. Trade-offs = choosing which “-ility” to sacrifice when two conflict (speed vs. cost, consistency vs. availability, etc.). Every large system is a pile of explicit compromises."}
\`\`\`

## Image Storage

Photos are the largest data by volume (4.5 PB/year estimated). The strategy:

1. **Object storage (S3)** for all photos and videos. Object stores are designed for exactly this: billions of immutable blobs with high durability (11 nines).
2. **Never store images in a database.** The database stores only the URL/path pointing to the object store.
3. **Multiple sizes on upload:** Generate 4-5 thumbnail sizes immediately. Store each as a separate object. Clients request the size appropriate for their screen.

\`\`\`compare
{"variant": "before-after", "before": {"label": "Single 2 MB original served to every client", "code": "<img src=\\"https://cdn.com/abc123.jpg\\">  // 2 MB over 3G → 8 s"}, "after": {"label": "Size ladder picked by client", "code": "<img src=\\"https://cdn.com/abc123_320.jpg\\">  // 50 KB → 200 ms\\n// Saves 97 % bytes & 95 % time"}}
\`\`\`

## CDN Strategy

A global CDN is essential for serving media with low latency worldwide.

**Pull-based CDN:** The CDN fetches from S3 on the first request for an image, then caches it. Subsequent requests are served from the edge.

**Cache hit rate optimization:**
- Popular photos (recent posts from popular accounts) have very high hit rates.
- Old photos from inactive accounts may be evicted from CDN cache — that is fine; the rare request falls back to S3.
- Set CDN TTLs long (30 days+) since photos never change once uploaded.

\`\`\`quiz
{"title": "CDN Cache Design", "questions": [{"question": "Why not push every new image to all CDN edges proactively?", "options": ["Too expensive", "Illegal", "Impossible", "Slows uploads"], "answer": 0, "explanation": "Push-model would replicate 4.5 PB/year to 200+ edges most of which will never be requested there."}, {"question": "What happens when a 30-day TTL photo is requested on day 31?", "options": ["404 error", "CDN fetches again from S3", "User sees stale image", "Image is lost"], "answer": 1, "explanation": "Cache miss triggers a fresh origin fetch; user still gets correct photo."}, {"question": "Which factor most improves CDN hit rate for Instagram?", "options": ["Smaller image sizes", "Higher TTL", "Celebrity content popularity", "HTTPS only"], "answer": 2, "explanation": "A single Kardashian post can be viewed millions of times within hours, naturally concentrating traffic on few objects."}]}
\`\`\`

## Database Sharding

### Post Database
Shard by **user_id**. This means all of a user's posts live on the same shard, making "get all posts by user X" a single-shard query.

**Trade-off:** Feed generation requires reading posts from many users (many shards). But since we pre-compute feeds, this cross-shard work happens asynchronously in the fan-out process, not on the critical read path.

### Social Graph (Follows)
Shard by **follower_id**. This makes "who does user X follow?" a single-shard query — the most common access pattern for feed generation.

### User Metadata
Shard by **user_id**. User profiles are frequently read (profile pages, post headers) and should be heavily cached.

\`\`\`callout
{"type": "warning", "title": "Hot-Shard Risk", "content": "Sharding by \`user_id\` can create a hot shard if one user becomes ultra-viral. Mitigation: add a second shard key (e.g., post timestamp) or separate celebrity tier."}
\`\`\`

## Feed Cache Scaling

With 500M DAU and ~500 post IDs per feed (each 8 bytes):
- 500M × 500 × 8 bytes = 2 TB of feed cache.
- A Redis cluster with 2-3 TB of memory handles this. Use consistent hashing to distribute users across Redis nodes.

\`\`\`calculator
{"type": "compound-interest", "title": "Feed Cache Size Estimator", "inputs": [{"id": "dau", "label": "Daily Active Users", "default": 500000000, "min": 1000000, "max": 2000000000}, {"id": "posts", "label": "Posts per Feed", "default": 500, "min": 100, "max": 2000}, {"id": "bytes", "label": "Bytes per Post ID", "default": 8, "min": 4, "max": 16}], "formula": "dau * posts * bytes / 1e12"}
\`\`\`

## Stories Architecture

Stories differ from regular posts:
- **Ephemeral:** Auto-delete after 24 hours.
- **Sequential viewing:** Users swipe through a linear sequence.
- **Separate storage tier:** Since stories are deleted quickly, they can live in a faster, cheaper storage layer. No need for long-term archival.

\`\`\`steps
{"title": "Stories Flow", "steps": [{"title": "Upload", "content": "Client uploads video/image → API returns pre-signed URL for **temporary S3 bucket (24 h TTL)**"}, {"title": "Metadata write", "content": "Insert row \`(user_id, story_id, created_at, bucket_key)\` into **Stories DB**"}, {"title": "Cache warm", "content": "Add story_id to **Redis list keyed by user_id** with TTL 24 h"}, {"title": "View", "content": "Reader fetches followed users’ active stories from Redis, merges, serves CDN URLs"}, {"title": "Expire", "content": "S3 lifecycle + Redis TTL auto-delete; background job cleans DB"}]}
\`\`\`

## Summary of Key Trade-offs

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Fan-out model | Hybrid (push + pull) | Balance write cost for celebrities vs read speed |
| Photo storage | S3 + CDN | Durability, scalability, cost-effective |
| Post DB shard key | user_id | "Posts by user" is a common query |
| Feed cache | Redis sorted sets | Sub-millisecond feed reads |
| Consistency | Eventual | Acceptable for social feeds; enables aggressive caching |
| Redirect type (N/A) | 302 equivalent | Stories and posts may be updated/deleted |

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Object storage + CDN is the only viable approach for petabyte-scale media.", "Shard databases by user_id to keep per-user queries on a single shard.", "Pre-computed feeds in Redis enable sub-200ms feed load times.", "Stories are architecturally simpler than the main feed because they are ephemeral and sequential.", "The biggest cost centers are storage (S3) and CDN bandwidth — optimize image sizes aggressively."]}
\`\`\``,
    },
  ],
};
