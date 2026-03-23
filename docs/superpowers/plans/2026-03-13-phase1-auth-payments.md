# Phase 1: Auth, Subscriptions & Credit System — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace custom JWT auth with Supabase Auth (Google OAuth), add Paddle subscription billing, and implement credit-based AI feature metering.

**Architecture:** Supabase Auth handles all authentication (Google OAuth + email/password). Paddle processes payments as Merchant of Record. A PostgreSQL RPC function performs atomic credit deductions. Next.js middleware enforces auth on all protected routes.

**Tech Stack:** Next.js 14, Supabase Auth (`@supabase/ssr`), Paddle Billing (`@paddle/paddle-js`, `@paddle/paddle-node-sdk`), PostgreSQL (RPC functions, pg_cron), shadcn/ui components, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-13-phase1-auth-payments-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `supabase/migrations/002_auth_credits.sql` | New tables (user_credits, credit_txns, subscriptions, referrals), RPC functions, triggers |
| `src/lib/supabase-auth.ts` | createBrowserClient() and createServerClient() helpers for App Router |
| `src/lib/credits.ts` | deductCredits(), getBalance(), addCredits() wrappers calling Supabase RPC |
| `src/lib/paddle.ts` | Paddle webhook signature verification + checkout helpers |
| `src/lib/utils.ts` | cn() utility for shadcn/ui class merging |
| `src/middleware.ts` | Auth session check, route protection, credit-gate check |
| `src/app/auth/callback/route.ts` | OAuth callback — exchange code for session |
| `src/app/login/page.tsx` | Rewrite — Google OAuth + email/password via Supabase |
| `src/app/signup/page.tsx` | Rewrite — Google signup + email registration |
| `src/app/pricing/page.tsx` | 3-tier pricing page with Paddle checkout overlay |
| `src/app/settings/page.tsx` | Account settings, subscription management, credit balance |
| `src/app/ref/[code]/page.tsx` | Referral landing — stores code in cookie, redirects to signup |
| `src/app/api/webhooks/paddle/route.ts` | Paddle webhook handler (signature validation + DB updates) |
| `src/app/api/credits/balance/route.ts` | GET credit balance for authenticated user |
| `src/components/ui/button.tsx` | shadcn Button component |
| `src/components/ui/card.tsx` | shadcn Card component |
| `src/components/ui/input.tsx` | shadcn Input component |
| `src/components/ui/label.tsx` | shadcn Label component |
| `src/components/ui/badge.tsx` | shadcn Badge component |
| `src/components/auth/CreditBadge.tsx` | Credit balance display for TopNav |
| `src/components/pricing/PricingCards.tsx` | Pricing tier cards with Paddle checkout |

### Modified Files
| File | Change |
|------|--------|
| `package.json` | Add Paddle, shadcn deps |
| `src/contexts/AuthContext.tsx` | Replace custom JWT with Supabase session + credits |
| `src/app/providers.tsx` | Update AuthProvider usage |
| `src/app/layout.tsx` | Minor — ensure Providers wrapping is correct |
| `src/app/page.tsx` | Add auth-aware CTAs |
| `src/components/layout/TopNav.tsx` | Add CreditBadge, user avatar from Supabase, upgrade button |
| `src/app/api/ai/coach/route.ts` | Add auth check + credit deduction |
| `src/app/api/ai/hint/route.ts` | Add auth check + credit deduction |
| `src/app/api/ai/grade/route.ts` | Add auth check + credit deduction |
| `src/app/api/ai/chat/route.ts` | Replace auth pattern |
| `src/app/api/ai/supervise/route.ts` | Replace auth pattern |
| `src/app/api/ai/tts/route.ts` | Replace auth pattern |
| `src/app/api/ai/voice-agent/route.ts` | Replace auth + add credit deduction |
| `src/app/api/ai/voice-session/route.ts` | Replace auth + add credit deduction |
| `src/app/api/ai/generate-lesson/route.ts` | Replace auth + add credit deduction |
| `src/app/api/ai/prompt-lab/route.ts` | Replace auth pattern |
| `src/app/api/ai/session-chat/route.ts` | Replace auth pattern |
| `src/app/api/ai/writing/*/route.ts` | Replace auth across 5 routes |
| `src/app/api/interviews/plan/route.ts` | Replace auth + credit check (50, first free) |
| `src/app/api/interviews/score/route.ts` | Replace auth + credit deduction (5) |
| `src/app/api/classrooms/*/route.ts` | Replace auth across 6 routes |
| `src/app/api/sessions/*/route.ts` | Replace auth across 4 routes |
| `src/app/api/documents/*/route.ts` | Replace auth across 3 routes |
| `src/app/api/progress/route.ts` | Replace auth pattern |

### Removed Files
| File | Reason |
|------|--------|
| `src/lib/auth.ts` | Custom JWT replaced by Supabase Auth |
| `src/app/api/auth/signup/route.ts` | Supabase handles registration |
| `src/app/api/auth/login/route.ts` | Supabase handles login |
| `src/app/api/auth/logout/route.ts` | Supabase handles logout |
| `src/app/api/auth/me/route.ts` | Replaced by Supabase session |

---

