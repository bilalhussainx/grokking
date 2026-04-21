// rebuild-sd-loop.mjs — keep restarting rebuild-course.ts system-design until all lessons cached.
import { spawn } from "node:child_process";
import { readdirSync, existsSync, appendFileSync } from "node:fs";

const LOG = ".research/system-design-loop.log";
const CACHE = ".research/cache/system-design";
const TARGET_LESSONS = 72; // 12 modules × 6 lessons (approx)
const MAX_ATTEMPTS = 50;

function log(s) {
  appendFileSync(LOG, s + "\n");
  console.log(s);
}

function cachedCount() {
  try { return readdirSync(CACHE).filter((f) => f.endsWith(".json")).length; } catch { return 0; }
}

function indexWritten() {
  return existsSync("src/data/system-design/index.ts");
}

function runOnce() {
  return new Promise((resolve) => {
    const child = spawn("npx", ["tsx", "scripts/rebuild-course.ts", "system-design"], {
      stdio: ["ignore", "inherit", "inherit"],
      shell: true,
    });
    child.on("close", (code) => resolve(code ?? 0));
    child.on("error", () => resolve(1));
  });
}

for (let i = 1; i <= MAX_ATTEMPTS; i++) {
  const beforeCount = cachedCount();
  log(`\n=== Attempt ${i} at ${new Date().toISOString()} — ${beforeCount} cached ===`);
  const code = await runOnce();
  const afterCount = cachedCount();
  log(`=== Exit ${code} — ${afterCount} cached (delta ${afterCount - beforeCount}) ===`);

  // Exit on success: index.ts written + 12 module files exist
  try {
    const files = readdirSync("src/data/system-design").filter((f) => /^\d+.*\.ts$/.test(f));
    if (indexWritten() && files.length >= 10) {
      log(`✓ Done — index + ${files.length} module files written, ${afterCount} lessons cached`);
      process.exit(0);
    }
  } catch {}

  if (afterCount === beforeCount && code !== 0) {
    // No progress — wait longer in case it's a transient issue (quota-like)
    log(`⚠ no progress this attempt, waiting 30s...`);
    await new Promise((r) => setTimeout(r, 30_000));
  } else {
    await new Promise((r) => setTimeout(r, 2_000));
  }
}

log(`⚠ Max attempts (${MAX_ATTEMPTS}) reached`);
process.exit(1);
