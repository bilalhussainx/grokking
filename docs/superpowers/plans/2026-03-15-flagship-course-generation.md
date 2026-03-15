# Flagship Course Generation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate 5 flagship courses using MCP skills as an MCP client, add highlighted/curated course UI, and build a review agent that validates content quality against reference material (Grokking Coding Interview, CS50, etc.)

**Architecture:** An MCP client script reads the skill files, orchestrates Tavily research + Moonshot LLM to generate TypeScript course data files. A review agent compares output against existing high-quality courses. Platform gets a `featured` flag for curated courses.

**Tech Stack:** TypeScript, MCP SDK (client), Moonshot API (Kimi K2), Tavily search, existing Course/Module/Lesson interfaces

---

## Chunk 1: Platform — Featured Courses & Data Model

### Task 1: Add `featured` flag to Course type

**Files:**
- Modify: `src/data/types.ts`

- [ ] **Step 1: Extend Course interface**

```typescript
// In src/data/types.ts, add optional featured field:
export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  tier: "free" | "pro";
  modules: Module[];
  featured?: boolean;       // Highlighted on homepage during A/B testing
  domain?: string;          // e.g., "computer-science", "religious-studies"
  variation?: string;       // e.g., "interview-prep", "islam"
  level?: "beginner" | "advanced";
  prerequisiteIds?: string[];  // Course IDs that should be taken first
}
```

- [ ] **Step 2: Add getFeaturedCourses helper**

```typescript
// In src/data/types.ts, add:
export function getFeaturedCourses(courses: Course[]): Course[] {
  return courses.filter(c => c.featured);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/types.ts
git commit -m "feat(types): add featured flag, domain, level, prerequisites to Course interface"
```

---

### Task 2: Add Featured section to homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read current homepage**

Read `src/app/page.tsx` to understand the existing course grid layout.

- [ ] **Step 2: Add Featured Courses section above the main grid**

Add a "Featured Courses" section at the top that only shows courses with `featured: true`. These get a highlighted card with a badge. The existing grid remains below.

```tsx
// Above the main course grid:
{featuredCourses.length > 0 && (
  <section className="mb-12">
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
      <span className="text-yellow-400">★</span> Featured Courses
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {featuredCourses.map(course => (
        <Link key={course.id} href={`/course/${course.slug}`}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium">
            Featured
          </div>
          <span className="text-3xl">{course.icon}</span>
          <h3 className="text-white font-semibold mt-3">{course.title}</h3>
          <p className="text-slate-400 text-sm mt-1">{course.description}</p>
          {course.domain && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 text-xs">
              {course.domain}
            </span>
          )}
        </Link>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 3: Wire up featured filtering**

```typescript
import { courses } from "@/data";
import { getFeaturedCourses } from "@/data/types";

const featuredCourses = getFeaturedCourses(courses);
```

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(ui): add Featured Courses section to homepage"
```

---

## Chunk 2: MCP Client — Course Generation Script

### Task 3: Create MCP client that reads skill files and generates courses

**Files:**
- Create: `scripts/generate-flagship-course.ts`
- Create: `scripts/lib/course-generator-client.ts`
- Create: `scripts/lib/review-agent.ts`

- [ ] **Step 1: Create the course generator client**

This script reads skill files directly (no MCP server needed — they're local files),
uses Moonshot API for LLM generation, and Tavily for research.

```typescript
// scripts/lib/course-generator-client.ts

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || '';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';

const SKILLS_DIR = resolve(__dirname, '../../skills');

// Read a skill file
export function readSkill(name: string): string {
  return readFileSync(resolve(SKILLS_DIR, name, 'SKILL.md'), 'utf-8');
}

// Tavily search
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

// Moonshot LLM call
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

// Generate a single lesson using the lesson-planning skill
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
}): Promise<{ id: string; slug: string; title: string; content: string; starterCode?: string; solutionCode?: string }> {
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
    // Extract JSON from response (handle markdown wrapping)
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('Failed to parse lesson JSON:', e);
    // Return a safe fallback
    return {
      id: params.lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      slug: params.lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: params.lessonTitle,
      content: `## ${params.lessonTitle}\n\n*Content generation failed — regenerate this lesson.*`,
    };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/course-generator-client.ts