## Chunk 1: Database Schema & Core Libraries

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Paddle and shadcn dependencies**

```bash
npm install @paddle/paddle-js @paddle/paddle-node-sdk class-variance-authority @radix-ui/react-slot @radix-ui/react-label clsx tailwind-merge
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('@paddle/paddle-js'); console.log('paddle-js OK')"
node -e "require('class-variance-authority'); console.log('cva OK')"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Paddle, shadcn/ui dependencies"
```

---

### Task 2: Database Migration — Tables, RPC Functions, Triggers

**Files:**
- Create: `supabase/migrations/002_auth_credits.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- ============================================================
-- Phase 1: Auth, Credits & Subscriptions Migration
-- ============================================================

-- 1. Modify user_profiles — add new columns
-- Drop the existing CHECK constraint on role that only allows 'student','teacher','admin'
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS login_streak INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_login_date DATE,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
-- Add new CHECK that includes 'pro' role
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('student', 'pro', 'teacher', 'admin'));

-- 2. User credits balance
CREATE TABLE IF NOT EXISTS user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 50,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Credit transaction log (audit trail)
CREATE TABLE IF NOT EXISTS credit_txns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  action TEXT NOT NULL,
  ref_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE credit_txns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credit transactions"
  ON credit_txns FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Paddle subscription state
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paddle_subscription_id TEXT UNIQUE NOT NULL,
  paddle_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'pro',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 5. Referral tracking
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referred_id UUID NOT NULL REFERENCES auth.users(id),
  credited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referred_id)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id);

-- 6. Atomic credit deduction RPC
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount INT, p_action TEXT, p_ref_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INT;
BEGIN
  SELECT balance INTO current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN FALSE;
  END IF;

  UPDATE user_credits
  SET balance = balance - p_amount, updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO credit_txns (user_id, amount, action, ref_id, created_at)
  VALUES (p_user_id, -p_amount, p_action, p_ref_id, NOW());

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Add credits RPC (capped at 5000, race-condition safe with INSERT ON CONFLICT)
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_amount INT, p_action TEXT)
RETURNS INT AS $$
DECLARE
  new_balance INT;
BEGIN
  INSERT INTO user_credits (user_id, balance)
  VALUES (p_user_id, LEAST(p_amount, 5000))
  ON CONFLICT (user_id) DO UPDATE
  SET balance = LEAST(user_credits.balance + p_amount, 5000), updated_at = NOW()
  RETURNING balance INTO new_balance;

  INSERT INTO credit_txns (user_id, amount, action, created_at)
  VALUES (p_user_id, p_amount, p_action, NOW());

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Get credit balance RPC
CREATE OR REPLACE FUNCTION get_credit_balance(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  bal INT;
BEGIN
  SELECT balance INTO bal FROM user_credits WHERE user_id = p_user_id;
  RETURN COALESCE(bal, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Login streak update RPC
CREATE OR REPLACE FUNCTION update_login_streak(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  last_date DATE;
  streak INT;
  credits_awarded INT := 0;
BEGIN
  SELECT last_login_date, login_streak INTO last_date, streak
  FROM user_profiles WHERE id = p_user_id;

  IF last_date = CURRENT_DATE THEN
    RETURN json_build_object('streak', streak, 'credits_awarded', 0);
  END IF;

  IF last_date = CURRENT_DATE - 1 THEN
    streak := COALESCE(streak, 0) + 1;
  ELSE
    streak := 1;
  END IF;

  IF streak >= 7 THEN
    PERFORM add_credits(p_user_id, 5, 'streak_bonus');
    credits_awarded := 5;
    streak := 0;
  END IF;

  UPDATE user_profiles
  SET login_streak = streak, last_login_date = CURRENT_DATE
  WHERE id = p_user_id;

  RETURN json_build_object('streak', streak, 'credits_awarded', credits_awarded);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Update the existing handle_new_user trigger to include credits + referral processing
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer UUID;
BEGIN
  -- Read referral code from signup metadata (passed via auth.signUp options.data)
  ref_code := NEW.raw_user_meta_data->>'referral_code';

  INSERT INTO user_profiles (id, email, full_name, role, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'student',
    LOWER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8))
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), user_profiles.full_name);

  INSERT INTO user_credits (user_id, balance) VALUES (NEW.id, 50)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO credit_txns (user_id, amount, action)
  VALUES (NEW.id, 50, 'signup_bonus');

  -- Process referral if a valid referral code was provided
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    SELECT id INTO referrer FROM user_profiles WHERE referral_code = ref_code LIMIT 1;
    IF referrer IS NOT NULL THEN
      -- Check referrer hasn't exceeded 50 referral cap
      IF (SELECT COUNT(*) FROM referrals WHERE referrer_id = referrer) < 50 THEN
        INSERT INTO referrals (referrer_id, referred_id, credited)
        VALUES (referrer, NEW.id, TRUE)
        ON CONFLICT (referred_id) DO NOTHING;
        -- Award 25 credits to both parties
        PERFORM add_credits(referrer, 25, 'referral');
        PERFORM add_credits(NEW.id, 25, 'referral');
        -- Update referred_by on the new user's profile
        UPDATE user_profiles SET referred_by = referrer WHERE id = NEW.id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (drop first to avoid duplicate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

- [ ] **Step 2: Apply the migration to Supabase**

Run the migration via the Supabase dashboard SQL editor or CLI:
```bash
# If using Supabase CLI:
npx supabase db push
# Otherwise: paste the SQL into Supabase Dashboard → SQL Editor → Run
```

- [ ] **Step 3: Verify tables exist**

In Supabase SQL Editor:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_credits', 'credit_txns', 'subscriptions', 'referrals');
```
Expected: 4 rows returned.

