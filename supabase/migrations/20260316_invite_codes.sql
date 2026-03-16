-- Invite codes for investor demos and special access
CREATE TABLE IF NOT EXISTS invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,           -- e.g., "INVESTOR-ABC123"
  label TEXT,                          -- "Y Combinator Demo", "CDL Partner"
  role TEXT NOT NULL DEFAULT 'pro',    -- Role to grant: 'pro' | 'teacher'
  credits INT NOT NULL DEFAULT 1000,   -- Credits to grant on signup
  duration_days INT NOT NULL DEFAULT 14, -- How long pro access lasts
  max_uses INT DEFAULT NULL,           -- NULL = unlimited, or set to 1 for single-use
  times_used INT DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ DEFAULT NULL, -- Code itself can expire
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Track which users redeemed which codes
CREATE TABLE IF NOT EXISTS invite_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code_id UUID NOT NULL REFERENCES invite_codes(id),
  redeemed_at TIMESTAMPTZ DEFAULT now(),
  pro_expires_at TIMESTAMPTZ NOT NULL  -- When their pro access ends
);

CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_redemptions_user ON invite_redemptions(user_id);

-- RLS
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can check codes" ON invite_codes FOR SELECT USING (true);
CREATE POLICY "Service inserts codes" ON invite_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Service updates codes" ON invite_codes FOR UPDATE USING (true);
CREATE POLICY "Users see own redemptions" ON invite_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service inserts redemptions" ON invite_redemptions FOR INSERT WITH CHECK (true);
