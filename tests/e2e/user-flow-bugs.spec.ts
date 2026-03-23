import { test, expect } from '@playwright/test';

const BASE = 'https://grokking-delta.vercel.app';
const DIR = 'tests/screenshots/user-flow-bugs';
const TEST_EMAIL = 'testuser789@test.com';
const TEST_PASSWORD = 'AuditPro2026!';
const DUPLICATE_EMAIL = 'bilalhussain.v1@gmail.com';

// ════════════════════════════════════════════════
// 1. DUPLICATE SIGNUP TEST
// ════════════════════════════════════════════════

test.describe('1. Duplicate Signup', () => {
  test('Desktop — signup with existing email', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.fill('input[placeholder="Your name"], input[id="name"]', 'Test Duplicate');
    await page.fill('input[type="email"]', DUPLICATE_EMAIL);
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.screenshot({ path: `${DIR}/1a-signup-filled-desktop.png` });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/1b-signup-result-desktop.png`, fullPage: true });
  });

  test('Mobile — signup with existing email', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/signup`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.fill('input[placeholder="Your name"], input[id="name"]', 'Test Duplicate');
    await page.fill('input[type="email"]', DUPLICATE_EMAIL);
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/1c-signup-result-mobile.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// 2. COURSE ACCESS WITH 0 CREDITS
// ════════════════════════════════════════════════

test.describe('2. Zero Credits Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', DUPLICATE_EMAIL);
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard with 0 credits', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/2a-dashboard-0credits.png`, fullPage: true });
  });

  test('Access free course with 0 credits', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/2b-free-course-0credits.png`, fullPage: true });
  });

  test('Access pro course with 0 credits', async ({ page }) => {
    await page.goto(`${BASE}/course/coding-interview-premium`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/2c-pro-course-0credits.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// 3. DID YOU KNOW CARD POSITION
// ════════════════════════════════════════════════

test.describe('3. DYK + Translate Bar Overlap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
  });

  test('Desktop — DYK card not blocked by translate bar', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `${DIR}/3a-dyk-position-desktop.png`, fullPage: true });
  });

  test('Mobile — DYK card visibility', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `${DIR}/3b-dyk-position-mobile.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// 4. RELIGIOUS COURSES — UNICODE CHECK
// ════════════════════════════════════════════════

test.describe('4. Religious Course Unicode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
  });

  test('Taoism — Chinese characters render', async ({ page }) => {
    await page.goto(`${BASE}/course/taoism-foundations`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/4a-taoism-unicode.png`, fullPage: true });
  });

  test('Judaism — Hebrew characters render', async ({ page }) => {
    await page.goto(`${BASE}/course/judaism-foundations`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/4b-judaism-unicode.png`, fullPage: true });
  });

  test('Hinduism — Devanagari renders', async ({ page }) => {
    await page.goto(`${BASE}/course/hinduism-foundations`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/4c-hinduism-unicode.png`, fullPage: true });
  });

  test('Islam — Arabic renders', async ({ page }) => {
    await page.goto(`${BASE}/course/islam-foundations`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/4d-islam-unicode.png`, fullPage: true });
  });

  test('Confucianism — Chinese renders', async ({ page }) => {
    await page.goto(`${BASE}/course/confucianism-foundations`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/4e-confucianism-unicode.png`, fullPage: true });
  });

  test('Sikhism — Gurmukhi renders', async ({ page }) => {
    await page.goto(`${BASE}/course/sikhism-foundations`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${DIR}/4f-sikhism-unicode.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// 5. SLIDES + PODCAST + PDF BUTTONS
// ════════════════════════════════════════════════

test.describe('5. Lesson Action Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
  });

  test('Stoic Philosophy — action buttons visible', async ({ page }) => {
    await page.goto(`${BASE}/course/stoic-philosophy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    // Close any DYK modal
    const closeBtn = page.locator('button:has(svg.lucide-x)').first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/5a-action-buttons-stoic.png`, clip: { x: 0, y: 50, width: 960, height: 400 } });
  });

  test('Slides view opens', async ({ page }) => {
    await page.goto(`${BASE}/course/stoic-philosophy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    const closeBtn = page.locator('button:has(svg.lucide-x)').first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(500);
    const slidesBtn = page.locator('button:has-text("Slides"), button[title*="slides"]').first();
    if (await slidesBtn.isVisible()) {
      await slidesBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${DIR}/5b-slides-open.png` });
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${DIR}/5c-slides-page2.png` });
      await page.keyboard.press('Escape');
    } else {
      await page.screenshot({ path: `${DIR}/5b-slides-btn-missing.png`, fullPage: true });
    }
  });

  test('Podcast button visible', async ({ page }) => {
    await page.goto(`${BASE}/course/stoic-philosophy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    const podcastBtn = page.locator('button:has-text("Listen as Podcast"), button:has-text("Podcast")').first();
    const isVisible = await podcastBtn.isVisible();
    await page.screenshot({ path: `${DIR}/5d-podcast-button-${isVisible ? "visible" : "missing"}.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// 6. TALK PAGE — LANGUAGE SELECTION
// ════════════════════════════════════════════════

test.describe('6. Talk Page Languages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
  });

  test('Talk page — all languages shown', async ({ page }) => {
    await page.goto(`${BASE}/talk`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${DIR}/6a-talk-languages.png`, fullPage: true });
  });

  test('Japanese persona (not Carlos)', async ({ page }) => {
    await page.goto(`${BASE}/talk?lang=ja`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/6b-talk-japanese.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// 7. ONBOARDING FLOW
// ════════════════════════════════════════════════

test.describe('7. Onboarding', () => {
  test('No redirect loop on homepage', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    // Should NOT be on /onboarding
    const url = page.url();
    await page.screenshot({ path: `${DIR}/7a-no-redirect-loop.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// 8. MOBILE-SPECIFIC ISSUES
// ════════════════════════════════════════════════

test.describe('8. Mobile Issues', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
  });

  test('Mobile TopNav — no overflow', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.locator('nav').first().screenshot({ path: `${DIR}/8a-mobile-topnav.png` });
  });

  test('Mobile lesson — Coach FAB not blocking', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `${DIR}/8b-mobile-lesson-fab.png`, fullPage: true });
  });

  test('Mobile courses page loads', async ({ page }) => {
    await page.goto(`${BASE}/courses`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/8c-mobile-courses.png`, fullPage: true });
  });

  test('Mobile career page loads', async ({ page }) => {
    await page.goto(`${BASE}/career`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/8d-mobile-career.png`, fullPage: true });
  });

  test('Mobile light mode', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    const themeBtn = page.locator('button[aria-label="Toggle dark mode"]');
    if (await themeBtn.isVisible()) await themeBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/8e-mobile-light.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// 9. SEARCH FUNCTIONALITY
// ════════════════════════════════════════════════

test.describe('9. Search', () => {
  test('Search for religion course', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(500);
    await page.keyboard.type('islam');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${DIR}/9a-search-islam.png` });
  });

  test('Search for finance', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(500);
    await page.keyboard.type('finance');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${DIR}/9b-search-finance.png` });
  });
});
