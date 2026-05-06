// GET /api/counselor/me
// Returns the cc_counselors row for the authenticated user, or
// { counselor: null } if they're not a counselor. Used by useCounselorRole
// to swap the nav sidebar in the AppShell.
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { getCounselorForUser } from "@/lib/cc/counselor-helpers";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ counselor: null });
  }
  const counselor = await getCounselorForUser(user.id);
  // Return the full editable shape so the /counselor/profile editor can
  // read directly from this endpoint (avoids duplicating the Supabase
  // lookup). useCounselorRole only consumes id + slug; extra fields are
  // additive.
  return NextResponse.json({
    counselor: counselor
      ? {
          id: counselor.id,
          slug: counselor.slug,
          display_name: counselor.display_name,
          headline: counselor.headline,
          bio: counselor.bio,
          photo_url: counselor.photo_url,
          years_experience: counselor.years_experience,
          specialties: counselor.specialties ?? [],
          languages: counselor.languages ?? ["en"],
          hourly_rate_usd: counselor.hourly_rate_usd,
          accepts_new_students: counselor.accepts_new_students,
          agency_id: counselor.agency_id,
          verified: counselor.verified,
        }
      : null,
  });
}
