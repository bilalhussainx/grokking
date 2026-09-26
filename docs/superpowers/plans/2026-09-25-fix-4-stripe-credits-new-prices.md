# Fix 4: Stripe and credits for the new prices — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the new pricing: Free gets 200 credits once at signup; Pro is $15/month or $99/year with fair-use limits; the signup Pro trial is 7 days. Existing $12 subscribers move to $15 at their next renewal, after the founder sends notice. Also build the reserve/capture/release credit primitive that the counselor agent consumes (Astra plan a2 `BillingPort`).

**Architecture:** One pricing module (`src/lib/pricing.ts`) is the source of truth for amounts and copy. Checkout takes `interval: "month" | "year"` and maps it to one of two env-configured Stripe price IDs. The webhook already treats any active subscription as Pro, so both intervals work unchanged. A new additive migration sets 200 signup credits and a 7-day trial, and adds `credit_reservations` with three SECURITY DEFINER RPCs. Scripts that touch Stripe refuse live keys unless explicitly told to use them, and default to dry-run.

**Tech Stack:** Next.js 16 App Router, `stripe` 22.x (mocked in tests), Supabase Postgres (RPCs), vitest 4.

**Spec:** Founder decisions of 2026-09-25 in this session:
- Free = 200 credits, once at signup.
- Pro = $15/month or $99/year, with fair-use unlimited.
- Existing $12 subscribers move to $15 at their next renewal.
- 7-day Pro trial.
- Claude creates the **test-mode** Stripe prices.

Also: spec `docs/superpowers/specs/2026-09-25-counselor-agent-design.md` §10.3 and Astra plan `docs/superpowers/plans/2026-09-25-agent-slice-a2-durable-turns.md` Task 3 (`BillingPort`).

## Global Constraints

- **The Stripe key in `.env.local` is LIVE.** Tests mock `stripe` and never make network calls. Scripts refuse `sk_live_` keys unless run with `--live`, and `--live` is only for the founder-approved price migration. Test-mode work needs `STRIPE_TEST_SECRET_KEY=sk_test_…`, which the founder supplies. Without it, the test-mode steps are recorded as not run.
- No production migrations, deploys, emails to users, or live Stripe writes without the founder's explicit go-ahead in this session. The price-migration script's `--apply --live` mode is a founder action.
- Tests: `npx vitest run <path>`. **Never `npm run test:unit`.**
- `git add` explicit paths only. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.
- Never print secrets. Scripts print only a key's mode (test or live), never its value.
- Brand: KairosLearn. Prices in copy come from `src/lib/pricing.ts`, never hardcoded.
- `CREDIT_COSTS` values stay unchanged. The founder didn't ask for a rebalance, and 200 credits still covers about 200 coach turns.

## Review Focus

1. **A retried or duplicated reservation must never double-charge or double-refund.** Covers the same key replayed; the same key with a different amount (conflict); capture after release; release after capture; and capture above the reserved max. Pinned in Task 6 (`credit-reservations.test.ts`: idempotency table) and its SQL test.
2. **Checkout with an unknown or missing interval, or a missing price env var,** must fail with a clear 4xx/5xx, never silently fall back to the monthly price for a yearly request. Pinned in Task 2.
3. **The price-migration script must never touch a subscription that isn't on the old price.** That includes cancelled or ending subscriptions and customers with several items. It must never run without `--apply` and a matching `--expect=<count>`. Pinned in Task 3 (`planPriceMigration` table test).
4. **A Pro user who hits a fair-use limit** must see a fair-use message (429), not an "upgrade to Pro" paywall. Pinned in Task 5.
5. **No page may still advertise $12, 300 credits or a 30-day/"one month" trial.** Pinned in Task 1's copy tripwire test.

---

### Task 1: One pricing module and a copy sweep

**Files:**
- Create: `src/lib/pricing.ts`, `src/lib/__tests__/pricing-copy.test.ts`
- Modify: every file the tripwire flags. Found 2026-09-25: `src/components/upgrade/UpgradeModal.tsx`, `src/app/pricing/page.tsx`, `src/components/gamification/StreakCalendar.tsx`, `src/components/cinematic/Features.tsx`, `src/lib/cc/subsidized-eligibility.ts`, `src/components/mobile/landing/MobileLanding.tsx`, `src/components/landing/CinematicLandingV2.tsx`, `src/components/billing/SubscriptionStatus.tsx`, `src/app/terms/page.tsx`, `src/app/api/billing/stripe/checkout/route.ts` (comments), `src/lib/credits.ts`, `src/lib/cc/coach-prompt-builder.ts`, `src/lib/cc/coach-agents.ts`, `src/components/pricing/PaywallModal.tsx`, `src/components/lesson/LessonPage.tsx`, `src/components/cinematic/HeroSection.tsx`, `src/components/auth/CreditBadge.tsx`, `src/app/ref/[code]/page.tsx`, `src/app/privacy/page.tsx`, `src/app/pricing/subsidized/page.tsx`, `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/landing/page.tsx`, `src/app/faq/page.tsx`, `src/app/api/cc/family/invites/route.ts`

