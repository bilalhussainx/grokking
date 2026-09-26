# Fix 3 — August bug fixes (invites, counselor identity, workspace, copy, glossary, mobile Essay Studio) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining pilot-blocking bugs from the August QA plan (Tasks 2-6 of `2026-08-17-essay-studio-roadmap.md`), re-verified against today's code on 2026-09-25.

**Architecture:** Small, independent fixes. Each one has a unit or component test, plus a browser check where the bug is visual. No migrations and no production writes.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase (service role in routes), vitest 3 + jsdom + @testing-library/react, gstack `/browse` for the 375px checks.

**Spec:** `docs/superpowers/plans/2026-08-17-essay-studio-roadmap.md` Tasks 2-6 (the source plan) and `docs/design/2026-09-live-audit.md` (Astra's live audit: QA-23 invite loss, mobile Brainstorm/Revise overlap 048/113/116, guest glossary 401/500).

## Re-verification (2026-09-25, this branch)

| August item | Today | This plan |
|---|---|---|
| QA-01 theme picker empty | fixed earlier (`2026-08-17` Task 3 shipped) | — |
| QA-02 ensure-profile 500 | **not reproducible**: fresh signup `+qa-ep1` → 200 ×3, no console errors | — (recorded) |
| QA-03 name seeding | fixed by Fix 2 (`ensureStudentProfile` in onboarding) | — |
| QA-04 no UI to create an agency | **open**: `POST /api/counselor/agency` has zero UI call sites | Task 3 |
| QA-05 join is silent; student never sees counselor | **open**: no `/api/cc/my-counselor`; join says "linked to the agency" | Task 2 |
| QA-23 invite lost on signup | **open**: both "Sign up" links on `/login` drop `?next=`; Google buttons drop it too | Task 1 |
| (new) open redirect on `/login?next=` | **open**: `window.location.assign(next)` with no same-origin check | Task 1 |
| QA-06 glossary 500 / guest 401 | select fixed earlier; **guests still 401** (route not public); prod `cc_glossary` has **0 rows** | Task 5 (seed = founder) |
| QA-07 mobile revise | **open**: at 375px the Revise subhead text is a one-word column (screenshot `40-revise-375-branch.png`) | Task 6 |
| QA-08 essay review badge | done earlier | — |
| QA-09 "Samsara" copy, raw essay_type | **open**: `counselor/team/page.tsx:269`, `students/[studentId]/page.tsx:235,262`. Member names already render. | Task 4 |

August Tasks 7-11 (cliché radar, "so what?" checker, export, assignments, review queue) move to Astra's D2/D4 designs.

## Global Constraints

- App surface per DESIGN.md: `#000` page, `#141414` cards, `#D4AF37` gold, Inter, rounded. No `bg-white/5` cards on anything new.
- Brand in user-facing copy is **KairosLearn**, never "Samsara".
- Tests: `npx vitest run <path>`. **Never `npm run test:unit`**; it runs DB fixtures against production.
- `git add` explicit paths only. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.
- No production writes, migrations, or deploys. Seeding the prod glossary needs founder approval.
- The AI never writes essay prose (untouched here).
- Redirect targets from query strings must be same-origin paths: start with `/`, not `//`, no backslash.

## Review Focus

1. **`next` values that aren't plain paths** (`//evil.com`, `/\evil.com`, `https://…`, `javascript:`) on `/login` and `/signup` must fall back to the default route. Pinned in Task 1 (`safeNextPath` table test).
2. **A student linked with no primary counselor** (`primary_counselor_user_id` null), or whose counselor has no `cc_counselors` row, must still see a name (the agency's), never "undefined". Pinned in Task 2 (route test "falls back to the agency name").
3. **A counselor who already belongs to an agency** must never see the create-workspace card, and a 409 slug clash must show a message rather than fail silently. Pinned in Task 3 (component 409 test; the dashboard gate uses `getAnyAgencyMembership`).
4. **Unknown `essay_type` values** (e.g. `why_us`, null) must render something readable, not a raw snake_case key or "null". Pinned in Task 4 (`essayTypeLabel` test).
5. **The glossary table missing or erroring** must not break or spam every page: return `{terms: []}` with 200 and log the error. Pinned in Task 5.

---

### Task 1: Invite links survive sign-up, and `next` can't redirect off-site (QA-23)

**Files:**
- Create: `src/lib/safe-next.ts`
- Test: `src/lib/__tests__/safe-next.test.ts`
- Modify: `src/app/login/page.tsx` (validate `next`; carry it to both "Sign up" links and Google)
- Modify: `src/app/signup/page.tsx` (use the helper; carry `next` to Google)
- Test: `src/app/login/__tests__/next-propagation.test.tsx`

**Interfaces:**
- Produces: `safeNextPath(raw: string | null | undefined): string | null`. Returns `raw` only if it starts with `/` and not `//` or `/\`; otherwise null.

- [ ] **Step 1: Failing helper test**

```ts
// src/lib/__tests__/safe-next.test.ts
import { describe, it, expect } from "vitest";
import { safeNextPath } from "../safe-next";

describe("safeNextPath", () => {
  it.each([["/join/abc"], ["/counselor/onboard"], ["/cc/dashboard?tab=1"]])("keeps %s", (p) =>
    expect(safeNextPath(p)).toBe(p));
  it.each([["//evil.com"], ["/\\evil.com"], ["https://evil.com"], ["javascript:alert(1)"], [""], [null], [undefined]])(
    "rejects %j", (p) => expect(safeNextPath(p)).toBeNull());
});
```

Run: `npx vitest run src/lib/__tests__/safe-next.test.ts`. Expected: FAIL (module missing).

- [ ] **Step 2: Implement**

```ts
// src/lib/safe-next.ts
// Post-auth redirect targets come from the query string. Allow same-origin
// paths only: "//host" and "/\host" are protocol-relative in browsers.
export function safeNextPath(raw: string | null | undefined): string | null {
  if (!raw || !raw.startsWith("/")) return null;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return null;
  return raw;
}
```

Run the test. Expected: PASS.

- [ ] **Step 3: Failing page test**

```tsx
// src/app/login/__tests__/next-propagation.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const h = vi.hoisted(() => ({ next: "/join/abc123", google: vi.fn() }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(h.next ? `next=${encodeURIComponent(h.next)}` : ""),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false, signInWithGoogle: h.google, signInWithEmail: vi.fn(), signUpWithEmail: vi.fn() }),
}));

