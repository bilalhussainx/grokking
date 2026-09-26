-- Exactly-once credit settlement (agent spec §10.3). Additive; NOT applied
-- to production until the founder approves. Service-role only (RLS on, no policies).
CREATE TABLE IF NOT EXISTS public.credit_reservations (
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  operation_key text NOT NULL CHECK (length(operation_key) BETWEEN 1 AND 200),
  max_credits int NOT NULL CHECK (max_credits >= 0),
  final_credits int CHECK (final_credits >= 0 AND final_credits <= max_credits),
  state text NOT NULL CHECK (state IN ('reserved', 'captured', 'released')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, operation_key)
);
ALTER TABLE public.credit_reservations ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.reserve_credits(p_user_id uuid, p_key text, p_max int)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r credit_reservations; bal int;
BEGIN
  IF p_max < 0 THEN RETURN 'over_reservation'; END IF;
  SELECT * INTO r FROM credit_reservations WHERE user_id = p_user_id AND operation_key = p_key FOR UPDATE;
  IF FOUND THEN
    IF r.max_credits <> p_max THEN RETURN 'reservation_conflict'; END IF;
    RETURN CASE r.state WHEN 'reserved' THEN 'ok' WHEN 'captured' THEN 'already_captured' ELSE 'already_released' END;
  END IF;
  SELECT balance INTO bal FROM user_credits WHERE user_id = p_user_id FOR UPDATE;
  IF bal IS NULL OR bal < p_max THEN RETURN 'insufficient_credits'; END IF;
  UPDATE user_credits SET balance = balance - p_max, updated_at = now() WHERE user_id = p_user_id;
  INSERT INTO credit_reservations (user_id, operation_key, max_credits, state) VALUES (p_user_id, p_key, p_max, 'reserved');
  INSERT INTO credit_txns (user_id, amount, action, ref_id, created_at) VALUES (p_user_id, -p_max, 'reserve', p_key, now());
  RETURN 'ok';
EXCEPTION WHEN unique_violation THEN
  RETURN 'reservation_conflict';
END; $$;

CREATE OR REPLACE FUNCTION public.capture_credits(p_user_id uuid, p_key text, p_final int)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r credit_reservations;
BEGIN
  SELECT * INTO r FROM credit_reservations WHERE user_id = p_user_id AND operation_key = p_key FOR UPDATE;
  IF NOT FOUND THEN RETURN 'not_reserved'; END IF;
  IF r.state = 'captured' THEN RETURN CASE WHEN r.final_credits = p_final THEN 'ok' ELSE 'already_captured' END; END IF;
  IF r.state = 'released' THEN RETURN 'already_released'; END IF;
  IF p_final < 0 OR p_final > r.max_credits THEN RETURN 'over_reservation'; END IF;
  UPDATE credit_reservations SET state = 'captured', final_credits = p_final, updated_at = now()
    WHERE user_id = p_user_id AND operation_key = p_key;
  IF r.max_credits > p_final THEN
    UPDATE user_credits SET balance = balance + (r.max_credits - p_final), updated_at = now() WHERE user_id = p_user_id;
    INSERT INTO credit_txns (user_id, amount, action, ref_id, created_at)
      VALUES (p_user_id, r.max_credits - p_final, 'reserve_refund', p_key, now());
  END IF;
  RETURN 'ok';
END; $$;

CREATE OR REPLACE FUNCTION public.release_credits(p_user_id uuid, p_key text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r credit_reservations;
BEGIN
  SELECT * INTO r FROM credit_reservations WHERE user_id = p_user_id AND operation_key = p_key FOR UPDATE;
  IF NOT FOUND THEN RETURN 'not_reserved'; END IF;
  IF r.state = 'released' THEN RETURN 'ok'; END IF;
  IF r.state = 'captured' THEN RETURN 'already_captured'; END IF;
  UPDATE credit_reservations SET state = 'released', updated_at = now() WHERE user_id = p_user_id AND operation_key = p_key;
  IF r.max_credits > 0 THEN
    UPDATE user_credits SET balance = balance + r.max_credits, updated_at = now() WHERE user_id = p_user_id;
    INSERT INTO credit_txns (user_id, amount, action, ref_id, created_at) VALUES (p_user_id, r.max_credits, 'reserve_release', p_key, now());
  END IF;
  RETURN 'ok';
END; $$;

REVOKE ALL ON FUNCTION public.reserve_credits(uuid, text, int), public.capture_credits(uuid, text, int), public.release_credits(uuid, text) FROM PUBLIC, anon, authenticated;
