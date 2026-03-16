import { Module } from "../types";

export const socialNetworkModule: Module = {
  id: "design-social-network",
  title: "Design Social Network",
  description:
    "Design a social network platform: news feed generation, social graph, content moderation, and multi-region architecture at billion-user scale.",
  lessons: [
    {
      id: "social-requirements",
      slug: "social-requirements",
      title: "Requirements & Scale",
      content: `# Design Social Network: Requirements & Scale

## Functional Requirements

Design a global social network platform like Facebook/Instagram. Core features:

1. **User profiles** — Create accounts, upload photos, manage bio and settings
2. **Social graph** — Follow/friend other users, mutual connections
3. **Post creation** — Text, images, videos, stories (ephemeral 24h content)
4. **News feed** — Personalized timeline of posts from connections
5. **Reactions and comments** — Like, love, laugh, reply to posts
6. **Friend suggestions** — Recommend people the user may know
7. **Notifications** — Real-time alerts for likes, comments, follows, mentions
8. **Search** — Find users, posts, hashtags, groups

## Non-Functional Requirements

- **Availability**: 99.99% — downtime affects billions of users
- **Latency**: News feed load < 500ms; post creation < 1 second
- **Consistency**: Eventual consistency for feed; strong consistency for friend/follow actions
- **Scalability**: 2B+ monthly active users, serving 100+ countries
- **Content safety**: Detect and remove harmful content within minutes

## Scale Estimation

### Users and Activity

\`\`\`
Monthly active users (MAU):    2 billion
Daily active users (DAU):      1.5 billion
Average sessions per day:      8 per user
Average time per session:      ~5 minutes
\`\`\`

### Content Creation

\`\`\`
Posts created per day:         ~500 million
  Text-only posts:            ~200M
  Image posts:                ~250M (avg 2 images/post)
  Video posts:                ~50M (avg 30s, 720p)

Comments per day:              ~5 billion
Reactions per day:             ~10 billion
\`\`\`

### Read vs Write Ratio

\`\`\`
Feed reads per day:            1.5B users × 8 sessions × 20 posts = 240 billion reads
Feed writes per day:           500 million posts
Read:Write ratio:              480:1

This is extremely read-heavy. The architecture must
optimize for reads above all else.
\`\`\`

### Storage

\`\`\`
Text posts/day:     200M × 500 bytes = 100 GB/day
Image storage/day:  250M × 2 images × 500 KB = 250 TB/day
Video storage/day:  50M × 30s × 2 MB/s = 3 PB/day (pre-CDN)
Social graph:       2B users × 300 avg connections × 16 bytes = 9.6 TB
\`\`\`

### QPS

\`\`\`
Feed reads:
  240B / 86,400 ≈ 2.8 million reads/s (average)
  Peak: 2.8M × 3 ≈ 8.4 million reads/s

Post creation:
  500M / 86,400 ≈ 5,800 writes/s (average)
  Peak: ~17,000 writes/s

Reactions:
  10B / 86,400 ≈ 116,000 reactions/s
  Peak: ~350,000 reactions/s
\`\`\`

## Key Challenges

| Challenge | Why It's Hard |
|-----------|--------------|
| **8.4M feed reads/s** | Each feed requires ranking 100s of candidate posts |
| **Fan-out on write** | A celebrity with 100M followers: 1 post = 100M feed updates |
| **Social graph queries** | "Mutual friends" across 2B nodes and 300B edges |
| **Content moderation** | 500M posts/day, harmful content must be caught in minutes |
| **Multi-region** | Users in 100+ countries, data sovereignty laws |

## High-Level Components

\`\`\`
┌──────────┐     ┌──────────┐     ┌──────────────┐
│ Client   │────▶│ API GW / │────▶│ Feed Service │
│ (Mobile, │◀────│ Load     │     └──────┬───────┘
│  Web)    │     │ Balancer │            │
└──────────┘     └──────────┘     ┌──────┴───────┐
                      │           │ Post Service │
                      │           └──────┬───────┘
                      │                  │
                ┌─────┼─────────────┬────┼──────────┐
                ▼     ▼             ▼    ▼          ▼
          ┌──────┐ ┌──────┐  ┌──────┐ ┌──────┐ ┌──────────┐
          │Graph │ │Feed  │  │Media │ │Search│ │Moderation│
          │Svc   │ │Cache │  │Svc   │ │Svc   │ │Pipeline  │
          └──────┘ └──────┘  └──────┘ └──────┘ └──────────┘
\`\`\`

We will dive into the critical subsystems: news feed generation, social graph, content moderation, and multi-region architecture.`,
    },
    {
      id: "social-feed",
      slug: "social-feed",
      title: "News Feed Generation",
      content: `# Social Network: News Feed Generation

## The Feed Problem

When a user opens the app, they expect a personalized feed of posts from people they follow — ranked by relevance, not just chronological order. Generating this feed is the hardest engineering problem in a social network.

## Approach 1: Fan-Out on Write (Push Model)

When a user creates a post, immediately push it to every follower's feed cache.

\`\`\`
User A creates a post (A has 500 followers):

Post Service:
  ├── Store post in Posts DB
  ├── Query Graph Service: "Who follows User A?"
  │   └── Returns 500 follower IDs
  └── For each follower, write to their feed cache:
      ├── feed:user_101 → prepend post_789
      ├── feed:user_102 → prepend post_789
      ├── ...
      └── feed:user_600 → prepend post_789

      Total writes: 500 cache writes

When User 101 opens app:
  └── Read feed:user_101 from Redis → instant response

Fan-out on write timeline:
  ┌──────────┐  write  ┌──────────┐  push  ┌──────────┐
  │ User A   │────────▶│ Post DB  │───────▶│ 500 Feed │
  │ posts    │         └──────────┘        │ Caches   │
  └──────────┘                             └──────────┘
\`\`\`

### Advantages
- Feed reads are extremely fast (pre-computed, just read from cache)
- Simple read path — no real-time computation needed

### Disadvantages
- **Celebrity problem**: A user with 100M followers → 1 post = 100M cache writes
- High write amplification for popular users
- Wasted work: many followers may never read the feed before it expires

## Approach 2: Fan-Out on Read (Pull Model)

When a user opens their feed, query all the people they follow and assemble the feed on-the-fly.

\`\`\`
User 101 opens app (follows 300 people):

Feed Service:
  ├── Query Graph Service: "Who does User 101 follow?"
  │   └── Returns 300 followed user IDs
  ├── For each, get latest posts (last 24h):
  │   ├── User A: [post_789, post_788]
  │   ├── User B: [post_790]
  │   ├── User C: [] (no recent posts)
  │   └── ...
  ├── Merge and rank ~600 candidate posts
  └── Return top 50 posts

Fan-out on read timeline:
  ┌──────────┐  read  ┌──────────┐  query  ┌──────────┐
  │ User 101 │───────▶│ Feed Svc │────────▶│ 300 User │
  │ opens app│        │ (compute)│         │ Post DBs │
  └──────────┘        └──────────┘         └──────────┘
\`\`\`

### Advantages
- No celebrity problem — posts are pulled, not pushed
- No wasted work — only compute feeds that are actually requested

### Disadvantages
- Slow feed reads — must query 300+ sources and rank in real-time
- High read-time compute: 300 queries × ranking = 200-500ms
- Cache miss is painful at 8.4M reads/s

## Approach 3: Hybrid (What Facebook/Instagram Actually Uses)

Combine both approaches based on user type:

\`\`\`
Classification:
  "Normal" users (< 10K followers):   Fan-out on WRITE (push)
  "Celebrity" users (> 10K followers): Fan-out on READ (pull)

Threshold: ~10K followers (tunable)

When Normal User posts:
  └── Push to all followers' feed caches (fast, bounded work)

When Celebrity posts:
  └── Store post in Celebrity Posts index (no fan-out)

When User opens feed:
  ├── Read pre-computed feed from cache (normal users' posts)
  ├── Query Celebrity Posts: get latest from celebrities I follow
  ├── Merge normal feed + celebrity posts
  ├── Rank combined list
  └── Return top 50

This bounds the fan-out:
  Normal user with 500 followers:      500 writes (fast)
  Celebrity with 100M followers:       0 writes (defer to read time)
  Feed read for user following 5 celebrities: 5 extra queries (fast)
\`\`\`

## Feed Ranking

The raw chronological feed is not what users want. The ranking algorithm determines the order:

\`\`\`
Feed Ranking Pipeline:

Candidate Generation (1000 posts):
  ├── From pre-computed cache (normal users)
  ├── From celebrity index
  └── From "suggested" content pool

First-pass Ranking (lightweight model):
  Score = w1 × recency
        + w2 × author_affinity (how often you interact)
        + w3 × content_type_preference
        + w4 × engagement_prediction
  → Reduce to top 200 candidates

Second-pass Ranking (heavy ML model):
  Neural network (DLRM - Deep Learning Recommendation Model)
  Features:
    ├── User features: age, location, past engagement patterns
    ├── Post features: type, length, media, hashtags
    ├── Social features: relationship strength, mutual friends
    ├── Context: time of day, device, session depth
    └── Cross features: user×post interaction history

  Output: P(engage) — probability user will like, comment, or share
  → Rank by expected engagement value
  → Return top 50

Latency budget:
  Cache read:        ~5ms
  Celebrity queries:  ~20ms
  First-pass rank:    ~10ms
  Second-pass rank:   ~50ms (GPU inference)
  Total:             ~85ms (well within 500ms target)
\`\`\`

## Feed Cache Architecture

\`\`\`
Feed cache (Redis Cluster):

Key: feed:{user_id}
Value: sorted set of (post_id, timestamp) — latest 500 posts

Per-user cache size: 500 × 16 bytes = 8 KB
Total cache size: 1.5B DAU × 8 KB = 12 TB

Redis Cluster:
  - 200 instances × 64 GB RAM = 12.8 TB capacity
  - Sharded by user_id (consistent hashing)
  - Replication factor: 2 (for read scaling)
  - Total: 400 Redis instances

Cache eviction:
  - TTL: 7 days (inactive users' feeds expire)
  - Posts older than 7 days dropped from feed
  - Cache miss: regenerate from Post DB (cold start: ~500ms)
\`\`\`

## Scale Numbers

\`\`\`
Feed reads:              8.4M/s (peak)
Feed cache hit rate:     ~95%
Feed computation:        ~420K/s (cache misses + celebrity merge)
Fan-out writes:          ~5,800 posts/s × 500 avg followers = 2.9M cache writes/s
Ranking model inference: ~420K/s (GPU cluster)
Feed cache size:         12 TB (Redis)
Celebrity index size:    ~500 GB (top 1M accounts × recent posts)
\`\`\`

## Trade-offs

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| Feed model | Hybrid push/pull | Pure push or pure pull | Handles celebrities without waste |
| Celebrity threshold | 10K followers | 100K, 1K | Balance write amplification vs read latency |
| Cache store | Redis sorted sets | Memcached, Cassandra | O(1) prepend, O(log N) range query |
| Ranking | Two-pass (light + heavy ML) | Single model | Latency budget: filter cheap, rank expensive |
| Cache TTL | 7 days | 30 days, 1 day | Balance freshness vs memory |`,
    },
    {
      id: "social-graph",
      slug: "social-graph",
      title: "Graph-Based Social Features",
      content: `# Social Network: Graph-Based Social Features

## The Social Graph

At the core of every social network is a graph where nodes are users and edges are relationships. This graph powers friend suggestions, mutual friends, people-you-may-know, and social search.

\`\`\`
Scale of the social graph:
  Nodes:            2 billion users
  Edges:            ~300 billion (avg 300 connections per user)
  Graph size:       300B edges × 16 bytes = ~4.8 TB (edge list only)
  Edge types:       follow, friend (bidirectional), blocked, close_friend
\`\`\`

## Graph Storage

\`\`\`
Option 1: Adjacency list in relational DB
  Table: edges (from_user_id, to_user_id, type, created_at)

  Pros: Simple, ACID, familiar
  Cons: Multi-hop queries (friends-of-friends) require self-joins
        2-hop: JOIN edges e1 ON edges e2 → 300² = 90K intermediate rows
        3-hop: 300³ = 27M rows → query timeout

Option 2: Graph database (Neo4j, Amazon Neptune)
  MATCH (a:User)-[:FOLLOWS]->(b:User)-[:FOLLOWS]->(c:User)
  WHERE a.id = 'user_101' AND NOT (a)-[:FOLLOWS]->(c)
  RETURN c

  Pros: Multi-hop traversals are native and fast
  Cons: Harder to scale horizontally; limited ecosystem

Option 3: Custom graph service with adjacency lists in memory

Facebook's approach (TAO):
  ┌──────────────────────────────────────────┐
  │ TAO (The Associations and Objects)       │
  │                                          │
  │ In-memory cache of graph edges           │
  │ Backed by MySQL (persistent storage)     │
  │                                          │
  │ API:                                     │
  │   assoc_get(user_A, FOLLOWS) → [B,C,D]  │
  │   assoc_count(user_A, FOLLOWS) → 342     │
  │   assoc_range(user_A, FOLLOWS, 0, 20)   │
  │                                          │
  │ Scale:                                   │
  │   Billions of reads/second               │
  │   Cache hit rate: >99.8%                 │
  │   Read latency: <1ms (cache hit)         │
  └──────────────────────────────────────────┘
\`\`\`

## Mutual Friends

Finding mutual friends between two users:

\`\`\`
Query: "Mutual friends of User A and User B"

Algorithm:
  1. Get friends(A) → set of 350 IDs (~1ms from cache)
  2. Get friends(B) → set of 420 IDs (~1ms from cache)
  3. Set intersection: friends(A) ∩ friends(B)
  4. Return intersecting IDs with profile data

Performance:
  Set intersection of ~350 and ~420 elements: < 0.1ms
  Total latency: ~3ms

Edge case: User with 5,000 friends
  → Still fast: set intersection is O(min(m,n))
  → Bloom filter optimization for very large friend lists
\`\`\`

## Friend Suggestions (People You May Know)

The most impactful social feature. Drives network growth and engagement.

\`\`\`
Suggestion algorithm (multi-signal):

Signal 1: Friends of Friends (FoF)
  For User A:
    Get friends(A) → [B, C, D, ...]
    For each friend, get their friends:
      friends(B) → [E, F, G, ...]
      friends(C) → [F, H, I, ...]
      friends(D) → [E, J, K, ...]
    Count appearances: E=2, F=2, G=1, H=1, I=1, J=1, K=1
    Rank by count: E and F have 2 mutual friends
    Filter: remove existing friends, blocked users

Signal 2: Shared attributes
  Same school, same employer, same hometown
  Weight: school > employer > hometown

Signal 3: Contact list matches
  User uploaded phone contacts containing E's phone number
  Strong signal: likely knows this person in real life

Signal 4: Interaction patterns
  Commented on same posts, tagged in same photos
  Attended same events

Combined score:
  suggestion_score = w1 × mutual_friend_count
                   + w2 × shared_attributes
                   + w3 × contact_match
                   + w4 × interaction_overlap
                   + w5 × ML_model_prediction

Precomputation:
  FoF computation for 1.5B DAU is too expensive to do real-time.
  → Batch compute suggestions daily using MapReduce/Spark
  → Store top 200 suggestions per user in cache
  → Serve from cache when user visits "People You May Know"
\`\`\`

### FoF at Scale

\`\`\`
Naive FoF computation:
  For each of 2B users:
    Get ~300 friends
    For each friend, get ~300 of their friends
    = 300 × 300 = 90,000 FoF candidates per user
    × 2B users = 180 trillion operations

This is a massive MapReduce job:

Map phase:
  For each edge (A, B):
    Emit (A, [friends(B)])

Reduce phase:
  For user A, aggregate all FoF lists
  Count occurrences, rank, filter

Infrastructure:
  - 10,000 Spark executors
  - 50 TB shuffle data
  - Runtime: ~4 hours
  - Runs daily during off-peak hours
\`\`\`

## Social Distance

How many hops separate two users? This powers features like "2nd degree connection" and privacy controls.

\`\`\`
Social distance between User A and User X:

Distance 1: A follows X directly          (friends)
Distance 2: A → B → X                     (friend of friend)
Distance 3: A → B → C → X                 (3 hops)
Distance 4+: effectively strangers

Bidirectional BFS:
  Start BFS from A and from X simultaneously.
  When the two search frontiers meet → shortest path found.

  ┌───────────────────────────────────────────┐
  │  A ──▶ {B,C,D} ──▶ {E,F,G,H,...}        │
  │                          ↕ meet!          │
  │  X ──▶ {Y,Z,W} ──▶ {F,Q,R,S,...}        │
  │                                           │
  │  Shortest path: A → C → F → Z → X (4)    │
  └───────────────────────────────────────────┘

BFS explores O(branching_factor^depth) nodes.
  Regular BFS: 300^4 = 8.1 billion nodes (distance 4)
  Bidirectional BFS: 2 × 300^2 = 180,000 nodes
  → 45,000x fewer nodes explored

Practical use:
  Distance 1-2: cached (friends and FoF precomputed)
  Distance 3+: computed on-demand using bidirectional BFS
  Timeout: if not found in 3 hops → "not connected"
\`\`\`

## Graph Partitioning

\`\`\`
Challenge: 4.8 TB graph cannot fit on one machine.

Partitioning strategies:

Hash partitioning (simple):
  user_id % N_shards → shard assignment
  Pros: even distribution
  Cons: friends are scattered across shards
        → multi-hop queries require cross-shard calls

Social partitioning (locality-aware):
  Users who are friends are more likely on the same shard.
  Use graph partitioning algorithm (METIS, social hash)
  Pros: most friend queries stay on one shard
  Cons: rebalancing is expensive; hot spots from celebrities

Facebook's approach:
  ├── Hash partitioning for storage (MySQL shards)
  ├── TAO cache for read path (in-memory, replicated)
  ├── Cache replication handles locality
  └── Cross-shard queries for multi-hop (acceptable latency)
\`\`\`

## Scale Numbers

\`\`\`
Graph edges:                 300 billion
Graph edge storage:          ~4.8 TB
TAO cache hit rate:          >99.8%
Mutual friend queries:       ~500K/s
Friend suggestion precompute: daily, 4-hour Spark job
FoF candidates per user:     ~90,000 (filtered to 200 suggestions)
Bidirectional BFS latency:   < 50ms (2-hop), < 200ms (3-hop)
Graph service instances:     ~5,000 (globally)
Social distance queries:     ~100K/s
\`\`\``,
    },
    {
      id: "social-moderation",
      slug: "social-moderation",
      title: "Content Moderation Pipeline",
      content: `# Social Network: Content Moderation Pipeline

## The Moderation Challenge

With 500 million posts per day, harmful content — hate speech, violence, misinformation, child exploitation, spam — must be detected and removed quickly. Human moderators alone cannot review 500M posts. The solution: ML-first detection with human review for edge cases.

\`\`\`
Moderation goals:
  - Remove violent/CSAM content within 1 hour (ideally minutes)
  - Remove hate speech within 24 hours
  - False positive rate < 1% (wrongly removed legitimate content)
  - Handle 500M posts/day + 5B comments/day + 10B reactions/day
  - Support 100+ languages
\`\`\`

## Multi-Stage Pipeline

\`\`\`
┌──────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│ Content  │───▶│ Stage 1:   │───▶│ Stage 2:   │───▶│ Stage 3:   │
│ Created  │    │ Pre-screen │    │ ML Models  │    │ Human      │
│ (post,   │    │ (instant)  │    │ (real-time)│    │ Review     │
│ comment) │    │            │    │            │    │ (async)    │
└──────────┘    └────────────┘    └────────────┘    └────────────┘
                     │                  │                  │
                  Block:            Classify:           Decision:
                  known bad         probability of       remove,
                  hashes,           each violation       reduce,
                  spam patterns     type                 inform,
                                                        allow
\`\`\`

## Stage 1: Pre-Screening (Instant, <10ms)

Deterministic checks that run synchronously during content creation:

\`\`\`
Checks:
  ├── Hash matching (images/videos)
  │   Known CSAM: PhotoDNA hash database (~4M hashes)
  │   Known terrorism: GIFCT shared hash database
  │   Previously removed content: internal hash DB
  │   Technique: perceptual hashing (pHash, dHash)
  │   → Detects even slightly modified copies
  │
  ├── Spam detection
  │   URL in known spam blocklist?
  │   Account created < 1 hour ago + posting links?
  │   Same content posted by 100+ accounts in 10 minutes?
  │
  ├── Rate limiting
  │   > 50 posts/hour from same account?
  │   > 200 comments/hour?
  │   → Likely bot or spam
  │
  └── Keyword blocklist (exact match)
      Known slurs in 100+ languages
      NOTE: keyword matching has high false positive rate
      → Only used for highest-severity terms

Result:
  ~2% of content blocked at this stage
  ~98% passed to Stage 2 for ML analysis
\`\`\`

## Stage 2: ML Classification (Real-Time, <200ms)

Multiple specialized ML models score content across violation categories:

\`\`\`
ML Model Zoo:

Text models:
  ├── Hate speech classifier (multilingual transformer)
  ├── Violence/threats classifier
  ├── Misinformation classifier
  ├── Spam/scam classifier
  └── Self-harm/suicide content classifier

Image models:
  ├── Nudity/sexual content (CNN, ResNet-based)
  ├── Violence/gore detection
  ├── Text-in-image extraction (OCR) → text classifiers
  └── Object detection (weapons, drugs)

Video models:
  ├── Keyframe extraction → image models
  ├── Audio transcription → text models
  └── Video-specific: live violence detection

Each model outputs a probability score [0.0, 1.0]:

Post: "Everyone should [violent threat]..."
  hate_speech:      0.92
  violence_threat:  0.88
  spam:             0.05
  misinformation:   0.12

Decision thresholds:
  score > 0.95 → auto-remove (high confidence)
  score > 0.70 → reduce distribution + queue for human review
  score > 0.50 → queue for human review (no action yet)
  score < 0.50 → allow
\`\`\`

### Model Serving Architecture

\`\`\`
┌──────────┐    ┌────────────────────────────┐
│ Content  │───▶│ Model Serving Cluster      │
│ (500M/   │    │                            │
│  day)    │    │ ┌────────┐  ┌────────┐    │
│          │    │ │ GPU    │  │ GPU    │    │
│          │    │ │ Pool A │  │ Pool B │    │
│          │    │ │ (text) │  │ (image)│    │
│          │    │ └────────┘  └────────┘    │
│          │    │                            │
│          │    │ ┌────────┐  ┌────────┐    │
│          │    │ │ GPU    │  │ CPU    │    │
│          │    │ │ Pool C │  │ Pool D │    │
│          │    │ │ (video)│  │ (spam) │    │
│          │    │ └────────┘  └────────┘    │
│          │    └────────────────────────────┘
│          │
│          │    Inference latency:
│          │      Text models: ~20ms (GPU)
│          │      Image models: ~50ms (GPU)
│          │      Video (per keyframe): ~50ms
│          │      Batch optimization: process 32 items at once
└──────────┘

Infrastructure:
  ~2,000 GPUs dedicated to content moderation
  Models retrained weekly with new labeled data
\`\`\`

## Stage 3: Human Review

ML-flagged content goes to human reviewers for final decisions:

\`\`\`
Human review pipeline:

Content queue (priority-ordered):
  ├── P0: CSAM, terrorism (review in < 15 minutes)
  ├── P1: Violence, threats (review in < 1 hour)
  ├── P2: Hate speech, harassment (review in < 24 hours)
  └── P3: Misinformation, borderline (review in < 72 hours)

Review workforce:
  ~15,000 content moderators globally
  Distributed across time zones for 24/7 coverage
  Specialized teams for different violation types
  Average review time: ~30 seconds per item

Daily review volume:
  500M posts × ~5% flagged = ~25M items/day
  25M / 15K moderators / 8 hours = ~208 items/hour per moderator
  (about 1 every 17 seconds — sustainable pace)

Review interface:
  ┌──────────────────────────────────────┐
  │ [Post content displayed]             │
  │                                      │
  │ ML scores:                           │
  │   Hate speech: 0.78                  │
  │   Violence: 0.23                     │
  │                                      │
  │ Context: user history, reports       │
  │                                      │
  │ [Remove] [Reduce] [Inform] [Allow]  │
  └──────────────────────────────────────┘
\`\`\`

## Actions After Detection

\`\`\`
Enforcement actions (progressive):

Remove:     Content deleted, not visible to anyone
Reduce:     Content deprioritized in feed ranking (shadow-limit)
Inform:     Content labeled ("Missing context", "Disputed claim")
Warn:       User warned about policy violation
Restrict:   User's reach temporarily limited
Suspend:    Account temporarily disabled (3-30 days)
Ban:        Account permanently removed

Appeal process:
  User receives notification: "Your post was removed for violating..."
  User can appeal → content re-reviewed by different moderator
  Appeal decisions are final
  Turnaround: 24-48 hours
\`\`\`

## Proactive vs Reactive Detection

\`\`\`
Proactive (ML-initiated):
  Content scanned at creation time
  ~95% of violations caught proactively
  User never sees the content (pre-publish block)

Reactive (user-reported):
  Users click "Report" → content queued for review
  ~5% of violations caught this way
  Higher precision (humans flag real issues)
  Report volume: ~10M reports/day

Reports processing:
  ├── Deduplicate: same content reported 50 times → 1 review
  ├── Prioritize by report count and reporter trust score
  ├── Cross-reference with ML scores (already flagged?)
  └── Route to appropriate review team
\`\`\`

## Real-Time vs Batch Moderation

\`\`\`
Real-time (synchronous, at post creation):
  ├── Pre-screening                    < 10ms
  ├── ML classification (text + image) < 100ms
  ├── Decision: block/allow/queue      < 1ms
  └── Total: < 200ms added to post creation

Batch (asynchronous, post-publish):
  ├── Video analysis (full video, not just keyframes)
  │   → Process time: 30s-5min per video
  │
  ├── Cross-content analysis
  │   → Same image posted by 1000 accounts = coordinated campaign
  │   → Runs every 10 minutes
  │
  ├── Network analysis
  │   → Detect bot networks, troll farms
  │   → Shared IPs, similar posting patterns
  │   → Runs hourly (Spark job)
  │
  └── Model retraining
      → Incorporate new human review labels
      → Weekly retraining cycle
\`\`\`

## Scale Numbers

\`\`\`
Content processed:       500M posts + 5B comments = 5.5B items/day
Pre-screening blocks:    ~110M/day (2% of total)
ML classification:       ~5.4B/day (remaining 98%)
Items flagged for review: ~25M/day (~5% of ML-processed)
Human reviews completed: ~25M/day (15K moderators)
GPU infrastructure:      ~2,000 GPUs for inference
Model count:             12+ specialized models
Auto-removal (high conf): ~150M items/day
Appeal reviews:          ~500K/day
Proactive detection rate: 95% of violations caught before report
\`\`\``,
    },
    {
      id: "social-multi-region",
      slug: "social-multi-region",
      title: "Multi-Region Architecture",
      content: `# Social Network: Multi-Region Architecture

## Why Multi-Region?

A social network with 2 billion users across 100+ countries cannot serve everyone from a single data center. Multi-region architecture is required for:

1. **Latency** — Users in Tokyo cannot wait 200ms+ for round-trips to a US data center
2. **Availability** — A single region failure should not take down the entire platform
3. **Data sovereignty** — GDPR (EU), LGPD (Brazil), PIPL (China) require data stored locally
4. **Capacity** — No single region can handle 8.4 million feed reads/second

## Regional Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Global Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ DNS      │  │ Global   │  │ Config + Feature     │  │
│  │ (GeoDNS) │  │ Load     │  │ Flags (Consul/etcd)  │  │
│  │          │  │ Balancer │  │                      │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │               │               │
   ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
   │ US-East   │   │ EU-West   │   │ AP-East   │
   │ Region    │   │ Region    │   │ Region    │
   │           │   │           │   │           │
   │ ┌───────┐ │   │ ┌───────┐ │   │ ┌───────┐ │
   │ │API GW │ │   │ │API GW │ │   │ │API GW │ │
   │ └───┬───┘ │   │ └───┬───┘ │   │ └───┬───┘ │
   │     │     │   │     │     │   │     │     │
   │ ┌───┴───┐ │   │ ┌───┴───┐ │   │ ┌───┴───┐ │
   │ │Service│ │   │ │Service│ │   │ │Service│ │
   │ │Fleet  │ │   │ │Fleet  │ │   │ │Fleet  │ │
   │ └───┬───┘ │   │ └───┬───┘ │   │ └───┬───┘ │
   │     │     │   │     │     │   │     │     │
   │ ┌───┴───┐ │   │ ┌───┴───┐ │   │ ┌───┴───┐ │
   │ │Data   │ │   │ │Data   │ │   │ │Data   │ │
   │ │Layer  │ │   │ │Layer  │ │   │ │Layer  │ │
   │ └───────┘ │   │ └───────┘ │   │ └───────┘ │
   └───────────┘   └───────────┘   └───────────┘
         ◀═══════ Cross-Region Replication ════════▶
\`\`\`

## Data Replication Strategies

Different data types need different replication strategies:

\`\`\`
Tier 1: User's home region (strong consistency)
  Data: user profile, auth, privacy settings, payment
  Strategy: single-leader in user's home region
  Cross-region: async replication (read replicas in other regions)
  Latency for writes: 0ms (local)
  Latency for remote reads: eventual, ~100-500ms lag

Tier 2: Global data (eventual consistency)
  Data: posts, comments, reactions, feed cache
  Strategy: multi-leader (each region accepts writes)
  Conflict resolution: last-writer-wins with vector clocks
  Replication lag: 100-500ms between regions
  Acceptable: seeing a "like" 500ms late is fine

Tier 3: Immutable / append-only (eventual consistency)
  Data: media (images, videos), analytics events, logs
  Strategy: write to local region, async replicate to CDN + backup
  No conflicts: immutable data cannot have write conflicts
\`\`\`

## User Home Region

Every user is assigned a "home region" — typically the region closest to where they created their account.

\`\`\`
User home region assignment:
  User in New York     → US-East
  User in London       → EU-West
  User in Tokyo        → AP-East
  User in Sao Paulo    → SA-East

Home region stores:
  ├── Source of truth for user's profile
  ├── User's social graph (friend list)
  ├── User's privacy settings
  └── User's authentication data

When user travels (Tokyo user visiting NYC):
  ├── Reads: served from US-East (local, fast)
  │   Feed, posts, profiles all cached locally
  ├── Writes to own profile: routed to AP-East (home region)
  │   Latency: ~150ms (cross-Pacific)
  ├── Posts creation: written to US-East (local)
  │   Replicated to AP-East async
  └── Transparent to user (feels fast)
\`\`\`

## Consistency Trade-offs by Feature

\`\`\`
┌─────────────────────┬─────────────────┬──────────────────────┐
│ Feature             │ Consistency     │ Why                  │
├─────────────────────┼─────────────────┼──────────────────────┤
│ Follow/unfriend     │ Strong (home)   │ Must not show stale  │
│                     │                 │ friend list          │
│ Post creation       │ Eventual        │ 500ms delay to other │
│                     │                 │ regions is acceptable│
│ Like count          │ Eventual        │ "1,234 likes" vs     │
│                     │                 │ "1,235" is fine      │
│ Privacy settings    │ Strong (home)   │ "Block user" must    │
│                     │                 │ take effect globally │
│ Direct messages     │ Strong (route   │ Messages must not be │
│                     │ through leader) │ lost or reordered    │
│ Feed ranking        │ Best-effort     │ Different regions    │
│                     │                 │ may show slightly    │
│                     │                 │ different feed order │
│ Account deletion    │ Strong (global) │ GDPR requires full   │
│                     │                 │ deletion everywhere  │
└─────────────────────┴─────────────────┴──────────────────────┘
\`\`\`

## CDN for Media

\`\`\`
Media delivery:
  500M images/day + 50M videos/day → massive bandwidth

CDN architecture:
  ┌──────────┐    ┌──────────────┐    ┌──────────────┐
  │ User     │───▶│ CDN Edge     │───▶│ Origin       │
  │ request  │    │ (200+ PoPs)  │    │ (regional)   │
  │ image    │    │              │    │              │
  │          │◀───│ Cache hit:   │    │              │
  │          │    │ ~95% of      │    │              │
  │          │    │ requests     │    │              │
  └──────────┘    └──────────────┘    └──────────────┘

Image pipeline:
  Original upload (4000×3000, 5 MB)
     │
     ▼
  Processing service:
     ├── Generate thumbnails: 150×150, 320×320, 640×640
     ├── Generate feed size: 1080×1080
     ├── Convert to WebP (30% smaller than JPEG)
     ├── Strip EXIF metadata (privacy)
     └── Push all variants to CDN origin

CDN bandwidth saved:
  Without CDN: 250 TB/day × 10 reads/image = 2.5 PB/day from origin
  With CDN (95% hit): 2.5 PB × 5% = 125 TB/day from origin
  Savings: 2.375 PB/day bandwidth
\`\`\`

## Edge Computing

Push computation closer to users for latency-sensitive features:

\`\`\`
Edge functions (Cloudflare Workers / Lambda@Edge):

  ├── A/B test assignment
  │   User's experiment group computed at edge
  │   No round-trip to origin needed
  │
  ├── Geo-targeted content
  │   Show region-specific trending topics
  │   Edge knows user's country from IP
  │
  ├── Rate limiting
  │   Block abusive traffic at edge
  │   Before it reaches origin servers
  │
  └── API response caching
      Cache GET /api/posts/{id} at edge
      TTL: 60 seconds (stale data acceptable)
      Hit rate: ~40% for popular posts

Edge locations: 200+ cities worldwide
Edge-to-user latency: < 20ms (most users)
Origin-to-user latency: 50-300ms (varies by distance)
\`\`\`

## Cross-Region Failure Handling

\`\`\`
Scenario: EU-West region goes down

Detection:
  Health checks fail → global load balancer detects within 30s

Failover:
  ├── EU users routed to US-East (next closest)
  ├── Latency increases: 20ms → 120ms for EU users
  ├── EU user profile writes: queued until EU-West recovers
  │   (or redirected to home region replica if available)
  └── Feed reads: served from US-East replica (slightly stale)

Recovery:
  ├── EU-West comes back online
  ├── Replication catch-up: sync missed writes (~minutes)
  ├── DNS gradually shifts EU users back
  └── Full recovery in ~15 minutes

Impact during failover:
  - Reads: degraded latency but functional
  - Writes: possible brief errors during DNS switch (~30s)
  - Data: no loss (async replication + write-ahead logs)
\`\`\`

## Scale Numbers

\`\`\`
Regions:                    5-7 major (US-East, US-West, EU-West,
                            EU-North, AP-East, AP-South, SA-East)
CDN PoPs:                   200+ cities
Edge compute locations:     200+ (co-located with CDN)
Cross-region replication:   ~500ms (US ↔ EU), ~200ms (intra-continent)
CDN cache hit rate:         95% for images, 80% for API responses
CDN bandwidth served:       ~2.5 PB/day
Origin bandwidth:           ~125 TB/day (after CDN)
Failover detection:         < 30 seconds
Failover recovery:          < 15 minutes
Data sovereignty regions:   EU (GDPR), Brazil (LGPD), India (DPDP)
\`\`\`

## Trade-offs

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| Replication | Multi-leader (most data) | Single-leader | Latency: users write locally |
| Conflict resolution | LWW + vector clocks | CRDTs | Simpler, works for social data |
| Home region | User's signup region | Dynamic (travel-based) | Simpler, predictable data locality |
| Media delivery | CDN + edge cache | Direct from origin | 95% bandwidth reduction |
| Consistency model | Per-feature choice | Global strong consistency | Strong consistency cannot scale globally |`,
    },
    {
      id: "social-architecture",
      slug: "social-architecture",
      title: "Architecture Walkthrough",
      content: `# Social Network: Complete Architecture Walkthrough

## Full System Architecture

\`\`\`
                        ┌─────────────────────────┐
                        │    GeoDNS + CDN          │
                        │  (route to nearest       │
                        │   region, cache media)   │
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │     API Gateway         │
                        │  (auth, rate limit,      │
                        │   routing, edge cache)   │
                        └────────────┬────────────┘
                                     │
      ┌──────────────────────────────┼──────────────────────────────┐
      │          │          │        │        │          │          │
┌─────▼───┐ ┌───▼────┐ ┌───▼──┐ ┌───▼──┐ ┌───▼───┐ ┌───▼───┐ ┌───▼──────┐
│ Feed    │ │ Post   │ │Graph │ │Search│ │Notif. │ │Media  │ │Moderation│
│ Service │ │ Service│ │Svc   │ │Svc   │ │Svc    │ │Svc    │ │Pipeline  │
│ - rank  │ │ - CRUD │ │- TAO │ │- ES  │ │- push │ │- proc │ │- ML      │
│ - cache │ │ - fan  │ │- FoF │ │- user│ │- email│ │- thumb│ │- rules   │
│ - merge │ │   out  │ │- sugg│ │- post│ │- badge│ │- CDN  │ │- review  │
└────┬────┘ └───┬────┘ └──┬───┘ └──┬───┘ └──┬────┘ └──┬────┘ └────┬─────┘
     │          │         │        │        │         │           │
     └──────────┴────┬────┴────────┴────────┴─────────┴───────────┘
                     │
    ┌────────────────┼────────────────┬────────────────┐
    ▼                ▼                ▼                ▼
┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
│ Redis    │  │ MySQL/   │  │ Kafka        │  │ Object       │
│ Cluster  │  │ Postgres │  │ Event Bus    │  │ Storage      │
│ (feed    │  │ (users,  │  │ (events,     │  │ (images,     │
│  cache,  │  │  posts,  │  │  fan-out,    │  │  videos,     │
│  graph   │  │  graph)  │  │  analytics)  │  │  CDN origin) │
│  cache)  │  │          │  │              │  │              │
└──────────┘  └──────────┘  └──────────────┘  └──────────────┘
\`\`\`

## Data Flow: User Creates a Post

Let's trace the complete flow of creating and distributing a photo post.

### Step 1: Upload and Store

\`\`\`
User opens app, selects photo, writes caption, taps "Post":

Client:
  ├── Upload image to Media Service (multipart form)
  ├── POST /api/posts { caption: "Beach day!", media: ["img_abc"] }
  └── Optimistic UI: show post in user's own feed immediately

API Gateway:
  ├── Authenticate: OAuth token → user_12345
  ├── Rate limit: < 10 posts/hour (under limit)
  └── Route to Post Service

Media Service:
  ├── Store original image in object storage
  ├── Generate variants: thumbnail, feed-size, full-size
  ├── Convert to WebP format
  ├── Strip EXIF metadata
  ├── Push to CDN origin in all regions
  └── Return media URLs
\`\`\`

### Step 2: Content Moderation

\`\`\`
Post Service → Moderation Pipeline (synchronous):

  Pre-screen (< 10ms):
    ├── Image hash: not in CSAM database ✓
    ├── Spam check: account age > 30 days, no spam patterns ✓
    └── PASS

  ML Classification (< 100ms):
    ├── Image model: nudity=0.02, violence=0.01 ✓
    ├── Text model: hate=0.01, spam=0.03 ✓
    └── All scores below threshold → ALLOW

  Decision: publish post immediately
  (If flagged: reduce distribution + queue for human review)
\`\`\`

### Step 3: Fan-Out to Followers

\`\`\`
Post Service publishes event to Kafka:
  Topic: post.created
  { post_id: "post_789", user_id: "user_12345", timestamp: ... }

Fan-Out Service consumes event:
  ├── Query Graph Service: "Who follows user_12345?"
  │   └── Returns 850 follower IDs
  │
  ├── Check: is user_12345 a celebrity (>10K followers)?
  │   └── NO (850 < 10K) → fan-out on write
  │
  ├── For each follower, update feed cache:
  │   ZADD feed:user_101 1710345600 post_789
  │   ZADD feed:user_102 1710345600 post_789
  │   ... (850 Redis writes)
  │
  └── Publish to notification topic:
      "user_12345 posted a new photo"
\`\`\`

### Step 4: Notification Delivery

\`\`\`
Notification Service consumes event:
  ├── Check follower notification preferences:
  │   ├── user_101: push=ON, email=OFF → send push
  │   ├── user_102: push=ON, email=ON → send push + email
  │   ├── user_103: push=OFF → skip
  │   └── ...
  │
  ├── Aggregate: don't notify all 850 individually for "close friends"
  │   "user_12345 and 3 others posted new photos"
  │
  ├── Push via APNs (iOS) / FCM (Android)
  │   Batch: up to 500 per API call
  │   Latency: ~100ms for push delivery
  │
  └── Badge count update: increment unread count
\`\`\`

## Data Flow: User Opens Feed

### Step 1: Feed Assembly

\`\`\`
User opens app → GET /api/feed?cursor=&limit=20

Feed Service:
  ├── Read pre-computed feed from Redis:
  │   ZREVRANGE feed:user_101 0 199
  │   → Returns 200 post IDs (sorted by timestamp, newest first)
  │
  ├── Check celebrity posts (user follows 3 celebrities):
  │   For each celebrity, get latest posts since last feed refresh
  │   → Returns 5 additional post IDs
  │
  ├── Merge: 200 normal + 5 celebrity = 205 candidate posts
  │
  ├── Hydrate: batch-fetch post content from Post Service
  │   GET /internal/posts/batch?ids=post_789,post_790,...
  │   → Returns full post objects (text, media URLs, author info)
  │
  └── Continue to ranking
\`\`\`

### Step 2: Feed Ranking

\`\`\`
Feed Ranking Service:
  ├── First pass (lightweight, CPU):
  │   Score = 0.3 × recency + 0.3 × affinity + 0.2 × engagement + 0.2 × type_pref
  │   → Reduce 205 candidates to top 50
  │
  ├── Second pass (heavy ML, GPU):
  │   DLRM model: P(like) × 1.0 + P(comment) × 3.0 + P(share) × 5.0
  │   → Re-rank top 50 by expected engagement value
  │
  ├── Diversity injection:
  │   Don't show 5 posts from same person in a row
  │   Mix content types: photo, video, text, story
  │
  └── Return top 20 posts (first page)

Response to client: ~120ms total
  Cache read:       5ms
  Celebrity query:  15ms
  Hydration:        30ms
  Ranking:          60ms
  Serialization:    10ms
\`\`\`

### Step 3: Infinite Scroll

\`\`\`
User scrolls down → GET /api/feed?cursor=post_808&limit=20

  ├── Use cursor to fetch next page from ranked list
  ├── Posts 21-40 already ranked in first request (cached server-side)
  ├── Prefetch: client requests page 2 when user is 70% through page 1
  └── Response: < 50ms (pre-ranked, pre-hydrated)

When ranked list exhausted (> 200 posts viewed):
  ├── Fetch more candidates from feed cache + celebrity index
  ├── Fall back to "suggested" content (posts from non-followed users)
  └── ML model selects relevant suggested content
\`\`\`

## Key Databases

| Data | Store | Why |
|------|-------|-----|
| User profiles | MySQL/PostgreSQL (sharded by user_id) | ACID, relational |
| Social graph | MySQL + TAO cache (in-memory) | Fast traversal, >99.8% cache hit |
| Posts | MySQL/PostgreSQL (sharded by user_id) | Relational, indexed by time |
| Feed cache | Redis Cluster (sorted sets) | Pre-computed feeds, fast reads |
| Media | Object storage + CDN | Large blobs, global distribution |
| Search index | Elasticsearch | Full-text search, faceted queries |
| Events | Kafka (7-day retention) | Fan-out, analytics, notifications |
| Analytics | Spark + data lake (S3/HDFS) | Petabyte-scale batch processing |
| ML features | Redis + feature store | Real-time feature serving for ranking |

## Reliability

| Failure | Impact | Mitigation |
|---------|--------|------------|
| Feed cache (Redis) down | Feeds cannot load | Regenerate from Post DB (cold start: 500ms) |
| Post DB shard down | Posts on that shard unavailable | Replica promotion, < 30s failover |
| Graph Service down | Cannot compute suggestions | Serve cached suggestions, degrade gracefully |
| Kafka down | Fan-out delayed | Disk-backed; replay on recovery |
| Moderation pipeline down | Unmoderated content published | Queue content; process when recovered |
| Region down | Users in region affected | GeoDNS failover to next-closest region |

## Scaling Summary

| Component | Scale | Strategy |
|-----------|-------|----------|
| API Gateway | 10M+ req/s | Regional, horizontally scaled |
| Feed Service | 8.4M reads/s | Stateless, Redis-backed |
| Feed Cache (Redis) | 12 TB, 400 instances | Sharded by user_id |
| Post Service | 17K writes/s peak | Sharded MySQL by user_id |
| Graph Service | 500K queries/s | TAO cache, >99.8% hit rate |
| Fan-Out Service | 2.9M cache writes/s | Kafka consumers, horizontally scaled |
| Media Pipeline | 500M images/day | Object storage + CDN (95% cache hit) |
| Moderation | 5.5B items/day | 2,000 GPUs + 15K human reviewers |
| Search (ES) | 1M queries/s | Sharded Elasticsearch cluster |
| Notification | 1B+ pushes/day | Batched APNs/FCM delivery |`,
    },
  ],
};
