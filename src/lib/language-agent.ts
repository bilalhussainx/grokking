// RAG Language Agent - Context Builder and Memory Management
// Implements per-user memory for the language learning voice agent

import { supabase } from '@/lib/supabase';
import { generateWithMoonshot } from '@/lib/voice-provider-router';
import type {
  UserLanguageProfile,
  MistakePattern,
  VocabMastery,
  SessionHistory,
  AgentContext,
  LessonContext,
  AgentTurnMetadata,
  TranscriptEntry,
  ConversationCheckpoint,
} from '@/data/language-types';
import type { ProficiencyLevel, LanguagePersona } from '@/lib/language-personas';
import { getLanguagePersona } from '@/lib/language-personas';

// ============================================
// RAG Context Builder
// ============================================

export interface BuildContextParams {
  userId: string;
  targetLanguage: string;
  nativeLanguage?: string;
  lessonContext?: LessonContext;
  persona?: LanguagePersona;
}

export async function buildAgentContext({
  userId,
  targetLanguage,
  nativeLanguage = 'en',
  lessonContext,
  persona,
}: BuildContextParams): Promise<AgentContext> {
  // Parallel fetch all RAG components
  const [profile, recentMistakes, dueVocab, lastSessions, checkpoint] = await Promise.all([
    getUserLanguageProfile(userId, targetLanguage, nativeLanguage),
    getRecentMistakes(userId, targetLanguage, 10),
    getDueVocabulary(userId, targetLanguage, 15),
    getRecentSessions(userId, targetLanguage, 3),
    getConversationCheckpoint(userId, targetLanguage),
  ]);

  // Build the system prompt context
  const effectivePersona = persona || getLanguagePersona(`${targetLanguage}-conversational-${getDefaultStyle(targetLanguage)}`);

  const systemPromptContext = buildSystemPrompt({
    profile,
    recentMistakes,
    dueVocab,
    lastSessions,
    persona: effectivePersona,
    lessonContext,
    checkpoint,
  });

  return {
    systemPromptContext,
    lessonContext,
    profile,
  };
}

// Build the comprehensive system prompt
interface BuildSystemPromptParams {
  profile: UserLanguageProfile;
  recentMistakes: MistakePattern[];
  dueVocab: VocabMastery[];
  lastSessions: SessionHistory[];
  persona: LanguagePersona | undefined;
  lessonContext?: LessonContext;
  checkpoint?: ConversationCheckpoint | null;
}

function buildSystemPrompt({
  profile,
  recentMistakes,
  dueVocab,
  lastSessions,
  persona,
  lessonContext,
  checkpoint,
}: BuildSystemPromptParams): string {
  const parts: string[] = [];

  // Persona base prompt
  if (persona) {
    parts.push(persona.systemPrompt);
  }

  // Student profile
  parts.push(`
## STUDENT PROFILE
- Level: ${profile.proficiencyLevel}
- Native language: ${profile.nativeLanguage}
- Learning goals: ${profile.learningGoals.join(', ') || 'General fluency'}
- Weak areas: ${profile.weakAreas.join(', ') || 'None identified yet'}
- Strong areas: ${profile.strongAreas.join(', ') || 'None identified yet'}
- Total practice: ${profile.totalPracticeMinutes} minutes
- Current streak: ${profile.streakDays} days
`);

  // Last session summary
  if (lastSessions.length > 0 && lastSessions[0].agentSummary) {
    parts.push(`
## LAST SESSION
${lastSessions[0].agentSummary}
`);
  }

  // Conversation checkpoint — resume context
  if (checkpoint) {
    parts.push(buildResumeContext(checkpoint));
  }

  // Topic transition readiness
  if (checkpoint && checkpoint.totalExchangesOnTopic >= 6) {
    parts.push(`
## TOPIC TRANSITION READINESS
The student has practiced "${checkpoint.lastTopicName}" extensively (${checkpoint.totalExchangesOnTopic} exchanges).
If they demonstrate comfort, naturally transition to: "${checkpoint.nextTopicName}".
Transition smoothly — weave it into conversation, don't announce a topic change.`);
  }

  // Recurring mistakes to watch for
  if (recentMistakes.length > 0) {
    parts.push(`
## RECURRING MISTAKES TO WATCH FOR
${recentMistakes.map(m => `- ${m.description} (occurred ${m.frequency} times)`).join('\n')}
`);
  }

  // Vocabulary due for review
  if (dueVocab.length > 0) {
    parts.push(`
## VOCABULARY DUE FOR REVIEW
Weave these naturally into conversation:
${dueVocab.map(v => `- ${v.word} = ${v.translation} (mastery: ${v.masteryLevel}/5)`).join('\n')}
`);
  }

  // Current lesson context
  if (lessonContext) {
    const contentSnippet = lessonContext.content
      ? `\nLesson content preview: ${lessonContext.content.slice(0, 1000)}`
      : '';
    parts.push(`
## CURRENT LESSON CONTEXT
Lesson: ${lessonContext.lessonTitle}
Target phrases to practice: ${lessonContext.targetPhrases.join(', ')}
Vocabulary focus: ${lessonContext.vocabulary.join(', ')}
Grammar focus: ${lessonContext.grammarFocus.join(', ')}${contentSnippet}
`);
  }

  // Universal instructions injected into ALL language tutors
  parts.push(`
## CRITICAL INSTRUCTIONS (OVERRIDE ALL PERSONA RULES)

### BILINGUAL — ALWAYS UNDERSTAND ENGLISH
- You MUST understand and respond to English input. Students are LEARNERS.
- For A1/A2: respond ~50% English + ~50% target language
- For B1: respond ~30% English + ~70% target language
- For B2+: respond ~10% English + ~90% target language
- New vocabulary: say in target language, translate to English, ask student to repeat

### BE PROACTIVE — LEAD THE CONVERSATION
- Do NOT wait for the student. YOU drive the lesson forward.
- After greeting, immediately teach the first vocabulary item from the lesson
- Walk through lesson content step by step: introduce, explain, practice, move on
- Ask directed questions: "Can you say X in [language]?" or "Repeat after me..."
- If student is silent, prompt them with something to try
- Create mini role-plays using lesson vocabulary

### KEEP IT ADDICTIVE
- Use micro-challenges: "Can you remember the word for...?"
- Give instant positive feedback on every attempt
- Build momentum — keep moving, don't dwell
- End each exchange with a hook: "Now let's try..." or "One more fun one..."

### VOICE FORMAT
- Keep responses SHORT (1-2 sentences max)
- Never use markdown, bullets, or formatting
- Speak naturally and expressively
`);

  return parts.join('\n');
}

