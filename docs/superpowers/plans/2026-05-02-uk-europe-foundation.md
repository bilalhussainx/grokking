# UK/Europe Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make KairosLearn usable for Pakistani / first-gen / international students applying to top UK universities. Stop the coach from refusing to discuss Oxford/Cambridge/Imperial/LSE (the audit's hardcoded refusal pattern from Workstream C, now extended to UK), seed 12 UK universities into the catalog with real 2026-27 cycle UCAS deadlines, ship the UCAS 3-question personal statement format (changed from single-PS in the 2026 cycle), wire admissions test guidance (MAT, PAT, LNAT, TMUA, ESAT, TSA, HAT, UCAT) per course, and surface Pakistani-relevant scholarships (Saïd Foundation, Reach Oxford, Cambridge Trust, Commonwealth, Chevening notes).

**Architecture:** Mirrors the Canada Foundation pattern (Workstream C). Reuse the `country` column on `cc_schools`. New `region` column (England / Scotland / Wales / NI) for UK schools — Scotland is structurally different (4-year degrees, different funding). Single application platform `UCAS` for all UK universities (no per-school direct portals). UCAS personal statement is **UCAS-wide, not per-school** — one PS goes to up to 5 university choices. Admissions tests are keyed on `{school, course}` combos in a separate registry. Coach gets a new `buildUKBlock(ctx)` mirroring `buildCanadaBlock`. Catalog constraint extends from Workstream C to also relax for `country IN ('UK', 'PK', 'CA')` — Pakistani students apply to all three regions.

**Tech Stack:** Next.js 16, TypeScript 5, Supabase (Postgres), OpenRouter Sonnet 4.6 (coach), no new external services.

**Audit anchors:**
- Prompt 4 Gap 3 — coach refuses non-US schools generally (Workstream C addressed CA; this plan addresses UK)
- Prompt 5 §4 Year-2 defensive plays — multilingual depth + market expansion compounds against Kollegio
- Roadmap row M (NEW — added by this plan)

This is **Workstream M** in the strategic-audit roadmap (`docs/superpowers/plans/2026-05-02-strategic-audit-roadmap.md`). Update that index after this plan ships.

---

## Pre-verified state

**Existing schema (after Workstream C ships):**
- `cc_schools.country` exists (default `'US'`, backfilled).
- `cc_schools.province` exists for CA — semantics extend to UK regions (England/Scotland/Wales/NI).
- `cc_schools.application_platform` exists with values `OUAC | UBC_direct | McGill_direct | Waterloo_AIF | ApplyAlberta | SFU_direct`. We add `UCAS`.

**Coach prompt:**
- `buildCatalogConstraint(ctx)` (added by Workstream C) currently relaxes for `country IN ('CA', 'PK')`. We extend to `'UK'` and update the message to name UK schools.
- `buildCanadaBlock(ctx)` ships for Canada. We add `buildUKBlock(ctx)` alongside.

**Existing helpers we reuse:**
- `chatOnce` at `src/lib/cc/openrouter.ts`
- `requireAuth, createAdminSupabase` at `src/app/api/cc/helpers`
- `getCanadianSchools` pattern at `src/lib/cc/canada/schools.ts` — mirror for UK.

---

## Diagnosis

### UCAS 2026 cycle: 3-question PS (NOT 4000-char single)

The single 4000-character / 47-line personal statement was retired in the 2026 admissions cycle (Sep 2025 entry). It has been replaced with **three structured short-answer questions**, total combined max 4000 characters across all three (each must be ≥ 350 characters, recommended ~750-1500):

1. **Why do you want to study this course?** (Motivation, intellectual interest, career relevance.)
2. **How have your qualifications and studies prepared you for this course?** (Academic foundation, syllabus relevance, exam topics covered.)
3. **What else have you done to prepare outside of formal education?** (Reading, work experience, super-curriculars, EPQ, online courses, internships, competitions.)

The PS is **UCAS-wide**: one set of three answers goes to up to 5 university choices. So a student applying to Oxford for PPE + Cambridge for HSPS + LSE for Government + UCL for PPE + Warwick for PPE writes **one** set of three answers.

**Implication for KairosLearn:** UCAS PS is a SINGLE essay (3-part) per student per cycle, not per-school. Surface as one record in `cc_essays` with `essay_type = 'ucas_personal_statement'` and three child sub-essays for the three questions.

### Application deadlines 2026-27 cycle

| Deadline | Schools/courses |
|---|---|
| October 15, 2026 (18:00 UK time) | Oxford, Cambridge, all UK medicine, dentistry, veterinary medicine programs |
| January 14, 2027 (18:00 UK time) | Most other undergraduate courses (Imperial, LSE, UCL, Edinburgh, etc.) |
| March 26, 2027 | Some art/design programs |
| June 30, 2027 | Late applications still considered (but Clearing-bound for popular courses) |

**Oxbridge mutual exclusion:** Students may apply to Oxford OR Cambridge in any cycle, never both. The coach must ask which one and lock the choice.

### Application platform: UCAS exclusively

All 12 schools in v1 use UCAS. Apply via apply.ucas.com. Application fee: **£28.50** (2026 cycle, single or up to 5 choices). Pakistani students pay in PKR equivalent at the conversion rate at submission time.

### Admissions tests 2026-27 (verified)

| Test | Used by | Course |
|---|---|---|
| MAT (Mathematics Admissions Test) | Oxford | Maths, Maths & Stats, Maths & CS, CS, CS & Phil |
| MAT | Imperial | Maths |
| PAT (Physics Aptitude Test) | Oxford | Physics, Engineering, Materials Science |
| LNAT (Law National Aptitude Test) | Oxford, Cambridge, UCL, Bristol, Durham, Glasgow, KCL, SOAS | Law |
| TMUA (Test of Mathematics for University Admission) | Cambridge, LSE, Warwick, Durham | Maths, Economics, CS |
| ESAT (Engineering and Science Admissions Test) | Cambridge, Imperial | Engineering, Natural Sciences (Cambridge only), Chemistry, Veterinary Medicine |
| TSA (Thinking Skills Assessment) | Oxford | PPE, HSPS (E&M, Geography, History & Politics for Cambridge) |
| HAT (History Aptitude Test) | Oxford | History, History & Modern Languages |
| UCAT (University Clinical Aptitude Test) | UK medicine programs (most) | Medicine, Dentistry |
| MLAT (Modern Languages Admissions Test) | Oxford | Modern Languages |

**BMAT was discontinued in 2024** — current medicine applicants use UCAT.

Test administration: most run via Pearson VUE in autumn (October-November). Pakistani students can sit them at Pearson centers in Karachi, Lahore, Islamabad. Registration deadlines are EARLIER than the UCAS deadline (typically late September / early October).

### Oxbridge interviews + written work

- **Oxford interviews**: December (post-shortlist). Hybrid in-person + virtual since 2020. College-based — student is interviewed by the college they applied to (or one assigned during pooling).
- **Cambridge interviews**: December. College-based. International students often virtual.
- **Written work**: Oxford requires submitted written work (1-2 essays of recent schoolwork) for many humanities subjects (English, History, Modern Languages, Philosophy, Theology). Cambridge has a separate Cambridge Online Preliminary Application (COPA) and SAQ (Self-Assessment Questionnaire) submitted after UCAS.

### Aid + scholarships — Pakistani-specific

UK universities have no FAFSA/CSS analog. Aid is scholarship-based, almost entirely merit + need-blind-where-applicable. International students pay full tuition (£25K-£62K/yr depending on school + course). Critical Pakistani-relevant scholarships:

