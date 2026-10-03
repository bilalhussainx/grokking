// @vitest-environment node
// src/lib/cc/agent/__tests__/date-check.test.ts
import { describe, it, expect } from "vitest";
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

describe("C8: every common date format is redacted without evidence", () => {
  const REDACTED = "I don't have a verified date for that yet — I can check.";
  it.each([
    ["lowercase month", "Your MIT EA date is nov 1"],
    ["uppercase month", "MIT EA is NOVEMBER 1"],
    ["NBSP between month and day", "MIT EA is Nov 1"],
    ["tab between month and day", "MIT EA is Nov\t1"],
    ["newline between month and day", "MIT EA is November\n1"],
    ["dot with no space", "MIT EA is Nov.1"],
    ["dot with a space, lowercase", "MIT EA is nov. 1"],
    ["numeric month/day", "Stanford's regular deadline is 1/2"],
    ["numeric month/day/year", "Stanford's regular deadline is 01/11/2026"],
    ["numeric with a two-digit year", "Stanford's regular deadline is 11/1/26"],
    ["day-first ordinal", "MIT EA is the 1st November"],
    ["day-first ordinal with of", "MIT EA is the 1st of November"],
    ["day-first ordinal word with of", "MIT EA is the first of November"],
    ["ordinal word", "MIT EA is November first"],
    ["compound ordinal word", "Apply by January twenty-first"],
    ["thirty-first", "Apply by October thirty-first"],
  ])("%s", (_label, text) => {
    expect(redactUngroundedDates({ text, cards: [] }, []).text).toBe(REDACTED);
  });

  it("evidence 2026-11-01 grounds Nov 1, 11/1, November first and 1st November", () => {
    const ev = [{ kind: "task_due_date", value: "2026-11-01" }];
    for (const text of ["Your task is due Nov 1.", "Your task is due 11/1.", "Your task is due November first.", "Your task is due 1st November 2026.", "Your task is due nov. 1, 2026."]) {
      expect(redactUngroundedDates({ text, cards: [] }, ev).text).toBe(text);
    }
  });

  it("evidence for another day or year does not ground", () => {
    const ev = [{ kind: "task_due_date", value: "2026-11-01" }];
    for (const text of ["Due Nov 2.", "Due 11/2.", "Due Nov 1, 2027.", "Due 11/1/2027."]) {
      expect(redactUngroundedDates({ text, cards: [] }, ev).text).toBe(REDACTED);
    }
  });

  it("ISO timestamps in evidence still ground the day", () => {
    expect(redactUngroundedDates({ text: "Due Nov 1.", cards: [] }, [{ kind: "task_due_date", value: "2026-11-01T00:00:00Z" }]).text).toBe("Due Nov 1.");
  });

  it("fractions, GPAs, 24/7 and 'may' the verb are not dates", () => {
    for (const text of ["About 3/4 of applicants apply early.", "Your GPA is 3.8/4.0.", "I'm here 24/7.", "You may first want to finish your list.", "Option 1 may work best."]) {
      expect(redactUngroundedDates({ text, cards: [] }, []).text).toBe(text);
    }
  });
});

it("echoCheck allows exactly the candidate it was given", async () => {
  const c = { text: "x", cards: [] };
  const v = await echoCheck(c, { locale: "en", evidence: [], priorReleased: [], signal: new AbortController().signal });
  expect(v).toEqual({ decision: "allow", result: { ...c, policyVersion: "s1-date-grounding-1" } });
});
