// src/lib/language-profile.ts
// CRUD + helpers for language_learning_profiles. Handles spaced repetition
// scheduling, adaptive proficiency assessment, and prompt formatting.
//
// Spec: 2026-04-10-intelligent-coaching-system-design.md sub-project 4

import { createAdminSupabase } from "@/lib/supabase-auth";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface VocabItem {
  word: string;
  translation?: string;
  introducedAt: string;
  lastSeenAt: string;
  nextReviewAt: string;
  exposureCount: number;
}

export interface GrammarError {
  pattern: string;          // e.g. "ser/estar with locations"
  example: string;
  count: number;
  lastSeenAt: string;
}

export interface LanguageProfile {
  id: string;
  userId: string;
  language: string;
  declaredLevel: CEFRLevel | null;
  assessedLevel: CEFRLevel | null;
  assessedConfidence: number;
  vocabIntroduced: VocabItem[];
  vocabMastered: VocabItem[];
  vocabStruggled: VocabItem[];
  grammarErrors: GrammarError[];
  lastSessionSummary: string | null;
  lastSessionAt: string | null;
  totalSessions: number;
  rollingCorrectness: number;
  rollingComplexity: number;
  createdAt: string;
  updatedAt: string;
}

const CEFR_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getProfile(userId: string, language: string): Promise<LanguageProfile | null> {
  const db = createAdminSupabase();
  const { data, error } = await db
    .from("language_learning_profiles")
    .select("*")
    .eq("user_id", userId)
    .eq("language", language)
    .maybeSingle();

  if (error || !data) return null;
  return rowToProfile(data);
}

export async function ensureProfile(
  userId: string,
  language: string,
  declaredLevel?: CEFRLevel
): Promise<LanguageProfile | null> {
  const existing = await getProfile(userId, language);
  if (existing) return existing;

  const db = createAdminSupabase();
  const { data, error } = await db
    .from("language_learning_profiles")
    .insert({
      user_id: userId,
      language,
      declared_level: declaredLevel || null,
      assessed_level: declaredLevel || null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[language-profile] ensureProfile error:", error);
    return null;
  }
  return rowToProfile(data);
}

export async function updateProfile(
  userId: string,
  language: string,
  patch: Partial<{
    declaredLevel: CEFRLevel;
    assessedLevel: CEFRLevel;
    assessedConfidence: number;
    vocabIntroduced: VocabItem[];
    vocabMastered: VocabItem[];
    vocabStruggled: VocabItem[];
    grammarErrors: GrammarError[];
    lastSessionSummary: string;
    lastSessionAt: string;
    totalSessions: number;
    rollingCorrectness: number;
    rollingComplexity: number;
  }>
): Promise<LanguageProfile | null> {
  const db = createAdminSupabase();
  const update: Record<string, unknown> = {};
  if (patch.declaredLevel !== undefined) update.declared_level = patch.declaredLevel;
  if (patch.assessedLevel !== undefined) update.assessed_level = patch.assessedLevel;
  if (patch.assessedConfidence !== undefined) update.assessed_confidence = patch.assessedConfidence;
  if (patch.vocabIntroduced !== undefined) update.vocab_introduced = patch.vocabIntroduced;
  if (patch.vocabMastered !== undefined) update.vocab_mastered = patch.vocabMastered;
  if (patch.vocabStruggled !== undefined) update.vocab_struggled = patch.vocabStruggled;
  if (patch.grammarErrors !== undefined) update.grammar_errors = patch.grammarErrors;
  if (patch.lastSessionSummary !== undefined) update.last_session_summary = patch.lastSessionSummary;
  if (patch.lastSessionAt !== undefined) update.last_session_at = patch.lastSessionAt;
  if (patch.totalSessions !== undefined) update.total_sessions = patch.totalSessions;
  if (patch.rollingCorrectness !== undefined) update.rolling_correctness = patch.rollingCorrectness;
  if (patch.rollingComplexity !== undefined) update.rolling_complexity = patch.rollingComplexity;

  const { data, error } = await db
    .from("language_learning_profiles")
    .update(update)
    .eq("user_id", userId)
    .eq("language", language)
    .select("*")
    .single();

  if (error || !data) {
    console.error("[language-profile] updateProfile error:", error);
    return null;
  }
  return rowToProfile(data);
}

// ─── Spaced repetition ───────────────────────────────────────────────────────

const REVIEW_INTERVALS_DAYS = [2, 5, 14]; // N+1, N+3, N+7 sessions roughly

/**
 * Compute the next-review timestamp for a vocab item based on its exposure count.
 * exposureCount: 0 = just introduced (review in 2 days)
 *                1 = seen once more (review in 5 days)
 *                2 = seen twice more (review in 14 days, then graduate to mastered)
 */
export function computeNextReview(exposureCount: number, fromDate = new Date()): string {
  const idx = Math.min(exposureCount, REVIEW_INTERVALS_DAYS.length - 1);
  const days = REVIEW_INTERVALS_DAYS[idx];
  const next = new Date(fromDate.getTime() + days * 86400 * 1000);
  return next.toISOString();
}

/**
 * Returns vocab items whose nextReviewAt has passed. Pulled from both
 * introduced and struggled buckets — these are the ones the tutor should
 * weave back into conversation.
 */
export function getVocabDueForReview(profile: LanguageProfile, now = new Date()): VocabItem[] {
  const nowTime = now.getTime();
  const due = (items: VocabItem[]) =>
    items.filter((v) => new Date(v.nextReviewAt).getTime() <= nowTime);
  return [...due(profile.vocabIntroduced), ...due(profile.vocabStruggled)]
    .sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime())
    .slice(0, 8);
}

