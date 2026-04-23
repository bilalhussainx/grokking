import type { ReactNode } from "react";

export const metadata = {
  title: "College Counselor — KairosLearn",
  description: "Your AI-powered college application toolkit",
};

export default function CCLayout({ children }: { children: ReactNode }) {
  return <div className="kl-surface-app">{children}</div>;
}
