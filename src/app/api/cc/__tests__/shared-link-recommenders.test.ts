// A parent/counselor share link must list the student's recommenders. It used
// to order by cc_recommenders.created_at, which production lacks (42703), so
// the list always came back empty.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import { ALICE, ALICE_PROFILE } from "@/lib/cc/__tests__/helpers/fixtures";
import { GET } from "../shared/[token]/route";

const h = vi.hoisted(() => ({ world: null as unknown }));
vi.mock("@/lib/supabase-server", () => ({ createAdminSupabase: () => h.world }));

// Production's real cc_recommenders columns (probed 2026-09-25): no created_at.
const REC_COLUMNS = ["id", "student_id", "recommender_type", "name", "subject", "email", "status",
  "brag_sheet_url", "asked_at", "submitted_at", "waiver_signed", "waiver_decision_note",
  "ask_email_text", "reminder_email_text", "context_notes", "relationship"];

beforeEach(() => {
  h.world = createFakeSupabase(
    {
      cc_share_links: [{
        share_token: "tok", student_id: ALICE_PROFILE, is_active: true,
        visible_sections: { recommendations: true },
      }],
      cc_student_profiles: [{ id: ALICE_PROFILE, user_id: ALICE, preferred_name: "Alice" }],
      cc_recommenders: [
        { id: "r2", student_id: ALICE_PROFILE, name: "Ms. Rivera", recommender_type: "teacher", subject: "Math", status: "asked" },
        { id: "r1", student_id: ALICE_PROFILE, name: "Mr. Chen", recommender_type: "teacher", subject: "History", status: "considering" },
      ],
    },
    { columns: { cc_recommenders: REC_COLUMNS } },
  );
});

describe("GET /api/cc/shared/[token] recommendations", () => {
  it("lists the student's recommenders against production's real columns", async () => {
    const res = await GET(new NextRequest("http://localhost/api/cc/shared/tok"), {
      params: Promise.resolve({ token: "tok" }),
    });
    const json = (await res.json()) as { recommendations: { name: string }[] };
    expect(res.status).toBe(200);
    expect(json.recommendations.map((r) => r.name).sort()).toEqual(["Mr. Chen", "Ms. Rivera"]); // the fake checks the order column but does not sort
  });
});
