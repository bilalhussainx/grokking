import { describe, it, expect } from "vitest";
import { safeNextPath } from "../safe-next";

describe("safeNextPath", () => {
  it.each([["/join/abc"], ["/counselor/onboard"], ["/cc/dashboard?tab=1"]])("keeps %s", (p) =>
    expect(safeNextPath(p)).toBe(p));
  it.each([["//evil.com"], ["/\\evil.com"], ["https://evil.com"], ["javascript:alert(1)"], [""], [null], [undefined],
    // Browsers strip tab/LF/CR before parsing, so "/\t/evil.com" becomes "//evil.com".
    ["/\t/evil.com"], ["/\n/evil.com"], ["/\r/evil.com"], ["/\t\\evil.com"], ["/ok\u0000"]])(
    "rejects %j", (p) => expect(safeNextPath(p)).toBeNull());
});
