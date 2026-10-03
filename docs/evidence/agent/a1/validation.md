# Agent Slice A1 validation log

## Task 1 baseline (2026-10-03)
- Docker preflight: `docker info --format '{{.ServerVersion}}'` -> 29.1.3 (reachable)
- Source suite baseline: exit 0, 954/954 passed (see baseline.md, source-baseline.json)
- tsc baseline: exit 0, 0 diagnostics (see typescript-baseline.txt)

## Task 2: Agent Contracts (2026-10-03)

### RED (failing test)
Command: `npx vitest run --config vitest.agent-a1.config.ts src/lib/cc/agent/__tests__/contracts.test.ts`
Expected: FAIL with "Cannot find module '../contracts'"
(Not captured; test file created, module did not exist)

### GREEN (passing test)
Command: `npx vitest run --config vitest.agent-a1.config.ts src/lib/cc/agent/__tests__/contracts.test.ts`
Result: PASS
```
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  03:17:02
   Duration  1.12s
```

### Implementation
Created:
- `src/lib/cc/agent/contracts.ts` — 8 type exports + denyAllCheck function (test-only stub)
- `src/lib/cc/agent/__tests__/contracts.test.ts` — 1 test verifying denyAllCheck returns uncertain decision

### Gate results (post-implementation)
Source suite: `npx vitest run src --config vitest.agent-source.config.ts`
```
 Test Files  142 passed (142)
      Tests  957 passed (957)
   Duration  131.04s
```
(956 tests in baseline + 1 new test = 957 total)

TypeScript: `npx tsc --noEmit -p .`
```
exit 0, 0 diagnostics (no new failures)
```

## Task 3: server-scoped read tools

### RED
`npx vitest run --config vitest.agent-a1.config.ts src/lib/cc/agent/__tests__/read-tools.test.ts`
```
 FAIL  src/lib/cc/agent/__tests__/read-tools.test.ts
Error: Cannot find module '../read-tools' imported from .../read-tools.test.ts
 Test Files  1 failed (1)
      Tests  no tests
```

### GREEN
```
 Test Files  1 passed (1)
      Tests  5 passed (5)
```

### Gate
- `npx vitest run src --config vitest.agent-source.config.ts`: 143 files / 962 tests passed (957 baseline + 5 new)
- `npx tsc --noEmit -p .`: 0 diagnostics

### Schema verification
All selected columns exist in `supabase/migrations` for cc_student_profiles, cc_academic_profiles, cc_financial_profiles, cc_essays. `cc_essay_drafts` and `cc_counselor_comments` have no CREATE TABLE in the repo migrations (created out of band); their columns are corroborated by live route code (drafts routes, counselor-comments.ts).

## Task 4: provider adapter + context-budget

### RED
`npx vitest run --config vitest.agent-a1.config.ts src/lib/cc/agent/__tests__/provider.test.ts`
```
 FAIL  src/lib/cc/agent/__tests__/provider.test.ts
 Error: Failed to resolve import "../provider" from "src/lib/cc/agent/__tests__/provider.test.ts". Does the file exist?
 Test Files  1 failed (1)
      Tests  no tests
```

### GREEN
```
 Test Files  1 passed (1)
      Tests  14 passed (14)
```

### Gate
- `npx vitest run --config vitest.agent-a1.config.ts`: 4 files / 22 tests passed
- `npx vitest run src --config vitest.agent-source.config.ts`: 144 files / 976 tests passed (962 + 14 new)
- `npx tsc --noEmit -p .`: 0 diagnostics

## Task 5: probe module and script (offline only)

### RED
```
 FAIL  src/lib/cc/agent/__tests__/probe.test.ts
Error: Cannot find module '../probe' imported from .../probe.test.ts
 Test Files  1 failed (1)
      Tests  no tests
```

### GREEN
```
 Test Files  1 passed (1)
      Tests  11 passed (11)
```

### Script refusal with empty env (no live call, no fence written)
`env -i PATH=... npx tsx scripts/agent-compatibility-probe.ts` -> exit 1, stderr "Probe stopped; inspect the safe report/run fence. No automatic retry is authorized."; `probe-admitted.json` not created.

### Gate
- `npx vitest run src --config vitest.agent-source.config.ts`: 145 files / 988 tests passed
- `npx tsc --noEmit -p .`: 0 diagnostics

### Live probe
Founder step, not run. `.env.agent-probe` not created; `.env.local` not read. No probe-admitted.json / compatibility.json exist.

## Task 6: bounded loop with full-output holdback
### RED
```
npx vitest run --config vitest.agent-a1.config.ts src/lib/cc/agent/__tests__/loop.test.ts
Error: Cannot find module '../loop'
 Test Files  1 failed (1)
      Tests  no tests
```

### GREEN
```
 Test Files  1 passed (1)
      Tests  14 passed (14)
```

