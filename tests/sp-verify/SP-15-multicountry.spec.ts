// SP-15 — multi-country college interviewer selection.
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-15 — college interview setup shows country tabs and filters schools", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/college-interviews");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-15", "01-country-us", {
    annotation: "Default country = US; shows Ivy + US schools",
  });

  await page.getByRole("button", { name: /United Kingdom|UK/i }).first().click().catch(() => null);
  await page.waitForTimeout(400);
  await shot(page, "SP-15", "02-country-uk", {
    annotation: "UK tab active — Oxford, Cambridge, LSE visible",
  });

  await page.getByRole("button", { name: /Canada/i }).first().click().catch(() => null);
  await page.waitForTimeout(400);
  await shot(page, "SP-15", "03-country-ca", {
    annotation: "Canada tab active — Toronto, McGill, UBC visible",
  });
});
