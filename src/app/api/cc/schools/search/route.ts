import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase();
  const body = await req.json();
  const {
    query,
    state,
    country,
    type,
    test_policy,
    need_blind_international,
    meets_full_need_international,
    css_profile_required,
    limit = 50,
  } = body;

  let q = supabase
    .from("cc_schools")
    .select(
      "id, name, city, state, country, province, application_platform, school_type, acceptance_rate, avg_net_price, test_policy, regular_deadline, early_deadline, website, ceeb_code, enrollment, need_blind_international, meets_full_need_international, css_profile_required, pct_international_students_receiving_aid, avg_aid_package_international"
    )
    .order("name")
    .limit(Math.min(limit, 100));

  if (query) q = q.ilike("name", `%${query}%`);
  if (state) q = q.eq("state", state);
  if (country) {
    // "US" rows may predate the country column (NULL default) — treat NULL as US.
    q = country === "US" ? q.or("country.eq.US,country.is.null") : q.eq("country", country);
  }
  if (type) q = q.eq("school_type", type);
  if (test_policy) q = q.eq("test_policy", test_policy);
  if (need_blind_international === true) q = q.eq("need_blind_international", true);
  if (meets_full_need_international === true) q = q.eq("meets_full_need_international", true);
  if (css_profile_required === true) q = q.eq("css_profile_required", true);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ schools: data });
}
