import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

/** Make a Twilio REST API call without the SDK */
async function twilioCall(to: string, from: string, url: string, statusCallback: string) {
  const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Url: url,
        StatusCallback: statusCallback,
        StatusCallbackEvent: "completed failed",
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twilio API error: ${res.status} ${err}`);
  }

  return res.json();
}

/**
 * POST /api/call/initiate
 * Web-initiated call. No Twilio SDK — uses REST API directly.
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
      return NextResponse.json({ error: "Failed to create call session" }, { status: 500 });
    }

    // Call User B
    const callB = await twilioCall(
      calleePhone,
      TWILIO_PHONE_NUMBER,
      `${baseUrl}/api/call/connect?callerLang=${callerLanguage}&callSidA=web&calleeLang=${calleeLanguage}&skipGather=1`,
      `${baseUrl}/api/call/status`
    );

    // Update session
    await admin
      .from("call_sessions")
      .update({ twilio_call_sid_b: callB.sid, status: "ringing" })
      .eq("id", session.id);

    return NextResponse.json({ ok: true, sessionId: session.id });
  } catch (err) {
    console.error("[Call Initiate] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
