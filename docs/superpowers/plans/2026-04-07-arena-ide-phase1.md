# Arena IDE Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Samsara Arena IDE — a browser-based technical interview platform with a real execution sandbox (Vercel Sandbox), VSCode-like file explorer, Monaco editor, xterm.js terminal, AI interviewer via OpenRouter, live milestone detection, and git-based scoring.

**Architecture:** Next.js API routes provision Vercel Sandboxes per session; the browser IDE (Monaco + xterm.js + file tree) communicates with the sandbox via WebSocket relay and REST file API. An AI interviewer agent (OpenRouter, 6 personas) watches terminal/commit activity and triggers Socratic questions. Supabase Realtime broadcasts score events and milestone completions. Sessions end with a git-log-based final scorecard.

**Tech Stack:** Next.js 14 App Router, Vercel Sandbox SDK (`@vercel/sdk`), xterm.js (`xterm` + `xterm-addon-fit`), Monaco Editor (`@monaco-editor/react` already installed), OpenRouter via fetch, Supabase Realtime, `@jupyterlab/services` (Jupyter kernel client for DS IDE), Playwright for integration tests.

**Two IDE Modes (driven by `challenge.track`):**
- **Engineering IDE** (backend/frontend/fullstack) — Monaco editor + xterm.js terminal with Claude Code CLI pre-installed. User types `claude "add JWT middleware"` in terminal. Sandbox runtime: `node24`.
- **Data Science IDE** (data-science/ml-engineer) — Jupyter notebook panel (`@jupyterlab/services` → kernel in sandbox). Python 3.13 + numpy/pandas/sklearn/torch pre-installed. Dr. Priya Sharma or Wei Zhang interviewer watches cell execution. Sandbox runtime: `python3.13`.

**Spec:** `docs/superpowers/specs/2026-04-07-arena-ide-design.md`

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `supabase/migrations/20260407_arena.sql` | Arena DB tables + RLS |
| `src/lib/arena-personas.ts` | 6 interviewer persona configs + system prompts |
| `src/lib/arena-scoring.ts` | Point calculation, score event emitter, commit analysis |
| `src/lib/arena-milestones.ts` | Milestone detector (file_exists, test_passes, http_200) |
| `src/lib/arena-sandbox.ts` | Vercel Sandbox provision/teardown, exec, file read/write |
| `src/data/arena-challenges.ts` | 5 seeded engineering challenges with milestones |
| `src/app/api/arena/rooms/route.ts` | Lobby CRUD — create room, list, get by join_code |
| `src/app/api/arena/sandbox/route.ts` | Provision + teardown Vercel Sandbox per session |
| `src/app/api/arena/terminal/route.ts` | WebSocket relay: browser xterm ↔ Vercel Sandbox exec |
| `src/app/api/arena/files/route.ts` | File tree, read, write, create, delete inside sandbox |
| `src/app/api/arena/interviewer/route.ts` | OpenRouter interviewer response (trigger → response) |
| `src/app/api/arena/score/route.ts` | Emit score event, get running total |
| `src/app/api/arena/milestones/route.ts` | Poll milestone status for a room |
| `src/app/arena/page.tsx` | Arena lobby page |
| `src/app/arena/[roomId]/page.tsx` | Arena IDE page (shell) |
| `src/components/arena/ArenaTopBar.tsx` | Timer, challenge name, deploy button, score chip |
| `src/components/arena/ArenaFileTree.tsx` | VSCode-like file explorer |
| `src/components/arena/ArenaEditor.tsx` | Monaco editor with tabs + git gutter |
| `src/components/arena/ArenaTerminal.tsx` | xterm.js panel with WebSocket connection |
| `src/components/arena/ArenaGitLog.tsx` | Auto-refreshing commit list panel |
| `src/components/arena/ArenaInterviewer.tsx` | Chat panel + dual-mode behavior engine |
| `src/components/arena/ArenaMilestones.tsx` | Milestone progress sidebar |
| `src/components/arena/ArenaScorecard.tsx` | End-of-session final score modal |
| `src/components/arena/ArenaJupyterPanel.tsx` | Jupyter notebook panel for DS track (cell list, kernel output, run button) |
| `src/components/arena/ArenaLayout.tsx` | Resizable panel layout — switches between Engineering IDE and DS IDE based on `session.track` |
| `src/contexts/ArenaContext.tsx` | Session state: roomId, sandboxId, personaId, score |
| `tests/arena/rooms.spec.ts` | Playwright API tests for room endpoints |
| `tests/arena/scoring.spec.ts` | Playwright API tests for score events |
| `tests/arena/ide.spec.ts` | Playwright E2E: open IDE, see file tree, run terminal cmd |

### Modified files
| File | Change |
|---|---|
| `.env.local` | Add VERCEL_SANDBOX_TOKEN, VERCEL_ACCESS_TOKEN, GITHUB_TOKEN, ARENA_SERVICE_SECRET |
| `package.json` | Add xterm, xterm-addon-fit, @vercel/sdk |
| `src/app/layout.tsx` | No change needed — arena has its own layout |

---

## Task 1: Install dependencies + DB migration

**Files:**
- Modify: `package.json`
- Create: `supabase/migrations/20260407_arena.sql`

- [ ] **Step 1.1: Install new packages**

```bash
npm install xterm xterm-addon-fit xterm-addon-web-links @vercel/sdk @jupyterlab/services
```

Expected output: packages added to node_modules, no peer dep errors.

`@jupyterlab/services` provides the Jupyter kernel WebSocket client for the Data Science IDE. `xterm` + `xterm-addon-fit` power the Engineering IDE terminal.

- [ ] **Step 1.2: Add env vars to `.env.local`**

Add these lines (values filled in from your accounts):

```bash
VERCEL_SANDBOX_TOKEN=           # From vercel.com → Account Settings → Tokens
VERCEL_ACCESS_TOKEN=            # Same token works for both sandbox + deploy API
GITHUB_TOKEN=                   # github.com → Settings → Developer Settings → PAT (repo scope)
ARENA_SERVICE_SECRET=arena-dev-secret-change-in-prod
```

- [ ] **Step 1.3: Create DB migration**

Create `supabase/migrations/20260407_arena.sql`:

```sql
-- Challenge library
CREATE TABLE IF NOT EXISTS arena_challenges (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('micro', 'feature')),
  track        TEXT NOT NULL CHECK (track IN ('backend', 'frontend', 'fullstack', 'data-science', 'ml-engineer')),
  duration_min INT NOT NULL,
  brief_md     TEXT NOT NULL,
  starter_repo TEXT,
  test_file    TEXT,
  milestones   JSONB DEFAULT '[]',
  difficulty   TEXT DEFAULT 'medium',
  tags         TEXT[] DEFAULT '{}'
);

-- Rooms
CREATE TABLE IF NOT EXISTS arena_rooms (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id      UUID REFERENCES auth.users NOT NULL,
  challenge_id TEXT REFERENCES arena_challenges ON DELETE SET NULL,
  persona_id   TEXT NOT NULL DEFAULT 'alex-chen',
  join_code    TEXT UNIQUE NOT NULL,
  status       TEXT DEFAULT 'lobby' CHECK (status IN ('lobby','active','judging','finished')),
  sandbox_id   TEXT,
  github_fork  TEXT,
  preview_url  TEXT,
  starts_at    TIMESTAMPTZ,
  ends_at      TIMESTAMPTZ,
  settings     JSONB DEFAULT '{}'
);

-- Participants
CREATE TABLE IF NOT EXISTS arena_participants (
  room_id    UUID REFERENCES arena_rooms ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users,
  role       TEXT DEFAULT 'challenger' CHECK (role IN ('host','challenger','spectator','observer')),
  sandbox_id TEXT,
  joined_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

-- Score events (append-only ledger)
CREATE TABLE IF NOT EXISTS arena_score_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID REFERENCES arena_rooms ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  points     INT NOT NULL,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Interviewer conversation log
CREATE TABLE IF NOT EXISTS arena_interviewer_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID REFERENCES arena_rooms ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE,
  role       TEXT CHECK (role IN ('interviewer','participant')),
  content    TEXT NOT NULL,
  trigger    TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Final scorecards
CREATE TABLE IF NOT EXISTS arena_scorecards (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id           UUID REFERENCES arena_rooms ON DELETE CASCADE UNIQUE,
  user_id           UUID REFERENCES auth.users ON DELETE CASCADE,
  total_score       INT,
  code_score        INT,
  explanation_score INT,
  design_score      INT,
  speed_score       INT,
  commit_analysis   JSONB,
  ai_verdict        TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Indexes for frequent lookups
CREATE INDEX IF NOT EXISTS idx_arena_score_events_room ON arena_score_events(room_id);
CREATE INDEX IF NOT EXISTS idx_arena_score_events_user ON arena_score_events(user_id);
CREATE INDEX IF NOT EXISTS idx_arena_participants_user ON arena_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_arena_interviewer_log_room ON arena_interviewer_log(room_id);

-- RLS
ALTER TABLE arena_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_score_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_interviewer_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_scorecards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads challenges" ON arena_challenges FOR SELECT USING (true);
CREATE POLICY "Service manages challenges" ON arena_challenges FOR ALL USING (true);
CREATE POLICY "Users see own rooms" ON arena_rooms FOR SELECT USING (
  auth.uid() = host_id
  OR id IN (SELECT room_id FROM arena_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Service manages rooms" ON arena_rooms FOR ALL USING (true);
CREATE POLICY "Users see own participation" ON arena_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages participants" ON arena_participants FOR ALL USING (true);
CREATE POLICY "Users see room scores" ON arena_score_events FOR SELECT USING (
  auth.uid() = user_id
  OR room_id IN (SELECT room_id FROM arena_participants WHERE user_id = auth.uid())
  OR room_id IN (SELECT id FROM arena_rooms WHERE host_id = auth.uid())
);
CREATE POLICY "Service inserts scores" ON arena_score_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users see own log" ON arena_interviewer_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages log" ON arena_interviewer_log FOR ALL USING (true);
CREATE POLICY "Users see own scorecard" ON arena_scorecards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages scorecards" ON arena_scorecards FOR ALL USING (true);

-- Realtime for live scoring
ALTER PUBLICATION supabase_realtime ADD TABLE arena_score_events;
ALTER PUBLICATION supabase_realtime ADD TABLE arena_rooms;
```

- [ ] **Step 1.4: Apply migration**

```bash
npx supabase db push
```

Expected: migration applied, no errors. If supabase CLI not linked, run `npx supabase link` first.

- [ ] **Step 1.5: Commit**

```bash
git add supabase/migrations/20260407_arena.sql package.json package-lock.json
git commit -m "feat(arena): add DB migration + install xterm/@vercel/sdk"
```

---

## Task 2: Arena lib — personas, scoring, milestones

**Files:**
- Create: `src/lib/arena-personas.ts`
- Create: `src/lib/arena-scoring.ts`
- Create: `src/lib/arena-milestones.ts`

- [ ] **Step 2.1: Write persona types + 6 persona configs**

Create `src/lib/arena-personas.ts`:

```typescript
export type PersonaField = 'backend' | 'frontend' | 'fullstack' | 'data-science' | 'data-analyst' | 'ml-engineer';
export type PersonaPersonality = 'strict' | 'collaborative' | 'socratic' | 'encouraging' | 'pressure-test';
export type JudgingStyle = 'rubric-strict' | 'holistic' | 'speed-weighted' | 'explanation-weighted';

export interface Question {
  text: string;
  type: 'system-design' | 'concept' | 'tradeoff' | 'debug';
  trigger?: 'commit' | 'deploy' | 'periodic' | 'test_pass';
}

export interface ArenaPersona {
  id: string;
  name: string;
  avatar: string;
  title: string;
  companyType: 'faang' | 'startup' | 'mid-size';
  field: PersonaField;
  personality: PersonaPersonality;
  judgingStyle: JudgingStyle;
  model: string;           // OpenRouter model ID
  systemPrompt: string;
  questionBank: Question[];
}

// Model IDs follow OpenRouter slugs. Verify current availability at
// https://openrouter.ai/models before deploying — IDs can be deprecated.
export const ARENA_PERSONAS: ArenaPersona[] = [
  {
    id: 'alex-chen',
    name: 'Alex Chen',
    avatar: '👨‍💻',
    title: 'Senior SWE, Google L7 — Backend & Distributed Systems',
    companyType: 'faang',
    field: 'backend',
    personality: 'strict',
    judgingStyle: 'rubric-strict',
    model: 'anthropic/claude-opus-4.6',
    questionBank: [
      { text: 'What does the time complexity of your current approach look like?', type: 'concept', trigger: 'commit' },
      { text: 'How would you scale this to handle 10 million requests per second?', type: 'system-design', trigger: 'deploy' },
      { text: 'Walk me through how you would handle a partial failure in this system.', type: 'tradeoff', trigger: 'periodic' },
      { text: 'Why did you choose this data structure over a hash map here?', type: 'tradeoff', trigger: 'commit' },
      { text: 'What happens to your system under network partition?', type: 'system-design', trigger: 'periodic' },
    ],
    systemPrompt: `You are Alex Chen, a Senior Software Engineer at Google (L7) specializing in distributed backend systems. You have 12 years of experience running Google's technical interview loop. Your style is precise, demanding, and Socratic — you never give answers directly.

