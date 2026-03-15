---
name: content-embedding
description: >
  Use when embedding course/lesson/user content with Gemini embeddings, performing
  semantic or hybrid search, building RAG pipelines for dynamic content creation, or
  generating personalized recommendations. Handles embedding creation, pgvector storage,
  hybrid search (vector + keyword), user profile embedding, content gap detection,
  and recommendation generation.
type: skill
trigger: Embedding content, searching courses, building recommendations, detecting content gaps, RAG queries
version: "1.0.0"
author: Samsara.ai
platform: samsara
depends_on:
  - course-planning    # Course metadata for embedding
  - lesson-planning    # Lesson content for embedding
integrates_with:
  - video-generation   # Video metadata embedded for search
  - Tavily MCP         # Research results inform embeddings
outputs:
  - Gemini embeddings (768-dimensional vectors)
  - pgvector records in Supabase
  - Semantic search results
  - Content gap reports
  - Personalized recommendations
---

# Content Embedding Skill

You are the Samsara.ai content intelligence agent. Your job is to embed all platform
content using Gemini embeddings, enable semantic search, build RAG pipelines for
dynamic content creation, and generate personalized recommendations by combining
user data with course embeddings.

## Core Principle

Every piece of content and every user interaction creates an embedding that makes
the platform smarter. Embeddings connect users to content, content to content, and
gaps to opportunities.

---

## Step 0: Embedding Model Configuration

```yaml
model: gemini-embedding-001
dimensions: 768                    # Balance of quality vs storage
pricing: $0.15 per 1M tokens      # ~$0.0001 per embedding
storage: Supabase pgvector
update_frequency:
  courses: On creation + on content update
  lessons: On creation + on content update
  users: After each checkpoint + daily batch
  videos: On video creation
```

---

## Step 1: Database Schema (Supabase)

### Required Tables

```sql
-- Enable pgvector extension (run once)
CREATE EXTENSION IF NOT EXISTS vector;

-- Course embeddings
CREATE TABLE course_embeddings (
  id TEXT PRIMARY KEY,                    -- course slug
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  variation TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'advanced')),
  module_titles TEXT[],                   -- for keyword search
  embedding vector(768) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lesson content embeddings (chunked)
CREATE TABLE lesson_embeddings (
  id TEXT PRIMARY KEY,                    -- lesson slug
  course_id TEXT REFERENCES course_embeddings(id),
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content_preview TEXT,                   -- first 500 chars for display
  concepts TEXT[],                        -- key concepts for keyword search
  embedding vector(768) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User profile embeddings
CREATE TABLE user_embeddings (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  completed_courses TEXT[],
  strong_topics TEXT[],
  weak_topics TEXT[],
  interests TEXT[],
  career_goals TEXT[],
  embedding vector(768) NOT NULL,
  consent_given BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Video metadata embeddings
CREATE TABLE video_embeddings (
  lesson_id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES course_embeddings(id),
  video_type TEXT NOT NULL,
  narration_summary TEXT,                 -- short summary for search
  embedding vector(768) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast similarity search
CREATE INDEX ON course_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON lesson_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON user_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Full-text search indexes for hybrid search
CREATE INDEX ON course_embeddings USING gin (to_tsvector('english', title || ' ' || description));
CREATE INDEX ON lesson_embeddings USING gin (to_tsvector('english', title || ' ' || content_preview));
```

---

## Step 2: Embedding Generation

### What to Embed and How

