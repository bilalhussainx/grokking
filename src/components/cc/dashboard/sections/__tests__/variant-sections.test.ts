// src/components/cc/dashboard/sections/__tests__/variant-sections.test.ts
import { describe, it, expect } from "vitest";
import { SECTION_ORDER, SECTION_REGISTRY } from "../variant-sections";

describe("SECTION_ORDER", () => {
  it("covers every variant", () => {
    const variants = ["g9", "g10", "junior", "senior_writing", "senior_post_submit", "senior_decisions", "transfer", "unknown"] as const;
    for (const v of variants) {
      expect(SECTION_ORDER[v], `missing variant ${v}`).toBeDefined();
      expect(SECTION_ORDER[v].length).toBeGreaterThan(0);
    }
  });
  it("every referenced SectionId resolves to a registered component", () => {
    for (const ids of Object.values(SECTION_ORDER)) {
      for (const id of ids) {
        expect(SECTION_REGISTRY[id], `missing component for ${id}`).toBeDefined();
      }
    }
  });
  it("PriorityWidgetRow comes after SchoolCardGrid for variants that have both", () => {
    for (const variant of ["junior", "senior_writing", "senior_post_submit", "senior_decisions", "transfer"] as const) {
      const ids = SECTION_ORDER[variant];
      const schoolIdx = ids.indexOf("SchoolCardGrid");
      const widgetIdx = ids.indexOf("PriorityWidgetRow");
      if (schoolIdx >= 0 && widgetIdx >= 0) {
        expect(widgetIdx, `${variant} priority widgets must come after schools`).toBeGreaterThan(schoolIdx);
      }
    }
  });
  it("g9 + g10 use CourseRigorGrid, not SchoolCardGrid", () => {
    expect(SECTION_ORDER.g9).toContain("CourseRigorGrid");
    expect(SECTION_ORDER.g9).not.toContain("SchoolCardGrid");
    expect(SECTION_ORDER.g10).toContain("CourseRigorGrid");
    expect(SECTION_ORDER.g10).not.toContain("SchoolCardGrid");
  });
  it("transfer has WhyTransferFeatured and SchoolCardGrid (post-list)", () => {
    expect(SECTION_ORDER.transfer).toContain("WhyTransferFeatured");
    expect(SECTION_ORDER.transfer).toContain("SchoolCardGrid");
  });
});
