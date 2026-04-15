// Essay draft detail — ideation output, in-page draft editor, streamed critique.
// Spec: CollegeVCareers.md SP-10.

import EssayDetailClient from "@/components/essays/EssayDetailClient";

export const metadata = {
  title: "Essay — KairosLearn",
};

export default async function EssayDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EssayDetailClient essayId={id} />;
}
