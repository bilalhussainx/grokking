import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { getLanguagePersona, toVoiceAgentConfig, getDefaultPersona } from "@/lib/language-personas";
import { getVoiceProviderConfig } from "@/lib/voice-provider-router";

/**
 * GET /api/language/persona-config
 * 
 * Get the VoiceAgentConfig for a specific language and persona.
 * Used by useLanguageVoiceAgent hook to initialize voice sessions.
 * 
 * Query params:
 * - language: BCP-47 language code (e.g., 'es', 'fr', 'ur')
 * - personaId: Optional persona ID (defaults to conversational style)
 * - proficiencyLevel: Optional level (A1, A2, B1, B2, C1, C2)
 */
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');
  const personaId = searchParams.get('personaId');
  const proficiencyLevel = searchParams.get('proficiencyLevel') || 'A1';

  if (!language) {
    return NextResponse.json(
      { error: "Missing required parameter: language" },
      { status: 400 }
    );
  }

  try {
    // Get persona
    let persona;
    if (personaId) {
      persona = getLanguagePersona(personaId);
    }
    
    // Fall back to default persona for language
    if (!persona) {
      persona = getDefaultPersona(language);
    }

    // Get user's language profile for context
    const { data: profile } = await supabase
      .from('user_language_profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('target_language', language)
      .single();

    // Get voice provider config
    const providerConfig = getVoiceProviderConfig({
      language,
      voiceId: persona.defaultVoice.voiceId,
    });

    // Build VoiceAgentConfig
    const voiceConfig = toVoiceAgentConfig(persona, {
      language,
      proficiencyLevel: proficiencyLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
    });

    const userName = user.user_metadata?.full_name || undefined;
    const effectiveLevel = (profile?.proficiency_level || proficiencyLevel) as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

    return NextResponse.json({
      config: voiceConfig,
      greeting: persona.greeting(effectiveLevel, userName),
      persona: {
        id: persona.id,
        name: persona.name,
        style: persona.style,
        language: persona.language,
        description: persona.description,
        culturalBackground: persona.culturalBackground,
      },
      provider: {
        tier: providerConfig.tier,
        stt: providerConfig.stt.provider,
        tts: providerConfig.tts.provider,
        llm: providerConfig.llm.provider,
      },
      userProgress: profile ? {
        proficiencyLevel: profile.proficiency_level,
        totalPracticeMinutes: profile.total_practice_minutes,
        streakDays: profile.streak_days,
      } : null,
    });

  } catch (error) {
    console.error("[Persona Config] Error:", error);
    return NextResponse.json(
      { error: "Failed to get persona config", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/language/persona-config/list
 * 
 * List all available personas for a language
 */
export async function listPersonas(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');

  if (!language) {
    return NextResponse.json(
      { error: "Missing required parameter: language" },
      { status: 400 }
    );
  }

  const { getLanguagePersonas, getSupportedLanguages } = await import('@/lib/language-personas');
  
  const personas = getLanguagePersonas(language);
  const allLanguages = getSupportedLanguages();
  const languageInfo = allLanguages.find(l => l.code === language);

  return NextResponse.json({
    language: languageInfo,
    personas: personas.map(p => ({
      id: p.id,
      name: p.name,
      style: p.style,
      description: p.description,
      culturalBackground: p.culturalBackground,
      defaultVoice: p.defaultVoice,
    })),
  });
}
