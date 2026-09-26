# Fix 5a — Ad Astra pilot readiness and every-student-type testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the pilot blockers found so far and prove, with repeatable evidence, that every student type (g9, g10, junior, senior_writing, senior_post_submit, senior_decisions, transfer, plus unknown grade) can use the core app on desktop and phone without errors. The Ad Astra readiness checklist records the status of everything.

**Architecture:**
- Two server fixes: cron routes fail closed, and the optimizer caps instead of blocking.
- One CSS bug fix: the footer overflow at 375px.
- An idempotent seed script creates one QA student per variant, as admin-created `@test.local` accounts.
- A Playwright spec (`tests/e2e/student-variants.spec.ts`) walks every variant through the core pages on desktop and on the iPhone project. It records failed API calls, console errors and horizontal overflow, and writes findings to a JSON report.
- Findings become a triaged audit doc. Engineering bugs go to a follow-up fix plan; UI/UX findings go to Codex session B as a prompt.

**Tech Stack:** Next.js 16, Supabase (service role for seeding QA rows only), Playwright 1.58 (existing config: `Desktop Chrome`, `Mobile iPhone 14`), vitest 4.

**Spec:** the founder's item 5 ("Ad Astra readiness, and full testing of every student type") and `codex-astra-handover-prompt.md` §2 (Claude owns pilot readiness and testing). Variant rules: `selectVariant` in `src/app/cc/dashboard/variants.ts:821`.

## Global Constraints

- Tests: `npx vitest run <path>`. **Never `npm run test:unit`**; it resets DB fixtures in production. Playwright runs **only** `npx playwright test tests/e2e/student-variants.spec.ts`, never the whole e2e folder, because other specs call `resetCounselorE2eState`.
- Production writes are limited to QA rows the seed script creates: `e2e-v-*@test.local` users and their profile, school and essay rows. Never touch other users.
- No deploys or migrations. `git add` explicit paths only, after checking `git diff --stat` for unrelated edits. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.
- UI/UX redesign is out of scope. Record visual findings for Codex session B. Fix only functional bugs: overflow, errors and dead ends.
- Never print secrets.

## Review Focus

1. **Cron with `CRON_SECRET` unset or empty** must return 403, never run. Pinned in Task 1.
2. **A student with exactly 10 activities (the Common App maximum), or 12,** must get an optimization of the first N allowed rows, not a paywall. Pinned in Task 2.
3. **Unknown grade (null) and transfer students** must land on a working dashboard, not a crash or an empty shell. Pinned in Task 5 (the `unknown` and `transfer` cases).
4. **A variant page that fails silently** must be caught: an API 5xx swallowed by the UI, or a request rejected with 401/403/404 by our own API. Pinned in Task 5 (network capture on `/api/`).
5. **Phone width:** no page in the core set may overflow horizontally at 375px. Pinned in Task 5 (the overflow assertion on the Mobile project) and Task 3.

---

### Task 1: Cron routes fail closed

**Files:**
- Modify: `src/lib/admin-secret.ts`, `src/app/api/cron/deadline-reminders/route.ts:39-42`, `src/app/api/cron/generate-observations/route.ts:124-127`
- Test: `src/app/api/cron/__tests__/cron-auth.test.ts`

**Interfaces:**
- Produces: `hasBearerSecret(authorization: string | null, envName: "CRON_SECRET"): boolean`. Constant time; false when the env var is unset or empty.

- [ ] **Step 1: Failing test**

```ts
// src/app/api/cron/__tests__/cron-auth.test.ts
// With CRON_SECRET unset, the old check compared against "Bearer " and let an
// empty bearer through: anyone could trigger student reminder emails or LLM jobs.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { hasBearerSecret } from "@/lib/admin-secret";

vi.mock("@supabase/supabase-js", () => ({ createClient: () => { throw new Error("must not reach the DB"); } }));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => { throw new Error("must not reach the DB"); } }));

import { GET as reminders } from "../deadline-reminders/route";
import { GET as observations } from "../generate-observations/route";

beforeEach(() => vi.stubEnv("CRON_SECRET", ""));

describe("hasBearerSecret", () => {
  it("fails closed when unset", () => expect(hasBearerSecret("Bearer ", "CRON_SECRET")).toBe(false));
  it("accepts only the configured bearer", () => {
    vi.stubEnv("CRON_SECRET", "c-secret");
    expect(hasBearerSecret("Bearer c-secret", "CRON_SECRET")).toBe(true);
    expect(hasBearerSecret("Bearer nope", "CRON_SECRET")).toBe(false);
    expect(hasBearerSecret(null, "CRON_SECRET")).toBe(false);
  });
});

describe("cron routes with CRON_SECRET unset", () => {
  const req = (url: string) => new NextRequest(url, { headers: { authorization: "Bearer " } });
  it("deadline-reminders refuses an empty bearer", async () =>
    expect((await reminders(req("http://l/api/cron/deadline-reminders"))).status).toBe(403));
  it("generate-observations refuses an empty bearer", async () =>
    expect((await observations(req("http://l/api/cron/generate-observations"))).status).toBe(403));
});
```

