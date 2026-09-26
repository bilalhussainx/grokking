// At 375px the footer links row (5 links, no wrap) was 396px wide in a 311px
// column and pushed the page 53px wide. Pin the phone-width wrap rules; the
// real check is a 375px browser measurement (scrollWidth === 375).
import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("marketing footer at phone width", () => {
  it("wraps its links and lets grid children shrink below 640px", () => {
    const css = fs.readFileSync("src/components/marketing/marketing.css", "utf8");
    const phone = css.slice(css.lastIndexOf("@media (max-width: 640px)"));
    expect(css.lastIndexOf("@media (max-width: 640px)")).toBeGreaterThan(-1);
    expect(phone).toMatch(/\.kl-mkt-foot-links\s*\{[^}]*flex-wrap:\s*wrap/);
    expect(phone).toMatch(/\.kl-mkt-foot-inner > \*\s*\{[^}]*min-width:\s*0/);
  });
});
