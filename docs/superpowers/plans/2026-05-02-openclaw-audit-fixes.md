# OpenClaw Audit Fixes — Action Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every Sev-1, Sev-2, and Sev-3 bug from `docs/reports/2026-05-02-openclaw-audit-result.md` so production stops bleeding revenue (Stripe broken) and stops asking onboarded users for their name and grade again (cross-persona regression).

**Architecture:** Most fixes are surgical (env var, single-line column, missing query field). One root-cause fix — `onboarding/complete` not writing `intake_completed_at` — closes the cross-persona "coach forgot my name" regression in one place.

**Tech Stack:** Next.js 16, TypeScript 5, Supabase, Stripe, OpenRouter (Sonnet 4.6), Resend.

**Critical context — audit may be partially stale:** the audit ran against commit `263c25e` but Vercel may have served an older deploy. Items `AUD-X-001` ($10/mo) and `AUD-P1-001` (G9 essay gate) had fixes in commits `7634a08` and `6977d7f` *that same day*. Step 0 below is a deploy-verification — anything verified-already-fixed gets struck off the list.

---

## Task 0: Deploy verification — strike off already-fixed items

**Files:** none (verification only).

- [ ] **Step 1: Confirm latest commit is deployed.** Check Vercel dashboard → Deployments. Top deployment hash should be `263c25e` or later. If older, click "Redeploy" on master → wait until ✅ Ready.

- [ ] **Step 2: Spot-check the four items that may already be fixed in master.** Open production:
  - `/landing` — search page text for "$10". Expected: zero matches (we replaced with $12 in `7634a08`).
  - `/cc/dashboard?blocked=grade9` — banner should render ("That tool unlocks junior year"). If no banner, the fix from `6977d7f` isn't deployed.
  - As a grade-9 test user, navigate directly to `/cc/essays` — should redirect to `/cc/dashboard?blocked=grade9`. If it loads the essay studio, the middleware isn't deployed (or has a bug).
  - `/pricing` — price says $12 (we already verified this is right in master).

- [ ] **Step 3: Document what's still broken vs. what was just stale.** Update the audit's bug backlog markdown with `[VERIFIED FIXED 2026-05-02]` next to any item the spot-check passes.

- [ ] **Step 4: Commit the audit-result note update.**
  ```bash
  git add docs/reports/2026-05-02-openclaw-audit-result.md
  git commit -m "docs(audit): annotate items already fixed in master pre-redeploy"
  ```

---

## Task 1: AUD-X-005 (Sev-1) — Stripe price ID broken in production

**Files:**
- Verify: `.env.local` has `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY`
- Modify: Vercel env vars (Production scope)
- Source: `src/app/api/billing/stripe/checkout/route.ts:17`

The audit's exact error: `"No such price: 'price_1TSMqEEO913z4zPDsWpwqsOt'"`. That price ID doesn't exist in your live Stripe account. Either it was deleted, is a test-mode price ID set in production, or the env var got copied across environments wrong.

- [ ] **Step 1: Get a valid live price ID.** Stripe Dashboard → toggle to **Live mode** (top right) → Products → KairosLearn Pro → Pricing section. Copy the `price_…` ID for the $12/mo recurring price. If the product itself is missing, create:
  - Product: "KairosLearn Pro Monthly"
  - Price: $12.00 USD, Recurring monthly, no trial inside Stripe (we set the 30-day trial in code at `checkout/route.ts:72`).
  - Copy the new `price_…` ID.

- [ ] **Step 2: Update Vercel.**
  ```bash
  vercel env rm NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY production
  vercel env add NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY production
  # paste the live price ID
  vercel --prod
  ```

- [ ] **Step 3: Smoke test on prod with Stripe test mode.** Toggle Stripe to test mode, set the test-mode price ID to a Vercel preview env, hit `/pricing` → "Start Pro" → use card `4242 4242 4242 4242` → confirm landing on `/?upgraded=1&session_id=…`.

- [ ] **Step 4: Verify in Supabase.** After the test purchase, run in SQL editor:
  ```sql
  select user_id, plan, status, stripe_subscription_id, current_period_end
  from user_subscriptions
  where user_id = '<test_user_uuid>';
  ```
  Expected: `plan='pro'`, `status='trialing'`. If empty, the webhook isn't firing — check Stripe Dashboard → Developers → Webhooks → recent events for 200 OK.

