import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const { school_id, chancing_band } = await req.json();
  if (!school_id) {
    return NextResponse.json({ error: "school_id required" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("cc_student_schools")
    .select("id")
    .eq("student_id", profile.id)
    .eq("school_id", school_id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "School already in list" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("cc_student_schools")
    .insert({
      student_id: profile.id,
      school_id,
      chancing_band: chancing_band || "unknown",
      application_status: "researching",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ added: true, id: data.id });
}
