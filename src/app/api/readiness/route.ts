// SP-9 — GET /api/readiness → ReadinessSnapshot for current user.
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { computeReadiness } from "@/lib/readiness-score";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const snap = await computeReadiness(supabase, user.id);
    return NextResponse.json(snap);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "readiness failed" },
      { status: 500 }
    );
  }
}
