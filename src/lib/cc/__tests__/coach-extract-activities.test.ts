// The student writes their activities; the AI never writes application text.
// Extraction from a Coach chat may record an activity's name and role, but
// must leave the description empty and never rewrite one the student wrote.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "./helpers/fake-supabase";

const STUDENT = "5d000000-0000-4000-8000-000000000001";

const h = vi.hoisted(() => ({ world: null as unknown, prompts: [] as string[] }));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));
vi.mock("@/lib/cc/openrouter", () => ({
  chatOnce: async (messages: { role: string; content: string }[]) => {
    const system = messages[0]?.content ?? "";
    if (!/extracurricular/i.test(system)) return "{}";
    h.prompts.push(system);
    return JSON.stringify({
      activities: [
        {
          activity_type: "Music", organization: "Inter-school violin competitions", role: "Violinist",
          description_150: "Violinist; multiple inter-school competition wins; music as refuge navigating identity",
        },
        {
          activity_type: "Leadership", organization: "Student council", role: "President",
          description_150: "Led 40-member council; launched peer tutoring program reaching 200 students across grades",
        },
      ],
    });
  },
}));

import { runCoachExtraction } from "../coach-extract";

const world = () => h.world as FakeSupabase;

beforeEach(() => {
  h.prompts = [];
  h.world = createFakeSupabase({
    cc_coach_conversations: [
      { student_id: STUDENT, role: "user", content: "I play violin and won inter-school competitions. I'm also student council president.", mode: "general", created_at: "2026-10-03T10:00:00Z" },
    ],
    cc_activities: [
      { id: "act-1", student_id: STUDENT, position: 1, activity_type: "Leadership", organization: "Student council", role: "President", description_150: "I run meetings." },
    ],
    cc_student_schools: [],
    cc_schools: [],
  });
});

describe("Coach activity extraction", () => {
  it("records a new activity's name and role with an empty description", async () => {
    await runCoachExtraction(STUDENT, "general");
    const violin = world().tables.cc_activities.find((a) => a.role === "Violinist")!;
    expect(violin).toBeTruthy();
    expect(violin.organization).toBe("Inter-school violin competitions");
    expect(violin.description_150).toBe("");
  });

  it("never rewrites a description the student wrote", async () => {
    await runCoachExtraction(STUDENT, "general");
    expect(world().tables.cc_activities.find((a) => a.id === "act-1")!.description_150).toBe("I run meetings.");
  });

  it("does not ask the model to compose descriptions", async () => {
    await runCoachExtraction(STUDENT, "general");
    expect(h.prompts.length).toBe(1);
    expect(h.prompts[0]).not.toMatch(/RUBRIC STYLE|description_150|WRITE DESCRIPTIONS/i);
  });
});
