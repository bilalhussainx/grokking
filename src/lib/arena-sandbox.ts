// Vercel Sandbox SDK wrapper.
// Docs: https://vercel.com/docs/vercel-sandbox/sdk-reference
//
// NOTE: The correct package is `@vercel/sandbox` (not `@vercel/sdk`, which is
// Vercel's platform management SDK for deployments/teams/projects and has no
// sandbox namespace). Task 3 originally imported the wrong package, causing a
// runtime crash: "Cannot read properties of undefined (reading 'create')".
//
// Auth: The SDK reads `VERCEL_OIDC_TOKEN` automatically (populated by
// `vercel env pull` during local dev and injected in Vercel production). As a
// fallback we support `VERCEL_SANDBOX_TOKEN` — the env var name this codebase
// has historically used — and forward it to the SDK as an access token. If
// neither is set and we're in local dev, creation will fail at runtime with a
// clear SDK error.

import path from 'node:path';
import { Sandbox } from '@vercel/sandbox';

const WORKSPACE_ROOT = '/workspace';

/** Build sandbox create options, forwarding VERCEL_SANDBOX_TOKEN as token if set. */
function buildCreateOptions<T extends Record<string, unknown>>(base: T): T & { token?: string; teamId?: string; projectId?: string } {
  const opts: Record<string, unknown> = { ...base };
  // Prefer explicit token env var; OIDC token is picked up automatically by the SDK.
  const token = process.env.VERCEL_SANDBOX_TOKEN || process.env.VERCEL_TOKEN;
  if (token) {
    opts.token = token;
    // Access-token auth requires team/project IDs.
    if (process.env.VERCEL_TEAM_ID) opts.teamId = process.env.VERCEL_TEAM_ID;
    if (process.env.VERCEL_PROJECT_ID) opts.projectId = process.env.VERCEL_PROJECT_ID;
  }
  return opts as T & { token?: string; teamId?: string; projectId?: string };
}

/** Reject paths that escape /workspace or contain shell metacharacters. */
export function assertSafePath(rawPath: string): string {
  if (typeof rawPath !== 'string' || rawPath.length === 0) {
    throw new Error('Invalid file path: empty');
  }
  // Disallow any shell metacharacter that could break out of quoting.
  if (/[\n\r\0"'`$;&|<>\\]/.test(rawPath)) {
    throw new Error(`Invalid file path: contains forbidden characters`);
  }
  // Normalize relative to workspace root, then verify it stays inside.
  const normalized = path.posix.normalize(path.posix.join(WORKSPACE_ROOT, rawPath));
  if (!normalized.startsWith(WORKSPACE_ROOT + '/') && normalized !== WORKSPACE_ROOT) {
    throw new Error(`Path traversal detected: ${rawPath}`);
  }
  return normalized;
}

/** Validate a git repo URL — only https:// GitHub/GitLab/Bitbucket allowed. */
function assertSafeRepoUrl(url: string): string {
  if (typeof url !== 'string' || url.length === 0) {
    throw new Error('starterRepo URL is empty');
  }
  // Allow https:// GitHub/GitLab/Bitbucket repos only. No shell metacharacters.
  if (!/^https:\/\/(github\.com|gitlab\.com|bitbucket\.org)\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+(\.git)?$/.test(url)) {
    throw new Error(`Invalid starterRepo URL (must be https://github.com|gitlab.com|bitbucket.org/<owner>/<repo>): ${url}`);
  }
  return url;
}

export interface SandboxFile {
  path: string;
  type: 'file' | 'directory';
  size?: number;
}

export interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/** Run a raw shell command inside the sandbox via `sh -c`. Returns captured output. */
async function runShell(sandbox: Sandbox, command: string, cwd: string = WORKSPACE_ROOT): Promise<ExecResult> {
  const result = await sandbox.runCommand({
    cmd: 'sh',
    args: ['-c', command],
    cwd,
  });
  const [stdout, stderr] = await Promise.all([result.stdout(), result.stderr()]);
  return {
    stdout: stdout ?? '',
    stderr: stderr ?? '',
    exitCode: result.exitCode,
  };
}

// Provision a new sandbox. Returns the sandboxId.
export async function provisionSandbox(starterRepo?: string): Promise<string> {
  try {
    const sandbox = await Sandbox.create(buildCreateOptions({
      runtime: 'node24' as const,
      timeout: 60 * 60 * 1000,     // 1 hour in ms
    }));

    const sandboxId = sandbox.sandboxId;

    // Ensure /workspace exists (Sandbox default cwd is /vercel/sandbox).
    await runShell(sandbox, 'mkdir -p /workspace', '/');

    if (starterRepo) {
      const safeUrl = assertSafeRepoUrl(starterRepo);
      // Clone starter repo into /workspace
      await runShell(sandbox,
        `git clone '${safeUrl}' /workspace && cd /workspace && npm install 2>&1 | tail -5`
      );
    } else {
      await runShell(sandbox,
        'cd /workspace && npm init -y && git init && git add -A && git commit -m "init: scaffold"'
      );
    }

    // Install claude CLI for hybrid mode
    await runShell(sandbox,
      'npm install -g @anthropic-ai/claude-code 2>&1 | tail -3'
    );

    return sandboxId;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`provisionSandbox failed: ${msg}`);
  }
}

