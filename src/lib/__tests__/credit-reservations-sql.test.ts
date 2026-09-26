// Static pins for the reservation SQL (the behavioral SQL test needs Docker:
// tests/billing-local/credit-reservations.sql).
import { describe, it, expect } from "vitest";
import fs from "node:fs";

const sql = fs.readFileSync("supabase/migrations/20260925_credit_reservations.sql", "utf8");
const body = (fn: string) => sql.slice(sql.indexOf(`FUNCTION public.${fn}(`), sql.indexOf("END; $$;", sql.indexOf(`FUNCTION public.${fn}(`)));

describe("credit reservation SQL", () => {
  it("reserve takes the per-user lock before looking for an existing reservation (concurrent replays return ok)", () => {
    const b = body("reserve_credits");
    expect(b.indexOf("FROM user_credits")).toBeGreaterThan(-1);
    expect(b.indexOf("FROM user_credits")).toBeLessThan(b.indexOf("FROM credit_reservations"));
  });

  it("releasing an unknown key records a released tombstone so a late reserve can't hold credits", () => {
    const b = body("release_credits");
    expect(b).toMatch(/IF NOT FOUND THEN[\s\S]*?INSERT INTO credit_reservations[\s\S]*'released'[\s\S]*RETURN 'ok'/);
    expect(body("reserve_credits")).toMatch(/r\.state = 'released' THEN RETURN 'already_released'/);
  });

  it("pins search_path with pg_temp last and grants only the service role", () => {
    expect(sql.match(/SET search_path = public, pg_temp/g)?.length).toBe(3);
    expect(sql).toMatch(/GRANT EXECUTE ON FUNCTION public\.reserve_credits\(uuid, text, int\)[\s\S]*TO service_role/);
  });
});
