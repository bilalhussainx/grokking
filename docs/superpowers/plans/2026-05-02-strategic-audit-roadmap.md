# Strategic Audit Roadmap — Workstream Index

**Date:** 2026-05-02
**Source:** `docs/reports/2026-05-02-kairoslearn-strategic-audit-result.md` (8 prompts, 960 lines)
**Companion plan (mobile, parallel stream):** `docs/superpowers/plans/2026-05-02-mobile-responsive-design.md`

This document is **not** a build plan. It's the index that sequences every audit-derived workstream against Audit Prompt 8's 4-week schedule, flags overlap with already-shipped work, and points to the dedicated implementation plan for each workstream. Each row is a separate session worth of work; the writing-plans skill is invoked once per row when that workstream comes up.

---

## Already shipped (do not re-plan)

| Audit signal | What shipped | Commits / plan |
|---|---|---|
| Prompt 1 Row 4 (Pakistani senior writing path) — voice moat | Multilingual coach (Sarvam Hindi/Punjabi + Deepgram Urdu), Family Mode | Pre-existing per `HindiPunjabiUrdu-VoiceMode.md` |
| Prompt 1 Row 6 (parent who doesn't read English) — schema reconciliation | Coach reads `home_language` fallback via `pickCoachLanguage`; PATCH writes both columns; backfill migration; Urdu hard-block for voice; TTS errors surfaced | Plan: `docs/superpowers/plans/2026-05-02-coach-multilang-translation-fixes.md` (executed 2026-05-02) |
| Prompt 4 Gap 3 (coach refuses Brampton schools) — short-term softening | NOT YET — see Workstream C below for the full Canada module |
| Prompt 7 Family Mode | Coach drawer broadcasts `kairos:message-complete` with `extracted` count + `actionKinds`; v2 dashboard auto-refetches; toast in coach drawer | Plan: `docs/superpowers/plans/2026-05-02-coach-action-execution-reliability.md` |
| Prompt 1 Row 7 (counselor demo-ware) | NOT YET — see Workstream G below |
| Variant-aware unified dashboard | Glass-aesthetic orchestrator gated behind `?dashboard=v2`, 12 standalone section files, single-source `/api/cc/dashboard/summary` | Plan: `docs/superpowers/plans/2026-05-02-unified-dashboard-implementation.md` |
| Essay editor voice persistence | `useVoicePreference` hook + localStorage in `BrainstormChat` | Plan: `docs/superpowers/plans/2026-05-02-essay-voice-mode-persistence.md` |

---

## Workstreams (one writing-plans session each)

### Workstream A — Parent Weekly Digest (multilingual)

**Audit anchors:** Prompt 1 Row 6 + Prompt 3 #2 + Prompt 7 §4 + Prompt 8 Week 1.
**Status:** Plan written this session — `docs/superpowers/plans/2026-05-02-parent-weekly-digest.md`.
**Effort:** Small (3-5 days). Resend wrapper + `cc_parent_invites` table already shipped.
**Why first:** Pro just monetized; parent engagement is the highest-leverage retention lever; closes the moat against Kollegio.ai matching multilingual voice.
**Bundled cleanup (free 2-3 days):** seed 7 missing supplements (Amherst, Williams, Bowdoin, Rice, Pomona, Wellesley, Middlebury); branch international fee-waiver checker on `country` (Prompt 4 Gap 4).
**Metric:** month-2 churn delta between Pro users with vs. without an accepted parent invite.

### Workstream B — Aid Offer Comparator + `decisions` Coach Mode

**Audit anchors:** Prompt 1 Row 4 + Prompt 3 #1 + Prompt 4 Gap 2 + Prompt 6 #6 + Prompt 8 Week 2.
**Status:** Plan to be written next session.
**Effort:** Medium (2-3 weeks).
**Scope:** new `aid_offers` table (school, gross_cost, grants, loans, work_study, net_cost, currency); paste-or-upload ingest UI (no OCR for v1); side-by-side comparator at `/cc/aid-offers` with USD↔PKR conversion + 4-year projection; `decisions` mode in `coach-prompt-builder.ts` consuming `aidOffers[]` to draft negotiation letters; `senior_decisions` priority card retargeted to `/cc/aid-offers`.
**Why second:** May 1 deposit deadline just passed and `senior_decisions` walkthrough promised an aid comparator that doesn't exist. Fix while the failure is recent. Family Mode in Urdu becomes useful here for the first time (parent reading aid letters).
**Metric:** `senior_decisions` retention from March-May 2027; aid_offers ingested per Pro user; negotiation letters drafted.

### Workstream C — Canada Foundation (Q3 2026 launch)

**Audit anchors:** Prompt 2 (Canada=BUILD) + Prompt 4 Gap 3 + Prompt 4 Gap 5 + Prompt 8 Week 3.
**Status:** Plan to be written next session. Research-heavy — needs OUAC application platform mechanics, provincial grading conversions, McGill/UofT/Waterloo current 2026-27 supplement prompts.
**Effort:** Medium-high (6-8 weeks for credible v1; minimum surface ships in Week 3 of audit's 4-week plan).
**Scope:**
1. Add Canadian percentage band conversion to `coach-prompt-builder.ts` (Ontario top-6 average, BC cumulative, Alberta diploma scores, Quebec R-score). Drop the wrong "your system grades harder" qualifier for Canadian students.
2. Seed ~12 Canadian schools in `school-deadlines-2026.json` + `school-application-plans.json` (UofT, UBC, McGill, Waterloo, Queen's, Western, McMaster, Alberta, Ottawa, SFU, Toronto Metropolitan, York). Use 2026-27 cycle dates (most January 15 / February 1).
3. Soften the hardcoded `SCHOOL CATALOG CONSTRAINT` in `coach-prompt-builder.ts` — currently refuses UofT/UBC/McGill/Waterloo for the explicitly-stated Brampton ICP. Branch on `student.country === 'CA' || 'PK'`.
4. Add a Canada-specific guidance block mirroring `buildInternationalBlock`: percentage→GPA conversion, OSAP, OUAC vs. provincial portals, currency considerations, dual-apply US+CA strategy.
5. 5-7 supplement prompts each for UofT/Waterloo/Queen's/UBC.
**Out of scope:** OUAC submission integration; Quebec CEGEP path; French UI translation.
**Metric:** Canadian sign-ups in Q3; coach catalog acceptance rate for Canadian schools (currently 0%); Brampton-zip-code conversion.

### Workstream D — Pakistani-specific External Scholarship Catalog

**Audit anchors:** Prompt 6 #5 + #7 + Prompt 8 Week 4.
**Status:** Plan to be written next session. Light research — Fulbright UGRAD eligibility/USEFP procedures, Aga Khan Foundation programmes, current HEC Pakistan need-based deadlines.
**Effort:** Small-medium (1-2 weeks).
**Scope:** Hand-curated JSON `/data/scholarships-external.json` ~25-30 entries:
- **Pakistani:** Fulbright UGRAD (USEFP, full ride to US — single biggest miss, almost no other platform surfaces this), Aga Khan Foundation International Scholarship Programme, HEC Pakistan need-based, USAID Merit & Need
- **First-gen US:** QuestBridge National College Match, Posse Foundation, Coca-Cola Scholars, Gates Scholarship, Jack Kent Cooke
- **South Asian regional:** Inlaks Shivdasani (limited UG), Tata, Reliance Foundation
- **Forward-looking African:** MasterCard Foundation Scholars Program at Berkeley/Stanford/MIT/Michigan State/USC/CMU — flagged for Year-2 Nigerian segment
**Per scholarship:** name, sponsor, amount, eligibility cutoffs, deadline, application URL, demographic restrictions. Match against student profile. Surface at `/cc/scholarships` + coach mention in school-builder mode for Pakistani students.
**Out of scope:** scholarship aggregator API integration (saturated); auto-match without filtering; tracking applied/won (v2).
**Metric:** scholarship-page sessions per Pro user; saves; free→Pro conversion in Pakistani segment; coach mentions of Fulbright UGRAD per week.

### Workstream E — FAFSA + CSS Profile Depth (Pakistani-tuned)

**Audit anchors:** Prompt 6 #1 + Prompt 6 #2.
**Status:** Plan to be written. Needs research on post-2024 FAFSA SAI calculation (the form was simplified from EFC).
**Effort:** Small + Medium together (~3 weeks for both).
**Scope:**
- **FAFSA walkthrough** (`/profile/fafsa-guide`, mirroring existing CSS Profile guide): FSA ID setup, contributor model (post-2024 simplified), SAI calculation, Pell linkage, FAFSA-required deadlines.
- **CSS Profile depth** (extend `/profile/css-guide`): Asset valuation methodology for PKR-denominated property/gold/agricultural income, worked example with a fictional Karachi family, noncustodial parent scenarios common in Pakistani families (separated/widowed/Gulf-abroad/deceased), Urdu/English document checklist.
**Why the moat is real:** CollegeBoard's CSS help is generic; Pakistani-specific deep guide is something Crimson at $30k won't write because their counselors aren't Pakistani.
**Metric:** Profile guide sessions; coach references that link to the guides.

### Workstream F — Net Price Calculator Aggregator (post-aid-comparator)

**Audit anchors:** Prompt 3 #3 + Prompt 6 #3.
**Status:** Plan to be written AFTER Workstream B. They share the `cc_financial` schema.
**Effort:** Medium (3-4 weeks).
**Scope:** Single intake form (income, assets, household size, # in college, home equity, untaxed income) → KairosLearn approximate NPC per school using each school's published methodology, with `averageAidByIncome` bracket fallback. Side-by-side cost projection across the user's school list. Always link to the official NPC with disclaimer (mirrors existing ED Calculator legal stance).
**Don't:** scrape/automate school NPCs (heterogeneous, brittle, ToS-risky); just link out (parent fills 25 forms — that's the problem).
**Metric:** NPC-form completion rate; school list size growth post-NPC-completion; affordability filter use.

### Workstream G — Counselor Cohort Dashboard (institutional sales)

**Audit anchors:** Prompt 1 Row 7 + Prompt 3 #7 + Prompt 7 §3.
**Status:** Plan to be written when institutional revenue becomes the goal. Deferred to Q3-Q4 2026 per Prompt 8.
**Effort:** Large (6-8 weeks one-engineer; needs B2B sales motion in parallel).
**Scope:** new `counselor_accounts` + `counselor_caseload` tables; per-student opt-in invite flow (mirrors parent invite); cohort roster at `/counselor/roster` (50 students × deadline traffic-light × essay status × supplements completed × aid forms outstanding × last coach session); essays-awaiting-review queue; per-student drill-down with counselor-only annotations; weekly counselor digest (reuses Workstream A's Resend pipe); CSV export.
**Out of scope:** transcripts, scattergrams, district SIS integration, school profile, Common App counselor-portal integration, recommendation letter routing — those are Naviance moat. KL competes on counseling intelligence, not document workflow.
**Metric:** counselor seats sold ($50-200/mo per counselor); student conversion path per seat (1:50); enterprise contract signups.

### Workstream H — UC PIQ Workspace (Common App alternative platforms)

**Audit anchors:** Prompt 3 #4.
**Status:** Plan to be written. Lower priority than A-D but high stickiness for CA Pakistani/Indian-origin diaspora.
**Effort:** Medium-large (3-4 weeks).
**Scope:** UC Personal Insight Questions workspace — 4-prompt parallel editor inside existing supplement studio infrastructure with UC-specific "show, don't tell" coaching layer. Skip Coalition entirely (sunset). ApplyTexas in v2.
**Out of scope:** all four platforms in one sprint; ApplyTexas; Coalition.
**Metric:** UC PIQ drafts per California-resident user; UC submission rate.

### Workstream I — Visa / I-20 Tracker (post-admit lifecycle)

**Audit anchors:** Prompt 3 #5.
**Status:** Plan to be written. Closes the "got-you-in" → "got-you-there" gap; no competitor does this.
**Effort:** Small-Medium (1-2 weeks; mostly content + status tracker).
**Scope:** Post-deposit checklist per school: I-20 received → SEVIS fee paid → DS-160 submitted → embassy slot booked → visa interview prep. Pakistani-specific tail: Islamabad/Karachi/Lahore consulate wait times.
**Metric:** post-deposit retention through July (matriculation); visa-step completion.

### Workstream J — Merit Scholarship Matcher per School

**Audit anchors:** Prompt 3 #6 + Prompt 6 #4.
**Status:** Plan to be written after Workstream D (scholarship infrastructure shared).
**Effort:** Medium (2-3 weeks).
**Scope:** Hand-curated JSON of ~30-40 named merit scholarships at the schools already in the catalog (USC Trustee, Vanderbilt CV, Duke Robertson, UNC Morehead-Cain, UVA Jefferson, BC Presidential, ND Hesburgh-Yusko, Tulane Stamps, WashU Danforth, etc.). Schema: name, school, amount, eligibility cutoffs, application path, deadlines, demographic restrictions. Match against student intake; surface at `/cc/scholarships` as "you might qualify."
**Why this matters for ICP:** Pakistani internationals locked out of FAFSA-based aid often think their only path is the canonical 8 need-blind schools. Merit at USC/Vanderbilt/WashU/Duke is the alternate path — currently invisible.
**Metric:** merit-eligible matches surfaced per Pakistani-international user; applications-started.

### Workstream K — CI Guard for Canonical-list ↔ Seed JSON Integrity

**Audit anchors:** Prompt 4 pattern fix + Cross-cutting synthesis observation #2.
**Status:** Plan to be written. Tiny but cross-cutting — prevents the entire class of "coach promises a school the seed JSON doesn't have" regression going forward.
**Effort:** Small (1 day).
**Scope:** A vitest test that:
1. Parses every canonical school list out of `coach-prompt-builder.ts` (need-blind 8, need-aware-meets-need 8, first-gen guidance schools, etc.)
2. Confirms each named school exists in `supplement-prompts-2026.json`, `school-deadlines-2026.json`, and `school-application-plans.json`
3. Confirms every walkthrough seed in `variant-walkthroughs.ts` that references a route or coach mode points at one that exists
4. CI fails the build on mismatch.
**Why now:** This guard would have caught all five depth gaps in Prompt 4 before they shipped. Cheap insurance against future regressions.
**Metric:** future regressions prevented (negative — measured by absence of new gaps in subsequent audits).

### Workstream L — Defensive Year-2 Plays (multilingual depth)

**Audit anchors:** Prompt 5 §4 (Year-2 competitive threat).
**Status:** Plan to be written in Year-2. Add Cantonese, Tamil, Bengali, Tagalog voice support before Kollegio.ai gets to Urdu — extends the moat that's currently 12-18 months.
**Effort:** Medium per language (2 weeks each = 8 weeks for all four).
**Scope:** `voice-provider-router` + `coach-languages.ts` extension; system-prompt language directives for new languages; TTS validation in production.
**Sequencing:** ship after Workstream B (aid comparator) and Workstream C (Canada) — those are stickier; the multilingual depth is defensive.

### Workstream M — UK/Europe Foundation

**Audit anchors:** Prompt 4 Gap 3 (extended from Workstream C); Prompt 5 §4 (Year-2 defensive plays).
**Status:** Plan written + executed 2026-05-02 — `docs/superpowers/plans/2026-05-02-uk-europe-foundation.md`.
**Effort:** Medium (2-3 weeks one-engineer).
**Scope:** 12 UK universities (Oxford, Cambridge, Imperial, LSE, UCL, KCL, Edinburgh, Manchester, Bristol, Warwick, Durham, St Andrews) seeded into `cc_schools` with `country='UK'` + `region`. UCAS application platform for all. 2026-cycle 3-question personal statement format codified. Admissions tests registry (MAT, PAT, LNAT, TMUA, ESAT, TSA, HAT, UCAT, MLAT) with `testsForSchoolCourse(school, course)` matcher. Pakistani-specific scholarship surfacing (Saïd Foundation, Reach Oxford, HEC, etc.) via `relevantScholarships()` filter. Coach `buildUKBlock(ctx)` mirrors `buildCanadaBlock`; `buildCatalogConstraint` extended to relax for UK + CA + PK contexts. Branch tests verifying Saïd surfacing fires only for Pakistani students.
**Out of scope:** German / French / Dutch universities (separate plan if demand emerges); Oxbridge college-choice tooling (UI deferred); UCAS submission integration (students copy-paste between KL and UCAS).
**Metric:** UK sign-ups; Saïd Foundation surfacing rate; coach catalog acceptance for UK schools (currently 0%); Pakistani-Brampton + Pakistani-domestic conversion uplift.

---

## Synthesis: 4-week schedule per Audit Prompt 8

| Week | Workstream | Plan |
|---|---|---|
| 1 | A — Parent Weekly Digest + bundled cleanup (7 supplements, intl fee waiver) | Written this session |
| 2 | B — Aid Offer Comparator + `decisions` mode | TBD |
| 3 | C — Canada Foundation | TBD |
| 4 | D — Pakistani External Scholarships | TBD |

After the 4 weeks, the next sprint sequence (per Prompt 8 deferred items):

| Sprint | Workstream | Why this order |
|---|---|---|
| 5-6 | F — NPC Aggregator | Builds on Workstream B's aid schema; foundational for affordability filter |
| 7-8 | E — FAFSA + CSS Profile depth | Pakistani-tuned content moat; first-gen US value |
| 9 | K — CI guard | Tiny but prevents future regressions; sequence whenever |
| 10-12 | J — Merit Matcher | Builds on Workstream D's scholarship surface |
| 13-14 | I — Visa / I-20 tracker | Closes the post-admit lifecycle |
| 15-18 | H — UC PIQ Workspace | California diaspora retention |
| Q3-Q4 2026 | G — Counselor Cohort Dashboard | Institutional sales motion |
| Year 2 | L — Cantonese/Tamil/Bengali/Tagalog | Defensive depth before Kollegio matches Urdu |

---

## Out-of-band parallel: Mobile Responsive Design

**Anchors:** `docs/superpowers/designs/mobile/INDEX.md` + the 6 dashboard variants + 6 nav variants + landing page in handoff HTML.
**Status:** Plan written this session — `docs/superpowers/plans/2026-05-02-mobile-responsive-design.md`.
**Effort:** Medium (3-4 weeks for landing + dashboard + nav).
**Why parallel:** unblocks phone testing of every workstream above; the audit ICP (Pakistani family in Brampton) is more likely to be phone-first than the team thinks.

---

## What I deliberately did NOT plan

- **Prompts 5 + 8 stand-alone plans.** Prompt 5 is competitive positioning; Prompt 8 is the synthesis. Neither is a build plan; both inform the sequencing above. The marketing positioning sentence ("the only college counselor that talks to your mother in Urdu at 11pm the night before the deadline — for $12 a month") goes on the landing page (Mobile plan) rather than into a separate workstream.
- **Hong Kong, Mainland China, Singapore.** Per Prompt 2 — wait, wait, partner-or-wait. No build plan for these in 2026 or 2027.
- **Adaptive SAT/ACT practice (Prompt 3 #9).** Khan Academy + Bluebook are free and best-in-class; wrong shape for one engineer.
- **ASSIST.org / CA articulation (Prompt 3 #13).** Niche; bundle into transfer essay module if/when transfer leaves demo-ware.
- **Plagiarism / AI-detection guard (Prompt 3 #8) and Yield Protection model (#10).** Filler-tier per Prompt 3; useful but defensive. Cut if budget tightens.

---

## How to use this document

When a workstream comes up:
1. Open this index, find the workstream row.
2. Invoke `/superpowers:write-plan` (or directly `Skill: superpowers:writing-plans`) with this row's scope as the brainstorm seed.
3. Save the plan at `docs/superpowers/plans/2026-05-02-<workstream-slug>.md`.
4. Update this index: change "Status: Plan to be written" → "Plan written".
5. Execute via subagent-driven-development or inline execution per the plan's recommendation.

Each row above has been pre-thought enough that the brainstorming session should converge in 2-3 rounds rather than 8-10 — most of the open design questions are already answered in the audit.
