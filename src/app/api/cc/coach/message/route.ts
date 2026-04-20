import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "../../helpers";
import { detectMode } from "@/lib/cc/coach-mode-detector";
import { buildSystemPrompt, type CoachContext } from "@/lib/cc/coach-prompt-builder";
import { streamChat, type ChatMessage } from "@/lib/cc/openrouter";

export async function POST(req: NextRequest) {
  const userSupabase = await createServerSupabase();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { message, page_context } = await req.json();
  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });
  }

  const supabase = createAdminSupabase();

  // Fetch or create student profile
  let { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id, preferred_name, grade_level, country, state_province, is_first_gen, is_international, intake_completed_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("cc_student_profiles")
      .insert({ user_id: user.id })
      .select("id, preferred_name, grade_level, country, state_province, is_first_gen, is_international, intake_completed_at")
      .single();
    profile = newProfile;
  }
  if (!profile) {
    return new Response(JSON.stringify({ error: "Could not create profile" }), { status: 500 });
  }

  // Fetch academic profile
  const { data: academic } = await supabase
    .from("cc_academic_profiles")
    .select("gpa_unweighted, test_strategy, sat_total, act_composite")
    .eq("student_id", profile.id)
    .maybeSingle();

  // Fetch school preferences
  const { data: preferences } = await supabase
    .from("cc_school_preferences")
    .select("*")
    .eq("student_id", profile.id)
    .maybeSingle();

  // Fetch school list summary
  const { data: schools } = await supabase
    .from("cc_student_schools")
    .select("chancing_band")
    .eq("student_id", profile.id);

  const schoolCount = schools?.length ?? 0;
  const reach = schools?.filter((s) => s.chancing_band === "reach").length ?? 0;
  const match = schools?.filter((s) => s.chancing_band === "match").length ?? 0;
  const safety = schools?.filter((s) => s.chancing_band === "safety").length ?? 0;
  const schoolSummary = schoolCount > 0 ? `${reach} reach, ${match} match, ${safety} safety` : "none yet";

  // Check setup progress
  const { data: essayCheck } = await supabase
    .from("cc_essays").select("id").eq("user_id", user.id).limit(1);
  const { data: interviewCheck } = await supabase
    .from("interview_sessions").select("id").eq("user_id", user.id).limit(1);

  const progress = {
    hasIntakeCompleted: !!profile.intake_completed_at,
    hasGPA: !!academic?.gpa_unweighted,
    hasSchools: schoolCount > 0,
    hasEssays: (essayCheck?.length ?? 0) > 0,
    hasInterviewSessions: (interviewCheck?.length ?? 0) > 0,
  };

  const mode = detectMode(progress, page_context || "/", message);

  const coachContext: CoachContext = {
    mode,
    studentName: profile.preferred_name,
    grade: profile.grade_level,
    country: profile.country,
    state: profile.state_province,
    isInternational: profile.is_international ?? false,
    isFirstGen: profile.is_first_gen ?? false,
    gpaUnweighted: academic?.gpa_unweighted ?? null,
    testStrategy: academic?.test_strategy ?? null,
    satTotal: academic?.sat_total ?? null,
    actComposite: academic?.act_composite ?? null,
    schoolCount,
    schoolSummary,
    hasIntakeCompleted: progress.hasIntakeCompleted,
    hasGPA: progress.hasGPA,
    hasSchools: progress.hasSchools,
    hasEssays: progress.hasEssays,
    hasInterviewSessions: progress.hasInterviewSessions,
    preferences: preferences ?? null,
  };

  const systemPrompt = buildSystemPrompt(coachContext);

  // Fetch recent conversation history
  const { data: history } = await supabase
    .from("cc_coach_conversations")
    .select("role, content")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const historyMessages: ChatMessage[] = (history ?? [])
    .reverse()
    .map((h) => ({ role: h.role as "user" | "assistant", content: h.content }));

  const llmMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...historyMessages,
    { role: "user", content: message },
  ];

  // Save user message
  await supabase.from("cc_coach_conversations").insert({
    student_id: profile.id,
    role: "user",
    content: message,
    mode,
    page_context: page_context || "/",
  });

  // Stream response
  const encoder = new TextEncoder();
  const profileId = profile.id;
  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = "";
      try {
        await streamChat(llmMessages, (chunk) => {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk, mode })}\n\n`));
        });

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, mode })}\n\n`));
        controller.close();

        // Save assistant message (fire and forget)
        supabase.from("cc_coach_conversations").insert({
          student_id: profileId,
          role: "assistant",
          content: fullResponse,
          mode,
          page_context: page_context || "/",
        }).then(() => {
          if (["intake", "academic", "school-builder"].includes(mode)) {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
            fetch(`${baseUrl}/api/cc/coach/extract`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ student_id: profileId, mode }),
            }).catch(() => {});
          }
        });
      } catch {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
