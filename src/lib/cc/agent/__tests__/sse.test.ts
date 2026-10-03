// @vitest-environment node
// src/lib/cc/agent/__tests__/sse.test.ts
import { describe, it, expect } from "vitest";
import { encodeEvent, decodeEvents } from "../sse";

describe("SSE Encoder and Decoder", () => {
  async function* toAsyncIterable(chunks: Uint8Array[]): AsyncIterable<Uint8Array> {
    for (const chunk of chunks) {
      yield chunk;
    }
  }

  it("encodes and decodes single SSE event cleanly", async () => {
    const encoded = encodeEvent(1, "context.ready", { status: "ready" });
    const events = [];
    for await (const ev of decodeEvents(toAsyncIterable([encoded]))) {
      events.push(ev);
    }

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      seq: 1,
      type: "context.ready",
      data: { status: "ready" }
    });
  });

  it("pins Review Focus 2: correctly decodes multi-byte UTF-8 split across chunk boundaries", async () => {
    // Urdu text: 'اردو' encoded in UTF-8
    const urduPayload = { text: "اردو رہنمائی" };
    const encoded = encodeEvent(2, "text.delta", urduPayload);

    // Split encoded bytes right in the middle of a 2-byte or 3-byte UTF-8 code point
    const splitPoint = Math.floor(encoded.length / 2);
    const chunk1 = encoded.slice(0, splitPoint);
    const chunk2 = encoded.slice(splitPoint);

    const events = [];
    for await (const ev of decodeEvents(toAsyncIterable([chunk1, chunk2]))) {
      events.push(ev);
    }

    expect(events).toHaveLength(1);
    expect(events[0].seq).toBe(2);
    expect(events[0].type).toBe("text.delta");
    expect((events[0].data as { text: string }).text).toBe("اردو رہنمائی");
  });

  it("handles event boundaries split across multiple chunks", async () => {
    const enc1 = encodeEvent(1, "step", { n: 1 });
    const enc2 = encodeEvent(2, "step", { n: 2 });
    const full = new Uint8Array(enc1.length + enc2.length);
    full.set(enc1, 0);
    full.set(enc2, enc1.length);

    // Fragment into small 7-byte chunks
    const chunks: Uint8Array[] = [];
    for (let i = 0; i < full.length; i += 7) {
      chunks.push(full.slice(i, i + 7));
    }

    const events = [];
    for await (const ev of decodeEvents(toAsyncIterable(chunks))) {
      events.push(ev);
    }

    expect(events).toHaveLength(2);
    expect(events[0].seq).toBe(1);
    expect(events[1].seq).toBe(2);
  });
});
it("skips comment-only heartbeats between real events",async()=>{
 const encoder=new TextEncoder();
 const chunks=(async function*(){yield encodeEvent(1,"step",{n:1});yield encoder.encode(": heartbeat\n: another comment\n\n");yield encodeEvent(2,"step",{n:2});})();
 const events=[];for await(const event of decodeEvents(chunks))events.push(event);
 expect(events.map(event=>event.seq)).toEqual([1,2]);
 const mixed=(async function*(){yield encoder.encode(": heartbeat\nnot-a-comment\n\n");})();
 await expect((async()=>{for await(const event of decodeEvents(mixed))void event;})()).rejects.toThrow("malformed_sse_frame");
});
it("reports malformed and trailing frames instead of dropping them",async()=>{
 for(const frame of ["id: 1\nevent: step\ndata: broken\n\n","id: nope\nevent: step\ndata: {}\n\n","id: 1\nevent: step\ndata: {}"]){
  const consume=async()=>{for await(const event of decodeEvents((async function*(){yield new TextEncoder().encode(frame);})()))void event;};
  await expect(consume()).rejects.toThrow(/sse_/);
 }
});
