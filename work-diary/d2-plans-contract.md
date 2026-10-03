# D2-PLANS drafting contract

Authoritative amendments: docs/handoff/astra-gate-d2-response.md, docs/handoff/astra-gate-d2-plans-response.md and latest docs/handoff/astra-gate-d2-plans-2-response.md (targeted revisions override earlier details). Documentation only; no probes, execution, production code or dependency installation now. **GATE D2-PLANS-3: awaiting founder greenlight for exported interface changes below.** Written-contract review is distinct from executed verification.

Split a into a1 and a2; b consumes a1/a2. Every plan <=8 tasks, writing-plans header/checkbox steps, concrete code and tests, exact commands/Expected output, explicit-path commits. No placeholders or undefined imports. Production scope is forbidden.

## Shared planned interfaces (not existing code)

New files under src/lib/cc/agent/. a1 owns contracts.ts, provider.ts, read-tools.ts, loop.ts, sse.ts and corresponding unit tests; no public route in a1 or a2. A2 handlers live under src/lib/cc/agent/routes; mounting and production DB transport await a separate activation plan.

```ts
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type AuthScope = Readonly<{ userId: string; profileIds: readonly string[] }>;
export type Candidate = { text: string; cards: Json[] };
export type CheckedResult = Candidate & { policyVersion: string };
export type CheckContext = { locale: string; evidence: Json[]; priorReleased: string[]; signal: AbortSignal };
export type OutputCheck = (candidate: Candidate, context: CheckContext) => Promise<
  { decision: 'allow'; result: CheckedResult } | { decision: 'block' | 'uncertain'; reason: string }
>;
export type AgentInput = { message: string; essayId: string | null; locale: string };
export type ToolName = 'read_context' | 'read_essay' | 'read_published_feedback';
export type ToolReply = { status: 'ok' | 'unknown' | 'denied' | 'retryable_error'; data: Json; evidence: Json[] };
export type ToolCall = { id: string; name: string; arguments: string };
export type ChatMessage = { role: 'system' | 'user' | 'assistant' | 'tool'; content: string | null; tool_call_id?: string; tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[] };
export type ModelReply = { content: string | null; calls: ToolCall[] };
export type Provider = (messages: ChatMessage[], signal: AbortSignal) => Promise<ModelReply>;
export type ReadTools = (name: string, args: unknown) => Promise<ToolReply>;
export type RunDeps = { provider: Provider; tools: ReadTools; check: OutputCheck; signal: AbortSignal; priorReleased: string[] };
// a1 exports:
// runAgent(input: AgentInput, deps: RunDeps): Promise<CheckedResult>
// RunPolicy = {generationMs:number;checkerMs:number;turnMs:number}
// runAgentWithPolicy(input:AgentInput,deps:RunDeps,policy:RunPolicy):Promise<CheckedResult>
// checkLocalDatabaseTooling(execFileCmd?:(file:string,args:readonly string[])=>Promise<{stdout:string;stderr:string}>):Promise<PreflightCheckResult>
// PreflightCheckResult = {ok:boolean;dockerAvailable:boolean;dockerVersion:string|null;stopReason?:string}
// estimateTokens(value:string):number
// summarizePriorReleased(parts:readonly string[]):string[]
// makeReadTools(db: SupabaseClient, scope: AuthScope): ReadTools
// makeProvider(role: 'routine'|'planner'|'check'|'escalation'): Provider
// encodeEvent(seq: number, type: string, data: Json): Uint8Array
// decodeEvents(chunks: AsyncIterable<Uint8Array>): AsyncGenerator<{seq:number;type:string;data:Json}>
// denyAllCheck: OutputCheck (always uncertain); internal test-only checker fixture never production wired.
```

a1 preflight uses `execFile("docker",["info","--format","{{.ServerVersion}}"],{timeout:10000})`; the optional runner changes from a shell-command string to `(file,args)`. Runtime `runAgent` remains 20s generation/8s checker/60s total. The new `RunPolicy`/`runAgentWithPolicy` exports are evaluation-only; all values must be positive finite and no greater than 45s generation/20s checker/240s total. They do not alter the runtime defaults. The SSE decoder skips comment-only heartbeat frames. The bounded probe continues after non-2xx responses, including no-usage errors, inside its pre-admitted four-call total below $0.05; 2xx invalid/missing cost and transport uncertainty still stop.

