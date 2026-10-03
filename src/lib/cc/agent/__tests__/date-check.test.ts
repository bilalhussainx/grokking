// @vitest-environment node
// src/lib/cc/agent/__tests__/date-check.test.ts
import { it, expect } from "vitest";
import { redactUngroundedDates, echoCheck } from "../date-check";

it("strips_dates_absent_from_evidence", () => {
  const out = redactUngroundedDates({ text: "MIT EA is November 1. Start your list today.", cards: [] }, []);
  expect(out.text).not.toMatch(/November 1/);
  expect(out.text).toMatch(/I don't have a verified date for that yet/);
  expect(out.text).toMatch(/Start your list today/);
});

it("keeps_task_due_dates_from_tool_evidence", () => {
  const out = redactUngroundedDates({ text: "Your task is due 2026-10-25.", cards: [] }, [{ kind: "task_due_date", value: "2026-10-25" }]);
  expect(out.text).toBe("Your task is due 2026-10-25.");
});

it("checks card fields too", () => {
  const out = redactUngroundedDates({ text: "ok", cards: [{ title: "Due Jan 1, 2027" }] }, []);
  expect(JSON.stringify(out.cards)).not.toMatch(/Jan 1, 2027/);
});

it("echoCheck allows exactly the candidate it was given", async () => {
  const c = { text: "x", cards: [] };
  const v = await echoCheck(c, { locale: "en", evidence: [], priorReleased: [], signal: new AbortController().signal });
  expect(v).toEqual({ decision: "allow", result: { ...c, policyVersion: "s1-date-grounding-1" } });
});
