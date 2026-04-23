# KairosLearn Design Phases 2-4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt the KairosLearn design bundle across three product surfaces — Dashboard (Phase 2), Essay Studio + Coach Drawer (Phase 3), School Row + Chance badges (Phase 4) — by applying tokenized component styles derived from the design preview files.

**Architecture:** Phase 1 established `--kl-*` tokens and surface wrappers. Phases 2-4 build on that foundation by:
1. Adding new component utility classes to `src/app/tokens.css` (`.kl-chip*`, `.kl-card-primary`, `.kl-coach-*`, `.kl-chance-*`).
2. Refactoring existing TSX components to apply the new classes + verbatim design bundle layouts.
3. Zero new services, zero LLM calls, zero migrations.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 4, TypeScript 5, Vitest, Playwright 1.x.

**Design bundle source of truth:** `docs/superpowers/designs/kairoslearn-design-system/project/`

---

## File structure

**New / modified across all three phases:**

| File | Phase | Change |
|------|-------|--------|
| `src/app/tokens.css` | 2, 3, 4 | Append component utility class block (~80 lines) |
| `src/app/cc/page.tsx` | 2 | Apply `.kl-card-primary` to tool grid; wire stats strip |
| `src/components/layout/TopNav.tsx` | 2 | Autosave indicator + breadcrumb adjustment |
| `src/components/cc/ChipBar.tsx` | 2 | NEW — chip filter row |
| `src/components/cc/essay/EssayStepper.tsx` | 3 | Apply stepper pill radii + connector line styles |
| `src/components/ai/AICoach.tsx` | 3 | Coach avatar + bubble styling |
| `src/components/cc/SchoolCard.tsx` | 4 | School row layout (icon left, meta center, badge right) |
| `src/components/cc/ChanceBadge.tsx` | 4 | NEW — reach/match/safety badge |

(Exact paths verified at task time via Glob — report at head of each task.)

---

## Shared foundation — Phase 2 Task 1 (runs first, blocks rest)

### Task 2-1: Append component utility classes to `src/app/tokens.css`

**Files:**
- Modify: `src/app/tokens.css` (append block after existing `.kl-surface-app` section)

- [ ] **Step 1: Append utility block**

Add exactly this block at the end of `src/app/tokens.css` (before EOF, after the last existing rule):

```css
/* =========================================================================
 * Phase 2-4 — component utilities (chipbar, cards, coach, chance badges)
 * Derived from docs/superpowers/designs/kairoslearn-design-system/project/preview/
 * ========================================================================= */

/* Chip base — used by topbar filters, phase chips, deadline chips */
.kl-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--kl-radius-full);
  font-size: 11px;
  font-weight: 500;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  transition: background var(--kl-dur-fast, 150ms) ease-out,
              border-color var(--kl-dur-fast, 150ms) ease-out,
              color var(--kl-dur-fast, 150ms) ease-out;
  cursor: pointer;
  user-select: none;
}
.kl-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}
.kl-chip.is-active {
  background: var(--kl-gold-app);
  border-color: rgba(212, 175, 55, 0.3);
  color: #000;
}
.kl-chip.is-active:hover {
  background: var(--kl-gold-hover-app, #C4A030);
  color: #000;
}

/* Primary surface card — tool grid, dashboard modules */
.kl-card-primary {
  background: var(--kl-app-card, #141414);
  border: 1px solid var(--kl-app-border, rgba(255, 255, 255, 0.08));
  border-radius: var(--kl-radius-2xl, 16px);
  padding: var(--kl-s-5, 20px);
  transition: border-color var(--kl-dur-fast, 150ms) ease-out,
              transform var(--kl-dur-fast, 150ms) ease-out;
}
.kl-card-primary:hover {
  border-color: var(--kl-app-gold-edge, rgba(212, 175, 55, 0.22));
}
.kl-card-primary .kl-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(212, 175, 55, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--kl-gold-app, #D4AF37);
  margin-bottom: 12px;
}

/* Coach Drawer — avatar + bubbles */
.kl-coach-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--kl-radius-full);
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--kl-gold-app, #D4AF37);
  flex-shrink: 0;
  font-family: var(--kl-font-sans, Inter, sans-serif);
}
.kl-coach-bubble {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 14px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.55;
  max-width: 440px;
}
.kl-coach-bubble.kl-coach-ai {
  border-top-left-radius: 4px;
}
.kl-coach-bubble.kl-coach-user {
  background: rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.3);
  border-top-right-radius: 4px;
  color: #f0ece2;
  margin-left: auto;
  max-width: 360px;
}

/* Chance badges — reach / match / safety */
.kl-chance {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px;
  border-radius: var(--kl-radius-full);
  font-size: 11px;
  font-weight: 500;
  border: 1px solid transparent;
  font-family: var(--kl-font-sans, Inter, sans-serif);
}
.kl-chance-reach {
  color: var(--kl-state-reach, #f87171);
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}
.kl-chance-match {
  color: var(--kl-state-match, #4ade80);
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.3);
}
.kl-chance-safety {
  color: var(--kl-state-safety, #60a5fa);
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}
.kl-chance-unknown {
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

/* School row container */
.kl-school-row {
  background: var(--kl-app-card, #141414);
  border: 1px solid var(--kl-app-border, rgba(255, 255, 255, 0.08));
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color var(--kl-dur-fast, 150ms) ease-out;
}
.kl-school-row:hover {
  border-color: var(--kl-app-gold-edge, rgba(212, 175, 55, 0.22));
}

/* Stepper — essay studio */
.kl-stepper {
  display: flex;
  align-items: center;
  gap: 4px;
}
.kl-stepper-step {
  width: 24px;
  height: 24px;
  border-radius: var(--kl-radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.4);
  border: 1px solid transparent;
  transition: all var(--kl-dur-fast, 150ms) ease-out;
  flex-shrink: 0;
}
.kl-stepper-step.is-done,
.kl-stepper-step.is-active {
  background: var(--kl-gold-app, #D4AF37);
  color: #000;
}
.kl-stepper-connector {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 4px;
  min-width: 12px;
}
.kl-stepper-connector.is-done {
  background: var(--kl-gold-app, #D4AF37);
}
```

