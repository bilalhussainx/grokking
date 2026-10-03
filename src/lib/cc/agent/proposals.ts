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
// A row left 'committing' longer than this belongs to a crashed commit; the next confirm finishes it.
const SAVING_MS = 30 * 1000;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAC = /^[0-9a-f]{64}$/;

// The pattern alone accepts 2027-02-29; a real date survives the round trip through Date.
function isDate(v: unknown): v is string {
  if (typeof v !== "string" || !DATE.test(v)) return false;
  const ms = Date.parse(`${v}T00:00:00Z`);
  return !Number.isNaN(ms) && new Date(ms).toISOString().slice(0, 10) === v;
}

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
  if (name === "propose_task" && (!str(a.title, 3, 120) || !(a.dueDate === null || isDate(a.dueDate)))) throw new Error("invalid_tool_arguments");
  if (name === "propose_calendar_hold" && (!str(a.title, 3, 120) || !isDate(a.date))) throw new Error("invalid_tool_arguments");
  if (name === "propose_add_schools" && (!Array.isArray(a.schoolIds) || a.schoolIds.length < 1 || a.schoolIds.length > 5 || new Set(a.schoolIds).size !== a.schoolIds.length || !a.schoolIds.every(isUuid))) throw new Error("invalid_tool_arguments");
  return a as Record<string, Json>;
}

// jsonb does not keep object key order (it stores shorter keys first), so
// every hash is over JSON with keys sorted recursively.
export function canonicalJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map((x) => canonicalJson(x === undefined ? null : x)).join(",")}]`;
  if (v !== null && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o).filter((k) => o[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(o[k])}`).join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}

const hash = (v: unknown) => crypto.createHash("sha256").update(canonicalJson(v)).digest("hex");

// Domain row ids derive from the proposal id, so a retried or recovered
// commit re-inserts the same ids and hits the primary key instead of
// creating a second row.
function uuidFrom(seed: string): string {
  const b = crypto.createHash("sha256").update(seed).digest().subarray(0, 16);
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const x = b.toString("hex");
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}

export function signConfirmToken(p: { id: string; userId: string; payloadHash: string }, now: Date, secret: string) {
  const expiresAtMs = now.getTime() + TOKEN_MS;
  const mac = crypto.createHmac("sha256", secret).update(`${p.id}|${p.userId}|${p.payloadHash}|${expiresAtMs}`).digest("hex");
  return { token: `${expiresAtMs}.${mac}`, expiresAtMs };
}

export function verifyConfirmToken(token: string, p: { id: string; userId: string; payloadHash: string }, now: Date, secret: string): boolean {
  const [exp, mac] = token.split(".");
  const expiresAtMs = Number(exp);
  // The shape check keeps timingSafeEqual from throwing on multi-byte input.
  if (!Number.isFinite(expiresAtMs) || !mac || !MAC.test(mac) || now.getTime() > expiresAtMs) return false;
  const want = crypto.createHmac("sha256", secret).update(`${p.id}|${p.userId}|${p.payloadHash}|${expiresAtMs}`).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(want));
}

