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
  return NextResponse.json({
    counselor: counselor
      ? {
          id: counselor.id,
          slug: counselor.slug,
          display_name: counselor.display_name,
          agency_id: counselor.agency_id,
          verified: counselor.verified,
        }
      : null,
  });
}
