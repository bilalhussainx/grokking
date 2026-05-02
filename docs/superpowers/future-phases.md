# KairosLearn — Dashboard Future Phases

**Status:** Documented but not implemented. Pick up when ready.
**Companion to:** `docs/superpowers/designs/handoff/` (the original handoff bundle from claude.ai/design)
**Predecessors:**
- `docs/superpowers/plans/2026-05-02-handoff-phase-2-dashboard.md` — Visual treatment refactor (shipped)
- `docs/superpowers/plans/2026-05-02-handoff-phase-2-5-priority-content.md` — Bespoke priority module content for data we already collect (shipped)

This document covers the remaining two phases that complete the dashboard's match to the handoff design:

- **Phase 2.6** — Aid comparator + transfer articulation. **Gated on entry forms.** Pure engineering, no AI cost.
- **Phase 2.7** — "Coach's nudge" callouts. **The single most differentiating piece** of the handoff. Requires new infrastructure + ongoing AI cost.

Read each section in full before scoping. They are independent — 2.6 can ship without 2.7 and vice versa.

---

## Phase 2.6 — Aid comparator + Transfer articulation

**Goal:** Replace empty-state placeholders on `senior_decisions` (Aid comparator) and `transfer` (Transfer school list / Course evaluations) with rich live widgets, by first shipping the entry forms students need to populate the data.

**Effort estimate:** 6-8 hours total (split: ~3h aid comparator, ~3h articulation, ~2h widgets).
**Ongoing cost:** None.
**Risk:** Adoption — if students don't fill in the data, both widgets stay empty. Mitigate by gating each form with the moment the student actually needs it (aid: when they mark a school "accepted"; articulation: at signup if `is_transfer_student=true`).

### Architecture summary

Two independent feature slices, both following the same pattern:

```
[entry form] → [DB column / side table] → [DashboardData fetch]
              → [PriorityExtra discriminated union, new kind]
              → [PriorityModule renders matching sub-component]
```

The `PriorityExtra` union from Phase 2.5 is the extension point. Each new widget adds:
1. One new `kind` to the union
2. One new sub-component in `PriorityModule.tsx`
3. One new field group in `DashboardData`

No structural changes to `AdaptiveDashboard` or `variants.ts`'s shape — just new cases.

---

### Phase 2.6.A — Aid comparator (senior_decisions)

The schema column already exists. The work is the form + the widget.

#### Schema (already in place — verify, don't add)

`cc_student_schools` has these columns from migration `20260426_feature_2_application_tracker.sql`:

```sql
financial_aid_amount NUMERIC(10,2),     -- annual aid offer ($)
scholarship_amount   NUMERIC(10,2),     -- merit award separately tracked
net_cost_estimate    NUMERIC(10,2)      -- COA - aid - scholarship
```

#### Entry form

**Where:** Inline on the existing `/applications` Kanban — when a student moves a school card to "accepted" or "deposited", a small inline form appears asking three numbers.

**Why inline (not a separate route):** Students enter aid info exactly once per school, immediately after they get the offer. Burying it in a settings page means it never gets filled.

**Implementation:**

1. Modify `src/components/applications/SchoolCard.tsx` (or wherever the per-school card lives in the Kanban). When `application_status === "accepted"` and `financial_aid_amount IS NULL`, render a "Log aid offer" button that opens a small inline panel with three numeric inputs:
   - **Total annual aid** (need-based) — required
   - **Scholarship** (merit) — optional
   - **Estimated net cost** — optional, auto-computes from the school's COA if known
2. POST to `/api/cc/applications/update` (existing route — already supports `financial_aid_amount` in the patch payload).
3. Pre-fill the panel from existing values when reopened so editing works.

**Don't build a dedicated `/aid-offers` route.** It splits attention from the Kanban where the student already lives.

#### DashboardData additions

```typescript
// In src/app/cc/dashboard/variants.ts — DashboardData type
aidOffers: Array<{
  schoolName: string;
  annualAid: number;
  netCost: number | null;  // null when not set
}> | null;
```

#### Fetch (in `dashboard/page.tsx`)

Already loaded — `cc_student_schools` is fetched at the top of the page. Just project the new fields:

```typescript
// Where school list is iterated for chancing/deadline calc, also build:
const aidOffers = schoolList
  .filter((s) =>
    (s.application_status === "accepted" || s.application_status === "deposited") &&
    typeof (s as Record<string, unknown>).financial_aid_amount === "number"
  )
  .map((s) => {
    const sch = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
    return {
      schoolName: sch?.name ?? "Unknown school",
      annualAid: Number((s as Record<string, unknown>).financial_aid_amount),
      netCost: typeof (s as Record<string, unknown>).net_cost_estimate === "number"
        ? Number((s as Record<string, unknown>).net_cost_estimate)
        : null,
    };
  });
```

