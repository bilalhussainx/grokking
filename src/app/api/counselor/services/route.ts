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
    .select(
      "id, service_type, title, description, pricing_model, price_usd, price_usd_min, price_usd_max, turnaround_hours, scope_jsonb, active, sort_order, created_at",
    )
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
    pricing_model?: "fixed" | "quote";
    price_usd?: number;
    price_usd_min?: number;
    price_usd_max?: number;
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

  const pricingModel = body.pricing_model === "quote" ? "quote" : "fixed";
  let priceUsd = body.price_usd;
  let priceUsdMin: number | null = null;
  let priceUsdMax: number | null = null;

  if (pricingModel === "fixed") {
    if (typeof priceUsd !== "number" || priceUsd < 1) {
      return NextResponse.json({ error: "Fixed price must be at least $1" }, { status: 400 });
    }
  } else {
    // quote mode — require min + max range; price_usd becomes the "typical"
    // anchor (defaulted to the midpoint when the form omits it).
    if (typeof body.price_usd_min !== "number" || body.price_usd_min < 1) {
      return NextResponse.json({ error: "Minimum price must be at least $1" }, { status: 400 });
    }
    if (typeof body.price_usd_max !== "number" || body.price_usd_max < body.price_usd_min) {
      return NextResponse.json({ error: "Maximum price must be ≥ minimum" }, { status: 400 });
    }
    priceUsdMin = body.price_usd_min;
    priceUsdMax = body.price_usd_max;
    if (typeof priceUsd !== "number") {
      priceUsd = Math.round((priceUsdMin + priceUsdMax) / 2);
    }
  }

  const db = createAdminSupabase();
  const { data, error } = await db
    .from("cc_counselor_services")
    .insert({
      counselor_id: counselor.id,
      service_type: body.service_type,
      title: body.title.trim(),
      description: body.description?.trim() || null,
      pricing_model: pricingModel,
      price_usd: priceUsd,
      price_usd_min: priceUsdMin,
      price_usd_max: priceUsdMax,
      turnaround_hours: body.turnaround_hours ?? null,
      scope_jsonb: body.scope ?? {},
      active: true,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
