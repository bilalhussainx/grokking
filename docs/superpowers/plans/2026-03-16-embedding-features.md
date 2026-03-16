# Embedding Features Implementation Plan (Phases 1-4)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan.

**Goal:** Build 4 embedding-powered features that leverage Samsara's multi-domain course vectors.

**Architecture:** All features use the existing 57 course embeddings (768-dim Gemini vectors in pgvector). Phase 1 needs lesson-level embeddings (new). Phases 2-3 use existing conversation memory embeddings. Phase 4 extends the glossary.

**Tech Stack:** Gemini embedding-001, pgvector, Supabase RPC functions, Next.js API routes, React components.

---

## Phase 1: Cross-Domain Concept Bridges

### Task 1: Lesson Embeddings Migration + Seeding

**Files:**
- Create: `supabase/migrations/007_lesson_embeddings.sql`
- Modify: `scripts/seed-embeddings.ts`

- [ ] **Step 1: Create migration for lesson_embeddings table**

```sql
CREATE TABLE IF NOT EXISTS lesson_embeddings (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  course_domain TEXT,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content_preview TEXT,
  embedding vector(768) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lesson_embeddings_vector_idx
  ON lesson_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

- [ ] **Step 2: Add lesson embedding function to `src/lib/embeddings.ts`**

```typescript
export async function embedLesson(lesson, courseId, courseDomain, moduleId) {
  const text = `Lesson: ${lesson.title}. ${lesson.content.slice(0, 1500)}`;
  const embedding = await embedText(text, "RETRIEVAL_DOCUMENT");
  // upsert into lesson_embeddings
}
```

- [ ] **Step 3: Add lesson seeding to seed script**

- [ ] **Step 4: Run migration + seed**

### Task 2: Cross-Domain Bridge Discovery Script

**Files:**
- Create: `scripts/discover-bridges.ts`
- Create: `supabase/migrations/008_concept_bridges.sql`

- [ ] **Step 1: Create concept_bridges table**
- [ ] **Step 2: Write bridge discovery script** — for each lesson, find top 3 most similar lessons in OTHER domains
- [ ] **Step 3: Use Moonshot to generate bridge explanations**
- [ ] **Step 4: Run and populate**

### Task 3: "Unexpected Connections" UI Component

**Files:**
- Create: `src/components/lesson/ConceptBridges.tsx`
- Modify: `src/components/lesson/LessonPage.tsx`

- [ ] **Step 1: Create API route** `GET /api/bridges?lessonId=X`
- [ ] **Step 2: Build component** — shows 1-2 bridge cards at bottom of lessons
- [ ] **Step 3: Wire into LessonPage**

---

## Phase 2: Semantic Forgetting Curve

### Task 4: Forgetting Detection API

**Files:**
- Create: `src/app/api/ai/forgetting/route.ts`

- [ ] **Step 1: API that compares user's recent interaction embeddings to completed lesson embeddings**
- [ ] **Step 2: Returns lessons where similarity has dropped below threshold**

### Task 5: Refresher Notification Component

**Files:**
- Create: `src/components/gamification/ForgettingAlert.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build component showing fading knowledge alerts**
- [ ] **Step 2: Add to homepage for logged-in users**

---

## Phase 3: Knowledge Fingerprinting

### Task 6: Articulation Analysis

**Files:**
- Create: `src/lib/articulation.ts`
- Create: `src/app/api/ai/articulation/route.ts`

- [ ] **Step 1: Function that compares voice transcript embedding to lesson embedding**
- [ ] **Step 2: API endpoint returning articulation score + gaps**

### Task 7: Understanding Depth Indicator

**Files:**
- Create: `src/components/lesson/UnderstandingDepth.tsx`
- Modify: `src/components/lesson/LessonPage.tsx`

- [ ] **Step 1: Component showing articulation score for completed lessons**
- [ ] **Step 2: Wire into lesson page**

---

## Phase 4: Glossary Context Morphing

### Task 8: Multi-Definition Glossary

**Files:**
- Modify: `src/data/glossary.ts` — add domain-specific definitions
- Modify: `src/components/lesson/GlossaryTooltip.tsx` — context-aware selection

- [ ] **Step 1: Expand glossary with domain variants for ambiguous terms**
- [ ] **Step 2: Use lesson domain to select the right definition**
