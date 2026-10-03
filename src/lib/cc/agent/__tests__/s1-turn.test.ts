// @vitest-environment node
// src/lib/cc/agent/__tests__/s1-turn.test.ts
import { describe, it, expect, vi } from "vitest";
import { createFakeSupabase } from "@/lib/cc/__tests__/helpers/fake-supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { runS1Turn } from "../s1-turn";
import type { Provider } from "../contracts";

const U = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const P = "11111111-1111-4111-8111-111111111111";
const base = () => createFakeSupabase({ cc_student_profiles: [{ id: P, user_id: U, grade_level: 11, is_transfer_student: false }], cc_student_schools: [], cc_schools: [], cc_essays: [], cc_tasks: [], cc_agent_turns: [], cc_agent_events: [], cc_agent_proposals: [] });
const args = (db: ReturnType<typeof base>, provider: Provider, message = "What should I do this week?", operationKey = "op-key-0001") =>
  ({ db: db as unknown as SupabaseClient, scope: { userId: U, profileIds: [P] }, operationKey, message, locale: "en", provider, now: new Date("2026-10-20T12:00:00Z"), signal: new AbortController().signal });

describe("S1 turn", () => {
  it("calls journey tools and returns checked text with a logged event trail", async () => {
    const provider = vi.fn<Provider>()
      .mockResolvedValueOnce({ content: null, calls: [{ id: "1", name: "get_journey_state", arguments: "{}" }] })
      .mockResolvedValueOnce({ content: "Build your school list to 5 schools.", calls: [] });
    const db = base();
    const r = await runS1Turn(args(db, provider));
    expect(r.status).toBe(200);
    expect(r.result?.text).toBe("Build your school list to 5 schools.");
    expect(db.tables.cc_agent_events.map((e) => e.type)).toEqual(["turn.accepted", "tool.completed", "turn.completed"]);
  });

  it("same key and same input replays without calling the provider again", async () => {
    const provider = vi.fn<Provider>().mockResolvedValue({ content: "Hi.", calls: [] });
    const db = base();
    await runS1Turn(args(db, provider));
    const again = await runS1Turn(args(db, provider));
    expect(provider).toHaveBeenCalledTimes(1);
    expect(again.result?.text).toBe("Hi.");
  });

  it("same key with a different message is a 409 before any provider call", async () => {
    const provider = vi.fn<Provider>().mockResolvedValue({ content: "Hi.", calls: [] });
    const db = base();
    await runS1Turn(args(db, provider));
    const r = await runS1Turn(args(db, provider, "Something else"));
    expect(r.status).toBe(409);
    expect(provider).toHaveBeenCalledTimes(1);
  });

  it("a failed turn logs only a stable code, and its replay is refused", async () => {
    const provider = vi.fn<Provider>().mockResolvedValue({ content: "[Draft] I was born in Lahore", calls: [] });
    const db = base();
    await expect(runS1Turn(args(db, provider))).rejects.toThrow();
    const failed = db.tables.cc_agent_events.find((e) => e.type === "turn.failed") as { payload: { code: string } };
    expect(failed.payload.code).toMatch(/^[a-z_0-9]+$/);
    expect(JSON.stringify(db.tables.cc_agent_events)).not.toMatch(/Lahore|Draft/);
    const replay = await runS1Turn(args(db, provider));
    expect(replay.status).toBe(409);
  });

  it("essay-writing requests get the fixed integrity answer and no model call", async () => {
    const provider = vi.fn<Provider>();
    const r = await runS1Turn(args(base(), provider, "Write my personal statement intro for me"));
    expect(provider).not.toHaveBeenCalled();
    expect(r.result?.text).toMatch(/You write every word/);
  });

  it("an ungrounded date in the model's answer is redacted before release", async () => {
    const provider = vi.fn<Provider>().mockResolvedValue({ content: "MIT EA is November 1. Start your list today.", calls: [] });
    const r = await runS1Turn(args(base(), provider));
    expect(r.result?.text).not.toMatch(/November 1/);
    expect(r.result?.text).toMatch(/Start your list today/);
  });

  it("dispatches a proposal tool with the turn id and logs an action preview", async () => {
    const provider = vi.fn<Provider>()
      .mockResolvedValueOnce({ content: null, calls: [{ id: "1", name: "propose_task", arguments: JSON.stringify({ title: "Draft your list", dueDate: null, reason: "You asked what to do" }) }] })
      .mockResolvedValueOnce({ content: "I suggested a task.", calls: [] });
    const db = base();
    const r = await runS1Turn(args(db, provider));
    expect(r.status).toBe(200);
    expect(db.tables.cc_agent_proposals).toHaveLength(1);
    expect(db.tables.cc_agent_proposals[0].turn_id).toBe(r.turnId);
    expect(db.tables.cc_agent_events.map((e) => e.type)).toEqual(["turn.accepted", "action.preview", "turn.completed"]);
  });

  it("a tool that finishes after the turn aborted logs no tool event", async () => {
    const db = base();
    let release!: () => void;
    const gate = new Promise<void>((r) => { release = r; });
    // cc_tasks reads hang until released, so get_journey_state is in flight when the turn aborts.
    const slow = { from: (t: string) => t !== "cc_tasks" ? db.from(t) : { select: (c: string) => ({ in: (col: string, v: unknown[]) => gate.then(() => db.from(t).select(c).in(col, v)) }) } };
    const provider = vi.fn<Provider>().mockResolvedValue({ content: null, calls: [{ id: "1", name: "get_journey_state", arguments: "{}" }] });
    const controller = new AbortController();
    const run = runS1Turn({ ...args(db, provider), db: slow as unknown as SupabaseClient, signal: controller.signal });
    await new Promise((r) => setTimeout(r, 20));
    controller.abort();
    await expect(run).rejects.toThrow(/^operation_aborted/);
    release();
    await new Promise((r) => setTimeout(r, 20));
    expect(db.tables.cc_agent_events.map((e) => e.type)).toEqual(["turn.accepted", "turn.failed"]);
  });

  it("a tool name outside the S1 set fails the turn with a closed code", async () => {
    const provider = vi.fn<Provider>().mockResolvedValue({ content: null, calls: [{ id: "1", name: "delete_everything", arguments: "{}" }] });
    const db = base();
    await expect(runS1Turn(args(db, provider))).rejects.toThrow("invalid_tool_arguments");
    const failed = db.tables.cc_agent_events.find((e) => e.type === "turn.failed") as { payload: { code: string } };
    expect(failed.payload.code).toBe("invalid_tool_arguments");
  });
});
