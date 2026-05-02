# Mobile Responsive Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `kairoslearn.com` usable on mobile (iPhone 15 Pro reference, 393×852). Ship a separate mobile renderer for landing, dashboard, and chrome (nav drawer + search sheet + bottom tab bar) below the 1024px breakpoint, leaving the desktop renderer untouched above. Source-of-truth comes from the design handoff at `docs/superpowers/designs/mobile/`.

**Architecture:** A page-level `useMediaQuery('(max-width: 1023.98px)')` switch picks `<MobileLanding>` / `<MobileDashboard>` versus the existing desktop trees. **No fluid responsive** between 393 and 1023 — the design is fixed-width at 393 (the desktop preview is the responsive tier ≥ 1024). The mobile components share data with desktop equivalents (`DASHBOARD_VARIANTS`, `ALL_ITEMS` + `visibleFor`, `PALETTE_DATA` + `filterPalette`) — never fork the data layer; only the layout. Existing v2 dashboard orchestrator (`AdaptiveDashboard.tsx`) and the `/api/cc/dashboard/summary` endpoint are reused as-is.

**Tech Stack:** Next.js 16 App Router, TypeScript 5, Tailwind 4, framer-motion (entry/exit transitions + drawer drag), lucide-react. Existing `tokens.css` extended with two missing keyframes (`sb-pulse`, `sb-blink`) and one mobile-specific safe-area utility. Sidebar drawer parity comes from reusing `Sidebar.tsx`'s existing `ALL_ITEMS` + `visibleFor`.

**Audit anchor:** Out-of-band parallel stream per `docs/superpowers/plans/2026-05-02-strategic-audit-roadmap.md` §"Out-of-band parallel: Mobile Responsive Design." Unblocks phone testing for every audit-derived workstream and addresses the Brampton-ICP-is-phone-first reality.

**Source of truth files (read these before starting):**
- `docs/superpowers/designs/mobile/INDEX.md` — implementation contracts summary
- `docs/superpowers/designs/mobile/landing/landing.html` — landing JSX (1250 lines)
- `docs/superpowers/designs/mobile/dashboard/g11.html` — dashboard JSX (3100 lines, **identical `VARIANTS` object across all 6 variant HTMLs**)
- `docs/superpowers/designs/mobile/nav/g9.html` — drawer JSX
- `docs/superpowers/designs/mobile/nav/g11.html` — search sheet JSX (with "stanford" query state)
- `docs/superpowers/designs/mobile/nav/senior-writing.html` — search sheet in `/` Coach mode
- The reused desktop modules: `src/components/nav/Sidebar.tsx` (`ALL_ITEMS`, `visibleFor`), `src/components/nav/CommandPalette.tsx` (`PALETTE_DATA`, `filterPalette`), `src/app/cc/dashboard/AdaptiveDashboard.tsx`

---

## File map

```
src/hooks/
  useMediaQuery.ts                       ← NEW — generic CSS-mq subscriber
  useMediaQuery.test.tsx                 ← NEW

src/lib/
  device.ts                              ← NEW — isMobileViewport(), MOBILE_BREAKPOINT_PX
  device.test.ts                         ← NEW

src/styles/
  tokens.css                             ← MODIFY — add @keyframes sb-pulse + sb-blink + mobile safe-area utility

src/components/mobile/
  MobileLayout.tsx                       ← NEW — wraps a page in the 393-fixed device frame for mobile
  BottomTabBar.tsx                       ← NEW — 5-tab fixed nav, grade-aware Apply tab
  BottomTabBar.test.tsx                  ← NEW
  MobileDrawer.tsx                       ← NEW — slide-from-left aside + scrim, framer-motion AnimatePresence
  MobileSearchSheet.tsx                  ← NEW — full-viewport search overlay with `/` Coach mode
  MobileCoachSheet.tsx                   ← NEW — bottom sheet wrapping the coach drawer's CoachChat
  CoachFAB.tsx                           ← NEW — 56px gold floating button above tab bar

src/components/mobile/landing/
  MobileLanding.tsx                      ← NEW — single-column landing
  MobileHero.tsx                         ← NEW
  MobileForgottenStudent.tsx             ← NEW
  MobilePipeline.tsx                     ← NEW (5-step vertical timeline)
  MobileTestimonials.tsx                 ← NEW
  MobilePricing.tsx                      ← NEW
  MobileFinalCTA.tsx                     ← NEW
  MobileFooter.tsx                       ← NEW
  MobileLandingMenu.tsx                  ← NEW (full-screen menu overlay)

src/components/mobile/dashboard/
  MobileDashboard.tsx                    ← NEW — orchestrator, mirrors AdaptiveDashboard
  MobileHeader.tsx                       ← NEW (52px sticky)
  MobileGreeting.tsx                     ← NEW
  MobileHero.tsx                         ← NEW (gold-bordered hero card; rose-toned variant for urgent senior_writing)
  MobilePriority.tsx                     ← NEW (full-width priority module — wraps each section in 1-up stack)
  MobileTile.tsx                         ← NEW (2-col tile grid item)
  MobileWidgets.tsx                      ← NEW (horizontal-scroll widget strip)
  MobileSectionHead.tsx                  ← NEW

src/app/page.tsx                         ← MODIFY — viewport switch: MobileLanding vs current desktop landing
src/app/cc/dashboard/page.tsx            ← MODIFY — viewport switch: MobileDashboard vs AdaptiveDashboard
src/components/cc/dashboard/CounselorDashboard.tsx  ← UNTOUCHED (rollback target preserved)
src/app/cc/dashboard/AdaptiveDashboard.tsx          ← UNTOUCHED (desktop orchestrator)

vitest.config.ts                         ← already configured for jsdom (Plan 3 added @testing-library/react)
```

