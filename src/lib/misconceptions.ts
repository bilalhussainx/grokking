// src/lib/misconceptions.ts
// Core logic for misconception clustering: record submissions, find matching
// misconception patterns, and retrieve common misconceptions per lesson.

import { embedText } from "@/lib/embeddings";
import { createAdminSupabase } from "@/lib/supabase-auth";

export interface Misconception {
  id: string;
  label: string;
  description: string | null;
  remediation_content: string | null;
  similarity: number;
  occurrence_count: number;
}

/**
 * Record a submission (code or quiz answer), embed it, and store in
 * submission_embeddings. If the submission is wrong, check for a matching
 * misconception cluster and return it.
 */
export async function recordSubmission(
  userId: string,
  courseId: string,
  lessonId: string,
  type: "code" | "quiz",
  text: string,
  isCorrect: boolean
): Promise<Misconception | null> {
  const db = createAdminSupabase();

  // Embed the submission text
  const embedding = await embedText(text, "SEMANTIC_SIMILARITY");
  const embeddingStr = `[${embedding.join(",")}]`;

  // Store the submission
  const { error: insertError } = await db.from("submission_embeddings").insert({
    user_id: userId,
    course_id: courseId,
    lesson_id: lessonId,
    submission_type: type,
    submission_text: text,
    is_correct: isCorrect,
    embedding: embeddingStr,
  });

  if (insertError) {
    console.error("[Misconceptions] Failed to store submission:", insertError);
  }

  // If correct, no need to check for misconceptions
  if (isCorrect) return null;

  // Check for a matching misconception cluster
  return findMisconception(embedding, lessonId);
}

/**
 * Find a matching misconception cluster for a given submission embedding.
 * Uses the match_misconceptions RPC function for pgvector similarity search.
 */
export async function findMisconception(
  embeddingOrText: number[] | string,
  lessonId: string
): Promise<Misconception | null> {
  const db = createAdminSupabase();

  // If given text, embed it first
  let embedding: number[];
  if (typeof embeddingOrText === "string") {
    embedding = await embedText(embeddingOrText, "SEMANTIC_SIMILARITY");
  } else {
    embedding = embeddingOrText;
  }

  const embeddingStr = `[${embedding.join(",")}]`;

  const { data, error } = await db.rpc("match_misconceptions", {
    query_embedding: embeddingStr,
    p_lesson_id: lessonId,
    match_count: 1,
    match_threshold: 0.75,
  });

  if (error) {
    console.error("[Misconceptions] RPC error:", error);
    return null;
  }

  if (!data || data.length === 0) return null;

  const match = data[0];
  return {
    id: match.id,
    label: match.label,
    description: match.description,
    remediation_content: match.remediation_content,
    similarity: match.similarity,
    occurrence_count: match.occurrence_count,
  };
}

/**
 * Get the most common misconception clusters for a given lesson.
 * Useful for instructors and content improvement dashboards.
 */
export async function getCommonMisconceptions(
  lessonId: string,
  limit: number = 10
): Promise<Misconception[]> {
  const db = createAdminSupabase();

  const { data, error } = await db
    .from("misconception_clusters")
    .select("id, label, description, remediation_content, occurrence_count")
    .eq("lesson_id", lessonId)
    .order("occurrence_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[Misconceptions] Failed to fetch clusters:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    label: row.label,
    description: row.description,
    remediation_content: row.remediation_content,
    similarity: 1,
    occurrence_count: row.occurrence_count,
  }));
}
