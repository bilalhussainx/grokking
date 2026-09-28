// GATE D4.2 acceptance at 375×812 and 1440×900 for a junior, a grade-9, a
// transfer, an unknown-grade student and a head counselor. Page loads only:
// no grade buttons, Ask Kairos, billing or sign-out clicks, so no data writes.
// Run ONLY this file:
//   npx playwright test tests/e2e/d4-2-shell.spec.ts --project="Desktop Chrome" --workers=1
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const PW = "E2eTestPass!1";
const OUT = "docs/qa/evidence/d4-2-shell";
const VIEWPORTS = { phone: { width: 375, height: 812 }, desktop: { width: 1440, height: 900 } } as const;
const ACCOUNTS = [
  { id: "junior", email: "e2e-v-junior@test.local", staff: false },
  { id: "g9", email: "e2e-v-g9@test.local", staff: false },
  { id: "transfer", email: "e2e-v-transfer@test.local", staff: false },
  { id: "unknown", email: "e2e-v-unknown@test.local", staff: false },
  { id: "head", email: "e2e-head@test.local", staff: true },
] as const;

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("Your password").fill(PW);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 60_000 });
}

// Returns human-readable violations inside `scope` (a CSS selector list).
async function audit(page: Page, scope: string, phone: boolean) {
  return page.evaluate(({ scope, phone }) => {
    const out: string[] = [];
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    if (overflow > 1) out.push(`horizontal overflow ${overflow}px`);
    const roots = [...document.querySelectorAll<HTMLElement>(scope)];
    if (!roots.length) return [...out, `no element matches ${scope}`];
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    const small = ".af-caption, .af-badge, .af-eyebrow, .af-chip, .af-rail-label, .td-basis";
    for (const root of roots) {
      for (const el of root.querySelectorAll<HTMLElement>("*")) {
        if (el.closest(".af-skip, dialog:not([open])") || !visible(el)) continue;
        const ownText = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim());
        if (ownText && phone) {
          const size = parseFloat(getComputedStyle(el).fontSize);
          const min = el.closest(small) ? 12 : 14;
          if (size < min) out.push(`font ${size}px < ${min}px: <${el.tagName.toLowerCase()} class="${el.className}"> "${(el.textContent ?? "").trim().slice(0, 40)}"`);
        }
        if (el.matches("a[href], button, input, select, textarea, summary")) {
          const target = el.matches('input[type="checkbox"], input[type="radio"]') ? (el.closest("label") ?? el) : el;
          const r = target.getBoundingClientRect();
          if (r.width < 44 || r.height < 44) out.push(`target ${Math.round(r.width)}×${Math.round(r.height)}: ${el.tagName.toLowerCase()} "${(el.textContent ?? el.getAttribute("aria-label") ?? "").trim().slice(0, 40)}"`);
        }
      }
    }
    return out;
  }, { scope, phone });
}

for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(vpName, () => {
    test.use({ viewport, isMobile: vpName === "phone", hasTouch: vpName === "phone" });

    for (const account of ACCOUNTS) {
      test(`${account.id} (${vpName}): dashboard shell`, async ({ page }) => {
        test.setTimeout(180_000);
        const phone = vpName === "phone";
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
        page.on("console", (m) => {
          if (m.type() === "error" && /#418|#423|#425|hydrat|did not match/i.test(m.text())) errors.push(`hydration: ${m.text().slice(0, 200)}`);
        });

        await login(page, account.email);
        fs.mkdirSync(OUT, { recursive: true });

        await page.goto("/cc/dashboard", { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
        await expect(page.locator(".af-root")).toBeVisible();
        // The coach drawer must not have opened by itself.
        await expect(page.getByRole("textbox", { name: "Message Coach Kairos" })).toHaveCount(0);

        if (account.staff) {
          // Middleware sends counselors to their workspace.
          expect(new URL(page.url()).pathname).toBe("/counselor/dashboard");
          const team = phone ? page.locator(".af-tabs").getByRole("link", { name: "Team" }) : page.locator(".af-rail").getByRole("link", { name: "Team & invites" });
          await expect(team).toBeVisible();
        } else {
          expect(new URL(page.url()).pathname).toBe("/cc/dashboard");
          await expect(page.getByRole("textbox", { name: /Ask Kairos/ })).toBeVisible();
          await expect(page.locator("#af-main .af-badge").first()).toHaveText("AI");
          if (account.id === "unknown") await expect(page.getByRole("heading", { name: "Which grade are you in?" })).toBeVisible();
          if (account.id === "transfer") await expect(page.getByRole("heading", { name: "Your transfer details" })).toBeVisible();
          if (account.id === "g9") {
            const nav = phone ? page.locator(".af-tabs") : page.locator(".af-rail");
            await expect(nav.locator('a[href="/cc/essays"], a[href="/applications"]')).toHaveCount(0);
          }
        }

        // Legacy page bodies (counselor workspace) keep their own styles until
        // their gates; audit the frame chrome there, and all of Today.
        const scope = account.staff ? ".af-topbar, .af-tabs, .af-rail" : ".af-root";
        const problems = await audit(page, scope, phone);
        await page.screenshot({ path: `${OUT}/${account.id}-${vpName}.png`, fullPage: true });
        fs.writeFileSync(`${OUT}/${account.id}-${vpName}.json`, JSON.stringify({ url: page.url(), problems, errors }, null, 2));

        if (account.id === "g9") {
          // A deep link to a blocked tool lands on Today with the explanation
          // focused and the flag removed.
          await page.goto("/cc/essays", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "That tool opens later." })).toBeFocused();
          await expect.poll(() => new URL(page.url()).search).toBe("");
        }

        if (account.id === "junior") {
          // A page not yet restyled keeps its dark body inside the new frame.
          await page.goto("/schools", { waitUntil: "domcontentloaded" });
          await expect(page.locator("#af-main")).toHaveClass(/af-legacy/);
          await expect(page.locator(".af-topbar")).toBeVisible();
          await page.screenshot({ path: `${OUT}/junior-schools-${vpName}.png`, fullPage: true });
        }

        if (account.id === "junior" || account.id === "head") {
          await page.goto("/settings", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "Plan & billing" })).toBeVisible();
          await expect(page.getByText(account.id === "head" ? "Head counselor" : "Student", { exact: true })).toBeVisible();
          const settingsProblems = await audit(page, ".af-root", phone);
          await page.screenshot({ path: `${OUT}/${account.id}-settings-${vpName}.png`, fullPage: true });
          expect(settingsProblems, "settings layout").toEqual([]);
        }

        expect(problems, "dashboard layout").toEqual([]);
        expect(errors, "page errors / hydration").toEqual([]);
      });
    }
  });
}
