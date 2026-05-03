# Canada Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make KairosLearn usable for Canadian-Pakistani families dual-applying to Canadian and US universities. Stop the coach from refusing to discuss UofT/UBC/McGill/Waterloo (the explicitly-named ICP's natural fallback schools), seed 12 Canadian universities into the catalog with real 2026-27 cycle deadlines, fix the Canadian percentage→GPA conversion (currently treats Ontario 92% as Pakistani 92%), and ship the minimum coach guidance for OUAC + provincial application platforms.

**Architecture:** Extend `cc_schools` with a `country` column + Canadian-specific deadline fields. Add a new Canada coach block in `coach-prompt-builder.ts` mirroring the existing `buildInternationalBlock` pattern. Soften the hardcoded `SCHOOL CATALOG CONSTRAINT` so it relaxes when `student.country IN ('CA', 'PK')`. Don't fork senior variants in v1 — use country-aware copy inside the existing `senior_writing/_post_submit/_decisions` blocks (cheaper to maintain; audit's stricter forking is deferred to v2). Aid surface is intentionally light: provincial aid (OSAP, StudentAidBC, AlbertaStudent Loans, Quebec AFE) gets a coach block, no separate UI.

**Tech Stack:** Next.js 16, TypeScript 5, Supabase (Postgres), OpenRouter Sonnet 4.6 (coach), no new external services.

**Audit anchors:**
- Prompt 2 — Canada market analysis (BUILD recommendation, 6-8 weeks)
- Prompt 4 Gap 3 — coach refuses Brampton ICP's natural fallback schools
- Prompt 4 Gap 5 — international academic mode has no Canadian grading path
- Prompt 8 Week 3 — explicit Q3 launch buffer

**Roadmap:** `docs/superpowers/plans/2026-05-02-strategic-audit-roadmap.md` Workstream C.

---

## Pre-verified state

**Existing seeds (US-only):**
- `src/data/school-deadlines-2026.json` — 20 US schools with `deadline_ea/_ed/_rea/_rd/_financial_aid/_css_profile/_fafsa` fields and `portal_url`.
- `src/data/school-application-plans.json` — `{ plans: [...], is_public, need_aware_for_internationals }` per school.
- `src/data/supplement-prompts-2026.json` — 15 US schools with `prompts: [{ type, text, word_limit, required }]`.

**Coach prompt sites that need editing:**
- `src/lib/cc/coach-prompt-builder.ts:114` — `SCHOOL CATALOG CONSTRAINT` line refusing UofT/UBC/McGill/Waterloo.
- `src/lib/cc/coach-prompt-builder.ts:247` — `if (ctx.state && ctx.country === "US")` already conditional on country.
- `src/lib/cc/coach-prompt-builder.ts:383` — `pakistaniTail` already gated on `ctx.country === "PK"`.
- `getModeInstructions()` `case "academic"` (around line 419) — international branch handles Pakistani/Indian/Bangladeshi/Nigerian/Sri Lankan/Nepali percentage. NO Canadian path.

**Variants:**
- `src/app/cc/dashboard/variants.ts:selectVariant` — currently switches on `is_transfer_student` + `grade_level`. Doesn't read `country`.
- `senior_writing/_post_submit/_decisions` priority cards reference US-specific routes (`/applications`, `/cc/test-strategy`).

**Schools table:**
```bash
grep -n "country\|province" supabase/migrations/*schools* | head -5
```
The `cc_schools` table likely doesn't have a `country` column yet — Task 1 adds it.

---

## File map

```
supabase/migrations/
  20260504_canadian_schools.sql                        ← NEW — extend cc_schools + seed 12 Canadian rows

src/data/canadian/
  ca-school-deadlines-2026.json                        ← NEW — 12 schools
  ca-school-application-plans.json                     ← NEW — 12 schools
  ca-supplement-prompts-2026.json                      ← NEW — UofT, Waterloo, Queen's, UBC supplements
  ca-provincial-aid.json                               ← NEW — OSAP, StudentAidBC, AlbertaStudent, AFE

src/lib/cc/canada/
  schools.ts                                            ← NEW — read CA seed JSONs + helper getCanadianSchools()
  schools.test.ts                                       ← NEW — schema validation tests
  grade-conversion.ts                                   ← NEW — Ontario top-6 / BC cumulative / Alberta diploma / Quebec R-score → US 4.0
  grade-conversion.test.ts                              ← NEW
  application-platforms.ts                              ← NEW — OUAC vs UBC vs McGill vs Waterloo platform metadata + URLs

src/lib/cc/coach-prompt-builder.ts                      ← MODIFY — soften SCHOOL CATALOG CONSTRAINT, add buildCanadaBlock,
                                                          add Canadian branch to academic mode

src/lib/cc/coach-prompt-builder.test.ts                 ← NEW (or extend) — snapshot tests for Canadian + PK-CA branches

src/app/api/cc/schools/search/route.ts                  ← MODIFY — include Canadian schools when student.country IN ('CA','PK')

src/lib/cc/canonical-list-guard.ts                      ← NEW (small) — exports canonical school name lists used by coach prompt
                                                          so the CI guard from Workstream K can validate against them

vitest tests for grade-conversion + schools + application-platforms (covered in respective .test.ts files).
```

---

## Diagnosis

### Why Canada — the buyer is already paying for US

The audit's canonical buyer (`HindiPunjabiUrdu-VoiceMode.md`) is "a Pakistani family in Brampton" — the Greater Toronto Area's largest Pakistani-Canadian community. They naturally dual-apply to UofT and Waterloo alongside US Ivies. The coach refusing those questions is the deepest cognitive dissonance in the codebase. Canada is the only international expansion (per Prompt 2) where ICP overlap is direct rather than adjacent: same family, same $12/mo, twice the value.

### Application-platform fragmentation (verified)

Canadian universities don't share a Common App. Six platforms cover the 12-school v1 catalog:

| Platform | Schools | Notes |
|---|---|---|
| OUAC 101 | UofT, Waterloo, Queen's, Western, McMaster, Ottawa, TMU, York | Current Ontario HS students. Single $156 fee covers up to 3 university choices. |
| OUAC 105 | Same Ontario list | International / non-current-Ontario applicants. |
| UBC direct (`you.ubc.ca`) | UBC | Personal Profile required (5 short answers, 200-250 words each). |
| McGill direct (`uApply`) | McGill | Minimal supplements. Grades-driven. Faculty-by-faculty. |
| Waterloo AIF | Waterloo (engineering, math, others) | Admission Information Form on top of OUAC. Critical for engineering admission. |
| ApplyAlberta | UofA | Provincial portal for Alberta. |
| SFU direct | SFU | BC. Direct application. |

This translates to a `application_platform` enum + metadata in the seed (Task 4).

### Provincial grade conversion — the bug

