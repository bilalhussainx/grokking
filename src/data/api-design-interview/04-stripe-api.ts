import { Module } from "../types";

export const stripeApiModule: Module = {
  id: "design-stripe-api",
  title: "Design Stripe API",
  description:
    "Design a payment processing API inspired by Stripe — payment intents, webhooks, idempotency, and financial safety patterns.",
  lessons: [
    {
      id: "stripe-requirements",
      slug: "stripe-requirements",
      title: "Requirements & Resource Modeling",
      content: `# Design Stripe API: Requirements & Resource Modeling

Payment APIs are among the most demanding to design. They require correctness guarantees that most APIs do not: money cannot be lost, duplicated, or incorrectly attributed. This makes it an excellent interview question.

## Step 1: Clarify Requirements

**Functional Requirements:**
- Merchants can create payment intents (authorize a charge)
- Payments can be confirmed (capture the charge)
- Support for refunds (full and partial)
- Webhook delivery for payment events
- Customer and payment method management

**Non-Functional Requirements:**
- Every mutating operation must be idempotent
- Eventual consistency is acceptable for reads, but writes must be strongly consistent
- All amounts in smallest currency unit (cents, not dollars)
- PCI DSS compliance considerations in API design

## Step 2: Identify Resources

\`\`\`
Core Resources:
├── Customer          → /customers
├── PaymentMethod     → /payment-methods
├── PaymentIntent     → /payment-intents
├── Refund            → /refunds
├── Webhook Endpoint  → /webhook-endpoints
└── Event             → /events
\`\`\`

## Step 3: Resource Schemas

### Customer

\`\`\`json
{
  "id": "cus_abc123",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "default_payment_method": "pm_card_visa",
  "metadata": { "internal_id": "12345" },
  "created_at": "2025-01-15T10:00:00Z"
}
\`\`\`

### PaymentMethod

\`\`\`json
{
  "id": "pm_card_visa",
  "type": "card",
  "card": {
    "brand": "visa",
    "last4": "4242",
    "exp_month": 12,
    "exp_year": 2027,
    "funding": "credit"
  },
  "customer": "cus_abc123",
  "created_at": "2025-01-15T10:05:00Z"
}
\`\`\`

**Note:** The API never returns full card numbers. Only \`last4\`, \`brand\`, and expiry are exposed. This is a PCI compliance requirement.

### PaymentIntent

\`\`\`json
{
  "id": "pi_xyz789",
  "amount": 5000,
  "currency": "usd",
  "status": "requires_confirmation",
  "customer": "cus_abc123",
  "payment_method": "pm_card_visa",
  "description": "Order #1234",
  "metadata": { "order_id": "ord_1234" },
  "amount_received": 0,
  "created_at": "2025-03-10T14:30:00Z"
}
\`\`\`

### PaymentIntent Status Machine

\`\`\`
requires_payment_method → requires_confirmation → processing → succeeded
                                                             → failed
                                                 → canceled
succeeded → partially_refunded → refunded
\`\`\`

## Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /customers | Create customer |
| GET | /customers/{id} | Get customer |
| PATCH | /customers/{id} | Update customer |
| POST | /payment-methods | Attach payment method |
| GET | /customers/{id}/payment-methods | List customer methods |
| POST | /payment-intents | Create payment intent |
| GET | /payment-intents/{id} | Get payment intent |
| POST | /payment-intents/{id}/confirm | Confirm (capture) |
| POST | /payment-intents/{id}/cancel | Cancel |
| POST | /refunds | Create refund |
| GET | /events | List events |
| POST | /webhook-endpoints | Register webhook |

## Key Design Decisions

1. **Amounts in cents:** \`5000\` means $50.00. This avoids floating-point errors — critical for financial APIs.

2. **Two-step payment (intent → confirm):** Separates authorization from capture. This supports hold-then-charge workflows (hotels, gas stations, pre-orders).

3. **Metadata field:** Free-form key-value pairs let merchants attach their own data (order IDs, user IDs) without us needing to model their domain.

4. **Prefixed IDs:** \`cus_\`, \`pi_\`, \`pm_\`, \`re_\` — the prefix tells you the resource type at a glance, useful for debugging and logging.`,
    },
    {
      id: "stripe-payment-intent",
      slug: "stripe-payment-intent",
      title: "Payment Intent Flow",
      content: `# Payment Intent Flow

The PaymentIntent is the central resource. It represents a single payment attempt and tracks it through a state machine.

## Create a PaymentIntent

\`\`\`http
POST /api/v1/payment-intents HTTP/1.1
Authorization: Bearer sk_live_abc123
Idempotency-Key: ik_order1234_attempt1
Content-Type: application/json

{
  "amount": 5000,
  "currency": "usd",
  "customer": "cus_abc123",
  "payment_method": "pm_card_visa",
  "description": "Order #1234",
  "metadata": {
    "order_id": "ord_1234"
  },
  "capture_method": "manual"
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created
Location: /api/v1/payment-intents/pi_xyz789

{
  "id": "pi_xyz789",
  "amount": 5000,
  "currency": "usd",
  "status": "requires_confirmation",
  "customer": "cus_abc123",
  "payment_method": "pm_card_visa",
  "capture_method": "manual",
  "amount_capturable": 5000,
  "amount_received": 0,
  "description": "Order #1234",
  "metadata": { "order_id": "ord_1234" },
  "created_at": "2025-03-10T14:30:00Z"
}
\`\`\`

### capture_method Options

| Value | Behavior |
|-------|----------|
| \`automatic\` | Charge is captured immediately upon confirmation |
| \`manual\` | Authorization only — merchant must call /confirm to capture |

## Confirm (Capture) a Payment

\`\`\`http
POST /api/v1/payment-intents/pi_xyz789/confirm HTTP/1.1
Authorization: Bearer sk_live_abc123
Idempotency-Key: ik_confirm_pi_xyz789

{
  "payment_method": "pm_card_visa"
}
\`\`\`

\`\`\`http
HTTP/1.1 200 OK

{
  "id": "pi_xyz789",
  "amount": 5000,
  "currency": "usd",
  "status": "succeeded",
  "amount_received": 5000,
  "charges": [
    {
      "id": "ch_001",
      "amount": 5000,
      "status": "succeeded",
      "payment_method": "pm_card_visa",
      "created_at": "2025-03-10T14:31:00Z"
    }
  ]
}
\`\`\`

## Cancel a PaymentIntent

\`\`\`http
POST /api/v1/payment-intents/pi_xyz789/cancel HTTP/1.1
Authorization: Bearer sk_live_abc123

HTTP/1.1 200 OK
{
  "id": "pi_xyz789",
  "status": "canceled",
  "cancellation_reason": "requested_by_customer"
}
\`\`\`

## Payment Failures

\`\`\`http
POST /api/v1/payment-intents/pi_xyz789/confirm

HTTP/1.1 402 Payment Required
{
  "error": {
    "code": "CARD_DECLINED",
    "message": "The card was declined. The bank returned: insufficient funds.",
    "decline_code": "insufficient_funds",
    "payment_intent": {
      "id": "pi_xyz789",
      "status": "requires_payment_method"
    }
  }
}
\`\`\`

**Common decline codes:**

| Code | Meaning | Suggested Action |
|------|---------|-----------------|
| insufficient_funds | Not enough balance | Try different card |
| expired_card | Card has expired | Update payment method |
| incorrect_cvc | CVC mismatch | Re-enter card details |
| processing_error | Bank processing issue | Retry later |
| fraudulent | Suspected fraud | Contact bank |

## List PaymentIntents

\`\`\`http
GET /api/v1/payment-intents?customer=cus_abc123&status=succeeded&limit=10
Authorization: Bearer sk_live_abc123

HTTP/1.1 200 OK
{
  "data": [
    { "id": "pi_xyz789", "amount": 5000, "status": "succeeded", ... },
    { "id": "pi_xyz790", "amount": 3000, "status": "succeeded", ... }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6InBpX3h5ejc5MCJ9",
    "has_more": true
  }
}
\`\`\`

## Why Two Steps?

The two-step flow (create → confirm) enables:
1. **Pre-authorization:** Hold funds without charging (hotel bookings, car rentals)
2. **Client-side confirmation:** Mobile apps can collect 3D Secure authentication between create and confirm
3. **Server-side validation:** Validate inventory/availability before capturing payment
4. **Partial capture:** Authorize $100, capture only $80 (if item is out of stock)

This pattern is directly borrowed from Stripe and is the industry standard for payment APIs.`,
    },
    {
      id: "stripe-webhooks",
      slug: "stripe-webhooks",
      title: "Webhook Design & Event System",
      content: `# Webhook Design & Event System

Webhooks are how the payment API communicates asynchronous events back to merchants. They are critical for payment processing because many payment outcomes are asynchronous (bank processing, fraud checks, disputes).

## Event Resource

Every state change in the system creates an Event:

\`\`\`json
{
  "id": "evt_001",
  "type": "payment_intent.succeeded",
  "created_at": "2025-03-10T14:31:00Z",
  "data": {
    "object": {
      "id": "pi_xyz789",
      "amount": 5000,
      "currency": "usd",
      "status": "succeeded",
      "customer": "cus_abc123"
    }
  },
  "api_version": "2025-03-01"
}
\`\`\`

### Event Types

\`\`\`
payment_intent.created
payment_intent.succeeded
payment_intent.payment_failed
payment_intent.canceled
charge.succeeded
charge.failed
charge.refunded
customer.created
customer.updated
payment_method.attached
payment_method.detached
\`\`\`

## Webhook Endpoint Registration

Merchants register a URL to receive events:

\`\`\`http
POST /api/v1/webhook-endpoints HTTP/1.1
Authorization: Bearer sk_live_abc123
Content-Type: application/json

{
  "url": "https://merchant.com/webhooks/payments",
  "events": [
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "charge.refunded"
  ],
  "description": "Production payment webhooks"
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created

{
  "id": "we_001",
  "url": "https://merchant.com/webhooks/payments",
  "events": ["payment_intent.succeeded", "payment_intent.payment_failed", "charge.refunded"],
  "secret": "whsec_abc123def456",
  "status": "enabled",
  "created_at": "2025-03-10T10:00:00Z"
}
\`\`\`

**The \`secret\` is returned only once** at creation time. It is used to verify webhook signatures.

## Webhook Delivery

When an event occurs, the system delivers it to all matching webhook endpoints:

\`\`\`http
POST https://merchant.com/webhooks/payments HTTP/1.1
Content-Type: application/json
Webhook-Id: evt_001
Webhook-Timestamp: 1710080460
Webhook-Signature: v1=5a4e3c2b1a...

{
  "id": "evt_001",
  "type": "payment_intent.succeeded",
  "created_at": "2025-03-10T14:31:00Z",
  "data": {
    "object": {
      "id": "pi_xyz789",
      "amount": 5000,
      "status": "succeeded"
    }
  }
}
\`\`\`

## Signature Verification

The merchant must verify every incoming webhook to prevent spoofing:

\`\`\`
signed_payload = webhook_timestamp + "." + raw_body
expected_signature = HMAC-SHA256(signed_payload, webhook_secret)

Verify:
1. expected_signature matches Webhook-Signature header
2. webhook_timestamp is within 5 minutes of current time (anti-replay)
\`\`\`

## Retry Policy

If the merchant's endpoint returns a non-2xx status, retry with exponential backoff:

\`\`\`
Attempt 1: Immediate
Attempt 2: 5 minutes
Attempt 3: 30 minutes
Attempt 4: 2 hours
Attempt 5: 8 hours
Attempt 6: 24 hours
(disable endpoint after 7 consecutive failures)
\`\`\`

**Webhook delivery status:**

\`\`\`http
GET /api/v1/webhook-endpoints/we_001/deliveries?limit=10

HTTP/1.1 200 OK
{
  "data": [
    {
      "id": "del_001",
      "event_id": "evt_001",
      "status": "succeeded",
      "http_status": 200,
      "attempts": 1,
      "delivered_at": "2025-03-10T14:31:01Z"
    },
    {
      "id": "del_002",
      "event_id": "evt_002",
      "status": "failed",
      "http_status": 500,
      "attempts": 3,
      "next_retry_at": "2025-03-10T17:00:00Z"
    }
  ]
}
\`\`\`

## Event Polling (Fallback)

Webhooks can fail. Merchants should also poll for events as a safety net:

\`\`\`http
GET /api/v1/events?type=payment_intent.succeeded&created_after=2025-03-10T14:00:00Z&limit=50
Authorization: Bearer sk_live_abc123

HTTP/1.1 200 OK
{
  "data": [
    { "id": "evt_001", "type": "payment_intent.succeeded", ... },
    { "id": "evt_003", "type": "payment_intent.succeeded", ... }
  ],
  "pagination": { "next_cursor": "...", "has_more": false }
}
\`\`\`

## Design Principles for Webhooks

1. **At-least-once delivery:** Webhooks may be delivered more than once. Merchants must handle duplicates (use event ID for deduplication).
2. **Signature verification:** Every webhook must be verifiable.
3. **Event ordering is not guaranteed.** Merchants should not depend on event order — use the event's \`created_at\` and the resource's current state.
4. **Include the full resource in the event.** Do not force merchants to make a follow-up API call to get details.
5. **Provide a polling fallback.** The \`/events\` endpoint lets merchants reconcile missed webhooks.`,
    },
    {
      id: "stripe-idempotency",
      slug: "stripe-idempotency",
      title: "Idempotency Keys & Error Handling",
      content: `# Idempotency Keys & Error Handling

In a payment API, a retry that creates a duplicate charge is catastrophic. Idempotency keys are not optional — they are the core safety mechanism.

## Idempotency Key Requirements

Every POST request that creates or mutates a resource MUST include an Idempotency-Key header:

\`\`\`http
POST /api/v1/payment-intents HTTP/1.1
Authorization: Bearer sk_live_abc123
Idempotency-Key: ik_order1234_v1
Content-Type: application/json

{
  "amount": 5000,
  "currency": "usd",
  "customer": "cus_abc123"
}
\`\`\`

**First call:** Creates the payment intent, stores result keyed by \`ik_order1234_v1\`.
**Retry with same key and same body:** Returns the stored result. No duplicate charge.

## Server-Side Flow

\`\`\`
1. Receive request with Idempotency-Key
2. Lock the key (distributed lock, e.g., Redis SETNX)
3. Check if key already has a stored result:
   a. YES + same params → return stored result (200)
   b. YES + different params → return 422 IDEMPOTENCY_KEY_REUSE
   c. NO → proceed to step 4
4. Execute the operation
5. Store the result with the key (TTL: 48 hours)
6. Release the lock
7. Return the result (201)
\`\`\`

## Error Scenarios

### Key Reuse with Different Parameters

\`\`\`http
POST /api/v1/payment-intents
Idempotency-Key: ik_order1234_v1
{ "amount": 7500, "currency": "usd" }   ← different amount!

HTTP/1.1 422 Unprocessable Entity
{
  "error": {
    "code": "IDEMPOTENCY_KEY_REUSE",
    "message": "This idempotency key was already used with different request parameters. Generate a new key for a new request."
  }
}
\`\`\`

### Concurrent Request with Same Key

\`\`\`http
HTTP/1.1 409 Conflict
{
  "error": {
    "code": "IDEMPOTENCY_KEY_IN_PROGRESS",
    "message": "A request with this idempotency key is currently being processed. Please retry in a moment.",
    "retry_after": 2
  }
}
\`\`\`

### Missing Idempotency Key

\`\`\`http
POST /api/v1/payment-intents
(no Idempotency-Key header)

HTTP/1.1 400 Bad Request
{
  "error": {
    "code": "MISSING_IDEMPOTENCY_KEY",
    "message": "POST requests require an Idempotency-Key header."
  }
}
\`\`\`

## Error Classification

Payment APIs must distinguish between retryable and non-retryable errors:

| HTTP Status | Retryable? | Client Action |
|-------------|-----------|---------------|
| 200, 201 | N/A | Success |
| 400 | No | Fix request and use new idempotency key |
| 401 | No | Fix authentication |
| 402 | No | Card declined — try different payment method |
| 404 | No | Resource does not exist |
| 409 | Yes | Retry with same key after short delay |
| 422 | No | Fix validation errors |
| 429 | Yes | Retry after Retry-After seconds |
| 500 | Yes | Retry with same idempotency key |
| 502, 503 | Yes | Retry with same idempotency key |

## Client Retry Strategy

\`\`\`
function chargeWithRetry(params, idempotencyKey, maxRetries = 5):
  for attempt in 1..maxRetries:
    response = POST /payment-intents
      headers: { Idempotency-Key: idempotencyKey }
      body: params

    if response.status in [200, 201]:
      return response  // Success

    if response.status in [400, 401, 402, 404, 422]:
      throw NonRetryableError(response)  // Fix and retry with new key

    if response.status == 429:
      sleep(response.headers["Retry-After"])
      continue

    if response.status in [409, 500, 502, 503]:
      sleep(exponentialBackoff(attempt) + jitter())
      continue  // Retry with SAME idempotency key

  throw MaxRetriesExceeded()
\`\`\`

## Financial Safety Checklist

In interviews, mention these safety properties:

1. **No double charges:** Idempotency keys prevent duplicate payment creation
2. **No lost payments:** Webhook + polling ensures merchants learn about every payment outcome
3. **No phantom money:** Amounts are integers (cents), never floating point
4. **Audit trail:** Every event is logged and retrievable via \`/events\`
5. **Graceful degradation:** If a payment processor is down, return 503 with retry guidance, never silently fail

These patterns are why Stripe is considered the gold standard for API design, and why interviewers love asking about payment APIs.`,
    },
    {
      id: "stripe-walkthrough",
      slug: "stripe-walkthrough",
      title: "API Walkthrough & Trade-offs",
      content: `# Stripe API: Walkthrough & Trade-offs

Let us review the complete payment API design and discuss the trade-offs interviewers would probe.

## Complete Endpoint Summary

| Category | Method | Endpoint | Idempotent | Auth |
|----------|--------|----------|-----------|------|
| **Customers** | POST | /customers | Key required | Secret |
| | GET | /customers/{id} | Naturally | Secret |
| | PATCH | /customers/{id} | Key required | Secret |
| | DELETE | /customers/{id} | Naturally | Secret |
| **Payment Methods** | POST | /payment-methods | Key required | Secret |
| | GET | /payment-methods/{id} | Naturally | Secret |
| | POST | /payment-methods/{id}/attach | Key required | Secret |
| | POST | /payment-methods/{id}/detach | Key required | Secret |
| **Payment Intents** | POST | /payment-intents | Key required | Secret |
| | GET | /payment-intents/{id} | Naturally | Secret or Publishable |
| | POST | /payment-intents/{id}/confirm | Key required | Secret or Publishable |
| | POST | /payment-intents/{id}/cancel | Key required | Secret |
| **Refunds** | POST | /refunds | Key required | Secret |
| | GET | /refunds/{id} | Naturally | Secret |
| **Events** | GET | /events | Naturally | Secret |
| **Webhooks** | POST | /webhook-endpoints | Key required | Secret |
| | DELETE | /webhook-endpoints/{id} | Naturally | Secret |

## End-to-End Payment Flow

\`\`\`
1. Merchant creates customer:
   POST /customers { email, name }
   → cus_abc123

2. Customer adds payment method (client-side tokenization):
   POST /payment-methods { type: "card", token: "tok_visa" }
   POST /payment-methods/pm_001/attach { customer: "cus_abc123" }

3. Merchant creates payment intent:
   POST /payment-intents { amount: 5000, currency: "usd", customer: "cus_abc123" }
   Idempotency-Key: ik_order1234
   → pi_xyz789 (status: requires_confirmation)

4. Merchant confirms payment:
   POST /payment-intents/pi_xyz789/confirm { payment_method: "pm_001" }
   → status: processing → succeeded
   → Event: payment_intent.succeeded → webhook delivered

5. If needed, merchant issues refund:
   POST /refunds { payment_intent: "pi_xyz789", amount: 2000 }
   → Partial refund of $20.00
   → Event: charge.refunded → webhook delivered
\`\`\`

## Trade-offs to Discuss

### 1. Two-Step vs One-Step Payments

| Approach | Pros | Cons |
|----------|------|------|
| Two-step (intent + confirm) | Supports holds, 3DS, validation | More API calls |
| One-step (charge directly) | Simpler | No hold support, no client-side auth |

**Our choice:** Two-step. The flexibility is essential for real payment scenarios. One-step can be offered as a convenience wrapper.

### 2. Webhook vs Polling

| Approach | Pros | Cons |
|----------|------|------|
| Webhooks | Real-time, push-based | Endpoint must be available, ordering issues |
| Polling | Simple, reliable, merchant-controlled | Latency, wasted requests |

**Our choice:** Both. Webhooks for real-time, polling via \`/events\` as a reconciliation fallback. This is defense in depth.

### 3. Storing Full Card Data vs Tokenization

We never store or transmit full card numbers through our API. Instead:
- Client-side JavaScript collects card details
- Card data is tokenized before reaching the merchant's server
- Only tokens and last4 digits flow through the API

This keeps the merchant out of PCI scope.

### 4. Integer Cents vs Decimal Dollars

\`\`\`
{ "amount": 5000 }     ← Our choice: integer cents
{ "amount": "50.00" }  ← Alternative: string decimal
{ "amount": 50.00 }    ← Dangerous: floating point
\`\`\`

Integer cents eliminate floating-point arithmetic errors entirely. $19.99 + $0.01 = $20.00 is trivial with integers (1999 + 1 = 2000) but error-prone with floats.

### 5. API Key Types

\`\`\`
sk_live_... → Secret key (server-side only, full access)
pk_live_... → Publishable key (client-side, limited to tokenization)
sk_test_... → Secret test key (sandbox environment)
pk_test_... → Publishable test key (sandbox)
\`\`\`

The prefix convention instantly tells developers which key type they are using and whether they are in production or test mode. This prevents accidental live charges during development.

## What Makes This a Great Interview Answer

1. **State machine for PaymentIntent** — shows you understand payment lifecycle
2. **Idempotency on every mutation** — shows financial safety awareness
3. **Webhook + polling** — shows defense in depth
4. **Integer amounts** — shows attention to correctness
5. **Prefixed IDs** — shows developer experience awareness
6. **Error classification** — shows you understand the client's retry needs
7. **PCI considerations** — shows security awareness

A payment API design that covers these points demonstrates the depth interviewers are looking for.`,
    },
  ],
};
