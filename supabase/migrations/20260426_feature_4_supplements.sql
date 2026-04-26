-- Feature 4: Supplemental Essay Studio
-- Adds supplement_prompts (catalog of school prompts, public-readable) and
-- extends cc_essays with reuse-detection fields. Existing cc_essays already
-- supports supplements via essay_type / supplement_id / prompt_text fields.

CREATE TABLE IF NOT EXISTS supplement_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES cc_schools(id),
  school_name TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  prompt_type TEXT CHECK (prompt_type IN (
    'why_school', 'community', 'diversity', 'roommate', 'activity',
    'intellectual', 'challenge', 'additional_info', 'short_answer',
    'covid_optional', 'other'
  )),
  word_limit INTEGER,
  char_limit INTEGER,
  is_required BOOLEAN DEFAULT TRUE,
  application_year INTEGER DEFAULT 2026,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS supplement_prompts_school_idx
  ON supplement_prompts(school_name, application_year);

ALTER TABLE supplement_prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read supplement prompts" ON supplement_prompts;
CREATE POLICY "public can read supplement prompts"
  ON supplement_prompts FOR SELECT
  USING (true);

ALTER TABLE cc_essays
  ADD COLUMN IF NOT EXISTS reuse_score NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS reuse_flagged BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reuse_overlap_with UUID REFERENCES cc_essays(id);
