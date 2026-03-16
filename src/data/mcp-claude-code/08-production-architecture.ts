import { Module } from "../types";

export const productionArchitectureModule: Module = {
  id: "production-architecture",
  title: "Production Architecture & Resilience",
  description:
    "Six deep lessons on building production-grade Node.js systems — circuit breakers, rate limiting, health endpoints, PM2 process management, Nginx reverse proxying, and full system design. Each lesson ends with a clear interview answer strategy.",
  lessons: [
    {
      id: "production-architecture-1",
      slug: "circuit-breaker-pattern",
      title: "Circuit Breaker Pattern",
      content: `# Circuit Breaker Pattern

## Why Circuit Breakers Exist

When an external dependency (Slack API, Microsoft Graph, a CRM) starts failing, naive retry logic makes things worse. You hammer the already-struggling service with retries, exhaust your own connection pool, and your entire app hangs waiting for timeouts. The circuit breaker solves this by detecting failures and stopping calls to a broken dependency — giving it time to recover while your system stays responsive.

## The Three States

Think of it exactly like an electrical circuit breaker on your wall.

**Closed (normal operation)**
Requests flow through to the external service. The breaker counts failures in a rolling window. Every success resets the failure count toward zero.

**Open (dependency is down)**
All requests fail immediately without touching the external service. No connection attempts, no timeouts. Callers get a fast failure they can handle gracefully. After a configured timeout period, the breaker transitions to Half-Open to test recovery.

**Half-Open (testing recovery)**
A limited number of probe requests are allowed through. If they succeed, the breaker closes (normal operation resumes). If any probe fails, the breaker opens again and resets the timeout.

## Specific Thresholds — Use These Numbers in Interviews

| Transition | Threshold |
|---|---|
| Closed → Open | 5 failures within a 60-second rolling window |
| Open → Half-Open | 30-second timeout (configurable per service) |
| Half-Open → Closed | 3 consecutive successful probe requests |
| Half-Open → Open | 1 failure during probe phase |

These aren't arbitrary. Five failures in 60 seconds is enough to distinguish a blip from an outage. Thirty seconds gives most APIs time to recover from a restart. Three consecutive successes confirms recovery, not just a fluke.

## The opossum Library

Node.js's go-to circuit breaker library is **opossum**. It wraps any async function.

\`\`\`javascript
const CircuitBreaker = require('opossum');

const options = {
  timeout: 5000,           // If fn takes longer than 5s, trigger failure
  errorThresholdPercentage: 50,  // Open when 50% of requests fail
  resetTimeout: 30000,     // After 30s in Open, try Half-Open
  volumeThreshold: 5,      // Don't open until at least 5 requests have been made
  rollingCountTimeout: 60000,    // Rolling window: 60 seconds
};

const breaker = new CircuitBreaker(callSlackAPI, options);
\`\`\`

Note: opossum uses error percentage rather than a raw count. In practice, set \`volumeThreshold: 5\` and \`errorThresholdPercentage: 50\` — this means "open after 5+ requests with 50%+ failure rate," which maps closely to the "5 failures in 60 seconds" mental model.

## Circuit Breaker vs Retry — They Are Complementary

| Pattern | What It Does |
|---|---|
| Retry | Retries a failed request, useful for transient network glitches |
| Circuit Breaker | Stops retrying entirely when a dependency is down |

Use both together: wrap the retry logic inside the circuit breaker. The breaker prevents the retry loop from hammering a dead service.

\`\`\`javascript
// Retry is the action; breaker wraps the action
const breaker = new CircuitBreaker(
  async (payload) => retry(() => callSlack(payload), { retries: 2 }),
  { resetTimeout: 30000 }
);
\`\`\`

## When to Hard-Fail vs Circuit-Break

**Hard-fail (no circuit breaker):**
- Internal validation errors (bad data from your own system)
- Auth failures — a 401 means your token is wrong, not that the service is down
- Critical writes where silently skipping would corrupt state

**Circuit-break:**
- External HTTP calls (Slack, Graph, GHL, any third-party API)
- Database connections (though connection pools handle some of this)
- Any call with unpredictable latency under load

## Per-Service Breakers

Critical rule: **one circuit breaker per external service**. Never share a breaker across services.

\`\`\`javascript
const breakers = {
  slack: new CircuitBreaker(callSlack, { resetTimeout: 30000 }),
  graph: new CircuitBreaker(callGraph, { resetTimeout: 60000 }),
  ghl:   new CircuitBreaker(callGHL,   { resetTimeout: 45000 }),
};
\`\`\`

Graph gets a longer timeout because Microsoft's infrastructure tends to have longer recovery windows than Slack. GHL is somewhere in between. Tune based on each API's behavior in your runbook.

## Monitoring — Expose Breaker State on /health

Every circuit breaker should be observable. Expose state on your health endpoint:

\`\`\`json
{
  "status": "degraded",
  "checks": {
    "slack_breaker":  { "state": "open",   "failures": 7, "lastFailure": "2026-03-12T10:15:00Z" },
    "graph_breaker":  { "state": "closed", "failures": 0 },
    "ghl_breaker":    { "state": "closed", "failures": 1 }
  }
}
\`\`\`

Set up an alert: if any breaker enters Open state, page the on-call engineer. A breaker opening is a signal, not just a log line.

## Fallback Behavior

When the breaker is Open, what should your system do?

- **Queue for later**: push to a retry queue with exponential backoff
- **Degrade gracefully**: skip the Slack notification but complete the CRM write
- **Return cached data**: if it's a read operation
- **Surface an error upstream**: let the human approval UI show "Slack unavailable"

Define the fallback when you configure the breaker:

\`\`\`javascript
breaker.fallback((payload) => {
  return retryQueue.add('slack-message', payload, { delay: 60000 });
});
\`\`\`

## Interview Answer Strategy

Draw the state machine on the whiteboard: Closed → Open → Half-Open, with arrows showing the transitions. Give the specific numbers: 5 failures, 60-second window, 30-second reset, 3 successes to close. Mention opossum by name. Explain that circuit breakers and retries are complementary. Finish with: "I expose breaker state on the health endpoint and alert when any breaker opens."
`,
      starterCode: `const CircuitBreaker = require('opossum');
const axios = require('axios');

// TODO: Define circuit breaker options for Slack
// - timeout: 5 seconds
// - errorThresholdPercentage: 50
// - resetTimeout: 30 seconds
// - volumeThreshold: 5
// - rollingCountTimeout: 60 seconds
const slackOptions = {
  // TODO: fill in options
};

// TODO: Define the underlying Slack function to wrap
async function callSlackAPI(payload) {
  // TODO: POST to Slack webhook
}

// TODO: Create the circuit breaker wrapping callSlackAPI
// TODO: Add a fallback that queues the message for retry
// TODO: Add event listeners: 'open', 'close', 'halfOpen', 'fallback'

// TODO: Create per-service breakers for Graph and GHL with different resetTimeout values

// TODO: Export a function that exposes all breaker states for the /health endpoint
function getBreakerHealth() {
  // TODO: return { slack: { state, stats }, graph: {...}, ghl: {...} }
}

module.exports = { getBreakerHealth };
`,
      solutionCode: `const CircuitBreaker = require('opossum');
const axios = require('axios');
const logger = require('./logger'); // structured JSON logger

// ── Underlying API calls ─────────────────────────────────────────────────────

async function callSlackAPI(payload) {
  const res = await axios.post(process.env.SLACK_WEBHOOK_URL, payload, {
    timeout: 4000,
  });
  if (res.status !== 200) throw new Error(\`Slack returned \${res.status}\`);
  return res.data;
}

async function callGraphAPI(endpoint, body) {
  const res = await axios.post(
    \`https://graph.microsoft.com/v1.0/\${endpoint}\`,
    body,
    {
      headers: { Authorization: \`Bearer \${process.env.GRAPH_TOKEN}\` },
      timeout: 8000,
    }
  );
  return res.data;
}

async function callGHLAPI(endpoint, body) {
  const res = await axios.post(
    \`https://rest.gohighlevel.com/v1/\${endpoint}\`,
    body,
    {
      headers: { Authorization: \`Bearer \${process.env.GHL_API_KEY}\` },
      timeout: 6000,
    }
  );
  return res.data;
}

// ── Shared breaker factory ───────────────────────────────────────────────────

function makeBreaker(fn, name, resetTimeout = 30000) {
  const breaker = new CircuitBreaker(fn, {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout,
    volumeThreshold: 5,
    rollingCountTimeout: 60000,
    name,
  });

  breaker.on('open',     () => logger.error({ event: 'circuit_open',     service: name }));
  breaker.on('close',    () => logger.info({  event: 'circuit_closed',   service: name }));
  breaker.on('halfOpen', () => logger.info({  event: 'circuit_half_open',service: name }));
  breaker.on('fallback', (result) =>
    logger.warn({ event: 'circuit_fallback', service: name, result })
  );

  return breaker;
}

// ── Per-service breakers (separate — never share) ────────────────────────────

const breakers = {
  slack: makeBreaker(callSlackAPI, 'slack', 30000),
  graph: makeBreaker(callGraphAPI, 'graph', 60000), // Graph recovers slower
  ghl:   makeBreaker(callGHLAPI,   'ghl',   45000),
};

// ── Fallbacks: queue for retry rather than silent drop ───────────────────────

const { retryQueue } = require('./queues');

breakers.slack.fallback(async (payload) => {
  await retryQueue.add('slack-retry', payload, { delay: 60_000, attempts: 3 });
  return { queued: true };
});

breakers.graph.fallback(async (endpoint, body) => {
  await retryQueue.add('graph-retry', { endpoint, body }, { delay: 90_000, attempts: 3 });
  return { queued: true };
});

breakers.ghl.fallback(async (endpoint, body) => {
  await retryQueue.add('ghl-retry', { endpoint, body }, { delay: 60_000, attempts: 3 });
  return { queued: true };
});

// ── Health reporting ─────────────────────────────────────────────────────────

function getBreakerHealth() {
  const report = {};
  for (const [name, breaker] of Object.entries(breakers)) {
    const stats = breaker.stats;
    report[name] = {
      state:       breaker.opened ? 'open' : breaker.halfOpen ? 'half-open' : 'closed',
      failures:    stats.failures,
      successes:   stats.successes,
      fallbacks:   stats.fallbacks,
      rejects:     stats.rejects,
      latencyMean: stats.latencyMean,
    };
  }
  return report;
}

// ── Public interface ─────────────────────────────────────────────────────────

module.exports = {
  slack: (payload)          => breakers.slack.fire(payload),
  graph: (endpoint, body)   => breakers.graph.fire(endpoint, body),
  ghl:   (endpoint, body)   => breakers.ghl.fire(endpoint, body),
  getBreakerHealth,
};
`,
    },
    {
      id: "production-architecture-2",
      slug: "rate-limiting-token-bucket",
      title: "Rate Limiting — Token Bucket & Sliding Window",
      content: `# Rate Limiting — Token Bucket & Sliding Window

## Why You Need Rate Limiting

External APIs enforce limits. Slack allows one message per second per channel on the Tier 3 plan. Microsoft Graph allows 10,000 requests per 10-minute window per tenant. GoHighLevel limits vary by endpoint but typically sit around 100 requests per 10 seconds. Exceed these limits and you get 429 responses, temporary bans, or permanent API key revocation.

You need rate limiting in two places:
1. **Outbound from your system** — control how fast you call external APIs
2. **Inbound to your system** — protect your webhook endpoints from abuse

## Algorithm Comparison

### Token Bucket

The most practical algorithm for outbound API rate limiting. A bucket holds tokens. Requests consume tokens. Tokens refill at a fixed rate. Burst traffic is allowed up to bucket capacity.

**Configuration:**
- Bucket size: 100 tokens (maximum burst)
- Refill rate: 10 tokens/second
- Cost per request: 1 token

If you send 100 requests at once, they all succeed (burn the full bucket). Then you must wait 10 seconds to accumulate enough tokens for the next 100. This matches real API behavior: most APIs allow short bursts but throttle sustained high volume.

### Sliding Window Log

For every request, record the timestamp. To check if a new request is allowed, count timestamps in the past window duration (e.g., last 60 seconds). If count < limit, allow and append. If count >= limit, reject.

**Pros:** Perfectly precise
**Cons:** Memory-heavy — you store every request timestamp. For high-volume endpoints this is impractical.

### Sliding Window Counter

Divide time into fixed windows (e.g., 1-minute buckets). Track two buckets: current and previous. Estimate the request count in the sliding window as:

\`\`\`
estimate = (previous_count × overlap_ratio) + current_count
\`\`\`

**Pros:** Constant memory (O(1) per rate limit key), very efficient
**Cons:** Approximate — can over or under-count by up to ~10%

## Redis Token Bucket — Lua Script

Redis is the right backend for distributed rate limiting. A Lua script executes atomically — no race conditions.

\`\`\`lua
-- Keys: KEYS[1] = bucket key (e.g., "rl:slack:channel-id")
-- Args: ARGV[1] = bucket_capacity, ARGV[2] = refill_rate (tokens/sec),
--       ARGV[3] = cost (tokens per request), ARGV[4] = now (unix timestamp seconds)

local key      = KEYS[1]
local capacity = tonumber(ARGV[1])
local rate     = tonumber(ARGV[2])
local cost     = tonumber(ARGV[3])
local now      = tonumber(ARGV[4])

local bucket   = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens   = tonumber(bucket[1]) or capacity
local last     = tonumber(bucket[2]) or now

-- Refill tokens based on elapsed time
local elapsed  = math.max(0, now - last)
local refilled = math.min(capacity, tokens + (elapsed * rate))

-- Check if request can be served
if refilled < cost then
  -- Not enough tokens: return -1 (caller should wait)
  redis.call('HMSET', key, 'tokens', refilled, 'last_refill', now)
  redis.call('EXPIRE', key, 3600)
  return -1
end

-- Deduct tokens
local remaining = refilled - cost
redis.call('HMSET', key, 'tokens', remaining, 'last_refill', now)
redis.call('EXPIRE', key, 3600)
return remaining
\`\`\`

The script returns the number of remaining tokens, or -1 if the request was rejected. The caller reads the return value and either proceeds or waits.

## API-Specific Rate Limits

| Service | Limit | Strategy |
|---|---|---|
| Slack (Tier 3) | 1 msg/sec per channel | Token bucket: capacity=1, rate=1/sec |
| Microsoft Graph | 10,000 req / 10 min | Token bucket: capacity=200, rate=16.7/sec |
| GoHighLevel contacts | 100 req / 10 sec | Token bucket: capacity=100, rate=10/sec |

## Handling 429 Responses

When you get a 429, read the \`Retry-After\` header. It tells you how many seconds to wait.

\`\`\`javascript
async function callWithRateLimit(fn, limiterKey) {
  const allowed = await tokenBucket.consume(limiterKey);
  if (!allowed) {
    // Proactive throttle: we're at our own limit
    const waitMs = await tokenBucket.getWaitTime(limiterKey);
    await sleep(waitMs);
    return callWithRateLimit(fn, limiterKey); // retry
  }

  try {
    return await fn();
  } catch (err) {
    if (err.response?.status === 429) {
      const retryAfter = parseInt(err.response.headers['retry-after'] || '5', 10);
      await tokenBucket.drain(limiterKey); // empty the bucket — we hit their real limit
      await sleep(retryAfter * 1000);
      return callWithRateLimit(fn, limiterKey);
    }
    throw err;
  }
}
\`\`\`

The key insight: when you receive a 429, **drain your local bucket** to match reality. Your local rate limiter thought you had capacity; the API disagreed. Drain and reset so future calls are properly throttled.

## Propagating Rate Limits Through the System

Rate limit context must flow from the API call back through the queue worker to the webhook handler. Use queue metadata:

\`\`\`javascript
// Worker detects rate limit pressure and signals the queue
if (tokenBucket.getRemaining('slack') < 5) {
  // Slow down job processing: set a longer delay on next job
  await worker.rateLimit(1000); // wait 1s before processing next job
}
\`\`\`

## Interview Tip

Show the Lua script — interviewers rarely see candidates who know the atomic Redis implementation. Mention the specific API limits (Slack Tier 3 = 1/sec, Graph = 10k/10min). Explain why you drain the bucket on a 429: "the API is the source of truth, not our local counter." Conclude with: "I use the token bucket for outbound calls and the sliding window counter for inbound webhook protection."
`,
      starterCode: `const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

// TODO: Write the Lua script for atomic token bucket check-and-consume
// Keys: KEYS[1] = bucket key
// Args: ARGV[1] = capacity, ARGV[2] = rate (tokens/sec), ARGV[3] = cost, ARGV[4] = now (seconds)
// Returns: remaining tokens, or -1 if rejected
const TOKEN_BUCKET_SCRIPT = \`
  -- TODO: implement token bucket Lua script
  -- 1. Read current tokens and last_refill time from Redis hash
  -- 2. Calculate elapsed seconds since last_refill
  -- 3. Refill tokens (capped at capacity)
  -- 4. If refilled < cost, return -1
  -- 5. Otherwise deduct cost, save, return remaining
\`;

// TODO: Create rate limiter configs for each external service
const RATE_LIMITS = {
  slack: { capacity: 0, rate: 0 },   // 1 msg/sec per channel
  graph: { capacity: 0, rate: 0 },   // 10,000 req / 10 min
  ghl:   { capacity: 0, rate: 0 },   // 100 req / 10 sec
};

// TODO: Implement consume(service, key) — returns true if allowed, false if rejected
async function consume(service, key) {
  // TODO: use evalsha/eval to run the Lua script
  // key format: \`rl:\${service}:\${key}\`
}

// TODO: Implement callWithRateLimit(fn, service, key)
// - Check token bucket first (proactive throttle)
// - If rejected, calculate wait time and delay
// - On 429 response: drain bucket, wait Retry-After header value
async function callWithRateLimit(fn, service, key) {
  // TODO
}

module.exports = { consume, callWithRateLimit };
`,
      solutionCode: `const redis = require('redis');
const logger = require('./logger');

const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect();

// ── Lua script: atomic token bucket ─────────────────────────────────────────

const TOKEN_BUCKET_SCRIPT = \`
local key      = KEYS[1]
local capacity = tonumber(ARGV[1])
local rate     = tonumber(ARGV[2])
local cost     = tonumber(ARGV[3])
local now      = tonumber(ARGV[4])

local bucket   = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens   = tonumber(bucket[1]) or capacity
local last     = tonumber(bucket[2]) or now

local elapsed  = math.max(0, now - last)
local refilled = math.min(capacity, tokens + (elapsed * rate))

if refilled < cost then
  redis.call('HMSET', key, 'tokens', refilled, 'last_refill', now)
  redis.call('EXPIRE', key, 3600)
  return -1
end

local remaining = refilled - cost
redis.call('HMSET', key, 'tokens', remaining, 'last_refill', now)
redis.call('EXPIRE', key, 3600)
return remaining
\`;

// Pre-load script and cache SHA for efficiency
let scriptSha;
async function loadScript() {
  scriptSha = await client.scriptLoad(TOKEN_BUCKET_SCRIPT);
}
loadScript();

// ── Per-service configurations ───────────────────────────────────────────────

const RATE_LIMITS = {
  // Slack Tier 3: 1 message/second per channel
  slack: { capacity: 5,   rate: 1    },  // small burst buffer allowed
  // Microsoft Graph: 10,000 requests / 10 min = 16.67/sec
  graph: { capacity: 200, rate: 16.67 },
  // GoHighLevel: 100 requests / 10 seconds = 10/sec
  ghl:   { capacity: 100, rate: 10   },
};

// ── Core functions ───────────────────────────────────────────────────────────

async function consume(service, key, cost = 1) {
  const config = RATE_LIMITS[service];
  if (!config) throw new Error(\`Unknown service: \${service}\`);

  const redisKey = \`rl:\${service}:\${key}\`;
  const now      = Math.floor(Date.now() / 1000);

  const remaining = await client.evalSha(scriptSha, {
    keys: [redisKey],
    arguments: [
      String(config.capacity),
      String(config.rate),
      String(cost),
      String(now),
    ],
  });

  logger.debug({ event: 'rate_limit_check', service, key, remaining });
  return { allowed: remaining >= 0, remaining: Math.max(0, remaining) };
}

async function getWaitMs(service, key) {
  const config  = RATE_LIMITS[service];
  const { remaining } = await consume(service, key, 0); // peek without consuming
  if (remaining > 0) return 0;
  // Time to refill 1 token at the configured rate
  return Math.ceil(1000 / config.rate);
}

async function drainBucket(service, key) {
  // Drain by consuming the full capacity — aligns local state with API reality
  const config   = RATE_LIMITS[service];
  const redisKey = \`rl:\${service}:\${key}\`;
  await client.hSet(redisKey, { tokens: '0', last_refill: String(Math.floor(Date.now() / 1000)) });
  logger.warn({ event: 'rate_limit_bucket_drained', service, key });
}

// ── callWithRateLimit ────────────────────────────────────────────────────────

async function callWithRateLimit(fn, service, key, retries = 3) {
  if (retries === 0) throw new Error(\`Rate limit max retries exceeded for \${service}:\${key}\`);

  const { allowed } = await consume(service, key);

  if (!allowed) {
    const waitMs = await getWaitMs(service, key);
    logger.info({ event: 'proactive_throttle', service, key, waitMs });
    await sleep(waitMs);
    return callWithRateLimit(fn, service, key, retries - 1);
  }

  try {
    return await fn();
  } catch (err) {
    if (err.response?.status === 429) {
      const retryAfter = parseInt(err.response.headers['retry-after'] || '5', 10);
      logger.warn({ event: 'api_429', service, key, retryAfterSeconds: retryAfter });
      await drainBucket(service, key); // API is the source of truth
      await sleep(retryAfter * 1000);
      return callWithRateLimit(fn, service, key, retries - 1);
    }
    throw err;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { consume, callWithRateLimit, drainBucket, getWaitMs };
`,
    },
    {
      id: "production-architecture-3",
      slug: "health-endpoints-observability",
      title: "Health Endpoints & Observability",
      content: `# Health Endpoints & Observability

## Why Observability Matters

A system you cannot observe is a system you cannot debug. When your MCP agent stops responding at 2am, you need to know within seconds: is Redis down? Is the queue backed up? Is an external API circuit-broken? Good health endpoints and structured logging answer these questions without requiring SSH access to the box.

## Three Health Endpoints

Modern systems expose three distinct health endpoints, each with a different audience:

| Endpoint | Purpose | Audience |
|---|---|---|
| \`/health/live\` | Is the process running? | Container orchestrators (K8s liveness probe) |
| \`/health/ready\` | Can the process serve traffic? | Load balancers, Nginx upstream checks |
| \`/health\` | Full diagnostic report | Engineers, dashboards, alerting systems |

**Liveness** (\`/health/live\`): Always returns 200 unless the Node process is completely dead. Never check external dependencies here — a bad Redis connection shouldn't restart your container.

**Readiness** (\`/health/ready\`): Returns 200 only when the service can handle requests. Checks Redis connectivity and queue system. If Redis is down, return 503 — take the instance out of rotation.

**Full health** (\`/health\`): Returns a complete diagnostic JSON. This is what your monitoring dashboard and alerting system consume.

## Response Format

\`\`\`json
{
  "status": "degraded",
  "uptime": 86400,
  "timestamp": "2026-03-12T10:00:00Z",
  "checks": {
    "redis": {
      "status": "healthy",
      "latencyMs": 2,
      "message": "PONG received in 2ms"
    },
    "queue": {
      "status": "healthy",
      "waiting": 4,
      "active": 2,
      "failed": 0
    },
    "memory": {
      "status": "healthy",
      "heapUsedMb": 142,
      "heapTotalMb": 256,
      "rssMb": 310
    },
    "circuit_breakers": {
      "status": "degraded",
      "slack":  { "state": "open",   "failures": 7 },
      "graph":  { "state": "closed", "failures": 0 },
      "ghl":    { "state": "closed", "failures": 1 }
    }
  }
}
\`\`\`

Overall \`status\` is the worst of all individual checks: if any check is \`degraded\`, the overall status is \`degraded\`. If any check is \`unhealthy\`, the overall status is \`unhealthy\`.

## What to Check

**Redis connection:** Send a PING and measure round-trip latency. If latency exceeds 50ms or PING fails, mark as unhealthy.

**Queue depth:** Query BullMQ for \`waiting\` + \`active\` counts. A growing queue that never drains indicates a stuck worker. Alert if \`waiting > 100\` — something is wrong.

**Circuit breaker states:** Pull from your circuit breaker module. Any Open breaker = degraded status.

**Memory usage:** Use \`process.memoryUsage()\`. Alert if heap used exceeds 80% of total — you're heading toward OOM.

**Uptime:** \`process.uptime()\` in seconds. Very short uptime (< 60s) after a deploy can indicate crash-looping.

## Structured Logging

Never use \`console.log\` in production. Use a structured logger that emits JSON.

\`\`\`javascript
const logger = require('pino')({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: 'mcp-agent',
    version: process.env.npm_package_version,
  },
});
\`\`\`

Every log line should include:
- \`traceId\`: a UUID generated at the webhook entry point, propagated through the entire processing chain. This lets you grep all logs for a single message.
- \`service\`: which service/module is logging
- \`level\`: debug, info, warn, error
- \`timestamp\`: ISO 8601 (pino includes this automatically)

\`\`\`javascript
// At webhook entry:
const traceId = crypto.randomUUID();
req.traceId = traceId;

// In any subsequent call:
logger.info({ traceId, event: 'queue_job_started', jobId });
logger.error({ traceId, event: 'slack_call_failed', error: err.message });
\`\`\`

With structured JSON logs, you can query: \`jq 'select(.traceId == "abc-123")' app.log\` and see the entire lifecycle of one message.

## Prometheus-Style Metrics

Expose metrics at \`/metrics\` in Prometheus text format. These feed into Grafana dashboards.

| Metric | Type | Labels |
|---|---|---|
| \`request_duration_seconds\` | Histogram | \`method\`, \`route\`, \`status\` |
| \`queue_depth\` | Gauge | \`queue_name\` |
| \`circuit_breaker_state\` | Gauge | \`service\` (0=closed, 1=half-open, 2=open) |
| \`error_count_total\` | Counter | \`service\`, \`error_type\` |
| \`rate_limit_consumed_total\` | Counter | \`service\` |

Use the \`prom-client\` library:

\`\`\`javascript
const promClient = require('prom-client');
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const queueDepth = new promClient.Gauge({
  name: 'queue_depth',
  help: 'Number of jobs waiting in BullMQ',
  labelNames: ['queue_name'],
  registers: [register],
});

// Update periodically:
setInterval(async () => {
  const waiting = await messageQueue.getWaitingCount();
  queueDepth.set({ queue_name: 'messages' }, waiting);
}, 5000);
\`\`\`

## PM2 and Nginx Integration

**PM2 health check:** In \`ecosystem.config.js\`, add:
\`\`\`javascript
max_memory_restart: '500M',
exp_backoff_restart_delay: 100,
\`\`\`

PM2 polls \`/health/live\` if you configure \`http_check\` in the app config. On failure, PM2 auto-restarts the instance.

**Nginx upstream health:** Add to your upstream block:
\`\`\`nginx
upstream node_app {
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
  keepalive 64;
}
\`\`\`

## Interview Tip

List the three endpoints with their audiences: \`/live\` for orchestrators, \`/ready\` for load balancers, \`/health\` for engineers. List specific metrics with their Prometheus types (gauge, counter, histogram). Mention traceId propagation — it's the single most valuable debugging tool. Name pino for logging and prom-client for metrics. Say: "A circuit breaker opening should trigger an alert, not just a log line."
`,
      starterCode: `const express  = require('express');
const redis    = require('redis');
const { Queue } = require('bullmq');

const app    = express();
const client = redis.createClient({ url: process.env.REDIS_URL });
const queue  = new Queue('messages', { connection: { url: process.env.REDIS_URL } });

// TODO: Implement GET /health/live
// - Always return 200 with { status: 'alive', uptime: process.uptime() }
// - Do NOT check any external dependencies here
app.get('/health/live', (req, res) => {
  // TODO
});

// TODO: Implement GET /health/ready
// - Check Redis PING latency
// - Check queue system is reachable
// - Return 200 if all critical checks pass, 503 otherwise
app.get('/health/ready', async (req, res) => {
  // TODO
});

// TODO: Implement GET /health
// Returns full diagnostic JSON:
// { status: 'healthy'|'degraded'|'unhealthy', uptime, timestamp, checks: { redis, queue, memory, circuit_breakers } }
// - Redis check: PING and measure latency
// - Queue check: getWaitingCount() + getActiveCount()
// - Memory check: process.memoryUsage() — warn if heap > 80%
// - Circuit breaker check: import from your breaker module
app.get('/health', async (req, res) => {
  // TODO
});

// TODO: Implement GET /metrics in Prometheus text format
// Use prom-client to expose:
// - Default Node.js metrics (collectDefaultMetrics)
// - queue_depth gauge
// - circuit_breaker_state gauge (0=closed, 1=half-open, 2=open)
app.get('/metrics', async (req, res) => {
  // TODO
});

module.exports = app;
`,
      solutionCode: `const express    = require('express');
const redis      = require('redis');
const { Queue }  = require('bullmq');
const promClient = require('prom-client');
const { getBreakerHealth } = require('./circuitBreakers');
const logger     = require('./logger');

const app    = express();
const client = redis.createClient({ url: process.env.REDIS_URL });
const queue  = new Queue('messages', { connection: { url: process.env.REDIS_URL } });

client.connect();

// ── Prometheus setup ─────────────────────────────────────────────────────────

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const queueDepthGauge = new promClient.Gauge({
  name: 'queue_depth', help: 'Jobs waiting in BullMQ',
  labelNames: ['queue_name'], registers: [register],
});

const breakerStateGauge = new promClient.Gauge({
  name: 'circuit_breaker_state',
  help: 'Circuit breaker state: 0=closed 1=half-open 2=open',
  labelNames: ['service'], registers: [register],
});

const requestDuration = new promClient.Histogram({
  name: 'request_duration_seconds', help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// Update gauges every 5 seconds
setInterval(async () => {
  try {
    const waiting = await queue.getWaitingCount();
    const active  = await queue.getActiveCount();
    queueDepthGauge.set({ queue_name: 'messages' }, waiting + active);

    const breakers = getBreakerHealth();
    for (const [name, info] of Object.entries(breakers)) {
      const stateNum = info.state === 'closed' ? 0 : info.state === 'half-open' ? 1 : 2;
      breakerStateGauge.set({ service: name }, stateNum);
    }
  } catch (_) { /* ignore gauge update errors */ }
}, 5000);

// ── Helper checks ────────────────────────────────────────────────────────────

async function checkRedis() {
  const start = Date.now();
  try {
    await client.ping();
    const latencyMs = Date.now() - start;
    return {
      status: latencyMs < 50 ? 'healthy' : 'degraded',
      latencyMs,
      message: \`PONG received in \${latencyMs}ms\`,
    };
  } catch (err) {
    return { status: 'unhealthy', message: err.message };
  }
}

async function checkQueue() {
  try {
    const waiting = await queue.getWaitingCount();
    const active  = await queue.getActiveCount();
    const failed  = await queue.getFailedCount();
    return {
      status: waiting > 100 ? 'degraded' : 'healthy',
      waiting, active, failed,
    };
  } catch (err) {
    return { status: 'unhealthy', message: err.message };
  }
}

function checkMemory() {
  const mem        = process.memoryUsage();
  const heapUsedMb  = Math.round(mem.heapUsed  / 1024 / 1024);
  const heapTotalMb = Math.round(mem.heapTotal / 1024 / 1024);
  const rssMb       = Math.round(mem.rss       / 1024 / 1024);
  const pct         = heapUsedMb / heapTotalMb;
  return {
    status: pct > 0.9 ? 'unhealthy' : pct > 0.8 ? 'degraded' : 'healthy',
    heapUsedMb, heapTotalMb, rssMb,
    usagePercent: Math.round(pct * 100),
  };
}

function checkBreakers() {
  const breakers = getBreakerHealth();
  const anyOpen  = Object.values(breakers).some((b) => b.state === 'open');
  return {
    status: anyOpen ? 'degraded' : 'healthy',
    ...breakers,
  };
}

function worstStatus(...statuses) {
  if (statuses.includes('unhealthy')) return 'unhealthy';
  if (statuses.includes('degraded'))  return 'degraded';
  return 'healthy';
}

// ── Endpoints ────────────────────────────────────────────────────────────────

// Liveness: is the process alive? No external checks.
app.get('/health/live', (req, res) => {
  res.json({ status: 'alive', uptime: Math.floor(process.uptime()) });
});

// Readiness: can we serve traffic?
app.get('/health/ready', async (req, res) => {
  const [redisCheck, queueCheck] = await Promise.all([checkRedis(), checkQueue()]);
  const status = worstStatus(redisCheck.status, queueCheck.status);
  res.status(status === 'unhealthy' ? 503 : 200).json({ status, redis: redisCheck, queue: queueCheck });
});

// Full diagnostic
app.get('/health', async (req, res) => {
  const [redisCheck, queueCheck] = await Promise.all([checkRedis(), checkQueue()]);
  const memCheck     = checkMemory();
  const breakerCheck = checkBreakers();

  const status = worstStatus(
    redisCheck.status, queueCheck.status,
    memCheck.status,   breakerCheck.status
  );

  const body = {
    status,
    uptime:    Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    checks: {
      redis:            redisCheck,
      queue:            queueCheck,
      memory:           memCheck,
      circuit_breakers: breakerCheck,
    },
  };

  logger.debug({ event: 'health_check', status });
  res.status(status === 'unhealthy' ? 503 : 200).json(body);
});

// Prometheus metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Request duration instrumentation
app.use((req, res, next) => {
  const end = requestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => end({ status: res.statusCode }));
  next();
});

module.exports = app;
`,
    },
    {
      id: "production-architecture-4",
      slug: "pm2-process-management",
      title: "PM2 Process Management",
      content: `# PM2 Process Management

## Why PM2

Node.js is single-threaded. On a 4-core server, a single Node process uses 25% of available CPU. PM2 cluster mode spawns one worker per CPU core, sharing the server port via the OS round-robin scheduler. You get near-linear horizontal scaling with zero code changes.

PM2 also handles:
- Automatic restarts on crash
- Memory limit enforcement
- Graceful reloads with zero downtime
- Log management and rotation
- Process monitoring and metrics

## ecosystem.config.js — The Deep Dive

This is the configuration file PM2 reads. Every field matters in production.

\`\`\`javascript
module.exports = {
  apps: [
    {
      name: 'mcp-agent',
      script: 'src/server.js',

      // Cluster mode: one worker per CPU core
      instances: 'max',
      exec_mode: 'cluster',

      // Memory guard: restart if process exceeds 500MB RSS
      max_memory_restart: '500M',

      // Never watch files in production — causes unnecessary restarts
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.log'],

      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        LOG_LEVEL: 'info',
      },

      // Log configuration
      out_file:    './logs/out.log',
      error_file:  './logs/error.log',
      merge_logs:  true,       // combine logs from all cluster workers
      log_date_format: '',     // rely on structured JSON timestamps instead

      // Restart behavior
      restart_delay: 1000,               // wait 1s before restarting after crash
      max_restarts: 10,                  // stop restarting after 10 crashes in a row
      exp_backoff_restart_delay: 100,    // exponential backoff between restarts

      // Graceful shutdown window
      kill_timeout: 10000,    // 10s to finish in-flight requests before SIGKILL
      listen_timeout: 10000,  // 10s to come up before PM2 marks as failed
    },
  ],
};
\`\`\`

### instances: "max" vs a specific number

**\`"max"\`**: PM2 spawns \`os.cpus().length\` workers. On a 4-core machine, that's 4 workers. Best for CPU-bound work.

**Specific number (e.g., \`2\`)**: Use when you want to reserve cores for other processes or when you know your app is I/O-bound and doesn't benefit from full saturation.

**When to use fewer than max:** If your server also runs Redis, Nginx, or other services, leave headroom. A common pattern: \`instances: Math.max(1, os.cpus().length - 1)\`.

### exec_mode: "cluster" vs "fork"

**Cluster**: Workers share the same port via Node.js cluster module. Best for stateless HTTP servers. Load is distributed across workers automatically.

**Fork**: Each process gets its own port. Used for workers/daemons that don't serve HTTP. For your BullMQ worker processes, use \`exec_mode: 'fork'\`.

## Graceful Shutdown

This is the most important correctness concern with PM2. When PM2 sends SIGINT (on \`pm2 reload\` or \`pm2 stop\`), your app must:

1. Stop accepting new HTTP connections
2. Allow in-flight requests to complete
3. Drain active BullMQ jobs (finish what's running, don't start new ones)
4. Close Redis connections cleanly
5. Exit with code 0

\`\`\`javascript
const server = app.listen(PORT);
let isShuttingDown = false;

process.on('SIGINT', async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ event: 'graceful_shutdown_start' });

  // 1. Stop accepting new connections
  server.close(() => {
    logger.info({ event: 'http_server_closed' });
  });

  // 2. Drain BullMQ worker (finish active jobs, don't pick up new ones)
  await worker.close();
  logger.info({ event: 'bullmq_worker_drained' });

  // 3. Close Redis
  await redisClient.quit();
  logger.info({ event: 'redis_closed' });

  // 4. Clean exit — PM2 marks as stopped
  process.exit(0);
});
\`\`\`

The 10-second \`kill_timeout\` in ecosystem.config.js is your safety net. If your shutdown handler takes longer than 10 seconds, PM2 sends SIGKILL and kills the process immediately. This is why draining BullMQ workers must be fast — configure \`worker.close()\` with a short timeout.

## Zero-Downtime Restarts

\`\`\`bash
# pm2 reload — sends SIGINT to workers one at a time, waits for shutdown, starts replacement
pm2 reload mcp-agent

# pm2 restart — kills all workers at once, then restarts (causes brief downtime)
pm2 restart mcp-agent
\`\`\`

Always use \`pm2 reload\` in production deploys. It performs a rolling restart: shuts down one worker, starts a new one with the updated code, then moves to the next. During the roll, traffic continues to flow to surviving workers.

## Log Management

Install pm2-logrotate to prevent logs from filling your disk:

\`\`\`bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7        # keep 7 days
pm2 set pm2-logrotate:compress true   # gzip old logs
\`\`\`

In your app, emit JSON logs (pino). Set \`merge_logs: true\` in ecosystem.config.js so all cluster workers write to the same file. Downstream log shippers (Datadog, Logtail, etc.) parse the JSON lines.

## Multiple Apps — One Ecosystem File

You can manage your HTTP server and BullMQ workers in a single ecosystem file:

\`\`\`javascript
apps: [
  { name: 'mcp-server',  script: 'src/server.js',  instances: 'max', exec_mode: 'cluster' },
  { name: 'mcp-worker',  script: 'src/worker.js',  instances: 2,     exec_mode: 'fork'    },
  { name: 'mcp-cron',    script: 'src/cron.js',    instances: 1,     exec_mode: 'fork'    },
]
\`\`\`

Use \`pm2 reload all\` to roll-restart everything simultaneously.

## Interview Answer Strategy

Show the ecosystem.config.js. Explain \`instances: "max"\` and why cluster mode shares a port. Walk through the graceful shutdown sequence in order: close HTTP → drain worker → close Redis → exit 0. Explain the difference between \`pm2 reload\` (rolling, zero-downtime) and \`pm2 restart\` (hard restart with downtime). Mention \`max_memory_restart\` as a safety net against memory leaks. Conclude: "This gives us horizontal scaling within a single box with no code changes and zero-downtime deploys."
`,
      starterCode: `// ecosystem.config.js — PM2 configuration skeleton
// TODO: Fill in all values as described

module.exports = {
  apps: [
    {
      name: 'mcp-agent',
      script: 'src/server.js',

      // TODO: Set instances to use all CPU cores
      instances: 1,
      // TODO: Set exec_mode for HTTP server (cluster or fork?)
      exec_mode: 'fork',

      // TODO: Add memory restart limit (500MB)
      // TODO: Set watch to false

      env: {
        NODE_ENV: 'development',
      },
      // TODO: Add env_production block with LOG_LEVEL: 'info'

      // TODO: Configure log files and merge_logs
      // TODO: Add restart_delay and max_restarts
      // TODO: Add kill_timeout: 10000
    },
    // TODO: Add a second app entry for 'mcp-worker' (src/worker.js)
    // - exec_mode: 'fork', instances: 2
  ],
};

// src/server.js — Graceful shutdown handler
// TODO: Implement SIGINT handler that:
// 1. Stops HTTP server (server.close())
// 2. Drains BullMQ worker (await worker.close())
// 3. Closes Redis connection (await redisClient.quit())
// 4. Exits with code 0
`,
      solutionCode: `// ecosystem.config.js — Production PM2 configuration
const os = require('os');

module.exports = {
  apps: [
    // ── HTTP Server (cluster mode — one worker per CPU) ──────────────────────
    {
      name:       'mcp-server',
      script:     'src/server.js',

      instances:  'max',           // os.cpus().length workers
      exec_mode:  'cluster',       // share port 3000 across workers

      max_memory_restart: '500M',  // restart if RSS exceeds 500MB
      watch:       false,
      ignore_watch: ['node_modules', 'logs', '*.log'],

      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        LOG_LEVEL: 'info',
      },

      out_file:        './logs/server-out.log',
      error_file:      './logs/server-error.log',
      merge_logs:      true,
      log_date_format: '',          // rely on JSON timestamps from pino

      restart_delay:           1000,
      max_restarts:            10,
      exp_backoff_restart_delay: 100,

      kill_timeout:    10000,       // 10s to finish shutdown before SIGKILL
      listen_timeout:  10000,       // 10s to come up before PM2 marks failed
    },

    // ── BullMQ Worker (fork mode — does not serve HTTP) ─────────────────────
    {
      name:       'mcp-worker',
      script:     'src/worker.js',

      instances:  2,               // 2 concurrent worker processes
      exec_mode:  'fork',          // each gets its own process, no shared port

      max_memory_restart: '400M',
      watch: false,

      env_production: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info',
        WORKER_CONCURRENCY: '5',   // each process handles 5 concurrent jobs
      },

      out_file:    './logs/worker-out.log',
      error_file:  './logs/worker-error.log',
      merge_logs:  true,

      kill_timeout: 30000,         // workers need longer — let active jobs finish
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// src/server.js — Graceful shutdown
// ─────────────────────────────────────────────────────────────────────────────
const express    = require('express');
const { Worker } = require('bullmq');
const redis      = require('redis');
const logger     = require('./logger');

const app         = express();
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
const PORT        = process.env.PORT || 3000;

redisClient.connect();

// BullMQ worker (also lives in this process for the server role)
const worker = new Worker('messages', require('./messageProcessor'), {
  connection: { url: process.env.REDIS_URL },
  concurrency: 3,
});

// Start HTTP server
const server = app.listen(PORT, () => {
  logger.info({ event: 'server_started', port: PORT, pid: process.pid });
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
let isShuttingDown = false;

async function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ event: 'graceful_shutdown_start', signal, pid: process.pid });

  // Step 1: Stop accepting new HTTP connections
  // In-flight requests continue until they complete or kill_timeout fires
  server.close(() => {
    logger.info({ event: 'http_server_closed' });
  });

  try {
    // Step 2: Drain BullMQ worker
    // close() waits for active jobs to finish, then stops polling for new ones
    await worker.close();
    logger.info({ event: 'bullmq_worker_drained' });

    // Step 3: Close Redis connection cleanly (sends QUIT command)
    await redisClient.quit();
    logger.info({ event: 'redis_closed' });

    // Step 4: Clean exit — PM2 marks this instance as stopped
    logger.info({ event: 'graceful_shutdown_complete' });
    process.exit(0);
  } catch (err) {
    logger.error({ event: 'graceful_shutdown_error', error: err.message });
    process.exit(1);
  }
}

process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
`,
    },
    {
      id: "production-architecture-5",
      slug: "nginx-reverse-proxy",
      title: "Nginx Reverse Proxy & Load Balancing",
      content: `# Nginx Reverse Proxy & Load Balancing

## Why Nginx in Front of Node.js

Node.js is excellent at handling application logic but poor at:
- Handling slow clients (it's single-threaded; slow clients tie up connections)
- Serving static files efficiently (Nginx uses sendfile syscall; Node.js doesn't)
- SSL termination (Nginx is highly optimized for TLS handshakes)
- Rate limiting at the network edge
- WebSocket connection management at scale

Nginx sits between the internet and your Node.js cluster, handling all of the above before a single byte reaches your application code.

## Architecture

\`\`\`
Internet
   │
   ▼
Nginx (port 443 — SSL termination)
   │
   ├── Static files → served directly from /var/www
   │
   └── /api, /webhooks, /ws → upstream (Node.js PM2 cluster)
            ├── 127.0.0.1:3000 (worker 0)
            ├── 127.0.0.1:3001 (worker 1)  ← Note: same port in cluster mode
            └── 127.0.0.1:3002 (worker 2)
\`\`\`

With PM2 cluster mode, all workers share port 3000. Nginx proxies to a single upstream address and the OS handles the distribution.

## The upstream Block

\`\`\`nginx
upstream node_app {
  # PM2 cluster mode: all workers share port 3000
  server 127.0.0.1:3000;

  # Keep persistent connections to Node.js (HTTP/1.1 keepalive)
  # This avoids TCP handshake overhead on every request
  keepalive 64;
}
\`\`\`

If you run multiple Node.js instances on different ports (fork mode), list each:

\`\`\`nginx
upstream node_workers {
  least_conn;                    # route to the worker with fewest active connections
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
  keepalive 32;
}
\`\`\`

## WebSocket Proxying

Standard HTTP proxying doesn't support WebSockets. You must explicitly tell Nginx to upgrade the connection:

\`\`\`nginx
location /ws {
  proxy_pass http://node_app;

  # Required for WebSocket protocol upgrade
  proxy_http_version 1.1;
  proxy_set_header Upgrade    \$http_upgrade;
  proxy_set_header Connection "upgrade";

  # Prevent Nginx from closing idle WebSocket connections
  proxy_read_timeout 3600s;   # 1 hour — adjust to your session length
  proxy_send_timeout 3600s;
}
\`\`\`

Without \`proxy_http_version 1.1\` and the Upgrade headers, WebSocket handshakes fail with a 400 error.

## SSL Termination with Let's Encrypt

\`\`\`nginx
server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  # Modern TLS settings (Mozilla Intermediate compatibility)
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:...;
  ssl_prefer_server_ciphers off;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 1d;
}

# Redirect HTTP → HTTPS
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://\$host\$request_uri;
}
\`\`\`

Use \`certbot\` to obtain and auto-renew Let's Encrypt certificates. Certbot modifies your Nginx config automatically on first run.

## Timeouts & Buffer Configuration

Critical for AI agents that stream long responses:

\`\`\`nginx
location /api {
  proxy_pass http://node_app;
  proxy_http_version 1.1;
  proxy_set_header Host              \$host;
  proxy_set_header X-Real-IP         \$remote_addr;
  proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto \$scheme;

  # AI responses can take up to 30 seconds — don't cut them off
  proxy_read_timeout 120s;   # wait up to 120s for Node.js to respond
  proxy_send_timeout  60s;   # wait up to 60s for client to accept data
  proxy_connect_timeout 5s;  # upstream connection must be established in 5s

  # Larger buffers for streaming AI responses
  proxy_buffer_size         128k;
  proxy_buffers           4 256k;
  proxy_busy_buffers_size   256k;
}
\`\`\`

The default \`proxy_read_timeout\` is 60 seconds. If Claude is generating a long response and takes 61 seconds, Nginx kills the connection with a 504 Gateway Timeout. Setting it to 120s gives you headroom.

## Rate Limiting at the Nginx Level

Nginx rate limiting uses the leaky bucket algorithm. It's applied before your Node.js app sees the request.

\`\`\`nginx
# Define a rate limit zone: 10 requests/second per IP, 10MB memory for state
limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api {
  # Apply limit; allow burst of 20 requests, no queuing (nodelay)
  limit_req zone=api_limit burst=20 nodelay;
  limit_req_status 429;

  proxy_pass http://node_app;
}
\`\`\`

**Why not do webhook signature validation at Nginx level?** Signature validation requires reading the raw request body and running HMAC-SHA256. Nginx Lua modules can do this but it's complex and error-prone. More importantly, if you reject a webhook at the Nginx level with a 403, the sending service (Slack, GitHub) marks your endpoint as broken and may disable it. Better to accept all webhooks at Nginx and validate signatures in Node.js, returning 200 even on invalid signatures (log and discard).

## Security Headers

\`\`\`nginx
add_header X-Frame-Options          "SAMEORIGIN"   always;
add_header X-Content-Type-Options   "nosniff"      always;
add_header X-XSS-Protection         "1; mode=block" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
add_header Content-Security-Policy  "default-src 'self'; script-src 'self'" always;
add_header Referrer-Policy          "strict-origin-when-cross-origin" always;
\`\`\`

## Upstream Health Check

\`\`\`nginx
upstream node_app {
  server 127.0.0.1:3000;
  keepalive 64;
}
\`\`\`

Nginx open-source doesn't support active health checks (that's Nginx Plus). Instead, configure passive health checking via \`proxy_next_upstream\`:

\`\`\`nginx
proxy_next_upstream error timeout http_503;
proxy_next_upstream_tries 2;
\`\`\`

If Node.js returns a 503 or times out, Nginx retries with the next upstream server (relevant when you have multiple upstream entries in fork mode).

## Interview Tip

Draw the Nginx → Node.js architecture. Show the exact \`proxy_set_header Upgrade \$http_upgrade\` line for WebSockets — interviewers often ask this. Explain why \`proxy_read_timeout 120s\` exists for AI agents. Explain why webhook validation happens in Node.js, not Nginx. Show the \`limit_req_zone\` block for rate limiting. Say: "Nginx handles SSL termination, connection management, and edge rate limiting, keeping Node.js focused on application logic."
`,
      starterCode: `# nginx.conf — reverse proxy skeleton for Node.js MCP agent
# TODO: Fill in all TODOs

events {
  worker_connections 1024;
}

http {
  # TODO: Define rate limit zone
  # - Key: binary_remote_addr (client IP)
  # - Zone name: api_limit, 10MB memory
  # - Rate: 10 requests per second
  # limit_req_zone ...

  # TODO: Define upstream block
  # - Name: node_app
  # - Server: 127.0.0.1:3000
  # - keepalive: 64
  upstream node_app {
    # TODO
  }

  # TODO: HTTP → HTTPS redirect server block
  server {
    listen 80;
    server_name _;
    # TODO: return 301 to https
  }

  server {
    listen 443 ssl;
    server_name yourdomain.com;

    # TODO: Add ssl_certificate and ssl_certificate_key paths
    # TODO: Add TLS protocol settings

    # TODO: Add security headers (X-Frame-Options, HSTS, CSP, etc.)

    # TODO: /api location block
    # - proxy_pass to upstream
    # - Set X-Real-IP, X-Forwarded-For, X-Forwarded-Proto headers
    # - TODO: proxy_read_timeout for long AI responses (120s)
    # - TODO: proxy_buffer_size 128k
    # - TODO: apply rate limit (burst=20 nodelay)

    # TODO: /ws location block for WebSocket proxying
    # - proxy_http_version 1.1
    # - Upgrade and Connection headers
    # - proxy_read_timeout for long-lived WS connections
  }
}
`,
      solutionCode: `# nginx.conf — Production reverse proxy for Node.js MCP agent

user nginx;
worker_processes auto;         # one worker per CPU core
pid /var/run/nginx.pid;

events {
  worker_connections 1024;     # connections per worker
  multi_accept on;
  use epoll;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  # Efficient file sending
  sendfile        on;
  tcp_nopush      on;
  tcp_nodelay     on;

  # Keep upstream connections alive
  keepalive_timeout 65;

  # ── Rate limiting ─────────────────────────────────────────────────────────
  # 10 req/s per client IP; 10MB of state = ~160,000 unique IPs
  limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;
  limit_req_zone \$binary_remote_addr zone=webhook_limit:10m rate=100r/s;

  # ── Upstream ──────────────────────────────────────────────────────────────
  upstream node_app {
    server 127.0.0.1:3000;
    keepalive 64;              # persistent connections to Node.js
  }

  # ── Logging ───────────────────────────────────────────────────────────────
  log_format main_json escape=json '{'
    '"time": "\$time_iso8601",'
    '"remote_addr": "\$remote_addr",'
    '"method": "\$request_method",'
    '"uri": "\$request_uri",'
    '"status": \$status,'
    '"body_bytes_sent": \$body_bytes_sent,'
    '"request_time": \$request_time,'
    '"upstream_response_time": "\$upstream_response_time"'
  '}';

  access_log /var/log/nginx/access.log main_json;
  error_log  /var/log/nginx/error.log  warn;

  # ── HTTP → HTTPS redirect ─────────────────────────────────────────────────
  server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://\$host\$request_uri;
  }

  # ── Main HTTPS server ─────────────────────────────────────────────────────
  server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL certificates (managed by certbot)
    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Mozilla Intermediate TLS configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_stapling on;
    ssl_stapling_verify on;

    # ── Security headers ───────────────────────────────────────────────────
    add_header X-Frame-Options          "SAMEORIGIN"   always;
    add_header X-Content-Type-Options   "nosniff"      always;
    add_header X-XSS-Protection         "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Content-Security-Policy  "default-src 'self'; script-src 'self'; connect-src 'self' wss:" always;
    add_header Referrer-Policy          "strict-origin-when-cross-origin" always;

    # ── Static files (served directly — no Node.js involved) ──────────────
    location /static {
      root /var/www/mcp-agent;
      expires 30d;
      add_header Cache-Control "public, immutable";
    }

    # ── WebSocket endpoint ─────────────────────────────────────────────────
    location /ws {
      proxy_pass http://node_app;
      proxy_http_version 1.1;
      proxy_set_header Upgrade    \$http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host       \$host;

      # Keep WS connection alive for long sessions
      proxy_read_timeout 3600s;
      proxy_send_timeout 3600s;
    }

    # ── Webhook endpoints ──────────────────────────────────────────────────
    # Higher rate limit — legitimate services send frequent webhooks
    # Signature validation happens in Node.js (not here — see lesson notes)
    location /webhooks {
      limit_req zone=webhook_limit burst=50 nodelay;
      limit_req_status 429;

      proxy_pass http://node_app;
      proxy_http_version 1.1;
      proxy_set_header Host              \$host;
      proxy_set_header X-Real-IP         \$remote_addr;
      proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto \$scheme;

      # Webhooks must be acknowledged quickly — short timeout
      proxy_read_timeout 10s;
      proxy_connect_timeout 5s;
    }

    # ── API endpoints ──────────────────────────────────────────────────────
    location /api {
      limit_req zone=api_limit burst=20 nodelay;
      limit_req_status 429;

      proxy_pass http://node_app;
      proxy_http_version 1.1;
      proxy_set_header Connection        "";            # keepalive to upstream
      proxy_set_header Host              \$host;
      proxy_set_header X-Real-IP         \$remote_addr;
      proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto \$scheme;

      # Long timeout for AI streaming responses
      proxy_read_timeout    120s;
      proxy_send_timeout     60s;
      proxy_connect_timeout   5s;

      # Larger buffers for streaming
      proxy_buffer_size         128k;
      proxy_buffers           4 256k;
      proxy_busy_buffers_size   256k;

      # If Node.js returns 502/503, retry next upstream before giving up
      proxy_next_upstream error timeout http_502 http_503;
      proxy_next_upstream_tries 2;
    }

    # ── Health check (no rate limit — monitoring systems poll frequently) ──
    location /health {
      proxy_pass http://node_app;
      proxy_read_timeout 5s;
      access_log off;          # don't fill logs with health check noise
    }

    # ── Metrics (restrict to internal/monitoring IPs) ─────────────────────
    location /metrics {
      allow 10.0.0.0/8;
      deny all;
      proxy_pass http://node_app;
      access_log off;
    }
  }
}
`,
    },
    {
      id: "production-architecture-6",
      slug: "system-design-full-architecture",
      title: "System Design — Putting It All Together",
      content: `# System Design — Putting It All Together

## The Interview Format

When asked "design the Second Brain system," you should deliver a structured 20-minute whiteboard walkthrough:
1. **Clarify requirements** (2 min)
2. **Draw the architecture** (5 min)
3. **Walk through a request lifecycle** (5 min)
4. **Discuss performance budgets** (3 min)
5. **Discuss scaling and failure modes** (5 min)

This lesson gives you everything you need for each section.

## Full Architecture — ASCII Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INGESTION LAYER                                   │
│                                                                             │
│  Slack          Missive (email)   GoHighLevel (CRM)   Krisp (transcripts)  │
│  webhooks       webhooks          webhooks             file upload          │
│     │               │                 │                    │               │
│     └───────────────┴─────────────────┴────────────────────┘               │
│                                       │                                     │
└───────────────────────────────────────┼─────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EDGE LAYER                                        │
│                                                                             │
│  Nginx (SSL termination, rate limiting, WebSocket proxy)                    │
│  └── Certbot (auto-renew Let's Encrypt)                                    │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WEBHOOK HANDLER LAYER (Node.js + PM2 cluster)      │
│                                                                             │
│  /webhooks/slack    /webhooks/missive    /webhooks/ghl    /webhooks/krisp   │
│       │                   │                  │                  │           │
│  Sig validate        Sig validate       Sig validate       Auth check       │
│       │                   │                  │                  │           │
│       └───────────────────┴──────────────────┴──────────────────┘           │
│                                       │                                     │
│                              Dedup check (Redis)                            │
│                                       │                                     │
│                              BullMQ enqueue                                 │
│                                       │                                     │
│                              Return 200 to sender          ← <3 seconds    │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                              Redis (BullMQ queue)
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WORKER LAYER (Node.js + PM2 fork)                   │
│                                                                             │
│  BullMQ Worker (concurrency: 5)                                             │
│       │                                                                     │
│       ├── Circuit Breaker → Slack API (read context, send reply)            │
│       ├── Circuit Breaker → Microsoft Graph (calendar, email)               │
│       ├── Circuit Breaker → GoHighLevel (contacts, pipeline)                │
│       │                                                                     │
│       ├── MCP stdio → Obsidian vault (read/write notes)    ← <300ms        │
│       │                                                                     │
│       └── Claude Code agent loop (reasoning + tool calls)  ← <30s          │
│                                                                             │
│       Outputs: draft response + metadata                                    │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HUMAN APPROVAL LAYER                                  │
│                                                                             │
│  BullMQ queue: 'approvals'                                                  │
│       │                                                                     │
│  Approval UI (Next.js / internal tool)                                      │
│       │                                                                     │
│  Human reviews draft → Approve / Edit / Reject                              │
│       │                                                                     │
│  BullMQ worker → send approved reply via originating API                   │
└─────────────────────────────────────────────────────────────────────────────┘
\`\`\`

## Request Lifecycle — Slack Message to Sent Reply

1. Slack sends a \`message\` event via HTTP POST to \`https://yourdomain.com/webhooks/slack\`
2. Nginx receives it, applies rate limiting, proxies to Node.js in **<50ms**
3. Webhook handler verifies HMAC-SHA256 signature using \`SLACK_SIGNING_SECRET\`
4. Redis dedup check: \`SETNX dedup:slack:{event_id} 1 EX 3600\` — if key exists, return 200 immediately
5. Job enqueued to BullMQ \`messages\` queue with priority and metadata
6. Response sent to Slack: HTTP 200. **Total time: <3 seconds** ← Slack's requirement
7. BullMQ worker picks up the job within milliseconds
8. Worker queries Obsidian vault via MCP stdio: "who is this person, what's our history?"
9. Claude Code agent reasons about context + message, generates draft reply
10. Draft pushed to \`approvals\` queue
11. Human sees it in approval UI, edits slightly, clicks Approve
12. Worker sends approved message via Slack API
13. Total end-to-end: **<60 seconds** (human review included)

## Performance Budgets

These are not aspirational — they're contractual. Slack disconnects webhook endpoints that don't acknowledge within 3 seconds.

| Operation | Budget | How Achieved |
|---|---|---|
| Webhook acknowledgment | **<3 seconds** | Enqueue and return immediately; never do work in webhook handler |
| Vault retrieval (MCP) | **<300ms** | Local Obsidian filesystem; MCP stdio latency is negligible |
| AI response generation | **<30 seconds** | Claude Sonnet (fast tier); stream output as it arrives |
| End-to-end message processing | **<60 seconds** | Async queue; human approval is the bottleneck |
| Health check response | **<100ms** | Cached checks; never block on slow external calls in /health |

## Failure Modes and Mitigations

| Failure | Detection | Mitigation |
|---|---|---|
| Slack API down | Circuit breaker opens | Queue for retry; Slack recovers quickly |
| Redis down | /health/ready returns 503 | Nginx takes instance out of rotation; alert immediately |
| Worker OOM crash | PM2 restarts automatically | max_memory_restart: '400M' catches before OOM kill |
| Queue backed up | queue_depth Prometheus gauge > 100 | Alert fires; investigate worker bottleneck |
| Duplicate webhooks | Redis dedup SETNX | Idempotent by design; duplicate silently discarded |
| Claude response timeout | 30s timeout on Claude call | Return draft "no response" to approval queue; human handles |

## Scaling Strategy

**Phase 1 — Single box (current):**
\`\`\`
1 server (4 CPU, 16GB RAM)
PM2 cluster: 4 HTTP workers on port 3000
PM2 fork: 2 BullMQ workers
Redis: local, single instance
Capacity: ~500 messages/day
\`\`\`

**Phase 2 — Bigger box (vertical scaling):**
When CPU > 80% sustained or Redis memory > 70%:
\`\`\`
Upgrade to 8 CPU, 32GB RAM
PM2 cluster: 8 HTTP workers
PM2 fork: 4 BullMQ workers
Redis: still local (Redis is lean, it'll fit)
Capacity: ~2,000 messages/day
\`\`\`

**Phase 3 — Distributed (horizontal scaling):**
When a single box can't handle load:
\`\`\`
Multiple app servers behind Nginx
Redis Cluster (3 master + 3 replica)
BullMQ workers on dedicated nodes
Shared session store in Redis
Capacity: ~20,000 messages/day
\`\`\`

## Disaster Recovery

**Redis persistence:** Enable both RDB (snapshots) and AOF (append-only log) for durability. RDB for fast restarts; AOF for minimal data loss.

\`\`\`
# redis.conf
save 900 1           # RDB snapshot every 15 minutes if ≥1 key changed
appendonly yes       # AOF: write every command to disk
appendfsync everysec # fsync every second (balance between safety and performance)
\`\`\`

**Queue replay:** BullMQ stores failed jobs in the \`failed\` queue with full metadata and error stack. On recovery:
\`\`\`bash
# Retry all failed jobs from the last 24 hours
node scripts/retry-failed.js --since=24h
\`\`\`

**Backup strategy:** Nightly \`redis-cli BGSAVE\` + copy \`dump.rdb\` to S3. Obsidian vault synced via git. Vault recovery: \`git clone\` + start MCP server.

## Cost Estimation

For 500 messages/day processed through Claude Sonnet:

| Item | Monthly Cost |
|---|---|
| VPS (4 CPU, 16GB) | ~\$40/month (Hetzner, DigitalOcean) |
| Redis memory (1GB vault embeddings + 200MB queues) | included on-box |
| Claude API (500 msg × 2K tokens avg) | ~\$15/month at \$0.003/1K input tokens |
| Slack API | Free (Tier 3 bot) |
| Microsoft Graph | Free (included in M365 license) |
| **Total** | **~\$55/month** |

## Interview Whiteboard Strategy

**Start with requirements clarification:** "What's the expected message volume? Do we need multi-tenant isolation? What's the SLA for response time?"

**Draw the diagram top-to-bottom:** Ingestion → Edge → Webhooks → Queue → Workers → Approval → Send. Use boxes and arrows. Label each layer.

**Walk through one request:** Pick Slack message → webhook → queue → Claude → approval → reply. Narrate the latency at each step and how you stay under the 3-second Slack requirement.

**Address failure modes unprompted:** "The thing I worry most about is Redis going down. Here's how I detect it and how I recover."

**End with cost:** Engineers who can estimate cost stand out. Show the \$55/month number and explain the levers: message volume drives Claude API costs; compute is nearly fixed.
`,
      starterCode: `// system-design-notes.js
// Use this file to sketch out the system design components as code
// This is your "thinking out loud" document for the interview

// TODO: Define the complete system architecture as a JS object
const systemArchitecture = {
  layers: {
    ingestion: {
      // TODO: List all webhook sources with their event types
      sources: [],
    },
    edge: {
      // TODO: Describe Nginx responsibilities
      components: [],
    },
    webhookHandlers: {
      // TODO: Describe the handler responsibilities
      // Key insight: what do handlers do and NOT do?
      responsibilities: [],
      mustNeverDo: [],
    },
    queue: {
      // TODO: Describe the BullMQ queue setup
      technology: '',
      queues: [],
    },
    workers: {
      // TODO: List what workers do (MCP, Claude, circuit breakers)
      steps: [],
    },
    approval: {
      // TODO: Describe the human approval flow
    },
  },
};

// TODO: Define performance budgets as constants
const PERFORMANCE_BUDGETS = {
  webhookAckMs: 0,       // Slack requires < 3 seconds
  vaultRetrievalMs: 0,   // MCP Obsidian lookup
  aiResponseMs: 0,       // Claude generation time
  endToEndMs: 0,         // Full message lifecycle
};

// TODO: Define the failure mode matrix
const FAILURE_MODES = [
  // { failure, detection, mitigation }
];

// TODO: Define the scaling phases
const SCALING_PHASES = {
  phase1: { description: '', cpus: 0, workers: 0, capacityPerDay: 0 },
  phase2: { description: '', cpus: 0, workers: 0, capacityPerDay: 0 },
  phase3: { description: '', cpus: 0, workers: 0, capacityPerDay: 0 },
};

// TODO: Estimate monthly cost for 500 messages/day
const COST_ESTIMATE = {
  vps: 0,
  claudeAPI: 0,
  total: 0,
};

module.exports = { systemArchitecture, PERFORMANCE_BUDGETS, FAILURE_MODES, SCALING_PHASES, COST_ESTIMATE };
`,
      solutionCode: `// system-design-notes.js
// Complete system design reference document — use in interview prep

// ── Full Architecture ────────────────────────────────────────────────────────

const systemArchitecture = {
  layers: {
    ingestion: {
      sources: [
        { name: 'Slack',     protocol: 'HTTP webhook', events: ['message', 'app_mention', 'reaction_added'] },
        { name: 'Missive',   protocol: 'HTTP webhook', events: ['conversation.new', 'message.new'] },
        { name: 'GoHighLevel', protocol: 'HTTP webhook', events: ['contact.created', 'opportunity.statusChanged'] },
        { name: 'Krisp',     protocol: 'file upload or webhook', events: ['transcript.ready'] },
      ],
    },

    edge: {
      technology: 'Nginx',
      responsibilities: [
        'SSL termination (Let\'s Encrypt, auto-renewed by certbot)',
        'Rate limiting at network edge (10 req/s per IP for /api)',
        'WebSocket proxying (Upgrade header forwarding)',
        'Security headers (HSTS, CSP, X-Frame-Options)',
        'Proxy to Node.js cluster on 127.0.0.1:3000',
        'Passive upstream health checking (proxy_next_upstream)',
      ],
      doesNOT: [
        'Validate webhook signatures (must be done in Node.js with raw body)',
        'Run application logic',
        'Connect to Redis or databases',
      ],
    },

    webhookHandlers: {
      technology: 'Express.js routes in PM2 cluster mode',
      responsibilities: [
        'Verify HMAC-SHA256 webhook signatures',
        'Parse and normalize event payloads',
        'Dedup via Redis SETNX (idempotency key from event ID)',
        'Enqueue to BullMQ with priority and metadata',
        'Return HTTP 200 to the sender',
      ],
      mustNeverDo: [
        'Call external APIs (Slack, Claude, Graph) — this breaks the 3s SLA',
        'Read from the database or Obsidian vault',
        'Do any work that takes more than 100ms',
      ],
      slaConstraint: 'Must acknowledge to Slack within 3 seconds or Slack disables the endpoint',
    },

    queue: {
      technology: 'BullMQ (Redis-backed)',
      queues: [
        { name: 'messages',  purpose: 'Incoming messages awaiting AI processing', priority: true },
        { name: 'approvals', purpose: 'AI-drafted replies awaiting human review' },
        { name: 'retries',   purpose: 'Failed external API calls awaiting retry' },
      ],
      persistence: 'Redis RDB + AOF — jobs survive server restarts',
      dedup: 'SETNX dedup:{source}:{eventId} 1 EX 3600 — 1-hour dedup window',
    },

    workers: {
      technology: 'BullMQ Worker in PM2 fork mode (2 processes, concurrency 5 each)',
      steps: [
        '1. Receive job from BullMQ messages queue',
        '2. Query Obsidian vault via MCP stdio for relevant context (<300ms)',
        '3. Build Claude prompt: system context + vault excerpts + message',
        '4. Stream Claude Code agent response (<30s)',
        '5. If agent calls tools (send_slack, write_note), execute via circuit breakers',
        '6. Push completed draft to BullMQ approvals queue',
        '7. Mark BullMQ job as complete',
      ],
      circuitBreakers: {
        slack:  { resetTimeout: 30000,  fallback: 'queue for retry' },
        graph:  { resetTimeout: 60000,  fallback: 'queue for retry' },
        ghl:    { resetTimeout: 45000,  fallback: 'queue for retry' },
      },
      errorHandling: 'BullMQ retries failed jobs 3x with exponential backoff before moving to failed queue',
    },

    approval: {
      ui: 'Internal Next.js dashboard or Slack ephemeral message with approve/edit/reject buttons',
      flow: [
        'Worker pushes draft to approvals queue',
        'Approval UI polls queue or receives push notification',
        'Human reviews: sees original message + AI draft + vault context used',
        'Human approves (send as-is), edits (modify then send), or rejects (discard)',
        'On approval: worker sends via originating API (Slack, Missive, GHL)',
        'Obsidian vault updated with sent message for future context',
      ],
    },
  },
};

// ── Performance Budgets ──────────────────────────────────────────────────────

const PERFORMANCE_BUDGETS = {
  webhookAckMs:      3000,  // Slack REQUIRES ack in <3s or disables endpoint
  vaultRetrievalMs:   300,  // MCP stdio to local Obsidian filesystem
  aiResponseMs:     30000,  // Claude Sonnet streaming, complex multi-tool calls
  endToEndMs:       60000,  // Full cycle including human review
  healthCheckMs:      100,  // /health must respond fast (monitoring polls every 10s)
};

// ── Failure Modes ────────────────────────────────────────────────────────────

const FAILURE_MODES = [
  {
    failure:    'Slack API down',
    detection:  'Circuit breaker opens; /health shows slack_breaker: open',
    mitigation: 'Retry queue with 60s delay × 3 attempts; alert fires immediately',
  },
  {
    failure:    'Redis down',
    detection:  '/health/ready returns 503; Nginx takes instance out of rotation',
    mitigation: 'Alert fires; webhook queue pauses; recovery: restart Redis, BullMQ replays from AOF',
  },
  {
    failure:    'Worker OOM crash',
    detection:  'PM2 detects exit; restarts automatically',
    mitigation: 'max_memory_restart: "400M" catches before kernel OOM kill; active jobs re-queued by BullMQ',
  },
  {
    failure:    'Queue backed up',
    detection:  'queue_depth Prometheus gauge exceeds 100; alert fires',
    mitigation: 'Scale workers (increase PM2 instances); investigate slow Claude calls',
  },
  {
    failure:    'Duplicate webhooks',
    detection:  'Redis SETNX returns 0 (key exists)',
    mitigation: 'Silent discard; return 200; no downstream processing',
  },
  {
    failure:    'Claude API timeout',
    detection:  '30s timeout fires on Claude call',
    mitigation: 'Push partial result to approval queue; human sees "AI timed out, please review manually"',
  },
];

// ── Scaling Phases ───────────────────────────────────────────────────────────

const SCALING_PHASES = {
  phase1: {
    description:    'Single box — current setup',
    cpus:           4,
    ram:            '16GB',
    httpWorkers:    4,    // PM2 cluster
    queueWorkers:   2,    // PM2 fork
    redis:          'local single instance',
    capacityPerDay: 500,
    monthlyCost:    '$40/month (Hetzner CX31)',
  },
  phase2: {
    description:    'Vertical scaling — bigger box',
    trigger:        'CPU >80% sustained OR Redis memory >70%',
    cpus:           8,
    ram:            '32GB',
    httpWorkers:    8,
    queueWorkers:   4,
    redis:          'local, still fits in RAM',
    capacityPerDay: 2000,
    monthlyCost:    '$80/month',
  },
  phase3: {
    description:    'Horizontal scaling — multiple boxes',
    trigger:        'Single box CPU saturated even after vertical scale',
    setup:          'Multiple app servers behind Nginx upstream',
    redis:          'Redis Cluster (3 master + 3 replica)',
    queueWorkers:   'Dedicated worker nodes',
    sessionStore:   'Redis (shared across app servers)',
    capacityPerDay: 20000,
    monthlyCost:    '$300-500/month depending on node count',
  },
};

// ── Cost Estimate (500 messages/day) ─────────────────────────────────────────

const COST_ESTIMATE = {
  assumptions: {
    messagesPerDay:         500,
    avgInputTokensPerMsg:   2000,
    avgOutputTokensPerMsg:  800,
    modelPriceInput:        0.003,   // $ per 1K tokens (Claude Sonnet)
    modelPriceOutput:       0.015,
  },
  monthly: {
    vps:              40,   // Hetzner CX31: 4 CPU, 16GB
    claudeInputAPI:   9,    // 500 × 30 days × 2K tokens / 1K × $0.003
    claudeOutputAPI:  18,   // 500 × 30 days × 800 tokens / 1K × $0.015
    slackAPI:         0,    // Free for bots
    graphAPI:         0,    // Included in M365 Business license
    ghlAPI:           0,    // Included in GHL subscription
    domain:           1,    // ~$1/month amortized
    total:            68,   // ~$68/month all-in
  },
  note: 'Claude API cost scales linearly with message volume. At 5,000 msg/day, API costs ~$270/month. Compute cost stays flat until Phase 2 scaling.',
};

// ── Interview Delivery Script ─────────────────────────────────────────────────

const INTERVIEW_SCRIPT = {
  opening: [
    'Before I draw anything, let me clarify a few things.',
    'What\'s the expected message volume — hundreds per day or thousands?',
    'Do we need multi-tenant isolation (different orgs, separate data)?',
    'What\'s the acceptable SLA for the human review step?',
  ],
  diagramOrder: [
    '1. Draw ingestion sources (Slack, Missive, GHL, Krisp)',
    '2. Draw Nginx box — mention SSL termination and rate limiting',
    '3. Draw webhook handler box — emphasize it only enqueues, never calls APIs',
    '4. Draw Redis/BullMQ queue',
    '5. Draw worker box — mention circuit breakers and MCP stdio',
    '6. Draw Claude agent box',
    '7. Draw approval queue and human UI',
    '8. Draw response path back to Slack/Missive/GHL',
  ],
  keyPoints: [
    'The 3-second Slack SLA is why we queue — never do work in the webhook handler',
    'Circuit breakers protect us when Slack or Graph has an outage',
    'Dedup via Redis prevents double-processing duplicate webhooks',
    'PM2 cluster gives us horizontal scaling on a single box with zero code changes',
    'Nginx handles SSL and rate limiting so Node.js handles application logic',
  ],
  closingStatement: 'On a single 4-core box this handles ~500 messages/day at about $68/month. Vertical scale gets us to 2,000/day; horizontal scale to 20,000/day when the business needs it.',
};

module.exports = {
  systemArchitecture,
  PERFORMANCE_BUDGETS,
  FAILURE_MODES,
  SCALING_PHASES,
  COST_ESTIMATE,
  INTERVIEW_SCRIPT,
};
`,
    },
  ],
};
