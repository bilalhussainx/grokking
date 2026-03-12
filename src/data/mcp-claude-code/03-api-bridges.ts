import { Module } from "../types";

export const apiBridgesModule: Module = {
  id: "api-bridges",
  title: "API Bridges & Integration Patterns",
  description:
    "Build production-grade bridges between Slack, Microsoft Teams, and Missive. Learn OAuth 2.0, Bolt.js, bidirectional message routing, deduplication, and resilience patterns — all directly relevant to the codeswitcher integration role.",
  lessons: [
    {
      id: "slack-api-bolt",
      slug: "slack-api-bolt",
      title: "Slack API & Bolt Framework",
      content: `## Slack API & Bolt Framework

The Slack platform exposes three complementary APIs: the **Events API** (inbound webhooks Slack pushes to you), the **Web API** (REST calls you make to Slack), and **Socket Mode** (a WebSocket alternative for dev environments behind a firewall). For production bridges you combine all three.

### Events API Flow

When a user posts a message in a Slack channel your app is subscribed to, Slack sends an HTTP POST to your configured **Request URL** within 3 seconds. Your server must respond with HTTP 200 in that window, or Slack retries up to three times with exponential backoff.

\`\`\`
User types message
      ↓
Slack Events API → POST https://your-server.com/slack/events
      ↓
Your server responds 200 (immediately)
      ↓
Your server processes and forwards to Missive
\`\`\`

Key event types for a messaging bridge:

| Event | When it fires |
|-------|--------------|
| \`message.channels\` | Any message in a public channel the bot is in |
| \`message.groups\` | Private channel messages |
| \`app_mention\` | Any message that @-mentions your bot |
| \`message.im\` | Direct messages to the bot |

### Bolt.js Framework

Bolt.js is Slack's official Node.js SDK. It handles request signature verification (HMAC-SHA256), event routing, and retries automatically.

\`\`\`javascript
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,       // Bot User OAuth Token
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listen for any message in channels the bot is in
app.message(async ({ message, say }) => {
  console.log(\`Received: \${message.text} from \${message.user}\`);
  await say({ text: \`Got it, <@\${message.user}>!\` });
});

(async () => {
  await app.start(3000);
})();
\`\`\`

### Sending Messages & Rich Blocks

The Web API \`chat.postMessage\` supports plain text, markdown, and **Block Kit** — Slack's JSON UI framework for rich cards, buttons, and dropdowns.

\`\`\`javascript
await app.client.chat.postMessage({
  channel: 'C12345678',
  text: 'Fallback for notifications',
  blocks: [
    {
      type: 'section',
      text: { type: 'mrkdwn', text: '*New message from Missive:*\\n> Hello from the other side' },
    },
  ],
});
\`\`\`

### Threading

To reply in-thread instead of posting a new top-level message, pass \`thread_ts\` equal to the parent message's \`ts\` (timestamp):

\`\`\`javascript
await app.client.chat.postMessage({
  channel: message.channel,
  thread_ts: message.ts,   // keeps it in-thread
  text: 'Reply in thread',
});
\`\`\`

### Request Signature Verification

Every inbound Slack request includes \`X-Slack-Signature\` and \`X-Slack-Request-Timestamp\` headers. Bolt verifies these automatically. If you ever build a raw Express endpoint instead, you must verify manually using \`@slack/bolt\`'s \`verifySlackRequest\` or compute the HMAC yourself — **never skip this step** in production.

### Exercise

Implement a Bolt.js event handler that receives a \`message\` event, extracts the text, channel, and user, then forwards the payload to a mock Missive endpoint using \`fetch\`. Log the Missive response status.`,
      starterCode: `// Slack → Missive forwarder using Bolt.js
// Run: SLACK_BOT_TOKEN=xoxb-... SLACK_SIGNING_SECRET=... node solution.js

const { App } = require('@slack/bolt');

const MISSIVE_API_URL = 'https://mock-missive.example.com/api/v1/conversations';
const MISSIVE_API_TOKEN = process.env.MISSIVE_API_TOKEN || 'mock-token';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN || 'xoxb-mock',
  signingSecret: process.env.SLACK_SIGNING_SECRET || 'mock-secret',
});

// TODO: Listen for all messages in channels the bot is in.
// For each message event:
//   1. Skip bot messages (message.bot_id should be falsy)
//   2. Extract: text, channel, user, ts (timestamp)
//   3. Forward to MISSIVE_API_URL as a POST with JSON body:
//      { source: 'slack', channel, userId: user, text, slackTs: ts }
//      Authorization: Bearer <MISSIVE_API_TOKEN>
//   4. Log: "Forwarded to Missive: <status>"

app.message(async ({ message, logger }) => {
  // your implementation here
});

(async () => {
  await app.start(3000);
  console.log('Slack bridge listening on :3000');
})();
`,
      solutionCode: `// Slack → Missive forwarder using Bolt.js

const { App } = require('@slack/bolt');

const MISSIVE_API_URL = 'https://mock-missive.example.com/api/v1/conversations';
const MISSIVE_API_TOKEN = process.env.MISSIVE_API_TOKEN || 'mock-token';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN || 'xoxb-mock',
  signingSecret: process.env.SLACK_SIGNING_SECRET || 'mock-secret',
});

app.message(async ({ message, logger }) => {
  // 1. Skip bot/system messages
  if (message.bot_id || message.subtype) {
    return;
  }

  // 2. Extract fields
  const { text, channel, user, ts } = message;

  // 3. Forward to Missive
  try {
    const response = await fetch(MISSIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${MISSIVE_API_TOKEN}\`,
      },
      body: JSON.stringify({
        source: 'slack',
        channel,
        userId: user,
        text,
        slackTs: ts,
      }),
    });

    // 4. Log the result
    logger.info(\`Forwarded to Missive: \${response.status}\`);

    if (!response.ok) {
      const body = await response.text();
      logger.error(\`Missive error: \${body}\`);
    }
  } catch (err) {
    logger.error(\`Failed to reach Missive: \${err.message}\`);
  }
});

(async () => {
  await app.start(3000);
  console.log('Slack bridge listening on :3000');
})();
`,
    },
    {
      id: "microsoft-graph-oauth",
      slug: "microsoft-graph-oauth",
      title: "Microsoft Graph API & OAuth 2.0",
      content: `## Microsoft Graph API & OAuth 2.0

Microsoft Graph is the single REST endpoint for all Microsoft 365 data — Teams messages, calendar events, OneDrive files, and more. Understanding how to authenticate against it is essential for any Teams integration.

### OAuth 2.0 Authorization Code Flow

This is the standard three-legged flow for acting on behalf of a user:

\`\`\`
1. Your app redirects user to Microsoft login:
   GET https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
       ?client_id=YOUR_CLIENT_ID
       &response_type=code
       &redirect_uri=https://your-app.com/auth/callback
       &scope=https://graph.microsoft.com/ChannelMessage.Read.All offline_access
       &state=random-csrf-token

2. User logs in and consents → Microsoft redirects back:
   GET https://your-app.com/auth/callback?code=AUTH_CODE&state=...

3. Your server exchanges the code for tokens:
   POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
   Body: grant_type=authorization_code&code=AUTH_CODE&...

4. Microsoft returns:
   { access_token, expires_in: 3600, refresh_token, ... }
\`\`\`

### Token Lifecycle

Access tokens expire after **1 hour**. The \`refresh_token\` lasts 90 days (rolling). Your bridge must silently refresh before each API call if the token is near expiry.

\`\`\`javascript
async function getValidToken(storedTokens) {
  const expiresAt = storedTokens.issuedAt + storedTokens.expiresIn * 1000;
  const bufferMs = 5 * 60 * 1000; // refresh 5 min early

  if (Date.now() < expiresAt - bufferMs) {
    return storedTokens.accessToken; // still valid
  }

  return refreshAccessToken(storedTokens.refreshToken);
}
\`\`\`

### Reading Teams Messages via Graph

\`\`\`javascript
// List messages in a Teams channel
GET https://graph.microsoft.com/v1.0/teams/{teamId}/channels/{channelId}/messages
Authorization: Bearer {access_token}

// Response
{
  "value": [
    {
      "id": "1234567890",
      "body": { "content": "Hello from Teams!", "contentType": "text" },
      "from": { "user": { "displayName": "Bob", "id": "user-id" } },
      "createdDateTime": "2026-03-11T10:00:00Z"
    }
  ]
}
\`\`\`

### Sending a Teams Message

\`\`\`javascript
POST https://graph.microsoft.com/v1.0/teams/{teamId}/channels/{channelId}/messages
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "body": { "contentType": "html", "content": "<b>Bridged from Missive:</b> Hello!" }
}
\`\`\`

### Required Scopes

| Scope | Purpose |
|-------|---------|
| \`ChannelMessage.Read.All\` | Read channel messages |
| \`ChannelMessage.Send\` | Post messages |
| \`offline_access\` | Obtain a refresh token |
| \`User.Read\` | Read the signed-in user's profile |

### Change Notifications (Webhooks)

Rather than polling, use Graph's **change notifications** (subscriptions) to receive a POST to your endpoint whenever a new Teams message is created. Subscriptions expire after 60 minutes for Teams messages and must be renewed.

### Exercise

Implement a \`refreshAccessToken(refreshToken)\` function that POSTs to the Microsoft token endpoint and returns a new \`{ accessToken, expiresIn, newRefreshToken }\` object. Use a mocked \`fetch\` in the tests.`,
      starterCode: `// Microsoft Graph OAuth 2.0 token refresh
// This function is called when the stored access token is about to expire.

const TOKEN_ENDPOINT =
  'https://login.microsoftonline.com/YOUR_TENANT_ID/oauth2/v2.0/token';
const CLIENT_ID = process.env.AZURE_CLIENT_ID || 'mock-client-id';
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET || 'mock-secret';

/**
 * Exchange a refresh_token for a new access_token.
 * @param {string} refreshToken
 * @returns {Promise<{ accessToken: string, expiresIn: number, newRefreshToken: string }>}
 */
async function refreshAccessToken(refreshToken) {
  // TODO:
  // 1. Build a URLSearchParams body with:
  //    grant_type: 'refresh_token'
  //    refresh_token: refreshToken
  //    client_id: CLIENT_ID
  //    client_secret: CLIENT_SECRET
  //    scope: 'https://graph.microsoft.com/.default offline_access'
  // 2. POST to TOKEN_ENDPOINT with Content-Type: application/x-www-form-urlencoded
  // 3. Parse JSON response
  // 4. If response has 'error', throw new Error(response.error_description)
  // 5. Return { accessToken, expiresIn, newRefreshToken }
}

// --- Tests (uses a mock fetch) ---
global.fetch = async (url, options) => {
  const body = options.body.toString();
  if (body.includes('valid-refresh-token')) {
    return {
      ok: true,
      json: async () => ({
        access_token: 'new-access-token-abc',
        expires_in: 3600,
        refresh_token: 'new-refresh-token-xyz',
      }),
    };
  }
  return {
    ok: false,
    json: async () => ({
      error: 'invalid_grant',
      error_description: 'Refresh token has expired or is invalid',
    }),
  };
};

// Test 1: successful refresh
refreshAccessToken('valid-refresh-token').then((tokens) => {
  console.log(tokens.accessToken);      // Expected: 'new-access-token-abc'
  console.log(tokens.expiresIn);        // Expected: 3600
  console.log(tokens.newRefreshToken);  // Expected: 'new-refresh-token-xyz'
});

// Test 2: expired/invalid refresh token
refreshAccessToken('expired-token').catch((err) => {
  console.log(err.message); // Expected: 'Refresh token has expired or is invalid'
});
`,
      solutionCode: `// Microsoft Graph OAuth 2.0 token refresh

const TOKEN_ENDPOINT =
  'https://login.microsoftonline.com/YOUR_TENANT_ID/oauth2/v2.0/token';
const CLIENT_ID = process.env.AZURE_CLIENT_ID || 'mock-client-id';
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET || 'mock-secret';

/**
 * Exchange a refresh_token for a new access_token.
 */
async function refreshAccessToken(refreshToken) {
  // 1. Build form body
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default offline_access',
  });

  // 2. POST to token endpoint
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  // 3. Parse response
  const data = await response.json();

  // 4. Handle errors
  if (!response.ok || data.error) {
    throw new Error(data.error_description || data.error || 'Token refresh failed');
  }

  // 5. Return normalized shape
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    newRefreshToken: data.refresh_token,
  };
}

// --- Tests (uses a mock fetch) ---
global.fetch = async (url, options) => {
  const body = options.body.toString();
  if (body.includes('valid-refresh-token')) {
    return {
      ok: true,
      json: async () => ({
        access_token: 'new-access-token-abc',
        expires_in: 3600,
        refresh_token: 'new-refresh-token-xyz',
      }),
    };
  }
  return {
    ok: false,
    json: async () => ({
      error: 'invalid_grant',
      error_description: 'Refresh token has expired or is invalid',
    }),
  };
};

// Test 1: successful refresh
refreshAccessToken('valid-refresh-token').then((tokens) => {
  console.log(tokens.accessToken);      // Expected: 'new-access-token-abc'
  console.log(tokens.expiresIn);        // Expected: 3600
  console.log(tokens.newRefreshToken);  // Expected: 'new-refresh-token-xyz'
});

// Test 2: expired/invalid refresh token
refreshAccessToken('expired-token').catch((err) => {
  console.log(err.message); // Expected: 'Refresh token has expired or is invalid'
});
`,
    },
    {
      id: "bidirectional-bridge",
      slug: "bidirectional-bridge",
      title: "Bidirectional Bridge Architecture",
      content: `## Bidirectional Bridge Architecture

A bidirectional bridge synchronizes messages between two platforms in real time. The core challenge is that each platform has its own message schema, and messages can originate from either side — so you need a **canonical format** in the middle to avoid coupling the two systems directly.

### High-Level Architecture

\`\`\`
Slack ──webhook──▶ [Slack Listener]
                          │
                    normalize()
                          │
                          ▼
                   [Canonical Message]
                          │
                    serialize()
                          │
                          ▼
                   [Missive API]

Missive ──webhook──▶ [Missive Listener]
                          │
                    normalize()
                          │
                          ▼
                   [Canonical Message]
                          │
                    serialize()
                          │
                          ▼
                   [Slack Web API]
\`\`\`

### Canonical Message Schema

Define a platform-agnostic schema that both adapters read and write:

\`\`\`javascript
const canonicalMessage = {
  id: 'uuid-v4',              // your bridge-generated ID
  externalId: 'slack:C123|1741699200.000100', // platform:channel|ts
  source: 'slack',            // 'slack' | 'teams' | 'missive'
  authorId: 'U12345',
  authorName: 'Alice',
  text: 'Hello from Slack',
  channelId: 'C12345678',
  channelName: 'general',
  timestamp: '2026-03-11T10:00:00.000Z',
  threadId: null,             // externalId of parent, if threaded
  attachments: [],
};
\`\`\`

### Deduplication — Preventing Infinite Loops

Without deduplication, a message forwarded from Slack to Missive triggers a Missive webhook, which forwards back to Slack, which triggers again — infinite loop.

**Solution:** maintain a small in-memory (or Redis) set of recently processed message IDs. Before forwarding, check whether you already handled this ID:

\`\`\`javascript
const processedIds = new Set();

function isDuplicate(externalId) {
  if (processedIds.has(externalId)) return true;
  processedIds.add(externalId);
  // Evict old IDs after 5 minutes to keep memory bounded
  setTimeout(() => processedIds.delete(externalId), 5 * 60 * 1000);
  return false;
}
\`\`\`

When you post a message to a platform on behalf of the bridge, tag it (e.g., a bot username or metadata field) so the listener on that side can identify and skip it.

### Retry Logic with Exponential Backoff

Outbound API calls will occasionally fail with transient errors (rate limits, timeouts). Use exponential backoff:

\`\`\`javascript
async function withRetry(fn, maxAttempts = 4, baseDelayMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1); // 500, 1000, 2000 ms
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
\`\`\`

### Dead Letter Queue

Messages that fail all retry attempts should not be silently dropped. Write them to a **dead letter queue** (DLQ) — at minimum a local file or Redis list — so they can be inspected, replayed, or alerted on:

\`\`\`javascript
async function forwardWithDLQ(canonicalMsg) {
  try {
    await withRetry(() => sendToMissive(canonicalMsg));
  } catch (err) {
    await dlq.push({ message: canonicalMsg, error: err.message, failedAt: new Date() });
    alertOps(\`Bridge DLQ: message \${canonicalMsg.id} failed permanently\`);
  }
}
\`\`\`

### Exercise

Implement a \`normalizeSlackMessage(slackEvent)\` function that converts a raw Slack message event into the canonical schema above, and a \`serializeToMissive(canonical)\` function that converts the canonical message into a Missive conversation POST body.`,
      starterCode: `// Message normalizer: Slack → Canonical → Missive

/**
 * Canonical message schema (what the bridge uses internally)
 * @typedef {{
 *   id: string,
 *   externalId: string,
 *   source: string,
 *   authorId: string,
 *   text: string,
 *   channelId: string,
 *   timestamp: string,
 *   threadId: string | null,
 * }} CanonicalMessage
 */

const { v4: uuidv4 } = { v4: () => 'mock-uuid-1234' }; // mock for exercise

/**
 * Convert a raw Slack message event to a canonical message.
 * @param {object} slackEvent - The event object from Slack's Events API
 * @returns {CanonicalMessage}
 */
function normalizeSlackMessage(slackEvent) {
  // TODO:
  // slackEvent shape:
  //   { type: 'message', text, user, channel, ts, thread_ts? }
  //
  // externalId should be: "slack:<channel>|<ts>"
  // threadId should be: "slack:<channel>|<thread_ts>" if thread_ts exists and differs from ts
  // timestamp: convert Slack's Unix float ts to ISO 8601
}

/**
 * Convert a canonical message to a Missive conversation POST body.
 * @param {CanonicalMessage} canonical
 * @returns {object} - Body for POST /api/v1/conversations
 */
function serializeToMissive(canonical) {
  // TODO:
  // Missive expects:
  //   {
  //     subject: "Slack: <channelId>",
  //     body: canonical.text,
  //     external_id: canonical.externalId,
  //     from_field: { name: canonical.authorId },
  //     via: "integration",
  //   }
  // If canonical.threadId is set, include: in_reply_to: canonical.threadId
}

// --- Tests ---
const slackEvent1 = {
  type: 'message',
  text: 'Hello from Slack!',
  user: 'U12345',
  channel: 'C98765',
  ts: '1741699200.000100',
};

const canonical1 = normalizeSlackMessage(slackEvent1);
console.log(canonical1.source);       // Expected: 'slack'
console.log(canonical1.externalId);   // Expected: 'slack:C98765|1741699200.000100'
console.log(canonical1.authorId);     // Expected: 'U12345'
console.log(canonical1.text);         // Expected: 'Hello from Slack!'
console.log(canonical1.threadId);     // Expected: null

const slackEvent2 = {
  type: 'message',
  text: 'Threaded reply',
  user: 'U99999',
  channel: 'C98765',
  ts: '1741699300.000200',
  thread_ts: '1741699200.000100',
};

const canonical2 = normalizeSlackMessage(slackEvent2);
console.log(canonical2.threadId);     // Expected: 'slack:C98765|1741699200.000100'

const missiveBody = serializeToMissive(canonical1);
console.log(missiveBody.subject);     // Expected: 'Slack: C98765'
console.log(missiveBody.body);        // Expected: 'Hello from Slack!'
console.log(missiveBody.via);         // Expected: 'integration'
console.log(missiveBody.in_reply_to); // Expected: undefined
`,
      solutionCode: `// Message normalizer: Slack → Canonical → Missive

const { v4: uuidv4 } = { v4: () => 'mock-uuid-1234' }; // mock for exercise

function normalizeSlackMessage(slackEvent) {
  const { text, user, channel, ts, thread_ts } = slackEvent;

  // Build externalId
  const externalId = \`slack:\${channel}|\${ts}\`;

  // Build threadId only when this message IS a reply (thread_ts differs from ts)
  const threadId =
    thread_ts && thread_ts !== ts
      ? \`slack:\${channel}|\${thread_ts}\`
      : null;

  // Convert Slack's Unix float (seconds.microseconds) to ISO 8601
  const timestamp = new Date(parseFloat(ts) * 1000).toISOString();

  return {
    id: uuidv4(),
    externalId,
    source: 'slack',
    authorId: user,
    text: text || '',
    channelId: channel,
    timestamp,
    threadId,
  };
}

function serializeToMissive(canonical) {
  const body = {
    subject: \`Slack: \${canonical.channelId}\`,
    body: canonical.text,
    external_id: canonical.externalId,
    from_field: { name: canonical.authorId },
    via: 'integration',
  };

  if (canonical.threadId) {
    body.in_reply_to = canonical.threadId;
  }

  return body;
}

// --- Tests ---
const slackEvent1 = {
  type: 'message',
  text: 'Hello from Slack!',
  user: 'U12345',
  channel: 'C98765',
  ts: '1741699200.000100',
};

const canonical1 = normalizeSlackMessage(slackEvent1);
console.log(canonical1.source);       // Expected: 'slack'
console.log(canonical1.externalId);   // Expected: 'slack:C98765|1741699200.000100'
console.log(canonical1.authorId);     // Expected: 'U12345'
console.log(canonical1.text);         // Expected: 'Hello from Slack!'
console.log(canonical1.threadId);     // Expected: null

const slackEvent2 = {
  type: 'message',
  text: 'Threaded reply',
  user: 'U99999',
  channel: 'C98765',
  ts: '1741699300.000200',
  thread_ts: '1741699200.000100',
};

const canonical2 = normalizeSlackMessage(slackEvent2);
console.log(canonical2.threadId);     // Expected: 'slack:C98765|1741699200.000100'

const missiveBody = serializeToMissive(canonical1);
console.log(missiveBody.subject);     // Expected: 'Slack: C98765'
console.log(missiveBody.body);        // Expected: 'Hello from Slack!'
console.log(missiveBody.via);         // Expected: 'integration'
console.log(missiveBody.in_reply_to); // Expected: undefined
`,
    },
    {
      id: "bridge-resilience",
      slug: "bridge-resilience",
      title: "Resilience & Failure Modes",
      content: `## Resilience & Failure Modes

> **This was asked verbatim in the codeswitcher preliminary interview:** "What happens if Missive goes down for 10 minutes? How do you make sure no messages are lost?"

The answer demonstrates the difference between a junior "I'd retry it" response and a senior "here's the full architecture" response.

### The Core Problem

Your bridge is stateless by default. If Missive returns 503 at 2:00 AM and your retry logic gives up after 3 attempts, those messages are gone. Users on Slack or Teams sent them — they showed as delivered in their client — but Missive never received them.

### Queue-Based Architecture

The fix is to **never call Missive synchronously from the webhook handler**. Instead:

1. Webhook arrives → push raw payload into a **durable queue** (BullMQ backed by Redis)
2. A **worker process** dequeues and calls Missive
3. If Missive is down, BullMQ keeps the job in the queue with exponential backoff
4. When Missive recovers, the worker drains the queue automatically — no messages lost

\`\`\`javascript
// Producer (webhook handler — returns 200 immediately)
const { Queue } = require('bullmq');
const messageQueue = new Queue('bridge-messages', { connection: redisConnection });

app.post('/slack/events', async (req, res) => {
  res.sendStatus(200); // acknowledge Slack immediately
  await messageQueue.add('forward', req.body, {
    attempts: 10,
    backoff: { type: 'exponential', delay: 1000 },
  });
});

// Consumer (separate worker process)
const { Worker } = require('bullmq');
new Worker('bridge-messages', async (job) => {
  const canonical = normalizeSlackMessage(job.data.event);
  await sendToMissive(canonical);
}, { connection: redisConnection });
\`\`\`

### Circuit Breaker Pattern

A circuit breaker prevents your worker from hammering a down Missive instance with thousands of requests per second. It has three states:

| State | Behavior |
|-------|----------|
| **Closed** | Normal operation — requests pass through |
| **Open** | Missive is down — requests fail immediately, no API calls |
| **Half-Open** | After a timeout, allow one test request; if it succeeds, close the circuit |

Libraries like \`opossum\` implement this in Node.js:

\`\`\`javascript
const CircuitBreaker = require('opossum');

const breaker = new CircuitBreaker(sendToMissive, {
  timeout: 5000,        // call fails if Missive takes >5s
  errorThresholdPercentage: 50,  // open if >50% of calls fail
  resetTimeout: 30000,  // try again after 30s
});

breaker.on('open', () => console.error('Circuit open: Missive unreachable'));
breaker.on('close', () => console.log('Circuit closed: Missive recovered'));
\`\`\`

### Health Checks & Heartbeats

Your VPS deployment should expose a \`/health\` endpoint that PM2 or your load balancer can poll:

\`\`\`javascript
app.get('/health', async (req, res) => {
  const queueSize = await messageQueue.getWaitingCount();
  const circuitState = breaker.status.state;

  res.json({
    status: circuitState === 'open' ? 'degraded' : 'ok',
    queueDepth: queueSize,
    circuit: circuitState,
    uptime: process.uptime(),
  });
});
\`\`\`

### VPS Deployment with PM2

PM2 is the standard process manager for Node.js on a VPS. It handles auto-restart on crash, log rotation, and cluster mode.

\`\`\`bash
# Start the bridge
pm2 start bridge.js --name slack-missive-bridge

# Auto-start on server reboot
pm2 startup
pm2 save

# Watch logs
pm2 logs slack-missive-bridge
\`\`\`

For systemd instead:

\`\`\`ini
[Unit]
Description=Slack-Missive Bridge
After=network.target redis.service

[Service]
ExecStart=/usr/bin/node /opt/bridge/bridge.js
Restart=always
RestartSec=5
EnvironmentFile=/opt/bridge/.env

[Install]
WantedBy=multi-user.target
\`\`\`

### Interview-Ready Answers

**"What happens if Missive is down for 10 minutes?"**
Messages are written to a Redis-backed BullMQ queue immediately when the webhook arrives. The worker process retries with exponential backoff. A circuit breaker stops individual retries from stacking up. When Missive recovers, the queue drains automatically. Zero messages are lost as long as Redis itself is healthy.

**"How do you ensure no messages are lost?"**
Three layers: (1) durable queue — messages survive process restarts because Redis persists them; (2) BullMQ's built-in retry with configurable backoff and max attempts; (3) dead letter queue for messages that fail all attempts, with an alert to the on-call engineer. The webhook handler always returns 200 immediately so Slack never retries its own delivery.

**"What if Redis goes down?"**
For absolute durability, back Redis with a replica or use Redis Sentinel/Cluster. For a smaller deployment, consider a Postgres-backed queue (pg-boss) which stores jobs in a table with ACID guarantees.

### No Code Exercise

This lesson is conceptual — study the patterns above and be ready to whiteboard the queue-based architecture. The real test is whether you can explain the tradeoffs: queue depth vs. latency, circuit breaker thresholds, and why synchronous webhook forwarding is always wrong for production bridges.`,
    },
  ],
};