- [ ] **Step 5: Commit nothing (env var only).** Note the fix in the bug backlog markdown:
  ```bash
  # in docs/reports/2026-05-02-openclaw-audit-result.md
  # change AUD-X-005 row to: "AUD-X-005 [FIXED 2026-05-02 env-var update]"
  git add docs/reports/2026-05-02-openclaw-audit-result.md
  git commit -m "docs(audit): mark AUD-X-005 fixed (Stripe price ID)"
  ```

---

## Task 2: AUD-P1-002 (Sev-2) — Coach asks name/grade after onboarding (root cause)

**Files:**
- Modify: `src/app/api/cc/onboarding/complete/route.ts:56`

**Why this is the most important Sev-2:** every persona regressed on this. Coach sees `hasIntakeCompleted=false` because the new `/onboarding` flow only sets `language_picker_seen_at`, not `intake_completed_at`. Mode detector then picks `intake` mode, which makes the coach ask name + grade per `coach-prompt-builder.ts:269`.

The new onboarding collects role + grade + transfer + concerns — that's the same level of intake the old flow asked for. Setting both columns at completion is correct.

- [ ] **Step 1: Read the current update payload** at `src/app/api/cc/onboarding/complete/route.ts` to confirm structure.

- [ ] **Step 2: Modify the payload.** Add `intake_completed_at`:
  ```typescript
  // around line 56 of src/app/api/cc/onboarding/complete/route.ts
  // (before the upsert call)
  const now = new Date().toISOString();
  const payload = {
    // ...existing fields...
    language_picker_seen_at: now,
    // The new multi-step onboarding collects role, grade/transfer, and
    // concerns — the same identity surface the legacy /intake captured.
    // Setting intake_completed_at here prevents the coach mode-detector
    // from re-running intake (asking name + grade again on every first
    // turn). See AUD-P1-002 in the 2026-05-02 OpenClaw audit.
    intake_completed_at: now,
  };
  ```

- [ ] **Step 3: Backfill existing onboarded users.** Anyone who completed the new onboarding before this fix has `language_picker_seen_at` but null `intake_completed_at`. Backfill in Supabase SQL editor:
  ```sql
  update cc_student_profiles
  set intake_completed_at = language_picker_seen_at
  where language_picker_seen_at is not null
    and intake_completed_at is null;
  ```

- [ ] **Step 4: Smoke test.** As a fresh signup, complete onboarding, then open Coach Kairos with "Hi Kairos." Expected: coach references your grade (because variant context is set) and does NOT ask "What's your name and grade?"

- [ ] **Step 5: Commit.**
  ```bash
  git add src/app/api/cc/onboarding/complete/route.ts
  git commit -m "fix(coach): mark intake complete when onboarding completes (AUD-P1-002)

The new multi-step /onboarding flow captured role, grade, transfer,
concerns — but only set language_picker_seen_at. Coach Kairos's mode
detector keys off intake_completed_at, so onboarded users were
treated as needing intake and the coach asked their name+grade on
every first turn. Cross-persona regression confirmed in the OpenClaw
audit (P1, P2, P3, P4, P5 all hit it).

Set both columns at onboarding-complete. Backfill SQL provided
inline below for existing rows.

Co-Authored-By: claude-flow <ruv@ruv.net>"
  ```

---

## Task 3: AUD-P3-002 (Sev-2) — Pro trial not activating

**Files:**
- Investigate: signup trigger / Supabase function
- Verify: `user_subscriptions` insert behavior on new account

The audit found new signups have `tier: "free"` despite the marketing promising "1 month Pro." Either:
- A signup trigger should insert `user_subscriptions` row with `plan='pro' status='trialing'` and isn't.
- The tier-gate code (`src/lib/cc/tier-gate.ts`) is reading the wrong source.

- [ ] **Step 1: Read tier-gate logic.** Open `src/lib/cc/tier-gate.ts` and grep for `'free'` / `'pro'` / `tier`. Find which table/column drives the tier output.

- [ ] **Step 2: Inspect `user_subscriptions` for any audit user.** SQL editor:
  ```sql
  select user_id, plan, status, current_period_end, created_at
  from user_subscriptions
  where user_id in (
    select id from auth.users where email like 'audit-%@kairos-audit.test'
  );
  ```
  If empty, no subscription row was ever created → no trial → tier-gate falls back to free.

