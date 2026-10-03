export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type AuthScope = Readonly<{
  userId: string;
  profileIds: readonly string[];
}>;

export type Candidate = {
  text: string;
  cards: Json[];
};

export type CheckedResult = Candidate & {
  policyVersion: string;
};

export type CheckContext = {
  locale: string;
  evidence: Json[];
  priorReleased: string[];
  signal: AbortSignal;
};

export type OutputCheck = (
  candidate: Candidate,
  context: CheckContext
) => Promise<
  | { decision: "allow"; result: CheckedResult }
  | { decision: "block" | "uncertain"; reason: string }
>;

export type AgentInput = {
  message: string;
  essayId: string | null;
  locale: string;
};

export type ToolName = "read_context" | "read_essay" | "read_published_feedback";

export type ToolReply = {
  status: "ok" | "unknown" | "denied" | "retryable_error";
  data: Json;
  evidence: Json[];
};

export type ToolCall = {
  id: string;
  name: string;
  arguments: string;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_call_id?: string;
  tool_calls?: {
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }[];
};

export type ModelReply = {
  content: string | null;
  calls: ToolCall[];
};

export type Provider = (messages: ChatMessage[], signal: AbortSignal) => Promise<ModelReply>;

// The loop passes its bounded per-call signal; a tool must not start or finish work after it aborts.
export type ReadTools = (name: string, args: unknown, signal?: AbortSignal) => Promise<ToolReply>;

export type RunDeps = {
  provider: Provider;
  tools: ReadTools;
  check: OutputCheck;
  signal: AbortSignal;
  priorReleased: string[];
};

/**
 * Test-only checker fixture that unconditionally marks every candidate as uncertain.
 * Never to be wired in production routes.
 */
export const denyAllCheck: OutputCheck = async (_candidate: Candidate, _context: CheckContext) => {
  return {
    decision: "uncertain",
    reason: "Internal test-only checker stub: candidate output held back."
  };
};
