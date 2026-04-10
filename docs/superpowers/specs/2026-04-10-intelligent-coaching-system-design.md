# Intelligent Coaching System — Design Spec

> **Date:** 2026-04-10
> **Status:** Approved design — ready for implementation planning
> **Scope:** Agent Memory Network + Interview Intelligence + Specialized Coaches + Language Tutor Memory

## Goal

Transform kairoslearn's AI agents from stateless, generic responders into persistent, cross-aware, domain-expert coaches that remember every interaction, adapt to each user's strengths and weaknesses, and use real-world data to deliver industry-standard interview prep, career guidance, university admissions coaching, and language tutoring.

## Architecture: Agent Memory Network

Every AI agent on kairoslearn shares a **user knowledge graph** (temporal facts) but maintains its own **domain-specific memory store**. A unified **context assembly layer** builds the optimal prompt for each interaction. A **knowledge cache** provides real-world data from background indexing with live search fallback.

```
                    +---------------------------+
                    |   User Knowledge Graph    |
                    |  (temporal facts in PG)   |
                    |                           |
                    |  "user weak at recursion" |
                    |  "user targets Google"    |
                    |  "user speaks B2 Spanish" |
                    +-------------+-------------+
                                  | shared read
          +-----------------------+-----------------------+
          |                       |                       |
  +-------+------+   +-----------+---------+   +----------+-------+
  | Coach Memory |   | Interview Memory    |   | Language Memory   |
  |              |   |                     |   |                   |
  | per-lesson   |   | per-session scores  |   | proficiency       |
  | interactions |   | weak areas, company |   | vocab mastery     |
  | hints given  |   | prep history        |   | grammar errors    |
  | concepts     |   | code submissions    |   | spaced repetition |
  | mastered     |   |                     |   |                   |
  +--------------+   +---------------------+   +-------------------+
          |                       |                       |
          +-----------------------+-----------------------+
                                  | feeds
                    +-------------+-------------+
                    |     Knowledge Cache       |
                    |  (interview patterns,     |
                    |   job market data,        |
                    |   university stats,       |
                    |   domain knowledge)       |
                    +---------------------------+
```

### Context Assembly — Layered Memory Stack

Inspired by MemPalace's L0-L3 architecture. Before every LLM call, `buildAgentContext()` assembles:

