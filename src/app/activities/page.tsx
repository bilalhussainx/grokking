// Activities list (Common-App-style extracurriculars).
// Spec: CollegeVCareers.md SP-2.

import ActivitiesClient from "@/components/activities/ActivitiesClient";

export const metadata = {
  title: "Activities — KairosLearn",
  description: "Your extracurriculars list. Feeds college interview follow-ups.",
};

export default function ActivitiesPage() {
  return <ActivitiesClient />;
}