| Scholarship | Schools | Coverage | Notes |
|---|---|---|---|
| **Saïd Foundation Scholarships** | Oxford, Cambridge, Imperial, LSE, UCL | Full tuition + living | **THE** Pakistani undergraduate scholarship — almost no other platform surfaces this. Annual deadline February. |
| Reach Oxford Scholarship | Oxford | Full tuition + living + flights | For low-income students from developing countries. Pakistani students eligible. |
| Cambridge Trust International Scholarship | Cambridge | Partial to full | Need-based, merit considered. |
| Imperial College President's Undergraduate Scholarship | Imperial | £5,000/year | Merit-based. Pakistani students eligible. |
| LSE Undergraduate Support Scheme | LSE | Up to £18,000/year | Need-based. International students eligible. |
| UCL Centenary Scholarships | UCL | Partial | Various funded by UCL alumni. |
| Edinburgh International Undergraduate Scholarship | Edinburgh | £4,000/year | Merit-based. |
| Pakistan HEC Need-Based Scholarship | Several UK schools | Partial | Higher Education Commission of Pakistan; competitive. |
| Commonwealth Shared Scholarship | Various UK Russell Group | Full tuition + living | Master's/Ph.D. only — flag to students it's NOT undergraduate. |
| Chevening Scholarship | Various UK | Full | Master's only — same flag. |
| Rhodes Scholarship | Oxford | Full | Graduate-only (post-undergrad) — flag. |

The coach should mention Saïd Foundation by name when a Pakistani student adds Oxford / Cambridge / Imperial / LSE / UCL — same proactive surfacing pattern as QuestBridge for first-gen US.

### Variant forking — same v1 decision as Canada

Don't fork senior variants. Use country-aware copy in the existing `senior_writing/_post_submit/_decisions` blocks via the new `buildUKBlock(ctx)`. Fork to v2 if UK volume warrants.

### Tuition + costs (advisory; coach surfaces)

| School | International undergraduate tuition (2026-27, approx) |
|---|---|
| Oxford | £37,510 - £62,030 + college fee £9,690 |
| Cambridge | £28,266 - £68,322 + college fee £11,400 |
| Imperial | £37,400 - £52,200 (Medicine ~£50K) |
| LSE | £28,176 - £33,720 |
| UCL | £32,100 - £44,000 |
| KCL | £30,240 - £45,000 |
| Edinburgh | £26,500 - £37,500 |
| Manchester | £25,000 - £35,000 |
| Bristol | £25,800 - £37,300 |
| Warwick | £29,300 - £35,000 |
| Durham | £24,500 - £35,000 |
| St Andrews | £27,180 - £33,800 |

Plus living costs ~£12,000-£18,000/year (London higher).

---

## File map

```
supabase/migrations/
  20260505_uk_schools.sql                              ← NEW — extend cc_schools (region) + seed 12 UK rows

src/data/uk/
  uk-school-deadlines-2026.json                        ← NEW — 12 UK schools, UCAS deadlines
  uk-school-application-plans.json                     ← NEW — 12 schools, all "UCAS"
  uk-admissions-tests.json                             ← NEW — test → {schools, courses, registration_deadline}
  uk-scholarships.json                                 ← NEW — Saïd Foundation, Reach Oxford, etc.
  ucas-personal-statement-questions.json               ← NEW — the three structured PS questions

src/lib/cc/uk/
  schools.ts                                           ← NEW — getUKSchools / getUKDeadline / etc.
  schools.test.ts                                      ← NEW
  admissions-tests.ts                                  ← NEW — testsForCourse(school, course)
  admissions-tests.test.ts                             ← NEW
  scholarships.ts                                      ← NEW — relevantScholarships(profile)
  scholarships.test.ts                                 ← NEW

src/lib/cc/coach-prompt-builder.ts                     ← MODIFY — extend buildCatalogConstraint to UK,
                                                         add buildUKBlock(ctx), wire into buildSystemPrompt

src/lib/cc/__tests__/coach-prompt-builder.test.ts      ← MODIFY — add UK branch tests
```

---

## Task 1 — Migration: extend `cc_schools` + seed 12 UK rows

**Files:** Create `supabase/migrations/20260505_uk_schools.sql`.

- [ ] **Step 1: Write the migration.**

```sql
-- supabase/migrations/20260505_uk_schools.sql
-- Workstream M: extends cc_schools metadata for UK universities and
-- seeds 12 top UK institutions for the v1 UK module.

-- The Canada migration (20260504) already added country/province/
-- application_platform/osap_eligible. We add `region` (semantically
-- = "country within the UK" for E/S/W/NI; for non-UK rows it's NULL).

ALTER TABLE cc_schools
  ADD COLUMN IF NOT EXISTS region TEXT;

CREATE INDEX IF NOT EXISTS cc_schools_country_region_idx ON cc_schools(country, region);

-- ── 12 UK universities ────────────────────────────────────────────────
-- Sources for 2026-27 cycle:
--   - https://www.ucas.com/undergraduate/applying-university/key-dates
--   - Each school's published international tuition for 2026-27
--   - Acceptance rates from official admissions reports + Times Higher Ed
-- Idempotency: NOT EXISTS guard (cc_schools.name lacks UNIQUE constraint).

INSERT INTO cc_schools (name, country, province, region, application_platform, website, school_type, acceptance_rate, osap_eligible)
SELECT v.name, v.country, v.province, v.region, v.application_platform, v.website, v.school_type, v.acceptance_rate, v.osap_eligible
FROM (VALUES
  ('University of Oxford',                'UK', NULL, 'England',  'UCAS', 'https://www.ox.ac.uk',                 'public', 0.17, FALSE),
  ('University of Cambridge',             'UK', NULL, 'England',  'UCAS', 'https://www.cam.ac.uk',                'public', 0.21, FALSE),
  ('Imperial College London',             'UK', NULL, 'England',  'UCAS', 'https://www.imperial.ac.uk',           'public', 0.14, FALSE),
  ('London School of Economics and Political Science', 'UK', NULL, 'England', 'UCAS', 'https://www.lse.ac.uk',  'public', 0.09, FALSE),
  ('University College London',           'UK', NULL, 'England',  'UCAS', 'https://www.ucl.ac.uk',                'public', 0.32, FALSE),
  ('King''s College London',              'UK', NULL, 'England',  'UCAS', 'https://www.kcl.ac.uk',                'public', 0.13, FALSE),
  ('University of Edinburgh',             'UK', NULL, 'Scotland', 'UCAS', 'https://www.ed.ac.uk',                 'public', 0.40, FALSE),
  ('University of Manchester',            'UK', NULL, 'England',  'UCAS', 'https://www.manchester.ac.uk',         'public', 0.56, FALSE),
  ('University of Bristol',               'UK', NULL, 'England',  'UCAS', 'https://www.bristol.ac.uk',            'public', 0.68, FALSE),
  ('University of Warwick',               'UK', NULL, 'England',  'UCAS', 'https://warwick.ac.uk',                'public', 0.40, FALSE),
  ('Durham University',                   'UK', NULL, 'England',  'UCAS', 'https://www.durham.ac.uk',             'public', 0.40, FALSE),
  ('University of St Andrews',            'UK', NULL, 'Scotland', 'UCAS', 'https://www.st-andrews.ac.uk',         'public', 0.30, FALSE)
) AS v(name, country, province, region, application_platform, website, school_type, acceptance_rate, osap_eligible)
WHERE NOT EXISTS (
  SELECT 1 FROM cc_schools cs WHERE cs.name = v.name
);
```

- [ ] **Step 2: Apply locally + verify.**
```bash
npx supabase db push
psql -c "select count(*) from cc_schools where country = 'UK';"  # expect 12
psql -c "select region, count(*) from cc_schools where country = 'UK' group by region;"  # 10 England, 2 Scotland
```

- [ ] **Step 3: Commit.**
```bash
git add supabase/migrations/20260505_uk_schools.sql
git commit -m "feat(uk): cc_schools.region column + 12 UK universities seeded"
```

