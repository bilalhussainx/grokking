# Handoff Phase 2 — Adaptive Dashboard Refactor

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `src/app/cc/dashboard/AdaptiveDashboard.tsx` to match the visual treatment in `docs/superpowers/designs/handoff/src/dashboard.jsx` while keeping the existing live-data flow (DashboardData / variants.ts) intact.

**Architecture:** Split the monolithic dashboard into 5 small composable sub-components (HeroCard, PriorityModule, Tile, WidgetStrip, Greeting) that lift the handoff's visual treatment exactly — gold-edged hero with optional rose-tone urgency, gold-bordered priority modules with icon-tile + title + content + footer CTA, locked-state tiles, mono-numeral widget strip. Wire each to the existing `Variant` shape from variants.ts (no data-layer changes). Keep all existing wiring: coach.openWithVariant, ?blocked=grade9 banner, in-place coach CTAs.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, the kairos-tokens.css design tokens just shipped in Phase 1, lucide-react icons.

**Scope boundary:** Pixel-perfect *visual* match to the handoff. The handoff's per-variant bespoke content (SAT bar charts, "Coach noticed" callout quotes, decision tracker mini-charts) is **not** in scope here — those need richer data than DashboardData currently provides. The hero, priority cards, tiles, widget strip use real live data via the existing variants.ts.

---

## Task 1: Extend Variant types in `variants.ts`

**Files:**
- Modify: `src/app/cc/dashboard/variants.ts` — add new optional fields

The handoff hero supports a rose tone for deadline urgency (the senior_writing "MIT EA in 8 days" hero) and an optional urgency block on the right with mono number + label. The footer also has a widget strip with 4 numeric widgets per variant.

- [ ] **Step 1: Extend the Hero type with optional urgency + tone fields.**
  ```typescript
  export type Hero = {
    eyebrow: string;
    headline: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    urgent?: boolean;           // existing
    detail?: string;             // NEW — long-form caption below the body
    ctaTone?: "gold" | "rose";   // NEW — drives the visual treatment
    urgency?: { value: string; label: string }; // NEW — right-side mono pill
  };
  ```

- [ ] **Step 2: Add a `statusTone` + `widgets` field to Variant.**
  ```typescript
  export type Variant = {
    hero: Hero;
    priority: PriorityCard[];
    tiles: Tile[];
    statusTone?: "gold" | "leaf" | "sky" | "rose"; // NEW — matches design tokens
    widgets?: Array<{ n: string; label: string; tone?: "gold"; delta?: string }>; // NEW
  };
  ```

- [ ] **Step 3: Populate the new fields per variant in `buildVariant()`.** Use the handoff's `dashboard.jsx` values as the source.
  - g9: statusTone="leaf", widgets=[XP, streak, courses, activities]
  - g10: statusTone="sky", widgets=[PSAT target, weeks until, courses, activities]
  - junior: statusTone="gold", widgets=[days to common app, streak, schools, activities]
  - senior_writing: statusTone="gold", widgets=[apps in flight, submitted, streak, cycle %]
  - senior_post_submit: statusTone="leaf", widgets=[admits, pending, best aid, commit by]
  - senior_decisions: statusTone="leaf"
  - transfer: statusTone="sky"

- [ ] **Step 4: For senior_writing's urgent variant, set `ctaTone: "rose"` + populate `urgency`.**
  ```typescript
  // inside pickHero for the urgent-deadline branch:
  return {
    eyebrow: "Urgent",
    headline: `${schoolName} ${key} deadline in <em>${days} days</em>.`,
    body: "Open the application board, ...",
    ctaLabel: "Open Applications →",
    ctaHref: "/applications",
    urgent: true,
    ctaTone: "rose",
    urgency: { value: `${days}d`, label: `until ${schoolName}` },
  };
  ```

- [ ] **Step 5: Run unit tests.** `npx vitest run src/app/cc/dashboard/__tests__/variants.test.ts` — should still pass (new fields are optional).

- [ ] **Step 6: Commit.**
  ```bash
  git add src/app/cc/dashboard/variants.ts
  git commit -m "feat(dashboard): extend Variant with statusTone, widgets, hero.urgency"
  ```

---

## Task 2: Build sub-components

**Files:**
- Create: `src/components/cc/dashboard/HeroCard.tsx`
- Create: `src/components/cc/dashboard/PriorityModule.tsx`
- Create: `src/components/cc/dashboard/Tile.tsx`
- Create: `src/components/cc/dashboard/WidgetStrip.tsx`
- Create: `src/components/cc/dashboard/Greeting.tsx`

### Task 2a: HeroCard

- [ ] **Step 1: Create `src/components/cc/dashboard/HeroCard.tsx`.** Port the handoff's HeroCard component, replacing inline-style with same inline-style for fidelity (the handoff uses inline styles deliberately for portability). Accept `tone: "gold" | "rose"`, optional urgency block, optional detail line. Render two CTAs: primary (gold/rose-tinted with arrow) and ghost ("Snooze 24h" → optional onClick).

### Task 2b: PriorityModule

- [ ] **Step 2: Create `src/components/cc/dashboard/PriorityModule.tsx`.** Card with icon-tile (28×28 gold-bg) + title + subtitle + content slot + dashed-border footer CTA. The content slot renders whatever the variant feeds it — typically the existing `valueKind=num/text` + meta string from PriorityCard.

### Task 2c: Tile

- [ ] **Step 3: Create `src/components/cc/dashboard/Tile.tsx`.** 14px-radius card, 26×26 icon tile, label + caption, locked state (opacity .5, lock icon top-right, cursor not-allowed). Hover transitions border + background to gold tints. Accepts an optional `onClick` for the coach-drawer rows.

