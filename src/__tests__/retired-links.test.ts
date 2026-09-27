import { describe, it, expect } from "vitest";
import { findRetiredReferences } from "./retired-links.helpers";

const SHELL = [
  "src/app/providers.tsx", "src/components/layout/TopNav.tsx", "src/components/layout/Footer.tsx",
  "src/app/settings/page.tsx", "src/components/nav/sidebar-data.ts", "src/components/nav/palette-data.ts",
];

describe("retired learning links", () => {
  it("the app shell links to no retired page or API", () => {
    expect(findRetiredReferences(SHELL)).toEqual([]);
  });
});
