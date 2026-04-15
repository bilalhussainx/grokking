-- SP-2 remaining: activities list + per-school supplemental essays + essay probe hints cache.
-- Spec: CollegeVCareers.md SP-2.

-- ─────────────────────────────────────────────────────────────────────────────
-- Activities / extracurriculars (Common-App-shape)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS college_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,                  -- e.g. "Debate Team"
  role TEXT,                            -- e.g. "Captain"
  category TEXT,                        -- e.g. "academic", "athletic", "service", "work", "arts"
  description TEXT,                     -- 150-char-ish Common App blurb
  hours_per_week NUMERIC(4,1),
  weeks_per_year NUMERIC(4,1),
  grades_participated TEXT[],           -- ["9","10","11","12"]
  position INT NOT NULL DEFAULT 0,      -- display order
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS college_activities_user_idx
  ON college_activities(user_id, position);

ALTER TABLE college_activities ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users read own activities"
    ON college_activities FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users insert own activities"
    ON college_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users update own activities"
    ON college_activities FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users delete own activities"
    ON college_activities FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access to activities"
    ON college_activities FOR ALL
    USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Per-school supplemental essays (distinct from generic essay_drafts)
-- Supplementals are tied to a school, have a specific prompt, and feed the
-- interviewer prompt when that school's interview is practiced.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS college_essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL,              -- matches college persona id, e.g. "harvard-undergrad"
  prompt TEXT NOT NULL,                 -- the supplemental prompt as-written by the school
  body TEXT NOT NULL DEFAULT '',
  word_target INT,                      -- 150 / 250 / 650 etc.
  status TEXT NOT NULL DEFAULT 'drafting'
    CHECK (status IN ('drafting','review','done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS college_essays_user_school_idx
  ON college_essays(user_id, school_id, updated_at DESC);

ALTER TABLE college_essays ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users read own supplementals"
    ON college_essays FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users insert own supplementals"
    ON college_essays FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users update own supplementals"
    ON college_essays FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users delete own supplementals"
    ON college_essays FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access to supplementals"
    ON college_essays FOR ALL
    USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Cached "essay probe hints" — the 3-5 specific moments an interviewer should probe,
-- extracted by a pre-flight LLM pass. Hashed on essay text so we don't re-run on
-- every interview start.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS essay_probe_hints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  essay_hash TEXT NOT NULL,             -- sha256 of the essay body — recompute on change
  hints_json JSONB NOT NULL,            -- [{ moment, question, rationale }, ...]
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, essay_hash)
);

ALTER TABLE essay_probe_hints ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users read own probe hints"
    ON essay_probe_hints FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access to probe hints"
    ON essay_probe_hints FOR ALL
    USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMENT ON TABLE college_activities IS 'Common-App-style extracurriculars; feeds interviewer follow-ups. Spec: SP-2.';
COMMENT ON TABLE college_essays IS 'Per-school supplemental essays. Referenced by interviewer when that school is picked. Spec: SP-2.';
COMMENT ON TABLE essay_probe_hints IS 'Pre-flight LLM-extracted probe moments from an essay; cached by essay-hash. Spec: SP-2.';