git commit -m "feat(scripts): add MCP client for course generation via Moonshot + Tavily"
```

---

### Task 4: Create the review agent

**Files:**
- Create: `scripts/lib/review-agent.ts`

- [ ] **Step 1: Build review agent that compares against reference courses**

```typescript
// scripts/lib/review-agent.ts

import { moonshot, readSkill } from './course-generator-client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load reference material from existing high-quality courses
function loadReferenceMaterial(domain: string): string {
  const references: Record<string, string[]> = {
    'computer-science': [
      'src/data/coding-interview/01-two-pointers.ts',
      'src/data/python-fundamentals/01-variables-and-types.ts',
      'src/data/data-structures-algorithms/index.ts',
    ],
    'finance-business': [
      'src/data/personal-finance/index.ts',
      'src/data/corporate-finance/index.ts',
    ],
    'economics': [
      'src/data/microeconomics/index.ts',
      'src/data/macroeconomics/index.ts',
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

export async function reviewModule(
  moduleCode: string,
  domain: string,
  courseTitle: string,
): Promise<{ passed: boolean; issues: string[]; suggestions: string[] }> {
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
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { passed: false, issues: ['Review parse failed'], suggestions: [] };
    return JSON.parse(jsonMatch[0]);
  } catch {
    return { passed: false, issues: ['Review parse failed'], suggestions: [] };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/review-agent.ts
git commit -m "feat(scripts): add review agent comparing against reference courses"
```

---

### Task 5: Create the main flagship course generator script

**Files:**
- Create: `scripts/generate-flagship-course.ts`

- [ ] **Step 1: Build the main orchestration script**

```typescript
// scripts/generate-flagship-course.ts
// Usage: npx tsx scripts/generate-flagship-course.ts <domain> <variation> <level> "<title>"

import { readSkill, tavilySearch, moonshot, generateLesson } from './lib/course-generator-client';
import { reviewModule } from './lib/review-agent';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

interface ModulePlan {
  id: string;
  title: string;
  description: string;
  lessonTitles: string[];
}

interface CourseSpec {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  tier: 'free' | 'pro';
  domain: string;
  variation: string;
  level: string;
  voicePersona: string;
  modules: ModulePlan[];
}

async function main() {
  const [,, domain, variation, level, title] = process.argv;

  if (!domain || !variation || !level || !title) {
    console.error('Usage: npx tsx scripts/generate-flagship-course.ts <domain> <variation> <level> "<title>"');
    process.exit(1);
  }

  console.log(`\n=== Samsara.ai Flagship Course Generator ===`);
  console.log(`Title: ${title}`);
  console.log(`Domain: ${domain} / ${variation} / ${level}\n`);

  // ─── Phase 1: Design course skeleton ───
  console.log('[Phase 1/4] Designing course skeleton...');

  const courseSkill = readSkill('course-planning');

  const skeletonPrompt = `You are a curriculum architect. Design a course skeleton.

SKILL INSTRUCTIONS (abbreviated):
${courseSkill.slice(0, 4000)}

Return JSON:
{
  "id": "kebab-case-slug",
  "slug": "same-as-id",
  "title": "${title}",
  "description": "2-3 sentence catalog description",
  "icon": "single emoji",
  "tier": "free" or "pro",
  "domain": "${domain}",
  "variation": "${variation}",
  "level": "${level}",
  "voicePersona": "persona name from skill file",
  "modules": [
    {
      "id": "module-slug",
      "title": "Module Title",
      "description": "What student learns",
      "lessonTitles": ["Lesson 1", "Lesson 2", "Lesson 3", "Module Checkpoint"]
    }
  ]
}

Rules:
- 6-8 modules for beginner, 8-10 for advanced
- 3-4 lessons per module + 1 checkpoint (last lesson)
- Each module has clear input→output learning transformation
- Progressive difficulty across modules
- Final module is a capstone
Only return valid JSON.`;

  const skeletonResult = await moonshot(skeletonPrompt, `Design course: "${title}" (${domain}/${variation}, ${level})`, 3000);
  let courseSpec: CourseSpec;
  try {
    const jsonMatch = skeletonResult.match(/\{[\s\S]*\}/);
    courseSpec = JSON.parse(jsonMatch![0]);
  } catch (e) {
    console.error('Failed to parse course skeleton:', e);
    process.exit(1);
  }

  console.log(`  Modules: ${courseSpec.modules.length}`);
  console.log(`  Total lessons: ${courseSpec.modules.reduce((s, m) => s + m.lessonTitles.length, 0)}`);
  console.log(`  Persona: ${courseSpec.voicePersona}\n`);

  // ─── Phase 2: Research per module ───
  console.log('[Phase 2/4] Researching sources...');

  const researchByModule: Record<string, string> = {};
  for (const mod of courseSpec.modules) {
    console.log(`  Searching: ${mod.title}...`);
    const search1 = await tavilySearch(`${mod.title} ${variation} ${level === 'beginner' ? 'introduction tutorial' : 'advanced study'}`);
    const search2 = await tavilySearch(`${mod.title} ${variation} best practices examples`);

    researchByModule[mod.id] = [
      ...(search1.results || []).slice(0, 3),
      ...(search2.results || []).slice(0, 2),
    ].map((r: any) => `- ${r.title}: ${r.content?.slice(0, 200)} (${r.url})`).join('\n');
  }

  console.log(`  Total searches: ${courseSpec.modules.length * 2}\n`);

  // ─── Phase 3: Generate lessons per module ───
  console.log('[Phase 3/4] Generating lesson content...');

  const courseDir = resolve(__dirname, `../src/data/${courseSpec.slug}`);
  if (!existsSync(courseDir)) mkdirSync(courseDir, { recursive: true });

  const moduleExports: string[] = [];
  let previousSummary = 'First module in course';

  for (let mi = 0; mi < courseSpec.modules.length; mi++) {
    const mod = courseSpec.modules[mi];
    const moduleNum = String(mi + 1).padStart(2, '0');
    const moduleVarName = mod.id.replace(/-./g, m => m[1].toUpperCase()) + 'Module';

    console.log(`\n  Module ${mi + 1}/${courseSpec.modules.length}: ${mod.title}`);

    const lessons: string[] = [];

    for (let li = 0; li < mod.lessonTitles.length; li++) {
      const lessonTitle = mod.lessonTitles[li];
      const isCheckpoint = li === mod.lessonTitles.length - 1;

      console.log(`    Lesson ${li + 1}: ${lessonTitle}${isCheckpoint ? ' (checkpoint)' : ''}`);

      const lesson = await generateLesson({
        courseId: courseSpec.slug,
        courseTitle: courseSpec.title,
        domain: courseSpec.domain,
        variation: courseSpec.variation,
        level: courseSpec.level,
        moduleId: mod.id,
        moduleTitle: mod.title,
        moduleIndex: mi,
        lessonTitle,
        lessonIndex: li,
        isCheckpoint,
        previousSummary,
        voicePersona: courseSpec.voicePersona,
        researchResults: researchByModule[mod.id] || '',
      });

      // Build lesson TypeScript
      const starterBlock = lesson.starterCode
        ? `,\n      starterCode: \`${lesson.starterCode.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``
        : '';
      const solutionBlock = lesson.solutionCode
        ? `,\n      solutionCode: \`${lesson.solutionCode.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``
        : '';

      lessons.push(`    {
      id: '${lesson.id}',
      slug: '${lesson.slug}',
      title: '${lesson.title.replace(/'/g, "\\'")}',
      content: \`${lesson.content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`${starterBlock}${solutionBlock},
    }`);
    }

    previousSummary = `Covered: ${mod.lessonTitles.slice(0, -1).join(', ')}`;

    // Write module file
    const moduleCode = `import { Module } from '../types';

export const ${moduleVarName}: Module = {
  id: '${mod.id}',
  title: '${mod.title.replace(/'/g, "\\'")}',
  description: '${mod.description.replace(/'/g, "\\'")}',
  lessons: [
${lessons.join(',\n')},
  ],
};
`;

    const moduleFile = resolve(courseDir, `${moduleNum}-${mod.id}.ts`);
    writeFileSync(moduleFile, moduleCode);
    moduleExports.push({ varName: moduleVarName, fileName: `${moduleNum}-${mod.id}` } as any);

    // ─── Review this module ───
    console.log(`    Reviewing module quality...`);
    const review = await reviewModule(moduleCode, courseSpec.domain, courseSpec.title);
    if (review.passed) {
      console.log(`    ✓ Review PASSED (score: ${(review as any).scores?.overall || 'N/A'}/10)`);
    } else {
      console.log(`    ⚠ Review found issues:`);
      (review.issues || []).forEach(i => console.log(`      - ${i}`));
      console.log(`    (Module saved — fix issues manually or re-run)`);
    }
  }

  // ─── Phase 4: Write course index ───
  console.log('\n[Phase 4/4] Writing course index...');

  const courseVarName = courseSpec.slug.replace(/-./g, m => m[1].toUpperCase()) + 'Course';

  const imports = (moduleExports as any[]).map(
    (m: any) => `import { ${m.varName} } from './${m.fileName}';`
  ).join('\n');

  const moduleList = (moduleExports as any[]).map((m: any) => `    ${m.varName},`).join('\n');

  const indexCode = `import { Course } from '../types';
${imports}

export const ${courseVarName}: Course = {
  id: '${courseSpec.slug}',
  slug: '${courseSpec.slug}',
  title: '${courseSpec.title.replace(/'/g, "\\'")}',
  description: '${courseSpec.description.replace(/'/g, "\\'")}',
  icon: '${courseSpec.icon}',
  tier: '${courseSpec.tier}' as const,
  featured: true,
  domain: '${courseSpec.domain}',
  variation: '${courseSpec.variation}',
  level: '${courseSpec.level}' as 'beginner' | 'advanced',
  modules: [
${moduleList}
  ],
};
`;

  writeFileSync(resolve(courseDir, 'index.ts'), indexCode);

  console.log(`\n=== Course Generated ===`);
  console.log(`Directory: src/data/${courseSpec.slug}/`);
  console.log(`Variable: ${courseVarName}`);
  console.log(`\nNext steps:`);
  console.log(`1. Add to src/data/index.ts:`);
  console.log(`   import { ${courseVarName} } from './${courseSpec.slug}';`);
  console.log(`   // Add to courses array`);
  console.log(`2. Verify: grep -n '\\$\\{' src/data/${courseSpec.slug}/*.ts | grep -v '\\\\$\\{' | grep -v import`);
  console.log(`3. Run: npm run build`);
}