---

## Diagnosis (read before implementing)

### Why a separate renderer, not fluid responsive

The design handoff has zero `@media` queries. Every component is fixed at `width: 393`. The desktop equivalents are fixed at much wider layouts. There's no in-between, on purpose — the team's design conviction (per `INDEX.md`) is that mobile and desktop are sufficiently different surfaces that fluid scaling produces neither. Implementation follows: a page-level switch, two trees, shared data.

### Missing keyframes in handoff

The handoff CSS references `sb-pulse` (waitlist gold dot in drawer) and `sb-blink` (search caret) but never defines them. Add both to `src/styles/tokens.css` as part of Task 1.

### Coach reuse: drawer vs bottom sheet

Desktop's coach is a right-side drawer driven by `CoachKairosContext`. Mobile uses two surfaces:
- `CoachFAB` (56px gold button above the tab bar) → opens `MobileCoachSheet` (bottom sheet)
- `BottomTabBar` Coach tab → also opens `MobileCoachSheet`

The sheet is a thin wrapper that mounts the existing `CoachChat` component (the drawer's body) inside a bottom-sheet container. Coach state stays in `CoachKairosContext`; the sheet is presentation-only.

### Search sheet keyboard handling (gotcha)

Handoff JSX uses a fake `<div>` with blinking-caret span. Production needs:
- Real `<input>` with auto-focus on mount
- Listen for `/` as first character → flip into slash-mode (Ask Coach Kairos)
- iOS visual viewport handling so the footer hint and content don't get hidden behind the keyboard (`window.visualViewport.addEventListener('resize', ...)`)

### Drawer animation

Handoff uses a `window.__drawerEverOpen` global hack to keep DOM mounted across close transitions. Replace with framer-motion `<AnimatePresence>` — that's the React-native pattern.

### `state="empty"` is dead code for 5 of 6 variants

`MobileDashboard`'s `state` prop only branches behavior in g9. For other variants, accept `state` in the API but ignore it. Don't propagate the prop further than necessary.

### Tab labels — INDEX vs source mismatch

INDEX.md says only g9 (locked) and transfer (Why-Transfer) relabel the Apply tab. Source actually also relabels for g10 → "Tests". Source is the truth. Codify all four cases in `tabsFor(grade)` (Task 2).

### Per-variant data is shared with desktop

The handoff embeds a `VARIANTS` object identical across all 6 dashboard files. The desktop dashboard already has this data via the API at `/api/cc/dashboard/summary` (Workstream-pre-shipped). **Do not duplicate the variant config in mobile** — `MobileDashboard` consumes the same `summary: DashboardSummary` via the existing fetch in `AdaptiveDashboard.tsx` pattern.

### Hardcoded "Hi, Bilal" in handoff is dummy data

Don't import the handoff's literal greeting strings. Use `summary.firstName` (real data) + `MobileGreeting`'s time-aware logic identical to desktop's `Greeting.tsx`.

---

## Task 1 — Foundation: useMediaQuery, isMobileViewport, missing keyframes (TDD)

**Files:**
- Create: `src/hooks/useMediaQuery.ts`
- Create: `src/hooks/useMediaQuery.test.tsx`
- Create: `src/lib/device.ts`
- Create: `src/lib/device.test.ts`
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Test for `useMediaQuery`.**

```typescript
// src/hooks/useMediaQuery.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

function Probe({ q }: { q: string }) {
  const matches = useMediaQuery(q);
  return <span data-testid="m">{String(matches)}</span>;
}

describe("useMediaQuery", () => {
  let mockMql: { matches: boolean; addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn>; media: string };
  beforeEach(() => {
    mockMql = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(), media: "" };
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({ ...mockMql, media: q }));
  });

  it("returns false initially when matchMedia.matches is false", () => {
    render(<Probe q="(max-width: 1023.98px)" />);
    expect(screen.getByTestId("m").textContent).toBe("false");
  });

  it("returns true when the media query starts matched", () => {
    mockMql.matches = true;
    render(<Probe q="(max-width: 1023.98px)" />);
    expect(screen.getByTestId("m").textContent).toBe("true");
  });

  it("updates on media-query change events", () => {
    let listener: ((e: { matches: boolean }) => void) | null = null;
    mockMql.addEventListener = vi.fn((evt: string, l: (e: { matches: boolean }) => void) => {
      if (evt === "change") listener = l;
    });
    render(<Probe q="(max-width: 1023.98px)" />);
    expect(screen.getByTestId("m").textContent).toBe("false");
    act(() => listener!({ matches: true }));
    expect(screen.getByTestId("m").textContent).toBe("true");
  });

  it("unsubscribes on unmount", () => {
    const removeSpy = vi.fn();
    mockMql.removeEventListener = removeSpy;
    const { unmount } = render(<Probe q="(max-width: 1023.98px)" />);
    unmount();
    expect(removeSpy).toHaveBeenCalled();
  });

  it("returns false during SSR (no window)", () => {
    // Smoke check — useState init is `false` when window is undefined; the
    // useEffect-based subscription only attaches client-side. Default to false.
    render(<Probe q="(max-width: 1023.98px)" />);
    expect(screen.getByTestId("m").textContent).toMatch(/^(true|false)$/);
  });
});
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Write `useMediaQuery`.**

```typescript
// src/hooks/useMediaQuery.ts
"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
```

- [ ] **Step 4: Test for `device.ts`.**

```typescript
// src/lib/device.test.ts
import { describe, it, expect } from "vitest";
import { MOBILE_BREAKPOINT_PX, MOBILE_MEDIA_QUERY } from "./device";

describe("device constants", () => {
  it("MOBILE_BREAKPOINT_PX = 1024", () => {
    expect(MOBILE_BREAKPOINT_PX).toBe(1024);
  });
  it("MOBILE_MEDIA_QUERY matches the breakpoint with .98 fudge", () => {
    expect(MOBILE_MEDIA_QUERY).toBe("(max-width: 1023.98px)");
  });
});
```

- [ ] **Step 5: Implement `device.ts`.**

```typescript
// src/lib/device.ts
// Single source of truth for the mobile/desktop split. The .98 fudge is
// the standard CSS pattern that avoids the off-by-one between 1023 and
// 1024 in browsers that snap to integer pixel widths.
export const MOBILE_BREAKPOINT_PX = 1024;
export const MOBILE_MEDIA_QUERY = "(max-width: 1023.98px)";
```

- [ ] **Step 6: Add missing keyframes + mobile utilities to `tokens.css`.**

Find `tokens.css` (probably `src/styles/tokens.css` or similar — `grep -rn '@keyframes' src/styles/ src/app/globals.css`). Append:

```css
/* Mobile-handoff keyframes — referenced by the mobile drawer (waitlist
   pulse) and search-sheet input (caret blink). Defined here once so every
   component that uses `animation: sb-pulse ...` works. */
@keyframes sb-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(212, 175, 55, .6); }
  70%  { box-shadow: 0 0 0 8px rgba(212, 175, 55, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
}

@keyframes sb-blink {
  50% { opacity: 0; }
}

/* Mobile safe-area helpers. Used by BottomTabBar (bottom inset) and the
   sticky MobileHeader (top inset) so iOS notch + home indicator don't
   collide with chrome. */
.mobile-safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0); }
.mobile-safe-top    { padding-top:    env(safe-area-inset-top, 0); }
```

- [ ] **Step 7: Run all tests.** `npx vitest run`. Expect previous green count + new tests passing.

- [ ] **Step 8: Commit.**
```bash
git add src/hooks/useMediaQuery.ts src/hooks/useMediaQuery.test.tsx src/lib/device.ts src/lib/device.test.ts src/styles/tokens.css
git commit -m "feat(mobile): foundation — useMediaQuery, device constants, missing keyframes"
```

---

## Task 2 — `BottomTabBar` component + tests

**Files:**
- Create: `src/components/mobile/BottomTabBar.tsx`
- Create: `src/components/mobile/BottomTabBar.test.tsx`

5 tabs: Home / Apply / Search / Coach / Profile. Apply tab is grade-aware (locked g9, "Tests" g10, "Why-Transfer" transfer, "Apply" otherwise).

- [ ] **Step 1: Write failing test.**

```typescript
// src/components/mobile/BottomTabBar.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BottomTabBar from "./BottomTabBar";