- [ ] **Step 2: Verify and commit**

```bash
pnpm lint
git add src/app/tokens.css
git commit -m "feat(design): add component utility classes for phases 2-4 (chip/card/coach/chance/stepper)"
```

Expected lint: pass (CSS not linted; eslint skips).

---

## Phase 2 — Dashboard chipbar + stats strip + tool grid

### Task 2-2: Apply `.kl-card-primary` to dashboard tool grid

**Files:**
- Modify: `src/app/cc/page.tsx` (tool grid render block)

- [ ] **Step 1: Locate the tool grid**

Run `grep -n "TOOLS\|tool.*\.map\|grid-cols" src/app/cc/page.tsx` to find the grid render.

- [ ] **Step 2: Replace classes**

Replace the per-card container `className` with `kl-card-primary group relative block` (keep any event handlers / aria). Inside each card, wrap the icon in `<div className="kl-card-icon">{icon}</div>` and drop any custom inline dark-card background/border/radius/padding that's now in the utility class.

- [ ] **Step 3: Smoke test**

`pnpm dev` → open `/cc` → visually verify cards still render, hover reveals gold edge (ok if screenshot already matched). Confirm no TS errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/cc/page.tsx
git commit -m "feat(dashboard): apply kl-card-primary to tool grid"
```

### Task 2-3: Dashboard stats strip

**Files:**
- Modify: `src/app/cc/page.tsx` — add `<StatsStrip />` above tool grid (if not already)
- Possibly modify: `src/components/cc/StatsStrip.tsx` if it exists, else inline a small block with 3-4 stat tiles using `.kl-card-primary` compact variant.

- [ ] **Step 1: Discover existing stats component**

`grep -rn "StatsStrip\|stats-strip\|\"Schools\"\|\"XP\"" src/components/cc/ src/app/cc/` — identify any existing stat tile component.

- [ ] **Step 2: Apply design styling**

If an existing component exists, wrap each tile in `kl-card-primary` and apply `kl-eyebrow` / `kl-mono` classes for label/value. If none, create `src/components/cc/dashboard/StatsStrip.tsx` with 3 tiles: School list count, Essays in progress, Interview sessions. Pull counts via existing dashboard data fetch (do NOT add new queries).

- [ ] **Step 3: Commit**

```bash
git add src/components/cc/dashboard/StatsStrip.tsx src/app/cc/page.tsx
git commit -m "feat(dashboard): stats strip using kl-card-primary"
```

### Task 2-4: ChipBar component (filterable phase chips)

**Files:**
- Create: `src/components/cc/ChipBar.tsx`
- Modify: `src/app/cc/page.tsx` (inject `<ChipBar />` above tool grid)

- [ ] **Step 1: Write `src/components/cc/ChipBar.tsx`**

```tsx
"use client";

