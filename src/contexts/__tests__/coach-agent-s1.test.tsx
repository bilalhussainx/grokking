// S1 final wave (I1): an S1 pilot student's typed Coach turns go to the agent
// route and show its proposals as cards under the reply. Everyone else keeps
// the legacy route, byte for byte. No real model is called: fetch is mocked.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { encodeEvent } from "@/lib/cc/agent/sse";

vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1" }, profile: { full_name: "Ada Lovelace" } }) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/cc/dashboard" }));
vi.mock("@/hooks/useCoachVoice", () => ({ useCoachVoice: () => ({ speak: vi.fn(), stop: vi.fn() }) }));
import { CoachKairosProvider, useCoachKairos } from "../CoachKairosContext";
import CoachMessage from "@/components/cc/coach/CoachMessage";

const proposal = (id: string, turnId: string | null, title: string) => ({
  kind: "proposal", id, turnId, proposalKind: "task", payload: { title, dueDate: "2026-10-28" }, reason: "Michigan is on your list", token: "t", tokenExpiresAtMs: Date.now() + 600000,
});
const agentSse = (text: string) => {
  const parts = [encodeEvent(1, "turn.accepted", { turnId: "turn-1" }), encodeEvent(2, "text.delta", { text }), encodeEvent(3, "turn.completed", { turnId: "turn-1", cards: [] })];
  const bytes = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  parts.reduce((at, p) => (bytes.set(p, at), at + p.length), 0);
  return new Response(bytes, { status: 200, headers: { "Content-Type": "text/event-stream" } });
};
const legacySse = () => new Response('data: {"text":"Hi from the legacy Coach"}\n\ndata: {"done":true,"extracted":0,"actionKinds":[]}\n\n', { status: 200 });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

let agentS1 = false;
let meStatus = 200;
let turnResponse: () => Response = () => agentSse("Here is a plan for Michigan.");
const fetchMock = vi.fn(async (url: string, _init?: RequestInit) => {
  const u = String(url);
  if (u.includes("/api/cc/coach/history")) return json({ messages: [] });
  if (u === "/api/cc/me") return meStatus === 200 ? json({ profile: null, agentS1 }) : json({ error: "x" }, meStatus);
  if (u === "/api/cc/agent/turn") return turnResponse();
  if (u === "/api/cc/agent/inbox") return json({ items: [
    { kind: "nudge", id: "n1", trigger: "inactivity", title: "Welcome back", detail: "d", createdAt: "2026-10-03T00:00:00Z" },
    proposal("p-this", "turn-1", "Draft your Why Michigan answer"),
    proposal("p-other", "turn-0", "An older suggestion"),
  ] });
  if (u === "/api/cc/coach/message") return legacySse();
  return json({});
});

beforeEach(() => { agentS1 = false; meStatus = 200; turnResponse = () => agentSse("Here is a plan for Michigan."); fetchMock.mockClear(); vi.stubGlobal("fetch", fetchMock); });
afterEach(() => { vi.unstubAllGlobals(); });

function Chat() {
  const c = useCoachKairos();
  return (
    <div>
      <button type="button" onClick={() => c.sendMessage("Help me plan Michigan")}>send</button>
      {c.messages.map((m) => <CoachMessage key={m.id} role={m.role} content={m.content} proposals={m.proposals} />)}
    </div>
  );
}
const urls = () => fetchMock.mock.calls.map(([u]) => String(u));
const bodyOf = (url: string) => JSON.parse(String(fetchMock.mock.calls.find(([u]) => String(u) === url)![1]!.body));

async function send() {
  render(<CoachKairosProvider><Chat /></CoachKairosProvider>);
  await waitFor(() => expect(urls()).toContain("/api/cc/me"));
  fireEvent.click(screen.getByText("send"));
}

describe("Coach for an S1 pilot student", () => {
  it("sends the turn to the agent route and renders the reply plus this turn's proposal card", async () => {
    agentS1 = true;
    await send();
    await waitFor(() => expect(screen.getByText("Here is a plan for Michigan.")).toBeTruthy());
    await waitFor(() => expect(screen.getByText("Draft your Why Michigan answer")).toBeTruthy());
    expect(screen.getByRole("button", { name: "Confirm" })).toBeTruthy();
    expect(screen.queryByText("An older suggestion")).toBeNull();
    expect(urls()).not.toContain("/api/cc/coach/message");
    const body = bodyOf("/api/cc/agent/turn");
    expect(body).toEqual({ message: "Help me plan Michigan", operationKey: expect.stringMatching(/^[0-9a-f-]{36}$/), locale: "en" });
  });

  it("mints a new operation key per send", async () => {
    agentS1 = true;
    await send();
    await waitFor(() => expect(screen.getByText("Here is a plan for Michigan.")).toBeTruthy());
    fireEvent.click(screen.getByText("send"));
    await waitFor(() => expect(fetchMock.mock.calls.filter(([u]) => String(u) === "/api/cc/agent/turn")).toHaveLength(2));
    const keys = fetchMock.mock.calls.filter(([u]) => String(u) === "/api/cc/agent/turn").map(([, i]) => JSON.parse(String(i!.body)).operationKey);
    expect(new Set(keys).size).toBe(2);
  });

  it.each([
    [429, { error: "fair_use_limit" }, /fair-use limit/],
    [404, { error: "not_enabled" }, /Coach is unavailable right now/],
    [503, { error: "capacity_unknown" }, /Coach is unavailable right now/],
    [409, { error: "turn_in_progress" }, /send it again/],
  ])("maps a %i to a fixed friendly message, never the raw code", async (status, body, copy) => {
    agentS1 = true;
    turnResponse = () => json(body, status);
    await send();
    await waitFor(() => expect(screen.getByText(copy)).toBeTruthy());
    expect(screen.queryByText(new RegExp(String(body.error)))).toBeNull();
    expect(urls()).not.toContain("/api/cc/agent/inbox");
  });
});

describe("Coach for everyone else", () => {
  it("still uses the legacy route with the same body, and never calls the agent", async () => {
    await send();
    await waitFor(() => expect(screen.getByText("Hi from the legacy Coach")).toBeTruthy());
    expect(urls()).not.toContain("/api/cc/agent/turn");
    expect(urls()).not.toContain("/api/cc/agent/inbox");
    expect(bodyOf("/api/cc/coach/message")).toEqual({ message: "Help me plan Michigan", page_context: "/cc/dashboard", variant_key: null });
  });

  it("uses the legacy route when /api/cc/me fails", async () => {
    agentS1 = true;
    meStatus = 500;
    await send();
    await waitFor(() => expect(screen.getByText("Hi from the legacy Coach")).toBeTruthy());
    expect(urls()).not.toContain("/api/cc/agent/turn");
  });
});
