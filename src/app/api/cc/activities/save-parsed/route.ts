import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";

interface ParsedActivity {
  position: number;
  activity_type: string | null;
  organization: string | null;
  role: string | null;
  description_150: string | null;
  grades_participated: number[];
  hours_per_week: number | null;
  weeks_per_year: number | null;
  is_continuing: boolean;
}

interface ParsedHonor {
  position: number;
  title: string | null;
  level: string | null;
  grade: number | null;
  description_100: string | null;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const body = (await req.json()) as {
    activities?: ParsedActivity[];
    honors?: ParsedHonor[];
    replaceAll?: boolean;
  };

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (body.replaceAll) {
    await supabase.from("cc_activities").delete().eq("student_id", profile.id);
    await supabase.from("cc_honors").delete().eq("student_id", profile.id);
  }

  const activitiesToInsert = (body.activities || [])
    .filter((a) => a.position >= 1 && a.position <= 10)
    .map((a) => ({
      student_id: profile.id,
      position: a.position,
      activity_type: a.activity_type,
      organization: a.organization,
      role: a.role,
      description_150: a.description_150?.slice(0, 150) || null,
      grades_participated: a.grades_participated || [],
      hours_per_week: a.hours_per_week,
      weeks_per_year: a.weeks_per_year,
      is_continuing: a.is_continuing ?? true,
    }));

  const honorsToInsert = (body.honors || [])
    .filter((h) => h.position >= 1 && h.position <= 5)
    .map((h) => ({
      student_id: profile.id,
      position: h.position,
      title: h.title,
      level: h.level,
      grade: h.grade,
      description_100: h.description_100?.slice(0, 100) || null,
    }));

  let activitiesSaved = 0;
  let honorsSaved = 0;

  for (const row of activitiesToInsert) {
    const { data: existing } = await supabase
      .from("cc_activities")
      .select("id")
      .eq("student_id", profile.id)
      .eq("position", row.position)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("cc_activities")
        .update({ ...row, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (!error) activitiesSaved++;
    } else {
      const { error } = await supabase.from("cc_activities").insert(row);
      if (!error) activitiesSaved++;
    }
  }

  for (const row of honorsToInsert) {
    const { data: existing } = await supabase
      .from("cc_honors")
      .select("id")
      .eq("student_id", profile.id)
      .eq("position", row.position)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from("cc_honors").update(row).eq("id", existing.id);
      if (!error) honorsSaved++;
    } else {
      const { error } = await supabase.from("cc_honors").insert(row);
      if (!error) honorsSaved++;
    }
  }

  return NextResponse.json({ activitiesSaved, honorsSaved });
}
