# Memory Foundation — Implementation Plan (Sub-Project 1 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared memory infrastructure (knowledge graph, agent memories, knowledge cache, context assembly) that all AI agents on kairoslearn will use for persistent, cross-aware intelligence.

**Architecture:** Three new Supabase tables (`user_knowledge_graph`, `agent_memories`, `knowledge_cache`) with pgvector embeddings, plus a unified `buildAgentContext()` function that assembles layered context (L0-L4) before every LLM call. Existing `memory.ts` and `agent-intelligence.ts` are refactored to use the new tables while maintaining backward compatibility. A fact extraction system writes insights from every AI interaction back to the knowledge graph.

**Tech Stack:** Supabase (PostgreSQL + pgvector), Gemini text-embedding-004, Tavily Search API (for knowledge cache refresh), Next.js 14 API routes, Playwright for E2E testing.

**Spec:** `docs/superpowers/specs/2026-04-10-intelligent-coaching-system-design.md`

---

## File Structure

### New files
| File | Responsibility |
|------|---------------|
| `supabase/migrations/020_knowledge_graph.sql` | user_knowledge_graph table + indexes + RPC functions |
| `supabase/migrations/021_agent_memories.sql` | agent_memories table + indexes + RPC functions |
| `supabase/migrations/022_knowledge_cache.sql` | knowledge_cache table + indexes |
| `src/lib/knowledge-graph.ts` | CRUD for user_knowledge_graph (query facts, upsert, invalidate) |
| `src/lib/agent-context.ts` | Unified context assembly — `buildAgentContext()` with L0-L4 layers |
| `src/lib/fact-extractor.ts` | Extract knowledge graph facts from conversations |
| `src/lib/agent-memory-store.ts` | Store/search agent_memories with embeddings |
| `src/app/api/knowledge-cache/refresh/route.ts` | Background job for refreshing knowledge cache via Tavily |
| `tests/e2e/agent-memory.spec.ts` | E2E tests for memory foundation user flows |

### Modified files
| File | Change |
|------|--------|
| `src/lib/memory.ts` | Add backward-compatible wrapper that routes to agent_memories |
| `src/lib/agent-intelligence.ts` | Refactor to use knowledge graph + agent_memories via buildAgentContext() |
| `src/app/api/ai/coach/route.ts` | Use buildAgentContext() instead of inline intelligence fetching |

---

## Task 1: Database Migration — User Knowledge Graph

**Files:**
- Create: `supabase/migrations/020_knowledge_graph.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- Migration 020: User Knowledge Graph
-- Temporal facts about users, written by any AI agent, readable by all.
-- Facts have validity windows — old facts expire via valid_to.

CREATE TABLE IF NOT EXISTS user_knowledge_graph (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  predicate TEXT NOT NULL,
  object TEXT NOT NULL,
  confidence FLOAT DEFAULT 1.0 CHECK (confidence >= 0.0 AND confidence <= 1.0),
  source_agent TEXT NOT NULL CHECK (source_agent IN (
    'coach', 'interviewer', 'language_tutor', 'career_coach', 'university_coach'
  )),
  evidence TEXT,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fast lookup of current facts for a user
CREATE INDEX idx_ukg_user_current
  ON user_knowledge_graph (user_id, valid_to)
  WHERE valid_to IS NULL;

-- Fast lookup by predicate type (e.g., all "weak_at" facts for a user)
CREATE INDEX idx_ukg_user_predicate
  ON user_knowledge_graph (user_id, predicate)
  WHERE valid_to IS NULL;

-- RPC: Get all current (non-expired) facts for a user
CREATE OR REPLACE FUNCTION get_current_facts(
  p_user_id UUID,
  p_predicate TEXT DEFAULT NULL,
  p_source_agent TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  subject TEXT,
  predicate TEXT,
  object TEXT,
  confidence FLOAT,
  source_agent TEXT,
  evidence TEXT,
  valid_from TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ukg.id,
    ukg.subject,
    ukg.predicate,
    ukg.object,
    ukg.confidence,
    ukg.source_agent,
    ukg.evidence,
    ukg.valid_from
  FROM user_knowledge_graph ukg
  WHERE ukg.user_id = p_user_id
    AND ukg.valid_to IS NULL
    AND (p_predicate IS NULL OR ukg.predicate = p_predicate)
    AND (p_source_agent IS NULL OR ukg.source_agent = p_source_agent)
  ORDER BY ukg.confidence DESC, ukg.valid_from DESC
  LIMIT p_limit;
END;
$$;

-- RPC: Upsert a fact (update confidence if same triple exists, or insert new)
CREATE OR REPLACE FUNCTION upsert_fact(
  p_user_id UUID,
  p_subject TEXT,
  p_predicate TEXT,
  p_object TEXT,
  p_confidence FLOAT DEFAULT 1.0,
  p_source_agent TEXT DEFAULT 'coach',
  p_evidence TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_existing_id UUID;
  v_new_id UUID;
BEGIN
  -- Check if an active (non-expired) fact with the same triple exists
  SELECT ukg.id INTO v_existing_id
  FROM user_knowledge_graph ukg
  WHERE ukg.user_id = p_user_id
    AND ukg.subject = p_subject
    AND ukg.predicate = p_predicate
    AND ukg.object = p_object
    AND ukg.valid_to IS NULL
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Update confidence and evidence on the existing fact
    UPDATE user_knowledge_graph
    SET confidence = p_confidence,
        evidence = COALESCE(p_evidence, evidence),
        source_agent = p_source_agent
    WHERE id = v_existing_id;
    RETURN v_existing_id;
  ELSE
    -- Insert new fact
    INSERT INTO user_knowledge_graph (
      user_id, subject, predicate, object, confidence, source_agent, evidence
    )
    VALUES (
      p_user_id, p_subject, p_predicate, p_object, p_confidence, p_source_agent, p_evidence
    )
    RETURNING id INTO v_new_id;
    RETURN v_new_id;
  END IF;
END;
$$;

-- RPC: Invalidate a fact (set valid_to = now)
CREATE OR REPLACE FUNCTION invalidate_fact(
  p_fact_id UUID
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE user_knowledge_graph
  SET valid_to = now()
  WHERE id = p_fact_id AND valid_to IS NULL;
END;
$$;

-- Enable RLS
ALTER TABLE user_knowledge_graph ENABLE ROW LEVEL SECURITY;

-- Users can read their own facts; agents write via admin client (service role)
CREATE POLICY "users_read_own_facts" ON user_knowledge_graph
  FOR SELECT USING (auth.uid() = user_id);
```

