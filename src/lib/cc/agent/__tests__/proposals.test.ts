// @vitest-environment node
// src/lib/cc/agent/__tests__/proposals.test.ts
import { describe, it, expect } from "vitest";
import { createFakeSupabase, type FakeResult, type FakeTables } from "@/lib/cc/__tests__/helpers/fake-supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { makeProposalTools, signConfirmToken, verifyConfirmToken, commitProposal, declineProposal, undoProposal, validateProposalArgs } from "../proposals";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P = "11111111-1111-4111-8111-111111111111";
const P_OTHER = "33333333-3333-4333-8333-333333333333";
const S_MICH = "5c000000-0000-4000-8000-000000000001";
const S_UNKNOWN = "5c000000-0000-4000-8000-000000000099";
const SECRET = "test-secret-at-least-32-characters-long";
const now = new Date("2026-10-20T12:00:00Z");
const at = (ms: number) => new Date(now.getTime() + ms);
const scope = { userId: U, profileIds: [P] } as const;
// Primary keys and the (user_id, operation_key) pair are unique, as in the migrations.
const fresh = () => createFakeSupabase(
  { cc_schools: [{ id: S_MICH, name: "University of Michigan", country: "US" }], cc_student_schools: [], cc_tasks: [], cc_agent_proposals: [], cc_agent_events: [] },
  { unique: { cc_tasks: [["id"]], cc_student_schools: [["id"]], cc_agent_proposals: [["id"], ["user_id", "operation_key"]] } },
);
type Fake = ReturnType<typeof fresh>;
const sb = (db: Fake) => db as unknown as SupabaseClient;
const rowOf = (db: Fake, id: string) => db.tables.cc_agent_proposals.find((p) => p.id === id) as Record<string, unknown>;
const tokenFor = (db: Fake, id: string) => signConfirmToken({ id, userId: U, payloadHash: rowOf(db, id).payload_hash as string }, now, SECRET).token;

async function propose(db: Fake, name: "propose_task" | "propose_add_schools" | "propose_calendar_hold", args: Record<string, unknown>, turnId: string | null = null) {
  const tools = makeProposalTools(sb(db), scope, { turnId, now });
  const r = await tools(name, args as never);
  return (r.data as { proposalId: string }).proposalId;
}