// ─── Adaptive proficiency assessment ────────────────────────────────────────

/**
 * Updates rolling correctness/complexity using EMA (alpha=0.3) and decides
 * whether to bump the assessed level. Requires confidence > 0.7 to actually
 * change levels — multiple sessions of consistent performance.
 */
export function assessProficiencyDrift(
  profile: LanguageProfile,
  newCorrectness: number,
  newComplexity: number
): { assessedLevel: CEFRLevel | null; assessedConfidence: number; rollingCorrectness: number; rollingComplexity: number } {
  const alpha = 0.3;
  const rc = profile.rollingCorrectness * (1 - alpha) + newCorrectness * alpha;
  const rx = profile.rollingComplexity * (1 - alpha) + newComplexity * alpha;

  let level = profile.assessedLevel || profile.declaredLevel || "A1";
  let confidence = profile.assessedConfidence;

  // Drift signal: well above declared → push up; well below → push down.
  const wantsUp = rc > 0.9 && rx > 0.7;
  const wantsDown = rc < 0.6 && rx < 0.4;

  if (wantsUp) {
    confidence = Math.min(1.0, confidence + 0.15);
    if (confidence > 0.7) {
      const idx = CEFR_ORDER.indexOf(level);
      if (idx >= 0 && idx < CEFR_ORDER.length - 1) {
        level = CEFR_ORDER[idx + 1];
        confidence = 0.5; // reset after change
      }
    }
  } else if (wantsDown) {
    confidence = Math.min(1.0, confidence + 0.15);
    if (confidence > 0.7) {
      const idx = CEFR_ORDER.indexOf(level);
      if (idx > 0) {
        level = CEFR_ORDER[idx - 1];
        confidence = 0.5;
      }
    }
  } else {
    confidence = Math.max(0, confidence - 0.05);
  }

  return {
    assessedLevel: level,
    assessedConfidence: confidence,
    rollingCorrectness: rc,
    rollingComplexity: rx,
  };
}

// ─── Prompt formatting ──────────────────────────────────────────────────────

/**
 * Format a language profile as a system-prompt block for the voice tutor.
 * Compact — only the things the tutor needs to act on this session.
 */
export function formatProfileForPrompt(profile: LanguageProfile, languageName: string): string {
  const lines: string[] = [`## STUDENT'S ${languageName.toUpperCase()} PROFILE`];

  const level = profile.assessedLevel || profile.declaredLevel || "A1";
  lines.push(`Proficiency: ${level}${profile.assessedLevel && profile.assessedLevel !== profile.declaredLevel ? ` (declared ${profile.declaredLevel})` : ""}`);
  lines.push(`Total sessions: ${profile.totalSessions}`);

  if (profile.lastSessionSummary) {
    lines.push(`\nLast session: ${profile.lastSessionSummary}`);
  }

  const dueWords = getVocabDueForReview(profile);
  if (dueWords.length > 0) {
    lines.push(
      `\nVocab to weave back into this conversation (do NOT drill — use naturally):\n${dueWords
        .map((v) => `  - ${v.word}${v.translation ? ` (${v.translation})` : ""}`)
        .join("\n")}`
    );
  }

  const struggledWords = profile.vocabStruggled.slice(0, 5);
  if (struggledWords.length > 0) {
    lines.push(
      `\nWords they've struggled with: ${struggledWords.map((v) => v.word).join(", ")}`
    );
  }

  const topErrors = profile.grammarErrors
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  if (topErrors.length > 0) {
    lines.push(
      `\nRecurring grammar errors:\n${topErrors.map((e) => `  - ${e.pattern} (e.g. "${e.example}")`).join("\n")}`
    );
  }

  lines.push(
    `\nCoach behavior: review the due vocab naturally, gently correct grammar errors when they recur, and adapt difficulty to the assessed level. Never break character to lecture.`
  );

  return lines.join("\n");
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rowToProfile(row: Record<string, unknown>): LanguageProfile {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    language: row.language as string,
    declaredLevel: (row.declared_level as CEFRLevel) || null,
    assessedLevel: (row.assessed_level as CEFRLevel) || null,
    assessedConfidence: (row.assessed_confidence as number) || 0,
    vocabIntroduced: (row.vocab_introduced as VocabItem[]) || [],
    vocabMastered: (row.vocab_mastered as VocabItem[]) || [],
    vocabStruggled: (row.vocab_struggled as VocabItem[]) || [],
    grammarErrors: (row.grammar_errors as GrammarError[]) || [],
    lastSessionSummary: (row.last_session_summary as string) || null,
    lastSessionAt: (row.last_session_at as string) || null,
    totalSessions: (row.total_sessions as number) || 0,
    rollingCorrectness: (row.rolling_correctness as number) || 0,
    rollingComplexity: (row.rolling_complexity as number) || 0,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