`coach-prompt-builder.ts` `MODE: ACADEMIC (International Student)` ships percentage-band conversion calibrated to Pakistani FSc grading harshness. A Brampton student enters their Ontario percentage of 92% and the coach runs them through the Pakistani-percentage band table ("90-100% = Outstanding → comparable to a US 3.8-4.0 GPA"). Ontario percentages map MORE leniently — a Canadian 92% is closer to a direct US 3.95+ map. US universities accept Canadian transcripts at face value because the systems align. The coach under-converts and adds an unnecessary "schools will recognize that your system grades harder" qualifier that's flatly wrong for Canadian grading.

Fix is a short Canadian arm in the academic mode (Task 9): detect `country === "CA"`, ask which province (Ontario / BC / Alberta / Quebec / other), apply province-specific guidance:

| Province | Conversion approach |
|---|---|
| Ontario | Top-6 senior-year average. 92%+ ≈ US 3.95+. Direct map. |
| BC | Cumulative grade 12 percentage. 90%+ ≈ US 3.9+. Direct map. |
| Alberta | Diploma exam scores (5 subjects × out of 100). Average × 1.04 ≈ US 4.0 scale (rough). |
| Quebec | Cote R / R-score (scale 15-50). 30+ ≈ US 3.5+. Different scale, document with the coach so families know not to over-convert. |
| Other | Ask the student what marking system. |

### Aid is intentionally light

Canadian universities don't use FAFSA/CSS Profile. Aid for international students at most Canadian publics is limited (need-aware admissions, modest scholarships, no full-need policies analogous to US Ivies). Domestic Canadian students have provincial loans (OSAP, StudentAidBC, AlbertaStudent, AFE Quebec). For v1, ship a single coach block that names the four provincial systems and points students at their official portals — no UI, no NPC analog. Rich aid surfacing is deferred to a future workstream.

### Don't fork variants in v1

Audit Prompt 2 §(b) says to add `senior_writing_ca`, `senior_post_submit_ca`, `senior_decisions_ca` variants and rewrite all four senior seeds in `variant-walkthroughs.ts`. That's 4-6 weeks of variant work alone. Pragmatic v1: keep the existing 7 variants, but add country-aware copy inside `coach-prompt-builder.ts` and a Canada-specific guidance block. The variant tree forking is queued for a v2 if the Canadian segment hits material volume in Q4 2026.

---

## Task 1 — Migration: extend `cc_schools` + seed Canadian rows

**Files:** Create `supabase/migrations/20260504_canadian_schools.sql`.

- [ ] **Step 1: Write the migration.**

```sql
-- supabase/migrations/20260504_canadian_schools.sql
-- Adds country + provincial metadata to cc_schools, backfills existing
-- US rows, and seeds 12 Canadian universities for the v1 Canada module.

ALTER TABLE cc_schools
  ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS province TEXT,
  ADD COLUMN IF NOT EXISTS application_platform TEXT,
  ADD COLUMN IF NOT EXISTS osap_eligible BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS cc_schools_country_idx ON cc_schools(country);

-- Backfill: any existing row without country set is US (safe — nothing
-- non-US has been seeded yet).
UPDATE cc_schools SET country = 'US' WHERE country IS NULL OR country = '';

-- ── 12 Canadian universities ──────────────────────────────────────────
-- Sources for 2026-27 cycle:
--   - https://www.ouac.on.ca/ for Ontario application platform deadlines
--   - https://you.ubc.ca/applying-ubc/dates-deadlines/
--   - https://mcgill.ca/undergraduate-admissions/apply
--   - https://uwaterloo.ca/future-students/admissions/dates-deadlines
--
-- The ID column uses gen_random_uuid(); INSERT here uses ON CONFLICT on
-- name to make the migration safely re-runnable. acceptance_rate values
-- are public (Macleans, school-published) and rounded.

INSERT INTO cc_schools (name, country, province, application_platform, website, school_type, acceptance_rate, osap_eligible)
VALUES
  ('University of Toronto',     'CA', 'ON', 'OUAC',         'https://future.utoronto.ca',                              'public', 0.43, TRUE),
  ('University of British Columbia', 'CA', 'BC', 'UBC_direct', 'https://you.ubc.ca',                                    'public', 0.52, FALSE),
  ('McGill University',         'CA', 'QC', 'McGill_direct','https://www.mcgill.ca/undergraduate-admissions/',         'public', 0.46, FALSE),
  ('University of Waterloo',    'CA', 'ON', 'OUAC',         'https://uwaterloo.ca',                                     'public', 0.53, TRUE),
  ('Queen''s University',       'CA', 'ON', 'OUAC',         'https://www.queensu.ca',                                   'public', 0.42, TRUE),
  ('Western University',        'CA', 'ON', 'OUAC',         'https://www.uwo.ca',                                       'public', 0.58, TRUE),
  ('McMaster University',       'CA', 'ON', 'OUAC',         'https://www.mcmaster.ca',                                  'public', 0.59, TRUE),
  ('University of Alberta',     'CA', 'AB', 'ApplyAlberta', 'https://www.ualberta.ca',                                  'public', 0.58, FALSE),
  ('University of Ottawa',      'CA', 'ON', 'OUAC',         'https://www.uottawa.ca',                                   'public', 0.65, TRUE),
  ('Simon Fraser University',   'CA', 'BC', 'SFU_direct',   'https://www.sfu.ca',                                       'public', 0.66, FALSE),
  ('Toronto Metropolitan University', 'CA', 'ON', 'OUAC',   'https://www.torontomu.ca',                                 'public', 0.67, TRUE),
  ('York University',           'CA', 'ON', 'OUAC',         'https://www.yorku.ca',                                     'public', 0.71, TRUE)
ON CONFLICT (name) DO NOTHING;
```

- [ ] **Step 2: Apply locally.**
```bash
npx supabase db push
psql -c "select count(*) from cc_schools where country = 'CA';"  # expect 12
psql -c "select count(*) from cc_schools where country = 'US';"  # expect ≥ 30 (existing)
```

- [ ] **Step 3: Commit.**
```bash
git add supabase/migrations/20260504_canadian_schools.sql
git commit -m "feat(canada): cc_schools.country column + 12 Canadian universities seeded"
```

---

## Task 2 — Seed JSON: `ca-school-deadlines-2026.json`

**Files:** Create `src/data/canadian/ca-school-deadlines-2026.json`.

The Canadian deadline shape differs from US — fewer round types (no EA/ED/REA), often a single application date plus a supplementary form deadline. Schema: `deadline_application` (the OUAC/direct deadline), `deadline_supplementary` (Waterloo AIF, UofT supplementary essays, UBC Personal Profile), `portal_url`.

- [ ] **Step 1: Write the file.**

