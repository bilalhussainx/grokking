import { Module } from "../types";

export const redisIdempotencyModule: Module = {
  id: "redis-idempotency",
  title: "Redis & Queue Idempotency Patterns",
  description: "Five deep-dive lessons on building bulletproof idempotent pipelines with Redis deduplication keys, Lua scripts, BullMQ, Redis Streams consumer groups, and end-to-end webhook processing — with exact Redis commands and interview-ready explanations.",
  lessons: [
    {
      id: "redis-idempotency-1",
      slug: "redis-dedup-key-schemas",
      title: "Redis Deduplication Key Schemas",
      content: `# Redis Deduplication Key Schemas

## Why Deduplication Matters in Distributed Systems

In distributed message systems, the same event can arrive more than once. Networks retry, load balancers re-send, and upstream services have at-least-once delivery guarantees. Without a deduplication layer, a single Slack message could trigger five Claude API calls, five database writes, and five outbound notifications. The cost is not just money — it is data corruption.

The solution is a **dedup gate**: before processing any message, check whether you have already seen it. Redis is the ideal gate because it is fast (sub-millisecond reads), atomic (SET NX), and expiry-aware (EX). Every message processing pipeline should have this as step one.

## Key Schema Design: namespace:entity:identifier

A Redis key is just a string, but a well-designed schema makes debugging and memory management dramatically easier. The canonical pattern is:

\`\`\`
<namespace>:<entity-type>:<unique-identifier>
\`\`\`

**Real examples:**

\`\`\`
dedupe:slack:T024BE7LD:1234567890.123456
         ↑           ↑         ↑
      platform   team-id   message timestamp (Slack TS is globally unique)

dedupe:graph:webhook:8a4f2c1d-9b3e-4a7f-bc2d-1e5f9g8h7i6j
         ↑      ↑            ↑
      system  source      notification-id from payload

dedupe:missive:conversation:conv_abc123:msg_def456
                    ↑              ↑          ↑
                 entity         conv-id    message-id

dedupe:ghl:contact:GHLA1234:event:appointment_created:1741564800
\`\`\`

The namespace prefix (\`dedupe:\`) separates dedup keys from other Redis keys (cache, sessions, rate limiters) — critical when you run a shared Redis instance. The entity segment tells you what type of object generated the message. The identifier is the globally-unique ID from the upstream system.

**Interview tip:** When asked about deduplication keys, name your namespace explicitly and explain why the identifier must come from the upstream system, not from your own UUID generator. A UUID you generate is only unique if you generated it once — but if your ingestion layer restarts, it may generate a new UUID for the same upstream event.

## TTL Strategy: Match the Retry Window Plus Buffer

The TTL on a dedup key should be at least as long as the upstream system's retry window, plus a safety buffer:

\`\`\`
TTL = upstream_max_retry_window + buffer
\`\`\`

| Source | Typical retry window | Recommended TTL |
|--------|---------------------|-----------------|
| Slack Event API | Retries for ~3 minutes | 10 minutes (600s) |
| GitHub webhooks | Retries for up to 72 hours | 4 days (345600s) |
| Stripe webhooks | Retries for up to 3 days | 5 days (432000s) |
| Internal BullMQ | Configurable, often 24h | 2 days (172800s) |

**Why not keep keys forever?** Memory cost. A dedup key with no payload is typically 50–100 bytes in Redis. At scale that matters.

## SET NX EX: The Atomic Check-and-Store Pattern

The critical operation is atomic: check if the key exists, and if not, set it. Non-atomic approaches introduce a race condition:

\`\`\`
// WRONG — race condition between check and set
const exists = await redis.get(key);  // another worker sneaks in here
if (!exists) await redis.set(key, "1");
\`\`\`

The correct Redis primitive is \`SET key value NX EX seconds\`:

\`\`\`redis
SET dedupe:slack:T024BE7LD:1234567890.123456 "1" NX EX 600
\`\`\`

- \`NX\` — only set if Not eXists
- \`EX 600\` — expire in 600 seconds
- Returns \`"OK"\` if set (first time seen), \`null\` if key existed (duplicate)

In Node.js with \`ioredis\`:

\`\`\`typescript
const result = await redis.set(key, "1", "NX", "EX", 600);
const isDuplicate = result === null;
\`\`\`

This is a single-round-trip, single-command operation. Redis executes it atomically — no other command can execute between the check and the set.

## Memory Estimation: Know Your Numbers

Interviewers love capacity questions. Here is the formula:

\`\`\`
memory = keys_per_day × ttl_days × bytes_per_key
\`\`\`

Example for a Slack-heavy workspace:
- 10,000 messages/day × 7-day TTL × 100 bytes/key = **~70 MB**

That is negligible for a dedicated Redis instance (typically 1–32 GB). For a shared instance, set a \`maxmemory\` limit and choose an appropriate eviction policy:

| Policy | Behavior | Use for dedup? |
|--------|----------|----------------|
| \`noeviction\` | Returns error when full | No — breaks dedup silently |
| \`allkeys-lru\` | Evicts least-recently-used | Risky — may evict recent dedup keys |
| \`volatile-lru\` | Evicts LRU among keys with TTL | Yes — safe, only evicts expiring keys |
| \`volatile-ttl\` | Evicts keys with shortest TTL first | Yes — evicts oldest dedup keys first |

For dedup keys specifically, \`volatile-ttl\` is ideal: it will evict the oldest (most expired-soon) keys first, which are the ones least likely to appear as duplicates.

**Interview answer:** "I always estimate memory impact before deploying a dedup layer. For our Slack pipeline at 10K messages/day with a 7-day TTL, we need roughly 70MB of Redis memory — well within our 4GB instance. I set \`maxmemory-policy volatile-ttl\` so if we ever hit the limit, Redis evicts the oldest dedup keys, which are the ones with the shortest remaining TTL and least likely to be duplicated."
`,
      starterCode: `import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

interface DeduplicationService {
  /**
   * Check if a message has been seen before and mark it as seen.
   * Returns true if the message is NEW (should be processed).
   * Returns false if the message is a DUPLICATE (should be dropped).
   */
  checkAndMark(
    namespace: string,
    entityType: string,
    identifier: string,
    ttlSeconds?: number
  ): Promise<boolean>;

  /**
   * Build a Redis key following the namespace:entity:identifier pattern.
   */
  buildKey(namespace: string, entityType: string, identifier: string): string;

  /**
   * Estimate memory usage for a given volume of messages.
   * Returns result in MB.
   */
  estimateMemoryMB(
    messagesPerDay: number,
    ttlDays: number,
    bytesPerKey?: number
  ): number;
}

// TODO: Implement the DeduplicationService
class RedisDeduplicationService implements DeduplicationService {
  constructor(private redis: Redis) {}

  buildKey(namespace: string, entityType: string, identifier: string): string {
    // TODO: Construct key in format namespace:entityType:identifier
    throw new Error("Not implemented");
  }

  async checkAndMark(
    namespace: string,
    entityType: string,
    identifier: string,
    ttlSeconds = 600
  ): Promise<boolean> {
    const key = this.buildKey(namespace, entityType, identifier);
    // TODO: Use SET NX EX to atomically check and mark
    // Return true if NEW (result === "OK"), false if DUPLICATE (result === null)
    throw new Error("Not implemented");
  }

  estimateMemoryMB(
    messagesPerDay: number,
    ttlDays: number,
    bytesPerKey = 100
  ): number {
    // TODO: Return (messagesPerDay * ttlDays * bytesPerKey) / (1024 * 1024)
    throw new Error("Not implemented");
  }
}

// Test the service
async function main() {
  const svc = new RedisDeduplicationService(redis);

  // Simulate a Slack message arriving twice
  const slackTs = "1234567890.123456";
  const teamId = "T024BE7LD";

  // TODO: Call checkAndMark for namespace "dedupe", entityType "slack:\${teamId}", identifier slackTs
  // First call should return true (new), second should return false (duplicate)

  // TODO: Print memory estimate for 10K messages/day, 7-day TTL
}

main().catch(console.error);
`,
      solutionCode: `import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

interface DeduplicationService {
  checkAndMark(
    namespace: string,
    entityType: string,
    identifier: string,
    ttlSeconds?: number
  ): Promise<boolean>;
  buildKey(namespace: string, entityType: string, identifier: string): string;
  estimateMemoryMB(
    messagesPerDay: number,
    ttlDays: number,
    bytesPerKey?: number
  ): number;
}

class RedisDeduplicationService implements DeduplicationService {
  constructor(private redis: Redis) {}

  buildKey(namespace: string, entityType: string, identifier: string): string {
    // Produces keys like: dedupe:slack:T024BE7LD:1234567890.123456
    return \`\${namespace}:\${entityType}:\${identifier}\`;
  }

  async checkAndMark(
    namespace: string,
    entityType: string,
    identifier: string,
    ttlSeconds = 600
  ): Promise<boolean> {
    const key = this.buildKey(namespace, entityType, identifier);
    // SET key "1" NX EX ttlSeconds
    // Returns "OK" if key was newly set (message is NEW)
    // Returns null if key already existed (message is DUPLICATE)
    const result = await this.redis.set(key, "1", "NX", "EX", ttlSeconds);
    return result === "OK"; // true = new, false = duplicate
  }

  estimateMemoryMB(
    messagesPerDay: number,
    ttlDays: number,
    bytesPerKey = 100
  ): number {
    const totalBytes = messagesPerDay * ttlDays * bytesPerKey;
    return totalBytes / (1024 * 1024);
  }
}

// TTL constants by source system
const TTL = {
  SLACK: 600,          // 10 minutes (Slack retries for ~3 min)
  GITHUB: 345600,      // 4 days (GitHub retries for up to 72h)
  STRIPE: 432000,      // 5 days (Stripe retries for up to 3 days)
  INTERNAL: 172800,    // 2 days (BullMQ jobs)
} as const;

async function main() {
  const svc = new RedisDeduplicationService(redis);

  const slackTs = "1234567890.123456";
  const teamId = "T024BE7LD";

  // First arrival: should be processed
  const firstCall = await svc.checkAndMark("dedupe", \`slack:\${teamId}\`, slackTs, TTL.SLACK);
  console.log(\`First arrival — isNew: \${firstCall}\`);   // true

  // Duplicate: should be dropped
  const secondCall = await svc.checkAndMark("dedupe", \`slack:\${teamId}\`, slackTs, TTL.SLACK);
  console.log(\`Second arrival — isNew: \${secondCall}\`); // false

  // Memory estimation
  const memMB = svc.estimateMemoryMB(10_000, 7);
  console.log(\`Memory estimate: \${memMB.toFixed(2)} MB\`); // ~6.68 MB (100 bytes × 10K × 7 days)

  // Key examples printed
  console.log(svc.buildKey("dedupe", "slack:T024BE7LD", "1234567890.123456"));
  // dedupe:slack:T024BE7LD:1234567890.123456
  console.log(svc.buildKey("dedupe", "graph:webhook", "8a4f2c1d-9b3e-4a7f-bc2d-1e5f9g8h7i6j"));
  // dedupe:graph:webhook:8a4f2c1d-9b3e-4a7f-bc2d-1e5f9g8h7i6j

  await redis.quit();
}

main().catch(console.error);
`,
    },
    {
      id: "redis-idempotency-2",
      slug: "lua-scripts-atomic-operations",
      title: "Lua Scripts for Atomic Operations",
      content: `# Lua Scripts for Atomic Operations

## Why Lua Scripts in Redis

Redis commands execute one at a time and are individually atomic — but the moment you need two commands to behave as one unit, you have a problem. A \`GET\` followed by a \`SET\` is two round trips with a window in between where another client can interleave.

Lua scripts solve this. Redis executes an entire Lua script atomically: no other command can run while the script is executing. This is not a lock — it is a guarantee from the Redis single-threaded execution model. The script runs to completion, then the next command starts.

**Key guarantee:** "Within a Lua script, all Redis operations are atomic with respect to each other and with respect to any other Redis command issued by another client." — Redis documentation

## EVAL vs EVALSHA

There are two ways to run a Lua script:

\`\`\`redis
EVAL script numkeys key [key ...] arg [arg ...]
EVALSHA sha1   numkeys key [key ...] arg [arg ...]
\`\`\`

\`EVAL\` sends the full script text every time — fine for development, but wasteful in production. \`EVALSHA\` sends only the SHA1 hash of a previously loaded script. Load the script once with \`SCRIPT LOAD\`, cache the SHA1, then use \`EVALSHA\` on every call.

\`\`\`typescript
// Load script once on startup
const sha = await redis.script("LOAD", luaScript);
// Use SHA on every call
const result = await redis.evalsha(sha, 1, key, ...args);
\`\`\`

This reduces network payload from ~200 bytes (script) to 40 bytes (SHA1) per call — a 5x reduction at high throughput.

## Pattern 1: Check-and-Set (Idempotent Dedup)

The most important Lua pattern for idempotency:

\`\`\`lua
-- KEYS[1] = dedup key
-- ARGV[1] = TTL in seconds
-- Returns 1 if this is a new message (proceed)
-- Returns 0 if duplicate (drop)
local result = redis.call('SET', KEYS[1], '1', 'NX', 'EX', ARGV[1])
if result then
  return 1  -- newly set, process this message
else
  return 0  -- already existed, drop duplicate
end
\`\`\`

This is functionally equivalent to \`SET NX EX\` but lives in a Lua context, which lets you combine it with additional logic in a single atomic block.

## Pattern 2: Increment with Ceiling (Rate Limiter)

\`\`\`lua
-- KEYS[1] = rate limiter key (e.g. ratelimit:user:123:minute:1741564860)
-- ARGV[1] = max allowed
-- ARGV[2] = window TTL in seconds
-- Returns current count, or -1 if limit exceeded
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[2])
end
if current > tonumber(ARGV[1]) then
  return -1  -- rate limit exceeded
end
return current
\`\`\`

## Pattern 3: Sliding Window Rate Limiter

\`\`\`lua
-- KEYS[1] = sorted set key for the sliding window
-- ARGV[1] = current timestamp (ms)
-- ARGV[2] = window size (ms)
-- ARGV[3] = max requests per window
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local cutoff = now - window

-- Remove entries older than the window
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', cutoff)
-- Count remaining entries
local count = redis.call('ZCARD', KEYS[1])

if count >= limit then
  return -1  -- rejected
end

-- Add current request
redis.call('ZADD', KEYS[1], now, now .. '-' .. math.random(1, 1000000))
redis.call('PEXPIRE', KEYS[1], window)
return count + 1
\`\`\`

The sliding window is more accurate than fixed windows — a user cannot burst 200 requests at 11:59 and another 200 at 12:00.

## Error Handling in Lua Scripts

Lua scripts can error in two ways:

1. **Intentional error:** \`return redis.error_reply("Rate limit exceeded")\` — Redis returns an error to the client
2. **Runtime error:** Division by zero, accessing a nil value — Redis returns a generic error and **does not roll back** side effects already executed

This is critical: Lua scripts in Redis are **not transactional** in the database sense. If your script calls \`SET\` and then errors on the next line, the \`SET\` is already committed. Design your scripts to do all the validation before any writes.

\`\`\`lua
-- SAFE pattern: validate first, write last
local existing = redis.call('GET', KEYS[1])
if existing then
  return redis.error_reply("Duplicate")
end
-- Only write after all validation passes
redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
return 1
\`\`\`

## Performance: Keep Scripts Short

Lua scripts block Redis. While your script runs, every other client waits. This is the same reason you should not use \`KEYS *\` in production — it blocks.

Rules for production Lua scripts:
- No network calls inside Lua (not possible anyway, by design)
- No long loops over large datasets
- No \`KEYS\` or \`SCAN\` inside scripts
- Target execution time: < 1ms per script call

**Interview answer:** "I use Lua scripts in Redis when I need atomic check-and-act operations that span multiple commands. The alternative — optimistic locking with WATCH/MULTI/EXEC — requires retry logic on the client side and adds complexity. Lua gives me a clean, atomic block with a single round trip. I keep scripts under ~20 lines and measure their execution time in production with Redis SLOWLOG."
`,
      starterCode: `import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

// TODO: Define the Lua script for idempotent check-and-mark
// Script should:
// - Accept KEYS[1] (dedup key) and ARGV[1] (TTL seconds)
// - Return 1 if new (SET succeeded), 0 if duplicate
const DEDUP_LUA_SCRIPT = \`
  -- TODO: implement check-and-set
\`;

// TODO: Define the Lua script for a fixed-window rate limiter
// Script should:
// - Accept KEYS[1] (rate limit key), ARGV[1] (max count), ARGV[2] (window TTL)
// - Return current count, or -1 if limit exceeded
const RATE_LIMIT_LUA_SCRIPT = \`
  -- TODO: implement increment-with-ceiling
\`;

class LuaScriptManager {
  private dedupSha: string | null = null;
  private rateLimitSha: string | null = null;

  constructor(private redis: Redis) {}

  // TODO: Load both scripts and cache their SHAs
  async loadScripts(): Promise<void> {
    throw new Error("Not implemented");
  }

  // TODO: Check if a message is new (returns true) or duplicate (returns false)
  async isNewMessage(dedupKey: string, ttlSeconds: number): Promise<boolean> {
    throw new Error("Not implemented");
  }

  // TODO: Check rate limit, returns current count or -1 if exceeded
  async checkRateLimit(
    key: string,
    maxRequests: number,
    windowSeconds: number
  ): Promise<number> {
    throw new Error("Not implemented");
  }
}

async function main() {
  const mgr = new LuaScriptManager(redis);
  await mgr.loadScripts();

  // Test dedup
  const key = "dedupe:slack:T024BE7LD:1234567890.123456";
  console.log(await mgr.isNewMessage(key, 600)); // true
  console.log(await mgr.isNewMessage(key, 600)); // false

  // Test rate limiter: allow 3 per 10 seconds
  const rlKey = "ratelimit:user:123";
  for (let i = 0; i < 5; i++) {
    const count = await mgr.checkRateLimit(rlKey, 3, 10);
    console.log(\`Request \${i + 1}: count=\${count}\`); // 1, 2, 3, -1, -1
  }

  await redis.quit();
}

main().catch(console.error);
`,
      solutionCode: `import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

// Idempotent check-and-mark: returns 1 (new) or 0 (duplicate)
const DEDUP_LUA_SCRIPT = \`
local result = redis.call('SET', KEYS[1], '1', 'NX', 'EX', ARGV[1])
if result then
  return 1
else
  return 0
end
\`;

// Fixed-window rate limiter: returns count or -1 if exceeded
const RATE_LIMIT_LUA_SCRIPT = \`
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[2])
end
if current > tonumber(ARGV[1]) then
  return -1
end
return current
\`;

// Sliding window rate limiter (more accurate)
const SLIDING_WINDOW_LUA_SCRIPT = \`
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local cutoff = now - window

redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', cutoff)
local count = redis.call('ZCARD', KEYS[1])

if count >= limit then
  return -1
end

redis.call('ZADD', KEYS[1], now, now .. '-' .. math.random(1, 1000000))
redis.call('PEXPIRE', KEYS[1], window)
return count + 1
\`;

class LuaScriptManager {
  private dedupSha: string | null = null;
  private rateLimitSha: string | null = null;
  private slidingWindowSha: string | null = null;

  constructor(private redis: Redis) {}

  async loadScripts(): Promise<void> {
    // Load all scripts once on startup, cache SHAs
    [this.dedupSha, this.rateLimitSha, this.slidingWindowSha] =
      await Promise.all([
        this.redis.script("LOAD", DEDUP_LUA_SCRIPT) as Promise<string>,
        this.redis.script("LOAD", RATE_LIMIT_LUA_SCRIPT) as Promise<string>,
        this.redis.script("LOAD", SLIDING_WINDOW_LUA_SCRIPT) as Promise<string>,
      ]);
    console.log("Scripts loaded. SHAs cached for EVALSHA calls.");
  }

  async isNewMessage(dedupKey: string, ttlSeconds: number): Promise<boolean> {
    if (!this.dedupSha) throw new Error("Scripts not loaded. Call loadScripts() first.");
    // EVALSHA sha numkeys key arg
    const result = await this.redis.evalsha(this.dedupSha, 1, dedupKey, ttlSeconds.toString());
    return result === 1;
  }

  async checkRateLimit(
    key: string,
    maxRequests: number,
    windowSeconds: number
  ): Promise<number> {
    if (!this.rateLimitSha) throw new Error("Scripts not loaded.");
    const result = await this.redis.evalsha(
      this.rateLimitSha, 1, key,
      maxRequests.toString(),
      windowSeconds.toString()
    );
    return result as number;
  }

  async checkSlidingWindow(
    key: string,
    maxRequests: number,
    windowMs: number
  ): Promise<number> {
    if (!this.slidingWindowSha) throw new Error("Scripts not loaded.");
    const now = Date.now();
    const result = await this.redis.evalsha(
      this.slidingWindowSha, 1, key,
      now.toString(),
      windowMs.toString(),
      maxRequests.toString()
    );
    return result as number;
  }
}

async function main() {
  const mgr = new LuaScriptManager(redis);
  await mgr.loadScripts();

  // Test dedup
  const key = "dedupe:slack:T024BE7LD:1234567890.123456";
  console.log("isNew (first):", await mgr.isNewMessage(key, 600));   // true
  console.log("isNew (second):", await mgr.isNewMessage(key, 600));  // false

  // Test fixed-window rate limiter: allow 3 per 10 seconds
  const rlKey = "ratelimit:user:123";
  for (let i = 0; i < 5; i++) {
    const count = await mgr.checkRateLimit(rlKey, 3, 10);
    console.log(\`Request \${i + 1}: \${count === -1 ? "REJECTED" : "count=" + count}\`);
  }
  // Output: count=1, count=2, count=3, REJECTED, REJECTED

  // Test sliding window
  const swKey = "sliding:user:456";
  for (let i = 0; i < 4; i++) {
    const count = await mgr.checkSlidingWindow(swKey, 3, 60_000);
    console.log(\`Sliding request \${i + 1}: \${count === -1 ? "REJECTED" : count}\`);
  }

  await redis.quit();
}

main().catch(console.error);
`,
    },
    {
      id: "redis-idempotency-3",
      slug: "bullmq-exactly-once-delivery",
      title: "BullMQ Job Queues & Exactly-Once Delivery",
      content: `# BullMQ Job Queues & Exactly-Once Delivery

## BullMQ Architecture: Redis Streams Under the Hood

BullMQ is a Node.js job queue library built on Redis. Understanding its internals turns vague "it processes jobs" answers into specific "here is exactly how it guarantees delivery" answers.

Internally, BullMQ uses **Redis Streams** with consumer groups for its queue mechanism, plus several Redis hashes and sorted sets for job metadata:

\`\`\`
bull:{queue-name}:active         — Sorted set: currently processing jobs
bull:{queue-name}:wait           — List: jobs waiting to be picked up
bull:{queue-name}:delayed        — Sorted set: jobs scheduled for future
bull:{queue-name}:completed      — Sorted set: finished jobs (if retained)
bull:{queue-name}:failed         — Sorted set: failed jobs
bull:{queue-name}:{job-id}       — Hash: job data, attempts, stacktrace
\`\`\`

When a worker picks up a job, BullMQ uses \`BRPOPLPUSH\` (or the Streams equivalent) to atomically move the job ID from \`wait\` to \`active\`. If the worker crashes, the job stays in \`active\` — this is the **stalled job** mechanism.

## Job Lifecycle

\`\`\`
add() → [waiting] → [active] → [completed]
                      ↓              ↑
                   [failed]    (on success)
                      ↓
                  [delayed]   (exponential backoff)
                      ↓
               [failed permanently] → dead letter queue
\`\`\`

**Interview tip:** "BullMQ guarantees at-least-once delivery by default. The job stays in the active set until the worker explicitly calls \`moveToCompleted\` or \`moveToFailed\`. If the worker crashes, a stall checker moves the job back to waiting after a configurable timeout."

## Exactly-Once Processing via Custom Job IDs

The most important pattern for idempotency in BullMQ: **use the upstream message's unique identifier as the job ID**.

\`\`\`typescript
await queue.add("process-message", payload, {
  jobId: slackMessage.ts,  // "1234567890.123456"
});
\`\`\`

If BullMQ receives the same job ID twice, it **silently ignores the duplicate**. This turns your queue into an idempotent gate — no Lua scripts needed for the queue layer. The dedup key in Redis handles network-level deduplication, and the job ID handles queue-level deduplication.

**Limitation:** Job ID deduplication only works while the original job is in the queue (waiting, active, or delayed). Once a job is \`completed\` and removed, the same job ID can be re-added. Use \`removeOnComplete: false\` and a longer retention period if you need queue-level dedup for longer windows.

## removeOnComplete and removeOnFail Settings

\`\`\`typescript
await queue.add("process-message", payload, {
  jobId: slackMessage.ts,
  removeOnComplete: { age: 3600, count: 1000 }, // keep 1h or 1000 jobs
  removeOnFail: { age: 86400 },                  // keep failed jobs 24h
});
\`\`\`

Keep completed jobs for at least as long as your dedup TTL. If a webhook re-fires after 10 minutes but your completed jobs are deleted in 5 minutes, a new job will be created and processed again.

## Retry Strategy: Exponential Backoff with Jitter

Never use fixed delays for retries. Fixed delays cause **thundering herd**: if 1,000 jobs fail simultaneously and retry in exactly 5 seconds, they all hit your downstream service at once.

\`\`\`typescript
const queue = new Queue("slack-responses", {
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 1000,  // base delay: 1 second
    },
    // Retry delays: 1s, 2s, 4s, 8s, 16s
  },
});
\`\`\`

Add jitter in a custom backoff strategy:

\`\`\`typescript
backoff: {
  type: "custom",
},
// In worker:
Worker.customBackoffStrategy = (attemptsMade: number) => {
  const base = Math.pow(2, attemptsMade) * 1000;
  const jitter = Math.random() * 1000;
  return base + jitter; // spreads retries across a 1-second window
};
\`\`\`

## Dead Letter Queue for Poison Messages

A poison message is a job that repeatedly fails every retry and will never succeed — often caused by malformed data or a bug in your code. Without a dead letter queue, it just clogs your failed set.

\`\`\`typescript
const worker = new Worker("slack-responses", async (job) => {
  // process...
}, { connection: redis });

worker.on("failed", async (job, error) => {
  if (job && job.attemptsMade >= (job.opts.attempts ?? 3)) {
    // Move to dead letter queue for manual inspection
    await deadLetterQueue.add("failed-job", {
      originalQueue: "slack-responses",
      jobId: job.id,
      data: job.data,
      error: error.message,
      failedAt: new Date().toISOString(),
    });
  }
});
\`\`\`

## Concurrency Control

\`\`\`typescript
const worker = new Worker("slack-responses", processor, {
  connection: redis,
  concurrency: 5,  // process up to 5 jobs simultaneously per worker instance
});
\`\`\`

With 3 worker instances each at concurrency 5, you process up to 15 jobs in parallel. Scale workers horizontally — BullMQ's consumer group semantics ensure each job goes to exactly one worker.

## Priority Queues

\`\`\`typescript
// High-priority job (lower number = higher priority)
await queue.add("process-message", urgentPayload, {
  priority: 1,
  jobId: slackMessage.ts,
});

// Normal job
await queue.add("process-message", normalPayload, {
  priority: 10,
  jobId: slackMessage.ts,
});
\`\`\`

**Interview answer:** "For our Slack pipeline, I use BullMQ with the Slack timestamp as the job ID. This gives me queue-level idempotency for free — BullMQ drops duplicate job IDs. I pair this with a Redis dedup key at the ingestion layer to handle the race condition between webhook arrival and job creation. Retries use exponential backoff with jitter to avoid thundering herd. Poison messages go to a dead letter queue where we alert on Slack and inspect manually."
`,
      starterCode: `import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

interface SlackMessage {
  ts: string;        // Slack timestamp — globally unique per workspace
  teamId: string;
  channelId: string;
  text: string;
  userId: string;
}

interface ProcessedDraft {
  messageTs: string;
  draft: string;
  claudeModel: string;
  processedAt: string;
}

// TODO: Create the main processing queue with appropriate default options
// - attempts: 5
// - exponential backoff starting at 1000ms
// - keep completed jobs for 1 hour or 1000 jobs
const slackQueue = null as unknown as Queue;

// TODO: Create a dead letter queue for poison messages
const deadLetterQueue = null as unknown as Queue;

// TODO: Implement the job processor function
// It should:
// 1. Extract the SlackMessage from job.data
// 2. Call a Claude API (stub it as a function)
// 3. Return the ProcessedDraft
async function processSlackMessage(job: Job): Promise<ProcessedDraft> {
  throw new Error("Not implemented");
}

// Stub: pretend to call Claude
async function callClaude(text: string): Promise<string> {
  return \`Draft response to: "\${text}"\`;
}

// TODO: Create a worker with:
// - concurrency: 5
// - proper error handling that sends to dead letter queue after max attempts
const worker = null as unknown as Worker;

// TODO: Implement enqueueSlackMessage function
// - Uses Slack TS as job ID for idempotency
// - Returns whether the job was newly enqueued (true) or duplicate (false)
async function enqueueSlackMessage(message: SlackMessage): Promise<boolean> {
  throw new Error("Not implemented");
}

async function main() {
  const message: SlackMessage = {
    ts: "1234567890.123456",
    teamId: "T024BE7LD",
    channelId: "C024BE7LD",
    text: "Can you summarize the Q4 report?",
    userId: "U024BE7LD",
  };

  // TODO: Enqueue the message twice to demonstrate idempotency
  // First should enqueue, second should be a no-op
}

main().catch(console.error);
`,
      solutionCode: `import { Queue, Worker, Job, QueueEvents } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

interface SlackMessage {
  ts: string;
  teamId: string;
  channelId: string;
  text: string;
  userId: string;
}

interface ProcessedDraft {
  messageTs: string;
  draft: string;
  claudeModel: string;
  processedAt: string;
}

// Main processing queue
const slackQueue = new Queue<SlackMessage>("slack-responses", {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 1000, // 1s → 2s → 4s → 8s → 16s
    },
    removeOnComplete: { age: 3600, count: 1000 }, // keep 1h or 1000 jobs
    removeOnFail: { age: 86400 },                  // keep failed 24h for debugging
  },
});

// Dead letter queue for permanently failed jobs
const deadLetterQueue = new Queue("slack-dead-letter", {
  connection,
  defaultJobOptions: {
    removeOnComplete: false, // keep forever — these need manual review
    removeOnFail: false,
  },
});

// Stub: pretend to call Claude API
async function callClaude(text: string): Promise<string> {
  // In production: call Anthropic API or OpenClaw gateway
  await new Promise((r) => setTimeout(r, 100)); // simulate latency
  return \`Draft response to: "\${text}"\`;
}

async function processSlackMessage(job: Job<SlackMessage>): Promise<ProcessedDraft> {
  const message = job.data;
  console.log(\`Processing job \${job.id}, attempt \${job.attemptsMade + 1}\`);

  const draft = await callClaude(message.text);

  return {
    messageTs: message.ts,
    draft,
    claudeModel: "claude-opus-4",
    processedAt: new Date().toISOString(),
  };
}

// Worker with concurrency 5 and dead letter queue integration
const worker = new Worker<SlackMessage, ProcessedDraft>(
  "slack-responses",
  processSlackMessage,
  {
    connection,
    concurrency: 5, // up to 5 simultaneous jobs per worker instance
  }
);

worker.on("completed", (job, result) => {
  console.log(\`Job \${job.id} completed. Draft: "\${result.draft.slice(0, 50)}..."\`);
});

worker.on("failed", async (job, error) => {
  if (!job) return;
  const maxAttempts = job.opts.attempts ?? 3;

  if (job.attemptsMade >= maxAttempts) {
    // This is a poison message — all retries exhausted
    console.error(\`Job \${job.id} poisoned after \${job.attemptsMade} attempts. Sending to DLQ.\`);
    await deadLetterQueue.add("failed-slack-job", {
      originalQueue: "slack-responses",
      jobId: job.id,
      data: job.data,
      error: error.message,
      failedAt: new Date().toISOString(),
    });
  } else {
    console.warn(\`Job \${job.id} failed (attempt \${job.attemptsMade}). Will retry. Error: \${error.message}\`);
  }
});

async function enqueueSlackMessage(message: SlackMessage): Promise<boolean> {
  // Use Slack TS as job ID — BullMQ drops duplicates with the same ID
  const jobId = message.ts;

  const existingJob = await slackQueue.getJob(jobId);
  if (existingJob) {
    console.log(\`Duplicate detected for job \${jobId} — dropping\`);
    return false;
  }

  await slackQueue.add("process-message", message, {
    jobId,
    // Priority: DMs from humans get higher priority than channel messages
    priority: message.channelId.startsWith("D") ? 1 : 10,
  });

  console.log(\`Enqueued job \${jobId}\`);
  return true;
}

async function main() {
  const message: SlackMessage = {
    ts: "1234567890.123456",
    teamId: "T024BE7LD",
    channelId: "C024BE7LD",
    text: "Can you summarize the Q4 report?",
    userId: "U024BE7LD",
  };

  const first = await enqueueSlackMessage(message);
  console.log(\`First enqueue — new job: \${first}\`);   // true

  const second = await enqueueSlackMessage(message);
  console.log(\`Second enqueue — new job: \${second}\`); // false — dropped duplicate

  // Wait briefly for job to process
  await new Promise((r) => setTimeout(r, 2000));
  await worker.close();
}

main().catch(console.error);
`,
    },
    {
      id: "redis-idempotency-4",
      slug: "xreadgroup-consumer-group-patterns",
      title: "XREADGROUP & Consumer Group Patterns",
      content: `# XREADGROUP & Consumer Group Patterns

## Redis Streams: Append-Only Log Structure

A Redis Stream is an append-only log — like a Kafka topic, but stored in Redis. Each entry has a globally unique ID in the format \`<milliseconds>-<sequence>\`:

\`\`\`
1741564800000-0   — first entry at Unix ms 1741564800000
1741564800000-1   — second entry at the same millisecond
1741564801234-0   — entry at the next millisecond
\`\`\`

This ID is monotonically increasing, so entries are always in insertion order. You can use \`XADD ... *\` to let Redis auto-generate the ID, or supply your own (useful for dedup):

\`\`\`redis
XADD webhooks * source slack teamId T024BE7LD ts 1234567890.123456 text "hello"
XADD webhooks 1741564800000-0 source slack ...   -- explicit ID
\`\`\`

Supplying an explicit ID derived from the upstream message gives you Streams-level deduplication: Redis rejects \`XADD\` with \`ERR The ID specified ... is equal or smaller\`.

## XREADGROUP: Consumer Groups

Consumer groups allow multiple workers to share a stream, each receiving a unique subset of messages. This is the Streams equivalent of a BullMQ queue.

**Create a consumer group:**
\`\`\`redis
XGROUP CREATE webhooks slack-processors $ MKSTREAM
--                              ↑       ↑
--                        group name   start from latest ($) or beginning (0)
\`\`\`

**Read as a consumer:**
\`\`\`redis
XREADGROUP GROUP slack-processors worker-1 COUNT 10 BLOCK 2000 STREAMS webhooks >
--                      ↑              ↑        ↑                              ↑
--                  group name   consumer id  max msgs                  > = new msgs
\`\`\`

The \`>\` special ID means "give me messages not yet delivered to any consumer in this group." Each message goes to **exactly one consumer** in the group. This is Streams' built-in exactly-once delivery within the consumer group.

## XACK: Acknowledging Processed Messages

After processing a message, **acknowledge it**:

\`\`\`redis
XACK webhooks slack-processors 1741564800000-0
--       ↑           ↑                ↑
--   stream name  group name       message ID
\`\`\`

Until you \`XACK\`, the message sits in the **Pending Entries List (PEL)** for that consumer. The PEL is Redis's memory of "this message was delivered but not confirmed processed." If a worker crashes without ACKing, the message stays in the PEL indefinitely.

## Consumer Failover: XCLAIM

When a worker crashes mid-processing, use \`XCLAIM\` to take ownership of its stuck messages:

\`\`\`redis
XCLAIM webhooks slack-processors worker-2 60000 1741564800000-0
--          ↑           ↑             ↑      ↑
--      stream name  group name  new owner  min-idle-ms (only claim if idle 60s+)
\`\`\`

\`min-idle-ms\` prevents accidentally claiming messages that a healthy worker is actively processing. Only claim messages that have been idle longer than your expected processing time.

**Automated failover with XAUTOCLAIM (Redis 6.2+):**
\`\`\`redis
XAUTOCLAIM webhooks slack-processors worker-2 60000 0-0 COUNT 100
\`\`\`

This atomically claims up to 100 idle messages in one command — no need to list specific IDs.

## XPENDING: Monitoring Unprocessed Messages

\`\`\`redis
XPENDING webhooks slack-processors - + 10
--                      ↑          ↑ ↑ ↑
--                  group name   min max count
\`\`\`

Returns the 10 oldest pending messages: their IDs, which consumer owns them, how long they have been idle, and how many times they have been delivered. An accumulating PEL is a signal that your workers are crashing or too slow.

## Trimming Streams: MAXLEN vs MINID

Without trimming, a Stream grows forever. Two strategies:

\`\`\`redis
-- Keep at most 100,000 entries (approximate with ~)
XADD webhooks MAXLEN ~ 100000 * source slack ...

-- Remove entries older than a specific ID (time-based)
XTRIM webhooks MINID ~ 1741478400000-0  -- remove entries before this timestamp
\`\`\`

Use \`~\` (tilde) for approximate trimming — Redis trims at node boundaries for efficiency, which means you may retain slightly more than the target. Exact trimming (\`MAXLEN 100000\` without \`~\`) is slower.

## Code Example: Consumer Group for Webhook Processing

\`\`\`typescript
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL!);
const STREAM = "webhooks";
const GROUP = "slack-processors";
const CONSUMER = \`worker-\${process.pid}\`;
const IDLE_THRESHOLD_MS = 60_000; // claim messages idle > 60s

async function readAndProcess() {
  while (true) {
    // First: recover any stuck messages from crashed workers
    const stuck = await redis.xautoclaim(
      STREAM, GROUP, CONSUMER,
      IDLE_THRESHOLD_MS, "0-0", "COUNT", "10"
    );
    for (const [id, fields] of stuck[1] ?? []) {
      await processEntry(id, fields);
    }

    // Then: read new messages
    const response = await redis.xreadgroup(
      "GROUP", GROUP, CONSUMER,
      "COUNT", "10", "BLOCK", "2000",
      "STREAMS", STREAM, ">"
    );
    if (!response) continue;
    for (const [, entries] of response) {
      for (const [id, fields] of entries) {
        await processEntry(id, fields);
      }
    }
  }
}

async function processEntry(id: string, fields: string[]) {
  try {
    // Parse flat field array into object
    const data: Record<string, string> = {};
    for (let i = 0; i < fields.length; i += 2) {
      data[fields[i]] = fields[i + 1];
    }
    console.log(\`Processing \${id}:\`, data);
    // ... actual processing ...
    await redis.xack(STREAM, GROUP, id);
  } catch (err) {
    console.error(\`Failed to process \${id}:\`, err);
    // Do NOT xack — message stays in PEL for retry or manual intervention
  }
}
\`\`\`

**Interview answer:** "I use Redis Streams with consumer groups when I need a durable, ordered message queue without adding Kafka infrastructure. XREADGROUP gives me at-most-once delivery semantics per consumer, and XACK makes it exactly-once when combined with idempotent processing. For failover, I run a recovery loop using XAUTOCLAIM to pick up messages from crashed workers. The key insight is that the PEL is Redis's guarantee that no message is silently lost — it is always either ACKed or claimable."
`,
      starterCode: `import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

const STREAM = "webhooks";
const GROUP = "slack-processors";
const CONSUMER = \`worker-\${process.pid}\`;

// TODO: Initialize the consumer group
// Create STREAM if it doesn't exist (MKSTREAM)
// Start from the beginning (0) so we don't miss old messages in tests
async function initConsumerGroup(): Promise<void> {
  throw new Error("Not implemented");
}

// TODO: Add a webhook event to the stream
// Use XADD with MAXLEN ~ 10000 to trim old entries
// Return the entry ID
async function addWebhookEvent(data: Record<string, string>): Promise<string> {
  throw new Error("Not implemented");
}

// TODO: Read new messages from the stream as this consumer
// COUNT: 10, BLOCK: 2000ms
// Returns array of [id, data] tuples
async function readNewMessages(): Promise<Array<[string, Record<string, string>]>> {
  throw new Error("Not implemented");
}

// TODO: Acknowledge a processed message
async function acknowledgeMessage(id: string): Promise<void> {
  throw new Error("Not implemented");
}

// TODO: Claim stuck messages from crashed workers (idle > 30 seconds)
// Use XAUTOCLAIM
async function claimStuckMessages(): Promise<Array<[string, Record<string, string>]>> {
  throw new Error("Not implemented");
}

// TODO: Get pending message count for this group
async function getPendingCount(): Promise<number> {
  throw new Error("Not implemented");
}

async function main() {
  await initConsumerGroup();

  // Add some webhook events
  const id1 = await addWebhookEvent({ source: "slack", ts: "1234567890.123456", text: "hello" });
  const id2 = await addWebhookEvent({ source: "slack", ts: "1234567890.234567", text: "world" });
  console.log("Added entries:", id1, id2);

  // Read and process
  const messages = await readNewMessages();
  for (const [id, data] of messages) {
    console.log(\`Processing \${id}:\`, data);
    await acknowledgeMessage(id);
  }

  const pending = await getPendingCount();
  console.log(\`Pending count after ACK: \${pending}\`); // should be 0

  await redis.quit();
}

main().catch(console.error);
`,
      solutionCode: `import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

const STREAM = "webhooks";
const GROUP = "slack-processors";
const CONSUMER = \`worker-\${process.pid}\`;

async function initConsumerGroup(): Promise<void> {
  try {
    // Create the group starting from message 0 (beginning of stream)
    // MKSTREAM creates the stream if it doesn't exist
    await redis.xgroup("CREATE", STREAM, GROUP, "0", "MKSTREAM");
    console.log(\`Consumer group "\${GROUP}" created on stream "\${STREAM}"\`);
  } catch (err: any) {
    if (err.message?.includes("BUSYGROUP")) {
      // Group already exists — this is fine on restart
      console.log(\`Consumer group "\${GROUP}" already exists — skipping creation\`);
    } else {
      throw err;
    }
  }
}

async function addWebhookEvent(data: Record<string, string>): Promise<string> {
  // Flatten Record to alternating key/value array (required by ioredis xadd)
  const fields = Object.entries(data).flat();
  const id = await redis.xadd(STREAM, "MAXLEN", "~", "10000", "*", ...fields);
  return id!;
}

function parseStreamEntry(fields: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < fields.length; i += 2) {
    result[fields[i]] = fields[i + 1];
  }
  return result;
}

async function readNewMessages(): Promise<Array<[string, Record<string, string>]>> {
  // > means "give me messages not yet delivered to any consumer"
  const response = await redis.xreadgroup(
    "GROUP", GROUP, CONSUMER,
    "COUNT", "10", "BLOCK", "2000",
    "STREAMS", STREAM, ">"
  ) as Array<[string, Array<[string, string[]]>]> | null;

  if (!response) return [];

  const results: Array<[string, Record<string, string>]> = [];
  for (const [, entries] of response) {
    for (const [id, fields] of entries) {
      results.push([id, parseStreamEntry(fields)]);
    }
  }
  return results;
}

async function acknowledgeMessage(id: string): Promise<void> {
  await redis.xack(STREAM, GROUP, id);
  console.log(\`XACK'd message \${id}\`);
}

async function claimStuckMessages(): Promise<Array<[string, Record<string, string>]>> {
  // XAUTOCLAIM: claim messages idle > 30s from any consumer, starting from 0-0
  // Returns [next-start-id, [[id, fields], ...], [deleted-ids]]
  const result = await redis.xautoclaim(
    STREAM, GROUP, CONSUMER,
    "30000",  // min-idle-ms: only claim if idle > 30s
    "0-0",    // start-id: scan from beginning of PEL
    "COUNT", "10"
  ) as [string, Array<[string, string[]]>, string[]];

  const claimed: Array<[string, Record<string, string>]> = [];
  for (const [id, fields] of result[1]) {
    claimed.push([id, parseStreamEntry(fields)]);
  }

  if (claimed.length > 0) {
    console.log(\`Claimed \${claimed.length} stuck message(s) from failed workers\`);
  }
  return claimed;
}

async function getPendingCount(): Promise<number> {
  // XPENDING returns summary: [total, min-id, max-id, [[consumer, count], ...]]
  const summary = await redis.xpending(STREAM, GROUP) as [number, string, string, Array<[string, string]>];
  return summary[0]; // total pending count
}

async function runWorkerLoop(): Promise<void> {
  console.log(\`Worker \${CONSUMER} starting...\`);

  while (true) {
    // Step 1: Recover stuck messages from crashed workers
    const stuck = await claimStuckMessages();
    for (const [id, data] of stuck) {
      try {
        console.log(\`Recovering stuck message \${id}:\`, data);
        // process...
        await acknowledgeMessage(id);
      } catch (err) {
        console.error(\`Failed to process recovered message \${id}\`, err);
      }
    }

    // Step 2: Read fresh messages
    const messages = await readNewMessages();
    for (const [id, data] of messages) {
      try {
        console.log(\`Processing new message \${id}:\`, data);
        // process...
        await acknowledgeMessage(id);
      } catch (err) {
        console.error(\`Failed to process message \${id}\`, err);
        // No XACK — stays in PEL for retry via XAUTOCLAIM
      }
    }
  }
}

async function main() {
  await initConsumerGroup();

  // Add webhook events
  const id1 = await addWebhookEvent({ source: "slack", ts: "1234567890.123456", text: "hello" });
  const id2 = await addWebhookEvent({ source: "slack", ts: "1234567890.234567", text: "world" });
  console.log("Added stream entries:", id1, id2);

  // Read and process
  const messages = await readNewMessages();
  console.log(\`Read \${messages.length} messages\`);
  for (const [id, data] of messages) {
    console.log(\`Processing \${id}:\`, data);
    await acknowledgeMessage(id);
  }

  // Verify pending count is now 0
  const pending = await getPendingCount();
  console.log(\`Pending after ACK: \${pending}\`); // 0

  await redis.quit();
}

main().catch(console.error);
`,
    },
    {
      id: "redis-idempotency-5",
      slug: "end-to-end-idempotent-pipeline",
      title: "End-to-End Idempotent Pipeline",
      content: `# End-to-End Idempotent Pipeline

## Putting It All Together

Every individual piece — Redis dedup keys, Lua scripts, BullMQ, Redis Streams — has been covered. Now we assemble them into a single, cohesive pipeline that can handle any message exactly once, even under failure.

## The Slack Webhook Example — Full Flow

\`\`\`
Slack sends webhook
        │
        ▼
1. VERIFY SIGNATURE (HMAC-SHA256)
   — Reject if invalid — prevents spoofing
        │
        ▼
2. DEDUP CHECK (Redis SET NX EX via Lua)
   Key: dedupe:slack:{teamId}:{slackTs}
   TTL: 600 seconds
   — If duplicate: return HTTP 200 immediately (Slack needs 200 to stop retrying)
   — If new: continue
        │
        ▼
3. ENQUEUE TO BULLMQ
   Job ID: slackTs (idempotency at queue level)
   Queue: slack-responses
   Priority: 1 (DM) or 10 (channel)
        │
        ▼
4. WORKER PICKS UP JOB
   — Call Claude API with message context
   — Retrieve Obsidian context via MCP
   — Generate draft response
        │
        ▼
5. STORE DRAFT (Postgres or Redis hash)
   Key: draft:slack:{slackTs}
   Status: "pending_approval"
        │
        ▼
6. NOTIFY HUMAN FOR APPROVAL
   — Post draft to internal approval Slack channel
   — Include "Approve" and "Edit" buttons
        │
        ▼
7. HUMAN APPROVES (or edits)
   — Approval webhook triggers send
   — Slack API: chat.postMessage or chat.update
   — Update draft status to "sent"
        │
        ▼
8. BULLMQ JOB COMPLETES
   — moveToCompleted()
   — Job retained 1 hour for dedup protection
\`\`\`

## Error Scenarios and Recovery

**Scenario 1: Worker crashes mid-processing**
- Job stays in BullMQ \`active\` set
- Stall checker (runs every 30s by default) moves job back to \`waiting\`
- Job retries with exponential backoff
- Dedup key prevents the webhook from creating a duplicate job

**Scenario 2: Redis goes down during dedup check**
- Circuit breaker activates after 3 consecutive failures
- Fallback: in-memory LRU cache (accept risk of small duplicate window)
- Alert fires, on-call engineer investigates
- On Redis recovery: circuit breaker resets automatically

\`\`\`typescript
import CircuitBreaker from "opossum";

const dedupBreaker = new CircuitBreaker(redis.set.bind(redis), {
  timeout: 500,           // fail fast if Redis takes > 500ms
  errorThresholdPercentage: 50,  // trip after 50% failures
  resetTimeout: 10000,    // try again after 10s
});

dedupBreaker.fallback(() => {
  // In-memory fallback — check local LRU cache
  return inMemoryDedup.check(key) ? null : "OK";
});
\`\`\`

**Scenario 3: Duplicate webhook after dedup key expires**
- Dedup key TTL is 10 minutes, but Slack retries for up to 3 minutes
- Gap exists if the message is processed in the first 3 minutes and the key expires before a retry
- Mitigation: set TTL to at least 2× the upstream retry window
- Additional mitigation: idempotent processing logic (check if draft already exists in DB before writing)

**Scenario 4: Claude API is down**
- BullMQ job fails
- Exponential backoff: retry at 1s, 2s, 4s, 8s, 16s
- If all 5 retries fail: job moves to failed set, DLQ receives notification
- Alert fires with full job data for manual replay

## Monitoring: What to Track

| Metric | Alert threshold | Meaning |
|--------|----------------|---------|
| Queue depth (waiting) | > 500 | Workers can't keep up |
| Processing latency (p99) | > 10s | Claude API slow or worker overloaded |
| Failed job rate | > 1% | Downstream service degraded |
| PEL size (Streams) | > 100 | Workers crashing without ACKing |
| Dedup hit rate | > 20% | Upstream is retrying excessively |
| Redis memory usage | > 80% | Need to scale or adjust TTLs |

## Interview Format: "Walk Me Through..."

When an interviewer says "Walk me through what happens when a Slack webhook arrives," use this structure:

1. **Ingestion:** "First, we verify the Slack signature using HMAC-SHA256 to ensure authenticity."
2. **Dedup gate:** "Then we perform a Redis \`SET NX EX\` (or Lua script) using the Slack timestamp as the key. This is atomic — no race conditions. If it returns null, we drop the message and return 200 immediately."
3. **Queue:** "If it's new, we enqueue to BullMQ using the Slack TS as the job ID. BullMQ's own dedup handles any edge cases where the webhook arrives between the dedup check and the enqueue."
4. **Processing:** "A worker picks up the job, calls Claude with full conversation context from Obsidian, and generates a draft."
5. **Human-in-the-loop:** "The draft goes to an approval queue — the human sees it in Slack and clicks approve or edits it."
6. **Delivery:** "On approval, we call the Slack API. The job completes and is retained in BullMQ for 1 hour as an additional dedup guard."
7. **Failure handling:** "If any step fails, the job retries with exponential backoff. After 5 attempts, it goes to the dead letter queue and pages on-call."

This answer demonstrates: cryptographic verification, Redis atomicity, queue-level idempotency, async processing, human-in-the-loop design, retry strategy, and observability — all in under 90 seconds.
`,
      starterCode: `import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";
import crypto from "crypto";

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlackWebhookPayload {
  team_id: string;
  event: {
    ts: string;
    text: string;
    channel: string;
    user: string;
    type: string;
  };
}

interface PipelineResult {
  status: "processed" | "duplicate" | "rejected";
  jobId?: string;
  reason?: string;
}

// ─── Step 1: Signature Verification ──────────────────────────────────────────

// TODO: Implement Slack signature verification
// Slack signs requests with: v0=HMAC-SHA256(signingSecret, "v0:" + timestamp + ":" + body)
function verifySlackSignature(
  body: string,
  timestamp: string,
  signature: string,
  signingSecret: string
): boolean {
  // TODO: reject if timestamp is > 5 minutes old (replay attack prevention)
  // TODO: compute expected signature and compare with crypto.timingSafeEqual
  throw new Error("Not implemented");
}

// ─── Step 2: Deduplication ────────────────────────────────────────────────────

// TODO: Implement atomic dedup check using SET NX EX
// Returns true if message is NEW, false if DUPLICATE
async function deduplicate(teamId: string, slackTs: string): Promise<boolean> {
  throw new Error("Not implemented");
}

// ─── Step 3: Queue ────────────────────────────────────────────────────────────

const queue = new Queue("slack-pipeline", { connection: redis });

// TODO: Enqueue with job ID = slackTs, correct priority for DMs vs channels
async function enqueue(payload: SlackWebhookPayload): Promise<string> {
  throw new Error("Not implemented");
}

// ─── Step 4-5: Worker ─────────────────────────────────────────────────────────

// TODO: Implement the worker processor
// - Stub Claude call
// - Store draft in Redis hash
// - Return draft text
async function processJob(job: Job<SlackWebhookPayload>): Promise<string> {
  throw new Error("Not implemented");
}

// TODO: Create BullMQ worker with concurrency 5
const worker = null as unknown as Worker;

// ─── Orchestrator ─────────────────────────────────────────────────────────────

// TODO: Implement the full pipeline orchestrator
// 1. Verify signature
// 2. Dedup check
// 3. Enqueue if new
// Returns PipelineResult
async function handleWebhook(
  rawBody: string,
  timestamp: string,
  signature: string
): Promise<PipelineResult> {
  throw new Error("Not implemented");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const signingSecret = "test-secret";
  const payload: SlackWebhookPayload = {
    team_id: "T024BE7LD",
    event: { ts: "1741564800.123456", text: "Can you help with Q4?", channel: "C024", user: "U024", type: "message" },
  };
  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sig = "v0=" + crypto.createHmac("sha256", signingSecret).update(\`v0:\${timestamp}:\${body}\`).digest("hex");

  // TODO: Call handleWebhook twice — first should process, second should be duplicate
}

main().catch(console.error);
`,
      solutionCode: `import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";
import crypto from "crypto";

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });
const SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET ?? "test-secret";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlackWebhookPayload {
  team_id: string;
  event: {
    ts: string;
    text: string;
    channel: string;
    user: string;
    type: string;
  };
}

interface PipelineResult {
  status: "processed" | "duplicate" | "rejected";
  jobId?: string;
  reason?: string;
}

// ─── Step 1: Signature Verification ──────────────────────────────────────────

function verifySlackSignature(
  body: string,
  timestamp: string,
  signature: string,
  signingSecret: string
): boolean {
  // Replay attack prevention: reject requests older than 5 minutes
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) {
    return false;
  }

  const baseString = \`v0:\${timestamp}:\${body}\`;
  const expected = "v0=" + crypto
    .createHmac("sha256", signingSecret)
    .update(baseString)
    .digest("hex");

  // Timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false; // buffers of different length
  }
}

// ─── Step 2: Deduplication ────────────────────────────────────────────────────

async function deduplicate(teamId: string, slackTs: string): Promise<boolean> {
  const key = \`dedupe:slack:\${teamId}:\${slackTs}\`;
  const result = await redis.set(key, "1", "NX", "EX", 600); // 10-minute TTL
  return result === "OK"; // true = new, false = duplicate
}

// ─── Step 3: Queue ────────────────────────────────────────────────────────────

const queue = new Queue<SlackWebhookPayload>("slack-pipeline", {
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: { age: 3600 }, // keep 1h for dedup protection
    removeOnFail: { age: 86400 },
  },
});

async function enqueue(payload: SlackWebhookPayload): Promise<string> {
  const jobId = payload.event.ts; // Slack TS as idempotency key
  const isDM = payload.event.channel.startsWith("D");

  await queue.add("process-slack-message", payload, {
    jobId,
    priority: isDM ? 1 : 10, // DMs are higher priority
  });

  return jobId;
}

// ─── Step 4-5: Worker ─────────────────────────────────────────────────────────

async function stubClaudeDraft(text: string): Promise<string> {
  // In production: call Anthropic API or OpenClaw gateway
  return \`Suggested response: "Thank you for reaching out about '\${text.slice(0, 30)}...'. I'll look into this."\`;
}

async function processJob(job: Job<SlackWebhookPayload>): Promise<string> {
  const { team_id, event } = job.data;

  // Call Claude to generate draft
  const draft = await stubClaudeDraft(event.text);

  // Store draft in Redis hash for the approval workflow
  const draftKey = \`draft:slack:\${team_id}:\${event.ts}\`;
  await redis.hset(draftKey, {
    draft,
    status: "pending_approval",
    channel: event.channel,
    userId: event.user,
    generatedAt: new Date().toISOString(),
  });
  await redis.expire(draftKey, 86400); // expire after 24h

  console.log(\`Draft stored at \${draftKey}:\`, draft);

  // In production: post to internal approval Slack channel
  // await slackClient.chat.postMessage({ channel: APPROVAL_CHANNEL, text: draft, ... });

  return draft;
}

const worker = new Worker<SlackWebhookPayload, string>(
  "slack-pipeline",
  processJob,
  { connection: redis, concurrency: 5 }
);

worker.on("completed", (job, result) => {
  console.log(\`Job \${job.id} completed. Draft ready for approval.\`);
});

worker.on("failed", (job, error) => {
  console.error(\`Job \${job?.id} failed (attempt \${job?.attemptsMade}): \${error.message}\`);
  if (job && job.attemptsMade >= (job.opts.attempts ?? 3)) {
    console.error(\`Job \${job.id} exhausted retries — manual intervention required\`);
  }
});

// ─── Orchestrator ─────────────────────────────────────────────────────────────

async function handleWebhook(
  rawBody: string,
  timestamp: string,
  signature: string
): Promise<PipelineResult> {
  // Step 1: Verify Slack signature
  const isValid = verifySlackSignature(rawBody, timestamp, signature, SIGNING_SECRET);
  if (!isValid) {
    return { status: "rejected", reason: "Invalid signature or stale timestamp" };
  }

  const payload: SlackWebhookPayload = JSON.parse(rawBody);

  // Step 2: Dedup check
  const isNew = await deduplicate(payload.team_id, payload.event.ts);
  if (!isNew) {
    console.log(\`Duplicate webhook for \${payload.event.ts} — returning 200 to stop Slack retries\`);
    return { status: "duplicate" };
  }

  // Step 3: Enqueue for processing
  const jobId = await enqueue(payload);
  console.log(\`Enqueued job \${jobId} for message "\${payload.event.text.slice(0, 40)}..."\`);

  return { status: "processed", jobId };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const payload: SlackWebhookPayload = {
    team_id: "T024BE7LD",
    event: {
      ts: "1741564800.123456",
      text: "Can you help with the Q4 board report?",
      channel: "C024BE7LD",
      user: "U024BE7LD",
      type: "message",
    },
  };

  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sig = "v0=" + crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(\`v0:\${timestamp}:\${body}\`)
    .digest("hex");

  // First webhook arrival
  const result1 = await handleWebhook(body, timestamp, sig);
  console.log("First webhook:", result1);
  // { status: "processed", jobId: "1741564800.123456" }

  // Duplicate webhook (Slack retry)
  const result2 = await handleWebhook(body, timestamp, sig);
  console.log("Duplicate webhook:", result2);
  // { status: "duplicate" }

  // Wait for worker to process
  await new Promise((r) => setTimeout(r, 2000));

  // Verify draft was stored
  const draftKey = \`draft:slack:T024BE7LD:1741564800.123456\`;
  const draft = await redis.hgetall(draftKey);
  console.log("Stored draft:", draft);

  await worker.close();
  await redis.quit();
}

main().catch(console.error);
`,
    },
  ],
};
