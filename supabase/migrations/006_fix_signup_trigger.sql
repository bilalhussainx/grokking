-- ============================================================
-- Fix signup trigger + invite_codes schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Add missing columns to invite_codes (production has old schema)
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS credits INT NOT NULL DEFAULT 1000;
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS duration_days INT NOT NULL DEFAULT 14;
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS max_uses INT DEFAULT NULL;
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS times_used INT DEFAULT 0;

-- 2. Create invite_redemptions if it doesn't exist
CREATE TABLE IF NOT EXISTS invite_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code_id UUID NOT NULL REFERENCES invite_codes(id),
  redeemed_at TIMESTAMPTZ DEFAULT now(),
  pro_expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invite_redemptions_user ON invite_redemptions(user_id);

-- RLS for invite_redemptions
ALTER TABLE invite_redemptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own redemptions" ON invite_redemptions;
CREATE POLICY "Users see own redemptions" ON invite_redemptions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service inserts redemptions" ON invite_redemptions;
CREATE POLICY "Service inserts redemptions" ON invite_redemptions FOR INSERT WITH CHECK (true);

-- 3. Ensure user_credits table exists
CREATE TABLE IF NOT EXISTS user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 50,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own credits" ON user_credits;
CREATE POLICY "Users can read own credits" ON user_credits FOR SELECT USING (auth.uid() = user_id);

-- 4. Ensure credit_txns table exists
CREATE TABLE IF NOT EXISTS credit_txns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  action TEXT NOT NULL,
  ref_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE credit_txns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own credit transactions" ON credit_txns;
CREATE POLICY "Users can read own credit transactions" ON credit_txns FOR SELECT USING (auth.uid() = user_id);

-- 5. Ensure referrals table exists
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referred_id UUID NOT NULL REFERENCES auth.users(id),
  credited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referred_id)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own referrals" ON referrals;
CREATE POLICY "Users can read own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);

-- 6. Ensure add_credits function exists
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_amount INT, p_action TEXT)
RETURNS INT AS $$
DECLARE
  new_balance INT;
BEGIN
  INSERT INTO user_credits (user_id, balance)
  VALUES (p_user_id, LEAST(p_amount, 5000))
  ON CONFLICT (user_id) DO UPDATE
  SET balance = LEAST(user_credits.balance + p_amount, 5000), updated_at = NOW()
  RETURNING balance INTO new_balance;

  INSERT INTO credit_txns (user_id, amount, action, created_at)
  VALUES (p_user_id, p_amount, p_action, NOW());

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Ensure get_credit_balance function exists
CREATE OR REPLACE FUNCTION get_credit_balance(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  bal INT;
BEGIN
  SELECT balance INTO bal FROM user_credits WHERE user_id = p_user_id;
  RETURN COALESCE(bal, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Ensure deduct_credits function exists
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount INT, p_action TEXT, p_ref_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INT;
BEGIN
  SELECT balance INTO current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN FALSE;
  END IF;

  UPDATE user_credits
  SET balance = balance - p_amount, updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO credit_txns (user_id, amount, action, ref_id, created_at)
  VALUES (p_user_id, -p_amount, p_action, p_ref_id, NOW());

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Ensure user_profiles has all needed columns
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS login_streak INT DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_login_date DATE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Add unique constraint on referral_code if not exists
DO $$ BEGIN
  ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_referral_code_key UNIQUE (referral_code);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- Ensure role check includes 'pro'
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('student', 'pro', 'teacher', 'admin'));

-- 10. Ensure update_login_streak RPC exists
CREATE OR REPLACE FUNCTION update_login_streak(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  last_date DATE;
  streak INT;
  credits_awarded INT := 0;
BEGIN
  SELECT last_login_date, login_streak INTO last_date, streak
  FROM user_profiles WHERE id = p_user_id;

  IF last_date IS NULL OR last_date != CURRENT_DATE THEN
    IF last_date = CURRENT_DATE - 1 THEN
      streak := COALESCE(streak, 0) + 1;
    ELSE
      streak := 1;
    END IF;

    IF streak >= 7 THEN
      PERFORM add_credits(p_user_id, 5, 'streak_bonus');
      credits_awarded := 5;
      streak := 0;
    END IF;

    UPDATE user_profiles
    SET login_streak = streak, last_login_date = CURRENT_DATE
    WHERE id = p_user_id;
  END IF;

  RETURN json_build_object('streak', COALESCE(streak, 0), 'credits_awarded', credits_awarded);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 11. THE CRITICAL FIX: Resilient handle_new_user trigger
--
-- Wraps profile + credits creation in EXCEPTION blocks so that
-- if ANY step fails, the auth.users INSERT is NOT rolled back.
-- The user gets created in auth no matter what, and the client
-- fetchProfile() fallback creates the profile if needed.
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer UUID;
BEGIN
  -- Read referral code from signup metadata
  ref_code := NEW.raw_user_meta_data->>'referral_code';

  -- Create user profile (wrapped in exception handler)
  BEGIN
    INSERT INTO user_profiles (id, email, full_name, role, referral_code)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      'student',
      LOWER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8))
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), user_profiles.full_name);
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: profile insert failed for %: %', NEW.id, SQLERRM;
  END;

  -- Create initial credits (wrapped in exception handler)
  BEGIN
    INSERT INTO user_credits (user_id, balance) VALUES (NEW.id, 50)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO credit_txns (user_id, amount, action)
    VALUES (NEW.id, 50, 'signup_bonus');
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: credits insert failed for %: %', NEW.id, SQLERRM;
  END;

  -- Process referral if provided (wrapped in exception handler)
  BEGIN
    IF ref_code IS NOT NULL AND ref_code != '' THEN
      SELECT id INTO referrer FROM user_profiles WHERE referral_code = ref_code LIMIT 1;
      IF referrer IS NOT NULL THEN
        IF (SELECT COUNT(*) FROM referrals WHERE referrer_id = referrer) < 50 THEN
          INSERT INTO referrals (referrer_id, referred_id, credited)
          VALUES (referrer, NEW.id, TRUE)
          ON CONFLICT (referred_id) DO NOTHING;
          PERFORM add_credits(referrer, 25, 'referral');
          PERFORM add_credits(NEW.id, 25, 'referral');
          UPDATE user_profiles SET referred_by = referrer WHERE id = NEW.id;
        END IF;
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: referral processing failed for %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
