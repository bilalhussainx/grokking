# Security 1A: Student-Data Ownership Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every route where a signed-in user can read or change another student's essays, courses, recommenders, or intake profile, and add a regression tripwire so new routes can't reintroduce the bug.

**Architecture:** Routes under `src/app/api/cc` use the service-role Supabase client (`createAdminSupabase`), which bypasses row-level security. Each fixed route now proves ownership first, through two small helpers in `src/lib/cc/ownership.ts`, and scopes its write to the caller's profile. Tests run the real route handlers against an in-memory fake Supabase, so they assert on resulting rows ("Bob's essay is unchanged"), not on mock calls. A static contract test fails the build when any handler writes through the service role without ownership logic.

**Tech Stack:** Next.js 16 route handlers, `@supabase/supabase-js` 2.99, vitest 3 (jsdom env), TypeScript 5.

**Spec:** `docs/design/2026-09-live-audit.md` (QA-18/19 context) and `work-diary/agency-source-independent-review.md`, extended by the Claude Code ownership sweep of 2026-09-25 (findings table below).

## Findings this plan fixes (verified by reading the source)

| # | Route | Hole | Severity |
|---|---|---|---|
| H1 | `PATCH /api/cc/essays/[id]/draft` | Overwrites any essay's draft by id | Critical |
| H2 | `POST /api/cc/essays/[id]/share` | Mints **or returns an existing** public share link for any essay, which lets anyone read another student's essay | Critical |
| H3 | `POST /api/cc/essays/[id]/outline` (`action: "save"`) | Overwrites any essay's outline and phase | High |
| H4 | `DELETE /api/cc/courses?id=` | Deletes any student's course | High |
| H5 | `PATCH` / `DELETE /api/cc/recommenders/[id]` | Edits or deletes any recommender, including the teacher's email | High |
| H6 | `POST /api/cc/recommenders/ask-email-text` | Writes the generated email onto any recommender row | Medium |
| H7 | `POST /api/cc/intake/link` | Gives the caller **the most recently created orphan profile, whoever it belongs to**. No caller exists in the app, but the endpoint is live. | High |

Verified safe, no change: the essay routes that go through `buildEssayContext`, `canvas-extract`, `drafts/*`, `review`, `applications/update`, `chances`, `waitlist`, `share-link`, `profile/identity`, the `guest/*` routes, the counselor engagements, services, payouts, and grant-pro routes, and every write through the user-scoped client (owner RLS policies exist on `cc_activities`, `cc_honors`, and the other profile tables).

## Global Constraints

- **Never run `npm run test:unit`.** `tests/unit/**` runs DB fixtures against `.env.local`, which is **production**. The test command is `npx vitest run src`.
- `cc_essays.student_id`, `cc_courses.student_id`, and `cc_recommenders.student_id` reference `cc_student_profiles.id`, **not** the auth user id.
- `cc_student_profiles` has no unique constraint on `user_id`. Take the first row (`.limit(1).maybeSingle()`); never `.single()` it by `user_id`.
- An ownership failure returns **404** with the resource-specific "not found" message. Never 403, so row existence isn't revealed.
- Commit only explicit paths (`git add <files>`), never `-A`. Commit trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`
- No production deploy, and no production migration. This plan needs no migration.

## Review Focus

1. The caller has no `cc_student_profiles` row. Every fixed route returns 404 and writes nothing (tests in Tasks 1 and 3).
2. The id isn't a UUID (`"new"`, `"undefined"`). Expect 404, not a Postgres cast error surfaced as 500 (tests in Tasks 1 and 3).
3. The caller has duplicate profile rows. Ownership still resolves, with no 500 (test in Task 1).
4. A non-owner requests the share link of an essay that already has a token. Expect 404, and the existing token never appears in the response (test in Task 2).
5. A recommender PATCH carries no recognized fields. Expect 400 instead of an empty update (test in Task 3).

---

### Task 1: Ownership helpers and in-memory fake Supabase

**Files:**
- Create: `src/lib/cc/__tests__/helpers/fake-supabase.ts`
- Create: `src/lib/cc/__tests__/helpers/fixtures.ts`
- Create: `src/lib/cc/ownership.ts`
- Test: `src/lib/cc/__tests__/ownership.test.ts`

**Interfaces:**
- Produces:
  - `isUuid(value: unknown): value is string`
  - `getStudentProfileId(db: SupabaseClient, userId: string): Promise<string | null>`
  - `getOwnedEssay(db: SupabaseClient, userId: string, essayId: string): Promise<OwnedEssay | null>`, where `OwnedEssay = { id: string; student_id: string; share_token: string | null }`
  - `createFakeSupabase(seed?: FakeTables): FakeSupabase` (`FakeSupabase = { from(table): FakeQuery; tables: FakeTables }`)
  - Fixture ids `ALICE, BOB, ALICE_PROFILE, BOB_PROFILE, ALICE_ESSAY, BOB_ESSAY, ALICE_COURSE, BOB_COURSE, ALICE_REC, BOB_REC`, plus `studentWorld(): FakeSupabase` and `asDb(fake): SupabaseClient`

- [ ] **Step 1: Write the fake Supabase**

```ts
// src/lib/cc/__tests__/helpers/fake-supabase.ts
// In-memory stand-in for the subset of the supabase-js query builder our
// routes use. Ownership tests assert on the resulting rows ("Bob's essay is
// unchanged") instead of on mock call arguments, so a route that forgets a
// filter fails even if it calls .eq() with plausible-looking values.
export type FakeRow = Record<string, unknown>;
export type FakeTables = Record<string, FakeRow[]>;
export type FakeResult = { data: unknown; error: { message: string } | null };
type Mode = "select" | "insert" | "update" | "delete";

