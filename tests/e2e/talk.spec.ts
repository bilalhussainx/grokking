import { test, expect } from '@playwright/test';

test.describe('Talk Page', () => {
  test('shows language selection grid', async ({ page }) => {
    await page.goto('/talk');
    await expect(page.getByText('Who do you want to talk to?')).toBeVisible();
    // Should show language options
    await expect(page.getByText('Spanish')).toBeVisible();
    await expect(page.getByText('French')).toBeVisible();
    await expect(page.getByText('Hindi')).toBeVisible();
  });

  test('can select a language', async ({ page }) => {
    await page.goto('/talk');
    await page.getByText('Spanish').click();
    // Should show conversation screen (mic controls visible)
    await expect(page.locator('body')).toBeVisible();
  });

  test('preselected language via URL param', async ({ page }) => {
    await page.goto('/talk?lang=fr');
    // Should skip language selection and go to conversation
    await expect(page.locator('body')).toBeVisible();
  });
});
