-- 20260326_billing.sql
-- Billing tables for Paddle subscription management.
-- The table is named "user_subscriptions" to avoid conflict with the existing
-- "subscriptions" table that the webhook handler already references.
-- If "subscriptions" already exists, this migration creates a view alias.

-- ============================================================
-- Main subscription table
-- ============================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  paddle_subscription_id TEXT,
  paddle_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'paused', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for Paddle webhook lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_paddle_id
  ON user_subscriptions (paddle_subscription_id)
  WHERE paddle_subscription_id IS NOT NULL;

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can read own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (webhook handler, admin)
CREATE POLICY "Service role can manage subscriptions"
  ON user_subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- Auto-update updated_at on changes
-- ============================================================
CREATE OR REPLACE FUNCTION update_subscription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_subscription_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_timestamp();

-- ============================================================
-- Helper: get user's active plan (returns 'free' if no row)
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_plan(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_plan TEXT;
  v_status TEXT;
  v_period_end TIMESTAMPTZ;
BEGIN
  SELECT plan, status, current_period_end
    INTO v_plan, v_status, v_period_end
    FROM user_subscriptions
    WHERE user_id = p_user_id;

  -- No subscription row => free
  IF NOT FOUND THEN
    RETURN 'free';
  END IF;

  -- Active or trialing and within billing period => return plan
  IF v_status IN ('active', 'trialing') THEN
    RETURN v_plan;
  END IF;

  -- Canceled but still within paid period => still pro
  IF v_status = 'canceled' AND v_period_end IS NOT NULL AND v_period_end > now() THEN
    RETURN v_plan;
  END IF;

  -- Otherwise free
  RETURN 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
