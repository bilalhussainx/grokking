import { NextRequest } from "next/server";
import { getLanguagePersona, getDefaultPersona, type ProficiencyLevel } from "@/lib/language-personas";
import { createServerSupabase } from "@/lib/supabase-auth";
import { GOOGLE_TTS_LANG_CODES, isGoogleTtsLanguage } from "@/lib/voice-provider-router";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// LLM brain — OpenRouter primary (Claude Sonnet 4.5), Kimi fallback.
// Spec: 2026-04-07 OpenRouter parity with Coach Kairos
const VOICE_LLM_MODEL = process.env.OPENROUTER_VOICE_MODEL || "anthropic/claude-sonnet-4.5";

// Languages this endpoint currently terminates TTS for via Sarvam Bulbul.
const SARVAM_LANGUAGES = ['hi', 'pa'];
const SARVAM_STT_LANGUAGES = ['pa'];

// Languages this endpoint terminates TTS for via Google Cloud TTS. STT for
// these still goes through Deepgram nova-3 (which covers all 8 natively).
// Voices are auto-selected from DEFAULT_VOICES in src/lib/voice/google-tts.ts.
const GOOGLE_TTS_LANGUAGES = Object.keys(GOOGLE_TTS_LANG_CODES);

const SARVAM_SPEAKERS: Record<string, string> = {
  hi: 'priya',
  pa: 'simran',
};

const SARVAM_TTS_LANG_MAP: Record<string, string> = {
  hi: 'hi-IN',
  pa: 'pa-IN',
};

const scriptGuide: Record<string, string> = {
  hi: 'Use Devanagari script (हिंदी) for Hindi words. Mix English words naturally for the English portion.',
  pa: 'Use Gurmukhi script (ਪੰਜਾਬੀ) for Punjabi words. Mix English words naturally for the English portion.',
};

