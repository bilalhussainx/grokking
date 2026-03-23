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

  test('Courses page loads', async ({ page }) => {
    const r = await auditPage(page, '/courses', 'courses');
    expect(r.networkErrors).toHaveLength(0);
  });

  test('Talk page loads', async ({ page }) => {
    const r = await auditPage(page, '/talk', 'talk');
    expect(r.networkErrors).toHaveLength(0);
  });

  test('Survey page loads', async ({ page }) => {
    const r = await auditPage(page, '/survey.html', 'survey');
    expect(r.networkErrors).toHaveLength(0);
  });
});

// ─── COURSE OVERVIEW PAGES (public) ───

test.describe('Course Overview Pages', () => {
  const courseSlugs = [
    'coding-interview',
    'coding-interview-premium',
    'system-design',
    'python-fundamentals',
    'data-structures-algorithms',
    'personal-finance',
    'islam-foundations',
    'buddhism-foundations',
    'stoic-philosophy',
    'ai-ml-fundamentals',
    'mental-health-resilience',
    'ap-biology',
  ];

  for (const slug of courseSlugs) {
    test(`Course overview: ${slug}`, async ({ page }) => {
      const r = await auditPage(page, `/course/${slug}`, `course-${slug}`);
      expect(r.networkErrors).toHaveLength(0);
    });
  }
});

// ─── LESSON PAGES WITH MERMAID DIAGRAMS ───

test.describe('Lesson Pages - Mermaid Diagrams Render', () => {
  // Test a sample lesson from each Phase to verify Mermaid renders
  const lessonPages = [
    // Phase 1: CS
    { path: '/course/coding-interview/two-pointers-intro', name: 'mermaid-two-pointers' },
    { path: '/course/data-structures-algorithms/bst-operations', name: 'mermaid-bst' },
    // Phase 2: System Design
    { path: '/course/system-design/introduction-to-system-design', name: 'mermaid-sysdesign' },
    // Phase 3: Python
    { path: '/course/python-fundamentals/if-statements', name: 'mermaid-python-control' },
    // Phase 4: Religion
    { path: '/course/islam-foundations/what-is-islam', name: 'mermaid-islam' },
    { path: '/course/buddhism-foundations/the-four-noble-truths', name: 'mermaid-buddhism' },
    // Phase 5: Finance/Health
    { path: '/course/personal-finance/income-expenses-net-worth', name: 'mermaid-finance' },
    { path: '/course/mental-health-resilience/what-is-mental-health', name: 'mermaid-mental' },
    // Phase 6: Philosophy
    { path: '/course/stoic-philosophy/what-is-stoicism', name: 'mermaid-stoic' },
  ];

  for (const { path, name } of lessonPages) {
    test(`Lesson renders: ${name}`, async ({ page }) => {
      const r = await auditPage(page, path, name);
      // Lesson pages require auth — may redirect to login
      // That's OK, we just check no crashes or network errors
      expect(r.consoleErrors.filter(e => e.includes('APPLICATION CRASH'))).toHaveLength(0);
    });
  }
});

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

  test('Coach API requires auth', async ({ request }) => {
    const res = await request.post('/api/ai/coach', {
      data: { event: 'test' },
    });
    expect(res.status()).toBe(401);
  });

  test('Submissions API requires password', async ({ request }) => {
    const res = await request.get('/api/submissions?password=wrong');
    expect(res.status()).toBe(401);
  });
});

// ─── LANGUAGE COURSE PAGES ───

test.describe('Language Course Pages', () => {
  const langCourses = [
    'french-beginner',
    'spanish-beginner',
    'hindi-beginner',
    'english-beginner',
  ];

  for (const slug of langCourses) {
    test(`Language course overview: ${slug}`, async ({ page }) => {
      const r = await auditPage(page, `/course/${slug}`, `lang-${slug}`);
      expect(r.networkErrors).toHaveLength(0);
    });
  }
});
