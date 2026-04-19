import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface BragSheet {
  introduction: string;
  academicHighlights: string[];
  activityHighlights: string[];
  personalQualities: string[];
  specificAnecdotes: string[];
  closingNote: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "brag_sheet");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, preferred_name, legal_first_name, graduation_year")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile required" }, { status: 400 });
  }

  const { data: rec } = await db
    .from("cc_recommenders")
    .select("*")
    .eq("id", id)
    .eq("student_id", profile.id)
    .single();

  if (!rec) {
    return NextResponse.json({ error: "Recommender not found" }, { status: 404 });
  }

  const { data: activities } = await db
    .from("cc_activities")
    .select("activity_type, organization, role, description_150, hours_per_week")
    .eq("student_id", profile.id)
    .order("position");

  const { data: honors } = await db
    .from("cc_honors")
    .select("title, level, description_100")
    .eq("student_id", profile.id)
    .order("position");

  const { data: academics } = await db
    .from("cc_academic_profiles")
    .select("gpa_unweighted, gpa_weighted, sat_total, act_composite, ap_ib_courses")
    .eq("student_id", profile.id)
    .single();

  const body = await req.json().catch(() => ({}));
  const { context_notes } = body as { context_notes?: string };

  const studentName = profile.preferred_name || profile.legal_first_name || "the student";

  const activitiesText = (activities || [])
    .map((a) => `- ${a.role || a.activity_type} at ${a.organization}: ${a.description_150 || ""} (${a.hours_per_week || 0} hrs/wk)`)
    .join("\n");

  const honorsText = (honors || [])
    .map((h) => `- ${h.title} (${h.level}): ${h.description_100 || ""}`)
    .join("\n");

  const academicsText = academics
    ? `GPA: ${academics.gpa_unweighted || "N/A"} UW / ${academics.gpa_weighted || "N/A"} W, SAT: ${academics.sat_total || "N/A"}, ACT: ${academics.act_composite || "N/A"}`
    : "No academic data";

  const systemPrompt = `You are generating a brag sheet for ${studentName} to give to their recommender, ${rec.name} (${rec.recommender_type}, ${rec.subject || "general"}).

A brag sheet helps the recommender write a strong letter by reminding them of the student's achievements and qualities.

Rules:
1. Write in third person about the student
2. Be specific — use real activities and achievements from the profile
3. Keep each bullet concise (1-2 sentences)
4. Include 3-5 items per section
5. Tone: professional but warm

Return valid JSON:
{
  "introduction": "Brief intro about the student and their relationship with this recommender",
  "academicHighlights": ["...", "..."],
  "activityHighlights": ["...", "..."],
  "personalQualities": ["...", "..."],
  "specificAnecdotes": ["Suggestion for a specific story the recommender might reference"],
  "closingNote": "What the student hopes this recommendation will convey"
}`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Student: ${studentName}, Class of ${profile.graduation_year || "N/A"}
Recommender: ${rec.name} (${rec.recommender_type}, ${rec.subject || "general"})
${context_notes ? `Student's notes about this teacher: ${context_notes}` : ""}

Academics: ${academicsText}

Activities:
${activitiesText || "None listed"}

Honors:
${honorsText || "None listed"}

Generate the brag sheet JSON.`,
    },
  ];

  const bragSheet = await callLLMJSON<BragSheet>(messages, { maxTokens: 2000 });

  if (!bragSheet) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }

  return NextResponse.json({ bragSheet });
}
