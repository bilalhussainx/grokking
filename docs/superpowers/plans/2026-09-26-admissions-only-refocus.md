# Admissions-only Refocus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire the study-courses product so KairosLearn ships only the AI admissions counselor. Retired URLs redirect, and shared voice and interview infrastructure keeps working.

**Architecture:**
- A single source of truth, `src/lib/retired-routes.ts`, feeds `next.config.ts` redirects and the guard tests.
- Shell, SEO and meta files are rewritten for admissions.
- The retired routes are deleted first. The course catalogue and the code only it used are deleted after that, and each deletion step is proven by `tsc` plus guard tests that scan `src/` for leftover links and imports.
- No database changes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, vitest 4 (jsdom), Playwright.

**Spec:** `docs/superpowers/specs/2026-09-26-admissions-only-refocus-design.md`

## Global Constraints

- Work only in `C:\Users\bilal\Downloads\grokking-integrate`, on branch `refocus/admissions-only`.
- **Never run `npm run test:unit`.** It runs DB fixtures against production. Use `npx vitest run src` or named files.
- Run e2e only as `npx playwright test tests/e2e/student-variants.spec.ts --project="Desktop Chrome" --workers=1`.
- Use `git add` with explicit paths only; `git rm -r` for deletions. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.
- No migrations, no deploys, no `.env.local` reads.
- Never touch `src/app/cc/**`, `src/lib/cc/**`, `src/components/cc/**` or `src/app/counselor/**`, except to remove an import of retired code, and that must be a ledgered ruling.
- Keep (spec rule 4):
  - `useVoiceAgent`, `useDeepgramAgent`, `useOrchestratedVoiceAgent`, `useCoachVoice`, `useVoicePreference`;
  - `lib/language-personas`, `lib/voice-provider-router`;
  - `api/language/{translate,tts,persona-config,analyze-session,sarvam/stream}`, `api/ai/voice-session`, `api/interviews/{plan,session,score,text-message}`;
  - `components/interview/*`, `components/college/*`, `components/voice/*`;
  - `contexts/{InterviewContext,GlossaryContext,CoachKairosContext}`;
  - `api/submissions` (the survey).
- `src/data` keep-set:
  - `college-interviewer-personas.ts`, `interview-personas.ts`;
  - `school-application-plans.json`, `school-deadlines-2026.json`, `supplement-prompts-2026.json`;
  - `canadian/`, `uk/`, `cc/`.
- Redirects are `permanent: false`.

## Review Focus

1. **A signed-in or guest session on a bookmarked `/course/...` URL loops or 404s.** Expected: a single hop to `/`, then the dashboard. Pinned in Task 1 with the `every destination is itself live` test.
2. **The admissions word "courses" gets swept up.** `/cc/courses`, AP course rigor and `cc_*` coursework must survive. Pinned in Task 1 (`/cc/courses` → null) and in Task 7 (the keep-list test asserts `src/app/cc/courses/page.tsx` exists).
3. **Coach Kairos voice breaks** because a shared type lived in `src/data/language-types.ts`. Pinned in Task 6: the types move to `src/lib/voice/language-types.ts`, and `tsc` plus the existing `useVoiceAgent`/coach tests pass.
4. **A guest on `/` with `?focus=intake` or `?coach=open` loses the query** now that the legacy home is gone. Pinned in Task 2 with a middleware test that preserves the query.
5. **A shipped link or fetch still points at a retired page or API.** Pinned in Task 3 (shell files) and Task 7 (all of `src`) by the guard tests.

---

### Task 1: Retired-route map and redirects

**Files:**
- Create: `src/lib/retired-routes.ts`
- Create: `src/lib/__tests__/retired-routes.test.ts`
- Modify: `next.config.ts` (add `redirects()`)

**Interfaces:**
- Produces:
  - `RETIRED_ROUTE_REDIRECTS: { source: string; destination: string; permanent: false }[]`
  - `retiredDestination(pathname: string): string | null`
  - `RETIRED_API_PREFIXES: string[]`

