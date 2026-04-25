export type LanguageMode = "voice" | "text-only";

export type CoachLanguage = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  mode: LanguageMode;
  isRTL?: boolean;
};

export const COACH_LANGUAGES: CoachLanguage[] = [
  // Deepgram Aura-2 TTS (7 langs)
  { code: "en", name: "English",   nativeName: "English",     flag: "\u{1F1FA}\u{1F1F8}", mode: "voice" },
  { code: "es", name: "Spanish",   nativeName: "Español",     flag: "\u{1F1EA}\u{1F1F8}", mode: "voice" },
  { code: "fr", name: "French",    nativeName: "Français",    flag: "\u{1F1EB}\u{1F1F7}", mode: "voice" },
  { code: "de", name: "German",    nativeName: "Deutsch",     flag: "\u{1F1E9}\u{1F1EA}", mode: "voice" },
  { code: "it", name: "Italian",   nativeName: "Italiano",    flag: "\u{1F1EE}\u{1F1F9}", mode: "voice" },
  { code: "nl", name: "Dutch",     nativeName: "Nederlands",  flag: "\u{1F1F3}\u{1F1F1}", mode: "voice" },
  { code: "ja", name: "Japanese",  nativeName: "日本語",       flag: "\u{1F1EF}\u{1F1F5}", mode: "voice" },
  // Sarvam Bulbul v3 TTS (10 Indic langs)
  { code: "hi", name: "Hindi",     nativeName: "हिन्दी",       flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "bn", name: "Bengali",   nativeName: "বাংলা",        flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "ta", name: "Tamil",     nativeName: "தமிழ்",       flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "te", name: "Telugu",    nativeName: "తెలుగు",      flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "gu", name: "Gujarati",  nativeName: "ગુજરાતી",      flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "kn", name: "Kannada",   nativeName: "ಕನ್ನಡ",        flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം",      flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "mr", name: "Marathi",   nativeName: "मराठी",        flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "pa", name: "Punjabi",   nativeName: "ਪੰਜਾਬੀ",       flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  { code: "od", name: "Odia",      nativeName: "ଓଡ଼ିଆ",        flag: "\u{1F1EE}\u{1F1F3}", mode: "voice" },
  // Text-only (no TTS provider supports Urdu yet — third-party deferred post-Feature 17)
  { code: "ur", name: "Urdu",      nativeName: "اردو",         flag: "\u{1F1F5}\u{1F1F0}", mode: "text-only", isRTL: true },
];

export const DEFAULT_COACH_LANGUAGE = "en";

export function getCoachLanguage(code: string): CoachLanguage {
  return COACH_LANGUAGES.find((l) => l.code === code) || COACH_LANGUAGES[0];
}

export function isVoiceLanguage(code: string): boolean {
  return getCoachLanguage(code).mode === "voice";
}
