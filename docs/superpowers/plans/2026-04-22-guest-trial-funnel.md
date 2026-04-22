# Guest-Trial Funnel — Landing → Product → Pro Conversion

**Date:** 2026-04-22
**Status:** Ready for review (pre-implementation)
**Owner:** Bilal
**Target:** Move landing-page bounce from 73% → ~45% and lift signup-to-Pro conversion by making signup a mid-funnel event instead of a gate.

---

## 1. Context

Current funnel: `/landing` → CTA → `/signup` → `/onboarding` (6-step wizard) → `/dashboard`.
Observed: 73% bounce, and much of the drop happens *before* the user has seen any product value.
Auth-walling the trial means the product's core value (Coach Kairos, essay review, chancing,
school list) is invisible to 73% of visitors.

**Existing precedent to extend.** `supabase/migrations/20260417_intake_nullable_user.sql`
already made `cc_student_profiles.user_id` nullable and `cc_intake_sessions` holds
anonymous intake state keyed by `session_token`. `POST /api/cc/intake/link` links an
anonymous intake to a real `auth.users` row on signup. We will generalize this pattern
across every student-facing table.

## 2. Goal

Ship a three-tier funnel in one sprint (~3–5 days of build):

- **Guest (no signup):** try Coach Kairos and the core tools with a persistent anonymous
  session. Core value visible within 10 seconds of landing.
- **Free (signed up):** cross-device persistence + one paid-quality moment (essay review).
- **Pro ($10/mo):** unlimited reviews, unlimited supplements, mock interviews, counselor
  share link, financial aid tools.

## 3. Non-goals

- Redesign of Coach Kairos persona or mode logic (§2 of `CLAUDE.md`).
- Any change to the Paddle billing integration beyond adding the Pro feature flags listed
  in § 5.
- Mobile app or PWA changes.
- International admissions (UK/Canada); the product is US-only.
- District/B2B sales surface.

## 4. Success metrics (measured 14 days after full rollout)

| Metric | Baseline | Target |
|---|---|---|
| `/landing` bounce rate | 73% | ≤ 50% |
| Landing → first coach-chat message | unknown | ≥ 40% of visitors |
| Guest → free signup conversion | n/a | ≥ 20% of engaged guests |
| Free → Pro 7-day conversion | unknown | ≥ 5% |
| Time-to-first-value (landing → first school added or first essay drafted) | unknown | ≤ 3 min median |

Instrumentation is a prerequisite — see § 14.

## 5. Tier matrix (single source of truth)

This is the authoritative spec. Both client and server enforce it. All ambiguity gets
resolved here before shipping.

| Capability | Guest | Free | Pro |
|---|---|---|---|
| Browse school catalog | ✅ unlimited | ✅ | ✅ |
| Add schools to list | 3 max | 5 max | unlimited |
| Chancing calc on added schools | ✅ | ✅ | ✅ |
| School compare modal | ✅ | ✅ | ✅ |
| Coach Kairos chat | 20 messages total | 200/day | unlimited |
| Coach voice mode | ❌ | 10 min/day | unlimited |
| Activities Optimizer — bullets | 3 bullets | 10 bullets | 10 bullets |
| Activities Optimizer — resume parse | ❌ | 1x | unlimited |
| Essay — brainstorm + outline + draft (PS) | 1 essay | 1 essay | unlimited |
| Essay review | ❌ | **1 review total** | unlimited |
| Supplement essays | ❌ | ❌ | unlimited |
| Mock interview | ❌ | 1 session | unlimited |
| Counselor share link | ❌ | ❌ | ✅ |
| Financial aid appeal letter | ❌ | ❌ | ✅ |
| FAFSA walkthrough | ❌ | ❌ | ✅ |
| Scholarship matching | ❌ | view only | full matching + alerts |
| Cross-device sync | ❌ (localStorage) | ✅ | ✅ |
| Data retention on abandonment | 30 days (anon) | forever | forever |

**Anchor decisions (do not drift during build):**
- **1 free essay review** is the Pro-purchase trigger. Do not give two.
- **Supplements are Pro-only.** A student with 10 schools has 20–30 supplement essays —
  this is where the value compounds and where CollegeVine/Prompt charge the most.
- **Coach voice is a Pro unlock after a brief free-tier taste.** Voice is our most
  visible differentiator vs. ChatGPT.

## 6. Architecture: anonymous sessions

### 6.1 Approach decision

