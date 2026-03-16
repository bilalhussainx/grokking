import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { getUserSkills } from "@/lib/skills-radar";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const skills = await getUserSkills(user.id);
    return NextResponse.json({ skills });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[career/skills] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