### Task 2d: WidgetStrip

- [ ] **Step 4: Create `src/components/cc/dashboard/WidgetStrip.tsx`.** Horizontal grid of N widgets, separated by 1px right-borders. Each: mono number (gold if `tone='gold'`) + uppercase label + optional delta in green/red.

### Task 2e: Greeting

- [ ] **Step 5: Create `src/components/cc/dashboard/Greeting.tsx`.** Eyebrow ("Good morning") + Cormorant Garamond name in 34px + right-side date + tinted status pill (color from statusTone token).

### Task 2f: Type-check

- [ ] **Step 6: `npx tsc --noEmit`** — should be clean (only the existing unrelated e2e error).

---

## Task 3: Replace AdaptiveDashboard.tsx body

**Files:**
- Modify: `src/app/cc/dashboard/AdaptiveDashboard.tsx`
- Modify: `src/app/cc/dashboard/dashboard.css` (or remove — sub-components own their styles)

- [ ] **Step 1: Replace the JSX in AdaptiveDashboard.tsx** to use the new sub-components in this order:
  1. The g9-blocked banner (existing, keep)
  2. `<Greeting>` (eyebrow + name + status pill)
  3. `<HeroCard>` with the existing variant.hero data + new tone/urgency/detail fields
  4. **Section heading** "Priority this week" (the SectionHead pattern from handoff)
  5. `<PriorityModule>` grid (1 column for unknown, 2 for transfer/senior_post_submit, 3 for everyone else)
  6. **Section heading** "Explore"
  7. `<Tile>` grid (3 columns on desktop, 6 in 2-row layout matching handoff)
  8. `<WidgetStrip>` (only when variant.widgets exists)
  9. The existing footer info bar can go away — replaced by widget strip

- [ ] **Step 2: Keep ALL existing wiring**:
  - `coach.openWithVariant(variantKey)` on hero ghost button + tile/priority coach links
  - `useCoachKairos().setVariantKey(variantKey)` on mount/unmount
  - The `?blocked=grade9` redirect banner

- [ ] **Step 3: Drop or repurpose `dashboard.css`.** With sub-components owning their own styles, the old global classes `.kl-dash *` aren't needed. Either delete the file (cleanest) or leave only the keyframes (we have one — the urgent deadline pulse).

- [ ] **Step 4: `npx tsc --noEmit`** — should be clean.

- [ ] **Step 5: Commit.**
  ```bash
  git add src/app/cc/dashboard/AdaptiveDashboard.tsx src/components/cc/dashboard/ src/app/cc/dashboard/dashboard.css
  git commit -m "feat(dashboard): match handoff visual treatment via sub-components"
  ```

---

## Task 4: Update tests for the new fields

**Files:**
- Modify: `src/app/cc/dashboard/__tests__/variants.test.ts`

- [ ] **Step 1: Add a test asserting statusTone is set per variant.**
  ```typescript
  it("populates statusTone per variant", () => {
    expect(buildVariant("g9", baseData).statusTone).toBe("leaf");
    expect(buildVariant("g10", baseData).statusTone).toBe("sky");
    expect(buildVariant("junior", baseData).statusTone).toBe("gold");
    expect(buildVariant("senior_writing", baseData).statusTone).toBe("gold");
    expect(buildVariant("senior_post_submit", baseData).statusTone).toBe("leaf");
    expect(buildVariant("transfer", baseData).statusTone).toBe("sky");
  });
  ```

- [ ] **Step 2: Add a test for hero ctaTone + urgency on the urgent-deadline branch.**
  ```typescript
  it("urgent deadline hero uses rose tone + urgency block", () => {
    const v = buildVariant("senior_writing", {
      ...baseData,
      urgentDeadlineCount: 2,
      nextDeadline: { schoolName: "MIT", key: "EA", date: "2026-11-01", days: 8 },
    });
    expect(v.hero.ctaTone).toBe("rose");
    expect(v.hero.urgency).toBeTruthy();
    expect(v.hero.urgency?.value).toBe("8d");
  });
  ```

- [ ] **Step 3: Add a test that widgets are populated.**
  ```typescript
  it("populates 4 widgets per variant", () => {
    expect(buildVariant("g9", baseData).widgets?.length).toBe(4);
    expect(buildVariant("senior_writing", baseData).widgets?.length).toBe(4);
  });
  ```

- [ ] **Step 4: `npx vitest run src/app/cc/dashboard/__tests__/variants.test.ts`** — all green.

- [ ] **Step 5: Commit + push.**
  ```bash
  git add src/app/cc/dashboard/__tests__/variants.test.ts
  git commit -m "test(dashboard): cover new hero.urgency, statusTone, widgets fields"
  git push origin master
  ```

---

## Self-review notes

- **Why not import the handoff JSX directly?** The handoff uses inline `<svg>` paths and `window` exports — works for static previews but not in our Next.js + lucide-react stack. Faithful port is the only path.
- **Why split into sub-components?** Single 800-line file would be unreviewable and untestable. Smaller files = focused responsibilities + easier to unit-test individual visual treatments later.
- **What about the rich per-variant bespoke content** (SAT bar charts, "Coach noticed" quotes, decision tracker mini-charts)? Out of scope — they need richer data than DashboardData currently provides. The structure exposes them as priority module `children` content — when we wire the data sources we'll populate them per-variant.
- **The handoff `<DashTop>` component (chip nav with Home/Apps/Schools/Essays/Aid/Coach)** — that's redundant with the new Sidebar (Phase 1) which already exposes those routes. Skip it.
