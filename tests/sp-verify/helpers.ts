// Shared helpers for the SP visual-verify suite.
// Each SP spec imports `loginAsTestUser` and `shot` so screenshots land in a
// predictable directory that the review script can scan.

import { Page, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

export const TEST_EMAIL = process.env.SP_VERIFY_EMAIL || "testuser789@test.com";
export const TEST_PASSWORD = process.env.SP_VERIFY_PASSWORD || "AuditPro2026!";

export const SCREENSHOT_ROOT = path.join(__dirname, "screenshots");

export async function loginAsTestUser(page: Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(TEST_EMAIL);
  await page.locator('input[type="password"]').fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });
  await page.waitForLoadState("networkidle").catch(() => null);
}

/**
 * Save a full-page screenshot to `tests/sp-verify/screenshots/<spId>/<step>.png`.
 * The step name is also written into a sibling `<step>.meta.json` so the review
 * script can match screenshots back to per-step expectations in the criteria file.
 */
export async function shot(
  page: Page,
  spId: string,
  step: string,
  opts?: { annotation?: string; fullPage?: boolean }
) {
  const dir = path.join(SCREENSHOT_ROOT, spId);
  fs.mkdirSync(dir, { recursive: true });
  const pngPath = path.join(dir, `${step}.png`);
  const metaPath = path.join(dir, `${step}.meta.json`);

  // Small settle delay so charts/images finish painting before the capture.
  await page.waitForTimeout(400);

  await page.screenshot({
    path: pngPath,
    fullPage: opts?.fullPage !== false,
  });

  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        sp: spId,
        step,
        url: page.url(),
        annotation: opts?.annotation || null,
        captured_at: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf-8"
  );
}

export { expect };
