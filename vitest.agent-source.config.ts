import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  envDir: false,
  resolve: { alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
    path: "node:path", fs: "node:fs",
  } },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/unit/**", "tests/e2e/**"],
    setupFiles: ["./vitest.setup.ts"], globals: false, testTimeout: 30000,
  },
});
