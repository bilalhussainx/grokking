-- ──────────────────────────────────────────────────────────────────────
-- Essay counselor-review state (SP2/SP3 — counselor review loop)
--
-- Adds a per-essay review state so the counselor↔student loop has a clean
-- signal: counselor opens an essay (in_review), ships comments asking for
-- changes (changes_requested), student addresses + resubmits (resubmitted),
-- counselor approves (approved). Inline comments themselves live in the
-- existing cc_counselor_comments table (artifact_type='essay',
-- artifact_id = cc_essays.id::text).
-- ──────────────────────────────────────────────────────────────────────

ALTER TABLE cc_essays
  ADD COLUMN IF NOT EXISTS counselor_review_state TEXT
    CHECK (counselor_review_state IN ('in_review','changes_requested','resubmitted','approved')),
  ADD COLUMN IF NOT EXISTS counselor_review_updated_at TIMESTAMPTZ;
