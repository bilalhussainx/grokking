import { Module } from "../types";

export const youtubeModule: Module = {
  id: "sd-11",
  title: "Design YouTube",
  description: "Design a video sharing platform supporting upload, transcoding, adaptive streaming, and content delivery at global scale.",
  lessons: [
    {
      id: "sd-11-01",
      slug: "youtube-requirements",
      title: "Requirements & Estimation",
      content: `# YouTube: Requirements & Estimation

## What Are We Designing?

A video sharing platform where users can upload videos, watch them via streaming, search for content, and receive recommendations. The focus is on the upload pipeline and video delivery — not the social features (comments, likes) or the recommendation algorithm.

\`\`\`concept
{
  "title": "Requirements Engineering at Global Scale",
  "variant": "mental-model",
  "content": "Think of requirements as a contract between users and the system. For YouTube-scale platforms, every requirement has a dollar cost: 1 PB/day storage ≈ $20M/year. The art is balancing what users need with what the business can afford."
}
\`\`\`

## Functional Requirements

1. **Video upload** — Users upload videos from their devices. Support common formats (MP4, MOV, AVI, etc.).
2. **Video streaming** — Users watch videos with adaptive quality based on their bandwidth.
3. **Video search** — Search by title, description, tags, and categories.
4. **Video metadata** — Store and display title, description, view count, uploader info, thumbnails.
5. **Recommendations** — Suggest related videos (we will not design the ML model, just the data flow).

## Non-Functional Requirements

- **High availability** — The platform must be always accessible for viewing.
- **Low latency for playback** — Video playback should start within 1-2 seconds.
- **Upload reliability** — Large uploads should support resumption if interrupted.
- **Global delivery** — Low-latency streaming worldwide via CDN.
- **Cost efficiency** — Video storage and bandwidth are the dominant costs.

\`\`\`callout
{
  "type": "warning",
  "title": "The 45% Budget Trap",
  "content": "Poorly defined requirements cause 45% average budget overruns in IT projects. For video platforms, underestimating storage needs by 2x could mean $500M+ in surprise infrastructure costs over 5 years."
}
\`\`\`

## Back-of-the-Envelope Estimation

Assume 500 million daily active viewers, 5 million video uploads per day, average video length 5 minutes.

| Metric | Calculation |
|--------|------------|
| Upload storage per day | 5M videos x 5 min x 50 MB/min (compressed) = **~1.25 PB/day** |
| After multi-resolution transcoding | ~3x original (360p, 720p, 1080p, 4K) = **~3.75 PB/day** |
| Storage per year | ~3.75 PB x 365 = **~1.37 EB/year** |
| Streaming bandwidth | 500M viewers x avg 30 min x 5 Mbps = enormous |
| Peak concurrent viewers | ~50M (assuming 10% of DAU at peak) |
| Peak bandwidth | 50M x 5 Mbps = **250 Pbps** (served by CDN) |

These numbers explain why YouTube-scale platforms spend billions on infrastructure. CDN and storage are by far the largest cost centers.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Storage Cost Growth Calculator",
  "inputs": [
    { "id": "daily_pb", "label": "Daily Storage (PB)", "default": 3.75, "min": 0.1, "max": 100 },
    { "id": "growth_rate", "label": "Annual Growth %", "default": 25, "min": 0, "max": 100 },
    { "id": "years", "label": "Years", "default": 5, "min": 1, "max": 10 }
  ]
}
\`\`\`

## Video Storage Breakdown

A single 5-minute source video (1080p) is roughly 250 MB. After transcoding:

| Resolution | Bitrate | Size (5 min) |
|-----------|---------|--------------|
| 360p | 0.5 Mbps | ~19 MB |
| 720p | 2.5 Mbps | ~94 MB |
| 1080p | 5 Mbps | ~188 MB |
| 4K | 15 Mbps | ~563 MB |

Storing all four resolutions: ~864 MB per video. With 5M uploads/day, that is ~4.3 PB/day — confirming our earlier estimate.

\`\`\`quiz
{
  "title": "Estimation Sanity Check",
  "questions": [
    {
      "question": "If we store only 1080p instead of 4 resolutions, what's the storage savings per 5-minute video?",
      "options": ["~50%", "~65%", "~78%", "~85%"],
      "answer": 2,
      "explanation": "864 MB total - 188 MB (1080p only) = 676 MB saved. 676/864 ≈ 78% reduction."
    },
    {
      "question": "At 250 Pbps peak bandwidth, how many 4K streams (15 Mbps) can we support simultaneously?",
      "options": ["~16M", "~50M", "~100M", "~250M"],
      "answer": 0,
      "explanation": "250 Pbps ÷ 15 Mbps = 250×10¹⁵ ÷ 15×10⁶ ≈ 16.7 million concurrent 4K streams."
    },
    {
      "question": "Why is multi-resolution transcoding essential despite 3-4x storage cost?",
      "options": ["Legal compliance", "Adaptive streaming needs", "Search indexing", "Backup redundancy"],
      "answer": 1,
      "explanation": "Adaptive streaming delivers the best quality each user's bandwidth can handle — impossible without multiple resolutions."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Video platforms are dominated by storage and bandwidth costs — everything else is secondary.",
    "Multi-resolution transcoding multiplies storage needs by 3-5x but is essential for adaptive streaming.",
    "CDN is mandatory — no single data center can serve 250+ Pbps of peak streaming bandwidth.",
    "Upload reliability (resumable uploads) is critical because videos are large files on often unreliable connections.",
    "Even 'simple' features like thumbnails require significant storage at scale (multiple thumbnails per video)."
  ]
}
\`\`\``,
    },
    {
      id: "sd-11-02",
      slug: "youtube-high-level-design",
      title: "High-Level Design",
      content: `# YouTube: High-Level Design

\`\`\`concept
{
  "title": "What is High-Level Design?",
  "variant": "mental-model",
  "content": "High-Level Design (HLD) is the architectural blueprint that defines the overall structure, major components, their interactions, and data flow of a system. It focuses on \\"what\\" the system should do and how its primary parts connect, serving as a roadmap for development and ensuring alignment among stakeholders."
}
\`\`\`

## Architecture Overview

The system has two main flows: the **upload pipeline** (write path) and the **streaming flow** (read path).

\`\`\`sysdiag
{
  "title": "YouTube High-Level Architecture",
  "width": 800,
  "height": 400,
  "nodes": [
    {"id":"client","label":"Client","x":80,"y":100,"kind":"device"},
    {"id":"upload","label":"Upload Service","x":200,"y":100,"kind":"service"},
    {"id":"object","label":"Object Store\\n(raw video)","x":320,"y":100,"kind":"storage"},
    {"id":"transcode","label":"Transcoding\\nPipeline","x":440,"y":100,"kind":"compute"},
    {"id":"metadata","label":"Metadata Service","x":200,"y":200,"kind":"service"},
    {"id":"cdn","label":"CDN\\n(encoded videos)","x":440,"y":200,"kind":"edge"},
    {"id":"search","label":"Search Service","x":320,"y":300,"kind":"service"}
  ],
  "edges": [
    {"from":"client","to":"upload","label":"upload"},
    {"from":"upload","to":"object","label":"store"},
    {"from":"object","to":"transcode","label":"process"},
    {"from":"transcode","to":"cdn","label":"distribute"},
    {"from":"upload","to":"metadata","label":"update"},
    {"from":"client","to":"metadata","label":"request"},
    {"from":"metadata","to":"cdn","label":"redirect"},
    {"from":"metadata","to":"search","label":"index"}
  ],
  "annotations": {
    "upload": "Handles resumable uploads with chunked transfer",
    "transcode": "Converts to multiple resolutions using FFmpeg",
    "cdn": "Global edge cache for low-latency delivery"
  }
}
\`\`\`

## Upload Flow

1. **Client** initiates a resumable upload via the Upload Service API.
2. **Upload Service** handles chunked upload, reassembles the file, and stores the raw video in an object store (e.g., S3, GCS).
3. **Metadata Service** stores video info (title, description, uploader, status) in a relational database. Initially the video status is "processing."
4. An event triggers the **Transcoding Pipeline**, which encodes the video into multiple resolutions and formats.
5. Transcoded segments are pushed to the **CDN** for global distribution.
6. Metadata Service updates the video status to "ready" and generates thumbnail URLs.

\`\`\`steps
{
  "title": "Upload Flow Deep Dive",
  "steps": [
    {
      "title": "Resumable Upload",
      "content": "Client uploads video in chunks. Each chunk has a checksum. If connection drops, client can resume from last successful chunk using the upload ID."
    },
    {
      "title": "Metadata Registration",
      "content": "While video bytes stream to object storage, metadata (title, description, tags) is written to PostgreSQL with status='processing'."
    },
    {
      "title": "Async Transcoding Trigger",
      "content": "Upload completion publishes an event to a message queue. Workers pick up the event and start FFmpeg jobs to generate 144p-4K variants."
    },
    {
      "title": "CDN Warm-up",
      "content": "First few segments of each quality are pushed to CDN edge nodes proactively, reducing time-to-first-byte for early viewers."
    }
  ]
}
\`\`\`

## Streaming Flow

1. **Client** requests a video by ID. The Metadata Service returns video info and a CDN URL.
2. **Client** fetches the video manifest file (e.g., HLS .m3u8) from the CDN.
3. **Client** downloads video segments from the CDN, starting with the appropriate quality level for its bandwidth.
4. The video player adaptively switches quality based on real-time bandwidth measurements.

\`\`\`algoviz
{
  "title": "Adaptive Bitrate Selection",
  "type": "array",
  "data": [720, 480, 360, 240, 144],
  "frames": [
    {"highlight": [0], "label": "Start at 720p (estimated bandwidth 5 Mbps)", "stats": {"buffer": 2, "bandwidth": 5000}},
    {"highlight": [1], "label": "Bandwidth drops to 2 Mbps → switch to 480p", "stats": {"buffer": 1.5, "bandwidth": 2000}},
    {"highlight": [3], "label": "Bandwidth spikes to 800 kbps → drop to 240p", "stats": {"buffer": 0.8, "bandwidth": 800}},
    {"highlight": [2], "label": "Bandwidth recovers to 3 Mbps → upgrade to 360p", "stats": {"buffer": 3.2, "bandwidth": 3000}}
  ],
  "speed": 1000
}
\`\`\`

## Key Components

### Upload Service
Handles resumable, chunked uploads. Supports pause/resume to handle flaky connections. Validates file format and size limits before accepting.

### Metadata Service
A CRUD service backed by a relational database (e.g., PostgreSQL). Stores: video ID, title, description, uploader ID, upload date, status, duration, resolution options, thumbnail URLs, view count.

### Transcoding Pipeline
Converts raw video into multiple resolutions and formats. This is compute-intensive and runs asynchronously. We will explore this in detail in the next lesson.

### CDN (Content Delivery Network)
Caches video segments at edge locations worldwide. When a user in Tokyo requests a video, they fetch it from a nearby CDN edge server rather than the origin data center in the US.

### Search Service
Indexes video metadata (title, description, tags) for text search. Backed by Elasticsearch or a similar search engine.

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "Why are upload and streaming paths kept separate?",
      "options": [
        "To reduce code complexity",
        "To allow independent scaling and optimization",
        "To comply with data regulations",
        "To save storage costs"
      ],
      "answer": 1,
      "explanation": "Separating write (upload) and read (streaming) paths lets us scale each path differently—e.g., many CDN edge nodes for reads while keeping fewer powerful transcode workers for writes."
    },
    {
      "question": "What triggers the transcoding pipeline?",
      "options": [
        "User clicks 'Publish'",
        "Upload service finishes storing the raw video",
        "Metadata service updates status to 'processing'",
        "An event/message published after upload completion"
      ],
      "answer": 3,
      "explanation": "An asynchronous event (e.g., message queue notification) is published once the raw video is safely stored, decoupling upload from transcoding and improving fault tolerance."
    },
    {
      "question": "Which storage type is best suited for the raw video objects?",
      "options": [
        "Relational database like PostgreSQL",
        "Distributed object store like S3/GCS",
        "In-memory cache like Redis",
        "Search index like Elasticsearch"
      ],
      "answer": 1,
      "explanation": "Object stores provide virtually unlimited capacity, high durability, and multi-region replication optimized for large binary files such as raw video uploads."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Design for Scale Early",
  "content": "Even if you start small, design interfaces and data flows assuming petabyte-scale storage and million-QPS traffic. It’s far easier to grow into a scalable design than to retrofit one later."
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The upload and streaming paths are completely separate, allowing independent scaling.",
    "Resumable uploads are essential for large video files on unreliable networks.",
    "Video transcoding happens asynchronously — users do not wait for it during upload.",
    "CDN is the backbone of video delivery, serving the vast majority of streaming traffic.",
    "Metadata is relatively small and fits well in a traditional relational database."
  ]
}
\`\`\``,
    },
    {
      id: "sd-11-03",
      slug: "youtube-video-processing",
      title: "Deep Dive: Video Processing",
      content: `# YouTube: Deep Dive — Video Processing

## The Transcoding Pipeline

Raw uploaded videos must be converted into standardized formats and multiple resolutions. This is the most compute-intensive part of the system.

\`\`\`sysdiag
{
  "title": "Video Transcoding Pipeline Architecture",
  "width": 800,
  "height": 400,
  "nodes": [
    { "id": "s3", "label": "Raw Video\\n(S3)", "x": 100, "y": 200, "kind": "storage" },
    { "id": "video", "label": "Video\\nEncoding", "x": 250, "y": 150, "kind": "compute" },
    { "id": "audio", "label": "Audio\\nEncoding", "x": 250, "y": 250, "kind": "compute" },
    { "id": "thumb", "label": "Thumbnail\\nGenerator", "x": 400, "y": 200, "kind": "compute" },
    { "id": "segment", "label": "Segment &\\nPackage", "x": 550, "y": 200, "kind": "compute" },
    { "id": "cdn", "label": "CDN", "x": 700, "y": 200, "kind": "service" }
  ],
  "edges": [
    { "from": "s3", "to": "video", "label": "video stream" },
    { "from": "s3", "to": "audio", "label": "audio stream" },
    { "from": "video", "to": "thumb", "label": "frames" },
    { "from": "video", "to": "segment", "label": "encoded video" },
    { "from": "audio", "to": "segment", "label": "encoded audio" },
    { "from": "thumb", "to": "segment", "label": "thumbnails" },
    { "from": "segment", "to": "cdn", "label": "packaged content" }
  ],
  "annotations": {
    "s3": "Original uploaded file stored in object storage",
    "video": "Parallel encoding to multiple resolutions (360p, 720p, 1080p, 4K)",
    "audio": "Extract and encode audio track independently",
    "thumb": "Generate candidate thumbnails from key frames",
    "segment": "Create streaming-ready segments and manifest files",
    "cdn": "Distribute globally for low-latency delivery"
  }
}
\`\`\`

## DAG Task Pipeline

Rather than a simple linear pipeline, video processing uses a **Directed Acyclic Graph (DAG)** of tasks. This allows parallel execution of independent tasks:

- **Video inspection** (determine codec, resolution, frame rate)
- **Video encoding** to 360p, 720p, 1080p, 4K (these can run in parallel)
- **Audio extraction and encoding** (runs in parallel with video encoding)
- **Thumbnail generation** (runs in parallel with encoding)
- **Watermark/overlay** (if required, runs after encoding)
- **Packaging** into streaming format (after encoding completes)

\`\`\`concept
{
  "title": "DAG vs Linear Pipeline",
  "variant": "insight",
  "content": "A DAG pipeline can reduce processing time from 4x realtime to 1x realtime by running 4 encoding tasks in parallel. If 720p encoding fails, only that task retries — the 1080p and 4K encodes continue unaffected."
}
\`\`\`

A workflow orchestrator (like Apache Airflow or a custom DAG engine) manages task dependencies and scheduling. If the 720p encode fails, it can be retried independently without re-running the 1080p encode.

## Adaptive Bitrate Streaming

Users have different bandwidth levels, and bandwidth fluctuates during playback. **Adaptive bitrate streaming** solves this by:

1. Encoding the video at multiple bitrates (resolutions).
2. Splitting each encoded version into small segments (typically 2-10 seconds each).
3. Creating a **manifest file** that lists all available qualities and segment URLs.
4. The video player downloads segments one at a time, choosing the quality level that fits the current bandwidth.

\`\`\`algoviz
{
  "title": "Adaptive Bitrate Selection Algorithm",
  "type": "array",
  "data": [1080, 720, 480, 360, 240],
  "frames": [
    { "highlight": [0], "label": "Start at highest quality (1080p)", "stats": {"bandwidth": 8.0, "buffer": 30} },
    { "highlight": [1], "label": "Bandwidth drops to 5 Mbps, switch to 720p", "stats": {"bandwidth": 5.0, "buffer": 25} },
    { "highlight": [2], "label": "Buffer running low, drop to 480p", "stats": {"bandwidth": 3.5, "buffer": 15} },
    { "highlight": [1], "label": "Bandwidth recovers, upgrade to 720p", "stats": {"bandwidth": 6.0, "buffer": 20} },
    { "highlight": [0], "label": "Excellent conditions, return to 1080p", "stats": {"bandwidth": 9.0, "buffer": 30} }
  ],
  "speed": 1000
}
\`\`\`

### HLS vs DASH

Two dominant protocols:

| Feature | HLS (HTTP Live Streaming) | DASH (Dynamic Adaptive Streaming) |
|---------|--------------------------|-----------------------------------|
| Developed by | Apple | MPEG consortium |
| Manifest format | .m3u8 (text) | .mpd (XML) |
| Segment format | .ts or .fmp4 | .m4s (fmp4) |
| Browser support | Safari native, others via JS | All modern browsers via JS |
| Industry usage | iOS, Apple TV, widely used | YouTube, Netflix |

Both protocols work the same way conceptually: the client fetches the manifest, then requests segments at the appropriate quality level.

## Thumbnail Generation

For each video, generate multiple thumbnail candidates:
- Extract frames at regular intervals (e.g., every 10 seconds).
- Run a scoring algorithm (or ML model) to pick the most visually appealing frames.
- Store 3-5 thumbnails per video; the uploader can choose or use the auto-selected one.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Thumbnail Storage Cost Calculator",
  "inputs": [
    { "id": "uploads", "label": "Daily Uploads", "default": 5000000, "min": 100000, "max": 10000000 },
    { "id": "thumbnails", "label": "Thumbnails per Video", "default": 5, "min": 1, "max": 10 },
    { "id": "size", "label": "Thumbnail Size (KB)", "default": 50, "min": 10, "max": 200 },
    { "id": "cost", "label": "Storage Cost ($/TB/month)", "default": 23, "min": 10, "max": 50 }
  ]
}
\`\`\`

At 5M uploads/day with 5 thumbnails each at ~50 KB, that is ~1.25 TB/day of thumbnail storage.

## Video Encoding Considerations

- **Codec choice**: H.264 is the most compatible, H.265 (HEVC) offers 50% better compression but slower encoding, AV1 is the newest with best compression but very slow to encode.
- **Two-pass encoding**: First pass analyzes the video to optimize bitrate allocation; second pass does the actual encoding. Higher quality but 2x encode time.
- **Hardware acceleration**: GPU-based encoding (NVIDIA NVENC) is 5-10x faster than CPU encoding for most codecs.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Single-pass encoding (faster, lower quality)",
    "code": "ffmpeg -i input.mp4 -c:v libx264 -b:v 5000k -preset fast output.mp4"
  },
  "after": {
    "label": "Two-pass encoding (slower, higher quality)",
    "code": "ffmpeg -i input.mp4 -c:v libx264 -b:v 5000k -pass 1 -preset slow -f null /dev/null && \\\\\\nffmpeg -i input.mp4 -c:v libx264 -b:v 5000k -pass 2 -preset slow output.mp4"
  }
}
\`\`\`

\`\`\`quiz
{
  "title": "Video Processing Knowledge Check",
  "questions": [
    {
      "question": "Why use a DAG instead of a linear pipeline for video processing?",
      "options": [
        "DAGs are easier to implement",
        "DAGs allow parallel execution of independent tasks",
        "DAGs use less memory",
        "DAGs are required by HLS protocol"
      ],
      "answer": 1,
      "explanation": "DAGs enable parallel processing of independent tasks like encoding to multiple resolutions simultaneously, reducing overall processing time."
    },
    {
      "question": "What happens when bandwidth drops during adaptive streaming?",
      "options": [
        "The video stops playing",
        "The player automatically switches to a lower quality segment",
        "The buffer size increases",
        "The segment duration decreases"
      ],
      "answer": 1,
      "explanation": "Adaptive streaming players monitor bandwidth and buffer levels, automatically switching to lower quality segments when bandwidth drops to maintain continuous playback."
    },
    {
      "question": "Which codec offers the best compression but is slowest to encode?",
      "options": ["H.264", "H.265 (HEVC)", "AV1", "MPEG-2"],
      "answer": 2,
      "explanation": "AV1 provides the best compression efficiency (about 30% better than H.265) but requires significantly more encoding time due to its complex algorithms."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Video transcoding is modeled as a DAG of tasks, allowing parallel processing and independent retry of failed steps",
    "Adaptive bitrate streaming (HLS/DASH) is the standard for delivering smooth playback across varying network conditions",
    "The video is split into small segments (2-10 seconds) so the player can switch quality mid-stream without buffering",
    "Codec choice is a trade-off between compression efficiency, encoding speed, and device compatibility",
    "Thumbnail generation, while simple conceptually, adds meaningful storage costs at scale"
  ]
}
\`\`\``,
    },
    {
      id: "sd-11-04",
      slug: "youtube-scaling",
      title: "Scaling & Trade-offs",
      content: `# YouTube: Scaling & Trade-offs

## CDN Strategy: Push vs Pull

Two models for populating CDN edge servers with video content:

**Push CDN**: After transcoding, proactively push video segments to CDN edge servers. The video is ready for instant playback from any location.
- **Best for**: Popular videos that will be watched globally.
- **Drawback**: Wastes storage and bandwidth for videos nobody watches in certain regions.

**Pull CDN**: Edge servers fetch content from the origin on the first request, then cache it. Subsequent requests in that region are served from cache.
- **Best for**: Long-tail content that may only be popular in specific regions.
- **Drawback**: First viewer in each region experiences higher latency.

\`\`\`concept
{
  "title": "Push vs Pull CDN: The Hotdog Stand Analogy",
  "variant": "analogy",
  "content": "Imagine you're running a hotdog stand business:\\n\\n**Push CDN** is like pre-delivering hotdogs to every stand in the city before lunch rush. Customers get instant service, but you might waste food at stands that don't sell much.\\n\\n**Pull CDN** is like only delivering hotdogs when a stand runs out. You minimize waste, but the first customer at each stand waits longer while you deliver.\\n\\n**Hybrid approach**: Stock the busy downtown stands in advance, but deliver to suburban stands only when needed."
}
\`\`\`

**Hybrid approach**: Push popular/trending videos to all edges. Use pull for everything else. A popularity prediction model (based on upload history, channel subscribers, early view velocity) decides which strategy to use.

\`\`\`quiz
{
  "title": "CDN Strategy Selection",
  "questions": [
    {
      "question": "A new documentary about climate change is uploaded by a major news channel. It has 5 million subscribers and the topic is trending globally. Which CDN strategy should you use?",
      "options": ["Push to all edges immediately", "Wait for pull requests", "Push only to North America", "Transcode but don't distribute"],
      "answer": 0,
      "explanation": "With 5 million subscribers and a trending topic, this video is likely to be watched globally. Pushing to all edges ensures instant playback for the expected high demand."
    },
    {
      "question": "A user uploads a 2-hour lecture video on advanced quantum physics. The channel has 50 subscribers. What's the best CDN approach?",
      "options": ["Push to all edges", "Push to educational institutions only", "Use pull CDN", "Don't transcode at all"],
      "answer": 2,
      "explanation": "With only 50 subscribers and niche academic content, this is classic long-tail content. Pull CDN minimizes storage costs while still serving viewers when requested."
    },
    {
      "question": "Your popularity prediction model has 85% accuracy. A video predicted to be 'popular' fails to gain traction. What happens?",
      "options": ["Video is deleted", "Storage is wasted on edges", "CDN automatically pulls it back", "Viewers can't access it"],
      "answer": 1,
      "explanation": "With push CDN, incorrectly predicted popular videos occupy storage space on edge servers without generating views, representing a trade-off cost of the hybrid approach."
    }
  ]
}
\`\`\`

## Video Deduplication

Users frequently upload the same content (re-uploads, mirrors, clips). Deduplication saves storage and transcoding costs:

1. **Upload-time detection**: Compute a fingerprint (perceptual hash) of the video during upload. Compare against existing fingerprints. If a match is found, link to the existing video instead of re-processing.

2. **Perceptual hashing**: Unlike cryptographic hashes, perceptual hashes produce similar values for visually similar videos. A video re-encoded at different quality or with minor edits will still match.

3. **Block-level deduplication**: Split videos into blocks and hash each block. If 90% of blocks match an existing video, it is likely a duplicate or minor re-edit.

Deduplication can save 20-30% of storage costs on a platform with significant re-upload activity.

\`\`\`trace
{
  "title": "Deduplication Algorithm in Action",
  "language": "python",
  "code": "def check_duplicate(video_upload):\\n    # Extract perceptual hash from video\\n    video_hash = compute_perceptual_hash(video_upload)\\n    \\n    # Check against existing hashes\\n    existing_hashes = get_all_video_hashes()\\n    \\n    for existing_hash in existing_hashes:\\n        similarity = calculate_hash_similarity(video_hash, existing_hash)\\n        if similarity > 0.95:  # 95% threshold\\n            return True, existing_hash.video_id\\n    \\n    return False, None\\n\\n# Example usage\\nupload1 = upload_video(\\"cat_video.mp4\\")\\nis_duplicate, original_id = check_duplicate(upload1)\\n\\nif is_duplicate:\\n    print(f\\"Duplicate detected! Linking to video {original_id}\\")\\nelse:\\n    print(\\"New unique video, proceeding with transcoding\\")",
  "frames": [
    {
      "line": 1,
      "vars": {"video_upload": "cat_video.mp4"},
      "note": "New video upload starts",
      "stdout": ""
    },
    {
      "line": 3,
      "vars": {"video_hash": "a1b2c3d4e5f6"},
      "note": "Perceptual hash computed",
      "stdout": ""
    },
    {
      "line": 6,
      "vars": {"existing_hashes": ["x1y2z3w4v5u6", "a1b2c3d4e5f7"]},
      "note": "Checking against existing videos",
      "stdout": ""
    },
    {
      "line": 9,
      "vars": {"similarity": 0.98, "existing_hash": "a1b2c3d4e5f7"},
      "note": "High similarity found (98%)",
      "stdout": "Duplicate detected! Linking to video abc123"
    }
  ]
}
\`\`\`

## Copyright Detection

Content ID systems scan uploaded videos against a database of copyrighted material:

1. Extract audio fingerprints and visual fingerprints from the upload.
2. Compare against a reference database of copyrighted content provided by rights holders.
3. If a match is found, apply the rights holder's policy: block, monetize (show ads and share revenue), or track.

This runs as an additional step in the transcoding pipeline and must complete before the video is made public.

## Live Streaming Considerations

Live streaming differs from video-on-demand in several key ways:

- **No transcoding queue** — Video must be encoded in real-time.
- **Lower latency requirements** — Viewers expect near-real-time delivery (< 5 seconds for most; < 1 second for interactive).
- **Segment size trade-off** — Shorter segments reduce latency but increase overhead.
- **Unpredictable load** — A popular live event can spike from 0 to millions of viewers instantly.

Live streaming typically uses a simplified encoding pipeline (fewer resolution options, faster codec settings) and aggressive CDN pre-warming for announced events.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "VOD Processing",
    "code": "def process_vod_video(video):\\n    # Can take hours\\n    queue_for_transcoding(video)\\n    \\n    # Generate all resolutions\\n    for resolution in [240p, 360p, 480p, 720p, 1080p, 4K]:\\n        transcode_with_optimizations(video, resolution)\\n    \\n    # Wait for completion\\n    wait_for_transcoding()\\n    \\n    # Push to CDN\\n    push_to_cdn(video)\\n    publish_video(video)"
  },
  "after": {
    "label": "Live Stream Processing",
    "code": "def process_live_stream(stream):\\n    # Must be real-time\\n    while stream.is_active():\\n        chunk = get_next_chunk(stream)\\n        \\n        # Fast encoding only\\n        encode_chunk(chunk, resolutions=[480p, 720p])\\n        \\n        # Immediate distribution\\n        distribute_chunk(chunk)\\n        \\n        # No waiting - continuous flow\\n        continue_streaming()"
  }
}
\`\`\`

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| Push vs Pull CDN | Low latency, high storage cost | Higher first-view latency, lower storage |
| Codec: H.264 vs AV1 | Fast encode, larger files | Slow encode, 30-50% smaller files |
| Segment length: 2s vs 10s | Lower latency, more HTTP requests | Higher latency, fewer requests |
| Store all resolutions vs On-demand transcode | High storage, instant playback | Low storage, startup delay |

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "CDN Cost Calculator",
  "inputs": [
    {"id": "storage", "label": "Storage per video (GB)", "default": 5, "min": 1, "max": 50},
    {"id": "views", "label": "Average views per video", "default": 10000, "min": 100, "max": 1000000},
    {"id": "edges", "label": "Number of edge locations", "default": 100, "min": 10, "max": 300},
    {"id": "push_ratio", "label": "Push CDN ratio (%)", "default": 20, "min": 0, "max": 100}
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A hybrid push/pull CDN strategy balances cost efficiency with viewer experience by predicting video popularity",
    "Video deduplication through perceptual hashing can save 20-30% of storage costs on platforms with significant re-upload activity",
    "Copyright detection must run before a video goes public, adding to the processing pipeline time but protecting against infringement",
    "Live streaming requires a fundamentally different architecture optimized for real-time encoding and ultra-low latency",
    "The largest cost drivers are storage and CDN bandwidth — every architectural decision should be evaluated through this lens"
  ]
}
\`\`\``,
    },
  ],
};