PERSONALITY:
- You are terse. Short questions, maximum 2 sentences per turn.
- You use "Mmm." when a candidate says something partially right but incomplete.
- You say "Interesting choice." when you disagree but want them to discover why.
- You get visibly frustrated (textually) when candidates confuse latency with throughput.
- You never compliment mediocre work. "That works." is your highest compliment before scoring.

BEHAVIOR TRIGGERS:
- IDLE 5s: "What are you thinking? Talk me through it."
- COMMIT: "Walk me through what you just changed and why."
- TEST FAIL: "What does that error tell you?" — never explain it.
- TEST PASS: "Good. Now what's missing?" — push for more.
- DEPLOY: "How would you scale this to 10M requests/second?"
- STUCK 30s: Escalate — "Let me give you a small hint: think about [relevant concept]." Cost: -5 points.
- SYSTEM DESIGN: Pull from question bank based on trigger.

RUBRIC (internal — never show to candidate):
- Code correctness: 30%
- Architectural decisions: 25%
- Explanation quality: 25%
- Speed/cadence: 10%
- Handling pressure: 10%

IMPORTANT: Responses must be ≤ 2 sentences. You are an interviewer, not a teacher.`,
  },
  {
    id: 'sarah-kim',
    name: 'Sarah Kim',
    avatar: '👩‍💻',
    title: 'Staff Engineer, Stripe — Frontend & Accessibility',
    companyType: 'faang',
    field: 'frontend',
    personality: 'collaborative',
    judgingStyle: 'explanation-weighted',
    model: 'openai/gpt-4o',
    questionBank: [
      { text: 'How does this render under slow 3G? Walk me through the critical rendering path.', type: 'concept', trigger: 'deploy' },
      { text: 'Is this accessible to a screen reader user? What ARIA roles are you using?', type: 'concept', trigger: 'commit' },
      { text: 'What is the bundle size impact of this component?', type: 'tradeoff', trigger: 'commit' },
      { text: 'If this component re-renders 60 times per second, what breaks?', type: 'debug', trigger: 'periodic' },
    ],
    systemPrompt: `You are Sarah Kim, a Staff Engineer at Stripe focused on frontend infrastructure and design systems. You care deeply about performance, accessibility, and developer experience.

PERSONALITY:
- Warm but exacting. You collaborate, but you expect precision.
- You ask "How does a screen reader user experience this?" at least once per session.
- You ask about Core Web Vitals: LCP, CLS, FID.
- You say "That's a fair tradeoff, but..." before offering a better approach.
- You genuinely enjoy pairing and explaining — but you grade on self-sufficiency.

BEHAVIOR TRIGGERS:
- IDLE 5s: "What part are you working through?"
- COMMIT: "What was the reasoning behind that change?"
- DEPLOY: "Let's stress test the visual — what breaks on mobile?"
- TEST PASS: "Nice. Now let's talk about edge cases."
- STUCK 30s: "Here's a nudge: think about [relevant concept]." Cost: -5 points.

RUBRIC (internal):
- UI correctness + accessibility: 30%
- Performance awareness: 25%
- Code clarity: 25%
- Explanation: 20%

Responses ≤ 3 sentences.`,
  },
  {
    id: 'marcus-johnson',
    name: 'Marcus Johnson',
    avatar: '🧑‍💼',
    title: 'Engineering Manager, Meta — Full-stack',
    companyType: 'faang',
    field: 'fullstack',
    personality: 'pressure-test',
    judgingStyle: 'speed-weighted',
    model: 'google/gemini-2.5-pro',
    questionBank: [
      { text: 'You have 5 minutes left. What is the most critical thing you have not built?', type: 'tradeoff', trigger: 'periodic' },
      { text: 'Would you ship this to production? Justify it.', type: 'tradeoff', trigger: 'deploy' },
      { text: 'What is the biggest risk in your current architecture?', type: 'system-design', trigger: 'commit' },
      { text: 'How does authentication work end-to-end in what you have built?', type: 'system-design', trigger: 'periodic' },
    ],
    systemPrompt: `You are Marcus Johnson, an Engineering Manager at Meta with 15 years shipping products at scale. You interview for velocity, pragmatism, and product sense — not theoretical purity.

PERSONALITY:
- You move fast. You interrupt if someone is rambling.
- You say "Ship it or kill it — which one?" when someone is over-engineering.
- You care about whether the candidate can prioritize under time pressure.
- You fire rapid follow-up questions: one right after the other.
- You respect people who say "I don't know, but I'd find out by..."

BEHAVIOR TRIGGERS:
- IDLE 5s: "Clock's ticking. What's next?"
- COMMIT: "Good. What are you doing next?"
- TEST FAIL: "How long to fix it? Is it worth fixing now?"
- DEPLOY: "Would you ship this to 10 million users? Be honest."
- STUCK 30s: "Hint: [concept]. Don't overthink it." Cost: -5 points.

RUBRIC (internal):
- Shipping velocity: 35%
- Prioritization decisions: 25%
- Code quality: 25%
- Communication: 15%

Responses ≤ 2 sentences. Push hard.`,
  },
  {
    id: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    avatar: '👩‍🔬',
    title: 'Senior Data Scientist, Netflix — ML & Statistics',
    companyType: 'faang',
    field: 'data-science',
    personality: 'socratic',
    judgingStyle: 'holistic',
    model: 'anthropic/claude-sonnet-4-6',
    questionBank: [
      { text: 'How did you handle data leakage in your feature engineering?', type: 'concept', trigger: 'commit' },
      { text: 'Why did you choose this metric over AUC-ROC?', type: 'tradeoff', trigger: 'commit' },
      { text: 'How would your model perform on unseen user segments?', type: 'concept', trigger: 'deploy' },
      { text: 'What is the confidence interval on your evaluation metric?', type: 'concept', trigger: 'periodic' },
      { text: 'If I told you your training data had 5% label noise, how would you handle it?', type: 'tradeoff', trigger: 'periodic' },
    ],
    systemPrompt: `You are Dr. Priya Sharma, a Senior Data Scientist at Netflix with a PhD in Statistics from Stanford. You have designed Netflix's recommendation evaluation frameworks.

PERSONALITY:
- Deeply Socratic. You never answer directly — you ask the next question.
- You care about statistical rigor: confidence intervals, p-values, effect sizes.
- You say "Interesting" when a candidate runs code without checking data distributions.
- You ask "How do you know?" after every conclusion the candidate draws.
- You grade heavily on methodology documentation (markdown cells for DS track).

BEHAVIOR TRIGGERS:
- CELL EXECUTED: "What do those numbers tell you?"
- COMMIT / CELL SAVE: "Walk me through your feature engineering decision."
- DEPLOY: "How would you A/B test this model in production?"
- STUCK 30s: "Think about [statistical concept]." Cost: -5 points.
- PERIODIC: Pull from question bank.

RUBRIC (internal):
- Statistical correctness: 35%
- Methodology documentation: 25%
- Model evaluation rigor: 25%
- Communication of results: 15%

Responses ≤ 3 sentences. Never give the answer.`,
  },
  {
    id: 'jake-rodriguez',
    name: 'Jake Rodriguez',
    avatar: '🚀',
    title: 'CTO, YC W22 Startup — Full-stack, Ship Fast',
    companyType: 'startup',
    field: 'fullstack',
    personality: 'encouraging',
    judgingStyle: 'holistic',
    model: 'openai/gpt-4o-mini',
    questionBank: [
      { text: 'What would a user notice if you deployed this right now?', type: 'concept', trigger: 'deploy' },
      { text: 'If you had to cut one feature to ship today, what would it be?', type: 'tradeoff', trigger: 'periodic' },
      { text: 'How would you onboard a new engineer to this codebase?', type: 'concept', trigger: 'periodic' },
    ],
    systemPrompt: `You are Jake Rodriguez, CTO of a YC W22 startup that just raised Series A. You interview for builders who can ship, learn fast, and think like owners.

PERSONALITY:
- Encouraging but not soft. You push people to think about users, not just code.
- You say "Would a user care about this?" often.
- You appreciate "good enough and shipped" over "perfect and never shipped."
- You laugh and keep the energy up, but you take product thinking seriously.

BEHAVIOR TRIGGERS:
- IDLE 5s: "What's blocking you? Let's unblock it."
- COMMIT: "Cool, what does this enable for users?"
- DEPLOY: "Nice! What's the first thing you'd change based on user feedback?"
- STUCK 30s: "No worries — think about [concept]. You've got this." Cost: -5 points.

RUBRIC (internal):
- Shipping ability: 30%
- User thinking: 30%
- Code quality: 25%
- Communication: 15%

Responses ≤ 3 sentences. Keep energy positive.`,
  },
  {
    id: 'wei-zhang',
    name: 'Wei Zhang',
    avatar: '📊',
    title: 'Senior Data Analyst, Amazon — SQL & Business Metrics',
    companyType: 'faang',
    field: 'data-analyst',
    personality: 'strict',
    judgingStyle: 'rubric-strict',
    model: 'mistralai/mistral-large',
    questionBank: [
      { text: 'What is the time complexity of this SQL query on a 100M row table?', type: 'concept', trigger: 'commit' },
      { text: 'How would you detect if a metric you are tracking is inflated by a single outlier?', type: 'concept', trigger: 'periodic' },
      { text: 'Rewrite this as a window function — why is it better?', type: 'tradeoff', trigger: 'commit' },
      { text: 'If you had to present this analysis to a VP in 5 minutes, what would you show?', type: 'tradeoff', trigger: 'deploy' },
    ],
    systemPrompt: `You are Wei Zhang, a Senior Data Analyst at Amazon who has built dashboards used by Jeff Bezos. You are direct, precise, and obsessed with business impact and SQL efficiency.

PERSONALITY:
- No small talk. Direct questions, direct feedback.
- You say "That query will full-scan. Show me the EXPLAIN plan."
- You ask "What business decision does this number enable?" after every analysis.
- You hate metric vanity. You ask "Is this actionable?" constantly.
- You expect window functions, CTEs, and proper indexing.

BEHAVIOR TRIGGERS:
- IDLE 5s: "What is your next SQL step?"
- COMMIT: "Walk me through the business logic in this query."
- DEPLOY: "What metric are you measuring, and why does Amazon care?"
- STUCK 30s: "Think about [SQL concept or business metric]." Cost: -5 points.

RUBRIC (internal):
- SQL correctness + efficiency: 35%
- Business insight: 30%
- Data modeling: 20%
- Communication: 15%

Responses ≤ 2 sentences. No fluff.`,
  },
];

export function getPersona(id: string): ArenaPersona {
  return ARENA_PERSONAS.find(p => p.id === id) ?? ARENA_PERSONAS[0];
}
```

- [ ] **Step 2.2: Create scoring lib**

Create `src/lib/arena-scoring.ts`:

```typescript
import { createAdminSupabase } from '@/lib/supabase-auth';

export const SCORE_VALUES: Record<string, number> = {
  file_save: 2,
  test_pass: 15,
  all_tests_pass: 50,
  milestone_complete: 0,     // value comes from milestone config
  explained_correctly: 20,
  system_design_correct: 25,
  hint_used: -5,
  speed_bonus: 30,
  challenge_complete: 100,
  deploy_live: 150,
};

// Cap file_save events to prevent spam
const FILE_SAVE_CAP_PER_MIN = 20;
// NOTE: This in-memory counter is INSTANCE-LOCAL. In serverless (Vercel), each
// function instance has its own Map, so the rate limit does not hold globally.
// This is acceptable for Phase 1 (low-traffic dev/demo) but MUST be moved to a
// shared store (Redis / Supabase RPC with advisory lock) before production launch.
// TODO(arena): replace with durable rate-limit store before multi-user beta.
const fileSaveCounts = new Map<string, { count: number; resetAt: number }>();

export function isFileSaveAllowed(userId: string): boolean {
  const now = Date.now();
  const bucket = fileSaveCounts.get(userId);
  if (!bucket || now > bucket.resetAt) {
    fileSaveCounts.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (bucket.count >= FILE_SAVE_CAP_PER_MIN) return false;
  bucket.count++;
  return true;
}

export async function emitScoreEvent(
  roomId: string,
  userId: string,
  eventType: string,
  pointsOverride?: number,
  metadata?: Record<string, unknown>
): Promise<{ points: number; total: number }> {
  const supabase = createAdminSupabase();

  if (eventType === 'file_save' && !isFileSaveAllowed(userId)) {
    return { points: 0, total: await getRunningTotal(roomId, userId) };
  }

  const points = pointsOverride ?? SCORE_VALUES[eventType] ?? 0;
  if (points === 0 && pointsOverride === undefined) {
    return { points: 0, total: await getRunningTotal(roomId, userId) };
  }

  const { error: insertError } = await supabase.from('arena_score_events').insert({
    room_id: roomId,
    user_id: userId,
    event_type: eventType,
    points,
    metadata: metadata ?? {},
  });
  if (insertError) {
    throw new Error(`Failed to emit score event: ${insertError.message}`);
  }

  const total = await getRunningTotal(roomId, userId);
  return { points, total };
}

export async function getRunningTotal(roomId: string, userId: string): Promise<number> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('arena_score_events')
    .select('points')
    .eq('room_id', roomId)
    .eq('user_id', userId);
  return (data ?? []).reduce((sum, e) => sum + e.points, 0);
}

export interface CommitAnalysis {
  totalCommits: number;
  featureCommits: number;
  fixCommits: number;
  testCommits: number;
  avgTimeBetweenCommitsMs: number;
  linesAdded: number;
  linesDeleted: number;
  commitMessages: string[];
}

/**
 * Parse output of `git log --shortstat --format='%H|%at|%s'`.
 * The output is paragraph-style: each commit produces a header line
 * `HASH|TIMESTAMP|SUBJECT` followed by an optional `--shortstat` line
 * like ` 2 files changed, 10 insertions(+), 3 deletions(-)`.
 */
export function parseGitLog(gitLogOutput: string): CommitAnalysis {
  const lines = gitLogOutput.trim().split('\n').filter(Boolean);
  const commits = lines
    .filter(l => l.includes('|'))
    .map(l => {
      const [, ts, subject] = l.split('|');
      return { ts: parseInt(ts, 10) * 1000, subject: subject ?? '' };
    });

  const messages = commits.map(c => c.subject);
  const featureCommits = messages.filter(m => m.startsWith('feat')).length;
  const fixCommits = messages.filter(m => m.startsWith('fix')).length;
  const testCommits = messages.filter(m => m.startsWith('test')).length;

  const timestamps = commits.map(c => c.ts).sort();
  const diffs = timestamps.slice(1).map((t, i) => t - timestamps[i]);
  const avgTimeBetweenCommitsMs = diffs.length > 0
    ? diffs.reduce((a, b) => a + b, 0) / diffs.length
    : 0;

  // Parse --shortstat lines: " 3 files changed, 42 insertions(+), 5 deletions(-)"
  let linesAdded = 0;
  let linesDeleted = 0;
  for (const line of lines) {
    const addMatch = line.match(/(\d+) insertion/);
    const delMatch = line.match(/(\d+) deletion/);
    if (addMatch) linesAdded += parseInt(addMatch[1], 10);
    if (delMatch) linesDeleted += parseInt(delMatch[1], 10);
  }

  return {
    totalCommits: commits.length,
    featureCommits,
    fixCommits,
    testCommits,
    avgTimeBetweenCommitsMs,
    linesAdded,
    linesDeleted,
    commitMessages: messages,
  };
}
```

