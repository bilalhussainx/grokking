import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getStudentProfileIds } from "@/lib/cc/ownership";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { loadInbox } from "@/lib/cc/agent/inbox";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const secret = process.env.AGENT_CONFIRM_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: "agent_disabled" }, { status: 503 });
  const db = createAdminSupabase();
  const scope = { userId: user.id, profileIds: await getStudentProfileIds(db, user.id) };
  return NextResponse.json({ items: await loadInbox(db, scope, new Date(), secret) }, { headers: { "Cache-Control": "no-store" } });
}
