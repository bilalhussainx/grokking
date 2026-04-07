-- College admissions interview vertical
-- Spec: docs/superpowers/specs/2026-04-07-college-admissions-interviews-design.md

-- ─────────────────────────────────────────────────────────────────────────────
-- Applicant profile (one row per user)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS college_applicant_profile (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  intended_major TEXT,
  top_project_title TEXT,
  top_project_description TEXT,    -- 100-200 word textarea
  recent_influence TEXT,           -- "Sapiens by Yuval Harari"
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE college_applicant_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own applicant profile"
  ON college_applicant_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own applicant profile"
  ON college_applicant_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own applicant profile"
  ON college_applicant_profile FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "service role full access to applicant profile"
  ON college_applicant_profile FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

COMMENT ON TABLE college_applicant_profile IS
  'Per-user college application profile used to personalize college interview prep. Spec: 2026-04-07-college-admissions-interviews-design.md';

-- ─────────────────────────────────────────────────────────────────────────────
-- Add category column to interview_question_history
-- so college and tech interview question pools stay separate
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE interview_question_history
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'tech';

COMMENT ON COLUMN interview_question_history.category IS
  '''tech'' for FAANG-style coding/behavioral interviews; ''college'' for university admissions interviews';

-- Replace the lookup index to include category for faster filtered queries
DROP INDEX IF EXISTS idx_question_history_lookup;
CREATE INDEX idx_question_history_lookup
  ON interview_question_history (user_id, category, preset, interview_type, asked_at DESC);
