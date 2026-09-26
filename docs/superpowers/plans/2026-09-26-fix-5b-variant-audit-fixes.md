# Fix 5b — student-variant audit fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the two engineering root causes found by the every-student-type audit (`docs/qa/2026-09-26-student-variant-audit.md`):
1. `GET /api/cc/me` doesn't exist, yet four pages depend on it. The transfer profile never pre-fills, so a save can overwrite the student's data with blanks.
2. The wallet SDK loads on every page and logs COOP errors, although only `/credentials` uses it.

**Architecture:**
- A small authenticated route returns the caller's own student profile fields (the ones the four callers read).
- `PrivyProvider` moves from the global `Providers` into a `/credentials` layout, the only place `usePrivy` is used (`src/hooks/useCredentialWallet.ts` ← `src/app/credentials/page.tsx`).

**Tech Stack:** Next.js 16, Supabase, vitest 4, `@privy-io/react-auth`.

**Spec:** the audit above, plus `docs/pilot/ad-astra-readiness.md` (the fix-5b row).

## Global Constraints

- `npx vitest run <path>` only. Never `npm run test:unit`.
- No deploy or migration. `git add` explicit paths after checking `git diff --stat`. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.
- The route returns **only the caller's own** profile, via `requireAuth` plus `user_id = auth.user.id`. No other student's data, and no internal fields beyond what the callers read.

## Review Focus

1. **A user with duplicate `cc_student_profiles` rows** (the table has no unique `user_id`) must get one deterministic profile, not an error. Pinned in Task 1.
2. **Signed-out or guest callers** get 401, and every caller already treats non-OK as "no profile". Pinned in Task 1.
3. **A student with no profile row yet** gets `{ profile: null }` with 200, not a 500. Pinned in Task 1.
4. **The transfer profile page** pre-fills saved answers once the route exists. Verify in the browser with the `e2e-v-transfer` QA account.
5. **`/credentials` still works** after moving the provider: no "must be used within PrivyProvider" error. No other page loses anything, because no other file imports `@privy-io/react-auth`. Pinned in Task 2 by a static test, plus a browser check.

---

### Task 1: `GET /api/cc/me`

**Files:** Create `src/app/api/cc/me/route.ts`. Test: `src/app/api/cc/__tests__/me.test.ts`.

**Interfaces:** Produces `GET /api/cc/me`, which returns `{ profile: { id, grade_level, is_transfer_student, is_international, affordability_value, needs_full_aid, transfer_current_school, transfer_credits_completed, transfer_target_term, transfer_reason, preferred_name } | null }`.

- [ ] **Step 1: Failing test.** Use `createFakeSupabase` with a `cc_student_profiles` seed. Cases:
  - own profile returned;
  - another user's row never returned;
  - `profile: null` when the user has no row;
  - with two rows for the user, the first by `id` order;
  - 401 when signed out.

  Run it. Expected: FAIL (module missing).
- [ ] **Step 2: Implement.**

```ts
// src/app/api/cc/me/route.ts
import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";

// The signed-in student's own profile fields read by /schools, /applications,
// the home walkthrough and /cc/transfer-profile. It was called in four places
// but never existed, so those pages silently fell back to defaults.
const FIELDS =
  "id, preferred_name, grade_level, is_transfer_student, is_international, affordability_value, needs_full_aid, " +
  "transfer_current_school, transfer_credits_completed, transfer_target_term, transfer_reason";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { data, error } = await createAdminSupabase()
    .from("cc_student_profiles")
    .select(FIELDS)
    .eq("user_id", auth.user.id)
    .order("id")
    .limit(1);
  if (error) return NextResponse.json({ error: "Could not load profile" }, { status: 500 });
  return NextResponse.json({ profile: data?.[0] ?? null });
}
```

Run the test. Expected: PASS.
- [ ] **Step 3: Commit.** `fix(cc): add GET /api/cc/me — four pages called it but it never existed`.

### Task 2: Load the wallet SDK only on `/credentials`

**Files:**
- Create `src/app/credentials/layout.tsx`.
- Modify `src/app/providers.tsx` (remove the `PrivyProvider` wrapper and its import).
- Test: `src/app/__tests__/privy-scope.test.ts`.

- [ ] **Step 1: Failing static test.**

```ts
// src/app/__tests__/privy-scope.test.ts
// The Privy wallet SDK (and Coinbase's base-account SDK it pulls in) loaded on
// every page and logged COOP errors; only /credentials uses it.
import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("Privy is scoped to /credentials", () => {
  it("the global providers don't mount it", () => {
    expect(fs.readFileSync("src/app/providers.tsx", "utf8")).not.toMatch(/PrivyProvider/);
  });
  it("the credentials layout does", () => {
    const layout = fs.readFileSync("src/app/credentials/layout.tsx", "utf8");
    expect(layout).toMatch(/<PrivyProvider>\s*\{children\}\s*<\/PrivyProvider>/);
  });
});
```

Run it. Expected: FAIL.
- [ ] **Step 2: Implement.**

```tsx
// src/app/credentials/layout.tsx
import { PrivyProvider } from "@/components/providers/PrivyProvider";

// Wallets are only used for verifiable credentials; don't ship the wallet SDK
// to every page.
export default function CredentialsLayout({ children }: { children: React.ReactNode }) {
  return <PrivyProvider>{children}</PrivyProvider>;
}
```

In `src/app/providers.tsx`, delete `import { PrivyProvider } …` and the `<PrivyProvider>` / `</PrivyProvider>` wrapper lines. Run the test. Expected: PASS. Then run `npx tsc --noEmit -p .`. Expected: 0.
- [ ] **Step 3: Browser check.** On the dev server, signed in as `e2e-v-transfer@test.local`:
  - `/cc/dashboard` has **no** "Cross-Origin-Opener-Policy" console error;
  - `/credentials` renders with no "PrivyProvider" error in the console;
  - `/cc/transfer-profile` shows the seeded "QA Community College";
  - `GET /api/cc/me` returns 200.

  Take screenshots.
- [ ] **Step 4: Commit.** `perf(credentials): load the wallet SDK only on /credentials`.

### Task 3: Verification

- [ ] `npx vitest run src --maxWorkers=4`: all pass. `npx tsc --noEmit -p .`: 0. `npm run build`: 0.
- [ ] Re-run `npx playwright test tests/e2e/student-variants.spec.ts --project="Desktop Chrome" --workers=1`. Expected: 16/16 pass, with no `/api/cc/me` 404 and no COOP console findings. The g9 redirects remain; they're intended and handed to design.
- [ ] Update `docs/qa/2026-09-26-student-variant-audit.md` (the fixed rows), `docs/pilot/ad-astra-readiness.md` and `docs/handoff/claude-progress.md`.
