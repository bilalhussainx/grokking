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

## Why Rate Limiting?

A rate limiter controls how many requests a client can send to an API within a specified time window. Without rate limiting, a single misbehaving client (or attacker) can overwhelm your servers, degrade performance for everyone, and drive up infrastructure costs.

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

## Where to Place the Rate Limiter

Three options:

1. **Client-side** — Easy to bypass, not reliable. Useful only as a courtesy.
2. **Server-side middleware** — Runs before the request handler. Most common approach.
3. **Separate service / API gateway** — Cloud providers (AWS API Gateway, Kong, Envoy) offer built-in rate limiting.

For a custom design, server-side middleware backed by a shared Redis store is the most common and flexible approach.

## Back-of-the-Envelope Estimation

Assume 10 million active users, each allowed 100 requests per minute:

| Metric | Calculation |
|--------|------------|
| Max counters in memory | 10M users x ~50 bytes/counter = **~500 MB** |
| Requests to rate limiter | Equal to API traffic — every request checks the limiter |
| Redis operations | 2 per request (read counter + increment) |
| At 50K req/sec API traffic | 100K Redis ops/sec — well within Redis capacity |

Redis can handle 100K+ operations per second on a single node, making it an excellent choice for distributed rate limiting.

## Key Takeaways

- Rate limiting protects APIs from abuse, controls costs, and ensures fair resource sharing.
- The rate limiter must be extremely fast (< 5ms) since it sits in the critical request path.
- Distributed rate limiting requires shared state — Redis is the go-to solution.
- Fail-open is the safer default: if the rate limiter is unavailable, allow requests rather than blocking all traffic.
- Different API endpoints should have independently configurable rate limits.
`,
    },
    {
      id: "sd-09-02",
      slug: "rate-limiter-algorithms",
      title: "Algorithms",
      content: `# Rate Limiter: Algorithms

There are five main algorithms for rate limiting, each with different trade-offs.

## 1. Token Bucket

Imagine a bucket that holds tokens. Tokens are added at a fixed rate (e.g., 10 tokens/second). Each request consumes one token. If the bucket is empty, the request is rejected.

