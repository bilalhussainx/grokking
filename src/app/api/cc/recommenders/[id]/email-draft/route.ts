import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface EmailDraft {
  subject: string;
  body: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "email_draft");
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

  const body = await req.json().catch(() => ({}));
  const { class_taken, grade_received, what_appreciated, deadline } = body as {
    class_taken?: string;
    grade_received?: string;
    what_appreciated?: string;
    deadline?: string;
  };

  const studentName = profile.preferred_name || profile.legal_first_name || "Student";

  const systemPrompt = `Draft a polite email from ${studentName} asking ${rec.name} for a college recommendation letter.

Rules:
1. Professional but warm tone appropriate for a student writing to a teacher
2. Keep it concise (under 200 words)
3. Include: why this teacher specifically, the deadline, offer to provide a brag sheet
4. Don't be overly formal or stiff
5. Return JSON with "subject" and "body" fields`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `From: ${studentName} (Class of ${profile.graduation_year || "N/A"})
To: ${rec.name} (${rec.recommender_type}, ${rec.subject || "general"})
${class_taken ? `Class taken: ${class_taken}` : ""}
${grade_received ? `Grade: ${grade_received}` : ""}
${what_appreciated ? `What the student appreciated: ${what_appreciated}` : ""}
${deadline ? `Deadline: ${deadline}` : ""}

Draft the ask email as JSON with "subject" and "body".`,
    },
  ];

  const email = await callLLMJSON<EmailDraft>(messages, { maxTokens: 500 });

  if (!email) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }

  return NextResponse.json({ email });
}
