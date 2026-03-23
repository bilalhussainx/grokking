import { test, expect } from '@playwright/test';

const BASE = 'https://grokking-delta.vercel.app';
const SCREENSHOT_DIR = 'tests/screenshots/visual-review';

// Test credentials
const TEST_EMAIL = 'testuser789@test.com';
const TEST_PASSWORD = 'AuditPro2026!';

// ═══════════════════════════════════════════════════════
// UNAUTHENTICATED USER FLOWS
// ═══════════════════════════════════════════════════════

test.describe('Unauthenticated User', () => {
  test('Homepage', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500); // animations
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-homepage-guest.png`,
      fullPage: true,
    });
  });

  test('Top Navigation (guest)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    // Capture just the nav area
    const nav = page.locator('nav').first();
    await nav.screenshot({
      path: `${SCREENSHOT_DIR}/02-topnav-guest.png`,
    });
  });

  test('Courses page', async ({ page }) => {
    await page.goto(`${BASE}/courses`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-courses-page.png`,
      fullPage: true,
    });
  });

  test('Login page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/04-login-page.png`,
      fullPage: true,
    });
  });

  test('Signup page', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/05-signup-page.png`,
      fullPage: true,
    });
  });

  test('Forgot password page', async ({ page }) => {
    await page.goto(`${BASE}/forgot-password`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/06-forgot-password.png`,
      fullPage: true,
    });
  });

  test('Search modal (Ctrl+K)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-search-modal-empty.png`,
      fullPage: false,
    });
    // Type a search query
    await page.keyboard.type('python');
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/08-search-results-python.png`,
      fullPage: false,
    });
  });
});

// ═══════════════════════════════════════════════════════
// AUTHENTICATED USER FLOWS
// ═══════════════════════════════════════════════════════

test.describe('Authenticated User', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // let auth context load
  });

  test('Dashboard / Homepage (logged in)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/10-dashboard-loggedin.png`,
      fullPage: true,
    });
  });

  test('Top Navigation (logged in)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    const nav = page.locator('nav').first();
    await nav.screenshot({
      path: `${SCREENSHOT_DIR}/11-topnav-loggedin.png`,
    });
  });

  test('Gamification: Streak + Stats', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    // Try to capture the stats section
    const stats = page.locator('.grid.grid-cols-4, .grid.grid-cols-3').first();
    if (await stats.isVisible()) {
      await stats.screenshot({
        path: `${SCREENSHOT_DIR}/12-gamification-stats.png`,
      });
    } else {
      // Capture the top section of homepage instead
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/12-gamification-stats.png`,
        clip: { x: 0, y: 0, width: 1280, height: 600 },
      });
    }
  });

  test('Courses page (logged in, with progress)', async ({ page }) => {
    await page.goto(`${BASE}/courses`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/13-courses-loggedin.png`,
      fullPage: true,
    });
  });

  test('Course: Coding Interview Premium (lesson view)', async ({ page }) => {
    await page.goto(`${BASE}/course/coding-interview-premium/two-pointers-intro`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/14-lesson-coding-interview.png`,
      fullPage: true,
    });
  });

  test('Course: Python Fundamentals (lesson view)', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/15-lesson-python.png`,
      fullPage: true,
    });
  });

  test('Language Course: Hindi Beginner', async ({ page }) => {
    await page.goto(`${BASE}/course/hindi-beginner`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/16-hindi-beginner.png`,
      fullPage: true,
    });
  });

  test('Language Course: Spanish Beginner', async ({ page }) => {
    await page.goto(`${BASE}/course/spanish-beginner`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/17-spanish-beginner.png`,
      fullPage: true,
    });
  });

  test('Talk page (voice chat)', async ({ page }) => {
    await page.goto(`${BASE}/talk`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/18-talk-page.png`,
      fullPage: true,
    });
  });

  test('Career page', async ({ page }) => {
    await page.goto(`${BASE}/career`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/19-career-page.png`,
      fullPage: true,
    });
  });

  test('Settings page', async ({ page }) => {
    await page.goto(`${BASE}/settings`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/20-settings-page.png`,
      fullPage: true,
    });
  });

  test('Light mode toggle', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    // Click the theme toggle (sun/moon icon)
    const themeBtn = page.locator('button[aria-label="Toggle dark mode"]');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/21-light-mode-homepage.png`,
      fullPage: true,
    });
  });

  test('Keyboard shortcuts help (?)', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.keyboard.press('?');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/22-keyboard-shortcuts.png`,
      fullPage: false,
    });
  });

  test('Onboarding wizard (fresh user simulation)', async ({ page }) => {
    // Clear onboarding flag to trigger wizard
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => localStorage.removeItem('onboarding_complete'));
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/23-onboarding-step1.png`,
      fullPage: false,
    });
  });
});

// ═══════════════════════════════════════════════════════
// MOBILE VIEWS (iPhone 14 viewport: 390×844)
// ═══════════════════════════════════════════════════════

test.describe('Mobile — Unauthenticated', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Homepage (mobile)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m01-homepage-mobile.png`,
      fullPage: true,
    });
  });

  test('TopNav (mobile)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const nav = page.locator('nav').first();
    await nav.screenshot({
      path: `${SCREENSHOT_DIR}/m02-topnav-mobile.png`,
    });
  });

  test('Courses (mobile)', async ({ page }) => {
    await page.goto(`${BASE}/courses`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m03-courses-mobile.png`,
      fullPage: true,
    });
  });

  test('Login (mobile)', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m04-login-mobile.png`,
      fullPage: true,
    });
  });
});

test.describe('Mobile — Authenticated', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('Dashboard (mobile, logged in)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m10-dashboard-mobile.png`,
      fullPage: true,
    });
  });

  test('TopNav + gamification (mobile)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m11-topnav-gamification-mobile.png`,
      clip: { x: 0, y: 0, width: 390, height: 500 },
    });
  });

  test('Lesson view (mobile)', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m12-lesson-mobile.png`,
      fullPage: true,
    });
  });

  test('Language course (mobile)', async ({ page }) => {
    await page.goto(`${BASE}/course/hindi-beginner`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m13-hindi-mobile.png`,
      fullPage: true,
    });
  });

  test('Talk page (mobile)', async ({ page }) => {
    await page.goto(`${BASE}/talk`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m14-talk-mobile.png`,
      fullPage: true,
    });
  });

  test('Career page (mobile)', async ({ page }) => {
    await page.goto(`${BASE}/career`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m15-career-mobile.png`,
      fullPage: true,
    });
  });

  test('Light mode (mobile)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    const themeBtn = page.locator('button[aria-label="Toggle dark mode"]');
    if (await themeBtn.isVisible()) await themeBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/m16-light-mode-mobile.png`,
      fullPage: true,
    });
  });
});
