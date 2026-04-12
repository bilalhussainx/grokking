import { Module } from "../types";

export const stripeApiModule: Module = {
  id: "design-stripe-api",
  title: "Design Stripe API",
  description: "Design a payment processing API inspired by Stripe — payment intents, webhooks, idempotency, and financial safety patterns.",
  lessons: [
    {
      id: "stripe-requirements",
      slug: "stripe-requirements",
      title: "Requirements & Resource Modeling",
      content: `Payment APIs are among the most demanding to design. They require correctness guarantees that most APIs do not: money cannot be lost, duplicated, or incorrectly attributed. This makes it an excellent interview question — and the decisions you make here reveal your understanding of distributed systems, security, and API ergonomics.

\`\`\`concept
{ "title": "The Core Constraint of Financial APIs", "variant": "rule", "content": "Every mutating operation in a payment API must be idempotent. Network failures and retries are not edge cases — they are the norm. If a confirm request times out and the client retries, you cannot charge the customer twice. Your schema and infrastructure must make double-charging impossible, not just unlikely." }
\`\`\`

## Step 1: Clarify Requirements

In an interview, you clarify before you design. Push back on vague prompts — "design Stripe" is too broad. Drive it to a bounded scope.

**Functional Requirements:**
- Merchants can create payment intents (authorize a charge)
- Payments can be confirmed (capture the charge)
- Support for refunds (full and partial)
- Webhook delivery for payment events
- Customer and payment method management

**Non-Functional Requirements:**
- Every mutating operation must be idempotent
- Eventual consistency is acceptable for reads; writes must be strongly consistent
- All amounts stored in smallest currency unit (cents, not dollars)
- PCI DSS compliance considerations baked into the API design

\`\`\`callout
{ "type": "tip", "title": "Interview Signal: Raise NFRs Unprompted", "content": "Interviewers are looking for whether you surface idempotency, consistency boundaries, and security constraints *before* they ask. Listing these non-functional requirements early — especially idempotency and PCI scope — signals senior-level thinking. Candidates who jump straight to endpoints frequently miss them entirely." }
\`\`\`

## Step 2: Identify Resources

REST resource design maps business entities to URIs. Each resource is a noun — actions happen via HTTP methods against those nouns. Start here before designing any endpoints.

\`\`\`sysdiag
{ "title": "Payment API Resource Map", "width": 680, "height": 370, "nodes": [ { "id": "customer", "label": "Customer\\ncus_*", "x": 100, "y": 185, "kind": "service" }, { "id": "pm", "label": "PaymentMethod\\npm_*", "x": 310, "y": 75, "kind": "service" }, { "id": "pi", "label": "PaymentIntent\\npi_*", "x": 310, "y": 295, "kind": "service" }, { "id": "refund", "label": "Refund\\nre_*", "x": 530, "y": 295, "kind": "service" }, { "id": "event", "label": "Event", "x": 530, "y": 120, "kind": "service" }, { "id": "webhook", "label": "Webhook Endpoint", "x": 530, "y": 210, "kind": "service" } ], "edges": [ { "from": "customer", "to": "pm", "label": "has" }, { "from": "customer", "to": "pi", "label": "initiates" }, { "from": "pm", "to": "pi", "label": "funds" }, { "from": "pi", "to": "refund", "label": "generates" }, { "from": "pi", "to": "event", "label": "emits" }, { "from": "event", "to": "webhook", "label": "delivers to" } ], "annotations": { "customer": "Represents a merchant's end-user. Owns payment methods and initiates payment intents.", "pm": "A saved payment instrument. Never exposes raw card numbers — only last4, brand, and expiry per PCI DSS.", "pi": "The central object. Tracks a payment attempt through its full lifecycle from authorization to settlement.", "refund": "Created against a succeeded PaymentIntent. Can be full or partial — both are first-class resources.", "event": "Immutable audit log entry emitted on every state change. Source of truth for reconciliation.", "webhook": "Merchant-registered HTTPS endpoint that receives event notifications asynchronously." } }
\`\`\`

## Step 3: Resource Schemas

\`\`\`tabs
{ "tabs": [ { "label": "Customer", "icon": "👤", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"cus_abc123\\",\\n  \\"email\\": \\"jane@example.com\\",\\n  \\"name\\": \\"Jane Doe\\",\\n  \\"default_payment_method\\": \\"pm_card_visa\\",\\n  \\"metadata\\": { \\"internal_id\\": \\"12345\\" },\\n  \\"created_at\\": \\"2025-01-15T10:00:00Z\\"\\n}\\n\`\`\`\\n\\nThe \`metadata\` field is free-form key-value storage. It lets merchants attach their own identifiers (order IDs, internal user IDs) without requiring the payment API to model their business domain. The API stays generic; merchants stay in control of their data model." }, { "label": "PaymentMethod", "icon": "💳", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"pm_card_visa\\",\\n  \\"type\\": \\"card\\",\\n  \\"card\\": {\\n    \\"brand\\": \\"visa\\",\\n    \\"last4\\": \\"4242\\",\\n    \\"exp_month\\": 12,\\n    \\"exp_year\\": 2027,\\n    \\"funding\\": \\"credit\\"\\n  },\\n  \\"customer\\": \\"cus_abc123\\",\\n  \\"created_at\\": \\"2025-01-15T10:05:00Z\\"\\n}\\n\`\`\`\\n\\n**PCI DSS constraint:** The API never returns full card numbers. Only \`last4\`, \`brand\`, and expiry are exposed. Raw PANs (Primary Account Numbers) are tokenized at the card vault layer and never stored in or returned by your application." }, { "label": "PaymentIntent", "icon": "🔄", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"pi_xyz789\\",\\n  \\"amount\\": 5000,\\n  \\"currency\\": \\"usd\\",\\n  \\"status\\": \\"requires_confirmation\\",\\n  \\"customer\\": \\"cus_abc123\\",\\n  \\"payment_method\\": \\"pm_card_visa\\",\\n  \\"description\\": \\"Order #1234\\",\\n  \\"metadata\\": { \\"order_id\\": \\"ord_1234\\" },\\n  \\"amount_received\\": 0,\\n  \\"created_at\\": \\"2025-03-10T14:30:00Z\\"\\n}\\n\`\`\`\\n\\n\`amount: 5000\` = **$50.00 USD**. Integer cents eliminate floating-point errors — a critical correctness requirement for financial systems. \`amount_received\` tracks what has actually settled, which may differ from \`amount\` in partial capture or refund scenarios." } ] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "PCI DSS: The Card Vault Boundary", "content": "Your API should never accept, store, or return a full 16-digit card number (PAN). Raw PANs flow only to a PCI-compliant card vault — Stripe's own infrastructure, or a provider like Spreedly or Braintree. The vault returns an opaque token; that token becomes your PaymentMethod ID. The \`last4\` + \`brand\` pattern in the schema is not cosmetic — it is a compliance boundary that must be enforced at the data model level." }
\`\`\`

## Step 4: PaymentIntent State Machine

The \`status\` field is a strict state machine. Not every transition is valid — a \`failed\` intent cannot be retried in place. This immutability is intentional: failed intents are audit records.

\`\`\`mermaid
stateDiagram-v2
    [*] --> requires_payment_method : POST /payment-intents
    requires_payment_method --> requires_confirmation : payment method attached
    requires_confirmation --> processing : POST .../confirm
    requires_confirmation --> canceled : POST .../cancel
    processing --> succeeded : bank authorizes
    processing --> failed : bank declines
    processing --> canceled : POST .../cancel
    succeeded --> partially_refunded : partial refund created
    partially_refunded --> refunded : remaining balance refunded
    succeeded --> refunded : full refund created
\`\`\`

\`\`\`concept
{ "title": "Authorization vs. Capture: Why Two Steps?", "variant": "mental-model", "content": "The intent → confirm split maps to card network concepts. *Authorization* holds funds and verifies the card is valid. *Capture* actually moves the money. Separating them enables hold-then-charge workflows: a hotel authorizes $500 at check-in but only captures the actual room cost at checkout. A pre-order authorizes at purchase time but captures when the item ships. Without this split, every payment is a one-shot, all-or-nothing operation." }
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

Note the action sub-resources: \`/confirm\` and \`/cancel\` are verb-based endpoints on a noun resource. This is an accepted REST pattern when the action represents a meaningful state transition that cannot be expressed as a simple field update via PATCH.

## Key Design Decisions

\`\`\`steps
{ "title": "Four Decisions Worth Explaining in an Interview", "steps": [ { "title": "Amounts in Cents (Integer, Not Float)", "content": "\`5000\` means $50.00. This is not arbitrary — floating-point arithmetic is non-deterministic at scale. \`0.1 + 0.2 !== 0.3\` in most languages. For financial systems, **all amounts must be integers in the smallest currency unit**. Store, transmit, and compute in cents. Convert to display strings (\\"$50.00\\") only at the presentation layer, never in business logic." }, { "title": "Two-Step Payment (Intent → Confirm)", "content": "Separates *authorization* from *capture*, enabling:\\n- **Hotel/gas pre-authorizations** — hold more than you'll charge, settle the actual amount later\\n- **Pre-orders** — authorize at purchase, capture at ship time\\n- **Fraud review windows** — authorize immediately, hold capture until a manual review completes\\n\\nThis also means a failed confirmation does not require a new charge attempt from scratch — the intent persists in \`requires_confirmation\` until the customer provides a valid payment method." }, { "title": "Free-Form Metadata Field", "content": "A \`metadata\` object on every resource (string key-value pairs) lets merchants attach their internal identifiers without requiring the payment API to model their domain. An e-commerce platform stores \`order_id\`. A SaaS stores \`subscription_id\`. A marketplace stores both \`buyer_id\` and \`seller_id\`. The API stays generic; merchants own their data model. This is a classic API design pattern for extensibility without schema proliferation." }, { "title": "Prefixed IDs", "content": "\`cus_\`, \`pi_\`, \`pm_\`, \`re_\` — the prefix encodes the resource type into the identifier itself. In logs, you can instantly distinguish a customer ID from a payment intent ID without querying the database. This is especially valuable when IDs appear in error messages, webhook payloads, or support tickets. It also prevents a category of bugs where an ID from one resource type is accidentally passed to an endpoint expecting a different type." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "A PaymentIntent has \`amount: 7500\` and \`currency: \\"usd\\"\`. What is the actual charge?", "options": ["$7,500.00", "$750.00", "$75.00", "$7.50"], "answer": 2, "explanation": "$75.00. Payment APIs store amounts in the smallest currency unit. For USD that is cents: 7500 cents = $75.00. This integer representation eliminates floating-point errors that would be catastrophic in financial arithmetic." }, { "question": "A merchant's checkout times out after POST /payment-intents/{id}/confirm. The client retries the identical request. What prevents the customer from being charged twice?", "options": ["HTTP 409 Conflict response on the second call", "An idempotency key sent in the request header", "The PaymentIntent status machine blocking re-confirmation", "Webhook deduplication on the merchant side"], "answer": 1, "explanation": "An idempotency key (typically a UUID sent in an Idempotency-Key header) causes the server to recognize the retry as the same logical operation and return the original response without reprocessing. The status machine alone cannot prevent double-processing on concurrent retries that arrive before the first has completed — the idempotency layer at the storage level does." }, { "question": "Which PaymentIntent status transition is INVALID according to the state machine?", "options": ["requires_confirmation → canceled", "processing → succeeded", "succeeded → partially_refunded", "failed → processing"], "answer": 3, "explanation": "Once a PaymentIntent reaches \`failed\`, it is terminal — you cannot retry it. The merchant must create a new PaymentIntent. Failed intents are immutable audit records, not mutable objects to retry in place. This is a deliberate design decision that protects the integrity of the audit trail." }, { "question": "Why does the PaymentMethod schema expose \`card.last4\` instead of the full card number?", "options": ["To reduce JSON payload size", "PCI DSS compliance — raw PANs must not be stored or returned by merchant systems", "To prevent merchants from contacting card issuers directly", "The full number is only available via a separate tokenization endpoint"], "answer": 1, "explanation": "PCI DSS (Payment Card Industry Data Security Standard) prohibits storing or transmitting full Primary Account Numbers in merchant systems. Raw card data flows only to a PCI-compliant card vault, which issues an opaque token. The API exposes only last4, brand, and expiry — enough to show users which card is on file, not enough to misuse." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Model resources and their lifecycles before designing any endpoints — the state machine often reveals missing requirements", "PaymentIntent is the central object: it tracks a payment from creation through settlement and drives the status state machine", "Store amounts as integers in the smallest currency unit (cents) — floating-point is never acceptable in financial systems", "The intent → confirm two-step maps to card network authorization and capture, enabling hold-then-charge workflows", "Idempotency is non-negotiable — every mutating endpoint must support idempotency keys to survive network retries safely", "PCI DSS shapes the schema: raw card numbers never appear in API responses; only tokens and masked display data (last4, brand, expiry)" ] }
\`\`\``,
    },
    {
      id: "stripe-payment-intent",
      slug: "stripe-payment-intent",
      title: "Payment Intent Flow",
      content: `# Payment Intent Flow

\`\`\`concept
{ "title": "PaymentIntent as a State Machine", "variant": "mental-model", "content": "A PaymentIntent is not a simple request — it's a durable object that tracks a payment through its entire lifecycle. Every API call transitions it between states. Think of it like a court case: filing creates the case, evidence is gathered (auth), a verdict is reached (succeeded/canceled), and the record is permanent regardless of outcome." }
\`\`\`

The PaymentIntent is the central resource in the Stripe-style payment API. It represents a single payment attempt and owns the full audit trail — from the first authorization request to the final capture or cancellation.

## The State Machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> requires_payment_method : POST /payment-intents
    requires_payment_method --> requires_confirmation : payment_method attached
    requires_confirmation --> requires_action : 3DS / SCA triggered
    requires_action --> requires_confirmation : authentication completes
    requires_confirmation --> processing : confirm called (async methods)
    requires_confirmation --> succeeded : confirm called (sync card)
    processing --> succeeded : async confirmation arrives
    processing --> requires_payment_method : async failure
    requires_confirmation --> requires_payment_method : card declined
    requires_payment_method --> canceled : cancel called
    requires_confirmation --> canceled : cancel called
    succeeded --> [*]
    canceled --> [*]
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why so many states?", "content": "Each state models a real-world pause point: waiting for the customer to enter a card, waiting for 3D Secure authentication, waiting for a bank ACH to settle. The state machine makes each pause explicit, so your server and the payment processor stay in sync even across network failures." }
\`\`\`

## Create a PaymentIntent

\`\`\`tabs
{ "tabs": [
  { "label": "Request", "icon": "📤", "content": "\`\`\`http\\nPOST /api/v1/payment-intents HTTP/1.1\\nAuthorization: Bearer sk_live_abc123\\nIdempotency-Key: ik_order1234_attempt1\\nContent-Type: application/json\\n\\n{\\n  \\"amount\\": 5000,\\n  \\"currency\\": \\"usd\\",\\n  \\"customer\\": \\"cus_abc123\\",\\n  \\"payment_method\\": \\"pm_card_visa\\",\\n  \\"description\\": \\"Order #1234\\",\\n  \\"metadata\\": { \\"order_id\\": \\"ord_1234\\" },\\n  \\"capture_method\\": \\"manual\\"\\n}\\n\`\`\`\\n\\n**Field notes:**\\n- \`amount\` is always in the currency's **smallest unit** — cents for USD, pence for GBP, yen for JPY (no decimal).\\n- \`metadata\` is a free-form key/value store. Use it to attach your internal IDs so you can reconcile payments without a separate lookup table.\\n- \`capture_method: \\"manual\\"\` triggers an authorization-only hold. The merchant must explicitly call \`/confirm\` to capture." },
  { "label": "Response", "icon": "📥", "content": "\`\`\`http\\nHTTP/1.1 201 Created\\nLocation: /api/v1/payment-intents/pi_xyz789\\n\\n{\\n  \\"id\\": \\"pi_xyz789\\",\\n  \\"amount\\": 5000,\\n  \\"currency\\": \\"usd\\",\\n  \\"status\\": \\"requires_confirmation\\",\\n  \\"customer\\": \\"cus_abc123\\",\\n  \\"payment_method\\": \\"pm_card_visa\\",\\n  \\"capture_method\\": \\"manual\\",\\n  \\"amount_capturable\\": 5000,\\n  \\"amount_received\\": 0,\\n  \\"description\\": \\"Order #1234\\",\\n  \\"metadata\\": { \\"order_id\\": \\"ord_1234\\" },\\n  \\"created_at\\": \\"2025-03-10T14:30:00Z\\"\\n}\\n\`\`\`\\n\\nNote \`amount_capturable: 5000\` and \`amount_received: 0\` — the funds are reserved but not yet moved. The status \`requires_confirmation\` means the PaymentIntent is ready to be confirmed but has not been submitted to the card network." }
] }
\`\`\`

### \`capture_method\` Options

| Value | Behavior | Use Case |
|-------|----------|----------|
| \`automatic\` | Captured immediately upon confirmation | E-commerce, SaaS subscriptions |
| \`manual\` | Authorization only — you call \`/confirm\` to capture | Hotels, car rentals, variable-amount orders |

## Confirm (Capture) a Payment

\`\`\`steps
{ "title": "Two-Step Flow: Create → Confirm", "steps": [
  { "title": "Create — reserve the funds", "content": "\`POST /payment-intents\` sends the authorization request to the card network. The bank places a **hold** on the customer's funds. No money moves yet.\\n\\nThis is your window to:\\n- Validate inventory\\n- Trigger 3D Secure / SCA if required\\n- Collect the final amount (e.g., after shipping calc)" },
  { "title": "Confirm — capture the authorization", "content": "\`\`\`http\\nPOST /api/v1/payment-intents/pi_xyz789/confirm HTTP/1.1\\nAuthorization: Bearer sk_live_abc123\\nIdempotency-Key: ik_confirm_pi_xyz789\\n\\n{ \\"payment_method\\": \\"pm_card_visa\\" }\\n\`\`\`\\n\\nOn success:\\n\`\`\`http\\nHTTP/1.1 200 OK\\n{\\n  \\"id\\": \\"pi_xyz789\\",\\n  \\"status\\": \\"succeeded\\",\\n  \\"amount_received\\": 5000,\\n  \\"charges\\": [\\n    {\\n      \\"id\\": \\"ch_001\\",\\n      \\"amount\\": 5000,\\n      \\"status\\": \\"succeeded\\",\\n      \\"payment_method\\": \\"pm_card_visa\\",\\n      \\"created_at\\": \\"2025-03-10T14:31:00Z\\"\\n    }\\n  ]\\n}\\n\`\`\`\\n\\nMoney moves. The charge record is created as a child of the PaymentIntent." },
  { "title": "Cancel — release the hold (optional)", "content": "If you decide not to fulfill the order, cancel before capture to release the authorization:\\n\\n\`\`\`http\\nPOST /api/v1/payment-intents/pi_xyz789/cancel\\nAuthorization: Bearer sk_live_abc123\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"id\\": \\"pi_xyz789\\",\\n  \\"status\\": \\"canceled\\",\\n  \\"cancellation_reason\\": \\"requested_by_customer\\"\\n}\\n\`\`\`\\n\\nCanceling an authorized-but-uncaptured PaymentIntent is **free** — no charge is created and the hold is released (timing depends on the issuing bank, typically 1-7 days)." }
] }
\`\`\`

## Payment Failures

When confirmation fails, the PaymentIntent transitions back to \`requires_payment_method\` — not to a terminal \`failed\` state. The intent stays alive so the customer can retry with a different card.

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
| \`insufficient_funds\` | Not enough balance | Prompt for different card |
| \`expired_card\` | Card has expired | Update payment method |
| \`incorrect_cvc\` | CVC mismatch | Re-enter card details |
| \`processing_error\` | Bank processing issue | Retry with exponential backoff |
| \`fraudulent\` | Suspected fraud | Do not retry — contact bank |

\`\`\`callout
{ "type": "warning", "title": "Never retry 'fraudulent' declines automatically", "content": "Retrying a \`fraudulent\` decline will not succeed and may trigger additional fraud signals from the bank. Surface a human-readable message to the customer and let them contact their bank. Automated retry loops on fraud declines can get your merchant account flagged." }
\`\`\`

## List PaymentIntents

\`\`\`http
GET /api/v1/payment-intents?customer=cus_abc123&status=succeeded&limit=10
Authorization: Bearer sk_live_abc123

HTTP/1.1 200 OK
{
  "data": [
    { "id": "pi_xyz789", "amount": 5000, "status": "succeeded" },
    { "id": "pi_xyz790", "amount": 3000, "status": "succeeded" }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6InBpX3h5ejc5MCJ9",
    "has_more": true
  }
}
\`\`\`

Cursor-based pagination (\`next_cursor\`) is stable under concurrent inserts — unlike offset pagination, a new payment arriving while you page through results won't cause you to skip or double-count rows.

## Why the Two-Step Design?

\`\`\`concept
{ "title": "Authorization ≠ Capture", "variant": "rule", "content": "Splitting create and confirm is an industry standard (not just Stripe). It maps directly to how card networks work: an authorization reserves funds at the issuing bank; a capture moves those funds to the merchant's acquirer. The API exposes this distinction so your application can insert business logic between the two steps." }
\`\`\`

The two-step flow unlocks four capabilities you cannot achieve with a single atomic charge:

1. **Pre-authorization** — Hold funds without charging (hotels reserve the card on check-in, capture on check-out)
2. **Client-side authentication** — Mobile apps collect 3D Secure / SCA between create and confirm without losing the authorization
3. **Server-side validation** — Confirm inventory, recalculate shipping, or run fraud checks before money moves
4. **Partial capture** — Authorize $100, capture only $80 if one line item went out of stock

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Anti-pattern: charge first, validate later", "code": "// Charges immediately — no window to validate inventory\\nPOST /charges\\n{ \\"amount\\": 5000, \\"source\\": \\"tok_visa\\" }\\n\\n// Now check inventory...\\n// Out of stock? Now you need a refund.\\n// Refunds take 5-10 days. Customer is unhappy." }, "after": { "label": "Pattern: authorize → validate → capture", "code": "// Step 1: reserve funds\\nPOST /payment-intents\\n{ \\"amount\\": 5000, \\"capture_method\\": \\"manual\\" }\\n\\n// Step 2: check inventory, calculate final amount\\n// All good? Capture only what you're shipping.\\nPOST /payment-intents/pi_xyz789/confirm\\n{ \\"amount_to_capture\\": 4200 }  // partial capture\\n\\n// Out of stock? Cancel — no refund needed." } }
\`\`\`

## Asynchronous Updates via Webhooks

For robust fulfillment, never rely solely on the API response to determine final payment status. Use webhooks:

\`\`\`callout
{ "type": "tip", "title": "Server-side fulfillment via webhooks", "content": "Subscribe to \`payment_intent.succeeded\` and \`payment_intent.payment_failed\` events. When your server receives \`payment_intent.succeeded\`, mark the order as paid and trigger fulfillment. This handles edge cases: the customer closes the browser after payment, network timeouts during confirm, or asynchronous payment methods (ACH, SEPA) that settle hours later." }
\`\`\`

Polling the API for status updates instead of webhooks is unreliable under load — it introduces race conditions and can hit rate limits during traffic spikes.

\`\`\`quiz
{ "title": "Payment Intent Flow — Check Your Understanding", "questions": [
  { "question": "A PaymentIntent is created with \`capture_method: 'manual'\` and the customer's card is authorized. The merchant then discovers the item is out of stock. What is the correct action and why?", "options": ["Charge the card and issue a refund immediately", "Call /cancel on the PaymentIntent to release the authorization hold", "Leave the PaymentIntent open; it will expire automatically within 24 hours", "Call /confirm to complete the charge, then create a dispute"], "answer": 1, "explanation": "Canceling the PaymentIntent before capture releases the authorization hold at no cost and with no charge created. A refund would require funds to have moved first, adding 5-10 days of delay and a poor customer experience. Authorization holds do expire, but their timing (typically 7 days) is bank-controlled and unreliable to depend on." },
  { "question": "A card is declined with \`decline_code: 'insufficient_funds'\`. What is the PaymentIntent's status after this response?", "options": ["failed (terminal)", "canceled", "requires_payment_method", "requires_action"], "answer": 2, "explanation": "\`requires_payment_method\` — the intent stays alive so the customer can supply a different payment method and retry without creating a new PaymentIntent. There is no terminal \`failed\` status; the intent only becomes \`canceled\` when explicitly canceled or when it expires." },
  { "question": "Why does the List PaymentIntents endpoint use cursor-based pagination (\`next_cursor\`) rather than offset-based pagination (\`?page=2\`)?", "options": ["Cursors are simpler to implement server-side", "Offset pagination is stable under concurrent inserts; cursors are not", "Cursor pagination avoids skipping or double-counting rows when new records are inserted during paging", "Cursors allow random access to any page; offsets do not"], "answer": 2, "explanation": "Offset pagination calculates rows to skip by position. If a new PaymentIntent is inserted while you're paging, every subsequent page shifts by one row — causing skips or duplicates. Cursors encode the last-seen ID, so pagination is anchored to a stable position in the dataset regardless of concurrent inserts." },
  { "question": "Which webhook event should trigger server-side order fulfillment?", "options": ["payment_intent.created", "payment_intent.processing", "payment_intent.succeeded", "charge.captured"], "answer": 2, "explanation": "\`payment_intent.succeeded\` is the authoritative signal that funds have been captured and the payment is complete. \`processing\` means the payment was submitted but not yet settled (common for ACH/SEPA). \`charge.captured\` fires for the child charge object, but fulfillment logic is best anchored to the parent PaymentIntent's terminal state." }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "A PaymentIntent is a durable state machine — each API action transitions it between well-defined states, providing a full audit trail.",
  "The create → confirm two-step maps to the card network's authorization/capture distinction, giving you a window to validate inventory, run fraud checks, or collect 3DS authentication.",
  "Declined PaymentIntents return to \`requires_payment_method\` (not a terminal state) so customers can retry with a new card without losing the payment context.",
  "Use webhooks (\`payment_intent.succeeded\`) for server-side fulfillment — never rely solely on the synchronous API response, especially for async payment methods.",
  "Idempotency keys on every mutating request prevent duplicate charges when network errors cause your server to retry the same operation."
] }
\`\`\``,
    },
    {
      id: "stripe-webhooks",
      slug: "stripe-webhooks",
      title: "Webhook Design & Event System",
      content: `# Webhook Design & Event System

Webhooks are the nervous system of a payment API. Because many payment outcomes are asynchronous — bank processing, fraud screening, dispute resolution — merchants can't simply poll for results. Instead, the API pushes an HTTP POST to a merchant-registered URL the moment a relevant state change occurs.

\`\`\`concept
{ "title": "Push vs Pull", "variant": "analogy", "content": "Polling is like checking your mailbox every 5 minutes. Webhooks are like email: the system notifies you the moment something arrives. For payment events that may take minutes or hours, push beats pull on every dimension — latency, cost, and correctness." }
\`\`\`

## The Event Resource

Every observable state change in the system produces an immutable **Event** object. Events are facts, not commands — they describe what happened, not what to do next.

\`\`\`json
{
  "id": "evt_001",
  "type": "payment_intent.succeeded",
  "created_at": "2025-03-10T14:31:00Z",
  "api_version": "2025-03-01",
  "data": {
    "object": {
      "id": "pi_xyz789",
      "amount": 5000,
      "currency": "usd",
      "status": "succeeded",
      "customer": "cus_abc123"
    }
  }
}
\`\`\`

The \`api_version\` field is critical: it pins the event schema to the API version active when the event fired. Merchants are shielded from breaking schema changes even if they upgrade their API version later.

\`\`\`tabs
{ "tabs": [
  {
    "label": "Payment Intent Events",
    "icon": "💳",
    "content": "\`\`\`\\npayment_intent.created\\npayment_intent.succeeded\\npayment_intent.payment_failed\\npayment_intent.canceled\\n\`\`\`"
  },
  {
    "label": "Charge Events",
    "icon": "⚡",
    "content": "\`\`\`\\ncharge.succeeded\\ncharge.failed\\ncharge.refunded\\n\`\`\`"
  },
  {
    "label": "Customer & Method Events",
    "icon": "👤",
    "content": "\`\`\`\\ncustomer.created\\ncustomer.updated\\npayment_method.attached\\npayment_method.detached\\n\`\`\`"
  }
] }
\`\`\`

## Registering a Webhook Endpoint

Merchants register the URL they want events delivered to, along with a filter for which event types they care about.

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

The response returns a **signing secret** — returned exactly once, never again:

\`\`\`json
{
  "id": "we_001",
  "url": "https://merchant.com/webhooks/payments",
  "events": ["payment_intent.succeeded", "payment_intent.payment_failed", "charge.refunded"],
  "secret": "whsec_abc123def456",
  "status": "enabled",
  "created_at": "2025-03-10T10:00:00Z"
}
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "Secret exposure window", "content": "The \`secret\` field is returned **only at creation time**. Store it immediately in your secrets manager. If lost, you must rotate it — the endpoint will be unverifiable until you do. Never log or expose the secret in client-side code." }
\`\`\`

## Webhook Delivery & Signature Verification

When an event fires, the platform POSTs to all matching endpoints with three security headers added to every request.

\`\`\`http
POST https://merchant.com/webhooks/payments HTTP/1.1
Content-Type: application/json
Webhook-Id: evt_001
Webhook-Timestamp: 1710080460
Webhook-Signature: v1=5a4e3c2b1a...

{
  "id": "evt_001",
  "type": "payment_intent.succeeded",
  ...
}
\`\`\`

\`\`\`steps
{ "title": "How to verify a webhook signature", "steps": [
  {
    "title": "Reconstruct the signed payload",
    "content": "Concatenate the raw \`Webhook-Timestamp\` header value, a literal \`.\`, and the **raw** (not parsed) request body:\\n\\n\`\`\`\\nsigned_payload = webhook_timestamp + \\".\\" + raw_body\\n\`\`\`\\n\\nParsing JSON before hashing will cause verification to fail if key ordering changes."
  },
  {
    "title": "Compute the expected HMAC",
    "content": "Apply HMAC-SHA256 using your \`whsec_...\` signing secret as the key:\\n\\n\`\`\`\\nexpected_sig = HMAC-SHA256(signed_payload, webhook_secret)\\n\`\`\`\\n\\nUse a **constant-time comparison** (e.g. \`hmac.compare_digest\` in Python) to avoid timing attacks."
  },
  {
    "title": "Compare signatures",
    "content": "Check that \`expected_sig\` matches the \`v1=...\` value in the \`Webhook-Signature\` header. The \`v1=\` prefix allows the platform to add future signature schemes without breaking existing integrations."
  },
  {
    "title": "Validate the timestamp (anti-replay)",
    "content": "Reject any request where \`|now() - Webhook-Timestamp| > 300 seconds\` (5 minutes). This prevents an attacker from capturing a valid webhook and replaying it hours later."
  },
  {
    "title": "Return 2xx immediately",
    "content": "Respond with \`200 OK\` as fast as possible — before doing any heavy processing. Push work to a background queue. If you spend 30 seconds processing inline, you'll hit timeouts and trigger unnecessary retries."
  }
] }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Vulnerable handler", "code": "# WRONG: no signature check, timing-unsafe compare\\n@app.route('/webhooks', methods=['POST'])\\ndef handle_webhook():\\n    payload = request.get_json()\\n    # Process directly — no verification\\n    handle_event(payload)\\n    return '', 200" }, "after": { "label": "Secure handler", "code": "import hmac, hashlib, time\\n\\n@app.route('/webhooks', methods=['POST'])\\ndef handle_webhook():\\n    raw_body = request.get_data()\\n    timestamp = request.headers.get('Webhook-Timestamp', '')\\n    signature = request.headers.get('Webhook-Signature', '')\\n\\n    # Anti-replay check\\n    if abs(time.time() - int(timestamp)) > 300:\\n        return 'Timestamp too old', 400\\n\\n    # Reconstruct and verify (constant-time compare)\\n    signed = f\\"{timestamp}.{raw_body.decode()}\\"\\n    expected = hmac.new(SECRET.encode(), signed.encode(), hashlib.sha256).hexdigest()\\n    if not hmac.compare_digest(f'v1={expected}', signature):\\n        return 'Invalid signature', 401\\n\\n    # Enqueue — don't process inline\\n    queue.enqueue(process_event, request.get_json())\\n    return '', 200" } }
\`\`\`

## Retry Policy & Delivery Tracking

The platform guarantees **at-least-once delivery**: if an endpoint returns a non-2xx status (or times out), the system retries with exponential backoff.

\`\`\`algoviz
{ "title": "Retry schedule on delivery failure", "type": "array", "data": ["T+0", "T+5m", "T+30m", "T+2h", "T+8h", "T+24h", "DISABLED"], "frames": [ { "highlight": [0], "label": "Attempt 1: immediate delivery", "stats": { "attempt": 1, "wait": "0 min" } }, { "highlight": [1], "label": "Attempt 2: 5 minutes after failure", "stats": { "attempt": 2, "wait": "5 min" } }, { "highlight": [2], "label": "Attempt 3: 30 minutes", "stats": { "attempt": 3, "wait": "30 min" } }, { "highlight": [3], "label": "Attempt 4: 2 hours", "stats": { "attempt": 4, "wait": "2 hr" } }, { "highlight": [4], "label": "Attempt 5: 8 hours", "stats": { "attempt": 5, "wait": "8 hr" } }, { "highlight": [5], "label": "Attempt 6: 24 hours", "stats": { "attempt": 6, "wait": "24 hr" } }, { "highlight": [6], "label": "7 consecutive failures: endpoint auto-disabled", "stats": { "attempt": 7, "wait": "—" } } ], "speed": 900 }
\`\`\`

Each delivery attempt is logged and queryable:

\`\`\`http
GET /api/v1/webhook-endpoints/we_001/deliveries?limit=10

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

## Event Polling: The Safety Net

Webhooks can fail for reasons outside the platform's control — merchant downtime, misconfigured firewalls, deploys gone wrong. The \`/events\` endpoint lets merchants reconcile gaps by polling for events they may have missed.

\`\`\`http
GET /api/v1/events?type=payment_intent.succeeded&created_after=2025-03-10T14:00:00Z&limit=50
Authorization: Bearer sk_live_abc123

{
  "data": [
    { "id": "evt_001", "type": "payment_intent.succeeded", ... },
    { "id": "evt_003", "type": "payment_intent.succeeded", ... }
  ],
  "pagination": { "next_cursor": "cur_...", "has_more": false }
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Dual-track reconciliation", "content": "Production-grade integrations use **both** channels: webhooks for real-time response, polling during startup and after outages. On boot, reconcile events from the last N minutes to catch anything delivered while your service was down." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Why at-least-once delivery (not exactly-once)?", "content": "Exactly-once delivery across distributed systems is theoretically achievable but practically prohibitive — it requires two-phase commit between the message broker and the merchant's database, adding latency and coupling.\\n\\nAt-least-once delivery is the industry standard because:\\n- The retry mechanism only needs to track whether a 2xx was received, not whether the merchant processed the event.\\n- Idempotency (using \`event.id\` as a deduplication key) shifts the complexity to the consumer, which has full knowledge of its own state.\\n- Stripe, GitHub, Shopify, and Twilio all use at-least-once delivery for the same reason.\\n\\nThe practical contract: **the platform guarantees no event is lost; the merchant guarantees no event is double-processed.**" }
\`\`\`

\`\`\`quiz
{ "title": "Webhook Design & Event System", "questions": [ { "question": "A merchant's webhook handler returns HTTP 500 for every attempt. What happens after 7 consecutive failures?", "options": ["The platform stops sending events permanently", "The endpoint is automatically disabled", "The platform switches to polling mode", "The platform sends an alert email and retries indefinitely"], "answer": 1, "explanation": "After 7 consecutive failures the endpoint is auto-disabled to protect both sides. The merchant must investigate and re-enable it via the API." }, { "question": "Why must webhook signature verification use a constant-time string comparison instead of a regular equality check?", "options": ["Regular equality is not supported in all languages", "To prevent replay attacks based on the timestamp", "To prevent timing attacks that leak how many bytes matched", "Because HMAC digests contain non-ASCII characters"], "answer": 2, "explanation": "A character-by-character equality check returns faster when more bytes match, leaking information. An attacker can exploit this to forge a valid signature byte-by-byte. Constant-time comparison (\`hmac.compare_digest\`) always takes the same time regardless of how many bytes match." }, { "question": "An event arrives with \`Webhook-Timestamp: 1710080460\` and your server's current Unix time is \`1710083200\`. Should you accept this webhook?", "options": ["Yes — the signature is what matters, not the timestamp", "No — the timestamp is more than 5 minutes old (delta ≈ 45 min)", "Yes — the 5-minute window is a recommendation, not a requirement", "No — timestamps must match exactly"], "answer": 1, "explanation": "1710083200 − 1710080460 = 2740 seconds ≈ 45 minutes. The anti-replay window is 300 seconds (5 minutes). This webhook is stale and must be rejected to prevent replay attacks." }, { "question": "A \`payment_intent.succeeded\` webhook is delivered twice for the same \`pi_xyz789\`. What is the correct merchant response?", "options": ["Treat the second delivery as a correction and re-apply the business logic", "Deduplicate using the event ID and skip the second delivery", "Reject the second delivery with HTTP 409", "Accept both — the platform guarantees unique delivery"], "answer": 1, "explanation": "Webhooks provide at-least-once delivery. Merchants must deduplicate on \`event.id\` (or the resource ID + state combination). Responding with 2xx to the second delivery tells the platform delivery succeeded; internally you skip processing if you've seen this event ID before." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Webhooks push events to merchants in real-time; the /events endpoint provides a polling fallback for reconciliation after outages.", "Sign every outgoing webhook with HMAC-SHA256 and validate timestamp freshness (±5 min) on the receiving end to prevent spoofing and replay attacks.", "At-least-once delivery is the industry standard — design all webhook handlers to be idempotent using event.id as a deduplication key.", "Return 2xx immediately and push processing to a background queue; slow handlers cause timeouts that trigger unnecessary retries.", "After 7 consecutive failures the endpoint is auto-disabled; include the /deliveries sub-resource so merchants can diagnose and recover.", "Include the full resource object in every event payload so merchants never need a follow-up API call to act on an event." ] }
\`\`\``,
    },
    {
      id: "stripe-idempotency",
      slug: "stripe-idempotency",
      title: "Idempotency Keys & Error Handling",
      content: `# Idempotency Keys & Error Handling

In a payment API, a retry that creates a duplicate charge is catastrophic. Network timeouts, server restarts, and mobile connectivity drops all cause clients to retry. The system must be designed from the start so that retrying is always safe.

\`\`\`concept
{ "title": "Idempotency", "variant": "mental-model", "content": "An operation is idempotent if applying it multiple times produces the same server-side result as applying it once. In a payment API this means: no matter how many times a client sends the same charge request, money moves exactly once. The idempotency key is the client-assigned token that lets the server enforce this guarantee." }
\`\`\`

## Idempotency Key Requirements

Every POST request that creates or mutates a resource **must** include an \`Idempotency-Key\` header. The key is generated by the client, scoped to a single logical operation, and must be globally unique (UUIDv4 or similar entropy):

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

**First call:** Creates the payment intent, stores the result keyed by \`ik_order1234_v1\`.  
**Retry with same key + same body:** Returns the cached result. Money moves once.

\`\`\`callout
{ "type": "warning", "title": "Key scope is per-operation, not per-request", "content": "Generate a new idempotency key for each distinct logical operation. Reusing a key across different operations (e.g., two separate orders) triggers a \`IDEMPOTENCY_KEY_REUSE\` error. The key should encode enough context to be auditable — e.g., \`ik_{orderId}_{attemptVersion}\`." }
\`\`\`

## Server-Side Flow

\`\`\`steps
{ "title": "Processing a Request with an Idempotency Key", "steps": [ { "title": "Receive request with Idempotency-Key header", "content": "Extract the key from the header. If the header is missing entirely, reject immediately with \`400 MISSING_IDEMPOTENCY_KEY\` — never silently proceed." }, { "title": "Acquire a distributed lock on the key", "content": "Use an atomic lock (e.g., Redis \`SETNX\` with a short TTL). This prevents two concurrent retries from both executing the operation. If the lock is already held, return \`409 IDEMPOTENCY_KEY_IN_PROGRESS\` with a \`retry_after\` hint." }, { "title": "Check the idempotency store", "content": "Look up the key in a durable store (database or Redis).\\n\\n- **Key exists + same body hash** → return cached response (200/201), skip execution.\\n- **Key exists + different body hash** → return \`422 IDEMPOTENCY_KEY_REUSE\`, reject immediately.\\n- **Key not found** → proceed to execute." }, { "title": "Execute the operation", "content": "Run the business logic: validate, charge, create the resource. This is the only path where side effects occur." }, { "title": "Store the result, release the lock", "content": "Atomically persist the response body under the key with a **48-hour TTL** (Stripe's documented window). Release the distributed lock. The key is now safe for any number of retries within the TTL window." }, { "title": "Return the result", "content": "Return 201 Created for new resources. Subsequent retries with the same key will hit step 3 and return the cached response — indistinguishable from the original to the client." } ] }
\`\`\`

## Error Scenarios

\`\`\`tabs
{ "tabs": [ { "label": "Key Reuse (422)", "icon": "♻️", "content": "Sent when the same key is reused with a **different request body**. This is always a client bug — the client generated a key collision.\\n\\n\`\`\`\\nPOST /api/v1/payment-intents\\nIdempotency-Key: ik_order1234_v1\\n{ \\"amount\\": 7500, \\"currency\\": \\"usd\\" }  ← different amount!\\n\\nHTTP/1.1 422 Unprocessable Entity\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"IDEMPOTENCY_KEY_REUSE\\",\\n    \\"message\\": \\"This idempotency key was already used with different request parameters. Generate a new key for a new request.\\"\\n  }\\n}\\n\`\`\`\\n\\n**Client action:** Do NOT retry with the same key. Generate a new idempotency key and fix the request body." }, { "label": "In Progress (409)", "icon": "⏳", "content": "Sent when a concurrent request with the **same key** is already being processed (lock is held).\\n\\n\`\`\`\\nHTTP/1.1 409 Conflict\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"IDEMPOTENCY_KEY_IN_PROGRESS\\",\\n    \\"message\\": \\"A request with this idempotency key is currently being processed.\\",\\n    \\"retry_after\\": 2\\n  }\\n}\\n\`\`\`\\n\\n**Client action:** Retry with the **same key** after \`retry_after\` seconds. This is the safe path." }, { "label": "Missing Key (400)", "icon": "🔑", "content": "Sent when a POST/PATCH request arrives with no \`Idempotency-Key\` header at all.\\n\\n\`\`\`\\nHTTP/1.1 400 Bad Request\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"MISSING_IDEMPOTENCY_KEY\\",\\n    \\"message\\": \\"POST requests require an Idempotency-Key header.\\"\\n  }\\n}\\n\`\`\`\\n\\n**Client action:** Fix the client code. This is always a programming error, never a transient failure." }, { "label": "Expired Key (404)", "icon": "🕰️", "content": "Sent when a retry arrives **after the 48-hour TTL** and the cached result has been evicted.\\n\\n\`\`\`\\nHTTP/1.1 404 Not Found\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"IDEMPOTENCY_KEY_EXPIRED\\",\\n    \\"message\\": \\"The result for this idempotency key has expired. Query the resource directly to check its state.\\"\\n  }\\n}\\n\`\`\`\\n\\n**Client action:** Do NOT retry the mutation blindly. First query \`GET /payment-intents?metadata[order_id]=1234\` to check whether the operation already succeeded before deciding to re-submit." } ] }
\`\`\`

## Error Classification

Not all errors should trigger a retry. Blindly retrying a 400 (malformed request) will never succeed and wastes rate-limit budget.

| HTTP Status | Retryable? | Client Action |
|-------------|-----------|---------------|
| 200, 201 | N/A | Success |
| 400 | No | Fix request; generate new idempotency key |
| 401 | No | Fix authentication credentials |
| 402 | No | Card declined — request new payment method |
| 404 | No | Resource does not exist |
| 409 | Yes | Retry with **same key** after \`retry_after\` seconds |
| 422 | No | Fix validation error; generate new key |
| 429 | Yes | Retry after \`Retry-After\` header value |
| 500 | Yes | Retry with **same key** + exponential backoff |
| 502, 503 | Yes | Retry with **same key** + exponential backoff |

\`\`\`callout
{ "type": "danger", "title": "Never generate a new key on 5xx retries", "content": "When a 500/502/503 occurs, the operation may have already succeeded on the server before the connection dropped. Retrying with the same idempotency key lets the server return the cached result if the operation completed. Retrying with a NEW key risks charging the customer twice." }
\`\`\`

## Client Retry Strategy

\`\`\`trace
{ "title": "chargeWithRetry — execution trace", "language": "python", "code": "def charge_with_retry(params, idempotency_key, max_retries=5):\\n    for attempt in range(1, max_retries + 1):\\n        resp = post('/payment-intents',\\n                    headers={'Idempotency-Key': idempotency_key},\\n                    body=params)\\n\\n        if resp.status in (200, 201):\\n            return resp\\n\\n        if resp.status in (400, 401, 402, 404, 422):\\n            raise NonRetryableError(resp)\\n\\n        if resp.status == 429:\\n            sleep(resp.headers['Retry-After'])\\n            continue\\n\\n        if resp.status in (409, 500, 502, 503):\\n            sleep(exponential_backoff(attempt) + jitter())\\n            continue\\n\\n    raise MaxRetriesExceeded()", "frames": [ { "line": 2, "vars": { "attempt": 1, "idempotency_key": "ik_order1234_v1" }, "note": "First attempt with fresh key" }, { "line": 4, "vars": { "resp.status": 503 }, "note": "Network error — server temporarily unavailable" }, { "line": 14, "vars": { "attempt": 1 }, "note": "503 is retryable — sleep with backoff, keep SAME key" }, { "line": 2, "vars": { "attempt": 2, "idempotency_key": "ik_order1234_v1" }, "note": "Retry with the SAME idempotency key — safe because server cached nothing yet" }, { "line": 6, "vars": { "resp.status": 201 }, "note": "Success on second attempt — payment intent created exactly once" }, { "line": 7, "vars": {}, "note": "Return the result. No duplicate charge." } ], "speed": 900 }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Exponential Backoff + Jitter", "content": "Exponential backoff doubles the wait time between each retry:\\n\\n\`\`\`\\nattempt 1 → wait 1s\\nattempt 2 → wait 2s\\nattempt 3 → wait 4s\\nattempt 4 → wait 8s\\nattempt 5 → wait 16s\\n\`\`\`\\n\\n**Jitter** adds randomness (e.g., \`random(0, wait)\`) to prevent a thundering herd — when many clients all fail simultaneously and retry in lockstep, overwhelming a recovering server.\\n\\nAWS, Google, and Stripe all recommend **full jitter** (uniform random between 0 and the computed backoff ceiling) as the default strategy. A common formula:\\n\\n\`\`\`python\\ndef exponential_backoff(attempt, base=1.0, cap=32.0):\\n    return min(cap, base * (2 ** (attempt - 1)))\\n\\ndef jitter():\\n    import random\\n    return random.uniform(0, 1)\\n\`\`\`" }
\`\`\`

## Financial Safety Properties

These five properties constitute the interview-ready checklist for any payment API:

| Property | Mechanism |
|----------|-----------|
| No double charges | Idempotency keys with distributed lock |
| No lost payments | Webhooks + polling \`/events\` endpoint |
| No floating-point money bugs | Amounts as integers (cents), never \`float\` |
| Full audit trail | Immutable event log, every state transition stored |
| Graceful degradation | 503 + \`retry_after\` on processor outage, never silent failure |

\`\`\`quiz
{ "title": "Idempotency Keys & Error Handling", "questions": [ { "question": "A client sends a payment request and receives no response due to a TCP timeout. What should it do on retry?", "options": [ "Generate a new idempotency key and retry immediately", "Retry with the same idempotency key after a backoff delay", "Abort — a timeout means the charge definitely failed", "Retry without an idempotency key so the server treats it as fresh" ], "answer": 1, "explanation": "A TCP timeout means the client does not know whether the server processed the request. Retrying with the SAME key is safe — if the server completed the operation, it returns the cached result. Generating a new key risks creating a duplicate charge." }, { "question": "A client reuses idempotency key \`ik_order99\` with a different amount than the original request. What HTTP status should the server return?", "options": [ "409 Conflict — the key is in use", "400 Bad Request — malformed input", "422 Unprocessable Entity — IDEMPOTENCY_KEY_REUSE", "200 OK — return the original stored result" ], "answer": 2, "explanation": "When the same key arrives with a different request body (different params hash), the server must reject it as 422 IDEMPOTENCY_KEY_REUSE. Returning the original result would be wrong (different operation); returning 200 silently would be dangerous." }, { "question": "Why must monetary amounts be stored and transmitted as integers (e.g., cents) rather than floats?", "options": [ "Integers are faster to serialize than floats", "Floating-point arithmetic is non-deterministic across languages and can silently introduce rounding errors in financial calculations", "Payment processors only accept integer inputs", "Regulatory standards require integer encoding" ], "answer": 1, "explanation": "IEEE 754 floats cannot exactly represent many decimal fractions. For example, 0.1 + 0.2 ≠ 0.3 in most languages. Representing $50.00 as the integer 5000 (cents) eliminates this entire class of silent rounding bugs." }, { "question": "A server receives a request with a valid idempotency key but the distributed lock for that key is currently held by another in-flight request. What is the correct response?", "options": [ "200 OK with the partial result", "409 Conflict with a retry_after hint", "503 Service Unavailable", "202 Accepted — queue the request" ], "answer": 1, "explanation": "409 IDEMPOTENCY_KEY_IN_PROGRESS signals that a concurrent request with the same key is being processed. The client should retry with the same key after the suggested retry_after delay — the lock will be released and the cached result will be available." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Idempotency keys are a server-side deduplication mechanism: the client generates a unique key per logical operation and the server stores the result so any retry returns the cached response instead of re-executing.", "Lock before looking up: a distributed lock (e.g., Redis SETNX) on the key prevents two concurrent retries from both executing the operation — the 409 response tells the second caller to wait.", "Retryable vs. non-retryable errors are not interchangeable: 4xx errors (except 409/429) mean 'fix your request'; 5xx and 409 mean 'retry with the SAME idempotency key' — generating a new key on a 500 is how duplicate charges happen.", "Money must be integers: represent all amounts as the smallest currency unit (cents for USD) to avoid IEEE 754 floating-point rounding bugs that silently corrupt financial calculations.", "The five financial safety properties (no double charges, no lost payments, no phantom money, full audit trail, graceful degradation) form the complete answer to 'how would you make this payment API safe?'" ] }
\`\`\``,
    },
    {
      id: "stripe-walkthrough",
      slug: "stripe-walkthrough",
      title: "API Walkthrough & Trade-offs",
      content: `# Stripe API: Walkthrough & Trade-offs

This is the capstone lesson. We'll review the full endpoint surface, trace a real payment end-to-end, and systematically discuss every trade-off an interviewer will probe. By the end, you'll have a complete mental model to defend — not just describe.

\`\`\`concept
{ "title": "The Design Philosophy Behind This API", "variant": "mental-model", "content": "Every decision in a payment API exists to answer one question: *what happens when things go wrong?* Networks drop. Servers crash. Card networks time out. A great payment API is not optimised for the happy path — it is optimised for safe, auditable recovery from every failure mode." }
\`\`\`

## Complete Endpoint Surface

| Category | Method | Endpoint | Idempotent | Auth |
|----------|--------|----------|------------|------|
| **Customers** | POST | \`/customers\` | Key required | Secret |
| | GET | \`/customers/{id}\` | Naturally | Secret |
| | PATCH | \`/customers/{id}\` | Key required | Secret |
| | DELETE | \`/customers/{id}\` | Naturally | Secret |
| **Payment Methods** | POST | \`/payment-methods\` | Key required | Secret |
| | GET | \`/payment-methods/{id}\` | Naturally | Secret |
| | POST | \`/payment-methods/{id}/attach\` | Key required | Secret |
| | POST | \`/payment-methods/{id}/detach\` | Key required | Secret |
| **Payment Intents** | POST | \`/payment-intents\` | Key required | Secret |
| | GET | \`/payment-intents/{id}\` | Naturally | Secret or Publishable |
| | POST | \`/payment-intents/{id}/confirm\` | Key required | Secret or Publishable |
| | POST | \`/payment-intents/{id}/cancel\` | Key required | Secret |
| **Refunds** | POST | \`/refunds\` | Key required | Secret |
| | GET | \`/refunds/{id}\` | Naturally | Secret |
| **Events** | GET | \`/events\` | Naturally | Secret |
| **Webhooks** | POST | \`/webhook-endpoints\` | Key required | Secret |
| | DELETE | \`/webhook-endpoints/{id}\` | Naturally | Secret |

Notice the pattern: every mutation (\`POST\`, \`PATCH\`, \`DELETE\`) requires an idempotency key. Every read (\`GET\`) is naturally idempotent. This is the rule, not an afterthought.

## End-to-End Payment Flow

\`\`\`steps
{ "title": "Complete Payment Lifecycle", "steps": [ { "title": "Create the Customer", "content": "\`\`\`http\\nPOST /customers\\n{ \\"email\\": \\"alice@example.com\\", \\"name\\": \\"Alice\\" }\\n→ { \\"id\\": \\"cus_abc123\\", \\"email\\": \\"alice@example.com\\" }\\n\`\`\`\\nThe customer object is a stable anchor. All payment methods and intents link to it, giving you a full audit trail per user." }, { "title": "Tokenize and Attach a Payment Method", "content": "\`\`\`http\\nPOST /payment-methods\\n{ \\"type\\": \\"card\\", \\"token\\": \\"tok_visa\\" }\\n→ { \\"id\\": \\"pm_001\\", \\"last4\\": \\"4242\\" }\\n\\nPOST /payment-methods/pm_001/attach\\n{ \\"customer\\": \\"cus_abc123\\" }\\n\`\`\`\\nThe raw card number never touches your server. Client-side JS collects it, the network tokenizes it, and you only store \`pm_001\`. This keeps the merchant out of PCI scope entirely." }, { "title": "Create a Payment Intent", "content": "\`\`\`http\\nPOST /payment-intents\\nIdempotency-Key: ik_order1234\\n{ \\"amount\\": 5000, \\"currency\\": \\"usd\\", \\"customer\\": \\"cus_abc123\\" }\\n→ { \\"id\\": \\"pi_xyz789\\", \\"status\\": \\"requires_confirmation\\" }\\n\`\`\`\\nCreate exactly one PaymentIntent per order. The \`Idempotency-Key\` guarantees that a network retry returns the same intent, not a duplicate charge." }, { "title": "Confirm the Payment", "content": "\`\`\`http\\nPOST /payment-intents/pi_xyz789/confirm\\n{ \\"payment_method\\": \\"pm_001\\" }\\n→ { \\"status\\": \\"processing\\" } → { \\"status\\": \\"succeeded\\" }\\n\`\`\`\\nThe status machine transitions: \`requires_confirmation\` → \`processing\` → \`succeeded\` (or \`requires_action\` for 3DS). Each state transition fires a webhook event." }, { "title": "Reconcile via Events and Issue Refunds", "content": "\`\`\`http\\n# Async event delivered to your webhook endpoint:\\nPOST https://yourserver.com/hooks\\n{ \\"type\\": \\"payment_intent.succeeded\\", \\"data\\": { \\"object\\": { \\"id\\": \\"pi_xyz789\\" } } }\\n\\n# Optional partial refund:\\nPOST /refunds\\n{ \\"payment_intent\\": \\"pi_xyz789\\", \\"amount\\": 2000 }\\n→ Partial refund of $20.00 — fires charge.refunded event\\n\`\`\`" } ] }
\`\`\`

## The Five Trade-offs You Must Defend

\`\`\`tabs
{ "tabs": [ { "label": "Two-Step vs One-Step", "icon": "⚡", "content": "## Two-Step (Intent + Confirm) vs One-Step (Direct Charge)\\n\\n| Approach | Pros | Cons |\\n|----------|------|------|\\n| Two-step | Supports 3DS auth, holds, client-side flow, async confirmations | Two API calls per payment |\\n| One-step | Simpler mental model | No hold support, no client-side auth flow, fails modern card requirements |\\n\\n**Our choice: two-step.**\\n\\nReal-world card networks increasingly require 3D Secure (SCA in Europe, mandated by PSD2). A one-step API cannot support this. Two-step is not extra complexity — it is the correct model for the problem. A one-step convenience wrapper can always be added on top." }, { "label": "Webhooks vs Polling", "icon": "🔔", "content": "## Webhooks vs Polling\\n\\n| Approach | Pros | Cons |\\n|----------|------|------|\\n| Webhooks | Push-based, real-time, efficient | Endpoint must be reachable; delivery ordering not guaranteed; must handle duplicates |\\n| Polling \`/events\` | Merchant-controlled, simple to reason about | Latency proportional to poll interval; burns API quota |\\n\\n**Our choice: both.**\\n\\nStripe retries failed webhooks for up to 3 days with exponential backoff. But if your webhook endpoint was misconfigured for an hour, you would miss events permanently without a fallback. The \`/events\` endpoint exists precisely for this reconciliation use case — fetch all events since your last known timestamp and replay. This is defense in depth.\\n\\nWebhook handlers must be **idempotent** — the same \`payment_intent.succeeded\` event may arrive twice." }, { "label": "Integer Cents", "icon": "💰", "content": "## Integer Cents vs Decimal Dollars\\n\\n\`\`\`\\n{ \\"amount\\": 5000 }     ← Our choice: integer cents ($50.00)\\n{ \\"amount\\": \\"50.00\\" }  ← String decimal — avoids floats but needs parsing\\n{ \\"amount\\": 50.00 }    ← NEVER: floating-point representation\\n\`\`\`\\n\\nFloating-point arithmetic is non-associative. The classic failure:\\n\\n\`\`\`\\n0.1 + 0.2 === 0.30000000000000004  // JavaScript float\\n\`\`\`\\n\\nWith integers: \`1999 + 1 = 2000\`. Always. No approximation.\\n\\nThe currency field carries the decimal semantics — \`{ amount: 5000, currency: \\"jpy\\" }\` means ¥5000, not ¥50.00, because JPY has no subunit. The API is consistent; the semantic is in the currency." }, { "label": "Tokenization", "icon": "🔒", "content": "## Storing Raw Card Data vs Tokenization\\n\\nWe **never** accept, store, or forward full card numbers. The flow:\\n\\n1. Client-side JavaScript (e.g. Stripe.js) presents a card form\\n2. Card data is sent **directly** to the card network — bypasses your server entirely\\n3. Network returns a short-lived token (\`tok_visa\`)\\n4. Your server receives only the token\\n\\n**Why this matters:**\\n- The merchant's server is never in the card data path\\n- PCI DSS SAQ A (lowest burden) instead of SAQ D (months of compliance work)\\n- A breach of your database exposes no usable card data\\n\\n**What flows through the API:** \`last4\`, \`brand\`, \`exp_month\`, \`exp_year\`, and the opaque \`pm_001\` token. That's it." }, { "label": "API Key Design", "icon": "🗝️", "content": "## API Key Types and Prefix Conventions\\n\\n\`\`\`\\nsk_live_...  → Secret key   (server-side only, full access)\\npk_live_...  → Publishable  (client-side, tokenization only)\\nsk_test_...  → Secret test  (sandbox, same server-side rules)\\npk_test_...  → Publishable test\\n\`\`\`\\n\\nThe prefix convention does two things:\\n\\n1. **Prevents accidental live charges in dev** — a key that starts with \`sk_test_\` cannot move money. Developers can paste it in tutorials, demos, and blog posts safely.\\n2. **Enforces capability boundaries** — the \`pk_\` publishable key literally cannot call \`/refunds\` or list customers. The restriction is in the prefix, not just the docs.\\n\\nThis is developer experience as a security control." } ] }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Dangerous: Floating-Point Amount", "code": "// A $19.99 item + $0.01 shipping = $20.00?\\nconst total = 19.99 + 0.01;\\nconsole.log(total); // 20.000000000000004\\n\\nPOST /charges\\n{ \\"amount\\": 20.000000000000004, \\"currency\\": \\"usd\\" }" }, "after": { "label": "Correct: Integer Cents", "code": "// 1999 cents + 1 cent = 2000 cents. Always.\\nconst total = 1999 + 1;\\nconsole.log(total); // 2000\\n\\nPOST /payment-intents\\n{ \\"amount\\": 2000, \\"currency\\": \\"usd\\" }" } }
\`\`\`

## The Payment Intent State Machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> requires_payment_method: POST /payment-intents
    requires_payment_method --> requires_confirmation: payment method attached
    requires_confirmation --> requires_action: confirm (3DS needed)
    requires_action --> processing: customer completes auth
    requires_confirmation --> processing: confirm (no 3DS)
    processing --> succeeded: bank approves
    processing --> payment_failed: bank declines
    requires_confirmation --> canceled: POST .../cancel
    requires_payment_method --> canceled: POST .../cancel
    succeeded --> [*]
    payment_failed --> [*]
    canceled --> [*]
\`\`\`

Each transition fires a webhook event. Your server should be a state machine that reacts to events — not a polling loop that checks status.

\`\`\`callout
{ "type": "warning", "title": "Idempotency Is Not Optional", "content": "Every state-mutating endpoint — \`POST /payment-intents\`, \`POST .../confirm\`, \`POST /refunds\` — **must** accept an \`Idempotency-Key\` header. Without it, a network timeout followed by a retry creates a duplicate charge. The server should store the response keyed on the idempotency key for at least 24 hours and return the cached response on replay." }
\`\`\`

## What Makes This a Great Interview Answer

\`\`\`takeaways
{ "title": "The Seven Signals Interviewers Look For", "items": [ "State machine for PaymentIntent — shows you understand payment lifecycle, not just CRUD", "Idempotency on every mutation — shows financial safety awareness; this separates payment API design from generic REST", "Webhook + polling fallback — shows defense in depth; one mechanism is insufficient", "Integer amounts in the smallest currency unit — shows attention to correctness over convenience", "Prefixed IDs (\`cus_\`, \`pi_\`, \`pm_\`) — shows developer experience awareness; instant context from any log line", "Error classification (card_error vs api_error vs idempotency_error) — shows you understand retry semantics from the client's perspective", "PCI tokenization — shows security awareness; the merchant server never touches card data" ] }
\`\`\`

\`\`\`quiz
{ "title": "API Design Trade-offs", "questions": [ { "question": "A merchant's webhook endpoint was down for 2 hours and missed 47 \`payment_intent.succeeded\` events. Which API feature is the correct recovery path?", "options": [ "Re-create all payment intents and reprocess them", "Call GET /payment-intents with a date filter and reconcile from the events list", "Use GET /events with a timestamp filter to replay missed events", "Contact Stripe support to resend the webhooks" ], "answer": 2, "explanation": "The /events endpoint exists specifically as a reconciliation fallback. You query it with a \`created[gt]\` timestamp of your last known good state and replay any missed events in order. Stripe retries webhooks for up to 3 days, but the /events endpoint is your audit log." }, { "question": "Why must webhook handlers be idempotent?", "options": [ "Because webhooks are always delivered in chronological order", "Because Stripe only delivers each event exactly once", "Because network failures can cause the same event to be delivered more than once", "Because idempotency keys are attached to webhook payloads" ], "answer": 2, "explanation": "Webhook delivery is at-least-once, not exactly-once. If your server returns a non-2xx response, Stripe retries with exponential backoff. Your handler must recognize a duplicate event_id and skip re-processing rather than crediting or shipping an order twice." }, { "question": "A user adds a payment method, then creates and confirms a payment intent in a single checkout session. A network timeout occurs during the confirm step. What is the correct client behavior?", "options": [ "Create a new payment intent with the same amount", "Retry the confirm call with the original Idempotency-Key", "Poll GET /payment-intents/{id} and show an error if status is not succeeded after 5 seconds", "Start the checkout flow from scratch" ], "answer": 1, "explanation": "Retry the confirm call with the **same** Idempotency-Key. The server will return the cached response from the first successful execution, preventing a double charge. Never create a new intent on retry — that creates a second, separate charge." }, { "question": "Which amount representation is correct for a $19.99 charge in USD?", "options": [ "{ \\"amount\\": 19.99 }", "{ \\"amount\\": \\"19.99\\" }", "{ \\"amount\\": 1999 }", "{ \\"amount\\": 19.990 }" ], "answer": 2, "explanation": "Integer cents (1999) eliminates floating-point arithmetic errors entirely. The \`currency\` field carries the semantic — USD has 2 decimal places, so 1999 = $19.99. JPY has 0 decimal places, so 1999 = ¥1999. Floats (19.99) are dangerous because IEEE 754 cannot represent them exactly." } ] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: 3D Secure and the requires_action State", "content": "3D Secure (3DS) is a card network protocol that redirects the customer to their bank for additional authentication (a one-time code, biometric, or app push notification). In the EU, 3DS is mandated by PSD2 Strong Customer Authentication (SCA) regulations for online payments.\\n\\nWhen a confirm call returns \`status: requires_action\`, the response also includes \`next_action.redirect_to_url\`. The client-side flow:\\n\\n1. Merchant frontend detects \`requires_action\`\\n2. Frontend redirects the user to \`next_action.redirect_to_url\` (the bank's auth page)\\n3. User authenticates with their bank\\n4. Bank redirects back to \`return_url\` specified in the intent\\n5. Merchant backend receives \`payment_intent.succeeded\` webhook\\n\\nThis is why the two-step model (intent → confirm) is essential. A one-step charge API cannot model this asynchronous bank authentication loop — the payment resolves outside the original HTTP request cycle entirely." }
\`\`\``,
    },
  ],
};
