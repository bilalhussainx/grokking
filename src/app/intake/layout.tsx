import type { ReactNode } from "react";

export const metadata = {
  title: "Coach Kairos — Start Your College Journey",
  description: "Free AI college counselor for first-gen students. No signup required.",
};

export default function IntakeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {children}
    </div>
  );
}
