import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { getCareerGap } from "@/lib/skills-radar";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roleId = req.nextUrl.searchParams.get("roleId");
  if (!roleId) {
    return NextResponse.json({ error: "roleId query parameter is required" }, { status: 400 });
  }

  try {
    const gap = await getCareerGap(user.id, roleId);
    if (!gap) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({
      role: { title: gap.role.title, avgSalary: gap.role.avgSalary },
      matchPercentage: gap.matchPercentage,
      matchedSkills: gap.matchedSkills,
      missingSkills: gap.missingSkills,
      recommendedCourses: gap.recommendedCourses,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[career/gap] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
