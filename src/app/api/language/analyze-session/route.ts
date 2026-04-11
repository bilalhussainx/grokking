// POST /api/language/analyze-session
// Called from useVoiceAgent / useOrchestratedVoiceAgent on session end. Hands the
// transcript to the analyzer which updates language_learning_profiles + writes
// "speaks" facts to the knowledge graph.
//
// Spec: 2026-04-10-intelligent-coaching-system-design.md sub-project 4

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { analyzeAndPersistSession } from "@/lib/language-session-analyzer";
import { getDefaultPersona } from "@/lib/language-personas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { language, transcript } = body as {
    language?: string;
    transcript?: { role: "user" | "assistant"; content: string }[];
  };

  if (!language || !Array.isArray(transcript) || transcript.length < 2) {
    return NextResponse.json({ ok: false, skipped: "insufficient_transcript" });
  }

  const languageName = getDefaultPersona(language).languageName || language;

  try {
    const result = await analyzeAndPersistSession(user.id, language, languageName, transcript);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[analyze-session] failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
