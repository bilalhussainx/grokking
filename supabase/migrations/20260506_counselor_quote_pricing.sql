-- ──────────────────────────────────────────────────────────────────────
-- Counselor marketplace — per-request quote pricing (Phase 2 follow-up)
--
-- The Phase 1 schema modeled services as fixed-price line items: students
-- click "Book", pay the listed amount, done. That's right for "single
-- essay review @ $150" but breaks for the messier work counselors
-- actually quote per request — full-application audits, multi-school
-- supplement packages, custom interview prep — where the price depends
-- on scope (number of essays, schools, deadlines).
--
-- This migration adds:
--   - Per-service pricing_model: 'fixed' (current behavior) | 'quote'
--   - Per-service price RANGE (min/max) used as guardrails on the quote
--   - Per-engagement request_message (what the student is asking for)
--   - Per-engagement quoted_price + quote_message + quoted_at (counselor's
--     response to the request)
--   - Three new engagement statuses: quote_requested → quoted →
--     quote_declined (or → paid_pending_start if accepted)
--
-- Existing fixed-price services + engagements are unaffected. The
-- Stripe-Checkout webhook branch from Phase 2 still fires on
-- `paid_pending_start` regardless of which path got us there.
-- ──────────────────────────────────────────────────────────────────────

-- ─── 1. Pricing model + range on services ─────────────────────────────
ALTER TABLE cc_counselor_services
  ADD COLUMN IF NOT EXISTS pricing_model TEXT NOT NULL DEFAULT 'fixed'
    CHECK (pricing_model IN ('fixed', 'quote')),
  ADD COLUMN IF NOT EXISTS price_usd_min NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS price_usd_max NUMERIC(8,2);

-- For quote-mode services, price_usd_min/max define the RANGE the
-- counselor advertises; price_usd is treated as a "typical" anchor in the
-- middle. For fixed-mode services, price_usd is the only meaningful field
-- (min/max ignored). Backfill nothing — existing rows stay 'fixed'.

-- Defensive: when pricing_model='quote', min must be ≤ max.
DO $$ BEGIN
  ALTER TABLE cc_counselor_services
    ADD CONSTRAINT cc_services_quote_range_valid CHECK (
      pricing_model = 'fixed' OR
      (price_usd_min IS NOT NULL AND price_usd_max IS NOT NULL AND price_usd_min <= price_usd_max)
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── 2. Quote thread fields on engagements ────────────────────────────
ALTER TABLE cc_counselor_engagements
  ADD COLUMN IF NOT EXISTS request_message     TEXT,
  ADD COLUMN IF NOT EXISTS quoted_price_usd    NUMERIC(8,2),
  ADD COLUMN IF NOT EXISTS quote_message       TEXT,
  ADD COLUMN IF NOT EXISTS quoted_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS quote_declined_at   TIMESTAMPTZ;

-- ─── 3. Three new lifecycle states ────────────────────────────────────
-- Postgres ENUM: ALTER TYPE ... ADD VALUE is the only path; can't be
-- combined with other migrations in the same transaction in some
-- Postgres versions, so we run each in its own DO block.
DO $$ BEGIN
  ALTER TYPE counselor_engagement_status ADD VALUE IF NOT EXISTS 'quote_requested';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE counselor_engagement_status ADD VALUE IF NOT EXISTS 'quoted';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE counselor_engagement_status ADD VALUE IF NOT EXISTS 'quote_declined';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Lifecycle transitions (enforced at app layer; no SQL state machine):
--
--   request flow (quote-mode service):
--     student requests → quote_requested
--     counselor quotes → quoted
--     student accepts → paid_pending_start (via Stripe checkout)
--     student declines → quote_declined
--     counselor cancels → cancelled
--
--   booking flow (fixed-mode service):
--     student books → proposed → paid_pending_start (via Stripe checkout)
--
-- Both flows merge at paid_pending_start and follow the existing
-- in_progress → completed path from Phase 1.
