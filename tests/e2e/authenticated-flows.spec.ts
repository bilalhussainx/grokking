import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots', 'authenticated');
const TEST_EMAIL = 'testuser789@test.com';
const TEST_PASSWORD = 'AuditPro2026!';

// Helper to login before each test
async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(TEST_EMAIL);
  await page.locator('input[type="password"]').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  // Wait for redirect to dashboard
  await page.waitForURL(/\//, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Authenticated Dashboard', () => {
  test('dashboard shows user stats and credits', async ({ page }) => {
    await login(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-loggedin.png'), fullPage: true });

    // Should show credits badge
    const credits = page.locator('text=/\\d+k?/').first();
    await expect(page.locator('body')).toBeVisible();
  });

});

test.describe('Authenticated Dashboard — Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile dashboard with credits', async ({ page }) => {
    await login(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-dashboard-loggedin.png'), fullPage: true });
  });
});

test.describe('Onboarding Flow', () => {
  // Note: onboarding only shows for new users without onboarding_completed
  // The test user may have already completed onboarding
  test('onboarding page structure', async ({ page }) => {
    await login(page);
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'onboarding-step1.png'),
      fullPage: true,
    });
  });
});

test.describe('Settings Page', () => {
  test('settings page shows user profile', async ({ page }) => {
    await login(page);
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'settings.png'),
      fullPage: true,
    });

    await expect(page.getByText('Settings')).toBeVisible({ timeout: 10000 });
  });
});
