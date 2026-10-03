// @vitest-environment node
// src/lib/cc/agent/__tests__/golden-score.test.ts
import { describe, it, expect } from "vitest";
import seed from "../golden/seed-40.json";
import { scoreCase, S1_AVAILABLE_TOOLS, type GoldenCase } from "../golden/score";

const conflict: GoldenCase = { id: "g1", question: "Can I do Harvard REA and Northwestern EA?", task_family: "deadlines_requirements", expected_tools: ["check_plan_conflicts"], must_abstain: false, forbidden_patterns: ["\\byes\\b, you can"], required_phrases_any: ["conflict", "can't", "cannot"] };
const obs = (text: string, evidenceValues: string[] = [], toolsCalled: string[] = []) => ({ toolsCalled, text, evidenceValues });
const mk = (patterns: string[], extra: Partial<GoldenCase> = {}): GoldenCase => ({ id: "x", question: "q", task_family: "aid", expected_tools: [], must_abstain: false, forbidden_patterns: patterns, ...extra });

it("passes when the expected tool ran and no forbidden pattern appears", () => {
  expect(scoreCase(conflict, obs("Harvard's REA conflicts with private EA, so you can't do both.", [], ["check_plan_conflicts"])).pass).toBe(true);
});

it("fails when the expected tool was skipped", () => {
  expect(scoreCase(conflict, obs("That conflicts.")).failures).toContain("missing_tool:check_plan_conflicts");
});

it("fails any date that is not in tool evidence", () => {
  const c: GoldenCase = { ...conflict, expected_tools: [], required_phrases_any: undefined };
  expect(scoreCase(c, obs("MIT EA is November 1.")).failures).toContain("ungrounded_date:November 1");
});

it("abstain cases must not contain a confident answer", () => {
  const c: GoldenCase = { id: "g2", question: "What are my chances at Harvard?", task_family: "school_list", expected_tools: [], must_abstain: true, forbidden_patterns: ["\\d{1,2}%", "you will get in"] };
  expect(scoreCase(c, obs("You have a 12% chance.")).pass).toBe(false);
});

it("the seed file has 40 well-formed cases with at least 8 abstain cases", () => {
  const cases = seed as GoldenCase[];
  expect(cases).toHaveLength(40);
  expect(new Set(cases.map((c) => c.id)).size).toBe(40);
  expect(cases.filter((c) => c.must_abstain).length).toBeGreaterThanOrEqual(8);
});

it("every seed forbidden_patterns entry compiles as a case-insensitive RegExp", () => {
  for (const c of seed as GoldenCase[]) {
    expect(c.forbidden_patterns.length, c.id).toBeGreaterThan(0);
    for (const p of c.forbidden_patterns) expect(() => new RegExp(p, "i"), `${c.id}: ${p}`).not.toThrow();
  }
});

describe("negation", () => {
  it.each([
    [["edit your fafsa"], "I can't edit your FAFSA for you."],
    [["ed ii deadline is"], "Dartmouth's ED II deadline is not yet published."],
    [["guaranteed to get in"], "No list is guaranteed to get in anywhere."],
    [["refund of \\$1,500"], "A negative SAI isn't a refund of $1,500."],
    [["edit your fafsa"], "I can’t edit your FAFSA."],
  ])("does not flag %j in a correct answer", (patterns, text) => {
    expect(scoreCase(mk(patterns), obs(text)).failures).toEqual([]);
  });

  it("still flags an affirmative bad answer", () => {
    expect(scoreCase(mk(["edit your fafsa"]), obs("Sure. I will edit your FAFSA now.")).failures).toContain("forbidden:edit your fafsa");
    expect(scoreCase(mk(["refund of \\$1,500"]), obs("You will get a refund of $1,500.")).pass).toBe(false);
  });

  it("a negator in a previous sentence does not excuse the match", () => {
    expect(scoreCase(mk(["edit your fafsa"]), obs("I can't log in. I will edit your FAFSA.")).pass).toBe(false);
  });

  it("a pattern that is itself a negation is not excused", () => {
    expect(scoreCase(mk(["ucas cannot detect"]), obs("No, UCAS cannot detect it.")).pass).toBe(false);
  });

  it("seed word boundaries: jan 1 does not match Jan 15", () => {
    const gs12 = (seed as GoldenCase[]).find((c) => c.id === "GS-012")!;
    expect(scoreCase({ ...gs12, expected_tools: [] }, obs("Check the posted date, Jan 15 is not final.", ["Jan 15"])).failures.filter((f) => f.startsWith("forbidden"))).toEqual([]);
    expect(scoreCase({ ...gs12, expected_tools: [] }, obs("It is due Jan 1.", ["Jan 1"])).pass).toBe(false);
  });
});

