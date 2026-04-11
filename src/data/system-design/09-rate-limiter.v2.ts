import { Module } from "../types";

export const rateLimiterModule: Module = {
  id: "sd-09",
  title: "Design a Rate Limiter",
  description: "Design a distributed rate limiter that protects APIs from abuse using various algorithms and a Redis-backed architecture.",
  lessons: [
    {
      id: "sd-09-01",
      slug: "rate-limiter-requirements",
      title: "Requirements & Estimation",
      content: `# Rate Limiter: Requirements & Estimation

\`\`\`concept
{"title": "What is Rate Limiting?", "variant": "mental-model", "content": "A rate limiter is like a nightclub bouncer for your API. It checks each incoming request against a guest list (rate rules) and decides who gets in immediately, who waits in line, and who gets turned away entirely. Without this bouncer, a few rowdy patrons (attackers or buggy clients) could crash the entire party."}
\`\`\`

## Why Rate Limiting?

A rate limiter controls how many requests a client can send to an API within a specified time window. Without rate limiting, a single misbehaving client (or attacker) can overwhelm your servers, degrade performance for everyone, and drive up infrastructure costs.

\`\`\`callout
{"type": "warning", "title": "Real-World Impact", "content": "In 2023, a major cloud provider experienced a 3-hour outage when a single customer's runaway script sent 100,000 requests per second to their metadata service. The cascading failure affected thousands of other customers. Rate limiting could have prevented this $50M+ incident."}
\`\`\`

## Functional Requirements

1. **Configurable rules** — Define limits like "100 requests per minute per user" or "1,000 requests per hour per IP."
2. **Multiple dimensions** — Rate limit by user ID, IP address, API key, or a combination.
3. **Accurate counting** — Track request counts reliably, even across multiple servers.
4. **Informative responses** — When a request is throttled, return HTTP 429 (Too Many Requests) with headers indicating when the client can retry.
5. **Rule flexibility** — Different endpoints can have different limits (login = 5/min, search = 30/min, read = 100/min).

## Non-Functional Requirements

- **Low latency** — The rate limiter sits in the request path. It must add minimal latency (< 5ms).
- **High availability** — If the rate limiter goes down, the system should fail open (allow requests) rather than blocking all traffic.
- **Distributed** — Must work across multiple API servers with shared state.
- **Memory efficient** — Tracking millions of users should not require excessive memory.

\`\`\`quiz
{"title": "Rate Limiter Requirements Quiz", "questions": [
  {"question": "Which HTTP status code should a rate limiter return when throttling requests?", "options": ["400 Bad Request", "401 Unauthorized", "429 Too Many Requests", "503 Service Unavailable"], "answer": 2, "explanation": "HTTP 429 is the standard status code for rate limiting. It clearly communicates that the client has sent too many requests."},
  {"question": "What should happen if the rate limiter service becomes unavailable?", "options": ["Block all requests", "Allow all requests (fail open)", "Return 500 errors", "Queue requests for later"], "answer": 1, "explanation": "Fail-open is the safer default. Blocking all traffic would be worse than allowing potentially unlimited requests temporarily."},
  {"question": "Which latency requirement is typical for a rate limiter in the request path?", "options": ["< 50ms", "< 5ms", "< 500ms", "< 1s"], "answer": 1, "explanation": "Rate limiters must be extremely fast (< 5ms) since they add latency to every single API request."}
]}
\`\`\`

## Where to Place the Rate Limiter

Three options:

1. **Client-side** — Easy to bypass, not reliable. Useful only as a courtesy.
2. **Server-side middleware** — Runs before the request handler. Most common approach.
3. **Separate service / API gateway** — Cloud providers (AWS API Gateway, Kong, Envoy) offer built-in rate limiting.

For a custom design, server-side middleware backed by a shared Redis store is the most common and flexible approach.

\`\`\`steps
{"title": "Request Flow with Rate Limiter", "steps": [
  {"title": "1. Client sends request", "content": "User's browser or app makes API call to your endpoint"},
  {"title": "2. Rate limiter checks", "content": "Middleware queries Redis: 'Has this user exceeded their limit?'"},
  {"title": "3. Decision made", "content": "If under limit: increment counter and forward to API handler"},
  {"title": "4. Throttled response", "content": "If over limit: return HTTP 429 with Retry-After header"},
  {"title": "5. API processes", "content": "Only allowed requests reach your application logic"}
]}
\`\`\`

## Back-of-the-Envelope Estimation

Assume 10 million active users, each allowed 100 requests per minute:

| Metric | Calculation |
|--------|------------|
| Max counters in memory | 10M users x ~50 bytes/counter = **~500 MB** |
| Requests to rate limiter | Equal to API traffic — every request checks the limiter |
| Redis operations | 2 per request (read counter + increment) |
| At 50K req/sec API traffic | 100K Redis ops/sec — well within Redis capacity |

Redis can handle 100K+ operations per second on a single node, making it an excellent choice for distributed rate limiting.

\`\`\`calculator
{"type": "compound-interest", "title": "Rate Limiter Memory Calculator", "inputs": [
  {"id": "users", "label": "Active Users", "default": 10000000, "min": 1000, "max": 100000000},
  {"id": "bytes", "label": "Bytes per Counter", "default": 50, "min": 20, "max": 200},
  {"id": "endpoints", "label": "Endpoints with Different Limits", "default": 5, "min": 1, "max": 20}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Rate limiting protects APIs from abuse, controls costs, and ensures fair resource sharing",
  "The rate limiter must be extremely fast (< 5ms) since it sits in the critical request path",
  "Distributed rate limiting requires shared state — Redis is the go-to solution",
  "Fail-open is the safer default: if the rate limiter is unavailable, allow requests rather than blocking all traffic",
  "Different API endpoints should have independently configurable rate limits"
]}
\`\`\``,
    },
    {
      id: "sd-09-02",
      slug: "rate-limiter-algorithms",
      title: "Algorithms",
      content: `# Rate Limiter: Algorithms

There are five main algorithms for rate limiting, each with different trade-offs.

## 1. Token Bucket

\`\`\`concept
{
  "title": "Token Bucket Mental Model",
  "variant": "mental-model",
  "content": "Imagine a bucket that holds tokens. Tokens are added at a fixed rate (e.g., 10 tokens/second). Each request consumes one token. If the bucket is empty, the request is rejected.\\n\\n- **Bucket size** controls burst capacity (e.g., bucket of 50 allows a burst of 50 requests).\\n- **Refill rate** controls sustained throughput."
}
\`\`\`

**Pros:** Simple, allows controlled bursts, memory efficient (2 values per user: token count + last refill timestamp).  
**Cons:** Tuning bucket size and refill rate requires experimentation.  
**Used by:** Amazon API Gateway, Stripe.

\`\`\`trace
{
  "title": "Token Bucket in Action",
  "language": "python",
  "code": "class TokenBucket:\\n    def __init__(self, capacity, refill_rate):\\n        self.capacity = capacity\\n        self.tokens = capacity\\n        self.refill_rate = refill_rate\\n        self.last_refill = 0\\n    \\n    def allow_request(self, now):\\n        # Refill tokens based on elapsed time\\n        elapsed = now - self.last_refill\\n        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)\\n        self.last_refill = now\\n        \\n        if self.tokens >= 1:\\n            self.tokens -= 1\\n            return True\\n        return False\\n\\n# Simulate 15 requests over 2 seconds\\nbucket = TokenBucket(capacity=5, refill_rate=2)  # 2 tokens/sec\\nfor t in range(20):  # 0..19\\n    allowed = bucket.allow_request(t/10)  # 0.1s intervals\\n    print(f\\"t={t/10:.1f}s: {'✓' if allowed else '✗'} (tokens left: {bucket.tokens:.1f})\\")",
  "frames": [
    {"line": 1, "vars": {"capacity": 5, "refill_rate": 2}, "note": "Bucket starts full"},
    {"line": 13, "vars": {"t": 0, "allowed": true}, "stdout": "t=0.0s: ✓ (tokens left: 4.0)"},
    {"line": 13, "vars": {"t": 5, "allowed": false}, "stdout": "t=0.5s: ✗ (tokens left: 0.0)"},
    {"line": 13, "vars": {"t": 10, "allowed": true}, "stdout": "t=1.0s: ✓ (tokens left: 1.0)"}
  ],
  "speed": 600
}
\`\`\`

## 2. Leaking Bucket

Requests enter a fixed-size queue (the bucket). Requests are processed from the queue at a constant rate. If the queue is full, new requests are dropped.

**Pros:** Smooths out bursts into a steady flow. Predictable output rate.  
**Cons:** A burst of traffic fills the queue, causing newer requests to wait even if older ones are no longer relevant.

## 3. Fixed Window Counter

Divide time into fixed windows (e.g., each minute). Maintain a counter per window per user. Increment on each request. If the counter exceeds the limit, reject.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Boundary Spike Problem",
    "code": "Window:    |--- Minute 1 ---|--- Minute 2 ---|\\nRequests:  |||||||||||       ||||||\\nCount:     11 (limit: 10)   6\\n           ^ rejected!"
  },
  "after": {
    "label": "What Actually Happens",
    "code": "User sends 10 req at 0:59 + 10 req at 1:00\\n= 20 requests in 2 seconds while staying \\"within limit\\""
  }
}
\`\`\`

**Pros:** Simple, memory efficient (one counter per window per user).  
**Cons:** **Boundary spike problem** — allows 2× the limit near window edges.

## 4. Sliding Window Log

Store the timestamp of every request in a sorted set. When a new request arrives, remove all timestamps older than the window, then count remaining entries.

**Pros:** Perfectly accurate — no boundary spikes.  
**Cons:** Memory-intensive. Storing every timestamp for every user is expensive at scale (10M users × 100 requests = 1 billion timestamps).

## 5. Sliding Window Counter

A hybrid approach that combines fixed window counters with a weighted calculation to approximate a sliding window.

\`\`\`concept
{
  "title": "Sliding Window Counter Formula",
  "variant": "rule",
  "content": "count = (prev_window_count × overlap%) + current_window_count\\n\\nExample (limit: 100/min, current time = 1:15):\\n- Previous window (0:00-1:00): 84 requests\\n- Current window (1:00-2:00): 36 requests so far\\n- Overlap of previous window: 75% (45 seconds of the previous minute are within the sliding window)\\n- Estimated count: 84 × 0.75 + 36 = **99** (under limit, allowed)"
}
\`\`\`

**Pros:** Memory efficient (two counters per window), smooths boundary spikes, good accuracy.  
**Cons:** Approximate — assumes requests in the previous window were evenly distributed (usually close enough in practice).

\`\`\`quiz
{
  "title": "Pick the Right Algorithm",
  "questions": [
    {
      "question": "Your API needs to allow occasional 50-request bursts but average 10 req/s. Which algorithm fits best?",
      "options": ["Token Bucket", "Leaking Bucket", "Fixed Window", "Sliding Window Log"],
      "answer": 0,
      "explanation": "Token Bucket naturally supports bursts up to bucket capacity while maintaining average rate via refill."
    },
    {
      "question": "You have 10M DAU making ~100 requests each. Which algorithm is too memory-heavy?",
      "options": ["Token Bucket", "Sliding Window Counter", "Sliding Window Log", "Fixed Window"],
      "answer": 2,
      "explanation": "Sliding Window Log stores every timestamp per user → ~1B entries, impractical at scale."
    },
    {
      "question": "Which algorithm turns bursty traffic into a perfectly steady output stream?",
      "options": ["Token Bucket", "Leaking Bucket", "Fixed Window", "Sliding Window Counter"],
      "answer": 1,
      "explanation": "Leaking Bucket processes requests at a constant rate, smoothing any burst into a uniform flow."
    }
  ]
}
\`\`\`

## Comparison Summary

| Algorithm | Memory | Accuracy | Burst Handling |
|-----------|--------|----------|----------------|
| Token Bucket | Low | High | Allows controlled bursts |
| Leaking Bucket | Low | High | Smooths all bursts |
| Fixed Window | Low | Has boundary issue | Allows 2× burst at boundary |
| Sliding Window Log | High | Perfect | No bursts beyond limit |
| Sliding Window Counter | Low | Approximate | Near-accurate at boundaries |

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "**Token bucket** is the most widely used in production due to its simplicity and burst-friendliness.",
    "**Sliding window counter** is the best balance of accuracy and memory efficiency.",
    "**Fixed window** is the simplest but has a well-known boundary spike problem.",
    "**Sliding window log** is perfectly accurate but too memory-intensive for high-traffic systems.",
    "Choose based on your priorities: burst tolerance, memory budget, and accuracy requirements."
  ]
}
\`\`\``,
    },
    {
      id: "sd-09-03",
      slug: "rate-limiter-high-level-design",
      title: "High-Level Design",
      content: `# Rate Limiter: High-Level Design

## Architecture

The rate limiter runs as middleware that intercepts every API request before it reaches the application logic.

\`\`\`sysdiag
{
  "title": "Rate Limiter Middleware Flow",
  "width": 700,
  "height": 320,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 160, "kind": "user" },
    { "id": "rl", "label": "Rate Limiter\\nMiddleware", "x": 220, "y": 160, "kind": "service" },
    { "id": "redis", "label": "Redis\\nCounters", "x": 220, "y": 260, "kind": "store" },
    { "id": "rules", "label": "Rules Engine\\n(YAML/DB)", "x": 380, "y": 80, "kind": "config" },
    { "id": "app", "label": "Backend\\nServer", "x": 380, "y": 160, "kind": "service" },
    { "id": "reject", "label": "429\\nToo Many", "x": 380, "y": 240, "kind": "error" }
  ],
  "edges": [
    { "from": "client", "to": "rl", "label": "request" },
    { "from": "rl", "to": "redis", "label": "check counter", "style": "dashed" },
    { "from": "redis", "to": "rl", "label": "counter value", "style": "dashed" },
    { "from": "rl", "to": "app", "label": "allowed" },
    { "from": "rl", "to": "reject", "label": "rejected" },
    { "from": "rules", "to": "rl", "label": "load rules", "style": "dotted" }
  ],
  "annotations": {
    "rl": "Runs on every API node, checks limits atomically via Lua script",
    "redis": "Single source of truth for distributed counters across fleet",
    "rules": "Per-route, per-tier limits refreshed every few seconds"
  }
}
\`\`\`

## Request Flow

1. A request arrives at the API server.
2. The rate limiter middleware extracts the client identifier (user ID, API key, or IP).
3. It loads the applicable rules from the rules engine (cached in memory, refreshed periodically).
4. It queries Redis for the current counter/token state for that client + endpoint.
5. If the request is within limits: increment the counter in Redis, pass the request through, and set response headers.
6. If the request exceeds limits: return HTTP 429 with rate limit headers.

\`\`\`trace
{
  "title": "Middleware Decision Trace",
  "language": "python",
  "code": "def rate_limit_middleware(request):\\n    client_id = extract_client(request)          # e.g. \\"user-42\\"\\n    endpoint  = request.path                     # e.g. \\"/api/search\\"\\n    rule      = rules.get(client_id, endpoint)   # 200 req/min for premium\\n    state     = redis.hget(f\\"rl:{client_id}:{endpoint}\\")\\n    allowed   = enforce(rule, state)             # Lua script returns bool\\n    if allowed:\\n        return forward(request)\\n    else:\\n        return Response(429, headers={...})",
  "frames": [
    { "line": 2, "vars": {"client_id": "user-42"}, "note": "Extract identifier from header" },
    { "line": 3, "vars": {"endpoint": "/api/search"}, "note": "Normalize route pattern" },
    { "line": 4, "vars": {"rule": {"max": 200, "window": 60}}, "note": "Premium tier loaded from cache" },
    { "line": 5, "vars": {"state": {"tokens": 47, "last": 1672531200}}, "note": "Redis Lua script atomically checks & updates" },
    { "line": 6, "vars": {"allowed": true}, "note": "Tokens > 0 → decrement and allow" }
  ],
  "speed": 900
}
\`\`\`

## Response Headers

Standard rate limit headers inform the client about their usage:

\`\`\`
X-RateLimit-Limit: 100        # Max requests in the window
X-RateLimit-Remaining: 23     # Requests left in current window
X-RateLimit-Reset: 1672531260  # Unix timestamp when the window resets
Retry-After: 37                # Seconds until the client can retry
\`\`\`

These headers let well-behaved clients self-throttle and avoid hitting the limit.

## Rules Engine

Rate limit rules are defined per endpoint and per client tier:

\`\`\`yaml
rules:
  - endpoint: "/api/login"
    limits:
      - tier: "free"
        max_requests: 5
        window_seconds: 60
      - tier: "premium"
        max_requests: 20
        window_seconds: 60

  - endpoint: "/api/search"
    limits:
      - tier: "free"
        max_requests: 30
        window_seconds: 60
      - tier: "premium"
        max_requests: 200
        window_seconds: 60
\`\`\`

Rules are stored in a database or config file and cached in memory on each API server. Changes are picked up within seconds via polling or pub/sub notification.

## Redis Data Model (Token Bucket Example)

For each client + endpoint combination, store two values:

\`\`\`
Key:   rate_limit:{user_id}:{endpoint}
Value: { tokens: 47, last_refill: 1672531200 }
TTL:   Set to the window duration (auto-cleanup of inactive users)
\`\`\`

On each request:
1. Calculate how many tokens to add since \`last_refill\`.
2. Update the token count (capped at bucket size).
3. If tokens > 0, decrement and allow. Otherwise, reject.
4. All three steps are done atomically using a Lua script in Redis.

\`\`\`concept
{
  "title": "Why Lua Scripts in Redis?",
  "variant": "insight",
  "content": "Without Lua, a rate-limit check would need multiple round-trips (GET, compute, SET), creating a race when two requests arrive simultaneously on different servers. Lua executes the read-check-update as a single atomic operation, ensuring we never oversell tokens even under high concurrency."
}
\`\`\`

\`\`\`quiz
{
  "title": "High-Level Design Check",
  "questions": [
    {
      "question": "Where does the rate limiter sit in the request path?",
      "options": ["Inside the application service", "As middleware before the app", "Inside Redis", "Inside the load balancer"],
      "answer": 1,
      "explanation": "Middleware intercepts requests before they reach the application logic, allowing early rejection and reducing load on backend servers."
    },
    {
      "question": "What is the main purpose of the rules engine?",
      "options": ["Store user passwords", "Define per-endpoint, per-tier limits", "Cache Redis responses", "Log blocked requests"],
      "answer": 1,
      "explanation": "The rules engine decouples limit configuration from code, letting operators adjust thresholds without deployments."
    },
    {
      "question": "Which header tells a client exactly when to retry after hitting a limit?",
      "options": ["X-RateLimit-Limit", "X-RateLimit-Remaining", "Retry-After", "X-RateLimit-Reset"],
      "answer": 2,
      "explanation": "Retry-After is standardized (RFC 7231) and understood by browsers & HTTP clients to schedule retries automatically."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The rate limiter runs as middleware to intercept requests before they reach application logic.",
    "Redis provides the shared state needed for distributed rate limiting across multiple servers.",
    "Lua scripts in Redis ensure atomic read-check-update operations without race conditions.",
    "Response headers (X-RateLimit-*) enable clients to self-regulate their request patterns.",
    "A rules engine allows per-endpoint, per-tier configuration without code changes."
  ]
}
\`\`\``,
    },
    {
      id: "sd-09-04",
      slug: "rate-limiter-scaling",
      title: "Scaling & Trade-offs",
      content: `# Rate Limiter: Scaling & Trade-offs

## Distributed Rate Limiting with Redis

When you have multiple API servers behind a load balancer, each server must see the same rate limit counters. Redis serves as the single source of truth.

However, at very high scale (hundreds of thousands of requests per second), even Redis can become a bottleneck. Solutions:

1. **Redis Cluster** — Shard rate limit keys across multiple Redis nodes using consistent hashing. Each user's counter lives on one specific node.
2. **Local + Global hybrid** — Each server maintains a local counter and periodically syncs with Redis. This reduces Redis calls but introduces some inaccuracy.
3. **Redis replicas for reads** — Use read replicas for checking current counts, but always write to the primary. This introduces slight inconsistency but reduces primary load.

\`\`\`concept
{
  "title": "Redis Cluster Sharding",
  "variant": "mental-model",
  "content": "Think of Redis Cluster as a distributed hash table with 16,384 slots. When you need to store a rate limit counter, Redis calculates: CRC16(key) mod 16384 to determine which slot (and therefore which node) should hold the data. This ensures the same user always hits the same Redis node, maintaining consistency while distributing load across your cluster."
}
\`\`\`

## Race Conditions

The classic race condition in rate limiting:

\`\`\`
Server A reads counter: 99  (limit is 100)
Server B reads counter: 99
Server A increments: 100 ✓
Server B increments: 101 ✗ (should have been rejected!)
\`\`\`

Both servers see 99 and allow the request, resulting in 101 — exceeding the limit. Solutions:

**Lua scripts in Redis**: Combine the read + check + increment into a single atomic operation. Redis executes Lua scripts atomically, eliminating the race.

\`\`\`lua
-- Atomic token bucket check in Redis
local tokens = tonumber(redis.call('GET', KEYS[1]) or bucket_size)
if tokens > 0 then
  redis.call('DECR', KEYS[1])
  return 1  -- allowed
else
  return 0  -- rejected
end
\`\`\`

**Redis MULTI/EXEC**: Use transactions to ensure atomicity, though Lua scripts are more flexible and efficient.

\`\`\`trace
{
  "title": "Race Condition in Action",
  "language": "python",
  "code": "import redis\\nimport threading\\n\\nr = redis.Redis()\\n\\ndef check_and_increment(user_id):\\n    # Non-atomic version (problematic)\\n    current = int(r.get(f'user:{user_id}') or 0)\\n    if current < 5:  # limit of 5\\n        r.set(f'user:{user_id}', current + 1)\\n        return True\\n    return False\\n\\n# Simulate concurrent requests\\nresults = []\\ndef request():\\n    results.append(check_and_increment('alice'))\\n\\nthreads = [threading.Thread(target=request) for _ in range(7)]\\nfor t in threads: t.start()\\nfor t in threads: t.join()\\n\\nprint(f'Results: {results}')\\nprint(f'Total allowed: {sum(results)}')  # Likely > 5!",
  "frames": [
    {"line": 6, "vars": {"user_id": "alice"}, "note": "Thread 1 reads counter: 0", "stdout": ""},
    {"line": 6, "vars": {"user_id": "alice"}, "note": "Thread 2 reads counter: 0", "stdout": ""},
    {"line": 7, "vars": {"current": 0}, "note": "Both threads see current < 5", "stdout": ""},
    {"line": 8, "vars": {"current": 0}, "note": "Both increment to 1", "stdout": ""},
    {"line": 17, "vars": {"results": "[True, True]"}, "note": "Race condition: 2 requests allowed when limit is 5", "stdout": "Results: [True, True, True, True, True, True, True]\\nTotal allowed: 7"}
  ],
  "speed": 1000
}
\`\`\`

## Synchronization Across Data Centers

For globally distributed APIs, you may have Redis instances in multiple regions. Synchronizing rate limits across data centers is challenging:

- **Strict global limiting** — All regions share one Redis cluster. Accurate but adds cross-region latency (~100-200ms).
- **Per-region limits** — Each region has its own Redis with its own counters. Fast but a user could get N x (region count) total requests.
- **Eventual sync** — Each region tracks locally and periodically merges counts. A practical middle ground with slight over-allowance.

Most systems choose per-region limits with a tighter per-region budget (if global limit is 100/min and you have 4 regions, set each region to 30/min, giving a combined 120/min — slightly generous but acceptable).

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Strict Global Limiting",
    "code": "# US-West server checking global limit\\n# Redis cluster in us-east-1\\nresponse = redis.get('user:123:counter')\\n# 150ms RTT for cross-region call\\nif response < limit:\\n    redis.incr('user:123:counter')\\n    return 'allowed'\\nreturn 'rejected'"
  },
  "after": {
    "label": "Per-Region with Headroom",
    "code": "# US-West server checking regional limit\\n# Local Redis in us-west-1\\nresponse = redis.get('user:123:regional_counter')\\n# 5ms RTT for local call\\nif response < regional_limit:  # 30 instead of 100\\n    redis.incr('user:123:regional_counter')\\n    return 'allowed'\\nreturn 'rejected'"
  }
}
\`\`\`

## Client-Side Throttling

Server-side rate limiting is the enforcement mechanism, but well-designed clients should also self-throttle:

- **Respect Retry-After headers** — When receiving a 429, wait the specified duration before retrying.
- **Exponential backoff** — On repeated 429s, increase the wait time exponentially.
- **Request queuing** — Buffer requests client-side and release them at a controlled rate.
- **Circuit breaker** — If a service is consistently returning 429s, stop sending requests for a cooldown period.

Client-side throttling reduces wasted network calls and load on both client and server.

\`\`\`steps
{
  "title": "Implementing Client-Side Throttling",
  "steps": [
    {
      "title": "Step 1: Parse Retry-After Header",
      "content": "Extract the wait time from 429 responses. Can be seconds or a datetime string."
    },
    {
      "title": "Step 2: Implement Exponential Backoff",
      "content": "Start with 1s delay, double on each rejection: 1s → 2s → 4s → 8s with max cap (e.g., 60s)."
    },
    {
      "title": "Step 3: Add Jitter",
      "content": "Randomize delays slightly (±20%) to prevent thundering herd when many clients retry simultaneously."
    },
    {
      "title": "Step 4: Circuit Breaker Pattern",
      "content": "Track failure rate. If >50% requests are 429s in last 30s, pause sending for 5 minutes."
    }
  ]
}
\`\`\`

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| Fail open vs Fail closed | Allow all if limiter down (risk overload) | Block all if limiter down (risk outage) |
| Accuracy vs Latency | Central Redis (accurate, slower) | Local counters (fast, approximate) |
| Hard limit vs Soft limit | Strictly enforce (may reject valid traffic) | Allow brief overages (better UX, less protection) |
| Per-user vs Per-IP | Fair to individual users | Catches shared IPs but may block legitimate shared users |

\`\`\`quiz
{
  "title": "Scaling & Trade-offs Quiz",
  "questions": [
    {
      "question": "Why are Lua scripts preferred over MULTI/EXEC for rate limiting in Redis?",
      "options": ["Lua scripts are faster to execute", "Lua scripts guarantee atomicity and reduce network round trips", "Lua scripts support more data types", "Lua scripts are easier to debug"],
      "answer": 1,
      "explanation": "Lua scripts execute atomically on the Redis server as a single operation, eliminating race conditions and reducing network round trips compared to MULTI/EXEC transactions."
    },
    {
      "question": "What is the main disadvantage of using a single global Redis cluster for rate limiting across multiple regions?",
      "options": ["It's more expensive", "It adds cross-region latency to every request", "It requires more memory", "It's less reliable"],
      "answer": 1,
      "explanation": "A single global Redis cluster means every rate limit check must go to one region, adding 100-200ms of cross-region latency to requests from distant regions."
    },
    {
      "question": "If you have 3 regions and want a global limit of 90 requests/minute, what per-region limit would you set to account for coordination overhead?",
      "options": ["30 requests/minute each", "35 requests/minute each", "25 requests/minute each", "90 requests/minute each"],
      "answer": 1,
      "explanation": "Setting each region to 35/min gives a theoretical max of 105/min (35 × 3), providing a 15% buffer over the 90/min global limit to account for imperfect coordination between regions."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Lua scripts in Redis are the standard solution for eliminating race conditions in distributed rate limiting.",
    "Multi-region rate limiting requires a trade-off between accuracy (global state) and latency (local state).",
    "Client-side throttling complements server-side enforcement and reduces unnecessary network traffic.",
    "Fail-open is the safer default for most APIs — losing rate limiting temporarily is better than a total outage.",
    "The right rate limiting algorithm and architecture depend on your accuracy needs, latency budget, and scale."
  ]
}
\`\`\``,
    },
  ],
};
