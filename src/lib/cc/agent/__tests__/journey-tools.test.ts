// @vitest-environment node
// src/lib/cc/agent/__tests__/journey-tools.test.ts
import { describe, it, expect } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { makeJourneyTools } from "../journey-tools";
import { isAgentS1User } from "../s1-flag";
import type { SupabaseClient } from "@supabase/supabase-js";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P1 = "11111111-1111-4111-8111-111111111111";
const P2 = "22222222-2222-4222-8222-222222222222";
const OTHER = "99999999-9999-4999-8999-999999999999";
const now = new Date("2026-10-20T12:00:00Z");
const seed = () => createFakeSupabase({
  cc_student_profiles: [
    { id: P1, user_id: U, grade_level: 12, is_transfer_student: false },
    { id: P2, user_id: U, grade_level: 12, is_transfer_student: false },
    { id: OTHER, user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", grade_level: 11, is_transfer_student: false },
  ],
  cc_schools: [
    { id: "s-harvard", name: "Harvard University", country: "US", regular_deadline: "Jan 1" },
    { id: "s-nw", name: "Northwestern University", country: "US", regular_deadline: "Jan 2" },
  ],
  cc_student_schools: [
    { id: "ss1", student_id: P1, school_id: "s-harvard", application_plan: "REA", application_status: "considering", tier: null },
    { id: "ss2", student_id: P2, school_id: "s-nw", application_plan: "EA", application_status: "considering", tier: null },
    { id: "ss3", student_id: OTHER, school_id: "s-nw", application_plan: "ED", application_status: "considering", tier: null },
  ],
  cc_essays: [
    { id: "e1", student_id: P1, essay_type: "personal_statement", phase: "revise", word_count: 420, word_limit: 650, counselor_review_state: "changes_requested", updated_at: "2026-10-05T00:00:00Z" },
  ],
  cc_tasks: [
    { id: "t1", student_id: P1, title: "Ask Ms. Lee for a recommendation", due_date: "2026-10-25", status: "pending", task_type: "counselor" },
  ],
}) as unknown as SupabaseClient;
const scope = { userId: U, profileIds: [P1, P2] } as const;

describe("journey tools", () => {
  it("reads_all_owned_profiles_for_conflicts", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("check_plan_conflicts", {});
    expect(r.status).toBe("ok");
    expect(r.data).toMatchObject({ conflict: true, reaSchool: "Harvard University", conflictingSchools: ["Northwestern University"] });
  });

  it("never reads another student's schools", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("list_my_schools", {});
    expect(JSON.stringify(r.data)).not.toContain("ss3");
  });

  it("labels catalog deadlines as unverified last-cycle values", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("list_my_schools", {});
    const schools = (r.data as { schools: { deadline: { value: string; status: string } }[] }).schools;
    expect(schools.every((s) => s.deadline.status === "unverified_last_cycle")).toBe(true);
  });

  it("orders next actions: conflict, then review revision, then dated task", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("get_journey_state", {});
    const actions = (r.data as { nextActions: { reasonCode: string; dueDate: string | null }[] }).nextActions;
    expect(actions.map((a) => a.reasonCode)).toEqual(["resolve_plan_conflict", "revise_after_review", "complete_task"]);
    expect(actions[2].dueDate).toBe("2026-10-25");
    expect(r.evidence).toContainEqual(expect.objectContaining({ kind: "task_due_date", value: "2026-10-25" }));
  });

  it("reports essay stall days without exposing draft text", async () => {
    const r = await makeJourneyTools(seed(), scope, now)("get_essay_status", {});
    const e = (r.data as { essays: Record<string, unknown>[] }).essays[0];
    expect(e).toMatchObject({ id: "e1", daysSinceUpdate: 15, reviewState: "changes_requested" });
    expect(e).not.toHaveProperty("current_draft");
  });

  it("returns unknown, not an empty success, when the student has no profile", async () => {
    const r = await makeJourneyTools(seed(), { userId: U, profileIds: [] }, now)("get_journey_state", {});
    expect(r.status).toBe("unknown");
  });

  it("flag requires both the switch and the allowlist", () => {
    expect(isAgentS1User(U, { AGENT_S1_ENABLED: "1", AGENT_S1_USER_IDS: `x, ${U}` })).toBe(true);
    expect(isAgentS1User(U, { AGENT_S1_ENABLED: "0", AGENT_S1_USER_IDS: U })).toBe(false);
    expect(isAgentS1User(U, { AGENT_S1_ENABLED: "1", AGENT_S1_USER_IDS: "" })).toBe(false);
  });
});