export function makeProposalTools(db: SupabaseClient, scope: AuthScope, ctx: { turnId: string | null; now: Date }) {
  // Users can own several profile rows; pick one deterministically.
  const studentId = [...scope.profileIds].sort()[0] ?? null;
  return async (name: ProposalToolName, args: Record<string, Json>, signal?: AbortSignal): Promise<ToolReply> => {
    if (!studentId) return { status: "unknown", data: { reason: "no_student_profile" }, evidence: [] };
    // A1 final review I2: a turn that already timed out must not leave a confirmable proposal.
    signal?.throwIfAborted();
    const kind = KIND[name];
    let payload: Record<string, Json>;
    if (kind === "add_schools") {
      const wanted = args.schoolIds as string[];
      if (!Array.isArray(wanted) || !wanted.every(isUuid)) return { status: "unknown", data: { reason: "school_not_in_catalog_or_already_listed" }, evidence: [] };
      const { data: catalog, error } = await db.from("cc_schools").select("id,name").in("id", wanted);
      if (error) return { status: "retryable_error", data: null, evidence: [] };
      const { data: existing, error: listError } = await db.from("cc_student_schools").select("school_id").in("student_id", [...scope.profileIds]);
      if (listError) return { status: "retryable_error", data: null, evidence: [] };
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
    let proposalId = (data as { id: string } | null)?.id ?? null;
    if (error?.code === "23505") {
      // The same proposal was already made (same turn, or both outside a turn): hand that one back.
      const { data: prior } = await db.from("cc_agent_proposals").select("id").eq("user_id", scope.userId).eq("operation_key", operationKey).maybeSingle();
      proposalId = (prior as { id: string } | null)?.id ?? null;
    } else if (error) {
      proposalId = null;
    }
    if (!proposalId) return { status: "retryable_error", data: null, evidence: [] };
    return { status: "ok", data: { proposalId, kind, payload, awaiting: "student_confirmation" }, evidence: [] };
  };
}

type ProposalRow = { id: string; user_id: string; student_id: string; turn_id: string | null; kind: ProposalKind; payload: Record<string, Json>; payload_hash: string; status: string; receipt: Json | null; expires_at: string; committed_at: string | null };
type Receipt = { kind: ProposalKind; taskId?: string; listEntryIds?: string[] };
type Result = { status: number; body: Json };

const committed = (receipt: Json | Receipt | null): Result => ({ status: 200, body: { status: "committed", receipt: receipt as Json } });
const SAVING: Result = { status: 202, body: { status: "saving" } };
const RETRY: Result = { status: 503, body: { error: "commit_failed_retry" } };

async function load(db: SupabaseClient, scope: AuthScope, id: string): Promise<ProposalRow | null> {
  if (!isUuid(id)) return null;
  const { data } = await db.from("cc_agent_proposals").select("*").eq("id", id).eq("user_id", scope.userId).maybeSingle();
  const row = data as ProposalRow | null;
  return row && scope.profileIds.includes(row.student_id) ? row : null;
}

// The ids are fixed before anything is written. add_schools re-reads the list
// so a school added since the proposal (by hand or another proposal) is skipped.
async function planReceipt(db: SupabaseClient, scope: AuthScope, row: ProposalRow): Promise<Receipt | null> {
  if (row.kind !== "add_schools") return { kind: row.kind, taskId: uuidFrom(`${row.id}:0`) };
  const { data, error } = await db.from("cc_student_schools").select("school_id").in("student_id", [...scope.profileIds]);
  if (error) return null;
  const have = new Set(((data ?? []) as { school_id: string }[]).map((r) => r.school_id));
  const schools = row.payload.schools as { id: string }[];
  return { kind: "add_schools", listEntryIds: schools.flatMap((s, i) => (have.has(s.id) ? [] : [uuidFrom(`${row.id}:${i}`)])) };
}

function domainRows(row: ProposalRow, receipt: Receipt): Record<string, Json>[] {
  if (row.kind === "add_schools") {
    const planned = new Set(receipt.listEntryIds ?? []);
    return (row.payload.schools as { id: string }[]).flatMap((s, i) => {
      const id = uuidFrom(`${row.id}:${i}`);
      return planned.has(id) ? [{ id, student_id: row.student_id, school_id: s.id, application_status: "considering" }] : [];
    });
  }
  if (!receipt.taskId) return [];
  const due = row.kind === "task" ? (row.payload.dueDate ?? null) : row.payload.date;
  return [{ id: receipt.taskId, student_id: row.student_id, title: row.payload.title, due_date: due, task_type: row.kind === "calendar_hold" ? "calendar_hold" : "agent", status: "pending" }];
}

// Steps 2 and 3 of a commit, shared by the first confirm and crash recovery.
async function finishCommit(db: SupabaseClient, scope: AuthScope, row: ProposalRow, receipt: Receipt): Promise<Result> {
  const rows = domainRows(row, receipt);
  if (rows.length) {
    const { error } = await db.from(row.kind === "add_schools" ? "cc_student_schools" : "cc_tasks").insert(rows);
    // 23505 on our deterministic primary key: an earlier attempt already inserted these rows.
    if (error && error.code !== "23505") {
      await db.from("cc_agent_proposals").update({ status: "pending", receipt: null, committed_at: null }).eq("id", row.id).eq("status", "committing");
      return RETRY;
    }
  }
  const { data: done, error } = await db.from("cc_agent_proposals").update({ status: "committed" }).eq("id", row.id).eq("status", "committing").select("id");
  if (error || !done || (done as unknown[]).length === 0) {
    const again = await load(db, scope, row.id);
    return again?.status === "committed" ? committed(again.receipt) : RETRY;
  }
  await db.from("cc_agent_events").insert({ user_id: scope.userId, turn_id: null, seq: 0, type: "action.committed", label: "Saved what you confirmed", payload: { proposalId: row.id, kind: row.kind } });
  return committed(receipt);
}

export async function commitProposal(db: SupabaseClient, scope: AuthScope, id: string, token: string, now: Date, secret: string): Promise<{ status: number; body: Json }> {
  const row = await load(db, scope, id);
  if (!row) return { status: 404, body: { error: "not_found" } };
  if (row.status === "committed") return committed(row.receipt);
  if (row.status === "committing") {
    const age = row.committed_at ? now.getTime() - new Date(row.committed_at).getTime() : 0;
    return age < SAVING_MS ? SAVING : finishCommit(db, scope, row, (row.receipt ?? { kind: row.kind }) as Receipt);
  }
  if (row.status !== "pending") return { status: 409, body: { error: `proposal_${row.status}` } };
  if (hash({ kind: row.kind, payload: row.payload }) !== row.payload_hash) return { status: 409, body: { error: "payload_changed" } };
  if (!verifyConfirmToken(token, { id, userId: scope.userId, payloadHash: row.payload_hash }, now, secret)) return { status: 409, body: { error: "token_invalid_or_expired" } };
  if (now.getTime() > new Date(row.expires_at).getTime()) {
    await db.from("cc_agent_proposals").update({ status: "expired" }).eq("id", id).eq("status", "pending");
    return { status: 409, body: { error: "proposal_expired" } };
  }
  // A proposal is confirmable only once its turn's answer reached the student (completed).
  if (row.turn_id) {
    const { data: turn, error: turnError } = await db.from("cc_agent_turns").select("status").eq("id", row.turn_id).eq("user_id", scope.userId).maybeSingle();
    if (turnError) return RETRY;
    if ((turn as { status: string } | null)?.status !== "completed") return { status: 409, body: { error: "turn_not_completed" } };
  }
  const planned = await planReceipt(db, scope, row);
  if (!planned) return RETRY;
  // Claim first: only one caller moves pending → committing, and the claim records the ids it will insert.
  const { data: claimed, error } = await db.from("cc_agent_proposals").update({ status: "committing", receipt: planned, committed_at: now.toISOString() }).eq("id", id).eq("status", "pending").select("id");
  if (error) return RETRY;
  if (!claimed || (claimed as unknown[]).length === 0) {
    const again = await load(db, scope, id);
    if (again?.status === "committed") return committed(again.receipt);
    if (again?.status === "committing") return SAVING;
    return { status: 409, body: { error: `proposal_${again?.status ?? "unknown"}` } };
  }
  return finishCommit(db, scope, row, planned);
}

export async function declineProposal(db: SupabaseClient, scope: AuthScope, id: string): Promise<{ status: number; body: Json }> {
  const row = await load(db, scope, id);
  if (!row) return { status: 404, body: { error: "not_found" } };
  if (row.status !== "pending") return { status: 409, body: { error: `proposal_${row.status}` } };
  const { data: claimed, error } = await db.from("cc_agent_proposals").update({ status: "declined" }).eq("id", id).eq("user_id", scope.userId).eq("status", "pending").select("id");
  if (error) return RETRY;
  if (!claimed || (claimed as unknown[]).length === 0) return { status: 409, body: { error: "proposal_not_pending" } };
  await db.from("cc_agent_events").insert({ user_id: scope.userId, turn_id: null, seq: 0, type: "action.declined", label: "You said not now", payload: { proposalId: id } });
  return { status: 200, body: { status: "declined" } };
}

export async function undoProposal(db: SupabaseClient, scope: AuthScope, id: string, now: Date): Promise<{ status: number; body: Json }> {
  const row = await load(db, scope, id);
  if (!row) return { status: 404, body: { error: "not_found" } };
  // Claim before touching domain rows: only the caller that moves committed → undone deletes anything.
  const cutoff = new Date(now.getTime() - UNDO_MS).toISOString();
  const { data: claimed, error } = await db.from("cc_agent_proposals").update({ status: "undone" })
    .eq("id", id).eq("user_id", scope.userId).eq("status", "committed").gte("committed_at", cutoff).select("receipt");
  if (error) return RETRY;
  const hit = (claimed ?? []) as { receipt: Json }[];
  if (hit.length === 0) return { status: 409, body: { error: "undo_unavailable" } };
  const r = (hit[0].receipt ?? {}) as Receipt;
  const owned = [...scope.profileIds];
  const { error: delError } = r.taskId
    ? await db.from("cc_tasks").delete().eq("id", r.taskId).in("student_id", owned)
    : r.listEntryIds?.length
      ? await db.from("cc_student_schools").delete().in("id", r.listEntryIds).in("student_id", owned).eq("application_status", "considering")
      : { error: null };
  if (delError) {
    await db.from("cc_agent_proposals").update({ status: "committed" }).eq("id", id).eq("status", "undone");
    return { status: 503, body: { error: "undo_failed_retry" } };
  }
  await db.from("cc_agent_events").insert({ user_id: scope.userId, turn_id: null, seq: 0, type: "action.undone", label: "Undone", payload: { proposalId: id } });
  return { status: 200, body: { status: "undone" } };
}
