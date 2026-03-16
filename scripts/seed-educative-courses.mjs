// Seed Educative.io-inspired courses (unique content, not copies)
// These cover the same popular topics but with original lesson content
// Usage: node scripts/seed-educative-courses.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const TAVILY_API_KEY = env.TAVILY_API_KEY;
const MOONSHOT_API_KEY = env.MOONSHOT_API_KEY;
const GEMINI_API_KEY = env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Tavily Search ────────────────────────────────────────────
async function tavilySearch(query, maxResults = 5) {
  if (!TAVILY_API_KEY) return [];
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY, query,
        search_depth: "advanced", max_results: maxResults, include_answer: true,
      }),
    });
    if (!res.ok) { console.error("Tavily error:", res.status); return []; }
    const data = await res.json();
    return (data.results || []).map((r) => ({ title: r.title, url: r.url, content: r.content }));
  } catch (err) { console.error("Tavily failed:", err.message); return []; }
}

// ─── LLM Call ──────────────────────────────────────────────────
async function llmGenerate(systemPrompt, userPrompt) {
  if (MOONSHOT_API_KEY) {
    try {
      const res = await fetch("https://api.moonshot.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOONSHOT_API_KEY}` },
        body: JSON.stringify({
          model: "kimi-k2-turbo-preview",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.4, max_tokens: 4000,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
      }
      console.error("Kimi error:", res.status);
    } catch (err) { console.error("Kimi failed:", err.message); }
  }

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
    } catch (err) { console.error("Gemini failed:", err.message); }
  }

  throw new Error("No LLM available");
}

// ─── Syllabus Discovery ───────────────────────────────────────
async function discoverSyllabus(query, sourceUrl) {
  const searchQuery = sourceUrl
    ? `${query} syllabus curriculum topics site:${new URL(sourceUrl).hostname}`
    : `${query} syllabus curriculum topics modules lessons`;

  const results = await tavilySearch(searchQuery, 8);
  const context = results.map((r) => `[${r.title}]\n${r.content}`).join("\n\n---\n\n");

  const raw = await llmGenerate(
    "You are a curriculum designer creating ORIGINAL course outlines inspired by popular online courses. Do NOT copy proprietary content. Create unique lesson titles and descriptions that teach the same concepts with fresh perspectives. Output valid JSON only.",
    `Create an ORIGINAL structured course outline inspired by: "${query}"

Search results for reference (use for topic ideas only, create original titles):
${context}

Output this exact JSON structure:
{
  "courseTitle": "Original course title (do NOT use trademarked names)",
  "courseDescription": "2-3 sentence description",
  "sourceInstitution": "Grokking Academy",
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
- Use ORIGINAL titles — do NOT copy Educative.io course names or lesson names verbatim
- Cover the same core concepts but with unique framing
- Order from fundamentals to advanced
- Each lesson should be teachable in 15-30 minutes`
  );

  const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

// ─── Lesson Generation ────────────────────────────────────────
async function generateLesson(topic, moduleTitle, courseName, mi, li) {
  const results = await tavilySearch(`${topic} tutorial explanation examples`, 3);
  const context = results.map((r) => r.content).slice(0, 2).join("\n\n");

  const raw = await llmGenerate(
    "You are a course content creator for the Grokking learning platform. Create ORIGINAL lesson content — do not copy from any source. Output valid JSON only.",
    `Generate an ORIGINAL lesson for:
TOPIC: ${topic}
MODULE: ${moduleTitle}
COURSE: ${courseName}

REFERENCE (for accuracy, NOT to copy):
${context}

Output JSON:
{
  "title": "Lesson title",
  "content": "Full markdown lesson content (400-800 words). Include: concept explanation, real-world analogy, code example, common pitfalls, key takeaways. ALL CONTENT MUST BE ORIGINAL.",
  "starterCode": "Python starter code with TODOs (or null if conceptual)",
  "solutionCode": "Complete solution with asserts (or null if conceptual)",
  "hints": ["Hint 1: gentle nudge", "Hint 2: specific technique", "Hint 3: detailed walkthrough"],
  "coachContext": "Key concepts, common mistakes, what to suggest if stuck"
}`
  );

  try {
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const lesson = JSON.parse(cleaned);
    const slug = lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: `gen-m${mi}-l${li}`, slug, title: lesson.title,
      content: lesson.content || "", starterCode: lesson.starterCode || undefined,
      solutionCode: lesson.solutionCode || undefined, hints: lesson.hints || [],
      coachContext: lesson.coachContext || "",
    };
  } catch {
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: `gen-m${mi}-l${li}`, slug, title: topic,
      content: `# ${topic}\n\nThis lesson covers ${topic} as part of ${courseName}.`,
      hints: ["Break the problem into smaller parts.", "Think about data structures.", "Consider edge cases."],
      coachContext: `This lesson covers ${topic}.`,
    };
  }
}

// ─── Icon Selection ───────────────────────────────────────────
function pickIcon(title) {
  const l = title.toLowerCase();
  if (l.includes("machine learning") || l.includes("ai") || l.includes("deep learning") || l.includes("llm")) return "🤖";
  if (l.includes("algorithm") || l.includes("data structure") || l.includes("coding interview") || l.includes("pattern")) return "🧮";
  if (l.includes("system design") || l.includes("scalab") || l.includes("architect")) return "🏗️";
  if (l.includes("web") || l.includes("html") || l.includes("css") || l.includes("frontend")) return "🌐";
  if (l.includes("python")) return "🐍";
  if (l.includes("javascript") || l.includes("react") || l.includes("node") || l.includes("typescript")) return "⚡";
  if (l.includes("database") || l.includes("sql")) return "🗄️";
  if (l.includes("security") || l.includes("crypto")) return "🔐";
  if (l.includes("docker") || l.includes("kubernetes") || l.includes("devops") || l.includes("cloud")) return "☁️";
  if (l.includes("api") || l.includes("microservice")) return "🔌";
  if (l.includes("concurren") || l.includes("thread") || l.includes("parallel")) return "🔀";
  if (l.includes("operating system") || l.includes("linux")) return "🐧";
  if (l.includes("dynamic programming")) return "📐";
  if (l.includes("object") || l.includes("oop") || l.includes("design pattern")) return "🧱";
  if (l.includes("java") && !l.includes("javascript")) return "☕";
  if (l.includes("go ") || l.includes("golang")) return "🐹";
  if (l.includes("rust")) return "🦀";
  return "📚";
}