function getDefaultStyle(language: string): string {
  // Default to conversational style
  const styles: Record<string, string> = {
    es: 'carlos',
    fr: 'camille',
    ur: 'ayesha',
    hi: 'rahul',
    zh: 'xiaoming',
    en: 'sarah',
  };
  return styles[language] || 'conversational';
}

// ============================================
// Database Fetch Functions
// ============================================

async function getUserLanguageProfile(
  userId: string,
  targetLanguage: string,
  nativeLanguage: string
): Promise<UserLanguageProfile> {
  const { data, error } = await supabase
    .from('user_language_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('target_language', targetLanguage)
    .single();

  if (error || !data) {
    // Create default profile if not exists
    return {
      userId,
      targetLanguage,
      nativeLanguage,
      proficiencyLevel: 'A1',
      learningGoals: [],
      weakAreas: [],
      strongAreas: [],
      totalPracticeMinutes: 0,
      streakDays: 0,
    };
  }

  return {
    userId: data.user_id,
    targetLanguage: data.target_language,
    nativeLanguage: data.native_language,
    proficiencyLevel: data.proficiency_level as ProficiencyLevel,
    currentModuleId: data.current_module_id,
    preferredPersonaId: data.preferred_persona_id,
    learningGoals: data.learning_goals || [],
    weakAreas: data.weak_areas || [],
    strongAreas: data.strong_areas || [],
    totalPracticeMinutes: data.total_practice_minutes || 0,
    streakDays: data.streak_days || 0,
    lastSessionSummary: data.last_session_summary,
    lastPracticedAt: data.last_practiced_at ? new Date(data.last_practiced_at) : undefined,
  };
}

async function getRecentMistakes(
  userId: string,
  targetLanguage: string,
  limit: number
): Promise<MistakePattern[]> {
  const { data, error } = await supabase
    .from('mistake_patterns')
    .select('*')
    .eq('user_id', userId)
    .eq('target_language', targetLanguage)
    .eq('resolved', false)
    .order('frequency', { ascending: false })
    .order('last_occurred_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map(m => ({
    id: m.id,
    userId: m.user_id,
    targetLanguage: m.target_language,
    category: m.category,
    description: m.description,
    examples: m.examples || [],
    corrections: m.corrections || [],
    frequency: m.frequency,
    resolved: m.resolved,
    lastOccurredAt: new Date(m.last_occurred_at),
  }));
}

