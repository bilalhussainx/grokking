import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { familyModeSystemPrompt, type StudentSummary } from "@/lib/cc/family-mode-prompts";
import { streamLLM, collectStream, type ChatMessage } from "@/lib/cc/llm-stream";
import { isVoiceLanguage } from "@/lib/cc/coach-languages";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { message?: string; language?: string };
  const message = body.message?.trim();
  const language = body.language ?? "en";
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });
  if (!isVoiceLanguage(language)) {
    return NextResponse.json(
      { error: "Family Mode requires a voice-supported language" },
      { status: 400 },
    );
  }

  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, grade_level")
    .eq("user_id", auth.user.id)
    .single();
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // cc_student_schools holds {school_id, chancing_band}; join cc_schools for name.
  const { data: schools } = await db
    .from("cc_student_schools")
    .select("chancing_band, cc_schools(name)")
    .eq("student_id", profile.id);

  // cc_essays is keyed by student_id (FK to cc_student_profiles.id), not user_id.
  const { data: essays } = await db
    .from("cc_essays")
    .select("phase")
    .eq("student_id", profile.id);

  const submitted = (essays ?? []).filter((e) => e.phase === "submitted").length;
  const total = (essays ?? []).length;

  const stageLabel = profile.grade_level
    ? `Grade ${profile.grade_level}`
    : "Unknown grade";

  const summary: StudentSummary = {
    applicationStage: stageLabel,
    schoolList: (schools ?? []).map((s) => ({
      name:
        ((s as { cc_schools?: { name?: string } | { name?: string }[] }).cc_schools as { name?: string } | undefined)
          ?.name ?? "Unknown school",
      band: s.chancing_band ?? "n/a",
    })),
    aidContext: "(see student's affordability profile — discuss only at high level)",
    essaysSubmittedCount: submitted,
    essaysRequiredCount: Math.max(total, submitted),
  };

  // Recent family-mode history (last 8 turns max) for context.
  const { data: history } = await db
    .from("cc_family_mode_turns")
    .select("role, content")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(8);
  const turns = (history ?? []).reverse();

  const messages: ChatMessage[] = [
    { role: "system", content: familyModeSystemPrompt(language, summary) },
    ...turns.map((t) => ({
      role: (t.role === "coach" ? "assistant" : "user") as "assistant" | "user",
      content: t.content,
    })),
    { role: "user", content: message },
  ];

  // Insert parent turn first.
  await db.from("cc_family_mode_turns").insert({
    student_id: profile.id,
    language,
    role: "parent",
    content: message,
  });

  let reply = "";
  try {
    const result = await streamLLM(messages, { maxTokens: 400, temperature: 0.6 });
    if (result) reply = await collectStream(result.stream);
  } catch (err) {
    console.error("[family-mode] LLM error", err);
  }

  if (!reply) reply = "I'm sorry, I had trouble responding. Please try again.";

  await db.from("cc_family_mode_turns").insert({
    student_id: profile.id,
    language,
    role: "coach",
    content: reply,
  });

  return NextResponse.json({ reply });
}
