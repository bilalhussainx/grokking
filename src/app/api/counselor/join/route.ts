import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { redeemInviteCode } from "@/lib/cc/invite-codes";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.code || typeof body.code !== "string") {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  try {
    // Student id ALWAYS comes from the authed session, never the client body.
    const result = await redeemInviteCode(body.code.trim().toUpperCase(), user.id);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "redemption failed";
    // Code problems (not found / revoked / expired / exhausted) are 409 client
    // errors, not server errors — they're expected and shown to the student.
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
