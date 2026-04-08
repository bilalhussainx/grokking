# Samsara Arena — AI-Powered Technical Interview Platform

**Date:** 2026-04-07  
**Status:** Approved for implementation  
**Author:** Design session (Claude Code + Bilal)  
**Scope:** Phase 1 — Single-candidate Arena IDE with AI Interviewer

---

## 1. Product Vision

Samsara Arena is an enterprise-grade technical interview platform built for companies running modern AI-era hiring pipelines. Candidates receive a real project brief, code inside a browser-based IDE backed by a real execution environment, get assessed by a field-specialized AI interviewer with a distinct personality, and produce a live-deployed artifact — all within a single session.

Target customers: FAANG engineering teams, high-growth startups, technical bootcamps, and university CS programs.

Phase 1 scope: **single candidate, one interviewer persona, one challenge, live deployment, multi-dimensional scoring.**

---

## 2. System Architecture

### 2.1 Topology

```
BROWSER (Next.js Arena IDE)
├── Monaco Editor (code editing)
├── xterm.js terminal (WebSocket → Vercel Sandbox)
├── File Explorer (REST → /api/arena/files — custom file bridge running inside sandbox via node-pty)
├── Jupyter Notebook (WebSocket → Jupyter kernel in sandbox, DS track only)
├── AI Interviewer Panel (REST → /api/arena/interviewer)
├── Milestone Tracker (Supabase Realtime)
└── Live Scorecard (Supabase Realtime)
         │
         │ REST + WebSocket
         ▼
NEXT.JS API LAYER (Vercel)
├── /api/arena/rooms          — lobby CRUD
├── /api/arena/sandbox        — provision/teardown Vercel Sandboxes
├── /api/arena/interviewer    — OpenRouter AI interviewer responses
├── /api/arena/score          — emit + query score events
└── /api/arena/milestones     — poll milestone completion
         │
         ├── Vercel Sandbox SDK (execution environment)
         ├── OpenRouter API (interviewer LLM calls)
         ├── Supabase (rooms, scores, realtime, auth)
         └── GitHub API (fork starter repo, receive push webhooks)
              │
              │ git push from sandbox → GitHub webhook
              ▼
         Vercel Preview Deploy (Next.js challenges)
         Railway Deploy (Node/Express backend challenges)
```

### 2.2 Key Design Decisions

- **Vercel Sandbox** replaces self-managed Docker. Firecracker microVMs, millisecond cold start, node24 + python3.13 runtimes, up to 5hr sessions on Pro plan.
- **OpenRouter** routes different interviewer personas to different underlying models — enables distinct "voices" per character.
- **GitHub as source of truth** for version history. Auto-push from sandbox every 5 commits OR every 3 minutes (whichever comes first) enables git-log-based scoring and audit trail.
- **Supabase Realtime** for live scorecard and milestone events — already in the stack.
- **LSP bridge** inside sandbox provides Monaco IntelliSense (typescript-language-server for JS/TS challenges, pylsp for Python/DS challenges).

---

## 3. Database Schema