a2 owns durable schema/store, internal authenticated route adapters and no-charge orchestration. JSON output checked before persistence; replay cannot invoke runAgent. `runAgent` accepts tools already scoped server-side. No actor/profile/tier identifiers from body. Only allowlisted synthetic internal users while AGENT_INTERNAL_NO_CHARGE=1. Every real paid path remains disabled. Item-4 BillingPort exists locally with its production migration unapplied; transport and settlement activation remain separate. No pricing here.

```ts
// Exact a2 additions/unchanged seams; complete implementations live in the a2 plan.
export type TurnQuote = {credits:0;reserve:boolean};
export type Quote = (actor:AuthScope)=>Promise<TurnQuote>;
// internalFixtureQuote:Quote — zero-charge synthetic Free fixture only, reserve:true.
// DurableStore.admit(scope:AuthScope,key:string,input:AgentInput,proof:Proof,quote?:Quote):
//   Promise<{operation:Operation;claimed:boolean}>
// Operation adds quote_credits:0 and quote_reserve:boolean.
// Operation.settlement: 'reserved'|'captured'|'released'|'unsettled'|'skipped'.
// InternalBilling = {mode:'internal-zero';port:BillingPort}; BillingPort has no mode.
// Authorize = (proof:Proof,essayId:string|null)=>Promise<void>;
// Session = {scope:AuthScope;tools:ReadTools;proof:(input:AgentInput)=>Promise<Proof>;authorize:Authorize;quote:Quote};
// execute(store:DurableStore,scope:AuthScope,op:Operation,input:AgentInput,
//   deps:RunDeps & {run?:typeof runAgent},billing:InternalBilling,authorize:Authorize):Promise<void>
// execute retains exactly seven arguments; no RunDeps/CheckContext changes.
```

The authenticated handler always supplies `Session.quote`; it reauthenticates the actor and queries the existing `v_user_tier(user_id,tier)` view using the server actor ID. Query errors, missing tier and guest tier fail closed. Pro returns `{credits:0,reserve:false}`. The optional admission callback defaults only to `internalFixtureQuote` for existing synthetic harness callers. Under the actor admission SQL lock, existing-key/hash lookup precedes new work; only new admission resolves and persists the quote. Persisted `quote_reserve:false` yields `settlement:'skipped'`, including completion, authorization failure, cancellation and expiry, and every path skips reserve/capture/release entirely. The reservation-phase update also rejects skipped quotes. Pro fair-use caps remain applicable before any future activation.

New messages over 2,000 estimated tokens receive 413 before quote/reserve; the handler enforces this before admission/source work and the store guards direct admissions. No 12,000-character message rule remains. A2 alone invokes `summarizePriorReleased`; a1 and b pass the resulting array and truncation marker unchanged. The local writer password is the disposable `LOCAL_TEST_ONLY_NOT_A_SECRET` fixture with a secret-scanner comment, not a credential source or production fallback.

Key shape `epochMilliseconds:uuid`, client-created. New admission rejects keys older than 24h or >60s future; existing operation lookup happens first so completed old retries return receipt/410 without generation. Unique(user_id, operation_key), input hash conflicts409, one active user operation. Rows never reclaimed to rerun generation: crash/deadline becomes failed with released, unsettled or skipped settlement according to persisted reserve phase/quote; a deliberate new attempt needs new key. Tombstones retained while account exists; after deletion old timestamp rejects. No signed tickets or client-facing quote endpoint in a.

Credits interface is injected actor-bound `reserve(operationKey,maxCredits)`, `capture(operationKey,finalCredits)`, `release(operationKey)`. Item4 owns implementation and pricing; src/lib/credit-reservations.ts exports makeCreditBilling(userId) and BillingPort. The port has no mode; a2 wraps its zero-only implementation with mode. For reservation-bearing quotes, release of an unreserved key records a tombstone; never release after a failed or uncertain reserve. Pro invokes no billing method; only synthetic Free calls exercise zero reservations here. Production adapter activation remains unavailable. Future paid capture and result durability must be atomically coordinated with item4; a2 does not claim cross-service atomicity from those signatures.

