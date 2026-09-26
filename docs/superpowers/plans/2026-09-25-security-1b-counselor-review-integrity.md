# Security 1B: Counselor Review Integrity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make counselor feedback safe and correct before real agency students arrive. Comments can only land on the named student's own essays, one agency never sees another agency's comments, supervised counselors can't bypass head approval, heads can actually publish supervised drafts, and invite codes can only be preassigned to the agency's own counselors.

**Architecture:** The ownership check moves into `src/lib/cc/counselor-comments.ts` (`essayBelongsToStudent`, `EssayNotOwnedError`), so every caller is covered. Comment reads take an optional `agencyId`: counselor callers pass their agency, and the student's own view stays unfiltered. Route handlers map the new error to 404 and enforce `requiresReview` on review-state changes. Tests use the in-memory fake Supabase from Plan 1A.

**Tech Stack:** Next.js 16 route handlers and client components, `@supabase/supabase-js` 2.99, vitest 3.

**Spec:** `docs/design/2026-09-live-audit.md` QA-18 (comment essay binding), QA-19 (agency-scoped reads), QA-20 (supervised review bypass and missing publish control), and `work-diary/agency-source-independent-review.md` gap 6 (invite preassignment).

**Depends on:** Plan 1A Task 1 (`src/lib/cc/ownership.ts`, `src/lib/cc/__tests__/helpers/*`).

## Global Constraints

