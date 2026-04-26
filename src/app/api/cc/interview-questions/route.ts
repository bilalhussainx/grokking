// POST /api/cc/interview-questions — generates 3 school-specific questions
// the student should ASK the interviewer. Tailored to the school + the
// student's interests.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";
import { chatOnce } from "@/lib/cc/openrouter";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    schoolName?: string;
    studentInterests?: string;
  };
  if (!body.schoolName?.trim()) {
    return NextResponse.json({ error: "Missing schoolName" }, { status: 400 });
  }

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  let interestSummary = body.studentInterests?.trim() ?? "";
  if (!interestSummary && profile) {
    const { data: schoolPrefs } = await db
      .from("cc_school_preferences")
      .select("preferred_majors")
      .eq("student_id", profile.id)
      .maybeSingle();
    type Pref = { preferred_majors?: string[] | null };
    const majors = (schoolPrefs as Pref | null)?.preferred_majors ?? [];
    if (majors.length > 0) interestSummary = majors.join(", ");
  }

  const systemPrompt = `Generate exactly 3 questions a high-school senior should ask their college admissions interviewer at ${body.schoolName}. Each question must:

- Be SPECIFIC to ${body.schoolName} — name a known program, course, tradition, or distinctive feature. Do NOT say "What do students do here?" or other generic openers.
- Pull from publicly known facts about the school. If you don't know enough to be specific, default to (a) one about the academic program, (b) one about the alumni network, (c) one about life on campus.
- Be open-ended (start with How, What, Why, Tell me about) — not yes/no.
- Show genuine curiosity, not flattery. Don't say "since this school is so amazing..."
- Each question is ONE sentence.

Output STRICT JSON: { "questions": [string, string, string], "rationale": string (one sentence on what these signal) }`;

  const userPrompt = `School: ${body.schoolName}
Student interests: ${interestSummary || "(unspecified — use general academic curiosity)"}

Generate 3 questions.`;

  let raw: string;
  try {
    raw = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.error("[interview-questions] LLM error", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 503 });
  }

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Could not parse questions" }, { status: 502 });
  }
}