**Interfaces:**
- Produces: `PRICING = { free: { signupCredits: 200 }, pro: { monthlyUsd: 15, yearlyUsd: 99, trialDays: 7 } } as const`; `proMonthlyLabel(): string` → "$15/month"; `proYearlyLabel(): string` → "$99/year"; `yearlySavingsPct(): number` → 45.

- [ ] **Step 1: Failing tripwire + module test**

```ts
// src/lib/__tests__/pricing-copy.test.ts
// Prices and credit amounts come from src/lib/pricing.ts. This fails if any
// app/component/lib file still advertises the pre-2026-09-25 pricing.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { PRICING, proMonthlyLabel, proYearlyLabel, yearlySavingsPct } from "../pricing";

const ROOTS = ["src/app", "src/components", "src/lib"];
const SKIP = [path.join("src", "lib", "__tests__"), path.join("src", "data")];
const STALE = [/\$12\b/, /\b300 credits\b/i, /\b300 Credits\b/, /30[- ]day (free )?(pro )?trial/i, /one month(,)? free/i, /1 month Pro/i];

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (SKIP.some((s) => p.startsWith(s))) return [];
    if (d.isDirectory()) return files(p);
    return /\.(tsx?|mdx?)$/.test(d.name) ? [p] : [];
  });
}

describe("pricing", () => {
  it("has the 2026-09-25 numbers", () => {
    expect(PRICING).toEqual({ free: { signupCredits: 200 }, pro: { monthlyUsd: 15, yearlyUsd: 99, trialDays: 7 } });
    expect(proMonthlyLabel()).toBe("$15/month");
    expect(proYearlyLabel()).toBe("$99/year");
    expect(yearlySavingsPct()).toBe(45);
  });

  it("no source file advertises the old pricing", () => {
    const hits = ROOTS.flatMap(files).flatMap((f) => {
      const src = fs.readFileSync(f, "utf8");
      return STALE.filter((re) => re.test(src)).map((re) => `${f}: ${re}`);
    });
    expect(hits).toEqual([]);
  });
});
```

Run: `npx vitest run src/lib/__tests__/pricing-copy.test.ts`. Expected: FAIL (module missing).

- [ ] **Step 2: Create the module**

```ts
// src/lib/pricing.ts
// Single source of truth for plan prices and credit amounts (founder,
// 2026-09-25). Copy imports these; never hardcode a price in a component.
export const PRICING = {
  free: { signupCredits: 200 },
  pro: { monthlyUsd: 15, yearlyUsd: 99, trialDays: 7 },
} as const;

export const proMonthlyLabel = () => `$${PRICING.pro.monthlyUsd}/month`;
export const proYearlyLabel = () => `$${PRICING.pro.yearlyUsd}/year`;
// 12 × $15 = $180 vs $99 → 45% saved.
export const yearlySavingsPct = () =>
  Math.round((1 - PRICING.pro.yearlyUsd / (PRICING.pro.monthlyUsd * 12)) * 100);
```

Run the test. Expected: the module test passes; the tripwire lists the stale files.

- [ ] **Step 3: Sweep the copy.** For each flagged file:
  - Replace `$12` with `{proMonthlyLabel()}` in JSX, or `` `${proMonthlyLabel()}` `` in strings (import from `@/lib/pricing`).
  - Replace "300 credits" with `` `${PRICING.free.signupCredits} credits` ``.
  - Replace 30-day / "one month" trial wording with `` `${PRICING.pro.trialDays}-day` `` trial wording. For example, `src/app/pricing/page.tsx:446` becomes `Try Pro for <em>7 days</em>, free.`
  - Where "unlimited" describes Pro coach or voice use, say "unlimited (fair use)".
  - On the pricing page, show both plans: `{proMonthlyLabel()}` and "or `{proYearlyLabel()}` (save `{yearlySavingsPct()}`%)".
  - `src/app/terms/page.tsx` and `src/app/privacy/page.tsx` are legal text: change only the numbers, and list both files in the task's report for founder review.
  - Server files that can't render JSX (`coach-prompt-builder.ts`, `coach-agents.ts`, `family/invites/route.ts`) interpolate the same helpers.

- [ ] **Step 4: Run.** `npx vitest run src/lib/__tests__/pricing-copy.test.ts && npx tsc --noEmit -p .`. Expected: PASS, tsc 0.

- [ ] **Step 5: Commit**

