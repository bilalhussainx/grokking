import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (!profile) return NextResponse.json({ schools: [], ratings: [] });

  const { data: schools } = await supabase
    .from("cc_student_schools")
    .select("id, cc_schools(name)")
    .eq("student_id", profile.id);

  const { data: ratings } = await supabase
    .from("cc_family_alignment_ratings")
    .select("rater, school_name, rating, notes")
    .eq("student_id", profile.id);

  const schoolNames = (schools ?? [])
    .map((s) => {
      const sch = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
      return (sch as { name?: string } | null)?.name ?? null;
    })
    .filter((n): n is string => Boolean(n));

  return NextResponse.json({ schools: schoolNames, ratings: ratings ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { schoolName, rating, notes } = await req.json();
  if (typeof schoolName !== "string" || typeof rating !== "number" || rating < 1 || rating > 10) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (!profile) return NextResponse.json({ error: "Profile missing" }, { status: 400 });

  const { error } = await supabase
    .from("cc_family_alignment_ratings")
    .upsert(
      { student_id: profile.id, rater: "student", school_name: schoolName, rating, notes: notes ?? null },
      { onConflict: "student_id,rater,school_name" },
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
