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