```bash
git add src/lib/pricing.ts src/lib/__tests__/pricing-copy.test.ts <each swept file by path>
git commit -m "feat(pricing): one pricing module; copy says \$15/month or \$99/year, 200 credits, 7-day trial"
```

### Task 2: Checkout for monthly or yearly

**Files:**
- Modify: `src/app/api/billing/stripe/checkout/route.ts`, `src/components/marketing/ProCheckoutButton.tsx`, `src/app/pricing/page.tsx` (second button)
- Test: `src/app/api/billing/stripe/__tests__/checkout.test.ts`

**Interfaces:**
- Consumes: env `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY` (repointed by the founder to the $15 price) and the new `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY`.
- Produces: `POST /api/billing/stripe/checkout` body `{ interval?: "month" | "year" }` (default `"month"`) → `{ url }`. Responses: 400 for an unknown interval; 500 when the price env for that interval is missing. `ProCheckoutButton` takes a prop `interval?: "month" | "year"`.

- [ ] **Step 1: Failing test**

```ts
// src/app/api/billing/stripe/__tests__/checkout.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const h = vi.hoisted(() => ({ create: vi.fn(), user: { id: "u1", email: "s@example.com" } as { id: string; email: string } | null }));
vi.mock("stripe", () => ({
  default: class { checkout = { sessions: { create: h.create } }; },
}));
vi.mock("@/lib/supabase-auth", () => ({
  createServerSupabase: async () => ({
    auth: { getUser: async () => ({ data: { user: h.user } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }),
  }),
}));

import { POST } from "../checkout/route";

const req = (body: unknown) =>
  new NextRequest("http://localhost/api/billing/stripe/checkout", {
    method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json", origin: "http://localhost" },
  });

beforeEach(() => {
  h.create.mockReset().mockResolvedValue({ url: "https://checkout.stripe.test/s" });
  h.user = { id: "u1", email: "s@example.com" };
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
  vi.stubEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY", "price_month");
  vi.stubEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY", "price_year");
});

describe("POST /api/billing/stripe/checkout", () => {
  it("uses the monthly price by default", async () => {
    expect((await POST(req({}))).status).toBe(200);
    expect(h.create.mock.calls[0][0].line_items).toEqual([{ price: "price_month", quantity: 1 }]);
  });

  it("uses the yearly price for interval=year", async () => {
    await POST(req({ interval: "year" }));
    expect(h.create.mock.calls[0][0].line_items).toEqual([{ price: "price_year", quantity: 1 }]);
    expect(h.create.mock.calls[0][0].subscription_data.metadata).toEqual({ user_id: "u1", plan: "pro", interval: "year" });
  });

  it("rejects an unknown interval", async () => {
    expect((await POST(req({ interval: "week" }))).status).toBe(400);
    expect(h.create).not.toHaveBeenCalled();
  });

  it("never falls back to monthly when the yearly price is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY", "");
    expect((await POST(req({ interval: "year" }))).status).toBe(500);
    expect(h.create).not.toHaveBeenCalled();
  });

  it("401s when signed out", async () => {
    h.user = null;
    expect((await POST(req({}))).status).toBe(401);
  });
});
```

Run: `npx vitest run src/app/api/billing/stripe/__tests__/checkout.test.ts`. Expected: FAIL. The yearly and unknown-interval cases fail, and env read at module scope ignores `stubEnv`.

- [ ] **Step 2: Implement.** In the route:
  - Delete the module-scope `STRIPE_SECRET_KEY` / `PRO_MONTHLY_PRICE` constants.
  - At the top of `POST`, read the body and the env.
  - Update the header comment to "$15/month or $99/year (src/lib/pricing.ts)".

```ts
const PRICE_ENV = {
  month: "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY",
  year: "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY",
} as const;
type Interval = keyof typeof PRICE_ENV;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { interval?: unknown };
  const interval = (body.interval ?? "month") as Interval;
  if (!(interval in PRICE_ENV)) {
    return NextResponse.json({ error: "interval must be 'month' or 'year'" }, { status: 400 });
  }
  const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
  const price = process.env[PRICE_ENV[interval]] ?? "";
  if (!secretKey || !price) {
    return NextResponse.json(
      { error: `Stripe billing is not configured on the server. Set STRIPE_SECRET_KEY and ${PRICE_ENV[interval]}.` },
      { status: 500 },
    );
  }
  // … existing auth, origin and customer lookup unchanged …
  const stripe = new Stripe(secretKey);
  // in sessions.create: line_items: [{ price, quantity: 1 }],
  // subscription_data.metadata: { user_id: user.id, plan: "pro", interval },
```

In `ProCheckoutButton`, add the prop `interval = "month"` and send `body: JSON.stringify({ interval })`. On the pricing page, render a second `<ProCheckoutButton interval="year">` labelled `` `Get Pro yearly — ${proYearlyLabel()}` `` next to the monthly one.

