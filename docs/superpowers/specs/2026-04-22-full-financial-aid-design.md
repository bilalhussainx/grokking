# $0 / Full Financial Aid Affordability Option — Design

**Section:** INSTRUCTIONS.md §2
**Date:** 2026-04-22
**Priority:** P0
**Estimated time:** 1–2 days
**Status:** Approved — ready for implementation plan

## Motivation

A Pakistani student who genuinely cannot pay anything for college has no way to represent that in the current product: the minimum affordability is "<$10,000/year." That floor is Kollegio's, and it's unusable for full-aid seekers — most need-blind-for-international schools are exactly who these students should be applying to. This section adds a `$0 — I need full financial aid` option that threads through the whole product: profile, Coach Kairos behavior, school list generation, chancing, and UI warnings on need-aware schools.

## Scope

Introduce affordability as a first-class concept, separate from `household_income_bracket` (what the family earns) and `cc_school_preferences.financial_need` (loose preference). Surface it in the profile UI, extract it from Coach conversations, persist it, and let it drive school recommendations and Coach tone. Pull the `cc_schools.need_blind_international` column forward from Section 3 so this section's acceptance criteria are testable without a separate follow-up.

Out of scope: a dedicated CSS Profile walkthrough (Section 8), the need-blind international filter UI toggle (Section 3), school aid enrichment beyond the 8 seed schools (Section 5).

## Data model

### `cc_student_profiles` (extend)

```sql
ALTER TABLE cc_student_profiles
  ADD COLUMN IF NOT EXISTS affordability_value TEXT DEFAULT 'under_10k'
    CHECK (affordability_value IN ('zero','under_10k','10k_20k','20k_30k','30k_50k','50k_plus')),
  ADD COLUMN IF NOT EXISTS needs_full_aid BOOLEAN GENERATED ALWAYS AS
    (affordability_value = 'zero') STORED;
```

`needs_full_aid` is a generated column so it is always coherent with `affordability_value`. No backfill needed — the default covers existing rows.

### `cc_schools` (extend, pulled forward from Section 3)

```sql
ALTER TABLE cc_schools
  ADD COLUMN IF NOT EXISTS need_blind_international BOOLEAN DEFAULT FALSE;

UPDATE cc_schools SET need_blind_international = TRUE
  WHERE ipeds_id IN (166027, 166683, 130794, 186131, 182670, 164465, 168342, 160977);
-- Harvard, MIT, Yale, Princeton, Dartmouth, Amherst, Williams, Bowdoin
```

### `cc_school_preferences.financial_need` — hybrid retain

Keep the column in schema. Coach stops asking the old question; `financialNeedFromAffordability()` derives it automatically on write whenever `affordability_value` is set. Existing data remains valid. Future sections (Section 5) can lean on either column without churn.

Mapping:

| `affordability_value` | derived `financial_need` |
|---|---|
| `zero`, `under_10k` | `essential` |
| `10k_20k`, `20k_30k` | `important` |
| `30k_50k` | `nice-to-have` |
| `50k_plus` | `not-a-concern` |

## Constants module

`src/lib/cc/affordability.ts` — single source of truth.

```ts
export const AFFORDABILITY_OPTIONS = [
  { value: "zero",       label: "$0 — I need full financial aid",
    sublabel: "I cannot pay anything. I need schools that meet 100% of demonstrated need.",
    maxAnnual: 0 },
  { value: "under_10k",  label: "Under $10,000/year",
    sublabel: "My family can contribute a small amount annually",
    maxAnnual: 10000 },
  { value: "10k_20k",    label: "$10,000–$20,000/year", maxAnnual: 20000 },
  { value: "20k_30k",    label: "$20,000–$30,000/year", maxAnnual: 30000 },
  { value: "30k_50k",    label: "$30,000–$50,000/year", maxAnnual: 50000 },
  { value: "50k_plus",   label: "$50,000+/year",
    sublabel: "Cost is not my primary concern",
    maxAnnual: 999999 },
] as const;

export type AffordabilityValue = typeof AFFORDABILITY_OPTIONS[number]["value"];

export function financialNeedFromAffordability(v: AffordabilityValue):
  "essential" | "important" | "nice-to-have" | "not-a-concern" { … }

export const NEED_BLIND_INTERNATIONAL_IPEDS: ReadonlySet<number> = new Set([
  166027, 166683, 130794, 186131, 182670, 164465, 168342, 160977,
]);
```

