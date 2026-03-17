-- ============================================================
-- Fix RLS INSERT policies + trigger for signup flow
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Allow authenticated users to INSERT their own profile row
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Allow authenticated users to INSERT their own credits row
CREATE POLICY "Users can insert own credits"
  ON user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Allow authenticated users to UPDATE own credits (needed for upsert)
CREATE POLICY "Users can update own credits"
  ON user_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Allow authenticated users to INSERT credit transactions
CREATE POLICY "Users can insert own credit txns"
  ON credit_txns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Fix add_credits to accept optional ref_id parameter
--    (invite redeem passes p_ref_id which was causing silent failure)
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_amount INT, p_action TEXT, p_ref_id TEXT DEFAULT NULL)
RETURNS INT AS $$
DECLARE
  new_balance INT;
BEGIN
  INSERT INTO user_credits (user_id, balance)
  VALUES (p_user_id, LEAST(p_amount, 5000))
  ON CONFLICT (user_id) DO UPDATE
  SET balance = LEAST(user_credits.balance + p_amount, 5000), updated_at = NOW()
  RETURNING balance INTO new_balance;

  INSERT INTO credit_txns (user_id, amount, action, ref_id, created_at)
  VALUES (p_user_id, p_amount, p_action, p_ref_id, NOW());

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Bulletproof trigger — uses only columns that definitely exist
--    and logs actual errors so we can debug
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer UUID;
BEGIN
  ref_code := NEW.raw_user_meta_data->>'referral_code';

  -- Create user profile
  BEGIN
    INSERT INTO user_profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      'student'
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), user_profiles.full_name);
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'handle_new_user PROFILE failed for %: % %', NEW.id, SQLERRM, SQLSTATE;
  END;

  -- Create initial credits
  BEGIN
    INSERT INTO user_credits (user_id, balance) VALUES (NEW.id, 50)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO credit_txns (user_id, amount, action)
    VALUES (NEW.id, 50, 'signup_bonus');
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'handle_new_user CREDITS failed for %: % %', NEW.id, SQLERRM, SQLSTATE;
  END;

  -- Process referral if provided
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
    RAISE LOG 'handle_new_user REFERRAL failed for %: % %', NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