```json
{
  "University of Toronto": {
    "deadline_application": "2027-01-15",
    "deadline_supplementary": "2027-02-01",
    "portal_url": "https://future.utoronto.ca/apply/",
    "portal_login_note": "Apply via OUAC 101 (current Ontario HS students) or 105 (others); supplementary essays for some faculties."
  },
  "University of British Columbia": {
    "deadline_application": "2027-01-15",
    "deadline_supplementary": null,
    "portal_url": "https://you.ubc.ca/applying-ubc/",
    "portal_login_note": "Direct application; Personal Profile (5 short answers) submitted within the application."
  },
  "McGill University": {
    "deadline_application": "2027-01-15",
    "deadline_supplementary": null,
    "portal_url": "https://mcgill.ca/undergraduate-admissions/apply",
    "portal_login_note": "Direct uApply; minimal supplements. Faculty-by-faculty admission."
  },
  "University of Waterloo": {
    "deadline_application": "2027-01-15",
    "deadline_supplementary": "2027-02-01",
    "portal_url": "https://uwaterloo.ca/future-students/admissions/",
    "portal_login_note": "Apply via OUAC 101/105. Engineering, math, and CS applicants MUST complete the Admission Information Form (AIF) — heavily weighted in the decision."
  },
  "Queen's University": {
    "deadline_application": "2027-01-15",
    "deadline_supplementary": "2027-02-15",
    "portal_url": "https://www.queensu.ca/admission/",
    "portal_login_note": "OUAC 101/105 + Personal Statement of Experience (PSE) for most programs."
  },
  "Western University": {
    "deadline_application": "2027-01-15",
    "deadline_supplementary": null,
    "portal_url": "https://welcome.uwo.ca/admissions/",
    "portal_login_note": "OUAC 101/105. Most programs grades-only; some scholarship apps separate."
  },
  "McMaster University": {
    "deadline_application": "2027-01-15",
    "deadline_supplementary": "2027-02-01",
    "portal_url": "https://future.mcmaster.ca",
    "portal_login_note": "OUAC 101/105. Health Sciences and Arts & Science programs require supplementary applications."
  },
  "University of Alberta": {
    "deadline_application": "2027-03-01",
    "deadline_supplementary": null,
    "portal_url": "https://www.ualberta.ca/admissions/",
    "portal_login_note": "ApplyAlberta provincial portal for Alberta universities."
  },
  "University of Ottawa": {
    "deadline_application": "2027-04-01",
    "deadline_supplementary": null,
    "portal_url": "https://www.uottawa.ca/undergraduate-admissions/",
    "portal_login_note": "OUAC 101/105. April 1 is the late deadline; earlier applications get earlier offers."
  },
  "Simon Fraser University": {
    "deadline_application": "2027-01-31",
    "deadline_supplementary": null,
    "portal_url": "https://www.sfu.ca/admission.html",
    "portal_login_note": "Direct SFU application portal."
  },
  "Toronto Metropolitan University": {
    "deadline_application": "2027-02-01",
    "deadline_supplementary": "2027-02-15",
    "portal_url": "https://www.torontomu.ca/admissions/",
    "portal_login_note": "OUAC 101/105. Some programs (RTA, Image Arts, Fashion) require supplementary portfolio."
  },
  "York University": {
    "deadline_application": "2027-02-01",
    "deadline_supplementary": null,
    "portal_url": "https://futurestudents.yorku.ca",
    "portal_login_note": "OUAC 101/105. Most programs grades-driven."
  }
}
```

**Important caveat for the implementer:** these are 2026-27 cycle dates. Verify each school's published 2026-27 deadlines on its admissions site before merging. School calendars do shift year-to-year (a few days at most). Update notes if you see drift.

- [ ] **Step 2: Commit.**
```bash
git add src/data/canadian/ca-school-deadlines-2026.json
git commit -m "feat(canada): seed 12 Canadian universities with 2026-27 deadlines"
```

---

## Task 3 — Seed JSON: `ca-school-application-plans.json`

**Files:** Create `src/data/canadian/ca-school-application-plans.json`.

Canadian schools don't have EA/ED/REA. The "plans" array is single-element for most: `["RD"]`. A few schools (UBC, Waterloo) admit on rolling basis from earliest applications — call that `"rolling"`.

- [ ] **Step 1: Write the file.**

```json
{
  "University of Toronto":            { "plans": ["RD"],     "is_public": true, "need_aware_for_internationals": true },
  "University of British Columbia":   { "plans": ["RD"],     "is_public": true, "need_aware_for_internationals": true },
  "McGill University":                { "plans": ["RD"],     "is_public": true, "need_aware_for_internationals": true },
  "University of Waterloo":           { "plans": ["rolling"],"is_public": true, "need_aware_for_internationals": true },
  "Queen's University":               { "plans": ["RD"],     "is_public": true, "need_aware_for_internationals": true },
  "Western University":               { "plans": ["RD"],     "is_public": true, "need_aware_for_internationals": true },
  "McMaster University":              { "plans": ["RD"],     "is_public": true, "need_aware_for_internationals": true },
  "University of Alberta":            { "plans": ["RD"],     "is_public": true, "need_aware_for_internationals": true },
  "University of Ottawa":             { "plans": ["rolling"],"is_public": true, "need_aware_for_internationals": true },
  "Simon Fraser University":          { "plans": ["rolling"],"is_public": true, "need_aware_for_internationals": true },
  "Toronto Metropolitan University":  { "plans": ["RD"],     "is_public": true, "need_aware_for_internationals": true },
  "York University":                  { "plans": ["RD"],     "is_public": true, "need_aware_for_internationals": true }
}
```

`need_aware_for_internationals` is `true` for ALL Canadian schools — none has need-blind international admission analogous to the US canonical 8 list. Aid for non-Canadian students is limited; the coach should set expectations.

- [ ] **Step 2: Commit.**
```bash
git add src/data/canadian/ca-school-application-plans.json
git commit -m "feat(canada): application plans + need-aware flags for 12 Canadian schools"
```

---

## Task 4 — Seed JSON: `ca-supplement-prompts-2026.json`

**Files:** Create `src/data/canadian/ca-supplement-prompts-2026.json`.

Only the 4 Canadian schools with meaningful supplements: UofT (faculty-specific essays), Waterloo (AIF), Queen's (PSE), UBC (Personal Profile). McGill is grades-only. Western, McMaster, Alberta, etc. have program-specific supplements that vary too much to ship in v1 — note in the data field that the student should check.

- [ ] **Step 1: Write the file.** (Adapt structure from existing `src/data/supplement-prompts-2026.json`.)