#### Add `aidComparator` to `PriorityExtra`

```typescript
| {
    kind: "aidComparator";
    offers: Array<{ schoolName: string; annualAid: number; netCost: number | null }>;
  }
```

#### Render in `PriorityModule.tsx`

Sort by `annualAid` ascending (cheapest = best aid first). Render up to 5 rows:

```jsx
<Row>
  <span style={{flex:1}}>{schoolName}</span>
  <Mono color={tintByAffordability(annualAid)}>${annualAid.toLocaleString()}/yr</Mono>
</Row>
```

Tint colors:
- Green (`#86efac`) when `annualAid >= 30000` (very generous)
- Gold (`#fcd34d`) when `15000 <= annualAid < 30000`
- Rose (`#fca5a5`) when `annualAid < 15000` (gap likely)

Below the rows, a single italic line: `"Best aid: $X at <school>. Worth a negotiation letter at <school2>."` — keep this static for Phase 2.6 (don't AI-generate; that's 2.7).

#### Wire into senior_decisions variant

In `variants.ts → buildPriority("senior_decisions")`, replace the existing "Aid comparator" card's `extra` with:

```typescript
extra: d.aidOffers && d.aidOffers.length > 0
  ? { kind: "aidComparator", offers: d.aidOffers }
  : undefined,
```

Empty state: existing `valueKind: "text"` value `"Run the math"` falls through. Once they log one offer, the comparator appears.

#### Tests

Three cases in `variants.test.ts`:
- senior_decisions card has `aidComparator` extra when `aidOffers` is non-empty
- Falls back to simple text when `aidOffers` is null or empty
- Sorting is correct (cheapest first)

---

### Phase 2.6.B — Transfer articulation breakdown

The column doesn't exist. New migration + new entry form + new widget.

#### Migration

New file: `supabase/migrations/20260520_transfer_articulation.sql`

```sql
-- Per-school credit articulation for transfer applicants. Tracks how many
-- of the student's current college credits the target school accepts.
ALTER TABLE cc_student_schools
  ADD COLUMN IF NOT EXISTS credits_accepted INTEGER,           -- e.g., 28
  ADD COLUMN IF NOT EXISTS credits_required INTEGER,           -- e.g., 30
  ADD COLUMN IF NOT EXISTS articulation_notes TEXT;            -- e.g., "Bio missing prereq"

-- Index helps the dashboard widget that aggregates per-school articulation.
CREATE INDEX IF NOT EXISTS cc_student_schools_articulation_idx
  ON cc_student_schools(student_id)
  WHERE credits_accepted IS NOT NULL;
```

#### Entry form

**Where:** New section on `/cc/transfer-profile` page, below the existing "Tell us about your transfer" form.

**UI:** A repeating row per school in the student's school list:

```
University of Pennsylvania  [____ / ____ credits]  [optional notes _____]  [Save]
```

Two numeric inputs (`accepted` / `required`) + optional notes. Save POSTs to `/api/cc/applications/update`.

**Smart default:** Pre-fill `credits_required` to `30` (typical for transfer-to-junior-year). Student adjusts if their target program differs.

#### DashboardData additions

```typescript
articulation: Array<{
  schoolName: string;
  accepted: number;
  required: number;
  ratio: number;          // accepted / required, capped 0..1
  tone: "leaf" | "gold" | "rose"; // green ≥ .9, gold .75-.89, rose < .75
}> | null;
```

Compute `tone` server-side (in `dashboard/page.tsx`) so the widget stays presentational.

#### Add `articulation` to `PriorityExtra`

```typescript
| {
    kind: "articulation";
    schools: Array<{
      schoolName: string;
      accepted: number;
      required: number;
      tone: "leaf" | "gold" | "rose";
    }>;
  }
```

#### Render in `PriorityModule.tsx`

Each row:

```jsx
<Row>
  <span style={{display:'inline-flex', width:8, height:8, borderRadius:999,
    background: tone === 'leaf' ? '#4ade80' : tone === 'rose' ? '#f87171' : '#d4af37'}}/>
  <span style={{flex:1, fontSize:12}}>{schoolName}</span>
  <span style={{fontSize:10.5, color:'rgba(255,255,255,.55)'}}>
    {accepted}/{required} credits accept
  </span>
</Row>
```

#### Wire into transfer variant

In `variants.ts → buildPriority("transfer")`, the existing "Transfer schools" card gains:

```typescript
extra: d.articulation && d.articulation.length > 0
  ? { kind: "articulation", schools: d.articulation }
  : undefined,
```

#### Tests

Same pattern as 2.6.A — extra renders when data exists, falls through when empty, tone calculation is correct at the boundaries (.74 → rose, .75 → gold, .89 → gold, .90 → leaf).

---

### Phase 2.6 acceptance criteria