b owns output-check.ts, revision-judgment.ts and pilot eval scripts/fixtures as planned code inside Markdown. It consumes the above check contract and explicit model envs; fail closed before any text/cards. D1 shared next-revision judgment is required in b; no rewrite prose/score. All production activation remains disabled pending founder language/budget choices and executed pilot eval. English-only pilot is a proposed budget basis, not implicit approval to run or enable it. External capability/price facts unverified; use founder price snapshot as assumptions and fail closed on unknown model capability. A minimal compatibility probe is a future a1 task, total under $0.05, four calls maximum, no retries; one per role, even if slugs repeat. One response cannot prove both multi-round tool use and final JSON: record honestly the dimensions observed and leave unproved capability disabled rather than infer a pass.

Founder reports Docker installed but its engine stopped; founder starts it before execution. Host psql is not required because a2 uses container psql. The first execution task checks Docker and stops if unavailable. No database started during planning.

## Independent pilot budget arithmetic for review

**Historical D2 estimate, superseded for execution:** the latest b plan defaults to routine-only, one checker repetition, 224 outcomes and 448 total human judgments. The full three-configuration/two-repetition matrix remains 696 judgments and requires separate approval. A fresh pinned serialized-payload projection must fit the approved ceiling; reducing repetitions alone did not make all three configurations fit $20. The founder is the sole English pilot reviewer, in sessions of at most one hour; cross-language negative cases still require source-language competence. No pilot budget is approved. Keep the older calculation below only as drafting history, never as an executable spending allowance.

Proposed English-only approval ceiling: **US$20 provider spend**, not authorized to run. Dataset24families tested on three generation configs (routine/planner/baseline), maximum4generationcalls/run=96calls perconfig. Founder snapshot rates $/million: Flash .04/.14, GLM1.4/4.4, Sonnet4.6 3/15. At12k input/1500output each, generation upper estimate96*(.00069+.0234+.0585)=$7.92864. One shared checker GLM at6k input/1500output=$.015 each. At most2checks for each of72scenario runs plus200authorship/control cases:544checks=$8.16. Total nominal token-envelope estimate$16.08864; $20 includes$3.91 headroom. Typical actual tokens lower. This is not a strict reasoning-cost bound. Pessimistic request reservations reconcile actual receipts within the approved ledger ceiling; unknown receipts/pricing stop. Insufficient remaining budget can leave a run incomplete. $20 stays proposed until a1/a2 land and probe results are reviewed. Human review labor excluded. Each additional explicitly enabled language adds another$20; cannot silently add a language or run budget. The compatibility probe has its separate<$0.05 authorization and is not pilot evidence. Full general-rollout suite deferred.

## D2-PLANS-2 shared boundaries

- context-budget.ts exports estimateTokens(string) and summarizePriorReleased(readonly string[]): string[]. Context limits are estimated 12,000 generation/6,000 checker tokens; monetary reservations are separate. Strip server evidence from model tool messages, send checker sources once, and cap extractive prior summaries at 512 estimated tokens with explicit omissions. A2 summarizes exactly once; a1/b preserve it unchanged. The checker candidate allowance is 1,400 estimated tokens for the worst-case Urdu envelope.
- Canonical serialization/hash lives in a2 durable-store.ts as canonical/digest; b imports it.
- Probe rates come from the free models endpoint; runtime maximum age is OPENROUTER_AGENT_PRICING_MAX_AGE_DAYS (default30). Probe reasoning multiplier is separate from runtime allowances. Founder-created .env.agent-probe is the key source, never production .env.local.
- Pilot baseline maps to escalation’s slug/observation. Approval-pinned resumable JSONL preserves case IDs and costs. Configurations pass/fail separately; founder selects a passing one. English pilot accepts one fluent founder reviewer; general rollout requires two. Counts/time estimates are in b.
- Record the source-suite baseline and `npx tsc --noEmit -p .` baseline before agent changes; run both before every commit and reject new/changed failures. Store and explicitly commit execution outputs under `docs/evidence/agent/<slice>/`, not `work-diary/`; a2's ledger is `docs/evidence/agent/a2/execution.md`. Preserve already-dirty shared ledgers/.gitignore rather than staging whole files.
- C–f outlines are accepted unchanged. Claude commits the planning package at execution start after GATE D2-PLANS-3 interface greenlight; no staging or commits in this revision.
