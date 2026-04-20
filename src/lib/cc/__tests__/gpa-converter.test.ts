import { describe, it, expect } from "vitest";
import { convertToUS4, detectGradingSystem } from "../gpa-converter";

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
