// src/app/api/cc/agent/turn/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getStudentProfileIds } from "@/lib/cc/ownership";
import { assertCapacity } from "@/lib/cc/tier-gate";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { agentErrorCode } from "@/lib/cc/agent/loop";
import { makeProvider } from "@/lib/cc/agent/provider";
import { S1_TOOL_DEFINITIONS } from "@/lib/cc/agent/s1-tools";
import { runS1Turn, type S1TurnResult } from "@/lib/cc/agent/s1-turn";
import { encodeEvent } from "@/lib/cc/agent/sse";

export const runtime = "nodejs";
export const maxDuration = 90;
const LOCALE = /^[a-z]{2}(-[A-Z]{2})?$/;

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAgentS1User(user.id)) return NextResponse.json({ error: "not_enabled" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { message?: string; operationKey?: string; locale?: unknown };
  const message = String(body.message ?? "").trim();
  const operationKey = String(body.operationKey ?? "");
  if (!message || message.length > 2000 || operationKey.length < 8 || operationKey.length > 128) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const locale = typeof body.locale === "string" && LOCALE.test(body.locale) ? body.locale : "en";
  const db = createAdminSupabase();
  const { count, error: countError } = await db.from("cc_agent_turns").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", new Date(Date.now() - 86400000).toISOString());
  // Fail closed: an unknown usage count must not bypass fair use.
  if (countError || typeof count !== "number") return NextResponse.json({ error: "capacity_unknown" }, { status: 503 });
  const cap = await assertCapacity(user.id, "coachMessagesPerDay", count);
  if (!cap.ok) return NextResponse.json({ error: "fair_use_limit" }, { status: 429 });
  const scope = { userId: user.id, profileIds: await getStudentProfileIds(db, user.id) };
  let r: S1TurnResult;
  try {
    r = await runS1Turn({ db, scope, operationKey, message, locale, provider: makeProvider("routine", undefined, undefined, S1_TOOL_DEFINITIONS), now: new Date(), signal: req.signal });
  } catch (e) {
    // Closed codes only; the turn row and event trail already record the failure.
    return NextResponse.json({ error: agentErrorCode(e) }, { status: 500 });
  }
  if (r.status !== 200) return NextResponse.json({ error: r.error }, { status: r.status });
  const { turnId } = r;
  const result = r.result!;
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      // A1 sse.encodeEvent requires seq >= 1.
      c.enqueue(encodeEvent(1, "turn.accepted", { turnId }));
      c.enqueue(encodeEvent(2, "text.delta", { text: result.text }));
      c.enqueue(encodeEvent(3, "turn.completed", { turnId, cards: result.cards }));
      c.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store" } });
}
