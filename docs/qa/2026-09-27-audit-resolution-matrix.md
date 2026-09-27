# Audit resolution matrix — 2026-09-27

Judged tree: `grokking-integrate` at `refocus/admissions-only` HEAD `e516605` (release candidate: production `ae82a5a` + Daybreak + page-weight + admissions-only refocus). Read-only mapping. No network, no database, no e2e.

Sources: `grokking/docs/design/2026-09-live-audit.md` (top ten, sections, QA-60..64), `grokking/work-diary/audit-chronological-through-115.md` (QA-11..59), `grokking/docs/superpowers/specs/2026-08-17-essay-studio-roadmap-spec.md` (QA-01..10, the August items the September audit "reconfirms"), `grokking-integrate/docs/handoff/claude-progress.md` and the `docs/superpowers/plans/2026-09-2*.md` plans (treated as claims).

Numbering: QA-01..QA-64 all exist. QA-01..10 are August findings (defined in the August spec, reconfirmed/referenced in September); QA-11..59 are the September live audit; QA-60..64 are Astra's D1 observations.

Test run for this mapping (mocked, in-memory only): `npx vitest run` on 42 files — 42 passed / 276 tests passed (ownership-contract, student-data-ownership, ownership-routes, intake link, counselor-comments, essay-review-route, invite-codes-route, my-counselor, join-page, CreateWorkspaceCard, next-propagation, safe-next, glossary, studio-grid-contract, essay-type-label, recommenders-list, shared-link-recommenders, recommenders page, onboarding-transfer-gpa, parse-gpa, outline-generate, llm-json, nav-links, variants, variant-sections, me, search-filters, footer-mobile-contract, MarketingShell, daybreak-homepage, home-page, pricing-copy, BottomTabBar, MobileDrawer, retired-links, seo-admissions, deadlines, affordability, ensure-profile-credits, coach-prompt-builder, CourseRigorGrid, ownership). Every "test passes" below refers to this run.

---

## (c) Flagged first: fixes that are WRONG / incomplete, and new defects at HEAD

None of these is a regression introduced by the refocus; all are either a claimed fix that does not hold, or a defect of an already-fixed class that the fix/guard missed.

1. **QA-13 / Fix 4 claim "all copy reads from pricing.ts" is wrong.** `src/app/signup/page.tsx:130` and `:171` still say "300 AI credits included" (Free is 200 once). The tripwire `src/lib/__tests__/pricing-copy.test.ts:12` matches `/\b300 credits\b/` and misses "300 AI credits", so it passes. This copy is also live in production (`ae82a5a` has the same lines). Also stale: `src/app/terms/page.tsx:50` "access to all courses" (contradicts the refocus), `src/lib/faq-items.ts:24` "Free forever for your first three schools" (logged as F6).
2. **QA-15 fix is incomplete.** `/find-counselor` is public (`src/middleware.ts:59`), but its data call `/api/counselor/search` is not in `PUBLIC_PREFIXES`; the middleware returns 401 for any API call with no session (`src/middleware.ts:280-286`), and `src/app/find-counselor/page.tsx:82-86` silently ignores non-OK. There is no automatic anonymous session (`src/lib/guest-session.ts` is unreferenced, F8). So a signed-out visitor always sees "No counselors match your filters" — which is exactly what `docs/qa/evidence/predeploy-2026-09-27/signed-out/phone_find-counselor.png` shows. Needs a live network check to confirm 401 vs an empty accepting-counselor table.
3. **Claude-progress "Coach auto-open … is effectively off" is inaccurate.** The proactive greeting is `/`-only (`src/contexts/CoachKairosContext.tsx:170`), but `/schools` force-opens the coach on every mount (`src/app/schools/page.tsx:134-141`). QA-34 is still open at HEAD.
4. **New dead route (same class as QA-27):** the phone drawer's "Sign out" links to `/account/sign-out` (`src/components/mobile/MobileDrawer.tsx:132`); `src/app/account/` does not exist. `src/components/nav/__tests__/nav-links.test.ts` only scans `sidebar-data.ts`/`palette-data.ts`, so the guard misses it. Pre-existing (May), not a refocus regression.
5. **Same bug class as QA-37, unfixed:** Coach's activity context selects `activity_name` (`src/app/api/cc/coach/message/route.ts:276-281`); `cc_activities` has `organization`, no `activity_name` (`supabase/migrations/20260417_coach_kairos_schema.sql:54-72`, no later migration adds it). The top-3 activities query errors and Coach cannot read activity details (audit capture 122). Pure bug, one-line fix, not in any plan.
6. **QA-60 is hardened, not diagnosed.** The outline route now uses JSON mode, retries, refunds and returns 503 (`src/app/api/cc/essays/[id]/outline/route.ts:88-92`, tested), but claude-progress itself says the production 500 never reproduced and the cause will only appear in Vercel logs as `[callLLMJSON:outline]` after deploy. Marked FIXED-UNVERIFIED, not VERIFIED.

