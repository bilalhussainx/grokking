/**
 * Seed cc_schools from College Scorecard API + static deadline data.
 * Run: npx tsx scripts/seed-schools-scorecard.ts
 *
 * Requires: DATA_GOV_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { SCHOOL_STATIC_DATA } from "./school-static-data";

const API_KEY = process.env.DATA_GOV_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!API_KEY) {
  console.error("Missing DATA_GOV_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SCORECARD_BASE = "https://api.data.gov/ed/collegescorecard/v1/schools";
const FIELDS = [
  "id",
  "school.name",
  "school.city",
  "school.state",
  "school.ownership",
  "school.carnegie_basic",
  "latest.student.size",
  "latest.admissions.admission_rate.overall",
  "latest.admissions.sat_scores.25th_percentile.critical_reading",
  "latest.admissions.sat_scores.25th_percentile.math",
  "latest.admissions.sat_scores.75th_percentile.critical_reading",
  "latest.admissions.sat_scores.75th_percentile.math",
  "latest.admissions.act_scores.25th_percentile.cumulative",
  "latest.admissions.act_scores.75th_percentile.cumulative",
  "latest.cost.attendance.academic_year",
  "latest.cost.avg_net_price.overall",
  "latest.cost.net_price.consumer.by_income_level.0-30000",
  "latest.cost.net_price.consumer.by_income_level.30001-48000",
  "latest.cost.net_price.consumer.by_income_level.48001-75000",
  "latest.cost.net_price.consumer.by_income_level.75001-110000",
  "latest.cost.net_price.consumer.by_income_level.110001-plus",
  "latest.aid.pell_grant_rate",
  "latest.student.share_firstgeneration",
  "latest.completion.rate_suppressed.overall",
  "latest.earnings.10_yrs_after_entry.median",
  "latest.aid.federal_loan_rate",
  "latest.aid.median_debt_suppressed.overall",
  "latest.aid.cumulative_debt.90th_percentile",
  "latest.aid.cumulative_debt.10th_percentile",
].join(",");

const OWNERSHIP_MAP: Record<number, string> = {
  1: "public",
  2: "private",
  3: "private-for-profit",
};

interface ScorecardResult {
  id: number;
  "school.name": string;
  "school.city": string;
  "school.state": string;
  "school.ownership": number;
  "school.carnegie_basic": number | null;
  "latest.student.size": number | null;
  "latest.admissions.admission_rate.overall": number | null;
  "latest.admissions.sat_scores.25th_percentile.critical_reading": number | null;
  "latest.admissions.sat_scores.25th_percentile.math": number | null;
  "latest.admissions.sat_scores.75th_percentile.critical_reading": number | null;
  "latest.admissions.sat_scores.75th_percentile.math": number | null;
  "latest.admissions.act_scores.25th_percentile.cumulative": number | null;
  "latest.admissions.act_scores.75th_percentile.cumulative": number | null;
  "latest.cost.attendance.academic_year": number | null;
  "latest.cost.avg_net_price.overall": number | null;
  "latest.cost.net_price.consumer.by_income_level.0-30000": number | null;
  "latest.cost.net_price.consumer.by_income_level.30001-48000": number | null;
  "latest.cost.net_price.consumer.by_income_level.48001-75000": number | null;
  "latest.cost.net_price.consumer.by_income_level.75001-110000": number | null;
  "latest.cost.net_price.consumer.by_income_level.110001-plus": number | null;
  "latest.aid.pell_grant_rate": number | null;
  "latest.student.share_firstgeneration": number | null;
  "latest.completion.rate_suppressed.overall": number | null;
  "latest.earnings.10_yrs_after_entry.median": number | null;
}

function safeAdd(a: number | null, b: number | null): number | null {
  if (a == null || b == null) return null;
  return a + b;
}

function mapToRow(r: ScorecardResult) {
  const staticData = SCHOOL_STATIC_DATA[r.id];
  return {
    ipeds_id: r.id,
    name: r["school.name"],
    city: r["school.city"],
    state: r["school.state"],
    institution_type: OWNERSHIP_MAP[r["school.ownership"]] || "unknown",
    school_type: OWNERSHIP_MAP[r["school.ownership"]] || "unknown",
    enrollment_undergrad: r["latest.student.size"],
    enrollment: r["latest.student.size"],
    acceptance_rate: r["latest.admissions.admission_rate.overall"],
    sat_25: safeAdd(
      r["latest.admissions.sat_scores.25th_percentile.critical_reading"],
      r["latest.admissions.sat_scores.25th_percentile.math"]
    ),
    sat_75: safeAdd(
      r["latest.admissions.sat_scores.75th_percentile.critical_reading"],
      r["latest.admissions.sat_scores.75th_percentile.math"]
    ),
    act_25: r["latest.admissions.act_scores.25th_percentile.cumulative"],
    act_75: r["latest.admissions.act_scores.75th_percentile.cumulative"],
    cost_of_attendance: r["latest.cost.attendance.academic_year"],
    avg_net_price: r["latest.cost.avg_net_price.overall"],
    avg_net_price_by_income: {
      "0-30000": r["latest.cost.net_price.consumer.by_income_level.0-30000"],
      "30001-48000": r["latest.cost.net_price.consumer.by_income_level.30001-48000"],
      "48001-75000": r["latest.cost.net_price.consumer.by_income_level.48001-75000"],
      "75001-110000": r["latest.cost.net_price.consumer.by_income_level.75001-110000"],
      "110001-plus": r["latest.cost.net_price.consumer.by_income_level.110001-plus"],
    },
    pell_pct: r["latest.aid.pell_grant_rate"],
    first_gen_pct: r["latest.student.share_firstgeneration"],
    graduation_rate_6y: r["latest.completion.rate_suppressed.overall"],
    median_earnings_10y: r["latest.earnings.10_yrs_after_entry.median"],
    // Static data (deadlines, test policy, etc.)
    ...(staticData
      ? {
          regular_deadline: staticData.regular_deadline,
          early_deadline: staticData.early_deadline,
          test_policy: staticData.test_policy,
          meets_full_need: staticData.meets_full_need,
          no_loan_institution: staticData.no_loan_institution,
        }
      : {}),
  };
}

async function fetchBatch(ids: number[]): Promise<ScorecardResult[]> {
  const url = `${SCORECARD_BASE}?id=${ids.join(",")}&fields=${FIELDS}&_per_page=100&api_key=${API_KEY}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Scorecard API ${resp.status}: ${text.slice(0, 200)}`);
  }
  const data = await resp.json();
  return data.results || [];
}

async function main() {
  const allIds = Object.keys(SCHOOL_STATIC_DATA).map(Number);
  console.log(`Fetching ${allIds.length} schools from College Scorecard API...`);

  const BATCH_SIZE = 90; // API limit is 100 IDs per request
  const allResults: ScorecardResult[] = [];

  for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
    const batch = allIds.slice(i, i + BATCH_SIZE);
    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: fetching ${batch.length} schools...`);
    const results = await fetchBatch(batch);
    allResults.push(...results);
    // small delay between batches
    if (i + BATCH_SIZE < allIds.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`Fetched ${allResults.length} schools from API.`);

  const rows = allResults.map(mapToRow);

  // Check for missing schools (IDs in static data but not returned by API)
  const returnedIds = new Set(allResults.map((r) => r.id));
  const missingIds = allIds.filter((id) => !returnedIds.has(id));
  if (missingIds.length > 0) {
    console.warn(`Warning: ${missingIds.length} IPEDS IDs not found in Scorecard API:`, missingIds);
  }

  // Upsert in batches of 50
  let inserted = 0;
  let errors = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase
      .from("cc_schools")
      .upsert(batch, { onConflict: "ipeds_id" });

    if (error) {
      console.error(`Upsert batch ${Math.floor(i / 50) + 1} failed:`, error.message);
      errors++;
    } else {
      inserted += batch.length;
    }
  }

  console.log(`\nDone! Upserted ${inserted} schools. Errors: ${errors}`);

  // Verify count
  const { count } = await supabase
    .from("cc_schools")
    .select("*", { count: "exact", head: true });
  console.log(`Total schools in cc_schools: ${count}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