- [ ] **Step 3: Decide on a fix.** Two options, pick whichever matches existing intent:

  **Option A — backfill at signup (cleaner long-term):** Add a Postgres trigger on `auth.users INSERT` that inserts a 30-day trial row in `user_subscriptions`. Migration:
  ```sql
  -- supabase/migrations/20260502_signup_pro_trial.sql
  create or replace function public.create_signup_pro_trial()
  returns trigger as $$
  begin
    insert into public.user_subscriptions (user_id, plan, status, current_period_start, current_period_end, cancel_at_period_end)
    values (
      new.id, 'pro', 'trialing',
      now(), now() + interval '30 days', false
    )
    on conflict (user_id) do nothing;
    return new;
  end;
  $$ language plpgsql security definer;

  drop trigger if exists on_auth_user_created_trial on auth.users;
  create trigger on_auth_user_created_trial
    after insert on auth.users
    for each row execute function public.create_signup_pro_trial();
  ```

  **Option B — derive trial in tier-gate (quicker):** in `src/lib/cc/tier-gate.ts`, treat any user whose `auth.users.created_at` is within the last 30 days as `pro/trialing` even if no `user_subscriptions` row exists. Faster ship but messier; only viable if Pro features check tier-gate, not the table directly.

  Pick **Option A** unless there's a constraint that prevents it. The plan-auditor's note: when the user upgrades (Stripe webhook), `upsertSubscription` already exists at `src/app/api/billing/stripe/webhook/route.ts:103` and uses `on conflict do update`, so the trial row will be replaced cleanly.

- [ ] **Step 4: Implement Option A** — write the migration above, apply via Supabase SQL editor.

- [ ] **Step 5: Backfill existing free-tier users.** Run once:
  ```sql
  insert into public.user_subscriptions (user_id, plan, status, current_period_start, current_period_end, cancel_at_period_end)
  select id, 'pro', 'trialing', created_at, created_at + interval '30 days', false
  from auth.users
  where created_at > now() - interval '30 days'
    and id not in (select user_id from public.user_subscriptions where user_id is not null)
  on conflict (user_id) do nothing;
  ```

- [ ] **Step 6: Smoke test.** Fresh signup → check `/api/cc/me` → tier should be `pro`. Try generating a counselor share-link → should succeed (CC-2 was blocked by this same gate).

- [ ] **Step 7: Commit.**
  ```bash
  git add supabase/migrations/20260502_signup_pro_trial.sql
  git commit -m "fix(billing): auto-create 30-day Pro trial on signup (AUD-P3-002)"
  ```

---

## Task 4: AUD-P4-001 (Sev-2) — Family Mode "Hand to parent" disabled in Urdu

**Files:**
- Investigate: `src/components/family-mode/HandToParentButton.tsx` (24 lines)
- Possibly modify: `src/components/family-mode/FamilyModeView.tsx`

Spec said voice is text-only for Urdu, but Family Mode itself is text + voice. The button should still work for parents who can read Urdu — the voice toggle inside Family Mode should be the thing that's grayed out, not the entire entry point.

- [ ] **Step 1: Read `HandToParentButton.tsx`.** Find where it disables based on language.

- [ ] **Step 2: Decouple voice availability from button enabled state.** The button should always be enabled if `language` is one of the 17 supported parent languages. Voice availability is a property of the FamilyModeView, set per-language.
  ```typescript
  // around the button's disabled prop:
  // BEFORE: disabled={!voiceAvailable}
  // AFTER:  disabled={false}  // any supported language can use family-mode (text)
  // The FamilyModeView itself handles voice fallback when voiceAvailable is false.
  ```

- [ ] **Step 3: Inside FamilyModeView**, ensure the mic/voice toggle is the thing that's disabled for Urdu, with copy "Voice for Urdu coming soon — text-only available." Keep the text input enabled.

- [ ] **Step 4: Smoke test.** Sign in as Hassan-equivalent (Urdu). Open coach drawer. "Hand to parent" should be enabled and clickable. Inside Family Mode, voice button greyed; text works.

- [ ] **Step 5: Commit.**
  ```bash
  git add src/components/family-mode/
  git commit -m "fix(family-mode): enable hand-to-parent for Urdu users — disable only voice (AUD-P4-001)"
  ```

---

## Task 5: AUD-P4-003 (Sev-2) — International filters not in `/schools` Browse

**Files:**
- Modify: `src/app/schools/` Browse component (likely a `BrowseFilters` or `FilterBar` sub-component)
- Verify: `cc_schools` table has `meets_full_need_intl`, `is_need_blind_intl`, `requires_css_profile` columns (migration `1a9e6e4`)

Migration shipped 30 schools with intl-aid policy columns but no UI surfaces them. Fix is one filter row + WHERE clauses.

- [ ] **Step 1: Locate the Browse filter UI.** Search:
  ```bash
  grep -rn "is_need_blind_intl\|meets_full_need_intl" src --include="*.tsx" --include="*.ts" 2>/dev/null
  ```

