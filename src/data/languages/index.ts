// Language Courses Index — Registry for all 16 language courses

import type { LanguageCourse } from "@/data/language-types";

// ── Spanish ──
import { spanishBeginnerCourse } from "./spanish-beginner";
import { spanishIntermediateCourse } from "./spanish-intermediate";
import { spanishAdvancedCourse } from "./spanish-advanced";

// ── French ──
import { frenchBeginnerCourse } from "./french-beginner-v2";
import { frenchIntermediateCourse } from "./french-intermediate";
import { frenchAdvancedCourse } from "./french-advanced";

// ── Hindi ──
import { hindiBeginnerCourse } from "./hindi-beginner";
import { hindiIntermediateCourse } from "./hindi-intermediate";
import { hindiAdvancedCourse } from "./hindi-advanced";

// ── Chinese — Hidden for now (no native Deepgram voice) ──
// import { chineseBeginnerCourse } from "./chinese-beginner";
// import { chineseIntermediateCourse } from "./chinese-intermediate";
// import { chineseAdvancedCourse } from "./chinese-advanced";

// ── English (ESL) ──
import { englishBeginnerCourse } from "./english-beginner";
import { englishIntermediateCourse } from "./english-intermediate";
import { englishAdvancedCourse } from "./english-advanced";

// ── Urdu — Not supported, excluded from build ──
// import { urduA1Course } from "./urdu-a1";

// ── Re-exports ──

// Spanish
export { spanishBeginnerCourse, getSpanishBeginnerLessons, findSpanishBeginnerLesson } from "./spanish-beginner";
export { spanishIntermediateCourse } from "./spanish-intermediate";
export { spanishAdvancedCourse } from "./spanish-advanced";

// French
export { frenchBeginnerCourse, getFrenchBeginnerLessons, findFrenchBeginnerLesson } from "./french-beginner-v2";
export { frenchIntermediateCourse } from "./french-intermediate";
export { frenchAdvancedCourse } from "./french-advanced";

// Hindi
export { hindiBeginnerCourse, getHindiBeginnerLessons, findHindiBeginnerLesson } from "./hindi-beginner";
export { hindiIntermediateCourse } from "./hindi-intermediate";
export { hindiAdvancedCourse } from "./hindi-advanced";

// Chinese — hidden for now

// English (ESL)
export { englishBeginnerCourse, getEnglishBeginnerLessons, findEnglishBeginnerLesson, PRONUNCIATION_FOCUS, GRAMMAR_ERROR_PREDICTION } from "./english-beginner";
export { englishIntermediateCourse } from "./english-intermediate";
export { englishAdvancedCourse } from "./english-advanced";

// Urdu — not supported

// ── Course Registry ──

export const languageCourses: LanguageCourse[] = [
  // Spanish
  spanishBeginnerCourse,
  spanishIntermediateCourse,
  spanishAdvancedCourse,
  // French
  frenchBeginnerCourse,
  frenchIntermediateCourse,
  frenchAdvancedCourse,
  // Hindi
  hindiBeginnerCourse,
  hindiIntermediateCourse,
  hindiAdvancedCourse,
  // English (ESL)
  englishBeginnerCourse,
  englishIntermediateCourse,
  englishAdvancedCourse,
];

// ── Lookup Functions ──

export function getLanguageCourse(slug: string): LanguageCourse | undefined {
  return languageCourses.find((c) => c.slug === slug);
}

export function getCoursesByLanguage(language: string): LanguageCourse[] {
  return languageCourses.filter((c) => c.language === language);
}

export function getAllLanguageCourses(): LanguageCourse[] {
  return languageCourses;
}

export function getSupportedLanguages() {
  const languages = new Map<string, { code: string; name: string; flag: string }>();

  const flags: Record<string, string> = {
    es: "\u{1F1EA}\u{1F1F8}", // Spain
    fr: "\u{1F1EB}\u{1F1F7}", // France
    hi: "\u{1F1EE}\u{1F1F3}", // India
    en: "\u{1F1EC}\u{1F1E7}", // UK
  };

  languageCourses.forEach((course) => {
    if (!languages.has(course.language)) {
      languages.set(course.language, {
        code: course.language,
        name: course.languageName,
        flag: flags[course.language] || "\u{1F310}",
      });
    }
  });

  return Array.from(languages.values());
}

/**
 * Returns courses for a given language sorted by level (beginner → intermediate → advanced).
 */
export function getCourseChain(language: string): LanguageCourse[] {
  const levelOrder: Record<string, number> = {
    A1: 0,
    A2: 1,
    B1: 2,
    B2: 3,
    C1: 4,
    C2: 5,
  };

  return getCoursesByLanguage(language).sort(
    (a, b) => (levelOrder[a.proficiencyLevel] ?? 99) - (levelOrder[b.proficiencyLevel] ?? 99)
  );
}
