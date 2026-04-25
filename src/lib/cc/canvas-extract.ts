// Devanagari, Bengali, Gurmukhi, Gujarati, Oriya, Tamil, Telugu, Kannada,
// Malayalam, Arabic/Nastaliq, CJK Hiragana/Katakana — covers every script our
// 17 voice languages can output, plus Urdu (text-only) script.
export const NON_LATIN_RE =
  /[ऀ-ॿঀ-৿਀-੿઀-૿଀-୿஀-௿ఀ-౿ಀ-೿ഀ-ൿ؀-ۿ぀-ヿ]/;

export function containsNonLatin(s: string): boolean {
  return NON_LATIN_RE.test(s);
}

export const CANVAS_EXTRACT_SYSTEM = `
You extract English story material from a brainstorm conversation that may be in any language.

Given the student's last message and the coach's response (which may be in Hindi, Punjabi, Urdu,
Spanish, etc.), output a JSON object with:
  - fragment: 1-2 English sentences capturing concrete lived material the student shared.
              Specific, scene-based, no abstractions. NEVER an interpretation or theme.
  - tags:     0-3 short English theme labels (3 words max each).

[OUTPUT LANGUAGE: ENGLISH ONLY — even if the conversation was in another language.
This output feeds an English essay editor; non-English text breaks the pipeline.]

If the student's message has no extractable material (small talk, meta-question), return:
  { "fragment": "", "tags": [] }

Respond with the JSON object only. No prose, no code fences.
`.trim();

export type CanvasExtractResult = { fragment: string; tags: string[] };

const EMPTY: CanvasExtractResult = { fragment: "", tags: [] };

function parseExtract(raw: string): CanvasExtractResult {
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const fragment = typeof parsed.fragment === "string" ? parsed.fragment.trim() : "";
    const tags = Array.isArray(parsed.tags)
      ? parsed.tags.filter((t: unknown): t is string => typeof t === "string").slice(0, 3)
      : [];
    return { fragment, tags };
  } catch {
    return EMPTY;
  }
}

/**
 * Run the LLM extraction call with a single retry if the model emits non-Latin script.
 * `callLLM` is injected so this function can be unit-tested without an API key.
 */
export async function extractCanvasFragment(
  studentMessage: string,
  coachResponse: string,
  callLLM: (system: string, user: string) => Promise<string>,
): Promise<CanvasExtractResult> {
  const userPrompt = `Student's last message:\n${studentMessage}\n\nCoach's response:\n${coachResponse}`;

  const first = parseExtract(await callLLM(CANVAS_EXTRACT_SYSTEM, userPrompt));
  if (!first.fragment || !containsNonLatin(first.fragment)) return first;

  const stronger = `${CANVAS_EXTRACT_SYSTEM}\n\nIMPORTANT: PREVIOUS OUTPUT WAS NOT ENGLISH. Respond in English only.`;
  const second = parseExtract(await callLLM(stronger, userPrompt));
  if (!containsNonLatin(second.fragment)) return second;

  return EMPTY; // give up silently
}
