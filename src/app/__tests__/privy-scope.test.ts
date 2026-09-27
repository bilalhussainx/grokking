// The Privy wallet SDK (and Coinbase's base-account SDK it pulls in) logged
// COOP errors on every page. Its only user, /credentials, was retired with the
// study-courses product (2026-09-26), so no route may mount it.
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs";

describe("Privy is not mounted", () => {
  it("no app file mounts PrivyProvider", () => {
    const files = execSync("git ls-files src/app", { encoding: "utf8" }).split("\n")
      .filter((f) => /\.tsx?$/.test(f) && !f.includes("__tests__") && fs.existsSync(f));
    expect(files.filter((f) => /PrivyProvider/.test(fs.readFileSync(f, "utf8")))).toEqual([]);
  });
});
