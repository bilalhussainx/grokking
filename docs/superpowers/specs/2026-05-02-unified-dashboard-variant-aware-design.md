# Unified Variant-Aware Dashboard — Design Spec

**Date:** 2026-05-02
**Status:** Implemented behind `?dashboard=v2` flag (2026-05-02). 22 atomic commits, 238/238 tests passing. Plan: `docs/superpowers/plans/2026-05-02-unified-dashboard-implementation.md`. Rollback: remove `?dashboard=v2` from URL — instant fallback to legacy handoff dashboard, no deploy required.
**Successor to:** Phase 2 (handoff visual treatment) and Phase 2.5 (per-variant priority module content) — both rolled back as design choices in favor of this unified approach
**Predecessor file kept verbatim:** `src/components/cc/dashboard/CounselorDashboard.tsx` — preserved untouched as a rollback target

---

## 1. Goal

Build a single dashboard at `/cc/dashboard` that:

1. Uses the legacy CounselorDashboard's visual aesthetic — Tailwind glass morphism, framer-motion stagger, glass-card surfaces, lucide icons in gold (`#D4AF37`).
2. Renders different sections (and different content within shared sections) depending on the user's variant: `g9 / g10 / junior / senior_writing / senior_post_submit / senior_decisions / transfer / unknown`.
3. Pulls all data from a single source: `/api/cc/dashboard/summary` (extended additively).
4. Shows up to 4 school cards in 2 rows with a "Manage list" link for variants with schools; replaces that slot with a 4-card course grid for g9/g10 (Option A from brainstorming).
5. Shifts variant-specific priority widgets BELOW the school/course grid.
6. Is composable into small section files so adding a new variant or moving a widget is one config change, not a god-component refactor.
7. Stays one-line-revertable to the original `CounselorDashboard.tsx` if the new design doesn't pan out.

## 2. Architecture

### 2.1 Folder layout

```
src/components/cc/dashboard/
  CounselorDashboard.tsx          ← UNTOUCHED — rollback target
  AdaptiveDashboard.tsx           ← REWRITTEN as the new orchestrator
  sections/
    PriorityBrief.tsx             ← LLM weekly summary card (extracted from CounselorDashboard)
    LoomingDeadlines.tsx          ← Amber deadline strip (extracted from CounselorDashboard)
    SchoolCardGrid.tsx            ← 4-card 2-row school grid + Manage list link (uses CounselorDashboard's existing SchoolCard primitive, also extracted)
    SchoolCard.tsx                ← Per-school card (extracted from CounselorDashboard)
    CourseRigorGrid.tsx           ← NEW: 4-card 2-row course grid for g9/g10
    PSATPlanCard.tsx              ← NEW: PSAT 10 study plan card for g10
    WhyTransferFeatured.tsx       ← NEW: Why-transfer essay featured card for transfer
    PersonalStatementCard.tsx     ← Extracted from CounselorDashboard
    PriorityWidgetRow.tsx         ← NEW: 3-column variant-specific widget row (replaces my deprecated handoff PriorityModule)
    ActivitiesSnapshot.tsx        ← NEW: top-3 activities + count + open optimizer link
    WidgetStripFooter.tsx         ← NEW: 4 mono-numeral footer widgets (restyled glass)
    variant-sections.ts           ← Per-variant ordered section list (the routing config)
```

### 2.2 Variant routing config

```typescript
// src/components/cc/dashboard/sections/variant-sections.ts
export type SectionId =
  | "PriorityBrief" | "LoomingDeadlines" | "SchoolCardGrid"
  | "CourseRigorGrid" | "PSATPlanCard" | "WhyTransferFeatured"
  | "PersonalStatementCard" | "PriorityWidgetRow"
  | "ActivitiesSnapshot" | "WidgetStripFooter";

export const SECTION_ORDER: Record<VariantKey, SectionId[]> = {
  g9: [
    "PriorityBrief", "CourseRigorGrid", "PriorityWidgetRow",
    "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  g10: [
    "PriorityBrief", "PSATPlanCard", "CourseRigorGrid",
    "PriorityWidgetRow", "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  junior: [
    "PriorityBrief", "LoomingDeadlines", "SchoolCardGrid",
    "PriorityWidgetRow", "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  senior_writing: [
    "PriorityBrief", "LoomingDeadlines", "SchoolCardGrid",
    "PersonalStatementCard", "PriorityWidgetRow",
    "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  senior_post_submit: [
    "PriorityBrief", "SchoolCardGrid", "PriorityWidgetRow",
    "ActivitiesSnapshot", "WidgetStripFooter",
  ],
  senior_decisions: [
    "PriorityBrief", "SchoolCardGrid", "PriorityWidgetRow",
    "WidgetStripFooter",
  ],
  transfer: [
    "PriorityBrief", "WhyTransferFeatured", "SchoolCardGrid",
    "PriorityWidgetRow", "WidgetStripFooter",
  ],
  unknown: [
    "PriorityBrief", "WidgetStripFooter",
  ],
};
```