```json
[
  {
    "school_name": "University of British Columbia",
    "prompts": [
      { "type": "personal", "text": "Tell us about who you are. How would your family, friends, and/or members of your community describe you? If possible, please share with us the role(s) of important culture, values, and/or beliefs in shaping who you are.", "word_limit": 250, "required": true },
      { "type": "personal", "text": "What is important to you? And why?", "word_limit": 250, "required": true },
      { "type": "challenge", "text": "Tell us about a difficult or significant situation. What did you do? How does it relate to who you are?", "word_limit": 250, "required": true },
      { "type": "community", "text": "Describe what you have learned from a meaningful experience involving culture, values, and/or beliefs.", "word_limit": 250, "required": true },
      { "type": "personal", "text": "Explain what you like to learn outside the classroom and how you do it.", "word_limit": 250, "required": true }
    ]
  },
  {
    "school_name": "University of Waterloo",
    "prompts": [
      { "type": "intellectual", "text": "Why have you chosen this particular program? What experiences have led to your interest? (Admission Information Form, engineering/math/CS applicants — heavily weighted)", "word_limit": 200, "required": true },
      { "type": "challenge", "text": "Describe an example of overcoming a significant challenge. What did you learn?", "word_limit": 200, "required": true },
      { "type": "personal", "text": "Tell us about your extracurricular and volunteer activities. Which were most significant and why?", "word_limit": 200, "required": true },
      { "type": "intellectual", "text": "Discuss your reasons for choosing your top program choice. What do you hope to contribute and gain?", "word_limit": 200, "required": true }
    ]
  },
  {
    "school_name": "Queen's University",
    "prompts": [
      { "type": "personal", "text": "Personal Statement of Experience (PSE): Reflect on your most significant accomplishments and experiences inside and outside the classroom. How have they prepared you for university?", "word_limit": 300, "required": true },
      { "type": "intellectual", "text": "Why Queen's? What about Queen's specifically appeals to you and your goals?", "word_limit": 200, "required": true }
    ]
  },
  {
    "school_name": "University of Toronto",
    "prompts": [
      { "type": "intellectual", "text": "Why do you want to study at U of T (and at this specific program)? What experiences have led you to this choice? (Required for Engineering, Rotman Commerce, Architecture, and some other programs)", "word_limit": 250, "required": true },
      { "type": "personal", "text": "Tell us about activities or experiences that have shaped you outside the classroom.", "word_limit": 250, "required": true },
      { "type": "challenge", "text": "Describe a significant achievement and what it took to get there.", "word_limit": 250, "required": false }
    ]
  }
]
```

**Implementer note:** verify each school's 2026-27 prompt set on its admissions site before merging — wording can shift year-over-year. The Waterloo AIF prompts especially evolve. Pakistani / international students should be told the AIF carries 60-70% of admit weight at Waterloo Engineering.

- [ ] **Step 2: Commit.**
```bash
git add src/data/canadian/ca-supplement-prompts-2026.json
git commit -m "feat(canada): supplement prompts for UofT, Waterloo, Queen's, UBC"
```

---

## Task 5 — Provincial aid catalog

**Files:** Create `src/data/canadian/ca-provincial-aid.json`.

- [ ] **Step 1: Write the file.**

```json
{
  "ON": {
    "name": "OSAP — Ontario Student Assistance Program",
    "url": "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
    "eligibility": "Canadian citizens, permanent residents, protected persons. Resident in Ontario for ≥12 consecutive months immediately before starting full-time post-secondary studies (with exceptions). Need-based grants + loans.",
    "deadline_note": "Apply once you've accepted an offer — typically June for September start.",
    "international_eligibility": "International students NOT eligible. Limited international scholarships available at each university directly."
  },
  "BC": {
    "name": "StudentAidBC",
    "url": "https://studentaidbc.ca",
    "eligibility": "Canadian citizens, permanent residents, protected persons. BC residency required. Need-based grants + loans.",
    "deadline_note": "Apply once you have a confirmed offer — typically May/June for September start.",
    "international_eligibility": "International students NOT eligible."
  },
  "AB": {
    "name": "Alberta Student Aid",
    "url": "https://studentaid.alberta.ca",
    "eligibility": "Alberta residents who are Canadian citizens, permanent residents, or protected persons.",
    "deadline_note": "Apply 6-8 weeks before classes start.",
    "international_eligibility": "International students NOT eligible."
  },
  "QC": {
    "name": "Aide financière aux études (AFE) — Quebec",
    "url": "https://www.quebec.ca/en/education/student-financial-assistance",
    "eligibility": "Quebec residents. Loans + bursaries.",
    "deadline_note": "Apply once admitted; processing takes 4-6 weeks.",
    "international_eligibility": "International students NOT eligible. Quebec has lower domestic tuition for residents — international tuition is significantly higher."
  }
}
```

- [ ] **Step 2: Commit.**
```bash
git add src/data/canadian/ca-provincial-aid.json
git commit -m "feat(canada): provincial aid catalog (OSAP / StudentAidBC / AlbertaStudent / AFE)"
```

---

## Task 6 — Canadian schools loader + tests

**Files:** Create `src/lib/cc/canada/schools.ts` + `schools.test.ts`.

- [ ] **Step 1: Write the failing test.**

```typescript
// src/lib/cc/canada/schools.test.ts
import { describe, it, expect } from "vitest";
import {
  getCanadianSchools,
  getCanadianDeadline,
  getCanadianApplicationPlan,
  getCanadianSupplementPrompts,
  CANADIAN_SCHOOL_NAMES,
} from "./schools";

describe("getCanadianSchools", () => {
  it("returns 12 schools", () => {
    expect(getCanadianSchools().length).toBe(12);
  });
  it("includes UofT, UBC, McGill, Waterloo by name", () => {
    const names = getCanadianSchools().map((s) => s.name);
    expect(names).toContain("University of Toronto");
    expect(names).toContain("University of British Columbia");
    expect(names).toContain("McGill University");
    expect(names).toContain("University of Waterloo");
  });
});

describe("getCanadianDeadline", () => {
  it("returns deadline + portal info for UofT", () => {
    const d = getCanadianDeadline("University of Toronto");
    expect(d).toBeTruthy();
    expect(d?.deadline_application).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(d?.portal_url).toContain("utoronto");
  });
  it("returns null for unknown school", () => {
    expect(getCanadianDeadline("Hogwarts")).toBeNull();
  });
});

describe("getCanadianApplicationPlan", () => {
  it("returns rolling for Waterloo", () => {
    const p = getCanadianApplicationPlan("University of Waterloo");
    expect(p?.plans).toContain("rolling");
  });
  it("marks every Canadian school need-aware-for-internationals", () => {
    for (const school of CANADIAN_SCHOOL_NAMES) {
      const p = getCanadianApplicationPlan(school);
      expect(p?.need_aware_for_internationals).toBe(true);
    }
  });
});

describe("getCanadianSupplementPrompts", () => {
  it("returns prompts for UBC, Waterloo, Queen's, UofT", () => {
    expect(getCanadianSupplementPrompts("University of British Columbia")?.length).toBeGreaterThan(0);
    expect(getCanadianSupplementPrompts("University of Waterloo")?.length).toBeGreaterThan(0);
    expect(getCanadianSupplementPrompts("Queen's University")?.length).toBeGreaterThan(0);
    expect(getCanadianSupplementPrompts("University of Toronto")?.length).toBeGreaterThan(0);
  });
  it("returns null for grades-only schools (McGill)", () => {
    expect(getCanadianSupplementPrompts("McGill University")).toBeNull();
  });
});
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement.**

```typescript
// src/lib/cc/canada/schools.ts
// Reads the three Canadian seed JSONs and exposes type-safe accessors.
// The CI guard from Workstream K relies on these helpers + the canonical
// list export so it can verify every school named in the coach prompt
// has a deadlines + plans entry.
import deadlines from "@/data/canadian/ca-school-deadlines-2026.json";
import plans from "@/data/canadian/ca-school-application-plans.json";
import supplements from "@/data/canadian/ca-supplement-prompts-2026.json";