- [ ] **Step 4: Test the RPC functions**

```sql
-- Test deduct_credits (should return false — no user)
SELECT deduct_credits('00000000-0000-0000-0000-000000000000', 10, 'test');

-- Test add_credits and get_credit_balance will be tested after user creation
```

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/002_auth_credits.sql
git commit -m "feat: add credits, subscriptions, referrals schema and RPC functions"
```

---

### Task 3: Utility Library — cn() for shadcn

**Files:**
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Create the utility file**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/utils.ts
git commit -m "feat: add cn() utility for shadcn/ui class merging"
```

---

### Task 4: shadcn/ui Base Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/label.tsx`
- Create: `src/components/ui/badge.tsx`

- [ ] **Step 1: Create Button component**

```typescript
// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

- [ ] **Step 2: Create Card component**

```typescript
// src/components/ui/card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

- [ ] **Step 3: Create Input component**

```typescript
// src/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
```

- [ ] **Step 4: Create Label component**

```typescript
// src/components/ui/label.tsx
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

- [ ] **Step 5: Create Badge component**

```typescript
// src/components/ui/badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/button.tsx src/components/ui/card.tsx src/components/ui/input.tsx src/components/ui/label.tsx src/components/ui/badge.tsx
git commit -m "feat: add shadcn/ui base components (Button, Card, Input, Label, Badge)"
```

---

### Task 5: Supabase Auth Helpers

**Files:**
- Create: `src/lib/supabase-auth.ts`

- [ ] **Step 1: Create the auth helper file**

```typescript
// src/lib/supabase-auth.ts
import { createBrowserClient } from "@supabase/ssr";
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client (use in React components)
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-side Supabase client (use in API routes and Server Components)
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can't set cookies in Server Components — only works in Route Handlers
          }
        },
      },
    }
  );
}

// Admin client (service role — bypasses RLS, use for webhook handlers)
export function createAdminSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
}

// Helper: get authenticated user from request, return null if not authenticated
export async function getAuthUser() {
  const supabase = await createServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase-auth.ts
git commit -m "feat: add Supabase Auth helpers for browser, server, and admin clients"
```

---

### Task 6: Credits Library

**Files:**
- Create: `src/lib/credits.ts`

- [ ] **Step 1: Create the credits wrapper**

```typescript
// src/lib/credits.ts
import { createAdminSupabase } from "@/lib/supabase-auth";

export const CREDIT_COSTS = {
  coach_text: 1,
  coach_voice_per_min: 3,
  hint: 1,
  grade: 2,
  interview: 50,
  interview_score: 5,
  lesson_generation: 10,
  voice_session: 3,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS | "signup_bonus" | "referral" | "monthly_refresh" | "streak_bonus" | "course_complete";

/**
 * Deduct credits atomically. Returns true if sufficient balance, false if insufficient.
 */
export async function deductCredits(
  userId: string,
  amount: number,
  action: string,
  refId?: string
): Promise<boolean> {
  const db = createAdminSupabase();
  const { data, error } = await db.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_action: action,
    p_ref_id: refId || null,
  });
  if (error) {
    console.error("[Credits] Deduction error:", error);
    return false;
  }
  return data === true;
}

/**
 * Add credits (capped at 5000). Returns new balance.
 */
export async function addCredits(
  userId: string,
  amount: number,
  action: string
): Promise<number> {
  const db = createAdminSupabase();
  const { data, error } = await db.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_action: action,
  });
  if (error) {
    console.error("[Credits] Add error:", error);
    return 0;
  }
  return data as number;
}

/**
 * Get credit balance for a user.
 */
export async function getBalance(userId: string): Promise<number> {
  const db = createAdminSupabase();
  const { data, error } = await db.rpc("get_credit_balance", {
    p_user_id: userId,
  });
  if (error) {
    console.error("[Credits] Balance error:", error);
    return 0;
  }
  return (data as number) || 0;
}

/**
 * Check if user has had a free interview (first one is free).
 */
