import { describe, it, expect } from "vitest";
import { parseGpa } from "../parse-gpa";

describe("parseGpa", () => {
  it.each([
    ["3.50", 3.5], ["  3.50 ", 3.5], ["3.5/4.0", 3.5], ["4.3", 4.3], ["3.456", 3.46], [3.2, 3.2], ["3,65", 3.65], ["3,5/4", 3.5],
  ])("accepts %j as %d", (raw, expected) => expect(parseGpa(raw)).toBe(expected));

  it.each([["abc"], ["12"], ["0"], [""], [null], [undefined], ["-3"]])("rejects %j", (raw) =>
    expect(parseGpa(raw)).toBeNull());
});
