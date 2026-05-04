-- ============================================================
-- Shorten the free Pro trial from 30 days to 7 days
-- Run in Supabase Dashboard > SQL Editor
--
-- Context: original 30-day trial (migration 011) granted essentially
-- the entire admissions cycle for free, suppressing conversion. New
-- shape is a 7-day trial with no card required, then a paywall on
-- day 8. The expiry check (`check_trial_expiry` in 011) is duration-
-- agnostic and does not need to change. Existing users keep their
-- already-stamped `trial_ends_at`; this only affects new signups.
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer UUID;
BEGIN
  ref_code := NEW.raw_user_meta_data->>'referral_code';

  -- Create user profile with pro role and 7-day trial
  BEGIN
    INSERT INTO user_profiles (id, email, full_name, role, trial_ends_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      'pro',
      NOW() + INTERVAL '7 days'
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), user_profiles.full_name);
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'handle_new_user PROFILE failed for %: % %', NEW.id, SQLERRM, SQLSTATE;
  END;

  -- Create initial credits (300 free)
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

-- Recreate trigger to point at the new function definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
