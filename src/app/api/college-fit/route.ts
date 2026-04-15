// SP-7 — POST /api/college-fit { schoolId } → FitReport
// Pulls user's profile + activities + latest essays, runs fit evaluator.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { computeFitReport } from "@/lib/college-fit-evaluator";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const schoolId = String(body.schoolId || "").trim();
  if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

  const [profileRes, actsRes, essaysRes] = await Promise.all([
    supabase
      .from("college_applicant_profile")
      .select("intended_major, top_project_title, top_project_description, recent_influence")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("college_activities")
      .select("title, role, category, description, hours_per_week, weeks_per_year")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .limit(10),
    supabase
      .from("college_essays")
      .select("prompt, body, word_target, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3),
  ]);

  try {
    const report = await computeFitReport(
      supabase,
      {
        profile: profileRes.data,
        activities: actsRes.data || [],
        essays: essaysRes.data || [],
      },
      schoolId
    );
    return NextResponse.json({ report });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fit evaluation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
