// /ref/<code> set a cookie from a page component, which Next forbids, so every
// referral link returned HTTP 500 (pre-deploy workflow test, 2026-09-27).
// It is now a route handler: remember a real code for 30 days, go to signup.
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";

const call = (code: string) =>
  GET(new NextRequest(`http://l/ref/${code}`), { params: Promise.resolve({ code }) });

describe("referral link", () => {
  it("remembers the code and sends the visitor to signup", async () => {
    const res = await call("KAIROS-AB12");
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/signup");
    expect(res.headers.get("set-cookie")).toMatch(/referral_code=KAIROS-AB12/);
  });

  it("ignores junk codes like 'null' instead of storing them", async () => {
    const res = await call("null");
    expect(res.status).toBe(307);
    expect(res.headers.get("set-cookie") ?? "").not.toMatch(/referral_code=/);
  });
});
