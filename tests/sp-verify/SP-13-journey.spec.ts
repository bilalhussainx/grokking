// SP-13 — journey banner on homepage.
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-13 — journey banner visible on homepage", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-13", "01-homepage-logged-in", {
    annotation: "Full homepage; banner should appear above 'Continue where you left off'",
  });
});
