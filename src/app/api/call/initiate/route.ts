import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";
import twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

/**
 * POST /api/call/initiate
 * Web-initiated call — user enters both numbers and languages on the website.
 * Server calls User A first, then bridges to User B.
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { callerPhone, calleePhone, callerLanguage, calleeLanguage } = await req.json();

  if (!callerPhone || !calleePhone || !callerLanguage || !calleeLanguage) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    return NextResponse.json({ error: "Twilio not configured" }, { status: 500 });
  }

  try {
    const admin = createAdminSupabase();
    const baseUrl = req.nextUrl.origin || `https://${req.headers.get("host")}`;

    // Create call session in DB
    const { data: session, error: dbErr } = await admin
      .from("call_sessions")
      .insert({
        caller_id: user.id,
        caller_phone: callerPhone,
        callee_phone: calleePhone,
        caller_language: callerLanguage,
        callee_language: calleeLanguage,
        status: "initiating",
      })
      .select("id")
      .single();

    if (dbErr || !session) {
      console.error("[Call Initiate] DB error:", dbErr);
      return NextResponse.json({ error: "Failed to create call session" }, { status: 500 });
    }

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // Call User A (caller) — they pick up and hear hold music while we call B
    const callA = await client.calls.create({
      to: callerPhone,
      from: TWILIO_PHONE_NUMBER,
      twiml: `<Response>
        <Say voice="Polly.Joanna">Connecting your translated call. Please hold.</Say>
        <Play loop="10">http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-B8075.mp3</Play>
      </Response>`,
      statusCallback: `${baseUrl}/api/call/status`,
      statusCallbackEvent: ["completed", "failed"],
    });

    // Call User B (callee)
    const callB = await client.calls.create({
      to: calleePhone,
      from: TWILIO_PHONE_NUMBER,
      url: `${baseUrl}/api/call/connect?callerLang=${callerLanguage}&callSidA=${callA.sid}&calleeLang=${calleeLanguage}&skipGather=1`,
      statusCallback: `${baseUrl}/api/call/status`,
      statusCallbackEvent: ["completed", "failed", "no-answer"],
    });

    // Update session with call SIDs
    await admin
      .from("call_sessions")
      .update({
        twilio_call_sid_a: callA.sid,
        twilio_call_sid_b: callB.sid,
        status: "ringing",
      })
      .eq("id", session.id);

    return NextResponse.json({
      ok: true,
      sessionId: session.id,
      callSidA: callA.sid,
      callSidB: callB.sid,
    });
  } catch (err) {
    console.error("[Call Initiate] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
