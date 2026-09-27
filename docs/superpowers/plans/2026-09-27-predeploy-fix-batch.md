# Pre-deploy Fix Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the student-facing bugs that the 2026-09-27 audit-resolution matrix found open or wrongly marked fixed, before the admissions-only release ships.

**Architecture:** These are small, independent corrections to copy, links, queries and one public API route. Each has a test that pins the wrong behaviour first. No schema changes and no new features.

**Tech Stack:** Next.js 16, React 19, TypeScript, vitest 4 (jsdom).

**Spec:** `docs/qa/2026-09-27-audit-resolution-matrix.md` (rows QA-09, 13, 15, 26, 34, 40, 41, 44, 49, 50, 52, plus the "defects no fix covers" section) and the audit `grokking/docs/design/2026-09-live-audit.md`. The spec's binding rules: the AI never writes essay prose; prices and credits come from `src/lib/pricing.ts`; never promise admission.

## Global Constraints

- Branch `refocus/admissions-only` in `C:\Users\bilal\Downloads\grokking-integrate`.
- Never run `npm run test:unit`. Use `npx vitest run <files>` or `npx vitest run src`.
- `git add` explicit paths only. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.
- No migrations, no deploy.
- Real column names on `cc_activities`, from `supabase/migrations/20260417_coach_kairos_schema.sql`: `organization`, `role`, `activity_type`, `description_150`, `impact_score`, `position`. There is no `activity_name`, `organization_name` or `description`.

## Review Focus

1. **A copy check that misses variants.** "300 AI credits" slipped through because the old test only matched "300 credits". The widened pattern must catch "300 AI credits" and "300 credits". Pinned in Task 1.
2. **The public counselor search leaking private data.** Opening `/api/counselor/search` to signed-out visitors must return only marketplace-public fields. Task 2 reads the route and asserts that no email or user_id is in the select.
3. **Coach context silently empty.** A select on a column that doesn't exist returns an error, and the code treats that as "no activities". Pinned in Task 4 with a test that asserts the selected columns.
4. **The LOCI letter inventing school specifics.** The prompt must not tell the model to pick programs or professors. Pinned in Task 4.
5. **Mobile sign-out going to a 404.** Pinned in Task 3 by a drawer test and by extending the nav-links test to the drawer.

---

### Task 1: Signup credits copy from `PRICING`; widen the tripwire

**Files:**
- Modify: `src/app/signup/page.tsx:130,171`
- Modify: `src/lib/__tests__/pricing-copy.test.ts:12`

- [ ] **Step 1 (test):** in `STALE`, change `/\b300 credits\b/i` to `/\b300 (AI )?credits\b/i`.
- [ ] **Step 2:** run `npx vitest run src/lib/__tests__/pricing-copy.test.ts`. Expected: FAIL, naming `src/app/signup/page.tsx`.
- [ ] **Step 3:** in `signup/page.tsx`, import `PRICING` from `@/lib/pricing`.
  - Line 130: `(300 AI credits included)` becomes `({PRICING.free.signupCredits} AI credits to start)`.
  - Line 130: "free 7-day Pro trial" becomes `free {PRICING.pro.trialDays}-day Pro trial`.
  - Line 171: `Free 7-day Pro trial for students — 300 AI credits included` becomes `Free {PRICING.pro.trialDays}-day Pro trial for students — {PRICING.free.signupCredits} AI credits to start`.
- [ ] **Step 4:** run the test again. Expected: PASS.
- [ ] **Step 5:** commit: `fix(pricing): signup advertises the 200 signup credits from PRICING; tripwire catches "300 AI credits"`.

### Task 2: Counselor search works for signed-out visitors (QA-15)

**Files:**
- Modify: `src/middleware.ts` (`PUBLIC_PREFIXES`)
- Test: `src/middleware.welcome.test.ts`

- [ ] **Step 1 (test):** add `it("counselor search is public, like /find-counselor", () => expect(isPublicRoute("/api/counselor/search")).toBe(true))`. Add a second test that reads `src/app/api/counselor/search/route.ts` source and asserts it doesn't contain `email` or `.select("*")`, which keeps it to public fields.
- [ ] **Step 2:** run the tests. Expected: the first FAILS. For the second, read its result: if the route selects private fields, stop and ledger a ruling (select only public profile columns) before opening it.
- [ ] **Step 3:** add `"/api/counselor/search",` to `PUBLIC_PREFIXES`, next to `"/find-counselor"`, with the comment `// read-only marketplace search behind the public /find-counselor page`.
- [ ] **Step 4:** run the tests. Expected: PASS.
- [ ] **Step 5:** commit: `fix(marketplace): signed-out visitors can search counselors on /find-counselor`.

