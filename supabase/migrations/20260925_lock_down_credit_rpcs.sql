-- Lock down credit RPCs (security, 2026-09-25/26). Run once in the Supabase
-- SQL editor (whole file, one transaction).
--
-- Production facts, from a side-effect-free probe with the public anon key
-- (a nonexistent user id, so no row could be written):
--   * anon could EXECUTE deduct_credits and get_credit_balance, and reached
--     add_credits. These SECURITY DEFINER functions take any p_user_id, so
--     anyone could mint up to 5000 credits for, or drain, any account.
--   * add_credits exists twice: (uuid,int,text) from 002/006 and
--     (uuid,int,text,text DEFAULT NULL) from 007. Every 3-argument call was
--     ambiguous (PostgREST PGRST203; in SQL "function is not unique"), so
--     signup top-ups, refunds, invite credits and referral credits all failed.
--
-- Fix: drop the 3-arg overload (the 4-arg one has the same body plus ref_id
-- and serves 3-arg calls through its default), then revoke EXECUTE on every
-- overload of add_credits / deduct_credits from PUBLIC, anon and
-- authenticated, and grant it to service_role. All legitimate callers are
-- server routes using the service role.
BEGIN;

DROP FUNCTION IF EXISTS public.add_credits(uuid, integer, text);

DO $$
DECLARE f regprocedure;
BEGIN
  FOR f IN
    SELECT p.oid::regprocedure
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname IN ('add_credits', 'deduct_credits')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', f);
  END LOOP;
END $$;

-- Read/maintenance helpers the signed-in browser calls with its own session
-- (AuthContext). Keep them for authenticated users (anonymous guests also use
-- the authenticated role); remove them from the unauthenticated anon key.
DO $$
DECLARE f regprocedure;
BEGIN
  FOR f IN
    SELECT p.oid::regprocedure
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('get_credit_balance', 'check_trial_expiry', 'update_login_streak', 'get_user_plan')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', f);
  END LOOP;
END $$;

-- Verification (read-only): every row should read false for anon/authenticated
-- on add/deduct, and true for service_role.
SELECT r.rolname,
       p.oid::regprocedure AS fn,
       has_function_privilege(r.rolname, p.oid, 'EXECUTE') AS can_execute
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
CROSS JOIN (SELECT rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated', 'service_role')) r
WHERE n.nspname = 'public' AND p.proname IN ('add_credits', 'deduct_credits', 'get_credit_balance')
ORDER BY fn, r.rolname;

COMMIT;
