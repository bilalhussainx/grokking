-- Feature 8: Interview Prep — human element (post-interview reflection +
-- school-specific questions to ask). Reuses existing interview_sessions table.

CREATE TABLE IF NOT EXISTS interview_post_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  interview_date DATE,
  what_went_well TEXT,
  what_was_hard TEXT,
  questions_they_asked TEXT,
  questions_i_asked TEXT,
  confidence_score INTEGER CHECK (confidence_score BETWEEN 1 AND 10),
  ai_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS interview_post_reflections_user_idx
  ON interview_post_reflections(user_id, created_at DESC);

ALTER TABLE interview_post_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users own interview reflections" ON interview_post_reflections;
CREATE POLICY "users own interview reflections"
  ON interview_post_reflections FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
