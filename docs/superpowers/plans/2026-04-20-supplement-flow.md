# Supplement Essay Flow — 2025-26 Seed, Pro Gate, Verify Badge

**Date:** 2026-04-20
**Status:** Shipped (seed pending run)
**Scope:** Per-college supplement prompts + gated drafting flow

## Goal

Give Pro students a first-class workflow for tackling school-specific supplement
essays: each school page lists that school's current prompts; clicking "Start" on
any prompt spins up a full `cc_essays` row in `brainstorm` phase and takes the
student into Essay Studio. Free-tier students see the prompts but the "Start"
button surfaces a pay-gate.

## Decisions (confirmed with user 2026-04-20)

1. **Coverage:** top 50 schools prioritized (25 national unis, 15 LACs, 10
   publics). Seed ships with ~35 schools × 1-5 prompts; remaining schools fall
   through to an empty state with a "verify on school site" nudge.
2. **Placeholder year:** prompts are 2025-26 compiled from public school pages.
   Every supplement row ships with a `source_url` and the UI renders a
   "Verify on school site" amber badge so applicants confirm current wording
   before drafting. The badge is gated to `academic_year === '2025-2026'`, so
   when we refresh for 2026-27 we'll drop the badge.
3. **Pro-gated:** the from-supplement endpoint returns 402 with
   `pro_required: true` + `upgrade_url: /pricing` for non-Pro users. The UI
   pre-fetches Pro status from `/api/billing/subscription` and shows a lock
   icon on "Unlock" buttons and a banner-level upgrade CTA at the top of the
   supplements tab.

## Infrastructure (already present, reused)

- `supabase/migrations/20260420_school_supplements.sql` — creates
  `cc_school_supplements(id, school_id, prompt_text, word_limit, is_required,
  supplement_type, category, academic_year, sort_order, source_url)`, indexes
  on `school_id`, FK `cc_essays.supplement_id`, permissive RLS read policy.
- `GET /api/cc/schools/[id]/supplements` — returns prompts for a school ordered
  by `sort_order` then `is_required DESC`. Updated to include `source_url`.
- `POST /api/cc/essays/from-supplement` — existing endpoint that mints a new
  `cc_essays` row in `brainstorm` phase from a supplement id. Updated to
  Pro-gate.
- `src/app/schools/[id]/page.tsx` — existing tabbed school detail page with
  overview / aid / supplements tabs.
- `src/lib/credentials-pro-gate.ts` — `isPro(supabase, userId)` reused from
  verifiable-credentials work. Checks `CREDENTIALS_PRO_ALLOWLIST` env then
  `user_subscriptions.status IN ('active','trialing') AND plan='pro'`.

## Changes in this patch

### API: `src/app/api/cc/essays/from-supplement/route.ts`
Added `isPro()` check immediately after auth. Non-Pro users get:
```json
{"error": "Supplement essays are a Pro feature", "upgrade_url": "/pricing", "pro_required": true}
```
with HTTP 402. Everything else is unchanged — existing essay lookup, supplement
lookup, dedupe-on-existing, and insert logic still work.

### API: `src/app/api/cc/schools/[id]/supplements/route.ts`
Added `source_url` to the select. One-line change.

### UI: `src/app/schools/[id]/page.tsx`
- Added `isPro` state, populated from `/api/billing/subscription` alongside the
  existing school + supplements fetches (single `Promise.all`).
- Added `Lock` + `ExternalLink` icons.
- Supplements tab now renders:
  1. A top-of-tab amber banner for non-Pro users with an "Upgrade" CTA
     linking to `/pricing`.
  2. Each supplement card shows the prompt + an amber
     "Verify on school site" pill linking to `source_url` when
     `academic_year === '2025-2026'`.
  3. The per-card action button shows either a Lock+Unlock label (non-Pro) or
     Sparkles+Start label (Pro). Non-Pro clicks route to `/pricing`; Pro
     clicks hit the POST endpoint and land on the new essay. The 402 fallback
     path is still wired in case the client state is stale.
- `launchSupplement` updated to short-circuit to `/pricing` when `!isPro` and
  handle 402 responses.

### Data: `src/data/cc/supplements-2025-26.ts`
TypeScript seed data keyed by `school_name` (must match `cc_schools.name`).
Each pack has `source_url`, `academic_year`, and an array of
`{prompt_text, word_limit, is_required, supplement_type, category, sort_order}`.

