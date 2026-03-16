# Samsara.ai

An AI-powered learning platform with 57+ courses across Computer Science, Finance, Economics, Philosophy, Religion, and Mental Health. Features AI voice coaching in 7+ languages, Gemini embedding-powered recommendations, cross-domain knowledge discovery, and gamification.

## Architecture

```
Next.js 14 (App Router) + TypeScript + Tailwind CSS 4
├── AI Layer
│   ├── Moonshot Kimi K2 — Voice coaching, translation, bridge label generation
│   ├── Gemini embedding-001 — 768-dim course/lesson embeddings, recommendations
│   ├── Deepgram Nova-3 + Aura-2 — STT + TTS (7 languages)
│   └── Sarvam Saaras/Bulbul — Hindi/Punjabi voice pipeline
├── Data Layer
│   ├── Supabase (PostgreSQL + pgvector) — Auth, progress, credits, embeddings
│   ├── 57 course embeddings (768-dim vectors)
│   └── Cross-domain concept bridges
├── UI Layer
│   ├── Monaco Editor — Code exercises
│   ├── Mermaid.js — Auto-rendered diagrams in lessons
│   ├── Framer Motion — Animations
│   └── Dark/Light theme with glassmorphism
└── Content
    ├── 57 courses, 1000+ lessons
    ├── 80+ glossary terms with domain-aware definitions
    └── 17 Mermaid diagrams (system design, DSA, OOD)
```

## Features

### Core Platform
- **57+ courses** — CS interview prep, system design, Python, JavaScript, React, Node.js, C++, C#, finance, economics, Islam, Stoic philosophy, mental health
- **Interactive code exercises** — Monaco editor with AI hints and grading
- **AI Coach (Coach Alex)** — Context-aware coaching with voice support
- **Classroom system** — Teachers create classrooms, students join and submit work
- **Credit system** — 50 free credits on signup, referral bonuses

### AI Voice Coaching
| Language | STT | TTS | Agent Type |
|----------|-----|-----|------------|
| English, Spanish, French, German, Italian, Dutch, Japanese | Deepgram Nova-3 | Deepgram Aura-2 | WebSocket |
| Hindi | Deepgram Nova-3 | Sarvam Bulbul v3 | Orchestrated |
| Punjabi | Sarvam Saaras v3 | Sarvam Bulbul v3 | Orchestrated |

### Embedding-Powered Intelligence (Gemini 768-dim)
- **Course recommendations** — Vector similarity matching completed courses to new ones
- **Cross-domain concept bridges** — Auto-discovers connections between CS, finance, philosophy, religion lessons
- **Semantic forgetting curve** — Detects fading knowledge and suggests refreshers
- **Knowledge fingerprinting** — Compares voice transcripts to lesson embeddings to measure understanding depth
- **Misconception clustering** — Embeds wrong submissions, clusters patterns, serves targeted remediation
- **Skills gap radar** — Maps courses to skills, shows career gap analysis against target roles
- **External trend alignment** — Ingests arXiv papers and GitHub repos, matches to completed lessons

