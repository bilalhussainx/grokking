import type { ReactNode } from "react";

export const metadata = {
  title: "My School List — Coach Kairos",
  description: "Manage your college application list",
};

export default function MySchoolsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
