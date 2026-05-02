import { describe, it, expect } from "vitest";
import { MOBILE_BREAKPOINT_PX, MOBILE_MEDIA_QUERY } from "./device";

describe("device constants", () => {
  it("MOBILE_BREAKPOINT_PX = 1024", () => {
    expect(MOBILE_BREAKPOINT_PX).toBe(1024);
  });
  it("MOBILE_MEDIA_QUERY matches the breakpoint with .98 fudge", () => {
    expect(MOBILE_MEDIA_QUERY).toBe("(max-width: 1023.98px)");
  });
});
