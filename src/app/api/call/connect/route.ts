import { NextRequest, NextResponse } from "next/server";

const LANG_MAP: Record<string, string> = {
  "1": "en", "2": "es", "3": "fr", "4": "de",
  "5": "it", "6": "nl", "7": "ja",
};

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German",
  it: "Italian", nl: "Dutch", ja: "Japanese",
};

const BRIDGE_URL = process.env.CALL_BRIDGE_URL || "";

/**
 * POST /api/call/connect
 * Called when User B picks up. Returns TwiML that either:
 * - Connects to the call bridge (if CALL_BRIDGE_URL is set) for real-time translation
 * - Falls back to a hold (if bridge is not configured)
 */
export async function POST(req: NextRequest) {
  const callerLang = req.nextUrl.searchParams.get("callerLang") || "en";
  const callSidA = req.nextUrl.searchParams.get("callSidA") || "";
  const sessionId = req.nextUrl.searchParams.get("sessionId") || callSidA;
  const calleeLang = req.nextUrl.searchParams.get("calleeLang");
  const skipGather = req.nextUrl.searchParams.get("skipGather");

  // Step 1: Gather callee's language if not provided
  if (!calleeLang && !skipGather) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">You have a translated call from Kairos.</Say>
  <Gather action="/api/call/connect?callerLang=${callerLang}&amp;callSidA=${callSidA}&amp;sessionId=${sessionId}&amp;calleeLang=pending" method="POST" numDigits="1" timeout="10">
    <Say voice="Polly.Joanna">Press 1 for English. Press 2 for Spanish. Press 3 for French. Press 4 for German. Press 5 for Italian. Press 6 for Dutch. Press 7 for Japanese.</Say>
  </Gather>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // Step 2: Resolve language
  let resolvedCalleeLang = calleeLang || "es";
  if (calleeLang === "pending") {
    const formData = await req.formData();
    const digits = formData.get("Digits") as string;
    resolvedCalleeLang = LANG_MAP[digits] || "es";
  }

  const callerName = LANG_NAMES[callerLang] || "English";
  const calleeName = LANG_NAMES[resolvedCalleeLang] || "Spanish";

  // Step 3: Connect to bridge or fallback
  if (BRIDGE_URL) {
    // Real-time translation via call bridge WebSocket
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Connected. You speak ${calleeName}, they speak ${callerName}. Starting real-time translation.</Say>
  <Connect>
    <Stream url="wss://${BRIDGE_URL}/stream/b/${sessionId}?callerLang=${callerLang}&amp;calleeLang=${resolvedCalleeLang}" />
  </Connect>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  // Fallback: no bridge configured
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Connected. You speak ${calleeName}, they speak ${callerName}. Translation bridge is not configured. Please hold.</Say>
  <Pause length="3600"/>
</Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}
