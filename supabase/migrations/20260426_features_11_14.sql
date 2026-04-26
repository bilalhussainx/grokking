-- Features 11/12/13/14 — minimal schemas.
-- Course Selection Advisor (11), Major/Career Exploration (12),
-- College Visit Tracker (13), Summer Experience Planning (14).

-- Feature 11
CREATE TABLE IF NOT EXISTS cc_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  curriculum_type TEXT,
  course_name TEXT NOT NULL,
  level TEXT,
  grade_level INTEGER,
  year_taken TEXT,
  grade_received TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_courses_student_idx ON cc_courses(student_id);

-- Feature 12
CREATE TABLE IF NOT EXISTS cc_major_explorations (
  student_id UUID PRIMARY KEY REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  interests JSONB DEFAULT '[]'::jsonb,
  suggested_majors JSONB DEFAULT '[]'::jsonb,
  narrative_thread TEXT,
  career_paths JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Feature 13
CREATE TABLE IF NOT EXISTS cc_college_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  student_school_id UUID REFERENCES cc_student_schools(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  visit_type TEXT CHECK (visit_type IN ('in_person', 'virtual_tour', 'info_session', 'fair', 'webinar', 'rep_meeting')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_college_visits_student_idx ON cc_college_visits(student_id, visit_date);

-- Feature 14
CREATE TABLE IF NOT EXISTS cc_summer_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  experience_name TEXT NOT NULL,
  category TEXT,
  start_date DATE,
  end_date DATE,
  hours_per_week INTEGER,
  description TEXT,
  narrative_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_summer_experiences_student_idx ON cc_summer_experiences(student_id);

-- RLS for all four
ALTER TABLE cc_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_major_explorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_college_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_summer_experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students own courses" ON cc_courses;
CREATE POLICY "students own courses" ON cc_courses FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "students own major exploration" ON cc_major_explorations;
CREATE POLICY "students own major exploration" ON cc_major_explorations FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "students own visits" ON cc_college_visits;
CREATE POLICY "students own visits" ON cc_college_visits FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "students own summer" ON cc_summer_experiences;
CREATE POLICY "students own summer" ON cc_summer_experiences FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