---

## Task 2 — Seed JSON: `uk-school-deadlines-2026.json`

**Files:** Create `src/data/uk/uk-school-deadlines-2026.json`.

UCAS deadlines are platform-wide (not per-school). The schema is simpler than Canada/US — single `deadline_application` per school, with `oxbridge_or_medical: true` flagging the early Oct 15 deadline.

- [ ] **Step 1: Write the file.**

```json
{
  "University of Oxford": {
    "deadline_application": "2026-10-15",
    "deadline_test_registration": "2026-09-30",
    "oxbridge_or_medical": true,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Oct 15 18:00 UK time. Oxford-specific: choose your COLLEGE during application; submit written work (where required) directly to college; sit admissions test at Pearson VUE; expect interview December. NOTE: cannot also apply to Cambridge in same cycle."
  },
  "University of Cambridge": {
    "deadline_application": "2026-10-15",
    "deadline_test_registration": "2026-09-30",
    "oxbridge_or_medical": true,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Oct 15 18:00 UK time. Cambridge-specific: complete the Cambridge Online Preliminary Application (COPA) + SAQ after UCAS; choose a college (or open application); admissions test (TMUA/ESAT/etc. depending on subject); interviews December. NOTE: cannot also apply to Oxford."
  },
  "Imperial College London": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": "2026-10-15",
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. Medicine and Engineering may require ESAT/MAT/UCAT — register separately. Some courses interview."
  },
  "London School of Economics and Political Science": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": "2026-10-15",
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. Economics + Maths-and-Economics require TMUA. Highly grades-driven; PS scrutinized."
  },
  "University College London": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": null,
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. Law applicants take LNAT. Medicine UCAT. Most other courses no test."
  },
  "King's College London": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": null,
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. Law applicants take LNAT. Medicine UCAT. Some courses interview (medicine, dentistry)."
  },
  "University of Edinburgh": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": null,
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. SCOTTISH 4-year degree (vs. 3-year English). Most courses no admissions test. Medicine UCAT."
  },
  "University of Manchester": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": null,
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. Medicine + dentistry UCAT. Most courses no test."
  },
  "University of Bristol": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": null,
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. Law LNAT. Medicine UCAT."
  },
  "University of Warwick": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": "2026-10-15",
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. Maths + MORSE require TMUA. Computer Science MAT for some routes."
  },
  "Durham University": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": null,
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. Law LNAT. Some courses TMUA. Collegiate (like Oxbridge) but college choice less load-bearing."
  },
  "University of St Andrews": {
    "deadline_application": "2027-01-14",
    "deadline_test_registration": null,
    "oxbridge_or_medical": false,
    "portal_url": "https://www.ucas.com",
    "portal_login_note": "Apply via UCAS by Jan 14 18:00 UK time. SCOTTISH 4-year degree. Most courses no admissions test. Some courses interview."
  }
}
```

- [ ] **Step 2: Commit.**
```bash
git add src/data/uk/uk-school-deadlines-2026.json
git commit -m "feat(uk): seed 12 UK universities with 2026-27 UCAS deadlines"
```

---

## Task 3 — Seed JSON: `uk-school-application-plans.json`

**Files:** Create `src/data/uk/uk-school-application-plans.json`.

All 12 schools use UCAS. Plans field is `["UCAS"]`. International students at all UK schools pay full tuition with limited need-based aid (`need_aware_for_internationals: true` for all).

- [ ] **Step 1: Write the file.**

```json
{
  "University of Oxford":              { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "University of Cambridge":           { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "Imperial College London":           { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "London School of Economics and Political Science": { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "University College London":         { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "King's College London":             { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "University of Edinburgh":           { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "University of Manchester":          { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "University of Bristol":             { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "University of Warwick":             { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "Durham University":                 { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true },
  "University of St Andrews":          { "plans": ["UCAS"], "is_public": true, "need_aware_for_internationals": true }
}
```

- [ ] **Step 2: Commit.**
```bash
git add src/data/uk/uk-school-application-plans.json
git commit -m "feat(uk): application plans for 12 UK universities (all UCAS)"
```

---

## Task 4 — Seed JSON: `uk-admissions-tests.json`

**Files:** Create `src/data/uk/uk-admissions-tests.json`.

A registry of admissions tests. Schema: each test has metadata + a list of `{ school, courses }` it applies to.

- [ ] **Step 1: Write the file.**

```json
{
  "MAT": {
    "name": "Mathematics Admissions Test",
    "url": "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/mathematics-admissions-test-mat",
    "registration_deadline": "2026-09-30",
    "test_date": "2026-10-15",
    "format": "2.5-hour paper-based test, 7 questions on AS-level + early A-level math",
    "applies_to": [
      { "school": "University of Oxford", "courses": ["Maths", "Mathematics & Statistics", "Maths & Computer Science", "Computer Science", "Computer Science & Philosophy"] },
      { "school": "Imperial College London", "courses": ["Mathematics"] }
    ]
  },
  "PAT": {
    "name": "Physics Aptitude Test",
    "url": "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/physics-aptitude-test-pat",
    "registration_deadline": "2026-09-30",
    "test_date": "2026-10-22",
    "format": "2-hour paper-based test, physics + math problem-solving at A-level",
    "applies_to": [
      { "school": "University of Oxford", "courses": ["Physics", "Engineering Science", "Materials Science"] }
    ]
  },
  "LNAT": {
    "name": "Law National Aptitude Test",
    "url": "https://lnat.ac.uk",
    "registration_deadline": "2026-10-15",
    "test_date": "rolling — Sep 2026 to Jan 2027",
    "format": "Computer-based, 2 sections — 42 multiple-choice questions (95min) + 1 essay (40min)",
    "applies_to": [
      { "school": "University of Oxford", "courses": ["Law", "Law with Law Studies in Europe"] },
      { "school": "University of Cambridge", "courses": ["Law"] },
      { "school": "University College London", "courses": ["Law"] },
      { "school": "King's College London", "courses": ["Law"] },
      { "school": "University of Bristol", "courses": ["Law"] },
      { "school": "Durham University", "courses": ["Law"] }
    ]
  },
  "TMUA": {
    "name": "Test of Mathematics for University Admission",
    "url": "https://www.admissionstesting.org/for-test-takers/test-of-mathematics-for-university-admission/about-tmua/",
    "registration_deadline": "2026-09-29",
    "test_date": "2026-10-15",
    "format": "Computer-based, 2.5 hours, 2 papers — multiple-choice math + reasoning",
    "applies_to": [
      { "school": "University of Cambridge", "courses": ["Mathematics", "Computer Science", "Economics"] },
      { "school": "London School of Economics and Political Science", "courses": ["Economics", "Economics & Mathematics", "Mathematics with Economics"] },
      { "school": "University of Warwick", "courses": ["Mathematics", "MORSE", "Mathematics & Economics", "Computer Science"] },
      { "school": "Durham University", "courses": ["Mathematics", "Economics"] }
    ]
  },
  "ESAT": {
    "name": "Engineering and Science Admissions Test",
    "url": "https://www.admissionstesting.org/for-test-takers/engineering-and-science-admissions-test-esat/",
    "registration_deadline": "2026-09-29",
    "test_date": "2026-10-15",
    "format": "Computer-based, 4 papers (1 hour each) — choose subset based on course",
    "applies_to": [
      { "school": "University of Cambridge", "courses": ["Engineering", "Natural Sciences", "Chemical Engineering", "Veterinary Medicine"] },
      { "school": "Imperial College London", "courses": ["Engineering (most disciplines)", "Chemistry"] }
    ]
  },
  "TSA": {
    "name": "Thinking Skills Assessment",
    "url": "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/thinking-skills-assessment-tsa-oxford",
    "registration_deadline": "2026-09-30",
    "test_date": "2026-10-29",
    "format": "2-hour test, multiple-choice critical thinking + writing task (Oxford only)",
    "applies_to": [
      { "school": "University of Oxford", "courses": ["PPE (Philosophy, Politics & Economics)", "Human Sciences", "Economics & Management", "History & Economics"] }
    ]
  },
  "HAT": {
    "name": "History Aptitude Test",
    "url": "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/history-aptitude-test-hat",
    "registration_deadline": "2026-09-30",
    "test_date": "2026-10-22",
    "format": "1-hour test, source-based historical analysis",
    "applies_to": [
      { "school": "University of Oxford", "courses": ["History", "History & Modern Languages", "History & Politics", "Ancient & Modern History"] }
    ]
  },
  "UCAT": {
    "name": "University Clinical Aptitude Test",
    "url": "https://www.ucat.ac.uk",
    "registration_deadline": "2026-09-19",
    "test_date": "rolling — Jul 2026 to Sep 2026",
    "format": "Computer-based, 2 hours, 5 cognitive sections — verbal reasoning, quantitative reasoning, abstract reasoning, decision making, situational judgement",
    "applies_to": [
      { "school": "University of Cambridge", "courses": ["Medicine"] },
      { "school": "Imperial College London", "courses": ["Medicine"] },
      { "school": "University College London", "courses": ["Medicine"] },
      { "school": "King's College London", "courses": ["Medicine", "Dentistry"] },
      { "school": "University of Edinburgh", "courses": ["Medicine"] },
      { "school": "University of Manchester", "courses": ["Medicine", "Dentistry"] },
      { "school": "University of Bristol", "courses": ["Medicine", "Dentistry"] }
    ]
  },
  "MLAT": {
    "name": "Modern Languages Admissions Test",
    "url": "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests/modern-languages-admissions-test-mlat",
    "registration_deadline": "2026-09-30",
    "test_date": "2026-10-22",
    "format": "Language-specific paper(s), 30-90 min depending on languages chosen",
    "applies_to": [
      { "school": "University of Oxford", "courses": ["Modern Languages", "Modern Languages & Linguistics", "European & Middle Eastern Languages"] }
    ]
  }
}
```

