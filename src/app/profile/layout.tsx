import type { ReactNode } from "react";

export const metadata = {
  title: "Your Profile — Coach Kairos",
  description: "Build your college application profile",
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
