-- End the signup Pro trial on time (2026-09-25). NOT applied to production
-- until the founder approves.
--
-- The signup trial is a user_subscriptions row (status 'trialing', no
-- stripe_subscription_id, current_period_end = signup + 7 days). The old view
-- treated every 'trialing' row as Pro with no end date, so the trial never
-- expired for tier-gate. Stripe-managed subscriptions (stripe_subscription_id
-- set) keep their existing rules; Stripe itself moves them off 'trialing'.
-- Same columns as 20260422_guest_trial.sql, so CREATE OR REPLACE is valid.
CREATE OR REPLACE VIEW v_user_tier AS
SELECT
  u.id AS user_id,
  CASE
    WHEN u.is_anonymous THEN 'guest'
    WHEN s.stripe_subscription_id IS NOT NULL AND s.status IN ('active', 'trialing') AND s.plan = 'pro' THEN 'pro'
    WHEN s.stripe_subscription_id IS NULL AND s.status = 'trialing' AND s.plan = 'pro' AND s.current_period_end > now() THEN 'pro'
    WHEN s.stripe_subscription_id IS NULL AND s.status = 'active' AND s.plan = 'pro' THEN 'pro'
    WHEN s.status = 'canceled' AND s.plan = 'pro' AND s.current_period_end > now() THEN 'pro'
    ELSE 'free'
  END AS tier,
  u.is_anonymous,
  s.plan,
  s.status AS subscription_status,
  s.current_period_end
FROM auth.users u
LEFT JOIN user_subscriptions s ON s.user_id = u.id;
COMMENT ON VIEW v_user_tier IS
  'Single source of truth for tier decisions. Read by src/lib/cc/tier-gate.ts. Do not inline this logic in route handlers.';
