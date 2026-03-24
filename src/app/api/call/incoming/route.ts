import { NextResponse } from "next/server";

/**
 * POST /api/call/incoming
 * Twilio webhook — handles incoming call. Returns TwiML XML directly.
 */
export async function POST() {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">Welcome to Samsara Translate. Real-time translated calls.</Say>
  <Gather action="/api/call/gather?step=language" method="POST" numDigits="1" timeout="10">
    <Say voice="Polly.Joanna" language="en-US">Press 1 for English. Press 2 for Spanish. Press 3 for French. Press 4 for German. Press 5 for Italian. Press 6 for Dutch. Press 7 for Japanese.</Say>
  </Gather>
  <Redirect>/api/call/incoming</Redirect>
</Response>`;

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