/**
 * POST /api/language/sarvam/stream
 *
 * Single streaming endpoint that does STT → LLM (streaming) → TTS in one request.
 * Streams NDJSON events back to the client:
 *   {"type":"transcript","text":"..."}     — user's speech transcribed (show immediately)
 *   {"type":"response","text":"..."}       — LLM response text (show immediately)
 *   {"type":"audio","base64":"..."}        — TTS audio (play immediately)
 *   {"type":"error","message":"..."}       — error occurred
 *
 * This eliminates the round-trip between Phase 1 (transcribe) and Phase 2 (respond),
 * saving ~100-300ms, and uses streaming LLM to get text faster.
 */
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };

      try {
        const formData = await req.formData();
        const audioBlob = formData.get('audio') as Blob | null;
        const language = formData.get('language') as string;
        const personaId = formData.get('personaId') as string | null;
        const proficiencyLevel = formData.get('proficiencyLevel') as string | null;
        const historyJson = formData.get('conversationHistory') as string | null;
        const lessonContextJson = formData.get('lessonContext') as string | null;
        const lessonTitle = formData.get('lessonTitle') as string | null;
        // mode discriminator: 'language' (default), 'interviewer', 'coach'.
        // Interview spec: 2026-04-07-multilingual-interviews-design.md.
        // Coach mode (added 2026-05-04): when set, the caller passes a fully
        // formed Coach Kairos system prompt; the language-tutor persona logic
        // is bypassed entirely.
        const mode = (formData.get('mode') as string | null) || 'language';
        const companyPersonaId = formData.get('companyPersonaId') as string | null;
        const questionPlanJson = formData.get('questionPlan') as string | null;
        const interviewType = formData.get('interviewType') as string | null;
        // Coach Kairos system prompt passed in by useVoiceAgent when
        // mode === 'coach'. Already includes the language directive; we
        // append voice rules below.
        const passedSystemPrompt = formData.get('systemPrompt') as string | null;

        const lessonContext = lessonContextJson ? JSON.parse(lessonContextJson) : null;

        const isGreeting = formData.get('greeting') === 'true';

        const isSarvam = SARVAM_LANGUAGES.includes(language);
        const isGoogle = isGoogleTtsLanguage(language);
        if (!language || (!isSarvam && !isGoogle)) {
          send({ type: 'error', message: `Unsupported language: ${language}` });
          controller.close();
          return;
        }

        if (!SARVAM_API_KEY && SARVAM_STT_LANGUAGES.includes(language)) {
          send({ type: 'error', message: 'Voice service not configured. Please contact support.' });
          controller.close();
          return;
        }

        if (!audioBlob || audioBlob.size < 500) {
          if (isGreeting && (!audioBlob || audioBlob.size < 500)) {
            // Generate greeting without requiring audio input
            let greetingText: string;

            if (mode === 'coach') {
              // Coach Kairos mode: a single short opening that asks for GPA.
              // Kept English here intentionally — the LLM-driven follow-ups
              // run through the language directive in passedSystemPrompt and
              // come back in the user's chosen language. If you need to seed
              // a localized greeting, the caller should pass it via the
              // 'greetingText' formData field (TODO if needed).
              greetingText = "Hi — let's start with your GPA. What's your unweighted GPA on the 4.0 scale?";
            } else if (mode === 'interviewer') {
              // Interview mode: use the company persona's openingLine, code-mixed if needed
              try {
                const { getCompanyPersona } = await import('@/data/interview-personas');
                const companyPersona = getCompanyPersona(companyPersonaId || 'generic');
                // For Hindi/Punjabi, prepend a code-mixed opener
                const codeMixIntro = language === 'hi'
                  ? 'Hi, namaste! '
                  : language === 'pa'
                    ? 'Sat sri akal! '
                    : '';
                greetingText = codeMixIntro + companyPersona.openingLine;
              } catch {
                greetingText = 'Hi, welcome to your mock interview. Are you ready to start?';
              }
            } else {
              // Language learning mode (existing behavior)
              const persona = personaId
                ? getLanguagePersona(personaId) || getDefaultPersona(language)
                : getDefaultPersona(language);
              greetingText = persona.greeting(
                (proficiencyLevel || 'A1') as any,
                undefined
              );
            }

            send({ type: 'response', text: greetingText });

            // TTS for greeting — Google for the 8-language pipeline,
            // Sarvam Bulbul for Hindi/Punjabi.
            if (greetingText && isGoogle) {
              try {
                const { synthesizeWithGoogle } = await import('@/lib/voice/google-tts');
                const locale = GOOGLE_TTS_LANG_CODES[language];
                if (locale) {
                  const audioBuffer = await synthesizeWithGoogle(greetingText, {
                    languageCode: locale,
                  });
                  const audioBase64 = Buffer.from(audioBuffer).toString('base64');
                  if (audioBase64) {
                    send({ type: 'audio', base64: audioBase64 });
                  }
                }
              } catch (err) {
                console.error('[SarvamStream] Google greeting TTS error:', err);
              }
            } else if (greetingText && isSarvam) {
              const speaker = SARVAM_SPEAKERS[language];
              const targetLang = SARVAM_TTS_LANG_MAP[language];
              if (speaker && targetLang && SARVAM_API_KEY) {
                try {
                  const ttsResp = await fetch('https://api.sarvam.ai/text-to-speech', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'api-subscription-key': SARVAM_API_KEY,
                    },
                    body: JSON.stringify({
                      inputs: [greetingText],
                      target_language_code: targetLang,
                      speaker: speaker,
                      model: 'bulbul:v2',
                    }),
                  });

                  if (ttsResp.ok) {
                    const ttsData = await ttsResp.json();
                    if (ttsData.audios?.[0]) {
                      send({ type: 'audio', base64: ttsData.audios[0] });
                    } else {
                      // Sarvam Bulbul-v3 sometimes returns 200 with an empty
                      // audios array on certain inputs (very short, very long,
                      // special chars). Used to skip silently — log it now so
                      // we have a signal when greetings audibly fail.
                      console.warn('[SarvamStream] Sarvam returned 200 but empty audios', {
                        targetLang, textLength: greetingText.length, response: ttsData,
                      });
                    }
                  } else {
                    const errText = await ttsResp.text().catch(() => '');
                    console.error('[SarvamStream] Sarvam TTS non-OK:', ttsResp.status, errText);
                  }
                } catch (err) {
                  console.error('[SarvamStream] Greeting TTS error:', err);
                }
              }
            }

            controller.close();
            return;
          }

          send({ type: 'error', message: 'No audio provided' });
          controller.close();
          return;
        }

        let conversationHistory: Array<{ role: string; content: string }> | undefined;
        if (historyJson) {
          try { conversationHistory = JSON.parse(historyJson); } catch {}
        }

        // ── Step 1: STT ──
        let transcript = '';
        if (SARVAM_STT_LANGUAGES.includes(language)) {
          // Sarvam STT for Punjabi
          const sttForm = new FormData();
          sttForm.append('file', audioBlob, 'recording.webm');
          sttForm.append('model', 'saaras:v3');
          const langMap: Record<string, string> = { hi: 'hi-IN', pa: 'pa-IN' };
          sttForm.append('language_code', langMap[language] || 'hi-IN');

          const sttResp = await fetch('https://api.sarvam.ai/speech-to-text', {
            method: 'POST',
            headers: { 'api-subscription-key': SARVAM_API_KEY },
            body: sttForm,
          });
          if (sttResp.ok) {
            const data = await sttResp.json();
            transcript = data.transcript || '';
          } else {
            const err = await sttResp.text().catch(() => "");
            console.error('[SarvamStream] STT failed:', sttResp.status, err);
          }
        } else {
          // Deepgram STT for Hindi
          const audioBuffer = await audioBlob.arrayBuffer();
          const sttResp = await fetch(
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
          if (sttResp.ok) {
            const data = await sttResp.json();
            transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
          } else {
            const err = await sttResp.text().catch(() => "");
            console.error('[SarvamStream] Deepgram STT failed:', sttResp.status, err);
          }
        }

        if (!transcript.trim()) {
          send({ type: 'error', message: 'Speech not recognized. Please speak clearly and try again.' });
          controller.close();
          return;
        }

        // Stream transcript immediately — client shows user message
        send({ type: 'transcript', text: transcript });

        // ── Step 2: LLM (streaming) ──
        let systemPrompt: string;

        if (mode === 'coach') {
          // Coach Kairos mode: caller passes a fully-formed system prompt that
          // already includes the language directive + student context. We just
          // append voice-specific rules so the LLM keeps replies short and
          // free of markdown.
          const coachBase = passedSystemPrompt && passedSystemPrompt.length > 50
            ? passedSystemPrompt
            : "You are Coach Kairos, a college counselor. Guide the student step by step through intake → school list → essays → interviews → financial aid. Ask one question at a time.";
          systemPrompt = `${coachBase}

VOICE CONVERSATION RULES:
- Keep responses to 1 short sentence. Maximum 2 sentences.
- This goes through TTS. Write exactly how it should be spoken aloud.
- No markdown, no asterisks, no emojis, no parenthetical notes.
- Ask one question at a time. Wait for the student's answer before moving on.`;
        } else if (mode === 'interviewer') {
          // ── Interview mode: build company persona + code-mix prompt ──
          // (Spec: 2026-04-07-multilingual-interviews-design.md)
          try {
            const { getCompanyPersona } = await import('@/data/interview-personas');
            const { buildInterviewerSystemPrompt } = await import('@/lib/interview-prompt-builders');
            const companyPersona = getCompanyPersona(companyPersonaId || 'generic');
            const interviewerBlock = buildInterviewerSystemPrompt(companyPersona, language);

            const planBlock = questionPlanJson
              ? `\n\n## QUESTION PLAN\nUse this as the structure for the interview. Adapt follow-ups based on the candidate's answers — do not robotically read them in order.\n\nInterview type: ${interviewType || 'technical'}\n\n${questionPlanJson}`
              : '';

            systemPrompt = `${interviewerBlock}${planBlock}

VOICE CONVERSATION RULES:
- Keep responses to 1-2 short sentences. This is voice — short and punchy.
- ${scriptGuide[language] || 'Respond naturally in the target language mixed with English for technical terms.'}
- This goes through TTS. Write exactly how it should be spoken aloud.
- No markdown, no asterisks, no emojis, no parenthetical notes.`;
          } catch (e) {
            console.error('[SarvamStream] Failed to build interviewer prompt, falling back:', e);
            systemPrompt = `You are a senior software interviewer conducting a mock interview in ${language}. Mix English freely for technical terms (React, hashmap, O(n), API). Keep responses to 1-2 short sentences. Ask one question at a time and adapt to the candidate's answers.`;
          }
        } else {
          // ── Language learning mode (existing behavior) ──
          // Persona + adaptive-rule lookup live here (instead of being hoisted
          // above the mode branches) because coach + interviewer modes don't
          // touch them and the language-tutor persona lookup can throw on
          // unknown languages — keeping it scoped avoids that.
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

          // Sub-project 4: inject persistent language profile (vocab due, errors, level)
          let languageProfileBlock = "";
          try {
            const supabase = await createServerSupabase();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { ensureProfile, formatProfileForPrompt } = await import("@/lib/language-profile");
              const profile = await ensureProfile(user.id, language, level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2");
              if (profile) {
                languageProfileBlock = "\n\n" + formatProfileForPrompt(profile, persona.languageName || language);
              }
            }
          } catch (err) {
            console.warn("[SarvamStream] language profile load failed:", err);
          }

          systemPrompt = `${persona.systemPrompt}

ADAPTIVE RULES for ${level} student:
- Native language ratio: ${(rule.nativeLanguageRatio * 100).toFixed(0)}% English, ${((1 - rule.nativeLanguageRatio) * 100).toFixed(0)}% target language
- Correction intensity: ${rule.correctionIntensity}
- Speech speed: ${rule.speechSpeed}
- Vocabulary: ${rule.vocabularyComplexity}

VOICE CONVERSATION RULES:
- Keep responses to 1 SHORT sentence. Maximum 2 sentences.
- ${scriptGuide[language] || 'Respond naturally in the target language mixed with English.'}
- This goes through TTS. Write exactly how it should be spoken aloud.
- No markdown, no asterisks, no emojis, no parenthetical notes.${languageProfileBlock}`;
        }

        if (lessonContext) {
          systemPrompt += `\n\n## CURRENT LESSON CONTEXT
Lesson: ${lessonContext.lessonTitle || lessonTitle || 'General'}
Target phrases to practice: ${lessonContext.targetPhrases?.join(', ') || 'General conversation'}
Vocabulary focus: ${lessonContext.vocabulary?.join(', ') || 'General'}
Grammar focus: ${lessonContext.grammarFocus?.join(', ') || 'General'}

IMPORTANT: Focus conversation on the lesson topic above. Create scenarios where the student must use these words and structures. Gently redirect if conversation drifts from lesson material.`;
        }

        const messages: Array<{ role: string; content: string }> = [
          { role: 'system', content: systemPrompt },
        ];
        if (conversationHistory?.length) {
          messages.push(...conversationHistory.slice(-6));
        }
        messages.push({ role: 'user', content: transcript });

        let responseText = '';

        // OpenRouter primary, Kimi fallback
        const useOpenRouter = !!OPENROUTER_API_KEY;
        const llmUrl = useOpenRouter
          ? 'https://openrouter.ai/api/v1/chat/completions'
          : 'https://api.moonshot.ai/v1/chat/completions';
        const llmKey = useOpenRouter ? OPENROUTER_API_KEY : MOONSHOT_API_KEY;
        const llmModel = useOpenRouter ? VOICE_LLM_MODEL : 'kimi-k2-turbo-preview';

        if (llmKey) {
          // Use streaming to get text faster
          const llmResp = await fetch(llmUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${llmKey}`,
            },
            body: JSON.stringify({
              model: llmModel,
              messages,
              temperature: 0.7,
              max_tokens: 80,
              stream: true,
            }),
          });

          if (llmResp.ok && llmResp.body) {
            // Read SSE stream from Moonshot
            const reader = llmResp.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const data = trimmed.slice(5).trim();
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    responseText += delta;
                  }
                } catch {}
              }
            }

            responseText = responseText.trim();
          } else if (llmResp.ok) {
            // Fallback: non-streaming response
            const data = await llmResp.json();
            responseText = data.choices?.[0]?.message?.content?.trim() || transcript;
          } else {
            console.error('[Stream LLM] Moonshot error:', llmResp.status);
            responseText = transcript;
          }
        } else {
          responseText = transcript;
        }

        // Stream response text — client shows agent message
        send({ type: 'response', text: responseText });

        // ── Step 3: TTS ──
        // Google Cloud TTS for the 8-language pipeline (ur, zh, ko, ar, vi,
        // pt, ru, tr) — each gets its native BCP-47 voice from
        // GOOGLE_TTS_LANG_CODES so the audio is in the language's native
        // accent (not English mispronouncing the script). Sarvam Bulbul
        // continues to handle hi/pa.
        if (isGoogle && responseText) {
          try {
            const { synthesizeWithGoogle } = await import('@/lib/voice/google-tts');
            const locale = GOOGLE_TTS_LANG_CODES[language];
            if (!locale) {
              throw new Error(`No Google TTS locale for language ${language}`);
            }
            const audioBuffer = await synthesizeWithGoogle(responseText, {
              languageCode: locale,
            });
            const audioBase64 = Buffer.from(audioBuffer).toString('base64');
            if (audioBase64) {
              send({ type: 'audio', base64: audioBase64 });
            }
          } catch (err) {
            console.error(`[Stream TTS] Google ${language} TTS failed:`, err);
            send({ type: 'error', code: 'GOOGLE_TTS_FAILED' });
          }
        } else {
          const speaker = SARVAM_SPEAKERS[language];
          const targetLang = SARVAM_TTS_LANG_MAP[language];

          if (speaker && targetLang && SARVAM_API_KEY && responseText) {
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
              const audioBase64 = data.audios?.[0] || '';
              if (audioBase64) {
                send({ type: 'audio', base64: audioBase64 });
              }
            } else {
              console.error('[Stream TTS] Sarvam error:', await ttsResp.text());
            }
          }
        }

        controller.close();
      } catch (error) {
        console.error('[SarvamStream] Error:', error);
        send({ type: 'error', message: String(error) });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked',
    },
  });
}
