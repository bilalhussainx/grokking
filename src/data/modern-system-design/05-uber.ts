import { Module } from "../types";

export const uberModule: Module = {
  id: "design-uber",
  title: "Design Uber",
  description:
    "Design a ride-sharing platform: geospatial indexing, real-time matching, dynamic pricing, and ETA prediction at global scale.",
  lessons: [
    {
      id: "uber-requirements-scale",
      slug: "uber-requirements-scale",
      title: "Requirements & Scale",
      content: `# Design Uber: Requirements & Scale

## Functional Requirements

Design a global ride-sharing platform like Uber. Core features:

1. **Rider requests a ride** — Specify pickup and dropoff locations
2. **Driver matching** — Match the rider with the best available driver
3. **Real-time tracking** — Both rider and driver see each other's location on a map
4. **ETA calculation** — Estimated time of arrival for pickup and destination
5. **Dynamic pricing** — Surge pricing when demand exceeds supply
6. **Trip management** — Start, track, and complete a trip with fare calculation
7. **Payments** — Charge rider, pay driver, handle tips
8. **Rating** — Both rider and driver rate each other after each trip

## Non-Functional Requirements

- **Availability**: 99.99% — downtime means stranded riders
- **Latency**: Ride matching < 10 seconds; location updates < 1 second
- **Consistency**: A driver must never be matched to two riders simultaneously
- **Scalability**: Handle 10M+ concurrent active users across 10,000+ cities

## Scale Estimation

### Users and Trips

\`\`\`
Monthly active riders:    130 million
Monthly active drivers:   5 million
Trips per day:            ~25 million
Trips per second (avg):   25M / 86,400 ≈ 290 trips/s
Peak trips/s:             290 × 5 = ~1,450 trips/s
\`\`\`

### Location Updates

\`\`\`
Active drivers sending GPS:  5M drivers × ~50% online = 2.5M
Update frequency:            Every 4 seconds
Location updates/second:     2.5M / 4 = 625,000 updates/s
Each update:                 ~200 bytes (lat, lng, heading, speed, timestamp)
Bandwidth for location:      625K × 200 bytes = 125 MB/s ingest
\`\`\`

### Storage

\`\`\`
Trip records/day:     25M × 2 KB = 50 GB/day
Location history:     625K/s × 200 bytes × 86,400 = 10.8 TB/day
Annual trip storage:  50 GB × 365 = 18.25 TB/year
Annual location:      10.8 TB × 365 = ~3.9 PB/year
\`\`\`

## Key Challenges

| Challenge | Why It's Hard |
|-----------|--------------|
| **625K location updates/s** | Continuous high-throughput geospatial writes |
| **Matching in < 10 seconds** | Find nearest available driver from millions |
| **Geospatial queries** | "Find all drivers within 3 km" at 1,450 req/s |
| **Consistency in matching** | Prevent double-booking a driver |
| **Dynamic pricing** | Real-time supply/demand calculation per zone |

## High-Level Components

\`\`\`
┌─────────┐     ┌──────────┐     ┌──────────────┐
│ Rider   │────▶│ API GW / │────▶│ Trip Service │
│ App     │◀────│ Load     │     └──────┬───────┘
│         │     │ Balancer │            │
├─────────┤     └──────────┘     ┌──────┴───────┐
│ Driver  │          │           │ Matching     │
│ App     │◀─────────┘           │ Service      │
└─────────┘                      └──────┬───────┘
                                        │
                               ┌────────┼────────┐
                               ▼        ▼        ▼
                         ┌──────┐ ┌──────┐ ┌──────────┐
                         │Geo   │ │Pricing│ │Location  │
                         │Index │ │Service│ │Service   │
                         └──────┘ └──────┘ └──────────┘
\`\`\`

We will dive into each subsystem in the following lessons: location tracking, matching, pricing, and ETA calculation.`,
    },
    {
      id: "uber-location-tracking",
      slug: "uber-location-tracking",
      title: "Location Tracking & Geospatial Indexing",
      content: `# Uber: Location Tracking & Geospatial Indexing

## The Location Pipeline

Every active driver sends a GPS update every 4 seconds. At 2.5M active drivers, this produces 625,000 updates per second — a massive real-time data pipeline.

\`\`\`
Driver App ──GPS update──▶ API Gateway ──▶ Location Service
                                                │
                                    ┌───────────┼───────────┐
                                    ▼           ▼           ▼
                              ┌──────────┐ ┌──────────┐ ┌──────────┐
                              │ Geo Index│ │ Kafka    │ │ Redis    │
                              │ (H3 +   │ │ (history)│ │ (latest  │
                              │ in-memory│ │          │ │  position│
                              │ grid)   │ │          │ │  cache)  │
                              └──────────┘ └──────────┘ └──────────┘
\`\`\`

### Update Payload

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

## Geospatial Indexing: H3

Uber created **H3**, a hexagonal hierarchical spatial index. The entire world is divided into hexagonal cells at multiple resolutions.

\`\`\`
H3 Resolutions:
Resolution 0:  ~4.3M km² per hex (continent-scale)
Resolution 7:  ~5.16 km² per hex (city zone)
Resolution 9:  ~0.1 km² per hex (neighborhood block)
Resolution 12: ~0.003 km² per hex (single building)

Uber uses resolution 7 for supply/demand zones
and resolution 9 for driver proximity searches.
\`\`\`

### Why Hexagons?

\`\`\`
Square grid:              Hexagonal grid:
┌───┬───┬───┐            ╱╲  ╱╲  ╱╲
│   │   │   │           ╱  ╲╱  ╲╱  ╲
├───┼───┼───┤          ╱╲  ╱╲  ╱╲  ╱
│   │ X │   │  vs.    ╱  ╲╱ X╲╱  ╲╱
├───┼───┼───┤         ╲  ╱╲  ╱╲  ╱╲
│   │   │   │          ╲╱  ╲╱  ╲╱  ╲
└───┴───┴───┘

Square neighbors: 2 distances (side vs. diagonal)
Hex neighbors: all 6 neighbors equidistant
→ More uniform proximity queries
\`\`\`

### Geospatial Index Structure

\`\`\`
In-memory index (per Location Service instance):

H3 Cell 872830828ffffff:
  ├── D-abc123: {lat: 40.712, lng: -74.006, updated: 1710345600}
  ├── D-def456: {lat: 40.714, lng: -74.003, updated: 1710345598}
  └── D-ghi789: {lat: 40.711, lng: -74.008, updated: 1710345599}

H3 Cell 872830829ffffff:
  ├── D-jkl012: {lat: 40.718, lng: -74.012, ...}
  └── ...
\`\`\`

## Finding Nearby Drivers

When a rider requests a ride, the system must find available drivers nearby:

\`\`\`
Query: "Find available drivers within 3 km of (40.712, -74.006)"

Algorithm:
1. Compute H3 cell for rider's location → 872830828ffffff
2. Get k-ring of neighboring cells (radius ~3 km at res 9)
   → Returns ~61 cells (k=4 ring)
3. For each cell, lookup drivers from in-memory index
4. Filter: status == "available" AND last_update < 30s ago
5. Compute actual distance (Haversine) for each candidate
6. Sort by distance
7. Return top 10 nearest available drivers

Execution time: < 10ms (all in-memory)
\`\`\`

### Sharding the Geo Index

With 2.5M active drivers, one server cannot hold the entire index. Shard by H3 cell:

\`\`\`
Location Service Cluster (32 instances):

Instance 0:  H3 cells hashing to shard 0 (NYC downtown, ...)
Instance 1:  H3 cells hashing to shard 1 (NYC midtown, ...)
...
Instance 31: H3 cells hashing to shard 31

Shard assignment: hash(h3_cell) % 32

For a nearby-driver query spanning 61 cells:
  → Fan out to ~8-12 shards (cells near each other hash similarly)
  → Gather results, merge, return top 10
  → Total latency: ~20ms
\`\`\`

## Driver-to-Rider Location Streaming

Once matched, the rider needs real-time driver location:

\`\`\`
Driver App ──GPS (4s)──▶ Location Service
                              │
                              ├── Update geo index
                              └── Publish to Kafka topic: "trip-{trip_id}"
                                         │
                              Rider's device subscribes
                              via WebSocket / SSE
                                         │
                                         ▼
                              Rider App renders driver on map
\`\`\`

## Scale Numbers

\`\`\`
GPS updates ingested:   625K/s
Geo index size:         2.5M entries × ~200 bytes = ~500 MB in-memory
Nearby queries:         ~1,500/s (one per ride request)
Fan-out per query:      ~10 shards
Total geo reads:        ~15,000/s
Driver→rider streaming: ~10M active trips × 0.25 update/s = 2.5M pushes/s
\`\`\`

## Trade-offs

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| Spatial index | H3 hexagons | Geohash, R-tree, quadtree | Uniform distances, Uber-built |
| Index storage | In-memory (RAM) | Redis, PostGIS | Lowest latency for 625K/s writes |
| Update frequency | 4 seconds | 1 second | Balance accuracy vs. bandwidth |
| Sharding | By H3 cell hash | By city | Even distribution, handles hot zones |`,
    },
    {
      id: "uber-matching-algorithm",
      slug: "uber-matching-algorithm",
      title: "Matching Algorithm",
      content: `# Uber: Matching Algorithm

## The Matching Problem

When a rider requests a ride, the system must find the **best** driver — not just the nearest. "Best" considers:

- **Distance** — How far is the driver from the pickup?
- **ETA** — Actual drive time (traffic-aware), not straight-line distance
- **Driver rating** — Higher-rated drivers preferred
- **Trip profitability** — Does the driver's direction align with the trip?
- **Fairness** — Drivers waiting longer should get priority
- **Acceptance rate** — Drivers who cancel frequently are deprioritized

## Matching Architecture

\`\`\`
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ Rider    │───▶│ Trip Service │───▶│ Matching     │
│ requests │    │ - validate   │    │ Engine       │
│ ride     │    │ - fare est   │    │              │
└──────────┘    │ - create trip│    │ - candidate  │
                └──────────────┘    │   generation │
                                    │ - scoring    │
                                    │ - dispatch   │
                                    └──────┬───────┘
                                           │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                        ┌──────────┐ ┌──────────┐ ┌──────────┐
                        │ Geo      │ │ ETA      │ │ Supply   │
                        │ Service  │ │ Service  │ │ Tracker  │
                        │(nearby   │ │(route    │ │(driver   │
                        │ drivers) │ │ times)   │ │ state)   │
                        └──────────┘ └──────────┘ └──────────┘
\`\`\`

## Matching Flow

### Step 1: Candidate Generation

\`\`\`
Input: Rider at (40.712, -74.006), requesting UberX

1. Query Geo Service: "Available UberX drivers within 5 km"
   → Returns 47 candidates with positions

2. Filter:
   ├── Remove drivers with active trips (unless completing soon)
   ├── Remove drivers who declined this rider recently
   └── Remove drivers below minimum rating threshold

   → 32 candidates remain
\`\`\`

### Step 2: ETA Computation (Batch)

\`\`\`
For each of 32 candidates, compute ETA to pickup:

Batch ETA request to Routing Service:
  Input: 32 (driver_location → pickup_location) pairs
  Output: 32 ETAs accounting for real-time traffic

  Driver D-abc: 3.2 min (1.1 km, light traffic)
  Driver D-def: 4.1 min (2.3 km, moderate traffic)
  Driver D-ghi: 2.8 min (0.8 km, but red light cycle)
  ...

Latency: ~50ms for batch ETA (pre-computed road graph)
\`\`\`

### Step 3: Scoring

\`\`\`
Score each candidate using a weighted model:

score = w1 × normalize(ETA)
      + w2 × normalize(driver_rating)
      + w3 × normalize(wait_time)        # time since last trip
      + w4 × normalize(direction_bonus)   # heading toward pickup
      + w5 × normalize(acceptance_rate)

Typical weights:
  w1 (ETA):             0.40  — proximity matters most
  w2 (rating):          0.15
  w3 (wait_time):       0.20  — fairness to drivers
  w4 (direction):       0.15
  w5 (acceptance_rate): 0.10

Results:
  D-ghi: 0.87 (closest, high rating, waited 8 min)
  D-abc: 0.82 (slightly farther, very high rating)
  D-def: 0.71 (moderate distance, average rating)
  ...
\`\`\`

### Step 4: Dispatch

\`\`\`
1. Send ride offer to top-scored driver (D-ghi)
2. Driver has 15 seconds to accept/decline
3. If accepted → match confirmed, rider notified
4. If declined/timeout → offer to next driver (D-abc)
5. If 3 drivers decline → expand search radius from 5km to 8km
6. If no match after 60 seconds → notify rider "No drivers available"
\`\`\`

## Batch Matching (Optimization)

Instead of matching one rider at a time, Uber uses **batch matching**: accumulate ride requests over a short window (2-3 seconds) and solve the assignment globally.

\`\`\`
Batch window: 2 seconds
Riders in batch: [R1, R2, R3, R4, R5]
Available drivers: [D1, D2, D3, D4, D5, D6, D7]

Naive (greedy):           Batch (global optimization):
R1 → D1 (nearest)        R1 → D3
R2 → D4 (nearest)        R2 → D1 (closer after reassignment)
R3 → D6 (nearest)        R3 → D4
R4 → D7 (far!)           R4 → D6
R5 → D5 (far!)           R5 → D7

Greedy total ETA: 24 min     Batch total ETA: 18 min
                              (25% improvement)
\`\`\`

The batch matching problem is a variant of the **assignment problem**, solvable with the Hungarian algorithm or approximate methods at scale.

## Consistency: Preventing Double-Booking

A driver must never be matched to two riders simultaneously:

\`\`\`
Race condition:
  Thread 1: Check D-abc available? → YES
  Thread 2: Check D-abc available? → YES
  Thread 1: Assign D-abc to R1 ✓
  Thread 2: Assign D-abc to R2 ✗ (CONFLICT!)

Solution: Distributed lock per driver

  SETNX lock:D-abc {trip_id: T-123} EX 15

  Thread 1: SETNX lock:D-abc → OK (acquired)
  Thread 2: SETNX lock:D-abc → FAIL (already locked)
  Thread 2 → try next driver

  Lock TTL: 15 seconds (auto-release if no response)
\`\`\`

## Forward Dispatch

When a driver is about to complete a trip, pre-match them with a waiting rider near the destination:

\`\`\`
Driver D-abc:
  Current trip: dropping off at (40.730, -73.990) in 3 minutes

Rider R-456:
  Waiting at (40.728, -73.988) — 200m from dropoff

Forward dispatch:
  → Match D-abc to R-456 now
  → D-abc finishes current trip → immediately picks up R-456
  → Zero idle time for driver, shorter wait for rider
\`\`\`

## Scale Numbers

\`\`\`
Matching requests:      ~1,500/s peak
Candidates per match:   30-50 drivers evaluated
ETA computations:       1,500 × 40 = 60,000 ETA/s
Match latency:          < 5 seconds (p95)
Batch window:           2 seconds
Lock operations:        ~3,000/s (Redis SETNX)
Forward dispatch rate:  ~30% of all matches
\`\`\``,
    },
    {
      id: "uber-dynamic-pricing",
      slug: "uber-dynamic-pricing",
      title: "Dynamic Pricing",
      content: `# Uber: Dynamic Pricing (Surge)

## Why Dynamic Pricing?

In a two-sided marketplace, supply (drivers) and demand (riders) fluctuate independently. When demand exceeds supply, riders wait longer and drivers cherry-pick trips. Dynamic pricing solves this by:

1. **Reducing demand** — Higher prices deter non-urgent rides
2. **Increasing supply** — Surge multiplier attracts more drivers to the area
3. **Balancing the market** — Price finds equilibrium where supply meets demand

## Zone-Based Supply/Demand

The city is divided into zones (H3 resolution 7, ~5 km² per hexagon). Each zone independently tracks supply and demand:

\`\`\`
Zone: Midtown Manhattan (H3 cell 872830828ffffff)

Supply metrics (updated every 30s):
  ├── Available drivers:        45
  ├── Drivers en route to pickup: 12
  ├── Drivers completing trips:  28 (ETA to available: avg 8 min)
  └── Predicted supply in 10 min: 62

Demand metrics (updated every 30s):
  ├── Ride requests (last 5 min): 120
  ├── Unfulfilled requests:       18
  ├── Average wait time:          6.2 min
  └── Predicted demand in 10 min: 95

Supply/Demand ratio: 45/120 = 0.375 (severe undersupply)
\`\`\`

## Surge Multiplier Calculation

\`\`\`
                Surge Multiplier
        3.0x │         ╱─────
             │        ╱
        2.0x │      ╱
             │    ╱
        1.5x │  ╱
             │╱
        1.0x │──────
             └───────────────────
             1.0   0.5   0.25  ratio
         (balanced) (undersupply)

Supply/Demand Ratio → Surge Multiplier:
  > 1.0:  1.0x (no surge — oversupply)
  0.5-1.0: 1.0-1.5x (light surge)
  0.25-0.5: 1.5-2.5x (heavy surge)
  < 0.25: 2.5-3.0x (extreme surge, capped)
\`\`\`

## Pricing Architecture

\`\`\`
┌──────────┐    ┌──────────────┐    ┌──────────────────┐
│ Rider    │───▶│ Trip Service │───▶│ Pricing Service  │
│ opens app│    │              │    │                  │
│          │    │              │    │ ┌──────────────┐ │
│          │◀───│              │◀───│ │Base Fare     │ │
│ sees fare│    │              │    │ │+ Distance    │ │
│ estimate │    │              │    │ │+ Time        │ │
└──────────┘    └──────────────┘    │ │× Surge      │ │
                                    │ │+ Booking Fee │ │
                                    │ │= Total Est   │ │
                                    │ └──────────────┘ │
                                    │                  │
                                    │ Inputs:          │
                                    │ ├── Zone surge   │
                                    │ ├── Route dist   │
                                    │ ├── Time of day  │
                                    │ ├── Product type │
                                    │ └── Promotions   │
                                    └────────┬─────────┘
                                             │
                                    ┌────────▼─────────┐
                                    │ Supply/Demand    │
                                    │ Tracker          │
                                    │ (per H3 zone)    │
                                    └──────────────────┘
\`\`\`

## Fare Calculation

\`\`\`
Base fare formula:
  fare = base_fare
       + (distance_km × per_km_rate)
       + (trip_duration_min × per_min_rate)
       + booking_fee

With surge:
  fare = (base_fare + distance + time) × surge_multiplier
       + booking_fee  (not surged — regulatory requirement)

Example (UberX, NYC):
  Base fare:     $2.55
  Per km:        $1.75 × 8.5 km = $14.88
  Per minute:    $0.35 × 22 min = $7.70
  Subtotal:      $25.13
  Surge (1.8x):  $25.13 × 1.8 = $45.23
  Booking fee:   $3.00
  Total:         $48.23
\`\`\`

## Upfront Pricing

Modern Uber shows a **fixed price** before the rider confirms, not a metered fare:

\`\`\`
Rider sees: "$48.23" (locked in)

Calculation:
1. Route prediction: 8.5 km, 22 minutes (ML model)
2. Surge at pickup zone: 1.8x
3. Apply formula → $48.23
4. Price locked for 5 minutes (or until rider confirms)

If actual trip takes longer (traffic, detour):
  → Rider still pays $48.23 (Uber absorbs the difference)
If actual trip is shorter:
  → Rider still pays $48.23 (Uber keeps the margin)

Over millions of trips, the margins balance out.
Upfront pricing converts better (riders know the cost).
\`\`\`

## Surge Communication to Drivers

\`\`\`
Driver App heatmap:

  ┌─────────────────────────┐
  │   1.0x  │ 1.3x │ 1.0x │
  ├─────────┼──────┼───────┤
  │   1.5x  │ 2.1x │ 1.8x │  ← Red = high surge
  ├─────────┼──────┼───────┤
  │   1.0x  │ 1.2x │ 1.0x │
  └─────────────────────────┘

Drivers migrate toward high-surge zones
→ Supply increases in those zones
→ Surge decreases naturally
→ Market self-corrects in 5-15 minutes
\`\`\`

## Anti-Gaming Measures

| Attack | Mitigation |
|--------|-----------|
| Drivers collude to create artificial shortage | Detect sudden coordinated offline behavior; cap surge |
| Riders request/cancel to probe surge | Lock price on first request; rate-limit requests |
| Surge in events (concert ending) | Pre-position surge based on event schedule predictions |
| Flash surge from weather | ML model predicts weather-driven demand 30 min ahead |

## Scale Numbers

\`\`\`
Zone price updates:     ~100K zones × 1 update/30s = 3,333 updates/s
Price calculation:      ~1,500 fare estimates/s (at ride request)
Price cache:            Redis, per-zone surge multiplier, TTL 30s
Driver heatmap pushes:  2.5M drivers × 1 push/30s = 83K pushes/s
ML demand prediction:   Updated every 5 minutes per zone
\`\`\``,
    },
    {
      id: "uber-eta-calculation",
      slug: "uber-eta-calculation",
      title: "ETA Calculation",
      content: `# Uber: ETA Calculation

## Why ETA Matters

ETA (Estimated Time of Arrival) is the foundation of the Uber experience. It drives:
- **Rider expectations** — "Your driver arrives in 4 minutes"
- **Matching decisions** — Nearest by ETA, not straight-line distance
- **Fare calculation** — Upfront pricing depends on predicted trip duration
- **Driver routing** — Turn-by-turn navigation

A 10% improvement in ETA accuracy translates to measurable improvements in rider satisfaction and matching efficiency.

## Road Network Graph

The world's road network is represented as a weighted directed graph:

\`\`\`
Node: Intersection or road segment endpoint
Edge: Road segment connecting two nodes
Weight: Travel time (traffic-aware)

Graph size (global):
  Nodes: ~500 million intersections
  Edges: ~1.2 billion road segments
  Graph in memory: ~50 GB (compressed)

Each edge has:
  ├── Base travel time (speed limit, road type)
  ├── Historical travel time (day-of-week, hour)
  ├── Real-time travel time (current traffic)
  └── Turn penalties (left turns take longer)
\`\`\`

## ETA Architecture

\`\`\`
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ Request  │───▶│ ETA Service  │───▶│ Routing      │
│ (origin, │    │              │    │ Engine       │
│  dest)   │    │ 1. Map match │    │              │
└──────────┘    │ 2. Route     │    │ - Graph      │
                │ 3. Predict   │    │ - Dijkstra/  │
                │              │    │   CH/CRP     │
                └──────────────┘    └──────┬───────┘
                                           │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                        ┌──────────┐ ┌──────────┐ ┌──────────┐
                        │ Traffic  │ │ ML Model │ │ Road     │
                        │ Data     │ │ (residual│ │ Graph    │
                        │ (real-   │ │  predict)│ │ (OSM +   │
                        │  time)   │ │          │ │  probes) │
                        └──────────┘ └──────────┘ └──────────┘
\`\`\`

## Routing Algorithms

### Dijkstra's Algorithm (Baseline)

\`\`\`
Standard shortest-path on a weighted graph.
Time complexity: O((V + E) log V)

For a city-scale query (10 km):
  Nodes explored: ~50,000
  Latency: ~200ms

For a cross-city query (50 km):
  Nodes explored: ~500,000
  Latency: ~2 seconds

Too slow for 60,000 ETA queries/second.
\`\`\`

### Contraction Hierarchies (CH)

Pre-process the graph by adding "shortcut" edges that skip over unimportant nodes:

\`\`\`
Original:     A ──5──▶ B ──3──▶ C ──4──▶ D
              (must traverse all edges)

With shortcut: A ──5──▶ B ──────7──────▶ D
                        └──shortcut──────┘

Preprocessing: ~30 minutes for a city graph
Query time: O(log V) — typically < 1ms

Nodes explored: ~500 (vs. 50,000 for Dijkstra)
Speedup: ~200x
\`\`\`

### Customizable Route Planning (CRP)

An extension of CH that supports real-time traffic updates without full reprocessing:

\`\`\`
Preprocessing split into:
1. Metric-independent step (topology) → done once (~30 min)
2. Metric-dependent step (edge weights) → updated every 5 min

When traffic changes:
  - Only step 2 re-runs (~1 second)
  - Queries immediately use updated weights
  - No full graph rebuild needed
\`\`\`

## Real-Time Traffic Integration

\`\`\`
Traffic data sources:
├── Uber driver GPS probes: 625K updates/s
│   → Compute actual speed on each road segment
│   → Compare to speed limit → congestion level
│
├── Historical patterns:
│   → "This road is always slow at 8:30 AM on weekdays"
│   → Bayesian prior when real-time data is sparse
│
└── External feeds: road closures, accidents, construction

Traffic pipeline:
  GPS probes ──▶ Map matching ──▶ Speed computation
                                       │
                              ┌────────┼────────┐
                              ▼        ▼        ▼
                        Edge weight  Congestion  Traffic
                        update       heat map    predictions
\`\`\`

## ML-Based ETA Correction

The routing engine gives a physics-based ETA. An ML model applies corrections for factors the graph cannot capture:

\`\`\`
Routing engine ETA: 14.2 minutes

ML model considers:
├── Time of day (rush hour patterns)
├── Day of week (Friday evening vs. Tuesday)
├── Weather (rain adds ~15% to travel time)
├── Special events (game day near stadium)
├── Pickup/dropoff time (finding parking, walking to car)
└── Historical accuracy for this route

ML correction: +2.1 minutes
Final ETA: 16.3 minutes

Model: Gradient boosted trees (XGBoost)
Training data: Billions of completed trips
Accuracy: Median absolute error ~1.5 minutes
\`\`\`

## Map Matching

Raw GPS coordinates are noisy. Map matching snaps GPS points to the correct road segment:

\`\`\`
Raw GPS:  ★ (in the middle of a building)
          ↓ map match
Matched:  ● (on the nearest road segment)

Algorithm: Hidden Markov Model
  States: candidate road segments near GPS point
  Transitions: shortest path between consecutive candidates
  Emission: distance from GPS to road segment

Handles: tunnels, parallel roads, GPS drift, urban canyons
\`\`\`

## Scale Numbers

\`\`\`
ETA queries:           60,000/s peak
Routing latency:       < 5ms (Contraction Hierarchies)
ML correction:         < 10ms (pre-loaded model)
Total ETA latency:     < 20ms end-to-end
Traffic updates:       Every 2 minutes per road segment
Road graph updates:    Every 5 minutes (CRP metric step)
Map matching:          625K GPS points/s
ETA accuracy:          Median absolute error ~1.5 min
\`\`\`

## Trade-offs

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| Routing algorithm | CRP | Dijkstra, A* | Sub-ms queries with live traffic |
| Traffic source | Own GPS probes | Google Traffic API | 625K probes/s = unmatched coverage |
| ETA model | Graph + ML correction | Pure ML | Graph gives physical baseline; ML refines |
| Map matching | HMM | Nearest road snap | Handles parallel roads, GPS noise |
| Graph storage | In-memory per service | External DB | < 5ms query requirement |`,
    },
    {
      id: "uber-architecture-walkthrough",
      slug: "uber-architecture-walkthrough",
      title: "Architecture Walkthrough",
      content: `# Uber: Complete Architecture Walkthrough

## Full System Architecture

\`\`\`
                        ┌─────────────────────────┐
                        │      DNS / GeoDNS       │
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │     API Gateway         │
                        │  (auth, rate limit,     │
                        │   routing)              │
                        └────────────┬────────────┘
                                     │
          ┌──────────────────────────┼────────────────────────┐
          │               │          │          │              │
  ┌───────▼──────┐ ┌──────▼───┐ ┌───▼────┐ ┌───▼─────┐ ┌─────▼─────┐
  │ Trip         │ │ Matching │ │Pricing │ │ ETA     │ │ Payment   │
  │ Service      │ │ Engine   │ │Service │ │ Service │ │ Service   │
  │ - lifecycle  │ │ - score  │ │- surge │ │- routing│ │ - charge  │
  │ - state      │ │ - assign │ │- fare  │ │- traffic│ │ - payout  │
  │   machine    │ │ - batch  │ │- upfront│ │- ML    │ │ - ledger  │
  └──────┬───────┘ └────┬─────┘ └───┬────┘ └───┬────┘ └─────┬─────┘
         │              │           │           │            │
         └──────────┬───┴───────┬───┘           │            │
                    ▼           ▼               ▼            ▼
              ┌──────────┐ ┌──────────┐  ┌──────────┐ ┌──────────┐
              │ Geo      │ │ Supply/  │  │ Road     │ │ Payment  │
              │ Index    │ │ Demand   │  │ Graph    │ │ Gateway  │
              │ (H3 +   │ │ Tracker  │  │ (in-mem) │ │ (Stripe, │
              │ in-mem)  │ │ (Redis)  │  │          │ │  Braintree)
              └──────────┘ └──────────┘  └──────────┘ └──────────┘

              ┌──────────────────────────────────────┐
              │        Location Service              │
              │  625K GPS updates/s                  │
              │  ├── Update Geo Index                │
              │  ├── Publish to Kafka                │
              │  ├── Update Redis (latest position)  │
              │  └── Feed Traffic Pipeline           │
              └──────────────────────────────────────┘

              ┌──────────────────────────────────────┐
              │        Data Platform                 │
              │  Kafka → Spark/Flink → Data Lake     │
              │  - Trip analytics                    │
              │  - ML training data                  │
              │  - Surge model training              │
              │  - ETA model training                │
              └──────────────────────────────────────┘
\`\`\`

## Data Flow: Rider Requests a Ride

Let's trace a ride request from open-app to pickup:

### Step 1: Rider Opens App
\`\`\`
Rider app:
  ├── Fetch rider's GPS location
  ├── Call API: GET /v1/products?lat=40.712&lng=-74.006
  │   └── Returns available products (UberX, Comfort, XL) with surge
  ├── Rider enters destination
  └── Call API: POST /v1/fare-estimate
      ├── ETA Service: pickup ETA = 4 min, trip duration = 22 min
      ├── Pricing Service: base $25.13 × 1.8x surge = $48.23
      └── Returns: "UberX: $48.23, arrives in 4 min"
\`\`\`

### Step 2: Rider Confirms Ride
\`\`\`
POST /v1/trips/request
  ├── Trip Service creates trip record (status: REQUESTING)
  ├── Lock the fare estimate for 5 minutes
  └── Send to Matching Engine
\`\`\`

### Step 3: Driver Matching
\`\`\`
Matching Engine:
  ├── Query Geo Service: 32 available UberX drivers within 5 km
  ├── Batch ETA: compute pickup ETA for each (50ms)
  ├── Score candidates: ETA × rating × wait_time × direction
  ├── Select top driver: D-ghi789 (2.8 min ETA, 4.9 rating)
  ├── Acquire lock: SETNX lock:D-ghi789 (Redis, 15s TTL)
  └── Send ride offer to D-ghi789 via push notification

  D-ghi789 accepts within 8 seconds

  ├── Trip status: REQUESTING → ACCEPTED
  ├── Release lock (or let it expire)
  └── Notify rider: "Driver en route, 3 min away"
\`\`\`

### Step 4: Driver En Route to Pickup
\`\`\`
Driver app:
  ├── Receives turn-by-turn navigation to pickup
  ├── Sends GPS every 4 seconds → Location Service
  └── Location Service:
      ├── Update geo index
      ├── Publish to trip Kafka topic
      └── Rider app receives driver location via WebSocket
          → Renders moving car on map

Trip status: ACCEPTED → EN_ROUTE_TO_PICKUP
\`\`\`

### Step 5: Pickup and Trip
\`\`\`
Driver arrives, rider gets in:
  ├── Driver taps "Start Trip"
  ├── Trip status: EN_ROUTE_TO_PICKUP → IN_PROGRESS
  ├── Navigation switches to destination route
  └── Both rider and driver see progress on map

During trip:
  ├── GPS tracked continuously
  ├── Route deviations detected (driver took wrong turn)
  └── Safety features: trip sharing, SOS button
\`\`\`

### Step 6: Trip Completion and Payment
\`\`\`
Driver arrives at destination:
  ├── Driver taps "Complete Trip"
  ├── Trip status: IN_PROGRESS → COMPLETED
  ├── Final fare: $48.23 (upfront price — no metered surprise)
  ├── Payment Service:
  │   ├── Charge rider's card: $48.23
  │   ├── Calculate driver payout: $48.23 × 0.75 = $36.17
  │   ├── Uber commission: $12.06
  │   └── Record in financial ledger
  ├── Rider prompted to rate driver (1-5 stars)
  └── Driver prompted to rate rider (1-5 stars)
\`\`\`

## Trip State Machine

\`\`\`
REQUESTING → ACCEPTED → EN_ROUTE_TO_PICKUP → ARRIVED → IN_PROGRESS → COMPLETED
    │           │                │                                        │
    │           ▼                ▼                                        ▼
    │       DRIVER_          RIDER_                                   DISPUTED
    │       CANCELLED        CANCELLED
    │
    ▼
NO_DRIVERS_AVAILABLE
\`\`\`

## Key Databases

| Data | Store | Why |
|------|-------|-----|
| Trip records | PostgreSQL (sharded) | ACID for financial data |
| Driver location (current) | Redis + In-memory geo index | Sub-ms reads, 625K writes/s |
| Driver location (history) | Kafka → S3/HDFS | Append-only, petabyte-scale |
| Supply/demand per zone | Redis | Real-time counters, TTL |
| Road graph | In-memory (per ETA service) | < 5ms routing queries |
| User profiles | PostgreSQL | Relational, moderate scale |
| Payments/ledger | PostgreSQL (sharded) | Strong consistency, audit trail |

## Reliability

| Failure | Impact | Mitigation |
|---------|--------|------------|
| Matching Engine down | New rides cannot be matched | Multiple replicas; queue ride requests in Kafka |
| Location Service down | Geo index stale | Replicated shards; drivers buffer GPS locally |
| ETA Service down | Cannot estimate fares or match | Fallback to straight-line distance × factor |
| Payment Service down | Cannot complete trips | Queue completions; process payments async |
| Redis cluster down | Surge stale, locks lost | Sentinel failover; default to no-surge |

## Scaling Summary

| Component | Scale | Strategy |
|-----------|-------|----------|
| API Gateway | ~100K req/s | Horizontal, regional |
| Location Service | 625K updates/s | Sharded by H3 cell, 32 instances |
| Matching Engine | 1,500 matches/s | Stateless, horizontally scaled |
| ETA Service | 60K queries/s | In-memory graph, CRP algorithm |
| Pricing Service | 5K fare calcs/s | Stateless, Redis-backed surge cache |
| Trip DB | 25M trips/day | PostgreSQL sharded by city |
| Kafka | 1M events/s | Partitioned by entity type |`,
    },
  ],
};
