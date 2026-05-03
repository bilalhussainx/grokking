import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { getVoiceProviderConfig, synthesizeSpeech } from "@/lib/voice-provider-router";

/**
 * POST /api/language/tts
 *
 * Synthesize speech for a given text and language.
 * Used by the translation widget for audio playback.
 * No extra credit cost (already paid for translation).
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { text, language } = body;

  if (!text || !language) {
    return NextResponse.json(
      { error: "Missing required fields: text, language" },
      { status: 400 }
    );
  }

  if (text.length > 500) {
    return NextResponse.json(
      { error: "Text too long. Maximum 500 characters." },
      { status: 400 }
    );
  }

  try {
    const providerConfig = getVoiceProviderConfig({ language });
    let audioBuffer: ArrayBuffer;
    let contentType = "audio/wav";

    if (providerConfig.tts.provider === "google") {
      // Google's SDK is server-only (Node tls/net deps); import here so
      // it never ends up in client bundles via voice-provider-router.
      const { synthesizeWithGoogle } = await import("@/lib/voice/google-tts");
      audioBuffer = await synthesizeWithGoogle(text, {
        languageCode: providerConfig.tts.voiceId,
      });
      contentType = "audio/mpeg"; // google-tts.ts returns MP3
    } else {
      audioBuffer = await synthesizeSpeech(text, providerConfig);
    }

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[TTS] Error:", error);
    return NextResponse.json(
      { error: "Failed to synthesize speech" },
      { status: 500 }
    );
  }
}
