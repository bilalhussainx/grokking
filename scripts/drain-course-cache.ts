/**
 * drain-course-cache.ts — assemble cached lessons for a course onto disk.
 *
 * Reads .research/plan-<slug>.json + .research/cache/<slug>/<mi>-<li>.json
 * Writes src/data/<slug>/NN-<fileName>.ts + index.ts
 * Modules with all lessons cached get real content; modules with any missing
 * lesson fall back to "coming soon" for their missing lessons only.
 *
 * Usage: npx tsx scripts/drain-course-cache.ts <slug>
 */
import * as fs from "node:fs/promises";
import * as path from "node:path";

const slug = process.argv[2];
if (!slug) { console.error("usage: drain-course-cache.ts <slug>"); process.exit(1); }

const PLAN_PATH = `.research/plan-${slug}.json`;
const CACHE_DIR = `.research/cache/${slug}`;
const DATA_DIR = `src/data/${slug}`;

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

interface PlanLesson { id: string; title: string; description?: string; hasCode?: boolean; codeLanguage?: string; }
interface PlanModule { id: string; title: string; description: string; exportName: string; fileName: string; lessons: PlanLesson[]; }
interface Plan { meta: Record<string, any>; modules: PlanModule[]; researchSummary?: string; }
interface Lesson { id: string; slug: string; title: string; content: string; starterCode?: string; solutionCode?: string; }

function lessonToTs(l: Lesson): string {
  const out = [
    `    {`,
    `      id: ${JSON.stringify(l.id)},`,
    `      slug: ${JSON.stringify(l.slug)},`,
    `      title: ${JSON.stringify(l.title)},`,
    `      content: \`${esc(l.content)}\`,`,
  ];
  if (l.starterCode) out.push(`      starterCode: \`${esc(l.starterCode)}\`,`);
  if (l.solutionCode) out.push(`      solutionCode: \`${esc(l.solutionCode)}\`,`);
  out.push(`    },`);
  return out.join("\n");
}

function moduleFile(m: PlanModule, lessons: Lesson[]): string {
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

function comingSoon(pl: PlanLesson, moduleTitle: string): Lesson {
  const content = `# ${pl.title}

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **${moduleTitle}**." }
\\\`\\\`\\\`

## What you'll learn here

${pl.description || "This lesson extends the foundations you've built so far with more advanced material."}

## Preview of topics

- The core ideas that make **${pl.title}** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`;
  return { id: pl.id, slug: pl.id, title: pl.title, content };
}

async function main() {
  const plan: Plan = JSON.parse(await fs.readFile(PLAN_PATH, "utf8"));
  console.log(`[${slug}] plan: ${plan.modules.length} modules`);

  // Wipe existing numbered files (they may be from an older plan)
  try {
    const existing = await fs.readdir(DATA_DIR);
    for (const f of existing) {
      if (/^\d+.*\.ts$/.test(f) || f === "index.ts") {
        await fs.unlink(path.join(DATA_DIR, f));
      }
    }
  } catch {}
  await fs.mkdir(DATA_DIR, { recursive: true });

  let fullModules = 0, partialModules = 0, placeholderModules = 0;

  for (let mi = 0; mi < plan.modules.length; mi++) {
    const m = plan.modules[mi];
    const lessons: Lesson[] = [];
    let cached = 0;

    for (let li = 0; li < m.lessons.length; li++) {
      const pl = m.lessons[li];
      const cp = path.join(CACHE_DIR, `${String(mi).padStart(2, "0")}-${String(li).padStart(2, "0")}.json`);
      try {
        const cl = JSON.parse(await fs.readFile(cp, "utf8")) as Lesson;
        // Guard against placeholder/error stubs
        if (cl.content && cl.content.length > 500 && !/Content generation failed/i.test(cl.content)) {
          lessons.push(cl);
          cached++;
          continue;
        }
      } catch {}
      lessons.push(comingSoon(pl, m.title));
    }

    if (cached === m.lessons.length) fullModules++;
    else if (cached === 0) placeholderModules++;
    else partialModules++;

    const fp = path.join(DATA_DIR, m.fileName);
    await fs.writeFile(fp, moduleFile(m, lessons));
    const tag = cached === m.lessons.length ? "✓" : cached === 0 ? "◷" : "◐";
    console.log(`  ${tag} ${m.fileName} (${cached}/${m.lessons.length} cached)`);
  }

  // index.ts
  const imports = plan.modules.map((m) => `import { ${m.exportName} } from "./${m.fileName.replace(/\.ts$/, "")}";`).join("\n");
  const moduleList = plan.modules.map((m) => `    ${m.exportName},`).join("\n");
  const meta = plan.meta;
  // Derive course const name
  const courseConst = (meta.slug || slug).replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase()) + "Course";
  const indexTs = `import { Course } from "../types";
${imports}

export const ${courseConst}: Course = {
  id: ${JSON.stringify(meta.id || slug)},
  slug: ${JSON.stringify(meta.slug || slug)},
  title: ${JSON.stringify(meta.title)},
  description: ${JSON.stringify(meta.description)},
  icon: ${JSON.stringify(meta.icon || "\\u{1F4DA}")},
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
  console.log(`  ✓ index.ts`);
  console.log(`\n[${slug}] full=${fullModules}  partial=${partialModules}  coming-soon=${placeholderModules}  (of ${plan.modules.length})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