import LoginPage from "../page";

describe("/login carries ?next= onward", () => {
  it("sends new users to sign-up with the invite path intact", () => {
    render(<LoginPage />);
    const signups = screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("/signup"));
    expect(signups.length).toBeGreaterThan(0);
    for (const a of signups.filter((a) => !a.getAttribute("href")!.includes("counselor"))) {
      expect(a.getAttribute("href")).toBe(`/signup?next=${encodeURIComponent("/join/abc123")}`);
    }
  });

  it("passes next to Google sign-in", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getAllByRole("button", { name: /google/i })[0]);
    expect(h.google).toHaveBeenCalledWith("/join/abc123");
  });

  it("drops an off-site next", () => {
    h.next = "//evil.com";
    render(<LoginPage />);
    const signup = screen.getAllByRole("link").find((a) => a.getAttribute("href")?.startsWith("/signup") && !a.getAttribute("href")!.includes("counselor"));
    expect(signup?.getAttribute("href")).toBe("/signup");
    h.next = "/join/abc123";
  });
});
```

Run: `npx vitest run src/app/login/__tests__/next-propagation.test.tsx`. Expected: FAIL (hrefs are bare `/signup`; Google is called with no argument).

- [ ] **Step 4: Implement on `/login`**

In `LoginForm`:

```tsx
import { safeNextPath } from "@/lib/safe-next";
// ...
  const explicitNext = safeNextPath(searchParams.get("next"));
  const next = explicitNext ?? "/";
  // Invite links (/join/<code>) send logged-out students here; a brand-new
  // student then clicks "Sign up", which must keep the invite.
  const signupHref = explicitNext ? `/signup?next=${encodeURIComponent(explicitNext)}` : "/signup";
```

Change both `<Link href="/signup" …>` to `href={signupHref}`, and the Google button's `onClick={() => void signInWithGoogle()}` to `onClick={() => void signInWithGoogle(explicitNext ?? undefined)}`. Leave the counselor links (`/login?next=%2Fcounselor%2Fonboard`, `/signup?next=%2Fcounselor%2Fonboard`) unchanged.

- [ ] **Step 5: Implement on `/signup`**

Replace the inline guard:

```tsx
import { safeNextPath } from "@/lib/safe-next";
// ...
  const next = safeNextPath(searchParams.get("next"));
```

Change the Google button to `onClick={() => void signInWithGoogle(next ?? undefined)}`.

- [ ] **Step 6: Run the tests.** `npx vitest run src/lib/__tests__/safe-next.test.ts src/app/login/__tests__/next-propagation.test.tsx`. Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/safe-next.ts src/lib/__tests__/safe-next.test.ts src/app/login/page.tsx src/app/signup/page.tsx src/app/login/__tests__/next-propagation.test.tsx
git commit -m "fix(auth): invite links survive sign-up; login next is same-origin only (QA-23)"
```

