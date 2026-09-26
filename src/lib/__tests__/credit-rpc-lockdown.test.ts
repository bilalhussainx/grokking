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

  it("the migration drops the ambiguous 3-arg add_credits and revokes every overload from anon/authenticated", () => {
    const sql = fs.readFileSync("supabase/migrations/20260925_lock_down_credit_rpcs.sql", "utf8");
    // Production had add_credits(uuid,int,text) AND add_credits(uuid,int,text,text DEFAULT NULL):
    // every 3-arg call was ambiguous (PGRST203) and failed.
    expect(sql).toMatch(/DROP FUNCTION IF EXISTS public\.add_credits\(uuid, integer, text\);/);
    expect(sql).toMatch(/proname IN \('add_credits', 'deduct_credits'\)/);
    expect(sql).toMatch(/REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated/);
    expect(sql).toMatch(/GRANT EXECUTE ON FUNCTION %s TO service_role/);
  });
});
