// src/lib/cc/language-fallback.ts
// Single source of truth for the coach's "what language do I respond in?"
// decision. preferred_language is the canonical column going forward (set
// by onboarding + every voice/text path); home_language is the legacy
// column kept for backward compatibility. Always prefer preferred_language;
// fall back to home_language; finally fall back to English.
//
// Why this exists: before 2026-05-02 the text coach read preferred_language
// and onboarding wrote home_language — they were different columns. New
// code MUST go through this helper so the bug doesn't recur.
export function pickCoachLanguage(profile: {
  preferred_language?: string | null;
  home_language?: string | null;
}): string {
  return profile.preferred_language || profile.home_language || "en";
}
