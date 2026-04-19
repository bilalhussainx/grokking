import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getBrainstormSystemPrompt } from "@/lib/cc/essay-helpers";
import { streamLLM, collectStream, type ChatMessage } from "@/lib/cc/llm-stream";
import { validateGuardrail } from "@/lib/cc/essay-guardrail";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_brainstorm");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const body = await req.json();
  const { message } = body as { message: string };
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const db = createAdminSupabase();

  await db.from("cc_essay_interactions").insert({
    essay_id: id,
    turn_type: "student_message",
    content: message,
    word_count: message.split(/\s+/).length,
  });

  const transcript: { role: string; content: string }[] = ctx.brainstormTranscript || [];
  transcript.push({ role: "user", content: message });

  const systemPrompt = getBrainstormSystemPrompt(ctx);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...transcript.map((t) => ({
      role: (t.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
      content: t.content,
    })),
  ];

  const result = await streamLLM(messages, { maxTokens: 300, temperature: 0.7 });
  if (!result) {
    return NextResponse.json({ error: "LLM unavailable" }, { status: 503 });
  }

  const fullText = await collectStream(result.stream);
  const guardrail = validateGuardrail(fullText);

  await db.from("cc_essay_interactions").insert({
    essay_id: id,
    turn_type: guardrail.passed ? "ai_response" : "ai_blocked",
    content: fullText,
    word_count: fullText.split(/\s+/).length,
    was_blocked: !guardrail.passed,
  });

  transcript.push({ role: "assistant", content: guardrail.sanitizedText });
  await db
    .from("cc_essays")
    .update({ brainstorm_transcript: transcript, updated_at: new Date().toISOString() })
    .eq("id", id);

  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(guardrail.sanitizedText));
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        ...(guardrail.passed ? {} : { "X-Guardrail-Blocked": "true" }),
      },
    }
  );
}