export async function hasUsedFreeInterview(userId: string): Promise<boolean> {
  const db = createAdminSupabase();
  const { count, error } = await db
    .from("credit_txns")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", "interview");
  if (error) return true; // Fail safe — charge credits
  return (count || 0) > 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/credits.ts
git commit -m "feat: add credit system library with deduct, add, balance, and free interview check"
```

---

### Task 7: Paddle Webhook Library

**Files:**
- Create: `src/lib/paddle.ts`

- [ ] **Step 1: Create the Paddle helper**

```typescript
// src/lib/paddle.ts
import crypto from "crypto";

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || "";

/**
 * Verify Paddle webhook signature.
 * Paddle sends: Paddle-Signature header with ts=TIMESTAMP;h1=HASH
 */
export function verifyPaddleWebhook(
  rawBody: string,
  signatureHeader: string
): boolean {
  if (!PADDLE_WEBHOOK_SECRET || !signatureHeader) return false;

  try {
    const parts: Record<string, string> = {};
    signatureHeader.split(";").forEach((part) => {
      const [key, value] = part.split("=");
      if (key && value) parts[key.trim()] = value.trim();
    });

    const ts = parts["ts"];
    const h1 = parts["h1"];
    if (!ts || !h1) return false;

    // Check timestamp is within 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(ts, 10)) > 300) return false;

    // Compute HMAC
    const signedPayload = `${ts}:${rawBody}`;
    const computed = crypto
      .createHmac("sha256", PADDLE_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest("hex");

    // Constant-time comparison
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(h1));
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/paddle.ts
git commit -m "feat: add Paddle webhook signature verification"
```

---

## Chunk 2: Auth System Replacement

### Task 8: OAuth Callback Route

**Files:**
- Create: `src/app/auth/callback/route.ts`

- [ ] **Step 1: Create the callback handler**

```typescript
// src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/auth/callback/route.ts
git commit -m "feat: add OAuth callback route for code-to-session exchange"
```

---

### Task 9: Next.js Middleware — Route Protection

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create the middleware**

```typescript
// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/pricing",
  "/auth/callback",
  "/api/webhooks/paddle",
];

// Route prefixes that are always public
const PUBLIC_PREFIXES = ["/ref/", "/_next/", "/favicon", "/api/webhooks/"];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // Skip public routes
  if (isPublicRoute(pathname)) return response;

  // Create Supabase client with cookie access
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session (important — extends session lifetime)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // API routes return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Page routes redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Lazy check: if user has a canceled subscription past its period end, downgrade role
  // This avoids needing a cron job for role downgrades
  if (pathname.startsWith("/api/ai/") || pathname.startsWith("/course/")) {
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: sub } = await admin
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", user.id)
      .eq("status", "canceled")
      .single();
    if (sub && sub.current_period_end && new Date(sub.current_period_end) < new Date()) {
      await admin.from("user_profiles").update({ role: "student" }).eq("id", user.id);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add Next.js middleware for Supabase Auth route protection"
```

---

### Task 10: Rewrite AuthContext for Supabase

**Files:**
- Modify: `src/contexts/AuthContext.tsx`

- [ ] **Step 1: Rewrite AuthContext**

Replace the entire file content with:

```typescript
// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { createBrowserSupabase } from "@/lib/supabase-auth";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "pro" | "teacher" | "admin";
  referral_code: string | null;
  login_streak: number;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  credits: number;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  // Stable Supabase client — never re-created on re-renders
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, role, referral_code, login_streak, avatar_url")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as UserProfile);
  }, [supabase]);

  const refreshCredits = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.rpc("get_credit_balance", { p_user_id: user.id });
    setCredits((data as number) || 0);
  }, [user, supabase]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        const { data } = await supabase.rpc("get_credit_balance", { p_user_id: session.user.id });
        setCredits((data as number) || 0);
        // Update login streak (debounced to once per day by the RPC)
        await supabase.rpc("update_login_streak", { p_user_id: session.user.id });
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
          const { data } = await supabase.rpc("get_credit_balance", { p_user_id: session.user.id });
          setCredits((data as number) || 0);
        } else {
          setUser(null);
          setProfile(null);
          setCredits(0);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    // Read referral cookie if present (set by /ref/[code] page)
    const refCode = document.cookie.match(/referral_code=([^;]+)/)?.[1] || undefined;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, referral_code: refCode } },
    });
    if (error) return { error: error.message };
    // Clear referral cookie after use
    if (refCode) document.cookie = "referral_code=; max-age=0; path=/";
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setCredits(0);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, credits, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, refreshCredits }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Backward compatibility — old code imports useAuth, new interface is superset
export type { UserProfile, AuthContextType };
```

- [ ] **Step 2: Update providers.tsx**

In `src/app/providers.tsx`, the existing `AuthProvider` import should still work since we're exporting the same name. Verify the file imports from `@/contexts/AuthContext` — no change needed if it does.

- [ ] **Step 3: Commit**

```bash
git add src/contexts/AuthContext.tsx
git commit -m "feat: rewrite AuthContext for Supabase Auth with credits and Google OAuth"
```

---

### Task 11: Rewrite Login Page

**Files:**
- Modify: `src/app/login/page.tsx`

- [ ] **Step 1: Rewrite the login page with Google OAuth**

```typescript
// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(authError === "auth_failed" ? "Authentication failed. Please try again." : "");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.replace(next);
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.replace(next);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16 bg-[var(--background)]">
      <form
        onSubmit={handleEmailLogin}
        className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Grokking
          </h1>
          <p className="text-sm text-white/50 mt-2">Sign in to continue learning</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 mb-4 h-11 border-white/10 hover:bg-white/5"
          onClick={signInWithGoogle}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262" className="w-5 h-5">
            <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
            <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
            <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
            <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
          </svg>
          <span>Continue with Google</span>
        </Button>

        <div className="flex items-center my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="px-3 text-xs text-white/30">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/70">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 rounded-md p-2">{error}</p>
          )}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-violet-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/login/page.tsx
