# Need-Blind International Filter — Design Spec

**Section:** 3 of 8 (per `INSTRUCTIONS.md`)
**Date:** 2026-04-22
**Prerequisite:** Section 2 shipped (commit `8c7f290`) — `cc_schools.need_blind_international` column + 8 need-blind schools seeded by IPEDS ID, `cc_student_profiles.affordability_value` / `needs_full_aid` columns, amber `aid_warning` badge on `SchoolCard`, `fullAidBlock` in `coach-prompt-builder` school-builder mode.

---

## Goal

Give international applicants — especially $0-affordability Pakistani/South Asian students — a first-class filter for US schools that are (a) need-blind for internationals or (b) need-aware but meet full demonstrated need. Make the policy visible on every school detail page. Wire Coach Kairos to answer the canonical question "which schools are need-blind for international students?" accurately.

## Non-goals

- Populating `pct_international_students_receiving_aid` and `avg_aid_package_international` with real data (Section 5 owns that).
- Building the CSS Profile guide or the `/profile/css-guide` route (Section 8 owns that).
- Changing the structure of the Deepgram/Sarvam voice pipeline.
- URL-param persistence of filter state (local React state is sufficient for this iteration).

## Architecture

Additive database-first feature. Seven new columns on `cc_schools`, no schema changes elsewhere. All UI is additive — existing flows keep working when `needs_full_aid=false` or filters are inactive. Zero new services, zero new LLM calls. The existing `/api/cc/schools/[id]` endpoint already returns `*`, so the detail page picks up new columns automatically.

## Database

### Migration `supabase/migrations/20260424_international_aid.sql`

```sql
-- Section 3: International aid transparency + need-blind/full-need filter
ALTER TABLE cc_schools
  ADD COLUMN IF NOT EXISTS meets_full_need_international BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pct_international_students_receiving_aid NUMERIC,
  ADD COLUMN IF NOT EXISTS avg_aid_package_international NUMERIC,
  ADD COLUMN IF NOT EXISTS css_profile_required BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS fafsa_required_international BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS international_aid_notes TEXT,
  ADD COLUMN IF NOT EXISTS aid_policy_verified_date DATE;

-- Upgrade the 8 need-blind schools seeded in Section 2 to also flag meets-full-need
UPDATE cc_schools SET
  meets_full_need_international = TRUE,
  international_aid_notes = 'Need-blind for international students. Meets 100% of demonstrated financial need for all admitted students regardless of citizenship.',
  aid_policy_verified_date = '2026-04-22'
WHERE ipeds_id IN (
  166027, -- Harvard
  166683, -- MIT
  130794, -- Yale
  186131, -- Princeton
  182670, -- Dartmouth
  164465, -- Amherst
  168342, -- Williams
  160977  -- Bowdoin
);

-- Seed 8 need-aware-but-meets-full-need schools
UPDATE cc_schools SET
  meets_full_need_international = TRUE,
  need_blind_international = FALSE,
  international_aid_notes = 'Meets full demonstrated need but is need-aware for international students — your financial aid request may reduce admission chances at this school.',
  aid_policy_verified_date = '2026-04-22'
WHERE ipeds_id IN (
  190150, -- Columbia University
  215062, -- University of Pennsylvania
  198419, -- Duke University
  221999, -- Vanderbilt University
  227757, -- Rice University
  121257, -- Pomona College
  168218, -- Wellesley College
  230038  -- Middlebury College
);
```

**Idempotency:** `ADD COLUMN IF NOT EXISTS` + `UPDATE` keyed on stable `ipeds_id` values. Re-running the migration is safe.

**Policy verification:** `aid_policy_verified_date = '2026-04-22'` establishes the date baseline per the INSTRUCTIONS.md warning that policies change yearly. Future re-verification passes can bump this column.

## API changes

### `src/app/api/cc/schools/search/route.ts`

Extend POST body type:

```ts
{
  query?: string;
  state?: string;
  type?: string;
  test_policy?: string;
  need_blind_international?: boolean;
  meets_full_need_international?: boolean;
  css_profile_required?: boolean;
  limit?: number;
}
```

Each new boolean, when truthy, becomes `q.eq(col, true)`. Select list extended to include `need_blind_international`, `meets_full_need_international`, `css_profile_required`, `avg_aid_package_international`, `pct_international_students_receiving_aid` so the browse UI can render badges inline on result cards if we want in a later pass (Section 3 renders them on the detail page only).

### `src/app/api/cc/schools/[id]/route.ts`

No change (already `select("*")`).

### `src/app/api/cc/chances/[school_id]/route.ts`

Extend `schoolContext` payload handed to the LLM:

