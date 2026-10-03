/**
 * Upsert UK universities into cc_schools and fill location + application
 * platform for the 12 Canadian rows. Data and sources live in
 * src/lib/cc/seed/uk-canada-schools.ts.
 *
 * Idempotent: rows are matched on exact cc_schools.name (the table has no
 * UNIQUE constraint, so the earlier migrations used the same key). Names with
 * more than one existing row are reported and skipped.
 *
 * Also clears the unsourced acceptance_rate (and NULL net price / test policy)
 * on the rows it touches. Pass --keep-rates to leave those columns alone.
 *
 * Run:
 *   npx tsx scripts/seed-uk-canada-schools.ts             # dry run (reads DB, writes nothing)
 *   npx tsx scripts/seed-uk-canada-schools.ts --apply     # performs the writes
 *   npx tsx scripts/seed-uk-canada-schools.ts --offline   # dry run without touching the DB
 *
 * Requires env (read from .env.local unless already set):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import {
  buildSeedRows,
  planSeed,
  type ExistingSchool,
  type SeedPlan,
  type SeedRow,
} from "../src/lib/cc/seed/uk-canada-schools";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const offline = args.includes("--offline");
const keepRates = args.includes("--keep-rates");

function countryOf(rows: SeedRow[], name: string): string {
  return rows.find((r) => r.name === name)?.country ?? "?";
}

function printPlan(rows: SeedRow[], plan: SeedPlan) {
  for (const r of plan.inserts) {
    console.log(`  INSERT [${r.country}] ${r.name} — ${r.city}${r.province ? `, ${r.province}` : ""} · ${r.application_platform}`);
  }
  for (const u of plan.updates) {
    const diff = Object.entries(u.changes)
      .map(([k, { from, to }]) => `${k}: ${JSON.stringify(from)} -> ${JSON.stringify(to)}`)
      .join("; ");
    console.log(`  UPDATE [${countryOf(rows, u.name)}] ${u.name} (${u.id}) — ${diff}`);
  }
  for (const n of plan.duplicates) {
    console.log(`  SKIP   [${countryOf(rows, n)}] ${n} — more than one cc_schools row has this name; resolve by hand`);
  }

  const tally = (country: "UK" | "CA") => {
    const inC = (name: string) => countryOf(rows, name) === country;
    return [
      `${plan.inserts.filter((r) => r.country === country).length} insert`,
      `${plan.updates.filter((u) => inC(u.name)).length} update`,
      `${plan.unchanged.filter(inC).length} unchanged`,
      `${plan.duplicates.filter(inC).length} skipped (duplicate)`,
    ].join(", ");
  };
  console.log(`\nSummary: UK ${tally("UK")} | CA ${tally("CA")}`);
}

async function main() {
  const rows = buildSeedRows({ keepRates });
  const mode = apply ? "APPLY" : offline ? "DRY RUN (offline)" : "DRY RUN";
  console.log(`[seed-uk-canada-schools] ${mode} — ${rows.length} rows (${rows.filter((r) => r.country === "UK").length} UK, ${rows.filter((r) => r.country === "CA").length} CA)${keepRates ? ", keeping existing rates" : ""}\n`);

  if (offline) {
    if (apply) throw new Error("--offline cannot be combined with --apply");
    printPlan(rows, planSeed(rows, []));
    console.log("\nOffline: every row is shown as INSERT. Run without --offline to compare against cc_schools.");
    return;
  }

  loadEnv({ path: path.resolve(__dirname, "../.env.local") });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  const supabase = createClient(url, key);

  const columns = ["id", ...new Set(rows.flatMap((r) => Object.keys(r)))].join(", ");
  const { data: existing, error } = await supabase
    .from("cc_schools")
    .select(columns)
    .in("name", rows.map((r) => r.name));
  if (error) throw new Error(`Reading cc_schools failed: ${error.message}`);

  const plan = planSeed(rows, (existing ?? []) as unknown as ExistingSchool[]);
  printPlan(rows, plan);

  if (!apply) {
    console.log("\nNothing written. Re-run with --apply to perform these changes.");
    return;
  }

  let written = 0;
  if (plan.inserts.length > 0) {
    const { error: insErr } = await supabase.from("cc_schools").insert(plan.inserts);
    if (insErr) throw new Error(`Insert failed: ${insErr.message}`);
    written += plan.inserts.length;
  }
  for (const u of plan.updates) {
    const patch = Object.fromEntries(Object.entries(u.changes).map(([k, { to }]) => [k, to]));
    const { error: updErr } = await supabase.from("cc_schools").update(patch).eq("id", u.id);
    if (updErr) throw new Error(`Update of ${u.name} failed: ${updErr.message}`);
    written++;
  }
  console.log(`\nApplied: ${written} rows written.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
