-- Local-only test of supabase/migrations/20260925_credit_reservations.sql.
-- Run against a throwaway Docker Postgres 16, never any other database:
--   docker run --rm -d --name kl-billing-test -e POSTGRES_PASSWORD=local -p 127.0.0.1:55440:5432 postgres:16
--   psql "postgresql://postgres:local@127.0.0.1:55440/postgres" -v ON_ERROR_STOP=1 -f tests/billing-local/credit-reservations.sql
--   docker rm -f kl-billing-test
\set ON_ERROR_STOP 1

-- Minimal Supabase stand-ins.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated; END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (id uuid PRIMARY KEY);
CREATE TABLE IF NOT EXISTS public.user_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance int NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.credit_txns (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount int NOT NULL,
  action text NOT NULL,
  ref_id text,
  created_at timestamptz DEFAULT now()
);

\ir ../../supabase/migrations/20260925_credit_reservations.sql

INSERT INTO auth.users VALUES ('00000000-0000-4000-8000-000000000001');
INSERT INTO public.user_credits (user_id, balance) VALUES ('00000000-0000-4000-8000-000000000001', 5);

DO $$
DECLARE
  u uuid := '00000000-0000-4000-8000-000000000001';
  bal int;
  n int;
BEGIN
  ASSERT reserve_credits(u, 'op-1', 3) = 'ok';
  SELECT balance INTO bal FROM user_credits WHERE user_id = u; ASSERT bal = 2, 'reserve holds 3';

  ASSERT reserve_credits(u, 'op-1', 3) = 'ok', 'same reserve is idempotent';
  SELECT balance INTO bal FROM user_credits WHERE user_id = u; ASSERT bal = 2, 'no double hold';

  ASSERT reserve_credits(u, 'op-1', 4) = 'reservation_conflict';

  ASSERT capture_credits(u, 'op-1', 1) = 'ok';
  SELECT balance INTO bal FROM user_credits WHERE user_id = u; ASSERT bal = 4, 'capture 1 refunds 2';

  ASSERT capture_credits(u, 'op-1', 1) = 'ok', 'same capture is idempotent';
  SELECT balance INTO bal FROM user_credits WHERE user_id = u; ASSERT bal = 4, 'no double refund';

  ASSERT capture_credits(u, 'op-1', 2) = 'already_captured';
  ASSERT release_credits(u, 'op-1') = 'already_captured';
  ASSERT reserve_credits(u, 'op-1', 3) = 'already_captured';

  ASSERT reserve_credits(u, 'op-2', 2) = 'ok';
  ASSERT capture_credits(u, 'op-2', 3) = 'over_reservation';
  ASSERT release_credits(u, 'op-2') = 'ok';
  SELECT balance INTO bal FROM user_credits WHERE user_id = u; ASSERT bal = 4, 'release restores';
  ASSERT release_credits(u, 'op-2') = 'ok', 'double release is a no-op';
  SELECT balance INTO bal FROM user_credits WHERE user_id = u; ASSERT bal = 4, 'no double release refund';
  ASSERT capture_credits(u, 'op-2', 0) = 'already_released';

  ASSERT reserve_credits(u, 'op-3', 99) = 'insufficient_credits';
  ASSERT capture_credits(u, 'missing', 0) = 'not_reserved';
  ASSERT release_credits(u, 'missing') = 'not_reserved';

  SELECT count(*) INTO n FROM credit_reservations WHERE user_id = u; ASSERT n = 2, 'op-3 left no row';
  SELECT coalesce(sum(amount), 0) INTO n FROM credit_txns WHERE user_id = u; ASSERT n = -1, 'ledger nets to the 1 captured credit';
  RAISE NOTICE 'credit_reservations: all assertions passed';
END $$;
