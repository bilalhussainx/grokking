// SP-3 — parent share dashboard (read-only).
import { test } from "@playwright/test";
import { shot } from "./helpers";

test("SP-3 — invalid parent share code shows revoked/404 gate", async ({ page }) => {
  await page.goto("/parent/INVALIDCODE999");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-3", "01-parent-invalid", {
    annotation: "Invalid share code — gate page, no dashboard content leaked",
  });
});
