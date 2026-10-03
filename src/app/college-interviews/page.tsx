// College admissions interview vertical entry point
// Spec: docs/superpowers/specs/2026-04-07-college-admissions-interviews-design.md
import { COACH_LANGUAGE_COUNT } from "@/lib/coach-language-claim";
import { Suspense } from "react";
import CollegeInterviewSetup from "@/components/college/CollegeInterviewSetup";

export const metadata = {
  title: "College Interview Practice — KairosLearn",
  description:
    `Practice your Harvard, Yale, Stanford, MIT, or other Ivy alumni interview with an AI that knows the school. Get feedback in ${COACH_LANGUAGE_COUNT} languages. The interview itself is in English — just like the real one.`,
};

export default function CollegeInterviewsPage() {
  return (
    <Suspense fallback={null}>
      <CollegeInterviewSetup />
    </Suspense>
  );
}
