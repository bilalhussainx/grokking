-- SP-7 — cache table for computed college fit reports.
CREATE TABLE IF NOT EXISTS college_fit_reports (
  cache_key TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL,
  report_json JSONB NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fit_reports_user ON college_fit_reports (user_id, created_at DESC);

ALTER TABLE college_fit_reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users read own fit reports"
    ON college_fit_reports FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access to fit reports"
    ON college_fit_reports FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMENT ON TABLE college_fit_reports IS 'SP-7 — LLM-derived school-fit evaluations, keyed by sha256(profileSig||schoolId).';