### Task 2: Students see who their counselor is (QA-05)

**Files:**
- Create: `src/app/api/cc/my-counselor/route.ts`
- Test: `src/app/api/cc/__tests__/my-counselor.test.ts`
- Modify: `src/app/join/[code]/page.tsx` (success names the counselor; Continue button)
- Test: `src/app/join/__tests__/join-page.test.tsx`
- Create: `src/components/cc/MyCounselorChip.tsx`
- Modify: `src/app/cc/dashboard/page.tsx` (render the chip above both dashboard variants)

**Interfaces:**
- Consumes: `requireAuth`, `createAdminSupabase` from `src/app/api/cc/helpers`. Production columns (probed 2026-09-25): `cc_student_counselor_links(agency_id, student_user_id, primary_counselor_user_id, status, linked_at)`, `cc_agencies(id, name)`, `cc_counselors(user_id, display_name)`.
- Produces: `GET /api/cc/my-counselor` → `{ counselor: { displayName: string; agencyName: string | null; linkedAt: string } | null }`.

- [ ] **Step 1: Failing route test**

```ts
// src/app/api/cc/__tests__/my-counselor.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { GET } from "../my-counselor/route";

const STUDENT = "a11ce000-0000-4000-8000-000000000001";
const h = vi.hoisted(() => ({ world: null as unknown, user: "a11ce000-0000-4000-8000-000000000001" as string | null }));
vi.mock("../helpers", () => ({
  requireAuth: async () => (h.user ? { user: { id: h.user }, supabase: {} } : null),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));

const link = (over: Record<string, unknown> = {}) => ({
  id: "l1", agency_id: "ag1", student_user_id: STUDENT, primary_counselor_user_id: "c-user",
  status: "active", linked_at: "2026-09-20T00:00:00Z", ...over,
});

beforeEach(() => {
  h.user = STUDENT;
  h.world = createFakeSupabase({
    cc_student_counselor_links: [link()],
    cc_agencies: [{ id: "ag1", name: "Ad Astra Counseling" }],
    cc_counselors: [{ user_id: "c-user", display_name: "Ms. Rivera" }],
  });
});

describe("GET /api/cc/my-counselor", () => {
  it("names the student's counselor and agency", async () => {
    const json = await (await GET()).json();
    expect(json.counselor).toEqual({ displayName: "Ms. Rivera", agencyName: "Ad Astra Counseling", linkedAt: "2026-09-20T00:00:00Z" });
  });

  it("falls back to the agency name when there is no primary counselor", async () => {
    h.world = createFakeSupabase({
      cc_student_counselor_links: [link({ primary_counselor_user_id: null })],
      cc_agencies: [{ id: "ag1", name: "Ad Astra Counseling" }],
      cc_counselors: [],
    });
    const json = await (await GET()).json();
    expect(json.counselor.displayName).toBe("Ad Astra Counseling");
  });

  it("returns null for an unlinked or ended link", async () => {
    h.world = createFakeSupabase({ cc_student_counselor_links: [link({ status: "ended" })], cc_agencies: [], cc_counselors: [] });
    expect((await (await GET()).json()).counselor).toBeNull();
  });

  it("401s when signed out", async () => {
    h.user = null;
    expect((await GET()).status).toBe(401);
  });
});
```

Run: `npx vitest run src/app/api/cc/__tests__/my-counselor.test.ts`. Expected: FAIL (module missing).

- [ ] **Step 2: Implement the route**

```ts
// src/app/api/cc/my-counselor/route.ts
import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";

// The signed-in student's active counselor link, named for display (QA-05:
// students used to join an agency and never learn who they were linked to).
export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();

  const { data: link } = await db
    .from("cc_student_counselor_links")
    .select("agency_id, primary_counselor_user_id, linked_at")
    .eq("student_user_id", auth.user.id)
    .eq("status", "active")
    .order("linked_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!link) return NextResponse.json({ counselor: null });

  let counselorName: string | null = null;
  if (link.primary_counselor_user_id) {
    const { data: c } = await db
      .from("cc_counselors")
      .select("display_name")
      .eq("user_id", link.primary_counselor_user_id)
      .maybeSingle();
    counselorName = c?.display_name ?? null;
  }
  const { data: agency } = await db.from("cc_agencies").select("name").eq("id", link.agency_id).maybeSingle();

  return NextResponse.json({
    counselor: {
      displayName: counselorName ?? agency?.name ?? "Your counselor",
      agencyName: agency?.name ?? null,
      linkedAt: link.linked_at,
    },
  });
}
```

