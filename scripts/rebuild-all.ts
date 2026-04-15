/**
 * rebuild-all.ts — batch driver for full course rebuilds.
 *
 * Runs scripts/rebuild-course.ts against each course sequentially.
 * Progress is resumable via .research/rebuild-progress.json.
 *
 * Usage:
 *   npx tsx scripts/rebuild-all.ts
 *   npx tsx scripts/rebuild-all.ts --only coding-interview
 *   npx tsx scripts/rebuild-all.ts --fresh
 *   npx tsx scripts/rebuild-all.ts --skip-done   # skip courses already at 100% rich blocks
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { spawn } from "node:child_process";

// SKIP: coding-interview-premium (already perfect), advanced-system-design (100% rich)
// User-prioritized order (2026-04-14 resume): AI/ML first (37 lessons cached), then system-design, then stop.
const COURSES = [
  // === USER PRIORITY (2026-04-14) ===
  "ai-ml-fundamentals",         // AI/ML — 37 lessons cached, resume from module 6
  "system-design",              // Grokking System Design & Architecture
  "python-fundamentals",        // already done — skipped via progress
  "coding-interview",           // already done — skipped via progress
  "data-structures-algorithms",
  "ap-cs-principles",
  "ap-cs-a",
  // "trading-ai" — NEW course, needs course-planning skill (deferred)
  "investing-wealth",
  "mental-health-resilience",
  "political-strategy",
  // english/french/spanish-beginner — different file layout (deferred)

  // === REST: Wave 1 CS/Tech ===
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
  "nn-zero-to-hero",
  // === Wave 2 CS/Tech ===
  "ai-agents",
  "prompt-engineering",
  "rag-engineering",
  "mcp-claude-code",
  "claude-code-mastery",
  "ethical-hacking",
  // === Wave 3 Finance/Business ===
  "personal-finance",
  "financial-modeling",
  "financial-ml",
  "corporate-finance",
  "investment-banking",
  "quantitative-finance",
  "stock-market-investing",
  "accounting-fundamentals",
  "fintech-blockchain",
  "behavioral-economics",
  "macroeconomics",
  "microeconomics",
  "international-economics",
  "entrepreneurship",
  "business-analytics",
  "business-strategy",
  // === Wave 4 Other ===
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
  "leadership-management",
  "leadership-growth",
  "negotiation-influence",
  "intro-psychology",
  "ap-biology",
  "world-history",
];

const PROGRESS_FILE = ".research/rebuild-progress.json";

interface Progress {
  completed: string[];
  failed: Record<string, string>;
  startedAt: string;
  lastUpdate: string;
}

async function loadProgress(): Promise<Progress> {
  try {
    return JSON.parse(await fs.readFile(PROGRESS_FILE, "utf-8"));
  } catch {
    return { completed: [], failed: {}, startedAt: new Date().toISOString(), lastUpdate: "" };
  }
}

async function saveProgress(p: Progress) {
  p.lastUpdate = new Date().toISOString();
  await fs.mkdir(path.dirname(PROGRESS_FILE), { recursive: true });
  await fs.writeFile(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

// Returns ms until the next time the Toronto wall clock reads `hour`:00 (12-hour).
// e.g. msUntilTorontoHour(11, "pm") -> ms until next 23:00 Toronto.
function msUntilTorontoHour(hour12: number, ampm: "am" | "pm"): number {
  const target24 = (hour12 % 12) + (ampm === "pm" ? 12 : 0); // 0..23
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric", minute: "numeric", second: "numeric", hour12: false,
  });
  const now = new Date();
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)!.value, 10);
  let h = get("hour"); if (h === 24) h = 0;
  const m = get("minute");
  const s = get("second");
  const nowSec = h * 3600 + m * 60 + s;
  const targetSec = target24 * 3600;
  let diff = targetSec - nowSec;
  if (diff <= 0) diff += 24 * 3600;
  return diff * 1000;
}

function runRebuild(slug: string): Promise<{ ok: boolean; log: string }> {
  return new Promise((resolve) => {
    const child = spawn("npx", ["tsx", "scripts/rebuild-course.ts", slug], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });
    let log = "";
    child.stdout.on("data", (d) => { const s = d.toString(); log += s; process.stdout.write(s); });
    child.stderr.on("data", (d) => { const s = d.toString(); log += s; process.stderr.write(s); });
    child.on("close", (code) => resolve({ ok: code === 0, log }));
  });
}

// Check if course already has rich blocks in all module files
function isAlreadyDone(slug: string): boolean {
  const { readdirSync, readFileSync } = require("fs");
  const dir = `src/data/${slug}`;
  const richPattern = /\\`\\`\\`(?:concept|quiz|algoviz|trace|playground|calculator|fillblank|sysdiag|compare|takeaways|callout|collapse|steps|tabs)\b/;
  try {
    const files = readdirSync(dir).filter((f: string) => /^\d+.*\.ts$/.test(f) && !f.endsWith(".v2.ts"));
    if (files.length === 0) return false;
    return files.every((f: string) => richPattern.test(readFileSync(`${dir}/${f}`, "utf8")));
  } catch { return false; }
}

async function main() {
  const args = process.argv.slice(2);
  const fresh = args.includes("--fresh");
  const skipDone = args.includes("--skip-done");
  const onlyIdx = args.indexOf("--only");
  const only = onlyIdx >= 0 ? args[onlyIdx + 1] : undefined;

  const courses = only ? [only] : COURSES;
  const progress = fresh
    ? { completed: [], failed: {}, startedAt: new Date().toISOString(), lastUpdate: "" }
    : await loadProgress();

  console.log(`\n━━━ Course Rebuild Driver ━━━`);
  console.log(`Courses: ${courses.length}`);
  console.log(`Already completed: ${progress.completed.length}`);
  console.log(`Skip fully-upgraded: ${skipDone}\n`);

  const MAX_RETRIES_PER_COURSE = 5;
  const retryCount: Record<string, number> = {};

  for (let i = 0; i < courses.length; i++) {
    const slug = courses[i];

    if (progress.completed.includes(slug)) {
      console.log(`[${i + 1}/${courses.length}] ${slug} — already done, skipping`);
      continue;
    }

    if (skipDone && isAlreadyDone(slug)) {
      console.log(`[${i + 1}/${courses.length}] ${slug} — already has rich blocks, skipping`);
      progress.completed.push(slug);
      await saveProgress(progress);
      continue;
    }

    console.log(`\n━━━ [${i + 1}/${courses.length}] Rebuilding: ${slug} ━━━`);
    const start = Date.now();
    const { ok, log } = await runRebuild(slug);
    const elapsed = ((Date.now() - start) / 1000 / 60).toFixed(1);

    // Auto-resume on Claude usage-limit hit: parse "resets Xpm/Xam (America/Toronto)"
    if (!ok) {
      const m = log.match(/out of extra usage[^\n]*resets\s+(\d{1,2})(am|pm)\s*\(([^)]+)\)/i);
      if (m) {
        const tries = (retryCount[slug] = (retryCount[slug] || 0) + 1);
        if (tries <= MAX_RETRIES_PER_COURSE) {
          const sleepMs = msUntilTorontoHour(parseInt(m[1], 10), m[2].toLowerCase() as "am" | "pm") + 60_000;
          const wakeAt = new Date(Date.now() + sleepMs).toISOString();
          console.log(`⏸  Claude quota hit. Sleeping ${(sleepMs / 1000 / 60).toFixed(1)}min until ${wakeAt} (retry ${tries}/${MAX_RETRIES_PER_COURSE} for ${slug})`);
          await new Promise((r) => setTimeout(r, sleepMs));
          i--; // retry same course
          continue;
        }
        console.log(`⚠  ${slug} hit quota ${tries}× — giving up, marking failed`);
      }
    }

    if (ok) {
      progress.completed.push(slug);
      delete progress.failed[slug];
      try {
        const idxPath = `src/data/${slug}/index.ts`;
        const { readFileSync, writeFileSync } = require("fs");
        const src = readFileSync(idxPath, "utf8");
        const patched = src.replace(/tier:\s*['"]free['"]/g, "tier: 'pro'");
        if (patched !== src) {
          writeFileSync(idxPath, patched);
          console.log(`  → marked ${slug} as premium (tier: 'pro')`);
        }
      } catch (e: any) { console.log(`  ⚠ couldn't mark premium: ${e.message}`); }
      console.log(`✓ ${slug} rebuilt in ${elapsed}min`);
    } else {
      progress.failed[slug] = `failed at ${new Date().toISOString()}`;
      console.log(`✗ ${slug} failed after ${elapsed}min`);
    }
    await saveProgress(progress);
  }

  console.log(`\n━━━ Done ━━━`);
  console.log(`Completed: ${progress.completed.length}/${courses.length}`);
  console.log(`Failed: ${Object.keys(progress.failed).length}`);
  if (Object.keys(progress.failed).length > 0) {
    for (const [k, v] of Object.entries(progress.failed)) console.log(`  ${k}: ${v}`);
  }
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
