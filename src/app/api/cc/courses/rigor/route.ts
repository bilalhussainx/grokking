// POST /api/cc/courses/rigor — Claude analyses course load and reports rigor.
import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { chatOnce } from "@/lib/cc/openrouter";

export async function POST() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, country, is_international, grade_level")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { data: courses } = await db
    .from("cc_courses")
    .select("course_name, level, grade_level, year_taken, grade_received, curriculum_type")
    .eq("student_id", profile.id);
  if (!courses || courses.length === 0) {
    return NextResponse.json({ error: "Add courses first" }, { status: 400 });
  }

  const list = courses
    .map(
      (c) =>
        `- ${c.year_taken ?? "?"} grade ${c.grade_level ?? "?"} · ${c.course_name} · ${c.level ?? ""} · grade: ${c.grade_received ?? "?"}`,
    )
    .join("\n");

  const systemPrompt = `Analyse a high school student's course rigor for U.S. college admissions. Output strict JSON:
{
  "rigorScore": "most_rigorous" | "very_rigorous" | "rigorous" | "above_average" | "average",
  "summary": string (2-3 sentences naming what stands out — specific course names),
  "strengths": string[],   // 1-3 bullets
  "gaps": string[],        // 1-3 bullets — concrete missing courses (e.g. "no AP Calc BC")
  "internationalNote": string  // empty unless the student is international + has FSc/A-Levels/IB; in that case translate the rigor for U.S. readers
}

Calibration: schools like MIT/Stanford expect "most_rigorous" — 4+ APs (or equivalent honours / A-Levels / IB HL). Single-AP profiles are "above_average". No AP / IB → "average".`;

  const userPrompt = `Country: ${profile.country ?? "US"}, ${profile.is_international ? "international" : "domestic"}.
Grade: ${profile.grade_level ?? "?"}.

Courses:
${list}

Analyse.`;

  let raw: string;
  try {
    raw = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.error("[courses/rigor] LLM error", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 503 });
  }
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch {
    return NextResponse.json({ error: "Could not parse analysis" }, { status: 502 });
  }
}