Run the test. Expected: PASS (4/4).

- [ ] **Step 3: Failing join-page test**

```tsx
// src/app/join/__tests__/join-page.test.tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const h = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useParams: () => ({ code: "ABC123" }), useRouter: () => ({ push: h.push }) }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1" }, loading: false }) }));

import JoinPage from "../[code]/page";

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s });
afterEach(() => vi.unstubAllGlobals());

describe("/join/[code]", () => {
  it("names the counselor after joining and waits for Continue", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) =>
      url === "/api/counselor/join" ? json({ ok: true }, 201)
        : json({ counselor: { displayName: "Ms. Rivera", agencyName: "Ad Astra Counseling", linkedAt: "x" } })));
    render(<JoinPage />);
    expect(await screen.findByText(/linked to Ms\. Rivera/i)).toBeTruthy();
    expect(h.push).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(h.push).toHaveBeenCalledWith("/cc/dashboard");
  });
});
```

Run: `npx vitest run src/app/join/__tests__/join-page.test.tsx`. Expected: FAIL (no counselor name; auto-redirects).

- [ ] **Step 4: Implement the join success state**

In `src/app/join/[code]/page.tsx`: change the state union's success member to `{ kind: "success"; counselorName: string | null; agencyName: string | null }`. On a 2xx join, fetch the counselor instead of setting a timeout:

```tsx
        if (resp.ok) {
          const me = await fetch("/api/cc/my-counselor").then((r) => (r.ok ? r.json() : null)).catch(() => null);
          setState({
            kind: "success",
            counselorName: me?.counselor?.displayName ?? null,
            agencyName: me?.counselor?.agencyName ?? null,
          });
        } else {
```

Replace the success paragraph with:

```tsx
        {state.kind === "success" && (
          <div>
            <p className="text-white font-semibold mb-1">
              You&apos;re linked to {state.counselorName ?? "your counselor"}
              {state.agencyName && state.agencyName !== state.counselorName ? ` at ${state.agencyName}` : ""}.
            </p>
            <p className="text-sm text-white/60 mb-4">
              They can now see your essays, school list and progress, and their feedback shows up inside Essay Studio.
            </p>
            <button
              onClick={() => router.push("/cc/dashboard")}
              className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#C4A030]"
            >
              Continue
            </button>
          </div>
        )}
```

Also change the card wrapper `bg-white/5` to `bg-[#141414]` (DESIGN.md) and "Linking you to the agency…" to "Linking you to your counselor…". Run the test. Expected: PASS.

- [ ] **Step 5: Dashboard chip**

```tsx
// src/components/cc/MyCounselorChip.tsx
"use client";

import { useEffect, useState } from "react";

type Counselor = { displayName: string; agencyName: string | null };

// Shows linked students who their counselor is (QA-05). Renders nothing for
// unlinked students or when the lookup fails.
export default function MyCounselorChip() {
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  useEffect(() => {
    fetch("/api/cc/my-counselor")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setCounselor(d?.counselor ?? null))
      .catch(() => {});
  }, []);
  if (!counselor) return null;
  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <p className="text-xs text-white/50">
        Your counselor: <span className="text-[#D4AF37] font-medium">{counselor.displayName}</span>
        {counselor.agencyName && counselor.agencyName !== counselor.displayName ? ` · ${counselor.agencyName}` : ""}
      </p>
    </div>
  );
}
```

In `src/app/cc/dashboard/page.tsx`, import it and wrap both returns: `return <><MyCounselorChip /><AdaptiveDashboardClientSwitch /></>;` and `return <><MyCounselorChip /><AdaptiveDashboardLegacy … /></>;`.

- [ ] **Step 6: Run the tests and tsc.** `npx vitest run src/app/api/cc/__tests__/my-counselor.test.ts src/app/join/__tests__/join-page.test.tsx && npx tsc --noEmit -p .`. Expected: PASS, tsc 0.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/cc/my-counselor/route.ts src/app/api/cc/__tests__/my-counselor.test.ts "src/app/join/[code]/page.tsx" src/app/join/__tests__/join-page.test.tsx src/components/cc/MyCounselorChip.tsx src/app/cc/dashboard/page.tsx
git commit -m "feat(counselor): students see who they joined, on the join page and dashboard (QA-05)"
```

### Task 3: Solo counselors can create a workspace (QA-04)

**Files:**
- Create: `src/lib/cc/agency-slug.ts`; Test: `src/lib/cc/__tests__/agency-slug.test.ts`
- Create: `src/components/counselor/CreateWorkspaceCard.tsx`; Test: `src/components/counselor/__tests__/CreateWorkspaceCard.test.tsx`
- Modify: `src/app/counselor/dashboard/page.tsx` (render the card when `getAnyAgencyMembership(user.id)` is null)

**Interfaces:**
- Consumes: `POST /api/counselor/agency` `{ name, slug, displayName }` → 201 `{ agencyId, agencySlug }` | 400 | 409 `{ error }`. Slug rule: `^[a-z0-9-]{3,40}$`. `getAnyAgencyMembership(userId): Promise<AgencyMembership | null>` from `src/lib/cc/agency-membership.ts`.
- Produces: `slugifyAgencyName(name: string): string`.

- [ ] **Step 1: Failing slug test**

```ts
// src/lib/cc/__tests__/agency-slug.test.ts
import { describe, it, expect } from "vitest";
import { slugifyAgencyName } from "../agency-slug";

