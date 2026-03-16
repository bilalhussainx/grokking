/**
 * Review Agent
 * 
 * Compares generated course content against quality standards
 * and reference material from existing high-quality courses.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { moonshot, readSkill } from './course-generator-client';

/**
 * Load reference material from existing courses
 */
function loadReferenceMaterial(domain: string): string {
  const references: Record<string, string[]> = {
    'computer-science': [
      'src/data/coding-interview/01-two-pointers.ts',
      'src/data/python-fundamentals/index.ts',
    ],
    'finance-business': [
      'src/data/personal-finance/index.ts',
    ],
    'economics': [
      'src/data/microeconomics/index.ts',
    ],
  };

  const files = references[domain] || references['computer-science'];
  return files.map(f => {
    try {
      const content = readFileSync(resolve(__dirname, '../../', f), 'utf-8');
      return `--- ${f} ---\n${content.slice(0, 2000)}`;
    } catch { return ''; }
  }).join('\n\n');
}

/**
 * Review a module against quality standards
 */
export async function reviewModule(
  moduleCode: string,
  domain: string,
  courseTitle: string,
): Promise<{ passed: boolean; issues: string[]; suggestions: string[]; scores?: any }> {
  const orchestratorSkill = readSkill('content-orchestrator');
  const referenceMaterial = loadReferenceMaterial(domain);

  const systemPrompt = `You are a quality review agent for Samsara.ai.

Your job is to review a generated course module against:
1. The quality standards in the content-orchestrator skill
2. Reference material from existing high-quality courses
3. The quality checklist (Step 10 from the orchestrator)

QUALITY STANDARDS (from skill):
${orchestratorSkill.slice(orchestratorSkill.indexOf('Step 10: REVIEW'), orchestratorSkill.indexOf('## Anti-Patterns'))}

REFERENCE MATERIAL (what good courses look like):
${referenceMaterial.slice(0, 3000)}

Review the module and return JSON:
{
  "passed": true/false,
  "issues": ["list of specific problems found"],
  "suggestions": ["list of improvements"],
  "scores": {
    "content_depth": 1-10,
    "exercise_quality": 1-10,
    "voice_markers": 1-10,
    "citation_quality": 1-10,
    "overall": 1-10
  }
}

PASS THRESHOLD: overall >= 7
Only return valid JSON.`;

  const result = await moonshot(systemPrompt, `Review this module for "${courseTitle}":\n\n${moduleCode.slice(0, 6000)}`, 2000);

  try {
    // Remove markdown code blocks if present
    let jsonStr = result;
    const codeBlockMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }
    
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { passed: false, issues: ['Review parse failed - no JSON found'], suggestions: [] };
    
    // Clean common JSON issues
    let cleanJson = jsonMatch[0]
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      .replace(/,\s*([}\]])/g, '$1');
    
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Review parse error:', e);
    return { passed: false, issues: ['Review parse failed'], suggestions: [] };
  }
}
