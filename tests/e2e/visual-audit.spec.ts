import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Visual Audit Tests — captures screenshots of every major screen
 * at both mobile and desktop viewports. Screenshots are saved to
 * tests/screenshots/ for manual or AI-driven visual review.
 */

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

const FLOWS = [
  { name: 'dashboard', url: '/' },
  { name: 'login', url: '/login' },
  { name: 'signup', url: '/signup' },
  { name: 'onboarding', url: '/onboarding' },
  { name: 'courses', url: '/courses' },
  { name: 'talk', url: '/talk' },
  { name: 'pricing', url: '/pricing' },
  { name: 'placement-spanish', url: '/placement/es' },
  { name: 'course-islam', url: '/course/islam-foundations/what-is-islam' },
  { name: 'course-python', url: '/course/python-fundamentals' },
  { name: 'course-spanish-beginner', url: '/course/spanish-beginner' },
];

test.describe('Visual Audit — Desktop (1440x900)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const flow of FLOWS) {
    test(`screenshot: ${flow.name} (desktop)`, async ({ page }) => {
      await page.goto(flow.url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500); // Let animations settle
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `desktop-${flow.name}.png`),
        fullPage: true,
      });
    });
  }
});

test.describe('Visual Audit — Mobile (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const flow of FLOWS) {
    test(`screenshot: ${flow.name} (mobile)`, async ({ page }) => {
      await page.goto(flow.url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `mobile-${flow.name}.png`),
        fullPage: true,
      });
    });
  }
});

test.describe('Visual Audit — User Flows', () => {
  test('flow: signup → onboarding → dashboard', async ({ page }) => {
    test.use({ viewport: { width: 390, height: 844 } });

    // Signup page
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-1-signup.png') });

    // Onboarding page
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-2-onboarding-step1.png') });

    // Click through onboarding
    await page.getByText('English').first().click();
    await page.getByText('Continue').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-3-onboarding-step2.png') });

    await page.getByText('Continue').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-4-onboarding-step3.png') });

    await page.getByText('Continue').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-5-onboarding-step4.png') });

    await page.getByText('Continue').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-6-onboarding-summary.png') });
  });

  test('flow: browse courses → open lesson', async ({ page }) => {
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-courses-list.png'), fullPage: true });

    // Click first course
    const firstCourse = page.locator('a[href^="/course/"]').first();
    if (await firstCourse.isVisible()) {
      await firstCourse.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-course-detail.png'), fullPage: true });

      // Click first lesson
      const firstLesson = page.locator('a[href*="/course/"]').nth(1);
      if (await firstLesson.isVisible()) {
        await firstLesson.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-lesson-with-coach.png'), fullPage: true });
      }
    }
  });

  test('flow: talk page language selection', async ({ page }) => {
    await page.goto('/talk');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-talk-languages.png') });

    // Select Spanish
    await page.getByText('Spanish').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-talk-spanish.png') });
  });
});