describe("slugifyAgencyName", () => {
  it("kebab-cases and strips punctuation", () =>
    expect(slugifyAgencyName("Ad Astra Counseling, LLC")).toBe("ad-astra-counseling-llc"));
  it("strips accents", () => expect(slugifyAgencyName("Académie Rivière")).toBe("academie-riviere"));
  it("caps at 40 chars with no trailing hyphen", () => {
    expect(slugifyAgencyName("x".repeat(60))).toHaveLength(40);
    expect(slugifyAgencyName("ab ".repeat(30)).endsWith("-")).toBe(false);
  });
  it("always satisfies the API's slug rule or is too short to submit", () => {
    for (const n of ["Ad Astra", "  --  ", "مركز", "A1"]) {
      const s = slugifyAgencyName(n);
      expect(s === "" || /^[a-z0-9-]+$/.test(s)).toBe(true);
    }
  });
});
```

Run: `npx vitest run src/lib/cc/__tests__/agency-slug.test.ts`. Expected: FAIL (module missing).

- [ ] **Step 2: Implement**

```ts
// src/lib/cc/agency-slug.ts
// Workspace name → the slug POST /api/counselor/agency requires (^[a-z0-9-]{3,40}$).
export function slugifyAgencyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}
```

Run the test. Expected: PASS.

- [ ] **Step 3: Failing card test**

```tsx
// src/components/counselor/__tests__/CreateWorkspaceCard.test.tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateWorkspaceCard from "../CreateWorkspaceCard";

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s });
afterEach(() => vi.unstubAllGlobals());

describe("CreateWorkspaceCard", () => {
  it("posts name, slug and display name", async () => {
    const fetchMock = vi.fn(async () => json({ agencyId: "a", agencySlug: "rivera-college-counseling" }, 201));
    vi.stubGlobal("fetch", fetchMock);
    const assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign });
    render(<CreateWorkspaceCard displayName="Ms. Rivera" />);
    fireEvent.change(screen.getByPlaceholderText(/workspace name/i), { target: { value: "Rivera College Counseling" } });
    fireEvent.click(screen.getByRole("button", { name: /create workspace/i }));
    await vi.waitFor(() => expect(assign).toHaveBeenCalledWith("/counselor/team"));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      name: "Rivera College Counseling", slug: "rivera-college-counseling", displayName: "Ms. Rivera",
    });
  });

  it("shows the server's message when the name is taken", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ error: "slug taken" }, 409)));
    render(<CreateWorkspaceCard displayName="Ms. Rivera" />);
    fireEvent.change(screen.getByPlaceholderText(/workspace name/i), { target: { value: "Ad Astra" } });
    fireEvent.click(screen.getByRole("button", { name: /create workspace/i }));
    expect(await screen.findByText(/already taken/i)).toBeTruthy();
  });
});
```

Run: `npx vitest run src/components/counselor/__tests__/CreateWorkspaceCard.test.tsx`. Expected: FAIL (module missing).

- [ ] **Step 4: Implement the card**

```tsx
// src/components/counselor/CreateWorkspaceCard.tsx
"use client";

import { useState } from "react";
import { slugifyAgencyName } from "@/lib/cc/agency-slug";