`$0` is deliberately the first entry so the selector surfaces it prominently.

## UI

### FinancialForm — new section

At the top of `src/components/cc/profile/FinancialForm.tsx`, above `household_income_bracket`, add a pill-button selector for `affordability_value`. Label: *"How much can your family contribute per year?"* Helper text: *"This is separate from income — it's what you can realistically pay toward college."*

When `affordability_value === 'zero'` AND the student's `is_international === true`, render `<CSSProfileCallout />` inline below the selector.

Persistence: selector onChange calls `PATCH /api/cc/profile/identity` with `{ affordability_value }` (new allowed field). The API writes to `cc_student_profiles` and also upserts the derived `financial_need` into `cc_school_preferences` in the same request.

### CSSProfileCallout — new component

`src/components/cc/profile/CSSProfileCallout.tsx`. Gold-accented glassmorphism card matching the existing design tokens. Copy:

> **CSS Profile — you'll need this**
>
> As an international student who needs full aid, you'll submit the CSS Profile at most schools (not FAFSA). It's longer, asks for family income/assets/expenses in more detail, and costs \$25 per school.
>
> We'll walk you through it when you're ready. For now, start gathering: parents' tax returns or equivalent, 2 years of bank statements, and an estimate of monthly household expenses.

A link to `/profile/css-guide` is rendered as a stub button — the page body comes in Section 8. For Section 2 the stub is a placeholder page that says "Coming soon" so the link does not 404.

### SchoolCard — aid warning badge

`src/components/cc/SchoolCard.tsx` accepts a new optional `aidWarning?: "need-aware"` prop. When set, renders an amber pill *"⚠ Need-aware for international applicants"* next to the tier chip. The rest of the card is unchanged.

## Coach Kairos

### CoachContext

`src/lib/cc/coach-prompt-builder.ts` — extend the interface:

```ts
affordabilityValue: AffordabilityValue | null;
needsFullAid: boolean;
```

Populated in `src/app/api/cc/coach/message/route.ts` from the `cc_student_profiles` row.

### School-builder mode

When `ctx.needsFullAid` is true, append to the school-builder system prompt:

```
The student has selected "$0 — full financial aid required." This changes how you recommend schools:

- Prioritize need-blind-for-international schools: MIT, Harvard, Yale, Princeton,
  Dartmouth, Amherst, Williams, Bowdoin. Surface these proactively.
- If the student is international, mention CSS Profile as the primary aid
  application (not FAFSA). Explain: "Need-blind means the school does not consider
  ability to pay when making admission decisions."
- Flag need-aware schools explicitly: "⚠ This school is need-aware for international
  students — requesting aid may reduce admission chances."
- Frame every cost discussion as "after full demonstrated need aid."
- Skip the existing "how important is financial aid?" question — we already know.
```

### General / school-browse modes

If `ctx.needsFullAid && ctx.isInternational` and the student's `next step` suggestion is empty or weak, replace it with: *"Review the CSS Profile guide — most need-blind schools require it."*

### coach-extract.ts

Extend the school-preferences JSON schema with:

```json
"affordability_value": "zero"|"under_10k"|"10k_20k"|"20k_30k"|"30k_50k"|"50k_plus"|null
```

When set, write to **two** tables in one transaction:

1. `cc_student_profiles.affordability_value`
2. `cc_school_preferences.financial_need` via `financialNeedFromAffordability()`

Detects natural-language triggers: "I can't pay anything", "I need full aid", "my family has no money for college" → `zero`. Keep the existing `financial_need` / `income_bracket` extraction for backwards compatibility but prefer `affordability_value` when both appear.

## School list generation

`src/app/api/cc/school-list/generate/route.ts`:

