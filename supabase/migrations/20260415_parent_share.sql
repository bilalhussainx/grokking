-- SP-3 — parent share tokens: student generates a read-only share code; parent
-- redeems it at /parent/<code>. No parent account required.

CREATE TABLE IF NOT EXISTS parent_share_tokens (
  code TEXT PRIMARY KEY,                   -- 12-char URL-safe
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,                              -- student's note, e.g. "Mom"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,                  -- nullable = no expiry
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_parent_share_user ON parent_share_tokens (user_id);

ALTER TABLE parent_share_tokens ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users manage own share tokens"
    ON parent_share_tokens FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "service role full access to share tokens"
    ON parent_share_tokens FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMENT ON TABLE parent_share_tokens IS
  'SP-3 — read-only share codes so parents can view student progress without an account.';