- [ ] **Step 2: Commit.**
```bash
git add src/data/uk/uk-admissions-tests.json
git commit -m "feat(uk): admissions test registry (MAT, PAT, LNAT, TMUA, ESAT, TSA, HAT, UCAT, MLAT)"
```

---

## Task 5 — Seed JSON: `uk-scholarships.json`

**Files:** Create `src/data/uk/uk-scholarships.json`.

Pakistani-relevant + general international scholarships for UK undergraduates. The Saïd Foundation Scholarship is the headline — almost no other platform surfaces it for Pakistani students.

- [ ] **Step 1: Write the file.**

```json
[
  {
    "name": "Saïd Foundation Scholarships",
    "url": "https://www.saidfoundation.org/scholarships",
    "schools": ["University of Oxford", "University of Cambridge", "Imperial College London", "London School of Economics and Political Science", "University College London", "King's College London"],
    "level": "undergraduate",
    "coverage": "Full tuition + living + flights",
    "eligibility": "Citizens of Egypt, Iraq, Jordan, Lebanon, Pakistan, Palestine, Syria. Strong academic record. Demonstrated leadership / community impact. Returning to home country after studies.",
    "deadline": "2027-02-01",
    "pakistani_relevant": true,
    "notes": "THE primary undergraduate scholarship for Pakistani students at top UK universities. Application separate from UCAS — apply directly to Saïd Foundation after receiving conditional offer."
  },
  {
    "name": "Reach Oxford Scholarship",
    "url": "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/reach-oxford-scholarship",
    "schools": ["University of Oxford"],
    "level": "undergraduate",
    "coverage": "Full tuition + college fee + living + return flight",
    "eligibility": "Students from low-income countries (incl. Pakistan) unable to study in their country. Outstanding academic record. Returning home after studies.",
    "deadline": "Applies via UCAS — selected from offer-holders",
    "pakistani_relevant": true,
    "notes": "No separate application — Oxford selects from offer-holders. ~5 awards per year globally. Highly competitive."
  },
  {
    "name": "Cambridge Trust International Scholarship",
    "url": "https://www.cambridgetrust.org",
    "schools": ["University of Cambridge"],
    "level": "undergraduate",
    "coverage": "Partial to full tuition (need-based)",
    "eligibility": "International students with offer from Cambridge. Need-based + merit considered.",
    "deadline": "After offer received, typically March-April",
    "pakistani_relevant": true,
    "notes": "Apply via the Cambridge Trust portal after offer."
  },
  {
    "name": "Imperial College President's Undergraduate Scholarship",
    "url": "https://www.imperial.ac.uk/study/fees-and-funding/undergraduate/scholarships/",
    "schools": ["Imperial College London"],
    "level": "undergraduate",
    "coverage": "£5,000/year",
    "eligibility": "Open to all incoming undergraduates including international students. Merit-based — top academic performance.",
    "deadline": "No application — automatic from UCAS data",
    "pakistani_relevant": true,
    "notes": "Automatic consideration based on UCAS application + grades."
  },
  {
    "name": "LSE Undergraduate Support Scheme",
    "url": "https://info.lse.ac.uk/Current-Students/Financial-Support/LSE-Undergraduate-Support-Scheme",
    "schools": ["London School of Economics and Political Science"],
    "level": "undergraduate",
    "coverage": "Up to £18,000/year",
    "eligibility": "Need-based. Open to UK + international students. Demonstrated financial hardship.",
    "deadline": "After offer received, May 2027",
    "pakistani_relevant": true,
    "notes": "Means-tested. International students must demonstrate parental income."
  },
  {
    "name": "UCL Undergraduate Bursary",
    "url": "https://www.ucl.ac.uk/scholarships/undergraduate-funding-overseas-students",
    "schools": ["University College London"],
    "level": "undergraduate",
    "coverage": "Various — partial tuition",
    "eligibility": "Various scholarships; some country-specific. Pakistani students eligible for several.",
    "deadline": "Varies by award, typically February-April after offer",
    "pakistani_relevant": true,
    "notes": "UCL has multiple country-specific awards funded by alumni. Browse the full UCL list after offer."
  },
  {
    "name": "Edinburgh International Undergraduate Scholarship",
    "url": "https://www.ed.ac.uk/student-funding/undergraduate/international",
    "schools": ["University of Edinburgh"],
    "level": "undergraduate",
    "coverage": "£4,000-£10,000/year",
    "eligibility": "International students with strong academic offers. Merit-based.",
    "deadline": "April after offer",
    "pakistani_relevant": true,
    "notes": "Automatic consideration; top-ranked applicants notified."
  },
  {
    "name": "Pakistan HEC Need-Based Scholarship",
    "url": "https://hec.gov.pk",
    "schools": ["University of Oxford", "University of Cambridge", "Imperial College London", "London School of Economics and Political Science", "University College London", "King's College London", "University of Edinburgh", "University of Manchester"],
    "level": "undergraduate",
    "coverage": "Partial tuition + stipend",
    "eligibility": "Pakistani citizens, low-income, top academic performance. Annual need-based selection.",
    "deadline": "Varies — typically December-February",
    "pakistani_relevant": true,
    "notes": "HEC Pakistan funds limited UK undergraduate scholarships. Highly competitive."
  },
  {
    "name": "Commonwealth Shared Scholarship",
    "url": "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships/",
    "schools": ["various UK Russell Group"],
    "level": "graduate",
    "coverage": "Full tuition + living",
    "eligibility": "Citizens of Commonwealth countries (incl. Pakistan). Master's-level only.",
    "deadline": "Varies by university — typically October-November",
    "pakistani_relevant": false,
    "notes": "FLAG TO STUDENT: This is master's only, not undergraduate. Mention only if asked about graduate funding."
  },
  {
    "name": "Chevening Scholarship",
    "url": "https://www.chevening.org",
    "schools": ["various UK"],
    "level": "graduate",
    "coverage": "Full tuition + living + flights",
    "eligibility": "Mid-career professionals. Master's level only.",
    "deadline": "November",
    "pakistani_relevant": false,
    "notes": "FLAG TO STUDENT: This is master's only, not undergraduate. Most undergraduate Pakistani students should NOT pursue Chevening at this stage."
  }
]
```