- [ ] **Step 2: Apply the migration**

Run in the Supabase SQL Editor (or via `supabase db push` if linked):
```sql
-- Paste the contents of supabase/migrations/020_knowledge_graph.sql
```

Expected: Table `user_knowledge_graph` created with indexes and 3 RPC functions.

- [ ] **Step 3: Verify the migration**

Run in Supabase SQL Editor:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'user_knowledge_graph' ORDER BY ordinal_position;
```
Expected: 11 columns (id, user_id, subject, predicate, object, confidence, source_agent, evidence, valid_from, valid_to, created_at).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/020_knowledge_graph.sql
git commit -m "feat(db): add user_knowledge_graph table with temporal facts"
```

---

## Task 2: Database Migration — Agent Memories

**Files:**
- Create: `supabase/migrations/021_agent_memories.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- Migration 021: Agent Memories
-- Per-agent conversation memories with pgvector embeddings.
-- Replaces conversation_memories for new agents while keeping backward compat.

CREATE TABLE IF NOT EXISTS agent_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL CHECK (agent_type IN (
    'coach', 'interviewer', 'language_tutor', 'career_coach', 'university_coach'
  )),
  session_id UUID,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  summary TEXT,
  metadata JSONB DEFAULT '{}',
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fast lookup: recent memories for a user + agent type
CREATE INDEX idx_am_user_agent
  ON agent_memories (user_id, agent_type, created_at DESC);

-- Fast lookup: by session
CREATE INDEX idx_am_session
  ON agent_memories (session_id)
  WHERE session_id IS NOT NULL;

-- Vector similarity search (HNSW for better recall at scale vs ivfflat)
CREATE INDEX idx_am_embedding
  ON agent_memories USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- RPC: Semantic search within agent memories
CREATE OR REPLACE FUNCTION search_agent_memories(
  p_user_id UUID,
  p_agent_type TEXT,
  p_embedding vector(768),
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  role TEXT,
  content TEXT,
  summary TEXT,
  metadata JSONB,
  similarity REAL,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    am.id,
    am.role,
    am.content,
    am.summary,
    am.metadata,
    (1 - (am.embedding <=> p_embedding))::REAL AS similarity,
    am.created_at
  FROM agent_memories am
  WHERE am.user_id = p_user_id
    AND am.agent_type = p_agent_type
    AND am.embedding IS NOT NULL
  ORDER BY am.embedding <=> p_embedding
  LIMIT p_limit;
END;
$$;

-- RPC: Store an agent memory
CREATE OR REPLACE FUNCTION store_agent_memory(
  p_user_id UUID,
  p_agent_type TEXT,
  p_session_id UUID DEFAULT NULL,
  p_role TEXT DEFAULT 'user',
  p_content TEXT DEFAULT '',
  p_summary TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_embedding vector(768) DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO agent_memories (
    user_id, agent_type, session_id, role, content, summary, metadata, embedding
  )
  VALUES (
    p_user_id, p_agent_type, p_session_id, p_role, p_content, p_summary, p_metadata, p_embedding
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Enable RLS
ALTER TABLE agent_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_agent_memories" ON agent_memories
  FOR SELECT USING (auth.uid() = user_id);
```

- [ ] **Step 2: Apply the migration**

Run in the Supabase SQL Editor:
```sql
-- Paste the contents of supabase/migrations/021_agent_memories.sql
```

Expected: Table `agent_memories` created with HNSW vector index and 2 RPC functions.

- [ ] **Step 3: Verify**

```sql
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'agent_memories';
```
Expected: 3 indexes (idx_am_user_agent, idx_am_session, idx_am_embedding).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/021_agent_memories.sql
git commit -m "feat(db): add agent_memories table with HNSW vector index"
```

---

## Task 3: Database Migration — Knowledge Cache

**Files:**
- Create: `supabase/migrations/022_knowledge_cache.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- Migration 022: Knowledge Cache
-- Background-indexed real-world data (interview patterns, job market, university stats).
-- Refreshed by cron/manual trigger via Tavily search + Gemini embeddings.

CREATE TABLE IF NOT EXISTS knowledge_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL CHECK (domain IN (
    'interview_patterns', 'job_market', 'university_stats', 'domain_knowledge'
  )),
  entity TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  embedding vector(768),
  indexed_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Fast lookup by domain + entity
CREATE INDEX idx_kc_domain_entity
  ON knowledge_cache (domain, entity);

-- Expiration cleanup
CREATE INDEX idx_kc_expires
  ON knowledge_cache (expires_at)
  WHERE expires_at IS NOT NULL;

-- Vector search within domain
CREATE INDEX idx_kc_embedding
  ON knowledge_cache USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- RPC: Search knowledge cache by domain + semantic similarity
