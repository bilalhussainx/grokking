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

## Video Storage Breakdown

A single 5-minute source video (1080p) is roughly 250 MB. After transcoding:

| Resolution | Bitrate | Size (5 min) |
|-----------|---------|--------------|
| 360p | 0.5 Mbps | ~19 MB |
| 720p | 2.5 Mbps | ~94 MB |
| 1080p | 5 Mbps | ~188 MB |
| 4K | 15 Mbps | ~563 MB |

Storing all four resolutions: ~864 MB per video. With 5M uploads/day, that is ~4.3 PB/day — confirming our earlier estimate.

## Key Takeaways

- Video platforms are dominated by storage and bandwidth costs — everything else is secondary.
- Multi-resolution transcoding multiplies storage needs by 3-5x but is essential for adaptive streaming.
- CDN is mandatory — no single data center can serve 250+ Pbps of peak streaming bandwidth.
- Upload reliability (resumable uploads) is critical because videos are large files on often unreliable connections.
- Even "simple" features like thumbnails require significant storage at scale (multiple thumbnails per video).
`,
    },
    {
      id: "sd-11-02",
      slug: "youtube-high-level-design",
      title: "High-Level Design",
      content: `# YouTube: High-Level Design

## Architecture Overview

The system has two main flows: the **upload pipeline** (write path) and the **streaming flow** (read path).

