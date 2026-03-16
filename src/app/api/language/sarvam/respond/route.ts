import { NextRequest, NextResponse } from "next/server";
import { getLanguagePersona, getDefaultPersona, type ProficiencyLevel } from "@/lib/language-personas";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";

const SARVAM_SPEAKERS: Record<string, string> = {
  hi: 'priya',
  pa: 'simran',
};

const SARVAM_TTS_LANG_MAP: Record<string, string> = {
  hi: 'hi-IN',
  pa: 'pa-IN',
};

/**
 * POST /api/language/sarvam/respond
 *
 * Phase 2: LLM response + TTS audio.
 * Receives transcript text, generates response, synthesizes speech.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const transcript = formData.get('transcript') as string;
    const language = formData.get('language') as string;
    const personaId = formData.get('personaId') as string | null;
    const proficiencyLevel = formData.get('proficiencyLevel') as string | null;
    const historyJson = formData.get('conversationHistory') as string | null;

    if (!transcript?.trim() || !language) {
      return NextResponse.json({ responseText: '', audioBase64: '' });
    }

    // Parse conversation history
    let conversationHistory: Array<{ role: string; content: string }> | undefined;
    if (historyJson) {
      try { conversationHistory = JSON.parse(historyJson); } catch {}
    }

    // ── LLM: Generate response via Moonshot ──
    const persona = personaId
      ? getLanguagePersona(personaId) || getDefaultPersona(language)
      : getDefaultPersona(language);

    const level = (proficiencyLevel || 'A1') as ProficiencyLevel;
    const rule = persona.adaptiveRules.find(r => {
      const levels: ProficiencyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const idx = levels.indexOf(level);
      const lo = levels.indexOf(r.levelRange[0]);
      const hi = levels.indexOf(r.levelRange[1]);
      return idx >= lo && idx <= hi;
    }) || persona.adaptiveRules[0];

    // Script guidance per language — Sarvam pronounces native script best
    const scriptGuide: Record<string, string> = {
      hi: 'Use Devanagari script (हिंदी) for Hindi words. Mix English words naturally for the English portion. Example: "नमस्ते! आज हम basic greetings सीखेंगे।"',
      pa: 'Use Gurmukhi script (ਪੰਜਾਬੀ) for Punjabi words. Mix English words naturally for the English portion. Example: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਆਓ basic words ਸਿੱਖੀਏ।"',
    };

    const systemPrompt = `${persona.systemPrompt}

ADAPTIVE RULES for ${level} student:
- Native language ratio: ${(rule.nativeLanguageRatio * 100).toFixed(0)}% English, ${((1 - rule.nativeLanguageRatio) * 100).toFixed(0)}% target language
- Correction intensity: ${rule.correctionIntensity}
- Speech speed: ${rule.speechSpeed}
- Vocabulary: ${rule.vocabularyComplexity}

VOICE CONVERSATION RULES:
- Keep responses to 1 SHORT sentence. Maximum 2 sentences.
- ${scriptGuide[language] || 'Respond naturally in the target language mixed with English.'}
- This goes through TTS. Write exactly how it should be spoken aloud.
- No markdown, no asterisks, no emojis, no parenthetical notes.`;

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];
    if (conversationHistory?.length) {
      messages.push(...conversationHistory.slice(-6)); // Keep history short for speed
    }
    messages.push({ role: 'user', content: transcript });

    let responseText = transcript;
    if (MOONSHOT_API_KEY) {
      const llmResp = await fetch('https://api.moonshot.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MOONSHOT_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'kimi-k2-turbo-preview',
          messages,
          temperature: 0.7,
          max_tokens: 80, // ~1-2 sentences
        }),
      });

      if (llmResp.ok) {
        const data = await llmResp.json();
        responseText = data.choices?.[0]?.message?.content?.trim() || transcript;
      } else {
        console.error('[LLM] Moonshot error:', await llmResp.text());
      }
    }

    // ── TTS: Synthesize with Sarvam ──
    let audioBase64 = '';
    const speaker = SARVAM_SPEAKERS[language];
    const targetLang = SARVAM_TTS_LANG_MAP[language];

    if (speaker && targetLang && SARVAM_API_KEY) {
      const ttsResp = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': SARVAM_API_KEY,
        },
        body: JSON.stringify({
          text: responseText,
          target_language_code: targetLang,
          speaker,
          model: 'bulbul:v3',
          pace: 1.0,
          speech_sample_rate: 22050,
          output_audio_codec: 'mp3',
        }),
      });

      if (ttsResp.ok) {
        const data = await ttsResp.json();
        audioBase64 = data.audios?.[0] || '';
      } else {
        console.error('[Sarvam TTS] Error:', await ttsResp.text());
      }
    }

    return NextResponse.json({ responseText, audioBase64 });
  } catch (error) {
    console.error("[Respond] Error:", error);
    return NextResponse.json(
      { error: "Processing failed", details: String(error) },
      { status: 500 }
    );
  }
}
