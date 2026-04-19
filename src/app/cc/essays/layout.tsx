import type { ReactNode } from "react";

export const metadata = {
  title: "Essay Studio — Kairos.ai",
  description: "AI-guided essay writing for college applications",
};

export default function EssayLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