async function getDueVocabulary(
  userId: string,
  targetLanguage: string,
  limit: number
): Promise<VocabMastery[]> {
  const { data, error } = await supabase
    .rpc('get_due_vocab', {
      p_user_id: userId,
      p_target_language: targetLanguage,
      p_limit: limit,
    });

  if (error || !data) return [];

  return data.map((v: Record<string, unknown>) => ({
    id: v.id as string,
    userId: userId,
    word: v.word as string,
    translation: v.translation as string,
    targetLanguage: targetLanguage,
    timesCorrect: v.times_correct as number,
    timesIncorrect: v.times_incorrect as number,
    masteryLevel: v.mastery_level as number,
    easeFactor: 2.5, // Default, not returned by RPC
    intervalDays: 1, // Default, not returned by RPC
    nextReviewAt: new Date(), // Will be fetched if needed
  }));
}

async function getRecentSessions(
  userId: string,
  targetLanguage: string,
  limit: number
): Promise<SessionHistory[]> {
  const { data, error } = await supabase
    .from('language_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('target_language', targetLanguage)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map(s => ({
    id: s.id,
    userId: s.user_id,
    targetLanguage: s.target_language,
    personaId: s.persona_id,
    scenario: s.scenario,
    lessonId: s.lesson_id,
    durationSeconds: s.duration_seconds || 0,
    transcript: s.transcript || [],
    mistakesFound: s.mistakes_found || [],
    newVocab: s.new_vocab || [],
    proficiencyDelta: s.proficiency_delta || 0,
    agentSummary: s.agent_summary || '',
    createdAt: new Date(s.created_at),
  }));
}

// ============================================
// Conversation Checkpoint Functions
// ============================================

export async function getConversationCheckpoint(
  userId: string,
  targetLanguage: string
): Promise<ConversationCheckpoint | null> {
  const { data, error } = await supabase
    .from('user_language_profiles')
    .select('conversation_checkpoint')
    .eq('user_id', userId)
    .eq('target_language', targetLanguage)
    .single();

  if (error || !data?.conversation_checkpoint) return null;

  const checkpoint = data.conversation_checkpoint as ConversationCheckpoint;
  if (!checkpoint.schemaVersion || !checkpoint.lastTopicId) {
    console.warn('[language-agent] Invalid checkpoint, treating as fresh start');
    return null;
  }

  return checkpoint;
}

export async function updateConversationCheckpoint(
  userId: string,
  targetLanguage: string,
  checkpoint: ConversationCheckpoint
): Promise<void> {
  await supabase
    .from('user_language_profiles')
    .update({ conversation_checkpoint: checkpoint })
    .eq('user_id', userId)
    .eq('target_language', targetLanguage);
}

export function buildResumeContext(checkpoint: ConversationCheckpoint): string {
  return `
## CONVERSATION RESUME
Last session: ${checkpoint.lastSessionTimestamp}
Topic: ${checkpoint.lastTopicName}
Progress: ${checkpoint.topicProgress} (${checkpoint.totalExchangesOnTopic} exchanges)
Summary: ${checkpoint.lastExchangeSummary}
Vocab in progress: ${checkpoint.vocabInProgress.join(', ') || 'None'}
Mistake patterns: ${checkpoint.mistakePatterns.join(', ') || 'None'}
Next topic: ${checkpoint.nextTopicName}

Resume from this point. Greet the user warmly, remind them where they left off, and continue practicing the current topic.`;
}

export async function summarizeAndUpdateCheckpoint(
  userId: string,
  targetLanguage: string,
  transcript: TranscriptEntry[],
  currentCheckpoint: ConversationCheckpoint | null,
  currentTopicId: string,
  currentTopicName: string,
  nextTopicId: string,
  nextTopicName: string
): Promise<void> {
  const transcriptText = transcript.map(t => `${t.role}: ${t.text}`).join('\n');

  const summary = await generateWithMoonshot([
    {
      role: 'system',
      content: 'Summarize this language practice session in 1-2 sentences. Focus on what the student practiced, what they struggled with, and what vocabulary was used. Return ONLY the summary text.',
    },
    { role: 'user', content: transcriptText.slice(-3000) },
  ], { temperature: 0.3, maxTokens: 200 });

  const exchangeCount = transcript.filter(t => t.role === 'user').length;
  const totalExchanges = (currentCheckpoint?.totalExchangesOnTopic || 0) + exchangeCount;

  let topicProgress: 'started' | 'practicing' | 'comfortable' = 'started';
  if (totalExchanges >= 8) topicProgress = 'comfortable';
  else if (totalExchanges >= 3) topicProgress = 'practicing';

  const newCheckpoint: ConversationCheckpoint = {
    schemaVersion: 1,
    lastTopicId: currentTopicId,
    lastTopicName: currentTopicName,
    topicProgress,
    nextTopicId,
    nextTopicName,
    lastExchangeSummary: summary,
    vocabInProgress: currentCheckpoint?.vocabInProgress || [],
    mistakePatterns: currentCheckpoint?.mistakePatterns || [],
    totalExchangesOnTopic: totalExchanges,
    lastSessionTimestamp: new Date().toISOString(),
  };

  await updateConversationCheckpoint(userId, targetLanguage, newCheckpoint);
}

