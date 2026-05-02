-- Phase 2.7 — "Coach's nudge" callouts. AI-generated, per-user, per-module
-- observations rendered in gold-tinted callouts inside dashboard priority
-- modules. Generation runs on a daily Vercel cron (4:07am UTC); display
-- reads the freshest non-expired row per (student, module).
--
-- Cost guardrails enforced in src/app/api/cron/generate-observations/route.ts:
--   - Hard cap of 4 observations per student per cron run
--   - Skip students who haven't logged in for 7+ days
--   - Hash the input context per module; skip regeneration when unchanged
--   - 7-day TTL — stale observations stay visible until refresh

CREATE TABLE IF NOT EXISTS cc_dashboard_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  -- Which priority module is this observation for? Mirrors PriorityCard.label
  -- ('Personal statement', 'Activities', 'School list', 'Test strategy').
  module_label TEXT NOT NULL,
  -- The observation text. Always italicized, always under 25 words.
  observation TEXT NOT NULL,
  -- Eyebrow that appears above the quote. Default 'COACH NOTICED'.
  eyebrow TEXT NOT NULL DEFAULT 'COACH NOTICED',
  -- Hash of the input context the LLM saw. Used to skip regeneration when
  -- the underlying data hasn't materially changed since the last run.
  context_hash TEXT,
  -- Generation metadata for cost auditing.
  generated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost_usd NUMERIC(10,4),
  -- One observation per (student, module) at a time. Cron upserts on conflict.
  UNIQUE(student_id, module_label)
);

CREATE INDEX IF NOT EXISTS cc_dashboard_observations_lookup_idx
  ON cc_dashboard_observations(student_id, module_label, expires_at);

ALTER TABLE cc_dashboard_observations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students see their observations" ON cc_dashboard_observations;
CREATE POLICY "students see their observations"
  ON cc_dashboard_observations FOR SELECT
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

-- Settings toggle on cc_student_profiles. Default ON; flip to FALSE to
-- disable generation + display for users who find observations noisy.
ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS dashboard_observations_enabled BOOLEAN DEFAULT TRUE;
