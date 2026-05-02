// src/lib/cc/__tests__/language-fallback.test.ts
import { describe, it, expect } from "vitest";
import { pickCoachLanguage } from "../language-fallback";

describe("pickCoachLanguage", () => {
  it("returns preferred_language when set", () => {
    expect(pickCoachLanguage({ preferred_language: "hi", home_language: "en" })).toBe("hi");
  });
  it("falls back to home_language when preferred is null", () => {
    expect(pickCoachLanguage({ preferred_language: null, home_language: "hi" })).toBe("hi");
  });
  it("returns 'en' when both are null", () => {
    expect(pickCoachLanguage({ preferred_language: null, home_language: null })).toBe("en");
  });
  it("returns 'en' when both are empty strings", () => {
    expect(pickCoachLanguage({ preferred_language: "", home_language: "" })).toBe("en");
  });
  it("treats undefined like null", () => {
    expect(pickCoachLanguage({ preferred_language: undefined, home_language: undefined })).toBe("en");
  });
});
