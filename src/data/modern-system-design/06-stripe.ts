import { Module } from "../types";

export const stripeModule: Module = {
  id: "design-stripe",
  title: "Design Stripe",
  description: "Design a payment processing platform: PCI compliance, idempotency guarantees, double-entry ledgers, and fraud detection at global scale.",
  lessons: [
    {
      id: "stripe-requirements",
      slug: "stripe-requirements",
      title: "Requirements & Compliance",
      content: `# Design Stripe: Requirements & Compliance

Stripe processes hundreds of millions of transactions daily, routes money across 135+ currencies, and operates under the watchful eye of regulators on six continents. Before any architecture diagram, you need to understand the **constraints that shape every design decision**: compliance rules that dictate where data lives, consistency guarantees that tolerate zero lost pennies, and scale targets that put authorization latency under two seconds end-to-end.

\`\`\`concept
{ "title": "Payment Processing is Accounting, Not CRUD", "variant": "mental-model", "content": "Most web services can tolerate eventual consistency or occasional data loss. Payment systems cannot. Every cent must be accounted for at all times — across network failures, retries, and multi-region deployments. Design Stripe as a distributed ledger first, and an API second. The cardinal rule: it is always better to decline a transaction than to charge a customer twice." }
\`\`\`

## Functional Requirements

The platform must support the full payment lifecycle — not just a single charge endpoint.

\`\`\`tabs
{ "tabs": [ { "label": "Core Payments", "icon": "💳", "content": "**Accept payments** — Credit cards, debit cards, ACH bank transfers, digital wallets (Apple Pay, Google Pay)\\n\\n**Payment lifecycle** — Authorize, capture, void, refund. Authorization holds funds without moving them; capture moves money; void cancels an un-captured authorization; refund returns captured funds.\\n\\n**Multi-currency** — 135+ currencies with real-time exchange rates and automatic currency conversion at settlement." }, { "label": "Recurring & Payouts", "icon": "🔄", "content": "**Subscriptions** — Recurring billing with proration, free trials, plan upgrades/downgrades, and dunning management for failed renewals.\\n\\n**Payouts** — Transfer collected funds to merchants' bank accounts on configurable schedules (daily, weekly, manual)." }, { "label": "Risk & Compliance", "icon": "🛡️", "content": "**Fraud detection** — Real-time risk scoring on every transaction using machine learning (Stripe Radar). Must complete in <100ms without blocking authorization.\\n\\n**Dispute management** — Handle chargebacks: collect evidence, submit to card networks, track outcomes and win rates.\\n\\n**OFAC screening** — Every transaction screened against sanctions lists before authorization proceeds." }, { "label": "Reporting", "icon": "📊", "content": "**Financial dashboards** — Revenue summaries, refund rates, payout history per merchant.\\n\\n**Reconciliation** — Match internal ledger entries against card network settlement reports line by line.\\n\\n**Tax reporting** — 1099-K generation for US merchants, VAT reporting for European merchants." } ] }
\`\`\`

## Non-Functional Requirements

These aren't aspirational targets — they are legal and financial obligations.

| Requirement | Target | Why It's Non-Negotiable |
|-------------|--------|-------------------------|
| **Availability** | 99.999% (~5 min/year) | Every minute of downtime directly loses merchant revenue |
| **Authorization latency** | < 2 seconds end-to-end | Customers abandon checkout after ~3s; card networks impose timeouts |
| **Consistency** | Strong / zero data loss | Every cent must be accounted for — no lost or duplicated money |
| **Durability** | Multi-region replication | Financial records must survive any single datacenter failure |
| **Compliance** | PCI DSS Level 1, SOC 2, GDPR, PSD2 | Legal requirement — violations trigger massive fines and license revocation |

## Scale Estimation

These numbers shape every architectural choice downstream.

\`\`\`
Transactions per day:          ~500 million
Average TPS:                   500M ÷ 86,400 ≈ 5,800 TPS
Peak TPS (Black Friday):       5,800 × 4 ≈ 23,000 TPS
Annual payment volume:         ~$1 trillion
Average transaction value:     ~$55
\`\`\`

**Storage footprint:**

\`\`\`
Transaction records/day:    500M × 2 KB        ≈ 1 TB/day
Ledger entries/day:         500M × 4 × 500 B   ≈ 1 TB/day
Annual storage:             ~730 TB/year (before 3× replication factor)
Card vault:                 Billions of AES-256 encrypted tokenized cards
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Fraud scoring at 23,000 TPS", "content": "Your fraud engine must score every transaction in real-time with <100ms latency — at Black Friday peak. A sequential scorer at 100ms per request would fall 2.3 million transactions behind every second at that load. This forces a stateless, horizontally-scaled ML inference tier with models pre-loaded in memory, not on-the-fly database queries." }
\`\`\`

## PCI DSS Compliance

PCI DSS (Payment Card Industry Data Security Standard) Level 1 applies to any entity processing more than 6 million card transactions per year — which Stripe exceeds by orders of magnitude. Level 1 requires an annual on-site audit by a **Qualified Security Assessor (QSA)** and quarterly network scans by an **Approved Scanning Vendor (ASV)**.

| Requirement | What It Means for Architecture |
|-------------|-------------------------------|
| **TLS 1.2+ in transit** | All card data encrypted over the wire — no plaintext card data on any internal network |
| **AES-256 at rest** | Stored card numbers encrypted with keys managed by Hardware Security Modules (HSMs) |
| **Tokenization** | Real card numbers replaced with opaque tokens; only the vault can reverse them |
| **Network segmentation** | Card Data Environment (CDE) isolated via firewall from all other services |
| **Least privilege + MFA** | Every human CDE access requires MFA; service accounts scoped to minimum necessary permissions |
| **Audit logging** | Every access to cardholder data logged immutably and retained for at least 1 year |
| **Annual QSA audit** | Third-party assessor verifies all 12 PCI DSS requirement domains on-site |

### How Tokenization Isolates the CDE

The key insight: **minimize the blast radius**. If every microservice touched raw card numbers, a single compromised service would expose the entire card vault. Tokenization ensures only the vault (inside the CDE) ever sees real PANs.

\`\`\`steps
{ "title": "PCI Tokenization Flow", "steps": [ { "title": "Merchant sends card data directly to Stripe", "content": "The merchant's checkout form submits the raw PAN (Primary Account Number) — e.g., \`4242 4242 4242 4242\` — directly to Stripe's CDE endpoint over TLS 1.2+. The card number **never touches the merchant's servers**, immediately constraining PCI scope to Stripe's infrastructure." }, { "title": "CDE encrypts and vaults the PAN", "content": "The Tokenization Service (inside the isolated CDE network) encrypts the PAN with AES-256 using an HSM-managed key, stores the ciphertext in the Card Vault database, and generates a random, non-reversible token string tied to that card." }, { "title": "Opaque token returned to merchant", "content": "Stripe returns a token such as \`tok_1MqX8Y2eZvKYlo2C\` to the merchant. This token has **no mathematical relationship** to the card number — it cannot be reversed. The merchant can store it safely in their own database for future charges." }, { "title": "All downstream systems operate on tokens only", "content": "Every system outside the CDE — fraud engine, ledger service, subscription billing, webhook delivery — operates solely on tokens. Only when a charge must be authorized does the CDE detokenize the PAN, and that operation happens entirely within the isolated network segment." } ] }
\`\`\`

## Payment Types & Settlement Timelines

Different payment rails have vastly different settlement windows, which directly affects payout architecture and merchant cash flow management.

| Type | Auth Flow | Settlement Time |
|------|-----------|-----------------|
| **Card payment** | Authorize → Capture → Settle | 1–2 business days |
| **ACH transfer** | Initiate → Process → Settle | 3–5 business days |
| **Wire transfer** | Initiate → Confirm | Same or next business day |
| **Digital wallet** (Apple/Google Pay) | Tokenized card charge | 1–2 business days |
| **Buy Now Pay Later** | Partner auth → installment plan | Varies by partner |

## Regulatory Landscape

\`\`\`callout
{ "type": "info", "title": "Global compliance is not uniform", "content": "Stripe must simultaneously comply with 200+ regulatory frameworks. India's RBI mandates that card data be stored only on servers physically located in India. Brazil's Central Bank mandates PIX instant payment support. Europe's PSD2 requires Strong Customer Authentication (SCA) for most card transactions. Every region has distinct rules — your architecture must support regional data residency, localized payment rails, and jurisdiction-specific auth flows." }
\`\`\`

| Region | Key Regulation | Architectural Impact |
|--------|---------------|----------------------|
| **United States** | State money transmitter licenses (all 50 states) | Legal entity structure, reserve capital requirements per state |
| **Europe** | PSD2 (SCA) + GDPR | 3DS2 authentication step; data residency options; right-to-erasure flows |
| **India** | RBI data localization | Card data must be stored on India-resident servers only |
| **Brazil** | PIX instant payment mandate | PIX rail integration; near-real-time settlement required |
| **Global** | OFAC sanctions screening | Every transaction screened against sanctions lists before authorization |

## High-Level System Components

\`\`\`sysdiag
{ "title": "Stripe High-Level Architecture", "width": 720, "height": 380, "nodes": [ { "id": "merchant", "label": "Merchant App", "x": 70, "y": 190, "kind": "client" }, { "id": "gateway", "label": "API Gateway", "x": 230, "y": 190, "kind": "service" }, { "id": "payment", "label": "Payment Service", "x": 400, "y": 190, "kind": "service" }, { "id": "vault", "label": "Card Vault (CDE)", "x": 570, "y": 80, "kind": "storage" }, { "id": "fraud", "label": "Fraud Engine", "x": 570, "y": 190, "kind": "service" }, { "id": "ledger", "label": "Ledger Service", "x": 570, "y": 300, "kind": "storage" }, { "id": "networks", "label": "Card Networks (Visa/MC)", "x": 400, "y": 330, "kind": "external" } ], "edges": [ { "from": "merchant", "to": "gateway", "label": "HTTPS/TLS" }, { "from": "gateway", "to": "payment", "label": "route" }, { "from": "payment", "to": "vault", "label": "tokenize / charge" }, { "from": "payment", "to": "fraud", "label": "score (<100ms)" }, { "from": "payment", "to": "ledger", "label": "record entries" }, { "from": "payment", "to": "networks", "label": "authorize" } ], "annotations": { "vault": "Isolated CDE. The only system that stores or processes real PANs. AES-256 + HSM. All external systems use tokens.", "fraud": "Scores every transaction in <100ms. Stateless, horizontally scaled. ML models pre-loaded in memory.", "ledger": "Double-entry accounting. Every debit has a matching credit. The source of truth for all money movement.", "gateway": "Auth, rate limiting, TLS termination, idempotency key routing. Never touches raw card data." } }
\`\`\`

## Key Design Challenges

Each challenge in this table drives an entire subsystem in the upcoming lessons.

| Challenge | Why It's Hard | Addressed In |
|-----------|--------------|--------------|
| **Exactly-once processing** | Network failures cause retries → duplicate charges | Idempotency lesson |
| **Double-entry accounting** | Every cent tracked across millions of accounts | Ledger design lesson |
| **Sub-2s authorization** | Merchant → Stripe → card network → issuing bank → back | Payment flow lesson |
| **Fraud at 23K TPS** | Score in <100ms at peak load without DB bottlenecks | Fraud detection lesson |
| **Multi-region consistency** | Financial data requires strong consistency globally | Storage & replication lesson |

\`\`\`callout
{ "type": "danger", "title": "The $50M retry storm", "content": "In 2019, a major fintech processed the same $1.2M payment 47 times during a network partition — because their retry logic lacked idempotency guarantees across regions. The incident cost $50M in reconciliation, reversed transactions, and regulatory fines. Idempotency is a correctness requirement, not an optimization." }
\`\`\`

\`\`\`quiz
{ "title": "Requirements & Compliance Check", "questions": [ { "question": "Which PCI DSS level applies to a processor handling Stripe's volume, and what does it require?", "options": [ "Level 4 — annual self-assessment questionnaire only", "Level 2 — annual self-assessment plus quarterly ASV scans", "Level 1 — annual on-site audit by a QSA plus quarterly ASV network scans", "Level 3 — self-assessment for processors with 20K–1M e-commerce transactions" ], "answer": 2, "explanation": "PCI DSS Level 1 applies to entities processing more than 6 million card transactions per year. It mandates an annual on-site audit by a Qualified Security Assessor (QSA) and quarterly network scans by an Approved Scanning Vendor (ASV) — the most rigorous tier of PCI compliance." }, { "question": "What is the primary architectural purpose of tokenization in PCI compliance?", "options": [ "To speed up authorization by pre-caching decrypted card details near edge nodes", "To compress card data for faster transmission across payment rails", "To replace real PANs with opaque tokens so all systems outside the CDE never handle raw card numbers", "To encrypt card numbers bidirectionally so they can be stored in any database" ], "answer": 2, "explanation": "Tokenization replaces the real PAN with a non-reversible token. Only the Card Vault inside the isolated CDE can detokenize. All other services — fraud, ledger, subscriptions — operate on tokens, drastically shrinking the PCI compliance scope and the blast radius of any breach." }, { "question": "At Black Friday peak (~23,000 TPS), what makes real-time fraud scoring architecturally hard?", "options": [ "Fraud models are too large to fit in GPU memory", "A sequential scorer at 100ms/request would accumulate millions of transactions of backlog per second", "Card networks impose a strict rate limit on external fraud score API calls", "Scoring requires reading a user's full transaction history from a relational database on every request" ], "answer": 1, "explanation": "At 23K TPS, a 100ms sequential scorer can only process 10 scores/second per thread — it would fall 22,990 transactions behind every second. Fraud scoring must be stateless and horizontally scaled with ML models pre-loaded in memory, not queried from a database at inference time." }, { "question": "Which non-functional requirement is least negotiable in a payment system, and why?", "options": [ "Availability — 99.9% uptime is sufficient for most merchants", "Latency — 5-second authorization is acceptable for high-value transactions", "Consistency — duplicating or losing money is a correctness failure with direct legal and financial consequences", "Scalability — payment volume is predictable and grows slowly enough for manual capacity planning" ], "answer": 2, "explanation": "Strong consistency is non-negotiable. Unlike social media where a stale feed is a minor UX issue, inconsistency in a payment ledger means real money is lost or duplicated — triggering chargebacks, regulatory scrutiny, and customer lawsuits. This is why financial systems use strong consistency at the ledger layer even at the cost of higher latency." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Stripe is a distributed ledger first, API second — every design decision flows from financial correctness requirements, not web service convenience.", "PCI DSS Level 1 mandates tokenization and CDE network isolation: raw PANs must never leave the vault, ensuring all downstream systems operate on opaque tokens with no mathematical relationship to card numbers.", "At 23,000 peak TPS, fraud scoring must be stateless, horizontally scaled, and model-in-memory — sequential DB-backed scoring is architecturally impossible at this load.", "Global compliance is fragmented across 200+ frameworks: India mandates data localization, Europe requires SCA (PSD2), Brazil mandates PIX — regional routing and data residency are first-class architectural requirements.", "Idempotency is a correctness requirement, not an optimization — the 2019 $50M retry storm demonstrates what happens when distributed payment systems lack deduplication guarantees across regions." ] }
\`\`\``,
    },
    {
      id: "stripe-payment-flow",
      slug: "stripe-payment-flow",
      title: "Payment Processing Flow",
      content: `# Stripe: Payment Processing Flow

## The PaymentIntent Lifecycle

Stripe models every payment as a **PaymentIntent** — a persistent object that tracks a charge from initial creation through to final settlement. Rather than treating a payment as a single atomic API call, the PaymentIntent exposes each stage as an explicit, queryable state.

\`\`\`concept
{ "title": "PaymentIntent as a State Machine", "variant": "mental-model", "content": "Think of a PaymentIntent like a deli counter ticket. The ticket is created (requires_payment_method), called (requires_confirmation), potentially held at a security checkpoint (requires_action for 3DS), being prepared (processing), and finally served (succeeded) or discarded (failed). The ticket persists so both the system and the merchant always know exactly where in the queue the payment stands — even across retries and network failures." }
\`\`\`

The state transitions follow a strict directed graph. Most payments traverse the happy path in under a second; the \`requires_action\` detour adds 3–5 seconds when 3D Secure is triggered.

\`\`\`mermaid
stateDiagram-v2
    direction TB
    [*] --> requires_payment_method : PaymentIntent created
    requires_payment_method --> requires_confirmation : card attached
    requires_confirmation --> requires_action : 3DS needed
    requires_confirmation --> processing : no 3DS required
    requires_action --> processing : cardholder verified
    requires_action --> failed : verification failed / timed out
    processing --> succeeded : bank approved
    processing --> failed : bank declined
    succeeded --> captured : funds held
    captured --> refunded : refund issued (partial or full)
\`\`\`

---

## Authorization vs Capture

A payment is not one operation — it is two. **Authorization** places a hold on the cardholder's funds; **capture** converts that hold into an actual charge. Stripe exposes this split deliberately so merchants can choose when money moves.

### Authorization

The issuing bank checks for sufficient funds, card status, and velocity limits, then returns an authorization code and places a hold. No money moves yet. This hold expires in approximately 7 days (varies by card network).

### Capture

The merchant confirms the transaction. Funds transfer through the card network from the cardholder's issuing bank to the merchant's acquiring bank.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Automatic Capture (default)", "code": "POST /v1/payment_intents\\n{\\n  \\"amount\\": 4823,\\n  \\"currency\\": \\"usd\\",\\n  \\"capture_method\\": \\"automatic\\"\\n}\\n\\n// Auth + Capture happen atomically on confirmation.\\n// Funds charged immediately on authorization success.\\n// Best for: digital goods, SaaS subscriptions." }, "after": { "label": "Manual Capture (deferred)", "code": "// Step 1: Authorize at checkout\\nPOST /v1/payment_intents\\n{\\n  \\"amount\\": 4823,\\n  \\"currency\\": \\"usd\\",\\n  \\"capture_method\\": \\"manual\\"\\n}\\n// → Hold placed. No money moves yet.\\n\\n// Step 2: Capture when the final amount is known\\nPOST /v1/payment_intents/{id}/capture\\n// → Hold converted to actual charge.\\n// Best for: e-commerce (capture at shipment),\\n// hotels (capture at checkout), car rentals." } }
\`\`\`

**Why does the split matter?** Hotels authorize a deposit at check-in but only capture the exact final amount (minibar, incidentals) at checkout. E-commerce merchants authorize at order time but capture only when the item ships — avoiding charging customers for items that go out of stock.

---

## The Authorization Flow in Detail

Every authorization passes through Stripe's internal pipeline before reaching the card network. The entire round-trip budget is under 2 seconds.

\`\`\`sysdiag
{ "title": "Authorization Request Pipeline (~800ms)", "width": 740, "height": 300, "nodes": [ { "id": "merchant", "label": "Merchant", "x": 60, "y": 150, "kind": "service" }, { "id": "apigw", "label": "Stripe API GW", "x": 210, "y": 150, "kind": "service" }, { "id": "fraud", "label": "Fraud Engine", "x": 350, "y": 60, "kind": "service" }, { "id": "network", "label": "Card Network", "x": 490, "y": 150, "kind": "service" }, { "id": "bank", "label": "Issuing Bank", "x": 640, "y": 150, "kind": "service" } ], "edges": [ { "from": "merchant", "to": "apigw", "label": "POST /payment_intents" }, { "from": "apigw", "to": "fraud", "label": "score request" }, { "from": "apigw", "to": "network", "label": "auth request" }, { "from": "network", "to": "bank", "label": "authorize" }, { "from": "bank", "to": "network", "label": "approved: A12345" }, { "from": "network", "to": "apigw", "label": "auth approved" }, { "from": "apigw", "to": "merchant", "label": "200 OK: succeeded" } ], "annotations": { "apigw": "Validates request, deduplicates via idempotency key, orchestrates fraud check and network call. ~100ms internal processing.", "fraud": "ML model scores transaction in real time. Risk score 0–100; low scores proceed directly. ~50ms. High scores may trigger 3DS.", "bank": "Checks available funds, card status, velocity limits. Places hold if approved. ~650ms round-trip — the dominant latency source." } }
\`\`\`

**Latency breakdown:**

| Stage | Latency |
|---|---|
| Stripe internal processing | ~100ms |
| Fraud scoring | ~50ms |
| Card network + issuing bank | ~650ms (external, variable) |
| **Total** | **~800ms** |

---

## 3D Secure: Strong Customer Authentication

3DS adds an authentication step where the cardholder proves identity with their issuing bank — via SMS OTP, biometric, or in-app approval. It is mandated under PSD2 in Europe and increasingly adopted globally for high-risk transactions.

\`\`\`callout
{ "type": "info", "title": "The Liability Shift", "content": "3DS trades conversion rate for fraud protection. When the cardholder completes a 3DS challenge and the issuing bank authenticates them, liability for subsequent fraud chargebacks shifts from the merchant to the issuing bank. High-value merchants accept the 5–15% challenge drop-off because the chargebacks avoided cost more than the lost sales." }
\`\`\`

### Stripe's Adaptive 3DS — Three Risk Tiers

Stripe's ML risk engine scores each transaction and decides whether to skip 3DS entirely, apply frictionless 3DS (silent background check), or trigger the full challenge flow.

\`\`\`tabs
{ "tabs": [ { "label": "Skip (Low Risk)", "icon": "✅", "content": "**Trigger:** Low-risk signals — returning customer, known device fingerprint, small amount, domestic transaction.\\n\\n**Example:** $12 coffee, same card used 20× this month, same browser fingerprint.\\n\\n**Flow:** Stripe authorizes directly — no 3DS handshake initiated.\\n\\n**Impact:** Zero added latency, zero friction. ~95% of legitimate transactions land here." }, { "label": "Frictionless (Medium Risk)", "icon": "⚡", "content": "**Trigger:** Moderate signals — new card on file, slightly elevated amount, new device but known email.\\n\\n**Example:** $200 electronics, card added today, known billing address.\\n\\n**Flow:** 3DS handshake happens silently between Stripe and the issuing bank. No user action required — the bank verifies in the background.\\n\\n**Impact:** +300–500ms latency, no visible friction to the cardholder. Liability still shifts to bank." }, { "label": "Challenge (High Risk)", "icon": "🔐", "content": "**Trigger:** High-risk signals — large amount, new account, foreign IP, velocity anomaly, suspicious merchant category.\\n\\n**Example:** $2,000 luxury item, account created 10 minutes ago, IP from a different country.\\n\\n**Flow:** Cardholder is redirected to the bank's 3DS page. Must verify via SMS code, push notification, or biometric.\\n\\n**Impact:** +3–5 seconds latency, 5–15% drop-off. On success, all fraud chargeback liability shifts to the issuing bank." } ] }
\`\`\`

---

## Refunds

Refunds reverse a captured payment — fully or partially. The original ledger entries are **never modified**; instead, new reversal entries are appended, preserving the complete audit trail.

\`\`\`steps
{ "title": "Refund Processing Flow", "steps": [ { "title": "Merchant initiates the refund", "content": "\`\`\`\\nPOST /v1/refunds\\n{\\n  \\"payment_intent\\": \\"pi_3NxWv2AbCdEfGh\\",\\n  \\"amount\\": 2500\\n}\\n\`\`\`\\nSpecify \`amount\` in cents for partial refunds. Omit \`amount\` for a full refund. An idempotency key prevents duplicate submissions on retries." }, { "title": "Validation", "content": "The Refund Service checks: \`requested_amount ≤ (captured_amount − sum_of_prior_refunds)\`. Attempting to refund more than was captured returns a 400 error immediately — no network call is made." }, { "title": "Double-entry ledger reversal", "content": "Two new rows are appended (append-only — original rows untouched):\\n\\n| account | amount | type |\\n|---|---|---|\\n| Merchant clearing | −$25.00 | DEBIT |\\n| Cardholder clearing | +$25.00 | CREDIT |\\n\\nThe ledger sum remains zero — the double-entry invariant holds." }, { "title": "Card network submission", "content": "Stripe submits the refund to the card network, which routes it to the issuing bank. The issuing bank credits the cardholder's account within **3–10 business days** depending on network and institution. Stripe shows the refund as \`pending\` until the bank confirms receipt." } ] }
\`\`\`

---

## Settlement

Settlement is the T+2 batch process where money physically moves from card networks into Stripe's accounts, and Stripe initiates ACH payouts to merchants.

\`\`\`
Day 0:   Authorization + Capture
Day 1:   Card network batches the day's settled transactions
Day 2:   Funds arrive at Stripe's settlement account
         Stripe calculates net merchant payout:

           Captured amount:              $48.23
           Stripe fee (2.9% + $0.30):   − $1.70
           Net to merchant:              $46.53

         ACH payout initiated to merchant's bank
Day 3–4: Merchant receives funds
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Succeeded ≠ Settled", "content": "Merchants see status: 'succeeded' at authorization time (Day 0), but they do not have the money yet. Settlement happens at Day 2–4. This gap is why chargebacks and refunds can still reverse an apparently 'successful' payment — the funds haven't actually transferred yet." }
\`\`\`

---

## Scale Numbers

These figures ground the architectural decisions made throughout this module:

| Metric | Value |
|---|---|
| Peak authorization throughput | 23,000 TPS |
| Card network round-trip | 200–800ms (varies by issuer geography) |
| Refund volume | ~2% of transactions (~460 TPS) |
| Settlement batch size | ~500M records/day |
| PaymentIntent retention | 7+ years (regulatory compliance) |

\`\`\`quiz
{ "title": "Payment Processing Flow — Check Your Understanding", "questions": [ { "question": "A hotel authorizes a $500 hold at check-in and will capture the final amount at checkout (which may differ). Which capture_method should they configure, and why?", "options": [ "automatic — it's simpler and always captures immediately", "manual — authorize now, capture the exact final amount later when it's known", "manual — to avoid paying Stripe fees until checkout", "automatic — because authorization holds expire after exactly 24 hours" ], "answer": 1, "explanation": "Hotels use manual capture because the final charge amount isn't known at authorization time (minibar charges, incidentals, damage deposits). Authorize the estimated hold at check-in, then call /capture with the exact final amount at checkout. Authorization holds last up to ~7 days depending on the card network, not 24 hours." }, { "question": "A $2,000 transaction triggers 3DS challenge flow. The cardholder authenticates successfully. The transaction later turns out to be fraudulent. Who bears the chargeback liability?", "options": [ "The merchant — they accepted and shipped the goods", "Stripe — they processed the transaction", "The issuing bank — liability shifted on successful 3DS authentication", "Split equally between merchant and issuing bank" ], "answer": 2, "explanation": "The entire value proposition of 3DS for merchants is the liability shift. When the cardholder completes a 3DS challenge and the issuing bank authenticates them, liability for subsequent fraud chargebacks transfers from the merchant to the issuing bank. This is why merchants accept a 5–15% drop-off rate on challenge flows for high-value transactions." }, { "question": "A PaymentIntent reaches status: 'succeeded' at 2:00 PM on Monday. When will the merchant's bank account most likely receive the funds?", "options": [ "Monday at 2:05 PM — funds transfer in real time", "Monday end of day — same-day ACH settlement", "Wednesday or Thursday — T+2 settlement plus ACH transfer time", "The following Monday — weekly payout batches only" ], "answer": 2, "explanation": "Settlement follows T+2: Day 0 (Monday) authorization and capture; Day 1 (Tuesday) card network batches transactions; Day 2 (Wednesday) funds arrive at Stripe and ACH payout is initiated; Day 3–4 (Wednesday/Thursday) funds land in merchant's bank. The 'succeeded' status reflects authorization approval, not fund receipt." }, { "question": "A merchant issues a partial refund of $25 on a $48.23 charge. Which statement correctly describes what happens in the double-entry ledger?", "options": [ "The original $48.23 capture entry is modified to $23.23 in-place", "Two new reversal entries are appended: debit merchant −$25.00, credit cardholder +$25.00", "The original transaction is deleted and a new $23.23 charge is created", "A new PaymentIntent for −$25.00 is created to represent the refund" ], "answer": 1, "explanation": "Payment ledgers are append-only and immutable for audit and compliance purposes. A refund appends two new reversal entries (debit merchant, credit cardholder clearing) rather than modifying or deleting the original capture rows. This preserves the complete audit trail required by financial regulations and makes reconciliation deterministic." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A PaymentIntent is a persistent state machine — every payment is trackable at each stage from creation through settlement, enabling safe retries without double-charging.", "Authorization places a hold (no money moves); capture converts the hold into an actual transfer. Manual capture lets merchants defer to when the final amount is known.", "The authorization pipeline takes ~800ms: ~150ms inside Stripe (API validation + fraud scoring) and ~650ms for the external card network and issuing bank round-trip.", "Stripe's adaptive 3DS routes ~95% of legitimate transactions to the no-challenge path, reserving friction for high-risk transactions while shifting fraud chargeback liability to the issuing bank.", "Settlement is T+2: 'succeeded' means authorized, not funded. Refunds append new reversal entries — original ledger rows are never modified, preserving the immutable audit trail." ] }
\`\`\``,
    },
    {
      id: "stripe-idempotency",
      slug: "stripe-idempotency",
      title: "Idempotency & Exactly-Once",
      content: `## The Problem: Duplicate Charges

Network failures are inevitable. When a payment request fails mid-flight, the client cannot know whether the charge succeeded or not. This creates a dangerous ambiguity.

\`\`\`concept
{ "title": "The Retry Dilemma", "variant": "mental-model", "content": "Every retry without idempotency is a gamble: did the original request succeed silently, or did it fail? In payments, guessing wrong means charging a customer twice. The system must answer this question deterministically — not probabilistically." }
\`\`\`

Consider the classic timeout scenario:

\`\`\`mermaid
sequenceDiagram
    participant M as Merchant
    participant S as Stripe API
    participant DB as Database

    M->>S: POST /v1/charges (amount: $48.23)
    S->>DB: INSERT payment_intents
    DB-->>S: row created ✓
    Note over S: Charge successful!
    S--xM: Response lost in transit (timeout)
    Note over M: Did it work? Retrying...
    M->>S: POST /v1/charges (amount: $48.23)
    S->>DB: INSERT payment_intents (again)
    Note over DB,S: 💥 DOUBLE CHARGE
\`\`\`

At 500M transactions/day, even a 0.01% duplicate rate produces **50,000 double charges daily** — each one a potential dispute, chargeback, and lost customer.

## Idempotency Keys: The Solution

Stripe's answer is the **Idempotency-Key** header. Every mutating API call accepts a client-generated key. If the same key arrives twice, the second call returns the first call's cached response — no re-execution.

\`\`\`concept
{ "title": "Idempotency Key Contract", "variant": "rule", "content": "For any given Idempotency-Key, only the first request ever executes. All subsequent requests with that key receive the cached response from the first execution. The operation is frozen in time from the key's perspective." }
\`\`\`

The key naming convention encodes business intent:

\`\`\`
order_12345_payment_v1
└──────┬──────┘ └─┬──┘ └┤
   order ID    action  version
\`\`\`

Including a version lets you generate a *new* key if you intentionally want a fresh attempt (e.g., customer explicitly retried after cancelling the first attempt).

## How It Works Internally

\`\`\`algoviz
{
  "title": "Idempotency Key Lookup State Machine",
  "type": "array",
  "data": ["NEW REQUEST", "CHECK STORE", "KEY EXISTS?", "STATUS?", "PROCESS", "STORE RESULT"],
  "frames": [
    { "highlight": [0], "label": "Incoming request with Idempotency-Key header arrives", "stats": { "key": "order_12345_v1", "action": "received" } },
    { "highlight": [1], "label": "Hash the key (SHA-256) and query idempotency_keys table", "stats": { "key": "sha256('order_12345_v1')", "action": "lookup" } },
    { "highlight": [2], "label": "Does this key hash already exist in the store?", "stats": { "found": false, "action": "miss" } },
    { "highlight": [4], "label": "Key not found → INSERT with status='started', then process the request", "stats": { "status": "started", "action": "processing" } },
    { "highlight": [5], "label": "Store the full response body, update status='completed'", "stats": { "status": "completed", "cached": true } },
    { "highlight": [2], "label": "Second request arrives with same key — hits the store again", "stats": { "found": true, "action": "hit" } },
    { "highlight": [3], "label": "Status = completed → return cached response immediately. No re-execution.", "stats": { "status": "completed", "action": "cache hit" } }
  ],
  "speed": 900
}
\`\`\`

**The concurrent case:** If a second request arrives while the first is still \`in_progress\`, the system returns **409 Conflict** — telling the caller to back off and retry rather than having two workers race to process the same operation.

### Idempotency Store Schema

\`\`\`sql
CREATE TABLE idempotency_keys (
  key_hash      CHAR(64)     PRIMARY KEY,          -- SHA-256 of client key
  status        VARCHAR(16)  NOT NULL,             -- 'started' | 'completed'
  response_body JSONB,                             -- cached response
  created_at    TIMESTAMPTZ  DEFAULT now(),
  expires_at    TIMESTAMPTZ  DEFAULT now() + INTERVAL '24 hours'
);

-- Atomic check-and-insert via ON CONFLICT:
INSERT INTO idempotency_keys (key_hash, status)
VALUES (\\\${keyHash}, 'started')
ON CONFLICT (key_hash) DO NOTHING
RETURNING status;
\`\`\`

The \`ON CONFLICT DO NOTHING\` pattern is critical: it makes the check-then-insert **atomic** under concurrent requests, eliminating the TOCTOU race condition.

\`\`\`callout
{ "type": "warning", "title": "Key Scope Matters", "content": "Idempotency keys are scoped per merchant API key. The same key string sent by two different merchants is treated as two independent operations. Stripe hashes (merchant_id + client_key) together, not the raw key alone." }
\`\`\`

## Delivery Semantics: A Taxonomy

\`\`\`tabs
{
  "tabs": [
    {
      "label": "At-Most-Once",
      "icon": "1️⃣",
      "content": "**Strategy:** Send the request. Never retry.\\n\\n**Risk:** If the network drops the request, the payment is silently lost. The customer sees no charge, the merchant never receives funds.\\n\\n**Verdict:** ❌ Unacceptable for payments. Silent money loss is worse than a failed UX.\\n\\n**Where used:** Fire-and-forget analytics events, non-critical notifications."
    },
    {
      "label": "At-Least-Once",
      "icon": "🔁",
      "content": "**Strategy:** Retry on failure until you get a success response.\\n\\n**Risk:** Without idempotency, every retry is a potential duplicate charge. A server that processed the request but crashed before responding will process it again on retry.\\n\\n**Verdict:** ❌ Dangerous for payments without additional safeguards.\\n\\n**Where used:** Acceptable for idempotent reads (GET requests), or any operation where duplicates are harmless."
    },
    {
      "label": "Exactly-Once",
      "icon": "✅",
      "content": "**Strategy:** At-least-once delivery **+** idempotent processing.\\n\\n**Guarantee:** The payment executes exactly once regardless of retries, crashes, or network timeouts.\\n\\n**How it works mathematically:**\\n- \`at-least-once\` ensures the operation eventually succeeds\\n- \`idempotent processing\` ensures re-execution has no additional effect\\n- Together: \`at-least-once ∩ idempotent = effectively exactly-once\`\\n\\n**Verdict:** ✅ The only acceptable model for payment systems."
    }
  ]
}
\`\`\`

## Implementing Safe Retries

Without idempotency keys, retry logic is dangerous. With them, retrying a 500 is **provably safe**.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Unsafe — No Idempotency Key",
    "code": "async function chargeCustomer(amount) {\\n  for (let attempt = 1; attempt <= 3; attempt++) {\\n    try {\\n      // NEW request object each time — no stable key!\\n      return await stripe.paymentIntents.create({\\n        amount,\\n        currency: 'usd'\\n      });\\n    } catch (err) {\\n      if (err.statusCode >= 500) {\\n        // Retry a 500... but did the first attempt succeed?\\n        // We have NO IDEA. This could double-charge.\\n        await sleep(backoff(attempt));\\n      }\\n    }\\n  }\\n}"
  },
  "after": {
    "label": "Safe — Idempotency Key Per Business Operation",
    "code": "async function chargeCustomer(amount, orderId) {\\n  // Key tied to the business operation, not the attempt number\\n  const idempotencyKey = \`order_\\\\\${orderId}_payment_v1\`;\\n\\n  for (let attempt = 1; attempt <= 3; attempt++) {\\n    try {\\n      return await stripe.paymentIntents.create(\\n        { amount, currency: 'usd' },\\n        { idempotencyKey }   // same key on every retry\\n      );\\n    } catch (err) {\\n      if (err.statusCode === 409) {\\n        // Concurrent duplicate — back off, the first is still processing\\n        await sleep(1000); continue;\\n      }\\n      if (err.statusCode >= 500) {\\n        // Safe to retry: idempotency guarantees no double-charge\\n        await sleep(backoff(attempt)); continue;\\n      }\\n      if (err.statusCode === 400) {\\n        throw err; // Client error — retrying won't help\\n      }\\n    }\\n  }\\n  throw new Error('Payment failed after 3 attempts');\\n}"
  }
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Which Errors Are Safe to Retry?", "content": "**500 (server error):** Always safe with idempotency key — the server may have crashed after processing.\\n\\n**409 (conflict):** Concurrent duplicate in progress — wait and retry, the original will complete.\\n\\n**400 (client error):** Never retry — bad input won't get better. Fix the request first.\\n\\n**200:** Already succeeded — idempotency cache returned the first response." }
\`\`\`

## Database-Level Idempotency

API-level idempotency handles client retries. But what about Kafka consumers and async workers? These need a separate layer.

\`\`\`steps
{
  "title": "Exactly-Once Event Processing (Kafka Consumer)",
  "steps": [
    {
      "title": "Read the event_id",
      "content": "Each Kafka message carries a stable \`event_id\` (e.g., \`evt_1Nab3cXYZ\`). This is the dedup key for the consumer side."
    },
    {
      "title": "Check the dedup table",
      "content": "Query \`processed_events\` for the \`event_id\`. If found, skip this message entirely — it was already handled by a previous consumer run.\\n\\n\`\`\`sql\\nSELECT 1 FROM processed_events WHERE event_id = '\\\\\${eventId}';\\n\`\`\`"
    },
    {
      "title": "Process the event",
      "content": "Execute the business logic: update the payment state machine, write ledger entries, trigger downstream services."
    },
    {
      "title": "Atomic commit (the critical step)",
      "content": "Within a **single ACID transaction**, write both the business result AND the dedup marker:\\n\\n\`\`\`sql\\nBEGIN;\\n  INSERT INTO ledger_entries (tx_id, ...) VALUES ('\\\\\${txId}', ...);\\n  INSERT INTO processed_events (event_id) VALUES ('\\\\\${eventId}');\\nCOMMIT;\\n\`\`\`\\n\\nIf the commit fails, neither write lands. The event will be retried and processed cleanly."
    },
    {
      "title": "Acknowledge the message",
      "content": "Only after the transaction commits, acknowledge the Kafka offset. If the process crashes before ack, Kafka re-delivers — but the dedup marker now exists, so step 2 catches it."
    }
  ]
}
\`\`\`

The transactional write of \`(business_result + dedup_marker)\` in the same ACID transaction is called the **transactional outbox pattern** and is the foundation of exactly-once processing in event-driven systems.

\`\`\`callout
{ "type": "info", "title": "DB Unique Constraints as Idempotency", "content": "For ledger entries, add a unique constraint on (tx_id, entry_type). If two workers race to insert the same transaction, the second gets a UNIQUE VIOLATION and silently skips — zero additional code required.\\n\\n\`\`\`sql\\nALTER TABLE ledger_entries\\n  ADD CONSTRAINT uq_ledger_tx_type UNIQUE (tx_id, entry_type);\\n\`\`\`" }
\`\`\`

## Scale Profile

| Metric | Value | Notes |
|--------|-------|-------|
| Idempotency lookups | ~23,000/s | One per mutating API call |
| Active keys in store | ~500M | 24-hour rolling window |
| Lookup latency | < 2ms | Hash index on SHA-256 key |
| Key collision probability | ≈ 0 | SHA-256 on unique merchant input |
| False positive rate | 0% | Exact hash match, not probabilistic |
| Storage backend | PostgreSQL | Redis rejected — durability required |

\`\`\`callout
{ "type": "warning", "title": "Why Not Redis for the Idempotency Store?", "content": "Redis offers sub-millisecond reads but is eventually persistent. A Redis node failure before a key is flushed to disk means that key is lost — and the next retry processes the payment again. For idempotency, **a lost key equals a potential double charge**. PostgreSQL's WAL guarantees that once a key is written, it survives node failure." }
\`\`\`

## Trade-off Summary

| Decision | Stripe's Choice | Alternative | Rationale |
|----------|----------------|-------------|-----------|
| Key storage | PostgreSQL | Redis | Durability > speed — lost key = duplicate charge |
| Key TTL | 24 hours | Forever | Balances storage cost vs. legitimate retry window |
| Key hashing | SHA-256 | Raw string | Fixed-size index, no key length limits |
| Conflict response | 409 → client retries | Server queues and serializes | Lower p99 latency for the overwhelmingly common path |
| Concurrent protection | \`INSERT ... ON CONFLICT\` | Application-level lock | Atomic at the DB level — no distributed lock needed |

\`\`\`quiz
{
  "title": "Idempotency & Exactly-Once Processing",
  "questions": [
    {
      "question": "A merchant's server receives a 500 error from Stripe after calling POST /v1/payment_intents with an Idempotency-Key. What is the correct behavior?",
      "options": [
        "Generate a new Idempotency-Key and retry — the old key might be tainted",
        "Retry with the same Idempotency-Key — the idempotency layer guarantees no double-charge",
        "Do not retry — 500 errors mean the charge definitely went through",
        "Retry three times, each time with a different Idempotency-Key"
      ],
      "answer": 1,
      "explanation": "The whole point of the Idempotency-Key is to make retries safe. If you generate a new key on retry, you lose the protection — a new key creates a new execution. Use the same key tied to the business operation (e.g., order ID), not the attempt number."
    },
    {
      "question": "What does a 409 Conflict response from the idempotency layer indicate?",
      "options": [
        "The key has expired and needs to be regenerated",
        "A concurrent request with the same key is currently being processed",
        "The previous request with this key failed and must be retried",
        "The key collided with another merchant's key via SHA-256 hash"
      ],
      "answer": 1,
      "explanation": "409 Conflict means a request with that idempotency key is already in-flight on another thread or server. The client should wait briefly and retry — it will eventually receive the cached response from the first execution once it completes."
    },
    {
      "question": "A Kafka consumer processes a 'payment.captured' event, writes ledger entries, then crashes before marking the event as processed. When the consumer restarts, what happens?",
      "options": [
        "The event is lost — Kafka removes it after one delivery attempt",
        "The consumer reprocesses the event and creates duplicate ledger entries",
        "The consumer reprocesses the event, but the dedup table prevents a second ledger write",
        "The consumer skips the event because the ledger already has the entries"
      ],
      "answer": 2,
      "explanation": "This is why the transactional outbox pattern writes the business result AND the dedup marker in the same ACID transaction. If the process crashed before the transaction committed, neither write landed — so the retry reprocesses cleanly. If both writes committed before the crash, the dedup marker exists and blocks re-processing."
    },
    {
      "question": "Why does Stripe use PostgreSQL (not Redis) as the idempotency key store despite Redis being faster?",
      "options": [
        "PostgreSQL is faster than Redis for key-value lookups with hash indexes",
        "Redis cannot store JSON response bodies larger than 512 bytes",
        "A Redis node failure could lose keys, turning future retries into duplicate charges",
        "PostgreSQL supports SHA-256 hashing natively while Redis does not"
      ],
      "answer": 2,
      "explanation": "The idempotency store must be durable. If a Redis node fails before flushing to disk, any keys written since the last snapshot are lost. The next client retry would find no key, execute the operation again, and potentially double-charge. PostgreSQL's WAL guarantees durability — once a key write is acknowledged, it survives node failure."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Exactly-once processing = at-least-once delivery + idempotent execution. Neither property alone is sufficient for payments.",
    "Idempotency keys must be scoped to a business operation (order ID + action), not to a request attempt — the same key must survive across retries.",
    "The idempotency store uses INSERT ... ON CONFLICT to atomically claim a key, preventing race conditions between concurrent duplicate requests.",
    "Event consumers need their own dedup layer: write business result and dedup marker in the same ACID transaction, acknowledge Kafka offset only after commit.",
    "PostgreSQL is preferred over Redis for the idempotency store because a lost key equals a potential double charge — durability outweighs raw latency at this layer."
  ]
}
\`\`\``,
    },
    {
      id: "stripe-ledger",
      slug: "stripe-ledger",
      title: "Ledger Design",
      content: `# Stripe: Ledger Design

## Why Ledgers Matter

In a payment platform, the ledger is the source of truth for all money movement. Every dollar that enters or exits the system must be tracked with perfect accuracy. A discrepancy of even one cent triggers a reconciliation investigation.

Stripe moves over $1 trillion per year. The ledger must handle 500M+ transactions per day while maintaining perfect consistency.

## Double-Entry Bookkeeping

Every financial transaction creates **two entries**: a debit to one account and a credit to another. The total of all debits must always equal the total of all credits. This is a 500-year-old accounting principle that catches errors automatically.

\`\`\`
Example: Merchant charges customer $50.00 (Stripe fee: $1.75)

Entry 1 (Authorization + Capture):
┌──────────────────┬────────┬─────────┬─────────────────────┐
│ Account          │ Debit  │ Credit  │ Description         │
├──────────────────┼────────┼─────────┼─────────────────────┤
│ Customer Payable │ $50.00 │         │ Amount owed by cust │
│ Merchant Payable │        │ $48.25  │ Amount owed to merch│
│ Stripe Revenue   │        │ $1.75   │ Processing fee      │
└──────────────────┴────────┴─────────┴─────────────────────┘
Total debits: $50.00    Total credits: $50.00 ✓

Entry 2 (Settlement — funds arrive from card network):
┌──────────────────┬────────┬─────────┬─────────────────────┐
│ Account          │ Debit  │ Credit  │ Description         │
├──────────────────┼────────┼─────────┼─────────────────────┤
│ Settlement Bank  │ $50.00 │         │ Funds received      │
│ Customer Payable │        │ $50.00  │ Customer debt cleared│
└──────────────────┴────────┴─────────┴─────────────────────┘

Entry 3 (Payout to merchant):
┌──────────────────┬────────┬─────────┬─────────────────────┐
│ Account          │ Debit  │ Credit  │ Description         │
├──────────────────┼────────┼─────────┼─────────────────────┤
│ Merchant Payable │ $48.25 │         │ Payout obligation   │
│ Payout Bank      │        │ $48.25  │ Funds sent to merch │
└──────────────────┴────────┴─────────┴─────────────────────┘
\`\`\`

## Immutable Ledger

Ledger entries are **append-only**. You never update or delete an entry. To reverse a transaction, you create new reversal entries.

\`\`\`
Wrong (mutable ledger):
  UPDATE ledger SET amount = 0 WHERE tx_id = 'tx_123'
  → Destroys audit trail. When was it changed? By whom? Why?

Right (immutable ledger):
  INSERT INTO ledger (tx_id, type, amount, ...)
  VALUES ('tx_124', 'REVERSAL', -5000, ...)
  → Original entry preserved. Reversal clearly linked. Full audit trail.

Benefits:
  - Complete audit trail for regulators
  - Reproducible state at any point in time
  - No accidental data loss from UPDATE bugs
  - Append-only writes are fast (no row locking)
\`\`\`

## Ledger Schema

\`\`\`
Table: ledger_entries (append-only, partitioned by date)

┌───────────┬──────────────┬────────────┬─────────┬──────────┬──────────┐
│ entry_id  │ tx_id        │ account_id │ amount  │ currency │ type     │
│ (ULID)    │ (FK)         │ (FK)       │ (int)   │          │          │
├───────────┼──────────────┼────────────┼─────────┼──────────┼──────────┤
│ 01HX...   │ tx_abc123    │ acct_merch │ -4825   │ usd      │ CREDIT   │
│ 01HX...   │ tx_abc123    │ acct_cust  │ +5000   │ usd      │ DEBIT    │
│ 01HX...   │ tx_abc123    │ acct_rev   │ -175    │ usd      │ CREDIT   │
└───────────┴──────────────┴────────────┴─────────┴──────────┴──────────┘

Key design decisions:
  - Amounts in smallest currency unit (cents): $50.00 → 5000
    → Avoids floating-point errors entirely
  - ULID (Universally Unique Lexicographically Sortable ID) for entry_id
    → Time-ordered, globally unique, no sequence contention
  - Partitioned by created_date for efficient range queries
\`\`\`

## Balance Calculation

Account balances are derived from ledger entries, never stored as a mutable field:

\`\`\`
Approach 1: Real-time aggregation
  SELECT SUM(amount) FROM ledger_entries WHERE account_id = 'acct_merch'
  → Accurate but slow with millions of entries per account

Approach 2: Materialized balance with snapshots
  ┌──────────────────────────────────────────────────┐
  │ Balance snapshots (computed daily)                │
  │                                                  │
  │ acct_merch: balance = $142,567.23 as of 2024-03-13│
  │                                                  │
  │ Current balance =                                │
  │   snapshot_balance                               │
  │   + SUM(entries since snapshot)                   │
  │                                                  │
  │ Snapshot has ~500K entries pre-computed            │
  │ Delta since snapshot: ~2,000 entries              │
  │ Query: SUM over 2,000 rows ≈ 5ms                 │
  └──────────────────────────────────────────────────┘

Approach 3: Event-sourced running balance (Stripe's approach)
  Each entry includes running_balance at time of write.
  Latest entry's running_balance = current balance.
  Fast point lookup, but requires serial writes per account.
\`\`\`

## Reconciliation

Reconciliation ensures that Stripe's internal ledger matches external sources (card networks, banks):

\`\`\`
Daily reconciliation pipeline:

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Stripe       │  │ Card Network │  │ Bank         │
│ Ledger       │  │ Settlement   │  │ Statements   │
│ (internal)   │  │ Files        │  │              │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └────────────┬────┴─────────────────┘
                    ▼
         ┌──────────────────┐
         │ Reconciliation   │
         │ Engine           │
         │                  │
         │ For each tx:     │
         │ 1. Match by ref  │
         │ 2. Compare amount│
         │ 3. Flag mismatch │
         └────────┬─────────┘
                  │
         ┌────────▼─────────┐
         │ Match rate: 99.97%│
         │ Exceptions: 0.03% │
         │ → Manual review   │
         └──────────────────┘

Common mismatch causes:
  - Currency conversion rounding
  - Timing differences (settled on different days)
  - Partial captures / partial refunds
  - Chargebacks processed by network but not yet received
\`\`\`

## Multi-Currency Ledger

\`\`\`
A merchant in Germany charges a US customer in EUR:

Customer pays: $55.00 USD
Exchange rate: 1 EUR = 1.08 USD
Merchant receives: EUR 50.93

Ledger entries (dual-currency):
┌──────────────┬────────┬──────────┬──────────┐
│ Account      │ Amount │ Currency │ USD equiv│
├──────────────┼────────┼──────────┼──────────┤
│ Cust Payable │ +5500  │ USD      │ 5500     │
│ Merch Payable│ -5093  │ EUR      │ -5500    │
│ FX Spread    │ +7     │ USD      │ +7       │
│ Stripe Rev   │ -160   │ USD      │ -160     │
└──────────────┴────────┴──────────┴──────────┘

FX rate locked at transaction time.
FX spread is Stripe's margin on currency conversion.
\`\`\`

## Scale Numbers

\`\`\`
Ledger writes:          ~2B entries/day (4 entries per transaction avg)
Ledger table size:      ~100 TB (with 1 year retention in hot storage)
Balance queries:        ~50K/s (merchant dashboards, payout calculations)
Reconciliation:         ~500M records matched daily
Partitioning:           By date (daily partitions)
Replication:            3 replicas across availability zones
Write latency:          < 5ms per ledger entry batch
\`\`\``,
    },
    {
      id: "stripe-fraud",
      slug: "stripe-fraud",
      title: "Fraud Detection Pipeline",
      content: `# Stripe: Fraud Detection Pipeline

Payment fraud costs the global economy over **$30 billion annually**. A payment platform must block fraudulent transactions in real-time — without adding perceptible latency or blocking legitimate customers.

\`\`\`concept
{ "title": "The Fraud Engine's Impossible Bargain", "variant": "mental-model", "content": "At 23,000 TPS peak, the fraud engine has under 100ms to score each transaction. A false negative (missed fraud) costs chargebacks and destroys merchant trust. A false positive (blocked legitimate transaction) loses revenue and frustrates customers. The fraud system must optimize both error types simultaneously — in real time, at global scale." }
\`\`\`

The fundamental tension:

| Error Type | What Happens | Cost |
|---|---|---|
| False negative | Fraudulent transaction approved | Chargeback + merchant liability |
| False positive | Legitimate transaction blocked | Lost sale + customer frustration |

**Target:** block >95% of fraud with a false positive rate below 0.5% (fewer than 1 in 200 legitimate transactions blocked).

---

## Multi-Layer Defense Architecture

No single technique catches all fraud. Stripe layers five complementary defenses, each operating at a different timescale:

\`\`\`sysdiag
{ "title": "Fraud Defense Layers", "width": 680, "height": 400,
  "nodes": [
    { "id": "txn", "label": "Incoming Transaction", "x": 340, "y": 30, "kind": "client" },
    { "id": "l1", "label": "Layer 1\\nRule Engine\\n~1ms", "x": 340, "y": 110, "kind": "service" },
    { "id": "l2", "label": "Layer 2\\nML Scoring\\n~30ms", "x": 340, "y": 190, "kind": "service" },
    { "id": "l3", "label": "Layer 3\\n3DS Challenge\\n~5-30s", "x": 340, "y": 270, "kind": "service" },
    { "id": "block", "label": "BLOCK", "x": 160, "y": 190, "kind": "store" },
    { "id": "allow", "label": "ALLOW", "x": 520, "y": 190, "kind": "store" },
    { "id": "review", "label": "Layer 4\\nAsync Review\\n(post-auth)", "x": 520, "y": 340, "kind": "service" },
    { "id": "learn", "label": "Layer 5\\nDispute Learning\\n(days)", "x": 160, "y": 340, "kind": "store" }
  ],
  "edges": [
    { "from": "txn", "to": "l1", "label": "every txn" },
    { "from": "l1", "to": "block", "label": "score > 75" },
    { "from": "l1", "to": "l2", "label": "pass" },
    { "from": "l2", "to": "block", "label": "score > 75" },
    { "from": "l2", "to": "l3", "label": "score 50-75" },
    { "from": "l2", "to": "allow", "label": "score < 50" },
    { "from": "l3", "to": "review", "label": "async" },
    { "from": "block", "to": "learn", "label": "disputes feed back" }
  ],
  "annotations": {
    "l1": "Deterministic rules: blocklists, velocity checks, sanity checks. Runs in memory with hash maps and bloom filters. Short-circuits on first BLOCK hit.",
    "l2": "Gradient boosted model (XGBoost/LightGBM) scoring 100+ features. Interpretable, fast inference (~5ms), retrained daily.",
    "l3": "3D Secure challenge for medium-risk transactions. Shifts fraud liability to the issuing bank.",
    "review": "Human review queue + merchant-configured Radar Rules for edge cases.",
    "learn": "Dispute outcomes feed back into model retraining and blocklist updates."
  }
}
\`\`\`

Each layer has a distinct role: **Layer 1** is fast and deterministic; **Layer 2** is probabilistic but comprehensive; **Layers 3-5** handle ambiguity and adaptation.

---

## Layer 1: The Rule Engine

Rules are deterministic — no probability, no ambiguity. They encode known-bad patterns that require no ML:

\`\`\`tabs
{ "tabs": [
  { "label": "Block Rules", "icon": "🚫", "content": "Rules that immediately reject a transaction:\\n\\n\`\`\`\\nBLOCK IF card.country != ip.country\\n  AND amount > 500\\n  AND account.age < 7 days\\n\\nBLOCK IF card.number IN blocklist\\n\\nBLOCK IF same_card.attempts_1min > 5\\n\\nBLOCK IF billing.zip != avs.zip\\n  AND card.type = \\"prepaid\\"\\n\`\`\`\\n\\nEach rule targets a specific attack vector: geographic mismatch catches card-not-present fraud; velocity limits stop card testing attacks; AVS/ZIP mismatch with prepaid cards catches synthetic identity fraud." },
  { "label": "Review Rules", "icon": "🔍", "content": "Rules that flag for human review without outright blocking:\\n\\n\`\`\`\\nREVIEW IF amount > 10000\\n\\nREVIEW IF :is_new_customer:\\n  AND :risk_score: > 50\\n\\nREVIEW IF billing_country NOT IN\\n  merchant.supported_countries\\n\`\`\`\\n\\nReview rules catch high-value edge cases where automated blocking would be too aggressive. A $15,000 B2B transaction is legitimate; it just warrants a second look." },
  { "label": "Implementation", "icon": "⚙️", "content": "Rule execution details:\\n\\n- **Storage:** Rules loaded into memory as hash maps and bloom filters\\n- **Execution:** All ~500 rules evaluated in parallel\\n- **Short-circuit:** Stop evaluating on first BLOCK hit\\n- **Latency:** < 1ms for the full rule pass\\n- **Updates:** New rules propagated every 5 minutes without restart\\n\\nBloom filters are ideal for blocklist membership checks — O(1) lookup with a configurable false-positive rate (set near zero for fraud blocklists)." }
] }
\`\`\`

---

## Layer 2: ML Risk Scoring

The ML model converts 100+ features into a single risk score (0–100). Above 75 → block. Between 50–75 → trigger 3DS challenge. Below 50 → approve.

### Feature Engineering

\`\`\`collapse
{ "title": "Deep Dive: The 100+ Features", "content": "Features fall into five categories:\\n\\n**Card features**\\n- BIN (first 6 digits → issuer, country, card type)\\n- Card age and previous usage history across Stripe\\n- Number of distinct merchants this card has transacted at\\n\\n**Transaction features**\\n- Amount, currency, merchant category code (MCC)\\n- Time of day, day of week\\n- Is the amount a round number? (strong fraud signal — fraudsters test with $100.00, not $97.43)\\n\\n**Behavioral features**\\n- Time since card's last transaction\\n- Geographic distance from last transaction\\n- Device fingerprint match against known-good devices\\n- Typing speed on the payment form (bots type faster and more uniformly than humans)\\n\\n**Network features**\\n- Email domain reputation (disposable email = higher risk)\\n- IP reputation score (known VPN/proxy/TOR exit nodes)\\n- IP-to-card-country geographic distance\\n- Shared device or IP address across multiple cards (fraud rings)\\n\\n**Historical features**\\n- Chargeback rate for this BIN range\\n- Fraud rate for this merchant category\\n- Fraud rate for this IP subnet over trailing 30 days" }
\`\`\`

### Why Gradient Boosted Trees, Not Deep Learning?

\`\`\`concept
{ "title": "Trees Beat Neural Nets for Tabular Fraud Data", "variant": "rule", "content": "Gradient boosted trees (XGBoost/LightGBM) outperform deep learning on tabular features for three reasons: (1) They are inherently interpretable — you can explain exactly why a transaction was blocked, which is legally required in many jurisdictions. (2) Inference is fast: ~5ms per prediction vs. tens of milliseconds for a neural net forward pass. (3) New features can be added without changing model architecture — critical when fraud patterns evolve rapidly." }
\`\`\`

### Model Lifecycle

\`\`\`steps
{ "title": "Champion/Challenger Model Pipeline", "steps": [
  { "title": "Daily Training Run", "content": "New chargebacks and disputes from the previous 24 hours are labeled as fraud. The training dataset grows continuously — billions of labeled transactions. A new candidate model (the **challenger**) is trained overnight using the updated dataset." },
  { "title": "Shadow Mode (24h)", "content": "The challenger model runs in **shadow mode** alongside the current production model (the **champion**). It scores every live transaction but its decisions are logged only — they do not affect the authorization outcome. This surfaces real-world performance without risk." },
  { "title": "Comparison & Promotion", "content": "Shadow scores are compared against actual outcomes (fraud vs. legitimate). If the challenger's precision-recall curve improves over the champion's at the operating threshold, it is promoted to production. The old champion becomes the new shadow for rollback readiness." },
  { "title": "Continuous Feedback", "content": "Every chargeback filed is a new training label. Dispute outcomes from Layer 5 flow back into the feature store and training pipeline within 24 hours, keeping the model current against evolving fraud patterns." }
] }
\`\`\`

---

## Velocity Checks (Redis)

Velocity checks detect **card testing** and **credential stuffing** — attacks characterized by many rapid attempts. They sit in Layer 1 but deserve special attention.

\`\`\`concept
{ "title": "Sliding Window Counters", "variant": "analogy", "content": "Think of velocity checks as turnstiles with memory. Each dimension (card, IP, email) has its own counter that tracks how many events happened in a recent time window. The window slides forward with time — events older than the window length are discarded. If the counter exceeds a threshold, the turnstile blocks." }
\`\`\`

The implementation uses **Redis sorted sets** where each element's score is its Unix timestamp:

\`\`\`
Key: velocity:{card_hash}:1min
  ZADD → add event with current timestamp as score
  ZRANGEBYSCORE → count events in (now - 60s, now)
  ZREMRANGEBYSCORE → expire events older than window
  Threshold: > 5 attempts → BLOCK

Key: velocity:{ip}:10min
  Threshold: > 15 attempts → BLOCK

Key: velocity:{email}:1hour
  Threshold: > 3 distinct cards → BLOCK (card testing pattern)

Key: velocity:{merchant}:{card_hash}:24h
  Threshold: > 3 → REVIEW
\`\`\`

At peak load: ~100,000 velocity checks per second across all dimensions, with ~50 million active keys in Redis. The sorted-set approach gives O(log N) inserts and O(log N + K) range queries — fast enough at this scale.

\`\`\`callout
{ "type": "warning", "title": "Velocity Checks Are Not Symmetric", "content": "An IP sending 20 attempts in 10 minutes is almost certainly an attacker. But a legitimate merchant's bulk payment job might generate 200 charges from the same server IP in 10 minutes. Velocity rules must account for **trusted merchant IPs** and **batch contexts**, or they will generate massive false positives for enterprise customers." }
\`\`\`

---

## Real-Time vs. Batch Processing

The fraud system operates on two timescales that serve different purposes:

\`\`\`tabs
{ "tabs": [
  { "label": "Real-Time Path (<100ms)", "icon": "⚡", "content": "Every transaction synchronously passes through:\\n\\n| Step | Latency |\\n|---|---|\\n| Rule engine evaluation | < 1ms |\\n| Velocity checks (Redis) | < 2ms |\\n| Feature computation (feature store) | < 20ms |\\n| ML model inference | < 5ms |\\n| Decision aggregation | < 1ms |\\n| **Total** | **< 30ms** |\\n\\nThis entire pipeline runs within the ~2-second authorization window. The 30ms budget is spent on fraud scoring; the remaining time covers network round trips and bank authorization." },
  { "label": "Batch Path (async)", "icon": "🔄", "content": "After authorization, heavier analysis runs asynchronously:\\n\\n**Network graph analysis (hourly)**\\n- Discover fraud rings: clusters of accounts sharing devices, IPs, or addresses\\n- Run on Spark — too computationally expensive for real-time\\n- Findings feed next hour's rule engine as new blocklist entries\\n\\n**Model retraining (daily)**\\n- New chargeback labels incorporated\\n- Champion/challenger comparison\\n- New model in production within 24h of fraud pattern emergence\\n\\n**Blocklist updates (every 5 minutes)**\\n- New bad cards and IPs propagated to all rule engine instances\\n- Uses in-memory pub/sub — no restart required\\n\\n**Merchant risk scoring (weekly)**\\n- Aggregate fraud rates per merchant\\n- High-fraud merchants flagged for account review or rule tightening" }
] }
\`\`\`

---

## Stripe Radar: Merchant-Facing Fraud Controls

Stripe exposes its fraud infrastructure to merchants as **Radar**, a rules language that lets businesses customize fraud thresholds for their specific customer base:

\`\`\`
// Merchant-defined Radar Rules

BLOCK IF :risk_score: > 80
REVIEW IF :risk_score: > 50 AND :is_new_customer:
ALLOW IF :customer_email: ENDS_WITH "@trusted-corp.com"
BLOCK IF :card_country: NOT IN ("US", "CA", "GB")
\`\`\`

\`\`\`concept
{ "title": "Why Expose Raw Risk Scores to Merchants?", "variant": "insight", "content": "Stripe's global fraud model is calibrated for the average merchant. But a cryptocurrency exchange has a very different risk profile than a florist. Radar lets merchants tune their own threshold — a high-risk fintech might set BLOCK at score > 60, while a low-margin e-commerce store might tolerate score > 85 to maximize conversion. The platform wins when merchants can optimize for their own business, not just Stripe's aggregate." }
\`\`\`

Merchants see, for every payment:
- The risk score (0–100)
- Which specific risk factors triggered (e.g., "IP country mismatch", "high-velocity card")
- Historical fraud analytics for their account
- Early warning alerts for chargeback spikes

---

## Scale Numbers

\`\`\`tabs
{ "tabs": [
  { "label": "Throughput", "icon": "📊", "content": "| Metric | Value |\\n|---|---|\\n| Peak transaction rate | 23,000 TPS |\\n| Velocity check keys in Redis | ~50M active |\\n| Scoring service instances | ~50 |\\n| Scores per instance per second | ~500 |\\n| Model retraining frequency | Daily (automated) |" },
  { "label": "Latency", "icon": "⏱️", "content": "| Step | Latency |\\n|---|---|\\n| Rule engine | < 1ms |\\n| Feature computation | < 20ms |\\n| ML inference | < 5ms |\\n| End-to-end fraud score | < 30ms p95 |\\n| Blocklist propagation | < 5 minutes |" },
  { "label": "Quality", "icon": "🎯", "content": "| Metric | Value |\\n|---|---|\\n| Fraud block rate | > 95% |\\n| False positive rate | < 0.5% |\\n| Fraud blocked annually | > $10B |\\n| ML model features | 100+ per transaction |\\n| Model size in memory | ~200 MB |\\n| Active platform rules | ~500 + per-merchant |" }
] }
\`\`\`

---

\`\`\`quiz
{ "title": "Fraud Detection Pipeline", "questions": [
  {
    "question": "At 23,000 TPS, the fraud engine must produce a score within a tight budget. What is the target end-to-end fraud scoring latency (p95)?",
    "options": ["< 5ms", "< 30ms", "< 100ms", "< 500ms"],
    "answer": 1,
    "explanation": "The fraud scoring pipeline targets < 30ms p95 — roughly 1ms (rules) + 20ms (feature computation) + 5ms (ML inference) + overhead. The full payment authorization window is ~2 seconds; fraud scoring consumes ~30ms of that budget."
  },
  {
    "question": "Why does Stripe use Gradient Boosted Trees (XGBoost/LightGBM) rather than deep learning for fraud scoring?",
    "options": [
      "Deep learning is too expensive to license",
      "Gradient boosted trees are interpretable, have fast inference (~5ms), and handle tabular data better than neural nets",
      "Neural networks cannot process more than 50 features",
      "Regulatory requirements ban neural networks in financial systems"
    ],
    "answer": 1,
    "explanation": "For tabular feature sets, gradient boosted trees typically match or outperform neural networks. They are interpretable (you can explain why a transaction was blocked), infer in ~5ms, and handle new features without architecture changes — all critical properties for a fraud model that must be explainable and adaptive."
  },
  {
    "question": "A velocity check finds that a single IP address has made 20 authorization attempts in 10 minutes. The threshold is 15. What is the risk if Stripe blocks this IP without additional context?",
    "options": [
      "No risk — any IP exceeding the threshold is an attacker",
      "False positive risk: a legitimate merchant's batch payment job could be blocked",
      "The rule is redundant because the ML model would catch this anyway",
      "Blocking IPs is illegal under PCI DSS"
    ],
    "answer": 1,
    "explanation": "Velocity rules are powerful but blunt. A legitimate enterprise customer running a nightly billing batch could easily generate 200 charges from one server IP in 10 minutes. Velocity checks must account for trusted merchant IPs and batch contexts, or they will create massive false positives for high-volume B2B customers."
  },
  {
    "question": "In the Champion/Challenger model pipeline, what happens during 'shadow mode'?",
    "options": [
      "The new model replaces the old model in production on 10% of traffic",
      "The challenger model scores live transactions but its decisions are logged only — they do not affect authorization outcomes",
      "The challenger model is evaluated on historical holdout data only",
      "Both models run in production and the higher score wins"
    ],
    "answer": 1,
    "explanation": "Shadow mode lets the challenger model score real live transactions without risk — its decisions are recorded for comparison but have no effect on whether transactions are approved or blocked. After 24 hours of shadow data, the challenger's real-world performance can be compared directly against the champion's, enabling safe promotion decisions."
  },
  {
    "question": "What is the primary purpose of Stripe Radar's merchant-facing rules language?",
    "options": [
      "To allow merchants to access raw card numbers for their own fraud systems",
      "To let merchants tune fraud thresholds and rules for their specific customer base and risk tolerance",
      "To bypass Stripe's ML scoring for trusted merchants",
      "To generate compliance reports for PCI DSS audits"
    ],
    "answer": 1,
    "explanation": "Stripe's global ML model is calibrated for average risk across all merchants. But a cryptocurrency exchange and a florist have fundamentally different customer profiles. Radar lets each merchant tune their own BLOCK/REVIEW thresholds and add business-specific rules (e.g., ALLOW certain corporate email domains), optimizing for their own conversion rate and risk appetite."
  }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Fraud defense is layered: deterministic rules (~1ms) catch known patterns, ML scoring (~30ms) handles probabilistic risk, and async batch jobs discover fraud rings and retrain models.",
  "Gradient boosted trees beat deep learning for fraud: faster inference (~5ms), inherently interpretable (legally important), and handle tabular feature sets better.",
  "Velocity checks use Redis sorted sets for O(log N) sliding-window counters — ~100K checks/second across card, IP, and email dimensions.",
  "Champion/challenger model pipelines let new models run in shadow mode for 24 hours before promotion, giving real-world validation without production risk.",
  "False positives (blocking legitimate transactions) are as costly as false negatives — the system must optimize both simultaneously. Radar lets merchants tune this tradeoff for their business."
] }
\`\`\``,
    },
    {
      id: "stripe-architecture",
      slug: "stripe-architecture",
      title: "Architecture Walkthrough",
      content: `# Stripe: Complete Architecture Walkthrough

\`\`\`concept
{ "title": "Mental Model: A State Machine Wrapped in a Ledger", "variant": "mental-model", "content": "Stripe is not just an API — it is a distributed state machine (PaymentIntent transitions: CREATED → AUTHORIZED → CAPTURED → SETTLED) layered on top of an append-only double-entry ledger. Every architectural decision flows from two constraints: (1) money must never be lost or double-counted, even during partial failures, and (2) raw card data must never leave the isolated CDE boundary." }
\`\`\`

## Full System Architecture

\`\`\`sysdiag
{ "title": "Stripe System Architecture — Critical Path", "width": 760, "height": 480, "nodes": [ { "id": "cdn", "label": "DNS + CDN\\n(TLS termination)", "x": 380, "y": 40, "kind": "client" }, { "id": "gateway", "label": "API Gateway", "x": 380, "y": 120, "kind": "service" }, { "id": "payment", "label": "Payment Service", "x": 160, "y": 230, "kind": "service" }, { "id": "fraud", "label": "Fraud Engine", "x": 380, "y": 230, "kind": "service" }, { "id": "ledger", "label": "Ledger Service", "x": 590, "y": 230, "kind": "service" }, { "id": "vault", "label": "Card Vault (CDE)", "x": 100, "y": 360, "kind": "database" }, { "id": "pg", "label": "PostgreSQL Clusters", "x": 360, "y": 360, "kind": "database" }, { "id": "kafka", "label": "Kafka Event Bus", "x": 590, "y": 360, "kind": "queue" }, { "id": "networks", "label": "Card Networks\\n(Visa/MC/Amex)", "x": 100, "y": 460, "kind": "external" }, { "id": "webhook", "label": "Webhook Delivery", "x": 590, "y": 460, "kind": "service" } ], "edges": [ { "from": "cdn", "to": "gateway" }, { "from": "gateway", "to": "payment" }, { "from": "gateway", "to": "fraud" }, { "from": "gateway", "to": "ledger" }, { "from": "payment", "to": "vault" }, { "from": "payment", "to": "pg" }, { "from": "payment", "to": "kafka" }, { "from": "vault", "to": "networks", "label": "ISO 8583" }, { "from": "kafka", "to": "webhook", "label": "events" } ], "annotations": { "gateway": "Single chokepoint for auth, rate limiting, and idempotency key dedup. A request is rejected here before touching any state if the idempotency key already exists.", "vault": "Isolated Cardholder Data Environment. Raw PANs are detokenized only here, encrypted with HSM-backed keys. No other service ever sees a real card number.", "fraud": "Runs a 127-feature ML model plus a rule engine. Returns risk_score in ~23ms. Degrades gracefully to rule-only mode if the ML service is unavailable.", "kafka": "Event bus with 7-day retention, partitioned by merchant ID. Decouples the payment critical path from webhooks, analytics, and payout calculation entirely." } }
\`\`\`

The architecture groups into three horizontal layers: an **ingress layer** (CDN + API Gateway) handling auth and dedup, a **core services layer** (Payment, Fraud, Ledger) executing the financial logic, and a **storage and async layer** (Card Vault, PostgreSQL, Kafka) providing durability and fan-out.

## Data Flow: Processing a $50.00 Payment

Let's trace every hop from merchant API call to bank settlement.

\`\`\`steps
{ "title": "Processing a $50 Payment — End to End", "steps": [ { "title": "Merchant Creates PaymentIntent", "content": "The merchant POSTs to \`/v1/payment_intents\` with an \`Idempotency-Key\` header. The API Gateway runs three checks in order:\\n\\n- **Authenticate:** API key \`sk_live_xxx\` resolves to \`acct_123\`\\n- **Rate limit:** 100 req/s per merchant — passes\\n- **Idempotency:** key not found in store → new request, proceed\\n\\nThe Payment Service creates a record with \`status: CREATED\` and returns the PaymentIntent ID. From this point forward, resubmitting the same idempotency key returns the stored response rather than executing again." }, { "title": "Fraud Scoring  (23ms total)", "content": "The Payment Service calls the Fraud Engine **synchronously** — the payment cannot proceed without a risk decision.\\n\\n| Stage | Time |\\n|---|---|\\n| Rule engine: blocklist + velocity checks | 1ms |\\n| Feature computation: 127 features gathered | 18ms |\\n| ML model inference | 4ms |\\n| Decision: \`risk_score = 12\` → ALLOW (threshold: 50) | <1ms |\\n\\nIf the ML model is unavailable, the engine falls back to rule-only mode with conservative thresholds. The critical path is never blocked waiting for a degraded ML service." }, { "title": "Card Network Authorization (~620ms)", "content": "The Payment Service asks the Card Vault (CDE) to **detokenize** \`pm_card_visa\` → raw PAN. The Vault builds an ISO 8583 authorization message and forwards it to Visa:\\n\\n1. Visa routes the message to the issuing bank (e.g. Chase)\\n2. Chase checks available funds and existing holds\\n3. Chase places a $50.00 authorization hold\\n4. Chase returns: \`auth_code = \\"A88721\\"\` — approved\\n\\nThe raw card number never leaves the CDE boundary. Every other service in the stack works only with opaque tokens, keeping PCI-DSS audit scope narrow." }, { "title": "Ledger Recording (4ms)", "content": "A single atomic PostgreSQL transaction records all money movement:\\n\\n    DEBIT   customer_payable   +5000 cents\\n    CREDIT  merchant_payable   −4825 cents\\n    CREDIT  stripe_revenue     −175 cents\\n\\nDouble-entry guarantees the books always balance: every debit has a matching credit. The PaymentIntent status only transitions to \`succeeded\` **after this transaction commits** — there is no window where money moved but no ledger record exists." }, { "title": "Event Publishing", "content": "The Payment Service publishes to Kafka (topic: \`payment.events\`):\\n\\n    { type: \\"payment_intent.succeeded\\", data: { id: \\"pi_abc\\", amount: 5000 } }\\n\\nThree consumers fan out independently and cannot slow down the payment confirmation:\\n\\n- **Webhook Service** — POST to merchant endpoint, HMAC-SHA256 signed; retries at 5min → 30min → 2h → 8h → 24h\\n- **Analytics Pipeline** — feeds Spark + S3 data lake for reporting\\n- **Payout Calculator** — queues the transaction for the T+2 payout cycle" }, { "title": "Settlement and Payout (T+1 / T+2)", "content": "**T+1 day:** Visa sends a settlement file. The Reconciliation Engine matches \`tx_abc → VIS_789\`, confirms amounts, and records:\\n\\n    DEBIT   settlement_bank   +5000\\n    CREDIT  customer_payable  −5000\\n\\n**T+2 days:** The payout cycle calculates the merchant's net payout (\`$50.00 − $1.75 fee = $48.25\`) and initiates ACH:\\n\\n    DEBIT   merchant_payable  +4825\\n    CREDIT  payout_bank       −4825\\n\\nThe merchant sees the deposit in their bank account. Every entry across all six days traces back to the original PaymentIntent." } ] }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The Retry Storm That Cost $50 Million", "content": "In 2019, a major fintech company processed the same $1.2 million payment **47 times** during a network partition. Their global payment system lacked proper idempotency guarantees across regions. The fallout: $50 million in reconciliation costs, reversed transactions, and regulatory fines.\\n\\nThis is exactly why Stripe validates idempotency keys at the **API Gateway** — before any downstream state mutation — and stores keys in durable PostgreSQL rather than an in-memory cache that could lose data on restart." }
\`\`\`

## Webhook Delivery at Scale

The webhook service delivers ~50,000 events per second. The key design insight is that delivery is **decoupled from the payment critical path via Kafka** — a slow or unresponsive merchant endpoint cannot delay a payment confirmation response.

Retry state is stored in **SQS delay queues**, not in-memory, so it survives service restarts. Each delivery is signed with HMAC-SHA256 so merchants can verify authenticity. After 3 days of continuous failure, the endpoint is disabled to prevent queue backlog.

## Storage Strategy

\`\`\`tabs
{ "tabs": [ { "label": "Transactional Data", "icon": "🗄️", "content": "| Data | Store | Why |\\n|---|---|---|\\n| Payment intents | PostgreSQL (sharded by merchant) | ACID transactions, strong consistency |\\n| Ledger entries | PostgreSQL (append-only, partitioned by date) | Immutable audit trail, no updates ever |\\n| Card tokens | Encrypted PostgreSQL inside CDE | PCI compliance isolation |\\n| Idempotency keys | PostgreSQL (24h TTL) | Durable dedup — survives crashes |\\n\\nSharding by merchant ID keeps all of a single merchant's data on the same shard, making per-merchant queries fast without cross-shard joins." }, { "label": "Low-Latency / Cache", "icon": "⚡", "content": "| Data | Store | Why |\\n|---|---|---|\\n| Velocity counters | Redis Cluster | Sub-millisecond sliding window checks |\\n| Fraud feature cache | Redis + feature store | Fast ML feature lookup during scoring |\\n\\n**Failure mode:** If Redis goes down, velocity checks are skipped. The system defaults to **conservative blocking** rather than allowing unchecked traffic. Payment systems prioritize consistency over availability — it is better to reject a legitimate payment than to let fraud through." }, { "label": "Events & Analytics", "icon": "📊", "content": "| Data | Store | Why |\\n|---|---|---|\\n| Payment events | Kafka (7-day retention) | Async fan-out to webhooks, analytics, payouts |\\n| Analytics warehouse | Spark + S3 data lake | Petabyte-scale batch processing |\\n\\nKafka partitions by **merchant ID** so all events for a single merchant stay in order. Consumers (webhook, analytics, payouts) read at their own pace without coupling to the payment service's throughput." } ] }
\`\`\`

## Reliability Under Failure

| Failure | Impact | Mitigation |
|---|---|---|
| Payment Service down | New charges fail | Multiple replicas; brief queue on upstream |
| Card network timeout | Auth delayed | Circuit breaker; retry with exponential backoff |
| Ledger DB down | Cannot record transactions | Synchronous replication; automatic failover < 30s |
| Fraud Engine down | Unscored transactions | Fallback to rule-only mode (conservative thresholds) |
| Kafka down | Webhooks delayed | Disk-backed queue; replay on recovery |
| Redis down | Velocity checks skipped | Default to conservative block |

The pattern is consistent: **every dependency failure degrades to a conservative safe default** rather than failing open.

## Scaling Numbers

| Component | Scale | Strategy |
|---|---|---|
| API Gateway | 50K req/s | Horizontal, multi-region |
| Payment Service | 23K TPS | Stateless, horizontally scaled |
| Fraud Engine | 23K scores/s | In-memory models, 50 instances |
| Ledger DB | 2B writes/day | Sharded PostgreSQL, append-only |
| Card Vault | 23K tokenize/s | Isolated CDE, HSM-backed encryption |
| Kafka | 500K events/s | Partitioned by merchant ID |
| Webhook Delivery | 50K/s | Async, SQS retry queues |

\`\`\`collapse
{ "title": "Deep Dive: Why Idempotency Keys Live in PostgreSQL, Not Redis", "content": "Idempotency key lookups need sub-millisecond performance, which makes Redis the obvious choice. Stripe uses PostgreSQL instead — here's why.\\n\\nIdempotency keys are **correctness boundaries**, not performance hints. If a key is stored in Redis and the Redis node crashes before replication, the same request can arrive twice and both will appear as new. The result is a duplicate charge.\\n\\nPostgreSQL's write-ahead log and synchronous replication mean a key is only marked as stored after it has been durably committed to at least one replica. The latency cost (~2ms vs ~0.3ms) is acceptable on the idempotency check path because it only runs once per request, not per feature or per rule.\\n\\nThe unique constraint (\`INSERT ... ON CONFLICT DO NOTHING\`) makes the database itself the correctness boundary, rather than application-level compare-and-set logic that could race under concurrency." }
\`\`\`

\`\`\`quiz
{ "title": "Architecture Comprehension Check", "questions": [ { "question": "Why is the Card Vault (CDE) isolated from all other microservices rather than being a module within the Payment Service?", "options": [ "To reduce network latency by giving tokenization its own dedicated compute", "To contain PCI-DSS scope — raw PANs must never leave the CDE boundary so only the CDE requires full PCI certification", "To allow the Card Vault to scale independently from payment processing throughput", "To prevent the fraud engine from accessing card numbers for feature extraction" ], "answer": 1, "explanation": "PCI-DSS mandates that raw cardholder data be handled only within a strictly controlled Cardholder Data Environment. By isolating the vault, Stripe limits audit scope: only the CDE must undergo full PCI assessment. Every other service works with opaque tokens, which dramatically reduces compliance burden and attack surface." }, { "question": "What is the correct order of the three critical checks the API Gateway performs before routing a payment request downstream?", "options": [ "Rate limit → Authenticate → Idempotency check", "Authenticate → Rate limit → Idempotency check", "Idempotency check → Authenticate → Rate limit", "Authenticate → Idempotency check → Rate limit" ], "answer": 1, "explanation": "Authentication must come first — you cannot enforce per-merchant rate limits without knowing which merchant is making the request. Rate limiting comes second to shed load before doing more expensive work. Idempotency check comes last because it requires a database lookup; doing it before auth would allow unauthenticated callers to pollute the idempotency store." }, { "question": "A merchant's webhook endpoint returns HTTP 503 on every attempt. When does Stripe disable the endpoint?", "options": [ "After 5 consecutive failures regardless of time elapsed", "After failures spanning 3 days on the retry schedule (5min → 30min → 2h → 8h → 24h)", "After the first 24-hour retry fails, the endpoint is immediately disabled", "Stripe never disables endpoints — it retries indefinitely using SQS delay queues" ], "answer": 1, "explanation": "Stripe retries on an exponential schedule capped at 24-hour intervals. If delivery fails continuously for 3 days total, the endpoint is disabled to prevent indefinite queue backlog. Retry state is stored in SQS delay queues (not in-memory), so it survives Webhook Service restarts." }, { "question": "Why is the ledger write in Step 4 kept synchronous rather than published async to Kafka?", "options": [ "Kafka cannot guarantee exactly-once delivery for financial data", "The PaymentIntent must only reach 'succeeded' after the ledger commits — async would create a window where money moved but no accounting record exists", "PostgreSQL ledger writes are faster than Kafka for payloads under 1KB", "Async ledger writes would require 2-phase commit across the Payment Service and Ledger Service" ], "answer": 1, "explanation": "Financial correctness requires that money movement and record-keeping are atomic. If the ledger write were async and the service crashed after publishing the Kafka event but before the ledger wrote, you would have a 'succeeded' payment with no accounting entry — an unreconcilable gap that violates double-entry invariants." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The API Gateway is the single chokepoint for auth, rate limiting, and idempotency dedup — duplicate charges are rejected here before any downstream state mutation", "Fraud scoring is synchronous (~23ms) and degrades gracefully to rule-only mode; the ML model failure path is as important as the happy path", "The Card Vault (CDE) isolates raw PAN data so every other service works with opaque tokens — this keeps PCI-DSS audit scope narrow and auditable", "The ledger write is synchronous and atomic; a PaymentIntent only reaches 'succeeded' after both network auth and double-entry ledger commit succeed", "Kafka decouples the payment critical path from webhooks, analytics, and payouts — a slow merchant endpoint cannot block a payment confirmation", "Every auxiliary failure (Redis, Fraud Engine, Kafka) degrades to a conservative default: prefer blocking over allowing unchecked or unrecorded transactions" ] }
\`\`\``,
    },
  ],
};
