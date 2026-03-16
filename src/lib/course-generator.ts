// Course Generation Pipeline
// Fetches syllabi via Tavily, generates lessons via Kimi K2, stores in Supabase

import { createAdminSupabase } from "@/lib/supabase-auth";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Types for generated content
export interface GeneratedLesson {
  id: string;
  slug: string;
  title: string;
  content: string;
  starterCode?: string;
  solutionCode?: string;
  hints?: string[];
  coachContext?: string;
}

export interface GeneratedModule {
  id: string;
  title: string;
  description: string;
  lessons: GeneratedLesson[];
}

export interface GeneratedCourseData {
  modules: GeneratedModule[];
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

// ─── Tavily Search ────────────────────────────────────────────

async function tavilySearch(query: string, maxResults = 5): Promise<TavilyResult[]> {
  if (!TAVILY_API_KEY) {
    console.warn("[CourseGen] No TAVILY_API_KEY");
    return [];
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        search_depth: "advanced",
        max_results: maxResults,
        include_answer: true,
      }),
    });

    if (!res.ok) {
      console.error("[CourseGen] Tavily error:", res.status);
      return [];
    }

    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      title: r.title,
      url: r.url,
      content: r.content,
    }));
  } catch (err) {
    console.error("[CourseGen] Tavily search failed:", err);
    return [];
  }
}

// ─── LLM Call (Kimi K2 primary, Gemini fallback) ──────────────

async function llmGenerate(systemPrompt: string, userPrompt: string): Promise<string> {
  // Try Kimi K2 first
  if (MOONSHOT_API_KEY) {
    try {
      const res = await fetch("https://api.moonshot.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MOONSHOT_API_KEY}`,
        },
        body: JSON.stringify({
          model: "kimi-k2-turbo-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.4,
          max_tokens: 4000,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
      }
      console.error("[CourseGen] Kimi error:", res.status);
    } catch (err) {
      console.error("[CourseGen] Kimi failed:", err);
    }
  }

  // Fallback to Gemini
  if (GEMINI_API_KEY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 4000 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }
    } catch (err) {
      console.error("[CourseGen] Gemini failed:", err);
    }
  }

  throw new Error("No LLM available for course generation");
}

// ─── Step 1: Discover Syllabus ────────────────────────────────

interface SyllabusOutline {
  courseTitle: string;
  courseDescription: string;
  sourceInstitution: string;
  modules: { title: string; description: string; lessonTopics: string[] }[];
}

async function discoverSyllabus(query: string, sourceUrl?: string): Promise<SyllabusOutline> {
  const searchQuery = sourceUrl
    ? `${query} syllabus curriculum topics modules site:${new URL(sourceUrl).hostname}`
    : `${query} syllabus curriculum topics modules lessons`;

  const results = await tavilySearch(searchQuery, 8);
  const context = results.map((r) => `[${r.title}]\n${r.content}`).join("\n\n---\n\n");

  const raw = await llmGenerate(
    `You are a curriculum designer. Extract a structured course outline from the search results. Output valid JSON only, no markdown fences.`,
    `Create a structured course outline for: "${query}"

Search results:
${context}

Output this exact JSON structure:
{
  "courseTitle": "Course title",
  "courseDescription": "2-3 sentence description",
  "sourceInstitution": "Institution name (Harvard, MIT, Google, etc.)",
  "modules": [
    {
      "title": "Module title",
      "description": "1 sentence module description",
      "lessonTopics": ["Topic 1", "Topic 2", "Topic 3"]
    }
  ]
}

Rules:
- 4-8 modules, 3-5 lessons per module
- Topics should be specific and actionable (not vague like "Introduction")
- Order from fundamentals to advanced
- Each lesson topic should be teachable in 15-30 minutes`
  );

  try {
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse syllabus outline from LLM response");
  }
}

// ─── Step 2: Enrich Lesson Topic ──────────────────────────────

interface LessonEnrichment {
  explanations: string[];
  codeExamples: string[];
  commonMistakes: string[];
}

async function enrichLessonTopic(
  topic: string,
  courseName: string
): Promise<LessonEnrichment> {
  const [explanations, exercises] = await Promise.all([
    tavilySearch(`${topic} tutorial explanation examples ${courseName}`, 3),
    tavilySearch(`${topic} coding exercise practice problem`, 3),
  ]);

  return {
    explanations: explanations.map((r) => r.content),
    codeExamples: exercises.map((r) => r.content),
    commonMistakes: [],
  };
}

// ─── Step 3: Generate Single Lesson ───────────────────────────

