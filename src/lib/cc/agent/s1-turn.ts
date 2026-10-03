// src/lib/cc/agent/s1-turn.ts
import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { agentErrorCode, runAgent } from "./loop";
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

export type S1TurnResult = { status: 200 | 409; turnId: string | null; result: { text: string; cards: Json[] } | null; error?: string };

export async function runS1Turn(i: { db: SupabaseClient; scope: AuthScope; operationKey: string; message: string; locale: string; provider: Provider; now: Date; signal: AbortSignal }): Promise<S1TurnResult> {
  const inputHash = crypto.createHash("sha256").update(JSON.stringify({ m: i.message, l: i.locale })).digest("hex");
  const { data: prior } = await i.db.from("cc_agent_turns").select("id,input_hash,status,result").eq("user_id", i.scope.userId).eq("operation_key", i.operationKey).maybeSingle();
  if (prior) {
    const p = prior as { id: string; input_hash: string; status: string; result: { text: string; cards: Json[] } | null };
    if (p.input_hash !== inputHash) return { status: 409, turnId: p.id, result: null, error: "operation_key_conflict" };
    if (p.status !== "completed" || !p.result) return { status: 409, turnId: p.id, result: null, error: "turn_not_replayable" };
    return { status: 200, turnId: p.id, result: p.result };
  }
  const { data: turn, error } = await i.db.from("cc_agent_turns").insert({ user_id: i.scope.userId, operation_key: i.operationKey, input_hash: inputHash }).select("id").single();
  if (error || !turn) return { status: 409, turnId: null, result: null, error: "operation_key_conflict" };
  const turnId = (turn as { id: string }).id;
  let seq = 0;
  const log = (type: string, label: string, payload: Json = {}) =>
    i.db.from("cc_agent_events").insert({ user_id: i.scope.userId, turn_id: turnId, seq: seq++, type, label, payload });
  await log("turn.accepted", "Started");

  if (ESSAY_WRITING_REQUEST.test(i.message)) {
    const result = { text: INTEGRITY, cards: [] as Json[] };
    await i.db.from("cc_agent_turns").update({ status: "completed", result, completed_at: i.now.toISOString() }).eq("id", turnId);
    await log("turn.completed", "Answered");
    return { status: 200, turnId, result };
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
    return { status: 200, turnId, result };
  } catch (e) {
    await i.db.from("cc_agent_turns").update({ status: "failed", completed_at: i.now.toISOString() }).eq("id", turnId);
    // Only a closed code reaches cc_agent_events (students can read it); never raw error text.
    await log("turn.failed", "Something went wrong", { code: agentErrorCode(e) });
    throw e;
  }
}
