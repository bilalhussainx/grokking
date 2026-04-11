import { Module } from "../types";

export const notificationSystemModule: Module = {
  id: "sd-08",
  title: "Design a Notification System",
  description: "Design a scalable notification system supporting push notifications, SMS, and email with user preferences and rate limiting.",
  lessons: [
    {
      id: "sd-08-01",
      slug: "notification-system-requirements",
      title: "Requirements & Estimation",
      content: `# Notification System: Requirements & Estimation

## What Does a Notification System Do?

A notification system delivers messages to users through multiple channels: mobile push notifications (iOS and Android), SMS text messages, and email. Services like e-commerce platforms, social media apps, and banking apps all rely on notification systems to keep users informed.

\`\`\`concept
{
  "title": "At-least-once vs At-most-once Delivery",
  "variant": "mental-model",
  "content": "Think of notification delivery like mailing a package:\\n\\n**At-least-once**: You keep sending copies until you get a delivery confirmation. The recipient might get 2-3 identical packages, but they definitely get at least one.\\n\\n**At-most-once**: You send one package and never check if it arrived. If it gets lost, that's it.\\n\\nFor critical notifications (OTP codes, security alerts), at-least-once is preferred — a duplicate is better than a missed notification."
}
\`\`\`

## Functional Requirements

1. **Multi-channel delivery** — Support iOS push (APNs), Android push (FCM), SMS, and email.
2. **User preferences** — Users can opt in or out of specific notification types per channel.
3. **Templates** — Notifications use pre-defined templates with variable substitution (e.g., "Hi {{name}}, your order {{orderId}} has shipped").
4. **Rate limiting** — Prevent notification fatigue by limiting how many notifications a user receives in a given time window.
5. **Scheduling** — Support sending notifications at a future time or within a user's preferred time zone window.
6. **Tracking** — Track delivery status (sent, delivered, opened, clicked, failed).

\`\`\`quiz
{
  "title": "Functional Requirements Check",
  "questions": [
    {
      "question": "Which functional requirement helps prevent users from receiving too many notifications?",
      "options": ["Multi-channel delivery", "Rate limiting", "Templates", "Scheduling"],
      "answer": 1,
      "explanation": "Rate limiting prevents notification fatigue by controlling how many notifications a user receives in a given time window."
    },
    {
      "question": "What is the primary purpose of notification templates?",
      "options": ["To reduce storage costs", "To standardize message format with variable substitution", "To improve delivery speed", "To track user engagement"],
      "answer": 1,
      "explanation": "Templates allow consistent message formatting while supporting personalization through variable substitution like {{name}} or {{orderId}}."
    },
    {
      "question": "Which delivery status tracking metric is most valuable for measuring user engagement?",
      "options": ["Sent", "Delivered", "Opened", "Failed"],
      "answer": 2,
      "explanation": "Opened status indicates user engagement — they actually viewed the notification rather than just receiving it."
    }
  ]
}
\`\`\`

## Non-Functional Requirements

- **Reliability** — A notification should not be lost. Prefer at-least-once delivery over at-most-once.
- **Low latency** — Time-sensitive notifications (OTP codes, security alerts) must arrive within seconds.
- **Scalability** — Handle millions of notifications per day.
- **Extensibility** — Easy to add new channels (e.g., WhatsApp, Slack) in the future.

\`\`\`callout
{
  "type": "warning",
  "title": "Critical Trade-off: Latency vs Cost",
  "content": "Achieving extremely low latency for ALL notifications across ALL channels can significantly increase infrastructure costs. Smart systems prioritize critical notifications (OTPs, security alerts) for immediate delivery while batching promotional messages during off-peak hours."
}
\`\`\`

## Back-of-the-Envelope Estimation

Assume a platform with **100 million users**, where each user receives an average of **3 notifications per day**.

| Metric | Calculation |
|--------|------------|
| Daily notifications | 100M x 3 = **300 million/day** |
| Per second (avg) | 300M / 86,400 ≈ **~3,470/sec** |
| Peak (5x average) | **~17,350/sec** |
| Push notifications (60%) | 180M/day |
| Email (30%) | 90M/day |
| SMS (10%) | 30M/day |
| Storage (delivery logs) | 300M x 200 bytes = **~60 GB/day** |

SMS is the most expensive channel (typically $0.01-0.05 per message), so rate limiting SMS is also a cost-control measure.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "SMS Cost Calculator",
  "inputs": [
    { "id": "daily_sms", "label": "Daily SMS Volume", "default": 30000000, "min": 1000000, "max": 100000000 },
    { "id": "cost_per_sms", "label": "Cost per SMS", "default": 0.02, "min": 0.01, "max": 0.05, "prefix": "$" }
  ]
}
\`\`\`

\`\`\`steps
{
  "title": "Estimation Process for Notification Systems",
  "steps": [
    {
      "title": "Start with User Base",
      "content": "Begin with your total registered users (100M in our example). Consider what percentage are daily active users (DAU) — this affects realistic notification volumes."
    },
    {
      "title": "Calculate Daily Volume",
      "content": "Multiply user count by average notifications per user per day. Industry benchmarks suggest 2-5 notifications per user daily for most apps."
    },
    {
      "title": "Convert to Per-Second Rate",
      "content": "Divide daily volume by 86,400 seconds/day for average rate. Multiply by 3-5x for peak rate estimation — notifications often cluster during business hours or events."
    },
    {
      "title": "Break Down by Channel",
      "content": "Distribute total volume across channels based on business needs. Push notifications typically dominate (60-70%), followed by email (20-30%), with SMS as premium channel (5-15%)."
    },
    {
      "title": "Estimate Storage Impact",
      "content": "Each delivery log entry requires ~200 bytes. Multiply by daily volume for storage needs, then multiply by retention period (typically 30-90 days) for total storage capacity planning."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "A notification system must support multiple delivery channels, each with its own third-party provider.",
    "At-least-once delivery is preferred — a duplicate notification is better than a missed one.",
    "Rate limiting serves two purposes: protecting user experience and controlling costs (especially SMS).",
    "User preferences must be checked before every send to comply with opt-out requirements.",
    "Delivery tracking is essential for analytics and debugging failed notifications."
  ]
}
\`\`\``,
    },
    {
      id: "sd-08-02",
      slug: "notification-system-high-level-design",
      title: "High-Level Design",
      content: `# Notification System: High-Level Design

## Architecture Overview

The system accepts notification requests from various internal services, processes them through a pipeline, and delivers them via channel-specific providers.

\`\`\`sysdiag
{"title":"Notification System High-Level Flow","width":800,"height":400,
"nodes":[
{"id":"src","label":"Event Sources","x":80,"y":200,"kind":"service"},
{"id":"api","label":"Notification API","x":220,"y":200,"kind":"service"},
{"id":"prefs","label":"User Prefs","x":220,"y":100,"kind":"database"},
{"id":"rl","label":"Rate Limiter","x":220,"y":300,"kind":"service"},
{"id":"queue","label":"Message Queue","x":360,"y":200,"kind":"queue"},
{"id":"router","label":"Channel Router","x":500,"y":200,"kind":"service"},
{"id":"email","label":"Email Worker","x":640,"y":100,"kind":"service"},
{"id":"sms","label":"SMS Worker","x":640,"y":200,"kind":"service"},
{"id":"push","label":"Push Worker","x":640,"y":300,"kind":"service"},
{"id":"ses","label":"SES/SMTP","x":780,"y":100,"kind":"external"},
{"id":"twilio","label":"Twilio","x":780,"y":200,"kind":"external"},
{"id":"fcm","label":"FCM/APNs","x":780,"y":300,"kind":"external"}
],
"edges":[
{"from":"src","to":"api","label":"request"},
{"from":"api","to":"prefs","label":"check"},
{"from":"api","to":"rl","label":"check"},
{"from":"api","to":"queue","label":"enqueue"},
{"from":"queue","to":"router","label":"dequeue"},
{"from":"router","to":"email","label":"route"},
{"from":"router","to":"sms","label":"route"},
{"from":"router","to":"push","label":"route"},
{"from":"email","to":"ses","label":"send"},
{"from":"sms","to":"twilio","label":"send"},
{"from":"push","to":"fcm","label":"send"}
],
"annotations":{
"src":"Internal microservices that trigger notifications",
"api":"Entry point that validates, checks prefs & rate limits",
"queue":"Kafka/SQS topic per channel for durability",
"router":"Distributes messages to appropriate channel workers",
"email":"Handles SMTP/SES integration with retries",
"sms":"Twilio client with exponential backoff",
"push":"FCM & APNs dual provider for iOS/Android"
}}
\`\`\`

\`\`\`concept
{"title":"Why Asynchronous Queues Matter","variant":"insight","content":"Decoupling notification triggering from delivery via message queues is the single most important architectural decision. It allows the API to accept requests in milliseconds while workers retry failed deliveries for minutes without blocking callers. Kafka can sustain 200K+ messages/sec per partition, ensuring the system never loses a notification even during provider outages."}
\`\`\`

## Component Details

### Notification Service API
The entry point for all notification requests. It performs:
- **Input validation** — Ensures required fields (user ID, template ID, channel) are present.
- **User preference check** — Queries the user preferences store to confirm the user has not opted out.
- **Rate limit check** — Verifies the user has not exceeded their notification quota.
- **Template rendering** — Fills template variables to produce the final message body.

If all checks pass, the notification is placed on the appropriate message queue.

\`\`\`trace
{"title":"API Gateway Processing Flow","language":"python","code":"def handle_notification(req):\\n    # 1. Validate input\\n    if not req.user_id or not req.template_id:\\n        return error(400, 'missing fields')\\n    \\n    # 2. Check user preferences\\n    prefs = get_prefs(req.user_id)\\n    if req.channel not in prefs.enabled:\\n        return ok('ignored: user opted out')\\n    \\n    # 3. Rate limit check\\n    if not rate_limiter.allow(req.user_id, req.channel):\\n        return error(429, 'rate limit exceeded')\\n    \\n    # 4. Render template\\n    msg = templates.render(req.template_id, req.vars)\\n    \\n    # 5. Enqueue\\n    queue.publish(req.channel, {\\n        'user_id': req.user_id,\\n        'message': msg,\\n        'retry': 0\\n    })\\n    return ok('queued')","frames":[
{"line":3,"vars":{"req":{"user_id":"u123","template_id":"welcome","channel":"email"}},"stdout":""},
{"line":8,"vars":{"prefs":{"enabled":["email","push"],"quiet_hours":null}},"stdout":""},
{"line":12,"vars":{"rate_limiter":"TokenBucket(100/hour)"},"stdout":""},
{"line":16,"vars":{"msg":"Welcome Alice!"},"stdout":""},
{"line":20,"vars":{},"stdout":"Published to kafka topic 'email'"}
],"speed":600}
\`\`\`

### Message Queues
Separate queues for each channel (push, email, SMS) allow independent scaling. If the email provider is slow, it does not back up push notification delivery. Using a durable queue (like Kafka or SQS) ensures messages survive worker crashes.

\`\`\`compare
{"variant":"good-bad","before":{"label":"Single Shared Queue","code":"# All channels share one queue\\nqueue.publish('notifications', {\\n  user_id: 'u123',\\n  channel: 'email',\\n  message: '...'\\n})\\n\\n# Problem: SMS backlog blocks urgent push alerts"},"after":{"label":"Per-Channel Queues","code":"# Separate topics per channel\\nkafka.send('notifications.email', msg)\\nkafka.send('notifications.push', msg)  \\nkafka.send('notifications.sms', msg)\\n\\n# Benefit: Push alerts flow even if SES is slow"}}
\`\`\`

### Channel Workers
Each worker type knows how to talk to its specific third-party provider:
- **Push workers** call APNs (Apple) or FCM (Google) depending on the device type.
- **Email workers** call an SMTP relay or a service like Amazon SES.
- **SMS workers** call providers like Twilio or MessageBird.

Workers handle retries on transient failures and log delivery results.

\`\`\`quiz
{"title":"Channel Worker Responsibilities","questions":[
{"question":"Why do we need separate workers per channel instead of one generic worker?","options":["To reduce code complexity","To allow independent scaling and retry policies per provider","To save memory","To comply with GDPR"],"answer":1,"explanation":"Different providers have different latency, throughput, and failure patterns. Push notifications may need immediate delivery while emails can tolerate minutes of delay."},
{"question":"What happens when Twilio returns a 429 (rate limit) error?","options":["Drop the message","Immediately retry","Retry with exponential backoff up to N times","Alert on-call engineer"],"answer":2,"explanation":"Workers implement exponential backoff (e.g., 1s, 2s, 4s, 8s) with jitter to avoid thundering herd, then move the message to a dead-letter queue after max retries."},
{"question":"Which provider-specific detail must push workers handle that email workers don’t?","options":["OAuth2 token refresh","Device token rotation when users reinstall apps","SMTP authentication","Message encoding"],"answer":1,"explanation":"Push tokens become invalid when users uninstall/reinstall apps or disable notifications. Workers must remove stale tokens from the device store on provider feedback."}
]}
\`\`\`

### Data Stores

- **User Preferences DB** — Stores per-user opt-in/opt-out settings per channel and notification type.
- **Device Token Store** — Maps user IDs to their device push tokens (a user may have multiple devices).
- **Template Store** — Holds notification templates with variable placeholders.
- **Notification Log** — Records every notification sent with its delivery status for analytics and debugging.

\`\`\`takeaways
{"title":"Key Takeaways","items":["Separate message queues per channel provide isolation and independent scalability","The API layer acts as a gatekeeper — filtering out notifications that should not be sent","Third-party providers handle the actual last-mile delivery; our system handles orchestration","Durable queues ensure no notification is lost even if workers crash or restart","Device tokens must be kept up to date as users install/uninstall apps or switch devices"]}
\`\`\``,
    },
    {
      id: "sd-08-03",
      slug: "notification-system-deep-dive",
      title: "Deep Dive",
      content: `# Notification System: Deep Dive

## Reliability: Retry and Deduplication

Third-party providers can fail. Our system must handle this gracefully:

\`\`\`concept
{
  "title": "At-Least-Once Delivery",
  "variant": "mental-model",
  "content": "Message queues guarantee delivery, but may deliver the same message multiple times. Workers can crash after sending but before acknowledging, creating duplicates. Design your system to handle duplicates gracefully rather than trying to prevent them entirely."
}
\`\`\`

**Retry with exponential backoff**: If APNs or an SMTP server returns a transient error (5xx, timeout), retry after 1s, then 2s, then 4s, up to a maximum retry count. After exhausting retries, move the notification to a dead-letter queue for manual investigation.

**Idempotency for deduplication**: At-least-once delivery means a notification might be processed twice (e.g., a worker crashes after sending but before acknowledging the queue message). To prevent users from receiving duplicate notifications:
- Assign each notification a unique \`notification_id\`.
- Before sending, check a deduplication cache (Redis with a TTL of e.g., 24 hours).
- If the ID exists in the cache, skip sending. Otherwise, send and add the ID.

\`\`\`trace
{
  "title": "Duplicate Detection in Action",
  "language": "python",
  "code": "import redis\\nimport uuid\\n\\nr = redis.Redis()\\n\\ndef send_notification(user_id, template_id, data):\\n    # Generate unique ID for this notification\\n    notification_id = str(uuid.uuid4())\\n    \\n    # Check deduplication cache\\n    cache_key = f\\"sent:{notification_id}\\"\\n    if r.exists(cache_key):\\n        print(f\\"Skipping duplicate: {notification_id}\\")\\n        return False\\n    \\n    # Send notification (simulated)\\n    print(f\\"Sending notification {notification_id} to user {user_id}\\")\\n    \\n    # Mark as sent with 24h TTL\\n    r.setex(cache_key, 86400, \\"1\\")\\n    return True\\n\\n# Simulate duplicate scenario\\nprint(\\"First attempt:\\")\\nsend_notification(\\"U123\\", \\"welcome_email\\", {\\"name\\": \\"Alice\\"})\\n\\nprint(\\"\\\\nDuplicate attempt (worker retry):\\")\\nsend_notification(\\"U123\\", \\"welcome_email\\", {\\"name\\": \\"Alice\\"})",
  "frames": [
    {"line": 8, "vars": {"notification_id": "550e8400-e29b-41d4-a716-446655440000", "cache_key": "sent:550e8400-e29b-41d4-a716-446655440000"}, "note": "Generate unique ID for notification"},
    {"line": 11, "vars": {"r.exists()": "False"}, "note": "Check if already sent - cache miss"},
    {"line": 15, "stdout": "Sending notification 550e8400-e29b-41d4-a716-446655440000 to user U123", "note": "Send notification"},
    {"line": 18, "vars": {"TTL": "86400"}, "note": "Add to deduplication cache"},
    {"line": 22, "stdout": "First attempt:\\nSending notification 550e8400-e29b-41d4-a716-446655440000 to user U123", "note": "First attempt succeeds"},
    {"line": 25, "vars": {"r.exists()": "True"}, "note": "Second check - cache hit!"},
    {"line": 26, "stdout": "Skipping duplicate: 550e8400-e29b-41d4-a716-446655440000", "note": "Duplicate detected and skipped"}
  ],
  "speed": 1000
}
\`\`\`

## Rate Limiting

Rate limiting protects users from notification spam and controls costs:

\`\`\`callout
{
  "type": "warning",
  "title": "Why Rate Limiting Matters",
  "content": "SMS costs $0.01-$0.05 per message. Sending 1M SMS notifications costs $10K-$50K. Rate limiting isn't just about user experience — it's about preventing bankruptcy from runaway scripts or bugs."
}
\`\`\`

Rules examples:
- Max 3 marketing emails per user per day
- Max 1 SMS per user per hour  
- Max 10 push notifications per user per day
- No notifications between 10 PM - 8 AM user local time

Implementation uses a **sliding window counter** in Redis, keyed by \`user_id:channel:notification_type\`. When a notification request arrives, increment the counter and check against the limit. If exceeded, either drop the notification or defer it to the next allowed window.

\`\`\`algoviz
{
  "title": "Sliding Window Rate Limiter",
  "type": "array",
  "data": [0, 0, 0, 1, 2, 3, 0, 1, 0, 0],
  "frames": [
    {"highlight": [0], "label": "Empty window (10 min periods)", "stats": {"total": 0, "limit": 3}},
    {"highlight": [3], "label": "User receives 1st SMS", "stats": {"total": 1, "limit": 3}},
    {"highlight": [4], "label": "2nd SMS allowed", "stats": {"total": 2, "limit": 3}},
    {"highlight": [5], "label": "3rd SMS - at limit", "stats": {"total": 3, "limit": 3}},
    {"highlight": [6], "label": "Window slides, old count expires", "stats": {"total": 2, "limit": 3}},
    {"highlight": [7], "label": "New SMS allowed", "stats": {"total": 3, "limit": 3}}
  ],
  "speed": 1200
}
\`\`\`

## Template Rendering

Templates separate message content from delivery logic. A template might look like:

\`\`\`
Subject: Your order {{order_id}} has shipped!
Body: Hi {{first_name}}, your package is on its way.
      Track it here: {{tracking_url}}
\`\`\`

The rendering engine substitutes variables from the notification payload. Templates support:
- **Localization** — Different templates per language/locale.
- **Channel variants** — A push notification template is shorter than the email version.
- **A/B testing** — Multiple template variants for the same notification type, with random assignment.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Hard-coded Messages",
    "code": "def send_order_shipped(user, order):\\n    subject = f\\"Your order {order.id} has shipped!\\"\\n    body = f\\"Hi {user.name}, your package is on its way. Track it here: {order.tracking_url}\\"\\n    \\n    if user.locale == \\"es\\":\\n        subject = f\\"¡Tu pedido {order.id} ha sido enviado!\\"\\n        body = f\\"Hola {user.name}, tu paquete está en camino. Rastrea aquí: {order.tracking_url}\\"\\n    \\n    send_email(user.email, subject, body)"
  },
  "after": {
    "label": "Template-Based System",
    "code": "def send_order_shipped(user, order):\\n    template = template_service.get_template(\\n        name=\\"order_shipped\\",\\n        channel=\\"email\\",\\n        locale=user.locale,\\n        variant=ab_test.assign_variant(user.id)\\n    )\\n    \\n    message = template.render({\\n        \\"first_name\\": user.name,\\n        \\"order_id\\": order.id,\\n        \\"tracking_url\\": order.tracking_url\\n    })\\n    \\n    send_email(user.email, message.subject, message.body)"
  }
}
\`\`\`

## User Preferences

The preferences service stores a matrix of user choices:

| User | Marketing Email | Order Updates Push | Security SMS |
|------|----------------|-------------------|-------------|
| U1   | Opted out      | Opted in          | Opted in    |
| U2   | Opted in       | Opted in          | Opted in    |

Every notification request checks this matrix. Legal compliance (GDPR, CAN-SPAM) requires honoring opt-outs immediately — there should be no caching delay that causes a notification to be sent after a user opts out.

\`\`\`quiz
{
  "title": "User Preference Compliance",
  "questions": [
    {
      "question": "A user opts out of marketing emails at 2:15 PM. An hour later, a scheduled job tries to send them a promotional email. What should happen?",
      "options": ["Send the email - it's already scheduled", "Check preferences first, then skip sending", "Send anyway - preferences only apply to new campaigns", "Queue for manual review"],
      "answer": 1,
      "explanation": "Preferences must be checked in real-time before every send. GDPR requires immediate compliance with opt-outs."
    },
    {
      "question": "What's the maximum safe TTL for caching user preferences?",
      "options": ["24 hours", "1 hour", "0 seconds (no caching)", "7 days"],
      "answer": 2,
      "explanation": "Legal compliance requires real-time preference checks. Any caching delay risks sending after opt-out."
    },
    {
      "question": "A user has opted out of marketing emails but gets a 'Your order shipped' email. Is this compliant?",
      "options": ["No - all emails require consent", "Yes - transactional emails are exempt", "Only if they previously consented", "Only with double opt-in"],
      "answer": 1,
      "explanation": "Transactional notifications (order updates, security alerts) are typically exempt from marketing consent requirements."
    }
  ]
}
\`\`\`

## Analytics

Track the full lifecycle of each notification:
- **Created** — Request received by the API.
- **Queued** — Placed on the message queue.
- **Sent** — Delivered to the third-party provider.
- **Delivered** — Provider confirmed delivery (APNs/FCM provide callbacks).
- **Opened/Clicked** — User interacted with the notification (via tracking pixels for email, deep link tracking for push).
- **Failed** — Delivery failed after all retries.

This data powers dashboards showing delivery rates, open rates, and failure patterns.

\`\`\`steps
{
  "title": "Notification Lifecycle Tracking",
  "steps": [
    {
      "title": "1. Request Creation",
      "content": "API receives request and assigns notification_id. Logs: \`{id: 'n123', user: 'U456', type: 'order_shipped', status: 'created'}\`"
    },
    {
      "title": "2. Queue Placement",
      "content": "Message published to queue. Updates status to 'queued' with timestamp for latency tracking."
    },
    {
      "title": "3. Provider Delivery",
      "content": "Worker picks up message, sends to provider (APNs/FCM/SMTP). Status becomes 'sent' with provider response."
    },
    {
      "title": "4. Delivery Confirmation",
      "content": "Provider callback confirms delivery. Email providers may report bounces, push services confirm device delivery."
    },
    {
      "title": "5. User Interaction",
      "content": "User opens email (tracking pixel) or taps push notification. Deep links include analytics parameters for attribution."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Idempotency keys in a Redis cache prevent duplicate notifications without complex distributed transactions.",
    "Rate limiting is both a UX feature (no spam) and a cost control (SMS is expensive).",
    "Template rendering should support localization and A/B testing from day one.",
    "User preference checks must be real-time with no stale cache to ensure legal compliance.",
    "End-to-end analytics help identify delivery issues and optimize notification strategy."
  ]
}
\`\`\``,
    },
    {
      id: "sd-08-04",
      slug: "notification-system-scaling",
      title: "Scaling & Trade-offs",
      content: `# Notification System: Scaling & Trade-offs

\`\`\`concept
{"title": "Scalability in Notification Systems", "variant": "mental-model", "content": "Scalability is the system's ability to handle increasing notification volume without performance degradation. This involves horizontal scaling (adding more machines) rather than vertical scaling (upgrading single machine) due to better fault tolerance and theoretically unlimited capacity. The core principle is asynchronous decoupling: the application accepts notification requests instantly, while delivery happens in the background through worker services and message queues."}
\`\`\`

## Priority Queues

Not all notifications are equal. A two-factor authentication code is far more urgent than a weekly newsletter. Implement priority levels:

- **Critical** — Security alerts, OTP codes. Processed immediately, bypass rate limits.
- **High** — Order confirmations, payment receipts. Processed within seconds.
- **Medium** — Social interactions (likes, comments). Processed within minutes.
- **Low** — Marketing, newsletters. Can be batched and deferred.

Use separate queues per priority level, with more worker capacity allocated to higher-priority queues. Critical notifications should have a dedicated fast path that skips the general queue entirely.

\`\`\`algoviz
{"title": "Priority Queue Processing", "type": "array", "data": ["Critical: OTP Code", "High: Order Confirm", "Medium: Like", "Low: Newsletter", "Critical: Security Alert", "High: Payment Receipt"], "frames": [{"highlight": [0], "label": "Critical notification bypasses queue", "stats": {"critical_workers": 3, "high_workers": 2, "medium_workers": 1}}, {"highlight": [1, 5], "label": "High priority processed next", "stats": {"critical_workers": 2, "high_workers": 2, "medium_workers": 1}}, {"highlight": [2], "label": "Medium priority waits for capacity", "stats": {"critical_workers": 1, "high_workers": 1, "medium_workers": 1}}, {"highlight": [3], "label": "Low priority batched for later", "stats": {"critical_workers": 1, "high_workers": 1, "medium_workers": 0}}], "speed": 1000}
\`\`\`

## Batching

For low-priority, high-volume notifications (marketing campaigns), sending millions of individual messages is inefficient. Instead:

1. **Batch preparation** — Group notifications by template and channel.
2. **Provider batch APIs** — Many email providers (SES, SendGrid) offer batch send APIs that accept thousands of recipients per call.
3. **Staggered sending** — Spread a campaign over hours to avoid overwhelming providers and to smooth out traffic.

Batching reduces API call overhead and often qualifies for volume pricing discounts.

\`\`\`compare
{"variant": "before-after", "before": {"label": "Individual Sends", "code": "# 1M notifications × 1 API call each = 1M API calls\\nfor user in users:\\n    send_email(user, template)\\n    # Rate limit: 100 calls/second\\n    # Time: 1M ÷ 100 = 10,000 seconds (2.8 hours)\\n    # Cost: $0.0001 × 1M = $100"}, "after": {"label": "Batch Processing", "code": "# 1M notifications ÷ 1000 per batch = 1K API calls\\nbatches = chunk(users, 1000)\\nfor batch in batches:\\n    send_batch_email(batch, template)\\n    # Rate limit: 10 batch calls/second\\n    # Time: 1K ÷ 10 = 100 seconds (1.7 minutes)\\n    # Cost: $0.001 × 1K = $1 (90% savings)"}}
\`\`\`

## Provider Failover

Depending on a single third-party provider creates a single point of failure. Design for failover:

\`\`\`
┌──────────────┐
│  Push Worker  │
└──────┬───────┘
       │
       v
┌──────────────┐    fail     ┌──────────────┐
│  Primary:    │───────────>│  Fallback:   │
│  FCM / APNs  │            │  OneSignal   │
└──────────────┘            └──────────────┘
\`\`\`

For each channel, configure a primary and secondary provider. If the primary returns errors above a threshold (e.g., >5% failure rate over 1 minute), route traffic to the secondary. This requires abstracting the provider interface so workers can switch providers without code changes.

For email specifically, maintain multiple sending domains to protect your sender reputation. If one domain gets flagged as spam, the others continue working.

\`\`\`sysdiag
{"title": "Provider Failover Architecture", "width": 600, "height": 300, "nodes": [{"id": "worker", "label": "Notification Worker", "x": 100, "y": 150, "kind": "service"}, {"id": "monitor", "label": "Health Monitor", "x": 300, "y": 50, "kind": "service"}, {"id": "primary", "label": "Primary Provider", "x": 500, "y": 100, "kind": "external"}, {"id": "fallback", "label": "Fallback Provider", "x": 500, "y": 200, "kind": "external"}], "edges": [{"from": "worker", "to": "primary", "label": "99% traffic"}, {"from": "worker", "to": "fallback", "label": "failover", "style": "dashed"}, {"from": "monitor", "to": "primary", "label": "health check"}, {"from": "monitor", "to": "worker", "label": "trigger failover"}], "annotations": {"monitor": "Monitors failure rates and triggers failover when >5% errors detected over 1 minute window", "worker": "Abstracts provider interface to enable seamless switching without code changes"}}
\`\`\`

## Notification Grouping

When many events happen in quick succession (e.g., "10 people liked your photo"), sending 10 individual push notifications is a poor experience. Instead, **group and summarize**:

- Buffer notifications of the same type for a short window (e.g., 30 seconds).
- If multiple notifications accumulate, merge them into a summary: "10 people liked your photo."
- If only one notification arrives within the window, send it individually.

This requires a small delay buffer, typically implemented with a scheduled task or a delay queue.

\`\`\`trace
{"title": "Notification Grouping Algorithm", "language": "python", "code": "class NotificationGrouper:\\n    def __init__(self, window_seconds=30):\\n        self.buffer = {}\\n        self.window = window_seconds\\n    \\n    def add_notification(self, user_id, event_type, data):\\n        key = (user_id, event_type)\\n        if key not in self.buffer:\\n            self.buffer[key] = []\\n        self.buffer[key].append(data)\\n        \\n        # Schedule flush after window\\n        schedule_once(self.flush, key, delay=self.window)\\n    \\n    def flush(self, key):\\n        notifications = self.buffer.pop(key, [])\\n        if len(notifications) == 1:\\n            send_single(notifications[0])\\n        elif len(notifications) > 1:\\n            send_summary(key[1], notifications)", "frames": [{"line": 1, "vars": {"buffer": {}, "window": 30}, "note": "Initialize empty buffer"}, {"line": 8, "vars": {"buffer": {"(user123, like)": [{"actor": "Alice"}]}}, "note": "First notification buffered"}, {"line": 8, "vars": {"buffer": {"(user123, like)": [{"actor": "Alice"}, {"actor": "Bob"}]}}, "note": "Second notification added"}, {"line": 8, "vars": {"buffer": {"(user123, like)": [{"actor": "Alice"}, {"actor": "Bob"}, {"actor": "Charlie"}]}}, "note": "Third notification added"}, {"line": 14, "vars": {"notifications": [{"actor": "Alice"}, {"actor": "Bob"}, {"actor": "Charlie"}]}, "note": "Window expires, flush triggered"}, {"line": 17, "vars": {}, "note": "Summary sent: 'Alice, Bob and 1 other liked your photo'"}], "speed": 1000}
\`\`\`

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| At-least-once vs Exactly-once | Simpler, risk of duplicates | Complex, requires distributed transactions |
| Push vs Pull for email opens | Tracking pixels (privacy concern) | No open tracking (less data) |
| Real-time vs Batched | Lower latency, higher cost | Higher latency, lower cost |
| Single provider vs Multi | Simpler integration | Better reliability, more complexity |

\`\`\`quiz
{"title": "Scaling & Trade-offs Quiz", "questions": [{"question": "Which priority level should bypass rate limits entirely?", "options": ["High", "Critical", "Medium", "Low"], "answer": 1, "explanation": "Critical notifications like OTP codes and security alerts should bypass rate limits to ensure immediate delivery."}, {"question": "What is the primary benefit of batching notifications?", "options": ["Faster delivery", "Reduced API calls and cost", "Better user experience", "Higher reliability"], "answer": 1, "explanation": "Batching dramatically reduces API calls (from millions to thousands) and often qualifies for volume pricing discounts."}, {"question": "When should provider failover be triggered?", "options": ["Any single error", ">5% failure rate over 1 minute", "First timeout", "User complaint"], "answer": 1, "explanation": "Failover should trigger when the primary provider shows >5% failure rate over a 1-minute window to avoid false positives."}, {"question": "Why implement notification grouping?", "options": ["Reduce server load", "Improve user experience", "Save provider costs", "Increase delivery speed"], "answer": 1, "explanation": "Grouping prevents notification spam by summarizing multiple similar events into a single, more meaningful notification."}]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Priority queues ensure critical notifications (OTPs, security alerts) are never delayed by marketing blasts", "Batching dramatically reduces cost and API overhead for high-volume campaigns", "Provider failover eliminates single points of failure in the delivery path", "Notification grouping improves user experience by summarizing bursts of similar events", "Each trade-off should be decided based on the specific notification type and its urgency"]}
\`\`\``,
    },
  ],
};