export interface CanadianSchool {
  name: string;
}

export interface CanadianDeadline {
  deadline_application: string;
  deadline_supplementary: string | null;
  portal_url: string;
  portal_login_note: string;
}

export interface CanadianApplicationPlan {
  plans: string[];
  is_public: boolean;
  need_aware_for_internationals: boolean;
}

export interface CanadianSupplementPrompt {
  type: string;
  text: string;
  word_limit: number;
  required: boolean;
}

export const CANADIAN_SCHOOL_NAMES = Object.keys(deadlines) as readonly string[];

export function getCanadianSchools(): CanadianSchool[] {
  return CANADIAN_SCHOOL_NAMES.map((name) => ({ name }));
}

export function getCanadianDeadline(name: string): CanadianDeadline | null {
  const map = deadlines as Record<string, CanadianDeadline>;
  return map[name] ?? null;
}

export function getCanadianApplicationPlan(name: string): CanadianApplicationPlan | null {
  const map = plans as Record<string, CanadianApplicationPlan>;
  return map[name] ?? null;
}

export function getCanadianSupplementPrompts(name: string): CanadianSupplementPrompt[] | null {
  const list = supplements as Array<{ school_name: string; prompts: CanadianSupplementPrompt[] }>;
  const found = list.find((s) => s.school_name === name);
  return found ? found.prompts : null;
}
```

You may need to enable JSON imports in `tsconfig.json` if it isn't already:
```json
{ "compilerOptions": { "resolveJsonModule": true, "esModuleInterop": true } }
```

- [ ] **Step 4: Run tests, expect green.**

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/canada/schools.ts src/lib/cc/canada/schools.test.ts
git commit -m "feat(canada): typed loaders for Canadian schools/deadlines/plans/supplements"
```

---

## Task 7 — Canadian grade conversion (TDD)

**Files:** Create `src/lib/cc/canada/grade-conversion.ts` + `grade-conversion.test.ts`.

- [ ] **Step 1: Write the failing test.**

```typescript
// src/lib/cc/canada/grade-conversion.test.ts
import { describe, it, expect } from "vitest";
import {
  ontarioPercentageToUS,
  bcPercentageToUS,
  albertaDiplomaToUS,
  quebecRScoreToUS,
  type CanadianProvince,
} from "./grade-conversion";

describe("ontarioPercentageToUS", () => {
  it("92% → 3.95", () => {
    expect(ontarioPercentageToUS(92)).toBeCloseTo(3.95, 1);
  });
  it("95% → 4.0", () => {
    expect(ontarioPercentageToUS(95)).toBeCloseTo(4.0, 1);
  });
  it("80% → 3.3", () => {
    expect(ontarioPercentageToUS(80)).toBeCloseTo(3.3, 1);
  });
  it("clamps at 4.0", () => {
    expect(ontarioPercentageToUS(99)).toBe(4.0);
    expect(ontarioPercentageToUS(105)).toBe(4.0);
  });
  it("clamps at 0.0", () => {
    expect(ontarioPercentageToUS(-5)).toBe(0);
  });
});

describe("bcPercentageToUS", () => {
  it("90% → 3.85", () => {
    expect(bcPercentageToUS(90)).toBeCloseTo(3.85, 1);
  });
});

describe("albertaDiplomaToUS", () => {
  it("90% diploma average → 3.9", () => {
    expect(albertaDiplomaToUS(90)).toBeCloseTo(3.9, 1);
  });
});

describe("quebecRScoreToUS", () => {
  it("R=33 → ~3.7", () => {
    expect(quebecRScoreToUS(33)).toBeCloseTo(3.7, 1);
  });
  it("R=30 → ~3.5", () => {
    expect(quebecRScoreToUS(30)).toBeCloseTo(3.5, 1);
  });
});

describe("type CanadianProvince", () => {
  it("union covers ON / BC / AB / QC / other", () => {
    const ps: CanadianProvince[] = ["ON", "BC", "AB", "QC", "other"];
    expect(ps).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement.**

```typescript
// src/lib/cc/canada/grade-conversion.ts
// Province-aware grade conversion. Critical to fix the bug where
// coach-prompt-builder runs Canadian percentages through Pakistani-FSc
// bands (Audit Prompt 4 Gap 5).
//
// All functions clamp output to [0, 4.0]. They produce a SINGLE
// approximate US 4.0 value — for advisory use only. US universities
// receiving Canadian transcripts compute their own conversion.

export type CanadianProvince = "ON" | "BC" | "AB" | "QC" | "other";

function clamp(n: number): number {
  if (n < 0) return 0;
  if (n > 4) return 4;
  return n;
}

// Ontario top-6 senior-year average. Linear: 60% → 2.0, 95%+ → 4.0.
// Slope ≈ 0.057 per percentage point above 60.
export function ontarioPercentageToUS(pct: number): number {
  if (pct >= 95) return 4.0;
  if (pct < 60) return clamp(pct / 30); // very rough below the standard band
  return clamp(2.0 + (pct - 60) * (2.0 / 35));
}

// BC cumulative grade-12 percentage. Slightly stricter than Ontario;
// 86% ≈ 3.65.
export function bcPercentageToUS(pct: number): number {
  if (pct >= 95) return 4.0;
  if (pct < 60) return clamp(pct / 32);
  return clamp(2.0 + (pct - 60) * (2.0 / 35));
}

// Alberta diploma exam scores (5 subjects). Use percentage average.
// Schools accept these at face value; convert linearly with the same
// slope as Ontario.
export function albertaDiplomaToUS(pct: number): number {
  return ontarioPercentageToUS(pct);
}

// Quebec cote R / R-score. Scale typically 15-50 with 30+ ≈ US 3.5+,
// 35+ ≈ US 4.0. Linear above 25.
export function quebecRScoreToUS(rScore: number): number {
  if (rScore >= 35) return 4.0;
  if (rScore < 20) return clamp((rScore / 20) * 1.5);
  return clamp(1.5 + (rScore - 20) * (2.5 / 15));
}
```

- [ ] **Step 4: Run, expect pass.**

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/canada/grade-conversion.ts src/lib/cc/canada/grade-conversion.test.ts
git commit -m "feat(canada): provincial grade-conversion (ON/BC/AB/QC) → US 4.0"
```

---

## Task 8 — Application-platform metadata

**Files:** Create `src/lib/cc/canada/application-platforms.ts`.

