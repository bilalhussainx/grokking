import { Module } from "../types";

export const instagramModule: Module = {
  id: "sd-instagram",
  title: "Design Instagram",
  description:
    "Design a photo-sharing social network — upload, feed generation, stories, and media delivery at scale.",
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

## Non-Functional Requirements

- **High availability** — users expect the app to always load.
- **Low latency for feed** — feed should render within 200 ms.
- **Durability** — uploaded photos must never be lost.
- **Eventual consistency is acceptable** — it is okay if a new post takes a few seconds to appear in all followers' feeds.

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

## Key Ratios

| Metric | Value |
|--------|-------|
| Read-to-write ratio | ~20,000:1 (feed reads vs uploads) |
| DAU | 500 million |
| Photo uploads/day | 5 million |
| Raw photo storage/year | ~900 TB |
| Total media storage/year | ~4.5 PB (with thumbnails) |
| Metadata storage (5 years) | ~6 TB |

## Key Takeaways

- Instagram is overwhelmingly **read-heavy** — optimize the feed read path above all else.
- Photo storage dominates the infrastructure cost; use object storage (S3), not databases.
- Metadata (posts, follows, likes) is relatively small and fits in a sharded relational or NoSQL database.
- Eventual consistency is acceptable for the feed, enabling aggressive caching and async fan-out.
- Stories add a time-based expiration dimension to the storage problem.
`,
    },
    {
      id: "sd-ig-2",
      slug: "instagram-high-level-design",
      title: "High-Level Design",
      content: `# Design Instagram — High-Level Design

Let us define the major services and how they interact.

## Architecture Overview

\`\`\`
                    ┌─────────┐
         ┌────────▶│   CDN   │◀── (photos, videos, static assets)
         │         └─────────┘
         │
  ┌──────┴──────┐
  │   Clients   │   (iOS, Android, Web)
  └──────┬──────┘
         │
         ▼
  ┌──────────────┐
  │ API Gateway  │   (auth, rate limiting, routing)
  │ / Load Bal.  │
  └──────┬───────┘
         │
    ┌────┼────────┬──────────┬──────────┐
    ▼    ▼        ▼          ▼          ▼
┌──────┐┌──────┐┌──────┐┌──────────┐┌──────────┐
│Upload││ Feed ││Follow││Notifica- ││  Search  │
│ Svc  ││ Svc  ││ Svc  ││tion Svc  ││  Svc     │
└──┬───┘└──┬───┘└──┬───┘└────┬─────┘└────┬─────┘
   │       │       │         │           │
   ▼       ▼       ▼         ▼           ▼
┌──────┐┌──────┐┌──────┐┌──────────┐┌──────────┐
│Object││ Feed ││Graph ││  Push /  ││  Search  │
│Store ││Cache ││  DB  ││  Queue   ││  Index   │
│ (S3) ││(Redis)│(social│└──────────┘│(Elastic) │
└──────┘└──────┘│graph)│            └──────────┘
                └──────┘
                   │
              ┌────┴────┐
              ▼         ▼
         ┌──────┐ ┌──────────┐
         │Post  │ │  User    │
         │  DB  │ │   DB     │
         └──────┘ └──────────┘
\`\`\`

## Upload Service

1. Client uploads a photo to the **Upload Service**.
2. The service validates the image, generates a unique ID, and stores the original in **object storage** (S3).
3. A message is published to a processing queue.
4. **Media processing workers** generate multiple thumbnail sizes (150×150, 320×320, 640×640, 1080×1080) and store them in S3.
5. The post metadata (caption, user_id, image URLs, timestamp) is written to the **Post Database**.
6. A fan-out event is published to the **Feed Service** to update followers' feeds.

## Feed Service

The feed service is responsible for constructing each user's personalized feed. This is the most complex component and we will deep-dive in the next lesson.

At a high level:
1. Pre-compute feeds for most users (fan-out on write).
2. Store pre-computed feeds in **Redis** as sorted lists of post IDs.
3. When a user opens the app, the feed service reads their pre-computed feed from Redis, fetches post metadata, and returns the result.

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

## Key Takeaways

- Separate services for upload, feed, follow, notifications, and search allow independent scaling.
- Photos live in object storage (S3), served through a CDN — never in the database.
- The feed is pre-computed and cached in Redis for low-latency reads.
- The social graph (follow relationships) is a core data structure that drives both feed generation and notifications.
- Media processing (thumbnails) happens asynchronously after upload.
`,
    },
    {
      id: "sd-ig-3",
      slug: "instagram-news-feed-deep-dive",
      title: "Deep Dive: News Feed",
      content: `# Design Instagram — Deep Dive: News Feed

The news feed is the core experience. Every time a user opens the app, they see a personalized stream of posts from people they follow. Generating this feed at scale is the hardest part of the design.

## Fan-Out on Write vs Fan-Out on Read

### Fan-Out on Write (Push Model)

When a user publishes a new post, the system immediately pushes that post's ID into the pre-computed feed of **every follower**.

\`\`\`
User A posts photo
       │
       ▼
  Feed Service reads A's follower list
       │
       ▼
  Pushes post_id into feed cache of:
  ├── Follower 1's feed (Redis sorted set)
  ├── Follower 2's feed
  ├── Follower 3's feed
  └── ... (all N followers)
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

\`\`\`
Regular user posts  ──▶  Fan-out on write (push to all followers)

Celebrity posts     ──▶  Do NOT fan out
                         Instead, merge celebrity posts at read time
\`\`\`

When a user opens their feed:
1. Read their pre-computed feed from Redis (contains posts from regular users they follow).
2. Fetch recent posts from any celebrities they follow (a small set of queries).
3. Merge the two sets, rank, and return.

**Celebrity threshold:** Users with more than ~500K followers are treated as celebrities. This is a tunable parameter.

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

## Pre-Computing and Refreshing Feeds

- Each user's feed cache in Redis is a **sorted set** (sorted by score/timestamp) containing the most recent ~500 post IDs.
- When a new post is pushed, it is added to the sorted set and the oldest entry may be evicted.
- When a user has not opened the app in days, their cached feed may be stale. On their next visit, a background job refreshes it while serving the (slightly stale) cached version immediately.

## Key Takeaways

- Use a **hybrid fan-out**: push for regular users, pull for celebrities.
- Pre-compute feeds in Redis sorted sets for instant reads.
- Use cursor-based pagination for infinite scroll.
- Feed ranking considers recency, relationship strength, and engagement.
- The celebrity problem is the most common follow-up question — always have the hybrid approach ready.
`,
    },
    {
      id: "sd-ig-4",
      slug: "instagram-scaling-tradeoffs",
      title: "Scaling & Trade-offs",
      content: `# Design Instagram — Scaling & Trade-offs

Let us address how each component scales and the key decisions involved.

## Image Storage

Photos are the largest data by volume (4.5 PB/year estimated). The strategy:

1. **Object storage (S3)** for all photos and videos. Object stores are designed for exactly this: billions of immutable blobs with high durability (11 nines).
2. **Never store images in a database.** The database stores only the URL/path pointing to the object store.
3. **Multiple sizes on upload:** Generate 4-5 thumbnail sizes immediately. Store each as a separate object. Clients request the size appropriate for their screen.

\`\`\`
Original:  s3://photos/abc123/original.jpg  (2 MB)
Large:     s3://photos/abc123/1080.jpg      (300 KB)
Medium:    s3://photos/abc123/640.jpg       (120 KB)
Small:     s3://photos/abc123/320.jpg       (50 KB)
Thumbnail: s3://photos/abc123/150.jpg       (15 KB)
\`\`\`

## CDN Strategy

A global CDN is essential for serving media with low latency worldwide.

**Pull-based CDN:** The CDN fetches from S3 on the first request for an image, then caches it. Subsequent requests are served from the edge.

**Cache hit rate optimization:**
- Popular photos (recent posts from popular accounts) have very high hit rates.
- Old photos from inactive accounts may be evicted from CDN cache — that is fine; the rare request falls back to S3.
- Set CDN TTLs long (30 days+) since photos never change once uploaded.

## Database Sharding

### Post Database
Shard by **user_id**. This means all of a user's posts live on the same shard, making "get all posts by user X" a single-shard query.

**Trade-off:** Feed generation requires reading posts from many users (many shards). But since we pre-compute feeds, this cross-shard work happens asynchronously in the fan-out process, not on the critical read path.

### Social Graph (Follows)
Shard by **follower_id**. This makes "who does user X follow?" a single-shard query — the most common access pattern for feed generation.

### User Metadata
Shard by **user_id**. User profiles are frequently read (profile pages, post headers) and should be heavily cached.

## Feed Cache Scaling

With 500M DAU and ~500 post IDs per feed (each 8 bytes):
- 500M × 500 × 8 bytes = 2 TB of feed cache.
- A Redis cluster with 2-3 TB of memory handles this. Use consistent hashing to distribute users across Redis nodes.

## Stories Architecture

Stories differ from regular posts:
- **Ephemeral:** Auto-delete after 24 hours.
- **Sequential viewing:** Users swipe through a linear sequence.
- **Separate storage tier:** Since stories are deleted quickly, they can live in a faster, cheaper storage layer. No need for long-term archival.

\`\`\`
Stories flow:
Upload ──▶ Object Store (24h TTL bucket)
       ──▶ Stories metadata DB (user_id, story_id, created_at)
       ──▶ Stories cache (active stories per user)

At read time: Fetch active stories for all followed users, sorted by recency.
\`\`\`

A background job or TTL-based expiration deletes stories after 24 hours.

## Summary of Key Trade-offs

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Fan-out model | Hybrid (push + pull) | Balance write cost for celebrities vs read speed |
| Photo storage | S3 + CDN | Durability, scalability, cost-effective |
| Post DB shard key | user_id | "Posts by user" is a common query |
| Feed cache | Redis sorted sets | Sub-millisecond feed reads |
| Consistency | Eventual | Acceptable for social feeds; enables aggressive caching |
| Redirect type (N/A) | 302 equivalent | Stories and posts may be updated/deleted |

## Key Takeaways

- Object storage + CDN is the only viable approach for petabyte-scale media.
- Shard databases by user_id to keep per-user queries on a single shard.
- Pre-computed feeds in Redis enable sub-200ms feed load times.
- Stories are architecturally simpler than the main feed because they are ephemeral and sequential.
- The biggest cost centers are storage (S3) and CDN bandwidth — optimize image sizes aggressively.
`,
    },
  ],
};
