export type DetectedLanguage = "ur" | "hi" | "pa" | "en" | "unknown";

const ARABIC_SCRIPT = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
const DEVANAGARI = /[ऀ-ॿ]/;
const GURMUKHI = /[਀-੿]/;

export function detectMessageLanguage(text: string): DetectedLanguage {
  if (!text) return "unknown";
  if (ARABIC_SCRIPT.test(text)) return "ur";
  if (DEVANAGARI.test(text)) return "hi";
  if (GURMUKHI.test(text)) return "pa";
  return "en";
}

const LANG_NAMES: Record<"ur" | "hi" | "pa", string> = {
  ur: "Urdu (Nastaliq script)",
  hi: "Hindi (Devanagari script)",
  pa: "Punjabi (Gurmukhi script)",
};

export function normalizeLanguagePreference(pref: string | null | undefined): "ur" | "hi" | "pa" | null {
  if (!pref) return null;
  const p = pref.toLowerCase();
  if (p === "ur" || p === "urdu") return "ur";
  if (p === "hi" || p === "hindi") return "hi";
  if (p === "pa" || p === "punjabi") return "pa";
  return null;
}

export function buildLanguageInstruction(
  detectedLang: DetectedLanguage,
  preferredLang: string | null | undefined,
): string {
  const normalizedPref = normalizeLanguagePreference(preferredLang);
  const target = normalizedPref ?? (detectedLang === "en" || detectedLang === "unknown" ? null : detectedLang);
  if (!target) return "";
  const label = LANG_NAMES[target];
  return `

LANGUAGE: The student is writing in ${label}. Respond entirely in ${label}. Do not mix English except for proper nouns (university names like MIT, Harvard, Stanford; program names like QuestBridge, Posse; form names like CSS Profile, FAFSA) which should remain in English. Maintain the same helpful, encouraging, conversational tone as the English prompts. Use formal but accessible ${label.split(" ")[0]} appropriate for a high school student speaking to a trusted college counselor.`;
}