- [ ] **Step 3: Run.** `npx vitest run src/app/api/billing/stripe/__tests__/checkout.test.ts && npx tsc --noEmit -p .`. Expected: 5/5, tsc 0.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/billing/stripe/checkout/route.ts src/app/api/billing/stripe/__tests__/checkout.test.ts src/components/marketing/ProCheckoutButton.tsx src/app/pricing/page.tsx
git commit -m "feat(billing): Stripe checkout for Pro monthly or yearly"
```

### Task 3: Scripts for test-mode prices and moving $12 subscribers to $15

**Files:**
- Create: `scripts/stripe/price-migration.ts` (pure planning and key guard), `scripts/stripe/create-test-prices.ts`, `scripts/stripe/migrate-pro-price.ts`
- Test: `src/lib/__tests__/stripe-price-migration.test.ts`
- Create: `docs/handoff/pro-price-change-notice.md` (a draft email for the founder to send; Claude does not send it)

**Interfaces:**
- Produces:
  - `assertKeyMode(key: string | undefined, allowLive: boolean): "test" | "live"` throws when the key is missing or unrecognized, or when it's live without `allowLive`.
  - `planPriceMigration(subs: SubLite[], oldPriceIds: string[], newPriceId: string): { updates: { subscriptionId: string; itemId: string }[]; skipped: { subscriptionId: string; reason: string }[] }`.
  - `type SubLite = { id: string; status: string; cancel_at_period_end: boolean; items: { id: string; price: string }[] }`.

- [ ] **Step 1: Failing test**

```ts
// src/lib/__tests__/stripe-price-migration.test.ts
import { describe, it, expect } from "vitest";
import { assertKeyMode, planPriceMigration, type SubLite } from "../../../scripts/stripe/price-migration";

const sub = (id: string, over: Partial<SubLite> = {}): SubLite => ({
  id, status: "active", cancel_at_period_end: false, items: [{ id: `si_${id}`, price: "price_12" }], ...over,
});

describe("assertKeyMode", () => {
  it("accepts test keys", () => expect(assertKeyMode("sk_test_abc", false)).toBe("test"));
  it("refuses live keys unless allowed", () => {
    expect(() => assertKeyMode("sk_live_abc", false)).toThrow(/live/i);
    expect(assertKeyMode("sk_live_abc", true)).toBe("live");
  });
  it("refuses missing or unknown keys", () => {
    expect(() => assertKeyMode(undefined, true)).toThrow();
    expect(() => assertKeyMode("pk_test_abc", true)).toThrow();
  });
});

describe("planPriceMigration", () => {
  it("moves only live subscriptions on an old price, one item each", () => {
    const plan = planPriceMigration(
      [
        sub("a"),
        sub("b", { status: "trialing" }),
        sub("c", { status: "past_due" }),
        sub("d", { status: "canceled" }),
        sub("e", { cancel_at_period_end: true }),
        sub("f", { items: [{ id: "si_f", price: "price_15" }] }),
        sub("g", { items: [{ id: "si_g1", price: "price_12" }, { id: "si_g2", price: "price_addon" }] }),
      ],
      ["price_12"],
      "price_15",
    );
    expect(plan.updates).toEqual([
      { subscriptionId: "a", itemId: "si_a" },
      { subscriptionId: "b", itemId: "si_b" },
      { subscriptionId: "c", itemId: "si_c" },
      { subscriptionId: "g", itemId: "si_g1" },
    ]);
    expect(plan.skipped.map((s) => [s.subscriptionId, s.reason])).toEqual([
      ["d", "status canceled"],
      ["e", "ending at period end"],
      ["f", "not on an old price"],
    ]);
  });
});
```

Run: `npx vitest run src/lib/__tests__/stripe-price-migration.test.ts`. Expected: FAIL (module missing). If vitest's include pattern excludes `scripts/`, keep the test under `src/lib/__tests__` as written; it imports across directories.

- [ ] **Step 2: Implement the pure module**

```ts
// scripts/stripe/price-migration.ts
export type SubLite = { id: string; status: string; cancel_at_period_end: boolean; items: { id: string; price: string }[] };

// Scripts must not touch live Stripe by accident: .env.local holds a LIVE key.
export function assertKeyMode(key: string | undefined, allowLive: boolean): "test" | "live" {
  if (!key) throw new Error("Stripe key missing");
  if (key.startsWith("sk_test_")) return "test";
  if (key.startsWith("sk_live_")) {
    if (!allowLive) throw new Error("Refusing a live Stripe key without --live");
    return "live";
  }
  throw new Error("Unrecognized Stripe secret key type");
}