- [ ] Migration `20260520_transfer_articulation.sql` applied via Supabase SQL editor
- [ ] Aid form lives on the Kanban inline; saves on first submit; pre-fills on edit
- [ ] Articulation form lives on `/cc/transfer-profile`; saves per-school
- [ ] senior_decisions Aid comparator renders 1-5 rows sorted cheapest-first
- [ ] transfer Transfer schools renders dot+name+credits per school
- [ ] Both widgets fall back to existing simple-value treatment when empty
- [ ] All existing tests pass; 6 new tests added (3 per slice)
- [ ] Type-check clean

---

## Phase 2.7 — "Coach's nudge" callouts

**Goal:** Render a per-user, AI-generated, gold-tinted callout inside select priority modules so the dashboard feels like Coach Kairos is *watching*, not just a tracker.

**Effort estimate:** 8-12 hours (table + cron + generation + display + tests).
**Ongoing cost:** ~$0.02-0.04 per nudge per refresh × N modules per variant × DAU. At 1k DAU regenerating once weekly, ~$3-6/month. At 10k DAU regenerating daily, ~$300-600/month. **Cap and cache aggressively.**

### What this phase ships

A single italicized one-liner inside specific priority modules. From the handoff:

```
Personal statement module:
  COACH'S NUDGE
  "¶3 still tells, doesn't show. 15 min if you want to nail it."

Activities module:
  COACH NOTICED
  "5 of 8 involve teaching others. That's your through-line."
```

These are NOT chat replies. They're persistent observations attached to the dashboard surface.

### Schema

New table: `cc_dashboard_observations`

```sql
CREATE TABLE IF NOT EXISTS cc_dashboard_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  -- Which priority module is this observation for? Mirrors PriorityCard.label
  -- ('Personal statement', 'Activities', 'School list', 'Test strategy', etc.).
  module_label TEXT NOT NULL,
  -- The observation text. Always italicized, always under 25 words.
  observation TEXT NOT NULL,
  -- Eyebrow that appears above the quote. Default 'COACH NOTICED'.
  eyebrow TEXT NOT NULL DEFAULT 'COACH NOTICED',
  -- Generation metadata for cost auditing.
  generated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,           -- Phase 2.7 default: 7 days
  model TEXT NOT NULL,                        -- 'anthropic/claude-sonnet-4-6' etc.
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost_usd NUMERIC(10,4),
  -- One observation per (student, module) at a time.
  UNIQUE(student_id, module_label)
);

CREATE INDEX IF NOT EXISTS cc_dashboard_observations_lookup_idx
  ON cc_dashboard_observations(student_id, module_label, expires_at);

ALTER TABLE cc_dashboard_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students see their observations"
  ON cc_dashboard_observations FOR SELECT
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));
```

### Generation pipeline

**Two paths:** (a) lazy on dashboard load, (b) eager via cron. Pick one — recommendation: **eager via cron**.

**Why cron not lazy:** lazy means the first dashboard render after expiry takes a 3-5s LLM call. Cron runs at 4am for everyone, dashboard always has fresh-or-recent observations on every render.

**Cron route:** `src/app/api/cron/generate-observations/route.ts`

Fires daily at 4:07am UTC via `vercel.json`. Iterates active students (any `cc_student_profiles` row with `language_picker_seen_at IS NOT NULL` and any kind of activity in last 30 days) and for each:

1. Read the student's full snapshot (essays, activities, schools, test attempts, decisions) — build a context payload.
2. For each module that gets a nudge (start with: Personal statement, Activities, School list, Decisions tracker), check if a fresh observation exists. Skip if so.
3. Otherwise call OpenRouter Sonnet 4.6 with a tight system prompt (see below). Cap output at 200 tokens.
4. Insert/upsert into `cc_dashboard_observations`.

**System prompt template:**

```
You are Coach Kairos generating a single dashboard observation for a student's
[module_label] module. The student's context follows.

CONSTRAINTS:
- One sentence. Under 25 words.
- Italicized in voice — no bullet points, no headers.
- SPECIFIC. Reference the student's actual data (school name, essay paragraph,
  activity count). Generic advice is forbidden.
- Tone: warm, observant, occasionally witty. NEVER use exclamation marks.
- Output ONLY the observation. No prefix, no explanation.

STUDENT CONTEXT:
[serialized profile + module-specific data]

Examples of correct outputs:
- "5 of 8 involve teaching others. That's your through-line."
- "¶3 still tells, doesn't show. 15 min if you want to nail it."
- "Brown's package is generous. Worth a negotiation letter at NYU."

Generate the observation now.
```

**Cost guardrails (must implement, not optional):**
- Hard cap: 4 modules per student per day = at most 4 LLM calls.
- Skip students who haven't logged in for 7+ days (no point regenerating for absent users).
- Skip modules where the underlying data hasn't changed since the last observation (compare a hash of the input context to the previous generation's hash; store hash on the row).
- Default TTL: 7 days. Stale observations stay visible until refresh.

