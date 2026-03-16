import { Module } from "../types";

export const netflixModule: Module = {
  id: "design-netflix",
  title: "Design Netflix",
  description:
    "Design a video streaming platform: encoding pipelines, CDN architecture, adaptive bitrate streaming, and recommendation integration at global scale.",
  lessons: [
    {
      id: "netflix-requirements-scale",
      slug: "netflix-requirements-scale",
      title: "Requirements & Scale",
      content: `# Design Netflix: Requirements & Scale

## Functional Requirements

Design a global video streaming platform like Netflix. Core features:

1. **Video upload & processing** — Content creators upload video; system encodes into multiple formats and resolutions
2. **Video streaming** — Users stream video with minimal buffering
3. **Adaptive bitrate** — Quality adjusts automatically based on network conditions
4. **Content catalog** — Browse, search, and discover titles
5. **Recommendations** — Personalized content suggestions per user
6. **Watch history & resume** — Track progress and resume where the user left off
7. **Multi-device** — Support TV, mobile, tablet, browser with different codec requirements

## Non-Functional Requirements

- **Availability**: 99.99% uptime — a global outage costs ~\$1M/hour in subscriber churn
- **Latency**: Video playback start < 2 seconds; catalog browse < 200ms
- **Throughput**: Support 10M+ concurrent streams during peak
- **Durability**: No content loss — source masters are irreplaceable
- **Global reach**: Low-latency streaming across 190+ countries

## Scale Estimation

### Users and Streams

\`\`\`
Subscribers:           230 million
DAU:                   ~100 million (43% daily engagement)
Concurrent streams:    ~10 million (peak, ~10% of DAU)
Average session:       ~2 hours
\`\`\`

### Bandwidth

\`\`\`
Average bitrate:       5 Mbps (mix of SD, HD, 4K)
Concurrent streams:    10M
Total egress:          10M × 5 Mbps = 50 Tbps peak

For context: this is ~15% of all downstream internet
traffic in North America during peak hours.
\`\`\`

### Storage

\`\`\`
Titles in catalog:      ~17,000
Average title duration: 90 minutes
Encoded versions per title: ~1,200 (resolution × codec × bitrate)
Average encoded size:   ~5 GB per version
Total storage:          17,000 × 1,200 × 5 GB = ~102 PB
With replication across CDN regions: ~500+ PB
\`\`\`

### Upload Pipeline

\`\`\`
New titles/week:        ~50
Processing per title:   ~1,200 encoded versions
Encoding time per version: ~30 min (GPU-accelerated)
Total GPU-hours/week:   50 × 1,200 × 0.5 = 30,000 GPU-hours
\`\`\`

## Key Challenges

| Challenge | Why It's Hard |
|-----------|--------------|
| **50 Tbps egress** | More bandwidth than most ISPs handle total |
| **1,200 encodes per title** | Massive parallel processing pipeline |
| **Global low-latency** | Users in 190 countries expect < 2s startup |
| **Adaptive streaming** | Seamless quality switching mid-stream |
| **Cost optimization** | CDN bandwidth is the #1 operational cost |

## High-Level Components

\`\`\`
┌─────────┐     ┌──────────┐     ┌──────────────┐
│ Clients │────▶│ API GW / │────▶│ Catalog      │
│ (TV,    │     │ CDN Edge │     │ Service      │
│ Mobile, │     └──────────┘     └──────────────┘
│ Web)    │          │
│         │          │           ┌──────────────┐
│         │◀─────────┼──────────│ CDN (video   │
└─────────┘          │           │ segments)    │
                     │           └──────────────┘
                     │
              ┌──────▼──────┐   ┌──────────────┐
              │ Streaming   │   │ Encoding     │
              │ Service     │   │ Pipeline     │
              └─────────────┘   └──────────────┘
\`\`\`

In the following lessons, we will dive into the encoding pipeline, CDN architecture, and adaptive bitrate streaming.`,
    },
    {
      id: "netflix-video-encoding",
      slug: "netflix-video-encoding",
      title: "Video Encoding Pipeline",
      content: `# Netflix: Video Encoding Pipeline

## The Encoding Challenge

A single movie uploaded as a high-quality master (ProRes, ~500 GB) must be transformed into ~1,200 encoded versions covering every combination of:

- **Resolutions**: 240p, 360p, 480p, 720p, 1080p, 4K
- **Codecs**: H.264 (AVC), H.265 (HEVC), VP9, AV1
- **Bitrates**: Multiple bitrate ladders per resolution
- **Audio**: Stereo, 5.1 surround, Dolby Atmos, multiple languages

## Pipeline Architecture

\`\`\`
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ Content  │───▶│ Ingest       │───▶│ Analysis     │
│ Upload   │    │ Service      │    │ Service      │
│ (S3)     │    │ - validate   │    │ - scene      │
│          │    │ - checksum   │    │   detection  │
│ ~500 GB  │    │ - metadata   │    │ - complexity │
│ master   │    │              │    │   scoring    │
└──────────┘    └──────────────┘    └──────┬───────┘
                                          │
                                   ┌──────▼───────┐
                                   │ Encoding     │
                                   │ Orchestrator │
                                   │ (workflow    │
                                   │  engine)     │
                                   └──────┬───────┘
                                          │
                           ┌──────────────┼──────────────┐
                           ▼              ▼              ▼
                    ┌──────────┐   ┌──────────┐   ┌──────────┐
                    │ Encoder  │   │ Encoder  │   │ Encoder  │
                    │ Worker 1 │   │ Worker 2 │   │ Worker N │
                    │ (GPU)    │   │ (GPU)    │   │ (GPU)    │
                    └──────┬───┘   └──────┬───┘   └──────┬───┘
                           │              │              │
                           └──────────────┼──────────────┘
                                          ▼
                                   ┌──────────────┐
                                   │ Packager     │
                                   │ - DASH/HLS   │
                                   │ - DRM        │
                                   │ - Manifest   │
                                   └──────┬───────┘
                                          ▼
                                   ┌──────────────┐
                                   │ CDN Origin   │
                                   │ (S3)         │
                                   └──────────────┘
\`\`\`

## Per-Title Encoding

Netflix pioneered **per-title encoding** — instead of using a fixed bitrate ladder, the system analyzes each title's visual complexity and creates a custom bitrate ladder.

\`\`\`
Simple animation (e.g., BoJack Horseman):
  1080p looks great at 1.5 Mbps

Complex action (e.g., Extraction):
  1080p needs 6+ Mbps for the same quality

Fixed ladder wastes bandwidth on simple content
and under-serves complex content.
\`\`\`

### Shot-Based Encoding

Netflix goes further with **shot-based encoding**: each shot (scene cut) gets its own optimal bitrate.

\`\`\`
Movie timeline:
[Dialog scene]  [Car chase]  [Dark scene]  [Explosion]
  1.2 Mbps        8 Mbps       2 Mbps       10 Mbps

Result: 40% bandwidth savings vs. constant bitrate
with equal or better visual quality.
\`\`\`

## Chunk-Based Parallel Encoding

The video is split into chunks (2-10 seconds each) and encoded in parallel across a fleet of GPU workers.

\`\`\`
Master video (90 min):
├── Chunk 001 (0:00 - 0:04)  ──▶ Worker A ──▶ Encoded chunk
├── Chunk 002 (0:04 - 0:08)  ──▶ Worker B ──▶ Encoded chunk
├── Chunk 003 (0:08 - 0:12)  ──▶ Worker C ──▶ Encoded chunk
│   ...
└── Chunk 1350 (89:56 - 90:00) ──▶ Worker D ──▶ Encoded chunk

All chunks encoded in parallel → stitch together
Total wall-clock time: ~30 minutes per encode profile
(vs. ~8 hours sequential)
\`\`\`

## Codec Comparison

| Codec | Compression | CPU Cost | Device Support | Status |
|-------|------------|----------|----------------|--------|
| H.264 | Baseline | 1x | Universal | Legacy |
| H.265/HEVC | 40% better | 3x | Modern devices | Current |
| VP9 | ~40% better | 2.5x | Chrome, Android | Current |
| AV1 | 50% better | 10x | Growing | Future default |

Netflix is aggressively adopting **AV1** for mobile streams — 50% smaller files at the same quality means massive CDN cost savings at 50 Tbps scale.

## DRM (Digital Rights Management)

Content must be encrypted before distribution:

\`\`\`
Packager:
  ├── Encrypt with Widevine (Android, Chrome)
  ├── Encrypt with FairPlay (iOS, Safari, Apple TV)
  └── Encrypt with PlayReady (Windows, Xbox, Smart TVs)

Each platform gets the same video content but with
different DRM encryption wrappers.
\`\`\`

## Scale Numbers

\`\`\`
Encoding cluster:    ~10,000 GPU instances (spot/preemptible)
Encodes per day:     ~50 titles × 1,200 versions = 60,000 encode jobs
Storage written:     50 titles × 1,200 × 5 GB = 300 TB/day
Pipeline throughput: ~200 encode jobs/minute sustained
\`\`\`

## Failure Handling

| Failure | Mitigation |
|---------|-----------|
| Worker crash mid-encode | Checkpoint at chunk boundaries; retry failed chunks |
| Corrupt source upload | Checksum validation on ingest; reject and re-request |
| Encoding quality regression | Automated VMAF scoring; reject if below threshold |
| DRM packaging failure | Idempotent packaging; retry with same encryption keys |`,
    },
    {
      id: "netflix-cdn-architecture",
      slug: "netflix-cdn-architecture",
      title: "CDN Architecture",
      content: `# Netflix: CDN Architecture

## Why a Custom CDN?

At 50 Tbps of peak egress, using a third-party CDN (Akamai, CloudFront) would cost billions per year. Netflix built **Open Connect** — its own purpose-built CDN with servers embedded directly inside ISP networks.

## Open Connect Architecture

\`\`\`
┌────────────────────────────────────────────────────┐
│                   Netflix Backend                  │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐ │
│  │ Catalog    │  │ Steering   │  │ CDN Origin   │ │
│  │ Service    │  │ Service    │  │ (S3, ~500PB) │ │
│  └────────────┘  └─────┬──────┘  └──────┬───────┘ │
└──────────────────────── │ ───────────────│─────────┘
                          │               │
                  ┌───────▼───────┐       │ (off-peak fill)
                  │  IXP Sites   │◀──────┘
                  │  (Internet   │
                  │  Exchange    │
                  │  Points)     │
                  │  ~60 sites   │
                  └───────┬──────┘
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │  ISP A       │ │  ISP B       │ │  ISP C       │
   │  ┌────────┐  │ │  ┌────────┐  │ │  ┌────────┐  │
   │  │OCA     │  │ │  │OCA     │  │ │  │OCA     │  │
   │  │Server  │  │ │  │Server  │  │ │  │Server  │  │
   │  │(cache) │  │ │  │(cache) │  │ │  │(cache) │  │
   │  └────────┘  │ │  └────────┘  │ │  └────────┘  │
   │  Serves      │ │  Serves      │ │  Serves      │
   │  ISP users   │ │  ISP users   │ │  ISP users   │
   └──────────────┘ └──────────────┘ └──────────────┘
\`\`\`

### OCA (Open Connect Appliance)

An OCA is a custom-built server placed inside ISP data centers:

\`\`\`
Open Connect Appliance specs:
├── Storage:    100-200 TB SSD + HDD
├── Network:    100 Gbps NIC
├── CPU:        Commodity x86 (TLS termination)
├── Software:   FreeBSD + custom nginx (Open Connect)
└── Cost:       ~$20,000 per unit (Netflix provides free to ISPs)
\`\`\`

**Why ISPs accept them**: The OCA keeps Netflix traffic local. Without it, the ISP pays for expensive transit bandwidth to reach Netflix's origin. With an OCA, 95%+ of Netflix traffic stays within the ISP's own network.

## Content Placement Strategy

Not every OCA stores every title. Netflix uses a **popularity-based tiered cache**:

\`\`\`
Tier 1: ISP OCA (~200 TB)
  └── Top ~3,000 titles for this region
      (covers ~95% of viewing hours)

Tier 2: IXP Site (~2 PB)
  └── Top ~10,000 titles
      (covers ~99% of viewing hours)

Tier 3: CDN Origin (S3, ~500 PB)
  └── Everything (complete catalog)
      (fallback for long-tail content)
\`\`\`

### Proactive Cache Fill

Content is pushed to OCAs **during off-peak hours** (2AM-8AM local time) before users request it.

\`\`\`
Nightly fill process:
1. Steering Service predicts tomorrow's popular titles per region
2. Pushes new/trending content to regional OCAs overnight
3. Each OCA reports: storage utilization, cache hit ratio
4. Low-hit content is evicted to make room for predictions

Cache hit rate at ISP OCAs: ~95%
\`\`\`

## Client Steering

When a user presses play, the client needs to know which OCA to stream from.

\`\`\`
1. Client ──"play title X"──▶ Netflix API
2. API ──▶ Steering Service
3. Steering Service evaluates:
   ├── Which OCAs have title X cached?
   ├── Which OCA is closest to this user's ISP?
   ├── Current load on each candidate OCA?
   ├── Historical throughput for this ISP↔OCA pair?
   └── Returns ranked list of OCA URLs

4. Client receives:
   [
     "https://oca1.isp-a.nflxvideo.net/title-x/",
     "https://oca2.ixp-east.nflxvideo.net/title-x/",
     "https://origin.nflxvideo.net/title-x/"
   ]

5. Client tries first URL; falls back to next on failure
\`\`\`

## CDN Scale Numbers

\`\`\`
Open Connect Appliances:  ~18,000 servers
ISP partners:             ~1,600 ISPs worldwide
IXP sites:                ~60 locations
Total CDN capacity:       ~500 PB
Peak serving:             ~50 Tbps
Cache hit rate (ISP):     ~95%
Cache hit rate (IXP):     ~99%
Bandwidth cost savings:   ~90% vs. third-party CDN
\`\`\`

## Trade-offs

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| Custom CDN | Open Connect | Akamai/CloudFront | Cost: billions saved annually |
| Cache placement | Popularity-based | Full replication | Storage is finite on OCAs |
| Fill timing | Proactive overnight | On-demand pull | Avoids cache misses at peak |
| Steering | Server-side ranked list | DNS-based | More control, per-session optimization |
| OCA hardware | Commodity + SSD | Proprietary appliance | Low cost, easy replacement |`,
    },
    {
      id: "netflix-adaptive-bitrate",
      slug: "netflix-adaptive-bitrate",
      title: "Adaptive Bitrate Streaming",
      content: `# Netflix: Adaptive Bitrate Streaming

## The Problem

Users watch Netflix on everything from a 4K TV on gigabit fiber to a phone on a congested 3G connection. Network conditions change mid-stream — a user on WiFi walks out of range, bandwidth drops, and the video must adapt instantly without buffering.

## How ABR Works

Video is divided into small **segments** (typically 2-4 seconds). Each segment is pre-encoded at multiple quality levels. The client player downloads segments one at a time, choosing the best quality that the current bandwidth can support.

\`\`\`
Segment timeline:
                    Seg1    Seg2    Seg3    Seg4    Seg5
4K   (16 Mbps)     [====]  [====]  [====]
1080p (5 Mbps)                              [====]
720p  (3 Mbps)                                      [====]
480p  (1.5 Mbps)
240p  (0.3 Mbps)

Network bandwidth dropped at Seg4 → client switches down
Network recovers at Seg5 → client stays conservative
\`\`\`

## DASH and HLS

Two dominant streaming protocols:

### DASH (Dynamic Adaptive Streaming over HTTP)

\`\`\`
MPD Manifest (Media Presentation Description):
├── Period 1 (movie)
│   ├── AdaptationSet: Video
│   │   ├── Representation: 4K, 16 Mbps
│   │   │   └── Segments: seg1.m4s, seg2.m4s, ...
│   │   ├── Representation: 1080p, 5 Mbps
│   │   │   └── Segments: seg1.m4s, seg2.m4s, ...
│   │   └── Representation: 480p, 1.5 Mbps
│   │       └── Segments: seg1.m4s, seg2.m4s, ...
│   └── AdaptationSet: Audio
│       ├── Representation: 5.1 Surround
│       └── Representation: Stereo
\`\`\`

### HLS (HTTP Live Streaming — Apple)

Similar concept, different manifest format (.m3u8). Used primarily for Apple devices.

| Feature | DASH | HLS |
|---------|------|-----|
| Standard | MPEG-DASH (ISO) | Apple proprietary |
| Manifest | .mpd (XML) | .m3u8 (text) |
| Segment format | .m4s (fMP4) | .ts or .fmp4 |
| Device support | Android, Smart TVs, browsers | iOS, macOS, Safari |
| DRM | Widevine, PlayReady | FairPlay |

Netflix uses both: DASH for most devices, HLS for Apple ecosystem.

## ABR Algorithm

The client-side ABR algorithm is critical. Netflix developed a buffer-based approach that outperforms pure bandwidth estimation.

### Bandwidth Estimation (Naive)

\`\`\`
Measure: downloaded segment size / download time
  Example: 2 MB segment / 0.4s = 5 MB/s = 40 Mbps
  Select: highest quality ≤ 40 Mbps → 4K (16 Mbps)

Problem: bandwidth fluctuates rapidly. A single spike
causes the algorithm to select too high, leading to
rebuffering when bandwidth drops.
\`\`\`

### Buffer-Based ABR (Netflix's Approach)

\`\`\`
Buffer level determines quality:

Buffer: |████████████████████░░░░░░░░░░| 65% full (26s of 40s)
                                ▲
                          Quality map:
                          0-10s buffer → 480p (survival mode)
                          10-20s buffer → 720p
                          20-30s buffer → 1080p
                          30-40s buffer → 4K

Current: 26s → select 1080p

If buffer is filling → gradually increase quality
If buffer is draining → immediately decrease quality
\`\`\`

This approach is more stable because the buffer integrates bandwidth over time, smoothing out short-term fluctuations.

### Startup Optimization

The first few seconds matter most. Netflix optimizes for **time to first frame**:

\`\`\`
1. Start at lowest quality (fast first segment download)
2. Prefetch: download first 2 segments while UI renders
3. Ramp up: aggressively increase quality over first 30 seconds
4. Stabilize: switch to conservative buffer-based algorithm

Result: Playback starts in < 2 seconds on broadband
\`\`\`

## Segment Architecture

\`\`\`
Title: "Stranger Things S04E01"
Storage on OCA:

/stranger-things-s4e1/
├── manifest.mpd
├── video/
│   ├── 4k-hevc/
│   │   ├── init.m4s          (codec initialization)
│   │   ├── seg-00001.m4s     (4 seconds, ~8 MB)
│   │   ├── seg-00002.m4s
│   │   └── ...
│   ├── 1080p-h264/
│   │   ├── init.m4s
│   │   ├── seg-00001.m4s     (4 seconds, ~2.5 MB)
│   │   └── ...
│   └── 480p-h264/
│       ├── init.m4s
│       ├── seg-00001.m4s     (4 seconds, ~0.75 MB)
│       └── ...
├── audio/
│   ├── en-5.1/
│   └── en-stereo/
└── subtitles/
    ├── en.vtt
    └── es.vtt
\`\`\`

## Scale Numbers for ABR

\`\`\`
Segments per title:        ~1,350 (90 min / 4s)
Quality levels:            6 video × 3 audio = 18 streams
Total segments per title:  1,350 × 18 = ~24,300 segment files
Segment requests/second:   10M streams / 4s = 2.5M HTTP req/s
Average segment size:      ~2 MB
Bandwidth per segment req: 2 MB / 4s = 4 Mbps (average quality)
\`\`\`

## Trade-offs

| Decision | Choice | Trade-off |
|----------|--------|-----------|
| Segment duration | 4 seconds | Shorter = faster adaptation, more HTTP overhead |
| ABR algorithm | Buffer-based | More stable, but slower to react to sudden changes |
| Startup quality | Lowest available | Fast start, but initial quality is poor |
| Quality switches | Conservative (ramp up slowly) | Fewer visible switches, but slower to reach max quality |`,
    },
    {
      id: "netflix-recommendation-integration",
      slug: "netflix-recommendation-integration",
      title: "Recommendation Integration",
      content: `# Netflix: Recommendation Integration

## Why Recommendations Matter

Netflix estimates that its recommendation system saves \$1 billion/year in reduced churn. If users cannot find something to watch within 60-90 seconds, they leave. 80% of content watched on Netflix is discovered through recommendations, not search.

## Recommendation Architecture

\`\`\`
┌──────────────────────────────────────────────────────┐
│                  Online Serving Layer                 │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Homepage   │  │ Search &     │  │ "Because you │ │
│  │ Ranker     │  │ Explore      │  │  watched"    │ │
│  └─────┬──────┘  └──────┬───────┘  └──────┬───────┘ │
│        │                │                  │         │
│  ┌─────▼────────────────▼──────────────────▼───────┐ │
│  │            Feature Store (Redis/Cassandra)      │ │
│  │  user_123: {genre_prefs, watch_history,         │ │
│  │             time_of_day, device, taste_cluster}  │ │
│  └─────────────────────┬───────────────────────────┘ │
└────────────────────────│─────────────────────────────┘
                         │
┌────────────────────────│─────────────────────────────┐
│                Offline Training Pipeline              │
│                        │                             │
│  ┌────────────┐  ┌─────▼──────┐  ┌──────────────┐  │
│  │ User       │  │ Model      │  │ Feature      │  │
│  │ Interaction│──▶│ Training   │──▶│ Computation  │  │
│  │ Events     │  │ (Spark +   │  │ & Store      │  │
│  │ (Kafka)    │  │  TensorFlow│  │              │  │
│  └────────────┘  └────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────┘
\`\`\`

## Two-Stage Ranking

Netflix uses a **candidate generation + ranking** pipeline:

### Stage 1: Candidate Generation

Quickly narrow the 17,000-title catalog to ~1,000 candidates:

\`\`\`
Candidate Sources:
├── Collaborative filtering: "Users like you watched X"
│   (Matrix factorization, ~200ms for 1000 candidates)
├── Content-based: "Similar to what you watched"
│   (Genre, actors, director embeddings)
├── Trending: Popular in your region this week
├── New releases: Recently added to catalog
└── Editorial: Curated rows (e.g., "Award Winners")

Union of all sources → ~1,000 unique candidates
\`\`\`

### Stage 2: Personalized Ranking

Rank the 1,000 candidates using a deep learning model:

\`\`\`
Input features per (user, title) pair:
├── User features:
│   ├── Watch history (last 100 titles)
│   ├── Genre affinity scores
│   ├── Time-of-day patterns
│   ├── Device type
│   └── Taste cluster membership
├── Title features:
│   ├── Genre, tags, cast, director
│   ├── Visual similarity embeddings
│   ├── Popularity score
│   └── Freshness (days since added)
├── Context features:
│   ├── Day of week, time of day
│   ├── Current row position on page
│   └── Session depth (how long browsing)
│
Output: P(watch | user, title, context) ∈ [0, 1]
\`\`\`

## The Homepage: Row Generation

The Netflix homepage is a grid of rows, each row being a different recommendation "algorithm":

\`\`\`
Netflix Homepage for User 123:
┌──────────────────────────────────────────┐
│ Continue Watching                        │
│ [Title A ▶60%] [Title B ▶20%] [Title C] │
├──────────────────────────────────────────┤
│ Because You Watched "Breaking Bad"       │
│ [Ozark] [Better Call Saul] [Narcos]      │
├──────────────────────────────────────────┤
│ Trending Now                             │
│ [Title X] [Title Y] [Title Z]           │
├──────────────────────────────────────────┤
│ Award-Winning Dramas                     │
│ [Title P] [Title Q] [Title R]           │
└──────────────────────────────────────────┘
\`\`\`

### Row Selection and Ordering

Netflix has ~10,000 possible row types. For each user, a **page-level algorithm** selects and orders the ~40 most relevant rows:

\`\`\`
Row types pool: ~10,000
├── "Because you watched [X]" (one per recently watched title)
├── Genre rows ("Sci-Fi Movies", "Stand-Up Comedy")
├── Mood rows ("Feel-Good", "Suspenseful")
├── Trending, Popular, New Releases
└── Personalized mixes

Page algorithm selects 40 rows, ordered by
predicted engagement for this user at this time.
\`\`\`

## Artwork Personalization

Netflix even personalizes the **thumbnail image** shown for each title. The same movie shows different artwork to different users based on their preferences.

\`\`\`
User who watches comedies → sees a funny scene thumbnail
User who watches romance → sees a romantic scene thumbnail
User who likes a specific actor → sees that actor's face

A/B tested: personalized artwork increases click-through
rate by ~20-30% vs. generic thumbnails.
\`\`\`

## Online/Offline Split

| Component | Online (real-time) | Offline (batch) |
|-----------|-------------------|-----------------|
| Model inference | < 200ms per page | N/A |
| Model training | N/A | Daily retrain on Spark cluster |
| Feature computation | Lookup from cache | Computed nightly from event logs |
| A/B testing | Real-time assignment | Analyzed after 2-4 weeks |

## Scale Numbers

\`\`\`
Homepage requests:     ~100M/day (one per session start)
Row ranking calls:     ~100M × 40 rows = 4B ranking operations/day
Feature store reads:   ~50K/s (Redis, p99 < 5ms)
Model inference:       ~200ms per page (GPU inference cluster)
Model retraining:      Daily on ~1 PB of interaction data
A/B tests running:     ~200 concurrent experiments
\`\`\``,
    },
    {
      id: "netflix-architecture-walkthrough",
      slug: "netflix-architecture-walkthrough",
      title: "Architecture Walkthrough",
      content: `# Netflix: Complete Architecture Walkthrough

## Full System Architecture

\`\`\`
                         ┌─────────────────────────┐
                         │      DNS / GeoDNS       │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                  │
          ┌─────────▼──────┐  ┌──────▼───────┐  ┌──────▼───────┐
          │  API Gateway   │  │  CDN (Open   │  │  CDN (Open   │
          │  (Zuul)        │  │  Connect)    │  │  Connect)    │
          │  - auth        │  │  ISP OCAs    │  │  IXP Sites   │
          │  - routing     │  │  ~18K servers│  │  ~60 sites   │
          │  - rate limit  │  └──────────────┘  └──────────────┘
          └────────┬───────┘
                   │
     ┌─────────────┼──────────────┬──────────────────┐
     ▼             ▼              ▼                  ▼
┌─────────┐  ┌──────────┐  ┌──────────┐    ┌──────────────┐
│Catalog  │  │Streaming │  │ User     │    │Recommendation│
│Service  │  │Service   │  │ Service  │    │Service       │
│- browse │  │- manifest│  │- profile │    │- ranking     │
│- search │  │- steering│  │- history │    │- candidate   │
│- detail │  │- playback│  │- prefs   │    │  generation  │
└────┬────┘  └────┬─────┘  └────┬─────┘    └──────┬───────┘
     │            │             │                  │
     └─────┬──────┴──────┬──────┘                  │
           ▼             ▼                         ▼
     ┌──────────┐  ┌──────────┐           ┌──────────────┐
     │Cassandra │  │ EVCache  │           │Feature Store │
     │(catalog, │  │ (Redis   │           │(user prefs,  │
     │ history) │  │  cluster)│           │ embeddings)  │
     └──────────┘  └──────────┘           └──────────────┘
                                                  │
                                    ┌─────────────┘
                                    ▼
                         ┌──────────────────┐
                         │  Offline ML      │
                         │  Pipeline        │
                         │  (Spark +        │
                         │   TensorFlow)    │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │  Data Warehouse  │
                         │  (S3 + Iceberg)  │
                         └──────────────────┘

          Encoding Pipeline (separate):
     ┌──────────┐  ┌───────────┐  ┌──────────┐
     │ Ingest   │─▶│ Encoding  │─▶│ Packager │─▶ CDN Origin (S3)
     │ (upload) │  │ (GPU farm)│  │ (DRM)    │
     └──────────┘  └───────────┘  └──────────┘
\`\`\`

## Data Flow: User Presses Play

Let's trace what happens when a user on Comcast in New York presses play on "Stranger Things":

### Step 1: Authentication & Authorization
\`\`\`
Client ──play request──▶ API Gateway (Zuul)
  ├── Validate JWT token
  ├── Check subscription tier (4K plan? HD plan?)
  ├── Check device count (max 4 concurrent streams)
  └── Route to Streaming Service
\`\`\`

### Step 2: Manifest & CDN Steering
\`\`\`
Streaming Service:
  ├── Lookup title metadata (Cassandra)
  ├── Determine available quality levels for user's device + plan
  ├── Call Steering Service:
  │   ├── User is on Comcast NYC
  │   ├── OCA in Comcast NYC datacenter has title cached ✓
  │   ├── OCA load: 60% (healthy)
  │   └── Return: oca-comcast-nyc-1.nflxvideo.net
  ├── Generate DASH/HLS manifest with OCA URLs
  └── Return manifest to client
\`\`\`

### Step 3: Segment Streaming
\`\`\`
Client player:
  ├── Parse manifest
  ├── Select initial quality: 480p (fast start)
  ├── Request: GET oca-comcast-nyc-1.nflxvideo.net/st-s4e1/480p/seg-001.m4s
  │   └── OCA serves from local SSD (~5ms latency)
  ├── First frame rendered: ~1.2 seconds from play press
  ├── Buffer fills → upgrade to 1080p
  ├── Request: GET .../1080p/seg-003.m4s
  ├── Buffer continues filling → upgrade to 4K
  └── Steady state: 4K streaming, 30s buffer maintained
\`\`\`

### Step 4: Real-Time Telemetry
\`\`\`
Client reports every 30 seconds:
  ├── Current bitrate
  ├── Buffer level
  ├── Rebuffer events (count + duration)
  ├── Throughput measurements
  └── Playback position

Telemetry ──▶ Kafka ──▶ Real-time analytics
                    ──▶ Data warehouse (batch)
\`\`\`

## Key Databases

| Data | Store | Why |
|------|-------|-----|
| User profiles, watch history | Cassandra | Write-heavy, globally distributed |
| Session cache, steering data | EVCache (Redis) | Sub-ms reads, ephemeral |
| Content metadata | Cassandra + cache | Read-heavy, rarely changes |
| Recommendation features | Cassandra + Redis | Pre-computed, fast lookup |
| Video segments | S3 (origin) + OCA SSDs | Massive storage, fast local serving |
| Telemetry / analytics | Kafka → S3 (Iceberg) | Append-only, petabyte-scale |

## Reliability

Netflix pioneered **Chaos Engineering** — intentionally injecting failures in production:

\`\`\`
Chaos Monkey:    Randomly kills EC2 instances
Chaos Kong:      Simulates entire region failure
Latency Monkey:  Injects artificial delays
\`\`\`

### Region Failover

\`\`\`
Normal: US-East serves East Coast, US-West serves West Coast

US-East failure:
  ├── Health checks detect failure in < 30 seconds
  ├── DNS updated: all traffic routes to US-West
  ├── US-West scales up (auto-scaling, pre-provisioned capacity)
  ├── CDN OCAs are unaffected (they are inside ISPs, not in AWS)
  └── User impact: ~2 minutes of degraded recommendations
      Video playback unaffected (served from OCAs)
\`\`\`

## Scaling Summary

| Component | Scale | Strategy |
|-----------|-------|----------|
| API Gateway | ~100K req/s | Zuul 2 (async, non-blocking) |
| Microservices | ~1,000 services | Independent teams, separate deploys |
| Cassandra | Petabytes | Multi-region, tunable consistency |
| EVCache | ~30M ops/s | Sharded Redis clusters |
| Open Connect | 50 Tbps, 18K servers | Embedded in ISPs worldwide |
| Encoding | 60K jobs/day | GPU spot instances, parallel chunks |
| ML Pipeline | 1 PB/day training data | Spark + TensorFlow, daily retrain |

## Key Trade-offs

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| CDN | Custom (Open Connect) | Third-party CDN | Cost: saves billions/year |
| Microservices | ~1,000 services | Monolith | Team independence at 10K+ engineers |
| Encoding | Per-title + per-shot | Fixed bitrate ladder | 40% bandwidth savings |
| ABR | Buffer-based | Bandwidth estimation | More stable, fewer rebuffers |
| Consistency | Eventual (Cassandra) | Strong (PostgreSQL) | Availability across regions |
| Chaos testing | In production | Staging only | Discovers real failure modes |`,
    },
  ],
};