- [ ] **Step 1: Write the failing test** at `src/lib/__tests__/retired-routes.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { RETIRED_ROUTE_REDIRECTS, retiredDestination } from "../retired-routes";

describe("retired learning routes", () => {
  it.each([
    ["/course/python-fundamentals", "/"],
    ["/course/python-fundamentals/intro/exercise", "/"],
    ["/courses", "/"],
    ["/courses/languages", "/"],
    ["/talk", "/"],
    ["/pathways/software-engineer", "/"],
    ["/interviews/abc", "/cc/interview-prep"],
    ["/career/interviews", "/cc/interview-prep"],
    ["/dashboard", "/cc/dashboard"],
    ["/onboarding/language", "/onboarding"],
    ["/admin", "/admin/survey"],
    ["/admin/courses/new", "/admin/survey"],
    ["/verify/2", "/"],
  ])("%s redirects to %s", (path, dest) => {
    expect(retiredDestination(path)).toBe(dest);
  });

  it.each(["/cc/courses", "/college-interviews/x", "/admin/survey", "/onboarding", "/", "/coursework", "/cc/interview-prep"])(
    "%s is not retired",
    (path) => expect(retiredDestination(path)).toBeNull(),
  );

  it("every destination is itself live (no redirect chains)", () => {
    for (const r of RETIRED_ROUTE_REDIRECTS) expect(retiredDestination(r.destination)).toBeNull();
  });

  it("all redirects are temporary for the first release", () => {
    expect(RETIRED_ROUTE_REDIRECTS.every((r) => r.permanent === false)).toBe(true);
  });
});
```

- [ ] **Step 2: Run it**

  Run: `npx vitest run src/lib/__tests__/retired-routes.test.ts`
  Expected: FAIL, "Failed to resolve import ../retired-routes".

- [ ] **Step 3: Implement** `src/lib/retired-routes.ts`:

```ts
// The study-courses product was retired on 2026-09-26: KairosLearn is an
// admissions counselor only. Every learning URL goes to the nearest admissions
// surface. "/" already sends sessions to their dashboard and visitors to the
// homepage. Temporary (307) for the first release; make permanent after 30 days.
const HOME = "/";
const INTERVIEWS = "/cc/interview-prep";

const MAP: Array<[string, string]> = [
  ["/course", HOME], ["/courses", HOME], ["/learn", HOME], ["/pathways", HOME],
  ["/talk", HOME], ["/placement", HOME], ["/practice", HOME],
  ["/classrooms", HOME], ["/sessions", HOME],
  ["/leaderboard", HOME], ["/achievements", HOME],
  ["/credentials", HOME], ["/verify", HOME],
  ["/blog", HOME], ["/comparison", HOME], ["/tools", HOME],
  ["/interviews", INTERVIEWS], ["/career", INTERVIEWS],
  ["/dashboard", "/cc/dashboard"],
  ["/onboarding/language", "/onboarding"],
  ["/admin/courses", "/admin/survey"],
];

export const RETIRED_ROUTE_REDIRECTS: { source: string; destination: string; permanent: false }[] = [
  // "/admin" itself only: /admin/survey stays.
  { source: "/admin", destination: "/admin/survey", permanent: false },
  ...MAP.flatMap(([base, destination]) => [
    { source: base, destination, permanent: false as const },
    { source: `${base}/:path*`, destination, permanent: false as const },
  ]),
];

export function retiredDestination(pathname: string): string | null {
  if (pathname === "/admin") return "/admin/survey";
  for (const [base, destination] of MAP) {
    if (pathname === base || pathname.startsWith(`${base}/`)) return destination;
  }
  return null;
}

// API prefixes of the retired product. Deleted routes; used by guard tests.
export const RETIRED_API_PREFIXES = [
  "/api/courses", "/api/progress", "/api/xp", "/api/streak", "/api/gems",
  "/api/classrooms", "/api/sessions", "/api/credentials", "/api/career",
  "/api/ai/coach", "/api/ai/hint", "/api/ai/grade", "/api/ai/generate-lesson",
  "/api/ai/recommendations", "/api/language/session", "/api/language/placement",
  "/api/interviews/run-code", "/api/interviews/problems",
];
```

  Then in `next.config.ts`, add `import { RETIRED_ROUTE_REDIRECTS } from "./src/lib/retired-routes";` and add `async redirects() { return RETIRED_ROUTE_REDIRECTS; },` next to `headers()`.

