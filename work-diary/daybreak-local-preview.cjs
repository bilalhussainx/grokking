// Local validation only. The shared node_modules junction needs a common
// Turbopack filesystem root; production next.config.ts remains unchanged.
// No environment file is copied. Run only from this isolated worktree.
const path = require('node:path');
const http = require('node:http');
const next = require('next');
const loadConfig = require('next/dist/server/config').default;
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

(async () => {
  const dir = path.resolve(__dirname, '..');
  if (path.basename(dir) !== 'grokking-daybreak') throw new Error('Wrong preview worktree');
  process.chdir(dir);
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54321';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'local-design-preview-not-a-secret';
  const conf = await loadConfig(PHASE_DEVELOPMENT_SERVER, dir);
  conf.turbopack = { ...conf.turbopack, root: path.dirname(dir) };
  conf.devIndicators = false;
  const app = next({ dev: true, turbopack: true, dir, conf, hostname: '127.0.0.1', port: 4180 });
  await app.prepare();
  const server = http.createServer(app.getRequestHandler());
  server.on('upgrade', app.getUpgradeHandler());
  server.listen(4180, '127.0.0.1', () => console.log('Daybreak local preview: http://127.0.0.1:4180'));
  async function stop() { server.close(); await app.close(); process.exit(0); }
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
})().catch(error => { console.error(error); process.exitCode = 1; });
