import DaybreakHomepage from "@/components/marketing/daybreak/DaybreakHomepage";

// Signed-out visitors see the admissions homepage. Any session is sent to
// /cc/dashboard by middleware before this renders.
export default function HomePage() {
  return <DaybreakHomepage />;
}
