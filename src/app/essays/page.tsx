// Essay workbench — list of drafts.
// Spec: CollegeVCareers.md SP-10.

import EssaysListClient from "@/components/essays/EssaysListClient";

export const metadata = {
  title: "Essays — KairosLearn",
  description: "Ideate, draft, and get real feedback on your college application essays.",
};

export default function EssaysPage() {
  return <EssaysListClient />;
}