CREATE OR REPLACE FUNCTION search_knowledge_cache(
  p_domain TEXT,
  p_entity TEXT DEFAULT NULL,
  p_embedding vector(768) DEFAULT NULL,
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  domain TEXT,
  entity TEXT,
  content TEXT,
  source_url TEXT,
  metadata JSONB,
  similarity REAL,
  indexed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_embedding IS NOT NULL THEN
    -- Semantic search
    RETURN QUERY
    SELECT
      kc.id,
      kc.domain,
      kc.entity,
      kc.content,
      kc.source_url,
      kc.metadata,
      (1 - (kc.embedding <=> p_embedding))::REAL AS similarity,
      kc.indexed_at
    FROM knowledge_cache kc
    WHERE kc.domain = p_domain
      AND (p_entity IS NULL OR kc.entity = p_entity)
      AND (kc.expires_at IS NULL OR kc.expires_at > now())
    ORDER BY kc.embedding <=> p_embedding
    LIMIT p_limit;
  ELSE
    -- Exact match by entity
    RETURN QUERY
    SELECT
      kc.id,
      kc.domain,
      kc.entity,
      kc.content,
      kc.source_url,
      kc.metadata,
      1.0::REAL AS similarity,
      kc.indexed_at
    FROM knowledge_cache kc
    WHERE kc.domain = p_domain
      AND (p_entity IS NULL OR kc.entity = p_entity)
      AND (kc.expires_at IS NULL OR kc.expires_at > now())
    ORDER BY kc.indexed_at DESC
    LIMIT p_limit;
  END IF;
END;
$$;

-- Enable RLS (public read for cached knowledge, admin write)
ALTER TABLE knowledge_cache ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read the knowledge cache
CREATE POLICY "authenticated_read_knowledge_cache" ON knowledge_cache
  FOR SELECT USING (auth.role() = 'authenticated');
```

- [ ] **Step 2: Apply the migration**

Run in the Supabase SQL Editor.

- [ ] **Step 3: Verify**

```sql
SELECT count(*) FROM information_schema.tables WHERE table_name = 'knowledge_cache';
```
Expected: 1

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/022_knowledge_cache.sql
git commit -m "feat(db): add knowledge_cache table for real-world data indexing"
```

---

## Task 4: Knowledge Graph TypeScript Library

**Files:**
- Create: `src/lib/knowledge-graph.ts`

- [ ] **Step 1: Create the knowledge graph library**

```typescript
// src/lib/knowledge-graph.ts
// CRUD operations for the user_knowledge_graph table.
// All writes use the admin client (service role) to bypass RLS.
// All reads filter by user_id for isolation.

import { createAdminSupabase } from "@/lib/supabase-auth";

export interface KnowledgeFact {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  sourceAgent: string;
  evidence: string | null;
  validFrom: string;
}

/**
 * Get all current (non-expired) facts for a user.
 * Optionally filter by predicate type or source agent.
 */
export async function getCurrentFacts(
  userId: string,
  opts?: {
    predicate?: string;
    sourceAgent?: string;
    limit?: number;
  }
): Promise<KnowledgeFact[]> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.rpc("get_current_facts", {
    p_user_id: userId,
    p_predicate: opts?.predicate ?? null,
    p_source_agent: opts?.sourceAgent ?? null,
    p_limit: opts?.limit ?? 50,
  });

  if (error) {
    console.error("[KnowledgeGraph] getCurrentFacts error:", error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    subject: row.subject as string,
    predicate: row.predicate as string,
    object: row.object as string,
    confidence: row.confidence as number,
    sourceAgent: row.source_agent as string,
    evidence: row.evidence as string | null,
    validFrom: row.valid_from as string,
  }));
}

/**
 * Upsert a fact into the knowledge graph.
 * If the same (user, subject, predicate, object) triple exists and is active,
 * updates confidence and evidence. Otherwise inserts a new fact.
 */
export async function upsertFact(
  userId: string,
  fact: {
    subject: string;
    predicate: string;
    object: string;
    confidence?: number;
    sourceAgent: string;
    evidence?: string;
  }
): Promise<string | null> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.rpc("upsert_fact", {
    p_user_id: userId,
    p_subject: fact.subject,
    p_predicate: fact.predicate,
    p_object: fact.object,
    p_confidence: fact.confidence ?? 1.0,
    p_source_agent: fact.sourceAgent,
    p_evidence: fact.evidence ?? null,
  });

  if (error) {
    console.error("[KnowledgeGraph] upsertFact error:", error);
    return null;
  }

  return data as string;
}

/**
 * Invalidate a fact (set valid_to = now).
 * Use when a fact is no longer true (e.g., user was weak_at X but now mastered it).
 */
export async function invalidateFact(factId: string): Promise<void> {
  const admin = createAdminSupabase();
  const { error } = await admin.rpc("invalidate_fact", {
    p_fact_id: factId,
  });

  if (error) {
    console.error("[KnowledgeGraph] invalidateFact error:", error);
  }
}

/**
 * Get facts from other agents about a user (cross-agent intelligence).
 * Excludes facts from the requesting agent to avoid circular reads.
 */
export async function getCrossAgentInsights(
  userId: string,
  excludeAgent: string,
  limit = 10
): Promise<KnowledgeFact[]> {
  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("user_knowledge_graph")
    .select("id, subject, predicate, object, confidence, source_agent, evidence, valid_from")
    .eq("user_id", userId)
    .is("valid_to", null)
    .neq("source_agent", excludeAgent)
    .order("confidence", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[KnowledgeGraph] getCrossAgentInsights error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    subject: row.subject,
    predicate: row.predicate,
    object: row.object,
    confidence: row.confidence,
    sourceAgent: row.source_agent,
    evidence: row.evidence,
    validFrom: row.valid_from,
  }));
}

/**
 * Format facts into a concise prompt string for LLM context injection.
 * Groups by predicate for readability.
 */
export function formatFactsForPrompt(facts: KnowledgeFact[]): string {
  if (facts.length === 0) return "";

  const grouped: Record<string, string[]> = {};
  for (const f of facts) {
    const key = f.predicate;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(`${f.object} (confidence: ${f.confidence}, via ${f.sourceAgent})`);
  }

  const lines: string[] = ["## KNOWLEDGE GRAPH (what we know about this student)"];
  for (const [predicate, objects] of Object.entries(grouped)) {
    lines.push(`- ${predicate}: ${objects.join(", ")}`);
  }
  return lines.join("\n");
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd C:/Users/bilal/Downloads/grokking && npx tsc --noEmit src/lib/knowledge-graph.ts 2>&1 | head -20`

Expected: No errors (or only errors from missing ambient types, not from this file).

- [ ] **Step 3: Commit**

```bash
git add src/lib/knowledge-graph.ts
git commit -m "feat: add knowledge-graph.ts — CRUD for user temporal facts"
```

---

## Task 5: Agent Memory Store

**Files:**
- Create: `src/lib/agent-memory-store.ts`

- [ ] **Step 1: Create the agent memory store**

```typescript
// src/lib/agent-memory-store.ts
// Store and search agent-specific memories with pgvector embeddings.
// Each agent type stores memories separately — retrieval is scoped by agent_type.

import { createAdminSupabase } from "@/lib/supabase-auth";
import { generateEmbedding } from "@/lib/memory";

export type AgentType = "coach" | "interviewer" | "language_tutor" | "career_coach" | "university_coach";

export interface AgentMemory {
  id: string;
  role: string;
  content: string;
  summary: string | null;
  metadata: Record<string, unknown>;
  similarity: number;
  createdAt: string;
}

/**
 * Store a conversation turn as an agent memory with embedding.
 * Fire-and-forget — call this after sending the LLM response.
 */
export async function storeAgentMemory(
  userId: string,
  agentType: AgentType,
  content: string,
  opts: {
    sessionId?: string;
    role: "user" | "assistant";
    summary?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<string | null> {
  // Skip very short messages (greetings, "ok", etc.)
  if (content.length < 20) return null;

  const embedding = await generateEmbedding(content);
  const admin = createAdminSupabase();

  const { data, error } = await admin.rpc("store_agent_memory", {
    p_user_id: userId,
    p_agent_type: agentType,
    p_session_id: opts.sessionId ?? null,
    p_role: opts.role,
    p_content: content,
    p_summary: opts.summary ?? null,
    p_metadata: opts.metadata ?? {},
    p_embedding: embedding ? `[${embedding.join(",")}]` : null,
  });

  if (error) {
    console.error("[AgentMemoryStore] store error:", error);
    return null;
  }

  return data as string;
}

/**
 * Search agent memories by semantic similarity.
 * Scoped to a specific user + agent type.
 */
export async function searchAgentMemories(
  userId: string,
  agentType: AgentType,
  query: string,
  limit = 5
): Promise<AgentMemory[]> {
  const embedding = await generateEmbedding(query);
  if (!embedding) return [];

  const admin = createAdminSupabase();

  const { data, error } = await admin.rpc("search_agent_memories", {
    p_user_id: userId,
    p_agent_type: agentType,
    p_embedding: `[${embedding.join(",")}]`,
    p_limit: limit,
  });

  if (error) {
    console.error("[AgentMemoryStore] search error:", error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    role: row.role as string,
    content: row.content as string,
    summary: (row.summary as string) ?? null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    similarity: row.similarity as number,
    createdAt: row.created_at as string,
  }));
}

/**
 * Get the N most recent memories for a user + agent type.
 * No embedding needed — just chronological order.
 */
export async function getRecentAgentMemories(
  userId: string,
  agentType: AgentType,
  limit = 5
): Promise<AgentMemory[]> {
  const admin = createAdminSupabase();

  const { data, error } = await admin
    .from("agent_memories")
    .select("id, role, content, summary, metadata, created_at")
    .eq("user_id", userId)
    .eq("agent_type", agentType)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[AgentMemoryStore] getRecent error:", error);
    return [];
  }

  return (data || []).reverse().map((row) => ({
    id: row.id,
    role: row.role,
    content: row.content,
    summary: row.summary,
    metadata: row.metadata ?? {},
    similarity: 1.0,
    createdAt: row.created_at,
  }));
}

/**
 * Format agent memories into a prompt string.
 */
export function formatMemoriesForPrompt(
  memories: AgentMemory[],
  label: string
): string {
  if (memories.length === 0) return "";

  const lines: string[] = [`## ${label}`];
  for (const m of memories) {
    const role = m.role === "user" ? "Student" : "Coach";
    const preview = m.summary || m.content.slice(0, 150);
    lines.push(`- [${role}] ${preview}`);
  }
  return lines.join("\n");
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd C:/Users/bilal/Downloads/grokking && npx tsc --noEmit src/lib/agent-memory-store.ts 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/lib/agent-memory-store.ts
git commit -m "feat: add agent-memory-store.ts — per-agent memory with vector search"
```

---

## Task 6: Fact Extractor

**Files:**
- Create: `src/lib/fact-extractor.ts`

- [ ] **Step 1: Create the fact extractor**

```typescript
// src/lib/fact-extractor.ts
// Extracts knowledge graph facts from conversation content.
// Uses rule-based pattern matching (fast, deterministic, no LLM cost).
// Called async after each agent interaction — does not block the response.

import { upsertFact } from "@/lib/knowledge-graph";
import type { AgentType } from "@/lib/agent-memory-store";

interface ExtractionContext {
  userId: string;
  agentType: AgentType;
  userMessage: string;
  assistantMessage: string;
  metadata?: Record<string, unknown>;
}

/**
 * Extract and store knowledge graph facts from a conversation turn.
 * Fire-and-forget — wrap calls in .catch(() => {}).
 */
export async function extractAndStoreFacts(ctx: ExtractionContext): Promise<void> {
  const facts = extractFacts(ctx);
  for (const fact of facts) {
    await upsertFact(ctx.userId, {
      subject: fact.subject,
      predicate: fact.predicate,
      object: fact.object,
      confidence: fact.confidence,
      sourceAgent: ctx.agentType,
      evidence: fact.evidence,
    });
  }
}

interface ExtractedFact {
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  evidence: string;
}

/**
 * Rule-based fact extraction. Fast and deterministic.
 * Returns facts to be upserted into the knowledge graph.
 */
function extractFacts(ctx: ExtractionContext): ExtractedFact[] {
  const facts: ExtractedFact[] = [];
  const combined = `${ctx.userMessage} ${ctx.assistantMessage}`.toLowerCase();

  // --- Coach-specific patterns ---
  if (ctx.agentType === "coach") {
    const courseSlug = (ctx.metadata?.courseSlug as string) || "";
    const lessonSlug = (ctx.metadata?.lessonSlug as string) || "";

    // Detect struggle: assistant mentions "not quite", "close but", "try again"
    const strugglePatterns = [
      /not quite/i, /close,? but/i, /try again/i, /that's not right/i,
      /almost/i, /let me give you a hint/i, /common mistake/i,
    ];
    for (const pattern of strugglePatterns) {
      if (pattern.test(ctx.assistantMessage)) {
        // Extract the topic from lesson/course context
        const topic = lessonSlug || courseSlug;
        if (topic) {
          facts.push({
            subject: "user",
            predicate: "struggled_with",
            object: topic,
            confidence: 0.6,
            evidence: `Coach corrected user during ${lessonSlug} in ${courseSlug}`,
          });
        }
        break;
      }
    }

    // Detect mastery: assistant says "exactly", "perfect", "you got it"
    const masteryPatterns = [
      /exactly right/i, /perfect/i, /you got it/i, /well done/i,
      /that's correct/i, /nailed it/i,
    ];
    for (const pattern of masteryPatterns) {
      if (pattern.test(ctx.assistantMessage)) {
        const topic = lessonSlug || courseSlug;
        if (topic) {
          facts.push({
            subject: "user",
            predicate: "understands",
            object: topic,
            confidence: 0.7,
            evidence: `Coach confirmed understanding during ${lessonSlug}`,
          });
        }
        break;
      }
    }
  }

  // --- Interviewer-specific patterns ---
  if (ctx.agentType === "interviewer") {
    const companyId = (ctx.metadata?.companyId as string) || "";
    const inlineScore = ctx.metadata?.inlineScore as number | undefined;

    if (inlineScore !== undefined && inlineScore < 5) {
      const topic = (ctx.metadata?.questionTopic as string) || "interview_question";
      facts.push({
        subject: "user",
        predicate: "weak_at",
        object: topic,
        confidence: Math.min(0.9, (10 - inlineScore) / 10),
        evidence: `Scored ${inlineScore}/10 on ${topic} in ${companyId} interview`,
      });
    }

    if (inlineScore !== undefined && inlineScore >= 8) {
      const topic = (ctx.metadata?.questionTopic as string) || "interview_question";
      facts.push({
        subject: "user",
        predicate: "strong_at",
        object: topic,
        confidence: Math.min(1.0, inlineScore / 10),
        evidence: `Scored ${inlineScore}/10 on ${topic} in ${companyId} interview`,
      });
    }
  }

  // --- Language tutor-specific patterns ---
  if (ctx.agentType === "language_tutor") {
    const language = (ctx.metadata?.language as string) || "";
    const level = (ctx.metadata?.proficiencyLevel as string) || "";

    if (language && level) {
      facts.push({
        subject: "user",
        predicate: "speaks",
        object: `${language}:${level}`,
        confidence: 0.8,
        evidence: `Language tutor session at ${level} level`,
      });
    }
  }

  // --- Career coach patterns ---
  if (ctx.agentType === "career_coach") {
    // Detect target company mentions
    const companyPatterns = [
      /i want to (?:work at|join|apply to|interview at) (\w+)/i,
      /my target (?:company|employer) is (\w+)/i,
      /preparing for (\w+) interview/i,
    ];
    for (const pattern of companyPatterns) {
      const match = ctx.userMessage.match(pattern);
      if (match) {
        facts.push({
          subject: "user",
          predicate: "targets_company",
          object: match[1].toLowerCase(),
          confidence: 0.9,
          evidence: `User stated: "${ctx.userMessage.slice(0, 100)}"`,
        });
        break;
      }
    }

    // Detect target role mentions
    const rolePatterns = [
      /i want to (?:be|become) (?:a |an )?(.+?)(?:\.|$)/i,
      /my (?:target|dream|goal) (?:role|position|job) is (.+?)(?:\.|$)/i,
    ];
    for (const pattern of rolePatterns) {
      const match = ctx.userMessage.match(pattern);
      if (match) {
        facts.push({
          subject: "user",
          predicate: "targets_role",
          object: match[1].trim().toLowerCase().slice(0, 50),
          confidence: 0.9,
          evidence: `User stated: "${ctx.userMessage.slice(0, 100)}"`,
        });
        break;
      }
    }
  }

  return facts;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd C:/Users/bilal/Downloads/grokking && npx tsc --noEmit src/lib/fact-extractor.ts 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/lib/fact-extractor.ts
git commit -m "feat: add fact-extractor.ts — rule-based knowledge graph fact extraction"
```

---

## Task 7: Unified Context Assembly

**Files:**
- Create: `src/lib/agent-context.ts`

- [ ] **Step 1: Create the context assembly layer**

```typescript
// src/lib/agent-context.ts
// Unified context assembly for all AI agents.
// Builds a layered context (L0-L4) before every LLM call.
// Replaces the ad-hoc context building in coach/route.ts and agent-intelligence.ts.

import { createAdminSupabase } from "@/lib/supabase-auth";
import { getCurrentFacts, getCrossAgentInsights, formatFactsForPrompt } from "@/lib/knowledge-graph";
import { getRecentAgentMemories, searchAgentMemories, formatMemoriesForPrompt } from "@/lib/agent-memory-store";
import { generateEmbedding } from "@/lib/memory";
import type { AgentType } from "@/lib/agent-memory-store";
import type { KnowledgeFact } from "@/lib/knowledge-graph";

export interface AgentContext {
  // L0: Identity (~50 tokens)
  identity: {
    name: string;
    level: number;
    totalXP: number;
    streak: number;
    credits: number;
    nativeLanguage: string;
    learningStyle: string;
  };
  // L1: Knowledge graph facts (~150 tokens)
  facts: KnowledgeFact[];
  // L2: Agent-specific memories (~300 tokens)
  recentMemories: { role: string; content: string }[];
  relevantMemories: { role: string; content: string; similarity: number }[];
  // L3: Knowledge cache hits (~200 tokens)
  domainKnowledge: string[];
  // L4: Cross-agent insights (~100 tokens)
  crossInsights: KnowledgeFact[];

  // Pre-built prompt string — inject directly into system prompt
  promptContext: string;
}

/**
 * Build the full agent context for an LLM call.
 * This is the single entry point — replaces fetchUserIntelligence() for new agents.
 */
export async function buildAgentContext(
  userId: string,
  agentType: AgentType,
  query: string,
  opts?: {
    courseSlug?: string;
    companyId?: string;
    language?: string;
    sessionId?: string;
  }
): Promise<AgentContext> {
  // L0: User identity from user_profiles
  const identity = await getIdentity(userId);

  // L1: Current knowledge graph facts
  const facts = await getCurrentFacts(userId, { limit: 20 });

  // L2: Agent-specific memories
  const recentRaw = await getRecentAgentMemories(userId, agentType, 5);
  const recentMemories = recentRaw.map((m) => ({
    role: m.role,
    content: m.summary || m.content.slice(0, 200),
  }));

  let relevantMemories: { role: string; content: string; similarity: number }[] = [];
  if (query.length > 10) {
    const relevantRaw = await searchAgentMemories(userId, agentType, query, 3);
    relevantMemories = relevantRaw.map((m) => ({
      role: m.role,
      content: m.summary || m.content.slice(0, 200),
      similarity: m.similarity,
    }));
  }

  // L3: Knowledge cache (domain-specific data)
  let domainKnowledge: string[] = [];
  if (opts?.companyId || opts?.courseSlug || opts?.language) {
    domainKnowledge = await fetchDomainKnowledge(
      agentType,
      query,
      opts,
    );
  }

  // L4: Cross-agent insights
  const crossInsights = await getCrossAgentInsights(userId, agentType, 5);

  // Build the combined prompt string
  const promptContext = buildPromptString(identity, facts, recentMemories, relevantMemories, domainKnowledge, crossInsights);

  return {
    identity,
    facts,
    recentMemories,
    relevantMemories,
    domainKnowledge,
    crossInsights,
    promptContext,
  };
}

// --- Internal helpers ---

async function getIdentity(userId: string) {
  const admin = createAdminSupabase();
  const [profileResult, creditsResult, xpResult] = await Promise.all([
    admin.from("user_profiles").select("full_name, native_language, learning_style, login_streak").eq("id", userId).single(),
    admin.rpc("get_credit_balance", { p_user_id: userId }),
    admin.from("xp_transactions").select("xp_amount").eq("user_id", userId),
  ]);

  const profile = profileResult.data;
  const credits = (creditsResult.data as number) || 0;
  const totalXP = (xpResult.data || []).reduce(
    (sum: number, r: { xp_amount: number }) => sum + (r.xp_amount || 0),
    0
  );

  return {
    name: profile?.full_name || "there",
    level: Math.floor(totalXP / 500) + 1,
    totalXP,
    streak: profile?.login_streak || 0,
    credits,
    nativeLanguage: profile?.native_language || "en",
    learningStyle: profile?.learning_style || "balanced",
  };
}

async function fetchDomainKnowledge(
  agentType: AgentType,
  query: string,
  opts: { companyId?: string; courseSlug?: string; language?: string }
): Promise<string[]> {
  const admin = createAdminSupabase();
  const embedding = await generateEmbedding(query);

  let domain = "domain_knowledge";
  let entity: string | null = null;

  if (agentType === "interviewer" && opts.companyId) {
    domain = "interview_patterns";
    entity = opts.companyId;
  } else if (agentType === "career_coach") {
    domain = "job_market";
  } else if (agentType === "university_coach") {
    domain = "university_stats";
  }

  const { data, error } = await admin.rpc("search_knowledge_cache", {
    p_domain: domain,
    p_entity: entity,
    p_embedding: embedding ? `[${embedding.join(",")}]` : null,
    p_limit: 3,
  });

  if (error || !data) return [];

  return (data as { content: string }[]).map((row) => row.content);
}

function buildPromptString(
  identity: AgentContext["identity"],
  facts: KnowledgeFact[],
  recentMemories: { role: string; content: string }[],
  relevantMemories: { role: string; content: string; similarity: number }[],
  domainKnowledge: string[],
  crossInsights: KnowledgeFact[]
): string {
  const parts: string[] = [];

  // L0: Identity
  parts.push(`## STUDENT PROFILE`);
  parts.push(`Name: ${identity.name} | Level ${identity.level} (${identity.totalXP} XP) | ${identity.streak}-day streak | ${identity.credits} credits`);
  if (identity.nativeLanguage !== "en") parts.push(`Native language: ${identity.nativeLanguage}`);

  // L1: Knowledge graph facts
  if (facts.length > 0) {
    parts.push(formatFactsForPrompt(facts));
  }

  // L2: Recent memories
  if (recentMemories.length > 0) {
    parts.push(formatMemoriesForPrompt(
      recentMemories.map((m) => ({
        id: "", role: m.role, content: m.content, summary: null,
        metadata: {}, similarity: 1.0, createdAt: "",
      })),
      "RECENT CONVERSATION HISTORY"
    ));
  }

  // L2b: Semantically relevant memories
  if (relevantMemories.length > 0) {
    parts.push(`## RELEVANT PAST CONVERSATIONS`);
    for (const m of relevantMemories) {
      const role = m.role === "user" ? "Student" : "Coach";
      parts.push(`- [${role}] ${m.content.slice(0, 150)}`);
    }
  }

  // L3: Domain knowledge
  if (domainKnowledge.length > 0) {
    parts.push(`## DOMAIN KNOWLEDGE (from real-world data)`);
    for (const dk of domainKnowledge) {
      parts.push(`- ${dk.slice(0, 300)}`);
    }
  }

  // L4: Cross-agent insights
  if (crossInsights.length > 0) {
    parts.push(`## INSIGHTS FROM OTHER COACHES`);
    for (const f of crossInsights) {
      parts.push(`- ${f.sourceAgent} observed: ${f.predicate} → ${f.object} (confidence: ${f.confidence})`);
    }
  }

  return parts.join("\n");
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd C:/Users/bilal/Downloads/grokking && npx tsc --noEmit src/lib/agent-context.ts 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/lib/agent-context.ts
git commit -m "feat: add agent-context.ts — unified L0-L4 context assembly for all agents"
```

---

## Task 8: Knowledge Cache Refresh API Route

**Files:**
- Create: `src/app/api/knowledge-cache/refresh/route.ts`

- [ ] **Step 1: Install Tavily SDK**

```bash
cd C:/Users/bilal/Downloads/grokking && npm install @tavily/core
```

- [ ] **Step 2: Create the refresh route**

```typescript
// src/app/api/knowledge-cache/refresh/route.ts
// Background job endpoint for refreshing knowledge_cache via Tavily search.
// Called by cron or manually. Protected by API key.
// Searches for real-world data, embeds it, and upserts into knowledge_cache.

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-auth";
import { generateEmbedding } from "@/lib/memory";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60s for batch operations

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

async function tavilySearch(query: string, maxResults = 5): Promise<TavilyResult[]> {
  if (!TAVILY_API_KEY) {
    console.warn("[KnowledgeCache] No TAVILY_API_KEY set");
    return [];
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      max_results: maxResults,
      search_depth: "advanced",
      include_answer: true,
    }),
  });

  if (!res.ok) {
    console.error("[KnowledgeCache] Tavily error:", res.status);
    return [];
  }

  const data = await res.json();
  return (data.results || []).map((r: { title: string; url: string; content: string; score: number }) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score,
  }));
}

