import { describe, it, expect } from "vitest";
import { containsNonLatin, CANVAS_EXTRACT_SYSTEM, extractCanvasFragment } from "../canvas-extract";

describe("containsNonLatin", () => {
  it("returns true for Devanagari (Hindi/Marathi)", () => {
    expect(containsNonLatin("मैं कहानी")).toBe(true);
  });
  it("returns true for Gurmukhi (Punjabi)", () => {
    expect(containsNonLatin("ਤੁਹਾਡੀ")).toBe(true);
  });
  it("returns true for Nastaliq (Urdu)", () => {
    expect(containsNonLatin("کہانی")).toBe(true);
  });
  it("returns true for Bengali", () => {
    expect(containsNonLatin("বাংলা")).toBe(true);
  });
  it("returns true for Hiragana", () => {
    expect(containsNonLatin("あなた")).toBe(true);
  });
  it("returns false for plain English with punctuation and digits", () => {
    expect(containsNonLatin("I played the violin in Turkey — and ranked #2.")).toBe(false);
  });
  it("returns false for English with European diacritics (Spanish/French)", () => {
    expect(containsNonLatin("Mi país es España — c'est la vie!")).toBe(false);
  });
});

describe("CANVAS_EXTRACT_SYSTEM", () => {
  it("contains the English-only directive", () => {
    expect(CANVAS_EXTRACT_SYSTEM).toMatch(/ENGLISH ONLY/);
  });
});

describe("extractCanvasFragment", () => {
  it("returns the parsed result on first try when English", async () => {
    const callLLM = async () => JSON.stringify({ fragment: "I played violin in Turkey.", tags: ["identity"] });
    const result = await extractCanvasFragment("user msg", "coach msg", callLLM);
    expect(result.fragment).toBe("I played violin in Turkey.");
    expect(result.tags).toEqual(["identity"]);
  });

  it("retries once when first response is non-English", async () => {
    let calls = 0;
    const callLLM = async () => {
      calls++;
      if (calls === 1) return JSON.stringify({ fragment: "मैंने वायलिन बजाया।", tags: [] });
      return JSON.stringify({ fragment: "I played violin.", tags: ["identity"] });
    };
    const result = await extractCanvasFragment("user", "coach", callLLM);
    expect(calls).toBe(2);
    expect(result.fragment).toBe("I played violin.");
  });

  it("gives up silently when both attempts fail", async () => {
    const callLLM = async () => JSON.stringify({ fragment: "मैंने वायलिन बजाया।", tags: [] });
    const result = await extractCanvasFragment("user", "coach", callLLM);
    expect(result.fragment).toBe("");
    expect(result.tags).toEqual([]);
  });

  it("handles malformed JSON by returning empty", async () => {
    const callLLM = async () => "not json at all";
    const result = await extractCanvasFragment("user", "coach", callLLM);
    expect(result.fragment).toBe("");
  });

  it("strips code fences before parsing", async () => {
    const callLLM = async () => '```json\n{"fragment":"Hello world","tags":["x"]}\n```';
    const result = await extractCanvasFragment("user", "coach", callLLM);
    expect(result.fragment).toBe("Hello world");
  });
});