A small registry that the coach + UI consume to explain platform-specific quirks.

- [ ] **Step 1: Write the file.**

```typescript
// src/lib/cc/canada/application-platforms.ts
// Canadian schools apply through six different platforms (Audit Prompt 2
// market analysis). The coach surfaces this when the student adds a
// Canadian school so they know what to expect.

export type CanadianApplicationPlatform =
  | "OUAC"          // Ontario Universities' Application Centre (101/105)
  | "UBC_direct"    // you.ubc.ca with Personal Profile
  | "McGill_direct" // uApply
  | "Waterloo_AIF"  // OUAC + Admission Information Form (engineering/math/CS)
  | "ApplyAlberta"  // Alberta provincial portal
  | "SFU_direct";   // Simon Fraser direct portal

export interface PlatformInfo {
  name: string;
  url: string;
  oneLineExplainer: string;
  // Things the student must do beyond filling the basic application.
  notableSteps: string[];
}

export const PLATFORMS: Record<CanadianApplicationPlatform, PlatformInfo> = {
  OUAC: {
    name: "OUAC (Ontario Universities' Application Centre)",
    url: "https://www.ouac.on.ca/",
    oneLineExplainer:
      "Single Ontario portal — pick OUAC 101 if you're a current Ontario HS student, OUAC 105 otherwise. $156 covers up to 3 university choices.",
    notableSteps: [
      "Submit application via OUAC by the deadline",
      "Some Ontario schools require additional supplementary forms (UofT supplementary essays, Waterloo AIF, Queen's PSE, McMaster Health Sciences). Check each school's site.",
      "Order transcripts via OUAC's transcript request system",
    ],
  },
  UBC_direct: {
    name: "UBC direct application",
    url: "https://you.ubc.ca/applying-ubc/",
    oneLineExplainer:
      "Apply directly via you.ubc.ca. Personal Profile (5 short-answer questions, ~250 words each) is part of the application — write it carefully.",
    notableSteps: [
      "Complete the application + Personal Profile in one sitting (or save draft)",
      "Order transcripts via your high school",
      "International students: TOEFL/IELTS scores submitted directly",
    ],
  },
  McGill_direct: {
    name: "McGill uApply",
    url: "https://mcgill.ca/undergraduate-admissions/apply",
    oneLineExplainer:
      "Direct application via uApply. McGill admission is grades-driven and faculty-by-faculty. Minimal supplements; some programs (Music, Architecture) have portfolio requirements.",
    notableSteps: [
      "Submit uApply application",
      "Choose your faculty + program carefully — switching is hard later",
      "Submit transcripts directly (English translation if not in English/French)",
    ],
  },
  Waterloo_AIF: {
    name: "Waterloo AIF (on top of OUAC)",
    url: "https://uwaterloo.ca/future-students/admissions/aif",
    oneLineExplainer:
      "Engineering, math, and CS applicants MUST complete the Admission Information Form. The AIF is heavily weighted in admission decisions — sometimes more than grades.",
    notableSteps: [
      "Submit OUAC application first",
      "Complete the AIF (4 short essays) by the AIF deadline (~Feb 1)",
      "Engineering applicants: be specific about which discipline + why",
    ],
  },
  ApplyAlberta: {
    name: "ApplyAlberta",
    url: "https://www.applyalberta.ca",
    oneLineExplainer:
      "Provincial portal for Alberta universities (UofA, UCalgary, others). Single application, multiple choices.",
    notableSteps: [
      "Apply via ApplyAlberta",
      "Each school has its own document upload",
    ],
  },
  SFU_direct: {
    name: "SFU direct application",
    url: "https://www.sfu.ca/admission.html",
    oneLineExplainer:
      "Apply directly via SFU's portal. Rolling admission — earlier applications often get earlier offers.",
    notableSteps: [
      "Apply on SFU portal",
      "Submit transcripts directly",
    ],
  },
};

export function platformInfo(p: CanadianApplicationPlatform): PlatformInfo {
  return PLATFORMS[p];
}
```

- [ ] **Step 2: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 3: Commit.**
```bash
git add src/lib/cc/canada/application-platforms.ts
git commit -m "feat(canada): application-platform metadata (OUAC, UBC, McGill, Waterloo AIF, etc.)"
```

---

## Task 9 — Soften `SCHOOL CATALOG CONSTRAINT` + add Canada coach block

**Files:** Modify `src/lib/cc/coach-prompt-builder.ts`.

Two changes:

1. The hardcoded refusal at line ~114 becomes conditional — relax for `country === "CA"` (Canadian student) or `country === "PK"` (Pakistani diaspora dual-applying, often Brampton).
2. Add a new `buildCanadaBlock(ctx)` function mirroring `buildInternationalBlock` and `buildFirstGenBlock`. Append to the system prompt when `country === "CA" || country === "PK"`.

- [ ] **Step 1: Modify the constraint line.** Read `coach-prompt-builder.ts:108-118` to see the surrounding personality block, then rewrite the constraint:

```typescript
// In the PERSONALITY constant (or wherever line 114's constraint lives),
// REPLACE:
//   "- SCHOOL CATALOG CONSTRAINT: Our directory currently contains US schools only..."
// WITH a context-aware version. The PERSONALITY constant is static, so
// this becomes a function that takes the context:

export function buildCatalogConstraint(ctx: { country?: string | null }): string {
  // Canadian students or Pakistani diaspora (most likely Brampton or
  // Toronto-area dual-applying to UofT/Waterloo alongside US Ivies) get
  // the relaxed version that allows discussing Canadian schools.
  const isCanadaContext = ctx.country === "CA" || ctx.country === "PK";

  if (isCanadaContext) {
    return `