import { useState } from "react";

export type ChipOption<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

export function ChipBar<T extends string>({
  options,
  active,
  onChange,
  className = "",
}: {
  options: ChipOption<T>[];
  active: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} role="tablist">
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`kl-chip${isActive ? " is-active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <span>{opt.label}</span>
            {typeof opt.count === "number" && (
              <span className="opacity-70">· {opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Wire into dashboard**

Above the tool grid, add:

```tsx
const [phase, setPhase] = useState<"all" | "brainstorm" | "outline" | "draft" | "revise">("all");
// ...
<ChipBar
  options={[
    { value: "all", label: "All", count: TOOLS.length },
    { value: "brainstorm", label: "Brainstorm" },
    { value: "outline", label: "Outline" },
    { value: "draft", label: "Draft" },
    { value: "revise", label: "Revise" },
  ]}
  active={phase}
  onChange={setPhase}
  className="mb-4"
/>
```

Filter the `TOOLS.map` render by `phase === "all" || tool.phase === phase` if TOOLS has a `phase` field. If not, leave filter as always-true and just surface the chip UI visually (cosmetic filtering can come later).

- [ ] **Step 3: Test**

Vitest snapshot (if present) + render check via `pnpm dev`.

- [ ] **Step 4: Commit**

```bash
git add src/components/cc/ChipBar.tsx src/app/cc/page.tsx
git commit -m "feat(dashboard): ChipBar filter above tool grid"
```

### Task 2-5: TopNav autosave indicator

**Files:**
- Modify: `src/components/layout/TopNav.tsx`

- [ ] **Step 1: Read current TopNav**

`Read src/components/layout/TopNav.tsx` (lines 1-120). Identify where to inject a small autosave row (right side, before user menu).

- [ ] **Step 2: Add autosave indicator**

```tsx
<span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] text-white/50">
  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
  saved
</span>
```

Place it right-aligned within the TopNav row, before the avatar / user menu. Only render on `/cc` pathname.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/TopNav.tsx
git commit -m "feat(topnav): autosave indicator on /cc surface"
```

---

## Phase 3 — Essay Studio stepper + Coach Drawer

### Task 3-1: Apply stepper styling to `EssayStepper`

**Files:**
- Modify: `src/components/cc/essay/EssayStepper.tsx` (path verified at task time via Glob)

- [ ] **Step 1: Locate file**

```bash
Glob: **/EssayStepper.tsx
Grep: "Stepper" path=src/components/cc/
```

- [ ] **Step 2: Refactor render**

Replace step pills with:

```tsx
<ol className="kl-stepper" aria-label="Essay progress">
  {steps.map((step, i) => {
    const done = i < currentIndex;
    const active = i === currentIndex;
    const stateClass = done ? "is-done" : active ? "is-active" : "";
    return (
      <li key={step.id} className="flex items-center">
        <span
          className={`kl-stepper-step ${stateClass}`}
          aria-current={active ? "step" : undefined}
        >
          {done ? "✓" : String(i + 1).padStart(2, "0")}
        </span>
        {i < steps.length - 1 && (
          <span className={`kl-stepper-connector ${done ? "is-done" : ""}`} aria-hidden />
        )}
      </li>
    );
  })}
</ol>
```

Keep text labels below the pills via a sibling row if the current component renders them — wrap the whole block in a `<div className="flex flex-col gap-2">`.

- [ ] **Step 3: Snapshot + commit**

```bash
pnpm test:unit -- --run EssayStepper 2>&1 | tail -20
git add src/components/cc/essay/EssayStepper.tsx
git commit -m "feat(essay): apply kl-stepper design system to EssayStepper"
```

### Task 3-2: Coach Drawer — avatar + bubble styling

**Files:**
- Modify: `src/components/ai/AICoach.tsx` (path verified)

- [ ] **Step 1: Read AICoach to find message render**

`Read src/components/ai/AICoach.tsx` — identify where coach vs user messages are rendered.

- [ ] **Step 2: Apply bubble classes**

In message render:

