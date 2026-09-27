// POST /api/cc/waitlist/loci — generates a Letter of Continued Interest for
// a specific waitlist school. Tailored using the student's recent activities,
// updated grades, and any new accomplishments since application submission.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { chatOnce } from "@/lib/cc/openrouter";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    schoolName?: string;
    updates?: string;       // free-text "what's new since I applied"
    why_this_school?: string;
  };
  const schoolName = body.schoolName?.trim();
  if (!schoolName) {
    return NextResponse.json({ error: "Missing schoolName" }, { status: 400 });
  }
  if (!body.updates?.trim() && !body.why_this_school?.trim()) {
    return NextResponse.json(
      { error: "Tell us at least one update since you applied, or why this school — the letter can't be specific without you." },
      { status: 400 },
    );
  }

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, preferred_name")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  const { data: activities } = profile
    ? await db
        .from("cc_activities")
        .select("role, organization, description_150")
        .eq("student_id", profile.id)
        .order("impact_score", { ascending: false })
        .limit(5)
    : { data: [] };

  const activitiesBlock = (activities ?? [])
    .map(
      (a) =>
        `- ${a.role ?? "Member"} at ${a.organization ?? "?"}: ${a.description_150 ?? ""}`,
    )
    .join("\n");

  const systemPrompt = `You write a Letter of Continued Interest (LOCI) for a college admissions waitlist. The letter must:
- Be 250-300 words. Counted carefully.
- Open with sincere reaffirmation that ${schoolName} remains the student's top choice (or near-top — match the student's actual feelings if stated).
- Cite 1-2 SPECIFIC academic / extracurricular updates since the application — graded coursework, leadership change, new honor, project completion. Use the activities and updates the user provides.
- Cite only the ${schoolName} programs, professors or opportunities the student named in 'Why this school is right'. If they named none, do NOT invent any — instead add one bracketed note for the student, e.g. [Add a specific program or professor you'd work with here], so they supply it themselves.
- Close with a direct statement that, if admitted, the student will deposit immediately. Only include this if the student says they're committed — otherwise close with continued strong interest.
- NEVER use generic phrases ('top-notch', 'world-class', 'thrive', 'unique opportunity', 'esteemed').
- NEVER list multiple schools. NEVER mention scholarships from competitors.
- Sign off with the student's preferred name.

Output the letter only. No preamble.`;

  const userPrompt = `Student: ${profile?.preferred_name ?? "the student"}
School: ${schoolName}
Updates since application: ${body.updates ?? "(none provided — use general continuing growth)"}
Why this school is right: ${body.why_this_school ?? "(not specified)"}

Top activities (recent):
${activitiesBlock || "(no activities on file)"}

Write the LOCI.`;

  let letter: string;
  try {
    letter = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.error("[waitlist/loci] LLM error", err);
    return NextResponse.json({ error: "LOCI generation failed" }, { status: 503 });
  }

  letter = letter.trim();
  const wordCount = letter.split(/\s+/).filter(Boolean).length;

  return NextResponse.json({ loci: letter, wordCount });
}
