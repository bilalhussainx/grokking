import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const LANG_MAP: Record<string, string> = {
  "1": "en", "2": "es", "3": "fr", "4": "de",
  "5": "it", "6": "nl", "7": "ja",
};

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German",
  it: "Italian", nl: "Dutch", ja: "Japanese",
};

/**
 * POST /api/call/connect
 * Called when User B picks up. Gathers their language, then connects media streams.
 */
export async function POST(req: NextRequest) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  const callerLang = req.nextUrl.searchParams.get("callerLang") || "en";
  const callSidA = req.nextUrl.searchParams.get("callSidA") || "";
  const calleeLang = req.nextUrl.searchParams.get("calleeLang");

  if (!calleeLang) {
    // First time — gather User B's language
    twiml.say(
      { voice: "Polly.Joanna" },
      "You have a translated call from Samsara."
    );

    const gather = twiml.gather({
      action: `/api/call/connect?callerLang=${callerLang}&callSidA=${callSidA}&calleeLang=pending`,
      method: "POST",
      numDigits: 1,
      timeout: 10,
    });

    gather.say(
      { voice: "Polly.Joanna" },
      "Press 1 for English. Press 2 for Spanish. Press 3 for French. Press 4 for German. Press 5 for Italian. Press 6 for Dutch. Press 7 for Japanese."
    );

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }

  // Language gathered — read digits from form data
  const formData = await req.formData();
  const digits = formData.get("Digits") as string;
  const resolvedCalleeLang = LANG_MAP[digits] || "es";

  const callerName = LANG_NAMES[callerLang] || "English";
  const calleeName = LANG_NAMES[resolvedCalleeLang] || "Spanish";

  twiml.say(
    { voice: "Polly.Joanna" },
    `Connected. You speak ${calleeName}, they speak ${callerName}. Starting real-time translation.`
  );

  // Start Media Stream — this sends raw audio to our WebSocket
  const baseUrl = req.nextUrl.origin || `https://${req.headers.get("host")}`;
  const streamUrl = baseUrl.replace("https://", "wss://").replace("http://", "ws://");

  // Start media stream for this leg (User B)
  const start = twiml.start();
  start.stream({
    url: `${streamUrl}/api/call/media-stream?role=callee&callerLang=${callerLang}&calleeLang=${resolvedCalleeLang}&callSidA=${callSidA}`,
  });

  // Keep the call alive with a long pause
  twiml.pause({ length: 3600 }); // 1 hour max

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