We use **Supabase anonymous auth** (`supabase.auth.signInAnonymously()`), not a
custom session-token scheme. Reasons:

1. An anonymous Supabase user has a real `auth.users.id`. Every RLS policy we've already
   written on `user_id = auth.uid()` keeps working unchanged.
2. Converting anonymous → real user on signup is a single
   `supabase.auth.updateUser({ email, password })` call or `linkIdentity(google)` call.
   All the anon's rows stay put under the same `user_id` — no data migration needed.
3. The existing `cc_intake_sessions` + `/api/cc/intake/link` pattern can be deprecated
   after this lands, not maintained in parallel.
4. We avoid the localStorage-lost-on-device-switch problem from the brainstorm — anon
   sessions are server-persisted from minute one.

### 6.2 What "guest" means operationally

- On first visit to `/landing` (or any public page), a 1×1 initialization fires
  `supabase.auth.signInAnonymously()`. The session cookie is set. The user is now
  `auth.users.id = <uuid>, is_anonymous = true`.
- Every subsequent API call the guest makes behaves exactly like a signed-in user at
  the Supabase layer. Tier enforcement (§ 7) checks `is_anonymous` to apply the Guest
  column from § 5.
- On signup, we call `supabase.auth.updateUser({ email, password })` which flips
  `is_anonymous = false` **on the same user_id**. All school-list rows, essay drafts,
  coach conversation history migrate for free.
- `is_anonymous` guests older than 30 days are swept nightly.

### 6.3 Middleware change

`src/middleware.ts` currently treats any route requiring auth as needing a real user.
Update: allow `is_anonymous = true` for the routes listed in § 8.1. Flag Pro gates
separately (not anon vs. not).

## 7. Tier enforcement helper

New file: `src/lib/cc/tier-gate.ts`.

```ts
// Single source of truth for the § 5 matrix. Every API route that touches
// a gated capability imports from here — no inline quota math.
export type Tier = "guest" | "free" | "pro";

export interface TierCaps {
  schoolsMax: number;
  coachMessagesPerDay: number;
  coachVoiceMinutesPerDay: number;
  activityBulletsMax: number;
  resumeParsesMax: number;      // lifetime
  essaysMax: number;            // lifetime drafts allowed
  reviewsMax: number;           // lifetime
  supplementsAllowed: boolean;
  mockInterviewsMax: number;    // lifetime
  counselorShareLink: boolean;
  financialAidAppeal: boolean;
  fafsaWalkthrough: boolean;
  scholarshipMatching: "none" | "view" | "full";
  crossDeviceSync: boolean;
}

export const TIER_CAPS: Record<Tier, TierCaps> = { /* § 5 */ };

export async function getTier(userId: string): Promise<Tier> {
  // 1. Query auth.users for is_anonymous → guest
  // 2. Query user_subscriptions for active Pro → pro
  // 3. Otherwise free
}

export async function assertCapacity(
  userId: string,
  capability: keyof TierCaps,
  currentUsage: number | null
): Promise<{ ok: true } | { ok: false; reason: string; upgradeTo: "free" | "pro" }> {
  // Returns 402-equivalent with upgradeTo when blocked.
}
```

Every gated API route wraps its handler with `assertCapacity(...)`. Failures return
`{ error, upgradeTo }` with HTTP 402. The client shows a contextual upgrade modal.

## 8. Workstream-by-workstream plan

### 8.1 Workstream A — Guest session infrastructure

**Files to create:**

- `src/lib/guest-session.ts` — client-side helper that calls
  `supabase.auth.signInAnonymously()` on first page load if no session exists. Idempotent.
  Hook: `useGuestSession()` returns `{ userId, isAnonymous, isReady }`.
- `src/lib/cc/tier-gate.ts` — per § 7.
- `supabase/migrations/20260422_guest_trial.sql`:
  ```sql
  -- Track guest signups for analytics (no PII)
  CREATE TABLE IF NOT EXISTS guest_sessions_audit (
    user_id UUID PRIMARY KEY REFERENCES auth.users,
    landed_at TIMESTAMPTZ DEFAULT now(),
    first_tool_used TEXT,
    first_tool_at TIMESTAMPTZ,
    upgraded_to_free_at TIMESTAMPTZ,
    upgraded_to_pro_at TIMESTAMPTZ
  );

  -- Nightly sweep cron removes anon users > 30d old.
  -- (Scheduled via Supabase cron extension or a /api/cron/sweep-guests route.)

  -- Extend tier lookup with a view to make tier-gate.ts queries cheap
  CREATE OR REPLACE VIEW v_user_tier AS
  SELECT
    u.id AS user_id,
    CASE
      WHEN u.is_anonymous THEN 'guest'
      WHEN s.status IN ('active', 'trialing') AND s.plan = 'pro' THEN 'pro'
      ELSE 'free'
    END AS tier
  FROM auth.users u
  LEFT JOIN user_subscriptions s ON s.user_id = u.id;
  ```

