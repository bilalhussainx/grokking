# Samsara.ai — Platform Context & Implementation Guide

> **Last updated:** 2026-03-15
> **Brand:** Samsara.ai (formerly "Grokking")
> **Status:** Active development — skill files complete, MCP server built, core platform operational

This file gives every AI session (Claude, Kimi, or other) full context on where the platform
is, what needs building, and exactly how to build it.

**If you are Kimi Code:** Also read `docs/KIMI_HANDOFF.md` — it has step-by-step instructions
for creating content using the MCP server and skill files without Claude.

**Skill files to read before creating ANY content:**
1. `skills/content-orchestrator/SKILL.md` — Master quality pipeline
2. `skills/course-planning/SKILL.md` — Course structure
3. `skills/lesson-planning/SKILL.md` — Lesson templates
4. `skills/cs-exercises/SKILL.md` — Code exercises (CS courses)
5. `skills/video-generation/SKILL.md` — Remotion video pipeline
6. `skills/content-embedding/SKILL.md` — Embeddings and search

---

## gstack

This project uses [gstack](https://github.com/garrytan/gstack) — a bundle of
review, ship, design, and browser-automation skills installed at
`~/.claude/skills/gstack/`.

**Web browsing rule:**
- For **all** web browsing — opening pages, interacting with elements,
  taking screenshots, dogfooding flows, verifying deploys — use the
  `/browse` skill from gstack.
- **Never** use `mcp__claude-in-chrome__*` tools. They are deprecated in
  favor of gstack's headless browser, which is faster, deterministic, and
  produces AI-readable snapshots.

**Available gstack skills** (invoke with `/<name>`):

`/office-hours` · `/plan-ceo-review` · `/plan-eng-review` ·
`/plan-design-review` · `/design-consultation` · `/design-shotgun` ·
`/design-html` · `/review` · `/ship` · `/land-and-deploy` · `/canary` ·
`/benchmark` · `/browse` · `/connect-chrome` · `/qa` · `/qa-only` ·
`/design-review` · `/setup-browser-cookies` · `/setup-deploy` ·
`/setup-gbrain` · `/retro` · `/investigate` · `/document-release` ·
`/codex` · `/cso` · `/autoplan` · `/plan-devex-review` · `/devex-review` ·
`/careful` · `/freeze` · `/guard` · `/unfreeze` · `/gstack-upgrade` ·
`/learn`

Run `/gstack-upgrade` periodically to pull updates.

---

## What Samsara.ai Is

A Next.js 14 learning platform with:
- **50+ courses** across CS, Finance, Economics, Religious Studies, Philosophy, Political Strategy, Health & Wellness
- **AI voice coaching** (Deepgram WebSocket for 7 languages, Sarvam orchestrated for Hindi/Punjabi)
- **Gamification** (XP, streaks, checkpoint quizzes, mastery badges) — partially implemented
- **Classroom system** (teacher creates classrooms, students join, submit work)
- **AI-powered course generation** via skill files + MCP server

### Tech Stack

```
Framework:     Next.js 14 (App Router)
Language:      TypeScript 5
Styling:       Tailwind CSS 4
UI:            Radix UI, Lucide icons, Framer Motion
Editor:        Monaco Editor (code exercises)
Database:      Supabase (PostgreSQL + pgvector)
Auth:          Supabase Auth (email/password)
AI LLM:       Moonshot API (Kimi K2) — primary for voice + coaching
AI Fallback:   Gemini API — fallback for coaching
TTS:           Deepgram Aura-2 (7 langs), Sarvam Bulbul v3 (Hindi/Punjabi)
STT:           Deepgram Nova-3 (50+ langs), Sarvam Saaras v3 (Punjabi)
Embeddings:    Gemini embedding-001 (768 dims, $0.15/M tokens)
Video:         Remotion (composition) + SadTalker/Wav2Lip (avatar, self-hosted)
Payments:      Paddle (planned)
MCP:           Custom MCP server for skill tools
```

### Environment Variables Required

```bash
# AI Providers
MOONSHOT_API_KEY=           # Kimi K2 — voice agent LLM, coaching, translation
GEMINI_API_KEY=             # Gemini — fallback coaching, embeddings
DEEPGRAM_API_KEY=           # STT + TTS for 7 languages + voice agent WebSocket
SARVAM_API_KEY=             # STT + TTS for Hindi/Punjabi

# Auth & Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Voice (legacy, being phased out)
NEXT_PUBLIC_ELEVENLABS_API_KEY=
VOICE_ID=

# Optional
SAMSARA_API_KEY=            # MCP server auth (for external access)
MINIMAX_API_KEY=            # REMOVED — was for Arabic TTS, no longer used
```

---

## Project Structure

```
samsara-ai/
├── CLAUDE.md                          # THIS FILE — read every session
├── skills/
│   ├── course-planning/SKILL.md       # How to design courses (6 domains, 10 religions)
│   └── lesson-planning/SKILL.md       # How to generate lesson content
├── mcp-samsara/                       # MCP server exposing skills as tools
│   ├── src/index.ts                   # 4 tools: list_domains, get_skill, plan_course, plan_lesson
│   ├── package.json
│   └── README.md
├── src/
│   ├── app/                           # Next.js App Router pages
│   │   ├── api/                       # API routes
│   │   │   ├── ai/                    # Coach, hints, grading, TTS
│   │   │   ├── language/              # Voice sessions, Sarvam pipeline, translation
│   │   │   │   ├── voice-session/     # Deepgram Agent WebSocket setup
│   │   │   │   ├── sarvam/            # Sarvam orchestrated pipeline
│   │   │   │   │   ├── stream/        # NEW: Single streaming endpoint (NDJSON)
│   │   │   │   │   ├── transcribe/    # Phase 1 STT (legacy, still works)
│   │   │   │   │   └── respond/       # Phase 2 LLM+TTS (legacy, still works)
│   │   │   │   ├── translate/         # Text translation via Moonshot
│   │   │   │   └── tts/               # Generic TTS endpoint
│   │   │   ├── auth/                  # Login, signup, session
│   │   │   ├── classrooms/            # Classroom management
│   │   │   ├── credits/               # Credit system
│   │   │   └── courses/               # Course catalog API
│   │   ├── course/                    # Course viewer pages
│   │   ├── talk/                      # Voice chat page (language learning)
│   │   ├── classrooms/                # Classroom UI
│   │   └── ...
│   ├── components/
│   │   ├── ai/AICoach.tsx             # AI coaching panel (text + voice)
│   │   ├── language/                  # Language learning components
│   │   ├── lesson/LessonPage.tsx      # Main lesson viewer
│   │   └── layout/                    # TopNav, CourseLayout
│   ├── data/
│   │   ├── types.ts                   # Course, Module, Lesson interfaces
│   │   ├── index.ts                   # Master course registry (46+ courses)
│   │   ├── language-types.ts          # LanguageLesson, VocabEntry, VoiceScenario
│   │   └── <course-slug>/             # Individual course data
│   ├── hooks/
│   │   ├── useVoiceAgent.ts           # Main router: Deepgram vs Sarvam
│   │   ├── useDeepgramAgent.ts        # WebSocket client for Deepgram Agent
│   │   └── useOrchestratedVoiceAgent.ts  # Streaming client for Sarvam pipeline
│   ├── lib/
│   │   ├── voice-provider-router.ts   # TTS/STT/LLM provider routing
│   │   ├── language-personas.ts       # Voice personas per language/tradition
│   │   ├── credits.ts                 # Credit system (deduct, add, balance)
│   │   ├── supabase-auth.ts           # Supabase auth helpers
│   │   └── ...
│   └── contexts/
│       └── AuthContext.tsx             # Auth provider
├── supabase/migrations/               # Database schema
└── docs/                              # Design specs and plans
```

---

## Data Model

### Core Types (src/data/types.ts)

```typescript
interface Lesson {
  id: string;          // kebab-case, unique within module
  slug: string;        // same as id
  title: string;
  content: string;     // Markdown
  starterCode?: string;
  solutionCode?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;        // Emoji
  tier: "free" | "pro";
  modules: Module[];
}
```

### Adding a New Course

```typescript
// 1. Create src/data/<slug>/index.ts
import { Course } from '../types';
import { module1 } from './01-module-name';

export const myCourse: Course = {
  id: 'my-course',
  slug: 'my-course',
  title: 'My Course',
  description: 'Description',
  icon: '📚',
  tier: 'free',
  modules: [module1],
};

// 2. Register in src/data/index.ts
import { myCourse } from './my-course';
export const courses: Course[] = [...existing, myCourse];
```

### Template Literal Escaping (CRITICAL)

All lesson content is in TypeScript template literals. These WILL break:

```typescript
// BROKEN: Python f-strings
content: `print(f"Hello, ${name}")`     // JS interprets ${name}

// FIXED: Escape the dollar sign
content: `print(f"Hello, \${name}")`    // Renders correctly

// BROKEN: Nested backticks
content: `const x = `hello``            // Breaks template

// FIXED: Escape backticks
content: `const x = \`hello\``          // Works
```

**Always grep for unescaped `${` after generating content:**
```bash
grep -n '\$\{' src/data/<slug>/*.ts | grep -v '\\$\{' | grep -v 'import'
```

---

## Voice Architecture

### How Voice Agents Work

```
User speaks → Browser MediaRecorder → Server

Route A (Deepgram — en, es, fr, de, nl, it, ja):
  Browser WebSocket → Deepgram Agent API (STT + LLM + TTS bundled)
  Latency: <1 second (real-time streaming)

Route B (Sarvam — hi, pa):
  Browser → /api/language/sarvam/stream → NDJSON stream back
  Server does: STT (Deepgram/Sarvam) → LLM streaming (Moonshot) → TTS (Sarvam)
  Latency: ~2-3 seconds (HTTP, optimized from ~4s with old 2-phase approach)
```

### Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useVoiceAgent.ts` | Router — picks Deepgram or Sarvam based on language |
| `src/hooks/useDeepgramAgent.ts` | WebSocket client for Deepgram Agent |
| `src/hooks/useOrchestratedVoiceAgent.ts` | Streaming NDJSON client for Sarvam pipeline |
| `src/app/api/language/voice-session/route.ts` | Creates Deepgram Agent WebSocket session |
| `src/app/api/language/sarvam/stream/route.ts` | Single streaming endpoint (STT→LLM→TTS) |
| `src/lib/voice-provider-router.ts` | Provider config, TTS synthesis, translation |
| `src/lib/language-personas.ts` | All voice personas, adaptive rules, greetings |

### Supported Voice Languages

| Language | STT | TTS | Voice Agent Type |
|----------|-----|-----|-----------------|
| English | Deepgram Nova-3 | Deepgram Aura-2 (41 voices) | WebSocket |
| Spanish | Deepgram Nova-3 | Deepgram Aura-2 (17 voices) | WebSocket |
| French | Deepgram Nova-3 | Deepgram Aura-2 (2 voices) | WebSocket |
| German | Deepgram Nova-3 | Deepgram Aura-2 (7 voices) | WebSocket |
| Italian | Deepgram Nova-3 | Deepgram Aura-2 (10 voices) | WebSocket |
| Dutch | Deepgram Nova-3 | Deepgram Aura-2 (9 voices) | WebSocket |
| Japanese | Deepgram Nova-3 | Deepgram Aura-2 (5 voices) | WebSocket |
| Hindi | Deepgram Nova-3 | Sarvam Bulbul v3 (priya) | Orchestrated |
| Punjabi | Sarvam Saaras v3 | Sarvam Bulbul v3 (simran) | Orchestrated |

**Arabic was removed** — no good TTS vendor without adding cost/complexity.

---

## What's Implemented vs What Needs Building

### IMPLEMENTED (Working)

- [x] Course data model and 46+ courses (CS, Finance, Economics)
- [x] Lesson viewer with Monaco editor for code exercises
- [x] AI Coach (text + voice) using Moonshot/Gemini
- [x] Voice agents for 9 languages (Deepgram + Sarvam)
- [x] Streaming Sarvam pipeline (reduced latency)
- [x] Classroom system (create, join, submit)
- [x] Credit system (deduct, add, balance)
- [x] Auth system (Supabase)
- [x] Skill files (course-planning.md, lesson-planning.md)
- [x] MCP server (4 tools exposed)
- [x] Language personas with adaptive rules

### NEEDS BUILDING (Priority Order)

#### 1. Gamification System (XP, Streaks, Badges)

**What:** XP earned per lesson/checkpoint, daily streaks, mastery badges per course.

**Database schema needed:**

```sql
-- Add to Supabase
CREATE TABLE user_gamification (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_freeze_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  badge_id TEXT NOT NULL,           -- e.g., "islam-fundamentals-scholar"
  course_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE checkpoint_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  course_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  quiz_score INTEGER,               -- 0-100
  voice_summary TEXT,                -- Transcribed user summary
  concepts_covered TEXT[],
  concepts_missed TEXT[],
  comprehension_score FLOAT,         -- 0.0-1.0
  xp_earned INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**API routes needed:**

```typescript
// POST /api/gamification/xp — Award XP
// Body: { userId, amount, action, courseId?, lessonId? }

// GET /api/gamification/profile — Get user's XP, streak, badges
// Returns: { totalXP, currentStreak, badges[], level }

// POST /api/gamification/checkpoint — Store checkpoint result
// Body: { courseId, moduleId, quizScore, voiceSummary, conceptsCovered, conceptsMissed }

// GET /api/gamification/leaderboard — Weekly leaderboard (optional)
```

**XP values (from course-planning skill):**

```typescript
const XP_VALUES = {
  lesson_complete: 10,
  first_attempt_bonus: 5,
  speed_bonus: 3,
  optional_challenge: 2,
  checkpoint_pass: 25,
  checkpoint_perfect: 15,
  capstone_complete: 50,
  streak_daily_bonus: 5,
};
```

**Component needed:** `src/components/gamification/XPBar.tsx` — shows XP, streak, badges in TopNav.

#### 2. Checkpoint Voice Summary System

**What:** At end of each module, voice agent asks user to summarize what they learned.
AI evaluates comprehension, stores in profile, feeds future prompts.

**How to implement:**

```typescript
// In LessonPage.tsx, detect when user reaches checkpoint lesson:
const isCheckpoint = lesson.id.includes('checkpoint') || lesson.slug.includes('quiz');

// When checkpoint quiz is passed, trigger voice summary:
// 1. Voice agent speaks: "Before we move on, tell me what you learned..."
// 2. User speaks their summary
// 3. Send summary to evaluation endpoint:

// POST /api/gamification/evaluate-summary
// Body: {
//   courseId, moduleId,
//   summaryTranscript: "user's spoken words",
//   expectedConcepts: ["concept1", "concept2", "concept3"],
//   quizScore: 85
// }

// Server evaluates using Moonshot:
const evaluationPrompt = `
  The student completed module "${moduleTitle}" and gave this summary:
  "${summaryTranscript}"

  Expected concepts: ${expectedConcepts.join(', ')}

  Rate comprehension 0.0-1.0 and list which concepts were covered vs missed.
  Return JSON: { comprehensionScore, conceptsCovered, conceptsMissed, feedback }
`;
```

#### 3. Gemini Embeddings for Recommendations

**What:** Embed user learning profiles, embed courses, use pgvector similarity for recommendations.

**How to implement:**

```typescript
// src/lib/embeddings.ts
import { createClient } from '@supabase/supabase-js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function embedText(text: string): Promise<number[]> {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text }] },
        taskType: 'SEMANTIC_SIMILARITY',
        outputDimensionality: 768,
      }),
    }
  );
  const data = await resp.json();
  return data.embedding.values;
}

// Supabase needs pgvector extension enabled:
// CREATE EXTENSION IF NOT EXISTS vector;
// ALTER TABLE user_profiles ADD COLUMN embedding vector(768);
// ALTER TABLE course_embeddings ADD COLUMN embedding vector(768);
```

**API route:**

```typescript
// GET /api/recommendations?userId=xxx
// 1. Fetch user profile, build embedding text
// 2. Call embedText()
// 3. Query pgvector for similar courses
// 4. Filter out completed courses
// 5. Return top 5 recommendations with reasons
```

#### 4. Remotion Video Pipeline

**What:** Auto-generate video lessons with AI avatars (SadTalker/Wav2Lip) explaining concepts.

**Architecture:**

```
Lesson content → Video script (from lesson-planning skill)
  → TTS audio (Deepgram/Moonshot)
  → Avatar video (SadTalker on VPS)
  → Remotion composition (layers: avatar + content + subtitles)
  → MP4 output → CDN/storage
```

**Remotion can use Moonshot API** instead of Claude for generating narration scripts:

```typescript
// scripts/generate-video.ts
import { bundle } from '@remotion/bundler';
import { renderMedia } from '@remotion/renderer';

// 1. Generate narration text via Moonshot
const narration = await fetch('https://api.moonshot.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${MOONSHOT_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'kimi-k2-turbo-preview',
    messages: [{
      role: 'system',
      content: 'Convert this lesson content into a natural 3-minute video narration script. Conversational tone, not reading the text verbatim.'
    }, {
      role: 'user',
      content: lessonContent
    }],
    max_tokens: 500,
  }),
});

// 2. Generate TTS audio from narration
const audio = await synthesizeSpeech(narrationText, providerConfig);

// 3. Generate avatar video from audio (SadTalker API on VPS)
const avatarVideo = await fetch(`${VPS_URL}/api/sadtalker`, {
  method: 'POST',
  body: formData, // audio + reference face image
});

// 4. Compose with Remotion
const bundled = await bundle('./src/remotion/index.ts');
await renderMedia({
  composition: 'LessonVideo',
  serveUrl: bundled,
  codec: 'h264',
  outputLocation: `./output/${lessonId}.mp4`,
  inputProps: {
    avatarVideoUrl: avatarVideo.url,
    narrationAudioUrl: audio.url,
    lessonTitle,
    codeSnippets,
    subtitles,
  },
});
```

**SadTalker setup on VPS:**

```bash
# On your VPS (Ubuntu)
git clone https://github.com/OpenTalker/SadTalker.git
cd SadTalker
pip install -r requirements.txt

# Download pretrained models
bash scripts/download_models.sh

# Run as API (wrap with FastAPI)
# See: vps/sadtalker-api.py (needs creating)
```

#### 5. Religious Studies Courses (10 Traditions)

**What:** Create courses for each of the 10 religious/spiritual traditions using the
course-planning and lesson-planning skill files.

**Order of creation:**
1. Islam — largest potential audience, most content available
2. Christianity — comparative value with Islam
3. Buddhism — Eastern tradition entry point
4. Hinduism — pairs with Buddhism
5. Sufism — complements Islam course
6. Judaism — Abrahamic trio complete
7. Sikhism — South Asian traditions
8. Taoism — East Asian philosophy
9. Confucianism — pairs with Taoism
10. Ahmadiyya Islam — distinct theology

**For each course:**
```bash
# Use the MCP tools or skill files directly:
# 1. Read skills/course-planning/SKILL.md
# 2. Set domain="religious-studies", variation="islam", level="beginner"
# 3. Design 8-10 modules following the skill instructions
# 4. For each module, read skills/lesson-planning/SKILL.md
# 5. Generate lessons following Template C (source-analysis)
# 6. Register course in src/data/index.ts
```

#### 6. Philosophy Courses

**Priority courses:**
1. Ethics (Western) — most practical, broadest appeal
2. Western Ancient (Plato, Aristotle, Stoics)
3. Eastern Philosophy (Vedanta, Buddhist philosophy, Confucian ethics)
4. Political Philosophy (Social contract, justice, liberty)
5. Logic & Critical Thinking — foundational skill

#### 7. Political Strategy Courses

**Priority courses:**
1. Geopolitics — current events relevance
2. International Relations theory — academic foundation
3. Public Policy analysis — practical skills

#### 8. Course Prerequisites & Cross-References

**What:** Each course declares prerequisites and companion courses. Shown in course catalog
and within lesson content as inline references.

**Database:**

```sql
CREATE TABLE course_prerequisites (
  course_id TEXT NOT NULL,
  prerequisite_id TEXT NOT NULL,
  required BOOLEAN DEFAULT FALSE,
  reason TEXT,
  PRIMARY KEY (course_id, prerequisite_id)
);

CREATE TABLE course_companions (
  course_id TEXT NOT NULL,
  companion_id TEXT NOT NULL,
  relationship TEXT,
  timing TEXT CHECK (timing IN ('before', 'during', 'after')),
  PRIMARY KEY (course_id, companion_id)
);
```

#### 9. Privacy-Consented User Profiling

**What:** Users opt in to share learning data + optional geolocation for personalized
recommendations. Data never leaves the platform.

**Privacy agreement component needed:** `src/components/auth/PrivacyConsent.tsx`

**User settings page needed:** `src/app/settings/privacy/page.tsx`
- Toggle geolocation sharing
- Toggle learning history embedding
- Export all data as JSON
- Delete all embeddings
- View stored data

---

## How to Use Skill Files

### For Course Creation (Any AI Agent)

```
1. Read skills/course-planning/SKILL.md
2. Identify domain + variation + level
3. Follow Steps 0-10 to design course skeleton
4. For each module, invoke lesson-planning skill
5. Output TypeScript files matching the data model
6. Register in src/data/index.ts
```

### For Lesson Generation (Agent Swarm)

```
1. Receive module_context from course-planning output
2. Read skills/lesson-planning/SKILL.md
3. Select template (A=code, B=case-study, C=source, D=strategic, E=checkpoint)
4. Generate content following level rules
5. Add voice markers (<!-- voice: --> HTML comments)
6. Escape template literals
7. Output TypeScript Lesson object
```

### Via MCP (External Agents)

```bash
# Start MCP server
cd mcp-samsara && npm run dev

# Tools available:
# samsara_list_domains — see all domains
# samsara_get_skill — read full skill file
# samsara_plan_course — get course planning instructions
# samsara_plan_lesson — get lesson generation instructions
```

---

## Kimi Code Handoff Notes

When Claude's token budget runs out, Kimi (Moonshot) can continue implementation.
Key things Kimi should know:

1. **Read this file first** — it has the full platform context
2. **Read the skill files** — `skills/course-planning/SKILL.md` and `skills/lesson-planning/SKILL.md`
3. **The MCP server is at** `mcp-samsara/` — install deps with `cd mcp-samsara && npm install`
4. **Course data pattern** — every course is in `src/data/<slug>/index.ts`, modules in numbered files
5. **Template literal escaping is CRITICAL** — grep for unescaped `${` before committing
6. **Voice personas** are in `src/lib/language-personas.ts` — add new ones following existing pattern
7. **Remotion uses Moonshot API** for narration generation, not Claude — saves subscription costs
8. **SadTalker/Wav2Lip** for avatars — open source, runs on VPS, zero per-video cost
9. **Gamification tables** need creating in Supabase — SQL provided above
10. **Priority order:** Gamification → Checkpoints → Embeddings → Videos → New courses

---

## Commands Reference

```bash
# Development
npm run dev                    # Start Next.js dev server
npm run build                  # Production build
npm run lint                   # Lint check

# MCP Server
cd mcp-samsara && npm install  # First time setup
cd mcp-samsara && npm run dev  # Start MCP server (dev)
cd mcp-samsara && npm run build && npm start  # Production

# Course content validation
grep -rn '\$\{' src/data/<slug>/*.ts | grep -v '\\$\{' | grep -v 'import'

# Database
npx supabase db push           # Apply migrations
npx supabase gen types typescript --local > src/lib/database.types.ts
```

---

## Rules for All AI Sessions

1. **NEVER fabricate citations** — every source must be real and verifiable
2. **ALWAYS escape template literals** in course data files
3. **ALWAYS use kebab-case** for course/module/lesson IDs and slugs
4. **NEVER mix beginner and advanced content** in the same course
5. **ALWAYS include voice markers** (`<!-- voice: -->`) in lesson content
6. **NEVER skip checkpoints** — they feed the user learning profile
7. **ALWAYS register new courses** in `src/data/index.ts`
8. **NEVER commit .env files** or API keys
9. **ALWAYS present religious content from within the tradition first**, then academic perspective
10. **READ THE SKILL FILES** before generating any course or lesson content
11. **RUN 2+ TAVILY SEARCHES per concept** — all content must be research-backed
12. **Health courses MUST include medical disclaimer** — "educational, not medical advice"
13. **Use Gemini embeddings** for recommendation matching — never hardcode suggestions

---

## Verifiable Credentials (Sub-project 1 — 2026-04-11)

Testnet acceptance achieved 2026-04-11.

- **Chain:** Base Sepolia
- **Registry contract:** `0xdAA100EE3CbaAF192183B74Eb5B9A42CbEEabE5D`
  (ERC-5192 soulbound, symbol `KLVC`, name "KairosLearn")
- **Issuer wallet:** `0xAd7ebF20d3CfDa2deF8230Ca9F32B11d2bC4DC4A`
  (private key in `.env.local` as `ISSUER_PRIVATE_KEY`, **testnet only** — cold wallet deferred to SP2)
- **First successful mint:** `python-fundamentals` → tokenId 2
  - Tx: https://sepolia.basescan.org/tx/0xbd6077427fdee8bc92b095eae8b3ae03318c0fb875d46aadd23cba61fb4a8968
  - Recipient: `0x6c1495c268B83CD78c02184f0197Ad187B176304` (Privy embedded wallet bound to user `9655631c-3bbd-4ee2-82d5-6b2ba805b9c4`)
  - IPFS metadata: `ipfs://QmeFcoLGcpm6d5deVE6Sp95xFXQsJbm1Pkfa8ZAAndJ5kY`
    (verified via public gateway — name/image/category/evidence all match catalog + seed source row)
- **Client flow:** Privy login → embedded wallet → `POST /api/credentials/wallet` (upsert `user_wallets`) → `/credentials` eligibility grid → `POST /api/credentials/mint` → viem `writeContract` → Pinata pin → `issued_credentials` marked `minted`.
- **Pro gating (`src/lib/credentials-pro-gate.ts`):**
  1. **Primary (prod):** reads `user_subscriptions` — passes if `status IN ('active','trialing')` and `plan='pro'`. This is the same Paddle-backed table used by the 2026-03-26 billing integration, so any Pro subscriber automatically gets credentials access with **zero manual configuration**.
  2. **Override (`CREDENTIALS_PRO_ALLOWLIST` env var):** comma-separated Supabase user UUIDs (**NOT emails**). Checked *before* the subscription lookup. **This is a dev/testnet escape hatch**, not a prod gating mechanism — it lets maintainers grant themselves access without a real Paddle subscription. Do NOT use it as a general "grant Pro access to user X" tool on prod; that belongs in `user_subscriptions` via the billing flow. Safe to leave unset on Vercel (or set only to maintainer UUIDs for internal testing).
- **Eligibility source of truth:** `src/lib/credential-eligibility.ts` reads `interview_performance ⨝ interview_sessions` (NOT the non-existent `interview_session_results` referenced in the original plan) and `xp_transactions` where `action='course_complete'`.
- **Known gotchas discovered during SP1 smoke test:**
  1. `@pinata/sdk` v2 default export is a **class** — must be `new PinataCtor({ pinataJWTKey })`, not called as a function. Symptom: "Cannot call a class as a function" 500 on mint. Fixed in `src/lib/credential-ipfs.ts`.
  2. `DiplomaMinted` event ABI order in viem must match the Solidity contract: `(address to, uint256 tokenId, string diplomaId, string uri)`. Any reordering changes topic0 and `decodeEventLog` silently fails. Symptom: tx succeeds on-chain but DB row stays `failed` with "DiplomaMinted event not found in receipt". Fixed in `src/lib/credential-issuer.ts`.
  3. `useCredentialWallet` needed a `useRef` dedupe keyed on `(privyDid, walletAddress)` to survive React 18 Strict Mode's double-invoke cleanup, otherwise the UI gets permanently stuck on "Linking…" even after the POST succeeds. Fixed in `src/hooks/useCredentialWallet.ts`.
  4. Plan doc `docs/superpowers/plans/2026-04-11-verifiable-credentials-subproject-1.md:2016` referenced `interview_session_results` which does not exist. Now flagged inline in the plan; the seed script `scripts/credentials-seed-test-data.mjs` is the working path.
  5. Turbopack + a stray `C:\Users\bilal\package.json` at the user's home dir caused tailwind resolution failures ("Can't resolve 'tailwindcss' in 'C:\\Users\\bilal\\Downloads'") because Turbopack walked up past the project root. Renamed the offending parent `package.json` to `.bak` as a workaround. Consider pinning `turbopack.root` more aggressively in `next.config.ts` or setting `outputFileTracingRoot` if this recurs.
  6. Privy Google OAuth "Access blocked" on localhost — unrelated to the credentials flow. Fallback: use email OTP in the Privy modal. Fix requires adding `http://localhost:3000` to Authorized JavaScript origins on the Privy-configured Google OAuth client in Google Cloud Console.
- **SP2a shipped (2026-04-12):** Public `/verify/<tokenId>` page (server-rendered, no-auth, crawlable with OG tags + `next/og` image generation), LinkedIn share button on `/credentials`, revocation check, `robots.txt` updated. Sepolia testnet only. Zero new deps/env vars/migrations. Middleware updated to make `/verify/` public.
- **Deferred to SP2b:** Base mainnet deploy, cold wallet rotation, `external_url` wiring.
- **Deferred to Sub-project 3:** batch Merkle publishing, multi-credential types, catalog beyond coding/tech-interview.