---

## Top-ten problems

| # | One-line problem | Status | Evidence | Owner / next step |
|---|---|---|---|---|
| T1 | Ownership gaps (comment essay binding, agency scope, course/recommender mutations) | FIXED-VERIFIED | `src/lib/cc/ownership.ts`; `src/lib/cc/counselor-comments.ts:17,89,151,208`; tests `student-data-ownership.test.ts`, `ownership-routes.test.ts`, `counselor-comments.test.ts`, `ownership-contract.test.ts` pass; claude-progress "Security verification" live 404s + prod data audit | Residuals (claude-progress "Known residuals"): single `counselor_review_state` column shared across agencies (migration), `recommenders/submission` doesn't check `studentSchoolId`, preassignment checked at mint not redemption — Claude |
| T2 | Supervised review: state bypass, no head publish, comments invisible in Brainstorm | FIXED-UNVERIFIED | 403 for supervised state change `api/counselor/students/[studentId]/essays/[essayId]/route.ts:98` (test `essay-review-route.test.ts` "forbids a supervised counselor…"); publish API test "shows the student a supervised draft once a head publishes it"; UI `counselor/students/[studentId]/page.tsx:331` "Publish to student" (no UI test); all-phase panel `cc/essays/[id]/page.tsx:207-214` (no test, no live evidence) | Live re-check (see list a). Owner Claude |
| T3 | Mobile Essay Studio / navigation at 375px | OPEN-DESIGN | Essay Studio part fixed (QA-07 verified, QA-38 unverified); navigation parts QA-24/31/39 open | Codex D4.2 (shell/mobile nav), D4.4 (Studio) |
| T4 | Fragmented Coach memory (courses, transfer, brainstorm, human feedback; 50 vs 20 window) | OPEN-CODE | Coach reads none of courses/transfer_*/brainstorm_transcript/counselor comments/honors/summer/visits/test plan (`api/cc/coach/message/route.ts`); window `.limit(20)` `:392` vs history `.limit(50)` `api/cc/coach/history/route.ts:29`; `activity_name` bug (flag 5). No `src/lib/cc/agent/` exists at HEAD | Claude: agent slices a1 (`read_context`/`read_essay` incl. `brainstorm_transcript`/`read_published_feedback`), a2 (durable turns), b (evals), d (provenance memory) in `grokking/docs/superpowers/plans/2026-09-25-agent-*.md`; fix `activity_name` now |
| T5 | Agency operations (file vault, relationship chat, digests, task queue, reassignment UI) | OPEN-DESIGN | No such UI; `STATUS_GROUPS` still omit `assigned` (`counselor/dashboard/page.tsx:38-42`); session room is a "Phase 3 placeholder" | Codex D4.9 (+ D4.5 private files); `work-diary/agency-agent-design-proposal.md` |
| T6 | False saves / dead routes (recommenders, transfer GPA, Settings/net-price 404, Attach no-op) | OPEN-CODE | 4 of 5 fixed and verified (QA-37, 51, 27, 48); Attach still has no handler `BrainstormChat.tsx:915-917` (QA-41). New dead link: drawer Sign out (flag 4) | Claude: remove/wire Attach; fix drawer link and extend nav-links guard to `MobileDrawer.tsx` |
| T7 | Wrong regional/stage assumptions (Ontario, transfer) | OPEN-DESIGN | QA-26/43/50/52/53/54 all open at HEAD (see rows) | Codex D4.2/D4.6 (transfer voice, Ontario pathway); Claude pure bugs QA-50/52/26 defaults; agent slice c |
| T8 | Unverified claims / data (testimonials, fit precision, $0 cost, rates, prior-cycle deadlines) | OPEN-FOUNDER | Stories still show named admits labelled illustrative (`stories/page.tsx:14-30,47,110`); About 415:1 / "18 languages" (`about/page.tsx:7,181`); `$0` hidden on cards (QA-42 partial) | Founder: proof or removal of testimonials/claims; OPEN-DATA for rates/deadlines (QA-35/42/43/46/55) |
| T9 | Relationship / identity continuity (invite lost, counselor unclear, Unnamed student, staff UUIDs) | FIXED-UNVERIFIED | QA-23 and QA-05 verified by tests; name seeding/backfill `api/cc/helpers.ts:36-45`, `api/cc/onboarding/complete/route.ts:67-79` untested; staff UUID fallback remains `counselor/team/page.tsx:200` | Live re-check new-signup → roster name; Claude |
| T10 | Misleading priorities / counts / pricing promises / duplicate nav | OPEN-CODE | "All deadlines logged." with zero schools `cc/dashboard/variants.ts:480`; PSAT literal `:737`; "Submitted" = essays `:752,764`; concerns unread (QA-36); signup "300 AI credits" (flag 1); Daybreak literals 300/120 `DaybreakHomepage.tsx:37` | Claude (copy/logic bugs, slice c JourneyState); Codex D4.2 + D3-IMPL-1.1 (pricing literals); D4.8 |

