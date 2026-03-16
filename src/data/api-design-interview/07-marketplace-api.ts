import { Module } from "../types";

export const marketplaceApiModule: Module = {
  id: "design-marketplace-api",
  title: "Design Marketplace API",
  description:
    "Design an Airbnb-like marketplace API — listing management, search, booking and availability, reviews, and two-sided marketplace trade-offs.",
  lessons: [
    {
      id: "marketplace-requirements",
      slug: "marketplace-requirements",
      title: "Requirements & Resource Modeling",
      content: `# Design Marketplace API: Requirements & Resource Modeling

Marketplace APIs are two-sided: they serve both hosts (sellers) and guests (buyers). This duality creates unique design challenges around authorization, search, and transactional workflows. Airbnb, Uber, and Etsy all face these challenges.

## Step 1: Clarify Requirements

**Functional Requirements:**
- Hosts can create, update, and manage property listings
- Guests can search for listings with filters (location, dates, price, amenities)
- Guests can book a listing for specific dates
- Both hosts and guests can leave reviews after a stay
- Availability calendar management

**Non-Functional Requirements:**
- Search must be fast and support geo-queries
- Booking must handle concurrency (two guests booking same dates)
- Prices can vary by date (seasonal pricing)
- Support for multiple currencies

## Step 2: Identify Resources

\`\`\`
Core Resources:
├── User             → /users (hosts and guests share the same resource)
├── Listing          → /listings
├── Availability     → /listings/{id}/availability
├── Booking          → /bookings
├── Review           → /reviews
├── Photo            → /listings/{id}/photos
└── Search           → /search/listings
\`\`\`

## Step 3: Resource Schemas

### Listing Resource

\`\`\`json
{
  "id": "lst_abc123",
  "host": {
    "id": "usr_host_001",
    "name": "Jane Doe",
    "avatar_url": "https://cdn.example.com/avatars/usr_host_001.jpg",
    "is_superhost": true,
    "response_rate": 0.98,
    "response_time": "within an hour"
  },
  "title": "Cozy Downtown Loft with Skyline View",
  "description": "A bright, modern loft in the heart of downtown...",
  "property_type": "apartment",
  "room_type": "entire_place",
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "country": "US",
    "coordinates": { "lat": 37.7749, "lng": -122.4194 },
    "neighborhood": "SoMa"
  },
  "pricing": {
    "base_price": 15000,
    "currency": "usd",
    "cleaning_fee": 5000,
    "service_fee_percent": 14
  },
  "capacity": {
    "guests": 4,
    "bedrooms": 2,
    "beds": 3,
    "bathrooms": 1
  },
  "amenities": ["wifi", "kitchen", "parking", "air_conditioning", "washer"],
  "photos": [
    { "id": "pho_001", "url": "https://cdn.example.com/photos/pho_001.jpg", "caption": "Living room" }
  ],
  "rating": {
    "average": 4.85,
    "count": 127,
    "breakdown": {
      "cleanliness": 4.9,
      "accuracy": 4.8,
      "communication": 5.0,
      "location": 4.7,
      "check_in": 4.9,
      "value": 4.8
    }
  },
  "rules": {
    "check_in_time": "15:00",
    "check_out_time": "11:00",
    "min_nights": 2,
    "max_nights": 30,
    "pets_allowed": false,
    "smoking_allowed": false
  },
  "status": "active",
  "instant_book": true,
  "created_at": "2024-06-15T10:00:00Z"
}
\`\`\`

### Booking Resource

\`\`\`json
{
  "id": "bkg_xyz789",
  "listing": { "id": "lst_abc123", "title": "Cozy Downtown Loft" },
  "guest": { "id": "usr_guest_001", "name": "Bob Smith" },
  "host": { "id": "usr_host_001", "name": "Jane Doe" },
  "check_in": "2025-04-15",
  "check_out": "2025-04-18",
  "nights": 3,
  "guests": 2,
  "pricing": {
    "base_total": 45000,
    "cleaning_fee": 5000,
    "service_fee": 7000,
    "total": 57000,
    "currency": "usd"
  },
  "status": "confirmed",
  "payment_intent": "pi_pay_001",
  "created_at": "2025-03-10T14:30:00Z"
}
\`\`\`

## Endpoint Overview

| Method | Endpoint | Actor | Description |
|--------|----------|-------|-------------|
| POST | /listings | Host | Create listing |
| GET | /listings/{id} | Any | Get listing details |
| PATCH | /listings/{id} | Host | Update listing |
| DELETE | /listings/{id} | Host | Deactivate listing |
| GET | /search/listings | Guest | Search listings |
| GET | /listings/{id}/availability | Any | Check availability |
| PUT | /listings/{id}/availability | Host | Update availability |
| POST | /bookings | Guest | Create booking |
| GET | /bookings/{id} | Host/Guest | Get booking |
| POST | /bookings/{id}/cancel | Host/Guest | Cancel booking |
| POST | /reviews | Host/Guest | Submit review |
| GET | /listings/{id}/reviews | Any | List reviews |

## Key Design Decisions

1. **Prices in cents:** \`15000\` = $150.00. Same reasoning as the Stripe API — avoiding floating-point errors.

2. **Dual-role users:** A user can be both host and guest. The API uses the same \`/users\` resource and determines the role from context (who owns the listing vs. who made the booking).

3. **Embedded host summary:** Listing responses include a minimal host object. This avoids an extra API call when rendering listing cards in search results.

4. **Rating breakdown:** Not just an overall score but sub-scores (cleanliness, accuracy, etc.). This is what Airbnb uses and interviewers appreciate the detail.`,
    },
    {
      id: "marketplace-listings",
      slug: "marketplace-listings",
      title: "Listing CRUD & Search",
      content: `# Listing CRUD & Search

Listing management and search are the two most-used features. Search in particular requires careful design to support location, date, price, and amenity filters efficiently.

## Create a Listing

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

\`\`\`http
HTTP/1.1 201 Created
Location: /api/v1/listings/lst_abc123

{
  "id": "lst_abc123",
  "status": "draft",
  ...
}
\`\`\`

**Status lifecycle:**
\`\`\`
draft → pending_review → active → deactivated
                       → rejected (with reason)
\`\`\`

New listings start as \`draft\`. The host publishes with:

\`\`\`http
POST /api/v1/listings/lst_abc123/publish
HTTP/1.1 200 OK
{ "status": "active" }
\`\`\`

## Update a Listing

\`\`\`http
PATCH /api/v1/listings/lst_abc123 HTTP/1.1
Authorization: Bearer <host_token>
Content-Type: application/json

{
  "pricing": { "base_price": 17500 },
  "amenities": ["wifi", "kitchen", "parking", "pool"]
}
\`\`\`

## Photo Management

\`\`\`http
# Get pre-signed upload URL
POST /api/v1/listings/lst_abc123/photos/upload-url
{ "content_type": "image/jpeg", "filename": "living-room.jpg" }

HTTP/1.1 200 OK
{
  "photo_id": "pho_001",
  "upload_url": "https://uploads.example.com/presigned?token=abc",
  "expires_at": "2025-03-10T15:30:00Z"
}

# After upload, confirm and set order
POST /api/v1/listings/lst_abc123/photos/pho_001/confirm
{ "caption": "Living room with skyline view", "order": 1 }

# Reorder photos
PUT /api/v1/listings/lst_abc123/photos/order
{ "photo_ids": ["pho_003", "pho_001", "pho_002"] }
\`\`\`

## Search Listings

Search is the highest-traffic endpoint. It must support location, dates, price, capacity, and amenity filters.

\`\`\`http
GET /api/v1/search/listings?lat=37.7749&lng=-122.4194&radius=10km&check_in=2025-04-15&check_out=2025-04-18&guests=2&price_min=10000&price_max=30000&amenities=wifi,kitchen&room_type=entire_place&sort=relevance&limit=20
Authorization: Bearer <token>
\`\`\`

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
    ],
    "room_type": [
      { "value": "entire_place", "count": 56 },
      { "value": "private_room", "count": 24 }
    ]
  },
  "map_bounds": {
    "northeast": { "lat": 37.8, "lng": -122.38 },
    "southwest": { "lat": 37.75, "lng": -122.45 }
  },
  "pagination": { "next_cursor": "...", "has_more": true, "total_results": 342 }
}
\`\`\`

### Search Features

**Geo-filtering:** Results are filtered by radius from coordinates. The response includes \`map_bounds\` for rendering a map view.

**Date-aware pricing:** \`total_price\` is computed for the requested dates, accounting for seasonal pricing. This lets guests compare actual costs.

**Facets:** Returned alongside results for building filter UIs. Shows count of listings per category.

**Sort options:**

| Value | Description |
|-------|-------------|
| \`relevance\` | Algorithm-ranked (default) |
| \`price_asc\` | Cheapest first |
| \`price_desc\` | Most expensive first |
| \`rating\` | Highest rated first |
| \`distance\` | Nearest first |
| \`newest\` | Most recently listed |

### Map-Based Search

\`\`\`http
GET /api/v1/search/listings?bounds=37.75,-122.45,37.80,-122.38&check_in=2025-04-15&check_out=2025-04-18&limit=50
\`\`\`

When the user pans the map, the client sends the visible bounding box as \`bounds\` instead of a center point and radius.

## Error Cases

\`\`\`http
# Invalid date range
GET /api/v1/search/listings?check_in=2025-04-18&check_out=2025-04-15
HTTP/1.1 400 Bad Request
{ "error": { "code": "INVALID_DATE_RANGE", "message": "check_out must be after check_in." } }

# Listing not found
GET /api/v1/listings/lst_nonexistent
HTTP/1.1 404 Not Found
{ "error": { "code": "LISTING_NOT_FOUND", "message": "Listing lst_nonexistent does not exist." } }

# Not the host
PATCH /api/v1/listings/lst_abc123
HTTP/1.1 403 Forbidden
{ "error": { "code": "NOT_LISTING_OWNER", "message": "You can only edit your own listings." } }
\`\`\``,
    },
    {
      id: "marketplace-booking",
      slug: "marketplace-booking",
      title: "Booking & Availability",
      content: `# Booking & Availability

Booking is the core transaction of a marketplace. It must handle availability checks, price calculations, concurrency (two guests booking the same dates), and cancellation policies.

## Availability Calendar

### Get Availability

\`\`\`http
GET /api/v1/listings/lst_abc123/availability?start=2025-04-01&end=2025-04-30
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "listing_id": "lst_abc123",
  "dates": [
    { "date": "2025-04-01", "available": true, "price": 15000 },
    { "date": "2025-04-02", "available": true, "price": 15000 },
    { "date": "2025-04-03", "available": false, "reason": "booked" },
    { "date": "2025-04-04", "available": false, "reason": "booked" },
    { "date": "2025-04-05", "available": true, "price": 15000 },
    { "date": "2025-04-15", "available": true, "price": 20000 },
    { "date": "2025-04-16", "available": true, "price": 20000 },
    { "date": "2025-04-17", "available": true, "price": 20000 }
  ],
  "min_nights": 2,
  "max_nights": 30
}
\`\`\`

Prices vary by date — weekends and holidays can have different pricing.

### Update Availability (Host)

\`\`\`http
PUT /api/v1/listings/lst_abc123/availability HTTP/1.1
Authorization: Bearer <host_token>
Content-Type: application/json

{
  "updates": [
    { "date": "2025-04-15", "available": true, "price": 20000 },
    { "date": "2025-04-16", "available": true, "price": 20000 },
    { "date": "2025-04-17", "available": true, "price": 20000 },
    { "date": "2025-04-20", "available": false, "reason": "blocked" }
  ]
}
\`\`\`

## Create a Booking

### Step 1: Price Check

Before booking, verify the total price for the requested dates:

\`\`\`http
POST /api/v1/bookings/price-check HTTP/1.1
Authorization: Bearer <guest_token>
Content-Type: application/json

{
  "listing_id": "lst_abc123",
  "check_in": "2025-04-15",
  "check_out": "2025-04-18",
  "guests": 2
}
\`\`\`

\`\`\`http
HTTP/1.1 200 OK
{
  "listing_id": "lst_abc123",
  "check_in": "2025-04-15",
  "check_out": "2025-04-18",
  "nights": 3,
  "pricing": {
    "nightly_breakdown": [
      { "date": "2025-04-15", "price": 20000 },
      { "date": "2025-04-16", "price": 20000 },
      { "date": "2025-04-17", "price": 20000 }
    ],
    "subtotal": 60000,
    "cleaning_fee": 5000,
    "service_fee": 9100,
    "total": 74100,
    "currency": "usd"
  },
  "available": true,
  "price_valid_until": "2025-03-10T15:00:00Z"
}
\`\`\`

### Step 2: Create Booking

\`\`\`http
POST /api/v1/bookings HTTP/1.1
Authorization: Bearer <guest_token>
Idempotency-Key: ik_booking_order123
Content-Type: application/json

{
  "listing_id": "lst_abc123",
  "check_in": "2025-04-15",
  "check_out": "2025-04-18",
  "guests": 2,
  "payment_method": "pm_card_visa",
  "message_to_host": "Hi Jane, we are excited to visit SF!"
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created

{
  "id": "bkg_xyz789",
  "listing": { "id": "lst_abc123", "title": "Cozy Downtown Loft" },
  "status": "confirmed",
  "check_in": "2025-04-15",
  "check_out": "2025-04-18",
  "nights": 3,
  "pricing": { "total": 74100, "currency": "usd" },
  "payment_intent": "pi_pay_001",
  "cancellation_policy": "moderate",
  "created_at": "2025-03-10T14:30:00Z"
}
\`\`\`

**For instant-book listings:** Status is immediately \`confirmed\`.
**For request-to-book listings:** Status starts as \`pending_host_approval\`.

\`\`\`
Booking status:
  pending_host_approval → confirmed → checked_in → completed
                        → declined (by host)
  confirmed → canceled (by guest or host, with policy applied)
\`\`\`

## Handling Concurrent Bookings

Two guests try to book the same dates:

\`\`\`
1. Guest A: POST /bookings { check_in: Apr 15, check_out: Apr 18 }
2. Guest B: POST /bookings { check_in: Apr 16, check_out: Apr 19 }
   (overlapping dates!)
\`\`\`

**Solution: Optimistic locking with database constraints.**

\`\`\`
Transaction:
1. SELECT available dates with FOR UPDATE (row lock)
2. Check all requested dates are available
3. If YES → insert booking + mark dates unavailable → COMMIT
4. If NO → ROLLBACK → return 409 Conflict
\`\`\`

\`\`\`http
HTTP/1.1 409 Conflict
{
  "error": {
    "code": "DATES_UNAVAILABLE",
    "message": "The listing is no longer available for April 16-18.",
    "unavailable_dates": ["2025-04-16", "2025-04-17"]
  }
}
\`\`\`

## Cancel a Booking

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
| Flexible | Full refund if canceled 24h before check-in |
| Moderate | Full refund if canceled 5 days before check-in |
| Strict | 50% refund if canceled 7 days before; no refund after |
| Super Strict | No refund after booking confirmation |

The policy is set by the host per listing and displayed to the guest before booking.`,
    },
    {
      id: "marketplace-reviews",
      slug: "marketplace-reviews",
      title: "Reviews & Ratings",
      content: `# Reviews & Ratings

Reviews are the trust mechanism of any marketplace. They are two-sided: guests review listings, and hosts review guests. The design must handle timing, fairness, and aggregation.

## Submit a Review

Reviews can only be submitted after a completed stay, within a review window (14 days).

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

| Field | Description |
|-------|-------------|
| \`ratings.overall\` | 1-5 star overall rating |
| \`ratings.cleanliness\` | Cleanliness sub-rating |
| \`ratings.accuracy\` | Listing accuracy vs reality |
| \`ratings.communication\` | Host communication quality |
| \`ratings.location\` | Location convenience |
| \`ratings.check_in\` | Check-in experience |
| \`ratings.value\` | Value for money |
| \`text\` | Written review (public) |
| \`private_feedback\` | Sent to host only (never public) |

## Simultaneous Reveal (Double-Blind)

To prevent bias, both parties submit reviews independently. Reviews are hidden until both have submitted or the review window closes:

\`\`\`
Day 0:  Stay completes
Day 1:  Guest submits review → "Your review will be published when the host also submits."
Day 5:  Host submits review → Both reviews are revealed simultaneously.
Day 14: Window closes → Any submitted reviews are published, even if only one side reviewed.
\`\`\`

\`\`\`http
# Check review status
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

## Host Response

After reviews are published, the host can add one public response:

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

## List Reviews for a Listing

\`\`\`http
GET /api/v1/listings/lst_abc123/reviews?sort=-created_at&limit=10

HTTP/1.1 200 OK
{
  "data": [
    {
      "id": "rev_001",
      "reviewer": { "id": "usr_guest_001", "name": "Bob S.", "avatar_url": "..." },
      "ratings": { "overall": 5, ... },
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

The \`summary\` object provides pre-aggregated statistics so the client does not need to compute averages locally.

## Host Reviews of Guests

Hosts also review guests — this builds the guest's reputation:

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

## Validation Rules

\`\`\`http
# Cannot review without a completed booking
POST /api/v1/reviews
HTTP/1.1 422 Unprocessable Entity
{ "error": { "code": "BOOKING_NOT_COMPLETED", "message": "Reviews can only be submitted after the stay is complete." } }

# Review window expired
POST /api/v1/reviews
HTTP/1.1 422 Unprocessable Entity
{ "error": { "code": "REVIEW_WINDOW_CLOSED", "message": "The 14-day review window has closed." } }

# Already reviewed
POST /api/v1/reviews
HTTP/1.1 409 Conflict
{ "error": { "code": "ALREADY_REVIEWED", "message": "You have already submitted a review for this booking." } }
\`\`\`

Reviews are immutable after submission — they cannot be edited. This prevents hosts from pressuring guests to change negative reviews.`,
    },
    {
      id: "marketplace-walkthrough",
      slug: "marketplace-walkthrough",
      title: "API Walkthrough",
      content: `# Marketplace API: Walkthrough & Trade-offs

Let us consolidate the marketplace API and discuss the key design decisions.

## Complete Endpoint Summary

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

## End-to-End Booking Flow

\`\`\`
1. Guest searches:
   GET /search/listings?lat=37.77&lng=-122.41&check_in=Apr15&check_out=Apr18
   → Receives paginated listing results with total prices

2. Guest views listing:
   GET /listings/lst_abc123
   → Full listing details, photos, reviews, amenities

3. Guest checks availability:
   GET /listings/lst_abc123/availability?start=2025-04-01&end=2025-04-30
   → Calendar with per-date pricing and availability

4. Guest gets price breakdown:
   POST /bookings/price-check { listing_id, check_in, check_out, guests }
   → Nightly breakdown, fees, total

5. Guest books:
   POST /bookings { listing_id, check_in, check_out, guests, payment_method }
   → Booking confirmed (instant book) or pending (request to book)

6. Host approves (if request-to-book):
   POST /bookings/bkg_xyz789/approve
   → Guest is charged, dates blocked

7. After stay, both review:
   POST /reviews { booking_id, ratings, text }
   → Reviews revealed when both submit or after 14 days
\`\`\`

## Trade-offs to Discuss

### 1. Instant Book vs Request-to-Book

| Approach | Pros | Cons |
|----------|------|------|
| Instant book | Better guest conversion, simpler flow | Host cannot screen guests |
| Request-to-book | Host control, quality assurance | Slower, lower conversion |

**Our choice:** Support both. Let the host choose per listing. Default to instant book for professional hosts.

### 2. Availability: Calendar Table vs Booking Range Check

| Approach | Pros | Cons |
|----------|------|------|
| Calendar table (one row per date) | Supports per-date pricing, blocked dates | More storage, complex updates |
| Booking range check (query bookings) | Less storage | Cannot block individual dates, no custom pricing |

**Our choice:** Calendar table. Per-date pricing and the ability to block individual dates are essential marketplace features.

### 3. Search: Application-Level vs Search Engine

| Approach | Pros | Cons |
|----------|------|------|
| Database queries | Simpler infrastructure | Slow geo queries, limited relevance ranking |
| Elasticsearch/Solr | Fast, faceted search, geo-native, relevance scoring | Additional infrastructure, data sync complexity |

**Our choice:** Elasticsearch for search, database for booking transactions. Search data is synced asynchronously from the database. This is how Airbnb, Uber, and most marketplaces work.

### 4. Double-Blind Reviews

This prevents review retaliation. If the guest sees the host gave a bad review, they might retaliate. By hiding reviews until both are submitted, both parties are honest.

**Trade-off:** Some users find it confusing. The alternative (immediate publication) is simpler but leads to biased reviews.

### 5. Pricing Strategy

| Approach | Description |
|----------|-------------|
| Fixed nightly rate | Simple but inflexible |
| Per-date pricing (our choice) | Handles weekends, holidays, seasons |
| Smart pricing | Algorithm sets optimal price based on demand |
| Length-of-stay discounts | Weekly (e.g., -10%) and monthly (e.g., -20%) |

**Our design supports all of these.** The availability calendar stores per-date prices. Discounts can be computed at the price-check stage.

## What Makes This a Strong Answer

1. **Two-sided design** — distinct flows for hosts and guests
2. **Search with facets and geo-filtering** — production-grade search API
3. **Concurrency handling** — optimistic locking on booking creation
4. **Price-check before booking** — transparent pricing prevents disputes
5. **Cancellation policies** — configurable per listing with refund calculations
6. **Double-blind reviews** — shows understanding of marketplace trust dynamics
7. **Availability calendar** — per-date pricing and blocking
8. **Idempotency key on bookings** — prevents duplicate charges

This level of depth demonstrates that you understand both the API surface and the business logic that drives a real marketplace.`,
    },
  ],
};