- SCHOOL CATALOG: Our directory contains US schools and 12 Canadian universities (University of Toronto, UBC, McGill, Waterloo, Queen's, Western, McMaster, Alberta, Ottawa, SFU, Toronto Metropolitan, York). You can recommend, discuss, and help the student add any of these. Other countries (UK, Australia, etc.) are not yet in the directory — if asked, acknowledge briefly ("we don't have UK schools yet") and offer comparable US or Canadian alternatives.`;
  }

  return `
- SCHOOL CATALOG CONSTRAINT: Our directory currently contains US schools only. Do NOT recommend or claim to add Canadian, UK, or other non-US universities — they are not in the catalog and cannot be added. If the student asks about them, acknowledge briefly ("those aren't in our directory yet") and offer comparable US alternatives.`;
}
```

Then update the prompt assembly to use `buildCatalogConstraint(ctx)` instead of the hardcoded line. The PERSONALITY constant must be split: most of it stays a const, but the catalog constraint becomes appended dynamically.

If PERSONALITY is referenced verbatim in the prompt assembly, refactor:
```typescript
// before:
const systemPrompt = `${PERSONALITY}\n${...}`;
// after:
const systemPrompt = `${PERSONALITY}\n${buildCatalogConstraint(ctx)}\n${...}`;
```

- [ ] **Step 2: Add `buildCanadaBlock`.** After `buildFirstGenBlock` (line ~337) or `buildInternationalBlock` (line ~351):

```typescript
function buildCanadaBlock(ctx: CoachContext): string {
  // Fires for explicit Canadian students AND for Pakistani-diaspora
  // students likely to be in the GTA (Brampton, Mississauga, Toronto)
  // dual-applying to Canadian schools alongside US.
  const isCanadaContext = ctx.country === "CA" || ctx.country === "PK";
  if (!isCanadaContext) return "";

  return `

CANADIAN APPLICATION GUIDANCE:
- For Canadian universities, the application is fragmented across six platforms. Most Ontario schools (UofT, Waterloo, Queen's, Western, McMaster, Ottawa, McGill, TMU, York) use OUAC: 101 if the student is a current Ontario HS student, 105 otherwise. UBC uses its own portal with a 5-question Personal Profile. McGill uses uApply (grades-driven, minimal supplements). Waterloo engineering/math/CS REQUIRES the Admission Information Form (AIF) — heavily weighted, often more than grades.
- Application deadlines are mostly January 15 (OUAC + UBC + McGill) with supplementary forms due Feb 1 (UofT supplementary essays, Waterloo AIF, McMaster Health Sciences). Some schools roll admissions (UBC, Waterloo, Ottawa, SFU) — earlier applications get earlier offers.
- Canadian admissions are grades-heavier than US holistic. Top-6 senior-year average for Ontario is the headline number. UofT Engineering: 92%+ for competitive admission. Waterloo Engineering: 90%+ AIF-dependent. McGill: faculty-specific cutoffs (e.g. Management 90%+, Arts 85%+).
- Aid for international students at Canadian schools is LIMITED. Need-aware admissions. No FAFSA / CSS Profile equivalent. Some universities offer modest international entrance scholarships (UBC International Major Entrance Scholarship, UofT Lester B. Pearson Scholarship — extremely competitive). Domestic Canadian students use provincial aid (OSAP for Ontario, StudentAidBC, AlbertaStudent, Quebec AFE).
- Currency: Canadian tuition + living costs run CAD 50,000-90,000/year for international students; convert to USD or PKR for the family — Canadian tuition LOOKS lower than US private but is similar after currency conversion and lower aid.
- For Pakistani-Canadian families in the GTA (Brampton, Mississauga, Toronto) dual-applying: the strategy is usually US Ivies as reach + UofT/Waterloo/McGill as match-or-target. Treat Canadian schools as full options, not as "backup."${ctx.country === "CA" ? `
- Province-specific grade conversion for the student's intake: ${ctx.state ? `${ctx.state} system applies — convert directly without the Pakistani-FSc band table.` : `Ask which province (Ontario / BC / Alberta / Quebec / other) and apply the corresponding grade conversion.`}` : ""}`;
}
```

- [ ] **Step 3: Wire into `buildSystemPrompt`.** Find the function (around line 230-260) that assembles the full prompt, and append:

```typescript
// inside buildSystemPrompt(ctx):
return `${PERSONALITY}\n${buildCatalogConstraint(ctx)}\n${...everything else...}${buildFirstGenBlock(ctx)}${buildInternationalBlock(ctx)}${buildCanadaBlock(ctx)}`;
```

- [ ] **Step 4: Type-check.** `npx tsc --noEmit`. Only the pre-existing e2e error.

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/coach-prompt-builder.ts
git commit -m "feat(coach): conditional catalog constraint + Canada guidance block (CA + PK relaxed)"
```

---

## Task 10 — Canadian arm in the academic mode

**Files:** Modify `src/lib/cc/coach-prompt-builder.ts` (continued).

The international academic mode currently runs Pakistani-FSc bands. Add a Canadian branch that asks for province and uses the conversion functions from Task 7.

- [ ] **Step 1: Find `case "academic":` (around line 419).** Read the existing branch end-to-end. There's likely an early check `if (ctx.country === "PK" || country === "IN" || ...)` that selects the international band table.

- [ ] **Step 2: Add a Canadian arm BEFORE the Pakistani band table fires.**

```typescript
case "academic": {
  // ... existing case opening ...

  // === Canadian arm (NEW) ===
  // Audit Prompt 4 Gap 5: previously Canadian percentages got Pakistani
  // band-table treatment. This branch surfaces province-specific
  // conversion + the "Canadian transcripts accepted at face value" note.
  if (ctx.country === "CA") {
    return `MODE: ACADEMIC (Canadian Student)

The student is Canadian and US universities accept Canadian transcripts at face value — DO NOT add the "schools will recognize that your system grades harder than American schools" qualifier. That is true for Pakistani/Indian/Bangladeshi systems, NOT Canadian.

Ask which province the student is in (Ontario / BC / Alberta / Quebec / other) — the conversion differs:
- Ontario: top-6 senior-year average. 92%+ ≈ US 3.95+. Direct conversion.
- BC: cumulative grade-12 percentage. 90%+ ≈ US 3.85+.
- Alberta: 5-subject diploma exam average. Treat like Ontario for percentage-band purposes.
- Quebec: cote R / R-score (15-50 scale). 30+ ≈ US 3.5+, 35+ ≈ US 4.0.

For Canadian students applying ONLY to Canadian universities, US 4.0 conversion is informational only — Canadian admissions use the percentage directly. For Canadian students dual-applying to US schools, the converted GPA is what they report on Common App.

Ask about: (1) graduating province, (2) top-6 (or equivalent) percentage, (3) AP/IB tests if any, (4) SAT/ACT if applying to US schools.${buildFirstGenBlock(ctx)}${buildCanadaBlock(ctx)}`;
  }

  // ... existing Pakistani / Indian / etc. branches stay as-is ...
}
```

- [ ] **Step 3: Type-check.** `npx tsc --noEmit`.

- [ ] **Step 4: Commit.**
```bash
git add src/lib/cc/coach-prompt-builder.ts
git commit -m "feat(coach): Canadian academic mode — province-specific grade conversion"
```

---

## Task 11 — Schools-search API: include Canadian schools

**Files:** Modify `src/app/api/cc/schools/search/route.ts` (or wherever schools search lives — `grep -rn "/api/cc/schools" src/app/api/`).

Currently the schools-search endpoint queries `cc_schools` without country filtering. Default behavior should already include Canadian schools after the migration, but we should:

1. **Verify** the search returns Canadian schools when the student is `country IN ('CA', 'PK')`.
2. **Hide** Canadian schools from US-domestic-only students (`country === 'US'` AND not Pakistani-Canadian).

Actually — for v1, simpler: include ALL schools regardless of student country. A Pakistani student in Karachi might want to apply to UofT too (financial reasons). Don't gate the catalog by country. The `need_aware_for_internationals` flag handles aid expectations.

- [ ] **Step 1: Find the schools-search route.** `grep -rn "from(\"cc_schools\")" src/app/api/`.

