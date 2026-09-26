// The Privy wallet SDK (and Coinbase's base-account SDK it pulls in) loaded on
// every page and logged COOP errors; only /credentials uses it.
import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("Privy is scoped to /credentials", () => {
  it("the global providers don't mount it", () => {
    expect(fs.readFileSync("src/app/providers.tsx", "utf8")).not.toMatch(/PrivyProvider/);
  });
  it("the credentials layout does", () => {
    const layout = fs.readFileSync("src/app/credentials/layout.tsx", "utf8");
    expect(layout).toMatch(/<PrivyProvider>\s*\{children\}\s*<\/PrivyProvider>/);
  });
});
