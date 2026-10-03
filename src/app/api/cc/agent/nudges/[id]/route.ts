import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { setNudgeStatus } from "@/lib/cc/agent/inbox";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  if (action !== "dismiss" && action !== "snooze") return NextResponse.json({ error: "unknown_action" }, { status: 400 });
  const status = await setNudgeStatus(createAdminSupabase(), { userId: user.id, profileIds: [] }, (await params).id, action, new Date());
  return NextResponse.json({ ok: status === 200 }, { status });
}
