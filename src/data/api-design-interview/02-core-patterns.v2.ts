import { Module } from "../types";

export const corePatternsModule: Module = {
  id: "api-core-patterns",
  title: "Core API Patterns",
  description: "Learn the essential patterns every production API needs — pagination, rate limiting, idempotency, filtering, error handling, and discoverability.",
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

Good error handling separates amateur APIs from professional ones. Interviewers pay close attention to how you define error responses because it signals your attention to developer experience — and your understanding of what clients actually need when things go wrong.

\`\`\`concept
{ "title": "Errors Are Part of Your API Contract", "variant": "mental-model", "content": "Every API endpoint has two contracts: the happy path (2xx responses) and the error path (4xx/5xx responses). Most developers document only the happy path. Senior engineers treat every possible failure mode as a first-class citizen — with a consistent structure, a machine-readable code, and enough context for the client to act on the problem without filing a support ticket." }
\`\`\`

## The Standard Error Envelope

Every error response should follow a single, consistent structure across every endpoint:

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
| \`code\` | Machine-readable identifier — clients branch on this |
| \`message\` | Human-readable explanation — engineers read this while debugging |
| \`details\` | Array of sub-errors (invaluable for validation failures) |
| \`request_id\` | Unique ID tied to server logs — enables support without exposing internals |
| \`docs_url\` | Deep link to the specific error's documentation page |

The key insight: \`code\` is for code, \`message\` is for humans. They serve different consumers.

## Validation Errors — Be Specific

A \`422 Unprocessable Entity\` should tell the client *exactly* which fields failed and *why*, so they can fix the request without guessing:

\`\`\`json
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

Notice \`details\` is an array — multiple fields can fail at once. Never make the client fix one field, resubmit, hit another error, fix that field, and repeat. Report all validation failures in a single response.

## The Essential Error Codes

\`\`\`tabs
{
  "tabs": [
    {
      "label": "4xx — Client Errors",
      "icon": "🔴",
      "content": "These mean the client made a mistake. They should **not** be retried without fixing the request.\\n\\n| Code | Name | When to use |\\n|------|------|-------------|\\n| \`400\` | Bad Request | Malformed syntax, invalid JSON |\\n| \`401\` | Unauthorized | Missing or invalid credentials |\\n| \`403\` | Forbidden | Valid credentials, no permission |\\n| \`404\` | Not Found | Resource does not exist |\\n| \`409\` | Conflict | State conflict (duplicate, wrong version) |\\n| \`422\` | Unprocessable Entity | Syntactically valid but semantically invalid |\\n| \`429\` | Too Many Requests | Rate limit exceeded — include \`Retry-After\` |\\n\\n**401 vs 403:** A critical distinction. \`401\` means \\"I don't know who you are.\\" \`403\` means \\"I know who you are, but you can't do this.\\" Conflating them leaks information about resource existence."
    },
    {
      "label": "5xx — Server Errors",
      "icon": "🟠",
      "content": "These mean something went wrong on your side. Clients **can** retry 5xx errors with exponential backoff — they are not the client's fault.\\n\\n| Code | Name | When to use |\\n|------|------|-------------|\\n| \`500\` | Internal Server Error | Unexpected failure — always include \`request_id\` |\\n| \`503\` | Service Unavailable | Maintenance or overload — include \`Retry-After\` |\\n\\n**Never expose stack traces** in 500 responses. Return a \`request_id\` so your team can look up the full trace in your logging system. The client gets a safe error; your team gets the full picture.\\n\\n\`\`\`json\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"INTERNAL_ERROR\\",\\n    \\"message\\": \\"An unexpected error occurred. Please contact support.\\",\\n    \\"request_id\\": \\"req_xyz789\\"\\n  }\\n}\\n\`\`\`"
    },
    {
      "label": "2xx — Success Variants",
      "icon": "🟢",
      "content": "Not all success responses should return \`200\`. Using the right 2xx code communicates *what* succeeded:\\n\\n| Code | Name | When to use |\\n|------|------|-------------|\\n| \`200\` | OK | General success with a response body |\\n| \`201\` | Created | Resource was created (POST/PUT) — include \`Location\` header |\\n| \`202\` | Accepted | Request accepted but processing is async |\\n| \`204\` | No Content | Success with no body (DELETE, PATCH with no return) |\\n| \`207\` | Multi-Status | Batch operation with mixed per-item results |\\n\\n\`201 Created\` should include a \`Location\` header pointing to the new resource:\\n\`\`\`\\nHTTP/1.1 201 Created\\nLocation: /api/v1/users/usr_abc123\\n\`\`\`"
    }
  ]
}
\`\`\`

## The Anti-Pattern: 200 With an Error Body

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Anti-Pattern — Never Do This",
    "code": "HTTP/1.1 200 OK\\n\\n{\\n  \\"success\\": false,\\n  \\"error\\": \\"user not found\\"\\n}"
  },
  "after": {
    "label": "Correct — Status Code Carries Meaning",
    "code": "HTTP/1.1 404 Not Found\\n\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"RESOURCE_NOT_FOUND\\",\\n    \\"message\\": \\"User usr_999 not found.\\",\\n    \\"request_id\\": \\"req_abc123\\"\\n  }\\n}"
  }
}
\`\`\`

The \`200 OK\` with an error body anti-pattern forces every HTTP client to parse the body before knowing if the call succeeded. Monitoring tools, load balancers, and SDK retry logic all rely on HTTP status codes — not body content.

\`\`\`callout
{ "type": "danger", "title": "Never Expose Stack Traces in Production", "content": "Stack traces contain internal service names, file paths, library versions, and database schema details — a goldmine for attackers. Instead, log the full stack trace server-side tied to a \`request_id\`, and return only that ID to the client. Support engineers use the ID to retrieve the trace from your logging system." }
\`\`\`

## Partial Success — The 207 Multi-Status Pattern

Batch endpoints need a way to report per-item results when some items succeed and others fail. HTTP status \`207 Multi-Status\` is the right tool:

\`\`\`json
{
  "results": [
    { "index": 0, "status": 202, "id": "msg_001" },
    {
      "index": 1,
      "status": 422,
      "error": { "code": "INVALID_EMAIL", "message": "Invalid recipient address." }
    },
    { "index": 2, "status": 202, "id": "msg_002" }
  ],
  "summary": { "succeeded": 2, "failed": 1 }
}
\`\`\`

The \`summary\` field lets clients quickly check overall outcome without iterating the full results array. The \`index\` field maps back to the original request items unambiguously.

## Error Code Design Principles

Five rules that separate well-designed error systems from ad-hoc ones:

\`\`\`steps
{
  "title": "Designing Error Codes",
  "steps": [
    {
      "title": "Use SCREAMING_SNAKE_CASE",
      "content": "Error codes should be \`VALIDATION_ERROR\`, not \`validationError\` or \`validation-error\`. All-caps snake case is instantly recognizable as a machine-readable constant, unambiguous across programming languages, and easy to switch on.\\n\\n\`\`\`\\n// Client switch statement reads naturally:\\nswitch (error.code) {\\n  case 'CARD_DECLINED': ...\\n  case 'INSUFFICIENT_FUNDS': ...\\n}\\n\`\`\`"
    },
    {
      "title": "Be Specific, Not Generic",
      "content": "\`CARD_DECLINED\` is better than \`PAYMENT_FAILED\`. \`EMAIL_ALREADY_EXISTS\` is better than \`DUPLICATE_RESOURCE\`. Generic codes force clients to read the message string to understand what happened — which means parsing human-readable text programmatically, a brittle coupling.\\n\\nSpecific codes let clients handle each failure case correctly without string matching."
    },
    {
      "title": "Tell Clients How to Fix It",
      "content": "The \`message\` field should answer: *what went wrong and what should the client do next?*\\n\\n- Bad: \`\\"Invalid input\\"\`\\n- Good: \`\\"API key has expired. Generate a new key at https://dashboard.api.com/keys.\\"\`\\n\\nInclude \`retry_after\` (seconds) on \`429\` and \`503\` so clients know exactly when to retry without guessing."
    },
    {
      "title": "Be Consistent Across Every Endpoint",
      "content": "The error envelope structure must be identical across every endpoint. If one endpoint returns \`{ \\"error\\": { \\"code\\": ... } }\` and another returns \`{ \\"message\\": ... }\`, clients must handle multiple error shapes — fragile and frustrating.\\n\\nEnforce the structure at the framework level (middleware, error handler), not per-endpoint."
    },
    {
      "title": "Document Every Error Code",
      "content": "Include a \`docs_url\` field in the error response linking directly to the error's documentation. That page should explain:\\n- What caused the error\\n- How to resolve it\\n- Whether it's retryable\\n- Example request that triggers it\\n\\nThis is the gold standard: Stripe and Twilio both do this."
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "title": "Error Handling Knowledge Check",
  "questions": [
    {
      "question": "A client submits a request with a valid API key but tries to delete a resource they don't own. Which status code is correct?",
      "options": ["401 Unauthorized", "403 Forbidden", "404 Not Found", "400 Bad Request"],
      "answer": 1,
      "explanation": "403 Forbidden is correct. 401 means the server doesn't know who the client is (authentication failure). 403 means the server knows who the client is, but they lack permission. Returning 404 to hide resource existence is sometimes appropriate for highly sensitive resources, but 403 is the standard answer."
    },
    {
      "question": "A batch email endpoint processes 100 messages. 97 succeed and 3 fail validation. What HTTP status code should the response use?",
      "options": ["200 OK", "422 Unprocessable Entity", "207 Multi-Status", "400 Bad Request"],
      "answer": 2,
      "explanation": "207 Multi-Status is designed exactly for this case — a batch operation with mixed per-item outcomes. The response body should include per-item status codes and a summary. Using 422 would imply the entire batch failed, and using 200 would hide the partial failures."
    },
    {
      "question": "Your server encounters an unhandled exception. What should the error response contain?",
      "options": ["The full stack trace for client debugging", "Only a 500 status code with no body", "An error body with a request_id and generic message", "The exception class name and line number"],
      "answer": 2,
      "explanation": "Return a generic error message plus a request_id that maps to your internal logs. Stack traces expose internal file paths, library versions, and service names — useful for attackers, not clients. The request_id lets your team retrieve the full trace from the logging system without exposing it externally."
    },
    {
      "question": "A client hits your rate limit. Which two fields should your 429 response include beyond the standard error envelope?",
      "options": ["retry_after and quota_reset", "request_id and docs_url", "limit and remaining", "code and details"],
      "answer": 0,
      "explanation": "retry_after (seconds until the client can retry) and quota_reset (timestamp when the quota resets) are the most actionable fields. Without retry_after, clients must implement exponential backoff blindly. The Retry-After HTTP header should also be set — many HTTP clients and proxies read it automatically."
    },
    {
      "question": "An API returns HTTP 200 OK with body { \\"success\\": false, \\"error\\": \\"not found\\" }. What is wrong with this?",
      "options": ["The error code should be SCREAMING_SNAKE_CASE", "HTTP 200 must not be used for error responses — status code carries semantic meaning", "The response is missing a request_id", "Nothing — this is a valid pattern used by many APIs"],
      "answer": 1,
      "explanation": "Returning 200 OK for an error response is a well-known anti-pattern. HTTP infrastructure (monitoring, load balancers, SDK retry logic, circuit breakers) relies on status codes to determine if a request succeeded. A 200 with an error body looks like a success to all of these systems. The correct status code here is 404 Not Found."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Use a consistent error envelope with code (machine-readable), message (human-readable), details (sub-errors), and request_id (for debugging) across every endpoint",
    "Never return 200 OK for error conditions — HTTP status codes are a contract that clients, monitoring tools, and infrastructure all depend on",
    "401 means unauthenticated; 403 means unauthorized — conflating them is a common and costly mistake",
    "Validation errors (422) should report ALL failing fields at once, not just the first one",
    "Never expose stack traces in production; return a request_id instead and log the full trace server-side",
    "Use 207 Multi-Status for batch operations with mixed per-item results, and include a summary field",
    "Always include Retry-After on 429 and 503 responses so clients know exactly when to retry"
  ]
}
\`\`\`

## Interview Checklist

When designing an API endpoint in an interview, always define error responses for every method you describe. At minimum cover:

- **400/422** — validation failure with per-field details
- **401** — missing or invalid credentials
- **403** — authenticated but unauthorized
- **404** — resource not found
- **409** — conflict (duplicate, optimistic lock failure)
- **429** — rate limited with \`retry_after\`
- **500** — unexpected server error with \`request_id\`, no stack trace

Sketching even a brief error envelope alongside your endpoint design immediately signals maturity. Most candidates only describe the happy path — don't be one of them.`,
    },
    {
      id: "hateoas-discoverability",
      slug: "hateoas-discoverability",
      title: "HATEOAS & Discoverability",
      content: `# HATEOAS & Discoverability

HATEOAS (Hypermedia As The Engine Of Application State) is the most frequently overlooked REST constraint — and the one that separates a truly REST-compliant API from an "HTTP-based API." Roy Fielding defined it as a core principle: a client's entire interaction should be driven by hypermedia that the server provides dynamically, not by URLs hardcoded in client code.

\`\`\`concept
{ "title": "HATEOAS as a Navigation System", "variant": "analogy", "content": "Think of HATEOAS like a GPS rather than a printed map. Without HATEOAS, the client needs a pre-printed map of every URL — if the server moves a road, the map is wrong. With HATEOAS, the server sends turn-by-turn directions at every step. The client only needs to know where to start." }
\`\`\`

## The Core Problem: Hardcoded URLs

When clients embed URL patterns in their code, they become tightly coupled to server implementation details. A server-side refactor (\`/orders\` → \`/v2/orders\`) silently breaks every client.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Without HATEOAS — client hardcodes routes", "code": "// Client must know the URL scheme upfront\\nconst cancel = () => fetch('/orders/' + orderId, { method: 'DELETE' });\\nconst pay    = () => fetch('/orders/' + orderId + '/payments', { method: 'POST' });\\n\\n// Problem: if route changes, every client breaks silently" }, "after": { "label": "With HATEOAS — client follows server-provided links", "code": "// Client reads links from the response\\nconst { links } = await fetch('/api/v1/orders/order_123');\\n\\nconst cancelLink = links.find(l => l.rel === 'cancel');\\nif (cancelLink) {\\n  await fetch(cancelLink.href, { method: cancelLink.method });\\n}\\n// Server can change URLs; client adapts automatically" } }
\`\`\`

## State-Dependent Links: The Real Power

The most valuable feature of HATEOAS is that available actions change based on resource state. The server only includes links that are valid for the current state — clients don't need to know which operations are allowed; the response tells them.

\`\`\`tabs
{ "tabs": [ { "label": "pending", "icon": "🕐", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"order_123\\",\\n  \\"status\\": \\"pending\\",\\n  \\"total\\": 99.99,\\n  \\"links\\": [\\n    { \\"rel\\": \\"self\\",   \\"href\\": \\"/api/v1/orders/order_123\\",          \\"method\\": \\"GET\\"    },\\n    { \\"rel\\": \\"cancel\\", \\"href\\": \\"/api/v1/orders/order_123/cancel\\",     \\"method\\": \\"POST\\"   },\\n    { \\"rel\\": \\"pay\\",    \\"href\\": \\"/api/v1/orders/order_123/payments\\",   \\"method\\": \\"POST\\"   },\\n    { \\"rel\\": \\"items\\",  \\"href\\": \\"/api/v1/orders/order_123/items\\",     \\"method\\": \\"GET\\"    }\\n  ]\\n}\\n\`\`\`\\nAll write operations are available — the order hasn't been committed yet." }, { "label": "paid", "icon": "💳", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"order_123\\",\\n  \\"status\\": \\"paid\\",\\n  \\"total\\": 99.99,\\n  \\"links\\": [\\n    { \\"rel\\": \\"self\\",   \\"href\\": \\"/api/v1/orders/order_123\\",          \\"method\\": \\"GET\\"  },\\n    { \\"rel\\": \\"refund\\", \\"href\\": \\"/api/v1/orders/order_123/refund\\",    \\"method\\": \\"POST\\" },\\n    { \\"rel\\": \\"track\\",  \\"href\\": \\"/api/v1/orders/order_123/tracking\\", \\"method\\": \\"GET\\"  },\\n    { \\"rel\\": \\"items\\",  \\"href\\": \\"/api/v1/orders/order_123/items\\",    \\"method\\": \\"GET\\"  }\\n  ]\\n}\\n\`\`\`\\n\`cancel\` and \`pay\` are gone — money has moved. \`refund\` appears instead." }, { "label": "shipped", "icon": "📦", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"order_123\\",\\n  \\"status\\": \\"shipped\\",\\n  \\"total\\": 99.99,\\n  \\"links\\": [\\n    { \\"rel\\": \\"self\\",  \\"href\\": \\"/api/v1/orders/order_123\\",          \\"method\\": \\"GET\\" },\\n    { \\"rel\\": \\"track\\", \\"href\\": \\"/api/v1/orders/order_123/tracking\\", \\"method\\": \\"GET\\" },\\n    { \\"rel\\": \\"items\\", \\"href\\": \\"/api/v1/orders/order_123/items\\",    \\"method\\": \\"GET\\" }\\n  ]\\n}\\n\`\`\`\\nRead-only state: the package is in transit. No mutations allowed." }, { "label": "delivered", "icon": "✅", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"order_123\\",\\n  \\"status\\": \\"delivered\\",\\n  \\"total\\": 99.99,\\n  \\"links\\": [\\n    { \\"rel\\": \\"self\\",   \\"href\\": \\"/api/v1/orders/order_123\\",        \\"method\\": \\"GET\\"  },\\n    { \\"rel\\": \\"return\\", \\"href\\": \\"/api/v1/orders/order_123/return\\", \\"method\\": \\"POST\\" },\\n    { \\"rel\\": \\"review\\", \\"href\\": \\"/api/v1/orders/order_123/review\\", \\"method\\": \\"POST\\" },\\n    { \\"rel\\": \\"items\\",  \\"href\\": \\"/api/v1/orders/order_123/items\\",  \\"method\\": \\"GET\\"  }\\n  ]\\n}\\n\`\`\`\\nPost-delivery actions appear. The state machine drives what the client UI can render." } ] }
\`\`\`

Notice how the server is acting as an authorization layer for UX: if a \`cancel\` link is absent, a React frontend can simply not render the Cancel button. No client-side \`if order.status === 'shipped' then hideCancel()\` logic needed.

## Order Lifecycle State Machine

The links in each response correspond directly to edges in the server's state machine:

\`\`\`mermaid
stateDiagram-v2
    [*] --> pending: order created
    pending --> paid: POST /payments
    pending --> cancelled: POST /cancel
    paid --> shipped: fulfillment system
    paid --> refunded: POST /refund
    shipped --> delivered: carrier webhook
    delivered --> returned: POST /return
\`\`\`

Each state transition maps to a \`rel\` link. Only valid transitions appear in the response — the client never needs to know the state machine topology.

## Pagination Links (Most Common HATEOAS in the Wild)

Even APIs that don't implement full HATEOAS almost always include pagination links. This is the most universally accepted subset:

\`\`\`json
{
  "data": ["..."],
  "meta": {
    "total": 240,
    "per_page": 20,
    "current_page": 3
  },
  "links": {
    "self":  "/api/v1/products?page=3&limit=20",
    "first": "/api/v1/products?page=1&limit=20",
    "prev":  "/api/v1/products?page=2&limit=20",
    "next":  "/api/v1/products?page=4&limit=20",
    "last":  "/api/v1/products?page=12&limit=20"
  }
}
\`\`\`

The \`last\` link is absent when you're on the last page; \`prev\` is absent on page 1. Clients can render pagination controls purely by checking which keys exist — no arithmetic needed.

## Two Ways to Surface Links

\`\`\`tabs
{ "tabs": [ { "label": "Inline JSON Links", "icon": "📋", "content": "Embed links directly in the response body. Most readable, works well with JSON consumers:\\n\\n\`\`\`json\\n{\\n  \\"id\\": \\"order_123\\",\\n  \\"status\\": \\"pending\\",\\n  \\"links\\": [\\n    { \\"rel\\": \\"self\\",   \\"href\\": \\"/api/v1/orders/order_123\\", \\"method\\": \\"GET\\"  },\\n    { \\"rel\\": \\"cancel\\", \\"href\\": \\"/api/v1/orders/order_123/cancel\\", \\"method\\": \\"POST\\" }\\n  ]\\n}\\n\`\`\`\\n\\n**Pros:** Self-contained response, easy to log and debug.\\n\\n**Cons:** Increases payload size; every consumer must parse links array." }, { "label": "HTTP Link Header (RFC 8288)", "icon": "🔗", "content": "Embed links in the response header. Zero impact on body payload:\\n\\n\`\`\`http\\nHTTP/1.1 200 OK\\nContent-Type: application/json\\nLink: </api/v1/products?page=4&limit=20>; rel=\\"next\\",\\n      </api/v1/products?page=2&limit=20>; rel=\\"prev\\",\\n      </api/v1/products?page=1&limit=20>; rel=\\"first\\"\\n\`\`\`\\n\\n**Pros:** Body stays clean; HTTP-native; GitHub API uses this for pagination.\\n\\n**Cons:** Less visible to API consumers; logs may strip headers; slightly harder to parse." } ] }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "GitHub Uses Link Headers", "content": "The GitHub REST API uses RFC 8288 Link headers exclusively for pagination. If you call \`GET /repos/{owner}/{repo}/commits\` and there are more results, the response includes a \`Link\` header with \`rel=\\"next\\"\` and \`rel=\\"last\\"\`. Their SDKs parse these automatically." }
\`\`\`

## API Root Discovery Endpoint

A fully discoverable API exposes an entry point that lists all top-level resources. Clients can start here and navigate without any prior knowledge of the URL structure:

\`\`\`json
GET /api/v1/

{
  "version": "1.0.0",
  "links": {
    "users":    { "href": "/api/v1/users",    "methods": ["GET", "POST"] },
    "products": { "href": "/api/v1/products", "methods": ["GET", "POST"] },
    "orders":   { "href": "/api/v1/orders",   "methods": ["GET", "POST"] },
    "docs":     { "href": "https://docs.api.example.com" },
    "status":   { "href": "https://status.api.example.com" }
  }
}
\`\`\`

This is analogous to a website's homepage — you don't need to know any URL in advance except the root.

## Practical Discoverability: OpenAPI

Full HATEOAS is rare in production. Most APIs achieve discoverability through machine-readable specifications instead:

\`\`\`steps
{ "title": "The OpenAPI Discoverability Pattern", "steps": [ { "title": "Expose the spec endpoint", "content": "Serve your full OpenAPI 3.x document at a predictable URL:\\n\\n\`\`\`http\\nGET /api/v1/openapi.json\\n\`\`\`\\n\\nThis is the machine-readable equivalent of the HATEOAS root endpoint." }, { "title": "Mount Swagger UI", "content": "Serve interactive documentation generated from the spec:\\n\\n\`\`\`http\\nGET /api/v1/docs\\n\`\`\`\\n\\nSwagger UI / Redoc parse the spec and render a clickable, try-it-now interface — human-readable discoverability without HATEOAS overhead." }, { "title": "Register with an API gateway", "content": "Tools like Kong, AWS API Gateway, and Apigee can import your OpenAPI spec and auto-generate client SDKs, mocking, and routing rules. The spec becomes the contract." } ] }
\`\`\`

\`\`\`concept
{ "title": "HATEOAS vs OpenAPI: Two Paths to Discoverability", "variant": "rule", "content": "HATEOAS is runtime discoverability — the response itself tells you what to do next. OpenAPI is build-time discoverability — you read the spec before you write client code. Most production APIs choose OpenAPI because it's tooling-friendly. HATEOAS shines when resource state is complex and changes frequently, like payment flows or multi-step approval workflows." }
\`\`\`

## Trade-offs at a Glance

| | HATEOAS | OpenAPI Spec |
|---|---|---|
| **Discoverability** | Runtime (dynamic) | Build-time (static) |
| **Client coupling** | Very loose | Moderate (schema-bound) |
| **Payload overhead** | Higher (links in every response) | None |
| **Tooling ecosystem** | Limited | Excellent (codegen, mocking, docs) |
| **Adoption** | Rare in practice | Industry standard |
| **Best for** | Complex state machines | Most REST APIs |

\`\`\`collapse
{ "title": "Deep Dive: The \`rel\` Attribute and IANA Link Relations", "content": "The \`rel\` (relation type) value in a link is not arbitrary. IANA maintains a registry of standardized link relation types:\\n\\n- \`self\` — the current resource\\n- \`next\` / \`prev\` / \`first\` / \`last\` — pagination\\n- \`collection\` — the collection this item belongs to\\n- \`item\` — an item within a collection\\n- \`edit\` — a resource that can be edited\\n- \`alternate\` — alternate representation\\n\\nCustom relations should use a URI namespace: \`\\"rel\\": \\"https://api.example.com/rels/cancel\\"\`. This prevents collision with IANA-registered names and makes the semantics globally unambiguous. Spring HATEOAS, HAL (Hypertext Application Language), and JSON:API all build on this convention." }
\`\`\`

\`\`\`quiz
{ "title": "HATEOAS & Discoverability", "questions": [ { "question": "An order API returns a HATEOAS response with no \`cancel\` link. What is the most likely reason?", "options": ["The cancel endpoint was deleted", "The order is in a state where cancellation is not valid", "The client lacks permission to cancel", "HATEOAS links are optional and randomly included"], "answer": 1, "explanation": "HATEOAS links are state-dependent. If \`cancel\` is absent, the order is in a state (e.g., shipped or delivered) where cancellation is no longer a valid transition. The server's state machine determines which links appear." }, { "question": "GitHub's API uses HTTP Link headers for pagination. What is the primary advantage of this approach over inline JSON links?", "options": ["Link headers are required by the REST specification", "The response body stays clean and unchanged in size", "Link headers are easier to parse than JSON", "HTTP headers are cached more aggressively than body content"], "answer": 1, "explanation": "RFC 8288 Link headers keep pagination metadata out of the response body entirely, so the body JSON structure doesn't change. The trade-off is that headers are less visible to consumers and can be stripped by some proxies." }, { "question": "Which statement best describes the relationship between HATEOAS and Roy Fielding's REST definition?", "options": ["HATEOAS is an optional enhancement Fielding added in 2010", "HATEOAS is one of the core constraints Fielding defined; APIs without it are technically not REST", "HATEOAS and REST are independent specifications from different organizations", "Fielding later retracted HATEOAS as impractical for production systems"], "answer": 1, "explanation": "Roy Fielding defined HATEOAS as a core constraint of REST in his 2000 dissertation. Many APIs called 'RESTful' don't implement it, making them HTTP-based APIs rather than REST in the strict sense. Fielding has publicly criticized APIs that omit hypermedia controls while claiming to be REST." }, { "question": "For which use case is HATEOAS most valuable in a production API?", "options": ["A simple CRUD API with predictable URL patterns", "A payment and order workflow where resource states determine valid operations", "A read-only public data API with no authentication", "A GraphQL API replacing a legacy REST endpoint"], "answer": 1, "explanation": "HATEOAS provides the most value when resource state is complex and transitions are conditional — payment flows, order lifecycles, approval workflows. State-dependent links act as both authorization hints and UX drivers, eliminating client-side state machine logic." } ] }
\`\`\`

## The Interview Answer

When an interviewer asks about HATEOAS, mentioning it shows you know the full REST constraint set — most candidates don't. But raw theory isn't enough; demonstrate judgment:

\`\`\`callout
{ "type": "tip", "title": "Calibrated Interview Answer", "content": "\\"I would implement HATEOAS selectively. For pagination, I'd always include links (either inline or via RFC 8288 Link header). For state-dependent resources like orders and payments, I'd include action links that reflect valid transitions — this removes state-machine logic from the client and makes the API self-documenting at runtime.\\n\\nFor full API discoverability, I'd serve an OpenAPI spec at \`/openapi.json\` and mount Swagger UI — that gives us better tooling and codegen support than a HATEOAS root document would. Full HATEOAS with a discovery endpoint is theoretically pure but rarely worth the implementation overhead for most teams.\\"" }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["HATEOAS means server responses include links to valid next actions — clients follow links instead of constructing URLs", "State-dependent links are the real power: absent links mean that action is invalid in the current state, letting UX be driven by the API response", "Pagination links are the most universally adopted form of HATEOAS — always include \`next\`, \`prev\`, \`first\`, \`last\`", "RFC 8288 Link headers are a header-based alternative used by GitHub; inline JSON links are more readable but increase payload size", "In practice, most APIs use OpenAPI specs for discoverability rather than full HATEOAS — know both patterns and when to apply each"] }
\`\`\``,
    },
  ],
};
