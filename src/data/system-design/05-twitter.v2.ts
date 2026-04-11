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

\`\`\`concept
{
  "title": "Read vs Write Heavy Systems",
  "variant": "mental-model",
  "content": "Twitter is a classic read-heavy system: users consume timelines far more than they produce tweets. This 12:1 read-to-write ratio means we should optimize for fast timeline delivery, even if it makes posting slightly more complex. Think of a library where books are borrowed 12 times for every new book added — you'd design for quick checkout, not quick shelving."
}
\`\`\`

## Non-Functional Requirements

- **Read-heavy:** Timelines are viewed far more than tweets are posted.
- **Low latency:** Home timeline should load in under 200 ms.
- **High availability:** Users expect the service to always be accessible.
- **Eventual consistency:** A tweet appearing in a follower's timeline a few seconds late is acceptable.

\`\`\`callout
{
  "type": "warning",
  "title": "The 200 ms Bar",
  "content": "200 ms is the threshold where user perception shifts from \\"instant\\" to \\"noticeable delay\\". For timeline loads, every extra 100 ms costs ~1% in engagement. This latency budget must cover network round-trip, service processing, and data fetching — leaving only tens of milliseconds for backend work."
}
\`\`\`

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

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Fan-out Pressure Calculator",
  "inputs": [
    { "id": "t", "label": "Tweets per day (millions)", "default": 500, "min": 1, "max": 5000 },
    { "id": "f", "label": "Average followers per user", "default": 200, "min": 10, "max": 10000 }
  ]
}
\`\`\`

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

\`\`\`quiz
{
  "title": "Estimation Checkpoint",
  "questions": [
    {
      "question": "If DAU doubles to 600M but tweets/day stay at 500M, what happens to fan-out writes/sec?",
      "options": ["Stays the same", "Doubles to 2.32M", "Halves to 0.58M", "Becomes unpredictable"],
      "answer": 0,
      "explanation": "Fan-out depends only on tweets created and average followers, not on how many users read timelines."
    },
    {
      "question": "Which component dominates long-term storage growth?",
      "options": ["Tweet text", "Tweet metadata", "Media attachments", "User profiles"],
      "answer": 2,
      "explanation": "At 10 TB/day, media outgrows 64 TB/year text storage in under a week."
    },
    {
      "question": "Acceptable eventual consistency mainly unlocks which optimization?",
      "options": ["Stronger passwords", "Async fan-out", "SQL joins", "UDP transport"],
      "answer": 1,
      "explanation": "Because a few-second delay is OK, we can fan-out tweets in background tasks instead of blocking the post request."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The fan-out problem (delivering each tweet to all followers) is the defining challenge.",
    "Timeline reads vastly outnumber tweet writes — optimize the read path.",
    "Text storage is modest; media storage is massive.",
    "Eventual consistency is acceptable, which unlocks asynchronous fan-out strategies.",
    "The celebrity problem (users with millions of followers) makes naive fan-out infeasible."
  ]
}
\`\`\``,
    },
    {
      id: "sd-tw-2",
      slug: "twitter-high-level-design",
      title: "High-Level Design",
      content: `# Design Twitter — High-Level Design

Let us lay out the major services and data flow.

\`\`\`concept
{
  "title": "High-Level Design is a Blueprint",
  "variant": "mental-model",
  "content": "Think of HLD as the architectural sketch of a city: it shows where the neighborhoods (services) are, how the roads (APIs) connect them, and where the water mains (data stores) run—without detailing the plumbing inside each house. It keeps everyone aligned before anyone pours concrete."
}
\`\`\`

## Architecture Overview

\`\`\`sysdiag
{
  "title": "Twitter-Style Microblogging Platform",
  "width": 800,
  "height": 420,
  "nodes": [
    { "id": "clients", "label": "Clients\\n(Web/iOS/Android)", "x": 400, "y": 40, "kind": "user" },
    { "id": "gw", "label": "API Gateway\\n(auth, rate-limit)", "x": 400, "y": 110, "kind": "service" },
    { "id": "tweet", "label": "Tweet Service", "x": 120, "y": 200, "kind": "service" },
    { "id": "timeline", "label": "Timeline Service", "x": 280, "y": 200, "kind": "service" },
    { "id": "search", "label": "Search Service", "x": 440, "y": 200, "kind": "service" },
    { "id": "notif", "label": "Notification Service", "x": 600, "y": 200, "kind": "service" },
    { "id": "trend", "label": "Trending Service", "x": 680, "y": 200, "kind": "service" },
    { "id": "tdb", "label": "Tweet DB", "x": 120, "y": 300, "kind": "storage" },
    { "id": "cache", "label": "Timeline Cache\\n(Redis)", "x": 280, "y": 300, "kind": "storage" },
    { "id": "idx", "label": "Search Index\\n(Elastic)", "x": 440, "y": 300, "kind": "storage" },
    { "id": "queue", "label": "Push/Queue\\n(Kafka)", "x": 600, "y": 300, "kind": "queue" },
    { "id": "trendcache", "label": "Trending Cache", "x": 680, "y": 300, "kind": "storage" }
  ],
  "edges": [
    { "from": "clients", "to": "gw", "label": "HTTPS" },
    { "from": "gw", "to": "tweet", "label": "" },
    { "from": "gw", "to": "timeline", "label": "" },
    { "from": "gw", "to": "search", "label": "" },
    { "from": "gw", "to": "notif", "label": "" },
    { "from": "gw", "to": "trend", "label": "" },
    { "from": "tweet", "to": "tdb", "label": "write" },
    { "from": "tweet", "to": "queue", "label": "event" },
    { "from": "timeline", "to": "cache", "label": "R/W" },
    { "from": "search", "to": "idx", "label": "index/query" },
    { "from": "notif", "to": "queue", "label": "consume" },
    { "from": "trend", "to": "trendcache", "label": "R/W" }
  ],
  "annotations": {
    "tweet": "Handles CRUD for tweets; emits fan-out events.",
    "timeline": "Pre-computes home timelines; merges celebrity tweets at read time.",
    "search": "Keyword/hashtag queries against inverted index.",
    "notif": "Push & in-app notifications for likes, mentions, follows.",
    "trend": "Sliding-window counts via stream processing."
  }
}
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

\`\`\`steps
{
  "title": "Timeline Service Flow",
  "steps": [
    {
      "title": "1. Fan-out on write (normal users)",
      "content": "When a tweet event arrives, look up the poster’s followers and insert the tweet_id into each follower’s Redis sorted-set (score = timestamp). **Complexity:** O(N) writes, O(1) reads."
    },
    {
      "title": "2. Celebrity shortcut",
      "content": "If the poster has >500 K followers, skip fan-out. Instead, store the tweet_id in a global “celebrity list” so it can be merged at read time. This avoids write amplification."
    },
    {
      "title": "3. Read path",
      "content": "Fetch cached timeline IDs from Redis, query celebrity tweets separately, merge, hydrate, rank, and return. **Goal:** sub-100 ms p99."
    }
  ]
}
\`\`\`

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

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why do we skip fan-out for celebrity accounts?",
      "options": [
        "Their tweets are less important",
        "To reduce write amplification and keep writes O(N) bounded",
        "Celebrity tweets are cached in CDN",
        "They use a separate database"
      ],
      "answer": 1,
      "explanation": "Fanning out to millions of followers would create huge write spikes; merging at read time shifts the cost to the reader."
    },
    {
      "question": "Which storage type is best suited for the home-timeline cache?",
      "options": [
        "Relational DB",
        "Object storage",
        "In-memory sorted set (Redis)",
        "Blob cache (CDN)"
      ],
      "answer": 2,
      "explanation": "Redis sorted sets give O(log N) insert and O(1) range queries by time score, ideal for chronological timelines."
    },
    {
      "question": "What guarantees that a newly posted tweet appears in search almost immediately?",
      "options": [
        "ElasticSearch is synchronous on the write path",
        "Tweet Service blocks until indexing finishes",
        "We send an event to the search indexer pipeline",
        "Timeline Service pushes to search cache"
      ],
      "answer": 2,
      "explanation": "An async event ensures near-real-time indexing without blocking the tweet-post ACK."
    }
  ]
}
\`\`\`

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

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Pull-only timelines (fanout-on-read)",
    "code": "for followed_user in followed_users:\\n    tweets = db.query(\\n      'SELECT * FROM tweets WHERE user_id=? \\n       ORDER BY created_at DESC LIMIT 10', followed_user)\\n    merge_and_sort(tweets)"
  },
  "after": {
    "label": "Push + hybrid (fanout-on-write)",
    "code": "# write path\\ntimeline_cache.zadd(follower_id, tweet_timestamp, tweet_id)\\n\\n# read path\\ncached_ids = timeline_cache.zrevrange(user_id, 0, 400)\\ncelebrity_ids = get_celebrity_tweets(user_id)\\nmerged = merge(cached_ids, celebrity_ids)"
  }
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Separate tweet creation from timeline delivery using an async fan-out queue.",
    "Pre-compute timelines in Redis for instant reads; fall back to merge for celebrities.",
    "Use a dedicated search index (Elasticsearch) for tweet search.",
    "Trending topics use streaming aggregation over a sliding time window.",
    "The celebrity fan-out problem is the defining architectural challenge—hybrid push/pull keeps writes bounded."
  ]
}
\`\`\``,
    },
    {
      id: "sd-tw-3",
      slug: "twitter-timeline-deep-dive",
      title: "Deep Dive: Timeline Generation",
      content: `# Design Twitter — Deep Dive: Timeline Generation

Timeline generation is the heart of Twitter's architecture. Let us explore the approaches and trade-offs in detail.

## The Fan-Out Problem

When a user with 10 million followers tweets, naive fan-out means writing that tweet ID to 10 million Redis entries. At the platform's tweet volume (5,800 tweets/sec), even if only 0.1% of tweets are from high-follower accounts, the fan-out load is enormous.

\`\`\`sysdiag
{
  "title": "Naive Fan-Out Architecture",
  "width": 800,
  "height": 360,
  "nodes": [
    { "id": "tweet", "label": "Tweet Service", "x": 120, "y": 180, "kind": "service" },
    { "id": "db", "label": "Tweet DB", "x": 120, "y": 280, "kind": "database" },
    { "id": "fanout", "label": "Fan-Out Service", "x": 300, "y": 180, "kind": "service" },
    { "id": "w1", "label": "Worker 1", "x": 450, "y": 80, "kind": "worker" },
    { "id": "w2", "label": "Worker 2", "x": 450, "y": 180, "kind": "worker" },
    { "id": "w3", "label": "Worker N", "x": 450, "y": 280, "kind": "worker" },
    { "id": "fc1", "label": "Follower 1 Cache", "x": 650, "y": 60, "kind": "cache" },
    { "id": "fc2", "label": "Follower 2 Cache", "x": 650, "y": 120, "kind": "cache" },
    { "id": "fc3", "label": "Follower 3 Cache", "x": 650, "y": 180, "kind": "cache" },
    { "id": "fcn", "label": "Follower N Cache", "x": 650, "y": 300, "kind": "cache" }
  ],
  "edges": [
    { "from": "tweet", "to": "db", "label": "write", "direction": "forward" },
    { "from": "tweet", "to": "fanout", "label": "trigger", "direction": "forward" },
    { "from": "fanout", "to": "w1", "label": "distribute", "direction": "forward" },
    { "from": "fanout", "to": "w2", "label": "distribute", "direction": "forward" },
    { "from": "fanout", "to": "w3", "label": "distribute", "direction": "forward" },
    { "from": "w1", "to": "fc1", "label": "write", "direction": "forward" },
    { "from": "w1", "to": "fc2", "label": "write", "direction": "forward" },
    { "from": "w2", "to": "fc3", "label": "write", "direction": "forward" },
    { "from": "w3", "to": "fcn", "label": "write", "direction": "forward" }
  ],
  "annotations": {
    "fanout": "Coordinates parallel workers to distribute tweet IDs to follower caches",
    "w1": "Each worker handles a subset of followers, enabling horizontal scaling",
    "fc1": "Redis sorted sets storing up to 800 tweet IDs per user timeline"
  }
}
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

\`\`\`concept
{
  "title": "Hybrid Fan-Out Strategy",
  "variant": "mental-model",
  "content": "Think of Twitter's timeline generation like a postal service with two delivery methods: regular mail for most people (push), and special handling for celebrities (pull). Regular users get their mail delivered to their mailbox (timeline cache) immediately. Celebrity posts are stored in a central post office (celebrity cache), and only fetched when someone specifically requests them. This prevents the postal service from being overwhelmed delivering millions of copies of the same celebrity announcement."
}
\`\`\`

\`\`\`steps
{
  "title": "Hybrid Fan-Out Decision Flow",
  "steps": [
    {
      "title": "Tweet Arrival",
      "content": "New tweet arrives at fan-out service from Tweet Service"
    },
    {
      "title": "Follower Count Check",
      "content": "Check if poster has < 500K followers? If YES → proceed to push model"
    },
    {
      "title": "Push Model Execution",
      "content": "Fan-out on write: push tweet ID to all follower timeline caches in Redis"
    },
    {
      "title": "Celebrity Path",
      "content": "If poster has ≥ 500K followers → skip fan-out, store only in celebrity tweet cache"
    },
    {
      "title": "Read-Time Assembly",
      "content": "At read time: merge user's pre-computed timeline + celebrity tweets from cache"
    }
  ]
}
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

\`\`\`algoviz
{
  "title": "Fan-Out Worker Processing",
  "type": "array",
  "data": ["Tweet#123", "Tweet#124", "Tweet#125", "Tweet#126", "Tweet#127"],
  "frames": [
    { "highlight": [0], "label": "Worker 1 consumes Tweet#123 from Kafka", "stats": {"worker_id": 1, "followers": 15000} },
    { "highlight": [1], "label": "Worker 2 consumes Tweet#124 in parallel", "stats": {"worker_id": 2, "followers": 8500} },
    { "highlight": [2], "label": "Worker 3 handles Tweet#125", "stats": {"worker_id": 3, "followers": 12000} },
    { "highlight": [3], "label": "Each worker writes to follower timeline caches", "stats": {"total_writes": 35500} },
    { "highlight": [4], "label": "Horizontal scaling: add more workers as needed", "stats": {"workers": 3, "capacity": ">100K tweets/sec"} }
  ],
  "speed": 1000
}
\`\`\`

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

\`\`\`quiz
{
  "title": "Timeline Generation Trade-offs",
  "questions": [
    {
      "question": "What is the main advantage of fan-out on write (push model)?",
      "options": ["Reduces storage requirements", "Enables O(1) timeline reads", "Eliminates celebrity problem", "Simplifies ranking logic"],
      "answer": 1,
      "explanation": "Fan-out on write pre-computes timelines, making reads extremely fast - just fetch from cache."
    },
    {
      "question": "Why does Twitter use a hybrid approach instead of pure fan-out on read?",
      "options": ["Redis cannot handle the load", "Celebrity tweets would be too slow", "Ranking becomes impossible", "Kafka topics would overflow"],
      "answer": 1,
      "explanation": "Pure pull would require querying all followed accounts per read, making celebrity-heavy timelines prohibitively expensive."
    },
    {
      "question": "What happens when a user's timeline cache exceeds 800 entries?",
      "options": ["Cache is cleared", "Oldest entries are evicted", "New tweets are rejected", "User is rate limited"],
      "answer": 1,
      "explanation": "Redis sorted sets maintain a fixed size by evicting the oldest entries when the limit is reached."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The hybrid fan-out approach solves the celebrity problem: push for regular users, pull for celebrities.",
    "Async fan-out workers consume from a queue and write to Redis in parallel.",
    "Timeline caches hold ~800 tweet IDs per user, consuming about 2 TB across all users.",
    "Ranking happens at read time on the merged candidate set.",
    "The 500K follower threshold is tunable and can be adjusted based on system load."
  ]
}
\`\`\``,
    },
    {
      id: "sd-tw-4",
      slug: "twitter-scaling-tradeoffs",
      title: "Scaling & Trade-offs",
      content: `# Design Twitter — Scaling & Trade-offs

Let’s look at how each subsystem scales and the key design decisions you’ll need to justify in an interview.

## Tweet Storage: SQL or NoSQL?

Tweets are append-heavy and almost never updated—only engagement counters change. Two mainstream options:

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Sharded MySQL / PostgreSQL",
    "code": "tweet_id BIGINT PRIMARY KEY\\nuser_id BIGINT\\ncontent TEXT\\ncreated_at TIMESTAMP\\nlikes INT DEFAULT 0\\nretweets INT DEFAULT 0"
  },
  "after": {
    "label": "Distributed NoSQL (Cassandra)",
    "code": "PRIMARY KEY ((user_id), created_at, tweet_id))\\nCLUSTERING ORDER BY (created_at DESC)"
  }
}
\`\`\`

\`\`\`concept
{
  "title": "Sharding by user_id keeps timelines single-shard",
  "variant": "mental-model",
  "content": "If every tweet row contains the author’s user_id, sharding on that key guarantees that one user’s entire timeline lives on one physical node. A timeline query becomes a single network hop instead of a scatter-gather across shards."
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Interview Answer",
  "content": "Either storage engine is defensible. State that you’d shard by user_id for locality, cache counters in Redis, and flush periodically. Mention Twitter’s real system (Manhattan) is a key-value store if you want extra credit."
}
\`\`\`

## Search Indexing Pipeline

Tweets must become searchable within seconds. The classic streaming pipeline:

\`\`\`mermaid
graph LR
    A[Tweet created] --> B[Kafka] --> C[Search Indexer] --> D[Elasticsearch Cluster]
\`\`\`

**Index structure:** Inverted index on tokens, hashtags, and user handles.  
**Ranking signals:** text match, recency, engagement, social-graph affinity.  
**Scaling trick:** Partition by time window so “last 24 h” queries hit only hot shards.

\`\`\`algoviz
{
  "title": "Time-partitioned Elasticsearch indices",
  "type": "array",
  "data": ["hot-2024-06-27", "hot-2024-06-26", "warm-2024-06-25", "cold-2024-06-24"],
  "frames": [
    { "highlight": [0], "label": "Most queries hit the hot shard", "stats": {"qps": 12000} },
    { "highlight": [1], "label": "Yesterday shard still active", "stats": {"qps": 3000} },
    { "highlight": [2,3], "label": "Older shards moved to cheaper nodes", "stats": {"qps": 200} }
  ],
  "speed": 1000
}
\`\`\`

## Trending Topics in Real Time

Count hashtags over a sliding window with sub-linear memory.

\`\`\`steps
{
  "title": "Real-time trending pipeline",
  "steps": [
    {
      "title": "1. Stream ingestion",
      "content": "Every tweet event lands in Kafka topic \`tweets\`."
    },
    {
      "title": "2. Count-Min Sketch",
      "content": "Flink job updates a 2-D array of counters; hashes map hashtag → buckets. Over-estimates but never under-estimates."
    },
    {
      "title": "3. Top-K min-heap",
      "content": "Maintain a heap of size K (e.g., 50) per window. Update when sketch counter > heap min."
    },
    {
      "title": "4. Cache & serve",
      "content": "Write top list to Redis every 60 s; clients read from cache, not the stream job."
    }
  ]
}
\`\`\`

\`\`\`concept
{
  "title": "Count-Min Sketch trades accuracy for memory",
  "variant": "insight",
  "content": "A Count-Min Sketch of 4 MB can count billions of events with < 1 % error. You accept over-counting to stay memory-cheap and CPU-fast."
}
\`\`\`

## Rate Limiting with Token Buckets

Protect the system from scrapers and spam bots.

\`\`\`playground
{
  "title": "Token-bucket in Redis",
  "language": "python",
  "code": "import time, redis\\nr = redis.Redis()\\n\\ndef allow(user_id: str, burst: int, refill_per_sec: float) -> bool:\\n    key = f\\"bucket:{user_id}\\"\\n    now = time.time()\\n    pipe = r.pipeline()\\n    pipe.zremrangebyscore(key, 0, now - 1)   # remove expired tokens\\n    pipe.zcard(key)                          # current tokens\\n    current = pipe.execute()[1]\\n    if current < burst:\\n        pipe.zadd(key, {str(now): now})\\n        pipe.expire(key, 2)\\n        pipe.execute()\\n        return True\\n    return False",
  "runnable": false
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Return 429 Too Many Requests",
  "content": "When the bucket is full, fail fast and include \`Retry-After\` header so clients back off politely."
}
\`\`\`

## Database Sharding Cheat-Sheet

| Data | Shard Key | Rationale |
|------|-----------|-----------|
| Tweets | user_id | Timeline query = single shard |
| Follows | follower_id | “Who I follow” = single shard |
| Users | user_id | Profile lookup by ID |
| Likes | tweet_id | “Who liked this tweet” = single shard |

Cross-shard fan-out still happens: workers read follower lists (sharded by follower_id) and push tweet IDs to many timeline caches asynchronously—off the critical path.

## Availability & Graceful Degradation

\`\`\`sysdiag
{
  "title": "Multi-region deployment",
  "width": 600,
  "height": 300,
  "nodes": [
    { "id": "u", "label": "Users", "x": 50, "y": 150, "kind": "client" },
    { "id": "lb", "label": "Global LB", "x": 150, "y": 150, "kind": "gateway" },
    { "id": "api-w", "label": "API-West", "x": 250, "y": 100, "kind": "service" },
    { "id": "api-e", "label": "API-East", "x": 250, "y": 200, "kind": "service" },
    { "id": "cache-w", "label": "Redis-West", "x": 350, "y": 100, "kind": "store" },
    { "id": "cache-e", "label": "Redis-East", "x": 350, "y": 200, "kind": "store" },
    { "id": "db-w", "label": "DB-West", "x": 450, "y": 100, "kind": "store" },
    { "id": "db-e", "label": "DB-East", "x": 450, "y": 200, "kind": "store" }
  ],
  "edges": [
    { "from": "u", "to": "lb", "label": "" },
    { "from": "lb", "to": "api-w", "label": "" },
    { "from": "lb", "to": "api-e", "label": "" },
    { "from": "api-w", "to": "cache-w", "label": "read" },
    { "from": "api-e", "to": "cache-e", "label": "read" },
    { "from": "cache-w", "to": "db-w", "label": "miss" },
    { "from": "cache-e", "to": "db-e", "label": "miss" },
    { "from": "db-w", "to": "db-e", "label": "async repl", "style": "dashed" }
  ],
  "annotations": {
    "api-w": "Region fails independently; traffic steered away",
    "cache-w": "Timeline cache replica; failure ⇒ stale feeds only"
  }
}
\`\`\`

- **Timeline cache replication:** If a Redis node dies, users see slightly stale data while the fan-out queue rebuilds the shard.  
- **Leader-follower per region; async cross-region replication.**  
- **Independent service failure:** Trending down ≠ Timeline down.

## Summary of Trade-offs

| Decision | Choice | Alternative |
|----------|--------|-------------|
| Fan-out model | Hybrid push/pull | Pure push (doesn’t scale for celebrities) |
| Tweet DB | Sharded SQL or Cassandra | Both work; pick based on team skill |
| Search | Elasticsearch | Solr, custom index |
| Trending | Stream + Count-Min Sketch | Batch (minutes latency) |
| Consistency | Eventual | Strong (too costly for social feed) |

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Shard tweets by user_id to keep timelines single-shard and fast.",
    "Index search asynchronously with time-partitioned Elasticsearch clusters.",
    "Use approximate counting (Count-Min Sketch) for real-time trending with tiny memory.",
    "Rate-limit via token buckets in Redis; return 429 when exhausted.",
    "Design for graceful degradation—failures are isolated, not cascaded."
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Quick Check",
  "questions": [
    {
      "question": "Why shard tweets by user_id instead of tweet_id?",
      "options": [
        "Smaller primary key",
        "Keeps one user’s timeline on one shard",
        "Avoids hotspots from celebrity tweets",
        "Simplifies SQL joins"
      ],
      "answer": 1,
      "explanation": "A user timeline query becomes a single-shard operation instead of scatter-gather across many shards."
    },
    {
      "question": "What does Count-Min Sketch guarantee?",
      "options": [
        "Exact counts with zero error",
        "Under-estimates never happen",
        "Over-estimates never happen",
        "Zero memory usage"
      ],
      "answer": 2,
      "explanation": "The sketch may inflate counts due to hash collisions, but it never reports a count lower than the true value."
    },
    {
      "question": "Which CAP property is typically sacrificed in a social feed?",
      "options": [
        "Partition tolerance",
        "Availability",
        "Strong consistency",
        "Durability"
      ],
      "answer": 2,
      "explanation": "Feeds favor availability and partition tolerance, accepting eventual consistency to stay fast."
    }
  ]
}
\`\`\``,
    },
  ],
};
