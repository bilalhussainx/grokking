import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getQuickCheckSystemPrompt } from "@/lib/cc/essay-helpers";
import { streamLLM, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const body = await req.json();
  const { content } = body as { content: string };

  if (content == null) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const db = createAdminSupabase();

  const { error } = await db
    .from("cc_essays")
    .update({
      current_draft: content,
      word_count: wordCount,
      phase: "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }

  return NextResponse.json({ saved: true, word_count: wordCount });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_quick_check");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx || !ctx.currentDraft) {
    return NextResponse.json({ error: "No draft to check" }, { status: 400 });
  }

  const systemPrompt = getQuickCheckSystemPrompt(ctx);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Here is my draft:\n\n${ctx.currentDraft}` },
  ];

  const result = await streamLLM(messages, { maxTokens: 300 });
  if (!result) {
    return NextResponse.json({ error: "LLM unavailable" }, { status: 503 });
  }

  return new Response(result.stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