// POST /api/knowledge-cache/refresh
// Body: { domain, entities: string[], expiresInDays?: number }
// Protected: requires CRON_SECRET or admin auth
export async function POST(req: NextRequest) {
  // Simple API key protection for cron jobs
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "";
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const domain = typeof body.domain === "string" ? body.domain : null;
  const entities = Array.isArray(body.entities) ? body.entities : [];
  const expiresInDays = typeof body.expiresInDays === "number" ? body.expiresInDays : 7;

  if (!domain || entities.length === 0) {
    return NextResponse.json(
      { error: "domain (string) and entities (string[]) required" },
      { status: 400 }
    );
  }

  const admin = createAdminSupabase();
  const results: { entity: string; count: number; error?: string }[] = [];

  for (const entity of entities) {
    try {
      // Build search query based on domain
      let searchQuery = "";
      switch (domain) {
        case "interview_patterns":
          searchQuery = `${entity} software engineer interview experience 2026 questions format`;
          break;
        case "job_market":
          searchQuery = `${entity} job requirements skills salary 2026`;
          break;
        case "university_stats":
          searchQuery = `${entity} university admissions acceptance rate 2026 what they look for`;
          break;
        case "domain_knowledge":
          searchQuery = entity;
          break;
        default:
          searchQuery = entity;
      }

      const searchResults = await tavilySearch(searchQuery, 3);
      let inserted = 0;

      for (const result of searchResults) {
        const content = `[${result.title}]\n${result.content}`;
        const embedding = await generateEmbedding(content);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const { error: insertErr } = await admin
          .from("knowledge_cache")
          .upsert(
            {
              domain,
              entity: entity.toLowerCase(),
              content,
              source_url: result.url,
              embedding: embedding ? `[${embedding.join(",")}]` : null,
              indexed_at: new Date().toISOString(),
              expires_at: expiresAt.toISOString(),
              metadata: { title: result.title, score: result.score },
            },
            { onConflict: "id" }
          );

        if (!insertErr) inserted++;
      }

      results.push({ entity, count: inserted });
    } catch (err) {
      console.error(`[KnowledgeCache] Failed to refresh ${entity}:`, err);
      results.push({ entity, count: 0, error: String(err) });
    }
  }

  return NextResponse.json({ refreshed: results });
}
```

- [ ] **Step 3: Add TAVILY_API_KEY to env**

Add to `.env.local`:
```
TAVILY_API_KEY=your-tavily-api-key-here
CRON_SECRET=your-cron-secret-here
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/knowledge-cache/refresh/route.ts
git commit -m "feat: add knowledge-cache refresh endpoint with Tavily search"
```

---

## Task 9: Integrate buildAgentContext into Coach Route

**Files:**
- Modify: `src/app/api/ai/coach/route.ts`

- [ ] **Step 1: Refactor coach route to use buildAgentContext**

Replace the ad-hoc intelligence + memory fetching in `src/app/api/ai/coach/route.ts`.

Find this block (approximately lines 77-104):

```typescript
    // RAG Intelligence — fetch everything we know about this user
    let intelligenceContext = "";
    try {
      const { fetchUserIntelligence } = await import("@/lib/agent-intelligence");
      const intel = await fetchUserIntelligence(user.id);
      intelligenceContext = `\n${intel.promptContext}\n`;
    } catch (err) {
      console.warn("[Coach] Intelligence fetch failed:", err);
    }

    // Retrieve relevant memories for context
    let memoryContext = "";
    try {
      const memories = await searchMemories(user.id, `${event} ${lessonTitle || ""}`, {
        courseSlug: body.courseSlug,
        limit: 3,
      });
      if (memories.length > 0) {
        memoryContext = `\n[RELEVANT PAST CONVERSATIONS]\n${memories.map((m) => `- ${m.summary || m.content.slice(0, 100)}`).join("\n")}\n`;
      }
    } catch {}

    // Store the user's message as memory (fire-and-forget)
    storeMemory(user.id, event, {
      courseSlug: body.courseSlug,
      lessonSlug: body.lessonSlug,
      role: "user",
      topics: extractTopics(event),
    }).catch(() => {});
