/**
 * Course Generator Client
 * 
 * Functions for generating courses using:
 * - Tavily for research
 * - Moonshot API (Kimi K2) for content generation
 * - Local skill files for quality guidelines
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || '';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';

const SKILLS_DIR = resolve(__dirname, '../../skills');

/**
 * Read a skill file from the skills directory
 */
export function readSkill(name: string): string {
  return readFileSync(resolve(SKILLS_DIR, name, 'SKILL.md'), 'utf-8');
}

/**
 * Search using Tavily API
 */
export async function tavilySearch(query: string): Promise<any> {
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
  return resp.json();
}

/**
 * Call Moonshot API (Kimi K2)
 */
export async function moonshot(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 4000,
): Promise<string> {
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
  const data = await resp.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Generate a single lesson
 */
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
  const csSkill = params.domain === 'computer-science' ? readSkill('cs-exercises') : '';

  const systemPrompt = `You are a PhD-level content creator for Samsara.ai.

SKILL INSTRUCTIONS:
${lessonSkill.slice(0, 6000)}

${csSkill ? `CS EXERCISE RULES:\n${csSkill.slice(0, 4000)}` : ''}

OUTPUT FORMAT:
Return a JSON object with these exact fields:
{
  "id": "kebab-case-id",
  "slug": "same-as-id",
  "title": "Lesson Title",
  "content": "## Full markdown content with <!-- voice: --> markers",
  "starterCode": "Python code with TODO + test cases (or null if no exercise)",
  "solutionCode": "Complete solution with same test cases (or null)"
}

CRITICAL RULES:
- ONE concept per lesson
- Example BEFORE abstraction
- Include <!-- voice:section_check --> and <!-- voice:key_insight --> markers
- For CS exercises: starterCode has pass + TODO, solutionCode has implementation
- Test cases IDENTICAL in both starter and solution
- Escape template literals: use \\$\\{var\\} not $\\{var\\} for Python f-strings
- Return ONLY valid JSON, no markdown wrapping`;

  const userMessage = `Generate lesson content:

Course: "${params.courseTitle}" (${params.domain}/${params.variation}, ${params.level})
Module: "${params.moduleTitle}" (index ${params.moduleIndex})
Lesson: "${params.lessonTitle}" (index ${params.lessonIndex})
Is checkpoint: ${params.isCheckpoint}
Voice persona: ${params.voicePersona}
Previous lessons covered: ${params.previousSummary}

Research material to incorporate:
${params.researchResults}`;

  const result = await moonshot(systemPrompt, userMessage, 4000);

  try {
    // Extract JSON from response - handle markdown code blocks
    let jsonStr = result.trim();
    
    // Remove markdown code block wrappers if present
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```\s*$/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }
    
    // Find JSON object boundaries by counting braces
    let startIdx = jsonStr.indexOf('{');
    if (startIdx === -1) throw new Error('No JSON object start found');
    
    let braceCount = 0;
    let endIdx = startIdx;
    for (let i = startIdx; i < jsonStr.length; i++) {
      if (jsonStr[i] === '{') braceCount++;
      else if (jsonStr[i] === '}') braceCount--;
      
      if (braceCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
    
    if (braceCount !== 0) throw new Error('Unbalanced braces in JSON');
    
    let cleanJson = jsonStr.slice(startIdx, endIdx)
      // Remove control characters except newlines and tabs
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      // Fix trailing commas before closing braces/brackets
      .replace(/,\s*([}\]])/g, '$1')
      // Ensure newlines in strings are escaped
      .replace(/(?<!\\)\n/g, '\\n')
      .replace(/(?<!\\)\t/g, '\\t');
    
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Failed to parse lesson JSON:', e);
    console.error('Raw response preview:', result.slice(0, 500));
    return {
      id: params.lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      slug: params.lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: params.lessonTitle,
      content: `## ${params.lessonTitle}\n\n*Content generation had an error. Raw output preserved below for debugging.*\n\n\`\`\`\n${result.slice(0, 2000)}\n\`\`\``,
    };
  }
}
