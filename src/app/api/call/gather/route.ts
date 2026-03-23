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

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

/**
 * POST /api/call/gather
 * Receives DTMF digits for language choice and phone number.
 * Two steps: ?step=language (gather language) → ?step=phone (gather number) → initiate call
 */
export async function POST(req: NextRequest) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  const formData = await req.formData();
  const digits = formData.get("Digits") as string;
  const callSid = formData.get("CallSid") as string;
  const step = req.nextUrl.searchParams.get("step");

  if (step === "language") {
    // Step 1: Language selected
    const lang = LANG_MAP[digits];
    if (!lang) {
      twiml.say({ voice: "Polly.Joanna" }, "Invalid choice.");
      twiml.redirect("/api/call/incoming");
      return new NextResponse(twiml.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }

    twiml.say(
      { voice: "Polly.Joanna" },
      `You selected ${LANG_NAMES[lang]}. Now enter the phone number you want to call, followed by the pound key.`
    );

    const gather = twiml.gather({
      action: `/api/call/gather?step=phone&lang=${lang}&callSidA=${callSid}`,
      method: "POST",
      finishOnKey: "#",
      timeout: 15,
    });

    gather.say({ voice: "Polly.Joanna" }, "Enter the full phone number with country code.");

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }

  if (step === "phone") {
    // Step 2: Phone number entered — initiate outbound call
    const callerLang = req.nextUrl.searchParams.get("lang") || "en";
    const callSidA = req.nextUrl.searchParams.get("callSidA") || callSid;
    const phoneNumber = `+${digits}`;

    twiml.say(
      { voice: "Polly.Joanna" },
      `Calling ${phoneNumber}. Please hold while we connect you.`
    );

    // Hold music while we connect
    twiml.play({ loop: 10 }, "http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-B8075.mp3");

    // Initiate outbound call to User B via Twilio REST API
    try {
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const baseUrl = req.nextUrl.origin || `https://${req.headers.get("host")}`;

      await client.calls.create({
        to: phoneNumber,
        from: TWILIO_PHONE_NUMBER,
        url: `${baseUrl}/api/call/connect?callerLang=${callerLang}&callSidA=${callSidA}`,
        statusCallback: `${baseUrl}/api/call/status`,
        statusCallbackEvent: ["completed", "failed", "no-answer"],
      });
    } catch (err) {
      console.error("[Call] Failed to initiate outbound call:", err);
      twiml.say({ voice: "Polly.Joanna" }, "Sorry, we could not connect the call. Please try again.");
      twiml.hangup();
    }

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }

  // Unknown step
  twiml.redirect("/api/call/incoming");
  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
