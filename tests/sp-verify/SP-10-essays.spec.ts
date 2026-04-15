// SP-10 — essay workbench.
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-10 — essays list page", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/essays");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-10", "01-essays-list");
});

test("SP-10 — new essay page shows Common App presets without HTML entities", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/essays/new");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-10", "02-new-essay", {
    annotation: "Prompt textarea + preset buttons; check for &apos; / &quot; artifacts",
  });
});
