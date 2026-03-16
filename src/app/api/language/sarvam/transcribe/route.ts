import { NextRequest, NextResponse } from "next/server";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";

// Deepgram STT for Hindi, Sarvam STT for Punjabi
const SARVAM_STT_LANGUAGES = ['pa'];

/**
 * POST /api/language/sarvam/transcribe
 *
 * Phase 1: Fast STT only — returns transcript immediately.
 * ~500ms for Deepgram, ~1s for Sarvam.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio') as Blob | null;
    const language = formData.get('language') as string;

    if (!audioBlob || audioBlob.size === 0 || !language) {
      return NextResponse.json({ transcript: '' });
    }

    let transcript = '';

    if (SARVAM_STT_LANGUAGES.includes(language)) {
      // Sarvam STT for Punjabi
      if (!SARVAM_API_KEY) throw new Error('Sarvam API key not configured');

      const sarvamLangMap: Record<string, string> = { hi: 'hi-IN', pa: 'pa-IN' };
      const sttForm = new FormData();
      sttForm.append('file', audioBlob, 'recording.webm');
      sttForm.append('model', 'saaras:v3');
      sttForm.append('language_code', sarvamLangMap[language] || 'hi-IN');

      const resp = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: { 'api-subscription-key': SARVAM_API_KEY },
        body: sttForm,
      });

      if (!resp.ok) {
        const err = await resp.text();
        console.error('[Sarvam STT] Error:', err);
        return NextResponse.json({ transcript: '' });
      }

      const data = await resp.json();
      transcript = data.transcript || '';
    } else {
      // Deepgram STT for Hindi and others
      if (!DEEPGRAM_API_KEY) throw new Error('Deepgram API key not configured');

      const audioBuffer = await audioBlob.arrayBuffer();
      const resp = await fetch(
        `https://api.deepgram.com/v1/listen?model=nova-3&language=${language}&smart_format=true`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${DEEPGRAM_API_KEY}`,
            'Content-Type': 'audio/webm',
          },
          body: audioBuffer,
        }
      );

      if (!resp.ok) {
        const err = await resp.text();
        console.error('[Deepgram STT] Error:', err);
        return NextResponse.json({ transcript: '' });
      }

      const data = await resp.json();
      transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    }

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("[Transcribe] Error:", error);
    return NextResponse.json({ transcript: '' });
  }
}
