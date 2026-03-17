#!/usr/bin/env npx tsx
/**
 * Samsara.ai Course Generator
 *
 * The MCP client script. Reads skill files, calls Tavily + Moonshot,
 * outputs proper TypeScript module files, and runs quality review.
 *
 * Usage:
 *   npx tsx scripts/generate-course.ts <domain> <variation> <level> "<title>" [options]
 *
 * Examples:
 *   npx tsx scripts/generate-course.ts religious-studies judaism beginner "Judaism: Torah & Tradition"
 *   npx tsx scripts/generate-course.ts computer-science ai-ml beginner "AI Fundamentals" --tier=pro --modules=8
 *   npx tsx scripts/generate-course.ts health-wellness meditation beginner "Meditation Practice" --icon=🧘
 *
 * Required env vars:
 *   MOONSHOT_API_KEY — Kimi K2 for content generation
 *   TAVILY_API_KEY  — Research (optional, degrades gracefully)
 *
 * Process (follows content-orchestrator skill):
 *   Step 1: Read skill files (course-planning, lesson-planning, cs-exercises)
 *   Step 2: Research via Tavily (2+ searches per module)
 *   Step 3: Generate course skeleton via Moonshot (course-planning skill)
 *   Step 4: Generate each lesson via Moonshot (lesson-planning skill)
 *   Step 5: Quality review via Moonshot (content-orchestrator skill)
 *   Step 6: Write TypeScript files (one per module + index.ts)
 *   Step 7: Register in src/data/index.ts
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import {
  readSkill,
  tavilySearch,
  generateCourseSkeleton,
  generateLesson,
  type ModulePlan,
} from './lib/course-generator-client';
import { reviewModule } from './lib/review-agent';

// ─── Parse CLI args ───

const args = process.argv.slice(2);
const flags: Record<string, string> = {};
const positional: string[] = [];

for (const arg of args) {
  if (arg.startsWith('--')) {
    const [key, val] = arg.slice(2).split('=');
    flags[key] = val || 'true';
  } else {
    positional.push(arg);
  }
}

const [domain, variation, level, title] = positional;

if (!domain || !variation || !level || !title) {
  console.error(`
Usage: npx tsx scripts/generate-course.ts <domain> <variation> <level> "<title>" [options]

Domains: computer-science, finance-business, economics, religious-studies,
         philosophy, political-strategy, health-wellness

Options:
  --tier=free|pro        (default: free)
  --modules=N            (default: 7)
  --lessons=N            (default: 3, per module, not counting checkpoint)
  --icon=EMOJI           (default: 📚)
  --persona=NAME         (default: Coach Alex)
  --skip-review          Skip quality review step
  --skip-register        Don't add to src/data/index.ts
  --dry-run              Show plan without generating

Examples:
  npx tsx scripts/generate-course.ts religious-studies sufism beginner "Sufism: The Mystical Path" --icon=🌀
  npx tsx scripts/generate-course.ts computer-science security beginner "Ethical Hacking" --tier=pro --modules=7
`);
  process.exit(1);
}

const tier = (flags.tier || 'free') as 'free' | 'pro';
const moduleCount = parseInt(flags.modules || '7');
const lessonsPerModule = parseInt(flags.lessons || '3');
const icon = flags.icon || '📚';
const persona = flags.persona || 'Coach Alex';
const skipReview = flags['skip-review'] === 'true';
const skipRegister = flags['skip-register'] === 'true';
const dryRun = flags['dry-run'] === 'true';

// ─── Derive slug and variable names ───

const slug = title.toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const camelName = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const courseName = `${camelName}Course`;

const courseDir = resolve(__dirname, `../src/data/${slug}`);
const indexPath = resolve(__dirname, '../src/data/index.ts');

console.log(`
╔════════════════════════════════════════════════════════════╗
║  Samsara.ai Course Generator (MCP Skills Pipeline)        ║
╚════════════════════════════════════════════════════════════╝

  Title:     ${title}
  Domain:    ${domain} / ${variation}
  Level:     ${level}
  Tier:      ${tier}
  Icon:      ${icon}
  Slug:      ${slug}
  Modules:   ${moduleCount} (${lessonsPerModule} lessons + checkpoint each)
  Persona:   ${persona}
  Output:    src/data/${slug}/
`);

// ─── Verify skill files exist ───

const skillFiles = ['course-planning', 'lesson-planning', 'content-orchestrator'];
if (domain === 'computer-science') skillFiles.push('cs-exercises');

for (const skill of skillFiles) {
  const content = readSkill(skill);
  if (!content) {
    console.error(`[ERROR] Skill file not found: skills/${skill}/SKILL.md`);
    process.exit(1);
  }
  console.log(`  ✓ Loaded skill: ${skill} (${content.length} chars)`);
}
console.log('');

// ─── Main pipeline ───

async function main() {
  // ── Step 1: Generate course skeleton ──
  console.log('[Step 1/6] Designing course skeleton via Moonshot...');

  const modules = await generateCourseSkeleton({
    title,
    domain,
    variation,
    level,
    description: flags.description,
    moduleCount,
    lessonsPerModule: lessonsPerModule + 1, // +1 for checkpoint
  });

  console.log(`  ✓ ${modules.length} modules planned:`);
  for (const mod of modules) {
    console.log(`    ${mod.title} (${mod.lessonTitles.length} lessons)`);
  }

  if (dryRun) {
    console.log('\n[DRY RUN] Stopping here. Remove --dry-run to generate content.');
    process.exit(0);
  }

  // ── Step 2: Research per module ──
  console.log('\n[Step 2/6] Researching via Tavily...');

  const researchByModule: Record<string, string> = {};
  for (const mod of modules) {
    // 2 searches per module (from skill file: "minimum 2 searches per concept")
    const search1 = await tavilySearch(`${mod.title} ${variation} ${level === 'beginner' ? 'introduction' : 'advanced'} tutorial`);
    const search2 = await tavilySearch(`${mod.title} ${variation} examples best practices`);

    researchByModule[mod.id] = [
      ...search1.results.slice(0, 3),
      ...search2.results.slice(0, 2),
    ].map(r => `- ${r.title}: ${r.content?.slice(0, 200)} (${r.url})`).join('\n');

    console.log(`  ✓ ${mod.title}: ${search1.results.length + search2.results.length} results`);
    await sleep(300); // Rate limit courtesy
  }

  // ── Step 3: Generate lessons per module ──
  console.log('\n[Step 3/6] Generating lesson content via Moonshot...');

  mkdirSync(courseDir, { recursive: true });

  const moduleExports: Array<{ varName: string; fileName: string }> = [];
  let previousSummary = 'First module in course';

  for (let mi = 0; mi < modules.length; mi++) {
    const mod = modules[mi];
    const moduleNum = String(mi + 1).padStart(2, '0');
    const moduleVarName = mod.id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) + 'Module';

    console.log(`\n  Module ${mi + 1}/${modules.length}: ${mod.title}`);

    const lessons: string[] = [];

    for (let li = 0; li < mod.lessonTitles.length; li++) {
      const lessonTitle = mod.lessonTitles[li];
      const isCheckpoint = lessonTitle.toLowerCase().includes('checkpoint') ||
                           li === mod.lessonTitles.length - 1;

      console.log(`    ${li + 1}. ${lessonTitle}${isCheckpoint ? ' [checkpoint]' : ''}`);

      const lesson = await generateLesson({
        courseId: slug,
        courseTitle: title,
        domain,
        variation,
        level,
        moduleId: mod.id,
        moduleTitle: mod.title,
        moduleIndex: mi,
        lessonTitle,
        lessonIndex: li,
        isCheckpoint,
        previousSummary,
        voicePersona: persona,
        researchResults: researchByModule[mod.id] || '',
      });

      // Escape template literals in content
      const escapeForTemplate = (s: string) =>
        s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

      const contentEscaped = escapeForTemplate(lesson.content);
      const starterEscaped = lesson.starterCode ? escapeForTemplate(lesson.starterCode) : null;
      const solutionEscaped = lesson.solutionCode ? escapeForTemplate(lesson.solutionCode) : null;

      lessons.push(`    {
      id: '${lesson.id}',
      slug: '${lesson.slug}',
      title: '${lesson.title.replace(/'/g, "\\'")}',
      content: \`${contentEscaped}\`,${
        starterEscaped ? `\n      starterCode: \`${starterEscaped}\`,` : ''
      }${
        solutionEscaped ? `\n      solutionCode: \`${solutionEscaped}\`,` : ''
      }
    }`);

      await sleep(500); // Rate limit
    }

    previousSummary = mod.lessonTitles.slice(0, -1).join(', ');

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
    moduleExports.push({ varName: moduleVarName, fileName: `${moduleNum}-${mod.id}` });
    console.log(`    ✓ Saved: ${moduleNum}-${mod.id}.ts`);
  }

  // ── Step 4: Write course index ──
  console.log('\n[Step 4/6] Writing course index...');

  const imports = moduleExports.map(
    m => `import { ${m.varName} } from './${m.fileName}';`
  ).join('\n');

  const moduleList = moduleExports.map(m => `    ${m.varName},`).join('\n');

  const indexCode = `import { Course } from '../types';
${imports}

export const ${courseName}: Course = {
  id: '${slug}',
  slug: '${slug}',
  title: '${title.replace(/'/g, "\\'")}',
  description: '${(flags.description || `Comprehensive ${level} course covering ${variation.replace(/-/g, ' ')} with AI coaching and interactive content.`).replace(/'/g, "\\'")}',
  icon: '${icon}',
  tier: '${tier}' as const,
  featured: true,
  domain: '${domain}',
  variation: '${variation}',
  level: '${level}' as 'beginner' | 'advanced',
  modules: [
${moduleList}
  ],
};
`;

  writeFileSync(resolve(courseDir, 'index.ts'), indexCode);
  console.log(`  ✓ Saved: index.ts (${courseName})`);

  // ── Step 5: Quality review ──
  if (!skipReview) {
    console.log('\n[Step 5/6] Quality review via Moonshot...');

    const firstModuleFile = readFileSync(
      resolve(courseDir, `${moduleExports[0].fileName}.ts`), 'utf-8'
    );
    const review = await reviewModule(firstModuleFile, domain, title);

    if (review.passed) {
      console.log(`  ✓ PASSED (score: ${review.scores?.overall || '?'}/10)`);
    } else {
      console.log('  ⚠ Issues found:');
      review.issues?.forEach(i => console.log(`    - ${i}`));
      review.suggestions?.forEach(s => console.log(`    + ${s}`));
    }
  } else {
    console.log('\n[Step 5/6] Skipped (--skip-review)');
  }

  // ── Step 6: Register in index.ts ──
  if (!skipRegister) {
    console.log('\n[Step 6/6] Registering in src/data/index.ts...');

    let indexContent = readFileSync(indexPath, 'utf-8');

    // Check if already registered
    if (indexContent.includes(courseName)) {
      console.log(`  ⚠ Already registered: ${courseName}`);
    } else {
      // Add import before "export const courses"
      const importLine = `import { ${courseName} } from './${slug}';`;
      indexContent = indexContent.replace(
        'export const courses: Course[] = [',
        `${importLine}\n\nexport const courses: Course[] = [`
      );

      // Add to array before closing ];
      indexContent = indexContent.replace(/\n\];/, `\n  ${courseName},\n];`);

      writeFileSync(indexPath, indexContent);
      console.log(`  ✓ Registered: ${courseName}`);
    }
  } else {
    console.log('\n[Step 6/6] Skipped (--skip-register)');
  }

  // ── Summary ──
  const totalLessons = modules.reduce((s, m) => s + m.lessonTitles.length, 0);
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Course Generation Complete                                ║
╠════════════════════════════════════════════════════════════╣
║  Title:    ${title.padEnd(46)}║
║  Modules:  ${String(modules.length).padEnd(46)}║
║  Lessons:  ${String(totalLessons).padEnd(46)}║
║  Output:   src/data/${slug}/`.padEnd(58) + `║
║  Variable: ${courseName.padEnd(46)}║
╚════════════════════════════════════════════════════════════╝

Next: npm run build  (verify no TypeScript errors)
`);
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

main().catch(err => {
  console.error('\n[FATAL]', err.message || err);
  process.exit(1);
});
