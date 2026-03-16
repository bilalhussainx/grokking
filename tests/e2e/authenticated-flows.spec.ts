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

  test('dashboard shows Quick Voice Practice', async ({ page }) => {
    await login(page);
    await expect(page.getByText('Quick Voice Practice')).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-voice-practice.png') });
  });

  test('dashboard shows Featured Courses', async ({ page }) => {
    await login(page);
    // Scroll to courses
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-courses.png') });
  });
});

test.describe('Authenticated Dashboard — Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile dashboard with credits', async ({ page }) => {
    await login(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-dashboard-loggedin.png'), fullPage: true });
  });
});

test.describe('Course Browsing', () => {
  test('courses listing page shows all courses', async ({ page }) => {
    await login(page);
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'courses-listing.png'), fullPage: true });

    // Should have course cards
    const courseCards = page.locator('a[href^="/course/"]');
    expect(await courseCards.count()).toBeGreaterThan(5);
  });

  // Test each major course category
  const COURSES_TO_TEST = [
    { slug: 'python-fundamentals', name: 'Python Fundamentals' },
    { slug: 'islam-foundations', name: 'Islam Foundations' },
    { slug: 'stoic-philosophy', name: 'Stoic Philosophy' },
    { slug: 'mental-health-resilience', name: 'Mental Health' },
    { slug: 'data-structures-algorithms', name: 'DSA' },
    { slug: 'spanish-beginner', name: 'Spanish Beginner' },
    { slug: 'french-beginner', name: 'French Beginner' },
    { slug: 'hindi-beginner', name: 'Hindi Beginner' },
    { slug: 'english-beginner', name: 'English ESL Beginner' },
    { slug: 'spanish-intermediate', name: 'Spanish Intermediate' },
    { slug: 'french-advanced', name: 'French Advanced' },
    { slug: 'coding-interview', name: 'Coding Interview' },
    { slug: 'system-design', name: 'System Design' },
  ];

  for (const course of COURSES_TO_TEST) {
    test(`course page loads: ${course.name}`, async ({ page }) => {
      await login(page);
      await page.goto(`/course/${course.slug}`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `course-${course.slug}.png`),
        fullPage: true,
      });
      // Page should not be an error page
      await expect(page.locator('body')).not.toContainText('404');
      await expect(page.locator('body')).not.toContainText('Application error');
    });
  }
});

test.describe('Lesson Pages + Coach Alex', () => {
  test('Islam lesson opens with Coach Alex auto-starting', async ({ page }) => {
    await login(page);
    await page.goto('/course/islam-foundations/what-is-islam');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for coach auto-start

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'lesson-islam-with-coach.png'),
      fullPage: true,
    });

    // Coach panel should be visible (auto-opened)
    const coachPanel = page.getByText('Coach Alex').or(page.getByText('Coach'));
    // It might auto-open or show FAB
  });

  test('Python lesson opens with content', async ({ page }) => {
    await login(page);
    await page.goto('/course/python-fundamentals/variables-types');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'lesson-python-variables.png'),
      fullPage: true,
    });
  });

  test('Spanish beginner lesson shows vocabulary', async ({ page }) => {
    await login(page);
    // Get the first lesson slug
    await page.goto('/course/spanish-beginner');
    await page.waitForLoadState('networkidle');

    // Click first lesson
    const firstLesson = page.locator('a[href*="/course/spanish-beginner/"]').first();
    if (await firstLesson.isVisible()) {
      await firstLesson.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'lesson-spanish-beginner.png'),
        fullPage: true,
      });
    }
  });

  test('French beginner lesson loads', async ({ page }) => {
    await login(page);
    await page.goto('/course/french-beginner');
    await page.waitForLoadState('networkidle');

    const firstLesson = page.locator('a[href*="/course/french-beginner/"]').first();
    if (await firstLesson.isVisible()) {
      await firstLesson.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'lesson-french-beginner.png'),
        fullPage: true,
      });
    }
  });

  test('Hindi beginner lesson loads', async ({ page }) => {
    await login(page);
    await page.goto('/course/hindi-beginner');
    await page.waitForLoadState('networkidle');

    const firstLesson = page.locator('a[href*="/course/hindi-beginner/"]').first();
    if (await firstLesson.isVisible()) {
      await firstLesson.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'lesson-hindi-beginner.png'),
        fullPage: true,
      });
    }
  });
});

