// GET /api/counselor/search?q=&school=&service=&languages=
//
// Public discovery endpoint. Backs /find-counselor.
// Mirrors the recommender-search UX: name fragment + school targeting +
// service-type filter. Adds optional language filter for international
// students looking for counselors who speak Urdu / Hindi / Spanish / etc.

import { NextRequest, NextResponse } from "next/server";
import { searchCounselors } from "@/lib/cc/counselor-helpers";

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
    counselors: results,
    count: results.length,
  });
}