async function generateLesson(
  topic: string,
  moduleTitle: string,
  courseName: string,
  sourceInstitution: string,
  enrichment: LessonEnrichment,
  lessonIndex: number,
  moduleIndex: number
): Promise<GeneratedLesson> {
  const raw = await llmGenerate(
    `You are a course content creator for the Grokking learning platform. Generate interactive coding lessons with exercises. Output valid JSON only, no markdown fences.`,
    `Generate a lesson for:
TOPIC: ${topic}
MODULE: ${moduleTitle}
COURSE: ${courseName} (based on ${sourceInstitution} curriculum)

REFERENCE MATERIAL:
${enrichment.explanations.slice(0, 2).join("\n\n")}

CODE EXAMPLES FROM SEARCH:
${enrichment.codeExamples.slice(0, 2).join("\n\n")}

Output this JSON:
{
  "title": "Lesson title (concise, specific)",
  "content": "Full markdown lesson content. MUST include:\\n1. A clear concept explanation (2-3 paragraphs)\\n2. A real-world analogy\\n3. A worked code example with explanation\\n4. Common pitfalls section\\n5. Key takeaways (bullet points)",
  "starterCode": "Python starter code with TODO comments. Should be 40-60% complete — give the student structure but leave the core logic as TODOs. Include comments guiding them. If this topic is conceptual with no natural coding exercise, set to null.",
  "solutionCode": "Complete working solution with comments explaining each step. Include 2-3 assert statements at the bottom for testing. If no exercise, set to null.",
  "hints": [
    "Hint 1: A gentle conceptual nudge — point them in the right direction without specifics",
    "Hint 2: More specific — mention the technique or data structure to use",
    "Hint 3: Detailed walkthrough — explain the approach step by step, just short of giving code"
  ],
  "coachContext": "Key concepts this lesson covers: X, Y, Z. Common student mistakes: A, B. If the student is stuck, suggest thinking about: C. This lesson connects to the next topic by: D."
}

Rules:
- Content should be 400-800 words of markdown
- Code examples in Python unless the course is language-specific
- starterCode should have clear TODO comments
- solutionCode must include assert test cases
- Hints must be progressively more specific
- coachContext helps the AI tutor give relevant advice`
  );

  try {
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const lesson = JSON.parse(cleaned);

    const slug = lesson.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return {
      id: `gen-m${moduleIndex}-l${lessonIndex}`,
      slug,
      title: lesson.title,
      content: lesson.content || "",
      starterCode: lesson.starterCode || undefined,
      solutionCode: lesson.solutionCode || undefined,
      hints: lesson.hints || [],
      coachContext: lesson.coachContext || "",
    };
  } catch {
    // Fallback: create a basic lesson
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: `gen-m${moduleIndex}-l${lessonIndex}`,
      slug,
      title: topic,
      content: `# ${topic}\n\nThis lesson covers ${topic} as part of ${courseName}.\n\n*Content generation encountered an issue. The AI coach can help you explore this topic interactively.*`,
      hints: ["Try breaking the problem into smaller parts.", "Think about the data structures involved.", "Consider edge cases."],
      coachContext: `This lesson covers ${topic}. Help the student explore it step by step.`,
    };
  }
}

// ─── Step 4: Full Course Generation ───────────────────────────

export async function generateCourse(
  query: string,
  opts?: {
    sourceUrl?: string;
    createdBy?: string;
    isCurated?: boolean;
  }
): Promise<string> {
  const supabase = createAdminSupabase();

  // Create placeholder record
  const slug = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const { data: existing } = await supabase
    .from("generated_courses")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return existing.id;
  }

  const { data: record, error: insertError } = await supabase
    .from("generated_courses")
    .insert({
      slug,
      title: query,
      description: "Generating...",
      source_url: opts?.sourceUrl || null,
      created_by: opts?.createdBy || null,
      is_curated: opts?.isCurated || false,
      status: "generating",
      generation_log: "Starting generation...\n",
    })
    .select("id")
    .single();

  if (insertError || !record) {
    throw new Error(`Failed to create course record: ${insertError?.message}`);
  }

  const courseId = record.id;

  // Run generation in background (non-blocking)
  runGeneration(courseId, query, opts?.sourceUrl).catch((err) => {
    console.error("[CourseGen] Background generation failed:", err);
    supabase
      .from("generated_courses")
      .update({ status: "failed", generation_log: `Error: ${err.message}` })
      .eq("id", courseId)
      .then(() => {});
  });

  return courseId;
}