### Display

Add a sub-component in `PriorityModule.tsx`:

```typescript
function CoachNudge({ observation, eyebrow }: { observation: string; eyebrow: string }) {
  return (
    <div style={{
      padding: '10px',
      borderRadius: 8,
      background: 'rgba(212,175,55,.06)',
      border: '1px solid rgba(212,175,55,.25)',
      marginTop: 8,
    }}>
      <div style={{
        fontSize: 11, color: '#d4a84b',
        letterSpacing: '.10em', textTransform: 'uppercase',
        marginBottom: 4, fontFamily: "'DM Sans', sans-serif",
      }}>
        {eyebrow}
      </div>
      <div style={{
        fontSize: 12, color: '#f2ede3',
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic', lineHeight: 1.4,
      }}>
        &ldquo;{observation}&rdquo;
      </div>
    </div>
  );
}
```

Render below the existing widget (phaseBar, satBars, etc.) when an observation exists for the module.

### Plumbing into DashboardData + variants

```typescript
// DashboardData
observations: Record<string, { observation: string; eyebrow: string }>;
// keyed by module_label, e.g. observations["Personal statement"]
```

In `dashboard/page.tsx`, fetch the student's observations at page load:

```typescript
const obsRows = await safe<Array<{ module_label: string; observation: string; eyebrow: string }>>(
  supabase
    .from("cc_dashboard_observations")
    .select("module_label, observation, eyebrow")
    .eq("student_id", profile.id)
    .gt("expires_at", new Date().toISOString()),
);
const observations = (obsRows ?? []).reduce((acc, row) => {
  acc[row.module_label] = { observation: row.observation, eyebrow: row.eyebrow };
  return acc;
}, {} as Record<string, { observation: string; eyebrow: string }>);
```

Then in `PriorityModule.tsx`, lookup `observations[card.label]` and render `<CoachNudge>` if present.

The cleaner pattern: add an optional `nudge?: { observation: string; eyebrow: string }` field to `PriorityCard` and let `variants.ts` attach it from `data.observations`. That way `PriorityModule` doesn't need to know about the lookup map.

### Settings — let users disable it

Some users will find AI-generated dashboard observations creepy or noisy. Add a single toggle to `/account/settings`:

```
[ ] Show Coach Kairos observations on my dashboard
    Costs nothing extra. Toggle off if it feels too much.
```

Default: ON for Pro users, ON for free users (we already pay the LLM cost on cron, no per-render cost).

### Tests

- Unit test: nudge renders inside priority module when `card.nudge` is set
- Integration: cron route is gated by `Authorization: Bearer CRON_SECRET`
- Cost-cap test: cron skips students with hash-unchanged context

### Acceptance criteria

- [ ] Migration `cc_dashboard_observations` applied
- [ ] Cron entry added to `vercel.json` (daily at 04:07 UTC)
- [ ] `/api/cron/generate-observations` route generates ≤4 observations per student per run
- [ ] Hash-based skip prevents regeneration when context hasn't changed
- [ ] PriorityModule renders nudge in gold callout below the main widget
- [ ] User toggle in `/account/settings` disables both display and generation
- [ ] First-week production cost stays under $50

### Risk & mitigation

| Risk | Mitigation |
|---|---|
| Generic outputs ("Keep up the great work!") | Strict system prompt + 25-word cap + specificity examples; reject and re-prompt if output contains banned phrases |
| Cost runaway | Hard cap on calls per student per day + hash-skip on unchanged context + alarm on daily spend > $20 |
| Stale observations after data changes | TTL 7 days, but ALSO invalidate on key events (essay phase change, school status change) — add a server-side trigger to `expires_at = now()` |
| Privacy | Observations are stored per-student behind RLS; never logged externally; never shared in counselor share-link surface (default off) |

---

## Recommended order of operations

1. **Ship 2.6.A (aid comparator) first** — schema's already there, smallest surface area, immediate win for the senior_decisions persona that converts to Pro.
2. **Then 2.6.B (articulation)** if/when transfer applicants become a meaningful share of users.
3. **Defer 2.7 (Coach's nudge) until** the platform has consistent dashboard data per user (e.g., 80% of seniors have logged ≥3 schools, ≥1 essay, ≥3 activities). Otherwise the nudges have nothing specific to say and degrade to generic.

If you only have time for one phase, do **2.6.A**. It's the highest-impact-per-engineering-hour because the schema is already in place.

---

## Out of scope for both phases

- Replacing the chat coach drawer
- Adding observations to the Sidebar or CommandPalette
- Per-language observations (English only for Phase 2.7; multilingual is a separate project)
- Real-time observation regeneration on data change (only daily cron + key-event invalidation)