```sql
-- Challenge library
CREATE TABLE arena_challenges (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  type         TEXT CHECK (type IN ('micro', 'feature')) NOT NULL,
  track        TEXT CHECK (track IN ('backend', 'frontend', 'fullstack', 'data-science', 'ml-engineer')) NOT NULL,
  duration_min INT NOT NULL,
  brief_md     TEXT NOT NULL,
  starter_repo TEXT,               -- GitHub template repo URL
  test_file    TEXT,               -- path to test suite inside sandbox
  milestones   JSONB DEFAULT '[]', -- milestone config array
  difficulty   TEXT DEFAULT 'medium',
  tags         TEXT[] DEFAULT '{}'
);

-- Rooms (lobby + active sessions)
CREATE TABLE arena_rooms (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id      UUID REFERENCES auth.users NOT NULL,
  challenge_id TEXT REFERENCES arena_challenges,
  persona_id   TEXT NOT NULL,      -- interviewer persona slug
  join_code    TEXT UNIQUE NOT NULL,
  status       TEXT DEFAULT 'lobby'
    CHECK (status IN ('lobby','active','judging','finished')),
  sandbox_id   TEXT,               -- Vercel Sandbox ID once provisioned
  github_fork  TEXT,               -- fork URL for this session
  preview_url  TEXT,               -- live deploy URL once active
  starts_at    TIMESTAMPTZ,
  ends_at      TIMESTAMPTZ,
  settings     JSONB DEFAULT '{}'
);

-- Participants
CREATE TABLE arena_participants (
  room_id      UUID REFERENCES arena_rooms ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users,
  role         TEXT DEFAULT 'challenger'
    CHECK (role IN ('host','challenger','spectator','observer')),
  container_id TEXT,
  joined_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

-- Score events (append-only ledger)
CREATE TABLE arena_score_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id      UUID REFERENCES arena_rooms,
  user_id      UUID REFERENCES auth.users,
  event_type   TEXT NOT NULL,
  points       INT NOT NULL,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Interviewer conversation log
CREATE TABLE arena_interviewer_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id      UUID REFERENCES arena_rooms,
  user_id      UUID REFERENCES auth.users,
  role         TEXT CHECK (role IN ('interviewer','participant')),
  content      TEXT NOT NULL,
  trigger      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Final scorecards (generated at session end)
CREATE TABLE arena_scorecards (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id          UUID REFERENCES arena_rooms UNIQUE,
  user_id          UUID REFERENCES auth.users,
  total_score      INT,
  code_score       INT,
  explanation_score INT,
  design_score     INT,
  speed_score      INT,
  commit_analysis  JSONB,
  ai_verdict       TEXT,   -- paragraph from interviewer persona
  created_at       TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Scoring System

### 4.1 Point Values

| Event | Points | Cap/Notes |
|---|---|---|
| `file_save` | +2 | Max 20/min to prevent spam |
| `test_pass` | +15 | Per unique test |
| `all_tests_pass` | +50 | One-time bonus |
| `milestone_complete` | +25–150 | Varies per milestone config |
| `explained_correctly` | +20 | Interviewer judges the response |
| `system_design_correct` | +25 | Interviewer grades answer |
| `hint_used` | −5 | Deducted when candidate accepts hint |
| `speed_bonus` | +30 | First to 50% test pass |
| `challenge_complete` | +100 | All requirements met |
| `deploy_live` | +150 | Preview URL returns HTTP 200 |

### 4.2 Git-Log Scoring (end of session)

At session end, the container service runs `git log --stat` and sends a `CommitAnalysis` payload to `/api/arena/score/finalize`:

```typescript
interface CommitAnalysis {
  totalCommits: number;
  featureCommits: number;       // conventional commit feat:
  fixCommits: number;
  testCommits: number;
  avgTimeBetweenCommits: number; // cadence
  linesAdded: number;
  linesDeleted: number;
  commitMessages: string[];     // fed to Claude for quality scoring
  architecturalProgression: string[]; // schema → routes → tests → deploy order
}
```

OpenRouter (using `anthropic/claude-sonnet-4-6` as the scoring model, separate from the interviewer persona model) scores commit message quality and architectural progression, adds up to 50 bonus points.

---

## 5. Interviewer Persona System

### 5.1 Persona Configuration

```typescript
interface InterviewerPersona {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company_type: 'faang' | 'startup' | 'mid-size';
  field: 'backend' | 'frontend' | 'fullstack' | 'data-science' | 'data-analyst' | 'ml-engineer';
  personality: 'strict' | 'collaborative' | 'socratic' | 'encouraging' | 'pressure-test';
  teaching_style: 'direct' | 'hints-first' | 'concept-driven' | 'adversarial' | 'nurturing';
  judging_style: 'rubric-strict' | 'holistic' | 'speed-weighted' | 'explanation-weighted';
  model: string;          // OpenRouter model ID
  voice_id?: string;      // Deepgram voice for spoken mode
  system_prompt: string;  // Full character, researched per field
  question_bank: Question[];
}
```

### 5.2 MVP Persona Roster

| ID | Name | Role | Model | Personality |
|---|---|---|---|---|
| `alex-chen` | Alex Chen | Google Backend L7 | `anthropic/claude-opus-4` | Strict, systems-first |
| `sarah-kim` | Sarah Kim | Stripe Frontend | `openai/gpt-4o` | Collaborative, perf-focused |
| `marcus-johnson` | Marcus Johnson | Meta Full-stack | `google/gemini-pro-1.5` | Pressure-test, rapid-fire |
| `dr-priya-sharma` | Dr. Priya Sharma | Netflix Data Scientist | `anthropic/claude-sonnet-4-6` | Socratic, stats-deep |
| `jake-rodriguez` | Jake Rodriguez | YC Startup CTO | `openai/gpt-4o-mini` | Encouraging, ships-focused |
| `wei-zhang` | Wei Zhang | Amazon Data Analyst | `mistralai/mistral-large` | Direct, SQL-heavy |

### 5.3 Dual-Mode Behavior State Machine

```
START → PASSIVE MODE
  trigger: idle_5s       → "What are you thinking? Talk me through it."
  trigger: commit        → "Walk me through what you just changed."
  trigger: test_fail     → Socratic nudge (no hint penalty)
  trigger: periodic_5min → System design question from bank
  trigger: idle_30s      → ESCALATE → ACTIVE MODE

