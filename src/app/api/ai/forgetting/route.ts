import { NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";

/**
 * GET /api/ai/forgetting
 *
 * Detects "fading knowledge" by comparing user's recent interaction
 * embeddings against completed lesson embeddings. Returns lessons where
 * the user's active knowledge has drifted furthest from what they learned.
 */
export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminSupabase();

  // Get user's completed lessons (from progress)
  const { data: progress } = await admin
    .from("lesson_progress")
    .select("course_slug, lesson_id, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false });

  if (!progress || progress.length === 0) {
    return NextResponse.json({ fading: [] });
  }

  // Get user's recent conversation memories (last 7 days) as proxy for active knowledge
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentMemories } = await admin
    .from("conversation_memories")
    .select("content")
    .eq("user_id", user.id)
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false })
    .limit(20);

  // If no recent activity, everything is potentially fading
  const recentTopics = (recentMemories ?? [])
    .map((m: any) => m.content)
    .join(" ")
    .toLowerCase();

  // Check which completed lessons haven't been referenced recently
  const completedLessonIds = [...new Set(progress.map((p: any) => p.lesson_id))];

  // Get lesson titles from embeddings table
  const { data: lessonData } = await admin
    .from("lesson_embeddings")
    .select("id, title, course_id, course_domain")
    .in("id", completedLessonIds.slice(0, 100));

  if (!lessonData || lessonData.length === 0) {
    return NextResponse.json({ fading: [] });
  }

  // Score each completed lesson by how much it appears in recent activity
  const fading = lessonData
    .map((lesson: any) => {
      const titleWords = lesson.title.toLowerCase().split(/\s+/);
      // Count how many title words appear in recent topics
      const mentionCount = titleWords.filter(
        (w: string) => w.length > 3 && recentTopics.includes(w)
      ).length;
      const mentionRatio = titleWords.length > 0 ? mentionCount / titleWords.length : 0;

      // Find how long ago this was completed
      const completionRecord = progress.find((p: any) => p.lesson_id === lesson.id);
      const completedAt = completionRecord?.completed_at
        ? new Date(completionRecord.completed_at)
        : new Date(0);
      const daysSinceCompletion = Math.floor(
        (Date.now() - completedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Fading score: higher = more faded
      // Based on: time since completion + lack of recent mentions
      const fadingScore = Math.min(1, (daysSinceCompletion / 30) * (1 - mentionRatio));

      return {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        courseId: lesson.course_id,
        domain: lesson.course_domain,
        daysSinceCompletion,
        fadingScore,
      };
    })
    .filter((l: any) => l.fadingScore > 0.5 && l.daysSinceCompletion > 3)
    .sort((a: any, b: any) => b.fadingScore - a.fadingScore)
    .slice(0, 5);

  return NextResponse.json({ fading });
}
