import { test, expect, type Page } from '@playwright/test';

const BASE = 'https://grokking-delta.vercel.app';
const DIR = 'tests/screenshots/comprehensive-audit';
const TEST_EMAIL = 'testuser789@test.com';
const TEST_PASSWORD = 'AuditPro2026!';

// Helper: login and return authenticated page
async function login(page: Page) {
  await page.goto(`${BASE}/login`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', TEST_EMAIL);
  await page.fill('input[type="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);
}

// ════════════════════════════════════════════════
// A. UNAUTHENTICATED USER FLOWS (Desktop)
// ════════════════════════════════════════════════

test.describe('A. Guest Desktop', () => {
  test('A01 — Homepage hero + branding', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${DIR}/A01-homepage-hero.png`, fullPage: true });
  });

  test('A02 — TopNav branding (Samsara.ai logo)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.locator('nav').first().screenshot({ path: `${DIR}/A02-topnav-branding.png` });
  });

  test('A03 — Courses catalog (public access test)', async ({ page }) => {
    await page.goto(`${BASE}/courses`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${DIR}/A03-courses-public.png`, fullPage: true });
  });

  test('A04 — Search modal (Ctrl+K)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(500);
    await page.keyboard.type('system design');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${DIR}/A04-search-system-design.png` });
  });

  test('A05 — Login page', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/A05-login.png`, fullPage: true });
  });

  test('A06 — Signup page', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/A06-signup.png`, fullPage: true });
  });

  test('A07 — Forgot password', async ({ page }) => {
    await page.goto(`${BASE}/forgot-password`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/A07-forgot-password.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// B. AUTHENTICATED — DASHBOARD & GAMIFICATION
// ════════════════════════════════════════════════

test.describe('B. Dashboard & Gamification', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('B01 — Dashboard with stats', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${DIR}/B01-dashboard-stats.png`, fullPage: true });
  });

  test('B02 — TopNav gamification badges', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.locator('nav').first().screenshot({ path: `${DIR}/B02-topnav-gamification.png` });
  });

  test('B03 — Light mode dashboard', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    const themeBtn = page.locator('button[aria-label="Toggle dark mode"]');
    if (await themeBtn.isVisible()) await themeBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/B03-light-mode-dashboard.png`, fullPage: true });
  });

  test('B04 — Career Intelligence page', async ({ page }) => {
    await page.goto(`${BASE}/career`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${DIR}/B04-career-intelligence.png`, fullPage: true });
  });

  test('B05 — Settings page', async ({ page }) => {
    await page.goto(`${BASE}/settings`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/B05-settings.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// C. LESSON EXPERIENCE — CS COURSES
// ════════════════════════════════════════════════

test.describe('C. Lesson Experience (CS)', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('C01 — Python lesson (content + sidebar)', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/C01-python-lesson.png`, fullPage: true });
  });

  test('C02 — Coding Interview lesson + diagram', async ({ page }) => {
    await page.goto(`${BASE}/course/coding-interview-premium/two-pointers-intro`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/C02-coding-interview-lesson.png`, fullPage: true });
  });

  test('C03 — System Design lesson', async ({ page }) => {
    await page.goto(`${BASE}/course/system-design`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/C03-system-design-lesson.png`, fullPage: true });
  });

  test('C04 — Lesson action buttons (Podcast/Slides/PDF)', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    // Close any modal that appears
    const closeBtn = page.locator('button:has-text("Got it"), button:has-text("Reading")').first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(500);
    // Capture the title area with action buttons
    await page.screenshot({ path: `${DIR}/C04-lesson-action-buttons.png`, clip: { x: 0, y: 50, width: 1280, height: 400 } });
  });

  test('C05 — Keyboard shortcuts modal', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const closeBtn = page.locator('button:has-text("Got it"), button:has-text("Reading")').first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
    await page.keyboard.press('?');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/C05-keyboard-shortcuts.png` });
  });

  test('C06 — Slide View (click Slides button)', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const closeBtn = page.locator('button:has-text("Got it"), button:has-text("Reading")').first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(500);
    // Click slides button
    const slidesBtn = page.locator('button:has-text("Slides")').first();
    if (await slidesBtn.isVisible()) {
      await slidesBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${DIR}/C06-slide-view.png` });
      // Navigate to next slide
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${DIR}/C06b-slide-view-page2.png` });
    } else {
      await page.screenshot({ path: `${DIR}/C06-slide-view-button-missing.png` });
    }
  });

  test('C07 — Glossary tooltip hover', async ({ page }) => {
    await page.goto(`${BASE}/course/coding-interview-premium/two-pointers-intro`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const closeBtn = page.locator('button:has-text("Got it"), button:has-text("Reading")').first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(500);
    // Try to find and hover a glossary term
    const glossaryTerm = page.locator('.border-dashed.border-blue-400\\/40').first();
    if (await glossaryTerm.isVisible()) {
      await glossaryTerm.hover();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${DIR}/C07-glossary-tooltip.png` });
    } else {
      await page.screenshot({ path: `${DIR}/C07-glossary-no-terms.png`, fullPage: true });
    }
  });
});

// ════════════════════════════════════════════════
// D. LANGUAGE COURSES
// ════════════════════════════════════════════════

test.describe('D. Language Courses', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('D01 — Hindi Beginner lesson', async ({ page }) => {
    await page.goto(`${BASE}/course/hindi-beginner`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/D01-hindi-beginner.png`, fullPage: true });
  });

  test('D02 — Spanish Beginner lesson', async ({ page }) => {
    await page.goto(`${BASE}/course/spanish-beginner`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // extra wait for language courses
    await page.screenshot({ path: `${DIR}/D02-spanish-beginner.png`, fullPage: true });
  });

  test('D03 — Talk page (language selection)', async ({ page }) => {
    await page.goto(`${BASE}/talk`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${DIR}/D03-talk-languages.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// E. FINANCE & OTHER DOMAINS
// ════════════════════════════════════════════════

test.describe('E. Multi-domain courses', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('E01 — Personal Finance lesson', async ({ page }) => {
    await page.goto(`${BASE}/course/personal-finance`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/E01-personal-finance.png`, fullPage: true });
  });

  test('E02 — Islam Foundations lesson', async ({ page }) => {
    await page.goto(`${BASE}/course/islam-foundations`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/E02-islam-foundations.png`, fullPage: true });
  });

  test('E03 — Stoic Philosophy lesson', async ({ page }) => {
    await page.goto(`${BASE}/course/stoic-philosophy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/E03-stoic-philosophy.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// F. MOBILE VIEWS (390×844)
// ════════════════════════════════════════════════

test.describe('F. Mobile Guest', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('F01 — Homepage mobile', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${DIR}/F01-homepage-mobile.png`, fullPage: true });
  });

  test('F02 — Courses mobile (public)', async ({ page }) => {
    await page.goto(`${BASE}/courses`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${DIR}/F02-courses-mobile.png`, fullPage: true });
  });

  test('F03 — Login mobile', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/F03-login-mobile.png`, fullPage: true });
  });
});

