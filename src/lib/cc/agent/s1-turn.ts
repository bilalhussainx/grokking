// src/lib/cc/agent/s1-turn.ts
import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { agentErrorCode, runAgent } from "./loop";
import { redactUngroundedDates, echoCheck } from "./date-check";
import { groundProposal, isProposalTool, makeS1Tools, validateS1ToolArgs } from "./s1-tools";
import type { AuthScope, Json, Provider, ToolReply } from "./contracts";

// Only imperative or for-me writing requests: "Write my intro", "Can you rewrite
// this paragraph?", "I need you to finish my essay", "... essay for me". A
// planning question ("When should I finish my essay?", "Can you look at my
// draft essay?") is not one.
const WRITE_VERB = "(?:write|draft|rewrite|rewriting|compose|finish|redo)";
const ESSAY_PIECE = "(?:essay|statement|paragraph|intro|introduction|conclusion|supplement|sentences?|(?:opening|first) line)";
const SENTENCE_START = "(?:^|[.?!,;:]\\s*)\\s*(?:(?:please|can you|could you|would you|will you)\\s+(?:(?:please|try|help me)\\s+)?)?";
export const ESSAY_WRITING_REQUEST = new RegExp([
  `${SENTENCE_START}${WRITE_VERB}\\b[^.?!]{0,40}\\b${ESSAY_PIECE}\\b`,
  `\\byou (?:to )?${WRITE_VERB}\\b[^.?!]{0,40}\\b${ESSAY_PIECE}\\b`,
  `\\b${WRITE_VERB}\\b[^.?!]{0,40}\\b${ESSAY_PIECE}\\b[^.?!]{0,20}\\bfor me\\b`,
  "\\bgive me\\b[^.?!]{0,20}\\b(?:opening|first) (?:line|sentence)\\b",
].join("|"), "i");
const INTEGRITY = "I can't write that for you — You write every word, and that's what makes it yours. I can ask you three questions to find your story, or review a draft you wrote. Open Essay Studio when you're ready.";
const LABELS: Record<string, string> = {
  get_journey_state: "Checked your next steps", list_my_schools: "Read your school list", check_plan_conflicts: "Checked your early plans for conflicts",
  get_essay_status: "Checked your essays", propose_task: "Suggested a task", propose_calendar_hold: "Suggested a calendar hold", propose_add_schools: "Suggested schools to add",
  read_context: "Read your profile", read_essay: "Read your essay", read_published_feedback: "Read your counselor's feedback",
};

export type S1TurnResult = { status: 200 | 409 | 503; turnId: string | null; result: { text: string; cards: Json[] } | null; error?: string };
type PriorTurn = { id: string; input_hash: string; status: string; result: { text: string; cards: Json[] } | null };

function fromPrior(p: PriorTurn, inputHash: string): S1TurnResult {
  if (p.input_hash !== inputHash) return { status: 409, turnId: p.id, result: null, error: "operation_key_conflict" };
  if (p.status === "running") return { status: 409, turnId: p.id, result: null, error: "turn_in_progress" };
  if (p.status !== "completed" || !p.result) return { status: 409, turnId: p.id, result: null, error: "turn_not_replayable" };
  return { status: 200, turnId: p.id, result: p.result };
}

export async function runS1Turn(i: { db: SupabaseClient; scope: AuthScope; operationKey: string; message: string; locale: string; provider: Provider; now: Date; signal: AbortSignal }): Promise<S1TurnResult> {
  const inputHash = crypto.createHash("sha256").update(JSON.stringify({ m: i.message, l: i.locale })).digest("hex");
  const readPrior = () => i.db.from("cc_agent_turns").select("id,input_hash,status,result").eq("user_id", i.scope.userId).eq("operation_key", i.operationKey).maybeSingle();
  const { data: prior } = await readPrior();
  if (prior) return fromPrior(prior as PriorTurn, inputHash);
  const { data: turn, error } = await i.db.from("cc_agent_turns").insert({ user_id: i.scope.userId, operation_key: i.operationKey, input_hash: inputHash }).select("id").single();
  if (error?.code === "23505") {
    // A concurrent request with the same key inserted first.
    const { data: winner } = await readPrior();
    return winner ? fromPrior(winner as PriorTurn, inputHash) : { status: 503, turnId: null, result: null, error: "turn_store_failed" };
  }
  if (error || !turn) return { status: 503, turnId: null, result: null, error: "turn_store_failed" };
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

  try {
    const inner = makeS1Tools(i.db, i.scope, { turnId, now: i.now });
    // Mirrors the loop's tool evidence (never request_context) so proposals are grounded like the answer.
    const toolEvidence: Json[] = [];
    const tools = async (name: string, args: unknown, signal?: AbortSignal): Promise<ToolReply> => {
      let r: ToolReply;
      const grounded = isProposalTool(name) ? groundProposal(name, args as Record<string, Json>, toolEvidence, i.now) : { args: args as Record<string, Json> };
      if ("reply" in grounded) r = grounded.reply;
      else r = await inner(name, grounded.args, signal);
      signal?.throwIfAborted(); // never log a tool result for a turn that already timed out
      toolEvidence.push(...r.evidence);
      await log(isProposalTool(name) && r.status === "ok" ? "action.preview" : "tool.completed", LABELS[name] ?? "Checked something", { tool: name, status: r.status });
      return r;
    };
    const checked = await runAgent({ message: i.message, essayId: null, locale: i.locale }, { provider: i.provider, tools, check: echoCheck, redact: redactUngroundedDates, signal: i.signal, priorReleased: [], validate: validateS1ToolArgs });
    const result = { text: checked.text, cards: checked.cards };
    await i.db.from("cc_agent_turns").update({ status: "completed", result, completed_at: i.now.toISOString() }).eq("id", turnId);
    await log("turn.completed", "Answered");
    return { status: 200, turnId, result };
  } catch (e) {
    await i.db.from("cc_agent_turns").update({ status: "failed", completed_at: i.now.toISOString() }).eq("id", turnId);
    // A failed turn's answer never reached the student, so its proposals must not stay confirmable.
    await i.db.from("cc_agent_proposals").update({ status: "expired" }).eq("turn_id", turnId).eq("status", "pending");
    // Only a closed code reaches cc_agent_events (students can read it); never raw error text.
    await log("turn.failed", "Something went wrong", { code: agentErrorCode(e) });
    throw e;
  }
}
