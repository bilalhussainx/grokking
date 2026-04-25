import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

const ALLOWED_LANGS = new Set(COACH_LANGUAGES.map((l) => l.code));

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const { data } = await auth.supabase
    .from("cc_student_profiles")
    .select("home_language, language_picker_seen_at, voice_quality_check_passed_at")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  return NextResponse.json({
    language: data?.home_language || "en",
    languagePickerSeenAt: data?.language_picker_seen_at ?? null,
    voiceQualityCheckPassedAt: data?.voice_quality_check_passed_at ?? null,
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    language?: string;
    markPickerSeen?: boolean;
    markVoiceCheckPassed?: boolean;
  };

  const update: Record<string, unknown> = {};
  if (body.language !== undefined) {
    if (!ALLOWED_LANGS.has(body.language)) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }
    update.home_language = body.language;
  }
  if (body.markPickerSeen) {
    update.language_picker_seen_at = new Date().toISOString();
  }
  if (body.markVoiceCheckPassed) {
    update.voice_quality_check_passed_at = new Date().toISOString();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("cc_student_profiles")
    .update(update)
    .eq("user_id", auth.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, updated: Object.keys(update) });
}