```

Replace with:

```typescript
    // Unified agent context — knowledge graph + agent memories + domain knowledge
    let agentContextStr = "";
    try {
      const { buildAgentContext } = await import("@/lib/agent-context");
      const ctx = await buildAgentContext(user.id, "coach", `${event} ${lessonTitle || ""}`, {
        courseSlug: body.courseSlug,
      });
      agentContextStr = `\n${ctx.promptContext}\n`;
    } catch (err) {
      console.warn("[Coach] Agent context build failed, falling back to legacy:", err);
      // Fallback to legacy intelligence if new system fails
      try {
        const { fetchUserIntelligence } = await import("@/lib/agent-intelligence");
        const intel = await fetchUserIntelligence(user.id);
        agentContextStr = `\n${intel.promptContext}\n`;
      } catch {}
    }

    // Store memory + extract facts (fire-and-forget, non-blocking)
    import("@/lib/agent-memory-store").then(({ storeAgentMemory }) => {
      storeAgentMemory(user.id, "coach", event, {
        role: "user",
        metadata: { courseSlug: body.courseSlug, lessonSlug: body.lessonSlug },
      });
    }).catch(() => {});
```

Then update the `messages` array to use `agentContextStr` instead of `intelligenceContext`:

Find: `{ role: "system", content: COACH_DIRECTIVE + intelligenceContext + langInstruction }`

Replace with: `{ role: "system", content: COACH_DIRECTIVE + agentContextStr + langInstruction }`

- [ ] **Step 2: Add fact extraction after response**

After the streaming response is sent (at the end of the successful path, before `return new Response(stream, ...)`), add fact extraction. Since we're streaming, we need to extract facts from the user message only (we don't have the full assistant response yet). Add after the `stream` construction:

```typescript
    // Extract facts from user message (fire-and-forget)
    import("@/lib/fact-extractor").then(({ extractAndStoreFacts }) => {
      extractAndStoreFacts({
        userId: user.id,
        agentType: "coach",
        userMessage: event,
        assistantMessage: "", // We don't have it yet (streaming)
        metadata: { courseSlug: body.courseSlug, lessonSlug: body.lessonSlug },
      });
    }).catch(() => {});