- [ ] **Step 4: Run it**

  Run: `npx vitest run src/lib/__tests__/retired-routes.test.ts`
  Expected: PASS (27 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/retired-routes.ts src/lib/__tests__/retired-routes.test.ts next.config.ts
git commit -m "feat(refocus): redirect retired learning URLs to admissions surfaces"
```

### Task 2: Home and middleware without the course home

**Files:**
- Modify: `src/app/page.tsx` (replace with a server component)
- Delete: `src/app/page.daybreak.test.tsx`
- Modify: `src/middleware.ts`
- Modify: `src/middleware.welcome.test.ts`

**Interfaces:**
- Consumes: nothing from Task 1. The redirects run in `next.config`, before middleware.
- Produces: `/` renders `DaybreakHomepage`. Middleware sends any session on `/` to `/cc/dashboard` with the query kept.

- [ ] **Step 1: Write the failing tests.** Add to `src/middleware.welcome.test.ts`, reusing its `@supabase/ssr` mock helpers:
  - An **anonymous** user (`is_anonymous: true`) on `/?focus=intake&coach=open` gets a redirect whose `location` pathname is `/cc/dashboard` with both params.
  - `isPublicRoute("/courses")`, `isPublicRoute("/course/x")`, `isPublicRoute("/talk")` and `isPublicRoute("/leaderboard")` are all `false`.

  Also add `src/app/__tests__/home-page.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
vi.mock("@/components/marketing/daybreak/DaybreakHomepage", () => ({ default: () => <main data-testid="daybreak-homepage" /> }));
import HomePage from "../page";

describe("/", () => {
  it("renders the admissions homepage", () => {
    render(<HomePage />);
    expect(screen.getByTestId("daybreak-homepage")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run them**

  Run: `npx vitest run src/middleware.welcome.test.ts src/app/__tests__/home-page.test.tsx`
  Expected: FAIL. The anonymous case returns `next()` (no redirect), `isPublicRoute("/courses")` is `true`, and the home page test fails on the client page's context imports.

- [ ] **Step 3: Implement**
  - `src/app/page.tsx` becomes:

```tsx
import DaybreakHomepage from "@/components/marketing/daybreak/DaybreakHomepage";

// Signed-out visitors see the admissions homepage. Any session is sent to
// /cc/dashboard by middleware before this renders.
export default function HomePage() {
  return <DaybreakHomepage />;
}
```

  - `git rm src/app/page.daybreak.test.tsx`. It tests the removed client home.
  - In `src/middleware.ts`:
    - Remove `"/courses"` from `PUBLIC_ROUTES`.
    - Remove these from `PUBLIC_PREFIXES`: `"/api/courses/"`, `"/talk"`, `"/career"`, `"/pathways"`, `"/interviews"`, `"/achievements"`, `"/leaderboard"`, `"/blog"`, `"/comparison"`, `"/tools"`.
    - Delete the `/course/` block in `isPublicRoute`.
    - Right after the existing `if (pathname === "/" && !user)` rewrite, insert:

```ts
  // Guest sessions on "/" go to the dashboard too (real users were redirected
  // above). The legacy course home is gone; keep the query (focus=intake, coach=open).
  if (pathname === "/" && user) {
    const url = new URL("/cc/dashboard", request.url);
    request.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
    return NextResponse.redirect(url);
  }
```

    - Update the comment above the rewrite so it no longer says "/" carries the course catalogue.
    - Delete the now-unreachable `if (pathname === "/") { if (!isRealUser) … /landing … }` block.
    - Change `/landing` real users to redirect to `/cc/dashboard` instead of `/`.

- [ ] **Step 4: Run them**

  Run: `npx vitest run src/middleware.welcome.test.ts src/app/__tests__/home-page.test.tsx src/lib/cc`
  Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/__tests__/home-page.test.tsx src/middleware.ts src/middleware.welcome.test.ts
git rm -q src/app/page.daybreak.test.tsx
git commit -m "feat(refocus): / is the admissions homepage; sessions go to the dashboard"
```

### Task 3: App shell without learning providers and links

**Files:**
- Modify: `src/app/providers.tsx`
- Modify: `src/components/layout/TopNav.tsx:40-48`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/settings/page.tsx` (remove ProfileCard, GemShop, `useXP`, `useSoundEffect`, `/api/xp/leaderboard`)
- Create: `src/__tests__/retired-links.test.ts`

**Interfaces:**
- Consumes: `retiredDestination` and `RETIRED_API_PREFIXES` from Task 1.
- Produces: `findRetiredReferences(files: string[]): string[]`, exported from the test helper `src/__tests__/retired-links.helpers.ts` and reused in Task 7.

- [ ] **Step 1: Write the failing test.** Create `src/__tests__/retired-links.helpers.ts`:

```ts
import fs from "node:fs";
import { retiredDestination, RETIRED_API_PREFIXES } from "@/lib/retired-routes";

// Quoted absolute paths: "/x", '/x', `/x` (a template stops at ${).
const PATH = /["'`](\/[A-Za-z0-9_\-/.]*)/g;

export function findRetiredReferences(files: string[]): string[] {
  const hits: string[] = [];
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    for (const m of src.matchAll(PATH)) {
      const p = m[1].split(/[?#]/)[0].replace(/\/$/, "") || "/";
      const retiredPage = !p.startsWith("/api/") && retiredDestination(p) !== null;
      const retiredApi = RETIRED_API_PREFIXES.some((a) => p === a || p.startsWith(`${a}/`));
      if (retiredPage || retiredApi) hits.push(`${file}: ${p}`);
    }
  }
  return hits;
}
```

  Then create `src/__tests__/retired-links.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { findRetiredReferences } from "./retired-links.helpers";

const SHELL = [
  "src/app/providers.tsx", "src/components/layout/TopNav.tsx", "src/components/layout/Footer.tsx",
  "src/app/settings/page.tsx", "src/components/nav/sidebar-data.ts", "src/components/nav/palette-data.ts",
];

describe("retired learning links", () => {
  it("the app shell links to no retired page or API", () => {
    expect(findRetiredReferences(SHELL)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it**

  Run: `npx vitest run src/__tests__/retired-links.test.ts`
  Expected: FAIL. Hits include `TopNav.tsx: /talk`, `/career/interviews`, `/courses`; `Footer.tsx: /course`, `/blog`; `settings/page.tsx: /api/xp/leaderboard`.

- [ ] **Step 3: Implement**
  - **providers.tsx:**
    - Remove these imports and their JSX: `AIProvider`/`useAI`, `XPProvider`/`useXP`, `AIStateProvider`, `AICoach`, `SessionNotes`, `TranslationBar`, `isLanguageCourseSlug`, `GlobalSearchLauncher`, `XPFlyUp`, `AchievementToast`, `VariableReward`.
    - Remove the functions `useIsLanguageCourse`, `CoachSidebar`, `CoachFAB`, `TranslationBarWrapper` and `GamificationOverlays`.
    - The `lucide-react` import is no longer needed.
    - In `AppLayout`, the inner flex row renders only `{children}`.
    - `AppOverlays` returns `<><CoachKairosShell /><ShortcutsHelp /><SurveyPrompt /></>`.
    - Provider nesting becomes `AuthProvider > ThemeProvider > TopNavProvider > GlossaryProvider > CoachKairosProvider > UpgradeGateProvider`.
  - **TopNav.tsx:** `MORE_LINKS` drops `/talk`, `/career/interviews` and `/courses`, and adds `{ href: "/cc/interview-prep", label: "Interview prep", icon: Target, cap: "College interviews" }`. Remove imports that become unused (`Mic` if unused).
  - **Footer.tsx:**
    - `HIDDEN_ROUTES` keeps `/writing/` and `/onboarding`.
    - Platform links become `/cc` (Coach Kairos), `/schools` (School list), `/pricing` (Pricing), `/cc/interview-prep` (Interview prep).
    - Resources links become `/about`, `/faq`, `/integrity`.
    - Visual design is not changed (Codex session B owns it).
  - **settings/page.tsx:** delete the ProfileCard and GemShop sections and their imports, along with `useXP`, `useSoundEffect`, and the `/api/xp/leaderboard` fetch and state. Leave every other section as it is.

- [ ] **Step 4: Run them**

  Run: `npx vitest run src/__tests__/retired-links.test.ts src/components/nav src/app/settings && npx tsc --noEmit -p . 2>&1 | tail -5`
  Expected: PASS, and tsc exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/app/providers.tsx src/components/layout/TopNav.tsx src/components/layout/Footer.tsx src/app/settings/page.tsx src/__tests__/retired-links.helpers.ts src/__tests__/retired-links.test.ts
git commit -m "feat(refocus): app shell drops lesson coach, XP overlays, course search and links"
```

### Task 4: SEO, meta and pricing copy for admissions

**Files:**
- Modify: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`, `src/lib/schema.tsx` (`websiteSchema`), `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts`, `src/app/pricing/subsidized/page.tsx:84`, `src/app/faq/page.tsx` (drop the `courses` import and course Q&As)
- Delete: `src/components/pricing/PricingCards.tsx`, `src/components/pricing/PaywallModal.tsx` (no importers; verify with grep)
- Create: `src/app/__tests__/seo-admissions.test.ts`

**Interfaces:**
- Consumes: `retiredDestination` (Task 1).
- Produces: `ADMISSIONS_SUMMARY: string`, exported from `src/lib/product-summary.ts` and used by the manifest and both llms routes.

- [ ] **Step 1: Write the failing test** at `src/app/__tests__/seo-admissions.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import sitemap from "../sitemap";
import manifest from "../manifest";
import robots from "../robots";
import { GET as llms } from "../llms.txt/route";
import { GET as llmsFull } from "../llms-full.txt/route";
import { retiredDestination } from "@/lib/retired-routes";

const COURSE_WORDS = /\b(courses?|lessons?|tutoring|leetcode)\b/i;

describe("SEO describes the admissions product", () => {
  it("sitemap lists no retired URL", () => {
    const paths = sitemap().map((e) => new URL(e.url).pathname);
    expect(paths.filter((p) => retiredDestination(p) !== null)).toEqual([]);
    expect(paths).toContain("/pricing");
  });
  it("manifest names the counselor, not courses", () => {
    const m = manifest();
    expect(`${m.name} ${m.description}`).not.toMatch(COURSE_WORDS);
    expect(m.description).toMatch(/college/i);
  });
  it("robots no longer mentions credentials", () => {
    expect(JSON.stringify(robots())).not.toContain("/credentials");
  });
  it.each([["llms.txt", llms], ["llms-full.txt", llmsFull]])("%s is about admissions", async (_n, get) => {
    const text = await (await get()).text();
    expect(text).toMatch(/college/i);
    expect(text).not.toMatch(/\/course\//);
  });
});
```

- [ ] **Step 2: Run it**

  Run: `npx vitest run src/app/__tests__/seo-admissions.test.ts`
  Expected: FAIL. The sitemap contains `/courses` and others, the manifest says "coding, philosophy, religion", and the llms files list courses.

- [ ] **Step 3: Implement**
  - Create `src/lib/product-summary.ts`:

```ts
// One description of the product, reused by the manifest and llms.txt. Grounded
// in what ships; no statistics, no admission promises.
export const ADMISSIONS_SUMMARY =
  "KairosLearn is an AI college admissions counselor. Coach Kairos helps students build a balanced school list, plan applications and deadlines, shape activities, prepare for college interviews, and understand financial aid and net price, in many languages. Students write their own essays; the coach gives feedback and never writes essay prose. Human counselors can work alongside it.";
```

  - **sitemap.ts:** remove the course, pathway, lesson and blog sections and the `@/data` imports. Static pages become `/`, `/pricing`, `/about`, `/faq`, `/integrity`, `/privacy`, `/terms`, `/signup`, `/find-counselor`, `/product/counselor`, `/product/essays`, `/product/schools`, `/stories`. Before listing each route, verify its page exists (`ls src/app/<route>/page.tsx`) and drop any that don't.
  - **robots.ts:** the disallow list becomes `['/api/', '/admin/', '/settings/']`.
  - **manifest.ts:**
    - `name: 'KairosLearn — AI College Counselor'`
    - `description: ADMISSIONS_SUMMARY`
    - Keep the other fields. `theme_color` is left for Codex (brand).
  - **schema.tsx:** in `websiteSchema`, delete the `potentialAction` SearchAction. There is no site search any more.
  - **llms.txt/route.ts:** a static markdown response.

```ts
import { NextResponse } from "next/server";
import { ADMISSIONS_SUMMARY } from "@/lib/product-summary";

export async function GET() {
  const content = `# KairosLearn\n\n> ${ADMISSIONS_SUMMARY}\n\n## Main pages\n- [Home](https://kairoslearn.com/)\n- [Pricing](https://kairoslearn.com/pricing)\n- [About](https://kairoslearn.com/about)\n- [FAQ](https://kairoslearn.com/faq)\n- [Academic integrity](https://kairoslearn.com/integrity)\n- [Find a counselor](https://kairoslearn.com/find-counselor)\n`;
  return new NextResponse(content, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
```

  - **llms-full.txt/route.ts:** the same header plus one section per product area: Coach Kairos, school list, applications and deadlines, essays (feedback only), activities, college interviews, financial aid and net price, family mode, counselors, and pricing from `src/lib/pricing.ts` (read its exported constants; don't hardcode prices).
  - **pricing/subsidized/page.tsx:84:** replace "All 69+ courses" with the Pro benefit line from `src/lib/pricing.ts`, or remove the bullet if there is none.
  - **faq/page.tsx:** remove the `courses` import and any Q&A about courses, lessons or coding. Keep the admissions Q&As.
  - Check `grep -rn "PricingCards\|PaywallModal" src --include=*.tsx --include=*.ts`: only comments should match. Then `git rm` both files.

- [ ] **Step 4: Run it**

  Run: `npx vitest run src/app/__tests__/seo-admissions.test.ts && npx tsc --noEmit -p . 2>&1 | tail -5`
  Expected: PASS, and tsc exits 0.

- [ ] **Step 5: Commit** each changed and new path explicitly, plus `git rm -q` for the two pricing components. Message: `feat(refocus): sitemap, manifest, llms.txt and pricing copy describe the admissions product`.

### Task 5: Delete retired routes

**Files:**
- Delete (pages):
  - `src/app/course/`, `src/app/courses/`, `src/app/learn/`, `src/app/pathways/`, `src/app/talk/`, `src/app/placement/`, `src/app/practice/`
  - `src/app/onboarding/language/`, `src/app/classrooms/`, `src/app/sessions/`, `src/app/leaderboard/`, `src/app/achievements/`
  - `src/app/credentials/`, `src/app/verify/`, `src/app/dashboard/`, `src/app/admin/page.tsx`, `src/app/admin/courses/`
  - `src/app/blog/`, `src/app/comparison/`, `src/app/tools/`, `src/app/interviews/`, `src/app/career/`
- Delete (APIs):
  - `src/app/api/{courses,progress,xp,streak,gems,classrooms,sessions,credentials,career,bridges,trends,knowledge-cache}/`
  - `src/app/api/admin/{seed-courses,league-reset}/`
  - `src/app/api/ai/{coach,hint,grade,generate-lesson,articulation,forgetting,misconceptions,podcast,prompt-lab,recommendations,session-chat,supervise,chat,tts}/`
  - `src/app/api/language/{session,placement,vocab,voice-session}/`
  - `src/app/api/language/sarvam/route.ts`, `src/app/api/language/sarvam/respond/`, `src/app/api/language/sarvam/transcribe/`
  - `src/app/api/interviews/{run-code,problems}/`
- Delete (e2e): `tests/e2e/{courses,talk,agent-memory,interview-session}.spec.ts`
- Modify: `src/app/api/admin/__tests__/admin-secret.test.ts` (drop the seed-courses and league-reset cases)
- Modify: `src/lib/__tests__/retired-routes.test.ts` (add a directory-absence test)

**Interfaces:**
- Consumes: `RETIRED_ROUTE_REDIRECTS` (Task 1).
- Produces: nothing new.

**Checks before running `git rm`:**
- For every API directory, confirm no kept file calls it: `grep -rn "<api path>" src --include=*.ts --include=*.tsx`, excluding the files being deleted.
- `api/language/voice-session`: if `useVoiceAgent` or Coach Kairos fetches it, keep it and ledger a ruling.
- `api/ai/tts`: if `/glossary` or `cc` fetches it, keep it and ledger a ruling.
- `api/admin/*`: `src/app/api/admin/**` contains other admin routes. Delete only the two named.

- [ ] **Step 1: Write the failing test.** Append to `src/lib/__tests__/retired-routes.test.ts`:

```ts
import fs from "node:fs";
it("no page directory remains for a retired route", () => {
  const bases = [...new Set(RETIRED_ROUTE_REDIRECTS.map((r) => r.source.replace("/:path*", "")))].filter((b) => b !== "/admin");
  expect(bases.filter((b) => fs.existsSync(`src/app${b}`))).toEqual([]);
  expect(fs.existsSync("src/app/admin/page.tsx")).toBe(false);
});
```

- [ ] **Step 2: Run it**

  Run: `npx vitest run src/lib/__tests__/retired-routes.test.ts`
  Expected: FAIL, listing `/course`, `/courses`, … (21 bases).

- [ ] **Step 3: Delete** with `git rm -r -q <each path above>`. Then edit `admin-secret.test.ts` to remove the cases for the two deleted admin routes.

- [ ] **Step 4: Run them**

  Run: `npx vitest run src/lib/__tests__/retired-routes.test.ts src/app/api/admin && npx tsc --noEmit -p . 2>&1 | tail -20`
  Expected: PASS, and tsc exits 0. If tsc names a kept file importing a deleted route module, that's a keep-list conflict: restore that module and ledger a ruling.

- [ ] **Step 5: Commit.** Message: `feat(refocus): delete the learning product's pages and APIs`.

### Task 6: Move shared voice types and delete the course catalogue

**Files:**
- Create: `src/lib/voice/language-types.ts` (the exact content of `src/data/language-types.ts`, via `git mv`)
- Modify: every kept importer of `@/data/language-types`. Find them with `grep -rln "data/language-types" src`; they include `src/lib/language-personas.ts:4`.
- Delete: everything in `src/data/` except the keep-set (Global Constraints)
- Create: `src/data/__tests__/keep-set.test.ts`

**Interfaces:**
- Produces: `@/lib/voice/language-types`, with the same exports as the old file.

- [ ] **Step 1: Write the failing test** at `src/data/__tests__/keep-set.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";

const KEEP = new Set([
  "__tests__", "college-interviewer-personas.ts", "interview-personas.ts", "school-application-plans.json",
  "school-deadlines-2026.json", "supplement-prompts-2026.json", "canadian", "uk", "cc",
]);

describe("src/data holds only admissions data", () => {
  it("nothing outside the keep-set", () => {
    expect(fs.readdirSync("src/data").filter((f) => !KEEP.has(f))).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it**

  Run: `npx vitest run src/data/__tests__/keep-set.test.ts`
  Expected: FAIL, listing roughly 90 course directories, `index.ts`, `types.ts` and others.

- [ ] **Step 3: Implement**
  1. Run `git mv src/data/language-types.ts src/lib/voice/language-types.ts`. Rewrite each kept importer to `@/lib/voice/language-types`. Kept importers are those not in a directory Tasks 5–7 delete.
  2. List everything to delete: `ls src/data | grep -vxF -f <(printf '%s\n' __tests__ college-interviewer-personas.ts interview-personas.ts school-application-plans.json school-deadlines-2026.json supplement-prompts-2026.json canadian uk cc)`. Check the list for anything admissions-looking that isn't in the keep-set. If you find one, keep it and ledger a ruling.
  3. `git rm -r -q` each listed entry. This includes `src/data/languages/` and its tests (the `slugs.ts` from the page-weight commit goes too; providers no longer import it after Task 3).
  4. Run `npx tsc --noEmit -p . 2>&1 | grep "error TS" | sed 's/(.*//' | sort -u`. Each erroring file is now either:
     - a learning-only component, hook or lib whose `@/data` import has gone: delete it in this step (`git rm`) and repeat until tsc is clean; or
     - a kept file: stop, fix the import minimally, and ledger a ruling. Example: `interview/InterviewSetup` imports tech personas, which are kept, so there's no error.

- [ ] **Step 4: Run them**

  Run: `npx vitest run src/data src/components/cc src/hooks src/lib && npx tsc --noEmit -p . 2>&1 | tail -3`
  Expected: PASS, and tsc exits 0.

- [ ] **Step 5: Commit** with explicit paths and `git rm`. Message: `feat(refocus): delete the 32 MB course catalogue; voice types move to lib/voice`.

### Task 7: Delete orphaned learning code; repo-wide guard

**Files:**
- Delete the learning-only files that no retained entry point reaches. Candidates from the inventory:
  - `components/{lesson,course,language,exercise,ide,editor,classroom,sessions,seo,career,cinematic,gamification,ai}/`
  - `components/layout/{CourseLayout,Sidebar}.tsx`
  - `components/onboarding/{WelcomeWizard,SetupChecklist,LanguageGrid}.tsx`
  - `components/search/`
  - `contexts/{AIContext,XPContext,AIStateContext}.tsx`
  - hooks: `useCourseProgress`, `useAIChat`, `useAISupervision`, `useScrollCoach`, `useCredentialWallet`, `usePresence`, `useSessionChannel`, `useEditorSync`, `useKeyboardShortcuts`, `useSoundEffect`, `useLocalVoiceAgent`, `useVoiceConversation`, `useSpeechRecognition`, `useSpeechToText`, `useLiveCoach`
  - libs: `xp`, `progress`, `gems`, `streaks*`, `leaderboard*`, `achievements*`, `rewards`, `dailyMissions`, `classroom`, `course-generator`, `course-registry`, `misconceptions`, `articulation`, `reading-time`, `domain-coaches`, `trends`, `skills-radar`, `career-coach`, `ai-prompts`, `language-agent`, `language-profile`, `language-session-analyzer`, `credential-*`, `credentials-pro-gate`, `voice-memory`, `call-translate`, `voiceInput`, `useNeuralCanvas`, and their tests.
- **Delete a candidate only if the orphan check below finds no importer outside the delete set.**
- Mixed e2e specs: remove only the learning cases from these files:
  - `tests/e2e/{authenticated-flows,comprehensive-visual-audit,visual-review,visual-audit,user-flow-bugs,mobile-ui,smoke-test}.spec.ts`
  - Learning cases are any `goto` or expectation that names a retired path.
- Modify: `src/lib/__tests__/use-client-directive.test.ts:11`, if its `src/data` special case now points at nothing.
- Modify: `src/__tests__/retired-links.test.ts` (the repo-wide guard).

**Orphan check:**
- Scratch script: `$SCRATCH/orphans.mjs`. It is not committed.
- Starting points: every `src/app/**/{page,layout,route,template,error,not-found,loading,opengraph-image}.tsx?`, plus `src/middleware.ts`, `src/instrumentation*.ts`, `src/app/{sitemap,robots,manifest}.ts`, and every non-test file under `scripts/`.
- Follow static and dynamic `import`/`require` specifiers, resolving `@/` to `src/`.
- Print the `src/**` non-test `.ts`/`.tsx` files it never reaches.
- Delete an unreached file only if it is on the candidate list, or plainly learning-only by name and content. Leave anything else and ledger it as follow-up.

- [ ] **Step 1: Write the failing test.** Extend `src/__tests__/retired-links.test.ts`:

```ts
import { execSync } from "node:child_process";
it("no shipped source links to a retired page or API", () => {
  const files = execSync("git ls-files src", { encoding: "utf8" }).split("\n")
    .filter((f) => /\.(ts|tsx)$/.test(f) && !/__tests__|\.test\.|retired-routes\.ts$/.test(f));
  expect(findRetiredReferences(files)).toEqual([]);
});
it("admissions coursework survives", () => {
  expect(require("node:fs").existsSync("src/app/cc/courses/page.tsx")).toBe(true);
});
```

- [ ] **Step 2: Run it**

  Run: `npx vitest run src/__tests__/retired-links.test.ts`
  Expected: FAIL, listing hits in the learning components and libs (for example `components/lesson/*`, `lib/xp.ts`).

- [ ] **Step 3: Implement.** Run the orphan check. `git rm` the confirmed orphans. For hits in **kept** files, remove the dead link. Example: a cc component linking to `/courses` gets `/cc/courses` if it meant coursework; otherwise the link is removed. Ledger each kept-file edit. Prune the mixed e2e specs.

- [ ] **Step 4: Run them**

  Run: `npx vitest run src > $WS/vitest.log 2>&1; tail -5 $WS/vitest.log && npx tsc --noEmit -p . 2>&1 | tail -3`
  Expected: all files pass, and tsc exits 0.

- [ ] **Step 5: Commit** with explicit paths and `git rm`. Message: `feat(refocus): remove orphaned learning code; guard the whole tree`.

### Task 8: Build, measure, e2e, record

**Files:**
- Modify: `docs/handoff/claude-progress.md` (a Refocus section: what went, redirects, follow-ups F1–F5, measurements)
- Modify: `.agent/Decisions.md` (the decision and its reason)

- [ ] **Step 1: Build**

  Run: `npm run build > $WS/build.log 2>&1; echo $?`
  Expected: `0`, and no route list entry for a retired path (`grep -E "^. /(course|talk|leaderboard)" $WS/build.log` is empty).

- [ ] **Step 2: Measure**

  Run `next start -p 3100` and the existing Playwright weight script from the page-weight commit, against `/`, `/pricing` and `/login`.
  Expected: each is ≤ 975 / 617 / 621 KiB. Also `curl -sI localhost:3100/course/python-fundamentals` shows `307` with `location: /`.

- [ ] **Step 3: e2e**

  Run: `npx playwright test tests/e2e/student-variants.spec.ts --project="Desktop Chrome" --workers=1`. It needs the dev server at its configured URL; follow the spec's own setup notes.
  Expected: every variant passes. Only if memory allows: skip it and ledger a ruling if the machine is under memory pressure.

- [ ] **Step 4: Clean-worktree type-check.** Use a `git worktree add` of HEAD with a `node_modules` junction, then run `npx tsc --noEmit -p .`.
  Expected: `0`. Remove the junction with PowerShell `$j.Delete()` before deleting the folder.

- [ ] **Step 5: Commit** the two docs, with explicit paths. Message: `docs(refocus): record the admissions-only release candidate`.