---

## QA-01 … QA-64

| QA | One-line problem | Status | Evidence | Owner / next step |
|---|---|---|---|---|
| QA-01 | Brainstorm theme picker renders empty | FIXED-UNVERIFIED | Union of tagged block + list items + bold labels, cue-based recovery: `components/cc/essay/BrainstormChat.tsx:142-193,380,614,1143`. `parseThemesBlock` not exported; no test. D1 run rendered chips once but Astra keeps QA-01 open (product-judgment memo l.40) | Claude: export + unit-test the parser against the failing phrasings |
| QA-02 | `POST /api/auth/ensure-profile` 500 on signup | FIXED-VERIFIED | Not reproducible (no root-cause change): fix-3 plan re-verification table l.18 "fresh signup → 200 ×3"; route exercised by `api/auth/__tests__/ensure-profile-credits.test.ts` (passes) | Watch on live signup (list a) |
| QA-03 | Roster shows "Unnamed student" + UUID; no search/filter/queue | FIXED-UNVERIFIED | Name seed on insert `api/cc/helpers.ts:36-45`; backfill of NULL name `api/cc/onboarding/complete/route.ts:67-79`; no test asserts either. No roster search/filter/attention queue in `counselor/students/page.tsx` | Claude: test for seed/backfill; roster search/queue → Codex D4.9 |
| QA-04 | No UI to create an agency | FIXED-VERIFIED | `counselor/dashboard/page.tsx:65,123` renders `CreateWorkspaceCard` when no membership; `components/counselor/__tests__/CreateWorkspaceCard.test.tsx` passes | — |
| QA-05 | Student never sees counselor link | FIXED-VERIFIED | `api/cc/my-counselor`; `join/[code]/page.tsx:71` "You're linked to…"; chip `cc/dashboard/page.tsx:141,348`; tests `my-counselor.test.ts`, `join-page.test.tsx` pass; claude-progress live "qa-s1 sees QA Counselor One · QA Test Agency" | Re-run with Ad Astra head after deploy |
| QA-06 | Glossary 500 / guest 401 | FIXED-VERIFIED | Public `middleware.ts:38`; degrade `api/cc/glossary/route.ts:19-20`; `glossary.test.ts` passes; prod smoke "`/api/cc/glossary` returns 200 publicly" (claude-progress 2026-09-27) | OPEN-FOUNDER residual: prod `cc_glossary` has 0 rows; seed needs founder |
| QA-07 | Mobile Revise text one word per line / overlap | FIXED-VERIFIED | `app/tokens.css:1441-1459` (`.kl-studio-grid`, `.kl-bs-subhead`, `.kl-phase-bar`); `studio-grid-contract.test.ts` passes; claude-progress Fix 3 live measure "Revise text 309px, 0 overflow" | Re-check on prod after deploy (list a) |
| QA-08 | Essay card gives no feedback/changes-requested signal | FIXED-UNVERIFIED | `components/cc/essay/EssayCard.tsx:22-25`, wired `cc/essays/page.tsx:444`; no test | Claude: component test |
| QA-09 | Samsara copy, raw essay_type, UUIDs, feedback lacks author, exhausted codes "active" | OPEN-CODE | Partial: "KairosLearn account" `counselor/team/page.tsx:269`; `essayTypeLabel` `counselor/students/[studentId]/page.tsx:236,263` (test `essay-type-label.test.ts` passes). Still open: used-up codes render "active" (`team/page.tsx:294-300`, only `revokedAt` checked), UUID fallback `team/page.tsx:200`, no author on `CounselorFeedbackPanel.tsx` | Claude: status = exhausted when `usedCount>=maxUses`; author name. Mobile invite table → D4.9 |
| QA-10 | Direct `/counselor/team` bounce; survey interrupts; beat-chip truncation; dead prefetch | OPEN-CODE | Partial: auth-loading guard `hooks/useCounselorRole.ts:50-56` (1da0d10, no test); `/account/settings` gone (`nav-links.test.ts`). Survey still fires after 3 min on any page incl. Studio/roster (`components/feedback/SurveyPrompt.tsx:9,27`) | Claude: suppress survey on `/cc/essays/*`, `/counselor/*`; live hard-reload of `/counselor/team` |
| QA-11 | Signup/login down while Supabase paused | OPEN-FOUNDER | Ops, not code. Crons `vercel.json` keep DB warm only while running; `docs/pilot/ad-astra-readiness.md` row "Supabase pausing" | Founder: confirm Supabase plan tier |
| QA-12 | Unsubstantiated public claims ($8,000, admits, languages, savings) | OPEN-FOUNDER | Homepage replaced by Daybreak (no such claims; `DaybreakHomepage.tsx`). Still live: `/stories` named admits "Accepted — Stanford '29" + "illustrative" (`stories/page.tsx:14-30,47,110`, in `sitemap.ts:13`); `about/page.tsx:7,181` 415:1 and "18 languages"; `product/counselor/page.tsx:15` "sub-second latency" | Founder: verified proof or removal; Claude removes on decision |
| QA-13 | Pricing/trial promises conflict; credits unexplained | OPEN-CODE | `lib/pricing.ts` + tripwire exist, but **signup still says "300 AI credits"** `signup/page.tsx:130,171` (tripwire regex gap `pricing-copy.test.ts:12`); `terms/page.tsx:50` "all courses"; FAQ F6 | Claude: fix copy from `PRICING`, widen tripwire to `300 (AI )?credits`; D4.8 for credit explanation |
| QA-14 | Marketing pages render app + marketing headers | FIXED-UNVERIFIED | `app/providers.tsx:21-31` skips TopNav on `/product/*`, `/pricing`, `/stories`, signed-out `/`; no test of the rule. `/about`, `/faq`, `/privacy`, `/terms` still get TopNav only (single header) | Live check signed-in and out; mixed logos/spacing → Codex D3/D4.8 |
| QA-15 | `/find-counselor` blocks unsigned visitors | OPEN-CODE | Page public `middleware.ts:59`, but `/api/counselor/search` 401s without a session (`middleware.ts:280-286`); `find-counselor/page.tsx:82-86` ignores it; predeploy screenshot shows empty result (flag 2) | Claude: add `/api/counselor/search` (read-only) to public prefixes + test |
| QA-16 | Head dashboard centres engagements; implementation-phase copy | OPEN-DESIGN | Dashboard still engagement board `counselor/dashboard/page.tsx:38-42,176`; phase copy removed from dashboard but visible in `counselor/admit-history/page.tsx:66,71`, `counselor/onboard/page.tsx:72`, `counselor/profile/page.tsx:141` | Codex D4.9; Claude can strip phase copy now |
| QA-17 | Mobile head dashboard: no Students/Team nav, stats dominate | OPEN-DESIGN | No counselor mobile-nav change found | Codex D4.9 / D4.2 |
| QA-18 | Comment POST doesn't bind essay to student | FIXED-VERIFIED | `lib/cc/counselor-comments.ts:17-20,208`, route `…/essays/[essayId]/route.ts:82`; tests "404s a comment aimed at another student's essay and writes nothing", "refuses an essay that belongs to a different student" pass; live cross-student 404 (claude-progress) | — |
| QA-19 | Comment reads lack agency scope | FIXED-VERIFIED | `counselor-comments.ts:89,151` `.eq("agency_id",…)`; tests "shows a counselor only their own agency's comments", "counts only the viewing agency's comments" pass | Residual: per-agency review state needs migration |
| QA-20 | requires_review not applied to state actions; no head publish | FIXED-VERIFIED | `…/essays/[essayId]/route.ts:65-67,98`; test "forbids a supervised counselor from setting the review state"; publish flow test "shows the student a supervised draft once a head publishes it"; UI `counselor/students/[studentId]/page.tsx:331` | Live check the Publish button and hidden state buttons (list a) |
| QA-21 | Assignment API without UI; `assigned` not bucketed; non-primary assignee lacks file access | OPEN-DESIGN | `counselor/dashboard/page.tsx:38-42` no `assigned`; no assignment UI | Codex D4.9, then Claude |
| QA-22 | No document vault, relationship DM, quiet/digest notifications | OPEN-DESIGN | Not present | Codex D4.9 (+ D4.5 private files) |
| QA-23 | Invite destination lost through fresh signup | FIXED-VERIFIED | `lib/safe-next.ts`; `login`/`signup` carry `next` (`signup/page.tsx:22,80,100,178`), email + Google redirect via `/auth/callback?next=` (`contexts/AuthContext.tsx` signUpWithEmail/signInWithGoogle); `/join/` exempt from onboarding gate `middleware.ts:175-182`; tests `next-propagation.test.tsx`, `safe-next.test.ts` pass. Fix-3 Task 7 live step did not create a new account | Live: full new-account + email-confirmation path (list a) |
| QA-24 | Grade 9 mobile priority cards clip; coach launcher overlays; "Welcome" only | OPEN-DESIGN | No layout change; e2e `tests/e2e/student-variants.spec.ts:76-77` reports 0 page-level overflow at 375 for all variants (claude-progress refocus, 16/16) but can't see clipped cards inside hidden overflow | Codex D4.2 |
| QA-25 | Activities empty state dead end without resume | FIXED-UNVERIFIED | "Add manually" + manual form `cc/activities-optimizer/page.tsx:236-257` (1da0d10); no test | Live check g9 (list a) |
| QA-26 | Courses default Grade 11 / US(AP); no regular level; no Ontario/transfer | OPEN-CODE | `cc/courses/page.tsx:24-25,31-32` hard defaults, `LEVELS` lacks regular | Claude: default from profile grade/curriculum, add "Regular"; Ontario/credit workflow → Codex D4.6 |
| QA-27 | Settings link 404 | FIXED-VERIFIED | `app/settings/page.tsx` exists; sidebar → `/settings` (`nav/sidebar-data.ts:105`); `nav-links.test.ts` passes; prod smoke `/settings` 200; e2e walks `/settings` | New sibling defect: drawer Sign out → `/account/sign-out` (flag 4) |
| QA-28 | Visits school picker empty for g9, no add-school path | OPEN-DESIGN | `cc/visits/page.tsx:93-96` unchanged | Codex D4.6 |
| QA-29 | Summer program suggestions unsourced (Pakistan programs) | OPEN-DATA | No sourcing change | Agent slice f (dated opportunity finder); official dated sources |
| QA-30 | Saved courses don't inform dashboard/Coach | OPEN-CODE | Coach reads no course table (`api/cc/coach/message/route.ts`) | Claude: agent slice a1 `read_context` |
| QA-31 | Mobile nav omits features; More shows old tech features | OPEN-DESIGN | Tech items gone (refocus `ddb9204`; `TopNav.tsx:41-47` now admissions-only — that part MOOT); More still ignores grade locks (g9 sees Applications/Interview prep, which `isGrade9BlockedPath` bounces) and lacks Activities/Visits | Codex D4.2 |
| QA-32 | Major fit scores imply false precision | OPEN-DESIGN | `cc/majors/page.tsx:105` `{fitScore}/10`; `api/cc/major-quiz/route.ts:31` | Codex D4.6 (+ prompt change by Claude) |
| QA-33 | Fixed PSAT 1,420 shown as personal target | OPEN-CODE | Literal `cc/dashboard/variants.ts:737` | Claude: remove/derive; agent slice c |
| QA-34 | School list auto-opens Coach (full-screen on phone); X unlabeled; `/api/cc/me` 404 | OPEN-CODE | `/api/cc/me` fixed (fix-5b `a223956`, `me.test.ts` passes). Auto-open unconditional `schools/page.tsx:134-141` (flag 3) | Claude: remove auto-open (or gate to guest handoff); Codex D4.3 |
| QA-35 | Testing guidance (formats, fee waivers) unsourced | OPEN-DATA | No change | Official dated sources |
| QA-36 | Onboarding concerns don't change priorities | OPEN-CODE | No `concerns` read in dashboard/variants | Agent slice c (JourneyState, "student priorities") |
| QA-37 | Recommender saved but list empty | FIXED-VERIFIED | Order by `name` + 500 on error `api/cc/recommenders/route.ts:17-24`; share link `api/cc/shared/[token]/route.ts:105-108`; tests `recommenders-list.test.ts`, `shared-link-recommenders.test.ts`, `cc/recommenders/__tests__/page.test.tsx` pass; claude-progress live POST→GET | Live re-check (list a) |
| QA-38 | Brainstorm header/workspace overflow at 375 | FIXED-UNVERIFIED | `.kl-bs-subhead`/`.kl-phase-bar` used `BrainstormChat.tsx:629,644`; contract test pins grid class only; claude-progress measured Revise/Draft/Outline, not Brainstorm | Live 375 Brainstorm check (list a) |
| QA-39 | Application tracker loses sidebar/title | OPEN-DESIGN | `app/applications/page.tsx` renders `ApplicationBoard` with no `AppShell` (only `cc/`, `counselor/`, `engagements/` layouts wrap) | Codex D4.2/D4.5 |
| QA-40 | Empty senior dashboard "All deadlines logged"; supplements 0 of 1; unsourced Nov 1 | OPEN-CODE | `cc/dashboard/variants.ts:480` (no-deadline ⇒ "All deadlines logged."), `:496` `Math.max(…,1)`, `:313` "November 1" | Claude pure bug; slice c; Codex D4.2 wording |
| QA-41 | Essay Attach button is a no-op | OPEN-CODE | `BrainstormChat.tsx:915-917` still no handler/input | Claude: hide until D4.4/D4.5 designs upload |
| QA-42 | Toronto: blank city/province, $0 cost, bare badge, US-only filters | OPEN-DATA | Partial code: `$0` hidden `components/cc/SchoolCard.tsx:110-118` (no test); country filter exists `schools/page.tsx:39,74,149`; city/province and rate sourcing unresolved | Official dated data; Claude test for unknown-cost rendering |
| QA-43 | U of T gets Common App checklist and ED/EA/QuestBridge | OPEN-DATA | No per-country platform/requirements model found | Official requirements data; Codex D4.5 |
| QA-44 | Interview prep shows 0.43% vs 43% | OPEN-CODE | `cc/interview-prep/page.tsx:188-189` prints fraction with `%` | Claude: `Math.round(rate*100)` |
| QA-45 | Coach can't explain counselor access/uploads | OPEN-CODE | No product-knowledge/relationship context in coach | Agent slice a1 `read_context`; Codex D4.3 |
| QA-46 | 2025–26 deadlines shown in Sept 2026 without cycle/source | OPEN-DATA | `src/data/school-deadlines-2026.json` unchanged | Official current-cycle data with dates/sources |
| QA-47 | "Submitted 0" counts essays next to a submitted app; hardcoded March/May 1 | OPEN-CODE | `variants.ts:752,764` label "Submitted" = `essaysSubmittedCount`; `:528,560,766,773` fixed dates | Claude relabel; slice c |
| QA-48 | `/cc/net-price` 404; no offer-comparison action | FIXED-VERIFIED | `app/cc/net-price/page.tsx`; prod smoke `/cc/net-price` 200 (claude-progress 2026-09-27); e2e walks it for all variants | Offer-comparison action for decisions students → Codex D4.7 |
| QA-49 | LOCI generates with empty fields; model picks programs/professors | OPEN-CODE | Prompt `api/cc/waitlist/loci/route.ts:49` "If the user hasn't named any, pick something concrete…"; only `schoolName` required `:17-19` | Claude: require student-supplied specifics, drop invention; founder policy on LOCI authorship |
| QA-50 | Transfer onboarding says Coach "will draft your transfer essay" | OPEN-CODE | `onboarding/page.tsx:618` unchanged | Claude: one-line copy fix (violates no-prose rule) |
| QA-51 | Transfer GPA dropped at onboarding | FIXED-VERIFIED | `api/cc/onboarding/complete/route.ts:110-122`; `lib/cc/parse-gpa`; tests `onboarding-transfer-gpa.test.ts`, `parse-gpa.test.ts` pass | Minor: `gpa_scale` always "4.0" |
| QA-52 | Transfer dashboard links mislead; `?type=transfer` opens first-year prompt | OPEN-CODE | `variants.ts:693,695` ("Course evaluations"→`/cc/courses`, "Translate-for-parent docs"→`/cc/recommenders`); `cc/essays/page.tsx` never reads `type` | Claude links/param; Codex D4.2 transfer voice |
| QA-53 | Coach can't see saved transfer school/credits/term | OPEN-CODE | Coach knows the variant only (`lib/cc/coach-prompt-builder.ts:240-250`), reads no `transfer_*` field | Agent slice a1 `read_context` |
| QA-54 | Ontario dashboard pushes SAT/Common App; courses US-default | OPEN-DESIGN | No region-aware change | Codex D4.2/D4.6; slice c |
| QA-55 | Ontario coach asserts eligibility/policy without dated sources | OPEN-DATA | No change | Official sources; agent slice b output check |
| QA-56 | History UI 50 vs model 20 messages | OPEN-CODE | `api/cc/coach/history/route.ts:29` vs `api/cc/coach/message/route.ts:392` | Agent slices a2/d |
| QA-57 | Stored reply missing until reload | OPEN-CODE | Not reproduced cleanly; no fix | Claude: clean repro first |
| QA-58 | General Coach can't read Essay Studio brainstorm notes | OPEN-CODE | Coach never selects `brainstorm_transcript` | Agent slice a1 `read_essay` (plan l.481 selects it) |
| QA-59 | Essay Studio denies prior-session memory | OPEN-CODE | Full transcript is sent (`api/cc/essays/[id]/brainstorm/route.ts:53-67`); behaviour is the model's; no eval | Agent slice b (returning-student evals) |
| QA-60 | Outline generation 500 | FIXED-UNVERIFIED | Hardening: JSON mode/retry/refund/503 `outline/route.ts:88-92`; test `outline-generate.test.ts` passes. Root cause never reproduced (flag 6) | Live: generate outlines on prod; read Vercel `[callLLMJSON:outline]` |
| QA-61 | Brainstorm claims uniqueness/rarity | OPEN-CODE | No prompt/check change | Agent slice b semantic output check |
| QA-62 | Draft coaching misattributes evidence | OPEN-CODE | No change | Agent slice b |
| QA-63 | Revise vs Coach conflicting next steps; 500-word proxy | OPEN-CODE | No change | Agent slice b (versioned revision judgment) |
| QA-64 | Review notes poorly anchored to paragraphs | OPEN-CODE | No change | Agent slice b |