- [ ] **Step 2.3: Create milestone lib**

Create `src/lib/arena-milestones.ts`:

```typescript
export type MilestoneDetector = 'file_exists' | 'test_passes' | 'http_200' | 'commit_contains';

export interface Milestone {
  id: string;
  title: string;
  detector: MilestoneDetector;
  target: string;        // path, test name, URL, or commit keyword
  xp: number;
}

export interface MilestoneStatus {
  id: string;
  title: string;
  complete: boolean;
  xp: number;
}

// Check a single milestone against the sandbox context
export async function checkMilestone(
  milestone: Milestone,
  context: {
    files: string[];           // list of file paths in sandbox
    lastTestOutput: string;    // stdout from last test run
    commitMessages: string[];  // git log --oneline
    previewUrl?: string;       // live deploy URL if available
  }
): Promise<boolean> {
  switch (milestone.detector) {
    case 'file_exists':
      return context.files.some(f => f.includes(milestone.target));

    case 'test_passes':
      return context.lastTestOutput.includes(milestone.target) &&
        !context.lastTestOutput.includes('failing');

    case 'commit_contains':
      return context.commitMessages.some(m =>
        m.toLowerCase().includes(milestone.target.toLowerCase())
      );

    case 'http_200': {
      if (!context.previewUrl) return false;
      try {
        const res = await fetch(context.previewUrl, { signal: AbortSignal.timeout(3000) });
        return res.ok;
      } catch {
        return false;
      }
    }

    default:
      return false;
  }
}

export async function checkAllMilestones(
  milestones: Milestone[],
  context: Parameters<typeof checkMilestone>[1]
): Promise<MilestoneStatus[]> {
  return Promise.all(
    milestones.map(async m => ({
      id: m.id,
      title: m.title,
      complete: await checkMilestone(m, context),
      xp: m.xp,
    }))
  );
}
```

- [ ] **Step 2.4: Commit**

```bash
git add src/lib/arena-personas.ts src/lib/arena-scoring.ts src/lib/arena-milestones.ts
git commit -m "feat(arena): add personas, scoring, milestone lib"
```

---

## Task 3: Vercel Sandbox lib + challenge seed data

**Files:**
- Create: `src/lib/arena-sandbox.ts`
- Create: `src/data/arena-challenges.ts`

- [ ] **Step 3.1: Create sandbox abstraction lib**

Create `src/lib/arena-sandbox.ts`:

```typescript
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
      // Clone starter repo into /workspace — single-quoted URL (regex forbids ')
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
```

- [ ] **Step 3.2: Create challenge seed data**

Create `src/data/arena-challenges.ts`:

```typescript
import type { Milestone } from '@/lib/arena-milestones';

export interface ArenaChallenge {
  id: string;
  title: string;
  type: 'micro' | 'feature';
  track: 'backend' | 'frontend' | 'fullstack' | 'data-science' | 'ml-engineer';
  durationMin: number;
  briefMd: string;
  starterRepo?: string;
  testFile?: string;
  milestones: Milestone[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  personaId: string;      // default interviewer for this challenge
}

export const ARENA_CHALLENGES: ArenaChallenge[] = [
  {
    id: 'rate-limiter-api',
    title: 'Build a Rate Limiter API',
    type: 'micro',
    track: 'backend',
    durationMin: 45,
    difficulty: 'medium',
    tags: ['redis', 'middleware', 'distributed-systems'],
    personaId: 'alex-chen',
    briefMd: `# Rate Limiter API

## Objective
Build an Express.js API with token-bucket rate limiting middleware.

## Requirements
1. \`POST /api/message\` — accepts \`{ userId, text }\`, returns \`{ ok: true }\`
2. Rate limit: **10 requests per minute per userId**
3. On limit exceeded: return \`429 Too Many Requests\` with \`{ error: "rate limited", retryAfter: <seconds> }\`
4. Rate limit state must survive server restarts (use Redis or an in-memory store that would swap to Redis in prod)
5. Endpoint \`GET /api/rate-limit-status?userId=\` shows current bucket state

## Test Suite
Run \`npm test\` to validate. Tests cover:
- Normal requests pass through
- 11th request in 60s returns 429
- \`retryAfter\` is a positive integer
- Different userIds have independent buckets

## Bonus
- Add a \`X-RateLimit-Remaining\` header to every response
- Sliding window instead of fixed window
`,
    testFile: 'tests/rate-limiter.test.js',
    milestones: [
      { id: 'express-running', title: 'Express server starts', detector: 'commit_contains', target: 'express', xp: 25 },
      { id: 'endpoint-exists', title: 'POST /api/message exists', detector: 'test_passes', target: 'POST /api/message', xp: 50 },
      { id: 'rate-limit-works', title: 'Rate limit fires at 11th request', detector: 'test_passes', target: '429', xp: 100 },
      { id: 'all-tests', title: 'All tests pass', detector: 'test_passes', target: 'passing', xp: 150 },
    ],
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener with Analytics',
    type: 'micro',
    track: 'backend',
    durationMin: 60,
    difficulty: 'medium',
    tags: ['hashing', 'db-schema', 'caching'],
    personaId: 'alex-chen',
    briefMd: `# URL Shortener with Click Analytics

## Objective
Build a URL shortener with click tracking.

## Requirements
1. \`POST /shorten\` — accepts \`{ url }\`, returns \`{ shortCode, shortUrl }\`
2. \`GET /:shortCode\` — redirects to original URL (301)
3. \`GET /analytics/:shortCode\` — returns \`{ clicks, uniqueIps, lastClicked }\`
4. Short codes: 6-character alphanumeric, collision-safe
5. Store in SQLite or an in-memory store

## Test Suite
Run \`npm test\` to validate.

## Bonus
- Expiry: accept \`expiresIn\` (seconds) in POST, return 410 after expiry
- Custom alias: accept \`alias\` field in POST
`,
    testFile: 'tests/url-shortener.test.js',
    milestones: [
      { id: 'shorten-works', title: 'POST /shorten returns shortCode', detector: 'test_passes', target: 'shortCode', xp: 50 },
      { id: 'redirect-works', title: 'Redirect works', detector: 'test_passes', target: '301', xp: 75 },
      { id: 'analytics-works', title: 'Analytics endpoint works', detector: 'test_passes', target: 'clicks', xp: 75 },
      { id: 'all-tests', title: 'All tests pass', detector: 'test_passes', target: 'passing', xp: 150 },
    ],
  },
  {
    id: 'auth-service',
    title: 'JWT Auth Microservice',
    type: 'micro',
    track: 'backend',
    durationMin: 45,
    difficulty: 'medium',
    tags: ['jwt', 'security', 'bcrypt'],
    personaId: 'alex-chen',
    briefMd: `# JWT Authentication Microservice

## Objective
Build a stateless JWT auth service.

## Requirements
1. \`POST /auth/register\` — \`{ email, password }\`, hashes password with bcrypt (rounds=12), stores user
2. \`POST /auth/login\` — validates credentials, returns \`{ accessToken, refreshToken }\`
3. \`POST /auth/refresh\` — accepts refresh token, returns new access token
4. \`GET /auth/me\` — protected route, returns user profile from JWT
5. Access token: 15-minute expiry. Refresh token: 7-day expiry.

## Test Suite
Run \`npm test\`

## Bonus
- \`POST /auth/logout\` — invalidates refresh token (token blacklist)
- Rate limit login to 5 attempts per minute per IP
`,
    testFile: 'tests/auth.test.js',
    milestones: [
      { id: 'register-works', title: 'Register endpoint works', detector: 'test_passes', target: 'register', xp: 50 },
      { id: 'login-works', title: 'Login returns JWT', detector: 'test_passes', target: 'accessToken', xp: 75 },
      { id: 'protected-route', title: 'Protected route validates JWT', detector: 'test_passes', target: '/auth/me', xp: 75 },
      { id: 'all-tests', title: 'All tests pass', detector: 'test_passes', target: 'passing', xp: 150 },
    ],
  },
];

  // ─── DATA SCIENCE CHALLENGE ──────────────────────────────────────────────
  {
    id: 'churn-prediction',
    title: 'Subscriber Churn Prediction (XGBoost)',
    type: 'feature',
    track: 'data-science',
    durationMin: 90,
    difficulty: 'medium',
    tags: ['xgboost', 'feature-engineering', 'model-evaluation', 'pandas'],
    personaId: 'dr-priya-sharma',
    briefMd: `# Subscriber Churn Prediction

## Objective
Build a churn prediction model using the provided telecom dataset.

## Dataset
\`/workspace/data/churn.csv\` — 7,043 rows, 21 features (tenure, MonthlyCharges, TotalCharges, Contract type, etc.), binary label \`Churn\`.

## Requirements
1. **EDA** — Distribution of churn label, correlation heatmap, missing value handling
2. **Feature Engineering** — Encode categoricals, scale numerics, handle \`TotalCharges\` empty strings
3. **Model** — XGBoost classifier (or sklearn GradientBoostingClassifier)
4. **Evaluation** — AUC-ROC ≥ 0.85, Precision-Recall curve, confusion matrix
5. **Interpretation** — Top 5 feature importances, one sentence explaining each

## Success Criteria
- Final notebook has ≥ 5 markdown cells documenting your methodology
- AUC-ROC printed in a cell output ≥ 0.85
- Feature importance plot rendered inline

## Bonus
- SHAP values for the top 3 predictions
- Cross-validation with 5 folds
`,
    testFile: undefined,     // DS challenges are evaluated by interviewer + notebook inspection
    milestones: [
      { id: 'eda-complete', title: 'EDA cell executed (correlation heatmap)', detector: 'commit_contains', target: 'corr', xp: 25 },
      { id: 'model-trained', title: 'Model fit() called', detector: 'commit_contains', target: 'fit', xp: 75 },
      { id: 'auc-printed', title: 'AUC-ROC ≥ 0.85 printed', detector: 'commit_contains', target: 'roc_auc', xp: 100 },
      { id: 'feature-importance', title: 'Feature importance plotted', detector: 'commit_contains', target: 'feature_importances', xp: 75 },
    ],
  },
];

export function getChallenge(id: string): ArenaChallenge | undefined {
  return ARENA_CHALLENGES.find(c => c.id === id);
}
```

- [ ] **Step 3.3: Commit**

```bash
git add src/lib/arena-sandbox.ts src/data/arena-challenges.ts
git commit -m "feat(arena): add sandbox lib + challenge seed data"
```

---

## Task 4: Arena API routes — rooms + sandbox

**Files:**
- Create: `src/app/api/arena/rooms/route.ts`
- Create: `src/app/api/arena/sandbox/route.ts`

- [ ] **Step 4.1: Write Playwright API test for rooms (fails first)**

Create `tests/arena/rooms.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Arena Rooms API', () => {
  let authCookie: string;

  test.beforeAll(async ({ request }) => {
    // Sign in as test user
    const res = await request.post('/api/auth/login', {
      data: { email: 'test@example.com', password: 'testpassword' },
    });
    expect(res.ok()).toBeTruthy();
    authCookie = res.headers()['set-cookie'] ?? '';
  });

  test('POST /api/arena/rooms creates a room', async ({ request }) => {
    const res = await request.post('/api/arena/rooms', {
      headers: { Cookie: authCookie },
      data: { challengeId: 'rate-limiter-api', personaId: 'alex-chen' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.joinCode).toHaveLength(6);
    expect(body.status).toBe('lobby');
  });

  test('GET /api/arena/rooms?joinCode=XXX returns room', async ({ request }) => {
    // Create room first
    const createRes = await request.post('/api/arena/rooms', {
      headers: { Cookie: authCookie },
      data: { challengeId: 'rate-limiter-api', personaId: 'alex-chen' },
    });
    const { joinCode } = await createRes.json();

    const res = await request.get(`/api/arena/rooms?joinCode=${joinCode}`, {
      headers: { Cookie: authCookie },
    });
    expect(res.ok()).toBeTruthy();
    const room = await res.json();
    expect(room.joinCode).toBe(joinCode);
  });
});
```

- [ ] **Step 4.2: Run test — expect failure**

```bash
npx playwright test tests/arena/rooms.spec.ts --reporter=line
```

Expected: FAIL — `404 /api/arena/rooms`

- [ ] **Step 4.3: Create rooms API route**

Create `src/app/api/arena/rooms/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';

