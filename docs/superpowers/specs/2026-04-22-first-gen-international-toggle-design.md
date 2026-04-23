# First-Gen Flag and International Student Toggle — Design Spec

**Date:** 2026-04-22
**Section:** 4 of INSTRUCTIONS.md
**Status:** Approved — tight-delta scope

## Goal

Ship the user-facing surfaces and differentiated counselor behavior for first-gen + international students on top of the 60% of Section 4 already shipped in `supabase/migrations/20260417_coach_kairos_schema.sql` and the existing intake/identity flow.

## Current state (do not duplicate)

- `cc_student_profiles.is_first_gen` BOOLEAN
- `cc_student_profiles.is_international` BOOLEAN DEFAULT false
- `cc_student_profiles.citizenship_status` TEXT
- Voice intake Q3 (`src/lib/cc/intake-questions.ts:42-50`) asks first-gen via yes/no/not-sure
- `src/components/cc/profile/IdentityForm.tsx` exposes both checkboxes + country/state + citizenship
- `src/lib/cc/coach-prompt-builder.ts` reads both flags into `CoachContext`
- `src/app/api/cc/coach/message/route.ts` hydrates profile flags → prompt context
- `chances/[school_id]/route.ts` already includes `firstGen` / `international` in LLM snapshot
- `school-list/generate/route.ts` filters need-blind when intl + full-aid

## Scope — what Section 4 adds on top

### 4.1 Database migration — `supabase/migrations/20260425_first_gen_international.sql`

Add four columns to `cc_student_profiles`:

```sql
ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS parents_education TEXT,
    -- 'no_college' | 'some_college' | 'associates' | 'bachelors' | 'graduate'
  ADD COLUMN IF NOT EXISTS home_country TEXT,
    -- Human-readable country name (e.g., "Pakistan")
  ADD COLUMN IF NOT EXISTS home_country_code TEXT,
    -- ISO 3166-1 alpha-2 (e.g., "PK")
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Backfill home_country_code from existing country column where possible
UPDATE cc_student_profiles
SET home_country_code = country
WHERE home_country_code IS NULL AND country IS NOT NULL;
```

`citizenship_status` already exists. `country` stays as source-of-truth for the intake location step; `home_country_code` is the canonical ISO-2 field moving forward. The UPDATE backfills for existing users.

**Decision:** For first-time users going through intake, the new intake question will set BOTH `country` (legacy) AND `home_country_code` (new). Fine — they stay in sync.

### 4.2 Intake wizard — new "Your Background" step

**File to modify:** `src/lib/cc/intake-questions.ts` + `src/app/api/cc/intake/complete/route.ts`

Insert a new block between Q3 (first-gen) and Q4 (worries). Currently:

```
Q0: name/grade
Q1: location (state + country)
Q2: home_language
Q3: first_gen         ← existing
Q4: worries
Q5: schools_interest
```

Becomes:

```
Q0: name/grade
Q1: location (state + country)
Q2: home_language
Q3: first_gen
Q4: parents_education (conditional: ask if first_gen in {yes, not_sure})
Q5: international_status (only if country !== US/CA — skip for domestic)
Q6: citizenship_status (only if international_status === yes)
Q7: worries
Q8: schools_interest
```

Q5 + Q6 are only asked when the country captured in Q1 isn't US/Canada. For US/Canada students, `is_international` stays `false` and the flow skips straight to worries.

### 4.3 Encouraging callout when `is_first_gen` selected

**File to modify:** `src/components/cc/profile/IdentityForm.tsx` (OR the intake wizard UI surface — whichever renders the yes/no toggle)

Inline below the "Yes / No / Not sure" selector, conditionally render:

```tsx
{(form.is_first_gen === true || form.is_first_gen === null) && (
  <div className="p-3 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#D4AF37]/90 leading-relaxed">
    ✨ First-gen applicants bring valuable perspectives to college campuses.
    Many top schools specifically seek first-gen students — and we'll help
    you tell that story in your application.
  </div>
)}
```

### 4.4 Coach first-gen prompt block

**File to modify:** `src/lib/cc/coach-prompt-builder.ts`

In the `case "school-builder"` block (around line 272) and the `case "general"` / default block, add a new conditional `firstGenBlock` similar to the existing `fullAidBlock`:

```ts
const firstGenBlock = ctx.isFirstGen
  ? `

