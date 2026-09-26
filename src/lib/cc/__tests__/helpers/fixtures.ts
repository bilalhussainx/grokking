// Two students, Alice and Bob, each owning one of everything. Auth user ids
// and cc_student_profiles ids differ on purpose: the routes must bridge
// auth uid → profile id → row.student_id, and tests should catch a route
// that confuses the two.
import type { SupabaseClient } from "@supabase/supabase-js";
import { createFakeSupabase, type FakeSupabase } from "./fake-supabase";

export const ALICE = "a11ce000-0000-4000-8000-000000000001";
export const BOB = "b0b00000-0000-4000-8000-000000000002";
export const ALICE_PROFILE = "a11ce000-1111-4000-8000-000000000001";
export const BOB_PROFILE = "b0b00000-1111-4000-8000-000000000002";
export const ALICE_ESSAY = "a11ce000-2222-4000-8000-000000000001";
export const BOB_ESSAY = "b0b00000-2222-4000-8000-000000000002";
export const ALICE_COURSE = "a11ce000-3333-4000-8000-000000000001";
export const BOB_COURSE = "b0b00000-3333-4000-8000-000000000002";
export const ALICE_REC = "a11ce000-4444-4000-8000-000000000001";
export const BOB_REC = "b0b00000-4444-4000-8000-000000000002";

export function studentWorld(): FakeSupabase {
  return createFakeSupabase({
    cc_student_profiles: [
      { id: ALICE_PROFILE, user_id: ALICE },
      { id: BOB_PROFILE, user_id: BOB },
    ],
    cc_essays: [
      { id: ALICE_ESSAY, student_id: ALICE_PROFILE, current_draft: "Alice wrote this.", word_count: 3, phase: "draft", outline_json: null, share_token: null },
      { id: BOB_ESSAY, student_id: BOB_PROFILE, current_draft: "Bob wrote this.", word_count: 3, phase: "draft", outline_json: null, share_token: "bob-secret-token" },
    ],
    cc_courses: [
      { id: ALICE_COURSE, student_id: ALICE_PROFILE, course_name: "AP Calculus BC" },
      { id: BOB_COURSE, student_id: BOB_PROFILE, course_name: "AP Biology" },
    ],
    cc_recommenders: [
      { id: ALICE_REC, student_id: ALICE_PROFILE, name: "Ms. Rivera", email: "rivera@school.test", ask_email_text: null },
      { id: BOB_REC, student_id: BOB_PROFILE, name: "Mr. Chen", email: "chen@school.test", ask_email_text: null },
    ],
    cc_essay_interactions: [],
  });
}

export const asDb = (fake: FakeSupabase) => fake as unknown as SupabaseClient;
