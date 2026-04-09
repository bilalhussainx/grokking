/**
 * Arena IDE — Full happy-path smoke test (Phase 1, Task 10)
 *
 * Hermetic: lobby → form submit → session page renders all panels.
 * All `/api/arena/**` traffic is mocked via page.route().
 *
 * See arena-lobby.spec.ts for the auth handling note.
 */
import { test, expect, type Route } from '@playwright/test';

const TEST_ROOM_ID = 'smoke-room-1';
const TEST_SANDBOX_ID = 'smoke-sandbox-1';

const ROOM_ROW = {
  id: TEST_ROOM_ID,
  challenge_id: 'rate-limiter-api',
  persona_id: 'alex-chen',
  sandbox_id: TEST_SANDBOX_ID,
  status: 'active',
  settings: { track: 'backend', mode: 'passive', durationMin: 45 },
};

test('arena happy path: lobby form submit lands on rendered session', async ({ page }) => {
  // Rooms GET (session page) returns the room that was just created.
  // Rooms POST (lobby) creates it.
  await page.route('**/api/arena/rooms', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ROOM_ROW),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ rooms: [ROOM_ROW] }),
      });
    }
  });

  await page.route('**/api/arena/sandbox', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ sandboxId: TEST_SANDBOX_ID }),
    });
  });

  // Stub remaining GETs / POSTs invoked by session panels.
  for (const pattern of [
    '**/api/arena/files**',
    '**/api/arena/milestones**',
    '**/api/arena/git-log',
    '**/api/arena/interviewer',
    '**/api/arena/score**',
  ]) {
    await page.route(pattern, async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });
  }

  // 1) Lobby
  await page.goto('/arena');
  await expect(page.getByTestId('arena-lobby-form')).toBeVisible();

  // 2) Submit
  await page.getByRole('button', { name: /start interview/i }).click();

  // 3) Session page
  await page.waitForURL(new RegExp(`/arena/${TEST_ROOM_ID}`), { timeout: 10_000 });
  await expect(page.getByTestId('arena-top-bar')).toBeVisible();
  await expect(page.getByTestId('arena-file-tree')).toBeVisible();
  await expect(page.getByTestId('arena-editor')).toBeVisible();
  await expect(page.getByTestId('arena-terminal')).toBeVisible();
  await expect(page.getByTestId('arena-interviewer')).toBeVisible();
  await expect(page.getByTestId('arena-milestones')).toBeVisible();
});
