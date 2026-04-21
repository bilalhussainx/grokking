import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

const ALLOWED_PLANS = new Set(["ED", "ED1", "ED2", "EA", "REA", "SCEA", "RD", "rolling"]);

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const { id } = await params;

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("cc_student_schools")
    .delete()
    .eq("id", id)
    .eq("student_id", profile.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const rawPlan = typeof body.application_plan === "string" ? body.application_plan.trim() : null;

  if (rawPlan !== null && rawPlan !== "" && !ALLOWED_PLANS.has(rawPlan)) {
    return NextResponse.json({ error: "Invalid application_plan" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("cc_student_schools")
    .update({ application_plan: rawPlan === "" ? null : rawPlan })
    .eq("id", id)
    .eq("student_id", profile.id)
    .select("id, application_plan")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}