export interface FakeSupabase {
  from(table: string): FakeQuery;
  tables: FakeTables;
}

export class FakeQuery implements PromiseLike<FakeResult> {
  private mode: Mode = "select";
  private filters: Array<(r: FakeRow) => boolean> = [];
  private payload: FakeRow | FakeRow[] | null = null;
  private returning = false;
  private limitN: number | null = null;
  private singleMode: "single" | "maybe" | null = null;

  constructor(
    private readonly tables: FakeTables,
    private readonly table: string,
    private readonly nextId: () => string,
  ) {}

  select(_columns?: string): this {
    if (this.mode !== "select") this.returning = true;
    return this;
  }
  insert(rows: FakeRow | FakeRow[]): this {
    this.mode = "insert";
    this.payload = rows;
    return this;
  }
  update(patch: FakeRow): this {
    this.mode = "update";
    this.payload = patch;
    return this;
  }
  delete(): this {
    this.mode = "delete";
    return this;
  }
  eq(col: string, val: unknown): this {
    this.filters.push((r) => r[col] === val);
    return this;
  }
  neq(col: string, val: unknown): this {
    this.filters.push((r) => r[col] !== val);
    return this;
  }
  in(col: string, vals: unknown[]): this {
    this.filters.push((r) => vals.includes(r[col]));
    return this;
  }
  is(col: string, val: unknown): this {
    this.filters.push((r) => (r[col] ?? null) === val);
    return this;
  }
  order(_col: string, _opts?: unknown): this {
    return this;
  }
  limit(n: number): this {
    this.limitN = n;
    return this;
  }
  single(): this {
    this.singleMode = "single";
    return this;
  }
  maybeSingle(): this {
    this.singleMode = "maybe";
    return this;
  }

  private run(): FakeResult {
    if (!this.tables[this.table]) this.tables[this.table] = [];
    const rows = this.tables[this.table];
    const matches = (r: FakeRow) => this.filters.every((f) => f(r));
    let hit: FakeRow[];
    if (this.mode === "insert") {
      const list = Array.isArray(this.payload) ? this.payload : [this.payload as FakeRow];
      hit = list.map((r) => ({ id: this.nextId(), ...r }));
      rows.push(...hit);
    } else if (this.mode === "update") {
      hit = rows.filter(matches);
      for (const r of hit) Object.assign(r, this.payload);
    } else if (this.mode === "delete") {
      hit = rows.filter(matches);
      this.tables[this.table] = rows.filter((r) => !matches(r));
    } else {
      hit = rows.filter(matches);
    }
    if (this.limitN !== null) hit = hit.slice(0, this.limitN);
    const out = hit.map((r) => ({ ...r }));
    if (this.singleMode === "single") {
      return out.length === 1
        ? { data: out[0], error: null }
        : { data: null, error: { message: `expected 1 row, got ${out.length}` } };
    }
    if (this.singleMode === "maybe") {
      return out.length <= 1
        ? { data: out[0] ?? null, error: null }
        : { data: null, error: { message: "multiple rows returned" } };
    }
    if (this.mode !== "select" && !this.returning) return { data: null, error: null };
    return { data: out, error: null };
  }

  then<T1 = FakeResult, T2 = never>(
    onfulfilled?: ((value: FakeResult) => T1 | PromiseLike<T1>) | null,
    onrejected?: ((reason: unknown) => T2 | PromiseLike<T2>) | null,
  ): PromiseLike<T1 | T2> {
    return Promise.resolve(this.run()).then(onfulfilled, onrejected);
  }
}

export function createFakeSupabase(seed: FakeTables = {}): FakeSupabase {
  const tables: FakeTables = JSON.parse(JSON.stringify(seed)) as FakeTables;
  let n = 0;
  const nextId = () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;
  return { tables, from: (table: string) => new FakeQuery(tables, table, nextId) };
}
```

- [ ] **Step 2: Write the shared fixtures**

```ts
// src/lib/cc/__tests__/helpers/fixtures.ts
// Two students, Alice and Bob, each owning one of everything. Auth user ids
// and cc_student_profiles ids differ on purpose: the routes must bridge
// auth uid → profile id → row.student_id, and tests should catch a route
// that confuses the two.
import type { SupabaseClient } from "@supabase/supabase-js";
import { createFakeSupabase, type FakeSupabase } from "./fake-supabase";

export const ALICE = "a11ce000-0000-4000-8000-000000000001";
export const BOB = "b0b00000-0000-4000-8000-000000000002";
export const ALICE_PROFILE = "a11ce000-1111-4000-8000-000000000001";
export const BOB_PROFILE = "b0b00000-1111-4000-8000-000000000002";
export const ALICE_ESSAY = "a11ce000-2222-4000-8000-000000000001";
export const BOB_ESSAY = "b0b00000-2222-4000-8000-000000000002";
export const ALICE_COURSE = "a11ce000-3333-4000-8000-000000000001";
export const BOB_COURSE = "b0b00000-3333-4000-8000-000000000002";
export const ALICE_REC = "a11ce000-4444-4000-8000-000000000001";
export const BOB_REC = "b0b00000-4444-4000-8000-000000000002";

