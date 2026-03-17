/**
 * Samsara.ai Course Generator Client
 *
 * The MCP client that reads skill files, calls Tavily for research,
 * and calls Moonshot API (Kimi K2) for content generation.
 *
 * This is the execution engine behind the MCP server tools:
 * - samsara_plan_course  → generateCourseSkeleton()
 * - samsara_plan_lesson  → generateLesson()
 * - samsara_orchestrate  → the full pipeline in generate-course.ts
 *
 * Required env vars:
 *   MOONSHOT_API_KEY — Kimi K2 for content generation
 *   TAVILY_API_KEY  — Tavily for research (optional, falls back to no-research)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || '';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';
const SKILLS_DIR = resolve(__dirname, '../../skills');

// ─── Skill File Reader ───

export function readSkill(name: string): string {
  const path = resolve(SKILLS_DIR, name, 'SKILL.md');
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    console.warn(`[Skill] Could not read ${path}`);
    return '';
  }
}

/**
 * Extract a specific section from a skill file by heading
 */
export function extractSkillSection(skillContent: string, heading: string): string {
  const regex = new RegExp(`## ${heading}[\\s\\S]*?(?=\\n## |$)`, 'i');
  const match = skillContent.match(regex);
  return match ? match[0] : '';
}

// ─── Tavily Search ───

export async function tavilySearch(query: string): Promise<{
  results: Array<{ title: string; url: string; content: string }>;
}> {
  if (!TAVILY_API_KEY) {
    console.warn('[Tavily] No API key — skipping search for:', query);
    return { results: [] };
  }

  try {
    const resp = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        search_depth: 'advanced',
        max_results: 5,
      }),
    });

    if (!resp.ok) {
      console.warn(`[Tavily] Search failed (${resp.status}):`, query);
      return { results: [] };
    }

    return await resp.json();
  } catch (err) {
    console.warn('[Tavily] Search error:', err);
    return { results: [] };
  }
}

// ─── Moonshot API (Kimi K2) ───

export async function moonshot(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 4000,
): Promise<string> {
  if (!MOONSHOT_API_KEY) {
    throw new Error('MOONSHOT_API_KEY not set. Set it: export MOONSHOT_API_KEY=your_key');
  }

  const resp = await fetch('https://api.moonshot.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MOONSHOT_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'kimi-k2-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Moonshot API error (${resp.status}): ${err}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || '';
}

// ─── Parse JSON from LLM response ───

export function parseJsonResponse(raw: string): any {
  let str = raw.trim();

  // Strip markdown code blocks
  const codeBlock = str.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) str = codeBlock[1].trim();

  // Find JSON boundaries by brace counting
  const start = str.indexOf('{');
  if (start === -1) {
    // Try array
    const arrStart = str.indexOf('[');
    if (arrStart === -1) throw new Error('No JSON found in response');
    let depth = 0;
    let end = arrStart;
    for (let i = arrStart; i < str.length; i++) {
      if (str[i] === '[') depth++;
      else if (str[i] === ']') depth--;
      if (depth === 0) { end = i + 1; break; }
    }
    return JSON.parse(str.slice(arrStart, end));
  }

  let depth = 0;
  let end = start;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') depth--;
    if (depth === 0) { end = i + 1; break; }
  }

  let clean = str.slice(start, end)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/(?<!\\)\n/g, '\\n')
    .replace(/(?<!\\)\t/g, '\\t');

  return JSON.parse(clean);
}

// ─── Course Skeleton Generator ───

export interface ModulePlan {
  id: string;
  title: string;
  description: string;
  lessonTitles: string[];
}

export async function generateCourseSkeleton(params: {
  title: string;
  domain: string;
  variation: string;
  level: string;
  description?: string;
  moduleCount?: number;
  lessonsPerModule?: number;
}): Promise<ModulePlan[]> {
  const courseSkill = readSkill('course-planning');
  const orchestratorSkill = readSkill('content-orchestrator');

  // Extract domain-specific sections
  const domainSection = extractSkillSection(courseSkill, 'Step 0: Field Detection');
  const levelSection = extractSkillSection(courseSkill, 'Step 1: Level Calibration');
  const citationSection = extractSkillSection(courseSkill, 'Step 6: Citation Standards');

  // Research the topic
  const research = await tavilySearch(
    `${params.title} ${params.domain} curriculum syllabus learning path`
  );

  const systemPrompt = `You are a PhD-level curriculum architect for Samsara.ai.

QUALITY PRINCIPLES (from content-orchestrator skill):
- ONE excellent course beats ten mediocre ones
- Each module has clear input→output learning transformation
- Each lesson teaches ONE concept COMPLETELY
- Example BEFORE abstraction in every lesson
- Checkpoints celebrate progress — "Nice work!", never "Failed"

DOMAIN TAXONOMY:
${domainSection.slice(0, 3000)}

LEVEL CALIBRATION:
${levelSection.slice(0, 1500)}

CITATION STANDARDS:
${citationSection.slice(0, 1500)}

OUTPUT FORMAT:
Return a JSON array of modules:
[
  {
    "id": "kebab-case-module-id",
    "title": "Module Title",
    "description": "What the student learns — input state → output state",
    "lessonTitles": ["Lesson 1 Title", "Lesson 2 Title", "Lesson 3 Title", "Module Checkpoint"]
  }
]

RULES:
- ${params.moduleCount || '6-8'} modules, ${params.lessonsPerModule || '3-4'} content lessons + 1 checkpoint each
- Last lesson in every module MUST be titled "Module Checkpoint: {Module Title}"
- Progressive difficulty across modules
- Final module is a capstone
- Return ONLY valid JSON array, no wrapping text`;

  const userMessage = `Design course structure:

Title: ${params.title}
Domain: ${params.domain} / ${params.variation}
Level: ${params.level}
${params.description ? `Description: ${params.description}` : ''}

Research findings:
${research.results.slice(0, 5).map(r => `- ${r.title}: ${r.content?.slice(0, 150)}`).join('\n') || 'No research available — design from domain expertise'}`;

  const result = await moonshot(systemPrompt, userMessage, 3000);
  return parseJsonResponse(result);
}

