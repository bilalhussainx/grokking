/**
 * rebuild-course.ts — Full course rebuild from scratch using Claude + Tavily.
 *
 * Two-phase pipeline:
 *   Phase 1 — Course Planning: Research topic via Tavily, Claude designs optimal
 *             module/lesson structure (new modules, new lessons, proper coverage)
 *   Phase 2 — Lesson Generation: For each lesson in the plan, Tavily research +
 *             Claude writes rich interactive content from scratch
 *
 * Output: Replaces entire src/data/<course>/ directory with new files.
 *
 * Usage:
 *   npx tsx scripts/rebuild-course.ts coding-interview
 *   npx tsx scripts/rebuild-course.ts python-fundamentals --dry-run
 *   npx tsx scripts/rebuild-course.ts react-development --plan-only
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { spawn } from "node:child_process";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TAVILY_ENDPOINT = "https://api.tavily.com/search";
const GEMINI_MODEL = "gemini-2.5-flash";

// ---------- Rich block schema (same as migrate-lesson.ts) ----------

const RICH_BLOCK_SCHEMA = `
SUPPORTED FENCED BLOCKS (use fenced code blocks with these languages — the platform
renders them as React components). Each block's body must be VALID JSON:

\`\`\`concept
{ "title": "...", "variant": "mental-model"|"analogy"|"rule"|"insight", "content": "..." }
\`\`\`

\`\`\`callout
{ "type": "tip"|"warning"|"info"|"danger"|"success", "title": "...", "content": "..." }
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "...", "icon": "emoji?", "content": "markdown string" }, ... ] }
\`\`\`

\`\`\`quiz
{ "title": "...", "questions": [ { "question": "...", "options": ["a","b","c","d"], "answer": 2, "explanation": "..." } ] }
\`\`\`

\`\`\`steps
{ "title": "...", "steps": [ { "title": "...", "content": "markdown string" }, ... ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["point 1", "point 2", "point 3"] }
\`\`\`

\`\`\`compare
{ "variant": "before-after"|"good-bad", "before": { "label": "...", "code": "..." }, "after": { "label": "...", "code": "..." } }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: ...", "content": "markdown string" }
\`\`\`

\`\`\`playground
{ "title": "...", "language": "python"|"javascript"|"typescript", "code": "...", "runnable": true }
\`\`\`

\`\`\`algoviz
{ "title": "...", "type": "array"|"grid"|"tree"|"linkedlist", "data": [...],
  "frames": [ { "highlight": [0,1], "label": "step description", "stats": {"i":0,"j":1} } ],
  "speed": 800 }
\`\`\`

\`\`\`trace
{ "title": "...", "language": "python", "code": "multiline code",
  "frames": [ { "line": 1, "vars": {"x":0}, "note": "...", "stdout": "..." } ], "speed": 800 }
\`\`\`

\`\`\`calculator
{ "type": "compound-interest"|"loan"|"retirement"|"npv", "title": "...",
  "inputs": [ { "id": "p", "label": "Principal", "default": 10000, "min": 0, "max": 100000, "prefix": "$" } ] }
\`\`\`

\`\`\`fillblank
{ "title": "...", "prompt": "...", "language": "python", "template": "def f(x):\\n    return ___ + ___",
  "blanks": [ { "answer": "x", "hint": "..." }, { "answer": "1" } ] }
\`\`\`

\`\`\`sysdiag
{ "title": "...", "width": 600, "height": 360,
  "nodes": [ { "id":"api", "label":"API", "x":200, "y":180, "kind":"service" } ],
  "edges": [ { "from":"api", "to":"db", "label":"writes" } ],
  "annotations": { "api": "Explanation of role and responsibilities" } }
\`\`\`

Also supported: standard markdown, GitHub-flavored tables, and \`\`\`mermaid diagrams.
`;

// ---------- Types ----------

interface CourseMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  tier: "free" | "pro";
  domain?: string;
  variation?: string;
  level?: string;
  featured?: boolean;
}

interface LessonPlan {
  id: string;
  title: string;
  description: string;
  hasCode: boolean; // whether lesson should have starterCode/solutionCode
  codeLanguage?: string;
}

interface ModulePlan {
  id: string;
  title: string;
  description: string;
  exportName: string;
  fileName: string; // e.g., "01-two-pointers.ts"
  lessons: LessonPlan[];
}

interface CoursePlan {
  meta: CourseMeta;
  modules: ModulePlan[];
  researchSummary: string;
}

interface GeneratedLesson {
  id: string;
  slug: string;
  title: string;
  content: string;
  starterCode?: string;
  solutionCode?: string;
}

// ---------- Research ----------

async function tavilySearch(query: string): Promise<{ brief: string; citations: { url: string; title?: string }[] }> {
  if (!TAVILY_API_KEY) throw new Error("TAVILY_API_KEY missing");
  const resp = await fetch(TAVILY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: "advanced",
      include_answer: true,
      max_results: 6,
      include_raw_content: false,
    }),
  });
  if (!resp.ok) throw new Error(`Tavily: ${resp.status} ${await resp.text()}`);
  const data: any = await resp.json();
  const answer: string = data.answer || "";
  const results: any[] = data.results || [];
  const snippets = results.map((r, i) => `[${i + 1}] ${r.title}\n${r.content}`).join("\n\n");
  const brief = (answer ? `**Synthesized answer:**\n${answer}\n\n` : "") + `**Source snippets:**\n${snippets}`;
  const citations = results.map((r) => ({ url: r.url, title: r.title }));
  return { brief, citations };
}

async function geminiSearch(query: string): Promise<{ brief: string; citations: { url: string; title?: string }[] }> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `Research: "${query}". Return: canonical definition, 3-5 key facts, common misconceptions, real-world use case. Ground in search results.` }] }],
      tools: [{ google_search: {} }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1500 },
    }),
  });
  if (!resp.ok) throw new Error(`Gemini: ${resp.status}`);
  const data: any = await resp.json();
  const brief = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") || "";
  const chunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const citations = chunks.map((c: any) => ({ url: c.web?.uri || "", title: c.web?.title || "" })).filter((c: any) => c.url);
  return { brief, citations };
}

// Research mode: "tavily" (use Tavily primary, Gemini fallback),
// "gemini" (Gemini only, save Tavily credits)
type ResearchMode = "tavily" | "gemini";

async function geminiSearchRetry(query: string, attempts = 6): Promise<{ brief: string; citations: { url: string; title?: string }[] }> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try { return await geminiSearch(query); }
    catch (e: any) {
      lastErr = e;
      const msg = String(e.message || "");
      const cause = String(e?.cause?.code || e?.cause?.message || "");
      const transient =
        /Gemini: 5\d\d/.test(msg) ||
        /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|socket hang up|network/i.test(msg + " " + cause);
      if (transient && i < attempts - 1) {
        const wait = Math.min(30_000, 2000 * Math.pow(2, i));
        console.log(`    (gemini: ${msg}${cause ? ` [${cause}]` : ""} — retrying in ${wait}ms)`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

async function research(query: string, mode: ResearchMode = "tavily"): Promise<{ brief: string; citations: { url: string; title?: string }[] }> {
  if (mode === "gemini") return geminiSearchRetry(query);
  try { return await tavilySearch(query); }
  catch (e: any) { console.log(`    (tavily: ${e.message} — using gemini)`); return await geminiSearchRetry(query); }
}

// Only top-5 most popular courses get Tavily for lesson research.
// All other courses use Gemini for lessons (saves ~400 Tavily credits).
// ALL courses get 1 Tavily search for planning phase.
const HIGH_PRIORITY_COURSES = new Set([
  "coding-interview",
  "system-design",
  "python-fundamentals",
  "data-structures-algorithms",
  "react-development",
]);

// ---------- Claude CLI ----------

function claudeCLI(prompt: string, timeoutMs = 8 * 60 * 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === "win32";
    const child = spawn("claude", ["-p", "--output-format", "text", "--model", "sonnet"], {
      stdio: ["pipe", "pipe", "pipe"],
      shell: isWin,
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => { child.kill(); reject(new Error("Claude CLI timeout")); }, timeoutMs);
    child.stdout.on("data", (c) => (stdout += c.toString()));
    child.stderr.on("data", (c) => (stderr += c.toString()));
    child.on("error", (e) => { clearTimeout(timer); reject(e); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) { reject(new Error(`Claude exit ${code}: ${stderr.trim() || stdout.trim()}`)); return; }
      if (!stdout.trim()) { reject(new Error(`Claude empty output. stderr: ${stderr.trim()}`)); return; }
      resolve(stdout.trim());
    });
    child.stdin.write(prompt);
    child.stdin.end();
  });
}

// ---------- Phase 1: Course Planning ----------

async function planCourse(slug: string, meta: CourseMeta): Promise<CoursePlan> {
  console.log("\n=== Phase 1: Course Planning ===");
  const isHighPriority = HIGH_PRIORITY_COURSES.has(slug);
  const planMode: ResearchMode = "tavily"; // always use tavily for planning (1 search)

  // Research the topic — 1 Tavily search for planning (all courses get this)
  console.log(`  researching topic (tavily)...`);
  const r1 = await research(`${meta.title} comprehensive curriculum syllabus structure topics learning path`, planMode);
  let researchSummary = `SEARCH 1:\n${r1.brief}`;
  let totalCitations = r1.citations.length;

  // High-priority courses get a second search
  if (isHighPriority) {
    console.log(`  second search (high-priority course)...`);
    const r2 = await research(`${meta.title} best practices interview questions LinkedIn assessment`, planMode);
    researchSummary += `\n\nSEARCH 2:\n${r2.brief}`;
    totalCitations += r2.citations.length;
  }
  console.log(`  got research (${researchSummary.length} chars, ${totalCitations} citations)`);

  // Ask Claude to design the course structure
  console.log("  designing course structure via Claude...");
  const planPrompt = `You are designing a comprehensive online course for Samsara.ai (an Educative.io-level platform).

COURSE METADATA:
- Title: ${meta.title}
- Description: ${meta.description}
- Level: ${meta.level || "intermediate"}
- Domain: ${meta.domain || "general"}
- Tier: ${meta.tier}

RESEARCH ON WHAT THIS COURSE SHOULD COVER:
${researchSummary}

YOUR TASK: Design the optimal course structure. Output ONLY valid JSON (no markdown, no preamble).

RULES:
- Each module should have 5-8 lessons (not fewer, not more than 8)
- Design 6-12 modules depending on the topic breadth
- For CS/coding courses: include starterCode/solutionCode exercises (hasCode: true)
- For non-coding courses: set hasCode: false
- Each module needs a clear learning objective
- Lessons should progress from concept introduction → examples → practice → mastery
- Include at least one "checkpoint" or "practice" lesson per module
- Module IDs and lesson IDs must be kebab-case
- Export names must be valid JS identifiers in camelCase + "Module" suffix
- File names must be numbered: "01-module-name.ts", "02-module-name.ts", etc.
- The course must be COMPREHENSIVE — a student completing it should be able to pass
  a LinkedIn skill assessment or job interview on this topic

OUTPUT FORMAT (JSON only):
{
  "modules": [
    {
      "id": "module-id",
      "title": "Module Title",
      "description": "What the student will learn",
      "exportName": "moduleIdModule",
      "fileName": "01-module-id.ts",
      "lessons": [
        {
          "id": "lesson-id",
          "title": "Lesson Title",
          "description": "Brief description of what this lesson covers",
          "hasCode": true,
          "codeLanguage": "python"
        }
      ]
    }
  ]
}`;

  const raw = await claudeCLI(planPrompt);

  // Extract JSON from response (Claude might wrap in code block)
  let jsonStr = raw;
  const jsonMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1];
  // Also try raw if it starts with {
  if (!jsonStr.trim().startsWith("{")) {
    const braceStart = jsonStr.indexOf("{");
    if (braceStart >= 0) jsonStr = jsonStr.slice(braceStart);
  }

  let plan: any;
  try {
    plan = JSON.parse(jsonStr.trim());
  } catch (e: any) {
    throw new Error(`Failed to parse course plan JSON: ${e.message}\nRaw output:\n${raw.slice(0, 500)}`);
  }

  const modules: ModulePlan[] = plan.modules;
  console.log(`  planned ${modules.length} modules, ${modules.reduce((s, m) => s + m.lessons.length, 0)} lessons total`);

  return { meta, modules, researchSummary };
}

// ---------- Phase 2: Lesson Generation ----------

async function generateLesson(
  lesson: LessonPlan,
  moduleContext: string,
  courseContext: string,
  lessonResearchMode: ResearchMode = "tavily",
): Promise<GeneratedLesson> {
  // Research this specific lesson topic
  const { brief, citations } = await research(`${lesson.title} ${courseContext}`, lessonResearchMode);
  const citationsStr = citations.map((c, i) => `[${i + 1}] ${c.title || c.url}`).join("\n");

  const prompt = `You are writing a lesson from scratch for Samsara.ai's interactive learning platform.

${RICH_BLOCK_SCHEMA}

CRITICAL RULES:
- Output markdown content ONLY. No TypeScript, no wrapping, no preamble.
- Inside fenced JSON blocks, use double quotes and escape newlines as \\n. No trailing commas.
- Never use template-literal interpolation \${...} — always escape as \\\${...}.
- Target density: 4-6 interactive blocks per lesson + strong prose.
- Every \`\`\`quiz block MUST have at least 3 questions.
- Every factual claim must come from the research brief. No fabricated citations.
- Write at Educative.io quality: visual, progressive, active. NOT a wall of text.
- The lesson should take 10-15 minutes to complete.
${lesson.hasCode ? `- This is a CODING lesson. Include \`\`\`playground blocks with runnable examples.
- Include \`\`\`algoviz or \`\`\`trace blocks showing algorithm execution.
- Include \`\`\`fillblank blocks for practice.` : `- This is a CONCEPTUAL lesson. Use \`\`\`concept, \`\`\`tabs, \`\`\`steps, \`\`\`compare blocks.
- Include real-world examples and case studies.`}

COURSE: ${courseContext}
MODULE: ${moduleContext}
LESSON: ${lesson.title} — ${lesson.description}

RESEARCH BRIEF:
${brief}

CITATIONS:
${citationsStr || "(none)"}

Write the complete lesson content now. Output ONLY the markdown body.`;

  const content = await claudeCLI(prompt);

  let result: GeneratedLesson = {
    id: lesson.id,
    slug: lesson.id,
    title: lesson.title,
    content,
  };

  // For coding lessons, also generate starter/solution code
  if (lesson.hasCode) {
    const codePrompt = `Generate a coding exercise for this lesson.

LESSON: ${lesson.title} — ${lesson.description}
LANGUAGE: ${lesson.codeLanguage || "python"}

Output ONLY valid JSON with two fields:
{
  "starterCode": "// starter code with TODO comments\\n...",
  "solutionCode": "// complete solution\\n..."
}

The exercise should:
- Be solvable in 5-15 minutes
- Test the core concept taught in the lesson
- Have clear TODO comments in the starter code
- Have a clean, well-commented solution
- Use ${lesson.codeLanguage || "python"} syntax`;

    try {
      const codeRaw = await claudeCLI(codePrompt, 3 * 60 * 1000);
      let codeJson = codeRaw;
      const codeMatch = codeRaw.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
      if (codeMatch) codeJson = codeMatch[1];
      if (!codeJson.trim().startsWith("{")) {
        const idx = codeJson.indexOf("{");
        if (idx >= 0) codeJson = codeJson.slice(idx);
      }
      const parsed = JSON.parse(codeJson.trim());
      if (parsed.starterCode) result.starterCode = parsed.starterCode;
      if (parsed.solutionCode) result.solutionCode = parsed.solutionCode;
    } catch (e: any) {
      console.log(`    (code gen failed: ${e.message} — lesson will have no exercise)`);
    }
  }

  return result;
}

// ---------- Validation ----------

function validateContent(content: string): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const unescaped = /(^|[^\\])\$\{/g;
  if ([...content.matchAll(unescaped)].length > 0) {
    errors.push("Unescaped ${} found");
  }
  const interactive = new Set(["concept","callout","tabs","quiz","steps","takeaways","compare","collapse","playground","algoviz","trace","calculator","fillblank","sysdiag"]);
  const fence = /^(`{3,})([\w-]+)\s*\n([\s\S]*?)^\1\s*$/gm;
  for (const m of content.matchAll(fence)) {
    if (!interactive.has(m[2])) continue;
    try { JSON.parse(m[3].trim()); }
    catch (e: any) { errors.push(`Invalid JSON in \`\`\`${m[2]}: ${e.message}`); }
  }
  return { ok: errors.length === 0, errors };
}

// ---------- Serialization ----------

function toTemplateLiteral(s: string): string {
  return "`" + s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function serializeModule(exportName: string, mod: { id: string; title: string; description: string; lessons: GeneratedLesson[] }): string {
  const lessonsStr = mod.lessons.map((l) => {
    const lines = [
      `    {`,
      `      id: ${JSON.stringify(l.id)},`,
      `      slug: ${JSON.stringify(l.slug)},`,
      `      title: ${JSON.stringify(l.title)},`,
      `      content: ${toTemplateLiteral(l.content)},`,
    ];
    if (l.starterCode) lines.push(`      starterCode: ${toTemplateLiteral(l.starterCode)},`);
    if (l.solutionCode) lines.push(`      solutionCode: ${toTemplateLiteral(l.solutionCode)},`);
    lines.push(`    }`);
    return lines.join("\n");
  }).join(",\n");

  return `import { Module } from "../types";

export const ${exportName}: Module = {
  id: ${JSON.stringify(mod.id)},
  title: ${JSON.stringify(mod.title)},
  description: ${JSON.stringify(mod.description)},
  lessons: [
${lessonsStr},
  ],
};
`;
}

function serializeIndex(meta: CourseMeta, modules: ModulePlan[], courseExportName: string): string {
  const imports = modules.map(m => `import { ${m.exportName} } from "./${m.fileName.replace('.ts', '')}";`).join("\n");
  const moduleList = modules.map(m => `    ${m.exportName},`).join("\n");

  return `import { Course } from "../types";
${imports}

export const ${courseExportName}: Course = {
  id: ${JSON.stringify(meta.id)},
  slug: ${JSON.stringify(meta.slug)},
  title: ${JSON.stringify(meta.title)},
  description: ${JSON.stringify(meta.description)},
  icon: ${JSON.stringify(meta.icon)},
  tier: ${JSON.stringify(meta.tier)},
${meta.domain ? `  domain: ${JSON.stringify(meta.domain)},\n` : ""}${meta.variation ? `  variation: ${JSON.stringify(meta.variation)},\n` : ""}${meta.level ? `  level: ${JSON.stringify(meta.level)},\n` : ""}${meta.featured ? `  featured: true,\n` : ""}  modules: [
${moduleList}
  ],
};
`;
}

// ---------- Load existing course meta ----------

async function loadCourseMeta(slug: string): Promise<{ meta: CourseMeta; exportName: string }> {
  const indexPath = path.join("src", "data", slug, "index.ts");
  const content = await fs.readFile(indexPath, "utf-8");

  const exportMatch = content.match(/export const (\w+): Course/);
  const exportName = exportMatch?.[1] || slug.replace(/-(\w)/g, (_, c) => c.toUpperCase()) + "Course";

  const field = (name: string) => {
    const m = content.match(new RegExp(`${name}:\\s*["'\`]([^"'\`]*)["'\`]`));
    return m?.[1] || "";
  };
  const boolField = (name: string) => content.includes(`${name}: true`);

  return {
    exportName,
    meta: {
      id: field("id") || slug,
      slug: field("slug") || slug,
      title: field("title") || slug,
      description: field("description") || "",
      icon: field("icon") || "📚",
      tier: (field("tier") as "free" | "pro") || "free",
      domain: field("domain") || undefined,
      variation: field("variation") || undefined,
      level: field("level") || undefined,
      featured: boolField("featured") || undefined,
    },
  };
}

// ---------- Main ----------

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find(a => !a.startsWith("--"));
  const dryRun = args.includes("--dry-run");
  const planOnly = args.includes("--plan-only");

  if (!slug) {
    console.error("Usage: npx tsx scripts/rebuild-course.ts <course-slug> [--dry-run] [--plan-only]");
    process.exit(1);
  }

  const courseDir = path.join("src", "data", slug);
  try { await fs.access(courseDir); } catch {
    console.error(`Course directory not found: ${courseDir}`);
    process.exit(1);
  }

  const { meta, exportName: courseExportName } = await loadCourseMeta(slug);
  console.log(`\n━━━ Rebuilding: ${meta.title} (${slug}) ━━━`);
  console.log(`  Level: ${meta.level || "unset"}, Tier: ${meta.tier}, Domain: ${meta.domain || "unset"}`);

  // Phase 1: Plan (load from cache if a prior run already produced one)
  const planPath = path.join(".research", `plan-${slug}.json`);
  await fs.mkdir(".research", { recursive: true });
  let plan: CoursePlan;
  try {
    plan = JSON.parse(await fs.readFile(planPath, "utf8"));
    console.log(`  loaded cached plan (${plan.modules.length} modules) from ${planPath}`);
  } catch {
    plan = await planCourse(slug, meta);
    await fs.writeFile(planPath, JSON.stringify(plan, null, 2));
    console.log(`  plan saved to ${planPath}`);
  }

  if (planOnly) {
    console.log("\n  --plan-only: stopping after planning phase");
    for (const m of plan.modules) {
      console.log(`  ${m.fileName}: ${m.title} (${m.lessons.length} lessons)`);
      for (const l of m.lessons) {
        console.log(`    - ${l.title}${l.hasCode ? " [code]" : ""}`);
      }
    }
    return;
  }

  // Phase 2: Generate each lesson
  console.log("\n=== Phase 2: Lesson Generation ===");
  const isHighPriority = HIGH_PRIORITY_COURSES.has(slug);
  const lessonMode: ResearchMode = isHighPriority ? "tavily" : "gemini";
  console.log(`  research mode: ${isHighPriority ? "tavily (high-priority)" : "gemini (save tavily credits)"}`);
  const courseContext = `${meta.title} — ${meta.description}`;
  const generatedModules: { plan: ModulePlan; lessons: GeneratedLesson[] }[] = [];

  // Per-lesson disk cache so quota-kill/restart doesn't lose work
  const cacheDir = path.join(".research", "cache", slug);
  await fs.mkdir(cacheDir, { recursive: true });
  const cachePath = (mi: number, li: number) => path.join(cacheDir, `${String(mi).padStart(2, "0")}-${String(li).padStart(2, "0")}.json`);

  for (let mi = 0; mi < plan.modules.length; mi++) {
    const mod = plan.modules[mi];
    console.log(`\n[Module ${mi + 1}/${plan.modules.length}] ${mod.title} (${mod.lessons.length} lessons)`);
    const lessons: GeneratedLesson[] = [];

    for (let li = 0; li < mod.lessons.length; li++) {
      const lp = mod.lessons[li];
      console.log(`  [${li + 1}/${mod.lessons.length}] ${lp.title}`);

      // Cache check: if this lesson was generated in a prior run, reuse it
      const cp = cachePath(mi, li);
      try {
        const cached = JSON.parse(await fs.readFile(cp, "utf8"));
        if (cached && cached.content && cached.id === lp.id) {
          lessons.push(cached);
          console.log(`    ✓ cached (${cached.content.length} chars)`);
          continue;
        }
      } catch { /* no cache, generate */ }

      if (dryRun) {
        console.log(`    (dry-run — skipped)`);
        lessons.push({ id: lp.id, slug: lp.id, title: lp.title, content: "DRY RUN" });
        continue;
      }

      const MAX_ATTEMPTS = 3;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          console.log(`    researching + writing (attempt ${attempt})...`);
          const gen = await generateLesson(lp, `${mod.title}: ${mod.description}`, courseContext, lessonMode);
          const report = validateContent(gen.content);
          if (!report.ok) {
            console.log(`    validation failed: ${report.errors.join(", ")}`);
            if (attempt === MAX_ATTEMPTS) {
              console.log(`    ✗ giving up after ${MAX_ATTEMPTS} attempts`);
              lessons.push(gen);
              await fs.writeFile(cp, JSON.stringify(gen));
              break;
            }
            continue;
          }
          lessons.push(gen);
          await fs.writeFile(cp, JSON.stringify(gen));
          console.log(`    ✓ ${gen.content.length} chars${gen.starterCode ? " + exercise" : ""}`);
          break;
        } catch (e: any) {
          console.log(`    error: ${e.message}`);
          // Propagate quota errors so the outer driver can sleep+retry the whole course
          if (/out of extra usage|resets \d+(am|pm)/i.test(e.message)) throw e;
          if (attempt === MAX_ATTEMPTS) {
            console.log(`    ✗ fatal — adding placeholder`);
            const placeholder = { id: lp.id, slug: lp.id, title: lp.title, content: `## ${lp.title}\n\nContent generation failed. Please retry.` };
            lessons.push(placeholder);
            // Intentionally do NOT cache placeholders — a retry should regenerate.
          }
        }
      }
    }

    generatedModules.push({ plan: mod, lessons });
  }

  // Phase 3: Write files
  console.log("\n=== Phase 3: Writing Files ===");

  // Backup old files
  const backupDir = path.join(".research", "backup", slug);
  await fs.mkdir(backupDir, { recursive: true });
  const oldFiles = await fs.readdir(courseDir);
  for (const f of oldFiles) {
    if (f === "index.ts" || f.endsWith(".ts")) {
      await fs.copyFile(path.join(courseDir, f), path.join(backupDir, f));
    }
  }
  console.log(`  backed up ${oldFiles.length} files to ${backupDir}`);

  // Remove old module files (keep index.ts for now)
  for (const f of oldFiles) {
    if (/^\d+.*\.ts$/.test(f)) {
      await fs.unlink(path.join(courseDir, f));
    }
  }

  // Write new module files
  for (const { plan: mod, lessons } of generatedModules) {
    const filePath = path.join(courseDir, mod.fileName);
    const content = serializeModule(mod.exportName, {
      id: mod.id,
      title: mod.title,
      description: mod.description,
      lessons,
    });
    await fs.writeFile(filePath, content);
    console.log(`  wrote ${mod.fileName} (${lessons.length} lessons)`);
  }

  // Write new index.ts
  const indexContent = serializeIndex(meta, plan.modules, courseExportName);
  await fs.writeFile(path.join(courseDir, "index.ts"), indexContent);
  console.log(`  wrote index.ts`);

  // Verify: try to import each module
  let importOk = true;
  for (const { plan: mod } of generatedModules) {
    try {
      const abs = path.resolve(courseDir, mod.fileName);
      const { pathToFileURL } = await import("node:url");
      await import(pathToFileURL(abs).href + `?t=${Date.now()}`);
    } catch (e: any) {
      console.log(`  ✗ import failed for ${mod.fileName}: ${e.message}`);
      importOk = false;
    }
  }
  if (importOk) console.log("  ✓ all modules import cleanly");

  // Clear lesson cache + plan on successful completion
  try { await fs.rm(cacheDir, { recursive: true, force: true }); } catch { /* noop */ }
  try { await fs.rm(planPath, { force: true }); } catch { /* noop */ }

  console.log(`\n━━━ Done: ${meta.title} ━━━`);
  console.log(`  ${plan.modules.length} modules, ${plan.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons`);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
