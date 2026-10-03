// GET — invoked daily by Vercel Cron. Writes cc_agent_nudges for S1-flagged
// students only. Auth: CRON_SECRET bearer (same pattern as deadline-reminders).
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";
import { runNudgeCron } from "@/lib/cc/agent/triggers";
import { hasBearerSecret } from "@/lib/admin-secret";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!hasBearerSecret(req.headers.get("authorization"), "CRON_SECRET")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const result = await runNudgeCron(createAdminSupabase(), new Date());
  return NextResponse.json(result);
}