const MOVABLE = new Set(["active", "trialing", "past_due"]);

export function planPriceMigration(subs: SubLite[], oldPriceIds: string[], newPriceId: string) {
  const updates: { subscriptionId: string; itemId: string }[] = [];
  const skipped: { subscriptionId: string; reason: string }[] = [];
  for (const s of subs) {
    if (!MOVABLE.has(s.status)) { skipped.push({ subscriptionId: s.id, reason: `status ${s.status}` }); continue; }
    if (s.cancel_at_period_end) { skipped.push({ subscriptionId: s.id, reason: "ending at period end" }); continue; }
    const item = s.items.find((i) => oldPriceIds.includes(i.price) && i.price !== newPriceId);
    if (!item) { skipped.push({ subscriptionId: s.id, reason: "not on an old price" }); continue; }
    updates.push({ subscriptionId: s.id, itemId: item.id });
  }
  return { updates, skipped };
}
```

Run the test. Expected: PASS.

- [ ] **Step 3: The two CLI scripts** (run with `npx tsx`; check `npx tsx --version` first, and if tsx is unavailable use `node --experimental-strip-types` and ledger the ruling).

`scripts/stripe/create-test-prices.ts`:
- Uses `STRIPE_TEST_SECRET_KEY` and calls `assertKeyMode(key, false)`.
- Finds or creates the product "KairosLearn Pro" (metadata `kl_product=pro`).
- Finds or creates the prices by `lookup_key`: `kl_pro_monthly_1500` ($15.00 USD, `recurring.interval=month`) and `kl_pro_yearly_9900` ($99.00 USD, `interval=year`).
- Prints both price IDs and "mode: test". Running it again creates nothing new.

`scripts/stripe/migrate-pro-price.ts --old=<price_id>[,<price_id>] --new=<price_id> [--apply --expect=<n>] [--live]`:
- Uses `STRIPE_SECRET_KEY` and calls `assertKeyMode(key, argv.includes("--live"))`.
- Pages through `stripe.subscriptions.list({ status: "all", price: old, limit: 100 })` for each old price and maps to `SubLite`.
- Prints the plan: counts, plus subscription IDs only (no customer emails).
- Without `--apply`, it stops there (dry-run).
- With `--apply`, it requires `--expect=<n>` equal to `updates.length` and aborts otherwise.
- For each update, it calls `stripe.subscriptions.update(id, { items: [{ id: itemId, price: new }], proration_behavior: "none" })`. The new price applies from the next renewal invoice.
- It prints one line per result and exits nonzero if any update fails.

- [ ] **Step 4: Draft the notice.** Write `docs/handoff/pro-price-change-notice.md`:
  - a subject line and a short body: Pro goes from $12 to $15/month starting with the first renewal on or after `<date>`; the $99/year option; how to cancel from the billing portal before then; a thank-you.
  - a checklist: 1) the founder sends it; 2) wait the notice period (the founder decides, 30 days suggested); 3) run the dry-run; 4) run `--apply --expect=N --live`.

- [ ] **Step 5: Test-mode run (only if `STRIPE_TEST_SECRET_KEY` is set).**
  - `npx tsx scripts/stripe/create-test-prices.ts`. Expected: two price IDs and "mode: test". Run it again and confirm the same IDs come back.
  - `STRIPE_SECRET_KEY=$STRIPE_TEST_SECRET_KEY npx tsx scripts/stripe/migrate-pro-price.ts --old=<test monthly id> --new=<test monthly id>`. Expected: a dry-run listing 0 updates.
  - If the key isn't set, ledger `Task 3: test-mode run not executed — STRIPE_TEST_SECRET_KEY not provided`.

- [ ] **Step 6: Commit**

```bash
git add scripts/stripe/price-migration.ts scripts/stripe/create-test-prices.ts scripts/stripe/migrate-pro-price.ts src/lib/__tests__/stripe-price-migration.test.ts docs/handoff/pro-price-change-notice.md
git commit -m "feat(billing): test-mode price creation and dry-run-first \$12→\$15 subscription migration"
```

### Task 4: Signup gives 200 credits and a 7-day trial

**Files:**
- Create: `supabase/migrations/20260925_pricing_200_credits_7day_trial.sql`
- Modify: `src/lib/credits.ts` (the fallback grant uses `PRICING.free.signupCredits`)
- Test: `src/lib/__tests__/credits-signup.test.ts`

**Interfaces:**
- Consumes: `PRICING` from Task 1.

- [ ] **Step 1: Failing tests**

```ts
// src/lib/__tests__/credits-signup.test.ts
import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";

const h = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/lib/supabase-auth", () => ({
  createAdminSupabase: () => ({
    rpc: h.rpc,
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }),
  }),
}));
import { deductCredits } from "../credits";

