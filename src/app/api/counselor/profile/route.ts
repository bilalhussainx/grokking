// PATCH /api/counselor/profile
// Updates editable fields on the calling counselor's cc_counselors row.
// Used by /counselor/profile editor.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getCounselorForUser } from "@/lib/cc/counselor-helpers";

interface PatchBody {
  display_name?: string;
  headline?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  years_experience?: number | null;
  specialties?: string[];
  languages?: string[];
  hourly_rate_usd?: number | null;
  accepts_new_students?: boolean;
}

export async function PATCH(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const counselor = await getCounselorForUser(user.id);
  if (!counselor) {
    return NextResponse.json({ error: "Not a counselor" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as PatchBody;
  const update: Record<string, unknown> = {};

  if (body.display_name !== undefined) {
    if (body.display_name.trim().length < 2) {
      return NextResponse.json({ error: "Display name too short" }, { status: 400 });
    }
    update.display_name = body.display_name.trim();
  }
  if (body.headline !== undefined) update.headline = body.headline?.trim() || null;
  if (body.bio !== undefined) update.bio = body.bio?.trim() || null;
  if (body.photo_url !== undefined) update.photo_url = body.photo_url?.trim() || null;
  if (body.years_experience !== undefined) update.years_experience = body.years_experience;
  if (body.specialties !== undefined) update.specialties = body.specialties;
  if (body.languages !== undefined) update.languages = body.languages;
  if (body.hourly_rate_usd !== undefined) update.hourly_rate_usd = body.hourly_rate_usd;
  if (body.accepts_new_students !== undefined) update.accepts_new_students = body.accepts_new_students;

  if (Object.keys(update).length === 0) return NextResponse.json({ ok: true });
  update.updated_at = new Date().toISOString();

  const db = createAdminSupabase();
  const { error } = await db
    .from("cc_counselors")
    .update(update)
    .eq("id", counselor.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