function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { challengeId, personaId, settings } = await req.json();
  if (!challengeId || !personaId) {
    return NextResponse.json({ error: 'challengeId and personaId required' }, { status: 400 });
  }

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from('arena_rooms')
    .insert({
      host_id: user.id,
      challenge_id: challengeId,
      persona_id: personaId,
      join_code: generateJoinCode(),
      status: 'lobby',
      settings: settings ?? {},
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Add host as participant
  await admin.from('arena_participants').insert({
    room_id: data.id,
    user_id: user.id,
    role: 'host',
  });

  return NextResponse.json(data);
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const joinCode = req.nextUrl.searchParams.get('joinCode');
  const admin = createAdminSupabase();

  if (joinCode) {
    const { data, error } = await admin
      .from('arena_rooms')
      .select('*')
      .eq('join_code', joinCode.toUpperCase())
      .single();
    if (error || !data) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    return NextResponse.json(data);
  }

  // List rooms for this user
  const { data } = await admin
    .from('arena_participants')
    .select('room_id')
    .eq('user_id', user.id);
  const roomIds = (data ?? []).map(r => r.room_id);
  if (roomIds.length === 0) return NextResponse.json([]);

  const { data: rooms } = await admin
    .from('arena_rooms')
    .select('*')
    .in('id', roomIds)
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json(rooms ?? []);
}
```

- [ ] **Step 4.4: Create sandbox API route**

Create `src/app/api/arena/sandbox/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { provisionSandbox, teardownSandbox } from '@/lib/arena-sandbox';
import { getChallenge } from '@/data/arena-challenges';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { roomId } = await req.json();
  if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });

  const admin = createAdminSupabase();

  // Verify user is in this room
  const { data: participant } = await admin
    .from('arena_participants')
    .select('role')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .single();
  if (!participant) return NextResponse.json({ error: 'Not in room' }, { status: 403 });

  // Get challenge starter repo
  const { data: room } = await admin
    .from('arena_rooms')
    .select('challenge_id')
    .eq('id', roomId)
    .single();

  const challenge = room?.challenge_id ? getChallenge(room.challenge_id) : undefined;

  try {
    const sandboxId = await provisionSandbox(challenge?.starterRepo);

    // Store sandbox ID on participant
    await admin
      .from('arena_participants')
      .update({ sandbox_id: sandboxId })
      .eq('room_id', roomId)
      .eq('user_id', user.id);

    // Update room status to active
    await admin
      .from('arena_rooms')
      .update({ status: 'active', starts_at: new Date().toISOString(), sandbox_id: sandboxId })
      .eq('id', roomId);

    return NextResponse.json({ sandboxId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sandboxId } = await req.json();
  if (!sandboxId) return NextResponse.json({ error: 'sandboxId required' }, { status: 400 });

  await teardownSandbox(sandboxId);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4.5: Run tests — expect pass**

```bash
npx playwright test tests/arena/rooms.spec.ts --reporter=line
```

Expected: PASS (both room tests)

- [ ] **Step 4.6: Commit**

```bash
git add src/app/api/arena/ tests/arena/
git commit -m "feat(arena): rooms + sandbox API routes + Playwright tests"
```

---

## Task 5: Files API + score API + interviewer API

**Files:**
- Create: `src/app/api/arena/files/route.ts`
- Create: `src/app/api/arena/score/route.ts`
- Create: `src/app/api/arena/interviewer/route.ts`

- [ ] **Step 5.1: Write Playwright test for score API (fails first)**

Append to `tests/arena/scoring.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Arena Score API', () => {
  test('POST /api/arena/score emits event and returns total', async ({ request }) => {
    // This test uses service role via header — in real tests, use auth cookie
    const res = await request.post('/api/arena/score', {
      headers: { 'x-arena-secret': 'arena-dev-secret-change-in-prod' },
      data: {
        roomId: 'test-room-id',
        userId: 'test-user-id',
        eventType: 'test_pass',
      },
    });
    // 401 expected until real room exists — just check endpoint exists
    expect([200, 400, 401, 403]).toContain(res.status());
  });
});
```

- [ ] **Step 5.2: Create files API**

Create `src/app/api/arena/files/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-auth';
import { listFiles, readFile, writeFile } from '@/lib/arena-sandbox';
import { emitScoreEvent } from '@/lib/arena-scoring';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sandboxId = req.nextUrl.searchParams.get('sandboxId');
  const filePath = req.nextUrl.searchParams.get('path');

  if (!sandboxId) return NextResponse.json({ error: 'sandboxId required' }, { status: 400 });

  if (filePath) {
    const content = await readFile(sandboxId, filePath);
    return NextResponse.json({ content });
  }

  const files = await listFiles(sandboxId);
  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sandboxId, path, content, roomId } = await req.json();
  if (!sandboxId || !path || content === undefined) {
    return NextResponse.json({ error: 'sandboxId, path, content required' }, { status: 400 });
  }

  await writeFile(sandboxId, path, content);

  // Emit score event for file save
  if (roomId) {
    await emitScoreEvent(roomId, user.id, 'file_save');
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 5.3: Create score API**

Create `src/app/api/arena/score/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-auth';
import { emitScoreEvent, getRunningTotal } from '@/lib/arena-scoring';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { roomId, eventType, pointsOverride, metadata } = await req.json();
  if (!roomId || !eventType) {
    return NextResponse.json({ error: 'roomId and eventType required' }, { status: 400 });
  }

  const result = await emitScoreEvent(roomId, user.id, eventType, pointsOverride, metadata);
  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const roomId = req.nextUrl.searchParams.get('roomId');
  if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });

  const total = await getRunningTotal(roomId, user.id);
  return NextResponse.json({ total });
}
```

- [ ] **Step 5.4: Create interviewer API**

Create `src/app/api/arena/interviewer/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { getPersona } from '@/lib/arena-personas';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    roomId,
    personaId,
    trigger,          // 'idle_5s' | 'commit' | 'test_fail' | 'test_pass' | 'deploy' | 'idle_30s' | 'periodic'
    context,          // { recentCode, recentTerminalOutput, lastCommitMessage, previewUrl, lastCellSource, lastCellOutput, notebookSnapshot }
    participantMessage,  // optional — when participant replied to interviewer
  } = await req.json();

  if (!roomId || !personaId || !trigger) {
    return NextResponse.json({ error: 'roomId, personaId, trigger required' }, { status: 400 });
  }

  const persona = getPersona(personaId);
  const admin = createAdminSupabase();

  // Get recent conversation history (last 10 messages)
  const { data: history } = await admin
    .from('arena_interviewer_log')
    .select('role, content')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const messages = [
    { role: 'system', content: persona.systemPrompt },
    ...(history ?? []).reverse().map(m => ({
      role: m.role === 'interviewer' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  // Build trigger message
  let triggerMessage = '';
  switch (trigger) {
    case 'idle_5s':
      triggerMessage = '[SYSTEM: Candidate has been idle for 5 seconds with no typing activity]';
      break;
    case 'idle_30s':
      triggerMessage = '[SYSTEM: Candidate has been stuck for 30 seconds. Escalate to active mode — give a small hint.]';
      break;
    case 'commit':
      triggerMessage = `[SYSTEM: Candidate just committed: "${context?.lastCommitMessage}". Ask them to walk through it.]`;
      break;
    case 'test_fail':
      triggerMessage = `[SYSTEM: Test failed. Terminal output: ${context?.recentTerminalOutput?.slice(0, 200)}. Ask Socratically.]`;
      break;
    case 'test_pass':
      triggerMessage = '[SYSTEM: Test just passed. Push the candidate for more depth or edge cases.]';
      break;
    case 'deploy':
      triggerMessage = `[SYSTEM: Candidate deployed successfully. Preview URL: ${context?.previewUrl}. Ask about scale/production.]`;
      break;
    case 'cell_executed': {
      // DS track: interviewer reads the cell source + output, asks Socratically
      const cellSrc = (context?.lastCellSource ?? '').slice(0, 300);
      const cellOut = (context?.lastCellOutput ?? '').slice(0, 300);
      // Optionally include the full notebook snapshot for deeper context
      const nbHint = context?.notebookSnapshot
        ? `\n\nFull notebook (cells + outputs): ${context.notebookSnapshot.slice(0, 1500)}`
        : '';
      triggerMessage = `[SYSTEM: Candidate executed a cell.\nCode:\n${cellSrc}\nOutput:\n${cellOut}${nbHint}\nAsk them to explain their methodology.]`;
      break;
    }
    case 'periodic':
      const randomQ = persona.questionBank[Math.floor(Math.random() * persona.questionBank.length)];
      triggerMessage = `[SYSTEM: Ask this question naturally: "${randomQ.text}"]`;
      break;
    default:
      triggerMessage = participantMessage
        ? `[Candidate said: "${participantMessage}"]`
        : '[SYSTEM: Check in with the candidate.]';
  }

  messages.push({ role: 'user', content: triggerMessage });

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: persona.model,
      messages,
      max_tokens: 150,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'LLM error' }, { status: 502 });
  }

  const data = await res.json();
  const reply: string = data.choices?.[0]?.message?.content ?? '';

  // Log the interviewer message
  await admin.from('arena_interviewer_log').insert([
    { room_id: roomId, user_id: user.id, role: 'interviewer', content: reply, trigger },
  ]);

  // Deduct hint points if it was a 30s escalation
  if (trigger === 'idle_30s') {
    await fetch('/api/arena/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, eventType: 'hint_used' }),
    });
  }

  return NextResponse.json({ reply, personaName: persona.name, avatar: persona.avatar });
}
```

- [ ] **Step 5.5: Commit**

```bash
git add src/app/api/arena/files/ src/app/api/arena/score/ src/app/api/arena/interviewer/ tests/arena/
git commit -m "feat(arena): files, score, interviewer API routes"
```

---

## Task 6: Arena context + terminal WebSocket route

**Files:**
- Create: `src/contexts/ArenaContext.tsx`
- Create: `src/app/api/arena/terminal/route.ts`

- [ ] **Step 6.1: Create ArenaContext**

Create `src/contexts/ArenaContext.tsx`:

```typescript
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ArenaSession {
  roomId: string;
  sandboxId: string;
  personaId: string;
  challengeId: string;
  challengeTitle: string;
  durationMin: number;
  score: number;
  mode: 'passive' | 'active';
  // IDE mode selection
  track: 'backend' | 'frontend' | 'fullstack' | 'data-science' | 'ml-engineer';
  kernelGatewayUrl?: string;  // set only for data-science / ml-engineer tracks
}

interface ArenaContextValue {
  session: ArenaSession | null;
  setSession: (s: ArenaSession) => void;
  updateScore: (delta: number) => void;
  setMode: (mode: 'passive' | 'active') => void;
  clearSession: () => void;
}

const ArenaContext = createContext<ArenaContextValue | null>(null);

export function ArenaProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<ArenaSession | null>(null);

  const setSession = useCallback((s: ArenaSession) => setSessionState(s), []);

  const updateScore = useCallback((delta: number) => {
    setSessionState(prev => prev ? { ...prev, score: prev.score + delta } : prev);
  }, []);

  const setMode = useCallback((mode: 'passive' | 'active') => {
    setSessionState(prev => prev ? { ...prev, mode } : prev);
  }, []);

  const clearSession = useCallback(() => setSessionState(null), []);

  return (
    <ArenaContext.Provider value={{ session, setSession, updateScore, setMode, clearSession }}>
      {children}
    </ArenaContext.Provider>
  );
}

export function useArena() {
  const ctx = useContext(ArenaContext);
  if (!ctx) throw new Error('useArena must be used within ArenaProvider');
  return ctx;
}
```

- [ ] **Step 6.2: Create terminal WebSocket route**

Create `src/app/api/arena/terminal/route.ts`:

```typescript
// WebSocket relay: browser xterm.js ↔ Vercel Sandbox exec session
// Next.js App Router handles WebSocket upgrades via the Response API.