**Files to modify:**

- `src/middleware.ts` —
  - Remove `/landing` redirect loop logic (the anon session means cookie-presence alone
    no longer reliably indicates signed-in).
  - Add helper `isAnonUser(request)` that decodes the JWT and reads `is_anonymous`.
  - Public routes remain public. Previously-auth-only routes that guests can now access
    (see below) check for *any* session (anon OK).
  - Pro-only routes check `v_user_tier` via a dedicated helper instead of just auth.
- `src/contexts/AuthContext.tsx` — expose `isAnonymous: boolean` and an
  `upgradeToRealUser({ email, password, name })` function that calls
  `supabase.auth.updateUser` and flips the flag.

**Guest-accessible routes (server-side anon allowed):**
- `POST /api/cc/coach/message`
- `GET /api/cc/schools/search`
- `POST /api/cc/school-list/add` (capped at 3)
- `GET /api/cc/school-list`
- `POST /api/cc/activities/parse-text`
- `POST /api/cc/activities/optimize` (capped at 3 bullets)
- `POST /api/cc/essays/*` (brainstorm/outline/draft only; review blocked)
- `POST /api/cc/chancing/calculate`

**Pro-only routes (no guest or free):**
- `POST /api/cc/essays/[id]/review` — **free users get 1 review lifetime**; guests blocked.
- Any `/api/cc/essays/[id]/supplement/*` endpoints
- `POST /api/cc/financial-aid/appeal`
- `POST /api/cc/financial-aid/fafsa`
- `GET /api/cc/scholarships?match=true`

### 8.2 Workstream B — Landing hero embedded chat

**Files to modify:**

- `src/app/landing/page.tsx` — replace the current above-the-fold CTA with a live
  `<HeroCoachChat />` component that:
  - Initializes a guest session on mount (via `useGuestSession()`).
  - Opens with an assistant message: _"Tell me the schools you're considering — I'll
    tell you honestly if they're reach, match, or safety for you."_
  - Accepts messages and streams replies from `/api/cc/coach/message` with
    `page_context=/landing`, which maps to mode `general` or `school-browse`.
  - After 3 exchanges, renders a soft CTA bar: _"Want to save this? It takes 10 seconds
    and you'll keep everything."_ — opens a signup modal.
  - After 20 messages (the guest cap), hard-blocks with an upgrade modal.

**Files to create:**

- `src/components/landing/HeroCoachChat.tsx` — thin wrapper over the existing
  `CoachKairos` panel layout, sized for hero embedding (not the right-drawer variant).
- `src/components/landing/SignupSoftPrompt.tsx` — the "save your progress" nudge bar.

**Landing page surgery:**
- Keep the existing `CTASection`, `Features`, `Stats`, `ScrollSequence` below the fold.
- Replace `HeroSection`'s right half (or full width on mobile) with `HeroCoachChat`.
- Add one trust-signal line below the chat: _"Free to try — no signup. Used by 120+
  students in the 2025–26 cycle."_ (Swap the count weekly from the guest_sessions_audit
  table once instrumentation is on.)

### 8.3 Workstream C — Tier enforcement in existing APIs

For each route listed below, add `assertCapacity()` at the top of the handler.
Return HTTP 402 (Payment Required) with body `{ error, upgradeTo, capability }` when
the cap is exceeded. The client already has fetch wrappers — extend them to open the
upgrade modal on 402.

