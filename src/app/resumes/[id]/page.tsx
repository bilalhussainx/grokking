// Resume detail: parsed view + streamed rewrite for a target role.
// Spec: CollegeVCareers.md SP-16.

import ResumeDetailClient from "@/components/resumes/ResumeDetailClient";

export const metadata = {
  title: "Resume rewrite — KairosLearn",
};

export default async function ResumeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResumeDetailClient id={id} />;
}
