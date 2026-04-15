// POST /api/college-interviews/dynamic-persona
// Body: { schoolName: string }
// Returns: { persona: CollegePersona } — either cached or freshly LLM-generated.
// GET /api/college-interviews/dynamic-persona?schoolId=... — lookup cached by id.
// Spec: CollegeVCareers.md SP-11.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { getOrCreateDynamicPersona, getCachedDynamicPersona } from "@/lib/dynamic-college-persona";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const schoolId = req.nextUrl.searchParams.get("schoolId") || "";
  if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

  const persona = await getCachedDynamicPersona(schoolId);
  if (!persona) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ persona });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const schoolName = String(body.schoolName || "").slice(0, 120).trim();
  if (!schoolName) return NextResponse.json({ error: "schoolName required" }, { status: 400 });

  const persona = await getOrCreateDynamicPersona(schoolName);
  if (!persona) {
    return NextResponse.json(
      { error: "Persona generation failed — try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ persona });
}
