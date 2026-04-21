import type { ReactNode } from "react";

export const metadata = {
  title: "College Counselor — Kairos.ai",
  description: "Your AI-powered college application toolkit",
};

export default function CCLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
