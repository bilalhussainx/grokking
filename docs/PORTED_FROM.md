# Code Mining: What we're porting from sibling repos

**Branch:** `feat/counselor-marketplace`
**Companion to:** `docs/COUNSELOR_MARKETPLACE.md` (the phasing) and `docs/ARCHITECTURE.md` (the runtime topology).

This doc names the **specific files** to copy or imitate from each sibling repo, the **anti-patterns** to leave behind, and the **per-phase porting plan** that maps each mined pattern to the marketplace phase it serves.

---

## ai-caller

**Tech stack:** Node.js + Express, TypeScript, PostgreSQL (Drizzle), Twilio Voice/SMS, Google Calendar API, Anthropic Claude.

**Most-portable pattern:** Stateful conversation handler for voice flows (`src/services/ai-agent.ts`, ~355 LOC). A multi-tenant conversation state machine that walks a caller through `greeting → name → purpose → time-slot → confirmation`. Phase 2 of the counselor marketplace needs the same shape for "counselor proactively calls student to schedule a session" — adapt `handleConversationWithTenant()` (lines 198–355), swap appointment-booking logic for `cc_counselor_engagements` row creation, and replace Google Calendar with Supabase RLS-secured availability windows.

**Don't port:**
- Twilio TwiML generation — Coach Kairos already handles STT/LLM/TTS over a single Deepgram WebSocket, no need for the Twilio detour.
- Google Calendar OAuth — use Supabase Auth + a `cc_counselor_availability` table.

**Top files to copy/adapt:**
1. `src/services/ai-agent.ts` (~355 LOC) — conversation state machine.
2. `src/types/index.ts` — `ConversationState` interface; reuse the shape for engagement-negotiation state.
3. `src/middleware/tenantResolver.ts` — tenant context middleware; pattern to replicate for agency/counselor RLS scoping.

---

## essaymentor-ai

**Tech stack:** Python (Django 4.2 + DRF), React 18 + TS, PostgreSQL, **LangGraph** (7-agent orchestration), ChromaDB (vector RAG), Celery + Redis, Docker.

**Most-portable pattern:** The 7-agent LangGraph workflow + critique agent (`agents/workflow.py` ~158 LOC + `agents/critique_agent.py` ~116 LOC). Sequential pipeline: `Profile → RAG Retrieval → Research → Brainstorm → Outline → Draft → Critique`. The Critique agent evaluates output against a per-university rubric and returns structured feedback (`{strengths[], suggestions[], score, rubric_breakdown}`). Counselor marketplace Phase 3's voice-to-comment loop is a thinner version of this: counselor speaks → LLM produces draft inline comment with severity tag → counselor approves / edits.

**Don't port:**
- Ollama local-LLM fallback — we standardize on Claude / OpenRouter.
- Celery task queue for essay generation — overkill for our real-time use; use Inngest or Supabase Edge Functions instead.

**Top files to copy/adapt:**
1. `agents/workflow.py` (~158 LOC) — LangGraph `StateGraph` blueprint for multi-stage counselor review.
2. `agents/critique_agent.py` (~116 LOC) — structured rubric-based feedback with severity scoring.
3. `frontend/src/hooks/useWebSocket.ts` — WS streaming pattern for agent-progress events; reusable in the counselor session room.

---

## mcpforge

**Tech stack:** TypeScript + Express (MCP servers), Next.js 15 (demo), Zod, `@modelcontextprotocol/sdk`.

**Most-portable pattern:** MCP tool-server abstraction that exposes domain data as AI-callable tools (`packages/mcp-portfolio/src/server.ts`, ~100 LOC). It wraps portfolio data in 4 typed tools (`get_profile`, `search_skills`, `get_projects`, `match_requirements`) using Zod schemas. We build `mcp-student-profile-server` exposing `get_student_profile()`, `search_essays(query)`, and `leave_comment(essay_id, rubric_score, body)` — this is the **counselor-agent's interface to the student's data**, RLS-guarded and typed. The same MCP server is callable from the in-session voice flow AND from out-of-session "draft a chancing report" agents in Phase 4.