- [ ] **Step 2: Add three filter checkboxes** above the school list:
  - "Need-blind for international students"
  - "Meets full demonstrated need"
  - "Requires CSS Profile" (informational, not a filter — surface as a badge on cards)

- [ ] **Step 3: Wire WHERE clauses** in the Browse query:
  ```typescript
  const query = supabase.from("cc_schools").select("*");
  if (filters.needBlindIntl) query.eq("is_need_blind_intl", true);
  if (filters.meetsFullNeed) query.eq("meets_full_need_intl", true);
  ```

- [ ] **Step 4: Surface badges on each school card** when those columns are true. Reuse the existing `Badge` component if there is one.

- [ ] **Step 5: Smoke test.** Apply both filters → should narrow to ~6-8 schools (MIT, Harvard, Yale, Princeton, Stanford, Amherst, Williams, Bowdoin per migration `1a9e6e4`).

- [ ] **Step 6: Commit.**
  ```bash
  git add src/app/schools/
  git commit -m "fix(schools): expose intl-aid filters + badges in Browse (AUD-P4-003)"
  ```

---

## Task 6: AUD-X-002 + AUD-X-003 (Sev-2/3) — Branding + price inconsistencies

**Files:**
- Search-and-replace across signup / nav / landing copy

- [ ] **Step 1: Find all "Kairos.ai" instances.**
  ```bash
  grep -rn "Kairos\.ai\|kairos\.ai" src --include="*.tsx" --include="*.ts" --include="*.json" 2>/dev/null | grep -v node_modules
  ```
  Replace each with `KairosLearn` (display) or `kairoslearn.com` (domain).

- [ ] **Step 2: Re-grep for any remaining $10 or $15 in pricing copy.**
  ```bash
  grep -rn '\$10/mo\|\$10/month\|\$15/mo\|\$15 CAD' src --include="*.tsx" --include="*.ts" 2>/dev/null
  ```
  Audit found a $15 badge somewhere. Find and replace.

- [ ] **Step 3: Smoke test.** Open `/landing`, `/pricing`, `/signup`, top nav — every visible price says $12, every visible brand says KairosLearn.

- [ ] **Step 4: Commit.**
  ```bash
  git add src/
  git commit -m "fix(brand): consistent KairosLearn name + \$12 pricing (AUD-X-002, AUD-X-003)"
  ```

---

## Task 7: AUD-P1-004 (Sev-2) — G9 walkthrough shows senior steps

**Files:**
- Modify: `src/components/onboarding/DashboardWalkthrough.tsx` (or wherever the walkthrough lives)

Walkthrough copy is grade-agnostic but the audit showed it stepping a G9 user through senior surfaces (Draft PS, Essay Studio, Activities Optimizer). Make the walkthrough variant-aware.

- [ ] **Step 1: Find the walkthrough component.**
  ```bash
  grep -rn "DashboardWalkthrough\|WelcomeModal" src --include="*.tsx" 2>/dev/null
  ```

- [ ] **Step 2: Add a `variant` prop** to the walkthrough component.

- [ ] **Step 3: Define per-variant step lists.** For `g9`, the steps are: course rigor, clubs, summer plan, major quiz. NOT essays / applications / interview / SAT.

- [ ] **Step 4: Pass variant from `AdaptiveDashboard`** when triggering the walkthrough.

- [ ] **Step 5: Smoke test.** Fresh G9 signup → walkthrough shows ONLY g9-appropriate steps.

- [ ] **Step 6: Commit.**
  ```bash
  git add src/components/onboarding/ src/app/cc/dashboard/
  git commit -m "fix(walkthrough): variant-aware step list — no senior steps for g9 (AUD-P1-004)"
  ```

---

## Task 8: AUD-P1-003 + AUD-P3-003 (Sev-3) — Coach widget Essay Studio link for G9 + silent share-link failure

**Files:**
- Modify: coach widget link rendering (likely `src/components/cc/coach/CoachChat.tsx` or `CoachKairosShell.tsx`)
- Modify: share-link button click handler

- [ ] **Step 1: Find where Coach renders "Essay Studio →" CTAs in messages.** Likely the system prompt / suggestion chips. Filter chips by variant: g9 should never see Essay Studio.

- [ ] **Step 2: Modify share-link button** so free users get a CTA banner ("Upgrade to Pro to share with counselor → /pricing") instead of silent failure. Read the current handler at `/cc/share-settings/`.

- [ ] **Step 3: Smoke test.** As a G9 user, no Essay Studio chip in coach. As a free-tier user clicking share-link, see upgrade CTA.

