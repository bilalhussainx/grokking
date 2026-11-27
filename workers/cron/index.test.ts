import { describe, expect, it, vi } from 'vitest';
import { JOBS, runJob } from './index';

const env = { APP_URL: 'https://kairoslearn.com', ENABLED: 'true', CRON_SECRET: 's3cret' };

describe('kairoslearn-cron', () => {
  it('maps the three vercel.json schedules to their routes', () => {
    expect(Object.values(JOBS).sort()).toEqual(['/api/cron/agent-nudges', '/api/cron/deadline-reminders', '/api/cron/generate-observations']);
  });
  it('calls the route with the bearer secret', async () => {
    const f = vi.fn(async () => new Response('ok', { status: 200 }));
    expect(await runJob('7 9 * * *', env, f as any)).toBe('/api/cron/deadline-reminders -> 200');
    expect(f).toHaveBeenCalledWith('https://kairoslearn.com/api/cron/deadline-reminders', expect.objectContaining({ headers: expect.objectContaining({ authorization: 'Bearer s3cret' }) }));
  });
  it('does nothing while disabled or without a secret', async () => {
    const f = vi.fn();
    expect(await runJob('7 9 * * *', { ...env, ENABLED: 'false' }, f as any)).toMatch(/^skipped/);
    expect(await runJob('7 9 * * *', { ...env, CRON_SECRET: undefined }, f as any)).toMatch(/^skipped/);
    expect(f).not.toHaveBeenCalled();
  });
});