git commit -m "feat: rewrite login page with Google OAuth and Supabase email/password"
```

---

### Task 12: Rewrite Signup Page

**Files:**
- Modify: `src/app/signup/page.tsx`

- [ ] **Step 1: Rewrite the signup page**

```typescript
// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const { signInWithGoogle, signUpWithEmail, user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (user) {
    router.replace("/");
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signUpWithEmail(email, password, name);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4 bg-[var(--background)]">
        <div className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
          <p className="text-sm text-white/50">We sent a confirmation link to <strong className="text-white/80">{email}</strong>. Click it to activate your account and get your 50 free credits.</p>
          <Link href="/login" className="text-violet-400 text-sm hover:underline mt-4 inline-block">Back to login</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16 bg-[var(--background)]">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Join Grokking
          </h1>
          <p className="text-sm text-white/50 mt-2">Start with 50 free AI credits</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 mb-4 h-11 border-white/10 hover:bg-white/5"
          onClick={signInWithGoogle}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262" className="w-5 h-5">
            <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
            <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
            <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
            <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
          </svg>
          <span>Continue with Google</span>
        </Button>

        <div className="flex items-center my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="px-3 text-xs text-white/30">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/70">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/70">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-md p-2">{error}</p>}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:underline">Sign in</Link>
        </p>
      </form>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/signup/page.tsx
git commit -m "feat: rewrite signup page with Google OAuth, email registration, and confirmation flow"
```

---

### Task 13: Migrate API Routes — Auth Pattern Replacement

> **IMPORTANT:** This task MUST run BEFORE deleting old auth files so the grep can find all usages.

**Files:**
- Modify: All ~32 API routes that import from `@/lib/auth`

This is a mechanical find-and-replace. Every route that currently does:

```typescript
import { verifyToken } from "@/lib/auth";
const token = req.cookies.get("auth-token")?.value;
if (!token) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
const user = await verifyToken(token);
if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
```

Gets replaced with:

```typescript
import { createServerSupabase } from "@/lib/supabase-auth";
const supabase = await createServerSupabase();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

And `user.userId` becomes `user.id`.

- [ ] **Step 1: Find all files importing from `@/lib/auth`**

```bash
grep -rl "from \"@/lib/auth\"" src/app/api/ --include="*.ts" --include="*.tsx"
```

- [ ] **Step 2: Replace auth pattern in each file**

For each file found, apply the replacement pattern above. Also replace:
- `user.userId` → `user.id`
- `user.name` → `user.user_metadata?.full_name || ""`
- `user.email` → `user.email || ""`
- `user.role` → (query from user_profiles if needed, or skip if middleware handles it)

- [ ] **Step 3: Add credit deduction to AI routes**

For routes that consume AI credits, add after the auth check:

```typescript
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

// After auth check, before processing:
const ok = await deductCredits(user.id, CREDIT_COSTS.coach_text, "coach_text");
if (!ok) {
  return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
}
```

Apply to these routes with these costs:
- `/api/ai/coach` → `coach_text` (1 credit)
- `/api/ai/hint` → `hint` (1 credit)
- `/api/ai/grade` → `grade` (2 credits)
- `/api/ai/voice-agent` → `voice_session` (3 credits)
- `/api/ai/voice-session` → `voice_session` (3 credits)
- `/api/ai/generate-lesson` → `lesson_generation` (10 credits)
- `/api/interviews/plan` → `interview` (50 credits, check `hasUsedFreeInterview` first)
- `/api/interviews/score` → `interview_score` (5 credits)

- [ ] **Step 4: Verify no remaining imports of old auth**

