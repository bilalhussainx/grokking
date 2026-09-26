// add_credits / deduct_credits are SECURITY DEFINER and take any user id, so
// they must be callable only with the service role (verified 2026-09-25: the
// anon key could execute get_credit_balance in production, and no migration
// revoked the write functions). Browser/user-scoped clients must never call
// them; the lockdown migration revokes EXECUTE from anon/authenticated.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ALLOWED = new Set(
  [
    "src/lib/credits.ts",
    "src/app/api/auth/ensure-profile/route.ts",
    "src/app/api/invite/redeem/route.ts",
    "src/app/api/call/status/route.ts",
  ].map((p) => path.normalize(p)),
);

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === "__tests__" || p === path.join("src", "data") ? [] : files(p);
    return /\.tsx?$/.test(d.name) ? [p] : [];
  });
}

describe("credit RPC lockdown", () => {
  it("only service-role server modules call add_credits / deduct_credits", () => {
    const offenders = files("src").filter(
      (f) => /rpc\(\s*["'](add_credits|deduct_credits)["']/.test(fs.readFileSync(f, "utf8")) && !ALLOWED.has(f),
    );
    expect(offenders).toEqual([]);
  });

  it("a migration revokes EXECUTE on the write functions from anon and authenticated", () => {
    const sql = fs.readFileSync("supabase/migrations/20260925_lock_down_credit_rpcs.sql", "utf8");
    expect(sql).toMatch(/REVOKE EXECUTE ON FUNCTION public\.add_credits\(uuid, int, text\) FROM PUBLIC, anon, authenticated/i);
    expect(sql).toMatch(/REVOKE EXECUTE ON FUNCTION public\.deduct_credits\(uuid, int, text, text\) FROM PUBLIC, anon, authenticated/i);
    expect(sql).toMatch(/GRANT EXECUTE ON FUNCTION public\.add_credits\(uuid, int, text\) TO service_role/i);
  });
});
