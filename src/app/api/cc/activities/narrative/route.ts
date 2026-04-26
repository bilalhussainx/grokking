// POST /api/cc/activities/narrative — analyzes the student's full activities
// list against their school list and returns a narrative diagnosis: profile
// type (spike/well-rounded/unclear) + strengths + gaps + suggested additions
// + recommendation tailored to their target schools.
import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { chatOnce } from "@/lib/cc/openrouter";

export async function POST() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, country, is_international, is_first_gen, grade_level")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: activities } = await db
    .from("cc_activities")
    .select("activity_type, position, organization_name, description, hours_per_week, weeks_per_year, grade_levels, impact_score")
    .eq("student_id", profile.id);

  const acts = activities ?? [];
  if (acts.length < 3) {
    return NextResponse.json(
      { error: "Add at least 3 activities first" },
      { status: 400 },
    );
  }

  const { data: schools } = await db
    .from("cc_student_schools")
    .select("chancing_band, cc_schools(name)")
    .eq("student_id", profile.id);

  type SchoolJoin = { chancing_band: string | null; cc_schools?: { name?: string } | { name?: string }[] | null };
  const schoolList = ((schools ?? []) as SchoolJoin[])
    .map((s) => {
      const sch = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
      return sch?.name ? `${sch.name} (${s.chancing_band ?? "n/a"})` : null;
    })
    .filter((s): s is string => !!s);

  const culturalNote = profile.is_international || profile.country !== "US"
    ? `\nThe student is international (${profile.country ?? "non-US"}); recognize cultural context — Pakistani/South Asian activities like Khuddam al-Ahmadiyya, Boy Scouts equivalent (Boy Scouts of Pakistan), tabla/sitar/qawwali music, cricket-team leadership, language tutoring at home, religious community service. Translate these for U.S. admissions readers without erasing the cultural meaning.`
    : "";

  const systemPrompt = `You are a college admissions counselor analyzing the student's complete Common App activities list. Output a SHORT, structured JSON diagnosis ONLY — no prose, no markdown.

The output JSON shape:
{
  "profileType": "spike" | "well_rounded" | "unclear",
  "whatAdmissionsSees": string,           // 2-3 sentence paragraph, plain English
  "strengths": string[],                  // 2-4 specific phrases (e.g. "Sustained 4-year leadership in robotics")
  "gaps": string[],                       // 1-3 specific phrases (e.g. "No demonstrated impact outside school")
  "suggestedAdditions": string[],         // 1-3 concrete activities to consider
  "schoolFitRecommendation": string,      // 1-2 sentences specifically tied to the student's school list
  "culturalContextNotes": string[]        // 0-3 entries; note any activity that needs cultural translation
}

Rules:
- Be specific. "You're a good student" is BANNED. Use the activity names.
- profileType=spike means a clear thematic concentration. well_rounded = even spread. unclear = noisy/no theme.
- Tie schoolFitRecommendation to the actual schools listed (e.g. "MIT and Caltech reward spike profiles, but Brown values breadth — your spike works for the engineering schools but consider..." ).
- culturalContextNotes is empty unless an activity has a non-Western context that admissions might miss.${culturalNote}`;

  const userPrompt = `Student profile: ${profile.country ?? "US"}, ${profile.is_first_gen ? "first-gen, " : ""}grade ${profile.grade_level ?? "n/a"}.

Activities (${acts.length}):
${acts
  .map(
    (a, i) =>
      `${i + 1}. [${a.activity_type ?? "?"}] ${a.position ?? ""} — ${a.organization_name ?? "?"}\n   ${a.description ?? "(no description)"}\n   ${a.hours_per_week ?? 0}h/wk × ${a.weeks_per_year ?? 0}wk/yr · grades ${(a.grade_levels ?? []).join(",") || "?"} · impact ${a.impact_score ?? "?"}`,
  )
  .join("\n")}

School list: ${schoolList.join(", ") || "(none yet)"}.

Diagnose.`;

  let raw: string;
  try {
    raw = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.error("[activities/narrative] LLM error", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 503 });
  }

  let parsed;
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: "Could not parse analysis" }, { status: 502 });
  }

  return NextResponse.json(parsed);
}