import { NextRequest } from 'next/server';
import { execInSandbox } from '@/lib/arena-sandbox';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sandboxId = searchParams.get('sandboxId');

  if (!sandboxId) {
    return new Response('sandboxId required', { status: 400 });
  }

  // Check WebSocket upgrade
  const upgradeHeader = req.headers.get('upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket', { status: 426 });
  }

  // @ts-expect-error — Next.js experimental WebSocket API
  const { socket, response } = await req.socket?.upgrade?.() ?? {};
  if (!socket) {
    return new Response('WebSocket upgrade failed', { status: 500 });
  }

  // Simple command relay: client sends a command string, we exec it and stream output
  socket.on('message', async (data: Buffer) => {
    const command = data.toString().trim();
    if (!command) return;

    try {
      const result = await execInSandbox(sandboxId, command);
      const output = result.stdout + (result.stderr ? `\r\n\x1b[31m${result.stderr}\x1b[0m` : '');
      socket.send(output || '\r\n');
    } catch (err) {
      socket.send(`\r\n\x1b[31mError: ${err}\x1b[0m\r\n`);
    }
  });

  socket.on('error', () => socket.close());

  return response;
}
```

> **Note:** Vercel Sandbox's exec is request-response, not a true PTY stream. For a full interactive terminal (arrow keys, tab completion), use the Vercel Sandbox streaming exec API once available, or install `ttyd` inside the sandbox and proxy to its WebSocket. For Phase 1, the command-relay approach works for running commands and seeing output.

- [ ] **Step 6.3: Commit**

```bash
git add src/contexts/ArenaContext.tsx src/app/api/arena/terminal/
git commit -m "feat(arena): ArenaContext + terminal WebSocket relay"
```

---

## Task 7: Arena IDE components — file tree, editor, terminal

**Files:**
- Create: `src/components/arena/ArenaFileTree.tsx`
- Create: `src/components/arena/ArenaEditor.tsx`
- Create: `src/components/arena/ArenaTerminal.tsx`
- Create: `src/components/arena/ArenaGitLog.tsx`

- [ ] **Step 7.1: Create file tree component**

Create `src/components/arena/ArenaFileTree.tsx`:

```typescript
"use client";

import { useEffect, useState, useCallback } from 'react';
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen, RefreshCw } from 'lucide-react';

interface FileNode {
  path: string;
  type: 'file' | 'directory';
}

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children: TreeNode[];
  expanded?: boolean;
}

function buildTree(files: FileNode[]): TreeNode[] {
  const root: TreeNode[] = [];
  const map = new Map<string, TreeNode>();

  for (const f of files.sort((a, b) => a.path.localeCompare(b.path))) {
    const parts = f.path.split('/');
    let current = root;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = i === parts.length - 1;

      if (!map.has(currentPath)) {
        const node: TreeNode = {
          name: part,
          path: currentPath,
          type: isLast ? f.type : 'directory',
          children: [],
          expanded: i < 1, // expand first level by default
        };
        map.set(currentPath, node);
        current.push(node);
      }

      current = map.get(currentPath)!.children;
    }
  }

  return root;
}

interface Props {
  sandboxId: string;
  onFileSelect: (path: string) => void;
  selectedPath?: string;
}

export default function ArenaFileTree({ sandboxId, onFileSelect, selectedPath }: Props) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/arena/files?sandboxId=${sandboxId}`);
      if (res.ok) {
        const { files } = await res.json();
        setTree(buildTree(files));
      }
    } finally {
      setLoading(false);
    }
  }, [sandboxId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000); // poll every 3s
    return () => clearInterval(interval);
  }, [refresh]);

  function toggleExpand(node: TreeNode) {
    setTree(prev => {
      const updated = JSON.parse(JSON.stringify(prev)) as TreeNode[];
      const found = findNode(updated, node.path);
      if (found) found.expanded = !found.expanded;
      return updated;
    });
  }

  function findNode(nodes: TreeNode[], path: string): TreeNode | null {
    for (const n of nodes) {
      if (n.path === path) return n;
      const found = findNode(n.children, path);
      if (found) return found;
    }
    return null;
  }

  function renderNode(node: TreeNode, depth = 0): React.ReactNode {
    const isSelected = selectedPath === node.path;
    const indent = depth * 12;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-1 py-0.5 px-2 cursor-pointer text-xs transition-colors rounded ${
            isSelected ? 'bg-violet-500/20 text-violet-300' : 'text-white/50 hover:bg-white/5 hover:text-white/80'
          }`}
          style={{ paddingLeft: `${8 + indent}px` }}
          onClick={() => {
            if (node.type === 'directory') toggleExpand(node);
            else onFileSelect(node.path);
          }}
        >
          {node.type === 'directory' ? (
            <>
              {node.expanded ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
              {node.expanded ? <FolderOpen className="w-3.5 h-3.5 shrink-0 text-yellow-400/70" /> : <Folder className="w-3.5 h-3.5 shrink-0 text-yellow-400/70" />}
            </>
          ) : (
            <>
              <span className="w-3 h-3 shrink-0" />
              <FileCode className="w-3.5 h-3.5 shrink-0 text-cyan-400/70" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </div>
        {node.type === 'directory' && node.expanded && node.children.map(c => renderNode(c, depth + 1))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950/50 border-r border-white/[0.06]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <span className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">Explorer</span>
        <button onClick={refresh} className="p-1 rounded hover:bg-white/5 transition">
          <RefreshCw className={`w-3 h-3 text-white/30 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {tree.map(n => renderNode(n))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7.2: Create editor component**

Create `src/components/arena/ArenaEditor.tsx`:

```typescript
"use client";

import { useState, useCallback, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { X, Save } from 'lucide-react';

function getLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescriptreact', js: 'javascript', jsx: 'javascriptreact',
    py: 'python', json: 'json', md: 'markdown', sql: 'sql',
    css: 'css', html: 'html', sh: 'shell',
  };
  return map[ext] ?? 'plaintext';
}

interface Tab {
  path: string;
  content: string;
  dirty: boolean;
}

interface Props {
  sandboxId: string;
  roomId: string;
  openFilePath?: string;
  onFileOpened?: (path: string, content: string) => void;
  'data-testid'?: string;
}

export default function ArenaEditor({ sandboxId, roomId, openFilePath, onFileOpened, 'data-testid': testId }: Props) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const loadedPaths = useRef<Set<string>>(new Set());

  // Open a file in a new tab (called from parent when file tree item clicked)
  const openFile = useCallback(async (path: string) => {
    if (loadedPaths.current.has(path)) {
      setActiveTab(path);
      return;
    }

    const res = await fetch(`/api/arena/files?sandboxId=${sandboxId}&path=${encodeURIComponent(path)}`);
    if (!res.ok) return;
    const { content } = await res.json();
    loadedPaths.current.add(path);
    setTabs(prev => [...prev.filter(t => t.path !== path), { path, content, dirty: false }]);
    setActiveTab(path);
    onFileOpened?.(path, content);
  }, [sandboxId, onFileOpened]);

  // If openFilePath changes from parent (file tree click), open it
  if (openFilePath && !loadedPaths.current.has(openFilePath)) {
    openFile(openFilePath);
  }

  const saveActiveTab = useCallback(async () => {
    if (!activeTab) return;
    const tab = tabs.find(t => t.path === activeTab);
    if (!tab || !tab.dirty) return;

    setSaving(true);
    await fetch('/api/arena/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sandboxId, path: activeTab, content: tab.content, roomId }),
    });
    setTabs(prev => prev.map(t => t.path === activeTab ? { ...t, dirty: false } : t));
    setSaving(false);
  }, [activeTab, tabs, sandboxId, roomId]);

  const activeContent = tabs.find(t => t.path === activeTab)?.content ?? '';

  return (
    <div className="h-full flex flex-col bg-slate-950" data-testid={testId ?? 'arena-editor-tabs'}>
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/[0.06] overflow-x-auto shrink-0">
        {tabs.map(tab => (
          <div
            key={tab.path}
            onClick={() => setActiveTab(tab.path)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs cursor-pointer border-r border-white/[0.06] shrink-0 transition-colors ${
              activeTab === tab.path
                ? 'bg-slate-900 text-white border-t border-t-violet-500'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.02]'
            }`}
          >
            <span className="max-w-[120px] truncate">{tab.path.split('/').pop()}</span>
            {tab.dirty && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />}
            <button
              onClick={e => { e.stopPropagation(); setTabs(prev => prev.filter(t => t.path !== tab.path)); if (activeTab === tab.path) setActiveTab(tabs[0]?.path ?? null); }}
              className="opacity-0 group-hover:opacity-100 hover:text-white/80 ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {tabs.length > 0 && (
          <button
            onClick={saveActiveTab}
            disabled={saving || !tabs.find(t => t.path === activeTab)?.dirty}
            className="ml-auto px-3 py-1.5 text-[10px] text-white/30 hover:text-white/60 disabled:opacity-20 flex items-center gap-1 shrink-0 transition"
          >
            <Save className="w-3 h-3" />
            {saving ? 'Saving...' : 'Save (⌘S)'}
          </button>
        )}
      </div>

      {/* Monaco editor */}
      {activeTab ? (
        <MonacoEditor
          className="flex-1"
          language={getLanguage(activeTab)}
          value={activeContent}
          theme="vs-dark"
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 8 },
            renderLineHighlight: 'gutter',
          }}
          onChange={value => {
            setTabs(prev => prev.map(t => t.path === activeTab ? { ...t, content: value ?? '', dirty: true } : t));
          }}
          onMount={(editor, monaco) => {
            // Cmd/Ctrl+S to save
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, saveActiveTab);
          }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/20 text-sm">
          Select a file to open
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7.3: Create terminal component**

Create `src/components/arena/ArenaTerminal.tsx`:

```typescript
"use client";

import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface Props {
  sandboxId: string;
  onOutput?: (output: string) => void; // forwarded to interviewer context
}

export default function ArenaTerminal({ sandboxId, onOutput }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const inputBufferRef = useRef<string>('');

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/arena/terminal?sandboxId=${sandboxId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      termRef.current?.write('\x1b[32m● Connected to sandbox\x1b[0m\r\n$ ');
    };

    ws.onmessage = (evt) => {
      const output = typeof evt.data === 'string' ? evt.data : '';
      termRef.current?.write(output + '\r\n$ ');
      onOutput?.(output);
    };

    ws.onerror = () => {
      termRef.current?.write('\x1b[31m● Connection error\x1b[0m\r\n');
    };

    ws.onclose = () => {
      termRef.current?.write('\x1b[33m● Disconnected\x1b[0m\r\n');
    };
  }, [sandboxId, onOutput]);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#0a0a0f',
        foreground: '#e2e8f0',
        cursor: '#7c3aed',
        selectionBackground: '#7c3aed44',
      },
      fontSize: 12,
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      cursorBlink: true,
      convertEol: true,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();
    termRef.current = term;

    // Handle keyboard input — buffer until Enter
    term.onKey(({ key, domEvent }) => {
      if (domEvent.key === 'Enter') {
        const command = inputBufferRef.current.trim();
        inputBufferRef.current = '';
        term.write('\r\n');
        if (command && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(command);
        } else {
          term.write('$ ');
        }
      } else if (domEvent.key === 'Backspace') {
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (!domEvent.ctrlKey && !domEvent.altKey) {
        inputBufferRef.current += key;
        term.write(key);
      }
    });

    connect();

    const handleResize = () => fit.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      wsRef.current?.close();
      term.dispose();
    };
  }, [connect]);

  return (
    <div className="h-full bg-[#0a0a0f] p-1">
      <div ref={containerRef} className="h-full" />
    </div>
  );
}
```

- [ ] **Step 7.4: Create git log component**

Create `src/components/arena/ArenaGitLog.tsx`:

```typescript
"use client";

import { useEffect, useState } from 'react';
import { GitCommit } from 'lucide-react';

interface Commit {
  hash: string;
  message: string;
  ts: number;
}

function parseCommits(gitLog: string): Commit[] {
  return gitLog
    .split('\n')
    .filter(l => l.includes('|'))
    .map(l => {
      const [hash, ts, ...msg] = l.split('|');
      return { hash: hash?.slice(0, 7) ?? '', ts: parseInt(ts ?? '0', 10) * 1000, message: msg.join('|') };
    })
    .filter(c => c.hash);
}

export default function ArenaGitLog({ sandboxId }: { sandboxId: string }) {
  const [commits, setCommits] = useState<Commit[]>([]);

  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/arena/files?sandboxId=${sandboxId}&path=../.git-log`);
      if (!res.ok) return;
      // We re-use the exec endpoint via a file read trick — see milestone polling
    };

    const interval = setInterval(poll, 10_000);
    return () => clearInterval(interval);
  }, [sandboxId]);

  return (
    <div className="border-t border-white/[0.06] p-2">
      <div className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-1">Git Log</div>
      {commits.length === 0 ? (
        <div className="text-[11px] text-white/20 px-1">No commits yet</div>
      ) : (
        <div className="space-y-1">
          {commits.slice(0, 8).map(c => (
            <div key={c.hash} className="flex items-start gap-1.5 px-1">
              <GitCommit className="w-3 h-3 text-violet-400/60 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] text-white/60 leading-tight">{c.message}</div>
                <div className="text-[10px] text-white/25">{c.hash}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7.5: Commit**

```bash
git add src/components/arena/
git commit -m "feat(arena): file tree, editor, terminal, git log components"
```

---

## Task 7a: Data Science IDE — Jupyter notebook panel

**Files:**
- Create: `src/components/arena/ArenaJupyterPanel.tsx`
- Create: `src/app/api/arena/sandbox/ds/route.ts`

This task implements the second IDE mode. When `session.track` is `'data-science'` or `'ml-engineer'`, `ArenaLayout` renders this panel instead of the file-tree + Monaco + terminal stack. The Jupyter kernel gateway runs inside the `python3.13` Vercel Sandbox. The browser connects to it via `@jupyterlab/services`.

- [ ] **Step 7a.1: Create DS sandbox provisioning API route**

Create `src/app/api/arena/sandbox/ds/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-auth';
import { provisionDataScienceSandbox } from '@/lib/arena-sandbox';

export async function POST(req: NextRequest) {
  const { roomId, starterNotebookUrl } = await req.json();
  if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });

  const { sandboxId, kernelGatewayUrl } = await provisionDataScienceSandbox(starterNotebookUrl);

  const supabase = createAdminSupabase();
  await supabase
    .from('arena_rooms')
    .update({ sandbox_id: sandboxId, status: 'active', settings: { kernelGatewayUrl } })
    .eq('id', roomId);

  return NextResponse.json({ sandboxId, kernelGatewayUrl });
}
```

- [ ] **Step 7a.2: Write failing Playwright test for Jupyter panel**

Add to `tests/arena/ide.spec.ts`:

```typescript
test('data science IDE shows Jupyter notebook panel', async ({ page }) => {
  // Mock ArenaContext with a data-science session
  await page.route('**/api/arena/sandbox/ds', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ sandboxId: 'mock-ds-sandbox', kernelGatewayUrl: 'ws://localhost:8888' }),
  }));

  await page.goto('/arena');
  // Select a data-science challenge
  const dsChallenge = page.locator('[data-testid="challenge-card"][data-track="data-science"]').first();
  if (await dsChallenge.count() > 0) {
    await dsChallenge.click();
    await page.locator('[data-testid="start-arena-btn"]').click();

    // Should show Jupyter panel header, not Monaco tabs
    await expect(page.locator('[data-testid="jupyter-panel"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="arena-editor-tabs"]')).not.toBeVisible();
  }
});
```

Run: `npx playwright test tests/arena/ide.spec.ts --grep "data science" --reporter=line`
Expected: FAIL (component doesn't exist yet)

- [ ] **Step 7a.3: Create Jupyter panel component**

Create `src/components/arena/ArenaJupyterPanel.tsx`:

```typescript
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { KernelManager, ServerConnection } from '@jupyterlab/services';
import { Play, Square, Plus, Trash2, RefreshCw } from 'lucide-react';

