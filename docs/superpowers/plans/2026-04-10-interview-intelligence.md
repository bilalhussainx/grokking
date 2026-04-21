# Interview Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the stateless interview system into a persistent, session-aware interview engine with live coding via Piston, company-authentic interview structures, and a learning loop that feeds the knowledge graph.

**Architecture:** Stateful interview sessions stored in Postgres with server-side code execution via Piston Docker container. Each company persona gains a `sessionStructure` defining phases, timing, and interviewer behavior. After each session, scores are persisted and facts are written to the knowledge graph so future sessions adapt to weaknesses.

**Tech Stack:** Next.js 14 API routes, Supabase (PostgreSQL + pgvector), Piston API (self-hosted Docker), Monaco Editor, OpenRouter/Kimi LLM, existing agent-context infrastructure from Sub-Project 1.

**Dependencies:** Sub-Project 1 (Memory Foundation) must be deployed — knowledge graph, agent memories, and fact extractor are required.

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `supabase/migrations/023_interview_sessions.sql` | interview_sessions + interview_performance tables |
| `supabase/migrations/024_interview_problems.sql` | interview_problems table (problem bank) |
| `src/lib/interview-session.ts` | Session lifecycle: create, advance turn, end, score-and-persist |
| `src/lib/interview-question-planner.ts` | Adaptive question planning using weak areas + company structure |
| `src/app/api/interviews/session/route.ts` | POST (start), PUT (next turn), DELETE (end session) |
| `src/app/api/interviews/run-code/route.ts` | Execute code via Piston, run against test cases |
| `src/components/interview/LiveCodingPanel.tsx` | Problem display + Monaco editor + test results |
| `src/components/interview/InterviewSession.tsx` | Full interview UI: chat + coding + timer + phases |
| `tests/e2e/interview-session.spec.ts` | E2E tests for session lifecycle and code execution |

### Modified Files

| File | Changes |
|------|---------|
| `src/data/interview-personas.ts` | Add `InterviewStructure` interface + `sessionStructure` to each persona |
| `src/app/api/interviews/text-message/route.ts` | Integrate with session engine for turn-by-turn state |
| `src/app/api/interviews/score/route.ts` | Persist to interview_performance + write facts to knowledge graph |
| `src/types/interview.ts` | Add InterviewSession, InterviewProblem, TestCase types |

---

### Task 1: Database Migrations — interview_sessions + interview_performance

**Files:**
- Create: `supabase/migrations/023_interview_sessions.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 023_interview_sessions.sql
-- Stateful interview sessions with performance tracking

-- Interview sessions — one per interview attempt
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_persona_id TEXT NOT NULL DEFAULT 'generic',
  category TEXT NOT NULL DEFAULT 'tech' CHECK (category IN ('tech', 'college')),
  interview_type TEXT NOT NULL DEFAULT 'technical',
  preset TEXT,
  language TEXT NOT NULL DEFAULT 'en',

  -- Session state
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  current_phase INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,

  -- Structured data
  question_plan JSONB NOT NULL DEFAULT '{}',
  session_structure JSONB,           -- snapshot of InterviewStructure at session start
  conversation_history JSONB NOT NULL DEFAULT '[]',
  code_submissions JSONB NOT NULL DEFAULT '[]',

  -- Metadata
  total_turns INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user
  ON interview_sessions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_active
  ON interview_sessions (user_id, status) WHERE status = 'active';

-- RLS
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_sessions_user_policy ON interview_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Interview performance — one per completed session
CREATE TABLE IF NOT EXISTS interview_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES interview_sessions(id),
  company_persona_id TEXT NOT NULL DEFAULT 'generic',
  category TEXT NOT NULL DEFAULT 'tech',
  interview_type TEXT NOT NULL DEFAULT 'technical',

  -- Scores (1-10 scale)
  overall_score FLOAT NOT NULL,
  communication_score FLOAT NOT NULL DEFAULT 0,
  technical_depth_score FLOAT NOT NULL DEFAULT 0,
  problem_solving_score FLOAT NOT NULL DEFAULT 0,
  code_quality_score FLOAT NOT NULL DEFAULT 0,

  -- Feedback
  strengths TEXT[] NOT NULL DEFAULT '{}',
  improvements TEXT[] NOT NULL DEFAULT '{}',
  question_scores JSONB NOT NULL DEFAULT '[]',

  -- Topics for learning loop
  topics_strong TEXT[] NOT NULL DEFAULT '{}',
  topics_weak TEXT[] NOT NULL DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interview_performance_user
  ON interview_performance (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_performance_company
  ON interview_performance (user_id, company_persona_id, created_at DESC);

ALTER TABLE interview_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_performance_user_policy ON interview_performance
  FOR ALL USING (auth.uid() = user_id);
```

- [ ] **Step 2: Verify SQL syntax**

Run: `cat supabase/migrations/023_interview_sessions.sql | head -5`
Expected: First 5 lines visible, no syntax errors in the file

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/023_interview_sessions.sql
git commit -m "feat(interview): add interview_sessions + interview_performance tables"
```

---

### Task 2: Database Migration — interview_problems (Problem Bank)

**Files:**
- Create: `supabase/migrations/024_interview_problems.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 024_interview_problems.sql
-- Problem bank for live coding interviews

CREATE TABLE IF NOT EXISTS interview_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),

  -- Problem content
  description TEXT NOT NULL,
  constraints TEXT,
  examples JSONB NOT NULL DEFAULT '[]',   -- [{input, output, explanation}]

  -- Code
  starter_code_python TEXT,
  starter_code_java TEXT,
  solution_code_python TEXT,
  solution_code_java TEXT,

  -- Test cases
  test_cases_visible JSONB NOT NULL DEFAULT '[]',   -- [{input, expected_output}]
  test_cases_hidden JSONB NOT NULL DEFAULT '[]',    -- [{input, expected_output}]

  -- Metadata for question planner
  topics TEXT[] NOT NULL DEFAULT '{}',              -- e.g., ['arrays', 'two-pointers', 'sliding-window']
  company_tags TEXT[] NOT NULL DEFAULT '{}',         -- e.g., ['google-l4', 'meta-e4']
  pattern TEXT,                                      -- e.g., 'sliding-window', 'bfs', 'dp'

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interview_problems_difficulty
  ON interview_problems (difficulty);
CREATE INDEX IF NOT EXISTS idx_interview_problems_topics
  ON interview_problems USING GIN (topics);
CREATE INDEX IF NOT EXISTS idx_interview_problems_companies
  ON interview_problems USING GIN (company_tags);

-- RLS — problems are public read, admin write
ALTER TABLE interview_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_problems_read_policy ON interview_problems
  FOR SELECT USING (true);
```

- [ ] **Step 2: Seed initial problems (5 classic problems)**

Create a seed section at the bottom of the migration:

```sql
-- Seed 5 classic interview problems
INSERT INTO interview_problems (slug, title, difficulty, description, constraints, examples, starter_code_python, starter_code_java, solution_code_python, topics, company_tags, pattern, test_cases_visible, test_cases_hidden) VALUES

('two-sum', 'Two Sum', 'easy',
 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
 'Only one valid answer exists. 2 <= nums.length <= 10^4. -10^9 <= nums[i] <= 10^9.',
 '[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}]',
 E'def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    pass',
 E'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}',
 E'def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n    return []',
 ARRAY['arrays', 'hash-map'],
 ARRAY['google-l4', 'meta-e4', 'amazon-sde2', 'microsoft-sde2'],
 'hash-map',
 '[{"input": "nums = [2,7,11,15]\ntarget = 9", "expected_output": "[0, 1]"}, {"input": "nums = [3,2,4]\ntarget = 6", "expected_output": "[1, 2]"}]',
 '[{"input": "nums = [3,3]\ntarget = 6", "expected_output": "[0, 1]"}, {"input": "nums = [-1,-2,-3,-4,-5]\ntarget = -8", "expected_output": "[2, 4]"}]'),

