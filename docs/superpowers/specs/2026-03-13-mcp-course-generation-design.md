# MCP-Powered Dynamic Course Generation — Design Spec

## Goal
Enable Grokking to generate high-quality interactive courses from top institution syllabi (Harvard, MIT, Anthropic, Google) using Tavily search + LLM generation, with both admin bulk generation (via Claude Code MCP) and user-requested on-demand generation.

## Architecture

### Two Entry Points, One Pipeline
1. **Dev time (Claude Code)**: Uses Tavily MCP server as a tool for bulk course generation
2. **Runtime (Next.js)**: Calls Tavily API + Kimi K2 directly for user-requested generation

Both paths use the same `CourseGenerator` library (`src/lib/course-generator.ts`).

### Storage
Generated courses stored in Supabase `generated_courses` table as JSONB. At runtime, the course registry merges hardcoded courses (from `src/data/`) with generated courses (from Supabase).

### Course Structure
Generated courses use the exact same `Course/Module/Lesson` types as hardcoded courses, plus additional fields for coaching quality:
- `hints: string[]` — 3-4 progressive hints per exercise
- `coachContext: string` — injected into Coach Alex's system prompt for that lesson
- `testCases: string` — assert statements for auto-grading

## Database Schema

```sql
-- Migration 004: Generated courses
CREATE TABLE IF NOT EXISTS generated_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  tier TEXT NOT NULL DEFAULT 'pro' CHECK (tier IN ('free', 'pro')),
  source_url TEXT,
  source_name TEXT, -- "Harvard CS50", "MIT 6.006", etc.
  course_data JSONB NOT NULL, -- Full {modules: [{lessons: [...]}]} structure
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'failed', 'draft')),
  created_by UUID REFERENCES auth.users(id),
  is_curated BOOLEAN DEFAULT false,
  generation_log TEXT, -- Progress/error log
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_gen_courses_slug ON generated_courses(slug);
CREATE INDEX idx_gen_courses_status ON generated_courses(status);
CREATE INDEX idx_gen_courses_curated ON generated_courses(is_curated, status);

ALTER TABLE generated_courses ENABLE ROW LEVEL SECURITY;

-- Curated courses visible to all, user-generated visible to creator + admins
CREATE POLICY "view_courses" ON generated_courses
  FOR SELECT USING (
    is_curated = true AND status = 'ready'
    OR auth.uid() = created_by
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "create_courses" ON generated_courses
  FOR INSERT WITH CHECK (auth.uid() = created_by);
```

## Generation Pipeline

### Step 1: Syllabus Discovery
- Input: Course name or URL (e.g., "Harvard CS50" or "https://cs50.harvard.edu")
- Tavily searches for: `[course name] syllabus topics modules`
- Extract: ordered list of module titles and lesson topics
- Output: `{modules: [{title, description, lessonTopics: string[]}]}`

### Step 2: Content Enrichment (per lesson)
- Tavily searches for each lesson topic: `[topic] tutorial explanation examples`
- Also searches: `[topic] coding exercise practice problem`
- Collects: best explanations, code examples, common mistakes
- Output: `{references: string[], codeExamples: string[], commonMistakes: string[]}`

### Step 3: Lesson Generation (per lesson, via Kimi K2)
System prompt enforces structured output:
```
Generate a lesson for the Grokking learning platform.

LESSON TOPIC: [topic]
MODULE: [module title]
COURSE: [course title] (based on [source institution])
REFERENCE MATERIAL: [enrichment results]

OUTPUT FORMAT (JSON):
{
  "title": "Lesson title",
  "content": "Full markdown lesson content with:\n- Concept explanation\n- Real-world analogy\n- Worked example with code\n- Common pitfalls\n- Key takeaways",
  "starterCode": "Python/JS starter with TODO comments and 60% scaffolding",
  "solutionCode": "Complete solution with comments and assert test cases",
  "hints": ["Hint 1: gentle nudge", "Hint 2: specific direction", "Hint 3: detailed approach"],
  "coachContext": "Key concepts: X, Y. Common mistakes: A, B. If student struggles with X, suggest thinking about Y.",
  "testCases": "assert function(input) == expected_output"
}
```

### Step 4: Assembly & Storage
- Combine all generated lessons into modules
- Generate course-level description and icon
- Store as JSONB in `generated_courses` table
- Set status to "ready"

## Runtime Integration

### Course Registry Merge
`src/lib/course-registry.ts` replaces direct import of `courses` array:
```typescript
// Returns hardcoded courses + generated courses from Supabase
export async function getAllCourses(): Promise<Course[]>
// Client-side: cached in React context, refreshed on navigation
```

### User-Requested Generation
- API route: `POST /api/courses/generate`
- Input: `{query: "Harvard CS50"}` or `{url: "https://cs50.harvard.edu"}`
- Returns: `{courseId, status: "generating"}` immediately
- Generation runs in background
- User polls `GET /api/courses/[id]/status` or gets notified when ready
- Costs credits (e.g., 50 credits per course generation)

### Admin Curation
- Admin can mark any generated course as `is_curated = true`
- Curated courses appear in the main catalog for all users
- Non-curated courses only visible to the creator

## Pre-Seeded Courses (Admin-Generated)

Initial catalog to generate via Claude Code:
1. Harvard CS50 — Intro to Computer Science
2. MIT 6.006 — Introduction to Algorithms
3. Google Machine Learning Crash Course
4. Anthropic Prompt Engineering Guide
5. Stanford CS229 — Machine Learning
6. freeCodeCamp Web Development Curriculum

## Quality Controls

1. **Structured template** — every lesson follows concept → analogy → example → pitfalls → exercise
2. **Progressive hints** — 3-4 hints generated with each exercise, stored with the lesson
3. **Coach context** — per-lesson coaching instructions injected into Coach Alex's prompt
4. **Test cases** — assert statements in solution code for auto-grading
5. **Source attribution** — every generated course shows "Based on [institution] curriculum"

## Files to Create/Modify

### New Files
- `supabase/migrations/004_generated_courses.sql` — DB schema
- `src/lib/course-generator.ts` — generation pipeline (shared by dev + runtime)
- `src/lib/course-registry.ts` — merges hardcoded + generated courses
- `src/app/api/courses/generate/route.ts` — user-triggered generation
- `src/app/api/courses/[id]/status/route.ts` — generation status polling
- `src/components/course/GenerateCourseModal.tsx` — UI for requesting course generation

### Modified Files
- `src/app/page.tsx` — course catalog loads from registry (not just hardcoded array)
- `src/app/course/[courseSlug]/[lessonSlug]/page.tsx` — look up course from registry
- `src/components/ai/AICoach.tsx` — inject lesson's `coachContext` into prompts
- `src/app/api/ai/coach/route.ts` — accept and use `coachContext` field
- `src/app/api/ai/voice-session/route.ts` — accept and use `coachContext` field

## Tech Stack
- **Search**: Tavily API (direct at runtime, MCP at dev time)
- **LLM**: Kimi K2 Turbo (primary), Gemini (fallback)
- **Storage**: Supabase (JSONB)
- **Generation credit cost**: 50 credits per course
