-- Resume optimizer — upload, parse, LLM-rewrite bullets, versioning.
-- Spec: CollegeVCareers.md SP-16.

CREATE TABLE IF NOT EXISTS resume_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx', 'txt')),
  raw_text TEXT NOT NULL,
  parsed_sections JSONB,                -- { contact, summary, experience, education, skills, projects }
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resume_docs_user_idx ON resume_docs(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS resume_rewrites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id UUID NOT NULL REFERENCES resume_docs(id) ON DELETE CASCADE,
  target_role TEXT,                     -- e.g. "Backend engineer, junior" / "Consulting analyst"
  target_jd TEXT,                       -- Optional pasted job description
  body_md TEXT,                         -- Rewritten resume in markdown
  notes_md TEXT,                        -- What was changed and why
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resume_rewrites_doc_idx ON resume_rewrites(doc_id, created_at DESC);

ALTER TABLE resume_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_rewrites ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users read own resumes"
    ON resume_docs FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users insert own resumes"
    ON resume_docs FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users update own resumes"
    ON resume_docs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users delete own resumes"
    ON resume_docs FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users read own rewrites"
    ON resume_rewrites FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM resume_docs WHERE id = doc_id));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users insert own rewrites"
    ON resume_rewrites FOR INSERT
    WITH CHECK (auth.uid() = (SELECT user_id FROM resume_docs WHERE id = doc_id));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access resume_docs"
    ON resume_docs FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access resume_rewrites"
    ON resume_rewrites FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