- **Never run `npm run test:unit`**, which runs DB fixtures against production. Use `npx vitest run src`.
- Essay ownership bridges auth uid → `cc_student_profiles.id` → `cc_essays.student_id`.
- Comments live in `cc_counselor_comments` with `artifact_type = 'essay'`, `artifact_id = cc_essays.id::text`, plus an `agency_id` column.
- A student sees **shipped** comments from any agency on their own essay. A counselor sees only **their own agency's** comments.
- Supervised means `cc_agency_members.requires_review = true`. A supervised counselor's comments become drafts that a head publishes (existing behavior). This plan also stops them from setting review state.
- App-surface UI tokens from `DESIGN.md`: gold `#D4AF37`, `#141414` cards, rounded controls.
- Explicit `git add` paths only. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`. No deploy, no migration.

## Review Focus

1. A student is linked to two agencies, and agency B has draft comments on the essay. Agency A's counselor never sees them in the essay view or in the list counts (tests in Tasks 1 and 2).
2. A comment is posted with a non-UUID `essayId` (`"undefined"`). Expect 404, with no row and no 500 (test in Task 1).
3. A supervised counselor sends `action: "review"`. Expect 403, with the essay state unchanged (test in Task 2).
4. A head preassigns a code to a user outside their agency. Expect 400, and nothing is minted (test in Task 4).
5. A head publishes a draft. The student's view then includes it (test in Task 1: `onlyShipped` returns it after `setCommentStatus`).

---

### Task 1: Bind comments to the student and scope reads to the agency

**Files:**
- Modify: `src/lib/cc/counselor-comments.ts`
- Test: `src/lib/cc/__tests__/counselor-comments.test.ts`

**Interfaces:**
- Consumes: `isUuid` from `src/lib/cc/ownership.ts` (Plan 1A); `createFakeSupabase` and the fixtures from Plan 1A.
- Produces:
  - `class EssayNotOwnedError extends Error`
  - `essayBelongsToStudent(studentUserId: string, essayId: string): Promise<boolean>`
  - `getEssayForReview(studentUserId, essayId, opts?: { onlyShipped?: boolean; agencyId?: string })`
  - `listStudentEssays(studentUserId, opts?: { agencyId?: string })`
  - `addEssayComment(input)` now **throws `EssayNotOwnedError`** when the essay isn't the student's

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/cc/__tests__/counselor-comments.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "./helpers/fake-supabase";
import { ALICE, ALICE_ESSAY, ALICE_PROFILE, BOB, BOB_ESSAY, BOB_PROFILE } from "./helpers/fixtures";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));

import {
  addEssayComment,
  EssayNotOwnedError,
  getEssayForReview,
  listStudentEssays,
  setCommentStatus,
} from "../counselor-comments";

const AGENCY_A = "a9e0c700-0000-4000-8000-00000000000a";
const AGENCY_B = "a9e0c700-0000-4000-8000-00000000000b";
const COUNSELOR = "c0c00000-0000-4000-8000-000000000001";

function comment(id: string, agency: string, status: string) {
  return {
    id, agency_id: agency, student_user_id: ALICE, author_user_id: COUNSELOR,
    artifact_type: "essay", artifact_id: ALICE_ESSAY, body: `note ${id}`,
    range_start: null, range_end: null, range_text_snapshot: null,
    status, created_at: "2026-09-25T10:00:00Z", resolved_at: null,
  };
}

const world = () => h.world as FakeSupabase;

beforeEach(() => {
  h.world = createFakeSupabase({
    cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE }, { id: BOB_PROFILE, user_id: BOB }],
    cc_essays: [
      { id: ALICE_ESSAY, student_id: ALICE_PROFILE, essay_type: "personal_statement", prompt_text: "p", word_limit: 650, current_draft: "d", word_count: 1, phase: "draft", updated_at: "2026-09-25", counselor_review_state: null, counselor_review_updated_at: null },
      { id: BOB_ESSAY, student_id: BOB_PROFILE, essay_type: "personal_statement", prompt_text: "p", word_limit: 650, current_draft: "d", word_count: 1, phase: "draft", updated_at: "2026-09-25", counselor_review_state: null, counselor_review_updated_at: null },
    ],
    cc_counselor_comments: [
      comment("c1", AGENCY_A, "shipped"),
      comment("c2", AGENCY_B, "draft"),
      comment("c3", AGENCY_B, "shipped"),
    ],
  });
});

describe("addEssayComment", () => {
  const base = { agencyId: AGENCY_A, studentUserId: ALICE, authorUserId: COUNSELOR, body: "Tighten the opening." };

  it("refuses an essay that belongs to a different student", async () => {
    await expect(addEssayComment({ ...base, essayId: BOB_ESSAY })).rejects.toBeInstanceOf(EssayNotOwnedError);
    expect(world().tables.cc_counselor_comments).toHaveLength(3);
  });

  it("refuses a non-uuid essay id without touching the database", async () => {
    await expect(addEssayComment({ ...base, essayId: "undefined" })).rejects.toBeInstanceOf(EssayNotOwnedError);
    expect(world().tables.cc_counselor_comments).toHaveLength(3);
  });

  it("inserts a comment on the student's own essay", async () => {
    const id = await addEssayComment({ ...base, essayId: ALICE_ESSAY });
    expect(typeof id).toBe("string");
    expect(world().tables.cc_counselor_comments).toHaveLength(4);
  });
});

describe("getEssayForReview", () => {
  it("shows a counselor only their own agency's comments", async () => {
    const essay = await getEssayForReview(ALICE, ALICE_ESSAY, { agencyId: AGENCY_A });
    expect(essay!.comments.map((c) => c.id)).toEqual(["c1"]);
  });

  it("shows the student shipped comments from every agency", async () => {
    const essay = await getEssayForReview(ALICE, ALICE_ESSAY, { onlyShipped: true });
    expect(essay!.comments.map((c) => c.id).sort()).toEqual(["c1", "c3"]);
  });

  it("shows the student a supervised draft once a head publishes it", async () => {
    await setCommentStatus("c2", "shipped");
    const essay = await getEssayForReview(ALICE, ALICE_ESSAY, { onlyShipped: true });
    expect(essay!.comments.map((c) => c.id).sort()).toEqual(["c1", "c2", "c3"]);
  });
});

describe("listStudentEssays", () => {
  it("counts only the viewing agency's comments", async () => {
    const [essay] = await listStudentEssays(ALICE, { agencyId: AGENCY_A });
    expect(essay.shippedCommentCount).toBe(1);
    expect(essay.openCommentCount).toBe(1);
  });
});
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `npx vitest run src/lib/cc/__tests__/counselor-comments.test.ts`
Expected: FAIL. `EssayNotOwnedError` isn't exported (import error), and the agency-scoped assertions would see comments from both agencies.

- [ ] **Step 3: Implement it in `src/lib/cc/counselor-comments.ts`**

Add, below the existing `import { createAdminSupabase } …` line:

```ts
import { isUuid } from "./ownership";

