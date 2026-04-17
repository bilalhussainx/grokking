import type { ReactNode } from "react";

export const metadata = {
  title: "Glossary — Coach Kairos",
  description: "College admissions terms and definitions",
};

export default function GlossaryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
