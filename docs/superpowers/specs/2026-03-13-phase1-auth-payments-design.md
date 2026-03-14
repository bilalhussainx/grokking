# Phase 1: Auth, Subscriptions & Credit System — Design Spec

## Goal

Replace the existing custom JWT authentication with Supabase Auth (Google OAuth), add Paddle-powered subscription billing with three tiers (Free/Pro/Teams), and implement a credit-based metering system that gates AI features while providing a generous free trial experience. This is the foundation phase — all subsequent platform phases (VPS deployment, voice agents, RAG, course expansion) depend on users and billing being in place.

## Context

Grokking is a Next.js 14 learning platform with 13 courses, an AI coaching system (Kimi K2 + Gemini fallback), ElevenLabs/Deepgram voice agents, a Monaco code editor, and a classroom management system. The platform currently has:

- Custom JWT auth (`src/lib/auth.ts`) with bcryptjs password hashing, `app_users` table, and student/teacher/admin roles
- Supabase PostgreSQL backend with RLS policies, realtime, and a `user_profiles` table
- 37 API routes including AI coaching, grading, voice sessions, interviews, and classrooms
- No payment processing, no subscription system, no usage metering

## Architecture

Supabase Auth replaces custom JWT for all authentication. Paddle acts as Merchant of Record for subscription billing and global tax compliance. A credit system meters AI feature usage with atomic PostgreSQL operations.

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
│                                                              │
│  /login ─── Google OAuth ──→ Supabase Auth                  │
│  /pricing ─ Paddle Checkout Overlay                          │
│  /course/* ─ Credit check middleware                         │
│  /settings ─ Manage subscription, view credits               │
└──────────────┬───────────────────────────┬──────────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────┐   ┌──────────────────────────────────┐
│   Supabase Auth      │   │   Paddle (Merchant of Record)    │
│                      │   │                                   │
│  Google OAuth 2.0    │   │  Checkout overlay                │
│  Session cookies     │   │  Subscription lifecycle          │
│  50K MAU free        │   │  Tax compliance (global)         │
│  user_profiles link  │   │  Webhooks → /api/webhooks/paddle │
└──────────┬───────────┘   └──────────────┬────────────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Supabase PostgreSQL                          │
│                                                              │
│  user_profiles ── role, display_name, avatar_url, ref_code  │
│  subscriptions ── paddle_sub_id, plan, status, period_end   │
│  user_credits  ── balance (atomic decrement via RPC)         │
│  credit_txns   ── action, amount, timestamp (audit log)     │
│  referrals     ── referrer_id, referred_id, credited        │
│  lesson_progress ── (existing, unchanged)                    │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Auth**: Supabase Auth with `@supabase/ssr` for Next.js App Router server-side session handling
- **Payments**: Paddle Billing (`@paddle/paddle-js` for checkout overlay, webhook signature verification via `@paddle/paddle-node-sdk`)
- **Database**: Supabase PostgreSQL (existing) with new tables and RPC functions
- **Frontend**: Existing Next.js 14 + Tailwind + shadcn/ui components (Button, Card, Input, Label, Badge from 21st.dev)

---

## 1. Authentication

### 1.1 Migration from Custom JWT to Supabase Auth

The existing custom JWT system (`src/lib/auth.ts`, `jose`, `bcryptjs`) is replaced entirely by Supabase Auth. Supabase handles:

- OAuth provider flows (Google)
- Session token issuance and refresh
- HTTP-only cookie management via `@supabase/ssr`
- Email/password registration (retained as secondary option)

### 1.2 Auth Flow

1. User clicks "Continue with Google" on `/login`
2. `supabase.auth.signInWithOAuth({ provider: 'google' })` redirects to Google consent screen
3. Google redirects back to `/auth/callback` route which exchanges the code for a session
4. Supabase sets HTTP-only session cookies automatically
5. A PostgreSQL trigger on `auth.users` INSERT creates a corresponding `user_profiles` row with `role = 'student'` and 50 free credits

### 1.3 Middleware

A Next.js middleware at `src/middleware.ts` runs on every request:

- Reads Supabase session from cookies using `createServerClient()`
- Public routes (`/`, `/login`, `/signup`, `/pricing`, `/auth/callback`, `/ref/*`) pass through
- Protected routes redirect unauthenticated users to `/login`
- API routes return 401 for unauthenticated requests
- Credit-gated API routes (AI coach, hints, grading, interviews) check credit balance before processing

### 1.4 Roles

| Role | Description | Access |
|------|-------------|--------|
| `student` | Default on signup | Free courses, credit-gated AI features |
| `pro` | Active Paddle subscription | All courses, 500 credits/mo, voice agents, certificates |
| `teacher` | Manually assigned by admin or via existing `TEACHER_SECRET_KEY` validation (preserved from current system) | Pro features + classroom management |
| `admin` | Manual assignment | Everything + user management panel |

Role is stored in `user_profiles.role` and checked via RLS policies and server-side middleware.

---

## 2. Subscription Tiers

### 2.1 Pricing

| Tier | Price | Credits | Key Features |
|------|-------|---------|--------------|
| **Free** | $0 forever | 50 on signup (one-time) | 3 courses (Python, JS, Web Dev), code editor, auto-grading, Discord |
| **Pro** | $15/mo or $144/yr | 500/month (auto-refresh) | All 13+ courses, AI coach voice, mock interviews, certificates, voice selection |
| **Teams** | $10/seat/mo (min 5) | 500/seat/month | Pro + classrooms, student dashboard, homework, team analytics, admin controls |

### 2.2 Free Tier Courses

The free tier includes full access to 3 courses selected for breadth and engagement:
- Python Fundamentals
- JavaScript Fundamentals
- Web Development

All other courses show a preview (title, module list, first lesson) but require Pro to access lesson content.

---

## 3. Credit System

### 3.1 Credit Costs

| Action | Credits | Approximate Real Cost |
|--------|---------|----------------------|
| AI Coach text message | 1 | ~$0.004 (Kimi K2) |
| AI Coach voice (per minute) | 3 | ~$0.013 (Deepgram) |
| Code hint (progressive) | 1 | ~$0.004 |
| Auto-grade submission | 2 | ~$0.008 |
| Mock interview (30 min session) | 50 (first interview free) | ~$0.47 |
| Interview scoring report | 5 | ~$0.02 |
| AI lesson generation | 10 | ~$0.04 |

### 3.2 Credit Economics

- Cost to serve 500 credits (Pro user/month): ~$2-3
- Revenue per Pro user: $15/mo
- **Gross margin: ~80%**

### 3.3 Credit Deduction (Atomic)

Credits are deducted via a PostgreSQL RPC function that performs an atomic decrement:

```sql
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount INT, p_action TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INT;
BEGIN
  SELECT balance INTO current_balance FROM user_credits WHERE user_id = p_user_id FOR UPDATE;
  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  UPDATE user_credits SET balance = balance - p_amount, updated_at = NOW() WHERE user_id = p_user_id;
  INSERT INTO credit_txns (user_id, amount, action, ref_id, created_at) VALUES (p_user_id, -p_amount, p_action, NULL, NOW());
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

The `FOR UPDATE` row lock prevents race conditions when multiple AI requests fire simultaneously.

### 3.4 Promotional Credits

| Trigger | Credits | Conditions |
|---------|---------|------------|
| Signup bonus | 50 | One-time, on email verification |
| Referral (both sides) | 25 each | On referred user's email verification. Max 50 referrals per user (cap: 1,250 credits) to prevent gaming. |
| Complete a course | 10 | Once per course |
| 7-day login streak | 5 | Resets on missed day. Updated via `update_login_streak()` RPC called on each authenticated page load (debounced to once per day by checking `last_login_date`). When streak hits 7, awards 5 credits and resets streak to 0. |

---

## 4. Payment Processing — Paddle

### 4.1 Why Paddle

Paddle acts as Merchant of Record: it handles global VAT, GST, and sales tax compliance automatically. Fee: 5% + $0.50 per transaction (all-inclusive). On a $15/mo subscription, that's ~$1.25/transaction. Supports Visa, Mastercard, Google Pay, PayPal, Apple Pay.

### 4.2 Integration

- **Checkout**: Paddle.js overlay opens on the current page (no redirect). Pass `customData: { userId }` to link payment to Supabase user.
- **Webhooks**: `/api/webhooks/paddle` receives events, validates signature using Paddle's webhook secret, and updates database.
- **Subscription management**: Users manage billing (update card, cancel, view invoices) via Paddle's hosted customer portal — no custom billing UI needed.

### 4.3 Webhook Events

| Event | Handler Action |
|-------|---------------|
| `subscription.created` | Create `subscriptions` row with `status = 'trialing'` or `'active'` |
| `subscription.activated` | Set `user_profiles.role = 'pro'`, allocate 500 credits |
| `subscription.updated` | Update plan tier, billing cycle |
| `subscription.canceled` | Mark `cancel_at_period_end = true`, downgrade to `student` at period end |
| `subscription.past_due` | Set `status = 'past_due'`, 3-day grace period, then suspend AI features |
| `transaction.completed` | For monthly plans: add 500 credits. For annual plans: ignored (annual credit refresh handled by Supabase cron — see below) |

**Annual Subscription Credit Refresh:** Annual subscribers pay once per year but receive 500 credits monthly. A Supabase pg_cron job runs daily, checks for active annual subscriptions, and allocates 500 credits on the monthly anniversary of their subscription start date (tracked via `subscriptions.created_at` day-of-month).

### 4.4 Webhook Security

Paddle webhook signature verification:
1. Read raw request body (not parsed JSON)
2. Extract `Paddle-Signature` header (contains `ts` and `h1`)
3. Construct signed payload: `ts:rawBody`
4. Compute HMAC-SHA256 with webhook secret
5. Compare to `h1` value (constant-time comparison)
6. Reject if timestamp is older than 5 minutes

---

## 5. Database Schema

### 5.1 New Tables

```sql
-- User credits balance
CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 50,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transaction log (audit trail)
CREATE TABLE credit_txns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL, -- negative = deduction, positive = addition
  action TEXT NOT NULL, -- 'coach_text', 'coach_voice', 'hint', 'grade', 'interview', 'signup_bonus', 'referral', 'monthly_refresh'
  ref_id TEXT, -- optional reference to the specific AI request or event for debugging
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paddle subscription state
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paddle_subscription_id TEXT UNIQUE NOT NULL,
  paddle_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'pro', -- 'pro' | 'teams'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused'
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral tracking
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referred_id UUID NOT NULL REFERENCES auth.users(id),
  credited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referred_id) -- each user can only be referred once
);
```

### 5.2 Modified Tables

```sql
-- Add columns to existing user_profiles
-- NOTE: Existing rows will safely receive defaults. No data migration needed — existing
-- user_profiles rows get role='student' which is correct for all current users.
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS login_streak INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_login_date DATE,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
```

### 5.2.1 Migration of Existing Users

Existing users in `app_users` (custom JWT) need a one-time migration:
1. For each `app_users` row, check if a matching `auth.users` row exists (by email)
2. If not, create the `auth.users` entry via Supabase admin API (sets up email/password auth)
3. Link the existing `user_profiles` row to the new `auth.users.id`
4. Existing bcrypt password hashes are NOT migrated — users must reset password or use Google OAuth on first login after migration
5. Existing sessions (JWT cookies) are invalidated — all users must re-login after deployment
6. This migration runs once as a Node.js script, NOT as a SQL migration

### 5.3 RLS Policies

- `user_credits`: Users can read their own balance. Only service role can modify (via RPC).
- `credit_txns`: Users can read their own transactions. Insert only via service role.
- `subscriptions`: Users can read their own subscription. Only service role can modify (via webhook handler).
- `referrals`: Users can read referrals where they are the referrer. Insert only via service role.

### 5.4 Database Trigger — Auto-Create Profile on Signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, role, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'student',
    LOWER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8))
  );
  INSERT INTO user_credits (user_id, balance) VALUES (NEW.id, 50);
  INSERT INTO credit_txns (user_id, amount, action) VALUES (NEW.id, 50, 'signup_bonus');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 6. File Structure

### 6.1 New Files

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Auth session check + route protection |
| `src/app/login/page.tsx` | Google OAuth + email/password login (shadcn UI) |
| `src/app/signup/page.tsx` | Signup with Google + email (shadcn UI) |
| `src/app/auth/callback/route.ts` | OAuth callback handler (exchange code for session) |
| `src/app/pricing/page.tsx` | 3-tier pricing page with Paddle checkout |
| `src/app/settings/page.tsx` | Account settings, subscription management, credit balance |
| `src/app/ref/[code]/page.tsx` | Referral landing page (stores code in cookie, redirects to signup) |
| `src/app/api/webhooks/paddle/route.ts` | Paddle webhook handler (signature validation + state updates) |
| `src/app/api/credits/check/route.ts` | Check credit balance (GET) |
| `src/app/api/credits/deduct/route.ts` | Deduct credits atomically (POST, internal use) |
| `src/lib/supabase-auth.ts` | createBrowserClient + createServerClient helpers |
| `src/lib/credits.ts` | `deductCredits()`, `getBalance()`, `addCredits()` wrappers |
| `src/lib/paddle.ts` | Paddle webhook signature verification + checkout helpers |
| `src/contexts/AuthContext.tsx` | React context for user session, role, credits |
| `src/components/ui/button.tsx` | shadcn Button component |
| `src/components/ui/card.tsx` | shadcn Card component |
| `src/components/ui/input.tsx` | shadcn Input component |
| `src/components/ui/label.tsx` | shadcn Label component |
| `src/components/ui/badge.tsx` | shadcn Badge component |
| `src/components/auth/LoginForm.tsx` | Login form with Google OAuth button |
| `src/components/auth/CreditBadge.tsx` | Credit balance display for nav bar |
| `src/components/pricing/PricingCards.tsx` | Pricing tier cards component |
| `supabase/migrations/002_auth_credits.sql` | All schema changes in one migration |

### 6.2 Modified Files

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Wrap with AuthContext provider, add Supabase session listener |
| `src/app/providers.tsx` | Add AuthProvider + CreditProvider |
| `src/app/page.tsx` | Add login/pricing CTAs, show user state |
| `src/components/layout/TopNav.tsx` | User avatar dropdown, credit badge, upgrade button |
| `src/app/api/ai/coach/route.ts` | Add `deductCredits(userId, 1, 'coach_text')` before processing |
| `src/app/api/ai/chat/route.ts` | Replace custom JWT auth with Supabase session check + credit deduction |
| `src/app/api/ai/hint/route.ts` | Replace custom JWT auth + add credit deduction (1 credit) |
| `src/app/api/ai/grade/route.ts` | Replace custom JWT auth + add credit deduction (2 credits) |
| `src/app/api/ai/supervise/route.ts` | Replace custom JWT auth with Supabase session check |
| `src/app/api/ai/generate-lesson/route.ts` | Replace auth + add credit deduction (10 credits) |
| `src/app/api/ai/tts/route.ts` | Replace auth with Supabase session check |
| `src/app/api/ai/voice-agent/route.ts` | Replace auth + add credit deduction (3 credits/min) |
| `src/app/api/ai/voice-session/route.ts` | Replace auth + add credit deduction |
| `src/app/api/ai/prompt-lab/route.ts` | Replace auth with Supabase session check |
| `src/app/api/ai/writing/*/route.ts` | Replace auth across all 5 writing pipeline routes |
| `src/app/api/ai/session-chat/route.ts` | Replace auth with Supabase session check |
| `src/app/api/interviews/plan/route.ts` | Replace auth + add credit check (50 credits, first free) |
| `src/app/api/interviews/score/route.ts` | Replace auth + add credit deduction (5 credits) |
| `src/app/api/classrooms/*/route.ts` | Replace auth across all 6 classroom routes |
| `src/app/api/sessions/*/route.ts` | Replace auth across all 4 session routes |
| `src/app/api/documents/*/route.ts` | Replace auth across all 3 document routes |
| `src/app/api/progress/route.ts` | Replace auth with Supabase session check |

**Auth migration pattern for all API routes:** Every route that currently calls `verifyAuth()` or imports from `@/lib/auth` gets the same change: replace with `createServerClient()` from `@/lib/supabase-auth`, call `supabase.auth.getUser()`, return 401 if no session. This is a mechanical find-and-replace across ~32 routes.
| `package.json` | Add `@paddle/paddle-js`, `@paddle/paddle-node-sdk`, `class-variance-authority`, `@radix-ui/react-slot`, `@radix-ui/react-label` |

### 6.3 Removed Files

| File | Reason |
|------|--------|
| `src/lib/auth.ts` | Custom JWT replaced by Supabase Auth |
| `src/app/api/auth/signup/route.ts` | Supabase handles registration |
| `src/app/api/auth/login/route.ts` | Supabase handles login |
| `src/app/api/auth/logout/route.ts` | Supabase handles logout |
| `src/app/api/auth/me/route.ts` | Replaced by Supabase session |

---

## 7. Growth Mechanics

### 7.1 Referral System

1. Each user gets an auto-generated 8-character referral code on signup
2. Share link: `grokking.dev/ref/[CODE]`
3. `/ref/[code]` page stores code in a 30-day cookie and redirects to `/signup`
4. On signup, if referral cookie exists, create `referrals` row
5. After email verification, credit both referrer and referred user 25 credits each

### 7.2 Conversion Triggers

| Trigger | UX Action |
|---------|-----------|
| Credits reach 0 | Soft paywall modal: "Upgrade to Pro for unlimited AI coaching" with pricing CTA |
| Complete a free course | Banner: "Unlock 10 more courses with Pro" + 10 bonus credits |
| First mock interview | Free (tracked via `credit_txns` — if no row with `action = 'interview'` exists for this user, skip deduction), subsequent interviews cost 50 credits |
| 7-day login streak | Toast: "You earned 5 bonus credits! Keep your streak going with Pro" |
| Browse locked course | Preview page with module list, first lesson visible, Paddle checkout CTA |

### 7.3 14-Day Pro Trial (Platform-Managed)

New signups can optionally start a 14-day Pro trial managed locally (not via Paddle subscription):
- On trial start: set `user_profiles.role = 'pro'` and `user_profiles.trial_ends_at = NOW() + 14 days`
- Allocate 100 trial credits (not the full 500 — enough to experience features, not enough to avoid converting)
- Trial is NOT a Paddle subscription — no payment method required
- At day 12: in-app banner "Your trial ends in 2 days — upgrade to keep Pro access"
- At day 14: a Supabase scheduled function checks `trial_ends_at`, reverts `role = 'student'` if no active Paddle subscription exists
- Unused trial credits are NOT revoked on downgrade — they remain in `user_credits.balance` and drain naturally. This is generous and builds goodwill.
- If user upgrades during trial: Paddle subscription created, role stays `pro`, monthly credit refresh begins

---

## 8. Error Handling

| Scenario | Handling |
|----------|---------|
| Paddle webhook signature invalid | Return 400, log attempt, do not modify database |
| Paddle webhook duplicate delivery | Idempotent handlers — check subscription status before updating |
| Credit deduction race condition | `FOR UPDATE` row lock in PostgreSQL RPC prevents double-spend |
| Google OAuth failure | Show error on login page with "Try again" button |
| Supabase session expired | Middleware detects, refreshes token automatically via `@supabase/ssr` |
| Payment method declined | Paddle handles retry logic, sends `subscription.past_due` webhook |
| User cancels mid-billing-cycle | Access continues until `current_period_end`, then role reverts to `student` |
| `subscription.past_due` expiry | Middleware checks `subscriptions.status` — if `past_due` and `updated_at` older than 3 days, AI features are suspended (credit deductions return false). No separate scheduled function needed. |
| Credit balance cap | Maximum balance is 5,000 credits. Additions beyond cap are silently clamped. Prevents unbounded liability from referrals/streaks. |

---

## 9. Environment Variables

New variables required in `.env.local`:

```
# Supabase (existing — already configured)
NEXT_PUBLIC_SUPABASE_URL=https://irnxkvjhrzfqboucufdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Paddle
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET=...
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=...
NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY=...
NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL=...
NEXT_PUBLIC_PADDLE_PRICE_ID_TEAMS=...

# Paddle environment (sandbox for dev, live for production)
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox

# Google OAuth (configured in Supabase dashboard, not in env)
```

---

## 10. Testing Strategy

| Area | Test Approach |
|------|---------------|
| Auth flow | Manual: Google OAuth redirect → callback → session created → profile row exists |
| Credit deduction | Unit test the RPC function with concurrent calls to verify atomicity |
| Paddle webhooks | Use Paddle's webhook simulator to send test events to `/api/webhooks/paddle` |
| Subscription lifecycle | Test full cycle: create → activate → renew → cancel → expire |
| Referral system | Create two test accounts, verify credits awarded to both |
| RLS policies | Verify users cannot read other users' credits or subscriptions |
| Middleware | Test that protected routes redirect, public routes pass through |

---

## Non-Goals (Deferred to Later Phases)

- VPS deployment, PM2, Redis, BullMQ, Nginx (Phase 2)
- Deepgram voice migration (Phase 3)
- RAG memory, vector embeddings, recommendations (Phase 4)
- Course expansion, voice selection, avatars (Phase 5)
- Marketing automation, Discord bot, SEO tooling (Phase 6)
