export interface GuardrailResult {
  passed: boolean;
  originalText: string;
  sanitizedText: string;
  blockedSentences: string[];
}

const MAX_PROSE_WORDS = 15;
const FALLBACK_RESPONSE = "I can help you think through this — what specific part are you working on?";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isQuestion(sentence: string): boolean {
  return sentence.trim().endsWith("?");
}

function isBulletOrLabel(sentence: string): boolean {
  const trimmed = sentence.trim();
  return (
    trimmed.startsWith("-") ||
    trimmed.startsWith("•") ||
    trimmed.startsWith("*") ||
    /^(Theme|Option|Section|Hook|Development|Reflection|Note|Tip):/i.test(trimmed) ||
    /^\d+[.)]\s/.test(trimmed)
  );
}

export function validateGuardrail(aiResponse: string): GuardrailResult {
  const sentences = aiResponse
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const blockedSentences: string[] = [];

  for (const sentence of sentences) {
    if (isQuestion(sentence)) continue;
    if (isBulletOrLabel(sentence)) continue;
    if (countWords(sentence) <= MAX_PROSE_WORDS) continue;
    blockedSentences.push(sentence);
  }

  if (blockedSentences.length > 0) {
    return {
      passed: false,
      originalText: aiResponse,
      sanitizedText: FALLBACK_RESPONSE,
      blockedSentences,
    };
  }

  return {
    passed: true,
    originalText: aiResponse,
    sanitizedText: aiResponse,
    blockedSentences: [],
  };
}

export function countWordsInText(text: string): number {
  return countWords(text);
}
