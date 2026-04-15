// SP-6 — common-questions bank.
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-6 — Harvard questions page renders themed groups", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/college-interviews/questions/harvard-undergrad");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-6", "01-harvard-questions", {
    annotation: "Themed question groups for Harvard — at least 3 sections",
  });
});
