# Feature 6.2 — Student Profile Builder

## Summary
A hybrid wizard/dashboard at `/profile` where students build their college application profile across 5 sections (Identity, Academic, Activities, Honors, Financial). First visit shows a guided wizard; subsequent visits show a tabbed dashboard. Profile completion % is displayed but never gates other features — only soft nudges.

## Architecture

### Hybrid Wizard + Dashboard

1. After intake link (`/api/cc/intake/link`) completes, redirect to `/profile?wizard=1`
2. Wizard walks through 5 sections in order: Identity → Academic → Activities → Honors → Financial
3. Each section is a form with "Save & Next" and "Skip for now" buttons
4. After the last section (or skipping all), wizard ends and shows the tabbed dashboard
5. `localStorage.setItem("profile_wizard_done", "true")` prevents re-showing the wizard
6. Return visits go straight to the tabbed dashboard

### Tabbed Dashboard

- `/profile` page with 5 horizontal tabs
- Completion ring at top showing overall percentage
- Each tab highlights empty fields with a subtle gold border
- Inline nudges on empty fields: e.g., "Adding your GPA helps Coach Kairos recommend better-fit schools"
- Auto-save on field blur (debounced 500ms PATCH to the relevant API route)

## Sections

### Tab 1: Identity (20% weight)
**Table:** `cc_student_profiles`

| Field | Type | Required for completion |
|-------|------|----------------------|
| legal_first_name | text | Yes |
| preferred_name | text (pre-filled from intake) | No |
| grade_level | select (9-13) (pre-filled from intake) | Yes |
| graduation_year | number (auto-calculated from grade) | Yes |
| high_school_name | text | Yes |
| high_school_ceeb_code | text (optional, with lookup helper) | No |
| state_province | text (pre-filled from intake) | Yes |
| country | select (pre-filled from intake) | No |
| home_language | select (pre-filled from intake) | No |
| is_first_gen | boolean (pre-filled from intake) | No |
| is_international | boolean | No |
| citizenship_status | select (US Citizen, Permanent Resident, International, DACA, Undocumented) | No |
| race_ethnicity | multi-select JSONB | No |
| gender | select | No |

**Completion formula:** 5 required fields filled → section complete (contributes 20%)

### Tab 2: Academic (25% weight)
**Table:** `cc_academic_profiles`

| Field | Type | Required for completion |
|-------|------|----------------------|
| gpa_unweighted | number (0.00-4.00) | Yes |
| gpa_weighted | number (0.00-5.00) | No |
| gpa_scale | select ("4.0", "5.0", "100-point") | No |
| class_rank | number | No |
| class_size | number | No |
| courses | JSONB (free-text list for now) | No |
| ap_ib_courses | JSONB (free-text list for now) | No |
| test_strategy | select ("SAT", "ACT", "Both", "Test-optional", "Undecided") | No |
| sat_total | number (400-1600) | One of SAT or ACT |
| sat_math | number (200-800) | No |
| sat_erw | number (200-800) | No |
| act_composite | number (1-36) | One of SAT or ACT |
| act_subscores | JSONB | No |
| toefl_score | number | No |
| ielts_score | number (0.0-9.0) | No |
| duolingo_english_score | number | No |

**Completion formula:** GPA filled + at least one test score (or "Test-optional" selected) → section complete (contributes 25%)

### Tab 3: Activities (25% weight)
**Table:** `cc_activities` — 10 Common App slots

| Field | Type | Limit |
|-------|------|-------|
| position | number (1-10) | auto |
| activity_type | select (from Common App categories) | required |
| organization | text | 100 chars |
| role | text | 50 chars |
| description_150 | text | 150 chars |
| grades_participated | multi-select (9,10,11,12) | required |
| hours_per_week | number | required |
| weeks_per_year | number | required |
| is_continuing | boolean | default true |

**Common App activity types:** Academic, Art, Athletics, Career, Community Service, Computer/Technology, Cultural, Dance, Debate/Speech, Environmental, Family Responsibilities, Foreign Exchange, Journalism/Publication, Junior ROTC, LGBTQ+, Music, Religious, Research, Robotics, School Spirit, Science/Math, Social Justice, Student Government, Theater/Drama, Volunteer, Work (paid), Other

**UI:** Card-based list showing slots 1-10. Each card expands to edit. Character count shown live for description. "X/10 activities" counter.

**Completion formula:** At least 1 activity with all required fields → section complete (contributes 25%)

### Tab 4: Honors (10% weight)
**Table:** `cc_honors` — 5 Common App slots

| Field | Type | Limit |
|-------|------|-------|
| position | number (1-5) | auto |
| title | text | 100 chars |
| level | select (School, State/Regional, National, International) | required |
| grade | select (9,10,11,12) | required |
| description_100 | text | 100 chars |

**UI:** Same card-based list as activities. "X/5 honors" counter.

**Completion formula:** At least 1 honor → section complete (contributes 10%). This section is optional — 0 honors is valid.

### Tab 5: Financial (20% weight)
**Table:** `cc_financial_profiles`

| Field | Type | Required for completion |
|-------|------|----------------------|
| household_income_bracket | select ($0-30k, $30-48k, $48-75k, $75-110k, $110k+) | Yes |
| household_size | number | Yes |
| dependents_in_college | number (default 1) | No |
| parents_marital_status | select | No |
| pell_eligible_estimate | boolean (auto-calculated from income) | No |
| sai_estimate | number | No |
| free_reduced_lunch | boolean | No |
| willing_to_take_loans | boolean | No |
| max_loans_comfortable | number | No |
| fafsa_submitted | boolean | No |
| css_profile_submitted | boolean | No |