// Execute a shell command in the sandbox. Returns stdout/stderr/exitCode.
export async function execInSandbox(sandboxId: string, command: string): Promise<ExecResult> {
  try {
    const sandbox = await Sandbox.get(buildCreateOptions({ sandboxId }));
    return await runShell(sandbox, command);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`execInSandbox failed [sandbox=${sandboxId}]: ${msg}`);
  }
}

// List files recursively in /workspace (returns relative paths)
export async function listFiles(sandboxId: string): Promise<SandboxFile[]> {
  try {
    const result = await execInSandbox(sandboxId,
      'find /workspace -not -path "*/node_modules/*" -not -path "*/.git/*" | sed "s|/workspace/||"'
    );
    return result.stdout
      .split('\n')
      .filter(Boolean)
      .filter(p => p !== '.')
      .map(p => ({ path: p, type: p.endsWith('/') ? 'directory' : 'file' as const }));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`listFiles failed [sandbox=${sandboxId}]: ${msg}`);
  }
}

// Read file content
export async function readFile(sandboxId: string, filePath: string): Promise<string> {
  try {
    const safePath = assertSafePath(filePath);
    const sandbox = await Sandbox.get(buildCreateOptions({ sandboxId }));
    const buffer = await sandbox.readFileToBuffer({ path: safePath });
    if (buffer === null) {
      throw new Error(`File not found: ${filePath}`);
    }
    return buffer.toString('utf-8');
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`readFile failed [sandbox=${sandboxId}, path=${filePath}]: ${msg}`);
  }
}

// Write file content
export async function writeFile(sandboxId: string, filePath: string, content: string): Promise<void> {
  try {
    const safePath = assertSafePath(filePath);
    const sandbox = await Sandbox.get(buildCreateOptions({ sandboxId }));
    // Ensure parent directory exists first — mkDir is a no-op if it already does.
    const parentDir = path.posix.dirname(safePath);
    if (parentDir && parentDir !== '/' && parentDir !== WORKSPACE_ROOT) {
      await sandbox.mkDir(parentDir);
    }
    await sandbox.writeFiles([{ path: safePath, content: Buffer.from(content, 'utf-8') }]);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`writeFile failed [sandbox=${sandboxId}, path=${filePath}]: ${msg}`);
  }
}

// Get git log for scoring
export async function getGitLog(sandboxId: string): Promise<string> {
  try {
    const result = await execInSandbox(sandboxId,
      'cd /workspace && git log --max-count=100 --format="%H|%at|%s" --shortstat 2>/dev/null'
    );
    return result.stdout;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`getGitLog failed [sandbox=${sandboxId}]: ${msg}`);
  }
}