The orchestrator (`AdaptiveDashboard.tsx`) reads the user's `variantKey` from the summary response, looks up the section list, and renders each in order.

### 2.3 Orchestrator skeleton

```typescript
// src/app/cc/dashboard/AdaptiveDashboard.tsx
"use client";
export default function AdaptiveDashboard({ summary }: { summary: DashboardSummary }) {
  const sections = SECTION_ORDER[summary.variantKey] ?? SECTION_ORDER.unknown;
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 pt-12 pb-20">
      <Greeting summary={summary} />
      {sections.map((id) => {
        const Section = SECTION_REGISTRY[id];
        return <Section key={id} summary={summary} />;
      })}
    </div>
  );
}
```

`SECTION_REGISTRY` is a `Record<SectionId, ComponentType<{ summary }>>`. Each section receives the full summary and reads only what it needs. Sections that have nothing to render (e.g. `LoomingDeadlines` with zero urgent schools) return `null`.

## 3. Data layer — single source

### 3.1 Endpoint

`GET /api/cc/dashboard/summary` is the single source for both `/` (legacy CounselorDashboard) and `/cc/dashboard` (new orchestrator). Existing fields are preserved unchanged. New fields are additive so legacy CounselorDashboard reads the same shape.

### 3.2 Extended response shape

```typescript
type DashboardSummary = {
  // ─── Existing ↓ unchanged for legacy `/` compatibility ───
  firstName: string | null;
  brief: string | null;
  schools: SchoolProgress[];
  personalStatement: PersonalStatement | null;
  activities: { logged: number; optimized: number };

  // ─── New ↓ ───
  variantKey: VariantKey;                      // computed via selectVariant() server-side
  statusLabel: string;                          // "Grade 11 · Junior spring · 158d to Common App"
  statusTone: "gold" | "leaf" | "sky" | "rose";
  courses: CourseRow[] | null;                  // CourseRigorGrid (g9, g10)
  psatPlan: PsatPlan | null;                    // PSATPlanCard (g10)
  whyTransferEssay: WhyTransferEssay | null;    // WhyTransferFeatured (transfer)
  priorityWidgets: PriorityWidget[];            // PriorityWidgetRow (3 per variant)
  footerWidgets: WidgetItem[];                  // WidgetStripFooter (4 per variant)
  observations: Record<string, { observation: string; eyebrow: string }>; // Phase 2.7
};
```

### 3.3 Source tables

| Field | Source | New schema needed |
|---|---|---|
| `courses` | `cc_courses` (Feature 11 migration `20260426_features_11_14`) | No |
| `psatPlan` | Static config keyed by date + student's logged study sessions | No (static for v1) |
| `whyTransferEssay` | `cc_essays` where `essay_type = 'why_transfer'` | Add `'why_transfer'` to the existing `essay_type` enum if missing — additive constraint update only |
| `priorityWidgets` | Computed per variant from existing data (essays, schools, test_attempts) | No |
| `footerWidgets` | Counts from existing tables | No |
| `variantKey`, `statusLabel`, `statusTone` | `selectVariant()` from `variants.ts` invoked server-side | No (existing function reused) |
| `observations` | `cc_dashboard_observations` (Phase 2.7, already shipped) | No |

### 3.4 Removed

After this design ships, these become unused and get deleted in the migration's final cleanup commit:

- `src/app/cc/dashboard/page.tsx` server-side Supabase fetch (replaced by client-side fetch of `/api/cc/dashboard/summary`)
- `DashboardData` and `buildVariant`/`buildPriority`/`buildTiles` in `variants.ts` — `selectVariant` survives because the API route reuses it
- The handoff-styled components from Phase 2: `HeroCard.tsx`, `PriorityModule.tsx`, `Tile.tsx`, `WidgetStrip.tsx`, `Greeting.tsx` — superseded by their glass-aesthetic equivalents in `sections/`

