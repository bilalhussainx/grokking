// POST /api/cc/interview-reflection — saves a post-interview reflection +
// runs Claude to generate specific feedback. GET returns all reflections.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";
import { chatOnce } from "@/lib/cc/openrouter";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();
  const { data } = await db
    .from("interview_post_reflections")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });
  return NextResponse.json({ reflections: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    schoolName?: string;
    interviewDate?: string;
    whatWentWell?: string;
    whatWasHard?: string;
    questionsTheyAsked?: string;
    questionsIAsked?: string;
    confidenceScore?: number;
  };
  if (!body.schoolName?.trim()) {
    return NextResponse.json({ error: "Missing schoolName" }, { status: 400 });
  }

  const systemPrompt = `You give a high school senior specific, kind, actionable feedback on a college admissions interview they just finished. The student writes a free-form reflection; you respond with:

- 2-3 sentences naming what went WELL — be specific to what the student said.
- 2-3 sentences naming what to work on for the next interview — be specific. No generic 'be more confident'. Cite the actual hard moment they describe.
- 1 short closing sentence: encouraging, honest, not saccharine.

Length: 120-180 words. No markdown, no headers, no lists. Direct address ('You did X well…').`;

  const userPrompt = `School: ${body.schoolName}
Interview date: ${body.interviewDate ?? "n/a"}
Confidence (1-10): ${body.confidenceScore ?? "n/a"}

What went well: ${body.whatWentWell ?? "(not provided)"}

What was hard: ${body.whatWasHard ?? "(not provided)"}

Questions they asked: ${body.questionsTheyAsked ?? "(not provided)"}

Questions I asked: ${body.questionsIAsked ?? "(none)"}

Give feedback.`;

  let aiFeedback = "";
  try {
    aiFeedback = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.error("[interview-reflection] LLM error", err);
    // Soft-fail: still save the reflection even if Claude is down.
  }

  const db = createAdminSupabase();
  const { data, error } = await db
    .from("interview_post_reflections")
    .insert({
      user_id: auth.user.id,
      school_name: body.schoolName.trim(),
      interview_date: body.interviewDate ?? null,
      what_went_well: body.whatWentWell ?? null,
      what_was_hard: body.whatWasHard ?? null,
      questions_they_asked: body.questionsTheyAsked ?? null,
      questions_i_asked: body.questionsIAsked ?? null,
      confidence_score: body.confidenceScore ?? null,
      ai_feedback: aiFeedback || null,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ reflection: data });
}
