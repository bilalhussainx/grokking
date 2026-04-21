/**
 * migrate-lesson.ts — Lane C: rewrite legacy markdown lessons into rich interactive format.
 *
 * Pipeline per lesson:
 *   1. Research phase — Gemini with google_search grounding → cited research brief
 *   2. Rewrite phase  — Moonshot (Kimi K2) rewrites content with rich-block schema + brief
 *   3. Validation     — template-literal escape check, JSON-parse check for interactive blocks
 *   4. Serialize      — reconstruct a .v2.ts file next to the original
 *
 * Usage:
 *   tsx scripts/migrate-lesson.ts src/data/coding-interview/01-two-pointers.ts
 *   tsx scripts/migrate-lesson.ts src/data/coding-interview/01-two-pointers.ts --dry-run
 *   tsx scripts/migrate-lesson.ts src/data/coding-interview/01-two-pointers.ts --only 0,1
 *
 * Environment required:
 *   GEMINI_API_KEY   — research grounding
 *   MOONSHOT_API_KEY — lesson rewrite (Kimi K2)
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

const GEMINI_MODEL = "gemini-2.5-flash";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";
const MOONSHOT_ENDPOINT = "https://api.moonshot.ai/v1/chat/completions";
const TAVILY_ENDPOINT = "https://api.tavily.com/search";

// ---------- Types ----------

interface Lesson {
  id: string;
  slug: string;
  title: string;
  content: string;
  starterCode?: string;
  solutionCode?: string;
}

interface ModuleData {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface ResearchBrief {
  brief: string;
  citations: { url: string; title?: string }[];
}

// ---------- Rich-block schema prompt ----------

const RICH_BLOCK_SCHEMA = `
You are rewriting a lesson into Samsara.ai's rich-block format. The output is TypeScript
template-literal content embedded in a .ts file. Your output must be the lesson content
ONLY — no "export const", no wrapping, no preamble, no "here is the content". Just the
markdown body.

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

CRITICAL RULES:
- Output markdown content ONLY. No TypeScript, no "content: \\\`...\\\`".
- Inside fenced JSON blocks, use double quotes and escape newlines as \\n. No trailing commas.
- Never use template-literal interpolation \${...} in code examples — always write it escaped
  as \\\${...} if you must reference it (e.g., for Python f-strings or JS template literals).
- Do NOT wrap code with nested backticks; prefer the \`\`\`playground or \`\`\`compare blocks.
- Every factual claim (big-O, history, library version) must come from the research brief
  or the reference material. If neither supports a claim, don't make it.
- Target density: 3-5 interactive blocks per lesson + strong prose. Aim for Educative.io
  quality: visual, progressive, active. NOT a wall of text.
- Every \`\`\`quiz block MUST include at least 3 questions — single-question quizzes are rejected.
- PRESERVE all \`\`\`mermaid diagrams from the original lesson unless you replace them with a
  richer block that conveys the same information (e.g., algoviz replacing a static array diagram).
- Keep the original lesson's pedagogical arc — this is a rewrite, not a replacement.
- For problem-solving lessons (with starterCode/solutionCode), ALWAYS include a \`\`\`algoviz
  or \`\`\`trace block showing the algorithm execution on a concrete example.
`;

// ---------- Research phase ----------
// Primary: Tavily (purpose-built LLM grounding, real snippets)
// Fallback: Gemini with google_search

async function researchViaTavily(query: string): Promise<ResearchBrief> {
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
  if (!resp.ok) {
    throw new Error(`Tavily failed: ${resp.status} ${await resp.text()}`);
  }
  const data: any = await resp.json();
  const answer: string = data.answer || "";
  const results: any[] = data.results || [];
  const snippets = results
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.content}`)
    .join("\n\n");
  const brief =
    (answer ? `**Synthesized answer:**\n${answer}\n\n` : "") +
    `**Source snippets:**\n${snippets}`;
  const citations = results.map((r) => ({ url: r.url, title: r.title }));
  if (citations.length === 0) throw new Error("Tavily returned no results");
  return { brief, citations };
}

async function researchViaGemini(query: string): Promise<ResearchBrief> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing — can't run research phase");
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Research this programming/CS topic and produce a concise, technically precise research brief for a lesson author. Include: (a) canonical definition, (b) 3-5 key facts or trade-offs with specifics (big-O, version numbers, real benchmarks), (c) 1-2 common misconceptions, (d) one concrete real-world use case. Ground EVERYTHING in your search results — do not invent. Topic: "${query}"`,
          },
        ],
      },
    ],
    tools: [{ google_search: {} }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 1500 },
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    throw new Error(`Gemini research failed: ${resp.status} ${await resp.text()}`);
  }
  const data: any = await resp.json();
  const brief: string =
    data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") || "";
  const groundingChunks =
    data.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const citations = groundingChunks
    .map((c: any) => ({
      url: c.web?.uri || "",
      title: c.web?.title || "",
    }))
    .filter((c: any) => c.url);
  return { brief, citations };
}

async function researchConcept(query: string): Promise<ResearchBrief> {
  // Try Tavily first; fall back to Gemini on failure
  try {
    return await researchViaTavily(query);
  } catch (e: any) {
    console.log(`    (tavily failed: ${e.message} — falling back to gemini)`);
    return await researchViaGemini(query);
  }
}

// ---------- Rewrite phase (Moonshot / Kimi K2) ----------

async function rewriteLesson(
  lesson: Lesson,
  brief: ResearchBrief,
  courseContext: string,
  retryFeedback?: { previousOutput: string; errors: string[] }
): Promise<string> {
  if (!MOONSHOT_API_KEY) {
    throw new Error("MOONSHOT_API_KEY missing — can't run rewrite phase");
  }

  const citationsBlock = brief.citations
    .map((c, i) => `[${i + 1}] ${c.title || c.url} — ${c.url}`)
    .join("\n");

  const systemPrompt = `${RICH_BLOCK_SCHEMA}\n\nCOURSE CONTEXT: ${courseContext}`;

  const retryBlock = retryFeedback
    ? `\n\n# RETRY — previous attempt failed validation

Your previous output had these errors:
${retryFeedback.errors.map((e) => `- ${e}`).join("\n")}

Previous output (fix ONLY the specific problems above — keep everything else):
\`\`\`
${retryFeedback.previousOutput}
\`\`\`

Common JSON pitfalls to avoid:
- Unescaped double quotes inside string values — escape them as \\"
- Trailing commas before } or ]
- Unescaped newlines in string values — use \\n
- Using single quotes instead of double quotes
`
    : "";

  const userPrompt = `# Lesson to rewrite

**Title:** ${lesson.title}

**Original content (markdown, may be plain text / mermaid only):**
\`\`\`
${lesson.content}
\`\`\`

**Research brief (ground all factual claims in this):**
${brief.brief}

**Citations:**
${citationsBlock || "(none)"}
${retryBlock}
# Your task

Rewrite the lesson content following the rich-block schema. Preserve the original
pedagogical arc but introduce 3-5 interactive blocks appropriate to the topic. Match
the existing lesson's level of depth or exceed it. Output ONLY the new markdown content.`;

  const resp = await fetch(MOONSHOT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MOONSHOT_API_KEY}`,
    },
    body: JSON.stringify({
      model: MOONSHOT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 4000,
    }),
  });
  if (!resp.ok) {
    throw new Error(`Moonshot rewrite failed: ${resp.status} ${await resp.text()}`);
  }
  const data: any = await resp.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Moonshot returned empty content");
  return content.trim();
}

// ---------- Rewrite phase (Claude Code CLI) ----------

async function rewriteLessonViaClaude(
  lesson: Lesson,
  brief: ResearchBrief,
  courseContext: string,
  retryFeedback?: { previousOutput: string; errors: string[] }
): Promise<string> {
  const citationsBlock = brief.citations
    .map((c, i) => `[${i + 1}] ${c.title || c.url} — ${c.url}`)
    .join("\n");

  const retryBlock = retryFeedback
    ? `\n\n# RETRY — previous attempt failed validation

Your previous output had these errors:
${retryFeedback.errors.map((e) => `- ${e}`).join("\n")}

Previous output (fix ONLY the specific problems above — keep everything else):
\`\`\`
${retryFeedback.previousOutput}
\`\`\`

Common JSON pitfalls to avoid:
- Unescaped double quotes inside string values — escape them as \\"
- Trailing commas before } or ]
- Unescaped newlines in string values — use \\n
- Using single quotes instead of double quotes
`
    : "";

  const combinedPrompt = `${RICH_BLOCK_SCHEMA}

COURSE CONTEXT: ${courseContext}

# Lesson to rewrite

**Title:** ${lesson.title}

**Original content (markdown, may be plain text / mermaid only):**
\`\`\`
${lesson.content}
\`\`\`

**Research brief (ground all factual claims in this):**
${brief.brief}

**Citations:**
${citationsBlock || "(none)"}
${retryBlock}
# Your task

Rewrite the lesson content following the rich-block schema. Preserve the original
pedagogical arc but introduce 3-5 interactive blocks appropriate to the topic. Match
the existing lesson's level of depth or exceed it. Output ONLY the new markdown content —
no preamble, no "here is the rewrite", no wrapping code fence around the whole thing.`;

  return new Promise((resolve, reject) => {
    // On Windows, npm/claude is a .cmd shim — must use shell:true to resolve it.
    const isWin = process.platform === "win32";
    const child = spawn(
      "claude",
      ["-p", "--output-format", "text", "--model", "sonnet"],
      {
        stdio: ["pipe", "pipe", "pipe"],
        shell: isWin,
      }
    );

    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error("Claude CLI timed out after 5 minutes"));
    }, 5 * 60 * 1000);

    child.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("error", (err) => {
      clearTimeout(timeout);
      reject(new Error(`Claude CLI spawn failed: ${err.message}`));
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(`Claude CLI exited ${code}: ${stderr.trim() || stdout.trim()}`));
        return;
      }
      const trimmed = stdout.trim();
      if (!trimmed) {
        reject(new Error(`Claude CLI returned empty output. stderr: ${stderr.trim()}`));
        return;
      }
      resolve(trimmed);
    });

    child.stdin.write(combinedPrompt);
    child.stdin.end();
  });
}

// ---------- Validation ----------

interface ValidationReport {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

function validateRewrite(content: string): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check 1: unescaped ${ outside of escaped form (\${...})
  // A raw ${ in the lesson content would break the TS template literal.
  const unescapedInterp = /(^|[^\\])\$\{/g;
  const matches = [...content.matchAll(unescapedInterp)];
  if (matches.length > 0) {
    errors.push(
      `Found ${matches.length} unescaped \${...} — these will break TS template literals. Escape as \\\${...}`
    );
  }

  // Check 2: every fenced interactive block must parse as JSON
  const interactiveLangs = new Set([
    "concept", "callout", "tabs", "quiz", "steps", "takeaways",
    "compare", "collapse", "playground", "algoviz", "trace",
    "calculator", "fillblank", "sysdiag",
  ]);
  const fence = /^```(\w+)\s*\n([\s\S]*?)^```\s*$/gm;
  let blockCount = 0;
  for (const m of content.matchAll(fence)) {
    const lang = m[1];
    if (!interactiveLangs.has(lang)) continue;
    blockCount++;
    try {
      const parsed = JSON.parse(m[2]);
      if (lang === "quiz") {
        const qs = parsed.questions || [];
        if (!Array.isArray(qs) || qs.length < 3) {
          warnings.push(`quiz block has only ${qs.length} question(s) — prompt requires 3+`);
        }
      }
    } catch (e: any) {
      errors.push(`Invalid JSON in \`\`\`${lang} block: ${e.message}`);
    }
  }
  if (blockCount === 0) {
    warnings.push("No interactive blocks detected — lesson may still read like plain markdown");
  } else if (blockCount < 2) {
    warnings.push(`Only ${blockCount} interactive block — consider adding more for richness`);
  }

  // Check 3: unbalanced backticks (rough heuristic)
  const backtickRuns = content.match(/`+/g) || [];
  const tripleCount = backtickRuns.filter((r) => r.length >= 3).length;
  if (tripleCount % 2 !== 0) {
    warnings.push(`Odd number of \`\`\` fences (${tripleCount}) — fence may be unclosed`);
  }

  return { ok: errors.length === 0, errors, warnings };
}

// ---------- Serialization ----------

function toTemplateLiteral(s: string): string {
  // Escape in this order: backslashes, backticks, then ${
  const escaped = s
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  return "`" + escaped + "`";
}

function serializeModule(exportName: string, mod: ModuleData): string {
  const lessonsStr = mod.lessons
    .map((l) => {
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
    })
    .join(",\n");

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

// ---------- Module loader ----------

async function loadModule(
  inputPath: string
): Promise<{ exportName: string; module: ModuleData }> {
  const abs = path.resolve(inputPath);
  const url = pathToFileURL(abs).href + `?t=${Date.now()}`;
  const mod: any = await import(url);
  const entry = Object.entries(mod).find(
    ([_, v]: [string, any]) =>
      v && typeof v === "object" && Array.isArray(v.lessons) && typeof v.id === "string"
  );
  if (!entry) {
    throw new Error(`No Module export found in ${inputPath}`);
  }
  const [exportName, m] = entry as [string, ModuleData];
  return { exportName, module: m };
}

// ---------- Main ----------

interface CLIArgs {
  inputPath: string;
  dryRun: boolean;
  only?: number[];
  outPath?: string;
  engine: "moonshot" | "claude";
}

function parseArgs(argv: string[]): CLIArgs {
  const args: CLIArgs = { inputPath: "", dryRun: false, engine: "moonshot" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--only") args.only = argv[++i].split(",").map(Number);
    else if (a === "--out") args.outPath = argv[++i];
    else if (a === "--engine") {
      const e = argv[++i];
      if (e !== "moonshot" && e !== "claude") {
        console.error(`--engine must be "moonshot" or "claude" (got "${e}")`);
        process.exit(1);
      }
      args.engine = e;
    } else if (!args.inputPath) args.inputPath = a;
  }
  if (!args.inputPath) {
    console.error("Usage: tsx scripts/migrate-lesson.ts <path> [--dry-run] [--only 0,1] [--out path] [--engine claude|moonshot]");
    process.exit(1);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { exportName, module: mod } = await loadModule(args.inputPath);
  const courseSlug = path.basename(path.dirname(path.resolve(args.inputPath)));
  const courseContext = `Course: ${courseSlug}. Module: ${mod.title} — ${mod.description}`;

  console.log(`\n→ Loaded ${exportName} from ${args.inputPath}`);
  console.log(`  ${mod.lessons.length} lessons in module "${mod.title}"`);
  console.log(`  engine: ${args.engine}`);
  if (args.dryRun) console.log("  [DRY RUN] — no API calls, will test serialization round-trip only");

  const targetIndices =
    args.only ?? mod.lessons.map((_, i) => i);
  const rewrittenLessons: Lesson[] = [...mod.lessons];
  let failures = 0;

  for (const i of targetIndices) {
    const lesson = mod.lessons[i];
    console.log(`\n[${i + 1}/${mod.lessons.length}] ${lesson.title}`);

    if (args.dryRun) {
      console.log("  skipping API calls (dry-run)");
      continue;
    }

    try {
      console.log("  researching...");
      const brief = await researchConcept(
        `${lesson.title} — ${courseContext}`
      );
      console.log(`  got brief (${brief.brief.length} chars, ${brief.citations.length} citations)`);

      let newContent = "";
      let report: ValidationReport = { ok: false, errors: [], warnings: [] };
      const MAX_ATTEMPTS = 3;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        console.log(`  rewriting (attempt ${attempt}/${MAX_ATTEMPTS})...`);
        const retryFeedback = attempt > 1 ? { previousOutput: newContent, errors: report.errors } : undefined;
        newContent = args.engine === "claude"
          ? await rewriteLessonViaClaude(lesson, brief, courseContext, retryFeedback)
          : await rewriteLesson(lesson, brief, courseContext, retryFeedback);
        console.log(`  got rewrite (${newContent.length} chars)`);
        report = validateRewrite(newContent);
        if (report.ok) break;
        console.log(`  ⟲ validation failed, will retry:`);
        report.errors.forEach((e) => console.log(`    - ${e}`));
      }

      if (!report.ok) {
        console.log(`  ✗ validation failed after ${MAX_ATTEMPTS} attempts — keeping original content`);
        failures++;
        continue;
      }
      if (report.warnings.length > 0) {
        console.log(`  ⚠ warnings:`);
        report.warnings.forEach((w) => console.log(`    - ${w}`));
      }
      console.log(`  ✓ validated`);

      rewrittenLessons[i] = { ...lesson, content: newContent };
    } catch (e: any) {
      console.log(`  ✗ error: ${e.message}`);
      failures++;
    }
  }

  const newModule: ModuleData = { ...mod, lessons: rewrittenLessons };
  const output = serializeModule(exportName, newModule);

  const outPath =
    args.outPath ??
    path.resolve(args.inputPath).replace(/\.ts$/, ".v2.ts");

  await fs.writeFile(outPath, output, "utf-8");
  console.log(`\n✓ wrote ${outPath}`);
  console.log(`  ${targetIndices.length - failures}/${targetIndices.length} lessons rewritten successfully`);

  // Round-trip check: re-import the output to confirm it parses as valid TS
  try {
    await loadModule(outPath);
    console.log("  ✓ output round-trips (re-imports cleanly)");
  } catch (e: any) {
    console.log(`  ✗ output failed round-trip: ${e.message}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
