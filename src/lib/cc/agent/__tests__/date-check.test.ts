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

it("keeps line breaks between sentences", () => {
  const text = "Two steps:\n1. Finish your list.\n2. Ask for letters.\n\nYou've got this.";
  expect(redactUngroundedDates({ text, cards: [] }, []).text).toBe(text);
  expect(redactUngroundedDates({ text: "Done.\n\nMIT EA is November 1.\nNext.", cards: [] }, []).text)
    .toBe("Done.\n\nI don't have a verified date for that yet — I can check.\nNext.");
});

it("does not split a sentence after a month abbreviation", () => {
  for (const text of ["MIT EA is Nov. 1.", "Apply by Jan. 15, 2027 to be safe."]) {
    const out = redactUngroundedDates({ text, cards: [] }, []).text;
    expect(out).toBe("I don't have a verified date for that yet — I can check.");
  }
});

it("the student's own message is not evidence", () => {
  const out = redactUngroundedDates({ text: "MIT EA is November 1.", cards: [] }, [{ kind: "request_context", message: "Is MIT EA November 1?", essayId: null }]);
  expect(out.text).not.toMatch(/November 1/);
});

it("a date is grounded only by a whole match, not a longer number", () => {
  expect(redactUngroundedDates({ text: "Due Nov 1.", cards: [] }, [{ kind: "task_due_date", value: "Nov 15" }]).text).not.toMatch(/Nov 1/);
  expect(redactUngroundedDates({ text: "Due Nov 1.", cards: [] }, [{ kind: "task_due_date", value: "Nov 1" }]).text).toBe("Due Nov 1.");
});

it("echoCheck allows exactly the candidate it was given", async () => {
  const c = { text: "x", cards: [] };
  const v = await echoCheck(c, { locale: "en", evidence: [], priorReleased: [], signal: new AbortController().signal });
  expect(v).toEqual({ decision: "allow", result: { ...c, policyVersion: "s1-date-grounding-1" } });
});