- [ ] **Step 4: Commit.**
  ```bash
  git add src/
  git commit -m "fix(coach,share): grade-9 chips + share upgrade CTA (AUD-P1-003, AUD-P3-003)"
  ```

---

## Task 9: AUD-X-006 (Sev-3) — Claremont McKenna bad data

**Files:**
- Modify: `cc_schools` row for Claremont McKenna (data fix)

- [ ] **Step 1: Verify in SQL editor.**
  ```sql
  select name, acceptance_rate, net_price_avg from cc_schools where name ilike '%claremont%mckenna%';
  ```
  If `acceptance_rate=0` or `net_price_avg=0`, those are seed errors.

- [ ] **Step 2: Update with real values** (2024 IPEDS):
  ```sql
  update cc_schools
  set acceptance_rate = 0.10,
      net_price_avg = 33500
  where name ilike '%claremont%mckenna%';
  ```

- [ ] **Step 3: Audit other rows for similar zero-data.** Run:
  ```sql
  select name from cc_schools
  where (acceptance_rate = 0 or net_price_avg = 0)
    and name not ilike '%community%' and name not ilike '%online%';
  ```
  Any results = additional bad rows. Fix or quarantine.

- [ ] **Step 4: Commit no code, but record the fix.**
  ```bash
  # Add note to changelog or migration file:
  # supabase/migrations/20260502_claremont_data_fix.sql with the UPDATE above.
  git add supabase/migrations/20260502_claremont_data_fix.sql
  git commit -m "data(schools): fix Claremont McKenna zero-stat row (AUD-X-006)"
  ```

---

## Task 10: AUD-P3-001 + AUD-P5-001 (Sev-3, deferred) — Coach auto-add schools, transfer admit rates

**Why deferred:** Both are 4h+ and not Sev-1/2. Track them as backlog issues — implement after the urgent fixes ship.

- [ ] **Step 1: Open issues in your tracker** (linear / github issues / notion):
  - "Coach auto-add to schools list when user mentions 4 schools by name"
  - "Surface transfer admit rates in /schools Browse + per-school detail"

- [ ] **Step 2: Defer the work.** Note in audit result:
  ```
  AUD-P3-001 [DEFERRED] Tracking in issues #__
  AUD-P5-001 [DEFERRED] Tracking in issues #__
  ```

---

## Task 11: AUD-P4-002 + AUD-X-004 (Sev-4) — Polish

- [ ] **AUD-P4-002 — GPA calibration.** Open `src/lib/cc/gpa-converter.ts`, find the percentage-to-4.0 mapping for 85%. Currently outputs 3.40; spec band-table in `coach-prompt-builder.ts:289` says 80-89% = ~3.2-3.5. 3.40 is within that range. **No fix needed — close as wontfix.**

- [ ] **AUD-X-004 — Credits counter shows 0 on first render.** Add a loading state to the credits component so it shows `—` (em dash) until the fetch resolves, instead of `0`. 1h fix; defer or batch with future polish sprint.

---

## Final cleanup

- [ ] **Run typecheck:** `npx tsc --noEmit` — only the pre-existing unrelated e2e-spec error allowed.
- [ ] **Run unit tests:** `npx vitest run` — all green.
- [ ] **Run the variant drift smoke test:** `npx tsx -r dotenv/config scripts/test-variant-drift.ts dotenv_config_path=.env.local`. Expected: 0 drift.
- [ ] **Push:** `git push origin master`. Vercel auto-deploys.
- [ ] **Re-run a 1-persona OpenClaw smoke test** (Hassan only, ~$2.50 budget) to verify the Sev-2 list is closed. Update `2026-05-02-openclaw-audit-result.md` with verdicts.

---

## Self-review notes (for the reader)

- **Task 0 first** is non-negotiable — many "bugs" may be deploy lag. Don't waste time fixing what's already shipped.
- **Task 2** is the highest-value Sev-2 fix because it's cross-persona. One commit fixes 5 personas' first-turn experience.
- **Task 1** (Stripe) is Sev-1 but is a 15-min env-var fix. Don't over-engineer.
- **Task 3** (Pro trial) is the second-highest-leverage fix because it cascades into CC-2 (share-link), AUD-P3-003 (silent failure), and any other Pro-gated feature.
- The plan deliberately does NOT cover the Sev-3 deferreds (AUD-P3-001, AUD-P5-001) inline — they're 4h+ each and the audit flagged them as polish, not blockers. Track as issues, ship next sprint.
- Estimated total effort for Tasks 0-9 (Sev-1 + Sev-2 + immediate Sev-3): **~14 hours of one engineer**, mostly small surface-area changes.
