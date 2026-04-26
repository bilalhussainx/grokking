-- Feature 6: Waitlist Management
CREATE TABLE IF NOT EXISTS waitlist_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  student_school_id UUID REFERENCES cc_student_schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  decision TEXT CHECK (decision IN ('stay', 'decline', 'undecided')) DEFAULT 'undecided',
  decision_reason TEXT,
  loci_draft TEXT,
  loci_sent BOOLEAN DEFAULT FALSE,
  loci_sent_date DATE,
  updates_sent JSONB DEFAULT '[]'::jsonb,
  historical_acceptance_rate NUMERIC(5,2),
  expected_decision_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, student_school_id)
);

ALTER TABLE waitlist_management ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students own waitlist rows" ON waitlist_management;
CREATE POLICY "students own waitlist rows"
  ON waitlist_management FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