test.describe('F. Mobile Authenticated', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test.beforeEach(async ({ page }) => { await login(page); });

  test('F10 — Dashboard mobile', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${DIR}/F10-dashboard-mobile.png`, fullPage: true });
  });

  test('F11 — TopNav mobile (overflow check)', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.locator('nav').first().screenshot({ path: `${DIR}/F11-topnav-mobile.png` });
  });

  test('F12 — Lesson mobile', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/F12-lesson-mobile.png`, fullPage: true });
  });

  test('F13 — Career mobile', async ({ page }) => {
    await page.goto(`${BASE}/career`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${DIR}/F13-career-mobile.png`, fullPage: true });
  });

  test('F14 — Talk mobile', async ({ page }) => {
    await page.goto(`${BASE}/talk`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${DIR}/F14-talk-mobile.png`, fullPage: true });
  });

  test('F15 — Light mode mobile', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    const themeBtn = page.locator('button[aria-label="Toggle dark mode"]');
    if (await themeBtn.isVisible()) await themeBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${DIR}/F15-light-mode-mobile.png`, fullPage: true });
  });
});

// ════════════════════════════════════════════════
// G. TABLET VIEW (768×1024)
// ════════════════════════════════════════════════

test.describe('G. Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });
  test.beforeEach(async ({ page }) => { await login(page); });

  test('G01 — Dashboard tablet', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${DIR}/G01-dashboard-tablet.png`, fullPage: true });
  });

  test('G02 — Lesson tablet', async ({ page }) => {
    await page.goto(`${BASE}/course/python-fundamentals`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${DIR}/G02-lesson-tablet.png`, fullPage: true });
  });
});
