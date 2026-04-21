export type CoachLanguage = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  ttsSupported: boolean;
};

export const COACH_LANGUAGES: CoachLanguage[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", ttsSupported: true },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", ttsSupported: true },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", ttsSupported: true },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", ttsSupported: true },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", ttsSupported: true },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", ttsSupported: true },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", ttsSupported: true },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", ttsSupported: true },
];

export const DEFAULT_COACH_LANGUAGE = "en";

export function getCoachLanguage(code: string): CoachLanguage {
  return COACH_LANGUAGES.find((l) => l.code === code) || COACH_LANGUAGES[0];
}
