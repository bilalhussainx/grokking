import { Module } from "../types";

export const twitterModule: Module = {
  id: "sd-twitter",
  title: "Design Twitter",
  description: "Design a microblogging platform — tweet publishing, timeline generation, search, and trending topics.",
  lessons: [
    {
      id: "sd-tw-1",
      slug: "twitter-requirements-estimation",
      title: "Requirements & Estimation",
      content: `# Design Twitter — Requirements & Estimation

Twitter is a microblogging platform where users publish short messages (tweets), follow other users, and browse a personalized timeline. Let us define the scope and estimate the scale.

## Functional Requirements

1. **Post tweets** — text (up to 280 characters), optionally with images or links.
2. **Home timeline** — a personalized feed of tweets from users you follow.
3. **User timeline** — all tweets by a specific user (their profile page).
4. **Follow/unfollow** users.
5. **Search tweets** by keyword or hashtag.
6. **Trending topics** — most-discussed topics right now.
7. **Like and retweet.**
8. **Notifications** for mentions, likes, retweets, new followers.

## Non-Functional Requirements

- **Read-heavy:** Timelines are viewed far more than tweets are posted.
- **Low latency:** Home timeline should load in under 200 ms.
- **High availability:** Users expect the service to always be accessible.
- **Eventual consistency:** A tweet appearing in a follower's timeline a few seconds late is acceptable.

## Back-of-Envelope Estimation

**Assumptions:**
- 300 million DAU.
- Each user views their timeline ~20 times/day.
- 500 million tweets per day.

**Timeline reads:**
- 300M × 20 = 6 billion timeline reads per day.
- 6B / 86,400 ≈ ~70,000 reads/second.

**Tweet writes:**
- 500M / 86,400 ≈ ~5,800 writes/second.

**Read-to-write ratio:** ~12:1. Heavily read-biased.

**Tweet storage:**
- Each tweet: tweet_id (8B) + user_id (8B) + text (280B) + timestamp (8B) + metadata (50B) ≈ 354 bytes.
- 500M tweets/day × 354 bytes ≈ 177 GB/day ≈ 64 TB/year (text only).

**Media storage (images, videos):**
- If 10% of tweets have an image (~200 KB avg): 50M × 200 KB = 10 TB/day.
- Media dominates storage. Use object storage (S3) + CDN.

**Fan-out calculation (the critical number):**
- Average user has 200 followers.
- 500M tweets × 200 followers = 100 billion fan-out writes per day.
- 100B / 86,400 ≈ ~1.16 million fan-out operations per second.
- This is the bottleneck that drives the architecture.

## Key Numbers Summary

| Metric | Value |
|--------|-------|
| DAU | 300 million |
| Tweets/day | 500 million |
| Timeline reads/sec | ~70,000 |
| Tweet writes/sec | ~5,800 |
| Fan-out writes/sec | ~1.16 million |
| Text storage/year | ~64 TB |
| Media storage/day | ~10 TB |

## Key Takeaways

- The fan-out problem (delivering each tweet to all followers) is the defining challenge.
- Timeline reads vastly outnumber tweet writes — optimize the read path.
- Text storage is modest; media storage is massive.
- Eventual consistency is acceptable, which unlocks asynchronous fan-out strategies.
- The celebrity problem (users with millions of followers) makes naive fan-out infeasible.
`,
    },
    {
      id: "sd-tw-2",
      slug: "twitter-high-level-design",
      title: "High-Level Design",
      content: `# Design Twitter — High-Level Design

Let us lay out the major services and data flow.

## Architecture

\`\`\`
  ┌──────────┐
  │ Clients  │  (Web, iOS, Android)
  └────┬─────┘
       │
       ▼
  ┌──────────────┐
  │  API Gateway │  (auth, rate limiting)
  └──────┬───────┘
         │
    ┌────┼─────────┬──────────┬──────────┐
    ▼    ▼         ▼          ▼          ▼
┌──────┐┌────────┐┌────────┐┌──────────┐┌────────┐
│Tweet ││Timeline││ Search ││Notifica- ││Trending│
│ Svc  ││  Svc   ││  Svc   ││tion Svc  ││  Svc   │
└──┬───┘└───┬────┘└───┬────┘└────┬─────┘└───┬────┘
   │        │         │          │           │
   ▼        ▼         ▼          ▼           ▼
┌──────┐┌──────┐┌──────────┐┌──────────┐┌────────┐
│Tweet ││Feed  ││  Search  ││  Push /  ││Trending│
│  DB  ││Cache ││  Index   ││  Queue   ││ Cache  │
│      ││(Redis)│(Elastic) ││          ││        │
└──────┘└──────┘└──────────┘└──────────┘└────────┘
\`\`\`

## Tweet Service

Handles creating, reading, and deleting tweets.

**Post a tweet:**
1. Client sends POST request with tweet text (and optional media).
2. Tweet Service validates content (length, spam check).
3. If media is attached, upload to object storage and get the URL.
4. Write tweet metadata to **Tweet DB**.
5. Publish a "new tweet" event to a **fan-out queue**.
6. Return success to the client.

**Read a single tweet:**
- Direct lookup by tweet_id from Tweet DB (or cache).

## Timeline Service

Constructs and serves home timelines. This is the most complex service.

**On new tweet event (from fan-out queue):**
1. Look up the poster's follower list.
2. For each follower, insert the tweet_id into their cached timeline (Redis sorted set, scored by timestamp).
3. For celebrity accounts (>500K followers), do NOT fan out — these tweets are merged at read time.

**On timeline read request:**
1. Read pre-computed timeline from Redis (returns a list of tweet_ids).
2. Fetch celebrity tweets for any celebrities the user follows.
3. Merge, rank, and return the hydrated tweets (with user info, media URLs, engagement counts).

## Search Service

- When a tweet is created, it is also indexed in a **search index** (e.g., Elasticsearch).
- The search service handles keyword and hashtag queries.
- Index includes: tweet text, hashtags, user handle, timestamp.

## Notification Service

Listens for events (mentions, likes, retweets, new followers) and delivers push notifications via APNS/FCM and in-app notification feeds.

## Trending Service

- Counts hashtags and keywords in a sliding time window (e.g., last 1 hour).
- Uses a streaming processing system (like Kafka Streams or Flink) to maintain running counts.
- Trending topics are cached and updated every few minutes.

## Database Schema (Core)

\`\`\`
tweets:
  tweet_id (PK), user_id, text, media_url, created_at, like_count, retweet_count

users:
  user_id (PK), username, display_name, bio, follower_count, following_count

follows:
  follower_id, following_id, created_at
  (composite PK: follower_id + following_id)
  (secondary index on following_id for fan-out lookups)
\`\`\`

## Key Takeaways

- Separate tweet creation from timeline delivery using an async fan-out queue.
- Pre-compute timelines in Redis for instant reads.
- Use a dedicated search index (Elasticsearch) for tweet search.
- Trending topics use streaming aggregation over a time window.
- The celebrity fan-out problem is the defining architectural challenge.
`,
    },
    {
      id: "sd-tw-3",
      slug: "twitter-timeline-deep-dive",
      title: "Deep Dive: Timeline Generation",
      content: `# Design Twitter — Deep Dive: Timeline Generation

Timeline generation is the heart of Twitter's architecture. Let us explore the approaches and trade-offs in detail.

## The Fan-Out Problem

When a user with 10 million followers tweets, naive fan-out means writing that tweet ID to 10 million Redis entries. At the platform's tweet volume (5,800 tweets/sec), even if only 0.1% of tweets are from high-follower accounts, the fan-out load is enormous.

\`\`\`mermaid
graph LR
    Tweet[User Publishes Tweet] --> TS[Tweet Service]
    TS --> DB[(Tweet DB)]
    TS --> FO[Fan-Out Service]
    FO --> W1[Worker 1]
    FO --> W2[Worker 2]
    FO --> W3[Worker N]
    W1 --> FC1[(Follower 1 Cache)]
    W1 --> FC2[(Follower 2 Cache)]
    W2 --> FC3[(Follower 3 Cache)]
    W3 --> FCN[(Follower N Cache)]
\`\`\`

## Three Approaches

### 1. Fan-Out on Write (Push)

Every tweet is immediately pushed to every follower's cached timeline.

\`\`\`
User A tweets ──▶ Fan-out workers ──▶ Write to:
                                       ├── Follower 1 timeline cache
                                       ├── Follower 2 timeline cache
                                       ├── ...
                                       └── Follower N timeline cache
\`\`\`

**Latency budget:** For a user with 200 followers, this takes milliseconds. For a celebrity with 10M followers, this could take minutes.

**Pros:** Timeline reads are O(1) — just fetch from cache.
**Cons:** Celebrity tweets create massive write amplification. Wasted writes for inactive users.

### 2. Fan-Out on Read (Pull)

No pre-computation. When a user opens their timeline, the system queries all accounts they follow, fetches recent tweets, merges, and ranks.

**Pros:** No write amplification. Publishing is instant.
**Cons:** Timeline reads become expensive — if you follow 500 accounts, that is 500 queries to merge. At 70,000 reads/sec, this is not feasible.

### 3. Hybrid Approach (The Real Solution)

Combine both based on the poster's follower count.

\`\`\`
Tweet arrives at fan-out service
         │
         ├── Poster has < 500K followers?
         │       YES ──▶ Fan-out on write (push to all followers)
         │
         └── Poster has ≥ 500K followers?
                 YES ──▶ Skip fan-out. Store in celebrity tweet cache.
\`\`\`

**At read time:**
1. Fetch the user's pre-computed timeline from Redis (contains non-celebrity tweets).
2. Look up which celebrities the user follows (small list, cached).
3. Fetch recent tweets from each celebrity's tweet list.
4. Merge the two sets by timestamp/score.
5. Return the ranked timeline.

**Why this works:**
- Most users follow only a handful of celebrities (typically < 50).
- Fetching 50 celebrity tweet lists and merging is cheap compared to fan-out to 10M followers.
- 99%+ of accounts have < 500K followers and use the efficient push model.

## Fan-Out Workers

The fan-out process runs asynchronously via a message queue:

\`\`\`
Tweet DB write ──▶ Kafka topic "new_tweets"
                        │
                  ┌──────┼──────┐
                  ▼      ▼      ▼
              Worker  Worker  Worker   (read follower list,
               1       2       3       write to Redis)
\`\`\`

- Workers consume from the Kafka topic in parallel.
- Each worker reads the poster's follower list and writes the tweet_id to each follower's Redis sorted set.
- Workers can be scaled horizontally — just add more consumers to the group.

## Caching the Timeline

Each user's timeline is a **Redis sorted set**:
- **Member:** tweet_id
- **Score:** timestamp (or a ranking score)
- **Max size:** ~800 entries (enough for several feed refreshes)

When a new tweet is pushed, it is added to the sorted set. If the set exceeds 800 entries, the oldest is evicted.

**Memory estimate:**
- 300M DAU × 800 tweet_ids × 8 bytes = ~1.9 TB.
- A Redis cluster with a few TB of memory handles this.

## Timeline Ranking

A pure chronological timeline shows the newest tweets first. A ranked timeline reorders based on:

- **Engagement signals:** Likes and retweets accumulated quickly.
- **User relationship:** Tweets from accounts you interact with most are boosted.
- **Content type:** Tweets with media may be weighted differently.
- **Recency decay:** Older tweets are penalized.

The ranking model runs at read time on the candidate set (pre-computed feed + celebrity tweets).

## Key Takeaways

- The hybrid fan-out approach solves the celebrity problem: push for regular users, pull for celebrities.
- Async fan-out workers consume from a queue and write to Redis in parallel.
- Timeline caches hold ~800 tweet IDs per user, consuming about 2 TB across all users.
- Ranking happens at read time on the merged candidate set.
- The 500K follower threshold is tunable and can be adjusted based on system load.
`,
    },
    {
      id: "sd-tw-4",
      slug: "twitter-scaling-tradeoffs",
      title: "Scaling & Trade-offs",
      content: `# Design Twitter — Scaling & Trade-offs

Let us address how each subsystem scales and the important design decisions.

## Tweet Storage

Tweets are append-heavy and rarely updated (only engagement counters change). Storage options:

**Option A — Sharded MySQL/PostgreSQL:**
- Shard by tweet_id (or user_id if you want user timelines on one shard).
- Proven at Twitter's actual scale historically.
- Engagement counters (likes, retweets) can be cached in Redis and flushed to the DB periodically.

**Option B — Distributed NoSQL (Cassandra):**
- Excellent for write-heavy, append-only workloads.
- Partition by user_id with clustering by timestamp for efficient user timeline queries.
- Twitter's actual system (Manhattan) is a key-value store.

**Recommendation for interviews:** Either is defensible. Mention both and explain your reasoning.

## Search Indexing

Tweets need to be searchable within seconds of posting. Architecture:

\`\`\`
Tweet created ──▶ Kafka ──▶ Search Indexer ──▶ Elasticsearch Cluster
\`\`\`

**Index structure:** Inverted index on tweet text tokens, hashtags, and user handles. Partitioned by time (recent tweets in hot shards, older tweets in cold shards).

**Search ranking:** Relevance score based on text match, recency, engagement (popular tweets rank higher), and the searcher's social graph (tweets from accounts you follow rank higher).

**Scaling search:** Elasticsearch clusters can be scaled by adding data nodes. Partition the index by time window — queries for recent tweets (most common) only hit the hot partition.

## Trending Topics

Trending requires counting hashtags and keywords over a sliding window (e.g., last hour, last 15 minutes).

**Architecture:**
1. Every tweet event flows through a stream processor (Kafka Streams, Apache Flink).
2. The processor maintains approximate counts using a **Count-Min Sketch** (a probabilistic data structure that uses sub-linear memory).
3. A min-heap tracks the top-K trending items.
4. Results are written to a cache every 60 seconds and served directly from cache.

**Filtering:** Trending topics must be filtered for spam, offensive content, and manipulation (coordinated bot campaigns).

## Rate Limiting

**Per-user limits:**
- Tweet creation: ~300 tweets per 3 hours.
- API reads: ~900 requests per 15-minute window.

**Implementation:** Token bucket algorithm backed by Redis. Each user has a counter with a TTL. When the counter hits the limit, return HTTP 429.

**Why it matters:** Without rate limiting, bots and scrapers would overwhelm the system. Rate limiting is a core part of the design, not an afterthought.

## Database Sharding Strategy

| Data | Shard Key | Rationale |
|------|-----------|-----------|
| Tweets | user_id | User timeline is a single-shard query |
| Follows | follower_id | "Who do I follow?" is single-shard |
| Users | user_id | Profile lookups by ID |
| Likes | tweet_id | "Who liked this tweet?" is single-shard |

**Cross-shard concern:** Fan-out reads follower lists (sharded by follower_id) and then writes to many users' timeline caches. This cross-shard fan-out is handled asynchronously by workers, keeping it off the critical path.

## Availability and Fault Tolerance

- **Multi-region deployment** with each region having a full copy of the system.
- **Timeline cache replication:** If a Redis node fails, users temporarily get a slightly stale timeline while the cache rebuilds from the fan-out queue.
- **Tweet DB replication:** Leader-follower within a region, cross-region async replication.
- **Graceful degradation:** If the trending service fails, the timeline still works. Services fail independently.

## Summary of Trade-offs

| Decision | Choice | Alternative |
|----------|--------|-------------|
| Fan-out model | Hybrid push/pull | Pure push (simpler, does not scale for celebrities) |
| Tweet DB | Sharded SQL or Cassandra | Both work; depends on team expertise |
| Search | Elasticsearch | Solr, custom inverted index |
| Trending | Stream processing + Count-Min Sketch | Batch processing (higher latency) |
| Consistency | Eventual | Strong (too expensive for social feed) |

## Key Takeaways

- Shard tweets by user_id to keep user timelines on a single shard.
- Search indexing happens asynchronously via a streaming pipeline into Elasticsearch.
- Trending topics use approximate counting (Count-Min Sketch) over sliding time windows.
- Rate limiting is essential to protect against abuse and is implemented with token buckets in Redis.
- Design for graceful degradation — if one service fails, others continue working.
`,
    },
  ],
};
