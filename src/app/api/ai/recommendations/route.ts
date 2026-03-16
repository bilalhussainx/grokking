import { NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";
import { getLearningProfile } from "@/lib/memory";
import { courses } from "@/data";
import { getRecommendations as getEmbeddingRecs } from "@/lib/embeddings";

interface CourseRecommendation {
  courseSlug: string;
  courseTitle: string;
  icon: string;
  score: number;
  reason: string;
}

/**
 * GET /api/ai/recommendations
 * Returns personalized course recommendations based on:
 * 1. User's completed lessons (progress)
 * 2. Learning profile (strengths/weaknesses from conversations)
 * 3. Course dependencies (e.g., Python before DSA)
 */
export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminSupabase();

  // Fetch progress across all courses
  const { data: progress } = await admin
    .from("lesson_progress")
    .select("course_slug, lesson_id")
    .eq("user_id", user.id);

  const completedByCourse: Record<string, number> = {};
  for (const p of progress || []) {
    completedByCourse[p.course_slug] = (completedByCourse[p.course_slug] || 0) + 1;
  }

  // Get learning profile
  const profile = await getLearningProfile(user.id);

  // Score each course
  const recommendations: CourseRecommendation[] = [];

  // Course dependency graph (prerequisite → course)
  const prerequisites: Record<string, string[]> = {
    "react-development": ["javascript-fundamentals"],
    "nodejs-backend": ["javascript-fundamentals"],
    "mern-stack": ["javascript-fundamentals", "react-development", "nodejs-backend"],
    "data-structures-algorithms": ["python-fundamentals"],
    "coding-interview": ["data-structures-algorithms"],
    "system-design": ["coding-interview"],
    "game-development": ["csharp-fundamentals"],
  };

  for (const course of courses) {
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completed = completedByCourse[course.slug] || 0;
    const progressPct = totalLessons > 0 ? completed / totalLessons : 0;

    // Skip if fully completed
    if (progressPct >= 1) continue;

    let score = 0;
    let reason = "";

    // In-progress courses get highest priority
    if (progressPct > 0 && progressPct < 1) {
      score = 80 + progressPct * 20;
      reason = `Continue learning — ${Math.round(progressPct * 100)}% complete`;
    }
    // Check prerequisites
    else if (prerequisites[course.slug]) {
      const prereqs = prerequisites[course.slug];
      const prereqsDone = prereqs.every((p) => {
        const pCourse = courses.find((c) => c.slug === p);
        if (!pCourse) return true;
        const pTotal = pCourse.modules.reduce((s, m) => s + m.lessons.length, 0);
        const pDone = completedByCourse[p] || 0;
        return pDone / pTotal >= 0.5; // 50% is enough
      });

      if (prereqsDone) {
        score = 60;
        reason = "Ready for this — prerequisites completed";
      } else {
        score = 20;
        reason = `Complete ${prereqs.join(", ")} first`;
      }
    }
    // Beginner-friendly courses for new users
    else if (Object.keys(completedByCourse).length === 0) {
      const beginnerCourses = ["python-fundamentals", "javascript-fundamentals", "web-development"];
      if (beginnerCourses.includes(course.slug)) {
        score = 70;
        reason = "Great starting point for beginners";
      } else {
        score = 30;
        reason = "Start with fundamentals first";
      }
    }
    // Default scoring
    else {
      score = 40;
      reason = "Explore this course";
    }

    // Boost based on learning profile weaknesses
    if (profile?.weaknesses) {
      const courseTopics = course.modules.flatMap((m) =>
        m.lessons.map((l) => l.title.toLowerCase())
      );
      const matchingWeakness = profile.weaknesses.find((w: string) =>
        courseTopics.some((t) => t.includes(w.toLowerCase()))
      );
      if (matchingWeakness) {
        score += 15;
        reason = `Strengthen your ${matchingWeakness} skills`;
      }
    }

    recommendations.push({
      courseSlug: course.slug,
      courseTitle: course.title,
      icon: course.icon,
      score: Math.min(100, score),
      reason,
    });
  }

  // Sort by score descending, return top 5
  recommendations.sort((a, b) => b.score - a.score);
  let top = recommendations.slice(0, 5);

  // Try to enhance with Gemini embedding-based similarity (if embeddings exist)
  try {
    const completedIds = Object.keys(completedByCourse);
    const interests = profile?.interests ?? [];
    const embeddingRecs = await getEmbeddingRecs(user.id, completedIds, interests, 3);

    // Merge embedding results as bonus recommendations (avoid duplicates)
    const existingSlugs = new Set(top.map((r) => r.courseSlug));
    for (const emb of embeddingRecs) {
      if (!existingSlugs.has(emb.id)) {
        const course = courses.find((c) => c.id === emb.id);
        if (course) {
          top.push({
            courseSlug: course.slug,
            courseTitle: course.title,
            icon: course.icon,
            score: Math.round(emb.similarity * 100),
            reason: `Recommended based on your learning profile`,
          });
        }
      }
    }
    top = top.slice(0, 6);
  } catch {
    // Embeddings not set up yet — fall back to rule-based only
  }

  return NextResponse.json({ recommendations: top });
}
