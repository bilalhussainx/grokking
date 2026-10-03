# Agent Slice S1: Student-Visible Agency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give flagged pilot students a Coach Kairos that reads their real plan through tools and proposes concrete actions they confirm with one tap. These are tasks, calendar holds and school additions. It also opens with what it noticed (plan conflicts, stalled essays, inactivity) and shows a log of what it did and why.

**Architecture:**
- This builds on agent slice A1, which must be executed first: contracts, read tools, provider, bounded loop with full-output holdback, and SSE.
- S1 adds:
  - four journey read tools over existing deterministic engines;
  - three *proposal* tools that only write pending rows;
  - a confirm/decline/undo API that commits through narrow domain adapters with a server-issued 10-minute confirmation token;
  - a flagged `/api/cc/agent/turn` route with a client operation key;
  - a date-grounding output check;
  - a daily deterministic trigger cron;
  - an inbox and activity log;
  - three small UI surfaces;
  - a 40-case golden-set scorer.
- The essay-intent path is untouched. Essay turns keep using the existing Coach until slice B's semantic checker ships.

**Tech Stack:** Next.js 16.1.6 App Router, React 19, TypeScript strict, Supabase (service-role server client plus RLS read policies), `pg` (already a dependency) for local-Postgres schema tests, vitest 4, OpenRouter via the A1 provider.

**Spec:**
- `docs/superpowers/specs/2026-09-25-counselor-agent-design.md`: §3 authorization, §4 tool catalog and confirm semantics, §5 JourneyState ordering, §10.1–10.2 stream and bounds, §11.3 rollout.
- The founder's 2026-10-03 decision reorders D2: a student-visible S1 runs after A1 and before A2/B. It exposes no essay generation, so B's checker is not a prerequisite.
- Gap analysis: `docs/strategy/2026-10-03-agentic-counselor-gap-analysis.md` §3–§5.
- UI contract: `docs/design/2026-10-03-amendment-c-step-clarity.md`, rules C4, C8 and C11. Astra's D4.3 will restyle these components later without changing their props.

## Global Constraints

- **Prerequisite:** `docs/superpowers/plans/2026-09-25-agent-slice-a1-tools-stream.md` Tasks 1–8 are complete and green on this branch. These files must exist:
  - `src/lib/cc/agent/contracts.ts`
  - `read-tools.ts`
  - `provider.ts`
  - `loop.ts`
  - `sse.ts`
  - `vitest.agent-source.config.ts`

  If any is missing, stop. Do not re-implement A1 inside S1.
- **Never run `npm run test:unit`.** It runs fixtures against production. Every command uses `npx vitest run --config vitest.agent-source.config.ts <path>`. New agent test files begin with `// @vitest-environment node`, except the UI tests, which use jsdom.
- **Local Postgres only for real-database tests.** Task 1 runs SQL against a disposable Docker `postgres:16` container. If Docker is unavailable, stop for a founder decision. Never run S1 migrations against production. Applying `20261003_agent_s1.sql` to production is a controller step after founder approval, outside this plan.
- **The server derives scope:** `AuthScope = { userId, profileIds }` comes from `getAuthUser()` plus `getStudentProfileIds()` (`src/lib/cc/ownership.ts`). The model never supplies a user, student, profile, proposal or school-list-row ID that the server trusts without re-checking ownership.
- **Proposals, never silent writes.** Tools insert only `cc_agent_proposals` rows with `status='pending'`. Domain tables (`cc_tasks`, `cc_student_schools`) change only in the confirm endpoint, after token verification, in one conditional update `pending → committed`.
- **Confirmation tokens:**
  - HMAC-SHA256 with `AGENT_CONFIRM_SECRET`, over `proposalId|userId|payloadHash|tokenExpiresAtMs`.
  - Expiry: 10 minutes.
  - A missing secret fails closed (confirm returns 503 `agent_disabled`).
- **Idempotency:** turns are unique on `(user_id, operation_key)`. The same key and same input hash returns the stored result; the same key with a different hash returns 409 `operation_key_conflict` before any provider call. Proposals are unique on `(user_id, operation_key)`. Nudges are unique on `(student_id, trigger, entity_key, period_key)`.
- **Flag and allowlist:** the agent runs only when `AGENT_S1_ENABLED === "1"` and the user's ID is in `AGENT_S1_USER_IDS` (comma-separated). Otherwise every S1 route returns 404 `not_enabled`, and Today shows nothing new.
- **Zero charge:** S1 deducts no credits, per D2 amendment 3. It still enforces the existing `coachMessagesPerDay` cap through `assertCapacity` (`src/lib/cc/tier-gate.ts`). One S1 turn counts as one message.
- **One writer:** for a flagged user, the legacy Coach message route must not run the `<<actions>>` add-schools parser or `runCoachExtraction` writes. Task 4 pins this.
- **Grounded dates (C8):** a date may appear in student-visible S1 text only if it appears verbatim in this turn's tool evidence. Catalog deadlines are always labelled `unverified_last_cycle`. Nothing shows a countdown to an unverified date.
- **No essay prose:** S1 refuses essay-writing intent with a fixed message and a link to Essay Studio. Detect it with the existing `detectCoachMode` essay mode plus the writing-request regex in Task 4.
- **No new packages.** Use native `crypto`, `fetch` and existing dependencies.
- **Explicit-path commits only,** with the trailer `Co-Authored-By: claude-flow <ruv@ruv.net>`.

## Review Focus

1. **A confirm replayed after a slow network commits twice.** For example, two `cc_tasks` rows, or a school added twice. Pinned by `confirm_twice_returns_same_receipt_and_one_row` in Task 3.
2. **A proposal's payload is edited between preview and confirm.** For example, a different `school_id`, or another student's profile. Pinned by `token_for_original_payload_rejects_mutated_row` and `confirm_rejects_proposal_owned_by_other_user` in Task 3.
3. **A model sentence states a deadline we never verified.** Example: "MIT EA is Nov 1". Pinned by `strips_dates_absent_from_evidence` and `keeps_task_due_dates_from_tool_evidence` in Task 4.
4. **The daily cron re-nudges the same stalled essay every day, or nudges a student who isn't flagged.** Pinned by `second_run_same_day_inserts_nothing` and `unflagged_students_never_nudged` in Task 5.
5. **Duplicate student profiles (no unique `user_id`) split a student's schools across two profiles, so a conflict or stall is missed.** Pinned by `reads_all_owned_profiles_for_conflicts` in Task 2.

---

## File Structure

| File | Responsibility |
|---|---|
| `supabase/migrations/20261003_agent_s1.sql` | Four additive tables and RLS read policies |
| `src/lib/cc/agent/__tests__/s1-schema.pg.test.ts` | Real constraint tests on local Postgres |
| `src/lib/cc/agent/s1-flag.ts` | `isAgentS1User`, `agentScopeForRequest` |
| `src/lib/cc/agent/journey-tools.ts` | `get_journey_state`, `list_my_schools`, `check_plan_conflicts`, `get_essay_status` |
| `src/lib/cc/agent/proposals.ts` | Proposal tools, token sign/verify, commit/decline/undo adapters |
| `src/lib/cc/agent/s1-tools.ts` | Combined definitions, validator and dispatcher (A1 + S1) |
| `src/lib/cc/agent/date-check.ts` | `redactUngroundedDates` (pre-check) and `echoCheck` |
| `src/lib/cc/agent/s1-turn.ts` | Turn orchestration: operation key, run, persist events |
| `src/app/api/cc/agent/turn/route.ts` | SSE turn endpoint |
| `src/app/api/cc/agent/proposals/[id]/route.ts` | `POST {action: confirm|decline|undo}` |
| `src/app/api/cc/agent/inbox/route.ts` | Open nudges plus pending proposals with fresh tokens |
| `src/app/api/cc/agent/activity/route.ts` | The student's own event log |
| `src/app/api/cc/agent/nudges/[id]/route.ts` | Snooze or dismiss |
| `src/lib/cc/agent/triggers.ts` | Pure trigger evaluation |
| `src/app/api/cron/agent-nudges/route.ts` | Daily cron, plus its `vercel.json` entry |
| `src/components/cc/agent/ProposalCard.tsx`, `KairosInbox.tsx`, `ActivityLog.tsx`, `agent.css` | UI |
| `src/lib/cc/agent/golden/score.ts`, `golden/seed-40.json`, `scripts/agent-golden-run.ts` | Golden-set harness |

---

### Task 1: S1 schema and local-Postgres constraint tests

**Files:**
- Create: `supabase/migrations/20261003_agent_s1.sql`
- Test: `src/lib/cc/agent/__tests__/s1-schema.pg.test.ts`

**Interfaces:**
- Consumes: the Docker engine (A1 Task 1 preflight), and `pg` from `package.json`.
- Produces the tables `cc_agent_turns`, `cc_agent_events`, `cc_agent_proposals` and `cc_agent_nudges`, with the columns exactly as in the SQL below. Every later task uses these names.

- [ ] **Step 1: Start a disposable local Postgres** (PowerShell or Git Bash):

```bash
docker run -d --rm --name kairos-agent-pg -e POSTGRES_PASSWORD=agent -p 55432:5432 postgres:16
```

Expected: a container ID. If `docker` errors, stop and report it to the controller.

- [ ] **Step 2: Write the failing test**

