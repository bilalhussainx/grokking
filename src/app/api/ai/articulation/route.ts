import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { analyzeArticulation } from "@/lib/articulation";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId)
    return NextResponse.json(
      { error: "lessonId required" },
      { status: 400 }
    );

  const result = await analyzeArticulation(user.id, lessonId);
  return NextResponse.json(result);
}
