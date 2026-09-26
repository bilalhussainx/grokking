# Fix 2: Broken Saves and Dead Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop four "it said it saved" failures and dead ends a real student hits: recommenders vanish after saving, a transfer student's GPA is discarded, Outline generation fails with a blank 500 after charging a credit, and nav links that point at pages that don't exist.

**Architecture:** Each fix starts from a root cause verified against production (read-only probes, 2026-09-25). The recommenders list sorts by a column production doesn't have. Onboarding deliberately drops the transfer GPA. `callLLMJSON` turns every failure into a silent `null`. Settings and net-price already work on this branch (fixed in `1da0d10`, not yet deployed), so for those this plan only adds a regression tripwire. Tests use the in-memory fake Supabase from Plan 1A, which gains column awareness so it can reproduce "column does not exist" failures.

**Tech Stack:** Next.js 16 route handlers, `@supabase/supabase-js` 2.99, vitest 3.

**Spec:** `docs/design/2026-09-live-audit.md` (QA-27 recommenders, QA-51 transfer GPA, QA-37/41/48 dead routes) and `docs/design/2026-09-product-judgment.md` §2 (the Outline HTTP 500).

## Verified root causes

| Symptom | Root cause (evidence) |
|---|---|
| Recommender saved (200), list empty after reload | `GET /api/cc/recommenders` orders by `created_at`. **Production has no such column** (probe: `42703 column cc_recommenders.created_at does not exist`). The route ignores the error and returns `data \|\| []`. The POST also silently drops `context_notes` (the column exists in production). |
| Transfer GPA lost | `/api/cc/onboarding/complete` receives `transfer.gpa`, then deliberately skips it ("we skip persisting it from onboarding"). Production has `cc_academic_profiles.gpa_unweighted` and `gpa_scale`. |
| Outline generation HTTP 500 | Not reproducible locally: the same essay, prompt, and model generated 3 outlines on 2 of 2 attempts. `callLLMJSON` returns `null` for any upstream error, parse failure, or throw, **logs nothing**, and never retries. The route returns a blank 500 **after deducting a credit**. Master and this branch share this code path. |
| Settings 404, `/cc/net-price` 404 in production | Already fixed on this branch: the sidebar pointed at `/account/settings` on master (fixed to `/settings` in `1da0d10`), and `/cc/net-price` exists only on this branch. Production runs master. **Deploying fixes both.** |

## Global Constraints

- **Never run `npm run test:unit`** (it runs DB fixtures against production). Tests: `npx vitest run <path>`; full: `npx vitest run src`.
- Tests import route modules **statically** at the top of the file (mocks are hoisted).
- No production migration (none needed). No deploy without the founder.
- Explicit `git add` paths. Trailer: `Co-Authored-By: claude-flow <ruv@ruv.net>`.

## Review Focus

1. A recommender list query fails for a new reason. The route returns 500 with a message, **never** an empty list that looks like "you have none" (Task 1 test).
2. The transfer GPA arrives in unusual forms (`"3.5/4.0"`, `"  3.50 "`, `"4.3"`, `"abc"`, `"12"`). Parse the leading number; accept 0 < gpa ≤ 5; anything else is ignored without failing onboarding (Task 2 tests).
3. A student re-runs onboarding. Their existing `cc_academic_profiles` row is updated, not duplicated (Task 2 test).
4. The LLM returns fenced ```` ```json ```` output, or fails transiently (429/5xx). It's parsed and retried once; non-retryable errors (401) are not retried (Task 4 tests).
5. Outline generation fails. The student gets a 503 with a retryable message, and their credit is refunded (Task 4 test).

---

### Task 1: Column-aware fake + recommenders list and save

**Files:**
- Modify: `src/lib/cc/__tests__/helpers/fake-supabase.ts`
- Modify: `src/app/api/cc/recommenders/route.ts`
- Test: `src/app/api/cc/__tests__/recommenders-list.test.ts`

**Interfaces:**
- Produces: `createFakeSupabase(seed?, opts?: { columns?: Record<string, string[]> })`. When `columns[table]` is given, any `eq`/`in`/`is`/`neq`/`order` (and plain `select` list) naming a column outside it returns `{ data: null, error: { message: "column <table>.<col> does not exist", code: "42703" } }`.

- [ ] **Step 1: Write the failing test**

```ts
// src/app/api/cc/__tests__/recommenders-list.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { ALICE, ALICE_PROFILE } from "@/lib/cc/__tests__/helpers/fixtures";
import { GET, POST } from "../recommenders/route";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001" }, supabase: {} }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => h.world,
}));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));

