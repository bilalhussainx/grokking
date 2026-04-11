-- Migration 028: Verifiable Credentials (sub-project 1)
-- Stores Privy wallet bindings and issued on-chain credentials.
-- Spec: 2026-04-11-verifiable-credentials-design.md

CREATE TABLE IF NOT EXISTS user_wallets (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  privy_did TEXT NOT NULL UNIQUE,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_wallets_address
  ON user_wallets (wallet_address);

CREATE TABLE IF NOT EXISTS issued_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL CHECK (credential_type IN ('diploma', 'badge_batch')),
  diploma_id TEXT,                                   -- catalog id; null for batches
  token_id NUMERIC,                                  -- on-chain tokenId
  tx_hash TEXT,
  metadata_uri TEXT,                                 -- ipfs://... (diplomas)
  merkle_root TEXT,                                  -- batches only (sub-project 3)
  evidence_snapshot JSONB,                           -- frozen criteria + scores
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'minted', 'failed', 'revoked')),
  minted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_issued_credentials_user
  ON issued_credentials (user_id);
CREATE INDEX IF NOT EXISTS idx_issued_credentials_status
  ON issued_credentials (status);
CREATE INDEX IF NOT EXISTS idx_issued_credentials_diploma
  ON issued_credentials (diploma_id) WHERE diploma_id IS NOT NULL;

-- One mint per diploma per user (enforced at the DB level for safety)
CREATE UNIQUE INDEX IF NOT EXISTS idx_issued_credentials_user_diploma_unique
  ON issued_credentials (user_id, diploma_id)
  WHERE credential_type = 'diploma' AND status = 'minted';

-- RLS: users can SELECT their own, server-role does writes
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS uw_select_own ON user_wallets;
CREATE POLICY uw_select_own ON user_wallets
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE issued_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ic_select_own ON issued_credentials;
CREATE POLICY ic_select_own ON issued_credentials
  FOR SELECT USING (auth.uid() = user_id);