main().catch(console.error);
```

- [ ] **Step 2: Commit**

```bash
git add scripts/generate-flagship-course.ts scripts/lib/
git commit -m "feat(scripts): add flagship course generator with MCP skills + review agent"
```

---

## Chunk 3: Generate 5 Flagship Courses

### Task 6: Generate CS flagship — "Grokking Data Structures in Python"

- [ ] **Step 1: Run the generator**

```bash
npx tsx scripts/generate-flagship-course.ts computer-science interview-prep beginner "Grokking Data Structures in Python"
```

- [ ] **Step 2: Register in index.ts**

```typescript
// Add to src/data/index.ts:
import { grokkingDataStructuresInPythonCourse } from './grokking-data-structures-in-python';
// Add to courses array (near the top, since it's featured)
```

- [ ] **Step 3: Validate template literals**

```bash
grep -rn '\$\{' src/data/grokking-data-structures-in-python/*.ts | grep -v '\\$\{' | grep -v import
# Must return 0 results
```

- [ ] **Step 4: Commit**

```bash
git add src/data/grokking-data-structures-in-python/ src/data/index.ts
git commit -m "feat(courses): add flagship 'Grokking Data Structures in Python' (featured)"
```

---

### Task 7: Generate Religious Studies flagship — "Islam: Foundations & Practice"

- [ ] **Step 1: Run the generator**

```bash
npx tsx scripts/generate-flagship-course.ts religious-studies islam beginner "Islam: Foundations & Practice"
```

- [ ] **Step 2: Register and validate**

Same pattern as Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/data/islam-foundations-practice/ src/data/index.ts
git commit -m "feat(courses): add flagship 'Islam: Foundations & Practice' (featured)"
```

---

### Task 8: Generate Philosophy flagship — "Stoic Philosophy for Modern Life"

- [ ] **Step 1: Run the generator**

```bash
npx tsx scripts/generate-flagship-course.ts philosophy ethics beginner "Stoic Philosophy for Modern Life"
```

- [ ] **Step 2: Register and validate**

- [ ] **Step 3: Commit**

```bash
git add src/data/stoic-philosophy-for-modern-life/ src/data/index.ts
git commit -m "feat(courses): add flagship 'Stoic Philosophy for Modern Life' (featured)"
```

---

### Task 9: Generate Finance flagship — "Personal Finance Essentials"

- [ ] **Step 1: Mark existing personal-finance course as featured**

The course already exists. Add `featured: true` to it instead of regenerating.

```typescript
// In src/data/personal-finance/index.ts, add to the course object:
featured: true,
domain: 'finance-business',
variation: 'personal-finance',
level: 'beginner' as const,
```

- [ ] **Step 2: Commit**

```bash
git add src/data/personal-finance/index.ts
git commit -m "feat(courses): mark 'Personal Finance Essentials' as featured"
```

---

### Task 10: Generate Health flagship — "Mental Health & Resilience"

- [ ] **Step 1: Run the generator**

```bash
npx tsx scripts/generate-flagship-course.ts health-wellness mental-health beginner "Mental Health & Resilience"
```

- [ ] **Step 2: Register and validate**

- [ ] **Step 3: Commit**

```bash
git add src/data/mental-health-resilience/ src/data/index.ts
git commit -m "feat(courses): add flagship 'Mental Health & Resilience' (featured)"
```

---

## Chunk 4: Mark Existing Best Courses as Featured

### Task 11: Feature existing top courses

- [ ] **Step 1: Mark these existing courses as featured**

Add `featured: true, domain: '...', variation: '...', level: '...'` to:

| Course | Domain | Variation |
|--------|--------|-----------|
| coding-interview | computer-science | interview-prep |
| system-design | computer-science | interview-prep |
| python-fundamentals | computer-science | systems-programming |

- [ ] **Step 2: Commit**

```bash
git add src/data/coding-interview/index.ts src/data/system-design/index.ts src/data/python-fundamentals/index.ts
git commit -m "feat(courses): mark top existing courses as featured"
```

---

## Chunk 5: Package.json & Validation

### Task 12: Add generation scripts to package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add script entries**

```json
{
  "scripts": {
    "generate:course": "tsx scripts/generate-flagship-course.ts",
    "validate:course": "bash -c 'grep -rn \"\\$\\{\" src/data/$1/*.ts | grep -v \"\\\\\\$\\{\" | grep -v import'"
  }
}
```

- [ ] **Step 2: Install tsx if not present**

```bash
npm install -D tsx
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add course generation and validation scripts"
```

---

## Execution Order

```
Task 1  → Types (featured flag)
Task 2  → Homepage UI (featured section)
Task 3  → Generator client (Moonshot + Tavily)
Task 4  → Review agent
Task 5  → Main generator script
Task 6  → Generate CS flagship
Task 7  → Generate Islam flagship
Task 8  → Generate Philosophy flagship
Task 9  → Feature existing Finance course
Task 10 → Generate Health flagship
Task 11 → Feature existing top courses
Task 12 → Package scripts
```

Tasks 1-5 are sequential (infrastructure).
Tasks 6-10 are independent (can run in parallel).
Tasks 11-12 are cleanup.
