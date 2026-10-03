// @vitest-environment node
import { it, expect } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadInbox, loadActivity, setNudgeStatus } from "../inbox";
import { verifyConfirmToken } from "../proposals";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P = "11111111-1111-4111-8111-111111111111";
const SECRET = "test-secret-at-least-32-characters-long";
const now = new Date("2026-10-20T12:00:00Z");
const scope = { userId: U, profileIds: [P] };
const db = () => createFakeSupabase({
  cc_agent_nudges: [
    { id: "n1", user_id: U, student_id: P, trigger: "essay_stall", reason: { title: "An essay is waiting", detail: "15 days" }, status: "open", snoozed_until: null, created_at: "2026-10-20T09:00:00Z" },
    { id: "n2", user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", student_id: "x", trigger: "inactivity", reason: { title: "x", detail: "x" }, status: "open", snoozed_until: null, created_at: "2026-10-20T09:00:00Z" },
  ],
  cc_agent_turns: [{ id: "t-failed", user_id: U, status: "failed" }, { id: "t-ok", user_id: U, status: "completed" }],
  cc_agent_proposals: [
    { id: "p1", user_id: U, student_id: P, turn_id: null, kind: "task", payload: { title: "t", dueDate: null }, payload_hash: "h", reason: "r", status: "pending", expires_at: "2026-10-21T00:00:00Z" },
    { id: "p-failed", user_id: U, student_id: P, turn_id: "t-failed", kind: "task", payload: { title: "t", dueDate: null }, payload_hash: "h2", reason: "r", status: "pending", expires_at: "2026-10-21T00:00:00Z" },
    { id: "p-ok", user_id: U, student_id: P, turn_id: "t-ok", kind: "task", payload: { title: "t", dueDate: null }, payload_hash: "h3", reason: "r", status: "pending", expires_at: "2026-10-21T00:00:00Z" },
  ],
  cc_agent_events: [{ user_id: U, type: "action.committed", label: "Saved what you confirmed", created_at: "2026-10-20T10:00:00Z" }, { user_id: "other", type: "x", label: "x", created_at: "2026-10-20T10:00:00Z" }],
});

it("returns only my open nudges and live pending proposals, each proposal with a fresh valid token; hides proposals of failed turns", async () => {
  const items = await loadInbox(db() as unknown as SupabaseClient, scope, now, SECRET);
  expect(items.map((i) => i.id)).toEqual(["n1", "p1", "p-ok"]);
  const p = items[1] as { token: string };
  expect(verifyConfirmToken(p.token, { id: "p1", userId: U, payloadHash: "h" }, now, SECRET)).toBe(true);
});

it("activity log is mine only, newest first", async () => {
  const log = await loadActivity(db() as unknown as SupabaseClient, scope, 50);
  expect(log).toEqual([{ type: "action.committed", label: "Saved what you confirmed", createdAt: "2026-10-20T10:00:00Z" }]);
});

it("snooze hides a nudge for 7 days; another user's nudge is 404", async () => {
  const d = db();
  expect(await setNudgeStatus(d as unknown as SupabaseClient, scope, "n1", "snooze", now)).toBe(200);
  expect(d.tables.cc_agent_nudges[0]).toMatchObject({ status: "snoozed", snoozed_until: "2026-10-27" });
  expect(await setNudgeStatus(d as unknown as SupabaseClient, scope, "n2", "dismiss", now)).toBe(404);
});
