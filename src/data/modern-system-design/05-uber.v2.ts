import { Module } from "../types";

export const uberModule: Module = {
  id: "design-uber",
  title: "Design Uber",
  description: "Design a ride-sharing platform: geospatial indexing, real-time matching, dynamic pricing, and ETA prediction at global scale.",
  lessons: [
    {
      id: "uber-requirements-scale",
      slug: "uber-requirements-scale",
      title: "Requirements & Scale",
      content: `# Design Uber: Requirements & Scale

When you tap "Request", Uber resolves a match and returns a driver's name, photo, and ETA in roughly one to three seconds. That interaction hides one of the largest real-time control systems ever built — geospatial indexing over millions of moving nodes, sub-second ingestion of GPS streams, hard consistency on driver assignment, and global distribution across 10,000+ cities. Before designing any subsystem, we need to understand the functional scope, the non-negotiable performance targets, and — critically — the numbers that define every architecture decision downstream.

\`\`\`concept
{ "title": "The Core Difficulty: Four Hard Problems at Once", "variant": "mental-model", "content": "Uber is not a maps app with payments bolted on. The difficulty is the intersection: geospatial (find nearby drivers in milliseconds), real-time (process 625K GPS updates per second continuously), consistency (a driver must never be double-booked), and scale (operate across 10M+ concurrent users). Each of these is solvable in isolation. Doing all four simultaneously under hard latency SLOs — and surviving regional failures — is what makes Uber's architecture a canonical system design challenge." }
\`\`\`

## Functional Requirements

\`\`\`tabs
{ "tabs": [ { "label": "Rider & Driver Features", "icon": "🚗", "content": "**1. Rider requests a ride** — Specify pickup and dropoff locations\\n\\n**2. Driver matching** — Match the rider with the best available driver nearby\\n\\n**3. Real-time tracking** — Both rider and driver see each other's live position on a map\\n\\n**4. ETA calculation** — Estimated pickup time and estimated arrival at destination\\n\\n**5. Dynamic pricing** — Surge multiplier when demand exceeds supply in a geofenced zone\\n\\n**6. Trip management** — State machine: requested → dispatched → en route → completed\\n\\n**7. Payments** — Charge rider, disburse to driver, support tips\\n\\n**8. Ratings** — Bidirectional rating after each trip; feeds driver ranking in the matching engine" }, { "label": "Non-Functional Requirements", "icon": "⚡", "content": "| Requirement | Target | Why It Matters |\\n|---|---|---|\\n| **Availability** | 99.99% (~52 min/year) | Downtime = stranded riders, direct revenue loss |\\n| **Matching latency** | < 10 seconds end-to-end | Conversion drops sharply beyond this threshold |\\n| **Location freshness** | < 1 second on map | Stale driver positions break the core UX |\\n| **Consistency** | Strict on driver assignment | A driver must never be matched to two riders simultaneously |\\n| **Scalability** | 10M+ concurrent users | Operates across 10,000+ cities worldwide |" }, { "label": "Out of Scope", "icon": "🚫", "content": "Explicitly excluded to keep the design focused:\\n\\n- **Carpooling / shared rides** — multi-rider routing and matching logic\\n- **Driver onboarding** — background checks, document verification\\n- **Fraud detection** — specialized ML pipelines\\n- **Customer support** — dispute resolution workflows\\n- **International payment rails** — currency conversion, local acquirers\\n\\nThese are real subsystems at Uber's scale, but scoping them out lets us go deep on the architecturally interesting parts: location, matching, pricing, and ETA." } ] }
\`\`\`

## Scale Estimation

Scale estimation in system design is not about precision — it's about finding the *order of magnitude* that constrains your architecture. One number usually dominates all others. For Uber, that number is **625,000 location updates per second**. Here is how to derive it, and why each step matters.

\`\`\`steps
{ "title": "Working Through the Numbers", "steps": [ { "title": "Users & Trips", "content": "Start with the user base:\\n\\n- Monthly active riders: **130 million**\\n- Monthly active drivers: **5 million**\\n- Trips per day: **~25 million**\\n\\n**Average trips/second:**\\n\`\`\`\\n25,000,000 / 86,400 ≈ 290 trips/s\\n\`\`\`\\n\\n**Peak trips/second** (assume 5× average for rush hour):\\n\`\`\`\\n290 × 5 ≈ 1,450 trips/s\\n\`\`\`\\n\\nThis is the throughput the Dispatch and Trip services must sustain at peak — 1,450 concurrent matching decisions per second, each with a hard 10-second deadline." }, { "title": "Location Update Throughput", "content": "Drivers send GPS pings continuously while online:\\n\\n- Drivers active at any moment: ~50% of 5M = **2.5M**\\n- Ping frequency: **every 4 seconds**\\n\\n**Location updates/second:**\\n\`\`\`\\n2,500,000 / 4 = 625,000 updates/s\\n\`\`\`\\n\\n**Ingest bandwidth:**\\n\`\`\`\\n625,000 × 200 bytes ≈ 125 MB/s continuous\\n\`\`\`\\n\\nThis is not a burst — it is a constant, sustained load that the Location Service must handle 24/7 without degradation. Each ping carries latitude, longitude, heading, speed, and timestamp." }, { "title": "Storage Requirements", "content": "**Trip records:**\\n\`\`\`\\n25M trips/day × 2 KB/trip = 50 GB/day\\n50 GB × 365             = ~18.25 TB/year\\n\`\`\`\\n\\n**Raw location history:**\\n\`\`\`\\n625K updates/s × 200 bytes × 86,400 s = 10.8 TB/day\\n10.8 TB × 365                          = ~3.9 PB/year\\n\`\`\`\\n\\nThe location history number is the one that surprises people. This is why raw location data is never stored long-term in hot storage — kept in Redis for real-time use (minutes to hours of retention), then aggregated for analytics or discarded entirely." }, { "title": "What These Numbers Demand", "content": "| Metric | Value | Implication |\\n|---|---|---|\\n| Location updates/s | 625,000 | Dedicated high-throughput write path; SQL cannot keep up |\\n| Geospatial queries/s | ~1,450 peak | In-memory spatial index, not a SQL distance scan |\\n| Driver state reads | Very high | Redis or in-memory store for availability lookups |\\n| Location data/year | 3.9 PB | Hot tier (Redis) → cold aggregate → discard |\\n\\nThe geospatial query rate of 1,450/s sounds manageable, but each query must scan potentially millions of driver positions. A naive \`WHERE distance < 3km\` against a hot relational table would collapse immediately under this load." } ] }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The Double-Booking Problem", "content": "The most dangerous consistency failure in Uber's system is **double-booking**: two simultaneous trip requests both see a driver as available, both confirm the match, and the driver's app receives two competing assignments. At 1,450 peak trips/s, race conditions are a constant threat — not a theoretical edge case. The Matching Service must use an atomic compare-and-swap (CAS) or distributed lock to transition a driver from \`available\` to \`claimed\` as a single atomic operation. No eventual consistency here. This is the reason driver assignment is the one place in the system where we accept coordination overhead in exchange for correctness." }
\`\`\`

## High-Level Architecture

Each subsystem — Location, Matching, Pricing, ETA — is a horizontally scalable service with its own failure boundary. Driver GPS pings and rider trip requests share a single API Gateway ingress but immediately diverge into specialized services optimized for their respective workloads. The diagram below shows the component topology we will implement across the remaining lessons.

\`\`\`sysdiag
{ "title": "High-Level System Architecture", "width": 720, "height": 420, "nodes": [ { "id": "rider", "label": "Rider App", "x": 80, "y": 100, "kind": "client" }, { "id": "driver", "label": "Driver App", "x": 80, "y": 300, "kind": "client" }, { "id": "gateway", "label": "API GW / LB", "x": 260, "y": 200, "kind": "service" }, { "id": "trip", "label": "Trip Service", "x": 450, "y": 100, "kind": "service" }, { "id": "matching", "label": "Matching Service", "x": 450, "y": 300, "kind": "service" }, { "id": "geo", "label": "Geo Index", "x": 630, "y": 160, "kind": "database" }, { "id": "pricing", "label": "Pricing Service", "x": 630, "y": 260, "kind": "service" }, { "id": "location", "label": "Location Service", "x": 630, "y": 360, "kind": "service" } ], "edges": [ { "from": "rider", "to": "gateway", "label": "ride request" }, { "from": "driver", "to": "gateway", "label": "GPS pings" }, { "from": "gateway", "to": "trip" }, { "from": "gateway", "to": "matching", "label": "dispatch" }, { "from": "trip", "to": "matching" }, { "from": "matching", "to": "geo", "label": "find drivers" }, { "from": "matching", "to": "pricing" }, { "from": "matching", "to": "location" } ], "annotations": { "gateway": "Single ingress: AuthN/Z, rate limiting, and routing to downstream services. Maintains persistent WebSocket connections to both rider and driver apps for streaming location and status updates.", "matching": "Core dispatch engine. Pulls candidate drivers from the Geo Index, scores by ETA + acceptance rate + vehicle type, and sends an offer to the top candidate. Must complete end-to-end in under 10 seconds.", "geo": "In-memory geospatial index (H3/S2-style partitioned buckets). Updated 625K times/second by the Location Service. Powers all 'find drivers within X km' queries in O(1) to O(log n).", "location": "High-throughput write path: ingests 625K driver GPS pings/second, updates driver state (heading, speed), and refreshes the Geo Index. Redis Cluster or equivalent.", "pricing": "Real-time supply/demand calculation per geofenced zone. Outputs a surge multiplier consumed by both the Matching Service (for offer scoring) and the Rider App (fare estimate display).", "trip": "Owns the trip state machine: requested → dispatched → en route → completed → paid. Source of truth for trip records and billing." } }
\`\`\`

The following lessons build each of these subsystems in depth: location tracking (how to handle 625K updates/s with geospatial indexing), matching (how to find and atomically confirm a driver in under 10 seconds), pricing (how surge is calculated per zone in real time), and ETA prediction (how arrival estimates are derived from live traffic).

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "At steady state, approximately how many driver location updates per second must Uber's Location Service ingest?", "options": ["~6,250 updates/s (2.5M drivers ÷ 400s)", "~62,500 updates/s (2.5M drivers ÷ 40s)", "~625,000 updates/s (2.5M drivers ÷ 4s)", "~6,250,000 updates/s (5M drivers ÷ 0.8s)"], "answer": 2, "explanation": "2.5M active drivers × one GPS ping every 4 seconds = 625,000 updates/s. Critically, this is a continuous, sustained write load — not a burst. It is the single number that drives the entire Location Service architecture toward in-memory, horizontally partitioned stores rather than conventional databases." }, { "question": "Why must driver assignment use strict consistency rather than eventual consistency?", "options": ["Eventual consistency would cause GPS coordinates to converge too slowly on the map", "Surge pricing calculations require a fully consistent view of all driver positions", "A driver physically cannot be in two places at once — a double-booked driver creates an unresolvable conflict", "The API Gateway cannot route to the correct matching shard without strong consistency guarantees"], "answer": 2, "explanation": "If two concurrent trip requests both observe a driver as 'available' — even for a few hundred milliseconds — both can confirm the match. The driver receives two competing assignments, both riders see a confirmed ETA, and the system has no way to resolve this without manual intervention. The available → claimed transition must be atomic (CAS or distributed lock), making this the one place in the system where coordination overhead is non-negotiable." }, { "question": "What is the approximate annual storage footprint for raw, uncompressed driver location history?", "options": ["18.25 TB/year", "125 GB/year", "900 TB/year", "3.9 PB/year"], "answer": 3, "explanation": "625,000 updates/s × 200 bytes × 86,400 seconds/day = 10.8 TB/day × 365 = ~3.9 PB/year. This is why location data is never stored long-term in hot storage. Real systems keep it in Redis for real-time queries (minutes to hours of retention) and either aggregate it for analytics purposes or discard it entirely." }, { "question": "Why can't the Matching Service use a SQL query like \`SELECT * FROM drivers WHERE ST_Distance(location, pickup) < 3000\` for finding nearby drivers?", "options": ["SQL databases don't support latitude/longitude column types natively", "At 1,450 peak trips/s, even an indexed spatial scan against millions of live, constantly-updating rows cannot sustain this query rate", "The 3 km radius threshold is a configuration value that changes too frequently to embed in SQL", "SQL transactions are too slow to enforce the driver assignment consistency requirement"], "answer": 1, "explanation": "Even with a PostGIS spatial index, running hundreds of radius queries per second against a table of millions of rows that are being updated 625,000 times per second simultaneously is operationally untenable — the index churn alone would cause severe write amplification. The Geo Index uses an in-memory spatial structure (H3 hexagonal tiles, S2 cells, or a quadtree) that makes radius lookups O(1) to O(log n) and separates the read path from the high-throughput write path entirely." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["The dominant constraint is 625,000 location updates/second — this single number drives the entire Location Service architecture toward in-memory, horizontally partitioned stores", "Driver assignment requires strict (not eventual) consistency: the available → claimed transition must be atomic to prevent double-booking at high concurrency", "The Matching Service must complete end-to-end in under 10 seconds — every second beyond that measurably degrades rider conversion", "Raw location history accumulates at ~3.9 PB/year; the pattern is hot-tier Redis for real-time use, then aggregate or discard — never long-term hot storage", "Each major subsystem (Location, Matching, Pricing, ETA) is a separately scalable service with its own failure boundary — not a monolith"] }
\`\`\``,
    },
    {
      id: "uber-location-tracking",
      slug: "uber-location-tracking",
      title: "Location Tracking & Geospatial Indexing",
      content: `# Uber: Location Tracking & Geospatial Indexing

## The Scale Problem

Every active Uber driver sends a GPS ping every 4–5 seconds. At 2.5 million active drivers globally, that's **625,000 location updates per second** — a firehose that must be ingested, indexed, and queried without a single stale coordinate causing a wrong ETA or a failed match.

You cannot write every ping to a relational database; the write throughput would bury it. The solution is a two-track architecture: an in-memory geospatial index absorbs writes at sub-millisecond latency while Kafka handles durable persistence in parallel, never blocking the hot path.

\`\`\`sysdiag
{ "title": "Location Update Pipeline", "width": 760, "height": 340, "nodes": [ { "id": "driver", "label": "Driver App", "x": 55, "y": 170, "kind": "client" }, { "id": "gateway", "label": "API Gateway", "x": 200, "y": 170, "kind": "service" }, { "id": "locsvc", "label": "Location Service", "x": 390, "y": 170, "kind": "service" }, { "id": "geoindex", "label": "Geo Index\\n(H3 + RAM)", "x": 570, "y": 65, "kind": "database" }, { "id": "kafka", "label": "Kafka\\n(history log)", "x": 570, "y": 170, "kind": "queue" }, { "id": "redis", "label": "Redis\\n(latest position)", "x": 570, "y": 280, "kind": "cache" }, { "id": "dispatch", "label": "Dispatch Service", "x": 700, "y": 65, "kind": "service" } ], "edges": [ { "from": "driver", "to": "gateway", "label": "GPS / 4 s" }, { "from": "gateway", "to": "locsvc", "label": "route" }, { "from": "locsvc", "to": "geoindex", "label": "update (RAM)" }, { "from": "locsvc", "to": "kafka", "label": "persist async" }, { "from": "locsvc", "to": "redis", "label": "cache latest" }, { "from": "geoindex", "to": "dispatch", "label": "nearby query" } ], "annotations": { "locsvc": "Does two things in parallel on every ping: updates the in-memory geo index (sub-ms, synchronous) and publishes to Kafka (async). Never blocks the write path for persistence.", "geoindex": "In-memory structure partitioned by H3 cell. ~500 MB total for 2.5M drivers at ~200 bytes/entry. Rebuilt from Kafka on crash — seconds, not minutes.", "kafka": "Durable event log for driver location history. Powers ETA model training, analytics, and in-memory index rebuild after a Location Service crash.", "redis": "Caches each driver's latest position for fast single-driver lookups — used by trip tracking and status checks, not the geo search path." } }
\`\`\`

### What Each Driver Sends

\`\`\`json
{
  "driver_id": "D-abc123",
  "lat": 40.7128,
  "lng": -74.0060,
  "heading": 185,
  "speed": 32,
  "accuracy": 5,
  "timestamp": 1710345600000,
  "status": "available"
}
\`\`\`

---

## Geospatial Indexing: Why H3?

Uber open-sourced **H3**, a hexagonal hierarchical spatial index that tiles the Earth's surface into cells at 16 resolutions. Every driver's location is stored under their current H3 cell ID — making proximity queries a set of direct hash-map lookups rather than coordinate range scans.

\`\`\`concept
{ "title": "Why Hexagons Beat Squares for Proximity Queries", "variant": "mental-model", "content": "In a square grid, diagonal neighbors are √2 ≈ 1.41× farther than edge neighbors. So 'find all cells within k steps' returns cells at two different physical distances — corner cells are geometrically farther than edge cells at the same ring index.\\n\\nIn H3's hexagonal grid, all 6 immediate neighbors share the same center-to-center distance. A k-ring query returns cells with uniform proximity guarantees. This is essential for 'find drivers within N km' — you never over-select diagonal corners or under-select lateral edges." }
\`\`\`

### H3 Resolutions — Two in Production

| Resolution | Approx. cell area | Use in Uber |
|-----------|------------------|-------------|
| 7 | ~5.16 km² | Supply/demand heatmaps, surge pricing zones |
| 9 | ~0.105 km² | Driver proximity search (neighborhood-block granularity) |
| 12 | ~0.003 km² | Precision pickup/dropoff point mapping |

At resolution 9, one cell covers roughly a city block — granular enough to distinguish "two blocks away" from "around the corner" while keeping the index size manageable.

\`\`\`callout
{ "type": "info", "title": "H3 vs Geohash vs S2", "content": "Uber's internal systems also reference S2 (Google's library) alongside H3. Geohash is used in many simpler implementations because it works with standard B-tree prefix queries and is natively supported in Redis (GEORADIUS). However, geohash suffers from boundary discontinuities — two locations 5 m apart can have entirely different geohash prefixes if they straddle a cell boundary. H3's uniform-distance hexagons avoid this class of edge case entirely." }
\`\`\`

---

## Finding Nearby Drivers: The k-Ring Algorithm

When a rider requests a trip, the Dispatch Service converts the rider's coordinates to an H3 cell, then expands outward through concentric rings of neighboring cells until it has a sufficient candidate pool.

\`\`\`algoviz
{ "title": "H3 k-Ring Expansion — Nearby Driver Search (5×5 grid, each cell = one H3 hex)", "type": "grid", "data": [[0,1,0,0,1],[0,0,1,0,0],[1,0,2,0,1],[0,1,0,0,0],[0,0,1,0,1]], "frames": [ { "highlight": [12], "label": "Step 1 — Encode rider's (lat, lng) into H3 cell at resolution 9. O(1) bitwise operation.", "stats": { "cell": "872830828ff", "drivers_found": 0 } }, { "highlight": [6, 7, 8, 11, 12, 13, 16, 17, 18], "label": "Step 2 — k=1 ring: 6 adjacent hexagonal neighbors (~150 m radius). Lookup each cell in the in-memory index.", "stats": { "cells_searched": 9, "drivers_found": 2 } }, { "highlight": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], "label": "Step 3 — k=2 ring: 25 cells, ~500 m radius. Filter by status=available and last_update < 30 s. Run Haversine on candidates → sort → return top 10. Total: <10 ms.", "stats": { "cells_searched": 25, "drivers_found": 7, "latency": "<10 ms" } } ], "speed": 900 }
\`\`\`

The full production algorithm at k=4 covers ~3 km and touches ~61 cells — all in-memory hash-map lookups, no disk, no network:

\`\`\`python
def find_nearby_drivers(rider_lat, rider_lng, radius_km=3):
    # 1. Convert to H3 cell — O(1) bitwise ops
    rider_cell = h3.geo_to_h3(rider_lat, rider_lng, resolution=9)

    # 2. Compute k-ring covering the desired radius
    k = estimate_k_for_radius(radius_km, resolution=9)   # → k=4
    search_cells = h3.k_ring(rider_cell, k)              # → ~61 cells

    # 3. Fan out across geo index shards
    candidates = []
    for cell in search_cells:
        shard = geo_index_cluster[hash(cell) % NUM_SHARDS]
        candidates.extend(shard.lookup(cell))

    # 4. Drop stale or unavailable drivers
    fresh = [
        d for d in candidates
        if d.status == 'available'
        and (now_ms() - d.updated_at) < 30_000
    ]

    # 5. Exact distance + rank
    ranked = sorted(fresh, key=lambda d: haversine(rider_lat, rider_lng, d.lat, d.lng))
    return ranked[:10]
\`\`\`

---

## Sharding the Geo Index

2.5 million active drivers cannot fit on one box without sacrificing write throughput. The index is sharded across 32 Location Service instances, partitioned by H3 cell:

\`\`\`
Shard assignment: hash(h3_cell) % 32

For a k=4 nearby-driver query spanning ~61 cells:
  → Fan out to ~8–12 shards (geographically adjacent cells hash similarly)
  → Gather per-shard results, merge, return top 10
  → Total round-trip latency: ~20 ms
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Crash Recovery: Why Volatile Is Fine", "content": "The in-memory geo index is intentionally volatile — fastest-possible writes take priority over durability. If a Location Service instance crashes, the index rebuilds by replaying the Kafka driver-locations topic from the last committed offset.\\n\\nThis typically completes in seconds. During rebuild, the instance is removed from the consistent hash ring and other shards absorb its traffic. Serving slightly stale positions while rebuilding is preferable to slowing every write with a durable sync." }
\`\`\`

---

## Driver-to-Rider Streaming (Post-Match)

Once a trip is matched, the rider needs a live moving marker. This path is completely decoupled from the geo index write path:

\`\`\`mermaid
sequenceDiagram
    participant D as Driver App
    participant LS as Location Service
    participant K as Kafka (trip-{id})
    participant R as Rider App

    loop Every 4 s during active trip
        D->>LS: GPS ping
        LS->>LS: Update geo index (matching path)
        LS->>K: Publish to trip-specific topic
        K-->>R: Push via WebSocket / SSE
        R->>R: Re-render driver marker on map
    end
\`\`\`

Each active trip gets a dedicated Kafka topic (\`trip-{trip_id}\`). The rider's client subscribes via WebSocket or SSE. At ~10 million concurrent trips, this produces **2.5 million position pushes per second** out to rider devices — handled by a dedicated streaming tier, not the geo index write path.

---

## Indexing Approach Comparison

\`\`\`tabs
{ "tabs": [ { "label": "H3 (Hexagonal)", "icon": "⬡", "content": "**Uber's choice for driver proximity search.**\\n\\n- All 6 neighbors equidistant → uniform radius queries\\n- Hierarchical: switch resolutions with O(1) bitwise ops\\n- Built-in k-ring for efficient radius expansion\\n- Open-sourced by Uber; used in production since 2018\\n\\n**Tradeoff:** Requires the H3 library; less portable than geohash for teams without the dependency." }, { "label": "Geohash", "icon": "🔡", "content": "**Simple, widely used, native to Redis.**\\n\\n- Encodes (lat, lng) as alphanumeric string\\n- Nearby locations share common prefix → prefix range queries on B-tree indexes\\n- Built into Redis (\`GEOADD\` / \`GEORADIUS\` / \`GEOSEARCH\`)\\n\\n**Tradeoff:** Boundary discontinuities — two locations 5 m apart can get completely different geohash prefixes if they straddle a cell boundary, causing missed results on edge queries." }, { "label": "Quadtree", "icon": "⊞", "content": "**Adaptive density — good for sparse maps.**\\n\\n- Recursively divides the map into 4 quadrants\\n- Dense urban areas get finer subdivision automatically\\n- Fast point queries by tree traversal\\n\\n**Tradeoff:** Complex implementation; rebalancing on inserts creates contention at 625K writes/s. Also non-uniform neighbor distances, same problem as square grids." }, { "label": "R-tree / PostGIS", "icon": "🗂️", "content": "**Mature, supports complex spatial query types.**\\n\\n- Organizes bounding boxes hierarchically\\n- Handles polygons and lines, not just points\\n- Production standard for spatial SQL (PostGIS)\\n\\n**Tradeoff:** Write latency is significantly higher than in-memory approaches — not viable for 625K updates/s on the live matching path. Best suited for historical analytics, compliance queries, and geofence polygon checks." } ] }
\`\`\`

---

## Scale Numbers at a Glance

| Metric | Value |
|--------|-------|
| GPS updates ingested | 625,000 / s |
| Geo index RAM footprint | ~500 MB (2.5M drivers × ~200 B/entry) |
| Nearby driver queries | ~1,500 / s |
| Shards touched per query | ~8–12 of 32 |
| Total geo index reads | ~15,000 / s |
| Nearby query latency | < 10 ms (in-memory), ~20 ms (fan-out) |
| Driver → rider position pushes | ~2.5 M / s (10M concurrent trips × 0.25/s) |

---

\`\`\`quiz
{ "title": "Location Tracking & Geospatial Indexing", "questions": [ { "question": "Why does Uber use hexagonal (H3) cells rather than a square grid for driver proximity queries?", "options": ["Hexagons are easier to render on mobile map tiles", "All 6 hex neighbors are equidistant from the center cell, giving uniform proximity", "H3 cells map directly to GPS coordinate system boundaries", "Hexagons require less memory than square cells at the same resolution"], "answer": 1, "explanation": "In a square grid, diagonal neighbors are √2 ≈ 1.41× farther than edge neighbors — meaning a k-ring query returns cells at two different physical distances. H3 hexagons have consistent center-to-center distances for all 6 neighbors, making radius queries geometrically uniform and accurate." }, { "question": "A nearby-driver query at H3 resolution 9 with k=4 spans ~61 cells across a 32-shard cluster. How many shards are typically hit?", "options": ["All 32 shards (worst case safety)", "Exactly 1 shard (nearby cells always co-locate)", "~8–12 shards (geographically adjacent cells hash similarly)", "61 shards (one shard per cell, always)"], "answer": 2, "explanation": "H3 cells that are geographically adjacent tend to produce similar hash values, so they land on a small subset of shards — not all 32, and not exactly 1. In practice, a k=4 ring query fans out to roughly 8–12 shards. Each returns its slice of driver candidates, which are then merged and ranked at the coordinator." }, { "question": "If a Location Service instance crashes, how does the in-memory geo index recover?", "options": ["The index is permanently lost; drivers must re-register their location", "Redis serves as a hot standby and the in-memory index is reconstructed from it", "The index rebuilds by replaying driver location events from the Kafka topic", "A periodic snapshot to disk is loaded; at most 10 seconds of data may be lost"], "answer": 2, "explanation": "The in-memory geo index is volatile by design — maximum write speed takes priority. Durability is provided by the Kafka driver-locations topic. On crash, the instance replays from its last committed offset (typically completing in seconds), then rejoins the consistent hash ring. Correctness beats serving stale positions from a snapshot." }, { "question": "Why does the system update driver location every 4 seconds rather than every 1 second?", "options": ["GPS chipsets in Android/iOS cannot poll faster than 4 seconds", "4 seconds is the minimum Kafka consumer commit interval", "It balances positional accuracy against bandwidth and write load at scale", "Riders cannot perceive map updates faster than 4 seconds due to animation limits"], "answer": 2, "explanation": "At typical city driving speeds (~40 km/h), a 4-second window means ~44 m of position drift — accurate enough for ETA and matching. Updating every 1 second would increase write throughput from 625K/s to 2.5M/s with minimal practical accuracy gain for most ride scenarios. The tradeoff is deliberate, not a hardware or protocol constraint." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "625K GPS updates/second require an in-memory geo index — disk or even Redis adds network round-trip latency that compounds at this write rate", "H3 hexagonal cells solve the unequal-distance problem of square grids: all 6 neighbors are equidistant, making k-ring radius queries geometrically uniform across cell boundaries", "The location pipeline is dual-track: synchronous in-memory update (fast path) + async Kafka publish (durable path). Never block the write path for persistence", "Sharding by H3 cell hash distributes load evenly and keeps geographically adjacent cells co-located, limiting fan-out to ~8–12 of 32 shards per range query", "Post-match driver-to-rider streaming uses a dedicated per-trip Kafka topic with WebSocket/SSE delivery — fully decoupled from the geo index write path that serves matching" ] }
\`\`\``,
    },
    {
      id: "uber-matching-algorithm",
      slug: "uber-matching-algorithm",
      title: "Matching Algorithm",
      content: `# Uber: Matching Algorithm

## The Matching Problem

When a rider requests a ride, Uber must find the **best** available driver — not simply the closest one. The platform optimizes simultaneously across six competing signals:

| Signal | Why It Matters |
|--------|---------------|
| **ETA** | Actual drive time through real-time traffic — the dominant factor (~0.40 weight) |
| **Driver rating** | Higher-rated drivers deliver a better experience |
| **Wait time** | Fairness: drivers waiting longer get priority |
| **Trip direction** | Drivers already heading toward the pickup cost less idle time |
| **Acceptance rate** | Drivers who cancel frequently are deprioritized |
| **Vehicle type** | Must match the rider's requested tier (UberX, Black, etc.) |

This is not a nearest-neighbor query. It is a **multi-objective optimization problem** running ~1,500 times per second at peak load.

\`\`\`concept
{ "title": "Matching as Weighted Scoring", "variant": "mental-model", "content": "The matching engine never finds 'the best' driver in some absolute sense — it finds the driver with the highest weighted score given current conditions. Those weights are tunable business decisions. Raising the ETA weight makes the system faster but less fair to waiting drivers. Raising the wait-time weight improves driver fairness but may increase average pickup times. Every deployment is a tradeoff negotiation between rider experience, driver satisfaction, and platform efficiency." }
\`\`\`

## Matching Architecture

The Matching Engine orchestrates three downstream services in parallel: the Geo Service (spatial index of live driver positions), the ETA Service (traffic-aware route times), and the Supply Tracker (real-time driver state).

\`\`\`sysdiag
{ "title": "Matching Engine Architecture", "width": 720, "height": 360, "nodes": [ { "id": "rider", "label": "Rider App", "x": 55, "y": 180, "kind": "client" }, { "id": "trip", "label": "Trip Service", "x": 220, "y": 180, "kind": "service" }, { "id": "match", "label": "Matching Engine", "x": 430, "y": 180, "kind": "service" }, { "id": "geo", "label": "Geo Service", "x": 255, "y": 320, "kind": "service" }, { "id": "eta", "label": "ETA Service", "x": 430, "y": 320, "kind": "service" }, { "id": "supply", "label": "Supply Tracker", "x": 600, "y": 320, "kind": "service" } ], "edges": [ { "from": "rider", "to": "trip", "label": "request ride" }, { "from": "trip", "to": "match", "label": "validated request" }, { "from": "match", "to": "geo", "label": "nearby drivers" }, { "from": "match", "to": "eta", "label": "batch ETAs" }, { "from": "match", "to": "supply", "label": "driver state" } ], "annotations": { "match": "Core orchestrator: candidate generation → scoring → dispatch. p95 latency target: < 5 seconds.", "trip": "Validates request, estimates fare, and creates the trip record before handing off to matching.", "geo": "In-memory S2/geohash index. Returns 30–50 candidates within configurable radius (default 5 km).", "eta": "Pre-computed road graph. Processes 30–50 (origin→dest) pairs in ~50ms as a single batch request.", "supply": "Tracks driver availability, active trip state, recent declinations per rider." } }
\`\`\`

## The Four-Step Matching Flow

\`\`\`steps
{ "title": "From Rider Request to Confirmed Match", "steps": [ { "title": "Candidate Generation", "content": "Query the Geo Service for available drivers of the correct vehicle type within the default 5 km search radius.\\n\\n**Filters applied:**\\n- Remove drivers with active trips (unless completing within ~2 min)\\n- Remove drivers who recently declined this specific rider\\n- Remove drivers below the minimum rating threshold\\n\\n\`\`\`\\nInput:  Rider at (40.712, -74.006), requesting UberX\\nRaw candidates returned by geo index:  47\\nAfter filtering:                        32\\n\`\`\`" }, { "title": "Batch ETA Computation", "content": "Send all 32 candidate (driver_location → pickup_location) pairs to the ETA Service as a **single batch request** — not 32 serial API calls.\\n\\nThe routing service uses a pre-computed road graph, so all ETAs come back in ~50ms total.\\n\\n\`\`\`\\nD-ghi: 2.8 min  (0.8 km, but red-light cycle ahead)\\nD-abc: 3.2 min  (1.1 km, light traffic)\\nD-def: 4.1 min  (2.3 km, moderate traffic)\\n...\\n\`\`\`\\n\\n**Key insight:** Traffic-aware ETA beats straight-line distance. A driver 1.5 km away in gridlock may arrive later than one 2.5 km away on a clear road." }, { "title": "Weighted Scoring", "content": "Score every candidate with a normalized weighted model:\\n\\n\`\`\`\\nscore = 0.40 * norm(ETA)\\n      + 0.15 * norm(driver_rating)\\n      + 0.20 * norm(wait_time)\\n      + 0.15 * norm(direction_bonus)\\n      + 0.10 * norm(acceptance_rate)\\n\`\`\`\\n\\nAll inputs are normalized to [0, 1] before weighting so no single signal dominates due to scale differences.\\n\\n**Results for this request:**\\n- D-ghi: **0.87** — closest ETA, high rating, waited 8 min\\n- D-abc: **0.82** — slightly farther, very high rating\\n- D-def: **0.71** — moderate ETA, average rating" }, { "title": "Dispatch and Fallback Chain", "content": "1. Send ride offer to top-scored driver — they have **15 seconds** to respond\\n2. Accepted → match confirmed, rider notified immediately\\n3. Declined or timeout → offer sent to the next driver in ranked order\\n4. After 3 consecutive declines → **expand search radius** from 5 km to 8 km\\n5. After 60 seconds with no match → notify rider: 'No drivers available nearby'\\n\\nThe 15-second offer window is a deliberate UX tradeoff: long enough for the driver to decide, short enough that riders don't accumulate multiple timeout delays." } ] }
\`\`\`

## Visualizing the Dispatch Walk

The array below represents the top 5 scored candidates (score × 100) from a single matching event, sorted descending. The engine dispatches offers from left to right.

\`\`\`algoviz
{ "title": "Top-5 Candidates — Dispatch Walk (score × 100)", "type": "array", "data": [87, 82, 71, 65, 58], "frames": [ { "highlight": [0, 1, 2, 3, 4], "label": "32 candidates scored and sorted. Top 5 shown.", "stats": { "pool": 32, "offer_to": "pending" } }, { "highlight": [0], "label": "Offer sent to D-ghi (0.87): nearest ETA, waited 8 min, high rating.", "stats": { "pool": 32, "offer_to": "D-ghi" } }, { "highlight": [0, 1], "label": "D-ghi declined. Fallback: offer sent to D-abc (0.82).", "stats": { "pool": 32, "offer_to": "D-abc" } }, { "highlight": [1], "label": "D-abc accepted. Match confirmed. D-abc marked BUSY in Supply Tracker.", "stats": { "pool": 32, "offer_to": "D-abc ✓" } } ], "speed": 1000 }
\`\`\`

## Batch Matching: Global vs. Greedy Assignment

Rather than matching one rider at a time, Uber accumulates requests over a **2–3 second window** and solves the assignment globally. This is a variant of the **assignment problem**, solved with the Hungarian algorithm for small batches or approximate heuristics at scale.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Greedy — one rider at a time", "code": "Riders:  [R1, R2, R3, R4, R5]\\nDrivers: [D1, D2, D3, D4, D5, D6, D7]\\n\\nR1 → D1  (nearest to R1)\\nR2 → D4  (nearest remaining)\\nR3 → D6  (nearest remaining)\\nR4 → D7  (far — good options taken)\\nR5 → D5  (far — good options taken)\\n\\nTotal ETA sum: 24 min\\n\\nEach assignment is locally optimal but\\nsteals good drivers from later riders." }, "after": { "label": "Batch — 2-second window, global solve", "code": "Riders:  [R1, R2, R3, R4, R5]\\nDrivers: [D1, D2, D3, D4, D5, D6, D7]\\n\\nR1 → D3  (slightly farther for R1...)\\nR2 → D1  (closer after global reassignment)\\nR3 → D4\\nR4 → D6  (much better than greedy gave it)\\nR5 → D7\\n\\nTotal ETA sum: 18 min  (25% improvement)\\n\\nLocal suboptimality per rider yields\\nglobal optimality for the platform." } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why the 2-Second Wait Is Invisible", "content": "Riders see a 'Searching for your driver...' animation during matching. The 2-second batch window is entirely absorbed by this UX moment — riders never experience it as a delay. Meanwhile, Uber captures a 20–30% improvement in aggregate ETA across all matched pairs. For small batches (5–10 riders), the Hungarian algorithm gives an exact solution in O(n³), which is negligible at that scale." }
\`\`\`

## Preventing Double-Booking

The matching engine runs with high concurrency. Two threads could read the same driver as available and both attempt to assign them — a classic check-then-act race condition.

\`\`\`tabs
{ "tabs": [ { "label": "The Race Condition", "icon": "⚠️", "content": "\`\`\`\\nThread 1: Is D-abc available?  → YES\\nThread 2: Is D-abc available?  → YES\\n\\nThread 1: Assign D-abc to R1  ✓\\nThread 2: Assign D-abc to R2  ✗  CONFLICT!\\n\`\`\`\\n\\nBoth threads checked availability before either write completed. Without coordination, the same driver gets assigned to two different riders simultaneously." }, { "label": "The Fix: Distributed Lock", "icon": "🔒", "content": "\`\`\`\\n# Redis SETNX: atomic set-if-not-exists\\nSETNX lock:D-abc \\"{trip_id: T-123}\\" EX 15\\n\\nThread 1: SETNX lock:D-abc  → OK    (lock acquired)\\nThread 2: SETNX lock:D-abc  → FAIL  (already locked)\\nThread 2:  → skip D-abc, try next candidate\\n\\n# TTL = 15 seconds (matches the offer window)\\n# Auto-expires if driver never responds\\n\`\`\`\\n\\nSETNX is atomic — only one thread can win. The loser immediately moves to the next candidate in its ranked list." }, { "label": "Lock Lifecycle", "icon": "🔄", "content": "\`\`\`\\n[LOCK ACQUIRED]    offer sent to driver\\n       ↓\\n[DRIVER ACCEPTS]   lock → active trip record\\n       ↓           driver marked BUSY\\n[TRIP COMPLETES]   driver marked AVAILABLE\\n                   lock already expired (TTL)\\n\\n[DRIVER DECLINES]  lock released immediately\\n       ↓           matching engine tries #2\\n\\n[NO RESPONSE]      lock auto-expires at 15s\\n                   driver returns to pool\\n\`\`\`\\n\\nThe Redis lock operations run at ~3,000/s at peak. Each lock is scoped to a single driver and a single offer window." } ] }
\`\`\`

## Forward Dispatch

When a driver is 2–3 minutes from completing a trip, the system can **pre-match** them to a waiting rider near the dropoff — before the current trip even ends.

\`\`\`callout
{ "type": "success", "title": "Forward Dispatch in Action", "content": "**Driver D-abc** is dropping off at (40.730, −73.990) in 3 minutes.\\n\\n**Rider R-456** is waiting at (40.728, −73.988) — 200 m from the upcoming dropoff.\\n\\nThe matching engine assigns R-456 to D-abc *now*. D-abc finishes trip one and immediately starts trip two — zero idle repositioning time. For Uber, forward dispatch accounts for ~30% of all matches, directly improving driver utilization and gross earnings per hour." }
\`\`\`

Forward dispatch requires the Matching Engine to subscribe to trip progress events and trigger early candidate scoring when a driver's estimated time-to-completion drops below a threshold (~3 minutes).

## Scale Numbers at Peak Load

| Metric | Value |
|--------|-------|
| Matching requests | ~1,500 / second |
| Candidates evaluated per match | 30–50 drivers |
| ETA computations | ~60,000 / second (1,500 × 40 avg) |
| Match latency | < 5 seconds (p95) |
| Batch window | 2 seconds |
| Redis lock operations | ~3,000 / second |
| Forward dispatch rate | ~30% of all matches |

The 60,000 ETA/s figure explains why Uber invested in pre-computed road graphs with S2/H3 cell-based travel time caches rather than issuing live routing API calls per driver candidate.

\`\`\`quiz
{ "title": "Matching Algorithm — Check Your Understanding", "questions": [ { "question": "Why does Uber accumulate requests in a 2-second batch window instead of matching each rider the instant they request?", "options": [ "To reduce infrastructure costs by processing fewer concurrent requests", "To enable global assignment optimization, which reduces total aggregate ETA across all riders by ~25% compared to greedy matching", "To give the Trip Service time to validate payments before matching begins", "To synchronize matching with surge pricing recalculation cycles" ], "answer": 1, "explanation": "Greedy single-rider matching is locally optimal but globally suboptimal — early assignments capture the best drivers and leave later riders with worse options. By batching over 2 seconds, Uber solves a mini assignment problem (Hungarian algorithm or approximation) that yields ~25% lower aggregate ETA at the cost of an imperceptible delay hidden behind the 'Searching...' UX." }, { "question": "Driver A is 0.8 km away but stuck behind a red-light cycle with ETA 2.8 min. Driver B is 2.3 km away on a clear road with ETA 2.4 min. Which does the scoring model prefer?", "options": [ "Driver A — raw distance carries the highest weight in the scoring model", "Driver B — ETA (not distance) carries the highest weight (0.40), and Driver B's traffic-aware ETA is lower", "They would score identically if all other factors are equal", "It depends entirely on driver rating, which outweighs ETA for safety reasons" ], "answer": 1, "explanation": "ETA is the dominant factor at weight 0.40, and Uber's ETA is traffic-aware — not straight-line distance. Driver B's lower ETA (2.4 min vs 2.8 min) would produce a higher ETA score component. This is a core reason the system distinguishes ETA from proximity." }, { "question": "What specific concurrency problem does Redis SETNX (with a TTL) solve in the dispatch flow?", "options": [ "It prevents a rider from submitting duplicate trip requests within the same second", "It prevents two concurrent matching threads from assigning the same driver to different riders simultaneously", "It caches ETA results so the routing service isn't called for the same driver twice", "It rate-limits the number of offers any single driver receives per minute" ], "answer": 1, "explanation": "SETNX is an atomic set-if-not-exists. Once Thread 1 acquires the lock on driver D-abc, Thread 2's SETNX on the same key returns FAIL immediately — the check and the write are a single atomic operation. The TTL (set to 15s to match the offer window) ensures the lock auto-releases if the driver never responds, preventing permanent lockout." }, { "question": "What is 'forward dispatch' and what operational problem does it solve?", "options": [ "Sending offers to the top 3 drivers simultaneously to parallelize the acceptance phase", "Pre-matching a driver to their next rider while they are still completing the current trip, eliminating idle time", "Routing idle drivers toward high-demand surge zones before requests arrive there", "Expanding the search radius proactively when demand forecasts predict a supply shortage" ], "answer": 1, "explanation": "Forward dispatch triggers when a driver's estimated time-to-completion drops below ~3 minutes. The engine matches them to a nearby waiting rider now, so the driver transitions directly from trip 1 to trip 2 with no repositioning gap. This accounts for ~30% of Uber's matches and is a key driver utilization metric." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Matching is a weighted multi-factor scoring problem (ETA 40%, wait time 20%, rating 15%, direction 15%, acceptance rate 10%) — not a nearest-driver lookup. All inputs are normalized before weighting.", "Batch matching over a 2-second window enables global assignment optimization via the Hungarian algorithm or approximations, achieving ~25% lower aggregate ETA versus greedy single-rider matching.", "Batch ETA computation (~50ms for 32+ pairs) is only feasible because Uber pre-computes road graph travel times in S2/H3 geospatial cell indexes — not live routing API calls per candidate.", "Redis SETNX with a 15-second TTL provides atomic distributed locks that prevent double-booking; the TTL matches the offer window so locks auto-release on driver non-response.", "Forward dispatch (pre-matching drivers ~3 minutes before trip completion) accounts for ~30% of all matches and is the primary mechanism for reducing driver idle time between trips." ] }
\`\`\``,
    },
    {
      id: "uber-dynamic-pricing",
      slug: "uber-dynamic-pricing",
      title: "Dynamic Pricing",
      content: `# Uber: Dynamic Pricing (Surge)

## Why Dynamic Pricing?

In a two-sided marketplace, supply (drivers) and demand (riders) fluctuate independently. When demand exceeds supply, riders wait longer and drivers cherry-pick trips. Dynamic pricing solves this by reducing demand (higher prices deter non-urgent rides), increasing supply (surge multiplier attracts drivers), and balancing the market toward equilibrium.

\`\`\`concept
{ "title": "Two-Sided Marketplace Feedback Loop", "variant": "mental-model", "content": "Surge pricing is a self-correcting feedback signal. When a zone goes undersupplied, the price rises — simultaneously dampening demand from price-sensitive riders AND pulling nearby drivers toward the zone. Within 5–15 minutes, the influx of supply drives the S/D ratio back above 1.0 and surge drops automatically. No central coordinator needed: the price signal does the work." }
\`\`\`

## Zone-Based Supply/Demand

The city is partitioned into H3 hexagonal cells (resolution 7, ~5 km² each). Hexagons are preferred over square grids because every adjacent cell edge is equidistant — no directional bias in supply calculations. Each zone independently tracks supply and demand every 30 seconds.

\`\`\`tabs
{ "tabs": [ { "label": "Supply Metrics", "icon": "🚗", "content": "**Zone: Midtown Manhattan** (H3 \`872830828ffffff\`)\\n\\n| Metric | Value |\\n|--------|-------|\\n| Available drivers | 45 |\\n| En route to pickup | 12 |\\n| Completing trips (avg 8 min ETA) | 28 |\\n| **Predicted supply in 10 min** | **62** |\\n\\nOnly **immediately available** drivers count toward the real-time S/D ratio. Drivers completing trips feed the 10-minute forecast used by the ML demand predictor." }, { "label": "Demand Metrics", "icon": "📱", "content": "**Zone: Midtown Manhattan** (H3 \`872830828ffffff\`)\\n\\n| Metric | Value |\\n|--------|-------|\\n| Ride requests (last 5 min) | 120 |\\n| Unfulfilled requests | 18 |\\n| Average wait time | 6.2 min |\\n| **Predicted demand in 10 min** | **95** |\\n\\nUnfulfilled requests (rider cancelled or timed out) are a **leading indicator** of market stress — they signal the current price isn't clearing the queue fast enough." }, { "label": "Surge Mapping", "icon": "⚡", "content": "**Supply/Demand Ratio → Surge Multiplier**\\n\\n| S/D Ratio | Condition | Surge Band |\\n|-----------|-----------|------------|\\n| > 1.0 | Oversupply | **1.0×** |\\n| 0.5 – 1.0 | Light undersupply | **1.0 – 1.5×** |\\n| 0.25 – 0.5 | Heavy undersupply | **1.5 – 2.5×** |\\n| < 0.25 | Extreme undersupply | **2.5 – 3.0× (capped)** |\\n\\n**Midtown example:** 45 available ÷ 120 requests = **0.375 → ~2.1× surge**\\n\\nThe multiplier is monotonically increasing and hard-capped at 3.0× as a fairness control." } ] }
\`\`\`

## Pricing Architecture

\`\`\`sysdiag
{ "title": "Dynamic Pricing Architecture", "width": 700, "height": 380, "nodes": [ { "id": "rider", "label": "Rider App", "x": 70, "y": 190, "kind": "client" }, { "id": "trip", "label": "Trip Service", "x": 240, "y": 190, "kind": "service" }, { "id": "pricing", "label": "Pricing Service", "x": 440, "y": 190, "kind": "service" }, { "id": "tracker", "label": "Supply/Demand\\nTracker", "x": 440, "y": 330, "kind": "service" }, { "id": "redis", "label": "Redis Cache\\n(surge/zone, TTL 30s)", "x": 620, "y": 330, "kind": "store" }, { "id": "ml", "label": "ML Demand\\nPredictor", "x": 620, "y": 190, "kind": "service" } ], "edges": [ { "from": "rider", "to": "trip", "label": "request ride" }, { "from": "trip", "to": "pricing", "label": "estimate fare" }, { "from": "pricing", "to": "rider", "label": "upfront price (locked 5 min)" }, { "from": "tracker", "to": "pricing", "label": "zone surge multiplier" }, { "from": "redis", "to": "tracker", "label": "cached multiplier" }, { "from": "ml", "to": "tracker", "label": "demand forecast" } ], "annotations": { "pricing": "Combines (base fare + distance charge + time charge) × surge multiplier + booking fee. Locks price for 5 minutes on first request.", "tracker": "Aggregates supply/demand per H3 cell every 30s. Computes S/D ratio and maps to surge band.", "redis": "~100K zones × 1 update/30s = ~3,333 writes/s. 30s TTL ensures stale surge auto-expires without an explicit delete." } }
\`\`\`

## Fare Calculation

The formula has two layers: the **metered component** (everything the surge multiplies) and the **booking fee** (fixed, not surged — a regulatory requirement in many jurisdictions).

\`\`\`
fare = (base_fare + distance_charge + time_charge) × surge_multiplier
     + booking_fee
\`\`\`

\`\`\`trace
{ "title": "NYC UberX Fare: 8.5 km, 22 min, 1.8× Surge", "language": "python", "code": "base_fare = 2.55\\ndistance_km = 8.5\\nper_km_rate = 1.75\\nduration_min = 22\\nper_min_rate = 0.35\\nsurge = 1.8\\nbooking_fee = 3.00\\n\\ndistance_charge = distance_km * per_km_rate   # 14.88\\ntime_charge = duration_min * per_min_rate     # 7.70\\nsubtotal = base_fare + distance_charge + time_charge  # 25.13\\nsurged_fare = subtotal * surge                # 45.23\\ntotal = surged_fare + booking_fee             # 48.23", "frames": [ { "line": 1, "vars": { "base_fare": 2.55 }, "note": "Flat entry fee — same regardless of zone or surge." }, { "line": 6, "vars": { "surge": 1.8 }, "note": "Zone S/D ratio = 0.375 → falls in the 0.25–0.5 band → 1.8× multiplier." }, { "line": 9, "vars": { "distance_charge": 14.875 }, "note": "8.5 km × $1.75/km = $14.88" }, { "line": 10, "vars": { "time_charge": 7.7 }, "note": "22 min × $0.35/min = $7.70" }, { "line": 11, "vars": { "subtotal": 25.13 }, "note": "All three metered components summed — this entire subtotal is what surge amplifies." }, { "line": 12, "vars": { "surged_fare": 45.23 }, "note": "$25.13 × 1.8 = $45.23. Surge amplifies base + distance + time together." }, { "line": 13, "vars": { "total": 48.23 }, "note": "Booking fee ($3.00) added AFTER surge and is never multiplied — regulatory requirement." } ], "speed": 900 }
\`\`\`

## Upfront Pricing

Modern Uber shows a **fixed price** before the rider confirms — not a running meter. An ML model predicts route distance and duration, applies the current zone surge, and locks the fare for 5 minutes (or until confirmation).

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Metered Fare (old model)", "code": "// Rider sees: estimate ~$40–55\\n// Confirms ride\\n// Meter runs during actual trip\\n// Traffic adds 8 minutes\\n// Trip ends → charged: $57.40\\n\\n// Problems:\\n// - Uncertainty causes abandonment\\n// - Rider anxiety during trip\\n// - Impossible to budget exact cost" }, "after": { "label": "Upfront Pricing (current)", "code": "// ML predicts: 8.5 km, 22 min\\n// Surge applied: 1.8×\\n// Rider sees: exactly $48.23\\n// Confirms ride (or doesn't)\\n// Traffic adds 8 minutes → still $48.23\\n\\n// Uber absorbs variance:\\n// Long trip? Uber absorbs extra cost\\n// Short trip? Uber keeps the margin\\n// Over millions of trips: variance balances\\n// Conversion rate improves: binary yes/no decision" } }
\`\`\`

## Surge Communication to Drivers

Drivers see a real-time heatmap overlaying surge multipliers per zone. A driver 3 km from a 2.1× zone earns ~50% more by repositioning. As drivers migrate toward the surge, supply rises, the S/D ratio improves, and the multiplier drops — the market self-corrects within **5–15 minutes** without any central dispatch.

## Anti-Gaming Measures

| Attack Vector | Mitigation |
|---------------|-----------|
| Drivers collude to go offline and inflate surge | Detect coordinated offline bursts; cap surge at 3.0× |
| Riders probe surge via request/cancel cycles | Price locked on first request; rate-limit rapid cancellations |
| Event-driven flash surge (concert, stadium exit) | Pre-position surge based on event calendar + ML demand forecast |
| Weather-driven demand spike | Demand forecasting model runs 30 minutes ahead per zone |

\`\`\`callout
{ "type": "warning", "title": "Surge Manipulation Is an Active Adversarial Problem", "content": "Investigative reports documented driver groups coordinating via messaging apps to go offline simultaneously at airports, triggering artificial surge. Uber's abuse detection correlates offline patterns with known geographic clustering — 20 drivers going offline within a 500m radius in under 60 seconds is anomalous. The surge is suppressed or capped, and accounts flagged. Detecting intent vs. coincidence is a hard signal-processing problem at scale." }
\`\`\`

## Scale Numbers

| Operation | Rate |
|-----------|------|
| Zone price updates | ~100K zones × 1/30s = **3,333 writes/s** |
| Fare estimate calculations | **~1,500 requests/s** at peak |
| Driver heatmap pushes | 2.5M drivers × 1/30s = **83,000 pushes/s** |
| ML demand prediction refresh | Every **5 minutes** per zone |
| Redis surge cache TTL | **30 seconds** (stale surge auto-expires) |

\`\`\`quiz
{ "title": "Dynamic Pricing Comprehension Check", "questions": [ { "question": "Which components does Uber's surge multiplier apply to?", "options": [ "The entire fare including booking fee", "Base fare + distance charge + time charge (metered component only)", "Distance charge only — not base fare or time", "Only the base fare" ], "answer": 1, "explanation": "Surge multiplies the metered subtotal (base fare + distance + time) but NOT the booking fee. The booking fee is added after surge — this is a regulatory requirement in many jurisdictions to prevent fees from becoming prohibitively large." }, { "question": "A zone has 25 available drivers and 200 outstanding ride requests. What surge band applies?", "options": [ "1.0–1.5× (light undersupply — ratio is 0.125)", "1.5–2.5× (heavy undersupply — ratio is 0.125)", "2.5–3.0× (extreme undersupply — ratio is 0.125)", "No surge — ratio above 1.0 means oversupply" ], "answer": 2, "explanation": "25 ÷ 200 = 0.125, which is below the 0.25 threshold — the extreme undersupply band. This triggers the maximum surge of 2.5–3.0× (capped at 3.0×). Strong price signal to both deter demand and pull in supply." }, { "question": "A rider books an upfront-priced trip for $48.23. Heavy traffic makes the trip 12 minutes longer than predicted. What happens?", "options": [ "Rider pays the difference — metered fare applies retroactively", "Surge automatically recalculates mid-trip", "Driver receives less per-minute compensation to cover the difference", "Rider still pays $48.23 — Uber absorbs the variance" ], "answer": 3, "explanation": "Upfront pricing locks the fare at booking. Uber assumes the variance risk — if the trip runs long, Uber absorbs it; if it's short, Uber keeps the margin. Over millions of trips the variances statistically balance out, and the conversion improvement from certainty more than compensates." }, { "question": "Why does Uber prefer H3 hexagonal cells over a square lat/long grid for zone-based pricing?", "options": [ "Hexagons are required by city transit regulations in most markets", "All 6 neighbors of a hexagon are equidistant — no diagonal-distance bias unlike square grids", "Hexagonal cells are simpler to cache in Redis", "H3 cells align precisely with city block boundaries" ], "answer": 1, "explanation": "In a square grid, diagonal neighbors are √2 farther than edge neighbors — this creates directional bias when computing supply within a zone. H3 hexagons have exactly 6 equidistant neighbors, producing isotropic (direction-independent) distance calculations. This matters for supply attribution when a driver sits on a cell boundary." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Dynamic pricing is a self-correcting feedback signal: it simultaneously suppresses demand and attracts supply, balancing zones within 5–15 minutes without central dispatch.", "Surge multiplier = f(supply/demand ratio per H3 zone, updated every 30s). The booking fee is never surged — regulatory requirement.", "Upfront pricing locks an exact fare at booking using ML-predicted route metrics. Uber absorbs trip variance; riders get price certainty which measurably improves conversion.", "Scale demands: ~3,333 zone surge writes/s and 83K driver heatmap pushes/s — served from Redis with 30s TTL across ~100K H3 cells.", "Anti-gaming (coordinated offline collusion) is a real adversarial problem requiring anomaly detection on geographic clustering of driver state changes." ] }
\`\`\``,
    },
    {
      id: "uber-eta-calculation",
      slug: "uber-eta-calculation",
      title: "ETA Calculation",
      content: `# ETA Calculation

ETA (Estimated Time of Arrival) is the heartbeat of Uber's experience. Every rider notification, every fare quote, every driver assignment passes through ETA. A 10% improvement in accuracy translates directly into higher rider satisfaction and more efficient matching.

\`\`\`concept
{ "title": "ETA Is Not Just a Display Number", "variant": "mental-model", "content": "ETA drives four separate systems simultaneously: rider expectation management ('your driver arrives in 4 min'), matching decisions (nearest by ETA, not straight-line distance), upfront fare calculation (trip duration × rate), and driver turn-by-turn routing. Getting ETA wrong cascades across all four systems at once." }
\`\`\`

## The Road Network as a Weighted Graph

Uber models the world's roads as a **weighted directed graph**:

- **Node:** intersection or road segment endpoint (~500 million globally)
- **Edge:** road segment connecting two nodes (~1.2 billion globally)
- **Weight:** travel time — not distance, but time, adjusted for traffic

Each edge carries layered time estimates:

| Weight Layer | Source | Update Frequency |
|---|---|---|
| Base time | Speed limit × road type | Static |
| Historical time | Day-of-week, hour-of-day patterns | Weekly |
| Real-time time | Live GPS probe data | Every 2 minutes |
| Turn penalties | Left turns, traffic signals | Static |

The full global graph fits in ~50 GB compressed and is kept **in-memory per regional service** — the < 20ms end-to-end budget rules out any external database round-trip.

## ETA System Architecture

\`\`\`sysdiag
{ "title": "ETA Service Architecture", "width": 700, "height": 380, "nodes": [ {"id": "req", "label": "Trip Request", "x": 70, "y": 190, "kind": "client"}, {"id": "eta", "label": "ETA Service", "x": 240, "y": 190, "kind": "service"}, {"id": "routing", "label": "Routing Engine (CRP)", "x": 450, "y": 190, "kind": "service"}, {"id": "traffic", "label": "Traffic Data", "x": 600, "y": 80, "kind": "store"}, {"id": "ml", "label": "DeepETA Model", "x": 600, "y": 190, "kind": "service"}, {"id": "graph", "label": "Road Graph (in-memory)", "x": 600, "y": 300, "kind": "store"} ], "edges": [ {"from": "req", "to": "eta", "label": "origin + dest"}, {"from": "eta", "to": "routing", "label": "route query"}, {"from": "routing", "to": "traffic", "label": "live weights"}, {"from": "routing", "to": "ml", "label": "base ETA"}, {"from": "routing", "to": "graph", "label": "graph traversal"}, {"from": "ml", "to": "eta", "label": "corrected ETA"} ], "annotations": { "eta": "Orchestrates map matching, routing, and ML correction. Total latency target: < 20ms end-to-end.", "routing": "CRP-based engine explores ~500 nodes vs 50,000 for Dijkstra. Query time < 1ms.", "ml": "DeepETA neural network corrects for weather, events, and pickup/dropoff delay. MAE ~1.5 min.", "traffic": "625K GPS probe updates/second from driver devices. Edge weights refreshed every 2 minutes.", "graph": "~500M nodes, ~1.2B edges globally. ~50 GB compressed. Loaded entirely in-memory per region." } }
\`\`\`

## Routing Algorithms: The Speed Problem

60,000 ETA queries per second. Each needs a shortest-path computation across a graph with hundreds of millions of nodes. Standard algorithms don't survive contact with that requirement.

\`\`\`tabs
{ "tabs": [ { "label": "Dijkstra (Baseline)", "icon": "📐", "content": "**Standard shortest-path on a weighted graph.**\\n\\nTime complexity: \`O((V + E) log V)\`\\n\\n| Query Scale | Nodes Explored | Latency |\\n|---|---|---|\\n| City (10 km) | ~50,000 | ~200ms |\\n| Cross-city (50 km) | ~500,000 | ~2 seconds |\\n\\nAt 60,000 queries/second with 200ms each, you'd need **12,000 parallel cores** just for city-scale. Cross-city queries are simply impossible.\\n\\n**Why it fails:** Dijkstra expands nodes radially in all directions like a growing circle. Most of that work is wasted — the answer lies along a single corridor, not in every direction simultaneously." }, { "label": "Contraction Hierarchies (CH)", "icon": "⚡", "content": "**Pre-process the graph by adding shortcut edges that bypass unimportant nodes.**\\n\\n    Original:   A ──5──► B ──3──► C ──4──► D\\n                (must traverse every intermediate node)\\n\\n    With CH:    A ──5──► B ─────────7─────────► D\\n                (C is contracted; B→D shortcut stored)\\n\\n**Preprocessing:** ~30 minutes for a city graph (done offline, not on query path)\\n\\n**Query time:** O(log V) — typically < 1ms\\n\\n| Metric | Dijkstra | CH |\\n|---|---|---|\\n| Nodes explored | ~50,000 | ~500 |\\n| Query latency | ~200ms | < 1ms |\\n| Speedup | 1× | ~200× |\\n\\n**Key insight:** Nodes are ranked by 'importance.' A highway interchange is more important than a residential dead-end. Queries ascend the hierarchy through high-importance roads, not sideways through local streets." }, { "label": "CRP (Production)", "icon": "🚦", "content": "**Customizable Route Planning** — extends CH to support live traffic updates without full reprocessing.\\n\\nCH's weakness: traffic changes require rerunning the expensive preprocessing. CRP splits preprocessing into two independent phases:\\n\\n**Phase 1 — Topology (metric-independent)**\\n- Analyzes road network structure only\\n- Run once: ~30 minutes\\n- Roads rarely move — this is nearly permanent\\n\\n**Phase 2 — Weights (metric-dependent)**\\n- Assigns travel times to edges\\n- Re-runs every 5 minutes as traffic changes\\n- Takes ~1 second (not 30 minutes)\\n\\n    Traffic update arrives\\n      → Only Phase 2 re-runs (~1 second)\\n      → Queries immediately use updated weights\\n      → No full graph rebuild\\n\\nThis is how Uber reflects a sudden freeway closure in ETA queries within minutes, not hours." } ] }
\`\`\`

## Contraction Hierarchies: Node Exploration Visualized

\`\`\`algoviz
{ "title": "Nodes Explored: Dijkstra vs Contraction Hierarchies (city-scale query)", "type": "array", "data": ["N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8"], "frames": [ {"highlight": [0,1,2,3,4,5,6,7], "label": "Dijkstra: expands in all directions — visits every node in the search radius (~50,000 city-scale)", "stats": {"nodes_explored": 8, "latency": "~200ms"}}, {"highlight": [0,2,4,6], "label": "CH preprocessing: low-importance nodes (odd indices) are contracted, shortcut edges added across them", "stats": {"shortcuts_created": 4, "phase": "offline preprocessing (~30 min)"}}, {"highlight": [0,7], "label": "CH query: start → end resolved via precomputed shortcuts — only ~2 hops touched", "stats": {"nodes_explored": 2, "latency": "<1ms", "speedup": "~200x"}} ], "speed": 1000 }
\`\`\`

## Real-Time Traffic: The Data Flywheel

Uber has an advantage no mapping company can replicate: **625,000 GPS updates per second** from its own driver fleet. Every active driver is a rolling traffic sensor.

\`\`\`
Driver GPS probes → Map matching → Actual speed per road segment
                                            ↓
                       Edge weight update (every 2 min)
                       Congestion heat map
                       Historical pattern reinforcement
\`\`\`

When real-time data is sparse — a rarely-driven rural road at 3 AM — the system falls back to **historical Bayesian priors** built from years of trips on that segment at that hour on that day of week.

\`\`\`callout
{ "type": "info", "title": "Why Own Probes Beat Any Commercial Traffic API", "content": "Uber processes 625,000 GPS location updates per second from its own driver fleet. This gives sub-two-minute traffic updates on specific road segments — far more granular than any commercial traffic feed. Using an external API would also create a vendor dependency on Uber's most critical accuracy metric." }
\`\`\`

## ML-Based ETA Correction: DeepETA

The routing engine gives a physics-based answer. Physics doesn't know it's raining, or that there's a stadium event two blocks away, or that pickups on this particular street take 90 extra seconds because there's no legal stopping zone.

Uber replaced their XGBoost model with **DeepETA**, a deep neural network designed to be low-latency (a few milliseconds), globally general (all lines of business), and significantly more accurate than the XGBoost baseline — measured by mean absolute error (MAE).

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Routing Engine Only (Physics)", "code": "Route: Riverside Dr → Hwy 101 → Market St\\nBase ETA: 14.2 minutes\\n\\nFactors used:\\n  [OK] Road distances\\n  [OK] Speed limits (road type)\\n  [OK] Current traffic (GPS probes)\\n\\nFactors missing:\\n  [--] Weather conditions\\n  [--] Day-of-week rush patterns\\n  [--] Nearby events (stadium, concert)\\n  [--] Pickup/dropoff delay (finding car, walking)" }, "after": { "label": "Routing Engine + DeepETA Correction", "code": "Route: Riverside Dr → Hwy 101 → Market St\\nBase ETA: 14.2 minutes\\n\\nDeepETA corrections:\\n  +1.8 min  Friday evening rush pattern\\n  +0.9 min  Rain detected (~15% increase)\\n  +0.3 min  Stadium event 0.4 km from drop-off\\n  -0.9 min  Segment historically faster than limit\\n  +0.8 min  Estimated pickup delay (this street)\\n\\nFinal ETA: 17.1 minutes\\nMedian absolute error: ~1.5 minutes" } }
\`\`\`

## Map Matching: Snapping Noise to Roads

Raw GPS is noisy — coordinates may land in the middle of a building, on a parallel highway, or report a stale position during a tunnel crossing. **Map matching** snaps GPS points to the correct road segment before any routing or traffic computation happens.

Uber uses a **Hidden Markov Model (HMM)**:

- **States:** candidate road segments within range of the GPS point
- **Emission probability:** how likely is this GPS reading *given* this road segment (distance-based)
- **Transition probability:** is the shortest path between consecutive candidate segments physically plausible given elapsed time and vehicle speed?

The HMM resolves ambiguous cases — parallel roads, GPS drift in urban canyons, tunnels where signal drops for 30 seconds — correctly. It considers the *sequence* of positions, not just each point in isolation.

## Scale Numbers

| Metric | Value |
|---|---|
| ETA queries | 60,000/s peak |
| Routing latency (CRP) | < 1ms |
| ML correction latency | < 10ms |
| Total ETA latency | < 20ms end-to-end |
| Traffic update frequency | Every 2 minutes per segment |
| Road graph update (CRP Phase 2) | Every 5 minutes |
| GPS probe throughput | 625,000 points/s |
| ETA accuracy | Median absolute error ~1.5 min |
| Road graph size | ~500M nodes, ~1.2B edges (~50 GB) |

## Design Trade-offs

| Decision | Choice | Alternative | Rationale |
|---|---|---|---|
| Routing algorithm | CRP | Dijkstra, A* | Sub-ms queries with live traffic support; no full rebuild on traffic change |
| Traffic source | Own GPS probes | Commercial traffic API | 625K probes/s granularity impossible to buy; no vendor dependency |
| ETA model | Graph + DeepETA correction | Pure end-to-end ML | Physics baseline is always sound; ML corrects the residual the graph can't see |
| Map matching | HMM | Nearest-road snap | Handles parallel roads, tunnels, GPS drift — single-point snap fails all three |
| Graph storage | In-memory per service | External DB | < 20ms budget eliminates network round-trips entirely |

\`\`\`quiz
{ "title": "ETA Calculation: Knowledge Check", "questions": [ { "question": "Why does Dijkstra's algorithm fail to meet Uber's ETA latency requirements at city scale?", "options": [ "It cannot handle directed graphs with traffic-weighted edges", "It explores ~50,000 nodes per city-scale query taking ~200ms — unsustainable at 60,000 queries/second", "It requires the full road graph to be rebuilt on every query", "It cannot incorporate real-time traffic weights at all" ], "answer": 1, "explanation": "Dijkstra explores nodes radially in all directions. A 10 km city query visits ~50,000 nodes taking ~200ms. At 60,000 ETA queries/second that implies 12,000 parallel cores just for city-scale. Contraction Hierarchies reduces explored nodes to ~500 and latency to < 1ms — a ~200× speedup." }, { "question": "What key advantage does CRP (Customizable Route Planning) have over standard Contraction Hierarchies?", "options": [ "CRP requires no preprocessing step at all", "CRP splits preprocessing into a static topology phase and a dynamic weight phase — traffic updates re-run only the weight phase (~1s) rather than the full 30-minute build", "CRP reduces the road graph size by eliminating low-importance nodes permanently", "CRP supports bidirectional A* search which CH cannot use" ], "answer": 1, "explanation": "Standard CH bakes edge weights into its preprocessing, so any traffic change requires a full ~30-minute reprocessing pass. CRP separates topology (done once) from metric/weights (re-run every 5 minutes in ~1 second). This lets Uber reflect live traffic in routing queries within minutes of a change." }, { "question": "What ML model did Uber replace with DeepETA, and what were the key design goals of the replacement?", "options": [ "Random Forest → better feature interpretability for regulatory compliance", "LSTM → reduced memory footprint for on-device inference", "XGBoost → improved MAE accuracy with low latency (few ms) and generality across all lines of business globally", "Logistic Regression → support for streaming feature updates without retraining" ], "answer": 2, "explanation": "Uber's incumbent ETA correction model was XGBoost (gradient boosted trees). DeepETA — a deep neural network — replaced it targeting: significantly lower MAE versus XGBoost, inference latency of a few milliseconds, and generality across Uber's full global operation (mobility, delivery, etc.)." }, { "question": "Why does Uber use a Hidden Markov Model for map matching rather than simply snapping GPS to the nearest road?", "options": [ "HMM is faster than nearest-road lookup for large datasets", "Nearest-road snap cannot handle any noise whatsoever", "HMM considers the full sequence of positions and transition probabilities, correctly resolving parallel roads, tunnels, and GPS drift that a single-point nearest-road lookup would misclassify", "HMM can predict future GPS positions, reducing overall system latency" ], "answer": 2, "explanation": "Nearest-road snap is a single-point operation — it fails when a GPS reading is equidistant between a highway and a parallel service road, or when a driver exits a tunnel and the last known position is stale. HMM models the full sequence: emission probability (how likely is this GPS given this segment?) and transition probability (is the path between consecutive candidates physically plausible given speed and time?). This resolves all three ambiguous cases correctly." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "ETA drives matching, pricing, and routing simultaneously — it is a core decision input, not a display metric.", "Contraction Hierarchies reduces routing from O((V+E) log V) Dijkstra to < 1ms by precomputing shortcut edges across low-importance nodes, achieving ~200× speedup.", "CRP extends CH by splitting preprocessing into a static topology phase (once, ~30 min) and a dynamic weight phase (every 5 min, ~1 sec) — enabling live traffic without full graph rebuilds.", "Uber's 625,000 GPS probe updates/second give it real-time per-segment traffic data more granular than any commercial feed, updated every 2 minutes.", "DeepETA (deep neural network) replaced XGBoost to correct the physics-based routing ETA for weather, events, and pickup delays — achieving ~1.5-minute median absolute error.", "Map matching uses a Hidden Markov Model over GPS sequences, not simple nearest-road snap, to correctly handle parallel roads, urban canyon drift, and tunnel blackouts.", "The road graph (~500M nodes, ~1.2B edges, ~50 GB) lives entirely in-memory per regional service — the < 20ms end-to-end budget makes external DB reads structurally impossible." ] }
\`\`\``,
    },
    {
      id: "uber-architecture-walkthrough",
      slug: "uber-architecture-walkthrough",
      title: "Architecture Walkthrough",
      content: `# Uber: Complete Architecture Walkthrough

Every time a rider taps "Request," dozens of distributed services fire in coordinated sequence — all within 10 seconds. This lesson traces that full path: from the architecture that makes it possible, to the data flowing through each service boundary, to the failure modes engineers actively defend against.

\`\`\`concept
{ "title": "The Core Integration Challenge", "variant": "mental-model", "content": "Uber is not one hard problem — it's five medium-hard problems that must coordinate with sub-second latency: geospatial indexing (where are drivers?), real-time matching (which driver wins?), dynamic pricing (what does it cost?), ETA prediction (how long?), and reliable payments (how does money flow?). Each service can be reasoned about independently. The failure modes emerge at the seams between them." }
\`\`\`

## Full System Architecture

The platform decomposes into independently scalable microservices, each backed by the data store that fits its specific access pattern — there is no single database.

\`\`\`mermaid
graph TD
    DNS["DNS / GeoDNS"] --> GW["API Gateway\\nauth · rate limit · routing"]

    GW --> TS["Trip Service\\nlifecycle · state machine"]
    GW --> ME["Matching Engine\\nscore · assign · batch"]
    GW --> PS["Pricing Service\\nsurge · fare · upfront"]
    GW --> ETA["ETA Service\\nrouting · traffic · ML"]
    GW --> PAY["Payment Service\\ncharge · payout · ledger"]

    TS --> GI["Geo Index\\nH3 + in-memory"]
    ME --> GI
    ME --> SD["Supply/Demand Tracker\\nRedis"]
    PS --> SD
    ETA --> RG["Road Graph\\nin-memory per node"]
    PAY --> PG["Payment Gateway\\nStripe · Braintree"]

    LS["Location Service\\n625K GPS updates/s"] --> GI
    LS --> RD["Redis\\nlatest driver position"]
    LS --> KF["Kafka\\nevent stream"]
    KF --> DP["Data Platform\\nSpark / Flink → Data Lake"]

    style LS fill:#1e3a5f,stroke:#3b82f6,color:#fff
    style ME fill:#1e3a5f,stroke:#3b82f6,color:#fff
    style GI fill:#1e3a5f,stroke:#3b82f6,color:#fff
\`\`\`

\`\`\`callout
{ "type": "info", "title": "The Hottest Write Path in the System", "content": "The Location Service ingests **625,000 GPS updates per second** at Uber's scale — one ping per active driver every 4 seconds. It fans out to three consumers simultaneously: the geo index (for matching), Redis (for latest position reads), and Kafka (for the data platform and trip tracking). A failure here cascades across every downstream service." }
\`\`\`

## Data Flow: Rider Requests a Ride

Let's trace a complete ride from open-app to payment receipt, following data through each service boundary.

\`\`\`steps
{
  "title": "From Tap to Arrival: The Complete Ride Lifecycle",
  "steps": [
    {
      "title": "Step 1 — Rider Opens App",
      "content": "The rider app establishes a **WebSocket connection immediately** — surge data and nearby driver markers are already streaming before the rider books anything.\\n\\nWhen the rider sets a destination, two API calls fire in parallel:\\n\\n- \`GET /v1/products?lat=40.712&lng=-74.006\` → available products (UberX, Comfort, XL) with current surge multipliers\\n- \`POST /v1/fare-estimate\` → ETA Service (pickup: 4 min, trip: 22 min) + Pricing Service (base $25.13 × 1.8× surge = **$48.23 upfront**)\\n\\nThe upfront price is guaranteed before confirmation — no meter surprises at the destination."
    },
    {
      "title": "Step 2 — Rider Confirms",
      "content": "\`POST /v1/trips/request\` triggers three things in sequence:\\n\\n1. Trip Service creates a trip record with status **REQUESTING**\\n2. Fare estimate is locked for **5 minutes** — protecting the rider from surge changes while matching runs\\n3. Request is forwarded to the Matching Engine"
    },
    {
      "title": "Step 3 — Driver Matching",
      "content": "The Matching Engine runs a geospatial scoring pipeline:\\n\\n1. Geo Service returns **32 available UberX drivers** within 5 km\\n2. Batch ETA computation across all candidates (~50 ms total)\\n3. Score each driver: \`ETA × rating × wait_time × direction_alignment\`\\n4. Top driver selected (2.8 min ETA, 4.9 ★)\\n5. Atomic lock: \`SETNX lock:driver_id\` in Redis with **15 s TTL**\\n6. Push notification sent — driver has 15 seconds to accept\\n\\nIf the driver declines or times out, the system falls to the next candidate. The full round-trip must complete in **under 10 seconds** from the rider's perspective."
    },
    {
      "title": "Step 4 — Driver En Route",
      "content": "After the driver accepts:\\n\\n- Status: **REQUESTING → ACCEPTED → EN_ROUTE_TO_PICKUP**\\n- Driver app receives turn-by-turn navigation to the pickup point\\n- GPS pings fire every **4 seconds** → Location Service → Kafka topic\\n- Rider app receives driver position over the open **WebSocket**, rendering the moving car icon in real time"
    },
    {
      "title": "Step 5 — Pickup and Trip",
      "content": "Driver taps **Start Trip** once the rider is in the vehicle:\\n\\n- Status: **EN_ROUTE_TO_PICKUP → ARRIVED → IN_PROGRESS**\\n- Navigation switches from pickup route to destination route\\n- GPS tracking continues throughout for safety monitoring, route deviation alerts, and the SOS button\\n- Both rider and driver see real-time progress on their maps"
    },
    {
      "title": "Step 6 — Completion and Payment",
      "content": "Driver taps **Complete Trip** at the destination:\\n\\n- Status: **IN_PROGRESS → COMPLETED**\\n- Final fare: $48.23 (upfront price honored — no adjustment)\\n- Payment Service charges the rider's card immediately\\n- Driver payout: $48.23 × 0.75 = **$36.17**; Uber commission: **$12.06**\\n- Transaction recorded in the financial ledger with full audit trail\\n- Mutual rating prompts dispatched to both parties"
    }
  ]
}
\`\`\`

## Trip State Machine

Every trip is a finite state machine. State transitions are published as events to Kafka — any service that needs to react (push notifications, payment, data platform) subscribes to the relevant transition rather than polling trip status.

\`\`\`mermaid
stateDiagram-v2
    [*] --> REQUESTING : Rider confirms ride
    REQUESTING --> ACCEPTED : Driver accepts offer
    REQUESTING --> NO_DRIVERS_AVAILABLE : Timeout, no match
    ACCEPTED --> EN_ROUTE_TO_PICKUP : Driver navigating
    ACCEPTED --> DRIVER_CANCELLED : Driver cancels
    EN_ROUTE_TO_PICKUP --> ARRIVED : Driver at pickup point
    EN_ROUTE_TO_PICKUP --> RIDER_CANCELLED : Rider cancels
    ARRIVED --> IN_PROGRESS : Trip started
    IN_PROGRESS --> COMPLETED : Driver ends trip
    COMPLETED --> DISPUTED : Payment issue flagged
    COMPLETED --> [*]
    NO_DRIVERS_AVAILABLE --> [*]
    DRIVER_CANCELLED --> [*]
    RIDER_CANCELLED --> [*]
    DISPUTED --> [*]
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why the Trip Service Owns the State Machine Exclusively", "content": "The Trip Service is the **only** service allowed to transition trip status — all others react to Kafka state-change events rather than writing directly to the trip record. This prevents race conditions like a simultaneous driver cancel and rider cancel both trying to write \`CANCELLED\` at the same instant, where the final state would depend on who wrote last." }
\`\`\`

## Storage, Reliability, and Scale

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Databases",
      "icon": "🗄️",
      "content": "No single database fits every access pattern. Each service uses the store that matches its reads and writes.\\n\\n| Data | Store | Why |\\n|------|-------|-----|\\n| Trip records | PostgreSQL (sharded) | ACID guarantees for financial data |\\n| Driver location (current) | Redis + in-memory geo index | Sub-ms reads, 625K writes/s |\\n| Driver location (history) | Kafka → S3 / HDFS | Append-only, petabyte-scale |\\n| Supply/demand per zone | Redis | Real-time counters with TTL |\\n| Road graph | In-memory (per ETA instance) | < 5 ms routing — no network hop tolerated |\\n| User profiles | PostgreSQL | Relational, moderate write volume |\\n| Payments / ledger | PostgreSQL (sharded) | Strong consistency, full audit trail |"
    },
    {
      "label": "Reliability",
      "icon": "🛡️",
      "content": "Every critical service has a degradation path — partial functionality beats total failure.\\n\\n| Failure | Impact | Mitigation |\\n|---------|--------|------------|\\n| Matching Engine down | Rides cannot be matched | Multiple replicas; queue requests in Kafka |\\n| Location Service down | Geo index becomes stale | Sharded replicas; drivers buffer GPS locally |\\n| ETA Service down | Fare estimates and matching break | Fallback: straight-line distance × speed factor |\\n| Payment Service down | Trips cannot complete billing | Queue completion events; process async on recovery |\\n| Redis cluster down | Surge stale, locks lost | Sentinel failover; default to 1.0× (no surge) |"
    },
    {
      "label": "Scaling",
      "icon": "📈",
      "content": "Each component scales independently to its own bottleneck — no shared scaling constraint.\\n\\n| Component | Throughput | Strategy |\\n|-----------|------------|----------|\\n| API Gateway | ~100K req/s | Horizontal, regional deployment |\\n| Location Service | 625K updates/s | Sharded by H3 cell, 32 instances |\\n| Matching Engine | 1,500 matches/s | Stateless, horizontally scaled |\\n| ETA Service | 60K queries/s | In-memory road graph, CRP algorithm |\\n| Pricing Service | 5K fare calcs/s | Stateless, Redis-backed surge cache |\\n| Trip Database | 25M trips/day | PostgreSQL sharded by city |\\n| Kafka | 1M events/s | Partitioned by entity type |"
    }
  ]
}
\`\`\`

\`\`\`collapse
{
  "title": "Deep Dive: The Distributed Lock Problem in Matching",
  "content": "When the Matching Engine selects a driver, two races must be prevented simultaneously.\\n\\n**Race 1 — Double Assignment:** Two ride requests could both select driver D-ghi789, both acquire no lock, and both send offers before either receives a response. Which rider gets the driver is undefined.\\n\\n**Solution:** \`SETNX lock:D-ghi789\` in Redis. This is atomic at the Redis level — only one caller sets the key. The losing request gets a nil return and falls through to its next-best candidate automatically.\\n\\n**Race 2 — Timeout Handling:** The driver has 15 seconds to accept. If they ignore the push notification, something must release the lock or that driver is frozen out of the system indefinitely.\\n\\n**Solution:** A TTL on the lock key (15 s). When the key expires, no cleanup code is needed — the next matching request can lock the driver as if nothing happened.\\n\\n**The subtle edge case:** What if the driver accepts after the TTL expires, but the app message was delayed by a flaky network? The Trip Service validates that the lock is still held at confirmation time before writing the ACCEPTED state. A stale acceptance from an expired lock is rejected, preventing a ghost assignment where the driver thinks they have a rider but the system has already moved on."
}
\`\`\`

\`\`\`quiz
{
  "title": "Architecture Walkthrough: Check Your Understanding",
  "questions": [
    {
      "question": "What is the primary purpose of the Redis SETNX lock acquired during driver matching?",
      "options": [
        "Cache the upfront fare estimate for 5 minutes while matching runs",
        "Prevent two simultaneous ride requests from being assigned to the same driver",
        "Track the driver's GPS position during navigation to the pickup point",
        "Queue the ride request if no drivers are currently available in the area"
      ],
      "answer": 1,
      "explanation": "SETNX (SET if Not eXists) is an atomic Redis operation — only one caller can set a given key. If two matching requests race to lock the same driver, exactly one wins and the other falls through to its next candidate. The 15-second TTL handles driver non-response automatically: when the key expires, the next candidate can be locked without any manual cleanup code."
    },
    {
      "question": "Why is the road graph stored in-memory within each ETA Service instance rather than in a shared database?",
      "options": [
        "Graph databases don't support the routing algorithms Uber uses at scale",
        "The road network changes too frequently for any database to keep up",
        "Routing queries must complete in under 5 ms — any network round-trip alone exceeds that budget",
        "In-memory storage is significantly cheaper than running a dedicated graph database cluster"
      ],
      "answer": 2,
      "explanation": "The ETA Service handles 60,000 routing queries per second with a < 5 ms latency target. A single network hop to a remote database adds 1–5 ms alone, immediately blowing the budget. The road graph is large but largely static (updated in periodic batch jobs), making per-instance in-memory storage practical at the cost of some memory per ETA node."
    },
    {
      "question": "What happens to trip completion and payment if the Payment Service goes down mid-ride?",
      "options": [
        "The trip is automatically cancelled and the rider is not charged",
        "The driver must collect cash from the rider as an emergency fallback",
        "The completion event is queued and the payment is processed asynchronously when the service recovers",
        "The Trip Service takes over payment processing using a built-in fallback ledger"
      ],
      "answer": 2,
      "explanation": "Trip state management is deliberately decoupled from payment processing. When the trip completes, a COMPLETED event is published to Kafka. The Payment Service consumes that event whenever it recovers, ensuring eventual financial consistency. The rider sees the trip as completed immediately — the charge may settle slightly later, but it is never lost."
    },
    {
      "question": "During EN_ROUTE_TO_PICKUP, how does the rider's app receive real-time driver position updates?",
      "options": [
        "The rider app polls the Trip Service API every 4 seconds for the latest driver coordinates",
        "The Matching Engine continuously pings the driver and relays position updates to the rider",
        "GPS pings flow through Location Service → Kafka topic → WebSocket server → rider app",
        "The ETA Service streams predicted positions forward along the planned route"
      ],
      "answer": 2,
      "explanation": "Every 4 seconds the driver app sends a GPS ping to the Location Service. The Location Service publishes to a Kafka topic. A WebSocket server consumes that topic and pushes position updates to the rider's open connection. This fan-out pattern decouples the high-frequency write path (Location Service) from push delivery (WebSocket server), so each can scale and fail independently."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Uber decomposes into five independently scalable services — geospatial indexing, matching, pricing, ETA, and payment — each with a data store chosen for its specific access pattern.",
    "The Location Service is the system's hottest write path at 625K GPS updates/second; it fans out simultaneously to the geo index, Redis, and Kafka.",
    "Driver matching uses Redis SETNX with a 15-second TTL to atomically prevent double-assignment and automatically handle driver timeouts without cleanup code.",
    "The Trip Service is the sole authority for state transitions; all other services react to Kafka state-change events rather than writing directly to the trip record.",
    "Every critical service has a graceful degradation path: ETA falls back to straight-line distance, Payment queues completions asynchronously, Matching queues requests in Kafka.",
    "The road graph lives in-memory per ETA instance — not in a shared database — because 60K routing queries/second require under 5 ms latency, and no network hop fits in that budget."
  ]
}
\`\`\``,
    },
  ],
};