- [ ] **Step 2: Commit.**
```bash
git add src/data/uk/uk-scholarships.json
git commit -m "feat(uk): UK scholarships catalog with Pakistani-specific surfacing (Saïd Foundation, Reach Oxford)"
```

---

## Task 6 — UCAS personal statement questions (the 2026-cycle 3-question format)

**Files:** Create `src/data/uk/ucas-personal-statement-questions.json`.

- [ ] **Step 1: Write the file.**

```json
{
  "format_version": "2026_cycle",
  "format_change_note": "From the 2026 cycle (Sep 2025 entry onward), UCAS replaced the single 4000-character free-text personal statement with three structured short-answer questions. Total combined max 4000 characters; each question recommended 750-1500 characters.",
  "questions": [
    {
      "id": 1,
      "title": "Why do you want to study this course?",
      "guidance": "Speak to your motivation, intellectual interest, and how the subject connects to where you want to go. UK admissions read the PS for SUBJECT FIT — not the broad 'find your story' framing of US Common App essays. Reference specific aspects of the course that drew you in (modules, faculty research, methodologies). Avoid generic 'I have always loved X' openers.",
      "char_min": 350,
      "char_max_recommended": 1500,
      "required": true
    },
    {
      "id": 2,
      "title": "How have your qualifications and studies prepared you for this course?",
      "guidance": "This is the academic foundation question. Reference SPECIFIC topics from your A-Levels / IB / equivalent that connect to the course. For Pakistani students with FSc / HSC: name the relevant board (Federal, Sindh, Punjab) + specific subjects + standout topics. For Cambridge applicants: this is where the admissions tutor judges whether you're prepared for Tripos-pace teaching. Do NOT just list your subjects — show what specific topics you went deep on.",
      "char_min": 350,
      "char_max_recommended": 1500,
      "required": true
    },
    {
      "id": 3,
      "title": "What else have you done to prepare outside of formal education?",
      "guidance": "Super-curriculars, NOT extra-curriculars. UK admissions DO NOT care about your debate club presidency or your basketball captaincy unless it's directly relevant to the subject. They care about reading lists, EPQs, online courses (MIT OCW, Coursera), competitions (Olympiads, Challenge), summer schools, work experience in the field, podcasts you listened to, papers you read. Name specific books / papers / problems. 'I read Sapiens' is weaker than 'I read Yuval Harari's chapter on cognitive revolution and it pushed back against assumptions in my Anthropology IB syllabus, particularly...'",
      "char_min": 350,
      "char_max_recommended": 1500,
      "required": true
    }
  ],
  "total_combined_char_max": 4000,
  "shared_across_choices": true,
  "notes": "The PS is UCAS-wide — one set of three answers goes to up to 5 university choices. Tailor toward the most-selective school + course in your list. Oxbridge applicants should write FOR Oxbridge; the other 4 choices will read the same PS but are usually less selective."
}
```

- [ ] **Step 2: Commit.**
```bash
git add src/data/uk/ucas-personal-statement-questions.json
git commit -m "feat(uk): UCAS 2026-cycle 3-question personal statement format"
```

---

## Task 7 — UK schools loader + tests

**Files:** Create `src/lib/cc/uk/schools.ts` + `schools.test.ts`. Mirrors the Canadian pattern (`src/lib/cc/canada/schools.ts`).

- [ ] **Step 1: Write the test FIRST.**

```typescript
// src/lib/cc/uk/schools.test.ts
import { describe, it, expect } from "vitest";
import {
  getUKSchools,
  getUKDeadline,
  getUKApplicationPlan,
  UK_SCHOOL_NAMES,
  isOxbridgeOrMedical,
} from "./schools";

describe("getUKSchools", () => {
  it("returns 12 schools", () => {
    expect(getUKSchools().length).toBe(12);
  });
  it("includes Oxford, Cambridge, Imperial, LSE, UCL", () => {
    const names = getUKSchools().map((s) => s.name);
    expect(names).toContain("University of Oxford");
    expect(names).toContain("University of Cambridge");
    expect(names).toContain("Imperial College London");
    expect(names).toContain("London School of Economics and Political Science");
    expect(names).toContain("University College London");
  });
});

describe("getUKDeadline", () => {
  it("Oxford has Oct 15 deadline", () => {
    const d = getUKDeadline("University of Oxford");
    expect(d?.deadline_application).toBe("2026-10-15");
    expect(d?.oxbridge_or_medical).toBe(true);
  });
  it("Imperial has Jan 14 deadline", () => {
    const d = getUKDeadline("Imperial College London");
    expect(d?.deadline_application).toBe("2027-01-14");
    expect(d?.oxbridge_or_medical).toBe(false);
  });
  it("returns null for unknown school", () => {
    expect(getUKDeadline("Hogwarts")).toBeNull();
  });
});

describe("getUKApplicationPlan", () => {
  it("every UK school uses UCAS", () => {
    for (const school of UK_SCHOOL_NAMES) {
      const p = getUKApplicationPlan(school);
      expect(p?.plans).toContain("UCAS");
    }
  });
  it("every UK school is need-aware-for-internationals", () => {
    for (const school of UK_SCHOOL_NAMES) {
      const p = getUKApplicationPlan(school);
      expect(p?.need_aware_for_internationals).toBe(true);
    }
  });
});

describe("isOxbridgeOrMedical", () => {
  it("returns true for Oxford and Cambridge", () => {
    expect(isOxbridgeOrMedical("University of Oxford")).toBe(true);
    expect(isOxbridgeOrMedical("University of Cambridge")).toBe(true);
  });
  it("returns false for Imperial, LSE, UCL", () => {
    expect(isOxbridgeOrMedical("Imperial College London")).toBe(false);
    expect(isOxbridgeOrMedical("London School of Economics and Political Science")).toBe(false);
    expect(isOxbridgeOrMedical("University College London")).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement.**

```typescript
// src/lib/cc/uk/schools.ts
import deadlines from "@/data/uk/uk-school-deadlines-2026.json";
import plans from "@/data/uk/uk-school-application-plans.json";

export interface UKSchool {
  name: string;
}

export interface UKDeadline {
  deadline_application: string;
  deadline_test_registration: string | null;
  oxbridge_or_medical: boolean;
  portal_url: string;
  portal_login_note: string;
}

export interface UKApplicationPlan {
  plans: string[];
  is_public: boolean;
  need_aware_for_internationals: boolean;
}

export const UK_SCHOOL_NAMES = Object.keys(deadlines) as readonly string[];

export function getUKSchools(): UKSchool[] {
  return UK_SCHOOL_NAMES.map((name) => ({ name }));
}

export function getUKDeadline(name: string): UKDeadline | null {
  const map = deadlines as Record<string, UKDeadline>;
  return map[name] ?? null;
}

export function getUKApplicationPlan(name: string): UKApplicationPlan | null {
  const map = plans as Record<string, UKApplicationPlan>;
  return map[name] ?? null;
}

