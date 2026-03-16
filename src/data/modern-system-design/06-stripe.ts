import { Module } from "../types";

export const stripeModule: Module = {
  id: "design-stripe",
  title: "Design Stripe",
  description:
    "Design a payment processing platform: PCI compliance, idempotency guarantees, double-entry ledgers, and fraud detection at global scale.",
  lessons: [
    {
      id: "stripe-requirements",
      slug: "stripe-requirements",
      title: "Requirements & Compliance",
      content: `# Design Stripe: Requirements & Compliance

## Functional Requirements

Design a global payment processing platform like Stripe. Core features:

1. **Accept payments** — Process credit cards, debit cards, bank transfers, digital wallets
2. **Payment lifecycle** — Authorize, capture, void, refund
3. **Multi-currency** — Support 135+ currencies with real-time exchange rates
4. **Subscriptions** — Recurring billing with proration, trials, upgrades/downgrades
5. **Payouts** — Transfer funds to merchants' bank accounts
6. **Fraud detection** — Real-time risk scoring on every transaction
7. **Dispute management** — Handle chargebacks and evidence submission
8. **Reporting** — Financial dashboards, reconciliation, tax reporting

## Non-Functional Requirements

- **Availability**: 99.999% — every minute of downtime costs merchants real revenue
- **Latency**: Payment authorization < 2 seconds end-to-end
- **Consistency**: Every cent must be accounted for — zero tolerance for lost or duplicated money
- **Durability**: Financial records must survive any failure — replicated across regions
- **Compliance**: PCI DSS Level 1, SOC 2, GDPR, PSD2 (Europe), state money transmitter licenses

## Scale Estimation

\`\`\`
Merchants:              Millions of businesses
Transactions per day:   ~500 million
Transactions per second (avg): 500M / 86,400 ≈ 5,787 TPS
Peak TPS:               5,787 × 4 ≈ 23,000 TPS (Black Friday)
Total payment volume:   ~$1 trillion/year
Average transaction:    ~$55
\`\`\`

### Storage

\`\`\`
Transaction records/day:  500M × 2 KB = 1 TB/day
Ledger entries/day:       500M × 4 entries × 500 bytes = 1 TB/day
Annual storage:           ~730 TB/year (before replication)
Card vault (tokenized):   Billions of stored cards, heavily encrypted
\`\`\`

## PCI DSS Compliance

PCI DSS (Payment Card Industry Data Security Standard) Level 1 applies to any entity processing >6 million card transactions per year. It dictates how cardholder data is stored, processed, and transmitted.

### Core PCI Requirements

| Requirement | What It Means |
|-------------|--------------|
| **Encryption in transit** | TLS 1.2+ for all card data in flight |
| **Encryption at rest** | AES-256 for stored card numbers |
| **Tokenization** | Replace real card numbers with non-reversible tokens |
| **Network segmentation** | Card data environment (CDE) isolated from other systems |
| **Access controls** | Least privilege; MFA for all CDE access |
| **Audit logging** | Every access to cardholder data logged and retained 1 year |
| **Annual audit** | Qualified Security Assessor (QSA) performs on-site audit |

### Tokenization Architecture

\`\`\`
Merchant sends:  card_number = "4242424242424242"
                        │
                        ▼
              ┌──────────────────┐
              │   Tokenization   │
              │   Service (CDE)  │
              │                  │
              │ 1. Encrypt card  │
              │ 2. Store in vault│
              │ 3. Return token  │
              └────────┬─────────┘
                       │
                       ▼
              token = "tok_1MqX8Y2eZvKYlo2C"

Everything outside the CDE only sees tokens.
The token cannot be reversed to a card number.
Only the vault (inside CDE) can detokenize for processing.
\`\`\`

## Payment Types

| Type | Flow | Settlement |
|------|------|-----------|
| **Card payment** | Authorize → Capture → Settle | 1-2 business days |
| **ACH transfer** | Initiate → Process → Settle | 3-5 business days |
| **Wire transfer** | Initiate → Confirm | Same day or next day |
| **Digital wallet** | Tokenized card via Apple Pay/Google Pay | 1-2 business days |
| **Buy Now Pay Later** | Partner authorization → installment plan | Varies |

## Regulatory Landscape

\`\`\`
Region          Key Regulations
United States   State money transmitter licenses (50 states)
Europe          PSD2 (Strong Customer Authentication), GDPR
India           RBI data localization (card data stored in India)
Brazil          Central Bank PIX instant payment mandate
Global          OFAC sanctions screening on every transaction
\`\`\`

## Key Challenges

| Challenge | Why It's Hard |
|-----------|--------------|
| **Exactly-once processing** | Network failures can cause duplicate charges |
| **Double-entry accounting** | Every cent tracked across millions of accounts |
| **Sub-2s authorization** | Multiple network hops: merchant → Stripe → card network → issuing bank |
| **Fraud at scale** | Score 23K TPS in real-time with <100ms latency |
| **Multi-region consistency** | Financial data must be strongly consistent |

## High-Level Components

\`\`\`
┌──────────┐     ┌──────────┐     ┌───────────────┐
│ Merchant │────▶│ API      │────▶│ Payment       │
│ App      │◀────│ Gateway  │     │ Service       │
│          │     └──────────┘     └───────┬───────┘
└──────────┘                              │
                              ┌───────────┼───────────┐
                              ▼           ▼           ▼
                        ┌──────────┐ ┌──────────┐ ┌──────────┐
                        │ Card     │ │ Fraud    │ │ Ledger   │
                        │ Vault    │ │ Engine   │ │ Service  │
                        │ (CDE)   │ │          │ │          │
                        └──────────┘ └──────────┘ └──────────┘
\`\`\`

We will dive into each subsystem: payment flow, idempotency, ledger design, fraud detection, and full architecture.`,
    },
    {
      id: "stripe-payment-flow",
      slug: "stripe-payment-flow",
      title: "Payment Processing Flow",
      content: `# Stripe: Payment Processing Flow

## The Payment Intent Lifecycle

Stripe introduced the PaymentIntent object to model the full lifecycle of a payment. It is a state machine that tracks a payment from creation through confirmation to settlement.

\`\`\`
PaymentIntent States:

  requires_payment_method
          │
          ▼
  requires_confirmation
          │
          ▼
  requires_action ←──── (3D Secure challenge)
          │
          ▼
     processing
          │
    ┌─────┴─────┐
    ▼           ▼
succeeded     failed
    │
    ▼
  captured ────▶ refunded (partial or full)
\`\`\`

## Authorization vs Capture

A payment has two distinct phases:

### Authorization

The issuing bank places a **hold** on the cardholder's funds. No money moves yet.

\`\`\`
Merchant ──▶ Stripe API ──▶ Card Network ──▶ Issuing Bank
                                                  │
                                            Check: sufficient funds?
                                            Check: card not blocked?
                                            Check: velocity limits?
                                                  │
                                            Place hold: $48.23
                                                  │
                                            Return: auth_code = "A12345"
                                                  │
Merchant ◀── Stripe API ◀── Card Network ◀───────┘

Authorization hold expires in 7 days (varies by card network).
\`\`\`

### Capture

The merchant confirms the charge. Money actually moves from cardholder to merchant.

\`\`\`
Two models:

1. Automatic capture (default):
   Authorization + Capture happen together.
   Merchant calls: POST /v1/payment_intents (capture_method: "automatic")
   → Funds captured immediately on authorization success.

2. Manual capture (e-commerce, hotels):
   Authorize now, capture later.
   POST /v1/payment_intents (capture_method: "manual")
   → Hold placed. Merchant captures when they ship the item.
   POST /v1/payment_intents/{id}/capture
   → Hold converted to actual charge.

Why manual capture?
  - E-commerce: authorize at checkout, capture at shipment
  - Hotels: authorize at check-in, capture at checkout (amount may differ)
  - Rental cars: authorize deposit, capture actual charges
\`\`\`

## The Authorization Flow in Detail

\`\`\`
Step-by-step (latency budget: <2 seconds total):

┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Merchant │  │ Stripe   │  │ Fraud    │  │ Card     │  │ Issuing  │
│          │  │ API GW   │  │ Engine   │  │ Network  │  │ Bank     │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │              │             │              │             │
     │─── POST ────▶│             │              │             │
     │  /payment    │             │              │             │
     │  _intents    │── score ───▶│              │             │
     │              │  request    │              │             │
     │              │◀── risk ────│              │             │
     │              │  score: 12  │              │             │
     │              │  (low risk) │              │             │
     │              │             │              │             │
     │              │──── auth request ─────────▶│             │
     │              │             │              │── auth ────▶│
     │              │             │              │  request    │
     │              │             │              │◀─ approved ─│
     │              │◀─── auth approved ────────│             │
     │              │             │              │             │
     │◀── 200 OK ──│             │              │             │
     │  status:     │             │              │             │
     │  succeeded   │             │              │             │

Total latency: ~800ms
  Stripe processing:  ~100ms
  Fraud scoring:      ~50ms
  Network + bank:     ~650ms (external, variable)
\`\`\`

## 3D Secure (Strong Customer Authentication)

3D Secure (3DS) adds an extra authentication step required by PSD2 in Europe and increasingly adopted globally. The cardholder must verify their identity with the issuing bank.

\`\`\`
Without 3DS:
  Merchant ──▶ Stripe ──▶ Card Network ──▶ Bank ──▶ Approved

With 3DS:
  Merchant ──▶ Stripe ──▶ Card Network ──▶ Bank
                                              │
                                     "Requires authentication"
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │ Bank's 3DS page │
                                     │ (SMS code, app  │
                                     │  biometric, etc)│
                                     └────────┬────────┘
                                              │
                                     Cardholder verifies
                                              │
  Merchant ◀── Stripe ◀── Card Network ◀── Bank ──▶ Approved

Impact: +3-5 seconds latency, +5-15% drop-off rate
Benefit: Liability shift — fraud chargebacks become bank's problem
\`\`\`

### Stripe's Adaptive 3DS

Not all transactions require 3DS. Stripe uses ML to decide when to trigger it:

\`\`\`
Low risk ($12 coffee, returning customer, same device):
  → Skip 3DS, authorize directly

Medium risk ($200 electronics, new card):
  → Frictionless 3DS (bank verifies silently, no user action)

High risk ($2,000 luxury item, new account, foreign IP):
  → Challenge 3DS (SMS code or biometric required)

Result: 95% of legitimate transactions avoid the challenge flow,
while fraud is caught on high-risk transactions.
\`\`\`

## Refunds

\`\`\`
Refund types:
  Full refund:    Return entire charge amount
  Partial refund: Return portion (e.g., one item in an order)

Refund flow:
  POST /v1/refunds { payment_intent: "pi_xxx", amount: 2500 }
         │
         ▼
  ┌──────────────┐
  │ Refund       │
  │ Service      │
  │ 1. Validate  │ ← Is amount <= captured amount - previous refunds?
  │ 2. Ledger    │ ← Create reversal entries
  │ 3. Network   │ ← Submit refund to card network
  └──────┬───────┘
         │
  Card network processes refund (3-10 business days)
  Cardholder sees credit on statement
\`\`\`

## Settlement

Settlement is the actual movement of money from the card network to Stripe to the merchant's bank account.

\`\`\`
Day 0: Authorization + Capture
Day 1: Card network batches the day's transactions
Day 2: Funds arrive at Stripe's settlement account
Day 2: Stripe calculates merchant payout:
        Captured amount:     $48.23
        Stripe fee (2.9%+30c): -$1.70
        Net to merchant:     $46.53
Day 2: Payout initiated to merchant's bank via ACH
Day 3-4: Merchant receives funds
\`\`\`

## Scale Considerations

\`\`\`
Authorization requests:   23,000 TPS (peak)
Card network round-trip:  200-800ms (varies by issuer country)
Refund processing:        ~2% of transactions = ~460 TPS
Settlement batches:       Processed daily, ~500M records
PaymentIntent records:    500M/day, retained 7+ years (compliance)
\`\`\``,
    },
    {
      id: "stripe-idempotency",
      slug: "stripe-idempotency",
      title: "Idempotency & Exactly-Once",
      content: `# Stripe: Idempotency & Exactly-Once Processing

## The Problem: Duplicate Charges

Network failures are inevitable. When a payment request fails mid-flight, the client does not know if it succeeded or not:

\`\`\`
Scenario: Network timeout

Merchant ──── POST /v1/charges ────▶ Stripe API
                                          │
                                    Process payment ✓
                                    Charge created!
                                          │
Merchant ◀────── TIMEOUT ──────────── Response lost in transit

Merchant thinks: "Did it work? I'll retry..."
Merchant ──── POST /v1/charges ────▶ Stripe API
                                          │
                                    Process payment again?
                                    DOUBLE CHARGE! ✗
\`\`\`

This is catastrophic in payments. A customer charged twice will dispute, chargeback, and leave. At 500M transactions/day, even a 0.01% duplicate rate means 50,000 double charges daily.

## Idempotency Keys

Stripe's solution: every mutating API call accepts an **Idempotency-Key** header. If the same key is sent twice, the second request returns the first request's response without re-executing.

\`\`\`
Request 1:
  POST /v1/payment_intents
  Idempotency-Key: "order_12345_payment_v1"
  → Creates PaymentIntent pi_abc, returns 200

Request 2 (retry):
  POST /v1/payment_intents
  Idempotency-Key: "order_12345_payment_v1"
  → Recognizes key, returns cached response (pi_abc), 200
  → No new PaymentIntent created

The key is typically: order_id + action + version
\`\`\`

## How Idempotency Works Internally

\`\`\`
┌──────────┐    ┌────────────────────────────────────────┐
│ Request  │───▶│  Idempotency Layer                     │
│ with key │    │                                        │
│          │    │  1. Hash the key                        │
│          │    │  2. Check idempotency store:            │
│          │    │     ┌─────────────────────────────────┐ │
│          │    │     │ Key exists?                     │ │
│          │    │     │                                 │ │
│          │    │     │ YES + completed:                │ │
│          │    │     │   → Return stored response      │ │
│          │    │     │                                 │ │
│          │    │     │ YES + in_progress:              │ │
│          │    │     │   → Return 409 Conflict         │ │
│          │    │     │   → (concurrent duplicate)      │ │
│          │    │     │                                 │ │
│          │    │     │ NO:                             │ │
│          │    │     │   → Insert key (status: started)│ │
│          │    │     │   → Process request             │ │
│          │    │     │   → Store response              │ │
│          │    │     │   → Update status: completed    │ │
│          │    │     └─────────────────────────────────┘ │
│          │    └────────────────────────────────────────┘
└──────────┘
\`\`\`

## Idempotency Store Design

\`\`\`
Table: idempotency_keys

┌──────────────────┬────────────┬──────────────────┬───────────┐
│ idempotency_key  │ status     │ response_body    │ expires_at│
│ (hash, PK)       │            │ (JSON)           │           │
├──────────────────┼────────────┼──────────────────┼───────────┤
│ sha256("order_1")│ completed  │ {"id":"pi_abc"}  │ +24 hours │
│ sha256("order_2")│ started    │ NULL             │ +24 hours │
│ sha256("order_3")│ completed  │ {"id":"pi_def"}  │ +24 hours │
└──────────────────┴────────────┴──────────────────┴───────────┘

Key properties:
  - TTL: 24 hours (keys expire after that)
  - Storage: PostgreSQL with unique constraint on key hash
  - The INSERT uses INSERT ... ON CONFLICT to atomically check + create
\`\`\`

## At-Most-Once vs Exactly-Once vs At-Least-Once

\`\`\`
At-most-once:
  Send request, never retry.
  Risk: Payment silently lost.
  ✗ Unacceptable for payments.

At-least-once:
  Retry on failure.
  Risk: Duplicate charges without idempotency.
  ✗ Dangerous without safeguards.

Exactly-once (what Stripe achieves):
  Retry on failure + idempotency key.
  Guarantee: Payment processed exactly once.
  ✓ The only acceptable model for payments.

  Technically: "at-least-once delivery" +
               "idempotent processing" =
               "effectively exactly-once"
\`\`\`

## Implementing Safe Retries

\`\`\`
Merchant retry strategy:

  function chargeWithRetry(amount, idempotencyKey) {
    for (attempt = 1; attempt <= 3; attempt++) {
      try {
        response = stripe.paymentIntents.create(
          { amount, currency: 'usd' },
          { idempotencyKey }
        );
        return response;  // Success
      } catch (error) {
        if (error.statusCode === 409) {
          // Concurrent request with same key — wait and retry
          sleep(1000);
          continue;
        }
        if (error.statusCode >= 500) {
          // Server error — safe to retry with same key
          sleep(exponentialBackoff(attempt));
          continue;
        }
        if (error.statusCode === 400) {
          // Client error — do NOT retry (bad input)
          throw error;
        }
      }
    }
    throw new Error("Payment failed after 3 attempts");
  }

Key insight: The idempotency key makes retries SAFE.
Without it, retrying a 500 could double-charge.
With it, retrying a 500 is guaranteed to be harmless.
\`\`\`

## Database-Level Idempotency

Beyond API-level idempotency, critical operations use database constraints:

\`\`\`
Problem: Two workers process the same Kafka event

Worker 1: INSERT INTO ledger_entries (tx_id, amount, ...) VALUES ('tx_123', 4823, ...)
Worker 2: INSERT INTO ledger_entries (tx_id, amount, ...) VALUES ('tx_123', 4823, ...)

Solution: Unique constraint on (tx_id, entry_type)

Worker 1: INSERT → Success
Worker 2: INSERT → UNIQUE VIOLATION → Silently skip (already processed)
\`\`\`

## Idempotency in Event Processing

For asynchronous event-driven flows (Kafka consumers), idempotency requires tracking processed event IDs:

\`\`\`
┌────────────┐    ┌──────────────────────────────────┐
│ Kafka      │───▶│ Consumer                         │
│ event:     │    │                                  │
│ payment.   │    │ 1. Read event_id from message    │
│ captured   │    │ 2. Check: processed_events table │
│            │    │    ├── Found? → Skip (already     │
│            │    │    │   processed)                 │
│            │    │ 3. Process event                  │
│            │    │ 4. In same DB transaction:        │
│            │    │    ├── Write business result      │
│            │    │    └── INSERT into processed_     │
│            │    │        events (event_id)          │
│            │    │ 5. Commit transaction             │
│            │    └──────────────────────────────────┘

The transactional outbox pattern: business write + dedup marker
in the same ACID transaction = exactly-once processing.
\`\`\`

## Scale Numbers

\`\`\`
Idempotency key lookups:   ~23,000/s (one per API mutation)
Key store size:            ~500M keys retained (24h window)
Key store:                 PostgreSQL with hash index
Lookup latency:            < 2ms
False positive rate:       0% (exact hash match)
Key collision probability: ~0 (SHA-256 on unique merchant input)
\`\`\`

## Trade-offs

| Decision | Choice | Alternative | Why |
|----------|--------|-------------|-----|
| Key storage | PostgreSQL | Redis | Durability matters — lost keys = potential duplicates |
| Key TTL | 24 hours | Forever | Balance storage cost vs. retry window |
| Hash function | SHA-256 | Raw key | Fixed-size index, no key length limits |
| Conflict handling | 409 + retry | Queue and serialize | Lower latency for the common case |`,
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

## The Fraud Problem

Payment fraud costs the global economy over $30 billion annually. A payment platform must block fraudulent transactions in real-time without adding latency or blocking legitimate customers.

The challenge: at 23,000 TPS peak, the fraud engine has <100ms to score each transaction. A false negative (missed fraud) costs chargebacks and merchant trust. A false positive (blocked legitimate transaction) costs revenue and customer frustration.

\`\`\`
Fraud detection goals:
  - Block >95% of fraudulent transactions
  - False positive rate < 0.5% (block < 1 in 200 legitimate transactions)
  - Scoring latency < 100ms (within the 2-second auth budget)
  - Adapt to new fraud patterns within hours, not weeks
\`\`\`

## Multi-Layer Defense

\`\`\`
┌──────────────────────────────────────────────────┐
│               Fraud Defense Layers                │
│                                                  │
│  Layer 1: Deterministic Rules     (~1ms)         │
│  ├── Blocklists (known bad cards, IPs, emails)   │
│  ├── Velocity checks (>5 attempts in 1 minute)   │
│  └── Sanity checks (amount > $50K, test cards)   │
│                                                  │
│  Layer 2: ML Risk Scoring         (~30ms)        │
│  ├── Gradient boosted model (100+ features)      │
│  ├── Output: risk score 0-100                    │
│  └── Threshold: score > 75 → block or challenge  │
│                                                  │
│  Layer 3: 3D Secure Challenge     (~5-30s)       │
│  ├── Triggered for medium-high risk (50-75)      │
│  └── Shifts fraud liability to issuing bank      │
│                                                  │
│  Layer 4: Post-Auth Review        (async)        │
│  ├── Human review queue for edge cases           │
│  └── Merchant-configured rules (Radar Rules)     │
│                                                  │
│  Layer 5: Dispute/Chargeback      (days)         │
│  ├── Evidence submission automation              │
│  └── Pattern learning from dispute outcomes      │
└──────────────────────────────────────────────────┘
\`\`\`

## Rule Engine (Layer 1)

The rule engine evaluates deterministic rules with zero ambiguity:

\`\`\`
Rule examples:

BLOCK IF card.country != ip.country
  AND amount > 500
  AND account.age < 7 days

BLOCK IF card.number IN blocklist

BLOCK IF same_card.attempts_1min > 5

BLOCK IF billing.zip != avs.zip
  AND card.type = "prepaid"

REVIEW IF amount > 10000

Rule execution:
  - Rules stored in memory (hash maps, bloom filters)
  - Evaluated in parallel
  - Short-circuit on first BLOCK
  - Execution time: < 1ms for all rules
  - ~500 active rules across the platform
\`\`\`

## ML Risk Scoring (Layer 2)

The ML model is the core of fraud detection. It scores every transaction on a 0-100 risk scale.

\`\`\`
Feature categories (100+ features):

Card features:
  - Card BIN (first 6 digits → issuer, country, type)
  - Card age, previous usage on Stripe
  - Number of merchants this card has been used at

Transaction features:
  - Amount, currency, merchant category code
  - Time of day, day of week
  - Is amount round number? (fraud signal)

Behavioral features:
  - Time since last transaction on this card
  - Geographic distance from last transaction
  - Device fingerprint match
  - Typing speed on payment form

Network features:
  - Email domain reputation
  - IP reputation score
  - IP-to-card-country distance
  - Shared device/IP across multiple cards

Historical features:
  - Chargeback rate for this BIN
  - Fraud rate for this merchant category
  - Fraud rate for this IP subnet
\`\`\`

### Model Architecture

\`\`\`
Model: Gradient Boosted Decision Trees (XGBoost/LightGBM)

Why not deep learning?
  - Tabular data → trees outperform neural nets
  - Interpretable — can explain why a transaction was blocked
  - Fast inference: < 5ms per prediction
  - Easy to add new features without architecture changes

Training:
  - Dataset: Billions of labeled transactions
  - Labels: fraudulent (chargeback/dispute) vs. legitimate
  - Retrained daily with latest fraud patterns
  - Champion/challenger: new model runs in shadow mode for 24h
    before replacing production model

Serving:
  - Model loaded in-memory on scoring service instances
  - ~50 instances, each handling ~500 scores/s
  - Feature computation: ~20ms (feature store lookup)
  - Model inference: ~5ms
  - Total scoring latency: ~30ms
\`\`\`

## Velocity Checks

Velocity checks detect rapid-fire fraud attempts (card testing, credential stuffing):

\`\`\`
Sliding window counters (Redis):

Key: velocity:{card_hash}:1min
  Value: 7 (attempts in last 60 seconds)
  Threshold: > 5 → BLOCK

Key: velocity:{ip}:10min
  Value: 23 (attempts from this IP)
  Threshold: > 15 → BLOCK

Key: velocity:{email}:1hour
  Value: 4 (cards tried with this email)
  Threshold: > 3 → BLOCK (card testing)

Key: velocity:{merchant}:{card_hash}:24h
  Value: 2
  Threshold: > 3 → REVIEW

Implementation:
  - Redis sorted sets with timestamp scores
  - ZRANGEBYSCORE to count events in window
  - ZREMRANGEBYSCORE to expire old events
  - ~100K velocity checks/second across all dimensions
\`\`\`

## Real-Time vs Batch Processing

\`\`\`
Real-time (synchronous, during auth):
  ├── Rule engine evaluation          < 1ms
  ├── Velocity checks (Redis)         < 2ms
  ├── Feature computation             < 20ms
  ├── ML model scoring                < 5ms
  ├── Decision (block/allow/review)   < 1ms
  └── Total: < 30ms

Batch (asynchronous, post-auth):
  ├── Network graph analysis
  │   → Find fraud rings (shared addresses, devices, IPs)
  │   → Runs every hour on Spark
  │
  ├── Model retraining
  │   → Daily, incorporates new chargebacks
  │
  ├── Blocklist updates
  │   → New bad cards/IPs propagated every 5 minutes
  │
  └── Merchant risk scoring
      → Weekly aggregation of fraud rates per merchant
\`\`\`

## Stripe Radar (Merchant-Facing)

Stripe Radar exposes fraud tools to merchants so they can customize rules for their business:

\`\`\`
Merchant-defined rules (Radar Rules):

  BLOCK IF :risk_score: > 80
  REVIEW IF :risk_score: > 50 AND :is_new_customer:
  ALLOW IF :customer_email: ENDS_WITH "@trusted-corp.com"
  BLOCK IF :card_country: NOT IN ("US", "CA", "GB")

Merchants see:
  ├── Risk score for every payment
  ├── Risk factors (why it was flagged)
  ├── Fraud analytics dashboard
  └── Chargeback early warning alerts
\`\`\`

## Scale Numbers

\`\`\`
Transactions scored:    23,000/s (peak)
Scoring latency:        < 30ms (p95)
ML model features:      100+ per transaction
Model size in memory:   ~200 MB
Rule engine rules:      ~500 platform-wide + per-merchant
Velocity check keys:    ~50M active keys in Redis
Fraud blocked:          >$10B annually
False positive rate:    < 0.5%
Model retraining:       Daily (automated pipeline)
\`\`\``,
    },
    {
      id: "stripe-architecture",
      slug: "stripe-architecture",
      title: "Architecture Walkthrough",
      content: `# Stripe: Complete Architecture Walkthrough

## Full System Architecture

\`\`\`
                        ┌─────────────────────────┐
                        │    DNS + CloudFront      │
                        │    (TLS termination)     │
                        └────────────┬────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │     API Gateway         │
                        │  - Authentication       │
                        │  - Rate limiting         │
                        │  - Idempotency layer    │
                        │  - Request routing       │
                        └────────────┬────────────┘
                                     │
         ┌──────────────────────────┼─────────────────────────┐
         │               │          │          │               │
 ┌───────▼──────┐ ┌──────▼───┐ ┌───▼────┐ ┌───▼─────┐ ┌──────▼──────┐
 │ Payment      │ │ Fraud    │ │ Ledger │ │ Payout  │ │ Subscription│
 │ Service      │ │ Engine   │ │ Service│ │ Service │ │ Engine      │
 │ - intents    │ │ - rules  │ │ - write│ │ - batch │ │ - billing   │
 │ - auth/cap   │ │ - ML     │ │ - read │ │ - ACH   │ │ - invoices  │
 │ - refund     │ │ - radar  │ │ - recon│ │ - wire  │ │ - proration │
 └──────┬───────┘ └────┬─────┘ └───┬────┘ └───┬────┘ └──────┬──────┘
        │              │           │           │             │
        └──────────────┴───────┬───┴───────────┴─────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │ Card Vault   │ │ PostgreSQL   │ │ Kafka        │
      │ (CDE)        │ │ Clusters     │ │ Event Bus    │
      │ - tokenize   │ │ - ledger     │ │ - payment    │
      │ - detokenize │ │ - payments   │ │   events     │
      │ - HSM keys   │ │ - accounts   │ │ - webhook    │
      └──────────────┘ └──────────────┘ │   dispatch   │
                                        └──────┬───────┘
                                               │
              ┌────────────────┬───────────────┤
              ▼                ▼               ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │ Webhook      │ │ Analytics    │ │ Recon        │
      │ Delivery     │ │ Pipeline     │ │ Engine       │
      │ Service      │ │ (Spark)      │ │ (daily)      │
      └──────────────┘ └──────────────┘ └──────────────┘

      ┌──────────────────────────────────────────────┐
      │           Card Network Connections           │
      │  ┌────────┐ ┌────────┐ ┌──────┐ ┌─────────┐ │
      │  │ Visa   │ │Master- │ │ Amex │ │Discover │ │
      │  │        │ │ card   │ │      │ │         │ │
      │  └────────┘ └────────┘ └──────┘ └─────────┘ │
      └──────────────────────────────────────────────┘
\`\`\`

## Data Flow: Processing a Payment

Let's trace a $50.00 card payment from merchant API call to settlement.

### Step 1: Merchant Creates PaymentIntent

\`\`\`
Merchant server:
  POST /v1/payment_intents
  Idempotency-Key: "order_789_payment"
  {
    amount: 5000,
    currency: "usd",
    payment_method: "pm_card_visa",
    confirm: true
  }

API Gateway:
  ├── Authenticate: API key sk_live_xxx → Merchant acct_123
  ├── Rate limit: 100 req/s per merchant (under limit)
  ├── Idempotency: key not found → proceed (new request)
  └── Route to Payment Service
\`\`\`

### Step 2: Fraud Scoring

\`\`\`
Payment Service → Fraud Engine:
  ├── Rule engine: no blocklist hits, velocity OK     (1ms)
  ├── Feature computation: 127 features gathered      (18ms)
  ├── ML model: risk_score = 12 (low risk)            (4ms)
  ├── Decision: ALLOW (score < 50 threshold)          (< 1ms)
  └── Total fraud check: 23ms
\`\`\`

### Step 3: Card Network Authorization

\`\`\`
Payment Service → Card Vault (CDE):
  ├── Detokenize: pm_card_visa → 4242...4242
  ├── Build ISO 8583 authorization message
  └── Forward to card network

Card Vault → Visa Network:
  ├── Route to issuing bank (Chase)
  ├── Chase checks: funds available, not blocked
  ├── Chase places $50.00 hold
  └── Returns: auth_code = "A88721", approved

Total network latency: ~620ms
\`\`\`

### Step 4: Ledger Recording

\`\`\`
Payment Service → Ledger Service:
  ├── Create ledger entries (in single transaction):
  │   DEBIT   customer_payable   +5000 (cents)
  │   CREDIT  merchant_payable   -4825
  │   CREDIT  stripe_revenue     -175
  ├── PaymentIntent status → succeeded
  └── Commit

Ledger write latency: ~4ms
\`\`\`

### Step 5: Event Publishing

\`\`\`
Payment Service → Kafka:
  Topic: payment.events
  Event: {
    type: "payment_intent.succeeded",
    data: { id: "pi_abc", amount: 5000, ... }
  }

Consumers:
  ├── Webhook Service: deliver to merchant's webhook URL
  │   POST https://merchant.com/webhooks/stripe
  │   (with retry: 3 attempts, exponential backoff)
  │
  ├── Analytics Pipeline: record for reporting
  │
  └── Payout Calculator: queue for next payout cycle
\`\`\`

### Step 6: Settlement and Payout

\`\`\`
T+1 day: Visa settlement file arrives
  ├── Reconciliation Engine matches: tx_abc → Visa ref VIS_789
  ├── Confirm: amounts match ($50.00)
  ├── Ledger entries:
  │   DEBIT   settlement_bank   +5000
  │   CREDIT  customer_payable  -5000

T+2 days: Merchant payout cycle
  ├── Calculate payout: sum of settled transactions - fees
  │   This payout: $48.25
  ├── Initiate ACH transfer to merchant's bank
  ├── Ledger entries:
  │   DEBIT   merchant_payable  +4825
  │   CREDIT  payout_bank       -4825
  └── Merchant sees deposit in their bank account
\`\`\`

## Webhook Delivery System

\`\`\`
Webhook Service (critical for merchant integrations):

  ┌─────────────┐    ┌──────────────────────┐
  │ Kafka event │───▶│ Webhook Dispatcher   │
  └─────────────┘    │                      │
                     │ For each merchant    │
                     │ webhook endpoint:    │
                     │                      │
                     │ 1. Sign payload      │
                     │    (HMAC-SHA256)     │
                     │ 2. POST to merchant  │
                     │ 3. If 2xx → done     │
                     │ 4. If fail → retry:  │
                     │    5min, 30min, 2h,  │
                     │    8h, 24h           │
                     │ 5. After 3 days of   │
                     │    failure → disable │
                     └──────────────────────┘

Scale: ~50K webhook deliveries/second
Retry storage: SQS delay queues
\`\`\`

## Key Databases

| Data | Store | Why |
|------|-------|-----|
| Payment intents | PostgreSQL (sharded by merchant) | ACID, strong consistency |
| Ledger entries | PostgreSQL (append-only, partitioned by date) | Immutable audit trail |
| Card tokens | Encrypted PostgreSQL in CDE | PCI compliance isolation |
| Idempotency keys | PostgreSQL (TTL: 24h) | Durability for dedup |
| Velocity counters | Redis Cluster | Sub-ms sliding window checks |
| Fraud features | Redis + feature store | Fast feature lookup for ML |
| Events | Kafka (7-day retention) | Async event distribution |
| Analytics | Spark + S3 data lake | Petabyte-scale batch analytics |

## Reliability

| Failure | Impact | Mitigation |
|---------|--------|------------|
| Payment Service down | New charges fail | Multiple replicas; queue requests |
| Card network timeout | Auth delayed | Circuit breaker; retry with backoff |
| Ledger DB down | Cannot record transactions | Synchronous replication; failover < 30s |
| Fraud Engine down | Unscored transactions | Fallback to rule-only mode (conservative) |
| Kafka down | Webhooks delayed | Disk-backed queue; replay on recovery |
| Redis down | Velocity checks skip | Default to conservative (block if unsure) |

## Scaling Summary

| Component | Scale | Strategy |
|-----------|-------|----------|
| API Gateway | 50K req/s | Horizontal, multi-region |
| Payment Service | 23K TPS | Stateless, horizontally scaled |
| Fraud Engine | 23K scores/s | In-memory models, 50 instances |
| Ledger DB | 2B writes/day | Sharded PostgreSQL, append-only |
| Card Vault | 23K tokenize/s | Isolated CDE, HSM-backed encryption |
| Kafka | 500K events/s | Partitioned by merchant ID |
| Webhook Delivery | 50K/s | Async, SQS retry queues |`,
    },
  ],
};
