// POST /api/cc/recommenders/ask-email-text — generates the email a student
// can send to a teacher asking them to write a recommendation letter.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { chatOnce } from "@/lib/cc/openrouter";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    recommenderId?: string;
    teacherName?: string;
    subject?: string;       // "AP Calculus", "AP Lit"
    relationship?: string;  // free text describing the rapport
  };
  const teacherName = body.teacherName?.trim();
  if (!teacherName) {
    return NextResponse.json({ error: "Missing teacherName" }, { status: 400 });
  }

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, preferred_name, grade_level")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  const systemPrompt = `You write the email a U.S. high school junior or senior sends to a teacher asking them to write a college recommendation letter. The email must:
- Open with respect and a specific reason this teacher (e.g. "your AP Calc class taught me to..." or "the way you challenged us during our genetics unit"). Use the relationship the student describes.
- State the student is applying to college this fall and give a tentative deadline (early November for most early applications).
- Ask politely whether they would feel they can write a STRONG letter. Make it easy for them to say no.
- Offer to provide: a brag sheet, transcript, list of activities, the deadline list — whatever helps them write well.
- Close with thanks and the student's name.
- Length: 150-200 words. Plain text. No bullet points. No subject line — output email body only.`;

  const userPrompt = `Teacher: ${teacherName}${body.subject ? ` (${body.subject})` : ""}
Student: ${profile?.preferred_name ?? "the student"}${profile?.grade_level ? ` (grade ${profile.grade_level})` : ""}
Relationship / shared context: ${body.relationship ?? "(not specified — use a generic respectful tone)"}

Write the ask email body.`;

  let email: string;
  try {
    email = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.error("[recommenders/ask-email-text] LLM error", err);
    return NextResponse.json({ error: "Email generation failed" }, { status: 503 });
  }
  email = email.trim();

  // Save the latest generated email to the caller's own recommender row.
  if (body.recommenderId && profile) {
    await db
      .from("cc_recommenders")
      .update({ ask_email_text: email })
      .eq("id", body.recommenderId)
      .eq("student_id", profile.id);
  }

  return NextResponse.json({ email });
}
