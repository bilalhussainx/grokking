// POST /api/counselor/agency
//
// Creates a new agency and makes the authenticated user its head. Used by the
// counselor onboarding "I'm starting a new agency" branch (the other branch
// is "I'm joining an existing agency via invite code", which goes through
// /api/counselor/agency/join).
//
// Status codes:
//   201 — created (or already existed AND caller is its head — idempotent)
//   400 — invalid body / malformed slug
//   401 — not authenticated
//   409 — slug taken by another agency or caller is non-head member
//   500 — DB/infrastructure failure (insert/cleanup error)
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAgencyAndMakeHead } from "@/lib/cc/agency-creation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: {
    name?: string;
    slug?: string;
    displayName?: string;
    websiteUrl?: string;
    country?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.name || !body.slug || !body.displayName) {
    return NextResponse.json(
      { error: "name, slug, displayName required" },
      { status: 400 },
    );
  }
  if (!/^[a-z0-9-]{3,40}$/.test(body.slug)) {
    return NextResponse.json(
      { error: "slug must be 3-40 lowercase letters/digits/hyphens" },
      { status: 400 },
    );
  }

  try {
    const result = await createAgencyAndMakeHead(user.id, {
      name: body.name,
      slug: body.slug,
      displayName: body.displayName,
      websiteUrl: body.websiteUrl,
      country: body.country,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    // Classify before mapping: only true slug conflicts are 409.
    // Insert/cleanup failures are infrastructure problems → 500, and the
    // raw DB error text is logged but not surfaced to the client.
    const isConflict = /slug.*(already taken|taken)/i.test(message);
    if (isConflict) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    console.error("[POST /api/counselor/agency] creation failed:", e);
    return NextResponse.json(
      { error: "agency creation failed; please retry" },
      { status: 500 },
    );
  }
}
