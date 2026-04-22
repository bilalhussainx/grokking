# Section 1 Design — Pakistani Percentage GPA Conversion

**Date:** 2026-04-22
**Source:** `INSTRUCTIONS.md` §1
**Status:** Approved — ready for plan + implementation

## Goal
Let students from Pakistan / India / Bangladesh / Nigeria enter raw percentage grades (0–100) and see an accurate US 4.0 equivalent with an explainer that says how US colleges will read that grade.

## Decisions taken in brainstorming
- **B) New function alongside existing.** Keep `convertToUS4` (range output) for chancing math + extraction. Add `convertPercentageToGPA(pct)` for the precise single number + band metadata needed by the UI card.
- **Minimal schema change.** Add only `gpa_raw_value NUMERIC` and `gpa_raw_display TEXT` to `cc_academic_profiles`. Reuse `gpa_unweighted` as the canonical 4.0 value (its existing role). Do not repurpose `gpa_scale` — leave it as a loose display label.
- **No intake wizard exists.** `/intake` redirects to Coach Kairos. Real entry surfaces are `AcademicForm.tsx` (manual profile form, currently hardcoded 0–4) and conversational extraction via `coach-extract.ts`. Spec §1.2's `GPAStep.tsx` is reinterpreted as AcademicForm rework.
- **Theme.** Card uses gold/emerald accents on the existing dark glassmorphism theme (not spec's light blue/green).
- **Scope.** Percentage explainer card only. CGPA/A-Levels/IB cards deferred.

## Components

### Library (`src/lib/cc/gpa-converter.ts`)
- `PERCENTAGE_BANDS` — 6 bands (90/80/70/60/50/0) with `gpa`, `band`, `usCourseContext`, `howCollegesEvaluate`.
- `convertPercentageToGPA(pct: number): { gpaPrecise: number; band: string; usCourseContext: string; howCollegesEvaluate: string }`. Throws for < 0 or > 100.
- `formatRawGPADisplay(system, value, countryCode?): string` — e.g. "87% (Pakistani FSc)" or "87%".
- Existing `convertToUS4` untouched. Existing tests untouched.

### Migration (`supabase/migrations/20260422_gpa_raw_value.sql`)
```sql
ALTER TABLE cc_academic_profiles
  ADD COLUMN IF NOT EXISTS gpa_raw_value NUMERIC,
  ADD COLUMN IF NOT EXISTS gpa_raw_display TEXT;
```
Inherits `cc_academic_profiles_owner` RLS policy.

### UI — `src/components/cc/profile/AcademicForm.tsx`
- New "Grading system" selector (5 options: US 4.0, Percentage, CGPA/10, A-Levels, IB).
- Auto-defaults from country code if available (`detectGradingSystem`).
- When system ≠ US 4.0: swap GPA input to system-appropriate `min/max`, hide weighted + gpa_scale.
- On change: compute conversion, write `gpa_unweighted` + `gpa_raw_value` + `gpa_raw_display`.

### New component — `src/components/cc/profile/GPAConversionCard.tsx`
Client component. Props `{ pct: number | null }`. Renders:
```
Your 87% is approximately 3.48 on a 4.0 scale

Band: Excellent
US equivalent: A- in US high school

How US colleges evaluate this:
<prose>

📌 Tip: Attach your official marksheet (transcript) to your application.
```
Percentage-only in this section. Hidden when pct is null or system is US 4.0.

### Coach Kairos prompt updates
- **Extraction (`coach-extract.ts`):** extend extraction JSON schema with `original_score_display`. Persist `gpa_raw_value` + `gpa_raw_display` alongside existing `gpa_unweighted` write.
- **Conversational intake prompt** (in `coach-agents.ts` or similar, to be located): inject INSTRUCTIONS.md §1.4 guidance verbatim.

### Tests (`src/lib/cc/__tests__/gpa-converter.test.ts`)
Add cases for `convertPercentageToGPA`:
- 87 → 3.48 / Excellent
- 95 → 3.80 / Outstanding
- 55 → 2.20 / Satisfactory
- 100 → 4.00 / Outstanding
- 89 → Excellent (band upper boundary)
- 90 → Outstanding (band lower boundary)
- throws on -1, 101

### Profile read-view surface
Minimal: when `gpa_raw_display` is set, show it as "87% (converted to 3.48)" on the profile read screen. Full polish in Section 7.

## Acceptance criteria mapping
| §1 criterion | Mechanism |
|---|---|
| Select percentage in intake | AcademicForm system selector |
| 87 → 3.48 + explainer card | `convertPercentageToGPA` + GPAConversionCard |
| Stored in `gpa_converted_4_0` | Reused as `gpa_unweighted` |
| Profile shows raw alongside converted | `gpa_raw_display` render |
| Kairos answers 87% correctly | Prompt injection |
| Chancing uses converted value | Already true (reads `gpa_unweighted`) |

## Out of scope
- CGPA/A-Levels/IB explainer cards (future section)
- Extraction prompt refactor beyond adding `original_score_display`
- Landing page surfacing of the converter (Section 7)
