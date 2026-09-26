import { describe, it, expect } from "vitest";
import { safeNextPath } from "../safe-next";

describe("safeNextPath", () => {
  it.each([["/join/abc"], ["/counselor/onboard"], ["/cc/dashboard?tab=1"]])("keeps %s", (p) =>
    expect(safeNextPath(p)).toBe(p));
  it.each([["//evil.com"], ["/\\evil.com"], ["https://evil.com"], ["javascript:alert(1)"], [""], [null], [undefined]])(
    "rejects %j", (p) => expect(safeNextPath(p)).toBeNull());
});