### UX Features
- **Global search** (Ctrl+K) — Instant search across all courses and lessons
- **Light/dark mode** — Full theme support including Monaco editor
- **Glossary tooltips** — 80+ terms with domain-aware definitions ("model" means different things in ML vs finance)
- **Reading time estimates** — Per-lesson and per-course
- **Progress rings** — Visual course completion on cards
- **Mermaid diagrams** — Auto-rendered from markdown code blocks
- **Keyboard shortcuts** — N/P (next/prev lesson), H (hints), ? (help)
- **Onboarding wizard** — 3-step personalized welcome flow
- **Streak tracking** — Login streak badge in nav
- **Forgot password** — Full Supabase reset flow

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, Radix UI, Framer Motion |
| Code Editor | Monaco Editor |
| Diagrams | Mermaid.js (lazy-loaded, theme-aware) |
| Database | Supabase (PostgreSQL + pgvector) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| LLM | Moonshot Kimi K2 (primary), Gemini (fallback) |
| Embeddings | Gemini embedding-001 (768-dim, $0.15/M tokens) |
| TTS | Deepgram Aura-2 (7 langs), Sarvam Bulbul v3 (Hindi/Punjabi) |
| STT | Deepgram Nova-3 (50+ langs), Sarvam Saaras v3 (Punjabi) |
| MCP | Custom MCP server (`mcp-samsara/`) |

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/
│   │   ├── ai/                   # Coach, hints, grading, TTS, recommendations
│   │   │   ├── articulation/     # Knowledge fingerprinting API
│   │   │   ├── forgetting/       # Semantic forgetting detection
│   │   │   ├── misconceptions/   # Misconception matching API
│   │   │   └── recommendations/  # Embedding-powered course recs
│   │   ├── bridges/              # Cross-domain concept bridges
│   │   ├── career/               # Skills gap radar APIs
│   │   ├── trends/               # External trend alignment
│   │   ├── language/             # Voice sessions, Sarvam pipeline, translation
│   │   └── auth/                 # Login, signup, session
│   ├── career/                   # Career intelligence dashboard
│   ├── course/[slug]/[lesson]/   # Lesson viewer
│   ├── courses/                  # Course catalog with category tabs
│   ├── forgot-password/          # Password reset flow
│   └── reset-password/           # New password form
├── components/
│   ├── ai/AICoach.tsx            # AI coaching panel
│   ├── gamification/             # StreakBadge, LearningStats, ForgettingAlert, KnowledgePulse
│   ├── lesson/
│   │   ├── LessonContent.tsx     # Markdown renderer + Mermaid + glossary
│   │   ├── MermaidDiagram.tsx    # Theme-aware Mermaid renderer
│   │   ├── GlossaryTooltip.tsx   # Domain-aware glossary tooltips
│   │   ├── ConceptBridges.tsx    # "Unexpected Connections" cards
│   │   ├── UnderstandingDepth.tsx # Knowledge fingerprint indicator
│   │   └── MisconceptionAlert.tsx # Wrong answer pattern alert
│   ├── onboarding/               # Welcome wizard
│   ├── search/GlobalSearch.tsx   # Ctrl+K search modal
│   └── ui/                       # ProgressRing, ShortcutsHelp, badges
├── contexts/
│   ├── AuthContext.tsx            # Supabase auth + credits + streak
│   ├── ThemeContext.tsx           # Dark/light mode
│   └── TopNavContext.tsx          # Global nav state
├── data/
│   ├── index.ts                  # Master course registry (57 courses)
│   ├── types.ts                  # Course, Module, Lesson interfaces
│   ├── glossary.ts               # 80+ terms with domain variants
│   └── <course-slug>/            # Individual course data
├── hooks/
│   ├── useCourseProgress.ts      # Batch progress fetching
│   ├── useKeyboardShortcuts.ts   # N/P/H/? shortcuts
│   └── useVoiceConversation.ts   # Voice agent routing
├── lib/
│   ├── embeddings.ts             # Gemini embedding functions
│   ├── articulation.ts           # Voice transcript analysis
│   ├── misconceptions.ts         # Misconception detection
│   ├── skills-radar.ts           # Career gap analysis
│   ├── trends.ts                 # arXiv/GitHub ingestion
│   ├── reading-time.ts           # Reading time estimation
│   └── progress.ts               # Lesson completion tracking
├── scripts/
│   ├── seed-embeddings.ts        # Embed courses + lessons
│   ├── discover-bridges.ts       # Find cross-domain bridges
│   ├── cluster-misconceptions.ts # Cluster wrong submissions
│   ├── seed-skills.ts            # Populate skills taxonomy
│   └── ingest-trends.ts          # Fetch arXiv + GitHub trends
└── supabase/migrations/
    ├── 006_course_embeddings.sql
    ├── 007_lesson_embeddings.sql
    ├── 008_misconception_clusters.sql
    ├── 009_skills_radar.sql
    └── 010_external_trends.sql
```

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in: MOONSHOT_API_KEY, GEMINI_API_KEY, DEEPGRAM_API_KEY, SUPABASE keys

# Start dev server
npm run dev

# Apply Supabase migrations
npx supabase db push

# Seed embeddings (~$0.01 total)
npx tsx scripts/seed-embeddings.ts all

# Discover cross-domain bridges
npx tsx scripts/discover-bridges.ts

# Seed skills taxonomy
npx tsx scripts/seed-skills.ts

# Ingest external trends
npx tsx scripts/ingest-trends.ts
```

## Environment Variables

```bash
MOONSHOT_API_KEY=           # Kimi K2 — voice coaching, translation
GEMINI_API_KEY=             # Gemini — embeddings, fallback coaching
DEEPGRAM_API_KEY=           # STT + TTS (7 languages)
SARVAM_API_KEY=             # Hindi/Punjabi voice pipeline
NEXT_PUBLIC_SUPABASE_URL=   # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Embedding Features Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Cross-Domain Concept Bridges | Built |
| 2 | Semantic Forgetting Curve | Built |
| 3 | Knowledge Fingerprinting | Built |
| 4 | Glossary Context Morphing | Built |
| 5 | Misconception Clustering | Built |
| 6 | Skills Gap Radar | Built |
| 7 | External Trend Alignment | Built |

Full specs: `docs/superpowers/specs/2026-03-16-embedding-features-roadmap.md`

## License

Proprietary. All rights reserved.