**Completion formula:** income bracket + household size filled → section complete (contributes 20%)

## Overall Completion Calculation

```typescript
function calculateCompletion(profile, academic, activities, honors, financial): number {
  const identityRequired = ['legal_first_name', 'grade_level', 'graduation_year', 'high_school_name', 'state_province'];
  const identityFilled = identityRequired.filter(f => profile[f]).length;
  const identityPct = (identityFilled / identityRequired.length) * 20;

  const hasGPA = !!academic?.gpa_unweighted;
  const hasTest = !!academic?.sat_total || !!academic?.act_composite || academic?.test_strategy === 'Test-optional';
  const academicPct = ((hasGPA ? 1 : 0) + (hasTest ? 1 : 0)) / 2 * 25;

  const activityPct = activities.length >= 1 ? 25 : 0;

  const honorsPct = honors.length >= 1 ? 10 : 0;

  const financialRequired = ['household_income_bracket', 'household_size'];
  const financialFilled = financialRequired.filter(f => financial?.[f]).length;
  const financialPct = (financialFilled / financialRequired.length) * 20;

  return Math.round(identityPct + academicPct + activityPct + honorsPct + financialPct);
}
```

Intake-seeded profiles start at ~15% (preferred_name, grade_level, state_province from intake → 3/5 identity fields × 20% = 12%, rounded up to 15% to account for language + first_gen metadata).

## API Routes

All routes require authentication via `requireAuth()`.

### GET /api/cc/profile
Returns the full profile joined across all 5 tables plus computed completion %.

**Response:**
```json
{
  "profile": { "id": "...", "preferred_name": "...", ... },
  "academic": { "gpa_unweighted": 3.8, ... } | null,
  "activities": [ { "position": 1, ... }, ... ],
  "honors": [ { "position": 1, ... }, ... ],
  "financial": { "household_income_bracket": "$30-48k", ... } | null,
  "completion_pct": 45
}
```

### PATCH /api/cc/profile/identity
Updates `cc_student_profiles` fields. Recalculates and updates `profile_completion_pct`.

**Body:** Partial `cc_student_profiles` fields (any subset).

### PATCH /api/cc/profile/academic
Upserts `cc_academic_profiles` row (creates if not exists). Recalculates completion %.

**Body:** Partial `cc_academic_profiles` fields.

### PATCH /api/cc/profile/activities
Upserts a single activity by position. Creates new row or updates existing.

**Body:** `{ position: number, ...activity fields }`

### DELETE /api/cc/profile/activities
Deletes an activity by ID.

**Body:** `{ id: string }`

### PATCH /api/cc/profile/honors
Upserts a single honor by position.

**Body:** `{ position: number, ...honor fields }`

### DELETE /api/cc/profile/honors
Deletes an honor by ID.

**Body:** `{ id: string }`

### PATCH /api/cc/profile/financial
Upserts `cc_financial_profiles` row. Recalculates completion %.

**Body:** Partial `cc_financial_profiles` fields.

## Components

| Component | Responsibility |
|-----------|---------------|
| `src/app/profile/page.tsx` | Main page — renders wizard or tabs based on `wizard` query param + localStorage |
| `src/app/profile/layout.tsx` | Minimal layout with page title |
| `src/components/cc/profile/ProfileWizard.tsx` | Wizard wrapper — step navigation, skip/next/back buttons |
| `src/components/cc/profile/IdentityForm.tsx` | Identity section form with auto-save |
| `src/components/cc/profile/AcademicForm.tsx` | Academic section form with test score conditional fields |
| `src/components/cc/profile/ActivitiesForm.tsx` | Card-based activity list (10 slots) with character counters |
| `src/components/cc/profile/HonorsForm.tsx` | Card-based honor list (5 slots) with character counters |
| `src/components/cc/profile/FinancialForm.tsx` | Financial section form with income bracket selector |
| `src/components/cc/profile/CompletionRing.tsx` | SVG ring showing completion % |
| `src/lib/cc/profile-completion.ts` | Pure function to calculate completion % from profile data |

## Nudges

Inline messages shown on empty required fields:
- GPA: "Adding your GPA helps Coach Kairos recommend better-fit schools"
- Test scores: "Even if you're going test-optional, entering scores helps estimate merit aid"
- Activities: "Colleges want to see what you do outside class — add your first activity"
- Financial: "This helps Coach Kairos estimate your net price at each school"

## Error Handling

- If profile doesn't exist yet (new user who skipped intake), `GET /api/cc/profile` creates a blank `cc_student_profiles` row with `user_id` set
- Auto-save failures show a small toast "Save failed — retrying..." with exponential backoff (1s, 2s, 4s)
- Character limit enforcement is client-side only (DB has no constraints on text length)

## Acceptance Criteria

- [ ] First visit after intake shows guided wizard through 5 sections
- [ ] Each wizard step can be saved or skipped
- [ ] After wizard, `/profile` shows tabbed dashboard
- [ ] Return visits go straight to tabs (no re-wizard)
- [ ] Completion ring updates in real-time as fields are filled
- [ ] Activities: 10 slots, 150-char description, character counter
- [ ] Honors: 5 slots, 100-char description, character counter
- [ ] Auto-save on blur with debounce
- [ ] Nudge messages on empty required fields
- [ ] All API routes require auth and recalculate completion %