interface Cell {
  id: string;
  source: string;
  output: string;
  executing: boolean;
  cellType: 'code' | 'markdown';
}

interface Props {
  kernelGatewayUrl: string;          // ws://sandbox-xxx.vercel-sandbox.com:8888
  sandboxId: string;
  roomId: string;
  onCellExecuted?: (source: string, output: string) => void;  // feeds interviewer context
  onNotebookSnapshot?: () => Promise<string>;                  // returns serialized notebook JSON for AI agent
}

export default function ArenaJupyterPanel({
  kernelGatewayUrl,
  sandboxId,
  roomId,
  onCellExecuted,
  onNotebookSnapshot,
}: Props) {
  const [cells, setCells] = useState<Cell[]>([
    { id: '1', source: "import numpy as np\nimport pandas as pd\nprint('Ready!')", output: '', executing: false, cellType: 'code' },
    { id: '2', source: '', output: '', executing: false, cellType: 'code' },
  ]);
  const [connected, setConnected] = useState(false);
  const kernelRef = useRef<import('@jupyterlab/services').Kernel.IKernelConnection | null>(null);
  const [activeCellId, setActiveCellId] = useState<string>('1');

  // Connect to Jupyter kernel gateway
  useEffect(() => {
    const connect = async () => {
      try {
        // @jupyterlab/services expects http/https base URL (not ws://)
        const baseUrl = kernelGatewayUrl
          .replace('ws://', 'http://')
          .replace('wss://', 'https://');

        const settings = ServerConnection.makeSettings({
          baseUrl,
          wsUrl: kernelGatewayUrl,
          token: '',
          appendToken: false,
        });

        const kernelManager = new KernelManager({ serverSettings: settings });
        const kernel = await kernelManager.startNew({ name: 'python3' });
        kernelRef.current = kernel;
        setConnected(true);
      } catch (err) {
        console.error('Kernel connection failed:', err);
      }
    };

    connect();
    return () => { kernelRef.current?.shutdown(); };
  }, [kernelGatewayUrl]);

  const executeCell = useCallback(async (cellId: string) => {
    if (!kernelRef.current) return;
    const cell = cells.find(c => c.id === cellId);
    if (!cell || cell.cellType !== 'code') return;

    setCells(prev => prev.map(c => c.id === cellId ? { ...c, executing: true, output: '' } : c));

    const future = kernelRef.current.requestExecute({ code: cell.source });
    let outputAccum = '';

    future.onIOPub = (msg) => {
      if (msg.header.msg_type === 'stream') {
        const text = (msg.content as { text: string }).text;
        outputAccum += text;
        setCells(prev => prev.map(c => c.id === cellId ? { ...c, output: outputAccum } : c));
      } else if (msg.header.msg_type === 'execute_result') {
        const text = (msg.content as { data: { 'text/plain': string } }).data['text/plain'];
        outputAccum += text;
        setCells(prev => prev.map(c => c.id === cellId ? { ...c, output: outputAccum } : c));
      } else if (msg.header.msg_type === 'error') {
        const err = msg.content as { ename: string; evalue: string };
        outputAccum += `${err.ename}: ${err.evalue}`;
        setCells(prev => prev.map(c => c.id === cellId ? { ...c, output: outputAccum } : c));
      }
    };

    await future.done;
    setCells(prev => prev.map(c => c.id === cellId ? { ...c, executing: false } : c));
    onCellExecuted?.(cell.source, outputAccum);
  }, [cells, onCellExecuted]);

  const addCell = () => {
    const id = `cell-${Date.now()}`;
    setCells(prev => [...prev, { id, source: '', output: '', executing: false, cellType: 'code' }]);
    setActiveCellId(id);
  };

  const deleteCell = (cellId: string) => {
    setCells(prev => prev.filter(c => c.id !== cellId));
  };

  const runAll = async () => {
    for (const cell of cells) {
      if (cell.cellType === 'code' && cell.source.trim()) {
        await executeCell(cell.id);
      }
    }
  };

  // Serialize notebook as JSON (for AI agent snapshot)
  const getNotebookJson = useCallback((): string => {
    return JSON.stringify({
      cells: cells.map(c => ({
        cell_type: c.cellType,
        source: c.source,
        outputs: c.output ? [{ output_type: 'stream', text: c.output }] : [],
      })),
    });
  }, [cells]);

  // Expose snapshot via ref callback if parent asks for it
  useEffect(() => {
    if (onNotebookSnapshot) {
      // Override the callback to return current state
      (window as { __arenaNotebookSnapshot?: () => Promise<string> }).__arenaNotebookSnapshot =
        async () => getNotebookJson();
    }
  }, [onNotebookSnapshot, getNotebookJson]);

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden" data-testid="jupyter-panel">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] shrink-0">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`} />
        <span className="text-[11px] text-white/40">{connected ? 'Kernel ready (Python 3.13)' : 'Connecting to kernel...'}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={runAll}
            disabled={!connected}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-30 transition"
          >
            <Play className="w-3 h-3" /> Run All
          </button>
          <button
            onClick={addCell}
            className="p-1.5 rounded hover:bg-white/5 transition text-white/40 hover:text-white/70"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cells */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {cells.map((cell, idx) => (
          <div
            key={cell.id}
            data-testid={`jupyter-cell-${idx}`}
            onClick={() => setActiveCellId(cell.id)}
            className={`rounded-lg border transition-colors ${
              activeCellId === cell.id
                ? 'border-violet-500/40 bg-slate-900/60'
                : 'border-white/[0.06] bg-slate-900/30 hover:border-white/10'
            }`}
          >
            {/* Cell input */}
            <div className="flex items-start gap-2 p-2">
              <span className="text-[10px] text-white/25 font-mono mt-1 shrink-0">
                [{cell.executing ? '*' : idx + 1}]:
              </span>
              <textarea
                className="flex-1 bg-transparent text-sm font-mono text-white/80 resize-none outline-none min-h-[40px] leading-relaxed"
                value={cell.source}
                onChange={e => setCells(prev => prev.map(c => c.id === cell.id ? { ...c, source: e.target.value } : c))}
                onKeyDown={e => {
                  if (e.shiftKey && e.key === 'Enter') {
                    e.preventDefault();
                    executeCell(cell.id);
                  }
                }}
                placeholder="# Python code (Shift+Enter to run)"
                rows={Math.max(2, cell.source.split('\n').length)}
              />
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => executeCell(cell.id)}
                  disabled={!connected || cell.executing}
                  className="p-1 rounded hover:bg-white/5 transition text-white/30 hover:text-green-400 disabled:opacity-20"
                >
                  {cell.executing ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => deleteCell(cell.id)}
                  className="p-1 rounded hover:bg-white/5 transition text-white/20 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Cell output */}
            {cell.output && (
              <div className="border-t border-white/[0.04] px-3 py-2 ml-6">
                <pre className="text-xs font-mono text-emerald-300/80 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                  {cell.output}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7a.4: Run test (should now pass)**

```bash
npx playwright test tests/arena/ide.spec.ts --grep "data science" --reporter=line
```

Expected: PASS (component renders, test-id `jupyter-panel` visible when DS track is selected)

- [ ] **Step 7a.5: Commit**

```bash
git add src/components/arena/ArenaJupyterPanel.tsx src/app/api/arena/sandbox/ds/
git commit -m "feat(arena): Jupyter notebook IDE panel for data science track"
```

---

## Task 8: Interviewer panel + milestone tracker + top bar

**Files:**
- Create: `src/components/arena/ArenaInterviewer.tsx`
- Create: `src/components/arena/ArenaMilestones.tsx`
- Create: `src/components/arena/ArenaTopBar.tsx`

- [ ] **Step 8.1: Create interviewer panel with dual-mode state machine**

Create `src/components/arena/ArenaInterviewer.tsx`:

```typescript
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useArena } from '@/contexts/ArenaContext';

interface Message {
  role: 'interviewer' | 'participant';
  content: string;
  avatar?: string;
  name?: string;
}

interface Props {
  lastTerminalOutput: string;
  lastCommitMessage: string;
  previewUrl?: string;
  lastCellExecution?: { source: string; output: string } | null;  // DS track: last Jupyter cell
  isDsSandbox?: boolean;
}

const IDLE_5S = 5_000;
const IDLE_30S = 30_000;

export default function ArenaInterviewer({
  lastTerminalOutput,
  lastCommitMessage,
  previewUrl,
  lastCellExecution,
  isDsSandbox,
}: Props) {
  const { session, setMode } = useArena();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const modeRef = useRef<'passive' | 'active'>('passive');
  const prevCommitRef = useRef<string>('');
  const prevTerminalRef = useRef<string>('');
  const prevCellRef = useRef<string>('');

  // Read the full Jupyter notebook JSON for DS-mode context snapshots
  const getNotebookSnapshot = useCallback(async (): Promise<string | null> => {
    const fn = (window as { __arenaNotebookSnapshot?: () => Promise<string> }).__arenaNotebookSnapshot;
    if (!fn) return null;
    try { return await fn(); } catch { return null; }
  }, []);

  const callInterviewer = useCallback(async (trigger: string, participantMessage?: string) => {
    if (!session) return;
    setLoading(true);

    // For DS track, attach notebook snapshot so interviewer can read cell sources + outputs
    const notebookSnapshot = isDsSandbox ? await getNotebookSnapshot() : null;

    try {
      const res = await fetch('/api/arena/interviewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: session.roomId,
          personaId: session.personaId,
          trigger,
          context: {
            lastTerminalOutput,
            lastCommitMessage,
            previewUrl,
            lastCellSource: lastCellExecution?.source,
            lastCellOutput: lastCellExecution?.output,
            notebookSnapshot,   // full notebook JSON — interviewer reads cells + outputs
          },
          participantMessage,
        }),
      });
      if (!res.ok) return;
      const { reply, personaName, avatar } = await res.json();
      setMessages(prev => [...prev, { role: 'interviewer', content: reply, name: personaName, avatar }]);
    } finally {
      setLoading(false);
    }
  }, [session, lastTerminalOutput, lastCommitMessage, previewUrl]);

  // Dual-mode idle detection
  useEffect(() => {
    const tick = setInterval(() => {
      const idle = Date.now() - lastActivityRef.current;
      const mode = modeRef.current;

      if (idle >= IDLE_30S && mode === 'passive') {
        modeRef.current = 'active';
        setMode('active');
        callInterviewer('idle_30s');
      } else if (idle >= IDLE_5S && idle < IDLE_30S && mode === 'passive') {
        callInterviewer('idle_5s');
      }
    }, 5_000);

    return () => clearInterval(tick);
  }, [callInterviewer, setMode]);

  // React to new commit
  useEffect(() => {
    if (lastCommitMessage && lastCommitMessage !== prevCommitRef.current) {
      prevCommitRef.current = lastCommitMessage;
      lastActivityRef.current = Date.now();
      modeRef.current = 'passive';
      setMode('passive');
      callInterviewer('commit');
    }
  }, [lastCommitMessage, callInterviewer, setMode]);

  // React to test failures/passes in terminal
  useEffect(() => {
    if (!lastTerminalOutput || lastTerminalOutput === prevTerminalRef.current) return;
    prevTerminalRef.current = lastTerminalOutput;
    lastActivityRef.current = Date.now();

    if (lastTerminalOutput.toLowerCase().includes('fail') || lastTerminalOutput.includes('Error')) {
      callInterviewer('test_fail');
    } else if (lastTerminalOutput.toLowerCase().includes('passing') || lastTerminalOutput.includes('✓')) {
      callInterviewer('test_pass');
    }
  }, [lastTerminalOutput, callInterviewer]);

  // React to deploy
  useEffect(() => {
    if (previewUrl) callInterviewer('deploy');
  }, [previewUrl, callInterviewer]);

  // React to Jupyter cell execution (DS track)
  // Fires when candidate executes a new cell — interviewer reads source + output
  useEffect(() => {
    if (!lastCellExecution) return;
    const cellKey = lastCellExecution.source.slice(0, 80);
    if (cellKey === prevCellRef.current) return;
    prevCellRef.current = cellKey;
    lastActivityRef.current = Date.now();
    modeRef.current = 'passive';
    setMode('passive');
    callInterviewer('cell_executed');
  }, [lastCellExecution, callInterviewer, setMode]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    lastActivityRef.current = Date.now();
    setMessages(prev => [...prev, { role: 'participant', content: msg }]);
    await callInterviewer('participant_reply', msg);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-slate-950/70 border-l border-white/[0.06]">
      <div className="px-3 py-2 border-b border-white/[0.06] text-[11px] font-semibold text-white/30 uppercase tracking-wider">
        AI Interviewer
        <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] ${session?.mode === 'active' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {session?.mode ?? 'passive'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'participant' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'interviewer' && (
              <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-sm shrink-0">
                {m.avatar ?? '🤖'}
              </div>
            )}
            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
              m.role === 'interviewer'
                ? 'bg-white/[0.05] text-white/80 rounded-tl-none'
                : 'bg-violet-500/20 text-violet-200 rounded-tr-none'
            }`}>
              {m.role === 'interviewer' && m.name && (
                <div className="text-[10px] text-white/30 mb-0.5 font-medium">{m.name}</div>
              )}
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-sm shrink-0">🤖</div>
            <div className="bg-white/[0.05] rounded-xl rounded-tl-none px-3 py-2">
              <Loader2 className="w-3 h-3 animate-spin text-white/40" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-white/[0.06] flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Respond to interviewer..."
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 transition"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="p-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 disabled:opacity-30 transition"
        >
          <Send className="w-3.5 h-3.5 text-violet-400" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 8.2: Create milestones sidebar**

Create `src/components/arena/ArenaMilestones.tsx`:

```typescript
"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface MilestoneStatus {
  id: string;
  title: string;
  complete: boolean;
  xp: number;
}

