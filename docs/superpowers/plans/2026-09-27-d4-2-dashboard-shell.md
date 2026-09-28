# GATE D4.2 Dashboard and App Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the navy TopNav, gold Sidebar and legacy/v2/mobile dashboards on signed-in app pages with the approved Daybreak app frame and a data-grounded "Today" dashboard, a redesigned Settings page with honest plan and billing states, an "Ask Kairos" box that opens the existing Coach with the student's words already typed, and a fix for production React error #418 on `/cc/dashboard`.

**Architecture:** A pure navigation model (`src/components/app-shell/app-nav.ts`) feeds one client `AppFrame` that `AppShell` now renders for every route under `/cc`, `/counselor`, `/engagements`, `/schools`, `/applications`, `/settings` and `/profile`, and `providers.tsx` stops mounting TopNav on those routes. Page bodies not yet rebuilt keep their old dark surface inside the frame, and the frame's element styles are scoped so they can't leak into them. `/cc/dashboard` stays a server component. It reads the same tables the current page reads, turns the rows into a pure view model (`today-input.ts` → `today-model.ts`), and passes plain strings to a client `TodayDashboard`. That component renders nothing from the viewer's clock, so the server HTML and the hydrated HTML are the same. Coach gains `openWithDraft(text)` / `pendingDraft` in `CoachKairosContext`. It opens the drawer and puts the text in the composer. It never sends.

**Tech Stack:** Next.js 16.1.6 App Router, React 19.2.3, TypeScript 5 (strict), Tailwind 4 plus plain CSS on the Daybreak tokens (`src/styles/daybreak-tokens.css`), lucide-react 0.577, Supabase SSR client, Vitest 4 + jsdom 29 + @testing-library/react 16, Playwright 1.58 for the final viewport check.

**Spec:**
- Proposal: `C:\Users\bilal\Downloads\grokking-daybreak\docs\design\2026-09-27-d4-2-dashboard-shell.md` (worktree `design/daybreak` @ `eaf81ba`). Visual and behavioural spec: `docs/design/mocks/dashboard/{index.html,shell.css,shell.js,states.js}` in the same worktree. Grounding: `work-diary/d4-2-source-map.md`, `work-diary/d4-2-independent-review.md`, `work-diary/d4-2-validation.md`, screenshots `work-diary/d4-2-evidence/*.png`.
- Greenlight with amendments A (Ask Kairos box, wired to the existing Coach) and B (keep the "AI" badge): `C:\Users\bilal\Downloads\grokking\docs\handoff\astra-gate-d4-2-response.md`.

**Target tree:** `C:\Users\bilal\Downloads\grokking-integrate`, branch `refocus/admissions-only` (production `a612a57`). Work on a branch cut from it (Task 1, Step 0). The worktree has untracked QA evidence folders; never `git add -A` or `git add .`.

## Global Constraints

- Next 16.1.6, React 19.2.3, TypeScript strict. **No new npm dependencies.**
- Run unit tests only as `npx vitest run <paths>` (or `npx vitest run src` in Task 8). **Never run `npm run test:unit`**, because it includes `tests/unit/**`, which hits the production database.
- Unit tests must not touch the network or a database. Stub `fetch` with `vi.stubGlobal`, and use `src/lib/cc/__tests__/helpers/fake-supabase.ts` for route tests.
- **No migrations, no new tables.** Do not read `.env.local`.
- Every number, date, name and status on Today comes from existing loaders and APIs: `cc_student_profiles`, `cc_student_schools`, `cc_essays`, `cc_activities` and `cc_dashboard_observations` (the dashboard page's own server reads), plus `/api/cc/my-counselor`. Settings uses `/api/cc/me`, `/api/billing/subscription`, `POST /api/billing/stripe/portal` and `PATCH /api/cc/profile/identity`. Authored copy is never phrased as a fact about the student.
- A failed read is shown as "Couldn't load", never as zero or empty. An absent value is shown as "Not added yet" or "unknown", never guessed.
- **The AI never writes essay prose.** No copy may say or imply that Coach writes or drafts an essay. Coach "interviews, structures and critiques; you write every essay."
- Amendment B: an **"AI" badge** sits beside every Coach Kairos entry point: the rail item, the phone Coach tab, the Today invitation or support card, and the Ask Kairos label.
- Amendment A: **Ask Kairos** never opens by itself and never sends. Submitting it (the button or Enter) calls `openWithDraft(text)`, which opens the drawer with the text in the composer, focused. The phone Coach tab calls `openWithDraft("")`. The agent result cards (proposal, evidence, abstain, progress) are **out of scope**. They arrive with the agent work.
- Nothing opens the Coach drawer automatically on `/cc/dashboard`, and nothing sends a synthetic "hi" there.
- App pages use Daybreak tokens (`--db-*`) only. No navy or gold (`#05080d`, `#D4AF37`, `#d4a84b`, Cormorant) in any file this plan creates.
- Phone (375×812): body and navigation text ≥14px; captions and badges ≥12px; every hit target ≥44×44px; no horizontal overflow; the bottom bar reserves `env(safe-area-inset-bottom)`.
- Grade-9 limits come only from `isGrade9BlockedPath` in `src/lib/cc/grade-route-policy.ts`. Junior essay drafting is **not** newly blocked.
- Family mode is a Coach action, not a route. Counselor connection explains `/join/[code]` invite links and never links to a bare `/join`.
- Keep `src/__tests__/retired-links.test.ts` and `src/components/nav/__tests__/nav-links.test.ts` green. Any new file that holds nav hrefs is added to both lists.
- Commits: explicit `git add <paths>` only. Every message ends with a blank line and `Co-Authored-By: claude-flow <ruv@ruv.net>`. Do not push.

## Review Focus

1. **The viewer's clock differs from the server's.** A Vercel server renders in UTC and the student's browser is 12 hours away. Today must hydrate with zero recoverable errors: no greeting based on the time of day, no relative-day text, no `toLocale*` on either side. *Test: Task 6, "hydrates without a mismatch when the browser's clock is 12 hours from the server's".*
2. **A grade-9 student looks for senior tools.** The student opens More, Find a page, the phone tabs or a Today row or CTA, or follows a deep link. Nothing offers a grade-9-blocked destination. A deep link lands on Today with the explanation focused and `?blocked=grade9` removed from the URL. *Tests: Task 1 "offers grade 9 no blocked destination anywhere", Task 5 "never sends grade 9 to a blocked page", Task 6 "explains a blocked deep link and drops the flag".*
3. **A table read fails, as opposed to an account that is really empty.** A network, RLS or schema error reads "Couldn't load" and never "0 schools" or "No essays". A saved deadline renders as the stored calendar day in every timezone. *Tests: Task 5 "reports a failed read as unavailable, never as zero" and "formats stored dates without a timezone".*
4. **The student types into Ask Kairos and presses Enter, or taps the Coach tab.** Coach opens with the text in the composer, focused, and nothing reaches `/api/cc/coach/message`. *Tests: Task 2 "opens the drawer with the student's words staged and sends nothing" and "puts a staged draft in the composer, focused, without sending it"; Task 6 "Ask Kairos hands the words to Coach and sends nothing".*
5. **Manage billing fails.** Possible causes: no Stripe customer (404), a network error or a 5xx, or a double click. The page explains what happened, never redirects to checkout on its own, offers a retry that works, and sends one request per click. *Test: Task 7 "ManageBillingButton" suite.*

---

## Root cause of production React #418 (for Task 6)

`src/app/cc/dashboard/page.tsx` (default branch) renders the client component `AdaptiveDashboardLegacy`, which renders `src/components/cc/dashboard/Greeting.tsx`. That module has no `"use client"` of its own but runs as a client component because its parent is one. Lines 17–28 compute `timeAwareGreeting()` (`new Date().getHours()` → "Good morning"/"Late night"/…) and `dateLabel()` (`toLocaleDateString` → "Sat · Sep 27") **during render**. The server renders them in UTC, and hydration renders them again in the browser's timezone. Any student far enough from UTC gets different text, which produces #418. The values computed in `page.tsx` (`daysUntilLocal`, `daysUntilCommonAppOpen`) are server-only props and cannot mismatch. `MyCounselorChip` and the Sidebar's localStorage read happen after mount and are not causes. Task 6 deletes `Greeting.tsx` and the legacy renderer. The new Today sends dates as preformatted strings (`formatIsoDate`, which never calls `Date`), renders no time-of-day text, and a hydration test runs with the browser clock shifted by 12 hours.

## File Structure

| Path | Responsibility |
|---|---|
| `src/components/app-shell/app-nav.ts` (new) | Pure nav model: student/staff lists, phone tabs, search, active state, `usesAppFrame`, `shellStageFor` |
| `src/components/app-shell/AppFrame.tsx` (new) | Rail, top bar, phone tabs, More / Find a page / Sign out sheets |
| `src/components/app-shell/Sheet.tsx` (new) | Modal sheet on native `<dialog>`: Escape, labelled close, focus restore |
| `src/components/app-shell/AiBadge.tsx` (new) | The "AI" badge |
| `src/components/app-shell/coach-actions.ts` (new) | `openFamilyMode(coach)` |
| `src/components/app-shell/load-shell-stage.ts` (new) | Server: read the signed-in student's stage for the rail |
| `src/components/app-shell/app-frame.css` (new) | Frame and shared primitives (`af-*`) |
| `src/components/nav/AppShell.tsx` (rewrite) | Renders `AppFrame` |
| `src/contexts/CoachKairosContext.tsx` (modify) | `pendingDraft`, `openWithDraft`, `clearPendingDraft` |
| `src/components/cc/coach/CoachChat.tsx` (modify) | Takes the staged draft into the composer and focuses it |
| `src/components/cc/coach/CoachKairosShell.tsx` (modify) | Hides the floating gold Coach button on framed routes |
| `src/app/providers.tsx` (modify) | No TopNav on framed routes; exports `AppLayout` for tests |
| `src/app/{cc,counselor,engagements,schools,profile}/layout.tsx` (modify), `src/app/{applications,settings}/layout.tsx` (new) | Wrap in `AppShell` |
| `src/lib/format-iso-date.ts` (new) | `"2026-11-01"` → `"Nov 1, 2026"` using strings only |
| `src/app/cc/dashboard/today-input.ts` (new) | Pure: raw rows → `TodayInput` (counts, next deadline, statuses, failures) |
| `src/app/cc/dashboard/today-model.ts` (new) | Pure: `(VariantKey, TodayInput)` → `TodayModel` (authored copy + real data) |
| `src/app/cc/dashboard/page.tsx` (rewrite) | Auth gate, reads, model, `<TodayDashboard>` |
| `src/components/cc/today/{TodayDashboard,AskKairos,GradeQuestion,YourPeople}.tsx`, `today.css` (new) | Today UI |
| `src/lib/billing/plan-state.ts` (new) | Free / Pro trial / Pro / Pro unconfirmed / Trial ended |
| `src/components/settings/ManageBillingButton.tsx` (new) | Portal button with loading, missing-customer, error and retry states |
| `src/app/settings/page.tsx` (rewrite), `src/app/settings/settings.css` (new) | Daybreak Settings |
| `src/app/api/cc/me/route.ts`, `src/app/api/cc/profile/identity/route.ts` (modify) | Read and write the existing `dashboard_observations_enabled` column |
| `tests/e2e/d4-2-shell.spec.ts` (new) | Final viewport check |
| **Deleted in Task 4:** `src/components/nav/Sidebar.tsx`. **Deleted in Task 6:** `src/app/cc/dashboard/{AdaptiveDashboard,AdaptiveDashboardClientSwitch,AdaptiveDashboardLegacy}.tsx`, `src/app/cc/dashboard/dashboard.css`, `src/components/cc/dashboard/{Greeting,HeroCard,PriorityModule,Tile,WidgetStrip}.tsx`, `src/components/cc/MyCounselorChip.tsx`, `src/components/mobile/` (whole folder), `src/components/nav/sidebar-data.ts` | Superseded renderers and navigation |

Kept on purpose: `variants.ts` (the `selectVariant` and `VariantKey` types used by the coach prompt builder, walkthroughs and `/api/cc/dashboard/summary`), `/api/cc/dashboard/summary` and `components/cc/dashboard/sections/*` (still compiled, no longer rendered; cleanup is a later gate), `TopNav.tsx` (still used on unframed signed-in routes such as `/my-schools`), and `CommandPalette` (global ⌘K).

---

### Task 1: Navigation model

**Files:**
- Create: `src/components/app-shell/app-nav.ts`
- Test: `src/components/app-shell/__tests__/app-nav.test.ts`
- Modify: `src/components/nav/__tests__/nav-links.test.ts:6` (add the new source)
- Modify: `src/__tests__/retired-links.test.ts:6-9` (add the new source to `SHELL`)

**Interfaces:**
- Consumes: `isGrade9BlockedPath(pathname: string): boolean` from `src/lib/cc/grade-route-policy.ts`; `selectVariant(profile, schools): VariantKey` and `type VariantKey` from `src/app/cc/dashboard/variants.ts`.
- Produces (used by Tasks 3, 4, 6):
  - `type ShellStage = VariantKey`
  - `type NavIcon`, `type NavLink = { kind: "link"; id: string; label: string; href: string; icon: NavIcon; keywords?: string }`, `type NavAction = { kind: "action"; id: "coach" | "family"; label: string; icon: NavIcon; keywords?: string }`, `type NavEntry = NavLink | NavAction`
  - `type MobileTab = { kind: "link"; id; label; icon; href } | { kind: "coach" | "more"; id; label; icon }`
  - `type StaffRole = { isMember: boolean; isHead: boolean }`
  - `studentPrimary(stage: ShellStage): NavEntry[]`, `studentPlanning(stage: ShellStage): NavLink[]`, `studentTabs(): MobileTab[]`
  - `staffPrimary(role: StaffRole): NavLink[]`, `staffTabs(role: StaffRole): MobileTab[]`
  - `searchEntries<T extends NavEntry>(entries: T[], query: string): T[]`
  - `isActiveHref(pathname: string, href: string): boolean`
  - `APP_FRAME_PREFIXES: readonly string[]`, `usesAppFrame(pathname: string | null | undefined): boolean`
  - `DAYBREAK_PAGES`, `isDaybreakPage(pathname: string): boolean` (the page bodies already in Daybreak: `/cc/dashboard`, `/settings`)
  - `shellStageFor(profile: { grade_level: number | null; is_transfer_student: boolean | null } | null): ShellStage`

- [ ] **Step 0: Branch**

```bash
cd C:/Users/bilal/Downloads/grokking-integrate
git switch refocus/admissions-only
git switch -c feat/d4-2-dashboard-shell
```

- [ ] **Step 1: Write the failing tests**

`src/components/app-shell/__tests__/app-nav.test.ts`:

```ts
// GATE D4.2 navigation model. The rail, More, search and phone tabs all read
// these lists, so a grade-9 leak or a missing head-only guard shows up here.
import { describe, it, expect } from "vitest";
import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";
import {
  isActiveHref, isDaybreakPage, searchEntries, shellStageFor, staffPrimary, staffTabs, studentPlanning,
  studentPrimary, studentTabs, usesAppFrame, type MobileTab, type NavEntry,
} from "../app-nav";

const hrefs = (items: Array<NavEntry | MobileTab>) =>
  items.flatMap((e) => ("href" in e ? [e.href] : []));

describe("student navigation", () => {
  it("offers grade 9 no blocked destination anywhere: rail, More, search or phone tabs", () => {
    const lists = [...studentPrimary("g9"), ...studentPlanning("g9")];
    const all = [...lists, ...searchEntries(lists, "e"), ...studentTabs()];
    expect(hrefs(all).filter((h) => isGrade9BlockedPath(h.split(/[?#]/)[0]))).toEqual([]);
    expect(hrefs(all)).toEqual(expect.arrayContaining(["/schools", "/cc/net-price", "/cc/majors", "/cc/activities-optimizer"]));
  });

  it("gives grade 11 the application tools grade 9 cannot open", () => {
    expect(hrefs([...studentPrimary("junior"), ...studentPlanning("junior")])).toEqual(
      expect.arrayContaining(["/applications", "/cc/essays", "/cc/interview-prep", "/cc/recommenders", "/cc/test-strategy"]),
    );
  });

  it("does not silently treat an unknown grade as grade 9", () => {
    expect(hrefs(studentPrimary("unknown"))).toEqual(hrefs(studentPrimary("junior")));
    expect(hrefs(studentPlanning("unknown"))).toEqual(hrefs(studentPlanning("junior")));
  });

  it("points transfer coursework at the transfer profile", () => {
    expect(studentPlanning("transfer").find((l) => l.id === "coursework")).toMatchObject({
      label: "Credits & coursework", href: "/cc/transfer-profile",
    });
  });

  it("keeps Coach and Family mode as actions, not routes", () => {
    expect(studentPrimary("junior").filter((e) => e.kind === "action").map((e) => e.id)).toEqual(["coach", "family"]);
    expect(hrefs(studentPrimary("junior"))).not.toContain("/cc");
    expect(studentTabs().map((t) => t.label)).toEqual(["Today", "Coach", "Schools", "More"]);
    expect(studentTabs().find((t) => t.id === "coach")).toMatchObject({ kind: "coach" });
  });
});

describe("counselor navigation", () => {
  it("shows Team & invites to a head only", () => {
    expect(hrefs(staffPrimary({ isMember: true, isHead: true }))).toContain("/counselor/team");
    expect(hrefs(staffPrimary({ isMember: true, isHead: false }))).not.toContain("/counselor/team");
    expect(staffTabs({ isMember: true, isHead: true }).map((t) => t.label)).toEqual(["Students", "Work", "Team", "More"]);
    expect(staffTabs({ isMember: true, isHead: false }).map((t) => t.label)).toEqual(["Students", "Work", "Profile", "More"]);
  });

  it("sends a counselor without a workspace to setup, not to the member-only roster", () => {
    const nav = staffPrimary({ isMember: false, isHead: false });
    expect(nav[0]).toMatchObject({ label: "Workspace setup", href: "/counselor/dashboard" });
    expect(hrefs(nav)).not.toContain("/counselor/students");
    expect(hrefs(nav)).not.toContain("/counselor/team");
    expect(hrefs(nav)).toEqual(expect.arrayContaining(["/counselor/services", "/counselor/profile"]));
    expect(staffTabs({ isMember: false, isHead: false }).map((t) => t.label)).toEqual(["Setup", "Profile", "Settings", "More"]);
  });
});

describe("frame helpers", () => {
  it("searches labels and keywords, ignoring case", () => {
    expect(searchEntries(studentPrimary("junior"), "COST").map((e) => e.label)).toEqual(["Aid & net price"]);
    expect(searchEntries(studentPrimary("junior"), "zzz")).toEqual([]);
    expect(searchEntries(studentPrimary("junior"), "  ")).toHaveLength(studentPrimary("junior").length);
  });

  it("marks Today active only on the dashboard itself", () => {
    expect(isActiveHref("/cc/dashboard", "/cc/dashboard")).toBe(true);
    expect(isActiveHref("/cc/dashboard/x", "/cc/dashboard")).toBe(false);
    expect(isActiveHref("/cc/essays/abc", "/cc/essays")).toBe(true);
    expect(isActiveHref("/cc/essaysx", "/cc/essays")).toBe(false);
  });

  it("frames app routes and leaves marketing pages and public profiles alone", () => {
    for (const p of ["/cc/dashboard", "/cc/essays/1", "/counselor/team", "/engagements/9", "/schools", "/applications", "/settings", "/profile"]) {
      expect(usesAppFrame(p), p).toBe(true);
    }
    for (const p of ["/", "/welcome", "/pricing", "/counselors/ada", "/login", "/schoolsx", "/my-schools", null]) {
      expect(usesAppFrame(p), String(p)).toBe(false);
    }
  });

  it("keeps legacy page bodies on their dark surface until they are restyled", () => {
    expect(isDaybreakPage("/cc/dashboard")).toBe(true);
    expect(isDaybreakPage("/settings")).toBe(true);
    for (const p of ["/cc/essays", "/schools", "/applications", "/counselor/dashboard", "/cc/dashboard/x"]) {
      expect(isDaybreakPage(p), p).toBe(false);
    }
  });

  it("derives the rail stage the same way the dashboard does", () => {
    expect(shellStageFor(null)).toBe("unknown");
    expect(shellStageFor({ grade_level: 9, is_transfer_student: false })).toBe("g9");
    expect(shellStageFor({ grade_level: 12, is_transfer_student: false })).toBe("senior_writing");
    expect(shellStageFor({ grade_level: 9, is_transfer_student: true })).toBe("transfer");
    expect(shellStageFor({ grade_level: null, is_transfer_student: null })).toBe("unknown");
  });
});
```

Add the new source to the two guard tests so they fail until the file exists.

`src/components/nav/__tests__/nav-links.test.ts` line 6 becomes:

```ts
const SOURCES = ["src/components/nav/sidebar-data.ts", "src/components/nav/palette-data.ts", "src/components/mobile/MobileDrawer.tsx", "src/components/app-shell/app-nav.ts"];
```

`src/__tests__/retired-links.test.ts` lines 6–9 become:

```ts
const SHELL = [
  "src/app/providers.tsx", "src/components/layout/TopNav.tsx", "src/components/marketing/daybreak/DaybreakFooter.tsx",
  "src/app/settings/page.tsx", "src/components/nav/sidebar-data.ts", "src/components/nav/palette-data.ts",
  "src/components/app-shell/app-nav.ts",
];
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/app-shell/__tests__/app-nav.test.ts src/components/nav/__tests__/nav-links.test.ts src/__tests__/retired-links.test.ts`
Expected: FAIL. `app-nav.test.ts` fails with `Failed to resolve import "../app-nav"`. `nav-links` and `retired-links` fail with `ENOENT: no such file or directory, open 'src/components/app-shell/app-nav.ts'`.

- [ ] **Step 3: Write the implementation**

`src/components/app-shell/app-nav.ts`:

```ts
// Navigation model for the Daybreak app frame (GATE D4.2). Pure data and pure
// functions: AppFrame renders it, unit tests read it, and
// src/components/nav/__tests__/nav-links.test.ts scans the href strings below
// to prove every destination is a real page. Grade-9 limits come only from
// src/lib/cc/grade-route-policy.ts; this file never keeps its own list.
import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";
import { selectVariant, type VariantKey } from "@/app/cc/dashboard/variants";

export type ShellStage = VariantKey;

export type NavIcon =
  | "today" | "coach" | "schools" | "calendar" | "essays" | "activities" | "cost"
  | "interview" | "family" | "profile" | "students" | "team" | "services"
  | "payouts" | "setup" | "history" | "settings" | "more";

export type NavLink = { kind: "link"; id: string; label: string; href: string; icon: NavIcon; keywords?: string };
export type NavAction = { kind: "action"; id: "coach" | "family"; label: string; icon: NavIcon; keywords?: string };
export type NavEntry = NavLink | NavAction;

export type MobileTab =
  | { kind: "link"; id: string; label: string; icon: NavIcon; href: string }
  | { kind: "coach" | "more"; id: string; label: string; icon: NavIcon };

export type StaffRole = { isMember: boolean; isHead: boolean };

// Coach Kairos and Family mode are actions on the global Coach drawer, never
// routes (`/cc` is the public tools overview, not Coach).
const STUDENT_PRIMARY: NavEntry[] = [
  { kind: "link", id: "today", label: "Today", href: "/cc/dashboard", icon: "today", keywords: "home dashboard" },
  { kind: "action", id: "coach", label: "Coach Kairos", icon: "coach", keywords: "ai chat ask help" },
  { kind: "link", id: "schools", label: "School list", href: "/schools", icon: "schools", keywords: "colleges universities" },
  { kind: "link", id: "applications", label: "Applications & deadlines", href: "/applications", icon: "calendar", keywords: "dates tracker" },
  { kind: "link", id: "essays", label: "Essays", href: "/cc/essays", icon: "essays", keywords: "personal statement supplements writing" },
  { kind: "link", id: "activities", label: "Activities", href: "/cc/activities-optimizer", icon: "activities", keywords: "work family responsibilities" },
  { kind: "link", id: "aid", label: "Aid & net price", href: "/cc/net-price", icon: "cost", keywords: "cost money financial aid" },
  { kind: "link", id: "interview", label: "Interview prep", href: "/cc/interview-prep", icon: "interview", keywords: "practice" },
  { kind: "action", id: "family", label: "Family mode", icon: "family", keywords: "parents language" },
];

const STUDENT_PLANNING: NavLink[] = [
  { kind: "link", id: "profile", label: "Profile", href: "/profile", icon: "profile", keywords: "gpa name school" },
  { kind: "link", id: "coursework", label: "High-school coursework", href: "/cc/courses", icon: "essays", keywords: "classes rigor" },
  { kind: "link", id: "testing", label: "Testing", href: "/cc/test-strategy", icon: "calendar", keywords: "sat act" },
  { kind: "link", id: "majors", label: "Majors & interests", href: "/cc/majors", icon: "activities", keywords: "careers explore" },
  { kind: "link", id: "visits", label: "Visits", href: "/cc/visits", icon: "schools", keywords: "tours campus" },
  { kind: "link", id: "summer", label: "Summer experiences", href: "/cc/summer", icon: "today", keywords: "programs" },
  { kind: "link", id: "recommenders", label: "Recommenders", href: "/cc/recommenders", icon: "profile", keywords: "letters teachers" },
  { kind: "link", id: "waitlist", label: "Waitlist", href: "/cc/waitlist", icon: "calendar", keywords: "loci" },
];

const TRANSFER_COURSEWORK: NavLink = {
  kind: "link", id: "coursework", label: "Credits & coursework", href: "/cc/transfer-profile", icon: "essays", keywords: "transfer college credits",
};

const STAFF: NavLink[] = [
  { kind: "link", id: "students", label: "Students", href: "/counselor/students", icon: "students", keywords: "roster" },
  { kind: "link", id: "engagements", label: "Engagements", href: "/counselor/dashboard", icon: "calendar", keywords: "work bookings" },
  { kind: "link", id: "team", label: "Team & invites", href: "/counselor/team", icon: "team", keywords: "codes members" },
  { kind: "link", id: "services", label: "Services", href: "/counselor/services", icon: "services", keywords: "packages" },
  { kind: "link", id: "payouts", label: "Payouts", href: "/counselor/payouts", icon: "payouts", keywords: "money stripe" },
  { kind: "link", id: "public-profile", label: "Public profile", href: "/counselor/profile", icon: "profile", keywords: "bio" },
  { kind: "link", id: "admit-history", label: "Admit history", href: "/counselor/admit-history", icon: "history", keywords: "results" },
];

// A counselor with no agency lands on /counselor/dashboard, which hosts
// CreateWorkspaceCard; /counselor/students bounces non-members there anyway.
const WORKSPACE_SETUP: NavLink = {
  kind: "link", id: "setup", label: "Workspace setup", href: "/counselor/dashboard", icon: "setup", keywords: "create join agency",
};

export function isBlockedFor(stage: ShellStage, href: string): boolean {
  return stage === "g9" && isGrade9BlockedPath(href.split(/[?#]/)[0]);
}

export function studentPrimary(stage: ShellStage): NavEntry[] {
  return STUDENT_PRIMARY.filter((e) => e.kind === "action" || !isBlockedFor(stage, e.href));
}

export function studentPlanning(stage: ShellStage): NavLink[] {
  const list = stage === "transfer"
    ? STUDENT_PLANNING.map((l) => (l.id === "coursework" ? TRANSFER_COURSEWORK : l))
    : STUDENT_PLANNING;
  return list.filter((l) => !isBlockedFor(stage, l.href));
}

export function studentTabs(): MobileTab[] {
  return [
    { kind: "link", id: "today", label: "Today", icon: "today", href: "/cc/dashboard" },
    { kind: "coach", id: "coach", label: "Coach", icon: "coach" },
    { kind: "link", id: "schools", label: "Schools", icon: "schools", href: "/schools" },
    { kind: "more", id: "more", label: "More", icon: "more" },
  ];
}

export function staffPrimary(role: StaffRole): NavLink[] {
  if (!role.isMember) {
    // Marketplace tools stay; roster, engagements-as-home and team need a workspace.
    return [WORKSPACE_SETUP, ...STAFF.filter((l) => !["students", "engagements", "team"].includes(l.id))];
  }
  return STAFF.filter((l) => l.id !== "team" || role.isHead);
}

export function staffTabs(role: StaffRole): MobileTab[] {
  if (!role.isMember) {
    return [
      { kind: "link", id: "setup", label: "Setup", icon: "setup", href: "/counselor/dashboard" },
      { kind: "link", id: "profile", label: "Profile", icon: "profile", href: "/counselor/profile" },
      { kind: "link", id: "settings", label: "Settings", icon: "settings", href: "/settings" },
      { kind: "more", id: "more", label: "More", icon: "more" },
    ];
  }
  return [
    { kind: "link", id: "students", label: "Students", icon: "students", href: "/counselor/students" },
    { kind: "link", id: "work", label: "Work", icon: "calendar", href: "/counselor/dashboard" },
    role.isHead
      ? { kind: "link", id: "team", label: "Team", icon: "team", href: "/counselor/team" }
      : { kind: "link", id: "profile", label: "Profile", icon: "profile", href: "/counselor/profile" },
    { kind: "more", id: "more", label: "More", icon: "more" },
  ];
}

export function searchEntries<T extends NavEntry>(entries: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  return entries.filter((e) => `${e.label} ${e.keywords ?? ""}`.toLowerCase().includes(q));
}

export function isActiveHref(pathname: string, href: string): boolean {
  if (href === "/cc/dashboard") return pathname === "/cc/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Routes whose layout renders AppShell → AppFrame. providers.tsx skips the
// navy TopNav on exactly these, and a Task 4 test proves each has the layout.
export const APP_FRAME_PREFIXES = ["/cc", "/counselor", "/engagements", "/schools", "/applications", "/settings", "/profile"] as const;

export function usesAppFrame(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return APP_FRAME_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// Page bodies already built in Daybreak. Every other framed page keeps its
// legacy dark surface (and white text) inside the frame until its own D4.x
// gate. Without this, legacy white-on-transparent text would sit on cream.
export const DAYBREAK_PAGES = ["/cc/dashboard", "/settings"] as const;

export function isDaybreakPage(pathname: string): boolean {
  return (DAYBREAK_PAGES as readonly string[]).includes(pathname);
}

export function shellStageFor(
  profile: { grade_level: number | null; is_transfer_student: boolean | null } | null,
): ShellStage {
  // No school rows: grade 12 resolves to senior_writing, and the rail is the
  // same for every senior phase.
  return profile ? selectVariant(profile, []) : "unknown";
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/app-shell/__tests__/app-nav.test.ts src/components/nav/__tests__/nav-links.test.ts src/__tests__/retired-links.test.ts`
Expected: PASS. 3 test files, all tests passed (app-nav 12, nav-links 2, retired-links 3).

- [ ] **Step 5: Commit**

```bash
git add src/components/app-shell/app-nav.ts src/components/app-shell/__tests__/app-nav.test.ts src/components/nav/__tests__/nav-links.test.ts src/__tests__/retired-links.test.ts
git commit -m "feat(shell): D4.2 navigation model with grade-9 and head-only rules" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---
### Task 2: Coach draft hand-off (Amendment A plumbing)

**Files:**
- Modify: `src/contexts/CoachKairosContext.tsx` (interface lines 23–64; state near line 83; callbacks near lines 400–461; provider value lines 521–530)
- Modify: `src/components/cc/coach/CoachChat.tsx` (hook destructure lines 33–42; input lines 254–263)
- Test: `src/contexts/__tests__/coach-draft.test.tsx`
- Test: `src/components/cc/coach/__tests__/CoachChat-draft.test.tsx`

**Interfaces:**
- Consumes: the existing `CoachKairosProvider` / `useCoachKairos()`.
- Produces (used by Tasks 3 and 6):
  - `pendingDraft: string | null`. Text staged for the composer; `""` means "focus an empty composer"; `null` means nothing is staged.
  - `openWithDraft(text: string): void`. Opens the drawer and stages `text` (trimmed to 2,000 chars). Never sends, and marks the proactive greeting as spent so no automatic "hi" follows.
  - `clearPendingDraft(): void`.
  - The CoachChat composer gets `aria-label="Message Coach Kairos"`.

- [ ] **Step 1: Write the failing tests**

`src/contexts/__tests__/coach-draft.test.tsx`:

```tsx
// Amendment A: "Ask Kairos" opens the existing Coach with the student's words
// already typed. Nothing is sent on the student's behalf, and opening Coach
// this way must also suppress the automatic greeting on "/".
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1" }, profile: { full_name: "Ada Lovelace" } }) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/hooks/useCoachVoice", () => ({ useCoachVoice: () => ({ speak: vi.fn(), stop: vi.fn() }) }));
import { CoachKairosProvider, useCoachKairos } from "../CoachKairosContext";

