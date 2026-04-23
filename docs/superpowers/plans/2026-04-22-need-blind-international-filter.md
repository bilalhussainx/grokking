# Need-Blind International Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Section 3 of `INSTRUCTIONS.md` — seven new `cc_schools` columns, seed 8 need-aware-full-need schools, collapsible filter UI in browse, header badges + aid-tab content on detail page, chances API enrichment, and Coach Kairos canonical-list answers.

**Architecture:** Database-first additive feature. Existing `/api/cc/schools/[id]` returns `*` so the detail page picks up new columns automatically; `/api/cc/schools/search` gets three optional filter booleans; browse page gets a collapsible panel below existing filters; detail page gets a compact badge row + extended Aid tab section. No new services, no new LLM calls.

**Tech Stack:** Next.js 16 App Router, TypeScript 5 strict, Tailwind 4, Supabase, Vitest. Follows Section 2's IPEDS-ID seeding pattern.

**Spec:** [`docs/superpowers/specs/2026-04-22-need-blind-international-filter-design.md`](../specs/2026-04-22-need-blind-international-filter-design.md)

---

### Task 1: Database migration

**Files:**
- Create: `supabase/migrations/20260424_international_aid.sql`

- [ ] **Step 1: Write the migration**

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

-- Upgrade the 8 need-blind schools from Section 2 to also flag meets-full-need
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

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/20260424_international_aid.sql
git commit -m "feat(schools): add 7 international aid columns + seed need-aware schools"
```

---

### Task 2: Search API — accept 3 new filter booleans

**Files:**
- Modify: `src/app/api/cc/schools/search/route.ts` (entire file)

- [ ] **Step 1: Replace the route**

```ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase();
  const body = await req.json();
  const {
    query,
    state,
    type,
    test_policy,
    need_blind_international,
    meets_full_need_international,
    css_profile_required,
    limit = 50,
  } = body;

  let q = supabase
    .from("cc_schools")
    .select(
      "id, name, city, state, school_type, acceptance_rate, avg_net_price, test_policy, regular_deadline, early_deadline, website, ceeb_code, enrollment, need_blind_international, meets_full_need_international, css_profile_required, pct_international_students_receiving_aid, avg_aid_package_international"
    )
    .order("name")
    .limit(Math.min(limit, 100));

  if (query) q = q.ilike("name", `%${query}%`);
  if (state) q = q.eq("state", state);
  if (type) q = q.eq("school_type", type);
  if (test_policy) q = q.eq("test_policy", test_policy);
  if (need_blind_international === true) q = q.eq("need_blind_international", true);
  if (meets_full_need_international === true) q = q.eq("meets_full_need_international", true);
  if (css_profile_required === true) q = q.eq("css_profile_required", true);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ schools: data });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cc/schools/search/route.ts
