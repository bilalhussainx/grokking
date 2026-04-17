import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createAdminSupabase } from "../../helpers";
import { INTAKE_QUESTIONS } from "@/lib/cc/intake-questions";

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase();
  const session_token = randomUUID();

  const { error } = await supabase.from("cc_intake_sessions").insert({
    session_token,
    language: "en",
    transcript: [],
    extracted_fields: {},
    completed: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const firstQ = INTAKE_QUESTIONS[0];
  return NextResponse.json({
    session_token,
    question: {
      index: firstQ.index,
      id: firstQ.id,
      text: firstQ.text,
      voicePrompt: firstQ.voicePrompt,
      type: firstQ.type,
      options: firstQ.options,
      required: firstQ.required,
    },
    progress: { current: 0, total: INTAKE_QUESTIONS.length },
  });
}