async function runGeneration(courseId: string, query: string, sourceUrl?: string) {
  const supabase = createAdminSupabase();

  const updateLog = async (msg: string) => {
    const { data } = await supabase
      .from("generated_courses")
      .select("generation_log")
      .eq("id", courseId)
      .single();
    await supabase
      .from("generated_courses")
      .update({ generation_log: (data?.generation_log || "") + msg + "\n" })
      .eq("id", courseId);
  };

  try {
    // Step 1: Discover syllabus
    await updateLog("Step 1/4: Discovering syllabus...");
    const syllabus = await discoverSyllabus(query, sourceUrl);
    await updateLog(`Found: ${syllabus.courseTitle} — ${syllabus.modules.length} modules`);

    // Update title and description
    await supabase
      .from("generated_courses")
      .update({
        title: syllabus.courseTitle,
        description: syllabus.courseDescription,
        source_name: syllabus.sourceInstitution,
      })
      .eq("id", courseId);

    // Step 2 & 3: Generate each module's lessons
    const modules: GeneratedModule[] = [];

    for (let mi = 0; mi < syllabus.modules.length; mi++) {
      const mod = syllabus.modules[mi];
      await updateLog(`Step 2/4: Module ${mi + 1}/${syllabus.modules.length}: ${mod.title}`);

      const lessons: GeneratedLesson[] = [];

      for (let li = 0; li < mod.lessonTopics.length; li++) {
        const topic = mod.lessonTopics[li];
        await updateLog(`  Lesson ${li + 1}/${mod.lessonTopics.length}: ${topic}`);

        // Enrich
        const enrichment = await enrichLessonTopic(topic, syllabus.courseTitle);

        // Generate
        const lesson = await generateLesson(
          topic,
          mod.title,
          syllabus.courseTitle,
          syllabus.sourceInstitution,
          enrichment,
          li,
          mi
        );

        lessons.push(lesson);

        // Small delay to avoid rate limits
        await new Promise((r) => setTimeout(r, 500));
      }

      modules.push({
        id: `gen-mod-${mi}`,
        title: mod.title,
        description: mod.description,
        lessons,
      });
    }

    // Step 4: Assemble and store
    await updateLog("Step 3/4: Assembling course...");

    const courseData: GeneratedCourseData = { modules };

    // Pick an icon based on the course topic
    const icon = await pickCourseIcon(syllabus.courseTitle);

    await supabase
      .from("generated_courses")
      .update({
        course_data: courseData,
        icon,
        status: "ready",
        updated_at: new Date().toISOString(),
      })
      .eq("id", courseId);

    await updateLog("Step 4/4: Course ready!");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await updateLog(`ERROR: ${msg}`);
    await supabase
      .from("generated_courses")
      .update({ status: "failed" })
      .eq("id", courseId);
    throw err;
  }
}

async function pickCourseIcon(title: string): Promise<string> {
  const lower = title.toLowerCase();
  if (lower.includes("machine learning") || lower.includes("ai") || lower.includes("deep learning")) return "🤖";
  if (lower.includes("algorithm") || lower.includes("data structure")) return "🧮";
  if (lower.includes("web") || lower.includes("html") || lower.includes("css")) return "🌐";
  if (lower.includes("python")) return "🐍";
  if (lower.includes("javascript") || lower.includes("react") || lower.includes("node")) return "⚡";
  if (lower.includes("database") || lower.includes("sql")) return "🗄️";
  if (lower.includes("security") || lower.includes("crypto")) return "🔐";
  if (lower.includes("system design") || lower.includes("architecture")) return "🏗️";
  if (lower.includes("mobile") || lower.includes("android") || lower.includes("ios")) return "📱";
  if (lower.includes("game")) return "🎮";
  if (lower.includes("cloud") || lower.includes("aws") || lower.includes("devops")) return "☁️";
  if (lower.includes("prompt") || lower.includes("llm")) return "✨";
  return "📚";
}

// ─── Public API: Get generated course as Course type ──────────

import type { Course } from "@/data/types";

export async function getGeneratedCourse(slug: string): Promise<Course | null> {
  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("generated_courses")
    .select("*")
    .eq("slug", slug)
    .eq("status", "ready")
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    icon: data.icon,
    tier: data.tier as "free" | "pro",
    modules: (data.course_data as GeneratedCourseData).modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        content: l.content,
        starterCode: l.starterCode,
        solutionCode: l.solutionCode,
      })),
    })),
  };
}

export async function getAllGeneratedCourses(): Promise<Course[]> {
  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("generated_courses")
    .select("*")
    .eq("status", "ready")
    .or("is_curated.eq.true");

  if (error || !data) return [];

  return data.map((d) => ({
    id: d.id,
    slug: d.slug,
    title: d.title,
    description: d.description,
    icon: d.icon,
    tier: (d.tier || "pro") as "free" | "pro",
    modules: ((d.course_data as GeneratedCourseData)?.modules || []).map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        content: l.content,
        starterCode: l.starterCode,
        solutionCode: l.solutionCode,
      })),
    })),
  }));
}

// Get generation status
export async function getGenerationStatus(courseId: string) {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("generated_courses")
    .select("id, slug, title, status, generation_log, created_at")
    .eq("id", courseId)
    .single();
  return data;
}