export function studentWorld(): FakeSupabase {
  return createFakeSupabase({
    cc_student_profiles: [
      { id: ALICE_PROFILE, user_id: ALICE },
      { id: BOB_PROFILE, user_id: BOB },
    ],
    cc_essays: [
      { id: ALICE_ESSAY, student_id: ALICE_PROFILE, current_draft: "Alice wrote this.", word_count: 3, phase: "draft", outline_json: null, share_token: null },
      { id: BOB_ESSAY, student_id: BOB_PROFILE, current_draft: "Bob wrote this.", word_count: 3, phase: "draft", outline_json: null, share_token: "bob-secret-token" },
    ],
    cc_courses: [
      { id: ALICE_COURSE, student_id: ALICE_PROFILE, course_name: "AP Calculus BC" },
      { id: BOB_COURSE, student_id: BOB_PROFILE, course_name: "AP Biology" },
    ],
    cc_recommenders: [
      { id: ALICE_REC, student_id: ALICE_PROFILE, name: "Ms. Rivera", email: "rivera@school.test", ask_email_text: null },
      { id: BOB_REC, student_id: BOB_PROFILE, name: "Mr. Chen", email: "chen@school.test", ask_email_text: null },
    ],
    cc_essay_interactions: [],
  });
}

export const asDb = (fake: FakeSupabase) => fake as unknown as SupabaseClient;
```

- [ ] **Step 3: Write the failing helper tests**

```ts
// src/lib/cc/__tests__/ownership.test.ts
import { describe, it, expect } from "vitest";
import { getOwnedEssay, getStudentProfileId, isUuid } from "../ownership";
import { ALICE, ALICE_ESSAY, ALICE_PROFILE, BOB, asDb, studentWorld } from "./helpers/fixtures";

describe("isUuid", () => {
  it("accepts a v4 uuid and rejects route placeholders", () => {
    expect(isUuid(ALICE_ESSAY)).toBe(true);
    expect(isUuid("new")).toBe(false);
    expect(isUuid("undefined")).toBe(false);
    expect(isUuid(undefined)).toBe(false);
  });
});

describe("getStudentProfileId", () => {
  it("returns the caller's profile id", async () => {
    expect(await getStudentProfileId(asDb(studentWorld()), ALICE)).toBe(ALICE_PROFILE);
  });

  it("returns null when the user has no profile", async () => {
    expect(await getStudentProfileId(asDb(studentWorld()), "c0000000-0000-4000-8000-000000000003")).toBeNull();
  });

  it("still resolves when a user has duplicate profile rows", async () => {
    const world = studentWorld();
    world.tables.cc_student_profiles.push({ id: "a11ce000-1111-4000-8000-00000000dup0", user_id: ALICE });
    expect(await getStudentProfileId(asDb(world), ALICE)).toBe(ALICE_PROFILE);
  });
});

describe("getOwnedEssay", () => {
  it("returns the essay when it belongs to the caller", async () => {
    const essay = await getOwnedEssay(asDb(studentWorld()), ALICE, ALICE_ESSAY);
    expect(essay).toEqual({ id: ALICE_ESSAY, student_id: ALICE_PROFILE, share_token: null });
  });

  it("returns null for another student's essay", async () => {
    expect(await getOwnedEssay(asDb(studentWorld()), BOB, ALICE_ESSAY)).toBeNull();
  });

  it("returns null for a non-uuid id", async () => {
    expect(await getOwnedEssay(asDb(studentWorld()), ALICE, "new")).toBeNull();
  });

  it("returns null when the caller has no profile", async () => {
    expect(await getOwnedEssay(asDb(studentWorld()), "c0000000-0000-4000-8000-000000000003", ALICE_ESSAY)).toBeNull();
  });
});
```

- [ ] **Step 4: Run it and confirm it fails**

Run: `npx vitest run src/lib/cc/__tests__/ownership.test.ts`
Expected: FAIL, with `Failed to resolve import "../ownership"`.

- [ ] **Step 5: Implement the helpers**

```ts
// src/lib/cc/ownership.ts
// Ownership guards for routes that use the service-role (RLS-bypassing)
// Supabase client. With that client a filter on the row id alone lets any
// signed-in user touch any student's rows, so every student-data write must
// first prove the row belongs to the caller.
// Plan: docs/superpowers/plans/2026-09-25-security-1a-student-data-ownership.md
import type { SupabaseClient } from "@supabase/supabase-js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

// cc_student_profiles has no unique constraint on user_id, so take the
// first row instead of letting maybeSingle() error on duplicates.
export async function getStudentProfileId(
  db: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle<{ id: string }>();
  return data?.id ?? null;
}

export interface OwnedEssay {
  id: string;
  student_id: string;
  share_token: string | null;
}

// The essay, only if it belongs to the caller's student profile.
export async function getOwnedEssay(
  db: SupabaseClient,
  userId: string,
  essayId: string,
): Promise<OwnedEssay | null> {
  if (!isUuid(essayId)) return null;
  const profileId = await getStudentProfileId(db, userId);
  if (!profileId) return null;
  const { data, error } = await db
    .from("cc_essays")
    .select("id, student_id, share_token")
    .eq("id", essayId)
    .eq("student_id", profileId)
    .maybeSingle<OwnedEssay>();
  if (error || !data) return null;
  return data;
}
```

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npx vitest run src/lib/cc/__tests__/ownership.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 7: Commit**

```bash
git add src/lib/cc/ownership.ts src/lib/cc/__tests__/ownership.test.ts src/lib/cc/__tests__/helpers/fake-supabase.ts src/lib/cc/__tests__/helpers/fixtures.ts
git commit -m "feat(security): ownership helpers + in-memory Supabase fake for route tests

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 2: Essay draft, share, and outline-save routes (H1, H2, H3)

**Files:**
- Modify: `src/app/api/cc/essays/[id]/draft/route.ts` (PATCH handler)
- Modify: `src/app/api/cc/essays/[id]/share/route.ts` (POST handler)
- Modify: `src/app/api/cc/essays/[id]/outline/route.ts` (the `action === "save"` branch)
- Test: `src/app/api/cc/essays/__tests__/ownership-routes.test.ts`

