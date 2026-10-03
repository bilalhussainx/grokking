// src/lib/cc/agent/s1-tools.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthScope, Json, ReadTools } from "./contracts";
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
