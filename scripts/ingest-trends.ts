/**
 * Ingest external content (arXiv papers, GitHub repos) and embed them
 * for the Knowledge Pulse feature.
 *
 * Run: npx tsx scripts/ingest-trends.ts
 *
 * Prerequisites:
 * 1. GEMINI_API_KEY in .env.local
 * 2. SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL in .env.local
 * 3. Run migration 010_external_trends.sql in Supabase
 */

import { readFileSync } from "fs";

// Load .env.local manually (no dotenv dependency needed)
try {
  const envFile = readFileSync(".env.local", "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error("Could not read .env.local — make sure it exists.");
  process.exit(1);
}

// Validate required env vars
const required = [
  "GEMINI_API_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}

async function main() {
  // Dynamic import so env vars are set before module loads
  const { ingestArxivPapers, ingestGithubTrending } = await import(
    "../src/lib/trends"
  );

  console.log("=== Knowledge Pulse: External Content Ingestion ===\n");

  // --- arXiv ---
  const arxivQueries = [
    "machine learning",
    "system design distributed",
    "react framework",
    "financial modeling",
    "natural language processing",
    "data structures algorithms",
  ];

  console.log(
    `[arXiv] Ingesting papers for ${arxivQueries.length} queries...`
  );
  const arxivCount = await ingestArxivPapers(arxivQueries, 5);
  console.log(`[arXiv] Ingested ${arxivCount} papers.\n`);

  // --- GitHub ---
  const githubTopics = [
    "react",
    "python",
    "system-design",
    "machine-learning",
    "typescript",
  ];

  console.log(
    `[GitHub] Ingesting repos for ${githubTopics.length} topics...`
  );
  const githubCount = await ingestGithubTrending(githubTopics, 5);
  console.log(`[GitHub] Ingested ${githubCount} repos.\n`);

  // --- Summary ---
  const total = arxivCount + githubCount;
  console.log(`=== Done. Total ingested: ${total} items. ===`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
