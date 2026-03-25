import { NextRequest, NextResponse } from "next/server";

const LANG_MAP: Record<string, string> = {
  "1": "en", "2": "es", "3": "fr", "4": "de",
  "5": "it", "6": "nl", "7": "ja",
};

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German",
  it: "Italian", nl: "Dutch", ja: "Japanese",
};

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
const BRIDGE_URL = process.env.CALL_BRIDGE_URL || "";

/**
 * POST /api/call/gather
 * Receives DTMF digits. No Twilio SDK — uses raw TwiML + REST API.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const digits = formData.get("Digits") as string;
  const callSid = formData.get("CallSid") as string;
  const step = req.nextUrl.searchParams.get("step");

  if (step === "language") {
    const lang = LANG_MAP[digits];
    if (!lang) {
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna">Invalid choice.</Say><Redirect>/api/call/incoming</Redirect></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">You selected ${LANG_NAMES[lang]}. Now enter the phone number you want to call, followed by the pound key.</Say>
  <Gather action="/api/call/gather?step=phone&amp;lang=${lang}&amp;callSidA=${callSid}" method="POST" finishOnKey="#" timeout="15">
    <Say voice="Polly.Joanna">Enter the full phone number with country code.</Say>
  </Gather>
</Response>`;

    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  if (step === "phone") {
    const callerLang = req.nextUrl.searchParams.get("lang") || "en";
    const callSidA = req.nextUrl.searchParams.get("callSidA") || callSid;
    const phoneNumber = `+${digits}`;

    const baseUrl = req.nextUrl.origin || `https://${req.headers.get("host")}`;

    // Initiate outbound call via Twilio REST API (no SDK)
    const sessionId = `dial-${Date.now()}`;
    try {
      const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

      // Use bridge if configured, otherwise standard connect route
      const connectUrl = BRIDGE_URL
        ? `https://${BRIDGE_URL}/voice/b/${sessionId}?callerLang=${callerLang}&calleeLang=pending`
        : `${baseUrl}/api/call/connect?callerLang=${callerLang}&callSidA=${callSidA}`;

      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: phoneNumber,
            From: TWILIO_PHONE_NUMBER,
            Url: connectUrl,
            StatusCallback: `${baseUrl}/api/call/status`,
            StatusCallbackEvent: "completed failed no-answer",
          }),
        }
      );
    } catch (err) {
      console.error("[Call] Failed to initiate outbound call:", err);
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna">Sorry, we could not connect the call. Please try again.</Say><Hangup/></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // Connect Caller A to bridge stream (if available) or hold with music
    const twiml = BRIDGE_URL
      ? `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Calling ${phoneNumber}. Connecting you with real-time translation.</Say>
  <Connect>
    <Stream url="wss://${BRIDGE_URL}/stream/a/${sessionId}" />
  </Connect>
</Response>`
      : `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Calling ${phoneNumber}. Please hold while we connect you.</Say>
  <Play loop="10">http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-B8075.mp3</Play>
</Response>`;

    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Redirect>/api/call/incoming</Redirect></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