// QA-04: counselors without an agency had no way to create one, and invite
// codes, the roster and essay review all hang off an agency.
export default function CreateWorkspaceCard({ displayName }: { displayName: string }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slug = slugifyAgencyName(name);

  async function create() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/counselor/agency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), slug, displayName }),
    }).catch(() => null);
    if (res?.ok) {
      window.location.assign("/counselor/team");
      return;
    }
    setError(
      res?.status === 409
        ? "That workspace name is already taken. Try adding your city or last name."
        : "Couldn't create the workspace. Please try again.",
    );
    setBusy(false);
  }

  return (
    <div className="mb-6 rounded-2xl border border-[#D4AF37]/30 bg-[#141414] p-6">
      <p className="text-[10px] uppercase tracking-[0.1em] text-[#D4AF37] mb-2">Workspace</p>
      <h2 className="text-white font-semibold mb-1">Set up your student workspace</h2>
      <p className="text-sm text-white/60 mb-4">
        A workspace lets you invite students with a code, see your roster, and review essays. Working solo? Use your own name.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name, e.g. Rivera College Counseling"
          className="flex-1 rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder:text-white/30"
        />
        <button
          onClick={create}
          disabled={busy || slug.length < 3}
          className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#C4A030] disabled:opacity-40"
        >
          {busy ? "Creating…" : "Create workspace"}
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-[#fbbf24]">{error}</p>}
    </div>
  );
}
```

Run the test. Expected: PASS.

- [ ] **Step 5: Render it on the counselor dashboard**

In `src/app/counselor/dashboard/page.tsx` (server component), after `const counselor = await getCounselorForUser(user.id); if (!counselor) redirect(...)`:

```tsx
import { getAnyAgencyMembership } from "@/lib/cc/agency-membership";
import CreateWorkspaceCard from "@/components/counselor/CreateWorkspaceCard";
// ...
  const membership = await getAnyAgencyMembership(user.id);
```

Render `{!membership && <CreateWorkspaceCard displayName={counselor.display_name} />}` directly under the header row, before the engagements content.

- [ ] **Step 6: Run the tests and tsc.** `npx vitest run src/lib/cc/__tests__/agency-slug.test.ts src/components/counselor/__tests__/CreateWorkspaceCard.test.tsx && npx tsc --noEmit -p .`. Expected: PASS, tsc 0.

- [ ] **Step 7: Commit**

```bash
git add src/lib/cc/agency-slug.ts src/lib/cc/__tests__/agency-slug.test.ts src/components/counselor/CreateWorkspaceCard.tsx src/components/counselor/__tests__/CreateWorkspaceCard.test.tsx src/app/counselor/dashboard/page.tsx
git commit -m "feat(counselor): create-workspace card for counselors without an agency (QA-04)"
```

### Task 4: Brand and essay-type copy (QA-09)

**Files:**
- Modify: `src/lib/cc/essay-helpers.ts` (add `essayTypeLabel`)
- Test: `src/lib/cc/__tests__/essay-type-label.test.ts`
- Modify: `src/app/counselor/students/[studentId]/page.tsx:235,262`
- Modify: `src/app/counselor/team/page.tsx:269`

**Interfaces:**
- Produces: `essayTypeLabel(type: string | null | undefined): string`.

- [ ] **Step 1: Failing test**

```ts
// src/lib/cc/__tests__/essay-type-label.test.ts
import { describe, it, expect } from "vitest";
import { essayTypeLabel } from "../essay-helpers";

describe("essayTypeLabel", () => {
  it.each([
    ["personal_statement", "Personal Statement"],
    ["supplemental", "School Supplemental"],
    ["scholarship", "Scholarship Essay"],
    ["why_us", "Why Us"],
    [null, "Essay"],
    ["", "Essay"],
  ])("%j → %s", (t, label) => expect(essayTypeLabel(t)).toBe(label));
});
```

Run: `npx vitest run src/lib/cc/__tests__/essay-type-label.test.ts`. Expected: FAIL (not exported).

- [ ] **Step 2: Implement** (append to `src/lib/cc/essay-helpers.ts`)

```ts
const ESSAY_TYPE_LABELS: Record<string, string> = {
  personal_statement: "Personal Statement",
  supplemental: "School Supplemental",
  scholarship: "Scholarship Essay",
};