\`\`\`mermaid
graph TD
    A[Request Arrives] --> B{Tokens > 0?}
    B -->|Yes| C[Consume 1 Token]
    C --> D[Allow Request - 200 OK]
    B -->|No| E[Reject Request - 429]
    F[Token Refill Timer] -->|Add tokens at fixed rate| G[Token Bucket]
    G --> B
\`\`\`

- **Bucket size** controls burst capacity (e.g., bucket of 50 allows a burst of 50 requests).
- **Refill rate** controls sustained throughput.

**Pros:** Simple, allows controlled bursts, memory efficient (2 values per user: token count + last refill timestamp).
**Cons:** Tuning bucket size and refill rate requires experimentation.

**Used by:** Amazon API Gateway, Stripe.

## 2. Leaking Bucket

Requests enter a fixed-size queue (the bucket). Requests are processed from the queue at a constant rate. If the queue is full, new requests are dropped.

**Pros:** Smooths out bursts into a steady flow. Predictable output rate.
**Cons:** A burst of traffic fills the queue, causing newer requests to wait even if older ones are no longer relevant.

## 3. Fixed Window Counter

Divide time into fixed windows (e.g., each minute). Maintain a counter per window per user. Increment on each request. If the counter exceeds the limit, reject.

\`\`\`
Window:    |--- Minute 1 ---|--- Minute 2 ---|
Requests:  |||||||||||       ||||||
Count:     11 (limit: 10)   6
           ^ rejected!
\`\`\`

**Pros:** Simple, memory efficient (one counter per window per user).
**Cons:** **Boundary spike problem.** If a user sends 10 requests at 0:59 and 10 more at 1:00, they send 20 requests in 2 seconds while technically staying within the per-minute limit.

## 4. Sliding Window Log

Store the timestamp of every request in a sorted set. When a new request arrives, remove all timestamps older than the window, then count remaining entries.

**Pros:** Perfectly accurate — no boundary spikes.
**Cons:** Memory-intensive. Storing every timestamp for every user is expensive at scale (10M users x 100 requests = 1 billion timestamps).

## 5. Sliding Window Counter

A hybrid approach that combines fixed window counters with a weighted calculation to approximate a sliding window.

Formula: \`count = (prev_window_count x overlap%) + current_window_count\`

Example (limit: 100/min, current time = 1:15):
- Previous window (0:00-1:00): 84 requests
- Current window (1:00-2:00): 36 requests so far
- Overlap of previous window: 75% (45 seconds of the previous minute are within the sliding window)
- Estimated count: 84 x 0.75 + 36 = **99** (under limit, allowed)

**Pros:** Memory efficient (two counters per window), smooths boundary spikes, good accuracy.
**Cons:** Approximate — assumes requests in the previous window were evenly distributed (usually close enough in practice).

## Comparison Summary

| Algorithm | Memory | Accuracy | Burst Handling |
|-----------|--------|----------|----------------|
| Token Bucket | Low | High | Allows controlled bursts |
| Leaking Bucket | Low | High | Smooths all bursts |
| Fixed Window | Low | Has boundary issue | Allows 2x burst at boundary |
| Sliding Window Log | High | Perfect | No bursts beyond limit |
| Sliding Window Counter | Low | Approximate | Near-accurate at boundaries |

## Key Takeaways

- **Token bucket** is the most widely used in production due to its simplicity and burst-friendliness.
- **Sliding window counter** is the best balance of accuracy and memory efficiency.
- **Fixed window** is the simplest but has a well-known boundary spike problem.
- **Sliding window log** is perfectly accurate but too memory-intensive for high-traffic systems.
- Choose based on your priorities: burst tolerance, memory budget, and accuracy requirements.
`,
    },
    {
      id: "sd-09-03",
      slug: "rate-limiter-high-level-design",
      title: "High-Level Design",
      content: `# Rate Limiter: High-Level Design

## Architecture

The rate limiter runs as middleware that intercepts every API request before it reaches the application logic.

\`\`\`mermaid
graph LR
    Client[Client] --> RL[Rate Limiter Middleware]
    RL -->|Check Counter| Redis[(Redis)]
    Redis -->|Under Limit| RL
    RL -->|Allowed| App[Backend Server]
    RL -->|Over Limit| Reject[429 Too Many Requests]
    Rules[Rules Engine] -.->|Config| RL
\`\`\`

\`\`\`
                    ┌─────────────────────────────┐
                    │        Rules Engine          │
                    │  (YAML/DB config per route)  │
                    └─────────────┬───────────────┘
                                  │ loads rules
                                  v
┌────────┐    ┌──────────────────────────────┐    ┌──────────────┐
│ Client │───>│   Rate Limiter Middleware     │───>│  Application │
│        │<───│   (check → allow/reject)     │<───│   Server     │
└────────┘    └──────────────┬───────────────┘    └──────────────┘
                             │
                        read/write
                             │
                             v
                    ┌─────────────────┐
                    │     Redis       │
                    │  (counters /    │
                    │   token state)  │
                    └─────────────────┘
\`\`\`

## Request Flow

1. A request arrives at the API server.
2. The rate limiter middleware extracts the client identifier (user ID, API key, or IP).
3. It loads the applicable rules from the rules engine (cached in memory, refreshed periodically).
4. It queries Redis for the current counter/token state for that client + endpoint.
5. If the request is within limits: increment the counter in Redis, pass the request through, and set response headers.
6. If the request exceeds limits: return HTTP 429 with rate limit headers.

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

## Key Takeaways

- The rate limiter runs as middleware to intercept requests before they reach application logic.
- Redis provides the shared state needed for distributed rate limiting across multiple servers.
- Lua scripts in Redis ensure atomic read-check-update operations without race conditions.
- Response headers (X-RateLimit-*) enable clients to self-regulate their request patterns.
- A rules engine allows per-endpoint, per-tier configuration without code changes.
`,
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

## Synchronization Across Data Centers

For globally distributed APIs, you may have Redis instances in multiple regions. Synchronizing rate limits across data centers is challenging:

- **Strict global limiting** — All regions share one Redis cluster. Accurate but adds cross-region latency (~100-200ms).
- **Per-region limits** — Each region has its own Redis with its own counters. Fast but a user could get N x (region count) total requests.
- **Eventual sync** — Each region tracks locally and periodically merges counts. A practical middle ground with slight over-allowance.

Most systems choose per-region limits with a tighter per-region budget (if global limit is 100/min and you have 4 regions, set each region to 30/min, giving a combined 120/min — slightly generous but acceptable).

## Client-Side Throttling

Server-side rate limiting is the enforcement mechanism, but well-designed clients should also self-throttle:

- **Respect Retry-After headers** — When receiving a 429, wait the specified duration before retrying.
- **Exponential backoff** — On repeated 429s, increase the wait time exponentially.
- **Request queuing** — Buffer requests client-side and release them at a controlled rate.
- **Circuit breaker** — If a service is consistently returning 429s, stop sending requests for a cooldown period.

Client-side throttling reduces wasted network calls and load on both client and server.

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| Fail open vs Fail closed | Allow all if limiter down (risk overload) | Block all if limiter down (risk outage) |
| Accuracy vs Latency | Central Redis (accurate, slower) | Local counters (fast, approximate) |
| Hard limit vs Soft limit | Strictly enforce (may reject valid traffic) | Allow brief overages (better UX, less protection) |
| Per-user vs Per-IP | Fair to individual users | Catches shared IPs but may block legitimate shared users |

## Key Takeaways

- Lua scripts in Redis are the standard solution for eliminating race conditions in distributed rate limiting.
- Multi-region rate limiting requires a trade-off between accuracy (global state) and latency (local state).
- Client-side throttling complements server-side enforcement and reduces unnecessary network traffic.
- Fail-open is the safer default for most APIs — losing rate limiting temporarily is better than a total outage.
- The right rate limiting algorithm and architecture depend on your accuracy needs, latency budget, and scale.
`,
    },
  ],
};