**Don't port:**
- Resume PDF parsing (pdftron) — student data is already structured in Postgres.
- Resource templates — tools are sufficient; resource APIs add surface area without payoff for our use case.

**Top files to copy/adapt:**
1. `packages/mcp-portfolio/src/server.ts` (~100 LOC) — tool-server factory pattern.
2. `packages/mcp-portfolio/src/tools/match-requirements.ts` — typed tool with Zod schema; adapt for `match_student_to_counselor(student, counselor_strengths)` scoring.
3. `apps/demo/src/lib/mcp-bridge.ts` — client-side MCP bridge for LLM tool invocation; reuse in the Phase 3 socket.io counselor-agent handler.

---

## openclawddashboard

**Tech stack:** Django 5 (DRF), Next.js 14, PostgreSQL, **Playwright** (browser automation), Celery, Redis, Stripe (billing), Anthropic Claude.

**Most-portable pattern:** Career-page form automation via Playwright (`backend/jobapply/playwright_apply.py`, ~1284 LOC). Detects ATS type, extracts form fields, fills inputs, retries on validation errors. Counselor marketplace Phase 2 wants counselors to bulk-submit recommendation letters / forms to college portals (Common App, Coalition, Naviance) where direct API access doesn't exist. Adapt `_handle_greenhouse_*()` to detect college portals and `_fill_form_fields()` / `_detect_ats()` for the structured-form portion.

Also useful: openclawddashboard already has Stripe wired (`backend/billing/`) and a `dashboard` shell (`frontend/src/app/dashboard/`) — its tier-management + revenue dashboards are a closer template for the counselor-side dashboard than starting from scratch.

**Don't port:**
- Job board scraping (LinkedIn / Indeed JobSpy) — wrong domain.
- Job-scoring keyword matcher — replace with the counselor-student match score (counselor strengths × student needs).

**Top files to copy/adapt:**
1. `backend/jobapply/playwright_apply.py` (~1284 LOC) — extract `_fill_form_fields()` + `_detect_ats()`, port to Node Playwright in a sidecar worker.
2. `backend/jobapply/tasks.py` — Celery orchestration pattern; rebuild on Inngest for "submit_recommendation(student_id, essay_id)" jobs.
3. `frontend/src/app/dashboard/jobapply/page.tsx` — dashboard card layout with stats; reuse design for "counselor recommendations submitted" metrics.

---

## devswarm

**Tech stack:** Python (FastAPI + LangGraph), Next.js 14 + TS, PostgreSQL, Redis, **Socket.IO** (real-time), Prisma.

**Most-portable pattern:** LangGraph `StateGraph` orchestration with multi-stage routing + human-approval gates (`apps/orchestrator/graph/swarm_graph.py`, ~166 LOC). Chains agents `Planner → Coders → Reviewer → Tester → Integrator` with conditional edges that route on reviewer verdicts. Phase 4 chancing + proof generation needs the same structure: `Planner → DataCollector → Analyst → Reviewer → ProofWriter`, with a human gate before publishing a chancing report.

**Don't port:**
- Code-specific tooling (GitPython, GitHub API, test runners) — irrelevant.
- Local LLM (Ollama) fallback — we standardize on Claude.

**Top files to copy/adapt:**
1. `apps/orchestrator/graph/swarm_graph.py` (~166 LOC) — `StateGraph` definition with conditional routing.
2. `apps/orchestrator/agents/base_agent.py` — base agent class with JSON-repair + tool-use loop.
3. `apps/web/src/components/dashboard/DAGVisualizer.tsx` — ReactFlow DAG visualization; reuse so the student watches the multi-agent chancing analysis in real time.

---

## educator-app (already mapped — recap)

Already covered in the dedicated educator-app analysis. Recap of what feeds the counselor marketplace:

