import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase, ensureStudentProfile } from "../helpers";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, country, home_country_code")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ experiences: [], region: "US" });

  // Region drives which "local alternatives" list the page shows — it was
  // previously hardcoded to Pakistan for every student regardless of
  // profile. "SA" = South Asia, "INTL" = other non-US, "US" = domestic.
  const cc = (profile.home_country_code || profile.country || "US").toUpperCase();
  const region = ["PK", "IN", "BD", "LK", "NP"].includes(cc) ? "SA" : cc === "US" ? "US" : "INTL";

  const { data } = await db
    .from("cc_summer_experiences")
    .select("*")
    .eq("student_id", profile.id)
    .order("start_date", { ascending: false });
  return NextResponse.json({ experiences: data ?? [], region });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const experienceName = typeof body.experienceName === "string" ? body.experienceName.trim() : "";
  if (!experienceName) {
    return NextResponse.json({ error: "experienceName required" }, { status: 400 });
  }
  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();
  const { data, error } = await db
    .from("cc_summer_experiences")
    .insert({
      student_id: profile.id,
      experience_name: experienceName,
      category: body.category ?? null,
      start_date: body.startDate ?? null,
      end_date: body.endDate ?? null,
      hours_per_week: body.hoursPerWeek ?? null,
      description: body.description ?? null,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ experience: data });
}