// ─── Lesson Generator ───

export async function generateLesson(params: {
  courseId: string;
  courseTitle: string;
  domain: string;
  variation: string;
  level: string;
  moduleId: string;
  moduleTitle: string;
  moduleIndex: number;
  lessonTitle: string;
  lessonIndex: number;
  isCheckpoint: boolean;
  previousSummary: string;
  voicePersona: string;
  researchResults: string;
}): Promise<{
  id: string;
  slug: string;
  title: string;
  content: string;
  starterCode?: string;
  solutionCode?: string;
}> {
  const lessonSkill = readSkill('lesson-planning');
  const isCS = params.domain === 'computer-science';
  const csSkill = isCS ? readSkill('cs-exercises') : '';

  // Extract the right template section based on domain
  const templateSection = params.isCheckpoint
    ? extractSkillSection(lessonSkill, 'Template E: Checkpoint Quiz')
    : isCS
    ? extractSkillSection(lessonSkill, 'Template A: Code-Based')
    : params.domain === 'religious-studies' || params.domain === 'philosophy'
    ? extractSkillSection(lessonSkill, 'Template C: Source Analysis')
    : params.domain === 'finance-business' || params.domain === 'economics'
    ? extractSkillSection(lessonSkill, 'Template B: Case Study')
    : params.domain === 'political-strategy'
    ? extractSkillSection(lessonSkill, 'Template D: Strategic Analysis')
    : extractSkillSection(lessonSkill, 'Template B: Case Study');

  // Extract level-specific rules
  const levelRules = params.level === 'beginner'
    ? extractSkillSection(lessonSkill, 'Level-Specific Rules')
    : '';

  const systemPrompt = `You are a PhD-level content creator for Samsara.ai.

LESSON TEMPLATE TO FOLLOW:
${templateSection.slice(0, 2000)}

QUALITY RULES:
- ONE concept per lesson, taught COMPLETELY
- Concrete example BEFORE the abstraction
- Voice markers REQUIRED:
  <!-- voice:section_check concept="SPECIFIC concept name here" -->
  <!-- voice:key_insight insight="THE one thing to remember" -->
${params.isCheckpoint ? '- Checkpoint tone: encouraging. "Nice work!" not "Test time".\n- 5-6 questions, mix of types. Always explain wrong answers.' : ''}
${isCS ? `
CS EXERCISE RULES:
${csSkill.slice(0, 2500)}

starterCode: docstring + TODO comments + pass + 3-5 print() test cases
solutionCode: clean implementation + Time/Space complexity + SAME test cases
Test cases MUST be identical in both.` : ''}
${params.domain === 'religious-studies' ? '- Present tradition from WITHIN first, then academic perspective\n- Include original language terms with transliteration\n- Cite primary scripture with chapter/verse/ayah' : ''}
${params.domain === 'health-wellness' ? '- Include medical disclaimer in first lesson of each module\n- Cite PubMed/JAMA/Lancet with study design noted\n- Include practical exercises the student can do TODAY' : ''}

${levelRules.slice(0, 500)}

OUTPUT FORMAT — return ONLY this JSON object:
{
  "id": "kebab-case-id",
  "slug": "same-as-id",
  "title": "Lesson Title",
  "content": "## Full markdown with voice markers (400-600 words)",
  "starterCode": "Python code or null",
  "solutionCode": "Python code or null"
}`;

  const userMessage = `Generate lesson:

Course: "${params.courseTitle}" (${params.domain}/${params.variation}, ${params.level})
Module: "${params.moduleTitle}" (module ${params.moduleIndex + 1})
Lesson: "${params.lessonTitle}" (lesson ${params.lessonIndex + 1})
${params.isCheckpoint ? 'TYPE: Checkpoint quiz — 5-6 questions covering all module lessons' : ''}
Voice persona: ${params.voicePersona}
Previous lessons: ${params.previousSummary}

Research to incorporate:
${params.researchResults || 'No external research — use domain expertise'}`;

  const result = await moonshot(systemPrompt, userMessage, 4000);

  try {
    return parseJsonResponse(result);
  } catch (e) {
    console.error(`[Lesson] Parse failed for "${params.lessonTitle}":`, e);
    return {
      id: params.lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      slug: params.lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      title: params.lessonTitle,
      content: `## ${params.lessonTitle}\n\n> Generation failed. Re-run with: \`npm run generate:course\`\n\n\`\`\`\n${result.slice(0, 1000)}\n\`\`\``,
    };
  }
}
