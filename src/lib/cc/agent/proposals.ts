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
      operation_key: operationKey, reason: args.reason, status: "pending", expires_at: new Date(ctx.now.getTime() + PROPOSAL_TTL_MS).toISOString(),
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
