// POST /api/counselor/engagements/[id]/quote
//
// Counselor sends a quote in response to a student's request. Validates
// the price falls within the service's advertised min/max range (or is
// reasonably close — we allow ±20% to accommodate scope-shift), flips
// the engagement status to 'quoted', stamps quoted_at + quoted_price_usd
// + quote_message.
//
// Body:
//   { quoted_price_usd: number, quote_message?: string }

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getCounselorForUser } from "@/lib/cc/counselor-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const counselor = await getCounselorForUser(user.id);
  if (!counselor) {
    return NextResponse.json({ error: "Not a counselor" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    quoted_price_usd?: number;
    quote_message?: string;
  };
  if (typeof body.quoted_price_usd !== "number" || body.quoted_price_usd < 1) {
    return NextResponse.json({ error: "Quote must be at least $1" }, { status: 400 });
  }

  const db = createAdminSupabase();
  const { data: engagement } = await db
    .from("cc_counselor_engagements")
    .select(`
      id, status, counselor_id,
      service:cc_counselor_services!service_id (
        pricing_model, price_usd_min, price_usd_max
      )
    `)
    .eq("id", id)
    .maybeSingle();
  type Eng = {
    id: string;
    status: string;
    counselor_id: string;
    service:
      | { pricing_model: string; price_usd_min: number | null; price_usd_max: number | null }
      | { pricing_model: string; price_usd_min: number | null; price_usd_max: number | null }[]
      | null;
  };
  const e = engagement as Eng | null;
  if (!e) return NextResponse.json({ error: "Engagement not found" }, { status: 404 });
  if (e.counselor_id !== counselor.id) {
    return NextResponse.json({ error: "Not your engagement" }, { status: 403 });
  }
  if (e.status !== "quote_requested" && e.status !== "quoted") {
    return NextResponse.json(
      { error: `Cannot quote from status '${e.status}' — only 'quote_requested' (initial) or 'quoted' (re-quote) accepted.` },
      { status: 409 },
    );
  }

  // Soft range guardrail: warn if the quote is wildly outside the advertised
  // range. We allow ±20% to handle scope creep, but prevent silent abuse
  // (e.g. a counselor advertising $100-500 then quoting $5000). Hard-floor
  // at $1; hard-ceiling at 1.2x advertised max.
  const svc = Array.isArray(e.service) ? e.service[0] : e.service;
  if (svc?.pricing_model === "quote" && svc.price_usd_max != null) {
    const ceiling = svc.price_usd_max * 1.2;
    if (body.quoted_price_usd > ceiling) {
      return NextResponse.json(
        {
          error: `Quote of $${body.quoted_price_usd.toLocaleString()} is more than 20% above your advertised max of $${svc.price_usd_max.toLocaleString()}. Either lower the quote or update your service range.`,
        },
        { status: 400 },
      );
    }
  }

  const { error: updErr } = await db
    .from("cc_counselor_engagements")
    .update({
      status: "quoted",
      quoted_price_usd: body.quoted_price_usd,
      quote_message: body.quote_message?.trim() || null,
      quoted_at: new Date().toISOString(),
      quote_declined_at: null, // clear if this is a re-quote after a previous decline
    })
    .eq("id", id);
  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
