// @vitest-environment node
import { it, expect } from "vitest";
import { GET } from "../route";
import { COACH_LANGUAGE_COUNT } from "@/lib/coach-language-claim";

// The site claims one language count everywhere; this file must not contradict
// it by listing more languages than the claim.
it("states the shared language count instead of a longer list", async () => {
  const text = await (await GET()).text();
  expect(text).toContain(`Coach Kairos speaks ${COACH_LANGUAGE_COUNT} languages`);
  expect(text).not.toMatch(/Turkish|Vietnamese|Russian/);
});
