import { defineConfig } from "vitest/config";
import path from "node:path";
import { config as loadEnv } from "dotenv";

// Load .env.local so integration-style unit tests (e.g. tests/unit/cc/*) can
// reach Supabase via the service-role key. Next.js does this automatically;
// vitest does not. Tests that explicitly stub env vars still work — dotenv
// only fills in vars that aren't already set.
loadEnv({ path: path.resolve(__dirname, ".env.local") });

export default defineConfig({
  test: {
    environment: "jsdom",
    // src/**/*.test.* — collocated unit tests (existing pattern).
    // tests/unit/**/*.test.* — DB-integration unit tests that share fixtures
    // with the Playwright e2e suite under tests/e2e/helpers.
    include: ["src/**/*.test.{ts,tsx}", "tests/unit/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
    globals: false,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force bare `path` / `fs` imports (as used by the shared e2e fixtures
      // under tests/e2e/helpers) to resolve to the Node built-ins rather than
      // the legacy `path` npm shim that ships transitively via some deps.
      // Without this, vite picks the userland shim in node_modules/path/ and
      // explodes with `util.isString is not a function` under Node 20+.
      path: "node:path",
      fs: "node:fs",
    },
  },
});
