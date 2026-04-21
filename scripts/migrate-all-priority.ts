/**
 * migrate-all-priority.ts — batch driver for Lane A.
 *
 * Runs scripts/migrate-lesson.ts against every module file of every priority course,
 * sequentially. Writes progress to .research/migration-progress.json so runs are resumable.
 *
 * Usage:
 *   tsx scripts/migrate-all-priority.ts
 *   tsx scripts/migrate-all-priority.ts --only coding-interview
 *   tsx scripts/migrate-all-priority.ts --fresh   # ignore progress file
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { execSync, spawn } from "node:child_process";

const PRIORITY_COURSES = [
  // Wave 1: CS/Tech — core interview + fundamentals (2026-04-13)
  "coding-interview",
  "system-design",
  "data-structures-algorithms",
  "python-fundamentals",
  "javascript-fundamentals",
  "react-development",
  "dp-patterns",
  "ds-interview",
  "ml-interview",
  "ood-interview",
  "concurrency-multithreading",
  "grokking-dsa-python",
  "cpp-fundamentals",
  "csharp-fundamentals",
  "nodejs-backend",
  "mern-stack",
  "web-development",
  "game-development",
  "behavioral-interview",
  "api-design-interview",
  "modern-system-design",
  // Wave 2: CS/Tech — AI, security, advanced
  "ai-ml-fundamentals",
  "ai-agents",
  "nn-zero-to-hero",
  "prompt-engineering",
  "rag-engineering",
  "mcp-claude-code",
  "claude-code-mastery",
  "ethical-hacking",
  "ap-cs-a",
  "ap-cs-principles",
  // Wave 3: Finance/Business
  "personal-finance",
  "financial-modeling",
  "financial-ml",
  "corporate-finance",
  "investment-banking",
  "quantitative-finance",
  "stock-market-investing",
  "investing-wealth",
  "accounting-fundamentals",
  "fintech-blockchain",
  "behavioral-economics",
  "macroeconomics",
  "microeconomics",
  "international-economics",
  "entrepreneurship",
  "business-analytics",
  "business-strategy",
  // Wave 4: Other — religion, philosophy, wellness, etc.
  "islam-foundations",
  "christian-theology",
  "buddhism-foundations",
  "hinduism-foundations",
  "judaism-foundations",
  "sikhism-foundations",
  "sufism-foundations",
  "confucianism-foundations",
  "taoism-foundations",
  "ahmadiyya-foundations",
  "stoic-philosophy",
  "meditation-mindfulness",
  "mental-health-resilience",
  "leadership-management",
  "leadership-growth",
  "negotiation-influence",
  "political-strategy",
  "intro-psychology",
  "ap-biology",
  "world-history",
];

const DEFAULT_PROGRESS_FILE = ".research/migration-progress.json";

interface Progress {
  completed: string[]; // module file paths that are done (have a .v2.ts)
  failed: Record<string, string>; // path → error
  startedAt: string;
  lastUpdate: string;
}

async function loadProgress(progressFile: string): Promise<Progress> {
  try {
    const raw = await fs.readFile(progressFile, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { completed: [], failed: {}, startedAt: new Date().toISOString(), lastUpdate: "" };
  }
}

async function saveProgress(p: Progress, progressFile: string) {
  p.lastUpdate = new Date().toISOString();
  await fs.mkdir(path.dirname(progressFile), { recursive: true });
  await fs.writeFile(progressFile, JSON.stringify(p, null, 2));
}

async function listModuleFiles(course: string): Promise<string[]> {
  const dir = `src/data/${course}`;
  const entries = await fs.readdir(dir);
  return entries
    .filter((e) => /^\d+.*\.ts$/.test(e)) // numbered module files, e.g. 01-two-pointers.ts
    .filter((e) => !e.endsWith(".v2.ts"))
    .map((e) => path.join(dir, e))
    .sort();
}

function runMigration(filePath: string, engine: string): Promise<{ ok: boolean; log: string }> {
  return new Promise((resolve) => {
    const child = spawn(
      "npx",
      ["tsx", "scripts/migrate-lesson.ts", filePath, "--engine", engine],
      {
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
      }
    );
    let log = "";
    child.stdout.on("data", (d) => {
      const s = d.toString();
      log += s;
      process.stdout.write(s);
    });
    child.stderr.on("data", (d) => {
      const s = d.toString();
      log += s;
      process.stderr.write(s);
    });
    child.on("close", (code) => resolve({ ok: code === 0, log }));
  });
}

async function main() {
  const args = process.argv.slice(2);
  const fresh = args.includes("--fresh");
  const onlyIdx = args.indexOf("--only");
  const onlyCourse = onlyIdx >= 0 ? args[onlyIdx + 1] : undefined;
  const engineIdx = args.indexOf("--engine");
  const engine = engineIdx >= 0 ? args[engineIdx + 1] : "moonshot";
  if (engine !== "moonshot" && engine !== "claude") {
    console.error(`--engine must be "moonshot" or "claude" (got "${engine}")`);
    process.exit(1);
  }

  // Separate progress file per engine so switching engines doesn't skip files
  const progressFile =
    engine === "claude"
      ? ".research/migration-progress-claude.json"
      : DEFAULT_PROGRESS_FILE;

  const coursesToRun = onlyCourse ? [onlyCourse] : PRIORITY_COURSES;
  const progress = fresh
    ? { completed: [], failed: {}, startedAt: new Date().toISOString(), lastUpdate: "" }
    : await loadProgress(progressFile);

  console.log(`\n━━━ Priority migration driver ━━━`);
  console.log(`Engine: ${engine}`);
  console.log(`Progress file: ${progressFile}`);
  console.log(`Courses: ${coursesToRun.join(", ")}`);
  console.log(`Resuming: ${progress.completed.length} already complete, ${Object.keys(progress.failed).length} previously failed\n`);

  const allFiles: string[] = [];
  for (const c of coursesToRun) {
    try {
      const files = await listModuleFiles(c);
      allFiles.push(...files);
    } catch (e: any) {
      console.log(`⚠ could not list ${c}: ${e.message}`);
    }
  }

  console.log(`Total module files: ${allFiles.length}\n`);

  for (let i = 0; i < allFiles.length; i++) {
    const f = allFiles[i];
    if (progress.completed.includes(f)) {
      console.log(`[${i + 1}/${allFiles.length}] ${f} — already done, skipping`);
      continue;
    }
    console.log(`\n━━━ [${i + 1}/${allFiles.length}] ${f} ━━━`);
    const start = Date.now();
    const { ok } = await runMigration(f, engine);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    if (ok) {
      progress.completed.push(f);
      delete progress.failed[f];
      console.log(`✓ ${f} done in ${elapsed}s`);
    } else {
      progress.failed[f] = `exit non-zero at ${new Date().toISOString()}`;
      console.log(`✗ ${f} failed after ${elapsed}s`);
    }
    await saveProgress(progress, progressFile);
  }

  console.log(`\n━━━ Done ━━━`);
  console.log(`Completed: ${progress.completed.length}`);
  console.log(`Failed: ${Object.keys(progress.failed).length}`);
  if (Object.keys(progress.failed).length > 0) {
    console.log("Failed files:");
    for (const [f, err] of Object.entries(progress.failed)) {
      console.log(`  ${f} — ${err}`);
    }
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