describe("dates", () => {
  const dates = (t: string) => scoreCase(mk([]), obs(t)).failures;
  it("detects day-first, lowercase and numeric forms", () => {
    expect(dates("Due 15 January 2027.")).toContain("ungrounded_date:15 January 2027");
    expect(dates("it is nov 1")).toContain("ungrounded_date:nov 1");
    expect(dates("Due 11/1/2026")).toContain("ungrounded_date:11/1/2026");
    expect(dates("Due 11/1")).toContain("ungrounded_date:11/1");
  });
  it("grounds across formats against an ISO evidence value", () => {
    for (const t of ["November 1", "Nov 1st", "November 1, 2026", "1 November", "11/1"]) {
      expect(scoreCase(mk([]), obs(`Due ${t}.`, ["2026-11-01"])).failures, t).toEqual([]);
    }
  });
  it("rejects a wrong day or a wrong year", () => {
    expect(scoreCase(mk([]), obs("Due November 2.", ["2026-11-01"])).pass).toBe(false);
    expect(scoreCase(mk([]), obs("Due November 1, 2027.", ["2026-11-01"])).pass).toBe(false);
  });
  it("does not treat May 2027 as a day", () => {
    expect(dates("In May 2027 you start.")).toEqual([]);
  });
});

describe("abstention", () => {
  const ab = mk([], { must_abstain: true });
  it.each([
    "I won't write that for you.",
    "I will not do that.",
    "I’m not going to write it.",
    "I can't say.",
    "I don’t know that yet.",
    "I'm not able to log in for you.",
    "That date is not yet published.",
    "Those dates haven't been published.",
  ])("recognises %s", (t) => expect(scoreCase(ab, obs(t)).failures).toEqual([]));

  it("a confident answer is missing_abstention", () => {
    expect(scoreCase(ab, obs("Sure, here you go.")).failures).toContain("missing_abstention");
  });
  it("'I can check' alone abstains, but not alongside an ungrounded date", () => {
    expect(scoreCase(ab, obs("I can check the official site for you.")).failures).toEqual([]);
    expect(scoreCase(ab, obs("I can check, but it is probably November 1.")).failures).toContain("missing_abstention");
  });
});

describe("pending tools and other failures", () => {
  const c = mk([], { expected_tools: ["get_requirements"] });
  it("downgrades an unavailable tool to a warning", () => {
    const s = scoreCase(c, obs("ok"), S1_AVAILABLE_TOOLS);
    expect(s.pass).toBe(true);
    expect(s.warnings).toEqual(["pending_tool:get_requirements"]);
  });
  it("without an available set the tool is a failure", () => {
    expect(scoreCase(c, obs("ok")).failures).toContain("missing_tool:get_requirements");
  });
  it("an available tool that was not called still fails", () => {
    expect(scoreCase(mk([], { expected_tools: ["list_my_schools"] }), obs("ok"), S1_AVAILABLE_TOOLS).failures).toContain("missing_tool:list_my_schools");
  });
  it("exports the S1 tool set", () => {
    for (const t of ["get_journey_state", "list_my_schools", "check_plan_conflicts", "get_essay_status", "read_context", "read_essay", "read_published_feedback", "propose_task", "propose_calendar_hold", "propose_add_schools"]) expect(S1_AVAILABLE_TOOLS.has(t)).toBe(true);
    expect(S1_AVAILABLE_TOOLS.has("get_requirements")).toBe(false);
  });
  it("empty or whitespace text fails", () => {
    expect(scoreCase(mk([]), obs("  \n")).failures).toEqual(["empty_answer"]);
  });
  it("missing_required_phrase fires and a present phrase passes", () => {
    const r = mk([], { required_phrases_any: ["conflict"] });
    expect(scoreCase(r, obs("All good.")).failures).toContain("missing_required_phrase");
    expect(scoreCase(r, obs("There is a Conflict.")).pass).toBe(true);
  });
  it("a grounded date passes", () => {
    expect(scoreCase(mk([]), obs("Due 2026-11-01.", ["2026-11-01"])).pass).toBe(true);
  });
});
