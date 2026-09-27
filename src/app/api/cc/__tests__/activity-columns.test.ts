// cc_activities has no activity_name / organization_name / description
// columns (supabase/migrations/20260417_coach_kairos_schema.sql). Selecting
// them errors, and the routes read that as "no activities" — the coach and
// the waitlist letter silently lost the student's activities.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { execSync } from "node:child_process";

const REAL = new Set(["id", "student_id", "position", "activity_type", "organization", "role", "description_150", "star_situation", "star_task", "star_action", "star_result", "grades_participated", "hours_per_week", "weeks_per_year", "is_continuing", "impact_score", "updated_at"]);
function selectedActivityColumns(src: string): string[] {
  return [...src.matchAll(/from\("cc_activities"\)\s*\.select\("([^"]+)"\)/g)].flatMap((m) => m[1].split(",").map((c) => c.trim()));
}

describe("cc_activities selects use real columns", () => {
  const readers = execSync("git ls-files src", { encoding: "utf8" }).split("\n")
    .filter((f) => /\.tsx?$/.test(f) && !f.includes("__tests__") && fs.existsSync(f))
    .filter((f) => selectedActivityColumns(fs.readFileSync(f, "utf8")).length > 0);

  it("finds the routes that read activities", () => {
    expect(readers).toEqual(expect.arrayContaining([
      "src/app/api/cc/coach/message/route.ts", "src/app/api/cc/waitlist/loci/route.ts",
      "src/app/api/cc/activities/narrative/route.ts", "src/app/api/cron/generate-observations/route.ts",
    ]));
  });

  it("every select names real columns", () => {
    const bad = readers.flatMap((f) => selectedActivityColumns(fs.readFileSync(f, "utf8"))
      .filter((c) => !REAL.has(c) && c !== "*").map((c) => `${f}: ${c}`));
    expect(bad).toEqual([]);
  });

  it("the waitlist letter never tells the model to invent school specifics", () => {
    expect(fs.readFileSync("src/app/api/cc/waitlist/loci/route.ts", "utf8")).not.toMatch(/pick something concrete/i);
  });
});
