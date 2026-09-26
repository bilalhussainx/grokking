// Admin routes used to fall back to secrets committed in the repo when the
// env var was unset, so anyone reading the source could call them.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { hasAdminSecret } from "@/lib/admin-secret";

vi.mock("@/lib/supabase-auth", () => ({ createAdminSupabase: () => { throw new Error("must not reach the DB"); } }));
vi.mock("@/lib/course-generator", () => ({ generateCourse: async () => { throw new Error("must not generate"); } }));

import { POST as inviteCodes } from "../invite-codes/route";
import { POST as leagueReset } from "../league-reset/route";
import { POST as seedCourses } from "../seed-courses/route";

const saved = { admin: process.env.ADMIN_SECRET, teacher: process.env.TEACHER_SECRET_KEY };
beforeEach(() => { delete process.env.ADMIN_SECRET; delete process.env.TEACHER_SECRET_KEY; });
afterEach(() => { process.env.ADMIN_SECRET = saved.admin; process.env.TEACHER_SECRET_KEY = saved.teacher; });

describe("hasAdminSecret", () => {
  it("fails closed when the env var is unset", () => expect(hasAdminSecret("anything", "ADMIN_SECRET")).toBe(false));
  it("fails closed on an empty env var", () => {
    process.env.ADMIN_SECRET = "";
    expect(hasAdminSecret("", "ADMIN_SECRET")).toBe(false);
  });
  it("accepts only the configured value", () => {
    process.env.ADMIN_SECRET = "s3cret-value";
    expect(hasAdminSecret("s3cret-value", "ADMIN_SECRET")).toBe(true);
    expect(hasAdminSecret("wrong", "ADMIN_SECRET")).toBe(false);
    expect(hasAdminSecret(null, "ADMIN_SECRET")).toBe(false);
  });
});

describe("admin routes reject the old in-repo secrets when env is unset", () => {
  const headerReq = (url: string) =>
    new NextRequest(url, { method: "POST", headers: { "x-admin-secret": "grokking-admin-2026" }, body: "{}" });

  it("invite-codes", async () => expect((await inviteCodes(headerReq("http://l/api/admin/invite-codes"))).status).toBe(403));
  it("league-reset", async () => expect((await leagueReset(headerReq("http://l/api/admin/league-reset"))).status).toBe(403));
  it("seed-courses", async () =>
    expect((await seedCourses(new Request("http://l/api/admin/seed-courses?key=GROK-TEACH-2026", { method: "POST" }))).status).toBe(401));
});
