import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) return NextResponse.json({ recommenders: [] });

  const { data } = await db
    .from("cc_recommenders")
    .select("*")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ recommenders: data || [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  }

  const body = await req.json();
  const { name, subject, email, recommender_type, context_notes } = body as {
    name: string;
    subject?: string;
    email?: string;
    recommender_type: string;
    context_notes?: string;
  };

  if (!name || !recommender_type) {
    return NextResponse.json({ error: "Name and type required" }, { status: 400 });
  }

  const { data, error } = await db
    .from("cc_recommenders")
    .insert({
      student_id: profile.id,
      name,
      subject: subject || null,
      email: email || null,
      recommender_type,
      status: "considering",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to add recommender" }, { status: 500 });
  }

  return NextResponse.json({ recommender: data });
}
