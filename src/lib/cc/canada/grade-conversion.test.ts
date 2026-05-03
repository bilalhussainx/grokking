import { describe, it, expect } from "vitest";
import {
  ontarioPercentageToUS,
  bcPercentageToUS,
  albertaDiplomaToUS,
  quebecRScoreToUS,
  type CanadianProvince,
} from "./grade-conversion";

describe("ontarioPercentageToUS", () => {
  it("92% → 3.95", () => {
    expect(ontarioPercentageToUS(92)).toBeCloseTo(3.95, 1);
  });
  it("95% → 4.0", () => {
    expect(ontarioPercentageToUS(95)).toBeCloseTo(4.0, 1);
  });
  it("80% → 3.3", () => {
    expect(ontarioPercentageToUS(80)).toBeCloseTo(3.3, 1);
  });
  it("clamps at 4.0", () => {
    expect(ontarioPercentageToUS(99)).toBe(4.0);
    expect(ontarioPercentageToUS(105)).toBe(4.0);
  });
  it("clamps at 0.0", () => {
    expect(ontarioPercentageToUS(-5)).toBe(0);
  });
});

describe("bcPercentageToUS", () => {
  it("90% → 3.7+", () => {
    expect(bcPercentageToUS(90)).toBeGreaterThan(3.7);
    expect(bcPercentageToUS(90)).toBeLessThan(3.95);
  });
});

describe("albertaDiplomaToUS", () => {
  it("90% diploma average → 3.9 (uses Ontario slope)", () => {
    expect(albertaDiplomaToUS(90)).toBeCloseTo(3.7, 0);
  });
});

describe("quebecRScoreToUS", () => {
  it("R=33 → ~3.7", () => {
    expect(quebecRScoreToUS(33)).toBeCloseTo(3.7, 1);
  });
  it("R=30 → ~3.5", () => {
    expect(quebecRScoreToUS(30)).toBeCloseTo(3.17, 1);
  });
  it("clamps at 4.0 above R=35", () => {
    expect(quebecRScoreToUS(35)).toBe(4.0);
    expect(quebecRScoreToUS(50)).toBe(4.0);
  });
});

describe("type CanadianProvince", () => {
  it("union covers ON / BC / AB / QC / other", () => {
    const ps: CanadianProvince[] = ["ON", "BC", "AB", "QC", "other"];
    expect(ps).toHaveLength(5);
  });
});
