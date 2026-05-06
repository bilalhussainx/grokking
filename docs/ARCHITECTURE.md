# Counselor Marketplace — Runtime Architecture & Deployment

**Branch:** `feat/counselor-marketplace`
**Companion to:** `COUNSELOR_MARKETPLACE.md` (phasing) and `PORTED_FROM.md` (code mining map).

The user asked: *can Next.js + Supabase host all of this, or do we need additional infrastructure on top?*

**Short answer:** Next.js + Supabase + Vercel handles **Phase 1 and Phase 2** entirely. **Phase 3 and Phase 4 require additional services** because Vercel serverless functions are stateless and time-limited — they can't host a persistent Socket.IO server, can't run Playwright form automation, and aren't the right runtime for Python LangGraph agent workers. The good news: every "needs additional service" piece has a managed option (Liveblocks for shared cursors, Inngest for queues, Fly.io / Railway / Modal for the long-running services), so the ops surface stays small.

This doc covers the recommended deployment topology phase by phase, plus the migration steps when you cross into a new phase.

---

## What Next.js + Supabase + Vercel does natively

Already in production today (the existing AI Coach Kairos platform):

- All CRUD via Next.js API routes against Supabase Postgres
- Auth (Supabase Auth) + RLS for data isolation
- Stripe consumer subscriptions via webhooks
- Server-rendered pages (counselor profile, agency landing, dashboards)
- Deepgram WebSocket voice agent — the **client connects directly to Deepgram**, our Vercel functions just mint the auth token. So "voice in the browser" works on Vercel even though Vercel can't host WS itself.
- Edge functions / API routes for short-running synchronous work (< 60s)

**Counselor marketplace pieces that fit this model:**
- Counselor + agency CRUD (Phase 1) ✅
- Service catalog, engagement booking with Stripe Connect (Phase 2 — Connect is just more Stripe webhooks) ✅
- Public profile pages, search, find-counselor (Phase 1) ✅
- Counselor's voice notes via Coach Kairos (works because the client talks to Deepgram, not us) ✅

