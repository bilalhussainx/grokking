// A select that names a column the table doesn't have makes Supabase return
// an error, and our routes read that as "no data": the dashboard lost SAT
// scores and course grades, the share link lost the essay, net price lost the
// school list, interview questions lost majors, and Coach lost the essay it
// was opened from. Columns below are the migrations' definitions, confirmed
// against the production schema on 2026-09-27 (head-only probe, no rows read).
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { execSync } from "node:child_process";

const KNOWN: Record<string, string[]> = {
  cc_courses: ["id", "student_id", "course_name", "level", "grade_level", "grade_received", "curriculum_type", "year_taken", "notes", "created_at"],
  cc_essays: ["id", "student_id", "school_id", "essay_type", "prompt_text", "word_limit", "word_count", "phase", "brainstorm_transcript", "canvas_fragments", "outline_json", "current_draft", "revision_comments", "counselor_review_state", "counselor_review_updated_at", "reuse_flagged", "reuse_overlap_with", "reuse_score", "share_token", "updated_at", "supplement_id"],
  cc_school_preferences: ["id", "student_id", "intended_major", "campus_size_preference", "location_type", "preferred_regions", "financial_need", "income_bracket", "needs_international_full_need", "extracurriculars_summary", "additional_notes", "created_at", "updated_at"],
  cc_student_schools: ["id", "student_id", "school_id", "tier", "chancing_band", "chancing_rationale", "application_plan", "application_status", "added_at", "submitted_at", "decision_at", "notes", "portal_url", "portal_login_note", "common_app_filled", "essays_complete", "supplements_complete", "recs_submitted", "test_scores_submitted", "transcript_submitted", "financial_aid_filed", "fee_waiver_used", "estimated_net_price_low", "estimated_net_price_high", "deadline_ea", "deadline_ed", "deadline_edii", "deadline_rd", "deadline_rea", "deadline_css_profile", "deadline_fafsa", "deadline_financial_aid"],
  cc_test_attempts: ["id", "student_id", "test_type", "test_date", "sat_reading_writing", "sat_math", "act_english", "act_math", "act_reading", "act_science", "total_score", "notes", "created_at"],
};

const SELECT = /\.from\(\s*["'](\w+)["']\s*\)\s*\.select\(\s*(["'`])([\s\S]*?)\2/g;

function unknownColumns(src: string): string[] {
  const bad: string[] = [];
  for (const m of src.matchAll(SELECT)) {
    const table = m[1];
    const known = KNOWN[table];
    if (!known || m[3].includes("${")) continue;
    // Drop embedded relations like cc_schools(name) or alias:table!fk(cols).
    const flat = m[3].replace(/[\w!:]+\s*\([^()]*\)/g, "");
    for (const raw of flat.split(",")) {
      const col = raw.trim().split("::")[0].split(":").pop()!.trim();
      if (col && col !== "*" && !known.includes(col)) bad.push(`${table}.${col}`);
    }
  }
  return bad;
}

describe("selects name real columns", () => {
  it("catches a column the table doesn't have", () => {
    expect(unknownColumns(`db.from("cc_essays").select("id, content")`)).toEqual(["cc_essays.content"]);
    expect(unknownColumns(`db.from("cc_student_schools").select("school_id, cc_schools(name)")`)).toEqual([]);
  });

  it("no source file selects a missing column on these tables", () => {
    const files = execSync("git ls-files src", { encoding: "utf8" }).split("\n")
      .filter((f) => /\.tsx?$/.test(f) && !f.includes("__tests__") && !f.includes(".test.") && fs.existsSync(f));
    const bad = files.flatMap((f) => unknownColumns(fs.readFileSync(f, "utf8")).map((c) => `${f}: ${c}`));
    expect(bad).toEqual([]);
  });
});
