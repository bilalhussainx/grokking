// src/lib/cc/agent/s1-tools.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthScope, Json, ReadTools, ToolReply } from "./contracts";
import { redactUngroundedDates } from "./date-check";
import { READ_TOOL_DEFINITIONS, validateToolArgs, makeReadTools } from "./read-tools";
import { JOURNEY_TOOL_DEFINITIONS, makeJourneyTools, type JourneyToolName } from "./journey-tools";
import { PROPOSAL_TOOL_DEFINITIONS, makeProposalTools, validateProposalArgs, type ProposalToolName } from "./proposals";

const JOURNEY = new Set<string>(JOURNEY_TOOL_DEFINITIONS.map((t) => t.function.name));
const PROPOSAL = new Set<string>(PROPOSAL_TOOL_DEFINITIONS.map((t) => t.function.name));
export const S1_TOOL_DEFINITIONS = [...READ_TOOL_DEFINITIONS, ...JOURNEY_TOOL_DEFINITIONS, ...PROPOSAL_TOOL_DEFINITIONS] as const;

export function validateS1ToolArgs(name: string, value: unknown): unknown {
  if (JOURNEY.has(name)) {
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length) throw new Error("invalid_tool_arguments");
    return value;
  }
  if (PROPOSAL.has(name)) return validateProposalArgs(name as ProposalToolName, value);
  return validateToolArgs(name, value);
}

export const isProposalTool = (name: string): name is ProposalToolName => PROPOSAL.has(name);

const DEADLINE_CLAIM = /\b(deadline|due|closes?|cut-?off|last day)\b/i;
const DATE_WINDOW_DAYS = 180;
const unknown = (reason: string): ToolReply => ({ status: "unknown", data: { reason }, evidence: [] });

// Proposal dates are suggestions the student confirms, allowed within
// [today, today+180d]. A date not in this turn's tool evidence may not be
// presented as a deadline. A title or reason that names an unverified date is
// refused as a whole: the student would otherwise confirm the redaction sentence.
export function groundProposal(name: ProposalToolName, args: Record<string, Json>, evidence: Json[], now: Date): { args: Record<string, Json> } | { reply: ToolReply } {
  const date = name === "propose_task" ? args.dueDate : name === "propose_calendar_hold" ? args.date : null;
  if (typeof date === "string") {
    const today = now.toISOString().slice(0, 10);
    const last = new Date(Date.parse(`${today}T00:00:00Z`) + DATE_WINDOW_DAYS * 86400000).toISOString().slice(0, 10);
    if (date < today || date > last) return { reply: unknown("date_out_of_range") };
    if (!JSON.stringify(evidence).includes(date) && DEADLINE_CLAIM.test(`${args.title ?? ""} ${args.reason ?? ""}`)) return { reply: unknown("date_not_verified") };
  }
  const changed = (v: Json | undefined) => typeof v === "string" && redactUngroundedDates({ text: v, cards: [] }, evidence).text !== v;
  if (changed(args.title) || changed(args.reason)) return { reply: unknown("date_not_verified") };
  return { args };
}

export function makeS1Tools(db: SupabaseClient, scope: AuthScope, ctx: { turnId: string | null; now: Date }): ReadTools {
  const read = makeReadTools(db, scope);
  const journey = makeJourneyTools(db, scope, ctx.now);
  const propose = makeProposalTools(db, scope, ctx);
  return async (name, args, signal) => {
    signal?.throwIfAborted();
    if (JOURNEY.has(name)) return journey(name as JourneyToolName, args as Record<string, never>, signal);
    if (PROPOSAL.has(name)) return propose(name as ProposalToolName, args as Record<string, Json>, signal);
    return read(name, args, signal);
  };
}
