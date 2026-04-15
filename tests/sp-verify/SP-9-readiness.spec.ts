// SP-9 — readiness card on home.
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-9 — homepage shows Application readiness card", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle").catch(() => null);
  // Let the /api/readiness call land
  await page.waitForTimeout(1200);
  await shot(page, "SP-9", "01-homepage-readiness", {
    annotation: "ReadinessCard: composite + 5 pillars (profile, activities, essays, interviews, resume)",
  });
});
