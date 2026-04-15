// Resume optimizer list + upload.
// Spec: CollegeVCareers.md SP-16.

import ResumesListClient from "@/components/resumes/ResumesListClient";

export const metadata = {
  title: "Resumes — KairosLearn",
  description: "Upload your resume, target a role, get a streamed rewrite with specific changes explained.",
};

export default function ResumesPage() {
  return <ResumesListClient />;
}
