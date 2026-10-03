import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

// noindex until the directory lists verified counselors; also kept out of the sitemap.
export const metadata = pageMetadata({
  title: "Find a counselor",
  description: "Search human admissions counselors on KairosLearn by school, service and language.",
  path: "/find-counselor",
  noindex: true,
});

export default function FindCounselorLayout({ children }: { children: ReactNode }) {
  return children;
}