```typescript
// src/lib/embeddings.ts

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL = 'gemini-embedding-001';
const DIMENSIONS = 768;

// ─── Core embedding function ───

async function embed(
  text: string,
  taskType: 'SEMANTIC_SIMILARITY' | 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' = 'SEMANTIC_SIMILARITY'
): Promise<number[]> {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: DIMENSIONS,
      }),
    }
  );

  if (!resp.ok) throw new Error(`Embedding failed: ${resp.status}`);
  const data = await resp.json();
  return data.embedding.values;
}

// ─── Course embedding ───

async function embedCourse(course: Course, domain: string, variation: string, level: string) {
  const text = [
    `Course: ${course.title}`,
    `Description: ${course.description}`,
    `Domain: ${domain}, Variation: ${variation}, Level: ${level}`,
    `Modules: ${course.modules.map(m => m.title).join(', ')}`,
    `Key topics: ${course.modules.flatMap(m => m.lessons.map(l => l.title)).join(', ')}`,
  ].join('. ');

  const embedding = await embed(text, 'RETRIEVAL_DOCUMENT');

  await supabase.from('course_embeddings').upsert({
    id: course.id,
    title: course.title,
    description: course.description,
    domain,
    variation,
    level,
    module_titles: course.modules.map(m => m.title),
    embedding: `[${embedding.join(',')}]`,
  });
}

// ─── Lesson embedding (chunk if content is long) ───

async function embedLesson(lesson: Lesson, courseId: string, moduleId: string, concepts: string[]) {
  // For lessons under 2000 tokens, embed as-is
  // For longer lessons, chunk and embed separately (each chunk gets its own row)
  const text = [
    `Lesson: ${lesson.title}`,
    `Concepts: ${concepts.join(', ')}`,
    `Content: ${lesson.content.slice(0, 1500)}`, // First 1500 chars for embedding
  ].join('. ');

  const embedding = await embed(text, 'RETRIEVAL_DOCUMENT');

  await supabase.from('lesson_embeddings').upsert({
    id: lesson.id,
    course_id: courseId,
    module_id: moduleId,
    title: lesson.title,
    content_preview: lesson.content.slice(0, 500),
    concepts,
    embedding: `[${embedding.join(',')}]`,
  });
}

// ─── User profile embedding ───

async function embedUserProfile(userId: string) {
  const profile = await supabase.from('user_profiles').select('*').eq('user_id', userId).single();
  const checkpoints = await supabase.from('checkpoint_results')
    .select('voice_summary, concepts_covered, concepts_missed')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  const parts = [
    `Completed: ${profile.data?.completed_courses?.join(', ') || 'none'}`,
    `Strong: ${profile.data?.strong_topics?.join(', ') || 'none'}`,
    `Weak: ${profile.data?.weak_topics?.join(', ') || 'none'}`,
    `Interests: ${profile.data?.interests?.join(', ') || 'general'}`,
    `Goals: ${profile.data?.career_goals?.join(', ') || 'learning'}`,
  ];

  // Add recent checkpoint summaries — richest learning signal
  if (checkpoints.data?.length) {
    const summaries = checkpoints.data
      .filter(c => c.voice_summary)
      .map(c => c.voice_summary)
      .slice(0, 5);
    if (summaries.length) {
      parts.push(`Recent understanding: ${summaries.join(' | ')}`);
    }
  }

  const embedding = await embed(parts.join('. '), 'RETRIEVAL_DOCUMENT');

  await supabase.from('user_embeddings').upsert({
    user_id: userId,
    completed_courses: profile.data?.completed_courses || [],
    strong_topics: profile.data?.strong_topics || [],
    weak_topics: profile.data?.weak_topics || [],
    interests: profile.data?.interests || [],
    career_goals: profile.data?.career_goals || [],
    embedding: `[${embedding.join(',')}]`,
    consent_given: profile.data?.embedding_consent || false,
  });
}
```

---

## Step 3: Hybrid Search (Vector + Keyword)

### Supabase Functions

