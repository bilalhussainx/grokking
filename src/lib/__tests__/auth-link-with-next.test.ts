// A signed-out student opening an invite (/join/<code>) lands on
// /login?next=/join/<code>. The header "Sign Up" / "Sign In" links dropped
// that next=, so the invite was lost (pre-deploy workflow test, 2026-09-27).
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { authHrefKeepingNext } from "../safe-next";

describe("auth links keep the return path", () => {
  it("carries a safe next= over to signup", () => {
    expect(authHrefKeepingNext("/signup", "?next=%2Fjoin%2FQA-ABC")).toBe("/signup?next=%2Fjoin%2FQA-ABC");
  });
  it("drops unsafe or missing next", () => {
    expect(authHrefKeepingNext("/signup", "?next=%2F%2Fevil.com")).toBe("/signup");
    expect(authHrefKeepingNext("/signup", "")).toBe("/signup");
  });
  it("TopNav's auth links use it", () => {
    expect(fs.readFileSync("src/components/layout/TopNav.tsx", "utf8")).toMatch(/authHrefKeepingNext\("\/signup"/);
  });
});
