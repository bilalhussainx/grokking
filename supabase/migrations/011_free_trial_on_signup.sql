-- ============================================================
-- Grant 1-month free Pro trial to all new signups
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Update handle_new_user trigger to grant pro role + 30-day trial
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer UUID;
BEGIN
  ref_code := NEW.raw_user_meta_data->>'referral_code';

  -- Create user profile with pro role and 30-day trial
  BEGIN
    INSERT INTO user_profiles (id, email, full_name, role, trial_ends_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      'pro',
      NOW() + INTERVAL '30 days'
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), user_profiles.full_name);
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'handle_new_user PROFILE failed for %: % %', NEW.id, SQLERRM, SQLSTATE;
  END;

  -- Create initial credits (50 free)
  BEGIN
    INSERT INTO user_credits (user_id, balance) VALUES (NEW.id, 300)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO credit_txns (user_id, amount, action)
    VALUES (NEW.id, 300, 'signup_bonus');
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

-- 2. Function to check and expire trials (call periodically or on login)
CREATE OR REPLACE FUNCTION check_trial_expiry(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  user_role TEXT;
  trial_end TIMESTAMPTZ;
BEGIN
  SELECT role, trial_ends_at INTO user_role, trial_end
  FROM user_profiles WHERE id = p_user_id;

  -- If user is pro with an expired trial, downgrade to student
  IF user_role = 'pro' AND trial_end IS NOT NULL AND trial_end < NOW() THEN
    UPDATE user_profiles SET role = 'student' WHERE id = p_user_id;
    RETURN json_build_object('expired', true, 'previous_role', 'pro', 'new_role', 'student', 'trial_ended_at', trial_end);
  END IF;

  RETURN json_build_object('expired', false, 'role', user_role, 'trial_ends_at', trial_end);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
