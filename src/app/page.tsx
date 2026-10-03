import DaybreakHomepage from "@/components/marketing/daybreak/DaybreakHomepage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "KairosLearn — Your AI college counselor, for every student",
  description:
    "College guidance, at your pace. Find one next step, explore costs and plan your applications. AI interviews, structures and critiques; you write every essay.",
  path: "/",
  absoluteTitle: true,
});

// Signed-out visitors see the admissions homepage. Any session is sent to
// /cc/dashboard by middleware before this renders.
export default function HomePage() {
  return <DaybreakHomepage />;
}