// Wraps the fake so a test can fail, crash or race one query. The hook sees
// the table, the operation and its payload just before the query runs.
type Op = "select" | "insert" | "update" | "delete";
type Hook = (table: string, op: Op, arg: unknown, tables: FakeTables) => FakeResult | "throw" | void;
function intercept(db: Fake, hook: Hook): SupabaseClient {
  return {
    from: (table: string) => {
      const q = db.from(table);
      const rec = q as unknown as Record<string, unknown>;
      let op: Op = "select";
      let arg: unknown = null;
      for (const name of ["insert", "update", "delete"] as const) {
        const orig = (rec[name] as (...a: unknown[]) => unknown).bind(q);
        rec[name] = (...a: unknown[]) => { op = name; arg = a[0]; return orig(...a); };
      }
      const then = q.then.bind(q);
      rec.then = (f?: (v: FakeResult) => unknown, r?: (e: unknown) => unknown) => {
        const h = hook(table, op, arg, db.tables);
        if (h === "throw") return Promise.reject(new Error("simulated crash")).then(f, r);
        if (h) return Promise.resolve(h).then(f, r);
        return then(f, r);
      };
      return q;
    },
  } as unknown as SupabaseClient;
}
const patchStatus = (arg: unknown) => (arg as { status?: string } | null)?.status;

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
    const res = await commitProposal(sb(db), scope, id, token, now, SECRET);
    expect(res.status).toBe(409);
    expect(db.tables.cc_tasks).toHaveLength(0);
  });

  it("confirm_twice_returns_same_receipt_and_one_row", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "Ask Ms. Lee", dueDate: "2026-10-25", reason: "r" });
    const token = tokenFor(db, id);
    const a = await commitProposal(sb(db), scope, id, token, now, SECRET);
    const b = await commitProposal(sb(db), scope, id, token, now, SECRET);
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
    expect((await commitProposal(sb(db), other, id, token, now, SECRET)).status).toBe(404);
  });

  it("tokens expire after ten minutes", () => {
    const p = { id: "p", userId: U, payloadHash: "h" };
    const { token } = signConfirmToken(p, now, SECRET);
    expect(verifyConfirmToken(token, p, at(9 * 60000), SECRET)).toBe(true);
    expect(verifyConfirmToken(token, p, at(11 * 60000), SECRET)).toBe(false);
  });

  it("add_schools only accepts catalog schools and skips ones already on the list", async () => {
    const db = fresh();
    db.tables.cc_student_schools.push({ id: "ss1", student_id: P, school_id: S_MICH });
    const tools = makeProposalTools(sb(db), scope, { turnId: null, now });
    const r = await tools("propose_add_schools", { schoolIds: [S_MICH, S_UNKNOWN], reason: "r" } as never);
    expect(r.status).toBe("unknown");
  });

  it("an aborted turn inserts no proposal", async () => {
    const db = fresh();
    const tools = makeProposalTools(sb(db), scope, { turnId: null, now });
    await expect(tools("propose_task", { title: "x", dueDate: null, reason: "r" } as never, AbortSignal.abort())).rejects.toThrow();
    expect(db.tables.cc_agent_proposals).toHaveLength(0);
  });

  it("decline and undo leave the domain consistent", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "x", dueDate: null, reason: "r" });
    await commitProposal(sb(db), scope, id, tokenFor(db, id), now, SECRET);
    expect((await undoProposal(sb(db), scope, id, at(5 * 60000))).status).toBe(200);
    expect(db.tables.cc_tasks).toHaveLength(0);
    const id2 = await propose(db, "propose_task", { title: "y", dueDate: null, reason: "r" });
    expect((await declineProposal(sb(db), scope, id2)).status).toBe(200);
    expect(rowOf(db, id2)).toMatchObject({ status: "declined" });
  });

  // C1: jsonb stores object keys shortest-first, so {title,date} comes back as {date,title}.
  it("commit accepts a key-reordered payload (jsonb round trip) but not a changed value", async () => {
    const db = fresh();
    const id = await propose(db, "propose_calendar_hold", { title: "Michigan EA hold", date: "2026-11-01", reason: "r" });
    const token = tokenFor(db, id);
    rowOf(db, id).payload = { date: "2026-11-01", title: "Michigan EA hold" };
    const ok = await commitProposal(sb(db), scope, id, token, now, SECRET);
    expect(ok.status).toBe(200);
    expect(db.tables.cc_tasks).toHaveLength(1);

    const id2 = await propose(db, "propose_calendar_hold", { title: "Michigan RD hold", date: "2026-11-01", reason: "r" });
    const token2 = tokenFor(db, id2);
    rowOf(db, id2).payload = { date: "2026-11-02", title: "Michigan RD hold" };
    expect((await commitProposal(sb(db), scope, id2, token2, now, SECRET)).status).toBe(409);
    expect(db.tables.cc_tasks).toHaveLength(1);
  });

  // I2: claim as 'committing' with deterministic ids, then insert, then mark committed.
  it("a crash after the insert completes on a later confirm with exactly one task", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "Ask Ms. Lee", dueDate: "2026-10-25", reason: "r" });
    const token = tokenFor(db, id);
    const crashing = intercept(db, (t, op, arg) => (t === "cc_agent_proposals" && op === "update" && patchStatus(arg) === "committed" ? "throw" : undefined));
    await expect(commitProposal(crashing, scope, id, token, now, SECRET)).rejects.toThrow("simulated crash");
    expect(rowOf(db, id)).toMatchObject({ status: "committing" });
    expect(db.tables.cc_tasks).toHaveLength(1);

    expect(await commitProposal(sb(db), scope, id, token, at(5000), SECRET)).toEqual({ status: 202, body: { status: "saving" } });
    const later = await commitProposal(sb(db), scope, id, token, at(31000), SECRET);
    expect(later.status).toBe(200);
    expect(db.tables.cc_tasks).toHaveLength(1);
    expect((later.body as { receipt: { taskId: string } }).receipt.taskId).toBe(db.tables.cc_tasks[0].id);
    expect(rowOf(db, id)).toMatchObject({ status: "committed" });
  });

  it("a crash before the insert completes on a later confirm with exactly one task", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "Ask Ms. Lee", dueDate: "2026-10-25", reason: "r" });
    const token = tokenFor(db, id);
    const crashing = intercept(db, (t, op) => (t === "cc_tasks" && op === "insert" ? "throw" : undefined));
    await expect(commitProposal(crashing, scope, id, token, now, SECRET)).rejects.toThrow("simulated crash");
    expect(rowOf(db, id)).toMatchObject({ status: "committing" });
    expect(db.tables.cc_tasks).toHaveLength(0);

    const later = await commitProposal(sb(db), scope, id, token, at(31000), SECRET);
    expect(later.status).toBe(200);
    expect(db.tables.cc_tasks).toHaveLength(1);
    expect(db.tables.cc_agent_events.filter((e) => e.type === "action.committed")).toHaveLength(1);
  });

  it("an insert error reverts the claim to pending and a retry saves one row", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "Ask Ms. Lee", dueDate: "2026-10-25", reason: "r" });
    const token = tokenFor(db, id);
    const failing = intercept(db, (t, op) => (t === "cc_tasks" && op === "insert" ? { data: null, error: { message: "connection reset", code: "08006" } } : undefined));
    expect((await commitProposal(failing, scope, id, token, now, SECRET)).status).toBe(503);
    expect(rowOf(db, id)).toMatchObject({ status: "pending", receipt: null, committed_at: null });
    expect(db.tables.cc_tasks).toHaveLength(0);
    expect((await commitProposal(sb(db), scope, id, token, now, SECRET)).status).toBe(200);
    expect(db.tables.cc_tasks).toHaveLength(1);
  });

  // I3: undo and decline claim first and only act if the claim matched.
  it("undo that loses its claim to a concurrent undo deletes nothing", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "x", dueDate: null, reason: "r" });
    await commitProposal(sb(db), scope, id, tokenFor(db, id), now, SECRET);
    const racing = intercept(db, (t, op, arg, tables) => {
      if (t === "cc_agent_proposals" && op === "update" && patchStatus(arg) === "undone") {
        (tables.cc_agent_proposals.find((p) => p.id === id) as Record<string, unknown>).status = "undone";
      }
    });
    expect((await undoProposal(racing, scope, id, at(60000))).status).toBe(409);
    expect(db.tables.cc_tasks).toHaveLength(1);
  });

  it("undo is 409 and deletes nothing unless committed within ten minutes", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "x", dueDate: null, reason: "r" });
    expect((await undoProposal(sb(db), scope, id, now)).status).toBe(409);
    await commitProposal(sb(db), scope, id, tokenFor(db, id), now, SECRET);
    expect((await undoProposal(sb(db), scope, id, at(11 * 60000))).status).toBe(409);
    expect(db.tables.cc_tasks).toHaveLength(1);
    expect(rowOf(db, id)).toMatchObject({ status: "committed" });
  });

  it("decline after commit is 409, including when the commit lands mid-decline", async () => {
    const db = fresh();
    const id = await propose(db, "propose_task", { title: "x", dueDate: null, reason: "r" });
    await commitProposal(sb(db), scope, id, tokenFor(db, id), now, SECRET);
    expect((await declineProposal(sb(db), scope, id)).status).toBe(409);

    const id2 = await propose(db, "propose_task", { title: "y", dueDate: null, reason: "r" });
    const racing = intercept(db, (t, op, arg, tables) => {
      if (t === "cc_agent_proposals" && op === "update" && patchStatus(arg) === "declined") {
        (tables.cc_agent_proposals.find((p) => p.id === id2) as Record<string, unknown>).status = "committed";
      }
    });
    expect((await declineProposal(racing, scope, id2)).status).toBe(409);
    expect(rowOf(db, id2)).toMatchObject({ status: "committed" });
  });

  // I4: the list is re-read at commit.
  it("two pending proposals for the same school leave one list row", async () => {
    const db = fresh();
    const a = await propose(db, "propose_add_schools", { schoolIds: [S_MICH], reason: "r" }, "aaaa0000-0000-4000-8000-000000000001");
    const b = await propose(db, "propose_add_schools", { schoolIds: [S_MICH], reason: "r" }, "aaaa0000-0000-4000-8000-000000000002");
    expect(a).not.toBe(b);
    expect((await commitProposal(sb(db), scope, a, tokenFor(db, a), now, SECRET)).status).toBe(200);
    const second = await commitProposal(sb(db), scope, b, tokenFor(db, b), now, SECRET);
    expect(second).toEqual({ status: 200, body: { status: "committed", receipt: { kind: "add_schools", listEntryIds: [] } } });
    expect(db.tables.cc_student_schools).toHaveLength(1);
  });

  // Minors.
  it("a malformed token MAC is rejected without throwing", () => {
    const p = { id: "p", userId: U, payloadHash: "h" };
    const exp = now.getTime() + 60000;
    expect(verifyConfirmToken(`${exp}.${"é".repeat(64)}`, p, now, SECRET)).toBe(false);
    expect(verifyConfirmToken(`${exp}.${"A".repeat(64)}`, p, now, SECRET)).toBe(false);
  });

  it("re-proposing the same thing returns the existing proposal", async () => {
    const db = fresh();
    const a = await propose(db, "propose_task", { title: "Ask Ms. Lee", dueDate: null, reason: "r" });
    const b = await propose(db, "propose_task", { title: "Ask Ms. Lee", dueDate: null, reason: "r again" });
    expect(b).toBe(a);
    expect(db.tables.cc_agent_proposals).toHaveLength(1);
  });

  it("validates real calendar dates and catalog UUIDs", async () => {
    expect(() => validateProposalArgs("propose_task", { title: "abc", dueDate: "2027-02-29", reason: "rrr" })).toThrow("invalid_tool_arguments");
    expect(() => validateProposalArgs("propose_calendar_hold", { title: "abc", date: "2026-13-01", reason: "rrr" })).toThrow("invalid_tool_arguments");
    expect(validateProposalArgs("propose_task", { title: "abc", dueDate: "2028-02-29", reason: "rrr" })).toMatchObject({ dueDate: "2028-02-29" });
    expect(() => validateProposalArgs("propose_add_schools", { schoolIds: ["s-mich"], reason: "rrr" })).toThrow("invalid_tool_arguments");
    const db = fresh();
    const r = await makeProposalTools(sb(db), scope, { turnId: null, now })("propose_add_schools", { schoolIds: ["s-mich"], reason: "rrr" } as never);
    expect(r.status).toBe("unknown");
  });

  it("uses the smallest profile id and surfaces a failed list read", async () => {
    const db = fresh();
    const multi = { userId: U, profileIds: ["22222222-2222-4222-8222-222222222222", P] };
    await makeProposalTools(sb(db), multi, { turnId: null, now })("propose_task", { title: "x", dueDate: null, reason: "r" } as never);
    expect(db.tables.cc_agent_proposals[0]).toMatchObject({ student_id: P });

    const failing = intercept(db, (t) => (t === "cc_student_schools" ? { data: null, error: { message: "timeout" } } : undefined));
    const r = await makeProposalTools(failing, scope, { turnId: null, now })("propose_add_schools", { schoolIds: [S_MICH], reason: "r" } as never);
    expect(r.status).toBe("retryable_error");
  });

  it("undo only deletes list rows owned by the caller", async () => {
    const db = fresh();
    db.tables.cc_student_schools.push({ id: "5e000000-0000-4000-8000-000000000001", student_id: P_OTHER, school_id: S_MICH, application_status: "considering" });
    const id = await propose(db, "propose_add_schools", { schoolIds: [S_MICH], reason: "r" });
    await commitProposal(sb(db), scope, id, tokenFor(db, id), now, SECRET);
    const receipt = rowOf(db, id).receipt as { listEntryIds: string[] };
    receipt.listEntryIds.push("5e000000-0000-4000-8000-000000000001");
    expect((await undoProposal(sb(db), scope, id, at(60000))).status).toBe(200);
    expect(db.tables.cc_student_schools.map((r) => r.student_id)).toEqual([P_OTHER]);
  });

  it("a calendar hold receipt carries no ics link", async () => {
    const db = fresh();
    const id = await propose(db, "propose_calendar_hold", { title: "Michigan EA hold", date: "2026-11-01", reason: "r" });
    const res = await commitProposal(sb(db), scope, id, tokenFor(db, id), now, SECRET);
    expect((res.body as { receipt: Record<string, unknown> }).receipt).not.toHaveProperty("ics");
  });
});