MOOT note: the refocus removed no surface that a QA item is wholly about. `/cc/courses` (QA-26/30) is high-school coursework and is kept. Only the "old tech features in More" half of QA-31 is moot.

---

## (a) Must be re-checked live in the browser before deploy

Use the release-candidate build (preview or `next start` against the real project), QA accounts only.

| # | What | Route | Account |
|---|---|---|---|
| 1 | Invite survives brand-new signup incl. email confirmation; lands linked; name appears in roster | signed out `/join/<code>` → `/login` → Sign up → confirm email → `/join/<code>` → "You're linked to …" → `/onboarding` → `/cc/dashboard` chip; then `/counselor/students` | New plus-address student (grade 9); head `qa-c1` to mint the code at `/counselor/team` |
| 2 | Recommender appears after save and after reload | `/cc/recommenders` | Junior (e.g. `e2e-v-junior` or astra-test3) |
| 3 | Settings and net-price load; drawer Sign out | `/settings`, `/cc/net-price`, phone drawer "Sign out" on `/cc/dashboard` at 375 | Any student; decisions student (astra-test6) for net-price |
| 4 | Transfer GPA and profile pre-fill | onboarding transfer path, then `/cc/transfer-profile` | New transfer student |
| 5 | Mobile Essay Studio, all four phases, no overlap/overflow | `/cc/essays/<id>` brainstorm, outline, draft, revise at 375×812 | Grade 12 writing (astra-test4 or qa-s1) |
| 6 | Review visibility and supervised publish | graduate comments → draft hidden → head clicks "Publish to student" at `/counselor/students/<test9>` → student sees panel in **Brainstorm** phase at `/cc/essays/<id>`; graduate sees note, no state buttons | Supervised graduate `astra-graduate1`, head `qa-c1`, student astra-test9 |
| 7 | Outline generation | `/cc/essays/<id>` Outline → "Generate 3 outline options"; Vercel log `[callLLMJSON:outline]` | Grade 12 writing (astra-test4) |
| 8 | Signed-out counselor discovery returns data (network 200, not 401) | `/find-counselor` | Signed out |
| 9 | Coach doesn't cover the school list on phone | `/schools` at 375 | Grade 10 (astra-test2) |
| 10 | Single header on marketing pages | `/pricing`, `/stories`, `/product/counselor` at 375 and 1440 | Signed out and signed in |
| 11 | Activities "Add manually" works with no resume | `/cc/activities-optimizer` | Grade 9 (astra-test1) |
| 12 | Direct hard-load of team page doesn't bounce | `/counselor/team` (hard reload) | Head `qa-c1` |
| 13 | Signup credits copy (currently wrong) | `/signup` and post-signup "Verify your email" | Signed out |
| 14 | Toronto cost not shown as $0 | `/schools` search "Toronto", saved card | Ontario student (astra-test8) |
| 15 | Glossary terms render for guest (prod table has 0 rows) | any marketing page; `/api/cc/glossary` | Signed out |