### Task 3: Dead links and misleading dashboard states (drawer sign-out, QA-52, QA-40)

**Files:**
- Modify: `src/components/mobile/MobileDrawer.tsx:132`
- Modify: `src/components/mobile/MobileDrawer.test.tsx`
- Modify: `src/components/nav/__tests__/nav-links.test.ts` (scan `MobileDrawer.tsx`)
- Modify: `src/app/cc/dashboard/variants.ts:480,695`
- Test: `src/app/cc/dashboard/__tests__/variants-truth.test.ts`

- [ ] **Step 1 (tests):**
  - **Drawer:** add a test. Render the drawer with `open`, mock `@/contexts/AuthContext` `useAuth` returning `{ signOut }`, click "Sign out", and expect `signOut` to have been called once.
  - **nav-links:** add `"src/components/mobile/MobileDrawer.tsx"` to `SOURCES`, and extend `internalHrefs` to match `href="/..."` as well as `href: "..."`.
  - **`variants-truth.test.ts`:** build the senior-writing variant with `schoolCount: 0, nextDeadline: null`. Expect no card meta equal to "All deadlines logged." Build the transfer quick links and expect no link labelled "Translate-for-parent docs" pointing at `/cc/recommenders`. Read `variants.ts` exports to call the real builder functions.
- [ ] **Step 2:** run the three test files. Expected: FAIL, for these reasons:
  - the drawer isn't wired to `signOut`;
  - nav-links reports `/account/sign-out`;
  - the meta says "All deadlines logged.";
  - the transfer link is wrong.
- [ ] **Step 3 (implement):**
  - **Drawer:** replace the `<Link href="/account/sign-out">` with `<button type="button" onClick={() => signOut()} className="text-white/55 hover:text-white">Sign out</button>`, using `useAuth()` from `@/contexts/AuthContext`.
  - **`variants.ts:480`:** the meta becomes `d.nextDeadline ? … : d.schoolCount === 0 ? "Add schools to see deadlines." : "No upcoming deadlines found."`.
  - **`variants.ts:695`:** becomes `{ href: "/cc/recommenders", icon: "mail", label: "Professor recommendations" }`.
- [ ] **Step 4:** run the tests. Expected: PASS.
- [ ] **Step 5:** commit: `fix(nav): phone sign-out works; honest empty-deadline and transfer links`.

### Task 4: Coach and LOCI read real activity columns; LOCI stops inventing (QA-49 plus the coach defect)

**Files:**
- Modify: `src/app/api/cc/coach/message/route.ts:279,323`
- Modify: `src/app/api/cc/waitlist/loci/route.ts:17-40,44`
- Test: `src/app/api/cc/__tests__/activity-columns.test.ts`

- [ ] **Step 1 (test):** a source-level test (the routes need a DB to run):

```ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
const REAL = new Set(["id", "student_id", "position", "activity_type", "organization", "role", "description_150", "star_situation", "star_task", "star_action", "star_result", "grades_participated", "hours_per_week", "weeks_per_year", "is_continuing", "impact_score", "updated_at"]);
function selectedActivityColumns(src: string): string[] {
  return [...src.matchAll(/from\("cc_activities"\)\s*\.select\("([^"]+)"\)/g)].flatMap((m) => m[1].split(",").map((c) => c.trim()));
}
describe("cc_activities selects use real columns", () => {
  it.each(["src/app/api/cc/coach/message/route.ts", "src/app/api/cc/waitlist/loci/route.ts"])("%s", (f) => {
    const cols = selectedActivityColumns(fs.readFileSync(f, "utf8"));
    expect(cols.length).toBeGreaterThan(0);
    expect(cols.filter((c) => !REAL.has(c))).toEqual([]);
  });
  it("LOCI never tells the model to invent school specifics", () => {
    const src = fs.readFileSync("src/app/api/cc/waitlist/loci/route.ts", "utf8");
    expect(src).not.toMatch(/pick something concrete/i);
  });
});
```

- [ ] **Step 2:** run it. Expected: FAIL. The unknown columns are `activity_name`, `organization_name` and `description`, and the prompt still says "pick something concrete".
- [ ] **Step 3 (implement):**
  - **Coach:** select `"organization, activity_type, role, impact_score"`, with `name: (a.organization as string) ?? (a.activity_type as string) ?? "Activity"`.
  - **LOCI:** select `"position, organization, role, description_150"` and map it to `` `- ${a.role ?? "Member"} at ${a.organization ?? "?"}: ${a.description_150 ?? ""}` ``.
  - **LOCI prompt:** replace the programs line with "Cite only programs, professors or opportunities the student named in 'Why this school is right'. If they named none, do not invent any. Say what kind of specifics would strengthen the letter in a bracketed note for the student instead."
  - **LOCI inputs:** require `updates` or `why_this_school`; if both are empty, return 400 `{ error: "Tell us at least one update or why this school — the letter can't be specific without you." }`.
