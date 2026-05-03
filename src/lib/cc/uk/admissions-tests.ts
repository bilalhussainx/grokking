// src/lib/cc/uk/admissions-tests.ts
// Registry of UK admissions tests with course-aware matcher.
import tests from "@/data/uk/uk-admissions-tests.json";

export interface AdmissionsTestApplication {
  school: string;
  courses: string[];
}

export interface AdmissionsTest {
  name: string;
  url: string;
  registration_deadline: string;
  test_date: string;
  format: string;
  applies_to: AdmissionsTestApplication[];
}

const REGISTRY = tests as Record<string, AdmissionsTest>;

export const ALL_TEST_CODES = Object.keys(REGISTRY);

export function getAdmissionsTest(code: string): AdmissionsTest | null {
  return REGISTRY[code] ?? null;
}

// Returns the list of admissions tests required for a given (school, course)
// pair. Empty array if no tests required. Match is substring-based on
// course name to handle "Maths" vs "Mathematics" vs "Maths & Statistics".
export function testsForSchoolCourse(
  school: string,
  course: string,
): Array<{ code: string; test: AdmissionsTest }> {
  const courseLower = course.toLowerCase();
  const matches: Array<{ code: string; test: AdmissionsTest }> = [];
  for (const [code, test] of Object.entries(REGISTRY)) {
    for (const app of test.applies_to) {
      if (app.school !== school) continue;
      const hit = app.courses.some(
        (c) =>
          c.toLowerCase().includes(courseLower) ||
          courseLower.includes(c.toLowerCase()),
      );
      if (hit) {
        matches.push({ code, test });
        break;
      }
    }
  }
  return matches;
}