1. **Socket.IO server architecture** (`server.js` + `services/essayCollabWebSocket.js`, ~760 LOC) — message vocabulary for live collab. Reuse `join_essay_session`, `essay_content_sync`, `comment_added`, `essay_chat_message`, `user_presence_update`. Drop the trading / leetcode / terminal namespaces.
2. **Liveblocks integration** (`controllers/liveblocksController.js`, ~75 LOC) — drop-in for shared cursors / multiplayer presence in the Phase 3 counselor room.
3. **AI commenting** (`controllers/enhancedAICommentController.js`, ~286 LOC) — comment data shape (`selection_start/end`, `selected_text`, `body`, `severity`, `resolved`) lands directly in our `cc_counselor_session_comments` table.
4. **Stripe Connect escrow flow** (`services/paymentService.js`, ~606 LOC + `controllers/ascendiaSessionController.js`, ~617 LOC) — escrow pattern with SQL transactional `BEGIN/COMMIT` for "hold funds → release on completion → refund on cancellation". Direct port to Phase 2.

---

## Per-phase porting plan

### Phase 1 — Data model _(shipped)_
No code porting required. Schema in `supabase/migrations/20260505_counselor_marketplace.sql`.

### Phase 2 — Booking + Stripe Connect
- **From educator-app:** `services/paymentService.js` Stripe Connect escrow flow + `ascendiaSessionController.js` transactional booking pattern. Drops into a new `src/app/api/counselor/booking/*` route group.
- **From ai-caller:** `src/services/ai-agent.ts` conversation state machine — adapt for "counselor calls student to schedule" voice flow built on Coach Kairos's Deepgram socket.
- **From openclawddashboard:** `backend/billing/` tier-management patterns; adapt for counselor payout-tier UI.
- **New file:** `src/lib/cc/counselor-availability.ts` — slot generation (port of ai-caller's `src/services/calendar.ts` minus the Google Calendar dependency).

### Phase 3 — Live session room
- **From educator-app:** the WebSocket vocabulary AS-IS. Mount Socket.IO in a Node sidecar (see `ARCHITECTURE.md` — Vercel serverless can't host long-lived WS). Port `essayCollabWebSocket.js` (~760 LOC) verbatim then re-type to TypeScript.
- **From educator-app:** Liveblocks for shared cursors — drop-in client SDK; the Liveblocks-managed backend handles room state.
- **From mcpforge:** build `mcp-student-profile-server` so the counselor agent can call `get_student_profile`, `search_essays`, `leave_comment` as typed tools. Same pattern as `packages/mcp-portfolio`.
- **From essaymentor-ai:** `frontend/src/hooks/useWebSocket.ts` streaming-event pattern reused for live comment fan-out.
- **From educator-app:** `enhancedAICommentController.js` comment shape + AI-suggest endpoint. Wire to the existing OpenRouter client.
- **Coach Kairos voice (already in repo):** the Deepgram WebSocket bundled agent is reused on the counselor side. Counselor speaks → transcript → LLM distills into a draft comment anchored to the current selection (the `voice_transcript` + `ai_summarized` columns we added to `cc_counselor_session_comments` exist for this).

### Phase 4 — Chancing + admit-history proof
- **From devswarm:** `apps/orchestrator/graph/swarm_graph.py` (~166 LOC) → `services/chancing-graph` Python service. Nodes: `gather_school_data → compute_chances → generate_proof → review_proof (human gate)`.
- **From essaymentor-ai:** `agents/critique_agent.py` rubric pattern → `chancing_reviewer_agent` validates computed probabilities against historical admit data.
- **From devswarm:** `DAGVisualizer.tsx` → `ChancingDAG.tsx` so the student sees the agent pipeline progress in real time.
- **From openclawddashboard:** Playwright form-automation pieces — only if we want counselors to submit recommendation forms to college portals. Defer until validated demand.

### Total adaptation estimate
~2200 LOC across the 5 sibling repos. Heaviest single lift is the Playwright automation (~1284 LOC, optional Phase 4). Highest-leverage wins are the LangGraph multi-agent patterns (essaymentor + devswarm) and the MCP tool abstraction (mcpforge), because they unlock counselor-facing AI workflows beyond the live session room.
