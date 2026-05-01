-- Add Stripe-side identifier columns to user_subscriptions so the Stripe
-- webhook can map events back to a user.
-- The Paddle columns stay in place — the two billing systems coexist
-- until the Stripe path is fully verified.

ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Webhook handlers look up a row by stripe_subscription_id; keep that fast.
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_id
  ON user_subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Some events (e.g. invoice.payment_succeeded for a non-subscription invoice)
-- arrive with a customer ID but no subscription ID; index that too.
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id
  ON user_subscriptions (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
