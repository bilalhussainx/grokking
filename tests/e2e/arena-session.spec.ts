/**
 * Arena IDE — Session page E2E tests (Phase 1, Task 10)
 *
 * Hermetic: all `/api/arena/**` calls are mocked via page.route(). No real
 * Supabase, Vercel Sandbox SDK, or OpenRouter calls happen here.
 *
 * See arena-lobby.spec.ts for the auth handling note that applies to every
 * test in this file.
 */
import { test, expect, type Route } from '@playwright/test';

const TEST_ROOM_ID = 'test-room-abc';
const MISSING_ROOM_ID = 'missing-room';
const TEST_SANDBOX_ID = 'test-sandbox-xyz';
const NEW_SANDBOX_ID = 'newly-provisioned-sandbox';

const ROOM_WITH_SANDBOX = {
  id: TEST_ROOM_ID,
  challenge_id: 'rate-limiter-api',
  persona_id: 'alex-chen',
  sandbox_id: TEST_SANDBOX_ID,
  status: 'active',
  settings: { track: 'backend', mode: 'passive', durationMin: 45 },
};

const ROOM_WITHOUT_SANDBOX = {
  ...ROOM_WITH_SANDBOX,
  sandbox_id: null,
};

async function stubGenericArenaGets(page: import('@playwright/test').Page) {
  // Files listing
  await page.route('**/api/arena/files**', async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ files: [] }),
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });
  // Milestones
  await page.route('**/api/arena/milestones**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ milestones: [] }),
    });
  });
  // Git log (POST)
  await page.route('**/api/arena/git-log', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ log: [] }),
    });
  });
  // Interviewer (POST)
  await page.route('**/api/arena/interviewer', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: '', role: 'interviewer' }),
    });
  });
  // Score
  await page.route('**/api/arena/score**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ score: 0 }),
    });
  });
}

test.describe('Arena session page', () => {
  test('hydrates and renders all panels when room + sandbox exist', async ({ page }) => {
    await page.route('**/api/arena/rooms', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ rooms: [ROOM_WITH_SANDBOX] }),
      });
    });
    await stubGenericArenaGets(page);

    await page.goto(`/arena/${TEST_ROOM_ID}`);

    await expect(page.getByTestId('arena-top-bar')).toBeVisible();
    await expect(page.getByTestId('arena-file-tree')).toBeVisible();
    await expect(page.getByTestId('arena-editor')).toBeVisible();
    await expect(page.getByTestId('arena-terminal')).toBeVisible();
    await expect(page.getByTestId('arena-interviewer')).toBeVisible();
    await expect(page.getByTestId('arena-milestones')).toBeVisible();
  });

  test('shows "Session not found" when room is missing', async ({ page }) => {
    await page.route('**/api/arena/rooms', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ rooms: [] }),
      });
    });
    await stubGenericArenaGets(page);

    await page.goto(`/arena/${MISSING_ROOM_ID}`);

    await expect(page.getByText(/session not found/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /back to lobby/i })).toBeVisible();
  });

  test('provisions a sandbox when the room has none', async ({ page }) => {
    let provisionCalled = false;

    await page.route('**/api/arena/rooms', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ rooms: [ROOM_WITHOUT_SANDBOX] }),
      });
    });
    await page.route('**/api/arena/sandbox', async route => {
      if (route.request().method() === 'POST') {
        provisionCalled = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ sandboxId: NEW_SANDBOX_ID }),
        });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }
    });
    await stubGenericArenaGets(page);

    await page.goto(`/arena/${TEST_ROOM_ID}`);

    await expect(page.getByTestId('arena-top-bar')).toBeVisible();
    expect(provisionCalled).toBe(true);
  });
});
