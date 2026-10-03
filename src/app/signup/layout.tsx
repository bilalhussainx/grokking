import type { ReactNode } from "react";
import { PRICING } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create your account",
  description: `Start with a ${PRICING.pro.trialDays}-day Pro trial and ${PRICING.free.signupCredits} AI credits. No card needed. Your AI college admissions counselor for the US, UK and Canada.`,
  path: "/signup",
});

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children;
}