// ─── Full Course Generation ───────────────────────────────────
async function generateFullCourse(query, sourceUrl) {
  const slug = query.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

  const { data: existing } = await supabase.from("generated_courses").select("id, status").eq("slug", slug).single();
  if (existing?.status === "ready") {
    console.log(`  ✓ Already ready: ${slug}`);
    return existing.id;
  }
  if (existing) {
    await supabase.from("generated_courses").delete().eq("id", existing.id);
  }

  console.log(`  Step 1: Discovering syllabus...`);
  const syllabus = await discoverSyllabus(query, sourceUrl);
  console.log(`  Found: ${syllabus.courseTitle} — ${syllabus.modules.length} modules`);

  const { data: record, error } = await supabase.from("generated_courses").insert({
    slug, title: syllabus.courseTitle, description: syllabus.courseDescription,
    source_url: sourceUrl || null, source_name: syllabus.sourceInstitution || "Grokking Academy",
    is_curated: true, status: "generating", icon: pickIcon(syllabus.courseTitle),
    generation_log: "Generating...\n",
  }).select("id").single();

  if (error) throw new Error(`Insert failed: ${error.message}`);
  const courseId = record.id;

  const modules = [];
  for (let mi = 0; mi < syllabus.modules.length; mi++) {
    const mod = syllabus.modules[mi];
    console.log(`  Step 2: Module ${mi + 1}/${syllabus.modules.length}: ${mod.title}`);

    const lessons = [];
    for (let li = 0; li < mod.lessonTopics.length; li++) {
      const topic = mod.lessonTopics[li];
      process.stdout.write(`    Lesson ${li + 1}/${mod.lessonTopics.length}: ${topic}...`);
      const lesson = await generateLesson(topic, mod.title, syllabus.courseTitle, mi, li);
      lessons.push(lesson);
      console.log(" ✓");
      await new Promise((r) => setTimeout(r, 300));
    }

    modules.push({ id: `gen-mod-${mi}`, title: mod.title, description: mod.description, lessons });
  }

  await supabase.from("generated_courses").update({
    course_data: { modules }, status: "ready", updated_at: new Date().toISOString(),
  }).eq("id", courseId);

  console.log(`  ✓ Course ready! ${modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons total`);
  return courseId;
}

// ─── Educative-Inspired Course List (ORIGINAL titles) ─────────
// Inspired by popular Educative.io topics but with unique course names
const SEED_COURSES = [
  // Coding Patterns (like "Grokking the Coding Interview")
  { query: "Mastering Coding Patterns — Sliding Window, Two Pointers, BFS/DFS, and Beyond" },
  { query: "Grokking Dynamic Programming — From Fibonacci to Advanced Optimization" },

  // System Design (like "Grokking the System Design Interview")
  { query: "Mastering System Design — From URL Shortener to Distributed Database" },
  { query: "Grokking Microservices Architecture — Patterns, Messaging, and Deployment" },

  // OOP & Design Patterns
  { query: "Grokking Object-Oriented Design — SOLID, Patterns, and Real-World Modeling" },

  // DevOps & Cloud
  { query: "Mastering Docker and Kubernetes — Containers, Orchestration, and CI/CD" },
  { query: "Cloud Architecture with AWS — From EC2 to Serverless at Scale" },

  // Language Deep-Dives
  { query: "Advanced Python Mastery — Decorators, Generators, Metaclasses, and Async" },
  { query: "TypeScript Deep Dive — Generics, Type Guards, and Advanced Type System" },
  { query: "Go Programming Mastery — Concurrency, Channels, and Production Patterns" },
  { query: "Rust Systems Programming — Ownership, Lifetimes, and Zero-Cost Abstractions" },

  // Data & ML
  { query: "Hands-On Machine Learning Pipeline — From Data Cleaning to Model Deployment" },
  { query: "Building LLM Applications — RAG, Agents, Fine-Tuning, and Prompt Engineering" },

  // Web & API
  { query: "Modern API Design — REST, GraphQL, gRPC, and WebSocket Patterns" },
  { query: "Full-Stack React and Node.js — From Prototype to Production" },

  // Concurrency & OS
  { query: "Grokking Concurrency — Threads, Locks, Async, and Parallel Patterns" },
  { query: "Operating Systems Internals — Processes, Memory, File Systems, and Scheduling" },

  // Security
  { query: "Web Security Fundamentals — OWASP Top 10, Auth, Encryption, and Hardening" },
];

// ─── Main ─────────────────────────────────────────────────────
console.log(`\n🎓 Seeding ${SEED_COURSES.length} Educative-inspired courses...\n`);

let success = 0;
let failed = 0;

for (let i = 0; i < SEED_COURSES.length; i++) {
  const seed = SEED_COURSES[i];
  console.log(`\n[${i + 1}/${SEED_COURSES.length}] ${seed.query}`);
  try {
    await generateFullCourse(seed.query, seed.sourceUrl);
    success++;
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    failed++;
  }
}

console.log(`\n✅ Done! ${success} succeeded, ${failed} failed out of ${SEED_COURSES.length}\n`);
