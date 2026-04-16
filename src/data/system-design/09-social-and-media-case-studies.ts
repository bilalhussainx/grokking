import { Module } from "../types";

export const socialAndMediaCaseStudiesModule: Module = {
  id: "social-and-media-case-studies",
  title: "Case Studies: Social Platforms & Media",
  description: "Design Instagram, Twitter, YouTube, Messenger, and Twitch — the canonical social and media system design problems that appear most in FAANG interviews.",
  lessons: [
    {
      id: "design-instagram",
      slug: "design-instagram",
      title: "Design Instagram (Photo Sharing at Scale)",
      content: `# Design Instagram (Photo Sharing at Scale)

\`\`\`concept
{
  "title": "The Read-Heavy Social Graph",
  "body": "Instagram's core design tension: generating a home feed requires aggregating posts from hundreds of followed accounts — potentially thousands of DB queries per load. The architectural answer is fan-out on write (pre-build feed caches) vs fan-out on read (query at read time), with a hybrid for celebrity accounts."
}
\`\`\`

## Fan-Out Strategy

\`\`\`compare
{
  "title": "Fan-Out on Write vs Read vs Hybrid",
  "headers": ["Approach", "Write cost", "Read cost", "Used for"],
  "rows": [
    ["Fan-out on write (push)", "O(followers) — push to every feed cache", "O(1) — cache hit", "Regular users (< 100K followers)"],
    ["Fan-out on read (pull)", "O(1)", "O(following) — query all followed", "Would be too slow for large follow lists"],
    ["Hybrid (Instagram's actual)", "Push for regular users; skip celebrities", "Read cache + merge celeb posts", "All users"]
  ]
}
\`\`\`

## Architecture

\`\`\`sysdiag
{
  "title": "Instagram Architecture",
  "description": "Upload path: S3 + CDN. Feed write: Kafka fan-out service pushes post IDs to follower Redis sorted sets. Feed read: Redis + batch Cassandra fetch + celebrity merge.",
  "nodes": [
    { "id": "app", "label": "Mobile App", "type": "client" },
    { "id": "api", "label": "API Servers", "type": "service" },
    { "id": "s3", "label": "S3 + CDN\\n(photos)", "type": "storage" },
    { "id": "fanout", "label": "Fan-out Service\\n(Kafka consumer)", "type": "service" },
    { "id": "feed", "label": "Feed Cache\\n(Redis sorted set)", "type": "storage" },
    { "id": "posts", "label": "Posts DB\\n(Cassandra)", "type": "storage" }
  ],
  "connections": [
    { "from": "app", "to": "api" },
    { "from": "api", "to": "s3", "label": "presigned upload" },
    { "from": "api", "to": "fanout", "label": "new post event" },
    { "from": "fanout", "to": "feed", "label": "ZADD postId" },
    { "from": "api", "to": "feed", "label": "read feed" },
    { "from": "api", "to": "posts", "label": "batch fetch details" }
  ]
}
\`\`\`

## Feed Cache Design

Feed cache uses Redis sorted sets: score = timestamp, value = post_id. On read: ZREVRANGE returns latest 20 post IDs → batch fetch details from Cassandra by primary key. Feed stores IDs only — not full content.

Celebrity accounts (> 100K followers): skip fan-out entirely. At read time, fetch their recent posts and merge with pre-built cache before returning the feed.

\`\`\`quiz
{
  "question": "A celebrity with 10M followers posts a photo. Pure fan-out on write generates how many Redis writes, and why is this unsustainable?",
  "options": [
    "10M writes — one per follower's feed cache. At 100K writes/sec, this takes 100 seconds during which other fan-outs queue up.",
    "1 write — Redis handles fan-out internally",
    "1000 writes — fan-out batches into groups of 10K",
    "0 writes — celebrity posts bypass the cache"
  ],
  "answer": 0,
  "explanation": "10M followers = 10M Redis ZADD operations. At typical Redis throughput, this takes ~100 seconds — completely unworkable. The hybrid approach skips fan-out for celebrities (> 100K followers threshold) and merges their posts at read time instead."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Hybrid fan-out: push to cache for regular users, pull at read time for celebrities (> 100K followers)",
    "Feed cache: Redis sorted set with score=timestamp — stores post IDs only, fetches details in batch from Cassandra",
    "Photo upload: presigned S3 URLs allow clients to upload directly to S3, bypassing API servers entirely",
    "Cassandra for posts: partition by user_id, cluster by post_id DESC — efficient per-user post history scans"
  ]
}
\`\`\``,
    },
    {
      id: "design-twitter-news-feed",
      slug: "design-twitter-news-feed",
      title: "Design Twitter / X (Social Feed with Fan-Out)",
      content: `# Design Twitter / X (Social Feed with Fan-Out)

\`\`\`concept
{
  "title": "Fan-Out at Asymmetric Scale",
  "body": "Twitter's defining challenge: accounts with 100M followers posting tweets that must appear in 100M timelines within seconds. 500M tweets/day with 50B timeline reads/day (100:1 read:write ratio). The hybrid fan-out model is the central architectural decision."
}
\`\`\`

## Hybrid Fan-Out Architecture

\`\`\`sysdiag
{
  "title": "Twitter Feed Architecture",
  "description": "Tweet written → Kafka → fan-out workers (for regular users) → Redis timeline cache. Celebrity tweets merged at read time. Search indexed via Elasticsearch.",
  "nodes": [
    { "id": "client", "label": "Client", "type": "client" },
    { "id": "api", "label": "Tweet API", "type": "service" },
    { "id": "kafka", "label": "Kafka", "type": "storage" },
    { "id": "fanout", "label": "Fan-out Workers", "type": "service" },
    { "id": "cache", "label": "Timeline Cache\\n(Redis)", "type": "storage" },
    { "id": "tweets", "label": "Tweets DB\\n(Cassandra)", "type": "storage" },
    { "id": "search", "label": "Elasticsearch", "type": "service" }
  ],
  "connections": [
    { "from": "client", "to": "api" },
    { "from": "api", "to": "tweets" },
    { "from": "api", "to": "kafka" },
    { "from": "kafka", "to": "fanout" },
    { "from": "fanout", "to": "cache", "label": "push tweet_id" },
    { "from": "kafka", "to": "search", "label": "index" },
    { "from": "api", "to": "cache", "label": "read timeline" }
  ]
}
\`\`\`

## Trending Topics — Count-Min Sketch

Counting hashtag frequency over 24 hours across 500M tweets requires a probabilistic approach. Count-Min Sketch: a 2D array of counters, updated via W independent hash functions. Query returns the minimum bucket value — a fast, compact upper bound.

Size: 10KB for 1% error tolerance vs GB for exact frequency maps. Kafka Streams window aggregation + Count-Min Sketch gives near-real-time trending.

\`\`\`quiz
{
  "question": "Twitter uses fan-out on write for regular users. An account with 1M followers tweets. The fan-out service is processing at 100K Redis writes/sec. How long does fan-out take?",
  "options": [
    "1M / 100K = 10 seconds — during which subsequent tweets from other accounts queue up",
    "Instantaneous — Kafka parallelizes it",
    "1 second — Redis pipelines all writes",
    "100 seconds — Cassandra bottleneck"
  ],
  "answer": 0,
  "explanation": "1M writes at 100K/sec = 10 seconds of backlog just for one popular tweet. This is why Twitter applies the celebrity threshold: accounts above ~100K followers skip fan-out entirely. Their tweets are pulled at read time, merged with the pre-built timeline from the cache."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Hybrid fan-out: push for regular users, pull for celebrities — threshold typically 100K followers",
    "Cassandra for tweets: partition by user_id, cluster by tweet_id (Snowflake) DESC — time-ordered per user",
    "Count-Min Sketch for trending: O(1) update, O(KB) memory vs GB for exact frequency counting",
    "Elasticsearch full-text search: time-based index rotation (daily), drop indexes older than 7 days"
  ]
}
\`\`\``,
    },
    {
      id: "design-youtube-netflix",
      slug: "design-youtube-netflix",
      title: "Design YouTube / Netflix (Video Streaming)",
      content: `# Design YouTube / Netflix (Video Streaming)

\`\`\`concept
{
  "title": "Bandwidth and Encoding at Scale",
  "body": "Netflix serves 15% of global internet bandwidth. Every architectural decision exists to reduce bandwidth cost and improve playback quality under variable networks. The two core challenges: encode each video into multiple quality renditions before anyone can watch it, then distribute those renditions globally via CDN with adaptive bitrate streaming."
}
\`\`\`

## Upload and Transcoding Pipeline

\`\`\`steps
{
  "title": "From Raw Upload to Playback-Ready",
  "steps": [
    { "step": "Client uploads raw video to S3", "detail": "Multipart upload via presigned URL. Direct client-to-S3 — no API server bottleneck." },
    { "step": "S3 event triggers transcoding workers", "detail": "Kafka message → GPU transcoder fleet. Each worker handles one rendition (360p, 720p, 1080p, 4K) in parallel." },
    { "step": "Split each rendition into 6s HLS/DASH segments", "detail": "Each segment is a self-contained playable chunk. Player fetches segments sequentially, switching quality per segment." },
    { "step": "Upload segments to S3 origin, CDN distributes", "detail": "First request per CDN PoP fetches from S3. All subsequent requests served from CDN edge (<20ms)." }
  ]
}
\`\`\`

## Adaptive Bitrate Streaming

The player monitors download speed per segment. If a 1080p segment (taking 5s to download) plays for 6s — buffer ratio = 1.2×. If ratio drops below 1.2×, step down to 720p. If buffers are healthy, step up. No buffering interruptions — quality adapts silently.

\`\`\`compare
{
  "title": "HLS vs DASH",
  "headers": ["Property", "HLS (Apple)", "DASH (MPEG)"],
  "rows": [
    ["Manifest", ".m3u8", ".mpd (XML)"],
    ["Segment size", "6-10s (lower latency with LL-HLS)", "2-6s"],
    ["Browser support", "Native on Apple, hls.js elsewhere", "Native via MSE"],
    ["Used by", "iOS/tvOS", "YouTube, Netflix web"]
  ]
}
\`\`\`

## Netflix Open Connect

Netflix deploys appliances inside ISPs and IXPs — a mini-CDN physically inside the ISP's network. Popular titles pre-positioned during off-peak. Result: 95%+ of Netflix traffic never crosses a transcontinental link.

\`\`\`quiz
{
  "question": "YouTube uses 10-second HLS segments for VOD and 2-second segments for live events. Why the difference?",
  "options": [
    "Longer segments compress better — VOD can afford larger files",
    "Live events need shorter segments to reduce latency: segment duration is a floor on how far behind live the viewer is",
    "VOD has more bandwidth available for larger segments",
    "It's a licensing difference between HLS versions"
  ],
  "answer": 1,
  "explanation": "Viewer lag ≥ segment duration. With 10s segments, viewers are at minimum 10s behind live — acceptable for VOD where there's no 'live' edge. For live events, 2s segments mean viewers are only 4-6s behind live (2s segment + 2-3s CDN propagation + buffering). Shorter segments = lower latency but higher CDN request rate (5× more requests per minute per viewer)."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Transcode each video into 8+ renditions (resolution × codec) split into 6s chunks — stored in S3 behind CDN",
    "Adaptive bitrate streaming switches quality per segment based on measured download speed — no buffering",
    "CDN is the scalability lever: one origin fetch per PoP serves all viewers in that region",
    "Netflix Open Connect: appliances inside ISPs eliminate transcontinental bandwidth for 95%+ of traffic"
  ]
}
\`\`\``,
    },
    {
      id: "design-facebook-messenger",
      slug: "design-facebook-messenger",
      title: "Design a Chat Application (Facebook Messenger / WhatsApp)",
      content: `# Design a Chat Application (Facebook Messenger / WhatsApp)

\`\`\`concept
{
  "title": "Real-Time Messaging at Billion-User Scale",
  "body": "WhatsApp serves 100B messages/day with ~50 engineers. Chat combines three requirements: real-time delivery for online users (< 100ms), reliable store-and-forward for offline users, and read receipts. The WebSocket + Redis pub/sub + Cassandra combination is the canonical solution."
}
\`\`\`

## Message Flow

\`\`\`steps
{
  "title": "1:1 Message Delivery",
  "steps": [
    { "step": "Sender's app holds WebSocket connection to Chat Server 1", "detail": "Redis maps user_id → server_id for routing" },
    { "step": "Message written to Cassandra", "detail": "Partition by conversation_id, cluster by message_id (Snowflake) DESC. Returns 'sent' ✓ to sender." },
    { "step": "Route to recipient's server", "detail": "Look up recipient server_id in Redis. Publish via Redis pub/sub to that server." },
    { "step": "Online delivery", "detail": "Recipient's server pushes via WebSocket. Recipient acks → 'delivered' ✓✓." },
    { "step": "Offline: queue → push notification → flush on reconnect", "detail": "Store in Cassandra undelivered queue. APNs/FCM wakes app. App opens WebSocket → server flushes queue." }
  ]
}
\`\`\`

## Architecture

\`\`\`sysdiag
{
  "title": "Chat Architecture",
  "description": "Users hold WebSocket connections to chat servers. Redis maps users to servers and handles pub/sub routing. Cassandra stores all messages durably.",
  "nodes": [
    { "id": "alice", "label": "Alice", "type": "client" },
    { "id": "bob", "label": "Bob", "type": "client" },
    { "id": "cs1", "label": "Chat Server 1", "type": "service" },
    { "id": "cs2", "label": "Chat Server 2", "type": "service" },
    { "id": "redis", "label": "Redis\\n(routing + pub/sub)", "type": "storage" },
    { "id": "cass", "label": "Cassandra\\n(messages)", "type": "storage" }
  ],
  "connections": [
    { "from": "alice", "to": "cs1", "label": "WebSocket" },
    { "from": "bob", "to": "cs2", "label": "WebSocket" },
    { "from": "cs1", "to": "cass", "label": "persist" },
    { "from": "cs1", "to": "redis", "label": "route to CS2" },
    { "from": "cs1", "to": "cs2", "label": "pub/sub" },
    { "from": "cs2", "to": "bob", "label": "push" }
  ]
}
\`\`\`

## Message Storage Schema

\`\`\`
Cassandra: partition_key = conversation_id, clustering = message_id DESC
→ "last 50 messages in conversation X" = single partition sequential scan = ~1ms
\`\`\`

Group chats < 100 members: fan-out on write to all member connections. Group chats > 100 members (Slack channels): pull-based log — members fetch since last seen message_id.

\`\`\`quiz
{
  "question": "Why Cassandra instead of PostgreSQL for message storage at WhatsApp scale?",
  "options": [
    "Cassandra supports full-text search, PostgreSQL doesn't",
    "Cassandra's partition_key=conversation_id makes 'last 50 messages' a single-partition scan. At 100B messages, PostgreSQL range queries require cross-shard joins or table scans.",
    "PostgreSQL doesn't support TTL, which is needed for message expiry",
    "Cassandra has better replication — PostgreSQL only supports 1 replica"
  ],
  "answer": 1,
  "explanation": "The primary access pattern is 'give me the last 50 messages in conversation X' — a time-ordered range query by conversation. Cassandra's data model maps this perfectly: partition_key=conversation_id means all messages for a conversation are co-located. The query is a single partition sequential scan regardless of total message count. PostgreSQL needs an index on (conversation_id, created_at) — at 100B rows, even indexed queries hit significant overhead without sharding."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "WebSockets + Redis user→server mapping + pub/sub enable cross-server message routing",
    "Cassandra partition by conversation_id: last-N-messages query = single partition scan = ~1ms",
    "Offline users: store in Cassandra, send push notification, flush queue on WebSocket reconnect",
    "Group chats: fan-out on write for small groups; pull-based log for large channels"
  ]
}
\`\`\``,
    },
    {
      id: "design-live-streaming",
      slug: "design-live-streaming",
      title: "Design a Live Streaming Platform (Twitch)",
      content: `# Design a Live Streaming Platform (Twitch)

\`\`\`concept
{
  "title": "Real-Time Encoding at CDN Scale",
  "body": "Live streaming differs fundamentally from VOD: the content doesn't exist until the streamer creates it. You must encode in real-time, distribute globally within seconds, and serve millions of viewers simultaneously — all while the stream is actively being produced. The RTMP → transcoder → HLS → CDN pipeline is the standard architecture."
}
\`\`\`

## Pipeline

\`\`\`sysdiag
{
  "title": "Live Streaming Architecture",
  "description": "Streamer sends RTMP to nearest ingest PoP. GPU transcoder generates HLS segments every 2s. Segments pushed to S3. CDN distributes to 30M viewers.",
  "nodes": [
    { "id": "streamer", "label": "Streamer (OBS)\\nRTMP", "type": "client" },
    { "id": "ingest", "label": "Ingest PoP", "type": "service" },
    { "id": "transcode", "label": "GPU Transcoder\\n(real-time FFmpeg)", "type": "service" },
    { "id": "s3", "label": "HLS Segments\\n(S3)", "type": "storage" },
    { "id": "cdn", "label": "Global CDN", "type": "gateway" },
    { "id": "viewers", "label": "30M Viewers", "type": "client" },
    { "id": "chat", "label": "Chat Service\\n(WebSocket)", "type": "service" }
  ],
  "connections": [
    { "from": "streamer", "to": "ingest" },
    { "from": "ingest", "to": "transcode" },
    { "from": "transcode", "to": "s3", "label": "2s segments" },
    { "from": "s3", "to": "cdn" },
    { "from": "cdn", "to": "viewers" },
    { "from": "viewers", "to": "chat", "label": "WebSocket" }
  ]
}
\`\`\`

## Latency Tiers

\`\`\`compare
{
  "title": "Live Streaming Latency vs Scale",
  "headers": ["Mode", "Latency", "Mechanism", "Scale"],
  "rows": [
    ["Broadcast (HLS 6s)", "6-10s behind live", "Standard HLS segments", "Unlimited (CDN cached)"],
    ["Low Latency (LL-HLS 2s)", "2-4s behind live", "2s segments + HTTP/2 push", "CDN must support LL-HLS"],
    ["Ultra-Low (WebRTC)", "< 1s", "Peer-to-peer / SFU", "~10K viewers max per session"]
  ]
}
\`\`\`

## Chat at Mega-Scale

A Twitch stream with 100K concurrent chatters generates 100K+ messages/minute. The platform deliberately samples messages — viewers see ~10% of chat. This is correct behavior: no human can read 100K messages/minute anyway.

Strategy per audience size: < 100 viewers = direct WebSocket fan-out. 1K-10K = Kafka topic per channel. 100K+ = message sampling + rate limiting per user.

\`\`\`quiz
{
  "question": "500K viewers watch a stream from a single CDN PoP that has the latest HLS segment cached. How many S3 (origin) requests does this generate per segment?",
  "options": [
    "500K — one per viewer",
    "1 — CDN serves all 500K viewers from its cache after one origin fetch",
    "50K — 10% cache miss rate",
    "0 — viewers connect directly to the transcoder"
  ],
  "answer": 1,
  "explanation": "CDN is the core efficiency of live streaming at scale. Once a PoP fetches a segment from S3 (one request), it caches and serves all viewers in that region. Origin sees approximately (number of CDN PoPs) requests per segment — typically 10-100 — not (number of viewers) requests. This is how a modest S3 origin serves millions of simultaneous viewers."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "RTMP ingest → real-time GPU transcoding → 2s HLS segments in S3 → CDN → viewers",
    "CDN serves all regional viewers from one origin fetch — scales to millions with ~100 origin requests/segment",
    "Chat sampling at mega-scale is correct UX: 10% of 100K messages/min is still unreadable",
    "WebRTC for < 1s latency is limited to ~10K viewers; HLS for broadcast scale"
  ]
}
\`\`\``,
    },
    {
      id: "checkpoint-social-media-systems",
      slug: "checkpoint-social-media-systems",
      title: "Checkpoint: Social System Deep-Dive Questions",
      content: `# Checkpoint: Social System Deep-Dive Questions

\`\`\`callout
{
  "variant": "info",
  "title": "Module Checkpoint",
  "content": "Test your understanding of the social platform case studies with cross-cutting trade-off questions."
}
\`\`\`

\`\`\`collapse
{
  "title": "Why do Instagram and Twitter both use hybrid fan-out, but with different implementations?",
  "content": "Both platforms have celebrity accounts that make pure fan-out-on-write unsustainable (10M+ Redis writes per post). The hybrid is the same concept: push for regular users, pull for celebrities at read time.\\n\\nKey difference: Twitter's content (text, 280 chars) is much cheaper to store and fetch than Instagram's (photos with metadata, CDN URLs). Twitter's Redis timeline caches are smaller per post. Instagram's fan-out needs to also update the CDN edge caches for photo thumbnails. The threshold (~100K followers) is similar, but the implementation complexity differs because of media handling."
}
\`\`\`

\`\`\`collapse
{
  "title": "YouTube and Twitch both use HLS. Why does Twitch use 2s segments while YouTube uses 6-10s?",
  "content": "YouTube is VOD — the entire video is pre-encoded before any viewer starts. Longer segments (6-10s) are optimal because:\\n• CDN can pre-fetch segments ahead of playback position\\n• No live edge to worry about\\n• Better compression (more GOP data per segment)\\n\\nTwitch is live — segment duration is the minimum viewer lag. 2s segments = minimum 4-6s behind live (segment + CDN propagation + buffering). 6s segments = minimum 8-12s behind live — unacceptable for interactive streams.\\n\\nTradeoff: shorter segments = higher CDN request rate (5× more requests/min/viewer) + higher origin load from new segment pushes."
}
\`\`\`

\`\`\`collapse
{
  "title": "Messenger uses Cassandra, but Instagram uses Cassandra too. Are they using it the same way?",
  "content": "Same technology, different partition strategies optimized for different access patterns:\\n\\n**Messenger:** partition_key = conversation_id, clustering = message_id DESC.\\nAccess pattern: 'last 50 messages in conversation X' → single partition scan.\\n\\n**Instagram posts:** partition_key = user_id, clustering = post_id DESC.\\nAccess pattern: 'recent posts by user X for profile page' → single partition scan.\\n\\nBoth exploit Cassandra's strength: time-ordered range queries within a partition. The key insight is choosing the partition key to match the primary access pattern — putting frequently co-accessed data in the same partition."
}
\`\`\`

\`\`\`quiz
{
  "question": "Across Instagram, Twitter, YouTube, Messenger, and Twitch — which single Redis data type appears most frequently as a core component?",
  "options": [
    "Redis Hash — for user profile storage",
    "Redis Sorted Set — for feed ordering, timeline caches, and leaderboards",
    "Redis List — for message queues",
    "Redis String — for simple key-value caching"
  ],
  "answer": 1,
  "explanation": "Redis sorted set (ZADD/ZREVRANGE) is the workhorse: Instagram feed cache (score=timestamp, value=post_id), Twitter timeline cache (same pattern), Twitch leaderboards (score=view_count). The sorted set's O(log N) insert and O(log N + K) range retrieval make it ideal for any 'recent/top N items' problem — which appears in virtually every social system."
}
\`\`\`

\`\`\`takeaways
{
  "points": [
    "Fan-out strategy (push vs pull vs hybrid) is the defining design decision across all social feed systems",
    "Cassandra partition key must match primary access pattern — co-locate data that's queried together",
    "Redis sorted set appears in feed caches, timelines, and leaderboards — master ZADD/ZREVRANGE",
    "CDN is the scalability lever for all media (photos, video segments) — serves regional traffic from one origin fetch"
  ]
}
\`\`\``,
    },
  ],
};
