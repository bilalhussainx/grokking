export interface GuardrailResult {
  passed: boolean;
  originalText: string;
  sanitizedText: string;
  blockedSentences: string[];
}

const FALLBACK_RESPONSE = "I can help you think through this — what specific part are you working on?";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function validateGuardrail(aiResponse: string): GuardrailResult {
  // Brainstorm is a conversation — Coach Kairos is free to offer longer
  // acknowledging lead-ins, context, and reflections. We only guard against
  // an empty/unusably short reply, which would otherwise render as a blank
  // assistant bubble.
  const sanitized = aiResponse.trim();
  if (!sanitized || countWords(sanitized) < 3) {
    return {
      passed: false,
      originalText: aiResponse,
      sanitizedText: FALLBACK_RESPONSE,
      blockedSentences: [],
    };
  }

  return {
    passed: true,
    originalText: aiResponse,
    sanitizedText: sanitized,
    blockedSentences: [],
  };
}

export function countWordsInText(text: string): number {
  return countWords(text);
}
