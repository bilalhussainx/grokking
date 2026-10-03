// @vitest-environment node
// src/lib/cc/agent/__tests__/contracts.test.ts
import { describe, it, expect } from "vitest";
import { denyAllCheck, type Candidate, type CheckContext } from "../contracts";

describe("Agent Contracts", () => {
  it("denyAllCheck always returns uncertain decision to prevent production leakage", async () => {
    const candidate: Candidate = {
      text: "Here is your essay outline",
      cards: []
    };
    const context: CheckContext = {
      locale: "en",
      evidence: [],
      priorReleased: [],
      signal: new AbortController().signal
    };

    const checkResult = await denyAllCheck(candidate, context);
    expect(checkResult.decision).toBe("uncertain");
    if (checkResult.decision === "uncertain") {
      expect(checkResult.reason).toContain("Internal test-only checker stub");
    }
  });
});
