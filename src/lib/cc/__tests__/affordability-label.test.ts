// Net price showed the raw stored value "under_10k" to students.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { affordabilityLabel } from "../affordability";

describe("affordabilityLabel", () => {
  it("turns stored values into the words the student picked", () => {
    expect(affordabilityLabel("under_10k")).toBe("Under $10,000/year");
    expect(affordabilityLabel("zero")).toBe("$0 — I need full financial aid");
  });
  it("says 'Not set' for nothing or an unknown value", () => {
    expect(affordabilityLabel(null)).toBe("Not set");
    expect(affordabilityLabel("mystery")).toBe("Not set");
  });
  it("the net-price estimator uses it", () => {
    expect(fs.readFileSync("src/components/cc/net-price/NetPriceEstimator.tsx", "utf8")).toMatch(/affordabilityLabel\(data\.inputs\.affordabilityValue\)/);
  });
});