// Counselor screens showed raw keys like "personal_statement".
export function essayTypeLabel(type: string | null | undefined): string {
  if (!type) return "Essay";
  return ESSAY_TYPE_LABELS[type] ?? type.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
```

Run the test. Expected: PASS.

- [ ] **Step 3: Use it.** In `src/app/counselor/students/[studentId]/page.tsx`, import `essayTypeLabel` from `@/lib/cc/essay-helpers` and replace `{e.essayType || "Essay"}` with `{essayTypeLabel(e.essayType)}`, and `{detail.essayType || "Essay"}` with `{essayTypeLabel(detail.essayType)}`. In `src/app/counselor/team/page.tsx:269`, replace "Samsara account" with "KairosLearn account". Check that `essay-helpers.ts` has no server-only imports that break a client page: `grep -n "^import" src/lib/cc/essay-helpers.ts`. If it imports server modules, put `essayTypeLabel` in a new `src/lib/cc/essay-type-label.ts`, point the test there, and ledger the ruling.

- [ ] **Step 4: Run the tests and tsc.** `npx vitest run src/lib/cc/__tests__/essay-type-label.test.ts && npx tsc --noEmit -p . && grep -rn "Samsara" src/app/counselor || echo "no Samsara"`. Expected: PASS, tsc 0, "no Samsara".

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/essay-helpers.ts src/lib/cc/__tests__/essay-type-label.test.ts "src/app/counselor/students/[studentId]/page.tsx" src/app/counselor/team/page.tsx
git commit -m "fix(counselor): readable essay types and KairosLearn copy (QA-09)"
```

### Task 5: Glossary works for guests and degrades when missing (QA-06)

**Files:**
- Modify: `src/middleware.ts` (add `/api/cc/glossary` to `PUBLIC_PREFIXES`; export `isPublicRoute`)
- Modify: `src/app/api/cc/glossary/route.ts` (error → 200 `{terms: []}` + log)
- Test: `src/app/api/cc/__tests__/glossary.test.ts`

**Interfaces:**
- Produces: `export function isPublicRoute(pathname: string): boolean` (same body, now exported).

- [ ] **Step 1: Failing test**

```ts
// src/app/api/cc/__tests__/glossary.test.ts
import { describe, it, expect, vi } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { isPublicRoute } from "@/middleware";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("../helpers", () => ({ createAdminSupabase: () => h.world }));
import { GET } from "../glossary/route";

describe("glossary", () => {
  it("is reachable by guests (GlossaryProvider mounts on public pages)", () => {
    expect(isPublicRoute("/api/cc/glossary")).toBe(true);
  });

  it("returns an empty list, not a 500, when the table errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    h.world = createFakeSupabase({ cc_glossary: [] }, { columns: { cc_glossary: ["id"] } });
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ terms: [] });
  });
});
```

Run: `npx vitest run src/app/api/cc/__tests__/glossary.test.ts`. Expected: FAIL (`isPublicRoute` not exported; route returns 500).

- [ ] **Step 2: Implement.** In `src/middleware.ts`, add `"/api/cc/glossary",` to `PUBLIC_PREFIXES` (with the comment `// read-only term definitions; GlossaryProvider mounts for guests too`) and change `function isPublicRoute` to `export function isPublicRoute`. In the glossary route, replace the error branch:

```ts
  if (error) {
    // Decorative and fetched on every page mount: a schema or seed problem
    // must not 500 for every visitor. Log it and serve nothing.
    console.error("[glossary] fetch failed:", error.message);
    return NextResponse.json({ terms: [] });
  }
```

Run the test. Expected: PASS. If importing `@/middleware` fails in jsdom, move `PUBLIC_ROUTES`, `PUBLIC_PREFIXES` and `isPublicRoute` into `src/lib/public-routes.ts`, import them in middleware, test that module, and ledger the ruling.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts src/app/api/cc/glossary/route.ts src/app/api/cc/__tests__/glossary.test.ts
git commit -m "fix(glossary): public for guests; degrade to empty instead of 500 (QA-06)"
```

Production `cc_glossary` has 0 rows. Seeding it is a production write, so leave it for the founder and record it in `claude-progress.md`.

### Task 6: Essay Studio at phone width (QA-07)

**Files:**
- Modify: `src/app/tokens.css` (mobile rules for `.kl-bs-subhead`, `.kl-phase-bar`, and a new `.kl-studio-grid`)
- Modify: `src/app/cc/essays/[id]/page.tsx:379`, `src/components/cc/essay/BrainstormChat.tsx:728`, `src/components/cc/essay/DraftEditor.tsx:415`, `src/components/cc/essay/OutlinePicker.tsx:311` (add `kl-studio-grid` to each fixed-column grid)
- Test: `src/components/cc/essay/__tests__/studio-grid-contract.test.ts`

jsdom does no layout, so the real RED/GREEN is a browser measurement at 375×812 (Steps 1 and 5). The static test only makes sure no work grid is left without the responsive class.

- [ ] **Step 1: RED in the browser.** With the dev server running and signed in as QA student qa-s1, `$B viewport 375x812`, open `/cc/essays/86c5d33e-af71-4b3c-8cd1-a54735830ccd` (revise phase) and measure:

```js
(() => {
  const t = [...document.querySelectorAll("em")].find((e) => /Holistic read/.test(e.textContent));
  const box = t.closest("div").getBoundingClientRect();
  const over = [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).length;
  return JSON.stringify({ textWidth: Math.round(box.width), overflowing: over });
})()
```

Expected (current bug): `textWidth` < 120, and `overflowing` > 0 (the 400px side column).

- [ ] **Step 2: Failing static test**

```ts
// src/components/cc/essay/__tests__/studio-grid-contract.test.ts
// Every fixed-column Essay Studio grid must carry kl-studio-grid, which
// collapses it to one column below 1024px (QA-07).
import { describe, it, expect } from "vitest";
import fs from "node:fs";

const FILES = [
  "src/app/cc/essays/[id]/page.tsx",
  "src/components/cc/essay/BrainstormChat.tsx",
  "src/components/cc/essay/DraftEditor.tsx",
  "src/components/cc/essay/OutlinePicker.tsx",
];

describe("Essay Studio grids are responsive", () => {
  it.each(FILES)("%s", (file) => {
    const src = fs.readFileSync(file, "utf8");
    const grids = [...src.matchAll(/<div[^>]*gridTemplateColumns[^>]*>/g)].map((m) => m[0]);
    expect(grids.length).toBeGreaterThan(0);
    for (const g of grids) expect(g).toContain("kl-studio-grid");
  });

  it("tokens.css defines the mobile rules", () => {
    const css = fs.readFileSync("src/app/tokens.css", "utf8");
    expect(css).toMatch(/@media \(max-width: 1023px\)[\s\S]*\.kl-studio-grid/);
    expect(css).toMatch(/@media \(max-width: 640px\)[\s\S]*\.kl-bs-subhead/);
  });
});
```

Run: `npx vitest run src/components/cc/essay/__tests__/studio-grid-contract.test.ts`. Expected: FAIL. If a grid's JSX spans lines so the regex can't match it, put the `className` and `style` on one line.

- [ ] **Step 3: Implement.** Add `kl-studio-grid` to the `className` of the four grid `<div>`s (keep their inline `gridTemplateColumns`). Append to `src/app/tokens.css`:

```css
/* Essay Studio at phone/tablet width (QA-07). The work grids use fixed side
   columns (380-400px) and the phase subhead is a no-wrap row, which crushed
   the text into a one-word column at 375px. !important beats the inline
   gridTemplateColumns. */
@media (max-width: 1023px) {
  .kl-studio-grid { grid-template-columns: minmax(0, 1fr) !important; }
}
@media (max-width: 640px) {
  .kl-bs-subhead { flex-direction: column; align-items: stretch; padding: 14px 16px; gap: 12px; }
  .kl-phase-bar { overflow-x: auto; }
  .kl-phase-bar > * { min-width: 96px; }
}
```

Also on the essay page's outer wrapper (`style={{ padding: "22px 28px", … }}`), add `className="kl-surface-app w-full kl-studio-shell"` and the rule `.kl-studio-shell { padding: 16px !important; }` inside the 640px block.

- [ ] **Step 4: Run it.** `npx vitest run src/components/cc/essay/__tests__/studio-grid-contract.test.ts`. Expected: PASS.

- [ ] **Step 5: GREEN in the browser.** Re-run Step 1's measurement on the revise essay, then take screenshots at 375×812 of Brainstorm (a qa-s1 brainstorm-phase essay, or `/cc/essays/new`), Draft, and Revise. Expected: `textWidth` ≥ 280, `overflowing` = 0, and no one-word-per-line columns or overlapping controls. Check that desktop (1440×900) still shows the side-by-side layout.

- [ ] **Step 6: Commit**

```bash
git add src/app/tokens.css "src/app/cc/essays/[id]/page.tsx" src/components/cc/essay/BrainstormChat.tsx src/components/cc/essay/DraftEditor.tsx src/components/cc/essay/OutlinePicker.tsx src/components/cc/essay/__tests__/studio-grid-contract.test.ts
git commit -m "fix(essays): Essay Studio stacks at phone width instead of crushing text (QA-07)"
```

### Task 7: Whole-plan verification

- [ ] `npx vitest run src > <workspace>/suite.log 2>&1` → all pass (baseline 482 + this plan's tests).
- [ ] `npx tsc --noEmit -p .` → 0. `npm run build` → 0 (stop the dev server first; `.next/lock`).
- [ ] Live local run (dev server → prod DB, QA accounts only):
  - As qa-c1 (a head), mint an invite code at `/counselor/team`.
  - Sign out. Open `/join/<code>` → `/login?next=…` → click "Sign up" and check the URL keeps `next`. Don't create a new account unless it uses a plus-address on the founder's Gmail. Signing in as qa-s2 and opening `/join/<code>` is enough to see the "linked to …" card and the dashboard chip.
  - As a signed-out guest, `/api/cc/glossary` returns 200.
- [ ] Update `docs/handoff/claude-progress.md` item 3 with the results.
