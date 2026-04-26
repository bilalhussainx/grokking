import type { Metadata } from "next";
import DeadlineCalendar from "@/components/applications/DeadlineCalendar";

export const metadata: Metadata = {
  title: "Deadline calendar · KairosLearn",
};

export default function CalendarPage() {
  return <DeadlineCalendar />;
}