| Route | Capability to check | Limit source |
|---|---|---|
| `POST /api/cc/school-list/add` | `schoolsMax` | count of `cc_student_schools` |
| `POST /api/cc/coach/message` | `coachMessagesPerDay` | count of today's messages in `cc_coach_conversations` |
| `POST /api/cc/activities/optimize` | `activityBulletsMax` | count of `cc_activities` with `impact_score IS NOT NULL` |
| `POST /api/cc/activities/parse-resume` | `resumeParsesMax` | lifetime count |
| `POST /api/cc/essays/*/new` | `essaysMax` | count of `cc_essays` |
| `POST /api/cc/essays/[id]/review` | `reviewsMax`, `supplementsAllowed` | count of essays with `revision_comments IS NOT NULL`; if essay `supplement_id IS NOT NULL`, require Pro |
| `POST /api/cc/interview/session` | `mockInterviewsMax` | count of `interview_sessions` |
| `POST /api/cc/share-link/create` | `counselorShareLink` | boolean |
| `POST /api/cc/financial-aid/appeal` | `financialAidAppeal` | boolean |
| `POST /api/cc/financial-aid/fafsa` | `fafsaWalkthrough` | boolean |
| `GET /api/cc/scholarships` (with `match=true`) | `scholarshipMatching = "full"` | scope |

**Client-side upgrade UX:**
- `src/components/upgrade/UpgradeModal.tsx` — context-aware: when triggered by
  `capability=reviewsMax`, the headline is _"Unlock unlimited essay reviews — $10/month"_.
  Same component, different copy per capability.
- Hook `useFetchWithUpgrade(url, opts)` — wraps `fetch` to intercept 402 and open modal.

### 8.4 Workstream D — Kill /onboarding as a wizard, convert to conversational intake

**Files to modify:**

- `src/app/onboarding/page.tsx` — delete the wizard. Replace with a server-side redirect
  to `/?coach=open&focus=intake`.
- `src/contexts/CoachKairosContext.tsx` — support `focus=intake` URL param: when present
  on mount, open the coach, set mode to `intake`, and seed the first assistant message.
- `src/lib/cc/coach-mode-detector.ts` — intake mode priority stays the same; no change
  needed. Check that the mode-detector correctly picks `intake` when the profile is
  missing name/grade/country.
- `src/app/api/cc/intake/complete/route.ts` — already supports anonymous sessions with
  the nullable `user_id` pattern. Update so that:
  - When the conversational intake gathers enough fields, the coach extraction
    (`runCoachExtraction` in `src/lib/cc/coach-extract.ts`) writes them directly to
    `cc_student_profiles` for the current anon user. No separate `cc_intake_sessions`
    row required.

**Files to deprecate (not delete yet — keep for 30 days as fallback):**
- `src/app/intake/page.tsx` (already a redirect-only stub from our 2026-04-21 fix).
- `src/app/api/cc/intake/start/route.ts` and `/turn/route.ts` — keep running for
  backward compat with the voice-intake flow (`2026-04-17-voice-intake-flow.md`).

**New signup flow for guests who engaged:**
1. Soft prompt bar appears after 3 coach exchanges OR 1st school added OR 1st essay
   brainstorm saved.
2. Modal offers email + password OR Google OAuth.
3. Submit calls `supabase.auth.updateUser({ email, password, data: { name } })` for
   email, or `supabase.auth.linkIdentity({ provider: 'google' })` for OAuth.
4. On success: `user_id` is unchanged, `is_anonymous` flips to false, all data persists.
5. Trigger `guest_sessions_audit.upgraded_to_free_at = now()`.
6. Toast: _"Saved. You can now access your stuff from any device."_

### 8.5 Workstream E — Exit-intent capture (email-only lead)

**Files to create:**

- `src/components/landing/ExitIntentModal.tsx` — fires once per session on mouse-leave
  at top of viewport (desktop) or back-button press (mobile). Copy: _"Leaving? Take your
  school list and a free essay review with you — we'll email it."_ Email-only capture.
- `src/app/api/leads/capture/route.ts` — stores `{ email, source: "exit-intent", captured_at }`
  in a new `marketing_leads` table. Sends a one-off transactional email with:
  - The student's current school list (if any guest data exists).
  - A link back to the session (signed token that restores the anon session to a new
    browser).
  - A soft pitch for Pro.

**Integration:**
- Only arm the exit-intent once the guest has done at least one productive action
  (added a school, sent 2+ coach messages, or drafted essay text). Fires more
  aggressively on a blank-slate bounce.

## 9. Execution order

Must be built in this order — later steps depend on earlier ones.

1. **Day 1 AM** — Workstream A, DB migration + `tier-gate.ts` + `useGuestSession` hook.
   Unit-test `assertCapacity` for every row in § 5.
2. **Day 1 PM** — Workstream C, wrap existing gated routes with `assertCapacity`. Ship
   `UpgradeModal` + `useFetchWithUpgrade`. Verify with manual curl that each route
   returns 402 correctly for guest and free tiers.
