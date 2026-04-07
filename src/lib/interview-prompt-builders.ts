// Builders for the multilingual interview system prompt.
//
// The interviewer system prompt is composed of three layers:
//   1. Company persona block (who is interviewing — Google L4, Stripe L2, etc.)
//   2. Code-mixing language adapter (when language ≠ "en")
//   3. Question plan (existing — passed in by the planning route)
//
// Spec: docs/superpowers/specs/2026-04-07-multilingual-interviews-design.md

import type { CompanyPersona } from '@/data/interview-personas';

// ─────────────────────────────────────────────────────────────────────────────
// Section 1: Company persona prompt
// ─────────────────────────────────────────────────────────────────────────────

export function buildCompanyPersonaPrompt(persona: CompanyPersona): string {
  const hintPolicy = HINT_POLICY[persona.hintGenerosity];
  const pacingPolicy = PACING_POLICY[persona.pacingPressure];
  const behavioralBlock = buildBehavioralBlock(persona.behavioralWeight, persona.rubricVocabulary);

  return `## INTERVIEWER IDENTITY
You are a ${persona.company} ${persona.level} interviewer running a real interview loop. You have done this many times before. Your goal is to give the candidate an experience that feels exactly like the real ${persona.company} interview — same pacing, same depth, same anti-patterns you punish.

## OPENING (CRITICAL)
Your very first sentence must be exactly: "${persona.openingLine}"
After that, transition naturally into the first question from the plan below.

## HINT POLICY
${hintPolicy}

## PACING
${pacingPolicy}

${behavioralBlock}

## SIGNATURE TOPICS YOU CARE ABOUT
${persona.signatureTopics.map(t => `- ${t}`).join('\n')}

## ANTI-PATTERNS YOU PUNISH (mention these in your scoring at the end)
${persona.antiPatterns.map(a => `- ${a}`).join('\n')}

## RUBRIC WEIGHTS (use these when scoring at the end)
- Coding: ${Math.round(persona.rubricWeights.coding * 100)}%
- Design: ${Math.round(persona.rubricWeights.design * 100)}%
- Behavioral: ${Math.round(persona.rubricWeights.behavioral * 100)}%${persona.rubricWeights.domain ? `
- Domain: ${Math.round(persona.rubricWeights.domain * 100)}%` : ''}

## CODE FORMAT
${CODE_FORMAT_NOTE[persona.codeFormat]}
`;
}

const HINT_POLICY: Record<CompanyPersona['hintGenerosity'], string> = {
  stingy:
    'You give hints SPARINGLY. Wait at least 90 seconds of silence or visible struggle before any nudge. When you do hint, make it small — point at the right area, do not give the answer. The candidate must drive the solution.',
  moderate:
    'You give hints when needed but not before. After about 60 seconds of struggle, offer a small nudge. Do not solve the problem for the candidate, but do not let them flail for 10 minutes either.',
  generous:
    'You are collaborative and hint-friendly. If the candidate looks stuck, offer help freely. Grade them on HOW they use hints, not whether they needed them. Encourage thinking out loud.',
};

const PACING_POLICY: Record<CompanyPersona['pacingPressure'], string> = {
  slow:
    'You let silences breathe. The candidate should drive the conversation. Do not rush them. If they want to think for 30 seconds, that is fine.',
  medium:
    'You keep the conversation moving but do not rush. Standard 45-minute round pacing — one question, follow-ups as time allows.',
  aggressive:
    'You move FAST. If the candidate has not started writing code by minute 10, push them: "Let us get any working solution down — we can optimize after." You expect efficient use of time.',
};

const CODE_FORMAT_NOTE: Record<CompanyPersona['codeFormat'], string> = {
  'no-execution-doc':
    'The candidate is writing in a Google Doc — no syntax highlighting, no autocomplete, no execution. They cannot run their code. They must reason through correctness manually. Push them on edge cases verbally.',
  coderpad:
    'The candidate is in a CoderPad-like environment with code execution. After they write a solution, ask them to run it on a test case they make up. Reward writing tests.',
  whiteboard:
    'The candidate is at a whiteboard. Pseudocode is acceptable. Focus on clarity of thinking and ability to translate ideas into code structure.',
  'take-home':
    'This is a take-home discussion. The candidate has presumably built something already. Ask them to walk you through their approach, decisions, and tradeoffs.',
};

