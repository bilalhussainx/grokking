/**
 * Seed course embeddings into Supabase using Gemini embedding-001.
 *
 * Run: npx tsx scripts/seed-embeddings.ts
 *
 * Prerequisites:
 * 1. GEMINI_API_KEY in .env.local
 * 2. SUPABASE_SERVICE_ROLE_KEY in .env.local
 * 3. Run migration 006_course_embeddings.sql in Supabase
 */

import { readFileSync } from "fs";

// Load .env.local manually (no dotenv dependency needed)
try {
  const envFile = readFileSync(".env.local", "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error("Could not read .env.local");
  process.exit(1);
}

// Dynamic import to work with the project's module system
async function main() {
  const mode = process.argv[2] || "courses"; // "courses", "lessons", or "all"
  const { courses } = await import("../src/data/index");
  const { embedCourse, embedLesson } = await import("../src/lib/embeddings");

  if (mode === "courses" || mode === "all") {
    console.log(`Embedding ${courses.length} courses...\n`);
    let success = 0, failed = 0;

    for (const course of courses) {
      try {
        await embedCourse(course);
        console.log(`  ✓ ${course.title}`);
        success++;
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`  ✗ ${course.title}: ${err}`);
        failed++;
      }
    }
    console.log(`\nCourses: ${success} embedded, ${failed} failed.\n`);
  }

  if (mode === "lessons" || mode === "all") {
    console.log("Embedding lessons...\n");
    let success = 0, failed = 0, total = 0;

    for (const course of courses) {
      const domain = course.domain ?? "general";
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          total++;
          try {
            await embedLesson(lesson, course.id, domain, mod.id);
            success++;
            if (success % 20 === 0) console.log(`  ... ${success} lessons embedded`);
            await new Promise((r) => setTimeout(r, 100));
          } catch (err) {
            console.error(`  ✗ ${course.title} > ${lesson.title}: ${err}`);
            failed++;
          }
        }
      }
    }
    console.log(`\nLessons: ${success}/${total} embedded, ${failed} failed.`);
  }
}

main().catch(console.error);
