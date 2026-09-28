// A counselor account has no cc_student_profiles row at all, so
// profileIncomplete is always true for them. /settings is shared by
// students and counselors (D4.2 Settings) and must stay reachable for a
// counselor; every other landing behaviour (e.g. "/" -> /counselor/dashboard)
// must be unchanged.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const h = vi.hoisted(() => ({
  user: null as null | { id: string; is_anonymous?: boolean },
  studentProfile: null as null | { language_picker_seen_at: string | null; grade_level: number | null },
  counselor: null as null | { id: string },
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser: async () => ({ data: { user: h.user } }) },
    from: (table: string) => {
      const q: Record<string, unknown> = {};
      for (const m of ["select", "eq", "in", "order", "limit"]) q[m] = () => q;
      q.maybeSingle = async () => {
        if (table === "cc_student_profiles") return { data: h.studentProfile };
        if (table === "cc_counselors") return { data: h.counselor };
        return { data: null };
      };
      q.single = q.maybeSingle;
      return q;
    },
  }),
}));

import { middleware } from "./middleware";

const location = (res: Response) => res.headers.get("location");

beforeEach(() => {
  h.user = null;
  h.studentProfile = null;
  h.counselor = null;
});

describe("counselor without a student profile", () => {
  it("reaches /settings without being redirected", async () => {
    h.user = { id: "counselor-1", is_anonymous: false };
    h.studentProfile = null; // no cc_student_profiles row
    h.counselor = { id: "c1" };

    const res = await middleware(new NextRequest("https://www.kairoslearn.com/settings"));

    expect(location(res)).toBeNull();
  });

  it("is still sent from / to /counselor/dashboard (unchanged landing behaviour)", async () => {
    h.user = { id: "counselor-1", is_anonymous: false };
    h.studentProfile = null;
    h.counselor = { id: "c1" };

    const res = await middleware(new NextRequest("https://www.kairoslearn.com/"));

    expect(new URL(location(res)!).pathname).toBe("/counselor/dashboard");
  });
});

describe("non-counselor with an incomplete profile", () => {
  it("is sent to /onboarding even on /settings (the settings exemption is counselor-only)", async () => {
    h.user = { id: "student-1", is_anonymous: false };
    h.studentProfile = null; // no cc_student_profiles row -> profileIncomplete
    h.counselor = null; // not a counselor either

    const res = await middleware(new NextRequest("https://www.kairoslearn.com/settings"));

    expect(new URL(location(res)!).pathname).toBe("/onboarding");
  });
});
