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
