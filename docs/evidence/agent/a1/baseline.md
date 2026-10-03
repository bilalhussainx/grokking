# Agent Slice A1 baseline (recorded 2026-10-03, branch feat/agent-a1-s1)

## Source suite
- Command: `npx vitest run src --config vitest.agent-source.config.ts --reporter=json --outputFile=docs/evidence/agent/a1/source-baseline.json`
- Exit code: 0
- Result: 406 suites, 954 tests, 954 passed, 0 failed, success=true
- Pre-existing failures: none

## TypeScript
- Command: `npx tsc --noEmit -p . > docs/evidence/agent/a1/typescript-baseline.txt`
- Exit code: 0
- Diagnostics: 0 (empty output file)
- Pre-existing diagnostics: none

## Notes
- Run via Git Bash (redirect `>`), not PowerShell `*>`; equivalent output capture.
- No .env.local read; no production fixtures run; `tests/unit` excluded.
- `vitest.setup.ts` exists at repo root under the same name as the plan.
- Comparison rule: any failing test or tsc diagnostic after this point is new and blocks commits.
