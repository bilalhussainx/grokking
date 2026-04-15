// SP-11 — dynamic persona input on college interview setup.
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-11 — college interviews setup shows the dynamic persona generator", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/college-interviews");
  await page.waitForLoadState("networkidle").catch(() => null);

  // Scroll to reveal the "Don't see your school?" section below the grid
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(400);

  await shot(page, "SP-11", "01-college-interviews-page", {
    annotation: "School grid + 'Don't see your school?' input and Generate button",
  });
});
