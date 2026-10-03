import { pageMetadata } from "@/lib/seo";
import type { ReactNode } from "react";

export const metadata = pageMetadata({
  title: "Free Pro access",
  description: "Check if you qualify for free Pro access as a first-generation or low-income student.",
  path: "/pricing/subsidized",
});

export default function SubsidizedLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
