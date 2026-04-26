// POST /api/cc/major-quiz — submit interest answers, get major suggestions.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase, ensureStudentProfile } from "../helpers";
import { chatOnce } from "@/lib/cc/openrouter";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ exploration: null });
  const { data } = await db.from("cc_major_explorations").select("*").eq("student_id", profile.id).maybeSingle();
  return NextResponse.json({ exploration: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as { interests?: string[]; freeText?: string };
  const interests = body.interests ?? [];

  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();

  const systemPrompt = `Suggest college majors for a high schooler given their interests. Output strict JSON:
{
  "suggestedMajors": [{ "name": string, "rationale": string, "fitScore": number }],   // 4-6 majors, fitScore 1-10
  "narrativeThread": string,    // 1-2 sentence thread connecting their interests
  "careerPaths": [{ "career": string, "majorPath": string }]    // 3-5 entries
}`;

  const userPrompt = `Interests: ${interests.join(", ") || "(none listed)"}
Free text: ${body.freeText ?? ""}

Suggest majors + careers.`;

  let parsed: unknown = null;
  try {
    const raw = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("[major-quiz] error", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 503 });
  }

  const data = parsed as {
    suggestedMajors?: unknown[];
    narrativeThread?: string;
    careerPaths?: unknown[];
  };

  await db
    .from("cc_major_explorations")
    .upsert({
      student_id: profile.id,
      interests,
      suggested_majors: data.suggestedMajors ?? [],
      narrative_thread: data.narrativeThread ?? null,
      career_paths: data.careerPaths ?? [],
      updated_at: new Date().toISOString(),
    });

  return NextResponse.json(data);
}
