import type { ReactNode } from "react";
import type { Metadata } from "next";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { token } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/cc/shared/${token}`, { cache: "no-store" });
    if (!res.ok) {
      return {
        title: "Shared Portfolio — KairosLearn",
        description: "Shared college application materials",
      };
    }
    const data = await res.json();
    return {
      title: `${data.studentName}'s College Application Portfolio — KairosLearn`,
      description: "Shared college application materials",
      openGraph: {
        title: `${data.studentName}'s College Application Portfolio — KairosLearn`,
        description: "Shared college application materials",
      },
    };
  } catch {
    return {
      title: "Shared Portfolio — KairosLearn",
      description: "Shared college application materials",
    };
  }
}

export default function SharedLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
