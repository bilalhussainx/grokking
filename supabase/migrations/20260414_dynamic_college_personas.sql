-- SP-11 — dynamic college persona cache.
-- For schools NOT in the hard-coded COLLEGE_PERSONAS list, generate a persona
-- on demand (LLM-authored for now; will swap to Python research service in SP-8).
-- Cached globally: one Stanford dynamic persona serves all users.

CREATE TABLE IF NOT EXISTS college_personas_dynamic (
  school_id TEXT PRIMARY KEY,           -- slug, e.g. "university-of-toronto"
  school_name TEXT NOT NULL,            -- display name, e.g. "University of Toronto"
  persona_json JSONB NOT NULL,          -- full CollegePersona shape
  source TEXT NOT NULL DEFAULT 'llm',   -- 'llm' | 'research-agent' | 'manual'
  source_model TEXT,                    -- e.g. "anthropic/claude-sonnet-4"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS college_personas_dynamic_name_idx
  ON college_personas_dynamic USING gin (to_tsvector('simple', school_name));

ALTER TABLE college_personas_dynamic ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read dynamic personas (global cache).
DO $$ BEGIN
  CREATE POLICY "authenticated users read dynamic personas"
    ON college_personas_dynamic FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Only the service role writes — routes mint these via server-side LLM calls.
DO $$ BEGIN
  CREATE POLICY "service role full access to dynamic personas"
    ON college_personas_dynamic FOR ALL
    USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMENT ON TABLE college_personas_dynamic IS
  'Generated-on-demand college interviewer personas for schools not in the hand-authored list. Spec: SP-11.';
