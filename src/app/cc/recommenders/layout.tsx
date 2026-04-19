import type { ReactNode } from "react";

export const metadata = {
  title: "Recommendations — Kairos.ai",
  description: "Manage recommendation letters, generate brag sheets, and draft ask emails",
};

export default function RecommendersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
