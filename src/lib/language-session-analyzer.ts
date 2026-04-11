// src/lib/language-session-analyzer.ts
// Post-session analysis: takes the conversation transcript, calls an LLM to
// extract vocab usage, grammar errors, and a 1-2 sentence summary, then
// updates language_learning_profiles + writes "speaks" facts to the KG.
//
// Spec: 2026-04-10-intelligent-coaching-system-design.md sub-project 4

import {
  ensureProfile,
  updateProfile,
  computeNextReview,
  assessProficiencyDrift,
  type VocabItem,
  type GrammarError,
  type LanguageProfile,
  type CEFRLevel,
} from "@/lib/language-profile";
import { upsertFact } from "@/lib/knowledge-graph";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

interface AnalysisResult {
  summary: string;
  vocabUsedCorrectly: { word: string; translation?: string }[];
  vocabUsedIncorrectly: { word: string; translation?: string }[];
  grammarErrors: { pattern: string; example: string }[];
  correctnessScore: number;   // 0..1
  complexityScore: number;    // 0..1
  observedLevel?: CEFRLevel;  // optional override hint
}

const ANALYZER_PROMPT = `You are a language learning analyst. The student just had a voice conversation in their target language. Analyze the transcript and return ONLY valid JSON (no markdown fences) with this exact shape:

{
  "summary": "1-2 sentence summary of what they practiced",
  "vocabUsedCorrectly": [{"word": "tenedor", "translation": "fork"}],
  "vocabUsedIncorrectly": [{"word": "cuchara", "translation": "spoon"}],
  "grammarErrors": [{"pattern": "ser/estar with locations", "example": "yo soy en casa"}],
  "correctnessScore": 0.85,
  "complexityScore": 0.6,
  "observedLevel": "B1"
}

Rules:
- Only include words the student actually said. Skip the tutor's words.
- correctnessScore: fraction of student's utterances that were grammatically correct
- complexityScore: 0 = single words, 0.5 = simple sentences, 1.0 = complex multi-clause sentences
- observedLevel: pick A1/A2/B1/B2/C1/C2 based on what you actually heard, not their stated level
- Do not invent grammar errors that did not happen
- Keep the summary concrete: "ordered food at a restaurant", not "practiced conversation"`;

/**
 * Run the analyzer on a transcript and persist results to the profile + KG.
 */
export async function analyzeAndPersistSession(
  userId: string,
  language: string,
  languageName: string,
  transcript: { role: "user" | "assistant"; content: string }[]
): Promise<{ summary: string; assessedLevel: CEFRLevel | null } | null> {
  if (!MOONSHOT_API_KEY) {
    console.warn("[language-analyzer] MOONSHOT_API_KEY not set, skipping analysis");
    return null;
  }
  if (transcript.length < 2) return null;

  const profile = await ensureProfile(userId, language);
  if (!profile) return null;

  let analysis: AnalysisResult;
  try {
    analysis = await callAnalyzer(languageName, transcript);
  } catch (err) {
    console.error("[language-analyzer] LLM call failed:", err);
    return null;
  }

  // Update profile
  const now = new Date().toISOString();
  const newProfile = mergeAnalysisIntoProfile(profile, analysis, now);

  const drift = assessProficiencyDrift(
    profile,
    analysis.correctnessScore,
    analysis.complexityScore
  );

  await updateProfile(userId, language, {
    vocabIntroduced: newProfile.vocabIntroduced,
    vocabMastered: newProfile.vocabMastered,
    vocabStruggled: newProfile.vocabStruggled,
    grammarErrors: newProfile.grammarErrors,
    lastSessionSummary: analysis.summary,
    lastSessionAt: now,
    totalSessions: profile.totalSessions + 1,
    assessedLevel: drift.assessedLevel || undefined,
    assessedConfidence: drift.assessedConfidence,
    rollingCorrectness: drift.rollingCorrectness,
    rollingComplexity: drift.rollingComplexity,
  });

  // Cross-agent: write "speaks" fact to the KG so other agents know.
  if (drift.assessedLevel) {
    upsertFact(userId, {
      subject: "user",
      predicate: "speaks",
      object: `${language}:${drift.assessedLevel}`,
      confidence: drift.assessedConfidence,
      sourceAgent: "language_tutor",
      evidence: analysis.summary,
    }).catch(() => {});
  }

  return { summary: analysis.summary, assessedLevel: drift.assessedLevel };
}

// ─── LLM call ────────────────────────────────────────────────────────────────

