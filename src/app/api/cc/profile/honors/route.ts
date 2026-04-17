import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const body = await req.json();

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { position, ...fields } = body;
  if (!position || position < 1 || position > 5) {
    return NextResponse.json({ error: "Position must be 1-5" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("cc_honors")
    .select("id")
    .eq("student_id", profile.id)
    .eq("position", position)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("cc_honors")
      .update(fields)
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ updated: true, id: existing.id });
  } else {
    const { data, error } = await supabase
      .from("cc_honors")
      .insert({ student_id: profile.id, position, ...fields })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ created: true, id: data.id });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { error } = await supabase
    .from("cc_honors")
    .delete()
    .eq("id", id)
    .eq("student_id", profile.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
