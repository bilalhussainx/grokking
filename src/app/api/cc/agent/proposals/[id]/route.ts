// src/app/api/cc/agent/proposals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getStudentProfileIds } from "@/lib/cc/ownership";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { commitProposal, declineProposal, undoProposal } from "@/lib/cc/agent/proposals";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const secret = process.env.AGENT_CONFIRM_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: "agent_disabled" }, { status: 503 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { action?: string; token?: string };
  const db = createAdminSupabase();
  const scope = { userId: user.id, profileIds: await getStudentProfileIds(db, user.id) };
  const now = new Date();
  const r = body.action === "confirm" ? await commitProposal(db, scope, id, String(body.token ?? ""), now, secret)
    : body.action === "decline" ? await declineProposal(db, scope, id)
    : body.action === "undo" ? await undoProposal(db, scope, id, now)
    : { status: 400, body: { error: "unknown_action" } };
  return NextResponse.json(r.body, { status: r.status });
}
