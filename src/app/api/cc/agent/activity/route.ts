import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { loadActivity } from "@/lib/cc/agent/inbox";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const items = await loadActivity(createAdminSupabase(), { userId: user.id, profileIds: [] }, 100);
  return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
