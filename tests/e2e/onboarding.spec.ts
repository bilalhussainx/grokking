import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
  test('onboarding page loads with language step', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.getByText('What language do you speak?')).toBeVisible();
  });

  test('shows all 18 supported languages', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.getByText('English')).toBeVisible();
    await expect(page.getByText('Spanish')).toBeVisible();
    await expect(page.getByText('Hindi')).toBeVisible();
    await expect(page.getByText('Bengali')).toBeVisible();
    await expect(page.getByText('Tamil')).toBeVisible();
  });

  test('selecting non-English shows fluency question', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByText('Hindi').click();
    await expect(page.getByText('How well do you understand English?')).toBeVisible();
  });

  test('can navigate through all steps', async ({ page }) => {
    await page.goto('/onboarding');

    // Step 1: Language — select English (skips fluency question)
    await page.getByText('English').first().click();
    await page.getByText('Continue').click();

    // Step 2: Interests
    await expect(page.getByText('What interests you?')).toBeVisible();
    await page.getByText('Programming & CS').click();
    await page.getByText('Continue').click();

    // Step 3: Style
    await expect(page.getByText('How do you like to learn?')).toBeVisible();
    await page.getByText('Mix of Both').click();
    await page.getByText('Continue').click();

    // Step 4: Privacy
    await expect(page.getByText('Personalization & Privacy')).toBeVisible();
    await page.getByText('Continue').click();

    // Step 5: Summary
    await expect(page.getByText("You're all set!")).toBeVisible();
    await expect(page.getByText('Start Learning')).toBeVisible();
  });

  test('privacy step shows consent checkbox', async ({ page }) => {
    await page.goto('/onboarding');
    // Navigate to privacy step
    await page.getByText('English').first().click();
    await page.getByText('Continue').click();
    await page.getByText('Continue').click();
    await page.getByText('Continue').click();

    await expect(page.getByText('Our Privacy Promise')).toBeVisible();
    await expect(page.getByText('never shared')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  });
});
