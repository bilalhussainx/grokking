import type { ReactNode } from "react";

export const metadata = {
  title: "Recommendations — KairosLearn",
  description: "Manage recommendation letters, generate brag sheets, and draft ask emails",
};

export default function RecommendersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
