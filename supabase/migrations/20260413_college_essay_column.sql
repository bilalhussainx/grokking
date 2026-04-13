-- Add optional college application essay to applicant profile.
-- Used to personalize the AI alumni interviewer so it can ask specific
-- follow-ups about moments, people, and ideas the candidate wrote about.
--
-- Self-sufficient: creates the base table + RLS policies if the earlier
-- 20260407_college_applicant_profile.sql migration hasn't been applied yet
-- (observed on remote DBs where migrations were applied out of band).

CREATE TABLE IF NOT EXISTS college_applicant_profile (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  intended_major TEXT,
  top_project_title TEXT,
  top_project_description TEXT,
  recent_influence TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE college_applicant_profile ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users read own applicant profile"
    ON college_applicant_profile FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users insert own applicant profile"
    ON college_applicant_profile FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users update own applicant profile"
    ON college_applicant_profile FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access to applicant profile"
    ON college_applicant_profile FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- The actual column this migration exists to add:
ALTER TABLE college_applicant_profile
  ADD COLUMN IF NOT EXISTS college_essay TEXT;

COMMENT ON COLUMN college_applicant_profile.college_essay IS
  'Optional Common App / personal statement pasted by user. Injected into interviewer system prompt (capped to 4000 chars in the builder).';