const fetchMock = vi.fn(async (url: string) =>
  new Response(JSON.stringify(String(url).includes("history") ? { messages: [] } : {}), { status: 200 }));

beforeEach(() => { fetchMock.mockClear(); vi.stubGlobal("fetch", fetchMock); });
afterEach(() => { vi.unstubAllGlobals(); });

function Probe() {
  const c = useCoachKairos();
  return (
    <div>
      <span data-testid="open">{String(c.isOpen)}</span>
      <span data-testid="draft">{c.pendingDraft ?? "none"}</span>
      <button type="button" onClick={() => c.openWithDraft("  add Michigan and Toronto  ")}>ask</button>
      <button type="button" onClick={c.clearPendingDraft}>clear</button>
    </div>
  );
}

describe("openWithDraft", () => {
  it("opens the drawer with the student's words staged and sends nothing", async () => {
    render(<CoachKairosProvider><Probe /></CoachKairosProvider>);
    await act(async () => {}); // history load settles: empty conversation on "/"
    fireEvent.click(screen.getByText("ask"));
    expect(screen.getByTestId("open").textContent).toBe("true");
    expect(screen.getByTestId("draft").textContent).toBe("add Michigan and Toronto");
    // Past the 1.5 s window in which "/" would otherwise auto-send "hi".
    await act(async () => { await new Promise((r) => setTimeout(r, 1700)); });
    expect(fetchMock.mock.calls.map(([u]) => String(u))).not.toContain("/api/cc/coach/message");
    fireEvent.click(screen.getByText("clear"));
    expect(screen.getByTestId("draft").textContent).toBe("none");
  });
});
```

`src/components/cc/coach/__tests__/CoachChat-draft.test.tsx`:

```tsx
// The composer receives a staged draft and focus. The student presses send.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const h = vi.hoisted(() => ({ draft: "add Michigan and Toronto" as string | null, send: vi.fn(), clear: vi.fn() }));
vi.mock("@/contexts/CoachKairosContext", () => ({
  useCoachKairos: () => ({
    messages: [], sendMessage: h.send, isStreaming: false, isLoading: false, language: "en",
    appendVoiceTurn: vi.fn(), ttsError: null, clearTtsError: vi.fn(),
    pendingDraft: h.draft, clearPendingDraft: h.clear,
  }),
}));
vi.mock("@/hooks/useVoiceAgent", () => ({
  useVoiceAgent: () => ({ isConnected: false, isConnecting: false, isSpeaking: false, micMuted: false, error: null, start: vi.fn(), stop: vi.fn() }),
}));
import CoachChat from "../CoachChat";

beforeEach(() => { h.send.mockClear(); h.clear.mockClear(); });