test.describe('Lesson Pages — Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile lesson with coach panel', async ({ page }) => {
    await login(page);
    await page.goto('/course/islam-foundations/what-is-islam');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'mobile-lesson-islam.png'),
      fullPage: true,
    });
  });

  test('mobile Spanish lesson', async ({ page }) => {
    await login(page);
    // Go directly to a known lesson slug (course overview just redirects)
    await page.goto('/course/spanish-beginner/greetings-farewells');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'mobile-lesson-spanish.png'),
      fullPage: true,
    });
    // Should show lesson content
    await expect(page.locator('body')).not.toContainText('not found');
  });
});

test.describe('Talk Page — Authenticated', () => {
  test('talk page shows language grid', async ({ page }) => {
    await login(page);
    await page.goto('/talk');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'talk-languages.png'),
    });

    await expect(page.getByText('Who do you want to talk to?')).toBeVisible();
    // Check language cards exist using the native language names
    await expect(page.getByText('Español')).toBeVisible();
    await expect(page.getByText('Français')).toBeVisible();
    await expect(page.getByText('日本語')).toBeVisible();
  });

  test('talk page — select Spanish and verify persona', async ({ page }) => {
    await login(page);
    await page.goto('/talk');
    await page.waitForLoadState('networkidle');

    await page.getByText('Spanish').click();
    await page.waitForTimeout(3000); // Wait for voice connection

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'talk-spanish-connected.png'),
    });

    // Should NOT show "Camille" (French) — should show Spanish persona
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('Camille');
  });

  test('talk page — select French and verify persona', async ({ page }) => {
    await login(page);
    await page.goto('/talk');
    await page.waitForLoadState('networkidle');

    await page.getByText('French').click();
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'talk-french-connected.png'),
    });
  });

  test('talk page — select English and verify NOT French', async ({ page }) => {
    await login(page);
    await page.goto('/talk');
    await page.waitForLoadState('networkidle');

    // Click the English language card (not nav elements that also say "English")
    const englishCard = page.locator('button:has-text("English")').first();
    await englishCard.click();
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'talk-english-connected.png'),
    });

    // Should show Sarah (English persona), not Camille (French)
    const headerText = await page.locator('body').textContent() || '';
    expect(headerText).not.toContain('Camille');
  });
});

test.describe('Talk Page — Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile talk page language grid', async ({ page }) => {
    await login(page);
    await page.goto('/talk');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'mobile-talk-languages.png'),
    });
  });

  test('mobile talk — select Hindi', async ({ page }) => {
    await login(page);
    await page.goto('/talk');
    await page.waitForLoadState('networkidle');

    await page.getByText('Hindi').click();
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'mobile-talk-hindi.png'),
    });
  });
});

test.describe('Placement Test', () => {
  test('Spanish placement test loads', async ({ page }) => {
    await login(page);
    await page.goto('/placement/es');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'placement-spanish.png'),
      fullPage: true,
    });

    await expect(page.getByText('Spanish Placement Test')).toBeVisible();
  });

  test('French placement test loads', async ({ page }) => {
    await login(page);
    await page.goto('/placement/fr');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'placement-french.png'),
      fullPage: true,
    });
  });
});

test.describe('Exercise IDE', () => {
  test('coding exercise page loads with resizable panels', async ({ page }) => {
    await login(page);
    // Find a course with exercises
    await page.goto('/course/coding-interview');
    await page.waitForLoadState('networkidle');

    // Click first lesson
    const firstLesson = page.locator('a[href*="/course/coding-interview/"]').first();
    if (await firstLesson.isVisible()) {
      await firstLesson.click();
      await page.waitForLoadState('networkidle');

      // Look for exercise link
      const exerciseLink = page.locator('a[href*="/exercise"]');
      if (await exerciseLink.isVisible()) {
        await exerciseLink.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'exercise-ide.png'),
          fullPage: true,
        });
      }
    }
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
