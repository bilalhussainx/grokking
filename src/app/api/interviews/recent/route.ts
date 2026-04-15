// SP-1 — GET /api/interviews/recent?category=college → recent performance rows.
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const category = req.nextUrl.searchParams.get("category") || null;
  const limit = Math.min(20, Number(req.nextUrl.searchParams.get("limit") || 10));

  let q = supabase
    .from("interview_performance")
    .select("id, session_id, company_persona_id, category, interview_type, overall_score, communication_score, technical_depth_score, problem_solving_score, code_quality_score, strengths, improvements, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (category) q = q.eq("category", category);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sessions: data || [] });
}