- [ ] **Step 4:** run it. Expected: PASS.
- [ ] **Step 5:** commit: `fix(coach,loci): read real cc_activities columns; LOCI never invents school specifics`.

### Task 5: Truthful small UI (QA-44, QA-50, QA-41, QA-34, QA-09, QA-26)

**Files:**
- Modify: `src/app/cc/interview-prep/page.tsx:189`
- Modify: `src/app/onboarding/page.tsx:618`
- Modify: `src/components/cc/essay/BrainstormChat.tsx:915-917`
- Modify: `src/app/schools/page.tsx:131-141`
- Modify: `src/app/counselor/team/page.tsx:296-300`
- Modify: `src/app/cc/courses/page.tsx:24,31-32`
- Test: `src/app/__tests__/truthful-ui.test.ts`

- [ ] **Step 1 (test):** one source-level file, one `it` per item:

```ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
const read = (f: string) => fs.readFileSync(f, "utf8");
describe("truthful UI", () => {
  it("interview prep shows acceptance rate as a percentage", () =>
    expect(read("src/app/cc/interview-prep/page.tsx")).not.toMatch(/\$\{school\.cc_schools\.acceptance_rate\}%/));
  it("transfer onboarding never promises the coach will draft the essay", () =>
    expect(read("src/app/onboarding/page.tsx")).not.toMatch(/will draft your transfer essay/i));
  it("Brainstorm has no Attach button that does nothing", () =>
    expect(read("src/components/cc/essay/BrainstormChat.tsx")).not.toMatch(/aria-label="Attach"/));
  it("the school list does not force the coach open on load", () =>
    expect(read("src/app/schools/page.tsx")).not.toMatch(/coachAutoOpened/));
  it("used-up invite codes are not shown as active", () =>
    expect(read("src/app/counselor/team/page.tsx")).toMatch(/usedCount\s*>=\s*c\.maxUses/));
  it("the course form offers a regular level and doesn't hard-code grade 11", () => {
    const s = read("src/app/cc/courses/page.tsx");
    expect(s).toMatch(/"Regular"/);
    expect(s).not.toMatch(/useState\(11\)/);
  });
});
```

- [ ] **Step 2:** run it. Expected: FAIL, 6 tests.
- [ ] **Step 3 (implement):**
  - **Interview prep:** `` ` · ${Math.round(school.cc_schools.acceptance_rate * 100)}% acceptance` ``. The same ×100 convention is used in `SchoolCard.tsx:73` and `schools/[id]/page.tsx:160`.
  - **Onboarding placeholder:** "A few sentences is enough — be honest, not polished. You'll write the essay; Coach Kairos helps you find what to say."
  - **Brainstorm:** delete the Attach button and remove the `Paperclip` import if nothing else uses it.
  - **Schools:** delete the `coachAutoOpened` ref and effect, and the comment above it. The guest hero handoff it served came from the retired `/landing`.
  - **Team:** replace the status cell with `c.revokedAt ? revoked : c.usedCount >= c.maxUses ? <span className="text-white/45">used up</span> : active`.
  - **Courses:**
    - `LEVELS` gains `"Regular"` after `""`.
    - `gradeLevel` starts as `useState<number | null>(null)`, and `curriculumType` as `useState("")`.
    - On mount, `fetch("/api/cc/me")`. When it returns `grade_level` or `curriculum_type`, set them. Fall back to 11 or "US (AP)" only when the profile has none.
    - Submission uses `gradeLevel ?? 11`.
    - Read `/api/cc/me`'s response shape before wiring it. If it has no curriculum, ledger a ruling and only default the grade.
- [ ] **Step 4:** run the test, then `npx tsc --noEmit -p .`. Expected: PASS, and tsc 0.
- [ ] **Step 5:** commit: `fix(ui): truthful rates, onboarding copy, codes, course defaults; no dead Attach or forced coach`.

### Task 6: Whole-suite check, rebuild, live re-check

- [ ] **Step 1:** `npx vitest run src`. Expected: all pass.
- [ ] **Step 2:** stop the 3100 server, run `npm run build`, then restart `next start -p 3100`. Expected: build 0.
- [ ] **Step 3:** re-run the scratchpad `signedout.mjs`. Expected:
  - `/landing` lands on `/`;
  - the `/find-counselor` list isn't empty when counselors exist, and there's no 401 on `/api/counselor/search`;
  - no new overflow or page errors.
- [ ] **Step 4:** update the matrix rows for the fixed items (FIXED-VERIFIED, with test names) and `docs/handoff/claude-progress.md`. Commit both with explicit paths.
