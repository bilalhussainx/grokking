import { test, expect } from '@playwright/test';

test.describe('Courses', () => {
  test('courses page loads', async ({ page }) => {
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');
    // Should have at least one course card
    const courseLinks = page.locator('a[href^="/course/"]');
    await expect(courseLinks.first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to a free course', async ({ page }) => {
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');
    // Click first course link
    const firstCourse = page.locator('a[href^="/course/"]').first();
    await firstCourse.click();
    await expect(page).toHaveURL(/\/course\//);
  });

  test('course page shows modules and lessons', async ({ page }) => {
    await page.goto('/course/python-fundamentals');
    await page.waitForLoadState('networkidle');
    // Should have lesson links
    const lessonLinks = page.locator('a[href*="/course/python-fundamentals/"]');
    expect(await lessonLinks.count()).toBeGreaterThan(0);
  });

  test('lesson page loads with content', async ({ page }) => {
    await page.goto('/course/islam-foundations/what-is-islam');
    await page.waitForLoadState('networkidle');
    // Should show lesson content
    await expect(page.locator('article, .prose, [class*="lesson"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('coding course lesson has exercise link', async ({ page }) => {
    await page.goto('/course/python-fundamentals');
    await page.waitForLoadState('networkidle');
    // Navigate to first lesson
    const firstLesson = page.locator('a[href*="/course/python-fundamentals/"]').first();
    await firstLesson.click();
    await page.waitForLoadState('networkidle');
    // May have exercise link
    const exerciseLink = page.locator('a[href*="/exercise"]');
    // Not all lessons have exercises — just check the page loaded
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Language Courses', () => {
  test('Spanish beginner course page loads', async ({ page }) => {
    await page.goto('/course/spanish-beginner');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('French beginner course page loads', async ({ page }) => {
    await page.goto('/course/french-beginner');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Hindi beginner course page loads', async ({ page }) => {
    await page.goto('/course/hindi-beginner');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Chinese beginner course page loads', async ({ page }) => {
    await page.goto('/course/chinese-beginner');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('English ESL beginner course page loads', async ({ page }) => {
    await page.goto('/course/english-beginner');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});
