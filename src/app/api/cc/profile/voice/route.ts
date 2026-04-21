import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

const ALLOWED_LANGS = new Set(COACH_LANGUAGES.map((l) => l.code));

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const { data } = await auth.supabase
    .from("cc_student_profiles")
    .select("home_language")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  return NextResponse.json({ language: data?.home_language || "en" });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { language?: string };
  if (!body.language || !ALLOWED_LANGS.has(body.language)) {
    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("cc_student_profiles")
    .update({ home_language: body.language })
    .eq("user_id", auth.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ language: body.language });
}