export function isOxbridgeOrMedical(name: string): boolean {
  const d = getUKDeadline(name);
  return d?.oxbridge_or_medical === true;
}
```

- [ ] **Step 4: Run tests, expect green.**

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/uk/schools.ts src/lib/cc/uk/schools.test.ts
git commit -m "feat(uk): typed loaders for UK schools/deadlines/plans"
```

---

## Task 8 — Admissions tests registry + tests

**Files:** Create `src/lib/cc/uk/admissions-tests.ts` + `admissions-tests.test.ts`.

- [ ] **Step 1: Test FIRST.**

```typescript
// src/lib/cc/uk/admissions-tests.test.ts
import { describe, it, expect } from "vitest";
import {
  getAdmissionsTest,
  testsForSchoolCourse,
  ALL_TEST_CODES,
} from "./admissions-tests";

describe("getAdmissionsTest", () => {
  it("returns MAT metadata", () => {
    const t = getAdmissionsTest("MAT");
    expect(t?.name).toBe("Mathematics Admissions Test");
    expect(t?.applies_to.length).toBeGreaterThan(0);
  });
  it("returns null for unknown code", () => {
    expect(getAdmissionsTest("FAKE")).toBeNull();
  });
});

describe("testsForSchoolCourse", () => {
  it("Oxford Maths requires MAT", () => {
    const tests = testsForSchoolCourse("University of Oxford", "Maths");
    expect(tests.map((t) => t.code)).toContain("MAT");
  });
  it("Oxford Law requires LNAT", () => {
    const tests = testsForSchoolCourse("University of Oxford", "Law");
    expect(tests.map((t) => t.code)).toContain("LNAT");
  });
  it("Cambridge Engineering requires ESAT", () => {
    const tests = testsForSchoolCourse("University of Cambridge", "Engineering");
    expect(tests.map((t) => t.code)).toContain("ESAT");
  });
  it("Cambridge Medicine requires UCAT", () => {
    const tests = testsForSchoolCourse("University of Cambridge", "Medicine");
    expect(tests.map((t) => t.code)).toContain("UCAT");
  });
  it("Edinburgh History requires no test", () => {
    expect(testsForSchoolCourse("University of Edinburgh", "History")).toEqual([]);
  });
});

describe("ALL_TEST_CODES", () => {
  it("includes the 9 known tests", () => {
    expect(ALL_TEST_CODES).toEqual(
      expect.arrayContaining(["MAT", "PAT", "LNAT", "TMUA", "ESAT", "TSA", "HAT", "UCAT", "MLAT"]),
    );
  });
});
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement.**

```typescript
// src/lib/cc/uk/admissions-tests.ts
import tests from "@/data/uk/uk-admissions-tests.json";

export interface AdmissionsTestApplication {
  school: string;
  courses: string[];
}

export interface AdmissionsTest {
  name: string;
  url: string;
  registration_deadline: string;
  test_date: string;
  format: string;
  applies_to: AdmissionsTestApplication[];
}

const REGISTRY = tests as Record<string, AdmissionsTest>;

export const ALL_TEST_CODES = Object.keys(REGISTRY);

export function getAdmissionsTest(code: string): AdmissionsTest | null {
  return REGISTRY[code] ?? null;
}

// Returns the list of admissions tests required for a given (school, course)
// pair. Empty array if no tests required. Match is substring-based on
// course name to handle "Maths" vs "Mathematics" vs "Maths & Statistics".
export function testsForSchoolCourse(
  school: string,
  course: string,
): Array<{ code: string; test: AdmissionsTest }> {
  const courseLower = course.toLowerCase();
  const matches: Array<{ code: string; test: AdmissionsTest }> = [];
  for (const [code, test] of Object.entries(REGISTRY)) {
    for (const app of test.applies_to) {
      if (app.school !== school) continue;
      const hit = app.courses.some(
        (c) =>
          c.toLowerCase().includes(courseLower) ||
          courseLower.includes(c.toLowerCase()),
      );
      if (hit) {
        matches.push({ code, test });
        break;
      }
    }
  }
  return matches;
}
```

- [ ] **Step 4: Run, expect pass.**

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/uk/admissions-tests.ts src/lib/cc/uk/admissions-tests.test.ts
git commit -m "feat(uk): admissions-tests registry + testsForSchoolCourse helper"
```

---

## Task 9 — Scholarships matcher + tests

**Files:** Create `src/lib/cc/uk/scholarships.ts` + `scholarships.test.ts`.

- [ ] **Step 1: Test FIRST.**

```typescript
// src/lib/cc/uk/scholarships.test.ts
import { describe, it, expect } from "vitest";
import { relevantScholarships, getScholarship, ALL_SCHOLARSHIP_NAMES } from "./scholarships";

describe("relevantScholarships", () => {
  it("Pakistani student applying to Oxford gets Saïd + Reach Oxford + HEC", () => {
    const scholarships = relevantScholarships({
      country: "PK",
      schoolsApplying: ["University of Oxford"],
      level: "undergraduate",
    });
    const names = scholarships.map((s) => s.name);
    expect(names).toContain("Saïd Foundation Scholarships");
    expect(names).toContain("Reach Oxford Scholarship");
    expect(names).toContain("Pakistan HEC Need-Based Scholarship");
  });

  it("non-Pakistani student does NOT get pakistani-only awards (Saïd, HEC)", () => {
    const scholarships = relevantScholarships({
      country: "IN",
      schoolsApplying: ["University of Oxford"],
      level: "undergraduate",
    });
    const names = scholarships.map((s) => s.name);
    expect(names).not.toContain("Saïd Foundation Scholarships");
    expect(names).not.toContain("Pakistan HEC Need-Based Scholarship");
  });

  it("undergraduate student does NOT get graduate-only awards (Chevening, Commonwealth Shared)", () => {
    const scholarships = relevantScholarships({
      country: "PK",
      schoolsApplying: ["University of Cambridge"],
      level: "undergraduate",
    });
    const names = scholarships.map((s) => s.name);
    expect(names).not.toContain("Chevening Scholarship");
    expect(names).not.toContain("Commonwealth Shared Scholarship");
  });

  it("filters by school — student applying only to LSE doesn't get Oxford-only awards", () => {
    const scholarships = relevantScholarships({
      country: "PK",
      schoolsApplying: ["London School of Economics and Political Science"],
      level: "undergraduate",
    });
    const names = scholarships.map((s) => s.name);
    expect(names).not.toContain("Reach Oxford Scholarship");
    expect(names).toContain("LSE Undergraduate Support Scheme");
  });
});

describe("ALL_SCHOLARSHIP_NAMES", () => {
  it("includes the headline awards", () => {
    expect(ALL_SCHOLARSHIP_NAMES).toContain("Saïd Foundation Scholarships");
    expect(ALL_SCHOLARSHIP_NAMES).toContain("Reach Oxford Scholarship");
  });
});
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement.**

```typescript
// src/lib/cc/uk/scholarships.ts
import data from "@/data/uk/uk-scholarships.json";

export type ScholarshipLevel = "undergraduate" | "graduate";

export interface UKScholarship {
  name: string;
  url: string;
  schools: string[];
  level: ScholarshipLevel | string; // "undergraduate" or "graduate"
  coverage: string;
  eligibility: string;
  deadline: string;
  pakistani_relevant: boolean;
  notes: string;
}

const ALL = data as UKScholarship[];

export const ALL_SCHOLARSHIP_NAMES = ALL.map((s) => s.name);

export function getScholarship(name: string): UKScholarship | null {
  return ALL.find((s) => s.name === name) ?? null;
}

