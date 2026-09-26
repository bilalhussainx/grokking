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

type Finding = { variant: string; viewport: string; page: string; kind: "api" | "paywall" | "network" | "pageerror" | "console" | "overflow" | "status" | "redirect" | "empty"; detail: string };
const findings: Finding[] = [];
// Outside Playwright's outputDir, which is wiped at the start of every run.
const OUT = "docs/qa/evidence/student-variants";

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
        const pageErrors: string[] = [];
        // Same origin as the app under test (local dev or production).
        const appOrigin = () => new URL(test.info().project.use.baseURL ?? page.url()).origin;
        page.on("response", (r) => {
          const u = new URL(r.url());
          if (u.origin !== appOrigin() || !u.pathname.startsWith("/api/") || r.status() < 400) return;
          // A 402 is a paywall/limit. Record it separately: for these (trial-Pro)
          // accounts any paywall is suspicious, but it isn't a server error.
          findings.push({ variant: v, viewport: vpName, page: current, kind: r.status() === 402 ? "paywall" : "api", detail: `${r.status()} ${r.request().method()} ${u.pathname}` });
        });
        page.on("requestfailed", (req) => {
          const u = new URL(req.url());
          const why = req.failure()?.errorText ?? "";
          if (u.origin === appOrigin() && u.pathname.startsWith("/api/") && !/ERR_ABORTED/.test(why)) {
            findings.push({ variant: v, viewport: vpName, page: current, kind: "network", detail: `${why} ${u.pathname}` });
          }
        });
        // Uncaught client exceptions aren't console events; a crashed page can still be HTTP 200.
        page.on("pageerror", (e) => {
          pageErrors.push(`${current}: ${e.message}`);
          findings.push({ variant: v, viewport: vpName, page: current, kind: "pageerror", detail: e.message.slice(0, 240) });
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
          const body = (await page.locator("body").innerText().catch(() => "")).trim();
          if (/Application error|client-side exception|Something went wrong/i.test(body) || body.length < 80) {
            findings.push({ variant: v, viewport: vpName, page: path, kind: "empty", detail: body.slice(0, 120) || "(blank)" });
          }
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          if (overflow > 1) findings.push({ variant: v, viewport: vpName, page: path, kind: "overflow", detail: `${overflow}px` });
          await page.screenshot({ path: `${OUT}/${vpName}-${v}${path.replaceAll("/", "_")}.png` });
        }
        await expect(page).not.toHaveURL(/\/login/);
        expect(pageErrors, "uncaught client exceptions").toEqual([]);
      });
    }
  });
}

// One run = one findings file (run with --workers=1). The summary lets the
// audit's numbers be regenerated instead of hand-tallied.
test.afterAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(`${OUT}/findings.json`, JSON.stringify(findings, null, 2));
  const summary: Record<string, number> = {};
  for (const f of findings) summary[`${f.kind} | ${f.detail.slice(0, 80)}`] = (summary[`${f.kind} | ${f.detail.slice(0, 80)}`] ?? 0) + 1;
  fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify({ at: new Date().toISOString(), total: findings.length, byKindAndDetail: summary }, null, 2));
});