export async function advanceTopicCheckpoint(
  userId: string,
  targetLanguage: string,
  newTopicId: string,
  newTopicName: string,
  nextTopicId: string,
  nextTopicName: string
): Promise<void> {
  const checkpoint: ConversationCheckpoint = {
    schemaVersion: 1,
    lastTopicId: newTopicId,
    lastTopicName: newTopicName,
    topicProgress: 'started',
    nextTopicId,
    nextTopicName,
    lastExchangeSummary: '',
    vocabInProgress: [],
    mistakePatterns: [],
    totalExchangesOnTopic: 0,
    lastSessionTimestamp: new Date().toISOString(),
  };
  await updateConversationCheckpoint(userId, targetLanguage, checkpoint);
}

// ============================================
// Memory Write-back Functions
// ============================================

async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const apiKey = process.env.MOONSHOT_API_KEY;
    if (!apiKey) return null;

    const response = await fetch('https://api.moonshot.ai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k-embedding-preview',
        input: text.slice(0, 2000),
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const embedding = data.data?.[0]?.embedding;
    if (!embedding || !Array.isArray(embedding)) return null;

    // Truncate or pad to 768 dimensions to match pgvector column
    if (embedding.length >= 768) return embedding.slice(0, 768);
    return [...embedding, ...new Array(768 - embedding.length).fill(0)];
  } catch {
    return null;
  }
}

export async function recordMistake(
  userId: string,
  targetLanguage: string,
  mistake: {
    category: 'grammar' | 'pronunciation' | 'vocabulary' | 'cultural';
    description: string;
    utterance: string;
    correction: string;
  }
): Promise<void> {
  const textToEmbed = `${mistake.description} ${mistake.utterance} ${mistake.correction}`;
  const embedding = await generateEmbedding(textToEmbed);

  await supabase.rpc('upsert_mistake_pattern', {
    p_user_id: userId,
    p_target_language: targetLanguage,
    p_category: mistake.category,
    p_description: mistake.description,
    p_example: mistake.utterance,
    p_correction: mistake.correction,
    p_embedding: embedding,
  });
}

export async function updateVocabularyMastery(
  vocabId: string,
  quality: number // 0-5
): Promise<void> {
  await supabase.rpc('update_vocab_sm2', {
    p_vocab_id: vocabId,
    p_quality: quality,
  });
}

export async function addVocabularyItem(
  userId: string,
  targetLanguage: string,
  word: string,
  translation: string
): Promise<void> {
  await supabase.from('vocab_mastery').insert({
    user_id: userId,
    word,
    translation,
    target_language: targetLanguage,
  });
}

export async function saveSession(
  userId: string,
  targetLanguage: string,
  session: {
    personaId: string;
    scenario?: string;
    lessonId?: string;
    durationSeconds: number;
    transcript: TranscriptEntry[];
    mistakesFound: { type: string; utterance: string; correction: string }[];
    newVocab: string[];
    proficiencyDelta: number;
    agentSummary: string;
  }
): Promise<void> {
  await supabase.from('language_sessions').insert({
    user_id: userId,
    target_language: targetLanguage,
    persona_id: session.personaId,
    scenario: session.scenario,
    lesson_id: session.lessonId,
    duration_seconds: session.durationSeconds,
    transcript: session.transcript,
    mistakes_found: session.mistakesFound,
    new_vocab: session.newVocab,
    proficiency_delta: session.proficiencyDelta,
    agent_summary: session.agentSummary,
  });

  // Update practice stats
  await supabase.rpc('update_practice_stats', {
    p_user_id: userId,
    p_target_language: targetLanguage,
    p_duration_seconds: session.durationSeconds,
  });
}

