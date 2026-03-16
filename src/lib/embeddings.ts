import { createAdminSupabase } from "./supabase-auth";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL = "gemini-embedding-001";
const DIMENSIONS = 768;

/**
 * Generate a 768-dimensional embedding using Gemini embedding-001.
 * Cost: ~$0.15 per 1M tokens (~$0.0001 per embedding).
 */
export async function embedText(
  text: string,
  taskType: "SEMANTIC_SIMILARITY" | "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" = "SEMANTIC_SIMILARITY"
): Promise<number[]> {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: DIMENSIONS,
      }),
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini embedding failed (${resp.status}): ${err}`);
  }

  const data = await resp.json();
  return data.embedding.values;
}

/**
 * Embed and store a course in the course_embeddings table.
 */
export async function embedCourse(course: {
  id: string;
  title: string;
  description: string;
  domain?: string;
  level?: string;
  modules: { title: string; lessons: { title: string }[] }[];
}) {
  const text = [
    `Course: ${course.title}`,
    `Description: ${course.description}`,
    `Domain: ${course.domain ?? "general"}`,
    `Level: ${course.level ?? "beginner"}`,
    `Modules: ${course.modules.map((m) => m.title).join(", ")}`,
    `Topics: ${course.modules.flatMap((m) => m.lessons.map((l) => l.title)).join(", ")}`,
  ].join(". ");

  const embedding = await embedText(text, "RETRIEVAL_DOCUMENT");
  const supabase = createAdminSupabase();

  await supabase.from("course_embeddings").upsert({
    id: course.id,
    title: course.title,
    description: course.description,
    domain: course.domain ?? "general",
    level: course.level ?? "beginner",
    module_titles: course.modules.map((m) => m.title),
    embedding: `[${embedding.join(",")}]`,
    updated_at: new Date().toISOString(),
  });
}

/**
 * Find courses similar to a query using vector similarity.
 * Returns top N courses ranked by cosine similarity.
 */
export async function findSimilarCourses(
  query: string,
  limit: number = 5,
  excludeIds: string[] = []
): Promise<{ id: string; title: string; description: string; domain: string; similarity: number }[]> {
  const queryEmbedding = await embedText(query, "RETRIEVAL_QUERY");
  const supabase = createAdminSupabase();

  const { data, error } = await supabase.rpc("match_courses", {
    query_embedding: `[${queryEmbedding.join(",")}]`,
    match_count: limit + excludeIds.length,
    match_threshold: 0.3,
  });

  if (error) throw error;

  return (data ?? [])
    .filter((c: any) => !excludeIds.includes(c.id))
    .slice(0, limit);
}

/**
 * Embed and store a lesson in the lesson_embeddings table.
 */
export async function embedLesson(
  lesson: { id: string; title: string; content: string },
  courseId: string,
  courseDomain: string,
  moduleId: string
) {
  const text = [
    `Lesson: ${lesson.title}`,
    `Content: ${lesson.content.slice(0, 1500)}`,
  ].join(". ");

  const embedding = await embedText(text, "RETRIEVAL_DOCUMENT");
  const supabase = createAdminSupabase();

  await supabase.from("lesson_embeddings").upsert({
    id: lesson.id,
    course_id: courseId,
    course_domain: courseDomain,
    module_id: moduleId,
    title: lesson.title,
    content_preview: lesson.content.slice(0, 500),
    embedding: `[${embedding.join(",")}]`,
    updated_at: new Date().toISOString(),
  });
}

/**
 * Get personalized course recommendations for a user based on their
 * completed courses and interests.
 */
export async function getRecommendations(
  userId: string,
  completedCourseIds: string[],
  interests: string[] = [],
  limit: number = 5
): Promise<{ id: string; title: string; description: string; domain: string; similarity: number }[]> {
  // Build a user profile text from their completed courses and interests
  const profileParts = [];
  if (completedCourseIds.length > 0) {
    profileParts.push(`Completed courses: ${completedCourseIds.join(", ")}`);
  }
  if (interests.length > 0) {
    profileParts.push(`Interests: ${interests.join(", ")}`);
  }
  if (profileParts.length === 0) {
    profileParts.push("New learner interested in technology and programming");
  }

  const query = profileParts.join(". ");
  return findSimilarCourses(query, limit, completedCourseIds);
}
