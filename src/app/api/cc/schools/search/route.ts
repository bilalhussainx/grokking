import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase();
  const body = await req.json();
  const { query, state, type, test_policy, limit = 50 } = body;

  let q = supabase
    .from("cc_schools")
    .select("id, name, city, state, school_type, acceptance_rate, avg_net_price, test_policy, regular_deadline, early_deadline, website, ceeb_code, enrollment")
    .order("name")
    .limit(Math.min(limit, 100));

  if (query) {
    q = q.ilike("name", `%${query}%`);
  }
  if (state) {
    q = q.eq("state", state);
  }
  if (type) {
    q = q.eq("school_type", type);
  }
  if (test_policy) {
    q = q.eq("test_policy", test_policy);
  }

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ schools: data });
}
