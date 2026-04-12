import { Module } from "../types";

export const marketplaceApiModule: Module = {
  id: "design-marketplace-api",
  title: "Design Marketplace API",
  description: "Design an Airbnb-like marketplace API — listing management, search, booking and availability, reviews, and two-sided marketplace trade-offs.",
  lessons: [
    {
      id: "marketplace-requirements",
      slug: "marketplace-requirements",
      title: "Requirements & Resource Modeling",
      content: `# Design Marketplace API: Requirements & Resource Modeling

Marketplace APIs are two-sided: they serve both **hosts** (sellers) and **guests** (buyers). This duality creates unique design challenges around authorization, search, and transactional workflows. Airbnb, Uber, and Etsy all face these challenges — and how you model resources up front determines how cleanly the rest of your API falls into place.

\`\`\`concept
{ "title": "The Two-Sided Marketplace Problem", "variant": "mental-model", "content": "Every request carries an implicit role. A listing belongs to a host, but any guest can view it. A booking is initiated by a guest, but a host must fulfill it. Your resource model must encode these role boundaries without duplicating entities — a user is always one record, but their permissions shift based on context." }
\`\`\`

---

## Step 1: Clarify Requirements

Before naming a single endpoint, an interviewer expects you to surface the scope. Talk through functional and non-functional requirements explicitly — it signals systems thinking.

\`\`\`steps
{ "title": "Requirements Clarification Checklist", "steps": [ { "title": "Functional: Host-side operations", "content": "- Create, update, and deactivate property listings\\n- Manage availability calendar (block dates, set pricing windows)\\n- View and respond to booking requests\\n- Submit reviews after guest checkout" }, { "title": "Functional: Guest-side operations", "content": "- Search listings by location, dates, price range, and amenities\\n- Check real-time availability for specific dates\\n- Request or instantly book a listing\\n- Submit reviews after a stay" }, { "title": "Non-functional: Search latency", "content": "Geo-queries over listings must be fast. This hints toward a dedicated search index (Elasticsearch, PostGIS) rather than a plain SQL \`WHERE\` clause on lat/lng. Mention this trade-off early — it affects your \`/search/listings\` resource shape." }, { "title": "Non-functional: Booking concurrency", "content": "Two guests could attempt to book the same listing for overlapping dates simultaneously. The API must guarantee at-most-one successful booking per date range. This is a consistency requirement, not a performance one — it points toward optimistic locking or database-level row locks in the booking transaction." }, { "title": "Non-functional: Pricing flexibility", "content": "Prices vary by date (weekends, holidays, demand). Storing a single \`price_per_night\` is insufficient. The availability resource must accommodate date-specific pricing, and the booking pricing breakdown must snapshot the prices at booking time — not recalculate them later." } ] }
\`\`\`

---

## Step 2: Identify Resources

Map your domain entities to URL hierarchies. A clean resource tree tells interviewers you understand REST's noun-centric model.

\`\`\`sysdiag
{ "title": "Marketplace Resource Hierarchy", "width": 680, "height": 380, "nodes": [ { "id": "user", "label": "/users", "x": 340, "y": 40, "kind": "service" }, { "id": "listing", "label": "/listings", "x": 160, "y": 150, "kind": "service" }, { "id": "booking", "label": "/bookings", "x": 520, "y": 150, "kind": "service" }, { "id": "availability", "label": "/listings/{id}/availability", "x": 60, "y": 280, "kind": "database" }, { "id": "photos", "label": "/listings/{id}/photos", "x": 220, "y": 280, "kind": "database" }, { "id": "reviews", "label": "/listings/{id}/reviews", "x": 380, "y": 280, "kind": "database" }, { "id": "search", "label": "/search/listings", "x": 560, "y": 280, "kind": "external" } ], "edges": [ { "from": "user", "to": "listing", "label": "hosts" }, { "from": "user", "to": "booking", "label": "guests" }, { "from": "listing", "to": "availability", "label": "sub-resource" }, { "from": "listing", "to": "photos", "label": "sub-resource" }, { "from": "listing", "to": "reviews", "label": "sub-resource" }, { "from": "listing", "to": "search", "label": "indexed by" } ], "annotations": { "user": "Single /users resource for both hosts and guests. Role is inferred from context — who owns the listing vs. who created the booking.", "search": "Separate /search namespace signals this resource hits a different data store (geo-index) than the primary /listings CRUD path.", "availability": "Nested under /listings because it has no meaning outside a listing. But booking availability checks are on /bookings." } }
\`\`\`

---

## Step 3: Resource Schemas

Good schema design in an interview shows you've thought about the consumer, not just the database. Walk through each field choice.

\`\`\`tabs
{ "tabs": [ { "label": "Listing", "icon": "🏠", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"lst_abc123\\",\\n  \\"host\\": {\\n    \\"id\\": \\"usr_host_001\\",\\n    \\"name\\": \\"Jane Doe\\",\\n    \\"avatar_url\\": \\"https://cdn.example.com/avatars/usr_host_001.jpg\\",\\n    \\"is_superhost\\": true,\\n    \\"response_rate\\": 0.98,\\n    \\"response_time\\": \\"within an hour\\"\\n  },\\n  \\"title\\": \\"Cozy Downtown Loft with Skyline View\\",\\n  \\"property_type\\": \\"apartment\\",\\n  \\"room_type\\": \\"entire_place\\",\\n  \\"location\\": {\\n    \\"city\\": \\"San Francisco\\",\\n    \\"state\\": \\"CA\\",\\n    \\"country\\": \\"US\\",\\n    \\"coordinates\\": { \\"lat\\": 37.7749, \\"lng\\": -122.4194 },\\n    \\"neighborhood\\": \\"SoMa\\"\\n  },\\n  \\"pricing\\": {\\n    \\"base_price\\": 15000,\\n    \\"currency\\": \\"usd\\",\\n    \\"cleaning_fee\\": 5000,\\n    \\"service_fee_percent\\": 14\\n  },\\n  \\"capacity\\": {\\n    \\"guests\\": 4,\\n    \\"bedrooms\\": 2,\\n    \\"beds\\": 3,\\n    \\"bathrooms\\": 1\\n  },\\n  \\"amenities\\": [\\"wifi\\", \\"kitchen\\", \\"parking\\", \\"air_conditioning\\", \\"washer\\"],\\n  \\"rating\\": {\\n    \\"average\\": 4.85,\\n    \\"count\\": 127,\\n    \\"breakdown\\": {\\n      \\"cleanliness\\": 4.9,\\n      \\"accuracy\\": 4.8,\\n      \\"communication\\": 5.0,\\n      \\"location\\": 4.7,\\n      \\"check_in\\": 4.9,\\n      \\"value\\": 4.8\\n    }\\n  },\\n  \\"rules\\": {\\n    \\"check_in_time\\": \\"15:00\\",\\n    \\"check_out_time\\": \\"11:00\\",\\n    \\"min_nights\\": 2,\\n    \\"max_nights\\": 30,\\n    \\"pets_allowed\\": false,\\n    \\"smoking_allowed\\": false\\n  },\\n  \\"status\\": \\"active\\",\\n  \\"instant_book\\": true,\\n  \\"created_at\\": \\"2024-06-15T10:00:00Z\\"\\n}\\n\`\`\`\\n\\n**Key schema decisions:**\\n- \`pricing.base_price: 15000\` = $150.00 in cents — prevents floating-point errors (same pattern as the Stripe API)\\n- Embedded \`host\` summary avoids a second round-trip when rendering search result cards\\n- \`rating.breakdown\` mirrors real-world Airbnb sub-scores: cleanliness, accuracy, communication, location, check-in, value\\n- \`status: \\"active\\"\` supports soft-delete — listings are deactivated, not deleted" }, { "label": "Booking", "icon": "📅", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"bkg_xyz789\\",\\n  \\"listing\\": { \\"id\\": \\"lst_abc123\\", \\"title\\": \\"Cozy Downtown Loft\\" },\\n  \\"guest\\": { \\"id\\": \\"usr_guest_001\\", \\"name\\": \\"Bob Smith\\" },\\n  \\"host\\": { \\"id\\": \\"usr_host_001\\", \\"name\\": \\"Jane Doe\\" },\\n  \\"check_in\\": \\"2025-04-15\\",\\n  \\"check_out\\": \\"2025-04-18\\",\\n  \\"nights\\": 3,\\n  \\"guests\\": 2,\\n  \\"pricing\\": {\\n    \\"base_total\\": 45000,\\n    \\"cleaning_fee\\": 5000,\\n    \\"service_fee\\": 7000,\\n    \\"total\\": 57000,\\n    \\"currency\\": \\"usd\\"\\n  },\\n  \\"status\\": \\"confirmed\\",\\n  \\"payment_intent\\": \\"pi_pay_001\\",\\n  \\"created_at\\": \\"2025-03-10T14:30:00Z\\"\\n}\\n\`\`\`\\n\\n**Key schema decisions:**\\n- \`check_in\`/\`check_out\` are **date strings**, not datetimes — check-in time is governed by \`listing.rules.check_in_time\`, not this field\\n- Pricing is **snapshotted** at booking creation — \`base_total\` is \`nights × base_price_at_booking_time\`, immune to future host price changes\\n- Both \`guest\` and \`host\` are embedded as summaries — the booking record is self-contained for receipts and disputes\\n- \`payment_intent\` links to the payment provider (Stripe-style) without storing card data" }, { "label": "Availability", "icon": "🗓️", "content": "The availability resource is the trickiest to model. Two common approaches:\\n\\n**Calendar block model** — store blocked date ranges:\\n\`\`\`json\\n{\\n  \\"listing_id\\": \\"lst_abc123\\",\\n  \\"blocked_ranges\\": [\\n    { \\"start\\": \\"2025-04-15\\", \\"end\\": \\"2025-04-18\\", \\"reason\\": \\"booked\\", \\"booking_id\\": \\"bkg_xyz789\\" },\\n    { \\"start\\": \\"2025-05-01\\", \\"end\\": \\"2025-05-07\\", \\"reason\\": \\"owner_block\\" }\\n  ],\\n  \\"default_available\\": true\\n}\\n\`\`\`\\n\\n**Per-day model** — store a row per date:\\n\`\`\`json\\n{\\n  \\"listing_id\\": \\"lst_abc123\\",\\n  \\"dates\\": [\\n    { \\"date\\": \\"2025-04-15\\", \\"available\\": false, \\"price\\": 15000 },\\n    { \\"date\\": \\"2025-04-16\\", \\"available\\": false, \\"price\\": 15000 },\\n    { \\"date\\": \\"2025-04-17\\", \\"available\\": false, \\"price\\": 18000 },\\n    { \\"date\\": \\"2025-04-18\\", \\"available\\": true, \\"price\\": 18000 }\\n  ]\\n}\\n\`\`\`\\n\\nThe per-day model is more flexible for **seasonal pricing** and simpler to query for availability checks. It's the right call for a marketplace with variable nightly rates." } ] }
\`\`\`

---

## Step 4: Endpoint Overview

| Method | Endpoint | Actor | Description |
|--------|----------|-------|-------------|
| \`POST\` | \`/listings\` | Host | Create listing |
| \`GET\` | \`/listings/{id}\` | Any | Get listing details |
| \`PATCH\` | \`/listings/{id}\` | Host | Update listing |
| \`DELETE\` | \`/listings/{id}\` | Host | Deactivate listing |
| \`GET\` | \`/search/listings\` | Guest | Search listings |
| \`GET\` | \`/listings/{id}/availability\` | Any | Check availability |
| \`PUT\` | \`/listings/{id}/availability\` | Host | Update availability calendar |
| \`POST\` | \`/bookings\` | Guest | Create booking |
| \`GET\` | \`/bookings/{id}\` | Host/Guest | Get booking |
| \`POST\` | \`/bookings/{id}/cancel\` | Host/Guest | Cancel booking |
| \`POST\` | \`/reviews\` | Host/Guest | Submit review |
| \`GET\` | \`/listings/{id}/reviews\` | Any | List reviews |

\`\`\`callout
{ "type": "tip", "title": "Why /search/listings is a separate namespace", "content": "A dedicated \`/search\` prefix signals to consumers (and interviewers) that this endpoint may be backed by a different system — an Elasticsearch or PostGIS index rather than your primary database. It also allows diverging query parameters (\`?near=lat,lng&radius=5km&check_in=...\`) without polluting the \`/listings\` collection endpoint." }
\`\`\`

---

## Key Design Decisions

These are the four decisions interviewers will probe. Have your reasoning ready.

\`\`\`tabs
{ "tabs": [ { "label": "Money in cents", "icon": "💰", "content": "All monetary values are stored and transmitted as **integer cents** — \`15000\` = $150.00.\\n\\nThis is the same approach used by the Stripe API. The reason: floating-point arithmetic is unreliable for currency. \`0.1 + 0.2 === 0.30000000000000004\` in JavaScript. Integer arithmetic is exact.\\n\\nThe \`currency\` field is always present alongside the amount. Multi-currency support is additive — you never need to change the amount semantics, only add exchange rate logic at presentation time." }, { "label": "Dual-role users", "icon": "👤", "content": "A single \`/users\` resource serves both hosts and guests. The same person can list a property on Monday and book a different one on Friday.\\n\\nRoles are **contextual, not structural**:\\n- You're a host when you own the listing being acted upon\\n- You're a guest when you created the booking being acted upon\\n\\nThis is enforced server-side via authorization checks, not by maintaining separate \`Host\` and \`Guest\` tables. Splitting users would create fan-out problems for shared state like payment methods, identity verification, and messaging." }, { "label": "Embedded summaries", "icon": "📦", "content": "Listing responses embed a \`host\` summary object rather than returning just \`host_id\`.\\n\\nThis is a **coarse-grained resource** decision. When rendering a search results page, you need the host name, avatar, and superhost status inline — if the listing returned only \`host_id\`, every card would require a second API call.\\n\\nThe trade-off: the host's name or avatar URL could go stale if they update their profile. This is acceptable here because the listing is effectively a snapshot of the host's public profile at a point in time. For strict consistency, you'd embed only \`host_id\` and fetch on demand — but that increases chattiness." }, { "label": "Rating breakdown", "icon": "⭐", "content": "Reviews produce not one score but six sub-scores: cleanliness, accuracy, communication, location, check-in, and value.\\n\\nThis mirrors Airbnb's real review schema. In an interview, proposing just an \`average_rating: 4.5\` is a missed opportunity — it shows you haven't thought about what data consumers (guests ranking search results, hosts improving their listings) actually need.\\n\\nSub-scores also create natural API extension points: a future \`sort_by=cleanliness\` search filter falls out of this model naturally." } ] }
\`\`\`

---

\`\`\`quiz
{ "title": "Requirements & Resource Modeling Check", "questions": [ { "question": "A host updates their profile photo after a listing is published. The listing's embedded \`host.avatar_url\` still shows the old photo. Which design choice caused this, and is it intentional?", "options": [ "A bug — embedded fields should always be live references, never snapshots", "Intentional — the listing embeds a summary at creation time to reduce API calls, accepting eventual consistency in host metadata", "Intentional — listings are immutable once published", "A bug — the API should use GraphQL to avoid this problem" ], "answer": 1, "explanation": "Embedding a host summary is a deliberate coarse-grained resource decision. It reduces chattiness (no extra call per listing card) at the cost of potential staleness in non-critical fields like avatar URL. For critical data (e.g., host's verified identity status), you'd fetch fresh — but a photo URL is an acceptable trade-off." }, { "question": "Why are booking prices stored as \`base_total: 45000\` in the booking record rather than being recalculated from the listing's current \`base_price\`?", "options": [ "To avoid a database join at read time", "To snapshot pricing at booking time — the host could change prices after the booking is made", "Because the booking microservice doesn't have access to the listing service", "To support multi-currency conversion" ], "answer": 1, "explanation": "Prices must be snapshotted at the moment of booking creation. If the host raises their nightly rate the next day, the guest's confirmed booking price must not change. This is a core correctness requirement, not a performance optimization." }, { "question": "You have a \`/listings/{id}/availability\` endpoint and a separate \`/search/listings?check_in=...&check_out=...\` endpoint. Why are these two different endpoints rather than one?", "options": [ "REST requires sub-resources to be separate from collection endpoints", "They hit different data stores — availability for a single listing is a DB lookup; search availability across all listings needs a geo-index", "To allow different authentication requirements", "There is no good reason — this is an over-engineered design" ], "answer": 1, "explanation": "The availability sub-resource checks a single listing's calendar — a simple DB query. The search endpoint filters across thousands of listings by geo-proximity, date range, and amenities simultaneously — this typically requires a dedicated search index (Elasticsearch, PostGIS). Separating them reflects their different performance characteristics and backing systems." }, { "question": "Which of these fields would you add to the Booking resource to support a cancellation refund policy?", "options": [ "A \`refund_eligible\` boolean flag", "A \`cancellation_policy\` object snapshotted from the listing at booking time, plus a \`refundable_amount\` computed field", "A foreign key to the listing's current cancellation policy", "Nothing — cancellation logic belongs in a separate CancellationPolicy resource" ], "answer": 1, "explanation": "Like pricing, the cancellation policy must be snapshotted at booking time. If the host later changes their policy from 'flexible' to 'strict', existing bookings must be governed by the policy in effect when the booking was made. A \`refundable_amount\` computed at cancellation time from that snapshot gives the guest a clear, auditable answer." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Clarify both functional and non-functional requirements before modeling — concurrency needs and geo-search requirements change which resources you create and how you back them.", "Use a single /users resource for dual-role actors; roles are contextual and enforced server-side, not structural duplicates in the schema.", "Embed resource summaries (host info in a listing) to reduce API chattiness, but accept eventual consistency for non-critical fields.", "Store all monetary values as integer cents and snapshot prices and policies at transaction time — this is correct by construction, not an optimization.", "A /search namespace signals a different backing store to consumers; don't collapse search into your primary collection endpoint." ] }
\`\`\``,
    },
    {
      id: "marketplace-listings",
      slug: "marketplace-listings",
      title: "Listing CRUD & Search",
      content: `# Listing CRUD & Search

Listing management and search are the two most-used endpoints in any marketplace API. Search in particular must compose five filter dimensions simultaneously — location, dates, price, capacity, and amenities — while staying fast enough to drive a real-time map interface.

\`\`\`concept
{
  "title": "Listing as a State Machine",
  "variant": "mental-model",
  "content": "Every listing is a state machine, not just a database row. A host creates a draft, submits it for review, and the platform transitions it to active (or rejects it with a reason). Modeling this explicitly prevents accidental exposure of unpublished listings in search results and gives the platform a moderation hook."
}
\`\`\`

## Creating a Listing

A host sends \`POST /listings\` with all physical and logistical facts about the property. Prices are stored in the **smallest currency unit** (cents for USD) — this eliminates floating-point precision bugs entirely.

\`\`\`http
POST /api/v1/listings HTTP/1.1
Authorization: Bearer <host_token>
Content-Type: application/json

{
  "title": "Cozy Downtown Loft with Skyline View",
  "description": "A bright, modern loft...",
  "property_type": "apartment",
  "room_type": "entire_place",
  "location": {
    "address": "123 Main St, San Francisco, CA 94105",
    "coordinates": { "lat": 37.7749, "lng": -122.4194 }
  },
  "pricing": {
    "base_price": 15000,
    "currency": "usd",
    "cleaning_fee": 5000
  },
  "capacity": { "guests": 4, "bedrooms": 2, "beds": 3, "bathrooms": 1 },
  "amenities": ["wifi", "kitchen", "parking"],
  "rules": { "check_in_time": "15:00", "check_out_time": "11:00", "min_nights": 2 }
}
\`\`\`

The server responds \`201 Created\` with the listing in **\`draft\`** status and a \`Location\` header pointing to the new resource. The listing is invisible in search until the host explicitly publishes it.

\`\`\`http
HTTP/1.1 201 Created
Location: /api/v1/listings/lst_abc123

{
  "id": "lst_abc123",
  "status": "draft"
}
\`\`\`

\`\`\`steps
{
  "title": "Status Lifecycle",
  "steps": [
    {
      "title": "draft",
      "content": "Created but not submitted. Only visible to the host. Edit freely. Triggered by \`POST /listings\`."
    },
    {
      "title": "pending_review",
      "content": "Host called \`POST /listings/{id}/publish\`. Platform moderates content, verifies address, checks policy compliance. Not yet searchable."
    },
    {
      "title": "active",
      "content": "Approved and publicly searchable. Guests can view and book. Host can still update pricing, availability, and amenities at any time."
    },
    {
      "title": "deactivated / rejected",
      "content": "\`deactivated\` — host voluntarily took the listing offline. \`rejected\` — platform refused publication; response body includes a \`reason\` field. Both block the listing from search."
    }
  ]
}
\`\`\`

## Updating a Listing

Use \`PATCH\` (not \`PUT\`) — send only the fields that changed.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "PUT — replaces the entire resource",
    "code": "PUT /api/v1/listings/lst_abc123\\n\\n// Must send ALL fields or they get nulled out\\n{\\n  \\"title\\": \\"Cozy Downtown Loft\\",\\n  \\"pricing\\": { \\"base_price\\": 17500 },\\n  \\"amenities\\": [\\"wifi\\", \\"kitchen\\", \\"parking\\", \\"pool\\"],\\n  // ... every other field required\\n}"
  },
  "after": {
    "label": "PATCH — sends only the delta",
    "code": "PATCH /api/v1/listings/lst_abc123\\n\\n// Only changed fields\\n{\\n  \\"pricing\\": { \\"base_price\\": 17500 },\\n  \\"amenities\\": [\\"wifi\\", \\"kitchen\\", \\"parking\\", \\"pool\\"]\\n}"
  }
}
\`\`\`

\`PUT\` semantics require a full resource representation — any field omitted is treated as intentionally cleared. \`PATCH\` is safe for partial updates.

## Photo Management

Photos are never uploaded through your API server — that would saturate your bandwidth and CPU. Instead, use a **pre-signed URL** flow: your server generates a time-limited upload token, the client uploads directly to object storage, then confirms back to your API.

\`\`\`steps
{
  "title": "Pre-Signed Upload Flow",
  "steps": [
    {
      "title": "Request an upload URL",
      "content": "Client calls \`POST /listings/{id}/photos/upload-url\` with \`content_type\` and \`filename\`. Server returns a \`photo_id\`, a \`upload_url\` pointing directly at object storage (S3/GCS), and an expiry time (typically 15–60 minutes)."
    },
    {
      "title": "Upload directly to storage",
      "content": "Client PUTs the raw image bytes to \`upload_url\`. Your API server is never in the binary data path — this eliminates the double-egress cost and unlocks parallel uploads."
    },
    {
      "title": "Confirm and caption",
      "content": "Client calls \`POST /listings/{id}/photos/{photo_id}/confirm\` with a caption and display order. Server triggers thumbnail generation and content moderation, then marks the photo as available."
    },
    {
      "title": "Reorder cover photo",
      "content": "Client calls \`PUT /listings/{id}/photos/order\` with an array of photo IDs in the desired sequence. The first element becomes the cover photo shown in search results."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Why skip the server for uploads?",
  "content": "Routing uploads through your API server doubles the egress cost (client → server → storage), blocks your web workers on slow I/O, and caps upload throughput at your server's bandwidth. Pre-signed URLs shift all of that to the storage provider. Your server only handles a small metadata exchange at the start and end."
}
\`\`\`

## Search Listings

Search is the highest-traffic endpoint. It must compose geo, date, price, capacity, and amenity filters in a single call while staying fast enough for map pan/zoom interactions.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Radius Search",
      "icon": "📍",
      "content": "Use when the user types a city or address. Geocode the input to coordinates, then send a center point and radius:\\n\\n\`\`\`\\nGET /api/v1/search/listings\\n  ?lat=37.7749&lng=-122.4194&radius=10km\\n  &check_in=2025-04-15&check_out=2025-04-18\\n  &guests=2\\n  &price_min=10000&price_max=30000\\n  &amenities=wifi,kitchen\\n  &room_type=entire_place\\n  &sort=relevance&limit=20\\n\`\`\`\\n\\nThe response includes \`map_bounds\` (the bounding box of returned results) so the client can fit the map view to what's actually shown."
    },
    {
      "label": "Bounds Search",
      "icon": "🗺️",
      "content": "Use when the user pans or zooms the map. Send the visible bounding box instead of a center point:\\n\\n\`\`\`\\nGET /api/v1/search/listings\\n  ?bounds=37.75,-122.45,37.80,-122.38\\n  &check_in=2025-04-15&check_out=2025-04-18\\n  &limit=50\\n\`\`\`\\n\\n\`bounds\` is \`sw_lat,sw_lng,ne_lat,ne_lng\`. This eliminates the jarring mismatch that occurs when a radius circle doesn't align with the visible map rectangle."
    }
  ]
}
\`\`\`

### Search Response Anatomy

\`\`\`http
HTTP/1.1 200 OK
{
  "data": [
    {
      "id": "lst_abc123",
      "title": "Cozy Downtown Loft with Skyline View",
      "host": { "name": "Jane Doe", "is_superhost": true },
      "location": { "city": "San Francisco", "neighborhood": "SoMa" },
      "photos": [{ "url": "https://cdn.example.com/photos/pho_001_thumb.jpg" }],
      "pricing": {
        "base_price": 15000,
        "total_price": 57000,
        "currency": "usd"
      },
      "rating": { "average": 4.85, "count": 127 },
      "instant_book": true,
      "distance_km": 1.2
    }
  ],
  "facets": {
    "property_type": [
      { "value": "apartment", "count": 45 },
      { "value": "house", "count": 23 },
      { "value": "condo", "count": 12 }
    ]
  },
  "map_bounds": {
    "northeast": { "lat": 37.8, "lng": -122.38 },
    "southwest": { "lat": 37.75, "lng": -122.45 }
  },
  "pagination": { "next_cursor": "...", "has_more": true, "total_results": 342 }
}
\`\`\`

Three non-obvious fields drive key UX decisions:

- **\`total_price\`** — pre-computed for the requested dates including seasonal adjustments. Guests compare actual trip costs, not nightly rates, in a single response.
- **\`facets\`** — count of available listings per filter category. The UI renders \`apartment (45)\` in the filter panel without a separate aggregation request.
- **\`next_cursor\`** — cursor-based pagination. Safer than \`?page=N\` because new listings inserted between requests won't shift items across page boundaries as the user scrolls.

### Sort Options

| Value | Description |
|-------|-------------|
| \`relevance\` | Algorithm-ranked (default) |
| \`price_asc\` | Cheapest first |
| \`price_desc\` | Most expensive first |
| \`rating\` | Highest rated first |
| \`distance\` | Nearest first |
| \`newest\` | Most recently listed |

\`\`\`callout
{
  "type": "warning",
  "title": "Search is your most expensive endpoint",
  "content": "A single search call may involve: a geo-index query, an availability calendar intersection across thousands of listings, a pricing engine computation per result, and a facet aggregation. Cache aggressively (CDN for anonymous requests; short TTL ~30s for authenticated users). Use a dedicated geo-search index (Elasticsearch, PostGIS with proper indexing) — a naive SQL \`WHERE ST_DWithin(...)\` will not scale past tens of thousands of active listings without careful tuning."
}
\`\`\`

## Error Cases

\`\`\`tabs
{
  "tabs": [
    {
      "label": "400 — Invalid Input",
      "icon": "⚠️",
      "content": "Return machine-readable \`code\` alongside human-readable \`message\`. The client uses the code for localised display; the message is for developers.\\n\\n\`\`\`\\nGET /api/v1/search/listings?check_in=2025-04-18&check_out=2025-04-15\\n\\nHTTP/1.1 400 Bad Request\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"INVALID_DATE_RANGE\\",\\n    \\"message\\": \\"check_out must be after check_in.\\"\\n  }\\n}\\n\`\`\`"
    },
    {
      "label": "403 — Authorization",
      "icon": "🔒",
      "content": "Return 403, **not 404**, when a user tries to modify a listing they don't own. Returning 404 leaks information — it lets an attacker enumerate valid listing IDs by observing which IDs get 403 vs 404.\\n\\n\`\`\`\\nPATCH /api/v1/listings/lst_abc123\\n\\nHTTP/1.1 403 Forbidden\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"NOT_LISTING_OWNER\\",\\n    \\"message\\": \\"You can only edit your own listings.\\"\\n  }\\n}\\n\`\`\`"
    },
    {
      "label": "404 — Not Found",
      "icon": "🔍",
      "content": "Return 404 when the resource genuinely does not exist. Do not distinguish between deleted vs. never-existed — both return the same response to avoid leaking state.\\n\\n\`\`\`\\nGET /api/v1/listings/lst_nonexistent\\n\\nHTTP/1.1 404 Not Found\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"LISTING_NOT_FOUND\\",\\n    \\"message\\": \\"Listing lst_nonexistent does not exist.\\"\\n  }\\n}\\n\`\`\`"
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Listing CRUD & Search",
  "questions": [
    {
      "question": "A new listing is created via POST /listings. In what status does it start, and why does it not appear in search results immediately?",
      "options": [
        "active — listings are immediately searchable after creation",
        "draft — the host must explicitly publish, then the platform reviews before activation",
        "pending_review — all listings go directly to moderation on creation",
        "deactivated — hosts must manually activate their listings"
      ],
      "answer": 1,
      "explanation": "Listings start as 'draft' so hosts can build them incrementally. The host calls POST /listings/{id}/publish to enter 'pending_review'. Only after platform approval does status move to 'active' and the listing become searchable. This prevents incomplete or unapproved content from surfacing to guests."
    },
    {
      "question": "Why is a price of $150.00 stored as 15000 (an integer in cents) rather than 150.00 (a float)?",
      "options": [
        "REST APIs require integer types for all numeric fields",
        "To avoid floating-point precision errors — IEEE 754 cannot represent all decimal fractions exactly",
        "To support currencies with more than 2 decimal places of subdivision",
        "Integers are faster to serialize and deserialize in JSON"
      ],
      "answer": 1,
      "explanation": "IEEE 754 floating-point cannot represent all decimal fractions exactly. For example, 0.1 + 0.2 yields 0.30000000000000004 in most languages. Storing monetary values as integer cents makes arithmetic exact and comparison safe — critical when summing a cleaning fee, nightly rate, and service fee."
    },
    {
      "question": "When should a client use bounds-based search (?bounds=sw_lat,sw_lng,ne_lat,ne_lng) instead of radius-based search (?lat=...&radius=...)?",
      "options": [
        "When the user types a city name in the search bar",
        "Whenever performance is critical — bounds queries are always faster",
        "When the user is panning or zooming an interactive map view",
        "When filtering by price — radius search does not support price range filters"
      ],
      "answer": 2,
      "explanation": "Bounds search is purpose-built for map interactions. When a user pans or zooms, the client sends the visible bounding box, which maps exactly to what's on screen. Radius search is better for point lookups (address or city geocoding) where you have a center but no visible viewport."
    },
    {
      "question": "What problem does cursor-based pagination (next_cursor) solve that offset pagination (?page=2) cannot?",
      "options": [
        "Cursor pagination returns results faster because the database skips fewer rows",
        "Offset pagination requires the total result count; cursors do not",
        "New listings inserted between requests cause items to shift pages with offset pagination, creating duplicates or gaps for the user",
        "Cursor pagination works across distributed databases; offset does not"
      ],
      "answer": 2,
      "explanation": "With offset pagination, if 3 new listings are inserted while a user scrolls through results, every subsequent page is shifted by 3 positions — the user sees duplicate listings or misses some entirely. Cursor pagination anchors each page to a specific record, so insertions don't affect what the user sees next."
    },
    {
      "question": "A user tries to PATCH a listing they don't own. The API returns 403 Forbidden. Why should it NOT return 404 instead?",
      "options": [
        "HTTP spec requires 403 for ownership checks and 404 only for missing resources",
        "404 would prevent the client from showing a meaningful error message",
        "Returning 404 leaks information — it lets an attacker enumerate valid listing IDs by observing which IDs return 403 vs 404",
        "403 triggers a browser retry; 404 does not"
      ],
      "answer": 2,
      "explanation": "If you return 404 for listings the user doesn't own, an attacker can probe IDs: 404 means the listing doesn't exist; 403 means it exists but belongs to someone else. Returning 403 consistently for ownership failures prevents this enumeration. Reserve 404 strictly for resources that genuinely don't exist."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Listings are state machines: draft → pending_review → active → deactivated/rejected. Enforce transitions server-side; never expose draft or rejected listings in search.",
    "Store monetary values as integers in the smallest currency unit (cents) to eliminate floating-point precision bugs.",
    "Use pre-signed URLs for photo uploads — your API server should never be in the binary data path.",
    "Design two search modes: radius-based (for address/city lookup) and bounds-based (for map pan/zoom). Include map_bounds, facets, and total_price in every search response.",
    "Use cursor-based pagination for search results — offset pagination causes duplicate or missing items when new listings are inserted between pages.",
    "Return 403 (not 404) when a user modifies a resource they don't own; returning 404 leaks resource existence to potential enumerators."
  ]
}
\`\`\``,
    },
    {
      id: "marketplace-booking",
      slug: "marketplace-booking",
      title: "Booking & Availability",
      content: `# Booking & Availability

Booking is the core transaction of a marketplace. It must handle availability checks, price calculations, concurrency (two guests booking the same dates), and cancellation policies.

\`\`\`concept
{ "title": "Availability is an Emergent Property", "variant": "insight", "content": "Availability is not a stored boolean field — it is computed at query time by evaluating existing bookings, their status (confirmed vs. pending), expiration rules, and capacity limits. Treating it as a static flag leads to stale reads and double-bookings under concurrent load." }
\`\`\`

## Availability Calendar

### Get Availability

\`\`\`http
GET /api/v1/listings/lst_abc123/availability?start=2025-04-01&end=2025-04-30
Authorization: Bearer <token>
\`\`\`

\`\`\`http
HTTP/1.1 200 OK
{
  "listing_id": "lst_abc123",
  "dates": [
    { "date": "2025-04-01", "available": true,  "price": 15000 },
    { "date": "2025-04-02", "available": true,  "price": 15000 },
    { "date": "2025-04-03", "available": false, "reason": "booked" },
    { "date": "2025-04-04", "available": false, "reason": "booked" },
    { "date": "2025-04-05", "available": true,  "price": 15000 },
    { "date": "2025-04-15", "available": true,  "price": 20000 },
    { "date": "2025-04-16", "available": true,  "price": 20000 },
    { "date": "2025-04-17", "available": true,  "price": 20000 }
  ],
  "min_nights": 2,
  "max_nights": 30
}
\`\`\`

Prices vary by date — weekends and holidays carry a premium. Note that \`reason: "booked"\` is different from \`reason: "blocked"\` (host manually blocked the date). Exposing this distinction lets guests know whether a date might free up via cancellation.

### Update Availability (Host)

\`\`\`http
PUT /api/v1/listings/lst_abc123/availability HTTP/1.1
Authorization: Bearer <host_token>
Content-Type: application/json

{
  "updates": [
    { "date": "2025-04-15", "available": true,  "price": 20000 },
    { "date": "2025-04-16", "available": true,  "price": 20000 },
    { "date": "2025-04-17", "available": true,  "price": 20000 },
    { "date": "2025-04-20", "available": false, "reason": "blocked" }
  ]
}
\`\`\`

---

## Create a Booking

Booking creation is a deliberate two-step flow: get a price quote, then commit. Separating them prevents the guest from paying a stale price and gives the system a window to validate availability before charging the card.

\`\`\`steps
{ "title": "Booking Creation Flow", "steps": [ { "title": "Step 1 — Price Check (POST /bookings/price-check)", "content": "Before charging anything, the guest verifies the total for the requested dates. The response includes a \`price_valid_until\` timestamp — if the guest submits the booking after this window (typically 10–15 minutes), the server rejects it with a price-mismatch error and the guest must re-check." }, { "title": "Step 2 — Confirm Booking (POST /bookings)", "content": "Submit the booking with a payment method and an \`Idempotency-Key\` header. The idempotency key ensures that network retries do not create duplicate charges — if the server already processed this key, it returns the original response without re-running the transaction." }, { "title": "Step 3 — Receive Confirmation", "content": "On \`201 Created\`, the response includes the booking ID, status, final pricing, and the cancellation policy that was in effect at booking time. **Instant-book listings** return \`status: confirmed\` immediately. **Request-to-book listings** return \`status: pending_host_approval\` — the host has a time window (usually 24 h) to accept or decline." } ] }
\`\`\`

### Price Check Response

\`\`\`http
POST /api/v1/bookings/price-check HTTP/1.1
Authorization: Bearer <guest_token>
Content-Type: application/json

{
  "listing_id": "lst_abc123",
  "check_in":   "2025-04-15",
  "check_out":  "2025-04-18",
  "guests": 2
}
\`\`\`

\`\`\`http
HTTP/1.1 200 OK
{
  "listing_id": "lst_abc123",
  "check_in":  "2025-04-15",
  "check_out": "2025-04-18",
  "nights": 3,
  "pricing": {
    "nightly_breakdown": [
      { "date": "2025-04-15", "price": 20000 },
      { "date": "2025-04-16", "price": 20000 },
      { "date": "2025-04-17", "price": 20000 }
    ],
    "subtotal":     60000,
    "cleaning_fee":  5000,
    "service_fee":   9100,
    "total":        74100,
    "currency": "usd"
  },
  "available": true,
  "price_valid_until": "2025-03-10T15:00:00Z"
}
\`\`\`

### Confirm Booking Request & Response

\`\`\`http
POST /api/v1/bookings HTTP/1.1
Authorization: Bearer <guest_token>
Idempotency-Key: ik_booking_order123
Content-Type: application/json

{
  "listing_id":       "lst_abc123",
  "check_in":         "2025-04-15",
  "check_out":        "2025-04-18",
  "guests":           2,
  "payment_method":   "pm_card_visa",
  "message_to_host":  "Hi Jane, we are excited to visit SF!"
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created
{
  "id": "bkg_xyz789",
  "listing": { "id": "lst_abc123", "title": "Cozy Downtown Loft" },
  "status":   "confirmed",
  "check_in":  "2025-04-15",
  "check_out": "2025-04-18",
  "nights": 3,
  "pricing":  { "total": 74100, "currency": "usd" },
  "payment_intent":       "pi_pay_001",
  "cancellation_policy":  "moderate",
  "created_at": "2025-03-10T14:30:00Z"
}
\`\`\`

## Booking Status State Machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> pending_host_approval : Request-to-book
    [*] --> confirmed : Instant book
    pending_host_approval --> confirmed : Host approves
    pending_host_approval --> declined : Host declines
    confirmed --> checked_in : Check-in date reached
    confirmed --> canceled : Guest or host cancels
    checked_in --> completed : Check-out date reached
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Two Booking Modes", "content": "**Instant Book** confirms without host approval — status goes directly to \`confirmed\`. **Request to Book** enters \`pending_host_approval\`; if the host does not respond within the allowed window, the request auto-expires and the dates are released back to the calendar. Both modes share the same cancel/checked_in/completed transitions once confirmed." }
\`\`\`

---

## Handling Concurrent Bookings

Two guests submitting overlapping date ranges simultaneously is the classic double-booking problem. The solution is to lock the relevant rows before reading availability.

\`\`\`algoviz
{ "title": "Concurrent Booking: Who Gets the Dates?", "type": "array", "data": ["Apr 15", "Apr 16", "Apr 17", "Apr 18", "Apr 19"], "frames": [ { "highlight": [0, 1, 2], "label": "Guest A's transaction starts — SELECT … FOR UPDATE acquires exclusive row lock on Apr 15–17.", "stats": { "Guest A": "holding lock", "Guest B": "not yet started" } }, { "highlight": [1, 2, 3], "label": "Guest B's transaction starts — tries to lock Apr 16–18. Blocked! Rows 1–2 are held by Guest A.", "stats": { "Guest A": "holding lock", "Guest B": "BLOCKED" } }, { "highlight": [0, 1, 2], "label": "Guest A commits successfully — Apr 15–17 marked unavailable, lock released.", "stats": { "Guest A": "COMMITTED ✓", "Guest B": "BLOCKED" } }, { "highlight": [1, 2, 3], "label": "Guest B's lock is granted. Re-checks rows — Apr 16 and Apr 17 are now booked. Returns 409 Conflict.", "stats": { "Guest A": "COMMITTED ✓", "Guest B": "409 Conflict" } } ], "speed": 1100 }
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "Pessimistic Locking", "icon": "🔒", "content": "**Pattern:** \`SELECT … FOR UPDATE\` acquires an exclusive row lock before reading availability. Any concurrent transaction targeting the same rows blocks until the lock is released.\\n\\n**Best for:** High-contention listings (popular properties during peak season) where conflicts are likely and the cost of a retry is high.\\n\\n**Trade-off:** Under heavy load, transactions queue up. If two transactions lock rows in different orders they can deadlock — always acquire locks in a consistent order (e.g., ascending by date).\\n\\n\`\`\`sql\\nBEGIN;\\nSELECT * FROM availability\\n  WHERE listing_id = $1\\n    AND date BETWEEN $2 AND $3\\n  FOR UPDATE;\\n-- verify all rows available\\n-- INSERT booking + UPDATE availability\\nCOMMIT;\\n\`\`\`" }, { "label": "Optimistic Locking", "icon": "⚡", "content": "**Pattern:** Read without locking. At write time, include a \`version\` column in the WHERE clause — if any other transaction modified the rows since your read, the UPDATE affects 0 rows and you know a conflict occurred.\\n\\n**Best for:** Low-contention listings or read-heavy workloads where conflicts are rare.\\n\\n**Trade-off:** No blocking means higher throughput, but you must implement retry logic. Under high contention, many transactions fail and retry, potentially degrading performance more than pessimistic locking would.\\n\\n\`\`\`sql\\nUPDATE availability\\n  SET booked = true, version = version + 1\\n  WHERE listing_id = $1\\n    AND date BETWEEN $2 AND $3\\n    AND booked = false\\n    AND version = $4;  -- 0 rows → conflict\\n\`\`\`" }, { "label": "DB Constraint Safety Net", "icon": "🛡️", "content": "Regardless of which locking strategy you use, a unique partial index is your last line of defense. Even if application-level locking fails (race condition, bug, multiple app servers), the database will reject a duplicate booking outright.\\n\\n\`\`\`sql\\nCREATE UNIQUE INDEX uq_listing_date_active\\n  ON bookings (listing_id, date)\\n  WHERE status IN ('confirmed', 'pending_host_approval');\\n\`\`\`\\n\\nThe API catches the constraint violation and converts it to a clean \`409 DATES_UNAVAILABLE\` response. This is defense-in-depth — not a replacement for proper locking." } ] }
\`\`\`

When a conflict is detected, return the specific unavailable dates so the client can highlight them in the calendar:

\`\`\`http
HTTP/1.1 409 Conflict
{
  "error": {
    "code": "DATES_UNAVAILABLE",
    "message": "The listing is no longer available for April 16–18.",
    "unavailable_dates": ["2025-04-16", "2025-04-17"]
  }
}
\`\`\`

---

## Cancel a Booking

Use a sub-resource action (\`POST /cancel\`) rather than \`PATCH { status: "canceled" }\`. Cancellation triggers multiple side effects — refund calculation, host notification, date release back to the calendar — that are best modeled as an explicit command, not a field update.

\`\`\`http
POST /api/v1/bookings/bkg_xyz789/cancel HTTP/1.1
Authorization: Bearer <guest_token>

{
  "reason": "change_of_plans"
}
\`\`\`

\`\`\`http
HTTP/1.1 200 OK
{
  "id": "bkg_xyz789",
  "status": "canceled",
  "refund": {
    "amount": 64100,
    "service_fee_refunded": false,
    "policy_applied": "moderate",
    "refund_breakdown": {
      "nights_refunded": 3,
      "cleaning_fee_refunded": true,
      "penalty": 10000
    }
  }
}
\`\`\`

### Cancellation Policies

| Policy | Rule |
|--------|------|
| Flexible | Full refund if canceled 24 h before check-in |
| Moderate | Full refund if canceled 5 days before check-in |
| Strict | 50% refund if canceled 7 days before; no refund after |
| Super Strict | No refund after booking confirmation |

The policy is set by the host per listing and returned in the booking confirmation. The guest sees the policy they agreed to before cancellation is finalized.

\`\`\`callout
{ "type": "warning", "title": "Service Fee is Always Non-Refundable", "content": "In Airbnb's model, the platform service fee charged to the guest is non-refundable under any cancellation policy. Only the nightly rate and cleaning fee follow the policy rules. Failing to surface this clearly in the price-check response is one of the most common sources of user disputes in marketplace APIs." }
\`\`\`

---

\`\`\`quiz
{ "title": "Booking & Availability", "questions": [ { "question": "Guest A and Guest B simultaneously submit bookings for overlapping dates on the same listing. What is the correct API behavior?", "options": [ "Both bookings are confirmed; the system resolves the conflict asynchronously", "One booking returns 201 Created; the other receives 409 Conflict with the specific unavailable dates", "Both requests are queued and the host chooses which to confirm", "The second request is silently dropped and returns 200 OK" ], "answer": 1, "explanation": "Exactly one transaction wins the row lock and commits. The losing transaction detects unavailable dates and returns 409 Conflict — never silently succeed or defer conflict resolution to the host." }, { "question": "Why is the Idempotency-Key header required when creating a booking?", "options": [ "It generates a unique booking ID server-side", "It prevents duplicate bookings and charges if the client retries after a network timeout", "It enables checking booking status without authentication", "It locks the price quote from the price-check step" ], "answer": 1, "explanation": "If the server commits the booking but the client never receives the 201 response (network failure), a naive retry would create a second charge. The Idempotency-Key lets the server recognize the duplicate and return the original response without reprocessing the payment." }, { "question": "What does SELECT … FOR UPDATE achieve in the booking transaction?", "options": [ "It filters rows to only those where booked = false", "It sorts the date rows before returning them", "It acquires an exclusive row lock, blocking other transactions from updating those rows until COMMIT", "It sets a query timeout to prevent long waits" ], "answer": 2, "explanation": "FOR UPDATE is pessimistic locking. The database immediately acquires an exclusive lock on the selected rows, so no concurrent transaction can modify them until the current one commits or rolls back — preventing the double-booking race condition." }, { "question": "Under the Moderate cancellation policy, a guest cancels 3 days before check-in. What do they receive?", "options": [ "Full refund including service fee", "Full refund excluding service fee", "50% refund of nightly fees only", "No refund" ], "answer": 3, "explanation": "Moderate policy requires cancellation at least 5 days before check-in for a full refund. Canceling only 3 days before falls outside that window — no refund is issued. The service fee is non-refundable under any policy." }, { "question": "Why is cancellation modeled as POST /bookings/{id}/cancel rather than PATCH /bookings/{id} with { status: 'canceled' }?", "options": [ "PATCH is not idempotent and cannot be used for state changes", "Cancellation triggers multiple side effects (refund, date release, notifications) that are better modeled as an explicit command", "REST conventions require all state transitions to use POST", "The booking status field is read-only" ], "answer": 1, "explanation": "When an action has significant side effects beyond a simple field update — refund calculation, releasing dates to the calendar, notifying the host — a sub-resource command (POST /cancel) makes the intent explicit and encapsulates all the logic in one place. A bare PATCH to status would require the caller to know and coordinate all downstream effects." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Availability is computed at query time from active bookings — it is an emergent property, not a stored flag.", "Use a two-step flow (price-check → confirm) so the guest sees a locked price quote before payment is captured.", "Prevent double-bookings with SELECT … FOR UPDATE (pessimistic) or version-checked UPDATEs (optimistic), always backed by a unique partial index as a last-resort safety net.", "Include an Idempotency-Key on POST /bookings to make payment retries safe against network failures.", "Model cancellation as POST /cancel, not PATCH /status — it triggers multi-step side effects that belong in a single command.", "The cancellation policy is host-controlled per listing and must be returned in the booking confirmation so the guest has a clear record of what they agreed to." ] }
\`\`\``,
    },
    {
      id: "marketplace-reviews",
      slug: "marketplace-reviews",
      title: "Reviews & Ratings",
      content: `# Reviews & Ratings

Reviews are the trust mechanism of any marketplace. They are **two-sided**: guests review listings, and hosts review guests. A well-designed review system handles timing, fairness, immutability, and efficient aggregation.

\`\`\`concept
{
  "title": "The Trust Stack",
  "variant": "mental-model",
  "content": "In a two-sided marketplace, trust flows in both directions. A guest needs to trust the listing matches reality (accuracy, cleanliness, location). A host needs to trust the guest won't damage their property. Reviews encode that post-stay trust signal into a reputation score that surfaces in future searches and decisions. Without reviews, the marketplace is a leap of faith — with them, every stay builds on verifiable history."
}
\`\`\`

## Submit a Review

Reviews can only be submitted after a **completed stay**, within a **14-day review window**.

\`\`\`http
POST /api/v1/reviews HTTP/1.1
Authorization: Bearer <guest_token>
Content-Type: application/json

{
  "booking_id": "bkg_xyz789",
  "listing_id": "lst_abc123",
  "ratings": {
    "overall": 5,
    "cleanliness": 5,
    "accuracy": 4,
    "communication": 5,
    "location": 4,
    "check_in": 5,
    "value": 5
  },
  "text": "Incredible loft with amazing views. Jane was a wonderful host who went above and beyond to make our stay comfortable. The neighborhood had great restaurants within walking distance. Highly recommend!",
  "private_feedback": "The shower pressure could be improved."
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created

{
  "id": "rev_001",
  "booking_id": "bkg_xyz789",
  "reviewer": { "id": "usr_guest_001", "name": "Bob Smith" },
  "listing_id": "lst_abc123",
  "ratings": {
    "overall": 5,
    "cleanliness": 5,
    "accuracy": 4,
    "communication": 5,
    "location": 4,
    "check_in": 5,
    "value": 5
  },
  "text": "Incredible loft with amazing views...",
  "host_response": null,
  "created_at": "2025-04-20T10:00:00Z"
}
\`\`\`

### Review Fields

| Field | Visibility | Description |
|-------|-----------|-------------|
| \`ratings.overall\` | Public | 1–5 star overall rating |
| \`ratings.cleanliness\` | Public | Cleanliness sub-rating |
| \`ratings.accuracy\` | Public | Listing matches reality |
| \`ratings.communication\` | Public | Host responsiveness |
| \`ratings.location\` | Public | Neighbourhood convenience |
| \`ratings.check_in\` | Public | Check-in experience |
| \`ratings.value\` | Public | Value for money |
| \`text\` | Public | Written review |
| \`private_feedback\` | Host-only | Never shown publicly |

\`\`\`callout
{
  "type": "info",
  "title": "Why multi-dimensional ratings?",
  "content": "A single overall score collapses useful signal. A listing can be spotless (cleanliness: 5) but overpriced (value: 2). Surfacing category averages lets guests filter and compare on the dimensions they care about most — and gives hosts actionable feedback on what to improve."
}
\`\`\`

## Simultaneous Reveal (Double-Blind)

The key fairness mechanism: both parties submit reviews **independently**. Reviews stay hidden until both submit, or the 14-day window closes.

\`\`\`steps
{
  "title": "Double-Blind Review Lifecycle",
  "steps": [
    {
      "title": "Day 0 — Stay Completes",
      "content": "Checkout is recorded. Both the guest and host become eligible to submit reviews. The 14-day countdown begins."
    },
    {
      "title": "Day 1 — Guest Submits",
      "content": "Guest posts their review. The API stores it in a pending state and responds:\\n\\n> *\\"Your review will be published when the host also submits their review.\\"*\\n\\nThe guest cannot see the host's review yet — and vice versa."
    },
    {
      "title": "Day 5 — Host Submits",
      "content": "Host posts their review of the guest. Both reviews are now in — they are **revealed simultaneously**. Neither party could have been influenced by the other's text."
    },
    {
      "title": "Day 14 — Window Closes",
      "content": "If only one side submitted, that review is published anyway. If neither submitted, no reviews are recorded for this booking. The window is gone — reviews cannot be submitted after day 14."
    }
  ]
}
\`\`\`

You can check the current status before revealing:

\`\`\`http
GET /api/v1/bookings/bkg_xyz789/review-status

HTTP/1.1 200 OK
{
  "booking_id": "bkg_xyz789",
  "guest_review_submitted": true,
  "host_review_submitted": false,
  "reviews_visible": false,
  "review_window_closes": "2025-05-02T00:00:00Z"
}
\`\`\`

\`\`\`concept
{
  "title": "Why Double-Blind?",
  "variant": "insight",
  "content": "Without simultaneous reveal, a host who sees a scathing 1-star review might retaliate with a negative guest review. A guest who sees 5 stars might not bother submitting. Double-blind eliminates both incentives — each party writes honestly, knowing their review can't be gamed by peeking at the other's first."
}
\`\`\`

## Host Response

After reviews are published, the host can add **one public response**. This is their right-of-reply — guests and future visitors see both:

\`\`\`http
POST /api/v1/reviews/rev_001/response HTTP/1.1
Authorization: Bearer <host_token>
Content-Type: application/json

{
  "text": "Thank you so much, Bob! We loved having you and hope to see you again next time you visit SF."
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created
{
  "review_id": "rev_001",
  "host_response": {
    "text": "Thank you so much, Bob!...",
    "responded_at": "2025-04-21T08:00:00Z"
  }
}
\`\`\`

Host responses are also immutable after submission.

## List Reviews for a Listing

\`\`\`http
GET /api/v1/listings/lst_abc123/reviews?sort=-created_at&limit=10

HTTP/1.1 200 OK
{
  "data": [
    {
      "id": "rev_001",
      "reviewer": { "id": "usr_guest_001", "name": "Bob S.", "avatar_url": "..." },
      "ratings": { "overall": 5, "cleanliness": 5, "accuracy": 4, "communication": 5, "location": 4, "check_in": 5, "value": 5 },
      "text": "Incredible loft with amazing views...",
      "host_response": { "text": "Thank you so much...", "responded_at": "..." },
      "created_at": "2025-04-20T10:00:00Z"
    }
  ],
  "summary": {
    "average_rating": 4.85,
    "total_reviews": 127,
    "rating_distribution": {
      "5": 98,
      "4": 22,
      "3": 5,
      "2": 1,
      "1": 1
    },
    "category_averages": {
      "cleanliness": 4.9,
      "accuracy": 4.8,
      "communication": 5.0,
      "location": 4.7,
      "check_in": 4.9,
      "value": 4.8
    }
  },
  "pagination": { "next_cursor": "...", "has_more": true }
}
\`\`\`

The \`summary\` object contains **pre-aggregated statistics**. This is a deliberate performance choice:

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Compute on read (slow)",
    "code": "-- Recalculate every time a listing page loads\\nSELECT AVG(overall_rating)\\nFROM reviews\\nWHERE listing_id = 'lst_abc123';\\n-- O(N) per request — scales poorly at 10k+ reviews"
  },
  "after": {
    "label": "Pre-aggregated (O(1) read)",
    "code": "-- listings table caches the aggregate\\n-- Updated incrementally on each new review:\\nnew_avg = (old_avg * old_count + new_rating) / (old_count + 1)\\n\\n-- Read is O(1) — one column lookup, no scan needed\\nSELECT avg_rating, review_count FROM listings WHERE id = 'lst_abc123';"
  }
}
\`\`\`

## Host Reviews of Guests

Hosts also review guests — this builds the **guest's reputation** profile for future bookings:

\`\`\`http
POST /api/v1/reviews HTTP/1.1
Authorization: Bearer <host_token>
Content-Type: application/json

{
  "booking_id": "bkg_xyz789",
  "guest_id": "usr_guest_001",
  "rating": 5,
  "text": "Bob was a great guest — respectful, clean, and communicative.",
  "would_host_again": true
}
\`\`\`

The same double-blind rules apply: submitted under the same booking, revealed simultaneously with the guest's listing review.

## Validation Rules

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Booking Not Completed",
      "icon": "🔒",
      "content": "Reviews require a **completed stay**. Attempting to review before checkout:\\n\\n\`\`\`\\nHTTP/1.1 422 Unprocessable Entity\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"BOOKING_NOT_COMPLETED\\",\\n    \\"message\\": \\"Reviews can only be submitted after the stay is complete.\\"\\n  }\\n}\\n\`\`\`\\n\\nThe server checks booking status before validating any other field."
    },
    {
      "label": "Window Expired",
      "icon": "⏰",
      "content": "The 14-day window is a hard deadline — no exceptions:\\n\\n\`\`\`\\nHTTP/1.1 422 Unprocessable Entity\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"REVIEW_WINDOW_CLOSED\\",\\n    \\"message\\": \\"The 14-day review window has closed.\\"\\n  }\\n}\\n\`\`\`\\n\\nBoth parties are notified by email/push before day 14 as a reminder."
    },
    {
      "label": "Already Reviewed",
      "icon": "♻️",
      "content": "One review per party per booking — attempting a second:\\n\\n\`\`\`\\nHTTP/1.1 409 Conflict\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"ALREADY_REVIEWED\\",\\n    \\"message\\": \\"You have already submitted a review for this booking.\\"\\n  }\\n}\\n\`\`\`\\n\\nNote the **409 Conflict** (not 422) — the request is valid in form, but conflicts with existing server state."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "Reviews are immutable",
  "content": "Once submitted, a review cannot be edited or deleted by the reviewer. This is a deliberate design decision — if editing were allowed, hosts could pressure guests into softening negative reviews. Immutability protects the integrity of the trust signal. The only post-submission mutation is the host's one-time response."
}
\`\`\`

\`\`\`quiz
{
  "title": "Reviews & Ratings — Check Your Understanding",
  "questions": [
    {
      "question": "Why does the double-blind system reveal both reviews simultaneously rather than showing each as it's submitted?",
      "options": [
        "To reduce server load by batching database writes",
        "To prevent retaliation — neither party can adjust their review after reading the other's",
        "Because the API can only handle one write per booking",
        "To give the platform time to moderate content before publishing"
      ],
      "answer": 1,
      "explanation": "Double-blind prevents strategic behaviour: a host who reads a 1-star review might retaliate; a guest who reads 5 stars might not bother writing. Simultaneous reveal means both parties write honestly, without knowing the other's text."
    },
    {
      "question": "A listing has 127 reviews with an average of 4.85 stars. When the 128th review is submitted (rating: 3), which approach correctly updates the average in O(1)?",
      "options": [
        "Re-scan all 128 reviews and recompute AVG(overall_rating)",
        "new_avg = (4.85 * 127 + 3) / 128",
        "new_avg = (4.85 + 3) / 2",
        "Defer recalculation to a nightly batch job"
      ],
      "answer": 1,
      "explanation": "The incremental formula (old_avg × old_count + new_rating) / (old_count + 1) updates the stored average in O(1) — no full table scan needed. This is why the listings table caches avg_rating and review_count alongside the reviews table."
    },
    {
      "question": "A guest tries to submit a second review for the same booking. Which HTTP status code should the server return, and why?",
      "options": [
        "400 Bad Request — the request body is malformed",
        "404 Not Found — the booking doesn't exist for this user",
        "409 Conflict — the request is valid but conflicts with existing state",
        "422 Unprocessable Entity — a validation rule was violated"
      ],
      "answer": 2,
      "explanation": "409 Conflict is semantically correct here: the request itself is well-formed (valid JSON, valid booking ID, valid rating), but it conflicts with an already-existing review for that booking. 422 is better reserved for requests that fail domain validation rules like window-expired or booking-not-completed."
    },
    {
      "question": "The \`private_feedback\` field is included in the review submission. Where does it appear?",
      "options": [
        "In the public review text, prefixed with 'Private note:'",
        "In the listing's reviews endpoint response, visible to all users",
        "Sent only to the host — never shown publicly or to future guests",
        "Stored in a separate moderation queue for platform review"
      ],
      "answer": 2,
      "explanation": "Private feedback is a host-only channel for constructive criticism that the guest doesn't want published. It never appears in GET /listings/:id/reviews or any public endpoint — only the host can see it, giving guests a safe way to flag issues without public embarrassment."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Reviews are two-sided: guests rate listings, hosts rate guests — both feed marketplace trust and reputation.",
    "Double-blind simultaneous reveal prevents retaliation and strategic review behaviour by hiding submissions until both parties have written or the window closes.",
    "Pre-aggregate avg_rating and review_count on the listing row to serve summary stats in O(1) — never compute averages on read at scale.",
    "Reviews are immutable after submission. Editing would let hosts coerce guests into softening negative reviews — immutability protects trust integrity.",
    "Use 409 Conflict (duplicate review) vs. 422 Unprocessable Entity (window closed, booking not completed) — the distinction signals whether the problem is state conflict or domain validation failure.",
    "Private feedback is a separate, host-only channel — never surfaced publicly — giving guests a safe way to share constructive criticism."
  ]
}
\`\`\``,
    },
    {
      id: "marketplace-walkthrough",
      slug: "marketplace-walkthrough",
      title: "API Walkthrough",
      content: `# Marketplace API: Walkthrough & Trade-offs

This lesson consolidates every decision made across the module into a single, coherent picture. You'll walk through the complete endpoint surface, trace a booking end-to-end, and evaluate the five trade-offs that separate a junior answer from a senior one.

---

## Complete Endpoint Reference

| Category | Method | Endpoint | Actor |
|----------|--------|----------|-------|
| **Listings** | POST | /listings | Host |
| | GET | /listings/{id} | Any |
| | PATCH | /listings/{id} | Host |
| | POST | /listings/{id}/publish | Host |
| | DELETE | /listings/{id} | Host |
| **Photos** | POST | /listings/{id}/photos/upload-url | Host |
| | POST | /listings/{id}/photos/{pid}/confirm | Host |
| | PUT | /listings/{id}/photos/order | Host |
| | DELETE | /listings/{id}/photos/{pid} | Host |
| **Search** | GET | /search/listings | Guest |
| **Availability** | GET | /listings/{id}/availability | Any |
| | PUT | /listings/{id}/availability | Host |
| **Bookings** | POST | /bookings/price-check | Guest |
| | POST | /bookings | Guest |
| | GET | /bookings/{id} | Host/Guest |
| | POST | /bookings/{id}/cancel | Host/Guest |
| | POST | /bookings/{id}/approve | Host |
| | POST | /bookings/{id}/decline | Host |
| **Reviews** | POST | /reviews | Host/Guest |
| | GET | /listings/{id}/reviews | Any |
| | POST | /reviews/{id}/response | Host |
| | GET | /bookings/{id}/review-status | Host/Guest |

Twenty-three endpoints across six domains. Each has a single, clear owner. Notice the symmetry: hosts manage supply, guests consume it, and the booking resource belongs to both.

---

## End-to-End Booking Flow

\`\`\`steps
{
  "title": "Guest Booking Journey",
  "steps": [
    {
      "title": "Search with geo + date filters",
      "content": "\`\`\`\\nGET /search/listings\\n  ?lat=37.77&lng=-122.41\\n  &check_in=2025-04-15&check_out=2025-04-18\\n  &guests=2\\n  &max_price=250\\n\`\`\`\\nElasticsearch handles the geo-radius query and returns paginated results with total prices already computed. The database is never hit for search."
    },
    {
      "title": "View the listing",
      "content": "\`\`\`\\nGET /listings/lst_abc123\\n\`\`\`\\nReturns full listing details: title, description, photos (ordered), amenities, host profile, average rating, and house rules. Photos are served from CDN URLs, not Base64."
    },
    {
      "title": "Check availability for the month",
      "content": "\`\`\`\\nGET /listings/lst_abc123/availability\\n  ?start=2025-04-01&end=2025-04-30\\n\`\`\`\\nReturns a calendar object — one entry per date — with \`available: true/false\` and \`price_per_night\`. Blocked dates (host-blocked or already booked) are marked \`available: false\`."
    },
    {
      "title": "Get a price breakdown",
      "content": "\`\`\`\\nPOST /bookings/price-check\\n{\\n  \\"listing_id\\": \\"lst_abc123\\",\\n  \\"check_in\\": \\"2025-04-15\\",\\n  \\"check_out\\": \\"2025-04-18\\",\\n  \\"guests\\": 2\\n}\\n\`\`\`\\nReturns a line-item breakdown: nightly rates, weekly discount (if applicable), cleaning fee, service fee, taxes, and total. **This step is mandatory before booking** — it prevents disputes about the final charge."
    },
    {
      "title": "Create the booking",
      "content": "\`\`\`\\nPOST /bookings\\n{\\n  \\"listing_id\\": \\"lst_abc123\\",\\n  \\"check_in\\": \\"2025-04-15\\",\\n  \\"check_out\\": \\"2025-04-18\\",\\n  \\"guests\\": 2,\\n  \\"payment_method_id\\": \\"pm_stripe_xxx\\",\\n  \\"idempotency_key\\": \\"uuid-v4-from-client\\"\\n}\\n\`\`\`\\nIf the listing uses **instant book**: returns \`status: confirmed\`, payment is charged, dates are blocked atomically. If **request-to-book**: returns \`status: pending_approval\`, payment is authorized (hold) but not captured."
    },
    {
      "title": "Host approves (request-to-book only)",
      "content": "\`\`\`\\nPOST /bookings/bkg_xyz789/approve\\n\`\`\`\\nCaptures the authorized payment, marks dates as blocked in the availability calendar, and notifies the guest. If the host declines or the 24-hour window expires, the authorization is released."
    },
    {
      "title": "Both parties review (double-blind)",
      "content": "\`\`\`\\nPOST /reviews\\n{\\n  \\"booking_id\\": \\"bkg_xyz789\\",\\n  \\"ratings\\": { \\"cleanliness\\": 5, \\"communication\\": 4, \\"accuracy\\": 5 },\\n  \\"text\\": \\"Great place!\\"\\n}\\n\`\`\`\\nReviews are stored but hidden until both parties submit **or** 14 days elapse. This is double-blind review — preventing retaliation bias."
    }
  ]
}
\`\`\`

---

## The Five Trade-offs

These are the decisions an interviewer will probe. For each one, know the *why* behind the choice — not just what was picked.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Instant vs Request",
      "icon": "⚡",
      "content": "### Instant Book vs Request-to-Book\\n\\n| | Instant Book | Request-to-Book |\\n|---|---|---|\\n| **Guest experience** | Book in seconds, high conversion | Must wait hours for approval |\\n| **Host control** | Cannot screen guests | Full vetting before accepting |\\n| **Revenue impact** | Higher (fewer drop-offs) | Lower (friction kills conversions) |\\n| **Use case** | Professional hosts, high-volume properties | Homeowners, unique/sensitive properties |\\n\\n**Our choice:** Support both — host selects per listing. Default to instant book. This mirrors how Airbnb operates: the host-level setting drives the booking state machine, and the API returns \`instant_book: true/false\` on the listing resource.\\n\\nThe booking creation endpoint handles both paths with a single code flow; the \`status\` in the response tells the client which path activated."
    },
    {
      "label": "Availability Model",
      "icon": "📅",
      "content": "### Calendar Table vs Booking-Range Check\\n\\n| | Calendar Table | Booking Range Query |\\n|---|---|---|\\n| **Per-date pricing** | Native (one row per date) | Not possible without extra table |\\n| **Block individual dates** | Trivial (set \`available: false\`) | Requires a fake \\"blocked\\" booking |\\n| **Storage** | Higher (365 rows/listing/year) | Minimal |\\n| **Update complexity** | Batch update on booking confirm | Insert one row |\\n| **Query for availability** | Single range scan on indexed table | JOIN over bookings with date overlap |\\n\\n**Our choice:** Calendar table. Per-date pricing and host-controlled blocking are essential marketplace features. Storage is not a constraint at Airbnb scale — index design is.\\n\\nThe canonical date-overlap query (if you ever need the range approach) is:\\n\`\`\`sql\\nWHERE check_in < :check_out AND check_out > :check_in\\n\`\`\`"
    },
    {
      "label": "Search Architecture",
      "icon": "🔍",
      "content": "### Database Queries vs Search Engine\\n\\n| | PostgreSQL + PostGIS | Elasticsearch |\\n|---|---|---|\\n| **Geo queries** | Supported via extension | Native, highly optimized |\\n| **Faceted filtering** | Complex JOINs | First-class feature |\\n| **Relevance ranking** | Manual scoring | Built-in BM25 + custom scoring |\\n| **Infrastructure** | Zero additional ops | Requires sync pipeline + ops |\\n| **Consistency** | Immediate | Eventually consistent (async sync) |\\n\\n**Our choice:** Elasticsearch for search, PostgreSQL for bookings and transactions. Search data is synced asynchronously from the database — an event-driven pipeline updates the search index when listings change.\\n\\nThis split is how Airbnb, Uber, and most large marketplaces operate. The key insight: **read path and write path use different stores.** The booking must go to the database (ACID), but the search result can tolerate seconds of lag."
    },
    {
      "label": "Double-Blind Reviews",
      "icon": "⚖️",
      "content": "### Immediate Publication vs Double-Blind\\n\\n| | Immediate | Double-Blind |\\n|---|---|---|\\n| **Retaliation risk** | High — guest sees bad review, retaliates | Eliminated — neither can see until both submit |\\n| **Review quality** | Biased toward reciprocal 5-stars | More honest |\\n| **User confusion** | None | Some (\\"why can't I see my review?\\") |\\n| **Implementation complexity** | Simple | Requires reveal logic + 14-day timer |\\n\\n**Our choice:** Double-blind. The business value — honest reviews that build long-term marketplace trust — outweighs the UX friction. Both Airbnb and Uber use variants of this model.\\n\\nThe \`GET /bookings/{id}/review-status\` endpoint lets clients poll the reveal state without exposing the hidden review content prematurely."
    },
    {
      "label": "Pricing Strategy",
      "icon": "💰",
      "content": "### Pricing Model Options\\n\\n| Model | Description | Trade-off |\\n|---|---|---|\\n| Fixed nightly | Single rate for all dates | Simple, inflexible |\\n| Per-date (our choice) | Different price per calendar date | Handles weekends, seasons, holidays |\\n| Smart pricing | Algorithm adjusts based on demand | High conversion; host may not trust algorithm |\\n| Length-of-stay discounts | Weekly (−10%), monthly (−20%) | Encourages longer stays; computed at price-check |\\n\\n**Our design supports all of these.** The availability calendar stores per-date prices. Smart pricing can update the calendar via a background job. Discounts are computed at the \`POST /bookings/price-check\` stage — the calendar stores the base rate, the price-check endpoint applies discount rules on top.\\n\\nThis keeps the calendar clean while allowing complex pricing logic at the edge."
    }
  ]
}
\`\`\`

---

## System Architecture: How the Pieces Connect

\`\`\`sysdiag
{
  "title": "Marketplace API — Runtime Architecture",
  "width": 680,
  "height": 380,
  "nodes": [
    { "id": "client", "label": "Client\\n(Web/Mobile)", "x": 60, "y": 190, "kind": "client" },
    { "id": "api", "label": "API Gateway\\n/v1/*", "x": 200, "y": 190, "kind": "service" },
    { "id": "booking", "label": "Booking\\nService", "x": 360, "y": 100, "kind": "service" },
    { "id": "search", "label": "Search\\nService", "x": 360, "y": 280, "kind": "service" },
    { "id": "db", "label": "PostgreSQL\\n(ACID writes)", "x": 520, "y": 100, "kind": "database" },
    { "id": "es", "label": "Elasticsearch\\n(search reads)", "x": 520, "y": 280, "kind": "database" },
    { "id": "sync", "label": "Async\\nSync Job", "x": 360, "y": 190, "kind": "service" }
  ],
  "edges": [
    { "from": "client", "to": "api", "label": "HTTPS" },
    { "from": "api", "to": "booking", "label": "book/avail" },
    { "from": "api", "to": "search", "label": "search" },
    { "from": "booking", "to": "db", "label": "ACID txn" },
    { "from": "search", "to": "es", "label": "query" },
    { "from": "db", "to": "sync", "label": "CDC events" },
    { "from": "sync", "to": "es", "label": "index update" }
  ],
  "annotations": {
    "api": "Single versioned gateway. All auth, rate limiting, and idempotency handled here before routing to downstream services.",
    "booking": "Owns the availability calendar and booking state machine. Uses optimistic locking to prevent double-booking under concurrent requests.",
    "search": "Read-only. Queries Elasticsearch for geo+filter results. Never touches the booking database directly.",
    "sync": "Change Data Capture (CDC) pipeline reads Postgres WAL and pushes listing updates to Elasticsearch asynchronously. Lag is typically <5 seconds.",
    "db": "Source of truth for all transactional data: bookings, availability, users, payments.",
    "es": "Optimized for geo-radius queries, faceted filtering, and relevance ranking. Eventually consistent with the database."
  }
}
\`\`\`

---

## The Concurrency Problem: How Double-Booking Is Prevented

\`\`\`concept
{
  "title": "Optimistic Locking on Booking Creation",
  "variant": "mental-model",
  "content": "Two guests can attempt to book the same listing for the same dates simultaneously. At the API level, both requests pass availability checks. At the database level, only one can win.\\n\\nThe booking creation is wrapped in a transaction:\\n1. SELECT the availability rows for the requested dates WITH a version number.\\n2. Verify all dates are still available.\\n3. UPDATE the rows — PostgreSQL checks that the version hasn't changed.\\n4. If another transaction updated first, the version check fails → roll back → return 409 Conflict.\\n\\nThis is optimistic locking: assume no conflict, detect and reject if one occurs. It outperforms pessimistic locking (SELECT FOR UPDATE) at high read-to-write ratios because readers never block."
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Idempotency Key: Your Double-Charge Guard",
  "content": "The \`POST /bookings\` endpoint requires a client-supplied \`idempotency_key\` (UUID v4). If the network drops after the server processes the request but before the client receives the response, the client can safely retry with the same key. The server returns the original response without processing again. This is the same pattern Stripe uses for payment intents."
}
\`\`\`

---

## What Makes This a Strong Interview Answer

\`\`\`concept
{
  "title": "The Eight Signals That Separate Senior from Junior",
  "variant": "insight",
  "content": "1. **Two-sided design** — distinct flows for hosts and guests; the API reflects business roles, not just CRUD operations.\\n2. **Search with facets and geo-filtering** — citing Elasticsearch (not \\"just use the database\\") shows production awareness.\\n3. **Concurrency handling** — optimistic locking on booking creation; mentioning the race condition unprompted is a strong signal.\\n4. **Price-check before booking** — transparent pricing prevents disputes and chargebacks; this is business logic, not just API design.\\n5. **Cancellation policies** — configurable per listing with tiered refund logic; shows you've thought about the unhappy path.\\n6. **Double-blind reviews** — shows understanding of marketplace trust dynamics and why incentive design matters.\\n7. **Availability calendar** — per-date pricing and host-controlled blocking; the alternative (querying bookings for overlap) is clearly inferior.\\n8. **Idempotency key on bookings** — prevents duplicate charges under network failures; few candidates mention this unprompted."
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "API Walkthrough — Comprehension Check",
  "questions": [
    {
      "question": "A guest and a host are both trying to book the same listing for April 15–18 at exactly the same millisecond. Which mechanism prevents a double-booking at the database level?",
      "options": [
        "The API gateway deduplicates requests using the idempotency key",
        "Optimistic locking — a version check on availability rows inside a transaction",
        "The Elasticsearch index is updated first to mark dates unavailable",
        "A distributed lock held for the duration of the HTTP request"
      ],
      "answer": 1,
      "explanation": "Optimistic locking uses a version number on the availability rows. Both transactions read the same version, but only the first to commit increments it. The second transaction's UPDATE fails the version check, triggering a rollback and a 409 Conflict response. The idempotency key prevents duplicate requests from the same client — it doesn't solve the multi-client race."
    },
    {
      "question": "Why does the design use Elasticsearch for search instead of querying PostgreSQL directly?",
      "options": [
        "PostgreSQL cannot handle more than 1,000 concurrent connections",
        "Elasticsearch supports geo-radius queries, faceted filtering, and relevance ranking natively — PostgreSQL requires extensions and produces slower query plans at scale",
        "Elasticsearch is ACID-compliant and therefore safer for financial data",
        "The API gateway cannot route to PostgreSQL directly"
      ],
      "answer": 1,
      "explanation": "PostgreSQL can handle geo queries via PostGIS, but at marketplace scale the query plans become complex and slow. Elasticsearch is purpose-built for geo-native search, faceted filtering, and relevance scoring. The trade-off is eventual consistency — the search index lags the database by seconds — which is acceptable for search results but not for booking transactions."
    },
    {
      "question": "A host wants to charge $200/night on weekdays and $280/night on weekends, and block out Dec 24–26 for personal use. Which availability model supports this requirement?",
      "options": [
        "Booking-range check — query existing bookings for overlap",
        "Calendar table — one row per date with per-date price and availability flag",
        "Fixed nightly rate with a weekend multiplier stored on the listing",
        "Smart pricing algorithm that overrides the base rate"
      ],
      "answer": 1,
      "explanation": "The calendar table stores a price and availability flag for every date independently. The host can set different prices per day and mark specific dates as unavailable without creating fake bookings. The booking-range check model cannot support per-date pricing or arbitrary date blocking without a separate table — defeating its main advantage."
    },
    {
      "question": "The client sends POST /bookings but the network drops before the response arrives. The client retries. What prevents the guest from being charged twice?",
      "options": [
        "Optimistic locking rolls back the second transaction",
        "The client-supplied idempotency_key — the server returns the original response without reprocessing",
        "The payment processor detects the duplicate charge and rejects it",
        "The double-blind review system flags the inconsistency"
      ],
      "answer": 1,
      "explanation": "The idempotency key (a UUID v4 generated by the client before the first attempt) is stored server-side with the result. On retry, the server looks up the key and returns the original response. This is the canonical pattern for safe retries on non-idempotent operations — Stripe, PayPal, and most payment APIs require it."
    },
    {
      "question": "Under the double-blind review system, when do reviews become visible?",
      "options": [
        "Immediately after the guest submits their review",
        "Only after the host submits their review",
        "When both parties have submitted, or after 14 days — whichever comes first",
        "After 30 days regardless of submission status"
      ],
      "answer": 2,
      "explanation": "Double-blind means neither party can see the other's review until both have submitted. The 14-day fallback prevents one party from strategically withholding their review forever. This design eliminates retaliation bias — if a host gives a bad review, the guest cannot see it before writing their own, so they cannot retaliate with an equally bad review."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The API has 23 endpoints across 6 domains — listings, photos, search, availability, bookings, and reviews. Every endpoint has a single, unambiguous owner (host, guest, or both).",
    "Search uses Elasticsearch (geo-native, faceted, eventually consistent); bookings use PostgreSQL (ACID). These are different stores for different SLAs.",
    "The availability calendar (one row per date) is strictly superior to the booking-range approach when per-date pricing and host-controlled blocking are requirements.",
    "Three mechanisms protect payment integrity: optimistic locking (prevents double-booking), price-check before booking (prevents price disputes), and idempotency key (prevents double-charge on retry).",
    "Double-blind reviews, configurable booking mode (instant vs request-to-book), and a price-check endpoint are the details that signal real marketplace design experience to an interviewer."
  ]
}
\`\`\``,
    },
  ],
};
