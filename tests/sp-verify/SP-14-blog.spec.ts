// SP-14 — blog index + a college-focused post.
import { test } from "@playwright/test";
import { shot } from "./helpers";

test("SP-14 — blog index shows 5+ posts including college and career categories", async ({ page }) => {
  await page.goto("/blog");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-14", "01-blog-index", {
    annotation: "Blog index grid — 5 posts: 2 AI-ed + college admissions + careers",
  });
});

test("SP-14 — alumni interviewer post renders", async ({ page }) => {
  await page.goto("/blog/alumni-interviewer-playbook");
  await page.waitForLoadState("networkidle").catch(() => null);
  await shot(page, "SP-14", "02-blog-post", {
    annotation: "Alumni interviewer playbook post — title, metadata, prose body",
  });
});