describe("CoachChat draft", () => {
  it("puts a staged draft in the composer, focused, without sending it", () => {
    h.draft = "add Michigan and Toronto";
    render(<CoachChat />);
    const box = screen.getByRole("textbox", { name: "Message Coach Kairos" }) as HTMLInputElement;
    expect(box.value).toBe("add Michigan and Toronto");
    expect(document.activeElement).toBe(box);
    expect(h.clear).toHaveBeenCalledTimes(1);
    expect(h.send).not.toHaveBeenCalled();
  });

  it("focuses an empty composer when Coach is opened from the Coach tab", () => {
    h.draft = "";
    render(<CoachChat />);
    const box = screen.getByRole("textbox", { name: "Message Coach Kairos" }) as HTMLInputElement;
    expect(box.value).toBe("");
    expect(document.activeElement).toBe(box);
    expect(h.send).not.toHaveBeenCalled();
  });

  it("leaves the composer alone when nothing is staged", () => {
    h.draft = null;
    render(<CoachChat />);
    expect(document.activeElement).not.toBe(screen.getByRole("textbox", { name: "Message Coach Kairos" }));
    expect(h.clear).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/contexts/__tests__/coach-draft.test.tsx src/components/cc/coach/__tests__/CoachChat-draft.test.tsx`
Expected: FAIL. `coach-draft`: `TypeError: c.openWithDraft is not a function`. `CoachChat-draft`: `Unable to find an accessible element with the role "textbox" and name "Message Coach Kairos"`.

- [ ] **Step 3: Implement in the context**

In `src/contexts/CoachKairosContext.tsx`, add to `interface CoachKairosContextValue` (after `appendVoiceTurn`):

```ts
  // Amendment A (GATE D4.2): text the student typed outside the drawer (the
  // "Ask Kairos" box, or "" from the phone Coach tab). CoachChat moves it into
  // its composer and focuses it; nothing is ever sent on the student's behalf.
  pendingDraft: string | null;
  openWithDraft: (text: string) => void;
  clearPendingDraft: () => void;
```

Add state beside `familyMode` (after line 83):

```ts
  const [pendingDraft, setPendingDraft] = useState<string | null>(null);
```

Add callbacks after `toggleFamilyMode` (after line 461):

```ts
  const openWithDraft = useCallback((text: string) => {
    // An explicit open spends the one-time proactive greeting, so the "/"
    // auto-open can't fire a synthetic "hi" underneath the student's draft.
    proactiveSent.current = true;
    setPendingDraft(text.trim().slice(0, 2000));
    setIsOpen(true);
  }, []);
  const clearPendingDraft = useCallback(() => setPendingDraft(null), []);
```

Add to the provider `value` object (after `appendVoiceTurn,`):

```ts
        pendingDraft, openWithDraft, clearPendingDraft,
```

- [ ] **Step 4: Implement in CoachChat**

In `src/components/cc/coach/CoachChat.tsx`, extend the hook destructure:

```ts
  const {
    messages,
    sendMessage,
    isStreaming,
    isLoading,
    language,
    appendVoiceTurn,
    ttsError,
    clearTtsError,
    pendingDraft,
    clearPendingDraft,
  } = useCoachKairos();

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Take a draft staged by openWithDraft (Ask Kairos / Coach tab): fill the
  // composer and focus it. The student decides whether to send.
  useEffect(() => {
    if (pendingDraft === null) return;
    setInput(pendingDraft);
    clearPendingDraft();
    inputRef.current?.focus();
  }, [pendingDraft, clearPendingDraft]);
```

(Delete the old `const [input, setInput] = useState("");` line, which the block above replaces.)

On the composer `<input>`, add `ref` and a label:

```tsx
          <input
            ref={inputRef}
            aria-label="Message Coach Kairos"
            type="text"
            dir="auto"
            value={input}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/contexts/__tests__/coach-draft.test.tsx src/components/cc/coach/__tests__/CoachChat-draft.test.tsx`
Expected: PASS. 2 test files, 4 tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/contexts/CoachKairosContext.tsx src/components/cc/coach/CoachChat.tsx src/contexts/__tests__/coach-draft.test.tsx src/components/cc/coach/__tests__/CoachChat-draft.test.tsx
git commit -m "feat(coach): openWithDraft stages text in the composer without sending" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---
### Task 3: The Daybreak app frame

**Files:**
- Create: `src/components/app-shell/AppFrame.tsx`
- Create: `src/components/app-shell/Sheet.tsx`
- Create: `src/components/app-shell/AiBadge.tsx`
- Create: `src/components/app-shell/coach-actions.ts`
- Create: `src/components/app-shell/app-frame.css`
- Test: `src/components/app-shell/__tests__/AppFrame.test.tsx`

**Interfaces:**
- Consumes: everything Task 1 produces from `app-nav.ts`; `useCoachKairos().openWithDraft`, `.open`, `.toggleFamilyMode`, `.language` (Task 2); `useAuth()` → `{ user, loading, signOut }`; `useCounselorRole()` → `{ isCounselor, isMember, isHead, loading }`; `FAMILY_MODE_LANGUAGES` from `src/lib/cc/family-mode-strings.ts`.
- Produces:
  - `default function AppFrame(props: { stage: ShellStage; audience?: "student" | "staff"; children: ReactNode })` (Task 4)
  - `default function Sheet(props: { title: string; onClose: () => void; focusSelector?: string; children: ReactNode })`. Mount it only while it is open; unmounting restores focus.
  - `default function AiBadge()` (Tasks 6 and 7)
  - `openFamilyMode(coach: { language: string; open(): void; toggleFamilyMode(on?: boolean): void }): void` (Task 6)
  - CSS primitives other pages use inside the frame: `.af-primary`, `.af-quiet`, `.af-chip`, `.af-eyebrow`, `.af-caption`, `.af-badge`, `.af-notice`, `.af-sr-only`.
  - DOM contract used by the Task 8 Playwright check: `.af-root`, `.af-rail`, `.af-topbar`, `.af-tabs`, `#af-main`. `#af-main` carries `af-db` on Daybreak pages (`isDaybreakPage`), or `af-legacy kl-surface-app` on pages not yet restyled. Frame element styles apply only under `.af-db`.

- [ ] **Step 1: Write the failing test**

`src/components/app-shell/__tests__/AppFrame.test.tsx`:

```tsx
// The frame is the only navigation on framed routes, so its rules are the
// product's rules: grade-9 limits, head-only Team, AI badge on Coach, Coach
// opened only by a tap, sheets that close on Escape and give focus back.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

const h = vi.hoisted(() => ({
  pathname: "/cc/dashboard",
  auth: { user: { id: "u1" } as { id: string } | null, loading: false, signOut: vi.fn() },
  role: { isCounselor: false, isMember: false, isHead: false, requiresReview: false, loading: false },
  coach: { openWithDraft: vi.fn(), sendMessage: vi.fn(), open: vi.fn(), toggleFamilyMode: vi.fn(), language: "en" },
}));
vi.mock("next/navigation", () => ({ usePathname: () => h.pathname }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => h.auth }));
vi.mock("@/hooks/useCounselorRole", () => ({ useCounselorRole: () => h.role }));
vi.mock("@/contexts/CoachKairosContext", () => ({ useCoachKairos: () => h.coach }));
import AppFrame from "../AppFrame";

const student = { isCounselor: false, isMember: false, isHead: false, requiresReview: false, loading: false };
beforeEach(() => {
  vi.clearAllMocks();
  h.pathname = "/cc/dashboard";
  h.auth.user = { id: "u1" };
  h.auth.loading = false;
  h.role = { ...student };
  h.coach.language = "en";
});

const rail = () => screen.getByRole("navigation", { name: "Primary" });
const tabs = () => screen.getByRole("navigation", { name: "Phone" });
const linkHrefs = (el: HTMLElement) => within(el).queryAllByRole("link").map((a) => a.getAttribute("href"));

describe("AppFrame (student)", () => {
  it("gives grade 9 no blocked tools in the rail or in More", () => {
    render(<AppFrame stage="g9"><p>page</p></AppFrame>);
    expect(linkHrefs(rail())).not.toContain("/cc/essays");
    expect(linkHrefs(rail())).not.toContain("/applications");
    expect(linkHrefs(rail())).not.toContain("/cc/interview-prep");
    expect(linkHrefs(rail())).toContain("/schools");
    fireEvent.click(screen.getByRole("button", { name: "More planning tools" }));
    const more = screen.getByRole("dialog", { name: "Your planning space" });
    for (const blocked of ["/cc/recommenders", "/cc/test-strategy", "/cc/waitlist", "/cc/essays"]) {
      expect(linkHrefs(more)).not.toContain(blocked);
    }
    expect(within(more).getByText("Application tools come later")).toBeTruthy();
  });

  it("marks Today as the current page", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    expect(within(rail()).getByRole("link", { name: "Today" }).getAttribute("aria-current")).toBe("page");
  });

  it("gives Daybreak pages the frame's styles and keeps legacy pages on their dark surface", () => {
    const { unmount } = render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    expect(document.getElementById("af-main")!.className).toBe("af-main af-db");
    unmount();
    h.pathname = "/cc/essays";
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    expect(document.getElementById("af-main")!.className).toBe("af-main af-legacy kl-surface-app");
  });

  it("labels Coach Kairos with the AI badge and opens it only on a tap, without sending", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    expect(h.coach.openWithDraft).not.toHaveBeenCalled();
    const coach = within(rail()).getByRole("button", { name: /Coach Kairos/ });
    expect(within(coach).getByText("AI")).toBeTruthy();
    fireEvent.click(coach);
    expect(h.coach.openWithDraft).toHaveBeenCalledWith("");
    expect(h.coach.sendMessage).not.toHaveBeenCalled();
  });

  it("opens the Coach composer from the phone Coach tab", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    const tab = within(tabs()).getByRole("button", { name: /Coach/ });
    expect(within(tab).getByText("AI")).toBeTruthy();
    fireEvent.click(tab);
    expect(h.coach.openWithDraft).toHaveBeenCalledWith("");
  });

  it("opens family mode when the Coach language has it, and Coach otherwise", () => {
    const { unmount } = render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    fireEvent.click(within(rail()).getByRole("button", { name: "Family mode" }));
    expect(h.coach.toggleFamilyMode).toHaveBeenCalledWith(true);
    unmount();
    h.coach.language = "xx";
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    fireEvent.click(within(rail()).getByRole("button", { name: "Family mode" }));
    expect(h.coach.open).toHaveBeenCalled();
  });

  it("closes More on Escape and gives focus back to the button that opened it", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    const button = screen.getByRole("button", { name: "More planning tools" });
    button.focus();
    fireEvent.click(button);
    const dialog = screen.getByRole("dialog", { name: "Your planning space" });
    expect(document.activeElement).toBe(within(dialog).getByRole("button", { name: "Close panel" }));
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it("finds pages by label or keyword and says so when nothing matches", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    fireEvent.click(screen.getByRole("button", { name: "Find a page" }));
    const dialog = screen.getByRole("dialog", { name: "Find a page" });
    const box = within(dialog).getByRole("searchbox", { name: "Search your pages" });
    expect(document.activeElement).toBe(box);
    fireEvent.change(box, { target: { value: "cost" } });
    expect(within(dialog).getByRole("link", { name: "Aid & net price" })).toBeTruthy();
    fireEvent.change(box, { target: { value: "zzz" } });
    expect(within(dialog).getByText("No matching page. Try another word.")).toBeTruthy();
  });

  it("asks before signing out", () => {
    render(<AppFrame stage="junior"><p>page</p></AppFrame>);
    fireEvent.click(within(rail().parentElement!).getByRole("button", { name: "Sign out" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: "Sign out of KairosLearn?" })).getByRole("button", { name: "Stay here" }));
    expect(h.auth.signOut).not.toHaveBeenCalled();
    fireEvent.click(within(rail().parentElement!).getByRole("button", { name: "Sign out" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: "Sign out of KairosLearn?" })).getByRole("button", { name: "Sign out" }));
    expect(h.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("shows a signed-out visitor Sign in, not the student navigation", () => {
    h.auth.user = null;
    render(<AppFrame stage="unknown"><p>page</p></AppFrame>);
    expect(screen.queryByRole("navigation", { name: "Primary" })).toBeNull();
    expect(screen.queryByRole("navigation", { name: "Phone" })).toBeNull();
    expect(screen.getByRole("link", { name: "Sign in" }).getAttribute("href")).toBe("/login");
  });
});

describe("AppFrame (counselor)", () => {
  it("shows Team & invites to a head counselor", () => {
    h.pathname = "/counselor/dashboard";
    h.role = { isCounselor: true, isMember: true, isHead: true, requiresReview: false, loading: false };
    render(<AppFrame stage="unknown" audience="staff"><p>page</p></AppFrame>);
    expect(linkHrefs(rail())).toContain("/counselor/team");
    expect(within(tabs()).getByRole("link", { name: "Team" })).toBeTruthy();
    expect(within(rail()).queryByRole("button", { name: /Coach Kairos/ })).toBeNull();
  });

  it("hides Team & invites from a supervised counselor", () => {
    h.pathname = "/counselor/dashboard";
    h.role = { isCounselor: true, isMember: true, isHead: false, requiresReview: true, loading: false };
    render(<AppFrame stage="unknown" audience="staff"><p>page</p></AppFrame>);
    expect(linkHrefs(rail())).not.toContain("/counselor/team");
    expect(within(tabs()).getByRole("link", { name: "Profile" })).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/app-shell/__tests__/AppFrame.test.tsx`
Expected: FAIL with `Failed to resolve import "../AppFrame"`.

- [ ] **Step 3: Write the small pieces**

`src/components/app-shell/AiBadge.tsx`:

```tsx
// GATE D4.2 amendment B: every Coach Kairos entry point carries this badge.
// The product must never imply that a person wrote an AI reply.
export default function AiBadge() {
  return <span className="af-badge">AI</span>;
}
```

`src/components/app-shell/coach-actions.ts`:

```ts
import { FAMILY_MODE_LANGUAGES } from "@/lib/cc/family-mode-strings";

type FamilyCapableCoach = { language: string; open: () => void; toggleFamilyMode: (on?: boolean) => void };

// Family mode is a Coach action, not a route. When the current Coach language
// has no family mode, open Coach instead: its header explains why the
// hand-to-parent button is unavailable.
export function openFamilyMode(coach: FamilyCapableCoach): void {
  if ((FAMILY_MODE_LANGUAGES as readonly string[]).includes(coach.language)) coach.toggleFamilyMode(true);
  else coach.open();
}
```

`src/components/app-shell/Sheet.tsx`:

```tsx
"use client";

// Modal sheet on a native <dialog>. In browsers showModal() makes the page
// behind it inert, which contains the keyboard. jsdom has no showModal, so the
// fallback sets the open attribute. Mount the sheet only while it is open;
// unmounting closes it and returns focus to whatever opened it.
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export default function Sheet({
  title,
  onClose,
  focusSelector,
  children,
}: {
  title: string;
  onClose: () => void;
  focusSelector?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (typeof el.showModal === "function") el.showModal();
    else el.setAttribute("open", "");
    const first = focusSelector ? el.querySelector<HTMLElement>(focusSelector) : null;
    (first ?? closeRef.current)?.focus();
    return () => {
      if (typeof el.close === "function" && el.open) el.close();
      if (returnTo?.isConnected) returnTo.focus();
    };
  }, [focusSelector]);

  return (
    <dialog
      ref={ref}
      className="af-sheet af-db"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <div className="af-sheet-top">
        <h2 id={titleId}>{title}</h2>
        <button ref={closeRef} type="button" aria-label="Close panel" onClick={onClose}>
          <X aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
```

- [ ] **Step 4: Write the frame**

`src/components/app-shell/AppFrame.tsx`:

```tsx
"use client";

// Daybreak app frame (GATE D4.2): one navigation rail on desktop, Today /
// Coach / Schools / More on phones, a quiet top bar, and sheets for More, Find
// a page and Sign out. It replaces the navy TopNav and the gold Sidebar on
// every route in APP_FRAME_PREFIXES. Coach never opens by itself: each Coach
// entry is an explicit tap and carries the AI badge.
import "./app-frame.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Building2, CalendarDays, CircleUser, FileText, Leaf, LogOut, MessageCircle,
  MessageSquare, MoreHorizontal, School, Search, Settings, Sun, UserPlus,
  UserRound, Users, Wallet, type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCounselorRole } from "@/hooks/useCounselorRole";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import AiBadge from "./AiBadge";
import Sheet from "./Sheet";
import { openFamilyMode } from "./coach-actions";
import {
  isActiveHref, isDaybreakPage, searchEntries, staffPrimary, staffTabs, studentPlanning, studentPrimary,
  studentTabs, type MobileTab, type NavEntry, type NavIcon, type ShellStage,
} from "./app-nav";

const ICONS: Record<NavIcon, LucideIcon> = {
  today: Sun, coach: MessageSquare, schools: School, calendar: CalendarDays, essays: FileText,
  activities: Leaf, cost: Wallet, interview: MessageCircle, family: Users, profile: UserRound,
  students: Users, team: UserPlus, services: FileText, payouts: Wallet, setup: Building2,
  history: School, settings: Settings, more: MoreHorizontal,
};

type Panel = "more" | "search" | "signout" | null;

export default function AppFrame({
  stage,
  audience = "student",
  children,
}: {
  stage: ShellStage;
  audience?: "student" | "staff";
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const { user, loading: authLoading, signOut } = useAuth();
  const role = useCounselorRole();
  const coach = useCoachKairos();
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");

  // A link inside a sheet navigated: close the sheet.
  useEffect(() => { setPanel(null); }, [pathname]);

  const guest = !authLoading && !user;
  const staff = audience === "staff" || role.isCounselor;
  // While the role lookup runs, assume membership so a member's rail doesn't
  // flash "Workspace setup". Team still waits for isHead.
  const staffRole = { isMember: role.isMember || role.loading, isHead: role.isHead };
  const primary: NavEntry[] = staff ? staffPrimary(staffRole) : studentPrimary(stage);
  const planning: NavEntry[] = staff ? [] : studentPlanning(stage);
  const tabs: MobileTab[] = staff ? staffTabs(staffRole) : studentTabs();
  const moreEntries: NavEntry[] = staff ? primary : [...primary.filter((e) => e.id !== "today"), ...planning];
  const results = searchEntries([...primary, ...planning], query);
  const home = staff ? "/counselor/dashboard" : "/cc/dashboard";

  function runAction(id: "coach" | "family") {
    setPanel(null);
    if (id === "coach") coach.openWithDraft("");
    else openFamilyMode(coach);
  }

  function renderEntry(e: NavEntry, className?: string) {
    const Icon = ICONS[e.icon];
    if (e.kind === "action") {
      return (
        <button key={e.id} type="button" className={className} onClick={() => runAction(e.id)}>
          <Icon aria-hidden="true" />
          <span>
            {e.label}
            {e.id === "coach" && <>{" "}<AiBadge /></>}
          </span>
        </button>
      );
    }
    return (
      <Link key={e.id} href={e.href} className={className} aria-current={isActiveHref(pathname, e.href) ? "page" : undefined}>
        <Icon aria-hidden="true" />
        <span>{e.label}</span>
      </Link>
    );
  }

  const brand = (extra = "") => (
    <Link className={`af-brand ${extra}`} href={home}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/kairos-192.png" width={36} height={36} alt="" />
      KairosLearn
    </Link>
  );

  return (
    <div className="af-root">
      <a className="af-skip" href="#af-main">Skip to content</a>

      <aside className="af-rail af-db" aria-label="App">
        {brand()}
        {!guest && (
          <>
            <p className="af-rail-label">
              {staff ? (staffRole.isMember ? "COUNSELOR WORKSPACE" : "COUNSELOR ACCOUNT") : "YOUR SPACE"}
            </p>
            <nav aria-label="Primary">
              {primary.map((e) => renderEntry(e, "af-nav-item"))}
              {!staff && (
                <button type="button" className="af-nav-item" onClick={() => setPanel("more")}>
                  <MoreHorizontal aria-hidden="true" />
                  <span>More planning tools</span>
                </button>
              )}
            </nav>
            <div className="af-rail-bottom">
              <Link className="af-nav-item" href="/settings" aria-current={isActiveHref(pathname, "/settings") ? "page" : undefined}>
                <Settings aria-hidden="true" />
                <span>Settings</span>
              </Link>
              <button type="button" className="af-nav-item" onClick={() => setPanel("signout")}>
                <LogOut aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </div>
          </>
        )}
      </aside>

      <div className="af-workspace">
        <header className="af-topbar af-db">
          {brand("af-brand--phone")}
          <span className="af-top-title">{staff ? "Your workspace" : "Your planning space"}</span>
          {guest ? (
            <div className="af-top-actions">
              <Link href="/login">Sign in</Link>
            </div>
          ) : (
            <div className="af-top-actions">
              <button type="button" aria-label="Find a page" onClick={() => { setQuery(""); setPanel("search"); }}>
                <Search aria-hidden="true" />
                <span className="af-desktop-only">Find a page</span>
              </button>
              <Link href="/settings" aria-label="Your account and settings">
                <CircleUser aria-hidden="true" />
                <span className="af-desktop-only">Your account</span>
              </Link>
            </div>
          )}
        </header>
        {/* Daybreak page bodies get the frame's element styles; legacy bodies
            keep their dark surface and are untouched by them (see app-frame.css). */}
        <main
          id="af-main"
          className={isDaybreakPage(pathname) ? "af-main af-db" : "af-main af-legacy kl-surface-app"}
          tabIndex={-1}
        >
          {children}
        </main>
        {!staff && <footer className="af-foot af-db">Your story stays yours. You write every essay.</footer>}
      </div>

      {!guest && (
        <nav className="af-tabs af-db" aria-label="Phone">
          {tabs.map((t) => {
            const Icon = ICONS[t.icon];
            if (t.kind === "link") {
              return (
                <Link key={t.id} href={t.href} aria-current={isActiveHref(pathname, t.href) ? "page" : undefined}>
                  <Icon aria-hidden="true" />
                  <span>{t.label}</span>
                </Link>
              );
            }
            return (
              <button key={t.id} type="button" onClick={() => (t.kind === "coach" ? runAction("coach") : setPanel("more"))}>
                <Icon aria-hidden="true" />
                <span>
                  {t.label}
                  {t.kind === "coach" && <>{" "}<AiBadge /></>}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {panel === "more" && (
        <Sheet title={staff ? "Your workspace" : "Your planning space"} onClose={() => setPanel(null)}>
          <div className="af-sheet-links">{moreEntries.map((e) => renderEntry(e))}</div>
          {!staff && stage === "g9" && (
            <section className="af-sheet-group">
              <h3>Application tools come later</h3>
              <p>Essays, applications and interview prep aren&apos;t available in grade 9.</p>
              <Link className="af-quiet" href="/cc/dashboard?blocked=grade9">What can I use now?</Link>
            </section>
          )}
          <section className="af-sheet-group">
            <h3>Your account</h3>
            <div className="af-sheet-links">
              <Link href="/settings"><Settings aria-hidden="true" />Settings &amp; billing</Link>
              <button type="button" onClick={() => setPanel("signout")}><LogOut aria-hidden="true" />Sign out</button>
            </div>
          </section>
        </Sheet>
      )}

      {panel === "search" && (
        <Sheet title="Find a page" onClose={() => setPanel(null)} focusSelector="#af-search">
          <label htmlFor="af-search">Search your pages</label>
          <input
            id="af-search"
            className="af-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try essays, cost or profile"
          />
          {results.length > 0 ? (
            <div className="af-sheet-links">{results.map((e) => renderEntry(e))}</div>
          ) : (
            <p>No matching page. Try another word.</p>
          )}
        </Sheet>
      )}

      {panel === "signout" && (
        <Sheet title="Sign out of KairosLearn?" onClose={() => setPanel(null)}>
          <p>Your work stays in your account.</p>
          <div className="af-sheet-actions">
            <button type="button" className="af-primary" onClick={() => void signOut()}>Sign out</button>
            <button type="button" onClick={() => setPanel(null)}>Stay here</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Write the frame styles**

`src/components/app-shell/app-frame.css`, ported from the mock's `shell.css` and scoped to `.af-root` so legacy pages and the marketing site are untouched:

```css
/* Daybreak app frame (GATE D4.2). Tokens: src/styles/daybreak-tokens.css.
   Element-level rules apply only inside .af-db (rail, top bar, tabs, sheets
   and Daybreak page bodies). Legacy page bodies render in .af-legacy with
   their old dark surface (.kl-surface-app) and must not inherit any of this. */
.af-root{--af-rail:230px;min-height:100dvh;display:grid;grid-template-columns:var(--af-rail) minmax(0,1fr);background:var(--db-page);color:var(--db-ink);font:16px/1.5 var(--db-font-body);color-scheme:light}
.af-db h1,.af-db h2,.af-db h3{margin:0;font-family:var(--db-font-display);font-weight:650;letter-spacing:-.025em;color:var(--db-ink)}
.af-db p{margin:0}
.af-db a{color:var(--db-clay);text-underline-offset:4px}
.af-db :is(a,button,input,select,textarea,summary):focus-visible{outline:3px solid var(--db-focus);outline-offset:3px}
.af-db button{font:inherit;color:inherit;cursor:pointer;background:var(--db-card);border:1px solid var(--db-border);border-radius:var(--db-radius-control);min-height:44px;padding:10px 16px}
.af-db button:hover{background:var(--db-sage)}
.af-db button:disabled{cursor:default;opacity:.7}
.af-db svg{flex-shrink:0}
.af-root .af-legacy{max-width:none;margin:0;padding:0;line-height:1.5;color-scheme:dark}
.af-skip{position:absolute;left:8px;top:-80px;z-index:100;padding:12px;background:var(--db-card);color:var(--db-ink)}
.af-skip:focus{top:8px}
.af-sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* Rail */
.af-rail{position:sticky;top:0;height:100dvh;overflow-y:auto;display:flex;flex-direction:column;gap:4px;padding:24px 16px;background:var(--db-card);border-right:1px solid var(--db-border)}
.af-root .af-brand{display:flex;align-items:center;gap:9px;min-height:44px;font:700 23px/1.1 var(--db-font-display);letter-spacing:-.7px;color:var(--db-ink);text-decoration:none;white-space:nowrap}
.af-brand img{border-radius:8px}
.af-root .af-rail-label{margin:28px 12px 6px;font-size:12px;letter-spacing:.08em;color:var(--db-muted);font-weight:700}
.af-root .af-nav-item{display:flex;align-items:center;gap:10px;width:100%;min-height:46px;border:0;border-radius:10px;background:transparent;font-size:14px;line-height:1.3;text-align:start;text-decoration:none;color:var(--db-muted);padding:10px 12px}
.af-root .af-nav-item:hover{background:var(--db-page)}
.af-root .af-nav-item[aria-current=page]{background:var(--db-sage);color:var(--db-green);font-weight:700}
.af-root .af-nav-item svg,.af-root .af-tabs svg,.af-root .af-top-actions svg,.af-root .af-sheet-links svg{width:20px;height:20px}
.af-rail-bottom{margin-top:auto;border-top:1px solid var(--db-border);padding-top:16px}

/* Workspace */
.af-workspace{min-width:0;display:flex;flex-direction:column}
.af-topbar{height:76px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 40px;border-bottom:1px solid var(--db-border);background:var(--db-page)}
.af-top-title{font-size:14px;color:var(--db-muted)}
.af-top-actions{display:flex;gap:8px;align-items:center;margin-inline-start:auto}
.af-root .af-top-actions>*{display:inline-flex;align-items:center;gap:10px;min-height:44px;min-width:44px;padding:8px 12px;background:transparent;border:1px solid transparent;border-radius:12px;font-size:14px;color:var(--db-ink);text-decoration:none}
.af-root .af-brand--phone{display:none}
.af-main{flex:1;width:100%;max-width:1230px;margin:0 auto;padding:38px 40px 24px;outline:none}
.af-foot{width:100%;max-width:1230px;margin:0 auto;padding:8px 40px 26px;font-size:14px;color:var(--db-muted)}
.af-tabs{display:none}

/* Shared primitives for pages rendered inside the frame */
.af-root .af-chip{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid var(--db-border);border-radius:8px;font-size:13px;background:var(--db-card);color:var(--db-green)}
.af-root .af-eyebrow{font-size:12px;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:var(--db-green)}
.af-root .af-caption{font-size:13px;color:var(--db-muted)}
.af-root .af-badge{display:inline-flex;align-items:center;padding:1px 6px;border:1px solid var(--db-green);border-radius:6px;font:700 12px/1.4 var(--db-font-body);letter-spacing:.04em;color:var(--db-green);vertical-align:middle}
.af-root .af-primary{display:inline-flex;align-items:center;justify-content:space-between;gap:20px;min-height:48px;padding:12px 16px;border-radius:12px;border:1px solid var(--db-clay);background:var(--db-clay);color:var(--db-on-clay);font-weight:700;font-size:15px;text-decoration:none}
.af-root .af-primary:hover{background:var(--db-clay-hover)}
.af-root .af-quiet{display:inline-flex;align-items:center;min-height:44px;background:transparent;border:0;padding:0 6px;color:var(--db-clay);font-size:14px;text-decoration:underline;text-underline-offset:4px}
.af-root .af-quiet:hover{background:transparent;color:var(--db-clay-hover)}
.af-root .af-notice{border-inline-start:3px solid var(--db-clay);background:var(--db-apricot);padding:16px;font-size:15px;margin-top:18px}

/* Sheets (native dialog) */
.af-root .af-sheet{width:min(540px,calc(100% - 32px));max-height:90dvh;padding:24px;background:var(--db-page);color:var(--db-ink);border:1px solid var(--db-border);border-radius:22px;box-shadow:var(--db-shadow-raised);overflow:auto}
.af-sheet::backdrop{background:#342a2466}
.af-sheet-top{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:20px}
.af-root .af-sheet-top h2{font-size:26px}
.af-root .af-sheet-top button{width:44px;padding:8px;display:inline-grid;place-items:center}
.af-root .af-sheet label{display:block;font-size:14px;font-weight:700}
.af-sheet-links{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.af-root .af-sheet-links>a,.af-root .af-sheet-links>button{display:flex;align-items:center;gap:10px;min-height:56px;padding:12px;background:var(--db-card);border:1px solid var(--db-border);border-radius:12px;color:var(--db-ink);text-decoration:none;font-size:15px;text-align:start}
.af-sheet-group{margin-top:22px}
.af-root .af-sheet-group h3{font-size:16px;margin-bottom:12px}
.af-root .af-sheet-group p{font-size:14px;color:var(--db-muted);margin-bottom:12px}
.af-sheet-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.af-root .af-search{width:100%;min-height:48px;border:1px solid var(--db-border);border-radius:12px;padding:12px;margin:8px 0 18px;background:var(--db-card);font:inherit;color:var(--db-ink)}

@media (max-width:1100px){
 .af-root{--af-rail:208px}
 .af-main{padding:30px 28px}
 .af-topbar{padding-inline:28px}
}
@media (max-width:700px){
 .af-root{display:block}
 .af-rail{display:none}
 .af-topbar{height:72px;padding:12px 18px}
 .af-root .af-brand--phone{display:flex;font-size:21px}
 .af-top-title,.af-desktop-only{display:none}
 .af-root .af-top-actions>*{padding:6px}
 .af-main{padding:24px 18px 16px}
 .af-workspace{padding-bottom:calc(80px + env(safe-area-inset-bottom))}
 .af-foot{padding:8px 18px 16px}
 .af-root .af-tabs{position:fixed;z-index:20;inset:auto 0 0;display:grid;grid-template-columns:repeat(4,1fr);padding:6px 8px max(8px,env(safe-area-inset-bottom));background:var(--db-card);border-top:1px solid var(--db-border);box-shadow:0 -3px 12px #342a2408}
 .af-root .af-tabs>*{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:58px;padding:6px 2px;border:0;border-radius:10px;background:transparent;color:var(--db-muted);font-size:14px;text-decoration:none}
 .af-root .af-tabs>[aria-current=page]{background:var(--db-sage);color:var(--db-green);font-weight:700}
 .af-root .af-sheet{width:100%;max-width:none;max-height:88dvh;margin:auto 0 0;border-radius:22px 22px 0 0;border-bottom:0;padding:22px 18px max(28px,env(safe-area-inset-bottom))}
 .af-root .af-sheet-links>a,.af-root .af-sheet-links>button{font-size:14px;min-height:54px}
}
@media (prefers-reduced-motion:reduce){.af-db,.af-db *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/components/app-shell/__tests__/AppFrame.test.tsx`
Expected: PASS. 1 test file, 12 tests passed.

- [ ] **Step 7: Commit**

```bash
git add src/components/app-shell/AppFrame.tsx src/components/app-shell/Sheet.tsx src/components/app-shell/AiBadge.tsx src/components/app-shell/coach-actions.ts src/components/app-shell/app-frame.css src/components/app-shell/__tests__/AppFrame.test.tsx
git commit -m "feat(shell): Daybreak app frame with rail, phone tabs and sheets" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---
### Task 4: Mount the frame on every app route

**Files:**
- Create: `src/components/app-shell/load-shell-stage.ts`
- Rewrite: `src/components/nav/AppShell.tsx`
- Modify: `src/app/cc/layout.tsx` (replace `deriveVariant` and the inline query)
- Modify: `src/app/counselor/layout.tsx`, `src/app/engagements/layout.tsx`, `src/app/schools/layout.tsx`, `src/app/profile/layout.tsx`
- Create: `src/app/applications/layout.tsx`, `src/app/settings/layout.tsx`
- Modify: `src/app/providers.tsx:16-44` (export `AppLayout`; skip TopNav on framed routes)
- Modify: `src/components/cc/coach/CoachKairosShell.tsx:51-67` (no floating gold button on framed routes; give it a name)
- Delete: `src/components/nav/Sidebar.tsx`
- Test: `src/components/app-shell/__tests__/mount.test.tsx`

**Interfaces:**
- Consumes: `AppFrame` (Task 3); `APP_FRAME_PREFIXES`, `usesAppFrame`, `shellStageFor`, `ShellStage` (Task 1).
- Produces:
  - `loadShellStage(): Promise<ShellStage>` (server only)
  - `AppShell(props: { grade: ShellStage; audience?: "student" | "staff"; children: ReactNode })`
  - `export function AppLayout({ children })` from `src/app/providers.tsx` (the test seam)

- [ ] **Step 1: Write the failing test**

`src/components/app-shell/__tests__/mount.test.tsx`:

```tsx
// The frame must replace TopNav exactly where it renders: a route with neither
// would have no navigation at all, and a route with both would stack a navy
// header on the Daybreak rail.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";

const h = vi.hoisted(() => ({ pathname: "/cc/dashboard" }));
vi.mock("next/navigation", () => ({ usePathname: () => h.pathname, useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "u1" }, loading: false }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/contexts/CoachKairosContext", () => ({
  useCoachKairos: () => ({
    isOpen: false, toggle: vi.fn(), close: vi.fn(), isStreaming: false, language: "en", setLanguage: vi.fn(),
    voiceEnabled: false, setVoiceEnabled: vi.fn(), isSpeaking: false, stopSpeaking: vi.fn(),
    familyMode: false, toggleFamilyMode: vi.fn(),
  }),
  CoachKairosProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/layout/TopNav", () => ({ default: () => <nav data-testid="topnav" /> }));
vi.mock("@/components/cc/coach/CoachChat", () => ({ default: () => null }));
vi.mock("@/components/family-mode/FamilyModeView", () => ({ default: () => null }));
vi.mock("@/components/family-mode/HandToParentButton", () => ({ default: () => null }));
vi.mock("@/components/cc/WorkingLatePrompt", () => ({ default: () => null }));
vi.mock("@/components/nav/CommandPalette", () => ({ default: () => null }));
vi.mock("@/components/ui/ShortcutsHelp", () => ({ default: () => null }));
vi.mock("@/components/feedback/SurveyPrompt", () => ({ default: () => null }));
vi.mock("@/components/app-shell/AppFrame", () => ({
  default: ({ stage, audience, children }: { stage: string; audience?: string; children: React.ReactNode }) => (
    <div data-testid="frame" data-stage={stage} data-audience={audience ?? "student"}>{children}</div>
  ),
}));

import { APP_FRAME_PREFIXES } from "../app-nav";
import AppShell from "@/components/nav/AppShell";
import CoachKairosShell from "@/components/cc/coach/CoachKairosShell";
import { AppLayout } from "@/app/providers";

beforeEach(() => { h.pathname = "/cc/dashboard"; });

describe("mounting the frame", () => {
  it("gives every framed prefix a layout that renders AppShell", () => {
    for (const prefix of APP_FRAME_PREFIXES) {
      const file = `src/app${prefix}/layout.tsx`;
      expect(fs.existsSync(file), file).toBe(true);
      expect(fs.readFileSync(file, "utf8"), file).toMatch(/<AppShell\b/);
    }
  });

  it("drops the navy TopNav where the frame renders, and keeps it elsewhere", () => {
    const { unmount } = render(<AppLayout><p>page</p></AppLayout>);
    expect(screen.queryByTestId("topnav")).toBeNull();
    expect(screen.getByText("page")).toBeTruthy();
    unmount();
    h.pathname = "/my-schools";
    render(<AppLayout><p>page</p></AppLayout>);
    expect(screen.getByTestId("topnav")).toBeTruthy();
  });

  it("hides the floating gold Coach button where the rail and tabs already offer Coach", () => {
    const { unmount } = render(<CoachKairosShell />);
    expect(screen.queryByRole("button", { name: "Open Coach Kairos" })).toBeNull();
    unmount();
    h.pathname = "/my-schools";
    render(<CoachKairosShell />);
    expect(screen.getByRole("button", { name: "Open Coach Kairos" })).toBeTruthy();
  });

  it("hands the stage and audience to the frame", () => {
    render(<AppShell grade="g9" audience="staff"><p>page</p></AppShell>);
    const frame = screen.getByTestId("frame");
    expect(frame.dataset.stage).toBe("g9");
    expect(frame.dataset.audience).toBe("staff");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/app-shell/__tests__/mount.test.tsx`
Expected: FAIL. `AppLayout` is not exported yet, so rendering it fails with `Element type is invalid … got: undefined`. The layout check fails on `src/app/schools/layout.tsx` (no `<AppShell`), and `src/app/applications/layout.tsx` and `src/app/settings/layout.tsx` don't exist yet. The CoachKairosShell check fails with `Unable to find an accessible element with the role "button" and name "Open Coach Kairos"`.

- [ ] **Step 3: Server stage loader**

`src/components/app-shell/load-shell-stage.ts`:

```ts
// Server-only: the signed-in student's stage for the frame's rail. Duplicate
// cc_student_profiles rows exist (no unique user_id), so read one row
// deterministically instead of maybeSingle(), which errors on duplicates.
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { shellStageFor, type ShellStage } from "./app-nav";

export async function loadShellStage(): Promise<ShellStage> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "unknown";
  const { data } = await supabase
    .from("cc_student_profiles")
    .select("id, grade_level, is_transfer_student")
    .eq("user_id", user.id)
    .order("id")
    .limit(1);
  const row = (data?.[0] ?? null) as { grade_level: number | null; is_transfer_student: boolean | null } | null;
  return shellStageFor(row);
}
```

- [ ] **Step 4: AppShell and the layouts**

`src/components/nav/AppShell.tsx` (whole file):

```tsx
// Shared wrapper for signed-in app routes (GATE D4.2). Renders the Daybreak
// AppFrame. Layouts pass the student's stage (loadShellStage) or
// audience="staff" for counselor routes. CommandPalette stays mounted once,
// globally, in providers.tsx.
import type { ReactNode } from "react";
import AppFrame from "@/components/app-shell/AppFrame";
import type { ShellStage } from "@/components/app-shell/app-nav";

export default function AppShell({
  grade,
  audience = "student",
  children,
}: {
  grade: ShellStage;
  audience?: "student" | "staff";
  children: ReactNode;
}) {
  return <AppFrame stage={grade} audience={audience}>{children}</AppFrame>;
}
```

`src/app/cc/layout.tsx` (whole file):

```tsx
// /cc/* layout: every College Counselor surface renders inside the Daybreak
// app frame. The rail's stage comes from the student's profile (server-side).
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export const metadata = {
  title: "College Counselor — KairosLearn",
  description: "Your AI-powered college application toolkit",
};

export default async function CCLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
```

`src/app/counselor/layout.tsx` (whole file):

```tsx
// /counselor/* layout: the counselor workspace in the Daybreak app frame.
// audience="staff" renders counselor navigation from the first paint; Team &
// invites appears once useCounselorRole confirms a head.
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";

export default function CounselorLayout({ children }: { children: ReactNode }) {
  return <AppShell grade="unknown" audience="staff">{children}</AppShell>;
}
```

`src/app/engagements/layout.tsx` (whole file):

```tsx
// /engagements/* layout: shared by the counselor and the student party. The
// frame switches to counselor navigation when useCounselorRole finds one.
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export default async function EngagementsLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
```

`src/app/schools/layout.tsx` (whole file):

```tsx
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export const metadata = {
  title: "Browse Schools — Coach Kairos",
  description: "Search and explore colleges to build your list",
};

export default async function SchoolsLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
```

`src/app/profile/layout.tsx` (whole file):

```tsx
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export const metadata = {
  title: "Your Profile — Coach Kairos",
  description: "Build your college application profile",
};

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
```

`src/app/applications/layout.tsx` (new):

```tsx
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export default async function ApplicationsLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
```

`src/app/settings/layout.tsx` (new):

```tsx
import type { ReactNode } from "react";
import AppShell from "@/components/nav/AppShell";
import { loadShellStage } from "@/components/app-shell/load-shell-stage";

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  return <AppShell grade={await loadShellStage()}>{children}</AppShell>;
}
```

- [ ] **Step 5: providers.tsx and CoachKairosShell**

In `src/app/providers.tsx`, import the predicate and export `AppLayout`:

```tsx
import { usesAppFrame } from "@/components/app-shell/app-nav";
```

```tsx
/** AppLayout — TopNav above the page, except where the page owns its chrome:
 *  marketing pages, the anonymous homepage, and every framed app route
 *  (APP_FRAME_PREFIXES), whose layout renders the Daybreak AppFrame. */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isDaybreakHome = (pathname === "/" || pathname === "/welcome") && !user;
  // MarketingShell pages carry their own sticky marketing nav — mounting the
  // global TopNav above it produced a stacked double header with duplicate
  // sign-in CTAs on /product/* (and /pricing, /stories).
  const hasOwnMarketingNav =
    (pathname?.startsWith("/product/") ?? false) ||
    pathname === "/pricing" ||
    pathname === "/stories";

  if (hasOwnMarketingNav || isDaybreakHome || usesAppFrame(pathname)) {
    return <>{children}</>;
  }
  // (the existing TopNav return below is unchanged)
```

(Only the `function` line gains `export`, the doc comment is replaced, and the `if` gains `|| usesAppFrame(pathname)`. The TopNav branch stays as it is.)

In `src/components/cc/coach/CoachKairosShell.tsx`, add the import:

```tsx
import { usesAppFrame } from "@/components/app-shell/app-nav";
```

and change the floating button block (lines 51–67) to:

```tsx
      <AnimatePresence>
        {!isOpen && !usesAppFrame(pathname) && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggle}
            aria-label="Open Coach Kairos"
            className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center hover:bg-[#C4A030] transition-colors group"
          >
```

(The rest of the button is unchanged. The drawer itself is still the dark D4.3 surface and is restyled in that gate.)

Delete the old sidebar, which nothing imports now:

```bash
git rm src/components/nav/Sidebar.tsx
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run src/components/app-shell src/components/nav src/__tests__/retired-links.test.ts`
Expected: PASS. All app-shell tests (app-nav, AppFrame, mount), nav-links, command-palette-event and retired-links pass. `mount.test.tsx` has 4 tests passing.

Run: `npx tsc --noEmit -p .`
Expected: exit 0, no output. (It catches any leftover `@/components/nav/Sidebar` import. `src/app/cc/layout.tsx` imported `SidebarGrade` from it and was rewritten in Step 4.)

- [ ] **Step 7: Commit**

```bash
git add src/components/app-shell/load-shell-stage.ts src/components/app-shell/__tests__/mount.test.tsx src/components/nav/AppShell.tsx src/app/cc/layout.tsx src/app/counselor/layout.tsx src/app/engagements/layout.tsx src/app/schools/layout.tsx src/app/profile/layout.tsx src/app/applications/layout.tsx src/app/settings/layout.tsx src/app/providers.tsx src/components/cc/coach/CoachKairosShell.tsx
git commit -m "feat(shell): mount the Daybreak frame on app routes; retire TopNav and Sidebar there" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

(`git rm` in Step 5 already staged the Sidebar deletion.)

---
### Task 5: Today's data and view model

**Files:**
- Create: `src/lib/format-iso-date.ts`
- Create: `src/app/cc/dashboard/today-input.ts`
- Create: `src/app/cc/dashboard/today-model.ts`
- Test: `src/app/cc/dashboard/__tests__/today-model.test.ts`

**Interfaces:**
- Consumes: `type VariantKey` from `src/app/cc/dashboard/variants.ts`; `isGrade9BlockedPath` (test only).
- Produces (Task 6 renders these; Task 7 reuses `formatIsoDate`):
  - `formatIsoDate(value: string | null | undefined): string | null`
  - `type RawSchoolRow`, `type RawDashboardRows`, `type StatusCounts`, `type TodayInput`
  - `deriveTodayInput(raw: RawDashboardRows, todayIso: string): TodayInput`
  - `type TodayRow = { id: string; label: string; detail: string; href: string }`
  - `type TodayStep = { eyebrow: string; title: string; body: string; cta: { label: string; href: string }; basis: string }`
  - `type TodayModel = { variantKey; stageLabel; headline: [string, string]; intro; step: TodayStep | null; rowsTitle; rows: TodayRow[]; askGrade; grade9; blockedNotice; suggestionsOn; observation: { eyebrow: string; text: string } | null; unavailable: boolean }`
  - `buildTodayModel(variant: VariantKey, input: TodayInput): TodayModel`

Copy source: the mock's `states.js` (headline, intro, eyebrow, step, body and CTA per stage), with the fixture wording ("in this preview", "Nothing added…") replaced by statements computed from the student's rows. Where a row has no data behind it (interests, coursework, cost questions), it keeps the mock's authored guidance and makes no claim about the student.

- [ ] **Step 1: Write the failing test**

`src/app/cc/dashboard/__tests__/today-model.test.ts`:

```ts
// Today's view model. It must only say what the rows say: a failed read is
// "Couldn't load", an empty list is empty, a stored date is the stored day,
// and nothing claims Coach writes essays.
import { describe, it, expect } from "vitest";
import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";
import { formatIsoDate } from "@/lib/format-iso-date";
import { deriveTodayInput, type RawDashboardRows, type RawSchoolRow, type TodayInput } from "../today-input";
import { buildTodayModel } from "../today-model";
import type { VariantKey } from "../variants";

const VARIANTS: VariantKey[] = ["g9", "g10", "junior", "senior_writing", "senior_post_submit", "senior_decisions", "transfer", "unknown"];

const raw = (over: Partial<RawDashboardRows> = {}): RawDashboardRows => ({
  profile: { preferred_name: null, transfer_current_school: null, transfer_target_term: null, transfer_credits_completed: null, dashboard_observations_enabled: null },
  schools: [], essays: [], activities: [], observations: [], blocked: false, ...over,
});
const empty: TodayInput = deriveTodayInput(raw(), "2026-09-27");
const school = (name: string, over: Partial<RawSchoolRow> = {}): RawSchoolRow => ({ application_status: null, cc_schools: { name }, ...over });

describe("formatIsoDate", () => {
  it("formats stored dates without a timezone", () => {
    expect(formatIsoDate("2026-11-01")).toBe("Nov 1, 2026");
    expect(formatIsoDate("2026-11-01T23:30:00Z")).toBe("Nov 1, 2026"); // the stored day, never shifted
    expect(formatIsoDate("2027-01-15T00:00:00-08:00")).toBe("Jan 15, 2027");
    expect(formatIsoDate("")).toBeNull();
    expect(formatIsoDate("soon")).toBeNull();
    expect(formatIsoDate("2026-13-01")).toBeNull();
  });
});

describe("deriveTodayInput", () => {
  it("reports a failed read as unavailable, never as zero", () => {
    const i = deriveTodayInput(raw({ schools: null, essays: null, activities: null }), "2026-09-27");
    expect(i.schoolCount).toBeNull();
    expect(i.statusCounts).toBeNull();
    expect(i.essaysTotal).toBeNull();
    expect(i.activitiesCount).toBeNull();
    const m = buildTodayModel("junior", i);
    expect(m.unavailable).toBe(true);
    const partial = buildTodayModel("junior", deriveTodayInput(raw({ schools: null }), "2026-09-27"));
    expect(partial.unavailable).toBe(false);
    const list = partial.rows.find((r) => r.id === "schools")!;
    expect(list.detail).toMatch(/Couldn't load/);
    expect(list.detail).not.toMatch(/\b0\b/);
  });

  it("picks the earliest saved deadline from today on and ignores past dates", () => {
    const i = deriveTodayInput(raw({ schools: [
      school("Old State", { deadline_rd: "2026-01-05" }),
      school("North College", { deadline_ea: "2026-11-01", deadline_rd: "2027-01-15" }),
      school("South University", { deadline_ed: "2026-09-27" }),
    ] }), "2026-09-27");
    expect(i.nextDeadline).toEqual({ schoolName: "South University", label: "ED", date: "2026-09-27" });
  });

  it("counts each decision status on its own", () => {
    const i = deriveTodayInput(raw({ schools: [
      school("A", { application_status: "accepted" }), school("B", { application_status: "rejected" }),
      school("C", { application_status: "waitlisted" }), school("D", { application_status: "deferred" }),
      school("E", { application_status: "submitted" }), school("F", { application_status: "deposited" }),
    ] }), "2026-09-27");
    expect(i.statusCounts).toEqual({ submitted: 1, accepted: 1, rejected: 1, waitlisted: 1, deferred: 1, deposited: 1 });
  });

  it("drops observations when the student turned suggestions off", () => {
    const obs = [{ module_label: "Essays", observation: "Your outline has three stories.", eyebrow: "Noticed" }];
    expect(deriveTodayInput(raw({ observations: obs }), "2026-09-27").observation).toEqual({ eyebrow: "Noticed", text: "Your outline has three stories." });
    const off = deriveTodayInput(raw({ observations: obs, profile: { ...raw().profile, dashboard_observations_enabled: false } }), "2026-09-27");
    expect(off.observation).toBeNull();
    expect(buildTodayModel("junior", off).suggestionsOn).toBe(false);
  });
});

describe("buildTodayModel", () => {
  it("never sends grade 9 to a blocked page", () => {
    const m = buildTodayModel("g9", empty);
    const hrefs = [m.step!.cta.href, ...m.rows.map((r) => r.href)];
    expect(hrefs.filter((h) => isGrade9BlockedPath(h.split(/[?#]/)[0]))).toEqual([]);
    expect(m.grade9).toBe(true);
  });

  it("invents no numbers or dates for an empty account", () => {
    for (const v of VARIANTS) {
      const m = buildTodayModel(v, empty);
      for (const r of m.rows) expect(r.detail, `${v}/${r.id}`).not.toMatch(/\d/);
      expect(m.step?.basis ?? "", v).not.toMatch(/\d/);
    }
  });

  it("shows the next saved date as the stored calendar day", () => {
    const i = { ...empty, schoolCount: 2, nextDeadline: { schoolName: "North College", label: "EA", date: "2026-11-01" } };
    const row = buildTodayModel("junior", i).rows.find((r) => r.id === "applications")!;
    expect(row.detail).toContain("North College EA, Nov 1, 2026");
    expect(row.detail).toMatch(/official/);
  });

  it("lets saved work replace the generic starting point", () => {
    const m = buildTodayModel("senior_writing", { ...empty, essaysTotal: 1, essaysFinal: 0, personalStatementPhase: "outline" });
    expect(m.step!.eyebrow).toBe("Continue your work · Outline");
    expect(m.headline).toEqual(["Welcome back.", "Pick up your thread."]);
    const junior = buildTodayModel("junior", { ...empty, schoolCount: 3 });
    expect(junior.step!.cta).toEqual({ label: "Open my school list", href: "/schools" });
    expect(junior.step!.basis).toBe("Based on the 3 schools on your list.");
  });

  it("keeps each decision distinct and assumes no offer", () => {
    const m = buildTodayModel("senior_decisions", { ...empty, schoolCount: 4, statusCounts: { submitted: 0, accepted: 1, rejected: 1, waitlisted: 1, deferred: 1, deposited: 0 } });
    const row = m.rows.find((r) => r.id === "decisions")!;
    expect(row.detail).toBe("1 accepted · 1 waitlisted · 1 deferred · 1 not admitted.");
  });

  it("keeps unfinished essays in view after a submission", () => {
    const m = buildTodayModel("senior_post_submit", { ...empty, schoolCount: 2, statusCounts: { submitted: 1, accepted: 0, rejected: 0, waitlisted: 0, deferred: 0, deposited: 0 }, essaysTotal: 3, essaysFinal: 1 });
    expect(m.rows.map((r) => r.id)).toEqual(["submitted", "essays", "cost"]);
    expect(m.rows[0].detail).toBe("1 application marked submitted. Check receipt in each school's official portal.");
    expect(m.rows[1].detail).toBe("3 essays in Essay Studio, 1 marked final or submitted.");
  });

  it("describes transfer credits as recorded, never as transferable", () => {
    const m = buildTodayModel("transfer", { ...empty, transfer: { currentSchool: "Lakeside Community College", targetTerm: "Fall 2027", creditsCompleted: 30 } });
    expect(m.rowsTitle).toBe("Your transfer details");
    expect(m.rows.map((r) => r.detail)).toEqual([
      "Lakeside Community College",
      "Fall 2027",
      "30 credits completed, as you recorded them. Each college decides what transfers.",
    ]);
    expect(m.step!.cta.href).toBe("/cc/essays?type=transfer");
    const blank = buildTodayModel("transfer", empty);
    expect(blank.step!.cta.href).toBe("/cc/transfer-profile");
    expect(blank.rows[0].detail).toBe("Not added yet.");
  });

  it("asks an unknown-grade student one question instead of guessing", () => {
    const m = buildTodayModel("unknown", empty);
    expect(m.askGrade).toBe(true);
    expect(m.step).toBeNull();
    expect(m.grade9).toBe(false);
  });

  it("never claims Coach writes the essay, and never says 'preview'", () => {
    for (const v of VARIANTS) {
      const text = JSON.stringify(buildTodayModel(v, { ...empty, personalStatementPhase: "draft", transfer: { currentSchool: "X", targetTerm: null, creditsCompleted: null } }));
      expect(text, v).not.toMatch(/(coach|kairos|we|ai)\s+(will\s+)?(write|draft)s?\s+(your|the|an?)\s+(essay|statement)/i);
      expect(text, v).not.toMatch(/preview/i);
    }
  });

  it("carries the blocked-link flag through to the view", () => {
    expect(buildTodayModel("g9", deriveTodayInput(raw({ blocked: true }), "2026-09-27")).blockedNotice).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/app/cc/dashboard/__tests__/today-model.test.ts`
Expected: FAIL with `Failed to resolve import "@/lib/format-iso-date"`.

- [ ] **Step 3: Date formatter**

`src/lib/format-iso-date.ts`:

```ts
// "2026-11-01" or "2026-11-01T…" → "Nov 1, 2026". String-only on purpose: it
// never constructs a Date, so the server (UTC) and every browser render the
// same text. Timezone-shifted rendering of stored dates, plus clock-dependent
// text, is what React #418 hydration mismatches are made of. Returns null for
// anything that isn't a calendar date.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatIsoDate(value: string | null | undefined): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${MONTHS[month - 1]} ${day}, ${m[1]}`;
}
```

- [ ] **Step 4: Rows → input**

`src/app/cc/dashboard/today-input.ts`:

```ts
// Pure: the rows /cc/dashboard already reads → what Today may say. A null
// list means the read failed (shown as "Couldn't load"), which is different
// from an empty list. `todayIso` is the server's YYYY-MM-DD; ISO dates compare
// correctly as strings, so no Date object is needed here.
export type DeadlineKey =
  | "deadline_ea" | "deadline_ed" | "deadline_edii" | "deadline_rea" | "deadline_rd"
  | "deadline_financial_aid" | "deadline_css_profile" | "deadline_fafsa";

export type RawSchoolRow = { application_status: string | null; cc_schools: { name?: string } | { name?: string }[] | null } &
  Partial<Record<DeadlineKey, string | null>>;

export type RawDashboardRows = {
  profile: {
    preferred_name: string | null;
    transfer_current_school: string | null;
    transfer_target_term: string | null;
    transfer_credits_completed: number | null;
    dashboard_observations_enabled: boolean | null;
  };
  schools: RawSchoolRow[] | null;
  essays: { phase: string | null; essay_type: string | null }[] | null;
  activities: { id: string }[] | null;
  observations: { module_label: string; observation: string; eyebrow: string }[] | null;
  blocked: boolean;
};

export type StatusCounts = { submitted: number; accepted: number; rejected: number; waitlisted: number; deferred: number; deposited: number };

export type TodayInput = {
  preferredName: string | null;
  schoolCount: number | null;
  nextDeadline: { schoolName: string; label: string; date: string } | null;
  statusCounts: StatusCounts | null;
  essaysTotal: number | null;
  essaysFinal: number | null;
  personalStatementPhase: string | null;
  activitiesCount: number | null;
  transfer: { currentSchool: string | null; targetTerm: string | null; creditsCompleted: number | null };
  observationsEnabled: boolean;
  observation: { eyebrow: string; text: string } | null;
  blockedNotice: boolean;
};

const DEADLINES: Array<[DeadlineKey, string]> = [
  ["deadline_ea", "EA"], ["deadline_ed", "ED"], ["deadline_edii", "EDII"], ["deadline_rea", "REA"],
  ["deadline_rd", "RD"], ["deadline_financial_aid", "financial aid"], ["deadline_css_profile", "CSS Profile"],
  ["deadline_fafsa", "FAFSA"],
];

const STATUSES: Array<keyof StatusCounts> = ["submitted", "accepted", "rejected", "waitlisted", "deferred", "deposited"];

export function deriveTodayInput(raw: RawDashboardRows, todayIso: string): TodayInput {
  const { schools, essays, activities } = raw;

  let nextDeadline: TodayInput["nextDeadline"] = null;
  for (const s of schools ?? []) {
    const school = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
    for (const [key, label] of DEADLINES) {
      const day = (s[key] ?? "").slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < todayIso) continue;
      if (!nextDeadline || day < nextDeadline.date) {
        nextDeadline = { schoolName: school?.name ?? "A saved school", label, date: day };
      }
    }
  }

  let statusCounts: StatusCounts | null = null;
  if (schools) {
    statusCounts = { submitted: 0, accepted: 0, rejected: 0, waitlisted: 0, deferred: 0, deposited: 0 };
    for (const s of schools) {
      const st = s.application_status as keyof StatusCounts | null;
      if (st && STATUSES.includes(st)) statusCounts[st] += 1;
    }
  }

  const observationsEnabled = raw.profile.dashboard_observations_enabled !== false;
  const firstObservation = observationsEnabled
    ? [...(raw.observations ?? [])].sort((a, b) => a.module_label.localeCompare(b.module_label))[0]
    : undefined;

  return {
    preferredName: raw.profile.preferred_name,
    schoolCount: schools ? schools.length : null,
    nextDeadline,
    statusCounts,
    essaysTotal: essays ? essays.length : null,
    essaysFinal: essays ? essays.filter((e) => e.phase === "submitted" || e.phase === "final").length : null,
    personalStatementPhase: essays?.find((e) => e.essay_type === "personal_statement")?.phase ?? null,
    activitiesCount: activities ? activities.length : null,
    transfer: {
      currentSchool: raw.profile.transfer_current_school?.trim() || null,
      targetTerm: raw.profile.transfer_target_term?.trim() || null,
      creditsCompleted: raw.profile.transfer_credits_completed ?? null,
    },
    observationsEnabled,
    observation: firstObservation ? { eyebrow: firstObservation.eyebrow, text: firstObservation.observation } : null,
    blockedNotice: raw.blocked,
  };
}
```

- [ ] **Step 5: Input → view model**

`src/app/cc/dashboard/today-model.ts`:

```ts
// Pure: (stage, TodayInput) → everything Today renders, as plain strings.
// Stage copy is authored (from the approved mock, GATE D4.2); every count,
// name, status and date comes from TodayInput. No Date, no locale, no clock:
// the server and the browser must produce identical text.
import type { VariantKey } from "./variants";
import type { TodayInput } from "./today-input";
import { formatIsoDate } from "@/lib/format-iso-date";

export type TodayRow = { id: string; label: string; detail: string; href: string };
export type TodayStep = { eyebrow: string; title: string; body: string; cta: { label: string; href: string }; basis: string };
export type TodayModel = {
  variantKey: VariantKey;
  stageLabel: string;
  headline: [string, string];
  intro: string;
  step: TodayStep | null;
  rowsTitle: string;
  rows: TodayRow[];
  askGrade: boolean;
  grade9: boolean;
  blockedNotice: boolean;
  suggestionsOn: boolean;
  observation: { eyebrow: string; text: string } | null;
  unavailable: boolean;
};

const UNAVAILABLE = "Couldn't load this right now. Your saved work is unchanged.";
const WRITING_PHASES = new Set(["brainstorm", "outline", "draft", "revise"]);

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const phaseLabel = (p: string) => p.charAt(0).toUpperCase() + p.slice(1).replace(/_/g, " ");

function schoolsRow(i: TodayInput, emptyText = "No schools saved yet. Start with possibilities, not rankings."): TodayRow {
  const detail = i.schoolCount === null ? UNAVAILABLE : i.schoolCount === 0 ? emptyText : `${count(i.schoolCount, "school", "schools")} saved.`;
  return { id: "schools", label: "School list", detail, href: "/schools" };
}

function deadlinesRow(i: TodayInput): TodayRow {
  let detail: string;
  if (i.schoolCount === null) detail = UNAVAILABLE;
  else if (i.nextDeadline) {
    detail = `Next saved date: ${i.nextDeadline.schoolName} ${i.nextDeadline.label}, ${formatIsoDate(i.nextDeadline.date)}. Confirm it on the school's official site.`;
  } else if (i.schoolCount > 0) detail = "No upcoming dates saved for your schools. Check each school's official requirements.";
  else detail = "Dates appear here after you save schools.";
  return { id: "applications", label: "Applications & deadlines", detail, href: "/applications" };
}

function essaysRow(i: TodayInput, label = "Essays"): TodayRow {
  let detail: string;
  if (i.essaysTotal === null) detail = UNAVAILABLE;
  else if (i.essaysTotal === 0) detail = "No essays started yet. Your notes, structure and student-written draft live here.";
  else {
    const ps = i.personalStatementPhase ? ` Personal statement: ${phaseLabel(i.personalStatementPhase)}.` : "";
    detail = `${count(i.essaysTotal, "essay", "essays")} in Essay Studio, ${i.essaysFinal ?? 0} marked final or submitted.${ps}`;
  }
  return { id: "essays", label, detail, href: "/cc/essays" };
}

function activitiesRow(i: TodayInput): TodayRow {
  const detail = i.activitiesCount === null
    ? UNAVAILABLE
    : i.activitiesCount === 0
      ? "Work, family responsibilities and interests count as experiences."
      : `${count(i.activitiesCount, "activity", "activities")} recorded.`;
  return { id: "activities", label: "Activities", detail, href: "/cc/activities-optimizer" };
}

function decisionsRow(i: TodayInput): TodayRow {
  let detail: string;
  if (!i.statusCounts) detail = UNAVAILABLE;
  else {
    const c = i.statusCounts;
    const parts = [
      c.accepted && `${c.accepted} accepted`,
      c.deposited && `${c.deposited} deposit recorded`,
      c.waitlisted && `${c.waitlisted} waitlisted`,
      c.deferred && `${c.deferred} deferred`,
      c.rejected && `${c.rejected} not admitted`,
      c.submitted && `${c.submitted} still waiting`,
    ].filter(Boolean);
    detail = parts.length ? `${parts.join(" · ")}.` : "No decisions recorded yet.";
  }
  return { id: "decisions", label: "Application decisions", detail, href: "/applications" };
}

function submittedRow(i: TodayInput): TodayRow {
  const detail = !i.statusCounts
    ? UNAVAILABLE
    : i.statusCounts.submitted > 0
      ? `${count(i.statusCounts.submitted, "application", "applications")} marked submitted. Check receipt in each school's official portal.`
      : "Mark an application submitted to keep track of it here.";
  return { id: "submitted", label: "Submitted applications", detail, href: "/applications" };
}

const COURSEWORK = (detail: string): TodayRow => ({ id: "coursework", label: "High-school coursework", detail, href: "/cc/courses" });
const COST: TodayRow = { id: "cost", label: "Cost questions", detail: "Collect confirmed awards; leave missing amounts unknown.", href: "/cc/net-price" };

type Stage = Omit<TodayModel, "variantKey" | "askGrade" | "grade9" | "blockedNotice" | "suggestionsOn" | "observation" | "unavailable">;

function stage(v: VariantKey, i: TodayInput): Stage {
  switch (v) {
    case "g9":
      return {
        stageLabel: "Grade 9 · Explore",
        headline: ["Start with what", "makes you curious."],
        intro: "There is room to explore. You don't need an application plan today.",
        step: {
          eyebrow: "A small place to start",
          title: "Notice what holds your attention.",
          body: "An interest, a class, something you do outside school. Start with what feels like you.",
          cta: { label: "Explore my interests", href: "/cc/majors" },
          basis: "Based on your grade. Nothing about your activities is assumed.",
        },
        rowsTitle: "Keep things in view",
        rows: [
          { id: "interests", label: "Your interests", detail: "Explore majors and what studying them involves.", href: "/cc/majors" },
          COURSEWORK("Choose a manageable path with your school counselor."),
          activitiesRow(i),
        ],
      };
    case "g10":
      return {
        stageLabel: "Grade 10 · Explore possibilities",
        headline: ["Let your interests", "lead somewhere."],
        intro: "Keep exploring. Give the things you care about a little more shape.",
        step: {
          eyebrow: "One useful next step",
          title: "Put an interest into words.",
          body: "What do you enjoy doing, and what would you like to understand better? You can start without a career picked out.",
          cta: { label: "Explore possible majors", href: "/cc/majors" },
          basis: "Based on your grade. Not a prediction of fit.",
        },
        rowsTitle: "Keep things in view",
        rows: [schoolsRow(i, "Add possibilities when you're ready."), COURSEWORK("Plan in the context of your school and region."), activitiesRow(i)],
      };
    case "junior": {
      const has = (i.schoolCount ?? 0) > 0;
      return {
        stageLabel: "Grade 11 · Make a plan",
        headline: ["A little clarity.", "A good next step."],
        intro: "You don't have to solve the whole application today.",
        step: has
          ? {
              eyebrow: "Pick up where you are",
              title: "Keep shaping your school list.",
              body: "Look at the place, the learning and the cost for each school. Add or remove options as your answers change.",
              cta: { label: "Open my school list", href: "/schools" },
              basis: `Based on the ${count(i.schoolCount ?? 0, "school", "schools")} on your list.`,
            }
          : {
              eyebrow: "A place to begin",
              title: "What matters to you in a college?",
              body: "Start with the place, the learning and the cost. Then build a school list around your answers.",
              cta: { label: "Start my school list", href: "/schools" },
              basis: i.schoolCount === null
                ? "Starting-point suggestion. We couldn't load your saved schools just now."
                : "Starting-point suggestion. You haven't saved any schools yet.",
            },
        rowsTitle: "Keep things in view",
        rows: [schoolsRow(i), deadlinesRow(i), activitiesRow(i)],
      };
    }
    case "senior_writing": {
      const phase = i.personalStatementPhase && WRITING_PHASES.has(i.personalStatementPhase) ? phaseLabel(i.personalStatementPhase) : null;
      return {
        stageLabel: "Grade 12 · Preparing",
        headline: phase ? ["Welcome back.", "Pick up your thread."] : ["Your application.", "Your own voice."],
        intro: phase ? "Your next step can begin with work you've already done." : "Choose one piece to work on. Leave the rest for its own moment.",
        step: phase
          ? {
              eyebrow: `Continue your work · ${phase}`,
              title: "Return to your personal statement.",
              body: "Read your notes and the structure you chose. Keep what still fits, and write the draft in your own words.",
              cta: { label: "Continue in Essay Studio", href: "/cc/essays" },
              basis: `Based on your personal statement's saved phase: ${phase}.`,
            }
          : {
              eyebrow: "One useful next step",
              title: "Find the experience you want to understand.",
              body: "Talk it through, collect your notes and choose a structure. Every sentence of the essay stays yours to write.",
              cta: { label: "Open Essay Studio", href: "/cc/essays" },
              basis: "Based on the preparing stage. No personal statement in progress yet.",
            },
        rowsTitle: "Keep things in view",
        rows: [essaysRow(i), deadlinesRow(i), schoolsRow(i)],
      };
    }
    case "senior_post_submit":
      return {
        stageLabel: "Grade 12 · Submitted",
        headline: ["Take a breath.", "Keep the details in view."],
        intro: "Submitting one application doesn't finish every application.",
        step: {
          eyebrow: "For the applications you sent",
          title: "Check what each school has received.",
          body: "Use each school's own portal to check required documents and messages. Decision dates stay unknown until the school confirms them.",
          cta: { label: "Review my applications", href: "/applications" },
          basis: "Based on applications marked submitted. No decision date is assumed.",
        },
        rowsTitle: "Keep things in view",
        rows: [submittedRow(i), essaysRow(i, "Still preparing another application?"), COST],
      };
    case "senior_decisions":
      return {
        stageLabel: "Grade 12 · Decisions",
        headline: ["Make sense of", "what comes next."],
        intro: "Your options depend on the decisions you actually have.",
        step: {
          eyebrow: "Start with the record",
          title: "Review each decision before making a plan.",
          body: "An offer, a waitlist, a deferral and a rejection need different next steps. Look at each one on its own.",
          cta: { label: "Review my decisions", href: "/applications" },
          basis: "Based on decisions recorded on your list. No offer or deposit is assumed.",
        },
        rowsTitle: "Keep things in view",
        rows: [
          decisionsRow(i),
          { id: "aid", label: "Aid & net price", detail: "Compare an offer only when amounts are confirmed.", href: "/cc/net-price" },
          essaysRow(i, "Other applications"),
        ],
      };
    case "transfer": {
      const t = i.transfer;
      return {
        stageLabel: "Transfer · Your next chapter",
        headline: ["Build on where", "you've already been."],
        intro: "Your current college, your credits and your reasons for moving belong at the center.",
        step: t.currentSchool
          ? {
              eyebrow: "One useful next step",
              title: "Explain why you're transferring, in your own words.",
              body: "Talk your reasons through with Coach, then write the essay yourself. Coach asks questions and gives feedback on what you write.",
              cta: { label: "Open Essay Studio", href: "/cc/essays?type=transfer" },
              basis: `Based on your transfer profile: ${t.currentSchool}.`,
            }
          : {
              eyebrow: "One useful next step",
              title: "Start with your transfer details.",
              body: "Add your current college and intended entry term. Credit decisions come from the receiving college, not this dashboard.",
              cta: { label: "Review my transfer profile", href: "/cc/transfer-profile" },
              basis: "Based on your transfer status. No credit equivalency is assumed.",
            },
        rowsTitle: "Your transfer details",
        rows: [
          { id: "current-college", label: "Current college", detail: t.currentSchool ?? "Not added yet.", href: "/cc/transfer-profile" },
          { id: "target-term", label: "Target entry term", detail: t.targetTerm ?? "Not added yet.", href: "/cc/transfer-profile" },
          {
            id: "credits", label: "Credits & coursework", href: "/cc/transfer-profile",
            detail: t.creditsCompleted != null
              ? `${count(t.creditsCompleted, "credit", "credits")} completed, as you recorded them. Each college decides what transfers.`
              : "Record what you've taken. Each college decides what transfers.",
          },
        ],
      };
    }
    case "unknown":
    default:
      return {
        stageLabel: "Let's find your starting point",
        headline: ["Start where", "you are."],
        intro: "One answer will help us make this space useful for you.",
        step: null,
        rowsTitle: "Your saved work",
        rows: [schoolsRow(i), essaysRow(i), activitiesRow(i)],
      };
  }
}

export function buildTodayModel(variant: VariantKey, input: TodayInput): TodayModel {
  return {
    variantKey: variant,
    ...stage(variant, input),
    askGrade: variant === "unknown",
    grade9: variant === "g9",
    blockedNotice: input.blockedNotice,
    suggestionsOn: input.observationsEnabled,
    observation: input.observationsEnabled ? input.observation : null,
    unavailable: input.schoolCount === null && input.essaysTotal === null && input.activitiesCount === null,
  };
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/app/cc/dashboard/__tests__/today-model.test.ts src/app/cc/dashboard/__tests__/variants.test.ts src/app/cc/dashboard/__tests__/variants-truth.test.ts`
Expected: PASS. 3 files; today-model has 15 tests; the existing variants suites are unchanged and still pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/format-iso-date.ts src/app/cc/dashboard/today-input.ts src/app/cc/dashboard/today-model.ts src/app/cc/dashboard/__tests__/today-model.test.ts
git commit -m "feat(dashboard): Today view model grounded in saved rows, clock-free" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---
### Task 6: Today UI, the dashboard route and the #418 fix

**Files:**
- Create: `src/components/cc/today/TodayDashboard.tsx`
- Create: `src/components/cc/today/AskKairos.tsx`
- Create: `src/components/cc/today/GradeQuestion.tsx`
- Create: `src/components/cc/today/YourPeople.tsx`
- Create: `src/components/cc/today/today.css`
- Rewrite: `src/app/cc/dashboard/page.tsx`
- Delete: `src/app/cc/dashboard/AdaptiveDashboard.tsx`, `src/app/cc/dashboard/AdaptiveDashboardClientSwitch.tsx`, `src/app/cc/dashboard/AdaptiveDashboardLegacy.tsx`, `src/app/cc/dashboard/dashboard.css`, `src/components/cc/dashboard/Greeting.tsx`, `src/components/cc/dashboard/HeroCard.tsx`, `src/components/cc/dashboard/PriorityModule.tsx`, `src/components/cc/dashboard/Tile.tsx`, `src/components/cc/dashboard/WidgetStrip.tsx`, `src/components/cc/MyCounselorChip.tsx`, `src/components/mobile/` (folder, including its tests), `src/components/nav/sidebar-data.ts`
- Modify: `src/components/nav/__tests__/nav-links.test.ts:6` and `src/__tests__/retired-links.test.ts:6-10` (drop the deleted sources)
- Test: `src/components/cc/today/__tests__/TodayDashboard.test.tsx`

**Interfaces:**
- Consumes: `TodayModel`, `buildTodayModel`, `deriveTodayInput`, `RawDashboardRows`, `RawSchoolRow` (Task 5); `useCoachKairos()` → `openWithDraft`, `openWithVariant`, `setVariantKey`, `open`, `toggleFamilyMode`, `language` (Task 2); `AiBadge`, `openFamilyMode`, the `af-*` CSS primitives (Task 3); `selectVariant` (existing); `PATCH /api/cc/profile/identity` with `{ grade_level }` (existing); `GET /api/cc/my-counselor` → `{ counselor: { displayName, agencyName } | null }` (existing).
- Produces: `default function TodayDashboard({ model }: { model: TodayModel })`. The dashboard route renders only this.

- [ ] **Step 1: Write the failing test**

`src/components/cc/today/__tests__/TodayDashboard.test.tsx`:

```tsx
// Today (GATE D4.2). The hydration test reproduces production React #418: the
// server renders at one clock, the browser hydrates 12 hours later.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import fs from "node:fs";

const h = vi.hoisted(() => ({
  coach: {
    openWithDraft: vi.fn(), openWithVariant: vi.fn(), sendMessage: vi.fn(), setVariantKey: vi.fn(),
    open: vi.fn(), toggleFamilyMode: vi.fn(), language: "en",
  },
  refresh: vi.fn(),
}));
vi.mock("@/contexts/CoachKairosContext", () => ({ useCoachKairos: () => h.coach }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: h.refresh }), usePathname: () => "/cc/dashboard" }));
import TodayDashboard from "../TodayDashboard";
import { buildTodayModel } from "@/app/cc/dashboard/today-model";
import { deriveTodayInput, type RawDashboardRows } from "@/app/cc/dashboard/today-input";

const raw = (over: Partial<RawDashboardRows> = {}): RawDashboardRows => ({
  profile: { preferred_name: null, transfer_current_school: null, transfer_target_term: null, transfer_credits_completed: null, dashboard_observations_enabled: null },
  schools: [], essays: [], activities: [], observations: [], blocked: false, ...over,
});
const model = (v: Parameters<typeof buildTodayModel>[0], over: Partial<RawDashboardRows> = {}) =>
  buildTodayModel(v, deriveTodayInput(raw(over), "2026-09-27"));

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.clearAllMocks();
  fetchMock = vi.fn(async () => new Response(JSON.stringify({ counselor: null }), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  window.history.replaceState(null, "", "/cc/dashboard");
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("TodayDashboard", () => {
  it("hydrates without a mismatch when the browser's clock is 12 hours from the server's", async () => {
    const m = model("junior", { schools: [{ application_status: null, cc_schools: { name: "North College" }, deadline_ea: "2026-11-01" }] });
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-27T09:00:00Z"));
    const html = renderToString(<TodayDashboard model={m} />);
    vi.setSystemTime(new Date("2026-09-27T21:00:00Z"));
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    const recoverable: unknown[] = [];
    await act(async () => {
      hydrateRoot(container, <TodayDashboard model={m} />, { onRecoverableError: (e) => recoverable.push(e) });
    });
    expect(recoverable).toEqual([]);
    expect(container.textContent).toContain("Nov 1, 2026");
    container.remove();
  });

  it("renders nothing from the viewer's clock and none of the old navy palette", () => {
    const code = [
      "src/components/cc/today/TodayDashboard.tsx", "src/components/cc/today/AskKairos.tsx",
      "src/components/cc/today/GradeQuestion.tsx", "src/components/cc/today/YourPeople.tsx",
      "src/app/cc/dashboard/today-model.ts", "src/app/cc/dashboard/today-input.ts", "src/lib/format-iso-date.ts",
    ];
    for (const f of code) expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/new Date\(|Date\.now|toLocale|getHours|getTimezoneOffset/);
    const look = [...code, "src/components/cc/today/today.css", "src/components/app-shell/app-frame.css", "src/components/app-shell/AppFrame.tsx"];
    for (const f of look) expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/#05080d|#d4af37|#d4a84b|Cormorant/i);
    expect(fs.existsSync("src/components/cc/dashboard/Greeting.tsx")).toBe(false);
    expect(fs.existsSync("src/app/cc/dashboard/AdaptiveDashboardLegacy.tsx")).toBe(false);
  });

  it("Ask Kairos hands the words to Coach and sends nothing", () => {
    render(<TodayDashboard model={model("junior")} />);
    const box = screen.getByRole("textbox", { name: /Ask Kairos/ });
    fireEvent.change(box, { target: { value: "add Michigan and Toronto and tell me what's due" } });
    fireEvent.submit(box.closest("form")!);
    expect(h.coach.openWithDraft).toHaveBeenCalledWith("add Michigan and Toronto and tell me what's due");
    expect(h.coach.sendMessage).not.toHaveBeenCalled();
    expect((box as HTMLInputElement).value).toBe("");
  });

  it("opens nothing by itself and badges every Coach entry as AI", () => {
    render(<TodayDashboard model={model("junior")} />);
    expect(h.coach.openWithDraft).not.toHaveBeenCalled();
    expect(h.coach.openWithVariant).not.toHaveBeenCalled();
    expect(h.coach.setVariantKey).toHaveBeenCalledWith("junior");
    const invitation = screen.getByRole("region", { name: "A place to think it through." });
    expect(within(invitation).getByText("AI")).toBeTruthy();
    fireEvent.click(within(invitation).getByRole("button", { name: "Talk with Coach" }));
    expect(h.coach.openWithVariant).toHaveBeenCalledWith("junior");
  });

  it("hides the invitation for this visit and lets the student bring it back", () => {
    render(<TodayDashboard model={model("junior")} />);
    fireEvent.click(screen.getByRole("button", { name: "Not today" }));
    expect(screen.queryByRole("region", { name: "A place to think it through." })).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("Coach invitation hidden for this visit.");
    const restore = screen.getByRole("button", { name: "Show the invitation" });
    expect(document.activeElement).toBe(restore);
    fireEvent.click(restore);
    expect(screen.getByRole("region", { name: "A place to think it through." })).toBeTruthy();
  });

  it("keeps Coach reachable but quiet when suggestions are off", () => {
    render(<TodayDashboard model={model("junior", { profile: { ...raw().profile, dashboard_observations_enabled: false } })} />);
    expect(screen.queryByRole("region", { name: "A place to think it through." })).toBeNull();
    expect(screen.queryByRole("button", { name: "Show the invitation" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open Coach Kairos" }));
    expect(h.coach.openWithVariant).toHaveBeenCalledWith("junior");
  });

  it("explains a blocked deep link and drops the flag", () => {
    window.history.replaceState(null, "", "/cc/dashboard?blocked=grade9");
    render(<TodayDashboard model={model("g9", { blocked: true })} />);
    const heading = screen.getByRole("heading", { name: "That tool opens later." });
    expect(document.activeElement).toBe(heading);
    expect(window.location.search).toBe("");
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(screen.queryByRole("heading", { name: "That tool opens later." })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "What can I use now?" }));
    expect(screen.getByRole("heading", { name: "That tool opens later." })).toBeTruthy();
  });

  it("shows a failed load as unavailable, with a retry, instead of an empty plan", () => {
    render(<TodayDashboard model={model("junior", { schools: null, essays: null, activities: null })} />);
    expect(screen.getByRole("heading", { name: "We won't fill in the blanks." })).toBeTruthy();
    expect(screen.queryByText(/No schools saved yet/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(h.refresh).toHaveBeenCalled();
  });

  it("saves an unknown grade through the existing profile API, and says so when it fails", async () => {
    render(<TodayDashboard model={model("unknown")} />);
    fetchMock.mockImplementation(async (url: string) =>
      String(url).includes("identity") ? new Response("{}", { status: 200 }) : new Response(JSON.stringify({ counselor: null }), { status: 200 }));
    fireEvent.click(screen.getByRole("button", { name: "Grade 11" }));
    await waitFor(() => expect(h.refresh).toHaveBeenCalled());
    const call = fetchMock.mock.calls.find(([u]) => String(u) === "/api/cc/profile/identity")!;
    expect(call[1]).toMatchObject({ method: "PATCH", body: JSON.stringify({ grade_level: 11 }) });

    fetchMock.mockImplementation(async (url: string) =>
      String(url).includes("identity") ? new Response("{}", { status: 500 }) : new Response(JSON.stringify({ counselor: null }), { status: 200 }));
    fireEvent.click(screen.getByRole("button", { name: "Grade 9" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't save that. Try again, or skip for now.");
    expect(screen.getByRole("link", { name: "I'm transferring" }).getAttribute("href")).toBe("/cc/transfer-profile");
    fireEvent.click(screen.getByRole("button", { name: "I'm not sure / skip for now" }));
    expect(screen.getByRole("heading", { name: "We can start with your question." })).toBeTruthy();
  });

  it("names a linked counselor and never links to a bare /join", async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ counselor: { displayName: "Ms. Rivera", agencyName: "North High" } }), { status: 200 }));
    const { container, unmount } = render(<TodayDashboard model={model("junior")} />);
    expect(await screen.findByText("Your counselor: Ms. Rivera")).toBeTruthy();
    expect(container.querySelector('a[href="/join"]')).toBeNull();
    unmount();
    fetchMock.mockImplementation(async () => new Response("{}", { status: 500 }));
    render(<TodayDashboard model={model("junior")} />);
    expect(await screen.findByText("We couldn't check your counselor connection right now.")).toBeTruthy();
  });

  it("opens family mode as a Coach action", () => {
    render(<TodayDashboard model={model("junior")} />);
    fireEvent.click(screen.getByRole("button", { name: "Open family mode" }));
    expect(h.coach.toggleFamilyMode).toHaveBeenCalledWith(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/cc/today/__tests__/TodayDashboard.test.tsx`
Expected: FAIL with `Failed to resolve import "../TodayDashboard"`.

- [ ] **Step 3: The three small parts**

`src/components/cc/today/AskKairos.tsx`:

```tsx
"use client";

// Amendment A: a plain-language command box on Today. Submitting (button or
// Enter) opens the existing Coach with the words already in its composer;
// nothing is sent until the student presses send there. Agent result cards
// arrive with the agent work, not here.
import { useId, useState, type FormEvent } from "react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import AiBadge from "@/components/app-shell/AiBadge";

export default function AskKairos() {
  const coach = useCoachKairos();
  const [text, setText] = useState("");
  const id = useId();

  function submit(e: FormEvent) {
    e.preventDefault();
    coach.openWithDraft(text.trim());
    setText("");
  }

  return (
    <form className="td-ask" onSubmit={submit}>
      <label className="td-ask-label" htmlFor={`${id}-ask`}>
        Ask Kairos{" "}<AiBadge />
      </label>
      <div className="td-ask-row">
        <input
          id={`${id}-ask`}
          type="text"
          dir="auto"
          autoComplete="off"
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about schools, costs or what's next"
        />
        <button type="submit" className="af-primary">Open in Coach</button>
      </div>
      <p className="td-ask-note">Coach opens with your words ready. Nothing is sent until you press send.</p>
    </form>
  );
}
```

`src/components/cc/today/GradeQuestion.tsx`:

```tsx
"use client";

// Unknown grade: one friendly question, never a silent grade-9 default. The
// choice is saved through the existing PATCH /api/cc/profile/identity;
// transfer goes to the existing transfer profile form. Skipping saves nothing.
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GRADES: Array<[number, string]> = [[9, "Grade 9"], [10, "Grade 10"], [11, "Grade 11"], [12, "Grade 12"]];

export default function GradeQuestion({ onSkip }: { onSkip: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  async function choose(grade: number) {
    setSaving(grade);
    setFailed(false);
    try {
      const res = await fetch("/api/cc/profile/identity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade_level: grade }),
      });
      if (!res.ok) throw new Error(String(res.status));
      router.refresh(); // the server re-selects the stage for Today and the rail
    } catch {
      setFailed(true);
    } finally {
      setSaving(null);
    }
  }

  return (
    <section className="td-clarify" aria-labelledby="td-grade-question">
      <p className="af-eyebrow">Just one question</p>
      <h2 id="td-grade-question">Which grade are you in?</h2>
      <p>If you&apos;re already in college, choose transfer.</p>
      <div className="td-grade-options">
        {GRADES.map(([grade, label]) => (
          <button key={grade} type="button" disabled={saving !== null} onClick={() => void choose(grade)}>
            {saving === grade ? "Saving…" : label}
          </button>
        ))}
        <Link href="/cc/transfer-profile">I&apos;m transferring</Link>
      </div>
      {failed && <p role="alert" className="td-error">We couldn&apos;t save that. Try again, or skip for now.</p>}
      <button type="button" className="af-quiet" onClick={onSkip}>I&apos;m not sure / skip for now</button>
      <p className="af-caption">Your existing work stays available under More.</p>
    </section>
  );
}
```

`src/components/cc/today/YourPeople.tsx`:

```tsx
"use client";

// "Your people": the linked counselor from the existing /api/cc/my-counselor.
// Unlinked students learn how invite links work; there is no bare /join page,
// so nothing links there. A failed lookup says so rather than implying "none".
import { useEffect, useState } from "react";

type Counselor = { displayName: string; agencyName: string | null };
type State = { status: "loading" } | { status: "linked"; counselor: Counselor } | { status: "none" } | { status: "error" };

export default function YourPeople() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let live = true;
    fetch("/api/cc/my-counselor")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { counselor?: Counselor | null }) => {
        if (live) setState(d.counselor ? { status: "linked", counselor: d.counselor } : { status: "none" });
      })
      .catch(() => { if (live) setState({ status: "error" }); });
    return () => { live = false; };
  }, []);

  return (
    <section className="td-support" aria-busy={state.status === "loading"}>
      <p className="af-eyebrow">Your people</p>
      {state.status === "linked" && (
        <>
          <h3>Your counselor: {state.counselor.displayName}</h3>
          {state.counselor.agencyName && state.counselor.agencyName !== state.counselor.displayName && (
            <p>{state.counselor.agencyName}</p>
          )}
        </>
      )}
      {state.status === "none" && (
        <>
          <h3>A counselor can be part of this.</h3>
          <p>If your school or counselor sent you an invite link, open it to connect. It shows you the workspace before you join.</p>
          <p className="af-caption">No link yet? Ask your counselor for one.</p>
        </>
      )}
      {state.status === "error" && <p>We couldn&apos;t check your counselor connection right now.</p>}
    </section>
  );
}
```

- [ ] **Step 4: TodayDashboard**

`src/components/cc/today/TodayDashboard.tsx`:

```tsx
"use client";

// Today (GATE D4.2): one clear next step, ruled rows of ongoing work, and
// quieter support. Renders only the strings in `model`; nothing here reads the
// clock, so server HTML and hydrated HTML are identical (the React #418 fix).
// Coach opens only when the student chooses it.
import "./today.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import AiBadge from "@/components/app-shell/AiBadge";
import { openFamilyMode } from "@/components/app-shell/coach-actions";
import type { TodayModel } from "@/app/cc/dashboard/today-model";
import AskKairos from "./AskKairos";
import GradeQuestion from "./GradeQuestion";
import YourPeople from "./YourPeople";

function DayMark() {
  return (
    <svg className="td-daymark" viewBox="0 0 100 76" aria-hidden="true">
      <path d="M12 55a38 38 0 0 1 76 0" fill="#FCE4CD" />
      <path d="M27 55a23 23 0 0 1 46 0" fill="#FFF7EE" />
      <path d="M6 65c25-15 50 15 88-4" stroke="#315B4C" strokeWidth="3" fill="none" />
      <path d="M50 3v12M10 26l8 5m64 0 8-5" stroke="#A13E24" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function TodayDashboard({ model }: { model: TodayModel }) {
  const coach = useCoachKairos();
  const { setVariantKey } = coach;
  const router = useRouter();
  const [inviteHidden, setInviteHidden] = useState(false);
  const [gradeSkipped, setGradeSkipped] = useState(false);
  const [stageHelp, setStageHelp] = useState(model.grade9 && model.blockedNotice);
  const [status, setStatus] = useState("");
  const helpRef = useRef<HTMLHeadingElement>(null);
  const restoreRef = useRef<HTMLButtonElement>(null);
  const talkRef = useRef<HTMLButtonElement>(null);
  const inviteToggled = useRef(false);

  // Coach turns started from Today carry the stage's guidance block.
  useEffect(() => {
    setVariantKey(model.variantKey);
    return () => setVariantKey(null);
  }, [setVariantKey, model.variantKey]);

  // Middleware sends grade-9 deep links here with ?blocked=grade9. The server
  // already rendered the explanation; drop the flag so a reload won't repeat it.
  useEffect(() => {
    if (!model.blockedNotice) return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("blocked")) {
      url.searchParams.delete("blocked");
      window.history.replaceState(window.history.state, "", url.pathname + url.search);
    }
  }, [model.blockedNotice]);

  useEffect(() => {
    if (stageHelp) helpRef.current?.focus();
  }, [stageHelp]);

  useEffect(() => {
    if (!inviteToggled.current) return;
    (inviteHidden ? restoreRef : talkRef).current?.focus();
  }, [inviteHidden]);

  const talk = () => coach.openWithVariant(model.variantKey);
  const showInvite = model.suggestionsOn && !inviteHidden;

  return (
    <div className="td">
      {model.grade9 && stageHelp && (
        <section className="td-clarify" aria-labelledby="td-stage-help">
          <span className="af-chip">Grade 9 · Focus on exploration</span>
          <h2 id="td-stage-help" ref={helpRef} tabIndex={-1}>That tool opens later.</h2>
          <p>
            Essays, applications, test planning and interview prep aren&apos;t available in grade 9. You can explore
            majors, record activities and plan high-school coursework now.
          </p>
          <div className="td-actions">
            <button type="button" className="af-quiet" onClick={talk}>Ask Coach about my stage</button>
            <button type="button" className="af-quiet" onClick={() => setStageHelp(false)}>Got it</button>
          </div>
        </section>
      )}

      <section className="td-welcome">
        <div>
          <span className="af-chip">{model.stageLabel}</span>
          <h1>{model.headline[0]}<br />{model.headline[1]}</h1>
          <p className="td-intro">{model.intro}</p>
        </div>
        <DayMark />
      </section>

      <AskKairos />

      <div className="td-grid">
        <div>
          {model.unavailable ? (
            <section className="td-clarify" aria-labelledby="td-unavailable">
              <h2 id="td-unavailable">We won&apos;t fill in the blanks.</h2>
              <p>
                We couldn&apos;t load your planning details. That is different from having no saved work. Try again, or
                open the part of your plan you need from the menu.
              </p>
              <div className="td-actions">
                <button type="button" className="af-primary" onClick={() => router.refresh()}>Try again</button>
              </div>
            </section>
          ) : (
            <>
              {model.askGrade && !gradeSkipped && (
                <GradeQuestion onSkip={() => { setGradeSkipped(true); setStatus("Skipped for now. Nothing was saved."); }} />
              )}
              {model.askGrade && gradeSkipped && (
                <section className="td-clarify" aria-labelledby="td-skipped">
                  <h2 id="td-skipped">We can start with your question.</h2>
                  <p>You can explore without choosing a grade. We&apos;ll ask before offering stage-specific guidance.</p>
                  <div className="td-actions">
                    <button type="button" className="af-primary" onClick={() => coach.openWithDraft("")}>Open Coach Kairos</button>
                  </div>
                </section>
              )}
              {model.step && (
                <section className="td-step" aria-labelledby="td-step-title">
                  <p className="af-eyebrow">{model.step.eyebrow}</p>
                  <h2 id="td-step-title">{model.step.title}</h2>
                  <p className="td-step-body">{model.step.body}</p>
                  <div className="td-actions">
                    <Link className="af-primary" href={model.step.cta.href}>
                      {model.step.cta.label}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                  <p className="td-basis">{model.step.basis}</p>
                </section>
              )}
              <section className="td-notes" aria-labelledby="td-notes-title">
                <div className="td-section-head">
                  <h2 id="td-notes-title">{model.rowsTitle}</h2>
                  <span className="af-caption">From your saved work</span>
                </div>
                {model.rows.map((row) => (
                  <Link key={row.id} className="td-row" href={row.href}>
                    <div>
                      <strong>{row.label}</strong>
                      <p>{row.detail}</p>
                    </div>
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </section>
              {model.grade9 && !stageHelp && (
                <div className="td-permission">
                  <span>Application tools come later.</span>
                  <button type="button" className="af-quiet" onClick={() => setStageHelp(true)}>What can I use now?</button>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="td-side" aria-label="People and support">
          {showInvite ? (
            <section className="td-coach-note" aria-labelledby="td-coach-title">
              <p className="td-coach-label">Coach Kairos{" "}<AiBadge /></p>
              <h3 id="td-coach-title">A place to think it through.</h3>
              {model.observation ? (
                <p>
                  <span className="af-eyebrow">{model.observation.eyebrow}</span>
                  <br />
                  {model.observation.text}
                </p>
              ) : (
                <p>Bring the question that feels hardest to start. We can take it one step at a time.</p>
              )}
              <div className="td-actions">
                <button ref={talkRef} type="button" onClick={talk}>Talk with Coach</button>
                <button
                  type="button"
                  className="af-quiet"
                  onClick={() => { inviteToggled.current = true; setInviteHidden(true); setStatus("Coach invitation hidden for this visit."); }}
                >
                  Not today
                </button>
              </div>
            </section>
          ) : (
            <section className="td-support" aria-labelledby="td-coach-quiet">
              <h3 id="td-coach-quiet">Coach is here when you need it.{" "}<AiBadge /></h3>
              <p>No conversation starts until you choose.</p>
              <div className="td-actions">
                <button type="button" className="af-quiet" onClick={talk}>Open Coach Kairos</button>
                {model.suggestionsOn && (
                  <button
                    ref={restoreRef}
                    type="button"
                    className="af-quiet"
                    onClick={() => { inviteToggled.current = true; setInviteHidden(false); setStatus(""); }}
                  >
                    Show the invitation
                  </button>
                )}
              </div>
            </section>
          )}
          <YourPeople />
          <section className="td-support" aria-labelledby="td-family">
            <h3 id="td-family">Bring your family in.</h3>
            <p>Talk through college and cost in a language that feels comfortable.</p>
            <button type="button" className="af-quiet" onClick={() => openFamilyMode(coach)}>Open family mode</button>
          </section>
        </aside>
      </div>

      <p className="af-sr-only" role="status">{status}</p>
    </div>
  );
}
```

- [ ] **Step 5: Today styles**

`src/components/cc/today/today.css`:

```css
/* Today (GATE D4.2), rendered inside .af-root. Tokens: src/styles/daybreak-tokens.css. */
.td-welcome{display:flex;justify-content:space-between;gap:28px;align-items:start;margin-bottom:22px}
.af-root .td-welcome h1{font-size:44px;line-height:1.12;margin:12px 0 14px}
.td-intro{color:var(--db-muted);max-width:48ch}
.td-daymark{width:100px;height:76px;flex-shrink:0;margin-top:20px}
.td-ask{margin-bottom:24px;padding:18px 20px;background:var(--db-card);border:1px solid var(--db-border);border-radius:var(--db-radius-feature)}
.td-ask-label{display:flex;align-items:center;gap:6px;font:700 16px/1.3 var(--db-font-display);margin-bottom:10px}
.td-ask-row{display:flex;gap:10px;flex-wrap:wrap}
.td-ask-row input{flex:1 1 260px;min-width:0;min-height:48px;padding:12px;border:1px solid var(--db-border);border-radius:12px;background:var(--db-page);font:16px/1.4 var(--db-font-body);color:var(--db-ink)}
.td-ask-row input:dir(rtl){font-family:"Noto Nastaliq Urdu","Daybreak Atkinson",Arial,sans-serif;line-height:2}
.af-root .td-ask-note{margin-top:10px;font-size:14px;color:var(--db-muted)}
.td-grid{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(240px,1fr);gap:24px;align-items:start}
.td-step{background:var(--db-apricot);border:1px solid var(--db-border);border-top:4px solid var(--db-clay);border-radius:var(--db-radius-feature);padding:28px}
.af-root .td-step h2{font-size:30px;max-width:24ch;margin:12px 0 15px}
.td-step-body{color:var(--db-muted);max-width:49ch}
.af-root .td-basis{font-size:13px;border-top:1px solid var(--db-border);margin-top:22px;padding-top:13px;color:var(--db-muted)}
.td-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:18px}
.td-notes{margin-top:30px}
.td-section-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:14px}
.af-root .td-section-head h2{font-size:23px}
.af-root .td-row{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:44px;padding:18px 0;border-top:1px solid var(--db-border);text-decoration:none;color:var(--db-ink)}
.af-root .td-row:last-child{border-bottom:1px solid var(--db-border)}
.td-row strong{font-size:16px}
.af-root .td-row p{color:var(--db-muted);font-size:14px;margin-top:4px}
.td-row>span{font-size:24px;color:var(--db-clay)}
.td-permission{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:16px 0;color:var(--db-muted);font-size:14px}
.td-side{display:grid;gap:20px}
.td-coach-note{background:var(--db-sage);border:1px solid var(--db-border);border-radius:14px;padding:22px}
.af-root .td-coach-label{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:700;margin-bottom:14px}
.af-root .td-coach-note h3{font-size:20px;margin-bottom:12px}
.td-coach-note p{font-size:15px;color:var(--db-muted)}
.td-support{padding:4px}
.af-root .td-support h3{font-size:18px;margin:6px 0 10px}
.td-support p{font-size:14px;color:var(--db-muted)}
.td-clarify{max-width:660px;margin-bottom:24px;border:1px solid var(--db-border);border-top:4px solid var(--db-clay);background:var(--db-card);border-radius:var(--db-radius-feature);padding:28px}
.af-root .td-clarify h2{font-size:26px;margin:12px 0;outline:none}
.td-clarify p{color:var(--db-muted)}
.td-grade-options{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:22px 0 12px}
.af-root .td-grade-options>*{display:flex;align-items:center;min-height:52px;padding:10px 16px;text-align:start;border:1px solid var(--db-border);border-radius:12px;background:var(--db-card);color:var(--db-ink);text-decoration:none;font-size:16px}
.af-root .td-error{color:var(--db-error);margin:0 0 8px;font-size:15px}
@media (max-width:1100px){
 .td-grid{grid-template-columns:minmax(0,1fr)}
 .td-side{grid-template-columns:1fr 1fr}
 .td-daymark{display:none}
}
@media (max-width:700px){
 .af-root .td-welcome h1{font-size:32px;line-height:1.13;margin:12px 0}
 .td-intro{font-size:15px}
 .td-ask{padding:16px}
 .td-step{padding:22px 20px;border-radius:18px}
 .af-root .td-step h2{font-size:25px}
 .td-step-body{font-size:15px}
 .af-root .td-step .af-primary{width:100%}
 .td-side{display:block;margin-top:26px}
 .td-side>*+*{margin-top:22px}
 .td-clarify{padding:22px 20px}
 .af-root .td-clarify h2{font-size:24px}
 .td-grade-options{gap:10px}
}
```

- [ ] **Step 6: The dashboard route**

`src/app/cc/dashboard/page.tsx` (whole file):

```tsx
// src/app/cc/dashboard/page.tsx
// Today (GATE D4.2). Server side: the auth + onboarding gate, one read of the
// student's existing rows, then a pure view model passed to a client
// component as plain strings. The only clock read is the server's calendar
// day, used to skip past deadlines, and it never reaches the browser as
// something to recompute. The removed legacy Greeting rendered "Good evening ·
// Sat · Sep 27" on a UTC server and again in the student's timezone; that
// mismatch was production React #418.
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { selectVariant } from "./variants";
import { deriveTodayInput, type RawDashboardRows, type RawSchoolRow } from "./today-input";
import { buildTodayModel } from "./today-model";
import TodayDashboard from "@/components/cc/today/TodayDashboard";

export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string;
  preferred_name: string | null;
  grade_level: number | null;
  is_transfer_student: boolean | null;
  language_picker_seen_at: string | null;
  transfer_current_school: string | null;
  transfer_target_term: string | null;
  transfer_credits_completed: number | null;
  dashboard_observations_enabled: boolean | null;
};

// A failed read resolves to null (shown as "Couldn't load"), never to [].
async function safe<T>(p: PromiseLike<{ data: T | null; error: unknown }>): Promise<T | null> {
  try {
    const { data, error } = await p;
    return error ? null : data;
  } catch {
    return null;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/cc/dashboard");

  // Tolerate a partial schema: try the full profile first, then the columns
  // that have always existed.
  let profile = await safe<ProfileRow>(
    supabase
      .from("cc_student_profiles")
      .select("id, preferred_name, grade_level, is_transfer_student, language_picker_seen_at, transfer_current_school, transfer_target_term, transfer_credits_completed, dashboard_observations_enabled")
      .eq("user_id", user.id)
      .maybeSingle<ProfileRow>(),
  );
  if (!profile) {
    const minimal = await safe<Pick<ProfileRow, "id" | "preferred_name" | "grade_level" | "language_picker_seen_at">>(
      supabase
        .from("cc_student_profiles")
        .select("id, preferred_name, grade_level, language_picker_seen_at")
        .eq("user_id", user.id)
        .maybeSingle(),
    );
    profile = minimal
      ? { ...minimal, is_transfer_student: false, transfer_current_school: null, transfer_target_term: null, transfer_credits_completed: null, dashboard_observations_enabled: null }
      : null;
  }
  if (!profile || profile.language_picker_seen_at == null) redirect("/onboarding");

  // Schools: the full row, or a minimal select if the deadline_* columns are
  // missing. Both failing → null → "Couldn't load".
  let schools = await safe<RawSchoolRow[]>(
    supabase
      .from("cc_student_schools")
      .select("application_status, deadline_ea, deadline_ed, deadline_edii, deadline_rea, deadline_rd, deadline_financial_aid, deadline_css_profile, deadline_fafsa, cc_schools(name)")
      .eq("student_id", profile.id),
  );
  if (!schools) {
    schools = await safe<RawSchoolRow[]>(
      supabase.from("cc_student_schools").select("application_status, cc_schools(name)").eq("student_id", profile.id),
    );
  }

  const observationsEnabled = profile.dashboard_observations_enabled !== false;
  const [essays, activities, observations] = await Promise.all([
    safe<{ phase: string | null; essay_type: string | null }[]>(
      supabase.from("cc_essays").select("phase, essay_type").eq("student_id", profile.id),
    ),
    safe<{ id: string }[]>(supabase.from("cc_activities").select("id").eq("student_id", profile.id)),
    observationsEnabled
      ? safe<{ module_label: string; observation: string; eyebrow: string }[]>(
          supabase
            .from("cc_dashboard_observations")
            .select("module_label, observation, eyebrow")
            .eq("student_id", profile.id)
            .gt("expires_at", new Date().toISOString()),
        )
      : Promise.resolve(null),
  ]);

  const raw: RawDashboardRows = {
    profile: {
      preferred_name: profile.preferred_name,
      transfer_current_school: profile.transfer_current_school,
      transfer_target_term: profile.transfer_target_term,
      transfer_credits_completed: profile.transfer_credits_completed,
      dashboard_observations_enabled: profile.dashboard_observations_enabled,
    },
    schools,
    essays,
    activities,
    observations,
    blocked: params.blocked === "grade9",
  };
  const variantKey = selectVariant(
    { is_transfer_student: profile.is_transfer_student, grade_level: profile.grade_level },
    schools ?? [],
  );
  const todayIso = new Date().toISOString().slice(0, 10); // server calendar day (UTC on Vercel)
  return <TodayDashboard model={buildTodayModel(variantKey, deriveTodayInput(raw, todayIso))} />;
}
```

- [ ] **Step 7: Remove the superseded renderers and navigation**

```bash
git rm src/app/cc/dashboard/AdaptiveDashboard.tsx src/app/cc/dashboard/AdaptiveDashboardClientSwitch.tsx src/app/cc/dashboard/AdaptiveDashboardLegacy.tsx src/app/cc/dashboard/dashboard.css
git rm src/components/cc/dashboard/Greeting.tsx src/components/cc/dashboard/HeroCard.tsx src/components/cc/dashboard/PriorityModule.tsx src/components/cc/dashboard/Tile.tsx src/components/cc/dashboard/WidgetStrip.tsx
git rm src/components/cc/MyCounselorChip.tsx src/components/nav/sidebar-data.ts
git rm -r src/components/mobile
```

Update the two guard lists so they read only files that still exist.

`src/components/nav/__tests__/nav-links.test.ts` line 6:

```ts
const SOURCES = ["src/components/nav/palette-data.ts", "src/components/app-shell/app-nav.ts"];
```

`src/__tests__/retired-links.test.ts` lines 6–10:

```ts
const SHELL = [
  "src/app/providers.tsx", "src/components/layout/TopNav.tsx", "src/components/marketing/daybreak/DaybreakFooter.tsx",
  "src/app/settings/page.tsx", "src/components/nav/palette-data.ts", "src/components/app-shell/app-nav.ts",
];
```

Confirm nothing still imports a deleted module:

Run: `git grep -nE "AdaptiveDashboard|components/mobile/|nav/sidebar-data|cc/dashboard/(Greeting|HeroCard|PriorityModule|Tile|WidgetStrip)|MyCounselorChip" -- src`
Expected: no output. (`src/components/cc/dashboard/sections/Greeting.tsx` is a different file, kept for the summary API types, and does not match these patterns.)

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npx vitest run src/components/cc/today src/app/cc/dashboard src/components/nav src/__tests__/retired-links.test.ts src/components/app-shell`
Expected: PASS. TodayDashboard has 11 tests; the today-model, variants, nav-links, retired-links, command-palette and app-shell suites all pass.

Run: `npx tsc --noEmit -p .`
Expected: exit 0, no output.

- [ ] **Step 9: Commit**

```bash
git add src/components/cc/today/TodayDashboard.tsx src/components/cc/today/AskKairos.tsx src/components/cc/today/GradeQuestion.tsx src/components/cc/today/YourPeople.tsx src/components/cc/today/today.css src/components/cc/today/__tests__/TodayDashboard.test.tsx src/app/cc/dashboard/page.tsx src/components/nav/__tests__/nav-links.test.ts src/__tests__/retired-links.test.ts
git commit -m "feat(dashboard): Daybreak Today with Ask Kairos; fix React #418 hydration mismatch" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

(The `git rm` calls in Step 7 already staged the deletions.)

---
### Task 7: Settings, plan states and the billing portal

**Files:**
- Create: `src/lib/billing/plan-state.ts`
- Create: `src/components/settings/ManageBillingButton.tsx`
- Rewrite: `src/app/settings/page.tsx`
- Create: `src/app/settings/settings.css`
- Modify: `src/app/api/cc/me/route.ts:8-10` (`FIELDS`)
- Modify: `src/app/api/cc/profile/identity/route.ts:5-10,21-24` (allow and validate `dashboard_observations_enabled`)
- Test: `src/lib/billing/__tests__/plan-state.test.ts`
- Test: `src/components/settings/__tests__/ManageBillingButton.test.tsx`
- Test: `src/app/settings/__tests__/settings-page.test.tsx`
- Test: `src/app/api/cc/__tests__/profile-identity.test.ts` (new)
- Modify test: `src/app/api/cc/__tests__/me.test.ts` (fixture and assertion)

**Interfaces:**
- Consumes: `useAuth()` → `{ user, profile: { full_name, role, trial_ends_at, referral_code }, credits, creditsLoaded, loading, signOut }`; `useCounselorRole()` → `{ isCounselor, isMember, isHead, requiresReview }`; `GET /api/cc/me` → `{ profile: { grade_level, is_transfer_student, dashboard_observations_enabled, … } | null }`; `GET /api/billing/subscription` → `{ subscription: { plan, status, stripeSubscriptionId, … } }`; `POST /api/billing/stripe/portal` → 200 `{ url }` | 404 (no customer) | 401/500/502 `{ error }`; `formatIsoDate` (Task 5); the `af-*` primitives (Task 3).
- Produces:
  - `type SubscriptionLike = { plan: string; status: string; stripeSubscriptionId: string | null }`
  - `type PlanKind = "free" | "trial" | "pro" | "pro_unconfirmed" | "ended"`, `type PlanState = { kind: PlanKind; trialEndsOn: string | null }`
  - `derivePlanState(input: { role: string | null | undefined; trialEndsAt: string | null | undefined; subscription: SubscriptionLike | null | "unavailable"; todayIso: string }): PlanState`
  - `default function ManageBillingButton(props: { onNavigate?: (url: string) => void })`
  - `/api/cc/me` now also returns `dashboard_observations_enabled`. `PATCH /api/cc/profile/identity` accepts `{ dashboard_observations_enabled: boolean }` and answers 400 for a non-boolean.

Truthfulness rules from the proposal: account role and plan are separate things. A signup trial is not evidence of a paid subscription. An unknown trial end date stays unknown. The login streak is removed. The existing referral card still appears only when `p.referral_code` is set (`src/app/__tests__/truthful-ui.test.ts` checks this). No checkout is started automatically.

- [ ] **Step 1: Write the failing tests**

`src/lib/billing/__tests__/plan-state.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { derivePlanState } from "../plan-state";

const paid = { plan: "pro", status: "active", stripeSubscriptionId: "sub_1" };
const today = "2026-09-27";

describe("derivePlanState", () => {
  it("calls a live Stripe subscription Pro", () => {
    expect(derivePlanState({ role: "pro", trialEndsAt: "2026-10-04T00:00:00Z", subscription: paid, todayIso: today })).toEqual({ kind: "pro", trialEndsOn: null });
    expect(derivePlanState({ role: "pro", trialEndsAt: null, subscription: { ...paid, status: "past_due" }, todayIso: today }).kind).toBe("pro");
  });

  it("does not treat a signup trial as a paid subscription", () => {
    const free = { plan: "free", status: "active", stripeSubscriptionId: null };
    expect(derivePlanState({ role: "pro", trialEndsAt: "2026-10-04T12:00:00Z", subscription: free, todayIso: today })).toEqual({ kind: "trial", trialEndsOn: "2026-10-04" });
    expect(derivePlanState({ role: "pro", trialEndsAt: null, subscription: null, todayIso: today })).toEqual({ kind: "trial", trialEndsOn: null });
  });

  it("says Pro without guessing when billing couldn't be checked", () => {
    expect(derivePlanState({ role: "pro", trialEndsAt: null, subscription: "unavailable", todayIso: today }).kind).toBe("pro_unconfirmed");
  });

  it("distinguishes an ended trial from never having one", () => {
    expect(derivePlanState({ role: "student", trialEndsAt: "2026-09-01T00:00:00Z", subscription: null, todayIso: today })).toEqual({ kind: "ended", trialEndsOn: "2026-09-01" });
    expect(derivePlanState({ role: "student", trialEndsAt: null, subscription: null, todayIso: today })).toEqual({ kind: "free", trialEndsOn: null });
  });

  it("ignores a canceled subscription", () => {
    expect(derivePlanState({ role: "student", trialEndsAt: null, subscription: { ...paid, status: "canceled" }, todayIso: today }).kind).toBe("free");
  });
});
```

`src/components/settings/__tests__/ManageBillingButton.test.tsx`:

```tsx
// Review Focus 5: the portal button never sends anyone to checkout on its own,
// explains a missing billing account, recovers from errors, and sends one
// request per click.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ManageBillingButton from "../ManageBillingButton";

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => { fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); });
afterEach(() => { vi.unstubAllGlobals(); });

const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });

describe("ManageBillingButton", () => {
  it("opens the portal URL the API returns", async () => {
    fetchMock.mockResolvedValue(reply(200, { url: "https://billing.stripe.com/p/session_1" }));
    const onNavigate = vi.fn();
    render(<ManageBillingButton onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: /Manage billing/ }));
    await vi.waitFor(() => expect(onNavigate).toHaveBeenCalledWith("https://billing.stripe.com/p/session_1"));
    expect(fetchMock).toHaveBeenCalledWith("/api/billing/stripe/portal", { method: "POST" });
  });

  it("explains a missing billing account without redirecting to checkout", async () => {
    fetchMock.mockResolvedValue(reply(404, { error: "No Stripe customer on file." }));
    const onNavigate = vi.fn();
    render(<ManageBillingButton onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: /Manage billing/ }));
    expect(await screen.findByText("No billing account is connected.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "View plans" }).getAttribute("href")).toBe("/pricing");
    expect(onNavigate).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls.every(([u]) => !String(u).includes("checkout"))).toBe(true);
  });

  it("recovers from a failure with Try again", async () => {
    fetchMock.mockResolvedValueOnce(reply(502, { error: "Portal failed" }));
    fetchMock.mockResolvedValueOnce(reply(200, { url: "https://billing.stripe.com/p/session_2" }));
    const onNavigate = vi.fn();
    render(<ManageBillingButton onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: /Manage billing/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't open billing.");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await vi.waitFor(() => expect(onNavigate).toHaveBeenCalledWith("https://billing.stripe.com/p/session_2"));
  });

  it("treats a thrown network error like a failure, not a missing account", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<ManageBillingButton onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Manage billing/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Your plan has not changed.");
    expect(screen.queryByText("No billing account is connected.")).toBeNull();
  });

  it("sends one request when clicked twice while opening", async () => {
    let release!: (r: Response) => void;
    fetchMock.mockReturnValue(new Promise<Response>((r) => { release = r; }));
    render(<ManageBillingButton onNavigate={vi.fn()} />);
    const button = screen.getByRole("button", { name: /Manage billing/ });
    fireEvent.click(button);
    fireEvent.click(screen.getByRole("button", { name: /Opening secure billing/ }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    release(reply(200, { url: "https://billing.stripe.com/p/x" }));
  });
});
```

`src/app/settings/__tests__/settings-page.test.tsx`:

```tsx
// Settings separates account role, trial status and paid billing (GATE D4.2).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";

const h = vi.hoisted(() => ({
  auth: {
    user: { id: "u1", email: "ada@example.com" },
    profile: { full_name: "Ada Lovelace", role: "pro", trial_ends_at: null as string | null, referral_code: null as string | null, login_streak: 12 },
    credits: 40, creditsLoaded: true, loading: false, signOut: vi.fn(),
  },
  role: { isCounselor: false, isMember: false, isHead: false, requiresReview: false, loading: false },
  me: { grade_level: 11, is_transfer_student: false, dashboard_observations_enabled: true } as Record<string, unknown> | null,
  subscription: { plan: "free", status: "active", stripeSubscriptionId: null } as Record<string, unknown>,
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => h.auth }));
vi.mock("@/hooks/useCounselorRole", () => ({ useCounselorRole: () => h.role }));
import SettingsPage from "../page";

beforeEach(() => {
  h.auth.profile = { full_name: "Ada Lovelace", role: "pro", trial_ends_at: null, referral_code: null, login_streak: 12 };
  h.role = { isCounselor: false, isMember: false, isHead: false, requiresReview: false, loading: false };
  h.me = { grade_level: 11, is_transfer_student: false, dashboard_observations_enabled: true };
  h.subscription = { plan: "free", status: "active", stripeSubscriptionId: null };
  vi.stubGlobal("fetch", vi.fn(async (url: string) =>
    String(url).includes("/api/cc/me")
      ? new Response(JSON.stringify({ profile: h.me }), { status: 200 })
      : new Response(JSON.stringify({ subscription: h.subscription }), { status: 200 })));
});
afterEach(() => { vi.unstubAllGlobals(); });

describe("Settings", () => {
  it("shows a signup trial with an unknown end date honestly, and no login streak", async () => {
    render(<SettingsPage />);
    expect(await screen.findByText("Pro trial")).toBeTruthy();
    expect(screen.getByText(/trial end date isn't available/i)).toBeTruthy();
    expect(screen.getByText("Student")).toBeTruthy();
    expect(await screen.findByText("Grade 11")).toBeTruthy();
    expect(screen.queryByText(/streak/i)).toBeNull();
    expect(screen.queryByRole("button", { name: /Manage billing/ })).toBeNull();
    expect(screen.getByRole("link", { name: /See options after my trial/ }).getAttribute("href")).toBe("/pricing");
  });

  it("offers Manage billing only for a paid plan", async () => {
    h.subscription = { plan: "pro", status: "active", stripeSubscriptionId: "sub_1" };
    render(<SettingsPage />);
    expect(await screen.findByRole("button", { name: /Manage billing/ })).toBeTruthy();
  });

  it("shows a head counselor's role and workspace access, never a student grade", async () => {
    h.role = { isCounselor: true, isMember: true, isHead: true, requiresReview: false, loading: false };
    h.me = null;
    render(<SettingsPage />);
    expect(await screen.findByText("Head counselor")).toBeTruthy();
    expect(screen.getByText("Team lead")).toBeTruthy();
    expect(screen.queryByText("Grade")).toBeNull();
    expect(screen.queryByRole("checkbox", { name: /dashboard suggestions/i })).toBeNull();
    expect(screen.getByRole("link", { name: "Edit public profile" }).getAttribute("href")).toBe("/counselor/profile");
  });

  it("reflects the saved suggestions preference", async () => {
    h.me = { grade_level: 11, is_transfer_student: false, dashboard_observations_enabled: false };
    render(<SettingsPage />);
    const box = (await screen.findByRole("checkbox", { name: /Show dashboard suggestions/ })) as HTMLInputElement;
    await vi.waitFor(() => expect(box.checked).toBe(false));
  });

  it("keeps the referral card behind an existing code and uses only Daybreak colors", () => {
    const src = fs.readFileSync("src/app/settings/page.tsx", "utf8");
    expect(src).toMatch(/p\.referral_code\s*&&/);
    for (const f of ["src/app/settings/page.tsx", "src/app/settings/settings.css", "src/components/settings/ManageBillingButton.tsx"]) {
      expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/#05080d|#d4af37|#d4a84b|Cormorant|login_streak/i);
    }
  });
});
```

`src/app/api/cc/__tests__/profile-identity.test.ts`:

```ts
// The dashboard-suggestions switch reuses the existing observation preference
// (cc_student_profiles.dashboard_observations_enabled) through the existing
// identity PATCH. No new table, no new route.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";

const ME = "a11ce000-0000-4000-8000-000000000001";
const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001" }, supabase: h.world }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));
import { PATCH } from "../profile/identity/route";

const req = (body: unknown) =>
  new Request("http://localhost/api/cc/profile/identity", { method: "PATCH", body: JSON.stringify(body) }) as unknown as Parameters<typeof PATCH>[0];

let world: FakeSupabase;
beforeEach(() => {
  world = createFakeSupabase({ cc_student_profiles: [{ id: "p1", user_id: ME, grade_level: null, dashboard_observations_enabled: true }] });
  h.world = world;
});

describe("PATCH /api/cc/profile/identity", () => {
  it("saves the dashboard suggestions preference", async () => {
    const res = await PATCH(req({ dashboard_observations_enabled: false }));
    expect(res.status).toBe(200);
    expect(world.tables.cc_student_profiles[0].dashboard_observations_enabled).toBe(false);
  });

  it("rejects a non-boolean preference", async () => {
    const res = await PATCH(req({ dashboard_observations_enabled: "no" }));
    expect(res.status).toBe(400);
    expect(world.tables.cc_student_profiles[0].dashboard_observations_enabled).toBe(true);
  });

  it("still saves a grade (the unknown-grade question on Today)", async () => {
    expect((await PATCH(req({ grade_level: 11 }))).status).toBe(200);
    expect(world.tables.cc_student_profiles[0].grade_level).toBe(11);
  });
});
```

In `src/app/api/cc/__tests__/me.test.ts`, add `dashboard_observations_enabled: false` to the `row(...)` fixture object (after `transfer_reason: "program fit",`) and add this assertion to the first test:

```ts
    expect(json.profile.dashboard_observations_enabled).toBe(false);
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/billing/__tests__/plan-state.test.ts src/components/settings/__tests__/ManageBillingButton.test.tsx src/app/settings/__tests__/settings-page.test.tsx src/app/api/cc/__tests__/profile-identity.test.ts src/app/api/cc/__tests__/me.test.ts`
Expected: FAIL. plan-state and ManageBillingButton fail with `Failed to resolve import`. settings-page fails on `Unable to find an element with the text: Pro trial`. profile-identity fails on `expected true to be false` (the key is dropped today) and `expected 200 to be 400`. me fails on `expected undefined to be false`.

- [ ] **Step 3: Plan state**

`src/lib/billing/plan-state.ts`:

```ts
// Which plan to show in Settings (GATE D4.2). The account role and the plan
// are different facts: profiles.role === "pro" can be a signup trial with no
// card and no Stripe customer, so only a live Stripe subscription reads as
// paid Pro. When billing can't be checked, say Pro without claiming either.
export type SubscriptionLike = { plan: string; status: string; stripeSubscriptionId: string | null };
export type PlanKind = "free" | "trial" | "pro" | "pro_unconfirmed" | "ended";
export type PlanState = { kind: PlanKind; trialEndsOn: string | null };

const LIVE = new Set(["active", "trialing", "past_due"]);

export function derivePlanState({
  role,
  trialEndsAt,
  subscription,
  todayIso,
}: {
  role: string | null | undefined;
  trialEndsAt: string | null | undefined;
  subscription: SubscriptionLike | null | "unavailable";
  todayIso: string;
}): PlanState {
  const trialDay = trialEndsAt ? trialEndsAt.slice(0, 10) : null;
  if (subscription && subscription !== "unavailable" && subscription.plan === "pro" && subscription.stripeSubscriptionId && LIVE.has(subscription.status)) {
    return { kind: "pro", trialEndsOn: null };
  }
  if (role === "pro") return { kind: subscription === "unavailable" ? "pro_unconfirmed" : "trial", trialEndsOn: trialDay };
  if (trialDay && trialDay < todayIso) return { kind: "ended", trialEndsOn: trialDay };
  return { kind: "free", trialEndsOn: null };
}
```

- [ ] **Step 4: Manage billing**

`src/components/settings/ManageBillingButton.tsx`:

```tsx
"use client";

// Manage billing over the existing POST /api/billing/stripe/portal. 404 means
// no Stripe customer (often a signup trial): explain it and never start a
// checkout. Anything else that fails leaves the plan unchanged and offers a retry.
import Link from "next/link";
import { useRef, useState } from "react";

type State = "idle" | "loading" | "missing" | "error";

export default function ManageBillingButton({
  onNavigate = (url: string) => window.location.assign(url),
}: {
  onNavigate?: (url: string) => void;
}) {
  const [state, setState] = useState<State>("idle");
  const inFlight = useRef(false);

  async function open() {
    if (inFlight.current) return;
    inFlight.current = true;
    setState("loading");
    try {
      const res = await fetch("/api/billing/stripe/portal", { method: "POST" });
      if (res.status === 404) { setState("missing"); return; }
      const data = (await res.json().catch(() => null)) as { url?: string } | null;
      if (!res.ok || !data?.url) { setState("error"); return; }
      onNavigate(data.url); // leaves the page; stay in "loading" meanwhile
    } catch {
      setState("error");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <div className="st-billing">
      <button type="button" className="af-primary" onClick={() => void open()} disabled={state === "loading"} aria-busy={state === "loading"}>
        {state === "loading" ? "Opening secure billing…" : "Manage billing"}
        <span aria-hidden="true">↗</span>
      </button>
      {state === "missing" && (
        <div role="status" className="af-notice">
          <strong>No billing account is connected.</strong>
          <p>You may be using a signup trial. Check your plan before making a purchase.</p>
          <Link className="af-quiet" href="/pricing">View plans</Link>
        </div>
      )}
      {state === "error" && (
        <div role="alert" className="af-notice">
          <strong>We couldn&apos;t open billing.</strong>
          <p>Your plan has not changed. Try again when you&apos;re ready.</p>
          <button type="button" className="af-quiet" onClick={() => void open()}>Try again</button>
        </div>
      )}
      <p className="af-caption">Cards, invoices, plan changes and cancellation open in Stripe.</p>
    </div>
  );
}
```

- [ ] **Step 5: API changes (existing column, existing routes)**

`src/app/api/cc/me/route.ts`, `FIELDS` becomes:

```ts
const FIELDS =
  "id, preferred_name, grade_level, is_transfer_student, is_international, affordability_value, needs_full_aid, " +
  "transfer_current_school, transfer_credits_completed, transfer_target_term, transfer_reason, dashboard_observations_enabled";
```

`src/app/api/cc/profile/identity/route.ts`: add `"dashboard_observations_enabled"` as the last entry of `ALLOWED_FIELDS`, and validate it right after the existing `affordability_value` check:

```ts
  if ("dashboard_observations_enabled" in body && typeof body.dashboard_observations_enabled !== "boolean") {
    return NextResponse.json({ error: "dashboard_observations_enabled must be true or false" }, { status: 400 });
  }
```

- [ ] **Step 6: Settings page**

`src/app/settings/page.tsx` (whole file):

```tsx
// src/app/settings/page.tsx
"use client";

// Settings (GATE D4.2): account role, plan and billing, Coach preferences and
// session, each stated separately. The trial is not presented as a paid
// subscription, an unknown date stays unknown, and billing opens only on a click.
import "./settings.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCounselorRole } from "@/hooks/useCounselorRole";
import ManageBillingButton from "@/components/settings/ManageBillingButton";
import AiBadge from "@/components/app-shell/AiBadge";
import { derivePlanState, type PlanKind, type SubscriptionLike } from "@/lib/billing/plan-state";
import { formatIsoDate } from "@/lib/format-iso-date";

type Me = { grade_level: number | null; is_transfer_student: boolean | null; dashboard_observations_enabled?: boolean | null };
type Load<T> = { status: "loading" } | { status: "ready"; value: T } | { status: "error" };

const PLAN_CHIP: Record<PlanKind, string> = {
  free: "Free", trial: "Pro trial", pro: "Pro", pro_unconfirmed: "Pro", ended: "Free · Trial ended",
};

export default function SettingsPage() {
  const { user, profile, credits, creditsLoaded, loading, signOut } = useAuth();
  const role = useCounselorRole();
  const [me, setMe] = useState<Load<Me | null>>({ status: "loading" });
  const [subscription, setSubscription] = useState<Load<SubscriptionLike | null>>({ status: "loading" });
  const [todayIso, setTodayIso] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<boolean | null>(null);
  const [prefError, setPrefError] = useState(false);
  const [profileTimedOut, setProfileTimedOut] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    setTodayIso(new Date().toISOString().slice(0, 10)); // client-only, after mount
    fetch("/api/cc/me")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { profile: Me | null }) => {
        setMe({ status: "ready", value: d.profile ?? null });
        setSuggestions(d.profile ? d.profile.dashboard_observations_enabled !== false : null);
      })
      .catch(() => setMe({ status: "error" }));
    fetch("/api/billing/subscription")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { subscription?: SubscriptionLike | null }) => setSubscription({ status: "ready", value: d.subscription ?? null }))
      .catch(() => setSubscription({ status: "error" }));
  }, [user]);

  // If the profile hasn't loaded after 5 seconds, stop waiting.
  useEffect(() => {
    if (profile || !user) return;
    const timer = setTimeout(() => setProfileTimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, [profile, user]);

  if (loading) return <p role="status" className="st-wait">Loading settings…</p>;
  if (!user) return <p className="st-wait">Please sign in to view settings.</p>;
  if (!profile) {
    return profileTimedOut ? (
      <section className="st-card st-wait">
        <h2>We couldn&apos;t load your profile.</h2>
        <p>There may be a connection issue.</p>
        <button type="button" onClick={() => window.location.reload()}>Try again</button>
      </section>
    ) : (
      <p role="status" className="st-wait">Loading settings…</p>
    );
  }

  const p = profile;
  const staff = role.isCounselor;
  const roleName = role.isHead ? "Head counselor" : staff ? "Counselor" : "Student";
  const access = role.isHead ? "Team lead" : role.isMember ? (role.requiresReview ? "Supervised" : "Team member") : "Not connected";
  const student = me.status === "ready" ? me.value : null;
  const isTransfer = Boolean(student?.is_transfer_student);
  const gradeText = me.status === "loading" ? "Loading…" : me.status === "error" ? "Couldn't load" : isTransfer ? "Transfer" : student?.grade_level ? `Grade ${student.grade_level}` : "Not provided";

  const plan = subscription.status === "loading" || !todayIso
    ? null
    : derivePlanState({
        role: p.role,
        trialEndsAt: p.trial_ends_at,
        subscription: subscription.status === "error" ? "unavailable" : subscription.value,
        todayIso,
      });

  async function toggleSuggestions(next: boolean) {
    setSuggestions(next);
    setPrefError(false);
    try {
      const res = await fetch("/api/cc/profile/identity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dashboard_observations_enabled: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setSuggestions(!next);
      setPrefError(true);
    }
  }

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/ref/${p.referral_code}`;

  return (
    <div className="st">
      <header className="st-head">
        <span className="af-chip">Settings</span>
        <h1>Your space.<br />Your choices.</h1>
        <p className="st-intro">Your account role and your plan are different things.</p>
      </header>

      <div className="st-grid">
        <section className="st-card" aria-labelledby="st-account">
          <h2 id="st-account">Account &amp; profile</h2>
          <div className="st-def"><span>Name</span><strong>{p.full_name || "Not set"}</strong></div>
          <div className="st-def"><span>Email</span><strong>{user.email}</strong></div>
          <div className="st-def"><span>Account role</span><strong>{roleName}</strong></div>
          {staff ? (
            <div className="st-def"><span>Workspace access</span><strong>{access}</strong></div>
          ) : (
            <div className="st-def"><span>{isTransfer ? "Study stage" : "Grade"}</span><strong>{gradeText}</strong></div>
          )}
          {staff ? (
            <Link className="af-quiet" href="/counselor/profile">Edit public profile</Link>
          ) : isTransfer ? (
            <Link className="af-quiet" href="/cc/transfer-profile">Edit transfer details</Link>
          ) : (
            <Link className="af-quiet" href="/profile">Edit my profile</Link>
          )}
        </section>

        <section className="st-card" aria-labelledby="st-plan">
          <h2 id="st-plan">Plan &amp; billing</h2>
          {!plan ? (
            <p role="status">Checking your plan…</p>
          ) : (
            <>
              <span className="af-chip">{PLAN_CHIP[plan.kind]}</span>
              {plan.kind === "free" && <p className="st-lead">You&apos;re on the free plan.</p>}
              {plan.kind === "trial" && <p className="st-lead">You&apos;re trying Pro. A signup trial is not a paid subscription.</p>}
              {plan.kind === "pro" && <p className="st-lead">Your plan is Pro.</p>}
              {plan.kind === "pro_unconfirmed" && <p className="st-lead">Your plan is Pro. We couldn&apos;t check your billing details just now.</p>}
              {plan.kind === "ended" && <p className="st-lead">Your trial is over. Your work is still here.</p>}
              {plan.kind === "trial" && (
                <p className="af-notice">
                  {plan.trialEndsOn
                    ? `Your trial ends ${formatIsoDate(plan.trialEndsOn)}. Confirm the date and any charge before checkout.`
                    : "Your trial end date isn't available. Confirm the date and any charge before checkout."}
                </p>
              )}
              <div className="st-def"><span>Credits balance</span><strong>{creditsLoaded ? credits : "—"}</strong></div>
              {plan.kind === "pro" || plan.kind === "pro_unconfirmed" ? (
                <ManageBillingButton />
              ) : (
                <>
                  <Link className="af-primary" href="/pricing">
                    {plan.kind === "trial" ? "See options after my trial" : "View plans"}
                    <span aria-hidden="true">↗</span>
                  </Link>
                  <p className="af-caption">No charge or billing change happens here.</p>
                </>
              )}
            </>
          )}
        </section>

        {!staff && (
          <section className="st-card" aria-labelledby="st-coach">
            <h2 id="st-coach">Coach &amp; preferences{" "}<AiBadge /></h2>
            <label className="st-check">
              <input
                type="checkbox"
                checked={suggestions ?? true}
                disabled={suggestions === null}
                onChange={(e) => void toggleSuggestions(e.target.checked)}
              />
              Show dashboard suggestions
            </label>
            <p>Choose whether Coach&apos;s AI observations and invitation appear on Today. Your next step and Coach stay available either way.</p>
            {prefError && <p role="alert" className="st-error">We couldn&apos;t save that preference. Try again.</p>}
            <p>Coach&apos;s language is set from the language menu inside Coach.</p>
          </section>
        )}

        {p.referral_code && (
          <section className="st-card" aria-labelledby="st-referral">
            <h2 id="st-referral">Refer a friend</h2>
            <p>Share your link. You both get 25 credits when they sign up.</p>
            <code className="st-code">{referralLink}</code>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(referralLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </section>
        )}

        <section className="st-card" aria-labelledby="st-session">
          <h2 id="st-session">Session</h2>
          <p>Signing out ends this session. It does not delete your account or your work.</p>
          <button type="button" onClick={() => void signOut()}>Sign out</button>
        </section>
      </div>
    </div>
  );
}
```

`src/app/settings/settings.css`:

```css
/* Settings (GATE D4.2), rendered inside .af-root. */
.st-wait{max-width:540px;margin:40px auto;font-size:16px}
.st-head{margin-bottom:26px}
.af-root .st-head h1{font-size:44px;line-height:1.12;margin:12px 0 14px}
.st-intro{color:var(--db-muted);max-width:48ch}
.st-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start}
.st-card{background:var(--db-card);border:1px solid var(--db-border);border-radius:14px;padding:24px}
.af-root .st-card h2{display:flex;align-items:center;gap:8px;font-size:23px;margin-bottom:18px}
.af-root .st-card p{color:var(--db-muted);font-size:15px;margin-bottom:14px}
.af-root .st-card .st-lead{margin-top:16px;color:var(--db-ink)}
.af-root .st-card .af-notice{color:var(--db-ink)}
.st-def{display:flex;justify-content:space-between;gap:15px;border-top:1px solid var(--db-border);padding:14px 0;font-size:15px}
.st-def span{color:var(--db-muted)}
.st-def strong{text-align:end;overflow-wrap:anywhere}
.st-check{display:flex;align-items:center;gap:12px;min-height:48px;font-size:15px;cursor:pointer}
.st-check input{width:22px;height:22px;accent-color:var(--db-clay)}
.st-code{display:block;padding:10px 12px;margin-bottom:12px;background:var(--db-page);border:1px solid var(--db-border);border-radius:10px;font-size:14px;overflow-wrap:anywhere}
.af-root .st-error{color:var(--db-error)}
.st-billing{display:grid;gap:10px;justify-items:start;margin-top:8px}
.af-root .st-billing .af-notice p{margin:6px 0 4px}
@media (max-width:1100px){.st-grid{grid-template-columns:1fr}}
@media (max-width:700px){.af-root .st-head h1{font-size:32px}.st-card{padding:22px 20px}.st-def{font-size:14px}}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run src/lib/billing src/components/settings src/app/settings src/app/api/cc/__tests__/profile-identity.test.ts src/app/api/cc/__tests__/me.test.ts src/app/__tests__/truthful-ui.test.ts src/__tests__/retired-links.test.ts`
Expected: PASS. plan-state 5, ManageBillingButton 5, settings-page 5, profile-identity 3, me 4, truthful-ui 7, retired-links 3.

- [ ] **Step 8: Commit**

```bash
git add src/lib/billing/plan-state.ts src/lib/billing/__tests__/plan-state.test.ts src/components/settings/ManageBillingButton.tsx src/components/settings/__tests__/ManageBillingButton.test.tsx src/app/settings/page.tsx src/app/settings/settings.css src/app/settings/__tests__/settings-page.test.tsx src/app/api/cc/me/route.ts src/app/api/cc/profile/identity/route.ts src/app/api/cc/__tests__/profile-identity.test.ts src/app/api/cc/__tests__/me.test.ts
git commit -m "feat(settings): Daybreak Settings with honest plan states and billing portal" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---
### Task 8: Whole-tree verification and the viewport check

**Files:**
- Create: `tests/e2e/d4-2-shell.spec.ts`
- Evidence output (not committed): `docs/qa/evidence/d4-2-shell/`

**Interfaces:**
- Consumes: the DOM contract from Task 3 (`.af-root`, `.af-rail`, `.af-topbar`, `.af-tabs`, `#af-main`, `.af-caption`, `.af-badge`, `.af-eyebrow`, `.af-chip`, `.af-rail-label`, `.td-basis`) and the QA accounts `e2e-v-<variant>@test.local` / `e2e-head@test.local`, password `E2eTestPass!1`.
- Produces: pass/fail evidence for the gate. Nothing else depends on it.

This spec logs in to real QA accounts through the local dev server (`npm run dev` via `playwright.config.ts` `webServer`), which uses the project's configured Supabase. It **only loads pages**. It never clicks a grade button, Ask Kairos, a billing button or Sign out, so it writes no student data. Run only this file. Other e2e specs reset production fixtures.

- [ ] **Step 1: Type-check, unit tests, build**

Run: `npx tsc --noEmit -p .`
Expected: exit code 0, no output.

Run: `npx vitest run src`
Expected: every test file passes (`Test Files  N passed (N)`), 0 failed. The new suites are app-nav, AppFrame, mount, coach-draft, CoachChat-draft, today-model, TodayDashboard, plan-state, ManageBillingButton, settings-page and profile-identity. The deleted `src/components/mobile/**` suites no longer run. (Never `npm run test:unit`.)

Run: `npm run build`
Expected: `✓ Compiled successfully`, the route table lists `/cc/dashboard`, `/settings`, `/applications` and `/schools`, and the exit code is 0.

- [ ] **Step 2: Write the viewport spec**

`tests/e2e/d4-2-shell.spec.ts`:

```ts
// GATE D4.2 acceptance at 375×812 and 1440×900 for a junior, a grade-9, a
// transfer, an unknown-grade student and a head counselor. Page loads only:
// no grade buttons, Ask Kairos, billing or sign-out clicks, so no data writes.
// Run ONLY this file:
//   npx playwright test tests/e2e/d4-2-shell.spec.ts --project="Desktop Chrome" --workers=1
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const PW = "E2eTestPass!1";
const OUT = "docs/qa/evidence/d4-2-shell";
const VIEWPORTS = { phone: { width: 375, height: 812 }, desktop: { width: 1440, height: 900 } } as const;
const ACCOUNTS = [
  { id: "junior", email: "e2e-v-junior@test.local", staff: false },
  { id: "g9", email: "e2e-v-g9@test.local", staff: false },
  { id: "transfer", email: "e2e-v-transfer@test.local", staff: false },
  { id: "unknown", email: "e2e-v-unknown@test.local", staff: false },
  { id: "head", email: "e2e-head@test.local", staff: true },
] as const;

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("Your password").fill(PW);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 60_000 });
}

// Returns human-readable violations inside `scope` (a CSS selector list).
async function audit(page: Page, scope: string, phone: boolean) {
  return page.evaluate(({ scope, phone }) => {
    const out: string[] = [];
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    if (overflow > 1) out.push(`horizontal overflow ${overflow}px`);
    const roots = [...document.querySelectorAll<HTMLElement>(scope)];
    if (!roots.length) return [...out, `no element matches ${scope}`];
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    const small = ".af-caption, .af-badge, .af-eyebrow, .af-chip, .af-rail-label, .td-basis";
    for (const root of roots) {
      for (const el of root.querySelectorAll<HTMLElement>("*")) {
        if (el.closest(".af-skip, dialog:not([open])") || !visible(el)) continue;
        const ownText = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim());
        if (ownText && phone) {
          const size = parseFloat(getComputedStyle(el).fontSize);
          const min = el.closest(small) ? 12 : 14;
          if (size < min) out.push(`font ${size}px < ${min}px: <${el.tagName.toLowerCase()} class="${el.className}"> "${(el.textContent ?? "").trim().slice(0, 40)}"`);
        }
        if (el.matches("a[href], button, input, select, textarea, summary")) {
          const target = el.matches('input[type="checkbox"], input[type="radio"]') ? (el.closest("label") ?? el) : el;
          const r = target.getBoundingClientRect();
          if (r.width < 44 || r.height < 44) out.push(`target ${Math.round(r.width)}×${Math.round(r.height)}: ${el.tagName.toLowerCase()} "${(el.textContent ?? el.getAttribute("aria-label") ?? "").trim().slice(0, 40)}"`);
        }
      }
    }
    return out;
  }, { scope, phone });
}

for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(vpName, () => {
    test.use({ viewport, isMobile: vpName === "phone", hasTouch: vpName === "phone" });

    for (const account of ACCOUNTS) {
      test(`${account.id} (${vpName}): dashboard shell`, async ({ page }) => {
        test.setTimeout(180_000);
        const phone = vpName === "phone";
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
        page.on("console", (m) => {
          if (m.type() === "error" && /#418|#423|#425|hydrat|did not match/i.test(m.text())) errors.push(`hydration: ${m.text().slice(0, 200)}`);
        });

        await login(page, account.email);
        fs.mkdirSync(OUT, { recursive: true });

        await page.goto("/cc/dashboard", { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
        await expect(page.locator(".af-root")).toBeVisible();
        // The coach drawer must not have opened by itself.
        await expect(page.getByRole("textbox", { name: "Message Coach Kairos" })).toHaveCount(0);

        if (account.staff) {
          // Middleware sends counselors to their workspace.
          expect(new URL(page.url()).pathname).toBe("/counselor/dashboard");
          const team = phone ? page.locator(".af-tabs").getByRole("link", { name: "Team" }) : page.locator(".af-rail").getByRole("link", { name: "Team & invites" });
          await expect(team).toBeVisible();
        } else {
          expect(new URL(page.url()).pathname).toBe("/cc/dashboard");
          await expect(page.getByRole("textbox", { name: /Ask Kairos/ })).toBeVisible();
          await expect(page.locator("#af-main .af-badge").first()).toHaveText("AI");
          if (account.id === "unknown") await expect(page.getByRole("heading", { name: "Which grade are you in?" })).toBeVisible();
          if (account.id === "transfer") await expect(page.getByRole("heading", { name: "Your transfer details" })).toBeVisible();
          if (account.id === "g9") {
            const nav = phone ? page.locator(".af-tabs") : page.locator(".af-rail");
            await expect(nav.locator('a[href="/cc/essays"], a[href="/applications"]')).toHaveCount(0);
          }
        }

        // Legacy page bodies (counselor workspace) keep their own styles until
        // their gates; audit the frame chrome there, and all of Today.
        const scope = account.staff ? ".af-topbar, .af-tabs, .af-rail" : ".af-root";
        const problems = await audit(page, scope, phone);
        await page.screenshot({ path: `${OUT}/${account.id}-${vpName}.png`, fullPage: true });
        fs.writeFileSync(`${OUT}/${account.id}-${vpName}.json`, JSON.stringify({ url: page.url(), problems, errors }, null, 2));

        if (account.id === "g9") {
          // A deep link to a blocked tool lands on Today with the explanation
          // focused and the flag removed.
          await page.goto("/cc/essays", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "That tool opens later." })).toBeFocused();
          await expect.poll(() => new URL(page.url()).search).toBe("");
        }

        if (account.id === "junior") {
          // A page not yet restyled keeps its dark body inside the new frame.
          await page.goto("/schools", { waitUntil: "domcontentloaded" });
          await expect(page.locator("#af-main")).toHaveClass(/af-legacy/);
          await expect(page.locator(".af-topbar")).toBeVisible();
          await page.screenshot({ path: `${OUT}/junior-schools-${vpName}.png`, fullPage: true });
        }

        if (account.id === "junior" || account.id === "head") {
          await page.goto("/settings", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "Plan & billing" })).toBeVisible();
          await expect(page.getByText(account.id === "head" ? "Head counselor" : "Student", { exact: true })).toBeVisible();
          const settingsProblems = await audit(page, ".af-root", phone);
          await page.screenshot({ path: `${OUT}/${account.id}-settings-${vpName}.png`, fullPage: true });
          expect(settingsProblems, "settings layout").toEqual([]);
        }

        expect(problems, "dashboard layout").toEqual([]);
        expect(errors, "page errors / hydration").toEqual([]);
      });
    }
  });
}
```

- [ ] **Step 3: Run the viewport check**

Run: `npx playwright test tests/e2e/d4-2-shell.spec.ts --project="Desktop Chrome" --workers=1`
Expected: `10 passed` (5 accounts × 2 viewports). `docs/qa/evidence/d4-2-shell/` holds a PNG and a JSON per run, and every JSON has `"problems": []` and `"errors": []`.

If a check fails, do not loosen it. Open the JSON, fix the cause in the owning task's files (frame CSS for chrome, `today.css` for Today, `settings.css` for Settings), and rerun Steps 1 and 3. There is one exception. A failure that is only inside a **legacy counselor page body** is outside this gate's scope (the audit already limits staff pages to the frame chrome). If document-level horizontal overflow on `/counselor/dashboard` comes from that page's own content, record it in `.agent/VALIDATION_LOG.md` as a D4.x finding with the screenshot, and report it instead of patching the page.

- [ ] **Step 4: Visual comparison with the approved mock**

Open `docs/qa/evidence/d4-2-shell/junior-desktop.png` and `junior-phone.png` next to `C:\Users\bilal\Downloads\grokking-daybreak\work-diary\d4-2-evidence\junior-1440.png` and `junior-375.png`. Expected: the same structure: rail with "Today" highlighted, a chip plus a two-line headline, the Ask Kairos box, the apricot next-step panel with a clay CTA, ruled rows, and the sage Coach card with the "AI" badge. On the phone: the bottom Today / Coach / Schools / More bar, with no floating gold button and no navy header. Differences in real data (counts, names) are expected. Structural or colour differences are not. Also open `junior-schools-phone.png`: the page body stays on its old dark surface with legible text inside the cream frame, and no frame button styles (white fills, clay underlines) leak into it.

- [ ] **Step 5: Commit the spec and record the evidence**

```bash
git add tests/e2e/d4-2-shell.spec.ts
git commit -m "test(e2e): D4.2 dashboard shell viewport and hydration check" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

Append the tsc, vitest, build and Playwright results (counts and exit codes) to `.agent/VALIDATION_LOG.md` in the target tree, and record GATE D4.2 implementation as "verified locally, not deployed" in `.agent/WORKFLOW_STATE.md`. Commit those two files separately with the same trailer. Deployment and production smoke tests belong to a later step and are not part of this plan.

---

## Out of scope (deliberately)

- Agent result cards on Today (proposal, evidence, abstain, progress): later, with the agent work (D5). This plan reserves no placeholder UI for them.
- The Coach drawer's own look and conversation surface (still the dark drawer): D4.3. This plan only adds the draft hand-off and a label on its composer.
- Restyling the bodies of `/schools`, `/applications`, `/cc/essays`, counselor pages and the rest: their own D4.x gates. They render inside the new frame on their old dark surface (`af-legacy kl-surface-app`, the same background `AppShell` gave them before) until then. Add a route to `DAYBREAK_PAGES` only when its body has been rebuilt in Daybreak.
- The global ⌘K `CommandPalette` (still dark, unfiltered by grade; middleware still enforces the grade-9 limits): a follow-up. The frame's "Find a page" is the Daybreak, grade-aware search.
- A new counselor home page: the mock's counselor "dashboard" had no data or route behind it. Counselors keep landing on `/counselor/dashboard` inside the new frame.
- Persistent "Not today" dismissal (needs D2's proactive lifecycle), pricing content (D4.8), marketing header and footer (D4.8), and a full Nastaliq font for user text (only subset and welcome files are shipped).
- Cleanup of the now-unrendered `src/components/cc/dashboard/sections/*`, `src/hooks/useMediaQuery.ts` and `src/lib/device.ts`.
