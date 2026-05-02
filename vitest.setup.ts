// vitest.setup.ts
// Extends Vitest's `expect` with jest-dom matchers (toBeInTheDocument, etc.)
// and ensures the DOM is reset between tests.
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