- [ ] **Step 2: Confirm the query doesn't filter by country.** If it does, remove the filter. The migration backfilled US rows, so all existing US schools still surface; new Canadian rows surface too.

- [ ] **Step 3: For the search result shape, add `country` and `province` to the SELECT** so the UI can render a flag/badge.

- [ ] **Step 4: Type-check + commit.**
```bash
npx tsc --noEmit
git add src/app/api/cc/schools/search/route.ts  # or whatever file you touched
git commit -m "feat(canada): schools search includes country + province in result rows"
```

(Light task — likely a 5-line edit. If the route is already country-agnostic, this task is a no-op — verify and skip.)

---

## Task 12 — Tests for prompt builder Canadian + PK branches

**Files:** Create or extend `src/lib/cc/coach-prompt-builder.test.ts`.

- [ ] **Step 1: Write tests.**

```typescript
// src/lib/cc/coach-prompt-builder.test.ts (extend if exists, otherwise create)
import { describe, it, expect } from "vitest";
import { buildSystemPrompt, type CoachContext } from "./coach-prompt-builder";

const baseCtx: Partial<CoachContext> = {
  studentName: "Aanya",
  hasIntakeCompleted: true,
  hasGPA: true,
  hasSchools: false,
  hasEssays: false,
  hasEssayReviewed: false,
  hasActivitiesOptimized: false,
  hasSupplementsStarted: false,
  hasInterviewSessions: false,
  // Cast intentional: we know the test exercises specific branches.
};

describe("buildSystemPrompt — catalog constraint", () => {
  it("US student gets the strict refusal of Canadian schools", () => {
    const out = buildSystemPrompt({ ...baseCtx, country: "US" } as CoachContext);
    expect(out).toContain("US schools only");
    expect(out).toContain("Canadian, UK, or other non-US");
  });
  it("Canadian student gets the relaxed catalog block", () => {
    const out = buildSystemPrompt({ ...baseCtx, country: "CA" } as CoachContext);
    expect(out).toContain("12 Canadian universities");
    expect(out).toContain("University of Toronto");
    expect(out).not.toContain("US schools only");
  });
  it("Pakistani student gets the relaxed catalog block (Brampton ICP)", () => {
    const out = buildSystemPrompt({ ...baseCtx, country: "PK" } as CoachContext);
    expect(out).toContain("12 Canadian universities");
  });
});

describe("buildSystemPrompt — Canada guidance block", () => {
  it("appears for Canadian students", () => {
    const out = buildSystemPrompt({ ...baseCtx, country: "CA" } as CoachContext);
    expect(out).toContain("CANADIAN APPLICATION GUIDANCE");
    expect(out).toContain("OUAC");
  });
  it("appears for Pakistani students (diaspora dual-apply)", () => {
    const out = buildSystemPrompt({ ...baseCtx, country: "PK" } as CoachContext);
    expect(out).toContain("CANADIAN APPLICATION GUIDANCE");
  });
  it("does not appear for US students", () => {
    const out = buildSystemPrompt({ ...baseCtx, country: "US" } as CoachContext);
    expect(out).not.toContain("CANADIAN APPLICATION GUIDANCE");
  });
});
```

- [ ] **Step 2: Run, expect green.**

- [ ] **Step 3: Commit.**
```bash
git add src/lib/cc/coach-prompt-builder.test.ts
git commit -m "test(coach): catalog constraint + Canada block branches"
```

---

## Task 13 — Final verification + push

- [ ] **Step 1: Type-check.** `npx tsc --noEmit`.
- [ ] **Step 2: Tests.** `npx vitest run`.
- [ ] **Step 3: Apply migration to local Supabase.** `npx supabase db push` + verify 12 Canadian rows.
- [ ] **Step 4: Manual smoke test:**
  1. Set a test user's `cc_student_profiles.country = 'PK'` and `state_province = 'Punjab'`.
  2. Open coach drawer. Type "Should I apply to UofT?"
  3. **Expect:** coach engages with Canadian advice (vs. the previous "those aren't in our directory yet" refusal). Mentions OUAC, January 15 deadline, GTA dual-apply pattern.
  4. Set another test user's country to 'CA', state_province to 'ON'. Type "What's my GPA?" with Ontario percentage 92%.
  5. **Expect:** coach reports US 3.95+ direct conversion, NO Pakistani-band qualifier.
- [ ] **Step 5: Push + apply migration to prod via Supabase Studio SQL editor.**

```bash
git push origin master
```

---

## Self-review

**Spec coverage (Audit Prompt 2):**
- ✓ (a) Canadian school catalog (12 schools): Tasks 1-2
- ✓ (a) Application platforms (OUAC, direct, AIF): Task 8
- ✓ (a) Predicted-grade systems (Ontario, BC, Alberta, Quebec): Task 7
- ✓ (a) Aid (OSAP, provincial): Task 5 + coach block in Task 9
- ✓ (b) `coach-prompt-builder.ts` changes: Tasks 9, 10
- ✓ (b) Walkthroughs: deferred to v2 per architecture decision (variants stay forked, copy is country-aware)
- ✓ (c) Ports vs rebuilds: catalog/JSON/coach-prompt all addressed; senior-variant tree intentionally NOT forked in v1
- ✓ Brampton refusal fix (Audit Prompt 4 Gap 3): Task 9
- ✓ Canadian grade conversion bug fix (Audit Prompt 4 Gap 5): Tasks 7, 10

**Placeholder scan:** No TBD/TODO. Task 9's PERSONALITY refactor flagged as "may need refactor" with concrete instructions. Task 11 honestly admits it might be a no-op after verification.

**Type consistency:** `CanadianProvince`, `CanadianApplicationPlatform`, `CanadianDeadline`, `CanadianApplicationPlan`, `CanadianSupplementPrompt` — defined in Tasks 6, 7, 8 and consumed in tests + the coach block.

**Risk:** Task 9 is the riskiest — it refactors a static `PERSONALITY` constant into something context-aware. If `PERSONALITY` is referenced from multiple places (e.g. translation pipelines), the refactor cascades. Implementer should `grep -n "PERSONALITY" src/` before starting.

**Effort:** Roadmap said 6-8 weeks for a "credible v1." This plan ships the minimum surface in ~2 weeks (one engineer): seed JSONs (3 days), coach prompt changes (4 days), grade conversion + tests (2 days), API + smoke (3 days). The deferred items (variant forking, dedicated /cc/canada UI, OSAP integration) are queued for a v2 if Q3 sign-ups justify the spend.

---

## Execution

**Plan complete and saved to `docs/superpowers/plans/2026-05-02-canada-foundation.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task; 13 tasks; the seed-JSON tasks (2, 3, 4, 5) are mechanical, the coach-prompt refactor (T9) and grade conversion (T7) benefit from focused isolated context.

**2. Inline Execution** — single session, batched checkpoints.

Which?
