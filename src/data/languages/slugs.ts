// Slugs of the language courses, without their lesson content. Lets global
// UI (providers.tsx) ask "is this /course/<slug> a language course?" without
// shipping the whole language library to every page. Kept in sync with
// languageCourses by src/data/languages/__tests__/slugs.test.ts.
export const LANGUAGE_COURSE_SLUGS: ReadonlySet<string> = new Set(["spanish-beginner","spanish-intermediate","spanish-advanced","french-beginner","french-intermediate","french-advanced","hindi-beginner","hindi-intermediate","hindi-advanced","english-beginner","english-intermediate","english-advanced","english-for-spanish-speakers"]);

export const isLanguageCourseSlug = (slug: string): boolean => LANGUAGE_COURSE_SLUGS.has(slug);
