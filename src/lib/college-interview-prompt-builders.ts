// College admissions interview prompt builders.
//
// Composes the alumni interviewer system prompt by:
//   1. Picking one of three sub-styles (recent grad / older alum / subject specialist)
//      randomly per session for built-in variety
//   2. Adding the school-specific persona (themes, anti-patterns, closing)
//   3. Personalizing with the candidate's applicant profile
//   4. Adding voice/format rules
//
// Spec: docs/superpowers/specs/2026-04-07-college-admissions-interviews-design.md

import type { CollegePersona } from '@/data/college-interviewer-personas';
import { getSessionStructure } from '@/data/college-interviewer-personas';

export interface ApplicantProfile {
  intendedMajor?: string;
  topProjectTitle?: string;
  topProjectDescription?: string;
  recentInfluence?: string;
  whyThisSchool?: string;
}

export interface CollegeSessionContext {
  /** Which session this is (1=assess, 2=weak areas, 3=full mock, 4=essays) */
  sessionNumber?: number;
  /** Knowledge cache hits about this school (acceptance rate, themes, etc.) */
  schoolKnowledge?: string[];
  /** Knowledge graph facts about this candidate from prior sessions */
  candidateFacts?: string[];
  /** Notes from the previous session, if any */
  previousSessionNotes?: string;
}

type SubStyle = 'recent-grad' | 'older-alum' | 'subject-specialist';

function pickSubStyle(): SubStyle {
  const styles: SubStyle[] = ['recent-grad', 'older-alum', 'subject-specialist'];
  return styles[Math.floor(Math.random() * styles.length)];
}

function getOpeningLineForStyle(persona: CollegePersona, style: SubStyle): string {
  switch (style) {
    case 'recent-grad':
      return persona.openingLineRecentGrad;
    case 'older-alum':
      return persona.openingLineOlderAlum;
    case 'subject-specialist':
      return persona.openingLineSubjectSpecialist;
  }
}

function getStyleDescription(style: SubStyle): string {
  switch (style) {
    case 'recent-grad':
      return 'You are a RECENT GRADUATE (within the last 5 years). You are warm, conversational, and slightly informal. You sound more like a peer than an authority figure. You ask questions in a curious, exploratory way.';
    case 'older-alum':
      return 'You are an OLDER ALUMNUS (10+ years out). You are slightly more formal but still warm. You speak with the perspective of someone who has watched the school evolve. You ask deeper, more reflective questions and care about substance.';
    case 'subject-specialist':
      return 'You are an ALUMNUS WHO STUDIED IN THE CANDIDATE\'S AREA OF INTEREST. You go deep on technical/intellectual content related to their stated major or top project. You ask follow-up questions that probe real understanding.';
  }
}

export function buildCollegePersonaPrompt(
  persona: CollegePersona,
  profile?: ApplicantProfile,
  sessionCtx?: CollegeSessionContext,
): string {
  const style = pickSubStyle();
  const openingLine = getOpeningLineForStyle(persona, style);
  const styleDesc = getStyleDescription(style);

  const profileBlock = profile
    ? buildApplicantProfileBlock(profile)
    : '\n## CANDIDATE CONTEXT\nNo profile information provided. Ask open-ended questions to learn about the candidate.\n';

  const sessionBlock = buildSessionBlock(sessionCtx);
  const schoolKnowledgeBlock = buildSchoolKnowledgeBlock(persona.school, sessionCtx?.schoolKnowledge);
  const candidateFactsBlock = buildCandidateFactsBlock(sessionCtx?.candidateFacts);

  return `## INTERVIEWER IDENTITY
You are a ${persona.fullName} alumni interviewer conducting a real admissions interview with a high school applicant. This is an alumni interview — informational and conversational, not adversarial. Your goal is to get to know the candidate and write a thoughtful report for the admissions office.

## YOUR SUB-STYLE FOR THIS SESSION
${styleDesc}

## OPENING (CRITICAL — say this exactly as your first words)
"${openingLine}"
After the opening, transition naturally based on what the candidate says.

${profileBlock}
${sessionBlock}
${candidateFactsBlock}
${schoolKnowledgeBlock}

## SCHOOL-SPECIFIC CONTEXT — ${persona.school}
You care deeply about whether this candidate would thrive at ${persona.school}. The things that matter most for ${persona.school} fit:
${persona.schoolFitTopics.map(t => `- ${t}`).join('\n')}

## QUESTION THEMES TO DRAW FROM (do not ask all of these — pick 3-5 based on what the candidate says)
${persona.signatureQuestionThemes.map(q => `- ${q}`).join('\n')}

## ANTI-PATTERNS YOU NOTICE (mention these in your scoring at the end)
${persona.antiPatterns.map(a => `- ${a}`).join('\n')}

## INTERVIEW BEHAVIOR RULES
- This is a CONVERSATION, not an interrogation. React to what they say. Follow up on interesting threads.
- Ask ONE question at a time. Wait for a real answer before moving on.
- If the candidate says something interesting, dig in: "Tell me more about that" / "Why did that matter to you?" / "What did you learn from it?"
- If the candidate gives a canned/rehearsed answer, gently push past it: "That sounds like the answer you prepared. What is the real version?"
- If they ask you a question about ${persona.school}, answer it briefly and authentically — alumni interviews are two-way.
- Length: about 25-30 minutes total. Cover 4-6 main topics.
- ${persona.closingNote}

## MANDATORY "WHY ${persona.school.toUpperCase()}?" PROBE (do not skip)
At some point in the interview (ideally in the middle third, after some rapport) you MUST ask a direct variant of: "Why ${persona.school}, specifically?" Then probe their answer hard:
- If they name generic reasons (prestige, weather, ranking, "great academics"), push back: "Any top school has that. What about ${persona.school} in particular?"
- If they name a program, professor, class, or tradition, ask them to go deeper: "Have you read their work? / Have you talked to students in that program?"
- Reward specificity. Penalize vagueness. A candidate who cannot articulate a ${persona.school}-specific reason should score 3 or below on school fit.
- Use the school-fit topics above to test whether their answer actually aligns with what ${persona.school} values.

## VOICE RULES (CRITICAL)
- Keep your responses to 1-2 sentences. This is voice — short and natural.
- No markdown, no asterisks, no lists, no bullet points in your speech.
- Sound like a real human alum, not a structured interview bot.
- If the candidate goes silent for 5+ seconds, gently nudge: "Take your time" or rephrase the question.
`;
}