// Production's real cc_recommenders columns (probed 2026-09-25): no created_at.
const REC_COLUMNS = ["id", "student_id", "recommender_type", "name", "subject", "email", "status",
  "brag_sheet_url", "asked_at", "submitted_at", "waiver_signed", "waiver_decision_note",
  "ask_email_text", "reminder_email_text", "context_notes", "relationship"];

beforeEach(() => {
  h.world = createFakeSupabase(
    {
      cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE }],
      cc_recommenders: [
        { id: "r2", student_id: ALICE_PROFILE, name: "Mr. Chen", recommender_type: "teacher", status: "considering" },
        { id: "r1", student_id: ALICE_PROFILE, name: "Ms. Rivera", recommender_type: "teacher", status: "asked" },
      ],
    },
    { columns: { cc_recommenders: REC_COLUMNS } },
  );
});

describe("GET /api/cc/recommenders", () => {
  it("lists the student's recommenders against production's real columns", async () => {
    const res = await GET();
    const json = (await res.json()) as { recommenders: { name: string }[] };
    expect(res.status).toBe(200);
    expect(json.recommenders.map((r) => r.name)).toEqual(["Mr. Chen", "Ms. Rivera"]);
  });

  it("reports a query failure instead of pretending the list is empty", async () => {
    h.world = createFakeSupabase(
      { cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE }], cc_recommenders: [] },
      { columns: { cc_recommenders: ["id"] } }, // student_id missing → the query errors
    );
    const res = await GET();
    expect(res.status).toBe(500);
  });
});