export function relevantScholarships(input: {
  country: string;
  schoolsApplying: string[];
  level: ScholarshipLevel;
}): UKScholarship[] {
  const isPK = input.country === "PK";
  return ALL.filter((s) => {
    // Level gate
    if (s.level !== input.level) return false;

    // Pakistani-only awards filter for non-Pakistani students
    if (s.pakistani_relevant === false && s.notes.toLowerCase().includes("not undergraduate")) return false;
    const isPakistaniOnly = /Pakistan HEC|Saïd Foundation/.test(s.name);
    if (isPakistaniOnly && !isPK) return false;

    // School overlap — at least one of the student's schools matches
    const overlaps = s.schools.some(
      (sch) => sch === "various UK Russell Group" || sch === "various UK" || input.schoolsApplying.includes(sch),
    );
    if (!overlaps) return false;

    return true;
  });
}
```

- [ ] **Step 4: Run, expect pass.**

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/uk/scholarships.ts src/lib/cc/uk/scholarships.test.ts
git commit -m "feat(uk): scholarships matcher with Pakistani + level filtering"
```

---

## Task 10 — Coach: extend catalog constraint + add `buildUKBlock`

**Files:** Modify `src/lib/cc/coach-prompt-builder.ts`.

Two edits, mirroring Workstream C's pattern:

1. Extend `buildCatalogConstraint(ctx)` to relax for `country IN ('CA', 'PK', 'UK')` and name UK schools.
2. Add `buildUKBlock(ctx)` mirroring `buildCanadaBlock(ctx)`. Append to `buildSystemPrompt`.

- [ ] **Step 1: Edit `buildCatalogConstraint`.**

Find the function (added by Workstream C around line 116-130). Replace:

```typescript
function buildCatalogConstraint(ctx: { country?: string | null }): string {
  const isCanadaContext = ctx.country === "CA" || ctx.country === "PK";
  if (isCanadaContext) {
    return `

SCHOOL CATALOG: Our directory contains US schools and 12 Canadian universities (...).`;
  }
  return `...`;
}
```

With:

```typescript
function buildCatalogConstraint(ctx: { country?: string | null }): string {
  const isCanadaContext = ctx.country === "CA" || ctx.country === "PK";
  const isUKContext = ctx.country === "UK" || ctx.country === "PK";
  // Pakistani students apply to all three regions; relax for any of them.
  if (isCanadaContext || isUKContext) {
    return `

SCHOOL CATALOG: Our directory contains US schools, 12 Canadian universities (University of Toronto, UBC, McGill, Waterloo, Queen's, Western, McMaster, Alberta, Ottawa, SFU, Toronto Metropolitan, York), and 12 UK universities (Oxford, Cambridge, Imperial College London, LSE, UCL, King's College London, Edinburgh, Manchester, Bristol, Warwick, Durham, St Andrews). You can recommend, discuss, and help the student add any of these. Other countries (Australia, Germany, etc.) are not yet in the directory — if asked, acknowledge briefly and offer comparable alternatives from the supported regions.`;
  }
  return `

SCHOOL CATALOG CONSTRAINT: Our directory currently contains US schools only. Do NOT recommend or claim to add Canadian, UK, or other non-US universities — they are not in the catalog and cannot be added. If the student asks about them, acknowledge briefly ("those aren't in our directory yet") and offer comparable US alternatives.`;
}
```

- [ ] **Step 2: Add `buildUKBlock(ctx)` next to `buildCanadaBlock`.**

After `buildCanadaBlock` (look for `// Canadian-application guidance`), add:

```typescript
// UK-application guidance. Fires for explicit UK students AND for Pakistani
// diaspora students (Saïd Foundation Scholarships specifically target
// Pakistani students at top UK universities — almost no other platform
// surfaces this). Mirrors the Canada pattern.
function buildUKBlock(ctx: CoachContext): string {
  const isUKContext = ctx.country === "UK" || ctx.country === "PK";
  if (!isUKContext) return "";

  return `

UK APPLICATION GUIDANCE:
- All UK universities apply through UCAS (apply.ucas.com). Single platform, up to 5 university choices, £28.50 fee. Personal statement is UCAS-wide — one set of three answers goes to all 5 choices.
- Application deadlines: October 15, 2026 (18:00 UK time) for Oxford, Cambridge, and all UK medicine / dentistry / veterinary programs. January 14, 2027 for everything else.
- OXBRIDGE MUTUAL EXCLUSION: a student can apply to Oxford OR Cambridge in any cycle, never both. Confirm which one early — the choice is locked once UCAS is submitted.
- 2026 cycle PERSONAL STATEMENT: changed from the old single 4000-character free-text essay to THREE structured questions (350+ chars each, 4000 combined max): (1) Why this course? (2) How have your qualifications prepared you? (3) What else have you done outside formal education? UK admissions read for SUBJECT FIT — not the 'find your story' framing of US Common App. Reference specific course modules, A-Level / IB topics, books, papers, super-curriculars (NOT extracurriculars).
- ADMISSIONS TESTS: many top UK courses require subject-specific tests. Examples — Oxford Maths: MAT. Oxford PPE: TSA. Oxford Law: LNAT. Cambridge Maths/Econ/CS: TMUA. Cambridge Engineering / Natural Sciences: ESAT. UK Medicine: UCAT. Test registration deadlines are EARLIER than UCAS — typically late September / early October. Pakistani students sit Pearson VUE in Karachi, Lahore, Islamabad.
- OXBRIDGE INTERVIEWS: December for both Oxford and Cambridge. Hybrid in-person + virtual since 2020. College-based for both.
- CAMBRIDGE EXTRAS: After UCAS, Cambridge applicants complete the Cambridge Online Preliminary Application (COPA) and the Self-Assessment Questionnaire (SAQ). Oxford requires written work submitted to colleges for many humanities subjects (English, History, Modern Languages, Philosophy, Theology).
- AID for international students at UK universities is SCHOLARSHIP-BASED, mostly merit + limited need. NO FAFSA / CSS analog. International tuition runs £25K-£62K/year + ~£12K-£18K/year living costs (London higher).
- SCOTLAND DIFFERENT: Scottish universities (Edinburgh, St Andrews) are 4-year degrees vs. 3-year English. Funding rules + tuition different.${ctx.country === "PK" ? `
- PAKISTANI STUDENT — surface SAÏD FOUNDATION SCHOLARSHIPS proactively. Saïd funds Pakistani undergraduates at Oxford, Cambridge, Imperial, LSE, UCL, KCL — full tuition + living + flights. Almost no other platform surfaces this. Annual deadline February. ALSO surface Reach Oxford (low-income developing-country, undergraduate, full ride) when student adds Oxford. ALSO mention HEC Pakistan Need-Based Scholarship. DO NOT mention Chevening or Commonwealth Shared Scholarship — those are master's-only, not relevant for current undergraduate applicants.` : ""}`;
}
```

- [ ] **Step 3: Wire `buildUKBlock` into `buildSystemPrompt`.** Find:

```typescript
const canadaBlock = buildCanadaBlock(ctx);
if (canadaBlock) sections.push(canadaBlock);
```

Add after:

```typescript
const ukBlock = buildUKBlock(ctx);
if (ukBlock) sections.push(ukBlock);
```

- [ ] **Step 4: Type-check.** `npx tsc --noEmit`. Only the pre-existing e2e error.

- [ ] **Step 5: Commit.**
```bash
git add src/lib/cc/coach-prompt-builder.ts
git commit -m "feat(coach): UK guidance block + extended catalog constraint (UK + CA + PK relaxed)"
```

---

## Task 11 — Coach prompt-builder branch tests

**Files:** Modify `src/lib/cc/__tests__/coach-prompt-builder.test.ts`.

- [ ] **Step 1: Add UK test cases** to the existing test file. Add inside the `describe("buildSystemPrompt")` block (alongside the existing CA + PK tests added by Workstream C):

