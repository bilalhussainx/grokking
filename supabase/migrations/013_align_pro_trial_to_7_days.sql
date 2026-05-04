-- ============================================================
-- Align the auto-trial trigger to 7 days (matches migration 012)
-- Run in Supabase Dashboard > SQL Editor
--
-- Context: migration 011 sets a 7-day trial on user_profiles via
-- handle_new_user() — that part is correct. But there's a SECOND
-- trigger create_signup_pro_trial() (migration 20260502) that
-- writes a row into user_subscriptions with current_period_end =
-- NOW() + 30 days. After 012 shortened the user_profiles trial to
-- 7 days, the two stamps disagreed: a new signup got a 7-day Pro
-- role on user_profiles AND a 30-day trialing row on
-- user_subscriptions. This migration aligns both to 7 days.
--
-- This only affects new signups. Existing users keep their already-
-- stamped current_period_end. The backfill INSERT from 20260502
-- already ran when that migration was applied; we don't re-run it.
-- ============================================================

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
