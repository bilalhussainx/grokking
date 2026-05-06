// POST /api/counselor/onboard
//
// Claims a counselor profile for the currently-authenticated user.
// Idempotent: re-calling returns the existing row instead of erroring.
// Once the row exists, the role-aware nav swaps in the counselor sidebar
// (see useCounselorRole hook).
//
// Phase 1 scope: name + optional agency slug. Stripe Connect onboarding,
// service catalog, and admission-proof submission live in Phase 2/4.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { ensureCounselorProfile } from "@/lib/cc/counselor-helpers";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    displayName?: string;
    agencySlug?: string;
  };
  const displayName = body.displayName?.trim();
  if (!displayName || displayName.length < 2) {
    return NextResponse.json(
      { error: "Display name must be at least 2 characters." },
      { status: 400 },
    );
  }

  try {
    const counselor = await ensureCounselorProfile(user.id, {
      displayName,
      agencySlug: body.agencySlug?.trim() || undefined,
    });
    return NextResponse.json({
      counselor: {
        id: counselor.id,
        slug: counselor.slug,
        display_name: counselor.display_name,
        agency_id: counselor.agency_id,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Onboarding failed" },
      { status: 500 },
    );
  }
}
