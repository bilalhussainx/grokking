// GET — returns the last 20 confidence-score data points for the chart.
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("interview_post_reflections")
    .select("interview_date, school_name, confidence_score")
    .eq("user_id", user.id)
    .not("confidence_score", "is", null)
    .order("interview_date", { ascending: true, nullsFirst: false })
    .limit(20);
  return NextResponse.json({ history: data ?? [] });
}