3. **Day 2 AM** — Workstream D, delete wizard + wire conversational intake.
4. **Day 2 PM** — Workstream B, replace landing hero with `HeroCoachChat`. This is the
   single biggest bounce lever — ship it mid-sprint so we can measure for 3+ days before
   release.
5. **Day 3 AM** — Workstream E, exit-intent modal + `marketing_leads` table.
6. **Day 3 PM** — Instrumentation & event schema (§ 14). Dashboards in Vercel Analytics
   or PostHog if wired.
7. **Day 4** — End-to-end manual QA of all 5 funnel paths (§ 11). Cross-browser check.
8. **Day 5** — Soft rollout to 10% of landing traffic via a simple cookie-based split.
   Monitor for 48h. Full rollout on Day 7 if bounce improves ≥ 10 points and no error
   spike.

## 10. Risks & tradeoffs

| Risk | Likelihood | Mitigation |
|---|---|---|
| Anonymous Supabase users blow up `auth.users` row count, slowing queries | Medium | Nightly sweep after 30d; composite index on `auth.users(is_anonymous, created_at)` |
| Guest essay review uses real Claude Sonnet tokens = $0.40–0.80/guest | High | **Don't give guests a review.** Free tier gets 1 lifetime. Re-confirmed in § 5. |
| Chancing calc wrong on a popular school → guest bounces after engagement | Medium | Before hero ships, audit chancing on top-50 schools against Common Data Set. |
| LocalStorage-vs-cookie confusion on iOS Safari (ITP evicts anon session) | Medium | Server-side anon session is cookie-based, not localStorage. Safari eviction affects third-party only; our first-party cookies survive. |
| Existing `cc_intake_sessions` migration conflict | Low | New plan bypasses `cc_intake_sessions` entirely; keep the old routes live as read-only for 30 days. |
| RLS policies break because `is_anonymous` users were never expected | Medium-high | Audit every RLS policy on `cc_*` tables. Most use `auth.uid() = user_id` which keeps working. Flag any that check `auth.jwt()->>'email'` (will be null for anon). |
| Paddle Pro upgrade flow doesn't preserve anon → real conversion | Medium | Test case: guest → free → Pro. Subscription row must key on the persistent `user_id`, not the email. Paddle webhook already keys on `user_id` from the checkout metadata — confirm. |
| Voice mode on guest tier costs too much | N/A | Guest has no voice mode. Free gets 10 min/day. |

## 11. Testing plan

### 11.1 Manual QA (required before 10% rollout)

Five funnel paths to walk end-to-end in an incognito window:

1. **Guest happy path:** `/landing` → chat → add 3 schools → brainstorm an essay → hit
   the "add 4th school" wall → signup modal → verify all data persists.
2. **Guest edge — message cap:** send 20 coach messages → 21st returns 402 with upgrade
   prompt.
3. **Free tier hitting review cap:** guest → signup → draft 1 essay → request review →
   verify review runs → draft 2nd essay → request review → verify 402 with
   `upgradeTo: "pro"`.
4. **Pro upgrade preserves state:** free user with 5 schools + 1 reviewed essay →
   Paddle checkout → returns to dashboard → all data intact → now can review unlimited.
5. **Exit intent:** land on `/landing`, add 1 school, mouse-leave → modal appears →
   submit email → verify lead saved + transactional email queued.

### 11.2 Automated checks

- Unit test `tier-gate.ts` against every row of § 5.
- Unit test `assertCapacity` with canned Supabase fixtures.
- Playwright spec `tests/e2e/guest-funnel.spec.ts` covering paths 1 and 3 above.

## 12. Rollback plan

Each workstream is reversible independently.

- **Workstream A rollback:** set a `NEXT_PUBLIC_GUEST_SESSIONS_ENABLED=false` env flag;
  `useGuestSession` short-circuits, middleware reverts. Rows already created stay but
  become dormant.
- **Workstream B rollback:** feature flag `NEXT_PUBLIC_LANDING_HERO_CHAT=false` restores
  the original `HeroSection` CTA. 1-line change.
- **Workstream C rollback:** `assertCapacity` returns `{ ok: true }` unconditionally
  when `NEXT_PUBLIC_TIER_GATES_DISABLED=true`.
- **Workstream D rollback:** restore `/onboarding/page.tsx` from git (the wizard code is
  preserved in history). Revert the `/intake` → dashboard redirect.
