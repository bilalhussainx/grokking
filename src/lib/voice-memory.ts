/**
 * voice-memory.ts — MemPalace bridge client for Samsara voice coaches.
 *
 * Usage in voice session API routes:
 *
 *   // Before session — load context
 *   const memory = await loadVoiceMemory(userId, language);
 *   // Inject memory.contextSummary into the LLM system prompt
 *
 *   // After session — save content
 *   await saveVoiceSession(userId, language, 'conversation', transcript, coachNotes);
 *
 * The MemPalace bridge runs at MEMPALACE_BRIDGE_URL (default: http://localhost:8765).
 * Set MEMPALACE_BRIDGE_URL in .env.local for production.
 */

const BRIDGE_URL = process.env.MEMPALACE_BRIDGE_URL ?? 'http://localhost:8765';

interface WakeUpResult {
  user_id: string;
  language: string;
  memories: string[];
  facts: string[];
  context_summary: string;
}

interface SaveSessionResult {
  saved: boolean;
  session_id: string;
}

/**
 * Load a user's relevant memories before a coaching session.
 * Returns a context_summary string (≤300 tokens) to inject into the coach's system prompt.
 * Returns null if the bridge is unavailable — voice coaching continues without memory.
 */
export async function loadVoiceMemory(
  userId: string,
  language: string
): Promise<WakeUpResult | null> {
  try {
    const res = await fetch(`${BRIDGE_URL}/wake-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, language }),
      signal: AbortSignal.timeout(2000),   // 2s timeout — never block voice session
    });
    if (!res.ok) return null;
    return await res.json() as WakeUpResult;
  } catch {
    // Bridge is offline — degrade gracefully
    return null;
  }
}

/**
 * Save a completed voice session to the palace.
 * Call at the end of a session (WebSocket close or explicit end).
 */
export async function saveVoiceSession(
  userId: string,
  language: string,
  sessionType: 'conversation' | 'vocabulary' | 'grammar' | 'cultural' | 'reading',
  content: string,
  coachNotes?: string
): Promise<SaveSessionResult | null> {
  try {
    const res = await fetch(`${BRIDGE_URL}/save-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        language,
        session_type: sessionType,
        content,
        coach_notes: coachNotes,
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return await res.json() as SaveSessionResult;
  } catch {
    return null;
  }
}

/**
 * Save a structured fact about the learner.
 * E.g.: "user", "struggles_with", "subjunctive_mood"
 *       "user", "prefers", "evening_sessions"
 *       "user", "reached_level", "B1_spanish"
 */
export async function saveVoiceFact(
  userId: string,
  subject: string,
  predicate: string,
  object: string
): Promise<void> {
  try {
    await fetch(`${BRIDGE_URL}/save-fact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, subject, predicate, object }),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // Silent fail — fact storage is best-effort
  }
}

/**
 * Build a memory-augmented system prompt for a voice coach.
 * Prepends the user's learning history to the coach's base persona prompt.
 *
 * @param basePrompt  The coach's base system prompt (from language-personas.ts)
 * @param memory      Result from loadVoiceMemory()
 */
export function buildMemoryAugmentedPrompt(
  basePrompt: string,
  memory: WakeUpResult | null
): string {
  if (!memory || (!memory.facts.length && !memory.memories.length)) {
    return basePrompt;
  }
  return `${memory.context_summary}\n\n---\n\n${basePrompt}`;
}