FIRST-GEN GUIDANCE (CRITICAL): This student is the first in their family to attend college. Adjust your guidance accordingly:
- Proactively surface QuestBridge National College Match, Posse Foundation, and College Advising Corps — these are dedicated first-gen support programs.
- Recommend schools known for strong first-gen support: UMich, UNC-Chapel Hill, UT Austin, Vassar, Amherst, Williams. Mention these by name when relevant.
- Frame essay brainstorming around identity, family, and community — not just extracurriculars and achievements.
- Explain processes the student may not know: demonstrated interest, ED vs EA strategy, FAFSA priority deadlines, the CommonApp workflow itself.
- NEVER assume the student has college-educated parents to review applications or fill out financial aid forms.
- Always offer to explain any college term the student might not know.`
  : "";
```

Append `${firstGenBlock}` to the school-builder, academic, and essay mode prompts.

Also extend the existing international branch to add the Pakistani-specific guidance that Section 4.3 of INSTRUCTIONS.md calls for:

```ts
const internationalBlock = ctx.isInternational
  ? `

INTERNATIONAL STUDENT GUIDANCE:
- Use the need-blind-for-international filter proactively in school recommendations.
- Mention CSS Profile vs FAFSA distinctions when financial aid comes up.
- Explain demonstrated interest differently — international students often can't visit campus.
- Flag English proficiency requirements (TOEFL/IELTS) if the student hasn't mentioned test scores.
- Acknowledge timezone when discussing deadlines.
${ctx.country === "PK" ? `- Pakistani students specifically: confirm the GPA conversion from percentage to 4.0 scale. Mention WES evaluation if the student asks about transcript verification. Note that many schools convert Pakistani grades using their own tables, and official marksheets should always be submitted.` : ""}`
  : "";
```

(Much of this is already implicit in the `fullAidBlock` + `caseInternational && !ctx.gpaUnweighted` branches — the goal here is to make it unconditional for international students, not just full-aid ones.)

### 4.5 Dashboard resource cards

**Files to create:**
- `src/components/cc/resources/FirstGenResourcesCard.tsx`
- `src/components/cc/resources/InternationalGuideCard.tsx`

**File to modify:** `src/app/cc/page.tsx`

Each card is a self-contained tile shown conditionally based on profile flags. FirstGen card surfaces QuestBridge / Posse / College Advising Corps / "Your First-Gen Advantage" explainer. International card surfaces CSS Profile guide link (Section 8 placeholder OK — the guide ships in §8), need-blind schools shortcut (`/schools?filter=need-blind-intl`), TOEFL/IELTS guidance, brief visa process link.

Placement: below the existing dashboard content blocks but above the footer. The cards use the platform's rounded-2xl + border-white/10 aesthetic.

### 4.6 Tests

**Files to create / modify:**
- `src/lib/cc/__tests__/coach-prompt-builder.test.ts` — 4 new tests:
  1. `firstGenBlock` is included when `isFirstGen === true`
  2. `firstGenBlock` is excluded when `isFirstGen === false`
  3. QuestBridge + Posse + 6 school names appear in the first-gen prompt
  4. Pakistani-specific guidance appears only when `isInternational && country === "PK"`

## Out of scope (deferred)

- CSS Profile Guide full content — ships in Section 8
- Urdu language support — ships in Section 6
- Paid plan upsell for first-gen students — not in INSTRUCTIONS.md
- Storing parents_education granularity in LLM prompts — the flag `is_first_gen` is what drives behavior; granular field is for future scholarship-matching

## Acceptance criteria (from INSTRUCTIONS.md §4 + this spec)

- [ ] Migration adds 4 columns, backfills `home_country_code` from `country`
- [ ] Intake wizard asks international status only for non-US/CA students
- [ ] Intake wizard asks citizenship status only for internationals
- [ ] Intake wizard asks parents_education granularity when first-gen is yes/not-sure
- [ ] Encouraging callout appears in IdentityForm when first-gen is true or null
- [ ] Coach prompt includes first-gen block when `isFirstGen === true`, mentioning QuestBridge + Posse + 6 schools
- [ ] Coach prompt includes international block when `isInternational === true`
- [ ] Pakistani-specific guidance appears when `isInternational && country === "PK"`
- [ ] Dashboard shows FirstGenResourcesCard when `is_first_gen === true`
- [ ] Dashboard shows InternationalGuideCard when `is_international === true`
- [ ] 4 new vitest tests pass
- [ ] `tsc --noEmit` clean (ignoring pre-existing e2e errors)

## Self-review

- No placeholders: every section has concrete code or exact file paths.
- Internal consistency: the migration backfills `country → home_country_code`, and the intake flow writes both — no split-brain.
- Scope: ~1.5 days of tasks, matches INSTRUCTIONS.md §4's estimate.
- Ambiguity check: `home_country` vs `country` resolved explicitly (country is intake legacy, home_country_code is canonical ISO-2 going forward; new intake sets both).
