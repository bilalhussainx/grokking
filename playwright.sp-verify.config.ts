// Playwright config scoped to the SP visual-verify suite.
// Runs `tests/sp-verify/*.spec.ts` only. Always full-page screenshots.
// Spec: CollegeVCareers.md — verify harness added 2026-04-14.

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/sp-verify",
  timeout: 60_000,
  retries: 0,
  fullyParallel: false, // snapshots are sequential so ordering is stable
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "tests/sp-verify/playwright-report", open: "never" }]],
  use: {
    baseURL: process.env.SP_VERIFY_BASE_URL || "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