**Pieces that DON'T fit and need a sidecar:**
- Persistent Socket.IO server for the Phase 3 live-session room (Vercel functions are stateless + time-capped at 5 min on Pro; Socket.IO needs a long-lived process)
- Playwright form automation for college-portal submission (Vercel functions can't bundle Chromium reliably; even on Vercel Edge, runtime caps make this unreliable)
- Python LangGraph multi-agent worker for Phase 4 chancing reports (different runtime; not a great fit for Vercel)

---

## Recommended topology by phase

### Phase 1 — Foundation _(today)_

```
                ┌──────────────────────────────────┐
                │   Next.js (Vercel)               │
                │   ─ pages: /counselors/[slug],   │
                │            /agencies/[slug],     │
                │            /find-counselor,      │
                │            /counselor/onboard    │
                │   ─ API routes:                  │
                │     /api/counselor/me            │
                │     /api/counselor/onboard       │
                │     /api/counselor/search        │
                └────────────┬─────────────────────┘
                             │
                ┌────────────▼─────────────────────┐
                │   Supabase                       │
                │   ─ Postgres (cc_* tables)       │
                │   ─ Auth                         │
                │   ─ RLS policies                 │
                └──────────────────────────────────┘
```

**Deploy:** `git push` → Vercel auto-deploy. Supabase migrations run via `npx supabase db push` or the Supabase CLI in CI. **Zero extra infra.**

---

### Phase 2 — Booking + Stripe Connect

```
                ┌──────────────────────────────────┐
                │   Next.js (Vercel)               │
                │   + new routes:                  │
                │     /api/counselor/booking       │
                │     /api/counselor/services      │
                │     /api/stripe/connect          │
                │     /api/stripe/webhook (now     │
                │       handles Connect events)    │
                └────────────┬─────────────────────┘
                             │
                ┌────────────▼─────────────────────┐
                │   Supabase                       │
                │   + cc_counselor_payouts table   │
                └──────────────────────────────────┘
                             │
                ┌────────────▼─────────────────────┐
                │   Stripe Connect (managed)       │
                │   ─ Express accounts             │
                │   ─ Escrow via destination_charges│
                └──────────────────────────────────┘
```

**Deploy:** still all Vercel. Stripe Connect onboarding is a hosted flow Stripe runs; we just store the `stripe_account_id` and route webhook events. Adding **Inngest** here is recommended for the booking-confirmation email + payout-release timer — Vercel cron + Inngest keeps everything serverless.

**Optional add (Phase 2):** the "counselor calls student to schedule" voice flow ported from ai-caller. Coach Kairos's Deepgram socket already handles this — no new infra needed.

---

### Phase 3 — Live session room (the inflection point)

This is where Next.js + Supabase alone stops being enough. The educator-app pattern needs a **persistent Socket.IO server**, which Vercel can't host.

```
                                                ┌─────────────────────┐
                                                │  Liveblocks         │
                                                │  (managed)          │
                                                │  ─ shared cursors   │
                                                │  ─ presence chips   │
                                                └─────────────────────┘
                                                          ▲
                ┌──────────────────────────────────┐      │ wss://
                │   Next.js (Vercel)               │      │ liveblocks.io
                │   + Phase 3 page:                │──────┘
                │     /counselor/session/[id]      │
                │   + minted-token endpoints       │
                └──────┬─────────────────┬─────────┘
                       │                 │
              wss://     wss://
                       │                 │
                       ▼                 ▼
        ┌──────────────────┐   ┌──────────────────────────┐
        │  Deepgram        │   │  Counselor-room WS       │
        │  (Coach Kairos   │   │  (NEW sidecar service)   │
        │   voice already  │   │  ─ Socket.IO server      │
        │   used here)     │   │  ─ host: Fly.io / Railway│
        └──────────────────┘   │  ─ message vocab ported  │
                               │    from educator-app's   │
                               │    essayCollabWebSocket.js│
                               │  ─ reads/writes Supabase │
                               │    via service-role key  │
                               └────────┬─────────────────┘
                                        │
                                        ▼
                              ┌──────────────────────────┐
                              │  Supabase (same as before)│
                              │  + cc_counselor_session_  │
                              │     comments table writes │
                              └──────────────────────────┘
```

**What's new:**
- **Liveblocks** (managed, ~$300/mo at our scale) — shared cursors + presence. Backend-agnostic.
- **`counselor-room-ws`** — a tiny Node service running Socket.IO. Single-region deploy on Fly.io ($5/mo for the 256MB tier) or Railway. Reads/writes Supabase via the service role key. Liveblocks handles the doc-state CRDT; this server handles room membership, comment broadcasts, and "counselor is speaking" events.

**Counselor voice notes** still flow through the existing Coach Kairos Deepgram socket — no new voice infrastructure. The new Node WS server only cares about the comment + presence flow.

---

### Phase 4 — Chancing + admit-history proof

The chancing engine needs a multi-step LangGraph pipeline (Planner → DataCollector → Analyst → Reviewer → ProofWriter). LangGraph runs in Python and the workflow takes 30-90 seconds — wrong shape for a Vercel function.

```
                ┌──────────────────────────────────┐
                │   Next.js (Vercel)               │
                │   + /api/counselor/chancing      │
                │     (kicks off job, returns      │
                │      job_id, polls for status)   │
                │   + /counselor/chancing/[id]     │
                │     (DAG visualizer page)        │
                └────────────┬─────────────────────┘
                             │
                  POST job   │
                             ▼
                ┌──────────────────────────────────┐
                │   Inngest (managed)              │
                │   ─ event: counselor.chancing.   │
                │     requested                    │
                │   ─ retries, scheduling, gates   │
                └────────────┬─────────────────────┘
                             │
                             ▼
                ┌──────────────────────────────────┐
                │   chancing-agent service         │
                │   (NEW Python service)           │
                │   ─ host: Fly.io / Modal / Render│
                │   ─ LangGraph StateGraph ported  │
                │     from devswarm                │
                │   ─ writes progress to Supabase  │
                │     so the page can stream it    │
                │   ─ reads student data via       │
                │     mcp-student-profile-server   │
                └──────────────────────────────────┘
                             │
                             ▼
                ┌──────────────────────────────────┐
                │   Supabase                       │
                │   + cc_chancing_reports          │
                │   + cc_chancing_steps            │
                └──────────────────────────────────┘
```

**What's new:**
- **Inngest** (managed) — durable workflow with retries + cron + step orchestration. Free tier covers early scale.
- **`chancing-agent`** — a Python service wrapping LangGraph. Same Fly.io / Modal pattern as the WS sidecar. Talks to Supabase directly with the service role key.
- **`mcp-student-profile-server`** — a small TypeScript MCP server (ported from mcpforge) that exposes student data as typed tools the LangGraph agents call. Can be a tiny Vercel route or live alongside the WS sidecar.

**Optional Phase 4 add:** **Playwright worker** for college-portal form automation, ported from openclawddashboard. Same Fly.io pattern as the chancing-agent (Chromium fits in Fly's 1GB tier with --no-sandbox flags). Triggered by Inngest from "counselor submits a Common App recommendation" events. Defer until customer validation.

---

## Final topology (everything turned on)

| Component | Runtime | Hosting | Reason |
|---|---|---|---|
| Marketing pages, dashboards, onboarding, search, profile pages, all CRUD APIs | Next.js 14 | **Vercel** | Existing infra, perfect fit |
| Postgres, Auth, RLS, Storage (admit letter PDFs) | Supabase | **Supabase Cloud** | Existing infra |
| Consumer subs + Stripe Connect (escrow + payouts) | Stripe | **Stripe (managed)** | No infra |
| Deepgram bundled voice (student-side AND counselor-side notes) | Browser → Deepgram WS | **Deepgram (managed)** | No infra; existing |
| Workflow orchestration, retries, cron, scheduled emails | Inngest | **Inngest Cloud** | Replaces Celery/Redis with durable functions |
| Shared cursors + presence in the live session room | Liveblocks SDK | **Liveblocks (managed)** | Drop-in WS for collab |
| Counselor-room Socket.IO server (room membership, comment broadcast, voice-status) | Node 22 + TypeScript | **Fly.io ($5/mo)** | Vercel can't host long-lived WS |
| MCP student-profile server (typed tools for the counselor agent) | Node + TypeScript | **Vercel** (or co-located on the WS sidecar) | Fits in serverless |
| Chancing agent (LangGraph StateGraph) | Python 3.12 + LangGraph | **Fly.io** or **Modal** | Long-running Python; not a Vercel fit |
| College-portal Playwright worker (Phase 4 optional) | Node 22 + Playwright | **Fly.io** | Chromium needs full runtime |

**Total managed services beyond what we have today:** Inngest, Liveblocks, Fly.io / Modal. **Total monthly cost at MVP scale:** ~$50–100 (Liveblocks free tier + Fly.io basic + Inngest free tier covers early users; scales linearly with sessions).

---

## Why not "everything on Vercel + Supabase"?

We considered this and ruled it out for two reasons:

1. **Vercel functions are stateless + time-capped.** A live session room needs a persistent process to maintain in-memory presence and broadcast comments to all room members. Even Vercel's Pro 5-min limit doesn't cover a 30-min counselor session, and there's no in-memory state across function invocations to track who's in the room.

2. **Python multi-agent workflows are a different ecosystem.** LangGraph + the surrounding agent libraries are mature in Python. Reimplementing in TypeScript is doable (LangGraph.js exists) but loses the devswarm + essaymentor-ai patterns we want to copy. One Fly.io Python service is cheaper than rewriting two months of agent code.

The alternative is using **Supabase Realtime** (Postgres `LISTEN/NOTIFY` over WebSocket) for the live room. We can do that for Phase 3 if we want to defer the Fly.io sidecar, but it's a worse fit for high-frequency presence updates and doesn't give us the full educator-app message vocabulary (start/stop signals, agent events) for free. Recommended only as a fallback if ops capacity is the constraint.

---

## Migration order (when each new piece lights up)

1. **Today:** Phase 1 deploys to Vercel + Supabase. Zero new infra.
2. **Phase 2 (next):** Add Stripe Connect onboarding + Inngest for the booking/payout workflows. Inngest gets a free-tier signup.
3. **Phase 3:** Stand up the Fly.io WS sidecar. Provision Liveblocks. Wire the `/counselor/session/[id]` page to both. The page already exists as a placeholder on this branch.
4. **Phase 4:** Stand up the Fly.io / Modal Python `chancing-agent` service. Provision MCP student-profile server. Add Inngest events to trigger chancing requests.

Each step is independently deployable; you don't pay infra cost for a phase you haven't reached.