// Auto-commit all changes
export async function autoCommit(sandboxId: string, message?: string): Promise<void> {
  if (message !== undefined && message.length > 1000) {
    throw new Error('autoCommit message must be ≤1000 characters');
  }
  try {
    const msg = message ?? `auto: ${new Date().toISOString()}`;
    const safeMsg = msg.replace(/'/g, "'\\''");
    await execInSandbox(sandboxId,
      `cd /workspace && git add -A && git diff --cached --quiet || git commit -m '${safeMsg}'`
    );
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    throw new Error(`autoCommit failed [sandbox=${sandboxId}]: ${errMsg}`);
  }
}

// Teardown — idempotent: 404/not-found errors are swallowed.
export async function teardownSandbox(sandboxId: string): Promise<void> {
  try {
    const sandbox = await Sandbox.get(buildCreateOptions({ sandboxId }));
    await sandbox.stop();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    // Idempotent: ignore not-found errors.
    if (/not.?found|404/i.test(msg)) return;
    throw new Error(`teardownSandbox failed [sandbox=${sandboxId}]: ${msg}`);
  }
}

// ─── DATA SCIENCE SANDBOX ──────────────────────────────────────────────────

// Provision a Python 3.13 sandbox for DS/ML challenges.
// Pre-installs Jupyter, numpy, pandas, sklearn, torch, and starts a Jupyter kernel gateway.
// Returns { sandboxId, kernelGatewayUrl } — the URL is a WebSocket the browser uses via @jupyterlab/services.
export async function provisionDataScienceSandbox(starterNotebookUrl?: string): Promise<{
  sandboxId: string;
  kernelGatewayUrl: string;
}> {
  try {
    // Expose port 8888 at creation time so sandbox.domain(8888) can resolve a public URL.
    const sandbox = await Sandbox.create(buildCreateOptions({
      runtime: 'python3.13' as const,
      timeout: 90 * 60 * 1000,  // 90 minutes in ms
      ports: [8888],
    }));

    const sandboxId = sandbox.sandboxId;

    // Ensure /workspace exists.
    await runShell(sandbox, 'mkdir -p /workspace', '/');

    // Install DS stack + jupyter_kernel_gateway
    await runShell(sandbox,
      'pip install --quiet jupyter_kernel_gateway numpy pandas scikit-learn torch matplotlib seaborn 2>&1 | tail -5'
    );

    // Start Jupyter kernel gateway on port 8888 (detached so it keeps running).
    await sandbox.runCommand({
      cmd: 'sh',
      args: ['-c', 'nohup jupyter kernelgateway --ip=0.0.0.0 --port=8888 --KernelGatewayApp.allow_origin="*" > /tmp/jkg.log 2>&1 &'],
      cwd: WORKSPACE_ROOT,
      detached: true,
    });

    // Clone or create starter notebook
    if (starterNotebookUrl) {
      await runShell(sandbox, `wget -O /workspace/challenge.ipynb "${starterNotebookUrl}"`);
    } else {
      const starterNotebook = JSON.stringify({
        cells: [
          { cell_type: 'markdown', metadata: {}, source: ['# Challenge\n', 'Read the brief above. Use the cells below to work.'] },
          { cell_type: 'code', metadata: {}, source: ["import numpy as np\nimport pandas as pd\nprint('Ready!')"], outputs: [], execution_count: null },
        ],
        metadata: {
          kernelspec: { display_name: 'Python 3', language: 'python', name: 'python3' },
          language_info: { name: 'python', version: '3.13.0' },
        },
        nbformat: 4,
        nbformat_minor: 5,
      });
      await sandbox.writeFiles([
        { path: '/workspace/challenge.ipynb', content: Buffer.from(starterNotebook, 'utf-8') },
      ]);
    }

    // Resolve the public URL for the kernel gateway port. `sandbox.domain()`
    // returns an https:// URL; Jupyter kernel gateway clients want wss:// for
    // the WebSocket endpoint, so we rewrite the scheme.
    const httpUrl = sandbox.domain(8888);
    const kernelGatewayUrl = httpUrl.replace(/^https:\/\//, 'wss://').replace(/^http:\/\//, 'ws://');

    return { sandboxId, kernelGatewayUrl };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`provisionDataScienceSandbox failed: ${msg}`);
  }
}