describe("signup credits", () => {
  it("backfills a missing credit row with 200, not 300", async () => {
    h.rpc.mockImplementation(async (fn: string) => ({ data: fn === "deduct_credits" ? false : 200, error: null }));
    await deductCredits("u1", 1, "coach_text");
    expect(h.rpc).toHaveBeenCalledWith("add_credits", { p_user_id: "u1", p_amount: 200, p_action: "signup_bonus" });
  });

  it("the migration grants 200 credits and a 7-day trial", () => {
    const sql = fs.readFileSync("supabase/migrations/20260925_pricing_200_credits_7day_trial.sql", "utf8");
    expect(sql).toMatch(/VALUES \(NEW\.id, 200\)/);
    expect(sql).toMatch(/VALUES \(NEW\.id, 200, 'signup_bonus'\)/);
    expect(sql).toMatch(/INTERVAL '7 days'/);
    expect(sql).not.toMatch(/300|INTERVAL '30 days'/);
  });
});
```

Run: `npx vitest run src/lib/__tests__/credits-signup.test.ts`. Expected: FAIL (it grants 300; the migration is missing).

- [ ] **Step 2: Implement.** In `src/lib/credits.ts`, import `PRICING` and replace the literal `300` in the fallback (and its comment) with `PRICING.free.signupCredits`. Create the migration: copy `handle_new_user()` verbatim from `supabase/migrations/012_shorten_trial_to_7_days.sql` (the latest definition) and change only the credit amounts to `200` and the comment to "(200 free, once)". Copy `create_signup_pro_trial()` from `20260502_signup_pro_trial.sql` and change the interval to `'7 days'`. Header:

```sql
-- Pricing 2026-09-25 (founder): Free = 200 credits once at signup; Pro trial = 7 days.
-- Redefines handle_new_user (from 012) and create_signup_pro_trial (from 20260502,
-- which had re-introduced 30 days after 013). New signups only; existing
-- balances and trials are unchanged. Additive and idempotent (CREATE OR REPLACE).
-- NOT applied to production until the founder approves.
```

Drop and recreate both triggers exactly as their source migrations do. Do not include the 20260502 backfill block.

- [ ] **Step 3: Run.** `npx vitest run src/lib/__tests__/credits-signup.test.ts`. Expected: 2/2.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260925_pricing_200_credits_7day_trial.sql src/lib/credits.ts src/lib/__tests__/credits-signup.test.ts
git commit -m "feat(credits): new signups get 200 credits and a 7-day Pro trial (migration not applied)"
```

### Task 5: Pro fair use

**Files:**
- Modify: `src/lib/cc/tier-gate.ts`
- Test: `src/lib/cc/__tests__/tier-gate-fair-use.test.ts`

**Interfaces:**
- Produces:
  - `TIER_CAPS.pro.coachMessagesPerDay` = `proFairUse("PRO_FAIR_USE_COACH_MESSAGES_PER_DAY", 300)`.
  - `TIER_CAPS.pro.coachVoiceMinutesPerDay` = `proFairUse("PRO_FAIR_USE_VOICE_MINUTES_PER_DAY", 120)`.
  - `blockedResponse` returns **429** `{ error, fairUse: true, tier: "pro", capability, limit }` for a Pro block, and 402 otherwise (unchanged).

- [ ] **Step 1: Failing test**

```ts
// src/lib/cc/__tests__/tier-gate-fair-use.test.ts
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  createAdminSupabase: () => ({
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { tier: "pro" } }) }) }) }),
  }),
}));
import { TIER_CAPS, assertCapacity, blockedResponse } from "../tier-gate";

describe("Pro fair use", () => {
  it("caps Pro coach messages and voice minutes at fair-use defaults", () => {
    expect(TIER_CAPS.pro.coachMessagesPerDay).toBe(300);
    expect(TIER_CAPS.pro.coachVoiceMinutesPerDay).toBe(120);
  });

  it("a Pro user over the limit gets a 429 fair-use response, not a paywall", async () => {
    const r = await assertCapacity("u1", "coachMessagesPerDay", 300);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    const res = blockedResponse(r);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.fairUse).toBe(true);
    expect(body.error).toMatch(/fair[- ]use/i);
  });
});
```

Before running, read `getTier` (tier-gate.ts:104) and match the mock to its real query chain (`v_user_tier`). If the chain differs, fix the mock, not the code, and ledger that. Run: `npx vitest run src/lib/cc/__tests__/tier-gate-fair-use.test.ts`. Expected: FAIL (Pro is `Infinity`).

- [ ] **Step 2: Implement**

```ts
// Pro is "unlimited" under fair use (founder, 2026-09-25): generous daily
// caps that stop runaway or automated use, tunable without a deploy.
function proFairUse(envName: string, fallback: number): number {
  const n = Number(process.env[envName]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
```

