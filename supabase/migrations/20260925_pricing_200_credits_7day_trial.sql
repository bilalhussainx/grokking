-- Pricing 2026-09-25 (founder): Free = 200 credits once at signup; Pro trial = 7 days.
-- Redefines handle_new_user (from 012) and create_signup_pro_trial (from 20260502,
-- which had re-introduced a longer trial after 013). New signups only; existing
-- balances and trials are unchanged. Additive and idempotent (CREATE OR REPLACE).
-- NOT applied to production until the founder approves.

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

  -- Create initial credits (200 free, once)
  BEGIN
    INSERT INTO user_credits (user_id, balance) VALUES (NEW.id, 200)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO credit_txns (user_id, amount, action)
    VALUES (NEW.id, 200, 'signup_bonus');
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

CREATE OR REPLACE FUNCTION public.create_signup_pro_trial()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Skip anonymous (guest) users — they get the 'guest' tier, not Pro.
  IF COALESCE(NEW.is_anonymous, false) THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.user_subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end
  )
  VALUES (
    NEW.id,
    'pro',
    'trialing',
    now(),
    now() + INTERVAL '7 days',
    false
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_trial ON auth.users;
CREATE TRIGGER on_auth_user_created_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_signup_pro_trial();