| Layer | Content | Tokens | When Loaded |
|-------|---------|--------|-------------|
| L0 | User identity (name, level, streak, language) | ~50 | Always |
| L1 | Knowledge graph facts (current, filtered by relevance) | ~150 | Always |
| L2 | Agent-specific memories (recent + semantic search) | ~300 | On demand |
| L3 | Knowledge cache hits (domain data) | ~200 | On demand |
| L4 | Cross-agent insights (other agents' observations) | ~100 | On demand |

Total context injection: 200-800 tokens depending on availability.

### Write-Back Pattern

After each interaction, agents fire-and-forget (async, non-blocking):
1. Store conversation turn in `agent_memories` with embedding
2. Extract facts and upsert to `user_knowledge_graph`
3. Update domain-specific tables (interview_performance, language_learning_profiles, etc.)

Fact extraction: lightweight LLM call or rule-based pattern matching. Does not block the user-facing response.

---

## Database Schema

### 1. user_knowledge_graph

Temporal facts about the user. Written by any agent, readable by all. Facts have validity windows — old facts expire.

```sql
CREATE TABLE user_knowledge_graph (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  predicate TEXT NOT NULL,
  object TEXT NOT NULL,
  confidence FLOAT DEFAULT 1.0,
  source_agent TEXT NOT NULL,
  evidence TEXT,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ukg_user_current
  ON user_knowledge_graph (user_id, valid_to)
  WHERE valid_to IS NULL;

CREATE INDEX idx_ukg_user_predicate
  ON user_knowledge_graph (user_id, predicate)
  WHERE valid_to IS NULL;
```

Example facts:
- `(user, "weak_at", "recursion", confidence=0.8, source="interviewer")`
- `(user, "targets_company", "google", confidence=1.0, source="career_coach")`
- `(user, "speaks", "spanish:B2", confidence=0.9, source="language_tutor")`
- `(user, "mastered", "binary_trees", confidence=0.9, source="coach")`
- `(user, "prefers", "hanafi_fiqh", confidence=0.7, source="coach")`

### 2. agent_memories

Per-agent conversation memories with pgvector embeddings. Replaces the current `conversation_memories` table.

```sql
CREATE TABLE agent_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  agent_type TEXT NOT NULL,
  session_id UUID,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  metadata JSONB DEFAULT '{}',
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_am_user_agent
  ON agent_memories (user_id, agent_type, created_at DESC);

CREATE INDEX idx_am_embedding
  ON agent_memories USING ivfflat (embedding vector_cosine_ops);
```

Metadata examples per agent type:
- **coach:** `{courseSlug, lessonSlug, conceptsTaught, hintsGiven}`
- **interviewer:** `{companyId, questionTopic, inlineScore, feedbackGiven, problemId}`
- **language_tutor:** `{language, proficiencyLevel, errorsFound, vocabIntroduced}`
- **career_coach:** `{targetRole, skillDiscussed, recommendationGiven}`
- **university_coach:** `{schoolId, sessionFocus, profileUpdates}`

### 3. knowledge_cache

Background-indexed real-world data with expiration.

```sql
CREATE TABLE knowledge_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  entity TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  embedding vector(768),
  indexed_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_kc_domain_entity
  ON knowledge_cache (domain, entity);

CREATE INDEX idx_kc_embedding
  ON knowledge_cache USING ivfflat (embedding vector_cosine_ops);
```

Domains:
- `interview_patterns` — company-specific interview formats, common questions, recent changes
- `job_market` — role requirements, skills in demand, salary ranges, trending tech stacks
- `university_stats` — acceptance rates, essay themes, interview formats, program strengths
- `domain_knowledge` — curated subject matter (Islamic hadith refs, financial data, philosophy sources)

Refresh cadence: interview patterns weekly, job market weekly, university stats quarterly, domain knowledge monthly.

### 4. interview_performance

Structured per-session interview tracking.

```sql
CREATE TABLE interview_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID NOT NULL,
  company_persona_id TEXT,
  college_persona_id TEXT,
  interview_type TEXT NOT NULL,
  overall_score FLOAT,
  category_scores JSONB,
  strengths TEXT[],
  weaknesses TEXT[],
  topics_tested TEXT[],
  topics_struggled TEXT[],
  problems_attempted JSONB,
  transcript_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ip_user
  ON interview_performance (user_id, created_at DESC);
```

`problems_attempted` JSONB tracks per-problem results:
```json
[
  {
    "problemId": "two-sum",
    "language": "python",
    "passed": true,
    "testsPassed": 5,
    "testsTotal": 5,
    "timeMs": 180000,
    "approachUsed": "hash_map",
    "complexityAchieved": "O(n)",
    "hintsUsed": 1
  }
]
```

### 5. language_learning_profiles

Per-user, per-language proficiency tracking.

```sql
CREATE TABLE language_learning_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  language TEXT NOT NULL,
  assessed_level TEXT DEFAULT 'A1',
  level_confidence FLOAT DEFAULT 0.5,
  vocab_mastered TEXT[] DEFAULT '{}',
  vocab_introduced TEXT[] DEFAULT '{}',
  vocab_struggled TEXT[] DEFAULT '{}',
  grammar_strengths TEXT[] DEFAULT '{}',
  grammar_weaknesses TEXT[] DEFAULT '{}',
  recurring_errors JSONB DEFAULT '[]',
  preferred_topics TEXT[] DEFAULT '{}',
  completed_scenarios TEXT[] DEFAULT '{}',
  last_session_summary TEXT,
  sessions_completed INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  last_assessed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, language)
);
```

`recurring_errors` JSONB:
```json
[
  {
    "pattern": "confuses ser/estar with locations",
    "occurrences": 4,
    "lastSeen": "2026-04-09",
    "corrected": false
  }
]
```

### 6. career_pathways

Per-user career goal tracking.

```sql
CREATE TABLE career_pathways (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  target_role TEXT NOT NULL,
  target_companies TEXT[] DEFAULT '{}',
  target_timeline TEXT,
  required_skills JSONB DEFAULT '[]',
  recommended_courses TEXT[] DEFAULT '{}',
  completed_milestones TEXT[] DEFAULT '{}',
  next_action TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cp_user ON career_pathways (user_id);
```

### 7. interview_problems

Structured problem bank for live coding interviews.

```sql
CREATE TABLE interview_problems (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  constraints TEXT[] DEFAULT '{}',
  examples JSONB NOT NULL,
  test_cases JSONB NOT NULL,
  starter_code JSONB NOT NULL,
  solution_code JSONB NOT NULL,
  hints TEXT[] DEFAULT '{}',
  time_expected_minutes INTEGER DEFAULT 20,
  common_mistakes TEXT[] DEFAULT '{}',
  follow_ups TEXT[] DEFAULT '{}',
  related_lessons JSONB DEFAULT '[]',
  companies TEXT[] DEFAULT '{}',
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ip_category ON interview_problems (category, difficulty);
CREATE INDEX idx_ip_companies ON interview_problems USING gin (companies);
CREATE INDEX idx_ip_topics ON interview_problems USING gin (topics);
```

`starter_code` and `solution_code` JSONB: `{"python": "def two_sum(...):", "java": "class Solution {...}"}`

`test_cases` JSONB:
```json
[
  {"input": "[2,7,11,15]\n9", "expectedOutput": "[0,1]", "isHidden": false},
  {"input": "[3,2,4]\n6", "expectedOutput": "[1,2]", "isHidden": true}
]
```

---

## Sub-Project 1: Memory Foundation

### New files

- `src/lib/agent-context.ts` — unified context assembly layer (`buildAgentContext()`)
- `src/lib/knowledge-graph.ts` — read/write user_knowledge_graph (query current facts, upsert facts with temporal validity, invalidate stale facts)
- `src/lib/fact-extractor.ts` — extract knowledge graph facts from conversations (rule-based + optional lightweight LLM)
- `src/app/api/knowledge-cache/refresh/route.ts` — background job endpoint for refreshing knowledge cache (Tavily search + embedding + store)

### Modified files

- `src/lib/agent-intelligence.ts` — refactor `fetchUserIntelligence()` to use knowledge graph + agent_memories instead of ad-hoc queries. Becomes a thin wrapper around `buildAgentContext()`.
- `src/lib/memory.ts` — deprecate `conversation_memories` usage, migrate to `agent_memories` table. Keep backward-compatible `storeMemory()` and `searchMemories()` functions that route to new table.
- `src/app/api/ai/coach/route.ts` — use `buildAgentContext()` instead of inline intelligence + memory fetching.

### Context assembly logic

```typescript
async function buildAgentContext(
  userId: string,
  agentType: string,
  query: string,
  opts?: {
    courseSlug?: string;
    companyId?: string;
    language?: string;
    sessionId?: string;
  }
): Promise<AgentContext> {
  // L0: Always — user identity from user_profiles
  const identity = await getIdentity(userId);

  // L1: Always — current knowledge graph facts
  const facts = await getCurrentFacts(userId, { limit: 20 });

  // L2: On demand — agent-specific memories (recent + semantic search)
  const recentMemories = await getRecentAgentMemories(userId, agentType, 5);
  const relevantMemories = await searchAgentMemories(userId, agentType, query, 3);

  // L3: On demand — knowledge cache (if domain context needed)
  let domainKnowledge: string[] = [];
  if (opts?.companyId) {
    domainKnowledge = await searchKnowledgeCache("interview_patterns", opts.companyId, query);
  }

  // L4: On demand — cross-agent insights
  const crossInsights = await getCrossAgentInsights(userId, agentType);

  return { identity, facts, recentMemories, relevantMemories, domainKnowledge, crossInsights };
}
```

---

## Sub-Project 2: Interview Intelligence

### A. Interview Session Engine

New stateful interview session that runs a realistic interview arc.

**New files:**
- `src/lib/interview-session.ts` — session lifecycle: start, turn, end, score
- `src/lib/interview-question-planner.ts` — builds adaptive question plan using user's weak areas + company structure + problem bank
- `src/app/api/interviews/session/route.ts` — POST (start session), PUT (next turn), DELETE (end session)
- `src/app/api/interviews/run-code/route.ts` — execute code against test cases via Piston
- `src/components/interviews/LiveCodingPanel.tsx` — problem display + Monaco editor + test results
- `src/components/interviews/InterviewSession.tsx` — full interview UI (chat + coding + timer)

**Modified files:**
- `src/data/interview-personas.ts` — add `sessionStructure` to each persona (phases, timing, interviewer behavior)
- `src/app/api/interviews/text-message/route.ts` — integrate with session engine for turn-by-turn state
- `src/app/api/interviews/score/route.ts` — use interview_performance table + knowledge graph write-back

### B. Company-Authentic Interview Structures

Each company persona gains a `sessionStructure`:

```typescript
interface InterviewStructure {
  totalMinutes: number;
  phases: {
    name: string;
    minutes: number;
    questionCount: number;
    format: 'live_coding' | 'whiteboard' | 'discussion' | 'star_method' | 'system_design';
    difficultyProgression: 'fixed' | 'adaptive' | 'escalating';
  }[];
  interviewerBehavior: {
    silenceThresholdSec: number;
    hintStyle: 'socratic' | 'direct' | 'coded';
    followUpDepth: number;
    evaluationFocus: string[];
  };
}
```

Example — Google L4: 45-min coding (1 medium + 1 hard, escalating, socratic hints, 30s silence threshold, follow-up depth 5) + 15-min behavioral (Googleyness + leadership, discussion format).

Example — Amazon SDE-2: 60-min mixed (1 coding + 2 LP deep-dives, direct hints, 15s silence threshold, expects metrics and concrete examples, will cut off rambling answers).

### C. Live Coding Environment

**Code execution via Piston** (self-hosted Docker container):

```
POST /api/interviews/run-code
  Body: { code, language ("python" | "java"), testCases, problemId }
  
  Server:
    1. Validate language and code length
    2. For each test case:
       - POST to Piston API: { language, version, files: [{content: code}], stdin: testCase.input }
       - Compare stdout to expectedOutput
    3. Return: { testResults: [{input, expected, actual, passed, runtimeMs}], allPassed, compilationError?, executionTimeMs }
```

**Problem bank** — initially seeded from existing course data:
- Grokking the Coding Interview patterns map to interview_problems
- Each problem has starter code in Python and Java
- Test cases include visible examples + hidden edge cases
- Problems tagged by company (who asks this) and topic (for question planner)

**UI layout** — split panel during coding phases:
- Left: problem description, examples, constraints
- Right top: Monaco editor with language selector (Python/Java)
- Right bottom: test results panel
- Bottom: interviewer chat (observes code + test results, comments and adapts)

### D. Learning Loop

After each session:
1. Score per category (communication, technicalDepth, problemSolving, codeQuality)
2. Store in `interview_performance`
3. Write facts to `user_knowledge_graph`:
   - Topics struggled → `(user, "weak_at", topic, source="interviewer")`
   - Topics excelled → `(user, "strong_at", topic, source="interviewer")`
   - Improvement trends → `(user, "improving_at", topic, source="interviewer")`
4. Generate improvement comparison: last 5 sessions trend analysis
5. Feed next session's question planner with weak areas

### E. Knowledge Cache — Interview Data Pipeline

**New file:** `src/app/api/knowledge-cache/refresh/route.ts`

Triggered by cron or manual invocation. For each company persona:
1. Tavily search: `"${company} ${level} interview experience 2026"`
2. Extract: common questions, format changes, what interviewers look for
3. Embed content via Gemini
4. Upsert into `knowledge_cache` with `domain="interview_patterns"`, `entity=companyId`
5. Set `expires_at` = 7 days from now

Live fallback: when a user picks a company not in cache, the session start triggers a one-off Tavily search, caches the result, and proceeds.

---

## Sub-Project 3: Specialized Coaches

### A. Domain Expert Coaches

**New file:** `src/lib/domain-coaches.ts` — registry of domain coach configurations

Each domain coach has:
- `domain` — matches course domains
- `teachingMethodology` — how this domain is best taught
- `systemPromptExtension` — domain-specific rules
- `factExtractors` — patterns for writing to knowledge graph

Domain coach examples:

**CS Coach:** Socratic for coding exercises. Sees user's code. Progressive hints. After 3 sessions on same topic with no improvement, switches to direct instruction. Writes `weak_at`/`strong_at` facts. Connects to interview prep.

**Islamic Studies Coach:** Explanatory. Cites Quran (Surah:Ayah) and Hadith from knowledge cache. Presents multiple madhahib without bias. Tracks user's scholarly preferences. Cross-references between courses.

**Finance Coach:** Case-study driven. Uses real market data from knowledge cache. Pulls actual company financials as examples. Tracks financial concept mastery. Connects theory to current events.

**Philosophy Coach:** Dialectical. Presents position, steelmans opposition. Tracks user's philosophical inclinations to challenge them more effectively.

**Modified files:**
- `src/lib/voice-personas.ts` — each persona links to a domain coach config
- `src/app/api/ai/coach/route.ts` — loads domain coach config, injects domain-specific context from knowledge cache, uses domain-specific fact extractors

### B. Career Pathway Coaches

**New files:**
- `src/lib/career-coach.ts` — career pathway logic (skill gap analysis, course recommendations, progress tracking)
- `src/app/api/career/pathway/route.ts` — CRUD for career pathways
- `src/app/api/career/coach/route.ts` — career coach chat endpoint
- `src/components/career/CareerDashboard.tsx` — visual skill gap + progress + next actions

**How it works:**
1. User declares career goal (role + target companies + timeline)
2. System builds skill requirements from knowledge cache (job postings data)
3. Maps skills to kairoslearn courses
4. Skill levels assessed from three signals:
   - Course completion: finishing "Graph Algorithms" module = graph skill level 6/10
   - Interview performance: scoring 8/10 on tree questions in mocks = tree skill level 8/10
   - Knowledge graph facts: aggregated `strong_at`/`weak_at` with confidence scores
5. Tracks progress as user completes courses and interviews
6. Career coach chat uses full context: pathway progress, knowledge graph, interview scores
7. Suggests next actions: "Finish Graph Algorithms module, then do a Google mock interview"

### C. University Admissions Coaches

**Modified files:**
- `src/data/college-interviewer-personas.ts` — add school-specific knowledge and session structures
- `src/lib/college-interview-prompt-builders.ts` — integrate knowledge cache for school data, applicant profile from knowledge graph

**New behavior:**
- Coaches load school data from knowledge cache (acceptance rates, essay themes, interview format, what they value)
- Remember student's profile across sessions via knowledge graph
- Adapt across sessions: Session 1 = assess narrative, Session 2 = focus on weak areas, Session 3 = full mock, Session 4 = essay coaching
- Cross-school intelligence: knows Harvard values leadership narrative while MIT values technical depth

---

## Sub-Project 4: Language Tutor Memory

### New files

- `src/lib/language-profile.ts` — CRUD for language_learning_profiles, proficiency assessment logic, vocab spaced repetition scheduling
- `src/lib/language-session-analyzer.ts` — post-session analysis: extract vocab usage, grammar errors, proficiency signals

### Modified files

- `src/hooks/useVoiceAgent.ts` — load language profile at session start, pass to voice session
- `src/hooks/useOrchestratedVoiceAgent.ts` — same for Sarvam pipeline
- `src/app/api/language/voice-session/route.ts` — inject language profile into Deepgram Agent system prompt
- `src/app/api/language/sarvam/stream/route.ts` — inject language profile into Sarvam pipeline

### Session continuity

Session start:
1. Load `language_learning_profiles` for this user + language
2. Build context: last session summary, vocab due for review, recurring grammar errors
3. Inject into system prompt: "The student last practiced ordering food. Review 'tenedor' (fork) — they struggled with it. Their grammar weakness is ser/estar with locations."

Session end (async):
1. LLM summarizes session → `last_session_summary`
2. Extract vocab used correctly → move from `vocab_introduced` to `vocab_mastered`
3. Extract vocab errors → move to `vocab_struggled`
4. Log grammar errors with pattern matching
5. Reassess proficiency level if performance diverges from declared level
6. Write to knowledge graph: `(user, "speaks", "spanish:B2", source="language_tutor")`

### Adaptive difficulty

Observed proficiency overrides declared proficiency:
- Track correctness rate, sentence complexity, hesitation patterns
- If user consistently performs above declared level (>90% correct, complex sentences), bump assessed_level up
- If user struggles below declared level (<60% correct, basic errors), adjust down
- Level changes require confidence > 0.7 (multiple sessions of consistent performance)

### Spaced repetition

Vocab follows expanding intervals across sessions:
- Session N: introduce word
- Session N+1: review in new context (2-day ideal gap)
- Session N+3: use in complex sentence (5-day gap)
- Session N+7: if remembered, move to mastered (14-day gap); if forgotten, reset to struggled

Review words woven naturally into conversation, not flashcard drills.

---

## Cross-Agent Intelligence

The defining feature: agents share observations via the knowledge graph.

### Flow example

```
1. User completes "Binary Trees" module with Coach Alex
   -> knowledge_graph: (user, "mastered", "binary_trees", confidence=0.9, source="coach")

2. User starts Google mock interview
   -> Interview engine reads graph: "user mastered binary trees"
   -> Picks a tree question as warm-up, harder graph question as challenge
   -> After interview: (user, "weak_at", "graph_bfs", confidence=0.7, source="interviewer")

3. User returns to Coach Alex for DSA course
   -> Coach reads graph: "user weak at graph BFS per interviewer"
   -> "I noticed your last Google mock had some graph traversal challenges.
      Want to work through BFS step by step before your next interview?"

4. User talks to Career Coach
   -> Reads graph: mastered trees, weak at graphs, 3 interviews done, improving
   -> "You're 70% through the technical skills for Google SDE-2.
      Main gap: graph algorithms and system design."

5. Language tutor session
   -> Reads graph: "user targets Google"
   -> If user learns a language: "Some Google offices in LATAM conduct
      interviews partially in Spanish — your B2 could be an advantage."
```

---

## Implementation Order

| # | Sub-Project | Scope | Depends On |
|---|-------------|-------|------------|
| 1 | Memory Foundation | knowledge graph, agent_memories, knowledge_cache, context assembly, fact extraction | Nothing |
| 2 | Interview Intelligence | session engine, adaptive dynamics, learning loop, live coding (Piston + problems + Monaco UI), company structures, knowledge pipeline | Sub-Project 1 |
| 3 | Specialized Coaches | domain experts, career pathway, university admissions, cross-agent intelligence | Sub-Project 1 |
| 4 | Language Tutor Memory | language profiles, session continuity, adaptive difficulty, spaced repetition | Sub-Project 1 |

Sub-Projects 2, 3, and 4 can be built in parallel after Sub-Project 1 is complete, but recommended order is 2 → 3 → 4 (interview intelligence has the highest user-facing impact).

## Tech Stack Additions

| Component | Technology | Reason |
|-----------|-----------|--------|
| Code execution | Piston (self-hosted Docker) | Free, supports Python + Java + 50 languages, simple REST API, no vendor lock-in |
| Knowledge indexing | Tavily Search API | Already in CLAUDE.md rules ("RUN 2+ TAVILY SEARCHES per concept"), structured web search |
| Embeddings | Gemini text-embedding-004 (768 dims) | Already used in memory.ts, $0.15/M tokens |
| Vector search | Supabase pgvector (ivfflat) | Already set up, no new infrastructure |
| Background jobs | Next.js API route + Vercel Cron (or manual trigger) | Knowledge cache refresh on schedule |

No new infrastructure beyond a Piston Docker container. Everything else builds on existing Supabase + pgvector + OpenRouter + Gemini stack.
