import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getReviewSystemPrompt } from "@/lib/cc/essay-helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";
import { assertCapacity, blockedResponse } from "@/lib/cc/tier-gate";

interface ReviewComment {
  paragraphIndex: number;
  type: string;
  text: string;
  severity: string;
}

interface ScoreBreakdown {
  promptFit: number;
  voiceAuthenticity: number;
  specificity: number;
  reflectionDepth: number;
  structuralCraft: number;
  applicationFit: number;
}

interface ReviewResult {
  overallScore?: number;
  scoreBreakdown?: ScoreBreakdown;
  strengths?: string[];
  suggestedNextStep?: "polish" | "restructure" | "re-brainstorm" | "ready";
  nextStepReason?: string;
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

  // Tier gate: essay reviews are the Pro-purchase trigger. Free users get 1
  // lifetime review; guests get none; Pro is unlimited. Supplements require Pro.
  const db = createAdminSupabase();

  // Check if this essay is a supplement — if so, require Pro unconditionally.
  const { data: essayMeta } = await db
    .from("cc_essays")
    .select("id, essay_type, school_id, student_id")
    .eq("id", id)
    .maybeSingle();

  if (essayMeta?.essay_type && essayMeta.essay_type.startsWith("supplement")) {
    const suppCheck = await assertCapacity(auth.user.id, "supplementsAllowed", null);
    if (!suppCheck.ok) return blockedResponse(suppCheck);
  }

  // Count existing reviews (essays with revision_comments IS NOT NULL) for
  // this student across their whole history.
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (profile) {
    const { count: priorReviews } = await db
      .from("cc_essays")
      .select("id", { count: "exact", head: true })
      .eq("student_id", profile.id)
      .not("revision_comments", "is", null);

    const reviewCheck = await assertCapacity(
      auth.user.id,
      "reviewsMax",
      priorReviews ?? 0
    );
    if (!reviewCheck.ok) return blockedResponse(reviewCheck);
  }

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_review");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx || !ctx.currentDraft) {
    return NextResponse.json({ error: "No draft to review" }, { status: 400 });
  }

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

  // Bumped from 2000 → 4000. The new review schema carries overallScore +
  // 6-axis scoreBreakdown + 3-5 strengths + suggestedNextStep + up to 12
  // variable comments — richer than the old fixed-7 shape.
  const review = await callLLMJSON<ReviewResult>(messages, { maxTokens: 4000 });

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
