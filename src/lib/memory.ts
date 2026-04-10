// RAG Memory System — Embedding generation + semantic search
// Uses Gemini text-embedding-004 for embeddings and Supabase pgvector for storage

import { createAdminSupabase } from "@/lib/supabase-auth";
import { storeAgentMemory } from "@/lib/agent-memory-store";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

interface MemoryEntry {
  id: string;
  content: string;
  summary: string | null;
  course_slug: string | null;
  lesson_slug: string | null;
  role: string;
  topics: string[];
  similarity: number;
  created_at: string;
}

/**
 * Generate embedding vector from text using Gemini text-embedding-004
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!GEMINI_API_KEY) {
    console.warn("[Memory] No GEMINI_API_KEY for embeddings");
    return null;
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        }),
      }
    );

    if (!res.ok) {
      console.error("[Memory] Embedding API error:", res.status);
      return null;
    }

    const data = await res.json();
    return data.embedding?.values || null;
  } catch (err) {
    console.error("[Memory] Embedding error:", err);
    return null;
  }
}

/**
 * Store a conversation message as a memory with embedding
 */
export async function storeMemory(
  userId: string,
  content: string,
  opts: {
    courseSlug?: string;
    lessonSlug?: string;
    role: "user" | "assistant";
    summary?: string;
    topics?: string[];
  }
): Promise<string | null> {
  // Only store meaningful messages (skip short greetings)
  if (content.length < 20) return null;

  const embedding = await generateEmbedding(content);
  const supabase = createAdminSupabase();

  const { data, error } = await supabase.rpc("store_memory", {
    p_user_id: userId,
    p_course_slug: opts.courseSlug || null,
    p_lesson_slug: opts.lessonSlug || null,
    p_role: opts.role,
    p_content: content,
    p_summary: opts.summary || null,
    p_embedding: embedding ? `[${embedding.join(",")}]` : null,
    p_topics: opts.topics || [],
  });

  if (error) {
    console.error("[Memory] Store error:", error);
    return null;
  }

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

  return data;
}

/**
 * Search for semantically similar memories
 */
export async function searchMemories(
  userId: string,
  query: string,
  opts?: { courseSlug?: string; limit?: number }
): Promise<MemoryEntry[]> {
  const embedding = await generateEmbedding(query);
  if (!embedding) return [];

  const supabase = createAdminSupabase();

  const { data, error } = await supabase.rpc("search_memories", {
    p_user_id: userId,
    p_embedding: `[${embedding.join(",")}]`,
    p_limit: opts?.limit || 5,
    p_course_slug: opts?.courseSlug || null,
  });

  if (error) {
    console.error("[Memory] Search error:", error);
    return [];
  }

  return (data || []) as MemoryEntry[];
}

/**
 * Get recent conversation context for a user in a course
 */
export async function getRecentContext(
  userId: string,
  courseSlug: string,
  limit = 10
): Promise<{ role: string; content: string }[]> {
  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("conversation_memories")
    .select("role, content")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[Memory] Recent context error:", error);
    return [];
  }

  return (data || []).reverse();
}

/**
 * Update user's learning profile based on conversation analysis
 */
export async function updateLearningProfile(
  userId: string,
  updates: {
    strengths?: string[];
    weaknesses?: string[];
    completedTopics?: string[];
    preferredStyle?: string;
  }
): Promise<void> {
  const supabase = createAdminSupabase();

  const { error } = await supabase.rpc("update_learning_profile", {
    p_user_id: userId,
    p_strengths: updates.strengths || null,
    p_weaknesses: updates.weaknesses || null,
    p_completed_topics: updates.completedTopics || null,
    p_preferred_style: updates.preferredStyle || null,
  });

  if (error) {
    console.error("[Memory] Profile update error:", error);
  }
}

/**
 * Get user's learning profile
 */
export async function getLearningProfile(userId: string) {
  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("learning_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Extract topics from text using simple keyword matching
 * (Avoids an extra LLM call — fast and deterministic)
 */
export function extractTopics(text: string): string[] {
  const topicPatterns: Record<string, RegExp> = {
    "arrays": /\b(array|arrays|list|lists)\b/i,
    "strings": /\b(string|strings|substring|char)\b/i,
    "trees": /\b(tree|trees|binary tree|bst|trie)\b/i,
    "graphs": /\b(graph|graphs|bfs|dfs|dijkstra)\b/i,
    "dynamic-programming": /\b(dp|dynamic programming|memoiz|tabul)\b/i,
    "sorting": /\b(sort|sorting|merge sort|quick sort|bubble sort)\b/i,
    "searching": /\b(search|binary search|linear search)\b/i,
    "linked-lists": /\b(linked list|linked-list|node\.next)\b/i,
    "stacks-queues": /\b(stack|queue|deque|fifo|lifo)\b/i,
    "hash-maps": /\b(hash|hashmap|hash map|dictionary|set)\b/i,
    "recursion": /\b(recurs|recursive|base case)\b/i,
    "two-pointers": /\b(two pointer|two-pointer|slow.*fast)\b/i,
    "sliding-window": /\b(sliding window|sliding-window)\b/i,
    "backtracking": /\b(backtrack|permut|combin)\b/i,
    "system-design": /\b(system design|scalab|load balanc|caching|database design)\b/i,
    "react": /\b(react|component|jsx|hook|useState|useEffect)\b/i,
    "python": /\b(python|def |class |import |print\()\b/i,
    "javascript": /\b(javascript|const |let |var |function |=>)\b/i,
    "css": /\b(css|flexbox|grid|margin|padding|style)\b/i,
    "api": /\b(api|rest|graphql|endpoint|fetch|axios)\b/i,
  };

  const found: string[] = [];
  for (const [topic, pattern] of Object.entries(topicPatterns)) {
    if (pattern.test(text)) {
      found.push(topic);
    }
  }
  return found.slice(0, 5);
}