### Gate
- `npx vitest run src --config vitest.agent-source.config.ts`: 146 files / 1002 tests passed
- `npx tsc --noEmit -p .`: 0 diagnostics

### Task 6 fix round 1 (release only checked candidate)
RED: 5 failed | 14 passed. GREEN: 19 passed. Gate: 146 files / 1007 tests; tsc 0 diagnostics.

## Task 7 (SSE encoder / fragment-resilient parser)
### RED
```
npx vitest run --config vitest.agent-a1.config.ts src/lib/cc/agent/__tests__/sse.test.ts
Error: Failed to resolve import "../sse"
 Test Files  1 failed (1)
      Tests  no tests
```

### GREEN
```
 Test Files  1 passed (1)
      Tests  5 passed (5)
```

### Gate
- `npx vitest run src --config vitest.agent-source.config.ts`: 147 files / 1012 tests passed
- `npx tsc --noEmit -p .`: 0 diagnostics

## Task 8: integration-a1.test.ts

### RED (mutation: sse.ts decoder `{stream:true}` -> `{stream:false}`, then restored)
```
npx vitest run --config vitest.agent-a1.config.ts src/lib/cc/agent/__tests__/integration-a1.test.ts
TypeError: The encoded data was not valid for encoding utf-8  (sse.ts decodeEvents)
 Test Files  1 failed (1)
      Tests  2 failed | 3 passed (5)
```
(Modules already existed, so RED is by mutation of the decoder; the split-point tests catch it.)

### GREEN
```
npx vitest run --config vitest.agent-a1.config.ts src/lib/cc/agent/__tests__
 Test Files  8 passed (8)
      Tests  63 passed (63)
```

### Gate
- `npx vitest run src --config vitest.agent-source.config.ts`: 148 files / 1017 tests passed
- `npx tsc --noEmit -p .`: 0 diagnostics

## Final-review fix wave (I1, I2, M1-M5), 2026-10-03

All RED commands are `npx vitest run --config vitest.agent-a1.config.ts <file>`. All GREEN runs are the full A1 suite.

### I1 error normalization (fa3a1a17)
RED (loop.test.ts + provider.test.ts): `Tests 14 failed | 32 passed (46)`. Received messages carried input bytes:
```
Received: "Unexpected token 'D', "[Draft] I w"... is not valid JSON"
Received: "Unexpected token '<', "<html>upst"... is not valid JSON"
Received: "Unexpected token 'S', ...""fixture":SECRETPRIC"... is not valid JSON"
Received: "Unterminated string in JSON at position 26 (line 1 column 27)"
Received: "OPENROUTER_API_KEY missing" / "approvals.find is not a function" / "checker saw Lahore"
```
GREEN: `Test Files 8 passed (8) / Tests 75 passed (75)`

### I2 tool cancellation (617925d5)
RED (loop.test.ts + read-tools.test.ts): `Tests 4 failed | 31 passed (35)`
```
AssertionError: expected undefined to be an instance of AbortSignal
AssertionError: promise resolved "{ status: 'ok', data: { …(3) }, …(1) }" instead of rejecting
AssertionError: expected 0 to be greater than 0
```
GREEN: `Tests 79 passed (79)`

### M1 checker receives a clone (f08520b3)
RED: `AssertionError: promise resolved "{ text: 'checker-authored prose', …(2) }" instead of rejecting`
GREEN: `Tests 80 passed (80)`

### M2 future verifiedAt, plus the upperCost comment (b2354626)
RED: `× rejects a verifiedAt beyond five minutes of clock skew in the future` / `expected [Function] to throw an error`
GREEN: `Tests 81 passed (81)`

### M3 null or blank probe prices (50cdfacc)
RED (probe.test.ts): `Tests 5 failed | 14 passed (19)`. Each null or blank price case gave `promise resolved "{ OPENROUTER_API_KEY: 'test', …(5) }" instead of rejecting`.
The new probe_key_missing, cost_bound_anomaly and transport-throw tests passed at RED; they pin behavior that was already correct but untested.
GREEN: `Tests 89 passed (89)`

### M4 server log and M5 no author_user_id (c2268857)
RED (read-tools.test.ts): `Tests 6 failed | 7 passed (13)`
```
AssertionError: expected '{"status":"ok","data":{"comments":[{"…' not to contain 'c0c0c0c0'
AssertionError: expected [] to deeply equal [ [ 'agent_read_tool_failed', …(1) ] ]   (x5)
```
GREEN: `Test Files 8 passed (8) / Tests 94 passed (94)`

### Gate (after every commit; final numbers)
- `npx vitest run src --config vitest.agent-source.config.ts`: 148 files / 1048 tests passed, 0 failed
- `npx tsc --noEmit -p .`: exit 0, 0 diagnostics
