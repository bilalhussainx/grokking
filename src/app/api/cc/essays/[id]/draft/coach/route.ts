import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../../../helpers";
import { buildEssayContext, getDraftCoachSystemPrompt } from "@/lib/cc/essay-helpers";
import { streamLLM, collectStream, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_draft_coach");
  if (!ok) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx) return NextResponse.json({ error: "Essay not found" }, { status: 404 });

  const body = await req.json();
  const {
    message,
    draftText,
    selectedThemes,
    history,
  } = body as {
    message: string;
    draftText: string;
    selectedThemes?: string[];
    history?: { role: "user" | "assistant"; content: string }[];
  };

  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  const systemPrompt = getDraftCoachSystemPrompt(ctx, draftText || "", selectedThemes || []);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...(history || []).map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: message },
  ];

  const result = await streamLLM(messages, { maxTokens: 400, temperature: 0.5 });
  if (!result) return NextResponse.json({ error: "LLM unavailable" }, { status: 503 });

  const fullText = await collectStream(result.stream);

  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fullText));
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