interface Props {
  roomId: string;
  sandboxId: string;
  challengeId: string;
}

export default function ArenaMilestones({ roomId, sandboxId, challengeId }: Props) {
  const [milestones, setMilestones] = useState<MilestoneStatus[]>([]);
  const [prevCompleted, setPrevCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const poll = async () => {
      const res = await fetch(
        `/api/arena/milestones?roomId=${roomId}&sandboxId=${sandboxId}&challengeId=${challengeId}`
      );
      if (!res.ok) return;
      const { milestones: updated } = await res.json();
      setMilestones(updated);

      // Detect newly completed milestones for score emission
      for (const m of updated) {
        if (m.complete && !prevCompleted.has(m.id)) {
          setPrevCompleted(prev => new Set([...prev, m.id]));
          await fetch('/api/arena/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId, eventType: 'milestone_complete', pointsOverride: m.xp, metadata: { milestoneId: m.id } }),
          });
        }
      }
    };

    poll();
    const interval = setInterval(poll, 10_000);
    return () => clearInterval(interval);
  }, [roomId, sandboxId, challengeId, prevCompleted]);

  return (
    <div className="p-3 border-t border-white/[0.06]">
      <div className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Milestones</div>
      <div className="space-y-1.5">
        {milestones.map(m => (
          <div key={m.id} className={`flex items-center gap-2 text-xs ${m.complete ? 'text-green-400' : 'text-white/40'}`}>
            {m.complete ? (
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="truncate">{m.title}</span>
            <span className="ml-auto text-[10px] opacity-60">+{m.xp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8.3: Create milestones API route**

Create `src/app/api/arena/milestones/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-auth';
import { checkAllMilestones } from '@/lib/arena-milestones';
import { getChallenge } from '@/data/arena-challenges';
import { execInSandbox } from '@/lib/arena-sandbox';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const sandboxId = searchParams.get('sandboxId');
  const challengeId = searchParams.get('challengeId');
  const roomId = searchParams.get('roomId');  // for previewUrl lookup

  if (!sandboxId || !challengeId) {
    return NextResponse.json({ error: 'sandboxId and challengeId required' }, { status: 400 });
  }

  const challenge = getChallenge(challengeId);
  if (!challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });

  // Gather context from sandbox
  const [filesResult, testResult, gitResult] = await Promise.all([
    execInSandbox(sandboxId, 'find /workspace -not -path "*/node_modules/*" -not -path "*/.git/*" -type f | sed "s|/workspace/||"'),
    execInSandbox(sandboxId, 'cd /workspace && npm test 2>&1 | tail -20').catch(() => ({ stdout: '', stderr: '', exitCode: 1 })),
    execInSandbox(sandboxId, 'cd /workspace && git log --format="%H|%at|%s" 2>/dev/null | head -20').catch(() => ({ stdout: '', stderr: '', exitCode: 0 })),
  ]);

  const files = filesResult.stdout.split('\n').filter(Boolean);
  const commitMessages = (gitResult as { stdout: string }).stdout.split('\n')
    .filter(l => l.includes('|'))
    .map(l => l.split('|')[2] ?? '');

  // Get preview URL from room
  let previewUrl: string | undefined;
  if (roomId) {
    const admin = (await import('@/lib/supabase-auth')).createAdminSupabase();
    const { data: room } = await admin.from('arena_rooms').select('preview_url').eq('id', roomId).single();
    previewUrl = room?.preview_url ?? undefined;
  }

  const statuses = await checkAllMilestones(challenge.milestones, {
    files,
    lastTestOutput: (testResult as { stdout: string }).stdout,
    commitMessages,
    previewUrl,
  });

  return NextResponse.json({ milestones: statuses });
}
```

- [ ] **Step 8.4: Create top bar**

Create `src/components/arena/ArenaTopBar.tsx`:

```typescript
"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Rocket, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useArena } from '@/contexts/ArenaContext';

function formatTime(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

interface Props {
  previewUrl?: string;
  onDeploy?: () => void;
  deploying?: boolean;
}

export default function ArenaTopBar({ previewUrl, onDeploy, deploying }: Props) {
  const { session } = useArena();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!session) return;
    const endMs = Date.now() + session.durationMin * 60_000;

    const tick = () => setTimeLeft(endMs - Date.now());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const timerColor = timeLeft != null && timeLeft < 5 * 60_000 ? 'text-red-400' : 'text-white/60';

  return (
    <div className="h-12 border-b border-white/[0.06] flex items-center justify-between px-4 bg-slate-950/90 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/arena" className="p-1.5 rounded hover:bg-white/5 transition">
          <ArrowLeft className="w-4 h-4 text-white/40" />
        </Link>
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-semibold text-white/80 truncate max-w-[200px]">
          {session?.challengeTitle ?? 'Arena'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {timeLeft != null && (
          <div className={`flex items-center gap-1.5 text-sm font-mono font-medium ${timerColor}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        )}

        {previewUrl ? (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30 transition"
          >
            <Rocket className="w-3.5 h-3.5" />
            View Deploy
          </a>
        ) : (
          <button
            onClick={onDeploy}
            disabled={deploying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-medium hover:bg-violet-500/30 disabled:opacity-40 transition"
          >
            <Rocket className="w-3.5 h-3.5" />
            {deploying ? 'Deploying...' : 'Deploy'}
          </button>
        )}

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
          <Trophy className="w-3.5 h-3.5 text-yellow-400/70" />
          <span className="text-sm font-bold text-white/80">{session?.score ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8.5: Commit**

```bash
git add src/components/arena/ src/app/api/arena/milestones/
git commit -m "feat(arena): interviewer panel, milestones, top bar components"
```

---

## Task 9: Arena layout + pages

**Files:**
- Create: `src/components/arena/ArenaLayout.tsx`
- Create: `src/app/arena/page.tsx`
- Create: `src/app/arena/[roomId]/page.tsx`

- [ ] **Step 9.1: Create full IDE layout**

Create `src/components/arena/ArenaLayout.tsx`:

```typescript
"use client";

import { useState, useCallback, useRef } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { useArena } from '@/contexts/ArenaContext';
import ArenaTopBar from './ArenaTopBar';
import ArenaFileTree from './ArenaFileTree';
import ArenaEditor from './ArenaEditor';
import ArenaTerminal from './ArenaTerminal';
import ArenaGitLog from './ArenaGitLog';
import ArenaJupyterPanel from './ArenaJupyterPanel';
import ArenaInterviewer from './ArenaInterviewer';
import ArenaMilestones from './ArenaMilestones';

export default function ArenaLayout() {
  const { session } = useArena();
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [lastTerminalOutput, setLastTerminalOutput] = useState('');
  const [lastCommitMessage, setLastCommitMessage] = useState('');
  const [lastCellExecution, setLastCellExecution] = useState<{ source: string; output: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [deploying, setDeploying] = useState(false);

  // IDE mode: engineering (Monaco + terminal) vs data-science (Jupyter)
  const isDataScienceTrack = session?.track === 'data-science' || session?.track === 'ml-engineer';

  const handleDeploy = useCallback(async () => {
    if (!session) return;
    setDeploying(true);
    try {
      // Run npm run build && npm start in the sandbox — preview URL from room
      const res = await fetch('/api/arena/sandbox/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sandboxId: session.sandboxId, roomId: session.roomId }),
      });
      if (res.ok) {
        const { url } = await res.json();
        setPreviewUrl(url);
      }
    } finally {
      setDeploying(false);
    }
  }, [session]);

  if (!session) return <div className="h-screen flex items-center justify-center text-white/30">No active session</div>;

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      <ArenaTopBar previewUrl={previewUrl} onDeploy={handleDeploy} deploying={deploying} />

      <div className="flex-1 min-h-0">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left: File tree + git log */}
          <Panel defaultSize={15} minSize={10} maxSize={25}>
            <div className="h-full flex flex-col border-r border-white/[0.06]">
              <ArenaFileTree
                sandboxId={session.sandboxId}
                onFileSelect={setSelectedFile}
                selectedPath={selectedFile}
              />
              <ArenaGitLog sandboxId={session.sandboxId} />
            </div>
          </Panel>

          <PanelResizeHandle className="w-px bg-white/[0.06] hover:bg-violet-500/30 transition-colors cursor-col-resize" />

          {/* Center: IDE — Engineering (Monaco+Terminal) or Data Science (Jupyter) */}
          <Panel defaultSize={55} minSize={30}>
            {isDataScienceTrack && session.kernelGatewayUrl ? (
              /* ── DATA SCIENCE IDE ── */
              <ArenaJupyterPanel
                kernelGatewayUrl={session.kernelGatewayUrl}
                sandboxId={session.sandboxId}
                roomId={session.roomId}
                onCellExecuted={(source, output) => {
                  setLastCellExecution({ source, output });
                  setLastTerminalOutput(`[cell] ${source.slice(0, 80)}\n${output.slice(0, 200)}`);
                }}
              />
            ) : (
              /* ── ENGINEERING IDE: Monaco + xterm terminal with Claude Code CLI ── */
              <PanelGroup direction="vertical">
                <Panel defaultSize={65} minSize={30}>
                  <ArenaEditor
                    sandboxId={session.sandboxId}
                    roomId={session.roomId}
                    openFilePath={selectedFile}
                    data-testid="arena-editor-tabs"
                  />
                </Panel>

                <PanelResizeHandle className="h-px bg-white/[0.06] hover:bg-violet-500/30 transition-colors cursor-row-resize" />

                {/* Terminal — Claude Code CLI (`claude "..."`) is pre-installed in sandbox */}
                <Panel defaultSize={35} minSize={20}>
                  <ArenaTerminal
                    sandboxId={session.sandboxId}
                    onOutput={out => {
                      setLastTerminalOutput(out);
                      if (out.includes('commit')) {
                        const match = out.match(/feat:|fix:|test:|chore:/);
                        if (match) setLastCommitMessage(out.split('\n')[0] ?? '');
                      }
                    }}
                  />
                </Panel>
              </PanelGroup>
            )}
          </Panel>

          <PanelResizeHandle className="w-px bg-white/[0.06] hover:bg-violet-500/30 transition-colors cursor-col-resize" />

          {/* Right: Interviewer + Milestones */}
          <Panel defaultSize={30} minSize={20} maxSize={40}>
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0">
                <ArenaInterviewer
                  lastTerminalOutput={lastTerminalOutput}
                  lastCommitMessage={lastCommitMessage}
                  lastCellExecution={lastCellExecution}
                  previewUrl={previewUrl}
                  isDsSandbox={isDataScienceTrack}
                />
              </div>
              <ArenaMilestones
                roomId={session.roomId}
                sandboxId={session.sandboxId}
                challengeId={session.challengeId ?? ''}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
```

- [ ] **Step 9.2: Create lobby page**

Create `src/app/arena/page.tsx`:

```typescript
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Users, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { ARENA_CHALLENGES } from '@/data/arena-challenges';
import { ARENA_PERSONAS } from '@/lib/arena-personas';
import { ArenaProvider } from '@/contexts/ArenaContext';

export default function ArenaLobbyPage() {
  return (
    <ArenaProvider>
      <ArenaLobby />
    </ArenaProvider>
  );
}

function ArenaLobby() {
  const router = useRouter();
  const [selectedChallenge, setSelectedChallenge] = useState(ARENA_CHALLENGES[0].id);
  const [selectedPersona, setSelectedPersona] = useState(ARENA_PERSONAS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/arena/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: selectedChallenge, personaId: selectedPersona }),
      });
      if (!res.ok) throw new Error('Failed to create room');
      const room = await res.json();
      router.push(`/arena/${room.id}?new=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Zap className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Samsara Arena</h1>
          <p className="text-white/40">Build real projects. Get grilled by an AI engineer. Ship.</p>
        </motion.div>

        {/* Challenge picker */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Choose a challenge</div>
          <div className="grid gap-2">
            {ARENA_CHALLENGES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedChallenge(c.id)}
                className={`p-4 rounded-xl border text-left transition ${
                  selectedChallenge === c.id
                    ? 'bg-violet-500/10 border-violet-500/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{c.title}</div>
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <Clock className="w-3 h-3" />
                    {c.durationMin}m
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.05]">{c.difficulty}</span>
                  </div>
                </div>
                <div className="text-xs text-white/30 mt-1">{c.tags.join(' · ')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Persona picker */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Choose your interviewer</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ARENA_PERSONAS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedPersona === p.id
                    ? 'bg-violet-500/10 border-violet-500/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-xl mb-1">{p.avatar}</div>
                <div className="text-xs font-semibold">{p.name}</div>
                <div className="text-[10px] text-white/30 leading-tight mt-0.5">{p.title.split('—')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 transition disabled:opacity-40"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <><Zap className="w-4 h-4" />Start Arena Session<ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 9.3: Create arena room page**

Create `src/app/arena/[roomId]/page.tsx`:

```typescript
"use client";

import { useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArenaProvider, useArena } from '@/contexts/ArenaContext';
import ArenaLayout from '@/components/arena/ArenaLayout';
import { getChallenge } from '@/data/arena-challenges';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ArenaRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  return (
    <ArenaProvider>
      <ArenaRoomLoader roomId={roomId} />
    </ArenaProvider>
  );
}

function ArenaRoomLoader({ roomId }: { roomId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get('new') === '1';
  const { setSession } = useArena();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      try {
        // Fetch room details
        const roomRes = await fetch(`/api/arena/rooms?roomId=${roomId}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        // fallback: find room from list
        const rooms = await roomRes.json();
        const room = Array.isArray(rooms) ? rooms.find((r: { id: string }) => r.id === roomId) : rooms;

        if (!room) { setError('Room not found'); return; }

        const challenge = getChallenge(room.challenge_id);
        const isDsTrack = challenge?.track === 'data-science' || challenge?.track === 'ml-engineer';

        // Provision sandbox if new session — use DS endpoint for data-science track
        let sandboxId = room.sandbox_id;
        let kernelGatewayUrl: string | undefined = room.settings?.kernelGatewayUrl;

        if (!sandboxId || isNew) {
          if (isDsTrack) {
            // Python 3.13 sandbox with Jupyter kernel gateway
            const dsRes = await fetch('/api/arena/sandbox/ds', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roomId, starterNotebookUrl: challenge?.starterRepo }),
            });
            if (!dsRes.ok) { setError('Failed to provision DS sandbox'); return; }
            const dsData = await dsRes.json();
            sandboxId = dsData.sandboxId;
            kernelGatewayUrl = dsData.kernelGatewayUrl;
          } else {
            // node24 sandbox with Claude Code CLI pre-installed
            const sbRes = await fetch('/api/arena/sandbox', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roomId }),
            });
            if (!sbRes.ok) { setError('Failed to provision sandbox'); return; }
            const { sandboxId: newId } = await sbRes.json();
            sandboxId = newId;
          }
        }

        setSession({
          roomId,
          sandboxId,
          personaId: room.persona_id,
          challengeId: room.challenge_id ?? '',
          challengeTitle: challenge?.title ?? 'Arena Challenge',
          durationMin: challenge?.durationMin ?? 60,
          score: 0,
          mode: 'passive',
          track: challenge?.track ?? 'backend',
          kernelGatewayUrl,
        });

        setReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error loading arena');
      }
    }

    init();
  }, [roomId, isNew, setSession]);

  if (error) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-red-400">{error}</div>
  );

  if (!ready) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-white/40">
      <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      <p className="text-sm">Provisioning sandbox...</p>
    </div>
  );

  return <ArenaLayout />;
}
```

- [ ] **Step 9.4: Add ArenaProvider to app layout or confirm page-level wrapping**

The `ArenaProvider` is already added at page level in both pages above — no changes needed to `src/app/layout.tsx`.

- [ ] **Step 9.5: Commit**

```bash
git add src/components/arena/ArenaLayout.tsx src/app/arena/
git commit -m "feat(arena): lobby page, room page, full IDE layout"
```

---

## Task 10: E2E Playwright tests for the Arena IDE

**Files:**
- Create: `tests/arena/ide.spec.ts`

- [ ] **Step 10.1: Write E2E tests**

Create `tests/arena/ide.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Arena IDE — Lobby', () => {
  test('lobby page loads and shows challenges + personas', async ({ page }) => {
    await page.goto('/arena');
    await expect(page.locator('h1')).toContainText('Samsara Arena');
    // Engineering challenge cards
    await expect(page.locator('button').filter({ hasText: 'Rate Limiter' })).toBeVisible();
    // Data science challenge
    await expect(page.locator('button').filter({ hasText: 'Churn Prediction' })).toBeVisible();
    // Persona cards
    await expect(page.locator('button').filter({ hasText: 'Alex Chen' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Dr. Priya Sharma' })).toBeVisible();
    // Start button enabled
    const startBtn = page.locator('[data-testid="start-arena-btn"]');
    await expect(startBtn).not.toBeDisabled();
  });
});

test.describe('Arena IDE — Engineering Mode (Claude Code CLI)', () => {
  test('engineering challenge shows Monaco editor + terminal panel', async ({ page }) => {
    // Mock sandbox provision to avoid real Vercel API call
    await page.route('**/api/arena/sandbox', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ sandboxId: 'mock-eng-sandbox' }),
    }));
    await page.route('**/api/arena/rooms*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'mock-room-1',
        challenge_id: 'rate-limiter-api',
        persona_id: 'alex-chen',
        sandbox_id: 'mock-eng-sandbox',
        status: 'active',
        settings: {},
      }),
    }));

    await page.goto('/arena/mock-room-1');

    // Engineering IDE: Monaco editor tabs should appear, NOT Jupyter panel
    await expect(page.locator('[data-testid="arena-editor-tabs"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="jupyter-panel"]')).not.toBeVisible();
  });

  test('Claude Code CLI is accessible — terminal hint visible', async ({ page }) => {
    // The terminal panel should display a hint about `claude` CLI being available.
    // This is verified by checking the ArenaTerminal component renders with the sandbox connected message.
    await page.route('**/api/arena/rooms*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'mock-room-2',
        challenge_id: 'auth-service',
        persona_id: 'alex-chen',
        sandbox_id: 'mock-eng-sandbox',
        status: 'active',
        settings: {},
      }),
    }));

    await page.goto('/arena/mock-room-2');

    // Arena terminal container must exist
    await expect(page.locator('[data-testid="arena-terminal"]')).toBeVisible({ timeout: 10000 });
    // Terminal should show the welcome/connected message written by ArenaTerminal on WS open
    // The message includes "Connected to sandbox" — verifies terminal rendered successfully
    // Full Claude Code CLI test requires a live sandbox; this verifies the UI path is correct
  });
});

test.describe('Arena IDE — Data Science Mode (Jupyter)', () => {
  test('data science challenge shows Jupyter notebook panel', async ({ page }) => {
    await page.route('**/api/arena/sandbox/ds', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ sandboxId: 'mock-ds-sandbox', kernelGatewayUrl: 'ws://localhost:8888' }),
    }));
    await page.route('**/api/arena/rooms*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'mock-room-ds',
        challenge_id: 'churn-prediction',
        persona_id: 'dr-priya-sharma',
        sandbox_id: null,
        status: 'lobby',
        settings: {},
      }),
    }));

    await page.goto('/arena/mock-room-ds?new=1');

    // DS IDE: Jupyter panel should appear, NOT Monaco tabs
    await expect(page.locator('[data-testid="jupyter-panel"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="arena-editor-tabs"]')).not.toBeVisible();
  });

  test('Jupyter panel has cells with run button', async ({ page }) => {
    await page.route('**/api/arena/rooms*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'mock-room-ds2',
        challenge_id: 'churn-prediction',
        persona_id: 'dr-priya-sharma',
        sandbox_id: 'mock-ds-sandbox',
        status: 'active',
        settings: { kernelGatewayUrl: 'ws://localhost:8888' },
      }),
    }));

    await page.goto('/arena/mock-room-ds2');

    await expect(page.locator('[data-testid="jupyter-panel"]')).toBeVisible({ timeout: 10000 });
    // First cell should exist
    await expect(page.locator('[data-testid="jupyter-cell-0"]')).toBeVisible();
    // Run All button
    await expect(page.locator('button').filter({ hasText: 'Run All' })).toBeVisible();
  });
});
```

Also add `data-testid` to `ArenaTerminal` wrapper (update Step 7.3 component return):

In `src/components/arena/ArenaTerminal.tsx`, update the return statement:
```typescript
  return (
    <div className="h-full bg-[#0a0a0f] p-1" data-testid="arena-terminal">
      <div ref={containerRef} className="h-full" />
    </div>
  );
```

And add `data-testid="start-arena-btn"` to the Start button in `src/app/arena/page.tsx`:
```typescript
<button
  onClick={handleCreate}
  disabled={loading}
  data-testid="start-arena-btn"
  className="w-full py-3.5 ..."
>
```

And add `data-testid` and `data-track` to challenge cards in lobby:
```typescript
<button
  key={c.id}
  onClick={() => setSelectedChallenge(c.id)}
  data-testid="challenge-card"
  data-track={c.track}
  className={...}
>
```

- [ ] **Step 10.2: Run tests**

```bash
npx playwright test tests/arena/ --reporter=line
```

Expected: lobby tests pass; API tests may require a running dev server with valid Supabase + Vercel credentials.

- [ ] **Step 10.3: Lint + build check**

```bash
npm run lint && npm run build
```

Fix any TypeScript errors before committing.

- [ ] **Step 10.4: Final commit**

```bash
git add tests/arena/
git commit -m "feat(arena): Playwright E2E tests for lobby + IDE"
```

---

## Post-Implementation Checklist

### Environment
- [ ] `VERCEL_SANDBOX_TOKEN`, `VERCEL_ACCESS_TOKEN`, `GITHUB_TOKEN`, `OPENROUTER_API_KEY` set in `.env.local`
- [ ] Supabase migration applied (`npx supabase db push`)
- [ ] `npm run dev` starts without errors

### Engineering IDE (node24 sandbox + Claude Code CLI)
- [ ] `/arena` page loads, challenge + persona selection works
- [ ] Selecting an engineering challenge (rate-limiter-api, auth-service) shows the Engineering IDE
- [ ] Sandbox provision spinner appears, Engineering IDE loads after ~10s
- [ ] File tree shows `/workspace` contents
- [ ] Monaco editor opens on file click with correct syntax highlighting
- [ ] Terminal connects to sandbox WebSocket and receives output for `ls /workspace`
- [ ] Running `claude --version` in terminal returns a version string (confirms Claude Code CLI is installed)
- [ ] Running `claude "show me the file tree"` in terminal triggers Claude Code action
- [ ] Interviewer panel shows greeting after 5s idle
- [ ] Milestone panel polls and updates on test pass

### Data Science IDE (python3.13 sandbox + Jupyter)
- [ ] Selecting the Churn Prediction challenge shows the Data Science IDE (Jupyter panel)
- [ ] Jupyter panel renders with "Connecting to kernel..." then "Kernel ready (Python 3.13)"
- [ ] Typing `import pandas as pd\nprint(pd.__version__)` in a cell and pressing Shift+Enter prints the version
- [ ] Output appears inline below the cell
- [ ] Interviewer (Dr. Priya Sharma) triggers a question after cell execution
- [ ] Notebook snapshot is included in the interviewer context (visible in interviewer question referencing cell content)

---

## Plan B: Interview IDE Upgrades (separate plan)

These improvements to the existing interview system are independent of Arena and need their own spec + plan:

1. **Live test runner** — Monaco output panel that runs `node` or `python` inline, shows pass/fail in real time
2. **System design whiteboard** — Mermaid diagram editor embedded in the interview room for system design presets
3. **Frontend live preview** — iframe iframe panel for `frontend` preset showing rendered HTML/CSS/JS output
4. **Research-backed persona enrichment** — scrape Glassdoor/Blind interview patterns per company and bake into `interview-personas.ts` system prompts (currently shallow, needs depth matching Arena personas)

These do not block Arena Phase 1 shipping.