1. Select `affordability_value, needs_full_aid, is_international` from the profile.
2. Select `need_blind_international` from `cc_schools` alongside existing fields.
3. When `needs_full_aid && is_international`: hard-filter candidates to `need_blind_international = true OR meets_full_need = true`. Tag each surviving candidate `aid_warning = need_blind_international ? null : "need-aware"`.
4. When `needs_full_aid && !is_international`: filter to `meets_full_need = true`.
5. Prepend the 8 need-blind schools to the candidate pool (deduped) when `needs_full_aid && is_international`, so they are always visible to the LLM.
6. Inject `Affordability: $0 (needs full aid)` and `Nationality: international/domestic` into the prompt's profile summary. Add a rule: *"At least 6 of the 10 recommendations must be need-blind-for-international or meet-full-need schools."*
7. Return `aid_warning` alongside each suggestion in the JSON response.

## Chancing route

`src/app/api/cc/chances/[school_id]/route.ts`:

- Snapshot gains `affordabilityValue`, `needsFullAid`.
- School context gains `needBlindInternational`.
- SYSTEM_PROMPT gains: *"If the student needs full aid and the school is need-aware for internationals, downgrade the band by one tier and note the aid-admission risk in weaknesses."*

## API surface

### `PATCH /api/cc/profile/identity` (existing route)

Add `affordability_value` to the `ALLOWED_FIELDS` list. When set and `financialNeedFromAffordability` yields a value, upsert `cc_school_preferences.financial_need` in the same handler.

### `GET /api/cc/profile` (existing route)

Include `affordability_value, needs_full_aid` in the selected columns.

## Tests

### `src/lib/cc/__tests__/affordability.test.ts` (new)

- `AFFORDABILITY_OPTIONS[0].value === "zero"` — first-option invariant
- `financialNeedFromAffordability()` returns the correct mapping for each of the 6 values
- `NEED_BLIND_INTERNATIONAL_IPEDS.size === 8` and contains Harvard/MIT/Yale/Princeton/Dartmouth/Amherst/Williams/Bowdoin

### `src/lib/cc/__tests__/coach-prompt-builder.test.ts` (extend)

- School-builder with `needsFullAid=true, isInternational=true` contains "CSS Profile", "need-blind", "MIT"
- School-builder with `needsFullAid=false` does NOT contain the new branch
- General mode with `needsFullAid=true && isInternational=true` and no other next-step mentions CSS Profile

### `src/lib/cc/__tests__/coach-extract.test.ts` (extend if exists, else create)

- Phrase "I can't afford anything for college" in transcript yields `affordability_value: "zero"`
- Extraction writes both `cc_student_profiles.affordability_value` AND derives `cc_school_preferences.financial_need = "essential"`

## Acceptance mapping

| Spec acceptance criterion | Mechanism |
|---|---|
| `$0` first option | `AFFORDABILITY_OPTIONS[0]` + FinancialForm ordering |
| `needs_full_aid=true` in DB | Generated column on `cc_student_profiles` |
| MIT/Harvard/Yale/Princeton/Dartmouth/Amherst/Williams/Bowdoin in first 10 | `need_blind_international` filter + prepend + prompt rule |
| Need-aware warning badge in school list | `aid_warning` field on suggestion + SchoolCard badge |
| Coach proactively mentions CSS Profile | School-builder prompt branch + general-mode next-step |
| Affordability visible on profile page | New pill selector at top of FinancialForm |

## Migration order

1. SQL migration (two tables).
2. Seed update for the 8 need-blind schools.
3. `affordability.ts` constants + unit tests.
4. API route update (profile identity PATCH + profile GET).
5. FinancialForm + CSSProfileCallout + `/profile/css-guide` stub.
6. Coach context + prompt-builder + extract.
7. School list generation + chancing route.
8. SchoolCard aid warning badge.
9. Integration smoke: seed a zero-affordability international student, generate a list, confirm 6+/10 results are need-blind-or-meets-full-need.

## Open questions

None blocking. Section 3 will layer a user-facing `need-blind international only` toggle on top of this column. Section 5 will enrich the 8 seeded schools with average aid packages and expand the need-blind list beyond the initial 8.
