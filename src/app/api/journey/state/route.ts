// GET /api/journey/state — return current student journey stage + next best actions.
// Spec: CollegeVCareers.md SP-13.

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { computeJourneyState } from "@/lib/journey-state";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snapshot = await computeJourneyState(supabase, user.id);
  return NextResponse.json(snapshot);
}
