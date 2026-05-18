// scripts/e2e-watch.mjs
// Re-runs the counselor E2E suite whenever src/, tests/e2e/counselor/, or
// migrations change. Logged-in storage state is reused across runs (cheap).
// Usage: npm run e2e:counselor:watch
import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { join } from 'node:path';

const WATCH_PATHS = ['src', 'tests/e2e/counselor', 'tests/e2e/helpers', 'supabase/migrations'];
const DEBOUNCE_MS = 500;
let pending = null;
let running = null;

function runSuite() {
  if (running) return;
  console.log(`\n[${new Date().toLocaleTimeString()}] running counselor suite…`);
  running = spawn('npx', ['playwright', 'test', '--project=counselor', '--reporter=line'], {
    stdio: 'inherit',
    shell: true,
  });
  running.on('exit', code => {
    console.log(`[${new Date().toLocaleTimeString()}] suite exit=${code}\n`);
    running = null;
    if (pending) { pending = null; runSuite(); }
  });
}

for (const p of WATCH_PATHS) {
  watch(join(process.cwd(), p), { recursive: true }, (_event, file) => {
    if (!file || file.includes('test-results') || file.startsWith('.')) return;
    if (pending) clearTimeout(pending);
    pending = setTimeout(() => { pending = null; runSuite(); }, DEBOUNCE_MS);
  });
}

console.log(`watching ${WATCH_PATHS.join(', ')} — running suite on change`);
runSuite();
