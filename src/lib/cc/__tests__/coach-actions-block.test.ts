import { describe, it, expect } from "vitest";
import { parseActionsBlock, stripActionsBlock } from "../coach-actions-block";

describe("parseActionsBlock", () => {
  it("returns null when no block present", () => {
    expect(parseActionsBlock("Sure, I'll add Stanford for you.")).toBeNull();
  });
  it("parses add_schools array", () => {
    const result = parseActionsBlock(`Sure!
<<actions>>
{"add_schools": ["Stanford University", "MIT"]}
<</actions>>`);
    expect(result).toEqual({ add_schools: ["Stanford University", "MIT"] });
  });
  it("returns null for empty arrays (no-op action)", () => {
    // Empty add_schools is functionally a no-op — surfacing { add_schools: [] }
    // would just trigger an extraction call that does nothing. Returning null
    // lets the route short-circuit cleanly.
    const result = parseActionsBlock(`<<actions>>
{"add_schools": []}
<</actions>>`);
    expect(result).toBeNull();
  });
  it("returns null for malformed JSON", () => {
    expect(parseActionsBlock("<<actions>>{not json}<</actions>>")).toBeNull();
  });
  it("trims whitespace and newlines around the JSON", () => {
    const result = parseActionsBlock(`<<actions>>

{"add_schools": ["Yale"]}

<</actions>>`);
    expect(result).toEqual({ add_schools: ["Yale"] });
  });
  it("only accepts the LAST block when multiple are present", () => {
    // Defensive: model occasionally repeats. Last wins because that's the
    // model's final commitment.
    const result = parseActionsBlock(`<<actions>>{"add_schools":["A"]}<</actions>>
text
<<actions>>{"add_schools":["B"]}<</actions>>`);
    expect(result).toEqual({ add_schools: ["B"] });
  });
});

describe("stripActionsBlock", () => {
  it("removes the block + trims trailing whitespace", () => {
    const text = `Sure, here's your update.

<<actions>>
{"add_schools":["MIT"]}
<</actions>>`;
    expect(stripActionsBlock(text)).toBe("Sure, here's your update.");
  });
  it("returns original when no block present", () => {
    expect(stripActionsBlock("plain text")).toBe("plain text");
  });
});
