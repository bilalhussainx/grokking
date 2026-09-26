// Every fixed-column Essay Studio grid must carry kl-studio-grid, which
// collapses it to one column below 1024px (QA-07). jsdom does no layout, so
// the real check is a 375px browser measurement; this pins the class usage.
import { describe, it, expect } from "vitest";
import fs from "node:fs";

const FILES = [
  "src/app/cc/essays/[id]/page.tsx",
  "src/components/cc/essay/BrainstormChat.tsx",
  "src/components/cc/essay/DraftEditor.tsx",
  "src/components/cc/essay/OutlinePicker.tsx",
];

describe("Essay Studio grids are responsive", () => {
  it.each(FILES)("%s", (file) => {
    const src = fs.readFileSync(file, "utf8");
    const grids = [...src.matchAll(/<div[^>]*gridTemplateColumns[^>]*>/g)].map((m) => m[0]);
    expect(grids.length).toBeGreaterThan(0);
    for (const g of grids) expect(g).toContain("kl-studio-grid");
  });

  it("tokens.css defines the mobile rules", () => {
    const css = fs.readFileSync("src/app/tokens.css", "utf8");
    expect(css).toMatch(/@media \(max-width: 1023px\)[\s\S]*\.kl-studio-grid/);
    expect(css).toMatch(/@media \(max-width: 640px\)[\s\S]*\.kl-bs-subhead/);
  });
});
