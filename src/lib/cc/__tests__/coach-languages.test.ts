import { describe, it, expect } from "vitest";
import { COACH_LANGUAGES, getCoachLanguage, isVoiceLanguage } from "../coach-languages";

describe("COACH_LANGUAGES", () => {
  it("covers 25 languages (7 Deepgram Aura, 10 Sarvam Indic, 8 Google TTS for top international student source markets)", () => {
    expect(COACH_LANGUAGES).toHaveLength(25);
  });

  it("marks Urdu as voice with isRTL — Google Cloud TTS hybrid path", () => {
    const urdu = COACH_LANGUAGES.find((l) => l.code === "ur");
    expect(urdu?.mode).toBe("voice");
    expect(urdu?.isRTL).toBe(true);
  });

  it("marks Arabic as voice with isRTL", () => {
    const arabic = COACH_LANGUAGES.find((l) => l.code === "ar");
    expect(arabic?.mode).toBe("voice");
    expect(arabic?.isRTL).toBe(true);
  });

  it("includes Mandarin, Korean, Vietnamese, Portuguese, Russian, Turkish — all voice", () => {
    for (const code of ["zh", "ko", "vi", "pt", "ru", "tr"]) {
      const lang = COACH_LANGUAGES.find((l) => l.code === code);
      expect(lang, `missing language: ${code}`).toBeDefined();
      expect(lang?.mode).toBe("voice");
    }
  });

  it("marks every language as voice (no text-only languages)", () => {
    const voiceCount = COACH_LANGUAGES.filter((l) => l.mode === "voice").length;
    expect(voiceCount).toBe(25);
  });

  it("isVoiceLanguage returns true for Hindi, Urdu, and Mandarin", () => {
    expect(isVoiceLanguage("hi")).toBe(true);
    expect(isVoiceLanguage("ur")).toBe(true);
    expect(isVoiceLanguage("zh")).toBe(true);
  });

  it("getCoachLanguage falls back to English for unknown code", () => {
    expect(getCoachLanguage("xx").code).toBe("en");
  });
});
