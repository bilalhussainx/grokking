import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getReviewSystemPrompt } from "@/lib/cc/essay-helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface ReviewComment {
  paragraphIndex: number;
  type: string;
  text: string;
  severity: string;
}

interface ReviewResult {
  comments: ReviewComment[];
  overallNotes: string;
  wordCount: number;
  promptFitScore: number;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_review");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx || !ctx.currentDraft) {
    return NextResponse.json({ error: "No draft to review" }, { status: 400 });
  }

  const db = createAdminSupabase();

  await db.from("cc_essay_interactions").insert({
    essay_id: id,
    turn_type: "review_request",
    content: ctx.currentDraft,
    word_count: ctx.currentDraft.split(/\s+/).length,
  });

  const systemPrompt = getReviewSystemPrompt(ctx);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Review this draft:\n\n${ctx.currentDraft}` },
  ];

  const review = await callLLMJSON<ReviewResult>(messages, { maxTokens: 2000 });

  if (!review) {
    return NextResponse.json({ error: "Review generation failed" }, { status: 500 });
  }

  await db
    .from("cc_essays")
    .update({
      revision_comments: review,
      phase: "revise",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  return NextResponse.json({ review });
}
