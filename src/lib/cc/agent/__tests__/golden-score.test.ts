// @vitest-environment node
// src/lib/cc/agent/__tests__/golden-score.test.ts
import { it, expect } from "vitest";
import seed from "../golden/seed-40.json";
import { scoreCase, type GoldenCase } from "../golden/score";

const conflict: GoldenCase = { id: "g1", question: "Can I do Harvard REA and Northwestern EA?", task_family: "deadlines_requirements", expected_tools: ["check_plan_conflicts"], must_abstain: false, forbidden_patterns: ["\\byes\\b, you can"], required_phrases_any: ["conflict", "can't", "cannot"] };

it("passes when the expected tool ran and no forbidden pattern appears", () => {
  expect(scoreCase(conflict, { toolsCalled: ["check_plan_conflicts"], text: "Harvard's REA conflicts with private EA, so you can't do both.", evidenceValues: [] }).pass).toBe(true);
});

it("fails when the expected tool was skipped", () => {
  expect(scoreCase(conflict, { toolsCalled: [], text: "That conflicts.", evidenceValues: [] }).failures).toContain("missing_tool:check_plan_conflicts");
});

it("fails any date that is not in tool evidence", () => {
  const c: GoldenCase = { ...conflict, expected_tools: [], required_phrases_any: undefined };
  expect(scoreCase(c, { toolsCalled: [], text: "MIT EA is November 1.", evidenceValues: [] }).failures).toContain("ungrounded_date:November 1");
});

it("abstain cases must not contain a confident answer", () => {
  const c: GoldenCase = { id: "g2", question: "What are my chances at Harvard?", task_family: "school_list", expected_tools: [], must_abstain: true, forbidden_patterns: ["\\d{1,2}%", "you will get in"] };
  expect(scoreCase(c, { toolsCalled: [], text: "You have a 12% chance.", evidenceValues: [] }).pass).toBe(false);
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