Coverage (confident prompts — all with source URLs):
- **Ivies + top privates:** Harvard, Stanford, MIT, Yale, Princeton, Columbia,
  Penn, Duke, Northwestern, UChicago, Dartmouth, Brown, Cornell, JHU, Rice,
  Vanderbilt, Georgetown, Notre Dame, Emory, CMU, USC, Caltech
- **Publics:** UCLA, Berkeley, UCSD (shared UC PIQ pack), UT Austin, UVA, UNC,
  Georgia Tech, UMich, UIUC, UW-Madison, UW Seattle, UF, Ohio State
- **LACs:** Williams, Amherst, Swarthmore, Pomona, Wellesley, Bowdoin,
  Carleton, Claremont McKenna, Middlebury, Davidson, Vassar, Grinnell, Smith

Not included in seed (can be added later without schema change): Virginia Tech,
Purdue, Penn State, Rutgers, NYU, Boston U, Northeastern, UMD, ASU, Texas A&M,
UGA, Indiana, Michigan State, Colorado Boulder, Florida State, Minnesota,
Washington Lee, Colby. These fall through to the empty state on the
supplements tab (rendered as "No supplement prompts loaded yet").

### Script: `scripts/seed-supplements.ts`
Idempotent TypeScript seed. For each pack it:
1. Looks up `cc_schools.id` by exact name match.
2. Fetches already-seeded prompt_texts for that school+year.
3. Inserts only the missing rows.
4. Logs missing schools (so maintainers can add them to `cc_schools` first
   via `npx tsx scripts/seed-schools.ts`).

Run: `npx tsx scripts/seed-supplements.ts`

## Not in this patch (defer to follow-ups)

- **Schema:** no new migration needed — `20260420_school_supplements.sql`
  covers everything. If we want idempotent `ON CONFLICT DO NOTHING` in SQL,
  add a unique index on `(school_id, prompt_text, academic_year)` later. The
  script handles idempotency via read-then-insert in the meantime.
- **Verify-freshness job:** no background job to refresh prompts when schools
  publish 2026-27 prompts. Students rely on the source_url badge. A future
  cron could diff prompts against school pages.
- **Locked preview modal:** non-Pro users see prompts fully (not blurred).
  The intentional bet is that visible prompts help convert — they make the
  "this would be a lot to write" friction tangible before the CTA. If we
  want to blur later, gate `prompt_text` server-side in the GET endpoint.
- **School-specific major prompts:** some schools (Cornell, UVA, Georgetown)
  have per-school-within-university prompts that our single-row model
  flattens. We list the generic version with instructions to answer the
  school-specific variant. Future: add a `variant` column or split rows
  per undergraduate school.
- **Common App essay mapping:** the personal statement isn't a supplement.
  It's already handled by the separate `cc_essays` flow for essay_type =
  'common_app'. No changes there.

## Verification

- [x] `npx tsc --noEmit` clean for changed files (from-supplement route,
      school supplements route, schools/[id] page, seed data, seed script,
      credentials-pro-gate import).
- [ ] `npx tsx scripts/seed-supplements.ts` against local Supabase — **run
      before shipping prompt to prod** to confirm the schools this covers
      already exist in `cc_schools`.
- [ ] Manual smoke: visit `/schools/<id>` for a seeded school as a free user
      → verify upgrade banner + locked buttons + verify-on-site pill render.
- [ ] Manual smoke: same school as Pro user → verify Start spins up a new
      essay row in `brainstorm` phase and redirects to `/cc/essays/<id>`.

## Gotchas to watch

1. **Name matching is exact.** `cc_schools.name` is the join key; if
   `seed-schools.ts` uses "University of California, Los Angeles" and your
   seed pack uses "UCLA", the script silently skips with a `missing school`
   log line. Fix: grep `scripts/seed-schools.ts` for the authoritative name.
2. **`cc_schools.name` is not unique** in the schema. If seed-schools.ts
   runs twice, duplicates could shadow the match. The lookup uses
   `.maybeSingle()` so duplicates will surface as a PostgREST error; safe
   to ignore once you dedupe upstream.
3. **`CREDENTIALS_PRO_ALLOWLIST`** bypasses the Pro gate. This is the same
   env var used by verifiable credentials — setting it for credentials also
   bypasses supplement gating. Intentional for testnet/maintainer work;
   don't use in prod for general Pro-access grants.
4. **Prompt drift.** The source_url badge is the safety valve. If a school
   changes wording by Sept 2025, students who drafted in Aug are on old
   wording. Future: add a `last_verified_at` timestamp the verify badge
   could surface.
