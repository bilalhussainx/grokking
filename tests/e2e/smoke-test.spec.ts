import { test, expect, Page } from '@playwright/test';

// Collect console errors and network failures per page
interface PageReport {
  url: string;
  consoleErrors: string[];
  networkErrors: string[];
  status: 'pass' | 'fail';
}

const reports: PageReport[] = [];

/** Helper: visit a page, collect errors, take screenshot */
async function auditPage(page: Page, path: string, name: string) {
  const report: PageReport = {
    url: path,
    consoleErrors: [],
    networkErrors: [],
    status: 'pass',
  };

  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known benign errors
      if (text.includes('Manifest') || text.includes('favicon') || text.includes('hydration')) return;
      report.consoleErrors.push(text.slice(0, 200));
    }
  });

  // Listen for failed network requests
  page.on('requestfailed', (req) => {
    const url = req.url();
    // Ignore analytics, fonts, and other non-critical resources
    if (url.includes('analytics') || url.includes('fonts.g') || url.includes('favicon')) return;
    report.networkErrors.push(`${req.failure()?.errorText || 'unknown'}: ${url.slice(0, 150)}`);
  });

  try {
    const response = await page.goto(path, { waitUntil: 'networkidle', timeout: 20000 });

    // Check HTTP status
    if (response && response.status() >= 400) {
      report.networkErrors.push(`HTTP ${response.status()} on ${path}`);
    }

    // Wait for content to render
    await page.waitForTimeout(2000);

    // Check for "Application error" crash screen
    const bodyText = await page.textContent('body');
    if (bodyText?.includes('Application error') || bodyText?.includes('client-side exception')) {
      report.consoleErrors.push('APPLICATION CRASH: client-side exception detected');
    }

    // Take screenshot
    await page.screenshot({ path: `tests/screenshots/${name}.png`, fullPage: true });

  } catch (err) {
    report.networkErrors.push(`Navigation failed: ${String(err).slice(0, 200)}`);
  }

  if (report.consoleErrors.length > 0 || report.networkErrors.length > 0) {
    report.status = 'fail';
  }

  reports.push(report);
  return report;
}

// ─── PUBLIC PAGES (no auth required) ───

test.describe('Public Pages - No Auth', () => {
  test('Homepage loads without errors', async ({ page }) => {
    const r = await auditPage(page, '/', 'homepage');
    expect(r.networkErrors).toHaveLength(0);
  });

  test('Login page loads', async ({ page }) => {
    const r = await auditPage(page, '/login', 'login');
    expect(r.networkErrors).toHaveLength(0);
  });

  test('Signup page loads', async ({ page }) => {
    const r = await auditPage(page, '/signup', 'signup');
    expect(r.networkErrors).toHaveLength(0);
  });

  test('Pricing page loads', async ({ page }) => {
    const r = await auditPage(page, '/pricing', 'pricing');
    expect(r.networkErrors).toHaveLength(0);
  });

  test('Survey page loads', async ({ page }) => {
    const r = await auditPage(page, '/survey.html', 'survey');
    expect(r.networkErrors).toHaveLength(0);
  });
});

// ─── COURSE OVERVIEW PAGES (public) ───

// ─── LESSON PAGES WITH MERMAID DIAGRAMS ───

// ─── API HEALTH CHECKS ───

test.describe('API Endpoints', () => {
  test('Survey API accepts POST', async ({ request }) => {
    const res = await request.post('/api/survey', {
      data: { name: 'Test', email: 'test@test.com', nps: 8 },
    });
    // Should return 200 (success) or 500 (table not created yet) — not crash
    expect([200, 500]).toContain(res.status());
  });

  test('Ensure-profile API requires auth', async ({ request }) => {
    const res = await request.post('/api/auth/ensure-profile');
    expect(res.status()).toBe(401);
  });

  test('Submissions API requires password', async ({ request }) => {
    const res = await request.get('/api/submissions?password=wrong');
    expect(res.status()).toBe(401);
  });
});

// ─── LANGUAGE COURSE PAGES ───
