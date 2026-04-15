// SP-7 — holistic fit evaluator page.
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-7 — /college-fit page renders with school picker + evaluate button", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/college-fit");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-7", "01-college-fit", {
    annotation: "Fit evaluator page — target-school dropdown + Evaluate fit button",
  });
});
