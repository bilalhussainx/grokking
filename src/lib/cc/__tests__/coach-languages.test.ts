import { describe, it, expect } from "vitest";
import { COACH_LANGUAGES, getCoachLanguage, isVoiceLanguage } from "../coach-languages";

describe("COACH_LANGUAGES", () => {
  it("includes 18 languages (17 voice + Urdu text-only)", () => {
    expect(COACH_LANGUAGES).toHaveLength(18);
  });

  it("marks Urdu as text-only with isRTL", () => {
    const urdu = COACH_LANGUAGES.find((l) => l.code === "ur");
    expect(urdu?.mode).toBe("text-only");
    expect(urdu?.isRTL).toBe(true);
  });

  it("marks all non-Urdu langs as voice", () => {
    const voiceCount = COACH_LANGUAGES.filter((l) => l.mode === "voice").length;
    expect(voiceCount).toBe(17);
  });

  it("isVoiceLanguage returns true for Hindi, false for Urdu", () => {
    expect(isVoiceLanguage("hi")).toBe(true);
    expect(isVoiceLanguage("ur")).toBe(false);
  });

  it("getCoachLanguage falls back to English for unknown code", () => {
    expect(getCoachLanguage("xx").code).toBe("en");
  });
});
