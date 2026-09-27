// GET /api/counselor/search?q=&school=&service=&languages=
//
// Public discovery endpoint. Backs /find-counselor.
// Mirrors the recommender-search UX: name fragment + school targeting +
// service-type filter. Adds optional language filter for international
// students looking for counselors who speak Urdu / Hindi / Spanish / etc.

import { NextRequest, NextResponse } from "next/server";
import { searchCounselors } from "@/lib/cc/counselor-helpers";

// Signed-out visitors can call this (it backs /find-counselor), so it returns
// marketplace-profile fields only — never the counselor's auth user id or
// Stripe payout details that searchCounselors' select(*) carries.
const PUBLIC_FIELDS = [
  "id", "slug", "display_name", "headline", "bio", "photo_url", "years_experience",
  "specialties", "languages", "hourly_rate_usd", "accepts_new_students", "verified",
  "total_sessions", "average_rating", "total_reviews",
  "agency_name", "agency_slug", "agency_verified", "matched_school_admits",
] as const;

function publicProfile(row: Record<string, unknown>) {
  return Object.fromEntries(PUBLIC_FIELDS.filter((k) => k in row).map((k) => [k, row[k]]));
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const schoolName = url.searchParams.get("school");
  const service = url.searchParams.get("service");
  const languagesParam = url.searchParams.get("languages");
  const languages = languagesParam
    ? languagesParam.split(",").map((l) => l.trim()).filter(Boolean)
    : undefined;

  const results = await searchCounselors({
    q,
    schoolName,
    service,
    languages,
    acceptingOnly: true,
    limit: 50,
  });

  return NextResponse.json({
    counselors: results.map((r) => publicProfile(r as unknown as Record<string, unknown>)),
    count: results.length,
  });
}
