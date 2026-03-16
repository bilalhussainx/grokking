import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

/**
 * GET /api/language/vocab/due?language=es&limit=15
 *
 * Fetch vocabulary due for SM-2 spaced repetition review.
 */
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language");
  const limit = parseInt(searchParams.get("limit") || "15", 10);

  if (!language) {
    return NextResponse.json(
      { error: "Missing required parameter: language" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.rpc("get_due_vocab", {
      p_user_id: user.id,
      p_target_language: language,
      p_limit: limit,
    });

    if (error) {
      console.error("[Vocab Due] RPC error:", error);
      return NextResponse.json({ vocabulary: [], count: 0 });
    }

    const vocabulary = (data || []).map((v: Record<string, unknown>) => ({
      id: v.id,
      word: v.word,
      translation: v.translation,
      timesCorrect: v.times_correct,
      timesIncorrect: v.times_incorrect,
      masteryLevel: v.mastery_level,
      nextReviewAt: v.next_review_at,
    }));

    return NextResponse.json({
      vocabulary,
      count: vocabulary.length,
    });
  } catch (error) {
    console.error("[Vocab Due] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch due vocabulary" },
      { status: 500 }
    );
  }
}
