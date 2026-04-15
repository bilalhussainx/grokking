/**
 * drain-ai-ml-cache.ts — assemble cached ai-ml-fundamentals lessons onto disk.
 *
 * - Modules 0-5: real rich-block content from .research/cache/ai-ml-fundamentals/
 * - Modules 6-10: "coming soon" placeholder lessons so they render as locked
 * - Rewrites src/data/ai-ml-fundamentals/*.ts and index.ts
 */
import * as fs from "node:fs/promises";
import * as path from "node:path";

const SLUG = "ai-ml-fundamentals";
const PLAN_PATH = `.research/plan-${SLUG}.json`;
const CACHE_DIR = `.research/cache/${SLUG}`;
const DATA_DIR = `src/data/${SLUG}`;

// Modules with full cached content
const COMPLETE_THROUGH = 5; // modules 0-5 inclusive

function tsString(s: string): string {
  // Emit as a JS string literal inside a template literal via JSON.stringify for safety,
  // then convert to a safe backtick-escaped template.
  return s
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

interface PlanLesson {
  id: string;
  title: string;
  description?: string;
  hasCode?: boolean;
  codeLanguage?: string;
}
interface PlanModule {
  id: string;
  title: string;
  description: string;
  exportName: string;
  fileName: string;
  lessons: PlanLesson[];
}
interface Plan {
  meta: Record<string, any>;
  modules: PlanModule[];
}

interface CachedLesson {
  id: string;
  slug: string;
  title: string;
  content: string;
  starterCode?: string;
  solutionCode?: string;
}

function lessonToTs(l: CachedLesson | { id: string; slug: string; title: string; content: string; starterCode?: string; solutionCode?: string }): string {
  const parts = [
    `    {`,
    `      id: ${JSON.stringify(l.id)},`,
    `      slug: ${JSON.stringify(l.slug)},`,
    `      title: ${JSON.stringify(l.title)},`,
    `      content: \`${tsString(l.content)}\`,`,
  ];
  if (l.starterCode) parts.push(`      starterCode: \`${tsString(l.starterCode)}\`,`);
  if (l.solutionCode) parts.push(`      solutionCode: \`${tsString(l.solutionCode)}\`,`);
  parts.push(`    },`);
  return parts.join("\n");
}

function moduleFile(m: PlanModule, lessons: any[]): string {
  return `import { Module } from "../types";

export const ${m.exportName}: Module = {
  id: ${JSON.stringify(m.id)},
  title: ${JSON.stringify(m.title)},
  description: ${JSON.stringify(m.description)},
  lessons: [
${lessons.map(lessonToTs).join("\n")}
  ],
};
`;
}

function comingSoonLesson(pl: PlanLesson, moduleTitle: string): CachedLesson {
  const content = `# ${pl.title}

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **${moduleTitle}**." }
\\\`\\\`\\\`

## What you'll learn here

${pl.description || "This lesson extends the foundations you've built so far with more advanced material."}

## Preview of topics

- The core ideas that make **${pl.title}** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`;
  return { id: pl.id, slug: pl.id, title: pl.title, content };
}

async function main() {
  const plan: Plan = JSON.parse(await fs.readFile(PLAN_PATH, "utf8"));
  console.log(`Plan: ${plan.modules.length} modules`);

  // Clean out the old files (they're from a stale plan)
  const existing = await fs.readdir(DATA_DIR);
  for (const f of existing) {
    if (/^\d+.*\.ts$/.test(f) || f === "index.ts") {
      await fs.unlink(path.join(DATA_DIR, f));
    }
  }

  for (let mi = 0; mi < plan.modules.length; mi++) {
    const m = plan.modules[mi];
    const lessons: CachedLesson[] = [];

    for (let li = 0; li < m.lessons.length; li++) {
      const pl = m.lessons[li];
      if (mi <= COMPLETE_THROUGH) {
        const cp = path.join(CACHE_DIR, `${String(mi).padStart(2, "0")}-${String(li).padStart(2, "0")}.json`);
        try {
          const cached = JSON.parse(await fs.readFile(cp, "utf8")) as CachedLesson;
          lessons.push(cached);
        } catch {
          console.warn(`  MISSING cache ${cp} — using coming-soon stub`);
          lessons.push(comingSoonLesson(pl, m.title));
        }
      } else {
        lessons.push(comingSoonLesson(pl, m.title));
      }
    }

    const filePath = path.join(DATA_DIR, m.fileName);
    await fs.writeFile(filePath, moduleFile(m, lessons));
    const tag = mi <= COMPLETE_THROUGH ? "✓ full" : "◷ coming-soon";
    console.log(`  ${tag} ${m.fileName} (${lessons.length} lessons)`);
  }

  // Write index.ts
  const imports = plan.modules
    .map((m) => `import { ${m.exportName} } from "./${m.fileName.replace(/\.ts$/, "")}";`)
    .join("\n");
  const moduleList = plan.modules.map((m) => `    ${m.exportName},`).join("\n");
  const meta = plan.meta;
  const indexTs = `import { Course } from "../types";
${imports}

export const aiMlFundamentalsCourse: Course = {
  id: ${JSON.stringify(meta.id)},
  slug: ${JSON.stringify(meta.slug)},
  title: ${JSON.stringify(meta.title)},
  description: ${JSON.stringify(meta.description)},
  icon: ${JSON.stringify(meta.icon)},
  tier: "pro",
  domain: ${JSON.stringify(meta.domain || "computer-science")},
  ${meta.variation ? `variation: ${JSON.stringify(meta.variation)},\n  ` : ""}level: ${JSON.stringify(meta.level || "beginner")},
  featured: true,
  modules: [
${moduleList}
  ],
};
`;
  await fs.writeFile(path.join(DATA_DIR, "index.ts"), indexTs);
  console.log(`  ✓ index.ts written`);

  console.log(`\nDone. Modules 1–${COMPLETE_THROUGH + 1} = full content. Modules ${COMPLETE_THROUGH + 2}–${plan.modules.length} = coming-soon.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
