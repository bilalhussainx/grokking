import type { ReactNode } from "react";

export const metadata = {
  title: "Browse Schools — Coach Kairos",
  description: "Search and explore colleges to build your list",
};

export default function SchoolsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