ACTIVE MODE
  hint given             → −5 pts
  candidate responds     → evaluate → RETURN TO PASSIVE
  correct explanation    → +20 pts → RETURN TO PASSIVE
```

---

## 6. Arena IDE Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOPBAR: [Challenge] │ ⏱ Timer │ 🎯 Milestones │ 🚀 Deploy │ Score │
├─────────────┬───────────────────────────────┬───────────────────────┤
│ FILE TREE   │  EDITOR TABS                  │  AI INTERVIEWER PANEL │
│             │  ┌───────────────────────────┐│  ┌────────────────────┐│
│ 📁 src/     │  │ Monaco Editor             ││  │ [Avatar] Alex Chen ││
│  📄 index   │  │ Full LSP IntelliSense     ││  │ ──────────────────  ││
│  📁 routes  │  │ Git gutter indicators     ││  │ "Walk me through   ││
│  📁 models  │  │ Syntax highlight          ││  │  your data model." ││
│ 📁 tests/   │  └───────────────────────────┘│  │                    ││
│ 📄 package  │                               │  │ [You]: It uses...  ││
│             │  TERMINAL (xterm.js)          │  └────────────────────┘│
│ ──────────  │  ┌───────────────────────────┐│                        │
│ GIT LOG     │  │ $ npm test                ││  MILESTONES            │
│ ● feat:...  │  │ ✓ 3 passing               ││  ✅ Schema defined     │
│ ● fix:...   │  │ ✗ 2 failing               ││  ✅ API routes         │
│             │  └───────────────────────────┘│  ⏳ Auth middleware    │
│             │                               │  ○  Deploy preview     │
└─────────────┴───────────────────────────────┴───────────────────────┘
```

For **data science track**: Monaco + terminal replaced by Jupyter notebook panel (`@jupyterlab/services` → kernel WebSocket in sandbox). Plots and DataFrames render inline.

---

## 7. Live Deployment Flow

```
User commits → auto git push to GitHub fork
      │
      │ GitHub webhook
      ▼
Vercel detects push → builds → deploys preview URL
      │
      │ Next.js challenge → Vercel Preview URL
      │ Node/Express backend → Railway auto-deploy
      ▼
Sandbox polls preview URL until HTTP 200
      │
      │ 200 received
      ▼
Supabase Realtime emits deploy_live event
→ Milestone "Deploy Preview" fires → +150 XP
→ Preview URL appears in IDE topbar as clickable link
```

---

## 8. Challenge Library (MVP Seed)

### Engineering Track
| ID | Title | Track | Duration |
|---|---|---|---|
| `rate-limiter-api` | Build a Rate Limiter API | backend | 45min |
| `url-shortener` | URL Shortener with Analytics | backend | 60min |
| `real-time-feed` | Social Feed with WebSockets | fullstack | 2hr |
| `ml-inference-api` | Wrap Gemini as a REST API | fullstack | 90min |
| `auth-service` | JWT Auth Microservice | backend | 45min |

### Data Science Track
| ID | Title | Duration |
|---|---|---|
| `rec-sys-collab` | Collaborative Filter Recommender | 90min |
| `nlp-unstructured` | Classify Support Tickets (BERT) | 2hr |
| `churn-prediction` | Subscriber Churn (XGBoost) | 90min |
| `timeseries-forecast` | Demand Forecasting (Prophet) | 2hr |
| `llm-eval` | Evaluate LLM Output Quality | 90min |

---

## 9. Environment Variables Required

```bash
OPENROUTER_API_KEY=          # Multi-model interviewer LLM routing
VERCEL_SANDBOX_TOKEN=        # Sandbox provisioning API
VERCEL_ACCESS_TOKEN=         # Deployment API + webhook verification
GITHUB_TOKEN=                # Fork starter repos, push webhooks
RAILWAY_TOKEN=               # Backend challenge deployments
ARENA_SERVICE_SECRET=        # Shared secret between Next.js and container service
```

---

## 10. Phase Breakdown

### Phase 1 (this spec)
- Arena IDE: Monaco + xterm.js + file explorer + git log panel
- Vercel Sandbox provisioning per session
- 6 interviewer personas via OpenRouter
- Dual-mode behavior engine
- Live milestone detection
- Multi-dimensional scorecard
- Vercel auto-deploy on git push
- Engineering challenges (5 micro + feature)

### Phase 2 (next spec)
- Data science track: Jupyter kernel in sandbox
- Admin/observer view: split screen, both candidates
- Competitive mode: two candidates, shared leaderboard
- Friend challenges and social features
- Personalized recommendations engine

### Phase 3 (future)
- Company-branded interview rooms
- Custom challenge authoring tool
- Candidate report export (PDF, ATS integration)
- Spoken interview mode (existing Deepgram/Sarvam voice infra)
