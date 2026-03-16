import { NextRequest } from "next/server";
import { getVoice } from "@/lib/voice-personas";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";

export async function POST(req: NextRequest) {
  if (!DEEPGRAM_API_KEY) {
    return Response.json({ error: "Deepgram API key not configured" }, { status: 500 });
  }

  const { text, voiceId } = await req.json();
  if (!text) {
    return Response.json({ error: "No text provided" }, { status: 400 });
  }

  const voice = getVoice(voiceId || "thalia");

  const res = await fetch(
    `https://api.deepgram.com/v1/speak?model=${voice.deepgramModel}&encoding=mp3`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("[TTS] Deepgram error:", res.status, err);
    return Response.json({ error: "TTS failed" }, { status: 500 });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
    },
  });
}