```ts
// @vitest-environment node
// src/lib/cc/agent/__tests__/s1-schema.pg.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

const URL = process.env.AGENT_PG_URL;
const run = URL ? describe : describe.skip;
const SQL = path.join(process.cwd(), "supabase/migrations/20261003_agent_s1.sql");
const STUBS = `
  drop schema if exists auth cascade; create schema auth;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.uid', true), '')::uuid $$;
  drop table if exists cc_student_profiles cascade;
  create table cc_student_profiles (id uuid primary key, user_id uuid not null);
  insert into cc_student_profiles values ('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
`;
const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const S = "11111111-1111-4111-8111-111111111111";

run("S1 schema (local Postgres only)", () => {
  const db = new Client({ connectionString: URL });
  beforeAll(async () => {
    await db.connect();
    await db.query("drop table if exists cc_agent_events, cc_agent_proposals, cc_agent_nudges, cc_agent_turns cascade");
    await db.query(STUBS);
    await db.query(fs.readFileSync(SQL, "utf8"));
  });
  afterAll(async () => { await db.end(); });

  it("rejects a second turn with the same user and operation key", async () => {
    await db.query("insert into cc_agent_turns (user_id, operation_key, input_hash) values ($1,'op-key-0001','h1')", [U]);
    await expect(db.query("insert into cc_agent_turns (user_id, operation_key, input_hash) values ($1,'op-key-0001','h2')", [U]))
      .rejects.toThrow(/duplicate key/);
  });

  it("rejects an unknown proposal kind and status", async () => {
    await expect(db.query(
      "insert into cc_agent_proposals (user_id, student_id, kind, payload, payload_hash, operation_key, reason, expires_at) values ($1,$2,'email','{}','h','op-1','r', now())",
      [U, S])).rejects.toThrow(/check constraint/);
  });

  it("dedupes nudges per student, trigger, entity and period", async () => {
    const q = "insert into cc_agent_nudges (user_id, student_id, trigger, entity_key, period_key, reason) values ($1,$2,'essay_stall','essay:1','2026-W40','{}') on conflict do nothing returning id";
    expect((await db.query(q, [U, S])).rowCount).toBe(1);
    expect((await db.query(q, [U, S])).rowCount).toBe(0);
  });

  it("enables row level security on every S1 table", async () => {
    const r = await db.query("select relname, relrowsecurity from pg_class where relname like 'cc_agent_%' and relkind = 'r' order by relname");
    expect(r.rows.map((x) => [x.relname, x.relrowsecurity])).toEqual([
      ["cc_agent_events", true], ["cc_agent_nudges", true], ["cc_agent_proposals", true], ["cc_agent_turns", true],
    ]);
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `AGENT_PG_URL=postgres://postgres:agent@localhost:55432/postgres npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/s1-schema.pg.test.ts`

In PowerShell, set the variable first: `$env:AGENT_PG_URL="postgres://postgres:agent@localhost:55432/postgres"`.

Expected: FAIL with `ENOENT ... 20261003_agent_s1.sql`.

- [ ] **Step 4: Write the migration**

```sql
-- supabase/migrations/20261003_agent_s1.sql
-- Agent slice S1: turns, events, proposals and nudges. Additive only.
-- Writes happen through the service-role server client; students may read their own rows.

create table if not exists cc_agent_turns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  operation_key text not null check (char_length(operation_key) between 8 and 128),
  input_hash text not null,
  status text not null default 'running' check (status in ('running','completed','failed')),
  result jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, operation_key)
);

create table if not exists cc_agent_events (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  turn_id uuid references cc_agent_turns(id) on delete cascade,
  seq int not null default 0,
  type text not null check (type in ('turn.accepted','tool.completed','action.preview','action.committed','action.declined','action.undone','nudge.created','turn.completed','turn.failed')),
  label text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (turn_id, seq)
);
create index if not exists idx_cc_agent_events_user on cc_agent_events(user_id, created_at desc);

create table if not exists cc_agent_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  student_id uuid not null references cc_student_profiles(id) on delete cascade,
  turn_id uuid references cc_agent_turns(id) on delete set null,
  nudge_id uuid,
  kind text not null check (kind in ('task','calendar_hold','add_schools')),
  payload jsonb not null,
  payload_hash text not null,
  operation_key text not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending','committed','declined','expired','undone')),
  receipt jsonb,
  expires_at timestamptz not null,
  committed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, operation_key)
);
create index if not exists idx_cc_agent_proposals_user on cc_agent_proposals(user_id, status);

create table if not exists cc_agent_nudges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  student_id uuid not null references cc_student_profiles(id) on delete cascade,
  trigger text not null check (trigger in ('plan_conflict','essay_stall','inactivity')),
  entity_key text not null,
  period_key text not null,
  reason jsonb not null,
  status text not null default 'open' check (status in ('open','snoozed','dismissed','done')),
  snoozed_until date,
  created_at timestamptz not null default now(),
  unique (student_id, trigger, entity_key, period_key)
);

alter table cc_agent_turns enable row level security;
alter table cc_agent_events enable row level security;
alter table cc_agent_proposals enable row level security;
alter table cc_agent_nudges enable row level security;
create policy cc_agent_turns_read_own on cc_agent_turns for select using (user_id = auth.uid());
create policy cc_agent_events_read_own on cc_agent_events for select using (user_id = auth.uid());
create policy cc_agent_proposals_read_own on cc_agent_proposals for select using (user_id = auth.uid());
create policy cc_agent_nudges_read_own on cc_agent_nudges for select using (user_id = auth.uid());
```

- [ ] **Step 5: Run the test to verify it passes**

Run the Step 3 command again. Expected: 4 passed.

- [ ] **Step 6: Commit and stop the container**

```bash
git add supabase/migrations/20261003_agent_s1.sql src/lib/cc/agent/__tests__/s1-schema.pg.test.ts
git commit -m "feat(agent-s1): schema for turns, events, proposals and nudges" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
docker stop kairos-agent-pg
```

---

### Task 2: Flag, scope and journey read tools

**Files:**
- Create: `src/lib/cc/agent/s1-flag.ts`, `src/lib/cc/agent/journey-tools.ts`
- Test: `src/lib/cc/agent/__tests__/journey-tools.test.ts`

**Interfaces:**
- Consumes:
  - `AuthScope`, `ToolReply` and `Json` from `contracts.ts` (A1);
  - `checkREAConflict(schools: {schoolName:string; plan:string|null}[]): REAConflict` from `src/lib/applications/ed-strategy.ts`. It accepts catalog names since `819be76`;
  - `selectVariant(profile:{is_transfer_student:boolean|null; grade_level:number|null}, schools:{application_status:string|null}[]): VariantKey` from `src/app/cc/dashboard/variants.ts`;
  - `getStudentProfileIds(db, userId): Promise<string[]>` from `src/lib/cc/ownership.ts`.
- Produces:

  ```ts
  // s1-flag.ts
  export function isAgentS1User(userId: string, env?: Record<string, string | undefined>): boolean;
  // journey-tools.ts
  export type JourneyToolName = "get_journey_state" | "list_my_schools" | "check_plan_conflicts" | "get_essay_status";
  export type NextAction = { id: string; reasonCode: "resolve_plan_conflict" | "revise_after_review" | "complete_task" | "stage_default"; title: string; entityId: string | null; dueDate: string | null; dueDateSource: "student_task" | "counselor_task" | null };
  export function makeJourneyTools(db: SupabaseClient, scope: AuthScope, now: Date): (name: JourneyToolName, args: Record<string, never>) => Promise<ToolReply>;
  export const JOURNEY_TOOL_DEFINITIONS: readonly { type: "function"; function: { name: JourneyToolName; description: string; parameters: object } }[];
  ```

- [ ] **Step 1: Write the failing test**

```ts
// @vitest-environment node
// src/lib/cc/agent/__tests__/journey-tools.test.ts
import { describe, it, expect } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { makeJourneyTools } from "../journey-tools";
import { isAgentS1User } from "../s1-flag";
import type { SupabaseClient } from "@supabase/supabase-js";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P1 = "11111111-1111-4111-8111-111111111111";
const P2 = "22222222-2222-4222-8222-222222222222";
const OTHER = "99999999-9999-4999-8999-999999999999";
const now = new Date("2026-10-20T12:00:00Z");
const seed = () => createFakeSupabase({
  cc_student_profiles: [
    { id: P1, user_id: U, grade_level: 12, is_transfer_student: false },
    { id: P2, user_id: U, grade_level: 12, is_transfer_student: false },
    { id: OTHER, user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", grade_level: 11, is_transfer_student: false },
  ],
  cc_schools: [
    { id: "s-harvard", name: "Harvard University", country: "US", regular_deadline: "Jan 1" },
    { id: "s-nw", name: "Northwestern University", country: "US", regular_deadline: "Jan 2" },
  ],
  cc_student_schools: [
    { id: "ss1", student_id: P1, school_id: "s-harvard", application_plan: "REA", application_status: "considering", tier: null },
    { id: "ss2", student_id: P2, school_id: "s-nw", application_plan: "EA", application_status: "considering", tier: null },
    { id: "ss3", student_id: OTHER, school_id: "s-nw", application_plan: "ED", application_status: "considering", tier: null },
  ],
  cc_essays: [
    { id: "e1", student_id: P1, essay_type: "personal_statement", phase: "revise", word_count: 420, word_limit: 650, counselor_review_state: "changes_requested", updated_at: "2026-10-05T00:00:00Z" },
  ],
  cc_tasks: [
    { id: "t1", student_id: P1, title: "Ask Ms. Lee for a recommendation", due_date: "2026-10-25", status: "pending", task_type: "counselor" },
  ],
}) as unknown as SupabaseClient;
const scope = { userId: U, profileIds: [P1, P2] } as const;

describe("journey tools", () => {
  it("reads_all_owned_profiles_for_conflicts", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("check_plan_conflicts", {});
    expect(r.status).toBe("ok");
    expect(r.data).toMatchObject({ conflict: true, reaSchool: "Harvard University", conflictingSchools: ["Northwestern University"] });
  });

  it("never reads another student's schools", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("list_my_schools", {});
    expect(JSON.stringify(r.data)).not.toContain("ss3");
  });

  it("labels catalog deadlines as unverified last-cycle values", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("list_my_schools", {});
    const schools = (r.data as { schools: { deadline: { value: string; status: string } }[] }).schools;
    expect(schools.every((s) => s.deadline.status === "unverified_last_cycle")).toBe(true);
  });

  it("orders next actions: conflict, then review revision, then dated task", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("get_journey_state", {});
    const actions = (r.data as { nextActions: { reasonCode: string; dueDate: string | null }[] }).nextActions;
    expect(actions.map((a) => a.reasonCode)).toEqual(["resolve_plan_conflict", "revise_after_review", "complete_task"]);
    expect(actions[2].dueDate).toBe("2026-10-25");
    expect(r.evidence).toContainEqual(expect.objectContaining({ kind: "task_due_date", value: "2026-10-25" }));
  });

  it("reports essay stall days without exposing draft text", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("get_essay_status", {});
    const e = (r.data as { essays: Record<string, unknown>[] }).essays[0];
    expect(e).toMatchObject({ id: "e1", daysSinceUpdate: 15, reviewState: "changes_requested" });
    expect(e).not.toHaveProperty("current_draft");
  });

  it("returns unknown, not an empty success, when the student has no profile", async () => {
    const r = await makeJourneyTools(seed(), { userId: U, profileIds: [] }, now)("get_journey_state", {});
    expect(r.status).toBe("unknown");
  });

  it("flag requires both the switch and the allowlist", () => {
    expect(isAgentS1User(U, { AGENT_S1_ENABLED: "1", AGENT_S1_USER_IDS: `x, ${U}` })).toBe(true);
    expect(isAgentS1User(U, { AGENT_S1_ENABLED: "0", AGENT_S1_USER_IDS: U })).toBe(false);
    expect(isAgentS1User(U, { AGENT_S1_ENABLED: "1", AGENT_S1_USER_IDS: "" })).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/journey-tools.test.ts`

Expected: FAIL with `Cannot find module '../journey-tools'`.

- [ ] **Step 3: Implement**

```ts
// src/lib/cc/agent/s1-flag.ts
export function isAgentS1User(userId: string, env: Record<string, string | undefined> = process.env): boolean {
  if (env.AGENT_S1_ENABLED !== "1") return false;
  const ids = (env.AGENT_S1_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return ids.includes(userId);
}
```

```ts
// src/lib/cc/agent/journey-tools.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import { checkREAConflict } from "@/lib/applications/ed-strategy";
import { selectVariant } from "@/app/cc/dashboard/variants";
import type { AuthScope, Json, ToolReply } from "./contracts";
// ed-strategy accepts catalog spellings ("Harvard University") since commit 819be76.

export type JourneyToolName = "get_journey_state" | "list_my_schools" | "check_plan_conflicts" | "get_essay_status";
export type NextAction = {
  id: string;
  reasonCode: "resolve_plan_conflict" | "revise_after_review" | "complete_task" | "stage_default";
  title: string;
  entityId: string | null;
  dueDate: string | null;
  dueDateSource: "student_task" | "counselor_task" | null;
};

const empty = { type: "object", properties: {}, additionalProperties: false } as const;
export const JOURNEY_TOOL_DEFINITIONS = [
  { type: "function", function: { name: "get_journey_state", description: "The student's stage and up to three next actions, in a fixed order. Dates only from the student's own tasks.", parameters: empty } },
  { type: "function", function: { name: "list_my_schools", description: "The student's school list with plans and statuses. Catalog deadlines are unverified last-cycle values.", parameters: empty } },
  { type: "function", function: { name: "check_plan_conflicts", description: "Checks REA/ED/EA combinations on the student's list.", parameters: empty } },
  { type: "function", function: { name: "get_essay_status", description: "Essay phases, word counts, review state and days since last edit. No draft text.", parameters: empty } },
] as const;

const STAGE_DEFAULT: Record<string, string> = {
  g9: "Pick one interest to explore this month",
  g10: "Keep going with one activity you chose",
  junior: "Build your school list to at least 5 schools",
  senior_writing: "Work on your most important essay",
  senior_post_submit: "Check each application portal for missing items",
  senior_decisions: "Compare your offers side by side",
  transfer: "Confirm your target schools' transfer requirements",
  unknown: "Tell Kairos your grade so it can plan with you",
};

type Row = Record<string, unknown>;
const failed = (): ToolReply => ({ status: "retryable_error", data: null, evidence: [] });
const unknown = (reason: string): ToolReply => ({ status: "unknown", data: { reason }, evidence: [] });

export function makeJourneyTools(db: SupabaseClient, scope: AuthScope, now: Date) {
  const ids = [...scope.profileIds];

  async function rows(table: string, cols: string, col = "student_id"): Promise<Row[] | null> {
    const { data, error } = await db.from(table).select(cols).in(col, ids);
    return error ? null : ((data ?? []) as Row[]);
  }

  async function schools() {
    const list = await rows("cc_student_schools", "id,student_id,school_id,application_plan,application_status,tier");
    if (!list) return null;
    const schoolIds = [...new Set(list.map((r) => String(r.school_id)))];
    const { data, error } = schoolIds.length
      ? await db.from("cc_schools").select("id,name,country,regular_deadline").in("id", schoolIds)
      : { data: [], error: null };
    if (error) return null;
    const byId = new Map(((data ?? []) as Row[]).map((s) => [String(s.id), s]));
    return list
      .map((r) => ({ row: r, school: byId.get(String(r.school_id)) }))
      .filter((x) => x.school)
      .sort((a, b) => String(a.school!.name).localeCompare(String(b.school!.name), "en"));
  }

  return async (name: JourneyToolName, _args: Record<string, never>): Promise<ToolReply> => {
    if (ids.length === 0) return unknown("no_student_profile");

    if (name === "list_my_schools" || name === "check_plan_conflicts") {
      const list = await schools();
      if (!list) return failed();
      if (name === "check_plan_conflicts") {
        const result = checkREAConflict(list.map((x) => ({ schoolName: String(x.school!.name), plan: (x.row.application_plan as string) ?? null })));
        return { status: "ok", data: result as unknown as Json, evidence: [{ kind: "plan_conflict_rule", value: "REA restricts private EA/ED", sourceId: "ed-strategy" }] };
      }
      const out = list.map((x) => ({
        listEntryId: String(x.row.id),
        name: String(x.school!.name),
        country: (x.school!.country as string) ?? null,
        plan: (x.row.application_plan as string) ?? null,
        status: (x.row.application_status as string) ?? null,
        tier: (x.row.tier as string) ?? null,
        deadline: { value: (x.school!.regular_deadline as string) ?? null, status: "unverified_last_cycle" },
      }));
      return { status: "ok", data: { schools: out } as unknown as Json, evidence: out.map((s) => ({ kind: "school_on_list", value: s.name, sourceId: s.listEntryId })) };
    }

    if (name === "get_essay_status") {
      const essays = await rows("cc_essays", "id,essay_type,phase,word_count,word_limit,counselor_review_state,updated_at");
      if (!essays) return failed();
      const out = essays.map((e) => ({
        id: String(e.id),
        type: (e.essay_type as string) ?? null,
        phase: (e.phase as string) ?? null,
        words: (e.word_count as number) ?? null,
        wordLimit: (e.word_limit as number) ?? null,
        reviewState: (e.counselor_review_state as string) ?? null,
        daysSinceUpdate: e.updated_at ? Math.floor((now.getTime() - new Date(String(e.updated_at)).getTime()) / 86400000) : null,
      })).sort((a, b) => a.id.localeCompare(b.id, "en"));
      return { status: "ok", data: { essays: out } as unknown as Json, evidence: [] };
    }

    // get_journey_state
    const profiles = await rows("cc_student_profiles", "id,grade_level,is_transfer_student", "id");
    const list = await schools();
    const essays = await rows("cc_essays", "id,essay_type,counselor_review_state,updated_at");
    const tasks = await rows("cc_tasks", "id,title,due_date,status,task_type");
    if (!profiles || !list || !essays || !tasks) return failed();
    const grades = new Set(profiles.map((p) => p.grade_level ?? null));
    const transfer = profiles.some((p) => p.is_transfer_student === true);
    const grade = grades.size === 1 ? ([...grades][0] as number | null) : null; // conflicting duplicates → unknown
    const variant = selectVariant({ is_transfer_student: transfer, grade_level: grade }, list.map((x) => ({ application_status: (x.row.application_status as string) ?? null })));

    const actions: NextAction[] = [];
    const conflict = checkREAConflict(list.map((x) => ({ schoolName: String(x.school!.name), plan: (x.row.application_plan as string) ?? null })));
    if (conflict.conflict) actions.push({ id: `conflict:${conflict.reaSchool}`, reasonCode: "resolve_plan_conflict", title: `Fix your early plan: ${conflict.conflictingSchools.join(", ")} conflicts with ${conflict.reaSchool} REA`, entityId: null, dueDate: null, dueDateSource: null });
    for (const e of essays.filter((x) => x.counselor_review_state === "changes_requested").sort((a, b) => String(a.id).localeCompare(String(b.id), "en"))) {
      actions.push({ id: `revise:${e.id}`, reasonCode: "revise_after_review", title: "Revise the essay your counselor reviewed", entityId: String(e.id), dueDate: null, dueDateSource: null });
    }
    const open = tasks.filter((t) => t.status !== "done" && t.status !== "completed")
      .sort((a, b) => (a.due_date ? String(a.due_date) : "9999").localeCompare(b.due_date ? String(b.due_date) : "9999") || String(a.id).localeCompare(String(b.id)));
    for (const t of open) {
      actions.push({ id: `task:${t.id}`, reasonCode: "complete_task", title: String(t.title), entityId: String(t.id), dueDate: (t.due_date as string) ?? null, dueDateSource: t.task_type === "counselor" ? "counselor_task" : "student_task" });
    }
    if (actions.length < 3) actions.push({ id: `stage:${variant}`, reasonCode: "stage_default", title: STAGE_DEFAULT[variant] ?? STAGE_DEFAULT.unknown, entityId: null, dueDate: null, dueDateSource: null });

    const nextActions = actions.slice(0, 3);
    const evidence: Json[] = nextActions.filter((a) => a.dueDate).map((a) => ({ kind: "task_due_date", value: a.dueDate!, sourceId: a.entityId! }));
    return { status: "ok", data: { variant, nextActions } as unknown as Json, evidence };
  };
}
```

- [ ] **Step 4: Run it to verify it passes**

Run the Step 2 command. Expected: 7 passed. If `selectVariant`'s import pulls in React, move the import of `variants.ts` behind a type-only dependency: copy the 15-line `selectVariant` body into `journey-tools.ts`, with a comment pointing at the original and a test that both agree on all 8 variants. Record that as a deviation.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/agent/s1-flag.ts src/lib/cc/agent/journey-tools.ts src/lib/cc/agent/__tests__/journey-tools.test.ts
git commit -m "feat(agent-s1): flag and journey read tools over deterministic engines" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 3: Proposals, confirmation tokens and commit/decline/undo

**Files:**
- Create: `src/lib/cc/agent/proposals.ts`, `src/app/api/cc/agent/proposals/[id]/route.ts`
- Test: `src/lib/cc/agent/__tests__/proposals.test.ts`

**Interfaces:**
- Consumes: `AuthScope`, `ToolReply` and `Json` (A1); the tables from Task 1.
- Produces:

  ```ts
  export type ProposalKind = "task" | "calendar_hold" | "add_schools";
  export type ProposalToolName = "propose_task" | "propose_calendar_hold" | "propose_add_schools";
  export const PROPOSAL_TOOL_DEFINITIONS: readonly object[];
  export function validateProposalArgs(name: ProposalToolName, value: unknown): Record<string, Json>;
  export function makeProposalTools(db: SupabaseClient, scope: AuthScope, ctx: { turnId: string | null; now: Date }): (name: ProposalToolName, args: Record<string, Json>) => Promise<ToolReply>;
  export function signConfirmToken(p: { id: string; userId: string; payloadHash: string }, now: Date, secret: string): { token: string; expiresAtMs: number };
  export function verifyConfirmToken(token: string, p: { id: string; userId: string; payloadHash: string }, now: Date, secret: string): boolean;
  export async function commitProposal(db: SupabaseClient, scope: AuthScope, id: string, token: string, now: Date, secret: string): Promise<{ status: number; body: Json }>;
  export async function declineProposal(db: SupabaseClient, scope: AuthScope, id: string): Promise<{ status: number; body: Json }>;
  export async function undoProposal(db: SupabaseClient, scope: AuthScope, id: string, now: Date): Promise<{ status: number; body: Json }>;
  ```

- [ ] **Step 1: Write the failing test**

```ts
// @vitest-environment node
// src/lib/cc/agent/__tests__/proposals.test.ts
import { describe, it, expect } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { makeProposalTools, signConfirmToken, verifyConfirmToken, commitProposal, declineProposal, undoProposal } from "../proposals";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P = "11111111-1111-4111-8111-111111111111";
const SECRET = "test-secret-at-least-32-characters-long";
const now = new Date("2026-10-20T12:00:00Z");
const scope = { userId: U, profileIds: [P] } as const;
const fresh = () => createFakeSupabase({ cc_schools: [{ id: "s-mich", name: "University of Michigan", country: "US" }], cc_student_schools: [], cc_tasks: [], cc_agent_proposals: [], cc_agent_events: [] });

async function propose(db: ReturnType<typeof fresh>, name: "propose_task" | "propose_add_schools" | "propose_calendar_hold", args: Record<string, unknown>) {
  const tools = makeProposalTools(db as unknown as SupabaseClient, scope, { turnId: null, now });
  const r = await tools(name, args as never);
  return (r.data as { proposalId: string }).proposalId;
}

describe("proposals", () => {
  it("proposal tools write only a pending proposal, never the domain table", async () => {
    const db = fresh();
    await propose(db, "propose_task", { title: "Draft Why Michigan answer", dueDate: "2026-10-28", reason: "Michigan is on your list" });
    expect(db.tables.cc_tasks).toHaveLength(0);
    expect(db.tables.cc_agent_proposals[0]).toMatchObject({ status: "pending", kind: "task", user_id: U, student_id: P });
  });

  it("token_for_original_payload_rejects_mutated_row", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "A", dueDate: null, reason: "r" });
    const row = db.tables.cc_agent_proposals[0] as { payload_hash: string };
    const { token } = signConfirmToken({ id, userId: U, payloadHash: row.payload_hash }, now, SECRET);
    (db.tables.cc_agent_proposals[0] as Record<string, unknown>).payload = { title: "B", dueDate: null };
    const res = await commitProposal(db as unknown as SupabaseClient, scope, id, token, now, SECRET);
    expect(res.status).toBe(409);
    expect(db.tables.cc_tasks).toHaveLength(0);
  });

  it("confirm_twice_returns_same_receipt_and_one_row", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "Ask Ms. Lee", dueDate: "2026-10-25", reason: "r" });
    const hash = (db.tables.cc_agent_proposals[0] as { payload_hash: string }).payload_hash;
    const { token } = signConfirmToken({ id, userId: U, payloadHash: hash }, now, SECRET);
    const a = await commitProposal(db as unknown as SupabaseClient, scope, id, token, now, SECRET);
    const b = await commitProposal(db as unknown as SupabaseClient, scope, id, token, now, SECRET);
    expect(a.status).toBe(200);
    expect(b).toEqual(a);
    expect(db.tables.cc_tasks).toHaveLength(1);
  });

  it("confirm_rejects_proposal_owned_by_other_user", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "x", dueDate: null, reason: "r" });
    const hash = (db.tables.cc_agent_proposals[0] as { payload_hash: string }).payload_hash;
    const other = { userId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", profileIds: ["22222222-2222-4222-8222-222222222222"] };
    const { token } = signConfirmToken({ id, userId: other.userId, payloadHash: hash }, now, SECRET);
    expect((await commitProposal(db as unknown as SupabaseClient, other, id, token, now, SECRET)).status).toBe(404);
  });

  it("tokens expire after ten minutes", () => {
    const p = { id: "p", userId: U, payloadHash: "h" };
    const { token } = signConfirmToken(p, now, SECRET);
    expect(verifyConfirmToken(token, p, new Date(now.getTime() + 9 * 60000), SECRET)).toBe(true);
    expect(verifyConfirmToken(token, p, new Date(now.getTime() + 11 * 60000), SECRET)).toBe(false);
  });

  it("add_schools only accepts catalog schools and skips ones already on the list", async () => {
    const db = fresh();
    db.tables.cc_student_schools.push({ id: "ss1", student_id: P, school_id: "s-mich" });
    const tools = makeProposalTools(db as unknown as SupabaseClient, scope, { turnId: null, now });
    const r = await tools("propose_add_schools", { schoolIds: ["s-mich", "s-unknown"], reason: "r" } as never);
    expect(r.status).toBe("unknown");
  });

  it("an aborted turn inserts no proposal", async () => {
    const db = fresh();
    const tools = makeProposalTools(db as unknown as SupabaseClient, scope, { turnId: null, now });
    await expect(tools("propose_task", { title: "x", dueDate: null, reason: "r" } as never, AbortSignal.abort())).rejects.toThrow();
    expect(db.tables.cc_agent_proposals).toHaveLength(0);
  });

  it("decline and undo leave the domain consistent", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "x", dueDate: null, reason: "r" });
    const hash = (db.tables.cc_agent_proposals[0] as { payload_hash: string }).payload_hash;
    const { token } = signConfirmToken({ id, userId: U, payloadHash: hash }, now, SECRET);
    await commitProposal(db as unknown as SupabaseClient, scope, id, token, now, SECRET);
    expect((await undoProposal(db as unknown as SupabaseClient, scope, id, new Date(now.getTime() + 5 * 60000))).status).toBe(200);
    expect(db.tables.cc_tasks).toHaveLength(0);
    const id2 = await propose(db, "propose_task", { title: "y", dueDate: null, reason: "r" });
    expect((await declineProposal(db as unknown as SupabaseClient, scope, id2)).status).toBe(200);
    expect(db.tables.cc_agent_proposals.find((p) => p.id === id2)).toMatchObject({ status: "declined" });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/proposals.test.ts`

Expected: FAIL with `Cannot find module '../proposals'`.

- [ ] **Step 3: Implement**

```ts
// src/lib/cc/agent/proposals.ts
import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isUuid } from "../ownership";
import type { AuthScope, Json, ToolReply } from "./contracts";

export type ProposalKind = "task" | "calendar_hold" | "add_schools";
export type ProposalToolName = "propose_task" | "propose_calendar_hold" | "propose_add_schools";
const KIND: Record<ProposalToolName, ProposalKind> = { propose_task: "task", propose_calendar_hold: "calendar_hold", propose_add_schools: "add_schools" };
const TOKEN_MS = 10 * 60 * 1000;
const UNDO_MS = 10 * 60 * 1000;
const PROPOSAL_TTL_MS = 24 * 60 * 60 * 1000;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const PROPOSAL_TOOL_DEFINITIONS = [
  { type: "function", function: { name: "propose_task", description: "Propose one task. The student must confirm; nothing is saved by calling this.", parameters: {
    type: "object", properties: { title: { type: "string", minLength: 3, maxLength: 120 }, dueDate: { type: ["string", "null"], pattern: "^\\d{4}-\\d{2}-\\d{2}$" }, reason: { type: "string", minLength: 3, maxLength: 200 } }, required: ["title", "dueDate", "reason"], additionalProperties: false } } },
  { type: "function", function: { name: "propose_calendar_hold", description: "Propose a calendar hold the student can add. Only use a date the student chose or a date from tool evidence.", parameters: {
    type: "object", properties: { title: { type: "string", minLength: 3, maxLength: 120 }, date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" }, reason: { type: "string", minLength: 3, maxLength: 200 } }, required: ["title", "date", "reason"], additionalProperties: false } } },
  { type: "function", function: { name: "propose_add_schools", description: "Propose adding catalog schools (max 5) to the list.", parameters: {
    type: "object", properties: { schoolIds: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5, uniqueItems: true }, reason: { type: "string", minLength: 3, maxLength: 200 } }, required: ["schoolIds", "reason"], additionalProperties: false } } },
] as const;

export function validateProposalArgs(name: ProposalToolName, value: unknown): Record<string, Json> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_tool_arguments");
  const a = value as Record<string, unknown>;
  const allowed = { propose_task: ["title", "dueDate", "reason"], propose_calendar_hold: ["title", "date", "reason"], propose_add_schools: ["schoolIds", "reason"] }[name];
  if (!allowed || Object.keys(a).some((k) => !allowed.includes(k)) || allowed.some((k) => !(k in a))) throw new Error("invalid_tool_arguments");
  const str = (v: unknown, min: number, max: number) => typeof v === "string" && v.trim().length >= min && v.length <= max;
  if (!str(a.reason, 3, 200)) throw new Error("invalid_tool_arguments");
  if (name === "propose_task" && (!str(a.title, 3, 120) || !(a.dueDate === null || (typeof a.dueDate === "string" && DATE.test(a.dueDate))))) throw new Error("invalid_tool_arguments");
  if (name === "propose_calendar_hold" && (!str(a.title, 3, 120) || typeof a.date !== "string" || !DATE.test(a.date))) throw new Error("invalid_tool_arguments");
  if (name === "propose_add_schools" && (!Array.isArray(a.schoolIds) || a.schoolIds.length < 1 || a.schoolIds.length > 5 || new Set(a.schoolIds).size !== a.schoolIds.length || a.schoolIds.some((s) => typeof s !== "string"))) throw new Error("invalid_tool_arguments");
  return a as Record<string, Json>;
}

const hash = (v: unknown) => crypto.createHash("sha256").update(JSON.stringify(v)).digest("hex");

export function signConfirmToken(p: { id: string; userId: string; payloadHash: string }, now: Date, secret: string) {
  const expiresAtMs = now.getTime() + TOKEN_MS;
  const mac = crypto.createHmac("sha256", secret).update(`${p.id}|${p.userId}|${p.payloadHash}|${expiresAtMs}`).digest("hex");
  return { token: `${expiresAtMs}.${mac}`, expiresAtMs };
}

export function verifyConfirmToken(token: string, p: { id: string; userId: string; payloadHash: string }, now: Date, secret: string): boolean {
  const [exp, mac] = token.split(".");
  const expiresAtMs = Number(exp);
  if (!Number.isFinite(expiresAtMs) || !mac || now.getTime() > expiresAtMs) return false;
  const want = crypto.createHmac("sha256", secret).update(`${p.id}|${p.userId}|${p.payloadHash}|${expiresAtMs}`).digest("hex");
  return mac.length === want.length && crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(want));
}

export function makeProposalTools(db: SupabaseClient, scope: AuthScope, ctx: { turnId: string | null; now: Date }) {
  const studentId = scope.profileIds[0] ?? null;
  return async (name: ProposalToolName, args: Record<string, Json>, signal?: AbortSignal): Promise<ToolReply> => {
    if (!studentId) return { status: "unknown", data: { reason: "no_student_profile" }, evidence: [] };
    // A1 final review I2: a turn that already timed out must not leave a confirmable proposal.
    signal?.throwIfAborted();
    const kind = KIND[name];
    let payload: Record<string, Json>;
    if (kind === "add_schools") {
      const wanted = args.schoolIds as string[];
      const { data: catalog, error } = await db.from("cc_schools").select("id,name").in("id", wanted);
      if (error) return { status: "retryable_error", data: null, evidence: [] };
      const { data: existing } = await db.from("cc_student_schools").select("school_id").in("student_id", [...scope.profileIds]);
      const have = new Set(((existing ?? []) as { school_id: string }[]).map((r) => r.school_id));
      const known = ((catalog ?? []) as { id: string; name: string }[]).filter((s) => !have.has(s.id));
      if (known.length !== wanted.length) return { status: "unknown", data: { reason: "school_not_in_catalog_or_already_listed" }, evidence: [] };
      payload = { schools: known.map((s) => ({ id: s.id, name: s.name })) };
    } else if (kind === "task") {
      payload = { title: args.title, dueDate: args.dueDate };
    } else {
      payload = { title: args.title, date: args.date };
    }
    const payloadHash = hash({ kind, payload });
    const operationKey = hash({ kind, payloadHash, turn: ctx.turnId });
    signal?.throwIfAborted();
    const { data, error } = await db.from("cc_agent_proposals").insert({
      user_id: scope.userId, student_id: studentId, turn_id: ctx.turnId, kind, payload, payload_hash: payloadHash,
      operation_key: operationKey, reason: args.reason, expires_at: new Date(ctx.now.getTime() + PROPOSAL_TTL_MS).toISOString(),
    }).select("id").single();
    if (error || !data) return { status: "retryable_error", data: null, evidence: [] };
    return { status: "ok", data: { proposalId: (data as { id: string }).id, kind, payload, awaiting: "student_confirmation" }, evidence: [] };
  };
}

type ProposalRow = { id: string; user_id: string; student_id: string; kind: ProposalKind; payload: Record<string, Json>; payload_hash: string; status: string; receipt: Json | null; expires_at: string; committed_at: string | null };

async function load(db: SupabaseClient, scope: AuthScope, id: string): Promise<ProposalRow | null> {
  if (!isUuid(id)) return null;
  const { data } = await db.from("cc_agent_proposals").select("*").eq("id", id).eq("user_id", scope.userId).maybeSingle();
  const row = data as ProposalRow | null;
  return row && scope.profileIds.includes(row.student_id) ? row : null;
}

export async function commitProposal(db: SupabaseClient, scope: AuthScope, id: string, token: string, now: Date, secret: string): Promise<{ status: number; body: Json }> {
  const row = await load(db, scope, id);
  if (!row) return { status: 404, body: { error: "not_found" } };
  if (row.status === "committed") return { status: 200, body: { status: "committed", receipt: row.receipt } };
  if (row.status !== "pending") return { status: 409, body: { error: `proposal_${row.status}` } };
  if (hash({ kind: row.kind, payload: row.payload }) !== row.payload_hash) return { status: 409, body: { error: "payload_changed" } };
  if (!verifyConfirmToken(token, { id, userId: scope.userId, payloadHash: row.payload_hash }, now, secret)) return { status: 409, body: { error: "token_invalid_or_expired" } };
  if (now.getTime() > new Date(row.expires_at).getTime()) {
    await db.from("cc_agent_proposals").update({ status: "expired" }).eq("id", id).eq("status", "pending");
    return { status: 409, body: { error: "proposal_expired" } };
  }
  // Claim first: only one caller moves pending → committed.
  const { data: claimed } = await db.from("cc_agent_proposals").update({ status: "committed", committed_at: now.toISOString() }).eq("id", id).eq("status", "pending").select("id");
  if (!claimed || (claimed as unknown[]).length === 0) {
    const again = await load(db, scope, id);
    return { status: 200, body: { status: again?.status ?? "unknown", receipt: again?.receipt ?? null } };
  }
  let receipt: Json;
  if (row.kind === "add_schools") {
    const schools = row.payload.schools as { id: string }[];
    const { data, error } = await db.from("cc_student_schools").insert(schools.map((s) => ({ student_id: row.student_id, school_id: s.id, application_status: "considering" }))).select("id");
    if (error) { await db.from("cc_agent_proposals").update({ status: "pending", committed_at: null }).eq("id", id); return { status: 503, body: { error: "commit_failed_retry" } }; }
    receipt = { kind: "add_schools", listEntryIds: ((data ?? []) as { id: string }[]).map((r) => r.id) };
  } else {
    const due = row.kind === "task" ? (row.payload.dueDate as string | null) : (row.payload.date as string);
    const { data, error } = await db.from("cc_tasks").insert({ student_id: row.student_id, title: row.payload.title, due_date: due, task_type: row.kind === "calendar_hold" ? "calendar_hold" : "agent", status: "pending" }).select("id").single();
    if (error || !data) { await db.from("cc_agent_proposals").update({ status: "pending", committed_at: null }).eq("id", id); return { status: 503, body: { error: "commit_failed_retry" } }; }
    receipt = { kind: row.kind, taskId: (data as { id: string }).id, ...(row.kind === "calendar_hold" ? { ics: `/api/cc/agent/proposals/${id}/ics` } : {}) };
  }
  await db.from("cc_agent_proposals").update({ receipt }).eq("id", id);
  await db.from("cc_agent_events").insert({ user_id: scope.userId, turn_id: null, seq: 0, type: "action.committed", label: "Saved what you confirmed", payload: { proposalId: id, kind: row.kind } });
  return { status: 200, body: { status: "committed", receipt } };
}

export async function declineProposal(db: SupabaseClient, scope: AuthScope, id: string): Promise<{ status: number; body: Json }> {
  const row = await load(db, scope, id);
  if (!row) return { status: 404, body: { error: "not_found" } };
  if (row.status !== "pending") return { status: 409, body: { error: `proposal_${row.status}` } };
  await db.from("cc_agent_proposals").update({ status: "declined" }).eq("id", id).eq("status", "pending");
  await db.from("cc_agent_events").insert({ user_id: scope.userId, turn_id: null, seq: 0, type: "action.declined", label: "You said not now", payload: { proposalId: id } });
  return { status: 200, body: { status: "declined" } };
}

export async function undoProposal(db: SupabaseClient, scope: AuthScope, id: string, now: Date): Promise<{ status: number; body: Json }> {
  const row = await load(db, scope, id);
  if (!row) return { status: 404, body: { error: "not_found" } };
  if (row.status !== "committed" || !row.committed_at || now.getTime() - new Date(row.committed_at).getTime() > UNDO_MS) return { status: 409, body: { error: "undo_unavailable" } };
  const r = (row.receipt ?? {}) as { taskId?: string; listEntryIds?: string[] };
  if (r.taskId) await db.from("cc_tasks").delete().eq("id", r.taskId).eq("student_id", row.student_id);
  if (r.listEntryIds?.length) await db.from("cc_student_schools").delete().in("id", r.listEntryIds).eq("application_status", "considering");
  await db.from("cc_agent_proposals").update({ status: "undone" }).eq("id", id).eq("status", "committed");
  await db.from("cc_agent_events").insert({ user_id: scope.userId, turn_id: null, seq: 0, type: "action.undone", label: "Undone", payload: { proposalId: id } });
  return { status: 200, body: { status: "undone" } };
}
```

```ts
// src/app/api/cc/agent/proposals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getStudentProfileIds } from "@/lib/cc/ownership";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { commitProposal, declineProposal, undoProposal } from "@/lib/cc/agent/proposals";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const secret = process.env.AGENT_CONFIRM_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: "agent_disabled" }, { status: 503 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { action?: string; token?: string };
  const db = createAdminSupabase();
  const scope = { userId: user.id, profileIds: await getStudentProfileIds(db, user.id) };
  const now = new Date();
  const r = body.action === "confirm" ? await commitProposal(db, scope, id, String(body.token ?? ""), now, secret)
    : body.action === "decline" ? await declineProposal(db, scope, id)
    : body.action === "undo" ? await undoProposal(db, scope, id, now)
    : { status: 400, body: { error: "unknown_action" } };
  return NextResponse.json(r.body, { status: r.status });
}
```

- [ ] **Step 4: Run it to verify it passes**

Run the Step 2 command. Expected: 7 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/agent/proposals.ts "src/app/api/cc/agent/proposals/[id]/route.ts" src/lib/cc/agent/__tests__/proposals.test.ts
git commit -m "feat(agent-s1): proposals with signed 10-minute confirmation, idempotent commit, decline and undo" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 4: Date-grounding check, combined tools and the flagged turn route

**Files:**
- Create: `src/lib/cc/agent/date-check.ts`, `src/lib/cc/agent/s1-tools.ts`, `src/lib/cc/agent/s1-turn.ts`, `src/app/api/cc/agent/turn/route.ts`
- Modify:
  - `src/lib/cc/agent/contracts.ts`: add `validate?` to `RunDeps`.
  - `src/lib/cc/agent/loop.ts`: use `deps.validate ?? validateToolArgs`.
  - `src/lib/cc/agent/provider.ts`: `makeProvider` gains an optional `toolDefinitions` parameter, defaulting to `READ_TOOL_DEFINITIONS`.
  - `src/app/api/cc/coach/message/route.ts`: for flagged users, skip `<<actions>>` parsing and `runCoachExtraction`.
- Test: `src/lib/cc/agent/__tests__/date-check.test.ts`, `src/lib/cc/agent/__tests__/s1-turn.test.ts`

**Interfaces:**
- Consumes:
  - `runAgent`, `OutputCheck`, `RunDeps`, `makeProvider` and `encodeEvent` (A1);
  - `makeJourneyTools` (Task 2);
  - `makeProposalTools` and `validateProposalArgs` (Task 3);
  - `assertCapacity` from `src/lib/cc/tier-gate.ts`.
- Produces:

  ```ts
  export function redactUngroundedDates(candidate: Candidate, evidence: Json[]): Candidate; // date-check.ts, pure
  export const echoCheck: OutputCheck;                    // date-check.ts: allows the candidate unchanged
  export const S1_TOOL_DEFINITIONS: readonly object[];   // s1-tools.ts
  export function validateS1ToolArgs(name: string, value: unknown): unknown;
  export function makeS1Tools(db, scope, ctx: { turnId: string | null; now: Date }): ReadTools;
  export const ESSAY_WRITING_REQUEST: RegExp;             // s1-turn.ts
  export async function runS1Turn(i: { db: SupabaseClient; scope: AuthScope; operationKey: string; message: string; locale: string; provider: Provider; now: Date; signal: AbortSignal }): Promise<{ status: 200 | 409; turnId: string | null; result: { text: string; cards: Json[] } | null; error?: string }>;
  ```

- [ ] **Step 1: Write the failing tests**

```ts
// @vitest-environment node
// src/lib/cc/agent/__tests__/date-check.test.ts
import { it, expect } from "vitest";
import { redactUngroundedDates, echoCheck } from "../date-check";

it("strips_dates_absent_from_evidence", () => {
  const out = redactUngroundedDates({ text: "MIT EA is November 1. Start your list today.", cards: [] }, []);
  expect(out.text).not.toMatch(/November 1/);
  expect(out.text).toMatch(/I don't have a verified date for that yet/);
  expect(out.text).toMatch(/Start your list today/);
});

it("keeps_task_due_dates_from_tool_evidence", () => {
  const out = redactUngroundedDates({ text: "Your task is due 2026-10-25.", cards: [] }, [{ kind: "task_due_date", value: "2026-10-25" }]);
  expect(out.text).toBe("Your task is due 2026-10-25.");
});

it("checks card fields too", () => {
  const out = redactUngroundedDates({ text: "ok", cards: [{ title: "Due Jan 1, 2027" }] }, []);
  expect(JSON.stringify(out.cards)).not.toMatch(/Jan 1, 2027/);
});

it("echoCheck allows exactly the candidate it was given", async () => {
  const c = { text: "x", cards: [] };
  const v = await echoCheck(c, { locale: "en", evidence: [], priorReleased: [], signal: new AbortController().signal });
  expect(v).toEqual({ decision: "allow", result: { ...c, policyVersion: "s1-date-grounding-1" } });
});
```

```ts
// @vitest-environment node
// src/lib/cc/agent/__tests__/s1-turn.test.ts
import { describe, it, expect, vi } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { runS1Turn } from "../s1-turn";
import type { Provider } from "../contracts";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P = "11111111-1111-4111-8111-111111111111";
const base = () => createFakeSupabase({ cc_student_profiles: [{ id: P, user_id: U, grade_level: 11, is_transfer_student: false }], cc_student_schools: [], cc_schools: [], cc_essays: [], cc_tasks: [], cc_agent_turns: [], cc_agent_events: [], cc_agent_proposals: [] });
const args = (db: ReturnType<typeof base>, provider: Provider, message = "What should I do this week?", operationKey = "op-key-0001") =>
  ({ db: db as unknown as SupabaseClient, scope: { userId: U, profileIds: [P] }, operationKey, message, locale: "en", provider, now: new Date("2026-10-20T12:00:00Z"), signal: new AbortController().signal });

describe("S1 turn", () => {
  it("calls journey tools and returns checked text with a logged event trail", async () => {
    const provider = vi.fn<Provider>()
      .mockResolvedValueOnce({ content: null, calls: [{ id: "1", name: "get_journey_state", arguments: "{}" }] })
      .mockResolvedValueOnce({ content: "Build your school list to 5 schools.", calls: [] });
    const db = base();
    const r = await runS1Turn(args(db, provider));
    expect(r.status).toBe(200);
    expect(r.result?.text).toBe("Build your school list to 5 schools.");
    expect(db.tables.cc_agent_events.map((e) => e.type)).toEqual(["turn.accepted", "tool.completed", "turn.completed"]);
  });

  it("same key and same input replays without calling the provider again", async () => {
    const provider = vi.fn<Provider>().mockResolvedValue({ content: "Hi.", calls: [] });
    const db = base();
    await runS1Turn(args(db, provider));
    const again = await runS1Turn(args(db, provider));
    expect(provider).toHaveBeenCalledTimes(1);
    expect(again.result?.text).toBe("Hi.");
  });

  it("same key with a different message is a 409 before any provider call", async () => {
    const provider = vi.fn<Provider>().mockResolvedValue({ content: "Hi.", calls: [] });
    const db = base();
    await runS1Turn(args(db, provider));
    const r = await runS1Turn(args(db, provider, "Something else"));
    expect(r.status).toBe(409);
    expect(provider).toHaveBeenCalledTimes(1);
  });

  it("a failed turn logs only a stable code, and its replay is refused", async () => {
    const provider = vi.fn<Provider>().mockResolvedValue({ content: "[Draft] I was born in Lahore", calls: [] });
    const db = base();
    await expect(runS1Turn(args(db, provider))).rejects.toThrow();
    const failed = db.tables.cc_agent_events.find((e) => e.type === "turn.failed") as { payload: { code: string } };
    expect(failed.payload.code).toMatch(/^[a-z_0-9]+$/);
    expect(JSON.stringify(db.tables.cc_agent_events)).not.toMatch(/Lahore|Draft/);
    const replay = await runS1Turn(args(db, provider));
    expect(replay.status).toBe(409);
  });

  it("essay-writing requests get the fixed integrity answer and no model call", async () => {
    const provider = vi.fn<Provider>();
    const r = await runS1Turn(args(base(), provider, "Write my personal statement intro for me"));
    expect(provider).not.toHaveBeenCalled();
    expect(r.result?.text).toMatch(/You write every word/);
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/date-check.test.ts src/lib/cc/agent/__tests__/s1-turn.test.ts`

Expected: FAIL with `Cannot find module '../date-check'` and `Cannot find module '../s1-turn'`.

- [ ] **Step 3: Implement**

```ts
// src/lib/cc/agent/date-check.ts
import type { Candidate, CheckContext, Json, OutputCheck } from "./contracts";

const MONTHS = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE_RE = new RegExp(`\\b(?:\\d{4}-\\d{2}-\\d{2}|${MONTHS}\\.? \\d{1,2}(?:st|nd|rd|th)?(?:,? \\d{4})?|\\d{1,2} ${MONTHS}(?: \\d{4})?)\\b`, "g");
const REPLACEMENT = "I don't have a verified date for that yet — I can check.";

function grounded(text: string, evidence: string): string {
  return text.split(/(?<=[.!?])\s+/).map((sentence) => {
    const dates = sentence.match(DATE_RE) ?? [];
    return dates.every((d) => evidence.includes(d)) ? sentence : REPLACEMENT;
  }).join(" ");
}

function walk(v: Json, evidence: string): Json {
  if (typeof v === "string") return grounded(v, evidence);
  if (Array.isArray(v)) return v.map((x) => walk(x, evidence));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x as Json, evidence)]));
  return v;
}

// Deterministic, pre-check redaction (A1 Task 6 ruling: the loop releases only
// the candidate it checked, so redaction must happen before the check).
export function redactUngroundedDates(candidate: Candidate, evidence: Json[]): Candidate {
  const ev = JSON.stringify(evidence);
  return { text: grounded(candidate.text, ev), cards: candidate.cards.map((c) => walk(c, ev)) };
}

// S1 turns carry no essay prose, so the check after redaction is a pass-through.
export const echoCheck: OutputCheck = async (candidate: Candidate, _context: CheckContext) =>
  ({ decision: "allow", result: { ...candidate, policyVersion: "s1-date-grounding-1" } });
```

```ts
// src/lib/cc/agent/s1-tools.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthScope, ReadTools } from "./contracts";
import { READ_TOOL_DEFINITIONS, validateToolArgs, makeReadTools } from "./read-tools";
import { JOURNEY_TOOL_DEFINITIONS, makeJourneyTools, type JourneyToolName } from "./journey-tools";
import { PROPOSAL_TOOL_DEFINITIONS, makeProposalTools, validateProposalArgs, type ProposalToolName } from "./proposals";

const JOURNEY = new Set(JOURNEY_TOOL_DEFINITIONS.map((t) => t.function.name));
const PROPOSAL = new Set(PROPOSAL_TOOL_DEFINITIONS.map((t) => t.function.name as string));
export const S1_TOOL_DEFINITIONS = [...READ_TOOL_DEFINITIONS, ...JOURNEY_TOOL_DEFINITIONS, ...PROPOSAL_TOOL_DEFINITIONS] as const;

export function validateS1ToolArgs(name: string, value: unknown): unknown {
  if (JOURNEY.has(name as JourneyToolName)) {
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length) throw new Error("invalid_tool_arguments");
    return value;
  }
  if (PROPOSAL.has(name)) return validateProposalArgs(name as ProposalToolName, value);
  return validateToolArgs(name, value);
}

export function makeS1Tools(db: SupabaseClient, scope: AuthScope, ctx: { turnId: string | null; now: Date }): ReadTools {
  const read = makeReadTools(db, scope);
  const journey = makeJourneyTools(db, scope, ctx.now);
  const propose = makeProposalTools(db, scope, ctx);
  return async (name, args, signal) => {
    signal?.throwIfAborted();
    if (JOURNEY.has(name as JourneyToolName)) return journey(name as JourneyToolName, args as Record<string, never>);
    if (PROPOSAL.has(name)) return propose(name as ProposalToolName, args as never, signal);
    return read(name, args, signal);
  };
}
```

Modify A1's `contracts.ts`, replacing the `RunDeps` line with:

```ts
export type RunDeps = { provider: Provider; tools: ReadTools; check: OutputCheck; signal: AbortSignal; priorReleased: string[]; validate?: (name: string, value: unknown) => unknown; redact?: (candidate: Candidate, evidence: Json[]) => Candidate };
```

Modify A1's `loop.ts`, replacing `const parsed=reply.calls.map(c=>validateToolArgs(c.name,JSON.parse(c.arguments)));` with:

```ts
const validate=deps.validate??validateToolArgs;
const parsed=reply.calls.map(c=>validate(c.name,JSON.parse(c.arguments)));
```

Also change the next loop line to pass `parsed[i]`, unchanged in form. Then, where the loop computes `const candidate=parseCandidate(reply.content);`, change it to `const candidate=deps.redact?deps.redact(parseCandidate(reply.content),evidence):parseCandidate(reply.content);`, so redaction happens before the size check and the output check. The release path (A1 Task 6 ruling) then returns exactly this redacted candidate. Add a loop test: with a `redact` that uppercases the text and an echo checker, the result text is uppercased. That shows the checked and released text are the same.

Modify A1's `provider.ts`: give `makeProvider` the signature `makeProvider(role, customFetch?, envOverride?, toolDefinitions: readonly unknown[] = READ_TOOL_DEFINITIONS)`, and use `tools: toolDefinitions` where it currently uses `tools: READ_TOOL_DEFINITIONS`.

```ts
// src/lib/cc/agent/s1-turn.ts
import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { runAgent } from "./loop";
import { redactUngroundedDates, echoCheck } from "./date-check";
import { makeS1Tools, validateS1ToolArgs } from "./s1-tools";
import type { AuthScope, Json, Provider, ToolReply } from "./contracts";

export const ESSAY_WRITING_REQUEST = /\b(write|draft|rewrite|compose|finish)\b[^.?!]{0,40}\b(essay|statement|paragraph|intro|introduction|conclusion|supplement|sentences?)\b/i;
const INTEGRITY = "I can't write that for you — You write every word, and that's what makes it yours. I can ask you three questions to find your story, or review a draft you wrote. Open Essay Studio when you're ready.";
const LABELS: Record<string, string> = {
  get_journey_state: "Checked your next steps", list_my_schools: "Read your school list", check_plan_conflicts: "Checked your early plans for conflicts",
  get_essay_status: "Checked your essays", propose_task: "Suggested a task", propose_calendar_hold: "Suggested a calendar hold", propose_add_schools: "Suggested schools to add",
  read_context: "Read your profile", read_essay: "Read your essay", read_published_feedback: "Read your counselor's feedback",
};

export async function runS1Turn(i: { db: SupabaseClient; scope: AuthScope; operationKey: string; message: string; locale: string; provider: Provider; now: Date; signal: AbortSignal }) {
  const inputHash = crypto.createHash("sha256").update(JSON.stringify({ m: i.message, l: i.locale })).digest("hex");
  const { data: prior } = await i.db.from("cc_agent_turns").select("id,input_hash,status,result").eq("user_id", i.scope.userId).eq("operation_key", i.operationKey).maybeSingle();
  if (prior) {
    const p = prior as { id: string; input_hash: string; status: string; result: { text: string; cards: Json[] } | null };
    if (p.input_hash !== inputHash) return { status: 409 as const, turnId: p.id, result: null, error: "operation_key_conflict" };
    if (p.status !== "completed" || !p.result) return { status: 409 as const, turnId: p.id, result: null, error: "turn_not_replayable" };
    return { status: 200 as const, turnId: p.id, result: p.result };
  }
  const { data: turn, error } = await i.db.from("cc_agent_turns").insert({ user_id: i.scope.userId, operation_key: i.operationKey, input_hash: inputHash }).select("id").single();
  if (error || !turn) return { status: 409 as const, turnId: null, result: null, error: "operation_key_conflict" };
  const turnId = (turn as { id: string }).id;
  let seq = 0;
  const log = (type: string, label: string, payload: Json = {}) =>
    i.db.from("cc_agent_events").insert({ user_id: i.scope.userId, turn_id: turnId, seq: seq++, type, label, payload });
  await log("turn.accepted", "Started");

  if (ESSAY_WRITING_REQUEST.test(i.message)) {
    const result = { text: INTEGRITY, cards: [] as Json[] };
    await i.db.from("cc_agent_turns").update({ status: "completed", result, completed_at: i.now.toISOString() }).eq("id", turnId);
    await log("turn.completed", "Answered");
    return { status: 200 as const, turnId, result };
  }

  const inner = makeS1Tools(i.db, i.scope, { turnId, now: i.now });
  const tools = async (name: string, args: unknown, signal?: AbortSignal): Promise<ToolReply> => {
    const r = await inner(name, args, signal);
    signal?.throwIfAborted(); // never log a tool result for a turn that already timed out
    await log(name.startsWith("propose_") && r.status === "ok" ? "action.preview" : "tool.completed", LABELS[name] ?? "Checked something", { tool: name, status: r.status });
    return r;
  };
  try {
    const checked = await runAgent({ message: i.message, essayId: null, locale: i.locale }, { provider: i.provider, tools, check: echoCheck, redact: redactUngroundedDates, signal: i.signal, priorReleased: [], validate: validateS1ToolArgs });
    const result = { text: checked.text, cards: checked.cards };
    await i.db.from("cc_agent_turns").update({ status: "completed", result, completed_at: i.now.toISOString() }).eq("id", turnId);
    await log("turn.completed", "Answered");
    return { status: 200 as const, turnId, result };
  } catch (e) {
    await i.db.from("cc_agent_turns").update({ status: "failed", completed_at: i.now.toISOString() }).eq("id", turnId);
    // Only a stable code reaches cc_agent_events (students can read it); never raw error text.
    const code = e instanceof Error && /^[a-z_0-9]+$/.test(e.message) ? e.message : "agent_internal_error";
    await log("turn.failed", "Something went wrong", { code });
    throw e;
  }
}
```

```ts
// src/app/api/cc/agent/turn/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getStudentProfileIds } from "@/lib/cc/ownership";
import { assertCapacity } from "@/lib/cc/tier-gate";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { makeProvider } from "@/lib/cc/agent/provider";
import { S1_TOOL_DEFINITIONS } from "@/lib/cc/agent/s1-tools";
import { runS1Turn } from "@/lib/cc/agent/s1-turn";
import { encodeEvent } from "@/lib/cc/agent/sse";

export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { message?: string; operationKey?: string; locale?: string };
  const message = String(body.message ?? "").trim();
  const operationKey = String(body.operationKey ?? "");
  if (!message || message.length > 2000 || operationKey.length < 8 || operationKey.length > 128) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const db = createAdminSupabase();
  const { count } = await db.from("cc_agent_turns").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", new Date(Date.now() - 86400000).toISOString());
  const cap = await assertCapacity(user.id, "coachMessagesPerDay", count ?? 0);
  if (!cap.ok) return NextResponse.json({ error: "fair_use_limit" }, { status: 429 });
  const scope = { userId: user.id, profileIds: await getStudentProfileIds(db, user.id) };
  const r = await runS1Turn({ db, scope, operationKey, message, locale: String(body.locale ?? "en"), provider: makeProvider("routine", undefined, undefined, S1_TOOL_DEFINITIONS), now: new Date(), signal: req.signal });
  if (r.status === 409) return NextResponse.json({ error: r.error }, { status: 409 });
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      // A1 sse.encodeEvent requires seq >= 1.
      c.enqueue(encodeEvent(1, "turn.accepted", { turnId: r.turnId }));
      c.enqueue(encodeEvent(2, "text.delta", { text: r.result!.text }));
      c.enqueue(encodeEvent(3, "turn.completed", { turnId: r.turnId, cards: r.result!.cards }));
      c.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store" } });
}
```

`assertCapacity(userId, capability, currentUsage)` returns `{ ok, tier, remaining, limit }` (`src/lib/cc/tier-gate.ts:158`).

Modify `src/app/api/cc/coach/message/route.ts`: wrap the `<<actions>>` parse/apply block and the `runCoachExtraction(...)` call in `if (!isAgentS1User(user.id)) { ... }`. Add this test to `src/app/api/cc/__tests__/coach-extraction-auth.test.ts`:

```ts
it("the legacy message route skips actions and extraction for S1 users", () => {
  const src = fs.readFileSync(path.join(API_ROOT, "cc/coach/message/route.ts"), "utf8");
  expect(src).toMatch(/isAgentS1User\(user\.id\)/);
});
```

- [ ] **Step 4: Run them to verify they pass**

Run: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/date-check.test.ts src/lib/cc/agent/__tests__/s1-turn.test.ts src/lib/cc/agent/__tests__/loop.test.ts src/app/api/cc/__tests__/coach-extraction-auth.test.ts`

Expected: all pass, with A1's loop tests still green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/agent/date-check.ts src/lib/cc/agent/s1-tools.ts src/lib/cc/agent/s1-turn.ts src/app/api/cc/agent/turn/route.ts src/lib/cc/agent/contracts.ts src/lib/cc/agent/loop.ts src/lib/cc/agent/provider.ts src/app/api/cc/coach/message/route.ts src/lib/cc/agent/__tests__/date-check.test.ts src/lib/cc/agent/__tests__/s1-turn.test.ts src/app/api/cc/__tests__/coach-extraction-auth.test.ts
git commit -m "feat(agent-s1): flagged turn route with operation keys, date grounding and one writer" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 5: Deterministic trigger engine and daily cron

**Files:**
- Create: `src/lib/cc/agent/triggers.ts`, `src/app/api/cron/agent-nudges/route.ts`
- Modify: `vercel.json`, adding a cron entry
- Test: `src/lib/cc/agent/__tests__/triggers.test.ts`

**Interfaces:**
- Consumes: `checkREAConflict`, `isAgentS1User`, and the `cc_agent_nudges` table.
- Produces:

  ```ts
  export type TriggerInput = { userId: string; studentId: string; schools: { schoolName: string; plan: string | null }[]; essays: { id: string; reviewState: string | null; phase: string | null; updatedAt: string | null }[]; lastLoginDate: string | null };
  export type Nudge = { trigger: "plan_conflict" | "essay_stall" | "inactivity"; entityKey: string; periodKey: string; reason: { title: string; detail: string } };
  export function evaluateTriggers(input: TriggerInput, now: Date): Nudge[];
  export function isoWeek(now: Date): string; // "2026-W43"
  export async function runNudgeCron(db: SupabaseClient, now: Date, env?: Record<string, string | undefined>): Promise<{ inserted: number; students: number }>;
  ```

- [ ] **Step 1: Write the failing test**

```ts
// @vitest-environment node
// src/lib/cc/agent/__tests__/triggers.test.ts
import { describe, it, expect } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { evaluateTriggers, isoWeek, runNudgeCron } from "../triggers";

const now = new Date("2026-10-20T09:00:00Z");
const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P = "11111111-1111-4111-8111-111111111111";
const base = { userId: U, studentId: P, schools: [], essays: [], lastLoginDate: "2026-10-19" };

describe("triggers", () => {
  it("flags a reviewed essay unchanged for 10+ days, not one edited recently", () => {
    const n = evaluateTriggers({ ...base, essays: [
      { id: "e1", reviewState: "changes_requested", phase: "revise", updatedAt: "2026-10-05T00:00:00Z" },
      { id: "e2", reviewState: "changes_requested", phase: "revise", updatedAt: "2026-10-18T00:00:00Z" },
    ] }, now);
    expect(n.map((x) => x.entityKey)).toEqual(["essay:e1"]);
  });

  it("flags inactivity after 14 days and REA conflicts", () => {
    const n = evaluateTriggers({ ...base, lastLoginDate: "2026-10-01", schools: [{ schoolName: "Harvard University", plan: "REA" }, { schoolName: "Northwestern University", plan: "EA" }] }, now);
    expect(n.map((x) => x.trigger).sort()).toEqual(["inactivity", "plan_conflict"]);
  });

  it("uses the ISO week as the period, so a nudge repeats at most weekly", () => {
    expect(isoWeek(now)).toBe("2026-W43");
  });

  const db = () => createFakeSupabase({
    cc_student_profiles: [{ id: P, user_id: U }, { id: "22222222-2222-4222-8222-222222222222", user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }],
    cc_student_schools: [], cc_schools: [],
    cc_essays: [{ id: "e1", student_id: P, counselor_review_state: "changes_requested", phase: "revise", updated_at: "2026-10-05T00:00:00Z" },
                { id: "e9", student_id: "22222222-2222-4222-8222-222222222222", counselor_review_state: "changes_requested", phase: "revise", updated_at: "2026-09-01T00:00:00Z" }],
    user_profiles: [{ id: U, last_login_date: "2026-10-19" }],
    cc_agent_nudges: [], cc_agent_events: [],
  });
  const env = { AGENT_S1_ENABLED: "1", AGENT_S1_USER_IDS: U };

  it("second_run_same_day_inserts_nothing", async () => {
    const d = db();
    expect((await runNudgeCron(d as unknown as SupabaseClient, now, env)).inserted).toBe(1);
    expect((await runNudgeCron(d as unknown as SupabaseClient, now, env)).inserted).toBe(0);
    expect(d.tables.cc_agent_nudges).toHaveLength(1);
  });

  it("unflagged_students_never_nudged", async () => {
    const d = db();
    await runNudgeCron(d as unknown as SupabaseClient, now, env);
    expect(d.tables.cc_agent_nudges.every((n) => n.user_id === U)).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/triggers.test.ts`

Expected: FAIL with `Cannot find module '../triggers'`.

- [ ] **Step 3: Implement**

```ts
// src/lib/cc/agent/triggers.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import { checkREAConflict } from "@/lib/applications/ed-strategy";
import { isAgentS1User } from "./s1-flag";

export type TriggerInput = { userId: string; studentId: string; schools: { schoolName: string; plan: string | null }[]; essays: { id: string; reviewState: string | null; phase: string | null; updatedAt: string | null }[]; lastLoginDate: string | null };
export type Nudge = { trigger: "plan_conflict" | "essay_stall" | "inactivity"; entityKey: string; periodKey: string; reason: { title: string; detail: string } };
const DAY = 86400000;

export function isoWeek(now: Date): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / DAY + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function evaluateTriggers(input: TriggerInput, now: Date): Nudge[] {
  const period = isoWeek(now);
  const out: Nudge[] = [];
  const conflict = checkREAConflict(input.schools);
  if (conflict.conflict) out.push({ trigger: "plan_conflict", entityKey: `rea:${conflict.reaSchool}`, periodKey: period, reason: { title: "Your early plans conflict", detail: conflict.message } });
  for (const e of input.essays) {
    if (e.reviewState !== "changes_requested" || !e.updatedAt) continue;
    const days = Math.floor((now.getTime() - new Date(e.updatedAt).getTime()) / DAY);
    if (days >= 10) out.push({ trigger: "essay_stall", entityKey: `essay:${e.id}`, periodKey: period, reason: { title: "An essay is waiting on your revision", detail: `Your counselor asked for changes ${days} days ago.` } });
  }
  if (input.lastLoginDate) {
    const days = Math.floor((now.getTime() - new Date(`${input.lastLoginDate}T00:00:00Z`).getTime()) / DAY);
    if (days >= 14) out.push({ trigger: "inactivity", entityKey: "login", periodKey: period, reason: { title: "Welcome back", detail: `It's been ${days} days. Want a 10-minute version of your next step?` } });
  }
  return out;
}

export async function runNudgeCron(db: SupabaseClient, now: Date, env: Record<string, string | undefined> = process.env) {
  const allow = (env.AGENT_S1_USER_IDS ?? "").split(",").map((s) => s.trim()).filter((id) => id && isAgentS1User(id, env));
  if (!allow.length) return { inserted: 0, students: 0 };
  const { data: profiles } = await db.from("cc_student_profiles").select("id,user_id").in("user_id", allow);
  let inserted = 0;
  const byUser = new Map<string, string[]>();
  for (const p of (profiles ?? []) as { id: string; user_id: string }[]) byUser.set(p.user_id, [...(byUser.get(p.user_id) ?? []), p.id]);
  for (const [userId, ids] of byUser) {
    const [{ data: ss }, { data: essays }, { data: up }] = await Promise.all([
      db.from("cc_student_schools").select("school_id,application_plan").in("student_id", ids),
      db.from("cc_essays").select("id,counselor_review_state,phase,updated_at").in("student_id", ids),
      db.from("user_profiles").select("last_login_date").eq("id", userId).maybeSingle(),
    ]);
    const schoolIds = ((ss ?? []) as { school_id: string }[]).map((r) => r.school_id);
    const { data: names } = schoolIds.length ? await db.from("cc_schools").select("id,name").in("id", schoolIds) : { data: [] };
    const nameOf = new Map(((names ?? []) as { id: string; name: string }[]).map((s) => [s.id, s.name]));
    const nudges = evaluateTriggers({
      userId, studentId: ids[0],
      schools: ((ss ?? []) as { school_id: string; application_plan: string | null }[]).filter((r) => nameOf.has(r.school_id)).map((r) => ({ schoolName: nameOf.get(r.school_id)!, plan: r.application_plan })),
      essays: ((essays ?? []) as { id: string; counselor_review_state: string | null; phase: string | null; updated_at: string | null }[]).map((e) => ({ id: e.id, reviewState: e.counselor_review_state, phase: e.phase, updatedAt: e.updated_at })),
      lastLoginDate: ((up ?? null) as { last_login_date: string | null } | null)?.last_login_date ?? null,
    }, now);
    for (const n of nudges) {
      const { data: dup } = await db.from("cc_agent_nudges").select("id").eq("student_id", ids[0]).eq("trigger", n.trigger).eq("entity_key", n.entityKey).eq("period_key", n.periodKey).maybeSingle();
      if (dup) continue;
      const { error } = await db.from("cc_agent_nudges").insert({ user_id: userId, student_id: ids[0], trigger: n.trigger, entity_key: n.entityKey, period_key: n.periodKey, reason: n.reason });
      if (!error) {
        inserted++;
        await db.from("cc_agent_events").insert({ user_id: userId, turn_id: null, seq: 0, type: "nudge.created", label: n.reason.title, payload: { trigger: n.trigger } });
      }
    }
  }
  return { inserted, students: byUser.size };
}
```

In production, the unique constraint from Task 1 is the real guard. The pre-check keeps the fake and real behavior identical.

```ts
// src/app/api/cron/agent-nudges/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { runNudgeCron } from "@/lib/cc/agent/triggers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await runNudgeCron(createAdminSupabase(), new Date());
  return NextResponse.json(result);
}
```

Add `{ "path": "/api/cron/agent-nudges", "schedule": "17 13 * * *" }` to the `crons` array in `vercel.json`. That is 13:17 UTC, morning in North America and evening in South Asia, not during school hours in either.

- [ ] **Step 4: Run it to verify it passes**

Run the Step 2 command. Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/agent/triggers.ts src/app/api/cron/agent-nudges/route.ts vercel.json src/lib/cc/agent/__tests__/triggers.test.ts
git commit -m "feat(agent-s1): deterministic weekly nudges for plan conflicts, stalled essays and inactivity" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 6: Inbox, activity log and nudge controls (API)

**Files:**
- Create: `src/app/api/cc/agent/inbox/route.ts`, `src/app/api/cc/agent/activity/route.ts`, `src/app/api/cc/agent/nudges/[id]/route.ts`, `src/lib/cc/agent/inbox.ts`
- Test: `src/lib/cc/agent/__tests__/inbox.test.ts`

**Interfaces:**
- Consumes: `signConfirmToken` (Task 3), the tables.
- Produces:

  ```ts
  export type InboxItem = { kind: "nudge"; id: string; trigger: string; title: string; detail: string; createdAt: string } | { kind: "proposal"; id: string; proposalKind: string; payload: Json; reason: string; token: string; tokenExpiresAtMs: number };
  export async function loadInbox(db: SupabaseClient, scope: AuthScope, now: Date, secret: string): Promise<InboxItem[]>;
  export async function loadActivity(db: SupabaseClient, scope: AuthScope, limit: number): Promise<{ type: string; label: string; createdAt: string }[]>;
  export async function setNudgeStatus(db: SupabaseClient, scope: AuthScope, id: string, action: "dismiss" | "snooze", now: Date): Promise<number>;
  ```

- [ ] **Step 1: Write the failing test**

```ts
// @vitest-environment node
// src/lib/cc/agent/__tests__/inbox.test.ts
import { it, expect } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadInbox, loadActivity, setNudgeStatus } from "../inbox";
import { verifyConfirmToken } from "../proposals";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P = "11111111-1111-4111-8111-111111111111";
const SECRET = "test-secret-at-least-32-characters-long";
const now = new Date("2026-10-20T12:00:00Z");
const scope = { userId: U, profileIds: [P] };
const db = () => createFakeSupabase({
  cc_agent_nudges: [
    { id: "n1", user_id: U, student_id: P, trigger: "essay_stall", reason: { title: "An essay is waiting", detail: "15 days" }, status: "open", snoozed_until: null, created_at: "2026-10-20T09:00:00Z" },
    { id: "n2", user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", student_id: "x", trigger: "inactivity", reason: { title: "x", detail: "x" }, status: "open", snoozed_until: null, created_at: "2026-10-20T09:00:00Z" },
  ],
  cc_agent_proposals: [{ id: "p1", user_id: U, student_id: P, kind: "task", payload: { title: "t", dueDate: null }, payload_hash: "h", reason: "r", status: "pending", expires_at: "2026-10-21T00:00:00Z" }],
  cc_agent_events: [{ user_id: U, type: "action.committed", label: "Saved what you confirmed", created_at: "2026-10-20T10:00:00Z" }, { user_id: "other", type: "x", label: "x", created_at: "2026-10-20T10:00:00Z" }],
});

it("returns only my open nudges and pending proposals, each proposal with a fresh valid token", async () => {
  const items = await loadInbox(db() as unknown as SupabaseClient, scope, now, SECRET);
  expect(items.map((i) => i.id)).toEqual(["n1", "p1"]);
  const p = items[1] as { token: string };
  expect(verifyConfirmToken(p.token, { id: "p1", userId: U, payloadHash: "h" }, now, SECRET)).toBe(true);
});

it("activity log is mine only, newest first", async () => {
  const log = await loadActivity(db() as unknown as SupabaseClient, scope, 50);
  expect(log).toEqual([{ type: "action.committed", label: "Saved what you confirmed", createdAt: "2026-10-20T10:00:00Z" }]);
});

it("snooze hides a nudge for 7 days; another user's nudge is 404", async () => {
  const d = db();
  expect(await setNudgeStatus(d as unknown as SupabaseClient, scope, "n1", "snooze", now)).toBe(200);
  expect(d.tables.cc_agent_nudges[0]).toMatchObject({ status: "snoozed", snoozed_until: "2026-10-27" });
  expect(await setNudgeStatus(d as unknown as SupabaseClient, scope, "n2", "dismiss", now)).toBe(404);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/inbox.test.ts`

Expected: FAIL with `Cannot find module '../inbox'`.

- [ ] **Step 3: Implement**

```ts
// src/lib/cc/agent/inbox.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthScope, Json } from "./contracts";
import { signConfirmToken } from "./proposals";

export type InboxItem =
  | { kind: "nudge"; id: string; trigger: string; title: string; detail: string; createdAt: string }
  | { kind: "proposal"; id: string; proposalKind: string; payload: Json; reason: string; token: string; tokenExpiresAtMs: number };

export async function loadInbox(db: SupabaseClient, scope: AuthScope, now: Date, secret: string): Promise<InboxItem[]> {
  const today = now.toISOString().slice(0, 10);
  const [{ data: nudges }, { data: proposals }] = await Promise.all([
    db.from("cc_agent_nudges").select("id,trigger,reason,status,snoozed_until,created_at").eq("user_id", scope.userId),
    db.from("cc_agent_proposals").select("id,kind,payload,payload_hash,reason,status,expires_at").eq("user_id", scope.userId).eq("status", "pending"),
  ]);
  const n = ((nudges ?? []) as { id: string; trigger: string; reason: { title: string; detail: string }; status: string; snoozed_until: string | null; created_at: string }[])
    .filter((x) => x.status === "open" || (x.status === "snoozed" && x.snoozed_until !== null && x.snoozed_until <= today))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((x): InboxItem => ({ kind: "nudge", id: x.id, trigger: x.trigger, title: x.reason.title, detail: x.reason.detail, createdAt: x.created_at }));
  const p = ((proposals ?? []) as { id: string; kind: string; payload: Json; payload_hash: string; reason: string; expires_at: string }[])
    .filter((x) => new Date(x.expires_at).getTime() > now.getTime())
    .map((x): InboxItem => {
      const t = signConfirmToken({ id: x.id, userId: scope.userId, payloadHash: x.payload_hash }, now, secret);
      return { kind: "proposal", id: x.id, proposalKind: x.kind, payload: x.payload, reason: x.reason, token: t.token, tokenExpiresAtMs: t.expiresAtMs };
    });
  return [...n, ...p];
}

export async function loadActivity(db: SupabaseClient, scope: AuthScope, limit: number) {
  const { data } = await db.from("cc_agent_events").select("type,label,created_at").eq("user_id", scope.userId).order("created_at", { ascending: false }).limit(limit);
  return ((data ?? []) as { type: string; label: string; created_at: string }[])
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit)
    .map((e) => ({ type: e.type, label: e.label, createdAt: e.created_at }));
}

export async function setNudgeStatus(db: SupabaseClient, scope: AuthScope, id: string, action: "dismiss" | "snooze", now: Date): Promise<number> {
  const { data } = await db.from("cc_agent_nudges").select("id").eq("id", id).eq("user_id", scope.userId).maybeSingle();
  if (!data) return 404;
  const until = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
  await db.from("cc_agent_nudges").update(action === "snooze" ? { status: "snoozed", snoozed_until: until } : { status: "dismissed" }).eq("id", id).eq("user_id", scope.userId);
  return 200;
}
```

The three route files follow the same guard pattern as `src/app/api/cc/agent/proposals/[id]/route.ts` in Task 3: `getAuthUser` → `isAgentS1User` → `createAdminSupabase` → scope. Write each one out in full:

```ts
// src/app/api/cc/agent/inbox/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getStudentProfileIds } from "@/lib/cc/ownership";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { loadInbox } from "@/lib/cc/agent/inbox";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const secret = process.env.AGENT_CONFIRM_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: "agent_disabled" }, { status: 503 });
  const db = createAdminSupabase();
  const scope = { userId: user.id, profileIds: await getStudentProfileIds(db, user.id) };
  return NextResponse.json({ items: await loadInbox(db, scope, new Date(), secret) }, { headers: { "Cache-Control": "no-store" } });
}
```

```ts
// src/app/api/cc/agent/activity/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { loadActivity } from "@/lib/cc/agent/inbox";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const items = await loadActivity(createAdminSupabase(), { userId: user.id, profileIds: [] }, 100);
  return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
```

```ts
// src/app/api/cc/agent/nudges/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { setNudgeStatus } from "@/lib/cc/agent/inbox";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  if (action !== "dismiss" && action !== "snooze") return NextResponse.json({ error: "unknown_action" }, { status: 400 });
  const status = await setNudgeStatus(createAdminSupabase(), { userId: user.id, profileIds: [] }, (await params).id, action, new Date());
  return NextResponse.json({ ok: status === 200 }, { status });
}
```

- [ ] **Step 4: Run it to verify it passes**

Run the Step 2 command. Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/agent/inbox.ts src/app/api/cc/agent/inbox/route.ts src/app/api/cc/agent/activity/route.ts "src/app/api/cc/agent/nudges/[id]/route.ts" src/lib/cc/agent/__tests__/inbox.test.ts
git commit -m "feat(agent-s1): inbox with fresh confirm tokens, activity log and nudge snooze/dismiss" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 7: Proposal cards, "Kairos noticed" inbox and activity log UI

**Files:**
- Create: `src/components/cc/agent/ProposalCard.tsx`, `src/components/cc/agent/KairosInbox.tsx`, `src/components/cc/agent/ActivityLog.tsx`, `src/components/cc/agent/agent.css`
- Modify: `src/components/cc/today/TodayDashboard.tsx`. When the server passes `agentEnabled`, render `<KairosInbox />` inside the next-step region (Amendment C4: one Coach door; the inbox sits in the step card, not as a new door).
- Modify: `src/app/cc/dashboard/page.tsx`, passing `agentEnabled={isAgentS1User(user.id)}`.
- Test: `src/components/cc/agent/__tests__/ProposalCard.test.tsx`

**Interfaces:**
- Consumes: `InboxItem` (Task 6), and `POST /api/cc/agent/proposals/[id]` with `{action, token}` (Task 3).
- Produces:

  ```tsx
  export function ProposalCard(props: { item: Extract<InboxItem, { kind: "proposal" }>; onDone?: () => void }): JSX.Element;
  export function KairosInbox(): JSX.Element | null;
  export function ActivityLog(): JSX.Element;
  ```

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/cc/agent/__tests__/ProposalCard.test.tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProposalCard } from "../ProposalCard";

const item = { kind: "proposal" as const, id: "p1", proposalKind: "task", payload: { title: "Draft your Why Michigan answer", dueDate: "2026-10-28" }, reason: "Michigan is on your list", token: "t", tokenExpiresAtMs: Date.now() + 600000 };
afterEach(() => vi.restoreAllMocks());

describe("ProposalCard", () => {
  it("shows exactly what will change and why, with AI label and Confirm / Not now", () => {
    render(<ProposalCard item={item} />);
    expect(screen.getByText("Draft your Why Michigan answer")).toBeTruthy();
    expect(screen.getByText(/Michigan is on your list/)).toBeTruthy();
    expect(screen.getByText("AI")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Not now" })).toBeTruthy();
  });

  it("shows Saved only after the server confirms, then offers Undo", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ status: "committed", receipt: { kind: "task", taskId: "t1" } }), { status: 200 }));
    render(<ProposalCard item={item} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.queryByText("Saved")).toBeNull();
    await waitFor(() => expect(screen.getByText("Saved")).toBeTruthy());
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ action: "confirm", token: "t" });
  });

  it("shows a retry message, not Saved, when the commit fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: "commit_failed_retry" }), { status: 503 }));
    render(<ProposalCard item={item} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(screen.getByText(/didn't save/)).toBeTruthy());
    expect(screen.queryByText("Saved")).toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run --config vitest.agent-source.config.ts src/components/cc/agent/__tests__/ProposalCard.test.tsx`

Expected: FAIL with `Cannot find module '../ProposalCard'`.

- [ ] **Step 3: Implement**

```tsx
// src/components/cc/agent/ProposalCard.tsx
"use client";
import { useState } from "react";
import AiBadge from "@/components/app-shell/AiBadge";
import type { InboxItem } from "@/lib/cc/agent/inbox";
import "./agent.css";

type State = "pending" | "saving" | "saved" | "declined" | "undone" | "failed" | "expired";
type Item = Extract<InboxItem, { kind: "proposal" }>;

function summary(item: Item): string {
  const p = item.payload as Record<string, unknown>;
  if (item.proposalKind === "add_schools") return `Add ${(p.schools as { name: string }[]).map((s) => s.name).join(", ")} to your list`;
  return String(p.title ?? "");
}
function when(item: Item): string | null {
  const p = item.payload as Record<string, unknown>;
  const d = (p.dueDate ?? p.date) as string | null | undefined;
  return d ? (item.proposalKind === "calendar_hold" ? `Calendar hold on ${d}` : `Due ${d} (you can change this later)`) : null;
}

export function ProposalCard({ item, onDone }: { item: Item; onDone?: () => void }) {
  const [state, setState] = useState<State>(Date.now() > item.tokenExpiresAtMs ? "expired" : "pending");
  async function send(action: "confirm" | "decline" | "undo") {
    setState(action === "confirm" ? "saving" : state);
    const res = await fetch(`/api/cc/agent/proposals/${item.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(action === "confirm" ? { action, token: item.token } : { action }) });
    const body = (await res.json().catch(() => ({}))) as { status?: string; error?: string };
    if (!res.ok) { setState(body.error === "token_invalid_or_expired" ? "expired" : "failed"); return; }
    setState(action === "confirm" ? "saved" : action === "decline" ? "declined" : "undone");
    if (action !== "confirm") onDone?.();
  }
  const due = when(item);
  return (
    <article className="ka-card" aria-live="polite">
      <p className="ka-eyebrow">Kairos suggests <AiBadge /></p>
      <h4 className="ka-title">{summary(item)}</h4>
      {due && <p className="ka-meta">{due}</p>}
      <p className="ka-why">Why: {item.reason}</p>
      {state === "pending" && (
        <div className="ka-actions">
          <button type="button" className="ka-primary" onClick={() => send("confirm")}>Confirm</button>
          <button type="button" className="ka-quiet" onClick={() => send("decline")}>Not now</button>
        </div>
      )}
      {state === "saving" && <p className="ka-meta">Saving…</p>}
      {state === "saved" && (
        <div className="ka-actions"><p className="ka-done">Saved</p><button type="button" className="ka-quiet" onClick={() => send("undo")}>Undo</button></div>
      )}
      {state === "declined" && <p className="ka-meta">Okay — not now.</p>}
      {state === "undone" && <p className="ka-meta">Undone.</p>}
      {state === "expired" && <p className="ka-meta">This suggestion needs a refresh. Reload to see it again.</p>}
      {state === "failed" && <p className="ka-error">That didn't save. Try again in a moment.</p>}
    </article>
  );
}
```

```tsx
// src/components/cc/agent/KairosInbox.tsx
"use client";
import { useEffect, useState } from "react";
import type { InboxItem } from "@/lib/cc/agent/inbox";
import { ProposalCard } from "./ProposalCard";
import "./agent.css";

export function KairosInbox() {
  const [items, setItems] = useState<InboxItem[] | null>(null);
  const load = () => fetch("/api/cc/agent/inbox").then((r) => (r.ok ? r.json() : { items: [] })).then((b) => setItems(b.items ?? [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);
  if (!items || items.length === 0) return null;
  async function nudge(id: string, action: "dismiss" | "snooze") {
    await fetch(`/api/cc/agent/nudges/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    load();
  }
  return (
    <section className="ka-inbox" aria-labelledby="ka-inbox-h">
      <h3 id="ka-inbox-h" className="ka-eyebrow">Kairos noticed</h3>
      {items.map((it) => it.kind === "nudge" ? (
        <article key={it.id} className="ka-card">
          <h4 className="ka-title">{it.title}</h4>
          <p className="ka-why">{it.detail}</p>
          <div className="ka-actions">
            <button type="button" className="ka-quiet" onClick={() => nudge(it.id, "snooze")}>Remind me next week</button>
            <button type="button" className="ka-quiet" onClick={() => nudge(it.id, "dismiss")}>Dismiss</button>
          </div>
        </article>
      ) : <ProposalCard key={it.id} item={it} onDone={load} />)}
    </section>
  );
}
```

```tsx
// src/components/cc/agent/ActivityLog.tsx
"use client";
import { useEffect, useState } from "react";
import "./agent.css";

export function ActivityLog() {
  const [items, setItems] = useState<{ type: string; label: string; createdAt: string }[] | null>(null);
  useEffect(() => { fetch("/api/cc/agent/activity").then((r) => (r.ok ? r.json() : { items: [] })).then((b) => setItems(b.items ?? [])).catch(() => setItems([])); }, []);
  if (items === null) return <p className="ka-meta">Loading what Kairos did…</p>;
  if (items.length === 0) return <p className="ka-meta">Nothing yet. When Kairos checks something or you confirm a suggestion, it shows here.</p>;
  return (
    <ol className="ka-log" aria-label="What Kairos did and why">
      {items.map((e, i) => (
        <li key={i}><span className="ka-log-label">{e.label}</span> <time className="ka-meta" dateTime={e.createdAt}>{new Date(e.createdAt).toLocaleString()}</time></li>
      ))}
    </ol>
  );
}
```

```css
/* src/components/cc/agent/agent.css: Daybreak tokens from app-frame.css. Astra's D4.3 restyles these classes later. */
.ka-inbox { display: grid; gap: 12px; margin: 16px 0; }
.ka-card { border: 1px solid var(--af-line, #e7dccd); border-radius: 14px; padding: 16px; background: var(--af-paper, #fffaf3); }
.ka-eyebrow { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--af-sage-ink, #3c5a4b); margin: 0 0 6px; }
.ka-title { font-size: 16px; font-weight: 700; margin: 0 0 4px; color: var(--af-ink, #2a211b); }
.ka-why, .ka-meta { font-size: 14px; color: var(--af-ink-soft, #5c4f45); margin: 4px 0; }
.ka-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; align-items: center; }
.ka-primary, .ka-quiet { min-height: 44px; padding: 0 16px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; }
.ka-primary { background: var(--af-clay, #a3462c); color: #fff; border: 0; }
.ka-quiet { background: transparent; border: 1px solid var(--af-line, #e7dccd); color: var(--af-ink, #2a211b); }
.ka-done { font-weight: 700; color: var(--af-sage-ink, #3c5a4b); margin: 0; }
.ka-error { color: #9b2c1f; font-size: 14px; }
.ka-log { list-style: none; padding: 0; display: grid; gap: 8px; }
.ka-log-label { font-weight: 600; }
```

In `TodayDashboard.tsx`, add the prop `agentEnabled?: boolean`. Directly after the next-step card's closing tag, add `{agentEnabled ? <KairosInbox /> : null}`, and import it from `@/components/cc/agent/KairosInbox`. Add one test to `src/components/cc/today/__tests__/TodayDashboard.test.tsx` asserting that the inbox does not render when `agentEnabled` is false. Mock `KairosInbox` with `vi.mock("@/components/cc/agent/KairosInbox", () => ({ KairosInbox: () => <p>inbox</p> }))` and assert that `queryByText("inbox")` is null.

- [ ] **Step 4: Run them to verify they pass**

Run: `npx vitest run --config vitest.agent-source.config.ts src/components/cc/agent/__tests__/ProposalCard.test.tsx src/components/cc/today/__tests__/TodayDashboard.test.tsx`

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/cc/agent/ProposalCard.tsx src/components/cc/agent/KairosInbox.tsx src/components/cc/agent/ActivityLog.tsx src/components/cc/agent/agent.css src/components/cc/agent/__tests__/ProposalCard.test.tsx src/components/cc/today/TodayDashboard.tsx src/components/cc/today/__tests__/TodayDashboard.test.tsx src/app/cc/dashboard/page.tsx
git commit -m "feat(agent-s1): proposal cards, Kairos noticed inbox on Today and activity log" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 8: Golden-set scorer and runner (deterministic checks)

**Files:**
- Create:
  - `src/lib/cc/agent/golden/score.ts`;
  - `src/lib/cc/agent/golden/seed-40.json`, transcribed from `docs/research/2026-09-27-agent-differentiation-research.md` §4 into the schema below. If research Part 4 (`docs/research/2026-10-03-golden-set.json`) has landed, take the first 40 cases from it instead, keeping its `official_source_url` values;
  - `scripts/agent-golden-run.ts`.
- Test: `src/lib/cc/agent/__tests__/golden-score.test.ts`

**Interfaces:**
- Consumes: `runS1Turn` (Task 4) for live runs only.
- Produces:

  ```ts
  export type GoldenCase = { id: string; question: string; task_family: string; expected_tools: string[]; must_abstain: boolean; forbidden_patterns: string[]; required_phrases_any?: string[] };
  export type Observed = { toolsCalled: string[]; text: string; evidenceValues: string[] };
  export type Score = { id: string; pass: boolean; failures: string[] };
  export function scoreCase(c: GoldenCase, o: Observed): Score;
  ```

- [ ] **Step 1: Write the failing test**

```ts
// @vitest-environment node
// src/lib/cc/agent/__tests__/golden-score.test.ts
import { it, expect } from "vitest";
import seed from "../golden/seed-40.json";
import { scoreCase, type GoldenCase } from "../golden/score";

const conflict: GoldenCase = { id: "g1", question: "Can I do Harvard REA and Northwestern EA?", task_family: "deadlines_requirements", expected_tools: ["check_plan_conflicts"], must_abstain: false, forbidden_patterns: ["\\byes\\b, you can"], required_phrases_any: ["conflict", "can't", "cannot"] };

it("passes when the expected tool ran and no forbidden pattern appears", () => {
  expect(scoreCase(conflict, { toolsCalled: ["check_plan_conflicts"], text: "Harvard's REA conflicts with private EA, so you can't do both.", evidenceValues: [] }).pass).toBe(true);
});

it("fails when the expected tool was skipped", () => {
  expect(scoreCase(conflict, { toolsCalled: [], text: "That conflicts.", evidenceValues: [] }).failures).toContain("missing_tool:check_plan_conflicts");
});

it("fails any date that is not in tool evidence", () => {
  const c: GoldenCase = { ...conflict, expected_tools: [], required_phrases_any: undefined };
  expect(scoreCase(c, { toolsCalled: [], text: "MIT EA is November 1.", evidenceValues: [] }).failures).toContain("ungrounded_date:November 1");
});

it("abstain cases must not contain a confident answer", () => {
  const c: GoldenCase = { id: "g2", question: "What are my chances at Harvard?", task_family: "school_list", expected_tools: [], must_abstain: true, forbidden_patterns: ["\\d{1,2}%", "you will get in"] };
  expect(scoreCase(c, { toolsCalled: [], text: "You have a 12% chance.", evidenceValues: [] }).pass).toBe(false);
});

it("the seed file has 40 well-formed cases with at least 8 abstain cases", () => {
  const cases = seed as GoldenCase[];
  expect(cases).toHaveLength(40);
  expect(new Set(cases.map((c) => c.id)).size).toBe(40);
  expect(cases.filter((c) => c.must_abstain).length).toBeGreaterThanOrEqual(8);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run --config vitest.agent-source.config.ts src/lib/cc/agent/__tests__/golden-score.test.ts`

Expected: FAIL with `Cannot find module '../golden/seed-40.json'`.

- [ ] **Step 3: Implement**

```ts
// src/lib/cc/agent/golden/score.ts
export type GoldenCase = { id: string; question: string; task_family: string; expected_tools: string[]; must_abstain: boolean; forbidden_patterns: string[]; required_phrases_any?: string[] };
export type Observed = { toolsCalled: string[]; text: string; evidenceValues: string[] };
export type Score = { id: string; pass: boolean; failures: string[] };

const MONTHS = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE_RE = new RegExp(`\\b(?:\\d{4}-\\d{2}-\\d{2}|${MONTHS}\\.? \\d{1,2}(?:st|nd|rd|th)?(?:,? \\d{4})?)\\b`, "g");
const ABSTAIN_MARKERS = /\b(can't predict|cannot predict|not yet published|don't have a verified|I can check|not able to|can't do that|You write every word)\b/i;

export function scoreCase(c: GoldenCase, o: Observed): Score {
  const failures: string[] = [];
  for (const t of c.expected_tools) if (!o.toolsCalled.includes(t)) failures.push(`missing_tool:${t}`);
  for (const p of c.forbidden_patterns) if (new RegExp(p, "i").test(o.text)) failures.push(`forbidden:${p}`);
  for (const d of o.text.match(DATE_RE) ?? []) if (!o.evidenceValues.some((v) => v.includes(d))) failures.push(`ungrounded_date:${d}`);
  if (c.must_abstain && !ABSTAIN_MARKERS.test(o.text)) failures.push("missing_abstention");
  if (c.required_phrases_any && !c.required_phrases_any.some((p) => o.text.toLowerCase().includes(p.toLowerCase()))) failures.push("missing_required_phrase");
  return { id: c.id, pass: failures.length === 0, failures };
}
```

`seed-40.json` must contain exactly 40 objects in the `GoldenCase` shape. Transcribe from the research seeds:
- Map each seed's family to `task_family`.
- Set `expected_tools` from the tool names in the interface above. Use `[]` when no tool applies.
- Mark every "write my essay", "my chances", "not yet published", "log into my portal", medical/legal and "claim a human counselor's results" case as `must_abstain: true`.

Writing the file is transcription. The test pins its size and shape.

```ts
// scripts/agent-golden-run.ts
// Live golden run against the S1 loop. Spends provider money: requires
// AGENT_GOLDEN_BUDGET_USD (founder-approved) and runs on a synthetic test user only.
import seed from "../src/lib/cc/agent/golden/seed-40.json";
import { scoreCase, type GoldenCase } from "../src/lib/cc/agent/golden/score";

const budget = Number(process.env.AGENT_GOLDEN_BUDGET_USD ?? "0");
if (!(budget > 0)) {
  console.error("Refusing to run: set AGENT_GOLDEN_BUDGET_USD to a founder-approved amount.");
  process.exit(2);
}
const results = (seed as GoldenCase[]).map((c) => ({ id: c.id, question: c.question }));
console.log(`Prepared ${results.length} cases. Wire runS1Turn with a synthetic AuthScope and record { toolsCalled, text, evidenceValues } per case, then score with scoreCase.`);
void scoreCase;
```

The live runner deliberately stops at preparation. Wiring live spend is the founder-approved step after this plan, per CTO memo §2. Its offline guard is the refusal above.

- [ ] **Step 4: Run it to verify it passes**

Run the Step 2 command. Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cc/agent/golden/score.ts src/lib/cc/agent/golden/seed-40.json scripts/agent-golden-run.ts src/lib/cc/agent/__tests__/golden-score.test.ts
git commit -m "feat(agent-s1): golden-set deterministic scorer and 40-case seed" -m "Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

## After Task 8 (controller, outside the plan)

1. Run the full source suite: `npx vitest run src --config vitest.agent-source.config.ts`. Then run `npx tsc --noEmit -p .` and `next build`.
2. With founder approval, apply `supabase/migrations/20261003_agent_s1.sql` to production.
3. Set these in Vercel:
   - `AGENT_CONFIRM_SECRET` (32+ random characters);
   - `AGENT_S1_ENABLED=1`;
   - `AGENT_S1_USER_IDS` set to the QA accounts first, then pilot students;
   - the A1 `OPENROUTER_AGENT_*` model variables, after the A1 compatibility probe passes.
4. Smoke test on production with a QA student:
   - a REA+EA conflict appears in "Kairos noticed" after the cron runs (trigger it with the cron secret);
   - a proposed task confirms once;
   - Undo works;
   - the activity log shows each step;
   - an unflagged account sees no change.
