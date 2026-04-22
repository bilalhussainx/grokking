-- 20260422_guest_trial.sql
-- Guest-trial funnel infrastructure (plan: docs/superpowers/plans/2026-04-22-guest-trial-funnel.md)
-- Adds: guest_sessions_audit, v_user_tier, marketing_leads, plus indices to keep
-- is_anonymous filtering fast once the anon user population grows.

-- ============================================================
-- 1. Guest session audit
-- ============================================================
-- One row per anon user the first time we see them. Captures funnel timing
-- (landed → first tool → free signup → pro). Keyed on user_id so that if
-- the anon user upgrades, the same row tracks their journey end to end.
CREATE TABLE IF NOT EXISTS guest_sessions_audit (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  landed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  landing_path TEXT,
  first_tool_used TEXT,
  first_tool_at TIMESTAMPTZ,
  messages_sent INTEGER NOT NULL DEFAULT 0,
  schools_added INTEGER NOT NULL DEFAULT 0,
  essays_drafted INTEGER NOT NULL DEFAULT 0,
  upgraded_to_free_at TIMESTAMPTZ,
  upgraded_to_pro_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ
);

ALTER TABLE guest_sessions_audit ENABLE ROW LEVEL SECURITY;

-- Users read their own audit row. Service role reads/writes all (for cron/analytics).
DROP POLICY IF EXISTS "Users read own guest audit" ON guest_sessions_audit;
CREATE POLICY "Users read own guest audit"
  ON guest_sessions_audit FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own guest audit" ON guest_sessions_audit;
CREATE POLICY "Users insert own guest audit"
  ON guest_sessions_audit FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own guest audit" ON guest_sessions_audit;
CREATE POLICY "Users update own guest audit"
  ON guest_sessions_audit FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role manages guest audit" ON guest_sessions_audit;
CREATE POLICY "Service role manages guest audit"
  ON guest_sessions_audit FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- 2. Ensure user_subscriptions exists (Paddle billing table)
-- ============================================================
-- This table is also created by 20260326_billing.sql, but we recreate it
-- defensively so this migration can run standalone on databases that skipped
-- the billing migration. CREATE TABLE IF NOT EXISTS is a no-op if the table
-- already has its real definition.
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

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can read own subscription"
    ON user_subscriptions FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Service role can manage subscriptions"
    ON user_subscriptions FOR ALL
    USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 3. User-tier view
-- ============================================================
-- Cheap tier lookup used by tier-gate.ts. Keeps the "guest | free | pro"
-- decision in one place so app-layer quota logic never diverges from the DB.
CREATE OR REPLACE VIEW v_user_tier AS
SELECT
  u.id AS user_id,
  CASE
    WHEN u.is_anonymous THEN 'guest'
    WHEN s.status IN ('active', 'trialing') AND s.plan = 'pro' THEN 'pro'
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

-- ============================================================
-- 4. auth.users composite index for anon sweep
-- ============================================================
-- Supabase-hosted Postgres does not let end users ALTER auth.users.
-- If the anon population ever grows past ~10k, add this index via the
-- Supabase SQL editor logged in as the service-role/admin path, or file a
-- support ticket:
--
--   CREATE INDEX CONCURRENTLY idx_auth_users_anon_created
--     ON auth.users (is_anonymous, created_at)
--     WHERE is_anonymous IS TRUE;
--
-- Until then, the nightly anon-sweep will do a sequential scan on the
-- partial-indexed range, which is acceptable up to ~10k rows.

-- ============================================================
-- 5. Marketing leads (exit-intent email capture)
-- ============================================================
CREATE TABLE IF NOT EXISTS marketing_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL,          -- 'exit-intent' | 'footer' | 'waitlist' | etc.
  guest_user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  snapshot JSONB,                -- school list / essay titles at capture time
  resume_token TEXT,             -- signed token to restore the anon session
  email_sent_at TIMESTAMPTZ,
  converted_user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketing_leads_email ON marketing_leads (lower(email));
CREATE INDEX IF NOT EXISTS idx_marketing_leads_source ON marketing_leads (source, created_at DESC);

ALTER TABLE marketing_leads ENABLE ROW LEVEL SECURITY;

-- Only service role reads/writes. Leads are not exposed to end users.
DROP POLICY IF EXISTS "Service role manages leads" ON marketing_leads;
CREATE POLICY "Service role manages leads"
  ON marketing_leads FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- 6. Lifetime-usage counters on cc_student_profiles
-- ============================================================
-- Resume parsing has a lifetime cap (0 guest / 1 free / unlimited pro).
-- A small counter on the profile row is enough — no separate audit table.
ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS resume_parses_count INTEGER NOT NULL DEFAULT 0;

-- ============================================================
-- 7. Daily-usage helper views (read by tier-gate.ts)
-- ============================================================
-- Today's coach message count per user. tier-gate.ts joins this instead of
-- running GROUP BY ... date_trunc('day', ...) on every API request.
CREATE OR REPLACE VIEW v_coach_messages_today AS
SELECT
  p.user_id,
  COUNT(c.*)::INTEGER AS message_count
FROM cc_coach_conversations c
JOIN cc_student_profiles p ON p.id = c.student_id
WHERE c.created_at >= date_trunc('day', now())
  AND c.role = 'user'
  AND p.user_id IS NOT NULL
GROUP BY p.user_id;

COMMENT ON VIEW v_coach_messages_today IS
  'User-facing coach message count (role=user) in the current UTC day. Used by tier-gate coachMessagesPerDay enforcement.';
