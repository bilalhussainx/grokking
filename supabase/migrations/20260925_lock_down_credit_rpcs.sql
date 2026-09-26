-- Lock down credit RPCs (security, 2026-09-25). NOT applied to production
-- until the founder approves.
--
-- add_credits / deduct_credits are SECURITY DEFINER and accept any
-- p_user_id. No earlier migration revoked Supabase's default EXECUTE grants,
-- and a read-only production probe confirmed the public anon key can execute
-- these functions (get_credit_balance returned a value). Anyone could mint up
-- to 5000 credits for, or drain, any account by user id. All legitimate callers are
-- server routes using the service role (src/lib/credits.ts, ensure-profile,
-- invite/redeem, call/status); the three language refund routes were moved to
-- addCredits() in the same commit.
REVOKE EXECUTE ON FUNCTION public.add_credits(uuid, int, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.deduct_credits(uuid, int, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_credits(uuid, int, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.deduct_credits(uuid, int, text, text) TO service_role;

-- Read/maintenance helpers the signed-in browser calls with its own session
-- (AuthContext). Keep them for authenticated users (anonymous guests also use
-- the authenticated role); remove them from the unauthenticated anon key.
REVOKE EXECUTE ON FUNCTION public.get_credit_balance(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_trial_expiry(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_login_streak(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_plan(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_credit_balance(uuid), public.check_trial_expiry(uuid),
  public.update_login_streak(uuid), public.get_user_plan(uuid) TO authenticated, service_role;
