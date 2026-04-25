-- Feature 1A: voice mode + family mode + bilingual canvas
-- Idempotent so re-running is safe.

ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS language_picker_seen_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS voice_quality_check_passed_at TIMESTAMPTZ;

ALTER TABLE cc_essays
  ADD COLUMN IF NOT EXISTS canvas_fragments JSONB DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS cc_family_mode_turns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'coach')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cc_family_mode_turns_student_idx
  ON cc_family_mode_turns(student_id, created_at DESC);

ALTER TABLE cc_family_mode_turns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students read their own family mode turns" ON cc_family_mode_turns;
CREATE POLICY "students read their own family mode turns"
  ON cc_family_mode_turns FOR SELECT
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "students write their own family mode turns" ON cc_family_mode_turns;
CREATE POLICY "students write their own family mode turns"
  ON cc_family_mode_turns FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
