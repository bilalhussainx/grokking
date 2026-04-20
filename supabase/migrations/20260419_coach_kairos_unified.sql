-- Coach conversation history
CREATE TABLE IF NOT EXISTS cc_coach_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('assistant', 'user')),
  content TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'general',
  page_context TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cc_coach_conversations_student
  ON cc_coach_conversations(student_id, created_at DESC);

-- School preferences collected during school-builder mode
CREATE TABLE IF NOT EXISTS cc_school_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  financial_need TEXT CHECK (financial_need IN ('essential', 'important', 'nice-to-have', 'not-a-concern')),
  income_bracket TEXT,
  location_type TEXT CHECK (location_type IN ('big-city', 'college-town', 'suburban', 'no-preference')),
  preferred_regions TEXT[] DEFAULT '{}',
  intended_major TEXT,
  needs_international_full_need BOOLEAN,
  extracurriculars_summary TEXT,
  campus_size_preference TEXT CHECK (campus_size_preference IN ('small', 'large', 'no-preference')),
  additional_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id)
);

-- RLS policies
ALTER TABLE cc_coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_school_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_coach_conversations"
  ON cc_coach_conversations FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_school_preferences"
  ON cc_school_preferences FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "users_read_own_conversations"
  ON cc_coach_conversations FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "users_read_own_preferences"
  ON cc_school_preferences FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()
    )
  );
