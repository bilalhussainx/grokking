import { describe, it, expect } from "vitest";
import { slugifyAgencyName } from "../agency-slug";

describe("slugifyAgencyName", () => {
  it("kebab-cases and strips punctuation", () =>
    expect(slugifyAgencyName("Ad Astra Counseling, LLC")).toBe("ad-astra-counseling-llc"));
  it("strips accents", () => expect(slugifyAgencyName("Académie Rivière")).toBe("academie-riviere"));
  it("caps at 40 chars with no trailing hyphen", () => {
    expect(slugifyAgencyName("x".repeat(60))).toHaveLength(40);
    expect(slugifyAgencyName("ab ".repeat(30)).endsWith("-")).toBe(false);
  });
  it("always satisfies the API's slug rule or is too short to submit", () => {
    for (const n of ["Ad Astra", "  --  ", "مركز", "A1"]) {
      const s = slugifyAgencyName(n);
      expect(s === "" || /^[a-z0-9-]+$/.test(s)).toBe(true);
    }
  });
});