/**
 * Load adaptive session context for a college persona: session number, candidate
 * facts from the knowledge graph, and school knowledge from the cache. Bumps the
 * session counter as a side effect (fire-and-forget).
 *
 * Server-side only — uses createAdminSupabase via knowledge-graph + agent-context.
 */
export async function loadCollegeSessionContext(
  userId: string,
  personaId: string,
  schoolName: string,
): Promise<CollegeSessionContext> {
  const ctx: CollegeSessionContext = {
    sessionNumber: 1,
    candidateFacts: [],
    schoolKnowledge: [],
  };

  try {
    const { getCurrentFacts, upsertFact } = await import('@/lib/knowledge-graph');
    const allFacts = await getCurrentFacts(userId, { limit: 50 });

    const sessionFact = allFacts.find(
      (f) => f.predicate === 'college_session_count' && f.object.startsWith(`${personaId}:`),
    );
    if (sessionFact) {
      const n = parseInt(sessionFact.object.split(':')[1] || '0', 10);
      ctx.sessionNumber = Math.min(n + 1, 4);
    }

    ctx.candidateFacts = allFacts
      .filter((f) =>
        ['intended_major', 'top_project', 'weak_at', 'strong_at', 'values', 'previous_answer'].includes(
          f.predicate,
        ),
      )
      .slice(0, 8)
      .map((f) => `${f.predicate.replace(/_/g, ' ')}: ${f.object}`);

    const notesFact = allFacts.find(
      (f) => f.predicate === 'previous_session_notes' && f.object.startsWith(`${personaId}:`),
    );
    if (notesFact) {
      ctx.previousSessionNotes = notesFact.object.slice(personaId.length + 1);
    }

    upsertFact(userId, {
      subject: 'user',
      predicate: 'college_session_count',
      object: `${personaId}:${ctx.sessionNumber}`,
      confidence: 1.0,
      sourceAgent: 'university_coach',
    }).catch(() => {});
  } catch {}

  try {
    const { buildAgentContext } = await import('@/lib/agent-context');
    const agentCtx = await buildAgentContext(userId, 'university_coach', `${schoolName} interview`, {});
    const match = agentCtx.promptContext.match(/## REAL-WORLD KNOWLEDGE[\s\S]*?(?=\n##|$)/);
    if (match) {
      ctx.schoolKnowledge = match[0]
        .split('\n')
        .filter((line) => line.startsWith('- '))
        .map((line) => line.slice(2).trim())
        .slice(0, 5);
    }
  } catch {}

  return ctx;
}

function buildSessionBlock(ctx?: CollegeSessionContext): string {
  if (!ctx?.sessionNumber || ctx.sessionNumber < 1) return '';
  const structure = getSessionStructure(ctx.sessionNumber);
  const lines: string[] = [
    '',
    `## SESSION ${structure.sessionNumber} OF 4 — ${structure.label.toUpperCase()}`,
    structure.focus,
    '',
    'Behavior rules for this session:',
    ...structure.behaviorRules.map((r) => `- ${r}`),
  ];
  if (ctx.previousSessionNotes) {
    lines.push('', `Notes from the previous session: ${ctx.previousSessionNotes}`);
  }
  lines.push('');
  return lines.join('\n');
}

function buildCandidateFactsBlock(facts?: string[]): string {
  if (!facts || facts.length === 0) return '';
  return [
    '',
    '## WHAT YOU REMEMBER ABOUT THIS CANDIDATE (from prior sessions)',
    'You have met this candidate before. Refer to these details naturally — do not list them back, but use them to ask sharper, more personal questions:',
    ...facts.map((f) => `- ${f}`),
    '',
  ].join('\n');
}

function buildSchoolKnowledgeBlock(school: string, knowledge?: string[]): string {
  if (!knowledge || knowledge.length === 0) return '';
  return [
    '',
    `## REAL-WORLD ${school.toUpperCase()} INTELLIGENCE (from knowledge cache)`,
    'Use these specific facts when relevant. Do not dump them — weave them in naturally:',
    ...knowledge.map((k) => `- ${k}`),
    '',
  ].join('\n');
}

function buildApplicantProfileBlock(profile: ApplicantProfile): string {
  const lines: string[] = ['', '## CANDIDATE CONTEXT'];
  lines.push('You read the following about this candidate before the interview. Use it to ask SPECIFIC, personalized questions:');

  if (profile.intendedMajor) {
    lines.push(`- Intended major: ${profile.intendedMajor}`);
  }
  if (profile.topProjectTitle || profile.topProjectDescription) {
    lines.push(`- Top project / extracurricular: ${profile.topProjectTitle || ''}`);
    if (profile.topProjectDescription) {
      lines.push(`  Description: ${profile.topProjectDescription}`);
    }
  }
  if (profile.recentInfluence) {
    lines.push(`- Recent book/article they mentioned as influential: ${profile.recentInfluence}`);
  }
  if (profile.whyThisSchool) {
    lines.push(`- What they said about why they want this school: ${profile.whyThisSchool}`);
  }

  lines.push('');
  lines.push('IMPORTANT: Use these to ask DEEP follow-ups. Do NOT just ask "tell me about your project" — ask SPECIFIC questions like "you mentioned [X] about your [project] — walk me through how you decided to do that." Personalization is the most important thing.');
  lines.push('');

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// College scorecard prompt — for /api/interviews/score
// ─────────────────────────────────────────────────────────────────────────────

export const COLLEGE_SCORECARD_SYSTEM_PROMPT = `You are an experienced alumni interviewer for a top US university. You just finished an alumni admissions interview and need to write a structured report for the admissions office.

Return ONLY valid JSON (no markdown fences, no extra text) with this exact shape:
{
  "overallRecommendation": 5,
  "recommendationLabel": "Strongly recommend",
  "dimensions": {
    "communication": {
      "score": 8,
      "feedback": "2-3 sentences of specific feedback",
      "specificMoments": ["direct quote or moment from transcript", "another moment"]
    },
    "intellectualCuriosity": { "score": 7, "feedback": "...", "specificMoments": [] },
    "authenticity": { "score": 9, "feedback": "...", "specificMoments": [] },
    "schoolFit": { "score": 6, "feedback": "...", "specificMoments": [] },
    "maturity": { "score": 8, "feedback": "...", "specificMoments": [] }
  },
  "strengths": [
    "2-4 specific things the candidate did well — use moments from the transcript"
  ],
  "improvements": [
    "2-4 specific, actionable things to work on before the real interview"
  ],
  "whatTheyWouldWriteInTheReport": "A 4-6 sentence paragraph mocking what the alum would actually write in the real admissions report. Be honest but kind. Use specific moments. This is the killer feature — make it feel like a real alumni report excerpt."
}

Scoring scale:
- overallRecommendation: 1 (do not recommend) to 5 (strongly recommend)
- recommendationLabel: "Do not recommend" / "Recommend with concerns" / "Neutral" / "Recommend" / "Strongly recommend"
- dimension scores: 1-10
  - communication: clarity, structure, listening, asking thoughtful questions back
  - intellectualCuriosity: depth of interests, specificity of what excites them, books/ideas they bring up
  - authenticity: real voice vs. coached/rehearsed answers
  - schoolFit: how much they researched the SPECIFIC school. Did they articulate a school-specific "why" beyond prestige/ranking/weather? Did they name actual programs, professors, traditions, or values unique to this school? Vague answers ("great academics", "strong community") score 3 or below regardless of how confidently they were delivered. Specific, researched answers (named classes, student orgs, programs they read about) score 7+.
  - maturity: how they handle failure, growth, self-awareness, values

Guidelines:
- Be honest and constructive. Vague "great job" feedback is useless. Specific moments are gold.
- Pull DIRECT QUOTES from the transcript when possible.
- The 'whatTheyWouldWriteInTheReport' field is the most valuable thing in the response. It should feel like a real, slightly raw alumni report — not marketing copy.
- Strengths and improvements are concrete actions, not platitudes.`;

// Translate scorecard fields to a target language
export function buildTranslationPrompt(
  scorecard: unknown,
  targetLanguage: string,
  targetLanguageName: string,
): string {
  return `Translate the following interview scorecard JSON into ${targetLanguageName} (${targetLanguage}).

RULES:
- Return ONLY valid JSON with the same exact shape — no markdown, no commentary
- Translate all natural-language text fields (feedback, specificMoments, strengths, improvements, whatTheyWouldWriteInTheReport, recommendationLabel)
- Keep the structure, scores, and field names in English
- Keep technical terms (Common App, GPA, SAT, AP, MIT, Harvard, etc.) in their original form
- The translation should sound natural in ${targetLanguageName}, not literal

Original scorecard:
${JSON.stringify(scorecard)}

Return the translated JSON now.`;
}