Set the two Pro caps as specified. In `reasonFor`, when `tier === "pro"` return `"You've reached today's fair-use limit for this feature. It resets at midnight UTC."`. In `blockedResponse`, when `blocked.tier === "pro"` return status 429 with `fairUse: true` in the JSON body (`upgradeTo` omitted).

- [ ] **Step 3: Run.** `npx vitest run src/lib/cc/__tests__/tier-gate-fair-use.test.ts && npx tsc --noEmit -p .`. Expected: PASS, tsc 0.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cc/tier-gate.ts src/lib/cc/__tests__/tier-gate-fair-use.test.ts
git commit -m "feat(tiers): Pro fair-use daily caps with a 429 fair-use response"
```

### Task 6: Credit reservations (reserve → capture | release) for the agent

**Files:**
- Create: `supabase/migrations/20260925_credit_reservations.sql`
- Create: `src/lib/credit-reservations.ts`; Test: `src/lib/__tests__/credit-reservations.test.ts`
- Create: `tests/billing-local/credit-reservations.sql` (run only against a local Docker Postgres)

**Interfaces:**
- Produces:
  - `makeCreditBilling(userId: string): BillingPort`, where `BillingPort = { reserve(operationKey: string, maxCredits: number): Promise<void>; capture(operationKey: string, finalCredits: number): Promise<void>; release(operationKey: string): Promise<void> }`. This matches Astra plan a2 Task 3.
  - Errors are thrown as `BillingError` with `code: "insufficient_credits" | "reservation_conflict" | "already_captured" | "already_released" | "not_reserved" | "over_reservation" | "billing_unavailable"`.
  - RPCs: `reserve_credits(p_user_id uuid, p_key text, p_max int) returns text`, `capture_credits(p_user_id uuid, p_key text, p_final int) returns text`, `release_credits(p_user_id uuid, p_key text) returns text`. Each returns `'ok'` or an error code.

- [ ] **Step 1: Failing TS test.** The rpc is faked with an in-memory state machine that mirrors the SQL, so the wrapper's mapping and idempotency contract are pinned.

```ts
// src/lib/__tests__/credit-reservations.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ result: "ok" as string | null, error: null as unknown, calls: [] as unknown[][] }));
vi.mock("@/lib/supabase-auth", () => ({
  createAdminSupabase: () => ({
    rpc: async (fn: string, args: unknown) => { h.calls.push([fn, args]); return { data: h.result, error: h.error }; },
  }),
}));
import { makeCreditBilling } from "../credit-reservations";

beforeEach(() => { h.result = "ok"; h.error = null; h.calls = []; });

describe("makeCreditBilling", () => {
  const billing = makeCreditBilling("u1");

  it("passes the actor, key and amount to the RPCs", async () => {
    await billing.reserve("op-1", 3);
    await billing.capture("op-1", 1);
    await billing.release("op-2");
    expect(h.calls).toEqual([
      ["reserve_credits", { p_user_id: "u1", p_key: "op-1", p_max: 3 }],
      ["capture_credits", { p_user_id: "u1", p_key: "op-1", p_final: 1 }],
      ["release_credits", { p_user_id: "u1", p_key: "op-2" }],
    ]);
  });

  it.each(["insufficient_credits", "reservation_conflict", "already_captured", "already_released", "not_reserved", "over_reservation"])(
    "maps %s to a BillingError", async (code) => {
      h.result = code;
      await expect(billing.reserve("op", 1)).rejects.toMatchObject({ name: "BillingError", code });
    });

  it("maps an RPC failure to billing_unavailable (never treated as success)", async () => {
    h.result = null; h.error = { message: "down" };
    await expect(billing.capture("op", 1)).rejects.toMatchObject({ code: "billing_unavailable" });
  });

  it("rejects negative or non-integer amounts before calling the database", async () => {
    await expect(billing.reserve("op", -1)).rejects.toMatchObject({ code: "over_reservation" });
    await expect(billing.capture("op", 1.5)).rejects.toMatchObject({ code: "over_reservation" });
    expect(h.calls).toEqual([]);
  });
});
```

Run: `npx vitest run src/lib/__tests__/credit-reservations.test.ts`. Expected: FAIL (module missing).

- [ ] **Step 2: Implement the wrapper**

```ts
// src/lib/credit-reservations.ts
// Exactly-once credit settlement for multi-step operations (agent turns,
// refresh jobs): reserve holds credits, capture keeps the final amount and
// refunds the rest, release refunds everything. The database enforces
// idempotency per (user, operationKey); see 20260925_credit_reservations.sql.
import { createAdminSupabase } from "@/lib/supabase-auth";

