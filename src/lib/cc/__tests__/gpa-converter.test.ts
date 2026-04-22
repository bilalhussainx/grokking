import { describe, it, expect } from "vitest";
import {
  convertToUS4,
  detectGradingSystem,
  convertPercentageToGPA,
  formatRawGPADisplay,
} from "../gpa-converter";

describe("convertToUS4", () => {
  describe("percentage system", () => {
    it("converts 95% to 3.8-4.0 range", () => {
      const result = convertToUS4("percentage", 95);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.8);
      expect(result.gpaHigh).toBeLessThanOrEqual(4.0);
      expect(result.confidence).toBe("approximate");
    });

    it("converts 82% to 3.3-3.5 range", () => {
      const result = convertToUS4("percentage", 82);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.0);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.7);
    });

    it("converts 72% to 2.7-3.3 range", () => {
      const result = convertToUS4("percentage", 72);
      expect(result.gpaLow).toBeGreaterThanOrEqual(2.5);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.3);
    });

    it("converts 55% to below 2.0", () => {
      const result = convertToUS4("percentage", 55);
      expect(result.gpaHigh).toBeLessThan(2.0);
    });

    it("clamps at 4.0 for 100%", () => {
      const result = convertToUS4("percentage", 100);
      expect(result.gpaHigh).toBe(4.0);
    });
  });

  describe("cgpa10 system", () => {
    it("converts 8.5 CGPA to ~3.4", () => {
      const result = convertToUS4("cgpa10", 8.5);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.2);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.6);
    });

    it("converts 10.0 CGPA to 4.0", () => {
      const result = convertToUS4("cgpa10", 10);
      expect(result.gpaHigh).toBe(4.0);
    });

    it("converts 6.0 CGPA to ~2.4", () => {
      const result = convertToUS4("cgpa10", 6.0);
      expect(result.gpaLow).toBeGreaterThanOrEqual(2.0);
      expect(result.gpaHigh).toBeLessThanOrEqual(2.8);
    });
  });

  describe("a-levels system", () => {
    it("converts A* (6) to 4.0", () => {
      const result = convertToUS4("a-levels", 6);
      expect(result.gpaHigh).toBe(4.0);
    });

    it("converts B (4) to ~3.3", () => {
      const result = convertToUS4("a-levels", 4);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.0);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.5);
    });
  });

  describe("ib system", () => {
    it("converts 7 to 4.0", () => {
      const result = convertToUS4("ib", 7);
      expect(result.gpaHigh).toBe(4.0);
    });

    it("converts 5 to ~3.3", () => {
      const result = convertToUS4("ib", 5);
      expect(result.gpaLow).toBeGreaterThanOrEqual(3.0);
      expect(result.gpaHigh).toBeLessThanOrEqual(3.5);
    });
  });
});

describe("convertPercentageToGPA", () => {
  it("converts 87% to 3.48 with Excellent band", () => {
    const r = convertPercentageToGPA(87);
    expect(r.gpaPrecise).toBe(3.48);
    expect(r.band).toBe("Excellent");
    expect(r.usCourseContext).toMatch(/A-/);
    expect(r.howCollegesEvaluate).toMatch(/80–89%|80-89%/);
  });

  it("converts 95% to 3.8 with Outstanding band", () => {
    const r = convertPercentageToGPA(95);
    expect(r.gpaPrecise).toBe(3.8);
    expect(r.band).toBe("Outstanding");
  });

  it("converts 55% to 2.2 with Satisfactory band", () => {
    const r = convertPercentageToGPA(55);
    expect(r.gpaPrecise).toBe(2.2);
    expect(r.band).toBe("Satisfactory");
  });

  it("converts 100% to 4.0 with Outstanding band", () => {
    const r = convertPercentageToGPA(100);
    expect(r.gpaPrecise).toBe(4);
    expect(r.band).toBe("Outstanding");
  });

  it("89% is still Excellent (upper boundary)", () => {
    expect(convertPercentageToGPA(89).band).toBe("Excellent");
  });

  it("90% is Outstanding (lower boundary)", () => {
    expect(convertPercentageToGPA(90).band).toBe("Outstanding");
  });

  it("throws for -1", () => {
    expect(() => convertPercentageToGPA(-1)).toThrow();
  });

  it("throws for 101", () => {
    expect(() => convertPercentageToGPA(101)).toThrow();
  });
});

describe("formatRawGPADisplay", () => {
  it("renders percentage with country context for Pakistan", () => {
    expect(formatRawGPADisplay("percentage", 87, "PK")).toBe("87% (Pakistani)");
  });

  it("renders percentage without country when unknown", () => {
    expect(formatRawGPADisplay("percentage", 87)).toBe("87%");
  });

  it("renders CGPA /10 display", () => {
    expect(formatRawGPADisplay("cgpa10", 8.5)).toBe("8.5 / 10 CGPA");
  });

  it("renders A-Levels display", () => {
    expect(formatRawGPADisplay("a-levels", 6)).toMatch(/A-Level/);
  });

  it("renders IB display", () => {
    expect(formatRawGPADisplay("ib", 7)).toMatch(/IB/);
  });
});

describe("detectGradingSystem", () => {
  it("returns percentage for Pakistan", () => {
    expect(detectGradingSystem("PK")).toBe("percentage");
  });

  it("returns percentage for India", () => {
    expect(detectGradingSystem("IN")).toBe("percentage");
  });

  it("returns a-levels for UK", () => {
    expect(detectGradingSystem("GB")).toBe("a-levels");
  });

  it("returns null for US", () => {
    expect(detectGradingSystem("US")).toBeNull();
  });
});