```typescript
  describe("UK catalog constraint + guidance (Workstream M)", () => {
    it("UK student gets the relaxed catalog block naming UK + CA schools", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "UK" });
      expect(prompt).toContain("12 UK universities");
      expect(prompt).toContain("Oxford");
      expect(prompt).toContain("12 Canadian universities");
      expect(prompt).not.toContain("US schools only");
    });
    it("Pakistani student gets a catalog block naming all three regions (US, CA, UK)", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "PK" });
      expect(prompt).toContain("12 UK universities");
      expect(prompt).toContain("12 Canadian universities");
    });
    it("UK guidance block appears for UK students", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "UK" });
      expect(prompt).toContain("UK APPLICATION GUIDANCE");
      expect(prompt).toContain("UCAS");
      expect(prompt).toContain("October 15");
    });
    it("UK guidance block appears for Pakistani students (Saïd Foundation surfacing)", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "PK" });
      expect(prompt).toContain("UK APPLICATION GUIDANCE");
      expect(prompt).toContain("SAÏD FOUNDATION");
    });
    it("UK guidance block does NOT appear for US students", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "US" });
      expect(prompt).not.toContain("UK APPLICATION GUIDANCE");
    });
    it("UK guidance block does NOT mention Saïd for Indian students", () => {
      const prompt = buildSystemPrompt({ ...baseContext, country: "IN" });
      expect(prompt).not.toContain("SAÏD FOUNDATION");
    });
  });
```

- [ ] **Step 2: Run.** `npx vitest run src/lib/cc/__tests__/coach-prompt-builder.test.ts`. Expect all pass.

- [ ] **Step 3: Commit.**
```bash
git add src/lib/cc/__tests__/coach-prompt-builder.test.ts
git commit -m "test(uk): catalog constraint + UK guidance block branches (UK strict / PK Saïd surfacing)"
```

---

## Task 12 — Update strategic audit roadmap to add Workstream M

**Files:** Modify `docs/superpowers/plans/2026-05-02-strategic-audit-roadmap.md`.

- [ ] **Step 1: Add Workstream M entry** to the roadmap's workstream list. After Workstream L:

```markdown
### Workstream M — UK/Europe Foundation

**Audit anchors:** Prompt 4 Gap 3 (extended); Prompt 5 §4 (Year-2 defensive plays).
**Status:** Plan written 2026-05-02 — `docs/superpowers/plans/2026-05-02-uk-europe-foundation.md`.
**Effort:** Medium (2-3 weeks one-engineer).
**Scope:** 12 UK universities (Oxford, Cambridge, Imperial, LSE, UCL, KCL, Edinburgh, Manchester, Bristol, Warwick, Durham, St Andrews) seeded into cc_schools with `country='UK'` + `region`. UCAS application platform. 2026-cycle 3-question personal statement format. Admissions tests registry (MAT, PAT, LNAT, TMUA, ESAT, TSA, HAT, UCAT, MLAT). Pakistani-specific scholarship surfacing (Saïd Foundation, Reach Oxford, HEC). Coach `buildUKBlock(ctx)` + extended catalog constraint.
**Out of scope:** German / French / Dutch universities (separate plan if demand emerges); Oxbridge college-choice tooling (UI deferred); UCAS submission integration (students copy-paste between KL and UCAS).
**Metric:** UK sign-ups; Saïd Foundation surfacing rate; coach catalog acceptance for UK schools (currently 0%); Pakistani-Brampton + Pakistani-domestic conversion uplift.
```

- [ ] **Step 2: Update the synthesis schedule section** to slot Workstream M alongside C (parallel international expansion). The new sprint table:

| Sprint | Workstream | Why this order |
|---|---|---|
| 5-6 | F — NPC Aggregator | Builds on B's aid schema; foundational for affordability filter |
| 6-7 | **M — UK/Europe Foundation (NEW)** | Pakistani diaspora dual-applies to UK alongside US + Canada; Saïd Foundation moat |
| 7-8 | E — FAFSA + CSS Profile depth | Pakistani-tuned content moat; first-gen US value |
| 9 | K — CI guard | Tiny but prevents future regressions; sequence whenever |
| 10-12 | J — Merit Matcher | Builds on Workstream D's scholarship surface |

- [ ] **Step 3: Commit.**
```bash
git add docs/superpowers/plans/2026-05-02-strategic-audit-roadmap.md
git commit -m "docs(roadmap): add Workstream M (UK/Europe Foundation) to strategic audit index"
```

---

## Task 13 — Final verification + push

- [ ] **Step 1: Type-check.** `npx tsc --noEmit`. Only the pre-existing e2e error.
- [ ] **Step 2: Tests.** `npx vitest run`. All green; +30+ new tests from Tasks 7, 8, 9, 11.
- [ ] **Step 3: Apply migration to local Supabase.** `npx supabase db push` + verify 12 UK rows.
- [ ] **Step 4: Manual smoke tests** (`npm run dev`):
  1. Set a test user's `cc_student_profiles.country = 'PK'`. Open coach drawer.
  2. Type "Should I apply to Oxford for PPE?" — expect coach engages with UCAS Oct 15 deadline, TSA admissions test, Saïd Foundation Scholarship mention, Oxbridge mutual exclusion warning.
  3. Type "Tell me about Cambridge Engineering" — expect coach mentions ESAT, COPA + SAQ, December interviews.
  4. Set country to 'UK', type "Help me draft my personal statement" — expect coach notes the 2026-cycle 3-question format, asks which course/school target.
  5. Set country to 'UK', type "Tell me about MIT" — expect coach engages (US schools also in catalog for UK students).
- [ ] **Step 5: Push + apply migration to prod.**

```bash
git push origin master
```

---

## Self-review

**Spec coverage:**
- Pakistani / international scholarship surfacing (Saïd Foundation specifically): Tasks 5, 9, 10
- UCAS 2026-cycle 3-question PS: Task 6
- Admissions tests (9 tests, course-aware): Tasks 4, 8
- Catalog constraint extension: Task 10 (extends Workstream C)
- Coach UK guidance block: Task 10
- Branch tests: Task 11
- Migration: Task 1
- Seed data parity with Canada (deadlines, plans): Tasks 2, 3
- Roadmap update: Task 12

**Placeholder scan:** No TBD/TODO. Each task has executable code or concrete edit instructions. Task 10's `buildCatalogConstraint` extension is incremental on Workstream C's function — read that function before editing.

**Type consistency:** `UKSchool`, `UKDeadline`, `UKApplicationPlan`, `AdmissionsTest`, `UKScholarship` — defined in Tasks 7, 8, 9 and consumed in tests. Same shape conventions as the Canada module.

**Risk:** Two flags:
1. **UCAS PS format change**: this plan codifies the 2026-cycle 3-question format. If UCAS reverts in a future cycle, the JSON in Task 6 needs updating + the coach block in Task 10 needs adjusting. Annotate the `format_version` field in the JSON as the source-of-truth signal.
2. **Saïd Foundation eligibility / deadlines**: verified at writing time. The deadline (February each year) and country list (Egypt, Iraq, Jordan, Lebanon, Pakistan, Palestine, Syria) should be reverified annually before the cycle. Task 5's JSON should be the single source of truth.

**Effort:** ~2-3 weeks one-engineer. Tasks 1-6 (schema + seeds) ~3 days. Tasks 7-9 (loaders + tests) ~3 days. Tasks 10-11 (coach + tests) ~2 days. Verification + push ~2 days.

---

## Execution

**Plan complete and saved to `docs/superpowers/plans/2026-05-02-uk-europe-foundation.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task; 13 tasks; the seed-JSON tasks (2, 3, 4, 5, 6) are mechanical, the coach prompt extension (T10) and tests (T11) benefit from focused isolated context.

**2. Inline Execution** — single session, batched checkpoints.

Which approach?