---

## (b) Counts

QA-01..QA-64 (64 rows):

| Status | Count |
|---|---|
| FIXED-VERIFIED | 13 (02, 04, 05, 06, 07, 18, 19, 20, 23, 27, 37, 48, 51) |
| FIXED-UNVERIFIED | 7 (01, 03, 08, 14, 25, 38, 60) |
| MOOT | 0 (part of 31 only) |
| OPEN-CODE | 26 (09, 10, 13, 15, 26, 30, 33, 34, 36, 40, 41, 44, 45, 47, 49, 50, 52, 53, 56, 57, 58, 59, 61, 62, 63, 64) |
| OPEN-DESIGN | 10 (16, 17, 21, 22, 24, 28, 31, 32, 39, 54) |
| OPEN-FOUNDER | 2 (11, 12) |
| OPEN-DATA | 6 (29, 35, 42, 43, 46, 55) |

Top ten: FIXED-VERIFIED 1 (T1), FIXED-UNVERIFIED 2 (T2, T9), OPEN-CODE 3 (T4, T6, T10), OPEN-DESIGN 3 (T3, T5, T7), OPEN-FOUNDER 1 (T8).

Quick Claude wins (pure bugs, small): QA-13 signup copy + tripwire, QA-15 public search API, QA-34 auto-open, QA-41 Attach, QA-44 percent, QA-50 copy, QA-52 links, QA-09 exhausted codes, `activity_name` (flag 5), drawer Sign out (flag 4), QA-26 defaults, QA-40 empty-state copy.