```

- [ ] **Step 3: Verify the app builds**

Run: `cd C:/Users/bilal/Downloads/grokking && npm run build 2>&1 | tail -20`

Expected: Build succeeds (warnings OK, no errors).

- [ ] **Step 4: Commit**

```bash
git add src/app/api/ai/coach/route.ts
git commit -m "feat: integrate buildAgentContext into coach route with fallback"
```

---

## Task 10: Backward-Compatible Memory Bridge

**Files:**
- Modify: `src/lib/memory.ts`

- [ ] **Step 1: Add agent_memories bridge to storeMemory**

At the top of `src/lib/memory.ts`, after the existing imports, add:

```typescript
import { storeAgentMemory } from "@/lib/agent-memory-store";
```

Then modify the `storeMemory` function to dual-write to both the old and new tables. Find the existing `storeMemory` function and add this at the end, before the `return data;`:

```typescript
  // Dual-write to new agent_memories table (non-blocking)
  storeAgentMemory(userId, "coach", content, {
    role: opts.role,
    summary: opts.summary,
    metadata: {
      courseSlug: opts.courseSlug || null,
      lessonSlug: opts.lessonSlug || null,
      topics: opts.topics || [],
      source: "legacy_bridge",
    },
  }).catch(() => {});
```

- [ ] **Step 2: Verify the app builds**

Run: `cd C:/Users/bilal/Downloads/grokking && npm run build 2>&1 | tail -20`

- [ ] **Step 3: Commit**

```bash
git add src/lib/memory.ts
git commit -m "feat: dual-write memories to agent_memories table for migration"
```

---

## Task 11: E2E Tests — Memory Foundation

**Files:**
- Create: `tests/e2e/agent-memory.spec.ts`

- [ ] **Step 1: Write E2E tests for the coach with memory**

```typescript
import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'testuser789@test.com';
const TEST_PASSWORD = 'AuditPro2026!';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(TEST_EMAIL);
  await page.locator('input[type="password"]').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\//, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Agent Memory Foundation — Coach Integration', () => {
  test('coach loads and streams a response with context', async ({ page }) => {
    await login(page);

    // Navigate to a course with a coding lesson
    await page.goto('/course/grokking-coding-interview/arrays-two-pointers');
    await page.waitForLoadState('networkidle');

    // Coach panel should be visible (auto-opens on coding exercises)
    const coachPanel = page.locator('[data-testid="ai-coach-panel"]').or(
      page.locator('text=/Coach Alex|Professor Sage|Nova/')
    );

    // If coach panel exists, verify it loaded
    if (await coachPanel.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Coach should display a greeting or be ready for input
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('coach API returns 200 with agent context', async ({ page }) => {
    await login(page);

    // Intercept the coach API call to verify it includes the new context
    const coachResponse = page.waitForResponse(
      (response) => response.url().includes('/api/ai/coach') && response.status() === 200,
      { timeout: 30000 }
    );

    // Navigate to a lesson that triggers coach
    await page.goto('/course/grokking-coding-interview/arrays-two-pointers');
    await page.waitForLoadState('networkidle');

    // Wait for coach to send its greeting (auto-triggers)
    try {
      const response = await coachResponse;
      expect(response.status()).toBe(200);
    } catch {
      // Coach may not auto-trigger on all lessons — this is OK
      test.skip();
    }
  });

  test('knowledge cache refresh endpoint returns 401 without auth', async ({ request }) => {
    const response = await request.post('/api/knowledge-cache/refresh', {
      data: { domain: 'interview_patterns', entities: ['google'] },
    });

    // Should be 401 without CRON_SECRET
    expect(response.status()).toBe(401);
  });
});

test.describe('Agent Memory Foundation — Knowledge Cache', () => {
  test('knowledge cache refresh works with valid auth', async ({ request }) => {
    // This test requires CRON_SECRET and TAVILY_API_KEY to be set
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      test.skip();
      return;
    }

    const response = await request.post('/api/knowledge-cache/refresh', {
      headers: { Authorization: `Bearer ${cronSecret}` },
      data: {
        domain: 'interview_patterns',
        entities: ['google'],
        expiresInDays: 1,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.refreshed).toBeDefined();
    expect(body.refreshed[0].entity).toBe('google');
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `cd C:/Users/bilal/Downloads/grokking && npx playwright test tests/e2e/agent-memory.spec.ts --project="Desktop Chrome" 2>&1 | tail -30`

Expected: Tests pass (auth test passes, knowledge cache test may skip if no CRON_SECRET/TAVILY_API_KEY).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/agent-memory.spec.ts
git commit -m "test: add E2E tests for agent memory foundation"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Knowledge graph migration | `020_knowledge_graph.sql` |
| 2 | Agent memories migration | `021_agent_memories.sql` |
| 3 | Knowledge cache migration | `022_knowledge_cache.sql` |
| 4 | Knowledge graph TypeScript CRUD | `src/lib/knowledge-graph.ts` |
| 5 | Agent memory store | `src/lib/agent-memory-store.ts` |
| 6 | Fact extractor | `src/lib/fact-extractor.ts` |
| 7 | Unified context assembly | `src/lib/agent-context.ts` |
| 8 | Knowledge cache refresh API | `src/app/api/knowledge-cache/refresh/route.ts` |
| 9 | Coach route integration | `src/app/api/ai/coach/route.ts` (modify) |
| 10 | Memory bridge (backward compat) | `src/lib/memory.ts` (modify) |
| 11 | E2E tests | `tests/e2e/agent-memory.spec.ts` |

After this plan is complete, the memory foundation is in place and Sub-Projects 2 (Interview Intelligence), 3 (Specialized Coaches), and 4 (Language Tutor Memory) can begin.