`CounselorDashboard.tsx` is **not** in this list. It stays.

## 4. Visual treatment rules

Every new section follows CounselorDashboard's existing primitives:

| Concern | Rule |
|---|---|
| Card surface | `rounded-2xl border border-white/10 bg-[#141414]/60 backdrop-blur-sm`; gold-tinted variant for the priority brief |
| Section eyebrow | `text-[10px] uppercase tracking-wider font-semibold text-white/50` + small lucide icon |
| Motion | `<motion.section>` with `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}` and stagger delay = `0.1 × sectionIndex` |
| Hover (clickable cards) | `hover:border-[#D4AF37]/40` |
| Brand color | `#D4AF37` for accents, `text-white/50` for muted, semantic green/amber/rose for status |
| Typography | Inter app-body, no Cormorant italic, no inline-styled dark panels |

The handoff inline-styled aesthetic from Phase 2 is **not used** in the new design.

## 5. PriorityWidgetRow content per variant

3 columns, glass-card per widget, each with: icon-tile + title + subtitle + content area + optional Coach nudge (from `summary.observations`) + footer "Open →" link.

| Variant | Widget 1 | Widget 2 | Widget 3 |
|---|---|---|---|
| g9 | Course rigor stretch | Summer plan | Major exploration |
| g10 | PSAT prep progress | Summer experience | Activities depth |
| junior | School list balance (reach/match/safety dots) | SAT bars (Reading/Math/Target) | Activities through-line |
| senior_writing | Application tracker top-3 | Supplements progress | PS phase bar |
| senior_post_submit | Decisions tracker | Demonstrated interest log | Plan-B framing |
| senior_decisions | Decisions tracker | Aid comparator | Waitlist |
| transfer | Why-transfer phase | Articulation breakdown | Professor recs |

The widget IDs are declared in `priority-widget-content.ts`; each widget is a small standalone subcomponent inside `PriorityWidgetRow.tsx`.

## 6. Rollback recipe

If the new design doesn't perform:

```bash
# Step 1 — identify the merge commit range that introduced the new sections
git log --oneline --grep="unified dashboard"

# Step 2 — revert the orchestrator + section commits
git revert <commit-range>

# Step 3 — manually edit src/app/cc/dashboard/page.tsx (3 lines) to render
# CounselorDashboard fed by /api/cc/dashboard/summary (the existing endpoint
# works without modification because we only added fields, never removed)
```

`CounselorDashboard.tsx` stays present in the codebase across this entire rollback. The endpoint's new fields are additive, so the legacy component continues reading the original shape unchanged.

## 7. Migration cadence

1. **Behind a flag.** Ship orchestrator + sections; gate via `?dashboard=v2` query param. Default = old AdaptiveDashboard (the handoff-styled one) for now.
2. **Internal QA.** Visit each variant at `/cc/dashboard?dashboard=v2` as test users for g9/g10/junior/senior_writing/senior_post_submit/senior_decisions/transfer.
3. **Flip default to v2** in a single-line PR after approval.
4. **Cleanup commit (≥1 week later, no rollback signals).** Delete deprecated handoff components + `DashboardData` + the server-side fetch. `CounselorDashboard.tsx` stays.

## 8. Acceptance criteria

- [ ] Every variant renders without errors against a real student profile
- [ ] g9 sees CourseRigorGrid in place of SchoolCardGrid
- [ ] g10 sees PSATPlanCard above CourseRigorGrid
- [ ] junior + senior_* + transfer (post-list) see SchoolCardGrid with up to 4 cards in 2 rows + "Manage list" link
- [ ] PriorityWidgetRow always renders below the school/course grid
- [ ] All sections use CounselorDashboard's glass aesthetic (no inline-styled handoff treatment)
- [ ] `/api/cc/dashboard/summary` extended additively — legacy `/` rendering unaffected
- [ ] `CounselorDashboard.tsx` file untouched
- [ ] Rollback recipe documented in this spec is testable
- [ ] All existing 192 tests pass; new tests cover `SECTION_ORDER` config + at least one section's render
- [ ] Type check clean

## 9. Out of scope

- Any aesthetic redesign of the Sidebar or CommandPalette (already shipped)
- Adding new persistent storage (no migrations beyond optional `essay_type` enum extension)
- Mobile responsive layout differences from current CounselorDashboard
- Real-time observation regeneration — Phase 2.7's daily cron remains the only generation path
- A/B telemetry on the v1-vs-v2 flag — manual QA only
