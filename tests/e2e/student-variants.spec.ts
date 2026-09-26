// Walks every dashboard variant (seeded by scripts/qa-seed-student-variants.mjs)
// through the core student pages on desktop and at phone width, recording
// what a real student would hit: our own /api/ calls failing, console
// errors, pages that error, and horizontal overflow. Page loads only — no
// form submissions. Run ONLY this file; other e2e specs reset production
// fixtures:  npx playwright test tests/e2e/student-variants.spec.ts --project="Desktop Chrome" --workers=1
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const PW = "E2eTestPass!1";
const VARIANTS = ["g9", "g10", "junior", "senior-writing", "senior-post-submit", "senior-decisions", "transfer", "unknown"] as const;
// Real routes (the sidebar nav test guarantees they resolve).
const PAGES = ["/cc/dashboard", "/schools", "/applications", "/cc/essays", "/cc/activities-optimizer", "/cc/recommenders", "/cc/net-price", "/cc/interview-prep", "/settings"];
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, phone: { width: 375, height: 812 } } as const;

type Finding = { variant: string; viewport: string; page: string; kind: "api" | "console" | "overflow" | "status" | "redirect"; detail: string };
const findings: Finding[] = [];
const OUT = "tests/e2e/test-results/student-variants";

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("Your password").fill(PW);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 60_000 });
}

for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`${vpName}`, () => {
    test.use({ viewport, isMobile: vpName === "phone", hasTouch: vpName === "phone" });

    for (const v of VARIANTS) {
      test(`variant ${v} (${vpName}): core pages load cleanly`, async ({ page }) => {
        test.setTimeout(300_000);
        let current = "login";
        page.on("response", (r) => {
          const u = new URL(r.url());
          // 402 is an intended upgrade/limit response, not a failure.
          if (u.origin === "http://localhost:3000" && u.pathname.startsWith("/api/") && r.status() >= 400 && r.status() !== 402) {
            findings.push({ variant: v, viewport: vpName, page: current, kind: "api", detail: `${r.status()} ${r.request().method()} ${u.pathname}` });
          }
        });
        page.on("console", (m) => {
          if (m.type() === "error") findings.push({ variant: v, viewport: vpName, page: current, kind: "console", detail: m.text().slice(0, 240) });
        });

        await login(page, `e2e-v-${v}@test.local`);
        fs.mkdirSync(OUT, { recursive: true });
        for (const path of PAGES) {
          current = path;
          const res = await page.goto(path, { waitUntil: "domcontentloaded" });
          await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
          if (!res || res.status() >= 400) findings.push({ variant: v, viewport: vpName, page: path, kind: "status", detail: String(res?.status()) });
          const landed = new URL(page.url()).pathname;
          if (landed !== path.split("?")[0]) findings.push({ variant: v, viewport: vpName, page: path, kind: "redirect", detail: `landed on ${landed}` });
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          if (overflow > 1) findings.push({ variant: v, viewport: vpName, page: path, kind: "overflow", detail: `${overflow}px` });
          await page.screenshot({ path: `${OUT}/${vpName}-${v}${path.replaceAll("/", "_")}.png` });
        }
        await expect(page).not.toHaveURL(/\/login/);
      });
    }
  });
}

test.afterAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
  const file = `${OUT}/findings.json`;
  const prior = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
  fs.writeFileSync(file, JSON.stringify([...prior, ...findings], null, 2));
});
