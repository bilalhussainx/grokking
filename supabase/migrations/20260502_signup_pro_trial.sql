-- Auto-create a 30-day Pro trial on every new (non-anonymous) signup so the
-- v_user_tier view (defined in 20260422_guest_trial.sql) returns 'pro' for
-- the trial window. Without this, marketing copy says "1 month Pro" but
-- /api/cc/me/tier returns 'free' from day 0 because the user_subscriptions
-- row never exists.
--
-- AUD-P3-002 in docs/reports/2026-05-02-openclaw-audit-result.md.
--
-- The Stripe webhook (src/app/api/billing/stripe/webhook/route.ts:103)
-- already calls upsertSubscription with on-conflict-do-update, so when the
-- user actually subscribes via checkout, this trial row is replaced
-- cleanly with the real Stripe-backed subscription.
--
-- Idempotent: trigger uses CREATE OR REPLACE FUNCTION + DROP/CREATE TRIGGER,
-- and the INSERT itself uses ON CONFLICT DO NOTHING so re-running on a user
-- who already has a row is a no-op.

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
    now() + INTERVAL '30 days',
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

-- Backfill: any existing user signed up in the last 30 days who has no
-- subscription row gets the same trial. After 30 days they fall back to
-- 'free' naturally because v_user_tier checks current_period_end.
INSERT INTO public.user_subscriptions (
  user_id,
  plan,
  status,
  current_period_start,
  current_period_end,
  cancel_at_period_end
)
SELECT
  u.id,
  'pro',
  'trialing',
  u.created_at,
  u.created_at + INTERVAL '30 days',
  false
FROM auth.users u
WHERE COALESCE(u.is_anonymous, false) = false
  AND u.created_at > now() - INTERVAL '30 days'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_subscriptions s WHERE s.user_id = u.id
  )
ON CONFLICT (user_id) DO NOTHING;
