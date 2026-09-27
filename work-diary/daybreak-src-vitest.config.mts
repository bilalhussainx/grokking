// Source-only verification. Never loads .env.local or production fixture tests.
import { defineConfig } from 'vitest/config';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
export default defineConfig({
  root,
  test: { environment:'jsdom', include:['src/**/*.test.{ts,tsx}'], exclude:['node_modules','.next'], setupFiles:[path.join(root,'vitest.setup.ts')], testTimeout:30000, maxWorkers:1, pool:'threads' },
  resolve: { alias:{'@':path.join(root,'src'),path:'node:path',fs:'node:fs'} },
});
