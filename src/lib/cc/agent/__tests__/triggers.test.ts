// @vitest-environment node
// src/lib/cc/agent/__tests__/triggers.test.ts
import { describe, it, expect } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { evaluateTriggers, isoWeek, runNudgeCron } from "../triggers";

const now = new Date("2026-10-20T09:00:00Z");
const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P = "11111111-1111-4111-8111-111111111111";
const base = { userId: U, studentId: P, schools: [], essays: [], lastLoginDate: "2026-10-19" };

describe("triggers", () => {
  it("flags a reviewed essay unchanged for 10+ days, not one edited recently", () => {
    const n = evaluateTriggers({ ...base, essays: [
      { id: "e1", reviewState: "changes_requested", phase: "revise", updatedAt: "2026-10-05T00:00:00Z" },
      { id: "e2", reviewState: "changes_requested", phase: "revise", updatedAt: "2026-10-18T00:00:00Z" },
    ] }, now);
    expect(n.map((x) => x.entityKey)).toEqual(["essay:e1"]);
  });

  it("flags inactivity after 14 days and REA conflicts", () => {
    const n = evaluateTriggers({ ...base, lastLoginDate: "2026-10-01", schools: [{ schoolName: "Harvard University", plan: "REA" }, { schoolName: "Northwestern University", plan: "EA" }] }, now);
    expect(n.map((x) => x.trigger).sort()).toEqual(["inactivity", "plan_conflict"]);
  });

  it("uses the ISO week as the period, so a nudge repeats at most weekly", () => {
    expect(isoWeek(now)).toBe("2026-W43");
  });

  const db = () => createFakeSupabase({
    cc_student_profiles: [{ id: P, user_id: U }, { id: "22222222-2222-4222-8222-222222222222", user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }],
    cc_student_schools: [], cc_schools: [],
    cc_essays: [{ id: "e1", student_id: P, counselor_review_state: "changes_requested", phase: "revise", updated_at: "2026-10-05T00:00:00Z" },
                { id: "e9", student_id: "22222222-2222-4222-8222-222222222222", counselor_review_state: "changes_requested", phase: "revise", updated_at: "2026-09-01T00:00:00Z" }],
    user_profiles: [{ id: U, last_login_date: "2026-10-19" }],
    cc_agent_nudges: [], cc_agent_events: [],
  });
  const env = { AGENT_S1_ENABLED: "1", AGENT_S1_USER_IDS: U };

  it("second_run_same_day_inserts_nothing", async () => {
    const d = db();
    expect((await runNudgeCron(d as unknown as SupabaseClient, now, env)).inserted).toBe(1);
    expect((await runNudgeCron(d as unknown as SupabaseClient, now, env)).inserted).toBe(0);
    expect(d.tables.cc_agent_nudges).toHaveLength(1);
  });

  it("duplicate_profiles_use_smallest_id_regardless_of_row_order", async () => {
    const lo = "11111111-1111-4111-8111-111111111111";
    const hi = "33333333-3333-4333-8333-333333333333";
    const mk = (profiles: { id: string; user_id: string }[]) => createFakeSupabase({
      cc_student_profiles: profiles, cc_student_schools: [], cc_schools: [],
      cc_essays: [{ id: "e1", student_id: lo, counselor_review_state: "changes_requested", phase: "revise", updated_at: "2026-10-05T00:00:00Z" }],
      user_profiles: [{ id: U, last_login_date: "2026-10-19" }],
      cc_agent_nudges: [], cc_agent_events: [],
    });
    const d = mk([{ id: hi, user_id: U }, { id: lo, user_id: U }]);
    expect((await runNudgeCron(d as unknown as SupabaseClient, now, env)).inserted).toBe(1);
    expect(d.tables.cc_agent_nudges[0].student_id).toBe(lo);
    // same nudge rows, profile rows now in reverse order: must dedupe
    d.tables.cc_student_profiles.reverse();
    expect((await runNudgeCron(d as unknown as SupabaseClient, now, env)).inserted).toBe(0);
    expect(d.tables.cc_agent_nudges).toHaveLength(1);
  });

  it("unflagged_students_never_nudged", async () => {
    const d = db();
    await runNudgeCron(d as unknown as SupabaseClient, now, env);
    expect(d.tables.cc_agent_nudges.every((n) => n.user_id === U)).toBe(true);
  });
});