describe("BottomTabBar", () => {
  it("shows Apply tab labeled 'Apply' for senior_writing", () => {
    render(<BottomTabBar grade="senior_writing" active="home" onTab={() => {}} />);
    expect(screen.getByText("Apply")).toBeTruthy();
  });
  it("shows Apply tab as locked for g9", () => {
    render(<BottomTabBar grade="g9" active="home" onTab={() => {}} />);
    const apply = screen.getByLabelText(/Apply/);
    expect(apply.getAttribute("aria-disabled")).toBe("true");
  });
  it("relabels Apply tab to 'Tests' for g10", () => {
    render(<BottomTabBar grade="g10" active="home" onTab={() => {}} />);
    expect(screen.getByText("Tests")).toBeTruthy();
  });
  it("relabels Apply tab to 'Why-Transfer' for transfer", () => {
    render(<BottomTabBar grade="transfer" active="home" onTab={() => {}} />);
    expect(screen.getByText("Why-Transfer")).toBeTruthy();
  });
  it("calls onTab with the tab id when a tab is clicked", () => {
    const onTab = vi.fn();
    render(<BottomTabBar grade="senior_writing" active="home" onTab={onTab} />);
    fireEvent.click(screen.getByLabelText(/Search/));
    expect(onTab).toHaveBeenCalledWith("search");
  });
  it("does NOT call onTab for the locked Apply tab in g9", () => {
    const onTab = vi.fn();
    render(<BottomTabBar grade="g9" active="home" onTab={onTab} />);
    fireEvent.click(screen.getByLabelText(/Apply/));
    expect(onTab).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement.**

```typescript
// src/components/mobile/BottomTabBar.tsx
"use client";
import { Home, GraduationCap, Search, MessageSquare, User, Lock } from "lucide-react";
import type { VariantKey } from "@/app/cc/dashboard/variants";

export type TabId = "home" | "apply" | "search" | "coach" | "profile";

interface TabSpec {
  id: TabId;
  label: string;
  icon: typeof Home;
  locked?: boolean;
  lockedCaption?: string;
}

// Grade-aware Apply tab. Source: handoff `tabsFor()` in
// docs/superpowers/designs/mobile/dashboard/g11.html lines ~1276-1330.
function tabsFor(grade: VariantKey): TabSpec[] {
  const home: TabSpec = { id: "home", label: "Home", icon: Home };
  const search: TabSpec = { id: "search", label: "Search", icon: Search };
  const coach: TabSpec = { id: "coach", label: "Coach", icon: MessageSquare };
  const profile: TabSpec = { id: "profile", label: "Profile", icon: User };

  let apply: TabSpec;
  if (grade === "g9") {
    apply = { id: "apply", label: "Apply", icon: GraduationCap, locked: true, lockedCaption: "Unlocks junior year" };
  } else if (grade === "g10") {
    apply = { id: "apply", label: "Tests", icon: GraduationCap };
  } else if (grade === "transfer") {
    apply = { id: "apply", label: "Why-Transfer", icon: GraduationCap };
  } else {
    apply = { id: "apply", label: "Apply", icon: GraduationCap };
  }

  // Grid order: Home / Apply / Search (center) / Coach / Profile.
  return [home, apply, search, coach, profile];
}

export default function BottomTabBar({
  grade,
  active,
  onTab,
}: {
  grade: VariantKey;
  active: TabId;
  onTab: (tab: TabId) => void;
}) {
  const tabs = tabsFor(grade);
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 mobile-safe-bottom z-40"
      style={{
        background: "rgba(5,8,13,.92)",
        backdropFilter: "blur(18px)",
        borderTop: "1px solid rgba(255,255,255,.08)",
      }}
      role="navigation"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5 items-stretch" style={{ height: 60 }}>
        {tabs.map((t) => {
          const isActive = active === t.id;
          const disabled = t.locked === true;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              aria-label={t.locked ? `${t.label} (locked) — ${t.lockedCaption ?? ""}` : t.label}
              aria-disabled={disabled}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (disabled) return;
                onTab(t.id);
              }}
              className={`relative flex flex-col items-center justify-center gap-1 ${
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              style={{
                color: isActive ? "#d4af37" : "rgba(255,255,255,.55)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {isActive && (
                <span
                  aria-hidden
                  className="absolute top-0 rounded-b"
                  style={{ width: 24, height: 2, background: "#d4af37" }}
                />
              )}
              <span className="relative">
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 1.9 : 1.6} />
                {disabled && (
                  <span
                    aria-hidden
                    className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
                    style={{ width: 11, height: 11, background: "#0a0e16", border: "1px solid rgba(212,175,55,.4)" }}
                  >
                    <Lock className="w-[7px] h-[7px] text-[#d4af37]" />
                  </span>
                )}
              </span>
              <span className="text-[10.5px]">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Run tests, expect 6 pass.**

- [ ] **Step 5: Commit.**
```bash
git add src/components/mobile/BottomTabBar.tsx src/components/mobile/BottomTabBar.test.tsx
git commit -m "feat(mobile): BottomTabBar with grade-aware Apply tab"
```

---

## Task 3 — `MobileDrawer` (slide-from-left aside + scrim)

**Files:**
- Create: `src/components/mobile/MobileDrawer.tsx`
- Create: `src/components/mobile/MobileDrawer.test.tsx`

Drawer reuses desktop's `ALL_ITEMS` + `visibleFor` from `Sidebar.tsx` so the mobile drawer is the same IA the audit insisted must populate.

- [ ] **Step 1: Confirm desktop reuse path.**
```bash
grep -n "ALL_ITEMS\|visibleFor" src/components/nav/Sidebar.tsx | head -10
```
Verify both are exported. If not, lift them to a shared module `src/components/nav/sidebar-data.ts` first (one micro-task, ~5 min).

- [ ] **Step 2: Write failing test.** Cases: drawer renders nothing when `open=false`; renders aside + scrim when `open=true`; clicking scrim calls `onClose`; renders Apply / Profile / Tools section headers; for `grade="g9"`, Apply section shows "Unlocks junior year" caption (per handoff `<DrawerSection>`).

- [ ] **Step 3: Implement using framer-motion `AnimatePresence`.**

Key structure (lifted byte-faithfully from handoff `nav/g9.html` lines ~2010-2216):
- Outer `AnimatePresence` mode="wait"
- Two siblings rendered when `open`:
  1. **Scrim** — `motion.div` with `position: fixed inset-0; bg rgba(0,0,0,0.55); backdrop-blur(4px); z-40`. Click → `onClose`. Animate opacity 0→1 over 250ms.
  2. **Aside** — `motion.aside` with `position: fixed top-0 bottom-0 left-0; width: 84vw; max-width: 320px; bg #05080d; z-50; box-shadow 6px 0 30px rgba(0,0,0,0.5)`. Animate `x: -100% → 0` over 280ms with cubic-bezier(.65,0,.35,1).

Inside aside:
- Header (60px): Brand mark left, close button right; `mobile-safe-top` for iPhone notch
- User row: 40px gold avatar + name + grade-line + 14d 🔥 streak pill
- Scrollable section list: pinned "Your dashboard" home row + `Object.entries(visibleFor(grade)).map(...)` — same IA as desktop sidebar
- Footer: 12px JetBrains Mono `v1.0.0` + Sign out, `mobile-safe-bottom`

Each section renders `<DrawerSection>` with:
- Section letter abbreviation (A/P/T) in gold circle
- Section name uppercase tracking-wide
- Items underneath; active item gets `border-left: 3px solid #d4af37; bg: rgba(255,255,255,0.04); color: #fff`
- Section caption italic gold for `g9` Apply: "Unlocks junior year" + muted-italic "Application tools appear when you're ready to apply." (no items rendered)
- Waitlist item gets `animation: sb-pulse 1.6s infinite` when `pulseWaitlist` is true (from Task 1's keyframe)

- [ ] **Step 4: Add swipe-left-to-dismiss gesture.** framer-motion `drag="x"` on the aside with `dragConstraints={{ left: -320, right: 0 }}` and an `onDragEnd` that calls `onClose()` if the drag offset is < -100px.

- [ ] **Step 5: Run tests, expect green.**

- [ ] **Step 6: Commit.**
```bash
git add src/components/mobile/MobileDrawer.tsx src/components/mobile/MobileDrawer.test.tsx
git commit -m "feat(mobile): MobileDrawer slide-from-left with grade-aware IA + swipe dismiss"
```

---

## Task 4 — `MobileSearchSheet` (full-viewport search overlay)

**Files:**
- Create: `src/components/mobile/MobileSearchSheet.tsx`
- Create: `src/components/mobile/MobileSearchSheet.test.tsx`

Reuses `PALETTE_DATA` + `filterPalette` from desktop's `CommandPalette.tsx`.

- [ ] **Step 1: Confirm desktop reuse path.** `grep -n "PALETTE_DATA\|filterPalette\|export" src/components/nav/CommandPalette.tsx | head -10`. Lift to a shared module if not exported.

- [ ] **Step 2: Test cases.**
- Renders `null` when `open=false`
- Auto-focuses the input on mount
- Typing "stanford" filters palette to schools matching
- Typing "/" as first character flips into Coach mode (renders gold helper banner with eyebrow "Asking Coach Kairos" + Cormorant italic 17px echo of query)
- Pressing Enter in Coach mode calls `onSlashCommand(query)` (parent will dispatch to coach drawer)
- Escape key closes the sheet

- [ ] **Step 3: Implement.**

Structure:
- `motion.div` with `position: fixed inset-0; bg #05080d; z-50`. Animate `y: 100% → 0` over 280ms.
- `mobile-safe-top` row with back button + flex `<input>` (real input with `autoFocus`, 42px tall, 10px radius). Border switches to `rgba(212,175,55,.30)` when `query.startsWith("/")`.
- Slash-mode body: gold helper banner + 3 hardcoded "Suggested follow-ups" buttons (lifted from handoff).
- Non-slash body: scrollable list of `groups = filterPalette(query)`. Each group: 10px section header + `<SearchRow>` rows.

Each `<SearchRow>`:
- 36px icon square, label, optional caption, arrow chevron, bottom-divider
- Active row: `border-left: 3px solid #d4af37`

iOS visual viewport handling:
```typescript
useEffect(() => {
  if (typeof window === "undefined" || !window.visualViewport) return;
  const vv = window.visualViewport;
  const onResize = () => {
    if (containerRef.current) {
      containerRef.current.style.height = `${vv.height}px`;
    }
  };
  vv.addEventListener("resize", onResize);
  return () => vv.removeEventListener("resize", onResize);
}, []);
```

Keyboard handling:
- Escape → `onClose()`
- Enter when `query.startsWith("/")` → `onSlashCommand(query.slice(1))` then `onClose()`

- [ ] **Step 4: Footer hint** — absolute-positioned bar `Type / to ask Coach Kairos` with safe-area padding.

- [ ] **Step 5: Run tests + commit.**
```bash
git add src/components/mobile/MobileSearchSheet.tsx src/components/mobile/MobileSearchSheet.test.tsx
git commit -m "feat(mobile): MobileSearchSheet with `/` Coach mode + iOS keyboard handling"
```

---

## Task 5 — `MobileCoachSheet` + `CoachFAB`

**Files:**
- Create: `src/components/mobile/MobileCoachSheet.tsx`
- Create: `src/components/mobile/CoachFAB.tsx`

The coach drawer's `CoachChat` already exists at `src/components/cc/coach/CoachChat.tsx` (Plan 2 Task 7 added the action toast). Mobile reuses this body inside a bottom-sheet container.

- [ ] **Step 1: `CoachFAB`.**

```typescript
// src/components/mobile/CoachFAB.tsx
"use client";
import { GraduationCap } from "lucide-react";

export default function CoachFAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Coach Kairos"
      className="fixed flex items-center justify-center rounded-full mobile-safe-bottom z-30"
      style={{
        right: 14,
        bottom: 78,  // 60 (tab bar) + 18 gap
        width: 52,
        height: 52,
        background: "#d4af37",
        color: "#000",
        boxShadow: "0 12px 32px rgba(212,175,55,.30), 0 4px 12px rgba(0,0,0,.45)",
      }}
    >
      <GraduationCap className="w-6 h-6" strokeWidth={2} />
    </button>
  );
}
```

- [ ] **Step 2: `MobileCoachSheet`.**

Structure:
- `motion.div` portal-rendered at `position: fixed bottom-0 left-0 right-0; bg #0a0e16; rounded-top 20px; z-50`. Animate `y: 100% → 0` over 280ms.
- `dragConstraints={{ top: 0, bottom: 0 }}`, with a 4px gold drag handle at top → drag past 100px closes.
- Height: 78vh (handoff value).
- Body: mounts `<CoachChat>` (existing component). The chat handles its own input/scroll.

Mounting `<CoachChat>` inside the sheet just works because it already uses `useCoachKairos()` for its state. No additional wiring.

- [ ] **Step 3: Test cases.** Renders null when `open=false`; renders CoachChat when `open=true`; drag-down past threshold calls `onClose`.

- [ ] **Step 4: Commit.**
```bash
git add src/components/mobile/CoachFAB.tsx src/components/mobile/MobileCoachSheet.tsx src/components/mobile/MobileCoachSheet.test.tsx
git commit -m "feat(mobile): CoachFAB + MobileCoachSheet bottom sheet wrapping CoachChat"
```

---

## Task 6 — Mobile dashboard sections (Greeting, Hero, Priority, Tile, Widgets, SectionHead)

**Files:** Six new components in `src/components/mobile/dashboard/`.

Each is a mobile-layout adaptation of the desktop section (same data shape, different layout). Reuse `summary: DashboardSummary` from `src/components/cc/dashboard/sections/types.ts`.

- [ ] **Step 1: `MobileSectionHead`** — small uppercase eyebrow row with optional right slot. ~15 lines.

- [ ] **Step 2: `MobileGreeting`** — port `Greeting.tsx` to mobile font scale. Eyebrow + 30px Cormorant name (was 24px desktop) + tone-pill on right.

- [ ] **Step 3: `MobileHero`** — adapted from desktop's `HeroCard.tsx` for the dashboard. Same data (`hero: { eyebrow, headline, subhead, ctaLabel, ctaHref, ctaTone, urgency }`) but **stacked layout** (subhead under headline, CTA full-width). Rose-toned variant when `ctaTone === "rose"` (urgent senior_writing deadline).

- [ ] **Step 4: `MobilePriority`** — full-width card per priority module, 1-up stack. Adapt PriorityModule rendering to read whatever data slice the section needs. Reuses the discriminated union (phaseBar / progressBar / decisionCounts / satBars) from existing `priority` cards. Each renders inline.

- [ ] **Step 5: `MobileTile`** — 2-col grid item (vs desktop's 3- or 6-col). Locked-tile rendering for `g9` reuses the lock-overlay pattern from `BottomTabBar`.

- [ ] **Step 6: `MobileWidgets`** — horizontal-scroll snap (`scroll-snap-type: x mandatory`), 110px min-width per card, tabular-nums numbers in JetBrains Mono. Same data as desktop's `WidgetStripFooter` (`summary.footerWidgets: WidgetItem[]`).

- [ ] **Step 7: Tests.** One `.test.tsx` per component verifying data binding (e.g. `MobileGreeting` renders `summary.firstName`) and key visual constraints (e.g. `MobileWidgets` is horizontally scrollable when count > 3).

- [ ] **Step 8: Commit each component as its own atomic commit.** Six commits:
```bash
git add src/components/mobile/dashboard/MobileSectionHead.tsx
git commit -m "feat(mobile): MobileSectionHead"
# ... and so on
```

---

## Task 7 — `MobileDashboard` orchestrator

**Files:**
- Create: `src/components/mobile/dashboard/MobileDashboard.tsx`
- Create: `src/components/mobile/dashboard/MobileDashboard.test.tsx`

Mirrors `AdaptiveDashboard.tsx` exactly (fetch summary on mount + on `kairos:message-complete` per Plan 2 Task 6) but renders the mobile layout instead.

- [ ] **Step 1: Implement.**

```typescript
// src/components/mobile/dashboard/MobileDashboard.tsx
"use client";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import MobileHeader from "./MobileHeader";
import MobileGreeting from "./MobileGreeting";
import MobileHero from "./MobileHero";
import MobilePriority from "./MobilePriority";
import MobileTile from "./MobileTile";
import MobileWidgets from "./MobileWidgets";
import MobileSectionHead from "./MobileSectionHead";
import BottomTabBar, { type TabId } from "../BottomTabBar";
import MobileDrawer from "../MobileDrawer";
import MobileSearchSheet from "../MobileSearchSheet";
import MobileCoachSheet from "../MobileCoachSheet";
import CoachFAB from "../CoachFAB";
import { SECTION_ORDER } from "@/components/cc/dashboard/sections/variant-sections";
import type { DashboardSummary } from "@/components/cc/dashboard/sections/types";

export default function MobileDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const fetchSummary = useCallback(() => {
    fetch("/api/cc/dashboard/summary")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))))
      .then((d: DashboardSummary) => setSummary(d))
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  // Coach-action refetch (mirrors desktop AdaptiveDashboard).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ extracted?: number; actionKinds?: string[] }>).detail;
      if ((detail?.extracted ?? 0) > 0 || (detail?.actionKinds?.length ?? 0) > 0) {
        fetchSummary();
      }
    };
    window.addEventListener("kairos:message-complete", handler);
    return () => window.removeEventListener("kairos:message-complete", handler);
  }, [fetchSummary]);

  const handleTab = useCallback((id: TabId) => {
    setActiveTab(id);
    if (id === "search") setSearchOpen(true);
    else if (id === "coach") setCoachOpen(true);
    else if (id === "apply") {/* navigate to /applications or /cc/test-strategy per grade */}
    else if (id === "profile") {/* navigate to /profile */}
    // home: stay on dashboard
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-rose-300 text-sm" style={{ background: "#0a0e16" }}>
        Couldn&apos;t load your dashboard: {error}
      </div>
    );
  }
  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e16" }}>
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  const sectionIds = SECTION_ORDER[summary.variantKey] ?? SECTION_ORDER.unknown;
  const priorityIds = sectionIds.filter((id) => id === "PriorityBrief" || id === "LoomingDeadlines" || id === "PSATPlanCard" || id === "PersonalStatementCard" || id === "WhyTransferFeatured" || id === "PriorityWidgetRow");
  const tileIds = sectionIds.filter((id) => id === "SchoolCardGrid" || id === "CourseRigorGrid" || id === "ActivitiesSnapshot");
  const hasFooterWidgets = sectionIds.includes("WidgetStripFooter");

  return (
    <div className="min-h-screen relative" style={{ background: "#0a0e16" }}>
      <MobileHeader
        onMenu={() => setDrawerOpen(true)}
        onSearch={() => setSearchOpen(true)}
      />
      <main className="pb-[88px]">
        <div className="px-4 pt-4 space-y-4">
          <MobileGreeting summary={summary} />
          <MobileHero summary={summary} />
          {priorityIds.length > 0 && <MobileSectionHead>Priorities</MobileSectionHead>}
          {priorityIds.map((id) => (
            <MobilePriority key={id} sectionId={id} summary={summary} />
          ))}
          {tileIds.length > 0 && <MobileSectionHead>More tools</MobileSectionHead>}
          <div className="grid grid-cols-2 gap-2">
            {tileIds.map((id) => (
              <MobileTile key={id} sectionId={id} summary={summary} />
            ))}
          </div>
          {hasFooterWidgets && (
            <>
              <MobileSectionHead>At a glance</MobileSectionHead>
              <MobileWidgets items={summary.footerWidgets} />
            </>
          )}
        </div>
      </main>
      <CoachFAB onClick={() => setCoachOpen(true)} />
      <BottomTabBar grade={summary.variantKey} active={activeTab} onTab={handleTab} />
      <MobileDrawer
        open={drawerOpen}
        grade={summary.variantKey}
        onClose={() => setDrawerOpen(false)}
      />
      <MobileSearchSheet
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSlashCommand={(q) => {
          setSearchOpen(false);
          setCoachOpen(true);
          // Optionally pre-fill the coach with the query — wire via context if you do.
        }}
      />
      <MobileCoachSheet
        open={coachOpen}
        onClose={() => setCoachOpen(false)}
      />
    </div>
  );
}
```

- [ ] **Step 2: Tests.** Verifies orchestrator fetches `/api/cc/dashboard/summary`; renders MobileGreeting + MobileHero + sections; clicking a tab updates `activeTab` and triggers correct overlay; `kairos:message-complete` event with `extracted > 0` triggers refetch (mirrors desktop test).

- [ ] **Step 3: Commit.**
```bash
git add src/components/mobile/dashboard/MobileDashboard.tsx src/components/mobile/dashboard/MobileDashboard.test.tsx
git commit -m "feat(mobile): MobileDashboard orchestrator with chrome (drawer/search/coach/tabs)"
```

---

## Task 8 — `MobileLanding` and its sections

**Files:** 8 components in `src/components/mobile/landing/`.

The mobile landing is a single-column scroll. Sections in order: Hero (with neural canvas + Coach Kairos demo) → Forgotten Student (3 stacked cards) → Pipeline (5-step vertical timeline) → Testimonials (1-up + 2x2 proof grid) → Pricing (2 stacked) → Final CTA → Footer → Menu Overlay.

- [ ] **Step 1: Read** the handoff file `docs/superpowers/designs/mobile/landing/landing.html` end-to-end. Lift each section's JSX byte-faithfully where copy / visual choices are baked in. Replace handoff dummy strings with the real landing copy from the existing desktop landing.

- [ ] **Step 2: `MobileLanding`** is the orchestrator. State: `[menuOpen, setMenuOpen]`.

- [ ] **Step 3: `MobileHero`** — neural canvas (canvas-rendered animated dots, lifted from handoff), 44px Cormorant headline, `<MobileCoachDemo>` widget showing fake transcript.

- [ ] **Step 4: `MobileForgottenStudent`** — 3 stacked cards: International / First-gen / Under-resourced. Each ~120px tall.

- [ ] **Step 5: `MobilePipeline`** — 5-step timeline with 56px badge per step + 1px gold connector at `left: 36px`. Steps from existing desktop landing.

- [ ] **Step 6: `MobileTestimonials`** — 1-up stacked cards on `#0c1120` bg, 2x2 proof grid below.

- [ ] **Step 7: `MobilePricing`** — 2 stacked cards: KairosLearn $10/mo with "Recommended" tag at `top: -12px` + Private counselor $8,000 line-through.

- [ ] **Step 8: `MobileFinalCTA` + `MobileFooter`** — 2-col grid for footer link sections.

- [ ] **Step 9: `MobileLandingMenu`** — full-screen overlay, `transform: translateY(-100% → 0)` over 350ms cubic-bezier(.65,0,.35,1). Items: `["Counselor", "Essays", "Schools", "Pricing", "Stories"]`.

- [ ] **Step 10: Commit each component atomically (8-9 commits).**

---

## Task 9 — Wire viewport switch in app entry points

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/cc/dashboard/page.tsx`

- [ ] **Step 1: `src/app/page.tsx`.** Currently renders the desktop landing. Add the viewport switch at the top of the client component:

```typescript
"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MOBILE_MEDIA_QUERY } from "@/lib/device";
import MobileLanding from "@/components/mobile/landing/MobileLanding";
// ...existing desktop imports

export default function HomePage(/* ...existing props */) {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  if (isMobile) return <MobileLanding />;
  // ...existing desktop tree (unchanged)
}
```

**Constraint:** the existing desktop tree must remain byte-faithful. Wrap it with the conditional, do not refactor.

- [ ] **Step 2: `src/app/cc/dashboard/page.tsx`.** Currently routes between `AdaptiveDashboard` (v2) and `AdaptiveDashboardLegacy` based on `?dashboard=v2`. Extend to also pick mobile.

The page is server-side (auth + onboarding gate). The viewport switch must happen client-side. Solution: render a thin client component that does the switch.

```typescript
// In page.tsx, after auth/onboarding:
return useV2 ? <AdaptiveDashboardClientSwitch /> : <AdaptiveDashboardLegacy />;
```

```typescript
// New file: src/app/cc/dashboard/AdaptiveDashboardClientSwitch.tsx
"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MOBILE_MEDIA_QUERY } from "@/lib/device";
import AdaptiveDashboard from "./AdaptiveDashboard";
import MobileDashboard from "@/components/mobile/dashboard/MobileDashboard";

export default function AdaptiveDashboardClientSwitch() {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  return isMobile ? <MobileDashboard /> : <AdaptiveDashboard />;
}
```

This way the legacy `?dashboard=` (no flag) path is untouched; only `?dashboard=v2` users get the mobile-or-desktop switch.

- [ ] **Step 3: Type-check, smoke-test in dev (Chrome DevTools mobile emulation).**

- [ ] **Step 4: Commit.**
```bash
git add src/app/page.tsx src/app/cc/dashboard/page.tsx src/app/cc/dashboard/AdaptiveDashboardClientSwitch.tsx
git commit -m "feat(mobile): viewport switch on landing + cc/dashboard (gated by ?dashboard=v2)"
```

---

## Task 10 — Hydration smoke test + final verification + push

- [ ] **Step 1: Type-check.** `npx tsc --noEmit`. Only pre-existing e2e error.
- [ ] **Step 2: Tests.** `npx vitest run`. All green; new mobile tests pass.
- [ ] **Step 3: Hydration audit.** Check that `useMediaQuery`'s `useState` initializer (which runs SSR) doesn't cause a hydration mismatch. The pattern returns `false` during SSR (window undefined → useState init returns false) and re-evaluates on the client. This means a desktop user briefly sees the mobile shell during hydration. Acceptable for a redirect-style switch; if it produces flicker, mitigate with:
  ```typescript
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null; // or a neutral skeleton
  return isMobile ? <MobileLanding /> : <DesktopLanding />;
  ```
  Add this if dev testing shows flicker.
- [ ] **Step 4: Manual smoke test in Chrome DevTools.** Toggle device emulation (iPhone 15 Pro 393×852). Test:
  - `/` → mobile landing renders single-column
  - `/cc/dashboard?dashboard=v2` → mobile dashboard renders with bottom tab bar
  - Tap hamburger → drawer slides from left
  - Tap search icon → search sheet slides up
  - Type "stanford" → filtered school rows appear
  - Type "/" → flips to coach mode
  - Tap Coach FAB → bottom sheet slides up
  - Swipe drawer left to close
  - Resize back to desktop → desktop trees re-render
- [ ] **Step 5: Touch target audit.** All interactive elements ≥ 44px tap area (per INDEX.md).
- [ ] **Step 6: Lighthouse mobile audit.** Run `npx lighthouse http://localhost:3000 --emulated-form-factor=mobile --view`. Target: Performance ≥ 80, Accessibility ≥ 95, Best Practices ≥ 90.
- [ ] **Step 7: Push.**
```bash
git push origin master
```
- [ ] **Step 8: Real device verification.** Open production URL on an iPhone (Safari) and a Pixel (Chrome). Verify:
  - Safe-area insets honored (no content under notch / home indicator)
  - iOS Safari rubber-band scroll doesn't break the fixed bottom tab bar
  - Android keyboard doesn't push the bottom tab bar up over content (use `interactive-widget=resizes-content` viewport meta if needed)

---

## Deferred / out of scope

- **Tablet portrait (768-1023px) intermediate layout.** The handoff has no tablet design; users land on either mobile (393) or desktop (1024+). Tablet portrait users get the mobile renderer (acceptable per INDEX.md). Tablet landscape (≥ 1024) gets desktop.
- **Dark/light mode toggle.** App is dark-only per INDEX.md; matches existing desktop. No mode toggle in this plan.
- **PWA / installable.** `manifest.json` + service worker is a separate plan if you want add-to-home-screen.
- **Per-section animation choreography.** The handoff has minimal entry animations. Mirror desktop's framer-motion stagger pattern in each `Mobile*` section if it shows visible jank on real devices; otherwise leave plain.
- **Mobile-specific analytics tagging.** Plain page-view tags work; mobile-specific funnels (drawer-open-rate, search-sheet-engagement) are a Phase 2 instrumentation pass.
- **Accessibility deep audit.** This plan covers the basics (aria-label, aria-current, aria-disabled, focus management on the search sheet, ESC key handling). A full WCAG 2.1 AA audit is a separate sprint.

---

## Self-review

**Spec coverage:**
- INDEX.md "5-tab bottom nav" → Task 2.
- INDEX.md "drawer 84vw max 320px slide-from-left + scrim" → Task 3.
- INDEX.md "search sheet `/` Coach mode" → Task 4.
- INDEX.md "Coach FAB above tab bar" → Task 5.
- INDEX.md "MobileDashboard 52px header + greeting + hero + 1-up priority + 2-col tile + horizontal-scroll widgets" → Tasks 6 + 7.
- INDEX.md "MobileLanding single-column with 8 sections" → Task 8.
- INDEX.md "Width locked to 393, no fluid breakpoints" → Task 1 (`useMediaQuery` switch) + Task 9 (page-level wiring).
- INDEX.md "Tap targets ≥ 44px" → enforced in Task 2 (BottomTabBar 60px tall) + Task 10 audit.
- INDEX.md "Safe-area insets honored" → Task 1 (`mobile-safe-bottom`/`-top` utilities) + Task 2/5 usage.
- INDEX.md "Mobile never forks the data" → reuse of `DASHBOARD_VARIANTS`, `ALL_ITEMS`+`visibleFor`, `PALETTE_DATA`+`filterPalette`.

**Placeholder scan:** No TBD/TODO. Every task has either complete code or concrete edit instructions with file paths + line ranges.

**Type consistency:** `VariantKey`, `DashboardSummary`, `WidgetItem`, `TabId` flow through cleanly. Mobile components consume the same types as desktop sections.

**Risk:** The biggest is hydration flicker (Task 10 Step 3) — mitigation pattern is in the plan, only applied if dev testing shows it.

**Effort:** ~3-4 weeks for one engineer. Largest single tasks are MobileLanding (Task 8 — 8 components) and MobileDashboard sections (Task 6 — 6 components). Tasks 1-5 + 9-10 are the chrome and wire-up — about a week combined.

---

## Execution

Pick **Subagent-Driven** (recommended — most components are mechanical lifts from handoff JSX) or **Inline Execution**. The plan is structured so reverting any single task does not break the build (Tasks 6/7/8 produce isolated components; Task 9's viewport switch is the only place that could regress production, and it's gated behind `?dashboard=v2` for the dashboard path).

Native testing happens in Task 10 — no production deployment until real-device sign-off.
