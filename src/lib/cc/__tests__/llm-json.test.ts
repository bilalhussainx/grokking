import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.hoisted(() => {
  process.env.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "test-key";
});

import { callLLMJSON, extractJsonObject } from "../llm-stream";

const reply = (content: string, status = 200) =>
  new Response(JSON.stringify({ choices: [{ message: { content }, finish_reason: "stop" }] }), { status });

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("extractJsonObject", () => {
  it("parses fenced JSON", () => {
    expect(extractJsonObject<{ a: number }>('```json\n{"a": 1}\n```')).toEqual({ a: 1 });
  });
  it("returns null for truncated JSON", () => {
    expect(extractJsonObject('{"outlines": [{"title": "A"')).toBeNull();
  });
});

describe("callLLMJSON", () => {
  const msgs = [{ role: "user" as const, content: "hi" }];
  const sentBody = (call = 0) => JSON.parse(fetchMock.mock.calls[call][1].body as string);

  it("asks the provider for a JSON object when jsonMode is set", async () => {
    fetchMock.mockResolvedValueOnce(reply('{"ok": true}'));
    await callLLMJSON(msgs, { jsonMode: true });
    expect(sentBody().response_format).toEqual({ type: "json_object" });
  });

  it("does not force JSON mode by default (prompts may not mention JSON)", async () => {
    fetchMock.mockResolvedValueOnce(reply('{"ok": true}'));
    await callLLMJSON(msgs);
    expect(sentBody().response_format).toBeUndefined();
  });

  it("retries once after a transient provider error", async () => {
    fetchMock.mockResolvedValueOnce(new Response("busy", { status: 503 })).mockResolvedValueOnce(reply('{"ok": true}'));
    expect(await callLLMJSON<{ ok: boolean }>(msgs)).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries once after unparseable output, then gives up and logs why", async () => {
    fetchMock.mockImplementation(async () => reply("sorry, here is prose"));
    expect(await callLLMJSON(msgs, { label: "outline" })).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("outline"));
  });

  it("does not retry a non-transient error", async () => {
    fetchMock.mockResolvedValueOnce(new Response("no", { status: 401 }));
    expect(await callLLMJSON(msgs)).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