async function callAnalyzer(
  languageName: string,
  transcript: { role: "user" | "assistant"; content: string }[]
): Promise<AnalysisResult> {
  const transcriptText = transcript
    .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
    .join("\n");

  const userMessage = `Target language: ${languageName}\n\nTranscript:\n${transcriptText}\n\nReturn the JSON analysis now.`;

  const res = await fetch(MOONSHOT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MOONSHOT_API_KEY}`,
    },
    body: JSON.stringify({
      model: MOONSHOT_MODEL,
      messages: [
        { role: "system", content: ANALYZER_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`Moonshot ${res.status}: ${await res.text().catch(() => "")}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  return {
    summary: parsed.summary || "Practiced conversation",
    vocabUsedCorrectly: Array.isArray(parsed.vocabUsedCorrectly) ? parsed.vocabUsedCorrectly : [],
    vocabUsedIncorrectly: Array.isArray(parsed.vocabUsedIncorrectly) ? parsed.vocabUsedIncorrectly : [],
    grammarErrors: Array.isArray(parsed.grammarErrors) ? parsed.grammarErrors : [],
    correctnessScore: clamp01(parsed.correctnessScore ?? 0.7),
    complexityScore: clamp01(parsed.complexityScore ?? 0.5),
    observedLevel: parsed.observedLevel,
  };
}

// ─── Vocab merge logic ──────────────────────────────────────────────────────

function mergeAnalysisIntoProfile(
  profile: LanguageProfile,
  analysis: AnalysisResult,
  nowIso: string
): {
  vocabIntroduced: VocabItem[];
  vocabMastered: VocabItem[];
  vocabStruggled: VocabItem[];
  grammarErrors: GrammarError[];
} {
  const introducedMap = new Map(profile.vocabIntroduced.map((v) => [v.word.toLowerCase(), v]));
  const masteredMap = new Map(profile.vocabMastered.map((v) => [v.word.toLowerCase(), v]));
  const struggledMap = new Map(profile.vocabStruggled.map((v) => [v.word.toLowerCase(), v]));

  // Words used correctly: bump exposure. After exposureCount >= 3, graduate to mastered.
  for (const v of analysis.vocabUsedCorrectly) {
    const key = v.word.toLowerCase();
    let item =
      introducedMap.get(key) ||
      struggledMap.get(key) || {
        word: v.word,
        translation: v.translation,
        introducedAt: nowIso,
        lastSeenAt: nowIso,
        nextReviewAt: nowIso,
        exposureCount: 0,
      };
    item = {
      ...item,
      lastSeenAt: nowIso,
      exposureCount: item.exposureCount + 1,
      nextReviewAt: computeNextReview(item.exposureCount + 1, new Date(nowIso)),
    };

    if (item.exposureCount >= 3) {
      masteredMap.set(key, item);
      introducedMap.delete(key);
      struggledMap.delete(key);
    } else {
      introducedMap.set(key, item);
      struggledMap.delete(key);
    }
  }

  // Words used incorrectly: move to struggled, reset exposure.
  for (const v of analysis.vocabUsedIncorrectly) {
    const key = v.word.toLowerCase();
    const item: VocabItem = {
      word: v.word,
      translation: v.translation || introducedMap.get(key)?.translation || masteredMap.get(key)?.translation,
      introducedAt: introducedMap.get(key)?.introducedAt || nowIso,
      lastSeenAt: nowIso,
      nextReviewAt: computeNextReview(0, new Date(nowIso)),
      exposureCount: 0,
    };
    struggledMap.set(key, item);
    introducedMap.delete(key);
    masteredMap.delete(key);
  }

  // Grammar errors: bump count or insert.
  const errorMap = new Map(profile.grammarErrors.map((e) => [e.pattern.toLowerCase(), e]));
  for (const e of analysis.grammarErrors) {
    const key = e.pattern.toLowerCase();
    const existing = errorMap.get(key);
    if (existing) {
      errorMap.set(key, { ...existing, count: existing.count + 1, lastSeenAt: nowIso, example: e.example });
    } else {
      errorMap.set(key, { pattern: e.pattern, example: e.example, count: 1, lastSeenAt: nowIso });
    }
  }

  return {
    vocabIntroduced: Array.from(introducedMap.values()),
    vocabMastered: Array.from(masteredMap.values()),
    vocabStruggled: Array.from(struggledMap.values()),
    grammarErrors: Array.from(errorMap.values()),
  };
}

function clamp01(n: number): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
