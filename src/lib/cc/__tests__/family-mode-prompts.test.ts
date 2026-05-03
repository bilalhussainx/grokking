import { describe, it, expect } from "vitest";
import { familyModeSystemPrompt } from "../family-mode-prompts";
import {
  FAMILY_MODE_STRINGS,
  FAMILY_MODE_LANGUAGES,
  NO_VOICE_FAMILY_MODE_LANGUAGES,
} from "../family-mode-strings";

describe("family-mode-strings", () => {
  it("covers 25 voice languages (added zh/ko/ar/vi/pt/ru/tr 2026-05-02 via Google TTS)", () => {
    expect(FAMILY_MODE_LANGUAGES).toHaveLength(25);
  });
  it("each language has all 6 required string keys", () => {
    const required = ["tapToSpeak", "listening", "handBack", "thinking", "paused", "goodbye"] as const;
    for (const code of FAMILY_MODE_LANGUAGES) {
      const strings = FAMILY_MODE_STRINGS[code];
      expect(strings, `missing: ${code}`).toBeDefined();
      for (const key of required) {
        expect(typeof strings[key]).toBe("string");
      }
    }
  });
  it("no languages are text-only — Urdu now uses Deepgram nova-3 STT + Google ur-IN TTS", () => {
    expect(NO_VOICE_FAMILY_MODE_LANGUAGES.size).toBe(0);
    expect(NO_VOICE_FAMILY_MODE_LANGUAGES.has("ur")).toBe(false);
  });
  it("Urdu is included in the language list", () => {
    expect(FAMILY_MODE_LANGUAGES as readonly string[]).toContain("ur");
  });
  it("Urdu still ships typeHere + send strings (kept for keyboard fallback)", () => {
    expect(FAMILY_MODE_STRINGS.ur.typeHere).toBeTruthy();
    expect(FAMILY_MODE_STRINGS.ur.send).toBeTruthy();
  });
});

describe("familyModeSystemPrompt", () => {
  const summary = {
    applicationStage: "Grade 11",
    schoolList: [{ name: "MIT", band: "reach" }],
    aidContext: "$0 affordability, needs full need",
    essaysSubmittedCount: 1,
    essaysRequiredCount: 5,
  };

  it("includes the language-specific opener for Hindi", () => {
    const prompt = familyModeSystemPrompt("hi", summary);
    expect(prompt).toMatch(/हिन्दी/);
  });
  it("includes English fallback for unsupported language", () => {
    const prompt = familyModeSystemPrompt("xx", summary);
    expect(prompt).toMatch(/Always respond in English/);
  });
  it("interpolates summary fields", () => {
    const prompt = familyModeSystemPrompt("en", summary);
    expect(prompt).toContain("MIT (reach)");
    expect(prompt).toContain("1/5 essays");
  });
});
