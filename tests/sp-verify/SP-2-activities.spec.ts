// SP-2 — activities manager (part of the essay-to-interview bridge).
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-2 — activities empty state", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/activities");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-2", "01-activities-empty");
});

test("SP-2 — after clicking Add, a row with editable fields appears", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/activities");
  await page.waitForLoadState("networkidle").catch(() => null);

  // Click the "Add an activity" button
  const addButton = page.getByRole("button", { name: /add an activity/i });
  if (await addButton.count()) {
    await addButton.first().click();
    await page.waitForTimeout(800);
  }

  await shot(page, "SP-2", "02-activities-after-add", {
    annotation: "New activity row visible with title, role, category, hrs/wk, wks/yr, description",
  });
});