```bash
grep -r "from \"@/lib/auth\"" src/ --include="*.ts" --include="*.tsx"
```
Expected: No results.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/
git commit -m "feat: migrate all API routes from custom JWT to Supabase Auth + credit deductions"
```

---

### Task 14: Remove Old Auth Files

**Files:**
- Delete: `src/lib/auth.ts`
- Delete: `src/app/api/auth/login/route.ts`
- Delete: `src/app/api/auth/signup/route.ts`
- Delete: `src/app/api/auth/logout/route.ts`
- Delete: `src/app/api/auth/me/route.ts`

- [ ] **Step 1: Delete old auth files**

```bash
rm -f src/lib/auth.ts
rm -f src/app/api/auth/login/route.ts
rm -f src/app/api/auth/signup/route.ts
rm -f src/app/api/auth/logout/route.ts
rm -f src/app/api/auth/me/route.ts
```

- [ ] **Step 2: Commit**

```bash
git add -A src/lib/auth.ts src/app/api/auth/
git commit -m "chore: remove old custom JWT auth system (replaced by Supabase Auth)"
```

---

## Chunk 3: Payments, Pricing & UI

### Task 15: Paddle Webhook Handler

**Files:**
- Create: `src/app/api/webhooks/paddle/route.ts`

- [ ] **Step 1: Create the webhook handler**

```typescript
// src/app/api/webhooks/paddle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyPaddleWebhook } from "@/lib/paddle";
import { createAdminSupabase } from "@/lib/supabase-auth";
import { addCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("Paddle-Signature") || "";

  if (!verifyPaddleWebhook(rawBody, signature)) {
    console.error("[Paddle Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType = event.event_type;
  const data = event.data;
  const db = createAdminSupabase();

  console.log("[Paddle Webhook]", eventType, data?.id);

  try {
    switch (eventType) {
      case "subscription.created": {
        const userId = data.custom_data?.userId;
        if (!userId) break;
        await db.from("subscriptions").upsert({
          user_id: userId,
          paddle_subscription_id: data.id,
          paddle_customer_id: data.customer_id,
          plan: data.custom_data?.plan || "pro",
          status: data.status,
          current_period_end: data.current_billing_period?.ends_at,
        }, { onConflict: "paddle_subscription_id" });
        break;
      }

      case "subscription.activated": {
        const sub = await db
          .from("subscriptions")
          .select("user_id")
          .eq("paddle_subscription_id", data.id)
          .single();
        if (sub.data) {
          await db.from("subscriptions").update({ status: "active", updated_at: new Date().toISOString() }).eq("paddle_subscription_id", data.id);
          await db.from("user_profiles").update({ role: "pro" }).eq("id", sub.data.user_id);
          await addCredits(sub.data.user_id, 500, "monthly_refresh");
        }
        break;
      }

      case "subscription.updated": {
        await db.from("subscriptions").update({
          status: data.status,
          current_period_end: data.current_billing_period?.ends_at,
          cancel_at_period_end: data.scheduled_change?.action === "cancel",
          updated_at: new Date().toISOString(),
        }).eq("paddle_subscription_id", data.id);
        break;
      }

      case "subscription.canceled": {
        // Mark cancel_at_period_end — user keeps access until current_period_end
        // Role downgrade happens when Paddle sends subscription.updated with status=canceled
        // after the billing period actually ends
        await db.from("subscriptions").update({
          status: "canceled",
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        }).eq("paddle_subscription_id", data.id);
        // Note: Do NOT downgrade role here — user has paid through current_period_end.
        // The middleware checks current_period_end to enforce access expiry.
        break;
      }

      case "subscription.past_due": {
        await db.from("subscriptions").update({ status: "past_due", updated_at: new Date().toISOString() }).eq("paddle_subscription_id", data.id);
        break;
      }

      case "transaction.completed": {
        // Monthly credit refresh for monthly subscribers
        if (data.subscription_id) {
          const sub = await db
            .from("subscriptions")
            .select("user_id, plan")
            .eq("paddle_subscription_id", data.subscription_id)
            .single();
          if (sub.data) {
            // Refresh credits on every successful transaction (works for both monthly and annual)
            // Paddle sends transaction.completed on each billing cycle
            await addCredits(sub.data.user_id, 500, "monthly_refresh");
          }
        }
        break;
      }
    }
  } catch (err) {
    console.error("[Paddle Webhook] Error processing:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/webhooks/paddle/route.ts
git commit -m "feat: add Paddle webhook handler for subscription lifecycle events"
```

---

### Task 16: Credit Balance API Route

**Files:**
- Create: `src/app/api/credits/balance/route.ts`

- [ ] **Step 1: Create the balance endpoint**

```typescript
// src/app/api/credits/balance/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { getBalance } from "@/lib/credits";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const balance = await getBalance(user.id);
  return NextResponse.json({ balance });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/credits/balance/route.ts
git commit -m "feat: add credit balance API endpoint"
```

---

### Task 17: CreditBadge Component

**Files:**
- Create: `src/components/auth/CreditBadge.tsx`

- [ ] **Step 1: Create the credit badge**

```typescript
// src/components/auth/CreditBadge.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Coins } from "lucide-react";

export default function CreditBadge() {
  const { credits, user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
      <Coins className="w-3.5 h-3.5" />
      <span>{credits}</span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/auth/CreditBadge.tsx
git commit -m "feat: add CreditBadge component for TopNav"
```

---

### Task 18: Update TopNav with CreditBadge and User Avatar

**Files:**
- Modify: `src/components/layout/TopNav.tsx`

- [ ] **Step 1: Add CreditBadge import and render it next to the user avatar**

Add to imports:
```typescript
import CreditBadge from "@/components/auth/CreditBadge";
```

Add `<CreditBadge />` in the TopNav's right-side actions area, before the user avatar dropdown.

- [ ] **Step 2: Update the user avatar to use Supabase profile**

Replace the existing avatar logic that uses `useAuth().user?.name` with:
```typescript
const { user, profile, signOut } = useAuth();
// Avatar: use profile.avatar_url or first letter of profile.full_name
```

Update the logout handler from the old `logout()` to `signOut()`.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/TopNav.tsx
git commit -m "feat: add CreditBadge to TopNav and update user avatar for Supabase"
```

---

### Task 19: Pricing Page

**Files:**
- Create: `src/app/pricing/page.tsx`
- Create: `src/components/pricing/PricingCards.tsx`

- [ ] **Step 1: Create PricingCards component**

```typescript
// src/components/pricing/PricingCards.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
const PADDLE_ENV = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox") as "sandbox" | "production";
const PRO_MONTHLY_PRICE = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY || "";
const PRO_ANNUAL_PRICE = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL || "";

const FREE_FEATURES = [
  "3 full courses (Python, JS, Web Dev)",
  "50 AI credits on signup",
  "Code editor + auto-grading",
  "Community Discord access",
  "Progress tracking",
];

const PRO_FEATURES = [
  "All 13+ courses unlocked",
  "500 AI credits/month",
  "AI Coach voice sessions",
  "Mock interview practice",
  "Certificates of completion",
  "Choose coach/interviewer voice",
  "Priority support",
];

const TEAM_FEATURES = [
  "Everything in Pro",
  "Classroom management",
  "Student progress dashboard",
  "Homework assignment",
  "Team analytics",
  "Admin controls",
];

export default function PricingCards() {
  const { user, profile } = useAuth();
  const [annual, setAnnual] = useState(true);
  const [paddleInstance, setPaddleInstance] = useState<Paddle | null>(null);

  const openCheckout = async (priceId: string) => {
    let paddle = paddleInstance;
    if (!paddle && PADDLE_CLIENT_TOKEN) {
      paddle = (await initializePaddle({
        token: PADDLE_CLIENT_TOKEN,
        environment: PADDLE_ENV,
      })) || null;
      setPaddleInstance(paddle);
    }
    if (!paddle) return;

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId: user?.id, plan: "pro" },
      customer: user?.email ? { email: user.email } : undefined,
    });
  };

  const isPro = profile?.role === "pro" || profile?.role === "teacher" || profile?.role === "admin";

  return (
    <div>
      {/* Annual/Monthly Toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={`text-sm ${!annual ? "text-white" : "text-white/40"}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-violet-500" : "bg-white/20"}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${annual ? "translate-x-6" : "translate-x-0.5"}`} />
        </button>
        <span className={`text-sm ${annual ? "text-white" : "text-white/40"}`}>Annual <span className="text-emerald-400 text-xs">(save 20%)</span></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Free Tier */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white">Free</CardTitle>
            <CardDescription>Start learning today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-1">$0</div>
            <div className="text-sm text-white/40 mb-6">forever</div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-white/10" disabled={!!user}>
              {user ? "Current Plan" : "Get Started"}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className="bg-violet-500/10 border-violet-500/30 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
            MOST POPULAR
          </div>
          <CardHeader>
            <CardTitle className="text-white">Pro</CardTitle>
            <CardDescription>Unlimited learning + AI coaching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-1">
              ${annual ? "12" : "15"}<span className="text-lg text-white/40">/mo</span>
            </div>
            <div className="text-sm text-white/40 mb-6">
              {annual ? "$144/year" : "billed monthly"}
            </div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-violet-500 hover:bg-violet-600"
              onClick={() => openCheckout(annual ? PRO_ANNUAL_PRICE : PRO_MONTHLY_PRICE)}
              disabled={isPro}
            >
              {isPro ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </CardContent>
        </Card>

        {/* Teams Tier */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white">Teams</CardTitle>
            <CardDescription>For classrooms and teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-1">
              $10<span className="text-lg text-white/40">/seat/mo</span>
            </div>
            <div className="text-sm text-white/40 mb-6">min 5 seats</div>
            <ul className="space-y-3 mb-8">
              {TEAM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-white/10">
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the pricing page**

```typescript
// src/app/pricing/page.tsx
import PricingCards from "@/components/pricing/PricingCards";

export const metadata = { title: "Pricing — Grokking" };

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Simple Pricing
        </h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">
          Start free. Upgrade when you need AI coaching, voice interviews, and all courses.
        </p>
      </div>
      <PricingCards />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/pricing/PricingCards.tsx src/app/pricing/page.tsx
git commit -m "feat: add pricing page with Free/Pro/Teams tiers and Paddle checkout"
```

---

### Task 20: Referral Landing Page

**Files:**
- Create: `src/app/ref/[code]/page.tsx`

- [ ] **Step 1: Create the referral page**

```typescript
// src/app/ref/[code]/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cookieStore = await cookies();

  // Store referral code in a 30-day cookie
  cookieStore.set("referral_code", code, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  redirect("/signup");
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/ref/
git commit -m "feat: add referral landing page — stores code in cookie and redirects to signup"
```

---

### Task 21: Update Home Page with Auth-Aware CTAs

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add login/pricing CTAs to the home page**

In the hero section of `src/app/page.tsx`, add:
- If not authenticated: "Get Started Free" button linking to `/signup`, and "View Pricing" button linking to `/pricing`
- If authenticated: "Continue Learning" button linking to the last course, and credit balance display

Use the existing `useAuth()` hook to determine auth state.

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add auth-aware CTAs to home page (signup/pricing for guests, continue for users)"
```

---

### Task 22: Settings Page

**Files:**
- Create: `src/app/settings/page.tsx`

- [ ] **Step 1: Create the settings page**

```typescript
// src/app/settings/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, User, CreditCard, Share2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { user, profile, credits } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user || !profile) return null;

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/ref/${profile.referral_code}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>

        {/* Profile */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/50">Name</span>
              <span className="text-white">{profile.full_name || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Email</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Role</span>
              <Badge variant={profile.role === "pro" ? "default" : "secondary"}>
                {profile.role}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Login Streak</span>
              <span className="text-white">{profile.login_streak} days</span>
            </div>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" /> Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-400 mb-2">{credits}</div>
            <p className="text-sm text-white/40">
              {profile.role === "pro"
                ? "500 credits refresh monthly with your Pro subscription."
                : "Upgrade to Pro for 500 credits/month."}
            </p>
            {profile.role === "student" && (
              <Button className="mt-4 bg-violet-500 hover:bg-violet-600" asChild>
                <a href="/pricing">Upgrade to Pro</a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.role === "pro" || profile.role === "teacher" ? (
              <p className="text-sm text-white/60">
                Manage your subscription, update payment method, or view invoices through the Paddle customer portal.
              </p>
            ) : (
              <p className="text-sm text-white/40">No active subscription. Upgrade to Pro to unlock all features.</p>
            )}
          </CardContent>
        </Card>

        {/* Referral */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" /> Refer a Friend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/50 mb-3">Share your link — you both get 25 credits when they sign up.</p>
            <div className="flex gap-2">
              <code className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-xs text-white/70 truncate">
                {referralLink}
              </code>
              <Button variant="outline" size="sm" onClick={copyReferral} className="border-white/10">
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/settings/page.tsx
git commit -m "feat: add settings page with profile, credits, subscription, and referral sections"
```

---

### Task 23: Final Verification & Build Check

- [ ] **Step 1: Enable Google OAuth in Supabase Dashboard**

Go to Supabase Dashboard → Authentication → Providers → Google:
- Enable Google provider
- Add Google Client ID and Client Secret (from Google Cloud Console)
- Set redirect URL to: `https://irnxkvjhrzfqboucufdd.supabase.co/auth/v1/callback`

- [ ] **Step 2: Add Paddle environment variables to .env.local**

```
PADDLE_API_KEY=<your-paddle-api-key>
PADDLE_WEBHOOK_SECRET=<your-paddle-webhook-secret>
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=<your-paddle-client-token>
NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY=<your-price-id>
NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL=<your-price-id>
NEXT_PUBLIC_PADDLE_PRICE_ID_TEAMS=<your-price-id>
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

- [ ] **Step 3: Run the build to verify no import errors**

```bash
npm run build
```

Expected: Build succeeds with no errors about missing `@/lib/auth` imports.

- [ ] **Step 4: Test the full flow locally**

1. Open `http://localhost:3000/login` — verify Google OAuth button appears
2. Click "Continue with Google" — verify redirect to Google consent screen
3. After consent — verify redirect back and user is logged in
4. Check Supabase → `user_profiles` table — verify new row was created
5. Check Supabase → `user_credits` table — verify 50 credits allocated
6. Open `http://localhost:3000/pricing` — verify 3 tiers display
7. Open `http://localhost:3000/settings` — verify profile, credits, referral link
8. Try an AI coach message — verify 1 credit is deducted

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: Phase 1 complete — Supabase Auth, Paddle subscriptions, credit system"
```

---

### Task 24: Mobile Responsiveness Pass

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/signup/page.tsx`
- Modify: `src/app/pricing/page.tsx`
- Modify: `src/app/settings/page.tsx`
- Modify: `src/components/pricing/PricingCards.tsx`
- Modify: `src/components/auth/CreditBadge.tsx`
- Modify: `src/components/layout/TopNav.tsx`

- [ ] **Step 1: Audit all new pages for mobile breakpoints**

Check every new page created in this plan uses responsive Tailwind classes. Key patterns:
- Container widths: `max-w-md` on mobile, `max-w-4xl` on desktop → use `w-full max-w-md md:max-w-4xl`
- Grid layouts: `grid-cols-1 md:grid-cols-3` for pricing cards
- Padding: `px-4 md:px-8` for page containers
- Text sizing: `text-2xl md:text-4xl` for headings
- Hidden elements: `hidden md:flex` for desktop-only nav items

- [ ] **Step 2: Fix login/signup pages for mobile**

Ensure the auth forms are centered, full-width on mobile, and don't overflow:
```typescript
// Wrapper pattern for login/signup:
<div className="min-h-screen flex items-center justify-center px-4">
  <div className="w-full max-w-md space-y-6">
    {/* form content */}
  </div>
</div>
```

- [ ] **Step 3: Fix pricing page grid for mobile**

```typescript
// PricingCards grid should stack on mobile:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
```

- [ ] **Step 4: Fix settings page for mobile**

```typescript
// Settings cards should stack on mobile:
<div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
```

- [ ] **Step 5: Fix TopNav credit badge on mobile**

```typescript
// CreditBadge should show abbreviated text on mobile:
<span className="hidden sm:inline">credits</span>
```

- [ ] **Step 6: Test on mobile viewport**

Open Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M):
- Test at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)
- Verify: no horizontal scroll, all buttons tappable (min 44px touch target), text readable

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix: ensure all Phase 1 pages are mobile responsive"
```
