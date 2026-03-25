/**
 * Langfuse tracing for AI agent observability.
 * Traces every LLM call with: user ID, lesson context, model, tokens, latency.
 * View traces at: https://cloud.langfuse.com
 */

import { Langfuse } from "langfuse";

let _langfuse: Langfuse | null = null;

function getLangfuse(): Langfuse | null {
  if (_langfuse) return _langfuse;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  if (!secretKey || !publicKey) return null;

  _langfuse = new Langfuse({
    secretKey,
    publicKey,
    baseUrl: process.env.LANGFUSE_BASE_URL || "https://us.cloud.langfuse.com",
  });
  return _langfuse;
}

/**
 * Trace an LLM generation for observability.
 * Non-blocking — never fails the request if tracing fails.
 */
export async function traceGeneration(params: {
  userId: string;
  traceId?: string;
  name: string; // e.g., "coach-text", "coach-voice", "language-tutor"
  model: string;
  input: { systemPrompt: string; userMessage: string; lessonTitle?: string; courseTitle?: string };
  output?: string;
  tokens?: { input: number; output: number };
  latencyMs?: number;
  metadata?: Record<string, unknown>;
}) {
  try {
    const langfuse = getLangfuse();
    if (!langfuse) return;

    const trace = langfuse.trace({
      id: params.traceId,
      name: params.name,
      userId: params.userId,
      metadata: {
        lessonTitle: params.input.lessonTitle,
        courseTitle: params.input.courseTitle,
        model: params.model,
        ...params.metadata,
      },
    });

    trace.generation({
      name: `${params.name}-generation`,
      model: params.model,
      input: [
        { role: "system", content: params.input.systemPrompt.slice(0, 2000) },
        { role: "user", content: params.input.userMessage.slice(0, 1000) },
      ],
      output: params.output,
      usage: params.tokens ? {
        input: params.tokens.input,
        output: params.tokens.output,
      } : undefined,
      metadata: {
        latencyMs: params.latencyMs,
        hasLessonContent: params.input.userMessage.includes("LESSON CONTENT"),
      },
    });

    // Flush in background — don't block the response
    langfuse.flushAsync().catch(() => {});
  } catch {
    // Tracing should never break the app
  }
}

/**
 * Log a user event (lesson opened, course started, etc.)
 */
export function traceEvent(userId: string, eventName: string, metadata?: Record<string, unknown>) {
  try {
    const langfuse = getLangfuse();
    if (!langfuse) return;

    const trace = langfuse.trace({
      name: eventName,
      userId,
      metadata,
    });
    trace.event({ name: eventName, metadata });
    langfuse.flushAsync().catch(() => {});
  } catch {}
}