```sql
-- Hybrid search combining vector similarity + full-text keyword matching
-- Uses Reciprocal Rank Fusion (RRF) to combine results

CREATE OR REPLACE FUNCTION hybrid_course_search(
  query_text text,
  query_embedding vector(768),
  match_count int DEFAULT 5,
  vector_weight float DEFAULT 0.7,
  text_weight float DEFAULT 0.3,
  filter_domain text DEFAULT NULL,
  filter_level text DEFAULT NULL
)
RETURNS TABLE(
  id text,
  title text,
  description text,
  domain text,
  variation text,
  level text,
  similarity float,
  text_rank float,
  combined_score float
)
LANGUAGE sql STABLE
AS $$
  WITH vector_results AS (
    SELECT id, title, description, domain, variation, level,
           1 - (embedding <=> query_embedding) as similarity,
           ROW_NUMBER() OVER (ORDER BY embedding <=> query_embedding) as vrank
    FROM course_embeddings
    WHERE (filter_domain IS NULL OR domain = filter_domain)
      AND (filter_level IS NULL OR level = filter_level)
      AND 1 - (embedding <=> query_embedding) > 0.4
    LIMIT match_count * 3
  ),
  text_results AS (
    SELECT id, title, description, domain, variation, level,
           ts_rank(
             to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || array_to_string(module_titles, ' ')),
             plainto_tsquery('english', query_text)
           ) as text_rank,
           ROW_NUMBER() OVER (ORDER BY ts_rank(
             to_tsvector('english', title || ' ' || COALESCE(description, '')),
             plainto_tsquery('english', query_text)
           ) DESC) as trank
    FROM course_embeddings
    WHERE to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || array_to_string(module_titles, ' '))
          @@ plainto_tsquery('english', query_text)
      AND (filter_domain IS NULL OR domain = filter_domain)
      AND (filter_level IS NULL OR level = filter_level)
    LIMIT match_count * 3
  ),
  -- Reciprocal Rank Fusion
  rrf AS (
    SELECT
      COALESCE(v.id, t.id) as id,
      COALESCE(v.title, t.title) as title,
      COALESCE(v.description, t.description) as description,
      COALESCE(v.domain, t.domain) as domain,
      COALESCE(v.variation, t.variation) as variation,
      COALESCE(v.level, t.level) as level,
      COALESCE(v.similarity, 0) as similarity,
      COALESCE(t.text_rank, 0) as text_rank,
      -- RRF formula: 1/(k+rank) with k=60
      (CASE WHEN v.vrank IS NOT NULL THEN 1.0/(60 + v.vrank) * vector_weight ELSE 0 END) +
      (CASE WHEN t.trank IS NOT NULL THEN 1.0/(60 + t.trank) * text_weight ELSE 0 END) as combined_score
    FROM vector_results v
    FULL OUTER JOIN text_results t ON v.id = t.id
  )
  SELECT * FROM rrf
  ORDER BY combined_score DESC
  LIMIT match_count;
$$;

-- Similar function for lesson search
CREATE OR REPLACE FUNCTION hybrid_lesson_search(
  query_text text,
  query_embedding vector(768),
  match_count int DEFAULT 10,
  filter_course_id text DEFAULT NULL
)
RETURNS TABLE(
  id text,
  course_id text,
  title text,
  content_preview text,
  similarity float,
  combined_score float
)
LANGUAGE sql STABLE
AS $$
  -- Same RRF pattern as above, against lesson_embeddings table
  WITH vector_results AS (
    SELECT id, course_id, title, content_preview,
           1 - (embedding <=> query_embedding) as similarity,
           ROW_NUMBER() OVER (ORDER BY embedding <=> query_embedding) as vrank
    FROM lesson_embeddings
    WHERE (filter_course_id IS NULL OR course_id = filter_course_id)
      AND 1 - (embedding <=> query_embedding) > 0.4
    LIMIT match_count * 3
  ),
  text_results AS (
    SELECT id, course_id, title, content_preview,
           ts_rank(to_tsvector('english', title || ' ' || COALESCE(content_preview, '')),
                   plainto_tsquery('english', query_text)) as text_rank,
           ROW_NUMBER() OVER (ORDER BY ts_rank(
             to_tsvector('english', title || ' ' || COALESCE(content_preview, '')),
             plainto_tsquery('english', query_text)) DESC) as trank
    FROM lesson_embeddings
    WHERE to_tsvector('english', title || ' ' || COALESCE(content_preview, ''))
          @@ plainto_tsquery('english', query_text)
      AND (filter_course_id IS NULL OR course_id = filter_course_id)
    LIMIT match_count * 3
  )
  SELECT
    COALESCE(v.id, t.id) as id,
    COALESCE(v.course_id, t.course_id) as course_id,
    COALESCE(v.title, t.title) as title,
    COALESCE(v.content_preview, t.content_preview) as content_preview,
    COALESCE(v.similarity, 0) as similarity,
    (COALESCE(1.0/(60 + v.vrank), 0) * 0.7 + COALESCE(1.0/(60 + t.trank), 0) * 0.3) as combined_score
  FROM vector_results v
  FULL OUTER JOIN text_results t ON v.id = t.id
  ORDER BY combined_score DESC
  LIMIT match_count;
$$;
```