// Thrown when a comment targets an essay that isn't the named student's.
// Callers map it to 404 so essay ids from other students can't be probed.
export class EssayNotOwnedError extends Error {
  constructor() {
    super("essay does not belong to this student");
    this.name = "EssayNotOwnedError";
  }
}
```

In `profileIdForUser`, add `.limit(1)` between `.eq("user_id", studentUserId)` and `.maybeSingle<{ id: string }>()` (`cc_student_profiles` has no unique `user_id`).

Change the `listStudentEssays` signature and its comment query:

```ts
export async function listStudentEssays(
  studentUserId: string,
  opts: { agencyId?: string } = {},
): Promise<EssaySummary[]> {
```

```ts
  // Comment counts per essay (one query, grouped client-side). Counselor
  // callers pass their agency so another agency's feedback never counts.
  const essayIds = rows.map((e) => e.id as string);
  let commentQuery = db
    .from("cc_counselor_comments")
    .select("artifact_id, status")
    .eq("artifact_type", "essay")
    .in("artifact_id", essayIds);
  if (opts.agencyId) commentQuery = commentQuery.eq("agency_id", opts.agencyId);
  const { data: comments } = await commentQuery;
```

Change `getEssayForReview`'s options and add the agency filter after the existing `onlyShipped` line:

```ts
  opts: { onlyShipped?: boolean; agencyId?: string } = {},
```

```ts
  if (opts.onlyShipped) q = q.eq("status", "shipped");
  if (opts.agencyId) q = q.eq("agency_id", opts.agencyId);
```

Add the ownership check above `addEssayComment`, and call it first inside it:

```ts
// True only when essayId is one of this student's essays.
export async function essayBelongsToStudent(
  studentUserId: string,
  essayId: string,
): Promise<boolean> {
  if (!isUuid(essayId)) return false;
  const profileId = await profileIdForUser(studentUserId);
  if (!profileId) return false;
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_essays")
    .select("id")
    .eq("id", essayId)
    .eq("student_id", profileId)
    .maybeSingle<{ id: string }>();
  return Boolean(data);
}

export async function addEssayComment(input: AddCommentInput): Promise<string> {
  if (!(await essayBelongsToStudent(input.studentUserId, input.essayId))) {
    throw new EssayNotOwnedError();
  }
  const db = createAdminSupabase();
```

(The rest of `addEssayComment` stays as it is.)

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run src/lib/cc/__tests__/counselor-comments.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/counselor-comments.ts src/lib/cc/__tests__/counselor-comments.test.ts
git commit -m "fix(security): counselor comments bind to the student's essay and scope reads to the agency

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 2: Wire the routes; block supervised review decisions

**Files:**
- Modify: `src/app/api/counselor/students/[studentId]/essays/[essayId]/route.ts`
- Modify: `src/app/api/counselor/students/[studentId]/route.ts`
- Test: `src/app/api/counselor/__tests__/essay-review-route.test.ts`

**Interfaces:**
- Consumes: `EssayNotOwnedError`, and `getEssayForReview` and `listStudentEssays` with `{ agencyId }`, from Task 1.

- [ ] **Step 1: Write the failing tests**

```ts
// src/app/api/counselor/__tests__/essay-review-route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { ALICE, ALICE_ESSAY, ALICE_PROFILE, BOB, BOB_ESSAY, BOB_PROFILE } from "@/lib/cc/__tests__/helpers/fixtures";

const AGENCY_A = "a9e0c700-0000-4000-8000-00000000000a";
const AGENCY_B = "a9e0c700-0000-4000-8000-00000000000b";
const COUNSELOR = "c0c00000-0000-4000-8000-000000000001";

const h = vi.hoisted(() => ({
  world: null as unknown,
  membership: null as null | { role: string; requiresReview: boolean; agencyId: string },
}));

vi.mock("@/lib/supabase-auth", () => ({
  getAuthUser: async () => ({ id: "c0c00000-0000-4000-8000-000000000001" }),
  createAdminSupabase: () => h.world,
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));
vi.mock("@/lib/cc/student-roster", () => ({
  getStudentVisibility: async () => ({
    agencyId: "a9e0c700-0000-4000-8000-00000000000a",
    primaryCounselorUserId: "c0c00000-0000-4000-8000-000000000001",
    viewerRole: "counselor",
  }),
}));
vi.mock("@/lib/cc/agency-membership", () => ({ getAnyAgencyMembership: async () => h.membership }));

const world = () => h.world as FakeSupabase;
const essay = (id: string) => world().tables.cc_essays.find((e) => e.id === id)!;
const post = (body: unknown) =>
  new Request("http://localhost/x", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
const ctx = (essayId: string) => ({ params: Promise.resolve({ studentId: ALICE, essayId }) });

beforeEach(() => {
  h.membership = { role: "counselor", requiresReview: false, agencyId: AGENCY_A };
  h.world = createFakeSupabase({
    cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE }, { id: BOB_PROFILE, user_id: BOB }],
    cc_essays: [
      { id: ALICE_ESSAY, student_id: ALICE_PROFILE, current_draft: "d", word_count: 1, counselor_review_state: "resubmitted", updated_at: "2026-09-25" },
      { id: BOB_ESSAY, student_id: BOB_PROFILE, current_draft: "d", word_count: 1, counselor_review_state: null, updated_at: "2026-09-25" },
    ],
    cc_counselor_comments: [
      { id: "cA", agency_id: AGENCY_A, artifact_type: "essay", artifact_id: ALICE_ESSAY, author_user_id: COUNSELOR, body: "A", status: "shipped", created_at: "2026-09-25", range_start: null },
      { id: "cB", agency_id: AGENCY_B, artifact_type: "essay", artifact_id: ALICE_ESSAY, author_user_id: "x", body: "B", status: "draft", created_at: "2026-09-25", range_start: null },
    ],
  });
});

describe("POST /api/counselor/students/[studentId]/essays/[essayId]", () => {
  it("404s a comment aimed at another student's essay and writes nothing", async () => {
    const { POST } = await import("../students/[studentId]/essays/[essayId]/route");
    const res = await POST(post({ action: "comment", body: "injected" }), ctx(BOB_ESSAY));
    expect(res.status).toBe(404);
    expect(world().tables.cc_counselor_comments).toHaveLength(2);
  });

  it("saves a comment on the student's own essay", async () => {
    const { POST } = await import("../students/[studentId]/essays/[essayId]/route");
    const res = await POST(post({ action: "comment", body: "Good hook." }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(201);
  });

  it("forbids a supervised counselor from setting the review state", async () => {
    h.membership = { role: "counselor", requiresReview: true, agencyId: AGENCY_A };
    const { POST } = await import("../students/[studentId]/essays/[essayId]/route");
    const res = await POST(post({ action: "review", state: "approved" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(403);
    expect(essay(ALICE_ESSAY).counselor_review_state).toBe("resubmitted");
  });

  it("lets an unsupervised counselor approve", async () => {
    const { POST } = await import("../students/[studentId]/essays/[essayId]/route");
    const res = await POST(post({ action: "review", state: "approved" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(200);
    expect(essay(ALICE_ESSAY).counselor_review_state).toBe("approved");
  });
});

describe("GET counselor views", () => {
  it("essay view shows only the viewer's agency comments", async () => {
    const { GET } = await import("../students/[studentId]/essays/[essayId]/route");
    const res = await GET(new Request("http://localhost/x"), ctx(ALICE_ESSAY));
    const json = (await res.json()) as { essay: { comments: { id: string }[] } };
    expect(json.essay.comments.map((c) => c.id)).toEqual(["cA"]);
  });

  it("student file counts only the viewer's agency comments", async () => {
    const { GET } = await import("../students/[studentId]/route");
    const res = await GET(new Request("http://localhost/x"), { params: Promise.resolve({ studentId: ALICE }) });
    const json = (await res.json()) as { essays: { id: string; openCommentCount: number }[] };
    expect(json.essays.find((e) => e.id === ALICE_ESSAY)!.openCommentCount).toBe(1);
  });
});
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `npx vitest run src/app/api/counselor/__tests__/essay-review-route.test.ts`
Expected: FAIL. The foreign-essay comment returns 500 (the route doesn't know the new error) rather than 404, the supervised review returns 200, and both GET views include agency B's `cB`.

- [ ] **Step 3: Update the essay review route**

In `src/app/api/counselor/students/[studentId]/essays/[essayId]/route.ts`:

Change the import:

```ts
import {
  getEssayForReview,
  addEssayComment,
  setEssayReviewState,
  EssayNotOwnedError,
} from "@/lib/cc/counselor-comments";
```

In `GET`, scope to the viewer's agency:

```ts
  const essay = await getEssayForReview(studentId, essayId, { agencyId: vis.agencyId });
```

In the comment branch's `catch`, return 404 for a foreign essay before the generic 500:

```ts
    } catch (e) {
      if (e instanceof EssayNotOwnedError) {
        return NextResponse.json({ error: "essay not found" }, { status: 404 });
      }
      console.error("[counselor comment] failed:", e);
      return NextResponse.json({ error: "could not save comment" }, { status: 500 });
    }
```

In the review branch, directly after the `state` validation, add:

```ts
    // Supervised counselors' comments already wait for head approval; their
    // review decisions must too, or the approval gate is a formality.
    const membership = await getAnyAgencyMembership(user.id);
    if (membership?.requiresReview) {
      return NextResponse.json(
        { error: "Review decisions need your head counselor. Leave a comment instead; it goes to them for approval." },
        { status: 403 },
      );
    }
```

- [ ] **Step 4: Update the student file route**

In `src/app/api/counselor/students/[studentId]/route.ts`, change

```ts
  const essays = await listStudentEssays(studentId);
```

to

```ts
  const essays = await listStudentEssays(studentId, { agencyId: vis.agencyId });
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `npx vitest run src/app/api/counselor/__tests__/essay-review-route.test.ts src/lib/cc/__tests__/counselor-comments.test.ts`
Expected: PASS, 13 tests.

- [ ] **Step 6: Commit**

```bash
git add "src/app/api/counselor/students/[studentId]/essays/[essayId]/route.ts" "src/app/api/counselor/students/[studentId]/route.ts" src/app/api/counselor/__tests__/essay-review-route.test.ts
git commit -m "fix(security): counselor routes 404 foreign essays, scope comments to agency, gate supervised review

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 3: Counselor UI — hide the review decision for supervised counselors, add head publish

**Files:**
- Modify: `src/app/counselor/students/[studentId]/page.tsx`

**Interfaces:**
- Consumes: the existing `PATCH /api/counselor/comments/[id]` `{ status: "shipped" }` (head-only, same-agency, already implemented); `useCounselorRole()` → `{ isHead, requiresReview }`.

- [ ] **Step 1: Add the publish handler**

In the component, directly after the `setReview` function, add:

```tsx
  async function publishComment(commentId: string) {
    if (!selectedId) return;
    setBusy(true);
    await fetch(`/api/counselor/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "shipped" }),
    });
    await openEssay(selectedId);
    await loadStudent();
    setBusy(false);
  }
```

- [ ] **Step 2: Gate the review buttons**

Replace the `{/* Review actions */}` block (the `<div className="flex flex-wrap gap-2">` that holds **Request changes** and **Approve**) with:

```tsx
              {/* Review actions: supervised counselors comment; the head decides */}
              {role.requiresReview ? (
                <p className="text-xs text-white/45">
                  Your head counselor sets the review status. Leave comments below; they go to them for approval.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setReview("changes_requested")}
                    disabled={busy}
                    className="text-sm px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/15 disabled:opacity-50"
                  >
                    Request changes
                  </button>
                  <button
                    onClick={() => setReview("approved")}
                    disabled={busy}
                    className="text-sm px-4 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-50"
                  >
                    Approve
                  </button>
                </div>
              )}
```

- [ ] **Step 3: Add the head's publish control on draft comments**

Directly after the `{c.status === "draft" && ( … awaiting head approval … )}` badge, add:

```tsx
                      {c.status === "draft" && role.isHead && (
                        <button
                          onClick={() => publishComment(c.id)}
                          disabled={busy}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/15 disabled:opacity-50"
                        >
                          Publish to student
                        </button>
                      )}
```

- [ ] **Step 4: Typecheck and lint the page**

Run: `npx tsc --noEmit` then `npx eslint "src/app/counselor/students/[studentId]/page.tsx"`
Expected: exit 0, with no new errors.

- [ ] **Step 5: Commit**

```bash
git add "src/app/counselor/students/[studentId]/page.tsx"
git commit -m "feat(counselor): supervised counselors see comment-only review; heads can publish draft feedback

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 4: Invite codes can only be preassigned to the agency's own counselors

**Files:**
- Modify: `src/app/api/counselor/invite-codes/route.ts` (POST)
- Test: `src/app/api/counselor/__tests__/invite-codes-route.test.ts`

**Interfaces:**
- Consumes: `getAgencyMembership(userId, agencyId)` from `src/lib/cc/agency-membership.ts` (returns `null` for non-members).

- [ ] **Step 1: Write the failing test**

```ts
// src/app/api/counselor/__tests__/invite-codes-route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const h = vi.hoisted(() => ({
  members: new Set<string>(),
  mint: null as unknown as ReturnType<typeof vi.fn>,
}));

vi.mock("@/lib/supabase-auth", () => ({ getAuthUser: async () => ({ id: "head-1" }) }));
vi.mock("@/lib/cc/agency-membership", () => ({
  getAnyAgencyMembership: async () => ({ role: "head", agencyId: "agency-A", requiresReview: false }),
  getAgencyMembership: async (userId: string) => (h.members.has(userId) ? { role: "counselor" } : null),
}));
vi.mock("@/lib/cc/invite-codes", () => ({
  mintInviteCode: (...args: unknown[]) => h.mint(...args),
  listInviteCodes: async () => [],
}));

const post = (body: unknown) =>
  new NextRequest("http://localhost/api/counselor/invite-codes", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  h.members = new Set(["zuha"]);
  h.mint = vi.fn(async () => ({ code: "ADASTRA-K7M9P2" }));
});

describe("POST /api/counselor/invite-codes preassignment", () => {
  it("rejects a preassigned counselor outside the head's agency", async () => {
    const { POST } = await import("../invite-codes/route");
    const res = await POST(post({ preassignedCounselorUserId: "stranger" }));
    expect(res.status).toBe(400);
    expect(h.mint).not.toHaveBeenCalled();
  });

  it("mints with a preassigned counselor from the same agency", async () => {
    const { POST } = await import("../invite-codes/route");
    const res = await POST(post({ preassignedCounselorUserId: "zuha" }));
    expect(res.status).toBe(201);
    expect(h.mint).toHaveBeenCalledWith("agency-A", "head-1", expect.objectContaining({ preassignedCounselorUserId: "zuha" }));
  });

  it("mints without preassignment as before", async () => {
    const { POST } = await import("../invite-codes/route");
    const res = await POST(post({ label: "Fall cohort" }));
    expect(res.status).toBe(201);
  });
});
```

- [ ] **Step 2: Run it and confirm the first test fails**

Run: `npx vitest run src/app/api/counselor/__tests__/invite-codes-route.test.ts`
Expected: FAIL. "rejects a preassigned counselor outside the head's agency" gets 201.

- [ ] **Step 3: Validate the preassignment**

In `src/app/api/counselor/invite-codes/route.ts`, change the membership import to:

```ts
import { getAnyAgencyMembership, getAgencyMembership } from "@/lib/cc/agency-membership";
```

In `POST`, directly after the `maxUses` validation block, add:

```ts
  // A code preassigned to someone outside this agency would link students to
  // a counselor who can't see them. Only the agency's own members qualify.
  if (body.preassignedCounselorUserId) {
    const assignee = await getAgencyMembership(body.preassignedCounselorUserId, m.agencyId);
    if (!assignee) {
      return NextResponse.json(
        { error: "preassigned counselor is not a member of your agency" },
        { status: 400 },
      );
    }
  }
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `npx vitest run src/app/api/counselor/__tests__/invite-codes-route.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/counselor/invite-codes/route.ts src/app/api/counselor/__tests__/invite-codes-route.test.ts
git commit -m "fix(security): invite codes can only be preassigned to the agency's own counselors

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 5: Verification

**Files:** none changed, except the progress note.

- [ ] **Step 1: Run the full safe suite, typecheck, and build**

Run: `npx vitest run src`, then `npx tsc --noEmit`, then `npm run build`
Expected: all green; the ownership contract test (Plan 1A Task 5) still passes.

- [ ] **Step 2: Check the counselor side against real Supabase locally, using QA accounts only**

1. Run `npm run dev`. Log in at `http://localhost:3000/login` as `bilalhussain.v1+qa-c1@gmail.com` (the head of `qa-test-agency`).
2. Find qa-s2's auth user id on the roster (`GET /api/counselor/students`). Post a comment through qa-s2's path using **qa-s1's** essay id `86c5d33e-af71-4b3c-8cd1-a54735830ccd`, and expect `404`:
   `$B js "fetch('/api/counselor/students/<qa-s2-user-id>/essays/86c5d33e-af71-4b3c-8cd1-a54735830ccd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'comment',body:'verification probe'})}).then(r=>r.status)"`
3. Open qa-s1's essay in the counselor UI. Confirm the review buttons show for the head, and that any draft comment shows **Publish to student**.
4. Stop the dev server.

Expected: `404`, and the UI is as described. If step 2 returns `201`, a probe comment was written to a QA account; delete it, and treat the task as failed.

- [ ] **Step 3: Record the result**

Append the evidence to `docs/handoff/claude-progress.md` under "Security 1B". **Do not deploy.**
