// scripts/agent-golden-run.ts
// Live golden run against the S1 loop. Spends provider money: requires
// AGENT_GOLDEN_BUDGET_USD (founder-approved) and runs on a synthetic test user only.
import seed from "../src/lib/cc/agent/golden/seed-40.json";
import { scoreCase, type GoldenCase } from "../src/lib/cc/agent/golden/score";

const budget = Number(process.env.AGENT_GOLDEN_BUDGET_USD ?? "0");
if (!(budget > 0)) {
  console.error("Refusing to run: set AGENT_GOLDEN_BUDGET_USD to a founder-approved amount.");
  process.exit(2);
}
const results = (seed as GoldenCase[]).map((c) => ({ id: c.id, question: c.question }));
console.log(`Prepared ${results.length} cases. Wire runS1Turn with a synthetic AuthScope and record { toolsCalled, text, evidenceValues } per case, then score with scoreCase.`);
void scoreCase;
