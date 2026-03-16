import { Module } from "../types";

export const notificationSystemModule: Module = {
  id: "sd-08",
  title: "Design a Notification System",
  description:
    "Design a scalable notification system supporting push notifications, SMS, and email with user preferences and rate limiting.",
  lessons: [
    {
      id: "sd-08-01",
      slug: "notification-system-requirements",
      title: "Requirements & Estimation",
      content: `# Notification System: Requirements & Estimation

## What Does a Notification System Do?

A notification system delivers messages to users through multiple channels: mobile push notifications (iOS and Android), SMS text messages, and email. Services like e-commerce platforms, social media apps, and banking apps all rely on notification systems to keep users informed.

## Functional Requirements

1. **Multi-channel delivery** — Support iOS push (APNs), Android push (FCM), SMS, and email.
2. **User preferences** — Users can opt in or out of specific notification types per channel.
3. **Templates** — Notifications use pre-defined templates with variable substitution (e.g., "Hi {{name}}, your order {{orderId}} has shipped").
4. **Rate limiting** — Prevent notification fatigue by limiting how many notifications a user receives in a given time window.
5. **Scheduling** — Support sending notifications at a future time or within a user's preferred time zone window.
6. **Tracking** — Track delivery status (sent, delivered, opened, clicked, failed).

## Non-Functional Requirements

- **Reliability** — A notification should not be lost. Prefer at-least-once delivery over at-most-once.
- **Low latency** — Time-sensitive notifications (OTP codes, security alerts) must arrive within seconds.
- **Scalability** — Handle millions of notifications per day.
- **Extensibility** — Easy to add new channels (e.g., WhatsApp, Slack) in the future.

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

## Key Takeaways

- A notification system must support multiple delivery channels, each with its own third-party provider.
- At-least-once delivery is preferred — a duplicate notification is better than a missed one.
- Rate limiting serves two purposes: protecting user experience and controlling costs (especially SMS).
- User preferences must be checked before every send to comply with opt-out requirements.
- Delivery tracking is essential for analytics and debugging failed notifications.
`,
    },
    {
      id: "sd-08-02",
      slug: "notification-system-high-level-design",
      title: "High-Level Design",
      content: `# Notification System: High-Level Design

## Architecture Overview

The system accepts notification requests from various internal services, processes them through a pipeline, and delivers them via channel-specific providers.

\`\`\`mermaid
graph TD
    E[Event Source] --> NS[Notification Service]
    NS --> PQ[Priority Queue]
    PQ --> CR[Channel Router]
    CR --> Email[Email - SES/SMTP]
    CR --> SMS[SMS - Twilio]
    CR --> Push[Push - APNs/FCM]
    NS -.->|check| Prefs[(User Preferences)]
    NS -.->|check| RL[Rate Limiter]
\`\`\`

\`\`\`
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Service A│  │ Service B│  │ Service C│   (Internal callers)
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     v             v             v
┌────────────────────────────────────────┐
│         Notification Service API       │
│  (Validation, rate limit, preferences) │
└──────────────────┬─────────────────────┘
                   │
                   v
          ┌────────────────┐
          │  Message Queue  │
          │  (Kafka/SQS)   │
          └───┬────┬────┬──┘
              │    │    │
              v    v    v
         ┌─────┐┌─────┐┌─────┐
         │Push ││Email││SMS  │    (Channel Workers)
         │Wrkr ││Wrkr ││Wrkr │
         └──┬──┘└──┬──┘└──┬──┘
            │      │      │
            v      v      v
         ┌─────┐┌─────┐┌─────┐
         │APNs ││SMTP ││Twilio│   (Third-party Providers)
         │FCM  ││SES  ││     │
         └─────┘└─────┘└─────┘
\`\`\`

## Component Details

### Notification Service API
The entry point for all notification requests. It performs:
- **Input validation** — Ensures required fields (user ID, template ID, channel) are present.
- **User preference check** — Queries the user preferences store to confirm the user has not opted out.
- **Rate limit check** — Verifies the user has not exceeded their notification quota.
- **Template rendering** — Fills template variables to produce the final message body.

If all checks pass, the notification is placed on the appropriate message queue.

### Message Queues
Separate queues for each channel (push, email, SMS) allow independent scaling. If the email provider is slow, it does not back up push notification delivery. Using a durable queue (like Kafka or SQS) ensures messages survive worker crashes.

### Channel Workers
Each worker type knows how to talk to its specific third-party provider:
- **Push workers** call APNs (Apple) or FCM (Google) depending on the device type.
- **Email workers** call an SMTP relay or a service like Amazon SES.
- **SMS workers** call providers like Twilio or MessageBird.

Workers handle retries on transient failures and log delivery results.

### Data Stores

- **User Preferences DB** — Stores per-user opt-in/opt-out settings per channel and notification type.
- **Device Token Store** — Maps user IDs to their device push tokens (a user may have multiple devices).
- **Template Store** — Holds notification templates with variable placeholders.
- **Notification Log** — Records every notification sent with its delivery status for analytics and debugging.

## Key Takeaways

- Separate message queues per channel provide isolation and independent scalability.
- The API layer acts as a gatekeeper — filtering out notifications that should not be sent.
- Third-party providers handle the actual last-mile delivery; our system handles orchestration.
- Durable queues ensure no notification is lost even if workers crash or restart.
- Device tokens must be kept up to date as users install/uninstall apps or switch devices.
`,
    },
    {
      id: "sd-08-03",
      slug: "notification-system-deep-dive",
      title: "Deep Dive",
      content: `# Notification System: Deep Dive

## Reliability: Retry and Deduplication

Third-party providers can fail. Our system must handle this gracefully:

**Retry with exponential backoff**: If APNs or an SMTP server returns a transient error (5xx, timeout), retry after 1s, then 2s, then 4s, up to a maximum retry count. After exhausting retries, move the notification to a dead-letter queue for manual investigation.

**Idempotency for deduplication**: At-least-once delivery means a notification might be processed twice (e.g., a worker crashes after sending but before acknowledging the queue message). To prevent users from receiving duplicate notifications:
- Assign each notification a unique \`notification_id\`.
- Before sending, check a deduplication cache (Redis with a TTL of e.g., 24 hours).
- If the ID exists in the cache, skip sending. Otherwise, send and add the ID.

## Rate Limiting

Rate limiting protects users from notification spam and controls costs:

\`\`\`
Rules examples:
- Max 3 marketing emails per user per day
- Max 1 SMS per user per hour
- Max 10 push notifications per user per day
- No notifications between 10 PM - 8 AM user local time
\`\`\`

Implementation uses a **sliding window counter** in Redis, keyed by \`user_id:channel:notification_type\`. When a notification request arrives, increment the counter and check against the limit. If exceeded, either drop the notification or defer it to the next allowed window.

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

## User Preferences

The preferences service stores a matrix of user choices:

| User | Marketing Email | Order Updates Push | Security SMS |
|------|----------------|-------------------|-------------|
| U1   | Opted out      | Opted in          | Opted in    |
| U2   | Opted in       | Opted in          | Opted in    |

Every notification request checks this matrix. Legal compliance (GDPR, CAN-SPAM) requires honoring opt-outs immediately — there should be no caching delay that causes a notification to be sent after a user opts out.

## Analytics

Track the full lifecycle of each notification:
- **Created** — Request received by the API.
- **Queued** — Placed on the message queue.
- **Sent** — Delivered to the third-party provider.
- **Delivered** — Provider confirmed delivery (APNs/FCM provide callbacks).
- **Opened/Clicked** — User interacted with the notification (via tracking pixels for email, deep link tracking for push).
- **Failed** — Delivery failed after all retries.

This data powers dashboards showing delivery rates, open rates, and failure patterns.

## Key Takeaways

- Idempotency keys in a Redis cache prevent duplicate notifications without complex distributed transactions.
- Rate limiting is both a UX feature (no spam) and a cost control (SMS is expensive).
- Template rendering should support localization and A/B testing from day one.
- User preference checks must be real-time with no stale cache to ensure legal compliance.
- End-to-end analytics help identify delivery issues and optimize notification strategy.
`,
    },
    {
      id: "sd-08-04",
      slug: "notification-system-scaling",
      title: "Scaling & Trade-offs",
      content: `# Notification System: Scaling & Trade-offs

## Priority Queues

Not all notifications are equal. A two-factor authentication code is far more urgent than a weekly newsletter. Implement priority levels:

- **Critical** — Security alerts, OTP codes. Processed immediately, bypass rate limits.
- **High** — Order confirmations, payment receipts. Processed within seconds.
- **Medium** — Social interactions (likes, comments). Processed within minutes.
- **Low** — Marketing, newsletters. Can be batched and deferred.

Use separate queues per priority level, with more worker capacity allocated to higher-priority queues. Critical notifications should have a dedicated fast path that skips the general queue entirely.

## Batching

For low-priority, high-volume notifications (marketing campaigns), sending millions of individual messages is inefficient. Instead:

1. **Batch preparation** — Group notifications by template and channel.
2. **Provider batch APIs** — Many email providers (SES, SendGrid) offer batch send APIs that accept thousands of recipients per call.
3. **Staggered sending** — Spread a campaign over hours to avoid overwhelming providers and to smooth out traffic.

Batching reduces API call overhead and often qualifies for volume pricing discounts.

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

## Notification Grouping

When many events happen in quick succession (e.g., "10 people liked your photo"), sending 10 individual push notifications is a poor experience. Instead, **group and summarize**:

- Buffer notifications of the same type for a short window (e.g., 30 seconds).
- If multiple notifications accumulate, merge them into a summary: "10 people liked your photo."
- If only one notification arrives within the window, send it individually.

This requires a small delay buffer, typically implemented with a scheduled task or a delay queue.

## Key Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| At-least-once vs Exactly-once | Simpler, risk of duplicates | Complex, requires distributed transactions |
| Push vs Pull for email opens | Tracking pixels (privacy concern) | No open tracking (less data) |
| Real-time vs Batched | Lower latency, higher cost | Higher latency, lower cost |
| Single provider vs Multi | Simpler integration | Better reliability, more complexity |

## Key Takeaways

- Priority queues ensure critical notifications (OTPs, security alerts) are never delayed by marketing blasts.
- Batching dramatically reduces cost and API overhead for high-volume campaigns.
- Provider failover eliminates single points of failure in the delivery path.
- Notification grouping improves user experience by summarizing bursts of similar events.
- Each trade-off should be decided based on the specific notification type and its urgency.
`,
    },
  ],
};
