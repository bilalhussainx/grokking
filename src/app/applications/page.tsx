import type { Metadata } from "next";
import ApplicationBoard from "@/components/applications/ApplicationBoard";

export const metadata: Metadata = {
  title: "Applications · KairosLearn",
  description: "Track every deadline, every component, every status across your full school list.",
};

export default function ApplicationsPage() {
  return <ApplicationBoard />;
}