### TypeScript Search Client

```typescript
// src/lib/search.ts

async function searchCourses(query: string, filters?: {
  domain?: string;
  level?: string;
  limit?: number;
}) {
  const queryEmbedding = await embed(query, 'RETRIEVAL_QUERY');

  const { data, error } = await supabase.rpc('hybrid_course_search', {
    query_text: query,
    query_embedding: `[${queryEmbedding.join(',')}]`,
    match_count: filters?.limit || 5,
    vector_weight: 0.7,
    text_weight: 0.3,
    filter_domain: filters?.domain || null,
    filter_level: filters?.level || null,
  });

  if (error) throw error;
  return data;
}

async function searchLessons(query: string, courseId?: string, limit: number = 10) {
  const queryEmbedding = await embed(query, 'RETRIEVAL_QUERY');

  const { data, error } = await supabase.rpc('hybrid_lesson_search', {
    query_text: query,
    query_embedding: `[${queryEmbedding.join(',')}]`,
    match_count: limit,
    filter_course_id: courseId || null,
  });

  if (error) throw error;
  return data;
}
```

---

## Step 4: RAG Pipeline for Dynamic Content

### How RAG Powers Course/Lesson Creation

```yaml
rag_workflow:
  step_1_query:
    input: "Create a beginner course on Sufism"
    embed_as: RETRIEVAL_QUERY

  step_2_retrieve:
    - Search existing courses for related content (avoid duplication)
    - Search lessons for reusable explanations and examples
    - Search Tavily for external sources (2+ per concept)

  step_3_augment:
    - Combine retrieved context with course-planning skill instructions
    - Ground new content in existing platform patterns
    - Cross-reference with existing courses for prerequisite linking

  step_4_generate:
    - Execute course-planning skill with retrieved context
    - Execute lesson-planning skill per module
    - Embed new content for future RAG queries
```

### RAG Integration in Lesson Generation

```typescript
// When generating a lesson, first search for related existing content

async function generateLessonWithRAG(moduleContext: ModuleContext): Promise<Lesson> {
  // 1. Search existing lessons for related content
  const relatedLessons = await searchLessons(
    `${moduleContext.module_title} ${moduleContext.variation}`,
    undefined, // search across ALL courses
    5
  );

  // 2. Search Tavily for external sources
  const tavilyResults = await tavilySearch(
    `${moduleContext.lesson_title} ${moduleContext.domain} study`,
    { search_depth: 'advanced' }
  );

  // 3. Build RAG context
  const ragContext = {
    existingRelatedContent: relatedLessons.map(l => ({
      title: l.title,
      courseId: l.course_id,
      preview: l.content_preview,
    })),
    externalSources: tavilyResults.results.map(r => ({
      title: r.title,
      url: r.url,
      content: r.content,
    })),
  };

  // 4. Pass RAG context to lesson-planning skill execution
  const lesson = await executeLessonPlanningSkill({
    ...moduleContext,
    rag_context: ragContext,
    instruction: `
      Use the existing related content to avoid duplication.
      Use the external sources for citations and evidence.
      Cross-reference with existing courses where relevant.
    `,
  });

  // 5. Embed the new lesson
  await embedLesson(lesson, moduleContext.course_id, moduleContext.module_id, lesson.concepts);

  return lesson;
}
```

---

## Step 5: Personalized Recommendations

### Recommendation Pipeline

