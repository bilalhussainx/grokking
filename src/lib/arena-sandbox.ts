// Vercel Sandbox SDK wrapper.
// Docs: https://vercel.com/docs/vercel-sandbox

import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({ bearerToken: process.env.VERCEL_SANDBOX_TOKEN! });

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
  // @ts-expect-error — SDK types may lag behind API
  const sandbox = await vercel.sandbox.create({
    runtime: 'node24',
    timeoutSeconds: 3600,     // 1 hour max, can extend
  });

  const sandboxId: string = sandbox.id;

  if (starterRepo) {
    // Clone starter repo into /workspace
    await execInSandbox(sandboxId,
      `git clone ${starterRepo} /workspace && cd /workspace && npm install 2>&1 | tail -5`
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
}

// Execute a shell command in the sandbox. Returns stdout/stderr/exitCode.
export async function execInSandbox(sandboxId: string, command: string): Promise<ExecResult> {
  // @ts-expect-error — SDK types
  const result = await vercel.sandbox.exec(sandboxId, { command, cwd: '/workspace' });
  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    exitCode: result.exitCode ?? 0,
  };
}

// List files recursively in /workspace (returns relative paths)
export async function listFiles(sandboxId: string): Promise<SandboxFile[]> {
  const result = await execInSandbox(sandboxId,
    'find /workspace -not -path "*/node_modules/*" -not -path "*/.git/*" | sed "s|/workspace/||"'
  );
  return result.stdout
    .split('\n')
    .filter(Boolean)
    .filter(p => p !== '.')
    .map(path => ({ path, type: path.endsWith('/') ? 'directory' : 'file' as const }));
}

// Read file content
export async function readFile(sandboxId: string, path: string): Promise<string> {
  const result = await execInSandbox(sandboxId, `cat /workspace/${path}`);
  if (result.exitCode !== 0) throw new Error(`File not found: ${path}`);
  return result.stdout;
}

// Write file content
export async function writeFile(sandboxId: string, path: string, content: string): Promise<void> {
  // Use base64 to avoid shell escaping issues
  const encoded = Buffer.from(content).toString('base64');
  await execInSandbox(sandboxId,
    `mkdir -p /workspace/$(dirname ${path}) && echo "${encoded}" | base64 -d > /workspace/${path}`
  );
}

// Get git log for scoring
export async function getGitLog(sandboxId: string): Promise<string> {
  const result = await execInSandbox(sandboxId,
    'cd /workspace && git log --format="%H|%at|%s" --shortstat 2>/dev/null'
  );
  return result.stdout;
}

// Auto-commit all changes
export async function autoCommit(sandboxId: string, message?: string): Promise<void> {
  const msg = message ?? `auto: ${new Date().toISOString()}`;
  await execInSandbox(sandboxId,
    `cd /workspace && git add -A && git diff --cached --quiet || git commit -m "${msg}"`
  );
}

// Teardown
export async function teardownSandbox(sandboxId: string): Promise<void> {
  // @ts-expect-error — SDK types
  await vercel.sandbox.delete(sandboxId);
}

// ─── DATA SCIENCE SANDBOX ──────────────────────────────────────────────────

// Provision a Python 3.13 sandbox for DS/ML challenges.
// Pre-installs Jupyter, numpy, pandas, sklearn, torch, and starts a Jupyter kernel gateway.
// Returns { sandboxId, kernelGatewayUrl } — the URL is a WebSocket the browser uses via @jupyterlab/services.
export async function provisionDataScienceSandbox(starterNotebookUrl?: string): Promise<{
  sandboxId: string;
  kernelGatewayUrl: string;
}> {
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
}
