// Hardening: the old check compared against `Bearer ${CRON_SECRET ?? ""}`. In
// practice HTTP trims the trailing space so "Bearer " never matched, but the
// check relied on that; hasBearerSecret fails closed explicitly and in constant time.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { hasBearerSecret } from "@/lib/admin-secret";

vi.mock("@supabase/supabase-js", () => ({ createClient: () => { throw new Error("must not reach the DB"); } }));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => { throw new Error("must not reach the DB"); } }));

import { GET as reminders } from "../deadline-reminders/route";
import { GET as observations } from "../generate-observations/route";

beforeEach(() => vi.stubEnv("CRON_SECRET", ""));

describe("hasBearerSecret", () => {
  it("fails closed when unset", () => expect(hasBearerSecret("Bearer ", "CRON_SECRET")).toBe(false));
  it("accepts only the configured bearer", () => {
    vi.stubEnv("CRON_SECRET", "c-secret");
    expect(hasBearerSecret("Bearer c-secret", "CRON_SECRET")).toBe(true);
    expect(hasBearerSecret("Bearer nope", "CRON_SECRET")).toBe(false);
    expect(hasBearerSecret(null, "CRON_SECRET")).toBe(false);
  });
});

describe("cron routes with CRON_SECRET unset", () => {
  const req = (url: string) => new NextRequest(url, { headers: { authorization: "Bearer " } });
  it("deadline-reminders refuses an empty bearer", async () =>
    expect((await reminders(req("http://l/api/cron/deadline-reminders"))).status).toBe(403));
  it("generate-observations refuses an empty bearer", async () =>
    expect((await observations(req("http://l/api/cron/generate-observations"))).status).toBe(403));
});