```ts
const schoolContext = {
  // ... existing fields
  needBlindInternational: !!school.need_blind_international,
  meetsFullNeedInternational: !!school.meets_full_need_international,
  pctInternationalReceivingAid: school.pct_international_students_receiving_aid ?? null,
};
```

System prompt rule (adjusted from Section 2):
> If `needsFullAid=true` and the school's `needBlindInternational=false`, downgrade the band by one tier and flag aid-admission risk in weaknesses. If `meetsFullNeedInternational=true` but `needBlindInternational=false`, note that the student would still get full aid if admitted — the risk is admission, not affordability.

## UI

### Browse tab — `src/app/schools/page.tsx`

New collapsible panel rendered below the existing State/Type filter row (inside the `tab === "browse"` branch):

```tsx
<details className="mb-6 rounded-xl border border-white/10 bg-white/[0.03]" open={autoExpand}>
  <summary className="cursor-pointer px-4 py-3 text-xs uppercase tracking-wider text-white/60 flex items-center gap-2">
    <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
    Financial aid for international students
  </summary>
  <div className="px-4 pb-4 space-y-3">
    <div className="flex flex-wrap gap-2">
      <FilterPill active={needBlindIntl} onToggle={...} icon="🔓" label="Need-blind intl" />
      <FilterPill active={meetsFullNeedIntl} onToggle={...} icon="💯" label="Meets full need intl" />
      <FilterPill active={cssProfile} onToggle={...} icon="📋" label="Accepts CSS Profile" />
    </div>
    {needBlindIntl && (
      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-300">
        🔓 Showing schools that are need-blind for international students. These schools will not penalize you for needing financial aid. There are currently {schools.length} in our database.
      </div>
    )}
  </div>
</details>
```

**Auto-expand:** If we have access to `is_international && needs_full_aid` flags (via a lightweight fetch to `/api/cc/coach/context` or a new `/api/cc/profile/flags` endpoint if needed), the panel renders with `open={true}` by default for those students. If the flag fetch fails or is slow, default `open={false}`. Decision deferred to implementation: if a suitable endpoint already exists in the codebase, use it; otherwise add a minimal one that returns only `{ isInternational, needsFullAid }`.

**State:** `useState<boolean>` for each of the three filters. Filters join existing `query / stateFilter / typeFilter` in the `search()` effect dependency array and are sent to the search API on each change. No URL sync in this iteration.

### Detail page — `src/app/schools/[id]/page.tsx`

**Extend `SchoolDetail` interface** with the 7 new fields.

**Header badge row** between the location/type row and the tab switcher, compact one-line chips:

```tsx
{(school.need_blind_international || school.meets_full_need_international || school.css_profile_required) && (
  <div className="flex flex-wrap gap-2 mb-6">
    {school.need_blind_international && (
      <span title="Need-blind for international students" className="px-2.5 py-1 rounded-md text-[11px] bg-green-500/15 border border-green-500/30 text-green-300 font-medium">
        🔓 Need-blind intl
      </span>
    )}
    {school.meets_full_need_international && !school.need_blind_international && (
      <span title="Meets 100% of demonstrated need but is need-aware" className="px-2.5 py-1 rounded-md text-[11px] bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 font-medium">
        ⚠ Need-aware · full need
      </span>
    )}
    {school.css_profile_required && (
      <span title="CSS Profile is required for international aid" className="px-2.5 py-1 rounded-md text-[11px] bg-white/5 border border-white/10 text-white/60 font-medium">
        📋 CSS Profile
      </span>
    )}
  </div>
)}
```

**Aid & Loans tab — new "Financial aid for international students" section** at the top (before the existing avg_net_price / cost_of_attendance grid):

1. Green callout box when `need_blind_international=true` — prominent, with `pct_international_students_receiving_aid` rendered inline if present.
2. Yellow callout box when `meets_full_need_international=true && !need_blind_international`.
3. Stat cards (only render if value is non-null):
   - `% of intl students receiving aid` → `pct_international_students_receiving_aid`
   - `avg intl aid package` → `avg_aid_package_international`
   - `net cost for intl` → `cost_of_attendance − avg_aid_package_international` (only if both present)
4. Requirement chips: `CSS Profile` when `css_profile_required=true`, `FAFSA` when `fafsa_required_international=true`.
5. `international_aid_notes` rendered as a small note block if present.
6. Footer: `Policy verified: {aid_policy_verified_date}` when present.

**CSS Profile button:** The "What is CSS Profile? →" button spec'd in Section 5 is deliberately out of scope here. In Section 3 the CSS Profile chip is a plain label (non-interactive). Section 8 will replace it with a link to `/profile/css-guide`.