```typescript
// src/lib/recommendations.ts

async function getRecommendations(userId: string): Promise<CourseRecommendation[]> {
  // 1. Get user embedding
  const { data: userEmbed } = await supabase
    .from('user_embeddings')
    .select('embedding, completed_courses, weak_topics, interests')
    .eq('user_id', userId)
    .single();

  if (!userEmbed) return getDefaultRecommendations();

  // 2. Find similar courses via vector search
  const { data: matches } = await supabase.rpc('hybrid_course_search', {
    query_text: [...(userEmbed.interests || []), ...(userEmbed.weak_topics || [])].join(' '),
    query_embedding: userEmbed.embedding,
    match_count: 10,
  });

  // 3. Filter out completed courses
  const completed = new Set(userEmbed.completed_courses || []);
  const candidates = (matches || []).filter(m => !completed.has(m.id));

  // 4. Generate explanations via Moonshot
  const recommendations = await Promise.all(
    candidates.slice(0, 5).map(async (course) => {
      const reason = await generateRecommendationReason(course, userEmbed);
      return {
        courseId: course.id,
        title: course.title,
        domain: course.domain,
        similarity: course.combined_score,
        reason,
      };
    })
  );

  return recommendations;
}

async function generateRecommendationReason(
  course: any,
  userProfile: any
): Promise<string> {
  const resp = await fetch('https://api.moonshot.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'kimi-k2-turbo-preview',
      messages: [{
        role: 'system',
        content: 'Generate a 1-sentence personalized reason why this user should take this course. Be specific — reference their interests or weak areas.',
      }, {
        role: 'user',
        content: `Course: ${course.title} (${course.domain}/${course.variation})
User interests: ${userProfile.interests?.join(', ')}
User weak topics: ${userProfile.weak_topics?.join(', ')}
User completed: ${userProfile.completed_courses?.join(', ')}`,
      }],
      max_tokens: 60,
    }),
  });

  const data = await resp.json();
  return data.choices[0].message.content;
}
```

### Content Gap Detection

```typescript
// src/scripts/detect-gaps.ts

async function detectContentGaps(): Promise<GapReport[]> {
  // 1. Get all user embeddings
  const { data: users } = await supabase
    .from('user_embeddings')
    .select('weak_topics, interests')
    .eq('consent_given', true);

  // 2. Aggregate weak topics and interests
  const topicCounts: Record<string, number> = {};
  for (const user of users || []) {
    for (const topic of [...(user.weak_topics || []), ...(user.interests || [])]) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }
  }

  // 3. For each popular topic, check if a course exists
  const gaps: GapReport[] = [];
  for (const [topic, count] of Object.entries(topicCounts).sort((a, b) => b[1] - a[1])) {
    if (count < 5) continue; // Need at least 5 users interested

    const results = await searchCourses(topic, { limit: 1 });
    if (!results.length || results[0].similarity < 0.7) {
      gaps.push({
        topic,
        userDemand: count,
        closestExisting: results[0]?.title || 'none',
        closestSimilarity: results[0]?.similarity || 0,
        recommendation: `Create a course on "${topic}" — ${count} users show interest/weakness`,
      });
    }
  }

  return gaps;
}
```

---

## Step 6: Embedding into Video Content

When videos are generated (via video-generation skill), embed their metadata:

```typescript
async function embedVideo(lessonId: string, courseId: string, videoType: string, narration: string) {
  const summary = narration.slice(0, 500); // Use narration preview
  const text = `Video: ${videoType} for lesson ${lessonId}. ${summary}`;

  const embedding = await embed(text, 'RETRIEVAL_DOCUMENT');

  await supabase.from('video_embeddings').upsert({
    lesson_id: lessonId,
    course_id: courseId,
    video_type: videoType,
    narration_summary: summary,
    embedding: `[${embedding.join(',')}]`,
  });
}
```

---

## Step 7: Quality Checklist

- [ ] pgvector extension enabled in Supabase
- [ ] All 4 embedding tables created with indexes
- [ ] Hybrid search functions deployed
- [ ] Every course has an embedding in course_embeddings
- [ ] Every lesson has an embedding in lesson_embeddings
- [ ] User embeddings update after each checkpoint
- [ ] Video embeddings created alongside video generation
- [ ] Recommendation API returns personalized results
- [ ] Content gap detection runs as weekly batch job
- [ ] Privacy consent checked before embedding user data

---

## Anti-Patterns

- **DO NOT** embed without checking Gemini API key first
- **DO NOT** store embeddings without user consent for user_embeddings
- **DO NOT** use raw cosine distance without a threshold — 0.4 minimum
- **DO NOT** skip keyword search — hybrid always outperforms vector-only
- **DO NOT** embed full lesson content — chunk or use first 1500 chars
- **DO NOT** generate recommendations without filtering completed courses
- **DO NOT** run gap detection without minimum user threshold (5+)
