import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";
import { INTAKE_QUESTIONS, nextAskableIndex } from "@/lib/cc/intake-questions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_token, question_index, answer, raw_transcript } = body;

  if (!session_token || question_index === undefined || !answer) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  const { data: session, error: fetchErr } = await supabase
    .from("cc_intake_sessions")
    .select("*")
    .eq("session_token", session_token)
    .single();

  if (fetchErr || !session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 });
  }

  if (session.completed) {
    return NextResponse.json({ error: "Session already completed" }, { status: 400 });
  }

  const ageMs = Date.now() - new Date(session.started_at).getTime();
  if (ageMs > 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Session expired" }, { status: 410 });
  }

  const transcript = Array.isArray(session.transcript) ? [...session.transcript] : [];
  transcript.push({
    question_index,
    question_id: INTAKE_QUESTIONS[question_index]?.id,
    answer,
    raw_transcript: raw_transcript || null,
    timestamp: new Date().toISOString(),
  });

  const extracted = { ...(session.extracted_fields || {}) };
  extracted[INTAKE_QUESTIONS[question_index]?.id] = answer;

  const { error: updateErr } = await supabase
    .from("cc_intake_sessions")
    .update({ transcript, extracted_fields: extracted })
    .eq("id", session.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  const nextIndex = nextAskableIndex(question_index, extracted);
  const isComplete = nextIndex === -1;

  if (isComplete) {
    return NextResponse.json({
      next_question: null,
      progress: { current: INTAKE_QUESTIONS.length, total: INTAKE_QUESTIONS.length },
      is_complete: true,
    });
  }

  const nextQ = INTAKE_QUESTIONS[nextIndex];
  return NextResponse.json({
    next_question: {
      index: nextQ.index,
      id: nextQ.id,
      text: nextQ.text,
      voicePrompt: nextQ.voicePrompt,
      type: nextQ.type,
      options: nextQ.options,
      required: nextQ.required,
    },
    progress: { current: nextIndex, total: INTAKE_QUESTIONS.length },
    is_complete: false,
  });
}