git commit -m "feat(schools/search): accept need_blind + meets_full_need + css_profile filters"
```

---

### Task 3: Search API filter tests (TDD)

**Files:**
- Create: `src/app/api/cc/schools/__tests__/search-filters.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const eqMock = vi.fn().mockReturnThis();
const ilikeMock = vi.fn().mockReturnThis();
const orderMock = vi.fn().mockReturnThis();
const limitMock = vi.fn().mockResolvedValue({ data: [], error: null });
const selectMock = vi.fn(() => ({ order: orderMock, limit: limitMock, eq: eqMock, ilike: ilikeMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));

vi.mock("../../helpers", () => ({
  createAdminSupabase: () => ({ from: fromMock }),
}));

// Re-bind chain so every call returns the same builder
beforeEach(() => {
  eqMock.mockClear().mockReturnThis();
  ilikeMock.mockClear().mockReturnThis();
  orderMock.mockClear().mockReturnThis();
  limitMock.mockClear().mockResolvedValue({ data: [], error: null });
  selectMock.mockClear();
  fromMock.mockClear();
});

async function callSearch(body: Record<string, unknown>) {
  const { POST } = await import("../search/route");
  const req = new NextRequest("http://localhost/api/cc/schools/search", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return POST(req);
}

describe("/api/cc/schools/search filter behavior", () => {
  it("filters need-blind international when flag is true", async () => {
    await callSearch({ need_blind_international: true });
    expect(eqMock).toHaveBeenCalledWith("need_blind_international", true);
  });

  it("filters meets-full-need international when flag is true", async () => {
    await callSearch({ meets_full_need_international: true });
    expect(eqMock).toHaveBeenCalledWith("meets_full_need_international", true);
  });

  it("filters css-profile-required when flag is true", async () => {
    await callSearch({ css_profile_required: true });
    expect(eqMock).toHaveBeenCalledWith("css_profile_required", true);
  });

  it("does not filter when flag is absent or false", async () => {
    await callSearch({ state: "MA" });
    const calls = eqMock.mock.calls.map((c) => c[0]);
    expect(calls).not.toContain("need_blind_international");
    expect(calls).not.toContain("meets_full_need_international");
    expect(calls).not.toContain("css_profile_required");
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run src/app/api/cc/schools/__tests__/search-filters.test.ts
```

Expected: 4/4 PASS (Task 2's implementation already satisfies them).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/schools/__tests__/search-filters.test.ts
git commit -m "test(schools/search): verify intl-aid filter flags wire to eq()"
```

---

### Task 4: Detail page — extend type + header badges

**Files:**
- Modify: `src/app/schools/[id]/page.tsx`

- [ ] **Step 1: Extend the `SchoolDetail` interface**

Add these fields to the interface (currently ends at line 52):

```ts
  need_blind_international: boolean | null;
  meets_full_need_international: boolean | null;
  pct_international_students_receiving_aid: number | null;
  avg_aid_package_international: number | null;
  css_profile_required: boolean | null;
  fafsa_required_international: boolean | null;
  international_aid_notes: string | null;
  aid_policy_verified_date: string | null;
```

- [ ] **Step 2: Add compact header badge row**

Between the existing location/type row (ends at line 188) and the tab switcher (`<div className="flex gap-1 mb-6 p-1 rounded-xl ...">`), insert:

```tsx
      {(school.need_blind_international || school.meets_full_need_international || school.css_profile_required) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {school.need_blind_international && (
            <span
              title="Need-blind for international students — citizenship does not affect admission odds"
              className="px-2.5 py-1 rounded-md text-[11px] bg-green-500/15 border border-green-500/30 text-green-300 font-medium"
            >
              🔓 Need-blind intl
            </span>
          )}
          {school.meets_full_need_international && !school.need_blind_international && (
            <span
              title="Meets 100% of demonstrated need for admitted international students, but is need-aware in admissions"
              className="px-2.5 py-1 rounded-md text-[11px] bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 font-medium"
            >
              ⚠ Need-aware · full need
            </span>
          )}
          {school.css_profile_required && (
            <span
              title="CSS Profile required for international aid"
              className="px-2.5 py-1 rounded-md text-[11px] bg-white/5 border border-white/10 text-white/60 font-medium"
            >
              📋 CSS Profile
            </span>
          )}
        </div>
      )}
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep -E "schools/\[id\]|SchoolDetail" || echo "no new type errors"
```

Expected: "no new type errors".

- [ ] **Step 4: Commit**

```bash
git add src/app/schools/[id]/page.tsx
git commit -m "feat(schools): add intl-aid header badges + extend SchoolDetail"
```

---

### Task 5: Detail page — Aid tab international aid section

**Files:**
- Modify: `src/app/schools/[id]/page.tsx`

- [ ] **Step 1: Insert new section at top of Aid tab**

Find the Aid tab block that starts with `{tab === "aid" && (` around line 271. Insert this block as the FIRST child inside the existing `<div className="space-y-4">` (before the existing avg_net_price / cost_of_attendance grid):

```tsx
          {school.need_blind_international && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-300 font-semibold text-sm">
                  🔓 Need-Blind for International Students
                </span>
              </div>
              <p className="text-green-200/90 text-xs leading-relaxed">
                This school does not consider your ability to pay when making admission decisions. If admitted, they will meet 100% of your demonstrated financial need.
              </p>
              {school.pct_international_students_receiving_aid != null && (
                <p className="text-green-200 text-xs mt-2 font-medium">
                  {Math.round(school.pct_international_students_receiving_aid)}% of international students at this school receive financial aid.
                </p>
              )}
            </div>
          )}

          {school.meets_full_need_international && !school.need_blind_international && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-300 font-semibold text-sm">
                  ⚠ Need-Aware, Meets Full Need
                </span>
              </div>
              <p className="text-yellow-200/90 text-xs leading-relaxed">
                This school meets 100% of your financial need if admitted, but your application may be less competitive if you need significant aid. Apply strategically.
              </p>
            </div>
          )}

          {(school.pct_international_students_receiving_aid != null || school.avg_aid_package_international != null) && (
            <div className="grid grid-cols-2 gap-3">
              {school.pct_international_students_receiving_aid != null && (
                <StatCard
                  icon={Users}
                  label="Intl students w/ aid"
                  value={`${Math.round(school.pct_international_students_receiving_aid)}%`}
                />
              )}
              {school.avg_aid_package_international != null && (
                <StatCard
                  icon={DollarSign}
                  label="Avg intl aid package"
                  value={`$${school.avg_aid_package_international.toLocaleString()}`}
                />
              )}
              {school.avg_aid_package_international != null && school.cost_of_attendance && (
                <StatCard
                  icon={DollarSign}
                  label="Net cost (intl)"
                  value={`$${Math.max(0, school.cost_of_attendance - school.avg_aid_package_international).toLocaleString()}`}
                />
              )}
            </div>
          )}

          {(school.css_profile_required || school.fafsa_required_international) && (
            <div className="flex flex-wrap gap-1.5">
              {school.css_profile_required && (
                <span className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-white/60">
                  📋 CSS Profile required for intl aid
                </span>
              )}
              {school.fafsa_required_international && (
                <span className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-white/60">
                  📋 FAFSA required
                </span>
              )}
            </div>
          )}

          {school.international_aid_notes && (
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white/70 leading-relaxed">
              {school.international_aid_notes}
            </div>
          )}

          {school.aid_policy_verified_date && (
            <p className="text-[10px] text-white/30 text-right">
              Policy verified: {school.aid_policy_verified_date}
            </p>
          )}
```

- [ ] **Step 2: Manual visual check**

Run dev server and load `/schools/<id>` for MIT (need-blind) and Columbia (need-aware + full need). Confirm:
- MIT: header has green `🔓 Need-blind intl` chip + `📋 CSS Profile` chip. Aid tab shows green callout at top.
- Columbia: header has yellow `⚠ Need-aware · full need` chip + `📋 CSS Profile` chip. Aid tab shows yellow callout at top.
- A non-seeded school shows no header aid chips and no new Aid-tab content.

```bash
npm run dev
```

- [ ] **Step 3: Commit**

```bash
git add src/app/schools/[id]/page.tsx
git commit -m "feat(schools): surface intl-aid callouts + stats in Aid tab"
```

---

### Task 6: Browse page — collapsible filter panel

**Files:**
- Modify: `src/app/schools/page.tsx`

- [ ] **Step 1: Add state + import `Globe`**

Update the `lucide-react` import line (line 4) to include `Globe`:

```ts
import { Search, Building2, List, GitCompare, MessageSquare, Globe } from "lucide-react";
```

Add three new state hooks below `addedIds` (around line 49):

```ts
  const [needBlindIntl, setNeedBlindIntl] = useState(false);
  const [meetsFullNeedIntl, setMeetsFullNeedIntl] = useState(false);
  const [cssProfileRequired, setCssProfileRequired] = useState(false);
```

- [ ] **Step 2: Extend the `search` body builder**

Replace the `search` useCallback body construction (currently builds `body` with query/state/type) to also include the three new booleans when active:

```ts
  const search = useCallback(async (q: string, state: string, type: string, nbi: boolean, mfni: boolean, css: boolean) => {
    setBrowseLoading(true);
    const body: Record<string, unknown> = { limit: 50 };
    if (q) body.query = q;
    if (state) body.state = state;
    if (type) body.type = type;
    if (nbi) body.need_blind_international = true;
    if (mfni) body.meets_full_need_international = true;
    if (css) body.css_profile_required = true;

    const res = await fetch("/api/cc/schools/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      setSchools(data.schools || []);
    }
    setBrowseLoading(false);
  }, []);
```

Update the effect that triggers the search (currently `useEffect(() => { if (tab === "browse") search(query, stateFilter, typeFilter); }, [query, stateFilter, typeFilter, search, tab]);`):

```ts
  useEffect(() => {
    if (tab === "browse") search(query, stateFilter, typeFilter, needBlindIntl, meetsFullNeedIntl, cssProfileRequired);
  }, [query, stateFilter, typeFilter, needBlindIntl, meetsFullNeedIntl, cssProfileRequired, search, tab]);
```

Also update the other `search(...)` callsites in the file (the two in the empty-state buttons and the `setTab("browse")` handler) to pass the three booleans explicitly — they should all pass `needBlindIntl, meetsFullNeedIntl, cssProfileRequired`.

- [ ] **Step 3: Insert the collapsible panel**

After the existing State/Type filter row (the `<div className="flex flex-wrap gap-2 mb-6">` that contains the two `<select>` elements — ends right before the loading/results conditional), insert:

```tsx
          <details className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <summary className="cursor-pointer px-4 py-3 text-[11px] uppercase tracking-wider text-white/60 flex items-center gap-2 hover:bg-white/[0.02]">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              Financial aid for international students
            </summary>
            <div className="px-4 pb-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                <FilterPill active={needBlindIntl} onClick={() => setNeedBlindIntl((v) => !v)} icon="🔓" label="Need-blind intl" />
                <FilterPill active={meetsFullNeedIntl} onClick={() => setMeetsFullNeedIntl((v) => !v)} icon="💯" label="Meets full need intl" />
                <FilterPill active={cssProfileRequired} onClick={() => setCssProfileRequired((v) => !v)} icon="📋" label="Accepts CSS Profile" />
              </div>
              {needBlindIntl && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-200 leading-relaxed">
                  🔓 Showing schools that are need-blind for international students. These schools will not penalize you for needing financial aid. There are currently {schools.length} in our database.
                </div>
              )}
            </div>
          </details>
```

- [ ] **Step 4: Add the `FilterPill` helper at the bottom of the file**

After the default `export default function SchoolsPage` closing brace, add:

```tsx
function FilterPill({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
        active
          ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
          : "bg-white/5 border-white/10 text-white/60 hover:text-white/80 hover:bg-white/10"
      }`}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </button>
  );
}
```

- [ ] **Step 5: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep -E "schools/page" || echo "no new type errors"
```

Expected: "no new type errors".

- [ ] **Step 6: Manual visual check**

```bash
npm run dev
```

Open `/schools`, switch to Browse tab:
- Collapsible panel appears below the State/Type dropdowns, collapsed by default.
- Expanding reveals 3 toggle pills.
- Toggling "Need-blind intl" shows the green callout banner.
- Results shrink to ~8 schools when Need-blind is active.
- Toggling off restores the full list.

- [ ] **Step 7: Commit**

```bash
git add src/app/schools/page.tsx
git commit -m "feat(schools/browse): collapsible intl-aid filter panel with 3 toggles"
```

---

### Task 7: Chances API — enrich schoolContext

**Files:**
- Modify: `src/app/api/cc/chances/[school_id]/route.ts`

- [ ] **Step 1: Extend the school select**

Update the cc_schools select string (line 80) to include `meets_full_need_international, pct_international_students_receiving_aid`:

```ts
    .select("id, name, city, state, acceptance_rate, sat_25, sat_75, act_25, act_75, avg_hs_gpa, school_type, test_policy, meets_full_need, need_blind_international, meets_full_need_international, pct_international_students_receiving_aid, first_gen_programs, alumni_interview_program, persona_slug")
```

- [ ] **Step 2: Extend `schoolContext`**

Update the `schoolContext` object (around line 189) to include the two new fields:

```ts
  const schoolContext = {
    name: school.name,
    location: `${school.city}, ${school.state}`,
    acceptanceRate: school.acceptance_rate,
    sat25_75: school.sat_25 && school.sat_75 ? `${school.sat_25}-${school.sat_75}` : null,
    act25_75: school.act_25 && school.act_75 ? `${school.act_25}-${school.act_75}` : null,
    avgHsGpa: school.avg_hs_gpa,
    testPolicy: school.test_policy,
    meetsFullNeed: school.meets_full_need,
    needBlindInternational: !!(school as { need_blind_international?: boolean | null }).need_blind_international,
    meetsFullNeedInternational: !!(school as { meets_full_need_international?: boolean | null }).meets_full_need_international,
    pctInternationalReceivingAid: (school as { pct_international_students_receiving_aid?: number | null }).pct_international_students_receiving_aid ?? null,
    firstGenPrograms: school.first_gen_programs,
    alumniInterviewProgram: school.alumni_interview_program,
  };
```

- [ ] **Step 3: Refine the SYSTEM_PROMPT rule**

Find the rule added in Section 2 (line 33): `- If the student has needsFullAid=true and the school is NOT need-blind for internationals (needBlindInternational=false), downgrade the band by one tier and flag the aid-admission risk in weaknesses.`

Replace it with:

```
- If needsFullAid=true and the school's needBlindInternational=false, downgrade the band by one tier and flag aid-admission risk in weaknesses. If in addition meetsFullNeedInternational=true, note that the student would still receive full aid *if admitted* — the risk is admission odds, not affordability. If meetsFullNeedInternational=false as well, also warn that affordability is uncertain even post-admission.
```

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep -E "chances" || echo "no new type errors"
```

Expected: "no new type errors".

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cc/chances/[school_id]/route.ts
git commit -m "feat(chances): enrich schoolContext with meets_full_need_intl + aid pct"
```

---

### Task 8: Coach prompt builder tests (TDD)

**Files:**
- Modify: `src/lib/cc/__tests__/coach-prompt-builder.test.ts`

- [ ] **Step 1: Add two failing tests**

At the end of the existing `describe("buildSystemPrompt", () => { ... })` block, just before the closing `});`, add:

```ts
  it("lists all 8 canonical need-blind schools for intl full-aid students in school-builder mode", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "school-builder",
      isInternational: true,
      country: "PK",
      affordabilityValue: "zero",
      needsFullAid: true,
    };
    const prompt = buildSystemPrompt(ctx);
    for (const school of ["MIT", "Harvard", "Yale", "Princeton", "Dartmouth", "Amherst", "Williams", "Bowdoin"]) {
      expect(prompt).toContain(school);
    }
  });

  it("mentions the need-aware-meets-full-need distinction for intl full-aid students", () => {
    const ctx: CoachContext = {
      ...baseContext,
      mode: "school-builder",
      isInternational: true,
      country: "PK",
      affordabilityValue: "zero",
      needsFullAid: true,
    };
    const prompt = buildSystemPrompt(ctx);
    expect(prompt.toLowerCase()).toMatch(/need-aware/);
    // At least one of the 8 need-aware-full-need schools should be named
    const needAwareSchools = ["Columbia", "Penn", "Duke", "Vanderbilt", "Rice", "Pomona", "Wellesley", "Middlebury"];
    expect(needAwareSchools.some((s) => prompt.includes(s))).toBe(true);
  });
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
npx vitest run src/lib/cc/__tests__/coach-prompt-builder.test.ts
```

Expected: 9 pass, 2 fail — the need-aware distinction test fails (canonical list test may pass since `fullAidBlock` already lists 8 need-blind schools, but the need-aware test fails because Columbia/Penn/etc. are not in the current prompt).

---

### Task 9: Coach prompt builder — extend fullAidBlock

**Files:**
- Modify: `src/lib/cc/coach-prompt-builder.ts`

- [ ] **Step 1: Extend the `fullAidBlock` string**

Find the `fullAidBlock` ternary (around line 273-279 in the `case "school-builder"` block). Append this text to the existing `fullAidBlock` value (before the closing backtick of the `ctx.needsFullAid` branch):

```
\n\nCANONICAL NEED-BLIND INTL LIST: MIT, Harvard, Yale, Princeton, Dartmouth, Amherst, Williams, Bowdoin. If the student asks "which schools are need-blind for international students?" name all 8, note that these are the only US colleges that combine need-blind admission with 100% of need met for international students, and point them to the "Financial aid for international students" filter on [School List Builder](/schools).\n\nCANONICAL NEED-AWARE + MEETS-FULL-NEED LIST: Columbia, Penn, Duke, Vanderbilt, Rice, Pomona, Wellesley, Middlebury. These schools meet 100% of demonstrated need for admitted international students BUT are need-aware — meaning asking for aid can reduce admission odds. If the student is considering these, frame them as reaches where aid is guaranteed if they get in, but admission itself is the harder bar.
```

Concretely, the updated assignment should look like:

```ts
      const fullAidBlock = ctx.needsFullAid
        ? `

FULL-AID CONSTRAINT (CRITICAL): This student has set affordability to $0 and needs 100% of demonstrated financial need met. Your recommendations MUST prioritize schools that are need-blind for ${ctx.isInternational ? "international" : "domestic"} students AND meet full demonstrated need. Safe recommendations for this student include: MIT, Harvard, Yale, Princeton, Dartmouth, Amherst, Williams, Bowdoin${ctx.isInternational ? " (all need-blind for internationals and meet 100% of need)" : ""}. Do NOT recommend schools that are need-aware for the student's status (most state schools, most private schools that aren't the ~8 need-blind-for-internationals or the broader need-blind-for-domestic list) without flagging the aid risk plainly: "X meets full need for admitted students but is need-aware — applying will reduce your admission odds."${ctx.isInternational ? `

CSS PROFILE: Because the student is international and needs full aid, mention in passing that most of their target schools use the CSS Profile (not FAFSA). Point them to [CSS Profile Guide](/profile/css-guide) once for context — don't belabor it.

CANONICAL NEED-BLIND INTL LIST: MIT, Harvard, Yale, Princeton, Dartmouth, Amherst, Williams, Bowdoin. If the student asks "which schools are need-blind for international students?" name all 8, note that these are the only US colleges that combine need-blind admission with 100% of need met for international students, and point them to the "Financial aid for international students" filter on [School List Builder](/schools).

CANONICAL NEED-AWARE + MEETS-FULL-NEED LIST: Columbia, Penn, Duke, Vanderbilt, Rice, Pomona, Wellesley, Middlebury. These schools meet 100% of demonstrated need for admitted international students BUT are need-aware — meaning asking for aid can reduce admission odds. If the student is considering these, frame them as reaches where aid is guaranteed if they get in, but admission itself is the harder bar.` : ""}`
        : "";
```

- [ ] **Step 2: Run tests to verify pass**

```bash
npx vitest run src/lib/cc/__tests__/coach-prompt-builder.test.ts
```

Expected: 11/11 PASS.

- [ ] **Step 3: Run the full vitest suite to confirm no regressions**

```bash
npx vitest run
```

Expected: all prior tests still pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cc/coach-prompt-builder.ts src/lib/cc/__tests__/coach-prompt-builder.test.ts
git commit -m "feat(coach): list canonical need-blind + need-aware intl schools"
```

---

### Task 10: Verification pass

- [ ] **Step 1: Run migration**

```bash
npx supabase db push
```

Expected: migration `20260424_international_aid.sql` applies cleanly.

- [ ] **Step 2: Verify seeding**

In the Supabase SQL editor (or via psql):

```sql
SELECT name, ipeds_id, need_blind_international, meets_full_need_international, aid_policy_verified_date
FROM cc_schools
WHERE ipeds_id IN (
  -- Need-blind + full-need (from Section 2, upgraded in S3)
  166027, 166683, 130794, 186131, 182670, 164465, 168342, 160977,
  -- Need-aware + full-need (new in S3)
  190150, 215062, 198419, 221999, 227757, 121257, 168218, 230038
)
ORDER BY need_blind_international DESC, name;
```

Expected: 16 rows. First 8 have `need_blind_international=true AND meets_full_need_international=true`. Next 8 have `need_blind_international=false AND meets_full_need_international=true`. All have `aid_policy_verified_date='2026-04-22'`.

If any row is missing (silent UPDATE skip), look it up: `SELECT id, name, ipeds_id FROM cc_schools WHERE name ILIKE '%Columbia%'` (etc.) and reconcile.

- [ ] **Step 3: Full test suite + typecheck**

```bash
npx vitest run
npx tsc --noEmit
```

Expected: all vitest pass. `tsc` has only the pre-existing unrelated error in `tests/e2e/comprehensive-visual-audit.spec.ts`.

- [ ] **Step 4: Manual acceptance-criteria walkthrough**

```bash
npm run dev
```

Check each acceptance criterion from `INSTRUCTIONS.md` §3:

- [ ] "Need-blind for international students" filter exists in school search — open `/schools`, Browse tab, expand "Financial aid for international students" panel. Pill visible.
- [ ] Filtering shows only the ~10 need-blind schools — toggle the pill. Result count drops to 8 (MIT, Harvard, Yale, Princeton, Dartmouth, Amherst, Williams, Bowdoin).
- [ ] Each need-blind school has a green badge on their profile — click through to `/schools/<MIT id>`. Green `🔓 Need-blind intl` chip in header, green callout in Aid tab.
- [ ] Need-aware schools show yellow badge — click `/schools/<Columbia id>`. Yellow `⚠ Need-aware · full need` chip in header, yellow callout in Aid tab.
- [ ] Zero-affordability intl student gets need-blind reaches — in Coach Kairos, set profile affordability to `zero`, is_international=true, then ask "Help me build my school list." Recommendations surface MIT/Harvard/Yale/Princeton etc. prominently. (This is mostly Section 2's `fullAidBlock`; Section 3 adds the need-aware distinction.)
- [ ] Coach can answer "which schools are need-blind for international students?" — ask Coach Kairos directly. Response names all 8 canonical schools. (School-builder mode; simulate via the school list flow.)

- [ ] **Step 5: Final commit if anything needs touching up**

---

## Self-Review

**Spec coverage (against `docs/superpowers/specs/2026-04-22-need-blind-international-filter-design.md`):**
- 7 new columns + 2 seed UPDATE statements → Task 1 ✓
- Search API accepts 3 new booleans → Task 2 + Task 3 test ✓
- Browse page collapsible panel with 3 pills + banner → Task 6 ✓
- Detail page header badges → Task 4 ✓
- Detail page Aid tab international section → Task 5 ✓
- Chances API schoolContext enrichment + prompt rule refinement → Task 7 ✓
- Coach fullAidBlock canonical lists → Task 9 + Task 8 tests ✓

**Intentionally deferred (per spec scope boundaries):**
- Auto-expand logic for the browse filter panel based on profile flags. The spec marked this as "decision deferred to implementation" and flagged it non-blocking. Keeping the panel collapsed-by-default for all users in v1 is acceptable — we can add the auto-expand in a follow-up once we decide where to source the flags. Removing from this plan to keep the task list focused on shippable acceptance criteria.
- CSS Profile "What is CSS Profile? →" interactive button (Section 8).
- Data population for `pct_*` / `avg_aid_package_international` (Section 5). The UI renders these stats conditionally, so they stay invisible until Section 5 populates them.

**Placeholder scan:** No TBDs, no "TODO", no `// ... existing code`, every code block is complete and copy-pasteable.

**Type consistency:** `SchoolDetail` interface extension in Task 4 matches the migration's columns in Task 1. `schoolContext` additions in Task 7 match the select-list additions. `FilterPill` props in Task 6 match its usage. No drift.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-22-need-blind-international-filter.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
