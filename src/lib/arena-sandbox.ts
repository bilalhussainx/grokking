// Vercel Sandbox SDK wrapper.
// Docs: https://vercel.com/docs/vercel-sandbox

import path from 'node:path';
import { Vercel } from '@vercel/sdk';

if (!process.env.VERCEL_SANDBOX_TOKEN) {
  throw new Error(
    'VERCEL_SANDBOX_TOKEN is required for arena-sandbox. Set it in .env.local or Vercel dashboard.'
  );
}

const vercel = new Vercel({ bearerToken: process.env.VERCEL_SANDBOX_TOKEN });

const WORKSPACE_ROOT = '/workspace';

/** Reject paths that escape /workspace or contain shell metacharacters. */
function assertSafePath(rawPath: string): string {
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

// Provision a new sandbox. Returns the sandboxId.
export async function provisionSandbox(starterRepo?: string): Promise<string> {
  try {
    // @ts-expect-error — SDK types may lag behind API
    const sandbox = await vercel.sandbox.create({
      runtime: 'node24',
      timeoutSeconds: 3600,     // 1 hour max, can extend
    });

    const sandboxId: string = sandbox.id;

    if (starterRepo) {
      const safeUrl = assertSafeRepoUrl(starterRepo);
      // Clone starter repo into /workspace
      await execInSandbox(sandboxId,
        `git clone '${safeUrl}' /workspace && cd /workspace && npm install 2>&1 | tail -5`
      );
    } else {
      await execInSandbox(sandboxId,
        'mkdir -p /workspace && cd /workspace && npm init -y && git init && git add -A && git commit -m "init: scaffold"'
      );
    }

    // Install claude CLI for hybrid mode
    await execInSandbox(sandboxId,
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
    // @ts-expect-error — SDK types
    const result = await vercel.sandbox.exec(sandboxId, { command, cwd: '/workspace' });
    return {
      stdout: result.stdout ?? '',
      stderr: result.stderr ?? '',
      exitCode: result.exitCode ?? 0,
    };
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
    const result = await execInSandbox(sandboxId, `cat '${safePath}'`);
    if (result.exitCode !== 0) throw new Error(`File not found: ${filePath}`);
    return result.stdout;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`readFile failed [sandbox=${sandboxId}, path=${filePath}]: ${msg}`);
  }
}

// Write file content
export async function writeFile(sandboxId: string, filePath: string, content: string): Promise<void> {
  try {
    const safePath = assertSafePath(filePath);
    // Use base64 to avoid shell escaping issues.
    // Single-quote the base64 string: base64 alphabet never contains ', so this is safe.
    const encoded = Buffer.from(content).toString('base64');
    const cmd = `mkdir -p "$(dirname '${safePath}')" && echo '${encoded}' | base64 -d > '${safePath}'`;
    await execInSandbox(sandboxId, cmd);
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
  try {
    const msg = message ?? `auto: ${new Date().toISOString()}`;
    await execInSandbox(sandboxId,
      `cd /workspace && git add -A && git diff --cached --quiet || git commit -m "${msg}"`
    );
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    throw new Error(`autoCommit failed [sandbox=${sandboxId}]: ${errMsg}`);
  }
}

// Teardown — idempotent: 404/not-found errors are swallowed.
export async function teardownSandbox(sandboxId: string): Promise<void> {
  try {
    // @ts-expect-error — SDK types
    await vercel.sandbox.delete({ sandboxId });
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
    // @ts-expect-error — SDK types may lag behind API
    const sandbox = await vercel.sandbox.create({
      runtime: 'python3.13',
      timeoutSeconds: 5400,  // 90 minutes max for DS sessions
    });

    const sandboxId: string = sandbox.id;

    // Install DS stack + jupyter_kernel_gateway
    await execInSandbox(sandboxId,
      'pip install --quiet jupyter_kernel_gateway numpy pandas scikit-learn torch matplotlib seaborn 2>&1 | tail -5'
    );

    // Start Jupyter kernel gateway on port 8888 in background
    await execInSandbox(sandboxId,
      'nohup jupyter kernelgateway --ip=0.0.0.0 --port=8888 --KernelGatewayApp.allow_origin="*" > /tmp/jkg.log 2>&1 &'
    );

    // Clone or create starter notebook
    if (starterNotebookUrl) {
      await execInSandbox(sandboxId, `wget -O /workspace/challenge.ipynb "${starterNotebookUrl}"`);
    } else {
      await execInSandbox(sandboxId, `mkdir -p /workspace && cat > /workspace/challenge.ipynb << 'NBEOF'
{
 "cells": [
  {"cell_type":"markdown","metadata":{},"source":["# Challenge\\n","Read the brief above. Use the cells below to work."]},
  {"cell_type":"code","metadata":{},"source":["import numpy as np\\nimport pandas as pd\\nprint('Ready!')"],"outputs":[],"execution_count":null}
 ],
 "metadata": {"kernelspec":{"display_name":"Python 3","language":"python","name":"python3"},"language_info":{"name":"python","version":"3.13.0"}},
 "nbformat":4,"nbformat_minor":5
}
NBEOF`);
    }

    // Resolve the public WebSocket URL for the kernel gateway.
    // Vercel Sandbox exposes ports via its API — poll until port 8888 is ready.
    // @ts-expect-error — SDK types
    const portInfo = await vercel.sandbox.getPort(sandboxId, 8888);
    const kernelGatewayUrl = portInfo?.url ?? `ws://sandbox-${sandboxId}.vercel-sandbox.com:8888`;

    return { sandboxId, kernelGatewayUrl };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`provisionDataScienceSandbox failed: ${msg}`);
  }
}
