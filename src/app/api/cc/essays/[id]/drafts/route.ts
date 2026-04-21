import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";

async function ensureEssayOwned(userId: string, essayId: string) {
  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();
  if (!profile) return null;
  const { data: essay } = await db
    .from("cc_essays")
    .select("id, current_draft")
    .eq("id", essayId)
    .eq("student_id", profile.id)
    .single();
  return essay || null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const essay = await ensureEssayOwned(auth.user.id, id);
  if (!essay) return NextResponse.json({ error: "Essay not found" }, { status: 404 });

  const db = createAdminSupabase();
  const { data: drafts, error } = await db
    .from("cc_essay_drafts")
    .select("id, version_number, label, word_count, notes, created_at")
    .eq("essay_id", id)
    .order("version_number", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to load drafts" }, { status: 500 });
  return NextResponse.json({ drafts: drafts || [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const essay = await ensureEssayOwned(auth.user.id, id);
  if (!essay) return NextResponse.json({ error: "Essay not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const {
    content,
    label,
    notes,
  } = body as { content?: string; label?: string; notes?: string };

  const sourceText = (content ?? essay.current_draft ?? "").trim();
  if (!sourceText) {
    return NextResponse.json({ error: "Nothing to snapshot — draft is empty" }, { status: 400 });
  }

  const db = createAdminSupabase();
  const { data: latest } = await db
    .from("cc_essay_drafts")
    .select("version_number")
    .eq("essay_id", id)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (latest?.version_number || 0) + 1;
  const wordCount = sourceText.split(/\s+/).filter(Boolean).length;

  const { data: draft, error } = await db
    .from("cc_essay_drafts")
    .insert({
      essay_id: id,
      version_number: nextVersion,
      label: label || `Draft v${nextVersion}`,
      content: sourceText,
      word_count: wordCount,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[essay drafts] insert failed:", error);
    return NextResponse.json({ error: "Failed to save version" }, { status: 500 });
  }

  return NextResponse.json({ draft });
}
