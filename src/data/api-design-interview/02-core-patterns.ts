import { Module } from "../types";

export const corePatternsModule: Module = {
  id: "api-core-patterns",
  title: "Core API Patterns",
  description:
    "Learn the essential patterns every production API needs — pagination, rate limiting, idempotency, filtering, error handling, and discoverability.",
  lessons: [
    {
      id: "pagination-cursor-offset",
      slug: "pagination-cursor-offset",
      title: "Pagination (Cursor vs Offset)",
      content: `# Pagination (Cursor vs Offset)

Any endpoint that returns a list must be paginated. Without pagination, a single request could return millions of records, crushing both server and client.

## Offset-Based Pagination

The traditional approach. Specify a page number or offset and a limit.

\`\`\`http
GET /api/v1/products?offset=20&limit=10
\`\`\`

\`\`\`json
{
  "data": [
    { "id": "prod_021", "name": "Widget A", "price": 29.99 },
    { "id": "prod_022", "name": "Widget B", "price": 19.99 }
  ],
  "pagination": {
    "offset": 20,
    "limit": 10,
    "total": 532
  }
}
\`\`\`

**Pros:** Simple, supports "jump to page N", easy to implement with SQL \`OFFSET\`.
**Weaknesses:**
- **Drift problem**: If items are inserted/deleted between page requests, items are skipped or duplicated
- **Performance**: \`OFFSET 100000\` still scans 100,000 rows in most databases
- **Inconsistency**: Total count changes between requests

## Cursor-Based Pagination

Uses an opaque cursor (typically an encoded ID or timestamp) to mark the position.

\`\`\`http
GET /api/v1/products?limit=10&after=eyJpZCI6InByb2RfMDIwIn0=
\`\`\`

\`\`\`json
{
  "data": [
    { "id": "prod_021", "name": "Widget A", "price": 29.99 },
    { "id": "prod_022", "name": "Widget B", "price": 19.99 }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6InByb2RfMDMwIn0=",
    "has_more": true
  }
}
\`\`\`

The cursor is typically a base64-encoded value: \`{"id": "prod_030"}\` → \`eyJpZCI6InByb2RfMDMwIn0=\`

**Pros:** No drift, efficient (uses \`WHERE id > cursor\` instead of \`OFFSET\`), stable under concurrent writes.
**Cons:** Cannot jump to arbitrary page, no total count by default.

## Comparison Table

| Feature | Offset | Cursor |
|---------|--------|--------|
| Jump to page N | Yes | No |
| Consistent under writes | No | Yes |
| Performance at scale | Degrades | Constant |
| Total count | Easy | Expensive |
| Implementation | Simple | Moderate |

## When to Use Which

- **Offset**: Admin dashboards, internal tools, small datasets, when "page N" is required
- **Cursor**: Public APIs, feeds/timelines, large datasets, real-time data

## Interview Best Practice

Default to **cursor-based** pagination in API design interviews. It handles scale better and is what companies like Stripe, Slack, and Facebook use. Mention offset as an alternative if the use case specifically needs page jumping.`,
      starterCode: `# Implement cursor-based pagination for a Flask API
from flask import Flask, request, jsonify
import base64
import json

app = Flask(__name__)

# Simulated database of products
PRODUCTS = [{"id": f"prod_{i:03d}", "name": f"Product {i}", "price": round(9.99 + i * 0.5, 2)} for i in range(1, 101)]

@app.route("/api/v1/products", methods=["GET"])
def list_products():
    limit = min(int(request.args.get("limit", 10)), 50)  # Max 50
    after_cursor = request.args.get("after", None)

    # TODO: Implement cursor-based pagination
    # 1. If after_cursor is provided, decode it (base64 JSON with "id" field)
    # 2. Find the starting position in PRODUCTS
    # 3. Return 'limit' items starting after that position
    # 4. Generate next_cursor from the last returned item
    # 5. Include has_more flag

    return jsonify({
        "data": [],
        "pagination": {
            "next_cursor": None,
            "has_more": False
        }
    })

if __name__ == "__main__":
    app.run(debug=True)`,
      solutionCode: `# Cursor-based pagination for a Flask API
from flask import Flask, request, jsonify
import base64
import json

app = Flask(__name__)

PRODUCTS = [{"id": f"prod_{i:03d}", "name": f"Product {i}", "price": round(9.99 + i * 0.5, 2)} for i in range(1, 101)]

def encode_cursor(product_id: str) -> str:
    return base64.b64encode(json.dumps({"id": product_id}).encode()).decode()

def decode_cursor(cursor: str) -> str:
    return json.loads(base64.b64decode(cursor).decode())["id"]

@app.route("/api/v1/products", methods=["GET"])
def list_products():
    limit = min(int(request.args.get("limit", 10)), 50)
    after_cursor = request.args.get("after", None)

    start_index = 0
    if after_cursor:
        cursor_id = decode_cursor(after_cursor)
        for i, product in enumerate(PRODUCTS):
            if product["id"] == cursor_id:
                start_index = i + 1
                break

    page = PRODUCTS[start_index:start_index + limit]
    has_more = start_index + limit < len(PRODUCTS)
    next_cursor = encode_cursor(page[-1]["id"]) if page and has_more else None

    return jsonify({
        "data": page,
        "pagination": {
            "next_cursor": next_cursor,
            "has_more": has_more
        }
    })

if __name__ == "__main__":
    app.run(debug=True)`,
    },
    {
      id: "rate-limiting",
      slug: "rate-limiting",
      title: "Rate Limiting & Throttling",
      content: `# Rate Limiting & Throttling

Rate limiting protects your API from abuse, ensures fair usage, and prevents cascading failures. Every production API needs it.

## Core Algorithms

### 1. Fixed Window
Count requests in fixed time windows (e.g., per minute). Simple but allows bursts at window boundaries.

\`\`\`
Window: 12:00-12:01 → 100 requests allowed
At 12:00:59 → user sends 100 requests (allowed)
At 12:01:00 → new window, user sends 100 more (allowed)
Result: 200 requests in 2 seconds — burst problem!
\`\`\`

### 2. Sliding Window Log
Track the timestamp of every request. Count requests in the last N seconds. Accurate but memory-intensive.

### 3. Sliding Window Counter
Hybrid approach: combine the current window count with a weighted portion of the previous window count.

\`\`\`
Previous window: 84 requests
Current window: 36 requests (40% through window)
Estimated rate: 84 * 0.6 + 36 = 86.4 requests
Limit: 100 → ALLOW
\`\`\`

### 4. Token Bucket (Most Common)
A bucket holds tokens. Each request consumes a token. Tokens are added at a fixed rate. If the bucket is empty, requests are rejected.

\`\`\`
Bucket capacity: 100 tokens
Refill rate: 10 tokens/second
Burst: up to 100 requests instantly
Sustained: 10 requests/second
\`\`\`

## Rate Limit Response Headers

Every API should return rate limit information in response headers:

\`\`\`http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 67
X-RateLimit-Reset: 1700000060
\`\`\`

When the limit is exceeded:

\`\`\`http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1700000060
Content-Type: application/json

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 30 seconds.",
    "retry_after": 30
  }
}
\`\`\`

## Rate Limit Tiers

Different consumers get different limits:

| Tier | Limit | Use Case |
|------|-------|----------|
| Free | 100 req/hour | Trial users |
| Basic | 1,000 req/hour | Paid individuals |
| Pro | 10,000 req/hour | Business accounts |
| Enterprise | Custom | Negotiated SLA |

## Granularity Options

Rate limits can be applied at multiple levels:

- **Per API key** — most common for third-party APIs
- **Per user** — for authenticated user-facing APIs
- **Per IP** — for unauthenticated endpoints (login, signup)
- **Per endpoint** — expensive operations get lower limits
- **Global** — total system throughput protection

## Interview Tips

When designing rate limiting in an interview, always specify: the algorithm (token bucket is a safe default), the limit values, the response format (429 + headers), and the granularity (per-key, per-user, or per-IP).`,
      starterCode: `# Implement a Token Bucket rate limiter in Python
import time
from flask import Flask, request, jsonify

app = Flask(__name__)

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        """
        capacity: Maximum tokens in the bucket
        refill_rate: Tokens added per second
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        # TODO: Initialize token count and last refill timestamp
        self.tokens = 0
        self.last_refill = 0

    def _refill(self):
        """Add tokens based on elapsed time since last refill"""
        # TODO: Calculate elapsed time and add tokens
        # Tokens should not exceed capacity
        pass

    def consume(self, tokens: int = 1) -> bool:
        """Try to consume tokens. Return True if allowed, False if rejected."""
        # TODO: Refill first, then check if enough tokens
        # If enough tokens, consume and return True
        # Otherwise return False
        pass

# Store one bucket per API key
buckets: dict[str, TokenBucket] = {}

def get_bucket(api_key: str) -> TokenBucket:
    if api_key not in buckets:
        buckets[api_key] = TokenBucket(capacity=10, refill_rate=1)
    return buckets[api_key]

@app.route("/api/v1/data", methods=["GET"])
def get_data():
    api_key = request.headers.get("X-API-Key", "anonymous")
    bucket = get_bucket(api_key)

    # TODO: Check rate limit
    # If allowed, return data with rate limit headers
    # If rejected, return 429 with Retry-After header

    return jsonify({"message": "implement me"})

if __name__ == "__main__":
    app.run(debug=True)`,
      solutionCode: `# Token Bucket rate limiter in Python
import time
from flask import Flask, request, jsonify

app = Flask(__name__)

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.time()

    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        new_tokens = elapsed * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + new_tokens)
        self.last_refill = now

    def consume(self, tokens: int = 1) -> bool:
        self._refill()
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False

buckets: dict[str, TokenBucket] = {}

def get_bucket(api_key: str) -> TokenBucket:
    if api_key not in buckets:
        buckets[api_key] = TokenBucket(capacity=10, refill_rate=1)
    return buckets[api_key]

@app.route("/api/v1/data", methods=["GET"])
def get_data():
    api_key = request.headers.get("X-API-Key", "anonymous")
    bucket = get_bucket(api_key)

    if bucket.consume():
        return jsonify({
            "data": {"message": "Here is your data!"}
        }), 200, {
            "X-RateLimit-Limit": str(bucket.capacity),
            "X-RateLimit-Remaining": str(int(bucket.tokens)),
            "X-RateLimit-Reset": str(int(bucket.last_refill + bucket.capacity / bucket.refill_rate))
        }
    else:
        retry_after = int((1 - bucket.tokens) / bucket.refill_rate) + 1
        return jsonify({
            "error": {
                "code": "RATE_LIMIT_EXCEEDED",
                "message": f"Rate limit exceeded. Retry after {retry_after} seconds.",
                "retry_after": retry_after
            }
        }), 429, {
            "Retry-After": str(retry_after),
            "X-RateLimit-Limit": str(bucket.capacity),
            "X-RateLimit-Remaining": "0"
        }

if __name__ == "__main__":
    app.run(debug=True)`,
    },
    {
      id: "idempotency-retry",
      slug: "idempotency-retry",
      title: "Idempotency & Retry Safety",
      content: `# Idempotency & Retry Safety

Network failures happen. Clients will retry requests. If your API is not idempotent where it matters, retries can create duplicate orders, double-charge customers, or send duplicate messages.

## What Is Idempotency?

An operation is **idempotent** if performing it multiple times produces the same result as performing it once.

\`\`\`
GET  /users/123          → Always returns the same user    → Idempotent
PUT  /users/123 {name}   → Replaces user, same result      → Idempotent
DELETE /users/123        → Deletes user, already gone       → Idempotent
POST /orders {items}     → Creates a NEW order each time    → NOT Idempotent
\`\`\`

POST is the dangerous method. Without protection, a retried POST can create duplicate resources.

## Idempotency Keys

The solution: require clients to send a unique key with non-idempotent requests. The server stores the key and returns the same response for duplicate keys.

\`\`\`http
POST /api/v1/payments HTTP/1.1
Idempotency-Key: ik_a1b2c3d4e5f6
Content-Type: application/json

{
  "amount": 5000,
  "currency": "usd",
  "customer": "cus_123"
}
\`\`\`

**First request:** Process the payment, store the result keyed by \`ik_a1b2c3d4e5f6\`, return 201.
**Retry with same key:** Return the stored result without reprocessing. Return 200 (not 201).

\`\`\`json
{
  "id": "pay_xyz789",
  "amount": 5000,
  "currency": "usd",
  "status": "succeeded",
  "idempotency_key": "ik_a1b2c3d4e5f6"
}
\`\`\`

## Server-Side Implementation

\`\`\`
On receiving a request with an Idempotency-Key:

1. Check if key exists in store (Redis / DB)
   ├─ Key exists + result stored → return stored result
   ├─ Key exists + no result (in-progress) → return 409 Conflict
   └─ Key does not exist → continue to step 2

2. Store the key with status "processing" (with TTL, e.g., 24h)

3. Execute the operation

4. Store the result alongside the key

5. Return the result to the client
\`\`\`

## Key Design Decisions

| Decision | Recommendation |
|----------|---------------|
| Key format | UUID v4 or prefixed random string (\`ik_...\`) |
| Key TTL | 24-48 hours (balance storage vs safety) |
| Storage | Redis (fast) or database (durable) |
| Key scope | Per API key / per user (not global) |
| Conflict handling | Return 409 if same key is in-progress |

## Error Scenarios

\`\`\`http
# Different request body with same idempotency key
HTTP/1.1 422 Unprocessable Entity
{
  "error": {
    "code": "IDEMPOTENCY_KEY_REUSE",
    "message": "Idempotency key already used with different request parameters"
  }
}
\`\`\`

\`\`\`http
# Concurrent request with same key (still processing)
HTTP/1.1 409 Conflict
{
  "error": {
    "code": "IDEMPOTENCY_KEY_IN_PROGRESS",
    "message": "A request with this idempotency key is currently being processed"
  }
}
\`\`\`

## Retry Strategy (Client Side)

\`\`\`
Retry with exponential backoff:
  Attempt 1: immediate
  Attempt 2: wait 1s
  Attempt 3: wait 2s
  Attempt 4: wait 4s
  Attempt 5: wait 8s (give up after this)

Add jitter: actual_wait = base_wait * (0.5 + random(0, 1))

Always reuse the same Idempotency-Key for retries!
\`\`\`

## Interview Key Points

In interviews, bring up idempotency whenever you design a POST endpoint that creates resources or triggers side effects. Mention the Stripe model as the gold standard: client-generated idempotency key, 24-hour TTL, stored results, 422 on key reuse with different parameters.`,
    },
    {
      id: "filtering-sorting-search",
      slug: "filtering-sorting-search",
      title: "Filtering, Sorting & Search",
      content: `# Filtering, Sorting & Search

List endpoints are rarely useful without the ability to filter, sort, and search. These features need to be designed consistently across your entire API.

## Filtering

Use query parameters to filter collections. Keep the syntax simple and predictable.

\`\`\`http
# Simple equality filters
GET /api/v1/products?category=electronics&status=active

# Range filters (use suffixes)
GET /api/v1/products?price_min=10&price_max=100
GET /api/v1/orders?created_after=2025-01-01&created_before=2025-06-30

# Multiple values (comma-separated)
GET /api/v1/products?category=electronics,books,clothing

# Boolean filters
GET /api/v1/users?verified=true&active=true
\`\`\`

### Advanced Filtering Syntax

For complex APIs, some teams use a structured filter parameter:

\`\`\`http
# LHS bracket syntax (used by Stripe)
GET /api/v1/charges?amount[gte]=1000&amount[lte]=5000&status[eq]=succeeded

# Filter parameter (used by JSON:API)
GET /api/v1/products?filter[category]=electronics&filter[price][gt]=100
\`\`\`

## Sorting

\`\`\`http
# Single field sort
GET /api/v1/products?sort=price          # ascending (default)
GET /api/v1/products?sort=-price         # descending (prefix with -)

# Multi-field sort
GET /api/v1/products?sort=-created_at,name   # newest first, then alphabetical
\`\`\`

**Response should include the applied sort:**

\`\`\`json
{
  "data": [...],
  "meta": {
    "sort": ["-created_at", "name"],
    "total": 245
  }
}
\`\`\`

## Search

### Simple Text Search

\`\`\`http
GET /api/v1/products?q=wireless+headphones
\`\`\`

### Scoped Search (search specific fields)

\`\`\`http
GET /api/v1/products?q=wireless&search_fields=name,description
\`\`\`

### Dedicated Search Endpoint

For complex search, a dedicated endpoint is often cleaner:

\`\`\`http
POST /api/v1/products/search
Content-Type: application/json

{
  "query": "wireless headphones",
  "filters": {
    "category": "electronics",
    "price": { "min": 50, "max": 200 },
    "in_stock": true
  },
  "sort": [{ "field": "relevance", "order": "desc" }],
  "pagination": { "limit": 20, "after": "cursor_abc" }
}
\`\`\`

\`\`\`json
{
  "data": [
    {
      "id": "prod_123",
      "name": "Wireless Headphones Pro",
      "price": 149.99,
      "relevance_score": 0.95
    }
  ],
  "facets": {
    "category": [
      { "value": "electronics", "count": 45 },
      { "value": "accessories", "count": 12 }
    ],
    "brand": [
      { "value": "Sony", "count": 8 },
      { "value": "Bose", "count": 6 }
    ]
  },
  "pagination": { "next_cursor": "cursor_def", "has_more": true }
}
\`\`\`

## Field Selection (Sparse Fieldsets)

Let clients request only the fields they need to reduce payload size:

\`\`\`http
GET /api/v1/users?fields=id,name,email
GET /api/v1/products?fields=id,name,price&include=category
\`\`\`

## Combining Everything

\`\`\`http
GET /api/v1/products?category=electronics&price_min=50&sort=-rating&q=wireless&fields=id,name,price,rating&limit=20&after=cursor_abc
\`\`\`

## Consistency Rules for Interviews

1. Use the same filtering syntax across all endpoints
2. Document which fields are filterable and sortable
3. Default sort should be deterministic (e.g., \`-created_at,id\`)
4. Always combine search/filter/sort with pagination
5. Return metadata about applied filters in the response

These patterns are expected in any API design interview — always include filtering and sorting when designing list endpoints.`,
    },
    {
      id: "error-handling-status-codes",
      slug: "error-handling-status-codes",
      title: "Error Handling & Status Codes",
      content: `# Error Handling & Status Codes

Good error handling separates amateur APIs from professional ones. Interviewers pay close attention to how you define error responses because it reveals your attention to developer experience.

## The Standard Error Envelope

Every error response should follow a consistent structure:

\`\`\`json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested user was not found.",
    "details": [],
    "request_id": "req_abc123",
    "docs_url": "https://docs.api.com/errors/RESOURCE_NOT_FOUND"
  }
}
\`\`\`

| Field | Purpose |
|-------|---------|
| \`code\` | Machine-readable error identifier (for programmatic handling) |
| \`message\` | Human-readable explanation (for debugging) |
| \`details\` | Array of specific sub-errors (for validation) |
| \`request_id\` | Unique ID for support/debugging |
| \`docs_url\` | Link to error documentation |

## Validation Errors (400/422)

Validation errors should pinpoint exactly which fields failed and why:

\`\`\`http
POST /api/v1/users
{ "email": "not-an-email", "age": -5 }

HTTP/1.1 422 Unprocessable Entity
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body contains invalid fields.",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Must be a valid email address."
      },
      {
        "field": "age",
        "code": "OUT_OF_RANGE",
        "message": "Must be a positive integer.",
        "constraint": { "min": 0, "max": 150 }
      }
    ]
  }
}
\`\`\`

## Common Error Patterns

\`\`\`http
# 400 Bad Request — malformed syntax
{ "error": { "code": "INVALID_JSON", "message": "Request body is not valid JSON." } }

# 401 Unauthorized — no or invalid credentials
{ "error": { "code": "AUTHENTICATION_REQUIRED", "message": "Missing or invalid API key." } }

# 403 Forbidden — valid credentials, insufficient permissions
{ "error": { "code": "INSUFFICIENT_PERMISSIONS", "message": "Your API key does not have write access." } }

# 404 Not Found — resource does not exist
{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "User usr_999 not found." } }

# 409 Conflict — state conflict
{ "error": { "code": "DUPLICATE_RESOURCE", "message": "A user with this email already exists." } }

# 429 Too Many Requests — rate limited
{ "error": { "code": "RATE_LIMIT_EXCEEDED", "message": "Retry after 30 seconds.", "retry_after": 30 } }

# 500 Internal Server Error — unexpected failure
{ "error": { "code": "INTERNAL_ERROR", "message": "An unexpected error occurred.", "request_id": "req_xyz" } }

# 503 Service Unavailable — temporary outage
{ "error": { "code": "SERVICE_UNAVAILABLE", "message": "The service is temporarily unavailable.", "retry_after": 60 } }
\`\`\`

## Error Code Design Principles

1. **Use SCREAMING_SNAKE_CASE** for error codes — machine-parseable and unambiguous
2. **Never expose stack traces** in production — return \`request_id\` for internal debugging
3. **Be specific** — \`CARD_DECLINED\` is better than \`PAYMENT_FAILED\`
4. **Be helpful** — tell the client how to fix the problem
5. **Be consistent** — same error structure across every endpoint

## Partial Success (Batch Operations)

For batch endpoints, report per-item success/failure:

\`\`\`http
POST /api/v1/emails/send-batch
{
  "messages": [
    { "to": "valid@example.com", "subject": "Hi" },
    { "to": "invalid-email", "subject": "Hey" },
    { "to": "valid2@example.com", "subject": "Hello" }
  ]
}

HTTP/1.1 207 Multi-Status
{
  "results": [
    { "index": 0, "status": 202, "id": "msg_001" },
    { "index": 1, "status": 422, "error": { "code": "INVALID_EMAIL", "message": "Invalid recipient" } },
    { "index": 2, "status": 202, "id": "msg_002" }
  ],
  "summary": { "succeeded": 2, "failed": 1 }
}
\`\`\`

## Interview Best Practices

Always define error responses for every endpoint you design. At minimum, show 400 (validation), 401 (auth), 404 (not found), and 429 (rate limit). This signals maturity and thoroughness to the interviewer.`,
    },
    {
      id: "hateoas-discoverability",
      slug: "hateoas-discoverability",
      title: "HATEOAS & Discoverability",
      content: `# HATEOAS & Discoverability

HATEOAS (Hypermedia As The Engine Of Application State) is the most often overlooked REST constraint. It means that API responses include links that tell clients what actions are available next.

## The Basic Idea

Instead of clients hardcoding URL paths, the API response itself contains links to related resources and available actions.

### Without HATEOAS (typical)

\`\`\`json
{
  "id": "order_123",
  "status": "pending",
  "total": 99.99
}
\`\`\`

The client must know that to cancel this order, it should call \`DELETE /orders/order_123\`. This knowledge is hardcoded.

### With HATEOAS

\`\`\`json
{
  "id": "order_123",
  "status": "pending",
  "total": 99.99,
  "links": [
    { "rel": "self", "href": "/api/v1/orders/order_123", "method": "GET" },
    { "rel": "cancel", "href": "/api/v1/orders/order_123/cancel", "method": "POST" },
    { "rel": "pay", "href": "/api/v1/orders/order_123/payments", "method": "POST" },
    { "rel": "items", "href": "/api/v1/orders/order_123/items", "method": "GET" }
  ]
}
\`\`\`

If the order status were "shipped", the "cancel" and "pay" links would not appear — the response drives client behavior.

## State-Dependent Links

This is the real power. Available actions change based on resource state:

\`\`\`
Order status: "pending"
  → links: [self, cancel, pay, update]

Order status: "paid"
  → links: [self, refund, track, items]

Order status: "shipped"
  → links: [self, track, items]

Order status: "delivered"
  → links: [self, return, review, items]
\`\`\`

## Pagination Links

HATEOAS is most commonly seen in pagination:

\`\`\`json
{
  "data": [...],
  "links": {
    "self": "/api/v1/products?page=3&limit=20",
    "first": "/api/v1/products?page=1&limit=20",
    "prev": "/api/v1/products?page=2&limit=20",
    "next": "/api/v1/products?page=4&limit=20",
    "last": "/api/v1/products?page=12&limit=20"
  }
}
\`\`\`

## Link Header (RFC 8288)

An alternative to inline links — use the HTTP Link header:

\`\`\`http
HTTP/1.1 200 OK
Link: </api/v1/products?page=4&limit=20>; rel="next",
      </api/v1/products?page=2&limit=20>; rel="prev",
      </api/v1/products?page=1&limit=20>; rel="first"
\`\`\`

**Used by:** GitHub API for pagination.

## API Root / Discovery Endpoint

A discoverable API provides a root endpoint that lists all available resources:

\`\`\`http
GET /api/v1/

{
  "links": {
    "users": { "href": "/api/v1/users" },
    "products": { "href": "/api/v1/products" },
    "orders": { "href": "/api/v1/orders" },
    "docs": { "href": "https://docs.api.com" },
    "status": { "href": "https://status.api.com" }
  },
  "version": "1.0.0"
}
\`\`\`

## OpenAPI / Swagger

In practice, most APIs achieve discoverability through machine-readable API specifications rather than HATEOAS:

\`\`\`http
GET /api/v1/openapi.json  → Full OpenAPI spec
GET /api/v1/docs           → Swagger UI (interactive documentation)
\`\`\`

## Interview Perspective

Full HATEOAS is rare in production APIs. However, mentioning it in an interview shows deep REST knowledge. The practical takeaway: always include pagination links, and consider including action links when resource state determines what operations are valid. This is especially valuable for payment flows, order lifecycles, and approval workflows where state machines drive the UX.

A reasonable interview answer: "I would include HATEOAS-style links for state-dependent actions like order cancellation and payment, and for pagination. I would not implement full HATEOAS discoverability — instead I would provide an OpenAPI specification for documentation."`,
    },
  ],
};