## Coach Kairos

### `src/lib/cc/coach-prompt-builder.ts`

Extend the school-builder `fullAidBlock` (or add a parallel `internationalAidBlock` that runs when `ctx.isInternational=true`, regardless of `needsFullAid`) with the canonical lists and a direct-answer pattern:

```
When the student asks "which schools are need-blind for international students?"
(or asks for the list of schools where citizenship does not affect admission odds),
list: MIT, Harvard, Yale, Princeton, Dartmouth, Amherst, Williams, Bowdoin.
Note the filter is available on the schools browse page under
"Financial aid for international students".

When asked about "meets full need, need-aware" schools, list Columbia, Penn, Duke,
Vanderbilt, Rice, Pomona, Wellesley, Middlebury and explain the distinction —
these schools commit to covering 100% of demonstrated need if admitted, but may
weigh aid requests against admission.
```

No new extraction logic — this feature is read-only. `coach-extract.ts` is untouched.

## Tests

### New: `src/app/api/cc/schools/__tests__/search-filters.test.ts`

Integration-style test using a mocked Supabase builder. Verifies:
- Sending `need_blind_international: true` in the POST body adds `q.eq('need_blind_international', true)` to the query chain.
- Same for `meets_full_need_international` and `css_profile_required`.
- Absent/false flags do not add the `eq` call.

### Modified: `src/lib/cc/__tests__/coach-prompt-builder.test.ts`

Two new tests:
1. When `mode=school-builder`, `ctx.isInternational=true`, and `ctx.needsFullAid=true`, the assembled prompt contains all 8 canonical need-blind school names.
2. The assembled prompt also mentions the need-aware distinction (Columbia or Penn or the phrase "need-aware but meet full need").

Existing 9 tests must continue to pass.

## Acceptance criteria (from `INSTRUCTIONS.md` §3)

- [x] "Need-blind for international students" filter exists in school search
- [x] Filtering shows only the ~10 need-blind schools
- [x] Each of those schools has a green "Need-Blind for International Students" badge on their profile
- [x] Need-aware schools that still meet full need show a yellow warning badge
- [x] When a zero-affordability international student generates a school list via Coach Kairos, need-blind schools appear prominently in their reach list *(already partially satisfied by Section 2's `fullAidBlock`; Section 3 reinforces via the need-aware list)*
- [x] Coach Kairos can accurately answer "which schools are need-blind for international students?" with the correct list

## File manifest

**New:**
- `supabase/migrations/20260424_international_aid.sql`
- `src/app/api/cc/schools/__tests__/search-filters.test.ts`

**Modified:**
- `src/app/api/cc/schools/search/route.ts`
- `src/app/schools/page.tsx`
- `src/app/schools/[id]/page.tsx`
- `src/app/api/cc/chances/[school_id]/route.ts`
- `src/lib/cc/coach-prompt-builder.ts`
- `src/lib/cc/__tests__/coach-prompt-builder.test.ts`

## Scope boundaries

| In Section 3 | Deferred |
|--------------|----------|
| 7 new `cc_schools` columns | Real data population for `pct_*` / `avg_aid_package_international` (Section 5) |
| Seed 8 need-aware full-need schools by IPEDS ID | CSS Profile guide content + `/profile/css-guide` route (Section 8) |
| Browse filter panel (collapsible, local state) | URL-param persistence of filter state |
| Detail page header badges + Aid tab aid-for-intl section | "What is CSS Profile? →" interactive button (Section 5/8) |
| Coach Kairos canonical-list answers | First-gen, language preference, is_international changes (Section 4) |
| Chances API schoolContext extension | |

## Risks / open items

1. **IPEDS ID verification.** The 8 need-aware schools' IPEDS IDs (Columbia `190150`, Penn `215062`, etc.) are from public IPEDS records but assume the existing `cc_schools` seed data populated `ipeds_id` for them. If any row is missing its IPEDS ID, the `UPDATE` silently skips it. Mitigation: after running the migration, `SELECT name, ipeds_id, need_blind_international, meets_full_need_international FROM cc_schools WHERE ipeds_id IN (...)` to verify all 16 rows have the right flags.
2. **Auto-expand data source.** The browse panel's auto-expand-for-intl-full-aid-students rule needs `is_international` + `needs_full_aid` flags. If no existing endpoint exposes them without the full profile fetch, implementation will either add a minimal `/api/cc/profile/flags` endpoint or reuse `/api/cc/coach/context`. Decision made during implementation; not a blocker.
3. **Data staleness.** `aid_policy_verified_date = '2026-04-22'` creates a stale-data clock. Future quarterly re-verification is a separate operational task, not a code concern.
