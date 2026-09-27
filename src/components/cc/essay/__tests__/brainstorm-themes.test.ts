// Pre-deploy workflow test (2026-09-27): on the live turn the coach asked
// "which of these feels most like…" but no theme chips appeared, because the
// streamed message was stored with the themes block already stripped, so the
// theme detector had nothing to read. After a reload the chips appeared but
// the raw <<THEMES_READY>> markers showed in the bubble. Messages now keep
// the raw text; only the rendered bubble hides the markers.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { parseThemesBlock, visibleText } from "../BrainstormChat";

const RAW = "Here are three directions.\n<<THEMES_READY>>\n1. The bike shop\n2. Fixing things for others\n<<END_THEMES>>\nWhich of these feels most like the essay you want to write?";

describe("brainstorm themes", () => {
  it("finds the themes in a stored raw message", () => {
    expect(parseThemesBlock(RAW).themes.length).toBeGreaterThanOrEqual(2);
  });

  it("never shows the markers in the bubble", () => {
    expect(visibleText(RAW)).not.toMatch(/<<|>>/);
    expect(visibleText(RAW)).toContain("Which of these feels most like");
  });

  it("hides a themes block that is still streaming in", () => {
    const partial = "Here are three directions.\n<<THEMES_READY>>\n1. The bike";
    expect(visibleText(partial)).toBe("Here are three directions.");
  });

  it("stores the raw streamed text and renders visibleText", () => {
    const src = fs.readFileSync("src/components/cc/essay/BrainstormChat.tsx", "utf8");
    expect(src).toMatch(/updated\[updated\.length - 1\] = \{ role: "assistant", content: aiText \}/);
    expect(src).toMatch(/renderRich\(msg\.role === "assistant" \? visibleText\(msg\.content\) : msg\.content\)/);
  });
});
