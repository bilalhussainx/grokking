import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

/**
 * POST /api/call/incoming
 * Twilio webhook — handles incoming call to Samsara number.
 * Returns TwiML to gather caller's language choice.
 */
export async function POST(req: NextRequest) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  // Welcome message
  twiml.say(
    { voice: "Polly.Joanna", language: "en-US" },
    "Welcome to Samsara Translate. Real-time translated calls."
  );

  // Gather language choice via DTMF
  const gather = twiml.gather({
    action: "/api/call/gather?step=language",
    method: "POST",
    numDigits: 1,
    timeout: 10,
  });

  gather.say(
    { voice: "Polly.Joanna", language: "en-US" },
    "Press 1 for English. Press 2 for Spanish. Press 3 for French. Press 4 for German. Press 5 for Italian. Press 6 for Dutch. Press 7 for Japanese."
  );

  // If no input, repeat
  twiml.redirect("/api/call/incoming");

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
