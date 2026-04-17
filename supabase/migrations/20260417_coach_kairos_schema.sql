-- Coach Kairos schema — all cc_* tables
-- PRD Section 8: kairoslearnprd.md

-- 1. Core student profile
CREATE TABLE IF NOT EXISTS cc_student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  legal_first_name TEXT,
  preferred_name TEXT,
  grade_level INT CHECK (grade_level BETWEEN 9 AND 13),
  graduation_year INT,
  high_school_name TEXT,
  high_school_ceeb_code TEXT,
  state_province TEXT,
  country TEXT DEFAULT 'US',
  home_language TEXT DEFAULT 'en',
  is_first_gen BOOLEAN,
  is_international BOOLEAN DEFAULT false,
  citizenship_status TEXT,
  race_ethnicity JSONB,
  gender TEXT,
  profile_completion_pct INT DEFAULT 0,
  intake_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_student_profiles_user ON cc_student_profiles(user_id);

-- 2. Academic profile
CREATE TABLE IF NOT EXISTS cc_academic_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  gpa_unweighted NUMERIC(3,2),
  gpa_weighted NUMERIC(4,2),
  gpa_scale TEXT DEFAULT '4.0',
  class_rank INT,
  class_size INT,
  courses JSONB,
  ap_ib_courses JSONB,
  test_strategy TEXT,
  sat_total INT,
  sat_math INT,
  sat_erw INT,
  act_composite INT,
  act_subscores JSONB,
  toefl_score INT,
  ielts_score NUMERIC(3,1),
  duolingo_english_score INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_academic_student ON cc_academic_profiles(student_id);

-- 3. Activities (10 Common App slots)
CREATE TABLE IF NOT EXISTS cc_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  position INT,
  activity_type TEXT,
  organization TEXT,
  role TEXT,
  description_150 TEXT,
  star_situation TEXT,
  star_task TEXT,
  star_action TEXT,
  star_result TEXT,
  grades_participated INT[],
  hours_per_week NUMERIC(4,1),
  weeks_per_year INT,
  is_continuing BOOLEAN DEFAULT true,
  impact_score INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_activities_student ON cc_activities(student_id);

-- 4. Honors (5 Common App slots)
CREATE TABLE IF NOT EXISTS cc_honors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  position INT,
  title TEXT,
  level TEXT,
  grade INT,
  description_100 TEXT
);
CREATE INDEX IF NOT EXISTS idx_cc_honors_student ON cc_honors(student_id);

-- 5. Financial context
CREATE TABLE IF NOT EXISTS cc_financial_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  household_income_bracket TEXT,
  household_size INT,
  dependents_in_college INT DEFAULT 1,
  parents_marital_status TEXT,
  pell_eligible_estimate BOOLEAN,
  sai_estimate INT,
  free_reduced_lunch BOOLEAN,
  willing_to_take_loans BOOLEAN DEFAULT true,
  max_loans_comfortable INT,
  fafsa_submitted BOOLEAN DEFAULT false,
  fafsa_ed INT,
  css_profile_submitted BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_financial_student ON cc_financial_profiles(student_id);

-- 6. School database (~550 US/CA colleges)
CREATE TABLE IF NOT EXISTS cc_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ipeds_id INT UNIQUE,
  name TEXT NOT NULL,
  common_name TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  institution_type TEXT,
  carnegie_classification TEXT,
  enrollment_undergrad INT,
  acceptance_rate NUMERIC(4,3),
  sat_25 INT,
  sat_75 INT,
  act_25 INT,
  act_75 INT,
  avg_hs_gpa NUMERIC(3,2),
  cost_of_attendance INT,
  avg_net_price INT,
  avg_net_price_by_income JSONB,
  meets_full_need BOOLEAN DEFAULT false,
  no_loan_institution BOOLEAN DEFAULT false,
  pell_pct NUMERIC(4,3),
  first_gen_pct NUMERIC(4,3),
  first_gen_programs TEXT[],
  application_platforms TEXT[],
  application_deadlines JSONB,
  supplemental_essay_count INT,
  essay_prompts JSONB,
  alumni_interview_program BOOLEAN DEFAULT false,
  has_cc_persona BOOLEAN DEFAULT false,
  persona_slug TEXT,
  npc_url TEXT,
  common_data_set_url TEXT,
  graduation_rate_6y NUMERIC(4,3),
  median_earnings_10y INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_schools_ipeds ON cc_schools(ipeds_id);

-- 7. Student school list
CREATE TABLE IF NOT EXISTS cc_student_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES cc_schools(id),
  tier TEXT,
  chancing_band TEXT,
  chancing_rationale TEXT,
  estimated_net_price_low INT,
  estimated_net_price_high INT,
  application_plan TEXT,
  application_status TEXT DEFAULT 'considering',
  submitted_at TIMESTAMPTZ,
  decision_at TIMESTAMPTZ,
  fee_waiver_used BOOLEAN DEFAULT false,
  added_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_student_schools_student ON cc_student_schools(student_id);

-- 8. Essays
CREATE TABLE IF NOT EXISTS cc_essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES cc_schools(id),
  essay_type TEXT,
  prompt_text TEXT,
  word_limit INT,
  phase TEXT DEFAULT 'brainstorm',
  brainstorm_transcript TEXT,
  outline_json JSONB,
  current_draft TEXT,
  revision_comments JSONB,
  word_count INT,
  share_token TEXT UNIQUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_essays_student ON cc_essays(student_id);

-- 9. Timeline tasks
CREATE TABLE IF NOT EXISTS cc_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES cc_schools(id),
  task_type TEXT,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  reminder_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  priority INT DEFAULT 3,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_tasks_student ON cc_tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_cc_tasks_due ON cc_tasks(due_date);

