import { it, expect } from "vitest";
import { FAQ_ITEMS } from "../faq-items";
import { COACH_LANGUAGE_COUNT } from "../coach-language-claim";

// A single-quoted string prints "${...}" literally on /faq and in JSON-LD.
it("no FAQ text contains an unrendered template placeholder", () => {
  const all = FAQ_ITEMS.map((i) => `${i.question} ${i.answer}`).join("\n");
  expect(all).not.toContain("${");
  expect(all).toContain(`${COACH_LANGUAGE_COUNT} languages`);
});
