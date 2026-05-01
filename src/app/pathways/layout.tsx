import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Pathways | KairosLearn",
  description:
    "Choose a career pathway and follow a structured learning plan with courses, projects, and interview preparation tailored to your target role.",
};

export default function PathwaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
