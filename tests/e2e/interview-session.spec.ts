import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Interview Session API", () => {
  test("POST /api/interviews/session returns 401 without auth", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/interviews/session`, {
      data: {
        companyPersonaId: "google-l4",
        category: "tech",
        interviewType: "technical",
      },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/interviews/run-code returns 401 without auth", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/interviews/run-code`, {
      data: {
        code: "print('hello')",
        language: "python",
        testCases: [{ input: "", expected_output: "hello" }],
      },
    });
    expect(res.status()).toBe(401);
  });

  test("PUT /api/interviews/session returns 401 without auth", async ({ request }) => {
    const res = await request.put(`${BASE_URL}/api/interviews/session`, {
      data: {
        sessionId: "fake-id",
        userMessage: "test",
        assistantMessage: "test",
      },
    });
    expect(res.status()).toBe(401);
  });

  test("Company personas all have sessionStructure", async () => {
    const { COMPANY_PERSONAS, GENERIC_PERSONA } = await import(
      "../../src/data/interview-personas"
    );

    // Generic persona
    expect(GENERIC_PERSONA.sessionStructure).toBeTruthy();
    expect(GENERIC_PERSONA.sessionStructure.totalMinutes).toBeGreaterThan(0);
    expect(GENERIC_PERSONA.sessionStructure.phases.length).toBeGreaterThan(0);
    expect(GENERIC_PERSONA.sessionStructure.interviewerBehavior).toBeTruthy();

    // All 14 company personas
    for (const persona of COMPANY_PERSONAS) {
      expect(persona.sessionStructure, `${persona.id} missing sessionStructure`).toBeTruthy();
      expect(persona.sessionStructure.totalMinutes, `${persona.id} totalMinutes`).toBeGreaterThan(0);
      expect(persona.sessionStructure.phases.length, `${persona.id} phases`).toBeGreaterThan(0);

      // Validate each phase
      for (const phase of persona.sessionStructure.phases) {
        expect(phase.name).toBeTruthy();
        expect(phase.minutes).toBeGreaterThan(0);
        expect(phase.questionCount).toBeGreaterThan(0);
        expect(['live_coding', 'whiteboard', 'discussion', 'star_method', 'system_design']).toContain(phase.format);
        expect(['fixed', 'adaptive', 'escalating']).toContain(phase.difficultyProgression);
      }

      // Validate interviewer behavior
      const behavior = persona.sessionStructure.interviewerBehavior;
      expect(behavior.silenceThresholdSec).toBeGreaterThan(0);
      expect(['socratic', 'direct', 'coded']).toContain(behavior.hintStyle);
      expect(behavior.followUpDepth).toBeGreaterThan(0);
      expect(behavior.evaluationFocus.length).toBeGreaterThan(0);
    }

    // Verify we have exactly 14 company personas
    expect(COMPANY_PERSONAS.length).toBe(14);
  });

  test("Interview types are correctly exported", async () => {
    // Verify the module loads and exports expected types
    const types = await import("../../src/types/interview");
    expect(types).toBeTruthy();
  });
});
