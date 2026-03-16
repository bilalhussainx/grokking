import { createAdminSupabase } from "./supabase-auth";
import { embedText } from "./embeddings";

/**
 * Analyze how well a user can articulate concepts from a lesson.
 * Compares voice transcript embedding to lesson embedding.
 * Returns articulation score (0-1) and identified gaps.
 */
export async function analyzeArticulation(
  userId: string,
  lessonId: string
): Promise<{
  score: number;
  gaps: string[];
  hasData: boolean;
}> {
  const supabase = createAdminSupabase();

  // Get the lesson embedding
  const { data: lesson } = await supabase
    .from("lesson_embeddings")
    .select("title, embedding, content_preview")
    .eq("id", lessonId)
    .single();

  if (!lesson) return { score: 0, gaps: [], hasData: false };

  // Get user's conversation memories related to this lesson
  const { data: memories } = await supabase
    .from("conversation_memories")
    .select("content, embedding")
    .eq("user_id", userId)
    .ilike("content", `%${lesson.title.split(":")[0]}%`)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!memories || memories.length === 0) {
    return { score: 0, gaps: [], hasData: false };
  }

  // Combine user's explanations into one text and embed
  const userExplanation = memories.map((m: any) => m.content).join(". ");
  const userEmbedding = await embedText(userExplanation, "RETRIEVAL_QUERY");

  // Compute cosine similarity
  const lessonVec = parseVector(lesson.embedding);
  const similarity = cosineSimilarity(userEmbedding, lessonVec);

  // Determine gaps based on content preview keywords
  const gaps: string[] = [];
  if (similarity < 0.6) {
    const keywords = (lesson.content_preview || "")
      .split(/[.!?,;:]/)
      .filter((s: string) => s.trim().length > 10)
      .slice(0, 3)
      .map((s: string) => s.trim());
    gaps.push(...keywords);
  }

  return { score: similarity, gaps, hasData: true };
}

function parseVector(embedding: any): number[] {
  if (Array.isArray(embedding)) return embedding;
  if (typeof embedding === "string") {
    return JSON.parse(embedding.replace(/^\[/, "[").replace(/\]$/, "]"));
  }
  return [];
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0,
    magA = 0,
    magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}