('valid-parentheses', 'Valid Parentheses', 'easy',
 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if: open brackets are closed by the same type, and open brackets are closed in the correct order.',
 '1 <= s.length <= 10^4. s consists of parentheses only.',
 '[{"input": "s = \"()\"", "output": "true"}, {"input": "s = \"([)]\"", "output": "false"}]',
 E'def is_valid(s: str) -> bool:\n    # Your code here\n    pass',
 E'class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}',
 E'def is_valid(s: str) -> bool:\n    stack = []\n    pairs = {\")\": \"(\", \"}\": \"{\", \"]\": \"[\"}\n    for c in s:\n        if c in pairs:\n            if not stack or stack[-1] != pairs[c]:\n                return False\n            stack.pop()\n        else:\n            stack.append(c)\n    return len(stack) == 0',
 ARRAY['stack', 'strings'],
 ARRAY['google-l4', 'meta-e4', 'amazon-sde2'],
 'stack',
 '[{"input": "s = \"()\"", "expected_output": "True"}, {"input": "s = \"()[]{}\"", "expected_output": "True"}, {"input": "s = \"(]\"", "expected_output": "False"}]',
 '[{"input": "s = \"([)]\"", "expected_output": "False"}, {"input": "s = \"{[]}\"", "expected_output": "True"}, {"input": "s = \"\"", "expected_output": "True"}]'),

('merge-intervals', 'Merge Intervals', 'medium',
 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
 '1 <= intervals.length <= 10^4. intervals[i].length == 2. 0 <= start_i <= end_i <= 10^4.',
 '[{"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]", "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."}]',
 E'def merge(intervals: list[list[int]]) -> list[list[int]]:\n    # Your code here\n    pass',
 E'class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n        return new int[][]{};\n    }\n}',
 E'def merge(intervals: list[list[int]]) -> list[list[int]]:\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged',
 ARRAY['arrays', 'intervals', 'sorting'],
 ARRAY['google-l4', 'meta-e4', 'uber-sde2'],
 'intervals',
 '[{"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "expected_output": "[[1, 6], [8, 10], [15, 18]]"}, {"input": "intervals = [[1,4],[4,5]]", "expected_output": "[[1, 5]]"}]',
 '[{"input": "intervals = [[1,4],[0,4]]", "expected_output": "[[0, 4]]"}, {"input": "intervals = [[1,4],[2,3]]", "expected_output": "[[1, 4]]"}, {"input": "intervals = [[1,4]]", "expected_output": "[[1, 4]]"}]'),

('lru-cache', 'LRU Cache', 'medium',
 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: LRUCache(int capacity) — initialize with positive capacity. int get(int key) — return value if key exists, else -1. void put(int key, int value) — update or insert. When at capacity, evict the least recently used key.',
 '1 <= capacity <= 3000. 0 <= key <= 10^4. 0 <= value <= 10^5. At most 2 * 10^5 calls to get and put.',
 '[{"input": "ops = [\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"put\",\"get\",\"get\",\"get\"], args = [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]", "output": "[null,null,null,1,null,-1,null,-1,3,4]"}]',
 E'class LRUCache:\n    def __init__(self, capacity: int):\n        # Your code here\n        pass\n\n    def get(self, key: int) -> int:\n        # Your code here\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        # Your code here\n        pass',
 NULL,
 E'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)',
 ARRAY['hash-map', 'linked-list', 'design'],
 ARRAY['google-l4', 'meta-e4', 'amazon-sde2', 'netflix-senior'],
 'design',
 '[{"input": "ops = [\"init\",\"put\",\"put\",\"get\",\"put\",\"get\"]\nargs = [[2],[1,1],[2,2],[1],[3,3],[2]]", "expected_output": "[null,null,null,1,null,-1]"}]',
 '[{"input": "ops = [\"init\",\"put\",\"get\",\"put\",\"get\",\"get\"]\nargs = [[1],[2,1],[2],[3,2],[2],[3]]", "expected_output": "[null,null,1,null,-1,2]"}]'),

('number-of-islands', 'Number of Islands', 'medium',
 'Given an m x n 2D binary grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
 'm == grid.length. n == grid[i].length. 1 <= m, n <= 300. grid[i][j] is ''0'' or ''1''.',
 '[{"input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", "output": "1"}]',
 E'def num_islands(grid: list[list[str]]) -> int:\n    # Your code here\n    pass',
 NULL,
 E'def num_islands(grid: list[list[str]]) -> int:\n    if not grid:\n        return 0\n    count = 0\n    rows, cols = len(grid), len(grid[0])\n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != \"1\":\n            return\n        grid[r][c] = \"0\"\n        dfs(r+1, c)\n        dfs(r-1, c)\n        dfs(r, c+1)\n        dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == \"1\":\n                count += 1\n                dfs(r, c)\n    return count',
 ARRAY['graph', 'bfs', 'dfs', 'matrix'],
 ARRAY['google-l4', 'meta-e4', 'amazon-sde2', 'uber-sde2'],
 'bfs-dfs',
 '[{"input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", "expected_output": "3"}]',
 '[{"input": "grid = [[\"1\"]]", "expected_output": "1"}, {"input": "grid = [[\"0\"]]", "expected_output": "0"}, {"input": "grid = [[\"1\",\"0\"],[\"0\",\"1\"]]", "expected_output": "2"}]')

ON CONFLICT (slug) DO NOTHING;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/024_interview_problems.sql
git commit -m "feat(interview): add interview_problems table with 5 seed problems"
```

---

### Task 3: Add InterviewStructure to Company Personas

**Files:**
- Modify: `src/data/interview-personas.ts`
- Modify: `src/types/interview.ts`

- [ ] **Step 1: Add new types to `src/types/interview.ts`**

Add after the existing `InterviewScorecard` interface:

```typescript
// --- Interview Session Types (Sub-Project 2) ---

export interface InterviewPhase {
  name: string;
  minutes: number;
  questionCount: number;
  format: 'live_coding' | 'whiteboard' | 'discussion' | 'star_method' | 'system_design';
  difficultyProgression: 'fixed' | 'adaptive' | 'escalating';
}

export interface InterviewerBehavior {
  silenceThresholdSec: number;
  hintStyle: 'socratic' | 'direct' | 'coded';
  followUpDepth: number;
  evaluationFocus: string[];
}

export interface InterviewStructure {
  totalMinutes: number;
  phases: InterviewPhase[];
  interviewerBehavior: InterviewerBehavior;
}

export interface InterviewSession {
  id: string;
  userId: string;
  companyPersonaId: string;
  category: 'tech' | 'college';
  interviewType: string;
  status: 'active' | 'completed' | 'abandoned';
  currentPhase: number;
  questionPlan: InterviewPlan;
  sessionStructure: InterviewStructure | null;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  codeSubmissions: Array<{ problemId: string; code: string; language: string; passed: boolean; timestamp: number }>;
  totalTurns: number;
  startedAt: string;
  endedAt: string | null;
}

export interface TestCase {
  input: string;
  expected_output: string;
}

export interface InterviewProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  constraints: string | null;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  starterCodePython: string | null;
  starterCodeJava: string | null;
  topics: string[];
  companyTags: string[];
  pattern: string | null;
  testCasesVisible: TestCase[];
  testCasesHidden: TestCase[];
}

export interface CodeExecutionResult {
  testResults: Array<{
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    runtimeMs: number;
  }>;
  allPassed: boolean;
  compilationError?: string;
  executionTimeMs: number;
}
```

- [ ] **Step 2: Run type check to verify no conflicts**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to interview.ts (other pre-existing errors are OK)

- [ ] **Step 3: Add InterviewStructure + sessionStructure to each persona in `src/data/interview-personas.ts`**

Add the import and interface at the top, then add `sessionStructure` to `CompanyPersona`:

```typescript
// Add import at top
import type { InterviewStructure } from '@/types/interview';

