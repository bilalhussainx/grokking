import { NextRequest } from "next/server";

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || "";
const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // default: Rachel

export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return Response.json({ error: "ElevenLabs API key not configured" }, { status: 500 });
  }

  const { text } = await req.json();
  if (!text) {
    return Response.json({ error: "No text provided" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("[TTS] ElevenLabs error:", res.status, err);
    return Response.json({ error: "TTS failed" }, { status: 500 });
  }

  // Stream the audio back
  return new Response(res.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
    },
  });
}
