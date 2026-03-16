import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page loads with Samsara branding', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Samsara')).toBeVisible();
    await expect(page.getByText('Sign in to continue')).toBeVisible();
  });

  test('login page has email and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login page has Google OAuth button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Continue with Google')).toBeVisible();
  });

  test('signup page loads with language selector', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByText('Join Samsara')).toBeVisible();
    await expect(page.getByText('I speak')).toBeVisible();
  });

  test('signup page has invite code field', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByText('Invite Code')).toBeVisible();
    await expect(page.locator('input[placeholder*="INVESTOR"]')).toBeVisible();
  });

  test('signup link from login works', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sign up').click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('login link from signup works', async ({ page }) => {
    await page.goto('/signup');
    await page.getByText('Sign in').click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('can login with test account', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('testuser789@test.com');
    await page.locator('input[type="password"]').fill('AuditPro2026!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to dashboard or onboarding
    await page.waitForURL(/(\/|\/onboarding)/, { timeout: 10000 });
  });
});
