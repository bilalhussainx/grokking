// /api/counselor/services
//   GET   — list the calling counselor's own services (active + inactive)
//   POST  — create a new service in the catalog
//
// Per-row mutations (PATCH/DELETE) live in /api/counselor/services/[id]/route.ts
// so the URL maps cleanly to the row identity.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getCounselorForUser } from "@/lib/cc/counselor-helpers";

const VALID_SERVICE_TYPES = new Set([
  "essay_review_single",
  "essay_review_package",
  "common_app_full",
  "supplement_full_school",
  "interview_prep_session",
  "application_audit",
  "chancing_consultation",
  "activity_strategy_g10",
  "activity_strategy_g11",
]);

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const counselor = await getCounselorForUser(user.id);
  if (!counselor) {
    return NextResponse.json({ error: "Not a counselor" }, { status: 403 });
  }

  const db = createAdminSupabase();
  const { data, error } = await db
    .from("cc_counselor_services")
    .select("id, service_type, title, description, price_usd, turnaround_hours, scope_jsonb, active, sort_order, created_at")
    .eq("counselor_id", counselor.id)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ services: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const counselor = await getCounselorForUser(user.id);
  if (!counselor) {
    return NextResponse.json({ error: "Not a counselor" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    service_type?: string;
    title?: string;
    description?: string | null;
    price_usd?: number;
    turnaround_hours?: number | null;
    scope?: Record<string, unknown>;
  };

  // Validation — keep error messages explicit so the form can surface them.
  if (!body.service_type || !VALID_SERVICE_TYPES.has(body.service_type)) {
    return NextResponse.json({ error: "Invalid service_type" }, { status: 400 });
  }
  if (!body.title || body.title.trim().length < 3) {
    return NextResponse.json({ error: "Title must be at least 3 characters" }, { status: 400 });
  }
  if (typeof body.price_usd !== "number" || body.price_usd < 1) {
    return NextResponse.json({ error: "Price must be at least $1" }, { status: 400 });
  }

  const db = createAdminSupabase();
  const { data, error } = await db
    .from("cc_counselor_services")
    .insert({
      counselor_id: counselor.id,
      service_type: body.service_type,
      title: body.title.trim(),
      description: body.description?.trim() || null,
      price_usd: body.price_usd,
      turnaround_hours: body.turnaround_hours ?? null,
      scope_jsonb: body.scope ?? {},
      active: true,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
