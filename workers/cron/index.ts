// Runs KairosLearn's scheduled jobs on Cloudflare (they were Vercel crons in vercel.json).
// Each trigger calls the app's own cron route with the CRON_SECRET bearer, exactly as Vercel did.
// ENABLED stays "false" until kairoslearn.com points at the Cloudflare app, so jobs never run twice
// or from a test address.
interface Env {
  APP_URL: string;
  ENABLED: string;
  CRON_SECRET?: string;
}

export const JOBS: Record<string, string> = {
  '7 9 * * *': '/api/cron/deadline-reminders',
  '7 4 * * *': '/api/cron/generate-observations',
  '17 13 * * *': '/api/cron/agent-nudges',
};

export async function runJob(cron: string, env: Env, fetcher: typeof fetch = fetch): Promise<string> {
  const path = JOBS[cron];
  if (!path) return `no job for "${cron}"`;
  if (env.ENABLED !== 'true') return `skipped ${path}: ENABLED is not "true"`;
  if (!env.CRON_SECRET) return `skipped ${path}: CRON_SECRET is not set`;
  const res = await fetcher(new URL(path, env.APP_URL).toString(), {
    headers: { authorization: `Bearer ${env.CRON_SECRET}`, 'user-agent': 'kairoslearn-cron' },
  });
  return `${path} -> ${res.status}`;
}

export default {
  async scheduled(event: { cron: string }, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }) {
    ctx.waitUntil(runJob(event.cron, env).then((r) => console.log(r)));
  },
};
