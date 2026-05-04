// POST /api/cc/coach/voice-turn
// Persists a single conversation turn from the Deepgram (or any) voice
// agent to cc_coach_conversations, and runs the coach-extraction
// pipeline on assistant turns so the LLM-emitted <<actions>> block
// actually adds schools to the student's list.
//
// Why this route exists: the Deepgram Voice Agent runs its own LLM
// inside Deepgram's WebSocket — STT + LLM + TTS bundled. The bundled
// reply text comes back to the client via ConversationText events; our
// server never sees the request. Without a route like this, voice
// turns never reach our DB and the actions block never reaches the
// extraction pipeline. Symptom: coach says "I added Stanford and MIT
// to your list" → schools don't appear in /schools, and on refresh the
// chat is empty.
//
// Body shape (JSON):
//   {
//     role: "user" | "assistant",
//     content: string,            // raw text from voice agent
//     page_context?: string       // optional, defaults to "voice"
//   }
//
// Returns: { ok: true, schoolsAddedCount?: number }
//
// Failure modes are non-fatal — the client treats this as fire-and-
// forget. If the save fails, history just won't replay; the live chat
// continues uninterrupted.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "../../helpers";
import {
  parseActionsBlock,
  stripActionsBlock,
} from "@/lib/cc/coach-actions-block";
import { runCoachExtraction } from "@/lib/cc/coach-extract";

export async function POST(req: NextRequest) {
  const userSupabase = await createServerSupabase();
  const {
    data: { user },
  } = await userSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    role?: string;
    content?: string;
    page_context?: string;
  };
  const role = body.role;
  const content = (body.content ?? "").trim();
  if ((role !== "user" && role !== "assistant") || !content) {
    return NextResponse.json(
      { error: "Missing role ('user'|'assistant') or content" },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabase();

  // Find or create the student profile row (parallel to /api/cc/coach/message).
  let { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (!profile) {
    const { data: created } = await supabase
      .from("cc_student_profiles")
      .insert({ user_id: user.id })
      .select("id")
      .single<{ id: string }>();
    profile = created ?? null;
  }
  if (!profile) {
    return NextResponse.json(
      { error: "Could not create student profile" },
      { status: 500 },
    );
  }

  // For assistant turns, strip the <<actions>> block before persisting
  // so the chat history doesn't show the JSON to users on reload.
  const cleanContent = role === "assistant" ? stripActionsBlock(content) : content;

  const { error: insertErr } = await supabase
    .from("cc_coach_conversations")
    .insert({
      student_id: profile.id,
      role,
      content: cleanContent,
      mode: "voice",
      page_context: body.page_context || "voice",
    });
  if (insertErr) {
    console.error(
      `[voice-turn] insert failed for student ${profile.id} (${role}):`,
      insertErr,
    );
    return NextResponse.json(
      { error: insertErr.message },
      { status: 500 },
    );
  }
  console.log(
    `[voice-turn] saved ${role} (student=${profile.id}, len=${cleanContent.length})`,
  );

  // For assistant turns, parse the actions block and run school
  // extraction. The bundled Deepgram LLM emits the same <<actions>>
  // block the text-mode coach does — the prompt is shared.
  let schoolsAddedCount = 0;
  if (role === "assistant") {
    try {
      const actions = parseActionsBlock(content);
      console.log(
        `[voice-turn] parsedActions=${
          actions ? `block(${actions.add_schools?.length ?? 0} schools)` : "null"
        }`,
      );
      const result = await runCoachExtraction(profile.id, "voice", actions);
      const r = result as { extracted?: boolean; schoolsAddedCount?: number };
      schoolsAddedCount = r.schoolsAddedCount ?? 0;
      console.log(
        `[voice-turn] extraction result — schoolsAddedCount=${schoolsAddedCount}`,
      );
    } catch (err) {
      console.error("[voice-turn] extraction failed:", err);
    }
  }

  return NextResponse.json({ ok: true, schoolsAddedCount });
}
