-- Interview question history table
-- Tracks every question shown to a user so the LLM planner can avoid repeats.
-- Sliding window of 50 most recent per (user_id, preset, interview_type).
-- Per design spec: docs/superpowers/specs/2026-04-07-multilingual-interviews-design.md

CREATE TABLE IF NOT EXISTS interview_question_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preset TEXT NOT NULL,                    -- "frontend", "backend", "system-design", etc.
  interview_type TEXT NOT NULL,            -- "technical", "behavioral", "mixed", "recruiter"
  company_persona_id TEXT,                 -- "google-l4" or NULL for generic
  language TEXT NOT NULL DEFAULT 'en',     -- ISO code of the interview language
  question_text TEXT NOT NULL,             -- canonical English question text
  question_topic TEXT,                     -- e.g. "binary tree traversal" — for diversity sampling
  asked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lookup index: the read path queries by (user_id, preset, interview_type) ORDER BY asked_at DESC LIMIT 50
CREATE INDEX IF NOT EXISTS idx_question_history_lookup
  ON interview_question_history (user_id, preset, interview_type, asked_at DESC);

-- Enable RLS so users can only read/write their own history
ALTER TABLE interview_question_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own question history"
  ON interview_question_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own question history"
  ON interview_question_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to read/write any rows (for admin/cleanup tasks)
CREATE POLICY "service role full access to question history"
  ON interview_question_history FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

COMMENT ON TABLE interview_question_history IS
  'Per-user log of questions shown in mock interviews. Used to prevent repeats within a sliding window of 50 per (preset, interview_type). Spec: 2026-04-07-multilingual-interviews-design.md';
