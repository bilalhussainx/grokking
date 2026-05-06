// POST /api/counselor/request
//
// Student submits a quote-mode request. Creates a cc_counselor_engagements
// row with status='quote_requested' and the student's scope description.
// The counselor responds via /api/counselor/engagements/[id]/quote, then
// the student accepts via /api/counselor/engagements/[id]/accept-quote
// (which mints the actual Stripe Checkout — payment doesn't happen here).
//
// For fixed-price services, students still go through /api/counselor/booking
// which immediately mints Checkout. Splitting the routes keeps each one
// linear; sharing one route would require branching response shapes
// (engagement_id only vs engagement_id + checkout_url).

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to request a quote" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as {
    service_id?: string;
    request_message?: string;
    scope?: Record<string, unknown>;
  };
  if (!body.service_id) {
    return NextResponse.json({ error: "Missing service_id" }, { status: 400 });
  }
  const requestMessage = body.request_message?.trim();
  if (!requestMessage || requestMessage.length < 20) {
    return NextResponse.json(
      { error: "Describe the work you need (at least 20 characters)" },
      { status: 400 },
    );
  }

  const db = createAdminSupabase();

  // Resolve / create student profile (same pattern as booking endpoint).
  let { data: studentProfile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (!studentProfile) {
    const { data: created } = await db
      .from("cc_student_profiles")
      .insert({ user_id: user.id })
      .select("id")
      .single<{ id: string }>();
    studentProfile = created ?? null;
  }
  if (!studentProfile) {
    return NextResponse.json({ error: "Could not resolve student profile" }, { status: 500 });
  }

  // Service must exist, be active, and be quote-mode. Fixed services should
  // route through /booking instead — surface a clear error if the client
  // hits the wrong endpoint.
  const { data: service } = await db
    .from("cc_counselor_services")
    .select("id, counselor_id, pricing_model, active, title")
    .eq("id", body.service_id)
    .maybeSingle<{
      id: string;
      counselor_id: string;
      pricing_model: "fixed" | "quote";
      active: boolean;
      title: string;
    }>();
  if (!service || !service.active) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 404 });
  }
  if (service.pricing_model !== "quote") {
    return NextResponse.json(
      { error: "This service has a fixed price. Use /api/counselor/booking instead." },
      { status: 400 },
    );
  }

  const { data: engagement, error } = await db
    .from("cc_counselor_engagements")
    .insert({
      counselor_id: service.counselor_id,
      student_id: studentProfile.id,
      service_id: service.id,
      status: "quote_requested",
      request_message: requestMessage,
      scope_jsonb: body.scope ?? {},
    })
    .select("id")
    .single<{ id: string }>();
  if (error || !engagement) {
    return NextResponse.json({ error: error?.message ?? "Could not create engagement" }, { status: 500 });
  }

  return NextResponse.json({ engagement_id: engagement.id });
}
