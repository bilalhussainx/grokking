-- Essay workbench — ideation, drafting, review, versioning.
-- Spec: CollegeVCareers.md SP-10.

CREATE TABLE IF NOT EXISTS essay_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,                   -- The essay prompt (e.g., Common App #1)
  school_id TEXT,                         -- Optional target school (college persona id)
  word_target INTEGER,                    -- Optional target word count
  status TEXT NOT NULL DEFAULT 'ideation' CHECK (status IN ('ideation', 'drafting', 'review', 'done')),
  current_version INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS essay_drafts_user_idx ON essay_drafts(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS essay_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES essay_drafts(id) ON DELETE CASCADE,
  version_num INTEGER NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('angles', 'outline', 'body', 'critique')),
  body_md TEXT,                           -- Plain markdown for body/outline/angles
  critique_json JSONB,                    -- Structured critique output (for kind='critique')
  word_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(draft_id, version_num, kind)
);

CREATE INDEX IF NOT EXISTS essay_versions_draft_idx ON essay_versions(draft_id, version_num DESC);

ALTER TABLE essay_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE essay_versions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users read own essay drafts"
    ON essay_drafts FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users insert own essay drafts"
    ON essay_drafts FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users update own essay drafts"
    ON essay_drafts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users delete own essay drafts"
    ON essay_drafts FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users read own essay versions"
    ON essay_versions FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM essay_drafts WHERE id = draft_id));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users insert own essay versions"
    ON essay_versions FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM essay_drafts WHERE id = draft_id));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access essay_drafts"
    ON essay_drafts FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access essay_versions"
    ON essay_versions FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
