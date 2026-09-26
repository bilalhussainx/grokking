# Claude Code progress (read this instead of re-verifying)

Owner: the founder's Claude Code session. Astra (Codex) reads this file and
doesn't re-test what's recorded here. Newest work goes at the top.

## Queue

| # | Item | Status |
|---|---|---|
| 1 | Security holes (ownership and counselor review integrity) | **Done**: built, tested, live-verified, final review "ready to merge" (plans 1A and 1B). **Not deployed.** |
| 2 | Broken saves and dead pages: recommenders don't show after saving, transfer GPA dropped, Settings and net-price 404, Outline generation 500 (from Astra's D1) | **Done**: built, tested, live-verified, final review fixes applied (`b21b5a1`). **Not deployed.** Settings and `/cc/net-price` were already fixed on this branch (`1da0d10`); production 404s until it deploys. |
| 3 | Bug fixes from `docs/superpowers/plans/2026-08-17-essay-studio-roadmap.md` (Tasks 2-6; 7-11 go to Astra's D2/D4) | **Done**: `docs/superpowers/plans/2026-09-25-fix-3-august-bug-fixes.md`; built, tested, live-verified, final-review fix applied. **Not deployed.** |
| 4 | Stripe and credits for the new prices (Free 200 credits; $15/month; $99/year) | **Done in code**: `docs/superpowers/plans/2026-09-25-fix-4-stripe-credits-new-prices.md`; final-review fixes applied. Stripe prices created by Astra (`docs/handoff/stripe-setup-report.md`). **Credit lock-down applied in production 2026-09-26.** Branch not deployed; 3 other migrations not applied. |
| 5 | Competitor research, phone app (PWA), Ad Astra readiness, full testing of every student type | Queued |

## 2026-09-26 — Production security fix applied; CEO/CTO decisions

**Applied in production (the founder ran the SQL; Claude verified):**
`supabase/migrations/20260925_lock_down_credit_rpcs.sql`.
- Before: the public anon key could execute `add_credits`, `deduct_credits`
  and `get_credit_balance` for any user id. The probe used a nonexistent user
  id, so nothing was written.
- Before: production also had two `add_credits` overloads, so every
  3-argument call failed as ambiguous (PGRST203). That broke signup top-ups,
  refunds, invite credits and referral credits.
- After: the anon key gets permission denied on all three functions; the
  service-role `add_credits` resolves again; the verification table showed
  9 rows.

**Credit reservations:** `tests/billing-local/credit-reservations.sql` passes
against Docker Postgres 16, and so does the race test
(`credit-reservations-race.sh`): a concurrent same-key reserve waits, returns
ok, and holds credits once.

**Decisions (Claude as CEO/CTO, per the founder):**
- **Keep the founder's landing honesty edits** swept into `52a48d8`. They
  remove unsupported claims ($8,000, 120+ beta students, 40+ languages,
  alumni personas) and read the real language count, which matches the
  grounding rule. The flat wording goes to D3 as a copy note:
  `docs/handoff/codex-prompts/session-b-note-01-landing-copy.md`.
- **No $12→$15 migration or notice email.** Stripe shows 0 subscribers on
  the $12 prices.
- **UI/UX changes go to Codex** (session B) as detailed prompts; Claude fixes
  pure bugs (for example the 375px footer overflow and the optimizer off-by-one).

## Fix 4 — Stripe and credits for the new prices (2026-09-25)

Founder decisions: Free 200 credits once at signup; Pro $15/month or $99/year,
unlimited under fair use; 7-day trial; existing $12 subscribers move to $15 at
their next renewal after notice; Claude creates only test-mode prices.

- **One pricing module** (`src/lib/pricing.ts`). All copy reads from it, and a
  tripwire fails on $12, 300 credits, "500 credits/month", "Renews monthly",
  "no daily cap" and similar.
- **Checkout** takes `interval: month | year`, never falls back to monthly,
  and returns 409 (opening the billing portal) for anyone already
  subscribed. The yearly plan shows only when
  `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY` is set.
- **Pro doesn't spend credits.** Fair use is the limit: 300 coach messages
  and 120 voice minutes a day, env-tunable, returning a 429 with a clear
  message. Before this, 29 routes charged Pro and nothing refilled credits.
- **Signup:** 200 credits (the migration, plus ensure-profile, which had been
  topping new users back up to 300) and a 7-day trial that actually ends
  (`v_user_tier` treated `trialing` as Pro forever).
- **Credit reservations** (`reserve/capture/release`) for the agent, with
  idempotent keys, per-user lock ordering, and release-before-reserve
  tombstones.
- **Security:** a read-only production probe showed the public anon key can
  execute the credit functions. `add_credits`/`deduct_credits` take any user
  id, so anyone could mint up to 5000 credits for, or drain, any account.
  The migration `20260925_lock_down_credit_rpcs.sql` revokes that; the
  language refund routes now use the service role.
- **Webhook:** billing-period dates now come from subscription items (Stripe's
  current API); they were being stored as null.
- **Scripts:**
  - `scripts/stripe/create-test-prices.ts` refuses live keys.
  - `scripts/stripe/migrate-pro-price.ts` is dry-run by default and needs
    `--apply --expect=N --live`. It refuses price pairs whose interval,
    product or currency differ, and skips scheduled subscriptions.
  - Draft notice: `docs/handoff/pro-price-change-notice.md`.
- Suite **587/587**, tsc 0, build 0. `/pricing` checked at 375px and 1440px.
- **Founder actions before launch:**
  1. Add `STRIPE_TEST_SECRET_KEY` so the test prices and a test checkout can run.
  2. Create the live $15 and $99 prices and set both `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_*` in Vercel.
  3. Approve applying the three migrations. The credit-RPC lockdown is urgent.
  4. Start Docker so the reservation SQL test can run.
  5. Review the terms wording.
  6. Send the notice, wait 30 days, then dry-run and apply the migration script.
- Found, not fixed: the `/pricing` footer overflows 53px on phones; the
  activities optimizer blocks Pro users with exactly 10 activities (off by
  one); `/api/cron/*` uses a fragile `CRON_SECRET` comparison.

## Fix 3 — August bug fixes (2026-09-25)

Re-verified each August QA item against this branch. QA-01, 03 and 08 were
already fixed; QA-02 (ensure-profile 500) doesn't reproduce. Fixed:

- **Invite links survive sign-up (QA-23).** `/login`'s "Sign up" links and
  both Google buttons now carry `?next=`, so a new student from
  `/join/<code>` comes back to redeem it.
- **Open redirect on `/login?next=` (new).** `next` went straight to
  `window.location.assign`. `safeNextPath` now allows same-origin paths only,
  including the tab/LF/CR bypass the final review found (`/%09/evil.com`).
- **Students see their counselor (QA-05).** New `GET /api/cc/my-counselor`;
  the join page says "You're linked to <name>" with a Continue button; the
  dashboard shows "Your counselor: …". Live: qa-s1 sees "QA Counselor One ·
  QA Test Agency".
- **Counselors without an agency can create one (QA-04):** a create-workspace
  card on `/counselor/dashboard`.
- **Copy (QA-09):** readable essay-type labels on counselor screens; "Samsara
  account" → "KairosLearn account".
- **Glossary (QA-06):** public for guests; an error returns `{terms: []}`
  instead of 500. **Production `cc_glossary` has 0 rows. Seeding it needs the
  founder.**
- **Essay Studio on phones (QA-07).** At 375px the Revise text measured 0px
  wide and 93 elements overflowed. Now: text 309px, 0 overflow, no
  overlapping columns in Revise/Draft/Outline; desktop unchanged. New
  `.kl-studio-grid` / `.kl-studio-shell` and mobile `.kl-bs-subhead` /
  `.kl-phase-bar` rules in `tokens.css`.
- **Admin routes (security, found during verification).**
  `/api/admin/{invite-codes,league-reset,seed-courses}` are public in
  middleware and fell back to secrets committed in the repo when the env var
  was unset. They now fail closed. **Founder:** confirm `ADMIN_SECRET` and
  `TEACHER_SECRET_KEY` are set in Vercel (else these return 403/401), and
  consider auditing `invite_codes` for rows nobody on the team created.
- Suite **530/530**, tsc 0, build 0. Fresh final review (opus): 1 Critical
  (the redirect bypass above) fixed test-first; 9 minors deferred.
- Follow-up: `/api/cron/*` compares `Bearer ${CRON_SECRET ?? ""}`, which is
  fragile if `CRON_SECRET` is unset. Carried to the next security pass.

## Fix 2 — broken saves and dead pages (2026-09-25)

- **Recommenders:** production has no `cc_recommenders.created_at`, so every
  `order("created_at")` failed (42703) and callers showed an empty list.
  - The student list orders by `name` and returns 500 on error.
  - The page now says "Couldn't load your recommenders" with Retry instead of
    "No recommenders yet", and keeps the form when a save fails.
  - The parent/counselor **share link** had the same bug (always zero
    recommenders); fixed the same way.
  - POST saves `context_notes`.
  - Live: POST then GET listed the new recommender with notes.
- **Transfer GPA:** onboarding now saves it to `cc_academic_profiles`.
  `parseGpa` accepts "3.5", "3.5/4.0" and "3,65" (0 < n ≤ 5); anything else
  is ignored, never stored as a wrong number.
- **Settings / net-price 404:** fixed on the branch in `1da0d10`. A test now
  checks that every sidebar and palette link resolves to a real page.
- **Outline 500:** doesn't reproduce locally. `callLLMJSON` retries once on
  429/5xx/unparseable output and logs `[callLLMJSON:<label>] attempt N: ...`;
  after deploy, the real production cause shows in Vercel logs as
  `[callLLMJSON:outline]`. Outline asks for JSON mode, refunds the credit on
  failure, and returns a retryable 503. `callLLMJSON` has 11 call sites; only
  Outline uses JSON mode.
- **QA-02 (ensure-profile 500):** not reproducible. A fresh signup on this
  branch got 200 three times.
- Suite **482/482**, tsc 0. Fresh final review (opus): 3 Important found and
  fixed test-first; 6 minors deferred (refund wording, retry on truncation,
  stale raw-GPA columns, 5.0-scale label, fake payload checks, no
  context-notes field in the UI).

## Security 1A — student-data ownership

Plan: `docs/superpowers/plans/2026-09-25-security-1a-student-data-ownership.md`.
Commits `2ae3862..cdb456a` on `feat/counselor-marketplace`. **Not deployed.**

Fixed. Each hole was proven by a failing test before the fix:

- `PATCH /api/cc/essays/[id]/draft`: any user could overwrite any essay's draft.
- `POST /api/cc/essays/[id]/share`: minted **or returned an existing** public
  share link for any essay.
- `POST /api/cc/essays/[id]/outline` (save): any user could overwrite any
  essay's outline.
- `DELETE /api/cc/courses`: deleted any student's course.
- `PATCH` and `DELETE /api/cc/recommenders/[id]`: edited or deleted any
  recommender (including the teacher's email). `ask-email-text` wrote onto any
  recommender.
- `POST /api/cc/intake/link`: handed the caller another anonymous student's
  orphan profile. The adoption was removed; sessions still link.

What's new:

- `src/lib/cc/ownership.ts`: `isUuid`, `getStudentProfileId`, `getOwnedEssay`.
- `src/lib/cc/__tests__/helpers/{fake-supabase,fixtures}.ts`: an in-memory
  Supabase for route tests. Reuse it, and import routes statically.
- `src/app/api/__tests__/ownership-contract.test.ts`: a static tripwire that
  fails the suite when any `api/cc` or `api/counselor` handler writes through
  the service role without ownership logic.
- `vitest.config.ts`: `testTimeout` raised to 30s. First-import cost under
  parallel load was timing out tests, including pre-existing ones.

Evidence: `npx vitest run src` → **426/426**; `npx tsc --noEmit` → 0;
`npm run build` → 0.

## Security 1B — counselor review integrity

Plan: `docs/superpowers/plans/2026-09-25-security-1b-counselor-review-integrity.md`.
Commits `f9f9caa..c80010a`. **Not deployed.**

- Counselor comments can only land on the named student's own essays
  (`EssayNotOwnedError` → 404). Before, a counselor could inject feedback into
  any essay whose id they knew.
- Counselors see only their own agency's comments, in both the essay view and
  the list counts. Students still see all shipped feedback on their own essay.
- Supervised counselors (`requires_review`) can no longer set the review state
  (403), and the UI shows them a note instead of the buttons. Heads get a
  **Publish to student** control on draft comments.
- Invite codes can only be preassigned to members of the head's own agency.

## Security verification (2026-09-25)

- **Live local checks** (dev server against the production DB, QA accounts only):
  - qa-s2 against qa-s1's essay got 404 on draft, share, and outline-save.
  - Random-uuid course and recommender DELETEs got 404. The real query chain works; no 500s.
  - qa-s1's essay was unchanged: 187 words, no share token.
  - As qa-c1, a cross-student comment got 404; the legitimate essay view and student file both got 200.
- **Fresh whole-branch review (opus): ready to merge, 0 Critical, 0 Important.**
  One minor was re-graded and fixed: a student with duplicate profile rows could
  get 404 on their own writes. Ownership now accepts every profile the user owns
  (`95cd4b6`).
- **Production data audit (read-only):**
  - 21 essays, **0** with a share token, so no essay was exposed through the share hole.
  - **0 of 6** essay comments sit on another student's essay, so no injection happened.
  - 0 of 50 users have duplicate profiles.
- Suite **446/446**, tsc 0, build 0.

## Known residuals (not fixed yet)

- Review state (`cc_essays.counselor_review_state`) is a single column, so two
  agencies linked to the same student share it. Per-agency state needs a
  migration.
- `recommenders/submission` doesn't verify that `studentSchoolId` belongs to
  the caller (the junk rows it can create are invisible to the other student).
  It and `canvas-extract` return 403 rather than 404.
- Invite preassignment is checked at mint time, not at redemption.

- Intake-completed anonymous profiles are no longer auto-adopted. A correct
  link needs a session→profile column (`cc_intake_sessions` doesn't record the
  profile it created).
- The static tripwire can't prove a write is scoped when an unrelated
  ownership lookup precedes it. Behavioral tests cover the known case.
- Pre-existing lint errors on the counselor student page (`set-state-in-effect`,
  two `<a>` navigation links) are untouched.