```tsx
{messages.map((m) => (
  <div key={m.id} className={`flex items-start gap-2 mb-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
    {m.role === "coach" && <span className="kl-coach-avatar" aria-hidden>K</span>}
    <div className={`kl-coach-bubble ${m.role === "user" ? "kl-coach-user" : "kl-coach-ai"}`}>
      {m.text}
    </div>
  </div>
))}
```

Keep streaming cursor logic intact; just wrap text in the new bubble classes.

- [ ] **Step 3: Commit**

```bash
git add src/components/ai/AICoach.tsx
git commit -m "feat(coach): apply kl-coach-* bubble + avatar styling"
```

---

## Phase 4 — School row + chance badges

### Task 4-1: Create `ChanceBadge` component

**Files:**
- Create: `src/components/cc/ChanceBadge.tsx`

- [ ] **Step 1: Write component**

```tsx
export type ChanceTier = "reach" | "match" | "safety" | "unknown";

const LABELS: Record<ChanceTier, string> = {
  reach: "Reach",
  match: "Match",
  safety: "Safety",
  unknown: "—",
};

export function ChanceBadge({ tier, className = "" }: { tier: ChanceTier; className?: string }) {
  return (
    <span className={`kl-chance kl-chance-${tier} ${className}`} aria-label={`Chance tier: ${LABELS[tier]}`}>
      {LABELS[tier]}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/ChanceBadge.tsx
git commit -m "feat(schools): ChanceBadge reach/match/safety component"
```

### Task 4-2: Refactor SchoolCard → school-row layout

**Files:**
- Modify: `src/components/cc/SchoolCard.tsx` (path verified)

- [ ] **Step 1: Read current SchoolCard**

- [ ] **Step 2: Refactor to row layout**

Apply `.kl-school-row` wrapper with:
- Left: 36px icon + flex-col with name (13px semibold) + meta row (11px gray: location · type · accept rate · net price)
- Right: `<ChanceBadge tier={tier} />` + optional remove button

Preserve any existing click handler / Link wrapping. Keep `aid_warning` badge from Section 2 intact — render above the chance badge if present.

- [ ] **Step 3: Smoke test**

`pnpm dev` → `/schools` → confirm rows render with icons, metadata, chance tier.

- [ ] **Step 4: Commit**

```bash
git add src/components/cc/SchoolCard.tsx
git commit -m "feat(schools): refactor SchoolCard to kl-school-row layout with chance badge"
```

### Task 4-3: Wire ChanceBadge into schools browse + my-list

**Files:**
- Modify: `src/app/schools/page.tsx`

- [ ] **Step 1: Locate school list render**

- [ ] **Step 2: Import and use ChanceBadge**

Import `ChanceBadge` and infer the tier from existing `chancing` data (reach/match/safety based on `admit_probability` thresholds: <20% = reach, 20-60% = match, >60% = safety, else unknown). If a chance value already lives in data, map it directly.

- [ ] **Step 3: Commit**

```bash
git add src/app/schools/page.tsx
git commit -m "feat(schools): render ChanceBadge in list + browse"
```

---

## Task final: Cross-phase verification + merge

- [ ] **Step 1: Run all checks**

```bash
pnpm lint
pnpm test:unit
```

Expected: both pass.

- [ ] **Step 2: Visual walkthrough**

`pnpm dev`:
1. `/cc` — chipbar visible, cards use kl-card-primary hover
2. `/cc/essays/<id>` — stepper pills gold on active, coach bubbles have cutout corners
3. `/schools` — school rows render, chance badges colored correctly

- [ ] **Step 3: Final summary commit** (if any loose edits)

```bash
git status
# if any loose edits
git add -A
git commit -m "chore(design): final cleanup for phases 2-4"
```

---

## Self-review notes

- **Design coverage:** Every component class from the preview bundle is represented (`components-chips`, `components-card-primary`, `components-coach-bubble`, `components-progress`, `components-school-row`, `colors-semantic-chancing`).
- **No placeholders:** Every step has concrete code or a specific command.
- **Type consistency:** `ChanceTier` and `ChipOption` types exported from their component files.
- **Commit granularity:** One commit per task. If a task fails mid-execution, the prior commits survive unblocking resumption.

## Execution handoff

Plan complete. Execute via **superpowers:subagent-driven-development** — fresh subagent per task, two-stage review (spec compliance then code quality), mark TaskList entry complete after each.
