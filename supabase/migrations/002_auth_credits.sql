-- ============================================================
-- Phase 1: Auth, Credits & Subscriptions Migration
-- ============================================================

-- 1. Modify user_profiles — add new columns
-- Drop the existing CHECK constraint on role that only allows 'student','teacher','admin'
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS login_streak INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_login_date DATE,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
-- Add new CHECK that includes 'pro' role
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('student', 'pro', 'teacher', 'admin'));

-- 2. User credits balance
CREATE TABLE IF NOT EXISTS user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 50,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Credit transaction log (audit trail)
CREATE TABLE IF NOT EXISTS credit_txns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  action TEXT NOT NULL,
  ref_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE credit_txns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credit transactions"
  ON credit_txns FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Paddle subscription state
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paddle_subscription_id TEXT UNIQUE NOT NULL,
  paddle_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'pro',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 5. Referral tracking
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referred_id UUID NOT NULL REFERENCES auth.users(id),
  credited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referred_id)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id);

-- 6. Atomic credit deduction RPC
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

-- 7. Add credits RPC (capped at 5000, race-condition safe with INSERT ON CONFLICT)
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

-- 8. Get credit balance RPC
CREATE OR REPLACE FUNCTION get_credit_balance(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  bal INT;
BEGIN
  SELECT balance INTO bal FROM user_credits WHERE user_id = p_user_id;
  RETURN COALESCE(bal, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Login streak update RPC
CREATE OR REPLACE FUNCTION update_login_streak(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  last_date DATE;
  streak INT;
  credits_awarded INT := 0;
BEGIN
  SELECT last_login_date, login_streak INTO last_date, streak
  FROM user_profiles WHERE id = p_user_id;

  IF last_date = CURRENT_DATE THEN
    RETURN json_build_object('streak', streak, 'credits_awarded', 0);
  END IF;

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

  RETURN json_build_object('streak', streak, 'credits_awarded', credits_awarded);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Update the existing handle_new_user trigger to include credits + referral processing
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer UUID;
BEGIN
  -- Read referral code from signup metadata (passed via auth.signUp options.data)
  ref_code := NEW.raw_user_meta_data->>'referral_code';

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

  INSERT INTO user_credits (user_id, balance) VALUES (NEW.id, 50)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO credit_txns (user_id, amount, action)
  VALUES (NEW.id, 50, 'signup_bonus');

  -- Process referral if a valid referral code was provided
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    SELECT id INTO referrer FROM user_profiles WHERE referral_code = ref_code LIMIT 1;
    IF referrer IS NOT NULL THEN
      -- Check referrer hasn't exceeded 50 referral cap
      IF (SELECT COUNT(*) FROM referrals WHERE referrer_id = referrer) < 50 THEN
        INSERT INTO referrals (referrer_id, referred_id, credited)
        VALUES (referrer, NEW.id, TRUE)
        ON CONFLICT (referred_id) DO NOTHING;
        -- Award 25 credits to both parties
        PERFORM add_credits(referrer, 25, 'referral');
        PERFORM add_credits(NEW.id, 25, 'referral');
        -- Update referred_by on the new user's profile
        UPDATE user_profiles SET referred_by = referrer WHERE id = NEW.id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (drop first to avoid duplicate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
