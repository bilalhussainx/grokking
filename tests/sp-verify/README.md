# SP visual-verify harness

End-to-end user-flow verification for Super-Project (SP) items. Playwright captures
full-page screenshots of key pages, then an OpenRouter Sonnet (vision) reviewer
judges each screenshot against explicit acceptance criteria and writes a pass/fail
report.

## Run

```bash
# 1) Capture screenshots (starts Next dev server automatically)
npm run test:sp

# 2) Review screenshots against criteria (writes tests/sp-verify/report.md)
OPENROUTER_API_KEY=sk-or-... npm run verify:sp

# Limit to one SP
SP_VERIFY_ONLY=SP-16 npm run verify:sp
```

Outputs:

- `tests/sp-verify/screenshots/<SP>/<step>.png` + `<step>.meta.json` — captured by Playwright
- `tests/sp-verify/verdicts/<SP>.json` — per-SP reviewer verdict
- `tests/sp-verify/report.md` — combined summary with ✅/❌/❓ per criterion

## Adding a new SP

1. Create `tests/sp-verify/criteria/SP-<n>.json`:

   ```json
   {
     "sp": "SP-17",
     "name": "Short name of the feature",
     "specRef": "docs/superpowers/plans/... :<line>",
     "acceptanceCriteria": [
       "Page renders without runtime errors",
       "Feature X is visibly present",
       "..."
     ],
     "antiPatterns": [
       "No raw HTML entities visible (&apos;, &quot;)",
       "No 500 error card"
     ],
     "screenshots": [
       { "file": "01-page.png", "step": "01-page", "expect": "what reviewer should see" }
     ]
   }
   ```

2. Create `tests/sp-verify/SP-<n>-<name>.spec.ts`:

   ```ts
   import { test } from "@playwright/test";
   import { loginAsTestUser, shot } from "./helpers";

   test("SP-17 — <what this verifies>", async ({ page }) => {
     await loginAsTestUser(page);
     await page.goto("/your/route");
     await page.waitForLoadState("networkidle").catch(() => null);
     await shot(page, "SP-17", "01-page", { annotation: "what matters here" });
   });
   ```

3. Run `npm run test:sp` then `npm run verify:sp`.

## Notes

- The reviewer is **strict** — vague evidence → `unclear`, not `pass`.
- `shot()` writes a sidecar `.meta.json` with `{step, url, annotation}` so the reviewer
  has context beyond the pixels.
- If a criterion can't be judged from the screenshots captured, the reviewer lists it
  under `missingScreenshots` — add a spec step to capture that view next run.
- Default reviewer model is `anthropic/claude-sonnet-4`. Override via
  `SP_VERIFY_MODEL=<openrouter-slug>`.
- Test user creds are hard-coded in `helpers.ts` (`testuser789@test.com` / `AuditPro2026!`)
  to match the existing e2e suite.