- **Workstream E rollback:** unmount `<ExitIntentModal />` from `layout.tsx`.

## 13. Feature flags (one env var per workstream)

Add to `.env.local.example`:

```
NEXT_PUBLIC_GUEST_SESSIONS_ENABLED=true
NEXT_PUBLIC_LANDING_HERO_CHAT=true
NEXT_PUBLIC_TIER_GATES_DISABLED=false
NEXT_PUBLIC_EXIT_INTENT_ENABLED=true
NEXT_PUBLIC_ONBOARDING_WIZARD_MODE=conversational   # or "wizard" for fallback
```

## 14. Instrumentation & A/B test design

### 14.1 Event schema

Write to a single `funnel_events` table (or PostHog if wired):

```
user_id         UUID
tier            TEXT  -- guest | free | pro
event           TEXT  -- landed | chat_started | school_added | essay_drafted
                      -- review_requested | upgrade_modal_shown | upgrade_modal_cta_clicked
                      -- signup_completed | pro_upgraded | exit_intent_shown | email_captured
capability      TEXT  -- nullable; present on upgrade events
page_context    TEXT  -- /landing | /cc/essays/:id | etc
ab_bucket       TEXT  -- control | hero-chat | exit-intent-aggressive | etc
created_at      TIMESTAMPTZ
```

### 14.2 Initial A/B tests

| Test ID | Control | Variant | Primary metric | Power |
|---|---|---|---|---|
| HERO-01 | Current `HeroSection` CTA | `HeroCoachChat` | landing-to-first-message conversion | 80% at n=2,000 visitors |
| GATE-01 | Review cap = 1 on free | Review cap = 2 on free | free-to-Pro 14-day conversion | 80% at n=1,000 signups |
| EXIT-01 | No exit-intent | Aggressive exit-intent | lead-capture rate on bouncers | 80% at n=3,000 bouncers |

Split traffic 50/50 by a cookie set on first visit. Analyze with a fixed-horizon test
(not sequential — we don't have the volume for it).

### 14.3 Guardrail metrics

If any of these regress by >10% during a test, stop:
- Average coach-chat latency
- Supabase auth error rate
- Paddle checkout success rate
- Sentry error count

## 15. Open questions

1. **Paddle + anon Supabase:** need to confirm Paddle checkout preserves `user_id`
   through the anon → real → pro flow. Action: test in staging before rollout.
2. **RLS audit:** do any existing policies assume a non-null email on `auth.users`?
   Action: grep `auth.jwt()` across `supabase/migrations/*.sql` before Day 1.
3. **Guest chat mode detection:** the current mode detector expects intake fields on
   the profile. For a landing-page guest, we want mode = `general` or `school-browse`
   regardless of profile state. Action: add a `landing` path → force-mode override in
   `coach-mode-detector.ts`.
4. **Transactional email provider:** exit-intent email needs a sender. Resend is cheapest
   ($20/mo for 50k emails). Is this already wired anywhere? If not, add it as a
   dependency of Workstream E.
5. **COPPA compliance for guests under 13:** currently enforced at signup (13+). For
   guests, we can't enforce until signup. Action: add a one-checkbox self-attestation
   before chat opens: _"I'm 13 or older"_ — bounce cost is low.
6. **Do we want a fallback free-tier trial key separate from email+password?** i.e., can
   a student "claim their progress" with only an email and a magic link, no password?
   Lower friction, but adds a code path. Defer to v2.

## 16. Definition of done

- [ ] All 5 workstreams shipped behind their feature flags.
- [ ] Tier matrix (§ 5) enforced on both client and server; tested per § 11.1.
- [ ] Instrumentation writing `funnel_events`; dashboards visible.
- [ ] HERO-01, GATE-01, EXIT-01 A/B tests live with matched-sample-size plan.
- [ ] 30-day nightly sweep of stale anon users confirmed running.
- [ ] RLS audit complete; no policies broken by `is_anonymous` users.
- [ ] Paddle end-to-end tested: anon → free → Pro preserves `user_id`.
- [ ] Rollback verified: toggling each flag returns the app to pre-change behavior
      within one render.
- [ ] Docs: this file updated with observed metrics 14 days after full rollout.

---

*Review checklist before implementation starts: confirm the tier matrix in § 5 is what
you want, and the § 15 open questions have owners. Everything else is executable as
written.*