export async function updateUserProfile(
  userId: string,
  targetLanguage: string,
  updates: Partial<UserLanguageProfile>
): Promise<void> {
  const dbUpdates: Record<string, unknown> = {};
  
  if (updates.proficiencyLevel) dbUpdates.proficiency_level = updates.proficiencyLevel;
  if (updates.currentModuleId) dbUpdates.current_module_id = updates.currentModuleId;
  if (updates.preferredPersonaId) dbUpdates.preferred_persona_id = updates.preferredPersonaId;
  if (updates.learningGoals) dbUpdates.learning_goals = updates.learningGoals;
  if (updates.weakAreas) dbUpdates.weak_areas = updates.weakAreas;
  if (updates.strongAreas) dbUpdates.strong_areas = updates.strongAreas;
  if (updates.lastSessionSummary) dbUpdates.last_session_summary = updates.lastSessionSummary;

  await supabase
    .from('user_language_profiles')
    .upsert({
      user_id: userId,
      target_language: targetLanguage,
      ...dbUpdates,
    }, {
      onConflict: 'user_id,target_language',
    });
}

// ============================================
// Structured Output Parsing
// ============================================

export function parseAgentMetadata(content: string): AgentTurnMetadata {
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
                    content.match(/\{[\s\S]*"mistakesDetected"[\s\S]*\}/);

  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } catch {
      // Fall through to default
    }
  }

  return {
    mistakesDetected: [],
    vocabUsedCorrectly: [],
    vocabUsedIncorrectly: [],
    estimatedProficiencySignal: 'at_level',
    suggestedNextTopics: [],
  };
}

/**
 * Analyze a user's conversation turn for mistakes, vocab usage, and proficiency signals.
 * Called as a background task after the conversational response is sent.
 */
export async function analyzeUserTurn(
  userMessage: string,
  agentResponse: string,
  targetLanguage: string,
  proficiencyLevel: ProficiencyLevel
): Promise<AgentTurnMetadata> {
  try {
    const result = await generateWithMoonshot([
      {
        role: 'system',
        content: `You are a language learning analysis engine. Analyze the student's message in ${targetLanguage} at ${proficiencyLevel} level.

Return ONLY valid JSON matching this schema:
{
  "mistakesDetected": [{ "type": "grammar"|"pronunciation"|"vocabulary"|"cultural", "utterance": "what they said", "correction": "correct form", "explanation": "brief why" }],
  "vocabUsedCorrectly": ["word1", "word2"],
  "vocabUsedIncorrectly": ["word1"],
  "estimatedProficiencySignal": "below_level"|"at_level"|"above_level",
  "suggestedNextTopics": ["topic1"]
}

Be precise. If no mistakes, return empty arrays. Assess proficiency honestly.`,
      },
      {
        role: 'user',
        content: `Student said: "${userMessage}"\nTutor responded: "${agentResponse}"`,
      },
    ], {
      temperature: 0.2,
      maxTokens: 512,
    });

    try {
      const cleaned = result.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return parseAgentMetadata(result);
    }
  } catch {
    return {
      mistakesDetected: [],
      vocabUsedCorrectly: [],
      vocabUsedIncorrectly: [],
      estimatedProficiencySignal: 'at_level',
      suggestedNextTopics: [],
    };
  }
}

// ============================================
// Similarity Search (for mistake patterns)
// ============================================

export async function findSimilarMistakes(
  userId: string,
  targetLanguage: string,
  queryText: string,
  limit: number = 5
): Promise<MistakePattern[]> {
  const embedding = await generateEmbedding(queryText);

  if (embedding) {
    try {
      const { data, error } = await supabase.rpc('search_similar_mistakes', {
        p_user_id: userId,
        p_target_language: targetLanguage,
        p_embedding: embedding,
        p_limit: limit,
      });

      if (!error && data && data.length > 0) {
        return data.map((m: Record<string, unknown>) => ({
          id: m.id as string,
          userId: m.user_id as string,
          targetLanguage: m.target_language as string,
          category: m.category as MistakePattern['category'],
          description: m.description as string,
          examples: (m.examples as string[]) || [],
          corrections: (m.corrections as string[]) || [],
          frequency: m.frequency as number,
          resolved: m.resolved as boolean,
          lastOccurredAt: new Date(m.last_occurred_at as string),
        }));
      }
    } catch {
      // Fall through to fallback
    }
  }

  return getRecentMistakes(userId, targetLanguage, limit);
}

// ============================================
// Session Management
// ============================================

export function createTranscriptEntry(
  role: 'user' | 'assistant',
  text: string
): TranscriptEntry {
  return {
    role,
    text,
    timestamp: new Date().toISOString(),
  };
}

export function calculateSessionDuration(
  startTime: Date,
  endTime: Date = new Date()
): number {
  return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
}
