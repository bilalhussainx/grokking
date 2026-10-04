// Both voice-session routes used to return the raw Deepgram key to anyone,
// signed in or not, plus the OpenRouter/Moonshot keys inside the agent
// settings (think.endpoint.headers). The browser sends those settings to
// Deepgram itself, so nothing secret may be in them.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const SECRETS = vi.hoisted(() => {
  const s = { deepgram: "dg-master-key-SECRET-0001", openrouter: "sk-or-v1-SECRET-0002", moonshot: "sk-moon-SECRET-0003" };
  process.env.DEEPGRAM_API_KEY = s.deepgram;
  process.env.OPENROUTER_API_KEY = s.openrouter;
  process.env.MOONSHOT_API_KEY = s.moonshot;
  return s;
});

const auth = vi.hoisted(() => ({ user: null as null | { id: string; user_metadata: Record<string, unknown> } }));

// Any supabase query chain resolves to { data: null, error: null }.
function chain(): unknown {
  const target = () => {};
  return new Proxy(target, {
    get: (_t, prop) => (prop === "then" ? (res: (v: unknown) => void) => res({ data: null, error: null }) : chain()),
    apply: () => chain(),
  });
}

vi.mock("@/lib/supabase-auth", () => ({
  createServerSupabase: async () => ({
    auth: { getUser: async () => ({ data: { user: auth.user } }) },
    from: () => chain(),
  }),
  createAdminSupabase: () => ({ from: () => chain() }),
}));
vi.mock("@/lib/supabase", () => ({ supabase: chain() }));
vi.mock("@/lib/credits", async (orig) => ({
  ...(await orig<typeof import("@/lib/credits")>()),
  deductCredits: async () => true,
  addCredits: async () => true,
}));

import { POST as coachVoice } from "../ai/voice-session/route";
import { POST as languageVoice } from "../language/voice-session/route";

const grantOk = () =>
  vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
    if (String(url) === "https://api.deepgram.com/v1/auth/grant") {
      return new Response(JSON.stringify({ access_token: "short-lived-jwt", expires_in: 30 }), { status: 200 });
    }
    return new Response("{}", { status: 200 });
  });

const req = (path: string, body: object) =>
  new NextRequest(`http://localhost${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

const routes = [
  ["/api/ai/voice-session", coachVoice, { mode: "coach", systemPrompt: "You are Coach Kairos." }],
  ["/api/language/voice-session", languageVoice, { language: "en" }],
] as const;

describe.each(routes)("%s", (path, handler, body) => {
  beforeEach(() => { vi.restoreAllMocks(); auth.user = null; });

  it("refuses guests", async () => {
    grantOk();
    const res = await handler(req(path, body));
    expect(res.status).toBe(401);
    expect(await res.text()).not.toContain(SECRETS.deepgram);
  });

  it("returns no API key anywhere in the response for a signed-in user", async () => {
    auth.user = { id: "u-1", user_metadata: {} };
    grantOk();
    const res = await handler(req(path, body));
    expect(res.status).toBe(200);
    const text = await res.text();
    for (const secret of Object.values(SECRETS)) expect(text).not.toContain(secret);
    expect(text).not.toMatch(/Bearer /);
  });

  it("hands the browser a short-lived bearer token and a Deepgram-hosted LLM", async () => {
    auth.user = { id: "u-1", user_metadata: {} };
    grantOk();
    const json = await (await handler(req(path, body))).json();
    expect(json.auth).toEqual({ scheme: "bearer", value: "short-lived-jwt" });
    expect(json.key).toBeUndefined();
    expect(json.settings.agent.think.endpoint).toBeUndefined();
    expect(json.settings.agent.think.provider.type).toBe("anthropic");
  });
});

// Oct 4 live check: only English worked. Nothing told Deepgram's speech
// recognition the language (nova-3 heard Spanish as silence), and the coach's
// own prompt replaced the route's language instruction.
describe("/api/ai/voice-session coach language", () => {
  beforeEach(() => { vi.restoreAllMocks(); auth.user = { id: "u-1", user_metadata: {} }; });

  const coachPrompt = "You are Coach Kairos. ".repeat(10) + "Plain spoken English only.";

  it.each([["es", "Spanish"], ["ja", "Japanese"], ["de", "German"]])(
    "%s: recognition listens in that language and the coach prompt says to speak it",
    async (code, name) => {
      grantOk();
      const json = await (await coachVoice(req("/api/ai/voice-session", { mode: "coach", language: code, systemPrompt: coachPrompt }))).json();
      expect(json.settings.agent.language).toBe(code);
      expect(json.settings.agent.think.prompt).toContain(`entirely in ${name}`);
    },
  );

  it("English sessions stay English", async () => {
    grantOk();
    const json = await (await coachVoice(req("/api/ai/voice-session", { mode: "coach", language: "en", systemPrompt: coachPrompt }))).json();
    expect(json.settings.agent.language).toBe("en");
    expect(json.settings.agent.think.prompt).not.toContain("LANGUAGE INSTRUCTION");
  });
});