**Interfaces:**
- Consumes: `getOwnedEssay(db, userId, essayId)` from Task 1; the fixtures from Task 1.

- [ ] **Step 1: Write the failing route tests**

```ts
// src/app/api/cc/essays/__tests__/ownership-routes.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { ALICE, ALICE_ESSAY, BOB, BOB_ESSAY, studentWorld } from "@/lib/cc/__tests__/helpers/fixtures";
import type { FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";

const h = vi.hoisted(() => ({ world: null as unknown, user: null as string | null }));

vi.mock("../../helpers", () => ({
  requireAuth: async () => (h.user ? { user: { id: h.user }, supabase: {} } : null),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));

const world = () => h.world as FakeSupabase;
const essay = (id: string) => world().tables.cc_essays.find((e) => e.id === id)!;

function request(method: string, id: string, body?: unknown) {
  return new NextRequest(`http://localhost/api/cc/essays/${id}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  h.world = studentWorld();
  h.user = null;
});

describe("PATCH /api/cc/essays/[id]/draft", () => {
  it("rejects another student's essay and leaves it unchanged", async () => {
    h.user = BOB;
    const { PATCH } = await import("../[id]/draft/route");
    const res = await PATCH(request("PATCH", ALICE_ESSAY, { content: "hijacked" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(404);
    expect(essay(ALICE_ESSAY).current_draft).toBe("Alice wrote this.");
  });

  it("saves the caller's own draft", async () => {
    h.user = ALICE;
    const { PATCH } = await import("../[id]/draft/route");
    const res = await PATCH(request("PATCH", ALICE_ESSAY, { content: "A better opening line" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(200);
    expect(essay(ALICE_ESSAY).current_draft).toBe("A better opening line");
    expect(essay(ALICE_ESSAY).word_count).toBe(4);
  });

  it("returns 401 when signed out", async () => {
    const { PATCH } = await import("../[id]/draft/route");
    const res = await PATCH(request("PATCH", ALICE_ESSAY, { content: "x" }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(401);
  });
});

describe("POST /api/cc/essays/[id]/share", () => {
  it("never reveals another student's existing share token", async () => {
    h.user = ALICE;
    const { POST } = await import("../[id]/share/route");
    const res = await POST(request("POST", BOB_ESSAY), ctx(BOB_ESSAY));
    expect(res.status).toBe(404);
    expect(await res.text()).not.toContain("bob-secret-token");
  });

  it("does not mint a token on another student's essay", async () => {
    h.user = BOB;
    const { POST } = await import("../[id]/share/route");
    const res = await POST(request("POST", ALICE_ESSAY), ctx(ALICE_ESSAY));
    expect(res.status).toBe(404);
    expect(essay(ALICE_ESSAY).share_token).toBeNull();
  });

  it("mints and stores a token for the owner", async () => {
    h.user = ALICE;
    const { POST } = await import("../[id]/share/route");
    const res = await POST(request("POST", ALICE_ESSAY), ctx(ALICE_ESSAY));
    const json = (await res.json()) as { share_token: string };
    expect(res.status).toBe(200);
    expect(json.share_token).toMatch(/^[0-9a-f]{32}$/);
    expect(essay(ALICE_ESSAY).share_token).toBe(json.share_token);
  });
});

describe("POST /api/cc/essays/[id]/outline (save)", () => {
  const outline = { title: "Three Tuesdays", sections: [] };

  it("rejects saving onto another student's essay", async () => {
    h.user = BOB;
    const { POST } = await import("../[id]/outline/route");
    const res = await POST(request("POST", ALICE_ESSAY, { action: "save", outline }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(404);
    expect(essay(ALICE_ESSAY).outline_json).toBeNull();
    expect(world().tables.cc_essay_interactions).toHaveLength(0);
  });

  it("saves the owner's outline and moves the essay to draft", async () => {
    h.user = ALICE;
    const { POST } = await import("../[id]/outline/route");
    const res = await POST(request("POST", ALICE_ESSAY, { action: "save", outline }), ctx(ALICE_ESSAY));
    expect(res.status).toBe(200);
    expect(essay(ALICE_ESSAY).outline_json).toEqual(outline);
    expect(essay(ALICE_ESSAY).phase).toBe("draft");
  });
});
```

- [ ] **Step 2: Run them and confirm the non-owner cases fail**

Run: `npx vitest run src/app/api/cc/essays/__tests__/ownership-routes.test.ts`
Expected: FAIL. The three "another student" tests get `200` instead of `404` (and the share test finds `bob-secret-token` in the body). The owner and 401 tests pass.

- [ ] **Step 3: Fix the draft PATCH**

In `src/app/api/cc/essays/[id]/draft/route.ts`, add the import:

```ts
import { getOwnedEssay } from "@/lib/cc/ownership";
```

Replace the update block in `PATCH` (from `const db = createAdminSupabase();` through `.eq("id", id);`) with:

```ts
  const db = createAdminSupabase();
  const owned = await getOwnedEssay(db, auth.user.id, id);
  if (!owned) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const { error } = await db
    .from("cc_essays")
    .update({
      current_draft: content,
      word_count: wordCount,
      phase: "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", owned.id)
    .eq("student_id", owned.student_id);
```

- [ ] **Step 4: Fix the share POST**

Replace the whole body of `src/app/api/cc/essays/[id]/share/route.ts` with:

```ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { getOwnedEssay } from "@/lib/cc/ownership";
import { randomBytes } from "crypto";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const db = createAdminSupabase();
  // Only the essay's owner may mint or read its share link. Returning an
  // existing token to anyone else would publish their essay.
  const owned = await getOwnedEssay(db, auth.user.id, id);
  if (!owned) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  let shareToken = owned.share_token;
  if (!shareToken) {
    shareToken = randomBytes(16).toString("hex");
    await db
      .from("cc_essays")
      .update({ share_token: shareToken })
      .eq("id", owned.id)
      .eq("student_id", owned.student_id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kairoslearn.com";
  return NextResponse.json({
    share_token: shareToken,
    share_url: `${baseUrl}/cc/essays/shared/${shareToken}`,
  });
}
```

- [ ] **Step 5: Fix the outline save branch**

In `src/app/api/cc/essays/[id]/outline/route.ts`, add the import:

```ts
import { getOwnedEssay } from "@/lib/cc/ownership";
```

Replace the start of the save branch, from `if (action === "save" && outline) {` through the `.eq("id", id);` that closes its update, with:

```ts
  if (action === "save" && outline) {
    const owned = await getOwnedEssay(db, auth.user.id, id);
    if (!owned) {
      return NextResponse.json({ error: "Essay not found" }, { status: 404 });
    }

    const { error } = await db
      .from("cc_essays")
      .update({
        outline_json: outline,
        phase: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", owned.id)
      .eq("student_id", owned.student_id);
```

In the same branch, change `essay_id: id,` in the `cc_essay_interactions` insert to `essay_id: owned.id,`. Leave the `generate` branch alone; it already goes through `buildEssayContext`, which is owner-scoped.

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npx vitest run src/app/api/cc/essays/__tests__/ownership-routes.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 7: Commit**

```bash
git add "src/app/api/cc/essays/[id]/draft/route.ts" "src/app/api/cc/essays/[id]/share/route.ts" "src/app/api/cc/essays/[id]/outline/route.ts" src/app/api/cc/essays/__tests__/ownership-routes.test.ts
git commit -m "fix(security): essay draft/share/outline-save verify the caller owns the essay

Any signed-in user could overwrite another student's draft or outline, and
the share route minted or returned public links for essays the caller did
not own.

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 3: Courses and recommenders (H4, H5, H6)

**Files:**
- Modify: `src/app/api/cc/courses/route.ts` (DELETE handler)
- Modify: `src/app/api/cc/recommenders/[id]/route.ts` (PATCH and DELETE handlers)
- Modify: `src/app/api/cc/recommenders/ask-email-text/route.ts` (the save block)
- Test: `src/app/api/cc/__tests__/student-data-ownership.test.ts`

**Interfaces:**
- Consumes: `isUuid`, `getStudentProfileId` from Task 1; the fixtures from Task 1.

- [ ] **Step 1: Write the failing tests**

```ts
// src/app/api/cc/__tests__/student-data-ownership.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { ALICE, ALICE_COURSE, ALICE_REC, BOB, BOB_COURSE, BOB_REC, studentWorld } from "@/lib/cc/__tests__/helpers/fixtures";
import type { FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";

const h = vi.hoisted(() => ({ world: null as unknown, user: null as string | null }));

vi.mock("../helpers", () => ({
  requireAuth: async () => (h.user ? { user: { id: h.user }, supabase: {} } : null),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
  ensureStudentProfile: async () => ({ id: "unused" }),
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));
vi.mock("@/lib/cc/openrouter", () => ({ chatOnce: async () => "Dear teacher, would you write me a letter?" }));

const world = () => h.world as FakeSupabase;
const row = (table: string, id: string) => world().tables[table].find((r) => r.id === id);

function req(method: string, url: string, body?: unknown) {
  return new NextRequest(url, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  h.world = studentWorld();
  h.user = ALICE;
});

describe("DELETE /api/cc/courses", () => {
  it("cannot delete another student's course", async () => {
    const { DELETE } = await import("../courses/route");
    const res = await DELETE(req("DELETE", `http://localhost/api/cc/courses?id=${BOB_COURSE}`));
    expect(res.status).toBe(404);
    expect(row("cc_courses", BOB_COURSE)).toBeDefined();
  });

  it("deletes the caller's own course", async () => {
    const { DELETE } = await import("../courses/route");
    const res = await DELETE(req("DELETE", `http://localhost/api/cc/courses?id=${ALICE_COURSE}`));
    expect(res.status).toBe(200);
    expect(row("cc_courses", ALICE_COURSE)).toBeUndefined();
  });

  it("returns 404 for a non-uuid id instead of a database error", async () => {
    const { DELETE } = await import("../courses/route");
    const res = await DELETE(req("DELETE", "http://localhost/api/cc/courses?id=undefined"));
    expect(res.status).toBe(404);
  });

  it("returns 404 when the caller has no student profile", async () => {
    h.user = "c0000000-0000-4000-8000-000000000003";
    const { DELETE } = await import("../courses/route");
    const res = await DELETE(req("DELETE", `http://localhost/api/cc/courses?id=${ALICE_COURSE}`));
    expect(res.status).toBe(404);
    expect(row("cc_courses", ALICE_COURSE)).toBeDefined();
  });
});

describe("/api/cc/recommenders/[id]", () => {
  it("PATCH cannot change another student's recommender email", async () => {
    const { PATCH } = await import("../recommenders/[id]/route");
    const res = await PATCH(req("PATCH", "http://localhost/x", { email: "attacker@evil.test" }), ctx(BOB_REC));
    expect(res.status).toBe(404);
    expect(row("cc_recommenders", BOB_REC)!.email).toBe("chen@school.test");
  });

  it("PATCH updates the caller's own recommender", async () => {
    const { PATCH } = await import("../recommenders/[id]/route");
    const res = await PATCH(req("PATCH", "http://localhost/x", { status: "asked" }), ctx(ALICE_REC));
    expect(res.status).toBe(200);
    expect(row("cc_recommenders", ALICE_REC)!.status).toBe("asked");
  });

  it("PATCH with no recognized fields is a 400, not an empty update", async () => {
    const { PATCH } = await import("../recommenders/[id]/route");
    const res = await PATCH(req("PATCH", "http://localhost/x", { student_id: "x" }), ctx(ALICE_REC));
    expect(res.status).toBe(400);
  });

  it("DELETE cannot remove another student's recommender", async () => {
    const { DELETE } = await import("../recommenders/[id]/route");
    const res = await DELETE(req("DELETE", "http://localhost/x"), ctx(BOB_REC));
    expect(res.status).toBe(404);
    expect(row("cc_recommenders", BOB_REC)).toBeDefined();
  });

  it("DELETE removes the caller's own recommender", async () => {
    const { DELETE } = await import("../recommenders/[id]/route");
    const res = await DELETE(req("DELETE", "http://localhost/x"), ctx(ALICE_REC));
    expect(res.status).toBe(200);
    expect(row("cc_recommenders", ALICE_REC)).toBeUndefined();
  });
});

describe("POST /api/cc/recommenders/ask-email-text", () => {
  it("does not write the generated email onto another student's recommender", async () => {
    const { POST } = await import("../recommenders/ask-email-text/route");
    const res = await POST(req("POST", "http://localhost/x", { recommenderId: BOB_REC, teacherName: "Mr. Chen" }));
    expect(res.status).toBe(200);
    expect(row("cc_recommenders", BOB_REC)!.ask_email_text).toBeNull();
  });

  it("saves the generated email on the caller's own recommender", async () => {
    const { POST } = await import("../recommenders/ask-email-text/route");
    await POST(req("POST", "http://localhost/x", { recommenderId: ALICE_REC, teacherName: "Ms. Rivera" }));
    expect(row("cc_recommenders", ALICE_REC)!.ask_email_text).toBe("Dear teacher, would you write me a letter?");
  });
});
```

- [ ] **Step 2: Run them and confirm the cross-student cases fail**

Run: `npx vitest run src/app/api/cc/__tests__/student-data-ownership.test.ts`
Expected: FAIL. Bob's course and recommender get deleted or changed, the non-uuid and no-profile deletes return 200, the empty PATCH returns 200, and Bob's `ask_email_text` is overwritten.

- [ ] **Step 3: Fix the courses DELETE**

In `src/app/api/cc/courses/route.ts`, add the import:

```ts
import { getStudentProfileId, isUuid } from "@/lib/cc/ownership";
```

Replace the `DELETE` function with:

```ts
export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const notFound = NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (!isUuid(id)) return notFound;

  const db = createAdminSupabase();
  const profileId = await getStudentProfileId(db, auth.user.id);
  if (!profileId) return notFound;

  const { data: deleted, error } = await db
    .from("cc_courses")
    .delete()
    .eq("id", id)
    .eq("student_id", profileId)
    .select("id");
  if (error) return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  if (!deleted || deleted.length === 0) return notFound;
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Fix the recommender PATCH and DELETE**

Replace the whole body of `src/app/api/cc/recommenders/[id]/route.ts` with:

```ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { getStudentProfileId, isUuid } from "@/lib/cc/ownership";

const notFound = () => NextResponse.json({ error: "Recommender not found" }, { status: 404 });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const body = await req.json();
  const { status, name, subject, email, asked_at, submitted_at } = body as {
    status?: string;
    name?: string;
    subject?: string;
    email?: string;
    asked_at?: string;
    submitted_at?: string;
  };

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (name) updates.name = name;
  if (subject !== undefined) updates.subject = subject;
  if (email !== undefined) updates.email = email;
  if (asked_at) updates.asked_at = asked_at;
  if (submitted_at) updates.submitted_at = submitted_at;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }
  if (!isUuid(id)) return notFound();

  const db = createAdminSupabase();
  const profileId = await getStudentProfileId(db, auth.user.id);
  if (!profileId) return notFound();

  const { data: updated, error } = await db
    .from("cc_recommenders")
    .update(updates)
    .eq("id", id)
    .eq("student_id", profileId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  if (!updated || updated.length === 0) return notFound();

  return NextResponse.json({ updated: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;
  if (!isUuid(id)) return notFound();

  const db = createAdminSupabase();
  const profileId = await getStudentProfileId(db, auth.user.id);
  if (!profileId) return notFound();

  const { data: deleted, error } = await db
    .from("cc_recommenders")
    .delete()
    .eq("id", id)
    .eq("student_id", profileId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
  if (!deleted || deleted.length === 0) return notFound();

  return NextResponse.json({ deleted: true });
}
```

- [ ] **Step 5: Fix the ask-email save**

In `src/app/api/cc/recommenders/ask-email-text/route.ts`, replace the save block, from `if (body.recommenderId) {` through its closing `}`, with:

```ts
  // Save the latest generated email to the caller's own recommender row.
  if (body.recommenderId && profile) {
    await db
      .from("cc_recommenders")
      .update({ ask_email_text: email })
      .eq("id", body.recommenderId)
      .eq("student_id", profile.id);
  }
```

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npx vitest run src/app/api/cc/__tests__/student-data-ownership.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/cc/courses/route.ts "src/app/api/cc/recommenders/[id]/route.ts" src/app/api/cc/recommenders/ask-email-text/route.ts src/app/api/cc/__tests__/student-data-ownership.test.ts
git commit -m "fix(security): scope course delete and recommender writes to the caller's profile

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 4: Intake link stops adopting other students' profiles (H7)

**Files:**
- Modify: `src/app/api/cc/intake/link/route.ts`
- Test: `src/app/api/cc/intake/__tests__/link.test.ts`

**Interfaces:**
- Consumes: `createFakeSupabase` from Task 1.

Why: the route linked the caller to "the most recently created profile with no user", a row that belongs to whichever anonymous student finished intake last. No code in the app calls this route, and no column ties a session to the profile it created, so there is no correct way to adopt. Linking the session stays; the profile adoption goes.

- [ ] **Step 1: Write the failing test**

```ts
// src/app/api/cc/intake/__tests__/link.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";

const h = vi.hoisted(() => ({ world: null as unknown, user: null as string | null }));

vi.mock("../../helpers", () => ({ createAdminSupabase: () => h.world }));
vi.mock("@/lib/supabase-server", () => ({
  createServerSupabase: async () => ({
    auth: { getUser: async () => ({ data: { user: h.user ? { id: h.user } : null } }) },
  }),
}));

const CALLER = "ca11e700-0000-4000-8000-000000000001";
const STRANGER_PROFILE = "57a46e70-1111-4000-8000-000000000001";

beforeEach(() => {
  h.user = CALLER;
  h.world = createFakeSupabase({
    cc_intake_sessions: [{ id: "5e550000-0000-4000-8000-000000000001", session_token: "tok-123", user_id: null }],
    // Another anonymous student's intake profile: the newest orphan.
    cc_student_profiles: [{ id: STRANGER_PROFILE, user_id: null, preferred_name: "Stranger", created_at: "2026-09-25T10:00:00Z" }],
  });
});

function post(body: unknown) {
  return new NextRequest("http://localhost/api/cc/intake/link", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/cc/intake/link", () => {
  it("links the session to the caller", async () => {
    const { POST } = await import("../link/route");
    const res = await POST(post({ session_token: "tok-123" }));
    expect(res.status).toBe(200);
    expect((h.world as FakeSupabase).tables.cc_intake_sessions[0].user_id).toBe(CALLER);
  });

  it("never assigns another student's orphan profile to the caller", async () => {
    const { POST } = await import("../link/route");
    await POST(post({ session_token: "tok-123" }));
    const stranger = (h.world as FakeSupabase).tables.cc_student_profiles.find((p) => p.id === STRANGER_PROFILE)!;
    expect(stranger.user_id).toBeNull();
  });
});
```

- [ ] **Step 2: Run it and confirm the second test fails**

Run: `npx vitest run src/app/api/cc/intake/__tests__/link.test.ts`
Expected: FAIL. "never assigns another student's orphan profile" gets `user_id` equal to the caller's id.

- [ ] **Step 3: Remove the orphan-profile adoption**

In `src/app/api/cc/intake/link/route.ts`, delete the block from the comment `// Link the orphan profile created during intake completion` through the closing `}` of `if (orphanProfile) { … }`, and put this comment in its place:

```ts
  // Deliberately no profile adoption here. The previous code linked "the
  // newest profile with no user", which belongs to whichever anonymous
  // student finished intake last: another student's data. Sessions don't
  // record the profile they created, so a correct link needs a
  // session→profile column first (tracked in docs/handoff).
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `npx vitest run src/app/api/cc/intake/__tests__/link.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cc/intake/link/route.ts src/app/api/cc/intake/__tests__/link.test.ts
git commit -m "fix(security): intake link no longer hands the caller another student's orphan profile

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 5: Ownership contract test (regression tripwire)

**Files:**
- Test: `src/app/api/__tests__/ownership-contract.test.ts`

**Interfaces:**
- Consumes: the helper names from Task 1 (`getOwnedEssay`, `getStudentProfileId`) as ownership markers. Plan 1B adds `essayBelongsToStudent`.

- [ ] **Step 1: Write the contract test**

```ts
// src/app/api/__tests__/ownership-contract.test.ts
// Static tripwire: every route handler that WRITES through the service-role
// Supabase client must show ownership logic before or inside its first write
// statement. The service role bypasses RLS, so a write filtered by id alone
// lets any signed-in user modify any student's row. The tripwire caught every
// hole fixed in docs/superpowers/plans/2026-09-25-security-1a-*.md.
//
// It is a tripwire, not a proof: a handler can pass by doing an unrelated
// ownership lookup and then writing an unscoped row (recommenders/
// ask-email-text did exactly that and has its own behavioral test). New
// routes need real tests. Allowlist only with a written reason.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src/app/api/cc", "src/app/api/counselor"];
const HANDLER_SPLIT = /(?=export async function (?:GET|POST|PATCH|PUT|DELETE)\b)/;
const WRITE = /\.(update|delete|upsert)\(/;
const OWNERSHIP = new RegExp(
  [
    "getOwnedEssay", "getStudentProfileId", "buildEssayContext", "essayBelongsToStudent",
    "getStudentVisibility", "ensureStudentProfile", "getCounselorForUser", "getCounselorRow",
    "ownService", "getAnyAgencyMembership", "getAgencyMembership",
    String.raw`\.eq\(\s*"student_id"`,
    String.raw`\.eq\(\s*"(user_id|student_user_id|counselor_id|author_user_id)",\s*(auth\.)?user\.id\)`,
    String.raw`user_id:\s*(auth\.)?user\.id`,
    String.raw`\.student_id\s*!==`, String.raw`!==\s*\w+\.student_id`,
    String.raw`\.counselor_id\s*!==`, String.raw`\.user_id\s*!==`, String.raw`!==\s*(auth\.)?user\.id`,
  ].join("|"),
);

// "<repo-relative path> <METHOD>" → why it is safe without an owner check.
const ALLOWLIST: Record<string, string> = {
  "src/app/api/cc/intake/complete/route.ts POST":
    "Anonymous intake, authorized by the unguessable session_token (a capability).",
  "src/app/api/cc/intake/turn/route.ts POST":
    "Anonymous intake, authorized by the unguessable session_token (a capability).",
};

function unscopedWriteHandlers(source: string): string[] {
  const methods: string[] = [];
  for (const segment of source.split(HANDLER_SPLIT)) {
    const m = segment.match(/^export async function (GET|POST|PATCH|PUT|DELETE)/);
    if (!m) continue;
    const write = segment.search(WRITE);
    if (write < 0) continue;
    const end = segment.indexOf(";", write);
    if (!OWNERSHIP.test(segment.slice(0, end < 0 ? segment.length : end))) methods.push(m[1]);
  }
  return methods;
}

function routeFiles(dir: string, out: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (name !== "__tests__") routeFiles(full, out);
    } else if (name === "route.ts") {
      out.push(full);
    }
  }
  return out;
}

describe("ownership contract for service-role writes", () => {
  it("flags a handler that writes by id alone", () => {
    const bad = `export async function PATCH(req) {
      const db = createAdminSupabase();
      await db.from("cc_essays").update({ x: 1 }).eq("id", id);
    }`;
    expect(unscopedWriteHandlers(bad)).toEqual(["PATCH"]);
  });

  it("accepts a handler that proves ownership first", () => {
    const good = `export async function PATCH(req) {
      const owned = await getOwnedEssay(db, auth.user.id, id);
      await db.from("cc_essays").update({ x: 1 }).eq("id", owned.id);
    }`;
    expect(unscopedWriteHandlers(good)).toEqual([]);
  });

  it("every service-role write in api/cc and api/counselor is ownership-scoped", () => {
    const violations: string[] = [];
    for (const root of ROOTS) {
      for (const file of routeFiles(root)) {
        const source = fs.readFileSync(file, "utf8");
        if (!/createAdmin/.test(source)) continue;
        const rel = file.split(path.sep).join("/");
        for (const method of unscopedWriteHandlers(source)) {
          const key = `${rel} ${method}`;
          if (!ALLOWLIST[key]) violations.push(key);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("every allowlist entry still points at a real route", () => {
    for (const key of Object.keys(ALLOWLIST)) {
      expect(fs.existsSync(key.split(" ")[0])).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run it and confirm it passes on the fixed tree**

Run: `npx vitest run src/app/api/__tests__/ownership-contract.test.ts`
Expected: PASS, 4 tests. (Running `git stash` over Tasks 2-4 would make the third test list the seven original holes; there's no need to do that.)

- [ ] **Step 3: Commit**

```bash
git add src/app/api/__tests__/ownership-contract.test.ts
git commit -m "test(security): static tripwire for unscoped service-role writes

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 6: Verification

**Files:** none changed.

- [ ] **Step 1: Run the full safe unit suite**

Run: `npx vitest run src`
Expected: all green. The count equals the previous baseline (Astra recorded 393 in 43 files) plus this plan's 33 new tests.

- [ ] **Step 2: Typecheck, lint, and build**

Run: `npx tsc --noEmit`, then
`npx eslint src/lib/cc/ownership.ts src/lib/cc/__tests__/helpers src/app/api/cc/courses/route.ts "src/app/api/cc/recommenders/[id]/route.ts" src/app/api/cc/recommenders/ask-email-text/route.ts "src/app/api/cc/essays/[id]/draft/route.ts" "src/app/api/cc/essays/[id]/share/route.ts" "src/app/api/cc/essays/[id]/outline/route.ts" src/app/api/cc/intake/link/route.ts`, then
`npm run build`
Expected: exit 0 for all three.

- [ ] **Step 3: Exercise the real Supabase query chains locally**

The fake can't prove that `.delete().eq().eq().select()` behaves the same against real PostgREST. Local dev points at production data, so use only the QA test accounts, and only calls that are no-ops or rejected.

1. Start the dev server in the background: `npm run dev` (wait for `Ready`).
2. With the gstack `browse` binary, log in at `http://localhost:3000/login` as `bilalhussain.v1+qa-s2@gmail.com` (password pattern in `context-update.md`).
3. Run the following, then confirm it prints `404,404`. The essay id is qa-s1's essay:
   `$B js "Promise.all([fetch('/api/cc/essays/86c5d33e-af71-4b3c-8cd1-a54735830ccd/draft',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:'x'})}).then(r=>r.status), fetch('/api/cc/essays/86c5d33e-af71-4b3c-8cd1-a54735830ccd/share',{method:'POST'}).then(r=>r.status)]).then(s=>s.join(','))"`
4. Confirm `DELETE /api/cc/courses?id=00000000-0000-4000-8000-000000000000` returns `404`.
5. Log out, log in as `+qa-s1`, and confirm `GET /api/cc/essays/86c5d33e-af71-4b3c-8cd1-a54735830ccd` still returns the unchanged 187-word draft.
6. Stop the dev server.

Expected: every status is as stated, and qa-s1's draft is unchanged.

- [ ] **Step 4: Record the result**

Append the evidence (test counts, build exit, the local statuses) to `docs/handoff/claude-progress.md` under "Security 1A" (create the file if it doesn't exist). **Do not deploy.** Production deploy waits for the founder.
