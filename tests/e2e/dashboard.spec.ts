import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('loads homepage with hero and action cards', async ({ page }) => {
    await page.goto('/');

    // Hero section
    await expect(page.getByText('Master Anything')).toBeVisible();

    // Talk and Learn cards
    await expect(page.getByText('Talk')).toBeVisible();
    await expect(page.getByText('Learn')).toBeVisible();
    await expect(page.getByText('Start Talking')).toBeVisible();
    await expect(page.getByText('Browse Courses')).toBeVisible();
  });

  test('shows Quick Voice Practice languages', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Quick Voice Practice')).toBeVisible();
    // Should show language flags
    await expect(page.getByText('Spanish')).toBeVisible();
    await expect(page.getByText('French')).toBeVisible();
  });

  test('shows Featured Courses section', async ({ page }) => {
    await page.goto('/');
    // Should have either Premium or Free courses
    const premiumHeader = page.getByText('Premium Courses');
    const freeHeader = page.getByText('Free');
    await expect(premiumHeader.or(freeHeader).first()).toBeVisible();
  });

  test('nav bar shows Samsara.ai branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Samsara')).toBeVisible();
  });

  test('Talk card links to /talk', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Start Talking').click();
    await expect(page).toHaveURL(/\/talk/);
  });

  test('Learn card links to /courses', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Browse Courses').click();
    await expect(page).toHaveURL(/\/courses/);
  });
});
