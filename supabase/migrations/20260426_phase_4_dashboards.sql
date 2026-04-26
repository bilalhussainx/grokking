-- Phase 4: Junior / Grade 9 / Transfer dashboards.
-- grade_level already exists on cc_student_profiles. Add transfer profile.

ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS is_transfer_student BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS transfer_current_school TEXT,
  ADD COLUMN IF NOT EXISTS transfer_credits_completed INTEGER,
  ADD COLUMN IF NOT EXISTS transfer_target_term TEXT,
  ADD COLUMN IF NOT EXISTS transfer_reason TEXT;

-- Grade-9 4-year game plan checklist
CREATE TABLE IF NOT EXISTS cc_grade9_plan (
  student_id UUID PRIMARY KEY REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  grade9_goals JSONB DEFAULT '[]'::jsonb,
  grade10_goals JSONB DEFAULT '[]'::jsonb,
  grade11_goals JSONB DEFAULT '[]'::jsonb,
  grade12_goals JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE cc_grade9_plan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "students own grade9 plan" ON cc_grade9_plan;
CREATE POLICY "students own grade9 plan" ON cc_grade9_plan FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
