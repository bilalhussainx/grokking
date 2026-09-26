import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, addCredits } from "@/lib/credits";
import { translate, generateWithMoonshot } from "@/lib/voice-provider-router";

const CREDIT_COST_TRANSLATION = 1;

/**
 * POST /api/language/translate
 * 
 * Translates text using local Ollama (primary) or Kimi K2 API (fallback).
 * Cost: 1 credit per translation request.
 * 
 * Request body:
 * {
 *   text: string;
 *   fromLang: string;  // BCP-47 code (e.g., 'en', 'es', 'fr')
 *   toLang: string;
 *   context?: string;  // Optional lesson context for better translation
 * }
 * 
 * Response:
 * {
 *   originalText: string;
 *   translatedText: string;
 *   fromLang: string;
 *   toLang: string;
 *   pronunciation?: string;  // IPA or phonetic
 *   usedLocal: boolean;      // Whether local Ollama was used
 * }
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { text, fromLang, toLang, context } = body;

  // Validate request
  if (!text || !fromLang || !toLang) {
    return NextResponse.json(
      { error: "Missing required fields: text, fromLang, toLang" },
      { status: 400 }
    );
  }

  if (text.length > 1000) {
    return NextResponse.json(
      { error: "Text too long. Maximum 1000 characters." },
      { status: 400 }
    );
  }

  // Deduct credits
  const ok = await deductCredits(user.id, CREDIT_COST_TRANSLATION, "translation");
  if (!ok) {
    return NextResponse.json(
      { error: "Insufficient credits. Translations cost 1 credit each." },
      { status: 402 }
    );
  }

  try {
    // Perform translation via Moonshot API (Kimi K2)
    const translatedText = await translate({
      text,
      fromLang,
      toLang,
      context,
    });

    // Generate pronunciation guide for target language (if not English)
    let pronunciation: string | undefined;
    if (toLang !== 'en') {
      try {
        pronunciation = await generatePronunciation(translatedText, toLang);
      } catch {
        // Pronunciation is optional, don't fail the request
      }
    }

    return NextResponse.json({
      originalText: text,
      translatedText,
      fromLang,
      toLang,
      pronunciation,
      provider: 'moonshot-api',
      credits: {
        deducted: CREDIT_COST_TRANSLATION,
      },
    });

  } catch (error) {
    console.error("[Translation] Error:", error);
    
    // Refund credits on error
    await addCredits(user.id, CREDIT_COST_TRANSLATION, "translation_refund");
    
    return NextResponse.json(
      { error: "Translation failed", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Generate pronunciation guide using Moonshot API
 */
async function generatePronunciation(text: string, language: string): Promise<string> {
  const result = await generateWithMoonshot([
    {
      role: 'system',
      content: 'You are a pronunciation guide. Return the COMPLETE phrase as one fluent phonetic pronunciation using English letters. Never break words into individual syllables or letters. Write it as one continuous readable phrase. No explanations, no hyphens between syllables, just the natural spoken pronunciation.',
    },
    {
      role: 'user',
      content: `Phonetic pronunciation for this ${language} phrase: "${text}"`,
    },
  ], { temperature: 0.1, maxTokens: 100 });

  return result.trim();
}

/**
 * GET /api/language/translate/languages
 * 
 * Get list of supported translation languages
 */
export async function GET(req: NextRequest) {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  ];

  return NextResponse.json({ languages });
}
