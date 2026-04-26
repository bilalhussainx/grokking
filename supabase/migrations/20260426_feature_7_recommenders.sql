-- Feature 7: Teacher Recommendation Management — additive only.
-- The cc_recommenders table already exists (migration 20260417_coach_kairos_schema.sql).
-- We just add fields the existing schema lacks + a per-school submission tracker.

ALTER TABLE cc_recommenders
  ADD COLUMN IF NOT EXISTS waiver_signed BOOLEAN,
  ADD COLUMN IF NOT EXISTS waiver_decision_note TEXT,
  ADD COLUMN IF NOT EXISTS ask_email_text TEXT,
  ADD COLUMN IF NOT EXISTS reminder_email_text TEXT,
  ADD COLUMN IF NOT EXISTS context_notes TEXT,
  ADD COLUMN IF NOT EXISTS relationship TEXT;

CREATE TABLE IF NOT EXISTS cc_recommender_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommender_id UUID NOT NULL REFERENCES cc_recommenders(id) ON DELETE CASCADE,
  student_school_id UUID NOT NULL REFERENCES cc_student_schools(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ,
  submitted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  UNIQUE(recommender_id, student_school_id)
);

ALTER TABLE cc_recommender_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students own rec submissions" ON cc_recommender_submissions;
CREATE POLICY "students own rec submissions"
  ON cc_recommender_submissions FOR ALL
  USING (
    recommender_id IN (
      SELECT id FROM cc_recommenders WHERE student_id IN (
        SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    recommender_id IN (
      SELECT id FROM cc_recommenders WHERE student_id IN (
        SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()
      )
    )
  );
