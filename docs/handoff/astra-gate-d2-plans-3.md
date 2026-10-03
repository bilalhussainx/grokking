# GATE D2-PLANS-3 — interface review
September 26, 2026. Authority: [latest founder response](astra-gate-d2-plans-2-response.md).

All sixteen targeted amendments are applied to the a1/a2/b written plans and prompts. **Stop here** because the response says: “if one [fix] changes an exported interface ... stop at GATE D2-PLANS-3 and list it.” No production implementation or paid pilot ran.

## Interface changes requiring this checkpoint
- **a1:** injected preflight runner takes `(file: string, args: readonly string[])`, used with `execFile`. New `RunPolicy` and `runAgentWithPolicy(input, deps, policy)`; existing `runAgent` signature and 20s generation / 8s checker runtime defaults stay intact.
- **a2:** exported `TurnQuote`, `Quote` and internal fixture quote; optional fifth quote callback on `DurableStore.admit`; authenticated `Session.quote`; persisted `Operation.quote_credits`, `quote_reserve` and settlement `skipped`. Pro skips reserve/capture/refund. The seven-argument `execute` signature is unchanged.
- **b:** `Outcome.cause` and `attempt`; matrix/timeouts in `Approval` and `Report`; `EvalMatrix`, `EvalTimeouts`, matrix constants/validators, timeout configuration, projection and generation-cost lookup helpers; `runPilot` progress adds matrix/timeouts/resume; metered provider accepts evaluation timeouts. Existing Provider/OutputCheck contracts stay intact.

## Two explicit planning clarifications
1. The reduced default uses **routine only, one checker repetition**. Merely reducing repetitions with all three configurations still exceeded the pessimistic $20 bound. A fresh serialized-payload/rate projection must fit the cap before any approved run. Reduced review load is 448 judgments; the separately approved full matrix remains 696. Reduced results make no baseline-comparison claim. **The $20 pilot remains unapproved.**
2. Saved draft sources use `draft:<essayId>@v<N>`. Current unsaved text has no persisted numeric version in the existing schema, so its source uses `@vcurrent-<contentHash>`, explicitly a content revision token. No invented numeric version or schema change.

English pilot labels that assess Urdu-source translation or Roman Urdu require the reviewer to understand those source languages. A single English reviewer decision does not establish that competence; unreviewed cases cannot pass.

## Evidence and next step
Independent artifact reviews passed a1, a2 and b after repairing a budget-stop classification bug. The virtual TypeScript check extracted 55 proposed modules and returned 0 errors. These are **written-plan checks**, not executed unit tests, SQL tests, model probes or production validation.

[Detailed amendment/evidence record](../evidence/agent/plans-3/verification.md). c–f SHA256 is unchanged: `7105147e5a409196adccb80c24230176696194a04c7c53cb2806cb97ec6eea14`.

After interface greenlight, Claude commits the explicit planning package at execution start and builds a1 → a2 → b. Execution evidence belongs in `docs/evidence/agent/<slice>/`, staged by explicit path. Preserve unrelated dirty work. No staging, commit, migration, deployment or live pricing change occurred here.

