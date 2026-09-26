import { NextResponse } from "next/server";
import { generateCourse } from "@/lib/course-generator";
import { hasAdminSecret } from "@/lib/admin-secret";

// Pre-defined institution courses to seed
const SEED_COURSES = [
  // Computer Science Fundamentals
  { query: "Harvard CS50 — Introduction to Computer Science", sourceUrl: "https://cs50.harvard.edu" },
  { query: "MIT 6.006 — Introduction to Algorithms", sourceUrl: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/" },
  { query: "Stanford CS106B — Programming Abstractions", sourceUrl: "https://web.stanford.edu/class/cs106b/" },

  // Machine Learning & AI
  { query: "Stanford CS229 — Machine Learning", sourceUrl: "https://cs229.stanford.edu/" },
  { query: "Google Machine Learning Crash Course", sourceUrl: "https://developers.google.com/machine-learning/crash-course" },
  { query: "MIT 6.S191 — Introduction to Deep Learning", sourceUrl: "https://introtodeeplearning.com/" },

  // AI Tools & Prompt Engineering
  { query: "Anthropic Prompt Engineering Guide — Building with Claude", sourceUrl: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering" },
  { query: "OpenAI GPT Prompt Engineering & API Development", sourceUrl: "https://platform.openai.com/docs" },
  { query: "Google Gemini AI Development — Building with Gemini API", sourceUrl: "https://ai.google.dev/docs" },

  // Advanced CS
  { query: "MIT 6.824 — Distributed Systems", sourceUrl: "https://pdos.csail.mit.edu/6.824/" },
  { query: "Stanford CS143 — Compilers", sourceUrl: "https://web.stanford.edu/class/cs143/" },
  { query: "Carnegie Mellon 15-445 — Database Systems", sourceUrl: "https://15445.courses.cs.cmu.edu/" },
];

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!hasAdminSecret(url.searchParams.get("key"), "TEACHER_SECRET_KEY")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { query: string; courseId?: string; error?: string }[] = [];

  // Generate courses sequentially to avoid overwhelming APIs
  for (const seed of SEED_COURSES) {
    try {
      const courseId = await generateCourse(seed.query, {
        sourceUrl: seed.sourceUrl,
        isCurated: true, // Visible to all users
      });
      results.push({ query: seed.query, courseId });
    } catch (err) {
      results.push({
        query: seed.query,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Small delay between course creations
    await new Promise((r) => setTimeout(r, 1000));
  }

  return NextResponse.json({
    message: `Seeded ${results.filter((r) => r.courseId).length}/${SEED_COURSES.length} courses`,
    results,
  });
}