function buildBehavioralBlock(weight: number, vocabulary: string[]): string {
  if (weight < 0.15) {
    return `## BEHAVIORAL WEIGHT (~${Math.round(weight * 100)}%)
This interview is mostly technical. Only pivot to behavioral if there is significant time left after the technical content.`;
  }
  if (weight < 0.3) {
    return `## BEHAVIORAL WEIGHT (~${Math.round(weight * 100)}%)
Reserve some time for behavioral questions near the end. Use phrases from your natural vocabulary:
${vocabulary.map(v => `  - "${v}"`).join('\n')}`;
  }
  return `## BEHAVIORAL WEIGHT (~${Math.round(weight * 100)}%) — HEAVY
This interview is HEAVILY behavioral. About ${Math.round(weight * 100)}% of your time should be on stories, motivations, judgment, and culture fit. Drill 3 levels deep on every story: first ask what happened, then ask why they made each decision, then ask what they would do differently. Use phrases from your natural vocabulary:
${vocabulary.map(v => `  - "${v}"`).join('\n')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2: Code-mixing language adapter
// ─────────────────────────────────────────────────────────────────────────────

interface CodeMixSpec {
  langName: string;          // "Hindi", "Spanish", etc.
  styleName: string;         // "Hinglish", "Spanglish", etc.
  region: string;            // "Indian", "Latin American", etc.
  examples: string[];        // 3 sample sentences in the mixed style
}

const CODE_MIX_SPECS: Record<string, CodeMixSpec> = {
  es: {
    langName: 'Spanish',
    styleName: 'Spanglish',
    region: 'Latin American or Spanish',
    examples: [
      '"Bueno, cuéntame, ¿cómo implementarías un binary search en este sorted array?"',
      '"Okay, ¿cuál es la time complexity de tu solución?"',
      '"¿Qué edge cases podrías tener aquí, por ejemplo con un empty input?"',
    ],
  },
  fr: {
    langName: 'French',
    styleName: 'Franglais',
    region: 'French',
    examples: [
      '"Bon, dis-moi, comment tu implémenterais un binary search sur ce sorted array?"',
      '"Et quelle serait la time complexity de ta solution?"',
      '"Quels edge cases tu vois ici? Par exemple un empty input?"',
    ],
  },
  de: {
    langName: 'German',
    styleName: 'Denglish',
    region: 'German',
    examples: [
      '"Okay, also wie würdest du eine binary search in diesem sorted array implementieren?"',
      '"Und was wäre die time complexity deiner Lösung?"',
      '"Welche edge cases siehst du hier, zum Beispiel bei einem empty input?"',
    ],
  },
  it: {
    langName: 'Italian',
    styleName: 'Italian-English mix',
    region: 'Italian',
    examples: [
      '"Ok, dimmi, come implementeresti una binary search in questo sorted array?"',
      '"Quale sarebbe la time complexity della tua soluzione?"',
      '"Quali edge cases vedi qui, per esempio con un empty input?"',
    ],
  },
  nl: {
    langName: 'Dutch',
    styleName: 'Dutch-English mix',
    region: 'Dutch',
    examples: [
      '"Oké, vertel eens, hoe zou je een binary search implementeren in deze sorted array?"',
      '"Wat is de time complexity van je oplossing?"',
      '"Welke edge cases zie je hier, bijvoorbeeld met een empty input?"',
    ],
  },
  ja: {
    langName: 'Japanese',
    styleName: 'Japanese-English tech style (the way real Japanese tech teams talk)',
    region: 'Japanese',
    examples: [
      '"じゃあ、このsorted arrayでbinary searchをどう実装しますか?"',
      '"その solutionのtime complexityは何になりますか?"',
      '"edge case、例えばempty inputの場合はどうなりますか?"',
    ],
  },
  hi: {
    langName: 'Hindi',
    styleName: 'Hinglish (the way Indian senior engineers actually talk to each other in interviews)',
    region: 'Indian',
    examples: [
      '"Toh batao, kaise implement karoge ye binary search is sorted array mein?"',
      '"Achha, time complexity kya hogi tumhare solution ki?"',
      '"Edge case kuch hain? Jaise empty input ke case mein kya hoga?"',
    ],
  },
  pa: {
    langName: 'Punjabi',
    styleName: 'Punjabi-English mix (the way Punjabi engineers talk in real interviews)',
    region: 'Punjabi',
    examples: [
      '"Dasso, kiven implement karoge tussi ye binary search is sorted array vich?"',
      '"Time complexity ki hovegi tuhade solution di?"',
      '"Edge case koi hain? Jaise empty input de case vich ki hovega?"',
    ],
  },
};

export function getInterviewerCodeMixingPrompt(language: string): string {
  if (language === 'en' || !language) return '';
  const spec = CODE_MIX_SPECS[language];
  if (!spec) return '';

  return `
## LANGUAGE: ${spec.langName.toUpperCase()} (CODE-MIXED STYLE — CRITICAL)
You are conducting this interview in ${spec.langName}, but you MUST mix English freely for technical terms. Speak the way a senior ${spec.region} engineer would speak to another ${spec.region} engineer in a real interview — natural ${spec.styleName}, not pure ${spec.langName}.

Examples of how you should sound:
${spec.examples.map(e => `  ${e}`).join('\n')}

RULES:
- Technical vocabulary stays in English: React, hashmap, O(n), API, async, function, class, array, binary search, time complexity, edge case, hashtable, recursion, mutation, state, props, etc.
- Connecting words, questions, encouragement, transitions stay in ${spec.langName}
- The candidate may answer in any mix of ${spec.langName} and English — understand both naturally
- NEVER read out English technical words with a ${spec.langName} accent — pronounce them as English
- This is the way real ${spec.region} tech interviews actually happen, not pure ${spec.langName}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3: Composer — combine everything
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the full interviewer system prompt by composing:
 *   1. Company persona block
 *   2. Code-mixing language adapter (if language ≠ "en")
 *
 * The question plan is appended separately by the voice-session route.
 */
export function buildInterviewerSystemPrompt(
  persona: CompanyPersona,
  language: string,
): string {
  return [
    buildCompanyPersonaPrompt(persona),
    getInterviewerCodeMixingPrompt(language),
  ]
    .filter(Boolean)
    .join('\n\n');
}
