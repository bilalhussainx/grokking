import { NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../helpers";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ schools: [] });
  }

  const { data, error } = await supabase
    .from("cc_student_schools")
    .select("id, school_id, chancing_band, application_status, application_plan, estimated_net_price_low, estimated_net_price_high, added_at, cc_schools(id, name, city, state, school_type, acceptance_rate, avg_net_price, test_policy, regular_deadline, early_deadline, website)")
    .eq("student_id", profile.id)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("[school-list GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ schools: data });
}
