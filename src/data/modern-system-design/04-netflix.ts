import { Module } from "../types";

export const netflixModule: Module = {
  id: "design-netflix",
  title: "Design Netflix",
  description: "Design a video streaming platform: encoding pipelines, CDN architecture, adaptive bitrate streaming, and recommendation integration at global scale.",
  lessons: [
    {
      id: "netflix-requirements-scale",
      slug: "netflix-requirements-scale",
      title: "Requirements & Scale",
      content: `# Design Netflix: Requirements & Scale

Netflix serves **300 million subscribers across 190 countries** and is responsible for roughly 15% of global downstream internet traffic during peak hours. Before designing any component, we need to understand *what* we're building and *how big* it actually is — because at this scale, every architectural decision has a price tag measured in petabytes and petadollars.

\`\`\`concept
{ "title": "The Scale-First Principle", "variant": "mental-model", "content": "In system design interviews, requirements come in two layers: functional (what the system does) and non-functional (how well it does it at scale). For Netflix, the non-functional requirements — 50 Tbps of egress, sub-2-second startup, 99.99% uptime — are the ones that drive every major architectural decision. Start with the math, then pick the components." }
\`\`\`

## Functional Requirements

These are the capabilities the system must expose to users and operators:

| # | Feature | What it means at Netflix scale |
|---|---------|-------------------------------|
| 1 | **Video upload & processing** | Content teams upload source masters; system encodes into 1,200+ format/resolution variants |
| 2 | **Video streaming** | Users stream with minimal buffering (< 2s startup) |
| 3 | **Adaptive bitrate** | Quality adjusts seamlessly as network conditions change |
| 4 | **Content catalog** | Browse, search, and discover across 17,000+ titles |
| 5 | **Recommendations** | Personalized suggestions per user, updated continuously |
| 6 | **Watch history & resume** | Track progress across sessions and devices |
| 7 | **Multi-device support** | TV, mobile, tablet, browser — each needing different codecs |

## Non-Functional Requirements

\`\`\`tabs
{ "tabs": [
  { "label": "Availability", "icon": "🔴", "content": "**99.99% uptime** — this means less than **52 minutes of downtime per year**.\\n\\nA global Netflix outage costs roughly **$1M/hour** in subscriber churn and refunds. This forces a multi-region active-active deployment with no single point of failure anywhere in the critical path.\\n\\nFor reference: 99.9% uptime allows 8.7 hours of downtime — unacceptable for a streaming business." },
  { "label": "Latency", "icon": "⚡", "content": "**Two separate SLAs operate in parallel:**\\n\\n- **Video playback start**: < 2 seconds from pressing Play to first frame\\n- **Catalog browsing**: < 200ms for search and metadata pages\\n\\nThese numbers drive two completely different system designs. Catalog browsing is a CDN + database caching problem. Playback startup is a CDN placement + manifest generation + ABR initialization problem." },
  { "label": "Throughput", "icon": "📊", "content": "**10 million+ concurrent streams during peak** (typically 9–11 PM in each time zone).\\n\\nEach stream is an independent stateful session pulling video segments every 2–10 seconds. The system must handle:\\n- Segment requests from 10M clients simultaneously\\n- Quality-switching decisions every few seconds per client\\n- Session state and watch-position writes in real time" },
  { "label": "Durability", "icon": "🔒", "content": "**Zero tolerance for content loss.** Source masters are irreplaceable — a lost movie cannot be re-acquired at any price.\\n\\nThis forces:\\n- Source files stored with 11-nines durability (e.g., AWS S3)\\n- Encoded versions distributed across multiple CDN regions\\n- No single-point storage — Netflix's Open Connect Appliances (OCAs) provide regional redundancy" }
] }
\`\`\`

## Scale Estimation

This is where you demonstrate to an interviewer that you understand *why* the architecture looks the way it does. Each number below justifies a specific design choice.

\`\`\`tabs
{ "tabs": [
  { "label": "Users & Streams", "icon": "👥", "content": "\`\`\`\\nSubscribers:            ~300 million (global, 2024)\\nDAU:                    ~100 million (~33% daily engagement)\\nConcurrent streams:     ~10 million (peak, ~10% of DAU)\\nAverage session length: ~2 hours\\n\`\`\`\\n\\n**Why 10% of DAU concurrent?** Peak streaming happens in a narrow 2–3 hour window per timezone. With 100M DAU across distributed timezones, the global peak is roughly 10M simultaneous streams.\\n\\n**Interview insight:** Don't use total subscribers as your concurrency number — that's a common mistake. Use DAU × peak-hour engagement rate." },
  { "label": "Bandwidth", "icon": "📡", "content": "\`\`\`\\nAverage bitrate per stream:  5 Mbps (mix of SD, HD, 4K)\\nConcurrent streams (peak):   10 million\\n\\nTotal egress = 10M × 5 Mbps = 50 Tbps peak\\n\`\`\`\\n\\n**For context:** 50 Tbps is approximately **15% of all downstream internet traffic in North America** during peak hours.\\n\\nThis is why Netflix built Open Connect — their proprietary CDN. At 50 Tbps, paying commercial CDN rates would cost hundreds of millions per year. Building custom CDN hardware and deploying it inside ISP networks directly is cheaper at this scale.\\n\\n**Interviewer signal:** Mentioning Open Connect and the economic rationale for owning CDN infrastructure shows senior-level thinking." },
  { "label": "Storage", "icon": "💾", "content": "\`\`\`\\nTitles in catalog:            ~17,000\\nAverage duration per title:   90 minutes\\nEncoded versions per title:   ~1,200\\n  (resolutions × codecs × bitrate ladders)\\nAverage encoded file size:    ~5 GB per version\\n\\nRaw storage:\\n  17,000 × 1,200 × 5 GB = ~102 PB\\n\\nWith CDN replication across regions: ~500+ PB\\n\`\`\`\\n\\nThe 1,200 versions per title breaks down roughly as:\\n- **Resolutions**: 240p, 360p, 480p, 720p, 1080p, 4K = 6 tiers\\n- **Codecs**: H.264, H.265/HEVC, VP9, AV1 = 4 codecs\\n- **Bitrate variants per resolution**: ~4–5 per tier\\n- **Audio tracks**: multiple languages + quality levels\\n\\nMultiply these out and 1,200 is conservative." },
  { "label": "Upload Pipeline", "icon": "⚙️", "content": "\`\`\`\\nNew titles added per week:        ~50\\nEncoded versions per title:       ~1,200\\nEncoding time per version:        ~30 min (GPU-accelerated)\\n\\nTotal compute needed per week:\\n  50 titles × 1,200 versions × 0.5 GPU-hours\\n  = 30,000 GPU-hours per week\\n  = ~4,300 GPU-hours per day\\n\`\`\`\\n\\nThis is why encoding is done **asynchronously** in a distributed pipeline — you cannot block content upload on 30,000 GPU-hours of work. The pipeline fans out aggressively with hundreds of parallel encoding workers.\\n\\n**Key insight:** Netflix uses per-title encoding optimization — each title gets analyzed for visual complexity before encoding, allowing up to **40% bandwidth reduction** without perceptible quality loss." }
] }
\`\`\`

## Key Challenges

These five challenges directly map to the five major design decisions in the lessons ahead:

\`\`\`callout
{ "type": "warning", "title": "The Hardest Part Isn't the Video", "content": "The naive assumption is that streaming video is the hard part. It's not. The hard part is doing it at 50 Tbps with < 2s startup globally, while keeping CDN bandwidth costs from exceeding your entire engineering budget. Every architectural pattern below (Open Connect, ABR, per-title encoding) exists primarily to reduce cost at scale." }
\`\`\`

| Challenge | Why It's Hard | Architectural Answer |
|-----------|--------------|---------------------|
| **50 Tbps egress** | More than most ISPs handle in total | Netflix Open Connect (proprietary CDN inside ISPs) |
| **1,200 encodes per title** | Massive parallel GPU compute | Distributed async encoding pipeline |
| **< 2s startup globally** | 190 countries, 190 different distances to origin | Edge caching + pre-positioned popular content |
| **Seamless quality switching** | Network changes mid-stream constantly | HLS/DASH adaptive bitrate streaming |
| **CDN cost optimization** | Bandwidth is #1 operational cost | Per-title encoding, AV1 codec rollout, proactive caching |

## High-Level Architecture

\`\`\`sysdiag
{ "title": "Netflix High-Level Components", "width": 680, "height": 420,
  "nodes": [
    { "id": "clients", "label": "Clients\\n(TV / Mobile / Web)", "x": 80, "y": 200, "kind": "client" },
    { "id": "apigw", "label": "API Gateway\\n/ Load Balancer", "x": 240, "y": 200, "kind": "service" },
    { "id": "catalog", "label": "Catalog\\nService", "x": 420, "y": 100, "kind": "service" },
    { "id": "streaming", "label": "Streaming\\nService", "x": 420, "y": 200, "kind": "service" },
    { "id": "recs", "label": "Recommendation\\nEngine", "x": 420, "y": 300, "kind": "service" },
    { "id": "cdn", "label": "Open Connect\\nCDN (edge)", "x": 600, "y": 200, "kind": "cache" },
    { "id": "encoding", "label": "Encoding\\nPipeline", "x": 600, "y": 340, "kind": "queue" },
    { "id": "storage", "label": "Object Storage\\n(source masters)", "x": 600, "y": 100, "kind": "database" }
  ],
  "edges": [
    { "from": "clients", "to": "apigw", "label": "all requests" },
    { "from": "apigw", "to": "catalog", "label": "browse/search" },
    { "from": "apigw", "to": "streaming", "label": "play request" },
    { "from": "apigw", "to": "recs", "label": "recommendations" },
    { "from": "streaming", "to": "cdn", "label": "segment URLs" },
    { "from": "cdn", "to": "clients", "label": "video segments" },
    { "from": "encoding", "to": "cdn", "label": "push encoded content" },
    { "from": "storage", "to": "encoding", "label": "source master" }
  ],
  "annotations": {
    "cdn": "Open Connect Appliances sit inside ISP networks worldwide. 80%+ of traffic is served from edge, never touching Netflix origin servers.",
    "encoding": "Async pipeline: upload triggers fan-out to hundreds of parallel GPU workers. Takes hours, not seconds.",
    "streaming": "Issues signed manifests (HLS/DASH). Client fetches actual video segments directly from CDN — streaming service is NOT in the data path.",
    "apigw": "Single entry point for all client types. Routes to microservices. Also handles auth, rate limiting, and device detection."
  }
}
\`\`\`

\`\`\`callout
{ "type": "insight", "title": "The Streaming Service Is NOT in the Video Data Path", "content": "This is a critical insight: when you press Play, the Streaming Service returns a **manifest file** (a playlist of URLs). The client then fetches video segments **directly from the CDN**. The Streaming Service handles the initial handshake but zero bytes of actual video flow through it. This is how Netflix scales to 10M concurrent streams without a proportionally massive backend." }
\`\`\`

## Check Your Understanding

\`\`\`quiz
{ "title": "Requirements & Scale", "questions": [
  {
    "question": "Netflix's total egress during peak is approximately 50 Tbps. What drives this number?",
    "options": [
      "230M subscribers × average bitrate",
      "~10M concurrent streams × ~5 Mbps average bitrate",
      "17,000 titles × streaming sessions per title",
      "DAU × average session length × bitrate"
    ],
    "answer": 1,
    "explanation": "Egress = concurrent streams × bitrate per stream. The key is using concurrent streams (~10M peak), NOT total subscribers. Total subscribers × bitrate would wildly overestimate because not everyone watches simultaneously."
  },
  {
    "question": "Netflix generates ~1,200 encoded versions per title. Which combination best explains why there are so many?",
    "options": [
      "One per country × bitrate levels",
      "Resolutions × codecs × bitrate ladder rungs × audio tracks",
      "Device types × streaming protocols only",
      "Quality tiers × number of CDN edge regions"
    ],
    "answer": 1,
    "explanation": "The 1,200 versions come from the Cartesian product of: resolutions (6 tiers: 240p to 4K) × codecs (H.264, HEVC, VP9, AV1) × bitrate variants per resolution (4-5) × audio tracks (multiple languages and quality levels)."
  },
  {
    "question": "Why does Netflix operate Open Connect (its own CDN) instead of using a commercial CDN?",
    "options": [
      "Commercial CDNs can't support HLS or DASH streaming",
      "Open Connect allows Netflix to use proprietary codecs unavailable on commercial CDNs",
      "At 50 Tbps scale, deploying hardware inside ISP networks is cheaper than paying commercial CDN rates",
      "Netflix needs TCP-level control that commercial CDNs don't expose"
    ],
    "answer": 2,
    "explanation": "At Netflix's scale (50 Tbps peak), the economics shift dramatically. Commercial CDN pricing would cost hundreds of millions annually. By deploying Open Connect Appliances directly inside ISP networks, Netflix pre-positions content at the network edge and avoids long-haul transit costs — the hardware investment pays for itself quickly."
  },
  {
    "question": "A user's video startup latency target is < 2 seconds. Which component most directly determines whether this SLA is met?",
    "options": [
      "The Encoding Pipeline processing speed",
      "The Recommendation Engine response time",
      "The CDN edge node's proximity and whether content is already cached there",
      "The API Gateway's request routing latency"
    ],
    "answer": 2,
    "explanation": "Startup latency is dominated by the time to fetch the first video segments. If those segments are cached at a nearby Open Connect edge node, the client gets them in milliseconds. If they must be fetched from origin, startup time blows past 2 seconds. This is why Netflix proactively pushes popular content to edge nodes — the cache-hit rate directly controls SLA achievement."
  }
] }
\`\`\`

## What's Coming Next

The scale numbers above make three architectural problems obvious:

1. **Encoding pipeline** — How do you produce 1,200 versions per title without blocking for days?
2. **CDN architecture** — How does Open Connect actually work, and how does Netflix decide what to pre-position where?
3. **Adaptive bitrate streaming** — How does the client seamlessly switch quality mid-stream using HLS/DASH?

Each of the next three lessons dives into one of these.

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Peak concurrency (~10M) drives architecture, not total subscribers (~300M) — always use concurrency for bandwidth math",
  "50 Tbps egress ≈ 15% of all North American internet traffic — this single number justifies owning a proprietary CDN",
  "1,200 encoded versions per title = resolutions × codecs × bitrate rungs × audio tracks — encoding is a distributed parallel compute problem",
  "The Streaming Service issues manifests (playlists of URLs); actual video bytes flow client → CDN, bypassing backend entirely",
  "99.99% uptime = < 52 minutes downtime/year — this forces active-active multi-region with no single point of failure"
] }
\`\`\``,
    },
    {
      id: "netflix-video-encoding",
      slug: "netflix-video-encoding",
      title: "Video Encoding Pipeline",
      content: `# Netflix: Video Encoding Pipeline

## The Encoding Challenge

A single film arrives as a high-quality ProRes master — roughly 500 GB. Before a single viewer can press play, it must become approximately **1,200 encoded versions** covering every combination of resolution (240p–4K), codec (H.264, HEVC, VP9, AV1), bitrate, and audio format (stereo, 5.1, Dolby Atmos) across every supported language. At 50+ new titles per day, the encoding system must sustain ~200 encode jobs per minute around the clock.

Netflix rebuilt this system from a monolith into independently scalable microservices, each responsible for one stage of the pipeline.

## Pipeline Architecture

\`\`\`sysdiag
{
  "title": "Netflix Video Encoding Pipeline",
  "width": 920,
  "height": 320,
  "nodes": [
    { "id": "upload", "label": "S3 Master\\n(~500 GB)", "x": 60, "y": 160, "kind": "database" },
    { "id": "ingest", "label": "Ingest\\nService", "x": 200, "y": 160, "kind": "service" },
    { "id": "analysis", "label": "Analysis\\nService", "x": 340, "y": 160, "kind": "service" },
    { "id": "orch", "label": "Encoding\\nOrchestrator", "x": 490, "y": 160, "kind": "service" },
    { "id": "w1", "label": "GPU\\nWorker 1", "x": 630, "y": 80, "kind": "service" },
    { "id": "w2", "label": "GPU\\nWorker 2", "x": 630, "y": 160, "kind": "service" },
    { "id": "wN", "label": "GPU\\nWorker N", "x": 630, "y": 240, "kind": "service" },
    { "id": "packager", "label": "Packager\\n(DASH/HLS/DRM)", "x": 770, "y": 160, "kind": "service" },
    { "id": "cdn", "label": "CDN Origin\\n(S3)", "x": 880, "y": 160, "kind": "database" }
  ],
  "edges": [
    { "from": "upload", "to": "ingest" },
    { "from": "ingest", "to": "analysis" },
    { "from": "analysis", "to": "orch" },
    { "from": "orch", "to": "w1" },
    { "from": "orch", "to": "w2" },
    { "from": "orch", "to": "wN" },
    { "from": "w1", "to": "packager" },
    { "from": "w2", "to": "packager" },
    { "from": "wN", "to": "packager" },
    { "from": "packager", "to": "cdn" }
  ],
  "annotations": {
    "ingest": "Validates checksum, extracts metadata, rejects non-conformant or low-quality mezzanines using VIS (Video Inspection Service).",
    "analysis": "Detects scene cuts, scores visual complexity per shot — this data drives the per-title bitrate ladder.",
    "orch": "Workflow engine tracks the full encode lifecycle, splits video into chunks, retries failed jobs, and sends alerts for stuck stages.",
    "packager": "Segments content into HLS/MPEG-DASH manifests and applies Widevine, FairPlay, and PlayReady DRM wrappers."
  }
}
\`\`\`

Each stage is an independently deployable microservice. A bottleneck in scene analysis doesn't stall the encoder fleet; a crashed worker doesn't block the packager.

## Per-Title Encoding

\`\`\`concept
{
  "title": "Per-Title Encoding",
  "variant": "mental-model",
  "content": "Instead of one fixed bitrate ladder for all content, Netflix analyzes each title's visual complexity and generates a custom ladder. Simple animation (low detail, flat colors) looks great at 1.5 Mbps at 1080p. A high-action film with fast motion needs 6+ Mbps for the same perceptual quality. A one-size-fits-all ladder wastes bandwidth on simple content and under-serves complex content — at 50 Tbps of delivery, that waste costs millions."
}
\`\`\`

Netflix extends per-title encoding to **shot-based encoding**: every scene cut gets its own optimal bitrate within the ladder. A quiet dialogue shot might encode at 1.2 Mbps while an explosion in the same film encodes at 10 Mbps. This granularity yields roughly **40% bandwidth savings** over constant-bitrate approaches at equal or better perceptual quality.

## Chunk-Based Parallel Encoding

Rather than encoding a 90-minute film sequentially (~8 hours per encode profile), the orchestrator splits the video into 4-second chunks and dispatches them simultaneously across a fleet of GPU workers. Each worker encodes its chunk independently; all chunks are stitched when complete. Wall-clock time drops to **~30 minutes per encode profile**.

Netflix's encoding cluster runs approximately 10,000 GPU instances (spot and preemptible), absorbing ~200 encode jobs per minute sustained.

\`\`\`algoviz
{
  "title": "Chunk-Based Parallel Encoding",
  "type": "array",
  "data": ["C001", "C002", "C003", "C004", "C005", "C006"],
  "frames": [
    {
      "highlight": [],
      "label": "90-minute film split into ~1,350 chunks (4 sec each). Sequential encoding: ~8 hours per profile.",
      "stats": { "queued": 6, "active_workers": 0 }
    },
    {
      "highlight": [0, 2, 4],
      "label": "Orchestrator dispatches chunks to GPU Workers A, B, C simultaneously — all start at t=0.",
      "stats": { "queued": 3, "active_workers": 3 }
    },
    {
      "highlight": [1, 3, 5],
      "label": "Workers A, B, C finish → immediately claim next chunks. No idle time between jobs.",
      "stats": { "queued": 0, "active_workers": 3 }
    },
    {
      "highlight": [],
      "label": "All chunks encoded. Packager stitches them into HLS/DASH segments. Wall-clock: ~30 min.",
      "stats": { "queued": 0, "active_workers": 0 }
    }
  ],
  "speed": 1100
}
\`\`\`

## Codec Landscape

Netflix encodes every title into multiple codec profiles simultaneously. The codec determines the compression efficiency vs. compute cost trade-off.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "H.264 (AVC)",
      "icon": "📼",
      "content": "**Status:** Legacy universal fallback\\n\\n**Compression vs. H.264:** 1× (baseline)\\n\\n**Encoding cost:** 1× (baseline)\\n\\n**Device support:** Universal — every device, browser, and smart TV.\\n\\nH.264 remains the compatibility baseline. Netflix still serves it to legacy devices but has stopped prioritizing it for new encode runs. Its main value is zero playback friction across the entire installed base — no device negotiation needed."
    },
    {
      "label": "H.265 / HEVC",
      "icon": "📺",
      "content": "**Status:** Current primary (non-AV1 devices)\\n\\n**Compression vs. H.264:** ~40% better (same quality at 40% lower bitrate)\\n\\n**Encoding cost:** ~3× H.264\\n\\n**Device support:** Modern devices — 2015+ smartphones, smart TVs, Safari, Apple hardware.\\n\\nHEVC is Netflix's workhorse for HD and 4K delivery today. The 40% bitrate savings translate directly into CDN cost reduction. The higher encoding cost is absorbed by the GPU fleet running on spot instances."
    },
    {
      "label": "VP9",
      "icon": "🌐",
      "content": "**Status:** Current (Google ecosystem)\\n\\n**Compression vs. H.264:** ~40% better\\n\\n**Encoding cost:** ~2.5× H.264\\n\\n**Device support:** Chrome, Android, Chromecast-capable devices.\\n\\nVP9 is Google's royalty-free alternative to HEVC. Netflix uses it primarily for Chrome and Android streams where HEVC patent licensing adds complexity. Slightly lower encoding cost than HEVC with comparable compression gains."
    },
    {
      "label": "AV1",
      "icon": "🚀",
      "content": "**Status:** Aggressively deployed — future default\\n\\n**Compression vs. H.264:** ~50% better\\n\\n**Encoding cost:** ~10× H.264\\n\\n**Device support:** Growing — Chromium, Android 10+, some smart TVs; not yet universal.\\n\\nAV1 is the strategic future. At 50% better compression, every percentage point of delivery shifted to AV1 represents enormous CDN savings at 50 Tbps. Netflix is aggressively adopting AV1 for mobile streams specifically — where bandwidth is most constrained and the savings per stream are most visible. The 10× encoding cost is offset by royalty-free licensing and dramatically lower per-stream delivery cost."
    }
  ]
}
\`\`\`

## Quality Gating: VMAF

\`\`\`callout
{
  "type": "info",
  "title": "Automated VMAF Quality Scoring",
  "content": "Every encode job runs through Netflix's open-source **Video Multimethod Assessment Fusion (VMAF)** scorer before the packager accepts it. VMAF predicts human perceptual quality on a 0–100 scale by combining multiple quality metrics. Encodes falling below a per-title threshold are automatically **rejected and re-queued** — not shipped. VMAF scores also feed Netflix's analytics pipeline for continuous encoder quality monitoring. This is the primary guard against silent quality regressions."
}
\`\`\`

## DRM: One Video, Three Encryption Wrappers

\`\`\`collapse
{
  "title": "Deep Dive: Three DRM Systems",
  "content": "Content is encrypted by the Packager using three DRM systems simultaneously — each targeting a different platform ecosystem:\\n\\n- **Widevine** (Google): Android devices, Chrome, Chromecast\\n- **FairPlay** (Apple): iOS, Safari, Apple TV, macOS\\n- **PlayReady** (Microsoft): Windows, Xbox, Samsung Smart TVs, Roku\\n\\nThe same encoded video stream is packaged with all three wrappers. When a device requests a stream, the Netflix client presents the appropriate DRM license token. Encryption keys are stored in a Hardware Security Module (HSM) — never in application code or environment variables.\\n\\nCritically, DRM packaging is **idempotent**: if the packager crashes mid-run, it restarts with the same encryption keys and produces the exact same encrypted output. This property is essential for failure recovery — the video never needs to be re-encoded just because packaging failed."
}
\`\`\`

## Scale and Failure Handling

The encoding system writes approximately **300 TB of encoded content per day** (50 titles × 1,200 versions × ~5 GB average). Encoding queue backlogs — common around major content drops — are handled by spinning up additional spot-instance GPU workers horizontally.

| Failure Mode | Mitigation |
|---|---|
| Worker crash mid-encode | Checkpoint at chunk boundaries; retry only the failed chunk |
| Corrupt source upload | Checksum validation on ingest (VIS); reject and re-request |
| Encoding quality regression | Automated VMAF scoring; reject if below per-title threshold |
| DRM packaging failure | Idempotent packaging; retry with same encryption keys |
| Encoding queue backlog | Horizontal scale-out of GPU worker pool (spot instances) |

## Knowledge Check

\`\`\`quiz
{
  "title": "Video Encoding Pipeline",
  "questions": [
    {
      "question": "What is the primary benefit of per-title encoding over a fixed bitrate ladder?",
      "options": [
        "It eliminates the need for DRM encryption on simple content",
        "It tailors the bitrate ladder to each title's visual complexity, saving ~40% bandwidth",
        "It reduces the number of codec profiles that need to be generated",
        "It allows streaming playback to begin before encoding is complete"
      ],
      "answer": 1,
      "explanation": "Per-title encoding analyzes each title's visual complexity (via the Analysis Service scene-detection pass) and generates a custom bitrate ladder. Simple content (flat colors, low motion) needs far less bitrate for the same perceptual quality as a high-action film. Netflix reports roughly 40% bandwidth savings over constant-bitrate approaches."
    },
    {
      "question": "How does chunk-based parallel encoding reduce wall-clock time for encoding a 90-minute film?",
      "options": [
        "It skips encoding low-complexity scenes entirely",
        "It uses a faster codec that requires less CPU time per frame",
        "It splits the video into short segments that are encoded simultaneously across a GPU fleet",
        "It caches previously encoded segments from visually similar titles"
      ],
      "answer": 2,
      "explanation": "The orchestrator splits the source into 4-second chunks and dispatches them to GPU workers simultaneously. All chunks are encoded in parallel rather than sequentially. Wall-clock time drops from ~8 hours to ~30 minutes per encode profile. When a worker finishes its chunk, it immediately claims the next available one — no idle time."
    },
    {
      "question": "AV1 offers approximately what compression improvement over H.264 at equivalent perceptual quality?",
      "options": [
        "10% better",
        "25% better",
        "40% better",
        "50% better"
      ],
      "answer": 3,
      "explanation": "AV1 delivers approximately 50% better compression than H.264 at the same perceptual quality. This is the highest compression gain of any current production codec, which is why Netflix is aggressively adopting AV1 for mobile streams despite the ~10× encoding cost vs. H.264."
    },
    {
      "question": "If a GPU worker crashes halfway through encoding a chunk, what prevents re-encoding the entire film?",
      "options": [
        "The entire encoding job restarts from scratch on a new worker",
        "Checkpoints at chunk boundaries allow only the failed chunk to be retried",
        "A hot standby worker mirrors all encodes in real time as a redundant copy",
        "The packager reconstructs the failed chunk from a CDN edge cache"
      ],
      "answer": 1,
      "explanation": "Chunk boundaries act as natural checkpoints. Because each chunk is an independent unit of work, only the failed chunk needs to be retried — not the entire encode job. This is a core fault-tolerance property of the chunk-based architecture."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Per-title and shot-based encoding customizes the bitrate ladder per title and per scene cut, saving ~40% bandwidth vs. constant-bitrate approaches.",
    "Chunk-based parallel encoding across ~10,000 GPU workers reduces wall-clock encode time from ~8 hours to ~30 minutes per profile.",
    "AV1 delivers ~50% better compression than H.264; its 10× encoding cost is offset by massive CDN delivery savings at 50 Tbps scale.",
    "Every encode passes automated VMAF quality scoring — below-threshold encodes are rejected and re-queued, never shipped.",
    "DRM packaging is idempotent and applies three wrappers simultaneously (Widevine, FairPlay, PlayReady) — same video stream, different encryption per device ecosystem."
  ]
}
\`\`\``,
    },
    {
      id: "netflix-cdn-architecture",
      slug: "netflix-cdn-architecture",
      title: "CDN Architecture",
      content: `# Netflix: CDN Architecture

At 50 Tbps of peak egress, Netflix faces a brutal economics problem: using a third-party CDN like Akamai or CloudFront would cost **billions of dollars per year**. The solution was to build something entirely different.

\`\`\`concept
{ "title": "Open Connect: CDN as Infrastructure", "variant": "mental-model", "content": "Most companies rent CDN capacity from providers who own the edge servers. Netflix flipped this model — they give ISPs free hardware (Open Connect Appliances) in exchange for placing Netflix servers *inside* the ISP's own network. The ISP saves transit bandwidth costs; Netflix saves billions on egress fees. Everyone wins except third-party CDN vendors." }
\`\`\`

## Open Connect Architecture

\`\`\`sysdiag
{
  "title": "Open Connect: Three-Tier CDN",
  "width": 720,
  "height": 400,
  "nodes": [
    { "id": "origin", "label": "CDN Origin\\n(S3, ~500 PB)", "x": 360, "y": 40, "kind": "storage" },
    { "id": "steering", "label": "Steering\\nService", "x": 180, "y": 40, "kind": "service" },
    { "id": "ixp1", "label": "IXP Site\\n(~2 PB)", "x": 180, "y": 160, "kind": "service" },
    { "id": "ixp2", "label": "IXP Site\\n(~2 PB)", "x": 360, "y": 160, "kind": "service" },
    { "id": "ixp3", "label": "IXP Site\\n(~2 PB)", "x": 540, "y": 160, "kind": "service" },
    { "id": "oca1", "label": "OCA\\n(ISP A)", "x": 120, "y": 300, "kind": "server" },
    { "id": "oca2", "label": "OCA\\n(ISP B)", "x": 300, "y": 300, "kind": "server" },
    { "id": "oca3", "label": "OCA\\n(ISP C)", "x": 480, "y": 300, "kind": "server" },
    { "id": "oca4", "label": "OCA\\n(ISP D)", "x": 620, "y": 300, "kind": "server" }
  ],
  "edges": [
    { "from": "origin", "to": "ixp1", "label": "off-peak fill" },
    { "from": "origin", "to": "ixp2", "label": "off-peak fill" },
    { "from": "origin", "to": "ixp3", "label": "off-peak fill" },
    { "from": "ixp1", "to": "oca1", "label": "fill" },
    { "from": "ixp1", "to": "oca2", "label": "fill" },
    { "from": "ixp2", "to": "oca3", "label": "fill" },
    { "from": "ixp3", "to": "oca4", "label": "fill" },
    { "from": "steering", "to": "ixp1", "label": "routes clients" }
  ],
  "annotations": {
    "origin": "Complete catalog (~500 PB). Fallback for long-tail content. Backed by S3.",
    "ixp1": "~60 IXP sites globally. Stores top ~10,000 titles. 99% cache hit rate.",
    "oca1": "Open Connect Appliance embedded inside ISP data center. 100–200 TB storage, 100 Gbps NIC. Stores top ~3,000 titles for the region. 95% cache hit rate.",
    "steering": "Evaluates OCA availability, load, proximity, and historical throughput to return a ranked URL list to each client."
  }
}
\`\`\`

### The Open Connect Appliance (OCA)

Netflix provides ISPs with custom-built servers — **free of charge**. Here's what's inside each unit:

| Component | Spec |
|-----------|------|
| Storage | 100–200 TB (SSD + HDD) |
| Network | 100 Gbps NIC |
| CPU | Commodity x86 (TLS termination) |
| Software | FreeBSD + custom nginx |
| Cost to ISP | **$0** (Netflix bears ~$20K/unit) |

\`\`\`callout
{ "type": "info", "title": "Why ISPs Say Yes", "content": "Without an OCA, every Netflix stream crosses expensive transit links the ISP pays for. With an OCA, **95%+ of Netflix traffic stays inside the ISP's own network**, eliminating that transit cost entirely. The ISP gets free hardware and reduced bandwidth bills; Netflix gets ultra-low latency delivery and eliminates third-party CDN fees." }
\`\`\`

## Content Placement Strategy

OCAs don't store everything — storage is finite at 100–200 TB per appliance. Netflix applies a **popularity-based tiered cache** strategy:

\`\`\`tabs
{ "tabs": [
  {
    "label": "Tier 1 — ISP OCA",
    "icon": "🏠",
    "content": "**Capacity:** ~100–200 TB per appliance\\n\\n**Stores:** Top ~3,000 titles for that region\\n\\n**Hit rate:** ~95% of viewing hours\\n\\n**Placement:** Inside ISP data center — physically closest to end users\\n\\nThe long tail of obscure titles is *not* here. But because the top 3,000 titles account for 95% of watch time, most requests never leave the ISP's network."
  },
  {
    "label": "Tier 2 — IXP Sites",
    "icon": "🌐",
    "content": "**Capacity:** ~2 PB per site\\n\\n**Stores:** Top ~10,000 titles for the region\\n\\n**Hit rate:** ~99% of viewing hours\\n\\n**Placement:** ~60 Internet Exchange Points globally\\n\\nIXP sites handle overflow from Tier 1 — content that's popular regionally but not popular enough to cache at every ISP. Also serves as the fill source for nearby OCAs."
  },
  {
    "label": "Tier 3 — CDN Origin",
    "icon": "🗄️",
    "content": "**Capacity:** ~500 PB (backed by S3)\\n\\n**Stores:** Complete catalog — every title, every encoding variant\\n\\n**Hit rate:** N/A — this is the fallback\\n\\n**Placement:** Netflix's own data centers\\n\\nThe origin is the source of truth. It's only hit for content that missed at both Tier 1 and Tier 2 — i.e., long-tail content that almost nobody streams, or brand-new releases not yet propagated to edge caches."
  }
]}
\`\`\`

### Proactive Cache Fill

Netflix doesn't wait for users to request content before caching it. The fill process runs **proactively during off-peak hours**:

\`\`\`steps
{ "title": "Nightly Cache Fill Process", "steps": [
  { "title": "Predict Tomorrow's Demand", "content": "The Steering Service analyzes viewing patterns and predicts which titles will be popular in each region tomorrow. New releases, trending content, and regional favorites are prioritized." },
  { "title": "Push Content Overnight (2AM–8AM local)", "content": "Popular titles are pushed from the CDN Origin → IXP Sites → ISP OCAs during low-traffic hours. This avoids competing with live playback requests and maximizes network efficiency." },
  { "title": "OCAs Report Status", "content": "Each OCA continuously reports its storage utilization and per-title cache hit ratios back to the Steering Service. This feedback loop informs future placement decisions." },
  { "title": "Evict Low-Hit Content", "content": "When an OCA is at capacity and new content needs to be stored, the lowest-hit-rate titles are evicted. Popular content self-reinforces its position in Tier 1; unpopular content naturally migrates down to Tier 2 or Tier 3." }
]}
\`\`\`

## Client Steering: How Does the Player Know Where to Connect?

When a user presses play, the player doesn't guess which server to use. The Steering Service makes that decision dynamically:

\`\`\`trace
{ "title": "Client Steering Flow — Pressing Play", "language": "python", "code": "# Step 1: Client requests playback\\nclient.request('play', title_id='stranger-things-s4e1')\\n\\n# Step 2: Steering Service evaluates candidates\\ncandidates = steering.find_ocas(\\n    title_id='stranger-things-s4e1',\\n    client_isp='Comcast-US-East',\\n    client_ip='98.x.x.x'\\n)\\n\\n# Step 3: Rank by: has content + proximity + load + historical throughput\\nranked = steering.rank(\\n    candidates,\\n    factors=['cache_hit', 'geo_proximity', 'current_load', 'throughput_history']\\n)\\n\\n# Step 4: Return ordered URL list to client\\nurls = [\\n    'https://oca1.comcast.nflxvideo.net/s4e1/',   # ISP OCA — best\\n    'https://ixp-east.nflxvideo.net/s4e1/',        # IXP fallback\\n    'https://origin.nflxvideo.net/s4e1/'           # Origin fallback\\n]\\n\\n# Step 5: Client tries URLs in order, falls back on failure\\nstream = client.connect(urls[0])", "frames": [
  { "line": 2, "vars": { "title_id": "stranger-things-s4e1" }, "note": "Client sends title ID and geographic info to Netflix API" },
  { "line": 5, "vars": { "candidates": "[ oca1-comcast, oca2-comcast, ixp-east, origin ]" }, "note": "Steering Service finds all OCAs that have this title cached" },
  { "line": 11, "vars": { "ranked": "[ oca1-comcast(score=0.97), ixp-east(score=0.82), origin(score=0.30) ]" }, "note": "Ranks by composite score: cache availability + proximity + current load + past throughput to this ISP" },
  { "line": 17, "vars": { "urls": "[ oca1, ixp-east, origin ]" }, "note": "Returns ordered URL list — client tries them top-to-bottom" },
  { "line": 24, "vars": { "stream": "connected to oca1-comcast" }, "note": "Client connects to best OCA; automatic fallback if the connection degrades mid-stream" }
], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why Not DNS-Based Steering?", "content": "Traditional CDNs use DNS to route users — a DNS lookup returns the IP of the closest edge server. Netflix uses **server-side ranked lists** instead because DNS is coarse (single IP, no fallback list) and can't incorporate real-time load data. Netflix's approach returns an ordered list of 3+ URLs, enabling the player to fall back automatically mid-session if an OCA becomes overloaded — without any DNS round-trip." }
\`\`\`

## Scale at a Glance

| Metric | Number |
|--------|--------|
| Open Connect Appliances | ~18,000 servers |
| ISP partners | ~1,600 worldwide |
| IXP sites | ~60 locations |
| Total CDN capacity | ~500 PB |
| Peak serving bandwidth | ~50 Tbps |
| Cache hit rate (ISP OCA) | ~95% |
| Cache hit rate (IXP) | ~99% |
| Bandwidth cost savings vs. third-party CDN | ~90% |

## Architecture Trade-offs

| Decision | Netflix's Choice | Alternative | Rationale |
|----------|-----------------|-------------|-----------|
| CDN ownership | Custom (Open Connect) | Akamai / CloudFront | Billions saved annually at 50 Tbps scale |
| Cache placement | Popularity-based tiered | Full replication everywhere | OCA storage is physically finite at 100–200 TB |
| Fill timing | Proactive overnight push | On-demand pull | Eliminates cache misses during peak viewing; shifts network load to off-peak |
| Client steering | Server-side ranked URL list | DNS-based routing | Per-session optimization, real-time load awareness, built-in fallback |
| OCA hardware | Commodity x86 + SSD | Proprietary appliance | Low unit cost (~$20K), easy replacement, no vendor lock-in |

\`\`\`quiz
{ "title": "CDN Architecture — Check Your Understanding", "questions": [
  {
    "question": "Why do ISPs agree to host Netflix's Open Connect Appliances for free?",
    "options": [
      "Netflix pays ISPs a monthly licensing fee for the rack space",
      "The OCA keeps Netflix traffic local, eliminating the ISP's expensive transit bandwidth costs",
      "ISPs are legally required to host content from large streaming providers",
      "Netflix shares ad revenue with ISPs that deploy OCAs"
    ],
    "answer": 1,
    "explanation": "Without an OCA, every Netflix stream crosses expensive transit links the ISP must pay for. With an OCA embedded in their network, 95%+ of Netflix traffic stays local — dramatically reducing the ISP's transit costs. The hardware is free to the ISP, making this a win-win."
  },
  {
    "question": "A user in Chicago streams a newly released documentary that launched 2 hours ago. Which tier is most likely to serve the request?",
    "options": [
      "Tier 1 — ISP OCA, since it has the highest hit rate",
      "Tier 2 — IXP Site, since the overnight fill hasn't run yet",
      "Tier 3 — CDN Origin, since new content won't be in edge caches yet",
      "It depends entirely on the user's ISP bandwidth"
    ],
    "answer": 2,
    "explanation": "OCA cache fill runs proactively *overnight* (2AM–8AM local). A brand-new release won't be in ISP OCAs yet. IXP sites are larger (~2 PB) and are updated more frequently, so popular new content likely appears there first. For truly just-launched content, the Origin (Tier 3) is the fallback — the Steering Service will route accordingly and begin propagating the content downstream for future requests."
  },
  {
    "question": "Netflix uses server-side ranked URL lists for client steering rather than DNS-based routing. What is the primary advantage?",
    "options": [
      "DNS is only available to mobile clients, not smart TVs",
      "The ranked list includes real-time OCA load and historical throughput, enabling per-session optimization and automatic fallback",
      "DNS requires an extra network hop, while ranked lists are served inline with the metadata response",
      "Server-side steering allows Netflix to charge ISPs for premium placement"
    ],
    "answer": 1,
    "explanation": "DNS-based routing returns a single IP and can't incorporate real-time load data or provide fallback URLs. Netflix's Steering Service returns an *ordered list* of 3+ OCA URLs, incorporating cache availability, geographic proximity, current server load, and historical throughput for that specific ISP↔OCA pair. If the first URL degrades mid-stream, the player automatically tries the next one."
  },
  {
    "question": "An ISP OCA stores ~100–200 TB of content. The top 3,000 titles for a region cover ~95% of viewing hours. What happens when a user requests a title *not* in the top 3,000?",
    "options": [
      "Playback fails — OCA-only content is all that Netflix supports",
      "The Steering Service routes the client to an IXP site or the CDN Origin",
      "The OCA fetches the content from Origin and permanently adds it to its cache",
      "The user is prompted to download the content for offline viewing"
    ],
    "answer": 1,
    "explanation": "The Steering Service always returns a ranked list of URLs across all three tiers. Long-tail content not cached at the ISP OCA (Tier 1) will be served from an IXP site (Tier 2, ~99% hit rate) or ultimately from the CDN Origin (Tier 3, complete catalog). The client falls back through the list transparently — the user never sees a failure."
  }
]}
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Open Connect is Netflix's custom CDN: ~18,000 appliances embedded inside ~1,600 ISPs worldwide, delivering ~50 Tbps at peak with ~90% cost savings vs. third-party CDN.",
  "ISPs accept OCAs because they keep Netflix traffic local, eliminating expensive transit bandwidth costs — the hardware is free to the ISP.",
  "Content placement is popularity-based across three tiers: ISP OCA (95% hit, top 3,000 titles) → IXP sites (99% hit, top 10,000 titles) → CDN Origin (100% coverage, complete catalog).",
  "OCAs are filled proactively overnight using demand predictions — this eliminates cache misses at peak viewing time by pre-positioning content before users request it.",
  "Client steering uses a server-side ranked URL list (not DNS) to route each session to the optimal OCA, incorporating real-time load, proximity, and historical throughput data."
]}
\`\`\``,
    },
    {
      id: "netflix-adaptive-bitrate",
      slug: "netflix-adaptive-bitrate",
      title: "Adaptive Bitrate Streaming",
      content: `# Netflix: Adaptive Bitrate Streaming

## The Problem

Users watch Netflix on everything from a 4K TV on gigabit fiber to a phone on congested 3G. Network conditions change mid-stream — a user on WiFi walks out of range, bandwidth drops instantly, and the video must adapt without buffering.

The naive approach — "measure bandwidth, pick matching quality" — fails immediately. Bandwidth fluctuates by an order of magnitude in seconds. You need something fundamentally more stable.

\`\`\`concept
{ "title": "ABR: The Adaptive Buffer Mental Model", "variant": "mental-model", "content": "Think of ABR like a highway driver choosing speed based on traffic ahead — not just the speedometer reading this second. Video is pre-sliced into small segments (2–4 seconds each), each pre-encoded at multiple quality levels. The player downloads one segment at a time, choosing quality based on both current bandwidth AND how full its buffer is. Buffer draining fast → drop quality immediately. Buffer filling comfortably → cautiously raise it." }
\`\`\`

## How ABR Works

Every title stored on Netflix's Open Connect Appliances (OCAs) is split into **segments** — typically 4 seconds each. Each segment is pre-encoded at every supported quality level. The client maintains a playback buffer (a 30–40 second window of pre-downloaded video) and adjusts which quality tier it downloads next, one segment at a time.

The following visualization traces how the buffer level drives quality decisions as network conditions shift:

\`\`\`algoviz
{ "title": "Quality Selection Across Segments (Buffer-Based ABR)", "type": "array", "data": [1, 4, 4, 4, 2, 1, 2, 3, 4], "frames": [ { "highlight": [0], "label": "Startup: lowest quality for fastest first frame (480p)", "stats": { "buffer": "0s", "quality": "480p" } }, { "highlight": [1], "label": "Ramp-up: 18 Mbps measured → jump to 4K", "stats": { "buffer": "4s", "bandwidth": "18 Mbps", "quality": "4K" } }, { "highlight": [2], "label": "Stable: buffer filling, bandwidth holds → stay at 4K", "stats": { "buffer": "12s", "bandwidth": "16 Mbps", "quality": "4K" } }, { "highlight": [3], "label": "Stable: buffer = 24s, comfortably above 4K threshold", "stats": { "buffer": "24s", "bandwidth": "14 Mbps", "quality": "4K" } }, { "highlight": [4], "label": "Network drop: bandwidth falls to 4 Mbps → switch to 720p", "stats": { "buffer": "18s", "bandwidth": "4 Mbps", "quality": "720p" } }, { "highlight": [5], "label": "Congestion: buffer at 8s (danger zone) → emergency drop to 480p", "stats": { "buffer": "8s", "bandwidth": "1.5 Mbps", "quality": "480p" } }, { "highlight": [6], "label": "Recovery: buffer rebuilding → cautiously step up to 720p", "stats": { "buffer": "14s", "bandwidth": "5 Mbps", "quality": "720p" } }, { "highlight": [7], "label": "Stabilized: buffer at 22s → move up to 1080p", "stats": { "buffer": "22s", "bandwidth": "8 Mbps", "quality": "1080p" } }, { "highlight": [8], "label": "Optimal: buffer 32s, 14 Mbps sustained → back to 4K", "stats": { "buffer": "32s", "bandwidth": "14 Mbps", "quality": "4K" } } ], "speed": 900 }
\`\`\`

Notice the asymmetry: quality **drops immediately** when the buffer drains, but **climbs conservatively** during recovery. This prevents the oscillation users would notice with a symmetric algorithm.

## Streaming Protocols: DASH and HLS

Two protocols dominate ABR delivery. Netflix uses both, split by device ecosystem.

\`\`\`tabs
{ "tabs": [ { "label": "DASH", "icon": "📦", "content": "**MPEG-DASH** (ISO/IEC 23009) is used for Android, Smart TVs, and browsers.\\n\\nThe player fetches a **manifest** (\`.mpd\`, XML) listing every quality representation:\\n\\n- \`AdaptationSet: Video\` — one entry per quality (4K 16 Mbps, 1080p 5 Mbps, 480p 1.5 Mbps...)\\n- \`AdaptationSet: Audio\` — surround vs. stereo, per language\\n- Each \`Representation\` points to numbered segment files: \`seg-00001.m4s\`, \`seg-00002.m4s\`...\\n\\nSegments are stored as \`.m4s\` (fragmented MP4). DRM: **Widevine** (Android/Chrome) or **PlayReady** (Windows)." }, { "label": "HLS", "icon": "🍎", "content": "**HLS** (HTTP Live Streaming) is Apple's protocol, required for iOS, macOS, and Safari.\\n\\nConceptually identical to DASH, different wire format:\\n- Manifest: \`.m3u8\` (plain-text playlist)\\n- Segments: \`.ts\` (MPEG Transport Stream) or \`.fmp4\`\\n- DRM: **FairPlay** (Apple ecosystem only)\\n\\nA master playlist points to one variant playlist per quality level. Each variant playlist lists the segment URLs for that tier." }, { "label": "Side-by-Side", "icon": "⚖️", "content": "| Feature | DASH | HLS |\\n|---------|------|-----|\\n| Standard | ISO/MPEG | Apple proprietary |\\n| Manifest format | \`.mpd\` (XML) | \`.m3u8\` (text) |\\n| Segment format | \`.m4s\` (fMP4) | \`.ts\` or \`.fmp4\` |\\n| Primary devices | Android, Smart TVs, browsers | iOS, macOS, Safari |\\n| DRM system | Widevine / PlayReady | FairPlay |\\n\\nBoth run over plain HTTP — CDN caching works identically for each. Netflix serves DASH to most devices and HLS to the Apple ecosystem." } ] }
\`\`\`

## The ABR Algorithm: Naive vs. Buffer-Based

Pure bandwidth estimation is the obvious approach — and the broken one. Bandwidth fluctuates by 10× in seconds; a single fast measurement triggers 4K selection, the next measurement shows congestion, and the player buffers. Netflix's buffer-based approach uses buffer level as the primary signal instead.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive: Pure Bandwidth Estimation", "code": "# Measure bandwidth from the last segment\\nbandwidth = segment_bytes / download_time\\n# e.g., 2 MB / 0.1s = 20 MB/s → select 4K\\n\\nfor quality in sorted(QUALITIES, reverse=True):\\n    if quality.bitrate <= bandwidth * 0.8:\\n        return quality\\n\\n# FAILURE MODE:\\n# One fast burst   → selects 4K\\n# Next 4s window   → bandwidth drops → rebuffer\\n# Algorithm then   → drops to 480p\\n# Then bounces:    4K → 480p → 4K → 480p (oscillation)" }, "after": { "label": "Netflix: Buffer-Based ABR", "code": "buffer_seconds = player.buffer_level()\\n\\n# Buffer level drives the quality decision\\nif buffer_seconds < 10:    # danger zone\\n    return QUALITY_480p\\nelif buffer_seconds < 20:  # cautious\\n    return QUALITY_720p\\nelif buffer_seconds < 30:  # comfortable\\n    return QUALITY_1080p\\nelse:                       # optimal\\n    return QUALITY_4K\\n\\n# WHY IT WORKS:\\n# Buffer integrates bandwidth over many seconds\\n# Short spikes / dips are naturally smoothed\\n# Result: fewer visible switches, no oscillation" } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The Buffer as a Low-Pass Filter", "content": "A 2-second bandwidth spike barely moves a 30-second buffer. A sustained bandwidth drop drains the buffer slowly, giving the algorithm time to respond proportionally rather than panic-dropping to 480p on every fluctuation. Stability wins over reactivity." }
\`\`\`

## Startup Optimization

Cold start is the hardest case — no buffer, no bandwidth measurement, and users expect video in under 2 seconds. Netflix optimizes this sequence explicitly.

\`\`\`steps
{ "title": "Netflix Cold-Start Sequence", "steps": [ { "title": "Begin at Lowest Quality", "content": "Download the very first segment at the lowest available bitrate (e.g., 480p, ~0.75 MB). This minimizes time to first frame — playback can begin before even a single megabyte has arrived." }, { "title": "Prefetch Segments While UI Loads", "content": "The first 2 segments are prefetched in the background while the loading animation plays. By the time the user hits play, video is already buffered and rendering is instant." }, { "title": "Aggressive Ramp-Up (First ~30 Seconds)", "content": "The algorithm temporarily ignores its normal conservative thresholds and climbs quality aggressively — jumping multiple tiers per segment if bandwidth allows. Getting to good quality fast is worth the risk during early playback." }, { "title": "Switch to Conservative Buffer-Based Mode", "content": "Once the buffer reaches ~20 seconds, the algorithm transitions to standard buffer-based ABR: slow ramp-up, immediate drop-down on buffer drain. This phase runs for the rest of the stream." } ] }
\`\`\`

Target: **playback starts in under 2 seconds on broadband**. Per-title pre-encoding (all quality levels ready before any user requests) is what makes this possible.

## Segment Architecture

Every title stored on OCAs follows a predictable directory structure, with codec initialization segments stored separately from media segments:

\`\`\`
/stranger-things-s4e1/
├── manifest.mpd
├── video/
│   ├── 4k-hevc/
│   │   ├── init.m4s           (codec initialization — fetched once)
│   │   ├── seg-00001.m4s      (4 seconds, ~8 MB)
│   │   ├── seg-00002.m4s
│   │   └── ...
│   ├── 1080p-h264/
│   │   ├── init.m4s
│   │   └── seg-00001.m4s      (4 seconds, ~2.5 MB)
│   └── 480p-h264/
│       └── seg-00001.m4s      (4 seconds, ~0.75 MB)
├── audio/
│   ├── en-5.1/
│   └── en-stereo/
└── subtitles/
    ├── en.vtt
    └── es.vtt
\`\`\`

Audio and video tracks are stored separately — the player downloads them independently and muxes them on the client side, which lets you switch audio language without re-downloading video.

## Scale Numbers

| Metric | Value |
|--------|-------|
| Segments per 90-min title | ~1,350 (90 min ÷ 4s) |
| Quality streams per title | ~18 (6 video × 3 audio) |
| Total segment files per title | ~24,300 |
| Segment requests/second at peak | ~2.5M (10M concurrent streams ÷ 4s) |
| Average segment size | ~2 MB |
| HD stream bitrate | ~3–5 Mbps |
| 4K stream bitrate | ~15–25 Mbps |
| Total throughput at 10M concurrent HD streams | ~50 Tbps |

50 terabits per second of global throughput — this is why CDN placement (covered in the previous lesson) is non-negotiable. No origin server cluster handles this directly.

## Design Trade-offs

| Decision | Netflix's Choice | Rationale |
|----------|-----------------|-----------|
| Segment duration | 4 seconds | Shorter = faster adaptation, but more HTTP requests per stream-hour |
| ABR algorithm | Buffer-based | Stable; far fewer visible switches than bandwidth-only |
| Startup quality | Lowest available | Minimizes time to first frame, even at cost of initial quality |
| Quality ramp-up | Gradual (conservative) | Users notice drops more than slow climbs |
| Protocol | DASH + HLS | No single protocol covers Android + Apple + browsers |

\`\`\`quiz
{ "title": "Adaptive Bitrate Streaming", "questions": [ { "question": "Why does Netflix's buffer-based ABR outperform pure bandwidth estimation in practice?", "options": ["It uses ML to predict future bandwidth drops 30 seconds ahead", "The buffer integrates bandwidth over time, smoothing out short-term fluctuations", "It downloads multiple quality levels simultaneously and picks the best", "It samples 10 consecutive segments before committing to a quality decision"], "answer": 1, "explanation": "The buffer acts as a low-pass filter on bandwidth. A momentary 2-second bandwidth spike barely moves a 30-second buffer, so the algorithm avoids switching to 4K on a burst. Only sustained high bandwidth causes a quality increase — preventing the 4K → 480p → 4K oscillation that naive estimation causes." }, { "question": "A 90-minute Netflix title is encoded at 6 video quality levels × 3 audio streams with 4-second segments. Approximately how many total segment files exist for that title?", "options": ["~1,350", "~8,100", "~24,300", "~54,000"], "answer": 2, "explanation": "90 min × 60s ÷ 4s = 1,350 segments per stream. 1,350 × (6 video + 3 audio) streams = 12,150 in a minimal count, but with init segments and multiple audio language variants the total reaches ~24,300. The key insight: pre-encoding multiplies storage by the number of quality levels." }, { "question": "During Netflix's startup sequence, why is the first segment always downloaded at the lowest available quality?", "options": ["Lower quality segments get higher CDN cache priority", "To minimize time to first frame — playback starts before much data arrives", "The ABR algorithm must observe 3 segments before selecting a higher quality tier", "Lower bitrate segments are decoded faster by mobile processors"], "answer": 1, "explanation": "At cold start there is no buffer and no bandwidth measurement. The smallest possible first segment (480p, ~0.75 MB) lets playback begin in under 2 seconds on broadband. Quality then ramps aggressively over the first ~30 seconds as the buffer fills." }, { "question": "Netflix uses both DASH and HLS. What primarily determines which protocol a device receives?", "options": ["The user's subscription tier (Free vs. Pro)", "The device's operating system and DRM capabilities", "The user's measured network speed at session start", "Whether the content is a movie versus a TV series"], "answer": 1, "explanation": "DASH with Widevine/PlayReady DRM serves Android, Smart TVs, and browsers. HLS with FairPlay DRM serves iOS, macOS, and Safari. The split is driven by Apple requiring FairPlay — which only works with HLS. Both protocols are otherwise functionally equivalent from a CDN delivery perspective." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "ABR pre-encodes each 4-second segment at every quality level; the client picks quality per segment based on current buffer level, not instantaneous bandwidth.", "Buffer-based ABR is more stable than bandwidth-only: the buffer smooths fluctuations and prevents the 4K → 480p → 4K oscillation that naive estimation causes.", "Netflix serves DASH (Widevine/PlayReady) to most devices and HLS (FairPlay) to the Apple ecosystem — both run over HTTP, so CDN caching works identically for each.", "Startup optimization prioritizes time to first frame: begin at lowest quality, prefetch early, ramp aggressively for ~30 seconds, then switch to conservative buffer-based mode.", "A 90-min title generates ~24,300 segment files; at peak, 10M concurrent HD streams require ~2.5M HTTP segment requests per second and ~50 Tbps of global throughput." ] }
\`\`\``,
    },
    {
      id: "netflix-recommendation-integration",
      slug: "netflix-recommendation-integration",
      title: "Recommendation Integration",
      content: `# Netflix: Recommendation Integration

Netflix estimates that its recommendation system saves **$1 billion per year** in reduced churn. If users cannot find something to watch within 60–90 seconds, they leave. 80% of content watched on Netflix is discovered through recommendations, not search. This means recommendations aren't a nice-to-have feature — they are the core product.

\`\`\`concept
{ "title": "The 90-Second Rule", "variant": "insight", "content": "Netflix's homepage has one job: surface the right title within 90 seconds. Every architectural decision in the recommendation system — two-stage ranking, feature stores, row selection — exists to solve this constraint at scale. The recommendation engine is effectively a real-time, personalized search over 17,000 titles run for 100 million sessions per day." }
\`\`\`

## Recommendation Architecture

The system has two distinct planes: an **online serving layer** that answers requests in milliseconds, and an **offline training pipeline** that retrains models daily on petabytes of interaction data.

\`\`\`mermaid
flowchart TB
    subgraph Online["Online Serving Layer (< 200ms)"]
        HP[Homepage Ranker]
        SE[Search & Explore]
        BW["Because You Watched"]
        FS[(Feature Store\\nRedis / Cassandra)]
        HP --> FS
        SE --> FS
        BW --> FS
    end

    subgraph Offline["Offline Training Pipeline (daily batch)"]
        KF[Kafka\\nUser Events]
        SP[Spark + TensorFlow\\nModel Training]
        FC[Feature Computation\\n& Store Refresh]
        KF --> SP --> FC --> FS
    end
\`\`\`

The feature store is the bridge between the two planes. Features computed overnight (genre affinities, taste cluster memberships, watch patterns) are materialized into Redis so the online ranker can look them up at < 5ms p99.

## Two-Stage Ranking

Ranking every one of 17,000 titles for every user on every page load is computationally infeasible. Netflix solves this with a classic **candidate generation → ranking** pipeline.

\`\`\`concept
{ "title": "Funnel Architecture", "variant": "analogy", "content": "Think of it like hiring: a recruiter (candidate generation) screens thousands of résumés down to a shortlist of ~50, then a senior engineer (deep ranker) interviews those 50 carefully. The recruiter is fast and approximate; the interviewer is slow and precise. You'd never have the senior engineer read every résumé — or have the recruiter make the final call." }
\`\`\`

\`\`\`steps
{ "title": "The Two-Stage Ranking Pipeline", "steps": [ { "title": "Stage 1 — Candidate Generation (17,000 → ~1,000 titles)", "content": "Multiple fast retrieval algorithms run in parallel, each producing a list of candidates:\\n\\n- **Collaborative filtering** — \\"Users like you watched X\\" via matrix factorization (~200ms for 1,000 candidates)\\n- **Content-based** — genre, actor, director embeddings similar to your watch history\\n- **Trending** — popular titles in your region this week\\n- **New releases** — recently added to the catalog\\n- **Editorial** — curated rows (e.g., Award Winners)\\n\\nThe union of all sources produces ~1,000 unique candidates." }, { "title": "Stage 2 — Personalized Ranking (1,000 → ordered list)", "content": "A deep learning model scores every (user, title) pair. The output is a probability:\\n\\n\`\`\`\\nP(watch | user, title, context) ∈ [0, 1]\\n\`\`\`\\n\\nThis score determines the final ordering within each row on the homepage." }, { "title": "Stage 3 — Page Assembly (~40 rows selected)", "content": "A **page-level algorithm** picks and orders the ~40 most relevant rows from a pool of ~10,000 possible row types. Row types include:\\n- \\"Because you watched [X]\\" (one per recently-watched title)\\n- Genre rows (\\"Sci-Fi Movies\\", \\"Stand-Up Comedy\\")\\n- Mood rows (\\"Feel-Good\\", \\"Suspenseful\\")\\n- Trending, Popular, New Releases\\n\\nThe page algorithm ranks rows by predicted engagement for this user at this exact time." } ] }
\`\`\`

## Feature Engineering

The quality of the ranker depends entirely on the richness of features fed into it. Netflix groups features into three buckets:

\`\`\`tabs
{ "tabs": [ { "label": "User Features", "icon": "👤", "content": "Signals that describe the individual viewer:\\n\\n| Feature | Description |\\n|---|---|\\n| Watch history | Last 100 titles watched |\\n| Genre affinity scores | Computed nightly from interaction logs |\\n| Time-of-day patterns | Morning news vs. late-night comedy |\\n| Device type | Mobile vs. TV affects content preference |\\n| Taste cluster | Which of ~1,000 \\"taste communities\\" you belong to |\\n\\nThese are precomputed offline and stored in the feature store for sub-5ms lookup." }, { "label": "Title Features", "icon": "🎬", "content": "Signals that describe the content itself:\\n\\n| Feature | Description |\\n|---|---|\\n| Genre, tags, cast, director | Categorical metadata |\\n| Visual similarity embeddings | Derived from scene frames |\\n| Popularity score | Global + regional watch counts |\\n| Freshness | Days since added to catalog |\\n\\nTitle features are largely static and cached aggressively." }, { "label": "Context Features", "icon": "🕐", "content": "Signals that describe *when and how* the user is browsing:\\n\\n| Feature | Description |\\n|---|---|\\n| Day of week, time of day | Friday night ≠ Tuesday morning |\\n| Current row position on page | Title at position 1 vs. position 8 |\\n| Session depth | How long the user has been browsing |\\n\\nContext features are generated at request time — they cannot be precomputed." } ] }
\`\`\`

## The Netflix Homepage: Row Layout

The homepage is a grid of rows, each driven by a different recommendation signal. For User 123, it might look like:

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
│ [Title X] [Title Y] [Title Z]            │
├──────────────────────────────────────────┤
│ Award-Winning Dramas                     │
│ [Title P] [Title Q] [Title R]            │
└──────────────────────────────────────────┘
\`\`\`

Netflix maintains a pool of ~10,000 possible row types. The page algorithm selects the 40 most relevant rows for each user at session time, then orders them. Row ordering is itself a ranking problem — it uses the same feature signals (user, content, context) to predict which row will produce the first engagement.

## Artwork Personalization

Netflix even personalizes the **thumbnail image** shown for each title. The same movie shows different artwork to different users:

- A user who watches comedies → sees a funny scene thumbnail
- A user who watches romance → sees a romantic scene thumbnail
- A user who likes a specific actor → sees that actor's face prominently

\`\`\`callout
{ "type": "success", "title": "A/B Test Result", "content": "Personalized artwork has been shown to increase click-through rate by ~20–30% compared to a single generic thumbnail for all users. The artwork model is trained separately from the ranking model, using image embeddings and user preference signals." }
\`\`\`

## Online vs. Offline: The Split

Every component is assigned to either online (real-time) or offline (batch) based on latency constraints and data freshness requirements:

| Component | Online (real-time) | Offline (batch) |
|---|---|---|
| Model inference | < 200ms per page | — |
| Model training | — | Daily retrain on Spark cluster |
| Feature computation | Lookup from cache (Redis) | Computed nightly from event logs |
| A/B testing | Real-time user assignment | Analyzed after 2–4 weeks |

\`\`\`callout
{ "type": "warning", "title": "The Staleness Tradeoff", "content": "Features computed nightly can be 24 hours stale. If a user watches 10 episodes of a new show in one session, their genre affinity scores won't update until the next nightly batch. Netflix compensates by adding recent watch history as a real-time session feature fed directly to the ranker — a hybrid approach that blends fresh signals with precomputed ones." }
\`\`\`

## Scale Numbers

\`\`\`
Homepage requests:     ~100M/day (one per session start)
Row ranking calls:     ~100M × 40 rows = 4B ranking operations/day
Feature store reads:   ~50K/s (Redis, p99 < 5ms)
Model inference:       ~200ms per page (GPU inference cluster)
Model retraining:      Daily on ~1 PB of interaction data
A/B tests running:     ~200 concurrent experiments
\`\`\`

The 4 billion ranking operations per day — while large — become manageable because Stage 1 candidate generation reduces the problem from scoring 17,000 titles to scoring ~1,000 titles per request.

\`\`\`quiz
{ "title": "Recommendation System Concepts", "questions": [ { "question": "Why does Netflix use a two-stage candidate generation + ranking pipeline instead of running the deep ranker over the full 17,000-title catalog?", "options": [ "The deep ranker only works on small datasets", "Running a deep model over 17,000 titles per user per page load is computationally infeasible at 100M daily sessions", "The candidate generator is more accurate than the deep ranker", "Netflix only has 1,000 titles available in each region" ], "answer": 1, "explanation": "Running a neural ranker over all 17,000 titles × 100M daily sessions = 1.7 trillion inference operations per day. The two-stage funnel narrows candidates to ~1,000 first, making deep ranking tractable (~4B operations/day instead)." }, { "question": "What is the primary role of the Feature Store (Redis/Cassandra) in Netflix's recommendation architecture?", "options": [ "It stores the trained ML model weights", "It serves as the bridge between offline batch computation and online real-time serving", "It logs user interaction events for Kafka", "It caches video segments for faster streaming" ], "answer": 1, "explanation": "The feature store materializes features computed in the offline pipeline (nightly batch on Spark) so the online serving layer can retrieve them at sub-5ms latency. It decouples computation (offline) from serving (online)." }, { "question": "Netflix has ~10,000 possible row types. How does it decide which ~40 rows to show a specific user?", "options": [ "Rows are selected randomly and then A/B tested", "A page-level algorithm ranks rows by predicted engagement for that user at that time", "Rows are always shown in the same fixed order across all users", "The user manually configures their preferred row types in settings" ], "answer": 1, "explanation": "Row selection is itself a ranking problem. A page-level algorithm uses user, content, and context features to predict which row types will drive engagement for this specific user in this specific session, then selects and orders the top ~40." }, { "question": "Which feature type CANNOT be precomputed and must be generated at request time?", "options": [ "Genre affinity scores", "Title popularity score", "Current row position on the page and session depth", "Watch history of the last 100 titles" ], "answer": 2, "explanation": "Context features like 'current row position on page' and 'session depth' describe the real-time browsing state — they only exist at request time and cannot be computed in advance. User and title features are precomputed nightly and cached in the feature store." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "80% of Netflix content is discovered via recommendations — it is the core product, not a secondary feature", "Two-stage ranking (candidate generation → deep ranker) makes neural ranking feasible: 17,000 titles → 1,000 candidates → ranked list at < 200ms", "The Feature Store (Redis/Cassandra) bridges offline batch computation and online real-time serving, with p99 reads under 5ms", "Context features (time of day, session depth, row position) are generated at request time and differentiate recommendations for the same user across sessions", "Even thumbnail artwork is personalized per user — A/B tests show a 20–30% CTR lift over generic images", "Netflix runs ~200 concurrent A/B experiments, with results analyzed over 2–4 weeks — recommendation systems are never 'done'" ] }
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