describe("POST /api/cc/recommenders", () => {
  it("saves context notes the student typed", async () => {
    const req = new NextRequest("http://localhost/api/cc/recommenders", {
      method: "POST",
      body: JSON.stringify({ name: "Dr. Okafor", recommender_type: "teacher", context_notes: "AP Bio; led the lab safety project" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const saved = (h.world as FakeSupabase).tables.cc_recommenders.find((r) => r.name === "Dr. Okafor")!;
    expect(saved.context_notes).toBe("AP Bio; led the lab safety project");
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/app/api/cc/__tests__/recommenders-list.test.ts`
Expected: FAIL. The fake doesn't accept a second argument yet, so the list isn't checked against columns. After Step 3 (fake only), the list test gets an empty array (the production symptom), the failure test gets 200, and the context-notes test gets `undefined`.

- [ ] **Step 3: Make the fake column-aware**

In `src/lib/cc/__tests__/helpers/fake-supabase.ts`:

Add a `referenced` list to `FakeQuery` and a `schema` constructor parameter. Record every filtered or ordered column:

```ts
  private referenced: string[] = [];
```

Change the constructor to:

```ts
  constructor(
    private readonly tables: FakeTables,
    private readonly table: string,
    private readonly nextId: () => string,
    private readonly schema: string[] | null = null,
  ) {}
```

In each of `eq`, `neq`, `in`, `is`, add `this.referenced.push(col);` as the first line. Change `order` to:

```ts
  order(col: string, _opts?: unknown): this {
    this.referenced.push(col);
    return this;
  }
```

At the top of `run()`, before any other work:

```ts
    if (this.schema) {
      const unknown = [...this.referenced, ...(this.columns ?? [])].find((c) => !this.schema!.includes(c));
      if (unknown) {
        return { data: null, error: { message: `column ${this.table}.${unknown} does not exist`, code: "42703" } as FakeResult["error"] };
      }
    }
```

Widen the error type: `export type FakeResult = { data: unknown; error: { message: string; code?: string } | null };`

Change `createFakeSupabase`:

```ts
export function createFakeSupabase(
  seed: FakeTables = {},
  opts: { columns?: Record<string, string[]> } = {},
): FakeSupabase {
  const tables: FakeTables = JSON.parse(JSON.stringify(seed)) as FakeTables;
  let n = 0;
  const nextId = () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;
  return {
    tables,
    from: (table: string) => new FakeQuery(tables, table, nextId, opts.columns?.[table] ?? null),
  };
}
```

- [ ] **Step 4: Run the tests and confirm they fail for the production reason**

Run: `npx vitest run src/app/api/cc/__tests__/recommenders-list.test.ts`
Expected: FAIL. The list comes back `[]` (the production symptom), the failure test gets 200, and the context-notes test gets `undefined`.

- [ ] **Step 5: Fix the route**

In `src/app/api/cc/recommenders/route.ts`, replace the GET list query and return with:

```ts
  // cc_recommenders has no created_at in production (probed 2026-09-25);
  // ordering by it errored and the list came back empty. Order by name, and
  // report failures instead of masking them as "no recommenders".
  const { data, error } = await db
    .from("cc_recommenders")
    .select("*")
    .eq("student_id", profile.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("[recommenders GET] query failed:", error.message);
    return NextResponse.json({ error: "Could not load recommenders" }, { status: 500 });
  }
  return NextResponse.json({ recommenders: data ?? [] });
```

In POST's insert object, add after `recommender_type,`:

```ts
      context_notes: context_notes || null,
```

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npx vitest run src/app/api/cc/__tests__/recommenders-list.test.ts src/lib/cc/__tests__/ownership.test.ts src/app/api/cc/__tests__/student-data-ownership.test.ts`
Expected: PASS (the fake change is backward-compatible with the Plan 1A tests).

- [ ] **Step 7: Commit**

```bash
git add src/lib/cc/__tests__/helpers/fake-supabase.ts src/app/api/cc/recommenders/route.ts src/app/api/cc/__tests__/recommenders-list.test.ts
git commit -m "fix(recommenders): list no longer sorts by a column prod lacks; save context notes; surface query errors

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 2: Save the transfer GPA from onboarding

**Files:**
- Modify: `src/app/api/cc/onboarding/complete/route.ts`
- Create: `src/lib/cc/parse-gpa.ts`
- Test: `src/lib/cc/__tests__/parse-gpa.test.ts`, `src/app/api/cc/__tests__/onboarding-transfer-gpa.test.ts`

**Interfaces:**
- Produces: `parseGpa(raw: unknown): number | null`. Takes the leading decimal number, requires `0 < n ≤ 5`, and rounds to 2 places.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/cc/__tests__/parse-gpa.test.ts
import { describe, it, expect } from "vitest";
import { parseGpa } from "../parse-gpa";

describe("parseGpa", () => {
  it.each([
    ["3.50", 3.5], ["  3.50 ", 3.5], ["3.5/4.0", 3.5], ["4.3", 4.3], ["3.456", 3.46], [3.2, 3.2],
  ])("accepts %j as %d", (raw, expected) => expect(parseGpa(raw)).toBe(expected));

  it.each([["abc"], ["12"], ["0"], [""], [null], [undefined], ["-3"]])("rejects %j", (raw) =>
    expect(parseGpa(raw)).toBeNull());
});
```

```ts
// src/app/api/cc/__tests__/onboarding-transfer-gpa.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createFakeSupabase, type FakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { ALICE, ALICE_PROFILE } from "@/lib/cc/__tests__/helpers/fixtures";
import { POST } from "../onboarding/complete/route";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001", user_metadata: {} }, supabase: h.world }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  ensureStudentProfile: async () => ({ id: "a11ce000-1111-4000-8000-000000000001" }),
}));

const world = () => h.world as FakeSupabase;
const transferBody = (gpa: string) => ({
  language: "en",
  role: "tx",
  concerns: [],
  transfer: { currentSchool: "QA Community College", creditsCompleted: 32, targetTerm: "Fall 2027", gpa, reason: "I want a stronger engineering program." },
});
const post = (body: unknown) =>
  new NextRequest("http://localhost/api/cc/onboarding/complete", {
    method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  h.world = createFakeSupabase({
    cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE, preferred_name: "Alice" }],
    cc_academic_profiles: [],
  });
});

describe("POST /api/cc/onboarding/complete — transfer GPA", () => {
  it("saves the transfer student's GPA to their academic profile", async () => {
    const res = await POST(post(transferBody("3.50")));
    expect(res.status).toBe(200);
    expect(world().tables.cc_academic_profiles).toEqual([
      expect.objectContaining({ student_id: ALICE_PROFILE, gpa_unweighted: 3.5, gpa_scale: "4.0" }),
    ]);
  });

  it("updates an existing academic profile instead of duplicating it", async () => {
    world().tables.cc_academic_profiles.push({ id: "ac1", student_id: ALICE_PROFILE, gpa_unweighted: 2.9, gpa_scale: "4.0" });
    await POST(post(transferBody("3.7")));
    expect(world().tables.cc_academic_profiles).toHaveLength(1);
    expect(world().tables.cc_academic_profiles[0].gpa_unweighted).toBe(3.7);
  });

  it("finishes onboarding but saves nothing for an unreadable GPA", async () => {
    const res = await POST(post(transferBody("abc")));
    const json = (await res.json()) as { gpaSaved: boolean };
    expect(res.status).toBe(200);
    expect(json.gpaSaved).toBe(false);
    expect(world().tables.cc_academic_profiles).toHaveLength(0);
  });

  it("never writes a GPA for the high-school path", async () => {
    await POST(post({ language: "en", role: "hs", grade: 11, concerns: [] }));
    expect(world().tables.cc_academic_profiles).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `npx vitest run src/lib/cc/__tests__/parse-gpa.test.ts src/app/api/cc/__tests__/onboarding-transfer-gpa.test.ts`
Expected: FAIL. `../parse-gpa` doesn't resolve, and the route writes no academic row.

- [ ] **Step 3: Implement `parseGpa`**

```ts
// src/lib/cc/parse-gpa.ts
// Onboarding collects GPA as free text ("3.50", "3.5/4.0"). Take the leading
// number and accept only a plausible 4.x/5.0-scale GPA; anything else is
// ignored rather than stored as garbage.
export function parseGpa(raw: unknown): number | null {
  const text = typeof raw === "number" ? String(raw) : typeof raw === "string" ? raw.trim() : "";
  const match = text.match(/^\d+(?:\.\d+)?/);
  if (!match) return null;
  const value = Number(match[0]);
  if (!Number.isFinite(value) || value <= 0 || value > 5) return null;
  return Math.round(value * 100) / 100;
}
```

- [ ] **Step 4: Persist it in the onboarding route**

In `src/app/api/cc/onboarding/complete/route.ts`, add the import:

```ts
import { parseGpa } from "@/lib/cc/parse-gpa";
```

Change `await ensureStudentProfile(auth.supabase, auth.user);` to:

```ts
  const profile = await ensureStudentProfile(auth.supabase, auth.user);
```

Delete the three-line comment `// GPA is stored on cc_academic_profiles separately; we skip persisting …`.

After the `cc_student_profiles` update's error check (the `if (error) { return … 500 }` block) and before the final `return NextResponse.json({ ok: true, …`, add:

```ts
  // A transfer applicant's college GPA is what transfer admissions weighs;
  // onboarding asks for it, so keep it (previously it was discarded).
  let gpaSaved = false;
  const gpa = body.role === "tx" ? parseGpa(body.transfer?.gpa) : null;
  if (gpa !== null) {
    const { data: existing } = await auth.supabase
      .from("cc_academic_profiles")
      .select("id")
      .eq("student_id", profile.id)
      .limit(1)
      .maybeSingle<{ id: string }>();
    const { error: gpaError } = existing
      ? await auth.supabase.from("cc_academic_profiles").update({ gpa_unweighted: gpa }).eq("id", existing.id)
      : await auth.supabase.from("cc_academic_profiles").insert({ student_id: profile.id, gpa_unweighted: gpa, gpa_scale: "4.0" });
    if (gpaError) console.error("[onboarding] transfer GPA save failed:", gpaError.message);
    gpaSaved = !gpaError;
  }
```

In the final response object, add `gpaSaved,` after `ok: true,`.

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `npx vitest run src/lib/cc/__tests__/parse-gpa.test.ts src/app/api/cc/__tests__/onboarding-transfer-gpa.test.ts`
Expected: PASS, 17 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/cc/parse-gpa.ts src/lib/cc/__tests__/parse-gpa.test.ts src/app/api/cc/onboarding/complete/route.ts src/app/api/cc/__tests__/onboarding-transfer-gpa.test.ts
git commit -m "fix(onboarding): save the transfer student's GPA instead of discarding it

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 3: Nav links must point at real pages

**Files:**
- Test: `src/components/nav/__tests__/nav-links.test.ts`

- [ ] **Step 1: Write the test**

```ts
// src/components/nav/__tests__/nav-links.test.ts
// Every sidebar and command-palette destination must be a real page. Master
// shipped "Settings" → /account/settings, which 404'd in production.
import { describe, it, expect } from "vitest";
import fs from "node:fs";

const SOURCES = ["src/components/nav/sidebar-data.ts", "src/components/nav/palette-data.ts"];

function pageExists(href: string): boolean {
  const path = href.split(/[?#]/)[0];
  const file = path === "/" ? "src/app/page.tsx" : `src/app${path}/page.tsx`;
  return fs.existsSync(file);
}

function internalHrefs(source: string): string[] {
  return [...source.matchAll(/href:\s*"([^"]+)"/g)]
    .map((m) => m[1])
    .filter((h) => h.startsWith("/"));
}

describe("nav destinations", () => {
  it("flags a destination with no page", () => {
    expect(pageExists("/account/settings")).toBe(false);
  });

  it("every sidebar and palette href resolves to a page", () => {
    const missing = SOURCES.flatMap((file) => internalHrefs(fs.readFileSync(file, "utf8"))).filter((h) => !pageExists(h));
    expect(missing).toEqual([]);
  });
});
```

- [ ] **Step 2: Prove it catches the production bug**

Run: `git show master:src/components/nav/sidebar-data.ts | grep -c 'href: "/account/settings"'`
Expected: `2`. Master would fail the second test; this branch passes.

Run: `npx vitest run src/components/nav/__tests__/nav-links.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 3: Commit**

```bash
git add src/components/nav/__tests__/nav-links.test.ts
git commit -m "test(nav): every sidebar/palette destination must be a real page

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 4: Outline generation fails loudly, retries once, and refunds

**Files:**
- Modify: `src/lib/cc/llm-stream.ts` (`callLLMJSON`, plus a new `extractJsonObject`)
- Modify: `src/app/api/cc/essays/[id]/outline/route.ts` (the generate-failure branch)
- Test: `src/lib/cc/__tests__/llm-json.test.ts`, `src/app/api/cc/essays/__tests__/outline-generate.test.ts`

**Interfaces:**
- Produces: `extractJsonObject<T>(text: string): T | null`, and `callLLMJSON(messages, opts?: { temperature?; maxTokens?; label?: string })`. The signature is unchanged apart from the optional `label`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/cc/__tests__/llm-json.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.hoisted(() => {
  process.env.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "test-key";
});

import { callLLMJSON, extractJsonObject } from "../llm-stream";

const reply = (content: string, status = 200) =>
  new Response(JSON.stringify({ choices: [{ message: { content }, finish_reason: "stop" }] }), { status });

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("extractJsonObject", () => {
  it("parses fenced JSON", () => {
    expect(extractJsonObject<{ a: number }>('```json\n{"a": 1}\n```')).toEqual({ a: 1 });
  });
  it("returns null for truncated JSON", () => {
    expect(extractJsonObject('{"outlines": [{"title": "A"')).toBeNull();
  });
});

describe("callLLMJSON", () => {
  const msgs = [{ role: "user" as const, content: "hi" }];

  it("asks the provider for a JSON object", async () => {
    fetchMock.mockResolvedValueOnce(reply('{"ok": true}'));
    await callLLMJSON(msgs);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.response_format).toEqual({ type: "json_object" });
  });

  it("retries once after a transient provider error", async () => {
    fetchMock.mockResolvedValueOnce(new Response("busy", { status: 503 })).mockResolvedValueOnce(reply('{"ok": true}'));
    expect(await callLLMJSON<{ ok: boolean }>(msgs)).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries once after unparseable output, then gives up and logs why", async () => {
    fetchMock.mockResolvedValue(reply("sorry, here is prose"));
    expect(await callLLMJSON(msgs, { label: "outline" })).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("outline"));
  });

  it("does not retry a non-transient error", async () => {
    fetchMock.mockResolvedValueOnce(new Response("no", { status: 401 }));
    expect(await callLLMJSON(msgs)).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
```

```ts
// src/app/api/cc/essays/__tests__/outline-generate.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../[id]/outline/route";

const h = vi.hoisted(() => ({
  result: null as unknown,
  refunds: [] as unknown[][],
}));

vi.mock("../../helpers", () => ({
  requireAuth: async () => ({ user: { id: "a11ce000-0000-4000-8000-000000000001" }, supabase: {} }),
  unauthorized: () => new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
  createAdminSupabase: () => ({ from: () => ({ update: () => ({ eq: async () => ({ error: null }) }) }) }),
}));
vi.mock("@/lib/credits", () => ({
  CREDIT_COSTS: { coach_text: 1 },
  deductCredits: async () => true,
  addCredits: async (...args: unknown[]) => { h.refunds.push(args); return 0; },
}));
vi.mock("@/lib/cc/essay-helpers", () => ({
  buildEssayContext: async () => ({ brainstormTranscript: [], wordLimit: 650 }),
  getOutlineSystemPrompt: () => "system",
}));
vi.mock("@/lib/cc/llm-stream", () => ({ callLLMJSON: async () => h.result }));

const ESSAY = "a11ce000-2222-4000-8000-000000000001";
const generate = () =>
  POST(
    new NextRequest(`http://localhost/api/cc/essays/${ESSAY}/outline`, {
      method: "POST", body: JSON.stringify({ action: "generate" }), headers: { "Content-Type": "application/json" },
    }),
    { params: Promise.resolve({ id: ESSAY }) },
  );

beforeEach(() => {
  h.result = null;
  h.refunds = [];
});

describe("POST outline (generate) failure handling", () => {
  it("returns a retryable 503 and refunds the credit when generation fails", async () => {
    const res = await generate();
    const json = (await res.json()) as { error: string; retryable: boolean };
    expect(res.status).toBe(503);
    expect(json.retryable).toBe(true);
    expect(json.error).toMatch(/try again/i);
    expect(h.refunds).toEqual([["a11ce000-0000-4000-8000-000000000001", 1, "essay_outline_refund"]]);
  });

  it("returns the outlines when generation succeeds", async () => {
    h.result = { outlines: [{ title: "A" }, { title: "B" }, { title: "C" }] };
    const res = await generate();
    expect(res.status).toBe(200);
    expect(h.refunds).toEqual([]);
  });
});
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `npx vitest run src/lib/cc/__tests__/llm-json.test.ts src/app/api/cc/essays/__tests__/outline-generate.test.ts`
Expected: FAIL. `extractJsonObject` isn't exported, there's no `response_format`, no retry, and the route returns 500 without a refund.

- [ ] **Step 3: Harden `callLLMJSON`**

In `src/lib/cc/llm-stream.ts`, replace the whole `callLLMJSON` function with:

```ts
// Extract one JSON object from model output: tolerates ```json fences and
// leading/trailing prose; returns null for truncated or invalid JSON.
export function extractJsonObject<T>(text: string): T | null {
  const unfenced = text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(unfenced.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

// One JSON-object completion. Retries once on transient failures (429/5xx,
// network errors, unparseable output) and logs every failure reason; before
// this, every failure became a silent null and a blank 500 upstream.
export async function callLLMJSON<T>(
  messages: ChatMessage[],
  opts?: { temperature?: number; maxTokens?: number; label?: string }
): Promise<T | null> {
  const temp = opts?.temperature ?? 0.3;
  const maxTokens = opts?.maxTokens ?? 1500;
  const apiKey = OPENROUTER_API_KEY || MOONSHOT_API_KEY;
  const apiUrl = OPENROUTER_API_KEY ? OPENROUTER_URL : MOONSHOT_URL;
  const model = OPENROUTER_API_KEY ? "openai/gpt-4o-mini" : MOONSHOT_MODEL;
  const tag = `[callLLMJSON${opts?.label ? `:${opts.label}` : ""}]`;

  if (!apiKey) {
    console.error(`${tag} no LLM API key configured`);
    return null;
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          ...(OPENROUTER_API_KEY ? { "HTTP-Referer": "https://kairoslearn.com" } : {}),
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: temp,
          max_tokens: maxTokens,
          ...(OPENROUTER_API_KEY ? { response_format: { type: "json_object" } } : {}),
        }),
      });
      if (!resp.ok) {
        console.error(`${tag} attempt ${attempt}: HTTP ${resp.status}`);
        if (resp.status === 429 || resp.status >= 500) continue;
        return null;
      }
      const data = await resp.json();
      const text: string = data.choices?.[0]?.message?.content || "";
      const parsed = extractJsonObject<T>(text);
      if (parsed !== null) return parsed;
      console.error(
        `${tag} attempt ${attempt}: unparseable output (finish=${data.choices?.[0]?.finish_reason}, chars=${text.length})`,
      );
    } catch (err) {
      console.error(`${tag} attempt ${attempt}: ${String(err).slice(0, 200)}`);
    }
  }
  return null;
}
```

- [ ] **Step 4: Return 503 and refund in the outline route**

In `src/app/api/cc/essays/[id]/outline/route.ts`, change the credits import to:

```ts
import { deductCredits, addCredits, CREDIT_COSTS } from "@/lib/credits";
```

Pass a label: change `callLLMJSON<{ outlines: unknown[] }>(messages, { maxTokens: 4500 })` to
`callLLMJSON<{ outlines: unknown[] }>(messages, { maxTokens: 4500, label: "outline" })`.

Replace the failure return:

```ts
  if (!result?.outlines || !Array.isArray(result.outlines) || result.outlines.length === 0) {
    return NextResponse.json({ error: "Failed to generate outlines" }, { status: 500 });
  }
```

with:

```ts
  if (!result?.outlines || !Array.isArray(result.outlines) || result.outlines.length === 0) {
    // The student was charged before the model call; don't keep the credit
    // for a failed generation. callLLMJSON has already logged why it failed.
    await addCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_outline_refund");
    return NextResponse.json(
      {
        error: "Outline generation is temporarily unavailable. Your credit was refunded; please try again in a moment.",
        retryable: true,
      },
      { status: 503 },
    );
  }
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `npx vitest run src/lib/cc/__tests__/llm-json.test.ts src/app/api/cc/essays/__tests__/outline-generate.test.ts src/app/api/cc/essays/__tests__/ownership-routes.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/cc/llm-stream.ts "src/app/api/cc/essays/[id]/outline/route.ts" src/lib/cc/__tests__/llm-json.test.ts src/app/api/cc/essays/__tests__/outline-generate.test.ts
git commit -m "fix(essays): outline generation retries once, logs why it failed, refunds the credit, returns a retryable 503

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 5: Verification

- [ ] **Step 1:** `npx vitest run src`, then `npx tsc --noEmit`, then `npm run build`. All exit 0.
- [ ] **Step 2: Live local check (QA accounts only).**
  - Run `npm run dev`. As `bilalhussain.v1+qa-s2@gmail.com`, `GET /api/cc/recommenders` → `200` with a JSON array. Before this fix it returned an empty array regardless, because of the 42703 error.
  - As the owner of essay `5f59f59f-c978-4eab-9d9d-11e16d2eb165` (see `work-diary/login-existing-persona.ps1`), or any QA essay with a brainstorm, `POST …/outline {action:"generate"}` → `200` with 3 outlines.
  - Stop the server.
- [ ] **Step 3:** Record the evidence in `docs/handoff/claude-progress.md` under "Fix 2". State plainly that **Settings and `/cc/net-price` need a deploy of this branch**, and that the production Outline failure's root cause will show in Vercel logs as `[callLLMJSON:outline] …` after deploy. **Do not deploy.**
