// SP-1 — scorecard block on home.
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-1 — homepage shows Recent interviews scorecard block", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle").catch(() => null);
  await page.waitForTimeout(1200);
  await shot(page, "SP-1", "01-homepage-scorecard", {
    annotation: "InterviewScorecardBlock visible next to readiness card",
  });
});
