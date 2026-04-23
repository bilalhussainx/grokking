import { describe, it, expect } from "vitest";
import { detectMessageLanguage, buildLanguageInstruction } from "../detect-language";

describe("detectMessageLanguage", () => {
  it("detects Urdu from Arabic-script characters", () => {
    expect(detectMessageLanguage("کون سے کالج مجھے ضرورت پر پوری امداد دیتے ہیں؟")).toBe("ur");
  });

  it("detects Hindi from Devanagari characters", () => {
    expect(detectMessageLanguage("मुझे MIT में पढ़ना है")).toBe("hi");
  });

  it("detects Punjabi from Gurmukhi characters", () => {
    expect(detectMessageLanguage("ਮੈਨੂੰ MIT ਵਿੱਚ ਪੜ੍ਹਨਾ ਹੈ")).toBe("pa");
  });

  it("returns en for plain English", () => {
    expect(detectMessageLanguage("What schools meet full need?")).toBe("en");
  });

  it("returns unknown for empty string", () => {
    expect(detectMessageLanguage("")).toBe("unknown");
  });

  it("detects Urdu even when English proper nouns are mixed in", () => {
    expect(detectMessageLanguage("MIT کے لیے CSS Profile ضروری ہے؟")).toBe("ur");
  });
});

describe("buildLanguageInstruction", () => {
  it("emits empty string for English with no preference", () => {
    expect(buildLanguageInstruction("en", null)).toBe("");
  });

  it("emits Urdu instruction when message is Urdu", () => {
    const out = buildLanguageInstruction("ur", null);
    expect(out).toContain("Urdu");
    expect(out).toContain("Nastaliq");
    expect(out).toContain("CSS Profile");
  });

  it("preferred language overrides detected language", () => {
    const out = buildLanguageInstruction("en", "ur");
    expect(out).toContain("Urdu");
  });

  it("accepts both short code and human label for preference", () => {
    expect(buildLanguageInstruction("en", "Urdu")).toContain("Urdu");
    expect(buildLanguageInstruction("en", "hi")).toContain("Hindi");
    expect(buildLanguageInstruction("en", "Punjabi")).toContain("Punjabi");
  });

  it("ignores unrecognized preference strings", () => {
    expect(buildLanguageInstruction("en", "klingon")).toBe("");
  });
});
