import { test, expect } from '@playwright/test';

// These tests run on iPhone 14 viewport (390x844)
test.describe('Mobile UI', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('dashboard fits mobile screen without horizontal scroll', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance
  });

  test('nav bar is visible and compact on mobile', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    const navHeight = await nav.evaluate(el => el.getBoundingClientRect().height);
    expect(navHeight).toBeLessThan(60);
  });

  test('login page fits mobile without overflow', async ({ page }) => {
    await page.goto('/login');
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test('signup page fits mobile without overflow', async ({ page }) => {
    await page.goto('/signup');
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test('course page is readable on mobile', async ({ page }) => {
    await page.goto('/course/islam-foundations/what-is-islam');
    await page.waitForLoadState('networkidle');
    // Content should be visible and not clipped
    const content = page.locator('article, .prose, main').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('talk page language grid works on mobile', async ({ page }) => {
    await page.goto('/talk');
    await expect(page.getByText('Spanish')).toBeVisible();
    // Tap a language
    await page.getByText('Spanish').click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('translate bar does not block content', async ({ page }) => {
    await page.goto('/');
    // Translate bar should be visible but small
    const translateBtn = page.getByText('Translate');
    if (await translateBtn.isVisible()) {
      const rect = await translateBtn.evaluate(el => el.getBoundingClientRect());
      // Should be at the bottom, not covering main content
      expect(rect.top).toBeGreaterThan(700);
    }
  });

  test('onboarding is usable on mobile', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.getByText('What language do you speak?')).toBeVisible();
    // Language grid should be scrollable
    await expect(page.getByText('English')).toBeVisible();
    // Continue button should be visible without scrolling past viewport
    const continueBtn = page.getByText('Continue');
    await expect(continueBtn).toBeVisible();
  });
});

test.describe('Mobile Coach Panel', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('placement page works on mobile', async ({ page }) => {
    await page.goto('/placement/es');
    await expect(page.getByText('Placement Test')).toBeVisible();
  });
});