Before running, open `generate-observations/route.ts` to confirm its handler is `GET` and see what its 403 branch returns. If it returns 401, assert 401 and ledger that. Run: `npx vitest run src/app/api/cron/__tests__/cron-auth.test.ts`. Expected: FAIL (`hasBearerSecret` isn't exported; the routes accept "Bearer ").

- [ ] **Step 2: Implement.** Append to `src/lib/admin-secret.ts`:

```ts
// Vercel Cron sends "Authorization: Bearer <CRON_SECRET>". Fails closed.
export function hasBearerSecret(authorization: string | null, envName: "CRON_SECRET"): boolean {
  const prefix = "Bearer ";
  if (!authorization?.startsWith(prefix)) return false;
  const expected = process.env[envName];
  if (!expected) return false;
  const a = Buffer.from(authorization.slice(prefix.length));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
```

In both routes, replace `` if (auth !== `Bearer ${process.env.CRON_SECRET ?? ""}`) `` with `if (!hasBearerSecret(auth, "CRON_SECRET"))`, importing from `@/lib/admin-secret`. Run the test. Expected: PASS.

- [ ] **Step 3: Commit.** `git add src/lib/admin-secret.ts src/app/api/cron/deadline-reminders/route.ts src/app/api/cron/generate-observations/route.ts src/app/api/cron/__tests__/cron-auth.test.ts`, message `fix(security): cron routes fail closed when CRON_SECRET is unset`.

### Task 2: The activities optimizer caps the list instead of blocking

**Files:**
- Modify: `src/app/api/cc/activities/optimize/route.ts:75-83` (and wherever `activitiesText` is built)
- Test: `src/app/api/cc/__tests__/activities-optimize-cap.test.ts`

**Interfaces:**
- Consumes: `getTier(userId)` and `getCaps(tier)` from `src/lib/cc/tier-gate.ts`.

- [ ] **Step 1: Read the route end to end** so the test mocks match its real dependencies (auth helper, profile lookup, honors, `callLLMJSON` or equivalent, credits). Then write the failing test:
  - seed 10 activities for a free-tier student, and assert status 200 with all 10 in the prompt sent to the model;
  - seed 12 and assert only the first 10 (by `position`) are sent;
  - a guest with 5 gets 3.

  Mock the LLM call and capture its `messages`. Use `createFakeSupabase` from `src/lib/cc/__tests__/helpers/fake-supabase.ts` for tables, static route imports, and hoisted mocks for auth, tier and credits.

- [ ] **Step 2: Run it.** `npx vitest run src/app/api/cc/__tests__/activities-optimize-cap.test.ts`. Expected: FAIL (402 at 10 activities).

- [ ] **Step 3: Implement** what the route's comment already describes, capping instead of blocking:

```ts
  // Cap the rows we optimize at the tier's bullet allowance (guest 3, free and
  // pro 10, the Common App maximum). A full activities list is normal, not a
  // reason to block.
  const caps = getCaps(await getTier(auth.user.id));
  const allowed = (activities ?? []).slice(0, caps.activityBulletsMax);
```

Remove the `assertCapacity(... "activityBulletsMax", activities.length)` block, and use `allowed` everywhere `activities` fed the prompt and the response. Keep the existing empty-list early return, applied to `allowed`. Run the test. Expected: PASS.

- [ ] **Step 4: Commit.** `fix(activities): optimizer caps to the tier allowance instead of blocking full lists`.

### Task 3: The marketing footer fits at 375px

**Files:**
- Modify: `src/components/marketing/marketing.css` (the `.kl-mkt-foot*` rules near line 391)
- Test: `src/components/marketing/__tests__/footer-mobile-contract.test.ts`

- [ ] **Step 1: RED in the browser.** Start the dev server, set `$B viewport 375x812`, go to `/pricing`, and run `document.documentElement.scrollWidth`. Expected: 428 (bug). Record the offending elements: `.kl-mkt-foot-links` is 396px wide in a 311px parent.
- [ ] **Step 2: Failing contract test.**

```ts
// src/components/marketing/__tests__/footer-mobile-contract.test.ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("marketing footer at phone width", () => {
  it("wraps its links and CTA below 640px", () => {
    const css = fs.readFileSync("src/components/marketing/marketing.css", "utf8");
    expect(css).toMatch(/@media \(max-width: 640px\)[\s\S]*\.kl-mkt-foot-links[\s\S]*flex-wrap:\s*wrap/);
  });
});
```

Run it. Expected: FAIL.

- [ ] **Step 3: Implement a minimal bug fix, not a redesign.** Append:

```css
/* 375px: footer links and CTA overflowed 53px (bug fix; the footer design
   itself belongs to Codex D3). */
@media (max-width: 640px) {
  .kl-mkt-foot-links { flex-wrap: wrap; row-gap: 10px; max-width: 100%; }
  .kl-mkt-foot-brand, .kl-mkt-foot-cta { max-width: 100%; flex-wrap: wrap; }
}
```

If the footer's parent is a no-wrap flex row, add `flex-wrap: wrap` to that parent's class inside the same block. Read `MarketingShell.tsx:110-130` for the class names first.

- [ ] **Step 4: GREEN.** The test passes, and in the browser `document.documentElement.scrollWidth === 375` on `/pricing` and `/` at 375px, with a screenshot. Desktop at 1440px is unchanged. Commit: `fix(marketing): footer wraps at phone width instead of overflowing`.

### Task 4: Seed one QA student per variant

**Files:**
- Create: `scripts/qa-seed-student-variants.mjs`

**Interfaces:**
- Produces: users `e2e-v-{g9,g10,junior,senior-writing,senior-post-submit,senior-decisions,transfer,unknown}@test.local`, all with password `E2eTestPass!1`. Each gets a `cc_student_profiles` row with `language_picker_seen_at` set, `grade_level` / `is_transfer_student` per variant, and `preferred_name`. The seniors get `cc_student_schools` rows:
  - writing: statuses `researching` and `applying`;
  - post-submit: `submitted`;
  - decisions: `accepted` and `waitlisted`.

  Every variant gets one personal-statement essay in `brainstorm`.

- [ ] **Step 1: Write the script.**
  - Base it on `scripts/qa-seed-counselor.mjs` (`ensureUser`: create, else update the password; service role from `.env.local`).
  - Before inserting, read the real columns: `supabase/migrations/*cc_student_schools*` for the `application_status` enum values and required columns such as `school_id` (pick existing `cc_schools` ids by name, for example "University of Toronto" and "Harvard University", and fail loudly if they're missing), and the `cc_essays` required columns.
  - Make it idempotent: upsert the profile by `user_id` with select-then-update/insert (the table has no unique `user_id`; see memory `cc-student-profiles-no-unique-user-id`), and delete-then-insert only this user's school and essay rows.
  - Print one line per variant: `variant → user_id, grade, schools`.
- [ ] **Step 2: Run it twice.** `node scripts/qa-seed-student-variants.mjs`. Expected: 8 lines both times, and the second run creates no duplicate profiles (check with a count query in the script's final summary).
- [ ] **Step 3: Commit.** `test(qa): seed one QA student per dashboard variant (@test.local, idempotent)`.

### Task 5: Playwright walk-through of every variant, desktop and phone

**Files:**
- Create: `tests/e2e/student-variants.spec.ts`

**Interfaces:**
- Consumes: the Task 4 accounts. Writes `tests/e2e/test-results/student-variants-findings.json`.

- [ ] **Step 1: Write the spec.**

```ts
// tests/e2e/student-variants.spec.ts
// Walks every dashboard variant through the core student pages and records
// anything a real student would hit: our own /api/ calls failing, console
// errors, and horizontal overflow. Read-only apart from page loads (no form
// submissions). Run ONLY this file; other e2e specs reset production fixtures.
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const PW = "E2eTestPass!1";
const VARIANTS = ["g9", "g10", "junior", "senior-writing", "senior-post-submit", "senior-decisions", "transfer", "unknown"] as const;
const PAGES = ["/cc/dashboard", "/cc/schools", "/cc/essays", "/cc/activities", "/cc/recommenders", "/cc/financial-aid", "/cc/coach"];
type Finding = { variant: string; project: string; page: string; kind: "api" | "console" | "overflow" | "status"; detail: string };
const findings: Finding[] = [];

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/password/i).fill(PW);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30_000 });
}

for (const v of VARIANTS) {
  test(`variant ${v}: core pages load cleanly`, async ({ page }, info) => {
    test.setTimeout(180_000);
    const project = info.project.name;
    let current = "";
    page.on("response", (r) => {
      const u = new URL(r.url());
      if (u.pathname.startsWith("/api/") && r.status() >= 400 && r.status() !== 402) {
        findings.push({ variant: v, project, page: current, kind: "api", detail: `${r.status()} ${r.request().method()} ${u.pathname}` });
      }
    });
    page.on("console", (m) => {
      if (m.type() === "error") findings.push({ variant: v, project, page: current, kind: "console", detail: m.text().slice(0, 200) });
    });

    await login(page, `e2e-v-${v}@test.local`);
    for (const path of PAGES) {
      current = path;
      const res = await page.goto(path);
      await page.waitForLoadState("networkidle").catch(() => {});
      if (!res || res.status() >= 400) findings.push({ variant: v, project, page: path, kind: "status", detail: String(res?.status()) });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) findings.push({ variant: v, project, page: path, kind: "overflow", detail: `${overflow}px` });
      await page.screenshot({ path: `tests/e2e/test-results/variants/${project}-${v}-${path.replaceAll("/", "_")}.png`, fullPage: false });
    }
    await expect(page).not.toHaveURL(/\/login/);
  });
}

test.afterAll(() => {
  fs.mkdirSync("tests/e2e/test-results", { recursive: true });
  const file = "tests/e2e/test-results/student-variants-findings.json";
  const prior = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
  fs.writeFileSync(file, JSON.stringify([...prior, ...findings], null, 2));
});
```

Before running, confirm that each path in `PAGES` exists under `src/app` (drop or rename any that don't, and ledger it). Also confirm the login field placeholders against `src/app/login/page.tsx`.

- [ ] **Step 2: Run it.** Start the dev server yourself first, because the config's `webServer` may start its own. Then `rm -f tests/e2e/test-results/student-variants-findings.json` and run `npx playwright test tests/e2e/student-variants.spec.ts --project="Desktop Chrome" --project="Mobile iPhone 14" --workers=1`. Expected: every login succeeds. Findings may exist; they are the output. A test failure means login or navigation broke, and that is a finding too.
- [ ] **Step 3: Commit the spec** (not the screenshots). `test(e2e): walk every student variant through core pages on desktop and phone`.

### Task 6: Triage findings and the Ad Astra readiness checklist

**Files:**
- Create: `docs/qa/2026-09-26-student-variant-audit.md`, `docs/pilot/ad-astra-readiness.md`

- [ ] **Step 1: Write the audit.** Group `student-variants-findings.json` by root cause, not by page. For each cause, record the variants and pages affected, one screenshot path, a severity (blocker / major / minor), and an owner:
  - **Claude (engineering):** errors, failed API calls, dead ends, data bugs.
  - **Codex session B (design):** layout, hierarchy, copy.

  Deduplicate.
- [ ] **Step 2: Write the readiness checklist.** For each row: status (ready / blocked / founder), evidence link, next step. Rows:
  - security fixes deployed;
  - credit lock-down (applied 2026-09-26);
  - remaining migrations;
  - Vercel env (Stripe price IDs, `CRON_SECRET`, `ADMIN_SECRET`, `TEACHER_SECRET_KEY`);
  - Supabase pausing (QA-11): does the daily cron keep the DB active, and what's the project plan;
  - counselor flow: the head invites, the student joins, the counselor reviews and publishes (from `docs/handoff/claude-progress.md` evidence);
  - every-variant results (Task 5);
  - minors' data (no raw audio retention; privacy page live);
  - the support email shown by Stripe;
  - a rollback plan (redeploy the previous Vercel deployment; the migrations are additive).
- [ ] **Step 3: Hand off.** Engineering blockers and majors go into a follow-up plan, `docs/superpowers/plans/2026-09-26-fix-5b-variant-audit-fixes.md`, written with writing-plans. Design findings go into a Codex prompt, `docs/handoff/codex-prompts/session-b-note-02-variant-audit-design.md`, with each item's surface, evidence and screenshot, what's wrong for which student type, grounding constraints, and acceptance at 375px and 1440px.
- [ ] **Step 4: Commit** the two docs and the prompt.

### Task 7: Verification

- [ ] `npx vitest run src`: all pass. `npx tsc --noEmit -p .`: 0. `npm run build`: 0 (stop the dev server first).
- [ ] Update `docs/handoff/claude-progress.md` with item 5a, including the readiness checklist link.