export type BillingErrorCode =
  | "insufficient_credits" | "reservation_conflict" | "already_captured" | "already_released"
  | "not_reserved" | "over_reservation" | "billing_unavailable";

export class BillingError extends Error {
  name = "BillingError";
  constructor(public code: BillingErrorCode) { super(code); }
}

export interface BillingPort {
  reserve(operationKey: string, maxCredits: number): Promise<void>;
  capture(operationKey: string, finalCredits: number): Promise<void>;
  release(operationKey: string): Promise<void>;
}

const CODES = new Set<string>(["insufficient_credits", "reservation_conflict", "already_captured", "already_released", "not_reserved", "over_reservation"]);

export function makeCreditBilling(userId: string): BillingPort {
  const call = async (fn: string, args: Record<string, unknown>) => {
    const { data, error } = await createAdminSupabase().rpc(fn, args);
    if (error || typeof data !== "string") throw new BillingError("billing_unavailable");
    if (data === "ok") return;
    throw new BillingError(CODES.has(data) ? (data as BillingErrorCode) : "billing_unavailable");
  };
  const amount = (n: number) => { if (!Number.isInteger(n) || n < 0) throw new BillingError("over_reservation"); return n; };
  return {
    reserve: async (key, max) => call("reserve_credits", { p_user_id: userId, p_key: key, p_max: amount(max) }),
    capture: async (key, final) => call("capture_credits", { p_user_id: userId, p_key: key, p_final: amount(final) }),
    release: async (key) => call("release_credits", { p_user_id: userId, p_key: key }),
  };
}
```

Run the test. Expected: PASS.

- [ ] **Step 3: The migration**

```sql
-- supabase/migrations/20260925_credit_reservations.sql
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
```

Before writing it, confirm `credit_txns` has `ref_id` (`002_auth_credits.sql:103` inserts it) and that `user_credits` has no balance cap that a refund could violate. `add_credits` caps at 5000, but these refunds return held credits, so they don't use it.

- [ ] **Step 4: Local SQL test (Docker only).** Write `tests/billing-local/credit-reservations.sql`. It creates minimal `auth.users`, `user_credits` and `credit_txns` stubs, applies the migration, then asserts with `DO $$ … ASSERT … $$` blocks:
  - reserve 3 from a balance of 5 leaves 2;
  - repeating the same reserve returns `ok` and the balance stays 2;
  - reserve with the same key and max 4 returns `reservation_conflict`;
  - capture 1 leaves a balance of 4 (2 + refund 2);
  - repeating capture 1 returns `ok` and the balance stays 4;
  - capture 2 afterwards returns `already_captured`;
  - release after capture returns `already_captured`;
  - reserve then release restores the balance;
  - releasing twice returns `ok` with no double refund;
  - reserve beyond the balance returns `insufficient_credits`.

  Run it only when the Docker engine is up: `docker run --rm -d --name kl-billing-test -e POSTGRES_PASSWORD=local -p 127.0.0.1:55440:5432 postgres:16`, then `psql "postgresql://postgres:local@127.0.0.1:55440/postgres" -v ON_ERROR_STOP=1 -f tests/billing-local/credit-reservations.sql`, then `docker rm -f kl-billing-test`. Expected: exit 0. If Docker isn't running, ledger `Task 6: SQL test not executed — Docker engine not running` and list it as outstanding. Never point it at any other database.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260925_credit_reservations.sql src/lib/credit-reservations.ts src/lib/__tests__/credit-reservations.test.ts tests/billing-local/credit-reservations.sql
git commit -m "feat(credits): reserve/capture/release credit settlement for agent operations (migration not applied)"
```

### Task 7: Verification

- [ ] `npx vitest run src > <workspace>/suite.log 2>&1`: all pass. `npx tsc --noEmit -p .`: 0. `npm run build`: 0.
- [ ] With the dev server running, check `/pricing` at 375px and at 1440px in the browser. It should show $15/month, $99/year (save 45%), a 7-day trial and 200 credits, and no $12 anywhere. Click "Get Pro yearly" while signed out and confirm it routes to login. **Do not complete a checkout: the app's key is live.**
- [ ] If `STRIPE_TEST_SECRET_KEY` is set, run the dev server with `STRIPE_SECRET_KEY` overridden to the test key and the two `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_*` vars set to the test price IDs. As qa-s2, open checkout for each interval and confirm the Stripe page shows $15.00/month and $99.00/year. Pay with 4242 4242 4242 4242 only in test mode, and only if the key check prints "test".
- [ ] Update `docs/handoff/claude-progress.md` item 4. List what the founder must do:
  1. Create the live prices, or approve Claude doing it.
  2. Set `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY` (the new $15 price) and `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY` in Vercel.
  3. Approve both migrations.
  4. Send the notice, wait, then run the price migration.
  5. Review the terms and privacy wording.
