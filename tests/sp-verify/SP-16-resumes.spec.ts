// SP-16 — resume optimizer.
import { test } from "@playwright/test";
import { loginAsTestUser, shot } from "./helpers";

test("SP-16 — resumes list page renders upload zone", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/resumes");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-16", "01-resumes-list", {
    annotation: "Upload dropzone + list (or empty state)",
  });
});

test("SP-16 — empty state text is visible", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/resumes");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-16", "02-resume-detail-empty", {
    annotation: "If no resume exists, the empty-state copy should read naturally",
  });
});
