import type { ReactNode } from "react";

export const metadata = {
  title: "Timeline — Coach Kairos",
  description: "Your college application deadlines and tasks",
};

export default function TimelineLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
