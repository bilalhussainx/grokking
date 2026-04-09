/**
 * Arena IDE — Lobby E2E tests (Phase 1, Task 10)
 *
 * Hermetic: all `/api/arena/**` calls are mocked via page.route(). No real
 * Supabase, Vercel Sandbox SDK, or OpenRouter calls happen here.
 *
 * Auth note:
 * The `/arena` route is protected by src/middleware.ts which calls
 * `supabase.auth.getUser()` server-side. page.route() cannot intercept the
 * middleware itself, so these tests require one of:
 *   (a) a pre-seeded Supabase test user + valid session cookie (set via
 *       beforeEach below — flip `USE_REAL_AUTH` to true and provide creds), or
 *   (b) a middleware bypass when `process.env.E2E_BYPASS_AUTH === '1'`
 *       (not yet implemented — Phase 1 leaves this as a follow-up).
 *
 * For Phase 1 the tests are written against the API surface so they become
 * runnable the moment either escape hatch lands. `npx playwright test --list`
 * must still pick them up today.
 */
import { test, expect, type Route } from '@playwright/test';

const TEST_ROOM_ID = 'test-room-abc';
const TEST_SANDBOX_ID = 'test-sandbox-xyz';

function mockRoomCreateSuccess(route: Route) {
  return route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      id: TEST_ROOM_ID,
      challenge_id: 'rate-limiter-api',
      persona_id: 'alex-chen',
      sandbox_id: null,
      status: 'active',
      settings: { track: 'backend', mode: 'passive', durationMin: 45 },
    }),
  });
}

function mockSandboxProvisionSuccess(route: Route) {
  return route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ sandboxId: TEST_SANDBOX_ID }),
  });
}

test.describe('Arena lobby', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API routes up-front so no real network fires.
    await page.route('**/api/arena/rooms', async route => {
      if (route.request().method() === 'POST') {
        await mockRoomCreateSuccess(route);
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ rooms: [] }),
        });
      }
    });
    await page.route('**/api/arena/sandbox', mockSandboxProvisionSuccess);
  });

  test('renders all form fields', async ({ page }) => {
    await page.goto('/arena');

    await expect(page.getByTestId('arena-lobby-form')).toBeVisible();
    await expect(page.getByTestId('arena-lobby-challenge')).toBeVisible();
    await expect(page.getByTestId('arena-lobby-persona')).toBeVisible();
    await expect(page.getByTestId('arena-lobby-track')).toBeVisible();
    await expect(page.getByTestId('arena-lobby-mode')).toBeVisible();
    await expect(page.getByTestId('arena-lobby-duration')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /start interview/i }),
    ).toBeVisible();
  });

  test('start session creates room and navigates to session page', async ({ page }) => {
    await page.goto('/arena');

    await page.getByRole('button', { name: /start interview/i }).click();

    await page.waitForURL(new RegExp(`/arena/${TEST_ROOM_ID}`), { timeout: 10_000 });
    expect(page.url()).toContain(`/arena/${TEST_ROOM_ID}`);
  });

  test('shows error banner on room creation failure', async ({ page }) => {
    // Override the rooms POST mock to return 500 for this test.
    await page.route('**/api/arena/rooms', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Room creation exploded' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ rooms: [] }),
        });
      }
    });

    await page.goto('/arena');
    await page.getByRole('button', { name: /start interview/i }).click();

    await expect(page.getByText(/room creation exploded/i)).toBeVisible();
    // URL should NOT have changed.
    expect(page.url()).toMatch(/\/arena\/?$/);
  });
});