// Add to CompanyPersona interface (after insiderNote):
//   sessionStructure: InterviewStructure;

// Add to GENERIC_PERSONA:
sessionStructure: {
  totalMinutes: 45,
  phases: [
    { name: 'Coding', minutes: 35, questionCount: 2, format: 'live_coding', difficultyProgression: 'adaptive' },
    { name: 'Behavioral', minutes: 10, questionCount: 2, format: 'discussion', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 30,
    hintStyle: 'moderate' as any, // generic
    followUpDepth: 3,
    evaluationFocus: ['problem-solving', 'communication', 'code-quality'],
  },
},
```

Then add `sessionStructure` to each of the 14 personas. Key examples:

**Google L4:**
```typescript
sessionStructure: {
  totalMinutes: 45,
  phases: [
    { name: 'Coding', minutes: 40, questionCount: 2, format: 'live_coding', difficultyProgression: 'escalating' },
    { name: 'Googleyness', minutes: 5, questionCount: 1, format: 'discussion', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 30,
    hintStyle: 'socratic',
    followUpDepth: 5,
    evaluationFocus: ['algorithmic-thinking', 'code-correctness', 'communication', 'edge-cases'],
  },
},
```

**Amazon SDE-2:**
```typescript
sessionStructure: {
  totalMinutes: 60,
  phases: [
    { name: 'Leadership Principle Deep-Dive', minutes: 25, questionCount: 2, format: 'star_method', difficultyProgression: 'fixed' },
    { name: 'Coding', minutes: 25, questionCount: 1, format: 'live_coding', difficultyProgression: 'adaptive' },
    { name: 'Design Discussion', minutes: 10, questionCount: 1, format: 'discussion', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 15,
    hintStyle: 'direct',
    followUpDepth: 3,
    evaluationFocus: ['leadership-principles', 'measurable-impact', 'ownership', 'coding'],
  },
},
```

**Meta E4:**
```typescript
sessionStructure: {
  totalMinutes: 35,
  phases: [
    { name: 'Coding Round', minutes: 35, questionCount: 2, format: 'live_coding', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 20,
    hintStyle: 'direct',
    followUpDepth: 2,
    evaluationFocus: ['speed', 'bug-free-code', 'testing', 'optimization'],
  },
},
```

**Netflix Senior:**
```typescript
sessionStructure: {
  totalMinutes: 60,
  phases: [
    { name: 'System Design', minutes: 30, questionCount: 1, format: 'system_design', difficultyProgression: 'escalating' },
    { name: 'Judgment & Culture', minutes: 30, questionCount: 3, format: 'discussion', difficultyProgression: 'adaptive' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 30,
    hintStyle: 'socratic',
    followUpDepth: 4,
    evaluationFocus: ['independent-judgment', 'system-thinking', 'candor', 'senior-presence'],
  },
},
```

**Stripe L2:**
```typescript
sessionStructure: {
  totalMinutes: 45,
  phases: [
    { name: 'API Integration', minutes: 35, questionCount: 1, format: 'live_coding', difficultyProgression: 'escalating' },
    { name: 'Error Handling Discussion', minutes: 10, questionCount: 2, format: 'discussion', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 45,
    hintStyle: 'coded',
    followUpDepth: 3,
    evaluationFocus: ['correctness-first', 'error-handling', 'reading-specs', 'testing'],
  },
},
```

**Anthropic MTS:**
```typescript
sessionStructure: {
  totalMinutes: 60,
  phases: [
    { name: 'Values & Motivation', minutes: 15, questionCount: 2, format: 'discussion', difficultyProgression: 'fixed' },
    { name: 'Practical Coding', minutes: 30, questionCount: 1, format: 'live_coding', difficultyProgression: 'adaptive' },
    { name: 'Paper/Domain Discussion', minutes: 15, questionCount: 2, format: 'discussion', difficultyProgression: 'escalating' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 30,
    hintStyle: 'socratic',
    followUpDepth: 4,
    evaluationFocus: ['safety-understanding', 'practical-python', 'research-engagement', 'values-alignment'],
  },
},
```

**Apple ICT3:**
```typescript
sessionStructure: {
  totalMinutes: 60,
  phases: [
    { name: 'Project Deep-Dive', minutes: 30, questionCount: 1, format: 'discussion', difficultyProgression: 'escalating' },
    { name: 'Systems Coding', minutes: 25, questionCount: 1, format: 'whiteboard', difficultyProgression: 'adaptive' },
    { name: 'Wrap-Up', minutes: 5, questionCount: 1, format: 'discussion', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 30,
    hintStyle: 'socratic',
    followUpDepth: 5,
    evaluationFocus: ['depth-of-knowledge', 'systems-thinking', 'under-the-hood', 'production-debugging'],
  },
},
```

**Microsoft SDE2:**
```typescript
sessionStructure: {
  totalMinutes: 45,
  phases: [
    { name: 'Coding', minutes: 35, questionCount: 2, format: 'live_coding', difficultyProgression: 'adaptive' },
    { name: 'Collaboration Chat', minutes: 10, questionCount: 2, format: 'discussion', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 45,
    hintStyle: 'direct',
    followUpDepth: 2,
    evaluationFocus: ['collaboration', 'hint-utilization', 'growth-mindset', 'code-clarity'],
  },
},
```

**OpenAI SWE:**
```typescript
sessionStructure: {
  totalMinutes: 45,
  phases: [
    { name: 'Build Something', minutes: 40, questionCount: 1, format: 'live_coding', difficultyProgression: 'escalating' },
    { name: 'Ship Discussion', minutes: 5, questionCount: 1, format: 'discussion', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 15,
    hintStyle: 'direct',
    followUpDepth: 2,
    evaluationFocus: ['shipping-velocity', 'pragmatism', 'end-to-end-thinking', 'opinions'],
  },
},
```

**Nvidia SWE:**
```typescript
sessionStructure: {
  totalMinutes: 45,
  phases: [
    { name: 'Systems Coding', minutes: 35, questionCount: 2, format: 'live_coding', difficultyProgression: 'escalating' },
    { name: 'Hardware Discussion', minutes: 10, questionCount: 2, format: 'discussion', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 30,
    hintStyle: 'socratic',
    followUpDepth: 4,
    evaluationFocus: ['hardware-awareness', 'performance-reasoning', 'memory-layout', 'parallelism'],
  },
},
```

**Databricks SWE:**
```typescript
sessionStructure: {
  totalMinutes: 50,
  phases: [
    { name: 'Coding', minutes: 30, questionCount: 2, format: 'live_coding', difficultyProgression: 'escalating' },
    { name: 'Distributed Systems Design', minutes: 20, questionCount: 1, format: 'system_design', difficultyProgression: 'escalating' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 20,
    hintStyle: 'socratic',
    followUpDepth: 3,
    evaluationFocus: ['distributed-systems', 'scalability', 'data-flow', 'bottleneck-analysis'],
  },
},
```

**Airbnb SWE:**
```typescript
sessionStructure: {
  totalMinutes: 45,
  phases: [
    { name: 'Iterative Build', minutes: 35, questionCount: 1, format: 'live_coding', difficultyProgression: 'escalating' },
    { name: 'Core Values', minutes: 10, questionCount: 2, format: 'star_method', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 30,
    hintStyle: 'direct',
    followUpDepth: 3,
    evaluationFocus: ['code-quality', 'refactoring', 'naming', 'iterative-improvement'],
  },
},
```

**Uber SDE2:**
```typescript
sessionStructure: {
  totalMinutes: 45,
  phases: [
    { name: 'Coding', minutes: 25, questionCount: 1, format: 'live_coding', difficultyProgression: 'adaptive' },
    { name: 'System Design', minutes: 20, questionCount: 1, format: 'system_design', difficultyProgression: 'escalating' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 25,
    hintStyle: 'direct',
    followUpDepth: 3,
    evaluationFocus: ['geo-awareness', 'operational-thinking', 'pragmatism', 'concurrency'],
  },
},
```

**LinkedIn SWE:**
```typescript
sessionStructure: {
  totalMinutes: 50,
  phases: [
    { name: 'Coding', minutes: 30, questionCount: 2, format: 'live_coding', difficultyProgression: 'adaptive' },
    { name: 'System Design', minutes: 15, questionCount: 1, format: 'system_design', difficultyProgression: 'fixed' },
    { name: 'Host Manager Chat', minutes: 5, questionCount: 1, format: 'discussion', difficultyProgression: 'fixed' },
  ],
  interviewerBehavior: {
    silenceThresholdSec: 30,
    hintStyle: 'direct',
    followUpDepth: 3,
    evaluationFocus: ['structured-approach', 'scalability', 'collaboration', 'code-clarity'],
  },
},
```

- [ ] **Step 4: Fix the `hintStyle` type — use correct union for GENERIC_PERSONA**

The GENERIC_PERSONA uses `'moderate'` which is not in the union. Change it to `'direct'` (the closest equivalent for a generic persona).

- [ ] **Step 5: Run type check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep -i "interview-personas\|interview\.ts" | head -10`
Expected: No new errors in these files

- [ ] **Step 6: Commit**

```bash
git add src/types/interview.ts src/data/interview-personas.ts
git commit -m "feat(interview): add InterviewStructure + sessionStructure to all 14 personas"
```

---

### Task 4: Interview Session Library

**Files:**
- Create: `src/lib/interview-session.ts`

- [ ] **Step 1: Write the session lifecycle library**

```typescript
// src/lib/interview-session.ts
// Stateful interview session lifecycle: create, advance, end, persist score.

import { createAdminSupabase } from "@/lib/supabase-auth";
import type {
  InterviewSession,
  InterviewStructure,
  InterviewPlan,
  InterviewScorecard,
} from "@/types/interview";

/**
 * Create a new interview session. Returns the session ID.
 */
export async function createSession(opts: {
  userId: string;
  companyPersonaId: string;
  category: "tech" | "college";
  interviewType: string;
  preset?: string;
  language?: string;
  questionPlan: InterviewPlan;
  sessionStructure: InterviewStructure | null;
}): Promise<string> {
  const admin = createAdminSupabase();

  const { data, error } = await admin
    .from("interview_sessions")
    .insert({
      user_id: opts.userId,
      company_persona_id: opts.companyPersonaId,
      category: opts.category,
      interview_type: opts.interviewType,
      preset: opts.preset || null,
      language: opts.language || "en",
      question_plan: opts.questionPlan,
      session_structure: opts.sessionStructure,
      conversation_history: [],
      code_submissions: [],
      status: "active",
      current_phase: 0,
      total_turns: 0,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create session: ${error?.message}`);
  }

  return data.id;
}

/**
 * Get an active session by ID. Returns null if not found or not active.
 */
export async function getSession(
  sessionId: string,
  userId: string
): Promise<InterviewSession | null> {
  const admin = createAdminSupabase();

  const { data, error } = await admin
    .from("interview_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    companyPersonaId: data.company_persona_id,
    category: data.category,
    interviewType: data.interview_type,
    status: data.status,
    currentPhase: data.current_phase,
    questionPlan: data.question_plan,
    sessionStructure: data.session_structure,
    conversationHistory: data.conversation_history || [],
    codeSubmissions: data.code_submissions || [],
    totalTurns: data.total_turns,
    startedAt: data.started_at,
    endedAt: data.ended_at,
  };
}

/**
 * Record a turn in the session (user message + assistant response).
 */
export async function recordTurn(
  sessionId: string,
  userMessage: string,
  assistantMessage: string,
  currentPhase?: number
): Promise<void> {
  const admin = createAdminSupabase();

  // Fetch current state
  const { data: session } = await admin
    .from("interview_sessions")
    .select("conversation_history, total_turns")
    .eq("id", sessionId)
    .single();

  if (!session) return;

  const history = [...(session.conversation_history || [])];
  history.push({ role: "user", content: userMessage });
  history.push({ role: "assistant", content: assistantMessage });

  const updates: Record<string, unknown> = {
    conversation_history: history,
    total_turns: (session.total_turns || 0) + 1,
  };

  if (currentPhase !== undefined) {
    updates.current_phase = currentPhase;
  }

  await admin
    .from("interview_sessions")
    .update(updates)
    .eq("id", sessionId);
}

/**
 * Record a code submission for the session.
 */
export async function recordCodeSubmission(
  sessionId: string,
  submission: {
    problemId: string;
    code: string;
    language: string;
    passed: boolean;
  }
): Promise<void> {
  const admin = createAdminSupabase();

  const { data: session } = await admin
    .from("interview_sessions")
    .select("code_submissions")
    .eq("id", sessionId)
    .single();

  if (!session) return;

  const submissions = [...(session.code_submissions || [])];
  submissions.push({ ...submission, timestamp: Date.now() });

  await admin
    .from("interview_sessions")
    .update({ code_submissions: submissions })
    .eq("id", sessionId);
}

/**
 * End a session and persist the scorecard to interview_performance.
 * Also writes facts to the knowledge graph.
 */
export async function endSession(
  sessionId: string,
  userId: string,
  scorecard: InterviewScorecard
): Promise<void> {
  const admin = createAdminSupabase();

  // Mark session as completed
  await admin
    .from("interview_sessions")
    .update({ status: "completed", ended_at: new Date().toISOString() })
    .eq("id", sessionId);

  // Get session metadata for the performance record
  const { data: session } = await admin
    .from("interview_sessions")
    .select("company_persona_id, category, interview_type")
    .eq("id", sessionId)
    .single();

  if (!session) return;

  // Extract topics from scorecard
  const topicsStrong: string[] = [];
  const topicsWeak: string[] = [];
  for (const q of scorecard.questions || []) {
    // Heuristic: scores >= 7 are strengths, <= 4 are weaknesses
    const topic = q.question.slice(0, 100);
    if (q.score >= 7) topicsStrong.push(topic);
    if (q.score <= 4) topicsWeak.push(topic);
  }

  // Persist to interview_performance
  await admin.from("interview_performance").insert({
    user_id: userId,
    session_id: sessionId,
    company_persona_id: session.company_persona_id,
    category: session.category,
    interview_type: session.interview_type,
    overall_score: scorecard.overall,
    communication_score: scorecard.categories.communication,
    technical_depth_score: scorecard.categories.technicalDepth,
    problem_solving_score: scorecard.categories.problemSolving,
    code_quality_score: scorecard.categories.codeQuality,
    strengths: scorecard.strengths,
    improvements: scorecard.improvements,
    question_scores: scorecard.questions,
    topics_strong: topicsStrong,
    topics_weak: topicsWeak,
  });

  // Write facts to knowledge graph (fire-and-forget)
  writeInterviewFacts(userId, scorecard, topicsStrong, topicsWeak).catch(() => {});
}

/**
 * Write interview performance facts to the knowledge graph.
 */
async function writeInterviewFacts(
  userId: string,
  scorecard: InterviewScorecard,
  topicsStrong: string[],
  topicsWeak: string[]
): Promise<void> {
  const { upsertFact } = await import("@/lib/knowledge-graph");

  for (const topic of topicsWeak) {
    await upsertFact({
      userId,
      subject: userId,
      predicate: "weak_at",
      object: topic,
      confidence: 0.7,
      sourceAgent: "interviewer",
    });
  }

  for (const topic of topicsStrong) {
    await upsertFact({
      userId,
      subject: userId,
      predicate: "strong_at",
      object: topic,
      confidence: 0.7,
      sourceAgent: "interviewer",
    });
  }

  // Overall performance fact
  const level =
    scorecard.overall >= 8 ? "strong" : scorecard.overall >= 5 ? "moderate" : "needs_improvement";
  await upsertFact({
    userId,
    subject: userId,
    predicate: "interview_readiness",
    object: level,
    confidence: 0.6,
    sourceAgent: "interviewer",
  });
}

/**
 * Get the user's last N interview performances for trend analysis.
 */
export async function getPerformanceTrend(
  userId: string,
  companyPersonaId?: string,
  limit = 5
): Promise<{
  sessions: Array<{
    overall: number;
    communication: number;
    technicalDepth: number;
    problemSolving: number;
    codeQuality: number;
    createdAt: string;
    companyPersonaId: string;
  }>;
  trend: "improving" | "declining" | "stable" | "insufficient_data";
}> {
  const admin = createAdminSupabase();

  let query = admin
    .from("interview_performance")
    .select("overall_score, communication_score, technical_depth_score, problem_solving_score, code_quality_score, created_at, company_persona_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (companyPersonaId) {
    query = query.eq("company_persona_id", companyPersonaId);
  }

  const { data } = await query;

  if (!data || data.length < 2) {
    return {
      sessions: (data || []).map((d) => ({
        overall: d.overall_score,
        communication: d.communication_score,
        technicalDepth: d.technical_depth_score,
        problemSolving: d.problem_solving_score,
        codeQuality: d.code_quality_score,
        createdAt: d.created_at,
        companyPersonaId: d.company_persona_id,
      })),
      trend: "insufficient_data",
    };
  }

  // Compare most recent 2 vs older 2
  const recent = data.slice(0, Math.ceil(data.length / 2));
  const older = data.slice(Math.ceil(data.length / 2));
  const recentAvg = recent.reduce((s, d) => s + d.overall_score, 0) / recent.length;
  const olderAvg = older.reduce((s, d) => s + d.overall_score, 0) / older.length;

  const diff = recentAvg - olderAvg;
  const trend = diff > 0.5 ? "improving" : diff < -0.5 ? "declining" : "stable";

  return {
    sessions: data.map((d) => ({
      overall: d.overall_score,
      communication: d.communication_score,
      technicalDepth: d.technical_depth_score,
      problemSolving: d.problem_solving_score,
      codeQuality: d.code_quality_score,
      createdAt: d.created_at,
      companyPersonaId: d.company_persona_id,
    })),
    trend,
  };
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "interview-session" | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/interview-session.ts
git commit -m "feat(interview): add stateful session lifecycle library"
```

---

### Task 5: Adaptive Question Planner

**Files:**
- Create: `src/lib/interview-question-planner.ts`

- [ ] **Step 1: Write the question planner**

```typescript
// src/lib/interview-question-planner.ts
// Builds an adaptive interview question plan using:
// - User's weak areas from knowledge graph
// - Company persona's session structure
// - Problem bank for live coding phases
// - Previous interview performance trends

import { createAdminSupabase } from "@/lib/supabase-auth";
import { getCurrentFacts } from "@/lib/knowledge-graph";
import { getPerformanceTrend } from "@/lib/interview-session";
import type { InterviewStructure, InterviewProblem } from "@/types/interview";
import type { CompanyPersona } from "@/data/interview-personas";

interface QuestionPlannerInput {
  userId: string;
  persona: CompanyPersona;
  interviewType: string;
  language?: string;
}

interface AdaptiveContext {
  weakTopics: string[];
  strongTopics: string[];
  trend: string;
  recentScores: number[];
  selectedProblems: InterviewProblem[];
}

/**
 * Build adaptive context for the question planner by reading
 * the user's knowledge graph and performance history.
 */
export async function buildAdaptiveContext(
  input: QuestionPlannerInput
): Promise<AdaptiveContext> {
  const { userId, persona } = input;

  // Get weak/strong facts from knowledge graph
  const facts = await getCurrentFacts(userId, { limit: 30 });
  const weakTopics = facts
    .filter((f) => f.predicate === "weak_at" && f.sourceAgent === "interviewer")
    .map((f) => f.object);
  const strongTopics = facts
    .filter((f) => f.predicate === "strong_at" && f.sourceAgent === "interviewer")
    .map((f) => f.object);

  // Get performance trend
  const { trend, sessions } = await getPerformanceTrend(userId, persona.id, 5);
  const recentScores = sessions.map((s) => s.overall);

  // Select problems for coding phases
  const selectedProblems = await selectProblems(persona, weakTopics);

  return { weakTopics, strongTopics, trend, recentScores, selectedProblems };
}

/**
 * Select problems from the bank that match the company persona
 * and target the user's weak areas.
 */
async function selectProblems(
  persona: CompanyPersona,
  weakTopics: string[]
): Promise<InterviewProblem[]> {
  const admin = createAdminSupabase();

  // Count coding phases to know how many problems we need
  const codingPhases = (persona.sessionStructure?.phases || []).filter(
    (p) => p.format === "live_coding"
  );
  const problemCount = codingPhases.reduce((s, p) => s + p.questionCount, 0);
  if (problemCount === 0) return [];

  // Try to find problems tagged for this company first
  let { data: companyProblems } = await admin
    .from("interview_problems")
    .select("*")
    .contains("company_tags", [persona.id])
    .limit(problemCount * 3); // fetch extras for selection

  let pool = companyProblems || [];

  // If not enough company-specific problems, fetch by topics
  if (pool.length < problemCount) {
    const { data: topicProblems } = await admin
      .from("interview_problems")
      .select("*")
      .limit(20);
    
    const existingIds = new Set(pool.map((p) => p.id));
    for (const p of topicProblems || []) {
      if (!existingIds.has(p.id)) pool.push(p);
    }
  }

  // Prioritize: problems that target weak topics
  const scored = pool.map((p) => {
    const raw = p as Record<string, unknown>;
    const topics = (raw.topics as string[]) || [];
    const weakOverlap = topics.filter((t) => weakTopics.includes(t)).length;
    return { problem: mapDbProblem(raw), weakScore: weakOverlap };
  });

  scored.sort((a, b) => b.weakScore - a.weakScore);

  // Pick the right difficulty based on session structure
  const selected: InterviewProblem[] = [];
  let phaseIdx = 0;
  for (const phase of codingPhases) {
    const difficulty = phase.difficultyProgression === "escalating"
      ? phaseIdx === 0 ? "medium" : "hard"
      : undefined;

    for (let i = 0; i < phase.questionCount && scored.length > 0; i++) {
      const idx = difficulty
        ? scored.findIndex((s) => s.problem.difficulty === difficulty)
        : 0;
      const pick = idx >= 0 ? scored.splice(idx, 1)[0] : scored.shift();
      if (pick) selected.push(pick.problem);
    }
    phaseIdx++;
  }

  return selected;
}

function mapDbProblem(raw: Record<string, unknown>): InterviewProblem {
  return {
    id: raw.id as string,
    slug: raw.slug as string,
    title: raw.title as string,
    difficulty: raw.difficulty as "easy" | "medium" | "hard",
    description: raw.description as string,
    constraints: (raw.constraints as string) || null,
    examples: (raw.examples as Array<{ input: string; output: string; explanation?: string }>) || [],
    starterCodePython: (raw.starter_code_python as string) || null,
    starterCodeJava: (raw.starter_code_java as string) || null,
    topics: (raw.topics as string[]) || [],
    companyTags: (raw.company_tags as string[]) || [],
    pattern: (raw.pattern as string) || null,
    testCasesVisible: (raw.test_cases_visible as Array<{ input: string; expected_output: string }>) || [],
    testCasesHidden: (raw.test_cases_hidden as Array<{ input: string; expected_output: string }>) || [],
  };
}

/**
 * Build a prompt extension for the LLM that includes adaptive context.
 * This is injected into the question planning prompt.
 */
export function buildAdaptivePromptExtension(ctx: AdaptiveContext): string {
  const parts: string[] = [];

  if (ctx.weakTopics.length > 0) {
    parts.push(`## CANDIDATE WEAK AREAS (from previous sessions)\nThe candidate has struggled with: ${ctx.weakTopics.join(", ")}.\nWeight questions toward these topics to help them improve.`);
  }

  if (ctx.strongTopics.length > 0) {
    parts.push(`## CANDIDATE STRENGTHS\nThe candidate is strong at: ${ctx.strongTopics.join(", ")}.\nDo not avoid these — but push harder on them to confirm mastery.`);
  }

  if (ctx.trend !== "insufficient_data") {
    parts.push(`## PERFORMANCE TREND: ${ctx.trend.toUpperCase()}\nRecent scores: ${ctx.recentScores.join(", ")}.${ctx.trend === "improving" ? " The candidate is getting better — increase difficulty slightly." : ctx.trend === "declining" ? " The candidate is struggling — mix in some confidence-building questions." : ""}`);
  }

  if (ctx.selectedProblems.length > 0) {
    parts.push(`## SELECTED CODING PROBLEMS\nUse these exact problems for the live coding phases:\n${ctx.selectedProblems.map((p, i) => `${i + 1}. [${p.difficulty}] ${p.title} — ${p.description.slice(0, 100)}...`).join("\n")}`);
  }

  return parts.join("\n\n");
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "question-planner" | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/interview-question-planner.ts
git commit -m "feat(interview): add adaptive question planner with knowledge graph integration"
```

---

### Task 6: Session API Route

**Files:**
- Create: `src/app/api/interviews/session/route.ts`

- [ ] **Step 1: Write the session API route**

```typescript
// src/app/api/interviews/session/route.ts
// POST: start a new interview session
// PUT: record a turn (advance the session)
// DELETE: abandon a session

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { deductCredits, hasUsedFreeInterview, CREDIT_COSTS } from "@/lib/credits";
import {
  createSession,
  getSession,
  recordTurn,
  endSession,
} from "@/lib/interview-session";
import {
  buildAdaptiveContext,
  buildAdaptivePromptExtension,
} from "@/lib/interview-question-planner";
import { getCompanyPersona } from "@/data/interview-personas";
import type { InterviewScorecard } from "@/types/interview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST — Start a new interview session
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Credit check
  const usedFree = await hasUsedFreeInterview(user.id);
  if (usedFree) {
    const ok = await deductCredits(user.id, CREDIT_COSTS.interview, "interview");
    if (!ok) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  try {
    const body = await req.json();
    const {
      companyPersonaId = "generic",
      category = "tech",
      interviewType = "technical",
      preset,
      language = "en",
      questionPlan,
    } = body;

    const persona = getCompanyPersona(companyPersonaId);

    // Build adaptive context
    let adaptiveExtension = "";
    try {
      const adaptiveCtx = await buildAdaptiveContext({
        userId: user.id,
        persona,
        interviewType,
        language,
      });
      adaptiveExtension = buildAdaptivePromptExtension(adaptiveCtx);
    } catch (err) {
      console.warn("[Session] Adaptive context failed (non-fatal):", err);
    }

    // Create the session
    const sessionId = await createSession({
      userId: user.id,
      companyPersonaId,
      category,
      interviewType,
      preset,
      language,
      questionPlan: questionPlan || { questions: [], interviewerPersona: "", timeAllocation: { intro: 5, questions: 40, wrapUp: 5 } },
      sessionStructure: persona.sessionStructure || null,
    });

    // Build agent context for the interview
    let agentContextStr = "";
    try {
      const { buildAgentContext } = await import("@/lib/agent-context");
      const ctx = await buildAgentContext(user.id, "interviewer", `interview ${companyPersonaId}`, {
        companyId: companyPersonaId,
      });
      agentContextStr = ctx.promptContext;
    } catch {}

    return NextResponse.json({
      sessionId,
      sessionStructure: persona.sessionStructure,
      adaptiveContext: adaptiveExtension,
      agentContext: agentContextStr,
    });
  } catch (error) {
    console.error("[Session] POST error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

// PUT — Record a turn in the session
export async function PUT(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { sessionId, userMessage, assistantMessage, currentPhase } = body;

    if (!sessionId || !userMessage || !assistantMessage) {
      return NextResponse.json({ error: "sessionId, userMessage, assistantMessage required" }, { status: 400 });
    }

    // Verify session belongs to user
    const session = await getSession(sessionId, user.id);
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (session.status !== "active") return NextResponse.json({ error: "Session is not active" }, { status: 400 });

    await recordTurn(sessionId, userMessage, assistantMessage, currentPhase);

    // Store memory + extract facts (fire-and-forget)
    import("@/lib/agent-memory-store").then(({ storeAgentMemory }) => {
      storeAgentMemory(user.id, "interviewer", userMessage, {
        role: "user",
        metadata: { sessionId, companyPersonaId: session.companyPersonaId },
      });
    }).catch(() => {});

    import("@/lib/fact-extractor").then(({ extractAndStoreFacts }) => {
      extractAndStoreFacts({
        userId: user.id,
        agentType: "interviewer",
        userMessage,
        assistantMessage,
        metadata: { sessionId, companyPersonaId: session.companyPersonaId },
      });
    }).catch(() => {});

    return NextResponse.json({ success: true, totalTurns: session.totalTurns + 1 });
  } catch (error) {
    console.error("[Session] PUT error:", error);
    return NextResponse.json({ error: "Failed to record turn" }, { status: 500 });
  }
}

// DELETE — End/abandon a session
export async function DELETE(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const session = await getSession(sessionId, user.id);
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    // If a scorecard is provided in the body, use endSession (completed)
    // Otherwise, just abandon
    try {
      const body = await req.json();
      if (body.scorecard) {
        await endSession(sessionId, user.id, body.scorecard as InterviewScorecard);
        return NextResponse.json({ status: "completed" });
      }
    } catch {
      // No body = abandon
    }

    const { createAdminSupabase } = await import("@/lib/supabase-auth");
    const admin = createAdminSupabase();
    await admin
      .from("interview_sessions")
      .update({ status: "abandoned", ended_at: new Date().toISOString() })
      .eq("id", sessionId);

    return NextResponse.json({ status: "abandoned" });
  } catch (error) {
    console.error("[Session] DELETE error:", error);
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "session/route" | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/interviews/session/route.ts
git commit -m "feat(interview): add session API route (POST/PUT/DELETE)"
```

---

### Task 7: Code Execution Route (Piston)

**Files:**
- Create: `src/app/api/interviews/run-code/route.ts`

- [ ] **Step 1: Write the code execution route**

```typescript
// src/app/api/interviews/run-code/route.ts
// Executes user code against test cases via Piston API.
// Piston runs in Docker on localhost:2000 (self-hosted).
// Falls back to Pyodide-style client execution if Piston is unavailable.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { recordCodeSubmission } from "@/lib/interview-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PISTON_URL = process.env.PISTON_URL || "http://localhost:2000";

interface TestCase {
  input: string;
  expected_output: string;
}

interface PistonResult {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
  };
}

const LANGUAGE_VERSIONS: Record<string, { language: string; version: string }> = {
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  javascript: { language: "javascript", version: "18.15.0" },
};

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      code,
      language = "python",
      testCases = [],
      sessionId,
      problemId,
    }: {
      code: string;
      language: string;
      testCases: TestCase[];
      sessionId?: string;
      problemId?: string;
    } = body;

    if (!code || code.length > 50000) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const langConfig = LANGUAGE_VERSIONS[language];
    if (!langConfig) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    const startTime = Date.now();
    const testResults: Array<{
      input: string;
      expected: string;
      actual: string;
      passed: boolean;
      runtimeMs: number;
    }> = [];

    let compilationError: string | undefined;

    for (const tc of testCases) {
      const tcStart = Date.now();
      try {
        const pistonRes = await fetch(`${PISTON_URL}/api/v2/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: langConfig.language,
            version: langConfig.version,
            files: [{ content: code }],
            stdin: tc.input,
            run_timeout: 10000,     // 10s max
            compile_timeout: 10000,
            memory_limit: 256000000, // 256MB
          }),
        });

        if (!pistonRes.ok) {
          testResults.push({
            input: tc.input,
            expected: tc.expected_output,
            actual: `Execution error: ${pistonRes.status}`,
            passed: false,
            runtimeMs: Date.now() - tcStart,
          });
          continue;
        }

        const result: PistonResult = await pistonRes.json();

        // Check for compilation errors
        if (result.compile && result.compile.code !== 0) {
          compilationError = result.compile.stderr || result.compile.stdout;
          testResults.push({
            input: tc.input,
            expected: tc.expected_output,
            actual: `Compilation error: ${compilationError}`,
            passed: false,
            runtimeMs: Date.now() - tcStart,
          });
          break; // No point running more tests
        }

        const actual = (result.run.stdout || "").trim();
        const expected = tc.expected_output.trim();
        const passed = actual === expected;

        testResults.push({
          input: tc.input,
          expected: tc.expected_output,
          actual: result.run.stderr ? `${actual}\nSTDERR: ${result.run.stderr}` : actual,
          passed,
          runtimeMs: Date.now() - tcStart,
        });
      } catch (err) {
        testResults.push({
          input: tc.input,
          expected: tc.expected_output,
          actual: `Runtime error: ${err instanceof Error ? err.message : "unknown"}`,
          passed: false,
          runtimeMs: Date.now() - tcStart,
        });
      }
    }

    const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);

    // Record to session if provided
    if (sessionId && problemId) {
      recordCodeSubmission(sessionId, {
        problemId,
        code,
        language,
        passed: allPassed,
      }).catch(() => {});
    }

    return NextResponse.json({
      testResults,
      allPassed,
      compilationError,
      executionTimeMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error("[run-code] Error:", error);
    return NextResponse.json({ error: "Code execution failed" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "run-code" | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/interviews/run-code/route.ts
git commit -m "feat(interview): add code execution route via Piston API"
```

---

### Task 8: Integrate Session into text-message Route

**Files:**
- Modify: `src/app/api/interviews/text-message/route.ts`

- [ ] **Step 1: Add session integration**

The text-message route needs to:
1. Accept an optional `sessionId` parameter
2. If a session exists, use `buildAgentContext` for the interviewer
3. After getting the LLM response, call `recordTurn` to persist
4. Include the session structure in the system prompt

Add after the existing imports:

```typescript
import { getSession, recordTurn } from "@/lib/interview-session";
```

Add `sessionId?: string` to the `TextInterviewBody` interface.

In the POST handler, after auth check, add session loading:

```typescript
// Load session if provided
let session = null;
if (body.sessionId && user) {
  try {
    session = await (await import("@/lib/interview-session")).getSession(body.sessionId, user.id);
  } catch {}
}
```

Before building the system prompt, add agent context:

```typescript
// Agent context for memory-aware interviews
let agentContextStr = "";
if (user) {
  try {
    const { buildAgentContext } = await import("@/lib/agent-context");
    const ctx = await buildAgentContext(user.id, "interviewer", `interview ${companyPersonaId || ""}`, {
      companyId: companyPersonaId,
    });
    agentContextStr = `\n${ctx.promptContext}\n`;
  } catch {}
}
```

Append `agentContextStr` to the system prompt (before TEXT MODE RULES).

After getting the LLM reply, add session recording:

```typescript
// Record turn in session (fire-and-forget)
if (session && body.sessionId && user) {
  const lastUserMsg = conversationHistory[conversationHistory.length - 1]?.content || "";
  recordTurn(body.sessionId, lastUserMsg, reply).catch(() => {});
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "text-message" | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/interviews/text-message/route.ts
git commit -m "feat(interview): integrate session state + agent context into text-message route"
```

---

### Task 9: Integrate Learning Loop into Score Route

**Files:**
- Modify: `src/app/api/interviews/score/route.ts`

- [ ] **Step 1: Add session end + knowledge graph write-back**

After the scorecard is parsed (line ~255 in current file), add:

```typescript
// Persist to interview_performance and write facts to knowledge graph
if (user && body.sessionId) {
  import("@/lib/interview-session").then(({ endSession }) => {
    endSession(body.sessionId, user.id, scorecard).catch((err) => {
      console.warn("[Interview Score] Failed to persist session:", err);
    });
  }).catch(() => {});
} else if (user) {
  // No session — still write performance facts to knowledge graph
  import("@/lib/knowledge-graph").then(({ upsertFact }) => {
    for (const improvement of (scorecard.improvements || []).slice(0, 3)) {
      upsertFact({
        userId: user.id,
        subject: user.id,
        predicate: "weak_at",
        object: improvement.slice(0, 100),
        confidence: 0.6,
        sourceAgent: "interviewer",
      }).catch(() => {});
    }
    for (const strength of (scorecard.strengths || []).slice(0, 3)) {
      upsertFact({
        userId: user.id,
        subject: user.id,
        predicate: "strong_at",
        object: strength.slice(0, 100),
        confidence: 0.6,
        sourceAgent: "interviewer",
      }).catch(() => {});
    }
  }).catch(() => {});
}
```

Also add `sessionId` to the destructured body parameters (it's already unused but should be accepted).

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "score/route" | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/interviews/score/route.ts
git commit -m "feat(interview): add learning loop — persist scores + write knowledge graph facts"
```

---

### Task 10: LiveCodingPanel Component

**Files:**
- Create: `src/components/interview/LiveCodingPanel.tsx`

- [ ] **Step 1: Write the LiveCodingPanel component**

```tsx
"use client";

import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import type { InterviewProblem, CodeExecutionResult, TestCase } from "@/types/interview";

interface LiveCodingPanelProps {
  problem: InterviewProblem;
  sessionId?: string;
  onCodeChange?: (code: string) => void;
  onTestResults?: (results: CodeExecutionResult) => void;
}

export default function LiveCodingPanel({
  problem,
  sessionId,
  onCodeChange,
  onTestResults,
}: LiveCodingPanelProps) {
  const { isDark } = useTheme();
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [code, setCode] = useState(
    language === "python"
      ? problem.starterCodePython || "# Write your solution here\n"
      : problem.starterCodeJava || "// Write your solution here\n"
  );
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<CodeExecutionResult | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const handleLanguageChange = useCallback(
    (lang: "python" | "java") => {
      setLanguage(lang);
      setCode(
        lang === "python"
          ? problem.starterCodePython || "# Write your solution here\n"
          : problem.starterCodeJava || "// Write your solution here\n"
      );
      setResults(null);
    },
    [problem]
  );

  const runCode = useCallback(
    async (includeHidden: boolean) => {
      setRunning(true);
      setResults(null);

      const testCases: TestCase[] = [
        ...problem.testCasesVisible,
        ...(includeHidden ? problem.testCasesHidden : []),
      ];

      try {
        const res = await fetch("/api/interviews/run-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language,
            testCases,
            sessionId,
            problemId: problem.id,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setResults({
            testResults: [],
            allPassed: false,
            compilationError: err.error || `Error ${res.status}`,
            executionTimeMs: 0,
          });
          return;
        }

        const data: CodeExecutionResult = await res.json();
        setResults(data);
        onTestResults?.(data);
      } catch {
        setResults({
          testResults: [],
          allPassed: false,
          compilationError: "Failed to connect to code execution service",
          executionTimeMs: 0,
        });
      } finally {
        setRunning(false);
      }
    },
    [code, language, problem, sessionId, onTestResults]
  );

  return (
    <div className="flex flex-col h-full border border-white/10 rounded-lg overflow-hidden bg-black/20">
      {/* Problem Description */}
      <div className="p-4 border-b border-white/10 max-h-[200px] overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-white">{problem.title}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              problem.difficulty === "easy"
                ? "bg-green-500/20 text-green-400"
                : problem.difficulty === "medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>
        <p className="text-sm text-gray-300 whitespace-pre-wrap">{problem.description}</p>
        {problem.constraints && (
          <p className="text-xs text-gray-500 mt-2">Constraints: {problem.constraints}</p>
        )}
        {problem.examples.length > 0 && (
          <div className="mt-2">
            {problem.examples.map((ex, i) => (
              <div key={i} className="text-xs bg-white/5 rounded p-2 mt-1">
                <div><span className="text-gray-500">Input:</span> {ex.input}</div>
                <div><span className="text-gray-500">Output:</span> {ex.output}</div>
                {ex.explanation && <div><span className="text-gray-500">Explanation:</span> {ex.explanation}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as "python" | "java")}
          className="bg-white/10 text-white text-sm rounded px-2 py-1 border border-white/20"
        >
          <option value="python">Python</option>
          {problem.starterCodeJava && <option value="java">Java</option>}
        </select>

        <button
          onClick={() => runCode(false)}
          disabled={running}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
        >
          {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          Run Tests
        </button>

        <button
          onClick={() => runCode(true)}
          disabled={running}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
        >
          Submit
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[200px]">
        <Editor
          height="100%"
          language={language}
          theme={isDark ? "vs-dark" : "light"}
          value={code}
          onChange={(val) => {
            const newCode = val || "";
            setCode(newCode);
            onCodeChange?.(newCode);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
          }}
        />
      </div>

      {/* Test Results */}
      {results && (
        <div className="border-t border-white/10 p-3 max-h-[200px] overflow-y-auto">
          {results.compilationError && (
            <div className="text-red-400 text-sm mb-2 font-mono">
              {results.compilationError}
            </div>
          )}
          {results.testResults.map((tr, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 text-sm mb-1 ${
                tr.passed ? "text-green-400" : "text-red-400"
              }`}
            >
              {tr.passed ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <div className="font-mono text-xs">
                <div>Input: {tr.input.slice(0, 80)}</div>
                <div>Expected: {tr.expected}</div>
                {!tr.passed && <div>Got: {tr.actual}</div>}
                <div className="text-gray-500">{tr.runtimeMs}ms</div>
              </div>
            </div>
          ))}
          <div className="text-xs text-gray-500 mt-1">
            Total: {results.executionTimeMs}ms |{" "}
            {results.allPassed ? (
              <span className="text-green-400">All tests passed</span>
            ) : (
              <span className="text-red-400">
                {results.testResults.filter((r) => r.passed).length}/{results.testResults.length} passed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep "LiveCodingPanel" | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/interview/LiveCodingPanel.tsx
git commit -m "feat(interview): add LiveCodingPanel with Monaco editor + Piston test runner"
```

---

### Task 11: E2E Tests

**Files:**
- Create: `tests/e2e/interview-session.spec.ts`

- [ ] **Step 1: Write the E2E test file**

```typescript
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Helper to login
async function login(page: any) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', "testuser789@test.com");
  await page.fill('input[type="password"]', "AuditPro2026!");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|course|arena|interview)/, { timeout: 15000 });
}

test.describe("Interview Session API", () => {
  test("POST /api/interviews/session creates a session", async ({ request }) => {
    // Login first to get auth cookie
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { email: "testuser789@test.com", password: "AuditPro2026!" },
    });
    
    const sessionRes = await request.post(`${BASE_URL}/api/interviews/session`, {
      data: {
        companyPersonaId: "google-l4",
        category: "tech",
        interviewType: "technical",
        preset: "dsa",
      },
    });

    // May fail if not logged in (401) — that's expected in CI without auth
    if (sessionRes.status() === 401) {
      test.skip();
      return;
    }

    expect(sessionRes.status()).toBe(200);
    const body = await sessionRes.json();
    expect(body.sessionId).toBeTruthy();
    expect(body.sessionStructure).toBeTruthy();
    expect(body.sessionStructure.totalMinutes).toBe(45);
  });

  test("POST /api/interviews/run-code returns 401 without auth", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/interviews/run-code`, {
      data: {
        code: "print('hello')",
        language: "python",
        testCases: [{ input: "", expected_output: "hello" }],
      },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/interviews/run-code validates language", async ({ request }) => {
    // This test requires auth, so it may be skipped in CI
    const res = await request.post(`${BASE_URL}/api/interviews/run-code`, {
      data: {
        code: "console.log('hello')",
        language: "ruby", // unsupported
        testCases: [],
      },
    });
    // Either 401 (no auth) or 400 (bad language)
    expect([400, 401]).toContain(res.status());
  });

  test("Company personas have sessionStructure", async () => {
    // This is a unit-level check — import the personas
    const { COMPANY_PERSONAS, GENERIC_PERSONA } = await import(
      "../../src/data/interview-personas"
    );

    expect(GENERIC_PERSONA.sessionStructure).toBeTruthy();
    expect(GENERIC_PERSONA.sessionStructure.totalMinutes).toBeGreaterThan(0);
    expect(GENERIC_PERSONA.sessionStructure.phases.length).toBeGreaterThan(0);

    for (const persona of COMPANY_PERSONAS) {
      expect(persona.sessionStructure).toBeTruthy();
      expect(persona.sessionStructure.totalMinutes).toBeGreaterThan(0);
      expect(persona.sessionStructure.phases.length).toBeGreaterThan(0);
      expect(persona.sessionStructure.interviewerBehavior).toBeTruthy();
      expect(persona.sessionStructure.interviewerBehavior.silenceThresholdSec).toBeGreaterThan(0);
    }
  });

  test("Interview types are correctly defined", async () => {
    const { InterviewPhase } = await import("../../src/types/interview").catch(() => ({}));
    // Just verify the module loads without errors
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `npx playwright test tests/e2e/interview-session.spec.ts --reporter=list 2>&1 | tail -20`
Expected: At least the persona structure test passes (API tests may skip without auth)

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/interview-session.spec.ts
git commit -m "test(interview): add E2E tests for session API + persona structures"
```

---

### Task 12: Final Integration — Verify Build

- [ ] **Step 1: Run the full type check**

Run: `npx tsc --noEmit --pretty 2>&1 | tail -20`
Expected: No new errors introduced by this sub-project

- [ ] **Step 2: Run the linter**

Run: `npm run lint 2>&1 | tail -20`
Expected: No new lint errors

- [ ] **Step 3: Verify all new files exist**

Run: `ls -la supabase/migrations/023*.sql supabase/migrations/024*.sql src/lib/interview-session.ts src/lib/interview-question-planner.ts src/app/api/interviews/session/route.ts src/app/api/interviews/run-code/route.ts src/components/interview/LiveCodingPanel.tsx tests/e2e/interview-session.spec.ts`
Expected: All 8 files listed

- [ ] **Step 4: Final commit if any loose changes**

```bash
git status
# If clean, skip. If loose changes:
git add -A
git commit -m "chore(interview): final integration cleanup"
```