-- 10. Recommenders
CREATE TABLE IF NOT EXISTS cc_recommenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  recommender_type TEXT,
  name TEXT,
  subject TEXT,
  email TEXT,
  status TEXT DEFAULT 'considering',
  brag_sheet_url TEXT,
  asked_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_cc_recommenders_student ON cc_recommenders(student_id);

-- 11. Scholarships (curated database)
CREATE TABLE IF NOT EXISTS cc_scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sponsor TEXT,
  amount_min INT,
  amount_max INT,
  deadline DATE,
  is_renewable BOOLEAN DEFAULT false,
  eligibility_criteria JSONB,
  is_first_gen_focused BOOLEAN DEFAULT false,
  url TEXT,
  essay_required BOOLEAN DEFAULT false,
  essay_prompts JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_scholarships_eligibility ON cc_scholarships USING GIN (eligibility_criteria);

-- 12. Student scholarship matches
CREATE TABLE IF NOT EXISTS cc_student_scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES cc_scholarships(id),
  match_score NUMERIC(3,2),
  status TEXT DEFAULT 'matched',
  applied_at TIMESTAMPTZ,
  amount_awarded INT
);
CREATE INDEX IF NOT EXISTS idx_cc_student_scholarships_student ON cc_student_scholarships(student_id);

-- 13. Aid offers (with computed net cost)
CREATE TABLE IF NOT EXISTS cc_aid_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_school_id UUID NOT NULL REFERENCES cc_student_schools(id) ON DELETE CASCADE,
  cost_of_attendance INT,
  institutional_grants INT,
  pell_grant INT,
  state_grants INT,
  external_scholarships INT,
  subsidized_loans INT,
  unsubsidized_loans INT,
  work_study INT,
  parent_plus_loans INT,
  net_cost INT GENERATED ALWAYS AS (
    cost_of_attendance - COALESCE(institutional_grants,0) - COALESCE(pell_grant,0)
    - COALESCE(state_grants,0) - COALESCE(external_scholarships,0)
  ) STORED,
  appealed BOOLEAN DEFAULT false,
  appeal_outcome_amount INT,
  notes TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_aid_offers_school ON cc_aid_offers(student_school_id);

-- 14. Glossary (jargon translator)
CREATE TABLE IF NOT EXISTS cc_glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_slug TEXT UNIQUE NOT NULL,
  term_display TEXT NOT NULL,
  short_def TEXT NOT NULL,
  long_def TEXT,
  category TEXT,
  translations JSONB,
  audio_urls JSONB,
  related_terms TEXT[]
);

-- 15. Parent summaries (multilingual)
CREATE TABLE IF NOT EXISTS cc_parent_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  milestone TEXT,
  language TEXT,
  summary_text TEXT,
  audio_url TEXT,
  share_token TEXT UNIQUE,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_parent_summaries_student ON cc_parent_summaries(student_id);

-- 16. Intake voice sessions (pre-signup)
CREATE TABLE IF NOT EXISTS cc_intake_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'en',
  transcript JSONB,
  extracted_fields JSONB,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 17. Essay interaction audit log (anti-ghostwriting)
CREATE TABLE IF NOT EXISTS cc_essay_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_id UUID NOT NULL REFERENCES cc_essays(id) ON DELETE CASCADE,
  turn_type TEXT,
  content TEXT,
  word_count INT,
  was_blocked BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cc_essay_interactions_essay ON cc_essay_interactions(essay_id);

-- RLS policies
ALTER TABLE cc_student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_academic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_honors ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_student_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_recommenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_student_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_aid_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_parent_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_intake_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_essay_interactions ENABLE ROW LEVEL SECURITY;

-- Student-owned tables: owner can CRUD
DO $$ BEGIN
  CREATE POLICY cc_student_profiles_owner ON cc_student_profiles
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_academic_profiles_owner ON cc_academic_profiles
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_activities_owner ON cc_activities
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_honors_owner ON cc_honors
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_financial_profiles_owner ON cc_financial_profiles
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_student_schools_owner ON cc_student_schools
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_essays_owner ON cc_essays
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_tasks_owner ON cc_tasks
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_recommenders_owner ON cc_recommenders
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_student_scholarships_owner ON cc_student_scholarships
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_aid_offers_owner ON cc_aid_offers
    FOR ALL USING (student_school_id IN (
      SELECT ss.id FROM cc_student_schools ss
      JOIN cc_student_profiles sp ON ss.student_id = sp.id
      WHERE sp.user_id = auth.uid()
    ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_essay_interactions_owner ON cc_essay_interactions
    FOR ALL USING (essay_id IN (
      SELECT e.id FROM cc_essays e
      JOIN cc_student_profiles sp ON e.student_id = sp.id
      WHERE sp.user_id = auth.uid()
    ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Public-read tables
DO $$ BEGIN
  CREATE POLICY cc_schools_public_read ON cc_schools
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_scholarships_public_read ON cc_scholarships
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_glossary_public_read ON cc_glossary
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Parent summaries: public via share token
DO $$ BEGIN
  CREATE POLICY cc_parent_summaries_public_share ON cc_parent_summaries
    FOR SELECT USING (share_token IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY cc_parent_summaries_owner ON cc_parent_summaries
    FOR ALL USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Intake sessions: accessible by session token (pre-auth) or by user_id (post-auth)
DO $$ BEGIN
  CREATE POLICY cc_intake_sessions_owner ON cc_intake_sessions
    FOR ALL USING (user_id = auth.uid() OR user_id IS NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