\`\`\`
UPLOAD FLOW:
┌────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐
│ Client │───>│ Upload       │───>│ Object Store │───>│Transcoding│
│        │    │ Service      │    │ (raw video)  │    │ Pipeline  │
└────────┘    └──────┬───────┘    └──────────────┘    └─────┬─────┘
                     │                                       │
                     v                                       v
              ┌──────────────┐                        ┌───────────┐
              │ Metadata     │                        │ CDN       │
              │ Service (DB) │                        │ (encoded  │
              └──────────────┘                        │  videos)  │
                                                      └───────────┘

STREAMING FLOW:
┌────────┐    ┌───────────┐    ┌───────────┐
│ Client │───>│ Metadata  │    │   CDN     │
│        │    │ Service   │───>│  (video   │───> Video chunks to client
└────────┘    └───────────┘    │  segments)│
                               └───────────┘
\`\`\`

## Upload Flow

1. **Client** initiates a resumable upload via the Upload Service API.
2. **Upload Service** handles chunked upload, reassembles the file, and stores the raw video in an object store (e.g., S3, GCS).
3. **Metadata Service** stores video info (title, description, uploader, status) in a relational database. Initially the video status is "processing."
4. An event triggers the **Transcoding Pipeline**, which encodes the video into multiple resolutions and formats.
5. Transcoded segments are pushed to the **CDN** for global distribution.
6. Metadata Service updates the video status to "ready" and generates thumbnail URLs.

## Streaming Flow

1. **Client** requests a video by ID. The Metadata Service returns video info and a CDN URL.
2. **Client** fetches the video manifest file (e.g., HLS .m3u8) from the CDN.
3. **Client** downloads video segments from the CDN, starting with the appropriate quality level for its bandwidth.
4. The video player adaptively switches quality based on real-time bandwidth measurements.

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

## Key Takeaways

- The upload and streaming paths are completely separate, allowing independent scaling.
- Resumable uploads are essential for large video files on unreliable networks.
- Video transcoding happens asynchronously — users do not wait for it during upload.
- CDN is the backbone of video delivery, serving the vast majority of streaming traffic.
- Metadata is relatively small and fits well in a traditional relational database.
`,
    },
    {
      id: "sd-11-03",
      slug: "youtube-video-processing",
      title: "Deep Dive: Video Processing",
      content: `# YouTube: Deep Dive — Video Processing

## The Transcoding Pipeline

Raw uploaded videos must be converted into standardized formats and multiple resolutions. This is the most compute-intensive part of the system.

\`\`\`
┌───────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Raw Video │──>│ Video    │──>│ Audio    │──>│ Thumbnail│
│ (S3)      │   │ Encoding │   │ Encoding │   │ Generator│
└───────────┘   └──────────┘   └──────────┘   └──────────┘
                     │              │               │
                     v              v               v
                ┌──────────────────────────────────────┐
                │         Segment & Package             │
                │  (Split into chunks, create manifest) │
                └──────────────┬───────────────────────┘
                               │
                               v
                          ┌─────────┐
                          │   CDN   │
                          └─────────┘
\`\`\`

## DAG Task Pipeline

Rather than a simple linear pipeline, video processing uses a **Directed Acyclic Graph (DAG)** of tasks. This allows parallel execution of independent tasks:

- **Video inspection** (determine codec, resolution, frame rate)
- **Video encoding** to 360p, 720p, 1080p, 4K (these can run in parallel)
- **Audio extraction and encoding** (runs in parallel with video encoding)
- **Thumbnail generation** (runs in parallel with encoding)
- **Watermark/overlay** (if required, runs after encoding)
- **Packaging** into streaming format (after encoding completes)

A workflow orchestrator (like Apache Airflow or a custom DAG engine) manages task dependencies and scheduling. If the 720p encode fails, it can be retried independently without re-running the 1080p encode.

## Adaptive Bitrate Streaming

Users have different bandwidth levels, and bandwidth fluctuates during playback. **Adaptive bitrate streaming** solves this by:

1. Encoding the video at multiple bitrates (resolutions).
2. Splitting each encoded version into small segments (typically 2-10 seconds each).
3. Creating a **manifest file** that lists all available qualities and their segment URLs.
4. The video player downloads segments one at a time, choosing the quality level that fits the current bandwidth.

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

At 5M uploads/day with 5 thumbnails each at ~50 KB, that is ~1.25 TB/day of thumbnail storage.

## Video Encoding Considerations

- **Codec choice**: H.264 is the most compatible, H.265 (HEVC) offers 50% better compression but slower encoding, AV1 is the newest with best compression but very slow to encode.
- **Two-pass encoding**: First pass analyzes the video to optimize bitrate allocation; second pass does the actual encoding. Higher quality but 2x encode time.
- **Hardware acceleration**: GPU-based encoding (NVIDIA NVENC) is 5-10x faster than CPU encoding for most codecs.

## Key Takeaways

- Video transcoding is modeled as a DAG of tasks, allowing parallel processing and independent retry of failed steps.
- Adaptive bitrate streaming (HLS/DASH) is the standard for delivering smooth playback across varying network conditions.
- The video is split into small segments (2-10 seconds) so the player can switch quality mid-stream without buffering.
- Codec choice is a trade-off between compression efficiency, encoding speed, and device compatibility.
- Thumbnail generation, while simple conceptually, adds meaningful storage costs at scale.
`,
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

**Hybrid approach**: Push popular/trending videos to all edges. Use pull for everything else. A popularity prediction model (based on upload history, channel subscribers, early view velocity) decides which strategy to use.

## Video Deduplication

Users frequently upload the same content (re-uploads, mirrors, clips). Deduplication saves storage and transcoding costs:

1. **Upload-time detection**: Compute a fingerprint (perceptual hash) of the video during upload. Compare against existing fingerprints. If a match is found, link to the existing video instead of re-processing.

2. **Perceptual hashing**: Unlike cryptographic hashes, perceptual hashes produce similar values for visually similar videos. A video re-encoded at different quality or with minor edits will still match.

3. **Block-level deduplication**: Split videos into blocks and hash each block. If 90% of blocks match an existing video, it is likely a duplicate or minor re-edit.

Deduplication can save 20-30% of storage costs on a platform with significant re-upload activity.

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

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| Push vs Pull CDN | Low latency, high storage cost | Higher first-view latency, lower storage |
| Codec: H.264 vs AV1 | Fast encode, larger files | Slow encode, 30-50% smaller files |
| Segment length: 2s vs 10s | Lower latency, more HTTP requests | Higher latency, fewer requests |
| Store all resolutions vs On-demand transcode | High storage, instant playback | Low storage, startup delay |

## Key Takeaways

- A hybrid push/pull CDN strategy balances cost efficiency with viewer experience.
- Video deduplication through perceptual hashing can significantly reduce storage and processing costs.
- Copyright detection must run before a video goes public, adding to the processing pipeline time.
- Live streaming requires a fundamentally different architecture optimized for real-time encoding and ultra-low latency.
- The largest cost drivers are storage and CDN bandwidth — every architectural decision should be evaluated through this lens.
`,
    },
  ],
};
