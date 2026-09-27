// D3-IMPL-1.1 integration (Codex gate, 2026-09-27): one browser-safe source
// for the Pro fair-use numbers shared by server limits and homepage copy; the
// Daybreak footer replaces the old marketing footer; the manifest carries the
// BRAND-1 icons and colours.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { PRO_FAIR_USE } from "../pricing";
import { TIER_CAPS } from "../cc/tier-gate";
import manifest from "@/app/manifest";

describe("Pro fair use", () => {
  it("is exported once and the server limits default to it", () => {
    expect(PRO_FAIR_USE).toEqual({ coachMessagesPerDay: 300, voiceMinutesPerDay: 120 });
    expect(TIER_CAPS.pro.coachMessagesPerDay).toBe(PRO_FAIR_USE.coachMessagesPerDay);
    expect(TIER_CAPS.pro.coachVoiceMinutesPerDay).toBe(PRO_FAIR_USE.voiceMinutesPerDay);
  });
  it("the homepage states the numbers from the export, not literals", () => {
    const src = fs.readFileSync("src/components/marketing/daybreak/DaybreakHomepage.tsx", "utf8");
    expect(src).toMatch(/PRO_FAIR_USE\.coachMessagesPerDay/);
    expect(src).toMatch(/PRO_FAIR_USE\.voiceMinutesPerDay/);
  });
});

describe("footer", () => {
  it("marketing pages use the Daybreak footer; the dead shared Footer is gone", () => {
    const shell = fs.readFileSync("src/components/marketing/MarketingShell.tsx", "utf8");
    expect(shell).toMatch(/<DaybreakFooter \/>/);
    expect(shell).not.toMatch(/kl-mkt-foot-links/);
    expect(fs.existsSync("src/components/layout/Footer.tsx")).toBe(false);
  });
});

describe("installable app manifest", () => {
  it("uses the BRAND-1 icons and colours", () => {
    const m = manifest();
    expect(m.theme_color).toBe("#FFF7EE");
    expect(m.background_color).toBe("#FFF7EE");
    expect(m.icons).toEqual(expect.arrayContaining([
      { src: "/icons/kairos-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/kairos-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/kairos-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ]));
    for (const i of (m.icons ?? []).filter((i) => i.src.startsWith("/icons/"))) expect(fs.existsSync(`public${i.src}`)).toBe(true);
  });
  it("sets the Apple touch icon", () => {
    expect(fs.readFileSync("src/app/layout.tsx", "utf8")).toMatch(/apple:\s*["']\/icons\/apple-touch-icon\.png["']/);
  });
});
