-- Feature 9: SAT/ACT Strategy Engine
-- Reuses cc_academic_profiles for current scores; adds a tracker table for
-- attempt history and a planner for upcoming sittings.

CREATE TABLE IF NOT EXISTS cc_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL CHECK (test_type IN ('SAT', 'ACT', 'PSAT', 'AP', 'IB')),
  test_date DATE,
  total_score INTEGER,
  -- SAT subscores
  sat_reading_writing INTEGER,
  sat_math INTEGER,
  -- ACT subscores
  act_english INTEGER,
  act_math INTEGER,
  act_reading INTEGER,
  act_science INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cc_test_attempts_student_idx
  ON cc_test_attempts(student_id, test_date);

CREATE TABLE IF NOT EXISTS cc_test_plan (
  student_id UUID PRIMARY KEY REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  recommended_test TEXT CHECK (recommended_test IN ('SAT', 'ACT', 'BOTH', 'UNDECIDED')),
  recommendation_reasons JSONB DEFAULT '[]'::jsonb,
  fee_waiver_eligible BOOLEAN,
  fee_waiver_reason TEXT,
  next_sitting_date DATE,
  registration_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cc_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_test_plan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students own test attempts" ON cc_test_attempts;
CREATE POLICY "students own test attempts"
  ON cc_test_attempts FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "students own test plan" ON cc_test_plan;
CREATE POLICY "students own test plan"
  ON cc_test_plan FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
